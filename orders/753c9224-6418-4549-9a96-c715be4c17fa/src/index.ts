import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:Transfer", async ({ event, context }) => {
  await context.db.insert(schema.event0).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    from: event.args.from,
    to: event.args.to,
    value: event.args.value,
  });
});

ponder.on("Tracked:Approval", async ({ event, context }) => {
  await context.db.insert(schema.event1).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    owner: event.args.owner,
    spender: event.args.spender,
    value: event.args.value,
  });
});
