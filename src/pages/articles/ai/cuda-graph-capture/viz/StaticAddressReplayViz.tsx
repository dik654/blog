import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 캡처한 네 작업은 "어느 자리에서 읽고 어느 자리에 쓰는가"를 고정해 둔다.
 * 그래서 재생은 언제나 A에서 읽어 Z에 쓰고, Python 이름을 B로 옮겨도 결과는 그대로이며,
 * A의 내용을 5로 덮어써야 30이 나온다. 숫자는 본문 사례(3 → 4 → 8 → 11 → 22, 5 → 30)를 그대로 쓴다.
 */
const SLOTS = ["A", "t1", "t2", "t3", "Z"] as const;
const OPS = [
  { op: "+1", from: "A", to: "t1" },
  { op: "×2", from: "t1", to: "t2" },
  { op: "+3", from: "t2", to: "t3" },
  { op: "×2", from: "t3", to: "Z" },
] as const;

interface Scene {
  label: string;
  /** A, t1, t2, t3, Z 값. null은 아직 쓰지 않은 자리 */
  mem: readonly (number | null)[];
  /** 이번 장면에서 새로 쓴 자리부터 차례로 애니메이션할지 */
  replay: boolean;
  b: number | null;
  keep: number | null;
  x: "A" | "B";
  r: boolean;
  copyArrow: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "캡처 · 주소 기록",
    mem: [3, null, null, null, null],
    replay: false,
    b: null,
    keep: null,
    x: "A",
    r: false,
    copyArrow: false,
    note: "캡처는 네 작업의 순서와 함께 읽을 자리와 쓸 자리를 남깁니다. 첫 작업은 A에서 읽고 마지막 작업은 Z에 씁니다. 이 순간 A에는 3이 있습니다.",
  },
  {
    label: "재생 · Z = 22",
    mem: [3, 4, 8, 11, 22],
    replay: true,
    b: null,
    keep: null,
    x: "A",
    r: true,
    copyArrow: false,
    note: "재생하면 기록한 순서대로 A → t1 → t2 → t3 → Z에 4·8·11·22를 씁니다. r은 Z를 가리키는 참조라서 지금 22를 봅니다.",
  },
  {
    label: "x = B(5) 후 재생",
    mem: [3, 4, 8, 11, 22],
    replay: true,
    b: 5,
    keep: null,
    x: "B",
    r: true,
    copyArrow: false,
    note: "Python 이름 x를 새 자리 B(값 5)에 붙여도 기록된 첫 작업은 여전히 A를 읽습니다. 재생 결과는 그대로 22입니다.",
  },
  {
    label: "A.copy_(5) 후 재생",
    mem: [5, 6, 12, 15, 30],
    replay: true,
    b: 5,
    keep: null,
    x: "A",
    r: true,
    copyArrow: true,
    note: "B의 5를 기록된 자리 A에 복사한 뒤 재생하면 같은 네 작업이 6·12·15·30을 씁니다. 주소를 바꾼 것이 아니라 A의 내용을 바꿨습니다.",
  },
  {
    label: "덮어쓴 Z와 보관",
    mem: [5, 6, 12, 15, 30],
    replay: false,
    b: 5,
    keep: 22,
    x: "A",
    r: true,
    copyArrow: false,
    note: "재생이 Z에 30을 쓰면 r이 보던 22도 30으로 바뀝니다. 22를 남기려면 다음 재생 전에 다른 자리로 복사해 두어야 하고 그 복사 비용도 듭니다.",
  },
];

function Cell({ name, value, delay, highlight, dim }: { name: string; value: number | null; delay: number; highlight?: "copy" | "warn"; dim?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1">
      <span className="font-mono text-[10px] text-muted-foreground">{name}</span>
      <div
        className={`flex h-10 w-full items-center justify-center rounded-sm border font-mono text-base font-bold ${
          highlight === "warn" ? "border-[#dc2626] text-[#dc2626]" : highlight === "copy" ? "border-[#d97706]" : "border-border"
        } ${dim ? "opacity-40" : ""}`}
      >
        {value === null ? (
          <span className="text-xs font-normal text-muted-foreground">빈칸</span>
        ) : (
          <motion.span key={`${name}-${value}-${delay}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.3 }}>
            {value}
          </motion.span>
        )}
      </div>
    </div>
  );
}

export default function StaticAddressReplayViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const delayAt = (i: number) => (reduced || !scene.replay ? 0 : 0.35 + i * 0.45);

  return (
    <VizFrame
      eyebrow="Static address replay"
      title="재생은 기록한 자리에서 읽고 쓰므로 새 입력은 그 자리에 복사합니다"
      description="위 줄은 캡처한 작업 네 개와 각 작업이 읽고 쓰는 자리, 아래 줄은 그 자리의 실제 값입니다. x와 r은 Python 코드가 붙인 이름입니다."
      note="A·t1·t2·t3·Z·B는 실제 가상 주소를 대신하는 표지이고 값은 본문 사례입니다. 복사가 재생보다 먼저 끝난다고 가정합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CUDA Graph 재생과 고정 주소"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          {/* 기록된 작업: 읽는 자리 → 쓰는 자리 (캡처 뒤 고정) */}
          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {OPS.map((o, i) => (
              <motion.div
                key={o.op + i}
                className="rounded-sm border px-2 py-1.5 font-mono text-xs"
                initial={{ borderColor: "rgba(203,213,225,1)" }}
                animate={{ borderColor: scene.replay ? "rgba(37,99,235,1)" : "rgba(203,213,225,1)" }}
                transition={{ delay: delayAt(i), duration: 0.2 }}
              >
                <span className="font-bold">작업 {i + 1} · {o.op}</span>
                <span className="ml-2 text-muted-foreground">
                  {o.from} → {o.to}
                </span>
              </motion.div>
            ))}
          </div>

          {/* 메모리 자리 */}
          <div className="mt-4 grid grid-cols-[repeat(5,minmax(0,1fr))_0.5rem_repeat(2,minmax(0,1fr))] gap-1.5">
            {SLOTS.map((name, i) => (
              <Cell
                key={name}
                name={name}
                value={scene.mem[i]}
                delay={i === 0 ? (scene.copyArrow && !reduced ? 0.15 : 0) : delayAt(i - 1)}
                highlight={i === 0 && scene.copyArrow ? "copy" : i === 4 && scene.keep !== null ? "warn" : undefined}
              />
            ))}
            <span className="self-end pb-3 text-center text-xs text-muted-foreground">|</span>
            <Cell name="B" value={scene.b} delay={0} dim={scene.b === null} />
            <Cell name="보관" value={scene.keep} delay={reduced ? 0 : 0.3} dim={scene.keep === null} />
          </div>

          {/* Python 이름 */}
          <div className="mt-1 grid h-5 grid-cols-[repeat(5,minmax(0,1fr))_0.5rem_repeat(2,minmax(0,1fr))] gap-1.5 whitespace-nowrap font-mono text-[11px] font-bold">
            <span className="text-center text-[#2563eb]">{scene.x === "A" ? "↑ x" : ""}</span>
            <span />
            <span />
            <span />
            <span className="text-center text-[#16a34a]">{scene.r ? "↑ r" : ""}</span>
            <span />
            <span className="text-center text-[#2563eb]">{scene.x === "B" ? "↑ x" : ""}</span>
            <span className="text-center text-muted-foreground">{scene.keep !== null ? "↑ 사본" : ""}</span>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">첫 작업이 읽는 자리</dt>
              <dd className="font-bold text-foreground">A (고정)</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">A의 값</dt>
              <dd className="font-bold text-foreground">{scene.mem[0]}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">r이 보는 값</dt>
              <dd className={`font-bold ${scene.keep !== null ? "text-[#dc2626]" : "text-[#16a34a]"}`}>{scene.r ? scene.mem[4] : "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">이번에 바꾼 것</dt>
              <dd className="font-bold text-[#b45309]">
                {scenes.active === 0 ? "주소 기록" : scenes.active === 1 ? "없음" : scenes.active === 2 ? "이름만(x)" : scenes.active === 3 ? "A의 내용" : "Z 덮어씀"}
              </dd>
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
