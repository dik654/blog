import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import TerminationRaceViz from "./kubernetes-rollout-termination-pdb-drain-hpa/viz/TerminationRaceViz";
import HpaCalculatorViz from "./kubernetes-rollout-termination-pdb-drain-hpa/viz/HpaCalculatorViz";
import { codeRefs } from "./kubernetes-rollout-termination-pdb-drain-hpa/codeRefs";
import { kubernetesRolloutTrees } from "./kubernetes-rollout-termination-pdb-drain-hpa/fileTree";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KubernetesRolloutTerminationPdbDrainHpaArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. 배포할 때마다 몇 초씩 5xx가 튀고, 노드 교체는 왜 멈추나요?</h2>
          <KubernetesSeriesLocator current="lifecycle" path={["lifecycle", "health", "network"]} question="Pod가 교체될 때 가용 개수와 요청 경로는 어떤 제어 장치가 함께 지킬까요?" />
          <div className={prose}>
            <p>
              (가정) checkout Deployment는 replicas 4로 Service 뒤에 있습니다. 이미지를 올릴 때마다 대시보드에 5xx가 몇 초 튀고, 어느 날 노드를 교체하려고 kubectl drain을 걸었더니 "Cannot evict pod as it would violate the pod's disruption budget"을 5초마다 찍으며 20분째 멈춰 있었습니다.</p>
            <p>그리고 트래픽이 빠진 뒤에도 HPA가 Pod 수를 5분 동안 줄이지 않았습니다. 세 장면은 서로 다른 기능처럼 보이지만 같은 질문 하나에 답합니다. Pod 하나가 사라질 때 트래픽과 가용 개수는 누가 어떻게 지키는가입니다.</p>
            <p>
              답을 먼저 적겠습니다. Pod 종료는 두 시계가 동시에 도는 일입니다. 노드의 kubelet은 preStop → SIGTERM → SIGKILL을 30초 예산 안에서 진행하고, 컨트롤 플레인은 같은 순간 EndpointSlice에서 그 Pod의 ready를 false로 바꿔 각 노드로 퍼뜨립니다.</p>
            <p>두 시계 사이의 틈이 5xx입니다. rollout·PDB·drain·HPA는 이 종료를 "한 번에 몇 개까지, 몇 개는 반드시 Ready로" 허용할지 정하는 네 개의 조절기이고, 모두 Ready인 Pod 수를 셉니다.</p>
            <p>
              이 글은 Kubernetes v1.37.1 원문으로 그 두 시계와 네 조절기를 따라갑니다. 요청이 Service를 거쳐 Pod에 닿는 패킷 경로는 <a href="/cs/cloud/kubernetes-network-packet-path#overview">Kubernetes 패킷 경로</a>에 이미 있으므로 반복하지 않고, 커널이 veth·netfilter 규칙을 어떻게 바꾸는지는 <a href="/cs/cloud/linux-network-interface-route-netfilter-dns#overview">패킷이 프로세스에 닿기까지</a>에서 봅니다. SIGTERM을 받은 PID 1이 왜 자식에게 신호를 넘기지 못하는지는 <a href="/cs/cloud/linux-process-signals-pid1-fds#overview">프로세스·신호·PID 1</a>이 담당합니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 네 조절기는 모두 "지금 Ready인 Pod가 몇 개인가"를 셉니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 네 상자입니다. Deployment 컨트롤러는 새 ReplicaSet을 키우고 옛 것을 줄이며 maxSurge·maxUnavailable로 한 번에 움직일 개수를 정합니다.</p>
            <p>PodDisruptionBudget(PDB)은 "최소 몇 개는 Ready여야 한다"를 적어 두고, Eviction API가 그 예산을 넘는 축출을 429로 거절합니다. kubectl drain은 노드의 Pod마다 Eviction을 호출하며 429를 받으면 기다렸다 다시 시도합니다. HPA는 15초마다 CPU 평균을 읽어 replicas를 다시 정합니다.</p>
            <p>
              네 상자가 공유하는 입력은 Pod의 Ready 조건 하나입니다. Deployment는 Ready가 된 새 Pod 수를 보고 옛 Pod를 줄이고, PDB는 Ready인 Pod만 건강하다고 세며, HPA는 Ready인 Pod의 지표만 평균에 넣습니다.</p>
            <p>그래서 readiness probe가 거짓말을 하면 네 조절기가 함께 틀립니다. 아직 요청을 못 받는 Pod가 Ready면 rollout이 너무 빨리 옛 Pod를 죽이고, 멀쩡한 Pod가 NotReady면 drain은 영원히 멈춥니다.</p>
            <p>
              이 글이 다루지 않는 것도 적어 둡니다. Deployment → ReplicaSet → Pod 소유 사슬과 reconcile 루프 자체는 <a href="/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview">컨트롤러는 목표 상태를 복구한다</a>에, readiness·liveness probe의 기본값과 재시작 폭풍은 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>에 있습니다. 여기서는 Pod가 "사라지는" 순간과 그 개수를 다루는 규칙만 봅니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. replicas 4에 25%면 롤아웃 중 최소 3개는 Ready, 최대 5개가 뜹니다</h2>
          <div className={prose}>
            <p>
              (가정) checkout은 replicas 4이고 strategy를 적지 않아 RollingUpdate에 maxSurge 25%, maxUnavailable 25%가 기본으로 들어갑니다. 퍼센트는 정수로 바뀌어야 하는데 두 값의 반올림 방향이 다릅니다. surge는 올림, unavailable은 내림입니다. 4 × 0.25 = 1이라 둘 다 1이고, 롤아웃 중 Pod는 최대 4 + 1 = 5개, Ready는 최소 4 − 1 = 3개입니다.
            </p>
            <p>
              replicas가 3이면 달라집니다. 3 × 0.25 = 0.75를 surge는 1로 올리고 unavailable은 0으로 내립니다. 롤아웃 중 최대 4개가 뜨고 3개는 늘 Ready여야 하므로 새 Pod 하나가 Ready가 돼야 옛 Pod 하나를 죽입니다. 둘 다 0으로 떨어지는 경우(replicas 1에 maxSurge 0%)에는 unavailable을 1로 강제해 롤아웃이 아예 멈추는 일을 막습니다.
            </p>
            <p>
              이 숫자가 1절의 5xx와 연결되는 지점은 "옛 Pod 하나를 죽인다"입니다. 컨트롤러는 새 Pod가 Ready가 되면 옛 Pod를 삭제하는데, 그 삭제 한 번이 4절의 두 시계를 출발시킵니다. maxUnavailable을 0으로 둬도 삭제 순간의 경쟁은 그대로이고, 줄어드는 것은 동시에 죽는 개수뿐입니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="25%가 정수가 되는 과정"
            question="replicas 4·3·10에서 롤아웃 중 최대 Pod 수와 최소 Ready 수는 각각 몇 개일까요?"
            scope="apps/v1 기본값 maxSurge 25%·maxUnavailable 25%를 deployment_util.go ResolveFenceposts(883–902행)에 넣습니다. surge는 올림(roundUp=true), unavailable은 내림입니다."
            steps={[
              { label: "replicas 4", expression: "ceil(4 × 0.25) · floor(4 × 0.25)", result: "surge 1 · unavailable 1", reason: "최대 5개, 최소 3개 Ready. 1절 사례의 숫자입니다." },
              { label: "replicas 3", expression: "ceil(0.75) · floor(0.75)", result: "surge 1 · unavailable 0", reason: "최대 4개, 3개는 늘 Ready. 새 Pod가 Ready여야 옛 Pod를 하나 죽입니다." },
              { label: "replicas 10", expression: "ceil(2.5) · floor(2.5)", result: "surge 3 · unavailable 2", reason: "최대 13개, 최소 8개 Ready. 문서의 'at least 75%, at most 125%' 범위 안입니다." },
              { label: "둘 다 0일 때", expression: "surge 0 && unavailable 0", result: "unavailable = 1", reason: "replicas 1에 maxSurge 0%를 주면 내림 때문에 0·0이 되므로 unavailable을 1로 강제합니다. quota 때문에 surge를 못 쓸 수 있다는 가정입니다." },
            ]}
            conclusion="같은 25%라도 surge는 넉넉히, unavailable은 인색하게 반올림합니다. 작은 replicas일수록 '새것이 Ready가 돼야 옛것을 죽인다'에 가까워집니다."
            caveats={["새 revision은 .spec.template이 바뀔 때만 생깁니다. replicas만 바꾸거나 HPA가 스케일하는 것은 rollout이 아닙니다.", "maxUnavailable 0이어도 옛 Pod 삭제 순간의 종료 경쟁은 그대로입니다."]}
          />
          {code("deploy-defaults", "Deployment 기본값 네 가지")}
          {code("deploy-fenceposts", "ResolveFenceposts 반올림 방향")}
        </section>

        <section id="termination-flow" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. Pod 삭제는 kubelet의 종료 시계와 컨트롤 플레인의 배수 시계를 동시에 출발시킵니다</h2>
          <div className={prose}>
            <p>
              옛 Pod 하나가 삭제될 때 일어나는 일을 시간순으로 적습니다. API 서버는 Pod에 deletionTimestamp와 예산(기본 30초)을 기록합니다. 노드의 kubelet은 그것을 보자마자 종료를 시작합니다.</p>
            <p>컨테이너에 preStop 훅이 있으면 먼저 실행하고, 그다음 컨테이너 런타임에 "PID 1에 SIGTERM을 보내고 남은 예산만큼 기다린 뒤 SIGKILL하라"고 요청합니다. 예산이 끝나면 남은 프로세스는 SIGKILL로 죽고 Pod 객체가 지워집니다.</p>
            <p>
              같은 순간 컨트롤 플레인도 움직입니다. EndpointSlice 컨트롤러는 deletionTimestamp가 생긴 Pod의 endpoint에 terminating: true를 적고 ready를 false로 바꿉니다.</p>
            <p>각 노드의 kube-proxy와 외부 로드밸런서가 그 변경을 받아 자기 규칙에서 이 Pod를 빼는 데는 시간이 걸리고, 그 시간은 Kubernetes가 보장하지 않습니다. 종료 중인 endpoint는 바로 지워지지 않고 serving(실제 Ready 여부)과 terminating 두 조건으로 남아, 모든 endpoint가 종료 중일 때만 트래픽을 받습니다.</p>
            <p>
              이름을 붙이면 이렇습니다. 30초 예산이 terminationGracePeriodSeconds, 종료 직전 컨테이너 안에서 도는 명령이 preStop 훅, 런타임이 보내는 두 신호가 SIGTERM과 SIGKILL, 컨트롤 플레인이 바꾸는 세 조건이 EndpointSlice의 ready·serving·terminating입니다. 예산은 SIGTERM 뒤의 시간이 아니라 preStop부터 SIGKILL까지의 총액이라는 점이 다음 절의 계산을 정합니다.
            </p>
          </div>
          <TerminationRaceViz />
          {code("pod-grace-default", "terminationGracePeriodSeconds 기본 30")}
          {code("eps-conditions", "ready = serving && !terminating")}
          <div id="paper-termination" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Pod Lifecycle · Termination of Pods (website main, 2026-10-17 확인)" citeKey={1} href="https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination">
              <q>At the same time as the kubelet is starting graceful shutdown of the Pod, the control plane evaluates whether to remove that shutting-down Pod from EndpointSlice objects</q> 같은 절은 preStop이 예산을 넘기면 "a small, one-off grace period extension of 2 seconds"를 주고, 종료 중인 endpoint는 바로 지워지지 않으며 ready가 늘 false(1.26 이전 호환)라고 적습니다. EndpointSlice 문서는 serving·terminating 조건을 v1.26 stable로 표시합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="race-and-budget" data-teach-level="2" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. preStop은 전파 시간을 벌고, 그만큼 SIGTERM 뒤 예산이 줄어듭니다</h2>
          <div className={prose}>
            <p>
              1절의 5xx는 두 시계의 틈입니다. SIGTERM을 받자마자 리스너를 닫는 앱은 규칙이 아직 바뀌지 않은 노드에서 온 새 연결을 거절합니다. 흔한 완화는 둘입니다. preStop에 짧은 sleep을 두어 규칙 전파가 끝날 때까지 SIGTERM을 늦추고, 앱은 SIGTERM을 받은 뒤 새 연결을 받지 않되 진행 중인 요청은 끝내고 종료합니다. sleep 길이는 클러스터의 전파 지연을 재서 정해야 하며 이 글에서는 (가정) 5초로 둡니다.
            </p>
            <p>
              preStop은 공짜가 아닙니다. kubelet은 preStop에 걸린 초를 예산에서 빼고 남은 값으로 StopContainer를 부릅니다. 예산 30초에 preStop 5초면 SIGTERM 뒤 앱이 쓸 수 있는 시간은 25초입니다. preStop이 예산을 다 쓰면 최소 2초는 남겨 SIGKILL이 바로 가는 일을 막습니다. 문서의 "2초 일회 연장"이 코드에서는 minimumGracePeriodInSeconds = 2라는 하한입니다.
            </p>
            <p>
              그래서 예산은 세 몫의 합으로 정해야 합니다. 전파를 기다리는 preStop, 진행 중 요청을 끝내는 앱 종료 시간, 그리고 여유입니다. 긴 요청(파일 업로드, 배치)이 있는 서비스에서 기본 30초는 앱 종료 몫이 모자라 매번 SIGKILL로 끝나고, 그 흔적은 Pod 이벤트에 남지 않아 알아채기 어렵습니다.</p>
            <p>반대로 PID 1이 sh 래퍼라 SIGTERM을 자식에 넘기지 않으면 앱은 신호를 못 받은 채 예산이 끝나 SIGKILL로 죽고, 종료가 늘 30초 걸립니다.</p>
          </div>
          <CalculationWalkthrough
            title="30초 예산이 어떻게 나뉘는가"
            question="preStop sleep 5초, 가장 긴 요청 12초인 checkout에서 기본 예산 30초는 충분할까요?"
            scope="kubelet killContainer(kuberuntime_container.go 882–915행)의 순서를 따릅니다. 규칙 전파 3초와 요청 길이 12초는 가정입니다."
            steps={[
              { label: "예산", expression: "terminationGracePeriodSeconds", result: "30 s", reason: "spec에 없으면 기본값입니다. kubectl delete --grace-period가 있으면 그 값으로 덮입니다." },
              { label: "preStop", expression: "30 − 5", result: "25 s 남음", reason: "preStop에 실제로 걸린 초를 뺍니다. 전파 3초보다 길게 두어 SIGTERM 전에 새 연결이 끊기게 합니다." },
              { label: "앱 종료", expression: "25 ≥ 12 + 여유", result: "충분", reason: "SIGTERM 뒤 진행 중인 가장 긴 요청 12초를 끝내고도 13초가 남습니다." },
              { label: "preStop이 길면", expression: "max(30 − 30, 2)", result: "2 s", reason: "preStop sleep 60이면 30초 뒤 기다리기를 멈추고 최소 2초만 남깁니다. 앱은 SIGTERM 2초 뒤 SIGKILL됩니다." },
            ]}
            conclusion="예산 = preStop + 앱 종료 + 여유로 정합니다. 가장 긴 요청이 25초를 넘는 서비스는 terminationGracePeriodSeconds를 올려야 하고, preStop을 늘릴 때는 같은 양만큼 예산도 늘려야 합니다."
            caveats={["liveness·startup probe 실패로 죽는 경우에는 probe에 적은 terminationGracePeriodSeconds가 따로 쓰입니다.", "sidecar 컨테이너(restartPolicy: Always인 init 컨테이너)는 주 컨테이너가 다 끝난 뒤에야 SIGTERM을 받습니다."]}
          />
          {code("kubelet-prestop", "preStop 실행과 걸린 시간")}
          {code("kubelet-min-grace", "최소 2초")}
        </section>

        <section id="kubelet-source" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 원문은 예산을 고르고, preStop에 쓴 만큼 빼고, 2초를 보장한 뒤 런타임에 넘깁니다</h2>
          <div className={prose}>
            <p>
              Kubernetes v1.37.1 pkg/kubelet/kuberuntime/kuberuntime_container.go의 killContainer(864행)가 컨테이너 하나를 끝냅니다. 882행 setTerminationGracePeriod가 예산의 출처를 고릅니다.</p>
            <p>삭제 요청에 적힌 DeletionGracePeriodSeconds가 있으면 그것(1426행), liveness·startup probe 때문에 죽이는 경우 probe의 값(1428~1438행), 아니면 spec의 terminationGracePeriodSeconds(1439행)입니다. checkout은 spec에 없으니 30입니다.</p>
            <p>
              896~898행이 preStop입니다. 훅이 있고 예산이 남았으면 executePreStopHook(784행)을 부르고 돌아온 초를 뺍니다. executePreStopHook은 훅을 goroutine에서 돌리고 801~807행의 select에서 예산 초가 먼저 지나면 "PreStop hook not completed in grace period"를 남긴 채 돌아갑니다. 돌려주는 값은 810행의 실제 경과 초라, sleep 5면 5가 빠져 25가 됩니다.
            </p>
            <p>
              908~910행이 하한입니다. 남은 예산이 minimumGracePeriodInSeconds(kuberuntime_manager.go 84행, 2)보다 작으면 2로 올립니다.</p>
            <p>915행이 runtimeService.StopContainer(containerID, gracePeriod)로 런타임에 넘기고, 런타임이 PID 1에 SIGTERM을 보낸 뒤 그 초만큼 기다렸다가 SIGKILL합니다. 컨테이너가 받는 신호가 왜 PID 1에만 가는지, 그 PID 1이 sh면 무슨 일이 생기는지는 <a href="/cs/cloud/linux-process-signals-pid1-fds#overview">프로세스·신호·PID 1</a>에서 봅니다.</p>
            <p>EndpointSlice 쪽은 staging/src/k8s.io/endpointslice/utils.go podToEndpoint(38행) 세 줄입니다.</p>
            <p>serving은 Pod의 Ready 조건, terminating은 deletionTimestamp 유무, ready는 publishNotReadyAddresses이거나 (serving && !terminating)입니다. 삭제 요청 직후 컨테이너가 멀쩡히 응답하고 있어도 ready는 false가 되고, 그 변경이 각 노드에 닿는 시간이 5절의 경쟁 구간입니다.</p>
          </div>
          {code("kubelet-kill-container", "killContainer 원문")}
          {code("kubelet-grace-source", "예산의 출처 세 갈래")}
        </section>

        <section id="rollout-progress" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. 롤아웃이 600초 동안 멈추면 조건만 바뀌고 되돌아가지는 않습니다</h2>
          <div className={prose}>
            <p>
              3절의 숫자대로 새 ReplicaSet이 자라고 옛 것이 줄어드는 동안 Deployment는 Progressing 조건을 갱신합니다. 새 Pod가 Ready가 되지 못해 progressDeadlineSeconds(기본 600초) 동안 진전이 없으면 Progressing=False, reason ProgressDeadlineExceeded가 붙습니다.</p>
            <p>문서가 못 박듯 Kubernetes는 이 조건을 다는 것 말고는 아무것도 하지 않습니다. 롤백은 사람이나 상위 도구가 kubectl rollout undo로 합니다.</p>
            <p>
              이때 상태는 "새 Pod 몇 개가 CrashLoopBackOff, 옛 Pod는 maxUnavailable만큼만 줄어든 채 멈춤"입니다. replicas 4라면 새 1개가 실패하고 옛 3개가 살아 있어 서비스는 75%로 돕니다. 자동 롤백이 없다는 사실이 maxUnavailable을 작게 두는 이유이고, 롤백할 revision이 있으려면 revisionHistoryLimit(기본 10)이 0이 아니어야 합니다.
            </p>
            <p>
              새 revision은 .spec.template이 바뀔 때만 생깁니다. ConfigMap을 고쳐도 Pod는 재시작되지 않고 template의 환경변수·볼륨 정의가 그대로라 rollout도 없습니다. 설정 변경을 배포로 만들려면 template 주석에 설정 해시를 넣거나 kubectl rollout restart로 template을 건드려야 합니다. 이 글이 다루는 종료 경쟁은 그 restart에서도 똑같이 일어납니다.
            </p>
          </div>
          <div id="paper-progress-deadline" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Deployments · Failed Deployment (website main, 2026-10-17 확인)" citeKey={2} href="https://kubernetes.io/docs/concepts/workloads/controllers/deployment/#failed-deployment">
              <q>Kubernetes takes no action on a stalled Deployment other than to report a status condition with reason: ProgressDeadlineExceeded.</q> 같은 문서는 새 rollout이 .spec.template이 바뀔 때만 일어나고, 기본 25%로 "at least 75% of the desired number of Pods are up" "at most 125%"라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="pdb-drain" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. PDB는 Eviction API만 막고, drain은 429를 받으면 5초마다 다시 묻습니다</h2>
          <div className={prose}>
            <p>
              1절의 멈춘 drain으로 갑니다. (가정) checkout에 minAvailable: 3인 PDB가 있습니다. PDB 컨트롤러는 Ready이고 삭제 중이 아닌 Pod를 세어 currentHealthy를 구하고, desiredHealthy 3을 빼 DisruptionsAllowed를 status에 적습니다. 4개가 Ready면 1입니다.</p>
            <p>kubectl drain은 노드의 Pod마다 Eviction 하위 자원을 호출하고, API 서버는 DisruptionsAllowed가 0이면 429 Too Many Requests "Cannot evict pod as it would violate the pod's disruption budget"으로 거절합니다.</p>
            <p>
              첫 Pod는 축출됩니다. 그 Pod가 삭제되는 동안 currentHealthy는 3이라 DisruptionsAllowed가 0이고, 같은 노드의 두 번째 checkout Pod에 대한 Eviction은 429입니다. drain은 그 429를 받으면 5초 자고 다시 묻습니다.</p>
            <p>정상이라면 ReplicaSet이 다른 노드에 새 Pod를 만들고 그것이 Ready가 되어 currentHealthy가 4로 돌아오면 다음 축출이 허용됩니다. 1절의 20분은 새 Pod가 Ready가 되지 못한 경우입니다. 이미지 pull 실패든 readiness probe 실패든, Ready가 안 늘면 429만 반복되고 drain의 기본 timeout은 무한입니다.</p>
            <p>
              운영에서 더 자주 발목을 잡는 쪽은 PDB가 무엇을 막지 못하는가입니다. 문서가 적듯 Deployment나 Pod를 직접 지우는 것은 PDB를 거치지 않습니다. 노드가 죽는 비자발적 장애도 막지 못하고 예산에만 계산됩니다.</p>
            <p>Deployment의 롤링 업데이트도 PDB의 제한을 받지 않고 maxUnavailable이 담당합니다. PDB가 지키는 것은 Eviction API를 통한 축출, 곧 drain·클러스터 오토스케일러·descheduler 같은 "예의 바른" 삭제뿐입니다.</p>
            <p>아래 의사코드는 drain.go evictPods(284행)와 eviction.go checkAndDecrement(425행)를 합쳐 Pod 하나의 축출 루프를 펼친 것입니다.</p>
          </div>
          <AlgorithmBlock
            title="kubectl drain이 Pod 하나를 축출하는 루프 (Pod마다 goroutine)"
            input={[
              "pod: checkout-7c9d-2 (worker-a), PDB minAvailable 3, replicas 4",
              "EvictErrorRetryDelay = 5 s, Timeout = 0 (무한)",
              "PDB.status: currentHealthy 4, desiredHealthy 3, DisruptionsAllowed 1",
            ]}
            steps={[
              { code: "POST pods/checkout-7c9d-2/eviction", note: "Eviction 하위 자원에 요청합니다. DELETE pods/…와 달리 PDB 검사를 거칩니다." },
              { code: "api: if pdb.observedGeneration < pdb.generation: 429", note: "PDB를 방금 고쳐 컨트롤러가 아직 status를 못 맞췄으면 그 자체로 429입니다." },
              { code: "api: if pdb.DisruptionsAllowed == 0: 429 'would violate the pod's disruption budget'", note: "첫 Pod 때는 1이라 통과합니다. 두 번째 Pod 때는 첫 Pod가 삭제 중이라 currentHealthy 3, Allowed 0으로 429입니다." },
              { code: "api: DisruptionsAllowed -= 1; DisruptedPods[pod] = now; delete pod (grace 30 s)", note: "허용되면 예산을 하나 쓰고 Pod를 지웁니다. 4절의 두 시계가 출발합니다. DisruptedPods는 2분 동안 그 Pod를 건강 수에서 빼 같은 예산을 두 번 쓰지 못하게 합니다." },
              { code: "drain: if 429: print 'will retry after 5s'; sleep 5; goto 1", note: "1절의 화면입니다. 새 Pod가 Ready가 되어 PDB 컨트롤러가 Allowed를 1로 올릴 때까지 반복합니다." },
              { code: "drain: if 200: waitForDelete(pod)", note: "Pod 객체가 사라질 때까지 기다립니다. terminationGracePeriodSeconds가 길면 여기서도 시간이 갑니다." },
            ]}
            repeatUntil="노드의 모든 대상 Pod가 삭제되면 drain이 끝나고, 그 전에 --timeout이 있으면 그 시각에 실패로 끝납니다."
            output="새 Pod가 Ready가 되지 못하면 429가 영원히 반복됩니다. 해결은 PDB를 늦추는 것이 아니라 새 Pod가 Ready가 못 되는 이유(이미지·probe·자원)를 고치는 것입니다."
          />
          {code("pdb-expected", "desiredHealthy 계산")}
          {code("pdb-healthy", "currentHealthy 계산")}
          {code("eviction-429", "429를 돌려주는 조건")}
          {code("drain-retry", "drain의 재시도 루프")}
          <div id="paper-pdb-bypass" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Disruptions · Pod disruption budgets (website main, 2026-10-17 확인)" citeKey={3} href="https://kubernetes.io/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets">
              <q>deleting deployments or pods bypasses Pod Disruption Budgets.</q> 같은 문서는 비자발적 장애는 PDB로 막을 수 없지만 예산에는 계산되고, Deployment·StatefulSet의 롤링 업데이트는 PDB의 제한을 받지 않는다고 적습니다. API-initiated Eviction 문서는 429와 500의 뜻, 새 Pod가 Ready가 안 되어 축출이 멈추는 경우를 설명합니다.
            </CitationBlock>
          </div>
        </section>

        <section id="hpa" data-teach-level="6" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. HPA는 ready Pod의 평균 ÷ 목표를 올림하고, 축소는 5분 창의 최댓값으로 늦춥니다</h2>
          <div className={prose}>
            <p>
              마지막 조절기입니다. (가정) checkout의 HPA는 CPU 평균 사용률 50%를 목표로 하고 컨테이너의 CPU request는 500m입니다. 15초마다 컨트롤러가 metrics-server에서 Pod별 CPU를 읽어 request 대비 비율을 내고, 그 평균을 목표로 나눈 값이 usageRatio입니다.</p>
            <p>네 Pod가 400m(80%)씩 쓰면 ratio는 1.6이고, 문서의 식 ceil(current × ratio)대로 ceil(4 × 1.6) = 7로 늘립니다.</p>
            <p>
              코드는 문서보다 조심스럽습니다. 평균에 넣는 것은 Ready이고 지표가 있는 Pod뿐이고, 곱하는 수도 currentReplicas가 아니라 readyPodCount입니다. ratio가 0.9~1.1 안이면(tolerance 0.1) 아무것도 하지 않습니다.</p>
            <p>아직 Ready가 아닌 Pod가 있는데 확대 방향이면 그 Pod를 0%로 넣어 다시 계산하고, 지표가 없는 Pod는 축소 때 100%, 확대 때 0%로 넣습니다. 다시 계산한 비율이 tolerance 안이거나 방향이 뒤집히면 스케일하지 않습니다. 방금 뜬 Pod 때문에 또 늘리거나, 지표가 빠진 Pod 때문에 과감히 줄이는 일을 막는 장치입니다.</p>
            <p>
              축소에는 한 겹 더 있습니다. 컨트롤러는 최근 5분(downscale stabilization) 동안의 권고값을 기억하고 그 최댓값을 씁니다. 부하가 빠져 이번 계산이 3이어도 2분 전 권고가 7이면 7에 머뭅니다. 1절에서 "HPA가 5분 동안 줄이지 않았다"는 이 창입니다. behavior를 적지 않으면 확대는 15초마다 max(4개, 100%), 축소는 15초마다 100%이고 축소 창만 플래그 5분을 따릅니다.
            </p>
            <p>분모가 requests라는 점이 가장 흔한 실패를 만듭니다. 컨테이너에 CPU request가 없으면 비율을 만들 수 없어 HPA는 FailedGetResourceMetric 조건만 남기고 멈춥니다. requests가 Allocatable·QoS·eviction에서 어떤 역할을 하는지는 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">요청한 자원과 실제 할당</a>에서 봅니다.</p>
          </div>
          <ExplainedFormula
            question="HPA는 다음 replicas를 몇 개로 정합니까?"
            idea="Ready인 Pod들의 사용률 평균을 목표로 나눈 비율이 1에서 0.1 넘게 벗어나면, 그 비율을 Ready Pod 수에 곱해 올림합니다."
            formula={"\\text{desired}=\\left\\lceil \\frac{\\overline{\\text{usage}}/\\text{request}}{\\text{target}}\\times\\text{readyPods}\\right\\rceil"}
            annotatedFormula={"\\text{desired}=\\left\\lceil \\underbrace{\\frac{\\overline{\\text{usage}}/\\text{request}}{\\text{target}}}_{\\text{usageRatio, } 0.9\\sim1.1\\text{이면 유지}}\\times\\underbrace{\\text{readyPods}}_{\\text{current가 아님}}\\right\\rceil"}
            operations={[
              { expression: "\\overline{\\text{usage}}/\\text{request}", annotation: ["네 Pod 400m ÷ 500m = 80%입니다.", "Ready가 아니거나 지표가 없는 Pod는 평균에서 뺍니다."] },
              { expression: "\\div\\ \\text{target}", annotation: ["80% ÷ 50% = 1.6입니다.", "0.9 ≤ ratio ≤ 1.1이면 current를 그대로 돌려줍니다."] },
              { expression: "\\lceil\\ \\cdot\\times\\text{readyPods}\\ \\rceil", annotation: ["ceil(1.6 × 4) = 7입니다.", "unready·missing이 있으면 0% 또는 100%로 채워 다시 계산한 뒤 len(metrics)에 곱합니다."] },
            ]}
            terms={[
              { symbol: "\\overline{\\text{usage}}", name: "Ready Pod의 평균 CPU 사용량", description: "metrics-server가 준 Pod별 값의 평균입니다. 뜬 지 5분 안이고 지표가 흔들리는 Pod, Ready 뒤 30초 안의 Pod는 뺍니다." },
              { symbol: "\\text{request}", name: "컨테이너 CPU request", description: "Utilization 목표의 분모입니다. 없으면 계산 자체가 실패합니다." },
              { symbol: "\\text{target}", name: "목표 평균 사용률", description: "HPA spec의 averageUtilization입니다. 50%." },
              { symbol: "\\text{readyPods}", name: "Ready이고 지표가 있는 Pod 수", description: "replica_calculator.go 118행이 곱하는 값입니다. 문서의 currentReplicas와 다릅니다." },
            ]}
            assumptions={["request 500m, 목표 50%, 사용률 값은 가정입니다.", "축소 결과에는 5분 안정화 창의 최댓값이 한 번 더 적용됩니다."]}
            interpretation="같은 80%라도 Ready가 아닌 Pod가 둘 있으면 그 둘을 0%로 넣어 비율이 tolerance 안으로 들어올 수 있습니다. HPA는 '모르는 Pod'를 늘 스케일을 줄이는 쪽으로 가정합니다."
          />
          <HpaCalculatorViz />
          {code("hpa-tolerance", "tolerance 0.9~1.1")}
          {code("hpa-replicas", "GetResourceReplicas 원문")}
          {code("hpa-defaults", "컨트롤러 기본값 다섯 가지")}
          {code("hpa-v2-behavior", "behavior 기본 규칙")}
          {code("hpa-stabilize", "5분 창의 최댓값")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 종료 예산은 세 몫의 합, PDB는 Eviction만, HPA는 request부터입니다</h2>
          <div className={prose}>
            <p>
              종료부터 고칩니다. terminationGracePeriodSeconds는 preStop 길이 + 가장 긴 요청 + 여유로 정하고, preStop sleep은 클러스터의 EndpointSlice 전파 지연을 재서 정합니다. 앱은 SIGTERM을 받으면 리스너를 닫되 진행 중인 요청은 끝내고, PID 1이 앱 자체이거나 신호를 넘기는 init이어야 합니다. 배포 중 5xx가 사라졌는지는 롤아웃 동안의 5xx 비율로 확인합니다.
            </p>
            <p>
              PDB는 Eviction 경로만 지킨다는 전제로 씁니다. replicas 1인 워크로드에 minAvailable 1을 주면 drain이 영원히 멈추므로 주지 않거나 maxUnavailable 1로 둡니다. drain이 멈추면 PDB를 풀 것이 아니라 새 Pod가 Ready가 못 되는 이유를 고칩니다. 노드 장애·직접 삭제·롤링 업데이트는 PDB와 무관하므로 그쪽 가용성은 maxUnavailable과 replicas 수가 지킵니다.
            </p>
            <p>
              HPA는 request가 있어야 움직입니다. 목표 사용률은 request 대비이므로 request를 실제보다 낮게 적으면 HPA는 늘 "과부하"로 보고 Pod를 늘립니다. 급격한 트래픽에는 확대 behavior를, 비용에는 축소 창을 조정하되 창을 0으로 두면 flapping이 돌아옵니다.</p>
            <p>rollout·PDB·HPA가 모두 Ready를 센다는 사실을 기억하면, readiness probe가 "요청을 받을 수 있다"를 정직하게 말하는지가 세 조절기의 공통 전제가 됩니다.</p>
            <p>이 글의 수치는 v1.37.1 기본값과 가정한 사례로 손으로 계산한 것이며 실제 클러스터에서 잰 것이 아닙니다. 전파 지연, 이미지 pull 시간, metrics-server의 수집 주기는 환경마다 다릅니다. 이 조절기들을 SLO·에러 예산·업그레이드 순서와 잇는 운영 관점은 <a href="/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview">SRE 관점의 Kubernetes</a>에서 이어집니다.</p>
          </div>
          <ContentBoundary article="kubernetes-rollout-termination-pdb-drain-hpa" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 같은 사례로 다음 경계를 예상해 보세요</h2>
          <div className={prose}>
            <p>checkout의 preStop을 sleep 20으로 늘리고 terminationGracePeriodSeconds는 30 그대로 두면 SIGTERM 뒤 앱이 쓸 수 있는 시간은 몇 초이고, 가장 긴 요청 12초는 안전할까요? (답: 5절)</p>
            <p>replicas 4, minAvailable 3인 checkout이 두 노드에 2개씩 있을 때 두 노드를 동시에 drain하면 Eviction은 몇 개가 바로 허용되고 나머지는 어떤 응답을 받을까요? (답: 8절)</p>
            <p>HPA가 replicas를 3에서 5로 늘린 직후 새 Pod 둘이 아직 Ready가 아닌데 기존 셋이 90%를 쓰고 있습니다. ratio 1.8인데도 더 늘리지 않는 이유는 무엇일까요? (답: 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={kubernetesRolloutTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
