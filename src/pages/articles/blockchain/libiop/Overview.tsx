import CodePanel from '@/components/ui/code-panel';
import IOPArchViz from './viz/IOPArchViz';
import { IOP_ARCH_CODE, PCP_IOP_CODE } from './OverviewData';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IOP 개요</h2>
      <div className="not-prose mb-8">
        <IOPArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>libiop</strong>는 Interactive Oracle Proof(IOP) 기반
          zkSNARK 프로토콜들의 참조 구현체입니다.<br />
          Aurora, Ligero, Fractal 세 가지 프로토콜을 지원하며,
          모두 <strong>투명 셋업</strong>(trusted setup 불필요)과
          <strong>양자 후 보안성</strong>을 제공합니다.
        </p>
        <h3>PCP에서 IOP로의 발전</h3>
        <CodePanel
          title="PCP vs IOP 비교"
          code={PCP_IOP_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: 'PCP: 정적 증명, 상수 쿼리' },
            { lines: [6, 9], color: 'emerald', note: 'IOP: 다중 라운드 상호작용' },
            { lines: [12, 12] as [number, number], color: 'amber', note: '모듈화와 효율성 개선' },
          ]}
        />
        <h3>libiop 코드 구조</h3>
        <CodePanel
          title="libiop/ 디렉토리 구조"
          code={IOP_ARCH_CODE}
          annotations={[
            { lines: [2, 5], color: 'sky', note: 'Aurora / Ligero / Fractal 프로토콜' },
            { lines: [6, 8], color: 'emerald', note: 'FRI 및 Direct LDT' },
            { lines: [10, 11], color: 'amber', note: 'R1CS 제약 시스템' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">IOP 개념 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Interactive Oracle Proof (IOP)
//
// 정의:
//   Prover와 Verifier의 interactive protocol
//   Prover가 "oracle messages" 보냄
//   Verifier가 oracle을 "query" (특정 위치만)
//
// vs PCP (Probabilistically Checkable Proof):
//   PCP: 단일 static proof
//     - 전체 proof 저장 + 랜덤 위치 조회
//     - Constant query complexity
//   IOP: multi-round interactive
//     - 여러 oracle messages
//     - 각각 query 가능
//     - 훨씬 효율적 (O(log n))
//
// vs IP (Interactive Proof):
//   IP: 메시지 전체 송신
//   IOP: oracle (일부만 쿼리)
//   → IOP는 bandwidth 효율적

// IOP → NIZK (Non-interactive):
//   BCS transform 적용
//     - Oracle → Merkle tree commit
//     - Challenges → Fiat-Shamir hash
//     - Query → Merkle path
//   → zkSNARK

// 주요 IOP 프로토콜:
//
//   Aurora (2019):
//     FRI based
//     Proof: O(log² n)
//     Prover: O(n log n)
//     Verifier: O(log² n)
//
//   Ligero (2017):
//     Direct LDT
//     Proof: O(√n)
//     Prover: O(n log n)
//     Verifier: O(n)
//
//   Fractal (2020):
//     FRI + recursion
//     Aurora 개선
//     Preprocessing SNARK
//
//   Marlin (2019):
//     Preprocessing SNARK
//     Universal trusted setup
//
//   STARKs (Ben-Sasson 2018):
//     FRI 기반
//     Transparent setup
//     Post-quantum secure

// 활용:
//   Aurora, Ligero: transparent zkSNARK
//   Fractal: 재귀 증명
//   STARKs: production systems

// libiop 설계 목적:
//   Academic reference implementation
//   Algorithm research
//   Benchmarking protocols
//   Production 아님 (slower than optimized)`}
        </pre>
      </div>
    </section>
  );
}
