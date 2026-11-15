# ZellaPay Admin architecture

Status: foundation. Folders below are created when the first feature needs
them; this document is the target layout, not a promise that they exist.

## Purpose

The internal admin console: merchant approval and KYC, risk review, transaction investigation, operator health, reconciliation and audit.

Audience: ZellaPay staff only. Authentication: Staff sign in with a WebAuthn passkey or hardware key (required, with two registered) against the backend, from a restricted network. Designed in `../zellapay/docs/design/08` to `11`; the OpenAPI contract is not written yet, so do not build against `/admin` until it exists.

## Where it sits

```
Browser ──▶ zellapayadmin (Next.js server) ──▶ zellapay API (`/admin/*` (staff session))
```

The browser talks only to this app's own server. The server calls the backend.
Credentials for the backend never reach browser JavaScript. Sibling projects
and their roles: `../zellapay/docs/ecosystem/README.md`.

## Layout

```
app/                    Routes only: page, layout, loading, error, handlers
features/               One folder per business capability
  features/merchants/     Merchant list, approval, KYC review, suspension
  features/risk-review/   Queue of held payouts: approve or reject
  features/transactions/  Search and timeline of any transaction
  features/operators/     Operator health and routing status
  features/reconciliation/Breaks, cases and ambiguous-outcome resolution
  features/audit-log/     Read-only view of the audit trail
  features/staff/         Staff accounts and roles
components/ui/          Design-system primitives, no business knowledge
components/layout/      Shell, navigation, page headers
lib/api/                Server-only API client wrapper and generated types
lib/auth/               Session and data access layer (server-only)
lib/config/             Validated environment variables
lib/format/             Money, date, phone and masking formatters
lib/i18n/               Message catalogue loading
messages/               fr.json and en.json
proxy.ts                Optimistic checks and CSP nonce (not authorization)
instrumentation.ts      Logging, tracing and metrics setup
tests/                  End-to-end tests; unit tests sit beside their code
```

Dependency direction: `app` → `features` → `lib` and `components`. Nothing in
`lib` imports a feature. Features expose a small public surface through an
`index.ts` and are never imported by reaching into their internals.

## Request flow

1. A request reaches `proxy.ts`, which may redirect on cheap, optimistic
   checks such as a missing session cookie. It does not authorize.
2. A Server Component renders the route. Request-time reads, such as the
   session, sit inside `<Suspense>` so the rest of the page prerenders into
   the static shell.
3. The component calls a feature `query`. The query calls the data access
   layer, which verifies the session, checks permission, calls the API through
   the server-only client and returns only the fields the UI needs.
4. Writes are Server Actions. Each validates input with a schema, authorizes
   through the data access layer, calls the API with an idempotency key and
   returns a safe result or a mapped error.

## Rendering and caching

`cacheComponents` and `partialPrefetching` are enabled. Prerender whatever
does not depend on the request. Stream request-dependent parts behind
`<Suspense>`. Use `use cache` for shared, non-personal data and
`use cache: private` for session-derived data. Never cache one user's data
where another can read it. Guides: `node_modules/next/dist/docs/01-app/`.

## State

- Server state comes from Server Components and queries. No client data
  fetching library until a screen proves it needs one.
- Client state is local and small: open dialogs, input values, optimistic UI
  that is clearly marked as pending.
- The URL holds shareable state such as filters, sort and pagination cursor.

## Errors

- Expected failures are mapped from the API error envelope to typed results
  by code. Branch on `error.code`, never on message text.
- Each route segment has `error.tsx` and `loading.tsx`. Not-found uses
  `not-found.tsx`. Error screens show a safe message and the `request_id`.
- Unexpected exceptions are logged on the server with the request ID and
  never shown to the user.

## Internationalisation

French is primary and English secondary. Messages live in `messages/` and are
looked up by key. Dates, numbers and currency use `Intl` with the active
locale, for example `fr-GA`. Layout must tolerate longer French strings.

## Styling

Tailwind CSS 4 with design tokens in `app/globals.css` (colours, spacing,
radii, type scale), light and dark. Components use tokens, never raw colours.
Primitives in `components/ui` are small, accessible and documented by their
props.

## Observability

`instrumentation.ts` configures structured server logs carrying the request
ID, error reporting and tracing that propagate the `X-Request-ID` header to the
backend. Logs never contain secrets or personal data.

## Configuration

Environment variables are read once, validated at startup in `lib/config`, and
typed. Server variables never use `NEXT_PUBLIC_`. See `.env.example`.

## Deployment

A container built from this repository, deployed to Alibaba Cloud Container
Service for Kubernetes behind a load balancer and CDN, with environment values
from the secret manager. One deployment per environment. The pipeline runs
`pnpm check`, builds the image, scans it and promotes through staging.

## Decisions and open questions

- The `/admin` contract is `../zellapay/api/admin.openapi.yaml`; the design is in `../zellapay/docs/design/08` to `11`.
- API client generation (`openapi-typescript`) is chosen but not installed.
- Message catalogue library is not chosen; pick one from the Next.js
  internationalisation guide when the first screen needs it.
