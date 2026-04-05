import Halo2KeygenViz from '../components/Halo2KeygenViz';
import PLONKishCircuitViz from './viz/PLONKishCircuitViz';
import CodePanel from '@/components/ui/code-panel';
import { KEYGEN_VK_CODE, KEYGEN_PK_CODE } from './KeygenData';
import { vkAnnotations, pkAnnotations } from './KeygenAnnotations';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Keygen({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="keygen" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '키 생성 (keygen_vk / keygen_pk)'}</h2>
      <div className="not-prose mb-8"><Halo2KeygenViz /></div>
      <h3 className="text-lg font-semibold mb-3 text-foreground/80">PLONKish 회로 구조</h3>
      <div className="not-prose mb-8"><PLONKishCircuitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          키 생성 단계에서 회로의 고정 열, 퍼뮤테이션, 선택자를 다항식으로 컴파일합니다.
          <code>VerifyingKey</code>에는 고정 열 커밋이, <code>ProvingKey</code>에는
          도메인 다항식들(l0, l_blind, l_last)도 포함됩니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('keygen-vk', codeRefs['keygen-vk'])} />
            <span className="text-[10px] text-muted-foreground self-center">keygen_vk()</span>
            <CodeViewButton onClick={() => onCodeRef('keygen-pk', codeRefs['keygen-pk'])} />
            <span className="text-[10px] text-muted-foreground self-center">keygen_pk()</span>
          </div>
        )}
        <CodePanel title="keygen_vk (keygen.rs)" code={KEYGEN_VK_CODE} annotations={vkAnnotations} />
        <CodePanel title="keygen_pk — l0/l_blind/l_last 도메인 다항식" code={KEYGEN_PK_CODE} annotations={pkAnnotations} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Universal Setup (KZG Params)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// Halo2의 KZG setup은 "universal"
// 하나의 setup으로 여러 circuit 재사용 가능 (Groth16과 차이)

// KZG Params structure
struct ParamsKZG<E: Engine> {
    k: u32,                // log2(circuit size)
    n: u64,                // 2^k
    g: E::G1Affine,        // [τ⁰]₁, [τ¹]₁, ..., [τⁿ⁻¹]₁
    g_lagrange: Vec<_>,    // Lagrange form
    g2: E::G2Affine,       // [1]₂
    s_g2: E::G2Affine,     // [τ]₂
}

// τ = secret (toxic waste)
// Setup ceremony에서 생성 후 파괴
// Ethereum: KZG Ceremony (2023, 140K+ participants)

// 장점
// - Per-circuit ceremony 불필요
// - Ethereum KZG trusted setup 재사용
// - 새 circuit deploy 쉬움

// 단점
// - Setup 결과 파일 크기 (수 GB)
// - Setup 시점 이후 circuit 크기 제약

// Powers of Tau 재사용
// ZCash sapphire: powers-of-tau 세팅
// Halo2: 같은 값 사용 가능
// Polygon: 자체 ceremony 운영`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Verifying Key vs Proving Key</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">{`// VerifyingKey (작음, 공개)
struct VerifyingKey<C: CurveAffine> {
    domain: EvaluationDomain<C::Scalar>,
    fixed_commitments: Vec<C>,       // 고정 열 commitments
    permutation: PermutationVerifyingKey<C>,
    cs: ConstraintSystem<C::Scalar>, // circuit 메타데이터
    selectors: Vec<Vec<bool>>,       // 각 row의 selector 값
    transcript_repr: C::Scalar,      // 검증용 hash
}
// Size: ~10KB for typical circuit
// Purpose: verify proofs (anyone can have this)

// ProvingKey (큼, private)
struct ProvingKey<C: CurveAffine> {
    vk: VerifyingKey<C>,
    l0: Polynomial<...>,          // L₀(X) Lagrange basis
    l_last: Polynomial<...>,       // L_last(X)
    l_active_row: Polynomial<...>, // 활성 행 indicator
    fixed_values: Vec<Polynomial>, // 고정 열 평가값
    fixed_polys: Vec<Polynomial>,  // 고정 열 polynomial form
    fixed_cosets: Vec<Polynomial>, // extended domain
    permutation: PermutationProvingKey<C>,
    ev: Evaluator<...>,            // custom gate evaluator
}
// Size: ~100MB+ for zkEVM circuit
// Purpose: generate proofs (prover만 필요)

// Serialize & deploy
// VK → on-chain verifier contract
// PK → prover machines only`}</pre>

      </div>
    </section>
  );
}
