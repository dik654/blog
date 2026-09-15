import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: denominator 절 — 팔 수 없는 용량을 분모에서 빼면 단가가 달라진다 */
const SCENES = [
  "한 대뿐이면 뺄 예비가 없습니다",
  "두 대면 한 대가 예비입니다",
  "네 대면 셋을 팝니다",
  "여덟 대면 일곱을 팝니다",
] as const;

/** 노드 한 대의 월 비용과, 60퍼센트 가동에서 한 달에 만드는 토큰 */
const OWN_MONTHLY = 14650;
const TOK_PER_GPU_S = 2500;
const GPUS = 8;
const UTIL = 0.6;
const TOK_PER_NODE_MONTH = GPUS * TOK_PER_GPU_S * UTIL * 86400 * 30;

const SIZES = [1, 2, 4, 8] as const;

/** 한 대가 빠져도 지킬 수 있는 만큼만 판다 */
const sellable = (n: number) => (n > 1 ? n - 1 : 1);
const perMillion = (n: number) =>
  (OWN_MONTHLY * n) / (TOK_PER_NODE_MONTH * sellable(n)) * 1e6;
/** 예비를 빼지 않았을 때의 기준값 */
const BASE = (OWN_MONTHLY / TOK_PER_NODE_MONTH) * 1e6;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const usd = (v: number) => "$" + v.toFixed(3);

const X0 = 120;
const BAR_W = 240;
const MAX = 1.0;

export default function DenominatorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const s = scenes.active;
  const n = SIZES[s];

  const NOTES = [
    `노드 한 대를 ${UTIL * 100}퍼센트로 돌리면 한 달에 ${(TOK_PER_NODE_MONTH / 1e9).toFixed(1)}B 토큰이 나오고, 월 비용을 그대로 나누면 ${usd(BASE)}입니다. 그런데 한 대뿐이면 그 한 대가 빠졌을 때 대신할 것이 없으므로 이 값은 팔 수 있는 단가가 아닙니다.`,
    `두 대를 두면 한 대가 빠져도 나머지 한 대로 버팁니다. 비용은 두 배인데 팔 수 있는 양은 그대로라 단가가 ${usd(perMillion(2))}으로 정확히 두 배가 됩니다. 예비를 갖는 값이 이 차이입니다.`,
    `네 대면 한 대를 빼고 셋을 팝니다. 비용은 네 배, 파는 양은 세 배라 단가가 ${usd(perMillion(4))}입니다. 두 대일 때보다 크게 내려왔지만 아직 기준값 ${usd(BASE)}보다는 높습니다.`,
    `여덟 대면 일곱을 팔아 ${usd(perMillion(8))}입니다. 대수를 늘릴수록 기준값에 가까워지지만 닿지는 않습니다. 앞 글의 안전 가동률과 같은 식이고, 여기서는 그 값이 그대로 토큰 단가에 붙습니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="분모에서 무엇을 빼는가"
      title="팔 수 없는 예비 용량은 분모가 아니라 분자입니다"
      description="한 대가 빠져도 약속을 지키려면 그만큼은 비워 두어야 하고, 그 값은 남은 용량의 단가에 얹힙니다."
      note="소유 기준이고 가동률은 60퍼센트로 고정했습니다. 노드마다 같은 모델이 떠 있어 빠진 몫이 고르게 나뉜다고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="예비 용량을 뺀 뒤의 토큰 단가"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[s]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text x={14} y={24} fontSize={8} fontWeight={700} fill={MUTED}>
                가진 노드
              </text>
              {Array.from({ length: 8 }, (_, i) => {
                const owned = i < n;
                const spare = owned && n > 1 && i === n - 1;
                return (
                  <rect
                    key={i}
                    x={120 + i * 22}
                    y={14}
                    width={18}
                    height={14}
                    fill={spare ? WARN : owned ? OK : MUTED}
                    fillOpacity={owned ? 0.4 : 0.08}
                    stroke={spare ? WARN : owned ? OK : MUTED}
                    strokeWidth={1}
                    strokeOpacity={owned ? 1 : 0.25}
                  />
                );
              })}
              <text x={120 + 8 * 22 + 8} y={25} fontSize={8} fill={MUTED}>
                {n > 1 ? "붉은 칸이 예비" : "예비 없음"}
              </text>

              <text x={14} y={52} fontSize={8} fontWeight={700} fill={MUTED}>
                월 비용
              </text>
              <text x={120} y={52} fontSize={10} fontWeight={700} fill={ACCENT}>
                ${(OWN_MONTHLY * n).toLocaleString("en-US")}
              </text>
              <text x={220} y={52} fontSize={8} fill={MUTED}>
                노드 {n}대 × ${OWN_MONTHLY.toLocaleString("en-US")}
              </text>

              <text x={14} y={74} fontSize={8} fontWeight={700} fill={MUTED}>
                팔 수 있는 양
              </text>
              <text x={120} y={74} fontSize={10} fontWeight={700} fill={OK}>
                {((TOK_PER_NODE_MONTH * sellable(n)) / 1e9).toFixed(1)}B
              </text>
              <text x={220} y={74} fontSize={8} fill={MUTED}>
                {sellable(n)}대분 · 한 대가 빠져도 지킬 수 있는 만큼
              </text>

              <line x1={14} y1={88} x2={452} y2={88} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />

              <text x={14} y={108} fontSize={8} fontWeight={700} fill={MUTED}>
                100만 토큰당
              </text>

              {SIZES.map((size, i) => {
                const y = 100 + i * 22;
                const active = size === n;
                const w = (Math.min(perMillion(size), MAX) / MAX) * BAR_W;
                return (
                  <g key={size} opacity={active ? 1 : 0.32}>
                    <text x={X0 - 8} y={y + 11} textAnchor="end" fontSize={8.5} fontWeight={700} fill={active ? ACCENT : MUTED}>
                      {size}대
                    </text>
                    <rect
                      x={X0}
                      y={y}
                      width={Math.max(w, 1)}
                      height={14}
                      fill={active ? ACCENT : MUTED}
                      fillOpacity={active ? 0.42 : 0.2}
                      stroke={active ? ACCENT : MUTED}
                      strokeWidth={1}
                    />
                    <text x={X0 + w + 6} y={y + 11} fontSize={9.5} fontWeight={700} fill={active ? ACCENT : MUTED}>
                      {usd(perMillion(size))}
                    </text>
                  </g>
                );
              })}

              <line
                x1={X0 + (BASE / MAX) * BAR_W}
                y1={96}
                x2={X0 + (BASE / MAX) * BAR_W}
                y2={190}
                stroke={OK}
                strokeWidth={1}
                strokeDasharray="3 2"
              />
              <text x={X0 + (BASE / MAX) * BAR_W + 4} y={196} fontSize={8} fontWeight={700} fill={OK}>
                예비를 빼지 않았을 때 {usd(BASE)}
              </text>
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
