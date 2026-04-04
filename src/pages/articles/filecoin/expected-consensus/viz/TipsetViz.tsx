import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Epoch N: 3개 블록 동시 생성' },
  { label: 'Epoch N-1: 2개 블록 Tipset' },
  { label: 'Tipset 체인 연결 (가중치 기반)' },
  { label: 'EC vs F3 확정성 비교' },
];
const ANNOT = ['Poisson 복수 마이너 당선', '2명 당선 시 2블록 Tipset', '최대 weight 체인 선택', 'EC ~7.5h vs F3 수 분'];
const BLK_C = '#6366f1', W_C = '#f59e0b', F3_C = '#10b981', EC_C = '#ef4444';
const EPOCHS = [
  { y: 20, blocks: 3, w: 378 },
  { y: 65, blocks: 2, w: 245 },
  { y: 110, blocks: 1, w: 120 },
];

export default function TipsetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= 2 && EPOCHS.map((ep, ei) => {
            const active = (step === 0 && ei === 0) || (step === 1 && ei === 1) || step === 2;
            return (
              <motion.g key={ei} animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.3 }}>
                <text x={20} y={ep.y + 18} fontSize={10} fill="currentColor" fillOpacity={0.35}>
                  E{['N', 'N-1', 'N-2'][ei]}
                </text>
                {Array.from({ length: ep.blocks }).map((_, bi) => {
                  const bx = 60 + bi * 90;
                  return (
                    <motion.rect key={bi} x={bx} y={ep.y} width={78} height={30} rx={6}
                      fill={BLK_C + (active ? '20' : '0a')} stroke={BLK_C}
                      strokeWidth={active ? 2 : 1} strokeOpacity={active ? 0.8 : 0.2}
                      initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: ei * 0.1 + bi * 0.05 }} />
                  );
                })}
                <text x={370} y={ep.y + 18} textAnchor="end" fontSize={10} fill={W_C} fillOpacity={0.6}>
                  w={ep.w}
                </text>
                {/* chain arrow */}
                {ei < 2 && (
                  <motion.line x1={200} y1={ep.y + 32} x2={200} y2={EPOCHS[ei + 1].y - 2}
                    stroke="currentColor" strokeOpacity={step === 2 ? 0.3 : 0.1} strokeWidth={1.5}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3 }} />
                )}
              </motion.g>
            );
          })}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[{ n: 'EC (기존)', t: '~7.5시간', ep: 900, c: EC_C, x: 50 },
                { n: 'F3 (신규)', t: '수 분', ep: 10, c: F3_C, x: 230 }].map(f => (
                <motion.g key={f.n} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                  <rect x={f.x} y={25} width={140} height={70} rx={10}
                    fill={f.c + '12'} stroke={f.c} strokeWidth={1.5} />
                  <text x={f.x + 70} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill={f.c}>{f.n}</text>
                  <text x={f.x + 70} y={70} textAnchor="middle" fontSize={14} fontWeight={600} fill={f.c}>{f.t}</text>
                  <text x={f.x + 70} y={86} textAnchor="middle" fontSize={10} fill={f.c} fillOpacity={0.5}>
                    {f.ep} epochs
                  </text>
                </motion.g>
              ))}
              <text x={200} y={125} textAnchor="middle" fontSize={10} fill="currentColor" fillOpacity={0.3}>
                F3: BFT 기반 빠른 최종성 레이어
              </text>
            </motion.g>
          )}
                  <motion.text x={405} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
