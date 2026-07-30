---
title: "DSB: Local-First Offline Backup for Cryptocurrency Seed Phrases"

tags:
  - cryptocurrency
  - cryptography
  - seed phrase
  - AES-GCM
  - Argon2id
  - offline security
  - Web Crypto API

authors:
  - name: Amir Shams
    orcid: 0000-0001-9270-4627
    affiliation: "1,2"

affiliations:
 - name: Department of Stem Cells and Regenerative Medicine, National Institute of Genetic Engineering and Biotechnology (NIGEB), Tehran, Iran
   index: 1

 - name: Department of Computer Engineering, Islamic Azad University, Khomeinishahr Branch, Isfahan, Iran
   index: 2

date: 2026-07-31

bibliography: paper.bib
---

# Summary

Digital Seed Phrase Backup (DSB) is an open-source application designed for the secure offline protection of cryptocurrency wallet recovery phrases.

Unlike general-purpose encryption tools, DSB focuses on a single security-critical task: protecting mnemonic seed phrases using modern authenticated cryptography while avoiding cloud services, online accounts, and server-side infrastructure.

The project provides two compatible implementations:

* DSB-App, a desktop application written in Python.
* DSB-Web, a dependency-free browser implementation using the Web Crypto API.

Both implementations perform all cryptographic operations locally and use Argon2id together with AES-256-GCM to provide password-based authenticated encryption.

# Statement of Need

Cryptocurrency wallets rely on recovery seed phrases as the ultimate mechanism for restoring ownership of digital assets.

Although many encryption tools exist, they are designed for protecting arbitrary files rather than seed phrases.

Many users therefore store recovery phrases in plain text documents, cloud storage, screenshots, or password managers, increasing the risk of disclosure.

DSB addresses this gap by providing a dedicated, local-first workflow for protecting recovery phrases using established cryptographic standards without requiring cloud services, user accounts, or Internet connectivity.

The software is intended for researchers, developers, cryptocurrency users, and security professionals seeking a lightweight and transparent solution for secure offline backup.

# Features

- Local-first architecture
- Fully offline operation
- Argon2id password-based key derivation
- AES-256-GCM authenticated encryption
- Compact authenticated binary container
- Desktop implementation (Python/Flet)
- Browser implementation (HTML/JavaScript/Web Crypto API)
- Apache License 2.0