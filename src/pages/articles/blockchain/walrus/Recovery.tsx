import CodePanel from '@/components/ui/code-panel';
import WalrusRecoveryViz from '../components/WalrusRecoveryViz';
import {
  RECOVERY_SYMBOL_CODE, RECOVERY_SYMBOL_ANNOTATIONS,
  RECOVER_SLIVER_CODE, RECOVER_SLIVER_ANNOTATIONS,
  BLOB_RECOVERY_CODE, BLOB_RECOVERY_ANNOTATIONS,
} from './RecoveryData';

export default function Recovery({ title }: { title?: string }) {
  return (
    <section id="recovery" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '슬라이버 복구 & Merkle 검증'}</h2>
      <div className="not-prose mb-8">
        <WalrusRecoveryViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 저장 노드는 자신의 슬라이버 쌍을 이용해 다른 노드의 손실된 슬라이버를 돕는
          복구 심볼을 생성합니다. Blake2b256 Merkle 트리로 심볼 포함 증명을 첨부합니다.
        </p>

        <h3>복구 심볼 생성 (slivers.rs)</h3>
        <CodePanel title="복구 심볼 생성 함수" code={RECOVERY_SYMBOL_CODE} annotations={RECOVERY_SYMBOL_ANNOTATIONS} />

        <h3>슬라이버 복구 (reed-solomon 디코딩)</h3>
        <CodePanel title="RS 디코딩 기반 슬라이버 복구" code={RECOVER_SLIVER_CODE} annotations={RECOVER_SLIVER_ANNOTATIONS} />

        <h3>블롭 복구 전체 흐름</h3>
        <CodePanel title="클라이언트 블롭 읽기 흐름" code={BLOB_RECOVERY_CODE} annotations={BLOB_RECOVERY_ANNOTATIONS} />
      </div>
    </section>
  );
}
