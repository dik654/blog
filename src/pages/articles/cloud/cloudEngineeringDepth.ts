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
  title: "자격증 한 개를 운영 증거 한 묶음으로 바꾸는 원장",
  question: "합격 지식이 실제 설계·진단 능력으로 이어졌다는 것을 무엇으로 보여줄 수 있습니까?",
  rows: [
    ["요청 주체", "내 CLI가 어느 account·subscription의 누구인지", "STS·az account 원문", "권한 문제와 resource 문제를 분리"],
    ["요청 경로", "DNS→route→policy→service 중 어디까지 갔는지", "dig·reachability·flow log", "첫 실패 경계부터 조사"],
    ["변경", "배포 전후 기대 상태가 무엇인지", "plan/what-if·deployment ID", "승인·rollback 조건 결정"],
    ["복구", "backup 존재가 아니라 목표 시간 안에 읽을 수 있는지", "restore ID·검증 query·소요 시간", "RTO·RPO 달성 여부"],
  ],
  conclusion: "자격증은 용어의 지도를 주지만, 포트폴리오는 한 요청과 한 장애, 한 변경, 한 복구의 원문 증거로 완성됩니다.",
  eyebrow: "실습 · 시작점 고정",
  evidenceTitle: "명령을 실행하기 전에 ‘나는 누구이며 어디를 보고 있는가’를 남깁니다",
  evidenceQuestion: "계정과 지역을 잘못 본 상태에서 만든 진단 결과를 어떻게 막습니까?",
  body: "AWS와 Azure 모두 첫 출력은 자원 목록이 아니라 실행 주체와 scope입니다. 이 결과를 실습 폴더의 첫 파일로 저장하면 뒤의 실패가 권한 때문인지, 다른 환경을 본 것인지 되짚을 수 있습니다.",
  command: [
    "aws sts get-caller-identity",
    "aws configure get region",
    "az account show --query '{subscription:id,tenant:tenantId,user:user.name}' -o json",
    "az configure --list-defaults -o table",
  ].join("\n"),
  normal: 'Account=111122223333, Arn=arn:aws:iam::111122223333:role/lab-reader\nsubscription=lab-subscription, tenant=expected-tenant',
  normalReading: "예상한 identity와 scope가 맞은 뒤에만 실습을 진행합니다. 원문에는 시각과 실습 ID도 함께 남깁니다.",
  failure: 'Account=999900001111\nsubscription=production-subscription',
  failureReading: "다른 환경이면 즉시 중단합니다. 이 출력은 서비스 장애 증거가 아니라 진단자가 잘못된 scope를 보고 있다는 증거입니다.",
  sources: [
    ...awsIdentitySources,
    ...azureIdentitySources,
    { label: "AWS Certification Exam Guides", href: "https://docs.aws.amazon.com/aws-certification/latest/examguides/", claim: "시험별 target candidate·content outline·in-scope service를 최신 공식 목차에서 확인하도록 연결했습니다.", checkedAt },
    { label: "Microsoft Credentials", href: "https://learn.microsoft.com/en-us/credentials/", claim: "role-based certification의 현재 시험·갱신·study guide 경로를 확인했습니다.", checkedAt },
  ],
});

export const cloudFoundationsDepth = lab({
  title: "장애 책임을 ‘건물·cloud·customer’ 세 층으로 나누는 원장",
  question: "한 VM이 응답하지 않을 때 provider 책임이라는 말부터 하지 않고 무엇을 확인합니까?",
  rows: [
    ["provider facility", "region·zone service health", "공식 health event ID", "provider incident 여부"],
    ["cloud control plane", "instance·disk·network resource state", "describe/show JSON", "resource state 이상 여부"],
    ["customer configuration", "OS·firewall·application health", "serial console·boot log·health probe", "구성 또는 application 복구"],
    ["business service", "사용자가 실제 요청을 완료하는지", "synthetic request·trace ID", "SLO 영향과 우회 결정"],
  ],
  conclusion: "공동 책임은 사고 비용을 떠넘기는 문구가 아니라, 같은 증상을 증거가 생기는 층별로 나누는 조사 순서입니다.",
  eyebrow: "실습 · 위치와 상태",
  evidenceTitle: "resource가 놓인 region·zone과 실제 상태를 한 번에 확인합니다",
  evidenceQuestion: "‘리전 장애’라는 추측을 resource inventory와 health evidence로 바꿀 수 있습니까?",
  body: "CLI 출력은 service health 자체를 대체하지 않습니다. 먼저 resource의 위치·state를 고정하고, provider event와 guest/application evidence를 같은 시간축에 놓습니다.",
  command: [
    "aws ec2 describe-instances --instance-ids <id> --query 'Reservations[].Instances[].{State:State.Name,AZ:Placement.AvailabilityZone,Vpc:VpcId}'",
    "az vm get-instance-view -g <rg> -n <vm> --query '{location:location,statuses:instanceView.statuses[].displayStatus}' -o json",
  ].join("\n"),
  normal: 'State=running, AZ=ap-southeast-1a\nPowerState/running, ProvisioningState/succeeded',
  normalReading: "control plane의 running은 application 정상과 다릅니다. 다음으로 health probe와 guest log를 확인합니다.",
  failure: 'State=running\nHTTP synthetic check: timeout',
  failureReading: "provider VM이 running인데 사용자 요청이 실패하면 guest network·OS·application 경계로 내려갑니다.",
  sources: [
    { label: "AWS · Shared responsibility model", href: "https://aws.amazon.com/compliance/shared-responsibility-model/", claim: "cloud 자체의 보안과 cloud 안의 고객 구성 책임을 구분하는 공식 경계를 확인했습니다.", checkedAt },
    { label: "Azure · Shared responsibility", href: "https://learn.microsoft.com/en-us/azure/security/fundamentals/shared-responsibility", claim: "IaaS·PaaS·SaaS에 따라 고객과 Microsoft 책임이 어떻게 달라지는지 확인했습니다.", checkedAt },
    { label: "AWS Regions and Availability Zones", href: "https://docs.aws.amazon.com/global-infrastructure/latest/regions/aws-regions-availability-zones.html", claim: "region과 Availability Zone의 물리·논리 격리 관계를 확인했습니다.", checkedAt },
    { label: "Azure regions and availability zones", href: "https://learn.microsoft.com/en-us/azure/reliability/regions-overview", claim: "region·availability zone과 zone 지원 resource의 경계를 확인했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const identityHierarchyDepth = lab({
  title: "한 API 요청의 권한 판정 원장",
  question: "403을 ‘권한이 없다’로 끝내지 않고 어느 정책 층의 어느 statement가 결정했는지 찾을 수 있습니까?",
  rows: [
    ["주체", "사람·role·managed identity 중 실제 token 주체", "caller identity·object ID", "잘못된 credential 여부"],
    ["행동·대상", "정확한 action과 resource ID", "CloudTrail/activity log request", "scope와 resource pattern 검사"],
    ["허용", "identity/resource role이 action을 허용하는지", "policy simulation·role assignment", "조건과 scope 검사"],
    ["상한·거부", "SCP·boundary·deny assignment가 막는지", "organization/boundary/deny 원문", "상위 관리자에게 수정 요청"],
  ],
  conclusion: "role 이름을 외우는 대신 주체·행동·대상·조건·상한을 한 요청에서 순서대로 확인하면 권한 모델을 다른 cloud에도 옮길 수 있습니다.",
  eyebrow: "실습 · 403 한 건",
  evidenceTitle: "현재 주체와 실제 assignment를 먼저 대조합니다",
  evidenceQuestion: "관리자처럼 보이는 role 이름만 보고 허용을 단정하지 않을 수 있습니까?",
  body: "아래 명령은 쓰기 권한을 바꾸지 않는 조회입니다. 실패한 request의 action·resource를 별도로 확보한 뒤 현재 주체와 scope가 맞는지부터 대조합니다.",
  command: [
    "aws sts get-caller-identity",
    "aws iam simulate-principal-policy --policy-source-arn <role-arn> --action-names s3:GetObject --resource-arns <object-arn>",
    "az account show --query '{subscription:id,user:user.name}' -o json",
    "az role assignment list --assignee <object-id> --all --include-inherited -o table",
  ].join("\n"),
  normal: 'EvalDecision=allowed\nRole=Storage Blob Data Reader, Scope=/subscriptions/.../storageAccounts/lab',
  normalReading: "simulation의 allow와 실제 API 성공은 같지 않을 수 있습니다. resource policy·SCP·network boundary와 token freshness를 계속 확인합니다.",
  failure: 'EvalDecision=implicitDeny\nroleAssignments=[]',
  failureReading: "먼저 scope와 principal ID를 다시 확인합니다. 곧바로 Owner를 부여하지 말고 필요한 action만 최소 scope에 추가합니다.",
  sources: [...awsIdentitySources, ...azureIdentitySources],
});

export const networkingRequestPathDepth = lab({
  title: "HTTPS 요청 하나의 hop-by-hop 진단 원장",
  question: "timeout이 났을 때 DNS·route·filter·listener·application 중 첫 실패 경계를 찾을 수 있습니까?",
  rows: [
    ["이름 해석", "client가 받은 A/CNAME과 TTL", "dig +trace/Resolve-DnsName", "public·private zone split 확인"],
    ["경로", "source에서 destination까지 선택된 route", "Reachability Analyzer/effective routes", "next hop·longest prefix 확인"],
    ["필터", "stateful SG/NSG와 stateless NACL", "rule·flow log", "방향·port·return path 확인"],
    ["서비스", "listener·target health·application 응답", "curl timing·health status·trace ID", "network와 application 분리"],
  ],
  conclusion: "‘network 문제’는 결론이 아니라 범위입니다. client에서 server로 한 hop씩 증거를 잇고 첫 번째 불일치를 찾습니다.",
  eyebrow: "실습 · 요청 한 번",
  evidenceTitle: "DNS 응답과 TCP/TLS/HTTP 시간을 같은 요청 ID로 묶습니다",
  evidenceQuestion: "이름은 풀리지만 연결이 안 되는 상태와, 연결은 되지만 application이 늦는 상태를 구분할 수 있습니까?",
  body: "`curl`의 단계별 시간은 packet capture를 대신하지 않지만 첫 분기에는 유용합니다. private endpoint라면 먼저 client가 private IP를 받았는지 확인합니다.",
  command: [
    "dig +noall +answer <service-fqdn>",
    "curl -sS -o /dev/null -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} first=%{time_starttransfer} total=%{time_total}\\n' https://<service-fqdn>/health",
    "aws ec2 describe-route-tables --filters Name=association.subnet-id,Values=<subnet-id>",
    "az network nic show-effective-route-table -g <rg> -n <nic> -o table",
  ].join("\n"),
  normal: '<service-fqdn> 30 IN A 10.20.1.7\ndns=0.012 connect=0.021 tls=0.047 first=0.083 total=0.084',
  normalReading: "private IP 응답과 각 단계의 baseline을 함께 저장합니다. 빠르다는 말 대신 이전 정상값과 비교합니다.",
  failure: '<service-fqdn> 30 IN A 52.1.2.3\ndns=0.010 connect=5.001 tls=0.000 first=0.000 total=5.001',
  failureReading: "private endpoint를 기대했는데 public IP를 받았다면 방화벽부터 바꾸지 않습니다. private DNS zone·VNet link·resolver forwarding을 먼저 확인합니다.",
  sources: [...awsNetworkSources, ...azureNetworkSources, { label: "Azure · Private endpoint DNS troubleshooting", href: "https://learn.microsoft.com/en-us/troubleshoot/azure/private-link/troubleshoot-private-endpoint-dns-resolution", claim: "private endpoint의 대표적인 DNS 오구성과 확인 순서를 점검했습니다.", checkedAt }],
});

export const computeSelectionDepth = lab({
  title: "VM·container·function을 같은 workload로 비교하는 원장",
  question: "서비스 이름이 아니라 시작 시간·실행 시간·상태·확장·운영권 요구로 compute를 고를 수 있습니까?",
  rows: [
    ["요청", "평균·p95 RPS와 burst 지속 시간", "load-test raw result", "상시 capacity와 burst 분리"],
    ["실행", "startup·처리 시간·state·device 요구", "cold/warm latency·runtime profile", "function/container/VM 후보 제거"],
    ["복구", "health signal이 application 성공을 보는지", "target health·replacement activity", "false healthy 방지"],
    ["운영", "patch·image·runtime 중 팀이 소유할 층", "RACI·runbook", "관리 편의와 제약 비용 비교"],
  ],
  conclusion: "compute 선택은 ‘서버리스가 편하다’가 아니라, workload 제약을 만족하는 후보 중 팀이 감당할 운영 경계를 고르는 일입니다.",
  eyebrow: "실습 · health의 의미",
  evidenceTitle: "instance running과 사용자 요청 성공을 분리합니다",
  evidenceQuestion: "Auto Scaling이 유지한 desired capacity가 실제 서비스 capacity와 같은지 확인할 수 있습니까?",
  body: "instance health만 쓰면 process가 멈춰도 healthy일 수 있습니다. target group health와 scaling activity, 실제 synthetic request를 같은 시간대에 봅니다.",
  command: [
    "aws autoscaling describe-auto-scaling-groups --auto-scaling-group-names <asg> --query 'AutoScalingGroups[].{Desired:DesiredCapacity,Health:HealthCheckType,Instances:Instances[].HealthStatus}'",
    "aws elbv2 describe-target-health --target-group-arn <tg-arn>",
    "curl -fsS https://<service>/health",
  ].join("\n"),
  normal: 'Desired=4, Health=ELB, Instances=[Healthy,Healthy,Healthy,Healthy]\nHTTP 200',
  normalReading: "resource·load balancer·application 세 신호가 일치해야 현재 serving capacity로 셉니다.",
  failure: 'Desired=4, Instances=[Healthy,Healthy,Healthy,Healthy]\nTargetHealth=unhealthy: Health checks failed\nHTTP 503',
  failureReading: "VM 교체를 늘리기 전에 health endpoint의 success code, startup grace period, security group과 application dependency를 확인합니다.",
  sources: [
    { label: "AWS EC2 Auto Scaling · Health checks", href: "https://docs.aws.amazon.com/autoscaling/ec2/userguide/ec2-auto-scaling-health-checks.html", claim: "EC2·ELB·VPC Lattice·EBS·custom health signal과 unhealthy replacement 동작을 확인했습니다.", checkedAt },
    { label: "AWS Lambda · Operator guide", href: "https://docs.aws.amazon.com/lambda/latest/operatorguide/intro.html", claim: "serverless workload의 scaling·concurrency·failure 운영 경계를 확인했습니다.", checkedAt },
    { label: "Amazon ECS · Task lifecycle", href: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task-lifecycle-explanation.html", claim: "container task의 provisioning부터 stopped까지 상태 전이를 확인했습니다.", checkedAt },
    { label: "Azure compute decision guide", href: "https://learn.microsoft.com/en-us/azure/architecture/guide/technology-choices/compute-decision-tree", claim: "VM·container·application platform·serverless 후보를 workload 기준으로 좁히는 질문을 확인했습니다.", checkedAt },
    { label: "Azure Load Balancer · Health probes", href: "https://learn.microsoft.com/en-us/azure/load-balancer/load-balancer-custom-probe-overview", claim: "probe 실패가 새 연결과 기존 연결에 미치는 영향 및 protocol별 판정을 확인했습니다.", checkedAt },
  ],
});

export const storageDatabaseSelectionDepth = lab({
  title: "데이터 한 건의 쓰기·읽기·복구 계약 원장",
  question: "저장소를 용량과 가격 대신 consistency·latency·query·복구 요구로 고를 수 있습니까?",
  rows: [
    ["쓰기", "한 key의 overwrite·동시 쓰기 semantics", "request ID·version ID", "충돌·idempotency 설계"],
    ["읽기", "read-after-write와 list/query 기대", "write→read 검증 log", "cache·replica lag 허용"],
    ["보존", "삭제·덮어쓰기에서 되돌릴 기간", "versioning·retention policy", "실수·악성 삭제 대응"],
    ["복구", "RPO 시점과 RTO 안의 실제 복원", "restore ID·완료 시각·검증 query", "backup을 운영 가능 상태로 승격"],
  ],
  conclusion: "backup job의 초록불이 아니라 새 위치에 복원한 데이터가 검증 query를 통과한 시점이 복구 증거입니다.",
  eyebrow: "실습 · write 뒤 read",
  evidenceTitle: "객체 한 개의 쓰기와 즉시 읽기를 request ID로 남깁니다",
  evidenceQuestion: "consistency 문구를 자신의 client 경로에서 재현할 수 있습니까?",
  body: "소유한 lab bucket에서만 실행합니다. versioning과 encryption 상태를 먼저 읽고, 고유한 key를 PUT한 뒤 HEAD와 checksum을 대조합니다.",
  command: [
    "aws s3api get-bucket-versioning --bucket <lab-bucket>",
    "printf 'cloud-lab' > /tmp/cloud-lab.txt",
    "aws s3api put-object --bucket <lab-bucket> --key drills/<run-id>.txt --body /tmp/cloud-lab.txt",
    "aws s3api head-object --bucket <lab-bucket> --key drills/<run-id>.txt",
    "aws rds describe-db-instances --db-instance-identifier <db> --query 'DBInstances[].{Earliest:EarliestRestorableTime,Latest:LatestRestorableTime}'",
  ].join("\n"),
  normal: 'VersionId=3Lg...\nContentLength=9, ServerSideEncryption=aws:kms\nLatestRestorableTime=2026-10-08T10:20:00Z',
  normalReading: "객체 검증과 DB 복구 가능 시점은 다른 계약입니다. 둘을 하나의 ‘storage 정상’으로 뭉치지 않습니다.",
  failure: 'VersioningStatus=(empty)\nAccessDenied: s3:PutObject\nLatestRestorableTime=null',
  failureReading: "versioning·권한·backup 설정 중 어느 조건이 빠졌는지 각각 닫습니다. 운영 데이터로 복구 명령을 시험하지 않습니다.",
  sources: [
    { label: "Amazon S3 · Consistency model", href: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html#ConsistencyModel", claim: "PUT·DELETE 뒤 read와 list의 strong consistency, single-key update의 atomicity 경계를 확인했습니다.", checkedAt },
    { label: "Amazon RDS · Point-in-time restore", href: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_PIT.html", claim: "backup retention 안의 시점으로 새 DB instance를 복원하는 동작과 초기화 중 성능 주의를 확인했습니다.", checkedAt },
    { label: "AWS Well-Architected · Back up data", href: "https://docs.aws.amazon.com/wellarchitected/latest/reliability-pillar/rel_planning_for_recovery_backup.html", claim: "복구 요구에 맞춘 backup과 정기 restore test 원칙을 확인했습니다.", checkedAt },
    { label: "Azure Storage redundancy", href: "https://learn.microsoft.com/en-us/azure/storage/common/storage-redundancy", claim: "LRS·ZRS·GRS 계열의 복제 범위와 failover trade-off를 확인했습니다.", checkedAt },
    { label: "Azure reliability · Replication and backup", href: "https://learn.microsoft.com/en-us/azure/reliability/concept-redundancy-replication-backup", claim: "replication과 backup이 서로 대신하지 않는 복구 역할을 확인했습니다.", checkedAt },
  ],
});

export const reliabilityObservabilityIacDepth = lab({
  title: "변경 한 건을 계획·관측·복구로 닫는 원장",
  question: "IaC 배포 성공을 서비스 성공으로 착각하지 않으려면 어떤 증거가 더 필요합니까?",
  rows: [
    ["변경 전", "무엇이 create/modify/delete 되는지", "plan/what-if 원문·승인자", "위험 변경 차단"],
    ["변경 중", "deployment ID와 resource operation", "event stream·correlation ID", "첫 실패 resource 추적"],
    ["변경 후", "SLO signal과 synthetic request", "metric·trace·request result", "기대 효과 검증"],
    ["복구", "rollback 또는 forward fix가 시간 안에 되는지", "복구 command·소요 시간", "runbook·RTO 갱신"],
  ],
  conclusion: "IaC는 기대 상태를 기록하고, 관측은 실제 상태를 보여주며, 복구 시험은 두 상태가 어긋났을 때 돌아오는 능력을 증명합니다.",
  eyebrow: "실습 · 변경 전후",
  evidenceTitle: "plan·drift·what-if를 배포와 분리해 보관합니다",
  evidenceQuestion: "‘코드와 동일하다’는 말을 실제 resource drift까지 확인한 결과로 바꿀 수 있습니까?",
  body: "plan이 깨끗해도 수동 변경이나 provider가 추적하지 못하는 속성이 남을 수 있습니다. 코드 계획과 platform drift, synthetic test를 서로 다른 증거로 보관합니다.",
  command: [
    "terraform plan -out=tfplan",
    "terraform show -json tfplan > tfplan.json",
    "aws cloudformation detect-stack-drift --stack-name <stack>",
    "az deployment group what-if -g <rg> -f main.bicep --no-pretty-print",
  ].join("\n"),
  normal: 'Terraform: 0 to add, 1 to change, 0 to destroy\nCloudFormation: IN_SYNC\nBicep what-if: Modify=1, Delete=0',
  normalReading: "의도한 한 변경만 있는지 검토한 뒤 배포합니다. 배포 후에는 application signal로 별도 검증합니다.",
  failure: 'Terraform: 3 to add, 2 to change, 4 to destroy\nCloudFormation: DRIFTED\nBicep what-if: Delete=2',
  failureReading: "예상하지 못한 delete나 drift가 있으면 배포를 멈춥니다. state·scope·수동 변경을 확인하고 복구안을 먼저 만듭니다.",
  sources: [
    { label: "Terraform · Plan", href: "https://developer.hashicorp.com/terraform/cli/commands/plan", claim: "refresh·configuration·proposed change를 비교하는 speculative/saved plan의 경계를 확인했습니다.", checkedAt },
    { label: "AWS · Terraform state and backends", href: "https://docs.aws.amazon.com/prescriptive-guidance/latest/getting-started-terraform/states-and-backends.html", claim: "remote state·locking·encryption을 팀 운영의 전제로 확인했습니다.", checkedAt },
    { label: "Azure Engineering · Chaos engineering과 fault injection", href: "https://azure.microsoft.com/en-us/blog/advancing-resilience-through-chaos-engineering-and-fault-injection/", claim: "복구 문서만 읽는 것과 실제 fault를 주입해 telemetry·자동 복구·사람의 대응을 검증하는 것의 차이를 운영 사례로 참고했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const awsClfDepth = lab({
  title: "CLF 개념을 요청 한 번의 비용·권한·지역 증거로 묶는 원장",
  question: "service 이름을 외운 뒤 실제 account에서 비용과 보안 책임을 확인할 수 있습니까?",
  rows: [
    ["identity", "누가 요청하는가", "STS ARN", "least privilege 검사"],
    ["region", "어디의 resource를 보는가", "configured region·resource ARN", "data residency·latency 검사"],
    ["service", "managed 범위와 고객 설정", "resource config", "shared responsibility 분리"],
    ["cost", "사용량·단가·tag가 연결되는가", "Cost Explorer group-by tag", "owner와 최적화 행동 지정"],
  ],
  conclusion: "CLF 학습의 완료 조건은 서비스 정의 암기가 아니라 한 resource의 주체·위치·책임·비용을 한 장에서 설명하는 것입니다.",
  eyebrow: "실습 · resource 한 개",
  evidenceTitle: "현재 account와 region에서 tag가 비용 원장까지 이어지는지 확인합니다",
  evidenceQuestion: "비용 숫자에 owner와 workload를 붙일 수 있습니까?",
  body: "Cost Explorer API는 별도 권한과 활성화가 필요합니다. 실패 자체도 billing 권한 경계를 확인하는 증거로 남깁니다.",
  command: [
    "aws sts get-caller-identity",
    "aws configure get region",
    "aws ce get-cost-and-usage --time-period Start=<yyyy-mm-01>,End=<yyyy-mm-dd> --granularity MONTHLY --metrics UnblendedCost --group-by Type=TAG,Key=workload",
  ].join("\n"),
  normal: 'Account=111122223333, Region=ap-southeast-1\nworkload=lab, UnblendedCost=12.34 USD',
  normalReading: "숫자보다 account·기간·metric·tag가 맞는지 먼저 봅니다. untagged 비용은 owner 미확정 항목으로 남깁니다.",
  failure: 'AccessDeniedException: ce:GetCostAndUsage\nworkload=(no tag), Cost=87.65 USD',
  failureReading: "AdministratorAccess를 요구하지 않습니다. billing reader 범위와 cost allocation tag 활성화를 담당자에게 분리 요청합니다.",
  sources: [
    { label: "AWS CLF-C02 Exam Guide", href: "https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html", claim: "현재 domain과 in-scope knowledge를 확인했습니다.", checkedAt },
    { label: "AWS · Shared responsibility model", href: "https://aws.amazon.com/compliance/shared-responsibility-model/", claim: "service model에 따라 달라지는 provider/customer 책임을 확인했습니다.", checkedAt },
    { label: "AWS Cost Explorer API", href: "https://docs.aws.amazon.com/aws-cost-management/latest/APIReference/API_GetCostAndUsage.html", claim: "기간·granularity·metric·group-by로 비용을 조회하는 API 계약을 확인했습니다.", checkedAt },
    ...awsIdentitySources,
  ],
});

export const awsSaaDepth = lab({
  title: "SAA 선택지를 요구·failure mode·검증으로 바꾸는 원장",
  question: "‘고가용’이라는 말을 어느 장애에서 어떤 사용자 요청이 살아남는지로 설명할 수 있습니까?",
  rows: [
    ["요구", "RTO·RPO·p95 latency·traffic", "SLO와 workload profile", "architecture 후보의 입력"],
    ["failure mode", "instance·AZ·region·dependency 중 무엇이 사라지는가", "fault tree", "중복·격리 범위 결정"],
    ["data", "replication과 backup의 범위", "consistency·restore test", "RPO와 corruption 대응"],
    ["검증", "실패 주입 뒤 사용자 요청 결과", "test ID·metric·trace", "가정 승인 또는 재설계"],
  ],
  conclusion: "시험 선택지는 service 조합이지만 설계 결과물은 요구와 failure mode, 비용, 검증 증거가 연결된 결정입니다.",
  eyebrow: "실습 · 도달 가능성",
  evidenceTitle: "구성만으로 막힌 hop을 찾고 실제 요청으로 판정을 마칩니다",
  evidenceQuestion: "security group 하나를 열기 전에 route·NACL·load balancer 중 어디가 막는지 좁힐 수 있습니까?",
  body: "Reachability Analyzer는 구성 분석이며 application response를 실행하지 않습니다. 따라서 path result와 synthetic HTTP를 서로 다른 증거로 봅니다.",
  command: [
    "aws ec2 start-network-insights-analysis --network-insights-path-id <path-id>",
    "aws ec2 describe-network-insights-analyses --network-insights-analysis-ids <analysis-id>",
    "curl -fsS -w '%{http_code} %{time_total}\\n' https://<service>/health",
  ].join("\n"),
  normal: 'NetworkPathFound=true\nHTTP 200 0.084',
  normalReading: "구성 경로와 실제 application 응답이 모두 맞아야 이 요청의 acceptance를 통과합니다.",
  failure: 'NetworkPathFound=false\nExplanationCode=ENI_SG_RULES_MISMATCH\nHTTP timeout',
  failureReading: "설명에 나온 component와 rule을 수정 후보로 올리고, 변경 전후 analysis ID를 함께 보존합니다.",
  sources: [
    { label: "AWS SAA-C03 Exam Guide", href: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html", claim: "secure·resilient·high-performing·cost-optimized architecture의 현재 평가 범위를 확인했습니다.", checkedAt },
    ...awsNetworkSources,
    ...reliabilitySources,
  ],
});

export const awsDeveloperCloudOpsDepth = lab({
  title: "배포 한 건을 build artifact에서 rollback까지 추적하는 원장",
  question: "pipeline 성공과 사용자 요청 성공을 분리하고, 어느 artifact가 어디에 배포됐는지 찾을 수 있습니까?",
  rows: [
    ["artifact", "commit·image digest·SBOM", "immutable digest·attestation", "실행물 재현"],
    ["deployment", "target·strategy·change set", "deployment ID·event", "부분 실패 위치 추적"],
    ["service", "health·error·latency", "alarm·trace·synthetic request", "계속/중단/rollback"],
    ["recovery", "이전 artifact와 data compatibility", "rollback ID·소요 시간", "runbook 검증"],
  ],
  conclusion: "DevOps 역량은 tool 수가 아니라 commit→artifact→deployment→request→rollback의 correlation을 끊기지 않게 만드는 능력입니다.",
  eyebrow: "실습 · drift와 rollback",
  evidenceTitle: "배포가 끝난 뒤 stack drift와 alarm history를 함께 읽습니다",
  evidenceQuestion: "pipeline green인데 서비스가 실패하는 장면을 잡을 수 있습니까?",
  body: "deployment event는 resource 변경을, alarm은 service signal을 말합니다. 둘을 deployment ID와 시간으로 묶어야 rollback 판단을 재현할 수 있습니다.",
  command: [
    "aws cloudformation describe-stack-events --stack-name <stack> --max-items 20",
    "aws cloudwatch describe-alarm-history --alarm-name <alarm> --history-item-type StateUpdate",
    "aws cloudformation detect-stack-drift --stack-name <stack>",
  ].join("\n"),
  normal: 'StackStatus=UPDATE_COMPLETE\nAlarm=OK\nDriftStatus=IN_SYNC',
  normalReading: "이 세 줄에 더해 synthetic request와 artifact digest를 release evidence로 묶습니다.",
  failure: 'StackStatus=UPDATE_COMPLETE\nAlarm=ALARM: 5xx_rate\nDriftStatus=DRIFTED',
  failureReading: "UPDATE_COMPLETE는 release acceptance가 아닙니다. alarm 전이 시각과 변경 resource를 대조하고 rollback 또는 forward fix를 실행합니다.",
  sources: [
    { label: "AWS Developer Associate exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html", claim: "development·security·deployment·troubleshooting 평가 범위를 확인했습니다.", checkedAt },
    { label: "AWS CloudOps Engineer exam guide", href: "https://docs.aws.amazon.com/aws-certification/latest/sysops-administrator-associate-03/sysops-administrator-associate-03.html", claim: "monitoring·reliability·deployment·security·networking·cost/optimization 평가 범위를 확인했습니다.", checkedAt },
    { label: "AWS CloudFormation · Stack events", href: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-updating-stacks-monitor-stack.html", claim: "resource별 update event와 failure reason을 추적하는 절차를 확인했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const azureAz900Depth = lab({
  title: "AZ-900 개념을 tenant·subscription·resource·비용 경로로 묶는 원장",
  question: "Azure hierarchy를 그림이 아니라 현재 요청의 실제 scope로 읽을 수 있습니까?",
  rows: [
    ["identity", "tenant와 signed-in principal", "az account JSON", "다른 directory 로그인 차단"],
    ["scope", "management group→subscription→RG→resource", "resource ID", "policy·RBAC 상속 해석"],
    ["service", "IaaS/PaaS/SaaS별 운영 책임", "configuration inventory", "고객 runbook 범위 결정"],
    ["cost", "resource tag와 meter", "cost export·tag coverage", "owner·budget action"],
  ],
  conclusion: "AZ-900은 용어 시험으로 끝내지 않고 실제 resource ID 한 줄에서 tenant·subscription·resource group·provider를 읽는 데까지 가져갑니다.",
  eyebrow: "실습 · scope 한 줄",
  evidenceTitle: "resource ID를 hierarchy와 권한 조사 시작점으로 씁니다",
  evidenceQuestion: "같은 이름의 resource를 다른 subscription에서 보는 실수를 막을 수 있습니까?",
  body: "Azure resource ID는 subscription과 resource group, provider type을 포함합니다. display name보다 이 값을 증거의 기본 key로 사용합니다.",
  command: [
    "az account show --query '{tenant:tenantId,subscription:id,user:user.name}' -o json",
    "az resource show --ids <resource-id> --query '{id:id,type:type,location:location,tags:tags}' -o json",
    "az role assignment list --scope <resource-id> --include-inherited -o table",
  ].join("\n"),
  normal: 'tenant=expected, subscription=lab-sub\nid=/subscriptions/.../resourceGroups/lab/providers/Microsoft.Storage/storageAccounts/lab',
  normalReading: "이 ID를 policy·activity log·cost query의 공통 key로 사용합니다.",
  failure: 'subscription=production-sub\n(ResourceNotFound) resource was not found',
  failureReading: "resource가 없다고 만들지 않습니다. 먼저 tenant·subscription·resource ID와 권한으로 인한 은닉을 확인합니다.",
  sources: [
    { label: "Microsoft Learn · AZ-900 study guide", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-900", claim: "cloud concepts·Azure architecture/services·management/governance의 현재 범위를 확인했습니다.", checkedAt },
    { label: "Azure resource hierarchy", href: "https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/ready/considerations/fundamental-concepts", claim: "management group·subscription·resource group·resource의 hierarchy를 확인했습니다.", checkedAt },
    { label: "Azure resource IDs", href: "https://learn.microsoft.com/en-us/azure/azure-resource-manager/management/resource-name-rules", claim: "resource ID와 이름·type·scope를 구분하는 기준을 확인했습니다.", checkedAt },
    ...azureIdentitySources,
  ],
});

export const azureAz104Depth = lab({
  title: "AZ-104 운영 문제를 identity·DNS·route·health 순서로 푸는 원장",
  question: "private endpoint 연결 실패에서 NSG를 무작정 열지 않고 첫 실패 층을 찾을 수 있습니까?",
  rows: [
    ["identity", "operator와 workload principal", "account·role assignment", "권한 문제 제거"],
    ["DNS", "FQDN이 private IP로 해석되는가", "private zone·VNet link·nslookup", "resolver 경로 수정"],
    ["route/filter", "effective route·NSG가 흐름을 허용하는가", "Network Watcher 결과", "정확한 rule 수정"],
    ["service", "connection state와 resource public access", "private endpoint state·service log", "provider 승인·service 설정"],
  ],
  conclusion: "관리자 실무의 핵심은 resource를 만드는 속도보다 실패한 요청을 identity에서 service까지 증거로 좁히는 능력입니다.",
  eyebrow: "실습 · private endpoint",
  evidenceTitle: "private IP 해석과 effective route를 먼저 확인합니다",
  evidenceQuestion: "403과 timeout을 같은 network 문제로 취급하지 않을 수 있습니까?",
  body: "VM 안의 DNS 결과와 control plane의 private endpoint 상태를 함께 봅니다. public IP가 나오면 route나 NSG보다 DNS를 먼저 고칩니다.",
  command: [
    "az network private-endpoint show -g <rg> -n <pe> --query '{state:privateLinkServiceConnections[].privateLinkServiceConnectionState.status,nics:networkInterfaces[].id}' -o json",
    "az network private-dns link vnet list -g <dns-rg> -z <zone> -o table",
    "az network nic show-effective-route-table -g <rg> -n <nic> -o table",
    "nslookup <service-fqdn>",
  ].join("\n"),
  normal: 'state=Approved\n<service-fqdn> -> 10.20.1.7\nroute 10.20.1.0/24 VirtualNetwork',
  normalReading: "DNS와 route가 맞으면 TCP probe와 service authentication으로 넘어갑니다.",
  failure: 'state=Approved\n<service-fqdn> -> 52.1.2.3',
  failureReading: "private DNS zone 이름·A record·VNet link·custom resolver forwarding을 확인합니다. NSG 변경은 아직 근거가 없습니다.",
  sources: [
    { label: "Microsoft Learn · AZ-104 study guide", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/az-104", claim: "identity·storage·compute·virtual networking·monitoring의 2026-04-17 평가 범위를 확인했습니다.", checkedAt },
    ...azureIdentitySources,
    ...azureNetworkSources,
    { label: "Azure Network Watcher", href: "https://learn.microsoft.com/en-us/azure/network-watcher/network-watcher-monitoring-overview", claim: "connection troubleshoot·IP flow verify·next hop 등 network diagnostic 도구의 범위를 확인했습니다.", checkedAt },
  ],
});

export const azureArchitectDevopsDepth = lab({
  title: "Azure 설계 결정을 Bicep 변경과 운영 신호로 닫는 원장",
  question: "architecture diagram의 한 상자를 재현 가능한 배포·관측·복구 단위로 바꿀 수 있습니까?",
  rows: [
    ["decision", "요구·대안·trade-off", "ADR", "선택 이유 보존"],
    ["deployment", "Bicep module·parameter·identity", "what-if·deployment operation", "변경 blast radius 통제"],
    ["observation", "availability·latency·error·dependency", "metric·log·trace·alert", "사용자 영향 판정"],
    ["recovery", "zone/region failure와 data restore", "failover·restore drill", "RTO·RPO 검증"],
  ],
  conclusion: "설계자는 diagram을 그리고 끝내지 않고, DevOps는 pipeline을 만들고 끝내지 않습니다. 같은 결정 ID가 코드·관측·복구 증거에 이어져야 합니다.",
  eyebrow: "실습 · what-if에서 operation까지",
  evidenceTitle: "예상 변경과 실제 deployment operation을 대조합니다",
  evidenceQuestion: "Bicep 배포 성공 뒤 어떤 resource가 실제로 바뀌었는지 추적할 수 있습니까?",
  body: "what-if의 한계와 noise를 인정하고 실제 deployment operation을 함께 보관합니다. service health는 Application Insights나 synthetic test로 별도 확인합니다.",
  command: [
    "az deployment group what-if -g <rg> -f main.bicep --no-pretty-print",
    "az deployment group create -g <rg> -f main.bicep -n <deployment-id>",
    "az deployment operation group list -g <rg> -n <deployment-id> -o table",
    "az monitor metrics list --resource <resource-id> --metric 'Http5xx' --interval PT1M",
  ].join("\n"),
  normal: 'what-if: Modify=1 Delete=0\ndeployment: Succeeded\nHttp5xx=0',
  normalReading: "변경 수와 operation, service signal이 예상과 일치하면 release evidence로 닫습니다.",
  failure: 'what-if: Delete=2\ndeployment: not started',
  failureReading: "의도하지 않은 delete는 승인 전에 멈춥니다. scope·condition·existing resource reference를 고친 뒤 what-if를 다시 만듭니다.",
  sources: [
    { label: "Azure Architecture Center", href: "https://learn.microsoft.com/en-us/azure/architecture/", claim: "architecture style·technology choice·reference architecture를 요구와 trade-off에 연결하는 공식 지침을 확인했습니다.", checkedAt },
    { label: "Azure DevOps documentation", href: "https://learn.microsoft.com/en-us/azure/devops/", claim: "repository·pipeline·artifact·deployment 운영 범위를 확인했습니다.", checkedAt },
    { label: "Azure Well-Architected Framework", href: "https://learn.microsoft.com/en-us/azure/well-architected/", claim: "reliability·security·cost·operations·performance의 trade-off 검토 체계를 확인했습니다.", checkedAt },
    { label: "Azure Engineering · Safe deployment practices", href: "https://azure.microsoft.com/en-us/blog/advancing-safe-deployment-practices/", claim: "단계적 rollout, health signal과 자동 중단을 architecture decision에서 release evidence까지 잇는 운영 맥락으로 참고했습니다.", checkedAt },
    ...reliabilitySources,
  ],
});

export const azureAi200Depth = lab({
  title: "AI 요청 한 건을 endpoint·dependency·quality·cost로 추적하는 원장",
  question: "HTTP 200인 모델 응답이 사용자에게도 좋은 결과였는지 어떻게 증명합니까?",
  rows: [
    ["request", "deployment·model version·input class", "trace ID·deployment name", "재현 가능한 요청 확보"],
    ["operation", "latency·token·retry·tool call", "OpenTelemetry spans", "병목·오류 위치 추적"],
    ["quality", "groundedness·relevance·safety·task success", "evaluation dataset·score", "release gate 판정"],
    ["cost", "token·call·evaluation 사용량", "usage metric·cost dimension", "quality 대비 비용 비교"],
  ],
  conclusion: "AI service의 정상은 status code 하나가 아니라 같은 trace ID에서 실행 성공·품질·안전·비용 기준을 함께 통과한 상태입니다.",
  eyebrow: "실습 · trace에서 평가로",
  evidenceTitle: "실패한 응답의 trace ID를 KQL로 좁혀 dependency와 quality를 잇습니다",
  evidenceQuestion: "느린 모델인지, 느린 검색인지, 잘못된 tool 호출인지 구분할 수 있습니까?",
  body: "trace에는 secret이나 원문 민감 정보를 넣지 않습니다. request·dependency span과 evaluation run ID를 연결해 같은 사례를 재평가할 수 있게 합니다.",
  language: "kusto",
  command: [
    "let target = '<operation-id>';",
    "union AppRequests, AppDependencies, AppTraces",
    "| where OperationId == target",
    "| project TimeGenerated, ItemType, Name, DurationMs, Success, ResultCode, Properties",
    "| order by TimeGenerated asc",
  ].join("\n"),
  normal: 'request 820ms success=true\nsearch 120ms success=true\nmodel 640ms success=true\nevaluation groundedness=4.7 task_completion=1',
  normalReading: "운영 시간과 평가 점수를 같은 operation/evaluation ID로 보존합니다. threshold는 업무별로 사전에 정합니다.",
  failure: 'request 8100ms success=true\nsearch 7450ms success=true\nevaluation groundedness=1.8 task_completion=0',
  failureReading: "HTTP 성공이므로 가용성 경보만으로는 잡히지 않습니다. dependency latency와 품질 gate를 각각 고친 뒤 동일 dataset으로 재평가합니다.",
  sources: [
    { label: "Microsoft Learn · AI-200 study guide", href: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200", claim: "Azure AI solution의 back-end 구현·integration·security·monitoring 평가 범위를 확인했습니다.", checkedAt },
    { label: "Microsoft Foundry · GenAI observability", href: "https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/evaluation-approach-gen-ai", claim: "evaluation·monitoring·distributed tracing을 AI application lifecycle에서 결합하는 기준을 확인했습니다.", checkedAt },
    { label: "Application Insights OpenTelemetry", href: "https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview", claim: "request·dependency·trace와 application map·failure·performance view의 범위를 확인했습니다.", checkedAt },
    { label: "Microsoft Foundry · Trace evaluation", href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/cloud-evaluation-deployed-interactions", claim: "Application Insights의 operation ID를 이용한 deployed interaction 평가 흐름을 확인했습니다.", checkedAt },
    { label: "Microsoft Foundry · Evaluation permissions", href: "https://learn.microsoft.com/en-us/azure/foundry/observability/how-to/evaluation-permissions", claim: "project identity와 Application Insights data reader role의 최소 권한 경계를 확인했습니다.", checkedAt },
  ],
});
