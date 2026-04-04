import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '템플릿 구조', body: '템플릿은 입력/출력 시그널과 제약 조건으로 구성된 재사용 가능한 회로 블록입니다.' },
  { label: '시그널 흐름', body: 'input 시그널로 값을 받고, 제약을 통해 계산하며, output으로 결과를 내보냅니다.' },
  { label: '인스턴스화', body: 'component로 템플릿을 인스턴스화하면 실제 제약이 R1CS에 추가됩니다.' },
];

const BOXES = [
  { label: 'input a', color: '#0ea5e9', x: 10, y: 20 },
  { label: 'input b', color: '#0ea5e9', x: 10, y: 70 },
  { label: 'Multiplier2', color: '#8b5cf6', x: 110, y: 35 },
  { label: 'output c', color: '#10b981', x: 230, y: 45 },
];

const BW = 85, BH = 30;
const mid = (i: number) => ({ x: BOXES[i].x + BW / 2, y: BOXES[i].y + BH / 2 });
const VN: number[][] = [[0,1,2,3], [0,1,2], [2,3]];

export default function TemplateSignalViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {[[0,2],[1,2],[2,3]].map(([f,t], i) => {
            const a = mid(f), b = mid(t);
            const vis = VN[step].includes(f) && VN[step].includes(t);
            return (
              <motion.g key={i} animate={{ opacity: vis ? 1 : 0.08 }}>
                <line x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                  stroke="#666" strokeWidth={1.2} strokeDasharray="4 3" />
                {vis && (
                  <motion.circle r={3} fill={BOXES[f].color}
                    animate={{ cx: [a.x, b.x], cy: [a.y, b.y] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1 }} />
                )}
              </motion.g>
            );
          })}
          {BOXES.map((b, i) => (
            <motion.g key={b.label} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={b.x} y={b.y} width={BW} height={BH} rx={6}
                fill={`${b.color}12`} stroke={b.color} strokeWidth={1.5} />
              <text x={b.x+BW/2} y={b.y+BH/2+4} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={b.color}>{b.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
