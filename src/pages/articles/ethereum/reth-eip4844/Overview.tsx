import ContextViz from './viz/ContextViz';
import BlobTxViz from './viz/BlobTxViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob TX 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          EIP-4844는 롤업의 데이터 비용을 줄이기 위한 Blob TX를 도입합니다.<br />
          이 아티클에서는 reth 코드베이스의 blob 저장소, TX 검증, 가스 가격을 추적합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mt-4">
          <CodeViewButton onClick={() => onCodeRef('blobstore-trait', codeRefs['blobstore-trait'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlobStore 트레이트 — 저장소 인터페이스</span>
        </div>
      </div>
      <div className="not-prose mt-6"><BlobTxViz /></div>
    </section>
  );
}
