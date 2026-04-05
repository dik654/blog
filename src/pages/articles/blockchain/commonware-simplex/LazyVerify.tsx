import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import LazyVerifyViz from './viz/LazyVerifyViz';

export default function LazyVerify({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (k: string) => onCodeRef(k, codeRefs[k]);
  return (
    <section id="lazy-verify" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Lazy Verification & Batcher</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          기존 합의 — 모든 수신 메시지를 즉시 서명 검증. 메시지 N개 x 검증 비용 = 높은 CPU 부하
          <br />
          Simplex Batcher의 Lazy Verification — <strong>쿼럼 도달 시에만 배치 검증</strong>
        </p>
        <p className="leading-7">
          <code>VoteTracker</code> — notarizes/nullifies/finalizes 3종 <code>AttributableMap</code>으로 투표 수집
          <br />
          검증자당 1표만 허용 (signer 인덱스 키). 쿼럼 도달 전까지는 저장만 수행
          <br />
          <code>Scheme::is_batchable()</code>이 true인 서명 스킴(ed25519 등)에서만 활성화
        </p>
        <p className="leading-7">
          <strong>구현 인사이트:</strong> Batcher가 별도 actor — 투표 수집·검증을 Voter에서 분리
          <br />
          Voter는 검증된 인증서만 수신 → 합의 로직이 서명 검증 복잡도에서 완전 격리
          <br />
          3개 네트워크 채널(vote/certificate/resolver) 분리로 인증서가 투표보다 먼저 도착하면 short-circuit
        </p>
      </div>
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => open('vote-tracker')} />
        <span className="text-[10px] text-muted-foreground self-center">VoteTracker</span>
        <CodeViewButton onClick={() => open('notarization-type')} />
        <span className="text-[10px] text-muted-foreground self-center">Notarization (N3f1)</span>
      </div>
      <div className="not-prose mb-8">
        <LazyVerifyViz onOpenCode={open} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Lazy Verification 최적화</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Lazy Signature Verification
//
// Motivation:
//
//   Consensus has many signed messages:
//     Votes, certificates, proposals
//     N validators * M views * K messages/view
//     Easily 10^4 - 10^6 signatures per epoch
//
//   Signature verification is expensive:
//     Ed25519 verify: ~70 us
//     BLS verify: ~2 ms
//     At 10^4 signatures: ~0.7 sec (ed25519) / 20 sec (BLS)
//
//   Eager verification:
//     Verify EVERY message on receive
//     High CPU cost
//     Many verifications WASTED (quorum not reached)
//
//   Lazy verification:
//     Collect messages without verifying
//     Verify only when quorum potentially reached
//     Batch verification if supported

// Batching optimization (Ed25519 specifically):
//
//   Single verify: 70 us
//   Batch verify 100: 1.5 ms total (15 us amortized)
//   Speedup: ~4-5x
//
//   Why? Batch can share intermediate computations
//   Check N signatures with single exponentiation
//
//   Mathematical basis:
//     Random linear combination of signatures
//     e(sum(s_i), G) == e(hash, sum(pk_i) * r_i)

// VoteTracker structure:
//
//   struct VoteTracker<D> {
//       notarizes: AttributableMap<Notarize<D>>,
//       nullifies: AttributableMap<Nullify>,
//       finalizes: AttributableMap<Finalize<D>>,
//       verified: bool,
//   }
//
//   AttributableMap ensures:
//     1 vote per validator (by index)
//     Easy quorum detection (count entries)
//
//   verified flag:
//     false initially
//     true after batch verification passes

// Batcher processing loop:
//
//   loop {
//       // 1. Receive votes from network
//       let (vote, signer) = self.inbox.recv().await;
//
//       // 2. Add to unverified pool
//       self.tracker.add(vote, signer);
//
//       // 3. Check if quorum reachable
//       if self.tracker.count() >= self.threshold {
//           // 4. Attempt batch verification
//           let result = self.batch_verify(&self.tracker).await;
//
//           match result {
//               BatchOk => {
//                   // All signatures valid
//                   self.tracker.verified = true;
//                   let cert = self.tracker.aggregate();
//                   self.emit_certificate(cert).await;
//               }
//               BatchFail(bad_signers) => {
//                   // Some signatures invalid
//                   for signer in bad_signers {
//                       self.tracker.remove(signer);
//                   }
//                   // Continue collecting...
//               }
//           }
//       }
//   }

// Batch verification implementation:
//
//   fn batch_verify_ed25519(
//       msgs: &[(Message, Signature, PublicKey)]
//   ) -> Result<(), Vec<usize>> {
//       // Pick random scalars r_i
//       let rs: Vec<Scalar> = random_scalars(msgs.len());
//
//       // Verify combined equation
//       // sum(r_i * s_i) * G ==
//       //   sum(r_i * R_i) + sum(r_i * c_i * A_i)
//       //
//       //   where c_i = H(R_i, A_i, m_i)
//
//       if combined_check_passes {
//           Ok(())
//       } else {
//           // If batch fails, fall back to individual
//           identify_bad_signatures()
//       }
//   }

// Short-circuit optimization:
//
//   Sometimes Certificate arrives BEFORE all votes!
//   (peer already aggregated)
//
//   fn handle_message(&mut self, msg: Message) {
//       match msg {
//           Message::Certificate(cert) => {
//               // Skip individual vote collection
//               // Just verify the aggregate signature
//               if self.verify_certificate(&cert) {
//                   self.adopt_certificate(cert);
//               }
//           }
//           Message::Notarize(vote) => {
//               // Normal lazy path
//               self.tracker.add(vote);
//               self.maybe_batch_verify();
//           }
//       }
//   }
//
//   Result:
//     Fast forward if certificate ready
//     Individual votes only if needed

// Network channels:
//
//   Separate channels for:
//     - Vote messages (frequent, small)
//     - Certificate messages (rare, large)
//     - Resolver requests (sync)
//
//   Prioritization:
//     Certificates processed first (faster finality)
//     Votes next (feed batcher)
//     Resolver last (sync is background)

// Security considerations:
//
//   1) DoS protection:
//      Bounded vote pool size per view
//      Drop old votes on overflow
//
//   2) Invalid signature attacks:
//      Batch fail → identify bad signer
//      Can slash malicious validator
//
//   3) Replay attacks:
//      Vote includes view number
//      Same vote different view = different signature
//
//   4) Equivocation:
//      AttributableMap detects multiple votes
//      Trigger slashing path

// Performance impact:
//
//   With 100 validators, Ed25519:
//     Eager: 100 verifications per view = 7ms
//     Lazy (batch 67): 1 batch verify = 1.5ms
//     Savings: ~5x CPU per view
//
//   Over 10,000 views:
//     Eager: 70 sec CPU
//     Lazy: 15 sec CPU
//     55 sec saved per consensus participant`}
        </pre>
      </div>
    </section>
  );
}
