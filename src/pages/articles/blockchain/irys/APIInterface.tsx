import CodePanel from '@/components/ui/code-panel';
import APILayerViz from './viz/APILayerViz';
import {
  API_ENDPOINTS_CODE, API_ENDPOINTS_ANNOTATIONS,
  GOSSIP_ENDPOINTS_CODE, GOSSIP_ENDPOINTS_ANNOTATIONS,
  INFO_RESPONSE_CODE, INFO_RESPONSE_ANNOTATIONS,
} from './APIInterfaceData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function APIInterface({ title, onCodeRef }: { title?: string; onCodeRef?: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="api-interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? 'REST API & RPC 인터페이스'}</h2>
      <div className="not-prose mb-8"><APILayerViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Irys는 <code>/v1</code> 경로 하위에 RESTful HTTP API를 제공합니다.<br />
          트랜잭션 제출, 청크 관리, 블록 조회, 가격 산정 등을 지원하며
          <strong>서명 기반 인증</strong>으로 무결성을 보장합니다.
        </p>

        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() => onCodeRef('irys-api-routes', codeRefs['irys-api-routes'])} />
            <span className="text-[10px] text-muted-foreground self-center">api-server/src/lib.rs</span>
            <CodeViewButton onClick={() => onCodeRef('irys-api-state', codeRefs['irys-api-state'])} />
            <span className="text-[10px] text-muted-foreground self-center">ApiState</span>
          </div>
        )}

        <h3>공개 API 엔드포인트</h3>
        <CodePanel title="REST API 엔드포인트 목록" code={API_ENDPOINTS_CODE}
          annotations={API_ENDPOINTS_ANNOTATIONS} />

        <h3>노드 정보 응답</h3>
        <CodePanel title="GET /info 응답 구조" code={INFO_RESPONSE_CODE}
          annotations={INFO_RESPONSE_ANNOTATIONS} />

        <h3>가십 내부 엔드포인트</h3>
        <CodePanel title="P2P 가십 엔드포인트 (/gossip)" code={GOSSIP_ENDPOINTS_CODE}
          annotations={GOSSIP_ENDPOINTS_ANNOTATIONS} />
      </div>
    </section>
  );
}
