import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications "Identity guidance 비용을 two-stage로 나눠 감당한다" + two-stage AlgorithmBlock.
 * Stage 1: base+ID-LoRA, 매 step [기존 예측 + reference 없는 예측]. Stage 2: distilled LoRA, guidance 없음, 소수 step.
 * step 수 8·2는 가정이며 글은 "full"·"few"로만 적습니다.
 */
const STAGE1_STEPS = 8;
const STAGE2_STEPS = 2;
const S1 = Array.from({ length: STAGE1_STEPS }, (_, i) => i);
const S2 = Array.from({ length: STAGE2_STEPS }, (_, i) => i);

const SCENES = [
  {
    label: "Stage 1 · 매 step 두 줄",
    summary: `추가 예측 ${STAGE1_STEPS}번 (가정 step 수)`,
    note: "Stage 1은 base model + ID-LoRA로 target 해상도의 전체 denoising을 돕니다. 매 step 기존 예측에 더해 reference 없는 예측을 한 번 더 계산해야 identity delta를 만들 수 있습니다.",
  },
  {
    label: "Stage 2 · 넘겨받아 짧게",
    summary: `+ ${STAGE2_STEPS} step, 추가 예측 0번`,
    note: "Stage 2는 stage1_out을 입력으로 받아 distilled LoRA만으로 소수 step을 다듬습니다. guidance가 없으므로 reference 없는 예측도 계산하지 않습니다.",
  },
  {
    label: "비싼 칸이 놓인 자리",
    summary: "추가 예측은 stage 1에만",
    note: "Identity가 자리 잡은 뒤의 다듬기에는 추가 예측이 붙지 않습니다. 비싼 계산을 생성 과정 전체가 아니라 stage 1에만 두는 것이 two-stage 설계입니다.",
  },
] as const;

const BASE = "#64748b";
const EXTRA = "#d97706";
const DIST = "#0d9488";

const COL = 34;
const GAP = 5;
const X0 = 6;
const s1x = (i: number) => X0 + i * (COL + GAP);
const S2_X0 = s1x(STAGE1_STEPS) + 26;
const s2x = (i: number) => S2_X0 + i * (COL + GAP);
const W = s2x(STAGE2_STEPS) + 2;

export default function TwoStageViz() {
  return (
    <SceneShell
      eyebrow="two-stage inference"
      title="Reference 없는 예측은 stage 1에서만 계산합니다"
      description="세로 한 줄이 denoising step 하나이고 칸 하나가 model 예측 한 번(forward pass)입니다. 기존 예측(CFG 포함)은 한 칸으로 묶었고, step 수 8과 2는 가정입니다."
      ariaLabel="stage 1의 매 step 추가 예측과 stage 2의 짧은 다듬기를 비교하는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const showS2 = active >= 1;
        const focus = active === 2;
        return (
          <div className="w-full min-w-0">
            <svg viewBox={`0 0 ${W} 112`} role="img" aria-label={SCENES[active].label} className="h-auto w-full max-w-2xl">
              <text x={X0} y={16} fontSize={13} fontWeight={700} fill="#334155">
                Stage 1 · base + ID-LoRA
              </text>
              {S1.map((i) => (
                <g key={`a${i}`}>
                  <rect x={s1x(i)} y={26} width={COL} height={30} rx={4} fill={BASE} fillOpacity={focus ? 0.06 : 0.14} stroke={BASE} strokeWidth={1} />
                  <rect x={s1x(i)} y={62} width={COL} height={30} rx={4} fill={EXTRA} fillOpacity={0.18} stroke={EXTRA} strokeWidth={focus ? 1.25 : 1} />
                  <text x={s1x(i) + COL / 2} y={108} textAnchor="middle" fontSize={11} fill="#64748b">
                    {i + 1}
                  </text>
                </g>
              ))}
              {showS2 && (
                <g>
                  <line x1={s1x(STAGE1_STEPS) - 2} y1={59} x2={S2_X0 - 6} y2={59} stroke="#334155" strokeWidth={1} />
                  <polygon points={`${S2_X0 - 3},59 ${S2_X0 - 9},56 ${S2_X0 - 9},62`} fill="#334155" />
                  <text x={S2_X0} y={16} fontSize={13} fontWeight={700} fill={DIST}>
                    Stage 2
                  </text>
                  {S2.map((i) => (
                    <g key={`b${i}`}>
                      <rect x={s2x(i)} y={26} width={COL} height={30} rx={4} fill={DIST} fillOpacity={focus ? 0.06 : 0.16} stroke={DIST} strokeWidth={1} />
                      <rect x={s2x(i)} y={62} width={COL} height={30} rx={4} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                      <text x={s2x(i) + COL / 2} y={108} textAnchor="middle" fontSize={11} fill="#64748b">
                        {i + 1}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-muted-foreground">
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: BASE, backgroundColor: "#64748b33" }} />기존 예측(CFG 포함)</li>
              <li><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: EXTRA, backgroundColor: "#d977062e" }} />reference 없는 예측(추가)</li>
              <li className={showS2 ? "" : "invisible"}><span className="mr-1 inline-block h-2.5 w-2.5 rounded-sm border" style={{ borderColor: DIST, backgroundColor: "#0d948829" }} />distilled LoRA 예측</li>
            </ul>
            <p className={`mt-2 text-sm font-semibold ${focus ? "text-amber-700 dark:text-amber-400" : ""}`}>
              {showS2 ? `추가 예측: stage 1 ${STAGE1_STEPS}번 · stage 2 0번` : `추가 예측: step마다 1번 × ${STAGE1_STEPS} step`}
            </p>
          </div>
        );
      }}
    />
  );
}
