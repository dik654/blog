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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// compact.rs에서 2차 압축 트리거
let merged = merge_compact_summaries(prev.as_ref(), &new_raw);

let final_summary = if estimate_summary_tokens(&merged) > config.max_summary_tokens {
    SummaryCompressor::new(config.max_summary_tokens).compress(&merged)
} else {
    merged
};`}</pre>
        <p>
          <strong>조건부 호출</strong>: 요약이 예산 이내면 2차 압축 스킵 — 불필요한 정보 손실 방지<br />
          2차 압축은 <strong>Lossy</strong> — 저우선순위 항목이 삭제됨<br />
          1차는 Lossy하지만 2차는 Lossier — "요약의 요약"이 되므로 정보 농도 ↑
        </p>

        {/* ── SummaryCompressor 구조 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">SummaryCompressor 4단계 파이프라인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct SummaryCompressor {
    max_summary_tokens: usize,
    current_work_weight: f32,  // 최근 작업 우선도 (기본 3.0)
    error_weight: f32,         // 오류 이벤트 우선도 (기본 2.5)
    milestone_weight: f32,     // 이정표 우선도 (기본 2.0)
}

impl SummaryCompressor {
    pub fn compress(&self, summary: &Summary) -> Summary {
        // 1) 핵심 사실 추출
        let facts = self.extract_key_facts(summary);

        // 2) 노이즈 제거
        let cleaned = self.remove_noise(facts);

        // 3) 관련도 순위 매기기
        let ranked = self.rank_by_relevance(&summary, cleaned);

        // 4) 토큰 예산 내로 절단
        self.truncate_to_budget(ranked, self.max_summary_tokens)
    }
}`}</pre>
        <p>
          <strong>4단계 파이프라인</strong>: Extract → Clean → Rank → Truncate<br />
          각 단계는 순수 함수 — 입력만 보고 출력 결정, 전역 상태 의존 없음<br />
          가중치 필드(<code>current_work_weight</code> 등)가 우선순위를 조절 — 튜닝 가능
        </p>

        {/* ── 1단계: extract_key_facts ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">1단계 — extract_key_facts()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn extract_key_facts(&self, summary: &Summary) -> Vec<Fact> {
    let mut facts = Vec::new();

    // 파일 경로 (사실 타입: FilePath)
    for path in &summary.file_candidates {
        facts.push(Fact::file_path(path.clone()));
    }

    // 오류 이벤트 (사실 타입: ErrorEvent)
    for ev in &summary.timeline {
        if matches!(ev.kind, EventKind::Error) {
            facts.push(Fact::error(ev.summary.clone(), ev.timestamp));
        }
    }

    // 이정표 (사실 타입: Milestone)
    for ev in &summary.timeline {
        if matches!(ev.kind, EventKind::Milestone) {
            facts.push(Fact::milestone(ev.summary.clone(), ev.timestamp));
        }
    }

    // 진행 중 작업 (사실 타입: CurrentWork)
    if let Some(cw) = &summary.current_work {
        facts.push(Fact::current_work(cw.clone()));
    }

    // 미완료 (사실 타입: Pending)
    for p in &summary.pending_work {
        facts.push(Fact::pending(p.clone()));
    }

    facts
}`}</pre>
        <p>
          <strong>Fact 타입 5가지</strong>: FilePath, ErrorEvent, Milestone, CurrentWork, Pending<br />
          사실 단위로 분해 — 각 사실은 독립적으로 삭제/보존 결정 가능<br />
          <strong>버려지는 정보</strong>: <code>scope</code>, <code>tool_usage</code>, UserMsg/ToolCall 타임라인 이벤트 — 2차 압축에서 제거
        </p>

        {/* ── 2단계: remove_noise ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 — remove_noise()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn remove_noise(&self, mut facts: Vec<Fact>) -> Vec<Fact> {
    // 중복 제거
    facts.sort_by(|a, b| a.text().cmp(b.text()));
    facts.dedup_by(|a, b| a.text() == b.text());

    // 의미 없는 파일 경로 필터
    facts.retain(|f| match f {
        Fact::FilePath(p) => {
            !p.starts_with("/tmp/")
                && !p.to_string_lossy().contains(".cache/")
                && !p.file_name().map_or(false, |n| n.to_string_lossy().starts_with('.'))
        }
        _ => true,
    });

    // 너무 짧은 텍스트 필터 (10자 미만)
    facts.retain(|f| f.text().len() >= 10);

    facts
}`}</pre>
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn rank_by_relevance(&self, summary: &Summary, facts: Vec<Fact>) -> Vec<(Fact, f32)> {
    // 현재 작업 키워드 추출
    let current_keywords: HashSet<String> = summary.current_work
        .as_deref().unwrap_or("")
        .split_whitespace()
        .filter(|w| w.len() >= 4)
        .map(|w| w.to_lowercase())
        .collect();

    facts.into_iter()
        .map(|f| {
            let base_score = match &f {
                Fact::CurrentWork(_) => self.current_work_weight,
                Fact::ErrorEvent(_)  => self.error_weight,
                Fact::Milestone(_)   => self.milestone_weight,
                _ => 1.0,
            };

            // 현재 작업과의 키워드 매칭 보너스
            let text_lower = f.text().to_lowercase();
            let keyword_hits = current_keywords.iter()
                .filter(|kw| text_lower.contains(kw.as_str()))
                .count() as f32;

            let relevance_bonus = keyword_hits * 0.3;
            (f, base_score + relevance_bonus)
        })
        .collect()
}`}</pre>
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn truncate_to_budget(&self, mut ranked: Vec<(Fact, f32)>, budget: usize) -> Summary {
    // 점수 내림차순 정렬
    ranked.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap());

    // 그리디 선택 — 예산 범위 내에서 점수 높은 것부터 포함
    let mut chosen = Vec::new();
    let mut tokens_used = 0usize;

    for (fact, _score) in ranked {
        let cost = estimate_fact_tokens(&fact);
        if tokens_used + cost <= budget {
            chosen.push(fact);
            tokens_used += cost;
        }
    }

    // Summary 구조로 재조립
    Summary::from_facts(chosen)
}`}</pre>
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// budget이 최소 사실 하나도 담을 수 없을 때
if chosen.is_empty() {
    // 폴백: 가장 중요한 사실 하나 + 절단 메시지
    if let Some((top_fact, _)) = ranked.first() {
        return Summary {
            scope: format!("⚠️ 요약 극한 절단: {}", top_fact.text()),
            current_work: None,
            pending_work: vec!["(생략됨 — 예산 부족)".to_string()],
            tool_usage: HashMap::new(),
            file_candidates: vec![],
            timeline: vec![],
        };
    }
}`}</pre>
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
