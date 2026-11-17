import { onchainTable } from "ponder";

export const event0 = onchainTable("event_0", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  dst: t.hex().notNull(),
  wad: t.bigint().notNull(),
}));

export const event1 = onchainTable("event_1", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  src: t.hex().notNull(),
  wad: t.bigint().notNull(),
}));

export const event2 = onchainTable("event_2", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  src: t.hex().notNull(),
  dst: t.hex().notNull(),
  wad: t.bigint().notNull(),
}));

export const event3 = onchainTable("event_3", (t) => ({
  id: t.text().primaryKey(),
  chainId: t.integer().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.integer().notNull(),
  src: t.hex().notNull(),
  guy: t.hex().notNull(),
  wad: t.bigint().notNull(),
}));
