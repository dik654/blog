import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import ThresholdViz from './viz/ThresholdViz';

export default function Threshold({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="threshold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Elector: RoundRobin vs Random VRF</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          리더 선출 — <code>Elector</code> trait으로 추상화. <code>Config::build(participants)</code>로 초기화
          <br />
          <strong>결정적 필수:</strong> 동일 (round, certificate) 입력 → 동일 리더. 합의 정확성의 전제 조건
        </p>
        <p className="leading-7">
          <strong>RoundRobinElector:</strong> <code>modulo(view, n)</code> 단순 순환. certificate 무시. O(1)
          <br />
          <strong>RandomElector:</strong> BLS threshold VRF에서 파생한 시드로 편향 없는 선출
          <br />
          View 1은 certificate 없음 → round-robin fallback. 이후: <code>SHA256(cert) → modulo</code>
        </p>
        <p className="leading-7">
          <strong>threshold_simplex</strong> — BLS12-381 임계 서명 + VRF 리더 선출 변형
          <br />
          인증서 크기 O(n) → <strong>O(1) (96 bytes)</strong> — 라이트 클라이언트·크로스체인 검증에 핵심
          <br />
          DKG 3단계: 비밀 공유 → P2P 전송 → 수신 검증 → 그룹 공개키 도출
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('elector-trait')} />
        <span className="text-[10px] text-muted-foreground self-center">Elector trait</span>
        <CodeViewButton onClick={() => open('round-robin')} />
        <span className="text-[10px] text-muted-foreground self-center">RoundRobin</span>
        <CodeViewButton onClick={() => open('random-elector')} />
        <span className="text-[10px] text-muted-foreground self-center">Random VRF</span>
        <CodeViewButton onClick={() => open('threshold-dkg')} />
        <span className="text-[10px] text-muted-foreground self-center">DKG</span>
      </div>
      <div className="not-prose mb-8">
        <ThresholdViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Threshold Signatures & VRF 리더 선출</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Threshold Signatures and VRF Leader Election
//
// Problem:
//   Consensus certificate with n validators
//   Individual signatures: n * 96 bytes (BLS) = heavy
//   Light clients need to verify these certificates
//   Cross-chain verification: size matters!

// Threshold signature idea:
//   Group has shared public key PK
//   Each participant has share of secret key
//   Any t+1 participants can sign (threshold)
//   Final signature: single 96 bytes
//   Verification: single pairing check

// BLS threshold signatures:
//
//   Setup (DKG):
//     Generate polynomial f(x) of degree t
//     Secret s = f(0)
//     Share i: f(i), give to validator i
//     Public key: PK = g^s
//
//   Signing (partial):
//     Validator i signs message m:
//       sigma_i = H(m)^f(i)
//
//   Aggregation:
//     Given t+1 partial signatures,
//     Compute sigma = interpolation to f(0):
//       sigma = prod(sigma_i ^ lambda_i)
//     where lambda_i are Lagrange coefficients
//
//   Verification:
//     e(sigma, G) == e(H(m), PK)
//     Single pairing check, constant-size cert

// DKG (Distributed Key Generation):
//
//   Three phases:
//
//   Phase 1 (Sharing):
//     Each validator i picks random polynomial f_i(x) of degree t
//     Commits to coefficients (via Pedersen)
//     Broadcasts commitments
//
//   Phase 2 (Distribution):
//     Validator i sends f_i(j) to validator j
//     Encrypted point-to-point
//
//   Phase 3 (Verification):
//     Validator j checks f_i(j) against commitments
//     Complains if invalid
//     Combined secret share: s_j = sum_i f_i(j)
//     Group public key: PK = sum_i g^{f_i(0)}

// Why BLS for threshold?
//
//   Unique properties:
//     - Deterministic signing (no randomness needed)
//     - Easy aggregation (homomorphic)
//     - Constant-size signatures
//     - Compatible with VRF

// VRF (Verifiable Random Function):
//
//   Deterministic: same input → same output
//   Verifiable: anyone can verify output
//   Pseudorandom: output indistinguishable from random
//
//   BLS VRF construction:
//     Input: message m
//     Output: y = H(m, e(PK, H(m)))
//     Proof: sigma = H(m)^s
//     Verify: e(sigma, G) == e(H(m), PK)

// Leader election with VRF:
//
//   trait Elector {
//       fn elect(&self, view: View, cert: Certificate) -> ValidatorIndex;
//   }
//
//   RoundRobinElector:
//     leader = view % n_validators
//     Simple, predictable
//     Vulnerable to targeted attacks
//
//   RandomElector:
//     seed = VRF(prev_certificate)
//     leader = seed % n_validators
//     Unpredictable until cert created
//     Fair distribution under honest majority

// Unpredictability guarantee:
//
//   Adversary wants to know future leader
//   Future leader depends on future cert
//   Future cert depends on 2f+1 honest VRF shares
//   As long as f+1 honest validators: unpredictable
//
//   Advantages:
//     - Cannot bribe leader in advance
//     - Cannot DoS target leader
//     - Cannot front-run proposer

// Certificate size comparison:
//
//   simplex (individual sigs):
//     n=100 validators
//     cert = 2f+1 = 67 signatures
//     BLS: 67 * 96 bytes = 6,432 bytes
//     Plus signer indices: ~7 KB total
//
//   threshold_simplex:
//     Aggregated signature: 96 bytes
//     Epoch identifier: ~20 bytes
//     Total: ~120 bytes
//
//   Reduction: 50-100x

// Cross-chain verification:
//
//   Ethereum contract verifying external chain finality:
//     Verifier gas: ~200K gas for BLS pairing
//     Fit in single transaction: yes
//     With individual sigs (7 KB): exceeds gas limit!
//
//   Threshold signatures make cross-chain light clients viable

// Implementation (Commonware threshold_simplex):
//
//   Uses arkworks BLS12-381
//   Lagrange coefficients precomputed
//   DKG runs during epoch transition
//   Shares distributed via P2P
//   Group key committed on-chain

// Trade-offs:
//
//   Threshold pros:
//     - Constant-size certificates
//     - Fast light-client verification
//     - VRF-based leader election
//     - Cross-chain friendly
//
//   Threshold cons:
//     - DKG ceremony complexity
//     - Key rotation difficult
//     - Adding validators = new DKG
//     - Centralization risk if DKG fails

// Production use:
//   - Commonware threshold_simplex
//   - Chainlink DON threshold signing
//   - Drand distributed randomness beacon
//   - Keep Network tBTC signing
//   - Dfinity (ICP) chain-key signatures`}
        </pre>
      </div>
    </section>
  );
}
