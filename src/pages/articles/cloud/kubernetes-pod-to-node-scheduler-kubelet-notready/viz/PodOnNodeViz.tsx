import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kubelet-watch — "Pod가 노드에 있다"의 두 뜻. API server의 기록과 노드 안 실제가 어떻게 맞아 가고 어떻게 어긋나는지 봅니다.
 */
const STEPS = ["sandbox", "CNI 네트워크", "CSI 볼륨", "컨테이너"] as const;

const SCENES = [
  { label: "Binding 직후", summary: "기록만 있습니다", note: "3절의 Binding이 nodeName을 채우면 worker-2 kubelet의 watch에 web-x가 나타납니다. 노드 안에는 아직 아무것도 없습니다.", phase: "Pending", kubelet: "web-x를 읽음", built: 0, match: "아직 다름", tone: "#b45309" },
  { label: "kubelet이 만듭니다", summary: "노드 안에서 준비합니다", note: "kubelet은 런타임에 sandbox(Pod의 컨테이너가 들어갈 실행 환경) 생성을 요청하고 CNI(네트워크 플러그인)로 네트워크를, CSI(볼륨 플러그인)로 볼륨을 붙여 컨테이너를 시작합니다.", phase: "Pending", kubelet: "만드는 중", built: 4, match: "아직 다름", tone: "#b45309" },
  { label: "결과를 다시 적습니다", summary: "두 쪽이 같아집니다", note: "결과는 Pod의 status에 다시 씁니다. 기록과 실제는 보통 몇 초 차이로 같아집니다.", phase: "Running", kubelet: "status를 씀", built: 4, match: "같음", tone: "#15803d" },
  { label: "노드가 죽으면", summary: "기록은 남고 실제는 없습니다", note: "노드가 죽으면 둘은 영영 어긋납니다. nodeName은 worker-2인데 컨테이너를 돌릴 kubelet이 없습니다. 이 상태가 1절의 'Running으로 보이는 5분'입니다.", phase: "Running(마지막 보고)", kubelet: "없음", built: -1, match: "어긋남", tone: "#b91c1c" },
] as const;

function Item({ name, value, strong }: { name: string; value: string; strong?: boolean }) {
  return (
    <div className="text-xs leading-5">
      <p className="font-mono text-[11px] text-muted-foreground">{name}</p>
      <p className={strong ? "font-bold" : ""}>{value}</p>
    </div>
  );
}

export default function PodOnNodeViz() {
  return (
    <SceneShell
      eyebrow="Pod web-x"
      title={'"Pod가 노드에 있다"는 말은 두 쪽에서 따로 참이 됩니다'}
      description="왼쪽은 API server가 기록한 값, 오른쪽은 worker-2 안에서 실제로 일어난 일입니다. 맨 아래 줄이 두 쪽의 일치 여부입니다."
      ariaLabel="API server 기록과 노드 안 실제가 같아졌다가 노드 장애로 어긋나는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const dead = scene.built < 0;
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              <div className="min-w-0 rounded-lg border border-border bg-background p-3">
                <p className="text-xs font-bold text-primary">API server의 기록</p>
                <div className="mt-2 space-y-2">
                  <Item name="spec.nodeName" value="worker-2" strong />
                  <Item name="status.phase" value={scene.phase} strong />
                </div>
              </div>
              <div className={`min-w-0 rounded-lg border p-3 ${dead ? "border-dashed border-red-600" : "border-border bg-background"}`}>
                <p className="text-xs font-bold text-primary">worker-2의 실제</p>
                <div className="mt-2 space-y-2">
                  <Item name="kubelet" value={scene.kubelet} strong />
                  <div>
                    <p className="font-mono text-[11px] text-muted-foreground">만든 것</p>
                    <ul className="mt-1 flex flex-wrap gap-1">
                      {STEPS.map((step) => {
                        const on = scene.built >= 4;
                        return (
                          <li key={step} className={`rounded-sm border px-1.5 text-[11px] leading-5 ${on ? "border-primary bg-primary/10 font-bold text-foreground" : "border-dashed border-border text-muted-foreground"} ${dead ? "line-through" : ""}`}>
                            {step}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-3 rounded-sm border py-1 text-center text-sm font-bold" style={{ borderColor: scene.tone, color: scene.tone }}>{scene.match}</p>
          </div>
        );
      }}
    />
  );
}
