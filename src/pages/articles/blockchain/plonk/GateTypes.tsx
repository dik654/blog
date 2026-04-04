import CodePanel from '@/components/ui/code-panel';
import GateTypesViz from './viz/GateTypesViz';
import { ARITH_CODE, RANGE_CODE, LOGIC_CODE, ECC_CODE, LOOKUP_CODE } from './GateTypesData';

export default function GateTypes() {
  return (
    <section id="gate-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">게이트 타입 상세</h2>
      <div className="not-prose mb-8"><GateTypesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">산술 게이트</h3>
        <p>모든 게이트의 기본. <strong>4개 와이어</strong>와 <strong>6개 선택자</strong>로 임의 산술 관계를 표현한다.</p>
        <CodePanel title="산술 게이트" code={ARITH_CODE}
          annotations={[{ lines: [1, 2], color: 'sky', note: '확장된 범용 게이트 등식' }]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">범위 게이트</h3>
        <p>값이 특정 범위 내에 있음을 증명. <strong>4비트 쿼드 분해</strong>로 효율적으로 검증한다.</p>
        <CodePanel title="범위 게이트" code={RANGE_CODE}
          annotations={[{ lines: [1, 3], color: 'emerald', note: '쿼드 분해 방식' }]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">논리 게이트</h3>
        <CodePanel title="논리 게이트 (AND / XOR)" code={LOGIC_CODE}
          annotations={[{ lines: [1, 2], color: 'amber', note: 'AND, XOR 비트 연산' }]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">ECC 게이트</h3>
        <CodePanel title="타원곡선 그룹 덧셈" code={ECC_CODE}
          annotations={[
            { lines: [1, 3], color: 'violet', note: '고정 기반 — 테이블 룩업' },
            { lines: [5, 7], color: 'sky', note: '가변 기반 — 완전 덧셈 공식' },
          ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">룩업 게이트</h3>
        <CodePanel title="PlonkUp 룩업" code={LOOKUP_CODE}
          annotations={[{ lines: [1, 3], color: 'rose', note: 'Plookup 통합 게이트' }]} />
      </div>
    </section>
  );
}
