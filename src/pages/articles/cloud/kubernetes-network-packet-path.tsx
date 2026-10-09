import LessonSection from "@/components/articles/lesson-section";
import TermBreakdown from "@/components/articles/term-breakdown";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import { CitationBlock } from "@/components/ui/citation";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import KubernetesPacketPathViz from "./KubernetesPacketPathViz";

const codeClass =
  "not-prose my-5 min-w-0 overflow-x-auto rounded-xl border border-border bg-neutral-950 p-4 text-sm leading-6 text-neutral-100";

function BoundaryMap() {
  const boundaries = [
    { question: "출발 프로그램은 어떤 주소와 길을 보는가?", job: "다른 Pod와 섞이지 않는 주소 공간을 만듭니다.", proof: "ip addr · ip route" },
    { question: "가상 주소 뒤의 실제 Pod는 누구인가?", job: "준비된 Pod 가운데 요청을 받을 한 곳을 고릅니다.", proof: "Service · EndpointSlice" },
    { question: "그 Pod는 어느 node에 있는가?", job: "목적지 Pod가 있는 node로 갈 길을 고릅니다.", proof: "ip route get" },
    { question: "물리망이 Pod 주소를 아는가?", job: "그대로 보내거나 node 주소로 한 번 감싸서 보냅니다.", proof: "route · tunnel link · capture" },
    { question: "이 통신은 허용되는가?", job: "통신 허용 규칙을 실제 패킷에 적용합니다.", proof: "policy · ruleset · flow log" },
    { question: "서버는 무엇을 받았는가?", job: "서버가 받은 연결과 HTTP 응답 시간을 확인합니다.", proof: "ss · access log · curl" },
  ];

  return (
    <figure data-viz="packet-boundary-map" className="not-prose my-8 border-y border-border py-5">
      <figcaption>
        <p className="text-xs font-bold text-primary">이름 없는 전체 지도</p>
        <p className="mt-1 text-lg font-semibold">한 요청을 여섯 질문으로만 자릅니다</p>
      </figcaption>
      <ol className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {boundaries.map((item, index) => (
          <li key={item.question} className="min-w-0 rounded-xl border border-border bg-background p-4">
            <p className="text-xs font-bold text-primary">경계 {index + 1}</p>
            <p className="mt-1 font-semibold">{item.question}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.job}</p>
            <p className="mt-3 border-t border-border pt-3 font-mono text-xs leading-5 text-muted-foreground">{item.proof}</p>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function ResponsibilityTable() {
  const rows = [
    ["Pod 연결", "Pod에 interface·IP·route를 붙임", "Service VIP 선택·L7 routing 전체"],
    ["Service 데이터 경로", "VIP를 Ready backend로 바꿈", "다른 node의 Pod CIDR route"],
    ["Pod 네트워크", "Pod IP를 같은/다른 node까지 운반", "HTTP host·path routing"],
    ["NetworkPolicy", "선택된 endpoint 흐름을 허용·거부", "인증서·사용자 인증 전체"],
    ["Edge proxy", "외부 listener에서 host·path로 backend 선택", "Pod interface 생성"],
    ["Service mesh", "workload 간 identity·mTLS·L7 policy를 추가", "기본 CNI·Service를 자동 대체"],
  ];

  return (
    <div className="not-prose my-8">
      <div className="grid gap-3 lg:hidden">
        {rows.map(([layer, owns, boundary]) => (
          <article key={layer} className="min-w-0 rounded-xl border border-border bg-background p-4">
            <h3 className="font-semibold text-primary">{layer}</h3>
            <p className="mt-3 text-xs font-semibold text-foreground">반드시 하는 일</p>
            <p className="mt-1 text-sm leading-6">{owns}</p>
            <p className="mt-3 border-t border-border pt-3 text-xs font-semibold text-foreground">이 층만으로는 하지 않는 일</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{boundary}</p>
          </article>
        ))}
      </div>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="p-3 font-semibold">층</th>
            <th className="p-3 font-semibold">반드시 하는 일</th>
            <th className="p-3 font-semibold">이 층만으로는 하지 않는 일</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([layer, owns, boundary]) => (
            <tr key={layer} className="border-b border-border/70 align-top">
              <td className="p-3 font-semibold text-primary">{layer}</td>
              <td className="p-3 leading-6">{owns}</td>
              <td className="p-3 leading-6 text-muted-foreground">{boundary}</td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  );
}

function CurrentChangeLedger() {
  const rows = [
    {
      old: "kube-proxy IPVS를 대규모 Service의 목표 모드로 학습",
      now: "Kubernetes v1.35부터 IPVS mode는 deprecated이고 v1.40부터 기본 비활성, v1.43에 제거 예정입니다. v1.37의 기본값은 여전히 iptables이며 nftables 또는 CNI의 대체 구현을 검토합니다.",
      verify: "kube-proxy ConfigMap의 mode와 실제 kernel ruleset",
    },
    {
      old: "Ingress annotation을 새 L7 기능의 공통 API로 확장",
      now: "Ingress API는 유지되지만 동결됐습니다. 새 설계는 GatewayClass·Gateway·HTTPRoute와 구현체 conformance를 먼저 봅니다.",
      verify: "설치한 Gateway API CRD release와 controller 지원표",
    },
    {
      old: "Calico에서는 BIRD와 IP-in-IP를 항상 써야 합니다.",
      now: "VXLAN-only 내부 경로에는 BGP가 필수가 아닙니다. Calico 3.33에서 BIRD의 IP-in-IP route programming은 deprecated이며 v3.35 제거 예정입니다. 설치 방식의 기본값과 직접 만든 IPPool 필드 기본값도 구분합니다.",
      verify: "Installation·IPPool·BGPConfiguration·calico/node version",
    },
    {
      old: "eBPF CNI는 곧바로 kube-proxy를 완전히 대신",
      now: "대체 여부는 명시적 설정과 kernel·cgroup 지원에 달렸습니다. Cilium은 socket-level과 per-packet 경로가 달라 관측 지점도 달라집니다.",
      verify: "cilium status·service list·bpftool cgroup tree",
    },
    {
      old: "Service mesh는 Pod마다 sidecar proxy가 하나씩 있음",
      now: "sidecar mode는 여전히 가능하지만, 현재 Istio ambient는 node별 L4 proxy와 선택적 L7 waypoint를 별도 경로로 제공합니다.",
      verify: "namespace enrollment·ztunnel workload·waypoint READY",
    },
  ];

  return (
    <div className="not-prose my-8 space-y-3">
      {rows.map((row, index) => (
        <article key={row.old} className="rounded-xl border border-border bg-background p-4">
          <p className="text-xs font-bold text-primary">현재화 {index + 1}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground line-through decoration-muted-foreground/60">{row.old}</p>
          <p className="mt-3 leading-7 text-foreground">{row.now}</p>
          <p className="mt-3 border-t border-border pt-3 text-xs leading-5 text-muted-foreground">확인할 실물 · {row.verify}</p>
        </article>
      ))}
    </div>
  );
}

function EvidenceRunbook() {
  const checks = [
    {
      title: "1. API가 고른 backend가 있는가",
      command: "kubectl -n shop get svc catalog -o wide\nkubectl -n shop get endpointslice -l kubernetes.io/service-name=catalog -o wide",
      normal: "Service 10.96.20.15:8080과 Ready endpoint 10.244.2.34:8080이 함께 보임",
      failure: "EndpointSlice가 비었으면 tunnel보다 selector·readiness를 먼저 조사",
    },
    {
      title: "2. 이 node가 목적지 Pod를 어디로 보내는가",
      command: "ip route get 10.244.2.34\nip -d link show vxlan.calico\nip link show | grep -E 'cali|tunl|vxlan'",
      normal: "목적지 route의 next hop과 선택된 tunnel/direct interface가 설치안과 일치",
      failure: "Route가 없으면 BGP·Felix·IPPool·node CIDR부터 조사",
    },
    {
      title: "3. 바깥 패킷과 안쪽 패킷이 둘 다 보이는가",
      command: "sudo tcpdump -ni eth0 'udp port 4789 or proto 4'\nsudo tcpdump -ni any 'host 10.244.2.34 and tcp port 8080'",
      normal: "VXLAN이면 eth0에서 UDP 4789 outer packet, tunnel 뒤에서 Pod IP inner packet 확인",
      failure: "Inner만 있고 outer가 없으면 encapsulation/route, outer만 있고 remote inner가 없으면 underlay ACL·MTU·decap 조사",
    },
    {
      title: "4. 정책과 연결 상태가 이전 결정을 붙잡고 있는가",
      command: "sudo conntrack -L -p tcp | grep 'dport=8080'\nsudo nft list ruleset\ncalicoctl node status\ncalicoctl get ippool -o yaml",
      normal: "정책·route peer·pool mode와 실제 flow tuple이 같은 설명을 가리킴",
      failure: "정책을 바꿔도 기존 연결이 계속되면 새 연결과 conntrack state를 나눠 시험",
    },
  ];

  return (
    <div className="not-prose my-8 grid gap-4 lg:grid-cols-2">
      {checks.map((check) => (
        <article key={check.title} className="min-w-0 rounded-xl border border-border bg-background p-4">
          <h3 className="font-semibold">{check.title}</h3>
          <pre className="mt-3 min-w-0 overflow-x-auto rounded-lg bg-neutral-950 p-3 text-xs leading-6 text-neutral-100"><code>{check.command}</code></pre>
          <p className="mt-3 text-sm leading-6"><strong>정상 판독:</strong> {check.normal}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground"><strong>실패 판독:</strong> {check.failure}</p>
        </article>
      ))}
    </div>
  );
}

function StudyMap() {
  const groups = [
    {
      name: "먼저 · 기본 패킷 경로",
      here: "namespace와 veth에서 시작해 CNI route, Service 주소 변환, NetworkPolicy, Gateway까지 한 연결을 따라갑니다.",
      next: "각 구현체를 설치하기 전에 route·encapsulation·Service·policy·edge 중 어느 층을 바꾸는지 먼저 표시합니다.",
    },
    {
      name: "그다음 · 이름과 인증서",
      here: "CoreDNS 실패는 Service 전 경계, API server SAN 실패는 control-plane TLS 경계입니다. 패킷 손실과 이름·인증서 실패를 섞지 않습니다.",
      next: "dig의 answer·authority·server와 openssl의 SAN·issuer·expiry를 별도 증거로 남깁니다.",
    },
    {
      name: "이후 · 상태를 저장하는 서비스",
      here: "상태 저장 Pod의 고정 이름과 volume, Operator의 반복 조정은 패킷이 도착한 뒤 애플리케이션 상태를 지키는 문제입니다.",
      next: "StatefulSet만으로 backup·failover·schema upgrade가 해결된다고 보지 않고 Operator가 소유한 절차를 확인합니다.",
    },
    {
      name: "마지막 · Service mesh",
      here: "L4/L7 proxy와 identity·mTLS·retry는 CNI 뒤에 추가되는 경로입니다. 현재는 sidecar뿐 아니라 ambient의 node proxy와 선택적 waypoint도 비교해야 합니다.",
      next: "plain CNI 경로를 먼저 캡처한 뒤 sidecar 또는 ambient를 켜서 새 hop과 failure domain만 비교합니다.",
    },
  ];

  return (
    <div className="not-prose my-8 grid gap-4 sm:grid-cols-2">
      {groups.map((group) => (
        <article key={group.name} className="rounded-xl border border-border bg-background p-5">
          <h3 className="font-semibold text-primary">{group.name}</h3>
          <p className="mt-2 text-sm leading-7">{group.here}</p>
          <p className="mt-3 border-t border-border pt-3 text-sm leading-7 text-muted-foreground">다음에 확인할 것 · {group.next}</p>
        </article>
      ))}
    </div>
  );
}

export default function KubernetesNetworkPacketPathArticle() {
  return (
    <div className="space-y-16">
      <LessonSection
        id="overview"
        level="S"
        title="한 번에 한 경계만 확인해야 첫 실패 지점을 찾을 수 있습니다"
        bridge="응답 코드가 보였다면 애플리케이션까지 도착했지만, 시간 초과만으로는 앞의 어느 구간에서 멈췄는지 모릅니다. 먼저 전체 경로를 여섯 경계로 나눕니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">Kubernetes 네트워크를 설명한다는 것은 제품 이름을 나열하는 일이 아닙니다. 한 연결의 출발 주소, 바뀐 목적지, 선택된 다음 홉, 덧붙은 헤더, 적용된 허용 규칙을 차례로 대조해 첫 실패 경계를 찾는 일입니다.</p>
          <p className="leading-8">예를 들어 HTTP 404는 server 또는 앞단 proxy가 응답을 만들었다는 증거지만, 연결 timeout은 주소 선택·route·정책·listener 가운데 어디서 멈췄는지 더 확인해야 합니다. 같은 “접속 실패”라도 확인할 증거가 다릅니다.</p>
        </div>
      </LessonSection>

      <LessonSection
        id="map"
        level="B"
        title="전체 흐름: 주소 확인에서 서버 응답까지 여섯 경계를 지납니다"
        bridge="여섯 경계를 잡았으니 같은 요청이 지나는 세 주소와 패킷 크기를 숫자로 고정합니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">경계 확인표에는 요청이 지나는 곳마다 “입력 주소, 한 일, 출력 주소, 확인 명령”을 한 줄로 적습니다. 그러면 주소를 붙이는 단계, 가상 주소를 실제 Pod 주소로 바꾸는 단계, 다른 node로 운반하는 단계를 섞지 않게 됩니다.</p>
          <p className="leading-8">구현이 바뀌어도 이 여섯 질문은 남습니다. 커널 규칙이 바뀌거나 프로그램이 연결을 여는 순간 목적지가 바뀌더라도, 들어온 주소가 어느 실제 Pod 주소로 바뀌었고 다음 길이 어디인지 확인하면 됩니다.</p>
        </div>
        <BoundaryMap />
      </LessonSection>

      <LessonSection
        id="case"
        level="0"
        title="사건: 세 주소를 지나는 GET 한 건"
        bridge="가운데 주소와 실제 서버 주소가 다른 이유를 알았으니, 첫 경계에서 Pod가 자기 주소와 경로를 얻는 과정부터 따라갑니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">가정한 client process는 node A의 <code>10.244.1.12</code>에서 <code>GET /items/42</code>를 보냅니다. 목적지는 <code>10.96.20.15:8080</code>이고, 준비된 server 가운데 node B의 <code>10.244.2.34:8080</code>가 선택됩니다. Node A와 B의 물리망 주소는 각각 문서용 대역인 <code>192.0.2.11</code>과 <code>192.0.2.12</code>입니다.</p>
          <p className="leading-8">물리망의 최대 패킷 크기는 <code>1500 B</code>로 가정합니다. 원래 패킷을 바깥 헤더로 감싸는 경로를 쓴다면 그 헤더 몫을 미리 비워야 합니다. 이 때문에 이 사례의 workload interface는 <code>1450 B</code>를 쓰며, 계산은 7절에서 직접 재현합니다.</p>
        </div>
        <div className="not-prose my-7 overflow-x-auto rounded-xl border border-border bg-muted/10 p-4 font-mono text-sm leading-7">
          GET /items/42 HTTP/1.1<br />
          Host: catalog.shop.svc.cluster.local<br />
          client 10.244.1.12:43120 → virtual 10.96.20.15:8080 → backend 10.244.2.34:8080
        </div>
      </LessonSection>

      <LessonSection
        id="pod-boundary"
        level="2"
        title="Pod가 별도 주소를 보는 과정: namespace에서 veth까지"
        bridge="Pod에 주소가 생겨도 가상 Service 주소가 실제 server처럼 listen하는 것은 아닙니다. 그 때문에 다음 절에서는 virtual address가 실제 backend로 바뀌는 순간을 봅니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 host에서 두 process가 모두 <code>eth0</code>이라는 이름을 써도 충돌하지 않게 하려면 각 process 묶음에 별도 network view가 필요합니다. Linux의 <strong>network namespace</strong>가 interface·route·neighbor table을 분리합니다. Pod 안 여러 container는 이 view를 함께 써서 같은 IP와 loopback을 공유합니다.</p>
          <p className="leading-8">Pod container가 재시작할 때마다 이 view가 사라지면 나머지 container의 주소도 흔들립니다. 그래서 sandbox 역할의 작은 container가 network namespace를 잡고 있고, runtime이 업무 container를 그 namespace에 넣습니다. 흔히 <strong>pause container</strong>라고 부르는 역할입니다.</p>
          <p className="leading-8">격리된 view를 host와 잇는 양끝짜리 가상 선이 <strong>veth pair</strong>입니다. 한쪽은 Pod 안에서 <code>eth0</code>로 보이고, 반대쪽은 host에서 <code>cali…</code> 같은 이름으로 보입니다. CNI plugin은 Pod 생성 때 이 interface·IP·route를 설정하지만, Service의 backend 선택이나 HTTP routing까지 한 구성요소가 모두 맡는다는 뜻은 아닙니다.</p>
        </div>
        <pre className={codeClass}><code>{`# 격리된 network view 안과 host 쪽 peer를 함께 확인
kubectl -n shop exec client -- ip -d addr show eth0
kubectl -n shop exec client -- ip route
sudo nsenter -t <pod-sandbox-pid> -n ip route
ip -d link show | grep -A2 -E 'cali|veth'

# container runtime이 기록한 sandbox와 PID 확인
sudo crictl pods
sudo crictl inspectp <pod-sandbox-id>`}</code></pre>
        <CitationBlock source="Kubernetes Network Plugins" citeKey={1} href="https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/">
          Kubernetes는 CNI plugin이 호환돼야 하며, runtime이 Pod sandbox의 network 설정을 맡기는 경계를 설명합니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="service-path"
        level="3"
        title="Service는 server가 아니라 backend 선택 규칙입니다"
        bridge="목적지가 10.244.2.34로 바뀐 뒤에는 이 IP가 어느 node에 있는지 알아야 합니다. 그래서 Service 선택 다음에 Pod network route가 이어집니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">Client가 <code>10.96.20.15:8080</code>으로 연결해도 그 주소를 가진 별도 process가 요청을 받아 다시 보내는 것은 아닙니다. <strong>Service</strong>는 selector와 Ready <strong>EndpointSlice</strong>를 연결하고, node의 데이터 플레인은 새 연결을 backend <code>10.244.2.34:8080</code>로 바꿉니다.</p>
          <p className="leading-8">기본 kube-proxy iptables·nftables 경로에서는 packet의 목적지를 바꾸는 DNAT와 conntrack이 핵심입니다. 반면 eBPF 구현은 <code>connect()</code> 단계에서 socket 목적지를 먼저 바꿀 수도 있습니다. 결과 주소는 같아도 <code>tcpdump</code>에서 Service VIP가 보이는 위치가 달라질 수 있으므로 구현 mode부터 확인해야 합니다.</p>
          <p className="leading-8">기존 연결은 첫 packet에서 선택한 backend와 conntrack state를 이어 씁니다. Endpoint나 정책을 바꾼 직후 같은 keep-alive 연결만 시험하면 새 규칙이 적용되지 않은 것처럼 보일 수 있으므로, 새 연결과 기존 연결을 나눠 확인합니다.</p>
        </div>
        <pre className={codeClass}><code>{`kubectl -n shop get svc catalog -o yaml
kubectl -n shop get endpointslice \
  -l kubernetes.io/service-name=catalog -o yaml

# 현재 kube-proxy mode 확인
kubectl -n kube-system get configmap kube-proxy \
  -o jsonpath='{.data.config\\.conf}' | grep '^mode:'

# 구현별 실제 변환 상태 가운데 현재 cluster에 맞는 하나를 확인
sudo nft list ruleset
sudo iptables-save -t nat
cilium service list`}</code></pre>
        <KubernetesPacketPathViz />
        <CitationBlock source="Kubernetes · Virtual IPs and Service Proxies" citeKey={2} href="https://kubernetes.io/docs/reference/networking/virtual-ips/">
          Service와 EndpointSlice를 본 kube-proxy가 mode별 kernel API로 virtual IP에서 backend endpoint로 가는 규칙을 만드는 공식 경로입니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="calico-path"
        level="4"
        title="Calico 경로: 같은 노드·직접 라우팅·두 overlay를 가릅니다"
        bridge="Overlay는 원래 packet에 header를 더합니다. 그 때문에 node 간 연결이 살아 있어도 큰 packet만 사라질 수 있고, 다음 절에서 header 몫과 외부 송신의 주소 변환을 계산합니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 node의 두 Pod는 host route와 두 veth를 지나므로 물리 NIC나 tunnel이 필요하지 않습니다. 다른 node라면 선택지가 갈립니다. Underlay가 Pod CIDR route를 알 수 있으면 원래 packet을 직접 보낼 수 있고, 알 수 없다면 node IP 사이의 outer packet으로 감쌉니다.</p>
          <p className="leading-8"><strong>IP-in-IP</strong>는 원래 IPv4 packet 앞에 IPv4 header를 하나 더 붙입니다. <strong>VXLAN</strong>은 Ethernet frame을 VXLAN·UDP·IP header로 감싸며 기본 UDP port <code>4789</code>를 씁니다. <strong>CrossSubnet</strong>은 같은 subnet의 node끼리는 직접 보내고 다른 subnet에서만 감싸 overhead를 줄입니다.</p>
          <p className="leading-8">Calico에서 <strong>Felix</strong>는 각 host의 workload interface와 route, policy 상태를 프로그램합니다. <strong>BGP</strong>를 쓰는 구성에서는 route speaker가 node 사이 또는 Top-of-Rack router에 Pod route를 알립니다.</p>
          <p className="leading-8">VXLAN-only 내부 경로에는 BGP가 꼭 필요하지 않습니다. 다만 cluster route를 외부 router에 광고하려면 BGP를 쓸 수 있으므로, “VXLAN이면 BGP를 끈다”는 규칙은 성립하지 않습니다.</p>
          <p className="leading-8">설치 기본값도 자원별로 읽어야 합니다. Operator의 <code>Installation</code> 기본과 직접 만든 <code>IPPool</code> 필드의 기본을 같은 것으로 보면 안 됩니다. 실제 cluster에서는 아래처럼 선언을 확인한 뒤 route와 interface가 그 선언대로 생겼는지 대조합니다.</p>
        </div>
        <pre className={codeClass}><code>{`# 설명용 예시: 다른 subnet에서만 VXLAN, 외부 pool로 나갈 때 NAT
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  calicoNetwork:
    ipPools:
      - cidr: 10.244.0.0/16
        encapsulation: VXLANCrossSubnet
        natOutgoing: Enabled
        nodeSelector: all()`}</code></pre>
        <p className="not-prose text-xs leading-5 text-muted-foreground">출처: Calico 3.33 Installation API와 overlay networking 문서의 실제 필드 이름. CIDR과 mode는 이 글의 가정입니다.</p>
        <TermBreakdown
          title="역할을 이름과 다시 연결하기"
          items={[
            { term: "Felix", description: "각 node에서 interface·route·ACL 상태를 Linux 또는 eBPF 데이터 플레인에 맞춥니다.", example: "10.244.2.0/24가 node B에 있다는 route를 설치합니다.", boundary: "모든 cluster route를 반드시 BGP로 배포하는 단일 구성요소라는 뜻은 아닙니다." },
            { term: "BGP route distribution", description: "Pod CIDR의 도달 경로를 node나 외부 router 사이에 알립니다.", example: "node A가 10.244.1.0/24, node B가 10.244.2.0/24를 광고합니다.", boundary: "VXLAN-only 내부 overlay에는 반드시 필요하지 않습니다." },
            { term: "Encapsulation", description: "Underlay가 모르는 Pod packet을 node IP 사이의 outer packet 안에 넣습니다.", example: "10.244.1.12→10.244.2.34를 192.0.2.11→192.0.2.12 UDP 4789 안에 넣습니다.", boundary: "암호화와 같은 뜻이 아니며 기밀성이 필요하면 별도 기능을 검토합니다." },
          ]}
        />
        <CitationBlock source="Calico 3.33 · Overlay networking" citeKey={3} href="https://docs.tigera.io/calico/latest/networking/configuring/vxlan-ipip">
          Direct routing, IP-in-IP, VXLAN과 CrossSubnet의 현재 선택 경계 및 mode 변경 시 연결 영향의 기준입니다.
        </CitationBlock>
        <CitationBlock source="Calico 3.33 · Tigera Operator API" citeKey={4} href="https://docs.tigera.io/calico/latest/reference/installation/api/">
          Cluster routing mode별 route programmer와 BIRD IP-in-IP route programming의 v3.33 deprecation, v3.35 제거 예정 경계를 확인합니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="mtu-egress"
        level="5"
        title="MTU와 외부 송신: 더한 header만큼 안쪽 payload를 줄입니다"
        bridge="주소와 크기가 맞아도 허용 규칙에서 packet이 멈출 수 있습니다. 다음 절에서는 정책 YAML과 실제 kernel 집행 위치를 분리합니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">물리망이 한 번에 <code>1500 B</code>까지만 운반하는데 안쪽 packet도 <code>1500 B</code>라면 outer header를 붙일 자리가 없습니다. IPv4 VXLAN의 <code>50 B</code>와 IPv4 IP-in-IP의 <code>20 B</code>를 같은 회계 경계에서 빼야 fragmentation이나 drop 없이 운반할 수 있습니다.</p>
        </div>
        <div className="not-prose my-6">
          <div className="grid gap-3 sm:hidden">
            <article className="rounded-xl border border-border p-4"><h3 className="font-semibold text-primary">직접 라우팅</h3><p className="mt-2 text-sm leading-6">바깥 header 없음</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Pod가 쓸 수 있는 크기 · 1500 B</p></article>
            <article className="rounded-xl border border-border p-4"><h3 className="font-semibold text-primary">IP-in-IP</h3><p className="mt-2 text-sm leading-6">IPv4 header 20 B 추가</p><p className="mt-1 text-sm leading-6 text-muted-foreground">1500 B − 20 B = 1480 B</p></article>
            <article className="rounded-xl border border-border p-4"><h3 className="font-semibold text-primary">VXLAN</h3><p className="mt-2 text-sm leading-6">IPv4 20 B + UDP 8 B + VXLAN 8 B + 안쪽 Ethernet 14 B = 50 B 추가</p><p className="mt-1 text-sm leading-6 text-muted-foreground">1500 B − 50 B = 1450 B</p></article>
          </div>
          <div className="hidden overflow-x-auto sm:block">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 font-semibold">경로</th>
                <th className="p-3 font-semibold">바깥에 더하는 header</th>
                <th className="p-3 font-semibold">Pod가 쓸 수 있는 크기</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/70"><td className="p-3 font-semibold text-primary">직접 라우팅</td><td className="p-3">없음</td><td className="p-3">1500 B</td></tr>
              <tr className="border-b border-border/70"><td className="p-3 font-semibold text-primary">IP-in-IP</td><td className="p-3">IPv4 header 20 B</td><td className="p-3">1500 − 20 = 1480 B</td></tr>
              <tr className="border-b border-border/70"><td className="p-3 font-semibold text-primary">VXLAN</td><td className="p-3">IPv4 20 B + UDP 8 B + VXLAN 8 B + 안쪽 Ethernet 14 B = 50 B</td><td className="p-3">1500 − 50 = 1450 B</td></tr>
            </tbody>
          </table>
          </div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">여기서 1500은 node NIC에 적힌 값이 아니라 경로 가운데 가장 작은 한도입니다. VLAN tag나 WireGuard처럼 header를 더 붙이는 층이 있으면 그 몫도 같은 자리에서 뺍니다. 작은 ping은 되는데 큰 응답만 timeout이면 route가 아니라 이 한도와 ICMP 차단을 먼저 의심합니다. 1450은 외울 상수가 아니라 이 경로의 뺄셈 결과입니다.</p>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">외부 송신의 source 변환도 항상 일어나지는 않습니다. Calico pool의 <code>natOutgoing</code>이 켜져 있고 목적지가 모든 Calico pool 밖에 있을 때 Pod source를 node IP로 masquerade합니다. 내부 사내망을 별도 비활성 pool로 등록해 NAT 대상에서 뺄 수도 있으므로, “Pod에서 외부로 나가면 무조건 SNAT”라고 외우지 않습니다.</p>
          <p className="leading-8">응답은 conntrack에 기록된 변환 관계를 따라 원래 Pod socket으로 돌아옵니다. 정책을 바꾼 뒤 이미 허용된 연결이 계속 통신할 수 있는 이유도 이 상태 추적과 관련됩니다. 새 연결과 기존 연결을 따로 시험해야 하는 이유입니다.</p>
        </div>
        <CitationBlock source="Calico 3.33 · Configure MTU" citeKey={5} href="https://docs.tigera.io/calico/latest/networking/configuring/mtu">
          1500 B underlay에서 plain 1500, IPv4 IP-in-IP 1480, IPv4 VXLAN 1450이라는 현재 표와 새 workload 적용 경계를 확인합니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="policy-dataplane"
        level="5"
        title="정책 선언과 실제 집행 코드를 따로 봅니다"
        bridge="Cluster 내부 경로를 이해하고 나면 외부 listener와 L7 proxy가 어디에 새 hop을 넣는지도 분리할 수 있습니다. 다음 절에서 edge와 service mesh를 같은 패킷 위에 덧붙입니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8"><strong>NetworkPolicy</strong>는 어떤 endpoint 사이의 ingress·egress를 허용할지 선언합니다. YAML 자체가 packet을 막지는 않으며, cluster의 network plugin이 이를 지원하고 실제 node 데이터 플레인에 프로그램해야 효력이 생깁니다.</p>
          <p className="leading-8">Calico의 표준 Linux 경로는 route와 iptables 또는 nftables 규칙을 쓸 수 있고, eBPF mode는 kernel hook에 program과 map을 붙입니다. 어느 쪽이든 구현 이름보다 목적지가 바뀌는 hook과 state를 읽을 도구를 먼저 확인합니다.</p>
          <p className="leading-8">Cilium의 eBPF 경로에서는 socket 단계의 Service load balancing과 veth의 packet 경로가 함께 있을 수 있습니다. 따라서 “eBPF라서 빠르다”에서 설명을 끝내지 않고, socket과 packet 가운데 어디에서 선택했는지 밝혀야 합니다.</p>
          <p className="leading-8">Service 구현과 Pod policy 구현도 같은 선택으로 묶지 않습니다. kube-proxy가 iptables여도 Calico가 policy를 집행할 수 있고, kube-proxy를 Cilium eBPF가 대신할 수도 있습니다. 현재 Kubernetes v1.37 문서에서 IPVS mode는 v1.35부터 deprecated이고 v1.40부터 기본 비활성, v1.43에 제거 예정이며, v1.37의 기본값은 아직 iptables이고 nftables가 후속 경로로 제시됩니다.</p>
        </div>
        <pre className={codeClass}><code>{`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: catalog-from-frontend
  namespace: shop
spec:
  podSelector:
    matchLabels:
      app: catalog
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080`}</code></pre>
        <p className="not-prose text-xs leading-5 text-muted-foreground">출처: Kubernetes NetworkPolicy v1 schema. Label과 port는 이 글의 가정이며, 빈 selector·namespace 조합의 의미는 구현 전에 공식 semantics로 확인합니다.</p>
        <ResponsibilityTable />
        <CitationBlock source="Kubernetes v1.37 · Virtual IPs and Service Proxies" citeKey={6} href="https://kubernetes.io/docs/reference/networking/virtual-ips/">
          현재 iptables·IPVS·nftables mode의 동작과 IPVS 지원 중단 일정을 확인하는 공식 문서입니다.
        </CitationBlock>
        <CitationBlock source="Cilium 1.20 stable(확인일 1.20.2) · Kubernetes Without kube-proxy" citeKey={7} href="https://docs.cilium.io/en/stable/network/kubernetes/kubeproxy-free/">
          Socket LB가 Service backend를 packet 생성 전 선택할 수 있고 kernel·cgroup 조건과 관측 경계가 달라짐을 확인합니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="edge-mesh"
        level="6"
        title="외부 진입과 service mesh는 CNI 뒤에 새 경계를 더합니다"
        bridge="Hop을 더했으면 각 hop에서 남길 증거도 늘어납니다. 다음 절에서는 선언, route, outer packet, policy, conntrack을 같은 시각에 모으는 runbook으로 닫습니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8"><strong>NodePort</strong>는 node IP의 정해진 port에서 Service backend 선택으로 들어가는 문입니다. <strong>LoadBalancer</strong>는 cloud load balancer나 MetalLB 같은 구현이 외부 주소를 node 또는 Pod 경로와 잇습니다. MetalLB의 layer 2 mode와 BGP mode는 외부에서 그 주소까지 오는 방법이며, cluster 안의 Service backend 선택 전체를 대신하지 않습니다.</p>
          <p className="leading-8">HTTP host·path·header로 분기하려면 protocol-aware proxy가 필요합니다. Kubernetes의 <strong>Ingress</strong> API는 제거 예정은 아니지만 동결됐고, 새 기능에는 <strong>Gateway API</strong>가 권장됩니다. GatewayClass는 구현 종류, Gateway는 listener와 infrastructure, HTTPRoute는 application route를 나눠 조직의 책임 경계까지 API에 담습니다.</p>
          <p className="leading-8"><strong>Service mesh</strong>는 여기에 workload identity, mTLS, retry·timeout, L7 policy와 telemetry를 더합니다. Sidecar 방식은 Pod마다 proxy를 두고, 현재 Istio ambient 방식은 node별 L4 proxy와 필요할 때만 쓰는 L7 waypoint를 둡니다. 두 방식 모두 기본 Pod 연결과 Service 경로를 먼저 이해해야 새 proxy hop의 실패를 구분할 수 있습니다.</p>
          <p className="leading-8">따라서 404를 볼 때는 Gateway의 host와 route match, mesh의 L7 route, application route를 차례로 봅니다. SYN timeout이라면 그보다 앞선 외부 진입, Service, Pod route와 policy에서 첫 실패를 찾습니다. 응답 종류가 조사 시작점을 바꿉니다.</p>
        </div>
        <SourceApplication
          source="Kubernetes Ingress"
          excerpt="The Ingress API has been frozen."
          application="기존 Ingress를 당장 버리는 뜻은 아니지만 새 공통 기능을 annotation에 더 쌓는 대신 Gateway API와 구현체 conformance를 검토합니다."
        />
        <CitationBlock source="Gateway API v1.6 · Getting started(문서는 v1.6.1 manifest, 최신 release v1.6.3)" citeKey={8} href="https://gateway-api.sigs.k8s.io/guides/getting-started/introduction/">
          Standard channel의 GatewayClass·Gateway·HTTPRoute·ReferenceGrant와 controller 설치 경계를 확인합니다.
        </CitationBlock>
        <CitationBlock source="Istio · Ambient data plane" citeKey={9} href="https://istio.io/latest/docs/ambient/architecture/data-plane/">
          Node별 L4 ztunnel과 선택적 L7 waypoint가 실제 요청 경로에 추가되는 위치를 설명합니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="evidence"
        level="6"
        title="실습: 선언과 packet을 같은 시각에 맞춥니다"
        bridge="이 순서로 마지막 정상 지점을 찾았으면, 예전 실습의 기본값이 현재 cluster에서도 같은지 다시 확인해야 합니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">장애가 난 뒤 명령을 무작정 많이 실행하면 서로 다른 시각의 state가 섞입니다. 먼저 namespace·Pod·node·요청 시각을 고정하고, API 선언에서 kernel route와 packet capture로 내려갑니다. 각 단계는 정상 출력뿐 아니라 실패했을 때 다음에 볼 owner까지 기록합니다.</p>
          <p className="leading-8">이 사례에서는 <code>curl --no-keepalive</code>처럼 새 연결을 만들어 Service 선택과 conntrack을 다시 통과시킵니다. 캡처에는 민감한 payload가 담길 수 있으므로 production에서는 header와 보존 범위를 제한하고 승인 절차를 따릅니다.</p>
        </div>
        <EvidenceRunbook />
        <pre className={codeClass}><code>{`# MTU 경계도 작은 packet과 큰 packet으로 나눠 확인
kubectl -n shop exec client -- \
  ping -M do -s 1422 -c 3 10.244.2.34

# 1422 B ICMP payload + 8 B ICMP + 20 B IPv4 = 1450 B
# 실패하면 무작정 MTU를 낮추지 말고 실제 path MTU와 ICMP 정책을 함께 확인`}</code></pre>
        <CitationBlock source="Calico · Troubleshooting" citeKey={10} href="https://docs.tigera.io/calico/latest/operations/troubleshoot/troubleshooting">
          같은 node와 외부 통신은 되지만 다른 node Pod 통신만 실패할 때 route distribution부터 좁히는 공식 진단 경계를 참고합니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="source-map"
        level="7"
        title="오래된 실습에서 다시 확인할 다섯 가지"
        bridge="오래된 실습 글은 재현 재료로는 좋지만 현재 권장안을 고정하지는 못합니다. 마지막 절에서 version·배포판·현장 값의 한계를 남깁니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">지금 cluster에서는 예전 실습의 기본값을 그대로 가정하면 안 됩니다. Service 구현은 IPVS만 보지 않고, 외부 진입은 Ingress annotation과 Gateway API를 구분해야 합니다. Calico도 BIRD와 IP-in-IP만 쓰는 것이 아닙니다. 아래 다섯 항목에서 현재 cluster가 실제로 고른 모드를 확인합니다.</p>
        </div>
        <CurrentChangeLedger />
        <ProgressiveDetail
          title="이 패킷 경로 다음에는 무엇을 읽어야 합니까"
          preview="기본 패킷 경로를 확인한 뒤 이름·인증서, 상태 저장 서비스, Service mesh 순서로 범위를 넓힙니다."
        >
          <p className="leading-7">먼저 CNI와 Service만 있는 연결을 캡처합니다. 그 경로가 설명된 뒤에 DNS와 인증서를 붙이고, 상태 저장 서비스의 복구 절차를 봅니다. Service mesh는 기존 경로 위에 proxy와 신원 확인이 더해지므로 마지막에 비교해야 새로 생긴 hop과 실패 지점을 구분할 수 있습니다.</p>
          <StudyMap />
        </ProgressiveDetail>
        <CitationBlock source="장성필 기술블로그 · Kubernetes category" citeKey={11} href="https://hackjsp.tistory.com/category/Kubernetes">
          실습 주제 발견과 재현 순서의 보조 자료입니다. 제품의 현재 기본값·지원 상태·권장안은 각 공식 문서로 다시 검증했습니다.
        </CitationBlock>
        <CitationBlock source="Kubernetes · Operator pattern" citeKey={12} href="https://kubernetes.io/docs/concepts/extend-kubernetes/operator/">
          Database Operator 글 묶음을 사용자 정의 자원과 controller control loop라는 후속 경로로 분리하는 기준입니다.
        </CitationBlock>
      </LessonSection>

      <LessonSection
        id="limits"
        level="7"
        title="한계: 버전 표보다 실제 cluster state가 우선입니다"
        bridge="이 글의 도착점은 제품명을 외우는 것이 아니라, 실제 한 연결에서 주소·route·header·policy·socket 증거가 같은 설명을 가리키게 만드는 것입니다."
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">확인 기준은 2026-10-08의 Kubernetes v1.37, Calico 3.33, Cilium 1.20 stable 문서(확인일 1.20.2)와 Gateway API v1.6 Standard channel(getting-started 문서는 v1.6.1 manifest, 최신 release는 v1.6.3)입니다. 이 버전을 한 cluster에서 조합 검증했다는 뜻은 아니며, 실제 배포판의 지원 matrix와 upgrade note가 우선합니다.</p>
          <p className="leading-8">예시 IP·port·node 수·MTU 1500은 경로를 재현하기 위한 가정입니다. Cloud overlay, VLAN, WireGuard, NIC offload, managed CNI, dual stack을 쓰면 header와 관측 결과가 달라집니다. 특히 offload 때문에 host capture의 checksum이나 segment 크기가 wire와 다르게 보일 수 있습니다.</p>
          <p className="leading-8">“Calico를 안다”는 말은 manifest를 적용했다는 뜻보다, 같은 node와 다른 node, Service와 egress의 네 경로를 그릴 수 있다는 뜻에 가깝습니다. 각 전환은 route와 capture, policy와 conntrack으로 증명합니다. 면접에서는 직접 담당한 범위와 이 글처럼 사후 역설계한 범위를 나눠 말하면 됩니다.</p>
        </div>
        <ReviewPrompts
          questions={[
            "10.96.20.15가 어느 interface에도 없는데 연결되는 이유와 실제 backend를 확인할 명령을 설명해 보세요. (답: 5절)",
            "1500 B underlay에서 VXLAN workload MTU가 1450 B인 계산과 큰 packet만 실패할 때의 증거를 말해 보세요. (답: 7·10절)",
            "NetworkPolicy를 바꿨는데 기존 연결이 계속되는 이유와 새 연결을 분리해 시험하는 방법을 설명해 보세요. (답: 7·8·10절)",
          ]}
        />
      </LessonSection>
    </div>
  );
}
