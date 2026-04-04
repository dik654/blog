import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { WORDS, ONE_HOT, DENSE, STEPS, CELL, GAP } from './OneHotVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const OH_C = '#ef4444';
const DN_C = '#10b981';

export default function OneHotViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* One-Hot section */}
          <text x={10} y={14} fontSize={9} fontWeight={600}
            fill={step <= 1 ? OH_C : '#666'}>One-Hot (V=4)</text>
          {WORDS.map((w, row) => (
            <motion.g key={`oh-${row}`} animate={{ opacity: step <= 1 ? 1 : 0.2 }} transition={sp}>
              <text x={10} y={32 + row * 20} fontSize={9} fill={OH_C}>{w}</text>
              {ONE_HOT[row].map((v, col) => (
                <g key={`oh-${row}-${col}`}>
                  <rect x={55 + col * (CELL + GAP)} y={22 + row * 20} width={CELL} height={14} rx={2}
                    fill={v ? OH_C + '30' : '#80808010'} stroke={v ? OH_C : '#555'} strokeWidth={v ? 1.5 : 0.5} />
                  <text x={55 + col * (CELL + GAP) + CELL / 2} y={33 + row * 20} textAnchor="middle"
                    fontSize={9} fill={v ? OH_C : '#666'} fontWeight={v ? 700 : 400}>{v}</text>
                </g>
              ))}
            </motion.g>
          ))}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={200} y={38} width={100} height={18} rx={4} fill={OH_C + '15'} stroke={OH_C} strokeWidth={1} />
              <text x={250} y={50} textAnchor="middle" fontSize={9} fill={OH_C} fontWeight={600}>
                cos sim = 0.00
              </text>
            </motion.g>
          )}
          {/* Dense section */}
          <text x={10} y={112} fontSize={9} fontWeight={600}
            fill={step >= 2 ? DN_C : '#666'}>Dense (d=3)</text>
          {WORDS.map((w, row) => (
            <motion.g key={`dn-${row}`} animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
              <text x={10} y={128 + row * 14} fontSize={9} fill={DN_C}>{w}</text>
              {DENSE[row].map((v, col) => {
                const bw = Math.abs(v) * 50;
                const x0 = 60 + col * 70;
                return (
                  <g key={`dn-${row}-${col}`}>
                    <rect x={x0} y={120 + row * 14} width={50} height={10} rx={2}
                      fill="#80808008" stroke="#555" strokeWidth={0.5} />
                    <rect x={x0} y={120 + row * 14} width={bw} height={10} rx={2}
                      fill={v >= 0 ? DN_C + '40' : OH_C + '30'} />
                    <text x={x0 + 25} y={128 + row * 14} textAnchor="middle" fontSize={9}
                      fill={step >= 2 ? DN_C : '#999'}>{v.toFixed(2)}</text>
                  </g>
                );
              })}
            </motion.g>
          ))}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={290} y={124} width={140} height={16} rx={4} fill={DN_C + '15'} stroke={DN_C} strokeWidth={1.5} />
              <text x={360} y={135} textAnchor="middle" fontSize={9} fill={DN_C} fontWeight={600}>
                cos(고양이,강아지) = 0.98
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
