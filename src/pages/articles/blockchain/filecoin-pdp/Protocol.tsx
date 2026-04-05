import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Protocol({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SHA2 챌린지 &amp; 160바이트 응답</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DRAND 비콘으로 랜덤 오프셋 결정. SP는 해당 오프셋에서 160B를 읽고 SHA256 해시를 계산.<br />
          머클 경로(siblings)를 함께 제출해 리프가 루트에 속함을 증명
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('pdp-main', codeRefs['pdp-main'])} />
          <span className="text-[10px] text-muted-foreground self-center">GenerateProof()</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PDP Protocol 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PDP Protocol:

// Setup:
// 1. Client splits data (160B chunks)
// 2. SHA256 per chunk → leaf hashes
// 3. Build Merkle tree
// 4. Register root on-chain

// Challenge:
// 1. DRAND beacon → randomness
// 2. offset = beacon mod data_size
// 3. SP reads 160B at offset
// 4. Generate Merkle proof

// Proof structure:
// - leaf_data: 160 bytes
// - leaf_hash: 32 bytes
// - merkle_path: ~20-30 × 32 bytes
// - total: ~1 KB

// Verification:
// 1. SHA256(leaf_data) == leaf_hash
// 2. replay Merkle path to root
// 3. compare with registered root

// Gas cost:
// - ~20 SHA256 ops
// - <1 MGas per verify
// - vs PoSt: 100M+ gas

// Frequency:
// - configurable (per SLA)
// - typical: hourly / per epoch
// - statistical guarantee
// - penalty on failure

// 장점:
// - cheap verify
// - no SNARK
// - industry standard (SHA256)
// - fast generation`}
        </pre>
        <p className="leading-7">
          PDP: <strong>DRAND challenge → SHA256 + Merkle → verify</strong>.<br />
          &lt;1 MGas per verify (100x cheaper than PoSt).<br />
          simple, fast, industry-standard crypto.
        </p>
      </div>
    </section>
  );
}
