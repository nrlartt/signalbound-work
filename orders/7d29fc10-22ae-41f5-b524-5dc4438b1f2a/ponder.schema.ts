import { onchainTable } from "ponder";

const eventTable0 = onchainTable("orderCancelleds", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  orderHash: t.hex().notNull(),
  offerer: t.hex().notNull(),
  zone: t.hex().notNull(),
}));
export { eventTable0 as orderCancelled };

const eventTable1 = onchainTable("counterIncrementeds", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  newCounter: t.bigint().notNull(),
  offerer: t.hex().notNull(),
}));
export { eventTable1 as counterIncremented };
