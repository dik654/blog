import M from '@/components/ui/math';
import Halo2ProofFlow from '../components/Halo2ProofFlow';
import Halo2ProofPhasesViz from './viz/Halo2ProofPhasesViz';
import FiatShamirViz from './viz/FiatShamirViz';

export default function Prover({ title }: { title?: string }) {
  return (
    <section id="prover" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'create_proof — 증명 생성 파이프라인'}</h2>
      <div className="not-prose mb-8"><Halo2ProofFlow /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>create_proof</code>는 PLONKish 증명의 전체 단계를 구현합니다.<br />
          Fiat-Shamir 트랜스크립트로 도전값을 생성하며, KZG 다중 개구(SHPLONK)로 마무리됩니다.
        </p>
        {/* Phase 1: Advice Commit */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-blue-400 mb-3">Phase 1: 어드바이스 커밋 (prover.rs)</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>synthesize()</code> &mdash; witness 할당</p>
              <p className="text-xs text-muted-foreground mt-1">
                <code>Circuit::synthesize()</code>로 advice 열에 실제 값 할당. keygen과 달리 실제 witness 사용
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">KZG Commit: <M>{'[a(\\tau)]_1'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">
                각 advice column <M>{'a(X)'}</M> 를 다항식으로 변환 &rarr; MSM으로 commitment 계산 &rarr; transcript에 추가
              </p>
            </div>
          </div>
        </div>

        {/* Phase 2~4: Challenge & Grand Product */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-emerald-400 mb-3">Phase 2~4: 도전값 & 그랜드 프로덕트</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Phase 2: Challenge <M>{'\\beta, \\gamma'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">
                Transcript hash로 random challenge 생성 &mdash; permutation argument의 randomization에 사용
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Phase 3: Permutation polynomial <M>{'z(X)'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">
                Grand product 구성 &mdash; <M>{'z(\\omega X) / z(X) = \\text{num} / \\text{den}'}</M>. column permutation 검증
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Phase 4: Lookup polynomials</p>
              <p className="text-xs text-muted-foreground mt-1">
                Plookup-style argument &mdash; 각 lookup table마다 <M>{'h_A(X), h_T(X), g(X)'}</M> 계산하여 테이블 포함 관계 증명
              </p>
            </div>
          </div>
        </div>

        {/* Phase 5: Opening & SHPLONK */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">Phase 5: 개구 & SHPLONK</p>
          <div className="space-y-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Quotient polynomial <M>{'t(X)'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">
                모든 제약을 vanishing polynomial <M>{'Z_H(X)'}</M> 로 나눈 몫 &mdash; 제약이 모든 행에서 성립함을 증명
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">Evaluation at <M>{'z'}</M></p>
              <p className="text-xs text-muted-foreground mt-1">
                challenge point <M>{'z'}</M> 에서 모든 다항식 평가 &rarr; transcript에 추가
              </p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold">SHPLONK multi-point opening</p>
              <p className="text-xs text-muted-foreground mt-1">
                여러 다항식의 평가를 하나의 opening proof로 합산 &mdash; 최종 proof = (commitments, evaluations, opening proof)
              </p>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PLONKish Proof 5단계 + 복잡도</h3>
        <div className="not-prose mb-4"><Halo2ProofPhasesViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Fiat-Shamir Transformation</h3>
        <p>
          Interactive proof를 Non-interactive로 변환하는 기법입니다.
          Verifier의 random challenge를 hash function으로 대체합니다.
        </p>
        <div className="not-prose mb-4"><FiatShamirViz /></div>

      </div>
    </section>
  );
}
