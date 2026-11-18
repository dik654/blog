import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #base-fee — "gas used가 2T일 때 +12.5%, 0일 때 −12.5%, 작은 base fee에서는 최소 1 wei 규칙".
 * 가로축 = parent gas used(0 ~ 30M), 세로축 = 다음 base fee의 변화율.
 * Mainnet 예시 E=2, D=8, limit 30M → T=15M. 변화율 = (Uₚ−T)/(T·8) → 0일 때 −12.5%, 30M일 때 +12.5%.
 * 작은 base fee 7 wei는 설명용 가정: 7 × 3M ÷ 15M ÷ 8 = 0.175 wei → 버림 0.
 *   증가 분기: max(0, 1 wei) = 1 wei → 8 wei(+14.3%). 감소 분기(12M): 7 − 0 = 7 wei(0%).
 */
const LIMIT = 30_000_000;
const W = 360;
const H = 196;
const X0 = 46;
const X1 = 340;
const Y_MID = 92;
const Y_SPAN = 70;
const P_MAX = 16;
const px = (used: number) => X0 + (used / LIMIT) * (X1 - X0);
const py = (pct: number) => Y_MID - (pct / P_MAX) * Y_SPAN;
const linePct = (used: number) => ((used - LIMIT / 2) / (LIMIT / 2) / 8) * 100;

const SCENES = [
  {
    label: "Target과 같으면",
    summary: "15M 사용 · 20 → 20 gwei",
    used: 15_000_000,
    actual: 0,
    from: "20 gwei",
    to: "20 gwei",
    calc: "Uₚ = T → 추가 연산 없음",
    note: "Gas limit 30M ÷ elasticity 2 = target 15M입니다. Parent가 정확히 15M을 쓰면 유지 분기라 20 gwei 그대로입니다.",
  },
  {
    label: "본문 예시 18M",
    summary: "+2.5% · 20 → 20.5 gwei",
    used: 18_000_000,
    actual: 2.5,
    from: "20 gwei",
    to: "20.5 gwei",
    calc: "20 gwei × 3M ÷ 15M ÷ 8 = 0.5 gwei",
    note: "Target보다 20% 많이 쓴 본문 예시입니다. 20% ÷ 8 = 2.5%만큼 올라 20.5 gwei가 되며, 직선 위의 한 점입니다.",
  },
  {
    label: "최대 2T = 30M",
    summary: "+12.5% · 20 → 22.5 gwei",
    used: 30_000_000,
    actual: 12.5,
    from: "20 gwei",
    to: "22.5 gwei",
    calc: "20 gwei × 15M ÷ 15M ÷ 8 = 2.5 gwei",
    note: "최대 2T(= 30M)는 target보다 100% 많이 쓴 경우라 100% ÷ 8 = 12.5%가 비율상 최대 상승폭입니다.",
  },
  {
    label: "사용량 0",
    summary: "−12.5% · 20 → 17.5 gwei",
    used: 0,
    actual: -12.5,
    from: "20 gwei",
    to: "17.5 gwei",
    calc: "20 gwei × 15M ÷ 15M ÷ 8 = 2.5 gwei 감소",
    note: "사용량 0은 target보다 100% 적게 쓴 경우라 12.5% 내려 17.5 gwei가 됩니다. 여기까지는 모두 한 직선 위에 있습니다.",
  },
  {
    label: "작은 base fee · 증가",
    summary: "7 wei(가정) → 8 wei · +14.3%",
    used: 18_000_000,
    actual: (1 / 7) * 100,
    from: "7 wei (가정)",
    to: "8 wei",
    calc: "7 × 3M ÷ 15M ÷ 8 = 0.175 → 버림 0 → 최소 1 wei",
    note: "wei는 ETH의 최소 정수 단위입니다(1 gwei = 10⁹ wei). Parent base fee가 7 wei(가정)이면 증가분 0.175 wei가 버림으로 0이 되고, 증가 분기가 최소 1 wei를 더해 8 wei(약 +14.3%)가 됩니다.",
  },
  {
    label: "작은 base fee · 감소",
    summary: "7 wei(가정) → 7 wei · 0%",
    used: 12_000_000,
    actual: 0,
    from: "7 wei (가정)",
    to: "7 wei",
    calc: "7 × 3M ÷ 15M ÷ 8 = 0.175 → 버림 0 → 7 − 0",
    note: "12M 사용이면 감소분 0.175 wei도 버림 뒤 0입니다. 감소 분기는 saturating subtraction(0 아래로 내려가지 않는 뺄셈)만 하고 최소 1 wei 규칙이 없어 7 wei 그대로입니다.",
  },
] as const;

const LABELS = SCENES.map((scene) => scene.label);
const NOTES = SCENES.map((scene) => scene.note);

function Chart({ active }: { active: number }) {
  const scene = SCENES[active];
  const onLine = linePct(scene.used);
  const off = Math.abs(onLine - scene.actual) > 0.01;
  const cx = px(scene.used);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
      <line x1={X0} x2={X1} y1={Y_MID} y2={Y_MID} stroke="#94a3b8" strokeWidth={1} />
      <line x1={X0} x2={X0} y1={py(P_MAX)} y2={py(-P_MAX)} stroke="#94a3b8" strokeWidth={1} />
      {[12.5, 0, -12.5].map((pct) => (
        <text key={pct} x={X0 - 6} y={py(pct) + 4} textAnchor="end" fontSize={10} fill="#64748b">
          {pct > 0 ? `+${pct}%` : pct < 0 ? `−${Math.abs(pct)}%` : "0%"}
        </text>
      ))}
      {[12.5, -12.5].map((pct) => (
        <line key={pct} x1={X0} x2={X1} y1={py(pct)} y2={py(pct)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
      ))}
      <line x1={px(0)} y1={py(-12.5)} x2={px(LIMIT)} y2={py(12.5)} stroke="#2563eb" strokeWidth={1.25} />
      <line x1={px(LIMIT / 2)} x2={px(LIMIT / 2)} y1={py(P_MAX)} y2={py(-P_MAX)} stroke="#cbd5e1" strokeWidth={1} strokeDasharray="2 3" />
      {[
        [0, "0"],
        [LIMIT / 2, "15M = T"],
        [LIMIT, "30M = 2T"],
      ].map(([used, label]) => (
        <text
          key={label}
          x={px(Number(used))}
          y={H - 16}
          textAnchor={used === 0 ? "start" : used === LIMIT ? "end" : "middle"}
          fontSize={10}
          fill="#64748b"
        >
          {label}
        </text>
      ))}
      <text x={(X0 + X1) / 2} y={H - 3} textAnchor="middle" fontSize={10} fill="#64748b">
        parent gas used
      </text>
      <line x1={cx} x2={cx} y1={Y_MID} y2={py(scene.actual)} stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" />
      {off ? <circle cx={cx} cy={py(onLine)} r={4.5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.25} /> : null}
      {off ? (
        <text x={cx + 8} y={py(onLine) + 4} fontSize={10} fill="#2563eb">
          {`직선대로면 ${onLine > 0 ? "+" : "−"}${Math.abs(onLine)}%`}
        </text>
      ) : null}
      <circle cx={cx} cy={py(scene.actual)} r={5} fill={off ? "#d97706" : "#2563eb"} />
      <text
        x={scene.used >= LIMIT * 0.8 ? cx - 9 : cx + 9}
        y={py(scene.actual) + (off ? -4 : scene.actual < 0 ? 14 : -8)}
        textAnchor={scene.used >= LIMIT * 0.8 ? "end" : "start"}
        fontSize={11}
        fontWeight={700}
        fill={off ? "#b45309" : "#1d4ed8"}
      >
        {`실제 ${scene.actual > 0 ? "+" : scene.actual < 0 ? "−" : ""}${Math.abs(Math.round(scene.actual * 10) / 10)}%`}
      </text>
    </svg>
  );
}

export default function BaseFeeChangeRangeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6200, { loop: false });
  const active = scenes.active;
  return (
    <VizFrame
      eyebrow="Base fee 변화 범위"
      title="변화율은 사용량에 비례하지만 작은 base fee에서는 직선을 벗어납니다"
      description="Mainnet 예시의 gas limit 30M, elasticity 2, denominator 8을 씁니다. 파란 직선은 정수 버림이 없을 때의 변화율, 점은 정수 규칙을 적용한 실제 변화율입니다."
      note="7 wei는 1 wei 규칙을 보이려는 설명용 가정이며 네트워크 현재값이 아닙니다. Custom chain은 다른 계수를 쓸 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Parent gas used에 따른 다음 base fee 변화율과 작은 base fee의 정수 규칙"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-3 min-w-0">
          <Chart active={active} />
        </div>
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y border-border py-2 text-center text-xs">
              <div className="min-w-0">
                <span className="block text-[10px] text-muted-foreground">parent base fee</span>
                <strong className="block break-keep">{scene.from}</strong>
              </div>
              <span className="font-bold text-primary">→</span>
              <div className="min-w-0">
                <span className="block text-[10px] text-muted-foreground">다음 base fee</span>
                <strong className="block break-keep">{scene.to}</strong>
              </div>
              <p className="col-span-3 break-keep font-mono text-[11px] text-muted-foreground">{scene.calc}</p>
            </div>
          ))}
        />
        <StableSceneStack
          active={active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={["Target", "18M", "30M", "0", "작은 증가", "작은 감소"]} playLabel="Base fee 변화 범위 재생" />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
