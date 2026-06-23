# 🔐 DSB-Web

### Digital Seed Phrase Backup – Web Edition

**A fully offline, dependency-free, browser-based seed phrase backup tool.**

No installation.
No account.
No server.
No cloud.
No telemetry.

Open `index.html` and use it locally.

---

## ✨ Features

* Fully offline operation
* AES-256-GCM authenticated encryption
* Argon2id password-based key derivation
* Binary encrypted backup format (`seed.bin`)
* Optional Word 25 support
* Strong password policy enforcement
* Tamper detection
* Wrong-password detection
* Local-only processing
* Cross-platform compatibility
* Dependency-free deployment

---

## 🌍 Platform Compatibility

DSB-Web is built using standard web technologies:

* HTML5
* CSS3
* JavaScript
* Web Crypto API

It runs on:

* Windows
* Linux
* macOS
* Android
* iPhone / iPad
* ChromeOS

Any modern browser supporting the Web Crypto API can run DSB-Web locally.

---

## 🔌 Zero Installation

DSB-Web requires:

* No Python
* No Node.js
* No npm
* No package manager
* No build process
* No backend server

Simply download the project files and open:

```text
index.html
```

Everything runs directly inside your browser.

---

## 🔒 Fully Offline Operation

DSB-Web performs all cryptographic operations locally.

The application:

* Does not upload seed phrases
* Does not upload passwords
* Does not upload backup files
* Does not use cloud services
* Does not require user accounts
* Does not perform API calls
* Does not send telemetry

Encryption and decryption occur entirely within the browser.

---

## 🧭 Application Flow

```text
Seed Phrase
     ↓
Serialize
     ↓
Argon2id
     ↓
AES-256-GCM
     ↓
seed.bin
```

Recovery:

```text
seed.bin
     ↓
Argon2id
     ↓
AES-256-GCM Verify
     ↓
Seed Phrase
```

---

## 🏗️ Project Structure

```text
DSB-Web/
├── index.html
├── style.css
├── app.js
├── crypto.js
└── README.md
```

---

## 🔑 Password Requirements

Passwords must contain:

* Minimum 12 characters
* At least one uppercase letter
* At least one lowercase letter
* At least one number
* At least one special character

Example:

```text
CorrectHorseBatteryStaple#2026
```

---

## 🛡️ Cryptographic Design

### Key Derivation

Argon2id parameters:

| Parameter   | Value           |
| ----------- | --------------- |
| Variant     | Argon2id        |
| Salt        | 16 random bytes |
| Time Cost   | 3               |
| Memory Cost | 65536 KiB       |
| Parallelism | 2               |
| Key Length  | 32 bytes        |

---

### Encryption

| Property           | Value           |
| ------------------ | --------------- |
| Algorithm          | AES             |
| Mode               | GCM             |
| Key Size           | 256 bits        |
| Nonce              | 12 random bytes |
| Authentication Tag | 16 bytes        |

AES-GCM provides both confidentiality and integrity protection.

Any modification to the encrypted file causes decryption to fail.

---

## 📦 Backup Format

Encrypted backups are stored as:

```text
seed.bin
```

Container structure:

```text
Magic
Version
Flags
Salt
Nonce
Ciphertext Length
Ciphertext
```

The binary format contains no readable seed phrase data.

---

## 🖥️ Usage

### Encrypt

1. Enter the first 24 words.
2. Optionally enter Word 25.
3. Create a strong password.
4. Click Encrypt.
5. Save `seed.bin`.

### Decrypt

1. Select `seed.bin`.
2. Enter the password.
3. Click Decrypt.
4. Recover the seed phrase.

---

## ⚠️ Important Notes

DSB-Web intentionally does not validate BIP39 seed phrases.

This design allows the application to be used with:

* BIP39 wallets
* Wallets with custom recovery phrases
* Legacy wallet systems
* Proprietary wallet implementations

The application stores and recovers data exactly as entered.

Users are responsible for ensuring that their seed phrase is correct.

---

## 🔍 Security Model

DSB-Web protects against:

* Theft of the encrypted backup file
* Accidental exposure of stored backups
* File tampering
* Offline password attacks mitigated through Argon2id

DSB-Web does not protect against:

* Malware
* Keyloggers
* Screen capture software
* Compromised operating systems
* Weak passwords
* Physical observation during recovery

Always perform encryption and recovery on trusted devices.

---

## 🧯 Backup Checklist

* Test recovery before relying on backups
* Use a unique password
* Store the password separately
* Keep multiple backup copies
* Verify every backup periodically
* Prefer offline storage media
* Never upload real backups to public repositories

---

## 🎯 Project Goal

DSB-Web has one purpose:

Protect seed phrases using strong modern cryptography while remaining completely portable, offline, dependency-free, and easy to use.

Open.
Encrypt.
Save.

No installation required.

---

## ⚖️ Disclaimer

This software is provided without warranty.

Cryptocurrency recovery is unforgiving. A forgotten password, damaged storage device, incorrect seed phrase, or operational mistake may result in permanent loss of funds.

Always verify the entire backup and recovery workflow before relying on it with real assets.

---

<div align="center">

### Fully Offline · Dependency-Free · Cross Platform

Built for one job: keep a readable seed phrase out of a readable file.

</div>
