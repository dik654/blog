import { CitationBlock } from '@/components/ui/citation';

export default function DiemBFT() {
  return (
    <section id="diembft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DiemBFT v4 (Aptos 합의)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <CitationBlock source="Baudet et al. — DiemBFT v4" citeKey={2} type="paper"
          href="https://developers.diem.com/papers/diem-consensus-state-machine-replication-in-the-diem-blockchain/2021-08-17.pdf">
          <p className="italic">
            "DiemBFT v4 employs a reputation mechanism that promotes leaders based on their recent performance."
          </p>
        </CitationBlock>

        {/* ── Leader Reputation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Leader Reputation 메커니즘</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">문제: Round-Robin Leader</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>모든 validator가 동등한 차례</li>
              <li>네트워크 약한 validator도 leader</li>
              <li>leader 실패 시 view change 지연</li>
              <li>system throughput 저하</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Reputation 계산</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>window = 지난 W 라운드 (예: W=100)</p>
              <p><code className="text-xs">reputation(v) = successes / (successes + failures + 1)</code></p>
              <p>Leader 선출: <code className="text-xs">prob(v) = reputation(v) / Σ reputation(v_i)</code></p>
              <p>VRF or hash-based weighted random</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">효과</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>빠른 leader = 더 자주 선출</li>
              <li>악의적 leader = exclude 가능</li>
              <li>throughput 향상</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">제한사항</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>초기에는 random (reputation 없음)</li>
              <li>reputation 축적 필요</li>
              <li>window 크기 trade-off</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Aptos 실측 (2024)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>validator ~100, 매 round rotation</li>
              <li>reputation 기반: ~80% 고성능 leader</li>
              <li>throughput: <code className="text-xs">100K+ TPS</code></li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Leader Reputation = <strong>성과 기반 weighted 선출</strong>.<br />
          느린/실패한 leader를 자동 demotion.<br />
          throughput 향상 + bribery 공격 완화.
        </p>

        {/* ── Pacemaker 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Pacemaker: View Synchronization</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Pacemaker 역할</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>view(round) 증가 관리 — round ↔ leader 1:1 매핑</li>
              <li>timeout 추적 + TC 생성</li>
              <li>view synchronization — consecutive rounds 보장 (2-chain)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Timeout 관리</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><code className="text-xs">timeout(round) = base_timeout * γ^k</code></p>
              <p><code className="text-xs">base_timeout = 1s</code>, <code className="text-xs">γ = 1.2</code> (geometric backoff)</p>
              <p>k = round 지속 시간. Byzantine premature timeout 방어: TC로 자동 동기화</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Pacemaker 루프</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>1.</strong> <code className="text-xs">leader = leader_selection(round)</code> → leader면 propose, timer 시작</p>
              <p><strong>2.</strong> QC(round) 수신 → process QC, next round / TC(round) 수신 → skip to <code className="text-xs">TC.round+1</code></p>
              <p><strong>3.</strong> timeout 시 → <code className="text-xs">Timeout(round, highQC, highTC)</code> 전송 → 2f+1 수집 → <code className="text-xs">TC(round)</code> 형성 → next round</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">QC Fast-forward</div>
            <div className="text-sm text-muted-foreground">
              높은 QC 받으면 skip 가능: <code className="text-xs">QC(r)</code> received &amp;&amp; <code className="text-xs">current_round &lt; r</code> → update. 빠른 view 동기화 + byzantine 저항 + async-safe (Ditto fallback)
            </div>
          </div>
        </div>
        <p className="leading-7">
          Pacemaker = <strong>view 동기화 + timeout 관리</strong>.<br />
          TC와 QC로 자동 fast-forward.<br />
          Byzantine validator의 premature timeout 방어.
        </p>

        {/* ── Aptos 실제 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Aptos의 실제 구현 세부사항</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">Aptos 컴포넌트</div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Consensus: DiemBFT v4</li>
              <li>Quorum Store: Narwhal 기반 DAG mempool</li>
              <li>State Sync: 새 validator 동기화</li>
              <li>Execution: Block-STM parallel execution</li>
              <li>Storage: RocksDB</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Block 구조</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">epoch: u64</code> / <code className="text-xs">round: u64</code> / <code className="text-xs">timestamp: u64</code></li>
              <li><code className="text-xs">payload: Payload</code> — QS batches</li>
              <li><code className="text-xs">qc: QuorumCert</code> — parent QC</li>
              <li><code className="text-xs">tc: Option&lt;TC&gt;</code> — view change 시</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">Quorum Store (Narwhal-inspired)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>validators가 transactions broadcast</li>
              <li>batches formed with signatures</li>
              <li>block payload = batch references (<code className="text-xs">O(1)</code>)</li>
              <li>throughput decoupled from consensus</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Block-STM Execution</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>optimistic concurrency control</li>
              <li>speculative parallel execution</li>
              <li>conflict detection + retry</li>
              <li>deterministic outcome</li>
            </ul>
          </div>
        </div>

        <div className="not-prose overflow-x-auto mb-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">블록체인</th>
                <th className="border border-border px-4 py-2 text-left">Block Time</th>
                <th className="border border-border px-4 py-2 text-left">TPS</th>
                <th className="border border-border px-4 py-2 text-left">합의</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Ethereum', '12s', '30', 'Gasper'],
                ['Solana', '400ms', '2K', 'Tower BFT'],
                ['Sui', '~400ms', '100K+', 'Mysticeti (DAG)'],
                ['Aptos', '300ms', '100K+', 'DiemBFT v4 (leader)'],
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
          Aptos = <strong>DiemBFT v4 + Quorum Store + Block-STM</strong>.<br />
          100K+ TPS 목표 — production-grade BFT blockchain.<br />
          Sui (Mysticeti)와 함께 고성능 L1 양대산맥.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Jolteon 기반 개선</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">리더 평판 시스템</p>
            <p className="text-sm">
              최근 라운드에서 성공적으로 블록을 확정한 검증자에게<br />
              더 높은 리더 선출 확률 부여.<br />
              느린 검증자가 리더가 되어 시스템을 지연시키는 것 방지
            </p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-1">Pacemaker 동기화</p>
            <p className="text-sm">
              검증자 간 라운드 진행 속도를 동기화.<br />
              timeout-certificate 기반 view 진행.<br />
              라운드가 분기되지 않도록 보장
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">진화 계보 정리</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">핵심 기여</th>
                <th className="border border-border px-4 py-2 text-left">채택</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['HotStuff (2019)', 'O(n) 통신, 선형 VC', 'Libra 초기'],
                ['Jolteon (2022)', '낙관적 fast path', '이론적 개선'],
                ['Ditto (2022)', 'DAG fallback', '이론적 개선'],
                ['DiemBFT v4', '리더 평판 + Jolteon', 'Aptos 메인넷'],
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

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Aptos는 DiemBFT v4를 채택했나</strong> — Diem 팀의 계승.<br />
          Aptos Labs는 Diem 개발자들이 창립 (2021).<br />
          3년간 Diem에서 검증된 코드 + production 경험.<br />
          Mysticeti가 더 빠르지만 검증된 성숙도가 Aptos의 선택.
        </p>
      </div>
    </section>
  );
}
