const COLORS = ["#2563eb", "#d97706", "#7c3aed", "#0f766e"] as const;

export default function MobileGateRows({
  step,
  rows,
  note,
}: {
  step: number;
  rows: readonly (readonly [string, string])[];
  note: string;
}) {
  return (
    <svg className="mt-4 block w-full sm:hidden" viewBox="0 0 300 300" role="img" aria-label={note}>
      {rows.map(([label, detail], index) => {
        const y = 16 + index * 61;
        const color = COLORS[index % COLORS.length];
        return (
          <g key={label} opacity={index <= step ? 1 : 0.3}>
            <rect x="38" y={y} width="224" height="45" rx="9" fill={index === step ? `${color}14` : "#f8fafc"} stroke={index <= step ? color : "#cbd5e1"} />
            <text x="52" y={y + 18} fontSize="9" fontWeight="900" fill={color}>{String(index + 1).padStart(2, "0")} · {label}</text>
            <text x="52" y={y + 35} fontSize="8.2" fill="#64748b">{detail}</text>
          </g>
        );
      })}
      <text x="150" y="280" textAnchor="middle" fontSize="8.2" fontWeight="800" fill="#0f172a">{note}</text>
    </svg>
  );
}
