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
export type Invitation = Schemas["Invitation"];
export type Overview = Schemas["Overview"];
export type NewMerchant = Schemas["NewMerchant"];
export type InviteRequest = Schemas["Invite"];
export type ChangeRequest = Schemas["ChangeRequest"];
export type ChangeRequestList = Schemas["ChangeRequestList"];
export type FeeChange = Schemas["FeeChange"];
export type Activity = Schemas["Activity"];
export type OperatorList = Schemas["Operators"];
export type Permission = Current["permissions"][number];
