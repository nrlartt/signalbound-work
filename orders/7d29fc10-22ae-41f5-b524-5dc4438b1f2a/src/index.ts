import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:OrderCancelled", async ({ event, context }) => {
  await context.db.insert(schema.orderCancelled).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    orderHash: event.args.orderHash,
    offerer: event.args.offerer,
    zone: event.args.zone,
  });
});

ponder.on("Tracked:CounterIncremented", async ({ event, context }) => {
  await context.db.insert(schema.counterIncremented).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    newCounter: event.args.newCounter,
    offerer: event.args.offerer,
  });
});
