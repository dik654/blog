import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * μ = 10 req/s 서버 하나에 λ = 5·8·9.5를 넣고, Little's law L = λW만큼 요청 상자를 쌓는다.
 * 한 mechanism: λ가 μ에 다가갈수록 서버 칸은 그대로 1개인데 그 앞에 서는 상자 수가 1 → 4 → 19로 불어난다.
 * 이 상자들이 기다린 시간이 W의 queueing 몫이고, λ ≥ μ에서는 상자가 멈추지 않고 늘어난다.
 */
const MU = 10;
const SERVICE = 1 / MU; // 0.1 s
const CAP = 20; // 그림에 그리는 최대 상자 수

interface Scene {
  label: string;
  lambda: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "λ = 5 · ρ 50%",
    lambda: 5,
    note: "W = 1/(10 − 5) = 0.2초이고 L = 5 × 0.2 = 1개입니다. 서버 안팎을 합쳐 평균 한 개가 머뭅니다. 체류 0.2초 중 처리 0.1초와 기다림 0.1초가 같습니다.",
  },
  {
    label: "λ = 8 · ρ 80%",
    lambda: 8,
    note: "W = 1/(10 − 8) = 0.5초, L = 8 × 0.5 = 4개입니다. 서버 칸은 여전히 하나라 나머지 세 상자는 앞 요청이 끝나기를 기다립니다. 처리 시간 0.1초는 그대로입니다.",
  },
  {
    label: "λ = 9.5 · ρ 95%",
    lambda: 9.5,
    note: "W = 1/(10 − 9.5) = 2.0초, L = 9.5 × 2.0 = 19개입니다. 도착률은 8에서 1.5 늘었을 뿐인데 머무는 상자는 4개에서 19개가 됩니다. 2.0초 중 1.9초가 기다림입니다.",
  },
  {
    label: "λ = 12 · ρ > 1",
    lambda: 12,
    note: "처리는 초당 10개에서 멈추고 도착은 12개라 대기열이 1초마다 2개씩 늘어납니다. 정상 상태가 없어 W와 L을 정할 수 없고, 그림의 상자는 계속 쌓이다가 결국 timeout 됩니다.",
  },
];

export default function QueueFillViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const stable = scene.lambda < MU;
  const W = stable ? 1 / (MU - scene.lambda) : null;
  const L = W !== null ? scene.lambda * W : null;
  const boxes = L !== null ? Math.round(L) : CAP;
  const waiting = Math.max(0, boxes - 1);
  const shown = Math.min(waiting, CAP - 1);
  const rho = scene.lambda / MU;
  // 체류 시간 막대의 눈금: 2.0초 = 100%
  const scale = (s: number) => `${Math.min(100, (s / 2) * 100)}%`;

  return (
    <VizFrame
      eyebrow="Queue fill · Little's law"
      title="서버 칸은 하나인데, λ가 μ에 다가갈수록 그 앞에 서는 요청이 불어납니다"
      description="왼쪽 진한 칸은 지금 처리 중인 요청, 오른쪽 칸은 기다리는 요청입니다. 상자 수는 평균 재실 요청 수 L = λW를 반올림한 값입니다. 아래 막대는 한 요청의 평균 체류 시간 W를 처리 0.1초와 기다림으로 나눈 것입니다."
      note="M/M/1(서버 1개, Poisson 도착, 지수 service time) 평균값입니다. 실제 순간의 대기열은 이 평균 주위로 출렁입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="도착률에 따른 대기열 길이"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-x-2 gap-y-1 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">
              {L !== null ? `L = ${scene.lambda} × ${W!.toFixed(1)} = ${Math.round(L)}개` : "L → ∞"}
            </span>
          </div>

          <div className="mt-4 flex items-start gap-3">
            <div className="shrink-0">
              <p className="text-[11px] font-bold text-muted-foreground">서버 · μ 10/s</p>
              <div className="mt-1 flex size-16 items-center justify-center rounded-sm border border-[#2563eb]">
                {boxes >= 1 ? (
                  <motion.span
                    key={`svc-${scenes.active}`}
                    className="size-6 rounded-sm bg-[#2563eb]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduced ? 0 : 0.3 }}
                  />
                ) : null}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold text-muted-foreground">
                대기 {stable ? `${waiting}개` : "매초 +2개 · 그림 밖으로 계속"} <span className="font-normal">← 도착 순서</span>
              </p>
              <div className="mt-1 grid min-h-[3.25rem] grid-cols-10 content-start gap-1">
                {Array.from({ length: shown }, (_, i) => (
                  <motion.span
                    key={`q-${scenes.active}-${i}`}
                    className={`aspect-square rounded-sm border ${stable ? "border-[#f59e0b] bg-[#fef3c7]" : "border-[#dc2626] bg-[#fee2e2]"}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : 0.2 + i * 0.07 }}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-[11px] font-bold text-muted-foreground">한 요청의 평균 체류 시간 W · 막대 끝 = 2.0초</p>
          <div className="relative mt-1 h-7 overflow-hidden rounded-sm border border-border">
            {W !== null ? (
              <>
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#2563eb]"
                  initial={false}
                  animate={{ width: scale(SERVICE) }}
                  transition={{ duration: reduced ? 0 : 0.4 }}
                />
                <motion.div
                  className="absolute inset-y-0 bg-[#fcd34d]"
                  initial={false}
                  animate={{ left: scale(SERVICE), width: scale(W - SERVICE) }}
                  transition={{ duration: reduced ? 0 : 0.6 }}
                />
              </>
            ) : (
              <div className="absolute inset-0 border-r-2 border-dashed border-[#dc2626] bg-[#fee2e2]" />
            )}
          </div>

          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">ρ = λ/μ</dt>
              <dd className="font-bold">{Math.round(rho * 100)}%</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">처리</dt>
              <dd className="font-bold text-[#2563eb]">0.1초</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">기다림</dt>
              <dd className="font-bold text-[#b45309]">{W !== null ? `${(W - SERVICE).toFixed(1)}초` : "계속 증가"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">처리한 throughput</dt>
              <dd className="font-bold">{Math.min(scene.lambda, MU)} req/s</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
