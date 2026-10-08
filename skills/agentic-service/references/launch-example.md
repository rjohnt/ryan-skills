# Tested example: animated diagrams

The reference implementation was a separate Node/Express service, not an added endpoint in the agent coordinator. It turned structured `nodes` and `edges` into self-contained SVG and HTML using a deterministic renderer.

- Three layout styles with one schema and one paid operation.
- Fixed examples served freely; custom generation protected by x402.
- Strict input limits, escaped text, no scripts or remote assets in artifacts.
- Requests rendered before payment because work was inexpensive.
- SVG particles illustrated connections and respected reduced motion.
- OpenAPI and `/llms.txt` supported direct agent integration.
- Bazaar metadata declared accurately; catalogue listing was not assumed.
- A dedicated CDP receiving account; no wallet secrets on the diagram server.
- A Railway Docker service with health checks and a generated HTTPS hostname.

Evidence gathered: request-schema failures; escaping; non-overlapping node geometry at the supported maximum; desktop/mobile browser inspection; mock challenge/verification/settlement and failure checks; a real public Base Sepolia purchase; matching same-proof retry response and receipt.

First-version limits: deterministic layout rather than bespoke generated artwork; illustrative animation rather than live state; no MCP/A2A implementation; retry cache bounded to 128 receipts for 30 minutes in one process; public service initially accepted testnet USDC, not mainnet money.

When adapting this pattern to another capability, revisit expensive execution, asynchronous jobs, output retention, data privacy, pricing, and retry persistence. Do not blindly copy diagram-specific limits or its temporary price.
