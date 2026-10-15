import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 후보 [R,A,B,X,Y,X,Y] 일곱 자리를 한 번에 계산할 때 각 자리가 읽어도 되는 기록을 7×7 칸으로 센다.
 * 한 mechanism: 행 i가 읽는 열 = i의 조상 경로. 한 줄 문장이면 28칸, 이 가지 구조면 17칸.
 */
const LABELS = ["R₀", "A₁", "B₂", "X₃", "Y₄", "X₅", "Y₆"] as const;
const PARENT = [-1, 0, 0, 1, 1, 2, 2] as const;
const NODES = [
  { x: 120, y: 22 },
  { x: 62, y: 82 },
  { x: 178, y: 82 },
  { x: 30, y: 146 },
  { x: 94, y: 146 },
  { x: 146, y: 146 },
  { x: 210, y: 146 },
] as const;

const ancestors = (i: number) => {
  const out = new Set<number>([i]);
  for (let p: number = PARENT[i]; p >= 0; p = PARENT[p]) out.add(p);
  return out;
};
const TREE = LABELS.map((_, i) => ancestors(i));

interface Scene {
  label: string;
  chain: boolean;
  rows: readonly number[];
  focus: readonly number[];
  count: string;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "한 줄로 읽으면", chain: true, rows: [0, 1, 2, 3, 4, 5, 6], focus: [], count: "1+2+⋯+7 = 28칸", note: "일곱 자리를 한 줄 문장으로 보면 각 자리가 자기와 앞의 모든 자리를 읽습니다. 아래 삼각형 28칸이 열립니다." },
  { label: "가지로 펼친 일곱 자리", chain: false, rows: [], focus: [], count: "아직 0칸", note: "같은 일곱 자리를 R 아래 A·B 두 갈래로 펼칩니다. 저장 번호 0~6은 문장 위치가 아니라 펼친 순서입니다." },
  { label: "A₁ · B₂ 행", chain: false, rows: [1, 2], focus: [1, 2], count: "{0,1} · {0,2}", note: "A₁은 R과 자기만, B₂도 R과 자기만 읽습니다. 저장 순서로 바로 앞인 A₁을 B₂가 읽지 않습니다." },
  { label: "같은 Y, 다른 행", chain: false, rows: [1, 2, 4, 6], focus: [4, 6], count: "Y₄ {0,1,4} · Y₆ {0,2,6}", note: "Y₄는 R·A를, Y₆은 R·B를 읽습니다. 글자가 같아도 읽는 조상이 달라 두 계산 기록은 서로 바꿔 쓸 수 없습니다." },
  { label: "가지 구조 전체", chain: false, rows: [0, 1, 2, 3, 4, 5, 6], focus: [], count: "1+2+2+3+3+3+3 = 17칸", note: "모든 행을 채우면 깊이별로 1·2·3칸씩 열려 17칸입니다. 한 줄로 읽은 28칸과 다르며 이 칸 수가 곧 GPU 연산 수는 아닙니다." },
  { label: "승인 경로만 남김", chain: false, rows: [0, 1, 2, 3, 4, 5, 6], focus: [0, 1, 4], count: "경로 0 → 1 → 4 = RAY", note: "큰 모델이 R→A→Y를 고르면 행 0·1·4의 기록만 남기고 나머지 갈래는 계산했어도 버립니다." },
];

export default function TreeMaskViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const allowed = (i: number, j: number) => (scene.chain ? j <= i : TREE[i].has(j));
  const lit = new Set<number>();
  scene.focus.forEach((f) => TREE[f].forEach((a) => lit.add(a)));
  const litEdge = (child: number) => lit.has(child) && lit.has(PARENT[child]);

  return (
    <VizFrame
      eyebrow="Tree attention mask"
      title="각 후보는 자기 조상만 읽어 일곱 자리를 한 번에 계산합니다"
      description="왼쪽은 후보 가지, 오른쪽 격자의 행은 읽는 자리, 열은 읽히는 기록입니다. 칠한 칸이 읽기를 허용한 칸입니다."
      note="처음 네 자리의 기록은 이미 있다고 두고 이번 회차의 일곱 자리만 그렸습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="후보 가지와 읽기 허용 격자"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex min-h-[3.7rem] flex-wrap content-start items-baseline justify-between gap-2 sm:min-h-0">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className="font-mono text-sm font-bold text-primary">{scene.count}</span>
          </div>
          <div className="mt-3 grid gap-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] sm:items-center">
            <svg viewBox="0 0 240 172" className="h-auto w-full max-w-[15rem]" role="img" aria-label={scene.chain ? "한 줄 문장" : "R 아래 A와 B 두 갈래"}>
              {LABELS.map((_, i) => {
                const parentIndex: number = PARENT[i] ?? -1;
                const parent = parentIndex >= 0 ? NODES[parentIndex] : undefined;
                return i === 0 || !parent ? null : (
                  <line
                    key={`e${i}`}
                    x1={parent.x}
                    y1={parent.y + 13}
                    x2={NODES[i].x}
                    y2={NODES[i].y - 13}
                    stroke={!scene.chain && litEdge(i) ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={!scene.chain && litEdge(i) ? 1.25 : 1}
                    strokeDasharray={scene.chain ? "3 3" : undefined}
                  />
                );
              })}
              {LABELS.map((l, i) => {
                const on = !scene.chain && lit.has(i);
                return (
                  <g key={l}>
                    <rect x={NODES[i].x - 17} y={NODES[i].y - 13} width={34} height={26} rx={5} fill={on ? "#2563eb" : undefined} className={on ? undefined : "fill-background"} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                    <text x={NODES[i].x} y={NODES[i].y + 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={on ? "#ffffff" : undefined} className={on ? undefined : "fill-foreground"}>
                      {l}
                    </text>
                  </g>
                );
              })}
            </svg>

            <div className="overflow-x-auto">
              <div className="inline-grid gap-[3px]" style={{ gridTemplateColumns: "2rem repeat(7, 1.75rem)" }} role="img" aria-label={`읽기 허용 ${scene.count}`}>
                <span />
                {LABELS.map((l) => (
                  <span key={l} className="text-center text-[10px] font-bold text-muted-foreground">
                    {l}
                  </span>
                ))}
                {LABELS.map((row, i) => {
                  const shown = scene.rows.includes(i);
                  const focused = scene.focus.length === 0 || scene.focus.includes(i);
                  return (
                    <div key={row} className="contents">
                      <span className={`text-[10px] font-bold leading-7 ${scene.focus.includes(i) ? "text-primary" : "text-muted-foreground"}`}>{row}</span>
                      {LABELS.map((col, j) => {
                        const on = shown && allowed(i, j);
                        const strong = on && focused;
                        return (
                          <motion.span
                            key={col}
                            className="h-7 rounded-[3px] border"
                            initial={false}
                            animate={{
                              backgroundColor: on ? (strong ? "#2563eb" : "#93c5fd") : "rgba(0,0,0,0)",
                              borderColor: on ? (strong ? "#2563eb" : "#93c5fd") : "#cbd5e1",
                            }}
                            transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : i * 0.06 + j * 0.02 }}
                          />
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
