import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { C1, C2, C3, STEPS, AXIOMS } from './GroupRingFieldData';

export default function GroupRingFieldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl"
          style={{ height: 'auto' }}>
          {step <= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {AXIOMS.map((a, i) => {
                const x = 30 + i * 95, y = 30;
                return (
                  <g key={a[0]}>
                    <rect x={x} y={y} width={85} height={50} rx={5}
                      fill={`${C1}10`} stroke={C1}
                      strokeWidth={step === 1 ? 1.2 : 0.8} />
                    <text x={x + 42} y={y + 20} textAnchor="middle"
                      fontSize={10} fontWeight={600} fill={C1}>{a[0]}</text>
                    <text x={x + 42} y={y + 38} textAnchor="middle"
                      fontSize={9} fill="var(--muted-foreground)">{a[1]}</text>
                  </g>
                );
              })}
              <text x={210} y={105} textAnchor="middle" fontSize={10}
                fill={C1}>{step === 0 ? '군의 4개 공리' : 'F7 덧셈군 예시'}</text>
            </motion.g>
          )}
          {(step === 2 || step === 3) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={50} y={25} width={140} height={45} rx={5}
                fill={`${C1}0a`} stroke={C1} strokeWidth={0.8} />
              <text x={120} y={50} textAnchor="middle" fontSize={10}
                fill={C1}>(R, +) 아벨군</text>
              <text x={215} y={50} fontSize={12}
                fill="var(--muted-foreground)">+</text>
              <rect x={230} y={25} width={140} height={45} rx={5}
                fill={`${C2}0a`} stroke={C2} strokeWidth={0.8} />
              <text x={300} y={45} textAnchor="middle" fontSize={10}
                fill={C2}>(R, .) 결합적</text>
              <text x={300} y={60} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">+ 분배법칙</text>
              {step === 3 && (
                <g>
                  <rect x={100} y={85} width={220} height={35} rx={5}
                    fill={`${C3}10`} stroke={C3} strokeWidth={0.8} />
                  <text x={210} y={107} textAnchor="middle" fontSize={10}
                    fill={C3}>1/3은 정수 아님 = 곱셈 역원 없음</text>
                </g>
              )}
            </motion.g>
          )}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={60} y={20} width={300} height={45} rx={6}
                fill={`${C3}10`} stroke={C3} strokeWidth={1.2} />
              <text x={210} y={40} textAnchor="middle" fontSize={10}
                fontWeight={600} fill={C3}>체(Field) = 환 + 곱셈 역원</text>
              <text x={210} y={56} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                0이 아닌 모든 원소 a에 대해 a x a^(-1) = 1
              </text>
              {step === 5 && (
                <g>
                  <rect x={80} y={80} width={120} height={40} rx={4}
                    fill={`${C1}0a`} stroke={C1} strokeWidth={0.8} />
                  <text x={140} y={97} textAnchor="middle" fontSize={9}
                    fill={C1}>3 x 5 = 1 (mod 7)</text>
                  <text x={140} y={111} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">3의 역원 = 5</text>
                  <rect x={220} y={80} width={120} height={40} rx={4}
                    fill={`${C2}0a`} stroke={C2} strokeWidth={0.8} />
                  <text x={280} y={97} textAnchor="middle" fontSize={9}
                    fill={C2}>6/3 = 6x5 = 2</text>
                  <text x={280} y={111} textAnchor="middle" fontSize={9}
                    fill="var(--muted-foreground)">정확한 나눗셈</text>
                </g>
              )}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
