import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:Deposit", async ({ event, context }) => {
  await context.db.insert(schema.event0).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    dst: event.args.dst,
    wad: event.args.wad,
  });
});

ponder.on("Tracked:Withdrawal", async ({ event, context }) => {
  await context.db.insert(schema.event1).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    src: event.args.src,
    wad: event.args.wad,
  });
});

ponder.on("Tracked:Transfer", async ({ event, context }) => {
  await context.db.insert(schema.event2).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    src: event.args.src,
    dst: event.args.dst,
    wad: event.args.wad,
  });
});

ponder.on("Tracked:Approval", async ({ event, context }) => {
  await context.db.insert(schema.event3).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    src: event.args.src,
    guy: event.args.guy,
    wad: event.args.wad,
  });
});
