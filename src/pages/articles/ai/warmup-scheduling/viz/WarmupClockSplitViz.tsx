import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #composition — T=1000, W=100이면 main 길이 L=T−W=900, k=t−W.
 * Global 100 → k=0, 101 → k=1, 1000 → k=900.
 * 잘못된 조합: warmup 100 뒤 길이 1,000 cosine → 끝이 100+1,000=1,100.
 * 세로 위치는 모양만 보인 것(가정)이며 peak .001만 본문 값입니다.
 */
const T = 1000;
const W = 100;
const L = T - W;
const WRONG_L = 1000;
const WRONG_END = W + WRONG_L;
const AXIS_MAX = 1100;

const VW = 360;
const VH = 196;
const X0 = 24;
const X1 = 320;
const Y_PEAK = 40;
const Y_START = 118;
const Y_END = 124;
const Y_AXIS = 132;
const BAR_Y = 142;
const BAR_H = 16;

const xs = (t: number) => X0 + (t / AXIS_MAX) * (X1 - X0);
const cosineY = (k: number, length: number) => Y_END + ((Y_PEAK - Y_END) * (1 + Math.cos((Math.PI * k) / length))) / 2;
const cosinePath = (length: number) =>
  Array.from({ length: 61 }, (_, i) => (i / 60) * length)
    .map((k, i) => `${i === 0 ? "M" : "L"}${xs(W + k).toFixed(1)} ${cosineY(k, length).toFixed(1)}`)
    .join(" ");

const RIGHT_PATH = cosinePath(L);
const WRONG_PATH = cosinePath(WRONG_L);
const WRONG_AT_T = cosineY(T - W, WRONG_L);

const SCENES = [
  {
    label: "전체 budget을 둘로 나눕니다",
    summary: "L = 1,000 − 100 = 900",
    note: "Warmup이 처음 100 updates를 이미 씁니다. 그래서 main schedule에 남은 길이는 전체 T가 아니라 T−W=900이고, 두 구간을 합하면 정확히 1,000입니다.",
    rows: [
      ["전체 T", "1,000 updates"],
      ["warmup W", "global 0 → 100"],
      ["main L = T−W", "global 100 → 1,000 (900)"],
    ],
  },
  {
    label: "main은 local clock 0부터 셉니다",
    summary: "k = t − 100",
    note: "Main schedule은 global t를 그대로 받지 않고 warmup offset을 뺀 local cursor k를 받습니다. 경계 t=100에서 k=0이므로 main 첫 값 S(0)이 warmup 끝값 peak와 만납니다.",
    rows: [
      ["global t = 100", "k = 0 (peak .001)"],
      ["global t = 101", "k = 1"],
      ["global t = 1,000", "k = 900 = L (main 끝)"],
    ],
  },
  {
    label: "길이 1,000 cosine을 새로 붙이면",
    summary: "100 + 1,000 = 1,100",
    note: "Warmup 100 뒤에 길이 1,000짜리 cosine을 붙이면 schedule 끝이 global 1,100으로 밀립니다. Global 1,000에서 cursor는 k=900이라 이 cosine은 1,000 중 900만 지나 아직 끝에 닿지 않았습니다. 회색 점선은 비교용으로 남긴 길이 900 main입니다.",
    rows: [
      ["cosine 시작", "global 100 (k = 0)"],
      ["cosine 끝", "100 + 1,000 = global 1,100"],
      ["global t = 1,000", "k = 900 / 1,000 · 끝 전"],
    ],
  },
] as const;

export default function WarmupClockSplitViz() {
  return (
    <SceneShell
      eyebrow="Global clock 나누기"
      title="1,000 updates를 warmup 100과 main 900으로 나눕니다"
      description="가로축은 global update t입니다. 세로 위치는 곡선 모양만 보인 그림(가정)이며 본문 값은 peak .001뿐입니다. 아래 칸은 각 구간 길이입니다."
      ariaLabel="T=1000, W=100에서 warmup과 main schedule의 길이와 local cursor, 길이 1000 cosine을 잘못 붙였을 때 1100으로 밀리는 끝점"
      scenes={SCENES}
      render={(active) => {
        const wrong = active === 2;
        const mainEnd = wrong ? WRONG_END : T;
        return (
          <div className="min-w-0">
            <svg
              viewBox={`0 0 ${VW} ${VH}`}
              className="mx-auto block h-auto w-full max-w-[560px]"
              role="img"
              aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
            >
              <line x1={X0} x2={X1 + 8} y1={Y_AXIS} y2={Y_AXIS} stroke="#94a3b8" strokeWidth={1} />
              <line x1={xs(W)} x2={xs(W)} y1={24} y2={Y_AXIS} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 4" />
              <line x1={xs(T)} x2={xs(T)} y1={24} y2={BAR_Y + BAR_H} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
              <text x={xs(T)} y={18} textAnchor="middle" fontSize={12} fill="#64748b">T = 1,000</text>
              <path d={`M${X0} ${Y_START} L${xs(W)} ${Y_PEAK}`} fill="none" stroke="#d97706" strokeWidth={1.25} />
              <path
                d={RIGHT_PATH}
                fill="none"
                stroke={wrong ? "#94a3b8" : "#2563eb"}
                strokeWidth={1.25}
                strokeDasharray={wrong ? "4 4" : undefined}
              />
              {wrong && <path d={WRONG_PATH} fill="none" stroke="#dc2626" strokeWidth={1.25} />}
              {wrong && <circle cx={xs(T)} cy={WRONG_AT_T} r={3.5} fill="#dc2626" />}
              <circle cx={xs(W)} cy={Y_PEAK} r={3.5} fill="#2563eb" />
              <text x={xs(W) + 6} y={Y_PEAK - 6} fontSize={12} fontWeight={700} fill="#2563eb">
                peak .001{active >= 1 ? " · k=0" : ""}
              </text>
              <text x={X0} y={Y_START + 10} fontSize={11} fill="#b45309">start</text>
              {wrong && (
                <>
                  <line x1={xs(T) - 4} y1={WRONG_AT_T - 3} x2={xs(T) - 16} y2={100} stroke="#dc2626" strokeWidth={1} />
                  <text x={xs(T) - 18} y={98} textAnchor="end" fontSize={11} fill="#dc2626">k=900 · 끝 전</text>
                </>
              )}

              <rect x={xs(0)} y={BAR_Y} width={xs(W) - xs(0)} height={BAR_H} rx={2} fill="#fef3c7" stroke="#d97706" strokeWidth={1} />
              <text x={(xs(0) + xs(W)) / 2} y={BAR_Y + 11.5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#92400e">W</text>
              <rect
                x={xs(W)}
                y={BAR_Y}
                width={xs(mainEnd) - xs(W)}
                height={BAR_H}
                rx={2}
                fill={wrong ? "#fee2e2" : "#dbeafe"}
                stroke={wrong ? "#dc2626" : "#2563eb"}
                strokeWidth={1}
              />
              <text x={(xs(W) + xs(T)) / 2} y={BAR_Y + 11.5} textAnchor="middle" fontSize={12} fontWeight={700} fill={wrong ? "#991b1b" : "#1e3a8a"}>
                {wrong ? "cosine 길이 1,000" : "main L = 900"}
              </text>

              <text x={xs(0)} y={BAR_Y + BAR_H + 16} textAnchor="middle" fontSize={12} fill="#64748b">0</text>
              <text x={xs(W)} y={BAR_Y + BAR_H + 16} textAnchor="middle" fontSize={12} fill="#64748b">100</text>
              <text x={wrong ? xs(T) + 3 : xs(T)} y={BAR_Y + BAR_H + 16} textAnchor={wrong ? "end" : "middle"} fontSize={12} fill="#64748b">1,000</text>
              {wrong && (
                <text x={xs(WRONG_END) + 12} y={BAR_Y + BAR_H + 16} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">1,100</text>
              )}
              <text x={X1 + 8} y={VH - 2} textAnchor="end" fontSize={11} fill="#64748b">global update t</text>
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((scene) => (
                <dl key={scene.label} className="grid gap-px overflow-hidden rounded-lg border border-border bg-border text-xs sm:text-sm">
                  {scene.rows.map(([name, value]) => (
                    <div key={name} className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2 bg-background px-3 py-2">
                      <dt className="font-mono text-muted-foreground">{name}</dt>
                      <dd className="font-mono font-semibold">{value}</dd>
                    </div>
                  ))}
                </dl>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
