import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '밸리데이터 노드 (Validator)', body: '합의 계층에 참여해 블록을 제안하고 투표합니다. 스테이킹 보증금이 필요합니다.' },
  { label: '컴퓨트 노드 (Compute Worker)', body: 'ParaTime 트랜잭션을 실행합니다. 기밀 런타임은 SGX/TDX 하드웨어가 필수입니다.' },
  { label: '키 매니저 노드 (Key Manager)', body: '기밀 런타임의 암호화 키를 관리합니다. SGX 엔클레이브 내에서 실행됩니다.' },
  { label: '클라이언트 노드 (Client / Seed)', body: '상태를 조회하고 트랜잭션을 제출합니다. P2P 네트워크 연결을 지원합니다.' },
];

const NODES = [
  { label: 'Validator', sub: '합의 참여', color: '#6366f1', icon: '⚙', y: 30 },
  { label: 'Compute', sub: 'TX 실행', color: '#10b981', icon: '▶', y: 30 },
  { label: 'Key Mgr', sub: '키 관리', color: '#f59e0b', icon: '🔑', y: 30 },
  { label: 'Client', sub: '조회/제출', color: '#6366f1', icon: '📡', y: 30 },
];

export default function NodeTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const x = 70 + i * 120;
            const active = i === step;
            const done = i < step;
            return (
              <g key={n.label}>
                <motion.rect x={x - 48} y={n.y} width={96} height={68} rx={8}
                  fill={active ? `${n.color}18` : `${n.color}08`}
                  stroke={active ? n.color : `${n.color}40`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: done ? 0.35 : active ? 1 : 0.25 }}
                  transition={{ duration: 0.3 }} />
                <text x={x} y={n.y + 28} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill={active ? n.color : 'var(--foreground)'}>{n.label}</text>
                <text x={x} y={n.y + 46} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{n.sub}</text>
              </g>
            );
          })}
          {/* connection line to consensus */}
          <rect x={20} y={120} width={500} height={28} rx={6}
            fill="#6366f108" stroke="#6366f130" strokeWidth={0.8} />
          <text x={270} y={138} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">Oasis 합의 네트워크 (P2P)</text>
          {NODES.map((n, i) => {
            const x = 70 + i * 120;
            return (
              <motion.line key={`ln-${i}`} x1={x} y1={98} x2={x} y2={120}
                stroke={i === step ? n.color : 'var(--border)'} strokeWidth={1}
                strokeDasharray="3,3"
                animate={{ opacity: i <= step ? 0.8 : 0.2 }}
                transition={{ duration: 0.3 }} />
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
