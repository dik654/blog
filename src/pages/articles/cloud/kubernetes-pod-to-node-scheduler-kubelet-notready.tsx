import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import NodeFailureClockViz from "./kubernetes-pod-to-node-scheduler-kubelet-notready/viz/NodeFailureClockViz";
import { codeRefs } from "./kubernetes-pod-to-node-scheduler-kubelet-notready/codeRefs";
import { k8sPodNodeTrees } from "./kubernetes-pod-to-node-scheduler-kubelet-notready/fileTree";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KubernetesPodToNodeSchedulerKubeletNotReadyArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 노드 전원이 나갔는데 Pod는 왜 6분 가까이 Running으로 보였나요?</h2>
          <KubernetesSeriesLocator current="placement" question="Pod를 어느 Node에 배치하고, 그 Node가 응답하지 않을 때 언제 다시 배치할까요?" bridge="checkout의 세 번째 Pod에 아직 nodeName이 없다면 Node 선택 단계부터 확인합니다." />
          <div className={prose}>
            <p>
              세 노드 클러스터에서 worker-2의 전원이 나갔습니다. <code>kubectl get nodes</code>는 한동안 Ready를 보이다가 1분쯤 뒤 NotReady로 바뀌었으며, 그 노드의 Pod는 그 뒤로도 5분 동안 Running으로 보였습니다. 6분이 지나서야 Terminating이 되었고 새 Pod가 worker-1에 떴습니다. 아무도 "노드가 죽었다"고 알린 적이 없는데 누가 이 시각들을 정했을까요?
            </p>
            <p>
              답을 먼저 적겠습니다. Kubernetes에는 노드가 죽었다는 신호가 없습니다. 있는 것은 kubelet이 10초마다 갱신하던 Lease가 더는 갱신되지 않는다는 사실뿐입니다.
            </p>
            <p>
              node lifecycle controller는 마지막 갱신 뒤 50초가 지나면 Ready를 Unknown으로 적은 뒤 unreachable taint를 붙입니다. 모든 Pod에는 API server가 그 taint를 300초 참는 toleration을 기본으로 넣어 두었으므로, 그 뒤에야 Pod 삭제가 시작되어 ReplicaSet이 새 Pod를 만들고 scheduler가 다른 노드에 바인딩합니다.
            </p>
            <p>
              Pod가 노드에 가는 길도 같은 모양입니다. scheduler는 Pod의 spec.nodeName에 노드 이름을 적을 뿐이며, kubelet은 자기 이름이 적힌 Pod를 스스로 읽습니다.
            </p>
            <p>
              이 글은 "Node와 Pod의 관계"와 "NotReady의 의미"를 kubernetes v1.37.1 원문의 기본값으로 끝까지 따라갑니다. Pod를 만드는 쪽인 Deployment·ReplicaSet은 <a href="/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview">컨트롤러와 reconcile</a>에서, 노드에 도착한 Pod가 Pending·CrashLoopBackOff를 거치는 과정은 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>에서, 시리즈 지도는 <a href="/cs/cloud/kubernetes-concept-map#overview">Kubernetes 개념 지도</a>에서 이어집니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 네 참여자가 Pod 객체 하나를 읽고 쓸 뿐, 서로 말을 걸지 않습니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 Pod 하나의 여정에 네 참여자가 있습니다. API server는 Pod 객체를 etcd에 두어 읽기와 쓰기를 받습니다. scheduler는 nodeName이 비어 있는 Pod를 찾아 노드를 골라 그 이름을 적습니다.
            </p>
            <p>
              kubelet은 자기 노드 이름이 적힌 Pod를 읽어 컨테이너 런타임에 sandbox와 컨테이너 생성을 요청한 뒤 결과를 Pod의 status에 적습니다. node lifecycle controller는 kubelet이 보내는 심장박동을 근거로 Node 객체의 Ready 조건과 taint를 적습니다.
            </p>
            <p>
              이 넷은 서로에게 메시지를 보내지 않습니다. 모두 API server의 객체를 watch하다가 자기 담당 필드가 바뀌면 행동하며, 결과를 다시 객체에 씁니다. scheduler가 kubelet에게 "이 Pod를 띄워라"라고 하지 않으며, kubelet이 컨트롤러에게 "나 죽는다"라고 하지 않습니다. 그래서 어떤 참여자가 사라져도 나머지는 객체의 마지막 상태와 그 뒤 흐른 시간만으로 판단합니다. 노드 장애 6분의 시계가 이 구조에서 나옵니다.
            </p>
            <p>
              Pod가 노드에 도착한 뒤 kubelet이 CRI·CNI·CSI로 sandbox를 만드는 책임 경계와 Service·EndpointSlice로 트래픽이 붙는 과정은 <a href="/cs/cloud/kubernetes-request-path-and-cka#overview">Kubernetes 요청 경로</a>와 <a href="/cs/cloud/kubernetes-network-packet-path#overview">패킷 경로</a>에 이미 있습니다. 이 글은 그 앞뒤, 곧 노드를 고르는 순간과 노드를 잃는 순간만 다룹니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 세 노드 중 둘이 걸러지면 점수를 매기지 않고 남은 하나에 이름을 적습니다</h2>
          <div className={prose}>
            <p>
              (가정) 노드가 셋입니다. worker-1에는 운영자가 <code>maintenance=true:NoSchedule</code> taint를 걸어 두었으며, worker-3은 Allocatable CPU 2 가운데 이미 1.8이 다른 Pod의 requests로 잡혀 있습니다. 새 Pod <code>web-x</code>는 CPU 500m를 요청하며 toleration이 없습니다.
            </p>
            <p>
              scheduler는 두 단계로 봅니다. 첫째, Filter 플러그인들이 노드마다 "이 Pod가 갈 수 있나"를 예·아니오로 답합니다. TaintToleration 플러그인이 worker-1을 떨어뜨리며, NodeResourcesFit 플러그인이 worker-3을 "Insufficient cpu"(0.2 남음 &lt; 0.5)로 떨어뜨립니다. 남은 것은 worker-2 하나입니다.
            </p>
            <p>
              둘째, 통과한 노드가 여럿일 때만 Score 플러그인들이 점수를 매깁니다. 하나뿐이면 점수 단계를 건너뛰고 바로 worker-2를 고릅니다.
            </p>
            <p>
              고른 뒤 하는 일은 쓰기 한 줄입니다. Pod의 binding 하위 자원에 <code>Target: Node worker-2</code>를 POST하면 API server가 Pod의 <code>spec.nodeName</code>을 worker-2로 채웁니다. scheduler는 worker-2의 kubelet에 아무것도 보내지 않습니다.
            </p>
            <p>
              통과한 노드가 0이었다면 Pod는 Pending으로 남으며 <code>0/3 nodes are available: 1 node(s) had untolerated taint, 1 Insufficient cpu, …</code> 같은 FailedScheduling Event가 붙습니다. requests 합과 Allocatable로 노드가 차는 계산은 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">requests와 limits</a>에서 다룹니다.
            </p>
          </div>
          <AlgorithmBlock
            title="scheduler가 Pod 하나에 노드를 정하는 순서"
            input={["pod: web-x, requests cpu 500m, tolerations 없음, nodeName 비어 있음", "nodes: worker-1(taint maintenance:NoSchedule), worker-2(여유 1.5 CPU), worker-3(여유 0.2 CPU)"]}
            steps={[
              { code: "if snapshot.nodes == 0: return ErrNoNodesAvailable", note: "노드가 셋이니 통과합니다. 0이면 'no nodes available to schedule pods'입니다." },
              { code: "feasible = [n for n in nodes if all(filter(pod, n) for filter in Filters)]", note: "worker-1은 TaintToleration에서, worker-3은 NodeResourcesFit에서 떨어집니다. feasible = [worker-2]." },
              { code: "if len(feasible) == 0: return FitError(diagnosis)", note: "비었다면 노드별 탈락 이유를 Diagnosis에 담아 Pending 상태의 Event 메시지가 됩니다." },
              { code: "if len(feasible) == 1: host = feasible[0]  # 점수 생략", note: "worker-2가 바로 뽑힙니다. 여럿이었다면 Score 플러그인 합산 뒤 최댓값입니다." },
              { code: "assume(pod, host); reserve; permit", note: "scheduler 캐시에 미리 '이 노드에 간 것'으로 적어 다음 Pod 계산에 반영합니다. Bind는 별도 고루틴에서 합니다." },
              { code: "POST pods/web-x/binding {target: Node worker-2}", note: "API server가 spec.nodeName = worker-2를 씁니다. 이 순간부터 worker-2 kubelet의 watch에 web-x가 나타납니다." },
            ]}
            repeatUntil="scheduler는 큐에서 다음 Pod를 꺼내 같은 과정을 반복합니다. Bind가 실패하면 assume을 되돌리고 Pod를 큐에 되돌립니다."
            output="Pod web-x: spec.nodeName worker-2, status.phase Pending(아직 kubelet이 받기 전), condition PodScheduled=True."
          />
          {code("schedule-pod", "schedulePod 네 분기")}
          {code("default-binder", "Binding POST 한 줄")}
        </section>

        <section id="kubelet-watch" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. kubelet은 자기 이름이 적힌 Pod만 골라 읽고, 상태를 다시 적습니다</h2>
          <div className={prose}>
            <p>
              worker-2의 kubelet은 시작할 때 API server에 "모든 namespace의 Pod 가운데 <code>spec.nodeName=worker-2</code>인 것"을 list/watch로 걸어 둡니다. 3절의 Binding이 nodeName을 채우는 순간 이 watch에 web-x가 나타납니다.
            </p>
            <p>
              kubelet은 Pod spec을 읽어 컨테이너 런타임에 sandbox 생성을 요청한 다음 CNI로 네트워크를, CSI로 볼륨을 붙인 뒤 컨테이너를 시작합니다. 결과는 Pod의 <code>status</code>(phase, containerStatuses, conditions)에 다시 씁니다.
            </p>
            <p>
              이 구조에서 "Pod가 노드에 있다"는 말의 뜻이 정해집니다. API server 쪽에서는 spec.nodeName이 그 노드라는 사실이며, 노드 쪽에서는 kubelet이 그 Pod를 읽어 런타임에 컨테이너를 만들었다는 사실입니다. 둘은 보통 몇 초 차이로 같아지지만, 노드가 죽으면 영영 어긋납니다. nodeName은 worker-2인데 컨테이너를 돌릴 kubelet이 없는 상태가 1절의 "Running으로 보이는 5분"입니다.
            </p>
            <p>
              kubelet은 Pod 상태 외에 자기 노드의 상태도 씁니다. 두 종류입니다. Node 객체의 <code>status</code>에는 조건(Ready, MemoryPressure, DiskPressure, PIDPressure)과 Allocatable 같은 값을 적는데, 10초마다 계산하되 바뀐 것이 없으면 5분에 한 번만 씁니다.
            </p>
            <p>
              <code>kube-node-lease</code> namespace의 자기 이름 Lease 객체에는 10초마다 renewTime을 갱신합니다. Lease가 가벼운 심장박동, status가 무거운 보고서입니다.
            </p>
          </div>
          {code("kubelet-watch", "spec.nodeName field selector")}
          {code("kubelet-defaults", "10초 · 5분 · 40초")}
          <div id="paper-nodes-heartbeat" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Nodes · Node heartbeats (concepts/architecture/nodes) · 2026-10-16 확인" citeKey={1} href="https://kubernetes.io/docs/concepts/architecture/nodes/#node-heartbeats">
              <q>For nodes there are two forms of heartbeats: updates to the .status of a Node, [and] Lease objects within the kube-node-lease namespace.</q> 같은 절은 Lease가 Node .status보다 가벼워 대규모 클러스터의 성능을 위해 도입되었다고 적고, kubelet이 status는 변화가 있거나 일정 시간이 지났을 때, Lease는 10초마다 갱신한다고 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 10초와 40초, 50초와 300초는 각각 다른 참여자가 정한 숫자입니다</h2>
          <div className={prose}>
            <p>
              앞 절의 숫자에 이름과 주인을 붙입니다. 모두 v1.37.1 기본값입니다. kubelet 설정 <code>nodeLeaseDurationSeconds</code>는 40이고 Lease에 적히는 유효 기간입니다. 갱신 간격은 이 값에 0.25를 곱한 10초입니다. 세 번 놓쳐도 Lease는 유효합니다. <code>nodeStatusUpdateFrequency</code> 10초는 status를 계산하는 주기, <code>nodeStatusReportFrequency</code> 5분은 변화가 없을 때 쓰는 주기입니다.
            </p>
            <p>
              kube-controller-manager의 node lifecycle controller는 <code>--node-monitor-period</code> 5초마다 모든 노드를 훑으면서 노드마다 마지막으로 심장박동을 본 시각(probe 시각)을 기억합니다.
            </p>
            <p>
              마지막 probe 뒤 <code>--node-monitor-grace-period</code> 50초가 지나면 Ready를 Unknown으로 바꿉니다. 이 값은 v1.31까지 40초였고 v1.32부터 50초입니다.
            </p>
            <p>
              소스 주석은 HTTP/2 ping timeout 30초 + read idle 15초를 넘어야 느린 연결을 죽은 노드로 오판하지 않는다고 적습니다. 막 등록된 노드는 <code>--node-startup-grace-period</code> 60초를 봐줍니다.
            </p>
            <p>
              Ready 조건의 값은 taint가 됩니다. kubelet이 스스로 Ready=False를 보고하면 <code>node.kubernetes.io/not-ready</code>, 컨트롤러가 심장박동 부재로 Unknown을 적으면 <code>node.kubernetes.io/unreachable</code>입니다.
            </p>
            <p>
              둘 다 NoSchedule과 NoExecute 두 effect로 붙습니다. NoSchedule은 새 Pod를 막으며, NoExecute는 이미 도는 Pod를 toleration이 없으면 쫓아냅니다.
            </p>
            <p>
              마지막 숫자 300초는 kube-apiserver의 admission 플러그인 DefaultTolerationSeconds가 정합니다. Pod를 만들 때 not-ready와 unreachable NoExecute taint에 대한 <code>tolerationSeconds: 300</code>을 자동으로 넣습니다.
            </p>
            <p>
              taint가 붙은 뒤 300초가 지나면 taint eviction 컨트롤러가 Pod 삭제를 요청합니다. kube-controller-manager 설정에 남아 있는 <code>podEvictionTimeout</code> 5분은 v1.37.1 node lifecycle controller 코드 어디에서도 읽지 않습니다.
            </p>
            <p>
              5분을 바꾸려면 API server 플래그 <code>--default-unreachable-toleration-seconds</code>나 Pod 자신의 toleration을 바꿔야 합니다.
            </p>
          </div>
          {code("nlc-defaults", "50초 · 60초 · 5초, 쓰이지 않는 5분")}
          {code("nlc-taints", "Ready 값 → taint 표")}
          {code("toleration-defaults", "기본 toleration 300초")}
        </section>

        <section id="notready-clock" data-teach-level="3" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 마지막 갱신 + 50초에 Unknown, 거기서 300초 뒤에 삭제가 시작됩니다</h2>
          <div className={prose}>
            <p>
              worker-2의 kubelet이 t = 0에 멈췄다고 합시다. 마지막 Lease 갱신은 t = 0 직전입니다. 컨트롤러는 5초마다 보지만 갱신이 없으니 probe 시각은 0에 머뭅니다.
            </p>
            <p>
              t = 30에 갱신 세 번이 누락됐어도 판정 기준은 Lease 만료(40초)가 아니라 probe + 50초이므로 아직 Ready=True입니다. t = 50을 넘긴 뒤 첫 검사, 곧 50~55초 사이에 Ready·MemoryPressure·DiskPressure·PIDPressure가 모두 Unknown이 되어 unreachable taint가 붙습니다.
            </p>
            <p>
              이때부터 web-x의 toleration 300초가 흐릅니다. <code>kubectl get pods</code>는 여전히 Running을 보입니다. 상태를 고쳐 쓸 kubelet이 없어 마지막 보고가 남아 있을 뿐입니다. t ≈ 350~355에 toleration이 끝나 삭제가 요청되어 Pod에 deletionTimestamp가 적힙니다. 컨테이너를 실제로 멈추고 Pod 객체를 지울 kubelet이 없으므로 Pod는 Terminating에 머뭅니다.
            </p>
            <p>
              ReplicaSet은 deletionTimestamp가 있는 Pod를 활성으로 세지 않으므로 그 즉시 차이 −1로 새 Pod web-y를 만듭니다. scheduler는 unreachable:NoSchedule taint가 붙은 worker-2를 걸러 worker-1에 바인딩하며, worker-1의 kubelet이 컨테이너를 시작합니다.
            </p>
            <p>
              Pod가 "옮겨진" 것이 아니라 새 Pod가 생긴 것이며, 옛 web-x는 노드가 돌아오거나 운영자가 <code>--force --grace-period=0</code>으로 지울 때까지 Terminating으로 남습니다. 컨트롤러가 없는 bare Pod였다면 대체 Pod는 생기지 않습니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="kubelet 정지부터 새 Pod까지"
            question="노드가 꺼진 뒤 Pod 삭제가 시작되기까지 왜 약 6분이 걸릴까요?"
            scope="kubelet defaults.go(Lease 40초, 갱신 비율 0.25), nodelifecycle defaults.go(grace 50초, 검사 5초), defaulttolerationseconds admission.go(300초)의 기본값을 더합니다. 새 Pod의 스케줄·이미지 pull·시작 시간은 빼고 셉니다."
            steps={[
              { label: "Lease 갱신 간격", expression: "40 s × 0.25", result: "10 s", reason: "kubelet.go가 leaseDuration에 nodeLeaseRenewIntervalFraction을 곱합니다." },
              { label: "Unknown 판정", expression: "probe 0 s + grace 50 s, 다음 5 s 검사", result: "50~55 s", reason: "tryUpdateNodeHealth는 now > probeTimestamp + gracePeriod일 때 조건을 Unknown으로 바꿉니다." },
              { label: "taint 부착", expression: "Unknown 직후 taint 패스", result: "≈ 50~55 s", reason: "unreachable taint가 NoExecute와 NoSchedule로 붙습니다. 노드별 rate limiter를 거치지만 노드 하나면 즉시입니다." },
              { label: "toleration 소모", expression: "taint 시각 + 300 s", result: "350~355 s", reason: "DefaultTolerationSeconds가 모든 Pod에 넣어 둔 tolerationSeconds 300입니다." },
              { label: "새 Pod 생성", expression: "deletionTimestamp → RS diff −1", result: "≈ 355~360 s", reason: "ReplicaSet은 Terminating Pod를 활성으로 세지 않아 바로 새 Pod를 만들고 scheduler가 다른 노드에 바인딩합니다." },
            ]}
            conclusion="삭제 시작까지 약 50 + 300 = 350초, 거기에 새 Pod가 Ready가 되는 시간이 더해져 서비스 관점의 복구는 6분이 넘습니다. 이 가운데 운영자가 바꿀 수 있는 가장 큰 항은 Pod별 tolerationSeconds입니다."
            caveats={["여러 노드가 함께 죽으면 축출 속도 제한이 걸립니다. 건강한 zone에서는 10초에 노드 하나(0.1/s)입니다. NotReady 노드가 3개 이상이고 zone의 55% 이상이면 비정상 zone으로 보아 100초에 하나(0.01/s)로 낮추고, 노드 50개 이하 클러스터에서는 축출을 멈춥니다. zone의 모든 노드가 NotReady면 control plane 쪽 문제로 보고 taint를 떼고 축출을 전부 멈춥니다. 세 노드 중 둘이 죽은 경우는 NotReady가 3개 미만이라 정상 zone으로 10초에 하나씩 지워집니다.", "StatefulSet Pod는 같은 이름을 다시 써야 하므로 옛 Pod가 Terminating으로 남아 있는 동안 대체 Pod가 생기지 않습니다. 노드가 확실히 죽었음을 운영자가 확인하고 강제 삭제해야 합니다.", "Lease만 갱신되고 status가 멈춘 노드는 건강한 것으로 봅니다. 반대로 status는 오는데 Lease가 멈추는 경우도 probe 시각이 갱신되어 건강합니다."]}
          />
          <NodeFailureClockViz />
          {code("nlc-grace", "probe + 50초 판정과 Unknown 기록")}
          {code("eviction-rates", "축출 속도 0.1 · 0.01 · 50노드")}
        </section>

        <section id="taints-eviction" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. NotReady는 상태가 아니라 "마지막 보고 뒤 얼마나 지났나"의 결과입니다</h2>
          <div className={prose}>
            <p>
              <code>kubectl get nodes</code>의 STATUS 열 NotReady는 Ready 조건이 True가 아니라는 뜻 하나로 두 경우를 묶습니다. 첫째는 kubelet이 살아서 스스로 False를 보고한 경우입니다. 컨테이너 런타임이 죽었거나, CNI 플러그인이 준비되지 않았거나, 디스크·PID가 위험 수준인 노드가 여기 해당하고 reason도 kubelet이 적은 값입니다.
            </p>
            <p>
              둘째는 kubelet의 보고 자체가 끊겨 컨트롤러가 Unknown을 적은 경우로 reason이 <code>NodeStatusUnknown</code>, message가 "Kubelet stopped posting node status."입니다.
            </p>
            <p>
              두 경우의 진단이 다릅니다. False면 노드에 들어가 kubelet 로그와 런타임 상태를 봅니다. Unknown이면 노드 자체 또는 노드와 API server 사이 네트워크를 의심합니다. 노드 안에서는 컨테이너가 멀쩡히 돌고 있을 수 있습니다.
            </p>
            <p>
              분단된 노드의 Pod는 300초 뒤 API server 쪽에서 삭제가 요청되지만 노드 안 컨테이너는 계속 돌므로, 같은 Pod가 두 노드에서 동시에 도는 구간이 생깁니다. 데이터베이스처럼 하나만 돌아야 하는 작업이 StatefulSet과 수동 확인을 요구하는 이유입니다.
            </p>
            <p>
              taint의 두 effect도 구분합니다. NoSchedule taint는 scheduler의 Filter 단계에서 새 Pod를 막습니다. NoExecute taint는 taint eviction 컨트롤러가 이미 있는 Pod를 살펴 toleration이 없으면 바로, tolerationSeconds가 있으면 그 뒤에 삭제를 요청합니다.
            </p>
            <p>
              기본 toleration은 NoExecute 쪽에만 300초로 들어가므로, Unknown 노드에는 새 Pod가 가지 않으면서 기존 Pod는 5분을 버팁니다. DaemonSet Pod는 컨트롤러가 not-ready·unreachable에 대해 tolerationSeconds 없는 toleration을 넣어 쫓겨나지 않습니다.
            </p>
          </div>
          {code("nlc-noschedule", "NoSchedule taint 패스")}
          {code("nlc-taint-pass", "NoExecute taint 패스")}
          <div id="paper-taint-doc" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Taints and Tolerations · Taint based Evictions (concepts/scheduling-eviction/taint-and-toleration) · 2026-10-16 확인" citeKey={2} href="https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/#taint-based-evictions">
              <q>These automatically-added tolerations mean that Pods remain bound to Nodes for 5 minutes after one of these problems is detected.</q> 같은 절은 unreachable taint가 Ready 조건 Unknown에 대응한다고 적고, DaemonSet Pod는 not-ready·unreachable에 대해 tolerationSeconds 없는 NoExecute toleration을 가져 축출되지 않는다고 설명합니다. StatefulSet 문서(tasks/run-application/force-delete-stateful-set-pod)는 "A Pod is not deleted automatically when a node is unreachable"로 시작해, 강제 삭제가 같은 identity의 Pod를 중복 실행시켜 at-most-one 보장을 깰 수 있다고 경고합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="source-scheduler" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. scheduler 원문은 네 분기로 노드를 고르고 Binding 하나를 씁니다</h2>
          <div className={prose}>
            <p>
              Kubernetes v1.37.1 <code>pkg/scheduler/schedule_one.go</code>의 schedulePod(572–628행)가 3절의 순서입니다. 577–579행은 스냅샷에 노드가 없으면 ErrNoNodesAvailable을 돌려줍니다.
            </p>
            <p>
              581행이 findNodesThatFitPod로 Filter를 돌리며, 587–592행은 통과 노드가 0이면 FitError에 Diagnosis를 담습니다. Pending Pod의 "0/3 nodes are available" 메시지가 이 구조체에서 만들어집니다.
            </p>
            <p>
              595–605행이 "통과 노드가 하나면 점수 생략"입니다. 3절에서 worker-2가 이 분기로 뽑혔습니다. 608–615행은 여럿일 때 prioritizeNodes로 Score 플러그인을 돌려 정렬한 뒤 첫 노드를 고릅니다. 결과는 SuggestedHost라는 이름 그대로 제안이며, 실제 기록은 bind(1100–1111행)가 RunBindPlugins로 DefaultBinder를 불러 합니다.
            </p>
            <p>
              <code>pkg/scheduler/framework/plugins/defaultbinder/default_binder.go</code>의 Bind(52–76행)가 그 쓰기입니다. 54–57행이 Target Kind Node, Name nodeName인 Binding 객체를 만들며 71행이 Pod의 binding 하위 자원에 보냅니다. 파일 전체에 kubelet이나 노드 주소는 나오지 않습니다. scheduler와 kubelet은 이 한 필드로만 이어집니다.
            </p>
          </div>
          {code("schedule-pod", "schedulePod 원문")}
          {code("bind", "bind → RunBindPlugins")}
          {code("default-binder", "DefaultBinder.Bind 원문")}
        </section>

        <section id="source-kubelet" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. kubelet 원문은 selector 하나로 Pod를 받고 10초마다 Lease를 갱신합니다</h2>
          <div className={prose}>
            <p>
              <code>pkg/kubelet/config/apiserver.go</code>의 NewSourceApiserver(36행 이하)가 4절의 watch입니다. 37행이 <code>fields.OneTermEqualSelector("spec.nodeName", nodeName)</code>으로 모든 namespace의 Pod를 거릅니다. 이 selector가 kubelet이 받는 Pod의 전부이며, Binding이 nodeName을 채우기 전에는 어떤 Pod도 여기 나타나지 않습니다.
            </p>
            <p>
              <code>pkg/kubelet/apis/config/v1beta1/defaults.go</code> 136–151행이 5절의 세 기본값입니다. NodeStatusReportFrequency 5분(141행), NodeStatusUpdateFrequency 10초(147행), NodeLeaseDurationSeconds 40(150행).
            </p>
            <p>
              <code>pkg/kubelet/kubelet.go</code> 236–237행의 nodeLeaseRenewIntervalFraction 0.25와 1155–1156행의 곱셈이 갱신 간격 10초를 만들고, 1157–1166행이 노드 이름을 holder로 하는 Lease 컨트롤러를 kube-node-lease namespace에 만듭니다.
            </p>
            <p>
              <code>staging/src/k8s.io/component-helpers/apimachinery/lease/controller.go</code>의 Run(148–154행)이 renewInterval에 4% jitter를 섞어 sync를 반복합니다. sync(156–194행)는 마지막으로 성공한 Lease를 기억해 GET 없이 UPDATE만 보내다가, 실패하면 Lease를 다시 확보한 뒤 최대 다섯 번 재시도합니다.
            </p>
            <p>
              노드가 꺼지면 이 루프가 멈추며, 그 뒤 모든 판단은 다른 참여자가 "갱신이 없다"는 사실로만 합니다.
            </p>
          </div>
          {code("kubelet-watch", "NewSourceApiserver 원문")}
          {code("kubelet-defaults", "kubelet 기본값 원문")}
          {code("kubelet-lease-ctl", "Lease 컨트롤러 생성")}
          {code("lease-sync", "sync 루프 원문")}
        </section>

        <section id="source-nlc" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 컨트롤러 원문은 probe 시각을 당기고, 50초를 비교하고, 표로 taint를 고릅니다</h2>
          <div className={prose}>
            <p>
              <code>pkg/controller/nodelifecycle/node_lifecycle_controller.go</code>의 tryUpdateNodeHealth(844행 이하)가 6절의 판정입니다. 950–958행은 kube-node-lease의 Lease를 읽어 renewTime이 저장해 둔 것보다 새로우면 probeTimestamp를 now로 둡니다.
            </p>
            <p>
              주석이 중요한 사실을 적습니다. kubelet이 status를 한 번도 안 보내도 Lease만 갱신되면 건강한 노드로 보아 아무 조치도 하지 않습니다.
            </p>
            <p>
              962행이 <code>nc.now().After(probeTimestamp.Add(gracePeriod))</code>입니다. gracePeriod는 Ready 조건이 한 번이라도 있던 노드면 nodeMonitorGracePeriod 50초, 아직 없는 새 노드면 nodeStartupGracePeriod 60초입니다(860–890행).
            </p>
            <p>
              참이면 1004–1024행이 Ready·MemoryPressure·DiskPressure·PIDPressure를 Unknown으로 바꾸고 reason NodeStatusUnknown, message "Kubelet stopped posting node status."를 적습니다. NetworkUnavailable은 control plane이 관리하므로 건드리지 않습니다.
            </p>
            <p>
              74–95행의 표 nodeConditionToTaintKeyStatusMap이 Ready False → not-ready, Unknown → unreachable을 정합니다. doNoScheduleTaintingPass(539–566행)가 이 표로 NoSchedule taint를, doNoExecuteTaintingPass(594행 이하, 640–647행)가 같은 key의 NoExecute taint를 붙입니다.
            </p>
            <p>
              <code>config/v1alpha1/defaults.go</code> 41–48행이 50초의 근거 주석과 함께 기본값을 두며, 38–40행의 PodEvictionTimeout 5분은 이 파일 밖 어디에서도 읽히지 않습니다.
            </p>
            <p>
              300초는 kube-controller-manager가 아니라 <code>plugin/pkg/admission/defaulttolerationseconds/admission.go</code>에 있습니다. 44–45행이 두 기본값, 53–58행이 API server 플래그, 96–110행이 Pod에 넣을 toleration 두 개를 만듭니다.
            </p>
            <p>
              축출 속도 플래그는 <code>cmd/kube-controller-manager/app/options/nodelifecyclecontroller.go</code> 48–51행에 0.1·0.01·50·0.55로 있습니다.
            </p>
          </div>
          {code("nlc-grace", "tryUpdateNodeHealth 원문")}
          {code("nlc-taints", "taint 표 원문")}
          {code("nlc-noschedule", "doNoScheduleTaintingPass")}
          {code("nlc-defaults", "nodelifecycle 기본값 원문")}
          {code("toleration-defaults", "DefaultTolerationSeconds 원문")}
          {code("eviction-rates", "축출 속도 플래그 원문")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. renewTime과 reason을 보고, tolerationSeconds를 고칩니다</h2>
          <div className={prose}>
            <p>
              노드 생사를 가장 빨리 보는 곳은 <code>kubectl get lease -n kube-node-lease worker-2 -o yaml</code>의 renewTime입니다. 10초 이상 오래됐으면 kubelet이 멈춘 것이며, 50초가 넘기 전까지는 Node 객체에 아무 표시도 없습니다.
            </p>
            <p>
              <code>kubectl describe node worker-2</code>의 Conditions에서 Ready의 reason이 NodeStatusUnknown이면 보고 두절, 그 밖의 값이면 kubelet이 살아서 문제를 보고한 것입니다. Pod가 Running으로 보여도 nodeName의 노드가 Unknown이면 그 표시는 마지막 보고일 뿐입니다.
            </p>
            <p>
              복구 시간을 줄이는 손잡이는 Pod 쪽에 있습니다. 빨리 옮겨도 되는 stateless Pod에는 <code>tolerations</code>에 unreachable·not-ready NoExecute를 tolerationSeconds 30 정도로 적으면 Unknown 뒤 30초에 삭제가 시작됩니다.
            </p>
            <p>
              반대로 노드가 잠깐 분단되어도 Pod를 지우고 싶지 않다면 값을 늘립니다. 클러스터 전체 기본값은 API server의 <code>--default-unreachable-toleration-seconds</code>이며, kube-controller-manager의 <code>--node-monitor-grace-period</code>를 줄이는 것은 느린 연결을 오판할 위험과 맞바꾸는 일입니다.
            </p>
            <p>
              소스 주석은 HTTP/2 ping timeout 30초와 read idle 15초의 합보다 커야 한다고 적습니다.
            </p>
            <p>
              하나만 돌아야 하는 작업은 이 시계에 맡기지 않습니다. 분단된 노드의 컨테이너는 API server가 삭제를 요청한 뒤에도 돌고 있으므로, StatefulSet은 옛 Pod가 Terminating인 동안 대체 Pod를 만들지 않습니다. 운영자가 노드 전원이 꺼졌음을 확인한 뒤 Node 객체를 지우거나 Pod를 강제 삭제해야 합니다.
            </p>
            <p>
              노드를 계획적으로 비울 때는 <code>kubectl drain</code>이 cordon(NoSchedule)과 PodDisruptionBudget을 지키는 축출을 대신하며, 그 과정은 <a href="/cs/cloud/kubernetes-rollout-termination-pdb-drain-hpa#overview">종료·롤아웃·PDB·drain</a>에서 다룹니다.
            </p>
            <p>
              이 글의 시각은 v1.37.1 기본값을 더한 값이며 실제 클러스터를 돌려 잰 것이 아닙니다. 검사 주기 5초와 taint 패스의 rate limiter 때문에 실제 전환은 몇 초씩 늦을 수 있으며, 클라우드 관리형 클러스터는 기본값을 바꿔 두기도 합니다.
            </p>
            <p>
              노드에 도착한 Pod가 왜 Pending에 머물거나 CrashLoopBackOff에 빠지는지는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>로 이어지며, 노드가 Pod에 줄 수 있는 자원의 계산은 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">requests와 limits</a>에 있습니다.
            </p>
          </div>
          {code("toleration-defaults", "tolerationSeconds 바꾸는 자리")}
          {code("nlc-defaults", "grace를 줄일 때의 경고")}
          <ContentBoundary article="kubernetes-pod-to-node-scheduler-kubelet-notready" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 사례로 다음 시각을 예상해 보세요</h2>
          <div className={prose}>
            <p>Pod web-x에 unreachable:NoExecute toleration을 tolerationSeconds 30으로 적어 두었다면 kubelet 정지 뒤 몇 초쯤에 삭제가 시작될까요? not-ready 쪽 toleration은 기본값 그대로입니다. (답: 5절·6절)</p>
            <p>세 노드 중 worker-2와 worker-3이 동시에 꺼지면 두 노드의 Pod는 이 글의 시계대로 지워질까요? 셋 다 꺼지면 어떻게 달라질까요? NotReady 최소 3개 조건, --unhealthy-zone-threshold 0.55, --large-cluster-size-threshold 50으로 설명하세요. (답: 6절)</p>
            <p>worker-2의 kubelet이 Node status는 쓰지 못하지만 Lease 갱신은 계속하는 상태라면 컨트롤러는 Ready를 어떻게 적고, 그 노드에 새 Pod가 갈 수 있을까요? (답: 10절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={k8sPodNodeTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
