import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { STEPS, COLORS, FEATURES, CORR_MATRIX } from './CorrelationData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const cellSize = 32;
const ox = 100; // 행렬 시작 x
const oy = 50;  // 행렬 시작 y

function cellColor(v: number): string {
  if (v > 0.5) return COLORS.positive;
  if (v > 0.2) return '#f97316';
  if (v > -0.2) return COLORS.neutral;
  if (v > -0.5) return '#60a5fa';
  return COLORS.negative;
}

export default function CorrelationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={260} y={20} textAnchor="middle" fontSize={12} fontWeight={700}
            fill="var(--foreground)">피처 상관 분석</text>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* 상관 행렬 히트맵 */}
              {CORR_MATRIX.map((row, r) =>
                row.map((v, c) => (
                  <motion.g key={`${r}-${c}`}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: (r * 6 + c) * 0.01 }}>
                    <rect x={ox + c * cellSize} y={oy + r * cellSize} width={cellSize - 2} height={cellSize - 2}
                      rx={4} fill={cellColor(v)} opacity={Math.abs(v) * 0.7 + 0.15} />
                    <text x={ox + c * cellSize + cellSize / 2 - 1} y={oy + r * cellSize + cellSize / 2 + 3}
                      textAnchor="middle" fontSize={7.5} fontWeight={500}
                      fill={Math.abs(v) > 0.5 ? '#fff' : 'var(--foreground)'}>
                      {v.toFixed(2)}
                    </text>
                  </motion.g>
                ))
              )}
              {/* 행/열 라벨 */}
              {FEATURES.map((f, i) => (
                <g key={f}>
                  <text x={ox - 5} y={oy + i * cellSize + cellSize / 2 + 3} textAnchor="end"
                    fontSize={9} fill="var(--foreground)">{f}</text>
                  <text x={ox + i * cellSize + cellSize / 2 - 1} y={oy - 5} textAnchor="middle"
                    fontSize={9} fill="var(--foreground)" transform={`rotate(-25, ${ox + i * cellSize + cellSize / 2}, ${oy - 5})`}>
                    {f}</text>
                </g>
              ))}
              {/* 범례 */}
              <text x={340} y={75} fontSize={9} fontWeight={600} fill="var(--foreground)">범례</text>
              {[
                { label: '강한 양 (>0.5)', color: COLORS.positive, opacity: 0.8 },
                { label: '약한 양 (0.2~0.5)', color: '#f97316', opacity: 0.5 },
                { label: '무관 (-0.2~0.2)', color: COLORS.neutral, opacity: 0.3 },
                { label: '음의 상관 (<-0.2)', color: COLORS.negative, opacity: 0.6 },
              ].map((item, i) => (
                <g key={i}>
                  <rect x={340} y={85 + i * 20} width={14} height={14} rx={3}
                    fill={item.color} opacity={item.opacity} />
                  <text x={360} y={95 + i * 20} fontSize={8} fill="var(--muted-foreground)">{item.label}</text>
                </g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.target}>
                타겟(지연시간)과의 상관계수</text>
              {/* 수평 막대 그래프 */}
              {FEATURES.slice(0, 5).map((f, i) => {
                const v = CORR_MATRIX[i][5];
                const barW = Math.abs(v) * 200;
                const col = v > 0.5 ? COLORS.positive : v > 0.3 ? '#f97316' : v > 0 ? COLORS.neutral : COLORS.negative;
                return (
                  <motion.g key={f} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: i * 0.08 }}>
                    <text x={115} y={80 + i * 32} textAnchor="end" fontSize={10} fill="var(--foreground)">{f}</text>
                    <rect x={120} y={68 + i * 32} width={210} height={18} rx={4} fill="var(--border)" opacity={0.15} />
                    <motion.rect x={v >= 0 ? 120 : 120 + 210 - barW} y={68 + i * 32} width={barW} height={18}
                      rx={4} fill={col} opacity={0.7}
                      initial={{ width: 0 }} animate={{ width: barW }} transition={{ ...sp, delay: i * 0.08 }} />
                    <text x={v >= 0 ? 125 + barW : 115 + 210 - barW} y={81 + i * 32}
                      fontSize={9} fontWeight={600} fill={col}>{v.toFixed(2)}</text>
                  </motion.g>
                );
              })}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={350} y={65} width={155} height={70} rx={8} fill="var(--card)" stroke={COLORS.target} strokeWidth={0.8} />
                <text x={428} y={85} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.target}>
                  강한 상관 피처</text>
                <text x={365} y={102} fontSize={8} fill="var(--foreground)">1. 주문량 (r=0.72)</text>
                <text x={365} y={116} fontSize={8} fill="var(--foreground)">2. 혼잡도 (r=0.62)</text>
                <text x={365} y={130} fontSize={8} fill="var(--muted-foreground)">→ 모델의 핵심 입력 후보</text>
              </motion.g>
              <text x={260} y={250} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                |r| {'<'} 0.1이어도 비선형 관계가 있을 수 있음 → scatter plot으로 추가 확인
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={260} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.warning}>
                다중공선성 — 주문량 ↔ 로봇수 (r=0.82)</text>
              {/* 산점도 시뮬레이션 */}
              {Array.from({ length: 40 }, (_, i) => {
                const x = 80 + Math.random() * 160;
                const noise = (Math.random() - 0.5) * 30;
                const y = 220 - (x - 80) * 0.7 + noise;
                return (
                  <motion.circle key={i} cx={x} cy={y} r={3}
                    fill={COLORS.positive} opacity={0.5}
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: i * 0.015 }} />
                );
              })}
              <text x={160} y={240} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">주문량</text>
              <text x={65} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                transform="rotate(-90, 65, 145)">로봇수</text>
              {/* VIF 설명 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={300} y={65} width={200} height={110} rx={8} fill="var(--card)" stroke={COLORS.warning} strokeWidth={0.8} />
                <text x={400} y={85} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.warning}>VIF 진단</text>
                <text x={315} y={105} fontSize={9} fill="var(--foreground)">주문량  VIF = 12.4  ⚠️</text>
                <text x={315} y={121} fontSize={9} fill="var(--foreground)">로봇수  VIF = 10.8  ⚠️</text>
                <text x={315} y={137} fontSize={9} fill="var(--foreground)">혼잡도  VIF = 4.2  ✓</text>
                <text x={315} y={153} fontSize={9} fill="var(--foreground)">배터리  VIF = 2.1  ✓</text>
                <text x={315} y={169} fontSize={8} fill="var(--muted-foreground)">VIF {'>'} 10 → 하나 제거 or PCA</text>
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* Pearson vs Spearman 비교 */}
              <text x={140} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.neutral}>
                Pearson: 직선만 탐지</text>
              <text x={400} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={COLORS.target}>
                Spearman: 단조 곡선도 탐지</text>

              {/* Pearson 예시: 곡선 관계인데 r≈0 */}
              {Array.from({ length: 30 }, (_, i) => {
                const t = (i / 30) * Math.PI;
                const x = 60 + i * 5.3;
                const y = 160 - Math.sin(t) * 70 + (Math.random() - 0.5) * 15;
                return <motion.circle key={`p${i}`} cx={x} cy={y} r={2.5} fill={COLORS.neutral} opacity={0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: i * 0.02 }} />;
              })}
              <text x={140} y={200} textAnchor="middle" fontSize={9} fill={COLORS.neutral}>r = 0.12 (약함)</text>

              {/* Spearman 예시: 같은 데이터지만 rank 상관 높음 */}
              {Array.from({ length: 30 }, (_, i) => {
                const x = 310 + i * 5.3;
                const y = 180 - Math.sqrt(i / 30) * 100 + (Math.random() - 0.5) * 12;
                return <motion.circle key={`s${i}`} cx={x} cy={y} r={2.5} fill={COLORS.target} opacity={0.6}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: i * 0.02 }} />;
              })}
              <text x={400} y={200} textAnchor="middle" fontSize={9} fill={COLORS.target}>ρ = 0.85 (강함)</text>

              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={120} y={215} width={280} height={40} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={234} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                  Pearson ≈ 0 + Spearman 높음 → 비선형 피처 변환(log, sqrt, ^2) 시도
                </text>
                <text x={260} y={249} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  GBM은 비선형을 자동 학습하지만, 명시적 변환이 수렴 속도를 높인다
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
