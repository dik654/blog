import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobGasDetailViz from './viz/BlobGasDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobGas({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-gas" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob Gas 가격 모델</h2>
      <div className="not-prose mb-8"><BlobGasDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-gas', codeRefs['blob-gas'])} />
          <span className="text-[10px] text-muted-foreground self-center">calc_blob_fee() & fake_exponential()</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-blob-gas', codeRefs['header-blob-gas'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_cancun_gas() — 헤더 검증</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>왜 정수 지수 함수?</strong> — fake_exponential()은 Taylor 급수로 정수만 사용.<br />
          부동소수점 사용 시 노드 간 미세한 차이 → 합의 실패 위험.
        </p>
      </div>
    </section>
  );
}
