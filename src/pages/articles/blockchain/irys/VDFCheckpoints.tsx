import CodePanel from '@/components/ui/code-panel';
import CheckpointVerifyViz from './viz/CheckpointVerifyViz';
import {
  CHECKPOINT_CODE, CHECKPOINT_ANNOTATIONS,
  PARALLEL_VERIFY_CODE, PARALLEL_ANNOTATIONS,
  RESET_CODE, RESET_ANNOTATIONS,
} from './VDFCheckpointsData';

export default function VDFCheckpoints({ title }: { title?: string }) {
  return (
    <section id="vdf-checkpoints" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'VDF 체크포인트 시스템'}</h2>
      <div className="not-prose mb-8"><CheckpointVerifyViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          VDF 체크포인트는 순차 해시 계산의 중간 결과를 기록하여
          <strong>검증자가 전체 재계산 없이 구간별 병렬 검증</strong>을 가능하게 합니다.
        </p>

        <h3>체크포인트 검증</h3>
        <CodePanel title="VDF 체크포인트 순차 검증" code={CHECKPOINT_CODE}
          annotations={CHECKPOINT_ANNOTATIONS} />

        <h3>병렬 검증 최적화</h3>
        <CodePanel title="Rayon 기반 병렬 체크포인트 검증" code={PARALLEL_VERIFY_CODE}
          annotations={PARALLEL_ANNOTATIONS} />

        <h3>VDF 리셋 메커니즘</h3>
        <CodePanel title="주기적 VDF 시드 리셋" code={RESET_CODE}
          annotations={RESET_ANNOTATIONS} />
      </div>
    </section>
  );
}
