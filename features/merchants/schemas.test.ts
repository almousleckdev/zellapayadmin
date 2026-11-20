import { describe, expect, it } from "vitest";
import { feeChangeSchema } from "./schemas";

const parse = (fee: string, payoutFee = "1") =>
  feeChangeSchema.safeParse({ fee, payoutFee, reason: "new contract" });

describe("feeChangeSchema", () => {
  it("turns a typed percentage into basis points", () => {
    const r = parse("1.5", "2,25");
    expect(r.success && [r.data.fee, r.data.payoutFee]).toEqual([150, 225]);
  });

  it("accepts the limits", () => {
    expect(parse("0").success).toBe(true);
    expect(parse("100").success).toBe(true);
  });

  it("refuses what is not a percentage from 0 to 100", () => {
    for (const bad of ["", "abc", "-1", "100.01", "101", "1.234", "1e2"]) {
      expect(parse(bad).success, bad).toBe(false);
    }
  });

  it("needs a reason of at least five characters", () => {
    const r = feeChangeSchema.safeParse({ fee: "1", payoutFee: "1", reason: "no" });
    expect(r.success).toBe(false);
  });
});
