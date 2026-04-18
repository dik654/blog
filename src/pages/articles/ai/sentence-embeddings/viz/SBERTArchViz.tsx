import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C } from './SBERTArchVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

function Arrow({ x1, y1, x2, y2, color, id }: { x1: number; y1: number; x2: number; y2: number; color: string; id: string }) {
  return (
    <g>
      <defs>
        <marker id={id} viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto"><path d="M0,0 L10,5 L0,10" fill={color} /></marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} markerEnd={`url(#${id})`} />
    </g>
  );
}

export default function SBERTArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: Siamese network */}
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bert}>
                Siamese BERT 구조
              </text>
              {/* Sentence A side */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={30} y={30} width={120} height={26} rx={13}
                  fill={C.bert + '12'} stroke={C.bert} strokeWidth={1} />
                <text x={90} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bert}>
                  문장 A: "나는 행복하다"
                </text>
                <Arrow x1={90} y1={56} x2={90} y2={72} color={C.bert} id="a1" />
                <rect x={40} y={75} width={100} height={40} rx={6}
                  fill={C.bert + '18'} stroke={C.bert} strokeWidth={1.5} />
                <text x={90} y={92} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bert}>BERT</text>
                <text x={90} y={106} textAnchor="middle" fontSize={7} fill={C.bert}>인코더</text>
                <Arrow x1={90} y1={115} x2={90} y2={131} color={C.bert} id="a2" />
                <rect x={45} y={134} width={90} height={24} rx={4}
                  fill={C.sim + '15'} stroke={C.sim} strokeWidth={1} />
                <text x={90} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sim}>pooling → u</text>
              </motion.g>
              {/* Sentence B side */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={320} y={30} width={130} height={26} rx={13}
                  fill={C.bert + '12'} stroke={C.bert} strokeWidth={1} />
                <text x={385} y={47} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bert}>
                  문장 B: "기분이 좋다"
                </text>
                <Arrow x1={385} y1={56} x2={385} y2={72} color={C.bert} id="b1" />
                <rect x={335} y={75} width={100} height={40} rx={6}
                  fill={C.bert + '18'} stroke={C.bert} strokeWidth={1.5} />
                <text x={385} y={92} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bert}>BERT</text>
                <text x={385} y={106} textAnchor="middle" fontSize={7} fill={C.bert}>인코더</text>
                <Arrow x1={385} y1={115} x2={385} y2={131} color={C.bert} id="b2" />
                <rect x={340} y={134} width={90} height={24} rx={4}
                  fill={C.sim + '15'} stroke={C.sim} strokeWidth={1} />
                <text x={385} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sim}>pooling → v</text>
              </motion.g>
              {/* Shared weights indicator */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <line x1={142} y1={95} x2={333} y2={95}
                  stroke={C.bert} strokeWidth={0.8} strokeDasharray="4 3" opacity={0.5} />
                <rect x={195} y={85} width={85} height={20} rx={4} fill="var(--card)" stroke={C.bert} strokeWidth={0.5} />
                <text x={237} y={99} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.bert}>
                  가중치 공유
                </text>
              </motion.g>
              {/* Cosine similarity */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <Arrow x1={135} y1={146} x2={200} y2={185} color={C.sim} id="c1" />
                <Arrow x1={340} y1={146} x2={275} y2={185} color={C.sim} id="c2" />
                <rect x={190} y={176} width={95} height={28} rx={14}
                  fill={C.sim + '18'} stroke={C.sim} strokeWidth={1.5} />
                <text x={237} y={194} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sim}>
                  cos(u, v)
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 1: Pooling strategies */}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bert}>
                풀링 전략 비교
              </text>
              {/* BERT output */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={140} y={28} width={200} height={26} rx={4}
                  fill={C.bert + '10'} stroke={C.bert} strokeWidth={0.8} />
                <text x={240} y={45} textAnchor="middle" fontSize={9} fill={C.bert}>
                  BERT 출력: [h₁, h₂, ..., hₙ]
                </text>
              </motion.g>
              {/* Three pooling options */}
              {[
                { label: '[CLS] 토큰', desc: 'h₁만 사용', score: 'STS: 29.2', color: '#94a3b8', y: 70 },
                { label: 'Mean Pooling', desc: 'Σhᵢ / n', score: 'STS: 80.3 ✓', color: C.sim, y: 115 },
                { label: 'Max Pooling', desc: 'max(hᵢ)', score: 'STS: 78.4', color: '#94a3b8', y: 160 },
              ].map((p, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.12 }}>
                  <rect x={60} y={p.y} width={110} height={32} rx={6}
                    fill={p.color + '15'} stroke={p.color} strokeWidth={i === 1 ? 2 : 0.8} />
                  <text x={115} y={p.y + 14} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={p.color}>{p.label}</text>
                  <text x={115} y={p.y + 26} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                    {p.desc}
                  </text>
                  <Arrow x1={170} y1={p.y + 16} x2={250} y2={p.y + 16} color={p.color} id={`p${i}`} />
                  <rect x={255} y={p.y + 2} width={80} height={26} rx={4}
                    fill="var(--card)" stroke={p.color} strokeWidth={i === 1 ? 1.5 : 0.5} />
                  <text x={295} y={p.y + 19} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={p.color}>{p.score}</text>
                </motion.g>
              ))}
              <motion.text x={400} y={134} textAnchor="middle" fontSize={8} fill={C.sim}
                fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}>
                Mean이 최고
              </motion.text>
            </g>
          )}

          {/* Step 2: Classification objective (NLI) */}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.contrast}>
                학습 목표: NLI Classification
              </text>
              {/* u and v vectors */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={30} y={35} width={70} height={28} rx={14}
                  fill={C.bert + '12'} stroke={C.bert} strokeWidth={1} />
                <text x={65} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bert}>u</text>
                <rect x={140} y={35} width={70} height={28} rx={14}
                  fill={C.bert + '12'} stroke={C.bert} strokeWidth={1} />
                <text x={175} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bert}>v</text>
                <rect x={250} y={35} width={70} height={28} rx={14}
                  fill={C.sim + '12'} stroke={C.sim} strokeWidth={1} />
                <text x={285} y={53} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.sim}>|u-v|</text>
              </motion.g>
              {/* concat arrow */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <text x={115} y={53} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">⊕</text>
                <text x={225} y={53} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">⊕</text>
                <Arrow x1={175} y1={65} x2={175} y2={88} color={C.contrast} id="nli1" />
              </motion.g>
              {/* concat box */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <rect x={80} y={90} width={200} height={28} rx={6}
                  fill={C.contrast + '10'} stroke={C.contrast} strokeWidth={1} />
                <text x={180} y={108} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.contrast}>
                  [u; v; |u-v|] concat → 3d 차원
                </text>
                <Arrow x1={180} y1={118} x2={180} y2={135} color={C.contrast} id="nli2" />
              </motion.g>
              {/* softmax classifier */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}>
                <rect x={100} y={138} width={160} height={28} rx={6}
                  fill={C.contrast + '15'} stroke={C.contrast} strokeWidth={1.5} />
                <text x={180} y={156} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.contrast}>
                  Softmax Classifier
                </text>
                <Arrow x1={180} y1={166} x2={180} y2={183} color={C.contrast} id="nli3" />
              </motion.g>
              {/* 3 classes */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                {['Entailment', 'Contradiction', 'Neutral'].map((c, i) => (
                  <g key={c}>
                    <rect x={60 + i * 130} y={186} width={100} height={22} rx={11}
                      fill={[C.contrast, C.triplet, C.sim][i] + '15'}
                      stroke={[C.contrast, C.triplet, C.sim][i]} strokeWidth={0.8} />
                    <text x={110 + i * 130} y={201} textAnchor="middle" fontSize={8} fontWeight={600}
                      fill={[C.contrast, C.triplet, C.sim][i]}>{c}</text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}

          {/* Step 3: Regression objective */}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sim}>
                학습 목표: STS Regression
              </text>
              {/* u and v */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={60} y={40} width={100} height={30} rx={6}
                  fill={C.bert + '12'} stroke={C.bert} strokeWidth={1} />
                <text x={110} y={59} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bert}>u (문장 A)</text>
                <rect x={310} y={40} width={100} height={30} rx={6}
                  fill={C.bert + '12'} stroke={C.bert} strokeWidth={1} />
                <text x={360} y={59} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.bert}>v (문장 B)</text>
              </motion.g>
              {/* cosine sim */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}>
                <Arrow x1={160} y1={55} x2={208} y2={90} color={C.sim} id="r1" />
                <Arrow x1={310} y1={55} x2={268} y2={90} color={C.sim} id="r2" />
                <rect x={190} y={85} width={95} height={30} rx={15}
                  fill={C.sim + '18'} stroke={C.sim} strokeWidth={1.5} />
                <text x={237} y={104} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.sim}>
                  cos(u, v)
                </text>
              </motion.g>
              {/* MSE loss */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <Arrow x1={237} y1={115} x2={237} y2={138} color={C.sim} id="r3" />
                <rect x={160} y={140} width={155} height={32} rx={6}
                  fill={C.sim + '10'} stroke={C.sim} strokeWidth={1} />
                <text x={237} y={160} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sim}>
                  MSE Loss: (ŷ - y)²
                </text>
              </motion.g>
              {/* scale */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <rect x={120} y={185} width={240} height={14} rx={3} fill={C.sim + '10'} />
                {[0, 1, 2, 3, 4, 5].map(n => (
                  <g key={n}>
                    <rect x={120 + n * 48} y={185} width={2} height={14} fill={C.sim} opacity={0.4} />
                    <text x={121 + n * 48} y={210} textAnchor="middle" fontSize={7}
                      fill="var(--muted-foreground)">{n}</text>
                  </g>
                ))}
                <text x={240} y={210} textAnchor="middle" fontSize={8} fill={C.sim}>
                  유사도 라벨 (0=무관 ~ 5=동일)
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 4: Triplet loss */}
          {step === 4 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.triplet}>
                Triplet Loss
              </text>
              {/* Anchor */}
              <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
                <circle cx={240} cy={65} r={28} fill={C.bert + '15'} stroke={C.bert} strokeWidth={1.5} />
                <text x={240} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.bert}>Anchor</text>
                <text x={240} y={74} textAnchor="middle" fontSize={7} fill={C.bert}>"오늘 날씨 좋다"</text>
              </motion.g>
              {/* Positive */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, ...sp }}>
                <circle cx={110} cy={130} r={28} fill={C.contrast + '15'} stroke={C.contrast} strokeWidth={1.5} />
                <text x={110} y={127} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.contrast}>Positive</text>
                <text x={110} y={139} textAnchor="middle" fontSize={7} fill={C.contrast}>"맑은 하늘이다"</text>
                {/* distance line */}
                <line x1={212} y1={65} x2={138} y2={130}
                  stroke={C.contrast} strokeWidth={1.5} strokeDasharray="3 2" />
                <text x={165} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.contrast}>
                  d(a,p) 가깝게
                </text>
              </motion.g>
              {/* Negative */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, ...sp }}>
                <circle cx={370} cy={130} r={28} fill={C.triplet + '15'} stroke={C.triplet} strokeWidth={1.5} />
                <text x={370} y={127} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.triplet}>Negative</text>
                <text x={370} y={139} textAnchor="middle" fontSize={7} fill={C.triplet}>"주가가 하락했다"</text>
                <line x1={268} y1={65} x2={342} y2={130}
                  stroke={C.triplet} strokeWidth={1.5} strokeDasharray="3 2" />
                <text x={318} y={92} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.triplet}>
                  d(a,n) 멀게
                </text>
              </motion.g>
              {/* Loss formula */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}>
                <rect x={80} y={172} width={320} height={34} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={188} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">
                  L = max(0, ||a-p|| - ||a-n|| + ε)
                </text>
                <text x={240} y={200} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  ε(margin) = 1.0 — positive와 negative 사이 최소 거리 보장
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 5: Cross vs Bi encoder */}
          {step === 5 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                Cross-Encoder vs Bi-Encoder
              </text>
              {/* Cross-Encoder */}
              <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={10} y={30} width={210} height={120} rx={8}
                  fill={C.cross + '06'} stroke={C.cross} strokeWidth={1} />
                <text x={115} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cross}>
                  Cross-Encoder
                </text>
                {/* input */}
                <rect x={25} y={56} width={180} height={22} rx={4}
                  fill={C.cross + '12'} stroke={C.cross} strokeWidth={0.5} />
                <text x={115} y={71} textAnchor="middle" fontSize={8} fill={C.cross}>
                  [CLS] 문장A [SEP] 문장B [SEP]
                </text>
                <rect x={55} y={86} width={120} height={22} rx={4}
                  fill={C.cross + '18'} stroke={C.cross} strokeWidth={1} />
                <text x={115} y={101} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cross}>
                  BERT (교차 인코딩)
                </text>
                <rect x={70} y={116} width={90} height={20} rx={10}
                  fill={C.cross + '15'} stroke={C.cross} strokeWidth={0.8} />
                <text x={115} y={130} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.cross}>
                  유사도 점수
                </text>
              </motion.g>
              {/* Bi-Encoder */}
              <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={250} y={30} width={220} height={120} rx={8}
                  fill={C.bi + '06'} stroke={C.bi} strokeWidth={1} />
                <text x={360} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bi}>
                  Bi-Encoder (SBERT)
                </text>
                <rect x={265} y={56} width={80} height={22} rx={4}
                  fill={C.bi + '12'} stroke={C.bi} strokeWidth={0.5} />
                <text x={305} y={71} textAnchor="middle" fontSize={8} fill={C.bi}>문장 A → u</text>
                <rect x={375} y={56} width={80} height={22} rx={4}
                  fill={C.bi + '12'} stroke={C.bi} strokeWidth={0.5} />
                <text x={415} y={71} textAnchor="middle" fontSize={8} fill={C.bi}>문장 B → v</text>
                <rect x={290} y={86} width={140} height={22} rx={4}
                  fill={C.bi + '18'} stroke={C.bi} strokeWidth={1} />
                <text x={360} y={101} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bi}>
                  벡터 사전 계산 가능
                </text>
                <rect x={310} y={116} width={100} height={20} rx={10}
                  fill={C.bi + '15'} stroke={C.bi} strokeWidth={0.8} />
                <text x={360} y={130} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.bi}>
                  cos(u, v)
                </text>
              </motion.g>
              {/* Comparison table */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <rect x={30} y={160} width={420} height={50} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                {/* Headers */}
                <text x={130} y={176} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">속도</text>
                <text x={280} y={176} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">정확도</text>
                <text x={400} y={176} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">용도</text>
                {/* Cross row */}
                <text x={55} y={192} fontSize={8} fontWeight={600} fill={C.cross}>Cross</text>
                <text x={130} y={192} textAnchor="middle" fontSize={8} fill={C.cross}>O(n²) 느림</text>
                <text x={280} y={192} textAnchor="middle" fontSize={8} fill={C.cross}>높음 (90+)</text>
                <text x={400} y={192} textAnchor="middle" fontSize={8} fill={C.cross}>리랭킹</text>
                {/* Bi row */}
                <text x={55} y={205} fontSize={8} fontWeight={600} fill={C.bi}>Bi</text>
                <text x={130} y={205} textAnchor="middle" fontSize={8} fill={C.bi}>O(n) 빠름</text>
                <text x={280} y={205} textAnchor="middle" fontSize={8} fill={C.bi}>약간 낮음 (85)</text>
                <text x={400} y={205} textAnchor="middle" fontSize={8} fill={C.bi}>검색·클러스터</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
