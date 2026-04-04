import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { nw: '#6366f1', mon: '#f59e0b', sw: '#10b981', ta: '#ec4899' };

const BOXES = [
  { id: 'ca', x: 20, y: 20, w: 130, h: 36, label: 'Client App (EL0)', color: C.nw },
  { id: 'drv', x: 20, y: 76, w: 130, h: 36, label: 'TEE Driver (EL1)', color: C.nw },
  { id: 'mon', x: 95, y: 140, w: 150, h: 32, label: 'Secure Monitor (EL3)', color: C.mon },
  { id: 'os', x: 190, y: 76, w: 130, h: 36, label: 'OP-TEE OS (S.EL1)', color: C.sw },
  { id: 'ta', x: 190, y: 20, w: 130, h: 36, label: 'Trusted App (S.EL0)', color: C.ta },
];

const ARROWS: { from: number; to: number; label: string; color: string; step: number }[] = [
  { from: 0, to: 1, label: 'ioctl', color: C.nw, step: 1 },
  { from: 1, to: 2, label: 'SMC', color: C.nw, step: 2 },
  { from: 2, to: 3, label: '컨텍스트 전환', color: C.mon, step: 3 },
  { from: 3, to: 4, label: 'TA 디스패치', color: C.sw, step: 4 },
  { from: 4, to: 3, label: '결과 반환', color: C.ta, step: 5 },
  { from: 3, to: 2, label: 'SMC 복귀', color: C.sw, step: 5 },
  { from: 2, to: 1, label: 'NW 복원', color: C.mon, step: 6 },
];

const STEPS = [
  { label: 'CA 호출' }, { label: 'TEE Driver 전달' },
  { label: 'SMC 트랩 (EL3)' }, { label: 'OP-TEE 진입' },
  { label: 'TA 실행' }, { label: 'SW → Monitor 복귀' }, { label: 'NW 복원' },
];
const ANNOT = ['TEE API 보안 서비스 요청', 'ioctl → SMC 준비', 'EL3 Monitor 트랩', 'NW 레지스터 저장 후 진입', 'TA 디스패치 보안 연산', 'SMC로 Monitor 복귀', 'NW 레지스터 복원'];

function cx(b: typeof BOXES[0]) { return b.x + b.w / 2; }
function cy(b: typeof BOXES[0]) { return b.y + b.h / 2; }

export default function WorldSwitchFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="warr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--muted-foreground)" opacity={0.6} />
            </marker>
          </defs>

          {/* Divider line */}
          <line x1={160} y1={10} x2={160} y2={130} stroke="var(--border)" strokeWidth={1} strokeDasharray="3,3" opacity={0.5} />
          <text x={75} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" opacity={0.5}>Normal World</text>
          <text x={255} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" opacity={0.5}>Secure World</text>

          {/* Arrows */}
          {ARROWS.map((a, i) => {
            const f = BOXES[a.from], t = BOXES[a.to];
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: step >= a.step ? 0.8 : 0 }} transition={{ duration: 0.3 }}>
                <line x1={cx(f)} y1={cy(f)} x2={cx(t)} y2={cy(t)} stroke={a.color} strokeWidth={1.3} markerEnd="url(#warr)" />
                {(() => { const tx = (cx(f) + cx(t)) / 2 + 6, ty = (cy(f) + cy(t)) / 2 - 4; return (
                  <><rect x={tx - 22} y={ty - 7} width={44} height={10} rx={2} fill="var(--card)" />
                  <text x={tx} y={ty} fontSize={10} fill={a.color} fontWeight={600}>{a.label}</text></>
                ); })()}
              </motion.g>
            );
          })}

          {/* Boxes */}
          {BOXES.map((b, i) => {
            const on = step === 0 ? i === 0 : true;
            const glow = (step === 1 && i === 1) || (step === 2 && i === 2) || (step === 3 && i === 3) || (step === 4 && i === 4) || (step === 5 && i === 3) || (step === 6 && i === 1);
            return (
              <motion.g key={b.id} initial={{ opacity: 0 }} animate={{ opacity: on ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={5}
                  fill={b.color + '18'} stroke={b.color} strokeWidth={glow ? 2.5 : 1.2} />
                <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={b.color}>{b.label}</text>
              </motion.g>
            );
          })}
          <motion.text x={345} y={95} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
