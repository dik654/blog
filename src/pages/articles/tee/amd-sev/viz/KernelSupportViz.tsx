import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'user', label: '사용자 공간', color: '#6366f1', x: 10, y: 5 },
  { id: 'devsev', label: '/dev/sev', color: '#0ea5e9', x: 130, y: 5 },
  { id: 'kvm', label: 'KVM 모듈', color: '#10b981', x: 130, y: 55 },
  { id: 'ccp', label: 'CCP 드라이버', color: '#f59e0b', x: 250, y: 5 },
  { id: 'mm', label: '메모리 관리', color: '#8b5cf6', x: 10, y: 55 },
  { id: 'psp', label: 'PSP', color: '#ef4444', x: 250, y: 55 },
];
const W = 95, H = 32;
const cx = (n: typeof NODES[0]) => n.x + W / 2;
const cy = (n: typeof NODES[0]) => n.y + H / 2;

const STEPS = [
  { label: 'ioctl 인터페이스' },
  { label: 'PSP 통신' },
  { label: '메모리 관리' },
  { label: '전체 통합' },
];

const ANNOT = ['/dev/sev ioctl 인터페이스', 'KVM->CCP->PSP 통신', 'KVM+MM C-bit 페이지 관리', 'KVM 전체 통합 동작'];
const EDGES: [string, string, string][] = [
  ['user', 'devsev', 'ioctl'], ['devsev', 'kvm', 'SEV 명령'],
  ['kvm', 'ccp', 'PSP 요청'], ['ccp', 'psp', '메일박스'],
  ['kvm', 'mm', '페이지 관리'], ['mm', 'kvm', 'C-bit 설정'],
];

const vis = (step: number): Set<string> => {
  if (step === 0) return new Set(['user', 'devsev', 'kvm']);
  if (step === 1) return new Set(['user', 'devsev', 'kvm', 'ccp', 'psp']);
  if (step === 2) return new Set(['user', 'devsev', 'kvm', 'mm']);
  return new Set(NODES.map(n => n.id));
};

export default function KernelSupportViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const v = vis(step);
        return (
          <svg viewBox="0 0 460 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti, lbl], ei) => {
              const f = NODES.find(n => n.id === fi)!, t = NODES.find(n => n.id === ti)!;
              const show = v.has(fi) && v.has(ti);
              return (
                <motion.g key={ei} animate={{ opacity: show ? 0.8 : 0.05 }}>
                  <line x1={cx(f)} y1={cy(f)} x2={cx(t)} y2={cy(t)}
                    stroke="#888" strokeWidth={1} strokeDasharray="4 3" />
                  <rect x={(cx(f) + cx(t)) / 2 + 3 - 22} y={(cy(f) + cy(t)) / 2 - 11} width={44} height={11} rx={2} fill="var(--card)" />
                  <text x={(cx(f) + cx(t)) / 2 + 3} y={(cy(f) + cy(t)) / 2 - 4}
                    textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{lbl}</text>
                </motion.g>
              );
            })}
            {NODES.map((n) => (
              <motion.g key={n.id} animate={{ opacity: v.has(n.id) ? 1 : 0.1 }}>
                <motion.rect x={n.x} y={n.y} width={W} height={H} rx={6}
                  animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: v.has(n.id) ? 1.8 : 0.7 }} />
                <text x={cx(n)} y={cy(n) + 4} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            ))}
                    <motion.text x={365} y={50} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
