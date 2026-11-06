import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pod-boundary — network namespace, pause container, veth pair.
 * 10.244.1.12는 3절의 client, 10.244.1.21은 같은 node의 다른 Pod 예시(가정)입니다.
 * container 수는 가정이며, 장면이 바뀌어도 칸 위치는 그대로입니다.
 */
const SCENES = [
  {
    label: "같은 이름, 다른 view",
    summary: "eth0 두 개 · 충돌 없음",
    note: "network namespace는 interface·route·neighbor table을 process 묶음마다 따로 두는 Linux 기능입니다. 그래서 같은 host의 두 Pod가 모두 eth0이라는 이름을 써도 충돌하지 않습니다.",
  },
  {
    label: "Pod 안에서는 함께 씁니다",
    summary: "container 2개 · IP 1개",
    note: "한 Pod 안의 여러 container는 이 view를 함께 씁니다. 그래서 같은 IP와 loopback(자기 자신을 가리키는 주소)을 공유합니다. container 2개는 설명용 가정입니다.",
  },
  {
    label: "view를 붙잡는 container",
    summary: "container 재시작 · 주소 유지",
    note: "container가 재시작할 때마다 view가 사라지면 나머지 container의 주소도 흔들립니다. 그래서 sandbox 역할의 작은 container(흔히 pause container)가 namespace를 잡고 있고, runtime이 업무 container를 그 안에 넣습니다.",
  },
  {
    label: "host와 잇는 가상 선",
    summary: "Pod eth0 ↔ host cali…",
    note: "veth pair는 양끝짜리 가상 선입니다. 한쪽은 Pod 안에서 eth0으로, 반대쪽은 host에서 cali… 같은 이름으로 보입니다. CNI plugin이 Pod 생성 때 이 interface·IP·route를 설정하지만, Service backend 선택이나 HTTP routing까지 한 구성요소가 모두 맡는다는 뜻은 아닙니다.",
  },
] as const;

function Slot({ text, tone, show = true }: { text: string; tone: "plain" | "accent" | "warn"; show?: boolean }) {
  const toneClass =
    tone === "accent"
      ? "border-blue-600 font-semibold text-blue-700 dark:text-blue-300"
      : tone === "warn"
        ? "border-dashed border-amber-600 font-semibold text-amber-700 dark:text-amber-300"
        : "border-border text-foreground";
  return (
    <span className={`block rounded-md border px-1.5 py-1 text-center text-xs leading-5 ${toneClass} ${show ? "" : "invisible"}`}>
      {text}
    </span>
  );
}

function PodBox({ name, ip, scene, primary }: { name: string; ip: string; scene: number; primary: boolean }) {
  const dim = !primary && (scene === 1 || scene === 2);
  const firstContainer = scene === 0 ? "process" : scene === 2 && primary ? "container 1 재시작" : "container 1";
  const secondContainer = scene === 0 ? "process" : "container 2";
  return (
    <div className={`min-w-0 ${dim ? "opacity-40" : ""}`}>
      <div className="rounded-lg border border-blue-600 bg-background p-2">
        <p className="text-xs font-bold leading-5">{name}</p>
        <p className="break-all font-mono text-xs leading-5 text-muted-foreground">{ip}</p>
        <div className="mt-2 space-y-1">
          <Slot text="pause" tone="accent" show={scene >= 2} />
          <Slot text={firstContainer} tone={scene === 2 && primary ? "warn" : "plain"} />
          <Slot text={secondContainer} tone="plain" />
        </div>
        <p className="mt-2 border-t border-border pt-2 text-center font-mono text-sm font-bold">eth0</p>
      </div>
      <div className={`flex flex-col items-center ${scene === 3 ? "" : "invisible"}`}>
        <span className="h-5 border-l border-blue-600" aria-hidden="true" />
        <span className="text-xs leading-4 text-blue-700 dark:text-blue-300">veth pair</span>
        <span className="h-3 border-l border-blue-600" aria-hidden="true" />
        <span className="rounded-md border border-blue-600 bg-background px-2 py-0.5 font-mono text-xs leading-5">cali…</span>
      </div>
    </div>
  );
}

export default function PodNamespaceVethViz() {
  return (
    <SceneShell
      eyebrow="Pod의 안과 밖"
      title="한 host 안에 eth0이 여럿 있어도 괜찮은 구조"
      description="바깥 칸이 node의 host이고, 파란 테두리 칸 하나가 Pod의 network namespace(별도 network view)입니다. 주소는 이 글의 사례이며 두 번째 Pod는 설명용 가정입니다."
      ariaLabel="host 안의 두 Pod가 network namespace, pause container, veth pair로 나뉘고 이어지는 구조"
      scenes={SCENES}
      render={(scene) => (
        <div className="rounded-lg border border-border p-2 sm:p-3">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">node의 host</p>
          <div className="mx-auto grid max-w-xl grid-cols-2 gap-2 sm:gap-4">
            <PodBox name="client Pod" ip="10.244.1.12" scene={scene} primary />
            <PodBox name="다른 Pod(가정)" ip="10.244.1.21" scene={scene} primary={false} />
          </div>
        </div>
      )}
    />
  );
}
