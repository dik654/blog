import Libp2pLayerViz from './viz/Libp2pLayerViz';
import Libp2pStackFlowViz from './viz/Libp2pStackFlowViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function Overview({ onCodeRef }: {
  title?: string;
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">rust-libp2p Swarm 아키텍처</h2>

      {/* 계층 구조 시각화 */}
      <div className="not-prose mb-8"><Libp2pLayerViz /></div>
      <div className="not-prose mb-8"><Libp2pStackFlowViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          libp2p는 모듈형 P2P 네트워킹 프레임워크다.<br />
          IPFS, Ethereum, Polkadot, Filecoin 등에서 사용한다.<br />
          이 아티클에서는 Rust 구현체의 <strong>Swarm 내부 구조</strong>를
          함수 단위로 추적한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          핵심 인사이트: Swarm = 중앙 조율자
        </h3>
        <p>
          Swarm은 Transport, ConnectionPool, NetworkBehaviour 세 계층을
          하나의 이벤트 루프로 통합한다.
          <code>poll_next_event()</code> 한 함수 안에서
          Behaviour → Pool → Transport 순서로 폴링한다.
        </p>
        <p>
          <strong>왜 이런 설계인가?</strong>{' '}
          모든 계층이 비동기 <code>poll()</code> 기반이라
          단일 루프에서 수천 개의 연결을 처리할 수 있다.<br />
          OS 스레드가 아닌 Future 하나로 전체 네트워크 스택을 구동한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          세 가지 핵심 트레이트
        </h3>
        <ul>
          <li>
            <strong>Transport</strong> — 물리적 연결 추상화.
            TCP/QUIC/WebSocket을 동일한 인터페이스로 사용
          </li>
          <li>
            <strong>NetworkBehaviour</strong> — 프로토콜 로직 추상화.
            Kademlia, GossipSub 등이 구현. 연결당 Handler를 생성
          </li>
          <li>
            <strong>ConnectionHandler</strong> — 연결 내 서브스트림 관리.
            Behaviour에서 내려온 명령을 실제 스트림 I/O로 변환
          </li>
        </ul>

        {/* 소스 코드 참조 버튼 */}
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton
              onClick={() => onCodeRef('swarm-struct', codeRefs['swarm-struct'])}
            />
            <span className="text-[10px] text-muted-foreground self-center">
              Swarm 구조체
            </span>
            <CodeViewButton
              onClick={() => onCodeRef('transport-trait', codeRefs['transport-trait'])}
            />
            <span className="text-[10px] text-muted-foreground self-center">
              Transport 트레이트
            </span>
            <CodeViewButton
              onClick={() => onCodeRef('network-behaviour', codeRefs['network-behaviour'])}
            />
            <span className="text-[10px] text-muted-foreground self-center">
              NetworkBehaviour 트레이트
            </span>
          </div>
        )}

        <p className="text-sm text-muted-foreground mt-4">
          아래 섹션에서 각 트레이트의 내부 구현과
          Swarm 이벤트 루프의 poll 순서를 코드 수준으로 추적한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">libp2p 생태계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// libp2p Ecosystem (2024)
//
// Language Implementations:
//
//   go-libp2p (reference):
//     - Most mature
//     - Used by IPFS Kubo, Lotus (Filecoin)
//     - Full protocol support
//
//   rust-libp2p:
//     - Type safety, performance
//     - Used by Parity, Substrate, Forest
//     - Active development
//
//   js-libp2p:
//     - Browser + Node.js
//     - Used by Helia (IPFS v2)
//     - WebRTC, WebSocket primary
//
//   py-libp2p: Python (less mature)
//   jvm-libp2p: Java/Kotlin (Lodestar)
//   nim-libp2p: Nim (Nimbus ETH)
//   zig-libp2p: Zig (experimental)

// Production Users:
//
//   Blockchain:
//     - IPFS / Filecoin (Protocol Labs)
//     - Ethereum 2.0 Consensus (Lighthouse, Prysm, Teku)
//     - Polkadot / Kusama (Parity)
//     - Near Protocol
//     - Solana (partial)
//     - Celestia
//
//   Other:
//     - Radicle (P2P git)
//     - Berty (messaging)
//     - Drand (randomness beacon)
//     - Pulsar
//     - iroh (alt IPFS)

// Protocol Modules:
//
//   Transport:
//     tcp, quic, websocket, webtransport, memory
//
//   Security:
//     noise, tls
//
//   Muxer:
//     yamux, mplex
//
//   Core Protocols:
//     identify, ping, autonat
//     kad (Kademlia DHT)
//     gossipsub, floodsub
//     rendezvous
//     relay (circuit), dcutr
//     mdns
//
//   Advanced:
//     request-response
//     stream (generic)
//     upnp (port forwarding)

// libp2p 공통 개념:
//   PeerId = hash(public_key)
//   Multiaddr = layered addressing
//   Multistream-select = protocol negotiation
//   Swarm = central event loop
//   NetworkBehaviour = app logic
//   ConnectionHandler = per-connection state`}
        </pre>
      </div>
    </section>
  );
}
