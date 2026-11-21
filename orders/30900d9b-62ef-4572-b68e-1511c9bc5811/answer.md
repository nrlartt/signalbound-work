# Panel Answer

ANSWER: NO AGREEMENT

## What the members answered

OBSERVATION: Member 1 answered: Offer email/passkey login with an embedded wallet as the default for non-crypto users, with optional Sign-In with Ethereum (EIP-4361) for crypto-native users (source: answer-1.md, first line).
OBSERVATION: Member 2 answered: Offer email/passkey login with an embedded wallet alongside Sign-In with Ethereum (EIP-4361); do not use SIWE only (source: answer-2.md, first line).
OBSERVATION: Member 3 answered: Offer email/passkey login with an embedded wallet alongside Sign-In with Ethereum rather than SIWE only, because non-crypto ticketing buyers need familiar onboarding while crypto-native users can keep self-custody (source: answer-3.md, first line).

## Whether they agree

INFERENCE: The three members agree on the recommendation: offer email/passkey login with an embedded wallet alongside SIWE rather than SIWE only (source: answer-1.md, answer-2.md, answer-3.md answer lines).
INFERENCE: Member 1 differs slightly by calling email/passkey the default for non-crypto users, while members 2 and 3 present it as an offered path alongside SIWE without designating a default (source: answer-1.md vs answer-2.md and answer-3.md answer lines).
INFERENCE: All three members list the same top three trade-offs: onboarding conversion, custody/security, and compliance (source: answer-1.md Trade-offs section, answer-2.md Reasoning, answer-3.md Reasoning).

## What could be reproduced
OBSERVATION: All three members cite only one fetched source: https://eips.ethereum.org/EIPS/eip-4361, fetched 2026-11-21, status 200, sha256 0530d2eb496ab9f9061474a68a4b1e280692c46c533f1a5f1541a1a741aed663 (source: sources-answer-1.json, sources-answer-2.json, sources-answer-3.json).
OBSERVATION: Member 1's observations state that EIP-4361 defines a standard message format for off-chain authentication where Ethereum accounts sign messages to establish sessions, aims to provide a self-custodied alternative to centralized identity providers, and requires users to hold an Ethereum account, sign messages with a wallet, and manage keys themselves (source: answer-1.md Observations).
OBSERVATION: Member 2's observations state that ERC-4361 is Final Standards Track, parameterized by scope, session details, and security mechanisms such as a nonce, and that the relying party generates a SIWE message, the wallet presents it for signing with ERC-191, and the relying party verifies the signature and message content before establishing a session (source: answer-2.md Observations).
OBSERVATION: Member 3's observations state that ERC-4361 is Final Standards Track, its goals include a self-custodied alternative to centralized identity providers and improved interoperability, the SIWE workflow uses ERC-191 signed data format, SIWE messages include domain, address, URI, version, chain ID, nonce, issued-at, and optional fields, and security considerations include identifier reuse, key management, replay attacks, phishing attacks, channel security, session invalidation, and maximum lengths for ABNF terms (source: answer-3.md Observations).
INFERENCE: The shared factual basis that can be reproduced is that EIP-4361 is a Final Standards Track ERC for self-custodied off-chain authentication requiring users to hold an Ethereum account and sign messages (source: answer-1.md, answer-2.md, answer-3.md Observations; sources-answer-*.json).
INFERENCE: The shared recommendation can be reproduced: because SIWE-only forces non-crypto users to create a wallet and manage keys before purchasing NFT tickets, offering email/passkey with an embedded wallet alongside SIWE reduces onboarding friction while preserving self-custody for crypto-native users (source: answer-1.md Reasoning, answer-2.md Reasoning, answer-3.md Reasoning).
INFERENCE: The shared trade-offs can be reproduced: (1) onboarding conversion favors email/passkey with embedded wallet for non-crypto users, while SIWE-only adds wallet setup steps; (2) custody/security shifts custody responsibility to the provider with embedded wallets, whereas SIWE keeps keys self-custodied but places security burden on users; (3) compliance likely triggers KYC/AML and data-protection obligations for email/passkey embedded wallets, while SIWE's pseudonymous addresses may reduce some identity collection but do not eliminate ticketing or financial-regulation duties (source: answer-1.md Trade-offs, answer-2.md Reasoning, answer-3.md Reasoning).

## What the panel could not establish
UNKNOWN: Onboarding conversion rates for email/passkey versus SIWE in NFT ticketing apps could not be established because no conversion or user-experience study was fetched by any member (source: answer-1.md Limitations, answer-2.md Limitations, answer-3.md Limitations).
UNKNOWN: Custody and security properties of specific embedded-wallet providers could not be established because no embedded-wallet documentation or security audit was fetched by any member (source: answer-1.md Limitations, answer-2.md Limitations, answer-3.md Limitations).
UNKNOWN: Compliance obligations (KYC, AML, data protection, ticketing regulation) for email/passkey login with embedded wallets in 2026 could not be established because no legal or regulatory source was fetched by any member (source: answer-1.md Limitations, answer-2.md Limitations, answer-3.md Limitations).
UNKNOWN: Whether EIP-4361 remains the dominant SIWE standard in 2026 or has been superseded could not be established because only the ERC-4361 page itself was read (source: answer-1.md Limitations, answer-2.md Limitations, answer-3.md Limitations).
UNKNOWN: No member fetched any source about email/passkey login, embedded wallets, passkeys, consumer NFT ticketing apps, custody architectures, or compliance law, so the recommendation and trade-offs rely on reasoning applied to EIP-4361 rather than sourced evidence for those specific topics (source: answer-1.md Limitations, answer-2.md Limitations, answer-3.md Limitations).

## Signed record of agreement
OBSERVATION: 3 of 3 members agreed on the panel answer (source: answer-1.md, answer-2.md, answer-3.md answer lines).