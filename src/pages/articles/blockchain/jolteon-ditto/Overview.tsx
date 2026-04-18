import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HotStuff → Jolteon → DiemBFT 진화</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          HotStuff(2019) → Jolteon(2022) → Ditto(2022) → DiemBFT v4 → Aptos.<br />
          각 세대 <strong>한 가지 한계 해결</strong>.<br />
          이 계보가 현대 BFT의 mainstream.
        </p>

        {/* ── 진화 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">진화 동기: HotStuff의 한계</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">HotStuff 한계 (2019)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>높은 정상 경로 지연</strong> — Basic 7 delays, Chained 3δ. PBFT(3δ)보다 빠르지 않음</li>
              <li><strong>Partial responsive</strong> — view change에 timeout 필요, 자주 발생 시 문제</li>
              <li><strong>Async 취약</strong> — GST 전 liveness 보장 못 함</li>
              <li><strong>Leader 단순</strong> — round-robin fixed, 성능 나쁜 leader도 equal turn</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">2022년 개선</div>
            <div className="text-sm text-muted-foreground space-y-2">
              <p><strong>Jolteon</strong> (FC 2022) — 2-chain commit, fast path 2δ, slow path fallback, fully responsive</p>
              <p><strong>Ditto</strong> (FC 2022) — Jolteon + DAG-based async fallback (Narwhal). 어떤 네트워크에서도 liveness</p>
              <p><strong>DiemBFT v4</strong> — Jolteon 기반 + leader reputation. Aptos에서 계승</p>
              <p><strong>Aptos</strong> (2022-) — DiemBFT v4 + Quorum Store + Block-STM. 100K+ TPS</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          HotStuff 한계: <strong>latency, partial responsive, async 취약, leader 단순</strong>.<br />
          Jolteon/Ditto가 각각 해결 → DiemBFT v4 통합.<br />
          Aptos mainnet이 최종 배포 형태.
        </p>

        {/* ── 계보 정리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HotStuff 계열 프로토콜 계보</h3>
        <div className="not-prose overflow-x-auto mb-4">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">연도</th>
                <th className="border border-border px-4 py-2 text-left">프로토콜</th>
                <th className="border border-border px-4 py-2 text-left">핵심 기여</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['2019', 'HotStuff (PODC)', 'O(n) linear comm, threshold sig, 3-chain commit'],
                ['2019', 'LibraBFT v1', 'HotStuff 실용 구현 (Facebook)'],
                ['2020', 'DiemBFT v2', 'stabilization + 최적화'],
                ['2021', 'DiemBFT v3/v4', 'Leader reputation + async-safe'],
                ['2021-07', 'Diem 종료', 'Facebook/Meta 프로젝트 중단'],
                ['2021-08', 'Aptos Labs 창립', 'Diem 개발자들이 독립'],
                ['2022', 'Jolteon (FC)', '2-chain commit, fast 2δ / slow 3δ'],
                ['2022', 'Ditto (FC)', 'Jolteon + DAG async fallback'],
                ['2022-10', 'Aptos mainnet', 'DiemBFT v4 + Block-STM'],
                ['2023', 'HotStuff-2', '2-phase + TC, fully responsive'],
                ['2024', 'Mysticeti (Sui)', 'DAG-based, 390ms e2e latency'],
              ].map(([year, name, desc]) => (
                <tr key={year + name}>
                  <td className="border border-border px-4 py-2 text-muted-foreground">{year}</td>
                  <td className="border border-border px-4 py-2 font-medium">{name}</td>
                  <td className="border border-border px-4 py-2">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">계보 특징</div>
            <div className="text-sm text-muted-foreground">
              각 버전이 명확한 한 가지 개선. 이론 → 실무 → 이론 cycle. Diem 종료가 오히려 다양성 증가.
            </div>
          </div>
        </div>
        <p className="leading-7">
          HotStuff 계보: <strong>이론(2019) → 실무(Libra/Aptos) → 이론(HotStuff-2) → 실무(Sui)</strong>.<br />
          Diem 종료가 오히려 다양성 증가.<br />
          현대 L1 블록체인 합의의 주류.
        </p>

        {/* ── 선택 기준 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 선택 기준</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">HotStuff (원본)</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>단순 구현, 학술적 참조</li>
              <li>3-chain safety</li>
              <li>학습 목적</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Jolteon</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>낮은 latency, throughput 중요</li>
              <li>정상 path 최적화</li>
              <li>partial sync 환경</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-2">Ditto</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>async network 강건성</li>
              <li>DDoS 저항, 긴 수명 시스템</li>
              <li>변동성 큰 네트워크</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-2">DiemBFT v4</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>production ready</li>
              <li>검증된 구현, leader 품질 중요</li>
              <li>Aptos 스타일</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-2">HotStuff-2</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>이론적 최적 추구</li>
              <li>optimal latency, TC 기반</li>
              <li>연구/실험 단계</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-orange-600 dark:text-orange-400 mb-2">Mysticeti</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>초저 latency (390ms), DAG 기반</li>
              <li>초고 throughput</li>
              <li>Sui 스타일</li>
            </ul>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-2">실제 Mainnet 선택</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Aptos</strong>: DiemBFT v4 (Jolteon 기반)</li>
              <li><strong>Sui</strong>: Mysticeti (새 방향)</li>
              <li><strong>Celo</strong>: IBFT 2.0 (PBFT 계열)</li>
              <li><strong>Near</strong>: Doomslug BFT (Tendermint 계열)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">공통 요구사항</div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">O(n)</code> communication + instant finality</li>
              <li>100-200 validators 지원</li>
              <li>responsiveness + async safety (이상적)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          선택 기준: <strong>latency, responsiveness, async safety, 구현 성숙도</strong>.<br />
          Aptos = DiemBFT v4, Sui = Mysticeti — 상반된 선택.<br />
          DAG-based가 최신 트렌드 (Mysticeti 이후).
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 이 진화가 일어났나</strong> — Aptos의 100K TPS 목표.<br />
          Ethereum 2.0의 32 validators-per-committee로는 불가능.<br />
          BFT + parallel execution + DAG mempool 결합 필요.<br />
          DiemBFT → Jolteon → Aptos의 진화는 이 목표를 위한 여정.
        </p>
      </div>
    </section>
  );
}
