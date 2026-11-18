import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #experiment 02 · Gas — exact cost−1, exact cost, exact cost+1에서 status와 사용 gas를 대조.
 * 예시 vector(가정)는 출발점 글 Gas Gate의 CALL-02: abc 3바이트, ceil(3/32)=1, 60+12×1 = 72 gas.
 * 71 → PrecompileOOG·남은 0·빈 output, 72 → Return·사용 72·남은 0·32 bytes, 73 → Return·사용 72·남은 1·32 bytes.
 */

const COST = 72;

const PROBES = [
  { limit: 71, tag: "cost−1", status: "Precompile​OOG", used: "71 (전부)", left: "0", output: "빈 bytes", halt: true },
  { limit: 72, tag: "cost", status: "Return", used: "72", left: "0", output: "32 bytes", halt: false },
  { limit: 73, tag: "cost+1", status: "Return", used: "72", left: "1", output: "32 bytes", halt: false },
] as const;

const SCENES: readonly { label: string; summary: string; note: string }[] = [
  {
    label: "정확한 비용",
    summary: "ceil(3÷32)=1 → 60+12×1 = 72",
    note: "exact cost는 그 입력을 처리하는 데 필요한 gas입니다. 출발점 글의 CALL-02 입력(abc 3바이트)을 예로 들면(가정: 예시 vector) 1 word이므로 60 + 12×1 = 72 gas입니다. 이 72를 기준으로 바로 아래·정확히·바로 위 세 gas limit을 만듭니다.",
  },
  {
    label: "cost−1 = 71",
    summary: "71 < 72 → PrecompileOOG",
    note: "비용보다 1 적으면 crypto provider를 부르기 전에 PrecompileOOG(gas 부족으로 frame을 멈추는 halt)로 끝납니다. 남은 gas는 0, output은 빈 bytes입니다.",
  },
  {
    label: "cost = 72",
    summary: "72 ≥ 72 → Return · 남은 0",
    note: "정확히 비용만큼 주면 실행됩니다. 72를 모두 써서 남은 gas는 71일 때와 같은 0이지만, status는 Return이고 output은 32 bytes입니다.",
  },
  {
    label: "cost+1 = 73",
    summary: "사용 72 그대로 · 남은 1",
    note: "1을 더 주어도 사용 gas는 72 그대로이고 남은 gas만 1로 늘어납니다. status와 output은 72일 때와 같습니다.",
  },
  {
    label: "Base와 대조",
    summary: "세 칸 모두 같아야 통과",
    note: "Base와 candidate를 같은 세 limit에서 따로 실행해 칸마다 status와 사용 gas를 대조합니다. 경계에서 하나라도 다르면 Gas drift로 즉시 기각합니다.",
  },
];

const W = 360;
const H = 156;
const AXIS_FROM = 69;
const AXIS_TO = 74;
const X0 = 40;
const X1 = 330;
const gx = (gas: number) => X0 + ((gas - AXIS_FROM) / (AXIS_TO - AXIS_FROM)) * (X1 - X0);
const ROW_Y: readonly number[] = [34, 66, 98];
const BAR_H = 18;
const TICKS = [69, 70, 71, 72, 73, 74] as const;

function BarChart({ active }: { active: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <line x1={gx(COST)} x2={gx(COST)} y1={22} y2={124} stroke="#2563eb" strokeWidth={1} strokeDasharray="4 3" />
      <text x={gx(COST)} y={15} fontSize={10.5} fontWeight={700} textAnchor="middle" fill="#2563eb">비용 72</text>
      {PROBES.map((probe, index) => {
        const reached = active >= index + 1;
        const current = active === index + 1 || active === 4;
        const y = ROW_Y[index];
        const end = gx(probe.limit);
        const usedEnd = probe.halt ? end : gx(COST);
        return (
          <g key={probe.limit} opacity={reached ? (current ? 1 : 0.6) : 1}>
            <text x={X0 - 6} y={y + 13} fontSize={10.5} fontWeight={700} textAnchor="end" fill={reached ? "#2563eb" : "#94a3b8"}>{probe.limit}</text>
            <rect x={X0} y={y} width={end - X0} height={BAR_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray={reached ? undefined : "3 3"} />
            {reached && <rect x={X0} y={y} width={usedEnd - X0} height={BAR_H} rx={3} fill={probe.halt ? "#dc2626" : "#2563eb"} opacity={0.75} />}
            {reached && (
              <text x={end + 6} y={y + 13} fontSize={10} fontWeight={700} fill={probe.halt ? "#dc2626" : "#16a34a"}>
                {probe.halt ? "halt" : probe.left === "0" ? "Return" : "Return · 남은 1"}
              </text>
            )}
          </g>
        );
      })}
      <line x1={X0} x2={X1} y1={128} y2={128} stroke="#94a3b8" strokeWidth={1} />
      {TICKS.map((tick) => (
        <g key={tick}>
          <line x1={gx(tick)} x2={gx(tick)} y1={128} y2={132} stroke="#94a3b8" strokeWidth={1} />
          <text x={gx(tick)} y={145} fontSize={9.5} textAnchor="middle" fill="#64748b">{tick}</text>
        </g>
      ))}
    </svg>
  );
}

function Receipts({ active }: { active: number }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {PROBES.map((probe, index) => {
        const reached = active >= index + 1;
        const rows = [
          ["status", probe.status],
          ["사용 gas", probe.used],
          ["남은 gas", probe.left],
          ["output", probe.output],
        ] as const;
        return (
          <div key={probe.limit} className={`min-w-0 rounded-lg border p-2 text-[10px] leading-4 sm:p-3 sm:text-xs sm:leading-5 ${active === index + 1 ? "border-primary" : "border-border"}`}>
            <strong className="block font-mono">limit {probe.limit}</strong>
            <span className="block text-muted-foreground">{probe.tag}</span>
            <dl className="mt-2 space-y-1">
              {rows.map(([name, value]) => (
                <div key={name} className="min-w-0">
                  <dt className="text-muted-foreground">{name}</dt>
                  <dd className={`break-words font-mono font-bold ${reached ? (probe.halt && name === "status" ? "text-red-600 dark:text-red-400" : "") : "text-muted-foreground/50"}`}>{reached ? value : "—"}</dd>
                </div>
              ))}
              <div className="min-w-0 border-t border-border pt-1">
                <dt className="text-muted-foreground">base = candidate</dt>
                <dd className={`font-bold ${active === 4 ? "text-primary" : "text-muted-foreground/50"}`}>{active === 4 ? "같아야 통과" : "—"}</dd>
              </div>
            </dl>
          </div>
        );
      })}
    </div>
  );
}

export default function GasBoundaryProbeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 6000, { loop: false });
  const labels = SCENES.map((scene) => scene.label);
  const notes = SCENES.map((scene) => scene.note);
  return (
    <VizFrame
      documentFlow
      className="!h-auto !max-h-none"
      eyebrow="실험 02 · Gas 경계"
      title="비용 바로 아래·정확히·바로 위에서 결과가 갈립니다"
      description="막대 오른쪽 끝이 전달한 gas limit, 채운 부분의 끝이 사용한 gas입니다. 가로축은 69–74 구간만 잘라 확대했습니다."
      note="예시 vector는 출발점 글의 CALL-02이며(가정), 실제 corpus의 vector마다 exact cost는 다릅니다."
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        role="group"
        aria-label="exact cost 72를 기준으로 gas limit 71, 72, 73에서 status와 사용 gas를 비교"
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
        <div className="mt-4 min-w-0">
          <BarChart active={scenes.active} />
        </div>
        <div className="mt-3 min-w-0">
          <Receipts active={scenes.active} />
        </div>
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{scene.note}</p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} playLabel="경계 실험 재생" />
      </div>
      <StaticSceneList labels={labels} notes={notes} />
    </VizFrame>
  );
}
