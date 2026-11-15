import { describe, expect, it } from "vitest";
import { catalogues } from "@/tests/catalogues";
import { createTranslate } from "./translate";

const { en, fr } = catalogues;

function paths(node: unknown, prefix = ""): string[] {
  if (typeof node !== "object" || node === null) return [prefix];
  return Object.entries(node).flatMap(([k, v]) => paths(v, prefix ? `${prefix}.${k}` : k));
}

describe("catalogues", () => {
  it("define the same keys in French and English", () => {
    expect(paths(en).sort()).toEqual(paths(fr).sort());
  });

  it("leave no message empty", () => {
    for (const catalogue of [fr, en]) {
      const empty = paths(catalogue).filter((key) => {
        const t = createTranslate(catalogue);
        return t(key as never).trim() === "";
      });
      expect(empty).toEqual([]);
    }
  });

  it("keep the same placeholders in both languages", () => {
    const placeholders = (text: string) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
    const tFr = createTranslate(fr);
    const tEn = createTranslate(en);
    for (const key of paths(fr)) {
      expect(placeholders(tEn(key as never))).toEqual(placeholders(tFr(key as never)));
    }
  });
});

describe("createTranslate", () => {
  const t = createTranslate(en);

  it("fills placeholders", () => {
    expect(t("home.welcome", { name: "Jane" })).toBe("Hello, Jane");
  });

  it("shows the key when a message is missing", () => {
    expect(t("nope.missing" as never)).toBe("nope.missing");
  });
});
