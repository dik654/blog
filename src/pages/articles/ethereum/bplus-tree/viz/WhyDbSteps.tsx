import { motion } from 'framer-motion';
import { CacheMVCCStep, RealWorldStep } from './WhyDbStepsParts';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

function DiskIOStep() {
  return (
    <svg viewBox="0 0 480 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C1}>
        디스크 I/O 비교
      </text>
      <rect x={20} y={30} width={90} height={40} rx={6}
        fill={`${C1}08`} stroke={C1} strokeWidth={0.8} />
      <text x={65} y={54} textAnchor="middle" fontSize={10} fill={C1}>4KB 페이지</text>
      <rect x={140} y={30} width={130} height={40} rx={5}
        fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
      <text x={205} y={46} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="var(--foreground)">BST</text>
      <text x={205} y={62} textAnchor="middle" fontSize={10}
        fill="var(--muted-foreground)">높이 20 = 20 I/O</text>
      <rect x={300} y={30} width={150} height={40} rx={5}
        fill={`${C2}08`} stroke={C2} strokeWidth={0.8} />
      <text x={375} y={46} textAnchor="middle" fontSize={10} fontWeight={600}
        fill={C2}>B+tree</text>
      <text x={375} y={62} textAnchor="middle" fontSize={10} fill={C2}>
        높이 4 = 4 I/O
      </text>
      <motion.text x={240} y={100} textAnchor="middle" fontSize={11} fontWeight={600} fill={C2}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        5배 더 적은 디스크 접근 (100M 레코드 기준)
      </motion.text>
    </svg>
  );
}

function RangeQueryStep() {
  return (
    <svg viewBox="0 0 480 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C2}>
        범위 쿼리: Leaf 연결 리스트
      </text>
      {[30, 145, 260, 375].map((x, i) => (
        <g key={i}>
          <rect x={x} y={35} width={85} height={28} rx={4}
            fill={i >= 1 && i <= 2 ? `${C2}15` : `${C2}06`}
            stroke={C2} strokeWidth={i >= 1 && i <= 2 ? 1.2 : 0.5} />
          <text x={x + 42} y={53} textAnchor="middle" fontSize={10}
            fill="var(--foreground)">{['5,8', '10,15', '20,25', '30,40'][i]}</text>
          {i < 3 && (
            <motion.line x1={x + 85} y1={49} x2={x + 115} y2={49}
              stroke={C2} strokeWidth={1} markerEnd="url(#arrWD)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.2 + i * 0.15 }} />
          )}
        </g>
      ))}
      <text x={240} y={82} textAnchor="middle" fontSize={10} fill={C3}>
        WHERE key BETWEEN 10 AND 25 = 2 leaf 스캔 O(k)
      </text>
      <text x={240} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        해시 테이블: 전체 스캔 O(n) 필요
      </text>
      <defs>
        <marker id="arrWD" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C2} />
        </marker>
      </defs>
    </svg>
  );
}

export default function WhyDbSteps({ step }: { step: number }) {
  return [<DiskIOStep />, <RangeQueryStep />, <CacheMVCCStep />, <RealWorldStep />][step];
}
