import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const COLS = [
  { label: 'Advice', color: '#6366f1', desc: '증명자 비밀 증인' },
  { label: 'Fixed', color: '#10b981', desc: '셋업 시 고정 상수' },
  { label: 'Instance', color: '#f59e0b', desc: '공개 입력/출력' },
  { label: 'Selector', color: '#ec4899', desc: '게이트 활성화 on/off' },
];

const EXPR = [
  { label: 'Constant', ex: '상수 c', color: '#64748b' },
  { label: 'Selector', ex: 's(r)', color: '#ec4899' },
  { label: 'Advice', ex: 'a(r+rot)', color: '#6366f1' },
  { label: 'Sum/Product', ex: 'e1+e2, e1*e2', color: '#8b5cf6' },
];

const BW = 82, BH = 38, GAP = 14, OY = 20;
const bx = (i: number) => 16 + i * (BW + GAP);

const STEPS = [
  { label: 'Advice 열: 증명자의 비밀 증인 값', body: '증명 생성 시에만 채워지는 비밀 데이터. 검증자에게 노출되지 않습니다.' },
  { label: 'Fixed/Instance/Selector 열', body: 'Fixed=셋업 고정 상수, Instance=공개 입력, Selector=게이트 on/off 제어.' },
  { label: 'Expression<F>: 제약 표현식 트리', body: 'Constant, Selector, Advice/Fixed Query, Sum, Product, Negated, Scaled로 제약 조합.' },
  { label: '전체 구조: 열 + 표현식 + 게이트', body: '열에 값을 배치하고, Expression으로 게이트를 정의하며, Selector로 활성화합니다.' },
];

export default function Halo2CircuitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Column types */}
          {COLS.map((c, i) => {
            const highlight = step === 0 ? i === 0
              : step === 1 ? i > 0
              : step === 3;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: highlight || step === 3 ? 1 : 0.2, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <rect x={bx(i)} y={OY} width={BW} height={BH} rx={6}
                  fill={c.color + '18'} stroke={c.color}
                  strokeWidth={highlight ? 2 : 1} />
                <text x={bx(i) + BW / 2} y={OY + 15} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={c.color}>{c.label}</text>
                <text x={bx(i) + BW / 2} y={OY + 29} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">{c.desc}</text>
                {/* Column cells indicator */}
                {highlight && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
                    {[0, 1, 2].map(r => (
                      <rect key={r} x={bx(i) + 8 + r * 24} y={OY + BH + 6} width={20} height={10} rx={2}
                        fill={c.color + '20'} stroke={c.color} strokeWidth={0.5} />
                    ))}
                  </motion.g>
                )}
              </motion.g>
            );
          })}
          {/* Expression tree */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <text x={210} y={90} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" fontWeight={600}>
                Expression{'<F>'} 트리
              </text>
              {EXPR.map((e, i) => {
                const x = 50 + i * 95;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.06 }}>
                    <rect x={x} y={100} width={80} height={28} rx={5}
                      fill={e.color + '15'} stroke={e.color} strokeWidth={1} />
                    <text x={x + 40} y={112} textAnchor="middle"
                      fontSize={9} fontWeight={600} fill={e.color}>{e.label}</text>
                    <text x={x + 40} y={123} textAnchor="middle"
                      fontSize={9} fill="var(--muted-foreground)">{e.ex}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}
          {/* Gate connection at step 3 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={150} y={140} width={120} height={16} rx={8}
                fill="#8b5cf720" stroke="#8b5cf7" strokeWidth={1} />
              <text x={210} y={151} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#8b5cf6">Gate = Selector * Expr</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
