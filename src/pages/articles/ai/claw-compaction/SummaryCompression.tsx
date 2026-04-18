import SummaryCompressorViz from './viz/SummaryCompressorViz';
import HeuristicFilterViz from './viz/HeuristicFilterViz';

export default function SummaryCompression() {
  return (
    <section id="summary-compression" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SummaryCompressor — 2차 압축 보조 레이어</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SummaryCompressorViz />
      </div>
      <HeuristicFilterViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 왜 2차 압축이 필요한가 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">2차 압축의 역할</h3>
        <p>
          1차 압축(<code>compact.rs</code>)은 <strong>메시지 → 요약</strong> 변환<br />
          2차 압축(<code>summary_compression.rs</code>, 300 LOC)은 <strong>요약 → 더 짧은 요약</strong> 변환<br />
          호출 조건: 연쇄 압축으로 요약 자체가 커져 <code>max_summary_tokens</code> 초과 시 자동 실행
        </p>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="text-xs font-mono text-muted-foreground mb-2">compact.rs — 2차 압축 트리거</div>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 font-mono text-xs text-muted-foreground mt-0.5">1.</span>
                <span className="text-muted-foreground"><code className="text-xs">merge_compact_summaries()</code>로 이전+새 요약 병합</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <span className="shrink-0 font-mono text-xs text-muted-foreground mt-0.5">2.</span>
                <span className="text-muted-foreground"><code className="text-xs">estimate_summary_tokens(&merged)</code> &gt; <code className="text-xs">config.max_summary_tokens</code> 확인</span>
              </div>
              <div className="flex items-start gap-2 text-sm ml-4">
                <span className="shrink-0 text-xs text-green-600 dark:text-green-400 mt-0.5">초과 시</span>
                <span className="text-muted-foreground"><code className="text-xs">SummaryCompressor::new().compress(&merged)</code> 실행</span>
              </div>
              <div className="flex items-start gap-2 text-sm ml-4">
                <span className="shrink-0 text-xs text-muted-foreground mt-0.5">이내 시</span>
                <span className="text-muted-foreground"><code className="text-xs">merged</code> 그대로 사용 — 불필요한 정보 손실 방지</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>조건부 호출</strong>: 요약이 예산 이내면 2차 압축 스킵 — 불필요한 정보 손실 방지<br />
          2차 압축은 <strong>Lossy</strong> — 저우선순위 항목이 삭제됨<br />
          1차는 Lossy하지만 2차는 Lossier — "요약의 요약"이 되므로 정보 농도 ↑
        </p>

        {/* ── SummaryCompressor 구조 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">SummaryCompressor 4단계 파이프라인</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4 mb-3">
            <div className="font-semibold text-sm mb-3">SummaryCompressor 구조체 + 가중치</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">max_summary_tokens</div>
                <p className="text-xs text-muted-foreground mt-1">요약 최대 토큰</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">current_work_weight</div>
                <p className="text-xs text-muted-foreground mt-1">기본 3.0</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">error_weight</div>
                <p className="text-xs text-muted-foreground mt-1">기본 2.5</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold">milestone_weight</div>
                <p className="text-xs text-muted-foreground mt-1">기본 2.0</p>
              </div>
            </div>
            <div className="font-semibold text-sm mb-2">compress() — 4단계 파이프라인</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                  <span className="text-xs font-semibold">Extract</span>
                </div>
                <p className="text-xs text-muted-foreground">핵심 사실 추출</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-xs font-semibold">Clean</span>
                </div>
                <p className="text-xs text-muted-foreground">노이즈 제거</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                  <span className="text-xs font-semibold">Rank</span>
                </div>
                <p className="text-xs text-muted-foreground">관련도 순위</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
                  <span className="text-xs font-semibold">Truncate</span>
                </div>
                <p className="text-xs text-muted-foreground">예산 내 절단</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계 파이프라인</strong>: Extract → Clean → Rank → Truncate<br />
          각 단계는 순수 함수 — 입력만 보고 출력 결정, 전역 상태 의존 없음<br />
          가중치 필드(<code>current_work_weight</code> 등)가 우선순위를 조절 — 튜닝 가능
        </p>

        {/* ── 1단계: extract_key_facts ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — extract_key_facts()</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">extract_key_facts(summary) → Vec&lt;Fact&gt;</span>
            </div>
            <div className="font-semibold text-xs text-muted-foreground mb-2">Fact 타입 5가지 — Summary에서 추출</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold text-blue-600 dark:text-blue-400">FilePath</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">summary.file_candidates</code>에서 추출</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold text-red-600 dark:text-red-400">ErrorEvent</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">timeline</code>에서 <code className="text-xs">EventKind::Error</code> 필터</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold text-green-600 dark:text-green-400">Milestone</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">timeline</code>에서 <code className="text-xs">EventKind::Milestone</code> 필터</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold text-purple-600 dark:text-purple-400">CurrentWork</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">summary.current_work</code> (있을 때만)</p>
              </div>
              <div className="bg-background border border-border rounded p-2.5">
                <div className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">Pending</div>
                <p className="text-xs text-muted-foreground mt-1"><code className="text-xs">summary.pending_work</code> 각 항목</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>Fact 타입 5가지</strong>: FilePath, ErrorEvent, Milestone, CurrentWork, Pending<br />
          사실 단위로 분해 — 각 사실은 독립적으로 삭제/보존 결정 가능<br />
          <strong>버려지는 정보</strong>: <code>scope</code>, <code>tool_usage</code>, UserMsg/ToolCall 타임라인 이벤트 — 2차 압축에서 제거
        </p>

        {/* ── 2단계: remove_noise ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — remove_noise()</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">remove_noise(facts) → Vec&lt;Fact&gt;</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background border border-border rounded p-3">
                <div className="text-xs font-semibold mb-1">1. 중복 제거</div>
                <p className="text-xs text-muted-foreground">
                  <code className="text-xs">sort_by()</code> + <code className="text-xs">dedup_by()</code><br />
                  같은 텍스트의 사실 → 1회로
                </p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="text-xs font-semibold mb-1">2. 임시 파일 필터</div>
                <p className="text-xs text-muted-foreground">
                  <code className="text-xs">/tmp/</code>, <code className="text-xs">.cache/</code>, dotfile 제외<br />
                  장기 맥락과 무관한 경로
                </p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="text-xs font-semibold mb-1">3. 짧은 텍스트 필터</div>
                <p className="text-xs text-muted-foreground">
                  10자 미만 제거<br />
                  의미 추출 어려운 항목
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>3가지 노이즈 제거</strong>:<br />
          1. <strong>중복</strong>: 같은 파일 여러 번 언급 → 1회로<br />
          2. <strong>임시 파일</strong>: <code>/tmp/</code>, <code>.cache/</code>, dotfile → 장기 맥락 아님<br />
          3. <strong>짧은 텍스트</strong>: 10자 미만 → 의미 추출 어려움
        </p>
        <p>
          <code>dedup_by()</code>는 <strong>정렬된 벡터에서만 작동</strong> — 선행 <code>sort_by()</code> 필수<br />
          <code>retain()</code>은 술어가 true인 요소만 보존 — 인플레이스 필터링
        </p>

        {/* ── 3단계: rank_by_relevance ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">3단계 — rank_by_relevance()</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">rank_by_relevance(summary, facts) → Vec&lt;(Fact, f32)&gt;</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-background border border-border rounded p-3">
                <div className="text-xs font-semibold mb-2">타입별 기본 가중치</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="font-mono text-purple-600 dark:text-purple-400">CurrentWork</span><span className="font-semibold">3.0</span></div>
                  <div className="flex justify-between"><span className="font-mono text-red-600 dark:text-red-400">ErrorEvent</span><span className="font-semibold">2.5</span></div>
                  <div className="flex justify-between"><span className="font-mono text-green-600 dark:text-green-400">Milestone</span><span className="font-semibold">2.0</span></div>
                  <div className="flex justify-between"><span className="font-mono text-muted-foreground">기타</span><span className="font-semibold">1.0</span></div>
                </div>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="text-xs font-semibold mb-2">키워드 매칭 보너스</div>
                <p className="text-xs text-muted-foreground">
                  <code className="text-xs">current_work</code>에서 4자 이상 단어 추출<br />
                  사실 텍스트에 키워드 N개 포함 시 <code className="text-xs">N x 0.3</code> 보너스<br />
                  최종 점수 = 기본 가중치 + 보너스
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>점수 계산</strong>: 타입별 기본 가중치 + 키워드 매칭 보너스<br />
          현재 작업 텍스트에서 4자 이상 단어를 키워드로 추출 — stop-word 같은 짧은 단어 제외<br />
          사실 텍스트에 키워드가 N개 포함되면 <code>N × 0.3</code> 보너스 — 관련도 반영
        </p>
        <p>
          <strong>점수 예시</strong>: 현재 작업 "main.rs 리팩토링"<br />
          - Fact::FilePath("src/main.rs") → 1.0 + 0.3 (main 매칭) = 1.3<br />
          - Fact::ErrorEvent("compile error in main.rs") → 2.5 + 0.3 = 2.8<br />
          - Fact::FilePath("docs/readme.md") → 1.0 + 0 = 1.0 (키워드 없음)
        </p>

        {/* ── 4단계: truncate_to_budget ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">4단계 — truncate_to_budget()</h3>
        <div className="not-prose my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">fn</span>
              <span className="font-semibold text-sm">truncate_to_budget(ranked, budget) → Summary</span>
            </div>
            <div className="space-y-2">
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
                  <span className="text-xs font-semibold">점수 내림차순 정렬</span>
                </div>
                <p className="text-xs text-muted-foreground">높은 점수부터 우선 선택 대상</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
                  <span className="text-xs font-semibold">그리디 선택</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  예산 내에서 점수 높은 것부터 포함 — <code className="text-xs">estimate_fact_tokens()</code>로 비용 계산 후 <code className="text-xs">tokens_used + cost &lt;= budget</code> 확인
                </p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
                  <span className="text-xs font-semibold">Summary 재조립</span>
                </div>
                <p className="text-xs text-muted-foreground"><code className="text-xs">Summary::from_facts(chosen)</code> — 각 Fact 타입이 원래 필드로 재배치</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>그리디 knapsack</strong>: 0/1 knapsack은 NP-hard지만 근사 해법으로 충분<br />
          점수/비용 비율 순으로 정렬하지 않고 <strong>점수 단독 정렬</strong> — 단순성 우선<br />
          토큰 cost는 <code>estimate_fact_tokens()</code>가 계산 — 사실 타입별 평균 길이 사용
        </p>
        <p>
          <strong>재조립 단계</strong>: <code>Summary::from_facts()</code>가 선택된 Fact들을 원래 Summary 구조로 되돌림<br />
          각 Fact 타입이 자기가 속할 필드로 배치 — FilePath → file_candidates, ErrorEvent → timeline 등
        </p>

        {/* ── 극한 상황 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">극한 상황 — 예산 너무 작을 때</h3>
        <div className="not-prose my-4">
          <div className="bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-2">폴백 — 예산이 최소 사실 하나도 담을 수 없을 때</div>
            <div className="bg-background border border-border rounded p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-mono font-semibold">scope</span>
                  <span className="text-muted-foreground ml-1">"요약 극한 절단: " + top-1 사실</span>
                </div>
                <div>
                  <span className="font-mono font-semibold">current_work</span>
                  <span className="text-muted-foreground ml-1">None</span>
                </div>
                <div>
                  <span className="font-mono font-semibold">pending_work</span>
                  <span className="text-muted-foreground ml-1">"(생략됨 -- 예산 부족)"</span>
                </div>
                <div>
                  <span className="font-mono font-semibold">나머지 필드</span>
                  <span className="text-muted-foreground ml-1">전부 빈 값</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>폴백 동작</strong>: 예산이 매우 작아도 최소한 top-1 사실은 보존<br />
          UI/LLM에게 "정보가 절단됨"을 명시 — ⚠️ 기호로 표시<br />
          이 상태에 도달하면 <code>max_summary_tokens</code> 설정값이 부적절 — 설정 재검토 필요
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 결정론적 요약이 LLM 요약보다 나은 이유</p>
          <p>
            대부분의 에이전트 프레임워크는 "LLM을 불러서 요약 생성"하는 방식을 씀<br />
            claw-code는 <strong>Rust 코드로 직접 요약 압축</strong> — LLM 호출 0회
          </p>
          <p className="mt-2">
            <strong>장점</strong>:<br />
            - <strong>비용 0</strong>: 토큰 사용량 없음, 무제한 호출 가능<br />
            - <strong>결정론</strong>: 같은 입력 → 같은 출력, 디버깅 용이<br />
            - <strong>속도</strong>: 수 ms 내 완료, LLM 호출(수 초) 대비 1000배 빠름<br />
            - <strong>오프라인</strong>: 네트워크 없어도 동작
          </p>
          <p className="mt-2">
            <strong>단점</strong>:<br />
            - 자연어 서술 능력 없음 — "이 코드베이스의 목적은 X이다"를 Rust로 작성 불가<br />
            - 의미 기반 중복 제거 불가 — 텍스트 리터럴 매칭만<br />
            - 새로운 도메인(다국어 등) 대응 어려움 — 하드코딩된 필터 수정 필요
          </p>
          <p className="mt-2">
            trade-off 결론: <strong>claw-code는 "작업 메타데이터 압축"이 목적이지 "이야기 요약"이 아님</strong><br />
            파일 경로·오류·이정표 같은 구조화 데이터는 LLM 없이도 충분히 압축 가능<br />
            이것이 claw-code가 추구하는 "effective but simple" 설계의 전형
          </p>
        </div>

      </div>
    </section>
  );
}
