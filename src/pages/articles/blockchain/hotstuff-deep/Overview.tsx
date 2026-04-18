import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff 체인 투표 &amp; 선형 통신</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          HotStuff (Yin et al., PODC 2019) — <strong>PBFT의 O(n²)/O(n³) 병목을 O(n)으로 개선</strong>.<br />
          Threshold Signature + Star topology로 선형 통신 달성.<br />
          Diem(Libra), Aptos가 채택 — 현대 BFT의 기준.
        </p>

        {/* ── HotStuff 혁신 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff 3가지 혁신</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">1. Linear View Change</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>PBFT view change <code className="text-xs">O(n³)</code> → HotStuff <code className="text-xs">O(n)</code></li>
              <li>Threshold signature로 증거 압축</li>
              <li>2f+1 signature → 1 aggregated signature</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2. Star Topology</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>PBFT all-to-all → HotStuff star (leader 중심)</li>
              <li>leader가 votes 수집, aggregated signature 생성</li>
              <li>각 phase당 <code className="text-xs">O(n)</code> 메시지</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">3. Chained Voting</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 block의 vote가 다음 block의 QC</li>
              <li>파이프라인으로 처리량 극대화</li>
              <li>1 block per view (steady state)</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">기존 BFT 대비 통신 복잡도</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>PBFT</strong> — normal <code className="text-xs">O(n²)</code>, view change <code className="text-xs">O(n³)</code></li>
              <li><strong>Tendermint</strong> — normal <code className="text-xs">O(n²)</code>, view change <code className="text-xs">O(n²)</code></li>
              <li><strong>HotStuff</strong> — normal <code className="text-xs">O(n)</code>, view change <code className="text-xs">O(n)</code> (최초 달성)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">HotStuff 계보 &amp; 채택</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>2018 arXiv → 2019 PODC best paper → Libra/Diem 채택</p>
              <p>2021 DiemBFT/Jolteon → 2022 HotStuff-2</p>
              <p>채택: Aptos (Jolteon+Ditto), Diem, Cypherium, ThunderCore</p>
              <p>변형: Basic / Event-Driven / Chained / HotStuff-2 / Jolteon</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          HotStuff = <strong>threshold signature + star topology + chained voting</strong>.<br />
          최초로 O(n) linear view change 달성.<br />
          BFT의 "scalability barrier" 돌파.
        </p>

        {/* ── Threshold Signature ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Threshold Signature 메커니즘</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">BLS Aggregation 원리</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>n개 중 t개 signature 합쳐 1개 aggregated signature</li>
              <li>각 validator: private key <code className="text-xs">sk_i</code>, public key <code className="text-xs">pk_i</code></li>
              <li>signature: <code className="text-xs">σ_i = sk_i × H(m)</code></li>
              <li>aggregate: <code className="text-xs">σ = σ_1 + σ_2 + ... + σ_t</code></li>
              <li>verify: <code className="text-xs">e(σ, g) == e(H(m), Σ pk_i)</code> — single pairing</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">HotStuff에서의 QC 생성</div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>leader가 block B 제안</li>
              <li>각 validator → leader: vote <code className="text-xs">σ_i</code> (BLS sig)</li>
              <li>leader가 2f+1 vote 수집</li>
              <li>aggregate <code className="text-xs">σ = Σ σ_i</code></li>
              <li>QC = <code className="text-xs">(B, σ, signers)</code></li>
              <li>next proposal에 QC 포함 → broadcast</li>
            </ol>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">크기 비교 (n=100, f=33)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>PBFT</strong> — 2f+1 individual sigs = 67 × 48 = <code className="text-xs">3216 bytes</code></li>
              <li><strong>HotStuff</strong> — 1 aggregated + bitmap = <code className="text-xs">48 + 13 = 61 bytes</code></li>
              <li>압축률: <strong>53x</strong></li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">BLS 속성 &amp; Threshold vs Multi-sig</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Pairing-based cryptography, 96-byte sig (BLS12-381)</li>
              <li><code className="text-xs">O(1)</code> aggregation, pairing 1회 검증</li>
              <li>Rogue key attack 방어 필요 (PoP)</li>
              <li><strong>Multi-sig</strong>: 각 서명 개별 검증 / <strong>Threshold</strong>: 단일 집계 검증</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          BLS aggregation = <strong>n개 서명 → 1개 집계 서명</strong>.<br />
          signature size O(1), verification O(1) pairing.<br />
          HotStuff의 O(n) complexity 달성 열쇠.
        </p>

        {/* ── Star Topology ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Star Topology (leader-centric)</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">PBFT (all-to-all)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>각 replica가 모든 다른 replica에게 broadcast</li>
              <li>n nodes → <code className="text-xs">O(n²)</code> connections</li>
              <li>메시지: <code className="text-xs">n × (n-1)</code> per phase</li>
              <li>bandwidth: 모든 link 활용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">HotStuff (star)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>leader만 broadcast: replicas → leader → replicas</li>
              <li>n nodes → <code className="text-xs">O(n)</code> connections per phase</li>
              <li>메시지: <code className="text-xs">2(n-1)</code> per phase</li>
              <li>bandwidth: leader의 uplink 집중</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">HotStuff 메시지 흐름 (3-phase) — 총 7(n-1) = O(n)</div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p><strong>Phase 1 Prepare</strong> — leader → all: Prepare(B) <code className="text-xs">n-1</code> msgs → each → leader: Vote <code className="text-xs">n-1</code> msgs → <code className="text-xs">prepareQC</code></p>
              <p><strong>Phase 2 Pre-commit</strong> — leader → all: Pre-commit(prepareQC) <code className="text-xs">n-1</code> msgs → each → leader: Vote → <code className="text-xs">precommitQC</code></p>
              <p><strong>Phase 3 Commit</strong> — leader → all: Commit(precommitQC) <code className="text-xs">n-1</code> msgs → each → leader: Vote → <code className="text-xs">commitQC</code></p>
              <p><strong>Phase 4 Decide</strong> — leader → all: Decide(commitQC) <code className="text-xs">n-1</code> msgs</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">장점</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">O(n)</code> communication</li>
              <li>단순 토폴로지, leader 중심 추적 용이</li>
              <li>leader rotation 매 view → load 분산</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">단점</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>leader 병목 (bandwidth, CPU)</li>
              <li>leader 공격 시 view change 필요</li>
              <li>leader uplink 요구 높음</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Star topology = <strong>leader 중심 broadcast/collect</strong>.<br />
          O(n²) → O(n) 감소 — validator 수 확장성 개선.<br />
          leader 병목은 매 view rotation으로 분산.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 HotStuff가 BFT 연구의 분수령인가</strong> — 최초의 linear-cost BFT.<br />
          2019 이전: BFT는 수백 validator 한계.<br />
          2019 이후: 수천 validator 가능 (이론).<br />
          blockchain 확장성의 이론적 토대 — Aptos, Diem 등이 현실화.
        </p>
      </div>
    </section>
  );
}
