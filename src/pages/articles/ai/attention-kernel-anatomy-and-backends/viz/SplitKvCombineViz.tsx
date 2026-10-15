import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 위치 7이 읽는 key 8칸(값 1~8, 점수 모두 0)을 3·3·2칸 lane으로 나눠 부분 결과를 만들고
 * combine kernel이 LSE 비중 3/8·3/8·2/8로 합친다.
 * 한 mechanism: 부분 평균만 남기면 비중이 사라지므로 LSE를 함께 써 둔다.
 */
const LANES = [
  { name: "lane 0", keys: [1, 2, 3], color: "#2563eb", soft: "#dbeafe", sum: 6, count: 3, o: "2", lse: "ln 3 ≈ 1.099", w: "3/8" },
  { name: "lane 1", keys: [4, 5, 6], color: "#0d9488", soft: "#ccfbf1", sum: 15, count: 3, o: "5", lse: "ln 3 ≈ 1.099", w: "3/8" },
  { name: "lane 2", keys: [7, 8], color: "#d97706", soft: "#fef3c7", sum: 15, count: 2, o: "7.5", lse: "ln 2 ≈ 0.693", w: "2/8" },
] as const;

interface Scene {
  label: string;
  fill: boolean;
  workspace: boolean;
  strip: "none" | "equal" | "lse";
  output: string;
  wrong?: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "key 8칸을 세 lane으로",
    fill: false,
    workspace: false,
    strip: "none",
    output: "—",
    note: "한 행의 key 8칸을 서로 겹치지 않게 3·3·2칸으로 나눕니다. 세 lane은 같은 kernel 안에서 동시에 일합니다. 이번 사례의 점수는 모두 0이라 각 칸의 가중치는 e⁰=1입니다.",
  },
  {
    label: "lane마다 합과 지수합",
    fill: true,
    workspace: false,
    strip: "none",
    output: "—",
    note: "lane 안에서 값의 가중합과 지수합을 쌓습니다. 합은 6·15·15, 지수합은 칸 수와 같은 3·3·2입니다.",
  },
  {
    label: "부분 결과를 workspace에",
    fill: true,
    workspace: true,
    strip: "none",
    output: "—",
    note: "첫 kernel은 lane마다 정규화한 부분 출력 O_j=2·5·7.5와 지수합의 로그 L_j를 workspace에 씁니다. 여기서 kernel이 끝나고 비중을 아는 것은 L_j뿐입니다.",
  },
  {
    label: "오답 · 단순 평균",
    fill: true,
    workspace: true,
    strip: "equal",
    output: "(2 + 5 + 7.5) ÷ 3 = 4.833333",
    wrong: true,
    note: "O_j만 보고 세 값을 똑같이 섞으면 key 2칸뿐인 lane 2가 1/3이나 차지합니다. 4.833333은 여덟 값의 평균이 아닙니다.",
  },
  {
    label: "combine kernel",
    fill: true,
    workspace: true,
    strip: "lse",
    output: "2·3/8 + 5·3/8 + 7.5·2/8 = 4.5",
    note: "둘째 kernel이 전체 L=ln 8을 구하고 e^(L_j−L)로 비중 3/8·3/8·2/8을 되살립니다. 비중 띠의 칸 수가 lane의 key 수와 같고 출력은 36÷8=4.5입니다.",
  },
];

export default function SplitKvCombineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Split-KV · combine"
      title="부분 출력과 LSE를 함께 써야 두 번째 kernel이 비중을 되살립니다"
      description="위치 7이 읽는 key 8칸을 세 lane이 나눠 계산하고, workspace에 남긴 두 값으로 다른 kernel이 합칩니다."
      note="3·3·2 분할과 값 1~8은 본문의 교육용 사례입니다. 실제 구현은 key 조각 단위로 나눕니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="split-KV 부분 결과와 combine 단계"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          {/* key 8칸 */}
          <p className="mt-3 text-[11px] font-bold text-muted-foreground">위치 7이 읽는 key 값</p>
          <div className="mt-1 grid grid-cols-8 gap-1">
            {LANES.flatMap((lane) =>
              lane.keys.map((k) => (
                <div
                  key={k}
                  className="flex h-8 items-center justify-center rounded-sm border font-mono text-xs font-bold"
                  style={{ borderColor: lane.color, backgroundColor: lane.soft, color: "#0f172a" }}
                >
                  {k}
                </div>
              )),
            )}
          </div>

          {/* lane 누적과 workspace */}
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {LANES.map((lane, li) => (
              <div key={lane.name} className="min-w-0 rounded-sm border px-3 py-2 font-mono text-xs" style={{ borderColor: lane.color }}>
                <p className="font-bold" style={{ color: lane.color }}>
                  {lane.name} · {lane.keys.length}칸
                </p>
                <div className="mt-1 grid grid-cols-2 gap-x-2">
                  <span className="text-muted-foreground">합</span>
                  <motion.span key={`s${scene.fill}`} initial={{ opacity: 0 }} animate={{ opacity: scene.fill ? 1 : 0.15 }} transition={{ delay: reduced ? 0 : 0.15 * li, duration: reduced ? 0 : 0.4 }} className="font-bold">
                    {scene.fill ? lane.sum : "·"}
                  </motion.span>
                  <span className="text-muted-foreground">지수합</span>
                  <motion.span key={`c${scene.fill}`} initial={{ opacity: 0 }} animate={{ opacity: scene.fill ? 1 : 0.15 }} transition={{ delay: reduced ? 0 : 0.15 * li, duration: reduced ? 0 : 0.4 }} className="font-bold">
                    {scene.fill ? lane.count : "·"}
                  </motion.span>
                </div>
                <div className={`mt-2 border-t border-dashed pt-1 ${scene.workspace ? "" : "opacity-30"}`} style={{ borderColor: lane.color }}>
                  <span className="text-muted-foreground">workspace </span>
                  <span className="font-bold">{scene.workspace ? `O=${lane.o} · L=${lane.lse}` : "비어 있음"}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 합치는 비중 띠 */}
          <p className="mt-3 text-[11px] font-bold text-muted-foreground">
            {scene.strip === "equal" ? "단순 평균의 비중 (lane마다 1/3)" : scene.strip === "lse" ? "combine 비중 e^(L_j − ln 8)" : "합칠 비중"}
          </p>
          <div className="mt-1 flex h-7 overflow-hidden rounded-sm border border-border">
            {scene.strip === "none" ? (
              <div className="flex-1 bg-muted/30" />
            ) : (
              LANES.map((lane) => (
                <motion.div
                  key={lane.name}
                  className="flex items-center justify-center border-r border-background font-mono text-[11px] font-bold text-white"
                  style={{ backgroundColor: lane.color }}
                  initial={false}
                  animate={{ flexGrow: scene.strip === "equal" ? 1 : lane.keys.length }}
                  transition={{ duration: reduced ? 0 : 0.6 }}
                >
                  {scene.strip === "equal" ? "1/3" : lane.w}
                </motion.div>
              ))
            )}
          </div>
          <p className={`mt-3 min-h-[3.5rem] border-y border-border py-2 font-mono text-sm font-bold sm:min-h-0 ${scene.wrong ? "text-[#dc2626]" : "text-[#16a34a]"}`}>
            출력 {scene.output}
          </p>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
