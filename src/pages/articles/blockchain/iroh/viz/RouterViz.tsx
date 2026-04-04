import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const HANDLERS = [
  { alpn: 'iroh-blobs/0', name: 'Blob', color: '#6366f1', y: 22 },
  { alpn: 'iroh-gossip/0', name: 'Gossip', color: '#10b981', y: 46 },
  { alpn: 'iroh-docs/0', name: 'Docs', color: '#f59e0b', y: 70 },
  { alpn: 'my-app/1', name: 'Custom', color: '#8b5cf6', y: 94 },
];

const STEPS = [
  { label: 'BlobProtocol — 콘텐츠 주소 검증', body: '청크 단위 병렬 다운로드. Blake3 해시로 무결성 검증.' },
  { label: 'GossipProtocol — topic pub-sub', body: '토픽 기반 메시지 브로드캐스트. 팬아웃 전파.' },
  { label: 'DocsProtocol — CRDT 동기화', body: 'CRDT 기반 키-값 문서 동기화. 오프라인 편집 지원.' },
  { label: 'CustomHandler — 사용자 프로토콜', body: 'accept() 구현만으로 등록 가능. ALPN 기반 자동 라우팅.' },
];

export default function RouterViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="rt" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* QUIC box */}
          <motion.rect x={10} y={38} width={56} height={40} rx={6}
            animate={{ fill: '#0ea5e910', stroke: '#0ea5e9', strokeWidth: 1 }} transition={sp} />
          <text x={38} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill="#0ea5e9">QUIC</text>
          <text x={38} y={65} textAnchor="middle" fontSize={9} fill="#0ea5e9" opacity={0.5}>TLS 1.3</text>

          {/* Router box */}
          <motion.rect x={90} y={38} width={56} height={40} rx={6}
            animate={{ fill: '#3b82f610', stroke: '#3b82f6', strokeWidth: 1.5 }} transition={sp} />
          <text x={118} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">Router</text>
          <text x={118} y={65} textAnchor="middle" fontSize={9} fill="#3b82f6" opacity={0.5}>ALPN</text>

          {/* arrow QUIC → Router */}
          <line x1={68} y1={58} x2={88} y2={58}
            stroke="var(--border)" strokeWidth={0.8} markerEnd="url(#rt)" />

          {/* Handlers */}
          {HANDLERS.map((h, i) => {
            const cur = i === step;
            return (
              <g key={h.alpn}>
                <motion.rect x={175} y={h.y} width={150} height={20} rx={5}
                  animate={{ fill: cur ? `${h.color}22` : `${h.color}06`,
                    stroke: h.color, strokeWidth: cur ? 2 : 0.5 }} transition={sp} />
                <text x={195} y={h.y + 13} fontSize={9} fill={h.color} opacity={0.6}>{h.alpn}</text>
                <text x={290} y={h.y + 13} fontSize={10} fontWeight={600} fill={h.color}
                  opacity={cur ? 1 : 0.4}>{h.name}</text>
                {/* Router → handler */}
                <motion.line x1={148} y1={58} x2={173} y2={h.y + 10}
                  stroke={h.color} strokeWidth={cur ? 1.5 : 0.5} markerEnd="url(#rt)"
                  animate={{ opacity: cur ? 0.7 : 0.1 }} transition={sp} />
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
