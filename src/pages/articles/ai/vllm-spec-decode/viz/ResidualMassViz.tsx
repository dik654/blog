import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 확률 1을 100칸으로 나눠 한 위치의 수락·거부·보충을 센다.
 * 초안 q=(A .4, B .6), 기준 p=(A .7, B .3).
 * 한 mechanism: 거부된 30칸을 부족분 (p−q)₊=(.3,0)으로 채우면 70/30이 되고, p로 다시 뽑으면 61/39가 된다.
 */
type Cell = "pA" | "pB" | "accA" | "accB" | "rej" | "fixA" | "wrongA" | "wrongB";

const A = "#2563eb";
const B = "#d97706";

const STYLE: Record<Cell, { bg: string; border: string; text: string; label: string }> = {
  pA: { bg: "#2563eb33", border: "#2563eb", text: "", label: "A 제안" },
  pB: { bg: "#d9770633", border: "#d97706", text: "", label: "B 제안" },
  accA: { bg: A, border: A, text: "", label: "A 수락" },
  accB: { bg: B, border: B, text: "", label: "B 수락" },
  rej: { bg: "#9ca3af33", border: "#9ca3af", text: "×", label: "거부" },
  fixA: { bg: A, border: "#16a34a", text: "+", label: "A 보충" },
  wrongA: { bg: A, border: "#dc2626", text: "!", label: "p로 다시 뽑은 A" },
  wrongB: { bg: B, border: "#dc2626", text: "!", label: "p로 다시 뽑은 B" },
};

/** 0–39 A 제안, 40–99 B 제안. B 제안 중 뒤쪽 30칸(70–99)이 거부된다. */
function cellAt(scene: number, i: number): Cell {
  const isA = i < 40;
  const rejected = i >= 70;
  if (scene === 0) return isA ? "pA" : "pB";
  if (scene === 1) return isA ? "accA" : rejected ? "pB" : "accB";
  if (scene === 2) return isA ? "accA" : rejected ? "rej" : "accB";
  if (scene === 3) return isA ? "accA" : rejected ? "fixA" : "accB";
  // 오답 경로: 거부 30칸을 p=(.7,.3)으로 다시 뽑아 21칸 A, 9칸 B
  if (isA) return "accA";
  if (!rejected) return "accB";
  return i < 91 ? "wrongA" : "wrongB";
}

interface Scene {
  label: string;
  a: number;
  b: number;
  gray: number;
  verdict: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "초안 q로 제안", a: 40, b: 60, gray: 0, verdict: "제안 비중 40 : 60", note: "초안 모델이 A를 40칸, B를 60칸 비중으로 제안합니다. 아직 기준 모델 p와 맞춰 보지 않았습니다." },
  { label: "min(p, q)만큼 수락", a: 40, b: 30, gray: 30, verdict: "수락 40 + 30 = 70칸", note: "A는 p(.7)가 q(.4)보다 커서 40칸을 모두 유지합니다. B는 p(.3)가 q(.6)보다 작아 60칸 중 30칸만 유지합니다." },
  { label: "거부 30칸", a: 40, b: 30, gray: 30, verdict: "거부 비중 Z = .3", note: "유지하지 못한 B의 30칸은 회색이 됩니다. 이 30칸에 어떤 토큰을 줄지가 보존을 가릅니다." },
  { label: "부족분 (p−q)₊로 보충", a: 70, b: 30, gray: 0, verdict: "A 70 : B 30 = p", note: "기준 모델보다 모자란 쪽은 A의 .3뿐입니다. 거부 30칸을 모두 A로 채우면 A 40+30=70, B 30으로 p와 정확히 같아집니다." },
  { label: "오답: p로 다시 뽑기", a: 61, b: 39, gray: 0, verdict: "A 61 : B 39 ≠ p", note: "거부 30칸을 p 전체(.7/.3)로 다시 뽑으면 A 21칸, B 9칸이 됩니다. 이미 수락한 B 30칸에 9칸이 더해져 61/39로 어긋납니다." },
];

export default function ResidualMassViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const cells = Array.from({ length: 100 }, (_, i) => cellAt(scenes.active, i));
  const prev = scenes.active === 0 ? cells : Array.from({ length: 100 }, (_, i) => cellAt(scenes.active - 1, i));
  const legend = [...new Set(cells)];
  const ok = scenes.active === 3;
  const wrong = scenes.active === 4;

  return (
    <VizFrame
      eyebrow="Residual mass"
      title="거부된 30칸을 부족분으로 채워야 기준 분포 70/30이 됩니다"
      description="확률 1을 100칸으로 나눴습니다. 파란 칸은 A, 주황 칸은 B이고 연한 칸은 아직 판정 전 제안입니다."
      note="한 위치만 떼어 본 두 후보 예시입니다. 기준 p=(.7, .3), 초안 q=(.4, .6)."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="수락과 보충으로 확률 100칸이 나뉘는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-start">
            <div className="grid w-fit grid-cols-10 gap-[3px]" role="img" aria-label={`A ${scene.a}칸, B ${scene.b}칸, 거부 ${scene.gray}칸`}>
              {cells.map((c, i) => {
                const s = STYLE[c];
                const changed = c !== prev[i];
                return (
                  <motion.span
                    key={i}
                    className="flex h-6 w-6 items-center justify-center rounded-[3px] border text-[10px] font-black text-white"
                    initial={false}
                    animate={{ backgroundColor: s.bg, borderColor: s.border }}
                    transition={{ duration: reduced ? 0 : 0.3, delay: reduced || !changed ? 0 : 0.15 + (i % 30) * 0.03 }}
                  >
                    {s.text}
                  </motion.span>
                );
              })}
            </div>

            <div className="min-h-[13rem] min-w-0 space-y-3 sm:min-h-0">
              {[
                { name: "A", value: scene.a, target: 70, color: A },
                { name: "B", value: scene.b, target: 30, color: B },
              ].map((row) => (
                <div key={row.name}>
                  <div className="flex justify-between font-mono text-xs">
                    <span className="font-bold">{row.name}</span>
                    <span>
                      {row.value}칸 <span className="text-muted-foreground">/ 기준 {row.target}</span>
                    </span>
                  </div>
                  <div className="relative mt-1 h-3 rounded-sm bg-muted">
                    <motion.div
                      className="h-full rounded-sm"
                      style={{ backgroundColor: row.color }}
                      initial={false}
                      animate={{ width: `${row.value}%` }}
                      transition={{ duration: reduced ? 0 : 0.5 }}
                    />
                    <span className="absolute inset-y-[-3px] w-px bg-foreground" style={{ left: `${row.target}%` }} aria-hidden />
                  </div>
                </div>
              ))}
              <p className={`border-y border-border py-2 font-mono text-sm font-bold ${ok ? "text-[#16a34a]" : wrong ? "text-[#dc2626]" : "text-foreground"}`}>{scene.verdict}</p>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
                {legend.map((c) => (
                  <li key={c} className="flex items-center gap-1">
                    <span className="inline-flex h-3 w-3 items-center justify-center rounded-[2px] border text-[8px] font-black text-white" style={{ backgroundColor: STYLE[c].bg, borderColor: STYLE[c].border }}>
                      {STYLE[c].text}
                    </span>
                    {STYLE[c].label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
