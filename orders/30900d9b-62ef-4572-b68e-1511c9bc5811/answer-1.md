ANSWER: Offer email/passkey login with an embedded wallet as the default for non-crypto users, with optional Sign-In with Ethereum (EIP-4361) for crypto-native users.

## Observations
OBSERVATION: EIP-4361 defines a standard message format for off-chain authentication where Ethereum accounts sign messages to establish sessions, aiming to provide a self-custodied alternative to centralized identity providers (source: https://eips.ethereum.org/EIPS/eip-4361).
OBSERVATION: EIP-4361's motivation states that users of non-blockchain services typically use centralized identity providers with ultimate control over identifiers, and incentives are often misaligned (source: https://eips.ethereum.org/EIPS/eip-4361).
OBSERVATION: EIP-4361's goals include improved interoperability across off-chain services and consistent machine-readable message formats for wallet vendors to improve user experiences and consent management (source: https://eips.ethereum.org/EIPS/eip-4361).
OBSERVATION: EIP-4361 requires users to hold an Ethereum account, sign messages with a wallet, and manage keys themselves, which is self-custodial (source: https://eips.ethereum.org/EIPS/eip-4361).
OBSERVATION: No source excerpt was provided about email/passkey login, embedded wallets, custody models, compliance obligations, or onboarding conversion metrics (source: only https://eips.ethereum.org/EIPS/eip-4361 was successfully read).

## Reasoning
INFERENCE: Because EIP-4361 is explicitly a self-custodied alternative to centralized IdPs, requiring it only would force non-crypto users to manage wallets and keys before buying NFT tickets, creating friction (source: https://eips.ethereum.org/EIPS/eip-4361).
INFERENCE: Email/passkey with an embedded wallet lowers onboarding conversion barriers for non-crypto users by removing the pre-requirement of owning an Ethereum wallet (source: reasoning from EIP-4361's self-custody framing; no separate source fetched).
INFERENCE: Embedded wallets shift custody to the provider or a custodial model, raising security and compliance considerations compared with self-custodied SIWE (source: reasoning from EIP-4361's self-custody goal; no separate source fetched).
INFERENCE: Offering both lets non-crypto users onboard easily while crypto-native users can self-custody via SIWE, balancing conversion with user sovereignty (source: reasoning from EIP-4361's stated goals; no separate source fetched).

## Limitations
UNKNOWN: Onboarding conversion rates for email/passkey versus SIWE could not be established because no conversion data source was fetched (source: only https://eips.ethereum.org/EIPS/eip-4361 was successfully read).
UNKNOWN: Custody/security trade-offs of embedded wallets could not be established from fetched evidence because no source on embedded wallet architecture or security was read (source: only https://eips.ethereum.org/EIPS/eip-4361 was successfully read).
UNKNOWN: Compliance obligations (e.g., KYC/AML, data protection) for email/passkey embedded wallets versus SIWE could not be established because no compliance source was fetched (source: only https://eips.ethereum.org/EIPS/eip-4361 was successfully read).
UNKNOWN: Whether EIP-4361 remains the appropriate standard in 2026 could not be established because the fetched excerpt contains no 2026 status update beyond its Final Standards Track designation (source: https://eips.ethereum.org/EIPS/eip-4361).

Trade-offs (under 300 words):
1. Onboarding conversion: Email/passkey with embedded wallet lets non-crypto users buy tickets without installing a wallet or holding ETH, likely improving conversion; SIWE-only forces wallet setup upfront, which EIP-4361 frames as self-custodial but adds steps (source: https://eips.ethereum.org/EIPS/eip-4361; conversion impact not empirically sourced).
2. Custody/security: SIWE keeps key control with the user (self-custodied per EIP-4361), reducing platform custody risk but shifting loss risk to users; embedded wallets improve convenience but concentrate custody risk on the provider (source: https://eips.ethereum.org/EIPS/eip-4361; embedded wallet risk not empirically sourced).
3. Compliance: SIWE minimizes personal data collection, aligning with its decentralized identity goal; email/passkey embedded wallets likely trigger KYC/AML and data-protection obligations that were not detailed in any fetched source (source: https://eips.ethereum.org/EIPS/eip-4361; compliance details not empirically sourced).