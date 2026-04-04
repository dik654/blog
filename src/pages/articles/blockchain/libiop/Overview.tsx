import CodePanel from '@/components/ui/code-panel';
import IOPArchViz from './viz/IOPArchViz';
import { IOP_ARCH_CODE, PCP_IOP_CODE } from './OverviewData';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">IOP 개요</h2>
      <div className="not-prose mb-8">
        <IOPArchViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>libiop</strong>는 Interactive Oracle Proof(IOP) 기반
          zkSNARK 프로토콜들의 참조 구현체입니다.<br />
          Aurora, Ligero, Fractal 세 가지 프로토콜을 지원하며,
          모두 <strong>투명 셋업</strong>(trusted setup 불필요)과
          <strong>양자 후 보안성</strong>을 제공합니다.
        </p>
        <h3>PCP에서 IOP로의 발전</h3>
        <CodePanel
          title="PCP vs IOP 비교"
          code={PCP_IOP_CODE}
          annotations={[
            { lines: [2, 3], color: 'sky', note: 'PCP: 정적 증명, 상수 쿼리' },
            { lines: [6, 9], color: 'emerald', note: 'IOP: 다중 라운드 상호작용' },
            { lines: [12, 12] as [number, number], color: 'amber', note: '모듈화와 효율성 개선' },
          ]}
        />
        <h3>libiop 코드 구조</h3>
        <CodePanel
          title="libiop/ 디렉토리 구조"
          code={IOP_ARCH_CODE}
          annotations={[
            { lines: [2, 5], color: 'sky', note: 'Aurora / Ligero / Fractal 프로토콜' },
            { lines: [6, 8], color: 'emerald', note: 'FRI 및 Direct LDT' },
            { lines: [10, 11], color: 'amber', note: 'R1CS 제약 시스템' },
          ]}
        />
      </div>
    </section>
  );
}
