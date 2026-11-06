import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #compiler-pipeline — Python AST → ttir → ttgir → LLVM IR → PTX → cubin.
 * ttir에는 thread 배치 정보가 없고, ttgir에서 layout·num_warps·num_stages가 쓰이며,
 * LLVM 단계의 allocate-shared-memory가 offset을 확정합니다.
 */
interface LowerScene extends ShellScene {
  stage: number;
  known: readonly boolean[];
  block: "plain" | "layout" | "split";
}

const SCENES: readonly LowerScene[] = [
  { label: "Python AST", summary: "함수 본문은 실행되지 않음", note: "@triton.jit 함수의 본문은 실행되지 않고 compiler의 입력이 됩니다.", stage: 0, known: [false, false, false, false], block: "plain" },
  { label: "Triton IR (ttir)", summary: "hardware를 모르는 block 연산", note: "Inlining·공통식 제거·loop unroll 같은 일반 최적화만 합니다. thread 정보가 없고 num_warps·num_stages도 영향을 주지 않습니다.", stage: 1, known: [false, false, false, false], block: "plain" },
  { label: "TritonGPU IR · layout", summary: "tensor에 배분 정보가 붙음", note: "Layout은 원소를 warp와 thread에 배분하는 attribute입니다. coalesce는 연속 load에, accelerate-matmul은 tensor core에 맞춰 layout을 정합니다.", stage: 2, known: [true, true, false, false], block: "layout" },
  { label: "TritonGPU IR · pipeline", summary: "num_stages만큼 load를 앞당김", note: "pipeline pass가 load를 단계 수만큼 앞서 발행합니다. Hopper 이상에서는 warp-specialize가 load와 계산 warp를 나누며 SM 세대마다 경로가 갈립니다.", stage: 2, known: [true, true, true, false], block: "split" },
  { label: "LLVM IR (llir)", summary: "shared memory offset 확정", note: "allocate-shared-memory로 offset을 확정합니다. 조건이 맞으면 이때 load가 128-bit 명령 하나로 합쳐집니다.", stage: 3, known: [true, true, true, true], block: "split" },
  { label: "PTX · cubin", summary: "NVIDIA backend의 끝", note: "NVIDIA라면 PTX(중간 어셈블리)를 거쳐 ptxas가 SASS(실제 GPU 명령)를 담은 cubin을 만듭니다.", stage: 4, known: [true, true, true, true], block: "split" },
];

const STAGES = ["Python", "ttir", "ttgir", "llir", "PTX·cubin"];
const FACTS = ["layout", "num_warps", "num_stages", "SM offset"];
const WARP_ROWS = [0, 1];
const THREAD_COLS = [0, 1, 2, 3, 4, 5, 6, 7];

export default function LoweringStagesViz() {
  return (
    <SceneShell
      eyebrow="Lowering 사다리"
      title="한 block tensor가 단계를 내려가며 GPU 배치 정보를 얻습니다"
      description="IR은 compiler의 중간 표현이고 pass는 IR을 한 번 바꾸는 변환입니다. 띠는 낮아지는 순서, 칸은 같은 block, 목록은 그 단계까지 정해진 것입니다."
      note="칸은 warp 2개로 줄인 예시(가정), load·계산 warp 분리는 Hopper 이상, pass 이름은 2026-11-02 main commit 기준입니다."
      ariaLabel="Triton compiler의 단계별 lowering과 각 단계에서 정해지는 정보"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-5 gap-1">
              {STAGES.map((stage, index) => (
                <span key={stage} className={`min-w-0 rounded-sm border px-0 py-1.5 text-center font-mono text-[10px] leading-4 whitespace-nowrap sm:text-xs ${scene.stage === index ? "border-primary bg-primary/15 font-bold" : "border-border text-muted-foreground"}`}>
                  {stage}
                </span>
              ))}
            </div>
            <div className="grid min-w-0 gap-3 sm:grid-cols-2 sm:gap-4">
              <div className="min-w-0 space-y-1">
                {WARP_ROWS.map((row) => {
                  const colored = scene.block !== "plain";
                  const color = row === 0 ? "#2563eb" : "#d97706";
                  return (
                    <div key={row} className="flex min-w-0 items-center gap-2">
                      <div className="grid min-w-0 flex-1 grid-cols-8 gap-px">
                        {THREAD_COLS.map((col) => (
                          <span key={col} className="h-5 rounded-[2px] border sm:h-7" style={{ background: colored ? `${color}33` : "#94a3b81f", borderColor: colored ? color : "#94a3b866" }} />
                        ))}
                      </div>
                      <span className="w-16 shrink-0 text-right text-[11px] leading-4 text-muted-foreground">
                        {scene.block === "plain" ? "배정 없음" : scene.block === "layout" ? `warp ${row}` : row === 0 ? "load warp" : "계산 warp"}
                      </span>
                    </div>
                  );
                })}
              </div>
              <ul className="grid min-w-0 grid-cols-2 gap-1.5 text-xs">
                {FACTS.map((fact, index) => (
                  <li key={fact} className="flex items-center gap-2">
                    <span aria-hidden className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border font-mono text-[10px] ${scene.known[index] ? "border-primary bg-primary/15 font-bold" : "border-border text-muted-foreground"}`}>
                      {scene.known[index] ? "✓" : ""}
                    </span>
                    <span className={scene.known[index] ? "font-semibold" : "text-muted-foreground"}>{fact}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
