# Event indexer

Indexes OrderCancelled, CounterIncremented events from `0x0000000000000068f116a894984e2db1123eb395` on chain 11155111, starting at block 12200000 and continuing with new blocks. Every event stores its chain, block, timestamp, transaction and log index in a separate queryable table.

## Run

Install the exact dependencies with npm install. Set PONDER_RPC_URL privately to a read-only JSON-RPC endpoint for chain 11155111. Run npm run codegen and npm run typecheck. For local development run npm run dev; the GraphQL endpoint is /graphql on the printed server address. query.json contains a paginated example.

## Production

Use PostgreSQL: set DATABASE_URL privately and give every deployment a unique DATABASE_SCHEMA. Run npm start. Ponder's embedded PGlite database is for local development only. Never commit endpoint credentials or database passwords. Configure your host's health checks, persistent database, backup and resource limits.

## Correctness and limits

Ponder manages ordered event ingestion, persistent progress and chain reorg rollback. The event primary key is Ponder's event.id, not a guessed block-only key. The indexer is read only and holds no signing key. It covers only the declared contract, ABI events and configured block range; no skipped history or offchain actions are implied. Integer values stay bigint, without lossy Number conversion. GraphQL exposes filtering and pagination over the stored event fields; custom aggregation or business logic is outside this bounded generator.

## Verification

Worker checks compare every emitted file to trusted code generation from indexer.json and, when the pinned toolchain is present, run real Ponder codegen and TypeScript typechecking. This package does not claim that customer RPC access, production hosting, all historical events or a production database were exercised.
