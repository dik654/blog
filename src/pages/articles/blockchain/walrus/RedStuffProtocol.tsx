import CodePanel from '@/components/ui/code-panel';
import RedStuffMatrixViz from './viz/RedStuffMatrixViz';
import {
  REDSTUFF_CODE, REDSTUFF_ANNOTATIONS,
  ENCODE_FLOW_CODE, ENCODE_FLOW_ANNOTATIONS,
} from './RedStuffProtocolData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function RedStuffProtocol({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="redstuff-protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'RedStuff 프로토콜 상세'}</h2>
      <div className="not-prose mb-8"><RedStuffMatrixViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>RedStuff</strong>는 2D Reed-Solomon 이레이저 코딩을
          기반으로 합니다. 블롭을 열(Primary)과 행(Secondary) 방향으로
          각각 RS 인코딩하여, n = 3f + 1 노드에서 f개 비잔틴 장애를 허용합니다.
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('walrus-blob-encoding', codeRefs['walrus-blob-encoding'])} />
            <span className="text-[10px] text-muted-foreground self-center">blob_encoding.rs</span>
            <CodeViewButton onClick={() => onCodeRef('walrus-config', codeRefs['walrus-config'])} />
            <span className="text-[10px] text-muted-foreground self-center">config.rs</span>
          </div>
        )}

        <h3>2D 코딩 구조</h3>
        <CodePanel title="RedStuff Primary / Secondary 슬라이버" code={REDSTUFF_CODE}
          annotations={REDSTUFF_ANNOTATIONS} />

        <h3>인코딩 흐름</h3>
        <CodePanel title="BlobEncoder 2D RS 인코딩 파이프라인" code={ENCODE_FLOW_CODE}
          annotations={ENCODE_FLOW_ANNOTATIONS} />
      </div>
    </section>
  );
}
