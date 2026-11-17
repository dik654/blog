import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proper-score — 실제 p=.7일 때 보고값 q에 따른 expected Brier loss.
 * 양성 branch p(1−q)², 음성 branch (1−p)q², 합 R(q). R(.7)=.21, R(.9)=.25 → 차이 .04 = (.9−.7)².
 */
const P = 0.7;
const Q_BAD = 0.9;

const pos = (q: number) => P * (1 - q) ** 2;
const neg = (q: number) => (1 - P) * q ** 2;
const risk = (q: number) => pos(q) + neg(q);

const SCENES: readonly { label: string; summary: string; show: readonly boolean[]; note: string }[] = [
  {
    label: "Positive branch: p(1 − q)²",
    summary: "q를 올릴수록 작아짐",
    show: [true, false, false],
    note: "실제 결과가 positive(Y=1)일 확률 .7에 그때의 오류 (1 − q)²를 곱합니다. q를 높게 보고할수록 이 branch의 loss는 줄어듭니다.",
  },
  {
    label: "Negative branch: (1 − p)q²",
    summary: "q를 올릴수록 커짐",
    show: [true, true, false],
    note: "결과가 negative(Y=0)일 확률 .3에 그때의 오류 q²를 곱합니다. 높게 보고할수록 이 branch의 loss는 커집니다.",
  },
  {
    label: "두 branch의 합 R(q)",
    summary: "q = .7에서 최소 .21",
    show: [true, true, true],
    note: "한쪽은 줄고 한쪽은 느는 두 곡선을 더하면 그릇 모양이 되고 바닥은 실제 p = .7에 있습니다. R(.7) = .7 × .09 + .3 × .49 = .21입니다.",
  },
  {
    label: "q = .9로 과장하면",
    summary: "추가 loss .04 = (.9 − .7)²",
    show: [false, false, true],
    note: "R(.9) = .7 × .01 + .3 × .81 = .25이므로 정직한 보고보다 .04가 늘어납니다. 같은 거리만큼 낮춘 q = .5도 R = .25로 같은 .04를 잃습니다.",
  },
];

const COLORS: readonly string[] = ["#d97706", "#64748b", "#2563eb"];
/** 색만으로 곡선을 가르지 않도록 선 모양도 다르게 둡니다: positive 긴 점선, negative 짧은 점선, 합 실선. */
const DASHES: readonly (string | undefined)[] = ["6 3", "1.5 2.5", undefined];
const X0 = 44;
const X1 = 340;
const Y0 = 196;
const Y1 = 20;
const Y_MAX = 0.7;

const sx = (q: number) => X0 + q * (X1 - X0);
const sy = (v: number) => Y0 - (v / Y_MAX) * (Y0 - Y1);

function pathOf(fn: (q: number) => number) {
  return Array.from({ length: 51 }, (_, index) => index / 50)
    .map((q, index) => `${index === 0 ? "M" : "L"}${sx(q).toFixed(1)} ${sy(fn(q)).toFixed(1)}`)
    .join(" ");
}

const PATHS = [pathOf(pos), pathOf(neg), pathOf(risk)];
const NAMES: readonly string[] = ["positive branch", "negative branch", "합 R(q)"];

export default function BrierRegretViz() {
  return (
    <SceneShell
      eyebrow="Brier · 실제 p = .7"
      title="보고값 q를 바꾸면 expected loss가 어떻게 변하나"
      description="가로축은 model이 보고한 probability q, 세로축은 expected Brier loss입니다. 실제 positive probability는 본문 예처럼 .7입니다."
      ariaLabel="실제 p가 .7일 때 보고값 q에 따른 두 branch loss와 합계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 230" role="img" aria-label={scene.label} className="mx-auto block h-auto w-full max-w-[30rem]">
              <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94a3b8" strokeWidth="1" />
              <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#94a3b8" strokeWidth="1" />
              {[0, 0.5, 0.7, 0.9, 1].map((q) => (
                <text key={q} x={sx(q)} y={Y0 + 14} textAnchor="middle" className="fill-muted-foreground text-[12px]">
                  {q === 0 ? "0" : q === 1 ? "1" : String(q).slice(1)}
                </text>
              ))}
              {[0, 0.2, 0.4, 0.6].map((v) => (
                <text key={v} x={X0 - 6} y={sy(v) + 3} textAnchor="end" className="fill-muted-foreground text-[12px]">
                  {v === 0 ? "0" : String(v).slice(1)}
                </text>
              ))}
              <text x={X1} y={Y0 + 28} textAnchor="end" className="fill-muted-foreground text-[12px]">
                보고값 q →
              </text>
              <line x1={sx(P)} y1={Y0} x2={sx(P)} y2={Y1} stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
              <text x={sx(P) - 4} y={Y1 + 8} textAnchor="end" className="fill-muted-foreground text-[12px]">
                실제 p
              </text>
              {PATHS.map((d, index) => (
                <path
                  key={index}
                  d={d}
                  fill="none"
                  stroke={COLORS[index]}
                  strokeWidth={index === 2 ? 1.25 : 1}
                  strokeDasharray={DASHES[index]}
                  opacity={scene.show[index] ? 1 : 0.15}
                />
              ))}
              <g opacity={active >= 2 ? 1 : 0}>
                <circle cx={sx(P)} cy={sy(risk(P))} r="3.5" fill={COLORS[2]} />
                <text x={sx(P) - 7} y={sy(risk(P)) + 15} textAnchor="end" className="fill-foreground text-[12px] font-bold">
                  .21
                </text>
              </g>
              <g opacity={active === 3 ? 1 : 0}>
                <line x1={sx(Q_BAD)} y1={sy(risk(P))} x2={sx(Q_BAD)} y2={sy(risk(Q_BAD))} stroke="#dc2626" strokeWidth="1.25" />
                <line x1={sx(P)} y1={sy(risk(P))} x2={sx(Q_BAD)} y2={sy(risk(P))} stroke="#dc2626" strokeWidth="1" strokeDasharray="3 3" />
                <circle cx={sx(Q_BAD)} cy={sy(risk(Q_BAD))} r="3.5" fill="#dc2626" />
                <text x={sx(Q_BAD)} y={sy(risk(Q_BAD)) - 14} textAnchor="middle" className="fill-foreground text-[12px] font-bold">
                  .25 (+.04)
                </text>
              </g>
            </svg>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {NAMES.map((name, index) => (
                <span key={name} className="inline-flex items-center gap-1.5" style={{ opacity: scene.show[index] ? 1 : 0.4 }}>
                  <svg width="20" height="6" aria-hidden="true" className="shrink-0">
                    <line x1="0" y1="3" x2="20" y2="3" stroke={COLORS[index]} strokeWidth={index === 2 ? 1.25 : 1} strokeDasharray={DASHES[index]} />
                  </svg>
                  {name}
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
