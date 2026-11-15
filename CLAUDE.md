# ZellaPay Admin engineering standards

ZellaPay Admin is part of ZellaPay, a payment aggregator that moves real money
in Gabon. The internal admin console: merchant approval and KYC, risk review, transaction investigation, operator health, reconciliation and audit. A defect here can mislead a merchant about their
money, leak personal data or enable fraud. Write, review and test every change
as production code.

## Where this fits

| Project | Role | Path from here | Dev port |
|---|---|---|---|
| `zellapay` | Backend: ledger, API, all money logic | `../zellapay` | 8080 |
| `zellamerchant` | Merchant dashboard | `../zellamerchant` | 3001 |
| `zellapayadmin` | Internal admin console | `../zellapayadmin` | 3002 |
| `zellaweb` | Public website | `../zellaweb` | 3000 |

This project is `zellapayadmin`. Audience: ZellaPay staff only.
Backend route group: `/admin/*` (staff session).
Authentication: Staff sign in with a WebAuthn passkey or hardware key (required, with two registered) against the backend, from a restricted network. Designed in `../zellapay/docs/design/08` to `11`; the OpenAPI contract is not written yet, so do not build against `/admin` until it exists.

The full map, the integration contract and local setup live in the backend
repository: `../zellapay/docs/ecosystem/`. If a sibling folder is missing,
say so; do not guess its contents.

## Read first

1. `AGENTS.md`: this is a newer Next.js than most training data. Read the
   relevant guide in `node_modules/next/dist/docs/` before writing code.
2. `docs/architecture.md`, `docs/security.md` and `docs/api-integration.md`.
3. `../zellapay/docs/ecosystem/README.md` and `integration-contract.md`.
4. `../zellapay/api/openapi.yaml` for what the backend actually offers.

## Hard limits (enforced by `pnpm check` and CI)

- A file never exceeds 300 lines. Aim for under 200. Applies to code, styles,
  Markdown and JSON. Generated files start with `Code generated` and are exempt.
- A TypeScript line never exceeds 100 characters. A comment line never
  exceeds 80.
- A function stays under 60 lines. React components too: split them.
- Cyclomatic complexity per function stays under 10. Nesting depth under 4.
- A function takes at most 4 parameters. Components take one props object.
- No `any`. No `@ts-ignore`. No `eslint-disable` without a linked issue.
- No `console.log`. Use the project logger on the server, nothing in the browser.
- Never raise a limit or add an exemption to pass a check. Refactor instead.

## Stack

Next.js 16.4 (App Router) with React 19, TypeScript in strict mode,
Tailwind CSS 4 and pnpm 10. Node 20 or newer. `next.config.ts` enables
`cacheComponents` and `partialPrefetching`.

Planned, added with the first feature that needs each: `zod` for validation,
`openapi-typescript` for the API client, Vitest and Testing Library for unit
and component tests, Playwright and axe for end-to-end and accessibility tests.

## Shared kits

Components and tokens come from `@zellapay/ui` (`../zellaui`); plumbing (forms,
translations, API client, session cookie, CSP, proxy, page frames) from
`@zellapay/app-kit` (`../zellakit`). Never copy or rewrite what they provide;
read their `CLAUDE.md` first. After changing a kit run `pnpm sync:kits`.

## Architecture rules

- Feature folders. Each business capability owns a folder under `features/`
  with its components, actions, queries, schemas and types. See
  `docs/architecture.md` for the layout.
- Dependencies point inward: `app` uses `features`, which use `lib` and
  `components`. `lib` never imports `features`. `components/ui` knows nothing
  about the business. A feature never imports another feature's internals.
- One data access layer, in `lib/`, marked `server-only`. All reads and writes
  go through it. It authenticates, authorizes and shapes data for the client.
- Types come from the generated API client, never hand-copied. Validate
  anything that crosses a trust boundary with a schema.
- No `utils`, `helpers`, `common` or `misc` folders. Name modules after what
  they provide.
- Side effects (time, randomness, network) are injected or isolated so logic
  can be tested without them.

## Next.js 16 rules

This version differs from older Next.js. Read the matching guide in
`node_modules/next/dist/docs/` before writing code that touches routing,
caching, forms or authentication. Do not rely on memory.

- Routes are thin. `app/` holds `page.tsx`, `layout.tsx`, `loading.tsx`,
  `error.tsx` and route handlers only. Logic lives in `features/` and `lib/`.
- Server Components by default. Add `'use client'` only to the smallest
  component that needs state, effects or browser APIs.
- With `cacheComponents` on, request-time reads such as `cookies()` and
  `headers()` must sit behind a `<Suspense>` boundary. Reading them outside
  one is a build error. Wrap them in a component, not a whole page.
- Cache deliberately with `use cache`. Anything derived from a session uses
  `use cache: private` or passes an extracted value such as a user ID into a
  shared cache. Never cache one user's data where another can read it.
- `proxy.ts` replaces middleware. Use it only for cheap optimistic checks and
  redirects. It is not an authorization layer and must not fetch slow data.
- Route Handlers are public HTTP endpoints. Authenticate and validate in each.
- Server Actions are public endpoints too. Validate input, authorize the
  caller and return only safe values, every time.
- Import `server-only` in every module that must never reach the browser.
- Use `next/image`, `next/font` and the Metadata API. No raw `<img>` for
  content images and no third-party font links.

## Security

Treat the browser as hostile and every response from a server action or route
handler as public.

- Secrets and tokens live on the server only. Never prefix a secret with
  `NEXT_PUBLIC_`; that publishes it. Never put tokens in `localStorage`,
  `sessionStorage`, URLs or client components.
- Sessions are encrypted, `HttpOnly`, `Secure`, `SameSite=Lax` or stricter
  cookies with short lifetimes and server-side revocation.
- Access control happens in the data access layer on every read and write,
  not in the UI and not only in `proxy.ts`. Hiding a button is not security.
- Validate all input with schemas on the server, including data from your own
  forms. Reject unknown fields. Bound sizes.
- Never use `dangerouslySetInnerHTML`. Never build HTML, URLs or SQL from user
  input. Encode on output.
- Send a strict Content Security Policy with nonces, plus HSTS,
  `X-Content-Type-Options`, `Referrer-Policy` and `frame-ancestors 'none'`.
- Never log tokens, keys, full phone numbers, personal data or raw bodies.
  Mask by default. Do not send personal data to analytics.
- Error messages shown to users are safe and generic. Show the `request_id`
  so support can find the server-side detail.
- Keep dependencies few and pinned. Justify each new one in the pull request.
  Run `pnpm audit` in CI and treat high findings as blocking.
- Details: `docs/security.md`.

## Money, dates and language

- Amounts are integers in the smallest currency unit, exactly as the API
  returns them. Never convert to floating point. Never compute fees,
  balances or totals that matter in the browser; the backend decides.
- Display with `Intl.NumberFormat` using the user's locale and the
  transaction's currency code, for example `fr-GA` and `XAF` gives
  `10 000 FCFA`. Never concatenate currency symbols by hand.
- Timestamps arrive in UTC. Display in the user's time zone, defaulting to
  `Africa/Libreville`, with `Intl.DateTimeFormat`.
- Phone numbers are E.164 in data and masked in display: `+241 07 ** ** 42`.
- French is the primary language, English the second. No user-visible string
  is hard-coded in a component: use message catalogues so both languages and
  later ones work. Set `lang` correctly on the document.

## Accessibility and UI

- Meet WCAG 2.2 AA: semantic HTML, visible focus, full keyboard use, correct
  labels and roles, sufficient contrast, no information by colour alone.
- Support light and dark themes from design tokens in `globals.css`. Never
  hard-code colours in components.
- Every data view has loading, empty, error and success states.
- Design for small screens and slow networks first. Money screens never
  rely on hover.
- Destructive or irreversible actions need a confirmation that names what
  will happen, and are never the default focus.

## Testing

- No change merges without tests. Pure logic gets unit tests. Components get
  behaviour tests with Testing Library. Critical journeys get Playwright tests.
  Pages with forms or money get an axe accessibility check.
- Test what a user sees and does, not implementation details.
- Tests are deterministic: no real network, no real time, no shared state.
  Mock the API at the boundary with typed fixtures from the generated client.
- Test failure paths: API errors, timeouts, empty data, expired sessions.

## Admin console rules

This application can move and stop real money. Hold it to a higher bar.

- **Network.** Reachable only from a private network or an IP allowlist
  enforced at the edge. Application authentication is required on top.
- **Authentication.** MFA is mandatory for every account. Sessions are short:
  15 minutes idle, 8 hours absolute. Sensitive actions re-authenticate.
- **Roles** (planned): `support`, `risk_analyst`, `finance`, `admin`,
  `super_admin`. Least privilege. The backend enforces them.
- **Four eyes.** Sensitive actions need a second approver: payout releases
  above a threshold, merchant limit changes, role changes.
- **Reasons and audit.** Every state-changing action requires a typed reason
  and is recorded by the backend with actor, time, IP and before/after values.
- **No destructive actions.** The ledger is append-only. Corrections are
  reversing entries created by the backend, never edits made here.
- **No impersonation.** Staff never sign in as a merchant. Support uses
  read-only lookup views.
- **Personal data.** Phone numbers and KYC documents are masked by default.
  Revealing one is an explicit, logged action with a reason.
- **Isolation.** `noindex`, no third-party scripts, analytics or external
  fonts, a stricter CSP than the other apps, and cookies scoped to its own host.
- **Data.** Development uses the simulator and fake data only. Never copy
  production data to a developer machine.

## Workflow for Claude

1. Read this file, `AGENTS.md`, the docs listed above and the relevant
   Next.js guide in `node_modules/next/dist/docs/`.
2. State the plan briefly. For anything touching authentication, sessions,
   money display or data access, confirm the approach with the user first.
3. If the change needs a new or changed API, stop: the contract is changed
   first in `../zellapay/api`, in that repository, then clients are regenerated.
4. Keep each change small and focused. One concern per commit.
5. Before declaring done, run `pnpm check`. Report failures plainly. Never
   claim success without running it.
6. Never commit, push or deploy without being asked.
7. Never disable a check, skip a test or weaken a rule to get green.
8. If a rule here conflicts with the request, say so and ask.

## Definition of done

- Behaviour matches the API contract and the design.
- Tests cover success, failure and edge cases and pass.
- `pnpm check` passes: limits, lint, types and tests.
- No secret, token or personal data in code, logs, URLs or client bundles.
- Accessible by keyboard and screen reader, in French and English.
- Docs updated when behaviour, structure or configuration changes.
