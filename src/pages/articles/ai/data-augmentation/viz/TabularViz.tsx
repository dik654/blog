import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './TabularData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function TabularViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tab-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">SMOTE — k-NN 사이에 합성 샘플 생성</text>

              {/* 2D 산점도 */}
              <rect x={30} y={35} width={200} height={180} rx={6}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              <line x1={45} y1={200} x2={220} y2={200} stroke="#888" strokeWidth={0.5} />
              <line x1={45} y1={200} x2={45} y2={45} stroke="#888" strokeWidth={0.5} />

              {/* 다수 클래스 (파란점) */}
              {[
                [70, 170], [90, 155], [110, 165], [85, 180], [120, 175],
                [100, 145], [130, 160], [140, 150], [75, 160], [115, 140],
                [105, 185], [95, 170], [125, 145], [135, 170], [80, 150],
              ].map(([cx, cy], i) => (
                <circle key={`m${i}`} cx={cx} cy={cy} r={3}
                  fill={COLORS.majority} opacity={0.5} />
              ))}

              {/* 소수 클래스 (빨간점) */}
              {[
                [160, 70], [180, 85], [170, 60],
              ].map(([cx, cy], i) => (
                <motion.circle key={`min${i}`} cx={cx} cy={cy} r={4}
                  fill={COLORS.minority} opacity={0.7}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: i * 0.1 }} />
              ))}

              {/* SMOTE 합성점 */}
              {[
                [165, 75], [175, 72], [168, 82], [172, 65],
              ].map(([cx, cy], i) => (
                <motion.circle key={`s${i}`} cx={cx} cy={cy} r={3}
                  fill={COLORS.synthetic} opacity={0.7}
                  stroke={COLORS.synthetic} strokeWidth={0.5}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.1 }} />
              ))}

              {/* 보간 선 */}
              <motion.line x1={160} y1={70} x2={165} y2={75}
                stroke={COLORS.synthetic} strokeWidth={0.8} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.5 }} />
              <motion.line x1={180} y1={85} x2={168} y2={82}
                stroke={COLORS.synthetic} strokeWidth={0.8} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.55 }} />

              {/* 범례 */}
              <circle cx={55} y={55} cy={55} r={3} fill={COLORS.majority} opacity={0.5} />
              <text x={63} y={58} fontSize={7} fill="var(--muted-foreground)">다수</text>
              <circle cx={95} cy={55} r={3} fill={COLORS.minority} opacity={0.7} />
              <text x={103} y={58} fontSize={7} fill="var(--muted-foreground)">소수</text>
              <circle cx={135} cy={55} r={3} fill={COLORS.synthetic} opacity={0.7} />
              <text x={143} y={58} fontSize={7} fill="var(--muted-foreground)">합성</text>

              {/* 수식 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={260} y={40} width={240} height={80} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={380} y={62} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">SMOTE 보간 공식</text>
                <text x={380} y={82} textAnchor="middle" fontSize={9}
                  fill={COLORS.synthetic}>x_new = x + rand(0,1) x (x_nn - x)</text>
                <text x={380} y={100} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">x_nn: k-최근접 이웃 중 랜덤 선택</text>
              </motion.g>

              {/* 주의사항 */}
              <AlertBox x={260} y={140} w={240} h={45}
                label="주의: 노이즈 영역에도 합성 가능"
                sub="Borderline-SMOTE → 경계 근처만 증강" color={COLORS.minority} />

              <text x={260} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                불균형 비율 1:10+ 이상일 때 효과적. 극단적 불균형에는 ADASYN 병행
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">가우시안 노이즈 주입</text>

              {/* 원본 테이블 */}
              <text x={130} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">원본 행</text>
              <rect x={30} y={55} width={200} height={30} rx={4}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
              {['2.5', '0.8', '1.2', '3.1'].map((v, i) => (
                <text key={i} x={55 + i * 50} y={74} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">{v}</text>
              ))}

              {/* + 노이즈 */}
              <text x={130} y={103} textAnchor="middle" fontSize={12}
                fill="var(--muted-foreground)">+</text>
              <rect x={30} y={110} width={200} height={30} rx={4}
                fill={`${COLORS.noise}15`} stroke={COLORS.noise} strokeWidth={0.5} />
              {['+0.02', '-0.01', '+0.03', '-0.02'].map((v, i) => (
                <motion.text key={i} x={55 + i * 50} y={129} textAnchor="middle" fontSize={9}
                  fill={COLORS.noise}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.1 }}>{v}</motion.text>
              ))}

              {/* = 결과 */}
              <text x={130} y={158} textAnchor="middle" fontSize={12}
                fill="var(--muted-foreground)">=</text>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={30} y={165} width={200} height={30} rx={4}
                  fill={`${COLORS.synthetic}12`} stroke={COLORS.synthetic} strokeWidth={0.5} />
                {['2.52', '0.79', '1.23', '3.08'].map((v, i) => (
                  <text key={i} x={55 + i * 50} y={184} textAnchor="middle" fontSize={9}
                    fill={COLORS.synthetic}>{v}</text>
                ))}
              </motion.g>

              {/* 파라미터 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={270} y={55} width={230} height={140} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={385} y={78} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">ε ~ N(0, σ²)</text>
                <text x={385} y={100} textAnchor="middle" fontSize={9}
                  fill={COLORS.noise}>σ = 피처 std의 1~5%</text>

                <line x1={280} y1={115} x2={490} y2={115} stroke="var(--border)" strokeWidth={0.5} />

                <text x={290} y={135} fontSize={8} fontWeight={600}
                  fill={COLORS.synthetic}>연속형 피처</text>
                <text x={290} y={150} fontSize={8}
                  fill="var(--muted-foreground)">정상 적용 가능</text>

                <text x={290} y={170} fontSize={8} fontWeight={600}
                  fill={COLORS.minority}>범주형 피처</text>
                <text x={290} y={185} fontSize={8}
                  fill="var(--muted-foreground)">노이즈 주입 금지 — 의미 파괴</text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Feature-wise Shuffling — 테이블 Dropout</text>

              {/* 원본 테이블 */}
              <text x={130} y={50} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">원본 테이블 (3행 × 4열)</text>
              <rect x={30} y={58} width={200} height={95} rx={4}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

              {/* 헤더 */}
              {['f1', 'f2', 'f3', 'target'].map((h, i) => (
                <text key={h} x={55 + i * 50} y={75} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill="var(--foreground)">{h}</text>
              ))}
              <line x1={35} y1={80} x2={225} y2={80} stroke="var(--border)" strokeWidth={0.5} />

              {/* 데이터 */}
              {[
                ['A', '1.2', '3.4', '0'],
                ['B', '2.5', '1.8', '1'],
                ['C', '0.8', '2.1', '0'],
              ].map((row, r) =>
                row.map((v, c) => (
                  <text key={`${r}-${c}`} x={55 + c * 50} y={97 + r * 18} textAnchor="middle"
                    fontSize={8} fill="var(--foreground)">{v}</text>
                ))
              )}

              {/* 화살표 */}
              <text x={260} y={110} textAnchor="middle" fontSize={14}
                fill="var(--muted-foreground)">→</text>

              {/* 셔플 결과 */}
              <text x={395} y={50} textAnchor="middle" fontSize={9} fontWeight={600}
                fill="var(--foreground)">f2 열 셔플 후</text>
              <rect x={295} y={58} width={200} height={95} rx={4}
                fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />

              {['f1', 'f2', 'f3', 'target'].map((h, i) => (
                <text key={h} x={320 + i * 50} y={75} textAnchor="middle" fontSize={8}
                  fontWeight={600} fill={i === 1 ? COLORS.shuffle : 'var(--foreground)'}>{h}</text>
              ))}
              <line x1={300} y1={80} x2={490} y2={80} stroke="var(--border)" strokeWidth={0.5} />

              {[
                ['A', '0.8', '3.4', '0'],
                ['B', '1.2', '1.8', '1'],
                ['C', '2.5', '2.1', '0'],
              ].map((row, r) =>
                row.map((v, c) => (
                  <motion.text key={`s${r}-${c}`} x={320 + c * 50} y={97 + r * 18}
                    textAnchor="middle" fontSize={8}
                    fill={c === 1 ? COLORS.shuffle : 'var(--foreground)'}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: 0.2 + r * 0.08 }}>{v}</motion.text>
                ))
              )}

              {/* 셔플 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.4 }}>
                <path d="M370,93 C380,85 380,105 370,97" fill="none"
                  stroke={COLORS.shuffle} strokeWidth={0.8} />
                <path d="M370,111 C380,103 380,123 370,115" fill="none"
                  stroke={COLORS.shuffle} strokeWidth={0.8} />
              </motion.g>

              {/* 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={100} y={175} w={320} h={36}
                  label="f2-타겟 관계 끊김 → 모델이 나머지 피처로 예측"
                  sub="앙상블에서 모델 다양성 확보 — Dropout의 테이블 버전" color={COLORS.shuffle} />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={260} y={20} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Tabular Mixup — 행 단위 혼합</text>

              {/* Row 1 */}
              <text x={130} y={48} textAnchor="middle" fontSize={9}
                fill={COLORS.majority}>Row A</text>
              <rect x={30} y={55} width={200} height={28} rx={4}
                fill={`${COLORS.majority}12`} stroke={COLORS.majority} strokeWidth={0.5} />
              {['2.5', '가', '1.2', '3.1'].map((v, i) => (
                <text key={i} x={55 + i * 50} y={73} textAnchor="middle" fontSize={9}
                  fill={COLORS.majority}>{v}</text>
              ))}

              {/* Row 2 */}
              <text x={130} y={100} textAnchor="middle" fontSize={9}
                fill={COLORS.minority}>Row B</text>
              <rect x={30} y={107} width={200} height={28} rx={4}
                fill={`${COLORS.minority}12`} stroke={COLORS.minority} strokeWidth={0.5} />
              {['4.0', '나', '0.5', '1.8'].map((v, i) => (
                <text key={i} x={55 + i * 50} y={125} textAnchor="middle" fontSize={9}
                  fill={COLORS.minority}>{v}</text>
              ))}

              {/* λ */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <DataBox x={80} y={145} w={100} h={26} label="λ = 0.6" sub="Beta(0.4, 0.4)" color={COLORS.shuffle} />
              </motion.g>

              {/* 결과 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <text x={395} y={48} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">Mixup 결과</text>
                <rect x={295} y={55} width={200} height={28} rx={4}
                  fill={`${COLORS.synthetic}12`} stroke={COLORS.synthetic} strokeWidth={0.5} />

                {/* 연속형: 혼합 */}
                <text x={320} y={73} textAnchor="middle" fontSize={9}
                  fill={COLORS.synthetic}>3.1</text>
                {/* 범주형: 확률 선택 */}
                <text x={370} y={73} textAnchor="middle" fontSize={9}
                  fill={COLORS.majority}>가</text>
                <text x={420} y={73} textAnchor="middle" fontSize={9}
                  fill={COLORS.synthetic}>0.92</text>
                <text x={470} y={73} textAnchor="middle" fontSize={9}
                  fill={COLORS.synthetic}>2.58</text>

                {/* 범주형 설명 */}
                <rect x={340} y={90} width={60} height={20} rx={3}
                  fill={`${COLORS.majority}15`} stroke={COLORS.majority} strokeWidth={0.5} strokeDasharray="3 2" />
                <text x={370} y={104} textAnchor="middle" fontSize={7}
                  fill={COLORS.majority}>P=0.6 선택</text>
              </motion.g>

              {/* 피처 타입별 처리 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <rect x={270} y={125} width={240} height={100} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={390} y={145} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">피처 타입별 처리</text>
                <text x={300} y={167} fontSize={8} fontWeight={600}
                  fill={COLORS.synthetic}>연속형</text>
                <text x={300} y={182} fontSize={8}
                  fill="var(--muted-foreground)">λ·a + (1-λ)·b 선형 보간</text>
                <text x={300} y={202} fontSize={8} fontWeight={600}
                  fill={COLORS.minority}>범주형</text>
                <text x={300} y={217} fontSize={8}
                  fill="var(--muted-foreground)">P(λ)로 하나 선택 (보간 불가)</text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
