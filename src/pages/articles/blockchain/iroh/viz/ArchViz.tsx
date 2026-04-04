import { useState } from 'react';

const COMPONENTS = [
  {
    id: 'endpoint',
    label: 'Endpoint',
    x: 160, y: 30,
    color: '#6366f1',
    desc: 'iroh 노드의 중앙 관리자. connect() / accept() API 진입점. ALPN 프로토콜 협상, Discovery 통합, TLS 설정을 담당한다.',
  },
  {
    id: 'magicsock',
    label: 'MagicSock',
    x: 60, y: 130,
    color: '#0ea5e9',
    desc: 'UDP 소켓 관리 및 패킷 라우팅. 직접 UDP 경로와 Relay 경로를 동시에 유지하며, 더 좋은 경로 발견 시 자동 전환한다. Tailscale magicsock 기반.',
  },
  {
    id: 'discovery',
    label: 'Discovery',
    x: 260, y: 130,
    color: '#10b981',
    desc: 'NodeId → 주소 해석. DNS Discovery, mDNS(로컬 네트워크), Pkarr/BitTorrent DHT 세 가지 방식을 통합. publish/resolve/subscribe 인터페이스.',
  },
  {
    id: 'relay',
    label: 'Relay System',
    x: 60, y: 230,
    color: '#f59e0b',
    desc: 'hole-punching 실패 시 패킷 중계. HTTP → WebSocket → 커스텀 프로토콜 순으로 업그레이드. relay 서버는 패킷 내용을 볼 수 없음(암호화).',
  },
  {
    id: 'tls',
    label: 'TLS / Crypto',
    x: 260, y: 230,
    color: '#ec4899',
    desc: 'Ed25519 공개키 기반 상호 인증. NodeId = 공개키. TLS 핸드셰이크에서 인증서 없이 공개키 직접 사용. 세션 키 관리 & 0-RTT 지원.',
  },
];

const EDGES = [
  ['endpoint', 'magicsock'],
  ['endpoint', 'discovery'],
  ['magicsock', 'relay'],
  ['endpoint', 'tls'],
  ['discovery', 'relay'],
];

function cx(id: string) { return (COMPONENTS.find(c => c.id === id)?.x ?? 0) + 50; }
function cy(id: string) { return (COMPONENTS.find(c => c.id === id)?.y ?? 0) + 18; }

export default function ArchViz() {
  const [active, setActive] = useState<string | null>(null);
  const sel = COMPONENTS.find(c => c.id === active);

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <p className="text-xs text-foreground/50 mb-3 text-center">컴포넌트 클릭 → 상세 설명</p>
      <svg viewBox="0 0 380 300" className="w-full max-w-2xl mx-auto block" style={{ height: 240 }}>
        {EDGES.map(([a, b]) => (
          <line key={`${a}-${b}`} x1={cx(a)} y1={cy(a)} x2={cx(b)} y2={cy(b)}
            stroke="currentColor" strokeOpacity={0.15} strokeWidth={1.5} />
        ))}
        {COMPONENTS.map(c => (
          <g key={c.id} onClick={() => setActive(active === c.id ? null : c.id)}
            className="cursor-pointer">
            <rect x={c.x} y={c.y} width={100} height={36} rx={8}
              fill={c.color} fillOpacity={active === c.id ? 0.9 : 0.2}
              stroke={c.color} strokeWidth={active === c.id ? 2 : 1}
              className="transition-all duration-200" />
            <text x={c.x + 50} y={c.y + 22} textAnchor="middle"
              fontSize={11} fontWeight={600}
              fill={active === c.id ? '#fff' : c.color}>
              {c.label}
            </text>
          </g>
        ))}
      </svg>
      {sel ? (
        <div className="mt-3 rounded-lg border border-border/60 bg-background/60 px-4 py-3 text-sm">
          <span className="font-semibold" style={{ color: sel.color }}>{sel.label}</span>
          <p className="mt-1 text-foreground/80 leading-relaxed">{sel.desc}</p>
        </div>
      ) : (
        <p className="mt-3 text-xs text-foreground/40 text-center">위 컴포넌트를 클릭하세요</p>
      )}
    </div>
  );
}
