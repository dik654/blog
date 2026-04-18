import { motion } from 'framer-motion';
import { C } from './SummaryDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export function Step0() {
  const models = [
    { name: 'BERT', year: '2018', params: '110M', note: 'MLM' },
    { name: 'RoBERTa', year: '2019', params: '125M', note: 'no NSP' },
    { name: 'ALBERT', year: '2019', params: '12M', note: '파라미터 공유' },
    { name: 'DeBERTa', year: '2020', params: '-', note: 'disentangled attn' },
    { name: 'ELECTRA', year: '2020', params: '-', note: 'replaced token' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.enc}>Encoder-only -- 이해 중심</text>
      {/* Header */}
      <text x={30} y={34} fontSize={7} fontWeight={600} fill={C.muted}>모델</text>
      <text x={110} y={34} fontSize={7} fontWeight={600} fill={C.muted}>연도</text>
      <text x={160} y={34} fontSize={7} fontWeight={600} fill={C.muted}>파라미터</text>
      <text x={230} y={34} fontSize={7} fontWeight={600} fill={C.muted}>특징</text>
      <line x1={20} y1={38} x2={380} y2={38} stroke="var(--border)" strokeWidth={0.5} />
      {models.map((m, i) => {
        const y = 50 + i * 20;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <text x={30} y={y} fontSize={8} fontWeight={600} fill={C.enc}>{m.name}</text>
            <text x={110} y={y} fontSize={8} fill={C.muted}>{m.year}</text>
            <text x={160} y={y} fontSize={8} fill={C.muted}>{m.params}</text>
            <text x={230} y={y} fontSize={8} fill={C.muted}>{m.note}</text>
          </motion.g>
        );
      })}
      {/* Use cases */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={380} y={40} width={80} height={60} rx={4}
          fill={`${C.enc}08`} stroke={C.enc} strokeWidth={0.8} />
        <text x={420} y={58} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>
          강점
        </text>
        <text x={390} y={72} fontSize={7} fill={C.muted}>분류</text>
        <text x={390} y={84} fontSize={7} fill={C.muted}>NER, QA</text>
        <text x={390} y={96} fontSize={7} fill={C.muted}>이해 태스크</text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const models = [
    { name: 'GPT-1', year: '2018', params: '117M' },
    { name: 'GPT-2', year: '2019', params: '1.5B' },
    { name: 'GPT-3', year: '2020', params: '175B' },
    { name: 'GPT-4', year: '2023', params: '~1.7T' },
    { name: 'LLaMA-3', year: '2024', params: '8B~405B' },
    { name: 'Mistral', year: '2023', params: 'MoE' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.dec}>Decoder-only -- 생성 중심</text>
      {models.map((m, i) => {
        const y = 30 + i * 20;
        const barW = Math.min(
          i === 0 ? 10 : i === 1 ? 30 : i === 2 ? 140 : i === 3 ? 300 : i === 4 ? 100 : 60,
          300
        );
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.08 }}>
            <text x={20} y={y + 12} fontSize={8} fontWeight={600} fill={C.dec}>{m.name}</text>
            <text x={75} y={y + 12} fontSize={7} fill={C.muted}>{m.year}</text>
            <motion.rect x={110} y={y} width={barW} height={16} rx={3}
              fill={`${C.dec}12`} stroke={C.dec} strokeWidth={0.6}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '110px center' }}
              transition={{ ...sp, delay: 0.1 + i * 0.06 }} />
            <text x={115 + barW} y={y + 12} fontSize={7} fontWeight={600} fill={C.dec}>
              {m.params}
            </text>
          </motion.g>
        );
      })}
      {/* Other models */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={156} fontSize={7} fill={C.muted}>
          + Claude 3 (Anthropic), Gemini (Google), Qwen (Alibaba)
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const innovations = [
    { name: 'Sparse MoE', desc: '활성 파라미터 절감', model: 'Mixtral' },
    { name: 'Flash Attention', desc: 'IO-aware, O(N) 메모리', model: '-' },
    { name: 'GQA', desc: 'KV cache 절감', model: 'LLaMA-2' },
    { name: 'Sliding Window', desc: '긴 시퀀스 효율', model: 'Mistral' },
    { name: 'SSM (Mamba)', desc: '선형 시간 대안', model: '2023' },
    { name: 'RoPE', desc: '상대 위치 인코딩', model: 'LLaMA' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.arch}>아키텍처 혁신</text>
      {innovations.map((inv, i) => {
        const y = 28 + i * 22;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={20} y={y} width={100} height={18} rx={3}
              fill={`${C.arch}12`} stroke={C.arch} strokeWidth={0.8} />
            <text x={70} y={y + 13} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={C.arch}>{inv.name}</text>
            <text x={130} y={y + 13} fontSize={8} fill={C.muted}>{inv.desc}</text>
            <text x={340} y={y + 13} fontSize={7} fill={C.arch}>{inv.model}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function Step3() {
  const trends = [
    { name: '긴 문맥', desc: '1M tokens (Gemini), 200K (Claude)', color: C.trend },
    { name: '효율 추론', desc: 'speculative decoding, Medusa', color: C.arch },
    { name: 'Open-source', desc: 'LLaMA-3, Mixtral, Qwen', color: C.dec },
    { name: 'Agent', desc: '외부 도구 호출 능력', color: C.seq },
    { name: 'Reasoning', desc: 'o1, Claude thinking', color: C.enc },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.trend}>2024 트렌드</text>
      {trends.map((t, i) => {
        const y = 28 + i * 24;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={20} y={y} width={90} height={20} rx={3}
              fill={`${t.color}12`} stroke={t.color} strokeWidth={1} />
            <text x={65} y={y + 14} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={t.color}>{t.name}</text>
            <text x={120} y={y + 14} fontSize={8} fill={C.muted}>{t.desc}</text>
          </motion.g>
        );
      })}
      {/* Citation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={40} y={152} width={400} height={0} rx={0} />
      </motion.g>
    </g>
  );
}
