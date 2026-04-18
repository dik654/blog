import RecipesViz from './viz/RecipesViz';

export default function Recipes() {
  return (
    <section id="recipes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RecoveryRecipe — 시나리오별 복구 절차</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <RecipesViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">RecoveryRecipe 구조</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4 space-y-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">RecoveryRecipe</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>name</code></p>
                <p className="text-xs text-muted-foreground mt-1">String -- 레시피 식별자</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>matches</code></p>
                <p className="text-xs text-muted-foreground mt-1">FailureClassMatcher -- 매칭 조건</p>
              </div>
              <div className="bg-background rounded-md border p-3">
                <p className="font-semibold text-sm"><code>steps</code></p>
                <p className="text-xs text-muted-foreground mt-1">Vec&lt;RecoveryStep&gt; -- 순차 실행 단계</p>
              </div>
            </div>
          </div>
          <div>
            <p className="text-xs font-mono text-muted-foreground mb-2">RecoveryStep -- 8종</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">Rebase</p>
                <p className="text-[11px] text-muted-foreground">VCS 리베이스</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">ResetToHead</p>
                <p className="text-[11px] text-muted-foreground">HEAD로 초기화</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">SendToLLM</p>
                <p className="text-[11px] text-muted-foreground">LLM 호출</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">RerunCi</p>
                <p className="text-[11px] text-muted-foreground">CI 재실행</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">WaitForChange</p>
                <p className="text-[11px] text-muted-foreground">결과 대기</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">DeleteFiles</p>
                <p className="text-[11px] text-muted-foreground">파일 삭제</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">RunCommand</p>
                <p className="text-[11px] text-muted-foreground">셸 실행</p>
              </div>
              <div className="bg-background rounded-md border px-3 py-2 text-center">
                <p className="text-xs font-mono font-semibold">ForkLane</p>
                <p className="text-[11px] text-muted-foreground">레인 분기</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>8종 복구 단계</strong>: VCS 조작, LLM 호출, CI 재실행, 파일 조작<br />
          단계를 조합하여 복잡한 복구 시나리오 구성<br />
          각 단계는 독립적으로 실패 가능 — 다음 단계로 진행 여부 결정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">기본 레시피 — BuildFailed 대응</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs px-2 py-0.5 rounded font-mono">build-failure-retry</span>
            <span className="text-xs text-muted-foreground">matches: BuildFailed</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">SendToLLM</p>
                <p className="text-xs text-muted-foreground mt-0.5">"빌드 실패. 아래 에러를 분석하고 수정:" -- <code>context_from_failure: true</code>로 에러 로그 자동 포함</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">RerunCi</p>
                <p className="text-xs text-muted-foreground mt-0.5">수정 사항 반영 후 CI 파이프라인 재실행</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">WaitForChange</p>
                <p className="text-xs text-muted-foreground mt-0.5">timeout 600초 (10분) -- 빌드 · 테스트 완료 대기</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>3단계 복구</strong>: LLM 수정 → CI 재실행 → 대기<br />
          LLM에게 <code>context_from_failure=true</code>로 빌드 로그 자동 전달<br />
          CI 대기 10분 — 대부분 빌드·테스트 완료되는 시간
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MergeConflict 레시피</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs px-2 py-0.5 rounded font-mono">merge-conflict-rebase</span>
            <span className="text-xs text-muted-foreground">matches: MergeConflict</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">Rebase</p>
                <p className="text-xs text-muted-foreground mt-0.5">target: <code>"main"</code> -- 최신 브랜치 위에 rebase 시도</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">SendToLLM</p>
                <p className="text-xs text-muted-foreground mt-0.5">"rebase 충돌. 충돌 마커를 해결:" -- conflict marker 포함 전체 파일 전달</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">RunCommand</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>git rebase --continue</code> -- LLM 수정 후 rebase 진행</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                <p className="font-semibold text-sm">RerunCi</p>
                <p className="text-xs text-muted-foreground mt-0.5">충돌 해결 후 CI 파이프라인 재실행</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>Git rebase 워크플로우</strong>: rebase 시도 → LLM 충돌 해결 → continue → CI<br />
          LLM에게 충돌 파일 전체 내용 전달 — conflict marker 포함<br />
          rebase 성공하면 linear history 유지 — merge commit 오염 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">TestFailed 레시피</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-xs px-2 py-0.5 rounded font-mono">test-failure-fix</span>
            <span className="text-xs text-muted-foreground">matches: TestFailed</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                <p className="font-semibold text-sm">SendToLLM</p>
                <p className="text-xs text-muted-foreground mt-0.5">"테스트 실패. 원인 파악 후 수정:" -- 실패 테스트 목록 + 로그 자동 포함</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                <p className="font-semibold text-sm">RunCommand</p>
                <p className="text-xs text-muted-foreground mt-0.5"><code>cargo test failing_test_name</code> -- 실패 테스트만 로컬 실행으로 빠른 피드백</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-background rounded-md border p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <p className="font-semibold text-sm">RerunCi</p>
                <p className="text-xs text-muted-foreground mt-0.5">로컬 통과 확인 후 전체 CI 재실행 -- 회귀 방지</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>타겟 테스트 우선 실행</strong>: 전체 CI 대기 전에 빠른 피드백<br />
          로컬에서 실패 테스트만 실행 — 10초 내 결과 확인<br />
          통과 시 전체 CI 실행 — 회귀 없음 확인
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Stalled 레시피 — 무활동 감지</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs px-2 py-0.5 rounded font-mono">stalled-kick</span>
            <span className="text-xs text-muted-foreground">matches: Stalled</span>
          </div>
          <div className="flex items-start gap-3 bg-background rounded-md border p-3">
            <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
            <div>
              <p className="font-semibold text-sm">SendToLLM</p>
              <p className="text-xs text-muted-foreground mt-0.5">"Lane이 1시간 활동 없음. 현재 상태 분석 후 다음 단계 결정:" -- LLM 지능에 위임</p>
            </div>
          </div>
        </div>
        <p>
          <strong>간단한 레시피</strong>: LLM에게 상황 전달만<br />
          LLM이 "현재 상태 보고 다음 할 일" 판단 → 자율적 진행 재개<br />
          복잡한 로직 없음 — LLM 지능에 위임
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">execute() — 레시피 실행</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">RecoveryRecipe::execute(lane) → Result&lt;RecoveryOutcome&gt;</p>
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm">순차 실행 루프</p>
              <p className="text-xs text-muted-foreground mt-1"><code>steps</code>를 인덱스 순회 → 각 step에 <code>step.execute(lane).await</code> 호출</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800 p-3 text-center">
                <p className="text-xs font-mono font-semibold text-green-700 dark:text-green-300">모든 step 성공</p>
                <p className="text-[11px] text-muted-foreground mt-1">→ Succeeded</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md border border-amber-200 dark:border-amber-800 p-3 text-center">
                <p className="text-xs font-mono font-semibold text-amber-700 dark:text-amber-300">2번째+ step 실패</p>
                <p className="text-[11px] text-muted-foreground mt-1">→ PartiallyRecovered</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 rounded-md border border-red-200 dark:border-red-800 p-3 text-center">
                <p className="text-xs font-mono font-semibold text-red-700 dark:text-red-300">첫 step 실패</p>
                <p className="text-[11px] text-muted-foreground mt-1">→ Failed(err)</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>순차 실행</strong>: 한 단계라도 실패하면 중단<br />
          첫 단계 실패 = Failed, 이후 실패 = PartiallyRecovered<br />
          부분 복구는 Lane 상태가 일부 개선됐음을 의미 — 다음 평가에서 재시도
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">단계 실행 — RecoveryStep::execute()</h3>
        <div className="not-prose bg-muted/50 rounded-lg border p-4 my-4">
          <p className="text-xs font-mono text-muted-foreground mb-3">RecoveryStep::execute(lane) → Result&lt;()&gt; -- match 분기</p>
          <div className="space-y-2">
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>Rebase</code></p>
              <p className="text-xs text-muted-foreground mt-1"><code>git_client::rebase_onto(&lane.branch, target)</code> 호출</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>SendToLLM</code></p>
              <p className="text-xs text-muted-foreground mt-1"><code>context_from_failure</code> true이면 실패 컨텍스트 수집 → <code>llm_session::send_and_wait()</code>으로 프롬프트 전송</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>RerunCi</code></p>
              <p className="text-xs text-muted-foreground mt-1"><code>ci_client::trigger_rerun(&lane.branch)</code> -- CI 파이프라인 재트리거</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>WaitForChange</code></p>
              <p className="text-xs text-muted-foreground mt-1">30초 간격 polling -- <code>ci_client::has_new_result()</code> 확인, deadline 초과 시 timeout 에러</p>
            </div>
            <div className="bg-background rounded-md border p-3">
              <p className="font-semibold text-sm"><code>RunCommand</code></p>
              <p className="text-xs text-muted-foreground mt-1"><code>/bin/sh -c</code>로 셸 명령 실행 -- exit code 0 아니면 에러</p>
            </div>
          </div>
        </div>
        <p>
          <strong>각 단계가 독립적 async 함수</strong>: 명확한 책임<br />
          Rebase → git_client 호출, SendToLLM → LLM 세션 재사용<br />
          WaitForChange는 polling 기반 — 더 나은 구현은 webhook 기반
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 복구 레시피 확장성</p>
          <p>
            기본 레시피만으로는 모든 프로젝트 커버 불가 — 사용자 확장 필수
          </p>
          <p className="mt-2">
            <strong>확장 방법 3가지</strong>:<br />
            1. <strong>YAML 레시피</strong>: <code>.claw/recovery-recipes.yaml</code>에 정의<br />
            2. <strong>스크립트 단계</strong>: <code>RunCommand</code>로 임의 셸 실행<br />
            3. <strong>LLM 위임</strong>: <code>SendToLLM</code>으로 복잡한 판단 위임
          </p>
          <p className="mt-2">
            LLM 위임의 가치: <strong>"경험 기반 휴리스틱"</strong>을 코드로 표현 불필요<br />
            - "이 에러 패턴은 보통 X 때문이다"<br />
            - "이 상황에서는 Y 접근이 더 나았다"<br />
            → LLM 프롬프트로 전달하여 판단 맡김
          </p>
          <p className="mt-2">
            claw-code의 레시피는 <strong>"기계적 + 판단적"</strong> 혼합<br />
            Rebase/RunCommand는 기계적, SendToLLM은 판단적<br />
            이 혼합이 "완전 자동 & 지능적" 복구 가능하게 함
          </p>
        </div>

      </div>
    </section>
  );
}
