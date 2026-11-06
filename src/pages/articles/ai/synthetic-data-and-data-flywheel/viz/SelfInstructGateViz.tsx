import SceneShell from "./SceneShell";

/**
 * 본문 대응: #generation-sources — Self-Instruct 네 단계 반복과 ROUGE-L 0.7 입구 기준.
 * 175 → 52,445 instruction(약 300배), 82,439 instance(instruction 하나당 평균 약 1.6개).
 * 유사도 0.42·0.85는 입구 규칙을 보이기 위한 가정값입니다.
 */
const STAGES = ["instruction generation", "classification task 식별", "instance generation", "filtering"] as const;

const SEED = 175;
const INSTRUCTIONS = 52445;
const INSTANCES = 82439;
const MAX = INSTANCES;

const SCENES = [
  { label: "네 단계가 한 바퀴", summary: "사람이 쓴 seed 175개", note: "instruction은 모델에게 시키는 지시문입니다. 사람이 쓴 seed task 175개에서 출발해 네 단계를 반복합니다.", stage: -1, sim: null },
  { label: "기존과 덜 비슷하면 통과", summary: "0.42 < 0.7 → pool로", note: "기존 instruction과의 ROUGE-L 유사도가 0.7 미만이면 task pool에 다시 들어갑니다.", stage: 3, sim: 0.42 },
  { label: "기존과 너무 비슷하면 탈락", summary: "0.85 ≥ 0.7 → 탈락", note: "0.7 미만이 아니므로 pool에 들어가지 못합니다. 이 입구 기준이 라운드마다 적용됩니다.", stage: 3, sim: 0.85 },
  { label: "최종 규모", summary: "175 → 52,445개", note: `막대는 실제 비율입니다. instruction은 seed의 약 ${Math.round(INSTRUCTIONS / SEED)}배, 입력과 출력 한 쌍인 instance는 instruction당 평균 약 ${(INSTANCES / INSTRUCTIONS).toFixed(1)}개입니다.`, stage: -1, sim: null },
] as const;

const AX0 = 20;
const AX1 = 340;
const xOf = (value: number) => AX0 + value * (AX1 - AX0);

function SimilarityLine({ sim }: { sim: number }) {
  const pass = sim < 0.7;
  const color = pass ? "#2563eb" : "#dc2626";
  return (
    <svg viewBox="0 0 360 104" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`ROUGE-L 유사도 ${sim}, 기준 0.7 ${pass ? "미만이라 통과" : "이상이라 탈락"}`}>
      <text x={(AX0 + xOf(0.7)) / 2} y={18} textAnchor="middle" fontSize={11} fill="#64748b">0.7 미만: pool로</text>
      <text x={(xOf(0.7) + AX1) / 2} y={18} textAnchor="middle" fontSize={11} fill="#64748b">이상: 탈락</text>
      <line x1={AX0} x2={AX1} y1={62} y2={62} stroke="#94a3b8" strokeWidth={1} />
      <line x1={xOf(0.7)} x2={xOf(0.7)} y1={26} y2={72} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
      <text x={AX0} y={86} textAnchor="middle" fontSize={11} fill="#64748b">0</text>
      <text x={xOf(0.7)} y={86} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">0.7</text>
      <text x={AX1} y={86} textAnchor="middle" fontSize={11} fill="#64748b">1</text>
      <circle cx={xOf(sim)} cy={62} r={6} fill={pass ? color : "none"} stroke={color} strokeWidth={1.25} />
      <text x={xOf(sim)} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{sim} (가정)</text>
    </svg>
  );
}

function CountBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm bg-[#2563eb]" style={{ width: `${(value / MAX) * 100}%` }} />
      </div>
      <span className="text-right font-mono">{value.toLocaleString("en-US")}</span>
    </div>
  );
}

export default function SelfInstructGateViz() {
  return (
    <SceneShell
      eyebrow="Self-Instruct"
      title="네 단계를 돌며 비슷한 instruction은 입구에서 돌려보냅니다"
      description="ROUGE-L은 두 문장이 공유하는 가장 긴 공통 단어열로 잰 겹침 점수이며, 1에 가까울수록 비슷합니다."
      ariaLabel="Self-Instruct의 네 단계 반복과 유사도 0.7 입구 기준, 최종 규모"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {STAGES.map((stage, stageIndex) => {
                const on = scene.stage === stageIndex || (index === 0);
                return (
                  <div key={stage} className={`rounded-lg border px-2 py-1 text-center text-xs leading-4 sm:py-2 sm:leading-5 ${on ? "border-primary bg-primary/10 font-semibold" : "border-border text-muted-foreground"}`}>
                    {stageIndex + 1}. {stage}
                  </div>
                );
              })}
            </div>
            <p className="mt-2 text-center text-xs text-muted-foreground">4번이 끝나면 1번으로 돌아갑니다</p>
            <div className="mt-2 min-h-[5rem] sm:mt-4">
              {scene.sim !== null && <SimilarityLine sim={scene.sim} />}
              {index === 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs sm:pt-4 sm:text-sm">
                  <span className="rounded-lg border border-border bg-background px-3 py-2 font-semibold">seed task 175개</span>
                  <span aria-hidden="true" className="text-primary">→</span>
                  <span className="rounded-lg border border-primary bg-primary/10 px-3 py-2 font-semibold">task pool</span>
                  <span aria-hidden="true" className="text-primary">↻</span>
                  <span className="text-muted-foreground">라운드 반복</span>
                </div>
              )}
              {index === 3 && (
                <div className="space-y-2 pt-1">
                  <CountBar label="seed task" value={SEED} />
                  <CountBar label="instruction" value={INSTRUCTIONS} />
                  <CountBar label="instance" value={INSTANCES} />
                </div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
