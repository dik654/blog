import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, C, TOKENS, HIDDEN_DIM } from './PoolingCompareVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function PoolingCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: BERT output — all token vectors */}
          {step === 0 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                BERT 출력 레이어
              </text>
              {TOKENS.map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, ...sp }}>
                  {/* token label */}
                  <text x={30 + i * 75} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={i === 0 ? C.cls : (i === TOKENS.length - 1 ? C.cls : C.token)}>{t}</text>
                  {/* hidden vector box */}
                  <rect x={5 + i * 75} y={48} width={50} height={100} rx={4}
                    fill={i === 0 ? C.cls + '15' : C.token + '10'}
                    stroke={i === 0 ? C.cls : C.token} strokeWidth={1} />
                  {/* dimension lines */}
                  {[0, 1, 2, 3, 4].map(j => (
                    <rect key={j} x={10 + i * 75} y={56 + j * 18} width={40} height={10} rx={2}
                      fill={i === 0 ? C.cls + '25' : C.token + '18'} />
                  ))}
                  {/* dim label */}
                  <text x={30 + i * 75} y={160} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">{HIDDEN_DIM}d</text>
                </motion.g>
              ))}
              {/* bracket */}
              <text x={240} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                토큰 수 x {HIDDEN_DIM} 차원 행렬
              </text>
            </g>
          )}

          {/* Step 1: CLS pooling */}
          {step === 1 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cls}>
                [CLS] 토큰 풀링
              </text>
              {TOKENS.map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: i === 0 ? 1 : 0.2 }}
                  transition={{ delay: i * 0.04 }}>
                  <text x={30 + i * 75} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={i === 0 ? C.cls : C.token}>{t}</text>
                  <rect x={5 + i * 75} y={48} width={50} height={70} rx={4}
                    fill={i === 0 ? C.cls + '20' : C.token + '06'}
                    stroke={i === 0 ? C.cls : C.token + '40'} strokeWidth={i === 0 ? 2 : 0.5} />
                  {i > 0 && i < TOKENS.length - 1 && (
                    <line x1={10 + i * 75} y1={60} x2={50 + i * 75} y2={110}
                      stroke={C.bad} strokeWidth={1.5} opacity={0.4} />
                  )}
                </motion.g>
              ))}
              {/* arrow from CLS to output */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                <line x1={30} y1={120} x2={30} y2={145} stroke={C.cls} strokeWidth={1.5}
                  markerEnd="url(#arrCls)" />
                <defs>
                  <marker id="arrCls" viewBox="0 0 10 10" refX={8} refY={5}
                    markerWidth={6} markerHeight={6} orient="auto"><path d="M0,0 L10,5 L0,10" fill={C.cls} /></marker>
                </defs>
                <rect x={5} y={148} width={50} height={28} rx={14} fill={C.cls + '15'} stroke={C.cls} strokeWidth={1} />
                <text x={30} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cls}>문장 벡터</text>
              </motion.g>
              {/* warning */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
                <rect x={160} y={130} width={300} height={46} rx={6}
                  fill={C.bad + '08'} stroke={C.bad} strokeWidth={0.8} strokeDasharray="4 3" />
                <text x={310} y={150} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.bad}>
                  NSP 사전학습 목적 ≠ 의미 유사도
                </text>
                <text x={310} y={165} textAnchor="middle" fontSize={8} fill={C.bad} opacity={0.8}>
                  나머지 토큰의 세부 의미 정보 무시
                </text>
              </motion.g>
            </g>
          )}

          {/* Step 2: Mean pooling */}
          {step === 2 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mean}>
                평균 풀링 (Mean Pooling)
              </text>
              {TOKENS.map((t, i) => (
                <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}>
                  <text x={30 + i * 75} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={C.mean}>{t}</text>
                  <rect x={5 + i * 75} y={48} width={50} height={50} rx={4}
                    fill={C.mean + '12'} stroke={C.mean} strokeWidth={1} />
                </motion.g>
              ))}
              {/* arrows converging to center */}
              {TOKENS.map((_, i) => (
                <motion.line key={`a${i}`} x1={30 + i * 75} y1={100} x2={240} y2={140}
                  stroke={C.mean} strokeWidth={0.8} opacity={0.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3 + i * 0.05 }} />
              ))}
              {/* result */}
              <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, ...sp }}>
                <rect x={195} y={135} width={90} height={30} rx={15}
                  fill={C.mean + '18'} stroke={C.mean} strokeWidth={1.5} />
                <text x={240} y={154} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mean}>
                  Σ / N → 문장 벡터
                </text>
              </motion.g>
              {/* note */}
              <motion.text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                불용어("은/는/이/가")가 평균을 지배 → 의미 희석
              </motion.text>
            </g>
          )}

          {/* Step 3: Fundamental limitation */}
          {step === 3 && (
            <g>
              <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bad}>
                BERT 임베딩의 근본 한계
              </text>
              {/* Cross-encoder side */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={10} y={32} width={200} height={80} rx={6}
                  fill={C.bad + '08'} stroke={C.bad} strokeWidth={1} />
                <text x={110} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bad}>
                  Cross-Encoder
                </text>
                {/* two sentences going into one BERT */}
                <rect x={25} y={58} width={55} height={20} rx={4}
                  fill={C.cls + '15'} stroke={C.cls} strokeWidth={0.5} />
                <text x={52} y={72} textAnchor="middle" fontSize={8} fill={C.cls}>문장 A</text>
                <rect x={135} y={58} width={55} height={20} rx={4}
                  fill={C.cls + '15'} stroke={C.cls} strokeWidth={0.5} />
                <text x={162} y={72} textAnchor="middle" fontSize={8} fill={C.cls}>문장 B</text>
                <text x={110} y={72} textAnchor="middle" fontSize={9} fill={C.bad}>+</text>
                <text x={110} y={95} textAnchor="middle" fontSize={8} fill={C.bad}>
                  O(n²) — 10K쌍 ≈ 65시간
                </text>
              </motion.g>
              {/* vs */}
              <text x={232} y={76} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--muted-foreground)">vs</text>
              {/* Bi-encoder side */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={260} y={32} width={210} height={80} rx={6}
                  fill={C.good + '08'} stroke={C.good} strokeWidth={1} />
                <text x={365} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.good}>
                  Bi-Encoder (문장 임베딩)
                </text>
                <rect x={275} y={58} width={55} height={20} rx={4}
                  fill={C.good + '15'} stroke={C.good} strokeWidth={0.5} />
                <text x={302} y={72} textAnchor="middle" fontSize={8} fill={C.good}>문장 A</text>
                <rect x={395} y={58} width={55} height={20} rx={4}
                  fill={C.good + '15'} stroke={C.good} strokeWidth={0.5} />
                <text x={422} y={72} textAnchor="middle" fontSize={8} fill={C.good}>문장 B</text>
                <text x={365} y={72} textAnchor="middle" fontSize={12} fill={C.good}>→ →</text>
                <text x={365} y={95} textAnchor="middle" fontSize={8} fill={C.good}>
                  O(n) — 10K쌍 ≈ 5초
                </text>
              </motion.g>
              {/* STS result */}
              <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}>
                <rect x={60} y={125} width={360} height={55} rx={6}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={240} y={142} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">STS 벤치마크 Spearman 상관계수</text>
                {/* bars */}
                <rect x={80} y={150} width={100} height={10} rx={3} fill={C.bad + '30'} />
                <rect x={80} y={150} width={45} height={10} rx={3} fill={C.bad} />
                <text x={130} y={158} fontSize={7} fill={C.bad}>BERT [CLS]: 29.2</text>
                <rect x={80} y={164} width={100} height={10} rx={3} fill={C.token + '20'} />
                <rect x={80} y={164} width={62} height={10} rx={3} fill={C.token} />
                <text x={148} y={172} fontSize={7} fill={C.token}>GloVe 평균: 58.0</text>
                <rect x={280} y={150} width={100} height={10} rx={3} fill={C.good + '20'} />
                <rect x={280} y={150} width={88} height={10} rx={3} fill={C.good} />
                <text x={375} y={158} fontSize={7} fill={C.good}>SBERT: 84.6</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
