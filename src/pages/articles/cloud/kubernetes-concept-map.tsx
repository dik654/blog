import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ConceptOwnerMapViz from "./kubernetes-concept-map/viz/ConceptOwnerMapViz";

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
  { weight: "30%", domain: "Troubleshooting", items: "cluster·node 진단, control plane 구성 요소, 자원 사용 monitoring, 컨테이너 출력 스트림, Service·네트워크 진단", articles: "K2 · K3 · K4 · K7 · 요청 경로" },
  { weight: "25%", domain: "Cluster Architecture, Installation & Configuration", items: "RBAC, kubeadm, cluster lifecycle, HA control plane, Helm·Kustomize, CNI·CSI·CRI, CRD·operator", articles: "K7(업그레이드·skew) · K5(CSI) · K1(operator)" },
  { weight: "20%", domain: "Services & Networking", items: "Pod 간 연결, NetworkPolicy, ClusterIP·NodePort·LoadBalancer와 endpoint, Gateway API, Ingress, CoreDNS", articles: "패킷 경로 · K6 · L4" },
  { weight: "15%", domain: "Workloads & Scheduling", items: "rolling update·rollback, ConfigMap·Secret, autoscaling, self-healing primitive, admission·scheduling(limits, affinity)", articles: "K1 · K6 · K3 · K2" },
  { weight: "10%", domain: "Storage", items: "StorageClass·dynamic provisioning, volume type·access mode·reclaim policy, PV·PVC", articles: "K5 · L3" },
] as const;

const INTERVIEW_ROWS = [
  { question: "True or False? A single Pod can be split across multiple nodes", concept: "Pod는 한 Node에 통째로 binding됩니다.", href: ROUTES.k2, label: "K2" },
  { question: "What happens to running pods if you stop Kubelet on the worker nodes?", concept: "Pod는 계속 돌지만 Node는 50초 뒤 NotReady, 약 6분 뒤 축출이 시작됩니다.", href: ROUTES.k2, label: "K2" },
  { question: "What will happen when a Pod, created by ReplicaSet, is deleted directly?", concept: "ReplicaSet controller가 차이를 보고 새 Pod를 만듭니다.", href: ROUTES.k1, label: "K1" },
  { question: "What happens after you edit a deployment and change the image?", concept: "새 ReplicaSet이 생기고 25% surge·unavailable 규칙으로 교체됩니다.", href: ROUTES.k1, label: "K1 · K6" },
  { question: "What happens when pods are using too much memory (more than its limit)?", concept: "커널 OOM kill, exit 137, 재시작. CPU는 죽지 않고 throttle입니다.", href: ROUTES.k3, label: "K3" },
  { question: "What QoS classes are there?", concept: "Guaranteed·Burstable·BestEffort. 단, eviction 순서는 QoS가 아닙니다.", href: ROUTES.k3, label: "K3" },
  { question: "You see CrashLoopBackOff. What could possibly went wrong and how to confirm?", concept: "backoff 대기 중이라는 표시. kubectl logs --previous와 Last State를 봅니다.", href: ROUTES.k4, label: "K4" },
  { question: "You try to run a Pod but it's in Pending state. What might be the reason?", concept: "requests 부족·affinity·taint·PVC 미바인딩, 또는 배치 뒤 ContainerCreating.", href: ROUTES.k4, label: "K4 · 요청 경로" },
  { question: "How readiness probe status affect Services when they are combined?", concept: "readiness false면 EndpointSlice에서 빠져 트래픽을 받지 않습니다.", href: ROUTES.net, label: "패킷 경로 · K6" },
  { question: "True or False? Persistent Volume must be available to all nodes…", concept: "access mode에 따릅니다. RWO는 노드 하나에서만 mount됩니다.", href: ROUTES.k5, label: "K5" },
  { question: "What is the control loop? How it works?", concept: "원하는 상태와 현재 상태의 차이를 반복해서 줄이는 루프입니다.", href: ROUTES.k1, label: "K1" },
] as const;

const INCIDENTS = [
  { name: "Reddit Pi-Day (2023-03-14)", symptom: "업그레이드 1.23→1.24 직후 사이트 정지 314분", concept: "label·selector, 업그레이드 deprecation, admission webhook failurePolicy", href: ROUTES.k7, label: "K7 9절" },
  { name: "Zalando DNS (2019-01-07)", symptom: "CoreDNS 동시 OOMKill, cluster 전체 DNS 불능 1시간+", concept: "memory limit·OOMKill, ndots:5, cluster 안 monitoring", href: ROUTES.k7, label: "K7 8절 · K3 · L4" },
  { name: "kubernetes#67577 (2018–2020)", symptom: "CPU 사용량이 limit 아래인데 throttle, 지연 급등", concept: "CPU limit = CFS quota, 커널 결함", href: ROUTES.k3, label: "K3 · L2" },
  { name: "NRE Labs (2018-12-04)", symptom: "API server가 2분마다 사라짐, RESTARTS 183", concept: "liveness probe가 건강한 etcd를 재시작", href: ROUTES.k4, label: "K4 · K7 10절" },
  { name: "Blue Matador (2019-06-15)", symptom: "노드 SystemOOM 이틀 연속", concept: "requests·limits 없는 DaemonSet, 다른 namespace", href: ROUTES.k3, label: "K3 · 메모리와 OOM" },
  { name: "loveholidays GKE", symptom: "0/256 nodes are available, Pod 절반 Pending", concept: "Pod CIDR 노드당 /24 → 256노드 상한, autoscaler", href: ROUTES.k2, label: "K2 · K7 7절" },
] as const;

export default function KubernetesConceptMapArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 여덟 질문은 모두 "원하는 상태를 적으면 누가 어떻게 맞추는가" 하나로 모입니다</h2>
        <div className={prose}>
          <p>
            Kubernetes를 운영하다 보면 질문이 여덟 개쯤으로 모입니다. 앞의 넷은 Node와 Pod는 무슨 관계인지, Deployment와 Job은 Pod를 어떻게 만드는지, 요청한 자원과 실제로 받은 자원은 왜 다른지,
            Pending·CrashLoopBackOff·NotReady는 각각 무슨 뜻인지입니다.
          </p>
          <p>
            뒤의 넷은 Service는 어떻게 Pod로 요청을 넘기는지, PVC는 어떻게 디스크를 붙이는지, Event에서 실패 이유를 어떻게 찾는지, 그리고 controller가 목표 상태를 계속 복구한다는 말이 정확히
            무엇인지입니다.
          </p>
          <p>
            답을 먼저 적겠습니다. 사용자는 API server에 원하는 상태를 적습니다. controller·scheduler·kubelet이 각자 맡은 차이를 줄이며, 줄이지 못한 자리마다 상태 값과 Event가 남습니다. 여덟 질문은 그 한 문장의 여덟 자리입니다.
          </p>
          <p>
            Deployment·Job은 "적는 쪽", scheduler와 kubelet은 "Node에 맞추는 쪽", requests·limits는 "맞출 때 쓰는 숫자", Pending·CrashLoopBackOff·NotReady와 Event는 "못 맞춘 자리의 기록", Service와 PVC는 "맞춘 Pod에
            네트워크와 디스크를 잇는 쪽"입니다.
          </p>
          <p>
            이 글은 그 여덟 자리를 글 일곱 편(K1~K7)과 기존 두 편, Linux 기초 세 편에 어떻게 나눴는지 보여 주는 지도입니다. 글마다 작은 숫자 사례 하나를 Kubernetes v1.37.1 소스와 공식 문서, 공개 장애 보고서로 끝까지 따라갑니다.
            Kubernetes가 처음이라면 <a href={ROUTES.req}>Kubernetes 요청 경로와 CKA</a>에서 Pod 하나가 Ready가 되는 전체 경로를 먼저 본 뒤 돌아와도 됩니다.
          </p>
        </div>
      </section>

      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 세 층이 있습니다: 적는 객체, 맞추는 controller, 그 아래의 Linux</h2>
        <div className={prose}>
          <p>
            바깥에서 보면 cluster는 세 층입니다. 맨 위는 사용자가 적는 객체입니다. Deployment·Job·Service·PVC는 전부 "이렇게 되어 있기를 바란다"는 선언일 뿐 그 자체로는 아무것도 실행하지 않습니다. 가운데는 그 선언과 현재 상태의
            차이를 줄이는 프로그램들입니다.
          </p>
          <p>
            Deployment controller는 ReplicaSet을, ReplicaSet controller는 Pod 객체를 만듭니다. scheduler는 Pod에 Node 이름을 적으며, kubelet은 자기 Node에 적힌 Pod를 실제 컨테이너로 띄웁니다.
          </p>
          <p>
            맨 아래는 Node의 Linux입니다. kubelet이 "CPU 500m, 메모리 1Gi"를 받으면 그 숫자는 cgroup의 cpu.max와 memory.max가 됩니다. Service의 ClusterIP는 노드의 netfilter 규칙이 되며, PVC의 mount는 노드의 mount table에 한
            줄로 들어갑니다.
          </p>
          <p>
            그래서 OOMKilled의 137, CPU throttling, DNS의 ndots 같은 Kubernetes 증상의 절반은 Linux 쪽 설명이 있어야 끝납니다. 이 시리즈가 Linux 기초 세 편(<a href={ROUTES.l2}>cgroup과 namespace</a>,{" "}
            <a href={ROUTES.l3}>VFS·mount·fsync</a>, <a href={ROUTES.l4}>인터페이스, 라우팅, netfilter, DNS</a>)을 선수로 두는 이유입니다.
          </p>
          <p>
            이 세 층을 알면 여덟 질문의 소속이 보입니다. 질문 2와 8은 가운데 층의 controller, 질문 1과 4의 NotReady는 scheduler·kubelet과 Node, 질문 3은 가운데 층의 숫자가 아래층으로 번역되는 자리, 질문 4의 나머지와 7은 가운데
            층이 남기는 기록, 질문 5와 6은 아래층으로 이어지는 네트워크와 디스크입니다.
          </p>
        </div>
      </section>

      <section id="questions" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 여덟 질문의 두 문장 답과 그 답이 끝나는 글</h2>
        <div className={prose}>
          <p>
            <strong>Node와 Pod의 관계.</strong> Pod는 scheduler가 필터와 점수로 고른 Node 하나에 binding되어 spec.nodeName이 채워지며, 그 뒤로는 그 Node의 kubelet만 그 Pod를 봅니다. Node의 하트비트(Lease 40초, 10초마다 갱신)가 50초 끊기면 NotReady가 되지만, Pod는 toleration 300초가 지난 뒤에야 축출되어 다른 Node에 새로 만들어집니다. → <a href={ROUTES.k2}>K2 Pod가 Node에 오르기까지</a>
          </p>
          <p>
            <strong>Deployment·Job이 Pod를 만드는 방식.</strong> Deployment는 Pod 대신 ReplicaSet을 만들며, image를 바꾸면 새 ReplicaSet이 생겨 25% surge·25% unavailable 규칙으로 Pod가 교체됩니다. Job은 Pod를 직접 만들며, 실패하면 backoffLimit 6번까지 늘어나는 간격(상한 10분)으로 다시 만듭니다. → <a href={ROUTES.k1}>K1 controller와 reconcile</a>
          </p>
          <p>
            <strong>요청한 자원과 실제 할당된 자원의 차이.</strong> scheduler는 실제 사용량이 아니라 Node에 이미 놓인 Pod들의 requests 합을 Allocatable(Capacity − 예약 − eviction 하한)과 비교하므로 CPU가 20%만 쓰여도 Pending이
            날 수 있습니다.
          </p>
          <p>
            limits는 Node에서 cgroup으로 집행되어 CPU는 100ms 주기 안에서 멈추며(throttle) 메모리는 넘는 순간 OOMKill(exit 137)됩니다. → <a href={ROUTES.k3}>K3 requests·limits·Allocatable·QoS</a>
          </p>
          <p>
            <strong>Pending·CrashLoopBackOff·NotReady의 의미.</strong> Pending은 Node를 못 골랐거나(FailedScheduling) 골랐지만 아직 컨테이너를 못 만든(ContainerCreating) 상태입니다.
          </p>
          <p>
            CrashLoopBackOff는 컨테이너가 죽은 뒤
            10초에서 300초까지 두 배씩 늘어나는 재시작 대기입니다. NotReady는 Pod가 아니라 Node의 상태로 하트비트가 끊긴 뒤 50초가 지났다는 뜻입니다. → <a href={ROUTES.k4}>K4 Pod 상태·probe·Event</a>, NotReady는{" "}
            <a href={ROUTES.k2}>K2</a>
          </p>
          <p>
            <strong>Service가 Pod로 요청을 전달하는 방식.</strong> Service는 selector에 맞는 Ready Pod들의 IP를 EndpointSlice에 모으며, kube-proxy가 그 목록을 각 Node의 netfilter(또는 IPVS·eBPF) 규칙으로 바꿔 ClusterIP를
            Pod IP로 DNAT합니다.
          </p>
          <p>
            Pod가 종료될 때 EndpointSlice에서 빠지는 일과 SIGTERM이 동시에 시작되어 짧은 경쟁이 생깁니다. → <a href={ROUTES.net}>Kubernetes 패킷 경로</a>, 종료 경쟁은{" "}
            <a href={ROUTES.k6}>K6 rollout·종료·PDB·HPA</a>
          </p>
          <p>
            <strong>PVC가 스토리지를 연결하는 방식.</strong> PVC는 용량, access mode, StorageClass가 맞는 PV에 binding되거나, StorageClass가 CSI 드라이버로 PV를 동적으로 만듭니다(WaitForFirstConsumer면 Pod가 스케줄된
            뒤). 그 뒤 CSI가 볼륨을 Node에 attach해 mount해야 컨테이너가 쓸 수 있으며, RWO는 Pod가 아니라 Node 단위 제한입니다. → <a href={ROUTES.k5}>K5 PVC·PV·StorageClass·CSI</a>
          </p>
          <p>
            <strong>Event에서 실패 이유를 찾는 방법.</strong> Event는 기본 1시간만 보존되며 같은 (대상, 이유)는 count로 합쳐지므로 장애 직후 kubectl get events --field-selector로 시간순 정렬해 읽습니다. FailedCreate는
            ReplicaSet에, FailedScheduling·BackOff·FailedMount는 Pod에, NodeNotReady는 Node에 붙어 owner 사슬마다 따로 봐야 합니다. → <a href={ROUTES.k4}>K4</a>
          </p>
          <p>
            <strong>Controller가 목표 상태를 계속 복구한다는 개념.</strong> controller는 "원하는 상태"를 읽은 뒤 "현재 상태"를 관찰해 그 차이만큼만 행동하는 루프입니다. ReplicaSet이 지운 Pod를 다시 만드는 것도 HPA가 replica를 늘리는 것도 같은 루프입니다. SRE의 error budget은 그 루프들이 못 막은 사용자 쪽 실패를 세는 바깥 고리입니다. → <a href={ROUTES.k1}>K1</a>, <a href={ROUTES.k7}>K7 SRE</a>
          </p>
        </div>
      </section>

      <section id="map" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 질문과 글을 선으로 이으면 글마다 맡은 자리가 하나씩입니다</h2>
        <div className={prose}>
          <p>
            위 여덟 답을 그림 하나로 놓습니다. 왼쪽이 질문, 오른쪽이 글이고 굵은 선이 그 질문의 설명이 끝나는 글, 가는 선이 그 설명이 기대는 바닥입니다. 질문 4처럼 두 글에 걸치는 경우는 Pod 쪽(CrashLoopBackOff·Pending)과
            Node 쪽(NotReady)으로 갈라 각각 한 글이 맡습니다.
          </p>
        </div>
        <ConceptOwnerMapViz />
      </section>

      <section id="reading-order" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 읽는 순서는 Linux 두 편 → K1에서 K7까지, 바닥에서 위로입니다</h2>
        <div className={prose}>
          <p>
            Kubernetes의 숫자가 Linux에서 집행되므로 먼저 <a href={ROUTES.l2}>컨테이너는 cgroup과 namespace다</a>를 읽습니다. cpu.max의 100,000μs 주기와 memory.high·memory.max의 차이를 알면 K3의 throttle과
            OOMKill이 바로 읽힙니다. 다음은 <a href={ROUTES.l4}>패킷이 프로세스에 닿기까지</a>입니다. veth·route·netfilter·ndots를 알면 패킷 경로 글과 K6의 종료 경쟁, K7의 Zalando 사례가 한 번에 읽힙니다.
          </p>
          <p>
            그 다음 K1부터 순서대로 읽습니다. K1은 controller 루프와 Deployment가 ReplicaSet을 거쳐 Pod를 만드는 방식, 그리고 Job을 다룹니다. K2는 Pod가 Node에 오르는 과정과 Node가 죽을 때의
            시계를, K3은 requests와 limits가 Allocatable과 cgroup, QoS, eviction으로 번역되는 과정을 다룹니다.
          </p>
          <p>
            K4는 Pending과 ImagePullBackOff, CrashLoopBackOff, probe, Event를 맡습니다. K5는 PVC가 PV와 StorageClass, CSI를 거쳐 mount되는 길이고, K6은 graceful termination과 rollout, PDB,
            drain, HPA입니다. K7은 SLO와 burn rate, 업그레이드, postmortem으로 시리즈를 닫습니다.
          </p>
          <p>
            앞 글의 사례가 뒤 글에 그대로 다시 나오므로 순서를 지키면 사례를 다시 세울 필요가 없습니다.
          </p>
          <p>
            기존 두 편은 중간에 끼워 읽습니다. <a href={ROUTES.req}>요청 경로와 CKA</a>는 K2와 K4 사이에서 Pending 진단의 전체 순서를, <a href={ROUTES.net}>패킷 경로</a>는 K5와 K6 사이에서 Service와 EndpointSlice, kube-proxy, CNI를
            맡습니다. 메모리 OOM의 점수 계산은 <a href={ROUTES.mem}>메모리와 OOM</a>이, 컨테이너 PID 1과 SIGTERM은 <a href={ROUTES.proc}>프로세스·신호·PID 1</a>이 이미 다루므로 K3·K6은 그쪽으로 링크만 합니다.
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
        <div className="not-prose my-6 overflow-x-auto">
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
        <div className={prose}>
          <p>
            노드 OS의 자동 업데이트가 CNI 경로를 지운 Datadog 2023-03-08 사례는 Kubernetes가 아니라 systemd 층의 문제라 <a href="/cs/cloud/linux-systemd-boot-change-incidents#overview">systemd와 변경 사고</a>가 맡습니다.
          </p>
        </div>
      </section>

      <section id="interview-index" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 공개 질문지의 질문과 CKA 비중을 글에 매핑하면 빈 칸이 보입니다</h2>
        <div className={prose}>
          <p>
            아래 질문은 커뮤니티가 자기 손으로 모은 공개 질문지(bregman-arie/devops-exercises)의 Kubernetes 항목 가운데 1절의 여덟 질문과 그대로 겹치는 것들입니다. 회사 공식 문항이 아닌 데다 출제 빈도 통계도 없으므로 "이런
            질문이 공개되어 있다"까지만 말합니다. 오른쪽 열은 그 질문의 답이 끝나는 글입니다.
          </p>
        </div>
        <div className="not-prose my-6 overflow-x-auto">
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
        <div className={prose}>
          <p>
            자격 시험 쪽은 CKA의 공식 커리큘럼(Kubernetes v1.37 판)입니다. 다섯 영역의 비중은 아래와 같으며, 영역마다 이 시리즈의 어느 글이 닿는지 적었습니다. 시험은 2시간 실기이므로 글의 개념을 kubectl 명령으로 바꿔 보는 연습은{" "}
            <a href={ROUTES.req}>요청 경로와 CKA</a>의 실습 절이 맡습니다.
          </p>
        </div>
        <div className="not-prose my-6 overflow-x-auto">
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
        <div id="paper-cka-curriculum" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="CNCF · CKA Exam Curriculum v1.37 (github.com/cncf/curriculum, 2026-10-17 확인)" citeKey={1} href="https://github.com/cncf/curriculum">
            <q>30% - Troubleshooting</q> 공식 PDF는 Storage 10%, Workloads and Scheduling 15%, Servicing and Networking 20%, Cluster Architecture, Installation and Configuration 25%, Troubleshooting 30%로 다섯 영역을 적습니다. 문서 버전 번호는 시험이 기준으로 삼는 Kubernetes 버전과 같습니다.
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
            이 지도는 여덟 질문의 두 문장 답과 그 답이 끝나는 글을 정해 두는 일을 합니다. 계산·소스·사례는 전부 각 글에 있고 여기서는 반복하지 않습니다.
          </p>
          <p>
            각 글은 Kubernetes v1.37.1 소스(2026-09-23 릴리스)와 kubernetes/website
            main(2026-10-16 취득) 문서를 기준으로 하며, 기본값이 바뀐 항목은 어느 버전에서 바뀌었는지 글 안에 적습니다(예: NodeMonitorGracePeriod 40초 → 50초는 v1.32부터).
          </p>
          <p>
            다루지 않는 것은 RBAC·인증, Helm·Kustomize, NetworkPolicy의 세부, Gateway API, 그리고 managed Kubernetes(EKS, GKE, AKS)별 차이입니다. Pod IP 범위처럼 공급자 설정이 개념을 바꾸는 사례는 K7의 loveholidays
            사례로만 다룹니다. 국내 대기업의 공식 Kubernetes·SRE 면접 문항은 이번 조사에서 공개된 것을 찾지 못했으므로 7절은 공개 질문지와 공식 커리큘럼까지만 말합니다.
          </p>
        </div>
        <ContentBoundary article="kubernetes-concept-map" />
      </section>

      <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 지도를 덮고 답해 보세요</h2>
        <div className={prose}>
          <p>"Node가 꺼졌는데 Pod가 6분 동안 그대로 Running으로 보인다"는 현상은 여덟 질문 가운데 어느 둘에 걸치고, 어느 글이 그 시계를 설명하나요? (답: 3절)</p>
          <p>Pending인 Pod의 Event가 "0/256 nodes are available … Insufficient cpu"일 때 자원 부족이 아닌 원인이 있을 수 있는 이유를 한 사례로 말해 보세요. (답: 6절)</p>
          <p>CKA 다섯 영역 가운데 비중이 가장 큰 영역의 항목 다섯 개는 각각 이 시리즈의 어느 글이 맡나요? (답: 7절)</p>
        </div>
      </section>
    </div>
  );
}
