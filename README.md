# ZellaPay Admin

The internal admin console: merchant approval and KYC, risk review, transaction investigation, operator health, reconciliation and audit.

Part of ZellaPay. See `../zellapay/docs/ecosystem/README.md` for how the
four projects connect.

| | |
|---|---|
| Audience | ZellaPay staff only |
| Backend route group | `/admin/*` (staff session) |
| Dev port | 3002 |
| Stack | Next.js 16, React 19, TypeScript, Tailwind CSS 4, pnpm |

## Planned features

- `features/merchants/`: Merchant list, approval, KYC review, suspension
- `features/risk-review/`: Queue of held payouts: approve or reject
- `features/transactions/`: Search and timeline of any transaction
- `features/operators/`: Operator health and routing status
- `features/reconciliation/`: Breaks, cases and ambiguous-outcome resolution
- `features/audit-log/`: Read-only view of the audit trail
- `features/staff/`: Staff accounts and roles

Status: foundation only. Structure, standards and documentation are in place;
features are built against the backend contract as it becomes available.

## Getting started

Requires Node 20 or newer and pnpm 10.

```bash
pnpm install
cp .env.example .env.local   # then fill in values
pnpm dev                     # http://localhost:3002
```

## Scripts

| Command | Purpose |
|---|---|
| `pnpm dev` | Development server on port 3002 |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | TypeScript, no emit |
| `pnpm limits` | File and line length limits |
| `pnpm check` | Limits, lint and types: run before every review |

## Documentation

- [Engineering standards](CLAUDE.md)
- [Architecture](docs/architecture.md)
- [Security](docs/security.md)
- [API integration](docs/api-integration.md)
- [Ecosystem map](../zellapay/docs/ecosystem/README.md)

## License

MIT, as the rest of ZellaPay.
