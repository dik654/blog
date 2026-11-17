import SceneShell from "./SceneShell";

/**
 * 본문 대응: #focal-modulation — FL = α_t·(1−p_t)^γ·(−log p_t), γ=2, p_t=.9(easy)·.2(hard).
 * α_t=1로 둠(가정), log는 자연로그.
 * NLL: −ln .9 = 0.105, −ln .2 = 1.609 → 약 15배.
 * 1−p_t: 0.1, 0.8 → 8배.  (1−p_t)²: 0.01, 0.64 → 64배.
 * FL: 0.01×0.105 = 0.00105, 0.64×1.609 = 1.030 → 약 978배.
 */
const EASY_P = 0.9;
const HARD_P = 0.2;
const GAMMA = 2;

const nll = (p: number) => -Math.log(p);
const factor = (p: number) => (1 - p) ** GAMMA;

const STEPS = [
  { name: "기본 loss", formula: "−log pt", easy: nll(EASY_P), hard: nll(HARD_P), digits: [3, 3], scale: 1.7 },
  { name: "부족분", formula: "1 − pt", easy: 1 - EASY_P, hard: 1 - HARD_P, digits: [2, 2], scale: 1.7 },
  { name: "Focal factor", formula: "(1 − pt)²", easy: factor(EASY_P), hard: factor(HARD_P), digits: [2, 2], scale: 1.7 },
  { name: "Focal loss", formula: "factor × −log pt", easy: factor(EASY_P) * nll(EASY_P), hard: factor(HARD_P) * nll(HARD_P), digits: [5, 3], scale: 1.7 },
] as const;

const SCENES = [
  {
    label: "보통 CE에서",
    summary: "0.105 vs 1.609 · 약 15배",
    note: "Focal을 켜기 전에도 −log pt는 정답 probability가 작을수록 큽니다. pt=.9는 0.105, pt=.2는 1.609라 hard 쪽이 이미 약 15배입니다.",
  },
  {
    label: "부족분을 구함",
    summary: "0.1 vs 0.8 · 8배",
    note: "1에서 pt를 빼면 model이 아직 정답을 덜 확신하는 정도가 나옵니다. Easy는 0.1, hard는 0.8입니다.",
  },
  {
    label: "γ=2로 제곱",
    summary: "0.01 vs 0.64 · 64배",
    note: "작은 값은 제곱하면 훨씬 더 작아집니다. 0.1은 0.01로, 0.8은 0.64로 바뀌어 두 난이도의 차이가 8배에서 64배로 커집니다.",
  },
  {
    label: "기본 loss를 곱함",
    summary: "0.00105 vs 1.030 · 약 978배",
    note: "Factor와 기본 loss를 곱하면 easy example은 0.00105로 거의 사라지고 hard example은 1.030이 남습니다. 보통 CE에서 약 15배였던 차이가 약 978배가 됩니다.",
  },
] as const;

function Cell({ value, digits, scale, color, visible }: { value: number; digits: number; scale: number; color: string; visible: boolean }) {
  const width = visible ? Math.min(100, (value / scale) * 100) : 0;
  return (
    <div className="min-w-0">
      <div className="h-3 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className={`mt-0.5 block font-mono text-xs ${visible ? "" : "text-muted-foreground/40"}`}>{visible ? value.toFixed(digits) : "−"}</span>
    </div>
  );
}

export default function FocalChainViz() {
  return (
    <SceneShell
      eyebrow="Focal loss 계산"
      title="pt=.9와 pt=.2가 focal loss에서 얼마나 벌어지나"
      description="pt는 정답 class에 model이 준 probability입니다. 같은 γ=2에서 easy(pt=.9)와 hard(pt=.2) 두 example을 한 단계씩 계산합니다. α_t는 1로 두고(가정) log는 자연로그입니다. 막대는 모든 줄이 같은 0~1.7 축이라 줄끼리 길이를 비교할 수 있습니다."
      ariaLabel="focal loss의 부족분, 제곱, 기본 loss 곱셈을 easy와 hard example에 차례로 적용"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-3 text-xs font-semibold">
            <span className="text-muted-foreground">단계</span>
            <span className="text-[#64748b]">Easy · pt=.9</span>
            <span className="text-[#2563eb]">Hard · pt=.2</span>
          </div>
          {STEPS.map((step, i) => {
            const visible = i <= active;
            const current = i === active;
            return (
              <div
                key={step.name}
                className={`grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)] items-start gap-x-3 rounded-md border px-2 py-2 ${current ? "border-[#2563eb]" : "border-transparent"}`}
              >
                <span className={`min-w-0 text-xs leading-5 ${visible ? "" : "text-muted-foreground/50"}`}>
                  <span className="block font-semibold">{step.name}</span>
                  <span className="block font-mono text-[11px]">{step.formula}</span>
                </span>
                <Cell value={step.easy} digits={step.digits[0]} scale={step.scale} color="#64748b" visible={visible} />
                <Cell value={step.hard} digits={step.digits[1]} scale={step.scale} color="#2563eb" visible={visible} />
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
