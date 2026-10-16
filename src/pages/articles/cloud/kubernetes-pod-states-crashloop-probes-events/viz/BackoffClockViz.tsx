import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 뜨자마자 2초 만에 죽는 컨테이너 하나의 시계를 그린다.
 * 한 mechanism: kubelet은 재시작 직전에 대기 시간을 두 배로 늘려 적어 두고(10→20→40→80→160→300초),
 * 컨테이너는 대부분의 시간을 "도는 중"이 아니라 "다음 재시작을 기다리는 중"으로 보낸다.
 * 상수는 kubelet.go(initial 10s, max 300s)와 HasExpiredFunc 600s에서 왔다. 2초 실행은 가정이다.
 */
const RUN = 2;
const WAITS = [10, 20, 40, 80, 160, 300] as const;

interface Scene {
  label: string;
  crashes: number; // 지금까지 일어난 크래시 수
  reset: boolean;
  status: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "첫 크래시 → 10초 대기", crashes: 1, reset: false, status: "back-off 10s", note: "컨테이너가 2초 만에 exit 1로 죽었습니다. kubelet은 FinishedAt부터 10초가 지나기 전에는 다시 띄우지 않고, 그동안 STATUS 열에 CrashLoopBackOff를 보입니다." },
  { label: "둘째 크래시 → 20초", crashes: 2, reset: false, status: "back-off 20s · RESTARTS 1", note: "10초 뒤 다시 띄웠고 또 2초 만에 죽었습니다. 재시작 직전에 Next가 대기를 두 배로 적어 뒀으므로 이번 대기는 20초입니다. 실행 4초, 대기 30초입니다." },
  { label: "넷째 크래시 → 80초", crashes: 4, reset: false, status: "back-off 1m20s · RESTARTS 3", note: "40초, 80초로 늘어납니다. 여기까지 실행은 8초뿐이고 대기는 150초입니다. 재시작 횟수가 늘수록 '도는 시간'의 비율은 급격히 줄어듭니다." },
  { label: "여섯째 크래시 → 300초 상한", crashes: 6, reset: false, status: "back-off 5m0s · RESTARTS 5", note: "160초 다음은 320초가 아니라 상한 300초입니다. 이 뒤로는 크래시마다 5분씩 기다리므로 RESTARTS 200은 대략 200 × 5분 = 17시간 가까이 '기다린' 기록입니다." },
  { label: "10분 정상 실행 → 초기화", crashes: 6, reset: true, status: "backoff 만료 · 다음은 10s", note: "어느 재시작에서 컨테이너가 10분(600초) 넘게 살아남으면 장부가 만료됩니다. 그 뒤 다시 죽으면 300초가 아니라 첫 크래시처럼 10초부터 셉니다. 1절의 RESTARTS 200·AGE 2d9h는 이런 초기화가 섞인 기록입니다." },
];

const W = 480;
const X0 = 16;
const TRACK_W = W - 32;
const TOTAL = WAITS.reduce((a, b) => a + b, 0) + RUN * WAITS.length; // 622초
const sx = (sec: number) => X0 + (sec / TOTAL) * TRACK_W;

export default function BackoffClockViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dur = reduced ? 0 : 0.35;

  // 세그먼트: [run][wait] × crashes
  let t = 0;
  const segments: { kind: "run" | "wait"; from: number; to: number; label: string }[] = [];
  for (let i = 0; i < scene.crashes; i++) {
    segments.push({ kind: "run", from: t, to: t + RUN, label: "" });
    t += RUN;
    segments.push({ kind: "wait", from: t, to: t + WAITS[i], label: `${WAITS[i]}s` });
    t += WAITS[i];
  }
  const ranSec = scene.crashes * RUN;
  const waitedSec = WAITS.slice(0, scene.crashes).reduce((a, b) => a + b, 0);

  return (
    <VizFrame
      eyebrow="CrashLoopBackOff clock"
      title="CrashLoopBackOff의 대부분은 재시작이 아니라 다음 재시작을 기다리는 시간입니다"
      description="가로 한 줄이 622초입니다. 파란 조각은 컨테이너가 실제로 돈 2초, 주황 조각은 kubelet이 다시 띄우기 전에 기다린 시간입니다."
      note="실행 2초는 가정이고 대기 10·20·40·80·160·300초와 만료 600초는 kubelet.go 원문의 값입니다. jitter가 없어 정확히 두 배씩 늘어납니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="크래시 루프의 실행과 대기 시간"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.status}</span>
          </div>

          <svg viewBox={`0 0 ${W} 120`} className="mt-3 h-auto w-full" role="img" aria-label={`크래시 ${scene.crashes}회, 실행 ${ranSec}초, 대기 ${waitedSec}초`}>
            <rect x={X0} y={30} width={TRACK_W} height={26} rx={4} className="fill-background" stroke="#94a3b8" />
            {segments.map((s, i) => (
              <motion.rect
                key={i}
                y={30}
                height={26}
                initial={false}
                animate={{ x: sx(s.from), width: Math.max(sx(s.to) - sx(s.from), s.kind === "run" ? 2 : 1), opacity: scene.reset ? 0.35 : 1 }}
                transition={{ duration: dur }}
                fill={s.kind === "run" ? "#2563eb" : "#f59e0b"}
              />
            ))}
            {segments
              .filter((s) => s.kind === "wait" && s.to - s.from >= 40)
              .map((s, i) => (
                <text key={i} x={(sx(s.from) + sx(s.to)) / 2} y={47} fontSize={10} fontWeight={700} textAnchor="middle" fill="#7c2d12">
                  {s.label}
                </text>
              ))}
            {scene.reset ? (
              <g>
                <rect x={X0} y={64} width={TRACK_W} height={14} rx={3} fill="#dcfce7" stroke="#16a34a" />
                <text x={X0 + TRACK_W / 2} y={75} fontSize={10} fontWeight={700} textAnchor="middle" fill="#166534">
                  600초 넘게 살아남음 → 장부 만료, 다음 대기 10초
                </text>
              </g>
            ) : (
              <g>
                <text x={X0} y={75} fontSize={10} fontWeight={700} fill="#1d4ed8">
                  실행 {ranSec}초
                </text>
                <text x={X0 + TRACK_W} y={75} fontSize={10} fontWeight={700} textAnchor="end" fill="#b45309">
                  대기 {waitedSec}초 ({Math.round((waitedSec / Math.max(ranSec + waitedSec, 1)) * 100)}%)
                </text>
              </g>
            )}
            {[0, 100, 200, 300, 400, 500, 600].map((s) => (
              <g key={s}>
                <line x1={sx(s)} y1={56} x2={sx(s)} y2={60} stroke="#94a3b8" />
                <text x={sx(s)} y={100} fontSize={9} textAnchor="middle" className="fill-muted-foreground">{s}s</text>
              </g>
            ))}
            <text x={X0} y={22} fontSize={10} fontWeight={700} className="fill-muted-foreground">FinishedAt 기준 누적 시간</text>
          </svg>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
