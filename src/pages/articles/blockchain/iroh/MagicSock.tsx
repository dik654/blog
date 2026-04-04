import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import CodePanel from '@/components/ui/code-panel';
import PathRoutingViz from './viz/PathRoutingViz';
import { codeRefs } from './codeRefs';
import { NODE_MAP_CODE, NODE_MAP_ANNOTATIONS, TRANSPORTS_CODE, TRANSPORTS_ANNOTATIONS } from './MagicSockData';

export default function MagicSock({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="magicsock" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MagicSock — 스마트 라우팅</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <code>MagicSock</code>은 iroh의 네트워킹 핵심입니다. QUIC 레이어에서 보면
          일반 UDP 소켓처럼 보이지만, 내부적으로 직접 UDP 경로와 relay 경로를 동시에 관리하며
          네트워크 조건에 따라 패킷을 최적 경로로 라우팅합니다.
        </p>

        <h3>실제 소스 코드 탐색</h3>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('transports-struct', codeRefs['transports-struct'])} />
          <span className="text-[10px] text-muted-foreground self-center">Transports struct</span>
          <CodeViewButton onClick={() => onCodeRef('poll-recv-fairness', codeRefs['poll-recv-fairness'])} />
          <span className="text-[10px] text-muted-foreground self-center">poll_recv 공정성</span>
          <CodeViewButton onClick={() => onCodeRef('path-selection', codeRefs['path-selection'])} />
          <span className="text-[10px] text-muted-foreground self-center">PathSelectionData</span>
          <CodeViewButton onClick={() => onCodeRef('remote-map', codeRefs['remote-map'])} />
          <span className="text-[10px] text-muted-foreground self-center">RemoteMap</span>
        </div>

        <h3>주소 매핑 시스템</h3>
        <p>
          QUIC는 IP:Port 주소를 기반으로 동작하지만, iroh는 NodeId로 피어를 식별합니다.<br />
          이 불일치를 해결하기 위해 <strong>가상 주소 매핑</strong>을 사용합니다:
        </p>
        <CodePanel title="NodeMap 가상 주소 매핑" code={NODE_MAP_CODE} annotations={NODE_MAP_ANNOTATIONS} />

        <h3>전송 계층 구조</h3>
        <p>
          MagicSock은 IPv4/IPv6 UDP 소켓과 relay WebSocket을 <code>Transports</code> 구조체로
          통합 관리합니다. 공정한 수신을 위해 라운드로빈 폴링을 사용합니다.
        </p>
        <CodePanel title="Transports 통합 소켓 관리" code={TRANSPORTS_CODE} annotations={TRANSPORTS_ANNOTATIONS} />

        <h3>경로 선택 알고리즘</h3>
        <p>
          매 패킷 전송 시 최적 경로를 결정합니다. Primary 전송(IP)이 Backup(Relay)보다
          우선하며, 같은 타입 내에서는 biased RTT가 낮은 경로를 선택합니다.
        </p>
      </div>
      <div className="mt-8">
        <PathRoutingViz />
      </div>
    </section>
  );
}
