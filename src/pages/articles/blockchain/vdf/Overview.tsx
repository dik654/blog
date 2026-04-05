import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">VDF 개요 &amp; 동기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          VDF(Verifiable Delay Function) — "일정 시간이 흘렀다"를 수학적으로 증명하는 함수.<br />
          계산에 T 스텝이 반드시 필요하고, 검증은 짧은 증명으로 빠르게 가능
        </p>
      </div>
      <div className="not-prose"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">VDF 정의 &amp; 동기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// VDF (Verifiable Delay Function):
// Boneh et al., CRYPTO 2018

// Definition:
// function VDF: (x, T) → (y, π)
// - x: input
// - T: delay parameter
// - y: output (deterministic)
// - π: proof of correct computation

// Properties:
// 1. Sequential:
//    - T sequential steps required
//    - no parallel shortcut
//    - real time elapsed
//
// 2. Verifiable:
//    - efficient verification
//    - π allows quick check
//    - polylog(T) verify time
//
// 3. Unique output:
//    - deterministic
//    - same x → same y
//    - can't pick favorable output

// Motivation:
// "Prove that time has passed"
//
// Without VDF:
// - attackers use massive parallelism
// - grind attacks
// - bias randomness
//
// With VDF:
// - wall-clock time enforced
// - unbiasable outputs
// - leader election fair

// Use cases:
// - Randomness beacons
// - Leader election (PoS)
// - Fair ordering
// - Time-lock encryption
// - Delay-based consensus

// vs Hash-based delay:
// Hash chain:
// - embarrassingly parallel
// - TLS/SSL easy to speed up
// - not true delay
//
// VDF:
// - provably sequential
// - time-bound guaranteed
// - mathematical delay

// Real world VDFs:
// - DRAND (randomness beacon)
// - Chia PoSpace (later VDF)
// - Ethereum (planned)
// - Filecoin (past consideration)

// Hardware:
// - ASICs reduce constant factor
// - still same asymptotic
// - VDF Alliance research
// - FPGA implementations

// Security assumption:
// - time/parallelism lower bound
// - any prover needs T time
// - verifier much faster`}
        </pre>
        <p className="leading-7">
          VDF: <strong>T sequential steps + quick verify</strong>.<br />
          Boneh et al. 2018, "time has passed" 증명.<br />
          randomness beacons, leader election, fair ordering 사용.
        </p>
      </div>
    </section>
  );
}
