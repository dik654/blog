import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'host', label: '호스트 OS', color: '#0ea5e9', x: 10, y: 10 },
  { id: 'ccp', label: 'CCP 드라이버', color: '#8b5cf6', x: 10, y: 65 },
  { id: 'psp', label: 'AMD SP (PSP)', color: '#f59e0b', x: 160, y: 10 },
  { id: 'fw', label: 'PSP 펌웨어', color: '#6366f1', x: 160, y: 65 },
  { id: 'crypto', label: '암호화 엔진', color: '#10b981', x: 300, y: 10 },
  { id: 'smem', label: '보안 메모리', color: '#ef4444', x: 300, y: 65 },
];
const W = 95, H = 32;
const cx = (n: typeof NODES[0]) => n.x + W / 2;
const cy = (n: typeof NODES[0]) => n.y + H / 2;

const STEPS = [
  { label: 'AMD Secure Processor' },
  { label: '호스트 → PSP 통신' },
  { label: '펌웨어 처리' },
  { label: '응답 반환' },
];

const ANNOT = ['ARM Cortex-A5 보안 프로세서', '/dev/sev CCP 통신 경로', 'PSP 펌웨어 키 생성/서명', 'PSP->CCP 응답 반환'];
const EDGES: [string, string, string][] = [
  ['host', 'ccp', 'ioctl'], ['ccp', 'psp', 'PSP 메일박스'],
  ['psp', 'fw', '명령 처리'], ['fw', 'crypto', '키 생성/서명'],
  ['fw', 'smem', '키 저장'], ['psp', 'ccp', '응답'],
];

const visEdges = (step: number): Set<number> => {
  if (step === 0) return new Set();
  if (step === 1) return new Set([0, 1]);
  if (step === 2) return new Set([2, 3, 4]);
  return new Set([5, 0]);
};

export default function ASPViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const ve = visEdges(step);
        return (
          <svg viewBox="0 0 510 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* PSP boundary */}
            <rect x={150} y={2} width={260} height={104} rx={10}
              fill="none" stroke="#f59e0b30" strokeWidth={1} strokeDasharray="6 3" />
            <text x={280} y={104} textAnchor="middle" fontSize={10} fill="#f59e0b80">PSP 보안 영역</text>
            {EDGES.map(([fi, ti, lbl], ei) => {
              const f = NODES.find(n => n.id === fi)!, t = NODES.find(n => n.id === ti)!;
              const show = ve.has(ei);
              return (
                <motion.g key={ei} animate={{ opacity: show ? 0.9 : 0.08 }}>
                  <line x1={cx(f)} y1={cy(f)} x2={cx(t)} y2={cy(t)}
                    stroke="#888" strokeWidth={1} strokeDasharray="4 3" />
                  <rect x={(cx(f) + cx(t)) / 2 - 22} y={(cy(f) + cy(t)) / 2 - 12} width={44} height={11} rx={2} fill="var(--card)" />
                  <text x={(cx(f) + cx(t)) / 2} y={(cy(f) + cy(t)) / 2 - 5}
                    textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{lbl}</text>
                </motion.g>
              );
            })}
            {NODES.map((n) => {
              const glow = (step === 0 && n.id === 'psp') || (step === 1 && n.id === 'ccp')
                || (step === 2 && n.id === 'fw') || (step === 3 && n.id === 'host');
              return (
                <motion.g key={n.id}>
                  <motion.rect x={n.x} y={n.y} width={W} height={H} rx={6}
                    animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: glow ? 2.2 : 1.2 }} />
                  <text x={cx(n)} y={cy(n) + 4} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
                    <motion.text x={415} y={55} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
