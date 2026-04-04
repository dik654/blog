import ShardPipelineViz from './viz/ShardPipelineViz';
import CodePanel from '@/components/ui/code-panel';
import {
  RECORD_CODE, recordAnnotations,
  SHARD_CODE, shardAnnotations,
  PARALLEL_CODE, parallelAnnotations,
} from './ShardParallelData';

export default function ShardParallel() {
  return (
    <section id="shard-parallel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">샤드 분할 &amp; 병렬 처리</h2>
      <div className="not-prose mb-8"><ShardPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          SP1은 긴 실행 추적을 <strong>~400만 사이클</strong> 단위 샤드로 분할합니다.<br />
          각 샤드의 <code>ExecutionRecord</code>는 독립적이므로
          <strong>rayon</strong>을 통해 완전 병렬로 증명을 생성합니다.
        </p>
        <CodePanel title="ExecutionRecord 구조체" code={RECORD_CODE}
          annotations={recordAnnotations} />
        <CodePanel title="샤드 분할 (bump_shard)" code={SHARD_CODE}
          annotations={shardAnnotations} />
        <CodePanel title="병렬 증명 생성" code={PARALLEL_CODE}
          annotations={parallelAnnotations} />
      </div>
    </section>
  );
}
