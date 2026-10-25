import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import {
  SandboxBoundaryLocator,
  SandboxBoundaryMapReturn,
} from "../shared/SandboxBoundaryLocator";
import SandboxRuntimeIsolationViz from "./viz/SandboxRuntimeIsolationViz";

export default function SandboxRuntimeIsolationArticle() {
  return (
    <article id="overview" className="space-y-16">
      <SandboxBoundaryLocator current="runtime" />

      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="같은 호출"
          title="openat()을 누가 처리하는지부터 봅니다"
        >
          Seccomp·gVisor·Kata를 보안 강도 한 줄로 세우지 않습니다. 같은 파일
          열기 요청이 어디서 검사되고 어느 커널에서 처리되는지 따라갑니다.
        </LessonHeader>
        <SandboxRuntimeIsolationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글의 보고서 요약 코드를 샌드박스에서 실행한다고 하겠습니다. 코드는
            <code>openat(AT_FDCWD, "/workspace/report-91.md", O_RDONLY)</code>를
            호출합니다. 비교하는 동안 파일과 플래그는 바꾸지 않습니다.
          </p>
          <p>
            Seccomp는 이 호출을 허용하거나 거부합니다. 허용했다면 호스트 커널이
            실제 호출을 처리합니다. gVisor에서는 Sentry가 애플리케이션이 보는 Linux
            시스템 API를 구현합니다. Kata에서는 VM 안의 게스트 커널이 호출을 처리한
            뒤 필요한 호스트 입출력이 VMM 경계를 지납니다.
          </p>
          <p>
            따라서 질문은 “무엇이 가장 강한가” 하나가 아닙니다. 호출을 처리하는 커널,
            호스트에 노출되는 인터페이스, 지원하는 API, 기동과 메모리 비용을 따로 봐야
            합니다. 파일 경로·외부 통신·자격증명·자원 제한도 런타임 이름만으로 정해지지
            않습니다.
          </p>
        </div>
        <ContentBoundary article="sandbox-runtime-isolation" />
        <TermLesson
          name="시스템 호출 · 호스트 커널 경로"
          oneLine="애플리케이션이 파일·네트워크·프로세스·장치 기능을 커널에 요청하는 인터페이스입니다."
          shape="프로세스 → 시스템 호출 진입점 → 호스트 커널 → 자원"
          example="runc 안 프로세스의 openat()도 namespace가 보여 주는 경로를 사용하지만 실제 처리는 호스트 Linux 커널이 맡습니다."
          boundary="호출 경로를 안다고 파일 권한·네트워크 경로·자격증명 정책이 자동으로 정해지는 것은 아닙니다."
        />
      </section>

      <section id="seccomp" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="필터"
          title="Seccomp는 호스트 커널 앞에서 호출을 거릅니다"
        >
          필터와 별도 커널을 구분합니다. 허용된 호출은 여전히 호스트 커널이
          처리합니다.
        </LessonHeader>
        <TermLesson
          name="시스템 호출 필터"
          oneLine="Seccomp BPF는 호출 번호와 인자를 보고 실행·오류 반환·로그·프로세스 종료 같은 동작을 고릅니다."
          shape="시스템 호출 요청 → 허용·거부 판정 → 공유 호스트 커널"
          example="RuntimeDefault가 ptrace 같은 일부 호출을 막아도 허용된 read·write·network 호출은 호스트 커널로 들어갑니다."
          boundary="openat의 경로 인자는 포인터 값이므로 Seccomp가 파일 경로 정책을 대신하지 않습니다. Mount·DAC·LSM 같은 경계를 따로 둡니다."
        />
        <div id="paper-linux-seccomp" className="scroll-mt-24">
          <CitationBlock
            source="Linux kernel — Seccomp BPF"
            citeKey={1}
            href="https://docs.kernel.org/userspace-api/seccomp_filter.html"
          >
            <EvidenceGrid
              problem="프로세스가 사용하지 않는 넓은 호스트 커널 시스템 호출 표면에 접근하는 문제"
              contribution="시스템 호출 번호와 인자를 BPF로 검사하고 ALLOW·ERRNO·TRAP·KILL 같은 결과를 반환하는 경로"
              assumptions="호스트 커널의 Seccomp 지원과 실제 적용된 필터 프로그램"
              scope="시스템 호출 진입점의 필터 동작"
              notClaim="파일 경로 의미·네트워크 목적지·애플리케이션 권한까지 판정한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <div id="paper-kubernetes-seccomp" className="scroll-mt-24">
          <CitationBlock
            source="Kubernetes — Restrict a Container's Syscalls with seccomp"
            citeKey={2}
            href="https://kubernetes.io/docs/tutorials/security/seccomp/"
          >
            <EvidenceGrid
              problem="Pod마다 Seccomp 적용 여부와 프로필이 달라지는 문제"
              contribution="securityContext.seccompProfile의 RuntimeDefault·Localhost 적용 방식과 seccompDefault 동작 설명"
              assumptions="사용 중인 Kubernetes·kubelet·컨테이너 런타임 조합"
              scope="Kubernetes API가 노드의 Seccomp 프로필을 선택하는 방법"
              notClaim="RuntimeDefault의 허용 목록이 모든 컨테이너 런타임과 릴리스에서 같다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="application-kernel" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="중개 커널"
          title="gVisor는 Sentry가 Linux API를 구현합니다"
        >
          Sentry는 단순한 Seccomp 프로필이 아닙니다. 애플리케이션의 시스템 API를
          누가 구현하는지가 달라집니다.
        </LessonHeader>
        <TermLesson
          name="애플리케이션 커널 중개"
          oneLine="Sentry 같은 사용자 공간 애플리케이션 커널이 Linux API의 상당 부분을 구현하고 제한된 호스트 인터페이스만 사용하게 하는 경계입니다."
          shape="애플리케이션 → Sentry의 API 구현 → 제한된 호스트 인터페이스"
          example="호스트 파일을 읽을 때 Sentry가 경로와 파일 상태를 처리하고, 구성에 따라 Gofer 같은 제한된 통로로 호스트 입출력을 요청합니다."
          boundary="하드웨어 VM과 같은 경계가 아니며 모든 시스템 호출·파일시스템·GPU 작업이 호환된다는 뜻도 아닙니다."
        />
        <div id="paper-gvisor-security" className="scroll-mt-24">
          <CitationBlock
            source="gVisor release-20261019.0 — Security Model"
            citeKey={3}
            href="https://github.com/google/gvisor/blob/release-20261019.0/g3doc/architecture_guide/security.md"
          >
            <EvidenceGrid
              problem="컨테이너 애플리케이션이 넓은 호스트 커널 시스템 API에 직접 닿는 문제"
              contribution="Sentry가 시스템 API를 구현하고 Sentry 자체의 호스트 인터페이스도 제한하는 다층 경계"
              assumptions="gVisor release-20261019.0, 선택한 systrap·KVM 플랫폼과 runsc 설정"
              scope="애플리케이션 호출을 Sentry가 중개하는 보안 모델"
              notClaim="하드웨어 VM과 같거나 모든 Linux 애플리케이션이 수정 없이 동작한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="guest-kernel" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="게스트 커널"
          title="Kata는 VM 안 커널이 호출을 처리합니다"
        >
          컨테이너 인터페이스를 유지하지만 실행 경로에는 게스트 커널과 VMM이
          추가됩니다. 별도 경계와 함께 새로운 호환 조건도 생깁니다.
        </LessonHeader>
        <TermLesson
          name="게스트 커널 경계"
          oneLine="Pod 작업을 게스트 커널 안에 두고 VMM과 하드웨어 가상화를 통해 호스트 커널과 분리하는 실행 경계입니다."
          shape="애플리케이션 → 게스트 커널 → VMM → 호스트·하드웨어"
          example="Kata Pod의 openat()은 게스트 커널에서 처리되고 호스트 파일·장치와의 상호작용은 가상화된 경로를 통과합니다."
          boundary="기동·메모리·이미지·VMM·중첩 가상화 조건이 따르므로 별도 커널이 언제나 모든 작업의 정답은 아닙니다."
        />
        <div id="paper-kata-virtualization" className="scroll-mt-24">
          <CitationBlock
            source="Kata Containers 4.3.1 — Virtualization design"
            citeKey={4}
            href="https://github.com/kata-containers/kata-containers/blob/4.3.1/docs/design/virtualization.md"
            type="code"
          >
            <EvidenceGrid
              problem="컨테이너 작업 흐름을 유지하면서 호스트와 다른 커널 경계를 두는 문제"
              contribution="Kata 4.3.1의 게스트 커널·에이전트·VMM·가상 장치 경로"
              assumptions="선택한 VMM, 하드웨어 가상화, 게스트 이미지와 배포 환경"
              scope="게스트 커널 격리 구조와 호스트 상호작용 경계"
              notClaim="모든 클라우드·장치에서 같은 호환성·기동 시간·메모리 비용을 보장한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="runtime-spectrum" className="space-y-6">
        <LessonHeader
          number="04"
          eyebrow="한 줄 순위의 한계"
          title="경계와 호환 조건을 따로 확인합니다"
        >
          격리 경계가 다르면 얻는 보호와 새로 생기는 제약도 다릅니다. 실제 선택은
          같은 작업을 같은 조건에서 실행한 근거가 있어야 합니다.
        </LessonHeader>
        <TermLesson
          name="런타임 격리의 여러 축"
          oneLine="공유 커널 표면·시스템 API 중개·게스트 커널·호환성·기동·메모리를 서로 다른 축으로 보는 방법입니다."
          shape="필요한 경계 × 실제 API 호환성 × 실행 비용"
          example="같은 openat()은 모두 동작해도 특수 ioctl이나 파일시스템 기능은 Sentry·게스트 이미지·VMM 구성에 따라 달라질 수 있습니다."
          boundary="runc&lt;gVisor&lt;Kata 같은 단일 순위는 작업 호환성·패치·VMM 성숙도와 남은 배포 정책을 설명하지 못합니다."
        />
        <ExplainedFormula
          question="왜 격리 점수 하나로 런타임을 고를 수 없을까요?"
          idea="필요한 커널 경계를 만들어도 필수 API가 깨지거나 기동·메모리 조건을 넘으면 같은 작업을 실행할 수 없습니다. 각 조건을 독립된 0/1 문으로 둡니다."
          formula={String.raw`A(r,w)=I(r,w)\land C(r,w)\land S(r,w)\land M(r,w)`}
          annotatedFormula={String.raw`\begin{aligned}G_{\mathrm{security}}&=\underbrace{I(r,w)}_{\text{요구한 kernel 경계를 충족}}\\G_{\mathrm{compat}}&=\underbrace{C(r,w)}_{\text{필수 syscall·I/O가 회귀 없이 동작}}\\G_{\mathrm{cost}}&=\underbrace{S(r,w)\land M(r,w)}_{\text{startup과 memory 예산을 함께 통과}}\\A(r,w)&=\underbrace{G_{\mathrm{security}}\land G_{\mathrm{compat}}\land G_{\mathrm{cost}}}_{\text{모든 gate가 참인 runtime만 승인}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`I(r,w)`,
              annotation: ["작업이 요구한", "커널 격리 경계를 확인"],
            },
            {
              expression: String.raw`C(r,w)`,
              annotation: [
                "실제 시스템 호출·I/O 검사를 실행해",
                "호환성 회귀를 확인",
              ],
            },
            {
              expression: String.raw`S(r,w)\land M(r,w)`,
              annotation: [
                "기동과 메모리를 함께 묶어",
                "한쪽 조건만 통과하는 경우를 제외",
              ],
            },
            {
              expression: String.raw`G_s\land G_c\land G_o`,
              annotation: [
                "독립 조건을 AND로 묶어",
                "한 조건이라도 실패하면 후보에서 제외",
              ],
            },
          ]}
          terms={[
            {
              symbol: "r",
              name: "런타임 후보",
              description: "runc·gVisor·Kata처럼 같은 작업으로 확인할 실행 경로입니다.",
            },
            {
              symbol: "w",
              name: "작업",
              description:
                "실제 code·I/O·session lifetime을 가진 배포 단위입니다.",
            },
            {
              symbol: "I",
              name: "격리 조건",
              description: "요구한 host/guest kernel 경계를 충족하면 1입니다.",
            },
            {
              symbol: "C",
              name: "호환 조건",
              description: "필수 기능 test가 통과하면 1입니다.",
            },
            {
              symbol: "S,M",
              name: "기동·메모리 조건",
              description: "정한 기동 시간과 메모리 한도를 각각 통과하면 1입니다.",
            },
          ]}
          assumptions={[
            "같은 이미지·호스트 커널·입력·부하 조건으로 후보를 비교합니다.",
            "성공 경로뿐 아니라 금지한 호출·파일·통신이 실제로 막히는지도 확인합니다.",
          ]}
          interpretation="예를 들어 gVisor가 요구한 커널 경계를 만족해도 필수 파일 I/O가 실패하면 그 작업의 후보가 아닙니다. Kata가 기능은 맞아도 허용한 기동 시간과 메모리 범위를 넘으면 같은 작업에 그대로 적용할 수 없습니다."
        />
      </section>

      <SandboxBoundaryMapReturn current="runtime" />
    </article>
  );
}
