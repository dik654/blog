import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 3절 사례의 한 실행을 숫자 칸 단위로 센다. 칸 하나 = 숫자 하나 = 2byte. 가로 네 칸은 KV head 2개 × 폭 2다.
 * 한 mechanism: 새 K/V는 저장 뒤에 붙어 남고, 같은 크기의 현재 Q는 읽기가 끝나면 사라진다.
 */
const K = "#2563eb";
const V = "#16a34a";
const Q = "#7c3aed";
const POSITIONS = [1, 2, 3, 4] as const;
const FIRST_Q = ["1", "0", "", "", "", "", "", ""] as const;

const SCENES = [
  { label: "실행 전 · 3위치", newRow: "none", query: false, kv: "K 24 + V 24 = 48byte", q: "Q 없음", note: "3위치 × KV head 2개 × 숫자 2개로 K와 V가 각각 12칸입니다. 칸마다 2byte라 각각 24byte입니다." },
  { label: "현재 값 만들기", newRow: "pending", query: true, kv: "새 K 8 + 새 V 8 = 16byte 대기", q: "Q 8칸 = 16byte", note: "점선 줄이 현재 위치의 새 K 4칸과 V 4칸입니다. Q는 head 4개 × 숫자 2개로 8칸입니다." },
  { label: "기록 뒤에 붙이기", newRow: "stored", query: true, kv: "K 32 + V 32 = 64byte", q: "Q 8칸 = 16byte", note: "새 줄을 위치 축 뒤에 붙여 K와 V가 각각 16칸이 됩니다. 저장은 48byte에서 64byte로 늘어납니다." },
  { label: "Q로 네 줄 읽기", newRow: "stored", query: true, kv: "K 32 + V 32 = 64byte", q: "Q가 4위치를 읽음", note: "현재 Q는 과거 3위치와 방금 붙인 자기 위치까지 읽습니다. 첫 Q head의 (1, 0)만 표시했고, 다른 head의 값은 칸만 남겼습니다." },
  { label: "실행 뒤 · 4위치", newRow: "stored", query: false, kv: "K 32 + V 32 = 64byte", q: "Q 없음", note: "Q 16byte는 남지 않습니다. 다음 실행은 새 Q를 만들고 K와 V 16칸씩을 그대로 읽습니다." },
] as const;

function Cell({ value, color, dashed = false }: { value: string; color: string; dashed?: boolean }) {
  return (
    <span
      className="flex h-7 min-w-0 items-center justify-center rounded-sm border font-mono text-xs font-bold text-foreground"
      style={{ borderColor: color, borderStyle: dashed ? "dashed" : "solid", backgroundColor: dashed ? "transparent" : `${color}1f` }}
    >
      {value}
    </span>
  );
}

function Store({ name, color, values, newRow }: { name: string; color: string; values: (c: number) => readonly number[]; newRow: string }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-center text-xs font-bold" style={{ color }}>{name}</p>
      <div className="grid gap-1">
        {POSITIONS.map((position) => {
          const isNew = position === 4;
          const hidden = isNew && newRow === "none";
          return (
            <div key={position} className={`grid grid-cols-4 gap-0.5 ${hidden ? "invisible" : ""}`}>
              {values(position).map((value, column) => (
                <Cell key={column} value={String(value)} color={color} dashed={isNew && newRow === "pending"} />
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function RecordByteTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="숫자 칸으로 세는 한 실행"
      title="크기가 같은 16byte라도 K/V는 남고 Q는 사라집니다"
      description="칸 하나가 숫자 하나이고 숫자마다 2byte입니다. 위아래 줄은 위치, 한 줄의 네 칸은 KV head 2개 × 숫자 2개입니다."
      note="Q head 4·KV head 2·폭 2·요청 1개인 3절 사례입니다(가정). 위치 변환을 끝낸 K를 표시했습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="한 실행에서 K, V, Q의 숫자 칸과 byte"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3">
            <p className="mb-1 text-xs font-bold" style={{ color: Q }}>현재 Q</p>
            <div className={`grid grid-cols-8 gap-0.5 ${scene.query ? "" : "invisible"}`}>
              {FIRST_Q.map((value, index) => (
                <Cell key={index} value={value} color={Q} />
              ))}
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Store name="K" color={K} newRow={scene.newRow} values={(c) => [0, c, c, 0]} />
            <Store name="V" color={V} newRow={scene.newRow} values={(c) => [c, 2 * c, 2 * c, c]} />
          </div>
          <dl className="mt-3 grid gap-1 font-mono text-xs sm:grid-cols-2">
            <div><dt className="inline font-sans text-muted-foreground">저장 </dt><dd className="inline font-bold">{scene.kv}</dd></div>
            <div><dt className="inline font-sans text-muted-foreground">이번 실행 </dt><dd className="inline font-bold">{scene.q}</dd></div>
          </dl>
          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
