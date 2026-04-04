import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { COMP_STEPS } from './EVMComponentsVizData';

const CV = '#6366f1', CO = '#f97316';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const OFFSETS = [0, 5, 10, 15, 20];
const CX0 = 317, CG = 23, CW = 20, CY = 34, CH = 14;
const cx = (i: number) => CX0 + i * CG;
const ccx = (i: number) => cx(i) + CW / 2;
const ptr = { cursor: 'pointer' as const };

function Arch({ hl, hidePC, hideCode, onCode }: {
  hl?: 'pc' | 'mem' | 'stor'; hidePC?: boolean; hideCode?: boolean;
  onCode?: (key: string) => void;
}) {
  return (
    <g>
      {/* EVM outer — 클릭 시 EVM struct 소스 */}
      <g style={onCode ? ptr : undefined} onClick={() => onCode?.('evm-struct')}>
        <rect x={5} y={4} width={290} height={130} rx={5} fill="var(--background)" stroke="var(--border)" strokeWidth={0.6} />
        <text x={12} y={16} fontSize={10} fill="var(--muted-foreground)">Ethereum Virtual Machine</text>
      </g>
      <rect x={10} y={22} width={280} height={106} rx={4} fill={`${CO}04`} stroke={CO} strokeWidth={0.7} />
      <text x={16} y={34} fontSize={10} fill={CO} fontWeight={500}>Machine State (volatile)</text>
      {/* PC */}
      <rect x={18} y={40} width={56} height={36} rx={3}
        fill={hl === 'pc' ? `${CV}18` : `${CV}08`} stroke={CV} strokeWidth={hl === 'pc' ? 1.4 : 0.6} />
      {!hidePC && <text x={46} y={56} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>PC</text>}
      {!hidePC && <text x={46} y={68} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">counter</text>}
      {/* Gas */}
      <rect x={18} y={84} width={56} height={36} rx={3} fill={`${CV}08`} stroke={CV} strokeWidth={0.6} />
      <text x={46} y={100} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>Gas</text>
      <text x={46} y={112} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">available</text>
      {/* Stack — 클릭 가능 */}
      <g style={onCode ? ptr : undefined} onClick={() => onCode?.('stack')}>
        <rect x={84} y={40} width={68} height={80} rx={3} fill={`${CV}08`} stroke={CV} strokeWidth={0.6} />
        <text x={118} y={82} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>Stack</text>
      </g>
      {/* Memory — 클릭 가능 */}
      <g style={onCode ? ptr : undefined} onClick={() => onCode?.('memory')}>
        <rect x={162} y={40} width={68} height={80} rx={3}
          fill={hl === 'mem' ? `${CV}18` : `${CV}08`} stroke={CV} strokeWidth={hl === 'mem' ? 1.4 : 0.6} />
        <text x={196} y={82} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>Memory</text>
      </g>
      {/* Code ROM */}
      <g style={onCode ? ptr : undefined} onClick={() => onCode?.('interp-run')}>
        <rect x={310} y={8} width={130} height={52} rx={4} fill="var(--background)"
          stroke={CO} strokeWidth={0.7} strokeDasharray="4,2" />
        <text x={375} y={20} textAnchor="middle" fontSize={10} fill={CO}>virtual ROM (immutable)</text>
        {!hideCode && <>
          <text x={375} y={36} textAnchor="middle" fontSize={10} fill={CO}
            fontFamily="ui-monospace,monospace" letterSpacing={0.3}>60 80 60 40 52 34 ..</text>
          <text x={375} y={48} textAnchor="middle" fontSize={5.5}
            fill="var(--muted-foreground)">PUSH1 · PUSH1 · MSTORE · CALLVALUE</text>
        </>}
      </g>
      {/* Storage — 클릭 가능 */}
      <g style={onCode ? ptr : undefined} onClick={() => onCode?.('op-sload')}>
        <rect x={310} y={76} width={130} height={52} rx={4}
          fill={hl === 'stor' ? `${CO}12` : 'var(--background)'} stroke={CO} strokeWidth={hl === 'stor' ? 1.4 : 0.7} />
        <text x={375} y={90} textAnchor="middle" fontSize={10} fill={CO}>World State (persistent)</text>
        <text x={375} y={110} textAnchor="middle" fontSize={10} fontWeight={600} fill={CO}>Storage</text>
      </g>
    </g>
  );
}

export default function EVMComponentsViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={COMP_STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrCV" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto-start-reverse">
              <path d="M0,0 L6,3 L0,6 Z" fill="#6366f1" />
            </marker>
          </defs>
          <Arch hl={step === 1 ? 'pc' : step === 2 ? 'mem' : step === 3 ? 'stor' : undefined}
            hidePC={step === 1} hideCode={step === 1} onCode={onOpenCode} />

          {step === 1 && (
            <motion.g {...fade(0.3)}>
              <motion.text x={46} y={54} textAnchor="middle" fontSize={10} fontWeight={700} fill={CV}
                animate={{ opacity: [1, 1, 0] }} transition={{ times: [0, 0.55, 0.7], duration: 2 }}>PC: 5</motion.text>
              <motion.text x={46} y={54} textAnchor="middle" fontSize={10} fontWeight={700} fill={CV}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>PC: 20</motion.text>
              <motion.text x={46} y={66} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>JUMPI</motion.text>
              {OFFSETS.map((p, i) => (
                <g key={p}>
                  <rect x={cx(i)} y={CY} width={CW} height={CH} rx={2}
                    fill="var(--background)" stroke="var(--border)" strokeWidth={0.4} />
                  <text x={ccx(i)} y={CY + 10} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{p}</text>
                </g>
              ))}
              <motion.rect y={CY} width={CW} height={CH} rx={2} fill={`${CV}25`} stroke={CV} strokeWidth={0.8}
                animate={{ x: [cx(1), cx(1), cx(4)] }} transition={{ times: [0, 0.55, 0.7], duration: 2 }} />
              <motion.line y1={54} y2={CY + CH / 2} stroke={CV} strokeWidth={0.6}
                strokeDasharray="3,2" style={{ opacity: 0.6 }}
                animate={{ x1: [74, 74, 74], x2: [ccx(1), ccx(1), ccx(4)] }}
                transition={{ times: [0, 0.55, 0.7], duration: 2 }} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g {...fade(0.3)}>
              <motion.path d="M118,40 C118,24 196,24 196,40" fill="none" stroke={CV}
                strokeWidth={0.8} markerEnd="url(#arrCV)"
                initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }} />
              <rect x={136} y={17} width={42} height={12} rx={2} fill="var(--background)" />
              <motion.text x={157} y={26} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>MSTORE</motion.text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
                <rect x={170} y={52} width={52} height={14} rx={2} fill={`${CV}15`} stroke={CV} strokeWidth={0.5} />
                <text x={196} y={62} textAnchor="middle" fontSize={10} fill={CV}>0xff..32B</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g {...fade(0.3)}>
              <motion.line x1={290} y1={102} x2={310} y2={102} stroke={CO} strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} />
              <rect x={268} y={86} width={64} height={13} rx={2} fill="var(--background)" />
              <motion.text x={300} y={96} textAnchor="middle" fontSize={10} fill={CO} fontWeight={500}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>slot → value</motion.text>
              <motion.text x={375} y={124} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>20,000 gas</motion.text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
