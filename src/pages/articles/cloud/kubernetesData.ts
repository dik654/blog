import type { CloudCertificationArticleData } from "./CloudCertificationArticle";
import type { EngineeringDepthData } from "./EngineeringDepthBlocks";

const checkedAt = "2026-10-08";

const kubernetesCkaDepth: EngineeringDepthData = {
  ledgers: [
    {
      section: "mechanism",
      title: "Pod 한 개가 Ready가 될 때까지 확인할 담당자와 증거",
      question: "Pending이라는 한 단어를 보고 manifest부터 고치지 않고 첫 실패 경계를 찾을 수 있습니까?",
      columns: ["전환", "이 전환의 소유자", "먼저 볼 증거", "성공 조건"],
      rows: [
        ["요청 → 저장된 의도", "API front door와 persistence", "kubectl 응답·object generation", "요청한 spec이 읽힘"],
        ["미배치 → node 선택", "placement loop", "PodScheduled condition·event", "spec.nodeName이 정해짐"],
        ["node 선택 → sandbox", "node agent·container runtime", "kubelet journal·runtime status", "Pod sandbox와 container 생성"],
        ["sandbox → network·volume", "network·storage plugin", "Pod IP·mount event·plugin log", "주소와 mount가 준비됨"],
        ["process → Ready", "application probe", "container log·readiness condition", "endpoint 후보로 게시됨"],
        ["Ready → client", "Service·DNS·Gateway data path", "EndpointSlice·DNS·request trace", "실제 요청이 SLO 안에서 성공"],
      ],
      conclusion: "상태 이름을 resource 종류별로 외우지 말고, 마지막으로 성공한 전환 다음의 owner와 evidence를 확인합니다.",
    },
    {
      section: "comparison",
      title: "CKA 40시간 실습 배분표",
      question: "공식 비중을 읽기 시간이 아니라 복구할 장애와 남길 증거로 바꾸면 무엇이 달라집니까?",
      columns: ["공식 영역", "설명용 시간", "반복할 장애", "남길 증거"],
      rows: [
        ["Troubleshooting 30%", "12시간", "NotReady node·component crash·Service timeout", "before/after status·event·journal"],
        ["Cluster Architecture 25%", "10시간", "kubeadm join·certificate·HA endpoint", "config·health·rollback"],
        ["Services & Networking 20%", "8시간", "selector·DNS·policy·Gateway 오류", "EndpointSlice·query·packet path"],
        ["Workloads & Scheduling 15%", "6시간", "rollout·probe·affinity·resource shortage", "revision·condition·event"],
        ["Storage 10%", "4시간", "PVC Pending·access mode·reclaim", "class·claim·mount·읽기·쓰기 시험"],
      ],
      conclusion: "40시간은 합격 예측치가 아니라 설명용 예산입니다. 같은 장애를 문서 없이 1회, 공식 문서를 찾아 1회, 시간 제한을 두고 1회 반복합니다.",
    },
  ],
  evidence: [
    {
      section: "mechanism",
      eyebrow: "실습 1 · context에서 첫 실패 전환까지",
      title: "먼저 cluster·namespace를 고정하고 condition과 event를 읽습니다",
      question: "checkout replica 하나가 Pending인 이유를 어느 명령에서 처음 확인할 수 있습니까?",
      body: "명령은 넓은 상태에서 한 Pod로 좁혀 갑니다. 예시 출력은 실측이 아니며, 실제 실습에서는 원문 전체와 시각을 파일로 보관합니다. Event는 보존 기간이 짧을 수 있으므로 장애 직후 수집합니다.",
      language: "shell",
      command: [
        "kubectl config current-context",
        "kubectl config view --minify --output 'jsonpath={..namespace}{\"\\n\"}'",
        "kubectl -n shop get deploy checkout",
        "kubectl -n shop get pods -l app=checkout -o wide",
        "kubectl -n shop get pod checkout-7d8f-abc -o jsonpath='{.status.conditions}'",
        "kubectl -n shop get events --field-selector involvedObject.name=checkout-7d8f-abc --sort-by=.metadata.creationTimestamp",
        "kubectl -n shop describe pod checkout-7d8f-abc",
      ].join("\n"),
      normal: {
        label: "정상 판독 · 예시 출력",
        output: "(예시 출력 — 실측 아님)\nREADY 1/1  STATUS Running\nPodScheduled=True\nReady=True",
        reading: "배치와 실행, readiness가 모두 통과했습니다. 그래도 client 성공은 EndpointSlice와 실제 요청으로 별도 확인합니다.",
      },
      failure: {
        label: "실패 판독 · 예시 출력",
        output: "(예시 출력 — 실측 아님)\nREADY 0/1  STATUS Pending\nPodScheduled=False\nReason: Unschedulable\nMessage: 0/3 nodes are available: 3 Insufficient cpu.",
        reading: "Image·CNI·readiness보다 앞선 placement 단계에서 멈췄습니다. 이때 container log가 없는 것은 이상이 아니라 아직 container가 만들어지지 않았기 때문입니다.",
      },
      source: {
        label: "Kubernetes · Debug Pods",
        href: "https://kubernetes.io/docs/tasks/debug/debug-application/debug-pods/",
        location: "Pod state·describe·events 조사 순서",
      },
    },
    {
      section: "source",
      eyebrow: "실습 2 · node와 control plane",
      title: "Object가 아니라 node service에서 멈춘 경우 host evidence로 내려갑니다",
      question: "Node가 NotReady일 때 API object와 host process를 어떻게 연결합니까?",
      body: "API에서 node condition을 확인한 뒤 해당 host에서 kubelet과 runtime을 봅니다. 관리형 cluster는 host 접근과 control-plane 권한이 제한될 수 있으므로 provider의 진단 경로를 사용합니다.",
      language: "shell",
      command: [
        "kubectl get nodes -o wide",
        "kubectl describe node worker-2",
        "kubectl get --raw='/readyz?verbose'",
        "sudo systemctl is-active kubelet containerd",
        "sudo journalctl -u kubelet --since '-10 min' --no-pager",
        "sudo crictl ps -a",
      ].join("\n"),
      normal: {
        label: "정상 판독 · 예시 출력",
        output: "(예시 출력 — 실측 아님)\nworker-2 Ready\nreadyz check passed\nkubelet: active\ncontainerd: active",
        reading: "Control plane의 readiness와 node agent의 실행을 따로 확인했습니다. Application probe와 Service 경로는 아직 별도입니다.",
      },
      failure: {
        label: "실패 판독 · 예시 출력",
        output: "(예시 출력 — 실측 아님)\nworker-2 NotReady\nkubelet: active\ncontainerd: failed\nCreatePodSandbox: rpc error: connection refused",
        reading: "kubelet process가 살아 있어도 runtime 호출이 실패합니다. manifest를 바꾸기 전에 runtime service와 socket·disk pressure를 복구합니다.",
      },
      source: {
        label: "Kubernetes · Troubleshooting Clusters",
        href: "https://kubernetes.io/docs/tasks/debug/debug-cluster/",
        location: "cluster·node·component troubleshooting",
      },
    },
    {
      section: "comparison",
      eyebrow: "실습 3 · 시험 작업과 production 변경의 경계",
      title: "etcd snapshot 명령 성공 뒤 실제 복원 가능성을 따로 시험합니다",
      question: "Snapshot 파일 하나가 있다는 사실이 control-plane 복구를 증명합니까?",
      body: "시험 lab에서는 주어진 endpoint와 certificate로 snapshot을 만들고 status를 읽는 작업을 연습합니다. Production에서는 encryption key·PKI·kubeadm config·external dependency와 restore runbook을 함께 보존하고 격리 환경에서 복구 시간을 잽니다.",
      language: "shell",
      command: [
        "sudo ETCDCTL_API=3 etcdctl snapshot save /var/backups/etcd.db \\",
        "  --endpoints=https://127.0.0.1:2379 \\",
        "  --cacert=/etc/kubernetes/pki/etcd/ca.crt \\",
        "  --cert=/etc/kubernetes/pki/etcd/server.crt \\",
        "  --key=/etc/kubernetes/pki/etcd/server.key",
        "sudo ETCDCTL_API=3 etcdctl snapshot status /var/backups/etcd.db --write-out=table",
        "sudo kubeadm certs check-expiration",
      ].join("\n"),
      normal: {
        label: "정상 판독 · 예시 출력",
        output: "(예시 출력 — 실측 아님)\nSnapshot saved at /var/backups/etcd.db\nTOTAL KEYS 1842  TOTAL SIZE 4.1 MB\napiserver certificate: 245d residual time",
        reading: "파일과 논리 상태, 인증서 만료 시점을 확인했습니다. 다음에는 격리한 cluster에서 복원하고 실제로 읽고 쓸 수 있는지 시험합니다.",
      },
      failure: {
        label: "실패 판독 · 예시 출력",
        output: "(예시 출력 — 실측 아님)\nError: context deadline exceeded\nmember health: unhealthy\napiserver certificate: EXPIRED",
        reading: "명령 재시도부터 하지 않습니다. endpoint health와 certificate를 분리하고, 변경 전 현재 manifest·PKI·backup을 보존합니다.",
      },
      source: {
        label: "Kubernetes · Backing up an etcd cluster",
        href: "https://kubernetes.io/docs/tasks/administer-cluster/configure-upgrade-etcd/",
        location: "snapshot·restore와 certificate options",
      },
    },
  ],
  sources: [
    { label: "Linux Foundation · CKA", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", claim: "v1.35, 2시간 performance-based exam과 다섯 영역 비중을 확인했습니다.", checkedAt },
    { label: "CNCF · Certification curriculum", href: "https://github.com/cncf/curriculum", claim: "공개 curriculum의 현재 CKA 범위와 revision 경로를 확인했습니다.", checkedAt },
    { label: "Kubernetes · Components", href: "https://kubernetes.io/docs/concepts/overview/components/", claim: "control plane과 node component의 공식 책임을 확인했습니다.", checkedAt },
    { label: "Kubernetes · API concepts", href: "https://kubernetes.io/docs/reference/using-api/api-concepts/", claim: "resource·object·watch와 resourceVersion의 API 경계를 확인했습니다.", checkedAt },
    { label: "Kubernetes · Scheduler", href: "https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/", claim: "미배치 Pod의 filtering·scoring·binding 경로를 확인했습니다.", checkedAt },
    { label: "Kubernetes · kubeadm cluster", href: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/", claim: "cluster 생성·Pod network·join과 version-specific 절차를 확인했습니다.", checkedAt },
    { label: "Kubernetes · HA topology", href: "https://kubernetes.io/docs/setup/production-environment/tools/kubeadm/ha-topology/", claim: "stacked·external etcd topology와 load balancer 경계를 확인했습니다.", checkedAt },
    { label: "Kubernetes · Troubleshooting", href: "https://kubernetes.io/docs/tasks/debug/debug-cluster/", claim: "cluster·node·component log를 좁혀 가는 공식 조사 경로를 확인했습니다.", checkedAt },
    { label: "freeCodeCamp · Kubernetes 6-hour course", href: "https://www.youtube.com/watch?v=_4uQI4ihGVU", claim: "resource 목록을 빠진 질문을 찾는 discovery map으로만 사용했습니다.", checkedAt },
    { label: "freeCodeCamp · CKA 2026 course", href: "https://www.youtube.com/watch?v=l57xKN6OBhY", claim: "kubeadm·HA·network·storage·troubleshooting lab 범위를 확인하고 현재 시험 사실은 공식 페이지로 재검증했습니다.", checkedAt },
    { label: "KodeKloud · CKA course notes", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course", claim: "Core concepts에서 mock exam까지 이어지는 공개 노트의 학습 순서와 실습 항목을 확인했습니다. 시험 사실은 공식 문서로 재검증했습니다.", checkedAt },
  ],
};

export const kubernetesRequestPathAndCkaData: CloudCertificationArticleData = {
  engineeringDepth: kubernetesCkaDepth,
  sections: [
    { id: "overview", level: "S", title: "1. 세 개를 요청했는데 두 개만 준비되어 지연이 두 배로 뛰었습니다", bridge: "먼저 Pod 하나가 어떤 전환을 거쳐 요청을 받게 되는지 여섯 단계로 나눕니다.", paragraphs: [
      "(가정) checkout 서버를 세 개 띄우도록 Deployment를 바꾼 뒤 화면에는 3 desired, 2 ready가 보였습니다. 요청은 초당 90건 들어오고 Pod 하나는 초당 35건을 안정적으로 처리하므로 두 개로는 초당 70건까지만 받습니다. 남는 초당 20건이 큐에 쌓이면서 p95 지연이 900ms에서 2.1초로 늘었습니다.",
      "답부터 적으면 이렇습니다. Kubernetes 장애는 화면의 상태 이름을 외워서 푸는 문제가 아닙니다. 요청 저장, 실행할 node 선택, container 시작, 준비 확인, 요청 대상 등록이 차례로 성공했는지 보고 마지막 초록불 바로 다음을 조사합니다. 이 글은 준비되지 않은 세 번째 Pod 하나를 그 순서대로 따라갑니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 원하는 개수는 여섯 전환을 거쳐 요청을 받는 Pod가 됩니다", bridge: "여섯 전환 가운데 하나가 멈추면 용량이 얼마나 비는지 숫자로 먼저 잡습니다.", paragraphs: [
      "replicas: 3이라는 요청을 보내면 첫 담당자가 형식과 권한을 검사해 저장합니다. 다음 담당자는 부족한 Pod를 만들고, 배치 담당자는 실행할 node를 고릅니다. 선택된 node의 담당자는 image를 받아 container를 만들며, 네트워크와 저장장치 담당자가 주소와 volume을 붙입니다.",
      "container가 시작됐다는 사실과 요청을 받을 준비가 됐다는 사실은 다릅니다. 준비 확인을 통과한 Pod 주소만 실제 요청 대상 목록에 들어갑니다. 따라서 각 전환에서 담당자, 성공 조건, 확인할 기록을 따로 봐야 합니다.",
    ] },
    { id: "case", level: "0", title: "3. 계획 105 req/s가 현실 70 req/s로 줄었습니다", bridge: "용량이 빈 것은 알았으니 세 번째 Pod가 여섯 전환 중 어디서 멈췄는지 찾는 순서를 정합니다.", paragraphs: [
      "(가정) Pod 하나가 초당 35건을 처리한다고 측정했으면 세 개가 다 Ready일 때 계획 용량은 3×35=105건입니다. Ready가 둘이면 2×35=70건이고, 들어오는 90건 가운데 20건은 바로 처리되지 못해 큐나 거절로 밀립니다.",
      "이 셈은 요청이 고르게 나뉘고 세 Pod가 같다는 가정 위의 첫 점검일 뿐 대기열 모형은 아닙니다. 그래도 ‘두 개는 살아 있다’와 ‘현재 부하를 감당한다’가 다른 주장이라는 것은 이 세 줄로 충분히 드러납니다.",
    ] },
    { id: "picture", level: "1", title: "4. 마지막 초록불 다음의 첫 빨간불을 찾습니다", bridge: "왜 이 일을 한 프로그램이 다 하지 않고 여러 담당자로 나눴는지 알아야 ‘잠시 다른 상태’와 ‘더 이상 진행되지 않는 실패’를 구분할 수 있습니다.", paragraphs: [
      "Pod에 node 이름이 없으면 아직 실행할 자리를 고르지 못한 것이므로 container log를 볼 때가 아닙니다. node는 정해졌는데 container 실행 공간이 없으면 node 안의 실행 담당자를 봅니다. container는 돌지만 준비 확인이 실패하면 애플리케이션과 그 의존 서비스를 봅니다.",
      "Pod가 Ready인데 사용자 요청만 실패하면 요청 대상 목록, 이름 해석, Service 경로, 통신 허용 규칙을 차례로 봅니다. 이 순서는 모든 장애의 정답표가 아니라 조사 범위를 먼저 줄이는 지도입니다.",
    ] },
    { id: "need", level: "2", title: "5. 생성 명령 하나로 끝나지 않기 때문에 역할이 나뉩니다", bridge: "세 부품의 공식 정의와 서로 공유하지 않는 것을 확인해 둡니다.", paragraphs: [
      "원하는 상태는 계속 바뀌고 node도 사라집니다. 요청 저장, 빈자리 선택, 각 node의 container 유지를 서로 나누면 한 담당자가 잠시 멈춰도 이미 실행 중인 container가 곧바로 사라지지 않습니다.",
      "대신 상태가 한 번에 맞춰지지도 않습니다. 각 담당자는 저장된 현재 상태를 보며 원하는 상태와의 차이를 반복해서 줄입니다. 따라서 변경 직후 잠깐 어긋난 상태와 더 이상 진행되지 않는 실패를 상태 조건, event, 지난 시간으로 구분해야 합니다.",
    ] },
    { id: "names", level: "3", title: "6. API server·scheduler·kubelet이 각각 맡는 경계", bridge: "이제 세 번째 checkout Pod를 실제 명령으로 전환 하나씩 좁혀 갑니다.", paragraphs: [
      "API server는 사용자와 모든 component가 쓰는 HTTP API의 중심이고 object의 직렬화된 상태는 etcd에 저장됩니다. scheduler는 아직 node가 없는 Pod를 보고 조건에 맞는 node를 골라 binding을 기록합니다. kubelet은 각 node에서 PodSpec에 맞는 container가 실행되고 건강한지 유지하는 agent입니다.",
      "이 셋은 서로 메모리를 공유하지 않고 API object와 watch로만 조정합니다. 그래서 진단할 때도 내가 보낸 manifest보다 server가 저장해 돌려주는 object, condition과 event를 먼저 읽습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. Pending Pod 한 개를 client 성공까지 추적합니다", bridge: "공식 문서가 각 component의 책임을 어디까지 보장하는지 같은 사건에 대입해 봅니다.", paragraphs: [
      "먼저 context와 namespace를 확인하고 Deployment·Pod condition·event를 읽습니다. PodScheduled=False와 Insufficient cpu가 보이면 image나 network 문제가 아니라 scheduler가 node를 고르기 전에 막힌 것입니다. request나 node capacity를 고친 뒤 새 Pod에 node 이름이 생기는지 확인합니다.",
      "node가 정해진 뒤에는 kubelet이 container runtime interface(CRI), network plugin(CNI), storage driver(CSI)를 통해 sandbox·주소·volume을 준비합니다. 마지막으로 readiness가 통과해 EndpointSlice에 주소가 실리고, 실제 client 요청이 목표 지연 안에 성공해야 사건이 닫힙니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 architecture를 같은 사건의 증거 위치에 대입합니다", bridge: "같은 경로를 반복해서 고장 내고 고치는 연습이 CKA 범위와 어떻게 맞물리는지 봅니다.", paragraphs: [
      "공식 Components 문서는 API server를 HTTP API의 중심, scheduler를 미배치 Pod의 node 선택자, kubelet을 node에서 Pod와 container를 유지하는 agent로 설명합니다. 이 설명으로 전환마다 owner를 정하되 특정 배포판의 process 위치와 log 경로까지 같다고 가정하지 않습니다.",
      "API server readiness가 통과해도 worker runtime과 application은 실패할 수 있습니다. 반대로 control plane이 잠시 중단돼도 이미 실행 중인 container가 곧바로 모두 종료되는 것은 아닙니다. component health와 workload health를 분리해 기록합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. CKA v1.35 범위를 장애 lab 순서로 바꿉니다", bridge: "마지막으로 시험에서 고친 한 cluster와 현장 책임의 경계를 정합니다.", paragraphs: [
      "2026-10-08 Linux Foundation 공식 페이지 기준 CKA는 Kubernetes v1.35를 쓰는 2시간 performance-based 시험입니다. 영역은 Troubleshooting 30%, Cluster Architecture·Installation·Configuration 25%, Services·Networking 20%, Workloads·Scheduling 15%, Storage 10%입니다.",
      "입문 강의가 object와 application 전체 지도를 준다면 CKA 학습은 제한 시간 안에 상태를 확인하고 실제로 고치는 반복을 더합니다. Service·CoreDNS·Gateway API는 client 경로, kubeadm·HA·etcd는 control-plane lifecycle, volume은 Pod 실행 경로의 storage 전환에 놓고 연습합니다.",
    ] },
    { id: "limits", level: "7", title: "10. 시험에서 고친 한 cluster는 production 운영 경력이 아닙니다", bridge: "이 글의 도착점은 상태 이름을 외우는 것이 아니라 마지막 성공 전환 다음을 증거로 찾는 습관입니다.", paragraphs: [
      "CKA는 명령줄에서 실제 작업을 푸는 좋은 검증이지만 조직의 change approval, 공급자 지원 경계, 장기 capacity, backup 보관, 보안 incident와 대규모 upgrade 경험을 자동으로 증명하지 않습니다. 시험 lab과 별도로 변경 전 증거, rollback, 사용자 acceptance를 남깁니다.",
      "GPU cluster에서는 여기서 한 단계 더 내려갑니다. device plugin과 GPU Operator가 node software를 준비해도 multi-node collective, RDMA, topology-aware placement와 gang scheduling은 별도 검증입니다. 이 범위는 Kubernetes·Slurm 선택 글과 AI cluster software compatibility 글로 이어집니다.",
    ] },
  ],
  overviewFlow: { title: "원하는 개수에서 client 성공까지", steps: [
    { actor: "API server · etcd", movement: "세 개를 원한다는 요청을 검사하고 저장합니다.", receives: "읽을 수 있는 desired state" },
    { actor: "scheduler · kubelet", movement: "미배치 Pod에 node를 정하고 container·network·volume을 준비합니다.", receives: "실행 중인 container" },
    { actor: "readiness · Service", movement: "probe를 통과한 주소만 EndpointSlice에 싣고 client 요청을 보냅니다.", receives: "사용자 성공과 지연" },
  ] },
  numericCase: { title: "세 개 중 두 개만 준비된 용량 장부", steps: [
    { label: "계획 용량", value: "105 req/s", detail: "3개 × process당 35 req/s (가정)" },
    { label: "실제 용량", value: "70 req/s", detail: "Ready 2개 × 35 req/s (가정)" },
    { label: "입력과 차이", value: "20 req/s", detail: "90 - 70, queue·거절 후보 (가정)" },
  ] },
  decision: { title: "상태별 첫 조사 위치", question: "마지막으로 성공한 전환은 어디입니까?", options: [
    { signal: "Pod가 Pending이고 nodeName이 없습니다.", choose: "배치 condition과 event", why: "resource·affinity·taint·volume binding 조건을 먼저 봅니다." },
    { signal: "Node는 정해졌지만 ContainerCreating에서 멈췄습니다.", choose: "kubelet·runtime·network·volume", why: "sandbox, image, mount와 node plugin 경계를 봅니다." },
    { signal: "Pod는 Running이지만 Ready가 아니거나 client만 실패합니다.", choose: "probe → endpoint → DNS·route", why: "process 실행과 traffic 수신 가능성을 분리합니다." },
  ] },
  terms: { title: "세 책임 구간의 공식 이름", items: [
    { term: "API server", description: "사용자와 component의 요청을 받는 Kubernetes HTTP API의 중심입니다.", example: "Deployment 변경을 검증하고 저장된 object를 돌려줍니다.", boundary: "Node에서 container를 직접 시작하지 않습니다." },
    { term: "Scheduler", description: "아직 node가 없는 Pod를 조건에 맞는 node에 binding합니다.", example: "CPU request를 만족하지 못하면 PodScheduled=False로 남습니다.", boundary: "배치 뒤 container가 실제로 실행됐다는 뜻은 아닙니다." },
    { term: "Kubelet", description: "각 node에서 PodSpec에 맞는 container와 health를 유지하는 agent입니다.", example: "Runtime에 sandbox 생성을 요청하고 probe 결과를 status로 보고합니다.", boundary: "여러 node 중 어느 node를 고르는 기본 scheduler 역할과 다릅니다." },
  ] },
  algorithm: { title: "Pod에서 client까지 첫 실패 경계 찾기", input: ["cluster context", "namespace=shop", "workload=checkout", "증상=p95 2.1s"], steps: [
    { code: "context와 namespace를 먼저 출력한다", note: "다른 cluster를 고치는 실수를 막습니다." },
    { code: "desired·current·ready replica를 비교한다", note: "control loop가 어느 개수에서 멈췄는지 봅니다." },
    { code: "Pod condition과 event에서 첫 false를 찾는다", note: "Pending·Creating·NotReady를 owner 경계로 바꿉니다." },
    { code: "node가 정해졌다면 kubelet·runtime·plugin evidence로 내려간다", note: "아직 실행되지 않은 container의 log부터 찾지 않습니다." },
    { code: "Ready 뒤 EndpointSlice·DNS·route를 확인한다", note: "준비된 주소가 실제 client 경로에 실렸는지 봅니다." },
    { code: "실제 요청과 p95·error rate를 다시 측정한다", note: "object가 초록색인 것보다 사용자 성공으로 닫습니다." },
  ], output: "첫 실패 전환 + 원인 evidence + 수정 전후 acceptance", repeatUntil: "같은 manifest를 새 cluster에서도 재현하고 장애 주입 뒤 시간 안에 복구할 때까지 반복합니다." },
  examScope: { title: "CKA 공식 영역을 40시간 설명용 장부에 배치", asOf: "Linux Foundation · 2026년 10월 8일 · Kubernetes v1.35", domains: [
    { name: "Troubleshooting", weight: "30% · 12h", focus: "cluster·node·component·resource·service 장애를 before/after evidence로 복구합니다." },
    { name: "Cluster Architecture", weight: "25% · 10h", focus: "kubeadm lifecycle, RBAC, HA control plane, Helm·Kustomize와 extension interface를 다룹니다." },
    { name: "Services & Networking", weight: "20% · 8h", focus: "Pod 연결, Service·EndpointSlice, NetworkPolicy, Gateway·Ingress와 CoreDNS를 추적합니다." },
    { name: "Workloads & Scheduling", weight: "15% · 6h", focus: "rollout·rollback, ConfigMap·Secret, autoscaling, admission·placement를 고칩니다." },
    { name: "Storage", weight: "10% · 4h", focus: "StorageClass, dynamic provisioning, access mode·reclaim, PV·PVC lifecycle을 연습합니다." },
  ] },
  currentNotice: { label: "응시 전 재확인", body: "공식 페이지는 시험 환경이 Kubernetes 새 minor release 뒤 약 4~8주 안에 맞춰질 수 있다고 밝히지만, 2026년 10월 9일 현재 Kubernetes 1.36·1.37이 나온 뒤에도 시험은 v1.35로 표기돼 있습니다. 이 글의 v1.35와 영역 비중은 확인일의 snapshot이므로 응시 직전 실제 표기 버전을 다시 봅니다.", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", linkLabel: "현재 CKA version과 curriculum 확인" },
  relatedArticles: { title: "GPU cluster에서는 이 두 경로를 이어서 봅니다", description: "일반 Kubernetes control loop를 이해한 뒤 node software 수렴과 batch scheduling의 다른 책임을 연결합니다.", items: [
    { label: "Kubernetes와 Slurm의 GPU scheduling", href: "/cs/gpu/kubernetes-vs-slurm-gpu-scheduling", task: "service·batch·gang scheduling의 완료 조건을 비교합니다.", evidence: "queue·allocation·PodGroup 또는 Job 상태" },
    { label: "AI cluster software compatibility", href: "/cs/gpu/ai-cluster-software-compatibility", task: "OS·driver·CUDA·NCCL·OFED·container 조합을 검증합니다.", evidence: "버전 호환표·node 기초 시험·collective 결과" },
  ] },
  sources: [
    { source: "Kubernetes Components", excerpt: "control plane and one or more worker nodes", application: "세 component를 제품 목록이 아니라 저장·배치·node 실행의 owner로 배치합니다.", citation: "Kubernetes Documentation · Components", href: "https://kubernetes.io/docs/concepts/overview/components/", note: "API server·etcd·scheduler·controller와 kubelet·runtime·kube-proxy의 공식 책임을 설명합니다." },
    { source: "Linux Foundation CKA", excerpt: "performance-based test", application: "공식 비중을 장애 lab 시간과 산출물로 바꾸되 합격 문제 수로 해석하지 않습니다.", citation: "Linux Foundation · Certified Kubernetes Administrator", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", note: "확인일 현재 v1.35, 2시간과 다섯 영역 비중을 밝히는 공식 시험 안내입니다." },
  ],
  review: [
    "Pod가 Pending이고 nodeName이 없을 때 container log보다 condition과 event를 먼저 확인해야 하는 이유는 무엇입니까? (답: 4·7절)",
    "API server readiness가 통과해도 사용자 요청이 실패할 수 있는 이유를 경로로 설명해 보세요. (답: 7·8절)",
    "CKA 30% Troubleshooting을 12시간 읽기로 끝내지 않고 어떤 증거로 남겨야 합니까? (답: 9절)",
  ],
};
