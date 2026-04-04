import CodePanel from '@/components/ui/code-panel';
import PlookupViz from './viz/PlookupViz';
import { MOTIVATION_CODE, SORTED_MERGE_CODE, PROTOCOL_CODE, GRAND_PRODUCT_CODE } from './PlookupData';

export default function Plookup() {
  return (
    <section id="plookup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Plookup (Lookup Argument)</h2>
      <div className="not-prose mb-8"><PlookupViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 Lookup이 필요한가?</h3>
        <p>PLONK 게이트만으로 range check(<code className="bg-accent px-1.5 py-0.5 rounded text-sm">0 ≤ x &lt; 256</code>)를 하면 비트 분해에 약 16개 제약이 필요하다.
        <br />
          Plookup(Lookup Argument, 테이블 조회 논증)은 테이블 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">T = {'{'}0..255{'}'}</code>에서 한 번의 lookup으로 1개 제약으로 줄인다.</p>
        <CodePanel
          title="PLONK vs Plookup 제약 수 비교"
          code={MOTIVATION_CODE}
          annotations={[
            { lines: [1, 2], color: 'rose', note: 'PLONK: 비트 분해 필요' },
            { lines: [4, 5], color: 'emerald', note: 'Plookup: 테이블 1회 lookup' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어: 정렬된 병합</h3>
        <p>f의 모든 원소가 T에 있음을 <strong>&quot;f와 T를 T의 순서로 정렬할 수 있다&quot;</strong>는 것으로 환원한다.</p>
        <CodePanel
          title="정렬된 병합 아이디어"
          code={SORTED_MERGE_CODE}
          annotations={[
            { lines: [1, 2], color: 'emerald', note: '멤버십 성공 → 정렬 가능' },
            { lines: [4, 5], color: 'rose', note: '멤버십 실패 → 정렬 불가능' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">프로토콜 단계</h3>
        <CodePanel
          title="Plookup 프로토콜"
          code={PROTOCOL_CODE}
          annotations={[
            { lines: [3, 3], color: 'sky', note: '정렬된 병합 (핵심 단계)' },
            { lines: [4, 5], color: 'amber', note: '중첩 분리로 연속성 보장' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">Grand Product 검증</h3>
        <p>permutation argument와 동일한 패턴으로, 곱의 텔레스코핑으로 정렬의 올바름을 증명한다.</p>
        <CodePanel
          title="Grand Product 검증"
          code={GRAND_PRODUCT_CODE}
          annotations={[
            { lines: [3, 4], color: 'emerald', note: 'accumulator 계산' },
            { lines: [6, 7], color: 'violet', note: '텔레스코핑으로 f ⊆ t 증명' },
          ]}
        />
        <p>h₁, h₂는 증명자가 제공하는 witness이며, KZG로 commit된다. 연속 원소 쌍 <code className="bg-accent px-1.5 py-0.5 rounded text-sm">(sᵢ, sᵢ₊₁)</code>의 관계가 멤버십을 보장한다.</p>
      </div>
    </section>
  );
}
