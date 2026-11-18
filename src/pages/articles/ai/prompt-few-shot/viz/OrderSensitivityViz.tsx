import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: "Example order와 label prior를 흔들어 본다" — zero-shot 기준선, 세 예시의 순서 6가지, 한 순서에서만 오른 결과.
 * 세 예시는 이 글 첫 Viz의 broken→negative, thanks→positive, refund→negative다.
 * 순서 수 3×2×1 = 6, 마지막 label negative 4개·positive 2개는 계산값이고, 점의 위치는 모양을 보이려는 가정이다.
 */
const EX = {
  B: { word: "broken", label: "negative" },
  T: { word: "thanks", label: "positive" },
  R: { word: "refund", label: "negative" },
} as const;

type Key = keyof typeof EX;

const ORDERS: readonly (readonly [Key, Key, Key])[] = [
  ["B", "T", "R"],
  ["B", "R", "T"],
  ["T", "B", "R"],
  ["T", "R", "B"],
  ["R", "B", "T"],
  ["R", "T", "B"],
];

/** 0~100 위치(가정). 기준선 50, 세 번째 순서만 크게 오른 모양. */
const BASELINE = 50;
const DOTS: readonly number[] = [53, 47, 86, 51, 46, 54];

const SCENES = [
  {
    label: "zero-shot 기준선",
    summary: "예시 없이 먼저 저장",
    note: "예시를 하나도 넣지 않은 zero-shot 결과를 먼저 저장합니다. 아래 점선이 그 기준선이고, 이후 모든 순서의 결과를 이 선과 비교합니다.",
  },
  {
    label: "순서 6가지",
    summary: "3 × 2 × 1 = 6",
    note: "같은 세 예시도 놓는 순서는 6가지입니다. 어느 순서든 label 빈도는 negative 2 : positive 1로 같고, 마지막 예시의 label은 negative 4번·positive 2번입니다. Prediction은 이 마지막 example과 label 빈도에 민감할 수 있습니다.",
  },
  {
    label: "한 순서에서만 오름",
    summary: "6개 중 1개만 크게 오름",
    note: "순서마다 class별 accuracy와 prediction variance를 잽니다. 이 그림처럼 나머지 다섯은 기준선 근처에 머물고 한 ordering에서만 좋아진다면 task rule을 배운 것이 아니라 recency(마지막 예시 쪽으로 끌림)나 label prior(예시 label 빈도 쪽으로 끌림)에 기대고 있을 수 있습니다. 점 위치는 모양을 보이려는 가정이며 측정값이 아닙니다.",
  },
] as const;

const LABEL_COLOR: Record<string, string> = {
  negative: "border-amber-600 bg-amber-500/10",
  positive: "border-sky-600 bg-sky-500/10",
};

function Strip({ value, show }: { value: number; show: boolean }) {
  return (
    <svg viewBox="0 0 100 14" preserveAspectRatio="none" className="block h-3.5 w-full" aria-hidden="true">
      <line x1={0} x2={100} y1={7} y2={7} stroke="#94a3b8" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      <line x1={BASELINE} x2={BASELINE} y1={0} y2={14} stroke="#475569" strokeWidth={1} strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      {show ? <rect x={value - 2} y={3} width={4} height={8} rx={1} fill={value > BASELINE + 10 ? "#2563eb" : "#64748b"} /> : null}
    </svg>
  );
}

function Drawing({ step }: { step: number }) {
  const showOrders = step >= 1;
  return (
    <div className="min-w-0 text-[10px] sm:text-xs">
      <div className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-2 border-b border-border pb-1 font-mono text-[9px] font-bold text-muted-foreground sm:grid-cols-[minmax(0,1fr)_10rem] sm:text-[10px]">
        <span>예시 순서 (오른쪽 끝 = 마지막 예시)</span>
        <span>결과 (가정) · 점선 = 기준선</span>
      </div>
      <div className="mt-1.5 grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_10rem]">
        <span className={`rounded-md border px-2 py-1 font-semibold ${step === 0 ? "border-primary bg-primary/10" : "border-border"}`}>zero-shot · 예시 없음</span>
        <Strip value={BASELINE} show={false} />
      </div>
      <div className="mt-1.5 grid gap-1.5">
        {ORDERS.map((order, row) => (
          <div key={order.join("")} className="grid grid-cols-[minmax(0,1fr)_5.5rem] items-center gap-2 sm:grid-cols-[minmax(0,1fr)_10rem]">
            <div className={`grid grid-cols-3 gap-1 ${showOrders ? "" : "opacity-30"}`}>
              {order.map((key, pos) => {
                const ex = EX[key];
                const last = pos === 2;
                return (
                  <span
                    key={key}
                    className={`min-w-0 truncate rounded-md border px-1 py-1 text-center ${LABEL_COLOR[ex.label]} ${
                      last && showOrders ? "font-bold outline outline-1 outline-offset-1 outline-foreground/60" : ""
                    }`}
                  >
                    {ex.word}
                    <span className="sm:hidden">{ex.label === "negative" ? "−" : "+"}</span>
                    <span className="hidden sm:inline">→{ex.label === "negative" ? "neg" : "pos"}</span>
                  </span>
                );
              })}
            </div>
            <Strip value={DOTS[row]} show={step === 2} />
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-muted-foreground sm:text-[11px]">
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm border border-amber-600" />negative 예시 <span className="sm:hidden">(−)</span></span>
        <span className="flex items-center gap-1"><span className="inline-block h-2.5 w-2.5 rounded-sm border border-sky-600" />positive 예시 <span className="sm:hidden">(+)</span></span>
        <span className={showOrders ? "" : "invisible"}>마지막 label: negative 4 · positive 2</span>
        <span>오른쪽 띠: 오른쪽일수록 accuracy 높음 (가정)</span>
      </div>
    </div>
  );
}

export default function OrderSensitivityViz() {
  return (
    <SceneShell
      eyebrow="순서 민감도"
      title="같은 세 예시를 여섯 순서로 흔들어 기준선과 비교합니다"
      description="세 예시는 이 글 첫 그림의 broken→negative, thanks→positive, refund→negative입니다. 오른쪽 띠의 점 위치는 실험 결과의 모양을 보이려는 가정이며 측정값이 아닙니다."
      ariaLabel="zero-shot 기준선과 세 예시의 순서 6가지, 그리고 한 순서에서만 오른 결과"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack active={active} scenes={SCENES.map((scene, index) => <Drawing key={scene.label} step={index} />)} />
      )}
    />
  );
}
