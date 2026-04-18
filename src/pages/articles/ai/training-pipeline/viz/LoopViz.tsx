import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './LoopVizData';

export default function LoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrLp" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: train_one_epoch structure */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* model.train() at top */}
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <ActionBox x={185} y={8} w={150} h={34} label="model.train()" sub="Dropout ON, BN 학습" color={COLORS.train} />
              </motion.g>
              <line x1={260} y1={44} x2={260} y2={58} stroke="var(--border)" strokeWidth={1} markerEnd="url(#arrLp)" />
              {/* Loop body */}
              <rect x={30} y={62} width={460} height={100} rx={10} fill={COLORS.train} fillOpacity={0.04}
                stroke={COLORS.train} strokeWidth={1} strokeDasharray="6 3" />
              <text x={50} y={78} fontSize={9} fontWeight={700} fill={COLORS.train}>for batch in DataLoader:</text>
              {/* 5 steps inside loop */}
              {[
                { label: 'forward', sub: 'logits=model(X)', color: COLORS.train },
                { label: 'loss', sub: 'criterion(logits,y)', color: COLORS.accum },
                { label: 'backward', sub: 'loss.backward()', color: COLORS.grad },
                { label: 'step', sub: 'optim.step()', color: COLORS.grad },
                { label: 'zero_grad', sub: 'optim.zero_grad()', color: COLORS.flow },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
                  <ActionBox x={40 + i * 88} y={90} w={82} h={38} label={s.label} sub={s.sub} color={s.color} />
                  {i < 4 && (
                    <line x1={124 + i * 88} y1={109} x2={128 + (i + 1) * 88 - 88 + 40} y2={109}
                      stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrLp)" />
                  )}
                </motion.g>
              ))}
              {/* tqdm */}
              <rect x={100} y={175} width={320} height={20} rx={4} fill="var(--muted)" fillOpacity={0.15} />
              <motion.rect x={100} y={175} width={0} height={20} rx={4} fill={COLORS.train} opacity={0.3}
                animate={{ width: 220 }} transition={{ ...sp, duration: 1.2 }} />
              <text x={260} y={189} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
                tqdm: Epoch 3/10 [====&gt;  ] 68% loss=0.342
              </text>
            </motion.g>
          )}

          {/* Step 1: validate structure */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* model.eval() + no_grad */}
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0 }}>
                <ActionBox x={100} y={8} w={140} h={34} label="model.eval()" sub="Dropout OFF, BN 고정" color={COLORS.val} />
              </motion.g>
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <ActionBox x={260} y={8} w={160} h={34} label="torch.no_grad()" sub="gradient 계산 생략" color={COLORS.val} />
              </motion.g>
              <line x1={260} y1={44} x2={260} y2={58} stroke="var(--border)" strokeWidth={1} markerEnd="url(#arrLp)" />
              {/* Loop body */}
              <rect x={60} y={62} width={400} height={80} rx={10} fill={COLORS.val} fillOpacity={0.04}
                stroke={COLORS.val} strokeWidth={1} strokeDasharray="6 3" />
              <text x={80} y={78} fontSize={9} fontWeight={700} fill={COLORS.val}>for batch in val_loader:</text>
              {/* Only forward + loss + metric */}
              {[
                { label: 'forward', sub: 'logits=model(X)', color: COLORS.val },
                { label: 'loss', sub: '기록만 (no backward)', color: COLORS.val },
                { label: 'metric', sub: 'accuracy, F1 등', color: COLORS.val },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
                  <ActionBox x={80 + i * 130} y={90} w={115} h={38} label={s.label} sub={s.sub} color={s.color} />
                  {i < 2 && (
                    <line x1={197 + i * 130} y1={109} x2={210 + (i + 1) * 130} y2={109}
                      stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrLp)" />
                  )}
                </motion.g>
              ))}
              {/* Warning: no step */}
              <AlertBox x={170} y={160} w={180} h={40} label="optimizer.step() 금지" sub="검증에서 가중치 변경 X" color={COLORS.accum} />
            </motion.g>
          )}

          {/* Step 2: Gradient accumulation */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={22} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.accum}>
                Gradient Accumulation (accumulation_steps = 4)
              </text>
              {/* 4 mini-batches, step on 4th */}
              {[0, 1, 2, 3].map((i) => {
                const x = 30 + i * 120;
                const isStep = i === 3;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.15 }}>
                    <rect x={x} y={38} width={110} height={80} rx={8}
                      fill={isStep ? COLORS.accum : COLORS.flow} fillOpacity={0.06}
                      stroke={isStep ? COLORS.accum : 'var(--border)'} strokeWidth={isStep ? 1.5 : 0.8} />
                    <text x={x + 55} y={54} textAnchor="middle" fontSize={9} fontWeight={600}
                      fill={isStep ? COLORS.accum : 'var(--foreground)'}>Batch {i + 1}</text>
                    <text x={x + 55} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                      loss / 4
                    </text>
                    <text x={x + 55} y={84} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                      backward()
                    </text>
                    {isStep && (
                      <text x={x + 55} y={102} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.accum}>
                        step() + zero_grad()
                      </text>
                    )}
                    {!isStep && (
                      <text x={x + 55} y={102} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                        grad 누적
                      </text>
                    )}
                  </motion.g>
                );
              })}
              {/* Effective batch size */}
              <rect x={80} y={140} width={360} height={36} rx={8} fill={COLORS.accum} fillOpacity={0.06}
                stroke={COLORS.accum} strokeWidth={1} />
              <text x={260} y={158} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.accum}>
                실효 배치 = 32 x 4 = 128
              </text>
              <text x={260} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                GPU 메모리는 batch_size=32만 필요 — 큰 배치 효과
              </text>
              <text x={260} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                loss.backward() 호출만으로 grad가 += 누적됨 (zero_grad 전까지)
              </text>
            </motion.g>
          )}

          {/* Step 3: Mixed precision AMP */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.amp}>
                Mixed Precision Training (AMP)
              </text>
              {/* autocast block */}
              <rect x={30} y={34} width={220} height={100} rx={10} fill={COLORS.amp} fillOpacity={0.06}
                stroke={COLORS.amp} strokeWidth={1.2} />
              <text x={140} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.amp}>
                autocast(dtype=float16)
              </text>
              <ActionBox x={50} y={60} w={80} h={32} label="forward" sub="FP16 연산" color={COLORS.amp} />
              <ActionBox x={150} y={60} w={80} h={32} label="loss" sub="FP16 계산" color={COLORS.amp} />
              <line x1={132} y1={76} x2={148} y2={76} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrLp)" />
              <text x={140} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                FP16: 메모리 절반, 연산 2배 빠름
              </text>

              {/* GradScaler block */}
              <rect x={270} y={34} width={220} height={100} rx={10} fill={COLORS.grad} fillOpacity={0.06}
                stroke={COLORS.grad} strokeWidth={1.2} />
              <text x={380} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.grad}>
                GradScaler
              </text>
              <ActionBox x={290} y={60} w={80} h={32} label="scale" sub="loss * 1024" color={COLORS.grad} />
              <ActionBox x={390} y={60} w={80} h={32} label="unscale" sub="grad / 1024" color={COLORS.grad} />
              <line x1={372} y1={76} x2={388} y2={76} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrLp)" />
              <text x={380} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                FP16 underflow 방지: 큰 scale로 역전파
              </text>

              {/* Comparison bars */}
              <text x={80} y={158} fontSize={9} fontWeight={600} fill="var(--foreground)">FP32 only</text>
              <rect x={180} y={148} width={300} height={14} rx={4} fill="var(--border)" opacity={0.2} />
              <motion.rect x={180} y={148} width={0} height={14} rx={4} fill={COLORS.flow} opacity={0.5}
                animate={{ width: 300 }} transition={{ ...sp, duration: 0.8 }} />
              <text x={340} y={160} textAnchor="middle" fontSize={8} fill="#ffffff" fontWeight={600}>8GB VRAM</text>

              <text x={80} y={186} fontSize={9} fontWeight={600} fill="var(--foreground)">AMP (FP16)</text>
              <rect x={180} y={176} width={300} height={14} rx={4} fill="var(--border)" opacity={0.2} />
              <motion.rect x={180} y={176} width={0} height={14} rx={4} fill={COLORS.amp} opacity={0.7}
                animate={{ width: 165 }} transition={{ ...sp, duration: 0.6, delay: 0.2 }} />
              <text x={270} y={188} textAnchor="middle" fontSize={8} fill="#ffffff" fontWeight={600}>4.5GB</text>
              <text x={400} y={188} fontSize={8} fill={COLORS.amp} fontWeight={600}>44% 절약</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
