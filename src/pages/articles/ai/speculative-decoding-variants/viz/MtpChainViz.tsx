import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 기존 네 자리의 마지막 상태 h⁰가 R을 고른 뒤 후보 A·Y를 만드는 두 방식.
 * MTP(DeepSeek-V3 식 21–23): 깊이 k가 [RMSNorm(h^{k-1}); RMSNorm(Emb(t))]를 d×2d 투영 M_k로 합치고
 * TRM_k → 공유 OutHead로 다음 후보를 낸다. 깊이 2는 깊이 1이 고른 A를 기다린다.
 * Medusa: 같은 h⁰에서 head 1·2가 동시에 +2·+3 자리 후보를 낸다. head 2는 A를 입력으로 받지 않는다.
 */
interface Scene {
  label: string;
  depth: number;
  medusa: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "공통 출발 · h⁰ → R",
    depth: 0,
    medusa: false,
    note: "기존 네 자리를 지난 main model의 마지막 상태 h⁰가 다음 글자 R을 고릅니다. 두 방식 모두 여기서 출발합니다.",
  },
  {
    label: "MTP 깊이 1 · h⁰ + R → A",
    depth: 1,
    medusa: false,
    note: "깊이 1은 h⁰와 R의 embedding을 각각 정규화해 d+d=2d로 이어 붙이고, M₁(d×2d)이 다시 d로 줄입니다. TRM₁과 공유 OutHead를 지나 A를 냅니다.",
  },
  {
    label: "MTP 깊이 2 · h¹ + A → Y",
    depth: 2,
    medusa: false,
    note: "깊이 2는 깊이 1의 상태 h¹와 방금 고른 A를 받습니다. A가 정해져야 시작하므로 두 깊이는 순서대로 실행됩니다.",
  },
  {
    label: "Medusa · h⁰에서 head 2개 동시",
    depth: 2,
    medusa: true,
    note: "Medusa head 1과 head 2는 같은 h⁰만 받아 +2·+3 자리(R이 +1 자리) 후보를 한 번에 냅니다. head 2는 A를 입력으로 보지 않습니다.",
  },
  {
    label: "비교 · 순차 2단계 vs 병렬 1단계",
    depth: 2,
    medusa: true,
    note: "MTP의 Y는 A에 맞춰 만든 후보이고, Medusa의 +3 자리 후보는 A를 모른 채 만든 후보입니다. 어느 쪽이든 후보는 기준 모델이 다시 검증합니다.",
  },
];

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";

function Vec({
  label,
  color,
  wide = false,
}: {
  label: string;
  color: string;
  wide?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className={`inline-block h-3 rounded-sm border ${wide ? "w-14" : "w-7"}`}
        style={{ borderColor: color, backgroundColor: `${color}33` }}
      />
      <span className="font-mono text-[10px] font-bold">{label}</span>
    </span>
  );
}

function Token({
  t,
  color,
  on,
  delay,
  reduced,
}: {
  t: string;
  color: string;
  on: boolean;
  delay: number;
  reduced: boolean;
}) {
  return (
    <motion.span
      className="inline-flex h-7 w-7 items-center justify-center rounded-sm border font-mono text-sm font-black"
      initial={false}
      animate={{
        opacity: on ? 1 : 0.25,
        backgroundColor: on ? color : "rgba(0,0,0,0)",
        color: on ? "#ffffff" : "#94a3b8",
        borderColor: on ? color : "#cbd5e1",
      }}
      transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : delay }}
    >
      {t}
    </motion.span>
  );
}

function Depth({
  k,
  prev,
  tok,
  out,
  on,
  reduced,
}: {
  k: number;
  prev: string;
  tok: string;
  out: string;
  on: boolean;
  reduced: boolean;
}) {
  return (
    <motion.div
      className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-sm border p-2"
      initial={false}
      animate={{ opacity: on ? 1 : 0.3, borderColor: on ? BLUE : "#cbd5e1" }}
      transition={{ duration: reduced ? 0 : 0.3 }}
    >
      <div className="min-w-0">
        <p className="text-[11px] font-bold">MTP 깊이 {k}</p>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]">
          <Vec label={`norm ${prev}`} color={BLUE} />
          <span>+</span>
          <Vec label={`norm Emb(${tok})`} color={AMBER} />
          <span>→</span>
          <span className="inline-flex items-center gap-1">
            <span className="inline-flex h-3 w-14 overflow-hidden rounded-sm border border-[#64748b]">
              <span
                className="w-1/2"
                style={{ backgroundColor: `${BLUE}55` }}
              />
              <span
                className="w-1/2"
                style={{ backgroundColor: `${AMBER}55` }}
              />
            </span>
            <span className="font-mono font-bold">2d</span>
          </span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px]">
          <span className="font-mono font-bold">
            M{k === 1 ? "₁" : "₂"} (d×2d)
          </span>
          <span>→</span>
          <Vec label="d" color="#64748b" />
          <span>→</span>
          <span className="font-mono font-bold">TRM{k === 1 ? "₁" : "₂"}</span>
          <span>→</span>
          <span className="font-mono font-bold">h{k === 1 ? "¹" : "²"}</span>
          <span>→</span>
          <span className="font-mono">공유 OutHead</span>
        </div>
      </div>
      <Token t={out} color={BLUE} on={on} delay={0.5} reduced={reduced} />
    </motion.div>
  );
}

export default function MtpChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="MTP chain · Medusa heads"
      title="MTP는 방금 고른 토큰을 다시 넣어 차례로, Medusa는 같은 상태에서 한꺼번에 후보를 냅니다"
      description="왼쪽은 DeepSeek-V3 MTP의 깊이 1·2, 오른쪽은 Medusa head 두 개입니다. 파란 막대는 상태, 주황 막대는 토큰 embedding이고 막대 길이는 d와 2d입니다."
      note="Medusa 후보 칸은 자리만 표시했습니다. 어떤 글자가 나오는지는 head의 학습 결과에 달려 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="MTP 순차 깊이와 Medusa 병렬 head 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 flex flex-wrap items-center gap-2 rounded-sm border border-border p-2 text-[11px]">
            <span className="font-bold">기존 네 자리</span>
            <span>→</span>
            <span className="font-mono font-bold">main model</span>
            <span>→</span>
            <Vec label="h⁰" color={BLUE} />
            <span>→</span>
            <span className="font-mono">OutHead</span>
            <span>→</span>
            <Token t="R" color="#475569" on delay={0} reduced={reduced} />
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
            <div className="min-w-0 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-[11px] font-bold text-[#2563eb]">
                  MTP · 순차 {Math.min(scene.depth, 2)}/2단계
                </p>
                <p className="font-mono text-[11px] font-bold">
                  후보 줄 R{scene.depth >= 1 ? " → A" : ""}
                  {scene.depth >= 2 ? " → Y" : ""}
                </p>
              </div>
              <Depth
                k={1}
                prev="h⁰"
                tok="R"
                out="A"
                on={scene.depth >= 1}
                reduced={reduced}
              />
              <Depth
                k={2}
                prev="h¹"
                tok="A"
                out="Y"
                on={scene.depth >= 2}
                reduced={reduced}
              />
            </div>

            <motion.div
              className="min-w-0 space-y-2"
              initial={false}
              animate={{ opacity: scene.medusa ? 1 : 0.3 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
            >
              <p className="text-[11px] font-bold text-[#16a34a]">
                Medusa · 병렬 1단계
              </p>
              {[1, 2].map((k) => (
                <div
                  key={k}
                  className="flex flex-wrap items-center gap-2 rounded-sm border border-border p-2 text-[10px]"
                >
                  <Vec label="h⁰" color={BLUE} />
                  <span>→</span>
                  <span className="font-mono font-bold">head {k}</span>
                  <span>→</span>
                  <motion.span
                    className="inline-flex h-7 min-w-[3.5rem] items-center justify-center rounded-sm border px-1 font-mono text-[10px] font-bold"
                    initial={false}
                    animate={{
                      backgroundColor: scene.medusa
                        ? `${GREEN}22`
                        : "rgba(0,0,0,0)",
                      borderColor: scene.medusa ? GREEN : "#cbd5e1",
                    }}
                    transition={{
                      duration: reduced ? 0 : 0.3,
                      delay: reduced ? 0 : 0.3,
                    }}
                  >
                    +{k + 1} 자리
                  </motion.span>
                </div>
              ))}
              <p className="text-[10px] leading-4 text-muted-foreground">
                두 head 모두 입력은 h⁰ 하나이고 R·A를 받지 않습니다.
              </p>
            </motion.div>
          </div>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls
          {...scenes}
          labels={SCENES.map((s) => s.label)}
        />
      </div>
    </VizFrame>
  );
}
