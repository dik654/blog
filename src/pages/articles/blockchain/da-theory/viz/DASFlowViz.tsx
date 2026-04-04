import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const STEPS = [
  { label: '블록 데이터를 다항식으로 인코딩', body: '블록 데이터를 유한체 위의 다항식 P(x)로 변환합니다.' },
  { label: 'KZG 커밋먼트 생성', body: 'P(x)에 대한 KZG 커밋먼트 C = [P(s)]_1을 블록 헤더에 포함합니다.' },
  { label: '라이트 노드가 랜덤 셀 요청', body: '라이트 노드가 랜덤 평가점 z에서 P(z)를 요청합니다.' },
  { label: 'KZG 증명으로 셀 유효성 검증', body: 'KZG opening proof π로 P(z)가 C와 일치하는지 O(1)에 검증합니다.' },
];
const GS = 24, PAD = 30;

export default function DASFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* polynomial representation */}
          <motion.path d="M30,80 Q80,30 150,45 T270,55 Q310,40 340,50"
            fill="none" stroke={C[0]} strokeWidth={1.2}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: step >= 0 ? 1 : 0 }}
            transition={{ duration: 0.7 }} />
          <text x={345} y={45} fontSize={10} fill={C[0]} fontWeight={600}>P(x)</text>
          {/* KZG commitment */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={60} y={10} width={100} height={22} rx={4}
                fill={`${C[1]}15`} stroke={C[1]} strokeWidth={1.2} />
              <text x={110} y={24} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[1]}>C = [P(s)]_1</text>
              <text x={110} y={8} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">KZG Commitment</text>
            </motion.g>
          )}
          {/* sample points */}
          {step >= 2 && [80, 150, 230].map((x, i) => {
            const y = 40 + (i % 2) * 25 + 10;
            return (
              <motion.g key={i} initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring' }}>
                <circle cx={x} cy={y} r={6} fill={`${C[2]}30`}
                  stroke={C[2]} strokeWidth={1.5} />
                <text x={x} y={y + 3} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={C[2]}>z{i + 1}</text>
              </motion.g>
            );
          })}
          {/* verification */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={200} y={95} width={140} height={22} rx={4}
                fill={`${C[1]}15`} stroke={C[1]} strokeWidth={1.2} />
              <text x={270} y={109} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C[1]}>
                e(π, [s-z]) = e(C-[v], G)
              </text>
              <text x={270} y={125} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">페어링 검증 O(1)</text>
            </motion.g>
          )}
          {/* grid background for context */}
          {Array.from({ length: 4 }).map((_, i) => (
            <rect key={i} x={PAD + i * (GS + 3)} y={105} width={GS} height={GS} rx={3}
              fill={step >= 2 && i % 2 === 0 ? `${C[2]}20` : 'var(--border)'}
              stroke={step >= 2 && i % 2 === 0 ? C[2] : 'var(--border)'}
              strokeWidth={0.5} opacity={0.3} />
          ))}
        </svg>
      )}
    </StepViz>
  );
}
