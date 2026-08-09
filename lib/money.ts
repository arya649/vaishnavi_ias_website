export function formatPaise(paise: number | null | undefined): string {
  if (paise == null) return "TBD";
  const rupees = paise / 100;
  return `₹${rupees.toLocaleString("en-IN", {
    maximumFractionDigits: rupees % 1 === 0 ? 0 : 2,
  })}`;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}
