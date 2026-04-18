import { motion } from 'framer-motion';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './RetrievalVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: Dense Retrieval */
function DenseStep() {
  const docs = [
    { label: '설비 진동 매뉴얼', sim: 0.92 },
    { label: '베어링 교체 절차', sim: 0.87 },
    { label: '절삭유 관리', sim: 0.61 },
    { label: '안전 수칙 일반', sim: 0.43 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Dense Retrieval: 의미 기반 벡터 유사도 검색
      </text>
      {/* 질문 벡터 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={30} width={90} height={30} rx={12}
          fill={C.query + '15'} stroke={C.query} strokeWidth={1.2} />
        <text x={55} y={44} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.query}>Query vec</text>
        <text x={55} y={54} textAnchor="middle" fontSize={7} fill={C.muted}>1024d</text>
      </motion.g>
      {/* 코사인 유사도 화살표 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={100} y1={45} x2={130} y2={45} stroke={C.dense} strokeWidth={0.8} />
        <text x={115} y={38} textAnchor="middle" fontSize={7} fill={C.dense}>cos</text>
      </motion.g>
      {/* 검색 결과 */}
      {docs.map((d, i) => {
        const y = 24 + i * 28;
        const barW = d.sim * 120;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.08, ...sp }}>
            <rect x={135} y={y} width={180} height={22} rx={4}
              fill={d.sim > 0.7 ? C.dense + '10' : C.muted + '06'}
              stroke={d.sim > 0.7 ? C.dense : C.muted} strokeWidth={d.sim > 0.7 ? 0.8 : 0.4} />
            <text x={145} y={y + 14} fontSize={8} fill={d.sim > 0.7 ? C.dense : C.muted}>
              {d.label}
            </text>
            {/* 유사도 바 */}
            <rect x={330} y={y + 4} width={120} height={12} rx={3} fill={C.muted + '10'} />
            <motion.rect x={330} y={y + 4} width={0} height={12} rx={3}
              fill={d.sim > 0.7 ? C.dense + '40' : C.muted + '20'}
              animate={{ width: barW }}
              transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }} />
            <text x={456} y={y + 14} fontSize={7} fontWeight={600}
              fill={d.sim > 0.7 ? C.dense : C.muted}>{d.sim}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={140} textAnchor="middle" fontSize={8} fill={C.dense}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        "설비 이상 진동" == "기계 비정상 떨림" -- 의미적 매칭
      </motion.text>
    </g>
  );
}

/* Step 1: Sparse (BM25) */
function SparseStep() {
  const terms = ['CNC', '7200', '진동', '임계', '초과'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        BM25: 키워드 빈도 기반 검색
      </text>
      {/* 질문 토큰 분해 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <text x={15} y={36} fontSize={8} fontWeight={600} fill={C.sparse}>질문 토큰:</text>
        {terms.map((t, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.06 }}>
            <rect x={80 + i * 70} y={24} width={58} height={20} rx={10}
              fill={C.sparse + '15'} stroke={C.sparse} strokeWidth={0.8} />
            <text x={109 + i * 70} y={38} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={C.sparse}>{t}</text>
          </motion.g>
        ))}
      </motion.g>
      {/* IDF 가중치 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={15} y={64} fontSize={8} fontWeight={600} fill={C.sparse}>IDF 가중치:</text>
        {[2.1, 4.8, 1.5, 3.2, 1.8].map((w, i) => (
          <text key={i} x={109 + i * 70} y={64} textAnchor="middle" fontSize={8} fill={C.muted}>
            {w.toFixed(1)}
          </text>
        ))}
      </motion.g>
      {/* BM25 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={40} y={76} width={400} height={24} rx={5}
          fill={C.sparse + '06'} stroke={C.sparse} strokeWidth={0.5} />
        <text x={240} y={92} textAnchor="middle" fontSize={8} fill={C.sparse}>
          BM25 = sum IDF(qi) x (f(qi,d) x (k1+1)) / (f(qi,d) + k1 x (1-b+b x |d|/avgdl))
        </text>
      </motion.g>
      {/* 장단점 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={110} width={190} height={18} rx={4}
          fill={C.sparse + '08'} stroke={C.sparse} strokeWidth={0.5} />
        <text x={125} y={122} textAnchor="middle" fontSize={8} fill={C.sparse}>
          "CNC-7200" 정확 매칭
        </text>
        <rect x={240} y={110} width={200} height={18} rx={4}
          fill="#ef444408" stroke="#ef4444" strokeWidth={0.5} />
        <text x={340} y={122} textAnchor="middle" fontSize={8} fill="#ef4444">
          "진동" != "떨림" 동의어 매칭 불가
        </text>
      </motion.g>
    </g>
  );
}

/* Step 2: Hybrid Search */
function HybridStep() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Hybrid Search: Dense + Sparse 결합
      </text>
      {/* Dense 결과 */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={26} width={160} height={44} rx={7}
          fill={C.dense + '10'} stroke={C.dense} strokeWidth={1} />
        <text x={100} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.dense}>Dense</text>
        <text x={100} y={56} textAnchor="middle" fontSize={7} fill={C.dense}>의미 유사도 순위</text>
        <text x={100} y={66} textAnchor="middle" fontSize={7} fill={C.muted}>rank: A(1), B(2), D(3)</text>
      </motion.g>
      {/* Sparse 결과 */}
      <motion.g initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, ...sp }}>
        <rect x={20} y={78} width={160} height={44} rx={7}
          fill={C.sparse + '10'} stroke={C.sparse} strokeWidth={1} />
        <text x={100} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sparse}>Sparse</text>
        <text x={100} y={108} textAnchor="middle" fontSize={7} fill={C.sparse}>키워드 매칭 순위</text>
        <text x={100} y={118} textAnchor="middle" fontSize={7} fill={C.muted}>rank: B(1), C(2), A(3)</text>
      </motion.g>
      {/* RRF 결합 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <line x1={180} y1={48} x2={220} y2={74} stroke={C.hybrid} strokeWidth={1} />
        <line x1={180} y1={100} x2={220} y2={74} stroke={C.hybrid} strokeWidth={1} />
        <rect x={220} y={50} width={120} height={48} rx={8}
          fill={C.hybrid + '15'} stroke={C.hybrid} strokeWidth={1.5} />
        <text x={280} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.hybrid}>RRF</text>
        <text x={280} y={82} textAnchor="middle" fontSize={7} fill={C.hybrid}>1/(k+rank) 합산</text>
        <text x={280} y={92} textAnchor="middle" fontSize={7} fill={C.muted}>k=60</text>
      </motion.g>
      {/* 최종 결과 */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, ...sp }}>
        <line x1={340} y1={74} x2={360} y2={74} stroke={C.hybrid} strokeWidth={1} />
        {['B: 0.033', 'A: 0.032', 'D: 0.016', 'C: 0.016'].map((r, i) => (
          <g key={i}>
            <rect x={365} y={42 + i * 20} width={100} height={16} rx={4}
              fill={i < 2 ? C.hybrid + '12' : C.muted + '06'}
              stroke={i < 2 ? C.hybrid : C.muted} strokeWidth={i < 2 ? 0.8 : 0.3} />
            <text x={415} y={54 + i * 20} textAnchor="middle" fontSize={8}
              fill={i < 2 ? C.hybrid : C.muted} fontWeight={i < 2 ? 600 : 400}>{r}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/* Step 3: Re-ranking */
function RerankStep() {
  const pipeline = [
    { label: 'Bi-encoder', sub: 'Top-50 후보', w: 110, color: C.dense },
    { label: 'Cross-encoder', sub: '(Q,D) 동시 인코딩', w: 130, color: C.rerank },
    { label: 'Top-5 최종', sub: '정밀 재정렬', w: 100, color: C.hybrid },
  ];
  let px = 20;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Re-ranking: Cross-encoder로 정밀 재정렬
      </text>
      {pipeline.map((p, i) => {
        const x = px;
        px += p.w + 30;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, ...sp }}>
            <rect x={x} y={32} width={p.w} height={44} rx={7}
              fill={p.color + '12'} stroke={p.color} strokeWidth={1.2} />
            <text x={x + p.w / 2} y={50} textAnchor="middle" fontSize={9} fontWeight={700}
              fill={p.color}>{p.label}</text>
            <text x={x + p.w / 2} y={66} textAnchor="middle" fontSize={7} fill={C.muted}>{p.sub}</text>
            {i < 2 && (
              <motion.line x1={x + p.w} y1={54} x2={x + p.w + 30} y2={54}
                stroke={C.muted} strokeWidth={1} strokeDasharray="3 2"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.3 + i * 0.15 }} />
            )}
          </motion.g>
        );
      })}
      {/* bi vs cross 비교 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={30} y={92} width={420} height={40} rx={6}
          fill={C.rerank + '06'} stroke={C.rerank} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={240} y={108} textAnchor="middle" fontSize={8} fill={C.rerank}>
          Bi-encoder: Q, D 독립 인코딩 (빠름) | Cross-encoder: (Q,D) 동시 (정확)
        </text>
        <text x={240} y={122} textAnchor="middle" fontSize={8} fill={C.muted}>
          Cross-encoder 정확도 +5~15% / Top-20 재정렬 ~100ms (GPU)
        </text>
      </motion.g>
    </g>
  );
}

/* Step 4: MMR */
function MmrStep() {
  const docs = [
    { label: '원인 분석 (진동)', sim: 0.95, div: 'high', selected: true },
    { label: '원인 분석 (소음)', sim: 0.92, div: 'low', selected: false },
    { label: '조치 절차', sim: 0.88, div: 'high', selected: true },
    { label: '예방 대책', sim: 0.84, div: 'high', selected: true },
    { label: '원인 분석 (마모)', sim: 0.91, div: 'low', selected: false },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        MMR: 관련성 + 다양성 균형
      </text>
      {/* 수식 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={30} y={22} width={420} height={18} rx={4}
          fill={C.mmr + '06'} stroke={C.mmr} strokeWidth={0.5} />
        <text x={240} y={34} textAnchor="middle" fontSize={8} fill={C.mmr}>
          MMR = argmax [lambda x sim(q,d) - (1-lambda) x max sim(d,dj)]   lambda=0.5
        </text>
      </motion.g>
      {/* 문서 리스트 */}
      {docs.map((d, i) => {
        const y = 46 + i * 20;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.15 + i * 0.08 }}>
            {d.selected && (
              <rect x={28} y={y - 2} width={424} height={18} rx={3} fill={C.mmr + '08'} />
            )}
            <text x={38} y={y + 10} fontSize={8} fill={d.selected ? C.mmr : C.muted + '80'}>
              {d.selected ? 'V' : 'X'}
            </text>
            <text x={55} y={y + 10} fontSize={8} fontWeight={d.selected ? 600 : 400}
              fill={d.selected ? C.mmr : C.muted}>{d.label}</text>
            <text x={230} y={y + 10} fontSize={8} fill={C.muted}>sim: {d.sim}</text>
            <text x={320} y={y + 10} fontSize={8}
              fill={d.div === 'high' ? C.mmr : C.rerank}>
              다양성: {d.div === 'high' ? '높음' : '낮음 (중복)'}
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={150} textAnchor="middle" fontSize={8} fill={C.mmr}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        원인 + 조치 + 예방 -- 서로 다른 관점의 문서를 선택
      </motion.text>
    </g>
  );
}

/* Step 5: Query Transformation */
function QueryTransformStep() {
  const methods = [
    { name: 'Multi-query', desc: '질문 3~5개 변형 → 각각 검색 → 합집합', color: C.query },
    { name: 'HyDE', desc: 'LLM이 가상 답변 생성 → 그 답변으로 검색', color: C.dense },
    { name: 'Step-back', desc: '구체적 → 상위 개념으로 확장', color: C.hybrid },
    { name: 'Decompose', desc: '복합 질문 → 하위 질문 분해', color: C.mmr },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.muted}>
        Query Transformation: 질문 개선 기법
      </text>
      {/* 원래 질문 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <DataBox x={140} y={22} w={200} h={28} label="CNC 진동 0.5mm 초과 시 대응?"
          color={C.query} outlined />
      </motion.g>
      {/* 변형 기법들 */}
      {methods.map((m, i) => {
        const y = 60 + i * 24;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.1, ...sp }}>
            <line x1={240} y1={50} x2={90} y2={y + 8} stroke={m.color} strokeWidth={0.5} opacity={0.4} />
            <rect x={15} y={y - 2} width={75} height={20} rx={4}
              fill={m.color + '12'} stroke={m.color} strokeWidth={0.8} />
            <text x={52} y={y + 11} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={m.color}>{m.name}</text>
            <text x={100} y={y + 11} fontSize={7} fill={C.muted}>{m.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function RetrievalVizSteps({ step }: { step: number }) {
  switch (step) {
    case 0: return <DenseStep />;
    case 1: return <SparseStep />;
    case 2: return <HybridStep />;
    case 3: return <RerankStep />;
    case 4: return <MmrStep />;
    case 5: return <QueryTransformStep />;
    default: return <g />;
  }
}
