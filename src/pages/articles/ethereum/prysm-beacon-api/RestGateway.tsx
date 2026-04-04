import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function RestGateway({ onCodeRef }: Props) {
  return (
    <section id="rest-gateway" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">REST Gateway</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">gRPC-gateway 변환</h3>
        <p>
          HTTP 요청을 gRPC 호출로 자동 변환한다.<br />
          protobuf 정의에서 <code>google.api.http</code> 어노테이션으로 매핑 규칙을 선언.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Beacon API 스펙</h3>
        <p>
          <code>GET /eth/v2/beacon/blocks/{'{block_id}'}</code> — 블록 조회<br />
          <code>GET /eth/v2/debug/beacon/states/{'{state_id}'}</code> — 상태 조회<br />
          <code>POST /eth/v1/beacon/blocks</code> — 블록 제출
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('get-block-v2', codeRefs['get-block-v2'])} />
          <span className="text-[10px] text-muted-foreground self-center">GetBlockV2()</span>
          <CodeViewButton onClick={() => onCodeRef('get-state-v2', codeRefs['get-state-v2'])} />
          <span className="text-[10px] text-muted-foreground self-center">GetStateV2()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 응답 포맷 자동 전환</strong> — Accept: application/octet-stream → SSZ 바이너리 응답<br />
          기본값은 JSON, 포크 버전에 따라 응답 구조체가 자동 변경<br />
          클라이언트가 원하는 포맷과 포크를 헤더로 지정
        </p>
      </div>
    </section>
  );
}
