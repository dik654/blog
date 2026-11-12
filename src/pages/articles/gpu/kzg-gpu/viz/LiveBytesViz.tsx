import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #srs-residency — B_live 예시 n=8, sP=96, sF=32, nq=7, MSM=4096, out=192, runtime=1024.
 * 768 + 256 + 224 + 4096 + 192 + 1024 = 6,560B. SRS prefix는 768/6560 = 11.7%.
 */
const PARTS = [
  { key: "srs", label: "SRS prefix", calc: "8 × 96", bytes: 768, color: "#2563eb" },
  { key: "coef", label: "계수", calc: "8 × 32", bytes: 256, color: "#475569" },
  { key: "quot", label: "quotient", calc: "7 × 32", bytes: 224, color: "#94a3b8" },
  { key: "msm", label: "MSM 작업 공간", calc: "bucket workspace", bytes: 4096, color: "#475569" },
  { key: "out", label: "출력", calc: "proof staging", bytes: 192, color: "#94a3b8" },
  { key: "rt", label: "runtime", calc: "context reserve", bytes: 1024, color: "#475569" },
] as const;

const TOTAL = PARTS.reduce<number>((sum, p) => sum + p.bytes, 0);

/** 장면마다 보이는 부품 수 */
const VISIBLE = [1, 3, 4, 6] as const;

const fmt = (n: number) => n.toLocaleString("en-US");

const cumulative = (count: number) => PARTS.slice(0, count).reduce<number>((sum, p) => sum + p.bytes, 0);

const SCENES = [
  {
    label: "SRS prefix만 세면",
    summary: `${fmt(cumulative(1))}B`,
    note: "상주하는 SRS point 8개입니다. 검증·변환한 device point 하나가 96B여서 768B입니다. capacity를 이것만 보고 정하면 점선 막대의 나머지 칸이 빠집니다.",
  },
  {
    label: "계수와 quotient를 더하면",
    summary: `${fmt(cumulative(3))}B`,
    note: "commit할 coefficient 8개와 opening quotient coefficient 7개가 같은 구간에 살아 있습니다. 하나가 32B여서 256B와 224B, 합 480B가 더해집니다.",
  },
  {
    label: "MSM 작업 공간을 더하면",
    summary: `${fmt(cumulative(4))}B`,
    note: "MSM은 scalar와 point를 짝지어 곱한 뒤 모두 더하는 연산이고, 그 bucket workspace가 4,096B입니다. 이 예에서는 가장 큰 칸이며 SRS prefix보다 다섯 배 넘게 큽니다.",
  },
  {
    label: "출력과 runtime까지 더하면",
    summary: `${fmt(TOTAL)}B · SRS ${((cumulative(1) / TOTAL) * 100).toFixed(1)}%`,
    note: "proof staging 192B와 context reserve 1,024B를 더하면 peak live bytes는 6,560B입니다. SRS prefix 768B는 그중 11.7%입니다. 숫자는 이 글의 작은 예시 값입니다.",
  },
] as const;

const W = 480;
const BAR_X = 1;
const BAR_W = W - 2 * BAR_X;
const BAR_Y = 1;
const BAR_H = 28;

function Stack({ count }: { count: number }) {
  const shown = PARTS.slice(0, count);
  const used = cumulative(count);
  return (
    <div className="min-w-0">
      <div className="flex justify-between font-mono text-xs text-muted-foreground">
        <span>0B</span>
        <span>{fmt(TOTAL)}B</span>
      </div>
      <svg viewBox={`0 0 ${W} ${BAR_H + 2}`} className="mt-1 h-auto w-full" role="img" aria-label={`누적 ${fmt(used)}B / 전체 ${fmt(TOTAL)}B`}>
        <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={BAR_H} rx={3} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
        {shown.map((p, i) => {
          const x = BAR_X + (cumulative(i) / TOTAL) * BAR_W;
          const w = (p.bytes / TOTAL) * BAR_W;
          return <rect key={p.key} x={x} y={BAR_Y} width={Math.max(w - 1, 1)} height={BAR_H} fill={p.color} opacity={0.85} />;
        })}
      </svg>
      <p className="mt-1 text-sm font-bold">누적 {fmt(used)}B</p>
      <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-xs sm:grid-cols-2 sm:text-sm">
        {PARTS.map((p, i) => {
          const on = i < count;
          return (
            <li key={p.key} className={`flex min-w-0 items-center gap-2 ${on ? "" : "opacity-35"}`}>
              <svg width={12} height={12} viewBox="0 0 12 12" aria-hidden className="flex-none">
                <rect x={0} y={0} width={12} height={12} rx={2} fill={on ? p.color : "none"} stroke={p.color} strokeWidth={1} />
              </svg>
              <span className="min-w-0 flex-1">
                <span className="font-semibold">{p.label}</span> <span className="text-muted-foreground">{p.calc}</span>
              </span>
              <span className="flex-none font-mono">{on ? `${fmt(p.bytes)}B` : "−"}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function LiveBytesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const labels = SCENES.map((s) => s.label);

  return (
    <VizFrame
      eyebrow="peak live bytes"
      title="SRS prefix는 한 KZG job이 동시에 쓰는 메모리의 일부입니다"
      description="peak live bytes는 한 job에서 같은 구간에 동시에 살아 있는 buffer 크기의 합입니다. 막대 전체가 아래 식의 예시 합계 6,560B이고, 칸 길이는 바이트 수에 비례합니다. 파란 칸이 SRS prefix, 회색 칸이 나머지 buffer이며 왼쪽부터 아래 목록 순서입니다."
      note="n=8, point 96B, field 32B, quotient 7개, MSM 4,096B, 출력 192B, runtime 1,024B는 이 글의 예시 값입니다. 실제 크기는 backend의 aligned allocation을 측정해 정합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="SRS prefix에서 시작해 peak live bytes 6560바이트까지 더해 가는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack active={scenes.active} className="mt-4" scenes={VISIBLE.map((count) => <Stack key={count} count={count} />)} />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((s) => s.note)} />
      </div>
    </VizFrame>
  );
}
