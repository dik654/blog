import { motion } from 'framer-motion';

const C = { mysti: '#6366f1', bull: '#f59e0b' };

function CompareViz() {
  const rows = [
    { metric: 'DAG 유형', mysti: 'Uncertified', bull: 'Certified' },
    { metric: '커밋 지연', mysti: '2 라운드', bull: '3 라운드' },
    { metric: 'Fast Path', mysti: '지원', bull: '미지원' },
    { metric: '메시지 복잡도', mysti: 'O(n)', bull: 'O(n)' },
    { metric: '실전 지연', mysti: '~390ms', bull: '~2s' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Mysticeti vs Bullshark</p>
      <svg viewBox="0 0 420 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.mysti}>Mysticeti</text>
        <text x={365} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bull}>Bullshark</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.mysti}>{r.mysti}</text>
            <text x={365} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bull}>{r.bull}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비교 분석</h2>
      <CompareViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Mysticeti는 <strong>인증 라운드 제거로 지연 절반</strong>.<br />
          Fast path 덕분에 소유 객체 TX는 100ms 이내 확정.<br />
          Sui가 Bullshark → Mysticeti 전환 이유: 실전 지연 80% 감소.
        </p>

        {/* ── Detailed Comparison ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">세부 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Mysticeti vs Bullshark 세부 비교:

// DAG 구조:
// Bullshark: certified DAG
// - 2f+1 signatures per vertex
// - explicit certificate
// - 3δ per round (header + sig + cert)
//
// Mysticeti: uncertified DAG
// - no signatures per vertex
// - just block + references
// - 1δ per round
// - 3x faster per round

// Commit rule:
// Bullshark: 4-round wave
// - 2 rounds sync fast path
// - 4 rounds async fallback
// - anchor + votes + commit
//
// Mysticeti: 3-round commit
// - 1 round propose
// - 1 round vote
// - 1 round commit decision
// - no async mode (always responsive)

// Fast Path:
// Bullshark: none (모든 TX consensus)
// Mysticeti: Sui object model 활용
// - 80% TXs skip consensus
// - 100ms finality
// - consensus bypass

// Latency (WAN):
// Bullshark: 2s e2e
// Mysticeti: 390ms e2e
// = 5x improvement
// (plus 100ms for fast path TXs)

// Throughput:
// Bullshark: 130K TPS
// Mysticeti: 160K+ TPS
// = 23% improvement

// Bandwidth:
// Bullshark: higher (certificates)
// Mysticeti: lower (blocks only)
// = 30% reduction

// Async Safety:
// Bullshark: sync fast + async fallback
// Mysticeti: partial sync only (최근 변형은 async)
// trade-off: latency vs robustness

// Implementation:
// Bullshark: Rust (Narwhal codebase)
// Mysticeti: Rust (Sui codebase)
// - 같은 Mysten Labs
// - 동일 아키텍처 기반

// 성숙도:
// Bullshark: 2022-2023 production (Sui)
// Mysticeti: 2024- production (Sui)
// - Mysticeti가 Bullshark 대체`}
        </pre>
        <p className="leading-7">
          Mysticeti: <strong>5x latency, 23% throughput, 30% bandwidth</strong>.<br />
          모든 metric에서 Bullshark 우위.<br />
          Sui 2024 production → new standard.
        </p>

        {/* ── 후속 연구 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mysticeti 후속 연구</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Mysticeti 이후 연구 방향:

// 1. Async-safe Mysticeti:
//    - 현재 partial sync only
//    - async fallback 추가 연구
//    - Tusk ideas 결합
//
// 2. Mysticeti-v2 (진행 중):
//    - 2-round commit 시도
//    - Pass-Shi lower bound 도전
//    - 이론적 최적 추구
//
// 3. Mysticeti + Sharding:
//    - horizontal scaling
//    - multiple consensus instances
//    - cross-shard communication
//
// 4. Mysticeti + Privacy:
//    - ZK proof 통합
//    - confidential transactions
//    - oblivious ordering

// 5. Non-owned object optimization:
//    - shared objects 병렬성
//    - object-level locking
//    - STM (Software Transactional Memory)

// 다른 DAG-BFT 비교 (2024):
//
// Bullshark (2022):
// - certified DAG
// - 2s latency
// - baseline
//
// Shoal (2023):
// - pipelined Bullshark
// - 다중 anchors per wave
// - latency 50% 감소
//
// Mysticeti (2024):
// - uncertified DAG
// - 390ms latency
// - best production
//
// Autobahn (2024):
// - non-DAG (Highway + Lanes)
// - 200-300ms latency
// - best prototype
//
// Shoal++ (2024):
// - Mysticeti ideas + Shoal
// - 이론적 최적화

// 미래 방향:
// - Sub-second DAG consensus
// - Fully async-safe
// - Privacy-preserving
// - Cross-chain consensus`}
        </pre>
        <p className="leading-7">
          후속 연구: <strong>async-safe, 2-round commit, sharding, privacy</strong>.<br />
          Shoal++, Autobahn 등 경쟁 연구 활발.<br />
          2025-2026 새 protocol 예상.
        </p>

        {/* ── Sui 전환 이유 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sui의 Mysticeti 전환 이유</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Sui의 합의 진화:
//
// 2022: Narwhal + Tusk
// - async-safe (Tusk)
// - but slow (4+ rounds)
// - 3-5s latency
//
// 2023: Narwhal + Bullshark
// - partial sync fast path (2 rounds)
// - async fallback (4 rounds)
// - 2s latency
//
// 2024: Mysticeti
// - uncertified DAG
// - 3-round commit
// - 390ms latency
// - production mainnet

// 전환 이유 (Sui 공식):
//
// 1. User experience:
//    - wallet TX confirmation < 1s
//    - gaming/DeFi real-time feel
//    - competitor (Aptos) 대비 경쟁력
//
// 2. Scalability:
//    - higher TPS 필요 (dapp 증가)
//    - 160K+ TPS vs Bullshark 130K
//    - room for growth
//
// 3. Bandwidth:
//    - validator bandwidth 제약
//    - 30% bandwidth 절약
//    - cost 감소
//
// 4. Research investment:
//    - Mysten Labs 자체 연구
//    - Sui 경쟁력 강화
//    - publication impact

// 영향:
// - Sui user base 증가
// - ecosystem 활성화
// - other L1 연구 가속
// - DAG-BFT 주류화

// 타 체인 영향:
// - Aptos: Mysticeti 관심 but Jolteon 유지
// - Monad: 자체 consensus (MonadBFT)
// - Solana: Tower BFT (다른 접근)
// - Sei: Tendermint+

// 2024 결론:
// Mysticeti = state-of-the-art production BFT
// 학계 (HotStuff-2, Autobahn) vs 실무 (Mysticeti)
// 각자 다른 방향 탐색`}
        </pre>
        <p className="leading-7">
          Sui 전환 이유: <strong>UX (sub-1s), scalability (160K), bandwidth (30% 절약)</strong>.<br />
          2024 state-of-the-art production BFT.<br />
          학계 vs 실무의 다른 방향 — 모두 DAG-BFT 진화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "Mysticeti를 채택한 Sui"가 중요한가</strong> — 현실 검증.<br />
          HotStuff-2, Autobahn 이론 더 좋지만 production 없음.<br />
          Mysticeti는 실제 Sui mainnet 2024 — 수억 USD 처리.<br />
          "production-grade BFT" 기준점 — 다른 체인도 벤치마크.
        </p>
      </div>
    </section>
  );
}
