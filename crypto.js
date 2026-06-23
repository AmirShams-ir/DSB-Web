async function testCrypto() {

    const result = await argon2.hash({
        pass: "TestPassword123!",
        salt: new Uint8Array(16),
        time: 3,
        mem: 65536,
        parallelism: 2,
        hashLen: 32,
        type: argon2.ArgonType.Argon2id
    });

    console.log("Argon2 OK");

    const keyBytes = result.hash;

    const cryptoKey = await crypto.subtle.importKey(
        "raw",
        keyBytes,
        {
            name: "AES-GCM"
        },
        false,
        ["encrypt", "decrypt"]
    );

    console.log("AES-GCM OK");

    console.log(cryptoKey);
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

console.log("Salt:", toHex(salt));
console.log("Nonce:", toHex(nonce));

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

const payload = packPlaintext(
    "abandon|ability|able"
);

console.log(
    "Payload Length:",
    payload.length
);