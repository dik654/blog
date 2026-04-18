import HookRunnerViz from './viz/HookRunnerViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HookRunner 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <HookRunnerViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">훅 시스템 개요</h3>
        <p>
          훅(hook)은 <strong>도구 실행 전후에 삽입되는 사용자 정의 스크립트</strong><br />
          목적:<br />
          - 보안 검증 확장 (기본 Enforcer로 부족한 정책)<br />
          - 감사 로깅 (외부 시스템에 이력 전송)<br />
          - 자동화 (특정 도구 호출 시 사전 작업)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">HookRunner 구조</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">HookRunner</div>
            <ul className="text-sm space-y-1.5">
              <li><code className="text-xs">pre_tool_hooks</code> — 도구 실행 전 훅 목록</li>
              <li><code className="text-xs">post_tool_hooks</code> — 도구 실행 후 훅 목록</li>
              <li><code className="text-xs">user_prompt_hooks</code> — 사용자 입력 시 훅 목록</li>
              <li><code className="text-xs">default_timeout</code> — 기본 타임아웃</li>
            </ul>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">HookDefinition</div>
            <ul className="text-sm space-y-1.5">
              <li><code className="text-xs">command</code> — 실행할 셸 명령 또는 스크립트 경로</li>
              <li><code className="text-xs">matcher</code> — 이 훅이 적용되는 조건</li>
              <li><code className="text-xs">timeout</code> — 개별 타임아웃 (선택)</li>
              <li><code className="text-xs">env</code> — 추가 환경 변수 맵</li>
            </ul>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">HookMatcher (enum)</div>
            <ul className="text-sm space-y-1.5">
              <li><code className="text-xs">Always</code> — 모든 호출에 적용</li>
              <li><code className="text-xs">Tool(String)</code> — 특정 도구 이름 매칭</li>
              <li><code className="text-xs">ToolPattern(String)</code> — 글롭 패턴 매칭</li>
              <li><code className="text-xs">BashCommand(String)</code> — bash 명령 패턴</li>
            </ul>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 3종류</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">훅 종류</th>
                <th className="border border-border px-3 py-2 text-left">실행 시점</th>
                <th className="border border-border px-3 py-2 text-left">영향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2"><code>PreToolUse</code></td>
                <td className="border border-border px-3 py-2">도구 실행 전</td>
                <td className="border border-border px-3 py-2">Allow/Deny/Prompt 판정 + abort 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>PostToolUse</code></td>
                <td className="border border-border px-3 py-2">도구 실행 후</td>
                <td className="border border-border px-3 py-2">경고·로깅만 (차단 불가)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2"><code>UserPromptSubmit</code></td>
                <td className="border border-border px-3 py-2">사용자 입력 제출 시</td>
                <td className="border border-border px-3 py-2">입력 수정·거부 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">settings.json 설정 예시</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">PreToolUse (2개 등록)</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">check-bash.sh</div>
                <div className="text-xs text-muted-foreground">matcher: <code className="text-xs">{'{"tool": "bash"}'}</code></div>
                <div className="text-xs text-muted-foreground">timeout: 2000ms</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">audit-log.sh</div>
                <div className="text-xs text-muted-foreground">matcher: <code className="text-xs">{'{"always": true}'}</code></div>
                <div className="text-xs text-muted-foreground">timeout: 500ms</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">PostToolUse</div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">git-check.sh</div>
                <div className="text-xs text-muted-foreground">matcher: <code className="text-xs">write_*|edit_*</code> 패턴</div>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
              <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">UserPromptSubmit</div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">sanitize.sh</div>
                <div className="text-xs text-muted-foreground">matcher: <code className="text-xs">{'{"always": true}'}</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>여러 훅 등록 가능</strong>: 배열로 정의, 순서대로 실행<br />
          <code>matcher</code>: 이 훅이 어느 도구에 적용되는지 지정<br />
          <code>timeout_ms</code>: 훅 실행 상한 — 초과 시 스킵
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 프로토콜 — 훅 스크립트 인터페이스</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">stdin 입력 (훅이 받는 JSON)</div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><code className="text-xs shrink-0">event</code><span className="text-muted-foreground">— "PreToolUse"</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0">tool_name</code><span className="text-muted-foreground">— "bash"</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0">tool_input</code><span className="text-muted-foreground">— {"{"}"command": "cargo test"{"}"}</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0">session_id</code><span className="text-muted-foreground">— "sess_abc123"</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0">workspace_root</code><span className="text-muted-foreground">— "/home/user/project"</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0">timestamp</code><span className="text-muted-foreground">— ISO 8601 UTC</span></div>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-3">stdout 응답 (훅이 출력하는 JSON)</div>
            <div className="space-y-2 text-sm">
              <div className="bg-green-50 dark:bg-green-950/30 rounded px-2 py-1"><code className="text-xs">{'{"permission": "allow"}'}</code></div>
              <div className="bg-red-50 dark:bg-red-950/30 rounded px-2 py-1"><code className="text-xs">{'{"permission": "deny", "reason": "..."}'}</code></div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded px-2 py-1"><code className="text-xs">{'{"permission": "prompt", "message": "..."}'}</code></div>
              <div className="bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-1"><code className="text-xs">{'{"permission": "skip"}'}</code> <span className="text-xs text-muted-foreground">— 기본 Enforcer 사용</span></div>
            </div>
          </div>
        </div>
        <p>
          <strong>stdin/stdout JSON 프로토콜</strong>: 언어 무관 — bash, python, ruby 등 어떤 언어로도 작성 가능<br />
          <code>event</code> 필드로 이벤트 종류 구분 — 같은 훅이 여러 이벤트 처리 가능<br />
          <code>skip</code> 응답: 훅이 의도적으로 판정 거부 — 기본 엔진으로 폴백
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 순서 — 파이프라인</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">run_pre_tool 실행 흐름</div>
            <p className="text-sm mb-3">매칭되는 모든 훅을 배열 순서대로 실행 — <strong>first-decision wins</strong></p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-0.5 text-xs font-mono shrink-0">matcher</span>
                <span>매칭 실패 시 해당 훅 건너뜀</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded px-2 py-0.5 text-xs font-mono shrink-0">Deny(r)</span>
                <span>즉시 <code className="text-xs">HookOutcome::Deny</code> 반환 — 도구 차단</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded px-2 py-0.5 text-xs font-mono shrink-0">Prompt(m)</span>
                <span>즉시 <code className="text-xs">HookOutcome::Prompt</code> 반환 — 사용자 확인</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded px-2 py-0.5 text-xs font-mono shrink-0">Allow</span>
                <span>즉시 <code className="text-xs">HookOutcome::Allow</code> 반환 — 도구 허용</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-neutral-100 dark:bg-neutral-800 rounded px-2 py-0.5 text-xs font-mono shrink-0">Skip / Error</span>
                <span>다음 훅으로 <code className="text-xs">continue</code> — 연쇄 진행</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
              모든 훅이 skip 또는 매칭 실패 시 <code className="text-xs">NoDecision</code> — 기본 Enforcer가 단독 판정
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 훅의 사용 사례 4가지</p>
          <p>
            1. <strong>감사 로그</strong>: 모든 도구 호출을 SIEM으로 전송<br />
            2. <strong>커스텀 검증</strong>: "이 bash 명령이 회사 정책에 맞는가" 확인<br />
            3. <strong>자동 사전 작업</strong>: write_file 전에 git pull 실행<br />
            4. <strong>학습 로그</strong>: LLM이 어떤 도구를 언제 호출하는지 분석
          </p>
          <p className="mt-2">
            훅은 <strong>"claw-code 코어를 건드리지 않고 확장"</strong>하는 수단<br />
            코어는 안정적으로 유지, 조직별 요구사항은 훅으로 구현<br />
            이것이 "핵심은 작게, 확장은 풍부하게" 원칙의 실현
          </p>
        </div>

      </div>
    </section>
  );
}
