import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: ModernArticle.tsx #partial-rope — head 256차원 중 앞 64차원만 위치 회전을 받는다.
 * 한 칸 = head의 차원 하나(16 × 16 = 256칸). 앞 4행(0~63차원)이 rotary 구간이다.
 * 확인한 1차 자료: Qwen/Qwen3.6-27B config.json — head_dim 256, partial_rotary_factor 0.25,
 * mrope_section [11, 11, 10], mrope_interleaved true.
 * transformers qwen3_5 recomposition_frequencies — 주파수 j는 j%3==1이면 height, j%3==2이고 j<30이면 width,
 * 나머지는 temporal. rotate_half가 차원 j와 j+32를 한 쌍으로 돌린다.
 */
type Axis = "t" | "h" | "w";
const axisOf = (j: number): Axis => (j % 3 === 1 && j < 33 ? "h" : j % 3 === 2 && j < 30 ? "w" : "t");
const AXIS_COLOR: Record<Axis, string> = { t: "#2563eb", h: "#16a34a", w: "#d97706" };
const ROTARY = "#2563eb";
const CONTENT = "#e2e8f0";

interface Scene {
  label: string;
  mode: "plain" | "split" | "pairs" | "text" | "visual" | "dot";
  value: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "head 256차원", mode: "plain", value: "d_h = 256칸", note: "full attention head 하나의 query·key는 256개 숫자입니다. 한 칸이 한 차원입니다." },
  { label: "앞 64차원만 회전", mode: "split", value: "64 회전 · 192 그대로", note: "partial_rotary_factor 0.25 때문에 앞 4행 64칸만 위치에 따라 돕니다. 아래 12행 192칸은 위치와 무관한 내용 좌표로 남습니다." },
  { label: "회전 짝 32개", mode: "pairs", value: "32쌍 = 주파수 32개", note: "차원 j와 j+32가 한 쌍으로 같은 각도만큼 돕니다. 위 두 행과 아래 두 행이 같은 열끼리 짝이고, 짝마다 주파수가 하나씩 정해집니다." },
  { label: "text token", mode: "text", value: "t = h = w = 위치 p", note: "text token은 세 위치 축에 같은 순번 p를 넣습니다. 그래서 32쌍이 모두 같은 p로 돌고, 보통의 RoPE와 같은 결과가 됩니다." },
  { label: "visual token", mode: "visual", value: "t 11 · h 11 · w 10", note: "visual token은 frame·행·열 세 좌표를 따로 넣습니다. 주파수가 t·h·w 순서로 번갈아 축을 맡아 32쌍이 11·11·10으로 나뉩니다." },
  { label: "q · k 내적", mode: "dot", value: "64칸만 p − p′를 봄", note: "q와 k를 곱할 때 상대 위치는 회전한 64칸에서만 드러납니다. 192칸은 위치와 무관하게 곱해집니다. 칸 수가 바뀌지 않으므로 memory 절감은 0입니다." },
];

function cellColor(dim: number, mode: Scene["mode"]): string {
  const rotary = dim < 64;
  if (mode === "plain") return "#cbd5e1";
  if (!rotary) return CONTENT;
  if (mode === "visual") return AXIS_COLOR[axisOf(dim % 32)];
  return ROTARY;
}

export default function PartialRopeHeadViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const dims = Array.from({ length: 256 }, (_, i) => i);
  const pairCol = 5;

  return (
    <VizFrame
      eyebrow="Partial M-RoPE"
      title="head 256칸 중 앞 64칸만 위치에 따라 돕니다"
      description="한 칸이 head의 차원 하나입니다. 파란 칸은 위치 회전을 받는 차원, 회색 칸은 회전하지 않는 차원입니다."
      note="Qwen3.6-27B config(head_dim 256 · partial_rotary_factor 0.25 · mrope_section [11, 11, 10] · interleaved)와 Transformers qwen3_5의 주파수 배치 코드를 따랐습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="head 차원 중 위치 회전을 받는 칸"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
            <div className="mx-auto w-full max-w-[18rem] sm:mx-0 sm:w-[15rem]">
              <div className="grid grid-cols-16 gap-[2px]" style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }} aria-label="head 차원 16 × 16 격자">
                {dims.map((d) => {
                  const inPair = scene.mode === "pairs" && d < 64 && d % 16 === pairCol;
                  const dim = scene.mode === "dot" && d >= 64;
                  return (
                    <motion.span
                      key={d}
                      className="aspect-square rounded-[2px] border"
                      initial={false}
                      animate={{
                        backgroundColor: cellColor(d, scene.mode),
                        borderColor: inPair ? "#0f172a" : "rgba(15,23,42,0)",
                        opacity: dim ? 0.45 : 1,
                      }}
                      transition={{ duration: reduced ? 0 : 0.35, delay: reduced ? 0 : scene.mode === "split" && d < 64 ? d * 0.006 : 0 }}
                    />
                  );
                })}
              </div>
              <div className="mt-2 flex justify-between font-mono text-[10px] text-muted-foreground">
                <span>0~63 회전</span>
                <span>64~255 그대로</span>
              </div>
            </div>

            <div className="min-h-[9.5rem] min-w-0 space-y-3 text-sm sm:min-h-0">
              <p className="border-y border-border py-2 font-mono text-base font-bold text-[#2563eb]">{scene.value}</p>
              {scene.mode === "pairs" ? (
                <p className="font-mono text-xs leading-6 text-muted-foreground">
                  테두리 칸: 차원 {pairCol}·{pairCol + 16}과 그 짝 {pairCol + 32}·{pairCol + 48}
                </p>
              ) : null}
              {scene.mode === "visual" ? (
                <ul className="space-y-1 font-mono text-xs">
                  {(["t", "h", "w"] as const).map((a) => (
                    <li key={a} className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-[2px]" style={{ backgroundColor: AXIS_COLOR[a] }} />
                      {a === "t" ? "temporal · frame 11쌍" : a === "h" ? "height · 행 11쌍" : "width · 열 10쌍"}
                    </li>
                  ))}
                </ul>
              ) : null}
              {scene.mode === "dot" ? (
                <dl className="grid grid-cols-2 gap-2 font-mono text-xs">
                  <div>
                    <dt className="text-muted-foreground">위치를 보는 칸</dt>
                    <dd className="font-bold text-[#2563eb]">64</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">위치 무관 칸</dt>
                    <dd className="font-bold text-foreground">192</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">KV에 남는 칸</dt>
                    <dd className="font-bold text-foreground">256 그대로</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">memory 절감</dt>
                    <dd className="font-bold text-foreground">0</dd>
                  </div>
                </dl>
              ) : null}
            </div>
          </div>
          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((item, index) => (
            <li key={item.label}>
              <strong>{index + 1}. {item.label} · {item.value}</strong>
              <span className="mt-1 block text-muted-foreground">{item.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}
