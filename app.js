const seedGrid = document.getElementById("seed-grid");

for (let i = 1; i <= 25; i++) {

    const input = document.createElement("input");

    if (i === 25) {
        input.placeholder = "25 Optional";
    } else {
        input.placeholder = i.toString().padStart(2, "0");
    }

    seedGrid.appendChild(input);
}

document
    .getElementById("decrypt-btn")
    .addEventListener(
        "click",
        async () => {

            try {

                const fileInput =
                    document.getElementById(
                        "backup-file"
                    );

                if (
                    !fileInput.files ||
                    fileInput.files.length === 0
                ) {

                    alert(
                        "Please select a backup file"
                    );

                    return;
                }

                const password =
                    document
                    .getElementById(
                        "decrypt-password"
                    )
                    .value;

                if (!password) {

                    alert(
                        "Enter password"
                    );

                    return;
                }

                const file =
                    fileInput.files[0];

                const buffer =
                    await file.arrayBuffer();

                const fileBytes =
                    new Uint8Array(
                        buffer
                    );

                const seedText =
                    await decryptSeed(
                        fileBytes,
                        password
                    );

                const words =
                    seedText.split("|");

                const inputs =
                    document.querySelectorAll(
                        "#seed-grid input"
                    );

                inputs.forEach(
                    input => {
                        input.value = "";
                    }
                );

                for (
                    let i = 0;
                    i < words.length &&
                    i < 25;
                    i++
                ) {

                    inputs[i].value =
                        words[i];
                }

                document.getElementById(
                    "decrypt-password"
                ).value = "";

                alert(
                    "Backup decrypted successfully"
                );

            } catch (error) {

                console.error(error);

                alert(
                    "Decryption failed"
                );
            }
        }
    );