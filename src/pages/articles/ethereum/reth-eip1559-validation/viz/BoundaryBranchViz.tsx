import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #experiment 01·02·05·07 — 경계값 하나가 어느 분기로 들어가는지.
 * 앞 네 장면: parent gas used가 target(T) 아래·같음·위·양 끝일 때 다음 base fee의 분기.
 * 뒤 네 장면: max fee·priority cap과 base fee의 대소가 eligibility·effective tip·정산을 가르는 자리.
 * Fee 숫자(base 10, max 8·10·15, priority 2·7)는 설명용 가정 단위이고, 실제 wei 값은 대상 fixture에서 정합니다.
 */

type AxisScene = {
  kind: "axis";
  label: string;
  summary: string;
  note: string;
  probes: readonly number[];
};
type CapScene = {
  kind: "cap";
  label: string;
  summary: string;
  note: string;
  max: number;
  priority: number;
  settle: boolean;
};

const BASE = 10;
const SCALE = 18;

/** 축 위의 다섯 지점. T 주변은 1 gas 차이라 실제 축척보다 벌려 그립니다. */
const PROBES = [
  { name: "0", pos: 8, branch: "하락 쪽 끝", arrow: "↓" },
  { name: "T−1", pos: 34, branch: "감소 분기", arrow: "↘" },
  { name: "T", pos: 50, branch: "유지", arrow: "→" },
  { name: "T+1", pos: 66, branch: "최소 증가", arrow: "↗" },
  { name: "2T", pos: 92, branch: "상승 쪽 끝", arrow: "↑" },
] as const;

const SCENES: readonly (AxisScene | CapScene)[] = [
  {
    kind: "axis",
    label: "Target 바로 아래",
    summary: "used = T−1 → 감소 분기",
    note: "Target T는 parent block이 목표로 삼는 gas 사용량입니다. 사용량이 T보다 1만 적어도 다음 base fee 계산은 감소 분기로 들어갑니다. 몇 wei가 줄어드는지는 정수 나눗셈 결과라 exact wei로 확인합니다.",
    probes: [1],
  },
  {
    kind: "axis",
    label: "Target과 같음",
    summary: "used = T → 값 유지",
    note: "사용량이 정확히 T이면 다음 base fee는 parent base fee와 같아야 합니다. 세 경로 중 하나라도 1 wei를 바꾸면 이 경계에서 바로 드러납니다.",
    probes: [2],
  },
  {
    kind: "axis",
    label: "Target 바로 위",
    summary: "used = T+1 → 최소 증가 분기",
    note: "T보다 1 gas만 많아도 증가 분기로 넘어갑니다. 변화량이 아주 작아 1 wei 증가가 나올 수 있는 자리라서 rounding 차이를 잡기 좋습니다.",
    probes: [3],
  },
  {
    kind: "axis",
    label: "변화폭의 양 끝",
    summary: "used = 0 · 2T",
    note: "0 gas와 최대 2T gas는 하락과 상승 쪽 끝입니다. 여기에 작은 base fee 0·1·2와 큰 중간 곱을 섞어 rounding·overflow·saturation이 경로마다 같은지 대조합니다. 2T는 Mainnet elasticity 2를 쓴 경우입니다.",
    probes: [0, 4],
  },
  {
    kind: "cap",
    label: "Max fee < base fee",
    summary: "8 < 10 → 이 block에 넣을 수 없음",
    note: "Max fee는 거래가 gas당 낼 수 있는 상한입니다. 상한이 현재 header base fee보다 작으면 base fee조차 낼 수 없으므로 포함 대상이 아닙니다. 이 eligibility 판정이 경로마다 같아야 합니다.",
    max: 8,
    priority: 2,
    settle: false,
  },
  {
    kind: "cap",
    label: "Max fee = base fee",
    summary: "남은 cap 0 → tip 0",
    note: "상한이 base fee와 같으면 포함은 가능하지만 base fee를 내고 남는 cap이 0입니다. Priority cap이 2여도 effective tip은 0입니다.",
    max: 10,
    priority: 2,
    settle: false,
  },
  {
    kind: "cap",
    label: "Priority cap이 더 작음",
    summary: "min(2, 15−10) = 2",
    note: "Effective tip은 priority cap과 남은 cap(max fee − base fee) 중 작은 값입니다. 남은 cap이 5이고 priority cap이 2이면 tip은 2입니다.",
    max: 15,
    priority: 2,
    settle: false,
  },
  {
    kind: "cap",
    label: "남은 cap이 더 작음",
    summary: "min(7, 15−10) = 5",
    note: "Priority cap을 7로 올려도 남은 cap이 5라서 tip은 5에서 멈춥니다. 같은 거래라도 header base fee가 바뀌면 남은 cap과 tip이 함께 바뀝니다. 정산에서는 base fee 몫이 burn되고 tip 몫이 beneficiary에게 가므로, sender charge·beneficiary delta·burned amount가 receipt와 맞는지 대조합니다.",
    max: 15,
    priority: 7,
    settle: true,
  },
];

const pct = (value: number) => `${(value / SCALE) * 100}%`;

function Axis({ probes }: { probes: readonly number[] }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">parent gas used</p>
      <div className="relative mt-3 h-36">
        <div className="absolute left-[8%] right-[8%] top-12 h-px bg-border" />
        <div className="absolute left-[28%] top-9 h-6 w-[44%] border border-dashed border-border" />
        {PROBES.map((probe, index) => {
          const on = probes.includes(index);
          return (
            <div
              key={probe.name}
              className="absolute top-0 flex w-16 -translate-x-1/2 flex-col items-center text-center"
              style={{ left: `${probe.pos}%` }}
            >
              <span className={`font-mono text-[10px] font-bold ${on ? "text-primary" : "text-muted-foreground"}`}>{probe.name}</span>
              <span className={`mt-1 h-4 w-px ${on ? "bg-primary" : "bg-border"}`} />
              <span className={`mt-1 h-3 w-3 rounded-full border ${on ? "border-primary bg-primary" : "border-border bg-background"}`} />
              <span className={`mt-3 text-lg leading-none ${on ? "text-primary" : "text-transparent"}`} aria-hidden>
                {probe.arrow}
              </span>
              <span className={`mt-1 break-keep text-[10px] leading-4 ${on ? "font-bold text-foreground" : "text-transparent"}`}>
                {probe.branch}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[11px] leading-5 text-muted-foreground">
        점선 칸의 세 점은 1 gas씩 차이 나지만 보이도록 벌려 그렸습니다(축척 아님). 화살표는 다음 base fee의 방향만 뜻하고 크기는 그리지 않았습니다.
      </p>
    </div>
  );
}

function Row({ label, from, to, value, tone }: { label: string; from: number; to: number; value: string; tone: "plain" | "accent" | "warn" | "muted" }) {
  const color = tone === "accent" ? "bg-primary" : tone === "warn" ? "bg-amber-500" : tone === "muted" ? "bg-muted-foreground/40" : "bg-slate-500";
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:grid-cols-[7rem_minmax(0,1fr)_3rem]">
      <span className="break-keep leading-4 text-muted-foreground">{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        {to > from ? <div className={`absolute top-0 h-full rounded-sm ${color}`} style={{ left: pct(from), width: pct(to - from) }} /> : null}
      </div>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

function CapView({ scene }: { scene: CapScene }) {
  const eligible = scene.max >= BASE;
  const remaining = Math.max(0, scene.max - BASE);
  const tip = eligible ? Math.min(scene.priority, remaining) : 0;
  const tipSide = scene.priority < remaining ? "priority cap" : "남은 cap";
  return (
    <div className="min-w-0">
      <p className="text-xs font-bold">gas당 금액 (가정 단위)</p>
      <div className="relative mt-3 space-y-2.5">
        <Row label="max fee 상한" from={0} to={scene.max} value={String(scene.max)} tone={eligible ? "plain" : "warn"} />
        <Row label="header base fee" from={0} to={BASE} value={String(BASE)} tone="muted" />
        <Row label="남은 cap" from={BASE} to={eligible ? scene.max : BASE} value={eligible ? String(remaining) : "−"} tone="plain" />
        <Row label="priority cap" from={BASE} to={BASE + scene.priority} value={String(scene.priority)} tone="plain" />
        <Row label="effective tip" from={BASE} to={BASE + tip} value={eligible ? String(tip) : "−"} tone="accent" />
      </div>
      <p className="mt-3 text-[10px] leading-4 text-muted-foreground">
        priority cap = 거래가 tip으로 줄 수 있는 상한 · 남은 cap = max fee − base fee · effective tip = min(priority cap, 남은 cap)
      </p>
      <div className="mt-2 min-h-[3.5rem] border-t border-border pt-2 text-[11px] leading-5">
        {!eligible ? (
          <p className="font-bold text-amber-700 dark:text-amber-400">max fee 8이 base fee 10에 못 미침 → eligibility 실패</p>
        ) : scene.settle ? (
          <p>
            <span className="font-bold">정산(gas당):</span> sender {BASE + tip} = burn {BASE} + beneficiary {tip}. 실제 금액은 여기에 actual gas를 곱합니다.
          </p>
        ) : (
          <p>
            <span className="font-bold">tip을 정한 쪽:</span> {remaining === 0 ? "남은 cap이 0" : tipSide}
          </p>
        )}
      </div>
    </div>
  );
}

export default function BoundaryBranchViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="경계값 · 분기"
      title="경계값 하나가 어느 분기로 들어가는지 봅니다"
      description="앞 네 장면은 parent gas used가 target T를 기준으로 어느 쪽에 있는지, 뒤 네 장면은 거래의 두 상한과 header base fee의 대소를 봅니다. Fee 숫자는 설명용 가정입니다."
      note="Base fee 10, max fee 8·10·15, priority cap 2·7은 분기를 보이려는 가정 값이며 실제 wei나 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Gas 사용량 경계와 transaction cap 경계가 각각 어느 분기로 가는지 보여 주는 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
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
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) =>
            scene.kind === "axis" ? <Axis key={scene.label} probes={scene.probes} /> : <CapView key={scene.label} scene={scene} />,
          )}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} playLabel="경계 분기 재생" />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
