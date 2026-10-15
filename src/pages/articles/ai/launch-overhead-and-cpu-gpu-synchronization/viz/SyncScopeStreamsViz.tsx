import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: "기다린다"는 호출마다 기다리는 주체(CPU인가 GPU 실행열인가)와 범위(A만인가 장치 전체인가)가 다르다.
 * 같은 시간축 위에 CPU · 실행열 A · 실행열 B를 두고, 대기 호출 하나만 바꿔 CPU가 멈추는 구간과 A의 다음 작업 위치를 비교한다.
 * A의 계산 구간(5–7 … 24–26 μs)과 B가 50 μs에 끝난다는 값은 본문 사례 그대로다.
 */
const T_MAX = 58;
const A_WORK: readonly [number, number][] = [
  [5, 7],
  [8, 10],
  [13, 15],
  [16, 18],
  [21, 23],
  [24, 26],
];
const B_WORK: [number, number] = [20, 50];
const TICKS = [0, 10, 20, 26, 40, 50] as const;

interface Scene {
  label: string;
  call: string;
  /** CPU가 막혀 있는 구간 */
  cpuWait: [number, number] | null;
  /** A의 다음 작업 시작 시각, 없으면 null */
  aNext: number | null;
  /** 대기가 없었다면 A의 다음 작업이 시작했을 시각(점선 유령) */
  aGhost: number | null;
  event: boolean;
  bLater: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "기준 · 기다리지 않음",
    call: "(대기 호출 없음)",
    cpuWait: null,
    aNext: null,
    aGhost: null,
    event: false,
    bLater: false,
    note: "CPU는 24 μs에 세 번째 회의 제출을 마치고 다음 코드로 갑니다. A의 마지막 계산은 26 μs, 독립 실행열 B의 작업은 50 μs에 끝납니다.",
  },
  {
    label: "A만 기다림 · .item()",
    call: "y.item()",
    cpuWait: [24, 26],
    aNext: null,
    aGhost: null,
    event: false,
    bLater: false,
    note: "값을 읽는 호출은 그 값을 만든 실행열 A의 앞선 작업만 기다립니다. CPU의 빗금은 26 μs에서 풀리고 B는 상관하지 않습니다.",
  },
  {
    label: "장치 전체 · synchronize()",
    call: "torch.cuda.synchronize()",
    cpuWait: [24, 50],
    aNext: null,
    aGhost: null,
    event: false,
    bLater: false,
    note: "장치의 모든 실행열을 기다리면 A와 관계없는 B 때문에 CPU가 50 μs까지 멈춥니다. A만 기다릴 때보다 24 μs를 더 기다립니다.",
  },
  {
    label: "GPU끼리 · A.wait_stream(B)",
    call: "A.wait_stream(B)",
    cpuWait: null,
    aNext: 50,
    aGhost: 27,
    event: true,
    bLater: false,
    note: "wait_stream은 B에 완료 표시(event)를 남기고 A의 다음 작업이 그 표시를 기다리게 합니다. A의 다음 작업은 27 μs가 아니라 50 μs에 시작하지만 CPU에는 빗금이 없습니다.",
  },
  {
    label: "호출 뒤 B에 넣은 일",
    call: "A.wait_stream(B) → B에 새 작업",
    cpuWait: null,
    aNext: 50,
    aGhost: null,
    event: true,
    bLater: true,
    note: "표시는 호출한 순간까지 B에 쌓인 작업에만 찍힙니다. 그 뒤 B에 추가한 50–56 μs 작업은 A가 기다리지 않으므로 둘 사이에 화살표가 없습니다.",
  },
];

const pct = (t: number) => `${(t / T_MAX) * 100}%`;
const span = (a: number, b: number) => ({ left: pct(a), width: pct(b - a) });

function Lane({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.2rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-[11px] font-bold">{label}</span>
      <div className="relative h-8 rounded-sm border border-border bg-muted/20">{children}</div>
    </div>
  );
}

export default function SyncScopeStreamsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const d = (s: number) => (reduced ? 0 : s);
  const cpuFree = scene.cpuWait ? scene.cpuWait[1] : 24;

  return (
    <VizFrame
      eyebrow="Wait scope"
      title="누가 무엇을 기다리는지에 따라 멈추는 줄이 달라집니다"
      description="세 줄이 같은 0–58 μs 시간축입니다. 파란 칸은 실행열 A의 계산, 회색 칸은 독립 실행열 B의 작업, CPU 줄의 주황 점선 칸은 CPU가 멈춰 기다리는 구간입니다."
      note="A의 계산 시각과 B가 50 μs에 끝난다는 값은 본문 사례입니다. B 작업이 20 μs에 시작하는 것과 50–56 μs의 추가 작업은 그림을 위한 가정이며 호출 자체의 비용은 무시했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="대기 호출별 CPU와 두 실행열의 시간표"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.4rem] flex-wrap items-baseline justify-between gap-x-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <code className="font-mono text-xs text-[#2563eb]">{scene.call}</code>
          </div>

          <div className="mt-3 space-y-2">
            <Lane label="CPU">
              <div className="absolute inset-y-1 rounded-sm bg-[#94a3b8]/50" style={span(0, 24)} />
              <span className="absolute inset-y-0 flex items-center pl-1 text-[10px] text-muted-foreground" style={{ left: pct(0) }}>
                제출
              </span>
              {scene.cpuWait ? (
                <motion.div
                  className="absolute inset-y-1 rounded-sm border border-dashed border-[#d97706] bg-[#fde68a]/50"
                  style={{ left: pct(scene.cpuWait[0]) }}
                  initial={{ width: "0%" }}
                  animate={{ width: pct(scene.cpuWait[1] - scene.cpuWait[0]) }}
                  transition={{ duration: d(1.4), ease: "linear" }}
                />
              ) : null}
              <motion.span
                className="absolute inset-y-0 flex items-center text-[10px] font-bold text-[#16a34a]"
                style={{ left: pct(cpuFree) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: d(scene.cpuWait ? 1.4 : 0.2) }}
              >
                ▸
              </motion.span>
            </Lane>

            <Lane label="실행열 A">
              {A_WORK.map(([a, b]) => (
                <div key={a} className="absolute inset-y-1 rounded-sm bg-[#2563eb]" style={span(a, b)} />
              ))}
              {scene.aGhost !== null ? (
                <div className="absolute inset-y-1 rounded-sm border border-dashed border-[#2563eb]" style={span(scene.aGhost, scene.aGhost + 3)} />
              ) : null}
              {scene.aNext !== null ? (
                <motion.div
                  className="absolute inset-y-1 rounded-sm bg-[#2563eb]"
                  style={{ width: pct(3) }}
                  initial={{ left: pct(scene.aGhost ?? scene.aNext) }}
                  animate={{ left: pct(scene.aNext) }}
                  transition={{ delay: d(0.5), duration: d(1.1) }}
                />
              ) : null}
            </Lane>

            <Lane label="실행열 B">
              <div className="absolute inset-y-1 rounded-sm bg-[#64748b]/70" style={span(...B_WORK)} />
              {scene.bLater ? (
                <motion.div
                  className="absolute inset-y-1 rounded-sm border border-[#64748b] bg-[#64748b]/25"
                  style={span(50, 56)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: d(0.4) }}
                />
              ) : null}
              {scene.event ? (
                <motion.span
                  className="absolute -top-1 bottom-[-0.25rem] w-0 border-l-[1.25px] border-[#d97706]"
                  style={{ left: pct(50) }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: d(0.2) }}
                />
              ) : null}
            </Lane>

            {/* 시간축 */}
            <div className="grid grid-cols-[4.2rem_minmax(0,1fr)] gap-2">
              <span className="text-[10px] text-muted-foreground">μs</span>
              <div className="relative h-4 font-mono text-[10px] text-muted-foreground">
                {TICKS.map((t) => (
                  <span key={t} className="absolute -translate-x-1/2" style={{ left: pct(t) }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">CPU가 다시 움직이는 시각</dt>
              <dd className="font-bold text-foreground">{cpuFree} μs</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">CPU가 멈춘 시간</dt>
              <dd className="font-bold text-[#b45309]">{scene.cpuWait ? scene.cpuWait[1] - scene.cpuWait[0] : 0} μs</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">A 다음 작업 시작</dt>
              <dd className="font-bold text-[#2563eb]">{scene.aNext !== null ? `${scene.aNext} μs` : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">기다리는 주체</dt>
              <dd className="font-bold text-foreground">{scene.cpuWait ? "CPU" : scene.event ? "GPU 실행열 A" : "없음"}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
