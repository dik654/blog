import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multi-gpu — handle의 소속, 실패하는 호출과 허용되는 호출, GPU0의 8을 GPU1이 쓰는 순서.
 * 판정은 본문에 적힌 CUDA Guide 13.0.2의 규칙만 옮겼습니다.
 */
type Chip = readonly [string, "plain" | "use" | "bad" | "ok"];
type Verdict = "실패" | "허용" | "";

const SCENES: readonly { label: string; summary: string; note: string; current: 0 | 1; call: string; verdict: Verdict; gpu0: readonly Chip[]; gpu1: readonly Chip[] }[] = [
  {
    label: "소속 정하기",
    summary: "current device에 연결",
    current: 0,
    call: "cudaSetDevice(0)",
    verdict: "",
    gpu0: [["메모리", "use"], ["stream", "use"], ["event", "use"]],
    gpu1: [["메모리", "plain"], ["stream", "plain"], ["event", "plain"]],
    note: "current device를 정하면 그 뒤 만드는 메모리·stream·event가 그 장치에 연결됩니다. 소속은 기록해 둡니다.",
  },
  {
    label: "kernel launch",
    summary: "GPU1 선택 + GPU0 stream",
    current: 1,
    call: "kernel<<<…, stream0>>>",
    verdict: "실패",
    gpu0: [["stream", "bad"]],
    gpu1: [["current", "use"], ["kernel 제출", "bad"]],
    note: "Kernel launch는 current device와 stream의 장치가 같아야 하므로 GPU1을 선택한 채 GPU0의 stream으로 제출하면 실패합니다.",
  },
  {
    label: "record와 elapsed",
    summary: "장치가 다르면 못 씀",
    current: 0,
    call: "cudaEventRecord · cudaEventElapsedTime",
    verdict: "실패",
    gpu0: [["event", "bad"]],
    gpu1: [["stream 또는 다른 event", "bad"]],
    note: "cudaEventRecord는 event와 stream의 장치가 다르면 실패하고, cudaEventElapsedTime도 두 event의 장치가 다르면 쓸 수 없습니다.",
  },
  {
    label: "다른 장치 event",
    summary: "기다리고 묻는 것은 가능",
    current: 1,
    call: "cudaStreamWaitEvent · cudaEventQuery · cudaEventSynchronize",
    verdict: "허용",
    gpu0: [["event", "ok"]],
    gpu1: [["current", "use"], ["stream이 기다림", "ok"]],
    note: "cudaStreamWaitEvent는 다른 장치의 event를 기다릴 수 있고, Query와 Synchronize도 event 장치가 current와 달라도 쓸 수 있습니다.",
  },
  {
    label: "8을 옮기는 순서",
    summary: "생산 → record → wait → 복사 → 소비",
    current: 1,
    call: "GPU0의 8을 GPU1이 쓰기",
    verdict: "",
    gpu0: [["1 · 8 생산", "use"], ["2 · record", "use"], ["원본 공간 유지", "plain"]],
    gpu1: [["3 · 복사 줄이 wait", "ok"], ["4 · 복사", "ok"], ["5 · consumer", "ok"]],
    note: "마지막 소비 또는 필요한 복사의 완료까지 원본을 유지합니다. GPU마다 기본 줄이 따로라 서로를 자동으로 기다리지 않습니다.",
  },
];

const CHIP = {
  plain: "border-border text-muted-foreground",
  use: "border-primary bg-primary/15 text-foreground",
  bad: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  ok: "border-emerald-700 text-emerald-800 dark:border-emerald-500 dark:text-emerald-300",
} as const;

function Gpu({ name, current, chips }: { name: string; current: boolean; chips: readonly Chip[] }) {
  return (
    <div className={`min-w-0 rounded-lg border p-2 sm:p-3 ${current ? "border-primary" : "border-border"}`}>
      <p className="text-sm font-bold">{name}{current && <span className="ml-1 text-xs font-semibold text-primary">선택됨</span>}</p>
      <ul className="mt-2 space-y-1.5">
        {chips.map(([text, tone]) => <li key={text} className={`rounded border px-2 py-1 text-xs leading-5 ${CHIP[tone]}`}>{text}</li>)}
      </ul>
    </div>
  );
}

export default function MultiGpuHandleViz() {
  return (
    <SceneShell
      eyebrow="handle의 소속"
      title="어떤 호출이 장치 경계를 넘을 수 있을까요"
      description="선택됨 표시가 붙은 쪽이 현재 장치입니다. 점선 칸은 경계를 넘어 실패하는 조합, 초록 칸은 허용되는 조합입니다."
      ariaLabel="두 GPU의 stream과 event 소속, 실패하는 호출, 허용되는 호출, GPU0의 값을 GPU1로 옮기는 순서"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <p className="mb-3 flex flex-wrap items-baseline gap-x-2 rounded border border-border px-3 py-2 text-xs leading-5">
              <code className="min-w-0 break-words font-mono">{scene.call}</code>
              {scene.verdict && <strong className={scene.verdict === "실패" ? "text-red-700 dark:text-red-400" : "text-emerald-800 dark:text-emerald-300"}>{scene.verdict}</strong>}
            </p>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <Gpu name="GPU0" current={scene.current === 0} chips={scene.gpu0} />
              <Gpu name="GPU1" current={scene.current === 1} chips={scene.gpu1} />
            </div>
          </div>
        );
      }}
    />
  );
}
