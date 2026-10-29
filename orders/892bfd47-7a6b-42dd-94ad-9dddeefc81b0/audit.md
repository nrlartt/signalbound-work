# Consolidated Security Audit – Findings Ranked Worst First

---
## Critical Findings
### 1. Owner can drain the entire vault via `emergencyWithdraw`
OBSERVATION: src/Vault.sol line 100 declares function emergencyWithdraw() public onlyOwner { uint256 amount = totalAssets; balances[msg.sender] -= amount; shares[msg.sender] -= totalShares; totalShares = 0; totalAssets = 0; return amount; } (source: src/Vault.sol lines 100-106)
INFERENCE: The owner can withdraw all assets in a single transaction, zero the accounting state, and reduce only the caller’s own balance and share entries, leaving other users with stale share balances that can no longer be redeemed. (source: src/Vault.sol lines 100-106)
INFERENCE: This constitutes an unrestricted, single‑point‑of‑failure control that allows a malicious or compromised owner to expropriate all user funds instantly. (source: src/Vault.sol lines 100-106)
WHY IT MATTERS: Draining the vault violates fund safety and gives the owner unchecked power over user assets, making the contract unsuitable for any trust‑less deployment.
---
### 2. First‑depositor share ratio inconsistency creates disproportionate ownership
OBSERVATION: src/Vault.sol line 42 defines deposit(uint256 amount) where, if totalShares == 0, sharesToMint = amount; otherwise sharesToMint = (amount * PRECISION) / totalAssets. (source: src/Vault.sol lines 42-54)
INFERENCE: The first depositor receives raw asset units as shares, bypassing the PRECISION scaling used for all later deposits. (source: src/Vault.sol lines 42-54)
INFERENCE: This breaks the invariant that 1 share represents a constant proportion of assets, allowing the first depositor (or an attacker who front‑runs the initial state) to obtain a larger claim on future assets than their contribution warrants. (source: src/Vault.sol lines 42-54)
WHY IT MATTERS: The mis‑aligned share/asset ratio can be exploited to capture a disproportionate share of future earnings, constituting a severe economic attack vector.
---
## High Findings
### 3. Deposit and withdraw functions lack any access‑control or rate‑limiting mechanisms
OBSERVATION: src/Vault.sol line 42 declares function deposit(uint256 amount) public … (source: src/Vault.sol line 42)
OBSERVATION: src/Vault.sol line 57 declares function withdraw(uint256 shares) public … (source: src/Vault.sol line 57)
INFERENCE: Both functions are permissionless; any address can call them without caps, pausing, or timelocks. (source: src/Vault.sol lines 42-54, 57-67)
WHY IT MATTERS: An attacker can flood the vault with large deposits or trigger massive withdrawals, manipulating the share price or draining assets if combined with other vulnerabilities.
---
### 4. Withdraw may under‑flow user balances when totalAssets is insufficient
OBSERVATION: src/Vault.sol line 57 subtracts amount from balances[msg.sender] without checking the balance first. (source: src/Vault.sol lines 57-67)
INFERENCE: After an emergencyWithdraw that zeroes totalAssets while leaving some users with non‑zero share balances, a subsequent withdraw will compute amount = 0 but still execute balances[msg.sender] -= amount (safe) – however, if totalAssets is non‑zero but less than the proportional amount owed, the subtraction can under‑flow and revert, trapping the user’s shares. (source: src/Vault.sol lines 57-67)
WHY IT MATTERS: Under‑flow reverts block the user’s ability to exit, effectively locking funds and creating a denial‑of‑service condition.
---
### 5. `calculateAssets` can divide by zero when totalShares is zero
OBSERVATION: src/Vault.sol line 87 defines calculateAssets(uint256 shares) returning (shares * totalAssets) / totalShares. (source: src/Vault.sol lines 87-91)
INFERENCE: If totalShares == 0 (e.g., after emergencyWithdraw), the division reverts with a division‑by‑zero error. (source: src/Vault.sol lines 87-91)
WHY IT MATTERS: External callers (including off‑chain bots) that rely on this view function will encounter a revert, breaking price‑feeds or UI components and potentially causing cascading failures.
---
## Medium Findings
### 6. Integer division truncates, leaving “dust” in the vault
OBSERVATION: src/Vault.sol line 42 computes sharesToMint = (amount * PRECISION) / totalAssets using integer division. (source: src/Vault.sol lines 42-54)
OBSERVATION: src/Vault.sol line 57 computes amount = (shares * totalAssets) / totalShares using integer division. (source: src/Vault.sol lines 57-67)
INFERENCE: Both operations round down, causing a small amount of assets or shares to remain undistributed (“dust”) that accumulates over time. (source: src/Vault.sol lines 42-54, 57-67)
WHY IT MATTERS: While not immediately exploitable, the systematic loss erodes depositor value and may be leveraged in long‑term profit‑extraction attacks.
---
### 7. Potential overflow of multiplication on pre‑0.8.0 compilers
OBSERVATION: src/Vault.sol line 42 multiplies amount * PRECISION; line 57 multiplies shares * totalAssets; line 70 (internal _withdraw) repeats the same multiplication. (source: src/Vault.sol lines 42-54, 57-67, 70-76)
INFERENCE: If the contract is compiled with a Solidity version prior to 0.8.0, these multiplications can overflow silently, leading to incorrect share or asset calculations or outright re‑entrancy‑style exploits. (source: src/Vault.sol lines 42-54, 57-67, 70-76)
WHY IT MATTERS: Overflow can break accounting invariants and may be abused to mint excess shares or withdraw more assets than entitled.
---
### 8. `pricePerShare` is a dead state variable
OBSERVATION: src/Vault.sol line 36 declares uint256 public pricePerShare; (source: src/Vault.sol line 36)
OBSERVATION: src/Vault.sol line 94 defines setPricePerShare(uint256 newPrice) public onlyOwner { pricePerShare = newPrice; } (source: src/Vault.sol lines 94-97)
INFERENCE: The variable is never read in deposit, withdraw, or any calculation path, making it effectively unused. (source: src/Vault.sol lines 36, 42-54, 57-67, 79-91, 94-97)
WHY IT MATTERS: Although not a direct vulnerability, the dead variable may mislead integrators into assuming it influences pricing, and future code changes could unintentionally expose a privileged price‑setting vector.
---
### 9. Public getters expose user balances and share holdings
OBSERVATION: src/Vault.sol line 26 declares mapping(address => uint256) public balances; (source: src/Vault.sol line 26)
OBSERVATION: src/Vault.sol line 27 declares mapping(address => uint256) public shares; (source: src/Vault.sol line 27)
INFERENCE: The automatically generated getter functions allow any address to read every user’s balance and share count. (source: src/Vault.sol lines 26-27)
WHY IT MATTERS: This leaks private financial information, which may be undesirable for users seeking confidentiality.
---
## Unknown / Unverifiable Aspects
UNKNOWN: The Solidity pragma (compiler version) is not present in the provided source, so it cannot be confirmed whether overflow checks are automatic (source: I searched the top of src/Vault.sol for a pragma line and found none).
UNKNOWN: The definition of the `onlyOwner` modifier, the `owner` state variable, and any inheritance from OpenZeppelin’s Ownable or AccessControl contracts are not visible, preventing verification of ownership transfer or renouncement mechanisms. (source: I inspected the visible portion of src/Vault.sol for import and inheritance statements and found none.)
UNKNOWN: The provided source ends at line 106; it is unknown whether additional functions, modifiers, or state variables exist beyond this point that could affect the analysis. (source: The last line in the supplied src/Vault.sol text is line 106.)
