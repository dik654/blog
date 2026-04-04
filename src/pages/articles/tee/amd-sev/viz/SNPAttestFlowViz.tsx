import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { tenant: '#6366f1', vm: '#10b981', psp: '#f59e0b', kds: '#8b5cf6', ark: '#ef4444' };

const BOXES = [
  { id: 'tenant', x: 10, y: 20, label: '테넌트 (Verifier)', color: C.tenant },
  { id: 'vm', x: 130, y: 20, label: '게스트 VM (SNP)', color: C.vm },
  { id: 'psp', x: 250, y: 20, label: 'AMD SP (PSP)', color: C.psp },
  { id: 'kds', x: 10, y: 130, label: 'AMD KDS', color: C.kds },
  { id: 'ark', x: 250, y: 130, label: 'ARK/ASK 루트', color: C.ark },
];

const W = 100, H = 34;

const ARROWS: { from: number; to: number; label: string; color: string; step: number }[] = [
  { from: 0, to: 1, label: 'nonce (64B)', color: C.tenant, step: 0 },
  { from: 1, to: 2, label: 'VMGEXIT', color: C.vm, step: 1 },
  { from: 2, to: 1, label: 'Signed Report', color: C.psp, step: 2 },
  { from: 1, to: 0, label: 'Report + VCEK', color: C.vm, step: 3 },
  { from: 0, to: 3, label: 'GET /vcek/{chip}', color: C.tenant, step: 4 },
  { from: 3, to: 0, label: 'VCEK 체인', color: C.kds, step: 4 },
  { from: 4, to: 0, label: 'ARK→ASK→VCEK', color: C.ark, step: 5 },
];

const STEPS = [
  { label: 'Nonce 전송' },
  { label: 'VMGEXIT 호출' },
  { label: 'Report 서명' },
  { label: 'Report 전달' },
  { label: 'KDS 인증서 조회' },
  { label: 'ARK 체인 검증' },
];

const ANNOT = ['64B nonce 전송', 'VMGEXIT PSP 보고서 요청', 'VCEK ECDSA-P384 서명', 'Report+VCEK 인증서 전달', 'AMD KDS VCEK 체인 조회', 'ARK->ASK->VCEK 체인 검증'];
function bx(i: number) { return BOXES[i].x + W / 2; }
function by(i: number) { return BOXES[i].y + H / 2; }

export default function SNPAttestFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="snpa" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--muted-foreground)" opacity={0.6} />
            </marker>
          </defs>

          {/* Arrows */}
          {ARROWS.map((a, i) => {
            const show = step >= a.step;
            const x1 = bx(a.from), y1 = by(a.from), x2 = bx(a.to), y2 = by(a.to);
            const dy = y2 - y1;
            const off = i % 2 === 0 ? -6 : 6;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: show ? 0.8 : 0 }} transition={{ duration: 0.3 }}>
                <line x1={x1} y1={y1 + off} x2={x2} y2={y2 + off} stroke={a.color} strokeWidth={1.3} markerEnd="url(#snpa)" />
                {(() => { const tx = (x1 + x2) / 2, ty = (y1 + y2) / 2 + off - 5 + (dy === 0 ? 0 : (dy > 0 ? 10 : -2)); return (
                  <><rect x={tx - 24} y={ty - 7} width={48} height={10} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} textAnchor="middle" fontSize={10} fill={a.color} fontWeight={600}>{a.label}</text></>
                ); })()}
              </motion.g>
            );
          })}

          {/* Boxes */}
          {BOXES.map((b, i) => {
            const visible = i <= 2 || (i === 3 && step >= 4) || (i === 4 && step >= 5);
            const glow = (step === 0 && i === 1) || (step === 1 && i === 2) || (step === 2 && i === 1) || (step === 3 && i === 0) || (step === 4 && i === 3) || (step === 5 && i === 4);
            return (
              <motion.g key={b.id} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <rect x={b.x} y={b.y} width={W} height={H} rx={5}
                  fill={b.color + '18'} stroke={b.color} strokeWidth={glow ? 2.5 : 1.2} />
                <text x={b.x + W / 2} y={b.y + H / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={375} y={90} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
