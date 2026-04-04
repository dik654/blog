import CodePanel from '@/components/ui/code-panel';
import RoutingTableViz from './viz/RoutingTableViz';
import {
  kBucketCode, kBucketAnnotations,
  bucketUpdateCode, bucketUpdateAnnotations,
  bucketSplitCode, bucketSplitAnnotations,
} from './RoutingData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Routing({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="routing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'K-버킷 라우팅 테이블'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Kademlia의 라우팅 테이블은 <strong>k-버킷(k-bucket)</strong> 배열로 구성됩니다.<br />
          160비트(SHA-1) 또는 256비트(SHA-256) 공간에서 각 버킷은
          특정 비트 거리 범위의 노드들을 관리합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('geth-table-struct', codeRefs['geth-table-struct'])} />
            <span className="text-[10px] text-muted-foreground self-center">table.go — Table 구조체</span>
            <CodeViewButton onClick={() => onCodeRef('geth-bucket', codeRefs['geth-bucket'])} />
            <span className="text-[10px] text-muted-foreground self-center">bucket 구조체</span>
          </div>
        )}

        <h3>K-버킷 구조</h3>
        <CodePanel title="K-버킷 & 라우팅 테이블" code={kBucketCode} annotations={kBucketAnnotations} />

        <h3>버킷 업데이트 규칙</h3>
        <CodePanel title="노드 발견 시 버킷 업데이트" code={bucketUpdateCode} annotations={bucketUpdateAnnotations} />

        <p>
          이 규칙은 <strong>신뢰할 수 있는 오래된 노드를 우선</strong>합니다.<br />
          오래 살아있던 노드는 앞으로도 살아있을 가능성이 높기 때문입니다.<br />
          덕분에 네트워크가 매우 안정적인 라우팅 테이블을 유지합니다.
        </p>

        <h3>버킷 스플릿 (구현 최적화)</h3>
        <p>
          초기 구현에서는 모든 노드를 하나의 버킷에 넣다가
          가득 차면 둘로 나눕니다(자신의 노드 ID를 포함하는 버킷만).<br />
          처음에는 적은 메모리로 시작해 네트워크 참여가 늘수록 자연스럽게 확장됩니다.
        </p>
      </div>
      <div className="mt-8">
        <RoutingTableViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>버킷 스플릿 원리</h3>
        <CodePanel title="거리별 버킷 분포" code={bucketSplitCode} annotations={bucketSplitAnnotations} />
      </div>
    </section>
  );
}
