import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'warmup', label: 'Warmup', color: '#6366f1', x: 10, y: 45 },
  { id: 'cosine', label: 'Cosine Decay', color: '#0ea5e9', x: 95, y: 45 },
  { id: 'adamw', label: 'AdamW', color: '#10b981', x: 190, y: 45 },
  { id: 'fp16', label: 'FP16 Forward', color: '#f59e0b', x: 95, y: 0 },
  { id: 'fp32', label: 'FP32 Grad', color: '#8b5cf6', x: 190, y: 0 },
  { id: 'scale', label: 'Loss Scaling', color: '#ef4444', x: 285, y: 0 },
];
const W = 80, H = 30;

const STEPS = [
  { label: 'Learning Rate Warmup' }, { label: 'AdamW 옵티마이저' },
  { label: 'Mixed Precision' }, { label: '통합 학습 파이프라인' },
];
const BODY = [
  '0에서 서서히 올려 초기 안정화', '가중치 감쇠 분리 Adam 변형',
  'FP16 연산 + FP32 그래디언트 축적', 'LR+AdamW+MP 결합 대규모 학습',
];

const EDGES: [number, number, string][] = [
  [0, 1, 'LR 스케줄링'], [1, 2, '학습률 전달'], [3, 4, 'FP32 축적'],
  [4, 5, '언더플로 방지'], [5, 2, '스케일 그래디언트'],
];

const vis = (step: number): Set<string> => {
  if (step === 0) return new Set(['warmup', 'cosine']);
  if (step === 1) return new Set(['warmup', 'cosine', 'adamw']);
  if (step === 2) return new Set(['fp16', 'fp32', 'scale']);
  return new Set(NODES.map(n => n.id));
};

export default function TrainingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const v = vis(step);
        return (
          <svg viewBox="0 0 500 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {EDGES.map(([fi, ti, lbl], ei) => {
              const f = NODES[fi], t = NODES[ti];
              const show = v.has(f.id) && v.has(t.id);
              return (
                <motion.g key={ei} animate={{ opacity: show ? 1 : 0 }}>
                  <line x1={f.x + W} y1={f.y + H / 2} x2={t.x} y2={t.y + H / 2}
                    stroke="#888" strokeWidth={1} strokeDasharray="4 3" />
                  <rect x={(f.x + W + t.x) / 2 - 22} y={(f.y + t.y) / 2 + H / 2 - 12} width={44} height={11} rx={2} fill="var(--card)" />
                  <text x={(f.x + W + t.x) / 2} y={(f.y + t.y) / 2 + H / 2 - 5}
                    textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
                </motion.g>
              );
            })}
            {NODES.map((n) => {
              const show = v.has(n.id);
              return (
                <motion.g key={n.id} animate={{ opacity: show ? 1 : 0.1 }}>
                  <motion.rect x={n.x} y={n.y} width={W} height={H} rx={6}
                    animate={{ fill: `${n.color}18`, stroke: n.color, strokeWidth: show ? 1.8 : 0.8 }} />
                  <text x={n.x + W / 2} y={n.y + H / 2 + 4} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
                </motion.g>
              );
            })}
            {/* inline body */}
            <motion.text x={390} y={45} fontSize={9}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
