import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import PLONKRoundsViz from './viz/PLONKRoundsViz';
import PLONKProverFlowViz from './viz/PLONKProverFlowViz';
import { PROVER_R1_R3_CODE, PROVER_R4_R5_CODE, VERIFIER_CODE } from './ProverVerifierData';
import { codeRefs } from './codeRefs';

export default function ProverVerifier({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="prover-verifier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PLONK Prover / Verifier</h2>
      <div className="not-prose mb-8"><PLONKRoundsViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round 프로토콜 흐름</h3>
      </div>
      <div className="not-prose mb-8"><PLONKProverFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('plonk-round1-3', codeRefs['plonk-round1-3'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prover R1-3</span>
          <CodeViewButton onClick={() => onCodeRef('plonk-round4-5', codeRefs['plonk-round4-5'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prover R4-5</span>
          <CodeViewButton onClick={() => onCodeRef('plonk-verifier', codeRefs['plonk-verifier'])} />
          <span className="text-[10px] text-muted-foreground self-center">Verifier</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">빌딩 블록의 결합</h3>
        <p>KZG(다항식 commit), PLONKish(범용 게이트), Permutation(와이어 연결)을 5라운드 프로토콜로 조립한다.
        <br />
          모든 제약을 다항식 등식으로 변환하고, quotient polynomial(몫 다항식)로 증명한다.
        <br />
          Fiat-Shamir 변환으로 비대화형으로 만든다.</p>

        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round Prover (Round 1-3)</h3>
        <CodePanel
          title="Prover Round 1-3"
          code={PROVER_R1_R3_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: 'Round 1: Wire commitments' },
            { lines: [6, 9], color: 'emerald', note: 'Round 2: Permutation accumulator' },
            { lines: [11, 16], color: 'amber', note: 'Round 3: Quotient polynomial' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">5-Round Prover (Round 4-5)</h3>
        <CodePanel
          title="Prover Round 4-5"
          code={PROVER_R4_R5_CODE}
          annotations={[
            { lines: [1, 4], color: 'violet', note: 'Round 4: 평가값 전송' },
            { lines: [6, 11], color: 'rose', note: 'Round 5: Opening proofs' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Verifier</h3>
        <CodePanel
          title="PLONK Verifier"
          code={VERIFIER_CODE}
          annotations={[
            { lines: [4, 7], color: 'sky', note: 'Fiat-Shamir 재생성 및 사전 계산' },
            { lines: [8, 11], color: 'emerald', note: 'Pairing check (최종 검증)' },
          ]}
        />
        <p>검증자는 <strong>페어링 2회</strong>와 소수의 G1 스칼라 곱만으로 검증을 완료한다. 전체 witness를 보지 않고 증명의 정당성을 확인할 수 있다.</p>
      </div>
    </section>
  );
}
