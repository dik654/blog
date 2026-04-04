import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { user: '#6366f1', vmm: '#10b981', tdx: '#f59e0b', guest: '#8b5cf6', kms: '#ef4444', app: '#ec4899' };

const BOXES = [
  { id: 'user', x: 10, y: 20, label: '사용자', color: C.user },
  { id: 'vmm', x: 120, y: 20, label: 'VMM', color: C.vmm },
  { id: 'tdx', x: 230, y: 20, label: 'TDX SEAM', color: C.tdx },
  { id: 'guest', x: 10, y: 110, label: 'Guest Agent', color: C.guest },
  { id: 'kms', x: 140, y: 110, label: 'KMS', color: C.kms },
  { id: 'app', x: 260, y: 110, label: '컨테이너', color: C.app },
];

const W = 95, H = 34;

const ARROWS: { from: number; to: number; label: string; color: string; step: number; off?: number }[] = [
  { from: 0, to: 1, label: 'Compose + Manifest', color: C.user, step: 1 },
  { from: 1, to: 2, label: 'TD 생성 (QEMU)', color: C.vmm, step: 2 },
  { from: 2, to: 3, label: 'TD 부팅', color: C.tdx, step: 3 },
  { from: 3, to: 4, label: 'TDX Quote', color: C.guest, step: 4, off: -6 },
  { from: 4, to: 3, label: '앱 키 발급', color: C.kms, step: 4, off: 6 },
  { from: 3, to: 5, label: '컨테이너 시작', color: C.guest, step: 5 },
];

const STEPS = [
  { label: '사용자 제출' },
  { label: 'Manifest 생성' },
  { label: 'TD 생성' },
  { label: 'Guest 부팅' },
  { label: 'Quote & 키 발급' },
  { label: '컨테이너 실행' },
];

const ANNOT = ['Docker Compose 제출', 'Manifest 생성+vsock 설정', 'QEMU TDX TD 기밀 VM 생성', 'Guest Agent 부팅 초기화', 'TDX Quote KMS 키 발급', '키로 상태 복호화+컨테이너 실행'];
function bx(i: number) { return BOXES[i].x + W / 2; }
function by(i: number) { return BOXES[i].y + H / 2; }

export default function TDXProvisionFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tdxa" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--muted-foreground)" opacity={0.6} />
            </marker>
          </defs>

          {/* Arrows */}
          {ARROWS.map((a, i) => {
            const show = step >= a.step;
            const off = a.off ?? 0;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: show ? 0.8 : 0 }} transition={{ duration: 0.3 }}>
                <line x1={bx(a.from)} y1={by(a.from) + off} x2={bx(a.to)} y2={by(a.to) + off}
                  stroke={a.color} strokeWidth={1.3} markerEnd="url(#tdxa)" />
                {(() => { const tx = (bx(a.from) + bx(a.to)) / 2, ty = (by(a.from) + by(a.to)) / 2 + off - 5; return (
                  <><rect x={tx - 32} y={ty - 7} width={64} height={10} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} textAnchor="middle" fontSize={10} fill={a.color} fontWeight={600}>{a.label}</text></>
                ); })()}
              </motion.g>
            );
          })}

          {/* Boxes */}
          {BOXES.map((b, i) => {
            const visible = i === 0 || step >= i;
            const glow = step === i || (step === 4 && i === 4) || (step === 5 && i === 5);
            return (
              <motion.g key={b.id} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={b.x} y={b.y} width={W} height={H} rx={5}
                  fill={b.color + '18'} stroke={b.color} strokeWidth={glow ? 2.5 : 1.2} />
                <text x={b.x + W / 2} y={b.y + H / 2 + 3.5} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={b.color}>{b.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={375} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
