import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview TermLesson 예시 — 60㎡ 이하 3억, 초과 6억을 내는 두 leaf tree.
 * 가로축 = 면적(㎡), 세로축 = tree output(억). 55㎡는 R₁만, 75㎡는 R₂만 켜집니다.
 * h(55) = 3×1 + 6×0 = 3, h(75) = 3×0 + 6×1 = 6.
 */
const SPLIT = 60;
const LEAF_VALUES: readonly number[] = [3, 6];
const X_MIN = 40;
const X_MAX = 90;
const Y_MAX = 7;

const W = 360;
const H = 200;
const LEFT = 34;
const RIGHT = 14;
const TOP = 18;
const BASE = 160;

const sx = (area: number) => LEFT + ((area - X_MIN) / (X_MAX - X_MIN)) * (W - LEFT - RIGHT);
const sy = (value: number) => BASE - (value / Y_MAX) * (BASE - TOP);

const SCENES = [
  {
    label: "60㎡에서 두 칸으로 나눔",
    summary: "R₁ → 3억 · R₂ → 6억",
    sample: null,
    note: "Split 하나가 면적 축을 겹치지 않는 두 칸(leaf region)으로 나눕니다. 칸마다 상수 하나만 있어 함수가 계단 모양입니다.",
  },
  {
    label: "55㎡ 집",
    summary: "3×1 + 6×0 = 3억",
    sample: 55,
    note: "55㎡는 R₁에만 들어가 R₁ indicator(칸 안이면 1, 밖이면 0)만 1입니다. 6억 항에는 0이 곱해져 3억만 남습니다.",
  },
  {
    label: "75㎡ 집",
    summary: "3×0 + 6×1 = 6억",
    sample: 75,
    note: "75㎡는 R₂에만 들어가 3억 항이 0이 되고 6억만 남습니다. 어느 집이든 켜지는 칸은 정확히 하나입니다.",
  },
] as const;

const ACCENT = "#2563eb";
const MUTED = "#64748b";
const GRID = "#94a3b8";

export default function LeafStepViz() {
  return (
    <SceneShell
      eyebrow="Piecewise-constant tree"
      title="두 leaf tree는 면적 축 위의 계단입니다"
      description="가로축은 면적, 세로축은 tree가 내는 값(억)입니다. Leaf는 tree의 끝 칸이고, 위 TermLesson의 예시 tree(60㎡ 이하 3억, 초과 6억)를 그대로 씁니다. 0절에서 55㎡ 집에 2.4를 낸 residual tree와는 다른 tree입니다. 가로축 40–90㎡ 범위와 75㎡ 집은 그림을 위한 가정입니다."
      ariaLabel="60제곱미터 split으로 나뉜 두 leaf와 55, 75제곱미터 집이 받는 값"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sample = scene.sample;
        const activeLeaf = sample === null ? -1 : sample <= SPLIT ? 0 : 1;
        const segments = [
          { from: X_MIN, to: SPLIT, value: LEAF_VALUES[0], name: "R₁" },
          { from: SPLIT, to: X_MAX, value: LEAF_VALUES[1], name: "R₂" },
        ];
        return (
          <div className="min-w-0">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="mx-auto h-auto w-full max-w-[560px]"
              role="img"
              aria-label={`${scene.label}: ${scene.summary}`}
            >
              {[0, 3, 6].map((v) => (
                <g key={v}>
                  <line x1={LEFT} x2={W - RIGHT} y1={sy(v)} y2={sy(v)} stroke={GRID} strokeWidth={v === 0 ? 1 : 0.5} strokeDasharray={v === 0 ? undefined : "2 3"} />
                  <text x={LEFT - 6} y={sy(v) + 4} textAnchor="end" fontSize={11} fill={MUTED}>
                    {v}
                  </text>
                </g>
              ))}
              {segments.map((seg, i) => (
                <g key={seg.name}>
                  <rect
                    x={sx(seg.from)}
                    y={TOP}
                    width={sx(seg.to) - sx(seg.from)}
                    height={BASE - TOP}
                    fill={activeLeaf === i ? ACCENT : MUTED}
                    opacity={activeLeaf === i ? 0.1 : 0.04}
                  />
                  <line
                    x1={sx(seg.from)}
                    x2={sx(seg.to)}
                    y1={sy(seg.value)}
                    y2={sy(seg.value)}
                    stroke={activeLeaf === -1 || activeLeaf === i ? ACCENT : MUTED}
                    strokeWidth={1.25}
                    opacity={activeLeaf === -1 || activeLeaf === i ? 1 : 0.4}
                  />
                  <text
                    x={(sx(seg.from) + sx(seg.to)) / 2}
                    y={sy(seg.value) - 8}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={activeLeaf === -1 || activeLeaf === i ? ACCENT : MUTED}
                  >
                    {seg.name} = {seg.value}억
                  </text>
                </g>
              ))}
              <line x1={sx(SPLIT)} x2={sx(SPLIT)} y1={TOP} y2={BASE} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
              <text x={sx(SPLIT)} y={BASE + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={MUTED}>
                60㎡
              </text>
              <text x={sx(X_MIN)} y={BASE + 15} textAnchor="start" fontSize={11} fill={MUTED}>
                40
              </text>
              <text x={sx(X_MAX)} y={BASE + 15} textAnchor="end" fontSize={11} fill={MUTED}>
                90㎡
              </text>
              <text x={W - RIGHT} y={BASE + 32} textAnchor="end" fontSize={11} fill={MUTED}>
                면적 →
              </text>
              {sample !== null && (
                <g>
                  <line x1={sx(sample)} x2={sx(sample)} y1={BASE} y2={sy(LEAF_VALUES[activeLeaf])} stroke={ACCENT} strokeWidth={1} />
                  <circle cx={sx(sample)} cy={sy(LEAF_VALUES[activeLeaf])} r={4.5} fill={ACCENT} />
                  <text x={sx(sample)} y={BASE + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>
                    {sample}㎡
                  </text>
                </g>
              )}
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs sm:text-sm">
              {segments.map((seg, i) => {
                const on = activeLeaf === i;
                const off = activeLeaf !== -1 && !on;
                return (
                  <div
                    key={seg.name}
                    className={`rounded-lg border px-2 py-2 leading-5 ${on ? "border-primary bg-primary/10 font-bold" : "border-border"}`}
                  >
                    <span className="block">{seg.name} indicator</span>
                    <span className="block font-mono">
                      {activeLeaf === -1 ? "칸 안이면 1, 밖이면 0" :`${on ? 1 : 0} × ${seg.value} = ${on ? seg.value : 0}`}
                    </span>
                    {off && <span className="block text-muted-foreground">이 항은 0</span>}
                    {!off && <span className="block text-muted-foreground">{on ? "선택된 leaf" : " "}</span>}
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
