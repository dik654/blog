import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { enc: '#6366f1', rep: '#10b981', qe: '#f59e0b', quote: '#8b5cf6', pcs: '#ef4444', ver: '#ec4899' };

const BOXES = [
  { id: 'enc', x: 10, y: 30, label: 'App Enclave', color: C.enc },
  { id: 'rep', x: 120, y: 30, label: 'EREPORT', color: C.rep },
  { id: 'qe', x: 230, y: 30, label: 'Quoting Enclave', color: C.qe },
  { id: 'quote', x: 60, y: 110, label: 'Quote (DCAP)', color: C.quote },
  { id: 'ver', x: 170, y: 110, label: 'Verifier', color: C.ver },
  { id: 'pcs', x: 280, y: 110, label: 'Intel PCS', color: C.pcs },
];

const W = 95, H = 32;

const ARROWS: { from: number; to: number; label: string; color: string; step: number }[] = [
  { from: 0, to: 1, label: 'sgx_create_report()', color: C.enc, step: 1 },
  { from: 1, to: 2, label: 'MAC 검증', color: C.rep, step: 2 },
  { from: 2, to: 3, label: 'ECDSA-P256', color: C.qe, step: 3 },
  { from: 3, to: 4, label: 'Quote 전달', color: C.quote, step: 4 },
  { from: 4, to: 5, label: 'PCK 조회', color: C.ver, step: 5 },
  { from: 5, to: 4, label: '인증서 체인', color: C.pcs, step: 5 },
];

const STEPS = [
  { label: 'Enclave 초기화' },
  { label: 'EREPORT 생성' },
  { label: 'QE MAC 검증' },
  { label: 'Quote 생성' },
  { label: 'Quote 전달' },
  { label: 'PCS 검증' },
];

const ANNOT = ['ISV Enclave MRENCLAVE 초기화', 'EREPORT 로컬 증명 생성', 'QE Report Key MAC 검증', 'ECDSA-P256 Quote 서명', 'Quote 원격 검증자 전달', 'Intel PCS PCK 체인 검증'];
function bx(i: number) { return BOXES[i].x + W / 2; }
function by(i: number) { return BOXES[i].y + H / 2; }

export default function SGXAttestFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="sgxa" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--muted-foreground)" opacity={0.6} />
            </marker>
          </defs>

          {/* Arrows */}
          {ARROWS.map((a, i) => {
            const show = step >= a.step;
            const off = (i === 5) ? -8 : (i === 4) ? 8 : 0;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: show ? 0.8 : 0 }} transition={{ duration: 0.3 }}>
                <line x1={bx(a.from)} y1={by(a.from) + off} x2={bx(a.to)} y2={by(a.to) + off}
                  stroke={a.color} strokeWidth={1.3} markerEnd="url(#sgxa)" />
                {(() => { const tx = (bx(a.from) + bx(a.to)) / 2, ty = (by(a.from) + by(a.to)) / 2 + off - 5; return (
                  <><rect x={tx - 32} y={ty - 7} width={64} height={10} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} textAnchor="middle" fontSize={10} fill={a.color} fontWeight={600}>{a.label}</text></>
                ); })()}
              </motion.g>
            );
          })}

          {/* Boxes */}
          {BOXES.map((b, i) => {
            const visible = i === 0 || (step >= 1 && i === 1) || (step >= 2 && i === 2) || (step >= 3 && i === 3) || (step >= 4 && i === 4) || (step >= 5 && i === 5);
            const glow = (step === 0 && i === 0) || (step === 1 && i === 1) || (step === 2 && i === 2) || (step === 3 && i === 3) || (step === 4 && i === 4) || (step === 5 && i === 5);
            return (
              <motion.g key={b.id} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={b.x} y={b.y} width={W} height={H} rx={5}
                  fill={b.color + '18'} stroke={b.color} strokeWidth={glow ? 2.5 : 1.2} />
                <text x={b.x + W / 2} y={b.y + H / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={395} y={80} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
