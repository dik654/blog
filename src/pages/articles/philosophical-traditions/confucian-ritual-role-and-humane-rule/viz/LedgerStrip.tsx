/** 곡물 100자루를 폭 그대로 나눈 띠입니다. 3절의 50·20·20·10을 네 몫으로 씁니다. */
const SHARES = [
  { label: "공통 식량", value: 50, color: "#2563eb" },
  { label: "추가 돌봄", value: 20, color: "#16a34a" },
  { label: "다음 철 씨앗", value: 20, color: "#b45309" },
  { label: "운영", value: 10, color: "#475569" },
] as const;

export default function LedgerStrip() {
  return (
    <svg viewBox="0 0 300 30" className="block h-auto w-full" role="img" aria-label="곡물 100자루: 공통 식량 50, 추가 돌봄 20, 다음 철 씨앗 20, 운영 10">
      {SHARES.map((share, index) => {
        const x = SHARES.slice(0, index).reduce((sum, item) => sum + item.value, 0) * 3;
        const width = share.value * 3;
        return (
          <g key={share.label}>
            <rect x={x} y={0} width={width - 1} height={30} fill={share.color} />
            <text x={x + width / 2} y={20} textAnchor="middle" fontSize={14} fontWeight={700} fill="#ffffff">{share.value}</text>
          </g>
        );
      })}
    </svg>
  );
}
