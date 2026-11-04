OBSERVATION: The Signalbound system manual describes Signalbound agents as NFT-linked identities enabling users to interact on Ethereum and Base networks. Actions are tightly constrained and require explicit confirmation from users, and agents never receive private keys (source: https://signalbound.art/docs).

OBSERVATION: The agent skill file ('skill.md') is the standing instruction document for the deployment, registration, verification, and trait publishing flows of Signalbound agent NFTs. It details endpoints, contract rules, and operational constraints (source: https://signalbound.art/skill.md).

OBSERVATION: The official GitHub repo README for 'signalbound-skill' specifies that every NFT deployed through the system is an agent NFT, structured as an ERC-8004 registration document with optional RESTAP endpoint and an ERC-8048 (ERC-721T) agent profile readable on-chain. The profile publishes the underlying traits used to generate its artwork. It also confirms that 'skill.md' available at https://signalbound.art/skill.md is the canonical primary source (source: https://github.com/nrlartt/signalbound-skill/blob/main/README.md).

OBSERVATION: Listing or minting an NFT collection involves an explicit API prepare/read/sign/confirm process that strictly separates signing intent from execution, with no private keys ever transmitted or stored outside the user's wallet (source: https://signalbound.art/skill.md).

INFERENCE: Signalbound employs a rigorous verification and security protocol, ensuring agent actions cannot access user private keys, and prioritizes explicit user consent for all blockchain writes. This is foundational to all agent NFT collections deployed via Signalbound, based on multiple official sources (source: https://signalbound.art/docs, https://signalbound.art/skill.md, https://github.com/nrlartt/signalbound-skill/blob/main/README.md).

INFERENCE: The inclusion rule for identifying a Signalbound agent NFT collection is:
- The collection must be deployed following the Signalbound agent instruction flow, documented officially in 'skill.md', as an ERC-721 contract with ERC-8004 and ERC-8048 agent registration and profile extensions (source: https://signalbound.art/skill.md, https://github.com/nrlartt/signalbound-skill/blob/main/README.md).

UNKNOWN: Which specific NFT collections or agent identities outside Signalbound follow similar practices could not be established, as only documentation for the Signalbound system was present in the sources (source: All available sources reviewed were specific only to Signalbound; no further comparative data or external registry information was found).

UNKNOWN: The documentation does not address companies building humanoid robots; it is narrowly scoped to the Signalbound agent NFT and contract system (source: All reviewed sources exclusively document Signalbound agent NFT architecture and flows).

## Sources
- https://signalbound.art/docs
- https://signalbound.art/skill.md
- https://github.com/nrlartt/signalbound-skill/blob/main/README.md