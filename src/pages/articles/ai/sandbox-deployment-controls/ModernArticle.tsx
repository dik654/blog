import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import {
  SandboxBoundaryLocator,
  SandboxBoundaryMapReturn,
} from "../shared/SandboxBoundaryLocator";
import SandboxDeploymentControlsViz from "./viz/SandboxDeploymentControlsViz";

const podPolicyYaml = `# 이 Pod가 사용할 Kubernetes 신원입니다.
serviceAccountName: agent-reader
# 필요 없는 기본 API 토큰 주입은 끕니다.
automountServiceAccountToken: false

containers:
- name: generator
  # 루트 파일시스템 쓰기를 막습니다.
  securityContext:
    readOnlyRootFilesystem: true
    allowPrivilegeEscalation: false
  volumeMounts:
  # 쓰기가 필요한 경로만 따로 엽니다.
  - name: work
    mountPath: /work
  # 이 작업에 필요한 짧은 API 토큰만 읽기 전용으로 넣습니다.
  - name: api-token
    mountPath: /var/run/secrets/tokens
    readOnly: true

volumes:
# Pod 수명에 묶인 임시 작업 공간입니다.
- name: work
  emptyDir:
    sizeLimit: 5Gi
# audience와 만료 시간을 고정한 토큰입니다.
# 실제 값은 API server가 허용한 audience와 맞춰야 합니다.
- name: api-token
  projected:
    sources:
    - serviceAccountToken:
        audience: https://kubernetes.default.svc
        expirationSeconds: 3600
        path: token`;

const roleYaml = `apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: own-job-reader
  namespace: ai
rules:
# batch API의 Job만 대상으로 합니다.
- apiGroups: ["batch"]
  resources: ["jobs"]
  # 조회만 허용하고 생성·수정·삭제는 주지 않습니다.
  verbs: ["get"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: bind-own-job-reader
  namespace: ai
subjects:
# ai namespace의 agent-reader에만 연결합니다.
- kind: ServiceAccount
  name: agent-reader
  namespace: ai
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: own-job-reader`;

export default function SandboxDeploymentControlsArticle() {
  return (
    <article id="overview" className="space-y-16">
      <SandboxBoundaryLocator current="deploy" />

      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="남은 효과 제한"
          title="런타임 밖의 권한과 흔적을 따로 닫습니다"
        >
          GPU를 격리한 이미지 생성 Pod 하나가 API를 읽고 결과를 전송하고 임시
          파일을 남긴 뒤 삭제되는 과정을 따라갑니다.
        </LessonHeader>
        <SandboxDeploymentControlsViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <code>img-job-91</code>은 샌드박스 안에서 실행돼도 외부에 효과를 남길
            수 있습니다. Kubernetes API를 읽는 자격증명, 결과를 내보낼 네트워크,
            파일을 쓸 공간이 있기 때문입니다.
          </p>
          <p>
            이 세 효과의 판단자는 서로 다릅니다. API server는 토큰과 RBAC을,
            CNI나 egress gateway는 목적지 연결을, kubelet과 컨테이너 런타임은
            mount와 Pod 수명을 다룹니다. 한 정책을 켠 것으로 나머지 효과까지
            막혔다고 볼 수 없습니다.
          </p>
          <p>
            특히 컨테이너 종료와 Pod 삭제는 같은 사건이 아닙니다. <code>emptyDir</code>은
            컨테이너가 재시작돼도 같은 Pod가 남아 있으면 유지되고, Pod가 제거될 때
            함께 정리됩니다. 외부 object storage에 올린 결과는 또 다른 보존 정책을
            따릅니다.
          </p>
        </div>
        <ContentBoundary article="sandbox-deployment-controls" />
        <TermLesson
          name="배포 효과 경계"
          oneLine="워크로드가 남길 수 있는 API 변경·외부 통신·파일 흔적을 각각의 집행 주체와 수명에 연결한 계약입니다."
          shape="Pod 요청 → API·network·storage gate → 허용된 효과 → 종료·삭제"
          example="img-job-91은 자기 Job 조회와 object gateway 업로드, /work 쓰기만 허용받습니다."
          boundary="안전한 런타임이나 유효한 토큰 하나가 다른 효과의 허용 여부를 대신 결정하지 않습니다."
        />
      </section>

      <section id="service-account-token" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="신원과 API 권한"
          title="토큰을 확인한 뒤 요청 동작을 다시 검사합니다"
        >
          같은 토큰으로 자기 Job 조회는 통과하고 Secret 조회는 거절되는 경로를
          분리합니다.
        </LessonHeader>
        <TermLesson
          name="ServiceAccount projected token"
          oneLine="Pod의 ServiceAccount 신원을 audience·만료 시간·대상 객체에 묶어 파일로 전달하고 kubelet이 갱신하는 토큰입니다."
          shape="ServiceAccount → TokenRequest → projected volume → Bearer token"
          example="agent-reader Pod는 kube-apiserver용 1시간 토큰을 별도 경로에 읽기 전용으로 마운트합니다."
          boundary="토큰이 유효하다는 사실은 인증만 끝났다는 뜻이며 API 권한을 자동으로 만들지 않습니다."
        />
        <div id="rbac" className="scroll-mt-24" />
        <TermLesson
          name="RBAC 요청 범위"
          oneLine="인증된 주체가 어느 API group의 어떤 resource에 어떤 verb를 어느 namespace에서 실행할지 정하는 허용 규칙입니다."
          shape="subject → RoleBinding → {apiGroup, resource, verb, namespace}"
          example="agent-reader는 ai namespace의 jobs.get만 받고 secrets.get과 jobs.create는 받지 않습니다."
          boundary="RBAC 규칙은 더하는 방식이며 파일·외부 API·호스트 접근을 제한하지 않습니다."
        />
        <ExplainedFormula
          question="왜 유효한 토큰만으로 API 요청을 허용할 수 없을까요?"
          idea="토큰은 요청 주체를 인증합니다. 그다음 API group·resource·verb·namespace가 주체의 RBAC 규칙과 모두 맞아야 요청이 허용됩니다."
          formula={String.raw`\operatorname{allow}(q)=T(q)\land G(q)\land R(q)\land V(q)\land N(q)`}
          annotatedFormula={String.raw`\begin{aligned}G_a&=\underbrace{T(q)}_{\text{토큰 인증}}\\G_o&=\underbrace{G(q)\land R(q)\land V(q)}_{\text{API 대상과 동작 일치}}\\\operatorname{allow}(q)&=\underbrace{G_a\land G_o\land N(q)}_{\text{namespace까지 모두 일치}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`T(q)`,
              annotation: ["서명·audience·만료·대상 객체를 확인해", "ServiceAccount 주체를 인증"],
            },
            {
              expression: String.raw`G(q)\land R(q)\land V(q)`,
              annotation: ["API group·resource·verb를 함께 맞춰", "다른 대상이나 동작으로의 확대를 거절"],
            },
            {
              expression: String.raw`G_a\land G_o\land N(q)`,
              annotation: ["인증·동작·namespace 조건을 AND로 묶어", "하나라도 다르면 403으로 종료"],
            },
          ]}
          terms={[
            { symbol: "q", name: "API 요청", description: "주체·API group·resource·verb·namespace를 가진 요청입니다." },
            { symbol: "T", name: "토큰 조건", description: "토큰 검증을 통과하면 1입니다." },
            { symbol: "G", name: "API group 조건", description: "batch 같은 API group이 허용되면 1입니다." },
            { symbol: "R", name: "resource 조건", description: "jobs 같은 대상 종류가 허용되면 1입니다." },
            { symbol: "V", name: "verb 조건", description: "get 같은 동작이 허용되면 1입니다." },
            { symbol: "N", name: "namespace 조건", description: "요청 namespace가 규칙 범위 안이면 1입니다." },
          ]}
          assumptions={[
            "식은 namespaced resource 한 건을 설명하기 위한 축약이며 subresource·resourceName·non-resource URL은 별도 조건입니다.",
            "Admission webhook과 애플리케이션 권한 검사는 RBAC 뒤에 추가될 수 있습니다.",
          ]}
          interpretation="같은 agent-reader 토큰으로 ai namespace의 jobs.get은 허용됩니다. 그러나 secrets.get은 resource와 verb 조합이 규칙에 없으므로 인증에 성공해도 403입니다."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{podPolicyYaml}</code></pre>
          <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{roleYaml}</code></pre>
        </div>
        <div id="paper-service-account" className="scroll-mt-24">
          <CitationBlock source="Kubernetes v1.37 문서 — Service Accounts" citeKey={1} href="https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/concepts/security/service-accounts.md">
            <EvidenceGrid
              problem="Pod에 Kubernetes 신원과 짧은 수명의 자격증명을 전달하는 문제"
              contribution="ServiceAccount·TokenRequest·projected token·automount 의미를 정의"
              assumptions="Kubernetes v1.37 문서와 API server의 issuer·audience 설정"
              scope="워크로드 신원 이름과 토큰 발급·주입·갱신"
              notClaim="토큰 주입을 끄면 다른 Secret·외부 자격증명·네트워크 경로도 사라진다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-rbac" className="scroll-mt-24">
          <CitationBlock source="Kubernetes v1.37 문서 — RBAC Authorization" citeKey={2} href="https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/reference/access-authn-authz/rbac.md">
            <EvidenceGrid
              problem="인증된 주체가 Kubernetes API에서 실행할 수 있는 동작을 제한하는 문제"
              contribution="Role·ClusterRole·RoleBinding·ClusterRoleBinding과 additive permission 의미를 정의"
              assumptions="API server에서 RBAC authorizer가 활성화된 Kubernetes v1.37"
              scope="API group·resource·verb·namespace와 주체 binding"
              notClaim="RBAC이 네트워크·파일시스템·애플리케이션 내부 권한까지 집행한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="egress" className="space-y-6">
        <LessonHeader number="02" eyebrow="목적지 연결" title="외부 전송은 네트워크 경계가 따로 결정합니다">
          object gateway 업로드는 허용하고 metadata IP는 차단하되, 표준 정책과
          FQDN 확장의 범위를 구분합니다.
        </LessonHeader>
        <TermLesson
          name="Egress 허용 경로"
          oneLine="선택된 Pod의 바깥 연결을 기본 차단한 뒤 필요한 peer·IP·port만 더하는 네트워크 집행 경로입니다."
          shape="Pod → egress-isolated → 허용 규칙 합집합 → destination"
          example="img-job-91은 cluster DNS와 object gateway 10.40.8.20:443만 연결하고 metadata IP는 연결하지 못합니다."
          boundary="표준 NetworkPolicy는 L3/L4 규칙이며 도메인 이름·TLS 내용·외부 API 권한을 직접 판정하지 않습니다."
        />
        <div id="paper-network-policy" className="scroll-mt-24">
          <CitationBlock source="Kubernetes v1.37 문서 — Network Policies" citeKey={3} href="https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/concepts/services-networking/network-policies.md">
            <EvidenceGrid
              problem="선택된 Pod의 ingress·egress 연결을 peer와 port 단위로 제한하는 문제"
              contribution="격리 조건, additive allow, source와 destination 양쪽 정책의 교집합 의미를 정의"
              assumptions="선택한 CNI가 Kubernetes NetworkPolicy를 실제로 집행"
              scope="표준 L3/L4 Pod·namespace·IPBlock·port 규칙"
              notClaim="YAML 객체만 만들면 집행되거나 FQDN·명시적 deny·hostNetwork까지 해결된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-cilium-fqdn" className="scroll-mt-24">
          <CitationBlock source="Cilium v1.20.4 — DNS and FQDN policies" citeKey={4} href="https://github.com/cilium/cilium/blob/v1.20.4/Documentation/security/dns.rst" type="code">
            <EvidenceGrid
              problem="주소가 바뀌는 도메인 이름을 Pod의 egress 허용 대상으로 연결하는 문제"
              contribution="DNS proxy 관찰과 toFQDNs 기반 Cilium 확장 경로"
              assumptions="Cilium v1.20.4의 DNS proxy·정책 집행·cluster DNS 경로"
              scope="Cilium 확장의 DNS 응답과 destination IP 연결"
              notClaim="표준 NetworkPolicy의 기능이거나 DNS tunneling·TLS 내용·API 권한을 함께 검사한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="writable-surface" className="space-y-6">
        <LessonHeader number="03" eyebrow="쓰기 공간과 수명" title="컨테이너 종료와 Pod 삭제를 구분합니다">
          루트 파일시스템은 읽기 전용으로 두고 필요한 임시 경로만 열며, 데이터가
          실제로 없어지는 사건을 Pod 삭제에 연결합니다.
        </LessonHeader>
        <TermLesson
          name="제한된 쓰기 표면"
          oneLine="루트 파일시스템은 읽기 전용으로 두고 이름·크기·소유자·수명이 정해진 mount만 쓰기 가능하게 여는 저장 경계입니다."
          shape="read-only root + /work emptyDir 5 GiB → Pod lifetime"
          example="생성 중간 파일은 /work에만 쓰고 애플리케이션·설정 경로 수정은 거절합니다."
          boundary="readOnlyRootFilesystem은 메모리 실행·외부 저장소·이미 열린 volume·노드 디스크 압력을 막지 않습니다."
        />
        <TermLesson
          name="Pod 수명에 묶인 emptyDir"
          oneLine="Pod가 노드에 배치될 때 생기고 그 Pod가 제거될 때 함께 삭제되며, 같은 Pod 안의 컨테이너 재시작을 지나서도 남는 volume입니다."
          shape="Pod 생성 → container 실행·재시작 → Pod 삭제 → emptyDir 정리"
          example="generator 컨테이너가 exit 0이어도 완료된 Pod가 남아 있으면 /work는 남고, TTL이나 운영자가 Pod를 삭제해야 정리됩니다."
          boundary="Job 완료만으로 즉시 삭제된다고 가정할 수 없고 object storage·PVC 데이터는 emptyDir 수명과 다릅니다."
        />
        <div id="paper-emptydir" className="scroll-mt-24">
          <CitationBlock source="Kubernetes v1.37 문서 — Volumes / emptyDir" citeKey={5} href="https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/concepts/storage/volumes.md">
            <EvidenceGrid
              problem="같은 Pod 안의 컨테이너가 공유할 임시 저장 공간과 그 수명을 정하는 문제"
              contribution="emptyDir 생성·컨테이너 재시작 보존·Pod 제거 시 삭제·sizeLimit 의미를 정의"
              assumptions="Kubernetes v1.37과 실제 노드의 disk·memory backing 및 ephemeral-storage accounting"
              scope="Pod 수명에 묶인 임시 volume"
              notClaim="Job 완료 즉시 삭제, 보안 삭제, 백업, 외부 결과 보존까지 보장한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-pod-security" className="scroll-mt-24">
          <CitationBlock source="Kubernetes v1.37 문서 — Security Context" citeKey={6} href="https://github.com/kubernetes/website/blob/snapshot-initial-v1.37/content/en/docs/tasks/configure-pod-container/security-context.md">
            <EvidenceGrid
              problem="컨테이너 프로세스의 사용자·권한 상승·루트 파일시스템 쓰기 성질을 제한하는 문제"
              contribution="Pod·container securityContext와 readOnlyRootFilesystem 등 필드의 실행 의미"
              assumptions="Kubernetes v1.37과 선택한 컨테이너 런타임·Linux 노드"
              scope="프로세스 보안 속성과 루트 파일시스템 쓰기 여부"
              notClaim="volume·network·ServiceAccount·runtime isolation까지 한 필드로 설정한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="control-matrix" className="space-y-6">
        <LessonHeader number="04" eyebrow="상태 소유권" title="각 효과의 판단자와 종료 조건을 한 줄씩 남깁니다">
          제품 목록보다 먼저 누가 허용하고, 무엇을 관측하며, 언제 흔적이 사라지는지
          연결합니다.
        </LessonHeader>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ["Kubernetes API", "API server · RBAC authorizer", "요청별 200 또는 403", "token 만료·Pod 삭제"],
            ["외부 통신", "CNI · egress gateway", "flow allow 또는 drop", "정책·endpoint 변경"],
            ["임시 파일", "kubelet · container runtime", "mount와 사용량", "Pod 삭제"],
            ["외부 결과", "object gateway · storage policy", "object write와 보존 상태", "만료·사용자 삭제"],
          ].map(([effect, owner, evidence, end]) => (
            <div key={effect} className="grid gap-2 py-4 text-sm sm:grid-cols-[7rem_1fr_1fr_1fr] sm:items-start">
              <strong className="break-keep">{effect}</strong>
              <span><b className="mr-1 text-[10px] text-primary sm:hidden">판단자</b>{owner}</span>
              <span className="text-muted-foreground"><b className="mr-1 text-[10px] text-primary sm:hidden">근거</b>{evidence}</span>
              <span className="text-muted-foreground"><b className="mr-1 text-[10px] text-primary sm:hidden">종료</b>{end}</span>
            </div>
          ))}
        </div>
        <TermLesson
          name="워크로드 통제 행렬"
          oneLine="하나의 워크로드가 필요한 신원·API 동작·목적지·쓰기 경로와 각각의 집행 주체·관측 근거·종료 조건을 연결한 표입니다."
          shape="effect × {owner, allowed state, evidence, end condition}"
          example="img-job-91의 jobs.get·object upload·/work 쓰기를 서로 다른 세 집행자와 연결합니다."
          boundary="정책 객체가 존재한다는 사실만 기록하지 말고 실제 허용·거절·삭제 상태를 각각 확인해야 합니다."
        />
      </section>

      <SandboxBoundaryMapReturn current="deploy" />
    </article>
  );
}
