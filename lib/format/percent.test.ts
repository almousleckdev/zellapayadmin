import { describe, expect, it } from "vitest";
import { bpsToInput, formatBps } from "./percent";

describe("percent", () => {
  it("shows basis points as a percentage", () => {
    expect(formatBps(150)).toBe("1.50 %");
    expect(formatBps(0)).toBe("0.00 %");
    expect(formatBps(10_000)).toBe("100.00 %");
  });

  it("gives the text a form field starts with", () => {
    expect(bpsToInput(25)).toBe("0.25");
  });
});
