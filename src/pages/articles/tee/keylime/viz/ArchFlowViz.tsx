import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Agent: EK/AIK를 Registrar에 등록' },
  { label: 'Tenant: Verifier에 에이전트 추가 요청' },
  { label: 'Verifier: Registrar에서 공개키 조회' },
  { label: 'Verifier: Agent에게 Quote 요청' },
  { label: 'Verifier: 정책 대비 검증 수행' },
];

const ANNOT = ['EK/AIK Registrar 등록', 'Tenant Verifier에 추가 요청', 'Registrar AIK 공개키 조회', '20B nonce Quote 요청', 'AIK 서명+PCR 정책 검증'];
const N = [
  { label: 'Agent', color: '#10b981', x: 50 },
  { label: 'Registrar', color: '#f59e0b', x: 140 },
  { label: 'Verifier', color: '#6366f1', x: 230 },
  { label: 'Tenant', color: '#8b5cf6', x: 320 },
];

const ARROWS: [number, number][] = [[0, 1], [3, 2], [2, 1], [2, 0], [2, 2]];

export default function ArchFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {N.map((n) => (
            <g key={n.label}>
              <rect x={n.x - 30} y={30} width={60} height={36} rx={8}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x} y={52} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={n.color}>{n.label}</text>
            </g>
          ))}
          {/* Active arrow */}
          {(() => {
            const [from, to] = ARROWS[step];
            const x1 = N[from].x; const x2 = N[to].x;
            return (
              <motion.line x1={x1} y1={70} x2={x2} y2={70}
                stroke={N[from].color} strokeWidth={2.5}
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.5 }} />
            );
          })()}
          {/* Moving packet */}
          <motion.circle r={6} fill={N[ARROWS[step][0]].color}
            animate={{ cx: N[ARROWS[step][1]].x, cy: 100 }}
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }} />
          <text x={N[ARROWS[step][1]].x} y={128} textAnchor="middle"
            fontSize={10} fill="var(--muted-foreground)">
            {['EK/AIK', '정책+페이로드', 'AIK 조회', 'Quote 요청', '검증'][step]}
          </text>
          <defs>
            <marker id="arrowhead" markerWidth={8} markerHeight={6} refX={8} refY={3} orient="auto">
              <path d="M0,0 L8,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
                  <motion.text x={385} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
