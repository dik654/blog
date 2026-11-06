import SceneShell from "./SceneShell";

/**
 * 본문 대응: #edge-mesh — 기본 경로에 외부 문, L7 proxy, mesh proxy가 어디에 더해지는가.
 * "추가" 표시가 그 장면에서 새로 생긴 칸입니다. 한 장면에 층을 누적하지 않고 하나씩 비교합니다.
 */
type Hop = { name: string; where: string; added?: boolean; optional?: boolean };

const SCENES: ReadonlyArray<{ label: string; summary: string; hops: readonly Hop[]; note: string }> = [
  {
    label: "기본 경로",
    summary: "새 hop 없음",
    hops: [
      { name: "client Pod", where: "node A" },
      { name: "Service backend 선택", where: "node 데이터 플레인" },
      { name: "Pod route", where: "CNI가 만든 경로" },
      { name: "server Pod", where: "node B" },
    ],
    note: "비교의 기준입니다. 앞 절까지 따라온 cluster 안의 경로이며, 이후 장면의 주황 칸이 이 위에 더해지는 부분입니다.",
  },
  {
    label: "NodePort",
    summary: "node IP의 정해진 port",
    hops: [
      { name: "외부 client", where: "cluster 밖" },
      { name: "node IP의 정해진 port", where: "node", added: true },
      { name: "Service backend 선택", where: "node 데이터 플레인" },
      { name: "Pod route", where: "CNI가 만든 경로" },
      { name: "server Pod", where: "node B" },
    ],
    note: "NodePort는 node IP의 정해진 port에서 Service backend 선택으로 들어가는 문입니다.",
  },
  {
    label: "LoadBalancer",
    summary: "외부 주소를 잇는 구현",
    hops: [
      { name: "외부 client", where: "cluster 밖" },
      { name: "외부 주소", where: "cloud load balancer나 MetalLB 같은 구현", added: true },
      { name: "node 또는 Pod 경로", where: "구현이 잇는 곳 · Service backend 선택 전체를 대신하지 않음" },
      { name: "server Pod", where: "node B" },
    ],
    note: "cloud load balancer나 MetalLB 같은 구현이 외부 주소를 node 또는 Pod 경로와 잇습니다. MetalLB의 layer 2 mode와 BGP mode는 외부에서 그 주소까지 오는 방법이며, cluster 안의 Service backend 선택 전체를 대신하지 않습니다.",
  },
  {
    label: "L7 proxy",
    summary: "host·path·header로 분기",
    hops: [
      { name: "외부 client", where: "cluster 밖" },
      { name: "protocol-aware proxy의 listener", where: "Gateway API 또는 Ingress 구현", added: true },
      { name: "선택된 backend까지의 Pod 경로", where: "CNI가 만든 경로" },
      { name: "server Pod", where: "node B" },
    ],
    note: "HTTP 내용으로 분기하려면 그 내용을 읽는 L7 proxy가 필요하고, 요청은 그 listener(요청을 받는 입구)로 들어옵니다. Ingress API는 제거 예정은 아니지만 동결됐고 새 기능에는 Gateway API가 권장되며, Gateway API는 GatewayClass(구현 종류), Gateway(listener와 infrastructure), HTTPRoute(application route)로 나눕니다.",
  },
  {
    label: "Sidecar mesh",
    summary: "Pod마다 proxy",
    hops: [
      { name: "client application", where: "client Pod 안" },
      { name: "proxy", where: "client Pod 안", added: true },
      { name: "기본 Pod 연결과 Service 경로", where: "그대로 있음" },
      { name: "proxy", where: "server Pod 안", added: true },
      { name: "server application", where: "server Pod 안" },
    ],
    note: "Service mesh는 workload identity, mTLS(양쪽 신원을 확인하는 암호화 연결), retry·timeout, L7 policy와 telemetry를 더합니다. Sidecar 방식은 Pod마다 proxy를 둡니다.",
  },
  {
    label: "Ambient mesh",
    summary: "node별 L4 + 선택적 L7",
    hops: [
      { name: "client Pod", where: "node A" },
      { name: "L4 proxy", where: "node A", added: true },
      { name: "L7 waypoint", where: "필요할 때만", added: true, optional: true },
      { name: "기본 Pod 연결과 Service 경로", where: "그대로 있음" },
      { name: "L4 proxy", where: "node B", added: true },
      { name: "server Pod", where: "node B" },
    ],
    note: "현재 Istio ambient 방식은 node별 L4 proxy(주소·port까지 다룸)와 필요할 때만 쓰는 L7 waypoint(HTTP 내용까지 다룸)를 둡니다. 칸의 순서는 설명용 예시(가정)입니다. 어느 방식이든 기본 경로를 먼저 알아야 새 hop의 실패를 구분합니다.",
  },
];

function HopRow({ hop, last }: { hop: Hop; last: boolean }) {
  const tone = hop.added
    ? hop.optional
      ? "border-dashed border-amber-600"
      : "border-amber-600"
    : "border-border";
  return (
    <li className="flex gap-2">
      <div className="flex w-3 shrink-0 flex-col items-center" aria-hidden="true">
        <span className={`mt-3 h-2 w-2 rounded-full ${hop.added ? "bg-amber-600" : "bg-slate-400"}`} />
        {!last && <span className="w-px flex-1 bg-border" />}
      </div>
      <div className={`mb-1.5 grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 rounded-lg border px-2.5 py-1.5 ${tone}`}>
        <div className="min-w-0">
          <p className={`text-xs font-semibold leading-5 sm:text-sm ${hop.added ? "text-amber-700 dark:text-amber-300" : ""}`}>{hop.name}</p>
          <p className="text-xs leading-5 text-muted-foreground">{hop.where}</p>
        </div>
        {hop.added && <span className="text-xs font-bold text-amber-700 dark:text-amber-300">추가</span>}
      </div>
    </li>
  );
}

export default function EdgeMeshHopsViz() {
  return (
    <SceneShell
      eyebrow="덧붙는 경계"
      title="외부 진입과 mesh가 기본 경로의 어디에 칸을 더하는가"
      description="위에서 아래로 요청이 지나는 칸입니다. 주황 칸이 그 장면에서 새로 생기는 hop이고, 칸 안 작은 글자는 그 칸이 있는 곳입니다. 장면은 서로 따로 보는 비교이며 함께 쓰는 경우의 순서를 뜻하지 않습니다."
      ariaLabel="기본 경로와 NodePort, LoadBalancer, L7 proxy, sidecar, ambient에서 더해지는 hop 비교"
      scenes={SCENES}
      render={(scene) => {
        const hops = SCENES[scene].hops;
        return (
          <ol className="mx-auto max-w-xl">
            {hops.map((hop, index) => (
              <HopRow key={`${index}-${hop.name}-${hop.where}`} hop={hop} last={index === hops.length - 1} />
            ))}
          </ol>
        );
      }}
    />
  );
}
