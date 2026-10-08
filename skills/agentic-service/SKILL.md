---
name: agentic-service
description: Package an existing capability as an agent-accessible paid API with x402, discovery metadata, deployment, and verified artifact delivery. Use when converting a tool or service into a pay-per-request agent service.
---

# Agentic service

Produce a callable service that an agent can discover, understand, pay for, and successfully use. Preserve the user's capability and chosen hosting; do not substitute a different product or payment model.

## Define the unit of useful work

Inspect the existing implementation and identify a bounded operation with a concrete result. Prefer structured input and a durable artifact or clear structured response. Make limits, expected duration, failure behavior, and the price per operation explicit. Keep fixed free examples separate from paid custom work.

Expose an input contract (OpenAPI or equivalent), concise agent instructions, a health/status endpoint, and one copyable example. Use plain HTTP as the baseline; add MCP or A2A only when those interfaces are actually implemented. A payment protocol is not an agent communication protocol.

## Add payments and delivery

Read [references/x402.md](references/x402.md) when implementing x402. Verify the current official SDK and facilitator capabilities before configuring a network. Start with a real testnet purchase. Keep testnet and mainnet status visible in the API and catalogue; mock payment tests do not establish on-chain success.

Use a dedicated receiving account when requested. Respect an existing wallet choice; a seller usually needs only a receiving address on the server. Keep wallet creation/signing tools local to the operator. Do not deploy wallet secrets with a receive-only service. Authentication credentials for a facilitator are a separate concern from wallet signing credentials.

Validate requests before asking for payment. For cheap deterministic work, prepare the artifact before charging. For costly or asynchronous work, define what a successful payment buys and ensure failure/cancellation behavior matches that promise. Do not send a paid result before settlement succeeds unless the user explicitly chooses a different payment flow.

Bind retry delivery to the payment proof and exact request/result. A proof must not unlock another result. Document cache lifetime and persistence, and test concurrent retries. Do not automatically authorize a fresh payment after an ambiguous delivery failure.

## Deploy and prove it

Use the user's hosting account and a separate service when chosen. Keep development bypasses on loopback; refuse free custom generation in a production configuration. Exclude credentials and operator wallet files from both upload contexts and deployment images.

Verify the public URL, unpaid payment challenge, a real testnet settlement, returned output, failed-payment behavior, and same-proof retry. Save a receipt and artifact without persisting signing secrets. Keep live-purchase scripts out of automatic unit-test discovery.

For visual products, inspect a rendered artifact and desktop/mobile previews using the user's browser preference. Respect reduced-motion preferences. Follow the target site's analytics opt-out convention during automated visits.

Publish accurate discovery metadata and examples. If using x402 Bazaar, verify whether the facilitator lists the endpoint; declaring metadata is not proof of listing. See [references/launch-example.md](references/launch-example.md) for the tested diagram-service pattern and its limitations.

Conclude with the public URL, verified payment network, reusable contract/example, and any concrete unfinished setup. Distinguish deployed testnet functionality from mainnet availability.
