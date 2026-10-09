import type { EngineeringDepthData } from "./EngineeringDepthBlocks";

const checkedAt = "2026-10-08";

type LabSpec = {
  title: string;
  question: string;
  rows: readonly (readonly string[])[];
  conclusion: string;
  eyebrow: string;
  evidenceTitle: string;
  evidenceQuestion: string;
  body: string;
  language?: string;
  command: string;
  normal: string;
  normalReading: string;
  failure: string;
  failureReading: string;
  sources: EngineeringDepthData["sources"];
};

function lab(spec: LabSpec): EngineeringDepthData {
  return {
    ledgers: [
      {
        section: "mechanism",
        title: spec.title,
        question: spec.question,
        columns: ["관찰 지점", "확인할 사실", "남길 증거", "다음 판단"],
        rows: spec.rows,
        conclusion: spec.conclusion,
      },
    ],
    evidence: [
      {
        section: "source",
        eyebrow: spec.eyebrow,
        title: spec.evidenceTitle,
        question: spec.evidenceQuestion,
        body: spec.body,
        language: spec.language ?? "shell",
        command: spec.command,
        normal: {
          label: "정상 판독 · 예시 출력",
          output: `(예시 출력 — 실측 아님)\n${spec.normal}`,
          reading: spec.normalReading,
        },
        failure: {
          label: "실패 판독 · 예시 출력",
          output: `(예시 출력 — 실측 아님)\n${spec.failure}`,
          reading: spec.failureReading,
        },
      },
    ],
    sources: spec.sources,
  };
}

const awsIdentitySources = [
  { label: "AWS IAM · Policy evaluation logic", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html", claim: "identity·resource policy의 합집합과 permissions boundary·SCP의 교집합, explicit deny 우선순위를 확인했습니다.", checkedAt },
  { label: "AWS IAM · Access denied troubleshooting", href: "https://docs.aws.amazon.com/IAM/latest/UserGuide/troubleshoot_access-denied.html", claim: "거부 메시지와 CloudTrail을 이용해 어느 정책 층에서 막혔는지 좁히는 절차를 확인했습니다.", checkedAt },
  { label: "AWS CLI · STS get-caller-identity", href: "https://docs.aws.amazon.com/cli/latest/reference/sts/get-caller-identity.html", claim: "현재 요청 주체의 account·ARN·principal ID를 읽는 명령을 확인했습니다.", checkedAt },
] as const;

const azureIdentitySources = [
  { label: "Azure RBAC · Role assignments", href: "https://learn.microsoft.com/en-us/azure/role-based-access-control/role-assignments", claim: "role assignment가 principal·role definition·scope로 구성된다는 점을 확인했습니다.", checkedAt },
  { label: "Azure RBAC · Deny assignments", href: "https://learn.microsoft.com/en-us/azure/role-based-access-control/deny-assignments", claim: "deny assignment가 role assignment와 별도이며 Azure가 만들고 관리하는 제약을 확인했습니다.", checkedAt },
  { label: "Azure managed identities", href: "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview", claim: "비밀을 직접 배포하지 않고 Azure resource identity로 token을 얻는 경계를 확인했습니다.", checkedAt },
] as const;

const awsNetworkSources = [
  { label: "AWS VPC · Reachability Analyzer", href: "https://docs.aws.amazon.com/vpc/latest/reachability/what-is-reachability-analyzer.html", claim: "route table·security group·network ACL·load balancer를 포함한 구성 경로 분석 범위를 확인했습니다.", checkedAt },
  { label: "AWS VPC · Flow Logs", href: "https://docs.aws.amazon.com/vpc/latest/userguide/flow-logs.html", claim: "network interface를 드나드는 IP traffic의 accept·reject 기록 범위와 한계를 확인했습니다.", checkedAt },
  { label: "AWS Route 53 · DNS concepts", href: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/route-53-concepts.html", claim: "resolver·hosted zone·record와 DNS 응답 경로의 역할을 확인했습니다.", checkedAt },
] as const;

const azureNetworkSources = [
  { label: "Azure Private Endpoint overview", href: "https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-overview", claim: "private endpoint NIC·private IP와 service resource 연결의 경계를 확인했습니다.", checkedAt },
  { label: "Azure Private Endpoint DNS", href: "https://learn.microsoft.com/en-us/azure/private-link/private-endpoint-dns", claim: "service별 private DNS zone과 VNet link가 이름 해석에 미치는 영향을 확인했습니다.", checkedAt },
  { label: "Azure routing overview", href: "https://learn.microsoft.com/en-us/azure/virtual-network/virtual-networks-udr-overview", claim: "longest-prefix match와 system·BGP·user-defined route 선택 원칙을 확인했습니다.", checkedAt },
] as const;

const reliabilitySources = [
  { label: "AWS Well-Architected · Reliability", href: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/welcome.html", claim: "복구 절차의 자동화와 정기적인 복구 시험을 설계 검토 기준으로 확인했습니다.", checkedAt },
  { label: "AWS CloudFormation · Drift detection", href: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-stack-drift.html", claim: "template의 기대 상태와 실제 resource property의 차이를 탐지하는 범위와 NOT_CHECKED 한계를 확인했습니다.", checkedAt },
  { label: "Azure Bicep · What-if", href: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/bicep/deploy-what-if", claim: "배포 전에 create·delete·modify·no-change를 미리 확인하는 명령과 결과를 확인했습니다.", checkedAt },
  { label: "Azure reliability · BCDR", href: "https://learn.microsoft.com/en-us/azure/reliability/concept-business-continuity-high-availability-disaster-recovery", claim: "RTO·RPO를 business requirement에서 복구 설계로 연결하는 정의를 확인했습니다.", checkedAt },
] as const;

export const certificationRoadmapDepth = lab({
  title: "자격증 한 개를 운영 증거 한 묶음으로 바꾸는 확인표",
  question: "합격 지식이 실제 설계·진단 능력으로 이어졌다는 것을 무엇으로 보여줄 수 있습니까?",
  rows: [
    ["요청 주체", "CLI가 어느 AWS 계정·Azure 구독에서 어떤 사용자로 실행되는지", "STS·az account 출력", "권한 문제와 자원 문제를 분리"],
    ["요청 경로", "DNS→경로표→보안 정책→서비스 중 어디까지 갔는지", "dig·도달 가능성 분석·흐름 로그", "처음 실패한 구간부터 조사"],
    ["변경", "배포 전후에 무엇이 달라져야 하는지", "배포 계획·사전 변경 보기·배포 ID", "승인과 되돌리기 조건 결정"],
    ["복구", "백업이 있다는 사실보다 목표 시간 안에 다시 읽을 수 있는지", "복원 ID·검증 질의·소요 시간", "RTO·RPO 달성 여부"],
  ],
  conclusion: "자격증은 용어의 지도를 주지만, 포트폴리오는 한 요청과 한 장애, 한 변경, 한 복구의 원문 증거로 완성됩니다.",
  eyebrow: "실습 · 시작점 고정",
  evidenceTitle: "명령을 실행하기 전에 ‘나는 누구이며 어디를 보고 있는가’를 남깁니다",
  evidenceQuestion: "계정과 지역을 잘못 본 상태에서 만든 진단 결과를 어떻게 막습니까?",
  body: "AWS와 Azure 모두 자원 목록을 보기 전에 현재 사용자, 계정·구독, 지역을 확인합니다. 이 결과를 실습 폴더의 첫 파일로 저장하면 뒤의 실패가 권한 때문인지, 다른 환경을 본 것인지 되짚을 수 있습니다.",
  command: [
    "aws sts get-caller-identity",
    "aws configure get region",
    "az account show --query '{subscription:id,tenant:tenantId,user:user.name}' -o json",
    "az configure --list-defaults -o table",
  ].join("\n"),
  normal: 'Account=111122223333, Arn=arn:aws:iam::111122223333:role/lab-reader\nsubscription=lab-subscription, tenant=expected-tenant',
  normalReading: "예상한 사용자와 작업 범위가 맞은 뒤에만 실습을 진행합니다. 출력에는 시각과 실습 ID도 함께 남깁니다.",
  failure: 'Account=999900001111\nsubscription=production-subscription',
  failureReading: "다른 환경이면 즉시 중단합니다. 이 출력은 서비스 장애가 아니라 진단자가 잘못된 계정이나 구독을 보고 있다는 증거입니다.",
  sources: [
    ...awsIdentitySources,
    ...azureIdentitySources,
    { label: "AWS Certification Exam Guides", href: "https://docs.aws.amazon.com/aws-certification/latest/examguides/", claim: "시험별 target candidate·content outline·in-scope service를 최신 공식 목차에서 확인하도록 연결했습니다.", checkedAt },
    { label: "Microsoft Credentials", href: "https://learn.microsoft.com/en-us/credentials/", claim: "role-based certification의 현재 시험·갱신·study guide 경로를 확인했습니다.", checkedAt },
  ],
});

export const cloudFoundationsDepth = lab({
  title: "장애 책임을 공급자 시설·클라우드 자원·고객 구성으로 나누는 확인표",
  question: "한 VM이 응답하지 않을 때 공급자 책임이라고 단정하기 전에 무엇을 확인합니까?",
  rows: [
    ["공급자 시설", "리전·가용 영역의 공식 서비스 상태", "공식 장애 event ID", "공급자 장애인지 판정"],
    ["클라우드 자원", "VM·디스크·네트워크 자원의 상태", "describe/show JSON", "자원 상태 이상인지 판정"],
    ["고객 구성", "운영체제·방화벽·애플리케이션 상태", "직렬 콘솔·부팅 로그·상태 확인 요청", "구성 또는 애플리케이션 복구"],
    ["사용자 서비스", "사용자가 실제 요청을 완료하는지", "시험 요청·trace ID", "서비스 목표 영향과 우회 결정"],
  ],
  conclusion: "공동 책임은 사고 비용을 떠넘기는 문구가 아니라, 같은 증상을 증거가 생기는 층별로 나누는 조사 순서입니다.",
  eyebrow: "실습 · 위치와 상태",
  evidenceTitle: "자원이 놓인 리전·가용 영역과 실제 상태를 한 번에 확인합니다",
  evidenceQuestion: "‘리전 장애’라는 추측을 자원 목록과 공식 상태 기록으로 확인할 수 있습니까?",
  body: "CLI의 running 표시는 사용자 서비스가 정상이라는 뜻이 아닙니다. 먼저 자원의 위치와 상태를 확인하고, 공급자 공지와 VM 내부·애플리케이션 기록을 같은 시간축에 놓습니다.",
  command: [
    "aws ec2 describe-instances --instance-ids <id> --query 'Reservations[].Instances[].{State:State.Name,AZ:Placement.AvailabilityZone,Vpc:VpcId}'",
    "az vm get-instance-view -g <rg> -n <vm> --query '{location:location,statuses:instanceView.statuses[].displayStatus}' -o json",
  ].join("\n"),
  normal: 'State=running, AZ=ap-southeast-1a\nPowerState/running, ProvisioningState/succeeded',
  normalReading: "클라우드 관리 화면의 running은 애플리케이션 정상과 다릅니다. 다음으로 상태 확인 요청과 VM 내부 로그를 봅니다.",
  failure: 'State=running\nHTTP synthetic check: timeout',
  failureReading: "공급자 화면에서 VM이 running인데 사용자 요청이 실패하면 VM 내부 네트워크·운영체제·애플리케이션을 차례로 봅니다.",
  sources: [
    { label: "AWS · Shared responsibility model", href: "https://aws.amazon.com/compliance/shared-responsibility-model/", claim: "cloud 자체의 보안과 cloud 안의 고객 구성 책임을 구분하는 공식 경계를 확인했습니다.", checkedAt },
    { label: "Azure · Shared responsibility", href: "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility", claim: "IaaS·PaaS·SaaS에 따라 고객과 Microsoft 책임이 어떻게 달라지는지 확인했습니다.", checkedAt },
    { label: "AWS Regions and Availability Zones", href: "https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html", claim: "region과 Availability Zone의 물리·논리 격리 관계를 확인했습니다.", checkedAt },
    { label: "Azure regions and availability zones", href: "https://learn.microsoft.com/en-us/azure/reliability/regions-overview", claim: "region·availability zone과 zone 지원 resource의 경계를 확인했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const identityHierarchyDepth = lab({
  title: "한 API 요청의 권한 판정 확인표",
  question: "403을 ‘권한이 없다’로 끝내지 않고 어느 정책 문장이 막았는지 찾을 수 있습니까?",
  rows: [
    ["요청한 사용자", "사람·역할(role)·관리 ID 중 실제 token 주체", "caller identity·object ID", "잘못된 로그인 정보인지 확인"],
    ["행동과 대상", "정확한 API 행동과 자원 ID", "CloudTrail·Activity Log의 요청", "대상 범위와 자원 이름 규칙 확인"],
    ["허용 정책", "사용자·자원 정책이 그 행동을 허용하는지", "정책 모의 실행·역할 할당", "조건과 적용 범위 확인"],
    ["상위 제한과 명시적 거부", "SCP·permissions boundary·deny assignment가 막는지", "조직·상한·거부 정책 원문", "해당 정책 관리자에게 수정 요청"],
  ],
  conclusion: "역할 이름만 보지 말고 요청한 사용자·행동·대상·조건·상위 제한을 차례로 확인하면 AWS와 Azure에서 같은 순서로 조사할 수 있습니다.",
  eyebrow: "실습 · 403 한 건",
  evidenceTitle: "현재 사용자와 실제 역할 할당을 먼저 대조합니다",
  evidenceQuestion: "관리자처럼 보이는 역할 이름만 보고 허용을 단정하지 않을 수 있습니까?",
  body: "아래 명령은 쓰기 권한을 바꾸지 않는 조회입니다. 실패한 요청의 API 행동과 자원 ID를 확보한 뒤 현재 사용자와 적용 범위가 맞는지부터 대조합니다.",
  command: [
    "aws sts get-caller-identity",
    "aws iam simulate-principal-policy --policy-source-arn <role-arn> --action-names s3:GetObject --resource-arns <object-arn>",
    "az account show --query '{subscription:id,user:user.name}' -o json",
    "az role assignment list --assignee <object-id> --all --include-inherited -o table",
  ].join("\n"),
  normal: 'EvalDecision=allowed\nRole=Storage Blob Data Reader, Scope=/subscriptions/.../storageAccounts/lab',
  normalReading: "정책 모의 실행이 허용이어도 실제 API는 실패할 수 있습니다. 자원 정책·SCP·네트워크 제한과 token 갱신 여부를 계속 확인합니다.",
  failure: 'EvalDecision=implicitDeny\nroleAssignments=[]',
  failureReading: "먼저 적용 범위와 사용자 ID를 다시 확인합니다. 곧바로 Owner를 부여하지 말고 필요한 API 행동만 가장 좁은 범위에 추가합니다.",
  sources: [...awsIdentitySources, ...azureIdentitySources],
});

export const networkingRequestPathDepth = lab({
  title: "HTTPS 요청 하나를 구간별로 확인하는 표",
  question: "시간 초과가 났을 때 DNS·경로·방화벽·수신 포트·애플리케이션 중 처음 실패한 구간을 찾을 수 있습니까?",
  rows: [
    ["이름 해석", "클라이언트가 받은 A/CNAME과 TTL", "dig +trace·Resolve-DnsName", "공개·사설 DNS 영역이 갈리는지 확인"],
    ["경로", "출발지에서 목적지까지 고른 경로", "Reachability Analyzer·실제 적용 경로", "다음 장비와 가장 구체적인 경로 확인"],
    ["보안 규칙", "연결 상태를 기억하는 SG/NSG와 기억하지 않는 NACL", "규칙·흐름 로그", "방향·포트·응답 경로 확인"],
    ["서비스", "수신 포트·대상 상태·애플리케이션 응답", "curl 단계별 시간·상태·trace ID", "네트워크와 애플리케이션 문제 분리"],
  ],
  conclusion: "‘네트워크 문제’는 결론이 아니라 넓은 범위입니다. 클라이언트에서 서버까지 구간별 증거를 잇고 처음 어긋난 곳을 찾습니다.",
  eyebrow: "실습 · 요청 한 번",
  evidenceTitle: "DNS 응답과 TCP/TLS/HTTP 시간을 같은 요청 ID로 묶습니다",
  evidenceQuestion: "이름은 풀리지만 연결이 안 되는 상태와, 연결은 되지만 애플리케이션이 늦는 상태를 구분할 수 있습니까?",
  body: "`curl`의 단계별 시간만으로 패킷 경로 전체를 증명할 수는 없지만 첫 조사 지점을 고르는 데 유용합니다. Private Endpoint라면 클라이언트가 사설 IP를 받았는지 먼저 확인합니다.",
  command: [
    "dig +noall +answer <service-fqdn>",
    "curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} first=%{time_starttransfer} total=%{time_total}\\n' https://<service-fqdn>/health",
    "aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=<subnet-id>",
    "az network nic show-effective-route-table -g <rg> -n <nic> -o table",
  ].join("\n"),
  normal: '<service-fqdn> 30 IN A 10.20.1.7\ndns=0.012 connect=0.021 tls=0.047 first=0.083 total=0.084',
  normalReading: "사설 IP 응답과 각 단계의 평소 시간을 함께 저장합니다. 빠르다는 말 대신 이전 정상값과 비교합니다.",
  failure: '<service-fqdn> 30 IN A 52.1.2.3\ndns=0.010 connect=5.001 tls=0.000 first=0.000 total=5.001',
  failureReading: "Private Endpoint를 기대했는데 공개 IP를 받았다면 방화벽부터 바꾸지 않습니다. Private DNS Zone·VNet 연결·DNS 전달 설정을 먼저 확인합니다.",
  sources: [...awsNetworkSources, ...azureNetworkSources, { label: "Azure · Private endpoint DNS troubleshooting", href: "https://learn.microsoft.com/en-us/troubleshoot/azure/private-link/troubleshoot-private-endpoint-dns-resolution", claim: "private endpoint의 대표적인 DNS 오구성과 확인 순서를 점검했습니다.", checkedAt }],
});

export const computeSelectionDepth = lab({
  title: "VM·컨테이너·함수를 같은 작업에 놓고 비교하는 표",
  question: "서비스 이름이 아니라 시작 시간·처리 시간·상태 보관·확장·운영 책임으로 실행 방식을 고를 수 있습니까?",
  rows: [
    ["요청", "평균·p95 초당 요청 수와 순간 증가 지속 시간", "부하 시험 원본 결과", "평소 용량과 순간 증가분 분리"],
    ["실행", "시작 시간·처리 시간·상태·장치 요구", "처음·반복 호출 지연·실행 기록", "함수·컨테이너·VM 후보 제거"],
    ["복구", "상태 신호가 실제 사용자 요청 성공을 보는지", "대상 상태·교체 기록", "실제로는 고장인데 정상으로 보이는 상태 방지"],
    ["운영", "패치·image·실행 환경 중 팀이 맡을 층", "담당자 표·복구 절차", "관리 편의와 제약 비용 비교"],
  ],
  conclusion: "실행 방식은 ‘서버리스가 편하다’는 인상보다 작업 조건을 만족하면서 팀이 감당할 운영 책임으로 고릅니다.",
  eyebrow: "실습 · 정상이라는 말의 범위",
  evidenceTitle: "VM이 running인 것과 사용자 요청 성공을 분리합니다",
  evidenceQuestion: "Auto Scaling이 유지한 VM 수가 실제로 요청을 받는 VM 수와 같은지 확인할 수 있습니까?",
  body: "VM 상태만 보면 애플리케이션이 멈췄어도 정상으로 보일 수 있습니다. Load Balancer가 본 대상 상태, Auto Scaling 교체 기록, 실제 시험 요청을 같은 시간대에 봅니다.",
  command: [
    "aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names <asg> --query 'AutoScalingGroups[].{Desired:DesiredCapacity,Health:HealthCheckType,Instances:Instances[].HealthStatus}'",
    "aws elbv2 describe-target-health --target-group-arn <tg-arn>",
    "curl -fsS https://<service>/health",
  ].join("\n"),
  normal: 'Desired=4, Health=ELB, Instances=[Healthy,Healthy,Healthy,Healthy]\nHTTP 200',
  normalReading: "VM·Load Balancer·애플리케이션의 세 신호가 모두 맞아야 현재 요청을 받는 용량으로 셉니다.",
  failure: 'Desired=4, Instances=[Healthy,Healthy,Healthy,Healthy]\nTargetHealth=unhealthy: Health checks failed\nHTTP 503',
  failureReading: "VM 교체를 늘리기 전에 상태 확인 주소의 성공 코드, 시작 유예 시간, Security Group과 애플리케이션 의존 서비스를 확인합니다.",
  sources: [
    { label: "AWS EC2 Auto Scaling · Health checks", href: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html", claim: "EC2·ELB·VPC Lattice·EBS·custom health signal과 unhealthy replacement 동작을 확인했습니다.", checkedAt },
    { label: "AWS Lambda · Understanding function scaling", href: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html", claim: "concurrency = 초당 요청 × 평균 처리 시간이라는 정의와 account·function 단위 concurrency 한도, reserved·provisioned concurrency의 차이를 확인했습니다.", checkedAt },
    { label: "Amazon ECS · Task lifecycle", href: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-lifecycle-explanation.html", claim: "container task의 provisioning부터 stopped까지 상태 전이를 확인했습니다.", checkedAt },
    { label: "Azure compute decision guide", href: "https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree", claim: "VM·container·application platform·serverless 후보를 workload 기준으로 좁히는 질문을 확인했습니다.", checkedAt },
    { label: "Azure Load Balancer · Health probes", href: "https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview", claim: "probe 실패가 새 연결과 기존 연결에 미치는 영향 및 protocol별 판정을 확인했습니다.", checkedAt },
  ],
});

export const storageDatabaseSelectionDepth = lab({
  title: "데이터 한 건의 쓰기·읽기·복구 계약 확인표",
  question: "저장소를 용량과 가격만 보지 않고 일관성·지연·질의·복구 요구로 고를 수 있습니까?",
  rows: [
    ["쓰기", "한 key를 덮어쓰거나 동시에 쓸 때의 약속", "요청 ID·버전 ID", "충돌과 중복 요청 처리 설계"],
    ["읽기", "쓴 직후 읽기와 목록·질의의 기대 결과", "쓰기→읽기 검증 로그", "캐시와 복제 지연 허용 범위"],
    ["보존", "삭제·덮어쓰기 뒤 되돌릴 수 있는 기간", "버전 관리·보존 정책", "실수·악성 삭제 대응"],
    ["복구", "RPO 시점과 RTO 안의 실제 복원", "복원 ID·완료 시각·검증 질의", "백업을 실제 사용 가능한 상태로 복원"],
  ],
  conclusion: "백업 작업의 초록불보다 새 위치에 복원한 데이터가 검증 질의를 통과한 시점이 복구 증거입니다.",
  eyebrow: "실습 · 쓴 뒤 바로 읽기",
  evidenceTitle: "객체 한 개를 쓰고 바로 읽은 결과를 요청 ID와 함께 남깁니다",
  evidenceQuestion: "일관성에 관한 설명을 실제 클라이언트 요청에서 확인할 수 있습니까?",
  body: "직접 소유한 실습 bucket에서만 실행합니다. 버전 관리와 암호화 상태를 먼저 읽고, 겹치지 않는 key를 PUT한 뒤 HEAD 결과와 checksum을 대조합니다.",
  command: [
    "aws s3api get-bucket-versioning --bucket <lab-bucket>",
    "printf 'cloud-lab' > /tmp/cloud-lab.txt",
    "aws s3api put-object --bucket <lab-bucket> --key drills/<run-id>.txt --body /tmp/cloud-lab.txt",
    "aws s3api head-object --bucket <lab-bucket> --key drills/<run-id>.txt",
    "aws rds describe-db-instances --db-instance-identifier <db> --query 'DBInstances[].{Earliest:EarliestRestorableTime,Latest:LatestRestorableTime}'",
  ].join("\n"),
  normal: 'VersionId=3Lg...\nContentLength=9, ServerSideEncryption=aws:kms\nLatestRestorableTime=2026-10-08T10:20:00Z',
  normalReading: "객체 검증과 DB를 복구할 수 있는 시점은 다른 약속입니다. 둘을 하나의 ‘저장소 정상’으로 뭉치지 않습니다.",
  failure: 'VersioningStatus=(empty)\nAccessDenied: s3:PutObject\nLatestRestorableTime=null',
  failureReading: "버전 관리·권한·백업 설정 중 빠진 조건을 하나씩 확인합니다. 운영 데이터에 복구 명령을 바로 시험하지 않습니다.",
  sources: [
    { label: "Amazon S3 · Consistency model", href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel", claim: "PUT·DELETE 뒤 read와 list의 strong consistency, single-key update의 atomicity 경계를 확인했습니다.", checkedAt },
    { label: "Amazon RDS · Point-in-time restore", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html", claim: "backup retention 안의 시점으로 새 DB instance를 복원하는 동작과 초기화 중 성능 주의를 확인했습니다.", checkedAt },
    { label: "AWS Well-Architected · Back up data", href: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/back-up-data.html", claim: "복구 요구에 맞춘 backup과 정기 restore test 원칙을 확인했습니다.", checkedAt },
    { label: "Azure Storage redundancy", href: "https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy", claim: "LRS·ZRS·GRS 계열의 복제 범위와 failover trade-off를 확인했습니다.", checkedAt },
    { label: "Azure reliability · Replication and backup", href: "https://learn.microsoft.com/en-us/azure/reliability/concept-redundancy-replication-backup", claim: "replication과 backup이 서로 대신하지 않는 복구 역할을 확인했습니다.", checkedAt },
  ],
});

export const reliabilityObservabilityIacDepth = lab({
  title: "변경 한 건을 계획·관측·복구로 닫는 확인표",
  question: "IaC 배포 성공을 서비스 성공으로 착각하지 않으려면 어떤 증거가 더 필요합니까?",
  rows: [
    ["변경 전", "무엇이 생성·수정·삭제되는지", "plan·what-if 원문·승인자", "위험 변경 차단"],
    ["변경 중", "배포 ID와 자원별 작업", "event 흐름·연결 ID", "처음 실패한 자원 추적"],
    ["변경 후", "서비스 목표 신호와 시험 요청", "지표·trace·요청 결과", "기대 효과 검증"],
    ["복구", "되돌리기 또는 계속 고치기가 목표 시간 안에 되는지", "복구 명령·소요 시간", "복구 절차·RTO 갱신"],
  ],
  conclusion: "IaC는 기대 상태를 기록하고, 관측은 실제 상태를 보여주며, 복구 시험은 두 상태가 어긋났을 때 돌아오는 능력을 증명합니다.",
  eyebrow: "실습 · 변경 전후",
  evidenceTitle: "배포 계획, 선언과 실제 구성의 차이, 사전 변경 보기를 따로 보관합니다",
  evidenceQuestion: "‘코드와 동일하다’는 말을 실제 자원 상태까지 확인한 결과로 바꿀 수 있습니까?",
  body: "배포 계획에 변경이 없어도 사람이 화면에서 바꾼 값이나 도구가 추적하지 못하는 속성이 남을 수 있습니다. 코드 계획, 실제 구성의 차이, 시험 요청 결과를 각각 보관합니다.",
  command: [
    "terraform plan -out=tfplan",
    "terraform show -json tfplan > tfplan.json",
    "aws cloudformation detect-stack-drift --stack-name <stack>",
    "az deployment group what-if -g <rg> -f main.bicep --no-pretty-print",
  ].join("\n"),
  normal: 'Terraform: 0 to add, 1 to change, 0 to destroy\nCloudFormation: IN_SYNC\nBicep what-if: Modify=1, Delete=0',
  normalReading: "의도한 한 변경만 있는지 검토한 뒤 배포합니다. 배포 후에는 실제 애플리케이션 신호로 다시 확인합니다.",
  failure: 'Terraform: 3 to add, 2 to change, 4 to destroy\nCloudFormation: DRIFTED\nBicep what-if: Delete=2',
  failureReading: "예상하지 못한 삭제나 실제 구성 차이가 있으면 배포를 멈춥니다. 상태 파일·적용 범위·수동 변경을 확인하고 복구안을 먼저 만듭니다.",
  sources: [
    { label: "Terraform · Plan", href: "https://developer.hashicorp.com/terraform/cli/commands/plan", claim: "refresh·configuration·proposed change를 비교하는 speculative/saved plan의 경계를 확인했습니다.", checkedAt },
    { label: "AWS · Terraform state and backends", href: "https://docs.aws.amazon.com/prescriptive-guidance/latest/getting-started-terraform/states-and-backends.html", claim: "remote state·locking·encryption을 팀 운영의 전제로 확인했습니다.", checkedAt },
    { label: "Azure Engineering · Chaos engineering과 fault injection", href: "https://azure.microsoft.com/en-us/blog/advancing-resilience-through-chaos-engineering-and-fault-injection/", claim: "복구 문서만 읽는 것과 실제 fault를 주입해 telemetry·자동 복구·사람의 대응을 검증하는 것의 차이를 운영 사례로 참고했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const awsClfDepth = lab({
  title: "CLF 개념을 요청 한 번의 비용·권한·지역 증거로 묶는 확인표",
  question: "서비스 이름을 외운 뒤 실제 AWS 계정에서 비용과 보안 책임을 확인할 수 있습니까?",
  rows: [
    ["요청한 사용자", "누가 요청하는가", "STS ARN", "최소 권한인지 확인"],
    ["리전", "어느 지역의 자원을 보는가", "설정된 리전·자원 ARN", "데이터 위치와 지연 확인"],
    ["서비스", "AWS가 관리하는 범위와 고객 설정", "자원 설정", "공동 책임 구분"],
    ["비용", "사용량·단가·tag가 연결되는가", "Cost Explorer의 tag별 묶음", "담당자와 줄일 비용 지정"],
  ],
  conclusion: "CLF 학습은 서비스 정의 암기에서 끝나지 않습니다. 한 자원의 사용자·위치·책임·비용을 한 장에서 설명할 수 있어야 합니다.",
  eyebrow: "실습 · 자원 한 개",
  evidenceTitle: "현재 계정과 리전에서 tag가 비용 집계까지 이어지는지 확인합니다",
  evidenceQuestion: "비용 숫자에 담당자와 작업 이름을 붙일 수 있습니까?",
  body: "Cost Explorer API는 별도 권한과 활성화가 필요합니다. 실패 결과도 비용 조회 권한의 범위를 확인하는 증거가 됩니다.",
  command: [
    "aws sts get-caller-identity",
    "aws configure get region",
    "aws ce get-cost-and-usage --time-period Start=<yyyy-mm-01>,End=<yyyy-mm-dd> --granularity MONTHLY --metrics UnblendedCost --group-by Type=TAG,Key=workload",
  ].join("\n"),
  normal: 'Account=111122223333, Region=ap-southeast-1\nworkload=lab, UnblendedCost=12.34 USD',
  normalReading: "숫자보다 계정·기간·측정 항목·tag가 맞는지 먼저 봅니다. tag가 없는 비용은 담당자 미확정 항목으로 남깁니다.",
  failure: 'AccessDeniedException: ce:GetCostAndUsage\nworkload=(no tag), Cost=87.65 USD',
  failureReading: "AdministratorAccess를 요구하지 않습니다. 비용 읽기 권한과 비용 배분 tag 활성화를 각각 담당자에게 요청합니다.",
  sources: [
    { label: "AWS CLF-C02 Exam Guide", href: "https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html", claim: "현재 domain과 in-scope knowledge를 확인했습니다.", checkedAt },
    { label: "AWS · Shared responsibility model", href: "https://aws.amazon.com/compliance/shared-responsibility-model/", claim: "service model에 따라 달라지는 provider/customer 책임을 확인했습니다.", checkedAt },
    { label: "AWS Cost Explorer API", href: "https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html", claim: "기간·granularity·metric·group-by로 비용을 조회하는 API 계약을 확인했습니다.", checkedAt },
    ...awsIdentitySources,
  ],
});

export const awsSaaDepth = lab({
  title: "SAA 선택지를 요구·고장 범위·검증으로 바꾸는 확인표",
  question: "‘고가용’이라는 말을 어느 장애에서 어떤 사용자 요청이 살아남는지로 설명할 수 있습니까?",
  rows: [
    ["요구", "RTO·RPO·p95 지연·트래픽", "서비스 목표와 작업 부하", "설계 후보의 입력"],
    ["고장 범위", "VM·가용 영역·리전·의존 서비스 중 무엇이 사라지는가", "고장 원인 나무", "중복·격리 범위 결정"],
    ["데이터", "복제와 백업의 범위", "일관성·복원 시험", "RPO와 데이터 손상 대응"],
    ["검증", "실패를 만든 뒤 사용자 요청 결과", "시험 ID·지표·trace", "가정 승인 또는 재설계"],
  ],
  conclusion: "시험 선택지는 서비스 조합이지만 실제 설계에는 요구, 고장 범위, 비용, 검증 결과가 한 결정으로 이어져야 합니다.",
  eyebrow: "실습 · 도달 가능성",
  evidenceTitle: "구성에서 막힌 구간을 찾고 실제 요청으로 확인을 마칩니다",
  evidenceQuestion: "Security Group 하나를 열기 전에 경로표·NACL·Load Balancer 중 어디가 막는지 좁힐 수 있습니까?",
  body: "Reachability Analyzer는 구성을 분석할 뿐 애플리케이션에 실제 요청을 보내지 않습니다. 따라서 경로 분석 결과와 시험 HTTP 요청을 따로 확인합니다.",
  command: [
    "aws ec2 start-network-insights-analysis --network-insights-path-id <path-id>",
    "aws ec2 describe-network-insights-analyses --network-insights-analysis-ids <analysis-id>",
    "curl -fsS -w '%{http_code} %{time_total}\\n' https://<service>/health",
  ].join("\n"),
  normal: 'NetworkPathFound=true\nHTTP 200 0.084',
  normalReading: "구성 경로와 실제 애플리케이션 응답이 모두 맞아야 이 요청이 정상이라고 판정합니다.",
  failure: 'NetworkPathFound=false\nExplanationCode=ENI_SG_RULES_MISMATCH\nHTTP timeout',
  failureReading: "설명에 나온 자원과 규칙만 수정 후보로 올리고, 변경 전후의 분석 ID를 함께 보관합니다.",
  sources: [
    { label: "AWS SAA-C03 Exam Guide", href: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html", claim: "secure·resilient·high-performing·cost-optimized architecture의 현재 평가 범위를 확인했습니다.", checkedAt },
    ...awsNetworkSources,
    ...reliabilitySources,
  ],
});

export const awsDeveloperCloudOpsDepth = lab({
  title: "빌드 결과물에서 되돌리기까지 배포 한 건을 추적하는 확인표",
  question: "배포 자동화가 성공한 것과 사용자 요청이 성공한 것을 나누고, 어느 빌드 결과물이 어디에 배포됐는지 찾을 수 있습니까?",
  rows: [
    ["빌드 결과물", "commit·image digest·SBOM", "바뀌지 않는 digest·서명", "같은 실행물 재현"],
    ["배포", "대상·배포 방식·변경 목록", "배포 ID·event", "부분 실패 위치 추적"],
    ["서비스 상태", "응답 가능 여부·오류율·지연", "경보·trace·시험 요청", "계속/중단/되돌리기"],
    ["복구", "이전 빌드 결과물과 데이터의 호환성", "되돌리기 ID·소요 시간", "복구 절차 검증"],
  ],
  conclusion: "DevOps 역량은 도구 수가 아니라 commit에서 빌드·배포·사용자 요청·되돌리기까지 같은 변경을 끊기지 않게 추적하는 능력입니다.",
  eyebrow: "실습 · 실제 구성 차이와 되돌리기",
  evidenceTitle: "배포가 끝난 뒤 선언과 실제 구성의 차이, 경보 이력을 함께 읽습니다",
  evidenceQuestion: "배포 자동화는 성공했지만 서비스가 실패하는 장면을 잡을 수 있습니까?",
  body: "배포 event는 자원 변경을, 경보는 서비스 상태를 보여 줍니다. 둘을 같은 배포 ID와 시각으로 묶어야 되돌릴지 계속 고칠지 판단할 수 있습니다.",
  command: [
    "aws cloudformation describe-stack-events --stack-name <stack> --max-items 20",
    "aws cloudwatch describe-alarm-history --alarm-name <alarm> --history-item-type StateUpdate",
    "aws cloudformation detect-stack-drift --stack-name <stack>",
  ].join("\n"),
  normal: 'StackStatus=UPDATE_COMPLETE\nAlarm=OK\nDriftStatus=IN_SYNC',
  normalReading: "이 세 줄에 실제 시험 요청 결과와 배포한 image digest를 함께 보관합니다.",
  failure: 'StackStatus=UPDATE_COMPLETE\nAlarm=ALARM: 5xx_rate\nDriftStatus=DRIFTED',
  failureReading: "UPDATE_COMPLETE만으로 배포 성공을 확정할 수 없습니다. 경보가 바뀐 시각과 수정한 자원을 대조하고, 되돌리거나 계속 고칩니다.",
  sources: [
    { label: "AWS Developer Associate exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html", claim: "development·security·deployment·troubleshooting 평가 범위를 확인했습니다.", checkedAt },
    { label: "AWS CloudOps Engineer exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html", claim: "monitoring·performance, reliability, deployment·automation, security·compliance, networking·content delivery 다섯 영역을 확인했습니다. 비용·TCO 분석은 가이드가 범위 밖으로 명시합니다.", checkedAt },
    { label: "AWS CloudFormation · Stack events", href: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-monitor-stack.html", claim: "resource별 update event와 failure reason을 추적하는 절차를 확인했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const azureAz900Depth = lab({
  title: "AZ-900 개념을 tenant·구독·자원·비용 경로로 묶는 확인표",
  question: "Azure의 관리 계층을 그림이 아니라 현재 요청이 적용되는 실제 범위로 읽을 수 있습니까?",
  rows: [
    ["로그인 사용자", "tenant와 현재 로그인한 사용자", "az account JSON", "다른 directory 로그인 차단"],
    ["적용 범위", "관리 그룹→구독→자원 그룹→자원", "자원 ID", "정책·RBAC 상속 해석"],
    ["서비스", "IaaS/PaaS/SaaS별 운영 책임", "구성 목록", "고객 복구 절차의 범위 결정"],
    ["비용", "자원 tag와 과금 단위", "비용 내보내기·tag 적용률", "담당자·예산 조치"],
  ],
  conclusion: "AZ-900은 용어 암기에서 끝내지 않고 실제 자원 ID 한 줄에서 tenant·구독·자원 그룹·공급자 종류를 읽는 데까지 가져갑니다.",
  eyebrow: "실습 · 적용 범위 한 줄",
  evidenceTitle: "자원 ID에서 관리 계층과 권한 조사를 시작합니다",
  evidenceQuestion: "같은 이름의 자원을 다른 구독에서 보는 실수를 막을 수 있습니까?",
  body: "Azure 자원 ID에는 구독, 자원 그룹, 공급자 종류가 들어 있습니다. 화면 표시 이름보다 이 값을 조사 기록의 공통 열쇠로 사용합니다.",
  command: [
    "az account show --query '{tenant:tenantId,subscription:id,user:user.name}' -o json",
    "az resource show --ids <resource-id> --query '{id:id,type:type,location:location,tags:tags}' -o json",
    "az role assignment list --scope <resource-id> --include-inherited -o table",
  ].join("\n"),
  normal: 'tenant=expected, subscription=lab-sub\nid=/subscriptions/.../resourceGroups/lab/providers/Microsoft.Storage/storageAccounts/lab',
  normalReading: "이 ID를 정책·Activity Log·비용 질의의 공통 열쇠로 사용합니다.",
  failure: 'subscription=production-sub\n(ResourceNotFound) resource was not found',
  failureReading: "자원이 없다고 바로 새로 만들지 않습니다. 먼저 tenant·구독·자원 ID가 맞는지와 권한 때문에 숨겨진 것은 아닌지 확인합니다.",
  sources: [
    { label: "Microsoft Learn · AZ-900 study guide", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900", claim: "cloud concepts·Azure architecture/services·management/governance의 현재 범위를 확인했습니다.", checkedAt },
    { label: "Azure Resource Manager · Understand scope", href: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/overview", claim: "management group·subscription·resource group·resource의 hierarchy를 확인했습니다.", checkedAt },
    { label: "Azure resource IDs", href: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules", claim: "resource ID와 이름·type·scope를 구분하는 기준을 확인했습니다.", checkedAt },
    ...azureIdentitySources,
  ],
});

export const azureAz104Depth = lab({
  title: "AZ-104 운영 문제를 사용자·DNS·경로·서비스 상태 순서로 푸는 확인표",
  question: "Private Endpoint 연결 실패에서 NSG를 무작정 열지 않고 처음 실패한 곳을 찾을 수 있습니까?",
  rows: [
    ["사용자와 권한", "운영자와 작업이 실제로 쓰는 사용자", "계정·역할 할당", "권한 문제 제거"],
    ["DNS", "FQDN이 사설 IP로 해석되는가", "Private DNS Zone·VNet 연결·nslookup", "DNS 해석 경로 수정"],
    ["경로와 보안 규칙", "실제 적용 경로와 NSG가 흐름을 허용하는가", "Network Watcher 결과", "정확한 규칙만 수정"],
    ["서비스", "연결 승인 상태와 공개 접근 설정", "Private Endpoint 상태·서비스 로그", "공급자 승인·서비스 설정"],
  ],
  conclusion: "관리자 실무의 핵심은 자원을 빨리 만드는 것보다 실패한 요청을 사용자 확인에서 서비스까지 차례로 좁히는 능력입니다.",
  eyebrow: "실습 · Private Endpoint",
  evidenceTitle: "사설 IP 해석과 실제 적용 경로를 먼저 확인합니다",
  evidenceQuestion: "403과 시간 초과를 같은 네트워크 문제로 취급하지 않을 수 있습니까?",
  body: "VM 안의 DNS 결과와 Azure가 보여 주는 Private Endpoint 상태를 함께 봅니다. 공개 IP가 나오면 경로표나 NSG보다 DNS를 먼저 고칩니다.",
  command: [
    "az network private-endpoint show -g <rg> -n <pe> --query '{state:privateLinkServiceConnections[].privateLinkServiceConnectionState.status,nics:networkInterfaces[].id}' -o json",
    "az network private-dns link vnet list -g <dns-rg> -z <zone> -o table",
    "az network nic show-effective-route-table -g <rg> -n <nic> -o table",
    "nslookup <service-fqdn>",
  ].join("\n"),
  normal: 'state=Approved\n<service-fqdn> -> 10.20.1.7\nroute 10.20.1.0/24 VirtualNetwork',
  normalReading: "DNS와 경로가 맞으면 TCP 연결 시험과 서비스 인증으로 넘어갑니다.",
  failure: 'state=Approved\n<service-fqdn> -> 52.1.2.3',
  failureReading: "Private DNS Zone 이름·A record·VNet 연결·사용자 DNS 전달 설정을 확인합니다. 아직 NSG를 바꿀 근거는 없습니다.",
  sources: [
    { label: "Microsoft Learn · AZ-104 study guide", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104", claim: "identity·storage·compute·virtual networking·monitoring의 2026-04-17 평가 범위를 확인했습니다.", checkedAt },
    ...azureIdentitySources,
    ...azureNetworkSources,
    { label: "Azure Network Watcher", href: "https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-overview", claim: "connection troubleshoot·IP flow verify·next hop 등 network diagnostic 도구의 범위를 확인했습니다.", checkedAt },
  ],
});

export const azureArchitectDevopsDepth = lab({
  title: "Azure 설계 결정을 Bicep 변경과 운영 신호로 닫는 확인표",
  question: "구성도 안의 한 상자를 다시 실행할 수 있는 배포·관측·복구 단위로 바꿀 수 있습니까?",
  rows: [
    ["결정", "요구·대안·장단점", "ADR", "선택 이유 보존"],
    ["배포", "Bicep module·parameter·사용자", "what-if·실제 배포 작업", "변경이 퍼지는 범위 통제"],
    ["관측", "가용성·지연·오류·의존 서비스", "지표·로그·trace·경보", "사용자 영향 판정"],
    ["복구", "가용 영역·리전 장애와 데이터 복원", "전환·복원 훈련", "RTO·RPO 검증"],
  ],
  conclusion: "설계자는 구성도를 그리고 끝내지 않고, DevOps 담당자는 배포 자동화를 만들고 끝내지 않습니다. 같은 결정 ID가 코드·관측·복구 기록에 이어져야 합니다.",
  eyebrow: "실습 · 예상 변경에서 실제 작업까지",
  evidenceTitle: "예상한 변경과 실제 배포 작업을 대조합니다",
  evidenceQuestion: "Bicep 배포 성공 뒤 어떤 자원이 실제로 바뀌었는지 추적할 수 있습니까?",
  body: "what-if 결과에는 한계와 불필요한 차이가 있을 수 있으므로 실제 배포 작업도 함께 보관합니다. 서비스 상태는 Application Insights나 시험 요청으로 따로 확인합니다.",
  command: [
    "az deployment group what-if -g <rg> -f main.bicep --no-pretty-print",
    "az deployment group create -g <rg> -f main.bicep -n <deployment-id>",
    "az deployment operation group list -g <rg> -n <deployment-id> -o table",
    "az monitor metrics list --resource <resource-id> --metric 'Http5xx' --interval PT1M",
  ].join("\n"),
  normal: 'what-if: Modify=1 Delete=0\ndeployment: Succeeded\nHttp5xx=0',
  normalReading: "변경 수와 실제 작업, 서비스 신호가 예상과 일치하면 배포가 끝난 것으로 판정합니다.",
  failure: 'what-if: Delete=2\ndeployment: not started',
  failureReading: "의도하지 않은 삭제는 승인 전에 멈춥니다. 적용 범위·조건문·기존 자원 참조를 고친 뒤 what-if를 다시 실행합니다.",
  sources: [
    { label: "Azure Architecture Center", href: "https://learn.microsoft.com/en-us/azure/architecture/", claim: "architecture style·technology choice·reference architecture를 요구와 trade-off에 연결하는 공식 지침을 확인했습니다.", checkedAt },
    { label: "Azure DevOps documentation", href: "https://learn.microsoft.com/en-us/azure/devops/", claim: "repository·pipeline·artifact·deployment 운영 범위를 확인했습니다.", checkedAt },
    { label: "Azure Well-Architected Framework", href: "https://learn.microsoft.com/en-us/azure/well-architected/", claim: "reliability·security·cost·operations·performance의 trade-off 검토 체계를 확인했습니다.", checkedAt },
    { label: "Azure Engineering · Safe deployment practices", href: "https://azure.microsoft.com/en-us/blog/advancing-safe-deployment-practices/", claim: "단계적 rollout, health signal과 자동 중단을 architecture decision에서 release evidence까지 잇는 운영 맥락으로 참고했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const azureAi200Depth = lab({
  title: "AI 요청 한 건을 모델 주소·의존 서비스·품질·비용으로 추적하는 확인표",
  question: "HTTP 200인 모델 응답이 사용자에게도 좋은 결과였는지 어떻게 증명합니까?",
  rows: [
    ["요청", "배포 이름·모델 버전·입력 종류", "trace ID·배포 이름", "같은 조건으로 다시 보낼 요청 확보"],
    ["실행", "지연·token·재시도·tool 호출", "OpenTelemetry 구간 기록", "병목·오류 위치 추적"],
    ["품질", "근거 충실성·관련성·안전·업무 성공", "평가 데이터·점수", "배포 기준 판정"],
    ["비용", "token·호출·평가 사용량", "사용량 지표·비용 항목", "품질 대비 비용 비교"],
  ],
  conclusion: "AI 서비스는 HTTP 상태 코드 하나만으로 정상이라고 할 수 없습니다. 같은 trace ID에서 실행 성공·품질·안전·비용 기준을 함께 통과해야 합니다.",
  eyebrow: "실습 · 요청 기록에서 품질 평가로",
  evidenceTitle: "실패한 응답의 trace ID를 KQL로 좁혀 의존 서비스와 품질 결과를 잇습니다",
  evidenceQuestion: "느린 모델인지, 느린 검색인지, 잘못된 tool 호출인지 구분할 수 있습니까?",
  body: "trace에는 비밀값이나 민감한 원문을 넣지 않습니다. 요청·의존 서비스 구간과 평가 실행 ID를 연결해 같은 사례를 다시 평가할 수 있게 합니다.",
  language: "kusto",
  command: [
    "let target = '<operation-id>';",
    "union AppRequests, AppDependencies, AppTraces",
    "| where OperationId == target",
    "| project TimeGenerated, ItemType, Name, DurationMs, Success, ResultCode, Properties",
    "| order by TimeGenerated asc",
  ].join("\n"),
  normal: 'request 820ms success=true\nsearch 120ms success=true\nmodel 640ms success=true\nevaluation groundedness=4.7 task_completion=1',
  normalReading: "실행 시간과 평가 점수를 같은 요청·평가 ID로 보관합니다. 통과 기준은 업무별로 미리 정합니다.",
  failure: 'request 8100ms success=true\nsearch 7450ms success=true\nevaluation groundedness=1.8 task_completion=0',
  failureReading: "HTTP 요청은 성공했으므로 가용성 경보만으로는 잡히지 않습니다. 느린 의존 서비스와 품질 기준을 각각 고친 뒤 같은 평가 데이터로 다시 확인합니다.",
  sources: [
    { label: "Microsoft Learn · AI-200 study guide", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200", claim: "Azure AI solution의 back-end 구현·integration·security·monitoring 평가 범위를 확인했습니다.", checkedAt },
    { label: "Microsoft Foundry · GenAI observability", href: "https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/observability", claim: "evaluation·monitoring·distributed tracing을 AI application lifecycle에서 결합하는 기준을 확인했습니다.", checkedAt },
    { label: "Application Insights OpenTelemetry", href: "https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview", claim: "request·dependency·trace와 application map·failure·performance view의 범위를 확인했습니다.", checkedAt },
    { label: "Microsoft Foundry · Trace evaluation", href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation-deployed-interactions", claim: "Application Insights의 operation ID를 이용한 deployed interaction 평가 흐름을 확인했습니다.", checkedAt },
    { label: "Microsoft Foundry · Evaluation permissions", href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluation-permissions", claim: "project identity와 Application Insights data reader role의 최소 권한 경계를 확인했습니다.", checkedAt },
  ],
});
