import SceneShell from "./SceneShell";

/**
 * 본문 대응: "행을 줄여도 확률은 vocabulary 전체에서 다시 계산됩니다"
 * 본문 예: logit (4,2,0) → 첫 행 0.5배 → (2,2,0), softmax (0.867,0.117,0.016) → (0.468,0.468,0.063).
 * 음수 logit 예 (2,0,−2) → 셋째 행 0.5배 → (2,0,−1)은 가정이며, 셋째 확률 0.016 → 0.042.
 */
const softmax = (logits: readonly number[]) => {
  const exps = logits.map((z) => Math.exp(z));
  const total = exps.reduce<number>((sum, value) => sum + value, 0);
  return exps.map((value) => value / total);
};

interface SoftmaxScene {
  label: string;
  summary: string;
  note: string;
  before: readonly number[];
  after: readonly number[] | null;
  target: number | null;
}

const SCENES: readonly SoftmaxScene[] = [
  {
    label: "원본 logit",
    summary: "(4, 2, 0) → (0.867, 0.117, 0.016)",
    note: "후보가 세 개뿐인 vocabulary라고 하겠습니다. logit은 lm_head 행과 문맥 hidden state h의 내적으로 나온 점수이고, softmax는 e^logit을 세 후보 합으로 나눠 확률로 바꿉니다.",
    before: [4, 2, 0],
    after: null,
    target: null,
  },
  {
    label: "token 1의 행만 0.5배",
    summary: "(2, 2, 0) → (0.468, 0.468, 0.063)",
    note: "행을 0.5배 하면 이 h에서 logit 4가 2가 됩니다. 확률은 0.867의 절반(0.433)이 아니라 0.468이고, 건드리지 않은 token 2·3의 확률도 올라갑니다. 분모를 세 후보가 함께 쓰기 때문입니다.",
    before: [4, 2, 0],
    after: [2, 2, 0],
    target: 0,
  },
  {
    label: "음수 logit을 줄이면 (가정)",
    summary: "token 3: 0.016 → 0.042",
    note: "logit (2, 0, −2)에서 token 3의 행을 0.5배 하면 −2가 −1로 0 쪽에 다가갑니다. 배율을 낮췄는데도 확률은 0.016에서 0.042로 늘어납니다. 이 숫자들은 본문의 부호 설명을 보이려는 가정이며, 논문은 대상 high-risk token의 logit이 실험에서 대체로 양수였다고만 보고합니다.",
    before: [2, 0, -2],
    after: [2, 0, -1],
    target: 2,
  },
];

const LOGIT_RANGE = 4;

function LogitBar({ value, color }: { value: number; color: string }) {
  const half = (Math.abs(value) / LOGIT_RANGE) * 50;
  const left = value >= 0 ? 50 : 50 - half;
  return (
    <div className="relative h-3 min-w-0 rounded-sm bg-muted/40">
      <div className="absolute inset-y-0 left-1/2 w-px bg-[#94a3b8]" />
      <div className="absolute inset-y-0 rounded-sm transition-all duration-300 motion-reduce:transition-none" style={{ left: `${left}%`, width: `${half}%`, backgroundColor: color }} />
    </div>
  );
}

function ProbBar({ value, previous, color }: { value: number; previous: number | null; color: string }) {
  return (
    <div className="relative h-3 min-w-0 rounded-sm bg-muted/40">
      <div className="absolute inset-y-0 left-0 rounded-sm transition-all duration-300 motion-reduce:transition-none" style={{ width: `${value * 100}%`, backgroundColor: color }} />
      {previous !== null && <div className="absolute -inset-y-0.5 w-0.5 bg-[#0f172a] dark:bg-[#e2e8f0]" style={{ left: `${previous * 100}%` }} />}
    </div>
  );
}

export default function SoftmaxRenormViz() {
  return (
    <SceneShell
      eyebrow="행 배율 → 확률"
      title="한 token의 행을 줄이면 세 후보의 확률이 함께 다시 나뉩니다"
      description="한 줄이 token 하나입니다. 왼쪽 막대는 logit(가운데가 0, 왼쪽이 음수), 오른쪽 막대는 softmax 확률이며 검은 눈금은 변환 전 확률입니다."
      ariaLabel="lm_head 행 축소 전후의 logit과 softmax 확률 비교"
      scenes={SCENES}
      controlLabels={["원본", "token 1 ×0.5", "음수 logit"]}
      render={(active) => {
        const scene = SCENES[active];
        const now = scene.after ?? scene.before;
        const probsBefore = softmax(scene.before);
        const probsNow = softmax(now);
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 text-[11px] font-bold text-muted-foreground">
              <span />
              <span>logit (−4 … 0 … 4)</span>
              <span>확률 (0 … 1)</span>
            </div>
            {now.map((z, index) => {
              const isTarget = index === scene.target;
              const color = isTarget ? "#dc2626" : "#2563eb";
              const zBefore = scene.before[index];
              return (
                <div key={index} className="grid grid-cols-[4.5rem_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-3 gap-y-1 text-xs">
                  <span className={isTarget ? "font-bold text-red-700 dark:text-red-400" : "font-semibold"}>
                    token {index + 1}
                    <span className="block text-[10px] font-normal text-muted-foreground">{isTarget ? "행 ×0.5" : "행 그대로"}</span>
                  </span>
                  <div className="min-w-0">
                    <LogitBar value={z} color={color} />
                    <span className="mt-1 block font-mono">{scene.after && zBefore !== z ? `${zBefore} → ${z}` : `${z}`}</span>
                  </div>
                  <div className="min-w-0">
                    <ProbBar value={probsNow[index]} previous={scene.after ? probsBefore[index] : null} color={color} />
                    <span className="mt-1 block font-mono">
                      {scene.after ? `${probsBefore[index].toFixed(3)} → ${probsNow[index].toFixed(3)}` : probsNow[index].toFixed(3)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
