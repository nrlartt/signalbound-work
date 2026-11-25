import { createConfig } from "ponder";
import { abi } from "./abis/Tracked";

const rpc = process.env.PONDER_RPC_URL;
if (!rpc) throw new Error("Set PONDER_RPC_URL to your chain's read-only JSON-RPC endpoint.");
export default createConfig({
  chains: { target: { id: 11155111, rpc } },
  contracts: { Tracked: { abi, chain: "target", address: "0xc2679fbd37d54388ce493f1db75320d236e1815e", startBlock: 12200000 } },
});
