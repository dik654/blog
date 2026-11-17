import OneShotSceneShell from "./OneShotSceneShell";

/**
 * 본문 대응: #reconstruction — R = XW − XW̃ = XE. 같은 weight error라도 X가 크게 쓰는 channel이면 output 오차가 커진다.
 * 모든 값은 설명용 가정입니다. Calibration token t1=(6, .6), t2=(8, .8) → channel norm 10과 1 (본문 Wanda 예시와 같은 비율).
 * Output i의 weight w1=.2(강한 channel), w2=.2(약한 channel) → y = 1.32, 1.76.
 * w2 제거: R=(.12, .16), ‖R‖=.2 · w1 제거: R=(1.2, 1.6), ‖R‖=2 · w2 제거 후 w1=.22로 보정: R=(0, 0).
 * Held-out t3=(6, 3)(가정): 원래 1.8, 보정 후보 1.32 → 오차 .48.
 */
const TOKENS = [
  { name: "t1", x1: 6, x2: 0.6, heldOut: false },
  { name: "t2", x1: 8, x2: 0.8, heldOut: false },
  { name: "t3", x1: 6, x2: 3, heldOut: true },
] as const;

interface Weights {
  w1: number;
  w2: number;
}

const ORIGINAL: Weights = { w1: 0.2, w2: 0.2 };

const SCENES: readonly { label: string; summary: string; note: string; cand: Weights | null; showHeldOut: boolean }[] = [
  {
    label: "원래 layer output",
    summary: "y = x1·w1 + x2·w2",
    note: "Calibration token 두 개가 output i에 도달할 때의 input입니다(가정). Channel 1은 6·8로 크게, channel 2는 .6·.8로 작게 쓰여 L2 norm이 10과 1입니다. 두 weight는 모두 .2입니다.",
    cand: null,
    showHeldOut: false,
  },
  {
    label: "약한 channel의 w2를 지우면",
    summary: "E = (0, .2) → ‖R‖ = .2",
    note: "Weight 차이 E는 w2 자리의 .2뿐입니다. 그 error에 input을 곱하면 token별 output 오차는 .6×.2=.12, .8×.2=.16이고, 제곱합의 제곱근은 .2입니다.",
    cand: { w1: 0.2, w2: 0 },
    showHeldOut: false,
  },
  {
    label: "강한 channel의 w1을 지우면",
    summary: "E = (.2, 0) → ‖R‖ = 2",
    note: "Weight error의 크기는 똑같이 .2입니다. 그러나 이 error는 6·8로 크게 쓰이는 channel에 곱해져 오차가 1.2·1.6이 되고, 제곱합의 제곱근은 2입니다. 그래서 weight 차이 E만 보지 않고 XE를 봅니다.",
    cand: { w1: 0, w2: 0.2 },
    showHeldOut: false,
  },
  {
    label: "w2를 지운 뒤 w1을 보정",
    summary: "w1 .2 → .22 → R = 0",
    note: "SparseGPT처럼 지운 뒤 남은 weight를 조정하는 단계입니다. 이 예에서는 두 channel이 calibration token마다 10 : 1의 같은 비율로 움직이도록 골랐기 때문에(가정) w1에 .02를 더하면 6×.22=1.32, 8×.22=1.76으로 원래 output과 같아집니다.",
    cand: { w1: 0.22, w2: 0 },
    showHeldOut: false,
  },
  {
    label: "Held-out token에서 다시 보면",
    summary: "t3 = (6, 3)(가정) → 오차 .48",
    note: "Calibration에 없던 비율의 token이 오면(가정) 원래 output은 6×.2+3×.2=1.8인데 보정한 후보는 6×.22=1.32라 .48이 어긋납니다. 보정은 calibration X에 맞춘 것이므로 coverage가 결과를 바꿀 수 있고, held-out에서 따로 확인해야 합니다.",
    cand: { w1: 0.22, w2: 0 },
    showHeldOut: true,
  },
];

const Y_MAX = 1.8;

const fmt = (value: number) => {
  const rounded = Math.round(value * 100) / 100;
  return String(rounded).replace(/^0\./, ".").replace(/^-0\./, "−.");
};

function Bar({ value, color }: { value: number | null; color: string }) {
  return (
    <div className="h-3 min-w-0 rounded-sm bg-muted/40">
      <div className="h-full rounded-sm" style={{ width: value === null ? "0%" : `${(value / Y_MAX) * 100}%`, backgroundColor: color }} />
    </div>
  );
}

function Stage({ index }: { index: number }) {
  const scene = SCENES[index];
  const cand = scene.cand;
  const errors = TOKENS.filter((t) => !t.heldOut).map((t) =>
    cand ? t.x1 * (ORIGINAL.w1 - cand.w1) + t.x2 * (ORIGINAL.w2 - cand.w2) : 0,
  );
  const norm = Math.sqrt(errors.reduce<number>((sum, e) => sum + e * e, 0));
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
        {(["w1", "w2"] as const).map((key) => {
          const after = cand ? cand[key] : ORIGINAL[key];
          const changed = cand !== null && after !== ORIGINAL[key];
          return (
            <div key={key} className={`rounded-lg border px-2 py-2 ${changed ? (after === 0 ? "border-dashed border-red-600" : "border-amber-600") : "border-border"}`}>
              <span className="block text-[11px] text-muted-foreground">{key === "w1" ? "w1 · 강한 channel (norm 10)" : "w2 · 약한 channel (norm 1)"}</span>
              <span className="font-mono font-bold">
                {fmt(ORIGINAL[key])}
                {changed ? ` → ${after === 0 ? "0 (제거)" : fmt(after)}` : ""}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 grid grid-cols-[2rem_minmax(0,1fr)_3.25rem] items-center gap-x-2 gap-y-1 text-xs">
        <span />
        <span className="flex flex-wrap gap-x-3 text-[11px] text-muted-foreground">
          <span>
            <span className="mr-1 inline-block h-2 w-3 rounded-sm align-middle" style={{ backgroundColor: "#64748b" }} />원래 y
          </span>
          <span>
            <span className="mr-1 inline-block h-2 w-3 rounded-sm align-middle" style={{ backgroundColor: "#2563eb" }} />후보 y
          </span>
        </span>
        <span className="text-right text-[11px] text-muted-foreground">오차</span>
        {TOKENS.map((t) => {
          const visible = !t.heldOut || scene.showHeldOut;
          const y = t.x1 * ORIGINAL.w1 + t.x2 * ORIGINAL.w2;
          const yc = cand ? t.x1 * cand.w1 + t.x2 * cand.w2 : null;
          const err = yc === null ? null : y - yc;
          return (
            <div key={t.name} className={`contents ${visible ? "" : "opacity-30"}`}>
              <span className="font-mono font-bold">
                {t.name}
                {t.heldOut ? "*" : ""}
              </span>
              <div className="min-w-0 space-y-1 py-1">
                <span className="block font-mono text-[11px] text-muted-foreground">
                  x = ({fmt(t.x1)}, {fmt(t.x2)}){visible ? ` · y ${fmt(y)}${yc === null ? "" : ` → ${fmt(yc)}`}` : " · held-out"}
                </span>
                <Bar value={visible ? y : null} color="#64748b" />
                <Bar value={visible ? yc : null} color="#2563eb" />
              </div>
              <span className={`text-right font-mono font-bold ${err !== null && visible && Math.abs(err) > 1e-9 ? "text-red-700 dark:text-red-400" : ""}`}>
                {visible && err !== null ? fmt(Math.abs(err) < 1e-9 ? 0 : err) : "−"}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 border-t border-border pt-2 font-mono text-xs font-bold">
        calibration ‖R‖ = {cand ? fmt(norm < 1e-9 ? 0 : norm) : "−"}
        <span className="ml-2 font-sans font-normal text-muted-foreground">(t1·t2 오차의 제곱합의 제곱근 · * = calibration에 없던 token)</span>
      </p>
    </div>
  );
}

export default function OutputErrorViz() {
  return (
    <OneShotSceneShell
      eyebrow="SparseGPT · R = XE"
      title="같은 크기의 weight error도 어느 channel에 있느냐에 따라 output 오차가 다릅니다"
      description="Output 하나, input channel 두 개, calibration token 두 개짜리 작은 layer입니다. 모든 값은 설명용 가정입니다. 막대는 token별 output y이고, 오차는 원래 y에서 후보 y를 뺀 값입니다."
      ariaLabel="weight 하나를 지울 때 input 세기에 따라 output 오차가 달라지고 남은 weight 보정이 오차를 줄이는 과정"
      scenes={SCENES}
      render={(index) => <Stage index={index} />}
    />
  );
}
