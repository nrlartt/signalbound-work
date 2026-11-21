import { createConfig } from "ponder";
import { abi } from "./abis/Tracked";

const rpc = process.env.PONDER_RPC_URL;
if (!rpc) throw new Error("Set PONDER_RPC_URL to your chain's read-only JSON-RPC endpoint.");
export default createConfig({
  chains: { target: { id: 11155111, rpc } },
  contracts: { Tracked: { abi, chain: "target", address: "0x1c7d4b196cb0c7b01d743fbc6116a902379c7238", startBlock: 12170000 } },
});
