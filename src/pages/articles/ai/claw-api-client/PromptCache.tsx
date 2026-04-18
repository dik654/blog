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
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            4개 캐시 마크 지점 (Anthropic 최대 4개 동시 활성)
          </div>
          <div className="divide-y divide-border">
            <div className="grid grid-cols-[32px_1fr_100px] p-3 items-center">
              <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 rounded-full w-6 h-6 flex items-center justify-center">1</span>
              <span className="text-sm">시스템 프롬프트 끝</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-right">항상 캐시</span>
            </div>
            <div className="grid grid-cols-[32px_1fr_100px] p-3 items-center">
              <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/40 rounded-full w-6 h-6 flex items-center justify-center">2</span>
              <span className="text-sm">도구 목록 끝</span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold text-right">항상 캐시</span>
            </div>
            <div className="grid grid-cols-[32px_1fr_100px] p-3 items-center">
              <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/40 rounded-full w-6 h-6 flex items-center justify-center">3</span>
              <span className="text-sm">오래된 메시지 구간</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold text-right">선택적 (동적)</span>
            </div>
            <div className="grid grid-cols-[32px_1fr_100px] p-3 items-center">
              <span className="text-xs font-bold bg-amber-100 dark:bg-amber-950/40 rounded-full w-6 h-6 flex items-center justify-center">4</span>
              <span className="text-sm">현재 메시지 직전</span>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold text-right">사용자 설정</span>
            </div>
          </div>
        </div>
        <p>
          앞 2개(system + tools)는 상시 마크, 나머지 2개는 대화 길이에 따라 동적<br />
          초과 시 오래된 것부터 무효
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PromptCache 구조</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            PromptCache 필드
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1">위치 추적</div>
                <code className="text-xs">last_message_cache_idx</code>
                <p className="text-xs text-muted-foreground mt-1">Option&lt;usize&gt; — 마지막 캐시 마크 메시지 인덱스</p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1">히트 통계</div>
                <div className="text-xs space-y-1">
                  <div><code>cache_hits</code>: u64</div>
                  <div><code>cache_misses</code>: u64</div>
                  <div><code>tokens_saved</code>: u64</div>
                </div>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold text-muted-foreground mb-1">설정</div>
                <div className="text-xs space-y-1">
                  <div><code>enabled</code>: bool</div>
                  <div><code>min_prefix_tokens</code>: usize <span className="text-muted-foreground">(기본 1024)</span></div>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-muted/40 p-3">
              <div className="text-xs font-semibold mb-1">should_cache(messages) → bool</div>
              <p className="text-xs text-muted-foreground">
                <code>enabled</code> 확인 → prefix 토큰 수 추정 → <code>min_prefix_tokens</code> 이상일 때만 true
              </p>
            </div>
          </div>
        </div>
        <p>
          <strong>min_prefix_tokens 1024</strong>: Anthropic 최소 요구치 — 이하는 캐시 거부<br />
          짧은 프롬프트는 캐시 오버헤드(125% 생성 비용)가 손해
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">동적 캐시 마크 위치</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            decide_cache_marks — 2단계 경계 결정
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            <div className="bg-card p-4">
              <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">경계 1: 과거 메시지</div>
              <div className="bg-muted/40 rounded p-2 text-xs mb-2">
                조건: <code>messages.len() &gt;= 15</code>
              </div>
              <p className="text-xs text-muted-foreground">
                위치 <code>N - 10</code> — 최근 10개 제외한 오래된 대화 전체 캐시
              </p>
            </div>
            <div className="bg-card p-4">
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">경계 2: 현재 경계</div>
              <div className="bg-muted/40 rounded p-2 text-xs mb-2">
                조건: 마지막 마크 이후 5개 이상 추가
              </div>
              <p className="text-xs text-muted-foreground">
                위치 <code>N - 2</code> — 직전 응답까지 캐시, 빠른 재개
              </p>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            <code>last_message_cache_idx</code> 갱신으로 중복 마크 방지
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 마크 적용</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            apply_cache_marks — cache_control 삽입 경로
          </div>
          <div className="p-4">
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="bg-muted/40 rounded px-2 py-1"><code>messages[idx]</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-muted/40 rounded px-2 py-1"><code>.get_mut("content")</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-muted/40 rounded px-2 py-1"><code>.as_array_mut()</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-muted/40 rounded px-2 py-1"><code>.last_mut()</code></span>
              <span className="text-muted-foreground">→</span>
              <span className="bg-amber-100 dark:bg-amber-950/40 rounded px-2 py-1 font-semibold"><code>{`cache_control: {type: "ephemeral"}`}</code></span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              마지막 content block에 부착 — 해당 위치까지 전체가 캐시 경계<br />
              마크된 메시지 이전 모든 내용이 캐시 대상
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 히트율 추적</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            record_usage + hit_rate — 캐시 통계
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-border">
            <div className="bg-card p-4">
              <div className="text-xs font-semibold mb-2">record_usage(usage)</div>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div><code>cache_hits</code> += <code>usage.cache_read_tokens</code></div>
                <div><code>cache_misses</code> += <code>usage.cache_creation_tokens</code></div>
                <div><code>tokens_saved</code> += <code>cache_read_tokens * 0.9</code> <span className="text-muted-foreground">(90% 절감)</span></div>
              </div>
            </div>
            <div className="bg-card p-4">
              <div className="text-xs font-semibold mb-2">hit_rate() → f64</div>
              <div className="text-xs text-muted-foreground">
                <code>cache_hits / (cache_hits + cache_misses)</code><br />
                <span className="mt-1 inline-block">일반 세션 히트율: 60-80%</span>
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            <code>tokens_saved</code>는 UI에 표시 — 사용자에게 "캐시로 X% 절감" 안내
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">캐시 TTL 관리</h3>
        <div className="not-prose my-4 rounded-xl border border-border bg-card overflow-hidden">
          <div className="bg-muted/60 px-4 py-2 border-b border-border font-semibold text-sm">
            CacheTracker — TTL 유효성 판정
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold mb-1">is_cache_likely_valid()</div>
                <p className="text-xs text-muted-foreground">
                  <code>last_request_at.elapsed() &lt; 5분</code> 여부 확인<br />
                  None이면 false (첫 요청)
                </p>
              </div>
              <div className="rounded-lg border border-border p-3">
                <div className="text-xs font-semibold mb-1">record_request()</div>
                <p className="text-xs text-muted-foreground">
                  <code>last_request_at = Instant::now()</code><br />
                  매 API 호출마다 갱신
                </p>
              </div>
            </div>
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 text-xs text-muted-foreground">
              ephemeral 캐시 TTL <strong>5분</strong> — 초과 시 캐시 무효, 재생성 비용 발생<br />
              extended cache(beta)는 1시간 TTL — 장기 세션에 유용 (추가 비용)
            </div>
          </div>
        </div>

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
