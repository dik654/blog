import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ConceptOwnerMapViz from "./kubernetes-concept-map/viz/ConceptOwnerMapViz";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

const ROUTES = {
  k1: "/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview",
  k2: "/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview",
  k3: "/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview",
  k4: "/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview",
  k5: "/cs/cloud/kubernetes-pvc-pv-storageclass-csi#overview",
  k6: "/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview",
  k7: "/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview",
  req: "/cs/cloud/kubernetes-request-path-and-cka#overview",
  net: "/cs/cloud/kubernetes-network-packet-path#overview",
  l2: "/cs/cloud/linux-containers-cgroup-namespace#overview",
  l3: "/cs/cloud/linux-vfs-mount-page-cache-fsync#overview",
  l4: "/cs/cloud/linux-network-interface-route-netfilter-dns#overview",
  mem: "/cs/cloud/linux-memory-page-cache-oom#overview",
  proc: "/cs/cloud/linux-process-signals-pid1-fds#overview",
} as const;

const CKA_DOMAINS = [
  { weight: "30%", domain: "Troubleshooting", items: "cluster·node 진단, control plane 구성 요소, 자원 사용 monitoring, 컨테이너 출력 스트림, Service·네트워크 진단", articles: "배치·자원·Pod 상태·운영·요청 경로" },
  { weight: "25%", domain: "Cluster Architecture, Installation & Configuration", items: "RBAC, kubeadm, cluster lifecycle, HA control plane, Helm·Kustomize, CNI·CSI·CRI, CRD·operator", articles: "업그레이드·스토리지·Controller" },
  { weight: "20%", domain: "Services & Networking", items: "Pod 간 연결, NetworkPolicy, ClusterIP·NodePort·LoadBalancer와 endpoint, Gateway API, Ingress, CoreDNS", articles: "패킷 경로·종료·Linux 네트워크" },
  { weight: "15%", domain: "Workloads & Scheduling", items: "rolling update·rollback, ConfigMap·Secret, autoscaling, self-healing primitive, admission·scheduling(limits, affinity)", articles: "Controller·변경·자원·배치" },
  { weight: "10%", domain: "Storage", items: "StorageClass·dynamic provisioning, volume type·access mode·reclaim policy, PV·PVC", articles: "스토리지·Linux VFS" },
] as const;

const INTERVIEW_ROWS = [
  { question: "True or False? A single Pod can be split across multiple nodes", concept: "Pod는 한 Node에 통째로 binding됩니다.", href: ROUTES.k2, label: "Pod 배치" },
  { question: "What happens to running pods if you stop Kubelet on the worker nodes?", concept: "Pod는 계속 돌지만 Node는 50초 뒤 NotReady, 약 6분 뒤 축출이 시작됩니다.", href: ROUTES.k2, label: "Node 장애" },
  { question: "What will happen when a Pod, created by ReplicaSet, is deleted directly?", concept: "ReplicaSet controller가 차이를 보고 새 Pod를 만듭니다.", href: ROUTES.k1, label: "Controller" },
  { question: "What happens after you edit a deployment and change the image?", concept: "새 ReplicaSet이 생기고 25% surge·unavailable 규칙으로 교체됩니다.", href: ROUTES.k1, label: "Controller·rollout" },
  { question: "What happens when pods are using too much memory (more than its limit)?", concept: "커널 OOM kill, exit 137, 재시작. CPU는 죽지 않고 throttle입니다.", href: ROUTES.k3, label: "자원" },
  { question: "What QoS classes are there?", concept: "Guaranteed·Burstable·BestEffort. 단, eviction 순서는 QoS가 아닙니다.", href: ROUTES.k3, label: "자원" },
  { question: "You see CrashLoopBackOff. What could possibly went wrong and how to confirm?", concept: "backoff 대기 중이라는 표시. kubectl logs --previous와 Last State를 봅니다.", href: ROUTES.k4, label: "Pod 상태" },
  { question: "You try to run a Pod but it's in Pending state. What might be the reason?", concept: "requests 부족·affinity·taint·PVC 미바인딩, 또는 배치 뒤 ContainerCreating.", href: ROUTES.k4, label: "Pod 상태·요청 경로" },
  { question: "How readiness probe status affect Services when they are combined?", concept: "readiness가 false면 EndpointSlice에 ready=false로 기록되고 기본 요청 대상에서 제외됩니다.", href: ROUTES.net, label: "패킷·종료" },
  { question: "True or False? Persistent Volume must be available to all nodes…", concept: "access mode에 따릅니다. RWO는 노드 하나에서만 mount됩니다.", href: ROUTES.k5, label: "스토리지" },
  { question: "What is the control loop? How it works?", concept: "원하는 상태와 현재 상태의 차이를 반복해서 줄이는 루프입니다.", href: ROUTES.k1, label: "Controller" },
] as const;

const INCIDENTS = [
  { name: "Reddit Pi-Day (2023-03-14)", symptom: "업그레이드 1.23→1.24 직후 사이트 정지 314분", concept: "label·selector, 업그레이드 deprecation, admission webhook failurePolicy", href: ROUTES.k7, label: "업그레이드" },
  { name: "Zalando DNS (2019-01-07)", symptom: "CoreDNS 동시 OOMKill, cluster 전체 DNS 불능 1시간+", concept: "memory limit·OOMKill, ndots:5, cluster 안 monitoring", href: ROUTES.k7, label: "운영·자원·DNS" },
  { name: "kubernetes#67577 (2018–2020)", symptom: "CPU 사용량이 limit 아래인데 throttle, 지연 급등", concept: "CPU limit = CFS quota, 커널 결함", href: ROUTES.k3, label: "자원·cgroup" },
  { name: "NRE Labs (2018-12-04)", symptom: "API server가 2분마다 사라짐, RESTARTS 183", concept: "liveness probe가 건강한 etcd를 재시작", href: ROUTES.k4, label: "Probe·운영" },
  { name: "Blue Matador (2019-06-15)", symptom: "노드 SystemOOM 이틀 연속", concept: "requests·limits 없는 DaemonSet, 다른 namespace", href: ROUTES.k3, label: "자원·OOM" },
  { name: "loveholidays GKE", symptom: "0/256 nodes are available, Pod 절반 Pending", concept: "Pod CIDR 노드당 /24 → 256노드 상한, autoscaler", href: ROUTES.k2, label: "배치·용량" },
] as const;

export default function KubernetesConceptMapArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 먼저 Pod 하나가 만들어져 요청을 받는 전체 길을 봅니다</h2>
        <KubernetesSeriesLocator current="map" question="replicas: 3이라는 한 줄은 어떤 프로그램들을 지나 사용자 요청을 받는 Pod 세 개가 될까요?" />
        <div className="not-prose mb-6 grid gap-2 sm:grid-cols-2">
          {[
            ["Deployment", "같은 Pod를 몇 개 유지할지와 새 Pod의 설계도를 적은 API 리소스"],
            ["ReplicaSet", "Deployment 아래에서 존재하는 Pod 수를 목표 개수에 맞추는 API 리소스"],
            ["Pod", "하나 이상의 컨테이너를 함께 실행하는 Kubernetes의 최소 배치 단위"],
            ["Node", "Pod가 실제로 실행되는 서버나 가상 머신"],
            ["Service", "바뀌는 Pod 주소 앞에서 일정한 접속 주소를 제공하는 API 리소스"],
            ["EndpointSlice", "Pod 주소와 ready 조건을 묶어 요청 후보를 기록하는 API 리소스"],
          ].map(([term, meaning]) => (
            <div key={term} className="border-l-2 border-primary/60 bg-muted/15 px-4 py-3">
              <strong className="block text-sm text-foreground">{term}</strong>
              <span className="mt-1 block text-xs leading-5 text-muted-foreground">{meaning}</span>
            </div>
          ))}
        </div>
        <div className={prose}>
          <p>
            Kubernetes는 한 프로그램이 컨테이너를 직접 띄우는 도구가 아닙니다. 사용자가 API에 원하는 상태를 저장하면 controller가 필요한 Pod 객체를 만들고, scheduler가 Node를 고르고, 그 Node의 kubelet이 컨테이너·네트워크·볼륨을 준비합니다. EndpointSlice controller는 준비 검사를 통과한 Pod 주소를 요청 대상 목록에 반영하고, Node의 데이터 경로가 실제 요청을 전달합니다.
          </p>
          <p>
            이 프로그램들은 서로에게 작업 명령을 직접 보내기보다 API 리소스를 읽고 자신이 맡은 결과를 다시 기록합니다. 그래서 API 리소스는 <strong>원하는 상태와 진행 결과를 나누는 공용 기록</strong>이고, controller·scheduler·kubelet은 그 기록을 바꾸는 <strong>실행 중인 프로그램</strong>입니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. replicas를 2에서 3으로 늘렸지만 용량은 아직 그대로입니다</h2>
        <div className="not-prose mb-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["변경", "2 → 3", "Deployment의 replicas"],
            ["현재 상태", "Ready 2개", "새 Pod가 생성·배치·실행 중 멈춤"],
            ["처리 가능량", "70 req/s", "2개 × Pod당 35 req/s"],
            ["부족한 용량", "20 req/s", "입력 90 - 처리 70"],
          ].map(([label, value, detail]) => (
            <div key={label} className="border-l-4 border-primary/60 bg-muted/20 px-4 py-3">
              <span className="text-[10px] font-bold text-muted-foreground">{label}</span>
              <strong className="mt-1 block text-lg text-foreground">{value}</strong>
              <span className="mt-1 block text-[11px] leading-5 text-muted-foreground">{detail}</span>
            </div>
          ))}
        </div>
        <div className={prose}>
          <p>
            checkout Deployment의 replicas를 2에서 3으로 늘렸다고 가정합니다. Pod 하나가 초당 35건을 처리하므로 세 개가 모두 준비되면 용량은 초당 105건입니다. 그러나 새 Pod가 아직 준비되지 않았다면 초당 70건만 처리할 수 있고, 들어오는 90건 가운데 20건이 대기하거나 거절될 수 있습니다.
          </p>
          <p>
            ReplicaSet controller는 Ready 개수가 아니라 <strong>존재하는 Pod 개수</strong>를 목표와 맞춥니다. 따라서 먼저 replicas 변경이 저장됐는지, 세 번째 Pod 객체가 생겼는지, Node 이름이 붙었는지, 컨테이너와 네트워크·볼륨이 준비됐는지, Ready 주소가 EndpointSlice에 들어갔는지를 순서대로 봅니다. <strong>마지막 초록불 다음의 첫 실패</strong>가 조사할 경계입니다.
          </p>
          <p>
            Node 안쪽의 cgroup·mount·netfilter가 필요한 순간에는 <a href={ROUTES.l2}>컨테이너와 cgroup</a>, <a href={ROUTES.l3}>VFS와 mount</a>, <a href={ROUTES.l4}>Linux 패킷 경로</a>로 내려갑니다. 이 글들을 미리 끝내야 Kubernetes를 시작할 수 있는 것은 아닙니다.
          </p>
        </div>
      </section>

      <section id="map" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 장면을 넘기며 첫 실패 지점을 찾습니다</h2>
        <div className={prose}>
          <p>
            아래 그림은 세 번째 checkout Pod를 API 저장부터 실제 요청까지 옮깁니다. 장면마다 담당 프로그램과 성공 증거, 그 자리에서 보이는 대표 실패가 바뀝니다. 상자는 같은 자리에 두어 구조를 다시 찾지 않아도 됩니다.
          </p>
        </div>
        <ConceptOwnerMapViz />
      </section>

      <section id="questions" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 막힌 단계에서 필요한 정보만 더 확대합니다</h2>
        <div className={prose}>
          <p>
            <strong>1 · 요청 저장.</strong> API server가 replicas 변경을 거부하면 Deployment의 generation이 바뀌지 않습니다. 인증·권한·admission·schema 오류를 먼저 확인하고, 저장에 성공했다면 다음 단계로 넘어갑니다. 실제 명령과 Condition을 따라가려면 <a href={ROUTES.req}>요청 경로와 CKA</a>를 봅니다.
          </p>
          <p>
            <strong>2 · Pod 객체 생성.</strong> Deployment controller는 ReplicaSet을 관리하고, ReplicaSet controller는 원하는 Pod 수와 존재하는 Pod 수의 차이를 줄입니다. 세 번째 Pod 객체가 없다면 ReplicaSet의 FailedCreate Event와 quota를 확인합니다. 자세한 reconcile과 rollout은 <a href={ROUTES.k1}>Controller와 reconcile</a>에서 이어집니다.
          </p>
          <p>
            <strong>3 · Node 선택.</strong> scheduler는 실제 사용률이 아니라 이미 배치된 Pod의 requests와 Node의 Allocatable, taint, affinity, volume 조건을 봅니다. PodScheduled=False와 FailedScheduling Event가 보이면 <a href={ROUTES.k2}>Pod 배치</a>를, CPU·메모리 숫자를 계산해야 하면 <a href={ROUTES.k3}>requests·limits·Allocatable</a>을 확대합니다.
          </p>
          <p>
            PVC가 아직 연결되지 않아 Node를 고를 수 없거나 WaitForFirstConsumer 때문에 Node 선택 뒤에 볼륨을 만들어야 한다면 <a href={ROUTES.k5}>PVC·PV·StorageClass·CSI</a>를 함께 봅니다. requests는 이 단계의 배치 기준이고, limits는 다음 단계에서 Node가 집행하는 실행 상한입니다.
          </p>
          <p>
            <strong>4 · 실행 준비.</strong> spec.nodeName은 있지만 Ready가 아니라면 kubelet, container runtime, CNI, CSI, image, application probe 순서로 좁힙니다. Pending은 아직 Node를 못 고른 상태와 Node는 골랐지만 컨테이너를 준비 중인 상태를 모두 포함하고, CrashLoopBackOff는 반복 종료 뒤 재시작을 기다리는 표시입니다. Condition·Event·이전 로그를 읽는 법은 <a href={ROUTES.k4}>Pod 상태·probe·Event</a>가 맡습니다.
          </p>
          <p>
            Node의 Ready=False는 kubelet이 runtime이나 네트워크 준비 실패를 보고할 때 바로 나타날 수 있습니다. 하트비트 자체가 끊긴 경우에는 기본 50초 뒤 Ready=Unknown으로 판단하고, Pod의 기본 toleration 300초가 지난 뒤 축출을 시작합니다. 이 시간축은 <a href={ROUTES.k2}>Node 장애</a>에서 계산합니다.
          </p>
          <p>
            <strong>5 · 사용자 요청 전달.</strong> EndpointSlice controller가 Service의 selector와 Pod의 준비 상태를 보고 endpoint 목록을 갱신합니다. Node의 kube-proxy 또는 대체 데이터 경로는 그 정보를 실제 전달 규칙으로 바꿉니다. Pod가 Ready인데 endpoint가 없거나 실제 요청만 실패한다면 <a href={ROUTES.net}>Service에서 Pod까지의 패킷 경로</a>를 봅니다.
          </p>
          <p>
            <strong>전체 경로의 증거.</strong> Event는 보존 기간이 짧고 같은 대상과 이유가 count로 합쳐질 수 있으므로 장애 직후 수집합니다. <code>kubectl events</code>나 <code>kubectl get events --sort-by=.metadata.creationTimestamp</code>로 시간순으로 보고, <code>--field-selector</code>는 특정 객체나 이유만 거를 때 사용합니다. FailedCreate는 ReplicaSet, FailedScheduling·BackOff·FailedMount는 Pod, NodeNotReady는 Node처럼 단계마다 증거가 붙는 객체가 다릅니다.
          </p>
          <p>
            <strong>실행 중 변화와 운영.</strong> rollout·종료·drain·HPA는 이미 준비된 Pod의 수를 시간에 따라 바꾸므로 <a href={ROUTES.k6}>교체와 확장</a>에서 따로 봅니다. error budget, 경보, 업그레이드, 복구 판단처럼 여러 단계를 한꺼번에 다뤄야 하면 <a href={ROUTES.k7}>Kubernetes 운영</a>으로 넘어갑니다.
          </p>
        </div>
      </section>

      <section id="reading-order" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 전체 경로를 한 번 본 뒤 막힌 부분만 확대합니다</h2>
        <div className={prose}>
          <p>
            처음에는 <a href={ROUTES.req}>checkout Pod 한 개의 요청 경로</a>를 끝까지 따라갑니다. 그 다음 이 페이지로 돌아와 실패 지점에 맞는 글만 엽니다. Pod 객체가 생기지 않으면 <a href={ROUTES.k1}>Controller</a>, nodeName이 없으면 <a href={ROUTES.k2}>배치</a>와 <a href={ROUTES.k3}>requests</a>, Node는 정해졌지만 준비되지 않으면 <a href={ROUTES.k4}>Pod 상태</a>와 <a href={ROUTES.k5}>스토리지</a>를 봅니다.
          </p>
          <p>
            Pod가 Ready인데도 사용자가 실패하면 <a href={ROUTES.net}>Service에서 Pod까지의 패킷 경로</a>로 갑니다. 배포 중 용량이 줄거나 노드를 비울 때 문제가 생기면 <a href={ROUTES.k6}>종료·rollout·PDB·drain·HPA</a>를, 반복되는 장애와 업그레이드 결정을 묶어야 하면 <a href={ROUTES.k7}>SLO·알림·변경·복구</a>를 봅니다.
          </p>
          <p>
            Linux는 선수 과목이 아니라 한 단계 더 내려갈 때 사용합니다. CPU throttle과 OOMKill은 <a href={ROUTES.l2}>cgroup</a>과 <a href={ROUTES.mem}>메모리·OOM</a>, mount와 fsync는 <a href={ROUTES.l3}>VFS</a>, DNAT·conntrack·DNS는 <a href={ROUTES.l4}>Linux 네트워크</a>, 종료 신호는 <a href={ROUTES.proc}>프로세스·PID 1</a>에서 이어집니다.
          </p>
          <p>
            CKA 준비가 목적이면 전체 경로와 장애 지점을 이해한 뒤 <a href={ROUTES.req}>같은 글의 실습·시험 범위</a>로 내려갑니다. 자격 시험 순서가 Kubernetes 구조를 이해하는 순서를 대신하지는 않습니다.
          </p>
        </div>
      </section>

      <section id="failure-index" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 공개 장애 여섯 건은 각각 어느 개념이 비어 있었는지 보여 줍니다</h2>
        <div className={prose}>
          <p>
            시리즈가 인용하는 공개 postmortem 여섯 건입니다. 각 사례의 숫자는 원문 보고서가 적은 그대로이고 회사별 빈도나 일반성은 주장하지 않습니다. 목록은 Henning Jacobs의 Kubernetes Failure Stories(k8s.af)에서 골라 원문을
            직접 열어 확인했습니다. 증상만 보면 전부 "자원 부족"이나 "API server 느림"처럼 보이지만 원인은 서로 다른 개념에 있었습니다.
          </p>
        </div>
        <details className="not-prose my-6 border-y border-border py-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-foreground">공개 장애 6건의 단계와 원인 펼치기</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-bold">사례</th>
                <th className="py-2 pr-3 font-bold">증상</th>
                <th className="py-2 pr-3 font-bold">비어 있던 개념</th>
                <th className="py-2 font-bold">설명하는 글</th>
              </tr>
            </thead>
            <tbody>
              {INCIDENTS.map((row) => (
                <tr key={row.name} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3 font-bold text-foreground">{row.name}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.symptom}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.concept}</td>
                  <td className="py-2">
                    <a className="font-bold text-primary underline-offset-2 hover:underline" href={row.href}>
                      {row.label}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            노드 OS의 자동 업데이트가 CNI 경로를 지운 Datadog 2023-03-08 사례는 Kubernetes가 아니라 systemd 층의 문제라 <a className="font-bold text-primary" href="/cs/cloud/linux-systemd-boot-change-incidents#overview">systemd와 변경 사고</a>에서 이어집니다.
          </p>
        </details>
      </section>

      <section id="interview-index" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 공개 질문지의 질문과 CKA 비중을 글에 매핑하면 빈 칸이 보입니다</h2>
        <div className={prose}>
          <p>
            아래 질문은 커뮤니티가 자기 손으로 모은 공개 질문지(bregman-arie/devops-exercises)의 Kubernetes 항목 가운데 이 글의 운영 경로와 겹치는 것들입니다. 회사 공식 문항이 아닌 데다 출제 빈도 통계도 없으므로 "이런
            질문이 공개되어 있다"까지만 말합니다. 오른쪽 열은 그 질문의 답이 끝나는 글입니다.
          </p>
        </div>
        <details className="not-prose my-6 border-y border-border py-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-foreground">공개 질문과 담당 개념 펼치기</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-bold">공개 질문(원문)</th>
                <th className="py-2 pr-3 font-bold">한 줄 답</th>
                <th className="py-2 font-bold">글</th>
              </tr>
            </thead>
            <tbody>
              {INTERVIEW_ROWS.map((row) => (
                <tr key={row.question} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3 font-mono text-xs text-foreground">{row.question}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.concept}</td>
                  <td className="py-2">
                    <a className="font-bold text-primary underline-offset-2 hover:underline" href={row.href}>
                      {row.label}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </details>
        <div className={prose}>
          <p>
            자격 시험 쪽은 CKA의 공식 커리큘럼(Kubernetes v1.37 판)입니다. 다섯 영역의 비중은 아래와 같으며, 영역마다 이 시리즈의 어느 글이 닿는지 적었습니다. 시험은 2시간 실기이므로 글의 개념을 kubectl 명령으로 바꿔 보는 연습은{" "}
            <a href={ROUTES.req}>요청 경로와 CKA</a>의 실습 절이 맡습니다.
          </p>
        </div>
        <details className="not-prose my-6 border-y border-border py-3">
          <summary className="min-h-11 cursor-pointer py-2 text-sm font-bold text-foreground">CKA v1.37 공식 영역과 연결 글 펼치기</summary>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="py-2 pr-3 font-bold">비중</th>
                <th className="py-2 pr-3 font-bold">영역</th>
                <th className="py-2 pr-3 font-bold">공식 항목</th>
                <th className="py-2 font-bold">닿는 글</th>
              </tr>
            </thead>
            <tbody>
              {CKA_DOMAINS.map((row) => (
                <tr key={row.domain} className="border-b border-border/60 align-top">
                  <td className="py-2 pr-3 font-mono font-bold text-foreground">{row.weight}</td>
                  <td className="py-2 pr-3 font-bold text-foreground">{row.domain}</td>
                  <td className="py-2 pr-3 text-muted-foreground">{row.items}</td>
                  <td className="py-2 text-muted-foreground">{row.articles}</td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </details>
        <div id="paper-cka-curriculum" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="CNCF · CKA Exam Curriculum v1.37 (github.com/cncf/curriculum, 2026-10-23 확인)" citeKey={1} href="https://github.com/cncf/curriculum">
            <q>30% - Troubleshooting</q> 공식 PDF는 Storage 10%, Workloads and Scheduling 15%, Services &amp; Networking 20%, Cluster Architecture, Installation and Configuration 25%, Troubleshooting 30%로 다섯 영역을 적습니다. 문서 버전 번호는 시험이 기준으로 삼는 Kubernetes 버전과 같습니다.
          </CitationBlock>
        </div>
        <div id="paper-devops-exercises" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="bregman-arie/devops-exercises · topics/kubernetes/README.md (2026-10-16 확인)" citeKey={2} href="https://github.com/bregman-arie/devops-exercises/blob/master/topics/kubernetes/README.md">
            <q>What is the control loop? How it works?</q> 커뮤니티가 모은 공개 질문지입니다. 위 표의 질문은 이 문서의 원문 그대로이며, 이 질문지 자체도 Event와 PV·PVC 항목은 얇습니다.
          </CitationBlock>
        </div>
      </section>

      <section id="boundary" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 이 지도가 하는 일과 하지 않는 일</h2>
        <div className={prose}>
          <p>
            이 지도는 Pod 하나가 준비되어 사용자 요청을 받는 전체 경로와, 각 단계의 상세 설명이 어디에 있는지 보여 줍니다. 계산·소스·장애 사례는 연결된 글에서 이어집니다.
          </p>
          <p>
            각 글은 Kubernetes v1.37.1 소스(2026-09-23 릴리스)와 kubernetes/website
            main(2026-10-16 취득) 문서를 기준으로 하며, 기본값이 바뀐 항목은 어느 버전에서 바뀌었는지 글 안에 적습니다(예: NodeMonitorGracePeriod 40초 → 50초는 v1.32부터).
          </p>
          <p>
            다루지 않는 것은 RBAC·인증, Helm·Kustomize, NetworkPolicy의 세부, Gateway API, 그리고 managed Kubernetes(EKS, GKE, AKS)별 차이입니다. Pod IP 범위처럼 공급자 설정이 개념을 바꾸는 사례는 운영 글의 loveholidays
            사례로만 다룹니다. 국내 대기업의 공식 Kubernetes·SRE 면접 문항은 이번 조사에서 공개된 것을 찾지 못했으므로 7절은 공개 질문지와 공식 커리큘럼까지만 말합니다.
          </p>
        </div>
        <ContentBoundary article="kubernetes-concept-map" />
      </section>

      <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 지도를 덮고 답해 보세요</h2>
        <div className={prose}>
          <p>Node 하트비트가 끊긴 뒤 Pod가 약 6분 동안 Running으로 보일 수 있는 시간을 두 구간으로 나누고, 각 구간에서 확인할 Condition과 Event를 말해 보세요.</p>
          <p>Pending Pod의 Event가 "0/256 nodes are available … Insufficient cpu"여도 실제 CPU 부족이 아닐 수 있습니다. 어느 단계까지 성공했고 무엇을 추가로 확인해야 할까요?</p>
          <p>CoreDNS Pod가 OOMKilled된 뒤 이름 조회가 실패했다면 원인이 시작된 단계와 사용자 영향이 드러난 단계를 나누고, 각 단계의 증거를 말해 보세요.</p>
        </div>
      </section>
    </div>
  );
}
