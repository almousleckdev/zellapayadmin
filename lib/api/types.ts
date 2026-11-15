import type { components } from "./generated/admin";

type Schemas = components["schemas"];

export type { ApiError, ApiResult } from "@zellapay/app-kit/server";
export type SignedIn = Schemas["SignedIn"];
export type Current = Schemas["Current"];
export type MfaState = Schemas["MFAState"];
export type Passkey = Schemas["Passkey"];
export type PasskeyList = Schemas["PasskeyList"];
export type Merchant = Schemas["Merchant"];
export type MerchantDetail = Schemas["MerchantDetail"];
export type MerchantList = Schemas["MerchantList"];
export type MerchantStatus = Schemas["MerchantStatus"];
export type Permission = Current["permissions"][number];
