import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './AggregationVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.2} markerEnd="url(#agg-arrow)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ ...sp, delay }} />
  );
}

export default function AggregationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="agg-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">시퀀스 → Flat Feature 변환</text>

              {/* 가변 시퀀스 */}
              <text x={100} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.pipeline}>
                이벤트 시퀀스 (가변)</text>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.rect key={i} x={30 + i * 32} y={56} width={28} height={20} rx={4}
                  fill={`${COLORS.pipeline}20`} stroke={COLORS.pipeline} strokeWidth={0.6}
                  initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.06 }} />
              ))}

              {/* 집계 화살표 */}
              <Arrow x1={195} y1={66} x2={240} y2={66} color={COLORS.stat} delay={0.3} />
              <ActionBox x={245} y={50} w={80} h={32} label="집계 함수" sub="mean, count, ..." color={COLORS.stat} />
              <Arrow x1={328} y1={66} x2={370} y2={66} color={COLORS.stat} delay={0.4} />

              {/* flat feature */}
              <text x={420} y={48} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.accent}>
                고정 행 벡터</text>
              {['f1', 'f2', 'f3', 'f4', 'f5'].map((f, i) => (
                <motion.rect key={f} x={375 + i * 22} y={56} width={18} height={20} rx={3}
                  fill={`${COLORS.accent}20`} stroke={COLORS.accent} strokeWidth={0.5}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.5 + i * 0.05 }} />
              ))}

              {/* GBM */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
                <Arrow x1={420} y1={80} x2={420} y2={110} color={COLORS.window} delay={0.6} />
                <ModuleBox x={370} y={115} w={100} h={36} label="GBM" sub="LightGBM / XGB" color={COLORS.window} />
              </motion.g>

              <text x={250} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                장점: 기존 테이블 파이프라인과 바로 결합
              </text>
              <text x={250} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                단점: 시퀀스 내 세밀한 순서·맥락 정보 일부 손실
              </text>

              {/* 3가지 집계 유형 */}
              {[
                { label: '통계 집계', sub: 'mean, std, mode', color: COLORS.stat, x: 60 },
                { label: 'n-gram', sub: '연속 패턴 빈도', color: COLORS.ngram, x: 200 },
                { label: '전환 확률', sub: 'P(B|A)', color: COLORS.transition, x: 340 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: 0.7 + i * 0.1 }}>
                  <DataBox x={item.x} y={168} w={120} h={28} label={item.label}
                    sub={item.sub} color={item.color} />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">기본 통계 집계</text>

              {/* 원본 시퀀스 */}
              <text x={100} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.pipeline}>x좌표 시퀀스</text>
              {[32, 48, 55, 40, 65, 72, 38].map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={20 + i * 28} y={50} width={24} height={20} rx={3}
                    fill={`${COLORS.stat}20`} stroke={COLORS.stat} strokeWidth={0.5} />
                  <text x={32 + i * 28} y={63} textAnchor="middle" fontSize={8}
                    fill={COLORS.stat}>{v}</text>
                </motion.g>
              ))}

              {/* 집계 결과 */}
              {[
                { label: 'mean', value: '50.0', y: 90 },
                { label: 'std', value: '14.8', y: 112 },
                { label: 'min', value: '32', y: 134 },
                { label: 'max', value: '72', y: 156 },
                { label: 'median', value: '48', y: 178 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
                  <ActionBox x={30} y={item.y} w={70} h={18} label={item.label} color={COLORS.stat} />
                  <rect x={108} y={item.y} width={50} height={18} rx={3}
                    fill={`${COLORS.stat}15`} stroke={COLORS.stat} strokeWidth={0.4} />
                  <text x={133} y={item.y + 12} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={COLORS.stat}>{item.value}</text>
                </motion.g>
              ))}

              {/* 범주형 */}
              <text x={340} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.ngram}>이벤트 타입 시퀀스</text>
              {['패스', '패스', '드리블', '슛', '패스', '크로스', '패스'].map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={240 + i * 38} y={50} width={34} height={20} rx={3}
                    fill={`${COLORS.ngram}15`} stroke={COLORS.ngram} strokeWidth={0.5} />
                  <text x={257 + i * 38} y={63} textAnchor="middle" fontSize={7}
                    fill={COLORS.ngram}>{v}</text>
                </motion.g>
              ))}

              {[
                { label: 'mode', value: '패스', y: 90 },
                { label: 'nunique', value: '4', y: 112 },
                { label: 'count', value: '7', y: 134 },
                { label: 'pass_ratio', value: '0.57', y: 156 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
                  <ActionBox x={270} y={item.y} w={80} h={18} label={item.label} color={COLORS.ngram} />
                  <rect x={358} y={item.y} width={55} height={18} rx={3}
                    fill={`${COLORS.ngram}15`} stroke={COLORS.ngram} strokeWidth={0.4} />
                  <text x={385} y={item.y + 12} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={COLORS.ngram}>{item.value}</text>
                </motion.g>
              ))}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">최근 N개 윈도우 통계</text>

              {/* 전체 시퀀스 */}
              <text x={250} y={42} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                x좌표: 전체 10개 이벤트</text>
              {[30, 42, 55, 38, 62, 70, 45, 58, 75, 80].map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.04 }}>
                  <rect x={50 + i * 40} y={50} width={36} height={22} rx={3}
                    fill={i >= 7 ? `${COLORS.window}30` : `${COLORS.stat}12`}
                    stroke={i >= 7 ? COLORS.window : 'var(--border)'} strokeWidth={i >= 7 ? 1 : 0.5} />
                  <text x={68 + i * 40} y={64} textAnchor="middle" fontSize={8}
                    fill={i >= 7 ? COLORS.window : 'var(--foreground)'}>{v}</text>
                </motion.g>
              ))}

              {/* 윈도우 브래킷 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <rect x={328} y={48} width={160} height={26} rx={4}
                  fill="transparent" stroke={COLORS.window} strokeWidth={1.5} strokeDasharray="4 2" />
                <text x={408} y={46} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.window}>최근 3개</text>
              </motion.g>

              {/* 비교 */}
              <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={40} y={95} w={180} h={30} label="전체 평균: 55.5"
                  sub="과거 패턴 포함" color={COLORS.stat} />
                <ActionBox x={280} y={95} w={180} h={30} label="최근 3개 평균: 71.0"
                  sub="상승 추세 반영" color={COLORS.window} />
              </motion.g>

              {/* 바 차트 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={160} y={148} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.stat}>전체</text>
                <motion.rect x={130} y={155} width={55.5 * 1.0} height={14} rx={3}
                  fill={COLORS.stat} opacity={0.5}
                  initial={{ width: 0 }} animate={{ width: 55.5 }} transition={{ ...sp, delay: 0.7 }} />
                <text x={190} y={165} fontSize={8} fill="var(--foreground)">55.5</text>

                <text x={160} y={185} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.window}>최근 3</text>
                <motion.rect x={130} y={190} width={71 * 1.0} height={14} rx={3}
                  fill={COLORS.window} opacity={0.5}
                  initial={{ width: 0 }} animate={{ width: 71 }} transition={{ ...sp, delay: 0.8 }} />
                <text x={206} y={200} fontSize={8} fill="var(--foreground)">71.0</text>
              </motion.g>

              <text x={400} y={165} fontSize={8} fontWeight={600} fill={COLORS.window}>
                EWMA도 활용 가능
              </text>
              <text x={400} y={180} fontSize={7} fill="var(--muted-foreground)">
                α=0.3이면 최신 이벤트에
              </text>
              <text x={400} y={192} fontSize={7} fill="var(--muted-foreground)">
                30% 가중치 부여
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">n-gram 패턴 피처</text>

              {/* 원본 시퀀스 */}
              <text x={250} y={40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                이벤트 시퀀스 예시</text>
              {['패스', '패스', '드리블', '슛', '패스', '드리블', '패스'].map((ev, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.05 }}>
                  <rect x={55 + i * 56} y={48} width={50} height={20} rx={10}
                    fill={`${COLORS.ngram}15`} stroke={COLORS.ngram} strokeWidth={0.5} />
                  <text x={80 + i * 56} y={61} textAnchor="middle" fontSize={8}
                    fill={COLORS.ngram}>{ev}</text>
                </motion.g>
              ))}

              {/* bigram 추출 */}
              <text x={130} y={88} textAnchor="start" fontSize={9} fontWeight={600}
                fill={COLORS.ngram}>bigram 빈도</text>
              {[
                { gram: '패스→패스', cnt: 1, w: 30 },
                { gram: '패스→드리블', cnt: 2, w: 60 },
                { gram: '드리블→슛', cnt: 1, w: 30 },
                { gram: '슛→패스', cnt: 1, w: 30 },
                { gram: '드리블→패스', cnt: 1, w: 30 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                  <text x={55} y={106 + i * 18} fontSize={8} fill="var(--foreground)">{item.gram}</text>
                  <motion.rect x={155} y={96 + i * 18} width={item.w} height={12} rx={3}
                    fill={COLORS.ngram} opacity={0.5}
                    initial={{ width: 0 }} animate={{ width: item.w }}
                    transition={{ ...sp, delay: 0.4 + i * 0.08 }} />
                  <text x={160 + item.w} y={106 + i * 18} fontSize={7}
                    fill="var(--muted-foreground)">{item.cnt}</text>
                </motion.g>
              ))}

              {/* 의미 해석 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <text x={370} y={100} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.transition}>패턴 해석</text>
                <DataBox x={300} y={108} w={140} h={24} label="패스→드리블 많음"
                  sub="빌드업 → 돌파 패턴" color={COLORS.ngram} />
                <DataBox x={300} y={140} w={140} h={24} label="드리블→슛 있음"
                  sub="돌파형 마무리" color={COLORS.accent} />
                <text x={370} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  trigram으로 확장하면 더 복잡한 패턴 포착 가능
                </text>
                <text x={370} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  단, 피처 수 폭발 주의 → 빈도 상위 k개만 선택
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">전환 확률 행렬</text>

              <text x={250} y={38} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                P(다음|현재) — 각 셀이 하나의 피처</text>

              {/* 행렬 */}
              {['패스', '드리블', '슛', '크로스'].map((from, r) => (
                <g key={`row-${r}`}>
                  <text x={90} y={72 + r * 32} textAnchor="end" fontSize={9}
                    fontWeight={600} fill="var(--foreground)">{from}</text>
                  {['패스', '드리블', '슛', '크로스'].map((to, c) => {
                    const vals = [
                      [0.3, 0.4, 0.1, 0.2],
                      [0.2, 0.1, 0.5, 0.2],
                      [0.6, 0.2, 0.0, 0.2],
                      [0.4, 0.1, 0.3, 0.2],
                    ];
                    const v = vals[r][c];
                    const alpha = Math.round(v * 180 + 30);
                    return (
                      <motion.g key={`${r}-${c}`} initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ ...sp, delay: (r * 4 + c) * 0.03 }}>
                        <rect x={100 + c * 50} y={58 + r * 32} width={44} height={26} rx={4}
                          fill={v >= 0.4 ? `${COLORS.transition}${alpha.toString(16)}` :
                            v >= 0.2 ? `${COLORS.stat}${alpha.toString(16)}` :
                              `var(--card)`}
                          stroke="var(--border)" strokeWidth={0.4} />
                        <text x={122 + c * 50} y={75 + r * 32} textAnchor="middle"
                          fontSize={9} fontWeight={v >= 0.4 ? 700 : 400}
                          fill={v >= 0.4 ? '#fff' : 'var(--foreground)'}>{v.toFixed(1)}</text>
                      </motion.g>
                    );
                  })}
                </g>
              ))}
              {/* 열 헤더 */}
              {['패스', '드리블', '슛', '크로스'].map((to, c) => (
                <text key={`h-${c}`} x={122 + c * 50} y={52} textAnchor="middle"
                  fontSize={8} fill="var(--muted-foreground)">→{to}</text>
              ))}

              {/* 해석 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={380} y={68} fontSize={9} fontWeight={600} fill={COLORS.transition}>
                  핵심 인사이트</text>
                <DataBox x={330} y={78} w={150} h={24} label="드리블→슛 = 0.5"
                  sub="돌파 후 슈팅 확률 높음" color={COLORS.accent} />
                <DataBox x={330} y={110} w={150} h={24} label="슛→패스 = 0.6"
                  sub="실축 후 재빌드업" color={COLORS.stat} />
                <DataBox x={330} y={142} w={150} h={24} label="대각선 낮음"
                  sub="같은 유형 반복 적음" color={COLORS.window} />
              </motion.g>

              <text x={250} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                4×4 행렬 = 16개 피처. 이벤트 유형이 많으면 차원 폭발 → PCA 압축 고려.
              </text>
            </motion.g>
          )}

          {step === 5 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">통합 파이프라인</text>

              {/* 시퀀스 데이터 */}
              <ModuleBox x={20} y={38} w={120} h={36} label="시퀀스 테이블"
                sub="events (N행/샘플)" color={COLORS.pipeline} />

              {/* 집계 */}
              <Arrow x1={145} y1={56} x2={170} y2={56} color={COLORS.stat} delay={0.1} />
              <ActionBox x={175} y={40} w={90} h={32} label="집계 엔진" sub="통계+ngram+전환" color={COLORS.stat} />
              <Arrow x1={268} y1={56} x2={295} y2={56} color={COLORS.stat} delay={0.2} />

              {/* 집계 결과 */}
              <ModuleBox x={300} y={38} w={100} h={36} label="집계 피처"
                sub="mean, bigram, P..." color={COLORS.window} />

              {/* 원본 피처 */}
              <ModuleBox x={20} y={100} w={120} h={36} label="원본 피처"
                sub="단일 행 (1행/샘플)" color={COLORS.ngram} />

              {/* JOIN */}
              <Arrow x1={145} y1={118} x2={220} y2={118} color={COLORS.pipeline} delay={0.3} />
              <Arrow x1={350} y1={78} x2={350} y2={100} color={COLORS.pipeline} delay={0.3} />

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
                <ActionBox x={225} y={100} w={75} h={36} label="LEFT JOIN"
                  sub="샘플 키 기준" color={COLORS.pipeline} />
              </motion.g>

              <Arrow x1={303} y1={118} x2={340} y2={118} color={COLORS.pipeline} delay={0.5} />

              {/* 결합 피처 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ModuleBox x={345} y={100} w={130} h={36} label="결합 피처 테이블"
                  sub="원본 + 시퀀스 집계" color={COLORS.accent} />
              </motion.g>

              {/* GBM */}
              <Arrow x1={410} y1={140} x2={410} y2={158} color={COLORS.window} delay={0.6} />
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.7 }}>
                <ModuleBox x={350} y={162} w={120} h={40} label="GBM 학습"
                  sub="LightGBM / XGBoost" color={COLORS.window} />
              </motion.g>

              {/* 피처 예시 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <text x={120} y={162} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.stat}>생성되는 피처 예시</text>
                {[
                  'x_mean', 'x_std', 'x_last3_mean',
                  'pass_ratio', 'dribble_to_shot',
                  'P(shot|dribble)', 'event_count',
                ].map((f, i) => (
                  <DataBox key={f} x={20 + (i % 3) * 100} y={170 + Math.floor(i / 3) * 22}
                    w={95} h={18} label={f} color={COLORS.stat} />
                ))}
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
