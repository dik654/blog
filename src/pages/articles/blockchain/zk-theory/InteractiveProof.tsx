import M from '@/components/ui/math';
import SigmaProtocolViz from './viz/SigmaProtocolViz';
import SpecialSoundnessViz from './viz/SpecialSoundnessViz';

export default function InteractiveProof() {
  return (
    <section id="sigma-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Sigma 프로토콜</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          Commit &rarr; Challenge &rarr; Response 3단계 대화형 증명의 표준 형태.
          <br />
          현대 ZKP(Groth16, PLONK, Bulletproofs)는 모두 이 3-move 구조가 뼈대.
        </p>
      </div>
      <div className="not-prose mb-8"><SigmaProtocolViz /></div>
      <h3 className="text-lg font-bold mb-4">특수 건전성 (Special Soundness)</h3>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          같은 커밋에 두 챌린지 모두 응답 가능하면 비밀 x 복원 가능 &rarr; x 모르면 불가.
        </p>
      </div>
      <div className="not-prose"><SpecialSoundnessViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Sigma Protocol 3단계 흐름</h3>

        {/* 전제 */}
        <div className="not-prose rounded-lg border-l-4 border-l-blue-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-1">증명 대상</div>
          <p className="text-sm text-muted-foreground">
            "나는 witness <M>w</M>를 안다" &mdash; Relation <M>R</M>: <M>{'(x, w) \\in R'}</M>이면 <M>w</M>는 <M>x</M>의 witness
          </p>
        </div>

        {/* 3 Moves */}
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Move 1</div>
            <div className="text-sm font-semibold mb-2">Commitment</div>
            <p className="text-sm text-muted-foreground">
              Prover &rarr; Verifier: <M>a</M><br />
              랜덤 <M>r</M> 선택, <M>{'a = f(r)'}</M> 계산 후 전송
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Move 2</div>
            <div className="text-sm font-semibold mb-2">Challenge</div>
            <p className="text-sm text-muted-foreground">
              Verifier &rarr; Prover: <M>e</M><br />
              랜덤 challenge <M>e</M> 선택 후 전송
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-mono text-muted-foreground mb-1">Move 3</div>
            <div className="text-sm font-semibold mb-2">Response</div>
            <p className="text-sm text-muted-foreground">
              Prover &rarr; Verifier: <M>z</M><br />
              <M>{'z = g(r, w, e)'}</M> &mdash; <M>r</M>과 <M>w</M> 둘 다 필요
            </p>
          </div>
        </div>

        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground text-center">
            Verification: Verifier는 <M>{'(a, e, z)'}</M>로 검증 &mdash; <M>{'V(x, a, e, z) = \\text{ACCEPT or REJECT}'}</M>
          </p>
        </div>

        {/* 3대 보안 성질 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">3대 보안 성질</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Completeness</div>
            <p className="text-sm text-muted-foreground">정직한 Prover &rarr; Verifier가 ACCEPT</p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Special Soundness</div>
            <p className="text-sm text-muted-foreground">
              같은 <M>a</M>에 대해 두 쌍 <M>{'(e, z), (e\', z\')'}</M> &rarr; Extractor가 <M>w</M> 복원
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">HVZK</div>
            <p className="text-sm text-muted-foreground">
              Simulator <M>S</M>가 <M>{'(a, e, z)'}</M> 위조 가능 (<M>w</M> 없이)
            </p>
          </div>
        </div>

        {/* Challenge Space */}
        <div className="not-prose rounded-lg border bg-card p-4 mb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold">Challenge Space:</span> <M>{'|\\text{challenge}|'}</M> 크기 = soundness error의 역수 &mdash; 128-bit challenge &rarr; <M>{'2^{-128}'}</M> error
          </p>
        </div>

        {/* 변형 + 예시 */}
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">변형</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Or-proof: A or B 증명</li>
              <li>And-proof: A and B 증명</li>
              <li>Compound proofs</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold mb-2">주요 구현</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li><strong>Schnorr</strong> &mdash; DLP 기반</li>
              <li><strong>Chaum-Pedersen</strong> &mdash; DL 동등성</li>
              <li><strong>Okamoto</strong> &mdash; Representation</li>
              <li><strong>Guillou-Quisquater</strong> &mdash; RSA 기반</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
