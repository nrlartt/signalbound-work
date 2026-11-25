import { ponder } from "ponder:registry";
import schema from "ponder:schema";

ponder.on("Tracked:Attested", async ({ event, context }) => {
  await context.db.insert(schema.attested).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    recipient: event.args.recipient,
    attester: event.args.attester,
    uid: event.args.uid,
    schemaUID: event.args.schemaUID,
  });
});

ponder.on("Tracked:Revoked", async ({ event, context }) => {
  await context.db.insert(schema.revoked).values({
    id: event.id,
    chainId: context.chain.id,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: event.log.logIndex,
    recipient: event.args.recipient,
    attester: event.args.attester,
    uid: event.args.uid,
    schemaUID: event.args.schemaUID,
  });
});
