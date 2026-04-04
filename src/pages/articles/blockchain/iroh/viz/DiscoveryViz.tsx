import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const METHODS = [
  { label: 'DNS', color: '#6366f1', x: 55 },
  { label: 'mDNS', color: '#10b981', x: 165 },
  { label: 'PKARR/DHT', color: '#f59e0b', x: 275 },
];
const PY = 78;

const STEPS = [
  { label: 'DNS Discovery — TTL 기반', body: '_iroh.{base32(NodeId)}.iroh.link TXT 레코드 조회. 캐싱 + TTL 갱신.' },
  { label: 'mDNS — LAN 자동 발견', body: 'multicast UDP 224.0.0.251:5353. 설정 불필요, LAN 내 즉시 사용.' },
  { label: 'PKARR — DHT 분산 탐색', body: 'NodeId를 BitTorrent Mainline DHT key로 변환. 수억 DHT 노드 재사용.' },
  { label: '3가지 동시 탐색 → 최적 경로', body: '가장 먼저 도착한 주소로 연결 후, 더 좋은 경로 발견 시 업데이트.' },
];

export default function DiscoveryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="dv" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* methods */}
          {METHODS.map((m, i) => {
            const cur = i === step || step === 3;
            return (
              <g key={m.label}>
                <motion.rect x={m.x - 36} y={22} width={72} height={26} rx={6}
                  animate={{ fill: cur ? `${m.color}22` : `${m.color}06`,
                    stroke: m.color, strokeWidth: cur ? 2 : 0.8 }} transition={sp} />
                <text x={m.x} y={38} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={m.color} opacity={cur ? 1 : 0.3}>{m.label}</text>
              </g>
            );
          })}
          {/* target peer */}
          <motion.circle cx={165} cy={PY} r={12}
            animate={{ fill: step === 3 ? '#8b5cf620' : '#ffffff08',
              stroke: step === 3 ? '#8b5cf6' : 'var(--border)', strokeWidth: 1.5 }}
            transition={sp} />
          <text x={165} y={PY + 4} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="var(--foreground)">Peer</text>
          {/* arrows to peer */}
          {step <= 2 && (
            <motion.line x1={METHODS[step].x} y1={50} x2={165} y2={PY - 14}
              stroke={METHODS[step].color} strokeWidth={1.2} markerEnd="url(#dv)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp} />
          )}
          {step === 3 && METHODS.map((m, i) => (
            <motion.line key={i} x1={m.x} y1={50} x2={165} y2={PY - 14}
              stroke={m.color} strokeWidth={1} markerEnd="url(#dv)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ ...sp, delay: i * 0.1 }} />
          ))}
          {/* label */}
          {step === 3 && (
            <motion.text x={280} y={PY + 4} fontSize={10} fill="#8b5cf6" fontWeight={600}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>최적 경로 선택</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
