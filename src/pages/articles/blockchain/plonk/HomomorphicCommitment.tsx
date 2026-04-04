import CodePanel from '@/components/ui/code-panel';
import HomomorphicViz from './viz/HomomorphicViz';
import { PEDERSEN_CODE, ADDITIVE_CODE, KZG_HOMO_CODE, APPLICATION_CODE } from './HomomorphicCommitmentData';

export default function HomomorphicCommitment() {
  return (
    <section id="homomorphic-commitment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동형 커밋먼트</h2>
      <div className="not-prose mb-8"><HomomorphicViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Pedersen Commitment</h3>
        <p><strong>은닉성(hiding)</strong>과 <strong>바인딩(binding)</strong>을 동시에 제공하는 커밋먼트 스킴이다.</p>
        <CodePanel title="Pedersen Commitment" code={PEDERSEN_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: 'C = v·G + r·H' },
            { lines: [4, 5], color: 'emerald', note: '은닉성 + 바인딩' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">가법 동형성</h3>
        <p>커밋먼트의 덧셈이 <strong>값의 덧셈 커밋먼트</strong>와 같다. 암호화 상태에서 연산이 가능하다.</p>
        <CodePanel title="가법 동형성" code={ADDITIVE_CODE}
          annotations={[
            { lines: [4, 5], color: 'sky', note: '커밋 덧셈 = 값 덧셈' },
            { lines: [7, 8], color: 'emerald', note: '핵심 성질' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG의 동형 속성</h3>
        <CodePanel title="KZG 동형성" code={KZG_HOMO_CODE}
          annotations={[
            { lines: [3, 4], color: 'emerald', note: '가법, 스칼라 곱 OK' },
            { lines: [5, 5], color: 'rose', note: '곱셈은 불가!' },
            { lines: [7, 9], color: 'amber', note: 'PLONK에서의 활용' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">활용 사례</h3>
        <CodePanel title="동형성 활용" code={APPLICATION_CODE}
          annotations={[
            { lines: [1, 4], color: 'violet', note: 'PLONK Verifier — 커밋 재구성' },
            { lines: [6, 9], color: 'sky', note: 'Confidential Tx — 잔액 검증' },
          ]} />
      </div>
    </section>
  );
}
