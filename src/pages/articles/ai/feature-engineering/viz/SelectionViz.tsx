import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';
import { STEPS, COLORS, sp } from './SelectionVizData';

export default function SelectionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Permutation Importance */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">피처 셔플 → 성능 하락폭 = 중요도</text>
              {/* Original model */}
              <StatusBox x={30} y={40} w={120} h={45} label="원본 모델" sub="AUC = 0.90" color={COLORS.perm} progress={0.9} />
              {/* Shuffled features */}
              {[
                { feat: 'income', drop: 0.12, w: 96 },
                { feat: 'age', drop: 0.08, w: 64 },
                { feat: 'region', drop: 0.02, w: 16 },
                { feat: 'color', drop: 0.00, w: 3 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                  <text x={195} y={55 + i * 38} fontSize={9} fill="var(--foreground)" textAnchor="end">{item.feat}</text>
                  <ActionBox x={205} y={40 + i * 38} w={55} h={24} label="shuffle" sub="" color={COLORS.perm} />
                  <line x1={265} y1={52 + i * 38} x2={290} y2={52 + i * 38} stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#arrowS)" />
                  {/* Importance bar */}
                  <rect x={295} y={44 + i * 38} width={item.w} height={16} rx={3}
                    fill={item.drop > 0.05 ? `${COLORS.perm}40` : `${COLORS.corr}20`}
                    stroke={item.drop > 0.05 ? COLORS.perm : 'var(--border)'} strokeWidth={0.8} />
                  <text x={300 + item.w + 8} y={56 + i * 38} fontSize={9} fontWeight={600}
                    fill={item.drop > 0.05 ? COLORS.perm : 'var(--muted-foreground)'}>
                    -{(item.drop * 100).toFixed(0)}%
                  </text>
                </motion.g>
              ))}
              <text x={260} y={215} textAnchor="middle" fontSize={9} fill={COLORS.perm} fontWeight={600}>
                모델 종류 무관 — 어떤 모델이든 적용 가능
              </text>
            </motion.g>
          )}

          {/* Step 1: SHAP Values */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">SHAP: 각 피처의 예측 기여도 분해</text>
              {/* Base value */}
              <line x1={260} y1={40} x2={260} y2={200} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />
              <text x={260} y={36} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">base value (평균 예측)</text>
              {/* SHAP bars */}
              {[
                { feat: 'income', val: +0.15, color: COLORS.shap },
                { feat: 'age', val: +0.08, color: COLORS.shap },
                { feat: 'region', val: -0.04, color: COLORS.corr },
                { feat: 'gender', val: -0.02, color: COLORS.corr },
                { feat: 'color', val: +0.01, color: COLORS.shap },
              ].map((item, i) => {
                const barW = Math.abs(item.val) * 600;
                const barX = item.val >= 0 ? 260 : 260 - barW;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
                    <text x={barX - (item.val >= 0 ? 5 : -barW - 5)} y={60 + i * 30}
                      textAnchor={item.val >= 0 ? 'end' : 'start'} fontSize={9} fill="var(--foreground)">{item.feat}</text>
                    <motion.rect x={barX} y={50 + i * 30} width={0} height={18} rx={3}
                      fill={item.val >= 0 ? `${COLORS.shap}40` : `${COLORS.corr}40`}
                      stroke={item.val >= 0 ? COLORS.shap : COLORS.corr} strokeWidth={0.8}
                      animate={{ width: barW }} transition={{ ...sp, delay: 0.3 + i * 0.1 }} />
                    <text x={item.val >= 0 ? 260 + barW + 5 : 260 - barW - 5} y={63 + i * 30}
                      textAnchor={item.val >= 0 ? 'start' : 'end'} fontSize={8} fontWeight={600}
                      fill={item.val >= 0 ? COLORS.shap : COLORS.corr}>
                      {item.val >= 0 ? '+' : ''}{item.val.toFixed(2)}
                    </text>
                  </motion.g>
                );
              })}
              <text x={340} y={210} fontSize={8} fill={COLORS.shap}>양수 = 예측 증가</text>
              <text x={140} y={210} fontSize={8} fill={COLORS.corr} textAnchor="end">음수 = 예측 감소</text>
              <text x={260} y={230} textAnchor="middle" fontSize={9} fill={COLORS.shap} fontWeight={600}>
                개별 예측 단위로 해석 가능 — 모델 디버깅에 필수
              </text>
            </motion.g>
          )}

          {/* Step 2: Boruta */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Boruta: 그림자 변수와 비교</text>
              {/* Features + Shadow features */}
              {[
                { feat: 'income', imp: 0.35, shadow: 0.08, accepted: true },
                { feat: 'age', imp: 0.22, shadow: 0.10, accepted: true },
                { feat: 'region', imp: 0.12, shadow: 0.09, accepted: true },
                { feat: 'color', imp: 0.05, shadow: 0.07, accepted: false },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.12 }}>
                  <text x={90} y={55 + i * 42} textAnchor="end" fontSize={9} fill="var(--foreground)">{item.feat}</text>
                  {/* Original importance bar */}
                  <rect x={100} y={43 + i * 42} width={item.imp * 280} height={14} rx={3}
                    fill={item.accepted ? `${COLORS.boruta}35` : `${COLORS.corr}20`}
                    stroke={item.accepted ? COLORS.boruta : COLORS.corr} strokeWidth={0.8} />
                  {/* Shadow importance bar */}
                  <rect x={100} y={59 + i * 42} width={item.shadow * 280} height={10} rx={2}
                    fill="var(--border)" opacity={0.4} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="2 2" />
                  {/* Verdict */}
                  <text x={item.imp * 280 + 110} y={54 + i * 42} fontSize={8} fontWeight={600}
                    fill={item.accepted ? COLORS.boruta : COLORS.corr}>
                    {item.accepted ? '채택' : '기각'}
                  </text>
                </motion.g>
              ))}
              {/* Legend */}
              <rect x={350} y={195} width={20} height={8} rx={2} fill={`${COLORS.boruta}35`} stroke={COLORS.boruta} strokeWidth={0.5} />
              <text x={375} y={203} fontSize={8} fill="var(--muted-foreground)">원본</text>
              <rect x={410} y={195} width={20} height={8} rx={2} fill="var(--border)" opacity={0.4} stroke="var(--muted-foreground)" strokeWidth={0.5} strokeDasharray="2 2" />
              <text x={435} y={203} fontSize={8} fill="var(--muted-foreground)">그림자</text>
              <text x={260} y={225} textAnchor="middle" fontSize={9} fill={COLORS.boruta} fontWeight={600}>
                그림자 변수(셔플 복사본)보다 중요하지 않으면 제거
              </text>
            </motion.g>
          )}

          {/* Step 3: Correlation removal */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">상관 기반 제거: 중복 피처 정리</text>
              {/* Correlation matrix */}
              {['A', 'B', 'C', 'D'].map((h, i) => (
                <text key={`h${i}`} x={160 + i * 60} y={50} textAnchor="middle" fontSize={9} fill="var(--foreground)">{h}</text>
              ))}
              {['A', 'B', 'C', 'D'].map((h, i) => (
                <text key={`v${i}`} x={108} y={78 + i * 40} textAnchor="end" fontSize={9} fill="var(--foreground)">{h}</text>
              ))}
              {[
                [1.00, 0.97, 0.12, 0.45],
                [0.97, 1.00, 0.15, 0.42],
                [0.12, 0.15, 1.00, 0.08],
                [0.45, 0.42, 0.08, 1.00],
              ].map((row, ri) =>
                row.map((v, ci) => {
                  const isHigh = v > 0.95 && ri !== ci;
                  return (
                    <motion.g key={`${ri}-${ci}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: (ri * 4 + ci) * 0.03 }}>
                      <rect x={130 + ci * 60} y={60 + ri * 40} width={56} height={32} rx={4}
                        fill={isHigh ? `${COLORS.corr}25` : v > 0.3 ? `${COLORS.rfe}10` : 'var(--card)'}
                        stroke={isHigh ? COLORS.corr : 'var(--border)'} strokeWidth={isHigh ? 1.5 : 0.5} />
                      <text x={158 + ci * 60} y={80 + ri * 40} textAnchor="middle" fontSize={10}
                        fontWeight={isHigh ? 700 : 400} fill={isHigh ? COLORS.corr : 'var(--muted-foreground)'}>
                        {v.toFixed(2)}
                      </text>
                    </motion.g>
                  );
                })
              )}
              {/* Highlight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <AlertBox x={400} y={70} w={95} h={40} label="r = 0.97" sub="B 제거 후보" color={COLORS.corr} />
              </motion.g>
              <text x={260} y={225} textAnchor="middle" fontSize={9} fill={COLORS.corr} fontWeight={600}>
                상관 0.95+ 쌍에서 중요도 낮은 쪽을 제거
              </text>
            </motion.g>
          )}

          {/* Step 4: RFE */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">RFE: 반복 학습 → 최약 피처 제거</text>
              {/* Iteration steps */}
              {[
                { round: 1, feats: 'A B C D E F', remove: 'F', score: 0.88, n: 6 },
                { round: 2, feats: 'A B C D E', remove: 'E', score: 0.89, n: 5 },
                { round: 3, feats: 'A B C D', remove: 'D', score: 0.91, n: 4 },
                { round: 4, feats: 'A B C', remove: '-', score: 0.90, n: 3 },
              ].map((iter, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.15 }}>
                  {/* Round box */}
                  <rect x={30} y={42 + i * 42} width={36} height={28} rx={14}
                    fill={`${COLORS.rfe}15`} stroke={COLORS.rfe} strokeWidth={0.8} />
                  <text x={48} y={60 + i * 42} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.rfe}>R{iter.round}</text>
                  {/* Feature list */}
                  <text x={80} y={60 + i * 42} fontSize={9} fill="var(--foreground)">{iter.feats}</text>
                  {/* Remove indicator */}
                  {iter.remove !== '-' && (
                    <text x={280} y={60 + i * 42} fontSize={9} fill={COLORS.corr} fontWeight={600}>
                      -{iter.remove}
                    </text>
                  )}
                  {/* Score */}
                  <StatusBox x={330} y={38 + i * 42} w={90} h={34} label={`AUC ${iter.score}`} sub={`${iter.n}개 피처`}
                    color={i === 2 ? COLORS.rfe : 'var(--muted-foreground)'} progress={iter.score} />
                  {i === 2 && (
                    <text x={440} y={60 + i * 42} fontSize={9} fontWeight={700} fill={COLORS.rfe}>best</text>
                  )}
                </motion.g>
              ))}
              <text x={260} y={225} textAnchor="middle" fontSize={9} fill={COLORS.rfe} fontWeight={600}>
                성능이 떨어지기 시작하는 지점이 최적 피처 수
              </text>
            </motion.g>
          )}

          <defs>
            <marker id="arrowS" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
