import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { EvidenceGrid, LessonHeader, TermLesson } from "../kimi-k3-shared";
import { SkillWorkflowLocator, SkillWorkflowMapReturn } from "../shared/SkillWorkflowLocator";
import ExecutionViz from "./viz/ExecutionViz";
import FormatViz from "./viz/FormatViz";
import LoadingViz from "./viz/LoadingViz";
import OverviewViz from "./viz/OverviewViz";
import RegistryViz from "./viz/RegistryViz";
import SkillRequestTraceViz from "./viz/SkillRequestTraceViz";

const skillExample = `---
name: gh-fix-ci
description: GitHub PR의 실패한 CI를 재현하고 최소 수정한 뒤 다시 검증할 때 사용합니다. 일반 코드 리뷰나 새 기능 구현에는 사용하지 않습니다.
---

# 먼저 실패를 재현해 원인을 확인합니다.
1. 실패한 check와 log를 확인합니다.
# 수정 전과 같은 조건을 확보합니다.
2. scripts/reproduce.sh로 실패를 재현합니다.
# 요청 범위 안에서 가장 작은 변경만 만듭니다.
3. 원인에 직접 관련된 파일만 수정합니다.
# 같은 검사와 관련 회귀 검사를 다시 실행합니다.
4. 실패한 check와 regression test를 검증합니다.
# 실제 결과와 아직 남은 위험을 보고합니다.
5. 원인, 변경 파일, 실행 결과를 기록합니다.`;

const pluginTree = `ci-helper/
├── plugin.json              # 설치 묶음의 이름과 버전
├── skills/
│   └── gh-fix-ci/
│       ├── SKILL.md         # 선택 조건과 작업 순서
│       ├── references/      # 필요할 때 읽는 규정
│       ├── scripts/         # 반복 가능한 검사
│       └── assets/          # 보고서 양식
└── mcp.json                 # 선택: 실시간 데이터와 동작 연결`;

export default function SkillsAnatomyArticle() {
  return (
    <article id="overview" className="space-y-16">
      <SkillWorkflowLocator />

      <section className="space-y-6">
        <LessonHeader number="00" eyebrow="한 요청의 전체 경로" title="Skill은 작업 방법을 펼치지만 권한을 만들지는 않습니다">
          실패한 CI를 고쳐 달라는 요청 하나가 후보 목록에서 검증 결과까지 이동하는
          과정을 먼저 봅니다.
        </LessonHeader>
        <SkillRequestTraceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사용자는 <strong>“이 PR에서 실패한 CI를 고치고 검증 결과를 보고해 주세요”</strong>라고
            요청합니다. 실행 환경은 먼저 사용할 수 있는 Skill의 짧은 설명을 보고
            <code>gh-fix-ci</code>를 고른 뒤, 그때 <code>SKILL.md</code> 전체와 필요한
            자료를 읽습니다.
          </p>
          <p>
            여기까지는 일을 하는 순서를 얻은 것입니다. 실제 log를 읽고 파일을
            고치고 검사를 실행하는 능력은 Tool이나 MCP server가 제공합니다. 어느
            저장소를 읽고 쓸 수 있는지는 실행 환경의 권한과 승인 정책이 계속
            판정합니다. Skill 안에 “push한다”라고 적혀 있어도 push 권한이 새로
            생기지는 않습니다.
          </p>
          <p>
            마지막에는 “고쳤다”는 문장 대신 실패한 검사가 다시 통과했는지, 어떤
            파일이 바뀌었는지, 남은 위험은 무엇인지 확인합니다. 따라서 Skill의
            역할은 <strong>반복 가능한 작업 지식을 필요한 순간에 제공하는 것</strong>이며,
            실행 권한과 결과 판정은 별도 책임으로 남습니다.
          </p>
        </div>
        <OverviewViz />
        <ContentBoundary article="skills-anatomy" />
        <TermLesson
          name="Agent Skill"
          oneLine="반복 작업의 선택 조건, 실행 순서, 참고 자료, 선택적 script와 결과 형식을 한 폴더에 묶은 작업 지식입니다."
          shape="요청 → metadata 선택 → SKILL.md → 필요한 자료 → 기존 도구 → 검증 결과"
          example="gh-fix-ci는 실패 재현→최소 수정→재검증→보고 순서를 알려 줍니다."
          boundary="새 Tool·자격증명·승인·system 권한을 만들지 않으며, 지침이 맞다는 사실도 자동으로 보장하지 않습니다."
        />
      </section>

      <section id="format" className="space-y-6 scroll-mt-24">
        <LessonHeader number="01" eyebrow="파일 구조" title="고르는 정보와 실행할 지침을 나눕니다">
          요청과 맞는지 판단할 짧은 설명은 앞에 두고, 자세한 작업 순서와 자료는
          선택된 뒤 읽도록 분리합니다.
        </LessonHeader>
        <FormatViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Skill 폴더의 입구는 <code>SKILL.md</code>입니다. YAML front matter의
            <code>name</code>과 <code>description</code>은 전체 본문을 읽기 전에 보이는
            선택 정보입니다. 그래서 description에는 내부 구현 이름보다 사용자가
            말할 법한 목표와 적용하지 않을 경계를 함께 적습니다.
          </p>
          <p>
            본문에는 입력, 실행 순서, 분기, 결과 형식, 검증과 실패 처리를 씁니다.
            긴 정책은 <code>references/</code>, 반복 계산이나 파일 검사는
            <code>scripts/</code>, 복사하거나 변환할 양식은 <code>assets/</code>에 둡니다.
            이 폴더들을 모두 만들 필요는 없습니다. 현재 작업에 실제로 필요한
            자료만 추가합니다.
          </p>
        </div>
        <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{skillExample}</code></pre>
        <div id="paper-openai-api-skills" className="scroll-mt-24">
          <CitationBlock source="OpenAI API — Skills" citeKey={1} href="https://developers.openai.com/api/docs/guides/tools-skills">
            <EvidenceGrid
              problem="반복 작업의 지침과 지원 파일을 실행 환경에 제공하고 필요한 Skill을 선택하는 문제"
              contribution="SKILL.md의 name·description·instructions, supporting files, discovery와 user-prompt 우선순위를 설명"
              assumptions="2026-10-25에 확인한 OpenAI Responses API·Agents API의 Skills 문서"
              scope="OpenAI 실행 환경에서 Skill을 발견하고 전체 지침을 읽는 현재 방식"
              notClaim="모든 agent host가 같은 경로·권한·업로드 형식을 쓰거나 Skill이 system instruction이 된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="loading" className="space-y-6 scroll-mt-24">
        <LessonHeader number="02" eyebrow="선택과 로딩" title="짧게 발견하고 필요한 만큼 펼칩니다">
          설치된 모든 지침을 처음부터 읽지 않고, 요청과 맞는 후보를 고른 뒤 전체
          지침과 필요한 지원 파일로 확장합니다.
        </LessonHeader>
        <LoadingViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            처음에는 각 Skill의 <code>name</code>, <code>description</code>,
            <code>path</code>만 후보 정보로 들어옵니다. 사용자가 특정 Skill을 직접
            지정하거나 요청이 설명과 맞으면 실행 환경이 그 경로의
            <code>SKILL.md</code> 전체를 읽습니다. 선택 전 metadata와 선택 뒤 본문은
            서로 다른 단계입니다.
          </p>
          <p>
            사례에서는 CI 실패를 재현해야 하므로 <code>scripts/reproduce.sh</code>와
            관련 정책만 추가로 읽습니다. 보고서를 만들 때가 되면 결과 양식을
            사용합니다. 다른 언어나 배포 절차와 관련된 자료까지 먼저 읽는다면
            현재 요청의 근거와 주의점이 불필요한 내용에 묻힐 수 있습니다.
          </p>
          <p>
            이 방식을 필요한 만큼 펼치기(progressive disclosure)라고 합니다. 다만
            후보가 너무 많거나 description이 서로 겹치면 올바른 Skill을 놓치거나
            엉뚱한 Skill이 끼어들 수 있습니다. 실제 요청과 범위 밖 요청을 함께
            넣어 선택 결과를 검증해야 합니다.
          </p>
        </div>
      </section>

      <section id="execution" className="space-y-6 scroll-mt-24">
        <LessonHeader number="03" eyebrow="실행과 검증" title="선택, 허용, 실행, 합격을 따로 기록합니다">
          올바른 Skill을 골랐는지와 실제 작업이 성공했는지를 서로 다른 질문으로
          측정합니다.
        </LessonHeader>
        <ExecutionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Skill 지침은 OpenAI API의 현재 구현에서 system prompt가 아니라 사용자
            입력과 같은 우선순위로 다뤄집니다. 따라서 상위 지침과 실행 정책을
            덮어쓸 수 없습니다. 외부에서 받은 Skill은 계획과 명령 실행에 영향을
            줄 수 있으므로 실행 가능한 공급망 입력처럼 검토해야 합니다.
          </p>
          <p>
            사례의 재현 script를 실행하기 전에는 현재 workspace, 허용된 명령,
            외부 연결과 쓰기 범위를 확인합니다. 실행 뒤에는 exit code만 보지 않고
            원래 실패한 check, 관련 회귀 검사, 변경 파일을 함께 확인합니다. 권한
            거절과 검사 실패도 서로 다른 상태로 남겨야 다음 조치를 고를 수 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Skill 선택과 작업 완료를 어떻게 나눠 측정합니까?"
          idea="먼저 적용해야 하는 요청과 적용하면 안 되는 요청을 표시합니다. 선택 결과에서 잘 고른 TP, 잘못 끼어든 FP, 놓친 FN을 세어 routing을 보고, 선택된 작업의 test 통과와 부작용은 별도 지표로 봅니다."
          formula={String.raw`\mathrm{Precision}=\frac{TP}{TP+FP},\qquad \mathrm{Recall}=\frac{TP}{TP+FN}`}
          annotatedFormula={String.raw`\begin{aligned}\mathrm{Precision}&=\frac{\underbrace{TP}_{\text{맞게 선택}}}{TP+\underbrace{FP}_{\text{잘못 끼어듦}}}\\\mathrm{Recall}&=\frac{TP}{TP+\underbrace{FN}_{\text{놓침}}}\end{aligned}`}
          operations={[
            { expression: String.raw`TP/(TP+FP)`, annotation: ["Skill을 고른 요청 중 실제 적용 대상의 비율", "낮으면 description 범위가 지나치게 넓을 수 있음"] },
            { expression: String.raw`TP/(TP+FN)`, annotation: ["적용 대상 중 실제로 Skill을 고른 비율", "낮으면 표현이나 후보 구성이 요청을 놓칠 수 있음"] },
          ]}
          terms={[
            { symbol: "TP", name: "맞게 선택", description: "Skill이 필요한 요청에서 실제로 선택한 수입니다." },
            { symbol: "FP", name: "잘못 선택", description: "Skill이 필요하지 않은 요청에 선택한 수입니다." },
            { symbol: "FN", name: "선택 누락", description: "Skill이 필요하지만 선택하지 못한 수입니다." },
          ]}
          assumptions={[
            "적용 대상과 비적용 대상을 사람이 검토한 같은 평가 묶음으로 비교합니다.",
            "같은 model·실행 환경·Skill version을 사용하고 표현을 바꾼 요청과 비슷하지만 범위 밖인 요청을 포함합니다.",
            "이 수치는 선택만 평가하므로 test 성공·권한 위반·지연·비용은 별도로 측정합니다.",
          ]}
          interpretation="적용 대상 40건 중 36건을 고르고 비적용 요청에서 6건을 잘못 골랐다면 precision은 36/42, recall은 36/40입니다. 이 값이 좋아도 CI 수정이 맞다는 뜻은 아니므로 실제 test와 diff 검증이 추가로 필요합니다."
        />
        <div id="paper-openai-skill-safety" className="scroll-mt-24">
          <CitationBlock source="OpenAI API — Skills / Risks and safety" citeKey={2} href="https://developers.openai.com/api/docs/guides/tools-skills">
            <EvidenceGrid
              problem="Skill 지침과 script가 계획·도구 사용·명령 실행에 영향을 주면서 생기는 공급망 위험"
              contribution="Skill을 검토되지 않은 입력으로 취급하고 민감한 쓰기에 승인과 정책 검사를 두도록 안내"
              assumptions="OpenAI shell 또는 sandbox에 Skill을 연결하고 네트워크나 쓰기 동작을 함께 사용하는 경우"
              scope="Skill instruction의 우선순위와 고위험 동작 앞의 검토·승인 경계"
              notClaim="검토만 하면 script·외부 데이터·Tool 결과의 안전성이 자동으로 증명된다는 뜻은 아님"
            />
          </CitationBlock>
        </div>
      </section>

      <section id="registry" className="space-y-6 scroll-mt-24">
        <LessonHeader number="04" eyebrow="버전과 배포" title="작업 지식과 실시간 동작을 따로 배포합니다">
          Skill 파일의 버전, 설치 묶음, 실제 외부 시스템에 연결하는 MCP server의
          책임을 나눕니다.
        </LessonHeader>
        <RegistryViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            직접 관리하는 실행 환경에서는 Skill의 경로를 등록할 수 있고, hosted
            환경에서는 업로드한 Skill의 version을 고정해 사용할 수 있습니다.
            “latest”를 쓰면 새 지침이 즉시 선택될 수 있으므로 재현성과 변경 통제가
            필요한 작업은 실제 사용 version과 평가 결과를 함께 기록합니다.
          </p>
          <p>
            여러 Skill과 외부 연결을 다른 사용자에게 설치시키려면 Plugin으로 묶을
            수 있습니다. 이때 Skill은 도구를 어떤 순서로 호출하고 불완전한 결과를
            어떻게 처리할지 알려 줍니다. MCP server는 실시간 데이터, 인증, 권한
            검사와 허용된 동작을 담당합니다. 둘을 함께 설치해도 같은 책임을 두 번
            소유하게 해서는 안 됩니다.
          </p>
        </div>
        <pre className="not-prose min-w-0 overflow-x-auto border border-border bg-muted/20 p-4 text-xs leading-6"><code>{pluginTree}</code></pre>
        <div className="grid gap-5 lg:grid-cols-2">
          <div id="paper-openai-plugin-skills" className="scroll-mt-24">
            <CitationBlock source="OpenAI Plugins — Skills" citeKey={3} href="https://developers.openai.com/plugins/concepts/skills">
              <EvidenceGrid
                problem="MCP tool과 반복 workflow를 한 Plugin에서 연결하되 책임을 섞지 않는 문제"
                contribution="MCP server는 live data·authentication·authorization·actions, Skill은 순서·판단·결과 형식을 맡는 경계를 설명"
                assumptions="2026-10-25에 확인한 OpenAI Plugin 구조"
                scope="Skill과 MCP server의 조합과 activation 개념"
                notClaim="MCP server가 필수이거나 Skill만으로 외부 서비스 접근 권한이 생긴다는 뜻은 아님"
              />
            </CitationBlock>
          </div>
          <div id="paper-openai-plugin-package" className="scroll-mt-24">
            <CitationBlock source="OpenAI Plugins — Package your plugin" citeKey={4} href="https://developers.openai.com/plugins/build/plugins">
              <EvidenceGrid
                problem="Skill·MCP 설정·asset을 설치 가능한 하나의 versioned package로 배포하는 문제"
                contribution="plugin.json, skills/, mcp.json과 OpenAI 확장 설정의 현재 package 구조를 설명"
                assumptions="문서가 설명하는 portable Agent Plugins 또는 Codex compatibility package"
                scope="배포 묶음의 파일 구조와 연결 metadata"
                notClaim="Plugin 설치가 포함된 hook·server·script를 자동으로 신뢰하거나 모든 실행 환경에 배포한다는 뜻은 아님"
              />
            </CitationBlock>
          </div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>처음 질문에 답합니다</h3>
          <p>
            요청과 맞는 Skill은 짧은 metadata로 발견되고, 선택된 뒤 전체 지침과 필요한
            자료가 펼쳐집니다. 그 지침은 기존 Tool을 사용하는 순서를 알려 줄 뿐 권한을
            넓히지 않습니다. 실제 test와 변경 내역이 기준을 통과해야 완료입니다.
          </p>
          <ol>
            <li>description만 보고 CI를 수정해도 됩니까? <strong>아닙니다. 전체 SKILL.md를 읽어야 합니다.</strong></li>
            <li>Skill에 push 단계가 있으면 push 권한이 생깁니까? <strong>아닙니다. 실행 환경이 별도로 허용해야 합니다.</strong></li>
            <li>MCP server와 Skill은 무엇이 다릅니까? <strong>서버는 데이터와 동작을, Skill은 반복 작업의 순서를 맡습니다.</strong></li>
          </ol>
        </div>
      </section>

      <SkillWorkflowMapReturn />
    </article>
  );
}
