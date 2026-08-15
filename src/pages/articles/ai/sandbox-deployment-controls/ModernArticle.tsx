import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { DeploymentControlsViz } from "../sandbox-security-viz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";

export default function SandboxDeploymentControlsArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="runtime 밖의 통제"
          title="안전한 runtime을 골라도 Pod에 token·열린 egress·영구 workspace가 남으면 공격 경로는 계속 열린다"
        >
          배포 통제를 identity, network, storage, lifecycle 네 층으로 나눕니다.
          각 용어를 따로 정의한 뒤 마지막에 workload control matrix로 합칩니다.
        </LessonHeader>
        <DeploymentControlsViz />
      </section>

      <section id="service-account-token" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="누구인지 증명하는 재료"
          title="ServiceAccount와 projected token은 workload identity의 이름과 증명서를 나눈다"
        >
          ServiceAccount를 먼저 정의하고, Pod 안에 실제로 들어오는 token을 다음
          개념으로 분리합니다.
        </LessonHeader>
        <TermLesson
          name="Kubernetes ServiceAccount"
          oneLine="Kubernetes workload가 API server와 다른 service에서 자신을 식별할 때 사용하는 namespaced identity입니다."
          shape="namespace/service-account name → workload identity"
          example="ai-workloads namespace의 agent-reader ServiceAccount를 특정 worker Pod에 지정합니다."
          boundary="ServiceAccount 이름이 있다는 사실만으로 API permission이 생기지 않습니다."
        />
        <TermLesson
          name="ServiceAccount token projection"
          oneLine="ServiceAccount identity를 증명하는 audience·expiry가 있는 token을 Pod filesystem에 주입하고 갱신하는 delivery mechanism입니다."
          shape="ServiceAccount → bounded token {audience, expiry} → Pod mount"
          example="Kubernetes API가 필요 없는 agent는 automountServiceAccountToken:false로 기본 주입을 끕니다. 필요한 worker만 짧은 lifetime·명시적 audience token을 받습니다."
          boundary="자동 mount를 꺼도 environment·Secret volume·tool credential까지 사라지는 것은 아닙니다."
        />
        <div id="paper-service-account" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.serviceAccounts.label}
            citeKey={1}
            href={AGENT_SECURITY_SOURCES.serviceAccounts.href}
          >
            <EvidenceGrid
              problem="Pod workload에 Kubernetes identity와 bounded token을 제공하는 문제"
              contribution="ServiceAccount·token projection·automount semantics를 정의"
              assumptions="Cluster version·audience·expiry·token projection configuration"
              scope="Workload identity 이름과 token delivery behavior"
              notClaim="Token을 끄면 다른 credential과 RBAC permission·network path도 사라진다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="rbac" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="증명서가 할 수 있는 일"
          title="RBAC은 인증된 identity가 어떤 verb를 어떤 resource에 실행할지 제한한다"
        >
          Token은 “누구인가”를 증명합니다. Role과 Binding은 그 identity가
          “무엇을 할 수 있는가”를 결정합니다.
        </LessonHeader>
        <TermLesson
          name="Kubernetes RBAC authorization scope"
          oneLine="인증된 subject에 허용할 API verb·resource·namespace를 Role/ClusterRole과 Binding으로 연결한 authorization 범위입니다."
          shape="subject → binding → {verb, resource, namespace} rules"
          example="agent-reader는 ai-workloads namespace의 jobs를 get/list만 할 수 있고 secret read와 deployment write는 받지 않습니다."
          boundary="최소 RBAC도 external API·filesystem·host kernel 접근을 제한하지 않습니다."
        />
        <TermLesson
          name="Workload identity · RBAC boundary"
          oneLine="Token 주입 여부와 API authorization을 독립 설정으로 관리해 identity material과 permission을 함께 최소화하는 경계입니다."
          shape="token present? + RBAC rule matches? → API request allowed"
          example="Token을 가진 worker라도 create deployments rule이 없으면 해당 API request는 거절됩니다."
          boundary="Token 없음과 permission 없음은 다른 상태이며 둘 다 audit해야 합니다."
        />
        <ExplainedFormula
          question="왜 API 허용 판정에서 token과 verb·resource·namespace를 모두 확인할까요?"
          idea="Token이 유효하다는 것은 identity 인증만 끝났다는 뜻입니다. 요청의 동작과 대상이 그 identity의 rule 안에 들어와야 authorization이 완성됩니다."
          formula={String.raw`\operatorname{allow}(q)=T(q)\land V(q)\land R(q)\land N(q)`}
          annotatedFormula={String.raw`\begin{aligned}G_a&=\underbrace{T(q)}_{\text{identity 인증}}\\G_v&=\underbrace{V(q)\land R(q)}_{\text{동작·대상 허용}}\\G_n&=\underbrace{N(q)}_{\text{namespace 허용}}\\\operatorname{allow}(q)&=\underbrace{G_a\land G_v\land G_n}_{\text{모든 gate 통과}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`T(q)`,
              annotation: [
                "token의 서명·audience·expiry를 검사해",
                "요청 identity를 인증",
              ],
            },
            {
              expression: String.raw`V(q)\land R(q)`,
              annotation: [
                "verb와 resource를 함께 맞춰",
                "다른 API 동작으로의 권한 확대 차단",
              ],
            },
            {
              expression: String.raw`G_a\land G_v\land G_n`,
              annotation: [
                "인증·동작·scope gate를 AND로 묶어",
                "하나라도 다르면 요청 거절",
              ],
            },
          ]}
          terms={[
            {
              symbol: "q",
              name: "API request",
              description: "Subject·verb·resource·namespace를 가진 요청입니다.",
            },
            {
              symbol: "T",
              name: "Token gate",
              description: "Token이 유효하고 올바른 audience이면 1입니다.",
            },
            {
              symbol: "V",
              name: "Verb gate",
              description: "get·list·create 같은 요청 동작이 허용되면 1입니다.",
            },
            {
              symbol: "R",
              name: "Resource gate",
              description: "jobs·pods 같은 대상 resource가 허용되면 1입니다.",
            },
            {
              symbol: "N",
              name: "Namespace gate",
              description: "요청 namespace가 rule 범위 안이면 1입니다.",
            },
          ]}
          assumptions={[
            "Admission·webhook·application authorization처럼 RBAC 뒤의 gate도 따로 존재할 수 있습니다.",
            "Rule inventory는 실제 ServiceAccount binding과 cluster version에서 읽습니다.",
          ]}
          interpretation="유효한 token으로 jobs.get은 허용되어도 secrets.get은 R=0이라 거절됩니다. create jobs도 V=0이면 같은 identity라도 거절됩니다."
        />
      </section>

      <section id="egress" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="밖으로 나가는 경로"
          title="Egress allowlist는 YAML의 존재가 아니라 실제 destination 차단 결과다"
        >
          Default-deny에서 시작해 DNS와 필요한 API를 한 경로씩 열고, 금지
          목적지가 실제로 막히는지 flow log로 확인합니다.
        </LessonHeader>
        <TermLesson
          name="Egress allowlist enforcement"
          oneLine="Workload의 destination·port·domain·protocol을 default-deny에서 필요한 항목만 허용하고 실제 CNI·DNS proxy·gateway 결과로 검증하는 경계입니다."
          shape="Pod → default-deny → DNS observation → exact FQDN:port → gateway"
          example="Cluster DNS와 api.example.com:443만 열고 metadata IP·private service·other.example.com 연결이 차단되는지 시험합니다."
          boundary="NetworkPolicy는 CNI 집행이 필요하며 표준만으로 FQDN·explicit deny·hostNetwork·DNS tunneling을 모두 해결하지 않습니다."
        />
        <div id="paper-network-policy" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.networkPolicy.label}
            citeKey={2}
            href={AGENT_SECURITY_SOURCES.networkPolicy.href}
          >
            <EvidenceGrid
              problem="Pod traffic을 direction·peer·port에 따라 격리하는 문제"
              contribution="Ingress/egress isolation과 additive allow semantics를 정의"
              assumptions="Cluster CNI가 NetworkPolicy를 지원·집행"
              scope="표준 L3/L4 policy object와 connection allow behavior"
              notClaim="YAML만으로 FQDN·explicit deny·hostNetwork·flow log가 보장된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-cilium-fqdn" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.ciliumDns.label}
            citeKey={3}
            href={AGENT_SECURITY_SOURCES.ciliumDns.href}
            type="code"
          >
            <EvidenceGrid
              problem="IP가 바뀌는 domain을 egress identity와 연결하는 문제"
              contribution="DNS proxy observation과 toFQDNs mapping을 제공"
              assumptions="Cilium DNS proxy·cluster DNS path·지원 protocol/version"
              scope="DNS 응답을 destination policy에 연결하는 Cilium semantics"
              notClaim="Wildcard DNS query가 tunneling을 막거나 TLS 내용·API authorization을 검증한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="writable-surface" className="space-y-6">
        <LessonHeader
          number="04"
          eyebrow="남길 수 있는 흔적"
          title="Read-only root 뒤에도 writable path의 크기·owner·수명 계약이 필요하다"
        >
          “쓰기 금지” 한 줄로 끝내지 않습니다. 꼭 필요한 workspace를 이름
          붙이고, session이 끝날 때 무엇을 지울지 정합니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox writable surface · lifetime"
          oneLine="쓰기 가능한 path마다 mount type·size·owner·session lifetime·폐기 시점을 제한해 persistence와 cross-session residue를 줄이는 storage 계약입니다."
          shape="read-only root + {/tmp, /workspace} bounded mounts → destroy receipt"
          example="root filesystem은 read-only로 두고 /tmp와 /workspace만 sizeLimit이 있는 emptyDir로 열어 Pod 종료 때 폐기합니다."
          boundary="Read-only root는 memory execution·external storage·interpreter pipe를 막지 않고 emptyDir도 node pressure를 만들 수 있습니다."
        />
        <div id="paper-pod-security" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.podSecurity.label}
            citeKey={4}
            href={AGENT_SECURITY_SOURCES.podSecurity.href}
          >
            <EvidenceGrid
              problem="Privileged namespace·capability·user·seccomp Pod 설정을 일관되게 제한하는 문제"
              contribution="Baseline·Restricted Pod Security profile 요구를 정의"
              assumptions="Cluster version·Pod Security admission·runtime support"
              scope="Pod spec의 host access·privilege·user·seccomp 기본 경계"
              notClaim="Guest kernel·egress·RBAC·image provenance·session cleanup을 대신한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="control-matrix" className="space-y-6">
        <LessonHeader
          number="05"
          eyebrow="마지막 조합"
          title="Workload가 필요한 capability를 먼저 적고 독립 control을 열별로 승인한다"
        >
          이제 배운 identity·network·storage를 runtime·lifecycle과 합칩니다.
          제품 목록이 아니라 실제 workload identity에 귀속된 test contract를
          만듭니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox workload · control matrix"
          oneLine="Code trust와 필요한 credential·network·filesystem·GPU·session lifetime을 행에 적고 각 위험을 끊는 통제와 negative test를 열로 승인하는 방법입니다."
          shape="workload row × {identity, egress, runtime, storage, lifecycle} columns"
          example="사용자 생성 code는 no default token, proxy-only egress, gVisor/Kata, 5 GiB workspace, 20-minute destroy receipt를 한 row로 가집니다."
          boundary="Control object가 존재한다는 사실이나 benchmark 하나만으로 production safety를 선언하지 않습니다."
        />
        <ConceptLadderViz
          title="Kubernetes sandbox 배포 계약"
          description="Identity material과 권한을 나눈 뒤 egress·storage를 더하고 마지막에 release matrix로 결합합니다."
          steps={[
            { label: "ServiceAccount", detail: "Workload identity 이름" },
            { label: "Token", detail: "Audience·expiry가 있는 증명서" },
            { label: "RBAC", detail: "Verb·resource·namespace 권한" },
            { label: "Egress", detail: "Destination allowlist와 차단 결과" },
            { label: "Storage", detail: "Writable path·size·lifetime" },
            { label: "Matrix", detail: "독립 gate receipt를 함께 승인" },
          ]}
        />
        <ContentBoundary article="sandbox-deployment-controls" />
      </section>
    </article>
  );
}
