import CodePanel from '@/components/ui/code-panel';
import WalrusMatrixViz from '../components/WalrusMatrixViz';
import RedStuffPipelineViz from './viz/RedStuffPipelineViz';
import {
  RS_CONFIG_CODE, RS_CONFIG_ANNOTATIONS,
  ENCODE_CODE, ENCODE_ANNOTATIONS,
  SLIVER_CODE, SLIVER_ANNOTATIONS,
} from './EncodingData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Encoding({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="encoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '블롭 인코딩 파이프라인'}</h2>
      <div className="not-prose mb-8">
        <RedStuffPipelineViz />
      </div>
      <div className="not-prose mb-8">
        <WalrusMatrixViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>BlobEncoder</code>는 원본 블롭을 2D Reed-Solomon 슬라이버 쌍으로 인코딩합니다.<br />
          실제 RS 연산은 <code>reed_solomon_simd</code> 크레이트를 통해 SIMD 최적화됩니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('walrus-blob-encoding', codeRefs['walrus-blob-encoding'])} />
            <span className="text-[10px] text-muted-foreground self-center">blob_encoding.rs</span>
            <CodeViewButton onClick={() => onCodeRef('walrus-slivers', codeRefs['walrus-slivers'])} />
            <span className="text-[10px] text-muted-foreground self-center">slivers.rs</span>
          </div>
        )}

        <h3>ReedSolomonEncodingConfig (config.rs)</h3>
        <CodePanel title="RS 인코딩 설정" code={RS_CONFIG_CODE} annotations={RS_CONFIG_ANNOTATIONS} />

        <h3>BlobEncoder::encode_with_metadata (blob_encoding.rs)</h3>
        <CodePanel title="2D 인코딩 파이프라인" code={ENCODE_CODE} annotations={ENCODE_ANNOTATIONS} />

        <h3>SliverPair & Symbols</h3>
        <CodePanel title="슬라이버 타입 정의" code={SLIVER_CODE} annotations={SLIVER_ANNOTATIONS} />
      </div>
    </section>
  );
}
