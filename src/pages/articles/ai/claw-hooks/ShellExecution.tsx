import HookProtocolViz from './viz/HookProtocolViz';

export default function ShellExecution() {
  return (
    <section id="shell-execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">셸 프로세스 실행 &amp; JSON 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <HookProtocolViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">훅 실행 모델 — subprocess</h3>
        <p>
          훅은 <strong>claw-code 메인 프로세스와 별도 서브프로세스</strong>에서 실행<br />
          격리 이점:<br />
          - 훅 버그/크래시가 메인 프로세스에 영향 없음<br />
          - 훅이 무한 루프에 빠져도 타임아웃으로 kill<br />
          - 훅별 환경 변수·작업 디렉토리 독립 설정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 프로토콜 상세 명세</h3>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">stdin 입력 필드</div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">event</code><span className="text-muted-foreground">PreToolUse | PostToolUse | UserPromptSubmit</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">tool_name</code><span className="text-muted-foreground">도구 이름 (Pre/Post만)</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">tool_input</code><span className="text-muted-foreground">도구 입력 원본 JSON</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">tool_output</code><span className="text-muted-foreground">도구 결과 (PostToolUse만)</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">session_id</code><span className="text-muted-foreground">세션 UUID</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">workspace_root</code><span className="text-muted-foreground">프로젝트 절대 경로</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">timestamp</code><span className="text-muted-foreground">ISO 8601 UTC</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-blue-100 dark:bg-blue-900/40 px-1 rounded">user_prompt</code><span className="text-muted-foreground">사용자 메시지 (UserPromptSubmit만)</span></div>
            </div>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-3">stdout 응답 필드</div>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-green-100 dark:bg-green-900/40 px-1 rounded">permission</code><span className="text-muted-foreground">allow | deny | prompt | skip</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-green-100 dark:bg-green-900/40 px-1 rounded">reason</code><span className="text-muted-foreground">deny/prompt 시 사유 (권장)</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-green-100 dark:bg-green-900/40 px-1 rounded">message</code><span className="text-muted-foreground">prompt 시 사용자에게 표시</span></div>
              <div className="flex gap-2"><code className="text-xs shrink-0 bg-green-100 dark:bg-green-900/40 px-1 rounded">modified_input</code><span className="text-muted-foreground">입력 수정 (UserPromptSubmit)</span></div>
            </div>
          </div>
        </div>
        <p>
          <strong>단일 JSON 객체 입출력</strong>: 여러 줄 안 됨 — 스트리밍 없음<br />
          stdin으로 입력 전송 후 EOF(shutdown) — 훅은 EOF 보고 응답 생성<br />
          stdout 첫 줄이 응답 JSON — 나머지 출력은 로그로 기록
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">환경 변수 자동 주입</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-3">훅 프로세스에 자동 설정되는 환경 변수</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                ['CLAW_SESSION_ID', 'sess_abc123', '세션 식별자'],
                ['CLAW_WORKSPACE', '/home/user/project', '프로젝트 루트'],
                ['CLAW_TOOL_NAME', 'bash', '호출된 도구'],
                ['CLAW_EVENT', 'PreToolUse', '이벤트 종류'],
                ['CLAW_VERSION', '0.3.2', 'claw-code 버전'],
                ['CLAW_USER_HOME', '/home/user', '사용자 홈'],
                ['CLAW_PERMISSION_MODE', 'WorkspaceWrite', '현재 권한 모드'],
              ].map(([name, val, desc]) => (
                <div key={name} className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-sm flex items-center gap-2">
                  <code className="text-xs font-semibold shrink-0">{name}</code>
                  <span className="text-xs text-muted-foreground truncate">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p>
          <strong>편의 변수 제공</strong>: stdin JSON을 파싱하지 않고도 기본 정보 사용 가능<br />
          bash 훅에서 <code>$CLAW_TOOL_NAME</code> 참조 — <code>jq</code> 없이 간단 분기<br />
          stdin JSON이 <strong>진실의 원천</strong>, 환경 변수는 편의 복제
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">JSON 파싱 실패 처리</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-3">관용적 파싱 — 3단계 폴백</div>
            <div className="space-y-2">
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-neutral-200 dark:bg-neutral-700 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">0</span>
                <div>빈 출력 시 즉시 <code className="text-xs">HookResponse::Skip</code> 반환</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">1</span>
                <div>전체 stdout를 <code className="text-xs">serde_json::from_str</code>로 파싱 시도</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">2</span>
                <div>실패 시 <strong>첫 줄만</strong> 추출하여 다시 파싱 — 훅이 로그 등 추가 출력한 경우 대응</div>
              </div>
              <div className="flex items-start gap-3 text-sm bg-white dark:bg-neutral-900 rounded p-3">
                <span className="bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded px-2 py-0.5 text-xs font-mono shrink-0 mt-0.5">3</span>
                <div>여전히 실패 시 <code className="text-xs">HookResponse::Skip</code> 최종 폴백 — 훅 버그가 시스템 차단으로 이어지지 않음</div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 개발 도우미 — CLAW_DEBUG 모드</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-3">CLAW_HOOK_DEBUG=1 설정 시 로그 출력 항목</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-sm">
                <span className="text-xs font-mono text-green-600 dark:text-green-400">hook input</span>
                <span className="text-xs text-muted-foreground ml-2">— payload JSON (pretty)</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-sm">
                <span className="text-xs font-mono text-green-600 dark:text-green-400">hook command</span>
                <span className="text-xs text-muted-foreground ml-2">— 실행 명령 문자열</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-sm">
                <span className="text-xs font-mono text-green-600 dark:text-green-400">hook stdout</span>
                <span className="text-xs text-muted-foreground ml-2">— 훅 표준 출력</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-sm">
                <span className="text-xs font-mono text-green-600 dark:text-green-400">hook stderr</span>
                <span className="text-xs text-muted-foreground ml-2">— 훅 에러 출력</span>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-sm sm:col-span-2">
                <span className="text-xs font-mono text-green-600 dark:text-green-400">hook response</span>
                <span className="text-xs text-muted-foreground ml-2">— 파싱된 HookResponse (Debug 출력)</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>디버그 모드</strong>: 훅 입출력 전체를 로그에 기록<br />
          훅 개발/디버깅 시 활성화 — 프로덕션에서는 끔<br />
          로그에 <strong>전체 JSON</strong> 포함 — 민감 데이터 주의
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">훅 실행 성능 프로파일링</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3">HookExecMetric 수집 항목</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-center">
                <div className="text-xs font-mono">hook_name</div>
                <div className="text-xs text-muted-foreground">명령 경로</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-center">
                <div className="text-xs font-mono">event</div>
                <div className="text-xs text-muted-foreground">이벤트 종류</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-center">
                <div className="text-xs font-mono">duration_ms</div>
                <div className="text-xs text-muted-foreground">실행 시간</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded px-3 py-2 text-center">
                <div className="text-xs font-mono">response_type</div>
                <div className="text-xs text-muted-foreground">응답 종류</div>
              </div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 rounded px-3 py-2 text-sm text-center">
              <strong>500ms 초과</strong> 시 <code className="text-xs">log::warn!("slow hook")</code> 경고 출력
            </div>
          </div>
        </div>
        <p>
          누적 통계로 "가장 느린 훅 top 5" 리포트 가능<br />
          메트릭은 텔레메트리로 전송 — 조직 단위 훅 최적화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로세스 정리 — Drop 구현</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-3">impl Drop for HookRunner</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">기본 동작</div>
                <div className="text-xs text-muted-foreground"><code className="text-xs">tokio::process::Child</code>는 Drop 시 자동 kill하지만, 명시적 cleanup이 더 안전</div>
              </div>
              <div className="bg-white dark:bg-neutral-900 rounded p-3 text-sm">
                <div className="font-medium mb-1">명시적 정리</div>
                <div className="text-xs text-muted-foreground"><code className="text-xs">running_hooks.drain(..)</code>으로 실행 중인 모든 훅 핸들을 <code className="text-xs">abort()</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Rust <code>Drop</code> 트레이트로 자원 정리 보장<br />
          HookRunner 소멸 시 모든 훅 프로세스 강제 종료<br />
          세션 종료 시 <strong>좀비 훅 프로세스</strong> 방지
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: JSON vs 구조화된 프로토콜 선택</p>
          <p>
            훅 프로토콜 후보:<br />
            1. <strong>JSON</strong>: 언어 무관, 표준, 도구 많음<br />
            2. <strong>Protobuf/MessagePack</strong>: 바이너리, 작음, 빠름<br />
            3. <strong>환경 변수만</strong>: 간단, 하지만 복잡한 입력 불가<br />
            4. <strong>CLI 인자</strong>: 간단, 하지만 긴 입력 불가
          </p>
          <p className="mt-2">
            claw-code는 <strong>JSON stdin/stdout</strong> 선택 — 이유:<br />
            - Shell에서 <code>jq</code>로 쉽게 파싱<br />
            - 모든 주요 언어에 JSON 라이브러리 존재<br />
            - 디버깅 용이 (사람이 읽을 수 있음)<br />
            - 프로토콜 확장성 — 새 필드 추가 시 기존 훅 호환
          </p>
          <p className="mt-2">
            성능 희생(JSON 파싱 오버헤드)은 훅 실행 전체 비용 대비 무시할 수준 — 올바른 트레이드오프
          </p>
        </div>

      </div>
    </section>
  );
}
