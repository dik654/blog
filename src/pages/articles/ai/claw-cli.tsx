import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import Overview from './claw-cli/Overview';

const sourceRevision = 'ab44985916cb0d53d2f7a55ea90e0d7be97d4626';

export default function ClawCliArticle() {
  return (
    <>
      <QuestionLead
        question="claw에 인자가 없으면 언제 REPL이 열리고, 언제 stdin 전체가 one-shot prompt가 될까?"
        answer={<>인자가 없고 stdin이 terminal이면 <code>CliAction::Repl</code>이다. stdin이 pipe나 redirect이고 읽은 내용이 비어 있지 않으면 <code>CliAction::Prompt</code>가 된다. 이는 clap derive가 아니라 <code>parse_args()</code>의 수동 <code>while + match</code> 분기다.</>}
      />
      <ConceptPrimer
        items={[
          { term: 'launch parser', meaning: '프로세스를 시작할 때 flag와 subcommand를 CliAction으로 바꾸는 수동 parser.', why: 'REPL 안의 slash command parser와 다른 입력 경계다.' },
          { term: 'line editor', meaning: 'interactive terminal에서 history·completion·multiline key binding을 제공하는 rustyline wrapper.', why: 'pipe 입력과 TTY 입력의 취소·종료 의미가 다르다.' },
          { term: 'stream-safe boundary', meaning: '아직 닫히지 않은 Markdown 구조를 보류하고 안전한 prefix만 ANSI로 렌더하는 경계.', why: 'SSE delta 중간에 heading·code fence가 깨져 보이는 일을 줄인다.' },
          { term: 'convergent init', meaning: '성공한 재실행에서 기존 파일을 보존하고 없는 산출물과 ignore entry만 채우는 성질.', why: '부분 실패 rollback까지 보장하는 transaction과 구분해야 한다.' },
        ]}
      />
      <Misconception>
        launch parser는 <code>clap</code> derive가 아니고 <code>main()</code>도
        <code>#[tokio::main]</code>이 아니다. slash command는
        <code>async_trait</code> 구현체 registry가 아니라 닫힌 enum을 parse한 뒤 큰 match로
        처리한다. 반면 terminal renderer가 <code>pulldown-cmark</code>와
        <code>syntect</code>를 쓴다는 것은 실제 <code>render.rs</code>에서 확인된다.
      </Misconception>
      <Overview />
      <StopRule>
        모든 flag와 slash command를 외우지 않는다. 프로세스 launch, REPL input, slash parse,
        Markdown stream render, repo init이라는 다섯 경계를 구분하고 각 경계의 입력·출력·실패
        의미를 원문에서 찾을 수 있으면 충분하다.
      </StopRule>
      <CapabilityCheck
        items={[
          'no args에서 TTY와 pipe가 각각 Repl과 Prompt가 되는 분기를 설명한다.',
          '--model=value, -p와 unknown flag가 parse_args에서 다른 흐름을 타는 이유를 찾는다.',
          'Ctrl-C가 Cancel과 Exit 중 무엇이 되는지 현재 input buffer와 연결해 설명한다.',
          'SlashCommand enum parse, handle_repl_command match, 반환 bool에 따른 세션 저장을 구분한다.',
          'MarkdownStreamState가 delta 전체를 매번 다시 출력하지 않는 이유를 설명한다.',
          'turn마다 config·plugin·MCP·policy·provider runtime을 다시 조립하고 성공 때만 교체하는 흐름을 설명한다.',
          'fresh init의 dontAsk가 DangerFullAccess로 정규화되는 것을 설명한다.',
          'claw init을 두 번 실행했을 때 네 산출물 상태와 중간 write 실패 뒤 남는 부분 상태를 판단한다.',
        ]}
      />
      <div className="not-prose my-8 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
        <span>선행: <InternalLink slug="claw-overview" learningPathId="ai-claw-core">실행 코드와 검증 경계</InternalLink></span>
        <span>기반: <InternalLink slug="claw-config" learningPathId="ai-claw-infra">CLI가 읽는 설정 우선순위</InternalLink></span>
        <span>도구 발견: <InternalLink slug="claw-mcp" learningPathId="ai-claw-infra">MCP discovery와 runtime tool 등록</InternalLink></span>
        <span>다음: <InternalLink slug="claw-task-team" learningPathId="ai-claw-ops">운영 control record와 실제 실행</InternalLink></span>
      </div>
      <SourceNotes
        sources={[
          { label: 'Claw CLI main.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/main.rs`, note: `검산 revision ${sourceRevision.slice(0, 10)}. 수동 launch parser, CliAction dispatch, REPL loop와 error formatting.` },
          { label: 'Claw CLI input.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/input.rs`, note: 'rustyline completion, multiline binding, TTY fallback, Cancel/Exit 의미.' },
          { label: 'Claw commands/lib.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/commands/src/lib.rs`, note: 'SlashCommand enum, spec 기반 parse·completion·argument validation.' },
          { label: 'Claw CLI render.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/render.rs`, note: 'pulldown-cmark event 처리, syntect highlight, MarkdownStreamState.' },
          { label: 'Claw CLI init.rs', href: `https://github.com/ultraworkers/claw-code/blob/${sourceRevision}/rust/crates/rusty-claude-cli/src/init.rs`, note: '네 init artifact, stack detection, 기존 파일 보존과 gitignore 보강.' },
        ]}
      />
    </>
  );
}
