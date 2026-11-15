import { describe, expect, it } from "vitest";
import { merchantListParams, parseMerchantQuery } from "./query";

describe("parseMerchantQuery", () => {
  it("reads a valid address", () => {
    expect(parseMerchantQuery({ status: "active", q: " shop ", cursor: "abc" })).toEqual({
      status: "active",
      q: "shop",
      cursor: "abc",
    });
  });

  it("drops an unknown status and empty values", () => {
    expect(parseMerchantQuery({ status: "gone", q: "  " })).toEqual({
      status: undefined,
      q: undefined,
      cursor: undefined,
    });
  });

  it("takes the first of repeated values and caps the search", () => {
    const q = parseMerchantQuery({ status: ["suspended", "active"], q: "x".repeat(200) });
    expect(q.status).toBe("suspended");
    expect(q.q).toHaveLength(64);
  });
});

describe("merchantListParams", () => {
  it("leaves out what is not set", () => {
    expect(merchantListParams({ status: "pending" })).toEqual({ status: "pending" });
    expect(merchantListParams({})).toEqual({});
  });
});
