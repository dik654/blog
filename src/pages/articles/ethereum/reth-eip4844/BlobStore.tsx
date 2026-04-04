import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobStoreViz from './viz/BlobStoreViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobStore({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-store" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobStore 저장소</h2>
      <div className="not-prose mb-8"><BlobStoreViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('disk-blobstore', codeRefs['disk-blobstore'])} />
          <span className="text-[10px] text-muted-foreground self-center">DiskFileBlobStore — 디스크 + LRU 캐시</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('disk-inner-ops', codeRefs['disk-inner-ops'])} />
          <span className="text-[10px] text-muted-foreground self-center">insert_one / get_one 내부 구현</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('mem-blobstore', codeRefs['mem-blobstore'])} />
          <span className="text-[10px] text-muted-foreground self-center">InMemoryBlobStore — 테스트용</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>왜 지연 삭제?</strong> — 삭제 시점에 파일 lock을 잡으면 삽입/조회 성능이 저하됩니다.<br />
          txs_to_delete에 모아두고 cleanup()에서 일괄 삭제합니다.
        </p>
      </div>
    </section>
  );
}
