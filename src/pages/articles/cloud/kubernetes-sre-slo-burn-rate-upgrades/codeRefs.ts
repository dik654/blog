import type { CodeRef } from "@/components/code/types";
import upgradePolicyGo from "./codebase/kubernetes/cmd/kubeadm/app/phases/upgrade/policy.go?raw";
import kubeadmConstantsGo from "./codebase/kubernetes/cmd/kubeadm/app/constants/constants.go?raw";
import admissionTypesGo from "./codebase/kubernetes/staging/src/k8s.io/api/admissionregistration/v1/types.go?raw";

export const codeRefs: Record<string, CodeRef> = {
  "skew-constants": {
    path: "kubernetes/cmd/kubeadm/app/phases/upgrade/policy.go",
    highlight: [28, 38],
    desc: "kubeadm이 업그레이드 때 허용하는 버전 차이 세 개가 상수로 적혀 있습니다. 문서의 version skew policy가 코드에서는 이 세 숫자입니다.",
    annotations: [
      { lines: [30, 31], color: "sky", note: "control plane은 한 번에 minor 1단계만 올립니다. 1.23에서 1.25로 바로 가는 업그레이드는 여기서 막힙니다. 두 단계를 건너뛰면 API server끼리 1단계 차이라는 문서 규칙이 깨지기 때문입니다." },
      { lines: [36, 37], color: "amber", note: "kubelet은 control plane보다 minor 3단계까지 뒤처져도 됩니다. 노드가 많으면 kubelet을 한 번에 다 올리기 어렵다는 운영 현실을 반영한 숫자입니다." },
    ],
    code: upgradePolicyGo,
    lang: "go",
  },
  "skew-enforce": {
    path: "kubernetes/cmd/kubeadm/app/phases/upgrade/policy.go",
    highlight: [76, 104],
    desc: "kubeadm upgrade plan·apply가 새 버전을 받으면 먼저 이 함수로 세 규칙을 검사합니다. 어긴 규칙은 Mandatory(막음)와 Skippable(-f로 넘김) 둘로 나뉩니다.",
    annotations: [
      { lines: [77, 80], color: "sky", note: "목표 버전이 kubeadm이 지원하는 최소 control plane 버전(현재 − 1)보다 낮으면 무조건 거부합니다." },
      { lines: [82, 92], color: "amber", note: "정식 릴리스로 minor 2단계를 뛰면 Mandatory입니다. CI·실험 버전일 때만 Skippable이 되어 -f로 넘어갈 수 있습니다. 운영 cluster에서는 사실상 1단계씩만 올립니다." },
      { lines: [94, 104], color: "violet", note: "다운그레이드도 같은 폭입니다. Reddit이 1.24에서 1.23으로 되돌릴 때 백업 복원을 택한 이유 중 하나가 되돌리기 자체가 또 하나의 버전 변경이기 때문입니다." },
    ],
    code: upgradePolicyGo,
    lang: "go",
  },
  "skew-old-kubelets": {
    path: "kubernetes/cmd/kubeadm/app/phases/upgrade/policy.go",
    highlight: [172, 190],
    desc: "cluster의 kubelet 버전 목록을 받아 새 control plane 버전보다 minor 3단계 넘게 오래된 kubelet이 있으면 오류를 돌려줍니다.",
    annotations: [
      { lines: [179, 181], color: "sky", note: "새 버전 minor가 kubelet minor + 3보다 크면 그 kubelet은 너무 오래된 것입니다. 1.37로 올리려면 모든 kubelet이 1.34 이상이어야 합니다." },
      { lines: [183, 189], color: "amber", note: "너무 오래된 kubelet이 하나라도 있으면 어느 노드인지 버전 목록으로 알려 줍니다. 3단계 뒤처진 노드는 control plane보다 먼저 올려야 한다는 문서 문장이 이 검사입니다." },
    ],
    code: upgradePolicyGo,
    lang: "go",
  },
  "skew-minimum-versions": {
    path: "kubernetes/cmd/kubeadm/app/constants/constants.go",
    highlight: [485, 492],
    desc: "kubeadm 바이너리 자신의 버전에서 지원 범위를 계산합니다. 상수가 아니라 빌드된 버전에 −1·−3·0을 더한 값입니다.",
    annotations: [
      { lines: [485, 486], color: "sky", note: "지원하는 최소 control plane 버전은 kubeadm 버전 − 1입니다. kubeadm 1.37은 1.36 cluster만 1.37로 올릴 수 있습니다." },
      { lines: [488, 489], color: "amber", note: "지원하는 최소 kubelet 버전은 kubeadm 버전 − 3입니다. 문서의 'kubelet may be up to three minor versions older'가 여기서 나옵니다." },
    ],
    code: kubeadmConstantsGo,
    lang: "go",
  },
  "webhook-failure-policy": {
    path: "kubernetes/staging/src/k8s.io/api/admissionregistration/v1/types.go",
    highlight: [83, 92],
    desc: "admission webhook을 부르다 오류가 나면 요청을 통과시킬지(Ignore) 거부할지(Fail) 정하는 타입입니다.",
    annotations: [
      { lines: [88, 89], color: "sky", note: "Ignore면 webhook이 죽어도 API 요청은 통과합니다. 정책 검사는 빠지지만 cluster는 계속 움직입니다." },
      { lines: [90, 91], color: "amber", note: "Fail이면 webhook 호출 오류가 곧 요청 거부입니다. Reddit 장애에서 API server 쓰기가 전부 타임아웃으로 보인 이유가 이 선택입니다." },
    ],
    code: admissionTypesGo,
    lang: "go",
  },
  "webhook-defaults": {
    path: "kubernetes/staging/src/k8s.io/api/admissionregistration/v1/types.go",
    highlight: [814, 817],
    desc: "ValidatingWebhook의 failurePolicy는 비워 두면 Fail입니다. 같은 파일의 timeoutSeconds 주석은 기본 10초, 허용 범위 1~30초를 적습니다.",
    annotations: [
      { lines: [815, 817], color: "sky", note: "기본값이 Fail이므로 아무 설정 없이 등록한 webhook은 자기 장애를 cluster 전체의 쓰기 장애로 번지게 합니다. 모든 리소스를 보는 webhook일수록 이 기본값을 의식해야 합니다." },
    ],
    code: admissionTypesGo,
    lang: "go",
  },
  "webhook-timeout": {
    path: "kubernetes/staging/src/k8s.io/api/admissionregistration/v1/types.go",
    highlight: [904, 910],
    desc: "webhook 호출 제한 시간입니다. 넘기면 failurePolicy에 따라 무시하거나 API 호출을 실패시킵니다.",
    annotations: [
      { lines: [904, 908], color: "sky", note: "기본 10초, 최대 30초입니다. Fail 정책에서 webhook이 응답하지 않으면 모든 쓰기가 최대 30초씩 걸리다 실패합니다. 증상은 'API server가 느리다'로 보이고 원인은 webhook입니다." },
    ],
    code: admissionTypesGo,
    lang: "go",
  },
};
