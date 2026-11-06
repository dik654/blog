import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-item — item → _local_scalar_dense → pinned CPU 한 칸 → cudaMemcpyAsync → cudaStreamSynchronize → Scalar.
 * 일반 CUDA scalar 경로만 그린다. 희소·양자화 분기와 ROCm 조건 분기는 그림 밖이다.
 */
const STEPS = ["item()", "_local_scalar_dense", "pinned CPU 공간 1칸", "cudaMemcpyAsync", "cudaStreamSynchronize", "Scalar 반환"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  step: number;
  cpuSlot: string;
  arrow: boolean;
  cpuState: string;
  waiting: boolean;
}[] = [
  { label: "원소가 하나인지 검사", summary: "item()", step: 0, cpuSlot: "아직 없음", arrow: false, cpuState: "호출 실행 중", waiting: false, note: "item은 원소가 하나인지 검사합니다. 희소 tensor와 양자화 tensor에는 별도 분기가 있으므로 여기서는 일반 CUDA scalar 하나만 따라갑니다." },
  { label: "일반 tensor를 넘깁니다", summary: "_local_scalar_dense", step: 1, cpuSlot: "아직 없음", arrow: false, cpuState: "호출 실행 중", waiting: false, note: "일반 tensor는 _local_scalar_dense로 넘어가 CUDA 구현이 처리합니다." },
  { label: "CPU에 한 칸을 만듭니다", summary: "size 1 · pin_memory true", step: 2, cpuSlot: "비어 있음", arrow: false, cpuState: "호출 실행 중", waiting: false, note: "pinned memory는 복사에 쓰기 좋게 페이지를 고정한 CPU 메모리입니다. 원소 하나를 담을 크기로 만듭니다." },
  { label: "복사를 제출합니다", summary: "현재 stream에 비동기 복사", step: 3, cpuSlot: "복사 완료 전", arrow: true, cpuState: "제출 호출", waiting: false, note: "현재 stream에 GPU 값을 그 칸으로 옮기는 복사를 넣습니다. 비동기 복사라서 이 호출만으로 값이 도착했다고 볼 수 없습니다." },
  { label: "곧바로 stream을 기다립니다", summary: "CPU 대기", step: 4, cpuSlot: "복사 완료 전", arrow: true, cpuState: "stream 완료까지 기다림", waiting: true, note: "제출 다음 줄이 stream 완료 대기입니다. 그래서 이름에 Async가 있어도 CPU는 앞선 작업과 복사가 끝날 때까지 진행하지 않습니다." },
  { label: "그 한 원소를 읽습니다", summary: "CPU 쪽 Scalar", step: 5, cpuSlot: "값이 있음", arrow: false, cpuState: "값을 읽어 돌려줌", waiting: false, note: "기다림이 끝난 뒤 한 원소를 읽어 CPU 쪽 Scalar로 돌려줍니다. 원문의 앞쪽에는 ROCm 조건 분기도 있으며 일부 장치의 직접 읽기 경로 역시 stream 완료 확인을 거칩니다." },
];

export default function ItemReadPathViz() {
  return (
    <SceneShell
      eyebrow=".item()의 경로"
      title="값 하나를 읽는 호출 안에 복사와 대기가 있습니다"
      description="호출 순서 목록과 그 시점의 CPU 칸·GPU 값을 함께 봅니다. 일반 CUDA scalar 경로만 그렸습니다."
      ariaLabel="item 호출이 복사를 제출하고 stream 완료를 기다리는 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2">
            <ol className="space-y-1 font-mono text-xs">
              {STEPS.map((step, stepIndex) => (
                <li key={step} className={`break-words rounded-sm border px-2 py-1.5 ${stepIndex === scene.step ? "border-[#2563eb] font-bold text-[#2563eb]" : stepIndex < scene.step ? "border-border text-foreground" : "border-border/40 text-muted-foreground/70"}`}>
                  {stepIndex + 1}. {step}
                </li>
              ))}
            </ol>
            <div className="min-w-0 space-y-2 text-sm">
              <div className="grid grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-1 text-center">
                <div className="rounded-lg border border-border bg-background p-2">
                  <span className="block text-xs font-bold">CPU 칸</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{scene.cpuSlot}</span>
                </div>
                <span aria-hidden="true" className={`font-mono text-lg ${scene.arrow ? "text-[#2563eb]" : "opacity-0"}`}>←</span>
                <div className="rounded-lg border border-border bg-background p-2">
                  <span className="block text-xs font-bold">GPU 값</span>
                  <span className="mt-1 block text-xs text-muted-foreground">앞선 작업이 끝나야 준비됨</span>
                </div>
              </div>
              <div className={`rounded-lg border p-2 text-center text-xs font-bold ${scene.waiting ? "border-dashed border-[#d97706] text-[#b45309]" : "border-border"}`}>
                CPU: {scene.cpuState}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
