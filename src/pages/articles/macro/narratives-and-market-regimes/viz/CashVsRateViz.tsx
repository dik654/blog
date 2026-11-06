import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits 둘째 문단. 150÷0.08=1875 → 105÷0.08=1312.5(−562.5) → 105÷0.10=1050(−262.5). 합계 −825.
 * 순서를 바꾸면 150÷0.10=1500(−375) → 1050(−450). 어느 순서를 고를지는 글이 정하지 않아 (가정)으로 표시합니다.
 */
const SCENES = [
  { label: "실적 변화", summary: "150 → 105 · 1875 → 1312.5", path: [1875, 1312.5, null], mid: "105÷0.08", note: "할인율을 8%로 묶고 현금 전망만 바꾼 차이가 −562.5입니다." },
  { label: "돈값 변화", summary: "8% → 10% · 1312.5 → 1050", path: [1875, 1312.5, 1050], mid: "105÷0.08", note: "이번에는 현금을 105로 묶고 할인율만 10%로 되돌린 차이가 −262.5입니다. 실적이 그대로여도 가치가 움직입니다." },
  { label: "순서를 바꾸면", summary: "1875 → 1500 → 1050", path: [1875, 1500, 1050], mid: "150÷0.10", note: "끝값 1050은 같지만 칸의 크기는 −375와 −450으로 달라집니다. 어느 쪽부터 바꿀지는 설명을 위한 선택이므로(가정) 어떤 순서로 나눴는지 함께 적어야 합니다." },
] as const;

const BASE_Y = 142;
const PX = 118 / 1875;
const COL_W = 72;
const COL_X = [30, 144, 258];
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";

export default function CashVsRateViz() {
  return (
    <SceneShell
      eyebrow="두 변화를 따로"
      title="가치가 내린 이유를 실적과 돈값으로 나눠 계산합니다"
      description="막대 높이는 영구 현금을 할인율로 나눈 가치이고, 주황 칸이 그 단계에서 줄어든 양입니다. 숫자는 이 글의 가정입니다."
      ariaLabel="현금 전망 변화와 할인율 변화가 가치를 낮추는 크기를 단계별로 분리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const labels = ["150÷0.08", scene.mid, "105÷0.10"];
        const path: readonly (number | null)[] = scene.path;
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={10} x2={350} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            {path.map((value, index) => {
              const x = COL_X[index];
              if (value === null) {
                return <text key={index} x={x + COL_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fill="#94a3b8">{labels[index]}</text>;
              }
              const height = value * PX;
              const previous = index > 0 ? path[index - 1] : null;
              const drop = previous === null ? 0 : previous - value;
              return (
                <g key={index}>
                  <rect x={x} y={BASE_Y - height} width={COL_W} height={height} fill={BLUE} opacity={0.8} />
                  {drop > 0 && (
                    <>
                      <rect x={x} y={BASE_Y - height - drop * PX} width={COL_W} height={drop * PX} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                      <text x={x + COL_W / 2} y={BASE_Y - height - (drop * PX) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={AMBER}>−{drop}</text>
                    </>
                  )}
                  <text x={x + COL_W / 2} y={BASE_Y - height / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{value}</text>
                  <text x={x + COL_W / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>{labels[index]}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
