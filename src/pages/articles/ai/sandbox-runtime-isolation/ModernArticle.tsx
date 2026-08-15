import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { RuntimeIsolationViz } from "../sandbox-security-viz";

export default function SandboxRuntimeIsolationArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="경로를 먼저"
          title="Runtime 격리는 system call이 어느 경계를 지나 어느 kernel에서 처리되는지 고르는 일이다"
        >
          runc·seccomp·gVisor·Kata를 강함 순서로 외우지 않습니다. 같은
          <code>open()</code> 요청이 이동하는 경로를 한 단계씩 바꿔 봅니다.
        </LessonHeader>
        <TermLesson
          name="Linux syscall · host-kernel path"
          oneLine="Application이 file·network·process·device 기능을 요청할 때 system call을 통해 kernel service로 들어가는 기본 실행 경로입니다."
          shape="application → syscall entry → host kernel → resource"
          example="runc 안 process의 open()도 namespace view를 적용받지만 최종 처리는 host Linux kernel이 맡습니다."
          boundary="System call path를 안다고 file permission·network route·credential policy가 자동으로 정해지는 것은 아닙니다."
        />
        <RuntimeIsolationViz />
      </section>

      <section id="seccomp" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="요청을 거르는 문"
          title="Seccomp는 host kernel을 없애지 않고 들어갈 syscall을 줄인다"
        >
          Filter와 isolation을 구분합니다. Seccomp가 허용한 syscall은 여전히
          host kernel이 처리합니다.
        </LessonHeader>
        <TermLesson
          name="Syscall filter · kernel isolation boundary"
          oneLine="Seccomp처럼 host-kernel entry를 filtering하는 통제와 application/guest kernel로 처리 경로 자체를 바꾸는 격리를 구분한 경계입니다."
          shape="syscall request → allow/deny filter → shared host kernel"
          example="RuntimeDefault가 ptrace 같은 일부 호출을 막아도 허용된 read·write·network 호출은 host kernel로 들어갑니다."
          boundary="허용 syscall 수만으로 exploitability를 순위화할 수 없고 filesystem·egress·device ioctl은 별도 경계입니다."
        />
      </section>

      <section id="application-kernel" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="userspace에서 중개"
          title="Application kernel은 많은 Linux API를 userspace에서 받아 host 접촉면을 줄인다"
        >
          gVisor의 Sentry를 단순한 seccomp profile로 보지 않습니다.
          Application의 system API를 누가 구현하는지가 달라집니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox application-kernel mediation"
          oneLine="Sentry 같은 userspace application kernel이 Linux API의 상당 부분을 구현하고 제한된 host interface만 사용하게 하는 격리 형태입니다."
          shape="application → Sentry API implementation → small host interface"
          example="File open은 Sentry와 Gofer/LISAFS 경로를 거치며 application이 host filesystem syscall surface에 그대로 닿지 않습니다."
          boundary="Hardware VM과 같은 경계가 아니며 모든 syscall·filesystem·GPU workload가 호환된다는 뜻도 아닙니다."
        />
        <div id="paper-gvisor-security" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.gvisorSecurity.label}
            citeKey={1}
            href={AGENT_SECURITY_SOURCES.gvisorSecurity.href}
          >
            <EvidenceGrid
              problem="Container application이 넓은 host-kernel syscall surface에 직접 의존하는 문제"
              contribution="Sentry application kernel과 제한된 host interface의 보안 모델"
              assumptions="지원 platform·runsc configuration·host patch와 문서 범위"
              scope="gVisor가 system API를 중개해 host attack surface를 줄이는 구조"
              notClaim="Hardware VM과 같거나 모든 Linux application이 수정 없이 동작한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="guest-kernel" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="별도 kernel"
          title="Guest-kernel boundary는 workload의 syscall을 VM 안 kernel이 처리하게 한다"
        >
          Kata는 container UX를 유지하지만 실제 실행 경로에는 guest kernel과
          VMM이 추가됩니다. 그만큼 경계와 운영 비용이 함께 생깁니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox guest-kernel boundary"
          oneLine="Pod workload를 guest kernel 안에 두고 VMM·hardware virtualization을 통해 host kernel과 분리하는 실행 경계입니다."
          shape="application → guest kernel → VMM → host/hardware"
          example="Kata Pod의 open()은 guest kernel에서 처리되고 host와의 device·filesystem interaction은 virtualized path를 통과합니다."
          boundary="기동·memory·image·VMM·nested virtualization 조건이 따르며 가장 강한 경계가 항상 가장 적합한 runtime은 아닙니다."
        />
        <div id="paper-kata-virtualization" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.kataVirtualization.label}
            citeKey={2}
            href={AGENT_SECURITY_SOURCES.kataVirtualization.href}
            type="code"
          >
            <EvidenceGrid
              problem="Container workflow를 유지하면서 host와 다른 kernel boundary를 두는 문제"
              contribution="Kata agent·guest·VMM과 hypervisor capability를 문서화"
              assumptions="선택 VMM·hardware virtualization·image·cloud support"
              scope="Guest-kernel isolation architecture와 VMM별 기능 차이"
              notClaim="모든 cloud·device에서 같은 호환성·기동·memory 비용을 보장한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="runtime-spectrum" className="space-y-6">
        <LessonHeader
          number="04"
          eyebrow="조합해서 고르기"
          title="격리 경로를 이해한 뒤 compatibility·cost·운영 조건으로 runtime을 고른다"
        >
          이제서야 runc·seccomp·gVisor·Kata를 한 표에 놓습니다. 선택의 결과는
          제품 이름이 아니라 실제 workload test receipt입니다.
        </LessonHeader>
        <TermLesson
          name="Sandbox runtime isolation spectrum"
          oneLine="Runtime을 공유 kernel surface·mediation·guest boundary·호환성·기동·memory 비용의 여러 축으로 비교하는 선택 방법입니다."
          shape="workload requirements × runtime properties → acceptance tests"
          example="짧은 untrusted Python session은 gVisor를 먼저 시험하고, guest-kernel 요구가 있는 장기 service는 Kata의 startup·memory 예산까지 검증합니다."
          boundary="runc&lt;gVisor&lt;Kata라는 단일 순위는 workload compatibility·patching·VMM maturity를 설명하지 못합니다."
        />
        <ExplainedFormula
          question="왜 isolation 점수 하나가 아니라 여러 acceptance gate를 모두 통과시킬까요?"
          idea="격리가 강해도 필요한 syscall이 깨지거나 startup·memory 예산을 넘으면 그 workload에는 배포할 수 없습니다. 각 조건을 0/1 gate로 두고 모두 참일 때만 후보로 남깁니다."
          formula={String.raw`A(r,w)=I(r,w)\land C(r,w)\land S(r,w)\land M(r,w)`}
          annotatedFormula={String.raw`\begin{aligned}G_{\mathrm{security}}&=\underbrace{I(r,w)}_{\text{요구한 kernel 경계를 충족}}\\G_{\mathrm{compat}}&=\underbrace{C(r,w)}_{\text{필수 syscall·I/O가 회귀 없이 동작}}\\G_{\mathrm{cost}}&=\underbrace{S(r,w)\land M(r,w)}_{\text{startup과 memory 예산을 함께 통과}}\\A(r,w)&=\underbrace{G_{\mathrm{security}}\land G_{\mathrm{compat}}\land G_{\mathrm{cost}}}_{\text{모든 gate가 참인 runtime만 승인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`I(r,w)`,
              annotation: ["workload가 요구한", "kernel isolation 경계를 확인"],
            },
            {
              expression: String.raw`C(r,w)`,
              annotation: [
                "실제 syscall·I/O suite를 실행해",
                "호환성 회귀를 확인",
              ],
            },
            {
              expression: String.raw`S(r,w)\land M(r,w)`,
              annotation: [
                "startup과 memory를 함께 묶어",
                "한쪽 budget 우회를 방지",
              ],
            },
            {
              expression: String.raw`G_s\land G_c\land G_o`,
              annotation: [
                "독립 gate를 AND로 묶어",
                "한 조건 실패도 배포 중단",
              ],
            },
          ]}
          terms={[
            {
              symbol: "r",
              name: "Runtime candidate",
              description: "runc·gVisor·Kata처럼 시험할 runtime입니다.",
            },
            {
              symbol: "w",
              name: "Workload",
              description:
                "실제 code·I/O·session lifetime을 가진 배포 단위입니다.",
            },
            {
              symbol: "I",
              name: "Isolation gate",
              description: "요구한 host/guest kernel 경계를 충족하면 1입니다.",
            },
            {
              symbol: "C",
              name: "Compatibility gate",
              description: "필수 기능 test가 통과하면 1입니다.",
            },
            {
              symbol: "S,M",
              name: "Startup and memory gates",
              description: "기동 시간과 memory budget을 각각 통과하면 1입니다.",
            },
          ]}
          assumptions={[
            "같은 image·kernel·driver·load fixture로 후보를 비교합니다.",
            "성능뿐 아니라 escape·negative test와 upgrade regression을 포함합니다.",
          ]}
          interpretation="gVisor가 isolation 요구를 만족해도 database I/O suite가 실패하면 후보에서 빠집니다. Kata가 기능은 맞아도 session startup SLO를 넘으면 다른 workload class로 분리합니다."
        />
        <ConceptLadderViz
          title="Runtime 경계의 학습 순서"
          description="System call의 기본 경로에서 시작해 filter·mediation·guest kernel을 쌓은 뒤 선택합니다."
          steps={[
            { label: "Syscall", detail: "Application이 kernel service를 요청" },
            { label: "Seccomp", detail: "Host entry에서 요청을 filtering" },
            { label: "Sentry", detail: "Userspace application kernel이 중개" },
            { label: "Guest", detail: "VM 안 kernel이 system call 처리" },
            { label: "Select", detail: "격리·호환성·비용 gate로 승인" },
          ]}
        />
        <ContentBoundary article="sandbox-runtime-isolation" />
      </section>
    </article>
  );
}
