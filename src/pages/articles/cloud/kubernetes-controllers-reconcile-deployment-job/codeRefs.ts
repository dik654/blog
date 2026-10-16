import type { CodeRef } from "@/components/code/types";
import appsDefaultsGo from "./codebase/kubernetes/pkg/apis/apps/v1/defaults.go?raw";
import batchDefaultsGo from "./codebase/kubernetes/pkg/apis/batch/v1/defaults.go?raw";
import deploymentUtilGo from "./codebase/kubernetes/pkg/controller/deployment/util/deployment_util.go?raw";
import deploymentSyncGo from "./codebase/kubernetes/pkg/controller/deployment/sync.go?raw";
import deploymentRollingGo from "./codebase/kubernetes/pkg/controller/deployment/rolling.go?raw";
import deploymentProgressGo from "./codebase/kubernetes/pkg/controller/deployment/progress.go?raw";
import replicaSetGo from "./codebase/kubernetes/pkg/controller/replicaset/replica_set.go?raw";
import controllerUtilsGo from "./codebase/kubernetes/pkg/controller/controller_utils.go?raw";
import controllerRefManagerGo from "./codebase/kubernetes/pkg/controller/controller_ref_manager.go?raw";
import jobControllerGo from "./codebase/kubernetes/pkg/controller/job/job_controller.go?raw";
import jobBackoffUtilsGo from "./codebase/kubernetes/pkg/controller/job/backoff_utils.go?raw";
import rateLimitersGo from "./codebase/kubernetes/staging/src/k8s.io/client-go/util/workqueue/default_rate_limiters.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "apps-defaults": {
    path: "kubernetes/pkg/apis/apps/v1/defaults.go",
    highlight: [54, 71],
    desc: "Deployment를 만들 때 비워 둔 필드를 API server가 채우는 함수입니다. 글의 25%·10·600이 모두 여기서 나옵니다.",
    annotations: [
      { lines: [54, 63], color: "sky", note: "maxUnavailable과 maxSurge를 각각 25%로 둡니다. replicas 3이면 0.75개라는 어중간한 값이 되고, 그 반올림 방향을 ResolveFenceposts가 정합니다." },
      { lines: [65, 68], color: "amber", note: "revisionHistoryLimit 10. 롤백용으로 남겨 두는 옛 ReplicaSet 수이고, 그 이상은 cleanupDeployment가 지웁니다." },
      { lines: [69, 72], color: "violet", note: "progressDeadlineSeconds 600. 10분 동안 진전이 없으면 Progressing=False 조건이 붙을 뿐 롤백은 하지 않습니다." },
    ],
    code: appsDefaultsGo,
    lang: "go",
  },
  fenceposts: {
    path: "kubernetes/pkg/controller/deployment/util/deployment_util.go",
    highlight: [883, 902],
    desc: "25%를 실제 Pod 수로 바꾸는 함수입니다. surge는 올림, unavailable은 내림이라 replicas 3에서 1과 0이 됩니다.",
    annotations: [
      { lines: [884, 884], color: "sky", note: "마지막 인자 true가 올림입니다. 3 × 25% = 0.75 → 1. 그래서 롤아웃 중 Pod는 최대 4개입니다." },
      { lines: [888, 888], color: "amber", note: "false는 내림입니다. 0.75 → 0. 가용 Pod는 3개 아래로 내려갈 수 없습니다." },
      { lines: [893, 898], color: "rose", note: "둘 다 0이면 아무것도 움직일 수 없으므로 unavailable을 1로 올립니다. 주석은 quota 때문에 surge가 안 될 수 있다는 이유를 적습니다." },
    ],
    code: deploymentUtilGo,
    lang: "go",
  },
  "new-rs-hash": {
    path: "kubernetes/pkg/controller/deployment/sync.go",
    highlight: [196, 216],
    desc: "template이 바뀌어 새 ReplicaSet을 만드는 자리입니다. template 해시가 라벨과 selector와 이름에 함께 들어갑니다.",
    annotations: [
      { lines: [197, 199], color: "sky", note: "Pod template을 해시해 pod-template-hash 라벨을 붙입니다. 같은 Deployment의 두 ReplicaSet이 서로 다른 Pod를 고르는 근거입니다." },
      { lines: [201, 201], color: "amber", note: "selector에도 같은 해시를 더합니다. Deployment의 selector는 두 세대를 모두 고르지만 ReplicaSet의 selector는 자기 세대만 고릅니다." },
      { lines: [208, 210], color: "violet", note: "이름은 Deployment 이름 + 해시로 결정적이고, ownerReferences에 Deployment가 controller로 들어갑니다. kubectl get rs에서 보는 web-7d4f8c9b 같은 이름입니다." },
    ],
    code: deploymentSyncGo,
    lang: "go",
  },
  "cleanup-rs": {
    path: "kubernetes/pkg/controller/deployment/sync.go",
    highlight: [441, 470],
    desc: "롤아웃이 끝난 뒤 옛 ReplicaSet을 revisionHistoryLimit 개수만 남기고 지우는 함수입니다.",
    annotations: [
      { lines: [453, 456], color: "sky", note: "지울 수 있는 옛 ReplicaSet 수에서 한도 10을 뺀 만큼만 지웁니다. 11번째 롤아웃부터 가장 오래된 하나가 사라집니다." },
      { lines: [463, 466], color: "amber", note: "replicas가 0이 아니거나 아직 관찰이 끝나지 않은 ReplicaSet은 건너뜁니다. 롤백 대상이 될 수 있는 것은 지우지 않습니다." },
    ],
    code: deploymentSyncGo,
    lang: "go",
  },
  "rollout-rolling": {
    path: "kubernetes/pkg/controller/deployment/rolling.go",
    highlight: [31, 66],
    desc: "RollingUpdate 한 번의 reconcile입니다. 늘릴 수 있으면 새 ReplicaSet을 늘리고, 아니면 옛 ReplicaSet을 줄이고, 둘 다 못 하면 상태만 갱신합니다.",
    annotations: [
      { lines: [39, 46], color: "sky", note: "먼저 새 ReplicaSet을 늘려 봅니다. 늘렸으면 이번 reconcile은 여기서 끝나고 다음 변화(새 Pod가 available이 됨)를 기다립니다." },
      { lines: [49, 56], color: "amber", note: "늘릴 수 없으면 옛 ReplicaSet을 줄여 봅니다. 한 reconcile에 한 방향만 움직이므로 글의 3/0 → 3/1 → 2/1 → 2/2 … 사다리가 생깁니다." },
      { lines: [58, 62], color: "violet", note: "완료됐으면 옛 ReplicaSet을 정리합니다. 이 세 분기 전체가 '현재와 목표의 차이를 한 걸음 줄인다'는 reconcile의 모양입니다." },
    ],
    code: deploymentRollingGo,
    lang: "go",
  },
  "old-rs-scaledown": {
    path: "kubernetes/pkg/controller/deployment/rolling.go",
    highlight: [95, 152],
    desc: "옛 ReplicaSet을 얼마나 줄일 수 있는지 계산하는 자리입니다. 주석의 10 replicas 예시가 그대로 식이 됩니다.",
    annotations: [
      { lines: [102, 105], color: "sky", note: "maxScaledDown = 전체 Pod 수 − 최소 가용 수 − 새 ReplicaSet의 미가용 수. 새 Pod가 아직 Ready가 아니면 그만큼 옛 Pod를 더 남깁니다." },
      { lines: [127, 133], color: "amber", note: "글의 사례에서 4 − 3 − 1 = 0이라 새 Pod가 Ready가 되기 전에는 옛 Pod를 하나도 줄이지 않습니다. Ready가 되면 4 − 3 − 0 = 1입니다." },
      { lines: [135, 136], color: "violet", note: "비정상 Pod부터 먼저 정리합니다. 이슈 #16737처럼 CrashLoop인 옛 Pod가 롤아웃을 막는 일을 피하기 위해서입니다." },
    ],
    code: deploymentRollingGo,
    lang: "go",
  },
  "progress-timeout": {
    path: "kubernetes/pkg/controller/deployment/progress.go",
    highlight: [86, 95],
    desc: "progressDeadlineSeconds를 넘겼을 때 하는 일의 전부입니다. 조건 하나를 적을 뿐 롤백 호출은 없습니다.",
    annotations: [
      { lines: [86, 86], color: "sky", note: "DeploymentTimedOut이 참이면 아래로 내려옵니다. 10분 동안 Progressing 조건의 LastUpdateTime이 바뀌지 않았다는 뜻입니다." },
      { lines: [93, 94], color: "rose", note: "Progressing=False, reason ProgressDeadlineExceeded를 세팅합니다. 이 함수 어디에도 rollback은 없고, 문서도 상위 도구가 이 조건을 보고 행동하라고 적습니다." },
    ],
    code: deploymentProgressGo,
    lang: "go",
  },
  "manage-replicas": {
    path: "kubernetes/pkg/controller/replicaset/replica_set.go",
    highlight: [649, 725],
    desc: "ReplicaSet reconcile의 본체입니다. 현재 Pod 수와 spec.replicas의 차이 하나로 만들지 지울지를 정합니다.",
    annotations: [
      { lines: [650, 650], color: "sky", note: "diff = 활성 Pod 수 − replicas. 글의 사례에서 Pod 하나를 지운 직후 2 − 3 = −1입니다." },
      { lines: [657, 667], color: "amber", note: "모자라면 부호를 바꾸고 한 번에 최대 500(BurstReplicas)으로 자른 뒤, 만들 개수를 expectations에 먼저 적습니다. informer가 그 Pod를 볼 때까지 같은 ReplicaSet을 다시 세지 않습니다." },
      { lines: [677, 678], color: "violet", note: "CreatePods는 template으로 새 Pod를 만들고 ownerReferences에 이 ReplicaSet을 적습니다. 새 이름·새 UID이므로 지운 Pod가 '되살아난' 것이 아닙니다." },
      { lines: [700, 718], color: "rose", note: "많으면 getPodsToDelete로 누구를 지울지 고르고 삭제 기대값을 적습니다. 미배치·Pending·NotReady 순으로 먼저 지웁니다." },
    ],
    code: replicaSetGo,
    lang: "go",
  },
  "slow-start": {
    path: "kubernetes/pkg/controller/replicaset/replica_set.go",
    highlight: [876, 911],
    desc: "Pod를 1, 2, 4, 8개씩 늘려 가며 만드는 함수입니다. 첫 배치가 실패하면 나머지는 시도하지 않습니다.",
    annotations: [
      { lines: [889, 889], color: "sky", note: "배치 크기는 1에서 시작해 성공할 때마다 두 배가 됩니다. 500개를 만들 때 1 + 2 + 4 + … 로 9번의 배치가 필요합니다." },
      { lines: [904, 906], color: "rose", note: "한 배치에서 오류가 하나라도 나면 남은 배치를 건너뜁니다. ResourceQuota로 전부 실패할 요청 500개를 API server에 쏟지 않기 위한 장치입니다." },
    ],
    code: replicaSetGo,
    lang: "go",
  },
  "claim-object": {
    path: "kubernetes/pkg/controller/controller_ref_manager.go",
    highlight: [69, 125],
    desc: "ReplicaSet이 어떤 Pod를 자기 것으로 셀지 정하는 함수입니다. 소유 중인데 selector가 안 맞으면 놓아주고, 고아인데 맞으면 입양합니다.",
    annotations: [
      { lines: [70, 80], color: "sky", note: "ownerReferences의 controller가 나이고 selector도 맞으면 그대로 내 Pod입니다. 평소 모든 Pod가 이 분기에서 끝납니다." },
      { lines: [82, 98], color: "amber", note: "내가 소유하지만 selector가 더는 맞지 않으면 release합니다. 운영자가 Pod 라벨을 바꿔 selector에서 빼면 여기로 와서 ownerReference가 지워지고, 개수가 모자라진 ReplicaSet은 새 Pod를 만듭니다." },
      { lines: [101, 125], color: "violet", note: "소유자가 없는 Pod가 selector에 맞으면 adopt합니다. 그래서 selector와 같은 라벨의 bare Pod를 만들면 ReplicaSet이 가져가 개수에 넣습니다." },
    ],
    code: controllerRefManagerGo,
    lang: "go",
  },
  "delete-ranks": {
    path: "kubernetes/pkg/controller/controller_utils.go",
    highlight: [843, 870],
    desc: "줄일 때 어느 Pod를 먼저 지울지 정하는 비교 함수입니다. 덜 준비된 Pod부터 지웁니다.",
    annotations: [
      { lines: [844, 848], color: "sky", note: "노드에 아직 배치되지 않은 Pod가 가장 먼저입니다. 막 만든 Pending Pod를 지우는 쪽이 서비스 중인 Pod를 지우는 것보다 쌉니다." },
      { lines: [849, 856], color: "amber", note: "다음은 Pending < Unknown < Running, 그다음 NotReady < Ready입니다. 글의 롤아웃에서 옛 ReplicaSet을 줄일 때 Ready인 세 Pod 사이에서는 아래 기준으로 내려갑니다." },
      { lines: [859, 866], color: "violet", note: "pod-deletion-cost 애너테이션이 낮은 Pod가 먼저입니다. 운영자가 '이 Pod는 비싸다'를 알려 줄 수 있는 유일한 자리입니다." },
    ],
    code: controllerUtilsGo,
    lang: "go",
  },
  "expectations-timeout": {
    path: "kubernetes/pkg/controller/controller_utils.go",
    highlight: [72, 87],
    desc: "컨트롤러가 자기가 한 일을 기억하는 시간과 slow start 배치의 시작 크기입니다.",
    annotations: [
      { lines: [72, 72], color: "sky", note: "만들거나 지운 Pod를 informer가 5분 안에 보지 못하면 기대값을 버리고 다시 셉니다. 그 사이 ReplicaSet은 같은 Pod를 두 번 만들지 않습니다." },
      { lines: [73, 87], color: "amber", note: "첫 배치는 1개입니다. 주석의 식대로 N개를 만들려면 1 + floor(log₂(ceil(N)))번의 배치가 듭니다." },
    ],
    code: controllerUtilsGo,
    lang: "go",
  },
  "job-backoff-consts": {
    path: "kubernetes/pkg/controller/job/job_controller.go",
    highlight: [72, 79],
    desc: "Job의 두 가지 지연 상수입니다. API 재시도 지연과 Pod 실패 재생성 지연은 서로 다른 층입니다.",
    annotations: [
      { lines: [72, 75], color: "sky", note: "API 호출이 실패했을 때 workqueue가 같은 Job을 다시 꺼내는 간격은 1초에서 1분까지입니다. Pod 실패와 무관합니다." },
      { lines: [76, 79], color: "amber", note: "Pod가 실패했을 때 다음 Pod를 만들기까지 10초에서 시작해 두 배씩, 상한 10분입니다. 글의 10·20·40·80·160·320초가 이 두 값에서 나옵니다." },
    ],
    code: jobControllerGo,
    lang: "go",
  },
  "job-failure-check": {
    path: "kubernetes/pkg/controller/job/job_controller.go",
    highlight: [1068, 1095],
    desc: "Job을 실패로 확정하는 판정입니다. 실패 Pod 수가 backoffLimit보다 커야 하므로 기본값 6에서는 7번째 실패에 끝납니다.",
    annotations: [
      { lines: [1068, 1068], color: "sky", note: "failed > backoffLimit입니다. 등호가 없어서 실패 6개까지는 계속 재시도하고 7개째에 참이 됩니다." },
      { lines: [1087, 1090], color: "amber", note: "restartPolicy OnFailure면 Pod 안 컨테이너 재시작 수(pastBackoffLimitOnFailure)도 같은 한도에 셉니다. 어느 쪽이든 BackoffLimitExceeded 조건이 붙습니다." },
      { lines: [1091, 1092], color: "violet", note: "activeDeadlineSeconds도 같은 자리에서 판정합니다. 문서대로 deadline이 backoffLimit보다 먼저 올 수 있습니다." },
    ],
    code: jobControllerGo,
    lang: "go",
  },
  "job-backoff-time": {
    path: "kubernetes/pkg/controller/job/backoff_utils.go",
    highlight: [255, 276],
    desc: "마지막 성공 이후 연속 실패 수로 다음 Pod까지 기다릴 시간을 계산하는 함수입니다.",
    annotations: [
      { lines: [256, 258], color: "sky", note: "실패가 0이면 바로 만듭니다." },
      { lines: [260, 266], color: "amber", note: "10초에서 시작해 (실패 수 − 1)번 두 배로 늘리고 10분에서 멈춥니다. 1회 10초, 2회 20초, …, 6회 320초, 7회부터 600초입니다. 기본 backoffLimit 6에서는 7회째 실패에 Job이 끝나므로 상한 10분을 기다리는 일은 없습니다." },
      { lines: [268, 275], color: "violet", note: "마지막 실패 뒤 흐른 시간을 빼서 남은 대기만 돌려줍니다. 이미 지났으면 0입니다." },
    ],
    code: jobBackoffUtilsGo,
    lang: "go",
  },
  "batch-defaults": {
    path: "kubernetes/pkg/apis/batch/v1/defaults.go",
    highlight: [35, 65],
    desc: "Job 기본값입니다. completions·parallelism 1, backoffLimit 6, podReplacementPolicy는 podFailurePolicy 유무에 따라 다릅니다.",
    annotations: [
      { lines: [35, 41], color: "sky", note: "둘 다 비면 1·1. Pod 하나가 한 번 성공하면 끝나는 가장 단순한 Job입니다." },
      { lines: [42, 48], color: "amber", note: "backoffLimit 6. backoffLimitPerIndex를 쓰면 전체 한도는 사실상 무한(MaxInt32)이 됩니다." },
      { lines: [60, 65], color: "violet", note: "podFailurePolicy가 있으면 Failed(완전히 끝난 뒤 교체), 없으면 TerminatingOrFailed(종료가 시작되면 바로 교체)입니다." },
    ],
    code: batchDefaultsGo,
    lang: "go",
  },
  "workqueue-ratelimit": {
    path: "kubernetes/staging/src/k8s.io/client-go/util/workqueue/default_rate_limiters.go",
    highlight: [48, 55],
    desc: "대부분의 컨트롤러가 쓰는 기본 재시도 제한입니다. 오류가 나면 같은 key를 5ms부터 두 배씩 늦춰 다시 꺼냅니다.",
    annotations: [
      { lines: [52, 52], color: "sky", note: "item별 지수 지연 5ms → 1000s. 한 ReplicaSet이 계속 실패해도 다른 ReplicaSet의 처리는 막지 않습니다." },
      { lines: [54, 54], color: "amber", note: "전체 token bucket 10 qps, burst 100. 둘 중 큰 지연을 씁니다." },
    ],
    code: rateLimitersGo,
    lang: "go",
  },
};
