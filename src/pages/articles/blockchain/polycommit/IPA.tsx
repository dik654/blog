import CodePanel from '@/components/ui/code-panel';
import {
  IPA_CODE, IPA_ANNOTATIONS,
  MARLIN_CODE, MARLIN_ANNOTATIONS,
} from './IPAData';

export default function IPA({ title }: { title?: string }) {
  return (
    <section id="ipa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'IPA & Marlin PC'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>IPA PC</strong>는 신뢰할 수 있는 설정이 불필요한 이산로그 기반 스킴이며,
          <strong>Marlin PC</strong>는 KZG10에 차수 제한 강제와 은닉성을 추가한 확장입니다.<br />
          두 스킴은 각각 투명성과 기능성에서 KZG10을 보완합니다.
        </p>

        <h3>IPA PC (Inner Product Argument)</h3>
        <CodePanel title="투명 설정 & 재귀 halving" code={IPA_CODE}
          annotations={IPA_ANNOTATIONS} />

        <h3>Marlin PC (차수 제한 강제)</h3>
        <CodePanel title="shifted_commitment & 배치 검증" code={MARLIN_CODE}
          annotations={MARLIN_ANNOTATIONS} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Inner Product Argument</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// IPA (Inner Product Argument)
// Bulletproofs paper (Bünz et al. 2018)
//
// 목표: ⟨a, b⟩ = c 증명
//   (공개: G, H, C / 비공개: a, b)
//
// 기본:
//   Commit: C = ⟨a, G⟩ + ⟨b, H⟩ + c·U
//
// Halving Protocol:
//   벡터 a, b를 반으로 나눔
//   a = (a_L, a_R), b = (b_L, b_R)
//
// Each round:
//   L = ⟨a_L, G_R⟩ + ⟨b_R, H_L⟩ + ⟨a_L, b_R⟩·U
//   R = ⟨a_R, G_L⟩ + ⟨b_L, H_R⟩ + ⟨a_R, b_L⟩·U
//
//   Prover sends (L, R)
//
//   Verifier challenges: u ← random
//
//   Fold:
//   a' = a_L · u + a_R · u^(-1)
//   b' = b_L · u^(-1) + b_R · u
//   G' = G_L · u^(-1) + G_R · u
//   H' = H_L · u + H_R · u^(-1)
//
//   |vectors| halved each round
//
// log n rounds → vectors of size 1
//
// Final: ⟨a, b⟩ = c로 스칼라 등식 검증

// 복잡도:
//   Proof size: 2·log(n) + 2 (L, R pairs + final)
//   Verifier: O(n) (multi-scalar multiplication)
//
//   n = 1024 → proof size ~= 672 bytes
//   n = 2^20 → ~1.3 KB

// 특성:
//   ✓ No trusted setup (transparent)
//   ✓ Post-quantum? No (DLP 기반)
//   ✗ Linear verifier
//
// vs KZG:
//   KZG: trusted setup, O(1) verify, O(1) proof
//   IPA: transparent, O(n) verify, O(log n) proof

// 활용:
//   - Bulletproofs (range proofs)
//   - Halo/Halo2 (recursion friendly)
//   - Mina Protocol
//   - Ethereum Verkle Tree (IPA variant)
//   - Monero confidential txs`}
        </pre>
      </div>
    </section>
  );
}
