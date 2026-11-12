import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "../../cross-validation/viz/CvSceneShell";

/**
 * 본문 대응: #boundary — fold 1 음성 0.1·양성 0.2, fold 2 음성 0.8·양성 0.9(가정).
 * 각 fold 안에서는 양성이 음성보다 높아 AUC 1.
 * 합치면 양성 {0.2, 0.9} × 음성 {0.1, 0.8} 네 쌍 중 (0.2, 0.8)만 순서가 틀려 3/4 = 0.75.
 */
type Point = { score: number; fold: 1 | 2 };
const POS: readonly Point[] = [{ score: 0.2, fold: 1 }, { score: 0.9, fold: 2 }];
const NEG: readonly Point[] = [{ score: 0.1, fold: 1 }, { score: 0.8, fold: 2 }];

const AX0 = 40;
const AX1 = 330;
const sx = (score: number) => AX0 + score * (AX1 - AX0);
const POS_Y = 46;
const NEG_Y = 104;
const AXIS_Y = 140;

const SCENES = [
  { label: "fold 1만", summary: "양성 0.2 > 음성 0.1 → AUC 1", note: "fold 1 안에는 양성–음성 쌍이 하나뿐이고 양성 점수가 더 높습니다. 그래서 fold 1의 AUC는 1입니다." },
  { label: "fold 2만", summary: "양성 0.9 > 음성 0.8 → AUC 1", note: "다른 모델이 만든 fold 2의 점수는 훨씬 높은 범위에 있지만, 그 안에서도 양성이 음성보다 높아 AUC는 1입니다." },
  { label: "두 fold 합치기", summary: "네 쌍 중 셋 → 0.75", note: "합치면 서로 다른 모델이 만든 점수끼리도 비교합니다. fold 1의 양성 0.2는 fold 2의 음성 0.8보다 낮아 한 쌍이 틀리고, pooled AUC는 3/4 = 0.75입니다." },
];

const pairsFor = (scene: number) =>
  POS.flatMap((pos) => NEG.map((neg) => ({ pos, neg })))
    .filter(({ pos, neg }) => scene === 2 || (pos.fold === scene + 1 && neg.fold === scene + 1));

export default function PooledAucViz() {
  return (
    <SceneShell
      eyebrow="순위 지표"
      title="각 fold의 AUC가 1이어도 합친 AUC는 0.75가 됩니다"
      description="AUC는 양성·음성 쌍 가운데 양성의 점수가 더 높은 쌍의 비율입니다. 점은 10절의 가정 점수이며 가로 위치가 모델 점수입니다."
      ariaLabel="두 fold의 양성·음성 점수와 합쳤을 때 순서가 틀리는 쌍"
      scenes={SCENES}
      render={(active) => {
        const pairs = pairsFor(active);
        const visible = (point: Point) => active === 2 || point.fold === active + 1;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={8} y={POS_Y + 4} fontSize={11} fontWeight={700} fill="#475569">양성</text>
              <text x={8} y={NEG_Y + 4} fontSize={11} fontWeight={700} fill="#475569">음성</text>
              {pairs.map(({ pos, neg }) => {
                const ok = pos.score > neg.score;
                return (
                  <line
                    key={`${pos.score}-${neg.score}`}
                    x1={sx(pos.score)}
                    y1={POS_Y + 7}
                    x2={sx(neg.score)}
                    y2={NEG_Y - 7}
                    stroke={ok ? "#16a34a" : "#dc2626"}
                    strokeWidth={ok ? 1 : 1.25}
                    strokeDasharray={ok ? undefined : "4 3"}
                  />
                );
              })}
              {POS.map((point) => (
                <g key={`p${point.score}`} opacity={visible(point) ? 1 : 0.15}>
                  <circle cx={sx(point.score)} cy={POS_Y} r={6} fill="#2563eb" stroke="#2563eb" strokeWidth={1} />
                  <text x={sx(point.score)} y={POS_Y - 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">
                    {point.score} (fold {point.fold})
                  </text>
                </g>
              ))}
              {NEG.map((point) => (
                <g key={`n${point.score}`} opacity={visible(point) ? 1 : 0.15}>
                  <circle cx={sx(point.score)} cy={NEG_Y} r={6} fill="none" stroke="#475569" strokeWidth={1.25} />
                  <text x={sx(point.score)} y={NEG_Y + 20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
                    {point.score} (fold {point.fold})
                  </text>
                </g>
              ))}
              <line x1={AX0} x2={AX1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, 0.5, 1].map((tick) => (
                <text key={tick} x={sx(tick)} y={AXIS_Y + 14} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
              ))}
              <text x={AX1} y={AXIS_Y - 5} textAnchor="end" fontSize={9} fill="#64748b">모델 점수 →</text>
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((_, scene) => (
                <ul key={scene} className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-xs sm:grid-cols-4 sm:text-sm">
                  {pairsFor(scene).map(({ pos, neg }) => {
                    const ok = pos.score > neg.score;
                    return (
                      <li key={`${pos.score}-${neg.score}`} style={{ color: ok ? "#16a34a" : "#dc2626" }}>
                        {pos.score} {ok ? ">" : "<"} {neg.score} {ok ? "맞음" : "틀림"}
                      </li>
                    );
                  })}
                </ul>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
