import SceneShell from "./SceneShell";

/**
 * 본문 대응: 02절 "raw values → quantile bins → per-bin (Σg,Σh) → prefix gain scan"과 01절 split gain 식.
 * 행 8개(가정): 나이 21,24 | 33,35 | 47,49 | 58,62, 행별 h=0.5, g = −2,−2 | −1,−1 | 2,1 | 0,1.
 * 구간 장부 (ΣG,ΣH) = (−4,1) (−2,1) (3,1) (1,1), 전체 G=−2, H=4. λ=1(본문), γ=2(가정).
 * S = G²/(H+λ). parent S_P = 4/5 = 0.8.
 * 경계1: L(−4,1) S=8,  R(2,3) S=1     → ½(9−0.8)−2      = 2.1
 * 경계2: L(−6,2) S=12, R(4,2) S=16/3  → ½(17.333−0.8)−2 = 6.267
 * 경계3: L(−3,3) S=2.25, R(1,1) S=0.5 → ½(2.75−0.8)−2   = −1.025
 */
const ROWS = [
  { age: 21, g: -2 },
  { age: 24, g: -2 },
  { age: 33, g: -1 },
  { age: 35, g: -1 },
  { age: 47, g: 2 },
  { age: 49, g: 1 },
  { age: 58, g: 0 },
  { age: 62, g: 1 },
] as const;
const ROW_H = 0.5;
const LAMBDA = 1;
const GAMMA = 2;
const BIN_COUNT = 4;

const BINS = Array.from({ length: BIN_COUNT }, (_, b) => {
  const rows = (ROWS as readonly { age: number; g: number }[]).slice(b * 2, b * 2 + 2);
  return {
    rows,
    g: rows.reduce<number>((sum, row) => sum + row.g, 0),
    h: rows.length * ROW_H,
  };
});
const TOTAL_G = BINS.reduce<number>((sum, bin) => sum + bin.g, 0);
const TOTAL_H = BINS.reduce<number>((sum, bin) => sum + bin.h, 0);
const score = (g: number, h: number) => (g * g) / (h + LAMBDA);
const PARENT = score(TOTAL_G, TOTAL_H);

const CANDIDATES = [1, 2, 3].map((cut) => {
  const left = BINS.slice(0, cut);
  const gl = left.reduce<number>((sum, bin) => sum + bin.g, 0);
  const hl = left.reduce<number>((sum, bin) => sum + bin.h, 0);
  const gr = TOTAL_G - gl;
  const hr = TOTAL_H - hl;
  const sl = score(gl, hl);
  const sr = score(gr, hr);
  return { cut, gl, hl, gr, hr, sl, sr, gain: 0.5 * (sl + sr - PARENT) - GAMMA };
});

const fmt = (x: number) => {
  const v = Number(x.toFixed(3));
  return v < 0 ? `−${Math.abs(v)}` : `${v}`;
};

const SCENES = [
  {
    label: "행 8개를 구간 4개로",
    summary: "고유값 8개 → 구간 4개",
    note: "나이를 정렬해 구간마다 행이 2개씩 들어가게 경계를 정했습니다(가정). 이제 threshold 후보는 고유값 사이가 아니라 구간 사이 3곳뿐입니다.",
  },
  {
    label: "구간별 G·H 장부",
    summary: "parent: G=−2, H=4, S=0.8",
    note: "각 행의 g와 h를 구간 안에서 더해 장부 한 줄로 접습니다. 장부를 모두 더하면 parent 통계 G=−2, H=4이고, split 전 score는 G²/(H+λ)=4/5=0.8입니다.",
  },
  {
    label: "경계 1 시험",
    summary: "Gain = ½(8+1−0.8)−2 = 2.1",
    note: "왼쪽 누적은 구간 0 하나입니다. 오른쪽은 다시 더하지 않고 전체에서 왼쪽을 빼서 G=−2−(−4)=2, H=4−1=3을 얻습니다.",
  },
  {
    label: "경계 2 시험",
    summary: "Gain = ½(12+5.333−0.8)−2 = 6.267",
    note: "왼쪽 누적에 구간 1을 하나 더하는 것으로 끝납니다. 왼쪽 G=−6, H=2는 00절의 예와 같은 숫자라 score가 36/3=12입니다.",
  },
  {
    label: "경계 3 시험",
    summary: "Gain = ½(2.25+0.5−0.8)−2 = −1.025",
    note: "구간 2의 양수 g가 왼쪽 누적을 −3으로 되돌려 child score가 작아집니다. 개선분이 split cost γ=2를 갚지 못해 Gain이 음수입니다.",
  },
  {
    label: "후보 고르기",
    summary: "경계 2 채택 · 경계 3 버림",
    note: "세 후보 중 Gain이 가장 큰 경계 2를 고르고, 음수인 경계 3은 버립니다. 이 Gain은 학습 rows의 local 근사에서 나온 값이므로 validation 개선까지 보장하지는 않습니다.",
  },
] as const;

function Stat({ label, value, tone }: { label: string; value: string; tone: "left" | "right" | "plain" }) {
  const toneClass =
    tone === "left" ? "border-blue-600/60 text-blue-700 dark:text-blue-300" : tone === "right" ? "border-amber-600/60 text-amber-700 dark:text-amber-300" : "border-border";
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 text-center ${toneClass}`}>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 break-keep font-mono text-xs font-bold sm:text-sm">{value}</p>
    </div>
  );
}

export default function HistogramGainScanViz() {
  return (
    <SceneShell
      eyebrow="Histogram builder의 prefix scan"
      title="구간 장부를 왼쪽부터 누적하며 경계마다 Gain을 계산합니다"
      description="한 칸이 한 구간(bin)이고 그 안의 작은 글자가 행입니다. 나이 값, 행별 g·h와 γ=2는 계산을 보이려는 가정이고, λ=1은 본문 값입니다. S는 01절의 child·parent score G²/(H+λ)입니다."
      ariaLabel="행 8개를 구간 4개로 접고 세 경계에서 split gain을 차례로 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scanIndex = active >= 2 && active <= 4 ? active - 2 : null;
        const cand = scanIndex === null ? null : CANDIDATES[scanIndex];
        const cut = cand ? cand.cut : active === 5 ? 2 : null;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid grid-cols-4 gap-1.5">
              {BINS.map((bin, b) => {
                const side = cut === null ? "none" : b < cut ? "left" : "right";
                const frame =
                  side === "left" ? "border-blue-600 bg-blue-600/10" : side === "right" ? "border-amber-600 bg-amber-600/10" : "border-border bg-background";
                const cutHere = cut !== null && b === cut;
                return (
                  <div key={b} className={`relative min-w-0 rounded-lg border px-1 py-2 text-center ${frame}`}>
                    {cutHere ? <span aria-hidden className="absolute -left-[5px] top-0 h-full border-l-2 border-dashed border-foreground" /> : null}
                    <p className="text-[11px] font-bold">구간 {b}</p>
                    <div className="mt-1 space-y-0.5 font-mono text-[10px] leading-4 text-muted-foreground">
                      {bin.rows.map((row) => (
                        <p key={row.age}>
                          {row.age}세 g={fmt(row.g)}
                        </p>
                      ))}
                    </div>
                    <p className={`mt-1.5 font-mono text-[11px] font-bold ${active >= 1 ? "" : "opacity-0"}`}>
                      ({fmt(bin.g)}, {fmt(bin.h)})
                    </p>
                  </div>
                );
              })}
            </div>
            <p className="text-center text-[11px] text-muted-foreground">
              괄호 = 구간 장부 (ΣG, ΣH) · 행마다 h=0.5 (가정) · 점선 = 시험 중인 경계
            </p>
            <div className="grid grid-cols-3 gap-2">
              {cand ? (
                <>
                  <Stat tone="left" label="왼쪽 누적 S_L" value={`(${fmt(cand.gl)},${fmt(cand.hl)}) → ${fmt(cand.sl)}`} />
                  <Stat tone="right" label="오른쪽 = 전체−왼쪽 S_R" value={`(${fmt(cand.gr)},${fmt(cand.hr)}) → ${fmt(cand.sr)}`} />
                  <Stat tone="plain" label="parent S_P" value={fmt(PARENT)} />
                </>
              ) : active === 5 ? (
                <>
                  <Stat tone="left" label="왼쪽 leaf w*" value={`−(${fmt(-6)})/3 = 2`} />
                  <Stat tone="right" label="오른쪽 leaf w*" value={`−4/3 ≈ ${fmt(-4 / 3)}`} />
                  <Stat tone="plain" label="λ" value={`${LAMBDA}`} />
                </>
              ) : (
                <>
                  <Stat tone="plain" label="전체 G" value={active >= 1 ? fmt(TOTAL_G) : "?"} />
                  <Stat tone="plain" label="전체 H" value={active >= 1 ? fmt(TOTAL_H) : "?"} />
                  <Stat tone="plain" label="parent S_P" value={active >= 1 ? fmt(PARENT) : "?"} />
                </>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {CANDIDATES.map((c, i) => {
                const shown = active >= 2 + i;
                const chosen = active === 5 && c.gain === Math.max(...CANDIDATES.map((x) => x.gain));
                const rejected = active === 5 && c.gain <= 0;
                return (
                  <div
                    key={c.cut}
                    className={`rounded-lg border px-2 py-2 text-center ${chosen ? "border-primary bg-primary/10" : rejected ? "border-dashed border-red-600" : "border-border"}`}
                  >
                    <p className="text-[11px] text-muted-foreground">경계 {c.cut} Gain</p>
                    <p className={`mt-1 font-mono text-sm font-bold ${shown ? "" : "text-muted-foreground/50"}`}>{shown ? fmt(c.gain) : "?"}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground">{chosen ? "채택" : rejected ? "버림 (≤0)" : " "}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
