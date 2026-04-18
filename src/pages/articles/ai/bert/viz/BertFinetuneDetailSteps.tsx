import { motion } from 'framer-motion';
import { C } from './BertFinetuneDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.cls}>문장 분류 + 문장 쌍 분류</text>
      {/* Single sentence */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={220} height={46} rx={5}
          fill={`${C.cls}10`} stroke={C.cls} strokeWidth={1} />
        <text x={30} y={42} fontSize={8} fontWeight={600} fill={C.cls}>단일 문장 분류</text>
        {['[CLS]', 't1', 't2', '...', '[SEP]'].map((t, i) => {
          const x = 30 + i * 38;
          return (
            <rect key={i} x={x} y={48} width={32} height={16} rx={3}
              fill={t.startsWith('[') ? `${C.cls}20` : `${C.muted}08`}
              stroke={t.startsWith('[') ? C.cls : C.muted} strokeWidth={0.5}>
            </rect>
          );
        })}
        {['[CLS]', 't1', 't2', '...', '[SEP]'].map((t, i) => (
          <text key={`l${i}`} x={46 + i * 38} y={60} textAnchor="middle" fontSize={6}
            fill={t.startsWith('[') ? C.cls : C.muted}>{t}</text>
        ))}
        <text x={30} y={70} fontSize={6} fill={C.muted}>SST-2: 94.9%</text>
      </motion.g>
      {/* CLS head arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={46} y1={48} x2={46} y2={34} stroke={C.cls} strokeWidth={0.8} />
        <rect x={260} y={28} width={200} height={24} rx={4}
          fill={`${C.cls}12`} stroke={C.cls} strokeWidth={1} />
        <text x={270} y={44} fontSize={7} fontWeight={600} fill={C.cls}>
          [CLS] h → Dense(num_cls) → Softmax
        </text>
        <line x1={240} y1={40} x2={258} y2={40} stroke={C.cls} strokeWidth={0.8} />
        <polygon points="256,37 262,40 256,43" fill={C.cls} />
      </motion.g>
      {/* Sentence pair */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={82} width={440} height={38} rx={5}
          fill={`${C.qa}08`} stroke={C.qa} strokeWidth={0.8} />
        <text x={30} y={96} fontSize={8} fontWeight={600} fill={C.qa}>문장 쌍 분류</text>
        {['[CLS]', 'premise', '[SEP]', 'hypothesis', '[SEP]'].map((t, i) => {
          const x = 110 + i * 66;
          const c = t.startsWith('[') ? C.qa : C.muted;
          return (
            <g key={i}>
              <rect x={x} y={100} width={58} height={14} rx={3}
                fill={`${c}10`} stroke={c} strokeWidth={0.5} />
              <text x={x + 29} y={110} textAnchor="middle" fontSize={6} fill={c}>{t}</text>
            </g>
          );
        })}
      </motion.g>
      {/* Segment labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={160} y={94} fontSize={6} fontFamily={MF} fill={C.muted}>seg: 0,0,0</text>
        <text x={310} y={94} fontSize={6} fontFamily={MF} fill={C.muted}>seg: 1,1,1</text>
      </motion.g>
      {/* MNLI */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={20} y={126} width={440} height={24} rx={3}
          fill={`${C.cls}06`} stroke={C.cls} strokeWidth={0.4} strokeDasharray="3 2" />
        <text x={30} y={140} fontSize={7} fill={C.cls}>
          3-way: 수반 / 모순 / 중립 | MNLI: 86.7%
        </text>
        <text x={280} y={140} fontSize={7} fill={C.muted}>
          같은 [CLS] 헤드로 QQP, STS-B도 적용
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.qa}>QA + NER 토큰 분류</text>
      {/* QA */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={440} height={46} rx={5}
          fill={`${C.qa}08`} stroke={C.qa} strokeWidth={1} />
        <text x={30} y={42} fontSize={8} fontWeight={600} fill={C.qa}>Extractive QA</text>
        {/* Tokens with start/end */}
        {['[CLS]', 'Q', '[SEP]', 'The', 'cat', 'sat', 'on', '[SEP]'].map((t, i) => {
          const x = 30 + i * 50;
          const isAns = t === 'cat' || t === 'sat';
          return (
            <g key={i}>
              <rect x={x} y={48} width={42} height={18} rx={3}
                fill={isAns ? `${C.qa}25` : `${C.muted}08`}
                stroke={isAns ? C.qa : C.muted} strokeWidth={isAns ? 1.5 : 0.5} />
              <text x={x + 21} y={60} textAnchor="middle" fontSize={7}
                fontWeight={isAns ? 700 : 400}
                fill={isAns ? C.qa : C.muted}>{t}</text>
            </g>
          );
        })}
        <text x={230} y={42} fontSize={7} fontFamily={MF} fill={C.qa}>
          start=4, end=5 → "cat sat"
        </text>
      </motion.g>
      {/* NER */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={82} width={440} height={40} rx={5}
          fill={`${C.ner}08`} stroke={C.ner} strokeWidth={1} />
        <text x={30} y={96} fontSize={8} fontWeight={600} fill={C.ner}>NER (Token Classification)</text>
        {/* Tokens with tags */}
        {[
          { tok: 'John', tag: 'B-PER', c: C.ner },
          { tok: 'Smith', tag: 'I-PER', c: C.ner },
          { tok: 'went', tag: 'O', c: C.muted },
          { tok: 'to', tag: 'O', c: C.muted },
          { tok: 'Seoul', tag: 'B-LOC', c: C.qa },
        ].map((t, i) => {
          const x = 30 + i * 78;
          return (
            <g key={i}>
              <rect x={x} y={100} width={70} height={16} rx={3}
                fill={`${t.c}10`} stroke={t.c} strokeWidth={0.6} />
              <text x={x + 35} y={110} textAnchor="middle" fontSize={7} fill={t.c}>{t.tok}</text>
              <text x={x + 35} y={120} textAnchor="middle" fontSize={6} fontFamily={MF} fill={t.c}>{t.tag}</text>
            </g>
          );
        })}
      </motion.g>
      {/* Scores */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={20} y={130} width={210} height={22} rx={3}
          fill={`${C.qa}06`} stroke={C.qa} strokeWidth={0.4} />
        <text x={30} y={144} fontSize={7} fill={C.qa}>SQuAD 2.0 F1: 83.1</text>
        <rect x={250} y={130} width={210} height={22} rx={3}
          fill={`${C.ner}06`} stroke={C.ner} strokeWidth={0.4} />
        <text x={260} y={144} fontSize={7} fill={C.ner}>CoNLL-2003 F1: 92.8</text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const params = [
    { key: 'Learning rate', value: '2e-5 / 3e-5 / 5e-5', note: '사전학습 1e-4 대비 10~50배 작음' },
    { key: 'Batch size', value: '16 or 32', note: '소규모 태스크는 16 권장' },
    { key: 'Epochs', value: '2~4', note: '과적합 방지, 대부분 3에서 수렴' },
    { key: 'Optimizer', value: 'AdamW', note: 'warmup 10%' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.gen}>파인튜닝 하이퍼파라미터</text>
      {params.map((p, i) => {
        const y = 28 + i * 26;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={20} y={y} width={440} height={22} rx={3}
              fill={`${C.gen}${i === 0 ? '10' : '06'}`} stroke={C.gen} strokeWidth={i === 0 ? 0.8 : 0.4} />
            <text x={30} y={y + 14} fontSize={7} fontWeight={600} fill={C.gen}>{p.key}</text>
            <text x={150} y={y + 14} fontSize={8} fontFamily={MF} fill={C.gen}>{p.value}</text>
            <text x={300} y={y + 14} fontSize={7} fill={C.muted}>{p.note}</text>
          </motion.g>
        );
      })}
      {/* Why small lr */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={136} width={440} height={20} rx={3}
          fill={`${C.gen}06`} stroke={C.gen} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={30} y={150} fontSize={7} fontWeight={600} fill={C.gen}>
          왜 작은 lr?
        </text>
        <text x={100} y={150} fontSize={7} fill={C.muted}>
          큰 변경 → catastrophic forgetting | 전체 파인튜닝이 linear probing보다 +10~15%
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const groups = [
    { title: '효율화', items: ['DistilBERT (66M)', 'ALBERT (12M)', 'TinyBERT (2층)'], color: C.cls },
    { title: '성능 개선', items: ['RoBERTa', 'ELECTRA', 'DeBERTa'], color: C.qa },
    { title: '다국어', items: ['mBERT (104언어)', 'XLM-R', 'KoBERT'], color: C.ner },
    { title: '도메인', items: ['BioBERT', 'FinBERT', 'LegalBERT'], color: C.gen },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.gen}>BERT 이후 모델 계보</text>
      {groups.map((g, gi) => {
        const x = 20 + (gi % 2) * 230;
        const y = 28 + Math.floor(gi / 2) * 50;
        return (
          <motion.g key={gi} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: gi * 0.12 }}>
            <rect x={x} y={y} width={210} height={42} rx={4}
              fill={`${g.color}08`} stroke={g.color} strokeWidth={0.8} />
            <text x={x + 10} y={y + 14} fontSize={8} fontWeight={600} fill={g.color}>{g.title}</text>
            {g.items.map((item, ii) => (
              <text key={ii} x={x + 10 + ii * 70} y={y + 30} fontSize={6.5}
                fontFamily={MF} fill={C.muted}>{item}</text>
            ))}
          </motion.g>
        );
      })}
      {/* Long context + current */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={20} y={132} width={440} height={24} rx={4}
          fill={`${C.gen}06`} stroke={C.gen} strokeWidth={0.5} />
        <text x={30} y={146} fontSize={7} fontWeight={600} fill={C.gen}>현재:</text>
        <text x={70} y={146} fontSize={7} fill={C.muted}>
          Encoder → 검색/분류/임베딩 우위 | Decoder → 생성 지배 | Long: Longformer, BigBird
        </text>
      </motion.g>
    </g>
  );
}
