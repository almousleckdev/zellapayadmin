# ZellaPay Admin API integration

This app calls the backend's `/admin` route group from the Next.js server only. The contract is `../zellapay/api/admin.openapi.yaml`; the typed client is generated from it with `pnpm generate:api`. Features beyond sign-in and passkeys must not invent endpoints: change the contract first.

## Rules

- Only server code calls the ZellaPay API: Server Components, Server Actions
  and Route Handlers, through `lib/api`, which is `server-only`.
- The base URL comes from `ZELLAPAY_API_URL` where the app calls the API.
- Request timeouts are short and explicit. Only `GET` requests are retried
  automatically. A `POST` is retried only with the same `Idempotency-Key`.
- Forward `X-Request-ID` so one request can be traced from browser to ledger.
- Never log request or response bodies.

## Types

Types and the fetch wrapper are generated from the backend contract, not
written by hand. Planned workflow:

```
../zellapay/api/admin.openapi.yaml  ──generate──▶  lib/api/generated/admin.ts
```

Generated files carry a `Code generated` header and are committed. CI
regenerates and fails on any difference. Do not edit them.

## Error mapping

The API returns `{ "error": { "code", "message", "request_id" } }`. The
client layer maps it to a typed result:

| API code | Meaning for the UI |
|---|---|
| `invalid_request` | Show field errors from the validated input |
| `invalid_api_key`, session expiry | Sign out and redirect to login |
| `insufficient_scope`, `merchant_inactive` | Show a permission message |
| `idempotency_key_in_use` | Tell the user the request is still processing |
| `idempotency_key_reused` | Programming error: log it, show a generic error |
| `insufficient_funds` | Show a specific, actionable message |
| anything else | Generic error with the `request_id` |

## Idempotency

Create a fresh `Idempotency-Key` per user intent, on the server, when the form
renders. Reuse it for retries and double clicks. Discard it after a final
response. Do not derive it from data an attacker can predict.

## Pagination and lists

Use the API's keyset pagination: `limit`, `starting_after`, `has_more`,
`next_cursor`. Keep the cursor in the URL. Never fetch everything to sort or
filter in the browser.

## Changing the contract

Contract changes start in `../zellapay/api`. Do not add a call to an endpoint
that is not in the contract, and do not paste response types by hand. If the
contract lacks something this app needs, write down what is missing and ask.

## Local development

Run the backend (`make up` and `make run-api` in `../zellapay`) and point
`ZELLAPAY_API_URL` at `http://localhost:8080`. The backend's operator
simulator produces every payment outcome; its scenarios are selected by the
last two digits of the test phone number.
