import PrePostFlowViz from './viz/PrePostFlowViz';

export default function PrePost() {
  return (
    <section id="pre-post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PreToolUse / PostToolUse 흐름</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PrePostFlowViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">도구 호출 흐름 속 훅 위치</h3>
        <p>
          훅 위치는 위 다이어그램 참조 — Permission Enforcer 체크 직후 Pre 훅, 도구 실행 직후 Post 훅<br />
          Pre 훅은 <strong>도구 실행 차단 가능</strong> — abort·deny 시 실행 스킵<br />
          Post 훅은 <strong>경고·로깅만</strong> — 이미 실행됐으므로 되돌릴 수 없음<br />
          Pre는 보안 게이트, Post는 감사 로그 — 역할 분리 명확
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pre-tool 훅 실제 예시 — rm 차단</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3">no-rm.sh — rm 명령 차단 훅</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">1</span>
                <div>stdin에서 JSON 읽기 — <code className="text-xs">INPUT=$(cat)</code>으로 전체 입력 캡처, <code className="text-xs">jq -r '.tool_name'</code>으로 도구 이름 추출</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">2</span>
                <div>도구가 <code className="text-xs">bash</code>인지 확인 후 명령 문자열에서 <code className="text-xs">grep -qE "\brm\b"</code>로 rm 패턴 탐지 (<code className="text-xs">-q</code> silent, <code className="text-xs">-E</code> 확장 regex)</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">deny</span>
                <div>매칭 시 <code className="text-xs">{'{"permission": "deny", "reason": "rm 명령 금지"}'}</code> 출력 후 <code className="text-xs">exit 0</code></div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">skip</span>
                <div>해당 없음 시 <code className="text-xs">{'{"permission":"skip"}'}</code> — 다른 훅 또는 기본 Enforcer에 위임</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Post-tool 훅 예시 — git status 경고</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">git-dirty.sh — write/edit 후 git 변경 파일 수 경고</div>
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">1</span>
                <div>도구 이름 확인 — <code className="text-xs">write_file</code> 또는 <code className="text-xs">edit_file</code>인지 분기</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">2</span>
                <div><code className="text-xs">workspace_root</code>로 이동 후 <code className="text-xs">git status --porcelain | wc -l</code>로 변경 파일 수 집계</div>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">warn</span>
                <div>20개 초과 시 <code className="text-xs">[warning] N files modified</code> 출력 — 사용자 터미널에 표시</div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border text-sm text-muted-foreground">
              Post 훅은 JSON 프로토콜 불필요 — stdout 텍스트가 경고로 표시. <code className="text-xs">exit 0</code> 필수 (비정상 종료 시 "hook failed" 로그)
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Pre 훅 실행 코드</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">execute_hook — 5단계 실행 파이프라인</div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">1</span>
                <div><strong>JSON 입력 준비</strong> — <code className="text-xs">event</code>, <code className="text-xs">tool_name</code>, <code className="text-xs">tool_input</code>, <code className="text-xs">session_id</code>, <code className="text-xs">workspace_root</code>, <code className="text-xs">timestamp</code> 조합</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">2</span>
                <div><strong>서브프로세스 생성</strong> — <code className="text-xs">/bin/sh -c hook.command</code>로 실행, <code className="text-xs">stdin/stdout/stderr</code> 파이프 연결, 환경 변수 주입</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">3</span>
                <div><strong>stdin 전송</strong> — payload JSON 바이트 기록 후 <code className="text-xs">shutdown()</code>으로 EOF 전송</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">4</span>
                <div><strong>타임아웃 적용</strong> — <code className="text-xs">tokio::time::timeout</code>으로 감싸서 <code className="text-xs">hook.timeout</code> 또는 <code className="text-xs">default_timeout</code> 초과 시 중단</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">5</span>
                <div><strong>stdout JSON 파싱</strong> — <code className="text-xs">serde_json::from_slice</code>로 응답 파싱, 실패 시 <code className="text-xs">skip</code> 기본값</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>/bin/sh -c</code>: 셸 명령 문자열 실행 — 경로/인자 분리 불필요<br />
          파싱 실패 시 <code>skip</code> 기본값 — 훅 버그가 시스템 차단으로 이어지지 않음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">타임아웃 기본값 &amp; 실패 처리</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-center">
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">2000ms</div>
                <div className="text-xs text-muted-foreground mt-1"><code className="text-xs">DEFAULT_HOOK_TIMEOUT</code></div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-center">
                <div className="text-lg font-bold text-red-600 dark:text-red-400">kill</div>
                <div className="text-xs text-muted-foreground mt-1">초과 시 프로세스 강제 종료</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-center">
                <div className="text-lg font-bold text-amber-600 dark:text-amber-400">Error</div>
                <div className="text-xs text-muted-foreground mt-1"><code className="text-xs">skip</code>과 동일 취급 — 다음 훅으로</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>기본 2초</strong>: 훅은 경량이어야 함 — 무거운 연산 금지<br />
          2초 초과 시 훅 프로세스 강제 종료 + Error 응답<br />
          Error는 <code>skip</code>과 같이 취급 — 다음 훅으로
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 중 세션 차단</h3>
        <p>
          훅이 실행되는 동안 <strong>세션 진행 차단</strong> — LLM 응답이 blocking되지 않도록 빠른 응답 필수<br />
          Pre 훅: 2초 지연 → LLM이 도구 실행 응답 기다리는 동안 추가 지연<br />
          Post 훅: 실행 결과 돌아오기 전 2초 지연<br />
          → 훅이 많으면 체감 응답 속도 저하 — <strong>훅 개수 최소화 권장</strong>
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Pre 훅의 남용 위험</p>
          <p>
            Pre 훅에 복잡한 로직을 넣으면 <strong>매 도구 호출마다 2초 지연</strong><br />
            예: 50턴 대화, 도구 호출 평균 3개 = 150회 훅 실행 = 5분 지연
          </p>
          <p className="mt-2">
            <strong>훅 작성 가이드라인</strong>:<br />
            - Pre 훅은 &lt;500ms 응답 보장<br />
            - 복잡한 판정은 Policy에 표현 (정적)<br />
            - 네트워크 호출 금지 (타임아웃 위험)<br />
            - DB 조회는 캐시 사용 필수
          </p>
          <p className="mt-2">
            <strong>Post 훅은 상대적으로 자유</strong>: 경고만 출력, 지연은 UI에만 영향<br />
            그럼에도 100ms 이내 권장 — 사용자 대기 최소화<br />
            무거운 작업은 훅 내부에서 백그라운드 프로세스 spawn 후 즉시 return
          </p>
        </div>

      </div>
    </section>
  );
}
