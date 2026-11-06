import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 구매액을 또 합산하면 앞 단계 돈을 중복해서 셉니다.
 * 100 + 130 + 150 + 200 = 580 = 100×4 + 30×3 + 20×2 + 50×1. 추가된 금액만 이으면 100 + 30 + 20 + 50 = 200.
 */
const LABEL_W = 92;
const X0 = LABEL_W + 8;
const UNIT = 215 / 200;
const PARTS = [
  { amount: 100, fill: "#16a34a" },
  { amount: 30, fill: "#2563eb" },
  { amount: 20, fill: "#64748b" },
  { amount: 50, fill: "#d97706" },
] as const;
const STARTS = PARTS.map((_, index) => PARTS.slice(0, index).reduce<number>((sum, part) => sum + part.amount, 0));
const ROWS = [
  { name: "농가 출하", total: 100, added: "100" },
  { name: "선별·저장 뒤", total: 130, added: "+30" },
  { name: "운송 뒤", total: 150, added: "+20" },
  { name: "소매 판매", total: 200, added: "+50" },
] as const;

const SCENES = [
  { label: "단계마다 쌓인 금액", summary: "100 · 130 · 150 · 200원", note: "각 줄은 그 단계까지 쌓인 금액입니다(가정). 앞 줄의 칸이 뒷줄에도 그대로 들어 있습니다." },
  { label: "그대로 더하면 틀립니다", summary: "100 + 130 + 150 + 200 = 580원", note: "초록 칸 100원이 네 줄 모두에 들어 있어 네 번 세어집니다. 30원은 세 번, 20원은 두 번, 50원은 한 번입니다. 소비자가 낸 돈은 200원인데 합은 580원이 됩니다." },
  { label: "추가된 금액만 잇습니다", summary: "100 + 30 + 20 + 50 = 200원", note: "각 줄에서 새로 생긴 칸만 남기면 중복이 사라지고 합이 소비자가 낸 200원과 맞습니다." },
] as const;

export default function DoubleCountViz() {
  return (
    <SceneShell
      eyebrow="중복 세기"
      title="단계마다의 금액을 더하면 같은 돈을 여러 번 셉니다"
      description="같은 한 단위의 금액입니다(가정). 색이 같은 칸은 같은 돈이고 폭은 금액에 비례합니다."
      ariaLabel="단계별 누적 금액을 그대로 더한 580원과 추가된 금액만 이은 200원의 비교"
      scenes={SCENES}
      render={(scene) => (
        <svg viewBox="0 0 360 164" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[scene].label}: ${SCENES[scene].summary}`}>
          {ROWS.map((row, rowIndex) => {
            const y = 6 + rowIndex * 38;
            return (
              <g key={row.name}>
                <text x={LABEL_W} y={y + 18} textAnchor="end" fontSize={13} fontWeight={700} fill="#64748b">{row.name}</text>
                {PARTS.map((part, partIndex) => {
                  if (partIndex > rowIndex) return null;
                  const isNew = partIndex === rowIndex;
                  if (scene === 2 && !isNew) return null;
                  return (
                    <g key={partIndex}>
                      <rect x={X0 + STARTS[partIndex] * UNIT} y={y} width={part.amount * UNIT} height={26} fill={part.fill} stroke="#ffffff" strokeWidth={1} />
                      {scene === 1 && partIndex === 0 && <text x={X0 + 60} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">100 ({rowIndex + 1}번째)</text>}
                    </g>
                  );
                })}
                {scene === 0 && <text x={X0 + row.total * UNIT + 5} y={y + 18} fontSize={13} fontWeight={700} fill="#64748b">{row.total}</text>}
                {scene === 2 && <text x={X0 + row.total * UNIT + 5} y={y + 18} fontSize={13} fontWeight={700} fill="#64748b">{row.added}</text>}
              </g>
            );
          })}
        </svg>
      )}
    />
  );
}
