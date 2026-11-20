import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Engineering limits from CLAUDE.md. Keep in step with scripts/check-limits.sh.
const limits = {
  "max-lines": ["error", { max: 300 }],
  "max-lines-per-function": [
    "error",
    { max: 60, skipBlankLines: true, skipComments: true },
  ],
  complexity: ["error", 10],
  "max-depth": ["error", 3],
  "max-params": ["error", 4],
};

const safety = {
  eqeqeq: ["error", "always"],
  "no-console": ["error", { allow: ["warn", "error"] }],
  "@typescript-eslint/no-explicit-any": "error",
  "@typescript-eslint/ban-ts-comment": "error",
  "no-restricted-syntax": [
    "error",
    {
      selector: "JSXAttribute[name.name='dangerouslySetInnerHTML']",
      message: "dangerouslySetInnerHTML is forbidden. See CLAUDE.md, Security.",
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  { rules: { ...limits, ...safety } },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    ".next-e2e/**",
    ".next-preview/**",
    "test-results/**",
    "playwright-report/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "lib/api/generated/**",
  ]),
]);

export default eslintConfig;
