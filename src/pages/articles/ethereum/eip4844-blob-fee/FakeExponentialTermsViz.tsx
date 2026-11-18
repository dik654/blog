import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #integer-fee — fake_exponential(1, 1,048,576, 11,684,671)의 정수 항.
 * a₀ = 1 × d, a_i = floor(a_{i−1} × n / d) ÷ i (정수 나눗셈), 항이 0이 되면 멈춘다.
 * 합 12,781,734 ÷ 11,684,671 = 1 (나머지 1,097,063). 2가 되려면 합이 23,369,342 이상이어야 한다.
 * 같은 계산으로 excess 61개분의 합은 23,162,645(→1), 62개분은 23,423,935(→2)이다.
 */
const D = 11_684_671;
const TWO_D = 2 * D;

const TERMS = [
  { name: "a₀", formula: "1 × d", product: null, value: 11_684_671 },
  { name: "a₁", product: 1_048_576, value: 1_048_576 },
  { name: "a₂", product: 94_098, value: 47_049 },
  { name: "a₃", product: 4_222, value: 1_407 },
  { name: "a₄", product: 126, value: 31 },
  { name: "a₅", product: 2, value: 0 },
] as const;

const SUMS = TERMS.map((_, index) =>
  TERMS.slice(0, index + 1).reduce<number>((sum, term) => sum + term.value, 0),
);
const TOTAL = SUMS[SUMS.length - 1];

const SCENES = [
  { label: "첫 항", summary: "a₀ = 11,684,671", shown: 1, compare: false, note: "최소 가격 f=1에 update fraction d=11,684,671을 곱해 시작합니다. 합을 마지막에 d로 나누므로 이 항 하나만으로 가격 1이 됩니다. 점선 2는 가격이 2가 되는 데 필요한 합 23,369,342입니다." },
  { label: "둘째 항", summary: "a₁ = 1,048,576", shown: 2, compare: false, note: "앞 항 11,684,671에 n=1,048,576(excess 8개분)을 곱하고 d로 나누면 정확히 1,048,576입니다. 첫 항은 d와 같아서 둘째 항은 n과 같아집니다." },
  { label: "셋째 항", summary: "94,098 ÷ 2 = 47,049", shown: 3, compare: false, note: "1,048,576×1,048,576÷11,684,671의 나머지를 버리면 94,098, 다시 2로 나눈 몫은 47,049입니다. 각 나눗셈에서 소수점 아래를 버립니다." },
  { label: "넷째 항", summary: "4,222 ÷ 3 = 1,407", shown: 4, compare: false, note: "n/d가 1보다 작고 매번 i로도 나누므로 항이 빠르게 작아집니다. 막대에서는 거의 보이지 않을 만큼 작습니다." },
  { label: "다섯째 항", summary: "126 ÷ 4 = 31", shown: 5, compare: false, note: "31까지 더한 합은 12,781,734입니다. 아직 점선 2까지는 1,000만 이상 모자랍니다." },
  { label: "항이 0", summary: "2 ÷ 5 = 0 → 멈춤", shown: 6, compare: false, note: "31×1,048,576÷11,684,671의 몫은 2이고 이를 5로 나누면 0입니다. 항이 0이 되면 반복을 멈춥니다. 더할 항이 더는 없습니다." },
  { label: "마지막 나눗셈", summary: "12,781,734 ÷ 11,684,671 = 1", shown: 6, compare: false, note: "합을 d로 나눈 몫은 1, 나머지 1,097,063은 버립니다. 그래서 excess가 8개분으로 늘어도 자식 기본료는 1 wei/blob gas입니다." },
  { label: "61 대 62", summary: "61개분 → 1 · 62개분 → 2", shown: 6, compare: true, note: "같은 반복을 excess 61개분에 돌리면 합이 23,162,645로 점선 2에 못 미쳐 1이고, 62개분이면 23,423,935로 점선을 넘어 2입니다. 본문의 62개분 경계가 이 비교입니다." },
] as const;

const W = 420;
const H = 146;
const LEFT = 70;
const RIGHT = 14;
const X_MAX = 24_000_000;
const x = (value: number) => LEFT + (value / X_MAX) * (W - LEFT - RIGHT);
const ROWS = [
  { key: "e8", label: "excess 8", y: 14 },
  { key: "e61", label: "excess 61", y: 56, sum: 23_162_645, fee: 1 },
  { key: "e62", label: "excess 62", y: 92, sum: 23_423_935, fee: 2 },
] as const;
const BAR_H = 22;

function SumChart({ active }: { active: number }) {
  const scene = SCENES[active];
  const shownSum = SUMS[scene.shown - 1];
  const finalShown = active >= 6;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${scene.label}: 누적 합 ${shownSum.toLocaleString("en-US")}`}>
      {[
        { value: D, label: "d · 가격 1" },
        { value: TWO_D, label: "2d · 가격 2" },
      ].map((tick) => (
        <g key={tick.label}>
          <line x1={x(tick.value)} x2={x(tick.value)} y1={8} y2={122} stroke="#94a3b8" strokeWidth={1} strokeDasharray={tick.value === TWO_D ? "4 4" : undefined} />
          <text x={x(tick.value)} y={138} textAnchor={tick.value === TWO_D ? "end" : "middle"} fontSize={12} fill="#64748b">{tick.label}</text>
        </g>
      ))}
      <line x1={LEFT} x2={LEFT} y1={8} y2={122} stroke="#94a3b8" strokeWidth={1} />
      <text x={LEFT} y={138} textAnchor="middle" fontSize={12} fill="#64748b">0</text>

      <text x={LEFT - 8} y={ROWS[0].y + 15} textAnchor="end" fontSize={12} fontWeight={700} fill="#334155">{ROWS[0].label}</text>
      <rect x={LEFT} y={ROWS[0].y} width={x(TERMS[0].value) - LEFT} height={BAR_H} fill="#64748b" opacity={0.75} />
      {scene.shown > 1 && <rect x={x(TERMS[0].value)} y={ROWS[0].y} width={Math.max(x(shownSum) - x(TERMS[0].value), 1)} height={BAR_H} fill="#2563eb" />}
      <text x={x(shownSum) + 6} y={ROWS[0].y + 15} fontSize={12} fontWeight={700} fill="#2563eb">
        {shownSum.toLocaleString("en-US")}{finalShown ? " → 1" : ""}
      </text>

      {ROWS.slice(1).map((row) =>
        "sum" in row ? (
          <g key={row.key} opacity={scene.compare ? 1 : 0.35}>
            <text x={LEFT - 8} y={row.y + 15} textAnchor="end" fontSize={12} fontWeight={700} fill="#334155">{row.label}</text>
            {scene.compare ? (
              <>
                <rect x={LEFT} y={row.y} width={x(row.sum) - LEFT} height={BAR_H} fill={row.fee === 2 ? "#d97706" : "#64748b"} opacity={0.85} />
                <text x={x(row.sum) - 6} y={row.y + 15} textAnchor="end" fontSize={12} fontWeight={700} fill="#ffffff">
                  {row.sum.toLocaleString("en-US")} → {row.fee}
                </text>
              </>
            ) : (
              <text x={LEFT + 6} y={row.y + 15} fontSize={12} fill="#64748b">마지막 장면에서 비교</text>
            )}
          </g>
        ) : null,
      )}
    </svg>
  );
}

function TermList({ active }: { active: number }) {
  const scene = SCENES[active];
  return (
    <div className="hidden min-w-0 sm:block">
      <p className="mb-1 font-mono text-[11px] text-muted-foreground">a_i = floor(a_(i−1) × n ÷ d) ÷ i</p>
      <ol className="grid gap-px bg-border p-px font-mono text-[11px] leading-5 sm:text-xs">
        {TERMS.map((term, index) => {
          const visible = index < scene.shown;
          const current = index === scene.shown - 1 && active < 6;
          return (
            <li
              key={term.name}
              className={`grid grid-cols-[1.75rem_minmax(0,1fr)_5.25rem] items-baseline gap-2 px-2 py-1 ${
                current ? "bg-primary/10" : "bg-background"
              } ${visible ? "" : "text-muted-foreground/40"}`}
            >
              <strong className={visible ? "text-primary" : ""}>{term.name}</strong>
              <span className="min-w-0 truncate">
                {"formula" in term ? term.formula : visible ? `${term.product.toLocaleString("en-US")} ÷ ${index}` : ""}
              </span>
              <span className="text-right font-bold">{visible ? term.value.toLocaleString("en-US") : "·"}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function FakeExponentialTermsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const labels = SCENES.map((scene) => scene.label);

  return (
    <VizFrame
      eyebrow="fake_exponential · excess 8개분"
      title="정수 항을 더하다 0이 되면 멈추고, 합을 d로 나눈 몫이 기본료입니다"
      description="n은 자식 excess 1,048,576 blob gas, d는 BPO2 update fraction 11,684,671입니다. a₀, a₁…는 차례로 더하는 정수 항이고, 아래 막대는 지금까지의 누적 합입니다. 합이 d를 넘으면 가격 1, 2d를 넘으면 가격 2입니다."
      note={`항과 합은 본문 식을 그대로 정수로 다시 계산한 값입니다. 이 fixture에서 항의 합은 ${TOTAL.toLocaleString("en-US")}입니다. 경계 61·62는 현재 BPO2 fraction에서만 성립합니다.`}
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="fake_exponential 정수 항 누적 장면 탐색기"
        onKeyDown={scenes.onKeyDown}
        className="flex min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <div className="mt-4 grid min-w-0 items-center gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
          <div className="min-w-0">
            <SumChart active={scenes.active} />
          </div>
          <TermList active={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:pl-4 sm:text-sm sm:leading-7">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
