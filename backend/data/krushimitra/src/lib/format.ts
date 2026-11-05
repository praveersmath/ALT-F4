// Formatting helpers — Indian number system, currency, dates.

export function formatINR(n: number, decimals = 0): string {
  return (
    "₹" +
    n.toLocaleString("en-IN", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    })
  );
}

export function formatNum(n: number, decimals = 0): string {
  return n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function shortDate(dateStr: string): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${d} ${months[m - 1]}`;
}

export function shortDateKn(dateStr: string): string {
  const [, m, d] = dateStr.split("-").map(Number);
  const months = ["ಜನ","ಫೆಬ್ರ","ಮಾರ್ಚ್","ಏಪ್ರಿ","ಮೇ","ಜೂನ್","ಜುಲೈ","ಆಗ","ಸೆಪ್ಟೆ","ಅಕ್ಟೋ","ನವೆ","ಡಿಸೆ"];
  return `${d} ${months[m - 1]}`;
}

export function pct(n: number, sign = true): string {
  return `${sign && n > 0 ? "+" : ""}${n.toFixed(1)}%`;
}

export function kgToQuintalNote(): string {
  return "1 quintal = 100 kg";
}

/** Clamp helper. */
export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}
