import ArchViz from './viz/ArchViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>Proof of SQL</strong>은 영지식 증명과 SQL 처리를 통합한 시스템입니다.<br />
          SQL 쿼리의 실행 결과가 올바른지를 <strong>원본 데이터를 노출하지 않고</strong> 증명할 수 있습니다.<br />
          Sumcheck 프로토콜과 HyperKZG/DORY commitment 스킴을 핵심으로 사용하며,
          Ethereum 온체인에서 Solidity로 검증할 수 있습니다.
        </p>
        <h3>핵심 혁신</h3>
        <ul>
          <li><strong>SQL-to-Polynomial</strong> -- SQL 연산을 다항식으로 자동 변환</li>
          <li><strong>로그 크기 증명</strong> -- 데이터 크기에 O(log m) 비례하는 증명</li>
          <li><strong>다층 보안</strong> -- 수학적 가정부터 프로토콜까지 전방위 보안</li>
          <li><strong>GPU 가속</strong> -- Blitzar 라이브러리로 commitment 병렬 처리</li>
        </ul>
        <h3>데이터 플로우</h3>
        <p>
          사용자 SQL &rarr; 파서(AST) &rarr; 증명 계획 &rarr; 데이터 접근 &rarr;
          Commitment 생성 &rarr; Sumcheck 증명 &rarr; Inner Product 증명 &rarr; 검증 완료.
          전체 파이프라인이 Rust로 구현되어 있고, 검증만 Solidity로 온체인 실행됩니다.
        </p>
      </div>
      <div className="mt-8"><ArchViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Proof of SQL 시스템 개요</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof of SQL Architecture
//
// Developer: Space and Time (SxT)
// Use case: verifiable database queries
// Claim: "first sub-second ZK proof for SQL"

// Problem:
//   Centralized database: trust the provider
//   On-chain database: gas cost explodes
//   ZK Rollups: don't support SQL natively
//
// Solution:
//   Run SQL off-chain
//   Generate proof that query was computed correctly
//   Verify on-chain in constant/logarithmic time

// Architecture layers:
//
//   ┌─────────────────────────────┐
//   │ SQL Interface (Apache Calcite) │
//   ├─────────────────────────────┤
//   │ Query Planner & Optimizer   │
//   ├─────────────────────────────┤
//   │ Proof Generation (Rust)     │
//   ├─────────────────────────────┤
//   │ Dory Commitment Scheme      │
//   ├─────────────────────────────┤
//   │ Blitzar (GPU acceleration)  │
//   ├─────────────────────────────┤
//   │ Solidity Verifier (on-chain)│
//   └─────────────────────────────┘

// Supported SQL operations:
//
//   DDL/DML: CREATE, INSERT (provable indexing)
//   DQL:
//     SELECT with column projections
//     WHERE with comparison operators
//     GROUP BY (aggregations: SUM, COUNT, MIN, MAX)
//     ORDER BY
//     INNER/LEFT JOIN
//     LIMIT / OFFSET
//
//   Unsupported (or partial):
//     Complex subqueries
//     Recursive CTEs
//     Some window functions
//     Full-text search

// Proving model:
//
//   Verifier knows:
//     - Schema of tables (columns, types)
//     - Commitments to columns (from DB operator)
//     - Query text
//     - Claimed result
//
//   Prover proves:
//     1. Result is correct given committed data
//     2. No rows added/hidden
//     3. All predicates applied correctly
//     4. Aggregations computed faithfully
//
//   Zero-knowledge:
//     Individual row values not revealed
//     Only aggregate result + proof

// Core math:
//
//   SQL operation → polynomial identity
//   Sum-check: verify sum equals claimed value
//   IPA: verify inner product of committed vectors
//
//   Formulas:
//     SELECT: W_select(x) = projection mask polynomial
//     WHERE:  W_where(x) = indicator polynomial
//     SUM:    sum_{i in H} f(i) * W_where(i)
//     COUNT:  sum_{i in H} W_where(i)

// Commitment scheme: Dory
//
//   Transparent setup (no trusted ceremony)
//   Pairing-based (bilinear)
//   O(sqrt(n)) commitment size
//   O(log n) verifier
//
//   Column-wise commits:
//     Each column → Dory commitment
//     DB operator commits once, updates incrementally

// Verifier on Ethereum:
//
//   Solidity contract implements Dory verifier
//   Pairing checks via EIP-196/197 (BN254 precompile)
//   Plus Fiat-Shamir challenge derivation
//   Plus MLE evaluation reconstruction
//
//   Gas cost: ~500K-1M gas per query verification
//   Independent of row count (just log-factor)

// GPU acceleration (Blitzar):
//
//   Custom CUDA library by SxT
//   Specializes in pairing-based MSMs
//   Multi-scalar multiplication on GPU
//   10-100x speedup for large DBs

// Use cases:
//
//   1. DeFi analytics:
//      "Prove that this TWAP is correct"
//      "Prove total supply of token"
//      "Prove aggregated trade volume"
//
//   2. Compliance:
//      "Prove all transactions passed KYC"
//      Without revealing individual records
//
//   3. Gaming:
//      "Prove random match outcome is fair"
//      "Prove leaderboard rankings"
//
//   4. Supply chain:
//      "Prove authenticity of products"
//      Aggregate over DB queries

// Performance claims:
//
//   10M rows query: <1 second proof
//   100M rows: a few seconds
//   Verifier: ~200ms constant
//
//   Depends heavily on:
//     - GPU availability
//     - Query complexity
//     - Number of tables`}
        </pre>
      </div>
    </section>
  );
}
