import type { CloudCertificationArticleData } from "./CloudCertificationArticle";
import type { EngineeringDepthData } from "./EngineeringDepthBlocks";

const checkedAt = "2026-10-08";

const kubernetesCkaDepth: EngineeringDepthData = {
  ledgers: [
    {
      section: "mechanism",
      title: "Pod 한 개가 Ready가 될 때까지의 소유자·증거 원장",
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
      title: "CKA 40시간 실습 원장",
      question: "공식 비중을 읽기 시간이 아니라 복구할 장애와 남길 증거로 바꾸면 무엇이 달라집니까?",
      columns: ["공식 영역", "설명용 시간", "반복할 장애", "남길 증거"],
      rows: [
        ["Troubleshooting 30%", "12시간", "NotReady node·component crash·Service timeout", "before/after status·event·journal"],
        ["Cluster Architecture 25%", "10시간", "kubeadm join·certificate·HA endpoint", "config·health·rollback"],
        ["Services & Networking 20%", "8시간", "selector·DNS·policy·Gateway 오류", "EndpointSlice·query·packet path"],
        ["Workloads & Scheduling 15%", "6시간", "rollout·probe·affinity·resource shortage", "revision·condition·event"],
        ["Storage 10%", "4시간", "PVC Pending·access mode·reclaim", "class·claim·mount·read/write fixture"],
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
        reading: "파일과 논리 상태, certificate 만료 시점을 확인했습니다. 격리 cluster restore와 workload read/write fixture가 다음 gate입니다.",
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
    { label: "KodeKloud · CKA image index", href: "https://github.com/kodekloudhub/certified-kubernetes-administrator-course/tree/master/images", claim: "원본 도해의 위치만 연결했습니다. 저장소 루트에서 명시적 license 파일을 확인하지 못해 이미지를 복제하지 않고 자체 반응형 도해를 사용했습니다.", checkedAt },
  ],
};

export const kubernetesRequestPathAndCkaData: CloudCertificationArticleData = {
  engineeringDepth: kubernetesCkaDepth,
  sections: [
    { id: "overview", level: "S", title: "1. 세 개를 요청했는데 두 개만 준비되어 지연이 두 배로 뛰었습니다", bridge: "화면에는 여러 상태 이름이 보였지만, 먼저 마지막으로 성공한 전환을 찾아야 했습니다.", paragraphs: [
      "(가정) checkout process를 세 개 띄우도록 변경한 뒤 화면에는 3 desired, 2 ready가 보였습니다. 요청은 초당 90개 들어왔고 process 하나가 안정적으로 처리할 수 있는 양은 초당 35개였습니다. 남은 두 개는 살아 있었지만 처리 용량이 부족해 p95 지연이 900ms에서 2.1s로 늘었습니다.",
      "이 사건에서 곧바로 YAML을 고치거나 process log를 보는 것은 빠른 길이 아닙니다. 세 번째 process가 요청 접수, 저장, 배치, node 준비, application 준비 가운데 어디까지 갔는지를 순서대로 확인해야 첫 원인을 찾을 수 있습니다.",
    ] },
    { id: "black-box", level: "B", title: "2. 원하는 상태가 저장되고 실제 process와 client 경로로 바뀝니다", bridge: "증상을 한 줄로 만들었습니다. 이제 이름을 가린 채 여섯 전환을 봅니다.", paragraphs: [
      "사용자가 원하는 개수를 제출하면 중앙 입구가 형식과 권한을 검사해 의도를 저장합니다. 반복해서 상태를 맞추는 부품이 미배치 작업을 발견해 node를 고르고, 그 node의 실행 담당자가 image·network·volume을 준비한 뒤 process를 시작합니다.",
      "Process가 시작됐다는 사실과 요청을 받을 준비가 됐다는 사실도 다릅니다. 준비 검사를 통과한 주소만 client가 쓰는 대상 목록에 들어갑니다. 따라서 각 전환의 입력·출력과 owner를 따로 봅니다.",
    ] },
    { id: "case", level: "0", title: "3. 105 req/s 계획이 70 req/s 현실로 줄었습니다", bridge: "같은 사건의 처리량을 계산하면 세 번째 process의 상태가 사용자 지연과 연결됩니다.", paragraphs: [
      "(가정) process 하나의 안정 처리량을 35 req/s로 측정했다면 세 개가 모두 준비됐을 때 계획 용량은 105 req/s입니다. 하지만 실제 준비된 process는 두 개라 70 req/s뿐입니다. 90 req/s 입력에서 초당 20개가 즉시 처리되지 못하고 queue 또는 거절로 밀립니다.",
      "이 계산은 완전한 queueing model이 아닙니다. 균등 분배, 동일한 process, 짧은 측정 구간을 가정한 첫 sanity check입니다. 그래도 ‘한 개가 덜 떠도 둘은 살아 있다’와 ‘현재 부하를 감당한다’가 다른 주장임을 보여 줍니다.",
    ] },
    { id: "picture", level: "1", title: "4. 마지막 초록불 다음의 첫 빨간불을 찾습니다", bridge: "용량 부족을 확인했습니다. 이제 실패 상태를 전환 경계에 놓습니다.", paragraphs: [
      "의도가 저장됐는데 node가 정해지지 않았다면 실행 node의 log를 볼 단계가 아닙니다. Node가 정해졌지만 sandbox가 없다면 배치보다 node runtime을 봅니다. Process가 실행 중인데 준비 검사가 실패한다면 application과 dependency를 봅니다.",
      "Client만 실패한다면 준비된 주소 목록, 이름 해석, route와 policy를 따라갑니다. 이 순서는 모든 장애의 정답표가 아니라 조사 범위를 가장 먼저 줄이는 지도입니다.",
    ] },
    { id: "need", level: "2", title: "5. 생성 명령 하나로 끝나지 않기 때문에 역할이 나뉩니다", bridge: "전환 경계를 봤습니다. 왜 하나의 중앙 프로그램이 전부 처리하지 않는지 설명합니다.", paragraphs: [
      "원하는 상태는 계속 바뀌고 node도 사라집니다. 요청을 저장하는 일, 빈자리를 고르는 일, 각 host에서 process를 지키는 일을 나누면 한 부품이 잠시 멈춰도 이미 실행 중인 process가 곧바로 모두 사라지지 않습니다.",
      "대신 상태가 즉시 한 번에 맞춰지는 것도 아닙니다. 각 부품은 관측한 상태를 바탕으로 반복해서 차이를 줄입니다. 그래서 변경 직후의 잠깐 다른 상태와 더 이상 수렴하지 못하는 실패를 condition·event·시간으로 구분합니다.",
    ] },
    { id: "names", level: "3", title: "6. 중앙 입구·배치 담당·node 실행 담당에 이름을 붙입니다", bridge: "이름 없는 역할을 이해했습니다. 이제 공식 component 이름 세 개를 붙입니다.", paragraphs: [
      "Kubernetes의 중앙 HTTP 입구는 API server입니다. 아직 node가 없는 Pod를 보고 조건에 맞는 node를 고른 뒤 binding을 기록하는 부품은 scheduler입니다. 각 node에서 PodSpec에 맞는 container가 실행되고 건강한지 확인하는 agent는 kubelet입니다.",
      "이 셋은 서로 직접 기억을 공유한다고 가정하지 않습니다. API object와 watch가 조정의 중심입니다. 그래서 진단할 때도 내가 보낸 manifest보다 server가 저장해 돌려주는 object, condition과 event를 먼저 읽습니다.",
    ] },
    { id: "mechanism", level: "4", title: "7. Pending Pod 한 개를 client 성공까지 추적합니다", bridge: "세 component에 이름을 붙였습니다. 같은 checkout Pod의 전환을 실제 명령으로 좁혀 갑니다.", paragraphs: [
      "먼저 context와 namespace를 확인하고 Deployment, Pod condition과 event를 읽습니다. `PodScheduled=False`와 `Insufficient cpu`가 보이면 image나 network 문제가 아니라 node 선택 전에 막혔습니다. Request 또는 node capacity를 고친 뒤 새 Pod에 node 이름이 생기는지 확인합니다.",
      "Node가 정해진 뒤에는 kubelet이 container runtime interface(CRI), network interface(CNI), storage interface(CSI)의 구현을 통해 sandbox·주소·volume을 준비합니다. 마지막으로 readiness가 통과해 EndpointSlice에 주소가 실리고, 실제 client 요청이 목표 지연 안에 성공해야 사건이 닫힙니다.",
    ] },
    { id: "source", level: "5", title: "8. 공식 architecture를 같은 사건의 증거 위치에 대입합니다", bridge: "한 Pod의 경로를 따라갔습니다. 공식 문서가 각 component의 책임을 어디까지 보장하는지 확인합니다.", paragraphs: [
      "공식 Components 문서는 API server를 HTTP API의 중심, scheduler를 미배치 Pod의 node 선택자, kubelet을 node에서 Pod와 container를 유지하는 agent로 설명합니다. API object의 직렬화된 상태는 etcd에 저장됩니다. 이 설명으로 owner를 정하되, 특정 배포판의 process 위치와 log 경로까지 같다고 가정하지 않습니다.",
      "API server readiness가 통과해도 worker runtime과 application은 실패할 수 있습니다. 반대로 control plane이 잠시 중단돼도 이미 실행 중인 container가 곧바로 모두 종료되는 것은 아닙니다. component health와 workload health를 분리해 기록합니다.",
    ] },
    { id: "comparison", level: "6", title: "9. CKA v1.35 범위를 장애 lab 순서로 바꿉니다", bridge: "공식 architecture를 실제 조사에 대입했습니다. 이제 자격 범위를 같은 실습 언어로 바꿉니다.", paragraphs: [
      "2026-10-08 Linux Foundation 공식 페이지 기준 CKA는 Kubernetes v1.35를 사용하는 2시간 performance-based 시험입니다. 영역은 Troubleshooting 30%, Cluster Architecture·Installation·Configuration 25%, Services·Networking 20%, Workloads·Scheduling 15%, Storage 10%입니다.",
      "입문 강의가 object와 application 전체 지도를 준다면 CKA 학습은 제한 시간 안에 상태를 확인하고 실제로 고치는 반복을 더합니다. Service·CoreDNS·Gateway API는 client 경로, kubeadm·HA·etcd는 control-plane lifecycle, volume은 Pod 실행 경로의 storage 전환에 놓고 연습합니다.",
    ] },
    { id: "limits", level: "7", title: "10. 시험에서 고친 한 cluster는 production 운영 경력이 아닙니다", bridge: "학습 지도를 장애 복구로 바꿨습니다. 마지막으로 자격과 현장 책임의 경계를 정합니다.", paragraphs: [
      "CKA는 명령줄에서 실제 작업을 푸는 좋은 검증이지만, 조직의 change approval, 공급자 지원 경계, 장기 capacity, backup 보관, 보안 incident와 대규모 upgrade 경험을 자동으로 증명하지 않습니다. 시험 lab과 별도로 변경 전 증거, rollback, 사용자 acceptance를 남깁니다.",
      "GPU cluster에서는 여기서 한 단계 더 내려갑니다. Device plugin과 Operator가 node software를 준비해도 multi-node collective, RDMA, topology-aware placement와 gang scheduling은 별도 검증입니다. 이 범위는 기존 Kubernetes·Slurm 및 AI cluster software compatibility 글로 이어집니다.",
    ] },
  ],
  overviewFlow: { title: "원하는 개수에서 client 성공까지", steps: [
    { actor: "의도", movement: "세 개를 원한다는 요청을 검사하고 저장합니다.", receives: "읽을 수 있는 desired state" },
    { actor: "배치와 node", movement: "미배치 작업에 node를 정하고 process·network·volume을 준비합니다.", receives: "실행 중인 process" },
    { actor: "준비와 요청", movement: "건강 검사를 통과한 주소만 게시하고 client 요청을 보냅니다.", receives: "사용자 성공과 지연" },
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
  currentNotice: { label: "응시 전 재확인", body: "공식 페이지는 시험 환경이 Kubernetes 새 minor release 뒤 약 4~8주 안에 맞춰질 수 있다고 밝힙니다. 이 글의 v1.35와 영역 비중은 확인일의 snapshot입니다.", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", linkLabel: "현재 CKA version과 curriculum 확인" },
  relatedArticles: { title: "GPU cluster에서는 이 두 경로를 이어서 봅니다", description: "일반 Kubernetes control loop를 이해한 뒤 node software 수렴과 batch scheduling의 다른 책임을 연결합니다.", items: [
    { label: "Kubernetes와 Slurm의 GPU scheduling", href: "/cs/hw/kubernetes-vs-slurm-gpu-scheduling", task: "service·batch·gang scheduling의 완료 조건을 비교합니다.", evidence: "queue·allocation·PodGroup 또는 Job 상태" },
    { label: "AI cluster software compatibility", href: "/cs/hw/ai-cluster-software-compatibility", task: "OS·driver·CUDA·NCCL·OFED·container 조합을 검증합니다.", evidence: "version ledger·node smoke test·collective result" },
  ] },
  sources: [
    { source: "Kubernetes Components", excerpt: "control plane and one or more worker nodes", application: "세 component를 제품 목록이 아니라 저장·배치·node 실행의 owner로 배치합니다.", citation: "Kubernetes Documentation · Components", href: "https://kubernetes.io/docs/concepts/overview/components/", note: "API server·etcd·scheduler·controller와 kubelet·runtime·kube-proxy의 공식 책임을 설명합니다." },
    { source: "Linux Foundation CKA", excerpt: "performance-based test", application: "공식 비중을 장애 lab 시간과 산출물로 바꾸되 합격 문제 수로 해석하지 않습니다.", citation: "Linux Foundation · Certified Kubernetes Administrator", href: "https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/", note: "확인일 현재 v1.35, 2시간과 다섯 domain 비중을 밝히는 정본입니다." },
  ],
  formulas: [{
    section: "case",
    content: {
      question: "Ready replica가 하나 줄었을 때 현재 입력을 감당할 수 있는지 어떻게 빠르게 확인합니까?",
      idea: "측정한 process당 안정 처리량에 Ready 개수만 곱해 현재 용량을 만들고 입력률과 차이를 봅니다.",
      formula: String.raw`C_{\rm ready}=N_{\rm ready}c,\qquad G=\lambda-C_{\rm ready}`,
      annotatedFormula: String.raw`\begin{aligned}C_{\rm plan}&=\underbrace{3\times35}_{\text{요청 replica 3개}}=105\;{\rm req/s}\\C_{\rm ready}&=\underbrace{2\times35}_{\text{Ready replica 2개}}=70\;{\rm req/s}\\G&=\underbrace{90-70}_{\text{입력률-현재 용량}}=20\;{\rm req/s}\end{aligned}`,
      operations: [
        { expression: String.raw`3\times35`, annotation: ["요청 replica 수에 process당 측정 처리량을 곱해", "정상 계획 용량을 계산"] },
        { expression: String.raw`2\times35`, annotation: ["실제 Ready replica만 세어", "현재 사용 가능한 용량을 계산"] },
        { expression: String.raw`90-70`, annotation: ["입력률에서 현재 용량을 빼", "queue·거절로 밀릴 수 있는 1차 gap을 계산"] },
      ],
      terms: [
        { symbol: String.raw`N_{\rm ready}`, name: "Ready replica 수", description: "Traffic 후보가 된 process 수입니다." },
        { symbol: "c", name: "process당 안정 처리량", description: "같은 request mix와 SLO에서 측정한 값입니다." },
        { symbol: String.raw`\lambda,G`, name: "입력률·용량 gap", description: "들어오는 요청과 현재 처리 용량의 1차 차이입니다." },
      ],
      assumptions: ["세 process의 처리량이 같고 traffic이 고르게 분배된다고 가정합니다.", "35 req/s와 90 req/s는 설명용 가정이며 실제 load test 값을 사용합니다.", "Queue length·service-time 분포·dependency bottleneck은 별도 측정합니다."],
      interpretation: "현재 gap이 20 req/s라면 replica가 살아 있다는 사실만으로 SLO를 지킬 수 없습니다. 세 번째 Pod의 첫 실패 경계를 복구하거나 admission·degradation 정책을 적용해야 합니다.",
    },
  }],
  review: [
    "Pod가 Pending이고 nodeName이 없을 때 container log보다 condition과 event를 먼저 보는 이유는 무엇인가요? (답: 4·7절)",
    "API server readiness가 통과해도 사용자 요청이 실패할 수 있는 이유를 경로로 설명해 보세요. (답: 7·8절)",
    "CKA 30% Troubleshooting을 12시간 읽기로 끝내지 않고 어떤 증거로 바꿔야 하나요? (답: 9절)",
  ],
};
