import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * DeltaNet 한 step을 2×2 state 행렬로 따라간다.
 * 한 mechanism: 감쇠 → 현재 key로 예측 읽기 → 오차 → 오차만 key 행에 쓰기. 행렬 칸 수는 4로 그대로다.
 * 본문 숫자: γ=.9, 예측 3, value 5, 오차 2, β=.25, 쓰는 양 .5. 다른 칸 값과 두 번째 성분은 설명용 가정이다.
 */
type Matrix = readonly [readonly [number, number], readonly [number, number]];

interface Scene {
  label: string;
  matrix: Matrix;
  focusRow: boolean;
  changed: readonly (readonly [number, number])[];
  read?: readonly [number, number];
  error?: readonly [number, number];
  write?: readonly [number, number];
  kvCols: number;
  danger?: boolean;
  note: string;
}

const V: readonly [number, number] = [5, 1];

const SCENES: readonly Scene[] = [
  {
    label: "이전 state",
    matrix: [[3.333, 1.111], [2, 2]],
    focusRow: true,
    changed: [],
    kvCols: 6,
    note: "state는 key 방향(행) × value 성분(열) 행렬입니다. 이번 token의 key는 a 방향이고 value는 (5, 1)입니다.",
  },
  {
    label: "감쇠 γ = .9",
    matrix: [[3, 1], [1.8, 1.8]],
    focusRow: false,
    changed: [[0, 0], [0, 1], [1, 0], [1, 1]],
    kvCols: 6,
    note: "쓰기 전에 모든 칸에 .9를 곱해 오래된 association을 줄입니다. 3.333은 3.0, 2.0은 1.8이 됩니다.",
  },
  {
    label: "key a로 예측 읽기",
    matrix: [[3, 1], [1.8, 1.8]],
    focusRow: true,
    changed: [],
    read: [3, 1],
    kvCols: 6,
    note: "key가 a 방향이므로 a 행을 그대로 읽어 예측 (3, 1)을 얻습니다. 이 state가 이미 알고 있는 값입니다.",
  },
  {
    label: "오차 = value − 예측",
    matrix: [[3, 1], [1.8, 1.8]],
    focusRow: true,
    changed: [],
    read: [3, 1],
    error: [2, 0],
    kvCols: 6,
    note: "실제 value (5, 1)에서 예측 (3, 1)을 빼면 오차는 (2, 0)입니다. 두 번째 성분은 이미 맞으므로 고칠 것이 없습니다.",
  },
  {
    label: "오차만 쓰기 β = .25",
    matrix: [[3.5, 1], [1.8, 1.8]],
    focusRow: true,
    changed: [[0, 0]],
    read: [3, 1],
    error: [2, 0],
    write: [0.5, 0],
    kvCols: 7,
    note: "β × 오차 = (.5, 0)을 a 행에만 더합니다. 바뀐 칸은 하나, 행렬은 여전히 4칸입니다. attention이었다면 같은 step에 KV 열이 6에서 7로 늘었습니다.",
  },
  {
    label: "대비 · 단순 누적",
    matrix: [[8, 2], [1.8, 1.8]],
    focusRow: true,
    changed: [[0, 0], [0, 1]],
    write: [5, 1],
    kvCols: 7,
    danger: true,
    note: "오차 대신 value 전체 (5, 1)을 더하면 a 행이 (8, 2)가 됩니다. 이미 맞던 두 번째 성분까지 다시 쌓여 같은 내용이 중복됩니다.",
  },
];

const f = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(Number(n.toFixed(3))));

function Vec({ label, values, tone }: { label: string; values?: readonly [number, number]; tone: string }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold text-muted-foreground">{label}</p>
      <div className="mt-1 grid grid-cols-2 gap-1">
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`flex h-8 items-center justify-center rounded-sm border font-mono text-xs font-bold ${values ? "" : "border-dashed border-border text-transparent"}`}
            style={values ? { borderColor: tone, color: tone } : undefined}
          >
            {values ? f(values[i]) : "·"}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DeltaUpdateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4400);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;

  return (
    <VizFrame
      eyebrow="Delta rule · one step"
      title="state 행렬을 키우지 않고 key 행의 틀린 만큼만 고쳐 씁니다"
      description="행은 key 방향 a·b, 열은 value 성분 두 개입니다. 주황 테두리 행이 이번 key가 가리키는 행이고 초록으로 깜빡이는 칸이 이번 장면에서 값이 바뀐 칸입니다."
      note="γ=.9, 예측 3, value 5, 오차 2, β=.25, 쓰는 양 .5는 본문 값입니다. b 행 값, 두 번째 성분, KV 열 수 6은 설명용 가정입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="DeltaNet state 한 step의 감쇠, 예측, 오차, 쓰기"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-3 grid gap-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-muted-foreground">state S (4칸)</p>
              <div className="mt-1 grid grid-cols-[2.5rem_repeat(2,minmax(0,1fr))] gap-1">
                <span />
                <span className="text-center text-[10px] text-muted-foreground">성분 1</span>
                <span className="text-center text-[10px] text-muted-foreground">성분 2</span>
                {scene.matrix.map((row, r) => (
                  <div key={r} className="contents">
                    <span className={`flex items-center text-[11px] font-bold ${r === 0 && scene.focusRow ? "text-[#b45309]" : "text-muted-foreground"}`}>key {r === 0 ? "a" : "b"}</span>
                    {row.map((v, c) => {
                      const changed = scene.changed.some(([cr, cc]) => cr === r && cc === c);
                      const focus = r === 0 && scene.focusRow;
                      return (
                        <span
                          key={`${scenes.active}-${c}`}
                          className={`relative flex h-11 items-center justify-center overflow-hidden rounded-sm border font-mono text-sm font-bold ${focus ? "border-[#f59e0b]" : "border-border"} ${scene.danger && changed ? "text-[#dc2626]" : "text-foreground"}`}
                        >
                          <motion.span
                            aria-hidden
                            className="absolute inset-0"
                            style={{ backgroundColor: scene.danger ? "#fecaca" : "#bbf7d0" }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: changed && !reduced ? [0, 0.9, 0.35] : changed ? 0.35 : 0 }}
                            transition={{ delay: reduced ? 0 : 0.3, duration: 0.9 }}
                          />
                          <span className="relative">{f(v)}</span>
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] font-bold text-muted-foreground">attention이었다면 KV 열</p>
              <div className="mt-1 flex gap-1">
                {Array.from({ length: 7 }, (_, i) => (
                  <span
                    key={i}
                    className={`h-5 w-5 rounded-[2px] border ${i < scene.kvCols ? "border-[#2563eb] bg-[#2563eb]/70" : "border-dashed border-border"}`}
                  />
                ))}
                <span className="ml-1 self-center font-mono text-[11px] text-muted-foreground">{scene.kvCols}열</span>
              </div>
            </div>

            <div className="grid min-w-0 content-start gap-3">
              <Vec label="value v" values={V} tone="#334155" />
              <Vec label="예측 Sᵀk (a 행 읽기)" values={scene.read} tone="#b45309" />
              <Vec label="오차 e = v − 예측" values={scene.error} tone="#7c3aed" />
              <Vec label={scene.danger ? "더하는 양 = v 전체" : "쓰는 양 β·e"} values={scene.write} tone={scene.danger ? "#dc2626" : "#16a34a"} />
            </div>
          </div>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
