# Ryan's agent skills

Reusable skills extracted from building real tools and services.

- **[Agentic service](skills/agentic-service/SKILL.md)** — Turn an existing capability into an agent-accessible paid API with x402, discovery metadata, deployment, and verified artifact delivery.
- **[Accurate animation geometry](skills/accurate-animation-geometry/SKILL.md)** — Animate hinges, perspective, occlusion, and mating surfaces consistently throughout rigid-object motion.

Each folder under `skills/` is a standalone skill. Copy or symlink the folder into your agent's skills directory. For Codex, use `~/.codex/skills/`; invoke `$agentic-service` or `$accurate-animation-geometry` with your task.

The skills preserve your chosen product, hosting, and authorization boundaries. The payment workflow distinguishes testnet verification from mainnet availability, and does not require putting wallet signing secrets on a receive-only service.
