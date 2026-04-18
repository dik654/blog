import SlashCommandViz from './viz/SlashCommandViz';

export default function SlashCommands() {
  return (
    <section id="slash-commands" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">슬래시 명령 시스템</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SlashCommandViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">슬래시 명령 목록</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">명령</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2"><code>/help</code></td><td className="border border-border px-3 py-2">도움말 표시</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/exit, /quit</code></td><td className="border border-border px-3 py-2">세션 종료</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/clear</code></td><td className="border border-border px-3 py-2">화면 지우기 (세션 유지)</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/compact</code></td><td className="border border-border px-3 py-2">수동 컴팩션</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/fork</code></td><td className="border border-border px-3 py-2">현재 세션 포크</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/status</code></td><td className="border border-border px-3 py-2">세션 상태·토큰·비용 표시</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/mode &lt;m&gt;</code></td><td className="border border-border px-3 py-2">권한 모드 변경</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/plan</code></td><td className="border border-border px-3 py-2">Plan 모드 진입</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/mcp</code></td><td className="border border-border px-3 py-2">MCP 서버 관리</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/plugin</code></td><td className="border border-border px-3 py-2">플러그인 관리</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/config</code></td><td className="border border-border px-3 py-2">설정 표시·편집</td></tr>
              <tr><td className="border border-border px-3 py-2"><code>/cost</code></td><td className="border border-border px-3 py-2">누적 비용 표시</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">SlashCommand 트레이트</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">trait SlashCommand</span>
            <span className="text-xs text-muted-foreground ml-2">Send + Sync + async_trait</span>
          </div>
          <div className="divide-y divide-border">
            {[
              { method: 'name()', ret: "&'static str", desc: '명령 이름 (예: "compact")' },
              { method: 'aliases()', ret: "&'static [&str]", desc: '줄임말 — /q = /quit (기본: 빈 배열)' },
              { method: 'description()', ret: "&'static str", desc: '도움말에 표시할 설명' },
              { method: 'execute(args, runtime)', ret: 'Result<SlashResult>', desc: '명령 실행 — runtime 직접 수정 가능' },
            ].map(({ method, ret, desc }) => (
              <div key={method} className="flex items-start gap-3 p-3">
                <code className="flex-shrink-0 text-xs font-semibold text-primary whitespace-nowrap">{method}</code>
                <div>
                  <code className="text-xs text-muted-foreground">→ {ret}</code>
                  <p className="text-sm mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-muted/50 border-t border-border">
            <p className="text-sm"><code className="text-xs">SlashResult::Continue</code> — REPL 계속 | <code className="text-xs">SlashResult::Exit</code> — REPL 종료</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">handle_slash_command() — 디스패처</h3>
        <p>
          알 수 없는 명령은 에러 메시지 + 세션 계속 — 사용자 실수 방지<br />
          실행 에러도 계속 — 명령 실패가 세션 종료로 이어지지 않음
        </p>
        <div className="not-prose my-4 flex flex-col sm:flex-row gap-2">
          {[
            { step: '1', label: '파싱', detail: '/ 제거 후 공백 분리 → cmd_name + args' },
            { step: '2', label: '레지스트리 조회', detail: 'global_slash_registry().find(cmd_name)' },
            { step: '3', label: '실행', detail: 'cmd.execute(args, runtime).await' },
          ].map(({ step, label, detail }, i) => (
            <div key={step} className="flex-1 flex items-start gap-2">
              <div className="bg-muted/50 border border-border rounded-lg p-3 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{step}</span>
                  <span className="font-semibold text-sm">{label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{detail}</p>
              </div>
              {i < 2 && <span className="hidden sm:flex items-center text-muted-foreground self-center">→</span>}
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현 예시 — /compact</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
            <code className="text-sm font-semibold text-primary">/compact</code>
            <span className="text-xs text-muted-foreground">— 현재 세션을 즉시 컴팩션</span>
          </div>
          <div className="p-4 space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">1.</span>
              <span>세션 메시지 수 기록: <code className="text-xs">before = runtime.session.messages.len()</code></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">2.</span>
              <span>컴팩션 실행: <code className="text-xs">compact_session(&session, &compact_config)</code></span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">3.</span>
              <span>결과 출력: <code className="text-xs">"Compacted: 42 messages → 12 (removed 30)"</code></span>
            </div>
            <p className="text-xs text-muted-foreground pt-1">반환: <code className="text-xs">SlashResult::Continue</code> — 세션 계속</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">구현 예시 — /status</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2">
            <code className="text-sm font-semibold text-primary">/status</code>
            <span className="text-xs text-muted-foreground">— 세션 상태·토큰·비용 표시</span>
          </div>
          <div className="p-4">
            <div className="font-mono text-sm bg-zinc-900 text-zinc-100 rounded-lg p-4 leading-relaxed">
              <p>╭── Session Status ──╮</p>
              <p>│ <span className="text-blue-400">ID:</span>       abc-123</p>
              <p>│ <span className="text-blue-400">Messages:</span> 24</p>
              <p>│ <span className="text-blue-400">Duration:</span> 12m 34s</p>
              <p>│</p>
              <p>│ <span className="text-green-400">Tokens:</span></p>
              <p>│   Input:  <span className="text-yellow-300">45.2K</span></p>
              <p>│   Output: <span className="text-yellow-300">12.8K</span></p>
              <p>│   Cached: <span className="text-yellow-300">38.1K</span> (84% saved)</p>
              <p>│</p>
              <p>│ Cost: <span className="text-emerald-400">$0.0342</span></p>
              <p>╰────────────────────╯</p>
            </div>
            <p className="text-sm text-muted-foreground mt-3">
              <code className="text-xs">human_number()</code>로 읽기 쉬운 형식 — "45.2K", "1.5M" 등<br />
              비용 USD 표시 — 사용자 투명성 확보
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">커스텀 슬래시 명령 — 프로젝트 로컬</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">.claw/slash-commands/</span>
            <span className="text-xs text-muted-foreground ml-2">파일 기반 커스텀 명령</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs font-semibold text-muted-foreground">파일명</p>
                <code className="text-sm text-primary">my-command.sh</code>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs font-semibold text-muted-foreground">명령</p>
                <code className="text-sm text-primary">/my-command</code>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs font-semibold text-muted-foreground">인터페이스</p>
                <span className="text-sm">stdin: JSON, stdout: 출력</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              파일명이 곧 명령명 — 프로젝트별 워크플로우 자동화, "팀 공용 명령" 가능
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">슬래시 명령 자동완성</h3>
        <div className="not-prose my-4 bg-muted/30 border border-border rounded-lg overflow-hidden">
          <div className="bg-muted px-4 py-2 border-b border-border">
            <span className="font-mono text-sm font-semibold">SlashCompleter</span>
            <span className="text-xs text-muted-foreground ml-2">rustyline Completer 트레이트 구현</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-center gap-3 bg-background border border-border rounded-lg p-3">
              <div className="font-mono text-sm">
                <span className="text-muted-foreground">&gt; </span>
                <span>/com</span>
                <kbd className="ml-2 px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-700 rounded text-xs">Tab</kbd>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="font-mono text-sm text-primary">/compact</div>
            </div>
            <div className="text-sm space-y-1">
              <p><code className="text-xs">/</code>로 시작하지 않으면 자동완성 비활성화</p>
              <p>접두사 매칭: <code className="text-xs">commands.filter(|c| c.starts_with(prefix))</code></p>
              <p className="text-muted-foreground">사용자 학습 곡선 단축 — 명령 외우지 않아도 사용 가능</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 슬래시 명령의 범용성</p>
          <p>
            슬래시 명령은 Discord, Slack, 많은 채팅 앱의 표준 패턴<br />
            사용자 친숙성이 높아 <strong>학습 부담 적음</strong>
          </p>
          <p className="mt-2">
            대안들과 비교:<br />
            - <strong>별도 CLI</strong>: <code>claw compact</code> — REPL에서 나가야 함<br />
            - <strong>함수 호출</strong>: LLM이 도구로 호출 — 의도치 않은 동작 위험<br />
            - <strong>키바인딩</strong>: Ctrl+K 등 — 기억하기 어려움
          </p>
          <p className="mt-2">
            <strong>슬래시 명령이 이긴 이유</strong>:<br />
            ✓ REPL 맥락 유지<br />
            ✓ 명시적 사용자 의도 (LLM 대신 직접 제어)<br />
            ✓ 자동완성으로 탐색 용이<br />
            ✓ 커스텀 확장 간단 (스크립트 파일)
          </p>
        </div>

      </div>
    </section>
  );
}
