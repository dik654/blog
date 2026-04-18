import M from '@/components/ui/math';
import Halo2ProofFlow from '../components/Halo2ProofFlow';

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

        <h3 className="text-xl font-semibold mt-8 mb-3">PLONKish Proof 5단계</h3>

        {/* 5단계 파이프라인 카드 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <div className="grid grid-cols-5 gap-2 text-sm text-center">
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-sky-300">Phase 1</p>
              <p className="text-xs text-muted-foreground mt-1">Advice commit</p>
              <p className="text-xs text-muted-foreground"><M>{'[a]_1'}</M></p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-emerald-300">Phase 2</p>
              <p className="text-xs text-muted-foreground mt-1">Challenges</p>
              <p className="text-xs text-muted-foreground"><M>{'\\beta, \\gamma'}</M></p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-amber-300">Phase 3</p>
              <p className="text-xs text-muted-foreground mt-1">Permutation</p>
              <p className="text-xs text-muted-foreground"><M>{'z(X)'}</M></p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-purple-300">Phase 4</p>
              <p className="text-xs text-muted-foreground mt-1">Lookup</p>
              <p className="text-xs text-muted-foreground"><M>{'h_A, h_T, g'}</M></p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-mono font-semibold text-red-300">Phase 5</p>
              <p className="text-xs text-muted-foreground mt-1">Opening</p>
              <p className="text-xs text-muted-foreground">SHPLONK</p>
            </div>
          </div>
        </div>

        {/* 복잡도 & 메모리 */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-amber-400 mb-3">복잡도 & 메모리 요구사항</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-semibold text-xs text-muted-foreground mb-2">연산 복잡도</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>FFT: <M>{'O(n \\log n)'}</M></p>
                <p>MSM (multi-scalar mult): <M>{'O(n)'}</M></p>
                <p>증명 시간: 10s ~ 60s (회로 크기 의존)</p>
                <p>GPU 가속: 5-10x speedup</p>
              </div>
            </div>
            <div>
              <p className="font-semibold text-xs text-muted-foreground mb-2">메모리 요구</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p><M>{'2^{20}'}</M> circuit: ~8GB</p>
                <p><M>{'2^{24}'}</M> circuit: ~64GB</p>
                <p>zkEVM circuit: 128GB+ 필요</p>
              </div>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Fiat-Shamir Transformation</h3>
        <p>
          Interactive proof를 Non-interactive로 변환하는 기법입니다.
          Verifier의 random challenge를 hash function으로 대체합니다.
        </p>

        {/* Interactive vs Non-interactive */}
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border-l-4 border-l-sky-500 bg-card p-4">
            <p className="font-semibold text-sm text-sky-400 mb-2">Interactive (이론)</p>
            <div className="grid grid-cols-4 gap-2 text-sm text-center mt-2">
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold">1. Prover</p>
                <p className="text-xs text-muted-foreground">commitment C 전송</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold">2. Verifier</p>
                <p className="text-xs text-muted-foreground">random challenge c</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold">3. Prover</p>
                <p className="text-xs text-muted-foreground">response r 전송</p>
              </div>
              <div className="rounded border bg-muted/50 p-2">
                <p className="text-xs font-semibold">4. Verifier</p>
                <p className="text-xs text-muted-foreground">(C, c, r) 검증</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border-l-4 border-l-emerald-500 bg-card p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2">Fiat-Shamir (non-interactive)</p>
            <M display>{'c = H(\\text{transcript\\_so\\_far})'}</M>
            <p className="text-xs text-muted-foreground mt-2">
              Verifier 대신 hash function 사용 &mdash; prover가 challenge 예측 불가.
              Transcript = 이전까지의 모든 메시지
            </p>
          </div>
        </div>

        {/* Transcript API */}
        <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
          <p className="font-semibold text-sm text-purple-400 mb-3">Halo2 Transcript API</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>commit_point(point: G1Point)</code></p>
              <p className="text-xs text-muted-foreground mt-1">점을 직렬화하여 hash state에 추가</p>
            </div>
            <div className="rounded border bg-card p-3">
              <p className="font-semibold"><code>squeeze_challenge() -&gt; Scalar</code></p>
              <p className="text-xs text-muted-foreground mt-1">현재 hash를 finalize하여 challenge 추출</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Hash 선택: Blake2b (범용, 빠름) / Poseidon (SNARK-friendly, 재귀) / Keccak (EVM verifier 호환)
          </p>
        </div>

      </div>
    </section>
  );
}
