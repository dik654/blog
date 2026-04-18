import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Avalanche 합의: Snowball/Snowflake</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Team Rocket (Rocket et al., 2018) — <strong>metastable randomized consensus</strong>.<br />
          결정론적 BFT와 다른 접근: 무작위 sub-sampling으로 O(k log n) 통신.<br />
          Avalanche blockchain(2020)의 합의 엔진.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">확률적 합의</h3>
        <p className="leading-7">
          PBFT/HotStuff: 결정론적 합의.<br />
          Avalanche: <strong>확률적 합의</strong>. 충분한 라운드 후 번복 확률 무시 가능.<br />
          trade-off: 절대 안전성 대신 확장성.
        </p>

        {/* ── Avalanche 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Avalanche의 등장과 새로운 철학</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">기존 합의의 한계</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Nakamoto (PoW)</p>
                <p className="text-muted-foreground">10분 finality, 에너지 낭비, probabilistic but slow</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Classical BFT (PBFT, HotStuff)</p>
                <p className="text-muted-foreground"><code>O(n2)/O(n)</code> communication, 수백 노드 한계, deterministic but bounded scalability</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Avalanche의 새 접근</p>
            <p className="text-sm">
              "가십 + 샘플링으로 빠르면서 확장 가능" — 각 노드가 small random sample에 query → majority 따라감 → 반복 → metastable 수렴
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              주요 성능: 1-2초 finality, 4500+ TPS, 수천 validators, 적은 에너지
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">프로토콜 계보 &amp; 배포</p>
            <p className="text-sm">
              Slush (theoretical) → Snowflake (binary) → Snowball (confidence) → Avalanche (DAG) → Snowman (chain)
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              실제 배포: Avalanche blockchain (2020), AVAX token, Subnets, C-Chain (EVM), X-Chain (exchange), P-Chain (platform)
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">설계 철학</p>
            <p className="text-sm text-muted-foreground">
              Byzantine 과반(51%) 대신 확률적 다수 / 결정론적 certainty 대신 probabilistic convergence / <code>O(n)</code> 통신 대신 <code>O(k log n)</code>.<br />
              수학적 기반: metastability theory, random sampling, gossip protocols, Markov chains
            </p>
          </div>
        </div>
        <p className="leading-7">
          Avalanche 철학: <strong>random sampling + gossip + probabilistic convergence</strong>.<br />
          수천 validators, 1-2초 finality, 4500+ TPS.<br />
          classical BFT vs Nakamoto의 중간 지점.
        </p>

        {/* ── 이론적 기반 ── */}
        <h3 className="text-xl function font-semibold mt-6 mb-3">이론적 기반: Metastability</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Metastability 개념</p>
            <p className="text-sm">
              state machine with stable states (0, 1). metastable state = unstable balance — small perturbation → tip to one stable state.
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              물리 예시: 언덕 위 공 (metastable) → 작은 움직임 → 한 쪽 바닥(valley)으로 굴러감.
              Avalanche: 두 선택지 (Red, Blue), 초기 50/50 → random perturbation → small bias → cascade → eventually stable
            </p>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">프로토콜 계층별 개선</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Slush (baseline)</p>
                <p className="text-muted-foreground">k random nodes query → majority면 switch → m rounds 반복. 문제: 확률 보장 없음, Byzantine 저항 약함</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Snowflake</p>
                <p className="text-muted-foreground"><code>beta</code> consecutive identical results → decide. finite termination + probabilistic safety</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Snowball</p>
                <p className="text-muted-foreground">confidence counters (cumulative) 추가. 일시 변동 저항 강화, more robust</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Avalanche (DAG) / Snowman (chain)</p>
                <p className="text-muted-foreground">Avalanche: Snowball + DAG, TX-level, 4500+ TPS. Snowman: linear chain, EVM용 C-Chain</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">Safety probability</p>
            <p className="text-sm text-muted-foreground">
              <code>P(violation) &le; e^(-alpha * beta)</code> — alpha: threshold (14/20), beta: confidence (20). typically 10^-20 수준
            </p>
          </div>
        </div>
        <p className="leading-7">
          Metastability: <strong>small perturbation → cascade → stable state</strong>.<br />
          Slush → Snowflake → Snowball → Avalanche/Snowman 계층.<br />
          safety probability ≈ e^(-α×β), 실용적으로 무시 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Avalanche가 "10,000+ validators"를 가능케 하나</strong> — O(k log n) 통신.<br />
          PBFT: O(n²) → 1000 validators = 1M messages.<br />
          Avalanche: O(k log n), k=20, n=10000 → ~266 messages per node.<br />
          4000배+ 효율 — sub-sampling의 힘.
        </p>
      </div>
    </section>
  );
}
