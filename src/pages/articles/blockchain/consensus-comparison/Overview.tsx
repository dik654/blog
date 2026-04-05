import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 프로토콜 종합 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          주요 합의 프로토콜의 <strong>종합 비교</strong>.<br />
          처리량, 지연, 안전성, 활성, 통신복잡도 기준 분석.<br />
          각 프로토콜의 용도와 trade-off 명확화.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">비교 대상</h3>
        <p className="leading-7">
          PBFT, HotStuff, Tendermint, Narwhal/Bullshark, Avalanche, Nakamoto — <strong>6가지 프로토콜</strong>.<br />
          각각 다른 시대, 다른 목적으로 설계.<br />
          절대적 우열 없음 — 용도별 최적 선택.
        </p>

        {/* ── 프로토콜 history ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 역사적 맥락</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 역사적 맥락:
//
// 1982: Lamport - Byzantine Generals Problem
// 1999: PBFT - Castro & Liskov
//   - 최초 실용적 BFT
//   - O(n²) + O(n³) VC
//
// 2008: Nakamoto - Bitcoin
//   - PoW + longest chain
//   - probabilistic finality
//   - open membership
//
// 2014: Tendermint - Kwon
//   - blockchain-specific BFT
//   - Cosmos 기반
//
// 2018: Avalanche - Team Rocket
//   - metastable consensus
//   - Snowball / Snowflake
//   - scalable probabilistic
//
// 2019: HotStuff - Yin et al.
//   - O(n) linear BFT
//   - Libra/Diem/Aptos
//
// 2022: Narwhal+Bullshark - Spiegelman et al.
//   - DAG-based BFT
//   - 130K+ TPS
//
// 2023: Jolteon - Aptos
//   - 2-chain commit
//   - fast path
//
// 2024: Mysticeti - Mysten Labs
//   - uncertified DAG
//   - 390ms latency
//
// 2024: Autobahn - UC Berkeley
//   - hybrid pipeline
//   - Highway + Lanes

// 시대별 주제:
// - 1980s: 이론 성립 (Lamport)
// - 1990s: 실무 배포 가능성 (PBFT)
// - 2000s: blockchain 등장 (Bitcoin)
// - 2010s: scalable BFT (Tendermint, HotStuff)
// - 2020s: high throughput DAG (Narwhal, Mysticeti)

// 대표 블록체인 채택:
// - Bitcoin: Nakamoto PoW
// - Ethereum: Casper FFG + LMD-GHOST
// - Cosmos: Tendermint/CometBFT
// - Polkadot: GRANDPA (BFT finality)
// - Avalanche: Snowman/Avalanche
// - Solana: Tower BFT + PoH
// - Sui: Mysticeti
// - Aptos: Jolteon (DiemBFT v4)
// - Near: Doomslug BFT
// - Filecoin: EC + F3 (GossiPBFT)`}
        </pre>
        <p className="leading-7">
          40년 BFT 역사: <strong>이론 → 실무 → blockchain → DAG</strong>.<br />
          2020s = DAG-BFT + high throughput 시대.<br />
          각 블록체인이 다른 프로토콜 채택 → 용도별 최적화.
        </p>

        {/* ── 비교 기준 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">6 비교 기준</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 합의 프로토콜 비교 6 기준:

// 1. Communication complexity:
//    - O(n²): PBFT, Tendermint
//    - O(n): HotStuff, Narwhal
//    - O(k log n): Avalanche
//    - 메시지 수 = validator 확장성 제약

// 2. Commit latency:
//    - 3-4δ: PBFT, HotStuff chained
//    - 2-3δ: Mysticeti, Autobahn
//    - ~1s: Avalanche
//    - 60min+: Nakamoto
//    - 실시간 요구 = BFT 필요

// 3. Throughput (TPS):
//    - 10K-30K: PBFT, Tendermint, HotStuff
//    - 100K+: Narwhal+Bullshark, Mysticeti
//    - 4500: Avalanche X-Chain
//    - 7: Bitcoin, 15: Ethereum
//    - 많은 사용자 = 고 throughput 필요

// 4. Safety guarantee:
//    - Deterministic (f<n/3): BFT 모두
//    - Probabilistic (10^-10): Avalanche
//    - Probabilistic (pow): Nakamoto
//    - 금융 = deterministic 선호

// 5. Liveness guarantee:
//    - Partial sync (GST): BFT 모두
//    - Always: Avalanche, Nakamoto
//    - Async-safe: Ditto, Tusk
//    - 업무 critical = always liveness

// 6. Validator scalability:
//    - 수십: PBFT
//    - 수백: BFT 모두
//    - 수천: Avalanche, DAG-BFT
//    - 수백만: Nakamoto (light clients)
//    - 탈중앙화 = 많은 validators

// 추가 고려:
// - bandwidth per validator
// - CPU/memory requirements
// - developer complexity
// - production maturity
// - governance / upgrade path`}
        </pre>
        <p className="leading-7">
          6 비교 기준: <strong>complexity, latency, throughput, safety, liveness, scalability</strong>.<br />
          각 블록체인이 가중치 다르게 선택.<br />
          완벽한 합의 없음 — trade-off의 예술.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 합의 프로토콜이 블록체인 성능의 핵심인가</strong> — bottleneck.<br />
          consensus 외 모든 것 (execution, storage)은 hardware 개선으로 확장 가능.<br />
          consensus는 네트워크 delay가 하한 → 알고리즘 개선이 유일한 방법.<br />
          "consensus war" — 블록체인 간 성능 경쟁의 핵심 전선.
        </p>
      </div>
    </section>
  );
}
