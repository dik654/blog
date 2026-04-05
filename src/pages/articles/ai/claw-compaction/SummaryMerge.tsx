import MergeSummaryViz from './viz/MergeSummaryViz';
import ContinuousMergeViz from './viz/ContinuousMergeViz';

export default function SummaryMerge() {
  return (
    <section id="summary-merge" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">요약 병합 & 연속 압축</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MergeSummaryViz />
      </div>
      <ContinuousMergeViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── 연쇄 압축의 필요성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">연쇄 압축 — 왜 단일 압축으로는 부족한가</h3>
        <p>
          장시간 작업(예: 하루 종일 코드베이스 탐색)에서는 1회 압축으로 부족<br />
          대화 진행 → 압축 → 대화 진행 → 또 압축... 연쇄적으로 발생<br />
          문제: <strong>매 압축마다 이전 요약이 "새 메시지"로 취급되어 다시 요약 대상이 됨</strong> → 정보가 점점 얇아짐
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 순진한 구현 (버그 있음)
1차 압축: 메시지 100개 → 요약 A (3K tok)
          세션 = [요약 A] + 최근 15개

2차 압축: 메시지 115개(요약 A 포함) → 요약 B
          세션 = [요약 B] + 최근 15개
          ❌ 요약 B는 요약 A를 "일반 메시지"로 보고 요약 — 정보 2중 손실`}</pre>
        <p>
          <strong>정답</strong>: 이전 요약(A)을 감지하고 <em>병합</em> — 원본 데이터를 유지하면서 통합<br />
          <code>merge_compact_summaries()</code>가 이 역할 담당
        </p>

        {/* ── 병합 흐름 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">merge_compact_summaries() 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub fn merge_compact_summaries(
    prev: Option<&Summary>,
    new_raw: &Summary,
) -> Summary {
    match prev {
        None => new_raw.clone(),  // 이전 요약 없음 → 그대로 사용
        Some(p) => Summary {
            // scope: 이전과 새 범위를 문장 수준에서 결합
            scope: merge_scope(&p.scope, &new_raw.scope),

            // current_work: 항상 최신 것 우선
            current_work: new_raw.current_work.clone().or(p.current_work.clone()),

            // pending_work: 합집합 (중복 제거)
            pending_work: union_sets(&p.pending_work, &new_raw.pending_work),

            // tool_usage: 호출 횟수 누적
            tool_usage: merge_counters(&p.tool_usage, &new_raw.tool_usage),

            // file_candidates: 합집합
            file_candidates: union_paths(&p.file_candidates, &new_raw.file_candidates),

            // timeline: 시간순 병합 정렬
            timeline: merge_timelines(&p.timeline, &new_raw.timeline),
        },
    }
}`}</pre>
        <p>
          <strong>필드별 병합 전략</strong>:<br />
          - <code>scope</code>: 문자열 결합 (range accumulation)<br />
          - <code>current_work</code>: 최신값 우선 (staleness 방지)<br />
          - <code>pending_work</code>, <code>file_candidates</code>: 집합 연산 (합집합)<br />
          - <code>tool_usage</code>: 카운터 누적 (Read 45 + 30 = 75)<br />
          - <code>timeline</code>: 시간순 정렬 유지하며 병합 (merge sort)
        </p>

        {/* ── 이전 요약 추출 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">이전 요약 추출 — extract_prior_summary()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn extract_prior_summary(messages: &[Message]) -> Option<Summary> {
    // 첫 user 메시지 중 <prior-context>로 시작하는 것 탐지
    for msg in messages {
        if matches!(msg.role, Role::User)
            && msg.content.starts_with("<prior-context>")
            && msg.content.ends_with("</prior-context>")
        {
            return parse_prior_context(&msg.content);
        }
    }
    None
}

fn parse_prior_context(text: &str) -> Option<Summary> {
    // 마크다운 섹션 헤더로 파싱
    let mut summary = Summary::default();

    for section in text.split("## ") {
        let (header, body) = section.split_once('\\n')?;
        match header.trim() {
            "작업 범위"   => summary.scope = body.trim().to_string(),
            "진행 중"    => summary.current_work = Some(body.trim().to_string()),
            "미완료"     => summary.pending_work = parse_bullet_list(body),
            "도구 사용"  => summary.tool_usage = parse_counter_list(body),
            "관련 파일"  => summary.file_candidates = parse_path_list(body),
            "타임라인"   => summary.timeline = parse_timeline(body),
            _ => {}
        }
    }
    Some(summary)
}`}</pre>
        <p>
          <strong>파서 전략</strong>: <code>## </code> 헤더로 섹션 분리 후 각 섹션을 해당 파서로 처리<br />
          <code>split_once('\n')</code>: 첫 줄(헤더)과 나머지(본문) 분리<br />
          포맷이 정확히 고정되어 있어 파서가 단순 — <code>format_compact_summary()</code>의 출력 포맷과 대칭
        </p>

        {/* ── 시간선 병합 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">merge_timelines() — 시간순 병합</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct TimelineEvent {
    pub timestamp: DateTime<Utc>,
    pub kind: EventKind,              // UserMsg | ToolCall | Error | Milestone
    pub summary: String,              // 예: "Edit: main.rs 수정 (245줄)"
}

fn merge_timelines(
    prev: &[TimelineEvent],
    new: &[TimelineEvent],
) -> Vec<TimelineEvent> {
    // Merge sort — 두 정렬된 벡터를 O(n+m)로 병합
    let mut out = Vec::with_capacity(prev.len() + new.len());
    let (mut i, mut j) = (0, 0);
    while i < prev.len() && j < new.len() {
        if prev[i].timestamp <= new[j].timestamp {
            out.push(prev[i].clone()); i += 1;
        } else {
            out.push(new[j].clone());  j += 1;
        }
    }
    out.extend_from_slice(&prev[i..]);
    out.extend_from_slice(&new[j..]);
    out
}`}</pre>
        <p>
          <strong>Merge sort 선택 이유</strong>: 양쪽 입력이 이미 시간순 정렬 → O(n+m) 병합이 정렬(O(n log n))보다 빠름<br />
          <code>TimelineEvent::kind</code>의 4가지 분류: UserMsg(사용자 입력), ToolCall(도구 호출), Error(오류), Milestone(주요 이정표)<br />
          UI는 kind별로 다른 아이콘 렌더링 — 사용자가 대화 흐름을 빠르게 스캔 가능
        </p>

        {/* ── 타임라인 가지치기 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">타임라인 가지치기 — 크기 상한</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`const MAX_TIMELINE_EVENTS: usize = 50;

fn prune_timeline(mut timeline: Vec<TimelineEvent>) -> Vec<TimelineEvent> {
    if timeline.len() <= MAX_TIMELINE_EVENTS { return timeline; }

    // 1) Milestone과 Error는 무조건 보존
    let (must_keep, candidates): (Vec<_>, Vec<_>) = timeline.drain(..)
        .partition(|e| matches!(e.kind, EventKind::Milestone | EventKind::Error));

    // 2) 나머지는 최근 N개만 유지
    let keep_recent = MAX_TIMELINE_EVENTS.saturating_sub(must_keep.len());
    let recent: Vec<_> = candidates.into_iter()
        .rev().take(keep_recent).collect::<Vec<_>>()
        .into_iter().rev().collect();

    // 3) 재병합 & 정렬
    let mut merged = must_keep;
    merged.extend(recent);
    merged.sort_by_key(|e| e.timestamp);
    merged
}`}</pre>
        <p>
          <strong>3단계 가지치기</strong>:<br />
          1. Milestone·Error는 보존 필수 — 중요 이벤트 유실 방지<br />
          2. 나머지는 최근 N개만 유지 — old UserMsg/ToolCall은 희생<br />
          3. 재정렬 — 섞인 순서를 시간순으로 복원
        </p>
        <p>
          <strong>상한 50개</strong>: 너무 크면 요약 토큰 비대, 너무 작으면 맥락 부족 — 경험적 타협점<br />
          대화 100턴 이상에서도 타임라인은 50개 유지 → 요약 토큰 상한 보장
        </p>

        {/* ── scope 병합 전략 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">merge_scope() — 작업 범위 확장</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn merge_scope(prev: &str, new: &str) -> String {
    // 완전 동일 → 그대로
    if prev == new { return prev.to_string(); }

    // new가 prev의 확장 → new만 사용
    if new.contains(prev) { return new.to_string(); }

    // prev가 new의 확장 → prev만 사용
    if prev.contains(new) { return prev.to_string(); }

    // 겹치지 않음 → 문장 결합
    format!("{}; {}", prev, new)
}`}</pre>
        <p>
          <strong>4가지 케이스</strong>:<br />
          1. 동일 범위 → 중복 제거<br />
          2. new가 prev를 포함 → 확장된 범위로 대체<br />
          3. prev가 new를 포함 → 축소 방지, 기존 유지<br />
          4. 교차 없음 → 세미콜론으로 결합 (맥락 확장)
        </p>

        {/* ── 인사이트 ── */}
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 연쇄 압축이 만드는 장기 기억 구조</p>
          <p>
            merge_compact_summaries 덕분에 대화 턴 수가 <strong>무제한</strong>으로 확장 가능<br />
            토큰 예산은 고정이지만, 요약 연쇄로 <strong>"대화 전체의 메타데이터"</strong>를 계속 보유<br />
            실제 사용 사례: 며칠에 걸친 코드 리뷰, 장기 리팩토링, 다단계 디버깅
          </p>
          <p className="mt-2">
            <strong>정보 손실 곡선</strong>:<br />
            - 원본 메시지 텍스트 → <strong>손실</strong> (1차 압축에서 제거)<br />
            - 도구 호출 결과 내용 → <strong>손실</strong> (횟수만 남김)<br />
            - 파일 경로·오류 요약·이정표 → <strong>보존</strong> (구조화 Summary)
          </p>
          <p className="mt-2">
            결과적으로 <strong>"작업의 뼈대"는 남고 "살"은 깎임</strong> — LLM이 전체 흐름을 이해하기에 충분한 수준<br />
            필요시 사용자가 <code>read_file()</code>로 원본 파일을 다시 읽게 하여 세부 복원 가능<br />
            압축된 요약은 <em>인덱스</em>, 원본 파일은 <em>데이터</em> — 두 레이어 구조가 무한 대화를 가능하게 함
          </p>
        </div>

      </div>
    </section>
  );
}
