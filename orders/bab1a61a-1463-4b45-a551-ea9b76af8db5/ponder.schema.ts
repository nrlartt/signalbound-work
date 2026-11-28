import { onchainTable } from "ponder";

const eventTable0 = onchainTable("pairCreateds", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  token0: t.hex().notNull(),
  token1: t.hex().notNull(),
  pair: t.hex().notNull(),
  allPairsLength: t.bigint().notNull(),
}));
export { eventTable0 as pairCreated };
