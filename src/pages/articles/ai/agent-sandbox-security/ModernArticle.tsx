import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import ConceptLadderViz from "@/components/viz/ConceptLadderViz";
import { AGENT_SECURITY_SOURCES } from "@/content/agent-sandbox-security";
import { ContainerBoundaryViz } from "../sandbox-security-viz";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";

export default function AgentSandboxSecurityArticle() {
  return (
    <article id="overview" className="space-y-16">
      <section className="space-y-6">
        <LessonHeader
          number="00"
          eyebrow="container보다 먼저"
          title="Container는 별도 컴퓨터가 아니라 제한을 받은 Linux process다"
        >
          먼저 process 하나를 놓고, 그 위에 보이는 자원을 바꾸는 namespace와
          사용량을 제한하는 cgroup을 한 층씩 올립니다. 그 뒤에야 root와 공격
          경로를 이야기합니다.
        </LessonHeader>
        <TermLesson
          name="Process · container resource boundary"
          oneLine={
            <>
              <strong>Process</strong>는 실행 중인 program과 memory·file
              descriptor·credential 상태입니다. <strong>Container</strong>는 이
              process에 Linux 격리·제한 정책을 묶어 실행하는 형태입니다.
            </>
          }
          shape="host → process → namespace view + cgroup budget"
          example="agent process는 PID 12와 /workspace만 보면서 memory 2 GiB·PID 128개 제한을 받을 수 있습니다."
          boundary="일반 runc container는 host kernel을 공유합니다. 별도 filesystem view가 생겼다고 별도 kernel이 생긴 것은 아닙니다."
        />
        <ContainerBoundaryViz />
      </section>

      <section id="namespace" className="space-y-6">
        <LessonHeader
          number="01"
          eyebrow="보이는 이름"
          title="Namespace는 process가 볼 자원 목록과 이름을 바꾼다"
        >
          PID·mount·network namespace를 한꺼번에 외우지 말고, 같은 host 자원을
          서로 다른 view로 보여 주는 한 가지 역할부터 잡습니다.
        </LessonHeader>
        <TermLesson
          name="Linux namespace resource view"
          oneLine="Namespace는 process가 볼 PID·mount·network interface·hostname·user ID 같은 자원의 view를 분리합니다."
          shape="host resource set → namespace mapping → process-visible names"
          example="Host의 PID 43120이 container 안에서는 PID 12로 보이고, host의 전체 mount 대신 /workspace만 보일 수 있습니다."
          boundary="Namespace는 CPU·memory 사용량을 제한하지 않고, 허용된 system call을 대신 처리하지도 않습니다."
        />
        <div id="paper-linux-namespaces" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.linuxNamespaces.label}
            citeKey={1}
            href={AGENT_SECURITY_SOURCES.linuxNamespaces.href}
            type="code"
          >
            <EvidenceGrid
              problem="Process마다 서로 다른 system resource view를 제공하는 문제"
              contribution="Linux namespace 종류와 격리되는 global resource를 정의"
              assumptions="Linux kernel namespace semantics와 process membership"
              scope="PID·mount·network·user 등 namespace가 바꾸는 resource view"
              notClaim="CPU·memory budget이나 host kernel exploit 방지까지 제공한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="cgroup" className="space-y-6">
        <LessonHeader
          number="02"
          eyebrow="쓸 수 있는 양"
          title="Cgroup은 보이는 자원이 아니라 사용할 수 있는 양을 제한한다"
        >
          Namespace가 문에 붙은 이름표라면 cgroup은 전기·물 사용량 계량기입니다.
          둘은 함께 쓰이지만 같은 기능이 아닙니다.
        </LessonHeader>
        <TermLesson
          name="Linux cgroup resource budget"
          oneLine="Cgroup은 process 집합의 CPU·memory·PID·I/O 사용량을 계층적으로 측정하고 제한하는 kernel mechanism입니다."
          shape="process group → controller → current usage / hard limit"
          example="memory.max=2 GiB이고 현재 usage가 1.5 GiB라면 남은 memory budget은 0.5 GiB입니다."
          boundary="Cgroup limit은 어떤 file·network destination·credential을 볼 수 있는지 정하지 않습니다."
        />
        <ExplainedFormula
          question="한 자원의 남은 budget은 왜 limit에서 현재 사용량을 빼서 계산할까요?"
          idea="새 작업이 더 쓸 수 있는 양은 전체 허용량 가운데 이미 점유한 양을 제외한 부분이기 때문입니다. 음수가 되면 0으로 잘라 초과 사용을 남은 budget으로 오해하지 않습니다."
          formula={String.raw`H_r=\max(0,L_r-U_r)`}
          annotatedFormula={String.raw`\begin{aligned}D_r&=\underbrace{L_r-U_r}_{\text{limit에서 현재 사용량을 빼 남은 양 계산}}\\H_r&=\underbrace{\max(0,D_r)}_{\text{초과 상태를 음수 budget으로 내보내지 않음}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`L_r-U_r`,
              annotation: [
                "전체 허용량에서 이미 쓴 양을 빼",
                "추가로 쓸 수 있는 양 계산",
              ],
            },
            {
              expression: String.raw`\max(0,D_r)`,
              annotation: [
                "초과 사용으로 음수가 되면",
                "남은 budget을 0으로 고정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "r",
              name: "Resource",
              description:
                "memory·PID·CPU quota처럼 따로 예산을 두는 자원입니다.",
            },
            {
              symbol: String.raw`L_r`,
              name: "Limit",
              description: "Resource r에 허용한 최대량입니다.",
            },
            {
              symbol: String.raw`U_r`,
              name: "Current usage",
              description: "현재 process group이 사용 중인 양입니다.",
            },
            {
              symbol: String.raw`H_r`,
              name: "Headroom",
              description: "새 작업에 남은 안전한 자원 여유입니다.",
            },
          ]}
          assumptions={[
            "Limit과 usage는 같은 단위와 같은 cgroup hierarchy에서 읽습니다.",
            "Burst·swap·CPU throttling처럼 controller별 semantics는 별도로 확인합니다.",
          ]}
          interpretation="2 GiB limit에서 1.5 GiB를 쓰면 headroom은 0.5 GiB입니다. Usage가 2.2 GiB로 관측되어도 새 budget은 -0.2 GiB가 아니라 0입니다."
        />
        <div id="paper-linux-cgroup" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.linuxCgroupV2.label}
            citeKey={2}
            href={AGENT_SECURITY_SOURCES.linuxCgroupV2.href}
            type="code"
          >
            <EvidenceGrid
              problem="Process 집합의 resource consumption을 계층적으로 배분·측정하는 문제"
              contribution="Cgroup v2 hierarchy와 controller interface를 정의"
              assumptions="사용 kernel·controller 활성화·delegation과 container runtime 설정"
              scope="CPU·memory·I/O·PID 등 resource accounting과 limit"
              notClaim="Namespace·syscall·network·credential 격리를 대신한다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="attack-path" className="space-y-6">
        <LessonHeader
          number="03"
          eyebrow="신호에서 영향까지"
          title="경고 하나가 아니라 열린 edge가 끝까지 이어지는지를 본다"
        >
          파일 읽기나 port scan은 출발 신호입니다. Token·route·mount 같은
          capability를 만나 경계를 넘고 실제 write·유출로 끝나야 impact가
          됩니다.
        </LessonHeader>
        <TermLesson
          name="Agent attack-path completion"
          oneLine="Signal→execution→capability→boundary crossing→impact 경로에서 모든 edge가 실제 배포에 열려 있는지 확인하는 우선순위 방법입니다."
          shape="signal → capability → crossing → impact"
          example="metadata IP 접근 신호가 있고, token 응답·control-plane write 권한·외부 POST가 모두 가능하면 credential theft 경로가 완성됩니다."
          boundary="이 Boolean model은 확률이나 CVSS를 계산하지 않으며, 아직 찾지 못한 우회 경로가 없다고 보장하지 않습니다."
        />
        <ExplainedFormula
          question="왜 한 경로의 edge availability를 모두 곱할까요?"
          idea="각 a(e)를 0 또는 1로 두면 곱은 Boolean AND처럼 동작합니다. Edge 하나라도 차단되면 그 경로의 곱이 0이 되어 impact까지 이어지지 않습니다."
          formula={String.raw`\operatorname{reachable}(I)\Longleftrightarrow\exists p:s\leadsto I,\ \prod_{e\in p}a(e)=1`}
          annotatedFormula={String.raw`\begin{gathered}\mathcal P_I=\underbrace{\{p\mid s\leadsto I\}}_{\text{경로 후보}}\\A(p)=\underbrace{\prod_{e\in p}a(e)}_{\text{모든 edge를 AND}}\\\operatorname{reachable}(I)\\=\underbrace{[\exists p\in\mathcal P_I:A(p)=1]}_{\text{완성 경로 존재}}\end{gathered}`}
          operations={[
            {
              expression: String.raw`\{p\mid p:s\leadsto I\}`,
              annotation: ["signal에서 impact까지", "가능한 경로 후보를 모음"],
            },
            {
              expression: String.raw`\prod_{e\in p}a(e)`,
              annotation: [
                "edge availability를 곱해",
                "하나라도 막히면 경로를 0으로 만듦",
              ],
            },
            {
              expression: String.raw`\exists p:A(p)=1`,
              annotation: [
                "완성 경로가 하나라도 있으면",
                "impact를 reachable로 올림",
              ],
            },
          ]}
          terms={[
            {
              symbol: "s",
              name: "Signal",
              description: "처음 관찰한 file read·scan·request입니다.",
            },
            {
              symbol: "I",
              name: "Impact",
              description:
                "Secret 유출·control-plane 변조·host 장악 같은 실제 결과입니다.",
            },
            {
              symbol: "p",
              name: "Attack path",
              description: "Signal에서 impact로 이어지는 edge 순서입니다.",
            },
            {
              symbol: String.raw`a(e)`,
              name: "Edge availability",
              description:
                "현재 정책에서 edge e가 가능하면 1, 차단되면 0입니다.",
            },
          ]}
          assumptions={[
            "Token·route·mount·device와 실제 enforcement 상태를 inventory했습니다.",
            "곱은 확률이 아니라 0/1 gate의 AND 표기입니다.",
          ]}
          interpretation="metadata route를 차단해 한 경로가 0이 되어도 mounted secret을 읽는 다른 경로가 남을 수 있습니다. 그래서 경로별로 끊고 다시 탐색합니다."
        />
      </section>

      <section id="container-root" className="space-y-6">
        <LessonHeader
          number="04"
          eyebrow="권한 경계"
          title="Container root는 host root가 아니지만 열린 host 경계와 만나면 피해가 커진다"
        >
          UID 숫자 하나로 안전·침해를 단정하지 않고 user
          mapping·capability·mount와 runtime escape를 함께 봅니다.
        </LessonHeader>
        <TermLesson
          name="Container root · host root boundary"
          oneLine="Namespace 안 UID 0의 권한과 host 관리 권한을 구분하면서, host 자원으로 이어지는 열린 edge가 blast radius를 키우는지 보는 경계입니다."
          shape="container UID 0 → namespace/capability/mount gate → host resource"
          example="UID 0이어도 host root는 아니지만 hostPath와 과도한 capability가 있고 runtime escape가 성공하면 host 자원 영향이 커집니다."
          boundary="runAsNonRoot는 좋은 기본선이지만 seccomp·guest kernel·mount·egress 통제를 대신하지 않습니다."
        />
        <div id="paper-linux-capabilities" className="scroll-mt-24">
          <CitationBlock
            source={AGENT_SECURITY_SOURCES.linuxCapabilities.label}
            citeKey={3}
            href={AGENT_SECURITY_SOURCES.linuxCapabilities.href}
            type="code"
          >
            <EvidenceGrid
              problem="전통적인 all-powerful root 권한을 더 작은 privilege 단위로 나누는 문제"
              contribution="Linux capability 집합과 process privilege checks를 정의"
              assumptions="Kernel capability semantics·user namespace·runtime configuration"
              scope="UID 0과 capability가 실제로 허용하는 privileged operation"
              notClaim="Capability drop 하나로 mount·kernel exploit·network·credential 경계가 완성된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
        <ConceptLadderViz
          title="Container 보안의 첫 학습 사다리"
          description="Process에서 시작해 view·budget·path·root 경계를 순서대로 쌓습니다."
          steps={[
            { label: "Process", detail: "Host kernel 위 실행 상태" },
            { label: "Namespace", detail: "보이는 자원 이름과 범위" },
            { label: "Cgroup", detail: "사용 가능한 resource budget" },
            { label: "Path", detail: "열린 capability edge의 연결" },
            { label: "Root", detail: "Namespace 내부 권한과 host 영향 분리" },
          ]}
        />
        <ContentBoundary article="agent-sandbox-security" />
      </section>
    </article>
  );
}
