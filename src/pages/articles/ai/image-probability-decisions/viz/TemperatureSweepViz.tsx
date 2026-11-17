import SceneShell from "./SceneShell";

/**
 * 본문 대응: #temperature — 설명용 보정 집합 네 표본과 pred-184에 T=1.0·1.5·2.0을 적용한다.
 * 모든 확률은 글의 logit을 T로 나눠 softmax한 산술값이고, 평균 NLL은 표의 .763·.753·.784와 같다.
 */
const CLASSES = ["신발", "가방", "모자"] as const;
const PRED_LOGITS = [4, 2, 0] as const;
const SAMPLES = [
  { id: "cal-01", logits: [4, 2, 0], answer: 0 },
  { id: "cal-02", logits: [3, 2, 1], answer: 1 },
  { id: "cal-03", logits: [2, 1, 0], answer: 1 },
  { id: "cal-04", logits: [3, 0, 0], answer: 0 },
] as const;
const TEMPS = [1, 1.5, 2] as const;
const NLL_TEXT = [".763", ".753", ".784"] as const;

function softmax(logits: readonly number[], temperature: number) {
  const mass = logits.map((value) => Math.exp(value / temperature));
  const total = mass.reduce<number>((sum, value) => sum + value, 0);
  return mass.map((value) => value / total);
}

const dec = (value: number) => value.toFixed(3).replace(/^0/, "");

const SCENES = [
  {
    label: "T=1.0",
    summary: `평균 NLL ${NLL_TEXT[0]}`,
    note: "원래 logit 간격 그대로입니다. pred-184의 신발 확률은 .867로 가장 뾰족합니다. 정답이 신발인 표본은 정답 확률이 높지만, 정답이 가방인 두 표본은 정답 확률이 .245에 그칩니다.",
  },
  {
    label: "T=1.5",
    summary: `평균 NLL ${NLL_TEXT[1]} · 세 후보 중 최소`,
    note: "logit을 1.5로 나누면 순서는 그대로이고 간격만 좁아집니다. pred-184는 (.750, .198, .052)가 됩니다. 신발 정답 표본의 확률은 내려가고 가방 정답 표본은 .289로 올라, 네 표본 평균 NLL은 세 후보 가운데 가장 작습니다.",
  },
  {
    label: "T=2.0",
    summary: `평균 NLL ${NLL_TEXT[2]} · 다시 커짐`,
    note: "분포가 더 평평해져 pred-184의 신발 확률은 .665입니다. 가방 정답 표본은 .307로 조금 더 오르지만 신발 정답 표본이 .665·.691로 내려가, 평균 NLL은 .784로 다시 커집니다.",
  },
] as const;

function Bar({ label, value, strong }: { label: string; value: number; strong: boolean }) {
  return (
    <div className="grid grid-cols-[4.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="h-3.5 min-w-0 rounded-sm bg-muted/50">
        <div
          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
          style={{ width: `${value * 100}%`, backgroundColor: strong ? "#2563eb" : "#94a3b8" }}
        />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{dec(value)}</span>
    </div>
  );
}

export default function TemperatureSweepViz() {
  return (
    <SceneShell
      eyebrow="온도 후보 하나씩"
      title="T를 키우면 순서는 그대로, 확률 간격만 좁아집니다"
      description="첫 묶음은 pred-184의 세 class 확률, 둘째 묶음은 설명용 보정 표본 네 개의 정답 class 확률입니다. NLL은 정답 class 확률 p에 대한 −log p이므로 p가 1에 가까울수록 작습니다. 모든 값은 글의 logit을 T로 나눈 뒤 softmax(지수로 바꾸고 합이 1이 되게 나눔)한 계산입니다."
      ariaLabel="temperature 1.0, 1.5, 2.0에서 pred-184와 보정 표본 네 개의 확률 비교"
      scenes={SCENES}
      render={(active) => {
        const temperature = TEMPS[active];
        const pred = softmax(PRED_LOGITS, temperature);
        return (
          <div className="grid min-w-0 gap-6 sm:grid-cols-2">
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-bold text-muted-foreground">
                pred-184 · z=(4, 2, 0) ÷ {temperature.toFixed(1)}
              </p>
              <div className="space-y-2">
                {CLASSES.map((name, index) => (
                  <Bar key={name} label={name} value={pred[index]} strong={index === 0} />
                ))}
              </div>
            </div>
            <div className="min-w-0">
              <p className="mb-2 text-[11px] font-bold text-muted-foreground">
                보정 표본 · 정답 class 확률 (−log p)
              </p>
              <div className="space-y-2">
                {SAMPLES.map((sample) => {
                  const p = softmax(sample.logits, temperature)[sample.answer];
                  return (
                    <div key={sample.id} className="grid grid-cols-[5.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-xs">
                      <span className="text-muted-foreground">
                        {sample.id} <span className="text-[10px]">{CLASSES[sample.answer]}</span>
                      </span>
                      <div className="h-3.5 min-w-0 rounded-sm bg-muted/50">
                        <div
                          className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                          style={{ width: `${p * 100}%`, backgroundColor: sample.answer === 0 ? "#2563eb" : "#d97706" }}
                        />
                      </div>
                      <span className="text-right font-mono">
                        {dec(p)} ({dec(-Math.log(p))})
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
