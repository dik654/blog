import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #prevalence-shift — TPR=.8, FPR=.1을 고정하고 prevalence π만 .5 → .01로 바꾼다.
 * 본문은 population을 1로 정규화한다. 여기서는 같은 비율을 1,000건으로 환산해 칸 폭으로 그린다.
 * π=.5: positive 500 → TP 400·FN 100, negative 500 → FP 50·TN 450, precision 400/450 ≈ .89
 * π=.01: positive 10 → TP 8·FN 2, negative 990 → FP 99·TN 891, precision 8/107 ≈ .075
 */
const TPR = 0.8;
const FPR = 0.1;
const TOTAL = 1000;

interface Mix {
  pi: string;
  tp: number;
  fn: number;
  fp: number;
  tn: number;
}

const mixFor = (pi: number, label: string): Mix => {
  const pos = Math.round(pi * TOTAL);
  const neg = TOTAL - pos;
  const tp = Math.round(pos * TPR);
  const fp = Math.round(neg * FPR);
  return { pi: label, tp, fn: pos - tp, fp, tn: neg - fp };
};

const HIGH = mixFor(0.5, ".5");
const LOW = mixFor(0.01, ".01");

const precisionText = (mix: Mix) => {
  const p = mix.tp / (mix.tp + mix.fp);
  return p >= 0.1 ? p.toFixed(2).replace(/^0/, "") : p.toFixed(3).replace(/^0/, "");
};

const COLORS = { tp: "#2563eb", fn: "#93c5fd", fp: "#ea580c", tn: "#cbd5e1" } as const;

const SCENES = [
  {
    label: "π=.5: 양쪽이 반반",
    summary: `TP ${HIGH.tp} · FP ${HIGH.fp} → precision ≈ ${precisionText(HIGH)}`,
    note: `Positive 500건의 80%인 ${HIGH.tp}건을 잡고, negative 500건의 10%인 ${HIGH.fp}건을 잘못 울립니다. Alert ${HIGH.tp + HIGH.fp}건 중 ${HIGH.tp}건이 맞습니다.`,
  },
  {
    label: "π=.01: negative가 990건",
    summary: `TP ${LOW.tp} · FP ${LOW.fp} → precision ≈ ${precisionText(LOW)}`,
    note: `TPR·FPR은 그대로입니다. Positive 10건의 80%는 ${LOW.tp}건뿐이고, negative 990건의 10%는 ${LOW.fp}건입니다. Alert ${LOW.tp + LOW.fp}건 대부분이 오탐입니다.`,
  },
  {
    label: "Alert만 모아 비교",
    summary: `${precisionText(HIGH)} → ${precisionText(LOW)}`,
    note: "같은 FPR 10%라도 곱해지는 negative 수가 500에서 990으로 늘고, TPR 80%가 곱해지는 positive 수는 500에서 10으로 줄었습니다. 그래서 alert 안의 true 비율이 무너집니다.",
  },
] as const;

function PopulationBar({ mix }: { mix: Mix }) {
  const parts = [
    { key: "tp", value: mix.tp, color: COLORS.tp },
    { key: "fn", value: mix.fn, color: COLORS.fn },
    { key: "fp", value: mix.fp, color: COLORS.fp },
    { key: "tn", value: mix.tn, color: COLORS.tn },
  ] as const;
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted-foreground">
        <span>실제 positive {mix.tp + mix.fn}건</span>
        <span>실제 negative {mix.fp + mix.tn}건</span>
      </div>
      <div className="flex h-7 w-full overflow-hidden rounded-md border border-border">
        {parts.map((part) => (
          <div key={part.key} style={{ width: `${(part.value / TOTAL) * 100}%`, backgroundColor: part.color }} />
        ))}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs sm:grid-cols-4">
        {parts.map((part) => (
          <span key={part.key} className="flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: part.color }} />
            <span className="font-mono">
              {part.key.toUpperCase()} {part.value}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

function AlertBar({ mix, title }: { mix: Mix; title: string }) {
  const alerts = mix.tp + mix.fp;
  return (
    <div>
      <div className="mb-1 flex flex-wrap justify-between gap-x-3 text-xs">
        <span className="font-semibold">{title}</span>
        <span className="font-mono text-muted-foreground">
          {mix.tp} / {alerts} ≈ {precisionText(mix)}
        </span>
      </div>
      <div className="flex h-7 w-full overflow-hidden rounded-md border border-border">
        <div style={{ width: `${(mix.tp / alerts) * 100}%`, backgroundColor: COLORS.tp }} />
        <div style={{ width: `${(mix.fp / alerts) * 100}%`, backgroundColor: COLORS.fp }} />
      </div>
    </div>
  );
}

function OneMix({ mix }: { mix: Mix }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold">1,000건 전체 (폭 = 건수)</p>
        <PopulationBar mix={mix} />
      </div>
      <AlertBar mix={mix} title={`Alert ${mix.tp + mix.fp}건만 100%로 펼침`} />
    </div>
  );
}

export default function PrevalenceAlertMixViz() {
  return (
    <SceneShell
      eyebrow="Prevalence 변화"
      title="같은 TPR·FPR에서 alert 안의 오탐 비중이 커집니다"
      description="TPR=.8(actual positive 중 alert 비율), FPR=.1(actual negative 중 alert 비율)은 고정하고 positive 비율 π만 바꿉니다. 본문의 정규화 비율을 1,000건으로 환산했습니다."
      ariaLabel="prevalence .5와 .01에서 TP, FN, FP, TN 건수와 alert 안의 precision 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <OneMix key="high" mix={HIGH} />,
            <OneMix key="low" mix={LOW} />,
            <div key="both" className="space-y-5">
              <AlertBar mix={HIGH} title={`π=${HIGH.pi}: alert ${HIGH.tp + HIGH.fp}건`} />
              <AlertBar mix={LOW} title={`π=${LOW.pi}: alert ${LOW.tp + LOW.fp}건`} />
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: COLORS.tp }} />
                  맞은 alert (TP)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="inline-block size-2.5 rounded-sm" style={{ backgroundColor: COLORS.fp }} />
                  틀린 alert (FP)
                </span>
              </div>
            </div>,
          ]}
        />
      )}
    />
  );
}
