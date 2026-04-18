import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './LoggingVizData';

export default function LoggingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrLg" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>

          {/* Step 0: Recording structure */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Loss & Metric 기록 흐름
              </text>
              {/* Train loop */}
              <rect x={20} y={30} width={220} height={75} rx={8} fill={COLORS.train} fillOpacity={0.04}
                stroke={COLORS.train} strokeWidth={1} />
              <text x={130} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.train}>Train Loop</text>
              {[
                { label: 'batch_loss', x: 35 },
                { label: '+=', x: 108 },
                { label: 'running_loss', x: 130 },
              ].map((item, i) => (
                <text key={i} x={item.x} y={70} fontSize={9} fill="var(--muted-foreground)" fontFamily="monospace">
                  {item.label}
                </text>
              ))}
              <text x={130} y={92} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                epoch_loss = running_loss / len(loader)
              </text>

              {/* Val loop */}
              <rect x={270} y={30} width={220} height={75} rx={8} fill={COLORS.val} fillOpacity={0.04}
                stroke={COLORS.val} strokeWidth={1} />
              <text x={380} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.val}>Validation</text>
              <text x={380} y={68} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
                val_loss + metric
              </text>
              <text x={380} y={84} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                accuracy, F1, AUC 등
              </text>

              {/* Storage */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.3 }}>
                <line x1={130} y1={107} x2={200} y2={130} stroke="var(--border)" strokeWidth={1} />
                <line x1={380} y1={107} x2={310} y2={130} stroke="var(--border)" strokeWidth={1} />
                <rect x={155} y={130} width={200} height={40} rx={8} fill={COLORS.metric} fillOpacity={0.06}
                  stroke={COLORS.metric} strokeWidth={1} />
                <text x={255} y={148} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.metric}>
                  history dict
                </text>
                <text x={255} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  {'{'}train_loss: [], val_loss: [], metric: []{'}'}
                </text>
              </motion.g>

              <text x={260} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                리스트에 저장 → matplotlib/seaborn으로 학습곡선 시각화
              </text>
            </motion.g>
          )}

          {/* Step 1: Learning curve overfitting detection */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                학습곡선: 오버피팅 시각적 감지
              </text>
              {/* Axes */}
              <line x1={60} y1={30} x2={60} y2={170} stroke="var(--border)" strokeWidth={1.5} />
              <line x1={60} y1={170} x2={460} y2={170} stroke="var(--border)" strokeWidth={1.5} />
              <text x={40} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                transform="rotate(-90 40 100)">loss</text>
              <text x={260} y={190} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">epoch</text>

              {/* Train loss curve (goes down) */}
              <motion.path
                d="M80,150 Q150,120 200,95 Q250,75 300,60 Q350,48 400,40 Q430,36 450,34"
                fill="none" stroke={COLORS.train} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
              <text x={455} y={30} fontSize={9} fontWeight={600} fill={COLORS.train}>train</text>

              {/* Val loss curve (goes down then up) */}
              <motion.path
                d="M80,155 Q150,130 200,110 Q250,95 300,92 Q350,100 400,120 Q430,140 450,155"
                fill="none" stroke={COLORS.val} strokeWidth={2}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.2 }}
              />
              <text x={455} y={158} fontSize={9} fontWeight={600} fill={COLORS.val}>val</text>

              {/* Overfitting zone */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 1 }}>
                <rect x={280} y={28} width={175} height={140} rx={0} fill={COLORS.overfit} fillOpacity={0.05}
                  stroke={COLORS.overfit} strokeWidth={1} strokeDasharray="4 3" />
                <text x={368} y={80} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.overfit}>
                  Overfitting
                </text>
                <text x={368} y={95} textAnchor="middle" fontSize={8} fill={COLORS.overfit}>
                  gap이 벌어지는 구간
                </text>
                {/* Vertical line at divergence */}
                <line x1={300} y1={30} x2={300} y2={168} stroke={COLORS.overfit} strokeWidth={1} strokeDasharray="3 2" />
                <text x={300} y={200} textAnchor="middle" fontSize={8} fill={COLORS.overfit} fontWeight={600}>
                  early stop 시점
                </text>
              </motion.g>
            </motion.g>
          )}

          {/* Step 2: Early Stopping */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.val}>
                Early Stopping (patience=3)
              </text>
              {/* Epoch sequence */}
              {[
                { e: 1, loss: 0.52, better: true, cnt: 0 },
                { e: 2, loss: 0.41, better: true, cnt: 0 },
                { e: 3, loss: 0.38, better: true, cnt: 0 },
                { e: 4, loss: 0.39, better: false, cnt: 1 },
                { e: 5, loss: 0.40, better: false, cnt: 2 },
                { e: 6, loss: 0.42, better: false, cnt: 3 },
              ].map((item, i) => {
                const x = 25 + i * 80;
                const isStop = item.cnt === 3;
                return (
                  <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.12 }}>
                    <rect x={x} y={34} width={72} height={70} rx={8}
                      fill={isStop ? COLORS.overfit : item.better ? COLORS.metric : COLORS.val}
                      fillOpacity={0.06}
                      stroke={isStop ? COLORS.overfit : item.better ? COLORS.metric : COLORS.val}
                      strokeWidth={isStop ? 1.5 : 0.8} />
                    <text x={x + 36} y={50} textAnchor="middle" fontSize={9} fontWeight={700}
                      fill={isStop ? COLORS.overfit : 'var(--foreground)'}>E{item.e}</text>
                    <text x={x + 36} y={65} textAnchor="middle" fontSize={8} fontFamily="monospace"
                      fill="var(--muted-foreground)">val={item.loss}</text>
                    <text x={x + 36} y={80} textAnchor="middle" fontSize={8}
                      fill={item.better ? COLORS.metric : COLORS.overfit}>
                      {item.better ? 'best 갱신' : `cnt=${item.cnt}`}
                    </text>
                    {isStop && (
                      <text x={x + 36} y={95} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.overfit}>
                        STOP
                      </text>
                    )}
                  </motion.g>
                );
              })}

              {/* Result: use epoch 3 model */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
                <rect x={100} y={125} width={320} height={44} rx={8} fill={COLORS.metric} fillOpacity={0.06}
                  stroke={COLORS.metric} strokeWidth={1.2} />
                <text x={260} y={145} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.metric}>
                  E3의 best_model.pt를 최종 모델로 사용
                </text>
                <text x={260} y={160} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  patience=3: 3번 연속 개선 없으면 중단 → E6에서 STOP
                </text>
              </motion.g>

              <text x={260} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                patience=5~10이 실전 표준. 너무 작으면 조기 중단, 너무 크면 과적합.
              </text>
            </motion.g>
          )}

          {/* Step 3: W&B / TensorBoard */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                실험 관리 도구 연동
              </text>
              {/* W&B */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.1 }}>
                <rect x={20} y={32} width={230} height={110} rx={10} fill={COLORS.wandb} fillOpacity={0.06}
                  stroke={COLORS.wandb} strokeWidth={1.2} />
                <text x={135} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.wandb}>
                  Weights & Biases
                </text>
                <text x={135} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  클라우드 대시보드 · 실험 비교
                </text>
                <rect x={35} y={78} width={200} height={22} rx={4} fill="var(--muted)" fillOpacity={0.2} />
                <text x={135} y={93} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.wandb}>
                  wandb.log({'{'}loss, lr, metric{'}'})
                </text>
                {[
                  { label: '실시간 차트', x: 40 },
                  { label: '팀 공유', x: 120 },
                  { label: 'HP 추적', x: 185 },
                ].map((f, i) => (
                  <text key={i} x={f.x} y={125} fontSize={8} fill={COLORS.wandb}>{f.label}</text>
                ))}
              </motion.g>

              {/* TensorBoard */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.2 }}>
                <rect x={270} y={32} width={230} height={110} rx={10} fill={COLORS.tb} fillOpacity={0.06}
                  stroke={COLORS.tb} strokeWidth={1.2} />
                <text x={385} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.tb}>
                  TensorBoard
                </text>
                <text x={385} y={68} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  로컬 시각화 · PyTorch 내장
                </text>
                <rect x={285} y={78} width={200} height={22} rx={4} fill="var(--muted)" fillOpacity={0.2} />
                <text x={385} y={93} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.tb}>
                  writer.add_scalar("loss", v, step)
                </text>
                {[
                  { label: '스칼라 차트', x: 290 },
                  { label: '히스토그램', x: 370 },
                  { label: '그래프', x: 440 },
                ].map((f, i) => (
                  <text key={i} x={f.x} y={125} fontSize={8} fill={COLORS.tb}>{f.label}</text>
                ))}
              </motion.g>

              {/* Common ground */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={155} width={360} height={40} rx={8} fill="var(--muted)" fillOpacity={0.1}
                  stroke="var(--border)" strokeWidth={0.8} />
                <text x={260} y={173} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                  공통: 실시간 모니터링 + 실험 비교 + 하이퍼파라미터 추적
                </text>
                <text x={260} y={188} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  대회: W&B (팀 공유) | 개인: TensorBoard (간편) | 기업: MLflow (파이프라인)
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
