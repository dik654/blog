import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import CrateLayerViz from './viz/CrateLayerViz';

export default function Overview({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const crates = [
    { name: 'librqbit', color: '#6366f1', desc: '핵심 라이브러리. 세션 관리, 토렌트 상태, HTTP API, 스토리지, 네트워킹 모듈을 통합.' },
    { name: 'dht', color: '#3b82f6', desc: 'Kademlia 알고리즘 기반 분산 해시 테이블. 피어 검색과 라우팅 테이블 관리.' },
    { name: 'peer_binary_protocol', color: '#10b981', desc: 'BitTorrent 피어 간 바이너리 프로토콜. 메시지 직렬화와 핸드셰이크 처리.' },
    { name: 'tracker_comms', color: '#f59e0b', desc: 'HTTP/UDP 트래커 프로토콜. Announce 요청, 피어 목록 수신, 멀티 트래커 지원.' },
  ];

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요</h2>
      <p className="leading-7 mb-6">
        rqbit은 Rust로 작성된 BitTorrent 클라이언트입니다.<br />
        14개 크레이트의 Cargo 워크스페이스로 구성된 모듈식 아키텍처를 채택합니다.<br />
        tokio 기반 비동기 I/O, DashMap(락프리 해시맵) 동시성, 제로카피 버퍼 처리가 핵심 원칙입니다.<br />
        CLI, HTTP API, 데스크톱 앱(Tauri), UPnP 미디어 서버까지 지원합니다.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {crates.map(c => (
          <div key={c.name} className="rounded-xl border p-4"
            style={{ borderColor: c.color + '40', background: c.color + '08' }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.name}</p>
            <p className="text-sm mt-2 text-foreground/80 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('session', codeRefs['session'])} />
          <CodeViewButton onClick={() => onCodeRef('managed-torrent-state', codeRefs['managed-torrent-state'])} />
        </div>
      )}

      <h3 className="text-lg font-semibold mb-3">크레이트 계층 구조</h3>
      <CrateLayerViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">rqbit 아키텍처 특징</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// rqbit - Modern Rust BitTorrent Client
//
// Design Goals:
//   - High performance (Rust async)
//   - Memory efficient (zero-copy)
//   - Modular (14 crates)
//   - Cross-platform (CLI, Desktop, Server)
//
// Key Technologies:
//   - tokio (async runtime)
//   - DashMap (lock-free concurrent HashMap)
//   - anyhow/thiserror (error handling)
//   - serde (serialization)
//   - axum (HTTP API)
//   - tauri (desktop app)

// Workspace Structure (14 crates):
//
//   Core:
//     librqbit        - main library
//     librqbit_core   - core types (Id20, TorrentMetadata)
//     buffers         - zero-copy buffer management
//
//   Networking:
//     dht             - Kademlia DHT
//     peer_binary_protocol - peer wire protocol
//     tracker_comms   - HTTP/UDP trackers
//     upnp            - UPnP port mapping
//
//   Protocol:
//     bencode         - Bencode serialization
//     sha1w           - SHA-1 hashing
//
//   UI/API:
//     crates/rqbit    - CLI binary
//     desktop         - Tauri desktop app
//     librqbit-upnp-serve - DLNA media server
//     bencode-editor-webui  - torrent editor

// vs Other BitTorrent Clients:
//
//   qBittorrent (C++): feature-rich, mature
//   Transmission (C): lightweight, widely packaged
//   Deluge (Python): extensible
//   WebTorrent (JS): browser-friendly
//   Leechers (Go): server-focused
//   rqbit (Rust): modern, performant

// Technical Highlights:
//
//   Zero-copy I/O:
//     Buffer pool with reuse
//     mmap for file access
//
//   Concurrent design:
//     DashMap for shared state
//     Actor-like task management
//     Backpressure handling
//
//   BEP Support:
//     BEP-3: Core protocol
//     BEP-5: DHT
//     BEP-6: Fast extension
//     BEP-9: Metadata exchange
//     BEP-10: Extension protocol
//     BEP-11: PEX (peer exchange)
//     BEP-14: LSD (local discovery)
//     BEP-15: UDP trackers
//     BEP-19: WebSeeds`}
        </pre>
      </div>
    </section>
  );
}
