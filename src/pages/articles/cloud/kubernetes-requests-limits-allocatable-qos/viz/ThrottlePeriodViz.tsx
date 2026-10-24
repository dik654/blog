import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * CPU limit 500m 컨테이너의 CFS 주기 100ms 한 칸을 그린다.
 * 한 mechanism: quota 50ms는 "CPU 시간"이라 스레드 수만큼 빨리 닳고, 닳은 뒤 주기 끝까지 모든 스레드가 멈춘다.
 * 평균 사용량(50ms/100ms = 0.5 CPU)은 두 경우가 같고, 멈춘 길이(50ms vs 87.5ms)만 다르다.
 */
const PERIOD = 100;
const QUOTA = 50; // cpu.max 50000μs / 100000μs

interface Scene {
  label: string;
  threads: number;
  busyUntil: number; // ms, quota 소진 시각 (스레드가 쉬지 않고 돈다고 가정)
  throttled: boolean;
  metric: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "주기 100ms · quota 50ms", threads: 1, busyUntil: 0, throttled: false, metric: "cpu.max = 50000 100000", note: "limit 500m은 kubelet이 cpu.max에 '50000 100000'으로 씁니다. 100,000μs마다 50,000μs의 CPU 시간을 쓸 수 있다는 뜻이고 그림의 한 줄이 그 100ms입니다." },
  { label: "스레드 1개 · 50ms에 소진", threads: 1, busyUntil: 50, throttled: true, metric: "멈춤 50ms · 평균 0.5 CPU", note: "스레드 하나가 쉬지 않고 돌면 1ms마다 CPU 시간 1ms를 써서 50ms 시점에 quota가 끝납니다. 남은 50ms 동안 커널은 이 cgroup의 모든 스레드를 run queue에서 내립니다." },
  { label: "스레드 4개 · 12.5ms에 소진", threads: 4, busyUntil: 12.5, throttled: true, metric: "멈춤 87.5ms · 평균 0.5 CPU", note: "스레드 4개가 동시에 돌면 1ms마다 CPU 시간 4ms를 씁니다. 12.5ms 만에 50ms quota가 끝나고 87.5ms를 멈춥니다. 평균 사용량은 여전히 0.5 CPU라 사용률 그래프로는 1번 장면과 구별되지 않습니다." },
  { label: "요청 하나의 지연", threads: 4, busyUntil: 12.5, throttled: true, metric: "p99에 +87.5ms", note: "주기 시작 직후 들어온 요청은 12.5ms 안에 끝나지만, 소진 직후 들어온 요청은 다음 주기까지 87.5ms를 기다립니다. liveness probe의 timeoutSeconds 기본 1초는 이 멈춤 몇 개가 겹치면 넘길 수 있습니다." },
];

const W = 480;
const X0 = 60;
const TRACK_W = W - X0 - 16;
const ms = (v: number) => X0 + (v / PERIOD) * TRACK_W;

export default function ThrottlePeriodViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200, { loop: false });
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dur = reduced ? 0 : 0.4;
  const rows = [0, 1, 2, 3];
  const rowY = (i: number) => 34 + i * 22;

  return (
    <VizFrame
      eyebrow="CFS period"
      title="CPU limit은 죽이지 않고 멈춥니다. 멈추는 길이는 스레드 수에 달렸습니다"
      description="가로 한 줄이 CFS 주기 100ms, 네 줄이 컨테이너의 스레드 네 개입니다. 파란 구간은 실행, 빗금 구간은 quota가 끝나 멈춘 시간입니다."
      note="스레드가 쉬지 않고 돈다는 가정의 의사 예시입니다. 실제 커널은 quota를 CPU별 slice로 나눠 주므로 소진 시각이 조금 다를 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CFS 주기 안의 실행과 throttling"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.metric}</span>
          </div>

          <svg viewBox={`0 0 ${W} 150`} className="mt-3 h-auto w-full" role="img" aria-label={`스레드 ${scene.threads}개, ${scene.busyUntil}ms에 quota 소진`}>
            <defs>
              <pattern id="throttle-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <rect width="6" height="6" fill="#fef3c7" />
                <line x1="0" y1="0" x2="0" y2="6" stroke="#f59e0b" strokeWidth="1.25" />
              </pattern>
            </defs>
            {/* 눈금 */}
            {[0, 25, 50, 75, 100].map((t) => (
              <g key={t}>
                <line x1={ms(t)} y1={26} x2={ms(t)} y2={126} stroke="#e2e8f0" />
                <text x={ms(t)} y={140} fontSize={9} textAnchor="middle" className="fill-muted-foreground">{t}ms</text>
              </g>
            ))}
            <text x={X0} y={14} fontSize={10} fontWeight={700} className="fill-muted-foreground">한 주기 100ms</text>
            {rows.map((i) => {
              const active = i < scene.threads;
              const busy = active && scene.busyUntil > 0 ? scene.busyUntil : 0;
              return (
                <g key={i}>
                  <text x={X0 - 8} y={rowY(i) + 12} fontSize={10} fontWeight={700} textAnchor="end" className={active ? "fill-foreground" : "fill-muted-foreground"}>
                    T{i + 1}
                  </text>
                  <rect x={X0} y={rowY(i)} width={TRACK_W} height={16} rx={3} className="fill-background" stroke={active ? "#94a3b8" : "#e2e8f0"} strokeDasharray={active ? undefined : "2 2"} />
                  <motion.rect x={X0} y={rowY(i)} height={16} rx={3} fill="#2563eb" initial={false} animate={{ width: ms(busy) - X0 }} transition={{ duration: dur }} />
                  {active && scene.throttled ? (
                    <motion.rect y={rowY(i)} height={16} rx={3} fill="url(#throttle-hatch)" initial={false} animate={{ x: ms(busy), width: TRACK_W - (ms(busy) - X0) }} transition={{ duration: dur }} />
                  ) : null}
                </g>
              );
            })}
            {scene.throttled ? (
              <g>
                <line x1={ms(scene.busyUntil)} y1={22} x2={ms(scene.busyUntil)} y2={128} stroke="#b45309" strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={ms(scene.busyUntil) + 4} y={24} fontSize={9} fontWeight={700} fill="#b45309">
                  quota 소진 {scene.busyUntil}ms
                </text>
              </g>
            ) : null}
            {/* quota 계산 */}
            <text x={W - 16} y={14} fontSize={9} textAnchor="end" className="fill-muted-foreground">
              CPU 시간 {scene.threads} × {scene.busyUntil}ms = {scene.threads * scene.busyUntil}ms · quota {QUOTA}ms
            </text>
          </svg>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
