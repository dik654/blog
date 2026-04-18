import ForkViz from './viz/ForkViz';
import ForkRewindFlowViz from './viz/ForkRewindFlowViz';

export default function ForkCompaction() {
  return (
    <section id="fork-compaction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">세션 포크 &amp; 컴팩션</h2>
      <ForkRewindFlowViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ForkViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 포크가 필요한가</h3>
        <p>
          LLM 에이전트는 종종 "시도해봐야 아는" 경로에 직면<br />
          - A 접근법 시도 → 실패 → B 접근법 시도<br />
          - 이미 30턴 진행한 대화에서 2가지 후보를 병렬 탐색<br />
          <strong>포크 없이는</strong> 실패한 시도가 세션에 쌓여 컨텍스트 오염 발생
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border-2 border-red-500/30 bg-red-50 dark:bg-red-950/20 p-4">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2">포크 없이 — 오염 발생</p>
            <div className="text-xs space-y-1">
              <p className="font-mono text-muted-foreground">[msg1, ..., msg30, <span className="text-red-600 dark:text-red-400">시도A실패</span>, "취소하고 다시...", 시도B성공]</p>
              <p className="text-muted-foreground mt-2">시도A 흔적이 LLM 컨텍스트에 남아 판단에 영향</p>
            </div>
          </div>
          <div className="rounded-lg border-2 border-green-500/30 bg-green-50 dark:bg-green-950/20 p-4">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2">포크 사용 — 격리</p>
            <div className="text-xs space-y-1">
              <p><span className="font-semibold">parent:</span> <span className="font-mono text-muted-foreground">[msg1, ..., msg30]</span></p>
              <p><span className="font-semibold">fork_A:</span> <span className="font-mono text-muted-foreground">[...msg30, <span className="text-red-600 dark:text-red-400">시도A실패</span>]</span></p>
              <p><span className="font-semibold">fork_B:</span> <span className="font-mono text-muted-foreground">[...msg30, <span className="text-green-600 dark:text-green-400">시도B성공</span>]</span></p>
              <p className="text-muted-foreground mt-2">A와 B 격리 — 성공한 B만 부모로 병합</p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">fork_session() 구현</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">fork_session(parent_id)</code> — 3단계</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">1</span>
                <div><p className="text-xs font-semibold">새 세션 ID 생성</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">SessionId::new()</code> — UUID v4</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">2</span>
                <div><p className="text-xs font-semibold">전체 상태 복제</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">parent.clone()</code> — messages, tool_calls, token_usage 모두 복사. O(n) 선형 시간, 단 1회 비용</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">3</span>
                <div><p className="text-xs font-semibold">레지스트리 등록</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">sessions.insert(new_id, forked)</code> — 부모 세션은 불변 유지, 후속 fork 가능</p></div>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">포크 수명 주기</h3>
        <div className="not-prose my-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border-2 border-green-500/50 bg-green-50 dark:bg-green-950/20 p-4">
              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Active</p>
              <p className="text-xs text-muted-foreground mt-1">포크 진행 중 — 대화 계속</p>
            </div>
            <div className="rounded-lg border-2 border-gray-400/50 bg-gray-50 dark:bg-gray-950/20 p-4">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Abandoned</p>
              <p className="text-xs text-muted-foreground mt-1">포크 포기 — 메모리 제거 대상</p>
              <p className="text-[11px] text-muted-foreground mt-1">GC: 10분 후 삭제</p>
            </div>
            <div className="rounded-lg border-2 border-blue-500/50 bg-blue-50 dark:bg-blue-950/20 p-4">
              <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">Merged</p>
              <p className="text-xs text-muted-foreground mt-1">부모로 병합 완료 — 제거 대상</p>
              <p className="text-[11px] text-muted-foreground mt-1">GC: 즉시 삭제 가능</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">Active에서만 Merged/Abandoned로 전이 가능 — 최종 상태에서 되돌릴 수 없음. <code className="text-[11px]">collect_garbage()</code>가 주기적으로 수행</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">merge_fork() — 포크를 부모로 반영</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3"><code className="text-xs">merge_fork(fork_id)</code> — 차분 병합</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">1</span>
                <div><p className="text-xs font-semibold">증분 추출</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">fork.messages[parent_len..]</code> — 부모 이후 추가된 메시지만</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">2</span>
                <div><p className="text-xs font-semibold">부모에 차분 적용</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">messages.extend(delta)</code> + <code className="text-[11px]">token_usage.accumulate_from()</code></p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">3</span>
                <div><p className="text-xs font-semibold">Merged로 전이</p><p className="text-[11px] text-muted-foreground"><code className="text-[11px]">mark_merged(fork_id)</code> — GC 대상</p></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Fork 시점의 메시지 개수(<code className="text-[11px]">parent_len</code>)를 경계로 slice 분리. 포크 전체가 아닌 증분만 적용
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">포크와 컴팩션의 상호작용</h3>
        <div className="not-prose my-4">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-3">포크 + 컴팩션 흐름</p>
            <div className="space-y-2">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">1</span>
                <div><p className="text-xs"><code className="text-[11px]">fork_session(parent_id)</code> — 포크 생성</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 shrink-0 mt-0.5">2</span>
                <div><p className="text-xs"><code className="text-[11px]">run_turn()</code> 반복 — 포크 안에서 탐색 진행</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-amber-50 dark:bg-amber-950/30 p-2">
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">3</span>
                <div><p className="text-xs"><code className="text-[11px]">should_compact()</code> → <code className="text-[11px]">compact_session()</code> — 포크도 독립 컴팩션</p></div>
              </div>
              <div className="flex items-start gap-2 rounded bg-green-50 dark:bg-green-950/30 p-2">
                <span className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0 mt-0.5">4</span>
                <div><p className="text-xs"><code className="text-[11px]">merge_fork(fork_id)</code> — 성공 시 부모로 병합</p></div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              포크가 길어져도 토큰 예산 초과 없이 탐색 가능. 병합 시 포크의 현재 메시지 배열(압축됐을 수 있음)이 부모로 들어감
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">포크 ↔ 컴팩션 상호작용 — 주의사항</h3>
        <p>
          <strong>위험 1</strong>: 부모 세션이 포크 이후에 컴팩션되면, 병합 시 메시지 인덱스 불일치<br />
          → <code>merge_fork()</code>는 병합 전 <strong>부모의 메시지 수가 fork 시점과 동일한지 검증</strong>
        </p>
        <div className="not-prose my-4 space-y-3">
          <div className="rounded-lg border bg-card p-4">
            <p className="text-sm font-semibold mb-2"><code className="text-xs">ForkCheckpoint</code> — 부모 변경 감지</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">session_id</code>
                <p className="text-[11px] text-muted-foreground mt-1">부모 세션 ID</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">message_count</code>
                <p className="text-[11px] text-muted-foreground mt-1">포크 시점 메시지 수</p>
              </div>
              <div className="rounded border bg-muted/50 p-2 text-center">
                <code className="text-xs">hash</code>
                <p className="text-[11px] text-muted-foreground mt-1">메시지 배열 해시</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-2 border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 p-4">
            <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2">병합 시 검증</p>
            <p className="text-xs">
              <code className="text-[11px]">parent.messages.len() != checkpoint.message_count</code> → <code className="text-[11px]">"parent diverged since fork"</code> 에러
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              부모가 변경됐으면 사용자 개입 필요 — "모르는 사이에 상태가 덮어씌워지는" 사고 방지
            </p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Git과의 개념적 유사성</p>
          <p>
            Session fork ≈ <code>git branch</code><br />
            merge_fork ≈ <code>git merge</code><br />
            Abandoned ≈ 삭제된 브랜치<br />
            fork_checkpoint ≈ merge base
          </p>
          <p className="mt-2">
            차이점: Git은 파일 기반, Session은 메시지 배열 기반<br />
            Git의 충돌 해소(3-way merge)에 해당하는 것이 <strong>parent diverged 에러</strong><br />
            claw-code는 자동 해소 대신 "사용자 개입 요구" — 대화 의미의 충돌은 기계적으로 풀 수 없음
          </p>
          <p className="mt-2">
            이 패턴은 LLM 에이전트에서 흔치 않음 — 대부분의 프레임워크는 선형 세션만 지원<br />
            Fork는 <strong>"가설 탐색 능력"</strong>을 제공하는 강력한 기능
          </p>
        </div>

      </div>
    </section>
  );
}
