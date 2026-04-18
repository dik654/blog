import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, sp } from './OptunaFlowVizData';

export default function OptunaFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* Step 0: Study object */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={170} y={10} w={140} h={50} label="Study" sub="최적화 세션" color="#6366f1" />
              {/* Properties */}
              <DataBox x={50} y={80} w={100} h={30} label="direction" sub="minimize" color="#10b981" />
              <DataBox x={180} y={80} w={100} h={30} label="sampler" sub="TPESampler" color="#f59e0b" />
              <DataBox x={320} y={80} w={100} h={30} label="storage" sub="RDB / in-memory" color="#3b82f6" />
              {/* Arrows from study to properties */}
              <line x1={210} y1={60} x2={100} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={240} y1={60} x2={230} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              <line x1={270} y1={60} x2={370} y2={80} stroke="var(--muted-foreground)" strokeWidth={0.5} />
              {/* Code snippet */}
              <rect x={80} y={130} width={320} height={50} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <text x={95} y={148} fontSize={8} fill="#6366f1" fontFamily="monospace">study = optuna.create_study(</text>
              <text x={105} y={160} fontSize={8} fill="var(--muted-foreground)" fontFamily="monospace">direction="minimize", sampler=TPESampler()</text>
              <text x={95} y={172} fontSize={8} fill="#6366f1" fontFamily="monospace">)</text>
            </motion.g>
          )}

          {/* Step 1: Trial — define-by-run */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={180} y={8} w={120} h={44} label="Trial #n" sub="파라미터 1회 평가" color="#10b981" />
              {/* Arrow down from Trial */}
              <line x1={240} y1={52} x2={240} y2={62} stroke="var(--muted-foreground)" strokeWidth={0.5} markerEnd="url(#arrGray)" />

              {/* suggest calls — wider boxes, tighter gap */}
              <ActionBox x={15} y={68} w={140} h={38} label="suggest_float" sub="lr · 1e-5~1e-1 · log" color="#10b981" />
              <ActionBox x={170} y={68} w={140} h={38} label="suggest_int" sub="n_layers · 1~4" color="#3b82f6" />
              <ActionBox x={325} y={68} w={140} h={38} label="suggest_categorical" sub="opt · [Adam, SGD]" color="#8b5cf6" />

              {/* Conditional branch — centered under categorical box */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={395} y1={106} x2={395} y2={124} stroke="#8b5cf6" strokeWidth={1} strokeDasharray="2 2" />
                <rect x={15} y={124} width={450} height={36} rx={6}
                  fill="#8b5cf610" stroke="#8b5cf6" strokeWidth={0.5} strokeDasharray="4 2" />
                <text x={240} y={141} textAnchor="middle" fontSize={8.5} fill="#8b5cf6" fontFamily="monospace">
                  if opt == "SGD": trial.suggest_float("momentum", 0.0, 0.99)
                </text>
                <text x={240} y={154} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  define-by-run — 이전 suggest 결과에 따라 다음 탐색 공간이 동적으로 결정됨
                </text>
              </motion.g>

              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                각 suggest 호출이 탐색 공간을 동적으로 정의
              </text>
            </motion.g>
          )}

          {/* Step 2: Objective function */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={160} y={10} w={160} h={40} label="def objective(trial):" sub="사용자 정의 평가 함수" color="#ec4899" />
              {/* Flow: params → train → evaluate → return */}
              {[
                { x: 60, y: 70, w: 90, label: '파라미터 수신', color: '#6366f1' },
                { x: 170, y: 70, w: 90, label: '모델 학습', color: '#10b981' },
                { x: 280, y: 70, w: 90, label: '검증 평가', color: '#f59e0b' },
                { x: 390, y: 70, w: 70, label: 'return', color: '#ef4444' },
              ].map((b, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <rect x={b.x} y={b.y} width={b.w} height={28} rx={14}
                    fill={`${b.color}10`} stroke={b.color} strokeWidth={0.7} />
                  <text x={b.x + b.w / 2} y={b.y + 17} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={b.color}>{b.label}</text>
                  {i < 3 && (
                    <line x1={b.x + b.w + 2} y1={b.y + 14} x2={b.x + b.w + 16} y2={b.y + 14}
                      stroke="var(--muted-foreground)" strokeWidth={0.7} markerEnd="url(#arrGray)" />
                  )}
                </motion.g>
              ))}
              {/* report + prune */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
                <rect x={120} y={118} width={240} height={44} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={135} y={135} fontSize={8} fill="#f59e0b" fontFamily="monospace">trial.report(val_loss, epoch)</text>
                <text x={135} y={150} fontSize={8} fill="#ef4444" fontFamily="monospace">if trial.should_prune(): raise TrialPruned()</text>
              </motion.g>
              <text x={240} y={184} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                중간 보고로 Pruner가 조기 종료 여부를 판단
              </text>
            </motion.g>
          )}

          {/* Step 3: optimize loop */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Cycle: Sampler → Objective → Storage → Sampler */}
              <ModuleBox x={30} y={50} w={100} h={48} label="Sampler" sub="TPE 제안" color="#6366f1" />
              <ActionBox x={190} y={50} w={100} h={48} label="Objective" sub="모델 평가" color="#10b981" />
              <ModuleBox x={350} y={50} w={100} h={48} label="Storage" sub="이력 저장" color="#f59e0b" />

              {/* Arrows */}
              <motion.line x1={130} y1={74} x2={188} y2={74} stroke="#6366f1" strokeWidth={1.2}
                markerEnd="url(#arrBlue)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4 }} />
              <motion.line x1={290} y1={74} x2={348} y2={74} stroke="#10b981" strokeWidth={1.2}
                markerEnd="url(#arrGreen)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }} />
              {/* Return arrow (curved) */}
              <motion.path d="M400,98 Q400,150 240,150 Q80,150 80,98"
                fill="none" stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2"
                markerEnd="url(#arrOrange)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }} />
              <text x={240} y={145} textAnchor="middle" fontSize={8} fill="#f59e0b">
                이력 분석 → 다음 제안
              </text>

              {/* Top label */}
              <text x={240} y={24} textAnchor="middle" fontSize={10} fill="var(--foreground)" fontWeight={600}>
                study.optimize(objective, n_trials=100)
              </text>

              {/* Parallel note */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                <DataBox x={160} y={170} w={160} h={24} label="n_jobs=-1 → 병렬 실행" color="#3b82f6" />
              </motion.g>
            </motion.g>
          )}

          {/* Step 4: Dashboard visualization */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Three viz panels — each uses local coordinates relative to panel.x/y */}
              {[
                { x: 20, y: 15, title: 'optimization_history', color: '#6366f1' },
                { x: 170, y: 15, title: 'param_importances', color: '#10b981' },
                { x: 320, y: 15, title: 'contour', color: '#f59e0b' },
              ].map((panel, pi) => {
                const W = 140;
                const H = 110;
                return (
                  <motion.g key={pi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: pi * 0.15 }}>
                    <rect x={panel.x} y={panel.y} width={W} height={H} rx={6}
                      fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                    <rect x={panel.x} y={panel.y} width={W} height={4} rx={2} fill={panel.color} fillOpacity={0.6} />
                    <text x={panel.x + W / 2} y={panel.y + 20} textAnchor="middle"
                      fontSize={8} fontWeight={600} fill={panel.color}>{panel.title}</text>

                    {/* Mini chart inside — using panel-relative offsets */}
                    {pi === 0 && (
                      <g>
                        {/* Descending line (optimization history) */}
                        {(() => {
                          const pts = [
                            { x: 15, y: 95 }, { x: 32, y: 85 }, { x: 50, y: 78 },
                            { x: 68, y: 70 }, { x: 86, y: 62 }, { x: 104, y: 55 }, { x: 122, y: 50 },
                          ];
                          const poly = pts.map(p => `${panel.x + p.x},${panel.y + p.y}`).join(' ');
                          return (
                            <g>
                              <polyline points={poly} fill="none" stroke="#6366f1" strokeWidth={1.2} />
                              {pts.map((p, ci) => (
                                <circle key={ci} cx={panel.x + p.x} cy={panel.y + p.y} r={2}
                                  fill="#6366f1" />
                              ))}
                            </g>
                          );
                        })()}
                      </g>
                    )}
                    {pi === 1 && (
                      <g>
                        {/* Horizontal bars — label left, bar right */}
                        {[
                          { w: 75, label: 'lr', y: 34 },
                          { w: 50, label: 'leaves', y: 52 },
                          { w: 30, label: 'child', y: 70 },
                          { w: 18, label: 'sub', y: 88 },
                        ].map((b, bi) => (
                          <g key={bi}>
                            <text x={panel.x + 38} y={panel.y + b.y + 9} textAnchor="end"
                              fontSize={7} fill="var(--muted-foreground)">{b.label}</text>
                            <rect x={panel.x + 42} y={panel.y + b.y} width={b.w} height={11} rx={2}
                              fill="#10b981" fillOpacity={0.6} />
                          </g>
                        ))}
                      </g>
                    )}
                    {pi === 2 && (
                      <g>
                        {/* Contour approximation (concentric ellipses) — centered in panel */}
                        <ellipse cx={panel.x + W / 2} cy={panel.y + 65} rx={48} ry={28} fill="none"
                          stroke="#f59e0b" strokeWidth={0.5} strokeOpacity={0.3} />
                        <ellipse cx={panel.x + W / 2} cy={panel.y + 65} rx={32} ry={18} fill="none"
                          stroke="#f59e0b" strokeWidth={0.7} strokeOpacity={0.5} />
                        <ellipse cx={panel.x + W / 2} cy={panel.y + 65} rx={16} ry={9} fill="#f59e0b" fillOpacity={0.15}
                          stroke="#f59e0b" strokeWidth={0.8} />
                        <circle cx={panel.x + W / 2} cy={panel.y + 65} r={3} fill="#f59e0b" />
                        <text x={panel.x + W / 2} y={panel.y + 100} textAnchor="middle" fontSize={7} fill="#f59e0b">최적 영역</text>
                      </g>
                    )}
                  </motion.g>
                );
              })}

              <text x={240} y={148} textAnchor="middle" fontSize={9} fill="var(--foreground)" fontWeight={600}>
                optuna.visualization — Plotly 기반 인터랙티브 차트
              </text>
              <text x={240} y={164} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                optuna-dashboard로 실시간 모니터링도 가능
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrGray" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
            <marker id="arrBlue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#6366f1" />
            </marker>
            <marker id="arrGreen" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#10b981" />
            </marker>
            <marker id="arrOrange" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#f59e0b" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
