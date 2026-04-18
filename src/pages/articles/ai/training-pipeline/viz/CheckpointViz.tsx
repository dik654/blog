import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './CheckpointVizData';

export default function CheckpointViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrCk" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: save/load pattern */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Save side */}
              <text x={140} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.save}>torch.save</text>
              <ModuleBox x={40} y={30} w={90} h={42} label="Model" sub=".state_dict()" color={COLORS.save} />
              <ModuleBox x={145} y={30} w={90} h={42} label="Optimizer" sub=".state_dict()" color={COLORS.save} />
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.15 }}>
                <line x1={85} y1={74} x2={140} y2={100} stroke={COLORS.save} strokeWidth={1} />
                <line x1={190} y1={74} x2={140} y2={100} stroke={COLORS.save} strokeWidth={1} />
                {/* Checkpoint file */}
                <rect x={80} y={100} width={120} height={44} rx={8} fill={COLORS.save} fillOpacity={0.08}
                  stroke={COLORS.save} strokeWidth={1.2} />
                <text x={140} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.save}>checkpoint.pt</text>
                <text x={140} y={134} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  epoch + model + optim + sched
                </text>
              </motion.g>

              {/* Load side */}
              <text x={380} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.load}>load_state_dict</text>
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <DataBox x={320} y={100} w={120} h={34} label="checkpoint.pt" sub="torch.load()" color={COLORS.load} outlined />
                <line x1={380} y1={100} x2={340} y2={74} stroke={COLORS.load} strokeWidth={1} markerEnd="url(#arrCk)" />
                <line x1={380} y1={100} x2={420} y2={74} stroke={COLORS.load} strokeWidth={1} markerEnd="url(#arrCk)" />
                <ModuleBox x={290} y={30} w={90} h={42} label="Model" sub=".load_state_dict()" color={COLORS.load} />
                <ModuleBox x={395} y={30} w={90} h={42} label="Optimizer" sub=".load_state_dict()" color={COLORS.load} />
              </motion.g>

              <AlertBox x={160} y={165} w={200} h={42} label="pickle 전체 저장 금지" sub="보안 + 호환성 문제" color={COLORS.determ} />
            </motion.g>
          )}

          {/* Step 1: Best vs Last */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Epoch timeline */}
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Epoch별 저장 전략
              </text>
              <line x1={40} y1={55} x2={480} y2={55} stroke="var(--border)" strokeWidth={2} />
              {[1, 2, 3, 4, 5, 6, 7, 8].map((e, i) => {
                const x = 60 + i * 55;
                const isBest = e === 3;
                return (
                  <motion.g key={e} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.06 }}>
                    <circle cx={x} cy={55} r={4} fill={isBest ? COLORS.best : 'var(--border)'} />
                    <text x={x} y={45} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">E{e}</text>
                    {isBest && (
                      <>
                        <text x={x} y={75} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.best}>BEST</text>
                        <text x={x} y={87} textAnchor="middle" fontSize={7} fill={COLORS.best}>val_loss=0.21</text>
                      </>
                    )}
                  </motion.g>
                );
              })}

              {/* Two file boxes */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={40} y={105} width={200} height={55} rx={8} fill={COLORS.best} fillOpacity={0.06}
                  stroke={COLORS.best} strokeWidth={1.2} />
                <text x={140} y={122} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.best}>best_model.pt</text>
                <text x={140} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  val_loss 최저일 때만 갱신
                </text>
                <text x={140} y={150} textAnchor="middle" fontSize={8} fill={COLORS.best}>용도: 최종 추론</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.6 }}>
                <rect x={280} y={105} width={200} height={55} rx={8} fill={COLORS.load} fillOpacity={0.06}
                  stroke={COLORS.load} strokeWidth={1.2} />
                <text x={380} y={122} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.load}>last_model.pt</text>
                <text x={380} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  매 epoch 덮어쓰기
                </text>
                <text x={380} y={150} textAnchor="middle" fontSize={8} fill={COLORS.load}>용도: 학습 재개 (resume)</text>
              </motion.g>

              <text x={260} y={186} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                if val_loss &lt; best_loss: save best | 항상: save last
              </text>
            </motion.g>
          )}

          {/* Step 2: Seed fixing */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.seed}>
                4가지 난수 소스 고정 (seed=42)
              </text>
              {[
                { label: 'random', sub: 'Python 내장', detail: 'random.seed(42)', color: '#3b82f6' },
                { label: 'numpy', sub: 'NumPy', detail: 'np.random.seed(42)', color: '#10b981' },
                { label: 'torch', sub: 'PyTorch CPU', detail: 'torch.manual_seed(42)', color: '#f59e0b' },
                { label: 'CUDA', sub: 'PyTorch GPU', detail: 'cuda.manual_seed_all(42)', color: '#ef4444' },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={20 + i * 125} y={38} width={115} height={80} rx={8}
                    fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={1.2} />
                  <text x={78 + i * 125} y={56} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
                    {s.label}
                  </text>
                  <text x={78 + i * 125} y={70} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                    {s.sub}
                  </text>
                  <rect x={28 + i * 125} y={80} width={99} height={22} rx={4} fill="var(--muted)" fillOpacity={0.2} />
                  <text x={78 + i * 125} y={95} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill="var(--muted-foreground)">
                    {s.detail}
                  </text>
                </motion.g>
              ))}
              {/* All four converge */}
              {[0, 1, 2, 3].map((i) => (
                <line key={i} x1={78 + i * 125} y1={120} x2={260} y2={148}
                  stroke={COLORS.seed} strokeWidth={0.8} strokeDasharray="3 2" />
              ))}
              <StatusBox x={200} y={150} w={120} h={45} label="재현 가능" sub="동일 seed → 동일 결과" color={COLORS.seed} progress={1} />
            </motion.g>
          )}

          {/* Step 3: Deterministic settings */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.determ}>
                cuDNN Deterministic 설정
              </text>
              {[
                { label: 'cudnn.deterministic', val: 'True', desc: 'cuDNN 알고리즘 고정', color: COLORS.determ },
                { label: 'cudnn.benchmark', val: 'False', desc: '자동 탐색 비활성', color: COLORS.best },
                { label: 'use_deterministic_algorithms', val: 'True', desc: '비결정적 연산 에러', color: COLORS.seed },
              ].map((s, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  <rect x={30} y={32 + i * 50} width={320} height={40} rx={8}
                    fill={s.color} fillOpacity={0.06} stroke={s.color} strokeWidth={1} />
                  <text x={44} y={50 + i * 50} fontSize={9} fontWeight={700} fontFamily="monospace" fill={s.color}>
                    {s.label} = {s.val}
                  </text>
                  <text x={44} y={64 + i * 50} fontSize={8} fill="var(--muted-foreground)">{s.desc}</text>
                </motion.g>
              ))}
              {/* Speed trade-off */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={370} y={32} width={130} height={130} rx={10} fill="var(--muted)" fillOpacity={0.1}
                  stroke="var(--border)" strokeWidth={0.8} />
                <text x={435} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
                  Trade-off
                </text>
                <text x={435} y={72} textAnchor="middle" fontSize={9} fill={COLORS.determ}>속도 5~10% 감소</text>
                <line x1={390} y1={82} x2={480} y2={82} stroke="var(--border)" strokeWidth={0.5} />
                <text x={435} y={98} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  대회: OFF (속도 우선)
                </text>
                <text x={435} y={114} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  논문: ON (재현 필수)
                </text>
                <text x={435} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  디버깅: ON (버그 추적)
                </text>
              </motion.g>

              <AlertBox x={130} y={180} w={260} h={36} label="DataLoader num_workers>0 시 worker_init_fn 필요" sub="각 워커의 시드도 개별 고정" color={COLORS.determ} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
