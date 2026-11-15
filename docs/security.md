# ZellaPay Admin security

Rules in `CLAUDE.md` apply. This document explains the reasoning and the
patterns to follow.

## Threats to design against

- Compromised staff account: MFA, short sessions, four-eyes approval, audit.
- Insider misuse: reasons, audit log, masked personal data, no impersonation.
- Network exposure: edge allowlist, no public indexing, no third-party scripts.
- Clickjacking and CSRF on high-impact actions.
- Confused deputy: acting on a resource the staff role should not reach.

## Data access layer

All access to the backend goes through modules in `lib/` that start with
`import 'server-only'`. A query or action:

1. Reads the session. No session means redirect or an error result.
2. Checks the caller may do this on this resource.
3. Calls the API with the server-held credential.
4. Returns a minimal object, never the raw API response.

Components never call the API directly and never receive tokens.

## Sessions

Encrypted cookie sessions: `HttpOnly`, `Secure`, `SameSite=Lax` or `Strict`,
short lifetimes, rotation on privilege change and server-side revocation.
`SESSION_SECRET` is at least 32 random bytes and rotates without logging
everyone out by supporting an old and a new key during an overlap.

## Forms and actions

Server Actions and Route Handlers are public endpoints. Validate with a schema
that rejects unknown fields, bound every size, authorize the caller, and
return only safe values. Do not rely on a hidden field or disabled button.
Next.js compares `Origin` to `Host` for actions; keep allowed origins minimal.

## Headers

Set on every response, from `proxy.ts` or `next.config.ts`:

| Header | Value |
|---|---|
| `Content-Security-Policy` | Nonce-based, `default-src 'self'`, no `unsafe-inline` scripts, `frame-ancestors 'none'` |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Deny camera, microphone, geolocation unless needed |

Guide: `node_modules/next/dist/docs/01-app/02-guides/content-security-policy.md`.

## Logging and privacy

Log request ID, route, status and duration. Do not log tokens, keys, full
phone numbers, KYC data, request bodies or full API responses. Mask phone
numbers as `+241 07 ** ** 42`. Do not send personal data to analytics, error
trackers or third parties.

## Dependencies

Few, pinned and justified. Run `pnpm audit` in CI. Review install scripts. Do
not add a dependency to save a few lines of code.

## Reporting

Report suspected vulnerabilities privately to the security contact in the
backend repository's `SECURITY.md`. Do not open public issues for them.
