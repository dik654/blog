import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'src', label: '소스 호스트', color: '#6366f1', x: 10, y: 10 },
  { id: 'srcPsp', label: '소스 PSP', color: '#0ea5e9', x: 10, y: 65 },
  { id: 'tek', label: 'TEK (전송키)', color: '#8b5cf6', x: 140, y: 38 },
  { id: 'dst', label: '대상 호스트', color: '#10b981', x: 260, y: 10 },
  { id: 'dstPsp', label: '대상 PSP', color: '#f59e0b', x: 260, y: 65 },
  { id: 'vm', label: '게스트 VM', color: '#ef4444', x: 140, y: 85 },
];
const W = 95, H = 30;
const cx = (n: typeof NODES[0]) => n.x + W / 2;
const cy = (n: typeof NODES[0]) => n.y + H / 2;

const STEPS = [
  { label: 'PDH 키 교환' },
  { label: 'TEK 협상 & 재암호화' },
  { label: '암호화 페이지 전송' },
  { label: '대상에서 복원' },
];

const ANNOT = ['PDH 플랫폼 키 교환', '양측 PSP TEK 키 협상', 'TEK 암호화 페이지 전송', 'TEK 복호화 후 새 VEK 적용'];
const EDGES: [string, string, string][] = [
  ['src', 'dst', 'PDH 교환'], ['srcPsp', 'dstPsp', 'TEK 협상'],
  ['srcPsp', 'tek', '재암호화'], ['tek', 'dst', '페이지 전송'],
  ['dstPsp', 'vm', 'TEK→VEK'],
];

const visEdge = (step: number): Set<number> => {
  if (step === 0) return new Set([0]);
  if (step === 1) return new Set([1, 2]);
  if (step === 2) return new Set([3]);
  return new Set([4]);
};

export default function MigrationLiveViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const ve = visEdge(step);
        return (
          <svg viewBox="0 0 470 125" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti, lbl], ei) => {
              const f = NODES.find(n => n.id === fi)!, t = NODES.find(n => n.id === ti)!;
              const show = ve.has(ei);
              return (
                <motion.g key={ei} animate={{ opacity: show ? 0.9 : 0.08 }}>
                  <line x1={cx(f)} y1={cy(f)} x2={cx(t)} y2={cy(t)}
                    stroke="#888" strokeWidth={1.2} strokeDasharray="4 3" />
                  <rect x={(cx(f) + cx(t)) / 2 + 2 - 22} y={(cy(f) + cy(t)) / 2 - 12} width={44} height={11} rx={2} fill="var(--card)" />
                  <text x={(cx(f) + cx(t)) / 2 + 2} y={(cy(f) + cy(t)) / 2 - 5}
                    textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{lbl}</text>
                </motion.g>
              );
            })}
            {NODES.map((n) => {
              const show = step === 3 ? true : step === 0 ? ['src', 'srcPsp', 'dst', 'dstPsp'].includes(n.id)
                : step === 1 ? ['src', 'srcPsp', 'dst', 'dstPsp', 'tek'].includes(n.id)
                : ['src', 'srcPsp', 'dst', 'dstPsp', 'tek'].includes(n.id);
              return (
                <motion.g key={n.id} animate={{ opacity: show ? 1 : 0.1 }}>
                  <motion.rect x={n.x} y={n.y} width={W} height={H} rx={6}
                    animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: show ? 1.8 : 0.7 }} />
                  <text x={cx(n)} y={cy(n) + 4} textAnchor="middle"
                    fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
                    <motion.text x={375} y={63} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
        );
      }}
    </StepViz>
  );
}
