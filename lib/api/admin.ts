import "server-only";
import { call } from "./client";
import type {
  Activity,
  ApiResult,
  ChangeRequest,
  ChangeRequestList,
  FeeChange,
  OperatorList,
  Current,
  InviteRequest,
  Invitation,
  Merchant,
  MerchantDetail,
  MerchantList,
  MerchantStatus,
  NewMerchant,
  Overview,
  Passkey,
  PasskeyList,
  SignedIn,
} from "./types";

/** Typed calls to the backend's /admin routes. One function per route. */

type Session = { token: string };

/** The options object for `navigator.credentials`, as the backend sends it. */
export type WebAuthnOptions = { publicKey: Record<string, unknown> };

export type ApprovalQuery = { status?: ChangeRequest["status"]; merchantId?: string };

export type MerchantQuery = {
  status?: MerchantStatus;
  q?: string;
  cursor?: string;
  limit?: number;
};

/** The query string for a merchant list, leaving out what is not set. */
function merchantListPath(query: MerchantQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const text = params.toString();
  return text ? `/admin/merchants?${text}` : "/admin/merchants";
}

export const admin = {
  signIn: (b: { email: string; password: string }): Promise<ApiResult<SignedIn>> =>
    call({ method: "POST", path: "/admin/session", body: b }),

  current: (s: Session): Promise<ApiResult<Current>> =>
    call({ method: "GET", path: "/admin/session", ...s }),

  signOut: (s: Session): Promise<ApiResult<void>> =>
    call({ method: "DELETE", path: "/admin/session", ...s }),

  listPasskeys: (s: Session): Promise<ApiResult<PasskeyList>> =>
    call({ method: "GET", path: "/admin/passkeys", ...s }),

  beginRegistration: (s: Session): Promise<ApiResult<WebAuthnOptions>> =>
    call({ method: "POST", path: "/admin/passkeys/begin", ...s }),

  finishRegistration: (
    s: Session,
    b: { label: string; credential: unknown },
  ): Promise<ApiResult<Passkey>> =>
    call({ method: "POST", path: "/admin/passkeys/finish", body: b, ...s }),

  beginLogin: (s: Session): Promise<ApiResult<WebAuthnOptions>> =>
    call({ method: "POST", path: "/admin/session/passkey/begin", ...s }),

  finishLogin: (s: Session, credential: unknown): Promise<ApiResult<void>> =>
    call({ method: "POST", path: "/admin/session/passkey/finish", body: { credential }, ...s }),

  listMerchants: (s: Session, query: MerchantQuery): Promise<ApiResult<MerchantList>> =>
    call({ method: "GET", path: merchantListPath(query), ...s }),

  getMerchant: (s: Session, id: string): Promise<ApiResult<MerchantDetail>> =>
    call({ method: "GET", path: `/admin/merchants/${encodeURIComponent(id)}`, ...s }),

  suspendMerchant: (s: Session, id: string, reason: string): Promise<ApiResult<Merchant>> =>
    call({
      method: "POST",
      path: `/admin/merchants/${encodeURIComponent(id)}/suspend`,
      body: { reason },
      ...s,
    }),

  restoreMerchant: (s: Session, id: string, reason: string): Promise<ApiResult<Merchant>> =>
    call({
      method: "POST",
      path: `/admin/merchants/${encodeURIComponent(id)}/restore`,
      body: { reason },
      ...s,
    }),

  createMerchant: (s: Session, body: NewMerchant): Promise<ApiResult<Merchant>> =>
    call({ method: "POST", path: "/admin/merchants", body, ...s }),

  inviteMerchantUser: (
    s: Session,
    id: string,
    body: InviteRequest,
  ): Promise<ApiResult<Invitation>> =>
    call({
      method: "POST",
      path: `/admin/merchants/${encodeURIComponent(id)}/invitations`,
      body,
      ...s,
    }),

  getOverview: (s: Session, days: number): Promise<ApiResult<Overview>> =>
    call({ method: "GET", path: `/admin/overview?days=${days}`, ...s }),

  requestActivation: (s: Session, id: string, reason: string): Promise<ApiResult<ChangeRequest>> =>
    call({
      method: "POST",
      path: `/admin/merchants/${encodeURIComponent(id)}/activation`,
      body: { reason },
      ...s,
    }),

  requestFees: (s: Session, id: string, body: FeeChange): Promise<ApiResult<ChangeRequest>> =>
    call({
      method: "POST",
      path: `/admin/merchants/${encodeURIComponent(id)}/fees`,
      body,
      ...s,
    }),

  listApprovals: (s: Session, q: ApprovalQuery): Promise<ApiResult<ChangeRequestList>> => {
    const params = new URLSearchParams();
    if (q.status) params.set("status", q.status);
    if (q.merchantId) params.set("merchant_id", q.merchantId);
    return call({ method: "GET", path: `/admin/approvals?${params}`, ...s });
  },

  decide: (
    s: Session,
    id: string,
    verb: "approve" | "reject",
    reason: string,
  ): Promise<ApiResult<ChangeRequest>> =>
    call({
      method: "POST",
      path: `/admin/approvals/${encodeURIComponent(id)}/${verb}`,
      body: { reason },
      ...s,
    }),

  getActivity: (s: Session, id: string): Promise<ApiResult<Activity>> =>
    call({ method: "GET", path: `/admin/merchants/${encodeURIComponent(id)}/activity`, ...s }),

  listOperators: (s: Session): Promise<ApiResult<OperatorList>> =>
    call({ method: "GET", path: "/admin/operators", ...s }),
};
