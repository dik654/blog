import PromptCacheViz from './viz/PromptCacheViz';

export default function PromptCache() {
  return (
    <section id="prompt-cache" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PromptCache — 토큰 절약 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PromptCacheViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">프롬프트 캐시란</h3>
        <p>
          Anthropic prompt caching: 긴 prefix(시스템 프롬프트, 도구 목록, 대화 이력)를 <strong>서버 측에 캐시</strong><br />
          후속 요청에서 동일 prefix 재사용 시 <strong>10%</strong> 비용 (일반 input 대비)<br />
          초기 생성 비용은 125% — 3회 이상 재사용해야 이익
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 마킹 전략</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// claw-code가 마크하는 4개 지점
1. 시스템 프롬프트 끝          항상 캐시
2. 도구 목록 끝                항상 캐시
3. 오래된 메시지 구간          선택적 캐시 (4개 제한)
4. 현재 메시지 직전            사용자 설정

// Anthropic 제약: 최대 4개 cache_control 마크 동시 활성`}</pre>
        <p>
          <strong>4 지점 전략</strong>: prefix 계층별 캐시 경계<br />
          Anthropic은 <strong>동시 최대 4개 cache_control</strong> 허용 — 초과 시 오래된 것부터 무효<br />
          앞 2개(system + tools)는 상시 마크, 나머지 2개는 대화 길이에 따라 동적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PromptCache 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct PromptCache {
    // 마지막 캐시 마크 위치 (메시지 인덱스)
    pub last_message_cache_idx: Option<usize>,

    // 캐시 히트 통계
    pub cache_hits: u64,
    pub cache_misses: u64,
    pub tokens_saved: u64,

    // 설정
    pub enabled: bool,
    pub min_prefix_tokens: usize,  // 1024 이하 prefix는 캐시 의미 없음
}

impl PromptCache {
    pub fn should_cache(&self, messages: &[Message]) -> bool {
        if !self.enabled { return false; }

        // 총 prefix 토큰 수가 임계값 이상일 때만
        let prefix_tokens = estimate_prefix_tokens(messages);
        prefix_tokens >= self.min_prefix_tokens
    }
}`}</pre>
        <p>
          <strong>min_prefix_tokens 1024</strong>: Anthropic 최소 요구치 — 이하는 캐시 거부<br />
          짧은 프롬프트는 캐시 오버헤드(125% 생성 비용)가 손해<br />
          <code>enabled</code>: 사용자가 비활성화 가능 — 대부분 활성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">동적 캐시 마크 위치</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl PromptCache {
    pub fn decide_cache_marks(&mut self, messages: &[Message]) -> Vec<usize> {
        let mut marks = Vec::new();

        // 마크 1: 10개 이상의 오래된 메시지가 있으면 그 경계
        if messages.len() >= 15 {
            marks.push(messages.len() - 10);  // 최근 10개 제외 모두 캐시
        }

        // 마크 2: 5개 이상 새 메시지 추가됐으면 추가 경계
        if let Some(last) = self.last_message_cache_idx {
            if messages.len() - last >= 5 {
                marks.push(messages.len() - 2);
                self.last_message_cache_idx = Some(messages.len() - 2);
            }
        } else if messages.len() >= 5 {
            marks.push(messages.len() - 2);
            self.last_message_cache_idx = Some(messages.len() - 2);
        }

        marks
    }
}`}</pre>
        <p>
          <strong>2단계 마크</strong>: 과거 메시지 경계 + 현재 경계<br />
          - 경계 1: <code>N-10</code> (최근 10개 제외) — 오래된 대화 전체 캐시<br />
          - 경계 2: <code>N-2</code> (직전 응답) — 빠른 재개 캐시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 마크 적용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`fn apply_cache_marks(messages: &mut Vec<Value>, marks: &[usize]) {
    for &idx in marks {
        if idx < messages.len() {
            // 해당 메시지의 마지막 content block에 cache_control 추가
            if let Some(content) = messages[idx].get_mut("content") {
                if let Some(arr) = content.as_array_mut() {
                    if let Some(last_block) = arr.last_mut() {
                        last_block["cache_control"] = json!({
                            "type": "ephemeral"
                        });
                    }
                }
            }
        }
    }
}`}</pre>
        <p>
          <strong>cache_control을 마지막 content block에 부착</strong>: Anthropic API 규칙<br />
          같은 메시지의 모든 블록이 <strong>이 마크 위치까지 캐시 경계</strong><br />
          마크된 메시지 이전 전체가 캐시 대상
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 히트율 추적</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 응답의 usage에서 cache 통계 추출
impl PromptCache {
    pub fn record_usage(&mut self, usage: &TokenUsage) {
        self.cache_hits += usage.cache_read_tokens;
        self.cache_misses += usage.cache_creation_tokens;

        // 절약 계산: input 단가 - cache_read 단가 = 90% 절감
        self.tokens_saved += (usage.cache_read_tokens as f64 * 0.9) as u64;
    }

    pub fn hit_rate(&self) -> f64 {
        let total = self.cache_hits + self.cache_misses;
        if total == 0 { return 0.0; }
        self.cache_hits as f64 / total as f64
    }
}`}</pre>
        <p>
          <strong>히트율 추적</strong>: cache_read / (cache_read + cache_creation)<br />
          일반 에이전트 세션 히트율: 60-80% — 같은 시스템 프롬프트·도구 목록 반복 사용<br />
          <code>tokens_saved</code>는 UI에 표시 — 사용자에게 "캐시로 X% 절감" 표시
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 TTL 관리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Anthropic ephemeral 캐시 TTL: 5분
// 5분 이상 지연 시 캐시 무효 — 재생성 필요

pub struct CacheTracker {
    last_request_at: Option<Instant>,
}

impl CacheTracker {
    pub fn is_cache_likely_valid(&self) -> bool {
        if let Some(last) = self.last_request_at {
            last.elapsed() < Duration::from_secs(5 * 60)
        } else {
            false
        }
    }

    pub fn record_request(&mut self) {
        self.last_request_at = Some(Instant::now());
    }
}`}</pre>
        <p>
          <strong>5분 TTL</strong>: 마지막 요청 이후 5분 넘으면 캐시 무효<br />
          장시간 대화 중단 후 재개 시 캐시 재생성 비용 발생<br />
          Anthropic의 1시간 extended cache(beta): 장기 세션에 유용 (추가 비용)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로바이더별 캐시 지원</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로바이더</th>
                <th className="border border-border px-3 py-2 text-left">캐시 지원</th>
                <th className="border border-border px-3 py-2 text-left">제어 방식</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Anthropic</td>
                <td className="border border-border px-3 py-2">명시적</td>
                <td className="border border-border px-3 py-2">cache_control 마크</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">OpenAI (GPT-4o+)</td>
                <td className="border border-border px-3 py-2">자동</td>
                <td className="border border-border px-3 py-2">prefix 1024 tok 이상 자동</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">xAI</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">-</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Azure</td>
                <td className="border border-border px-3 py-2">자동</td>
                <td className="border border-border px-3 py-2">OpenAI와 동일</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          OpenAI는 <strong>자동 캐시</strong> — 클라이언트 제어 불필요<br />
          그 대신 캐시 경계 세밀 조정 불가 — Anthropic 대비 유연성 낮음
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 캐시는 언제 손해인가</p>
          <p>
            prompt caching이 항상 이익은 아님 — <strong>손익분기점</strong> 계산 필요<br />
            기본 손익분기: <strong>3회 재사용</strong> 이상
          </p>
          <p className="mt-2">
            <strong>계산</strong>:<br />
            - 생성 비용: 1.25× (25% 더 비쌈)<br />
            - 재사용 비용: 0.1× (90% 절감)<br />
            - 손익분기: 1.25 = 1 + 0.1 × N → N = 2.5<br />
            → 3회 이상 재사용해야 전체 이익
          </p>
          <p className="mt-2">
            <strong>손해 사례</strong>:<br />
            - 단발성 쿼리 (1회 호출 후 세션 종료)<br />
            - 매번 시스템 프롬프트 변경 (캐시 무효화)<br />
            - 짧은 대화 (토큰 절감 규모 작음)
          </p>
          <p className="mt-2">
            claw-code는 <strong>대화형 에이전트</strong> — 평균 10-50턴 대화 → 캐시 항상 이익<br />
            단, 매 턴마다 tools 배열이 안정되어야 함 — MCP 서버 연결/해제가 빈번하면 무효화 발생
          </p>
        </div>

      </div>
    </section>
  );
}
