import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import ReconcileRolloutViz from "./kubernetes-controllers-reconcile-deployment-job/viz/ReconcileRolloutViz";
import { codeRefs } from "./kubernetes-controllers-reconcile-deployment-job/codeRefs";
import { k8sControllerTrees } from "./kubernetes-controllers-reconcile-deployment-job/fileTree";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KubernetesControllersReconcileDeploymentJobArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. Pod를 지웠는데 왜 다른 이름으로 돌아오고, 롤아웃은 왜 네 개까지만 늘어나나요?</h2>
          <KubernetesSeriesLocator current="controllers" path={["request", "resource", "controllers"]} question="API에 적은 replicas와 실제 Pod 수의 차이는 어느 실행 로직이 줄일까요?" />
          <div className={prose}>
            <p>
              replicas 3인 Deployment <code>web</code>에서 Pod 하나를 <code>kubectl delete</code>로 지웠습니다. 몇 초 뒤 Pod는 셋으로 돌아왔는데 이름 끝 다섯 글자가 달라져 있었습니다. 같은 날 image를 v2로 바꾸자 Pod가 잠깐 넷이 되었다가 다시 셋이 되었으며, <code>kubectl get rs</code>에는 ReplicaSet이 두 개 보였습니다. 두 장면은 같은 질문 하나에서 갈립니다. Deployment는 Pod를 직접 만들까요?
            </p>
            <p>
              답을 먼저 적겠습니다. Deployment는 Pod를 만들지 않습니다. Deployment 컨트롤러는 Pod template 한 벌마다 ReplicaSet 하나를 만들어 두 ReplicaSet의 replicas 숫자만 조절합니다. ReplicaSet 컨트롤러는 자기가 소유한 활성 Pod 수에서 spec.replicas를 뺀 차이 하나만 봅니다.
            </p>
            <p>
              음수면 template으로 새 Pod를 만들며 양수면 덜 준비된 Pod부터 지웁니다. 새 Pod는 새 이름과 새 UID를 받으므로 지운 Pod가 돌아온 것이 아니라 다른 Pod가 생긴 것이고, 롤아웃 중 네 개가 된 것은 maxSurge 25%를 올림한 1 때문입니다.
            </p>
            <p>
              이 글은 "Deployment·Job이 Pod를 만드는 방식"과 "Controller가 목표 상태를 계속 복구한다는 개념"을 kubernetes v1.37.1 원문으로 끝까지 따라갑니다. Pod가 어느 노드에 가서 어떻게 뜨는지는 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 Node에 가는 길</a>에서, 시리즈 전체 지도는 <a href="/cs/cloud/kubernetes-concept-map#overview">Kubernetes 개념 지도</a>에서 이어집니다.
            </p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. 세 층이 각자 한 가지 숫자만 맞춥니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 Deployment 하나에 세 층이 있습니다. 맨 위 Deployment는 "어떤 Pod template을 몇 개"라는 목표를 들고 있습니다. 가운데 ReplicaSet은 template 한 벌과 개수 하나를 들고 그 개수를 맞춥니다.
            </p>
            <p>
              맨 아래 Pod는 노드 위에서 실제로 돌아가는 컨테이너 묶음입니다. 각 층의 객체는 자기를 만든 상위 객체를 <code>metadata.ownerReferences</code>에 적어 두며, 상위 객체는 label selector로 하위 객체를 찾습니다.
            </p>
            <p>
              각 층을 움직이는 것은 kube-controller-manager 안의 컨트롤러 둘입니다. Deployment 컨트롤러는 template이 바뀌었는지, 두 ReplicaSet 사이 Pod 배분이 상한과 하한 안에 있는지만 봅니다.
            </p>
            <p>
              ReplicaSet 컨트롤러는 Pod 수만 봅니다. 어느 쪽도 "무슨 사건이 일어났나"를 기억하지 않은 채 매번 "지금 상태가 목표와 같은가"를 다시 셉니다. Kubernetes 문서는 이 모양을 방 온도를 맞추는 온도조절기에 비유합니다.
            </p>
            <p>
              Job은 세 층이 아니라 두 층입니다. Job 컨트롤러가 Pod를 직접 만들며, "성공 횟수가 completions에 닿는 것"이 목표 상태입니다. 실패한 Pod는 10초부터 두 배씩 늦춰 다시 만들다가 실패 수가 backoffLimit을 넘으면 Job 자체를 실패로 적습니다. Pod 하나가 노드에서 어떻게 시작되고 CrashLoopBackOff가 어떻게 세어지는지는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>가 맡습니다.
            </p>
          </div>
        </section>

        <section id="small-case" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. replicas 3이면 롤아웃 중 Pod는 최대 4개, 가용 Pod는 최소 3개입니다</h2>
          <div className={prose}>
            <p>
              (가정) Deployment <code>web</code>은 replicas 3, strategy는 기본 RollingUpdate이고 maxSurge·maxUnavailable을 적지 않았습니다. API server는 비워 둔 두 값을 25%로 채웁니다. 3의 25%는 0.75개입니다. Pod는 0.75개가 될 수 없으니 컨트롤러는 두 값을 서로 반대 방향으로 반올림합니다. surge는 올려 1, unavailable은 내려 0입니다.
            </p>
            <p>
              그래서 롤아웃 내내 두 선이 유지됩니다. 전체 Pod는 3 + 1 = 4를 넘지 못하며, 가용 Pod는 3 − 0 = 3 아래로 내려가지 못합니다. Pod가 잠깐 넷이 된 장면이 이 상한이고, 옛 Pod가 하나 사라질 때마다 새 Pod가 먼저 Ready여야 했던 이유가 이 하한입니다.
            </p>
            <p>
              Pod 하나를 지운 장면은 더 단순합니다. ReplicaSet <code>web-5c6d</code>가 소유한 활성 Pod는 2, spec.replicas는 3이므로 차이는 −1입니다. ReplicaSet 컨트롤러는 template으로 Pod 하나를 만들어 이름 뒤에 새 난수를 붙입니다. 지운 Pod의 이름을 기억해 되살리는 코드는 어디에도 없습니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="25%가 1과 0이 되는 과정"
            question="replicas 3인 Deployment를 롤아웃하면 Pod는 최대 몇 개, 가용 Pod는 최소 몇 개일까요?"
            scope="pkg/apis/apps/v1/defaults.go의 기본값 25%와 pkg/controller/deployment/util/deployment_util.go의 ResolveFenceposts를 replicas 3·10에 적용합니다."
            steps={[
              { label: "maxSurge", expression: "ceil(3 × 0.25)", result: "1", reason: "GetScaledValueFromIntOrPercent의 마지막 인자 true는 올림입니다. 0.75 → 1." },
              { label: "maxUnavailable", expression: "floor(3 × 0.25)", result: "0", reason: "같은 함수에 false를 주면 내림입니다. 0.75 → 0." },
              { label: "전체 상한", expression: "3 + 1", result: "4 Pod", reason: "새 ReplicaSet은 전체가 이 수를 넘지 않는 범위에서만 늘어납니다." },
              { label: "가용 하한", expression: "3 − 0", result: "3 Pod", reason: "옛 ReplicaSet은 가용 Pod가 이 수 아래로 내려가지 않는 범위에서만 줄어듭니다." },
              { label: "replicas 10이면", expression: "ceil(2.5) · floor(2.5)", result: "3 · 2", reason: "상한 13, 하한 8. rolling.go 주석의 예시가 이 숫자를 씁니다." },
            ]}
            conclusion="replicas 3에서는 한 번에 Pod 하나씩만 교체되고, 그마저 새 Pod가 Ready가 된 뒤에야 옛 Pod가 사라집니다. replicas 10이면 세 개씩 늘고 두 개씩 줄어 더 빠릅니다."
            caveats={["둘 다 0으로 떨어지면 아무것도 움직일 수 없어 컨트롤러가 unavailable을 1로 강제합니다. replicas 1에 maxSurge 0을 적으면 롤아웃 중 서비스가 잠깐 끊기는 이유입니다.", "surge Pod를 만들 ResourceQuota 여유가 없으면 상한은 있어도 새 Pod가 생성되지 않아 롤아웃이 멈춥니다."]}
          />
          {code("apps-defaults", "기본값 25% · 10 · 600")}
          {code("fenceposts", "ResolveFenceposts 올림·내림")}
        </section>

        <section id="rollout-steps" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. 롤아웃은 옛 3과 새 0에서 한 칸씩 옮겨 옛 0과 새 3에 닿는 사다리입니다</h2>
          <div className={prose}>
            <p>
              image를 v2로 바꾸면 Deployment 컨트롤러는 새 template의 해시를 계산한 뒤, 그 해시를 가진 ReplicaSet이 없으면 replicas 0으로 하나 만듭니다.
            </p>
            <p>
              이름은 <code>web-7d4f8c9b</code>처럼 Deployment 이름에 해시를 붙인 것이며, Pod template과 selector에 <code>pod-template-hash</code> 라벨이 함께 들어갑니다. 이 라벨 덕분에 두 ReplicaSet은 같은 <code>app=web</code> Pod 사이에서 자기 세대만 고릅니다.
            </p>
            <p>
              그다음부터는 reconcile 한 번에 한 방향만 움직입니다. 먼저 새 ReplicaSet을 늘릴 수 있는지 봅니다. 전체 3이 상한 4보다 작으니 1로 올립니다. 늘렸으면 이번 reconcile은 거기서 끝나며, 컨트롤러는 새 Pod가 Ready가 되는 사건을 기다립니다. 새 Pod가 Ready가 되면 다시 들어와 늘릴 수 없음을 확인하고(전체 4 = 상한), 옛 ReplicaSet을 줄일 수 있는지 봅니다.
            </p>
            <p>
              줄일 수 있는 수는 전체 Pod 수 − 가용 하한 − 새 ReplicaSet의 미가용 Pod 수입니다. 새 Pod가 아직 Ready가 아니었을 때는 4 − 3 − 1 = 0이라 옛 Pod를 하나도 못 줄였지만, Ready가 된 뒤에는 4 − 3 − 0 = 1이라 하나를 줄입니다.
            </p>
            <p>
              이 두 걸음이 반복되어 (옛/새) 3/0 → 3/1 → 2/1 → 2/2 → 1/2 → 1/3 → 0/3으로 내려갑니다. 아래 그림이 그 일곱 걸음과 앞 절의 Pod 삭제 복구를 같은 식으로 그립니다.
            </p>
          </div>
          <ReconcileRolloutViz />
          {code("rollout-rolling", "rolloutRolling 세 분기")}
          {code("old-rs-scaledown", "maxScaledDown 계산")}
          {code("new-rs-hash", "새 ReplicaSet과 pod-template-hash")}
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 차이를 줄이는 반복이 reconcile, 상태를 보는 것이 level-triggered입니다</h2>
          <div className={prose}>
            <p>
              앞 절의 과정에 표준 이름을 붙입니다. 객체의 <code>spec</code>에 적힌 것이 desired state(목표 상태), <code>status</code>와 실제 하위 객체들이 current state(현재 상태)입니다. 둘의 차이를 줄이는 행동을 한 번 하고 끝나는 함수가 reconcile이며, 그 함수를 변화가 있을 때마다 다시 부르는 전체가 control loop입니다. Deployment 컨트롤러와 ReplicaSet 컨트롤러는 각각 자기 객체 종류의 reconcile을 돕니다.
            </p>
            <p>
              컨트롤러가 "Pod 삭제 사건"을 받아서 "하나 만든다"로 반응했다면 edge-triggered입니다. Kubernetes 컨트롤러는 그렇게 쓰지 않습니다. 사건은 workqueue에 객체의 key만 넣는 신호일 뿐이며, 꺼낸 뒤에는 캐시에서 현재 상태를 통째로 다시 읽어 목표와 비교합니다.
            </p>
            <p>
              커뮤니티 컨트롤러 지침은 이것을 "Level driven, not edge driven"이라고 적으면서, 컨트롤러가 한동안 꺼져 있다가 돌아와도 같은 결과에 도달해야 한다는 이유를 답니다.
            </p>
            <p>
              이 구조가 두 가지 보조 장치를 필요하게 만듭니다. 하나는 expectations입니다. Pod를 만들라고 요청한 직후 informer 캐시에는 아직 그 Pod가 없으므로 다시 세면 또 −1이 나옵니다.
            </p>
            <p>
              그래서 컨트롤러는 "내가 N개 만들었다"를 기억해 두고 informer가 N개를 볼 때까지 그 ReplicaSet을 다시 세지 않습니다. 못 보면 5분 뒤 기대값을 버립니다. 다른 하나는 rate limiter입니다. 같은 key가 계속 실패하면 5ms부터 두 배씩 늦춰 다시 꺼내며, 전체로는 초당 10개까지만 처리합니다.
            </p>
            <p>
              하위 객체가 상위 객체를 가리키는 <code>ownerReferences</code>는 두 가지 일을 합니다. 컨트롤러가 "내 Pod"를 셀 때 selector에 맞더라도 다른 소유자가 적혀 있으면 빼며, 소유자가 삭제되면 garbage collector가 하위 객체를 따라 지웁니다.
            </p>
            <p>
              selector에 맞는데 소유자가 없는 Pod는 입양(adopt)하며, 소유 중인데 selector에서 벗어난 Pod는 놓아줍니다(release). 다음 절의 "kubectl edit 오해"가 이 두 동작에서 나옵니다.
            </p>
          </div>
          {code("expectations-timeout", "expectations 5분과 slow start 1")}
          {code("workqueue-ratelimit", "기본 rate limiter 5ms → 1000s")}
          <div id="paper-controller-doc" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Controllers (concepts/architecture/controller) · 2026-10-16 확인" citeKey={1} href="https://kubernetes.io/docs/concepts/architecture/controller/">
              <q>The thermostat acts to bring the current state closer to the desired state, by turning equipment on or off.</q> 같은 문서는 Job 컨트롤러의 목표 상태를 "Job이 완료되는 것"으로 적고, 컨트롤러가 spec을 읽어 현재 상태를 그쪽으로 옮긴다고 설명합니다. 커뮤니티 지침 <code>contributors/devel/sig-api-machinery/controllers.md</code>의 첫 원칙이 "Level driven, not edge driven"입니다.
            </CitationBlock>
          </div>
        </section>

        <section id="edit-pod" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. 소유된 Pod를 edit해도 되돌려지지 않고, 라벨을 빼면 Pod가 하나 더 생깁니다</h2>
          <div className={prose}>
            <p>
              "Deployment가 관리하는 Pod를 직접 고치면 컨트롤러가 즉시 되돌린다"는 말은 반만 맞습니다. ReplicaSet 컨트롤러가 비교하는 것은 개수뿐입니다. 기존 Pod의 spec을 template과 대조하지 않으며, 다르다고 지우지도 않습니다.
            </p>
            <p>
              그래서 Pod의 image를 <code>kubectl edit</code>로 바꾸면 그 Pod는 바뀐 채로 남아 있다가, 나중에 지워져 다시 만들어질 때 template대로 돌아옵니다. 애초에 Pod spec은 대부분 불변이라 바꿀 수 있는 필드도 image, activeDeadlineSeconds, terminationGracePeriodSeconds, tolerations 추가 정도입니다.
            </p>
            <p>
              라벨은 다릅니다. Pod의 <code>app=web</code> 라벨을 <code>app=web-debug</code>로 바꾸면 ReplicaSet의 selector에서 벗어납니다. 다음 reconcile에서 ClaimPods는 "내가 소유하지만 selector가 안 맞는 Pod"를 보고 ownerReferences를 지워 놓아줍니다.
            </p>
            <p>
              소유 Pod 수가 2가 되었으니 차이 −1로 새 Pod를 하나 만듭니다. 결과는 Pod 넷입니다. 문제 있는 Pod를 서비스에서 빼 두고 살펴보는 격리 디버깅 기법이 바로 이 동작을 이용합니다.
            </p>
            <p>
              반대로 selector에 맞는 라벨을 가진 bare Pod를 만들면 ReplicaSet이 입양해 개수에 넣습니다. 그러면 하나가 남으므로 덜 준비된 Pod 하나를 지웁니다. 어느 Pod가 지워지는지는 미배치 → Pending → NotReady → pod-deletion-cost 낮음 → 같은 노드에 형제가 많음 순입니다. 수동으로 만든 Pod가 Pending이면 그 Pod가 먼저 지워집니다.
            </p>
          </div>
          {code("claim-object", "ClaimObject의 release와 adopt")}
          {code("delete-ranks", "지울 Pod를 고르는 순서")}
          <div id="paper-pod-mutable" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · ReplicaSet (concepts/workloads/controllers/replicaset) · 2026-10-16 확인" citeKey={2} href="https://kubernetes.io/docs/concepts/workloads/controllers/replicaset/">
              <q>A ReplicaSet's purpose is to maintain a stable set of replica Pods running at any given time.</q> 같은 문서의 "Isolating Pods from a ReplicaSet" 절은 라벨을 바꿔 Pod를 빼내면 ReplicaSet이 자동으로 대체 Pod를 만든다고 적고, Pods 문서는 Pod spec에서 바꿀 수 있는 필드가 image·activeDeadlineSeconds·terminationGracePeriodSeconds·tolerations(추가만)·schedulingGates뿐이라고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="job-backoff" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. Job은 실패마다 10초부터 두 배씩 320초까지 기다리고, 7번째 실패에 끝납니다</h2>
          <div className={prose}>
            <p>
              (가정) 야간 백업 Job <code>backup</code>이 DB 연결 오류로 계속 실패합니다. completions·parallelism을 적지 않아 1·1이고 backoffLimit도 기본 6입니다. Job 컨트롤러는 Pod가 Failed가 될 때마다 "마지막 성공 이후 연속 실패 수"를 하나 올린 뒤, 다음 Pod를 만들기 전에 10초 × 2^(실패 수 − 1)만큼 기다립니다.
            </p>
            <p>
              첫 실패 뒤 10초, 둘째 뒤 20초, 셋째 뒤 40초, 넷째 뒤 80초, 다섯째 뒤 160초, 여섯째 뒤 320초입니다. 일곱 번째 Pod가 실패하면 실패 수 7이 backoffLimit 6보다 커져 Job에 <code>Failed</code> 조건이 붙고 더는 만들지 않습니다. 대기 시간을 모두 더하면 630초, Pod 실행 시간을 빼고도 10분 반이 걸립니다.
            </p>
            <p>
              상한 10분은 일곱 번째 실패 뒤의 대기(640초 → 600초)에 처음 적용됩니다. 그런데 기본 backoffLimit에서는 일곱 번째 실패가 곧 Job의 끝이라 이 상한을 실제로 기다리는 일은 없습니다. backoffLimit을 10으로 올린 Job에서만 7회 이후 매번 10분씩 기다립니다. 옛 문서와 블로그에 남아 있는 "6분" 표기는 현재 코드와 다릅니다.
            </p>
          </div>
          <CalculationWalkthrough
            title="backoffLimit 6인 Job이 끝나기까지"
            question="계속 실패하는 Job은 몇 번째 Pod 뒤에 끝나고, 그 사이 얼마를 기다릴까요?"
            scope="pkg/controller/job/job_controller.go의 DefaultJobPodFailureBackOff 10s·MaxJobPodFailureBackOff 10m, backoff_utils.go의 getRemainingTimeForFailuresCount, syncJob의 failed > backoffLimit 판정을 씁니다. Pod 실행 시간은 셈에서 뺍니다."
            steps={[
              { label: "실패 1회 뒤", expression: "10 × 2⁰", result: "10초", reason: "반복문은 i = 1부터 failures 미만까지 도니 1회면 두 배를 한 번도 안 합니다." },
              { label: "실패 2~5회 뒤", expression: "10 × 2¹ … 10 × 2⁴", result: "20 · 40 · 80 · 160초", reason: "성공 없이 실패가 이어지는 동안 failuresAfterLastSuccess가 1씩 오릅니다." },
              { label: "실패 6회 뒤", expression: "10 × 2⁵", result: "320초", reason: "아직 600초 미만이라 상한에 걸리지 않습니다. 이 대기 뒤 일곱 번째 Pod가 생깁니다." },
              { label: "실패 7회", expression: "7 > 6", result: "Job Failed", reason: "exceedsBackoffLimit은 failed > backoffLimit입니다. 등호가 없어 실패 6개까지는 재시도합니다." },
              { label: "대기 합계", expression: "10 + 20 + 40 + 80 + 160 + 320", result: "630초", reason: "10분 상한은 7회 뒤 640초에 처음 걸리는데 그때는 이미 끝났습니다." },
            ]}
            conclusion="기본값에서 실패하는 Job은 Pod 7개를 만들고 약 10분 반을 기다린 뒤 BackoffLimitExceeded로 끝납니다. 상한 10분은 backoffLimit을 7 이상으로 올린 Job에서만 체감됩니다."
            caveats={["중간에 한 번이라도 성공한 Pod가 있으면 연속 실패 수가 0으로 돌아가 다음 실패는 다시 10초부터 시작합니다.", "restartPolicy OnFailure면 Pod 안 컨테이너 재시작 수도 같은 한도에 세고, 한도에 닿을 때 Pod가 종료되어 로그를 보기 어렵다고 문서가 경고합니다.", "activeDeadlineSeconds가 있으면 backoffLimit보다 먼저 Job을 끝낼 수 있습니다."]}
          />
          <AlgorithmBlock
            title="Job 컨트롤러가 Pod 하나를 실패로 받은 뒤 하는 일"
            input={["job: completions 1, parallelism 1, backoffLimit 6", "failed: Failed phase Pod 수 (이번에 3)", "failuresAfterLastSuccess = 3, lastFailureTime = 방금"]}
            steps={[
              { code: "if failed > backoffLimit: condition Failed(BackoffLimitExceeded); return", note: "3 > 6은 거짓입니다. 7번째 실패에서 참이 되어 여기서 끝납니다." },
              { code: "if pastActiveDeadline(job): condition Failed(DeadlineExceeded); return", note: "activeDeadlineSeconds를 적지 않았으니 건너뜁니다." },
              { code: "wait = 10s × 2^(failuresAfterLastSuccess − 1), capped 10m", note: "10 × 2² = 40초입니다. 마지막 실패 뒤 흐른 시간을 빼서 남은 대기만 씁니다." },
              { code: "if wait > 0: requeue(job, wait); return", note: "40초 뒤 같은 Job key를 다시 꺼냅니다. 이 사이 Pod는 0개입니다." },
              { code: "active = 0 < parallelism 1 → create 1 Pod with ownerReference(job)", note: "네 번째 Pod가 생깁니다. TerminatingOrFailed 정책이면 이전 Pod가 아직 Terminating이어도 만듭니다." },
            ]}
            repeatUntil="성공 수가 completions에 닿아 Complete 조건이 붙거나, 실패 수가 backoffLimit을 넘어 Failed 조건이 붙을 때까지 반복합니다."
            output="끝난 Job과 Pod는 ttlSecondsAfterFinished를 적어야 지워집니다. 적지 않으면 Failed Job과 Pod 7개가 그대로 남습니다."
          />
          {code("batch-defaults", "Job 기본값 1·1·6")}
          {code("job-backoff-time", "다음 Pod까지 대기 계산")}
          <div id="paper-job-doc" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Jobs (concepts/workloads/controllers/job) · Pod backoff failure policy · 2026-10-16 확인" citeKey={3} href="https://kubernetes.io/docs/concepts/workloads/controllers/job/#pod-backoff-failure-policy">
              <q>If either of the calculations reaches the .spec.backoffLimit, the Job is considered failed.</q> 두 계산은 Failed phase Pod 수와, restartPolicy OnFailure일 때 Pending·Running Pod 안 컨테이너 재시작 수입니다. 같은 절은 재생성 지연을 "exponential back-off delay (10s, 20s, 40s ...) capped at ten minutes"로, backoffLimit 기본값을 6으로 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="source-replicaset" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. 원문은 차이를 계산하고, 1개부터 두 배씩 만들고, 기대값을 적습니다</h2>
          <div className={prose}>
            <p>
              Kubernetes v1.37.1 <code>pkg/controller/replicaset/replica_set.go</code>의 manageReplicas(649–725행)가 3절의 식입니다. 650행이 <code>diff := len(activePods) − replicas</code>를 계산합니다. Pod 하나를 지운 뒤 들어오면 2 − 3 = −1입니다.
            </p>
            <p>
              657–667행은 diff가 음수일 때 부호를 바꾸고 한 번에 만들 수 있는 최대 500(BurstReplicas, 74행)으로 자른 뒤, 만들 개수를 expectations에 먼저 적습니다. 677–686행이 실제 생성입니다.
            </p>
            <p>
              slowStartBatch(887–911행)는 배치 1개로 시작해 성공하면 2, 4, 8개로 늘리다가, 한 배치에서 오류가 하나라도 나면 남은 배치를 건너뜁니다. 주석은 quota가 낮은 namespace에서 똑같이 실패할 요청 수백 개를 API server에 쏟지 않기 위해서라고 적습니다.
            </p>
            <p>
              700–718행은 diff가 양수일 때입니다. getPodsToDelete가 <code>controller_utils.go</code>의 ActivePodsWithRanks.Less(843–870행)로 정렬해 앞에서부터 diff개를 고르고, 지울 Pod의 key를 ExpectDeletions에 적은 뒤 병렬로 삭제를 요청합니다. 6절에서 수동 Pod가 먼저 지워진 순서가 이 비교 함수입니다.
            </p>
            <p>
              syncReplicaSet(755행 이하)은 이 함수를 부르기 전에 805행에서 claimPods를 거칩니다. <code>controller_ref_manager.go</code>의 ClaimObject(69–125행)가 소유·selector 일치 여부로 네 갈래를 나누고, 그중 "소유하지만 selector 불일치"가 release, "고아이고 selector 일치"가 adopt입니다. 6절의 라벨 변경이 첫 번째, bare Pod가 두 번째입니다.
            </p>
          </div>
          {code("manage-replicas", "manageReplicas 원문")}
          {code("slow-start", "slowStartBatch 원문")}
          {code("claim-object", "ClaimObject 네 갈래")}
          {code("delete-ranks", "ActivePodsWithRanks.Less")}
        </section>

        <section id="source-deployment" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. Deployment 원문은 해시로 세대를 나누고, 늘리거나 줄이거나 조건만 적습니다</h2>
          <div className={prose}>
            <p>
              <code>pkg/controller/deployment/sync.go</code>의 getNewReplicaSet(146행 이하)이 4절의 새 ReplicaSet을 만듭니다.
            </p>
            <p>
              198행이 template과 collisionCount로 해시를 계산하며, 199·201행이 그 해시를 <code>pod-template-hash</code> 라벨로 template과 selector에 더합니다. 208–210행은 이름을 Deployment 이름 + 해시로 결정적으로 짓고 ownerReferences에 Deployment를 적습니다.
            </p>
            <p>
              <code>rolling.go</code>의 rolloutRolling(31–66행)이 "한 reconcile에 한 방향"입니다. 39–46행이 새 ReplicaSet을 늘려 보고 늘렸으면 상태만 갱신하고 끝냅니다. 49–56행이 옛 ReplicaSet을 줄여 봅니다.
            </p>
            <p>
              reconcileOldReplicaSets(86–152행)의 127–129행이 maxScaledDown = allPodsCount − minAvailable − newRSUnavailablePodCount입니다. 4절의 4 − 3 − 1 = 0과 4 − 3 − 0 = 1이 이 세 줄입니다. 135–136행은 비정상 Pod부터 정리해 CrashLoop인 옛 Pod가 롤아웃을 막는 일을 피합니다.
            </p>
            <p>
              <code>deployment_util.go</code>의 ResolveFenceposts(883–902행)가 3절의 반올림입니다. 884행의 true가 surge 올림, 888행의 false가 unavailable 내림이며, 893–898행이 둘 다 0일 때 unavailable을 1로 올립니다.
            </p>
            <p>
              58–62행에서 롤아웃이 끝났다고 판단하면 cleanupDeployment(sync.go 441–470행)가 옛 ReplicaSet을 revisionHistoryLimit 10개만 남깁니다.
            </p>
            <p>
              <code>progress.go</code>의 syncRolloutStatus(36행 이하)에서 86–94행이 progressDeadlineSeconds 600을 넘긴 경우입니다. 하는 일은 <code>Progressing=False, reason ProgressDeadlineExceeded</code> 조건 하나를 적는 것뿐이며, 이 파일 어디에도 롤백 호출은 없습니다.
            </p>
            <p>
              문서도 상위 도구가 이 조건을 보고 행동하라고 적습니다. 롤백은 운영자의 <code>kubectl rollout undo</code>나 Argo Rollouts 같은 도구의 몫입니다.
            </p>
          </div>
          {code("new-rs-hash", "getNewReplicaSet의 해시와 이름")}
          {code("rollout-rolling", "rolloutRolling 원문")}
          {code("old-rs-scaledown", "reconcileOldReplicaSets 원문")}
          {code("fenceposts", "ResolveFenceposts 원문")}
          {code("cleanup-rs", "cleanupDeployment 원문")}
          {code("progress-timeout", "ProgressDeadlineExceeded 조건")}
        </section>

        <section id="source-job" data-teach-level="6" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. Job 원문은 두 가지 지연을 따로 두고, 실패 수가 한도를 넘어야 끝냅니다</h2>
          <div className={prose}>
            <p>
              <code>pkg/controller/job/job_controller.go</code> 72–79행에 지연 상수 네 개가 있습니다.
            </p>
            <p>
              DefaultJobApiBackOff 1초와 MaxJobApiBackOff 1분은 API 호출 실패 시 workqueue가 같은 Job을 다시 꺼내는 간격이고(262행에서 큐에 꽂힘), DefaultJobPodFailureBackOff 10초와 MaxJobPodFailureBackOff 10분이 7절의 Pod 재생성 지연입니다. 두 층을 섞어 읽으면 "Job이 1분마다 재시도한다"는 틀린 결론이 나옵니다.
            </p>
            <p>
              <code>backoff_utils.go</code>의 getRemainingTimeForFailuresCount(255–276행)가 대기를 계산합니다. 260–266행은 10초에서 시작해 (실패 수 − 1)번 두 배로 늘리다 10분에 닿으면 멈추며, 268–275행이 마지막 실패 뒤 흐른 시간을 뺍니다. 실패 수는 119행에서 새 Failed Pod 수만큼 늘고 126·131행에서 성공이 보이면 0으로 돌아갑니다.
            </p>
            <p>
              syncJob(914행 이하)의 1068행이 <code>exceedsBackoffLimit := jobCtx.failed &gt; *job.Spec.BackoffLimit</code>입니다. 등호가 없어 7절의 "7번째 실패에 끝남"이 나옵니다. 문서는 "reaches the .spec.backoffLimit"라고 적어 코드와 한 번 차이가 나며, 이 글은 코드 쪽을 따릅니다.
            </p>
            <p>
              1087–1090행은 이 값 또는 OnFailure 컨테이너 재시작 수(pastBackoffLimitOnFailure, 1666행)가 참이면 BackoffLimitExceeded 조건을 만들며, 1091–1092행이 activeDeadlineSeconds를 같은 자리에서 판정합니다.
            </p>
            <p>
              <code>pkg/apis/batch/v1/defaults.go</code> 35–65행이 기본값입니다. completions·parallelism이 둘 다 비면 1·1, backoffLimit은 6이지만 backoffLimitPerIndex를 쓰면 MaxInt32, podReplacementPolicy는 podFailurePolicy가 있으면 Failed 없으면 TerminatingOrFailed입니다.
            </p>
            <p>
              마지막 값은 실패 Pod가 아직 Terminating일 때 새 Pod를 만들지를 정하므로, 외부 자원 잠금을 쓰는 Job이라면 Failed로 바꿔야 두 Pod가 겹치지 않습니다.
            </p>
          </div>
          {code("job-backoff-consts", "지연 상수 네 개")}
          {code("job-backoff-time", "getRemainingTimeForFailuresCount")}
          {code("job-failure-check", "failed > backoffLimit 판정")}
          {code("batch-defaults", "batch/v1 기본값")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. 두 ReplicaSet 숫자와 Progressing 조건을 보고 template을 고칩니다</h2>
          <div className={prose}>
            <p>
              장애 때 보는 순서가 정해집니다. <code>kubectl get rs -l app=web</code>로 두 ReplicaSet의 DESIRED·CURRENT·READY를 읽으면 롤아웃이 어느 사다리 칸에 멈춰 있는지 보입니다. 새 ReplicaSet의 READY가 0에 머물면 새 Pod 쪽 문제이고(image·probe·quota), 옛 ReplicaSet이 줄지 않으면 가용 하한에 걸린 것입니다.
            </p>
            <p>
              <code>kubectl describe deploy web</code>의 Conditions에서 Progressing의 reason이 ProgressDeadlineExceeded면 10분 동안 진전이 없었다는 뜻이며, 되돌리는 것은 운영자 몫입니다.
            </p>
            <p>
              ReplicaSet이 Pod를 못 만드는 경우는 Deployment가 아니라 ReplicaSet의 Event에 남습니다. ResourceQuota 초과면 <code>FailedCreate</code>와 403 메시지가 ReplicaSet에 붙고 Deployment는 멀쩡해 보입니다. slow start 때문에 첫 Pod 하나가 실패하면 나머지는 시도조차 하지 않으므로 Event 수가 적다고 안심하면 안 됩니다. Event를 읽는 순서는 <a href="/cs/cloud/kubernetes-pod-states-crashloop-probes-events#overview">Pod 상태와 Event</a>에서 다룹니다.
            </p>
            <p>
              고칠 때는 층을 맞춥니다. replicas만 바꾸는 것은 새 revision을 만들지 않고 기존 ReplicaSet의 숫자만 바꿉니다. template을 바꿔야 새 ReplicaSet과 롤아웃이 생깁니다. 롤아웃 속도를 바꾸려면 maxSurge·maxUnavailable을 절대 수로 적는 편이 반올림 혼동을 줄입니다.
            </p>
            <p>
              삭제는 기본이 background cascading이라 Deployment를 지우면 ReplicaSet과 Pod는 garbage collector가 뒤따라 지우며, <code>--cascade=orphan</code>이면 Pod가 남습니다.
            </p>
            <p>
              Job은 backoffLimit과 activeDeadlineSeconds와 ttlSecondsAfterFinished 세 값을 함께 적습니다. 첫째가 실패 횟수, 둘째가 전체 시간, 셋째가 정리 시점을 정합니다. 이 글의 수치는 v1.37.1 기본값과 식으로 손으로 계산한 것이며 실제 클러스터를 돌려 잰 것이 아닙니다. 이 Pod들이 어느 노드에 가고, 노드가 죽으면 언제 다시 만들어지는지는 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 Node에 가는 길</a>로 이어집니다.
            </p>
          </div>
          {code("cleanup-rs", "revisionHistoryLimit 정리")}
          {code("progress-timeout", "조건만 적는 progress")}
          <ContentBoundary article="kubernetes-controllers-reconcile-deployment-job" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 사례로 다음 숫자를 예상해 보세요</h2>
          <div className={prose}>
            <p>replicas 10인 Deployment를 기본 25%로 롤아웃하면 첫 reconcile 뒤 새 ReplicaSet은 몇 개가 되고, 새 Pod가 하나도 Ready가 아닐 때 옛 ReplicaSet은 몇 개까지 줄일 수 있을까요? (답: 3절·4절)</p>
            <p>소유된 Pod의 image를 kubectl edit로 v3으로 바꾼 뒤 그 Pod를 지우면 다시 생긴 Pod의 image는 무엇이고, 그 사이 ReplicaSet은 몇 번 Pod를 만들까요? (답: 6절)</p>
            <p>backoffLimit을 10으로 올린 Job이 계속 실패하면 몇 번째 실패 뒤부터 매번 10분을 기다리고, Job이 끝날 때까지 대기 합계는 얼마일까요? (답: 7절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={k8sControllerTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
        }}
      />
    </>
  );
}
