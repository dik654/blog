import UsageTrackerViz from './viz/UsageTrackerViz';
import ModelPricingViz from './viz/ModelPricingViz';

export default function Usage() {
  return (
    <section id="usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UsageTracker — 토큰 사용량 &amp; 비용 추정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <UsageTrackerViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">UsageTracker 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct UsageTracker {
    pub total_input_tokens: u64,
    pub total_output_tokens: u64,
    pub total_cache_creation_tokens: u64,
    pub total_cache_read_tokens: u64,

    // 모델별 분리
    pub by_model: HashMap<String, ModelUsage>,

    // 시간대별 집계 (1시간 단위 bucket)
    pub hourly: VecDeque<HourlyBucket>,
}

pub struct ModelUsage {
    pub input_tokens: u64,
    pub output_tokens: u64,
    pub cache_creation: u64,
    pub cache_read: u64,
    pub request_count: u64,
}`}</pre>
        <p>
          <strong>다차원 집계</strong>: 전체 + 모델별 + 시간대별<br />
          모델별 분리: 여러 모델 혼용 시 (예: Sonnet 빠른 답변 + Opus 복잡 분석)<br />
          시간대별: "오전에 주로 작업" 같은 패턴 파악
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">record_usage() — 응답별 기록</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl UsageTracker {
    pub fn record_usage(&mut self, model: &str, usage: &ApiUsage) {
        // 전체 집계
        self.total_input_tokens += usage.input_tokens;
        self.total_output_tokens += usage.output_tokens;
        self.total_cache_creation_tokens += usage.cache_creation_input_tokens.unwrap_or(0);
        self.total_cache_read_tokens += usage.cache_read_input_tokens.unwrap_or(0);

        // 모델별 집계
        let entry = self.by_model.entry(model.to_string())
            .or_insert_with(Default::default);
        entry.input_tokens += usage.input_tokens;
        entry.output_tokens += usage.output_tokens;
        entry.cache_creation += usage.cache_creation_input_tokens.unwrap_or(0);
        entry.cache_read += usage.cache_read_input_tokens.unwrap_or(0);
        entry.request_count += 1;

        // 시간대 bucket 업데이트
        self.update_hourly_bucket(usage);
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 계산 — 모델별 단가 테이블</h3>
        <ModelPricingViz />
        <p>
          <strong>모델별 단가</strong>: 하드코딩된 테이블<br />
          Claude: 입력/출력 5배 차이 (output이 비쌈)<br />
          Opus는 Sonnet 대비 5배 가격 — 용도별 선택 중요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">총 비용 계산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`impl UsageTracker {
    pub fn total_cost_usd(&self) -> f64 {
        self.by_model.iter()
            .map(|(model, usage)| {
                let p = pricing_table(model);
                (usage.input_tokens as f64) * p.input_per_million / 1_000_000.0
                    + (usage.output_tokens as f64) * p.output_per_million / 1_000_000.0
                    + (usage.cache_creation as f64) * p.cache_creation_per_million / 1_000_000.0
                    + (usage.cache_read as f64) * p.cache_read_per_million / 1_000_000.0
            })
            .sum()
    }

    pub fn cost_by_category(&self) -> CostBreakdown {
        let mut bd = CostBreakdown::default();
        for (model, usage) in &self.by_model {
            let p = pricing_table(model);
            bd.input += (usage.input_tokens as f64) * p.input_per_million / 1e6;
            bd.output += (usage.output_tokens as f64) * p.output_per_million / 1e6;
            bd.cache_creation += (usage.cache_creation as f64) * p.cache_creation_per_million / 1e6;
            bd.cache_read += (usage.cache_read as f64) * p.cache_read_per_million / 1e6;
        }
        bd
    }
}`}</pre>
        <p>
          <strong>모델별 곱셈 후 합산</strong>: 각 토큰 타입 × 해당 단가<br />
          <code>cost_by_category</code>: 입력/출력/캐시 구분 — "어디에 돈이 쓰였는지" 분석<br />
          캐시 적중 많으면 cache_read 비용 ↑ but 전체 비용 ↓
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">예산 경고 — budget_alert()</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`pub struct BudgetAlert {
    pub daily_limit_usd: f64,
    pub warning_threshold: f64,  // 0.8 = 80%
}

impl UsageTracker {
    pub fn check_budget(&self, alert: &BudgetAlert) -> Option<BudgetStatus> {
        let today_cost = self.cost_last_24h();
        let ratio = today_cost / alert.daily_limit_usd;

        if ratio >= 1.0 {
            Some(BudgetStatus::Exceeded {
                spent: today_cost,
                limit: alert.daily_limit_usd,
            })
        } else if ratio >= alert.warning_threshold {
            Some(BudgetStatus::Warning {
                spent: today_cost,
                limit: alert.daily_limit_usd,
                ratio,
            })
        } else {
            None
        }
    }
}`}</pre>
        <p>
          <strong>예산 초과 경고</strong>: 80% 도달 시 Warning, 100% 도달 시 Exceeded<br />
          사용자 설정 — <code>config.budget.daily_limit_usd: 5.00</code><br />
          초과 시 UI에 빨간 경고 + 세션 중단 옵션
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">/cost 슬래시 명령</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 사용자가 /cost 입력 시 출력
╭─ Cost Breakdown ─────╮
│ Total:       $0.4230 │
│                      │
│ By Category:         │
│   Input:     $0.1200 │
│   Output:    $0.2100 │
│   Cache gen: $0.0090 │
│   Cache rd:  $0.0840 │
│                      │
│ By Model:            │
│   opus-4-6:  $0.3900 │
│   sonnet:    $0.0330 │
│                      │
│ Budget: $5.00/day    │
│   Used:      8.46%   │
│   ▓░░░░░░░░░░░░     │
╰──────────────────────╯`}</pre>
        <p>
          <strong>다층 breakdown</strong>: 카테고리 · 모델 · 예산<br />
          텍스트 progress bar: 시각적 예산 표시<br />
          사용자가 언제든지 현재 비용 확인 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 비용 추정의 한계</p>
          <p>
            UsageTracker의 비용은 <strong>추정</strong>이지 정확한 청구액 아님<br />
            실제 차이 원인:
          </p>
          <p className="mt-2">
            ✗ 단가 테이블이 최신 아닐 수 있음 (Anthropic 가격 변경 시)<br />
            ✗ 할인·크레딧 반영 안 됨 (Pro 플랜, 볼륨 할인)<br />
            ✗ 반올림 오차 누적<br />
            ✗ 토큰 카운트와 실제 과금 토큰 차이 (드물게)
          </p>
          <p className="mt-2">
            실제 청구는 <strong>Anthropic Console</strong>에서 확인<br />
            UsageTracker는 "대략적 가이드" — 상대 비교·예산 관리에 충분<br />
            ±5% 오차 허용 — 대부분 케이스에 문제없음
          </p>
          <p className="mt-2">
            단가 테이블 업데이트: claw-code 버전 업그레이드 시<br />
            사용자가 직접 <code>config.custom_pricing</code>으로 오버라이드 가능
          </p>
        </div>

      </div>
    </section>
  );
}
