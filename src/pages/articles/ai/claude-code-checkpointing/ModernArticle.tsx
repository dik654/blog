import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { CheckpointBoundaryViz } from "../claude-code/viz/ModernClaudeCodeViz";

export default function ClaudeCodeCheckpointingArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <span id="file-boundary" className="scroll-mt-20" />
        <h2 className="mb-6 text-2xl font-bold">
          Checkpoint는 추적된 file edit의 snapshot입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Session을 되감는다는 말이 machine 전체를 과거로 돌린다는 뜻은 아닙니다. Claude Code가 direct edit 전에 snapshot한 file
            content와 conversation 지점이 복구 대상이고 Bash·database·API·deploy effect는 밖에 남습니다.
          </p>
        </div>
        <TermBreakdown
          title="복구 범위를 정하는 네 대상"
          items={[
            {
              term: "Snapshot",
              description: "Direct file edit 전에 저장한 이전 content입니다.",
              example: "auth.ts 수정 전 bytes를 보존합니다.",
              boundary: "Git commit이나 disk 전체 snapshot이 아닙니다.",
            },
            {
              term: "Rewind",
              description: "선택한 conversation 지점과 추적 file을 복원합니다.",
              example: "잘못된 auth condition edit를 되돌립니다.",
              boundary: "외부 process의 모든 변경을 되돌리지 않습니다.",
            },
            {
              term: "Local side effect",
              description:
                "Bash·subagent·manual editor가 만든 별도 변화입니다.",
              example: "Formatter가 여러 file을 다시 씁니다.",
              boundary: "Checkpoint coverage를 작은 시험으로 확인해야 합니다.",
            },
            {
              term: "Remote effect",
              description:
                "Database·API·deploy처럼 machine 밖에 남는 상태입니다.",
              example: "Migration이나 ticket 생성입니다.",
              boundary: "독립 transaction·receipt·compensation이 필요합니다.",
            },
          ]}
        />
        <CheckpointBoundaryViz />
        <ContentBoundary article="claude-code-checkpointing" />
      </section>
      <section id="coverage" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Recoverable effect는 file effect와 tracked path의 교집합입니다
        </h2>
        <ExplainedFormula
          question="어떤 effect가 checkpoint rewind만으로 복구되나요?"
          idea={
            <p>
              Effect 전체에서 file change이면서 direct edit tracker가 기록한
              것만 recoverable set에 남깁니다.
            </p>
          }
          formula={String.raw`R=E_{file}\cap T_{direct},\quad E_{remote}\cap R=\varnothing`}
          annotatedFormula={String.raw`\begin{aligned}R&=\underbrace{E_{file}\cap T_{direct}}_{\text{file effect 중 tracker가 기록한 것}}\\E_{remote}\cap R&=\underbrace{\varnothing}_{\text{remote effect는 rewind 밖}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`E_{file}\cap T_{direct}`,
              annotation: [
                "모든 file change가 아니라",
                "direct tracker와 겹친 것만 선택",
              ],
            },
            {
              expression: String.raw`E_{remote}\cap R`,
              annotation: [
                "Database·API effect와",
                "checkpoint 복구 집합 비교",
              ],
            },
            {
              expression: String.raw`=\varnothing`,
              annotation: [
                "Remote effect는 없다고 보고",
                "별도 rollback을 요구",
              ],
            },
          ]}
          terms={[
            {
              symbol: "R",
              name: "Recoverable set",
              description: "Checkpoint만으로 복원할 수 있는 effect입니다.",
            },
            {
              symbol: "E_{file}",
              name: "File effects",
              description: "Session 동안 발생한 모든 file content 변화입니다.",
            },
            {
              symbol: "T_{direct}",
              name: "Direct-edit trace",
              description:
                "Claude Code가 snapshot으로 추적한 direct edit입니다.",
            },
            {
              symbol: "E_{remote}",
              name: "Remote effects",
              description:
                "Database·API·deploy·message처럼 외부에 남은 변화입니다.",
            },
          ]}
          assumptions={[
            "현재 session에서 direct edit snapshot이 존재합니다.",
            "Symlink·hardlink·외부 editor 경계는 별도 시험합니다.",
            "Remote system은 operation receipt와 rollback 방법을 제공합니다.",
          ]}
          interpretation="Bash formatter가 만든 file이나 API deployment는 E_file 또는 E_remote에 있어도 T_direct와 겹치지 않으므로 R에 들어가지 않습니다."
        />
      </section>
      <section id="recovery-plan" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Effect 종류마다 다른 rollback owner를 둡니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ul>
            <li>Direct edit: checkpoint와 diff로 복원합니다.</li>
            <li>
              Bash가 만든 local file: command log·Git·backup으로 복원합니다.
            </li>
            <li>
              Database/API: transaction, stable operation ID, status lookup과
              compensation을 사용합니다.
            </li>
            <li>
              Destructive action 전: target·approval·rollback receipt를 먼저
              고정합니다.
            </li>
          </ul>
        </div>
      </section>
      <section id="paper-claude-checkpointing" className="scroll-mt-20">
        <div className="not-prose">
          <CitationBlock
            source="Anthropic — Checkpointing"
            citeKey={1}
            href="https://code.claude.com/docs/en/checkpointing"
          >
            문제: Agent의 file edit를 빠르게 되돌리되 복구 범위를 과장하지
            않아야 합니다. 기여: 공식 문서는 session checkpoint·rewind와
            제외되는 Bash·external effect·link 경계를 설명합니다. 전제: 현재
            client·동일 session·지원 direct edit path입니다. 근거 범위: 제품이
            snapshot하는 file change입니다. 하지 않는 주장: checkpoint가
            Git·database transaction·distributed rollback·exactly-once effect를
            보장한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
