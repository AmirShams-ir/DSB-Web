function isStrongPassword(password) {

    return (
        password.length >= 12 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password) &&
        /[^A-Za-z0-9]/.test(password)
    );
}

function randomBytes(length) {
    return crypto.getRandomValues(
        new Uint8Array(length)
    );
}

function toHex(bytes) {
    return [...bytes]
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");
}

const salt = randomBytes(16);
const nonce = randomBytes(12);

function concatArrays(...arrays) {

    let total = arrays.reduce(
        (sum, arr) => sum + arr.length,
        0
    );

    let result = new Uint8Array(total);

    let offset = 0;

    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }

    return result;
}

function packPlaintext(seedText) {

    const encoder = new TextEncoder();

    const seedBytes = encoder.encode(seedText);

    const seedLength = seedBytes.length;

    const requiredSize = 2 + seedLength;

    const paddedSize = Math.max(
        512,
        Math.ceil(requiredSize / 256) * 256
    );

    const lengthBytes = new Uint8Array(2);

    lengthBytes[0] = (seedLength >> 8) & 0xff;
    lengthBytes[1] = seedLength & 0xff;

    const padding = randomBytes(
        paddedSize - requiredSize
    );

    return concatArrays(
        lengthBytes,
        seedBytes,
        padding
    );
}

const MAGIC = new Uint8Array([
    0xD5, 0x42, 0x02, 0xA7
]);

const VERSION = 2;
const FLAGS = 0;

function uint32ToBytes(value) {

    const bytes = new Uint8Array(4);

    bytes[0] = (value >>> 24) & 0xff;
    bytes[1] = (value >>> 16) & 0xff;
    bytes[2] = (value >>> 8) & 0xff;
    bytes[3] = value & 0xff;

    return bytes;
}

async function deriveKey(password, salt) {

    const result = await argon2.hash({
        pass: password,
        salt: salt,
        time: 3,
        mem: 65536,
        parallelism: 2,
        hashLen: 32,
        type: argon2.ArgonType.Argon2id
    });

    return result.hash;
}

function buildHeader(
    salt,
    nonce,
    ciphertextLength
) {

    return concatArrays(
        MAGIC,
        new Uint8Array([VERSION]),
        new Uint8Array([FLAGS]),
        salt,
        nonce,
        uint32ToBytes(ciphertextLength)
    );
}

async function encryptSeed(
    seedText,
    password
) {

    const salt = randomBytes(16);

    const nonce = randomBytes(12);

    const payload =
        packPlaintext(seedText);

    const keyBytes =
        await deriveKey(
            password,
            salt
        );

    const cryptoKey =
        await crypto.subtle.importKey(
            "raw",
            keyBytes,
            {
                name: "AES-GCM"
            },
            false,
            ["encrypt"]
        );

    const tempHeader =
        buildHeader(
            salt,
            nonce,
            payload.length + 16
        );

    const encrypted =
        await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: nonce,
                additionalData: tempHeader
            },
            cryptoKey,
            payload
        );

    const ciphertext =
        new Uint8Array(encrypted);

    const finalHeader =
        buildHeader(
            salt,
            nonce,
            ciphertext.length
        );

    return concatArrays(
        finalHeader,
        ciphertext
    );
}

function downloadFile(
    bytes,
    filename
) {

    const blob =
        new Blob(
            [bytes],
            {
                type:
                "application/octet-stream"
            }
        );

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = filename;

    document.body.appendChild(a);

    a.click();

    a.remove();

    URL.revokeObjectURL(url);
}

document
    .getElementById("encrypt-btn")
    .addEventListener(
        "click",
        async () => {

            try {

                const inputs =
                    document.querySelectorAll(
                        "#seed-grid input"
                    );

                const words = [];

                for (
                    let i = 0;
                    i < 24;
                    i++
                ) {

                    const word =
                        inputs[i]
                        .value
                        .trim()
                        .toLowerCase();

                    if (!word) {

                        alert(
                            `Word ${i + 1} is empty`
                        );

                        return;
                    }

                    words.push(word);
                }

                const optionalWord =
                    inputs[24]
                    .value
                    .trim();

                if (optionalWord) {
                    words.push(optionalWord);
                }

                const password =
                    document
                    .getElementById(
                        "password"
                    )
                    .value;

                const confirmPassword =
                    document
                    .getElementById(
                        "confirm-password"
                    )
                    .value;

                if (
                    password !==
                    confirmPassword
                ) {

                    alert(
                        "Passwords do not match"
                    );

                    return;
                }

                if (
                    !isStrongPassword(
                        password
                    )
                ) {

                    alert(
                        "Password must contain at least 12 characters, uppercase, lowercase, number and special character"
                    );

                    return;
                }

                const seedText =
                    words.join("|");

                const file =
                    await encryptSeed(
                        seedText,
                        password
                    );

                downloadFile(
                    file,
                    "seed.bin"
                );

                document.getElementById("password").value = "";
                document.getElementById("confirm-password").value = "";

                alert(
                    "Backup encrypted successfully"
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Encryption failed"
                );
            }
        }
    );

    const HEADER_SIZE = 38;

function bytesToUint32(bytes) {

    return (
        (bytes[0] << 24) |
        (bytes[1] << 16) |
        (bytes[2] << 8) |
        bytes[3]
    ) >>> 0;
}

function arraysEqual(a, b) {

    if (a.length !== b.length) {
        return false;
    }

    for (let i = 0; i < a.length; i++) {

        if (a[i] !== b[i]) {
            return false;
        }
    }

    return true;
}

function parseHeader(fileBytes) {

    if (fileBytes.length < HEADER_SIZE) {
        throw new Error(
            "Invalid encrypted backup"
        );
    }

    const magic =
        fileBytes.slice(0, 4);

    if (
        !arraysEqual(
            magic,
            MAGIC
        )
    ) {

        throw new Error(
            "Unsupported encrypted backup format"
        );
    }

    const version =
        fileBytes[4];

    const flags =
        fileBytes[5];

    if (
        version !== VERSION ||
        flags !== FLAGS
    ) {

        throw new Error(
            "Unsupported encrypted backup format"
        );
    }

    const salt =
        fileBytes.slice(
            6,
            22
        );

    const nonce =
        fileBytes.slice(
            22,
            34
        );

    const ciphertextLength =
        bytesToUint32(
            fileBytes.slice(
                34,
                38
            )
        );

    return {
        salt,
        nonce,
        ciphertextLength,
        header:
            fileBytes.slice(
                0,
                HEADER_SIZE
            )
    };
}

function unpackPlaintext(payload) {

    if (payload.length < 2) {

        throw new Error(
            "Invalid encrypted backup"
        );
    }

    const seedSize =
        (payload[0] << 8) |
        payload[1];

    if (
        seedSize >
        payload.length - 2
    ) {

        throw new Error(
            "Invalid encrypted backup"
        );
    }

    const decoder =
        new TextDecoder();

    return decoder.decode(
        payload.slice(
            2,
            2 + seedSize
        )
    );
}

async function decryptSeed(
    fileBytes,
    password
) {

    const parsed =
        parseHeader(
            fileBytes
        );

    const keyBytes =
        await deriveKey(
            password,
            parsed.salt
        );

    const cryptoKey =
        await crypto.subtle.importKey(
            "raw",
            keyBytes,
            {
                name: "AES-GCM"
            },
            false,
            ["decrypt"]
        );

    const ciphertext =
        fileBytes.slice(
            HEADER_SIZE
        );

    const decrypted =
        await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: parsed.nonce,
                additionalData:
                    parsed.header
            },
            cryptoKey,
            ciphertext
        );

    const payload =
        new Uint8Array(
            decrypted
        );

    return unpackPlaintext(
        payload
    );
}
