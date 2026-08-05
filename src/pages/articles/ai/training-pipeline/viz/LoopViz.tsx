import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './LoopVizData';
import MobileTrainingScene, { type MobileTrainingSceneData } from './MobileTrainingScene';

const MOBILE_SCENES: MobileTrainingSceneData[] = [
  {
    eyebrow: 'Train loop',
    items: [
      { label: 'model.train() + forward', detail: 'Dropout과 BatchNorm을 학습 mode로 두고 logits를 만든다.', accent: COLORS.train },
      { label: 'loss.backward()', detail: 'Loss에서 parameter까지 gradient를 계산해 누적한다.', accent: COLORS.grad },
      { label: 'step() → zero_grad()', detail: 'Weight를 갱신한 뒤 다음 batch와 섞이지 않게 gradient를 비운다.', accent: COLORS.train },
    ],
    oracle: 'Train loop만 parameter를 바꾼다.',
  },
  {
    eyebrow: 'Validation loop',
    items: [
      { label: 'model.eval()', detail: 'Dropout을 끄고 BatchNorm의 저장 통계를 사용한다.', accent: COLORS.val },
      { label: 'torch.no_grad()', detail: 'Autograd graph를 만들지 않고 prediction과 metric만 계산한다.', accent: COLORS.val },
      { label: 'optimizer.step() 없음', detail: 'Validation data가 weight update에 들어가면 선택 경계가 무너진다.', accent: COLORS.accum },
    ],
    oracle: 'Validation은 측정과 선택을 위한 data이지 학습 batch가 아니다.',
  },
  {
    eyebrow: 'Gradient accumulation',
    items: [
      { label: 'Micro-batch마다 loss / N', detail: 'N번 합친 gradient의 scale을 큰 batch 평균과 맞춘다.', accent: COLORS.accum },
      { label: 'Backward만 N번', detail: 'zero_grad 전까지 parameter.grad에 계속 더한다.', accent: COLORS.grad },
      { label: 'N번째에 step + zero', detail: '한 번 weight를 갱신하고 다음 accumulation window를 시작한다.', accent: COLORS.accum },
    ],
    oracle: '실효 batch는 커지지만 activation memory는 micro-batch 크기에 맞춘다.',
  },
  {
    eyebrow: 'Automatic mixed precision',
    items: [
      { label: 'FP32 baseline 측정', detail: '같은 batch의 step time, peak memory와 metric을 기록한다.', accent: COLORS.flow },
      { label: 'autocast + dynamic scale', detail: 'Op별 dtype을 고르고 작은 gradient가 0이 되지 않게 scale을 조정한다.', accent: COLORS.amp },
      { label: '같은 조건으로 비교', detail: 'Overflow, throughput, memory와 quality가 모두 허용될 때 채택한다.', accent: COLORS.grad },
    ],
    oracle: 'AMP의 speedup과 memory 절감률은 고정값이 아니다.',
  },
];

export default function LoopViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <MobileTrainingScene scene={MOBILE_SCENES[step]} />
          <svg viewBox="0 0 520 230" className="hidden w-full max-w-2xl sm:block" style={{ height: 'auto' }}>
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
              <motion.rect initial={false} x={100} y={175} width={0} height={20} rx={4} fill={COLORS.train} opacity={0.3}
                animate={{ width: 220 }} transition={{ ...sp, duration: 1.2 }} />
              <text x={260} y={189} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
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
                    <text x={x + 55} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                      loss / 4
                    </text>
                    <text x={x + 55} y={84} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                      backward()
                    </text>
                    {isStep && (
                      <text x={x + 55} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.accum}>
                        step() + zero_grad()
                      </text>
                    )}
                    {!isStep && (
                      <text x={x + 55} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
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
              <text x={260} y={172} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
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
              <ActionBox x={50} y={60} w={80} h={32} label="forward" sub="op별 dtype" color={COLORS.amp} />
              <ActionBox x={150} y={60} w={80} h={32} label="loss" sub="안정 dtype" color={COLORS.amp} />
              <line x1={132} y1={76} x2={148} y2={76} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrLp)" />
              <text x={140} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                autocast가 op별로 dtype 선택 · 실제 이득은 측정
              </text>

              {/* GradScaler block */}
              <rect x={270} y={34} width={220} height={100} rx={10} fill={COLORS.grad} fillOpacity={0.06}
                stroke={COLORS.grad} strokeWidth={1.2} />
              <text x={380} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.grad}>
                GradScaler
              </text>
              <ActionBox x={290} y={60} w={80} h={32} label="scale" sub="loss x 동적값" color={COLORS.grad} />
              <ActionBox x={390} y={60} w={80} h={32} label="unscale" sub="grad / 같은 값" color={COLORS.grad} />
              <line x1={372} y1={76} x2={388} y2={76} stroke="var(--muted-foreground)" strokeWidth={0.8} markerEnd="url(#arrLp)" />
              <text x={380} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                FP16 underflow 방지: 큰 scale로 역전파
              </text>

              {/* Benchmark contract instead of a universal speed or memory claim */}
              <ActionBox x={45} y={150} w={125} h={38} label="FP32 baseline" sub="time · peak memory" color={COLORS.flow} />
              <ActionBox x={198} y={150} w={125} h={38} label="AMP run" sub="같은 batch · metric" color={COLORS.amp} />
              <AlertBox x={350} y={150} w={125} h={38} label="비교 후 채택" sub="고정 배율 없음" color={COLORS.grad} />
            </motion.g>
          )}
          </svg>
        </div>
      )}
    </StepViz>
  );
}
