import { motion } from 'framer-motion';
import { C } from './BertOverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  const rows = [
    { param: 'Transformer', base: '12', large: '24' },
    { param: 'Hidden', base: '768', large: '1024' },
    { param: 'Heads', base: '12', large: '16' },
    { param: 'FFN', base: '3072', large: '4096' },
    { param: 'Params', base: '110M', large: '340M' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.base}>BERT-base vs BERT-large</text>
      {/* Table header */}
      <rect x={30} y={24} width={120} height={18} rx={3} fill={`${C.muted}10`} />
      <rect x={155} y={24} width={70} height={18} rx={3} fill={`${C.base}15`} />
      <rect x={230} y={24} width={70} height={18} rx={3} fill={`${C.large}15`} />
      <text x={90} y={36} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.muted}>Parameter</text>
      <text x={190} y={36} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.base}>base</text>
      <text x={265} y={36} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.large}>large</text>
      {/* Table rows */}
      {rows.map((r, i) => {
        const y = 46 + i * 18;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={30} y={y} width={120} height={16} rx={2} fill={`${C.muted}06`} />
            <text x={40} y={y + 12} fontSize={7} fill={C.muted}>{r.param}</text>
            <text x={190} y={y + 12} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.base}>{r.base}</text>
            <text x={265} y={y + 12} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.large}>{r.large}</text>
          </motion.g>
        );
      })}
      {/* Common params */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={320} y={28} width={140} height={44} rx={4}
          fill={`${C.emb}08`} stroke={C.emb} strokeWidth={0.6} />
        <text x={330} y={42} fontSize={7} fontWeight={600} fill={C.emb}>공통</text>
        <text x={330} y={54} fontSize={7} fontFamily={MF} fill={C.muted}>Max Seq: 512</text>
        <text x={330} y={66} fontSize={7} fontFamily={MF} fill={C.muted}>Vocab: 30,522</text>
      </motion.g>
      {/* Params ratio */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={320} y={80} width={140} height={56} rx={4}
          fill={`${C.base}06`} stroke={C.base} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={330} y={94} fontSize={7} fill={C.base}>base: 110M params</text>
        <motion.rect x={330} y={100} width={60} height={8} rx={2}
          fill={C.base} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          style={{ transformOrigin: '330px center' }}
          transition={{ ...sp, delay: 0.7 }} />
        <text x={330} y={120} fontSize={7} fill={C.large}>large: 340M params (3.1x)</text>
        <motion.rect x={330} y={126} width={120} height={8} rx={2}
          fill={C.large} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          style={{ transformOrigin: '330px center' }}
          transition={{ ...sp, delay: 0.8 }} />
      </motion.g>
    </g>
  );
}

export function Step1() {
  const embeddings = [
    { name: 'Token Emb', size: '30,522 x 768', color: C.base, y: 34 },
    { name: 'Position Emb', size: '512 x 768', color: C.large, y: 64 },
    { name: 'Segment Emb', size: '2 x 768', color: C.emb, y: 94 },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.emb}>3종 임베딩 합산</text>
      {embeddings.map((e, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.15 }}>
          <rect x={20} y={e.y} width={160} height={24} rx={4}
            fill={`${e.color}12`} stroke={e.color} strokeWidth={1} />
          <text x={30} y={e.y + 15} fontSize={8} fontWeight={600} fill={e.color}>{e.name}</text>
          <text x={170} y={e.y + 15} textAnchor="end" fontSize={7} fontFamily={MF} fill={e.color}>{e.size}</text>
        </motion.g>
      ))}
      {/* Plus signs */}
      {[54, 84].map((y, i) => (
        <text key={i} x={100} y={y + 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.muted}>+</text>
      ))}
      {/* Arrow to sum */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={190} y1={75} x2={220} y2={75} stroke={C.enc} strokeWidth={1.2} />
        <polygon points="218,71 226,75 218,79" fill={C.enc} />
      </motion.g>
      {/* Result */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={230} y={55} width={130} height={40} rx={5}
          fill={`${C.enc}12`} stroke={C.enc} strokeWidth={1.2} />
        <text x={295} y={72} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>Input Vector</text>
        <text x={295} y={86} textAnchor="middle" fontSize={7} fontFamily={MF} fill={C.muted}>(seq_len, 768)</text>
      </motion.g>
      {/* Note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={230} y={108} width={230} height={40} rx={4}
          fill={`${C.emb}06`} stroke={C.emb} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={240} y={122} fontSize={7} fill={C.emb}>왜 학습 가능 Position?</text>
        <text x={240} y={134} fontSize={7} fill={C.muted}>sinusoidal은 고정 패턴</text>
        <text x={240} y={144} fontSize={7} fill={C.muted}>BERT는 데이터에서 최적 위치 표현 학습</text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const blocks = [
    { label: 'Multi-Head\nSelf-Attention', color: C.base, x: 20, w: 100 },
    { label: 'Add & Norm', color: C.enc, x: 130, w: 70 },
    { label: 'FFN\n768→3072→768', color: C.large, x: 210, w: 100 },
    { label: 'Add & Norm', color: C.enc, x: 320, w: 70 },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.enc}>Transformer Encoder Block</text>
      {/* Block flow */}
      {blocks.map((b, i) => {
        const lines = b.label.split('\n');
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={b.x} y={32} width={b.w} height={40} rx={5}
              fill={`${b.color}12`} stroke={b.color} strokeWidth={1} />
            {lines.map((l, li) => (
              <text key={li} x={b.x + b.w / 2} y={50 + li * 12} textAnchor="middle"
                fontSize={7} fontWeight={li === 0 ? 600 : 400}
                fill={li === 0 ? b.color : C.muted}>{l}</text>
            ))}
            {/* Arrows between blocks */}
            {i < blocks.length - 1 && (
              <g>
                <line x1={b.x + b.w + 2} y1={52} x2={blocks[i + 1].x - 2} y2={52}
                  stroke={C.muted} strokeWidth={0.8} />
                <polygon points={`${blocks[i + 1].x - 4},49 ${blocks[i + 1].x},52 ${blocks[i + 1].x - 4},55`}
                  fill={C.muted} />
              </g>
            )}
          </motion.g>
        );
      })}
      {/* Residual arcs */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <path d="M70,32 Q70,20 165,20 Q165,32 165,32" fill="none" stroke={C.enc} strokeWidth={0.7} strokeDasharray="2 2" />
        <text x={118} y={18} textAnchor="middle" fontSize={6} fill={C.enc}>residual</text>
        <path d="M260,32 Q260,20 355,20 Q355,32 355,32" fill="none" stroke={C.enc} strokeWidth={0.7} strokeDasharray="2 2" />
        <text x={308} y={18} textAnchor="middle" fontSize={6} fill={C.enc}>residual</text>
      </motion.g>
      {/* x12 or x24 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={400} y={32} width={60} height={40} rx={20}
          fill={`${C.base}08`} stroke={C.base} strokeWidth={1} strokeDasharray="4 2" />
        <text x={430} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.base}>x12</text>
        <text x={430} y={60} textAnchor="middle" fontSize={7} fill={C.large}>(x24)</text>
      </motion.g>
      {/* Output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={20} y={90} width={440} height={34} rx={4}
          fill={`${C.enc}06`} stroke={C.enc} strokeWidth={0.5} />
        <text x={30} y={104} fontSize={7} fontWeight={600} fill={C.enc}>출력</text>
        <text x={70} y={104} fontSize={7} fill={C.muted}>
          각 토큰 위치마다 768차원 contextualized embedding
        </text>
        <text x={30} y={118} fontSize={7} fill={C.muted}>
          Attention: 양방향 (마스킹 없음) | FFN: GELU 활성함수 | Residual: 기울기 소실 방지
        </text>
      </motion.g>
      {/* Layer count */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={20} y={130} width={200} height={22} rx={3}
          fill={`${C.emb}08`} stroke={C.emb} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={30} y={144} fontSize={7} fill={C.emb}>블록당 파라미터: ~7.1M (attention + FFN)</text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.base}>사전학습 + 파인튜닝 패러다임</text>
      {/* Old way */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={140} height={48} rx={4}
          fill={`${C.muted}08`} stroke={C.muted} strokeWidth={0.8} />
        <text x={90} y={42} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.muted}>기존 (2017 이전)</text>
        <text x={30} y={54} fontSize={7} fill={C.muted}>태스크별 전용 설계</text>
        <text x={30} y={66} fontSize={7} fill={C.muted}>소규모 데이터 + 제로부터</text>
      </motion.g>
      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={168} y1={52} x2={195} y2={52} stroke={C.base} strokeWidth={1} />
        <polygon points="193,48 200,52 193,56" fill={C.base} />
      </motion.g>
      {/* BERT way */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={200} y={28} width={260} height={48} rx={4}
          fill={`${C.base}10`} stroke={C.base} strokeWidth={1} />
        <text x={330} y={42} textAnchor="middle" fontSize={7} fontWeight={600} fill={C.base}>BERT 방식</text>
        <text x={210} y={56} fontSize={7} fontFamily={MF} fill={C.base}>
          사전학습(3.3B words) → 헤드 추가 → 파인튜닝
        </text>
        <text x={210} y={68} fontSize={7} fill={C.muted}>태스크 독립적 표현 학습 → 하나의 모델로 11개 SOTA</text>
      </motion.g>
      {/* Bidirectionality comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={86} width={440} height={36} rx={4}
          fill={`${C.base}06`} stroke={C.base} strokeWidth={0.5} />
        <text x={30} y={100} fontSize={7} fontWeight={600} fill={C.emb}>ELMo</text>
        <text x={70} y={100} fontSize={7} fill={C.muted}>좌→우 + 우→좌 LSTM concat</text>
        <text x={220} y={100} fontSize={7} fontWeight={600} fill={C.large}>GPT</text>
        <text x={250} y={100} fontSize={7} fill={C.muted}>좌→우만 (decoder)</text>
        <text x={30} y={114} fontSize={7} fontWeight={600} fill={C.base}>BERT</text>
        <text x={70} y={114} fontSize={7} fill={C.base}>완전 양방향 (MLM) — 모든 토큰이 모든 토큰 참조</text>
      </motion.g>
      {/* GLUE result */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={20} y={130} width={200} height={24} rx={4}
          fill={`${C.base}12`} stroke={C.base} strokeWidth={1} />
        <text x={30} y={146} fontSize={8} fontWeight={600} fill={C.base}>GLUE: 68.9 → 80.5 (+11.6)</text>
        <rect x={240} y={130} width={220} height={24} rx={4}
          fill={`${C.enc}08`} stroke={C.enc} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={250} y={146} fontSize={7} fill={C.enc}>
          파생: RoBERTa, ALBERT, ELECTRA, DeBERTa ...
        </text>
      </motion.g>
    </g>
  );
}
