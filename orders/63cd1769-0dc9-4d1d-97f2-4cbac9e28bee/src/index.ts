import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:Deposit", async ({ event, context }) => {
  await context.db.insert(schema.deposit).values({
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
  await context.db.insert(schema.withdrawal).values({
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
