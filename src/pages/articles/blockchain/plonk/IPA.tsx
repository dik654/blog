import CodePanel from '@/components/ui/code-panel';
import IPAViz from './viz/IPAViz';
import { IPA_CONCEPT_CODE, FOLD_CODE, COMPARISON_CODE, HALO_CODE } from './IPAData';

export default function IPA() {
  return (
    <section id="ipa" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Inner Product Argument</h2>
      <div className="not-prose mb-8"><IPAViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">IPA란?</h3>
        <p>KZG의 대안으로, <strong>Trusted Setup 없이</strong> 다항식 commitment를 구현한다. 페어링 대신 이산 로그 가정만 사용한다.</p>
        <CodePanel title="IPA 개념" code={IPA_CONCEPT_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '내적 관계 증명' },
            { lines: [4, 6], color: 'emerald', note: 'KZG와의 핵심 차이' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">재귀적 축소 (Recursive Halving)</h3>
        <p>벡터를 반으로 접어 <strong>log(n)</strong> 라운드만에 스칼라 1개로 축소한다.</p>
        <CodePanel title="재귀적 절반 축소" code={FOLD_CODE}
          annotations={[
            { lines: [1, 6], color: 'sky', note: 'L,R 커밋 + 챌린지로 fold' },
            { lines: [8, 9], color: 'amber', note: '최종: 스칼라 1개' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">KZG vs IPA</h3>
        <CodePanel title="KZG vs IPA 비교" code={COMPARISON_CODE}
          annotations={[
            { lines: [2, 6], color: 'violet', note: '각 방식의 트레이드오프' },
            { lines: [8, 9], color: 'emerald', note: 'IPA 기반 시스템들' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">Halo 트릭</h3>
        <p>IPA의 O(n) 검증 비용을 <strong>accumulator로 지연</strong>시켜 재귀 합성을 가능하게 한다.</p>
        <CodePanel title="Halo — IPA 재귀" code={HALO_CODE}
          annotations={[
            { lines: [1, 3], color: 'sky', note: 'O(n) 검증 지연' },
            { lines: [5, 7], color: 'emerald', note: '재귀적 증명 체인' },
          ]} />
      </div>
    </section>
  );
}
