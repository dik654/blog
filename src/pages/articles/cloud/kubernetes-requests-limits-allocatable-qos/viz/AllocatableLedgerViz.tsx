import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 16 CPU 노드 한 대의 CPU 장부를 scheduler의 눈으로 그린다.
 * 한 mechanism: scheduler는 사용량이 아니라 requests 합을 Allocatable과 비교한다.
 * 숫자는 공식 문서의 Allocatable 예(16 CPU, kubeReserved 1000m, systemReserved 500m)와
 * (가정) 7개 Pod가 각 2 CPU를 요청하고 실제로는 합쳐서 2.9 CPU만 쓰는 상황이다.
 */
const CAPACITY = 16000;
const RESERVED = 1500;
const ALLOCATABLE = CAPACITY - RESERVED;
const PLACED = 14000;
const USED = 2900;

interface Scene {
  label: string;
  showPlaced: boolean;
  showUsed: boolean;
  newRequest: number | null;
  verdict: string;
  verdictOk: boolean | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "Capacity → Allocatable", showPlaced: false, showUsed: false, newRequest: null, verdict: "Allocatable 14,500m", verdictOk: null, note: "노드는 16 CPU이지만 kubeReserved 1000m과 systemReserved 500m을 빼면 Pod에 내줄 수 있는 Allocatable은 14.5 CPU입니다. CPU에는 eviction 하한이 없습니다." },
  { label: "requests 합 14,000m", showPlaced: true, showUsed: false, newRequest: null, verdict: "남은 몫 500m", verdictOk: null, note: "(가정) 2 CPU를 요청한 Pod 7개가 이미 배치되어 requests 합이 14,000m입니다. scheduler의 장부에 남은 것은 14,500 − 14,000 = 500m입니다." },
  { label: "실제 사용 2,900m", showPlaced: true, showUsed: true, newRequest: null, verdict: "사용률 18%", verdictOk: null, note: "같은 노드의 실제 CPU 사용은 2.9 CPU, 사용률로는 18%입니다. 그러나 이 숫자는 scheduler의 장부 어디에도 들어가지 않습니다." },
  { label: "새 Pod requests 1,000m", showPlaced: true, showUsed: true, newRequest: 1000, verdict: "Insufficient cpu", verdictOk: false, note: "fit.go는 1,000 > 14,500 − 14,000 = 500을 보고 'Insufficient cpu'를 남깁니다. 노드가 82% 놀고 있어도 Pod는 Pending입니다." },
  { label: "requests 500m으로 다시", showPlaced: true, showUsed: true, newRequest: 500, verdict: "배치됨 · 남은 몫 0", verdictOk: true, note: "요청을 500m으로 낮추면 500 > 500이 아니라 통과합니다. requests를 실제 사용에 가깝게 적는 일이 곧 노드를 채우는 일입니다." },
];

const W = 480;
const BAR_X = 16;
const BAR_W = W - 32;
const px = (milli: number) => (milli / CAPACITY) * BAR_W;

export default function AllocatableLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dur = reduced ? 0 : 0.4;
  const remaining = ALLOCATABLE - PLACED;
  const newFits = scene.newRequest !== null && scene.newRequest <= remaining;

  return (
    <VizFrame
      eyebrow="Allocatable ledger"
      title="scheduler는 사용량이 아니라 requests 합을 Allocatable과 비교합니다"
      description="가로 한 줄이 노드의 16 CPU입니다. 윗줄은 scheduler의 장부(requests), 아랫줄은 kubelet이 재는 실제 사용량입니다."
      note="Allocatable 수치는 공식 문서의 예(16 CPU, kubeReserved 1000m, systemReserved 500m)이고, Pod 7개의 requests와 2.9 CPU 사용량은 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="노드 CPU 장부와 새 Pod 배치 판정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="grid">
            {SCENES.map((s, i) => (
              <div key={s.label} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 flex flex-wrap items-baseline justify-between gap-2 ${i === scenes.active ? "" : "invisible"}`}>
                <h4 className="text-base font-bold">{s.label}</h4>
                <span className={`font-mono text-sm font-bold ${s.verdictOk === false ? "text-[#b91c1c]" : s.verdictOk ? "text-[#15803d]" : "text-primary"}`}>{s.verdict}</span>
              </div>
            ))}
          </div>

          <svg viewBox={`0 0 ${W} 150`} className="mt-3 h-auto w-full" role="img" aria-label={`requests 합 ${scene.showPlaced ? PLACED : 0}m, 사용 ${scene.showUsed ? USED : 0}m`}>
            {/* 윗줄: scheduler 장부 */}
            <text x={BAR_X} y={14} fontSize={10} fontWeight={700} className="fill-muted-foreground">scheduler 장부 · requests</text>
            <rect x={BAR_X} y={20} width={BAR_W} height={30} rx={4} className="fill-background" stroke="#94a3b8" />
            {/* 예약 */}
            <rect x={BAR_X + px(ALLOCATABLE)} y={20} width={px(RESERVED)} height={30} fill="#cbd5e1" />
            <text x={BAR_X + px(ALLOCATABLE) + px(RESERVED) / 2} y={39} fontSize={9} fontWeight={700} textAnchor="middle" fill="#334155">예약 1.5</text>
            {/* 배치된 requests */}
            <motion.rect x={BAR_X} y={20} height={30} fill="#2563eb" initial={false} animate={{ width: scene.showPlaced ? px(PLACED) : 0 }} transition={{ duration: dur }} />
            {scene.showPlaced ? (
              <text x={BAR_X + px(PLACED) / 2} y={39} fontSize={10} fontWeight={700} textAnchor="middle" fill="#ffffff">7 Pod × 2 CPU = 14,000m</text>
            ) : null}
            {/* 새 Pod */}
            {scene.newRequest !== null ? (
              <motion.rect
                x={BAR_X + px(PLACED)}
                y={20}
                height={30}
                initial={false}
                animate={{ width: px(scene.newRequest), fill: newFits ? "#15803d" : "#b91c1c" }}
                transition={{ duration: dur }}
              />
            ) : null}
            {scene.newRequest !== null ? (
              <text x={BAR_X + px(PLACED) + px(scene.newRequest) + 4} y={62} fontSize={9} fontWeight={700} fill={newFits ? "#15803d" : "#b91c1c"} textAnchor="end">
                새 Pod {scene.newRequest}m {newFits ? "≤" : ">"} 남은 {remaining}m
              </text>
            ) : null}
            {/* Allocatable 경계선 */}
            <line x1={BAR_X + px(ALLOCATABLE)} y1={16} x2={BAR_X + px(ALLOCATABLE)} y2={54} stroke="#0f172a" strokeWidth={1.25} strokeDasharray="3 2" />
            <text x={BAR_X + px(ALLOCATABLE)} y={12} fontSize={9} fontWeight={700} textAnchor="end" className="fill-foreground">Allocatable 14,500m</text>

            {/* 아랫줄: 사용량 */}
            <text x={BAR_X} y={90} fontSize={10} fontWeight={700} className="fill-muted-foreground">kubelet 측정 · 실제 사용량</text>
            <rect x={BAR_X} y={96} width={BAR_W} height={30} rx={4} className="fill-background" stroke="#94a3b8" />
            <rect x={BAR_X + px(ALLOCATABLE)} y={96} width={px(RESERVED)} height={30} fill="#cbd5e1" />
            <motion.rect x={BAR_X} y={96} height={30} fill="#f59e0b" initial={false} animate={{ width: scene.showUsed ? px(USED) : 0 }} transition={{ duration: dur }} />
            {scene.showUsed ? (
              <text x={BAR_X + px(USED) + 6} y={115} fontSize={10} fontWeight={700} fill="#b45309">2,900m 사용 (18%)</text>
            ) : null}
            <text x={BAR_X} y={142} fontSize={9} className="fill-muted-foreground">0</text>
            <text x={BAR_X + BAR_W} y={142} fontSize={9} textAnchor="end" className="fill-muted-foreground">16,000m</text>
          </svg>

<div className="mt-3 grid border-l border-primary/50 pl-4">
            {SCENES.map((item, i) => (
              <p key={i} aria-hidden={i !== scenes.active} className={`col-start-1 row-start-1 text-sm leading-7 text-muted-foreground ${i === scenes.active ? "" : "invisible"}`}>
                {item.note}
              </p>
            ))}
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
