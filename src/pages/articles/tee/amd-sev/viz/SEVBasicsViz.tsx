import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'CPU 쓰기 요청' },
  { label: 'C-bit 확인' },
  { label: 'AES-128 암호화' },
  { label: 'DRAM 저장' },
  { label: '읽기 & 복호화' },
];

const ANNOT = ['CPU 쓰기 시 SME 엔진 통과', 'C-bit 암호화 여부 결정', 'AES-128 실시간 암호화', '암호문 DRAM 저장 완료', 'DRAM 읽기 시 자동 복호화'];
const NODES = [
  { label: 'CPU Core', color: '#6366f1', x: 10 },
  { label: 'SME/TME', color: '#0ea5e9', x: 98 },
  { label: '메모리 컨트롤러', color: '#10b981', x: 186 },
  { label: 'DRAM', color: '#f59e0b', x: 290 },
];
const AUX = [
  { label: 'AES-128 키', color: '#8b5cf6', x: 98, y: 65 },
  { label: 'C-bit', color: '#ef4444', x: 10, y: 65 },
];

export default function SEVBasicsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const writeFlow = step <= 3;
        const readFlow = step === 4;
        return (
          <svg viewBox="0 0 470 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Main chain arrows */}
            {NODES.map((n, i) => {
              if (i === 0) return null;
              const prev = NODES[i - 1];
              const fwd = writeFlow && step >= i;
              const rev = readFlow;
              return (
                <motion.g key={`e${i}`} animate={{ opacity: fwd || rev ? 0.8 : 0.15 }}>
                  <line x1={prev.x + 78} y1={28} x2={n.x} y2={28}
                    stroke="#888" strokeWidth={1} strokeDasharray="3 2" />
                  <text x={(prev.x + 78 + n.x) / 2} y={22} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{writeFlow ? '→' : '←'}</text>
                </motion.g>
              );
            })}
            {/* Main nodes */}
            {NODES.map((n, i) => {
              const glow = (step === 0 && i === 0) || (step === 3 && i === 3)
                || (step === 2 && i === 1) || (step === 4 && i === 0);
              return (
                <motion.g key={n.label}>
                  <motion.rect x={n.x} y={10} width={78} height={34} rx={6}
                    animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: glow ? 2.2 : 1.2 }} />
                  <text x={n.x + 39} y={31} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
            {/* Auxiliary nodes */}
            {AUX.map((a, i) => {
              const show = i === 0 ? step >= 2 : step >= 1;
              return (
                <motion.g key={a.label} animate={{ opacity: show ? 1 : 0.1 }}>
                  <motion.rect x={a.x} y={a.y} width={78} height={26} rx={5}
                    animate={{ fill: `${a.color}15`, stroke: a.color, strokeWidth: show ? 1.5 : 0.5 }} />
                  <text x={a.x + 39} y={a.y + 17} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={a.color}>{a.label}</text>
                  <motion.line x1={a.x + 39} y1={a.y} x2={a.x + 39} y2={44}
                    stroke={a.color} strokeWidth={0.8} strokeDasharray="3 2"
                    animate={{ opacity: show ? 0.6 : 0 }} />
                </motion.g>
              );
            })}
                    <motion.text x={375} y={50} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
