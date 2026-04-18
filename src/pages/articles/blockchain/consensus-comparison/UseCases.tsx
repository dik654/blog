import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { defi: '#6366f1', l1: '#10b981', storage: '#f59e0b', social: '#ef4444' };

function UseCaseViz() {
  const cases = [
    { use: 'DeFi / 결제', proto: 'BFT (즉시 확정)', color: C.defi },
    { use: '대규모 L1', proto: 'Avalanche / DAG', color: C.l1 },
    { use: '스토리지', proto: 'EC + F3', color: C.storage },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">용도별 권장 합의</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {cases.map((c, i) => (
          <motion.g key={c.use} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring' }}>
            <ModuleBox x={10 + i * 138} y={10} w={120} h={42}
              label={c.use} sub={c.proto} color={c.color} />
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 은탄환은 없다 — 요구사항에 맞는 프로토콜 선택이 핵심
      </p>
    </div>
  );
}

export default function UseCases() {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">용도별 선택 가이드</h2>
      <UseCaseViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          즉시 확정 필요 DeFi: <strong>Tendermint, HotStuff 계열 BFT</strong>.<br />
          대규모 노드 필요 L1: <strong>Avalanche, DAG 기반</strong>.<br />
          스토리지 체인: EC + F3 (블록 생산 + 빠른 확정).<br />
          현대 블록체인은 여러 합의 결합 하이브리드로 진화 중.
        </p>

        {/* ── Use Case 세부 가이드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Use Case별 프로토콜 선택 가이드</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">Use Case별 권장 합의</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">Use Case</th>
                    <th className="border border-border px-3 py-1.5 text-left">요구</th>
                    <th className="border border-border px-3 py-1.5 text-left">추천</th>
                    <th className="border border-border px-3 py-1.5 text-left">예시</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="border border-border px-3 py-1.5">고액 금융 (Settlement)</td><td className="border border-border px-3 py-1.5">instant finality</td><td className="border border-border px-3 py-1.5">Tendermint, HotStuff</td><td className="border border-border px-3 py-1.5">Cosmos Hub, dYdX</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">범용 DeFi</td><td className="border border-border px-3 py-1.5">높은 TPS</td><td className="border border-border px-3 py-1.5">Jolteon, Mysticeti</td><td className="border border-border px-3 py-1.5">Aptos, Sui</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">게이밍/실시간</td><td className="border border-border px-3 py-1.5">sub-second latency</td><td className="border border-border px-3 py-1.5">Mysticeti, Autobahn</td><td className="border border-border px-3 py-1.5">Sui gaming</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">대규모 L1</td><td className="border border-border px-3 py-1.5">decentralization</td><td className="border border-border px-3 py-1.5">Avalanche, Ethereum</td><td className="border border-border px-3 py-1.5">Avalanche, ETH 2.0</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">스토리지</td><td className="border border-border px-3 py-1.5">storage power</td><td className="border border-border px-3 py-1.5">EC + F3</td><td className="border border-border px-3 py-1.5">Filecoin</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Payment</td><td className="border border-border px-3 py-1.5">censorship resistance</td><td className="border border-border px-3 py-1.5">Nakamoto</td><td className="border border-border px-3 py-1.5">Bitcoin Lightning</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Enterprise</td><td className="border border-border px-3 py-1.5">known validators</td><td className="border border-border px-3 py-1.5">PBFT, IBFT</td><td className="border border-border px-3 py-1.5">Hyperledger</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Cross-chain</td><td className="border border-border px-3 py-1.5">deterministic finality</td><td className="border border-border px-3 py-1.5">Tendermint, HotStuff</td><td className="border border-border px-3 py-1.5">Cosmos IBC</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">NFT/Identity</td><td className="border border-border px-3 py-1.5">low cost</td><td className="border border-border px-3 py-1.5">Jolteon, Snowman</td><td className="border border-border px-3 py-1.5">Aptos, Avalanche</td></tr>
                  <tr><td className="border border-border px-3 py-1.5">Privacy</td><td className="border border-border px-3 py-1.5">anonymity</td><td className="border border-border px-3 py-1.5">MPC + BFT</td><td className="border border-border px-3 py-1.5">Penumbra, Aleo</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p className="leading-7">
          용도 10가지 분류: <strong>각 use case별 최적 프로토콜</strong>.<br />
          금융 = BFT, 게이밍 = DAG, permissionless = Nakamoto.<br />
          "은탄환 없음" — 요구사항 매칭.
        </p>

        {/* ── 선택 의사결정 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">선택 의사결정 Tree</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">선택 의사결정 Tree</p>
            <div className="text-sm space-y-1.5">
              <p><strong>Q1</strong>: Open membership 필요? — NO → PBFT, IBFT (permissioned)</p>
              <p><strong>Q2</strong>: Instant finality 필요? — NO → Nakamoto, Avalanche</p>
              <p><strong>Q3</strong>: Validator 수? — 10-100: Q4 / 100-500: DAG-BFT / 1000+: Avalanche, ETH committee</p>
              <p><strong>Q4</strong>: Throughput? — 10K: Tendermint, HotStuff / 50K: Jolteon / 100K+: Mysticeti, Autobahn</p>
              <p><strong>Q5</strong>: Async-safe? — YES: Ditto, Tusk / NO: Bullshark, Mysticeti</p>
              <p><strong>Q6</strong>: Object model? — YES: Sui / NO: Aptos</p>
              <p><strong>Q7</strong>: Storage power? — YES: F3 (GossiPBFT) / NO: stake-based</p>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">실제 적용 예시</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">Cosmos-style appchain</p>
                <p className="text-muted-foreground">Open + Instant + ~100 validators + 10K TPS → Tendermint/CometBFT</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">고성능 L1 (100K+ TPS)</p>
                <p className="text-muted-foreground">Open + Instant + 100-500 → DAG-BFT → Mysticeti (object model YES → Sui)</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Decentralized storage</p>
                <p className="text-muted-foreground">Storage power based → F3 (GossiPBFT, Filecoin)</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">2025-2026 트렌드</p>
            <p className="text-sm text-muted-foreground">
              DAG-BFT 주류화, hybrid consensus (Autobahn), async-safe 일반화, privacy-preserving 합의, cross-chain shared security
            </p>
          </div>
        </div>
        <p className="leading-7">
          선택 tree: <strong>membership → finality → validators → throughput → model</strong>.<br />
          실제 사례별 추천: Cosmos = Tendermint, Sui = Mysticeti, Filecoin = F3.<br />
          2025+ 트렌드: DAG-BFT + hybrid + async-safe.
        </p>

        {/* ── 미래 방향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">합의 프로토콜의 미래 (2025-2030)</h3>
        <div className="rounded-lg border divide-y">
          <div className="p-4">
            <p className="font-semibold text-sm mb-2">합의 프로토콜의 미래 (2025-2030)</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="rounded border p-2">
                <p className="font-medium">DAG-BFT 주류화</p>
                <p className="text-muted-foreground">Mysticeti/Autobahn 계승, 1M+ TPS 목표, &lt;100ms latency</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Async-safe 일반화</p>
                <p className="text-muted-foreground">DDoS 저항 필수, HoneyBadger 부활, randomized common coin</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Shared security</p>
                <p className="text-muted-foreground">Interchain (Cosmos), EigenLayer (ETH), validator set sharing</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Privacy-preserving BFT</p>
                <p className="text-muted-foreground">ZK integration, validator anonymity. Penumbra, Aleo, Namada</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">MEV-resistant ordering</p>
                <p className="text-muted-foreground">fair ordering (Themis), encrypted mempool (Shutter), PBS</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Committee sampling</p>
                <p className="text-muted-foreground">1M+ validators, VRF-based, Ethereum 2.0 model</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Consensus as a service</p>
                <p className="text-muted-foreground">Celestia (DA), EigenLayer AVS, modular blockchain</p>
              </div>
              <div className="rounded border p-2">
                <p className="font-medium">Quantum-resistant</p>
                <p className="text-muted-foreground">post-quantum signatures, lattice-based crypto, 2030+</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <p className="font-semibold text-sm mb-1">2030 예측</p>
            <p className="text-sm text-muted-foreground">
              consensus = commodity, any chain can pick protocol, modular architecture, 1M+ TPS standard, sub-100ms latency, async-safe default.<br />
              연구 기관: MystenLabs, Aptos Labs, Protocol Labs, Ethereum Foundation, UC Berkeley, Stanford
            </p>
          </div>
        </div>
        <p className="leading-7">
          미래: <strong>DAG-BFT + async-safe + privacy + modular</strong>.<br />
          2030: 1M+ TPS, sub-100ms latency 표준 예상.<br />
          consensus가 "commodity" — modular blockchain 시대.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 합의 프로토콜 선택의 최종 원칙</strong> — 완벽 없음.<br />
          Trade-off는 blockchain의 본질 (Scalability Trilemma).<br />
          "내 앱이 무엇 포기할 수 있나?" 가 선택 출발점.<br />
          금융: latency 포기 안 됨, 게이밍: safety 일부 OK, 탈중앙: TPS 포기.
        </p>
      </div>
    </section>
  );
}
