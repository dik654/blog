import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Protocol', sub: '이벤트 발행', color: '#6366f1' },
  { label: 'Kafka', sub: '메시지 큐', color: '#10b981' },
  { label: 'Ender', sub: '온체인 처리', color: '#f59e0b' },
  { label: 'PostgreSQL', sub: '데이터 저장', color: '#8b5cf6' },
  { label: 'Comlink', sub: 'API / WS', color: '#ec4899' },
];

const STEPS = [
  { label: 'Protocol 이벤트', body: '블록 처리 중 체결, 주문 업데이트, 가격 변경 등의 이벤트 발생' },
  { label: 'Kafka 전달', body: 'Apache Kafka를 통해 비동기적으로 Indexer 서비스에 전달' },
  { label: 'Ender 처리', body: 'Ender가 온체인 이벤트를 파싱하여 구조화된 데이터로 변환' },
  { label: 'PostgreSQL 저장', body: '변환된 데이터가 PostgreSQL에 저장되고 인덱싱' },
  { label: 'API 서빙', body: 'Comlink(REST)과 Socks(WebSocket)이 클라이언트에 데이터를 제공합니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };

export default function IndexerFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 65" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="if-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {NODES.map((n, i) => {
            const x = 10 + i * 94, w = 80, h = 38;
            const active = step === i;
            const vis = step === 0 || step === i;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.15 }} transition={sp}>
                <rect x={x} y={14} width={w} height={h} rx={5}
                  fill={active ? n.color + '22' : '#ffffff08'}
                  stroke={n.color} strokeWidth={active ? 2 : 0.8} />
                <text x={x + w / 2} y={29} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={n.color}>{n.label}</text>
                <text x={x + w / 2} y={44} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{n.sub}</text>
                {i < 4 && (
                  <text x={x + w + 7} y={36} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)" opacity={0.5}>→</text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
