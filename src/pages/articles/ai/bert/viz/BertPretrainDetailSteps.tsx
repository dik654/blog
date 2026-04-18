import { motion } from 'framer-motion';
import { C } from './BertPretrainDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  const tokens = ['The', '[MASK]', 'sat', 'on', 'the', 'mat'];
  const colors = ['#94a3b8', C.mlm, '#94a3b8', '#94a3b8', '#94a3b8', '#94a3b8'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.mlm}>MLM 손실 함수</text>
      {/* Input tokens */}
      {tokens.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.06 }}>
          <rect x={20 + i * 68} y={28} width={60} height={22} rx={4}
            fill={t === '[MASK]' ? `${C.mlm}20` : `${colors[i]}10`}
            stroke={colors[i]} strokeWidth={t === '[MASK]' ? 1.5 : 0.6} />
          <text x={50 + i * 68} y={43} textAnchor="middle" fontSize={8}
            fontWeight={t === '[MASK]' ? 700 : 400}
            fill={colors[i]}>{t}</text>
        </motion.g>
      ))}
      {/* BERT processing arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={160} y={56} width={100} height={18} rx={9}
          fill={`${C.mlm}10`} stroke={C.mlm} strokeWidth={0.8} />
        <text x={210} y={68} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.mlm}>BERT Encoder</text>
        <line x1={210} y1={74} x2={210} y2={84} stroke={C.mlm} strokeWidth={1} />
        <polygon points="206,82 210,88 214,82" fill={C.mlm} />
      </motion.g>
      {/* Output: logits for masked position */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={80} y={90} width={260} height={28} rx={4}
          fill={`${C.mlm}08`} stroke={C.mlm} strokeWidth={1} />
        <text x={90} y={104} fontSize={7} fontFamily={MF} fill={C.mlm}>
          logits = Linear(h_mask) → (vocab_size,)
        </text>
        <text x={90} y={114} fontSize={7} fontFamily={MF} fill={C.muted}>
          P(cat) = softmax(logits)[cat]
        </text>
      </motion.g>
      {/* Loss */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={80} y={124} width={380} height={30} rx={4}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={90} y={138} fontSize={8} fontWeight={600} fill={C.loss}>
          L_MLM = -Sigma log P(x_i | context)
        </text>
        <text x={90} y={150} fontSize={7} fill={C.muted}>
          마스킹 위치(15%)만 손실 계산 — 나머지 85% 무시
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const rules = [
    { pct: '80%', action: '[MASK]로 교체', ex: '"the [MASK] sat"', color: C.mlm },
    { pct: '10%', action: '랜덤 토큰', ex: '"the apple sat"', color: C.loss },
    { pct: '10%', action: '원본 유지', ex: '"the cat sat"', color: C.nsp },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.loss}>80/10/10 마스킹 규칙</text>
      {rules.map((r, i) => {
        const y = 30 + i * 32;
        const barW = i === 0 ? 280 : 35;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* Proportion bar */}
            <motion.rect x={20} y={y} width={barW} height={24} rx={4}
              fill={`${r.color}15`} stroke={r.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '20px center' }}
              transition={{ ...sp, delay: 0.1 + i * 0.1 }} />
            <text x={30} y={y + 16} fontSize={9} fontWeight={700} fill={r.color}>{r.pct}</text>
            {/* Description */}
            <text x={i === 0 ? 310 : 65} y={y + 10} fontSize={8} fontWeight={600} fill={r.color}>{r.action}</text>
            <text x={i === 0 ? 310 : 65} y={y + 22} fontSize={7} fontFamily={MF} fill={C.muted}>{r.ex}</text>
          </motion.g>
        );
      })}
      {/* Why not 100% MASK */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={20} y={128} width={440} height={26} rx={4}
          fill={`${C.loss}06`} stroke={C.loss} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={30} y={142} fontSize={7} fontWeight={600} fill={C.loss}>
          왜 100% [MASK] 아닌가?
        </text>
        <text x={180} y={142} fontSize={7} fill={C.muted}>
          파인튜닝 시 [MASK] 없음 → train/test mismatch 방지
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.nsp}>NSP + 전체 손실</text>
      {/* Input format */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        {['[CLS]', 'Sent A', '[SEP]', 'Sent B', '[SEP]'].map((t, i) => {
          const x = 20 + i * 84;
          const c = t.startsWith('[') ? C.nsp : C.muted;
          return (
            <g key={i}>
              <rect x={x} y={26} width={76} height={20} rx={4}
                fill={`${c}10`} stroke={c} strokeWidth={t.startsWith('[') ? 1 : 0.5} />
              <text x={x + 38} y={40} textAnchor="middle" fontSize={7}
                fontWeight={t.startsWith('[') ? 700 : 400} fill={c}>{t}</text>
            </g>
          );
        })}
      </motion.g>
      {/* NSP head */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={58} y1={46} x2={58} y2={56} stroke={C.nsp} strokeWidth={1} />
        <polygon points="54,54 58,60 62,54" fill={C.nsp} />
        <rect x={20} y={60} width={160} height={28} rx={4}
          fill={`${C.nsp}12`} stroke={C.nsp} strokeWidth={1} />
        <text x={30} y={74} fontSize={7} fontWeight={600} fill={C.nsp}>[CLS] → Dense(2) → Softmax</text>
        <text x={30} y={84} fontSize={7} fontFamily={MF} fill={C.muted}>50% IsNext / 50% NotNext</text>
      </motion.g>
      {/* NSP loss */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={200} y={60} width={260} height={28} rx={4}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={0.8} />
        <text x={210} y={74} fontSize={7} fontWeight={600} fill={C.loss}>L_NSP = -log P(y | h_CLS)</text>
        <text x={210} y={84} fontSize={7} fill={C.muted}>이진 크로스 엔트로피</text>
      </motion.g>
      {/* Total loss */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={80} y={100} width={320} height={30} rx={5}
          fill={`${C.mlm}10`} stroke={C.mlm} strokeWidth={1.2} />
        <text x={240} y={115} textAnchor="middle" fontSize={9} fontWeight={700}
          fontFamily={MF} fill={C.mlm}>L_total = L_MLM + L_NSP</text>
        <text x={240} y={126} textAnchor="middle" fontSize={7} fill={C.muted}>가중치 없이 단순 합산</text>
      </motion.g>
      {/* Why */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.9 }}>
        <rect x={20} y={138} width={440} height={18} rx={3}
          fill={`${C.nsp}06`} stroke={C.nsp} strokeWidth={0.4} strokeDasharray="3 2" />
        <text x={30} y={150} fontSize={7} fill={C.nsp}>
          MLM: 토큰 수준 문맥 학습 | NSP: 문장 수준 관계 학습 → 서로 보완
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const timeline = [
    { year: '2018', model: 'BERT', change: 'MLM + NSP', color: C.mlm },
    { year: '2019', model: 'RoBERTa', change: 'NSP 제거 + 동적 마스킹', color: C.nsp },
    { year: '2019', model: 'ALBERT', change: 'NSP → SOP (순서 예측)', color: C.loss },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.trend}>NSP 제거 트렌드</text>
      {/* Timeline */}
      <motion.line x1={60} y1={35} x2={60} y2={110} stroke={C.trend} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }} />
      {timeline.map((t, i) => {
        const y = 38 + i * 26;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.15 }}>
            <circle cx={60} cy={y + 6} r={4} fill={t.color} />
            <text x={74} y={y + 4} fontSize={7} fontFamily={MF} fill={C.muted}>{t.year}</text>
            <text x={110} y={y + 4} fontSize={8} fontWeight={600} fill={t.color}>{t.model}</text>
            <text x={110} y={y + 16} fontSize={7} fill={C.muted}>{t.change}</text>
          </motion.g>
        );
      })}
      {/* Key finding */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={260} y={30} width={200} height={50} rx={4}
          fill={`${C.nsp}08`} stroke={C.nsp} strokeWidth={0.8} />
        <text x={270} y={44} fontSize={7} fontWeight={600} fill={C.nsp}>RoBERTa 발견:</text>
        <text x={270} y={58} fontSize={7} fill={C.muted}>NSP 제거해도 성능 향상</text>
        <text x={270} y={70} fontSize={7} fill={C.muted}>랜덤 문장은 주제부터 달라 너무 쉬움</text>
      </motion.g>
      {/* Data scale */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={20} y={118} width={440} height={36} rx={4}
          fill={`${C.trend}06`} stroke={C.trend} strokeWidth={0.5} />
        <text x={30} y={132} fontSize={7} fontWeight={600} fill={C.trend}>2019년 이후 표준:</text>
        <text x={140} y={132} fontSize={7} fill={C.muted}>
          NSP 삭제 + 동적 마스킹 + 긴 시퀀스(512) + 대규모 데이터
        </text>
        <text x={30} y={146} fontSize={7} fontFamily={MF} fill={C.muted}>
          BERT 16GB → RoBERTa 160GB → 최근 수 TB | TPU v3 64chips 4일 (~$6K)
        </text>
      </motion.g>
    </g>
  );
}
