import CodePanel from '@/components/ui/code-panel';
import QueryFlowViz from './viz/QueryFlowViz';
import { QUERY_CODE, QUERY_ANNOTATIONS } from './QueryProofData';

export default function QueryProof() {
  return (
    <section id="query-proof" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SQL 쿼리 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Proof of SQL의 핵심 혁신은 <strong>SQL 연산을 다항식으로 변환</strong>하여
          영지식 증명이 가능하게 만드는 것입니다. WHERE 절의 조건 검사, SELECT의 컬럼 선택 등
          모든 SQL 연산이 스칼라 필드 위의 다항식으로 표현됩니다.
        </p>
        <h3>증명 생성 7단계</h3>
        <ol>
          <li><strong>데이터 준비</strong> -- 쿼리 참조 테이블 범위 계산 및 데이터 로드</li>
          <li><strong>첫 번째 라운드</strong> -- 쿼리 실행 및 중간 결과 commitment</li>
          <li><strong>Transcript 구성</strong> -- Fiat-Shamir 변환을 위한 해시 체인 구축</li>
          <li><strong>최종 라운드</strong> -- Sumcheck용 다항식 구성</li>
          <li><strong>Sumcheck 증명</strong> -- 메인 증명 생성 (SQL &rarr; 다항식 변환의 핵심)</li>
          <li><strong>MLE 평가</strong> -- 평가점에서의 다선형 확장 계산</li>
          <li><strong>Inner Product 증명</strong> -- Commitment 일관성 증명</li>
        </ol>
        <h3>SQL &rarr; 다항식 변환</h3>
        <p>
          WHERE 절의 조건을 Boolean 마스크로 변환한 후, 각 원소를 스칼라 필드 원소
          (0 또는 1)로 매핑합니다. 이 다항식의 합이 조건을 만족하는 행의 수와 일치하는지
          Sumcheck으로 증명합니다.
        </p>
        <CodePanel title="SQL 다항식 변환" code={QUERY_CODE} annotations={QUERY_ANNOTATIONS} />
      </div>
      <div className="mt-8"><QueryFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SQL → 다항식 변환 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SQL to Polynomial Translation
//
// Core idea:
//   Each SQL primitive maps to polynomial constraints
//   Verifier checks constraints hold at random point

// Example query:
//   SELECT SUM(amount) FROM txs WHERE account = 42;
//
// Table layout (committed):
//   Column "account": [42, 17, 42, 99, 42, ...]
//   Column "amount": [100, 50, 200, 75, 150, ...]
//
// Translation:
//
//   Step 1: Encode columns as polynomials
//     account_poly(x) = sum_i account[i] * L_i(x)
//     amount_poly(x)  = sum_i amount[i] * L_i(x)
//     (L_i are Lagrange basis on domain H = {0,1,...,n-1})
//
//   Step 2: Compute WHERE mask
//     w[i] = (account[i] == 42) ? 1 : 0
//     w_poly(x) = MLE of w
//
//   Step 3: Aggregate
//     result = sum_i amount[i] * w[i]
//            = sum_{i in H} amount_poly(i) * w_poly(i)
//
//   Step 4: Sum-check to verify
//     Prover commits to amount_poly, w_poly
//     Proves: sum_{i in H} amount_poly(i) * w_poly(i) = claimed_result
//     Verifier: O(log n) sum-check rounds

// WHERE clause encoding:
//
//   Operators mapped to polynomial checks:
//
//   x = y:
//     (x - y) * (something) = 0
//   x != y:
//     (x - y) * inv(x - y) = 1
//   x < y:
//     bit-decompose (y - x - 1), range check bits
//   x <= y:
//     bit-decompose (y - x), range check
//   x AND y:
//     x * y (since both are 0 or 1)
//   x OR y:
//     1 - (1-x) * (1-y)
//   NOT x:
//     1 - x
//
// All combine into single polynomial identity:
//   mask(x) matches WHERE condition
//   Prove mask is correctly derived from row data

// GROUP BY encoding:
//
//   SELECT category, COUNT(*) FROM items GROUP BY category;
//
//   Implementation:
//     Hash-like gadget:
//       For each unique category, track count via permutation argument
//     Multiset check:
//       {(category, count)} = reduction of all (item.category, 1)
//
//   More complex: uses lookup arguments

// JOIN encoding:
//
//   SELECT a.*, b.val FROM a INNER JOIN b ON a.id = b.id;
//
//   Permutation argument:
//     Prove rows of result are permutations of matched pairs
//     Cartesian pass: check each pair's id match
//
//   Lookup argument:
//     For each row in 'a', check id exists in 'b.id'
//     Cheaper than full pairwise check

// Sum-check protocol in detail:
//
//   Goal: verify sum_{x in {0,1}^k} p(x) = claimed
//
//   Round i (i = 0 to k-1):
//     Prover sends univariate g_i(X) of degree <= deg(p)
//       g_i(X) = sum_{b in {0,1}^{k-i-1}} p(r_0, ..., r_{i-1}, X, b)
//     Verifier checks: g_i(0) + g_i(1) = prev_claim
//     Verifier: r_i = hash(transcript)
//     Update claim: prev_claim = g_i(r_i)
//
//   After k rounds:
//     Final check: p(r_0, ..., r_{k-1}) = claimed
//     Done via MLE evaluation + opening proof

// Transcript (Fiat-Shamir):
//
//   Tracks all prover messages
//   Challenges derived deterministically:
//     challenge = hash(transcript_so_far)
//   Prevents prover from cheating
//
//   Hash used: typically Poseidon or Keccak

// MLE commitment opening:
//
//   At end of sum-check: need p(r) for random r
//   p is the query polynomial (composite)
//   Final opening: IPA argument (inner product of committed vectors)
//
//   Reduces to:
//     <a, b> = c where a, b are committed
//     Verifier checks commitment to a, b and claimed c

// Total proof structure:
//
//   1. Column commitments (reused across queries)
//   2. Intermediate polynomial commitments (per query)
//   3. Sum-check transcript (log(n) elements)
//   4. MLE evaluation proof (Dory IPA)
//   5. Claimed result
//
//   Size: O(log n) + a few constant-size commits
//   ~5-20 KB typical

// Correctness guarantees:
//
//   Soundness: ~128-bit security
//     Sum-check: negligible cheat probability
//     IPA: DL assumption
//     Overall: min of both
//
//   Completeness: honest prover always accepted
//
//   Zero-knowledge:
//     Column values hidden (only commit visible)
//     Aggregate result revealed
//     Individual row values never leaked`}
        </pre>
      </div>
    </section>
  );
}
