import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './EvalBenchVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function EvalBenchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: MTEB overview */}
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mteb}>
                MTEB: 8개 태스크 카테고리
              </text>
              {/* Hub circle */}
              <motion.circle cx={240} cy={115} r={38}
                fill={C.mteb + '12'} stroke={C.mteb} strokeWidth={1.5}
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={sp} />
              <text x={240} y={110} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.mteb}>MTEB</text>
              <text x={240} y={122} textAnchor="middle" fontSize={7} fill={C.mteb}>56 데이터셋</text>
              {/* Surrounding tasks */}
              {[
                { label: '분류', angle: -90, color: C.mteb },
                { label: '클러스터링', angle: -45, color: C.cluster },
                { label: '쌍분류', angle: 0, color: C.pair },
                { label: '재순위', angle: 45, color: '#64748b' },
                { label: '검색', angle: 90, color: C.retrieval },
                { label: 'STS', angle: 135, color: C.sts },
                { label: '요약', angle: 180, color: '#64748b' },
                { label: '분류(다국어)', angle: -135, color: C.probe },
              ].map((t, i) => {
                const rad = (t.angle * Math.PI) / 180;
                const cx = 240 + Math.cos(rad) * 90;
                const cy = 115 + Math.sin(rad) * 75;
                return (
                  <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.06, ...sp }}>
                    <line x1={240 + Math.cos(rad) * 40} y1={115 + Math.sin(rad) * 40}
                      x2={cx - Math.cos(rad) * 20} y2={cy - Math.sin(rad) * 16}
                      stroke={t.color} strokeWidth={0.8} opacity={0.4} />
                    <rect x={cx - 32} y={cy - 12} width={64} height={24} rx={12}
                      fill={t.color + '15'} stroke={t.color} strokeWidth={0.8} />
                    <text x={cx} y={cy + 4} textAnchor="middle" fontSize={8} fontWeight={600}
                      fill={t.color}>{t.label}</text>
                  </motion.g>
                );
              })}
            </g>
          )}

          {/* Step 1: STS */}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sts}>
                STS: Semantic Textual Similarity
              </text>
              {/* Two sentences */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={30} y={30} width={190} height={26} rx={6}
                  fill={C.sts + '12'} stroke={C.sts} strokeWidth={0.8} />
                <text x={125} y={47} textAnchor="middle" fontSize={8} fill={C.sts}>
                  "고양이가 매트 위에 앉아 있다"
                </text>
                <rect x={250} y={30} width={200} height={26} rx={6}
                  fill={C.sts + '12'} stroke={C.sts} strokeWidth={0.8} />
                <text x={350} y={47} textAnchor="middle" fontSize={8} fill={C.sts}>
                  "매트 위에 고양이 한 마리가 있다"
                </text>
              </motion.g>
              {/* Cosine similarity */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <line x1={125} y1={56} x2={240} y2={78} stroke={C.sts} strokeWidth={0.8} opacity={0.4} />
                <line x1={350} y1={56} x2={240} y2={78} stroke={C.sts} strokeWidth={0.8} opacity={0.4} />
                <rect x={190} y={75} width={100} height={24} rx={12}
                  fill={C.sts + '18'} stroke={C.sts} strokeWidth={1} />
                <text x={240} y={91} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sts}>
                  cos(u, v) = 0.92
                </text>
              </motion.g>
              {/* Human label */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
                <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  vs 인간 평가: 4.8 / 5.0
                </text>
              </motion.g>
              {/* Model comparison bars */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}>
                <rect x={40} y={125} width={400} height={80} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">STSb Spearman 상관계수 (ρ)</text>
                {[
                  { name: 'BERT [CLS]', score: 29.2, color: '#ef4444' },
                  { name: 'GloVe 평균', score: 58.0, color: '#64748b' },
                  { name: 'SBERT', score: 84.6, color: C.sts },
                  { name: 'E5-large', score: 86.0, color: '#10b981' },
                ].map((m, i) => (
                  <g key={m.name}>
                    <text x={110} y={158 + i * 12} textAnchor="end" fontSize={7.5} fontWeight={600}
                      fill={m.color}>{m.name}</text>
                    <rect x={115} y={150 + i * 12} width={280} height={8} rx={2}
                      fill={m.color + '10'} />
                    <motion.rect x={115} y={150 + i * 12}
                      width={0} height={8} rx={2}
                      fill={m.color + '50'}
                      animate={{ width: (m.score / 100) * 280 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.5 }} />
                    <text x={120 + (m.score / 100) * 280} y={158 + i * 12}
                      fontSize={7} fontWeight={600} fill={m.color}>{m.score}</text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 2: Retrieval metrics */}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.retrieval}>
                검색 정확도 지표
              </text>
              {/* Three metrics side by side */}
              {[
                {
                  name: 'Recall@k', formula: '정답 ∈ Top-k?',
                  desc: '상위 k개에 정답 포함 비율', example: 'k=10: 0.85',
                  color: C.retrieval, x: 25,
                },
                {
                  name: 'MRR', formula: '1/rank(정답)',
                  desc: '정답의 평균 역순위', example: '1위→1.0, 2위→0.5',
                  color: C.sts, x: 175,
                },
                {
                  name: 'NDCG@k', formula: 'DCG/IDCG',
                  desc: '순위 품질 (상위 관련↑)', example: '이상적=1.0',
                  color: C.cluster, x: 325,
                },
              ].map((m, i) => (
                <motion.g key={m.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15, ...sp }}>
                  <rect x={m.x} y={30} width={130} height={90} rx={6}
                    fill={m.color + '06'} stroke={m.color} strokeWidth={1} />
                  <rect x={m.x} y={30} width={130} height={5} rx={2} fill={m.color} opacity={0.7} />
                  <text x={m.x + 65} y={50} textAnchor="middle" fontSize={10} fontWeight={700}
                    fill={m.color}>{m.name}</text>
                  <text x={m.x + 65} y={66} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={m.color}>{m.formula}</text>
                  <text x={m.x + 65} y={82} textAnchor="middle" fontSize={7.5}
                    fill="var(--muted-foreground)">{m.desc}</text>
                  <text x={m.x + 65} y={112} textAnchor="middle" fontSize={8} fontWeight={600}
                    fill={m.color}>{m.example}</text>
                </motion.g>
              ))}
              {/* Retrieval example */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <rect x={30} y={135} width={420} height={72} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={152} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">검색 예시: "파이썬 리스트 정렬"</text>
                {['1. sort() 메서드 설명 ✓', '2. sorted() 함수 비교 ✓', '3. 배열 초기화 방법', '4. 정렬 알고리즘 이론 ✓'].map((r, i) => (
                  <text key={i} x={100 + (i % 2) * 200} y={170 + Math.floor(i / 2) * 16}
                    fontSize={8} fill={r.includes('✓') ? C.retrieval : C.pair}>
                    {r}
                  </text>
                ))}
                <text x={240} y={200} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  Recall@4 = 3/3 = 1.0, MRR = 1/1 = 1.0, NDCG: 관련 문서가 1,2위 → 높은 점수
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 3: Clustering quality */}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cluster}>
                클러스터링 품질 측정
              </text>
              {/* Clustering visualization */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                {/* Cluster 1 */}
                <circle cx={120} cy={85} r={45} fill={C.sts + '08'} stroke={C.sts} strokeWidth={0.5}
                  strokeDasharray="4 2" />
                <text x={120} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.sts}>
                  클러스터 A
                </text>
                {[[100, 75], [130, 90], [110, 100], [140, 70]].map(([cx, cy], i) => (
                  <circle key={`a${i}`} cx={cx} cy={cy} r={4} fill={C.sts} opacity={0.7} />
                ))}
                {/* Misplaced point */}
                <circle cx={135} cy={105} r={4} fill={C.cluster} opacity={0.7} />

                {/* Cluster 2 */}
                <circle cx={300} cy={85} r={45} fill={C.cluster + '08'} stroke={C.cluster} strokeWidth={0.5}
                  strokeDasharray="4 2" />
                <text x={300} y={55} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cluster}>
                  클러스터 B
                </text>
                {[[280, 75], [310, 90], [290, 100], [320, 80]].map(([cx, cy], i) => (
                  <circle key={`b${i}`} cx={cx} cy={cy} r={4} fill={C.cluster} opacity={0.7} />
                ))}
              </motion.g>
              {/* Metrics */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <rect x={30} y={140} width={200} height={68} rx={6}
                  fill={C.cluster + '06'} stroke={C.cluster} strokeWidth={0.8} />
                <text x={130} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cluster}>
                  V-measure
                </text>
                <text x={130} y={172} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  동질성(같은 클래스→같은 클러스터)
                </text>
                <text x={130} y={184} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  완전성(같은 클러스터→같은 클래스)
                </text>
                <text x={130} y={200} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cluster}>
                  조화평균 (F1과 유사)
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}>
                <rect x={250} y={140} width={200} height={68} rx={6}
                  fill={C.probe + '06'} stroke={C.probe} strokeWidth={0.8} />
                <text x={350} y={158} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.probe}>
                  ARI (Adjusted Rand Index)
                </text>
                <text x={350} y={172} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  모든 쌍의 클러스터 일치 여부
                </text>
                <text x={350} y={184} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
                  우연의 일치를 보정
                </text>
                <text x={350} y={200} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.probe}>
                  0 = 랜덤, 1 = 완벽
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 4: Probing tasks */}
          {step === 4 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.probe}>
                Probing Tasks: 임베딩 내부 정보 분석
              </text>
              {/* Embedding vector */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={140} y={30} width={200} height={26} rx={13}
                  fill={C.probe + '12'} stroke={C.probe} strokeWidth={1} />
                <text x={240} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.probe}>
                  문장 임베딩 벡터 (768d)
                </text>
              </motion.g>
              {/* Linear classifier */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                <line x1={240} y1={56} x2={240} y2={72} stroke={C.probe} strokeWidth={1} opacity={0.4} />
                <rect x={160} y={72} width={160} height={22} rx={4}
                  fill={C.probe + '15'} stroke={C.probe} strokeWidth={1} />
                <text x={240} y={87} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.probe}>
                  간단한 선형 분류기 (Wx + b)
                </text>
              </motion.g>
              {/* Probing tasks branching */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                {/* Syntactic */}
                <rect x={20} y={110} width={200} height={90} rx={6}
                  fill={C.sts + '06'} stroke={C.sts} strokeWidth={0.8} />
                <text x={120} y={128} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sts}>
                  구문 정보 (Syntactic)
                </text>
                {['트리 깊이: 얼마나 깊은 구조?', '최상위 성분: NP? VP? SBAR?', '문장 길이: 단어 수 예측'].map((t, i) => (
                  <g key={t}>
                    <circle cx={35} cy={146 + i * 16} r={3} fill={C.sts} opacity={0.6} />
                    <text x={44} y={150 + i * 16} fontSize={7.5} fill="var(--muted-foreground)">{t}</text>
                  </g>
                ))}
              </motion.g>
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}>
                {/* Semantic */}
                <rect x={250} y={110} width={210} height={90} rx={6}
                  fill={C.retrieval + '06'} stroke={C.retrieval} strokeWidth={0.8} />
                <text x={355} y={128} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.retrieval}>
                  의미 정보 (Semantic)
                </text>
                {['시제: 과거? 현재? 미래?', '주어 수: 단수? 복수?', '목적어 수: 직접? 간접?'].map((t, i) => (
                  <g key={t}>
                    <circle cx={265} cy={146 + i * 16} r={3} fill={C.retrieval} opacity={0.6} />
                    <text x={274} y={150 + i * 16} fontSize={7.5} fill="var(--muted-foreground)">{t}</text>
                  </g>
                ))}
              </motion.g>
              {/* Key insight */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <rect x={50} y={208} width={380} height={10} rx={3} fill={C.probe + '08'} />
                <text x={240} y={216} textAnchor="middle" fontSize={7.5} fill={C.probe} fontWeight={600}>
                  선형 분류기가 높은 정확도 → 해당 정보가 벡터 공간에 선형으로 인코딩됨
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
