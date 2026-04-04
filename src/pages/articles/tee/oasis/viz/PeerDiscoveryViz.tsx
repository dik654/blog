import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Bootstrap Discovery: 시드 노드 기반', body: '초기 부트스트랩 시드 노드에 연결. RetentionPeriod 동안 피어 정보 보존. 네트워크 진입점 역할.' },
  { label: 'Registry Discovery: 합의 레지스트리 기반', body: '합의 레지스트리에서 프로토콜별 피어를 검색. connectMany()로 limit 수만큼 병렬 연결 수립.' },
  { label: 'DHT Discovery: 분산 해시 테이블 기반', body: 'FindPeers(ctx, topic)으로 토픽별 피어 검색. 중앙 서버 없이 분산 방식으로 동작.' },
];

const METHODS = [
  { label: 'Bootstrap', sub: '시드 노드', color: '#6366f1', x: 90 },
  { label: 'Registry', sub: '합의 레지스트리', color: '#10b981', x: 270 },
  { label: 'DHT', sub: '분산 해시 테이블', color: '#f59e0b', x: 450 },
];

export default function PeerDiscoveryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* center node */}
          <circle cx={270} cy={30} r={16} fill="var(--card)" stroke="var(--border)" strokeWidth={1.2} />
          <text x={270} y={34} textAnchor="middle" fontSize={10} fontWeight={600}
            fill="var(--foreground)">Node</text>

          {METHODS.map((m, i) => {
            const active = i === step;
            return (
              <g key={m.label}>
                <motion.line x1={270} y1={46} x2={m.x} y2={72}
                  stroke={active ? m.color : 'var(--border)'}
                  strokeWidth={active ? 1.5 : 0.6} strokeDasharray={active ? '0' : '4,4'}
                  animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }} />
                <motion.rect x={m.x - 60} y={72} width={120} height={48} rx={8}
                  fill={active ? `${m.color}18` : `${m.color}06`}
                  stroke={active ? m.color : `${m.color}30`}
                  strokeWidth={active ? 2 : 0.6}
                  animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3 }} />
                <text x={m.x} y={93} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={active ? m.color : 'var(--muted-foreground)'}>{m.label}</text>
                <text x={m.x} y={110} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{m.sub}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
