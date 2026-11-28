import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:PairCreated", async ({ event, context }) => {
  await context.db.insert(schema.pairCreated).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    token0: event.args.token0,
    token1: event.args.token1,
    pair: event.args.pair,
    allPairsLength: event.args.allPairsLength,
  });
});
