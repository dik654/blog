import StepViz from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { STEPS, COLORS } from './TransformerVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Arrow({ x1, y1, x2, y2, color, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={1.2} markerEnd="url(#tf-arrow)"
      initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.6 }}
      transition={{ ...sp, delay }} />
  );
}

export default function TransformerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="tf-arrow" viewBox="0 0 10 10" refX={9} refY={5}
              markerWidth={5} markerHeight={5} orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#888" />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">집계 vs Transformer 직접 처리</text>

              {/* 집계 경로 */}
              <text x={130} y={45} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.key}>집계 방식</text>
              {[0, 1, 2, 3, 4].map(i => (
                <rect key={i} x={40 + i * 32} y={52} width={28} height={18} rx={3}
                  fill={`${COLORS.token}20`} stroke={COLORS.token} strokeWidth={0.5} />
              ))}
              <Arrow x1={205} y1={61} x2={230} y2={61} color={COLORS.key} delay={0.1} />
              <ActionBox x={235} y={48} w={60} h={26} label="집계" sub="mean, cnt" color={COLORS.key} />
              <Arrow x1={298} y1={61} x2={320} y2={61} color={COLORS.key} delay={0.2} />
              {[0, 1, 2].map(i => (
                <rect key={i} x={325 + i * 24} y={52} width={20} height={18} rx={3}
                  fill={`${COLORS.key}25`} stroke={COLORS.key} strokeWidth={0.5} />
              ))}
              <text x={365} y={86} textAnchor="middle" fontSize={7} fill={COLORS.key}>
                순서 정보 일부 손실
              </text>

              {/* Transformer 경로 */}
              <text x={130} y={118} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.attention}>Transformer 방식</text>
              {[0, 1, 2, 3, 4].map(i => (
                <motion.rect key={i} x={40 + i * 32} y={125} width={28} height={18} rx={3}
                  fill={`${COLORS.token}20`} stroke={COLORS.token} strokeWidth={0.5}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: 0.2 + i * 0.05 }} />
              ))}
              <Arrow x1={205} y1={134} x2={230} y2={134} color={COLORS.attention} delay={0.4} />
              <ActionBox x={235} y={121} w={80} h={26} label="Self-Attention"
                sub="전체 맥락 보존" color={COLORS.attention} />

              {/* 어텐션 라인들 */}
              {[0, 1, 2, 3].map(i =>
                [1, 2, 3, 4].filter(j => j > i).map(j => (
                  <motion.line key={`${i}-${j}`}
                    x1={54 + i * 32} y1={145} x2={54 + j * 32} y2={145}
                    stroke={COLORS.attention} strokeWidth={0.5} opacity={0.3}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ ...sp, delay: 0.5 + (i + j) * 0.03 }} />
                ))
              )}

              <Arrow x1={318} y1={134} x2={345} y2={134} color={COLORS.attention} delay={0.6} />
              <DataBox x={350} y={122} w={80} h={24} label="시퀀스 벡터"
                sub="d_model dim" color={COLORS.cls} />

              {/* 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <text x={250} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  집계: 빠르고 GBM과 호환 | Transformer: 맥락 보존, 더 많은 데이터 필요
                </text>
                <text x={250} y={198} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  실전에서는 둘을 결합 — 집계 피처 + Transformer 시퀀스 벡터를 concat
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">이벤트 → 토큰 변환</text>

              {/* 이벤트 레코드 */}
              <text x={120} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.token}>이벤트 필드</text>
              {[
                { name: 'x', type: '수치', color: COLORS.query },
                { name: 'y', type: '수치', color: COLORS.query },
                { name: '선수', type: '범주', color: COLORS.value },
                { name: '유형', type: '범주', color: COLORS.value },
                { name: 'Δt', type: '수치', color: COLORS.key },
              ].map((f, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.08 }}>
                  <rect x={30} y={50 + i * 28} width={55} height={22} rx={4}
                    fill={`${f.color}15`} stroke={f.color} strokeWidth={0.5} />
                  <text x={57} y={64 + i * 28} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={f.color}>{f.name}</text>
                  <text x={100} y={64 + i * 28} fontSize={7} fill="var(--muted-foreground)">{f.type}</text>
                </motion.g>
              ))}

              {/* 인코딩 과정 */}
              {[0, 1, 2, 3, 4].map(i => (
                <Arrow key={i} x1={120} y1={61 + i * 28} x2={170} y2={61 + i * 28}
                  color={COLORS.token} delay={0.3 + i * 0.05} />
              ))}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <ActionBox x={175} y={60} w={85} h={26} label="수치 → Linear"
                  sub="연속값 프로젝션" color={COLORS.query} />
                <ActionBox x={175} y={102} w={85} h={26} label="범주 → Embed"
                  sub="룩업 테이블" color={COLORS.value} />
                <ActionBox x={175} y={144} w={85} h={26} label="Δt → Log+Lin"
                  sub="시간 인코딩" color={COLORS.key} />
              </motion.g>

              {/* 합산 → 토큰 벡터 */}
              {[0, 1, 2].map(i => (
                <Arrow key={i} x1={263} y1={[73, 115, 157][i]}
                  x2={310} y2={115} color={COLORS.token} delay={0.6 + i * 0.05} />
              ))}

              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                <text x={345} y={106} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.token}>Σ</text>
                <rect x={310} y={108} width={70} height={24} rx={12}
                  fill={`${COLORS.token}20`} stroke={COLORS.token} strokeWidth={1} />
                <text x={345} y={123} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.token}>토큰 벡터</text>
                <text x={345} y={142} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">d_model 차원</text>
              </motion.g>

              {/* 시퀀스 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.9 }}>
                <text x={345} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  이벤트마다 반복 → (seq_len, d_model) 텐서 생성
                </text>
                {Array.from({ length: 5 }, (_, i) => (
                  <rect key={i} x={270 + i * 30} y={178} width={26} height={18} rx={5}
                    fill={`${COLORS.token}20`} stroke={COLORS.token} strokeWidth={0.5} />
                ))}
                <text x={345} y={210} textAnchor="middle" fontSize={8} fill={COLORS.token}>
                  5개 토큰 시퀀스
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Self-Attention 동작</text>

              {/* 토큰들 */}
              {['패스1', '패스2', '드리블', '패스3', '슛'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={40 + i * 88} y={35} width={75} height={24} rx={12}
                    fill={`${COLORS.token}20`} stroke={COLORS.token} strokeWidth={0.6} />
                  <text x={77 + i * 88} y={50} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill={COLORS.token}>{t}</text>
                </motion.g>
              ))}

              {/* Q, K, V 변환 */}
              <text x={250} y={78} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                각 토큰 → Q(쿼리), K(키), V(값) 프로젝션
              </text>

              {/* 어텐션 행렬 (간이) */}
              <text x={140} y={100} textAnchor="middle" fontSize={9} fontWeight={600}
                fill={COLORS.attention}>어텐션 가중치</text>
              {[0, 1, 2, 3, 4].map(r =>
                [0, 1, 2, 3, 4].map(c => {
                  const w = [
                    [0.1, 0.3, 0.1, 0.4, 0.1],
                    [0.2, 0.1, 0.3, 0.2, 0.2],
                    [0.1, 0.2, 0.1, 0.1, 0.5],
                    [0.4, 0.2, 0.1, 0.1, 0.2],
                    [0.1, 0.1, 0.4, 0.2, 0.2],
                  ];
                  const v = w[r][c];
                  return (
                    <motion.rect key={`${r}-${c}`} x={50 + c * 36} y={108 + r * 20}
                      width={32} height={16} rx={2}
                      fill={v >= 0.3 ? COLORS.attention : `${COLORS.attention}20`}
                      opacity={v >= 0.3 ? 0.7 : 0.4}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ ...sp, delay: 0.3 + (r * 5 + c) * 0.01 }} />
                  );
                })
              )}
              {/* 행 라벨 */}
              {['P1', 'P2', 'D', 'P3', 'S'].map((l, i) => (
                <text key={l} x={45} y={120 + i * 20} textAnchor="end" fontSize={7}
                  fill="var(--foreground)">{l}</text>
              ))}

              {/* 해석 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={370} y={115} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill={COLORS.attention}>높은 어텐션 = 강한 관계</text>
                <DataBox x={290} y={125} w={160} h={22} label="패스3 → 패스1: 0.4"
                  sub="같은 방향 빌드업" color={COLORS.attention} />
                <DataBox x={290} y={153} w={160} h={22} label="드리블 → 슛: 0.5"
                  sub="돌파→마무리 패턴" color={COLORS.attention} />
                <DataBox x={290} y={181} w={160} h={22} label="슛 → 드리블: 0.4"
                  sub="역방향 참조도 학습" color={COLORS.cls} />
              </motion.g>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">시퀀스 대표 벡터 추출</text>

              {/* CLS 풀링 */}
              <text x={140} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.cls}>방법 1: [CLS] 토큰</text>
              {['CLS', 'e1', 'e2', 'e3', 'e4'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={20 + i * 52} y={56} width={46} height={22} rx={11}
                    fill={i === 0 ? `${COLORS.cls}30` : `${COLORS.token}15`}
                    stroke={i === 0 ? COLORS.cls : COLORS.token}
                    strokeWidth={i === 0 ? 1.2 : 0.5} />
                  <text x={43 + i * 52} y={70} textAnchor="middle" fontSize={8}
                    fontWeight={i === 0 ? 700 : 400}
                    fill={i === 0 ? COLORS.cls : COLORS.token}>{t}</text>
                </motion.g>
              ))}

              <Arrow x1={43} y1={80} x2={43} y2={100} color={COLORS.cls} delay={0.3} />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={10} y={104} width={66} height={22} rx={11}
                  fill={`${COLORS.cls}25`} stroke={COLORS.cls} strokeWidth={1} />
                <text x={43} y={118} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill={COLORS.cls}>h_CLS</text>
                <text x={43} y={138} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  시퀀스 대표
                </text>
              </motion.g>

              {/* 평균 풀링 */}
              <text x={380} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={COLORS.key}>방법 2: 평균 풀링</text>
              {['h1', 'h2', 'h3', 'h4', 'h5'].map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={280 + i * 42} y={56} width={38} height={22} rx={4}
                    fill={`${COLORS.key}15`} stroke={COLORS.key} strokeWidth={0.5} />
                  <text x={299 + i * 42} y={70} textAnchor="middle" fontSize={8}
                    fill={COLORS.key}>{t}</text>
                </motion.g>
              ))}

              {/* 평균 화살표 */}
              {[0, 1, 2, 3, 4].map(i => (
                <Arrow key={i} x1={299 + i * 42} y1={80} x2={380} y2={100}
                  color={COLORS.key} delay={0.3 + i * 0.04} />
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={350} y={104} width={60} height={22} rx={11}
                  fill={`${COLORS.key}25`} stroke={COLORS.key} strokeWidth={1} />
                <text x={380} y={118} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill={COLORS.key}>mean(h)</text>
                <text x={380} y={138} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  1/N Σ h_i
                </text>
              </motion.g>

              {/* 비교 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <text x={250} y={170} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">두 방법 모두 결과 형상: (batch, d_model)</text>
                <text x={120} y={190} textAnchor="middle" fontSize={8} fill={COLORS.cls}>
                  CLS: BERT 스타일. 별도 학습 필요.</text>
                <text x={380} y={190} textAnchor="middle" fontSize={8} fill={COLORS.key}>
                  평균: 간단하고 안정적. 기본값 추천.</text>
                <text x={250} y={210} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  실전: max 풀링, attention 풀링도 가능 — 태스크에 따라 실험
                </text>
              </motion.g>
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <text x={250} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">축구 패스 예측 아키텍처</text>

              {/* 입력 */}
              <ModuleBox x={15} y={32} w={90} h={34} label="패스 이벤트"
                sub="K개 (x,y,선수,Δt)" color={COLORS.token} />

              <Arrow x1={108} y1={49} x2={128} y2={49} color={COLORS.token} delay={0.1} />

              {/* 인코딩 */}
              <ModuleBox x={132} y={32} w={85} h={34} label="이벤트 인코딩"
                sub="Embed+PE+TE" color={COLORS.query} />

              <Arrow x1={220} y1={49} x2={240} y2={49} color={COLORS.query} delay={0.2} />

              {/* Transformer */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={244} y={28} width={100} height={42} rx={8}
                  fill={`${COLORS.attention}10`} stroke={COLORS.attention} strokeWidth={1} />
                <text x={294} y={46} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.attention}>Transformer</text>
                <text x={294} y={60} textAnchor="middle" fontSize={7}
                  fill="var(--muted-foreground)">×N layers</text>
              </motion.g>

              <Arrow x1={347} y1={49} x2={367} y2={49} color={COLORS.attention} delay={0.4} />

              {/* 풀링 */}
              <ActionBox x={371} y={34} w={55} h={30} label="풀링"
                sub="CLS/mean" color={COLORS.cls} />

              <Arrow x1={429} y1={49} x2={449} y2={49} color={COLORS.cls} delay={0.5} />

              {/* MLP 헤드 */}
              <ModuleBox x={453} y={32} w={40} h={34} label="MLP"
                sub="헤드" color={COLORS.output} />

              {/* 상세 분해 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.6 }}>
                {/* 입력 상세 */}
                <text x={60} y={90} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.token}>입력 예시</text>
                {[
                  { t: '0s', x: 30, y: 62 },
                  { t: '2s', x: 48, y: 45 },
                  { t: '5s', x: 65, y: 35 },
                  { t: '8s', x: 82, y: 50 },
                ].map((p, i) => (
                  <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    transition={{ ...sp, delay: 0.7 + i * 0.08 }}>
                    <circle cx={15 + i * 28} cy={105 + (i % 2) * 15} r={4}
                      fill={COLORS.token} opacity={0.7} />
                    <text x={15 + i * 28} y={128} textAnchor="middle" fontSize={7}
                      fill="var(--muted-foreground)">{p.t}</text>
                  </motion.g>
                ))}

                {/* Transformer 내부 */}
                <text x={294} y={90} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.attention}>내부 구조</text>
                <ActionBox x={252} y={96} w={84} h={20} label="Multi-Head Attn" color={COLORS.attention} />
                <ActionBox x={252} y={120} w={84} h={20} label="Feed-Forward" color={COLORS.value} />
                <ActionBox x={252} y={144} w={84} h={20} label="Layer Norm" color={COLORS.key} />

                {/* 출력 */}
                <text x={473} y={90} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={COLORS.output}>출력</text>
                <DataBox x={438} y={98} w={70} h={22} label="next_x" color={COLORS.output} />
                <DataBox x={438} y={126} w={70} h={22} label="next_y" color={COLORS.output} />
              </motion.g>

              {/* 하이퍼파라미터 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 1.0 }}>
                <text x={250} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  실전 설정: d_model=64, n_heads=4, n_layers=2, max_len=20
                </text>
                <text x={250} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  Loss: MSE(predicted_xy, actual_xy) | 옵티마이저: AdamW, lr=1e-4
                </text>
                <text x={250} y={215} textAnchor="middle" fontSize={8} fill={COLORS.cls}>
                  GBM 집계 피처와 Transformer 벡터를 concat하면 앙상블 효과
                </text>
              </motion.g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
