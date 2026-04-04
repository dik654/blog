import ProveCoreViz from './viz/ProveCoreViz';
import CodePanel from '@/components/ui/code-panel';
import {
  PROVE_CORE_CODE, proveCoreAnnotations,
  SYNC_CODE, syncAnnotations,
} from './STARKProvingData';

export default function STARKProving() {
  return (
    <section id="stark-proving" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">STARK 증명 생성</h2>
      <div className="not-prose mb-8"><ProveCoreViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>prove_core</code>는 <strong>3-Phase 스트리밍 파이프라인</strong>으로
          동작합니다. Phase 1(체크포인트)이 완료된 샤드부터
          즉시 Phase 2(레코드 생성)와 Phase 3(증명 생성)을 시작해
          메모리 사용량을 최소화합니다.
        </p>
        <CodePanel title="prove_core 3-Phase 파이프라인" code={PROVE_CORE_CODE}
          annotations={proveCoreAnnotations} />
        <p>
          Phase 간 동기화는 <strong>Channel</strong> 기반입니다.<br />
          체크포인트가 완료되면 채널을 통해 다음 Phase에 전달되며,
          전체 실행 추적을 메모리에 보관하지 않아도 됩니다.
        </p>
        <CodePanel title="Phase 간 동기화" code={SYNC_CODE}
          annotations={syncAnnotations} />
      </div>
    </section>
  );
}
