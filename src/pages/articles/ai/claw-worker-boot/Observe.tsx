import ObserveViz from './viz/ObserveViz';

export default function Observe() {
  return (
    <section id="observe" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">observe() — 화면 텍스트 기반 상태 추론</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ObserveViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 화면 관찰인가</h3>
        <p>
          Worker는 독립 프로세스 — 내부 상태를 직접 조회 불가<br />
          claw-code는 <strong>pty 기반 가상 터미널</strong>로 Worker 화면을 캡처<br />
          캡처된 텍스트를 패턴 매칭하여 "지금 무엇을 하고 있는가" 추론
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">observe() 함수 시그니처</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>observe(worker: &Worker) → Observation</code></div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">1</span>
              <div>
                <div className="font-medium">가상 터미널에서 화면 텍스트 추출</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.terminal.get_screen_text()</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">2</span>
              <div>
                <div className="font-medium">패턴 매칭으로 상태 추론</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>infer_status(&screen)</code></div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">3</span>
              <div>
                <div className="font-medium">Observation 구조체 반환</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>status</code>, <code>last_line</code>, <code>contains_prompt</code>, <code>contains_error</code>, <code>screen_snapshot</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>Observation</code> 구조체: 화면에서 추출한 "상태 스냅샷"<br />
          <code>status</code>는 추론된 상태 — Worker의 실제 status와 비교하여 일치 검증<br />
          불일치 시 <strong>misdelivery</strong> 또는 <strong>crash</strong> 의심
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">패턴 매칭 기반 추론</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-1"><code>infer_status(screen: &str)</code></div>
          <div className="text-xs text-muted-foreground mb-3">마지막 10줄(<code>tail</code>)만 분석 — 이전 히스토리 노이즈 제거</div>
          <div className="space-y-2 text-sm">
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <div className="font-semibold text-xs text-green-700 dark:text-green-400 mb-1">Completed</div>
              <div className="text-xs text-muted-foreground"><code>"Task completed"</code> 또는 <code>"✓ Done"</code> 포함</div>
            </div>
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
              <div className="font-semibold text-xs text-red-700 dark:text-red-400 mb-1">Failed</div>
              <div className="text-xs text-muted-foreground"><code>"Error:"</code>, <code>"Failed to"</code>, <code>"panic:"</code> 포함</div>
            </div>
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
              <div className="font-semibold text-xs text-amber-700 dark:text-amber-400 mb-1">WaitingInput</div>
              <div className="text-xs text-muted-foreground"><code>"Continue? (y/n)"</code>, <code>"Enter your choice"</code>, 또는 <code>$ </code> / <code>&gt; </code> 프롬프트로 끝남</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <div className="font-semibold text-xs text-blue-700 dark:text-blue-400 mb-1">Working</div>
              <div className="text-xs text-muted-foreground"><code>"Running"</code>, <code>"Processing"</code>, <code>"..."</code> 포함</div>
            </div>
            <div className="bg-background/60 border border-border rounded-lg p-3">
              <div className="font-semibold text-xs mb-1">Unknown (폴백)</div>
              <div className="text-xs text-muted-foreground">위 패턴 모두 불일치 — 외부 개입 불필요</div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">pty 화면 캡처 — TerminalHandle</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-3"><code>pub struct TerminalHandle</code></div>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">master: OwnedFd</code>
              <span className="text-xs text-muted-foreground">pty 마스터 디스크립터</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">buffer: VecDeque&lt;u8&gt;</code>
              <span className="text-xs text-muted-foreground">최근 출력 버퍼 (circular)</span>
            </div>
            <div className="flex items-start gap-3 bg-background/60 rounded px-3 py-2">
              <code className="text-xs shrink-0 mt-0.5">size: (u16, u16)</code>
              <span className="text-xs text-muted-foreground">(rows, cols) — 터미널 크기</span>
            </div>
          </div>
          <div className="border-t border-border pt-3 space-y-2 text-sm">
            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <div className="font-medium text-xs"><code>get_screen_text()</code> → <code>String</code></div>
              <div className="text-xs text-muted-foreground mt-0.5">버퍼를 UTF-8로 변환 후 <code>strip_ansi_escapes()</code>로 색상 코드 제거 — 순수 텍스트 반환</div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <div className="font-medium text-xs"><code>write_input(input: &str)</code></div>
              <div className="text-xs text-muted-foreground mt-0.5">마스터 fd에 바이트 쓰기 — Worker의 stdin으로 입력 전송</div>
            </div>
          </div>
        </div>
        <p>
          <strong>pty(pseudo-terminal)</strong>: Unix의 가상 터미널 메커니즘<br />
          마스터/슬레이브 쌍 — 슬레이브는 Worker에 할당, 마스터는 claw-code가 소유<br />
          <code>strip_ansi_escapes()</code>: 색상 코드 등 제거 — 순수 텍스트만 남김
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주기적 관찰 루프</h3>
        <div className="not-prose bg-muted/30 border border-border rounded-lg p-4 my-4">
          <div className="text-sm font-semibold mb-1"><code>observation_loop(worker_id: WorkerId)</code></div>
          <div className="text-xs text-muted-foreground mb-3">500ms 주기 — Completed 또는 Failed 도달 시 루프 종료</div>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">1</span>
              <div>
                <div className="font-medium">레지스트리에서 Worker 조회</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>global_worker_registry().get(&worker_id)</code> — 없으면 루프 종료</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-blue-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 shrink-0">2</span>
              <div>
                <div className="font-medium">관찰 수행 — <code>observe(&worker)</code></div>
                <div className="text-xs text-muted-foreground mt-0.5">화면 텍스트에서 상태 추론</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-950/30 border-l-2 border-amber-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-amber-600 dark:text-amber-400 shrink-0">3</span>
              <div>
                <div className="font-medium">추론 상태 vs 현재 상태 비교</div>
                <div className="text-xs text-muted-foreground mt-0.5">불일치 시 <code>log::warn!</code> 기록</div>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-950/30 border-l-2 border-green-400 rounded-r px-3 py-2">
              <span className="font-mono text-xs text-green-600 dark:text-green-400 shrink-0">4</span>
              <div>
                <div className="font-medium">자동 전이 — Completed / Failed 감지 시</div>
                <div className="text-xs text-muted-foreground mt-0.5"><code>worker.transition(WorkerStatus::Completed | Failed)</code></div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>500ms 주기</strong>: 사람이 화면 변화를 인지할 수 있는 속도<br />
          너무 빈번하면 CPU 낭비, 너무 느리면 상태 전이 지연<br />
          Worker 수가 많으면 <strong>공유 observer 태스크</strong>로 리팩토링 (현재는 worker당 1개)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">관찰 불일치 감지</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">상태 Working + 화면에 프롬프트</div>
            <div className="text-xs text-muted-foreground mb-2">
              <code>worker.status == Working</code> && <code>obs.contains_prompt</code> && <code>!obs.contains_error</code>
            </div>
            <div className="text-xs font-medium">→ 예상보다 일찍 작업 종료 — <code>Completed</code>로 전이</div>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <div className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">상태 Ready + 화면에 에러</div>
            <div className="text-xs text-muted-foreground mb-2">
              <code>worker.status == Ready</code> && <code>obs.contains_error</code>
            </div>
            <div className="text-xs font-medium">→ 시작 직후 크래시 — <code>Failed</code>로 전이</div>
          </div>
        </div>
        <p>
          <strong>불일치는 정보</strong>: claw-code의 예상과 실제 행동이 다름 → 조정 필요<br />
          로그 기록 + 상태 보정 — 자동 복구 메커니즘의 일부<br />
          사람이 보는 화면과 내부 상태를 일치시키는 <strong>자동 동기화 루프</strong>
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 블랙박스 프로세스 관찰의 필요성</p>
          <p>
            Worker는 claw-code가 제어할 수 없는 <strong>블랙박스</strong>:<br />
            - 내부 상태 API 없음 — 직접 조회 불가<br />
            - 예외 종료 가능 — 코어 덤프·SIGKILL 등<br />
            - 사용자 입력 대기 — 언제까지 기다려야 할지 모름
          </p>
          <p className="mt-2">
            observe()는 이 블랙박스를 <strong>화면 텍스트로 간접 관찰</strong><br />
            - 완벽하지 않음 (패턴 매칭 오탐 가능)<br />
            - 하지만 유일한 실용적 방법
          </p>
          <p className="mt-2">
            더 강한 대안: <strong>프로토콜 기반 관찰</strong> (예: Worker가 JSON 상태 보고)<br />
            claw-code가 이를 채택하지 않은 이유: <strong>Worker 수정 불필요</strong> — 임의 CLI 도구를 Worker로 사용 가능<br />
            화면 관찰은 "제로 통합"의 장점 — Vim, tmux, 기존 에이전트 모두 Worker로 활용 가능
          </p>
        </div>

      </div>
    </section>
  );
}
