import UsageTrackerViz from './viz/UsageTrackerViz';
import ModelPricingViz from './viz/ModelPricingViz';

export default function Usage() {
  return (
    <section id="usage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UsageTracker — 토큰 사용량 &amp; 비용 추정</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <UsageTrackerViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">UsageTracker 구조</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">UsageTracker — 다차원 집계</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">전체 집계</p>
              <div className="space-y-2">
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">total_input_tokens</code>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">total_output_tokens</code>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">total_cache_creation_tokens</code>
                </div>
                <div className="bg-muted/50 rounded-lg p-2">
                  <code className="text-xs font-mono">total_cache_read_tokens</code>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">모델별 분리</p>
              <div className="bg-muted/50 rounded-lg p-3">
                <code className="text-xs font-mono">by_model: HashMap&lt;String, ModelUsage&gt;</code>
                <p className="text-xs text-muted-foreground mt-1">ModelUsage 필드:</p>
                <ul className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <li><code className="font-mono">input_tokens</code> / <code className="font-mono">output_tokens</code></li>
                  <li><code className="font-mono">cache_creation</code> / <code className="font-mono">cache_read</code></li>
                  <li><code className="font-mono">request_count</code></li>
                </ul>
                <p className="text-xs text-muted-foreground mt-2">Sonnet 빠른 답변 + Opus 복잡 분석 혼용 시 분리 추적</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">시간대별 집계</p>
              <div className="bg-muted/50 rounded-lg p-3">
                <code className="text-xs font-mono">hourly: VecDeque&lt;HourlyBucket&gt;</code>
                <p className="text-xs text-muted-foreground mt-1">1시간 단위 bucket</p>
                <p className="text-xs text-muted-foreground mt-1">"오전에 주로 작업" 패턴 파악</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">record_usage() — 응답별 기록</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">record_usage(model, ApiUsage) 흐름</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">1</span>
              <div>
                <p className="text-sm font-medium">전체 집계</p>
                <p className="text-xs text-muted-foreground"><code>total_input_tokens += usage.input_tokens</code>, <code>total_output_tokens +=</code></p>
                <p className="text-xs text-muted-foreground">캐시 토큰: <code>unwrap_or(0)</code> — 캐시 미사용 시 0</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">2</span>
              <div>
                <p className="text-sm font-medium">모델별 집계</p>
                <p className="text-xs text-muted-foreground"><code>by_model.entry(model).or_insert_with(Default)</code> — 모델별 동일 필드 누적 + <code>request_count++</code></p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-bold flex items-center justify-center">3</span>
              <div>
                <p className="text-sm font-medium">시간대 bucket 업데이트</p>
                <p className="text-xs text-muted-foreground"><code>update_hourly_bucket(usage)</code> — 1시간 단위 집계</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">비용 계산 — 모델별 단가 테이블</h3>
        <ModelPricingViz />
        <p>
          <strong>모델별 단가</strong>: 하드코딩된 테이블<br />
          Claude: 입력/출력 5배 차이 (output이 비쌈)<br />
          Opus는 Sonnet 대비 5배 가격 — 용도별 선택 중요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">총 비용 계산</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">total_cost_usd()</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                <p className="text-xs">모델별 <code className="font-mono">pricing_table(model)</code> 조회</p>
                <p className="text-xs">각 토큰 타입 × 해당 단가 / 1,000,000</p>
                <p className="text-xs text-muted-foreground">
                  <code className="font-mono">input_tokens × input_per_million</code><br />
                  <code className="font-mono">+ output_tokens × output_per_million</code><br />
                  <code className="font-mono">+ cache_creation × cache_creation_per_million</code><br />
                  <code className="font-mono">+ cache_read × cache_read_per_million</code>
                </p>
                <p className="text-xs text-muted-foreground mt-1">모든 모델 합산 → 총 비용</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">cost_by_category()</p>
              <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <code className="font-mono text-blue-600 dark:text-blue-400">bd.input</code>
                  <span className="text-muted-foreground">입력 토큰 비용</span>
                </div>
                <div className="flex justify-between text-xs">
                  <code className="font-mono text-emerald-600 dark:text-emerald-400">bd.output</code>
                  <span className="text-muted-foreground">출력 토큰 비용</span>
                </div>
                <div className="flex justify-between text-xs">
                  <code className="font-mono text-amber-600 dark:text-amber-400">bd.cache_creation</code>
                  <span className="text-muted-foreground">캐시 생성 비용</span>
                </div>
                <div className="flex justify-between text-xs">
                  <code className="font-mono text-purple-600 dark:text-purple-400">bd.cache_read</code>
                  <span className="text-muted-foreground">캐시 읽기 비용</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">"어디에 돈이 쓰였는지" 분석<br />캐시 적중 ↑ → cache_read 비용 ↑ but 전체 비용 ↓</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">예산 경고 — budget_alert()</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">BudgetAlert + check_budget() 흐름</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">daily_limit_usd: f64</code>
              <p className="text-xs text-muted-foreground">일일 예산 한도 — 예: <code>5.00</code></p>
            </div>
            <div className="bg-muted/50 rounded-lg p-3">
              <code className="text-xs font-mono text-blue-600 dark:text-blue-400">warning_threshold: f64</code>
              <p className="text-xs text-muted-foreground">경고 임계값 — <code>0.8</code> = 80%</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-950/30 rounded-lg p-3">
              <span className="shrink-0 text-xs font-bold text-green-700 dark:text-green-300">ratio &lt; 80%</span>
              <p className="text-xs text-muted-foreground"><code>None</code> 반환 — 정상</p>
            </div>
            <div className="flex items-center gap-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3">
              <span className="shrink-0 text-xs font-bold text-amber-700 dark:text-amber-300">80% ≤ ratio &lt; 100%</span>
              <p className="text-xs text-muted-foreground"><code>BudgetStatus::Warning</code> — UI 경고 표시</p>
            </div>
            <div className="flex items-center gap-3 bg-red-50 dark:bg-red-950/30 rounded-lg p-3">
              <span className="shrink-0 text-xs font-bold text-red-700 dark:text-red-300">ratio ≥ 100%</span>
              <p className="text-xs text-muted-foreground"><code>BudgetStatus::Exceeded</code> — 빨간 경고 + 세션 중단 옵션</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">설정: <code>config.budget.daily_limit_usd: 5.00</code></p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">/cost 슬래시 명령</h3>
        <div className="not-prose bg-card border border-border rounded-xl p-5 my-4">
          <p className="text-sm font-semibold text-muted-foreground mb-3">/cost 출력 — 다층 breakdown</p>
          <div className="bg-muted/50 rounded-xl p-4 font-mono text-xs space-y-3">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">$0.4230</span>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold mb-1">By Category</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-2">
                <span className="text-muted-foreground">Input</span><span>$0.1200</span>
                <span className="text-muted-foreground">Output</span><span>$0.2100</span>
                <span className="text-muted-foreground">Cache gen</span><span>$0.0090</span>
                <span className="text-muted-foreground">Cache rd</span><span>$0.0840</span>
              </div>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold mb-1">By Model</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 pl-2">
                <span className="text-muted-foreground">opus-4-6</span><span>$0.3900</span>
                <span className="text-muted-foreground">sonnet</span><span>$0.0330</span>
              </div>
            </div>
            <div className="border-t border-border pt-2">
              <div className="flex justify-between mb-1">
                <span className="text-muted-foreground">Budget $5.00/day</span>
                <span>8.46%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '8.46%' }} />
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">사용자가 언제든지 현재 비용 확인 가능</p>
        </div>

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
