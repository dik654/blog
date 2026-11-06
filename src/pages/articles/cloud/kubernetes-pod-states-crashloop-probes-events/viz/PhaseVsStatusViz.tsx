import SceneShell from "./SceneShell";

/**
 * 본문 대응: #black-box — Pod의 네 칸, 칸마다의 phase, STATUS 열에 대신 나오는 단어.
 * phase 띠는 칸을 가로질러 고정되어 있고 STATUS 단어만 칸을 옮길 때 바뀐다.
 */
const CELLS = ["노드 기다림", "kubelet 준비", "컨테이너 실행", "컨테이너 끝남"] as const;

const SCENES: readonly { label: string; summary: string; words: readonly string[]; source: string; note: string }[] = [
  { label: "1칸 · 노드를 기다립니다", summary: "phase Pending", words: ["Pending"], source: "아직 컨테이너가 없어 phase가 그대로 보입니다", note: "API 서버에 만들어졌지만 노드가 정해지지 않았습니다. 아직 컨테이너가 없어 phase와 STATUS가 같은 단어입니다." },
  { label: "2칸 · kubelet이 준비합니다", summary: "phase Pending", words: ["ContainerCreating", "ImagePullBackOff"], source: "컨테이너 Waiting의 reason", note: "노드가 정해지면 kubelet이 볼륨·네트워크·이미지를 준비합니다. phase는 여전히 Pending인데 STATUS에는 컨테이너가 기다리는 이유인 reason이 대신 나옵니다." },
  { label: "3칸 · 컨테이너가 돕니다", summary: "phase Running", words: ["Running", "CrashLoopBackOff"], source: "Waiting이면 그 reason이 대신 나옵니다", note: "컨테이너가 돌면 STATUS도 Running입니다. 죽어서 다음 재시작을 기다리는 동안에는 컨테이너가 Waiting이라 phase가 Running이어도 STATUS에는 CrashLoopBackOff가 나옵니다." },
  { label: "4칸 · 컨테이너가 끝납니다", summary: "restartPolicy가 갈림", words: ["OOMKilled", "Error", "Completed"], source: "컨테이너 Terminated의 reason · 다시 띄우면 Running, Pod를 끝내면 Succeeded·Failed", note: "끝나면 STATUS에 종료 이유가 나오고, restartPolicy(재시작 규칙)에 따라 3칸으로 돌아가 다시 띄우거나 Pod를 끝냅니다. Pod를 끝낼 때 phase가 Succeeded나 Failed가 됩니다." },
];

export default function PhaseVsStatusViz() {
  return (
    <SceneShell
      eyebrow="네 칸과 두 줄"
      title="phase는 칸을 넓게 묶고 STATUS는 칸 안의 단어를 보여 줍니다"
      description="위 칸이 Pod의 네 단계, 가운데 띠가 Pod API의 phase, 아래가 kubectl get pods의 STATUS 열입니다."
      note="phase 다섯 값 중 Unknown은 네 칸에 대응시키지 않아 그리지 않았습니다. Pod를 삭제하는 중이면 STATUS는 Terminating입니다."
      ariaLabel="Pod의 네 단계에서 phase와 STATUS 열의 단어 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bandClass = (on: boolean) =>
          `min-w-0 rounded-md border px-1 py-1.5 text-center font-mono text-[11px] leading-4 [overflow-wrap:anywhere] sm:text-xs ${on ? "border-primary bg-primary/10 font-bold text-foreground" : "border-border/60 text-muted-foreground"}`;
        return (
          <div className="min-w-0">
            <p className="mb-1 text-xs font-semibold text-muted-foreground">Pod의 네 칸</p>
            <ol className="grid grid-cols-4 gap-1.5">
              {CELLS.map((cell, index) => (
                <li
                  key={cell}
                  className={`min-w-0 rounded-md border px-1 py-2 text-center text-[11px] leading-4 sm:text-xs ${index === active ? "border-primary bg-background font-bold" : "border-border/60 text-muted-foreground"}`}
                >
                  <span className="block font-mono">{index + 1}</span>
                  {cell}
                </li>
              ))}
            </ol>
            <p className="mb-1 mt-3 text-xs font-semibold text-muted-foreground">phase</p>
            <div className="grid grid-cols-4 gap-1.5">
              <div className={`col-span-2 ${bandClass(active < 2)}`}>Pending</div>
              <div className={bandClass(active === 2 || active === 3)}>Running</div>
              <div className={bandClass(active === 3)}>Succeeded · Failed</div>
            </div>
            <p className="mb-1 mt-3 text-xs font-semibold text-muted-foreground">STATUS 열에 보이는 단어</p>
            <div className="min-h-[6.5rem] rounded-md border border-border/60 bg-background px-3 py-2 sm:min-h-[4.75rem]">
              <div className="flex flex-wrap gap-1.5">
                {scene.words.map((word) => (
                  <span key={word} className="rounded border border-primary px-2 py-0.5 font-mono text-xs font-bold">
                    {word}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{scene.source}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
