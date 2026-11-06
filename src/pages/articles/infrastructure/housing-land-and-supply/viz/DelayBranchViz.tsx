import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 판매 10억 고정, 지연 비용 0.5억(가정).
 * 기준 5+1+1+3=10 / 토지 미구입 5+1+0.5+1+2.5=10 / 토지 지급 후 5+1+0.5+0.5+3=10.
 */
const UNIT = 33;
const X0 = 15;

type Part = { key: string; label: string; amount: number; color: string };
const part = (key: string, label: string, amount: number, color: string): Part => ({ key, label, amount, color });
const BUILD = part("build", "공사 5억", 5, "#64748b");
const FIN = part("fin", "금융", 1, "#475569");
const DELAY = part("delay", "", 0.5, "#dc2626");

const ROWS = [
  { name: "기준", result: "토지 3억 · 이익 1억", parts: [BUILD, FIN, part("profit", "이익", 1, "#16a34a"), part("land", "토지 3억", 3, "#2563eb")] },
  { name: "토지를 아직 안 샀다면", result: "토지 2.5억 · 이익 1억", parts: [BUILD, FIN, DELAY, part("profit", "이익", 1, "#16a34a"), part("land", "토지 2.5억", 2.5, "#2563eb")] },
  { name: "토지비 3억을 이미 냈다면", result: "토지 3억 · 이익 0.5억", parts: [BUILD, FIN, DELAY, part("profit", "", 0.5, "#16a34a"), part("land", "토지 3억", 3, "#2563eb")] },
] as const;

const SCENES = [
  { label: "지연 전", summary: "10 = 7 + 3", note: "판매 10억 칸을 공사, 금융·허가 등, 정상 이익, 토지가 나눠 씁니다(가정). 이익은 사업자가 요구하는 정상 이익 1억입니다." },
  { label: "지연 5천만 원, 토지 거래 전", summary: "3억 → 2.5억", note: "빨간 칸이 지연으로 늘어난 금융·관리 비용입니다. 땅을 아직 안 샀다면 제안 가격을 낮출 수 있어, 계산상 토지에 남는 칸이 줄어듭니다." },
  { label: "지연 5천만 원, 토지 거래 후", summary: "이익 1억 → 0.5억", note: "이미 낸 3억은 소급해 줄일 수 없습니다. 판매가나 다른 비용이 그대로라면 같은 빨간 칸이 요구했던 이익에서 빠집니다." },
] as const;

export default function DelayBranchViz() {
  return (
    <SceneShell
      eyebrow="누가 지연을 떠안나"
      title="같은 5천만 원이 토지 거래 전후로 다른 칸에서 빠집니다"
      description="한 줄 전체가 판매 10억이고 칸 폭은 금액에 비례합니다. 금액은 모두 가정입니다."
      ariaLabel="지연 비용 5천만 원이 토지 거래 전에는 토지 금액을, 거래 후에는 이익을 줄이는 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {ROWS.map((row, rowIndex) => {
            if (rowIndex > active) return null;
            const y = 8 + rowIndex * 64;
            const starts = row.parts.map((_, index) => row.parts.slice(0, index).reduce<number>((sum, item) => sum + item.amount, 0));
            return (
              <g key={row.name}>
                <text x={X0} y={y + 11} fontSize={13} fontWeight={700} fill="#64748b">{row.name}</text>
                {row.parts.map((item, index) => (
                  <g key={item.key}>
                    <rect x={X0 + starts[index] * UNIT} y={y + 18} width={item.amount * UNIT} height={24} fill={item.color} stroke="#ffffff" strokeWidth={1} />
                    {item.label && (
                      <text x={X0 + (starts[index] + item.amount / 2) * UNIT} y={y + 35} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{item.label}</text>
                    )}
                  </g>
                ))}
                <text x={345} y={y + 11} textAnchor="end" fontSize={13} fontWeight={700} fill="#2563eb">{row.result}</text>
                {rowIndex > 0 && <text x={X0 + 6.25 * UNIT} y={y + 57} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">지연 0.5억</text>}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
