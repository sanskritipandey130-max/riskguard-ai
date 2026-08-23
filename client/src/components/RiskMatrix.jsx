import React from "react";

/**
 * 5x5 Probability x Impact risk matrix. Plots each risk into its cell.
 * Rows = Probability (1 bottom -> 5 top), Columns = Impact (1 left -> 5 right)
 */
export default function RiskMatrix({ risks = [] }) {
  const cellColor = (p, i) => {
    const score = p * i;
    if (score >= 16) return "bg-red-500/90";
    if (score >= 11) return "bg-orange-400/90";
    if (score >= 6) return "bg-amber-300/90";
    return "bg-emerald-300/80";
  };

  const risksInCell = (p, i) => risks.filter((r) => r.probability === p && r.impact === i);

  const rows = [5, 4, 3, 2, 1];
  const cols = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-3">
      <div className="flex flex-col justify-between items-center py-2 pr-1">
        <span className="text-[10px] font-semibold text-ink-500 uppercase [writing-mode:vertical-rl] rotate-180">
          Probability
        </span>
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-5 gap-1.5">
          {rows.map((p) =>
            cols.map((i) => {
              const cellRisks = risksInCell(p, i);
              return (
                <div
                  key={`${p}-${i}`}
                  className={`relative aspect-square rounded-lg ${cellColor(p, i)} flex items-center justify-center group`}
                  title={cellRisks.map((r) => r.name).join(", ")}
                >
                  {cellRisks.length > 0 && (
                    <span className="text-white text-xs font-bold drop-shadow">{cellRisks.length}</span>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="flex justify-between mt-2 px-1">
          {cols.map((i) => (
            <span key={i} className="text-[10px] font-semibold text-ink-500">
              {i}
            </span>
          ))}
        </div>
        <p className="text-center text-[10px] font-semibold text-ink-500 uppercase mt-1">Impact</p>
      </div>
    </div>
  );
}
