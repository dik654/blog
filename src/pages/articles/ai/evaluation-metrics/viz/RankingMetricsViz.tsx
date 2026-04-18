import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: '랭킹 지표가 필요한 이유',
    body: '검색 결과 10개 중 정답이 1번째 vs 10번째 — 둘 다 "맞음"이지만 사용자 경험은 전혀 다르다.\n위치(position)에 가중치를 부여하는 지표가 필요.\nMAP: 이진 관련성 (맞다/아니다). NDCG: 등급 관련성 (매우 관련/관련/무관).',
  },
  {
    label: 'Precision@K와 Average Precision',
    body: 'Precision@K: 상위 K개 중 관련 문서 비율.\nAP(Average Precision): 관련 문서가 나타난 각 위치에서의 Precision 평균.\n관련 문서가 앞에 올수록 AP가 높다 — 순서를 보상.',
  },
  {
    label: 'MAP — Mean Average Precision',
    body: 'MAP = (1/Q) * sum(AP_q) — 전체 쿼리의 AP 평균.\n검색 시스템 전체 성능을 단일 숫자로 요약.\n이진 관련성(relevant/not-relevant) 기반.\n추천 시스템, 정보 검색의 표준 지표.',
  },
  {
    label: 'DCG — Discounted Cumulative Gain',
    body: 'DCG@K = sum(i=1..K) rel_i / log2(i+1).\nrel_i: i번째 위치 문서의 관련도 점수 (0, 1, 2, 3 등).\nlog2(i+1)로 나눔: 뒤로 갈수록 할인(discount). 1위 가중치 1.0, 5위 가중치 0.39.\n등급형 관련성을 반영 — "매우 관련"이 "약간 관련"보다 더 가치 있다.',
  },
  {
    label: 'NDCG — Normalized DCG',
    body: 'NDCG@K = DCG@K / IDCG@K.\nIDCG: 이상적 순서(관련도 내림차순)의 DCG.\n정규화하여 0~1 범위. NDCG=1이면 완벽한 랭킹.\n서로 다른 쿼리(관련 문서 수가 다름)를 공정 비교 가능.',
  },
];

function StepContent({ step }: { step: number }) {
  if (step === 0) {
    // Why ranking metrics: position matters
    const items = [
      { pos: 1, label: '강아지 사진', rel: true },
      { pos: 2, label: '고양이 사진', rel: false },
      { pos: 3, label: '강아지 훈련', rel: true },
      { pos: 4, label: '날씨 정보', rel: false },
      { pos: 5, label: '강아지 품종', rel: true },
    ];
    return (
      <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          랭킹: 위치가 가치를 결정
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          검색어: "강아지" — 5개 결과에서 위치 가중치 시각화
        </text>
        {items.map((item, i) => {
          const y = 48 + i * 32;
          const weight = 1 / Math.log2(i + 2);
          const barW = weight * 200;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              {/* position */}
              <circle cx={30} cy={y + 10} r={12}
                fill={item.rel ? '#10b981' : '#94a3b8'} fillOpacity={0.15}
                stroke={item.rel ? '#10b981' : '#94a3b8'} strokeWidth={1} />
              <text x={30} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={item.rel ? '#10b981' : '#94a3b8'}>{item.pos}</text>
              {/* label */}
              <text x={55} y={y + 14} fontSize={10} fill="var(--foreground)">{item.label}</text>
              {/* relevance */}
              <text x={180} y={y + 14} fontSize={9} fontWeight={600}
                fill={item.rel ? '#10b981' : '#ef4444'}>{item.rel ? '관련' : '무관'}</text>
              {/* weight bar */}
              <rect x={220} y={y + 2} width={barW} height={16} rx={3}
                fill="#3b82f6" fillOpacity={item.rel ? 0.3 : 0.08}
                stroke="#3b82f6" strokeWidth={item.rel ? 0.8 : 0.3} />
              <text x={224 + barW} y={y + 14} fontSize={8} fill="#3b82f6">
                1/log2({i + 2}) = {weight.toFixed(2)}
              </text>
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={40} y={212} width={400} height={8} rx={2}
            fill="var(--muted)" fillOpacity={0} />
        </motion.g>
      </svg>
    );
  }
  if (step === 1) {
    // AP computation step by step
    const results = [
      { pos: 1, rel: true, pAtK: '1/1 = 1.00' },
      { pos: 2, rel: false, pAtK: '-' },
      { pos: 3, rel: true, pAtK: '2/3 = 0.67' },
      { pos: 4, rel: false, pAtK: '-' },
      { pos: 5, rel: true, pAtK: '3/5 = 0.60' },
    ];
    return (
      <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          Average Precision 계산 과정
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          AP = (1/R) * sum( P@k * rel(k) ) — 관련 문서 위치에서만 P@k 합산
        </text>
        {/* headers */}
        <text x={50} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">위치</text>
        <text x={130} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">관련성</text>
        <text x={260} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">P@K</text>
        <text x={400} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">AP 누적</text>
        <line x1={15} y1={60} x2={465} y2={60} stroke="var(--border)" strokeWidth={0.5} />
        {results.map((r, i) => {
          const y = 80 + i * 26;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}>
              <rect x={15} y={y - 10} width={450} height={22} rx={4}
                fill={r.rel ? '#10b981' : 'transparent'} fillOpacity={0.04}
                stroke={r.rel ? '#10b981' : 'var(--border)'} strokeWidth={r.rel ? 0.8 : 0.3} />
              <text x={50} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="var(--foreground)">{r.pos}</text>
              <circle cx={130} cy={y} r={8}
                fill={r.rel ? '#10b981' : '#94a3b8'} fillOpacity={0.2}
                stroke={r.rel ? '#10b981' : '#94a3b8'} strokeWidth={1} />
              <text x={130} y={y + 4} textAnchor="middle" fontSize={8} fontWeight={700}
                fill={r.rel ? '#10b981' : '#94a3b8'}>{r.rel ? 'O' : 'X'}</text>
              <text x={260} y={y + 4} textAnchor="middle" fontSize={10} fontFamily="monospace"
                fill={r.rel ? '#3b82f6' : 'var(--muted-foreground)'}>{r.pAtK}</text>
              {r.rel && (
                <text x={400} y={y + 4} textAnchor="middle" fontSize={9} fill="#8b5cf6">
                  +{r.pAtK.split('= ')[1]}
                </text>
              )}
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <rect x={100} y={195} width={280} height={22} rx={6}
            fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1} />
          <text x={240} y={210} textAnchor="middle" fontSize={10} fontWeight={700} fill="#8b5cf6">
            AP = (1.00 + 0.67 + 0.60) / 3 = 0.756
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 2) {
    // MAP: average over queries
    const queries = [
      { q: '강아지', ap: 0.756, color: '#3b82f6' },
      { q: '고양이', ap: 0.833, color: '#10b981' },
      { q: '햄스터', ap: 0.500, color: '#f59e0b' },
      { q: '거북이', ap: 0.650, color: '#8b5cf6' },
    ];
    const map = queries.reduce((s, q) => s + q.ap, 0) / queries.length;
    return (
      <svg viewBox="0 0 480 260" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          MAP = 전체 쿼리의 AP 평균
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          MAP = (1/Q) · Σ AP_q — Q개 쿼리의 AP를 평균
        </text>
        {queries.map((q, i) => {
          const y = 50 + i * 32;
          const barW = q.ap * 260;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}>
              <text x={60} y={y + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={q.color}>
                "{q.q}"
              </text>
              <rect x={100} y={y + 2} width={barW} height={18} rx={4}
                fill={q.color} fillOpacity={0.15} stroke={q.color} strokeWidth={0.8} />
              <text x={104 + barW} y={y + 15} fontSize={9} fontWeight={600} fill={q.color}>
                AP={q.ap.toFixed(3)}
              </text>
            </motion.g>
          );
        })}
        {/* MAP result — larger box, thinner stroke, split into 2 lines */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <line x1={60} y1={194} x2={420} y2={194} stroke="var(--border)" strokeWidth={0.5} />
          <rect x={30} y={204} width={420} height={44} rx={6}
            fill="#ef4444" fillOpacity={0.05} stroke="#ef4444" strokeWidth={0.8} />
          <text x={240} y={222} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
            MAP = ({queries.map(q => q.ap.toFixed(3)).join(' + ')}) / 4
          </text>
          <text x={240} y={238} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ef4444">
            = {map.toFixed(3)}
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 3) {
    // DCG: discount by position
    const items = [
      { pos: 1, rel: 3, discount: 1.0 },
      { pos: 2, rel: 2, discount: 0.63 },
      { pos: 3, rel: 3, discount: 0.50 },
      { pos: 4, rel: 0, discount: 0.43 },
      { pos: 5, rel: 1, discount: 0.39 },
    ];
    const dcg = items.reduce((s, it) => s + it.rel * it.discount, 0);
    return (
      <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          DCG: 위치별 할인으로 상위 결과를 더 보상
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          DCG@K = sum( rel_i / log2(i+1) ) — log 할인
        </text>
        {/* headers */}
        <text x={40} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">위치</text>
        <text x={105} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">관련도</text>
        <text x={190} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">할인율</text>
        <text x={300} y={54} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">기여분</text>
        <line x1={15} y1={60} x2={465} y2={60} stroke="var(--border)" strokeWidth={0.5} />
        {items.map((it, i) => {
          const y = 78 + i * 26;
          const gain = it.rel * it.discount;
          const barW = gain * 50;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <text x={40} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">{it.pos}</text>
              {/* rel stars */}
              <text x={105} y={y + 4} textAnchor="middle" fontSize={10} fill="#3b82f6">
                {it.rel > 0 ? Array(it.rel).fill('*').join('') : '-'}
              </text>
              <text x={190} y={y + 4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="#f59e0b">
                1/log2({it.pos + 1}) = {it.discount.toFixed(2)}
              </text>
              <rect x={270} y={y - 6} width={barW} height={16} rx={3}
                fill="#10b981" fillOpacity={0.25} stroke="#10b981" strokeWidth={0.5} />
              <text x={274 + barW} y={y + 4} fontSize={9} fontWeight={600} fill="#10b981">
                {gain.toFixed(2)}
              </text>
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={100} y={196} width={280} height={22} rx={6}
            fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1} />
          <text x={240} y={211} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
            DCG@5 = {dcg.toFixed(2)}
          </text>
        </motion.g>
      </svg>
    );
  }
  // step 4: NDCG normalization
  const current = [3, 2, 3, 0, 1]; // current order
  const ideal = [3, 3, 2, 1, 0]; // ideal order (sorted desc)
  const disc = [1.0, 0.63, 0.50, 0.43, 0.39];
  const dcg = current.reduce((s, r, i) => s + r * disc[i], 0);
  const idcg = ideal.reduce((s, r, i) => s + r * disc[i], 0);
  const ndcg = dcg / idcg;
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
      <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
        NDCG: 이상적 순서 대비 정규화
      </text>
      <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
        NDCG@K = DCG@K / IDCG@K — 0~1 정규화
      </text>
      {/* Current vs Ideal side by side */}
      <text x={130} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">현재 순서</text>
      <text x={370} y={52} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">이상적 순서 (IDCG)</text>
      {current.map((r, i) => {
        const y = 62 + i * 24;
        return (
          <motion.g key={`c-${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}>
            {/* current */}
            <rect x={50} y={y} width={160} height={20} rx={4}
              fill="#3b82f6" fillOpacity={r > 0 ? 0.08 : 0.02} stroke="#3b82f6" strokeWidth={0.5} />
            <text x={70} y={y + 14} fontSize={9} fill="var(--foreground)">#{i + 1}</text>
            <text x={110} y={y + 14} fontSize={9} fill="#3b82f6">rel={r}</text>
            <text x={175} y={y + 14} fontSize={8} fill="var(--muted-foreground)">{(r * disc[i]).toFixed(2)}</text>
            {/* ideal */}
            <rect x={280} y={y} width={160} height={20} rx={4}
              fill="#10b981" fillOpacity={ideal[i] > 0 ? 0.08 : 0.02} stroke="#10b981" strokeWidth={0.5} />
            <text x={300} y={y + 14} fontSize={9} fill="var(--foreground)">#{i + 1}</text>
            <text x={340} y={y + 14} fontSize={9} fill="#10b981">rel={ideal[i]}</text>
            <text x={415} y={y + 14} fontSize={8} fill="var(--muted-foreground)">{(ideal[i] * disc[i]).toFixed(2)}</text>
          </motion.g>
        );
      })}
      {/* Results */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={130} y={192} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">
          DCG = {dcg.toFixed(2)}
        </text>
        <text x={370} y={192} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
          IDCG = {idcg.toFixed(2)}
        </text>
        <rect x={120} y={198} width={240} height={22} rx={6}
          fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={1} />
        <text x={240} y={213} textAnchor="middle" fontSize={11} fontWeight={700} fill="#8b5cf6">
          NDCG = {dcg.toFixed(2)} / {idcg.toFixed(2)} = {ndcg.toFixed(3)}
        </text>
      </motion.g>
    </svg>
  );
}

export default function RankingMetricsViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}
