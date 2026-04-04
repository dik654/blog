import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LAYERS = [
  { label: 'Input', sub: 'x=2.35', val: '2.35', color: '#6366f1', x: 20 },
  { label: 'Hidden₁', sub: 'h₁=Wx+b', val: '1.72', color: '#0ea5e9', x: 130 },
  { label: 'Hidden₂', sub: 'h₂=σ(h₁)', val: '0.85', color: '#8b5cf6', x: 250 },
  { label: 'Output', sub: 'ŷ=softmax', val: '0.91', color: '#10b981', x: 370 },
];

const GRADS = ['−0.42', '−0.91', '−2.14'];
const UPDATES = ['+0.091', '+0.214', '+0.042'];

const STEPS = [
  { label: '순전파: 입력 x=2.35 → 각 층에서 값 계산' },
  { label: '순전파 완료: 2.35 → 1.72 → 0.85 → ŷ=0.91' },
  { label: '손실 계산: L = −log(0.09) = 2.41' },
  { label: '역전파: 출력→입력 방향으로 기울기 전파' },
  { label: '가중치 갱신: W ← W − 0.1 × ∇L' },
];
const sp = { type: 'spring' as const, bounce: 0.2, duration: 0.5 };

export default function ForwardBackwardViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const fwd = step <= 2;
            const bwd = step === 3;
            const upd = step === 4;
            const showVal = step >= 1;
            return (
              <g key={i}>
                {/* layer box */}
                <motion.rect x={l.x} y={25} width={90} height={48} rx={6}
                  animate={{
                    fill: `${l.color}${upd ? '25' : '15'}`,
                    stroke: l.color,
                    strokeWidth: upd ? 1.8 : 1.2,
                  }} transition={sp} />
                <text x={l.x + 45} y={42} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={l.color}>{l.label}</text>
                <text x={l.x + 45} y={55} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">{l.sub}</text>
                {/* value badge */}
                {showVal && (
                  <motion.g initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }} transition={sp}>
                    <rect x={l.x + 25} y={64} width={40} height={16} rx={3}
                      fill={`${l.color}20`} stroke={l.color} strokeWidth={0.6} />
                    <text x={l.x + 45} y={76} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={l.color}>{l.val}</text>
                  </motion.g>
                )}

                {i < LAYERS.length - 1 && (
                  <>
                    {/* forward arrow */}
                    <motion.line
                      x1={l.x + 92} y1={44}
                      x2={LAYERS[i + 1].x - 2} y2={44}
                      stroke={fwd ? '#10b981' : '#80808020'}
                      strokeWidth={fwd ? 1.4 : 0.6}
                      markerEnd={fwd ? 'url(#fwd)' : undefined}
                      animate={{ opacity: fwd ? 1 : 0.15 }}
                      transition={sp} />
                    {/* backward arrow + gradient value */}
                    <motion.line
                      x1={LAYERS[i + 1].x - 2} y1={54}
                      x2={l.x + 92} y2={54}
                      stroke={bwd ? '#ef4444' : '#80808020'}
                      strokeWidth={bwd ? 1.4 : 0.6}
                      strokeDasharray={bwd ? '4 2' : 'none'}
                      markerEnd={bwd ? 'url(#bwd)' : undefined}
                      animate={{ opacity: bwd ? 1 : 0.08 }}
                      transition={sp} />
                    {bwd && (
                      <motion.g initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }} transition={sp}>
                        <rect x={(l.x + 92 + LAYERS[i + 1].x) / 2 - 20}
                          y={56} width={40} height={14} rx={2}
                          fill="var(--background)" stroke="#ef4444"
                          strokeWidth={0.5} />
                        <text
                          x={(l.x + 92 + LAYERS[i + 1].x) / 2}
                          y={66} textAnchor="middle" fontSize={8}
                          fontWeight={600} fill="#ef4444">
                          {GRADS[i]}
                        </text>
                      </motion.g>
                    )}
                    {/* update delta */}
                    {upd && (
                      <motion.g initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }} transition={sp}>
                        <text
                          x={(l.x + 92 + LAYERS[i + 1].x) / 2}
                          y={55} textAnchor="middle" fontSize={8}
                          fontWeight={600} fill="#8b5cf6">
                          ΔW={UPDATES[i]}
                        </text>
                      </motion.g>
                    )}
                  </>
                )}
              </g>
            );
          })}

          {/* Loss box */}
          <motion.rect x={380} y={95} width={80} height={30} rx={5}
            animate={{
              fill: step === 2 ? '#ef444425' : '#80808008',
              stroke: step === 2 ? '#ef4444' : '#888',
              strokeWidth: step === 2 ? 1.5 : 0.5,
            }} transition={sp} />
          <text x={420} y={108} textAnchor="middle" fontSize={9}
            fontWeight={step === 2 ? 600 : 400}
            fill={step === 2 ? '#ef4444' : 'var(--muted-foreground)'}>
            Loss
          </text>
          {step >= 2 && (
            <motion.text x={420} y={120} textAnchor="middle" fontSize={9}
              fontWeight={600} fill="#ef4444"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              2.41
            </motion.text>
          )}

          {/* gradient magnitude mini-bars (step 3) */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={108} fontSize={8}
                fill="var(--muted-foreground)">기울기 크기:</text>
              {[
                { label: '∂L/∂W₃', val: 2.14, color: '#ef4444' },
                { label: '∂L/∂W₂', val: 0.91, color: '#f59e0b' },
                { label: '∂L/∂W₁', val: 0.42, color: '#10b981' },
              ].map((g, i) => (
                <g key={i}>
                  <text x={20} y={122 + i * 12} fontSize={7}
                    fill="var(--muted-foreground)">{g.label}</text>
                  <motion.rect x={72} y={115 + i * 12} rx={2}
                    height={8} fill={`${g.color}40`} stroke={g.color}
                    strokeWidth={0.6}
                    initial={{ width: 0 }}
                    animate={{ width: g.val * 50 }} transition={sp} />
                  <motion.text x={78 + g.val * 50} y={123 + i * 12}
                    fontSize={7} fontWeight={600} fill={g.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    {g.val}
                  </motion.text>
                </g>
              ))}
            </motion.g>
          )}

          <defs>
            <marker id="fwd" markerWidth={6} markerHeight={6}
              refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#10b981" />
            </marker>
            <marker id="bwd" markerWidth={6} markerHeight={6}
              refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#ef4444" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
