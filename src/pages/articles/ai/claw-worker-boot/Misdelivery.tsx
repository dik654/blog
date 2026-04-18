import MisdeliveryViz from './viz/MisdeliveryViz';

export default function Misdelivery() {
  return (
    <section id="misdelivery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프롬프트 미스딜리버리 탐지 &amp; 복구</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MisdeliveryViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Misdelivery란</h3>
        <p>
          claw-code가 Worker에게 프롬프트를 보냈지만 <strong>Worker가 받지 못한 상황</strong><br />
          원인:<br />
          - pty 버퍼 오버플로 (드물게)<br />
          - Worker가 대기 상태가 아니었음 (race condition)<br />
          - Worker 프로세스가 크래시 직전이었음<br />
          - 터미널 크기 불일치로 프롬프트가 잘림
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">탐지 방법 — 에코백 확인</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-1"><code>send_with_verification(worker, prompt)</code></div>
          <div className="text-xs text-muted-foreground mb-3">프롬프트 전송 후 에코백(echo-back) 확인 — 타임아웃 2초</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">1</span>
              <div>
                <div className="font-medium">프롬프트 전송</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.terminal.write_input(prompt)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">2</span>
              <div>
                <div className="font-medium">100ms 주기로 화면 확인</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>screen.contains(prompt.trim())</code> — 프롬프트 문자열 포함 여부 체크</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-red-600 dark:text-red-400 shrink-0">!</span>
              <div>
                <div className="font-medium">2초 초과 시 실패</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>Err(anyhow!("prompt not echoed back"))</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>에코백(echo-back) 확인</strong>: Worker의 터미널이 입력을 다시 화면에 표시하는 기본 동작<br />
          100ms마다 화면을 확인, 프롬프트 문자열 포함 여부 체크<br />
          2초 내 에코백 없으면 delivery 실패로 판단
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">복구 전략 4단계</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>recover_from_misdelivery(worker, prompt)</code></div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">1</span>
              <div>
                <div className="font-medium">재전송 시도 (지수 백오프 x3)</div>
                <div className="text-xs text-muted-foreground mt-0.5">500ms → 1000ms → 1500ms 대기 후 <code>send_with_verification()</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">2</span>
              <div>
                <div className="font-medium">Enter 키 전송 — Worker 상태 흔들기</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>write_input("\n")</code> — 대화형 Prompt에 걸린 경우 해제</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">3</span>
              <div>
                <div className="font-medium">다시 재전송</div>
                <div className="text-xs text-muted-foreground mt-0.5">Enter 이후 <code>send_with_verification()</code> 1회 시도</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-red-600 dark:text-red-400 shrink-0">4</span>
              <div>
                <div className="font-medium">Worker 재시작 (마지막 수단)</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>restart_worker(worker)</code> — 작업 진행 상태 손실 가능</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계 복구</strong>: 재시도 → Enter 키 → 재시도 → Worker 재시작<br />
          <strong>지수 백오프</strong>: 500ms, 1000ms, 1500ms — 과부하 회피<br />
          Worker 재시작은 마지막 수단 — 작업 진행 상태 손실 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Enter 키 전송의 의미</h3>
        <p>
          Worker가 <strong>대화형 Prompt 대기</strong> 상태에 걸린 경우 Enter가 풀어줌<br />
          예: <code>rm: remove 'file.txt'? </code>같은 y/n Prompt<br />
          Enter는 기본값 수락(또는 거부) — 대화 계속 진행<br />
          주의: Enter가 의도치 않은 동작 유발 가능 — 다음 Prompt에서 감지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">restart_worker() — 워커 재시작</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>restart_worker(worker: &mut Worker)</code></div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-red-600 dark:text-red-400 shrink-0">1</span>
              <div>
                <div className="font-medium">기존 프로세스 종료</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>SIGTERM</code> → 500ms 대기 → <code>SIGKILL</code> (강제)</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-red-50 dark:bg-red-950/30 border-l-2 border-red-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-red-600 dark:text-red-400 shrink-0">2</span>
              <div>
                <div className="font-medium">터미널 핸들 해제 + 상태 초기화</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.terminal = None</code>, <code>worker.status = Idle</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">3</span>
              <div>
                <div className="font-medium">재시작 — Launching 전이 + 프로세스 시작</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>launch_process(&worker.task_config)</code> → 새 <code>(terminal, pid)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 border-l-2 border-green-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-green-600 dark:text-green-400 shrink-0">4</span>
              <div>
                <div className="font-medium">Trust 재결정 → Ready 전이</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>TrustResolver::resolve()</code> — 캐시되어 있으면 빠름</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>SIGTERM → SIGKILL</strong>: graceful → forceful 종료<br />
          SIGTERM 500ms 대기 후 응답 없으면 SIGKILL — 좀비 프로세스 방지<br />
          재시작은 <strong>Worker 수명의 종료-시작을 빠르게 반복</strong> — 상태 전이 흐름 재사용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Misdelivery 통계 수집</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>MisdeliveryStats</code> — 텔레메트리 기록</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm mb-3">
            <div className="bg-background/60 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs"><code>total_sends</code></div>
              <div className="text-xs text-muted-foreground mt-1">전체 전송 수</div>
            </div>
            <div className="bg-background/60 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs"><code>misdelivery_count</code></div>
              <div className="text-xs text-muted-foreground mt-1">미전달 횟수</div>
            </div>
            <div className="bg-background/60 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs"><code>recovery_success</code></div>
              <div className="text-xs text-muted-foreground mt-1">재시도 성공</div>
            </div>
            <div className="bg-background/60 rounded px-3 py-2 text-center">
              <div className="font-mono text-xs"><code>recovery_restart</code></div>
              <div className="text-xs text-muted-foreground mt-1">재시작 복구</div>
            </div>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded px-3 py-2 text-xs">
            <span className="font-medium">경고 조건:</span> 매 100회 send마다 <code>rate()</code> 체크 — <span className="font-semibold text-amber-700 dark:text-amber-400">5% 초과 시 경고</span> (<code>misdelivery_count / total_sends</code>)
          </div>
        </div>
        <p>
          <strong>5% 이상 발생 시 경고</strong> — 시스템 문제 의심<br />
          정상 환경에서는 misdelivery rate가 1% 미만<br />
          높은 rate는 <strong>환경 문제</strong>(tty 드라이버, 버퍼 크기) 시그널
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">디버깅 지원 — 화면 덤프</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-1">3회 재시도 실패 시 화면 덤프 저장</div>
          <div className="text-xs text-muted-foreground mb-3">경로: <code>.claw/debug/misdelivery-{'{worker.id}'}-{'{timestamp}'}.txt</code></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-background/60 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <div className="font-medium text-xs">prompt 섹션</div>
              <div className="text-xs text-muted-foreground mt-0.5">전송하려던 프롬프트 원문</div>
            </div>
            <div className="bg-background/60 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <div className="font-medium text-xs">screen 섹션</div>
              <div className="text-xs text-muted-foreground mt-0.5"><code>get_screen_text()</code> 결과 — 실패 시점 화면 스냅샷</div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-3">덤프 파일 주기적 정리(7일 이상) — 디스크 오염 방지</div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: pty 기반 자동화의 근본 한계</p>
          <p>
            pty 기반 Worker 제어는 <strong>"사람처럼 터미널을 사용"</strong>하는 접근<br />
            장점: 기존 CLI 도구 재사용, 프로토콜 정의 불필요<br />
            단점: race condition, 타이밍 의존, 화면 출력 형식에 결합
          </p>
          <p className="mt-2">
            misdelivery는 이 한계의 <strong>필연적 증상</strong>:<br />
            - pty는 스트림 기반 — 프롬프트와 응답 경계가 애매<br />
            - 화면은 크기 가변 — 텍스트가 잘리거나 스크롤됨<br />
            - 전송·수신이 비동기 — 타이밍 이슈 내재
          </p>
          <p className="mt-2">
            claw-code의 해법: <strong>"실패 전제, 복구 자동화"</strong><br />
            - 에코백 확인으로 실패 감지<br />
            - 4단계 복구 전략으로 자동 회복<br />
            - 통계 수집으로 체계 문제 조기 포착<br />
            결과적으로 <strong>완벽한 전달은 불가능하지만 안정적 동작은 가능</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
