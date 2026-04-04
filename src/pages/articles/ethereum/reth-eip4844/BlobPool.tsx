import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobPoolDetailViz from './viz/BlobPoolDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobPool({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-pool" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlobPool 관리</h2>
      <div className="not-prose mb-8"><BlobPoolDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-validate', codeRefs['blob-validate'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_blob_sidecar()</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('tx-validate-stateless', codeRefs['tx-validate-stateless'])} />
          <span className="text-[10px] text-muted-foreground self-center">stateless 검증 — 포크, 크기, blob 개수</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('tx-validate-eip4844', codeRefs['tx-validate-eip4844'])} />
          <span className="text-[10px] text-muted-foreground self-center">stateful 검증 — KZG + re-org 처리</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>왜 2단계 검증?</strong> — stateless 검증으로 비용 없이 먼저 필터링.<br />
          KZG 검증(pairing 연산)은 비싸므로 stateful 단계에서만 수행합니다.
        </p>
      </div>
    </section>
  );
}
