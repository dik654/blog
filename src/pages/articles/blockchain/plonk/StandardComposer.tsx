import CodePanel from '@/components/ui/code-panel';
import ComposerFlowViz from './viz/ComposerFlowViz';
import { SELECTORS_CODE, VAR_MGMT_CODE, BUILD_FLOW_CODE } from './StandardComposerData';

export default function StandardComposer() {
  return (
    <section id="standard-composer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StandardComposer 구조</h2>
      <div className="not-prose mb-8"><ComposerFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">선택자와 와이어 벡터</h3>
        <p>StandardComposer는 <strong>6개 선택자 벡터</strong>와 <strong>4개 와이어 벡터</strong>를 관리한다. 게이트가 추가될 때마다 각 벡터에 값이 push된다.</p>
        <CodePanel
          title="선택자 / 와이어 벡터"
          code={SELECTORS_CODE}
          annotations={[
            { lines: [1, 7], color: 'sky', note: '6개 선택자 — 게이트 동작 결정' },
            { lines: [9, 12], color: 'emerald', note: '4개 와이어 — 입출력 값' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">변수 관리와 게이트 추가</h3>
        <p><code className="bg-accent px-1.5 py-0.5 rounded text-sm">alloc()</code>으로 변수를 등록하고, <code className="bg-accent px-1.5 py-0.5 rounded text-sm">poly_gate()</code>로 와이어와 선택자를 동시에 확정한다.</p>
        <CodePanel
          title="변수 관리 + 게이트 추가"
          code={VAR_MGMT_CODE}
          annotations={[
            { lines: [1, 4], color: 'sky', note: '변수 할당 (zero, private, public)' },
            { lines: [6, 10], color: 'emerald', note: 'poly_gate — 벡터 push + permutation 갱신' },
          ]}
        />

        <h3 className="text-xl font-semibold mt-6 mb-3">회로 구성 과정</h3>
        <CodePanel
          title="회로 구성 흐름"
          code={BUILD_FLOW_CODE}
          annotations={[
            { lines: [1, 2], color: 'sky', note: '① Variable 생성' },
            { lines: [4, 8], color: 'emerald', note: '② 게이트 추가 (빌더 패턴)' },
            { lines: [10, 11], color: 'amber', note: '③ Permutation map 등록' },
          ]}
        />
      </div>
    </section>
  );
}
