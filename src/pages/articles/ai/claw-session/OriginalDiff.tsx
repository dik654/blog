export default function OriginalDiff() {
  return (
    <section id="original-diff" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">원본 Claude Code 와의 차이</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          claw 의 session 은 <strong>in-memory <code>Session</code> struct + ConversationRuntime + fork/merge</strong><br />
          원본은 <strong>jsonl transcript 영속 + <code>/resume</code> + SessionMemory (LLM 자동 메모리 추출) + bridge/direct-connect/remote 4종 + LLM 자동 naming</strong> = 약 7,500 LOC<br />
          claw 의 fork/merge 는 원본에 없는 <strong>추가 설계</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">본질 차이</h3>
        <div className="overflow-x-auto not-prose my-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">claw (이 글)</th>
                <th className="border border-border px-3 py-2 text-left">원본 Claude Code</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">영속</td>
                <td className="border border-border px-3 py-2">in-memory only — 종료 시 사라짐</td>
                <td className="border border-border px-3 py-2"><code>.claude/sessions/{'{id}'}/transcript.jsonl</code> append-only — <code>sessionStorage.ts</code> 5,105 LOC</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Resume</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>/resume</code> 슬래시 + <code>ResumeConversation.tsx</code> 398 LOC + preview UI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">SessionMemory</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">LLM 자동 메모리 추출 (<code>sessionMemory.ts</code> 495 LOC) — 사용자 선호·프로젝트 사실 다음 세션에 inject</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Session 생성 경로</td>
                <td className="border border-border px-3 py-2">in-memory 단일</td>
                <td className="border border-border px-3 py-2">bridge / direct-connect (WebSocket) / remote ingress / local 4 종</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Auto-naming</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2"><code>generateSessionName.ts</code> — LLM 으로 session 이름 자동 생성</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold">Compact boundary</td>
                <td className="border border-border px-3 py-2"><code>&lt;prior-context&gt;</code> XML 마커</td>
                <td className="border border-border px-3 py-2"><code>createCompactBoundaryMessage()</code> + <code>getMessagesAfterCompactBoundary()</code> — REPL 스크롤백과 압축 대상 분리</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2 font-semibold text-emerald-700 dark:text-emerald-400">Fork / merge</td>
                <td className="border border-border px-3 py-2">parent session 참조 분기, conflict resolution merge</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">없음 — 원본의 <code>runForkedAgent</code> 는 compact 전용 캐시 키 보존이 가까움</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">SessionMemory — claw-compaction 과의 cross-link</h3>
        <p>
          원본의 <code>SessionMemory</code> 는 컴팩션 시스템과 직접 연결<br />
          claw-compaction 글에서 본 <strong>4단 fallback chain 의 1순위 <code>trySessionMemoryCompaction()</code></strong> 가 이 SessionMemory 를 사용<br />
          <code>customInstructions</code> 가 없을 때 — SessionMemory 에 추출된 사실을 base 로 더 빠르게 압축<br />
          claw 는 SessionMemory 자체가 없어 이 fallback 도 없음 — 두 글의 누락이 같은 뿌리
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">claw 가 추가한 설계 — Fork/Merge</h3>
        <p>
          원본에 session fork/merge 라는 1급 컨셉이 없음 (가장 가까운 <code>runForkedAgent</code> 는 compact 의 캐시 키 보존용)<br />
          claw 의 fork/merge 는 <strong>대화 분기 실험 + 결과 통합</strong> 이라는 워크플로우를 명시 — "이 시점 부터 두 가설을 따로 시도해보고 좋은 쪽 채택" 같은 패턴<br />
          PolicyEngine + Recovery 와 결합되면 자율 자동화의 분기 실행 mechanism 이 됨
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">왜 이렇게 갈라졌나</p>
          <p>
            <strong>claw 의 in-memory + fork/merge</strong> — session 을 휘발성 단위로 두고 자동화 layer (PolicyEngine/Recovery) 가 영속을 관리한다는 디자인. fork/merge 라는 새 추상으로 분기 실험 패턴을 1급 시민화
          </p>
          <p className="mt-2">
            <strong>원본의 7,500 LOC</strong> — Claude 가 일상 도구로 쓰이는 전제. transcript 영속 / <code>/resume</code> / SessionMemory 자동 학습 / 다중 채널 (CLI / web / IDE / remote) 통합 / LLM 자동 naming 같은 ergonomics 가 매일 사용 빈도에서 나옴
          </p>
        </div>

      </div>
    </section>
  );
}
