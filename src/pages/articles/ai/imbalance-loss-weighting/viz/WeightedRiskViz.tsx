import SceneShell from "./SceneShell";

/**
 * 본문 대응: #class-weight — c_i = w·ℓ, C = Σc_i, R̂ = C / Σw.
 * 가정 batch: positive loss 1(본문 값), negative 9행 loss 0.1씩(가정), weight 9:1(본문 값).
 * 장면 1: w=1 → C=1.9, Σw=10, R̂=0.19, positive 몫 53%.
 * 장면 2: C=9+0.9=9.9, positive 몫 91%.
 * 장면 3: Σw=9+9=18 → R̂=0.55, 몫은 그대로 91%.
 * 장면 4(가정): positive 2행·negative 8행 → C=18.8(나누기 전 1.9배), Σw=26, R̂≈0.72, 몫 96%.
 */
const SCALE = 20;

const SCENES = [
  {
    label: "Weight 없이",
    summary: "C = 1 + 0.9 = 1.9 · R̂ = 0.19",
    pos: 1,
    neg: 9,
    w: 1,
    note: "모든 weight를 1로 두면 이 식은 평범한 평균입니다. 합 C=1.9를 행 수 10으로 나눠 0.19가 되고, positive 한 행의 몫은 1/1.9로 약 53%입니다.",
  },
  {
    label: "Weight를 곱함",
    summary: "C = 1×9 + 0.9×1 = 9.9",
    pos: 1,
    neg: 9,
    w: 9,
    note: "Positive loss 1에 9를 곱해 contribution 9가 됩니다. 행은 여전히 열 개이고 배점만 바뀌었습니다. 합 C에서 positive의 몫은 9/9.9로 약 91%입니다.",
  },
  {
    label: "총 weight로 나눔",
    summary: "R̂ = 9.9 / 18 = 0.55",
    pos: 1,
    neg: 9,
    w: 9,
    note: "총 weight는 9 + 1×9 = 18입니다. 나눈 뒤 두 몫은 0.5와 0.05로 작아지지만 비율은 그대로 약 91%입니다. 나눗셈은 중요도를 지우지 않고 크기만 맞춥니다.",
  },
  {
    label: "Batch 구성이 바뀌면",
    summary: "C 9.9 → 18.8 · R̂ 0.55 → 0.72",
    pos: 2,
    neg: 8,
    w: 9,
    note: "다음 batch에 positive가 두 행이면(가정) 나누기 전 합은 9.9에서 18.8로 약 1.9배 뜁니다. 총 weight 26으로 나눈 R̂는 0.55에서 0.72로 움직여, batch마다 objective의 크기가 덜 출렁입니다.",
  },
] as const;

const NEG_LOSS = 0.1;

function Bar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  const width = Math.min(100, (value / SCALE) * 100);
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_3.25rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{Number(value.toFixed(2))}</span>
    </div>
  );
}

export default function WeightedRiskViz() {
  return (
    <SceneShell
      eyebrow="Weighted risk 계산"
      title="Weight를 곱한 뒤 총 weight로 나누는 이유"
      description="칸 하나가 batch의 한 행입니다. ℓ은 그 행의 sample loss, w는 정답 class에 붙는 weight, C는 w×ℓ의 합, R̂는 C를 총 weight로 나눈 값입니다. Positive loss 1과 weight 9는 본문 값이고, negative 9행의 loss 0.1은 가정입니다. 막대는 0~20 축입니다."
      ariaLabel="class weight를 곱하고 총 weight로 나눌 때 batch objective와 positive 몫의 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const weight = scene.w;
        const posC = scene.pos * 1 * weight;
        const negC = scene.neg * NEG_LOSS;
        const c = posC + negC;
        const sumW = scene.pos * weight + scene.neg;
        const r = c / sumW;
        const divided = active >= 2;
        const share = Math.round((posC / c) * 100);
        const rows = Array.from({ length: 10 }, (_, i) => i < scene.pos);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
              {rows.map((isPos, i) => (
                <div
                  key={i}
                  className={`rounded-md border px-1 py-1.5 text-center text-[11px] leading-4 ${isPos ? "border-[#2563eb] bg-[#2563eb]/10" : "border-border bg-background"}`}
                >
                  <span className={`block font-semibold ${isPos ? "text-[#2563eb]" : "text-muted-foreground"}`}>{isPos ? "pos" : "neg"}</span>
                  <span className="block font-mono">ℓ={isPos ? "1" : "0.1"}</span>
                  <span className={`block font-mono ${isPos && weight > 1 ? "font-bold text-[#2563eb]" : "text-muted-foreground"}`}>w={isPos ? weight : 1}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Bar label="Positive 몫" value={divided ? posC / sumW : posC} color="#2563eb" />
              <Bar label="Negative 몫" value={divided ? negC / sumW : negC} color="#94a3b8" />
              <Bar label={divided ? `R̂ = C ÷ ${sumW}` : "C (나누기 전)"} value={divided ? r : c} color="#0f766e" strong />
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Objective 안에서 positive가 차지하는 비율</span>
                <span className="font-mono font-bold text-foreground">{share}%</span>
              </div>
              <div className="mt-1 flex h-3 overflow-hidden rounded-sm bg-[#94a3b8]/50">
                <div className="h-full bg-[#2563eb] transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${share}%` }} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
