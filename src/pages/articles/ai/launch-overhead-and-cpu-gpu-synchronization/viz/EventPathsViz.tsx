import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-events — event.wait(A) → native wait → CUDAEvent.block(A) → cudaStreamWaitEvent.
 * event.synchronize() → (이미 생성한 event면) cudaEventSynchronize. blocking=True는 host 대기 방식만 고른다.
 */
const WAIT_PATH = ["event.wait(A)", "native wait", "CUDAEvent.block(A)", "cudaStreamWaitEvent"] as const;
const SYNC_PATH = ["event.synchronize()", "native synchronize", "이미 생성한 event이면", "cudaEventSynchronize"] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  focus: "wait" | "sync" | "flag";
  cpu: string;
  stream: string;
  flag: string;
}[] = [
  { label: "event.wait(A)", summary: "A의 순서를 연결", focus: "wait", cpu: "계속 진행할 수 있음", stream: "A의 이후 작업이 표시를 기다림", flag: "이 호출을 CPU 대기로 바꾸지 않음", note: "메서드 이름이 block이어도 그 안에서 하는 일은 A의 작업 순서를 event에 연결하는 것입니다. 이 이름만 보고 CPU를 세운다고 판단하면 경로를 잘못 읽습니다." },
  { label: "event.synchronize()", summary: "CPU가 그 지점까지 대기", focus: "sync", cpu: "그 지점 완료까지 기다림", stream: "기록한 지점까지만 대상", flag: "대기 방식을 고름", note: "이미 생성한 event이면 CPU가 그 지점의 완료까지 기다립니다. A의 마지막 작업 뒤 기록했다면 이 가정에서 26 μs까지의 A이고, 별개의 B가 50 μs까지 돌아도 범위가 장치 전체로 넓어지지 않습니다." },
  { label: "blocking=True", summary: "기다리는 방식만 선택", focus: "flag", cpu: "synchronize에서 재우기 또는 busy-wait", stream: "wait(A)의 경로는 그대로", flag: "host 대기 방식 flag", note: "CUDA 문서는 CPU를 재우는 blocking 방식과 busy-wait 방식을 구별합니다. 이 flag가 event.wait(A)를 결과를 읽는 CPU 대기로 바꾸지는 않습니다." },
];

function Path({ title, steps, active, color }: { title: string; steps: readonly string[]; active: boolean; color: string }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-2 sm:p-3" style={{ borderColor: active ? color : undefined }}>
      <p className={`text-xs font-bold ${active ? "" : "text-muted-foreground"}`}>{title}</p>
      <ol className="mt-2 space-y-1.5 border-l border-[#94a3b8] pl-1.5 font-mono text-[10px] leading-4 sm:pl-2 sm:text-xs">
        {steps.map((step, i) => (
          <li key={step} className={`[overflow-wrap:anywhere] ${active ? "" : "text-muted-foreground/70"}`} style={active && i === steps.length - 1 ? { color, fontWeight: 700 } : undefined}>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Fact({ name, value, strong }: { name: string; value: string; strong: boolean }) {
  return (
    <div className={`grid grid-cols-[4.5rem_minmax(0,1fr)] items-baseline gap-2 rounded-lg border px-3 py-1.5 ${strong ? "border-[#d97706]" : "border-border"}`}>
      <dt className="text-xs font-bold">{name}</dt>
      <dd className="text-xs leading-5 text-muted-foreground">{value}</dd>
    </div>
  );
}

export default function EventPathsViz() {
  return (
    <SceneShell
      eyebrow="두 갈래 호출"
      title="이름이 비슷해도 wait와 synchronize는 다른 함수로 내려갑니다"
      description="각 갈래는 위에서 아래로 내려가는 호출 순서입니다. 왼쪽은 실행열끼리 순서를 잇고 오른쪽은 CPU를 기다리게 합니다. Event는 어느 실행 지점까지 끝났는지 표시하는 객체입니다."
      ariaLabel="event.wait와 event.synchronize의 호출 경로와 멈추는 주체 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Path title="실행열 A의 의존성" steps={WAIT_PATH} active={scene.focus === "wait"} color="#2563eb" />
              <Path title="CPU의 완료 대기" steps={SYNC_PATH} active={scene.focus !== "wait"} color="#b45309" />
            </div>
            <dl className="grid gap-1.5">
              <Fact name="CPU" value={scene.cpu} strong={scene.focus !== "wait"} />
              <Fact name="실행열" value={scene.stream} strong={false} />
              <Fact name="blocking flag" value={scene.flag} strong={scene.focus === "flag"} />
            </dl>
          </div>
        );
      }}
    />
  );
}
