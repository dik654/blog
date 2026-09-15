import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: fleet-size 절의 ExplainedFormula — 대수를 늘리면 장애는 잦아지고 안전 가동률은 올라간다 */
const SCENES = [
  "두 대 · 장애는 드물지만 못 버팁니다",
  "여덟 대 · 한 대가 빠져도 넘지 않습니다",
  "예순네 대 · 한 달에 한 번쯤 옵니다",
  "만 육천 장 · 세 시간에 한 번 옵니다",
] as const;

/** 실측에서 역산한 가속기 한 장의 평균 무고장 시간 (시간) */
const MTBF_UNIT = 50677;
/** 장면마다의 플릿 크기 */
const SIZES = [2, 8, 64, 16384] as const;
/** 한 대가 빠지기 전 각 대의 가동률 */
const BASE_LOAD = 0.6;

const interval = (n: number) => MTBF_UNIT / n;
const safeUtil = (n: number) => (n - 1) / n;
const loadAfterLoss = (n: number) => (BASE_LOAD * n) / (n - 1);

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

const fmtInterval = (h: number) =>
  h >= 48 ? `${Math.round(h / 24)}일` : `${h.toFixed(1)}시간`;
const pct = (v: number) => {
  const x = v * 100;
  const s = x >= 99.9 && x < 100 ? x.toFixed(2) : x.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
};

const X0 = 130;
const XW = 280;
/** 로그 축 — 2에서 16384까지 */
const px = (n: number) =>
  X0 + (Math.log2(n) - 1) / (Math.log2(16384) - 1) * XW;

export default function FleetSizeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const s = scenes.active;
  const n = SIZES[s];
  const over = loadAfterLoss(n) > 1;

  const NOTES = [
    `두 대를 각각 ${Math.round(BASE_LOAD * 100)}퍼센트로 돌리다 한 대가 죽으면 남은 한 대가 ${pct(loadAfterLoss(2))}퍼센트를 받습니다. 장애는 평균 ${fmtInterval(interval(2))}에 한 번으로 드물지만 올 때마다 감당이 안 됩니다. 안전하게 팔 수 있는 것은 절반뿐입니다.`,
    `여덟 대면 한 대가 빠져도 남은 일곱이 ${pct(loadAfterLoss(8))}퍼센트로 버팁니다. 안전 가동률이 ${pct(safeUtil(8))}퍼센트까지 올라갔습니다. 대신 장애 간격이 ${fmtInterval(interval(8))}로 줄어 여덟 달에 한 번쯤 겪게 됩니다.`,
    `예순네 대에서는 한 대가 빠져도 ${pct(loadAfterLoss(64))}퍼센트라 표가 거의 안 납니다. 안전 가동률은 ${pct(safeUtil(64))}퍼센트입니다. 그 대가로 장애는 ${fmtInterval(interval(64))}에 한 번, 한 달에 한 번꼴로 옵니다. 이 규모부터는 장애 처리가 사건이 아니라 일과가 됩니다.`,
    `만 육천 장 규모에서는 장애가 ${fmtInterval(interval(16384))}에 한 번 옵니다. 그런데도 돌아가는 이유는 안전 가동률이 ${pct(safeUtil(16384))}퍼센트라 한 장이 빠져도 아무 표가 안 나기 때문입니다. 잦음과 감당은 반대로 움직입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="대수를 늘리면 무엇이 좋아지고 무엇이 나빠지는가"
      title="장애는 잦아지고 한 대가 빠진 뒤의 부담은 가벼워집니다"
      description="같은 대수 하나가 두 값을 반대 방향으로 움직이기 때문에, 작은 플릿이 안전하다는 직관이 뒤집힙니다."
      note="가속기 한 장의 평균 무고장 시간을 공개된 대규모 실측에서 역산해 고정한 뒤, 고장이 서로 독립이라고 둔 계산입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="플릿 크기에 따른 장애 간격과 안전 가동률"
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
              <text x={14} y={30} fontSize={8} fontWeight={700} fill={MUTED}>
                장애 간격
              </text>
              <text x={14} y={70} fontSize={8} fontWeight={700} fill={MUTED}>
                안전 가동률
              </text>

              {SIZES.map((size) => {
                const x = px(size);
                const active = size === n;
                return (
                  <g key={size}>
                    <text
                      x={x}
                      y={30}
                      textAnchor="middle"
                      fontSize={active ? 11 : 8.5}
                      fontWeight={700}
                      fill={active ? WARN : MUTED}
                      fillOpacity={active ? 1 : 0.45}
                    >
                      {fmtInterval(interval(size))}
                    </text>
                    <text
                      x={x}
                      y={70}
                      textAnchor="middle"
                      fontSize={active ? 11 : 8.5}
                      fontWeight={700}
                      fill={active ? OK : MUTED}
                      fillOpacity={active ? 1 : 0.45}
                    >
                      {pct(safeUtil(size))}%
                    </text>
                    <line
                      x1={x}
                      y1={80}
                      x2={x}
                      y2={96}
                      stroke={active ? ACCENT : MUTED}
                      strokeWidth={active ? 1.25 : 0.75}
                      strokeOpacity={active ? 1 : 0.4}
                    />
                    <text
                      x={x}
                      y={110}
                      textAnchor="middle"
                      fontSize={active ? 10 : 8.5}
                      fontWeight={700}
                      fill={active ? ACCENT : MUTED}
                      fillOpacity={active ? 1 : 0.45}
                    >
                      {size}대
                    </text>
                  </g>
                );
              })}

              <line x1={14} y1={96} x2={X0 + XW + 20} y2={96} stroke={MUTED} strokeWidth={0.75} />

              <line x1={14} y1={126} x2={X0 + XW + 20} y2={126} stroke={MUTED} strokeWidth={0.75} strokeOpacity={0.4} />
              <text x={14} y={144} fontSize={8} fontWeight={700} fill={MUTED}>
                한 대가 빠지면
              </text>
              <text x={X0} y={144} fontSize={9} fill={MUTED}>
                각 {Math.round(BASE_LOAD * 100)}퍼센트로 돌리다 한 대를 잃으면 남은 대가 받는 부하
              </text>

              <rect
                x={X0}
                y={152}
                width={Math.min(loadAfterLoss(n), 1.3) * 200}
                height={16}
                fill={over ? WARN : OK}
                fillOpacity={0.35}
                stroke={over ? WARN : OK}
                strokeWidth={1}
              />
              <line x1={X0 + 200} y1={148} x2={X0 + 200} y2={172} stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
              <text x={X0 + 200} y={184} textAnchor="middle" fontSize={8} fill={MUTED}>
                100%
              </text>
              <text
                x={X0 + Math.min(loadAfterLoss(n), 1.3) * 200 + 8}
                y={165}
                fontSize={11}
                fontWeight={700}
                fill={over ? WARN : OK}
              >
                {pct(loadAfterLoss(n))}%
              </text>
              <text
                x={470}
                y={165}
                textAnchor="end"
                fontSize={9}
                fontWeight={700}
                fill={over ? WARN : OK}
              >
                {over ? "넘칩니다" : "버팁니다"}
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
