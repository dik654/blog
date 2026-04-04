import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, C, STEP_REFS } from './RLPEncodingVizData';

const B = ({ x, y, w, text, color, show }: {
  x: number; y: number; w: number; text: string; color: string; show: boolean;
}) => (
  <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
    <rect x={x} y={y} width={w} height={26} rx={4}
      fill={`${color}18`} stroke={color} strokeWidth={1.2} />
    <text x={x + w / 2} y={y + 16} textAnchor="middle" fontSize={11}
      fontWeight="600" fill={color}>{text}</text>
  </motion.g>
);

export default function RLPEncodingViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(s) => (
        <div className="w-full">
          <svg viewBox="0 0 460 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <B x={160} y={10} w={140} text="첫 바이트 검사" color={C.dim} show={s === 0} />
            <B x={20} y={50} w={120} text="0x00~0x7f 단일값" color={C.byte} show={s <= 1} />
            <B x={170} y={50} w={120} text="0x80~0xb7 문자열" color={C.str} show={s <= 2} />
            <B x={320} y={50} w={120} text="0xc0~0xf7 리스트" color={C.list} show={s <= 3} />
            {s === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={80} y={98} textAnchor="middle" fontSize={11} fontFamily="monospace"
                  fill={C.byte}>0x42</text>
                <text x={80} y={116} textAnchor="middle" fontSize={11} fill={C.dim}>
                  입력 = 출력 (접두사 없음)</text>
              </motion.g>
            )}
            {s === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={130} y={90} width={30} height={22} rx={3}
                  fill={`${C.str}30`} stroke={C.str} strokeWidth={1} />
                <text x={145} y={105} textAnchor="middle" fontSize={11} fontFamily="monospace"
                  fill={C.str}>0x83</text>
                <text x={232} y={105} textAnchor="middle" fontSize={11} fill={C.dim}>
                  &quot;dog&quot; (3바이트)</text>
              </motion.g>
            )}
            {s === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={130} y={90} width={30} height={22} rx={3}
                  fill={`${C.list}30`} stroke={C.list} strokeWidth={1} />
                <text x={145} y={105} textAnchor="middle" fontSize={11} fontFamily="monospace"
                  fill={C.list}>0xc8</text>
                <text x={260} y={105} textAnchor="middle" fontSize={11} fill={C.list}>
                  [&quot;cat&quot;, &quot;dog&quot;] → 8바이트</text>
              </motion.g>
            )}
            {s === 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={50} y={90} width={160} height={50} rx={6}
                  fill={`${C.macro}10`} stroke={C.macro} strokeWidth={1.2} />
                <text x={130} y={112} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill={C.macro}>#[derive(RlpEncodable)]</text>
                <text x={130} y={128} textAnchor="middle" fontSize={11} fill={C.dim}>
                  struct TX {'{ nonce, to, value }'}</text>
                <motion.line x1={210} y1={115} x2={260} y2={115} stroke={C.macro}
                  strokeWidth={1.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }} />
                <rect x={260} y={100} width={150} height={35} rx={6}
                  fill={`${C.macro}10`} stroke={C.macro} strokeWidth={1.2} />
                <text x={335} y={122} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill={C.macro}>컴파일 타임 인코더</text>
              </motion.g>
            )}
            {s === 5 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={40} y={90} width={170} height={45} rx={6}
                  fill={`${C.stack}10`} stroke={C.stack} strokeWidth={1.2} />
                <text x={125} y={110} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill={C.stack}>encode_fixed_size()</text>
                <text x={125} y={126} textAnchor="middle" fontSize={10} fill={C.dim}>
                  ArrayVec (스택)</text>
                <rect x={260} y={90} width={160} height={45} rx={6}
                  fill={`${C.dim}10`} stroke={C.dim} strokeWidth={0.8} strokeDasharray="4" />
                <text x={340} y={116} textAnchor="middle" fontSize={11} fill={C.dim}>
                  Vec (힙 할당)</text>
              </motion.g>
            )}
          </svg>
          {onOpenCode && STEP_REFS[s] !== undefined && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[s])} />
              <span className="text-[10px] text-muted-foreground">{STEPS[s].label}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
