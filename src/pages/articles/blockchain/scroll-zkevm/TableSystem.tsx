import TableFlowViz from './viz/TableFlowViz';
import CodePanel from '@/components/ui/code-panel';
import {
  RW_TABLE_CODE, rwAnnotations,
  TABLE_OVERVIEW_CODE, overviewAnnotations,
} from './TableSystemData';

export default function TableSystem() {
  return (
    <section id="table-system" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">테이블 시스템</h2>
      <div className="not-prose mb-8"><TableFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          테이블 시스템은 zkEVM의 여러 회로 간에 <strong>데이터를 공유하고 검증</strong>하는
          핵심 메커니즘입니다. 한 회로가 테이블에 데이터를 기록(write)하면,
          다른 회로가 <code>lookup_any</code>로 해당 데이터의 존재를 증명합니다.
        </p>
        <h3 className="text-lg font-semibold mt-6 mb-3">RwTable — 핵심 테이블</h3>
        <p>
          RwTable은 <strong>12개 컬럼</strong>으로 EVM 실행 중 발생하는 모든 읽기/쓰기 연산을
          순서대로 기록합니다. rw_counter로 전역 순서를 보장하고,
          tag(Stack/Memory/Storage)로 연산 유형을 구분합니다.
        </p>
        <CodePanel title="RwTable 구조체" code={RW_TABLE_CODE}
          annotations={rwAnnotations} />
        <h3 className="text-lg font-semibold mt-6 mb-3">전체 테이블 타입</h3>
        <CodePanel title="테이블 타입 요약" code={TABLE_OVERVIEW_CODE}
          annotations={overviewAnnotations} />
      </div>
    </section>
  );
}
