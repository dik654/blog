import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #code-footprint — 같은 축 위의 cache 용량과 code 크기, task 전환 순서.
 * 12 KiB ÷ 16 B = 768, 128 KiB ÷ 16 B = 8,192 (Volta V100 측정값).
 * "수천 instruction" 의 대표값 2,000 과 operator 10 × 2,000 = 20,000, task 열은 그림용 가정이다.
 */
const SCENES = [
  { label: "cache 두 칸", summary: "768 · 8,192 instruction", note: "SASS instruction 하나가 16 byte 이므로 scheduler 마다 있는 L0 약 12 KiB 는 약 768개, SM 당 L1 128 KiB 는 약 8,192개입니다. Volta V100 측정값이며 Hopper 의 값이 아닙니다." },
  { label: "mainloop 하나", summary: "2,000 (가정) > 768", note: "GEMM mainloop 하나가 unroll 뒤 수천 instruction 이면 그 하나로 L0 를 넘습니다. 막대는 수천을 2,000 으로 둔 가정입니다." },
  { label: "operator 열 개", summary: "10 × 2,000 (가정) > 8,192", note: "Operator 가 한 kernel 에 모이면 code 도 모입니다. Operator 열 개면 L1 도 넘어, task 가 바뀔 때 읽을 code 가 cache 밖에 있을 수 있습니다." },
  { label: "전환 횟수", summary: "전환 11번 vs 1번 (가정)", note: "Task 가 바뀌는 순간의 miss 는 L1 에서 채우면 수십 clock, L2 까지 가면 수백 clock 입니다. 같은 종류의 task 를 한 SM 에 이어 붙이면 이런 전환 자체가 줄어듭니다." },
] as const;

const AXIS = 20000;

function Row({ label, value, shown, color, dashed }: { label: string; value: number; shown: boolean; color: string; dashed?: boolean }) {
  return (
    <div className={`grid grid-cols-[5.75rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs ${shown ? "" : "invisible"}`}>
      <span className="font-semibold leading-4">{label}</span>
      <div className="h-5 min-w-0 rounded-sm bg-muted/40">
        <div className={`h-full rounded-sm border ${dashed ? "border-dashed" : ""}`} style={{ width: `${(value / AXIS) * 100}%`, borderColor: color, backgroundColor: `${color}40` }} />
      </div>
      <span className="text-right font-mono">{value.toLocaleString("en-US")}</span>
    </div>
  );
}

const MIXED = ["G", "A", "G", "A", "G", "A", "G", "A", "G", "A", "G", "A"] as const;
const GROUPED = ["G", "G", "G", "G", "G", "G", "A", "A", "A", "A", "A", "A"] as const;

function Sequence({ title, tasks }: { title: string; tasks: readonly string[] }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold">{title}</p>
      <div className="grid grid-cols-12 gap-0.5">
        {tasks.map((task, index) => {
          const switched = index > 0 && tasks[index - 1] !== task;
          return (
            <span
              key={index}
              className={`flex h-7 items-center justify-center rounded-sm border text-xs font-bold ${switched ? "border-l-2" : ""}`}
              style={{
                borderColor: "#94a3b8",
                borderLeftColor: switched ? "#dc2626" : "#94a3b8",
                backgroundColor: task === "G" ? "#2563eb26" : "#05966926",
              }}
            >
              {task}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function ICacheViz() {
  return (
    <SceneShell
      eyebrow="Instruction cache"
      title="같은 축에 놓으면 code 가 cache 를 넘는 자리가 보입니다"
      description="막대 단위는 instruction 개수이고 모든 장면이 같은 축(20,000)을 씁니다. L0 는 가장 가까운 작은 cache, L1 은 그다음 cache 입니다."
      ariaLabel="L0 와 L1 instruction cache 용량과 GEMM mainloop, operator 열 개의 code 크기, task 전환 순서 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active === 3 ? 1 : 0}
          scenes={[
            <div key="sizes" className="space-y-2.5">
              <Row label="L0" value={768} shown color="#2563eb" />
              <Row label="L1" value={8192} shown color="#7c3aed" />
              <Row label="mainloop (가정)" value={2000} shown={active >= 1} color="#d97706" dashed />
              <Row label="operator 10개 (가정)" value={20000} shown={active >= 2} color="#dc2626" dashed />
            </div>,
            <div key="order" className="space-y-3">
              <Sequence title="번갈아 배치 · 전환 11번" tasks={MIXED} />
              <Sequence title="같은 종류끼리 · 전환 1번" tasks={GROUPED} />
              <p className="text-xs leading-5 text-muted-foreground">G = GEMM task, A = attention task · 붉은 왼쪽 선 = 전환</p>
            </div>,
          ]}
        />
      )}
    />
  );
}
