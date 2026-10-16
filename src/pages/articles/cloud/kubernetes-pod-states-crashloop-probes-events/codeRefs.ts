import type { CodeRef } from "@/components/code/types";
import kubeletGo from "./codebase/kubernetes/pkg/kubelet/kubelet.go?raw";
import kubeletDefaultsGo from "./codebase/kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go?raw";
import runtimeManagerGo from "./codebase/kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go?raw";
import backoffGo from "./codebase/kubernetes/staging/src/k8s.io/client-go/util/flowcontrol/backoff.go?raw";
import imageTypesGo from "./codebase/kubernetes/pkg/kubelet/images/types.go?raw";
import coreDefaultsGo from "./codebase/kubernetes/pkg/apis/core/v1/defaults.go?raw";
import apiserverOptionsGo from "./codebase/kubernetes/pkg/controlplane/apiserver/options/options.go?raw";
import eventsCacheGo from "./codebase/kubernetes/staging/src/k8s.io/client-go/tools/record/events_cache.go?raw";
import kubeFeaturesGo from "./codebase/kubernetes/pkg/features/kube_features.go?raw";
import lifecycleDoc from "./codebase/website/content/en/docs/concepts/workloads/pods/pod-lifecycle.md?raw";
import probesDoc from "./codebase/website/content/en/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md?raw";
import debugPodsDoc from "./codebase/website/content/en/docs/tasks/debug/debug-application/debug-pods.md?raw";

export const codeRefs: Record<string, CodeRef> = {
  "status-vs-phase-doc": {
    path: "website/content/en/docs/concepts/workloads/pods/pod-lifecycle.md",
    highlight: [120, 133],
    desc: "kubectl의 STATUS 열은 사용자 직관용 표시이고 Pod의 phase와 다르다는 공식 문서의 note입니다. RESTARTS 200인 예시 출력이 여기 있습니다.",
    annotations: [
      { lines: [122, 126], color: "sky", note: "CrashLoopBackOff·Terminating은 STATUS 열에만 나오는 단어이고 phase(Pending·Running·Succeeded·Failed·Unknown)가 아닙니다. API에서 보려면 containerStatuses[].state.waiting.reason을 읽어야 합니다." },
      { lines: [129, 132], color: "amber", note: "READY 0/1, STATUS CrashLoopBackOff, RESTARTS 200, AGE 2d9h입니다. 3절에서 이 네 숫자로 Pod가 실제로 무엇을 하고 있었는지 역산합니다." },
    ],
    code: lifecycleDoc,
    lang: "python",
  },
  "pending-waiting-doc": {
    path: "website/content/en/docs/tasks/debug/debug-application/debug-pods.md",
    highlight: [43, 66],
    desc: "디버깅 문서가 Pending과 Waiting을 나눠 설명하는 부분입니다. Pending은 노드를 못 받은 것, Waiting은 노드는 받았는데 못 뜨는 것입니다.",
    annotations: [
      { lines: [43, 47], color: "sky", note: "Pending은 스케줄이 안 된 상태입니다. describe 출력의 scheduler 메시지(Insufficient cpu 등)를 보라고 합니다." },
      { lines: [62, 65], color: "amber", note: "Waiting은 이미 노드에 배치됐지만 그 노드에서 못 도는 상태입니다. 가장 흔한 원인은 이미지 pull 실패입니다. kubectl은 둘 다 STATUS 열에 다른 단어로 보여 줍니다." },
    ],
    code: debugPodsDoc,
    lang: "python",
  },
  "image-pull-errors": {
    path: "kubernetes/pkg/kubelet/images/types.go",
    highlight: [26, 42],
    desc: "이미지 단계에서 STATUS 열에 나오는 단어들의 정의입니다.",
    annotations: [
      { lines: [28, 29], color: "sky", note: "ImagePullBackOff는 pull이 실패해 kubelet이 재시도를 미루고 있다는 뜻입니다. 간격은 10초에서 300초까지 두 배씩 늘어납니다." },
      { lines: [34, 35], color: "amber", note: "ErrImagePull은 방금 pull이 실패한 순간의 단어입니다. 몇 초 뒤 ImagePullBackOff로 바뀌므로 두 단어는 같은 원인의 두 시점입니다." },
      { lines: [37, 41], color: "violet", note: "ErrImageNeverPull은 imagePullPolicy Never인데 이미지가 노드에 없을 때, InvalidImageName은 이름 자체가 틀렸을 때입니다. 둘은 기다려도 낫지 않습니다." },
    ],
    code: imageTypesGo,
    lang: "go",
  },
  "crashloop-constants": {
    path: "kubernetes/pkg/kubelet/kubelet.go",
    highlight: [165, 180],
    desc: "CrashLoopBackOff와 ImagePullBackOff의 시계 상수입니다. 시작 10초, 상한 300초입니다.",
    annotations: [
      { lines: [165, 166], color: "sky", note: "MaxCrashLoopBackOff는 v1beta1.MaxContainerBackOff = 300초입니다. 상한에 닿은 뒤로는 재시작마다 5분을 기다립니다." },
      { lines: [172, 173], color: "amber", note: "initialCrashLoopBackOff 10초가 첫 대기입니다. 10 → 20 → 40 → 80 → 160 → 300초로 여섯 번째 재시작에서 상한에 닿습니다." },
      { lines: [168, 170], color: "violet", note: "alpha 게이트 ReduceDefaultCrashLoopBackOffDecay를 켜면 상한 60초·시작 1초(176~177행)로 줄어듭니다. 1.37에서도 기본은 꺼져 있습니다." },
      { lines: [179, 180], color: "emerald", note: "이미지 pull backoff도 같은 상한 300초를 씁니다. 시작값은 226행의 imageBackOffPeriod 10초입니다." },
    ],
    code: kubeletGo,
    lang: "go",
  },
  "crashloop-newbackoff": {
    path: "kubernetes/pkg/kubelet/kubelet.go",
    highlight: [353, 372],
    desc: "kubelet 시작 시 두 feature gate와 kubelet 설정으로 backoff의 시작값·상한을 정하는 함수입니다.",
    annotations: [
      { lines: [354, 359], color: "sky", note: "기본은 300초·10초입니다. ReduceDefaultCrashLoopBackOffDecay가 켜져 있으면 60초·1초로 바꿉니다." },
      { lines: [361, 366], color: "amber", note: "KubeletCrashLoopBackOffMax가 켜져 있으면(1.35부터 beta·기본 on) kubelet 설정 crashLoopBackOff.maxContainerRestartPeriod가 상한을 덮어씁니다. 상한이 시작값보다 작으면 시작값도 그 상한으로 내립니다." },
    ],
    code: kubeletGo,
    lang: "go",
  },
  "crashloop-expiry": {
    path: "kubernetes/pkg/kubelet/kubelet.go",
    highlight: [1085, 1090],
    desc: "backoff 장부를 만들고 만료 규칙을 600초로 바꾸는 곳입니다. 10분 동안 크래시가 없으면 다음 크래시는 첫 크래시처럼 10초부터 다시 셉니다.",
    annotations: [
      { lines: [1087, 1087], color: "sky", note: "flowcontrol.NewBackOff(base, boMax)는 jitter 없는 두 배 증가 장부입니다." },
      { lines: [1088, 1090], color: "amber", note: "기본 만료 규칙은 2 × 상한 = 600초인데 kubelet은 HasExpiredFunc로 명시적으로 600초를 적습니다. 상한을 100초로 바꿔도 만료는 10분 그대로라는 뜻입니다." },
    ],
    code: kubeletGo,
    lang: "go",
  },
  "max-container-backoff": {
    path: "kubernetes/pkg/kubelet/apis/config/v1beta1/defaults.go",
    highlight: [44, 46],
    desc: "300초 상한의 원래 정의와 KubeletCrashLoopBackOffMax 설정의 기본값입니다.",
    annotations: [
      { lines: [44, 45], color: "sky", note: "MaxContainerBackOff = 300초입니다. 310~313행에서 게이트가 켜져 있고 maxContainerRestartPeriod가 비어 있으면 이 값으로 채웁니다. 그래서 1.35 이후 기본 동작은 그대로 300초입니다." },
    ],
    code: kubeletDefaultsGo,
    lang: "go",
  },
  "do-backoff": {
    path: "kubernetes/pkg/kubelet/kuberuntime/kuberuntime_manager.go",
    highlight: [2077, 2109],
    desc: "컨테이너를 다시 띄우기 전에 backoff 장부를 확인하는 함수입니다. CrashLoopBackOff 단어와 'Back-off restarting failed container' event가 여기서 나옵니다.",
    annotations: [
      { lines: [2080, 2089], color: "sky", note: "마지막으로 종료된(Exited) 컨테이너 상태를 찾습니다. 없으면 첫 시작이라 backoff 없이 바로 띄웁니다." },
      { lines: [2093, 2095], color: "amber", note: "기준 시각 ts는 컨테이너의 FinishedAt입니다. 장부 키는 Pod UID와 컨테이너 이름으로 만들어 컨테이너마다 따로 셉니다." },
      { lines: [2096, 2104], color: "violet", note: "아직 backoff 창 안이면 Warning event 'Back-off restarting failed container'를 남기고 ErrCrashLoopBackOff를 돌려줍니다. 이 오류의 이름이 STATUS 열의 단어가 됩니다." },
      { lines: [2107, 2108], color: "emerald", note: "창을 벗어났으면 Next로 다음 대기(두 배)를 적어 두고 false를 돌려줘 컨테이너를 띄웁니다. 그러니 재시작 '직전'에 다음 대기가 정해집니다." },
    ],
    code: runtimeManagerGo,
    lang: "go",
  },
  "backoff-next": {
    path: "kubernetes/staging/src/k8s.io/client-go/util/flowcontrol/backoff.go",
    highlight: [95, 131],
    desc: "client-go의 범용 backoff 장부입니다. Next가 두 배로 늘리고 IsInBackOffSince가 창 안인지 봅니다.",
    annotations: [
      { lines: [100, 102], color: "sky", note: "항목이 없거나 만료됐으면 시작값(10초)으로 새로 만듭니다. 만료 판정은 kubelet이 600초로 바꿔 둔 hasExpired입니다." },
      { lines: [104, 106], color: "amber", note: "있으면 두 배로 늘리고 상한(300초)에서 자릅니다. NewBackOff로 만든 장부는 jitter가 0이라 10·20·40·80·160·300이 정확히 나옵니다." },
      { lines: [119, 130], color: "violet", note: "IsInBackOffSince는 '종료 시각 이후 지난 시간 < 현재 대기'를 봅니다. FinishedAt 기준이라 kubelet이 늦게 확인해도 대기가 그만큼 길어지지 않습니다." },
    ],
    code: backoffGo,
    lang: "go",
  },
  "probe-defaults": {
    path: "kubernetes/pkg/apis/core/v1/defaults.go",
    highlight: [275, 288],
    desc: "probe 네 필드의 기본값입니다. initialDelaySeconds는 0으로 두어 여기 없습니다.",
    annotations: [
      { lines: [276, 278], color: "sky", note: "timeoutSeconds 1초입니다. GC pause나 CPU throttling으로 1초를 넘기면 그 회차는 실패로 셉니다." },
      { lines: [279, 281], color: "amber", note: "periodSeconds 10초마다 검사합니다." },
      { lines: [285, 287], color: "violet", note: "failureThreshold 3이라 연속 세 번, 곧 최대 약 30초 안에 세 번 실패하면 liveness는 재시작, readiness는 endpoint 제거입니다. successThreshold 1은 한 번 성공으로 복귀한다는 뜻입니다." },
    ],
    code: coreDefaultsGo,
    lang: "go",
  },
  "startup-probe-doc": {
    path: "website/content/en/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md",
    highlight: [302, 338],
    desc: "느리게 뜨는 앱을 위해 startupProbe로 liveness를 미루는 공식 예시입니다. 30 × 10 = 300초가 허용된 시작 시간입니다.",
    annotations: [
      { lines: [307, 309], color: "sky", note: "startupProbe의 failureThreshold × periodSeconds가 최악의 시작 시간을 덮도록 잡습니다." },
      { lines: [333, 338], color: "amber", note: "startup이 한 번 성공하면 liveness가 넘겨받습니다. 300초 안에 한 번도 성공하지 못하면 컨테이너는 죽고 restartPolicy를 따릅니다. liveness의 initialDelaySeconds를 크게 잡는 것보다 교착 감지가 빠릅니다." },
    ],
    code: probesDoc,
    lang: "python",
  },
  "probes-independent-doc": {
    path: "website/content/en/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes.md",
    highlight: [355, 359],
    desc: "readiness와 liveness는 서로 의존하지 않는다는 caution입니다. 8절 재시작 폭풍의 전제입니다.",
    annotations: [
      { lines: [356, 358], color: "sky", note: "readiness가 실패해 endpoint에서 빠져 있어도 liveness는 따로 돌고, liveness가 실패하면 readiness와 무관하게 재시작됩니다." },
    ],
    code: probesDoc,
    lang: "python",
  },
  "event-ttl": {
    path: "kubernetes/pkg/controlplane/apiserver/options/options.go",
    highlight: [125, 131],
    desc: "kube-apiserver의 event 보존 시간 기본값입니다. 1시간이 지나면 etcd에서 사라집니다.",
    annotations: [
      { lines: [129, 129], color: "sky", note: "EventTTL 1시간입니다. 162행의 --event-ttl 플래그로 바꿀 수 있지만 관리형 클러스터에서는 대개 손댈 수 없습니다. 장애 직후 수집하거나 event exporter로 로그 저장소에 흘려 둬야 하는 이유입니다." },
    ],
    code: apiserverOptionsGo,
    lang: "go",
  },
  "event-aggregation": {
    path: "kubernetes/staging/src/k8s.io/client-go/tools/record/events_cache.go",
    highlight: [36, 49],
    desc: "event를 보내는 쪽(kubelet 등)이 같은 event를 묶고 걸러 내는 상수입니다. describe의 'x15 over 3m'와 '(combined from similar events)'가 여기서 나옵니다.",
    annotations: [
      { lines: [38, 41], color: "sky", note: "메시지만 다른 같은 event가 10분 안에 10개를 넘으면 하나로 합치고 메시지 앞에 '(combined from similar events): '를 붙입니다(185행)." },
      { lines: [43, 48], color: "amber", note: "한 source가 한 객체에 대해 처음 25개는 바로 보내고 그 뒤로는 300초에 1개씩만 보냅니다. 계속 실패하는 컨테이너의 event가 '빠져 보이는' 이유이고, 그 사이 반복은 count 증가로만 기록됩니다." },
    ],
    code: eventsCacheGo,
    lang: "go",
  },
  "crashloop-feature-gates": {
    path: "kubernetes/pkg/features/kube_features.go",
    highlight: [1754, 1757],
    desc: "KubeletCrashLoopBackOffMax(KEP-5593)의 단계입니다. 1.32 alpha, 1.35 beta·기본 on입니다.",
    annotations: [
      { lines: [1755, 1756], color: "sky", note: "1.35부터 기본으로 켜지므로 kubelet 설정 crashLoopBackOff.maxContainerRestartPeriod만 적으면 노드별 상한을 바꿀 수 있습니다. 적지 않으면 300초입니다." },
    ],
    code: kubeFeaturesGo,
    lang: "go",
  },
  "reduced-decay-gate": {
    path: "kubernetes/pkg/features/kube_features.go",
    highlight: [2044, 2046],
    desc: "ReduceDefaultCrashLoopBackOffDecay(KEP-4603)의 단계입니다. 1.33 alpha, 기본 off입니다.",
    annotations: [
      { lines: [2045, 2045], color: "sky", note: "켜면 클러스터 전체의 시작값·상한이 1초·60초가 됩니다. 1.37.1에서도 alpha라 운영 클러스터에서는 보통 꺼져 있습니다." },
    ],
    code: kubeFeaturesGo,
    lang: "go",
  },
  "restart-backoff-doc": {
    path: "website/content/en/docs/concepts/workloads/pods/pod-lifecycle.md",
    highlight: [383, 392],
    desc: "공식 문서의 재시작 backoff 설명입니다. 10s, 20s, 40s… 상한 300초, 10분 정상 실행 후 초기화입니다.",
    annotations: [
      { lines: [385, 388], color: "sky", note: "'exponential backoff delay (10s, 20s, 40s, …), that is capped at 300 seconds'와 'executed for 10 minutes without any problems' 두 문장이 kubelet.go의 상수와 HasExpiredFunc에 대응합니다." },
    ],
    code: lifecycleDoc,
    lang: "python",
  },
};
