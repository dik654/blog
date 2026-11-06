import SceneShell from "./SceneShell";

/**
 * 본문 대응: #taints-eviction — STATUS 열의 NotReady 한 단어가 묶는 두 경우입니다. 누가 적었는지에 따라 진단 위치가 갈립니다.
 */
const CASES = [
  {
    head: "kubelet이 살아서 보고",
    rows: [
      ["적은 쪽", "kubelet 자신"],
      ["Ready", "False"],
      ["reason", "kubelet이 적은 값"],
      ["예", "컨테이너 런타임이 죽음, CNI 플러그인 미준비"],
      ["taint", "not-ready"],
      ["먼저 볼 곳", "노드에 들어가 kubelet 로그와 런타임 상태"],
    ],
  },
  {
    head: "보고 자체가 끊김",
    rows: [
      ["적은 쪽", "컨트롤러"],
      ["Ready", "Unknown"],
      ["reason", "NodeStatusUnknown"],
      ["노드 안", "컨테이너는 멀쩡히 돌고 있을 수 있음"],
      ["taint", "unreachable"],
      ["먼저 볼 곳", "노드 자체, 노드와 API server 사이 네트워크"],
    ],
  },
] as const;

const SCENES = [
  { label: "같은 NotReady", summary: "Ready가 True가 아님", note: "kubectl get nodes의 NotReady는 Ready 조건이 True가 아니라는 뜻 하나입니다. 이 단어만으로는 어느 쪽 경우인지 알 수 없습니다." },
  { label: "False 쪽", summary: "kubelet이 스스로 보고", note: "kubelet이 살아서 False를 보고한 경우입니다. 이때는 노드에 들어가 kubelet 로그와 런타임 상태를 봅니다." },
  { label: "Unknown 쪽", summary: "컨트롤러가 대신 적음", note: "보고가 끊겨 컨트롤러가 Unknown을 적은 경우입니다. message는 'Kubelet stopped posting node status.'입니다. 노드 자체 또는 네트워크를 의심합니다." },
] as const;

export default function NotReadyBranchViz() {
  return (
    <SceneShell
      eyebrow="NotReady가 묶는 두 경우"
      title="NotReady 한 단어 아래에 진단이 다른 두 갈래가 있습니다"
      description="위 칸이 kubectl이 보여 주는 값이고, 아래 두 갈래가 그 값이 만들어진 경로입니다. 어느 쪽이든 taint 이름까지 달라집니다."
      ariaLabel="NotReady가 Ready False와 Ready Unknown 두 경우로 갈리는 분기"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <p className="mx-auto w-fit rounded-sm border border-foreground/60 bg-background px-3 py-1 font-mono text-sm font-bold">STATUS: NotReady</p>
          <div className="mx-auto h-3 w-px bg-slate-400" />
          <div className="mx-auto h-3 w-1/2 border-x border-t border-slate-400" />
          <div className="grid grid-cols-2 gap-2">
            {CASES.map((item, index) => {
              const on = active === index + 1;
              const shown = active > index;
              return (
                <div key={item.head} className={`min-w-0 rounded-lg border p-2 ${on ? "border-primary bg-primary/10" : "border-border"}`}>
                  <p className="break-keep text-xs font-bold leading-5">{item.head}</p>
                  <dl className={`mt-1 space-y-1 ${shown ? "" : "invisible"}`} aria-hidden={!shown}>
                    {item.rows.map(([name, value]) => (
                      <div key={name} className="text-[11px] leading-4">
                        <dt className="text-muted-foreground">{name}</dt>
                        <dd className="break-words font-bold">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}
