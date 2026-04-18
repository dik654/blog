import { CitationBlock } from '@/components/ui/citation';

export default function Responsiveness() {
  return (
    <section id="responsiveness" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">응답성 (Responsiveness)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Yin et al., PODC 2019 — §6" citeKey={3} type="paper">
          <p className="italic">
            "A protocol is responsive if the leader can make progress as soon as it receives messages from a quorum of replicas, without waiting for a known upper bound on network delay."
          </p>
        </CitationBlock>

        {/* ── Responsiveness 정의 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Responsiveness 형식 정의</h3>
        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">정의 (Pass-Shi 2018)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>Responsive: 합의 시간이 실제 메시지 지연 δ에 비례 — <code className="text-xs">Time_consensus &le; c * δ</code></p>
              <p>Non-responsive: 고정 timeout Δ (worst-case) 대기. 실제 δ &lt;&lt; Δ여도 Δ 대기</p>
              <p>Responsive: 2f+1 응답 즉시 진행. 네트워크 빠르면 합의 빠름</p>
            </div>
          </div>
        </div>

        <div className="not-prose overflow-x-auto mb-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">Normal</th>
                <th className="border border-border px-4 py-2 text-left">View Change</th>
                <th className="border border-border px-4 py-2 text-left">Worst Case</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PBFT', '3δ (responsive)', 'timeout 기반 (non-responsive)', 'O(Δ)'],
                ['HotStuff', '3δ (responsive)', '2f+1 NewView (responsive)', 'O(δ) under GST'],
                ['Tendermint', 'timeout 기반', '2/3+ prevote + timeout', 'O(Δ)'],
                ['HotStuff-2 / Jolteon', 'fully responsive', 'fully responsive', 'O(δ)'],
              ].map(([name, ...rest]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  {rest.map((v, i) => (
                    <td key={i} className="border border-border px-4 py-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="leading-7">
          Responsive = <strong>실제 지연 δ에 비례</strong>.<br />
          non-responsive는 고정 timeout Δ 대기 (pessimistic).<br />
          δ ≪ Δ 에서 큰 성능 차이.
        </p>

        {/* ── HotStuff의 부분 응답성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 부분 응답성</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Normal Operation — Fully Responsive</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>leader가 2f+1 vote 받으면 즉시 다음 phase</li>
              <li>timeout 대기 없음</li>
              <li>latency: <code className="text-xs">3δ</code> per block (chained)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">View Change — Partial Responsive</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Phase 1</strong> timeout detection: <code className="text-xs">Δ</code> 대기 (non-responsive)</p>
              <p><strong>Phase 2</strong> NewView collection: <code className="text-xs">δ</code> (responsive)</p>
              <p><strong>Phase 3</strong> new propose: <code className="text-xs">δ</code> (responsive)</p>
              <p>총: <code className="text-xs">Δ + 2δ</code></p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">HotStuff-2 개선</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>2-phase protocol, locking 제거 (view-based)</li>
              <li>view change도 fully responsive</li>
              <li>latency: normal <code className="text-xs">2δ</code>, view change <code className="text-xs">Δ + δ</code></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Jolteon (Aptos)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>2-chain commit + async fallback (Ditto)</li>
              <li>responsive in normal + view change</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">Responsiveness의 실제 가치</div>
            <div className="text-sm text-muted-foreground">
              LAN: δ ≈ 1ms, Δ ≈ 100ms → <strong>100x</strong> 차이 / WAN: δ ≈ 100ms, Δ ≈ 1s → <strong>10x</strong> 차이
            </div>
          </div>
        </div>
        <p className="leading-7">
          HotStuff normal = <strong>responsive</strong>, view change = <strong>partial responsive</strong>.<br />
          leader 장애 감지에만 timeout 필요.<br />
          HotStuff-2가 이 마지막 non-responsive 부분도 해결.
        </p>

        {/* ── 실측 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실제 성능 비교</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">WAN Normal</th>
                <th className="border border-border px-4 py-2 text-left">WAN VC</th>
                <th className="border border-border px-4 py-2 text-left">TPS</th>
                <th className="border border-border px-4 py-2 text-left">LAN</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['PBFT', '300ms', '~1s', '1K (O(n²) 한계)', '3ms'],
                ['Tendermint', '400ms', '~2s', '10K', '4ms'],
                ['HotStuff', '300ms', '500-1000ms', '20K', '3ms / 1ms steady'],
                ['HotStuff-2', '200ms', '200-500ms', '30K+', '2ms'],
                ['Jolteon (Aptos)', '200ms', '200-500ms', '100K+ (DAG)', '2ms'],
              ].map(([name, ...rest]) => (
                <tr key={name}>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  {rest.map((v, i) => (
                    <td key={i} className="border border-border px-4 py-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">프로토콜 선택 기준</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>WAN + 응답성</strong>: HotStuff-2, Jolteon</li>
              <li><strong>LAN + 단순성</strong>: Tendermint</li>
              <li><strong>범용</strong>: HotStuff</li>
              <li><strong>고처리량</strong>: Jolteon + DAG</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Aptos 실측 (2024)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>TPS: <code className="text-xs">100,000+</code></li>
              <li>latency: <code className="text-xs">~1s</code> (end-to-end)</li>
              <li>Jolteon + Quorum Store (DAG mempool)</li>
              <li>validator: ~100</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          WAN 환경에서 responsiveness 차이가 큼.<br />
          HotStuff 300ms → HotStuff-2 200ms → Jolteon 200ms.<br />
          DAG-based mempool 결합으로 100K+ TPS 달성.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff의 응답성 한계</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">정상 경로: 응답적</p>
            <p className="text-sm">
              리더가 2f+1 투표를 받으면 즉시 다음 단계 진행.<br />
              타임아웃 대기 없음
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">View Change: 비응답적</p>
            <p className="text-sm">
              리더 장애 감지에 타임아웃 필요.<br />
              이 타임아웃이 실제 네트워크 지연보다 클 수 있음
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">후속 프로토콜의 개선</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Jolteon</p>
            <p className="text-sm">
              정상 경로에서 낙관적 응답성 추가.<br />
              2단계 fast path + 3단계 slow path
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">HotStuff-2</p>
            <p className="text-sm">
              3단계를 2단계로 축소하면서 응답성 유지.<br />
              View Change에서도 최적 지연 달성
            </p>
          </div>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 responsiveness가 BFT 진화 방향인가</strong> — 인터넷은 δ &lt; Δ.<br />
          보안 마진으로 Δ 크게 설정 필요, but 실제 δ는 훨씬 작음.<br />
          responsive 프로토콜은 그 차이만큼 성능 향상.<br />
          HotStuff → HotStuff-2 → Jolteon 진화의 핵심 동기.
        </p>
      </div>
    </section>
  );
}
