import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function PoSt({ title, onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="post" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'PoSt — 시공간 저장 증명'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>PoSt</strong>(Proof of Spacetime) — 봉인된 섹터의 지속 저장 증명
          <br />
          <strong>WindowPoSt</strong>(24시간 주기, 모든 섹터) vs
          <strong> WinningPoSt</strong>(블록 생성 시, 당첨 섹터)
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('window-post', codeRefs['window-post'])} />
            <span className="text-[10px] text-muted-foreground self-center">window_post.rs</span>
            <CodeViewButton onClick={() => onCodeRef('fallback-vanilla', codeRefs['fallback-vanilla'])} />
            <span className="text-[10px] text-muted-foreground self-center">vanilla.rs</span>
          </div>
        )}
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>{'💡'} Poseidon 선택 이유</strong> — BLS12-381 스칼라체 위 연산
          <br />
          Groth16 회로 내 SHA256 대비 10배 이상 게이트 절약
        </p>

        {/* ── PoSt 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PoSt 메커니즘 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PoSt (Proof of SpaceTime):

// WindowPoSt (24h 주기):
// - 모든 active sectors 대상
// - partition으로 분할 (~2349 sectors per partition)
// - 10 random challenges per sector
// - deadline-based (24h / 48 = 30min windows)

// WindowPoSt 프로세스:
// 1. deadline 시작 시 challenge 생성
//    - random drand-based
//    - per partition
// 2. each sector에 10 leaf 선택
// 3. Merkle proof 생성
//    - open leaves
//    - sibling hashes
//    - root verification
// 4. SNARK proof 생성
//    - Groth16
//    - GPU accelerated
// 5. on-chain submission
//    - PartitionSubmitWindowedPoSt message
//    - within deadline

// Skipped sectors:
// - fault 인식된 sectors
// - skipped in proof
// - penalty paid
// - recovery 가능

// WinningPoSt (leader election):
// - trigger: VRF election winner
// - 1 random sector sampled
// - tight deadline (~40s)
// - used in block creation
// - faster proof gen

// Poseidon Hash:
// - SNARK-friendly hash
// - BLS12-381 field operations
// - 3-5x faster than SHA256 in circuit
// - MDS + S-box design
// - recent cryptography

// Merkle Tree Types:
// - base tree (on data)
// - tree C (on column commitments)
// - tree T_aux (on tree C)
// - nested depth ~20-30

// Proof Components:
// - Merkle path for each challenge
// - column commitments
// - replica_id
// - SNARK wrapping

// On-chain verification:
// - SNARK verifier in VM
// - pairing operations
// - Groth16 verify
// - batch verification for efficiency

// Fault handling:
// - missed WindowPoSt
// - fault fee per epoch
// - 7-day recovery window
// - termination penalty if not recovered

// Performance:
// - WindowPoSt generation: ~30 min per partition
// - parallel partitions (multiple GPUs)
// - verification: ~5ms per partition
// - on-chain cost: moderate gas

// Slashing conditions:
// - missed PoSt: fault fee
// - wrong proof: termination
// - double-signing: termination + slash`}
        </pre>
        <p className="leading-7">
          WindowPoSt (24h) + WinningPoSt (election).<br />
          <strong>10 challenges per sector</strong>, Merkle + SNARK.<br />
          Poseidon hash (SNARK-friendly, 3-5x faster than SHA256).
        </p>
      </div>
    </section>
  );
}
