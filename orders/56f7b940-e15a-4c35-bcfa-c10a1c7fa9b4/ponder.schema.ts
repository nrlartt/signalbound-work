import { onchainTable } from "ponder";

const eventTable0 = onchainTable("deposits", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  dst: t.hex().notNull(),
  wad: t.bigint().notNull(),
}));
export { eventTable0 as deposit };

const eventTable1 = onchainTable("withdrawals", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  src: t.hex().notNull(),
  wad: t.bigint().notNull(),
}));
export { eventTable1 as withdrawal };
