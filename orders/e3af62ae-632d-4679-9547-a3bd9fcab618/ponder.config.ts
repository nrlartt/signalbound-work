import { createConfig } from "ponder";
import { abi } from "./abis/Tracked";

const rpc = process.env.PONDER_RPC_URL;
if (!rpc) throw new Error("Set PONDER_RPC_URL to your chain's read-only JSON-RPC endpoint.");
export default createConfig({
  chains: { target: { id: 11155111, rpc } },
  contracts: { Tracked: { abi, chain: "target", address: "0x1238536071e1c677a632429e3655c799b22cda52", startBlock: 12200000 } },
});
