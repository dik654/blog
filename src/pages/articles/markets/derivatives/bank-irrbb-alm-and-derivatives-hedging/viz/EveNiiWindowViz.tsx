import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — 경제가치 장부(EVE)는 미래의 모든 현금흐름을 오늘 가치로,
 * 이익 장부(NII)는 정한 기간(다음 1년) 안의 이자만 본다. 1절 숫자: 이자 차이 3.4 → 2.6(−0.8).
 * 현금흐름 표시는 개수·간격을 정하지 않은 모양이며 눈금은 순서만 나타냅니다. EVE 변화의 크기는 본문에 없어 그리지 않습니다.
 */
const X0 = 34;
const X1 = 340;
const YEAR = 96;
const AXIS_Y = 104;
const FLOWS = [70, 120, 160, 200, 240, 280, 320];

const SCENES = [
  { label: "경제가치 장부", summary: "모든 미래 현금흐름 → 오늘 가치", wide: true, year: false, note: "자산이 들여올 현금과 부채로 나갈 현금을 만기까지 모두 오늘 가치로 바꿔 그 차이를 봅니다. 시장금리가 오르면 오래 고정된 대출의 오늘 가치는 크게 떨어질 수 있습니다." },
  { label: "이익 장부", summary: "다음 1년 이자 차이 3.4 → 2.6", wide: false, year: true, note: "정한 기간 안에 실제로 받을 이자와 낼 이자만 봅니다. 대출 이자 5는 그대로이고 예금 비용이 1.6에서 2.4로 늘어 이 기간의 이자 차이가 0.8 줄어듭니다." },
  { label: "같은 충격, 다른 숫자", summary: "NII −0.8 ≠ EVE 변화", wide: true, year: true, note: "0.8 감소는 순이자이익 관점의 숫자입니다. 경제가치 변화는 기간 밖 현금흐름까지 따로 계산해야 하므로 같은 숫자가 아니며, 이 글은 그 값을 제시하지 않습니다." },
] as const;

export default function EveNiiWindowViz() {
  return (
    <SceneShell
      eyebrow="두 장부"
      title="같은 금리 충격을 보는 시간 범위가 다릅니다"
      description="가로축은 오늘부터 먼 미래까지의 시간이고, 위 표시는 자산(대출)에서 들어올 현금, 아래 표시는 부채(예금)로 나갈 현금입니다. 표시의 개수와 간격은 설명용이며 눈금은 순서만 나타냅니다(가정)."
      ariaLabel="경제가치 장부와 이익 장부가 보는 시간 범위 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {scene.wide && (
                <rect x={X0} y={44} width={X1 - X0} height={120} rx={8} fill="#2563eb" fillOpacity={index === 2 ? 0.04 : 0.08} stroke="#2563eb" strokeWidth={1} strokeDasharray={index === 2 ? "4 3" : undefined} />
              )}
              {scene.year && (
                <rect x={X0} y={44} width={YEAR - X0} height={120} rx={6} fill="#d97706" fillOpacity={0.12} stroke="#d97706" strokeWidth={1.25} />
              )}
              <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} />
              {FLOWS.map((x) => (
                <g key={x}>
                  <line x1={x} x2={x} y1={AXIS_Y} y2={AXIS_Y - 24} stroke="#16a34a" strokeWidth={1.25} />
                  <polygon points={`${x},${AXIS_Y - 28} ${x - 4},${AXIS_Y - 21} ${x + 4},${AXIS_Y - 21}`} fill="#16a34a" />
                  <line x1={x} x2={x} y1={AXIS_Y} y2={AXIS_Y + 20} stroke="#b45309" strokeWidth={1.25} />
                  <polygon points={`${x},${AXIS_Y + 24} ${x - 4},${AXIS_Y + 17} ${x + 4},${AXIS_Y + 17}`} fill="#b45309" />
                </g>
              ))}
              <text x={X0} y={186} fontSize={12} fill="#475569" textAnchor="middle">오늘</text>
              <line x1={YEAR} x2={YEAR} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#64748b" strokeWidth={1} />
              <text x={YEAR} y={186} fontSize={12} fill="#475569" textAnchor="middle">1년</text>
              <text x={X1} y={186} fontSize={12} fill="#475569" textAnchor="end">만기까지</text>
              <text x={X1 - 4} y={60} fontSize={11} fill="#15803d" textAnchor="end">자산 유입</text>
              <text x={X1 - 4} y={156} fontSize={11} fill="#b45309" textAnchor="end">부채 유출</text>
              {scene.wide && (
                <text x={200} y={34} fontSize={12} fontWeight={700} fill="#2563eb" textAnchor="middle">경제가치: 전부 오늘 가치로 바꿔 차이</text>
              )}
              {scene.year && !scene.wide && (
                <text x={X0} y={34} fontSize={12} fontWeight={700} fill="#b45309">이익: 이 기간 안의 이자만</text>
              )}
            </svg>
            <div className="mt-2 grid grid-cols-2 gap-2 text-center text-xs">
              <p className={`rounded-lg border p-2 ${scene.year ? "border-[#d97706]" : "border-border text-muted-foreground"}`}>
                <strong className="block">이익(1년)</strong>
                <span className="font-mono">{scene.year ? "5 − 2.4 = 2.6 (−0.8)" : "—"}</span>
              </p>
              <p className={`rounded-lg border p-2 ${scene.wide ? "border-[#2563eb]" : "border-border text-muted-foreground"}`}>
                <strong className="block">경제가치</strong>
                <span>{scene.wide ? "별도 계산 · 본문에 값 없음" : "—"}</span>
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
