import { createConfig } from "ponder";
import { abi } from "./abis/Tracked";

const rpc = process.env.PONDER_RPC_URL;
if (!rpc) throw new Error("Set PONDER_RPC_URL to your chain's read-only JSON-RPC endpoint.");
export default createConfig({
  chains: { target: { id: 11155111, rpc } },
  contracts: { Tracked: { abi, chain: "target", address: "0xf62c03e08ada871a0beb309762e260a7a6a880e6", startBlock: 12200000 } },
});
