import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CALL_STEPS } from './CallFlowVizData';
import { CodeViewButton } from '@/components/code';

const C = '#3b82f6';
const R = 24;

const NODES = [
  { x: 52,  y: 34, lines: ['Depth', 'Check'] },
  { x: 148, y: 34, lines: ['Balance', 'Check'] },
  { x: 244, y: 34, lines: ['State', 'Snapshot'] },
  { x: 340, y: 34, lines: ['Value', 'Transfer'] },
  { x: 436, y: 34, lines: ['Code', 'Check'] },
  { x: 436, y: 114, lines: ['Run()', ''] },
  { x: 322, y: 114, lines: ['Error?', 'Revert'] },
  { x: 208, y: 114, lines: ['Return', ''] },
];

const EDGES: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7]];
/* 각 step에 대응하는 코드 참조 키 */
const STEP_REFS = ['evm-call', 'evm-call', 'evm-call', 'evm-call', 'evm-call', 'interp-run', 'evm-call', 'evm-call'];
const STEP_LABELS = ['evm.go — Call() L5-7', 'evm.go — Call() L9-11', 'evm.go — Call() L13', 'evm.go — Call() L16-17', 'evm.go — Call() L19-29', 'interpreter.go — Run()', 'evm.go — Call() L33-35', 'evm.go — Call() 반환'];

function edgeLine(fi: number, ti: number) {
  const f = NODES[fi], t = NODES[ti];
  const dx = t.x - f.x, dy = t.y - f.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len, uy = dy / len;
  return { x1: f.x + ux * (R + 1), y1: f.y + uy * (R + 1), x2: t.x - ux * (R + 7), y2: t.y - uy * (R + 7) };
}

export default function CallFlowViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={CALL_STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 490 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti], i) => {
              const past = i < step, cur = i === step;
              const e = edgeLine(fi, ti);
              return (
                <line key={`e${i}`} {...e}
                  stroke={cur || past ? C : 'var(--border)'}
                  strokeWidth={cur ? 1.2 : 0.6}
                  opacity={past ? 0.5 : cur ? 1 : 0.2}
                  markerEnd={cur ? 'url(#cfA)' : undefined} />
              );
            })}
            <path d={`M${436},${34 + R} C${470},${74} ${470},${74} ${436},${114 - R}`}
              stroke="var(--border)" strokeWidth={0.5} fill="none" strokeDasharray="3,2"
              opacity={step === 4 ? 0.7 : 0.15} />
            <text x={476} y={76} fontSize={10} fill="var(--muted-foreground)"
              opacity={step === 4 ? 1 : 0.2}>len==0</text>
            {NODES.map((n, i) => {
              const past = i < step, cur = i === step, active = cur || past;
              return (
                <motion.g key={i} animate={{ scale: cur ? 1.06 : 1 }}
                  style={{ transformOrigin: `${n.x}px ${n.y}px` }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                  <circle cx={n.x} cy={n.y} r={R}
                    fill={cur ? `${C}22` : active ? `${C}0a` : 'var(--background)'}
                    stroke={active ? C : 'var(--border)'} strokeWidth={cur ? 1.6 : 0.8} />
                  <text x={n.x} y={n.lines[1] ? n.y - 3 : n.y + 3} textAnchor="middle"
                    fontSize={7.5} fontWeight={cur ? 700 : 400}
                    fill={active ? C : 'var(--muted-foreground)'}>{n.lines[0]}</text>
                  {n.lines[1] && (
                    <text x={n.x} y={n.y + 9} textAnchor="middle" fontSize={10}
                      fontWeight={cur ? 600 : 400}
                      fill={active ? C : 'var(--muted-foreground)'}>{n.lines[1]}</text>
                  )}
                </motion.g>
              );
            })}
            <defs>
              <marker id="cfA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill={C} />
              </marker>
            </defs>
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
              <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
