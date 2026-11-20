/** Basis points as a percentage, such as 150 -> "1.50 %". */
export function formatBps(bps: number): string {
  return `${(bps / 100).toFixed(2)} %`;
}

/** Basis points as the text a person types, such as 150 -> "1.50". */
export function bpsToInput(bps: number): string {
  return (bps / 100).toFixed(2);
}
