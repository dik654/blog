import CliContractViz from './viz/CliContractViz';

const streamStages = [
  ['delta 수신', 'pending 문자열 뒤에 새 조각을 붙인다.'],
  ['안전 경계 탐색', '완성된 block으로 렌더할 수 있는 prefix가 없으면 더 기다린다.'],
  ['prefix render', '안전한 앞부분만 pulldown-cmark event와 ANSI style로 변환한다.'],
  ['나머지 보존', '아직 불완전한 suffix는 pending에 남긴다.'],
  ['flush', 'stream 종료 시 남은 non-empty Markdown을 한 번 렌더한다.'],
] as const;

const initArtifacts = [
  ['.claw/', '없으면 directory 생성, 이미 directory면 skipped'],
  ['.claw.json', '없으면 permissions.defaultMode=dontAsk starter 작성 · runtime에서는 DangerFullAccess'],
  ['.gitignore', 'local settings·sessions·.clawhip entry가 없을 때만 보강'],
  ['CLAUDE.md', '없으면 감지한 language·framework·verification 지침 작성, 있으면 보존'],
] as const;

const turnRuntimeStages = [
  ['Session clone', '현재 conversation state를 다음 runtime의 시작점으로 복제한다.'],
  ['Config reload', '다섯 설정 파일을 다시 읽는다. 본 runtime 조립에서는 오류를 반환한다.'],
  ['Plugin·MCP', 'plugin registry와 hook을 합치고 MCP discovery로 runtime tool을 다시 만든다.'],
  ['Policy·client·executor', '현재 mode와 registry로 policy, provider client, concrete executor를 조립한다.'],
  ['Commit or discard', 'turn 성공이면 runtime을 교체하고 session을 저장한다. 실패면 새 plugin runtime을 종료하고 기존 runtime을 유지한다.'],
] as const;

export default function Overview() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>CLI에는 서로 다른 다섯 입력 경계가 있다</h2>
          <p>
            process argument, interactive line, slash command, model의 Markdown delta, 현재 repository
            상태는 모두 “CLI 입력”처럼 보이지만 parser와 결과 타입이 다르다. 한 단계의 API를 다른
            단계에 옮겨 쓰면 기존 글처럼 존재하지 않는 <code>CliArgs</code>나
            <code>SlashCommand</code> trait를 만들게 된다.
          </p>
          <p>
            아래 실험은 대표 입력을 실제 첫 경계까지 보낸다. launch 입력은
            <code>parse_args()</code>의 <code>CliAction</code>으로, REPL 입력은
            <code>ReadOutcome</code>과 <code>SlashCommand</code>로, init은 artifact status로 읽어라.
          </p>
        </div>
        <CliContractViz />
      </section>

      <section id="launch-parser" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>main은 동기 shell, parse_args는 수동 상태 분기다</h2>
          <p>
            <code>fn main()</code>은 <code>run()</code>을 호출하고 오류를 text 또는 JSON stderr로
            바꾼 뒤 exit 1로 끝낸다. <code>parse_args()</code>는 index를 움직이는
            <code>while</code> 안에서 각 문자열을 match한다. <code>--model value</code>와
            <code>--model=value</code>를 따로 처리하고, flag별 validation 뒤
            <code>CliAction</code>을 만든다.
          </p>
          <p>
            <code>-p</code>는 뒤의 모든 문자열을 즉시 prompt로 합쳐 반환한다. 알려지지 않은
            <code>-</code> 시작 token은 suggestion을 포함한 parse error가 된다. 인자가 없을 때만
            terminal 여부를 본다. pipe에 non-empty text가 있으면 one-shot Prompt, 그렇지 않으면
            Repl이다. 따라서 “인자가 없으면 항상 interactive”가 아니다.
          </p>
          <h3>REPL 객체가 먼저 생기고, 실제 runtime은 turn마다 다시 조립된다</h3>
          <p>
            <code>LiveCli::new()</code>는 system prompt, managed session, 최초 runtime을 만들고
            session을 저장한다. 이후 <code>run_turn()</code>은 같은 runtime을 그대로 호출하지 않는다.
            <code>prepare_turn_runtime()</code>이 기존 session을 복제한 뒤 아래 경계를 다시 지난다.
            이 구조 때문에 config·plugin·MCP 변화가 다음 turn 조립에 반영될 수 있지만, MCP discovery와
            provider construction 실패도 다음 turn 시작을 막을 수 있다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {turnRuntimeStages.map(([label, detail], index) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[3rem_11rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="repl-input" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>LineEditor는 TTY와 pipe에서 다른 계약을 제공한다</h2>
          <p>
            양쪽이 terminal이면 <code>LineEditor</code>는 rustyline을 Emacs mode와 list completion으로
            연다. Ctrl-J와 Shift-Enter는 newline으로 묶여 여러 줄 입력을 만든다. completion helper는
            cursor가 줄 끝에 있고 전체 prefix가 <code>/</code>로 시작할 때만 후보를 반환한다.
          </p>
          <p>
            rustyline의 Ctrl-C는 현재 buffer가 있으면 <code>Cancel</code>, 비어 있으면
            <code>Exit</code>다. EOF도 Exit다. stdin이나 stdout이 terminal이 아니면 rustyline을
            쓰지 않고 한 줄을 읽는 fallback으로 간다. triple-backtick을 별도 종료 규칙으로
            해석하는 parser는 이 파일에 없다.
          </p>
        </div>
      </section>

      <section id="slash-dispatch" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>slash command는 spec으로 parse되고 enum match로 실행된다</h2>
          <p>
            <code>SlashCommand::parse()</code>는 input이 slash command인지 검사하고 command별
            argument를 구조화된 enum variant로 만든다. 예를 들어 model, session, MCP, plugin,
            permission은 각자 optional action이나 target을 가진다. 알 수 없는 이름도
            <code>Unknown(String)</code>으로 표현해 이후 단계가 사용자 오류를 만들 수 있다.
          </p>
          <p>
            REPL은 Submit된 줄이 slash command면 <code>handle_repl_command()</code>에 넘긴다.
            이 함수는 registry에서 async object를 찾지 않고 enum을 직접 match해 CLI method를
            호출한다. 반환 bool은 command가 상태를 바꿔 <code>persist_session()</code>을 호출해야
            하는지 뜻한다. REPL 종료는 slash parse보다 앞선 <code>/exit</code>·<code>/quit</code>
            리터럴 검사와 <code>ReadOutcome::Exit</code>가 결정한다. completion 문자열은 spec과
            runtime session 같은 현재 상태에서 만들지만, 실제 실행 dispatch와는 별도 단계다.
          </p>
        </div>
      </section>

      <section id="render-stream" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>Markdown은 delta가 아니라 안전한 block 단위로 보인다</h2>
          <p>
            <code>TerminalRenderer</code>는 pulldown-cmark event를 heading·list·quote·link·table·code
            상태로 바꾸고 crossterm ANSI style을 붙인다. fenced code는 syntect의
            <code>base16-ocean.dark</code> theme으로 highlight한다. 중첩 fence가 body의 fence에
            일찍 닫히지 않도록 outer fence 길이를 늘리는 전처리도 있다.
          </p>
          <p>
            streaming에서 중요한 것은 <code>MarkdownStreamState</code>다. delta마다 전체 answer를
            다시 렌더하는 대신 아래 순서로 완성된 prefix만 내보낸다.
          </p>
        </div>
        <div className="not-prose my-7 divide-y divide-border border-y border-border">
          {streamStages.map(([label, detail], index) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[3rem_10rem_minmax(0,1fr)] sm:gap-4">
              <span className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</span>
              <p className="text-sm font-bold">{label}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="repo-init" className="mb-16 scroll-mt-20">
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <h2>init은 project를 추측하되 기존 지침을 덮지 않는다</h2>
          <p>
            <code>initialize_repo()</code>는 네 artifact를 순서대로 처리하고 각각
            <code>Created</code>, <code>Updated</code>, <code>Skipped</code>를 기록한다.
            package.json·tsconfig·Cargo.toml·pyproject 같은 marker는 CLAUDE.md의 detected stack과
            verification 문장을 만드는 데 쓰인다.
          </p>
        </div>
        <div className="not-prose my-7 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          {initArtifacts.map(([name, detail], index) => (
            <div key={name} className="min-w-0 bg-background p-4">
              <p className="font-mono text-[10px] font-bold text-muted-foreground">{String(index + 1).padStart(2, '0')}</p>
              <code className="mt-2 block break-words text-xs font-bold">{name}</code>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p>
            기존 <code>.claw.json</code>과 <code>CLAUDE.md</code>는 내용이 오래됐더라도 자동 갱신하지
            않는다. 반면 <code>.gitignore</code>는 필요한 comment와 세 entry가 빠졌다면 기존 줄을
            유지한 채 append하고 Updated가 된다. 이것이 idempotent라는 말의 정확한 범위다.
          </p>
          <h3>새 project의 starter permission은 가장 강한 mode다</h3>
          <p>
            fresh init이 쓰는 <code>dontAsk</code>는 이름만 보면 “질문하지 않되 제한적으로 실행”처럼
            보일 수 있다. config projection에서는 <code>DangerFullAccess</code>로 정규화된다.
            생성 직후 사용자는 <code>.claw.json</code>을 검토해 의도한 mode로 낮춰야 한다.
            init 완료 메시지가 permission safety review를 대신하지 않는다.
          </p>
          <h3>순서대로 쓸 뿐 transaction으로 묶지는 않는다</h3>
          <p>
            네 artifact는 atomic transaction이나 rollback 없이 차례대로 작성된다. 예를 들어
            <code>.claw/</code>와 <code>.claw.json</code>을 만든 뒤 <code>.gitignore</code> 쓰기가
            실패하면 앞의 두 산출물은 남는다. 다음 실행은 이들을 Skipped로 보고 나머지를 계속할 수
            있지만, 이것은 첫 실행이 원자적이었다는 뜻이 아니다. 또한
            <code>write_file_if_missing()</code>은 <code>exists()</code>만 보므로 기대한 file 위치에
            directory가 있어도 “이미 존재”로 건너뛴다. 성공한 재실행의 수렴성과 부분 실패의
            복구 가능성을 구분해야 한다.
          </p>
        </div>
      </section>
    </>
  );
}
