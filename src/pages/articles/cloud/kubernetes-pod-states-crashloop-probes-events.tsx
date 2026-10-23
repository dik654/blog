import AlgorithmBlock from "@/components/ui/algorithm-block";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import BackoffClockViz from "./kubernetes-pod-states-crashloop-probes-events/viz/BackoffClockViz";
import ProbeStormViz from "./kubernetes-pod-states-crashloop-probes-events/viz/ProbeStormViz";
import { codeRefs } from "./kubernetes-pod-states-crashloop-probes-events/codeRefs";
import { k8sPodStatesTrees } from "./kubernetes-pod-states-crashloop-probes-events/fileTree";
import KubernetesSeriesLocator from "./kubernetes-shared/KubernetesSeriesLocator";

const prose = "prose prose-neutral max-w-none dark:prose-invert";

export default function KubernetesPodStatesCrashloopProbesEventsArticle() {
  const sidebar = useCodeSidebar();
  const code = (key: string, label: string) => <CodeViewButton label={label} onClick={() => sidebar.open(key, codeRefs[key])} />;
  return (
    <>
      <div className="space-y-16">
        <section id="overview" data-teach-level="S" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">1. RESTARTS 200인 CrashLoopBackOff Pod는 지금 무엇을 하고 있나요?</h2>
          <KubernetesSeriesLocator current="health" path={["resource", "controllers", "placement", "health"]} question="Pod가 목표 상태에 닿지 못했을 때 현재 단계와 실패 원인은 어디에 남을까요?" />
          <div className={prose}>
            <p>
              공식 문서의 예시 출력에 이런 줄이 있습니다. <code>alessandras-pod 0/1 CrashLoopBackOff 200 2d9h</code>. 이틀 반 동안 200번 재시작한 Pod입니다. 면접에서 이 줄을 보여 주며 "지금 이 Pod는 무엇을 하는 중이고 어디부터 볼 것인가"를 물으면 "계속 재시작 중"이라는 답은 절반만 맞습니다. 이 Pod는 대부분의 시간을 다음 재시작을 기다리며 보내는 중이며, 그 기다림의 길이는 kubelet 소스에 상수로 적혀 있습니다.
            </p>
            <p>
              답을 먼저 적겠습니다. kubectl의 STATUS 열에 나오는 Pending, ContainerCreating, ImagePullBackOff, CrashLoopBackOff, OOMKilled는 Pod의 phase가 아니라 kubelet이 컨테이너를 어느 단계에서 멈춰 세웠는지 보여 주는 단어들입니다.
            </p>
            <p>
              CrashLoopBackOff는 "컨테이너가 죽어서 10초, 20초, 40초, 80초, 160초, 300초로 두 배씩 늘어나는 대기 중"이라는 뜻이고, 10분 넘게 살아남으면 10초부터 다시 셉니다.
            </p>
            <p>
              그 단어가 왜 붙었는지는 Pod가 아니라 Event가 말해 주는데 Event는 1시간이 지나면 사라지고 같은 내용은 묶여서 기록됩니다.
            </p>
            <p>이 글은 Kubernetes v1.37.1 원문과 공식 문서를 따라 상태 단어 하나하나가 어느 코드에서 나오는지, probe 기본값이 어떻게 재시작을 만드는지, Event를 어떤 순서로 읽어야 하는지를 컨테이너 하나의 시계로 추적합니다.
            </p>
            <p>
              requests와 limits가 Pending과 OOMKilled를 만드는 쪽은 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#overview">requests·limits·Allocatable 글</a>이 맡으며, 컨테이너가 신호를 받아 죽는 리눅스 쪽 바닥은 <a href="/cs/cloud/linux-process-signals-pid1-fds#overview">프로세스·신호·PID 1</a>에 있습니다. 시리즈 지도는 <a href="/cs/cloud/kubernetes-concept-map#overview">Kubernetes 개념 지도</a>입니다.</p>
          </div>
        </section>

        <section id="black-box" data-teach-level="B" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">2. STATUS 열은 phase가 아니라 "어느 단계에서 멈췄나"의 표시입니다</h2>
          <div className={prose}>
            <p>
              바깥에서 보면 Pod 하나의 삶은 네 칸입니다. API 서버에 만들어진 뒤 노드를 기다리다가, 노드가 정해지면 kubelet이 볼륨·네트워크·이미지를 준비해 컨테이너를 띄우며, 컨테이너가 돌다가 끝나면 restartPolicy에 따라 다시 띄우거나 Pod를 끝냅니다. Pod API의 phase는 이 가운데 Pending, Running, Succeeded, Failed, Unknown 다섯 값만 가집니다.
            </p>
            <p>
              그런데 kubectl get pods의 STATUS 열은 phase를 그대로 보여 주지 않습니다. 컨테이너가 Waiting이면 그 reason(ContainerCreating·ImagePullBackOff·CrashLoopBackOff)을, Terminated면 그 reason(OOMKilled·Error·Completed)을, 삭제 중이면 Terminating을 대신 보여 줍니다.
            </p>
            <p>
              공식 문서는 "Status, a kubectl display field for user intuition"을 phase와 혼동하지 말라고 note로 적어 두었습니다.
            </p>
            <p>
              그래서 phase가 Pending인 Pod가 STATUS에는 ContainerCreating으로, phase가 Running인 Pod가 STATUS에는 CrashLoopBackOff로 나옵니다.
            </p>
            <p>이 글은 그 단어들을 왼쪽 칸부터 오른쪽 칸 순서로 따라갑니다. 4절이 노드를 못 받은 Pending과 노드는 받았는데 못 뜨는 ContainerCreating·ImagePullBackOff, 3·6절이 떴다가 죽기를 반복하는 CrashLoopBackOff, 7~8절이 그 죽음을 만드는 probe, 9절이 모든 단어의 이유를 적어 두는 Event입니다.</p>
          </div>
          {code("status-vs-phase-doc", "STATUS ≠ phase라는 note")}
        </section>

        <section id="backoff-clock" data-teach-level="0" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">3. 여섯 번 죽은 컨테이너는 12초를 돌고 610초를 기다렸습니다</h2>
          <div className={prose}>
            <p>(가정) 설정 파일이 없어서 뜨자마자 2초 만에 exit 1로 죽는 컨테이너가 있습니다. 첫 크래시 뒤 kubelet은 10초를 기다렸다가 다시 띄웁니다. 또 2초 만에 죽으면 이번에는 20초, 그다음 40초, 80초, 160초를 기다립니다. 여섯 번째 크래시 뒤에는 320초가 아니라 상한 300초를 기다리고 그 뒤로는 죽을 때마다 300초입니다.</p>
            <p>여섯 번 죽기까지 컨테이너가 실제로 돈 시간은 6 × 2 = 12초이고 기다린 시간은 10 + 20 + 40 + 80 + 160 + 300 = 610초입니다. 전체 622초 가운데 98%가 대기입니다. 그래서 1절의 "지금 무엇을 하는 중인가"의 답은 "다음 재시작을 기다리는 중"이며, kubectl describe의 State는 Waiting, Reason은 CrashLoopBackOff, Last State는 Terminated·Exit Code 1입니다.</p>
            <p>이 시계에는 초기화 규칙이 하나 있습니다. 어느 재시작에서 컨테이너가 10분(600초) 넘게 살아남으면 kubelet은 장부를 지우고 그 뒤의 크래시를 첫 크래시처럼 10초부터 셉니다.
            </p>
            <p>
              1절의 RESTARTS 200·AGE 2d9h를 이 규칙으로 읽으면, 200번이 모두 300초 대기였다면 약 17시간이라 57시간을 채우지 못하므로 그 사이에 10분 넘게 살아남았다가 다시 죽은 구간이 여러 번 섞여 있었다는 뜻입니다. 단순한 설정 오류가 아니라 간헐적으로 죽는 원인을 찾아야 한다는 첫 단서가 이 네 숫자에서 나옵니다.</p>
          </div>
          <CalculationWalkthrough
            title="크래시 여섯 번의 시계와 RESTARTS 200의 역산"
            question="2초 만에 죽는 컨테이너는 여섯 번째 크래시까지 얼마를 돌고 얼마를 기다리며, RESTARTS 200·AGE 2d9h는 무엇을 말해 주나요?"
            scope="kubelet.go의 initialCrashLoopBackOff 10초·MaxCrashLoopBackOff 300초·HasExpiredFunc 600초를 씁니다. 실행 2초와 '즉시 다시 죽는다'는 가정입니다. jitter는 없습니다."
            steps={[
              { label: "대기 수열", expression: "10 → 20 → 40 → 80 → 160 → min(320, 300)", result: "10·20·40·80·160·300초", reason: "Next가 재시작 직전에 두 배로 늘리고 상한에서 자릅니다. 여섯 번째부터 상한입니다." },
              { label: "여섯 번의 실행", expression: "6 × 2", result: "12초", reason: "컨테이너가 실제로 프로세스를 돌린 시간입니다. 로그는 이 12초 안에서만 나옵니다." },
              { label: "여섯 번의 대기", expression: "10 + 20 + 40 + 80 + 160 + 300", result: "610초", reason: "이 동안 STATUS는 CrashLoopBackOff, event는 'Back-off restarting failed container'입니다." },
              { label: "대기 비율", expression: "610 ÷ (12 + 610)", result: "98%", reason: "'계속 재시작 중'이 아니라 '거의 항상 기다리는 중'입니다. 재시작 횟수가 늘수록 비율은 100%에 가까워집니다." },
              { label: "200번이 전부 상한이었다면", expression: "200 × (300 + 2)", result: "≈ 16.8시간", reason: "AGE 2d9h ≈ 57시간보다 훨씬 짧습니다." },
              { label: "남는 40시간의 뜻", expression: "57 − 16.8", result: "≈ 40시간의 '살아남은' 구간", reason: "10분 넘게 살아남으면 장부가 초기화되고 다음 크래시는 10초부터입니다. 그런 초기화가 여러 번 섞여야 57시간이 채워집니다. 간헐적 원인(의존성·메모리·probe)을 의심할 근거입니다." },
            ]}
            conclusion="CrashLoopBackOff는 상태라기보다 대기 중이라는 표시이고, RESTARTS와 AGE의 비율은 '항상 죽는가, 가끔 죽는가'를 가르는 첫 숫자입니다."
            caveats={["대기 시각의 기준은 kubelet이 확인한 시각이 아니라 컨테이너의 FinishedAt입니다. kubelet이 늦게 확인해도 대기가 그만큼 길어지지 않습니다.", "ReduceDefaultCrashLoopBackOffDecay(alpha)를 켜면 1·2·4·8·16·32·60초가 되고, 1.35부터 beta인 KubeletCrashLoopBackOffMax로 노드별 상한을 1~300초에서 바꿀 수 있습니다(11절)."]}
          />
          <BackoffClockViz />
          {code("crashloop-constants", "10초·300초 상수")}
          {code("restart-backoff-doc", "문서의 10s, 20s, 40s… 설명")}
        </section>

        <section id="pending-two-kinds" data-teach-level="1" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">4. Pending은 두 종류입니다. 노드가 없거나, 노드는 있는데 못 뜨거나</h2>
          <div className={prose}>
            <p>
              phase Pending은 컨테이너가 하나도 뜨지 않았다는 뜻일 뿐 원인을 둘로 나눠야 합니다. 첫째는 spec.nodeName이 비어 있는 Pending입니다. scheduler가 노드를 못 골랐고 event에 FailedScheduling과 <code>0/3 nodes are available: 3 Insufficient cpu.</code> 같은 이유가 남습니다.
            </p>
            <p>
              자원 부족 외에 nodeSelector·affinity 불일치, taint를 견딜 toleration 부재, PVC가 아직 PV에 묶이지 않음(volume binding)도 이 갈래입니다. 이 Pod는 kubelet이 아직 모르니 노드 쪽을 봐도 아무것도 없습니다.
            </p>
            <p>
              둘째는 nodeName이 채워진 Pending입니다. kubelet이 받아서 sandbox(네트워크 namespace와 pause 컨테이너)를 만들어 볼륨을 붙이며 이미지를 받는 중이면 STATUS는 ContainerCreating입니다.
            </p>
            <p>
              여기서 막히면 event에 FailedCreatePodSandBox(CNI 실패), FailedMount(볼륨), Failed/ErrImagePull(이미지)이 남습니다. 공식 디버깅 문서는 이 상태를 Waiting이라 부르며 "가장 흔한 원인은 이미지 pull 실패"라고 적습니다.
            </p>
            <p>이미지 실패는 두 단어로 나타납니다. 방금 실패한 순간은 ErrImagePull, 재시도를 미루는 동안은 ImagePullBackOff입니다. 미루는 간격은 CrashLoopBackOff와 같은 장부 구조로 10초에서 시작해 300초까지 두 배씩 늘어납니다. 이미지 이름이 틀리면 InvalidImageName, imagePullPolicy가 Never인데 노드에 이미지가 없으면 ErrImageNeverPull이고 이 둘은 기다려도 낫지 않습니다.</p>
            <p>그러니 Pending을 보면 먼저 <code>kubectl get pod -o wide</code>로 NODE 열이 비었는지 봅니다. 비었으면 scheduler의 event를, 채워졌으면 그 노드 kubelet이 남긴 event를 읽습니다. 같은 Pending이라도 고칠 곳이 scheduler 쪽(requests·affinity·taint)인지 노드 쪽(CNI·스토리지·레지스트리 인증)인지가 이 한 열에서 갈립니다.</p>
          </div>
          {code("pending-waiting-doc", "Pending과 Waiting을 나눈 문서")}
          {code("image-pull-errors", "ErrImagePull · ImagePullBackOff 정의")}
        </section>

        <section id="names" data-teach-level="2" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">5. 컨테이너 상태는 Waiting·Running·Terminated 셋이고, 단어는 reason입니다</h2>
          <div className={prose}>
            <p>앞 절의 단어에 데이터 모델의 자리를 붙입니다. Pod의 status.containerStatuses[]에는 컨테이너마다 state(현재)와 lastState(직전)가 있고 각각 Waiting·Running·Terminated 중 하나입니다. Waiting과 Terminated에는 reason 문자열이 붙습니다.
            </p>
            <p>
              ContainerCreating, ImagePullBackOff, CrashLoopBackOff는 Waiting의 reason이고 OOMKilled, Error, Completed는 Terminated의 reason입니다. kubectl의 STATUS 열은 이 reason을 꺼내 보여 주는 것입니다.</p>
            <p>CrashLoopBackOff라는 reason은 kubelet의 컨테이너 런타임 관리자가 "아직 backoff 창 안이라 지금은 띄우지 않는다"고 판단할 때 돌려주는 오류의 이름입니다. 3절의 대기가 끝나 컨테이너를 띄우면 state는 Running이 되고 CrashLoopBackOff는 사라졌다가 다시 죽으면 돌아옵니다. 그래서 공식 문서는 CrashLoopBackOff를 상태라기보다 "backoff 지연 메커니즘이 작동 중"이라는 표시라고 설명합니다.</p>
            <p>RESTARTS 열은 containerStatuses[].restartCount의 합입니다. 재시작은 restartPolicy가 Always(기본)나 OnFailure일 때 kubelet이 같은 Pod 안에서 컨테이너를 새로 만드는 일이고, Pod를 다른 노드로 옮기는 일이 아닙니다. 옮기는 쪽은 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 노드에 닿기까지</a>에서 다루는 컨트롤러의 일입니다.</p>
            <p>이 글이 다루는 단어 가운데 OOMKilled만은 kubelet이 아니라 커널이 만듭니다. 컨테이너가 memory limit에 닿아 커널 OOM killer가 SIGKILL을 보내면 런타임이 exit code 137과 reason OOMKilled를 기록하고 kubelet은 그것을 Terminated·lastState에 옮겨 적습니다.
            </p>
            <p>
              그 뒤의 재시작과 backoff는 다른 크래시와 똑같이 3절의 시계를 탑니다. 왜 137인지와 OOM 증거 세 곳은 <a href="/cs/cloud/linux-memory-page-cache-oom#exit-137">리눅스 메모리 글 10절</a>에 있습니다.</p>
          </div>
        </section>

        <section id="backoff-mechanism" data-teach-level="3" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">6. kubelet은 재시작 직전에 다음 대기를 두 배로 적어 두고, FinishedAt부터 셉니다</h2>
          <div className={prose}>
            <p>
              3절의 시계를 만드는 부품은 둘입니다. client-go의 flowcontrol.Backoff는 키마다 현재 대기와 마지막 갱신 시각을 적어 두는 장부이고, kubelet의 컨테이너 런타임 관리자는 컨테이너를 띄우기 전에 이 장부를 확인하는 doBackOff 함수입니다. 장부의 키는 Pod UID와 컨테이너 이름이라 같은 Pod의 두 컨테이너도 따로 셉니다.
            </p>
            <p>
              doBackOff는 먼저 그 컨테이너의 마지막 종료 상태(Exited)를 찾습니다. 없으면 첫 시작이라 바로 띄웁니다. 있으면 종료 시각 FinishedAt을 기준으로 "지금 − FinishedAt &lt; 현재 대기"인지 봅니다.
            </p>
            <p>
              참이면 Warning event <code>Back-off restarting failed container</code>를 남기고 ErrCrashLoopBackOff를 돌려줘 이번 sync에서는 띄우지 않습니다. 거짓이면 Next를 불러 다음 대기를 두 배(상한 300초)로 적어 두고 컨테이너를 띄웁니다. 그러니 "다음 대기"는 재시작이 성공한 뒤가 아니라 재시작 직전에 정해집니다.
            </p>
            <p>만료 규칙은 Next와 IsInBackOffSince 둘 다에서 확인합니다. 기본 flowcontrol은 2 × 상한이 지나면 장부를 지우는데 kubelet은 HasExpiredFunc를 명시적으로 600초로 적었습니다. FinishedAt − 마지막 갱신 &gt; 600초, 곧 컨테이너가 마지막 재시작 뒤 10분 넘게 살다가 죽었으면 장부를 새로 만들어 10초부터 셉니다. 상한을 100초로 바꿔도 이 600초는 그대로입니다.</p>
          </div>
          <AlgorithmBlock
            title="컨테이너를 다시 띄우기 전 doBackOff가 하는 일"
            input={[
              "container: 2초 만에 exit 1로 죽는 컨테이너, FinishedAt = 방금",
              "backoff 장부: key = (Pod UID, 컨테이너 이름), 시작 10s, 상한 300s, 만료 600s",
              "이번 sync 시각 now (kubelet은 Pod를 주기적으로, 그리고 상태 변화마다 sync)",
            ]}
            steps={[
              { code: "cStatus = 마지막 Exited 컨테이너 상태; if none: return (바로 띄움)", note: "첫 시작이거나 Terminated 기록이 없으면 backoff 대상이 아닙니다." },
              { code: "ts = cStatus.FinishedAt; key = GetBackoffKey(pod, container)", note: "기준 시각은 kubelet이 확인한 시각이 아니라 컨테이너가 끝난 시각입니다." },
              { code: "if backOff.IsInBackOffSince(key, ts):   # now − ts < 현재 대기 ?", note: "첫 크래시 직후 장부에는 항목이 없어 false입니다. 두 번째 sync부터 10초가 지나기 전까지는 true입니다." },
              { code: "    event(Warning, BackOff, 'Back-off restarting failed container'); return ErrCrashLoopBackOff", note: "이 오류 이름이 containerStatuses[].state.waiting.reason = CrashLoopBackOff가 됩니다. event는 9절의 spam filter 때문에 25개 뒤에는 5분에 하나만 새로 기록됩니다." },
              { code: "backOff.Next(key, ts)   # 없거나 만료면 10s로 새로, 있으면 ×2, 300s에서 자름", note: "첫 크래시: 10s 기록. 둘째: 20s. … 여섯째: min(320, 300) = 300s. FinishedAt − lastUpdate > 600s면 만료라 다시 10s입니다." },
              { code: "return false   # 컨테이너를 띄움, restartCount += 1", note: "띄운 컨테이너가 또 2초 만에 죽으면 다음 sync에서 3번 줄이 true가 되어 방금 적은 대기만큼 기다립니다." },
            ]}
            repeatUntil="컨테이너가 600초 넘게 살아남아 장부가 만료되거나, restartPolicy가 Never여서 재시작하지 않거나, Pod가 삭제될 때까지 반복합니다."
            output="3절 시계: 실행 2초 → 대기 10 → 2 → 20 → 2 → 40 → 2 → 80 → 2 → 160 → 2 → 300 → 2 → 300 → …. STATUS는 대기 중 CrashLoopBackOff, 실행 중 Running(2초)이 번갈아 보입니다."
          />
          {code("do-backoff", "doBackOff 원문")}
          {code("backoff-next", "Next · IsInBackOffSince 원문")}
          {code("crashloop-expiry", "HasExpiredFunc 600초")}
        </section>

        <section id="probes" data-teach-level="4" data-calculation-explained className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">7. probe 기본값은 1초 timeout·10초 주기·3회라서, 30초면 재시작입니다</h2>
          <div className={prose}>
            <p>
              컨테이너가 스스로 죽지 않아도 kubelet이 죽이는 경로가 있습니다. livenessProbe입니다. probe의 네 필드 기본값은 API 기본값 함수에 있습니다. timeoutSeconds 1, periodSeconds 10, successThreshold 1, failureThreshold 3이고 initialDelaySeconds는 0입니다.
            </p>
            <p>
              그러니 아무 숫자도 적지 않은 liveness는 10초마다 한 번씩 검사해 1초 안에 답이 없으면 실패로 세고, 연속 세 번 실패하면(최대 약 30초) 컨테이너를 죽여 재시작시킵니다.
            </p>
            <p>
              readinessProbe는 같은 기본값으로 같은 검사를 하지만 결과가 다릅니다. 실패하면 죽이지 않고 Pod의 Ready 조건을 false로 바꿔 Service의 EndpointSlice에서 뺍니다. 성공하면 한 번(successThreshold 1)에 돌아옵니다. 공식 문서는 두 probe가 서로 의존하지 않는다고 caution으로 적습니다. readiness가 실패해 트래픽을 안 받는 중이어도 liveness는 따로 돌며, 실패하면 재시작됩니다.
            </p>
            <p>startupProbe는 liveness를 미루는 장치입니다. 뜨는 데 오래 걸리는 앱에 liveness의 initialDelaySeconds를 크게 잡으면 그만큼 교착 감지가 늦어지므로, 같은 검사를 startupProbe에 failureThreshold 30 · periodSeconds 10으로 두면 최대 300초 동안 liveness가 꺼져 있다가 startup이 한 번 성공한 순간부터 liveness가 넘겨받습니다.
            </p>
            <p>
              300초 안에 한 번도 성공하지 못하면 컨테이너는 죽고 3절의 시계를 탑니다.</p>
            <p>timeoutSeconds 1초가 가장 자주 다른 글과 만나는 숫자입니다. JVM의 GC pause나 <a href="/cs/cloud/kubernetes-requests-limits-allocatable-qos#cpu-throttle">CPU limit의 throttling(100ms 주기에서 최대 87.5ms 멈춤)</a>이 몇 개 겹치면 /healthz 응답이 1초를 넘길 수 있고, 그것이 10초 간격으로 세 번 이어지면 멀쩡히 일하던 컨테이너가 재시작됩니다. 재시작은 다시 CPU를 쓰고 backoff를 만듭니다.</p>
          </div>
          <CalculationWalkthrough
            title="기본값 probe가 재시작을 만들기까지"
            question="아무 숫자도 적지 않은 livenessProbe는 응답이 멈춘 컨테이너를 몇 초 만에 죽이고, startupProbe 30 × 10은 무엇을 바꾸나요?"
            scope="pkg/apis/core/v1/defaults.go의 SetDefaults_Probe 값(1·10·1·3)과 공식 probe 문서의 startupProbe 예시(failureThreshold 30, periodSeconds 10)를 씁니다. 첫 검사가 컨테이너 시작 직후에 바로 돈다고 봅니다."
            steps={[
              { label: "한 회차의 실패 판정", expression: "응답 > timeoutSeconds 1초", result: "실패 1회", reason: "HTTP면 2xx·3xx가 아니거나 1초 안에 답이 없을 때, exec면 종료 코드가 0이 아닐 때입니다." },
              { label: "연속 실패 창", expression: "failureThreshold 3 × periodSeconds 10", result: "최대 약 30초", reason: "t = 0·10·20초의 세 검사가 모두 실패하면 20초 시점(+ timeout 1초)에 재시작이 결정됩니다. 그 사이 한 번이라도 성공하면 카운터는 0으로 돌아갑니다." },
              { label: "readiness의 같은 창", expression: "3 × 10", result: "최대 약 30초 뒤 endpoint 제거", reason: "죽이지는 않습니다. 성공 한 번(successThreshold 1)에 복귀하므로 복구는 최대 10초입니다." },
              { label: "startupProbe 창", expression: "30 × 10", result: "300초", reason: "이 동안 liveness와 readiness는 돌지 않습니다. 한 번 성공하면 즉시 liveness가 시작됩니다." },
              { label: "startup 실패의 결과", expression: "300초 동안 성공 0회", result: "컨테이너 종료 → restartPolicy", reason: "재시작이면 3절의 backoff가 그대로 적용됩니다. 뜨는 데 6분 걸리는 앱은 영원히 뜨지 못합니다." },
            ]}
            conclusion="기본값 probe는 '30초 안에 세 번 1초를 넘기면 재시작'입니다. 느린 시작은 startupProbe로, 의존성 확인은 readiness로, liveness는 프로세스 자체가 멈췄는지만 보게 두는 것이 8절 폭풍을 막는 배치입니다."
            caveats={["timeoutSeconds를 올리면 교착 감지가 그만큼 늦어집니다. 올리기 전에 왜 1초를 넘기는지(throttling·GC·의존성 대기)를 먼저 확인합니다.", "exec probe는 컨테이너 안에서 프로세스를 띄우므로 CPU limit 안에서 돌고, 그 자체가 throttling의 원인이 될 수 있습니다."]}
          />
          {code("probe-defaults", "SetDefaults_Probe 원문")}
          {code("startup-probe-doc", "startupProbe 30 × 10 예시")}
          {code("probes-independent-doc", "두 probe는 서로 독립")}
        </section>

        <section id="restart-storm" data-teach-level="4" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">8. liveness가 DB를 확인하면 DB 30초 장애가 서비스 전체 재시작이 됩니다</h2>
          <div className={prose}>
            <p>
              (가정) replica 세 개짜리 Deployment가 /healthz에서 DB 연결까지 확인하고 그 경로를 livenessProbe에 걸어 두었습니다. DB가 30초 동안 응답하지 않습니다. 세 Pod의 /healthz는 모두 1초 timeout을 넘기고 10초 간격으로 세 번 실패해 failureThreshold 3에 닿습니다. kubelet 세 대가 거의 동시에 세 컨테이너를 죽이고 다시 띄웁니다.
            </p>
            <p>
              재시작 중인 컨테이너는 readiness가 성공할 수 없으니 세 주소가 모두 EndpointSlice에서 빠집니다. Service는 보낼 곳이 없어 모든 요청이 5xx가 됩니다. DB가 멈춘 동안 "DB 오류"로 일부 요청만 실패하던 장애가, probe를 거치며 "서비스 전체가 없는" 장애로 바뀐 것입니다.
            </p>
            <p>
              DB가 30초 뒤 돌아와도 끝이 아닙니다. 재시작된 컨테이너가 DB 없는 동안 다시 죽었다면 10초, 20초 backoff를 기다려야 하고 복구는 DB 복구 시점이 아니라 backoff가 끝나는 시점부터 replica 하나씩 돌아옵니다.
            </p>
            <p>같은 확인을 readinessProbe에만 두면 다르게 흘러갑니다. DB가 멈춘 동안 세 Pod는 endpoint에서 빠질 뿐 죽지 않고, DB가 돌아오면 다음 검사 한 번(최대 10초)에 세 주소가 모두 돌아옵니다. 서비스가 비는 시간은 비슷하지만 재시작도 backoff도 없고 캐시와 연결 풀도 살아 있습니다.
            </p>
            <p>
              liveness는 "이 프로세스가 스스로 회복할 수 없는 상태(교착·무한 루프)인가"만 묻게 두고, 의존성은 readiness로 보내는 것이 공식 문서가 두 probe를 분리해 둔 이유입니다.</p>
            <p>이 사례의 숫자는 가정이지만 구조는 소스 사실의 조합입니다. 기본값 1·10·3(7절), 재시작 중 Ready=false, 두 probe의 독립(문서 caution), 재시작마다 적용되는 backoff(6절)가 그것입니다. 실제 사고 사례와 SRE 관점의 대책(의존성 격리·점진적 롤아웃·PDB)은 <a href="/cs/cloud/kubernetes-sre-slo-burn-rate-upgrades#overview">Kubernetes SRE 글</a>에서 이어집니다.</p>
          </div>
          <ProbeStormViz />
          <div id="paper-k8s-probes" className="not-prose my-8 scroll-mt-24">
            <CitationBlock source="Kubernetes docs · Configure Liveness, Readiness and Startup Probes (website main 2f85f280, 2026-10-17 확인)" citeKey={1} href="https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/">
              <q>The readiness and liveness probes do not depend on each other to succeed.</q> 같은 문서의 startupProbe 절은 failureThreshold 30 · periodSeconds 10으로 "a maximum of 5 minutes (30 * 10 = 300s)"를 주고, 한 번도 성공하지 못하면 컨테이너가 죽어 restartPolicy를 따른다고 적습니다.
            </CitationBlock>
          </div>
        </section>

        <section id="events" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">9. Event는 1시간 뒤 사라지고, 같은 내용은 묶이고, 25개 뒤엔 5분에 하나입니다</h2>
          <div className={prose}>
            <p>
              앞 절들의 단어가 "무엇"이라면 Event는 "왜"입니다. FailedScheduling의 Insufficient cpu, FailedMount의 볼륨 이름, Back-off restarting failed container, Unhealthy의 probe 응답 본문이 모두 Event의 message에 있습니다. 그런데 Event에는 세 가지 제약이 있어 그대로 읽으면 빠집니다.
            </p>
            <p>
              첫째, 보존이 1시간입니다. kube-apiserver의 EventTTL 기본값이 1시간이라 etcd에서 지워집니다. 어제 밤의 CrashLoopBackOff 원인은 오늘 아침 kubectl로는 볼 수 없습니다. 장애 직후에 <code>kubectl get events -A --sort-by=.metadata.creationTimestamp</code>로 받아 두거나 event exporter로 로그 저장소에 흘려 두어야 합니다.
            </p>
            <p>둘째, 묶입니다. kubelet 같은 보내는 쪽은 메시지만 다른 같은 종류(source·object·type·reason)의 event가 10분 안에 10개를 넘으면 하나로 합치고 메시지 앞에 <code>(combined from similar events):</code>를 붙입니다. 완전히 같은 event는 새로 만들지 않고 count를 올려 describe에 <code>x15 over 3m</code>처럼 보입니다.
            </p>
            <p>
              셋째, 걸러집니다. 한 source가 한 객체에 대해 처음 25개는 바로 보내지만 그 뒤로는 300초에 1개씩만 통과시킵니다. 두 시간째 죽고 있는 컨테이너의 BackOff event가 "5분에 한 번"만 갱신되는 이유입니다.</p>
            <p>그래서 읽는 순서가 있습니다. Pod의 event는 <code>--field-selector involvedObject.name=&lt;pod&gt;</code>로 시간순으로 보되, 소유자 사슬마다 따로 봅니다. ResourceQuota 거절(FailedCreate)은 Pod가 아니라 ReplicaSet에, 스케줄 실패와 BackOff는 Pod에, NodeNotReady는 Node에 남습니다.
            </p>
            <p>
              Pod의 event가 비어 있다고 "아무 일도 없다"가 아니라 "Pod 객체가 아직 안 생겼거나 1시간이 지났거나 걸러졌다"일 수 있습니다. 컨테이너가 죽은 이유 자체는 event가 아니라 <code>kubectl logs --previous</code>와 describe의 Last State·Exit Code에서 봅니다.</p>
          </div>
          {code("event-ttl", "EventTTL 1시간")}
          {code("event-aggregation", "10개·600초·25개·1/300 상수")}
        </section>

        <section id="source-trace" data-teach-level="5" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">10. 원문은 상수 세 개, 장부 하나, 확인 함수 하나로 시계를 만듭니다</h2>
          <div className={prose}>
            <p>Kubernetes v1.37.1의 pkg/kubelet/kubelet.go 165~180행에 MaxCrashLoopBackOff(= v1beta1.MaxContainerBackOff 300초), initialCrashLoopBackOff 10초, MaxImageBackOff 300초가 있고 226행에 imageBackOffPeriod 10초가 있습니다.
            </p>
            <p>
              353~372행의 newCrashLoopBackOff가 두 feature gate와 kubelet 설정을 읽어 시작값·상한을 정하고, 1087~1090행이 flowcontrol.NewBackOff(base, boMax)로 장부를 만든 뒤 HasExpiredFunc를 600초로 덮어씁니다.</p>
            <p>장부 자체는 staging/src/k8s.io/client-go/util/flowcontrol/backoff.go입니다. Next(96~109행)는 항목이 없거나 만료됐으면 시작값으로 새로 만들고 있으면 두 배로 늘려 상한에서 자릅니다. IsInBackOffSince(119~130행)는 "eventTime 이후 지난 시간 &lt; 현재 대기"를 돌려줍니다. 기본 만료(182~187행)는 2 × 상한인데 kubelet이 600초로 바꿔 둔 것입니다.</p>
            <p>확인 함수는 pkg/kubelet/kuberuntime/kuberuntime_manager.go 2077~2109행의 doBackOff입니다. 2080~2089행이 마지막 Exited 상태를 찾고, 2093~2095행이 FinishedAt과 키를 정하며, 2096~2104행이 창 안이면 BackOff event와 ErrCrashLoopBackOff를, 2107~2108행이 창 밖이면 Next를 부릅니다. 6절 의사코드의 여섯 줄이 이 함수의 순서 그대로입니다.</p>
            <p>probe 기본값은 pkg/apis/core/v1/defaults.go 275~288행 SetDefaults_Probe이고, 이미지 단계의 단어는 pkg/kubelet/images/types.go 28~41행,
            </p>
            <p>
              EventTTL은 pkg/controlplane/apiserver/options/options.go 129행과 162행의 --event-ttl, 집계·spam 상수는 staging/src/k8s.io/client-go/tools/record/events_cache.go 36~48행과 185행입니다.
            </p>
            <p>
              feature gate 단계는 pkg/features/kube_features.go 1754~1757행(KubeletCrashLoopBackOffMax: 1.32 alpha, 1.35 beta·기본 on)과 2044~2046행(ReduceDefaultCrashLoopBackOffDecay: 1.33 alpha·기본 off)입니다.</p>
          </div>
          {code("crashloop-newbackoff", "newCrashLoopBackOff 원문")}
          {code("max-container-backoff", "MaxContainerBackOff 300s")}
          {code("crashloop-feature-gates", "KubeletCrashLoopBackOffMax 단계")}
          {code("reduced-decay-gate", "ReduceDefaultCrashLoopBackOffDecay 단계")}
        </section>

        <section id="boundary" data-teach-level="7" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">11. NODE 열과 Last State, Event 시간순을 보고 probe 배치를 고칩니다</h2>
          <div className={prose}>
            <p>
              진단 순서를 단어별로 정리합니다. Pending이면 NODE 열이 비었는지부터 봅니다(4절). 비었으면 scheduler event, 채워졌으면 노드 kubelet의 event입니다. ImagePullBackOff면 레지스트리 인증과 이미지 이름을, InvalidImageName·ErrImageNeverPull이면 기다리지 말고 spec을 고칩니다.
            </p>
            <p>
              CrashLoopBackOff면 <code>kubectl logs --previous</code>로 직전 컨테이너의 마지막 로그를, describe의 Last State에서 Exit Code를 봅니다.
            </p>
            <p>
              137이면 메모리(limit·OOMKilled), 1이나 2면 앱 오류나 설정, 143이면 SIGTERM으로 끝난 것이며, Exit Code 0인데 재시작이면 "할 일을 끝낸 뒤 정상 종료하는 프로세스를 Always로 돌린" 경우입니다.
            </p>
            <p>RESTARTS와 AGE의 비율은 3절처럼 읽습니다. 비율이 300초에 가까우면 항상 죽는 것이고 훨씬 길면 간헐적으로 죽는 것입니다. 후자는 로그보다 probe 설정(7절)과 의존성(8절), 메모리 추세를 먼저 의심합니다. Event는 1시간 안에 거두고(9절) 소유자 사슬마다 따로 봅니다.</p>
            <p>고칠 때는 probe부터 배치를 바꿉니다. liveness에서 의존성 확인을 빼고 프로세스 자체의 응답만 보게 하며, 의존성은 readiness로, 느린 시작은 startupProbe로 보냅니다.
            </p>
            <p>
              timeoutSeconds 1초를 넘기는 원인이 CPU throttling이면 probe가 아니라 limit을 고칩니다. backoff 자체를 바꾸고 싶다면 1.35부터 beta·기본 on인 KubeletCrashLoopBackOffMax로 kubelet 설정 <code>crashLoopBackOff.maxContainerRestartPeriod</code>를 1~300초 사이로 두어 노드별 상한을 낮출 수 있습니다.
            </p>
            <p>
              상한을 낮추면 복구는 빨라지지만 진짜로 깨진 컨테이너가 노드와 레지스트리를 더 자주 두드립니다. 클러스터 전체를 1초·60초로 바꾸는 ReduceDefaultCrashLoopBackOffDecay는 1.37.1에서도 alpha입니다.</p>
            <p>이 글의 시계는 kubelet 상수로 손으로 계산한 값이며 실제 클러스터를 돌려 잰 것이 아닙니다. 실제 Pod의 대기는 describe의 Events에 <code>back-off 5m0s restarting failed container</code>처럼 kubelet이 직접 적어 주므로 거기서 다시 읽습니다.
            </p>
            <p>
              컨테이너 대신 노드가 죽었을 때 Pod가 다른 노드로 옮겨 가는 데 걸리는 약 6분의 시계는 <a href="/cs/cloud/kubernetes-pod-to-node-scheduler-kubelet-notready#overview">Pod가 노드에 닿기까지</a>에서, Deployment가 새 ReplicaSet으로 Pod를 갈아 끼우는 쪽은 <a href="/cs/cloud/kubernetes-controllers-reconcile-deployment-job#overview">컨트롤러와 reconcile</a>에서 이어집니다.</p>
          </div>
          <ContentBoundary article="kubernetes-pod-states-crashloop-probes-events" />
        </section>

        <section id="review-questions" data-teach-level="review" className="scroll-mt-20">
          <h2 className="mb-6 text-2xl font-bold">12. 같은 컨테이너로 다음 시계를 예상해 보세요</h2>
          <div className={prose}>
            <p>kubelet 설정으로 maxContainerRestartPeriod를 100초로 두면 3절의 컨테이너가 여섯 번 죽기까지의 대기 수열과 총 대기 시간은 어떻게 바뀌고, 만료 600초는 바뀌나요? (답: 3·6·11절)</p>
            <p>livenessProbe에 periodSeconds 5, failureThreshold 6을 적으면 응답이 멈춘 컨테이너는 최대 몇 초 만에 재시작되며, 기본값과 비교해 무엇이 같으며 무엇이 다른가요? (답: 7절)</p>
            <p>두 시간째 CrashLoopBackOff인 Pod의 describe에 BackOff event가 <code>x37 over 2h</code>로만 보입니다. 왜 재시작 횟수보다 적게 보이고, 어제의 첫 크래시 원인을 보려면 어디를 봐야 하나요? (답: 9절)</p>
          </div>
        </section>
      </div>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={k8sPodStatesTrees}
        projectMetas={{
          kubernetes: { id: "kubernetes", label: "Kubernetes v1.37.1 원문", badgeClass: "bg-blue-500/10 border-blue-500 text-blue-700" },
          website: { id: "website", label: "kubernetes/website 공식 문서", badgeClass: "bg-emerald-500/10 border-emerald-500 text-emerald-700" },
        }}
      />
    </>
  );
}
