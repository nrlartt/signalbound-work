import { onchainTable } from "ponder";

const eventTable0 = onchainTable("attesteds", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  recipient: t.hex().notNull(),
  attester: t.hex().notNull(),
  uid: t.hex().notNull(),
  schemaUID: t.hex().notNull(),
}));
export { eventTable0 as attested };

const eventTable1 = onchainTable("revokeds", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  recipient: t.hex().notNull(),
  attester: t.hex().notNull(),
  uid: t.hex().notNull(),
  schemaUID: t.hex().notNull(),
}));
export { eventTable1 as revoked };
