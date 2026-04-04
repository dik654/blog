import CodePanel from '@/components/ui/code-panel';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import ProveViz from './viz/ProveViz';
import { A_CALC_CODE, B_CALC_CODE, C_CALC_CODE, ZK_BLINDING_CODE } from './ProveData';
import { codeRefs } from './codeRefs';

export default function Prove({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="prove" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prove</h2>
      <div className="not-prose mb-8"><ProveViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('groth16-create-proof', codeRefs['groth16-create-proof'])} />
          <span className="text-[10px] text-muted-foreground self-center">create_proof() A,B</span>
          <CodeViewButton onClick={() => onCodeRef('groth16-c-calc', codeRefs['groth16-c-calc'])} />
          <span className="text-[10px] text-muted-foreground self-center">C 계산 + 블라인딩</span>
        </div>
        <p>
          증명자는 PK와 witness를 사용하여 증명 <strong>Proof = (A, B, C)</strong>를 생성합니다.
          <br />
          BN254 기준으로 G1 2개 + G2 1개 = <strong>256 bytes</strong>의 간결한 증명입니다.
          <br />
          핵심 연산은 MSM(Multi-Scalar Multiplication)이며, 복잡도는 O(n)입니다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">A 계산 (G1)</h3>
        <CodePanel
          title="A = [α + a(τ) + rδ]₁"
          code={A_CALC_CODE}
          annotations={[
            { lines: [1, 1], color: 'sky', note: 'A 공식' },
            { lines: [3, 5], color: 'emerald', note: '각 항의 역할' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">B 계산 (G2 + G1)</h3>
        <CodePanel
          title="B (G2) + B' (G1) 이중 계산"
          code={B_CALC_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'G2와 G1 두 버전' },
            { lines: [4, 6], color: 'amber', note: 'G1 ↔ G2 변환 불가 이유' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">C 계산 (G1)</h3>
        <CodePanel
          title="C 계산 (비공개 + QAP + 블라인딩)"
          code={C_CALC_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: '3가지 구성 요소' },
            { lines: [5, 9], color: 'violet', note: '블라인딩 항 전개' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-8 mb-4">영지식성: r, s 블라인딩</h3>
        <p>
          매 증명마다 새로운 랜덤 r, s를 사용합니다.
          <br />
          같은 witness라도 매번 다른 (A, B, C)가 생성됩니다.
          <br />
          개별 증명에서 witness 정보를 추출하는 것이 불가능합니다.
          <br />
          이것이 <strong>완전 영지식(perfect zero-knowledge)</strong>을 보장합니다.
        </p>
        <CodePanel title="영지식성 보장 원리" code={ZK_BLINDING_CODE} />
      </div>
    </section>
  );
}
