import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import CodePanel from '@/components/ui/code-panel';
import HolePunchViz from './viz/HolePunchViz';
import QUICArchFlowViz from './viz/QUICArchFlowViz';
import { codeRefs } from './codeRefs';
import { PREPARE_SEND_CODE, PREPARE_SEND_ANNOTATIONS } from './NetworkingData';

export default function Networking({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="networking" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">QUIC &amp; Hole Punching</h2>
      <div className="not-prose mb-8"><QUICArchFlowViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          iroh의 전송 계층은 <strong>QUIC</strong>(Quinn 구현)을 사용합니다.<br />
          QUIC은 UDP 기반이므로 빠른 연결 설정, 헤드-오브-라인 블로킹 없는 스트림 멀티플렉싱,
          연결 이동(IP 변경 시 재연결 불필요)을 제공합니다.
        </p>

        <h3>QUIC 핸드셰이크 커스터마이징</h3>
        <p>
          일반 QUIC은 X.509 인증서를 사용하지만, iroh는 Ed25519 공개키를 직접 자체 서명 인증서로
          변환해 사용합니다. TLS 1.3 상호 인증 구조이므로 클라이언트와 서버 모두 공개키로 식별됩니다.
          <code>NodeId</code> = 공개키이므로, IP 주소 없이 <code>NodeId</code>만으로 연결 상대를
          지정할 수 있습니다.
        </p>

        <h3>연결 상태 추적</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('connection-struct', codeRefs['connection-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Connection&lt;State&gt;</span>
          <CodeViewButton onClick={() => onCodeRef('incoming-addr', codeRefs['incoming-addr'])} />
          <span className="text-[10px] text-muted-foreground self-center">IncomingAddr</span>
        </div>

        <h3>Hole Punching — DISCO 프로토콜</h3>
        <p>
          두 노드가 모두 NAT 뒤에 있을 때, 직접 UDP 연결을 만들기 위해{' '}
          <strong>DISCO (DIrect COnnection) 프로토콜</strong>을 사용합니다.
        </p>
        <ul>
          <li><code>Ping</code> — 후보 주소로 연결성 테스트 요청</li>
          <li><code>Pong</code> — 응답 + 관찰된 송신자 IP:Port(NAT 매핑 정보)</li>
          <li><code>CallMeMaybe</code> — 후보 주소 목록을 relay 경유로 전달</li>
        </ul>

        <h3>병렬 경로 전송</h3>
        <p>
          iroh는 hole punching 진행 중에도 <strong>relay와 직접 UDP를 동시에</strong> 시도합니다.<br />
          직접 연결이 성공하면 relay 경로는 조용히 사라집니다.
        </p>
        <CodePanel title="경로 선택 알고리즘" code={PREPARE_SEND_CODE} annotations={PREPARE_SEND_ANNOTATIONS} />
      </div>
      <div className="mt-8">
        <HolePunchViz />
      </div>
    </section>
  );
}
