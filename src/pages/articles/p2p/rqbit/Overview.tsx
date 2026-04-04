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
    </section>
  );
}
