import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pow — 설명용 b=8, T=16, H<T.
 * 칸 하나 = 가능한 hash 출력 하나(0~255). 성공 칸 수 / 256 = p, 평균 시도 = 1/p.
 * T=16 → 16칸, p=1/16, 평균 16번. T=8 → 8칸, p=1/32, 평균 32번.
 * 네 참여자 10·20·30·40회/초 → 합계 100회/초, 평균 16/100 = 0.16초.
 */
const COLS = 16;
const CELLS = 256;
const CELL = 13;
const GX = 8;
const GY = 22;
const PANEL_X = 232;
const STRIP_Y = 260;
const STRIP_W = 344;
const RATES = [
  { name: "A", rate: 10 },
  { name: "B", rate: 20 },
  { name: "C", rate: 30 },
  { name: "D", rate: 40 },
] as const;
const RATE_STARTS = RATES.map((_, index) => RATES.slice(0, index).reduce<number>((sum, item) => sum + item.rate, 0));

const SCENES = [
  { label: "출력 256칸", target: 0, summary: "b=8 → 2⁸ = 256가지", note: "hash는 입력이 조금만 달라도 결과를 예측하기 어려운 고정 길이 함수입니다. 설명용 8비트 hash라면 결과는 0부터 255까지 256가지이고, 칸 하나가 그중 하나입니다. 각 결과가 고르게 나온다고 보는 모형입니다(가정)." },
  { label: "T=16이면", target: 16, summary: "16/256 = 1/16 → 평균 16번", note: "H<T를 성공으로 보면 0부터 15까지 16칸만 성공입니다. 한 번 시도할 때 성공확률은 16/256=1/16이고, 실패하면 같은 조건으로 다시 시도하므로 첫 성공까지 평균 16번이 듭니다." },
  { label: "T=8이면", target: 8, summary: "8/256 = 1/32 → 평균 32번", note: "target을 절반으로 줄이면 성공 칸도 8칸으로 줄어듭니다. 성공확률이 절반이 되므로 평균 시도 수는 두 배인 32번입니다." },
  { label: "초당 100회", target: 16, summary: "16 ÷ 100회/초 = 0.16초", note: "T=16으로 돌아가 네 참여자가 초당 10·20·30·40번씩, 합계 100번 시도한다고 놓습니다(가정). 평균 16번이 걸리므로 0.16초입니다. A의 몫은 100번 중 10번이고 이름을 늘려도 그대로입니다. 네트워크 전파나 난이도 조정을 뺀 단순 모형의 값입니다." },
] as const;

export default function HashTargetGridViz() {
  return (
    <SceneShell
      eyebrow="target 아래 칸 세기"
      title="target이 작을수록 성공 칸이 줄고 평균 시도 수가 늘어납니다"
      description="격자 한 칸이 설명용 8비트 hash의 출력 하나입니다. 색칠한 칸이 H<T를 만족하는 성공 출력입니다(가정)."
      note="b=8, T=16·8, 초당 100회는 계산 흐름을 보이기 위한 가정입니다. 실제 Bitcoin의 비트 폭과 target 경계는 다릅니다."
      ariaLabel="8비트 hash 출력 256칸 중 target 아래 성공 칸과 평균 시도 수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showRate = active === 3;
        const meanTries = scene.target === 0 ? null : CELLS / scene.target;
        return (
          <svg viewBox="0 0 360 308" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={GX} y={14} fontSize={13} fill="#64748b">0</text>
            <text x={GX + COLS * CELL} y={14} textAnchor="end" fontSize={13} fill="#64748b">15</text>
            {Array.from({ length: CELLS }, (_, value) => {
              const ok = value < scene.target;
              return (
                <rect
                  key={value}
                  x={GX + (value % COLS) * CELL + 0.5}
                  y={GY + Math.floor(value / COLS) * CELL + 0.5}
                  width={CELL - 1}
                  height={CELL - 1}
                  rx={1.5}
                  fill={ok ? "#2563eb" : "#e2e8f0"}
                  stroke={ok ? "#1d4ed8" : "#cbd5e1"}
                  strokeWidth={0.5}
                />
              );
            })}
            <text x={GX} y={GY + 16 * CELL + 13} fontSize={13} fill="#64748b">240</text>
            <text x={GX + COLS * CELL} y={GY + 16 * CELL + 13} textAnchor="end" fontSize={13} fill="#64748b">255</text>

            <text x={PANEL_X} y={GY + 10} fontSize={13} fill="#64748b">성공 칸</text>
            <text x={PANEL_X} y={GY + 36} fontSize={24} fontWeight={700} fill={scene.target === 0 ? "#94a3b8" : "#2563eb"}>
              {scene.target === 0 ? "−" : scene.target}
            </text>
            <text x={PANEL_X} y={GY + 54} fontSize={13} fill="#64748b">/ 256칸</text>
            <text x={PANEL_X} y={GY + 84} fontSize={13} fill="#64748b">성공확률 p</text>
            <text x={PANEL_X} y={GY + 102} fontSize={16} fontWeight={700} fill="#0f172a">
              {scene.target === 0 ? "−" : `1/${meanTries}`}
            </text>
            <text x={PANEL_X} y={GY + 132} fontSize={13} fill="#64748b">평균 시도 1/p</text>
            <text x={PANEL_X} y={GY + 150} fontSize={16} fontWeight={700} fill="#0f172a">
              {meanTries === null ? "−" : `${meanTries}번`}
            </text>
            <g fill={scene.target === 0 ? "#94a3b8" : "#475569"} fontSize={13}>
              <rect x={PANEL_X} y={GY + 172} width={10} height={10} rx={1.5} fill="#2563eb" />
              <text x={PANEL_X + 16} y={GY + 181}>H&lt;T 성공</text>
              <rect x={PANEL_X} y={GY + 190} width={10} height={10} rx={1.5} fill="#e2e8f0" stroke="#cbd5e1" strokeWidth={0.5} />
              <text x={PANEL_X + 16} y={GY + 199}>실패, 다시 시도</text>
            </g>

            <g opacity={showRate ? 1 : 0.25}>
              <text x={GX} y={STRIP_Y} fontSize={13} fill="#64748b">초당 시도 100회 (가정)</text>
              {RATES.map((item, index) => {
                const x = GX + (RATE_STARTS[index] / 100) * STRIP_W;
                const w = (item.rate / 100) * STRIP_W;
                return (
                  <g key={item.name}>
                    <rect x={x + 0.5} y={STRIP_Y + 8} width={w - 1} height={18} rx={2} fill={item.name === "A" ? "#d97706" : "#94a3b8"} />
                    <text x={x + w / 2} y={STRIP_Y + 21} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">{item.name} {item.rate}</text>
                  </g>
                );
              })}
              <text x={GX + STRIP_W} y={STRIP_Y + 40} textAnchor="end" fontSize={13} fontWeight={700} fill="#0f172a">
                {showRate ? "평균 16번 ÷ 100회/초 = 0.16초" : "마지막 장면에서 사용"}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
