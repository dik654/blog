import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * cpu.max "50000 100000"(0.5 CPU) 아래에서 4 스레드가 15ms씩 동시에 도는 요청 하나를 100ms 주기 두 개에 걸쳐 그린다.
 * 한 mechanism: 주기마다 quota 50ms가 채워지고, 네 스레드가 함께 쓰면 벽시계 12.5ms 만에 바닥나 다음 주기까지 멈춘다.
 * 가로축은 벽시계 0~200ms, 세로는 네 스레드 lane이다. 장면이 바뀌어도 SVG 크기와 설명 칸 높이는 고정이다.
 */
const W = 480;
const H = 196;
const X0 = 54;
const X1 = 466;
const MS = 200;
const x = (ms: number) => X0 + ((X1 - X0) * ms) / MS;
const LANE_Y = [62, 84, 106, 128] as const;
const LANE_H = 16;
/* 첫 주기: 네 스레드가 0~12.5ms 동안 각각 12.5ms씩 → 50ms 소진. 둘째 주기: 100~102.5ms 동안 각각 2.5ms씩 → 10ms. */
const RUN1 = { from: 0, to: 12.5 } as const;
const RUN2 = { from: 100, to: 102.5 } as const;

interface Scene {
  label: string;
  quotaLeft: number;
  showRun1: boolean;
  showThrottle: boolean;
  showRun2: boolean;
  stat: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "주기 시작 · quota 50ms",
    quotaLeft: 50,
    showRun1: false,
    showThrottle: false,
    showRun2: false,
    stat: "runtime 50,000µs",
    note: "cpu.max가 \"50000 100000\"이면 커널은 100ms 주기가 시작될 때마다 이 cgroup의 runtime을 50ms로 채웁니다. 아직 아무 스레드도 돌지 않았습니다.",
  },
  {
    label: "4 스레드가 함께 돈다",
    quotaLeft: 0,
    showRun1: true,
    showThrottle: false,
    showRun2: false,
    stat: "12.5ms × 4 = 50ms 소진",
    note: "요청 하나가 네 스레드로 나뉘어 각각 15ms씩 CPU를 써야 합니다. 네 CPU에서 동시에 돌면 벽시계 12.5ms가 지날 때 네 스레드 합이 50ms에 닿아 runtime이 0이 됩니다.",
  },
  {
    label: "throttled · 87.5ms 대기",
    quotaLeft: 0,
    showRun1: true,
    showThrottle: true,
    showRun2: false,
    stat: "nr_throttled +1",
    note: "runtime이 0이라 네 스레드 모두 run queue에서 내려옵니다. 각 스레드에 2.5ms씩 일이 남았지만 노드 CPU가 놀고 있어도 100ms까지 기다립니다. 이 구간이 cpu.stat의 throttled_usec에 쌓입니다.",
  },
  {
    label: "다음 주기 · 남은 10ms 처리",
    quotaLeft: 40,
    showRun1: true,
    showThrottle: true,
    showRun2: true,
    stat: "완료 102.5ms · 사용 60ms",
    note: "100ms에 period timer가 runtime을 다시 50ms로 채우고 throttle을 풉니다. 남은 2.5ms × 4 = 10ms를 쓰고 요청이 끝납니다. 15ms짜리 일이 102.5ms 걸렸고, 이 1초에 요청이 둘뿐이면 평균 사용률은 120ms ÷ 1,000ms = 12%입니다.",
  },
];

export default function CpuQuotaThrottleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dur = reduced ? 0 : 0.35;

  return (
    <VizFrame
      eyebrow="CFS bandwidth"
      title="quota는 주기마다 채워지고, 여러 스레드가 함께 쓰면 벽시계보다 빨리 바닥납니다"
      description="가로는 벽시계 0~200ms, 네 줄은 네 스레드입니다. 파란 칸은 CPU를 쓰는 시간, 빗금 칸은 quota가 바닥나 멈춘 시간, 위쪽 막대는 이 주기에 남은 runtime입니다."
      note="(가정) cpu.max 50000 100000, 요청 하나 = 4 스레드 × 15ms, 노드에 빈 CPU가 넉넉하다고 둡니다. 5ms slice 단위로 나눠 받는 세부는 생략했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CPU quota 소진과 throttle 시간선"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          {/* 장면마다 길이가 다른 제목·수치를 같은 칸에 겹쳐 가장 긴 장면이 높이를 정한다 */}
          <div className="grid">
            {SCENES.map((s, i) => (
              <div key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className="font-mono text-sm font-bold text-primary">{s.stat}</span>
              </div>
            ))}
          </div>
          <svg viewBox={`0 0 ${W} ${H}`} className="mt-3 h-auto w-full" role="img" aria-label={scene.label}>
            <defs>
              <pattern id="cpu-throttle-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="#fef3c7" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#f59e0b" strokeWidth="1.5" />
              </pattern>
            </defs>
            {/* 주기 경계 */}
            {[0, 100, 200].map((ms) => (
              <g key={ms}>
                <line x1={x(ms)} y1={14} x2={x(ms)} y2={150} stroke="#94a3b8" strokeWidth={ms === 100 ? 1.25 : 0.75} strokeDasharray={ms === 100 ? "3 3" : undefined} />
                <text x={x(ms)} y={166} textAnchor="middle" fontSize={9} className="fill-muted-foreground">
                  {ms}ms
                </text>
              </g>
            ))}
            <text x={x(50)} y={178} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-muted-foreground">
              주기 1
            </text>
            <text x={x(150)} y={178} textAnchor="middle" fontSize={9} fontWeight={700} className="fill-muted-foreground">
              주기 2
            </text>
            {/* quota 잔량 막대 (주기 1·2) */}
            <text x={X0 - 6} y={26} textAnchor="end" fontSize={8.5} fontWeight={700} className="fill-muted-foreground">
              runtime
            </text>
            <rect x={x(0)} y={18} width={x(100) - x(0)} height={10} rx={2} className="fill-background" stroke="#cbd5e1" />
            <motion.rect
              x={x(0)}
              y={18}
              height={10}
              rx={2}
              fill="#2563eb"
              initial={false}
              animate={{ width: ((x(100) - x(0)) * (scenes.active === 0 ? 50 : 0)) / 50 }}
              transition={{ duration: dur }}
            />
            <rect x={x(100)} y={18} width={x(200) - x(100)} height={10} rx={2} className="fill-background" stroke="#cbd5e1" />
            <motion.rect
              x={x(100)}
              y={18}
              height={10}
              rx={2}
              fill="#2563eb"
              initial={false}
              animate={{ width: scene.showRun2 ? ((x(200) - x(100)) * 40) / 50 : 0, opacity: scene.showRun2 ? 1 : 0 }}
              transition={{ duration: dur }}
            />
            <text x={x(100) - 4} y={44} textAnchor="end" fontSize={8.5} fill="#2563eb" fontWeight={700}>
              {scenes.active === 0 ? "50ms 남음" : "0ms"}
            </text>
            <text x={x(200) - 4} y={44} textAnchor="end" fontSize={8.5} fill="#2563eb" fontWeight={700} opacity={scene.showRun2 ? 1 : 0}>
              40ms 남음
            </text>
            {/* 스레드 lane */}
            {LANE_Y.map((y, i) => (
              <g key={y}>
                <text x={X0 - 6} y={y + 12} textAnchor="end" fontSize={9} fontWeight={700} className="fill-foreground">
                  T{i + 1}
                </text>
                <rect x={X0} y={y} width={X1 - X0} height={LANE_H} rx={2} className="fill-background" stroke="#e2e8f0" />
                <motion.rect
                  x={x(RUN1.from)}
                  y={y}
                  height={LANE_H}
                  rx={2}
                  fill="#2563eb"
                  initial={false}
                  animate={{ width: scene.showRun1 ? x(RUN1.to) - x(RUN1.from) : 0 }}
                  transition={{ duration: dur, delay: reduced ? 0 : i * 0.04 }}
                />
                <motion.rect
                  x={x(RUN1.to)}
                  y={y}
                  height={LANE_H}
                  rx={2}
                  fill="url(#cpu-throttle-hatch)"
                  stroke="#f59e0b"
                  strokeWidth={0.75}
                  initial={false}
                  animate={{ width: scene.showThrottle ? x(100) - x(RUN1.to) : 0, opacity: scene.showThrottle ? 1 : 0 }}
                  transition={{ duration: dur }}
                />
                <motion.rect
                  x={x(RUN2.from)}
                  y={y}
                  height={LANE_H}
                  rx={2}
                  fill="#2563eb"
                  initial={false}
                  animate={{ width: scene.showRun2 ? x(RUN2.to) - x(RUN2.from) : 0, opacity: scene.showRun2 ? 1 : 0 }}
                  transition={{ duration: dur, delay: reduced ? 0 : i * 0.04 }}
                />
              </g>
            ))}
            <text x={x(56)} y={LANE_Y[1] + 12} textAnchor="middle" fontSize={9} fontWeight={700} fill="#b45309" opacity={scene.showThrottle ? 1 : 0}>
              throttled 87.5ms
            </text>
            <text x={x(6)} y={LANE_Y[3] + 30} fontSize={8.5} fill="#2563eb" fontWeight={700} opacity={scene.showRun1 ? 1 : 0}>
              12.5ms × 4
            </text>
            <text x={x(103)} y={LANE_Y[3] + 30} fontSize={8.5} fill="#2563eb" fontWeight={700} opacity={scene.showRun2 ? 1 : 0}>
              2.5ms × 4 → 완료 102.5ms
            </text>
          </svg>
          <div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((s, i) => (
              <p key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-6 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {s.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
