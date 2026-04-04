import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { init: '#6366f1', query: '#10b981', merge: '#f59e0b', check: '#8b5cf6', result: '#ec4899' };

const NODES = [
  { id: 'T', x: 170, y: 30, label: 'Target', color: '#ef4444' },
  { id: 'A', x: 50, y: 90, label: 'A (d=9)', color: C.init },
  { id: 'B', x: 170, y: 90, label: 'B (d=6)', color: C.init },
  { id: 'C', x: 290, y: 90, label: 'C (d=8)', color: C.init },
  { id: 'D', x: 90, y: 170, label: 'D (d=3)', color: C.query },
  { id: 'E', x: 250, y: 170, label: 'E (d=4)', color: C.query },
  { id: 'F', x: 170, y: 240, label: 'F (d=1)', color: C.result },
];

const STEPS = [
  { label: '초기 후보 선택' },
  { label: 'α=3 병렬 FIND_NODE' },
  { label: '응답 병합 & XOR 재정렬' },
  { label: '수렴 반복' },
  { label: '최근접 k개 반환' },
];

const ANNOT = ['XOR 거리 기준 k개 선택', 'alpha=3 병렬 FIND_NODE', '응답 병합 XOR 재정렬', '더 가까운 노드로 수렴', 'O(log N) 최근접 k개 반환'];
const fade = (show: boolean, delay = 0) => ({
  initial: { opacity: 0 }, animate: { opacity: show ? 1 : 0.15 }, transition: { delay, duration: 0.3 },
});

function Arrow({ x1, y1, x2, y2, color, show, delay = 0 }: { x1: number; y1: number; x2: number; y2: number; color: string; show: boolean; delay?: number }) {
  const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
  const nx = dx / len, ny = dy / len;
  return (
    <motion.line x1={x1 + nx * 16} y1={y1 + ny * 16} x2={x2 - nx * 16} y2={y2 - ny * 16}
      stroke={color} strokeWidth={1.5} markerEnd="url(#arr)" {...fade(show, delay)} />
  );
}

export default function KadIterativeLookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 270" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arr" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
              <polygon points="0 0,6 2,0 4" fill="var(--muted-foreground)" opacity={0.6} />
            </marker>
          </defs>

          {/* Arrows: init → queries */}
          {['A', 'B', 'C'].map((_, i) => (
            <Arrow key={`q${i}`} x1={NODES[1 + i].x} y1={NODES[1 + i].y} x2={NODES[0].x} y2={NODES[0].y}
              color={C.init} show={step >= 1} delay={i * 0.1} />
          ))}
          {/* Arrows: queries → merge results */}
          <Arrow x1={NODES[1].x} y1={NODES[1].y} x2={NODES[4].x} y2={NODES[4].y} color={C.query} show={step >= 2} delay={0.1} />
          <Arrow x1={NODES[3].x} y1={NODES[3].y} x2={NODES[5].x} y2={NODES[5].y} color={C.query} show={step >= 2} delay={0.2} />
          {/* Arrows: converge → closest */}
          <Arrow x1={NODES[4].x} y1={NODES[4].y} x2={NODES[6].x} y2={NODES[6].y} color={C.check} show={step >= 3} delay={0.1} />
          <Arrow x1={NODES[5].x} y1={NODES[5].y} x2={NODES[6].x} y2={NODES[6].y} color={C.check} show={step >= 3} delay={0.2} />

          {/* Nodes */}
          {NODES.map((n, i) => {
            const visible = i === 0 || (i <= 3 && step >= 0) || (i <= 5 && step >= 2) || (i === 6 && step >= 3);
            const glow = (step === 0 && i <= 3) || (step === 2 && i >= 4 && i <= 5) || (step >= 4 && i === 6);
            return (
              <motion.g key={n.id} {...fade(visible, i * 0.05)}>
                <circle cx={n.x} cy={n.y} r={14} fill={n.color + '22'} stroke={n.color} strokeWidth={glow ? 2.5 : 1.2} />
                {glow && <circle cx={n.x} cy={n.y} r={18} fill="none" stroke={n.color} strokeWidth={1} opacity={0.3} />}
                <text x={n.x} y={n.y + 3.5} textAnchor="middle" fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}

          {/* Step 4: result badge */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
              <rect x={120} y={250} width={100} height={18} rx={4} fill={C.result + '22'} stroke={C.result} strokeWidth={1} />
              <text x={170} y={262} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.result}>최근접 k개 반환</text>
            </motion.g>
          )}
                  <motion.text x={345} y={135} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
