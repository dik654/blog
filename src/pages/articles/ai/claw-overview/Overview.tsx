import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ArchitectureViz from "./viz/ArchitectureViz";

const TURN_STEPS = [
  ["1 · Admit", "‘로그인 버튼을 누르면 401이 난다. 재현하고 고쳐 달라’는 요청과 현재 workspace를 한 turn의 입력으로 고정합니다."],
  ["2 · Coordinate", "coordinator가 session의 이전 message, model route, permission mode와 workspace root를 모아 provider request를 만듭니다."],
  ["3 · Observe", "provider stream의 text·tool-use delta를 typed event로 조립하되, 아직 어떤 file이나 process도 바꾸지 않습니다."],
  ["4 · Authorize", "tool registry가 이름과 schema를 확인하고 permission layer가 read·edit·test 실행의 허용 범위를 판정합니다."],
  ["5 · Execute", "허용된 도구만 workspace를 읽고 수정하며, 결정론적 login regression test가 patch의 완료 조건을 검사합니다."],
  ["6 · Commit", "tool result와 test receipt를 session에 반영하고, provider의 최종 설명을 diff·검증 근거와 함께 사용자에게 돌려줍니다."],
] as const;

const OWNERSHIP = [
  ["Model", "다음에 필요한 관찰이나 tool call, 최종 설명을 제안합니다.", "권한을 부여하거나 file을 직접 쓰지 않습니다."],
  ["Coordinator / runtime", "turn 순서, session update, provider와 tool 왕복, 종료 상태를 소유합니다.", "provider transport와 각 tool 구현을 대신하지 않습니다."],
  ["Host policy", "tool 이름·인자·workspace·permission을 검사하고 실행을 허용하거나 막습니다.", "model의 ‘필요하다’는 주장을 승인으로 간주하지 않습니다."],
  ["Tools / verifier", "허용된 side effect를 수행하고 diff·exit code·test result를 typed observation으로 반환합니다.", "전체 대화와 최종 답변을 임의로 수정하지 않습니다."],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Claw Code는 모델이 아니라 모델을 일하게 하는 host를 분석하는 글입니다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사용자가 “로그인 버튼을 누르면 401이 납니다. 원인을 찾아 고쳐 주세요”라고 요청했다고 가정하겠습니다. 모델이 곧바로 repository를 바꾸는 것은 아닙니다. 요청을
          session에 넣고 provider의 streaming response에서 tool call을 조립하고 host가 권한을 판정한 뒤에야 file을 읽거나 수정할 수 있습니다.
          마지막에는 같은 실패를 재현하는 test가 통과해야 완료라고 말할 수 있습니다.
        </p>
        <p>
          이 요청을 끝까지 연결하는 프로그램이 agent harness입니다. Harness는 model 바깥에서 context, tool, permission, workspace,
          verification, user-facing response를 묶는 실행 시스템입니다. 그래서 모델이 같아도 결과가 달라집니다. harness가 어떤 관찰을 제공하고 어떤
          side effect를 허용하며 무엇을 완료 조건으로 삼는지가 갈리기 때문입니다.
        </p>
        <p>
          여기서 다루는 Claw Code는 공개 repository에서 개발되는 독립 Rust 재구현입니다. 이 글은 그 project의 분석 snapshot이며, Anthropic
          Claude Code나 OpenAI Codex의 비공개 source·내부 구조를 설명한다고 주장하지 않습니다. 이름이나 겉으로 보이는 behavior가 비슷해도 내부 구현까지
          같다는 결론으로 넓히면 안 됩니다. Repository도 자신을 실험·학습을 위한 museum exhibit에 가깝다고 설명하며 serious production project가
          아니라고 밝힙니다. 또한 Anthropic이 유지·보증하거나 승인한 project도 아닙니다. 공개 README는 검증된 clean-room 절차까지 문서화하지 않으므로 이 글도
          독립 재구현이라는 project 성격을 그보다 강한 개발 공정 주장으로 확대하지 않습니다.
        </p>
      </div>

      <ContentBoundary article="claw-overview" />

      <div className="not-prose my-8 min-w-0">
        <ArchitectureViz />
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>고정 사례의 한 turn을 여섯 경계로 나눕니다</h3>
        <p>
          Turn은 사용자 입력 하나를 받아 필요한 model·tool 왕복을 수행하고 종료 상태를 만드는 작업 단위입니다. 아래 단계는 구현 class 이름을 외우기 위한 목록이
          아닙니다. 문제가 생겼을 때 어느 소유자부터 확인해야 하는지 보여 주는 debugging map입니다.
        </p>
      </div>

      <ol className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {TURN_STEPS.map(([title, body]) => (
          <li key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{title}</h3>
            <p className="mt-2 break-words text-xs leading-5 text-muted-foreground">{body}</p>
          </li>
        ))}
      </ol>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>제안하는 주체와 실행하는 주체를 분리합니다</h3>
        <p>
          Provider stream에서 <code>edit_file</code> 호출이 나왔다는 사실은 실행
          요청이지 실행 권한이 아닙니다. Host는 tool registry에서 실제 tool과
          input schema를 찾고, 현재 permission과 workspace boundary를 통과한
          호출만 executor에 넘깁니다. 거부된 호출은 file을 건드리지 않은 채
          typed error로 session에 돌아가므로 model은 다른 방법을 제안하거나
          사용자 승인을 요청할 수 있습니다.
        </p>
      </div>

      <div className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2">
        {OWNERSHIP.map(([owner, owns, boundary]) => (
          <article key={owner} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <h3 className="break-words text-sm font-semibold">{owner}</h3>
            <dl className="mt-3 grid min-w-0 gap-3 text-xs leading-5 sm:grid-cols-2">
              <div className="min-w-0">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-300">소유</dt>
                <dd className="mt-1 break-words text-muted-foreground">{owns}</dd>
              </div>
              <div className="min-w-0">
                <dt className="font-semibold text-rose-700 dark:text-rose-300">경계</dt>
                <dd className="mt-1 break-words text-muted-foreground">{boundary}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 번의 성공을 일곱 artifact로 추적합니다</h3>
        <p>
          이 사례를 재현하려면 원 요청, session snapshot, provider event stream,
          permission decision, workspace diff, test receipt, 최종 response가 필요합니다.
          마지막 문장만 저장하면 실제로 어떤 file이 바뀌었고 test가 실행됐는지
          검증할 수 없습니다. 반대로 raw stream만 저장하면 사용자가 무엇을
          요청했고 어떤 결과를 받았는지 찾기 어렵습니다. Stable run ID로 두
          종류를 연결하되 token과 source code의 secret은 redaction해야 합니다.
        </p>
      </div>

      <div
        id="paper-claw-repository-snapshot"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Claw Code repository</p>
        <CitationBlock
          source="ultraworkers/claw-code — repository README"
          citeKey={1}
          type="code"
          href="https://github.com/ultraworkers/claw-code/tree/b71afddae100ced324457337925a694686b8fef2"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> 공개 behavior를 독립 harness로 재구현한 project를 읽을 때 source ownership과 운영 적합성을 원 제품과 혼동하기 쉽습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> repository는 Rust workspace를 현재 정본으로, root Python tree를 companion/reference workspace로 구분하고 build·usage·parity 문서의 진입점을 제공합니다.</p>
            <p><strong>전제·조건:</strong> 링크된 commit SHA의 snapshot을 읽는 것이며 file·crate·지원 기능은 이후 commit에서 바뀔 수 있습니다.</p>
            <p><strong>근거 범위:</strong> 이 글이 분석하는 project identity, Rust 정본, Python reference의 위치와 공개 affiliation disclaimer를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Claude Code·Codex의 비공개 내부 구조를 복원했거나, 이름이 같은 surface의 구현까지 같거나, 이 repository가 실서비스용 제품이라는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          분석 결과를 재현하려면 움직이는 <code>main</code> URL이 아니라 위의
          2026년 8월 13일에 확인한 commit SHA를 기준으로 삼아야 합니다.
          Repository의 <code>PARITY.md</code>에
          적힌 과거 checkpoint의 crate·scenario·LOC 숫자도 현재 HEAD의 완결성
          근거로 재사용하지 않습니다. 숫자를 인용해야 한다면 문서의 갱신 시점과
          대상 SHA가 같은지부터 확인합니다.
        </p>
      </div>

      <div
        id="paper-claw-harness-engineering"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">근거 읽기 · Tool guardrail과 approval</p>
        <CitationBlock
          source="OpenAI Developers — Guardrails and human review"
          citeKey={2}
          href="https://developers.openai.com/api/docs/guides/agents/guardrails-approvals"
        >
          <div className="space-y-2 font-sans">
            <p><strong>문제:</strong> Model workflow가 function tool을 제안하더라도 edit·shell command 같은 side effect를 자동으로 실행하면 input·argument·result와 사용자 의도를 별도로 통제하기 어렵습니다.</p>
            <p><strong>핵심 아이디어·기여:</strong> Input·output·tool guardrail은 자동 검사를 맡고, human review는 민감한 action 앞에서 run을 pause해 승인 또는 거부하도록 책임을 분리합니다.</p>
            <p><strong>전제·조건:</strong> OpenAI Agents SDK workflow의 공식 문서이며 어떤 control을 쓸지는 tool risk와 application policy에 맞게 정해야 합니다.</p>
            <p><strong>근거 범위:</strong> Tool call 제안, argument/result validation, side-effect approval을 서로 다른 host control로 읽는 일반 경계를 뒷받침합니다.</p>
            <p><strong>비주장:</strong> Claw Code가 OpenAI Agents SDK를 사용하거나 동일한 guardrail API·precedence를 구현하며, 이 문서가 Claw Code crate map의 근거라는 뜻은 아닙니다.</p>
          </div>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>세부 개념은 정본 글로 이어서 읽습니다</h3>
        <p>
          이 글은 요청 하나가 전체 system을 통과하는 지도를 소유합니다. Session 저장, SSE parser, tool dispatch, permission 규칙, file
          boundary의 세부 구현은 아래 글에서 중복 없이 이어집니다.
        </p>
      </div>

      <nav aria-label="Claw Code 세부 정본" className="not-prose my-7 grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[
          ["Agent framework", "/ai/agent-frameworks", "tool loop와 durable workflow의 일반 개념"],
          ["Session", "/ai/claw-session", "turn commit, resume, compaction의 상태 경계"],
          ["Provider API", "/ai/claw-api-client", "request와 SSE event를 runtime type으로 바꾸는 경계"],
          ["Tool system", "/ai/claw-tool-system", "registry, schema, dispatch와 typed result"],
          ["Permission", "/ai/claw-permissions", "policy decision과 executor enforcement"],
          ["File operations", "/ai/claw-file-ops", "workspace 안에서 읽기·수정·검증하는 경계"],
        ].map(([label, href, note]) => (
          <Link key={href} to={href} className="min-w-0 rounded-lg border border-border/70 bg-background p-4 transition-colors hover:border-primary/50">
            <span className="break-words text-sm font-semibold text-foreground">{label}</span>
            <span className="mt-1 block break-words text-xs leading-5 text-muted-foreground">{note}</span>
          </Link>
        ))}
      </nav>
    </section>
  );
}
