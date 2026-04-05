import CodePanel from '@/components/ui/code-panel';
import GossipSubViz from './viz/GossipSubViz';
import { protocols, gossipsubCode, holePunchingCode } from './ProtocolsData';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function LibP2PProtocols({ title, onCodeRef }: {
  title?: string; onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="protocols" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '내장 프로토콜'}</h2>
      <div className="not-prose mb-8"><GossipSubViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p는 P2P 네트워킹에 필요한 핵심 프로토콜을 모두 내장합니다.<br />
          각 프로토콜은 독립적인 크레이트로 분리돼 있어 필요한 것만 사용할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 mt-6">
        {protocols.map(p => (
          <div key={p.name} className="rounded-xl border p-4"
            style={{ borderColor: p.color + '30', background: p.color + '06' }}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono font-bold text-sm" style={{ color: p.color }}>{p.name}</p>
                <p className="text-xs text-foreground/50 font-mono mt-0.5">{p.proto}</p>
              </div>
              <span className="text-xs px-2 py-0.5 rounded border flex-shrink-0"
                style={{ borderColor: p.color + '40', color: p.color }}>
                {p.purpose}
              </span>
            </div>
            <p className="text-sm mt-2 text-foreground/75 leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('network-behaviour', codeRefs['network-behaviour'])} />
          <CodeViewButton onClick={() => onCodeRef('swarm-poll', codeRefs['swarm-poll'])} />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-8">
        <h3>GossipSub 메시지 전파</h3>
        <CodePanel title="GossipSub 설정 & 사용" code={gossipsubCode} annotations={[
          { lines: [2, 7], color: 'sky', note: '메시 파라미터 설정' },
          { lines: [12, 14], color: 'emerald', note: '토픽 구독' },
          { lines: [16, 17], color: 'amber', note: '메시지 발행' },
        ]} />

        <h3>Hole Punching (DCUtR)</h3>
        <CodePanel title="Hole Punching (DCUtR) 과정" code={holePunchingCode} annotations={[
          { lines: [3, 3], color: 'sky', note: '1단계: Relay 서버 경유 연결' },
          { lines: [9, 11], color: 'emerald', note: '2-3단계: 외부 주소 교환' },
          { lines: [13, 15], color: 'amber', note: '4단계: 동시 dial로 NAT 홀 생성' },
        ]} />

        <h3 className="text-xl font-semibold mt-6 mb-3">libp2p 주요 프로토콜 목록</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p 내장 프로토콜 카탈로그
//
// Discovery 계층:
//   - Kademlia DHT: 노드 탐색, content routing
//   - mDNS: 로컬 네트워크 발견
//   - Rendezvous: 중앙 만남의 장소
//   - Bootstrap: 초기 peer 목록
//
// Connectivity 계층:
//   - Ping: liveness check, RTT 측정
//   - Identify: peer 정보 교환 (protocols, addrs)
//   - AutoNAT: NAT 탐지
//   - Circuit Relay v2: NAT 우회
//   - DCUtR: Direct Connection Upgrade
//
// Pub/Sub 계층:
//   - GossipSub v1.1: 최신, scored mesh
//   - FloodSub: 모든 peers에 flood (deprecated)
//
// Stream Protocols:
//   - Yamux: stream multiplexer
//   - Mplex: simpler muxer (deprecated)
//   - Noise: encryption handshake
//   - TLS 1.3: alternative security
//
// Transport:
//   - TCP
//   - QUIC
//   - WebSocket, WSS
//   - WebTransport
//   - WebRTC

// Protocol ID 규칙:
//   /libp2p/identify/1.0.0
//   /libp2p/ping/1.0.0
//   /libp2p/circuit/relay/0.2.0/hop
//   /libp2p/dcutr
//   /meshsub/1.1.0
//   /kad/1.0.0
//
// 다중 버전 지원:
//   multistream-select로 협상
//   Upgrade path 자동 선택

// 실제 사용 예 (Ethereum 2.0):
//   Transport: TCP + Noise + Yamux
//   Security: Noise XX handshake
//   Identity: libp2p-identity (secp256k1)
//   Discovery: discv5 (external)
//   Pub/Sub: GossipSub v1.1
//   Kad: libp2p-kad for peer discovery

// IPFS 사용:
//   Transport: TCP, QUIC, WebTransport
//   Discovery: Kademlia DHT
//   Content routing: DHT
//   Block exchange: Bitswap
//   Pub/sub: GossipSub`}
        </pre>
      </div>
    </section>
  );
}
