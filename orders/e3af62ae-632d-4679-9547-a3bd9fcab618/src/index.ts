import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:IncreaseLiquidity", async ({ event, context }) => {
  await context.db.insert(schema.increaseLiquidity).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    tokenId: event.args.tokenId,
    liquidity: event.args.liquidity,
    amount0: event.args.amount0,
    amount1: event.args.amount1,
  });
});

ponder.on("Tracked:DecreaseLiquidity", async ({ event, context }) => {
  await context.db.insert(schema.decreaseLiquidity).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    tokenId: event.args.tokenId,
    liquidity: event.args.liquidity,
    amount0: event.args.amount0,
    amount1: event.args.amount1,
  });
});
