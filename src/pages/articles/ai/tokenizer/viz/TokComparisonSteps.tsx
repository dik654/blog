import { motion } from 'framer-motion';
import { C } from './TokComparisonVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

/* ── Algorithm Comparison Steps ── */

export function CompareStep0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.bpe}>학습 방향 비교</text>
      {/* BPE */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={20} y={24} width={140} height={36} rx={5}
          fill={`${C.bpe}10`} stroke={C.bpe} strokeWidth={1} />
        <text x={90} y={38} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.bpe}>BPE (bottom-up)</text>
        <text x={90} y={52} textAnchor="middle" fontSize={8} fill={C.muted}>
          문자 → 조합 → 단어
        </text>
        {/* Up arrow */}
        <line x1={90} y1={64} x2={90} y2={60} stroke={C.bpe} strokeWidth={1.5} />
        {[0, 1, 2].map(i => (
          <circle key={i} cx={60 + i * 30} cy={68 + i * 2} r={3}
            fill={`${C.bpe}30`} stroke={C.bpe} strokeWidth={0.8} />
        ))}
      </motion.g>
      {/* WordPiece */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={170} y={24} width={140} height={36} rx={5}
          fill={`${C.wp}10`} stroke={C.wp} strokeWidth={1} />
        <text x={240} y={38} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.wp}>WordPiece (bottom-up)</text>
        <text x={240} y={52} textAnchor="middle" fontSize={8} fill={C.muted}>
          우도 기반 병합
        </text>
      </motion.g>
      {/* Unigram */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={320} y={24} width={140} height={36} rx={5}
          fill={`${C.uni}10`} stroke={C.uni} strokeWidth={1} />
        <text x={390} y={38} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.uni}>Unigram (top-down)</text>
        <text x={390} y={52} textAnchor="middle" fontSize={8} fill={C.muted}>
          큰 집합 → 제거
        </text>
        {/* Down arrow */}
        {[0, 1, 2].map(i => (
          <circle key={i} cx={360 + i * 30} cy={68 - i * 2} r={3}
            fill={`${C.uni}30`} stroke={C.uni} strokeWidth={0.8} />
        ))}
      </motion.g>
      {/* Comparison table */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={30} y={96} fontSize={8} fontWeight={600} fill={C.muted}>분할:</text>
        <text x={80} y={96} fontSize={8} fill={C.bpe}>greedy</text>
        <text x={220} y={96} fontSize={8} fill={C.wp}>greedy</text>
        <text x={370} y={96} fontSize={8} fill={C.uni}>Viterbi DP</text>
        <text x={30} y={112} fontSize={8} fontWeight={600} fill={C.muted}>다중 분할:</text>
        <text x={110} y={112} fontSize={8} fill={C.warn}>불가</text>
        <text x={250} y={112} fontSize={8} fill={C.warn}>불가</text>
        <text x={395} y={112} fontSize={8} fill={C.uni} fontWeight={600}>가능</text>
      </motion.g>
    </g>
  );
}

export function CompareStep1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.wp}>OOV 처리 비교</text>
      {/* BPE */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={26} width={140} height={50} rx={5}
          fill={`${C.bpe}08`} stroke={C.bpe} strokeWidth={1} />
        <text x={90} y={40} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.bpe}>BPE (byte-level)</text>
        <text x={90} y={56} textAnchor="middle" fontSize={8} fill={C.bpe}>
          바이트 분해
        </text>
        <text x={90} y={68} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.bpe}>OOV = 0</text>
      </motion.g>
      {/* WordPiece */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={170} y={26} width={140} height={50} rx={5}
          fill={`${C.wp}08`} stroke={C.wp} strokeWidth={1} />
        <text x={240} y={40} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.wp}>WordPiece</text>
        <text x={240} y={56} textAnchor="middle" fontSize={8} fill={C.wp}>
          vocab에 없으면
        </text>
        <text x={240} y={68} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.warn}>[UNK] 발생</text>
      </motion.g>
      {/* Unigram */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={320} y={26} width={140} height={50} rx={5}
          fill={`${C.uni}08`} stroke={C.uni} strokeWidth={1} />
        <text x={390} y={40} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.uni}>Unigram</text>
        <text x={390} y={56} textAnchor="middle" fontSize={8} fill={C.uni}>
          낮은 확률 분할
        </text>
        <text x={390} y={68} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.uni}>OOV 희귀</text>
      </motion.g>
      {/* Segmentation example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={96} fontSize={8} fontWeight={600} fill={C.muted}>
          "unhappy" 분할:
        </text>
        <text x={20} y={112} fontSize={8} fontFamily={MF} fill={C.bpe}>
          BPE/WP: "un"+"happy" (longest-match greedy)
        </text>
        <text x={20} y={128} fontSize={8} fontFamily={MF} fill={C.uni}>
          Unigram: 모든 가능 분할의 확률 계산 → 최대 선택
        </text>
      </motion.g>
    </g>
  );
}

export function CompareStep2() {
  const rows = [
    { model: 'GPT/RoBERTa', tok: 'BPE', trait: '빠르고 범용', color: C.bpe },
    { model: 'BERT', tok: 'WordPiece', trait: '의미 이해', color: C.wp },
    { model: 'T5/LLaMA', tok: 'Unigram', trait: '다국어', color: C.uni },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.guide}>채택 모델과 특성</text>
      {/* Table */}
      <text x={30} y={36} fontSize={8} fontWeight={600} fill={C.muted}>모델</text>
      <text x={150} y={36} fontSize={8} fontWeight={600} fill={C.muted}>토크나이저</text>
      <text x={260} y={36} fontSize={8} fontWeight={600} fill={C.muted}>강점</text>
      <line x1={20} y1={40} x2={420} y2={40} stroke="var(--border)" strokeWidth={0.5} />
      {rows.map((r, i) => {
        const y = 56 + i * 24;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={25} y={y - 10} width={100} height={18} rx={3}
              fill={`${r.color}10`} stroke={r.color} strokeWidth={0.8} />
            <text x={75} y={y + 2} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={r.color}>{r.model}</text>
            <text x={150} y={y + 2} fontSize={8} fill={r.color}>{r.tok}</text>
            <text x={260} y={y + 2} fontSize={8} fill={C.muted}>{r.trait}</text>
          </motion.g>
        );
      })}
      {/* Speed/Multilingual ranking */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={124} fontSize={8} fontWeight={600} fill={C.muted}>속도:</text>
        <text x={60} y={124} fontSize={8} fill={C.bpe}>
          BPE(Tiktoken) {'>'} Unigram {'>'} WordPiece
        </text>
        <text x={20} y={140} fontSize={8} fontWeight={600} fill={C.muted}>다국어:</text>
        <text x={60} y={140} fontSize={8} fill={C.uni}>
          Unigram(SP) {'>='} BPE(byte) {'>'} WordPiece
        </text>
      </motion.g>
    </g>
  );
}

/* ── Korean Efficiency Steps ── */

export function KoStep0() {
  const models = [
    { name: 'GPT-4', vocab: '100K', tokens: 23, color: C.warn },
    { name: 'GPT-4o', vocab: '200K', tokens: 15, color: C.bpe },
    { name: 'BERT-ml', vocab: '119K', tokens: 18, color: C.wp },
    { name: 'Gemma-2', vocab: '256K', tokens: 12, color: C.uni },
  ];
  const maxBar = 200;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.ko}>
        한국어 토큰 수 비교 (25자 문장)
      </text>
      <text x={20} y={30} fontSize={7} fill={C.muted}>
        "인공지능 모델이 한국어를 자연스럽게 처리합니다."
      </text>
      {models.map((m, i) => {
        const y = 40 + i * 26;
        const barW = (m.tokens / 25) * maxBar;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.1 }}>
            <text x={20} y={y + 14} fontSize={8} fontWeight={600} fill={m.color}>
              {m.name}
            </text>
            <text x={75} y={y + 14} fontSize={7} fill={C.muted}>{m.vocab}</text>
            <motion.rect x={120} y={y} width={barW} height={20} rx={3}
              fill={`${m.color}15`} stroke={m.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '120px center' }}
              transition={{ ...sp, delay: 0.15 + i * 0.1 }} />
            <text x={125 + barW} y={y + 14} fontSize={9} fontWeight={700}
              fill={m.color}>{m.tokens}개</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={150} fontSize={8} fill={C.ko} fontWeight={600}>
          Gemma-2(256K): GPT-4 대비 48% 토큰 절감 -- vocab 확대의 효과
        </text>
      </motion.g>
    </g>
  );
}

export function KoStep1() {
  const models = [
    { name: 'HyperCLOVA', tokens: 9, color: C.uni },
    { name: 'KoGPT', tokens: 10, color: C.wp },
    { name: 'KoBERT', tokens: 14, color: C.wp },
    { name: 'LLaMA-3', tokens: 14, color: C.bpe },
    { name: 'LLaMA-2', tokens: 21, color: C.warn },
  ];
  const maxBar = 200;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.ko}>
        한국어 특화 모델 효율
      </text>
      {models.map((m, i) => {
        const y = 30 + i * 24;
        const barW = (m.tokens / 25) * maxBar;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.1 }}>
            <text x={20} y={y + 14} fontSize={8} fontWeight={600} fill={m.color}>
              {m.name}
            </text>
            <motion.rect x={120} y={y} width={barW} height={18} rx={3}
              fill={`${m.color}15`} stroke={m.color} strokeWidth={0.8}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '120px center' }}
              transition={{ ...sp, delay: 0.15 + i * 0.08 }} />
            <text x={125 + barW} y={y + 14} fontSize={8} fontWeight={600}
              fill={m.color}>{m.tokens}개</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={155} fontSize={8} fill={C.warn}>
          LLaMA-2(32K): 한국어 vocab 부족으로 21토큰 -- HyperCLOVA 대비 2.3배
        </text>
      </motion.g>
    </g>
  );
}

/* ── Guide Steps ── */

export function GuideStep0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.guide}>
        처음부터 학습: 목표에 맞는 선택
      </text>
      {[
        { target: '다국어', tok: 'SentencePiece (Unigram)', color: C.uni },
        { target: '영어 중심', tok: 'BPE (byte-level)', color: C.bpe },
        { target: '도메인 특화', tok: '해당 코퍼스 Unigram', color: C.guide },
      ].map((r, i) => {
        const y = 28 + i * 34;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={20} y={y} width={100} height={26} rx={4}
              fill={`${r.color}10`} stroke={r.color} strokeWidth={1} />
            <text x={70} y={y + 16} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={r.color}>{r.target}</text>
            <line x1={120} y1={y + 13} x2={160} y2={y + 13}
              stroke={r.color} strokeWidth={1} />
            <polygon points={`158,${y + 9} 166,${y + 13} 158,${y + 17}`}
              fill={r.color} />
            <rect x={170} y={y} width={200} height={26} rx={4}
              fill={`${r.color}08`} stroke={r.color} strokeWidth={0.8} />
            <text x={270} y={y + 16} textAnchor="middle" fontSize={8}
              fill={r.color}>{r.tok}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={140} fontSize={8} fill={C.muted}>
          vocab_size: 32K(단일) ~ 256K(다국어) | character_coverage: 0.9995
        </text>
      </motion.g>
    </g>
  );
}

export function GuideStep1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.guide}>
        Fine-tuning: 원본 토크나이저 유지
      </text>
      {/* Warning */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={26} width={220} height={40} rx={5}
          fill="#ef444410" stroke={C.warn} strokeWidth={1.2}
          strokeDasharray="4 2" />
        <text x={130} y={42} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.warn}>토크나이저 변경 금지</text>
        <text x={130} y={56} textAnchor="middle" fontSize={8} fill={C.muted}>
          임베딩 재학습 필요 -- 성능 저하
        </text>
      </motion.g>
      {/* OK actions */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={26} width={200} height={40} rx={5}
          fill={`${C.wp}08`} stroke={C.wp} strokeWidth={1} />
        <text x={360} y={42} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.wp}>어휘 추가는 가능</text>
        <text x={360} y={56} textAnchor="middle" fontSize={8} fontFamily={MF}
          fill={C.muted}>add_tokens + resize_embeddings</text>
      </motion.g>
      {/* Metrics */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={88} fontSize={8} fontWeight={600} fill={C.guide}>평가 지표:</text>
        {[
          { metric: 'compression ratio', desc: 'chars/tokens (높을수록 좋음)', color: C.wp },
          { metric: 'fertility', desc: 'subwords/word (낮을수록 좋음)', color: C.uni },
          { metric: 'unknown ratio', desc: '[UNK] 비율 (0 근처)', color: C.warn },
        ].map((m, i) => (
          <g key={i}>
            <rect x={20} y={96 + i * 18} width={120} height={14} rx={2}
              fill={`${m.color}10`} stroke={m.color} strokeWidth={0.5} />
            <text x={80} y={107 + i * 18} textAnchor="middle" fontSize={7}
              fontFamily={MF} fill={m.color}>{m.metric}</text>
            <text x={150} y={107 + i * 18} fontSize={7} fill={C.muted}>{m.desc}</text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

export function GuideStep2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.warn}>
        API 비용: 토큰 단위 과금
      </text>
      {/* Cost comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={28} width={200} height={40} rx={5}
          fill={`${C.bpe}08`} stroke={C.bpe} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.bpe}>영어: 기본 비용</text>
        <text x={120} y={56} textAnchor="middle" fontSize={8} fill={C.muted}>
          ~4자/토큰
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={240} y={28} width={220} height={40} rx={5}
          fill="#ef444408" stroke={C.warn} strokeWidth={1} />
        <text x={350} y={42} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.warn}>한국어: 2~3배 비용</text>
        <text x={350} y={56} textAnchor="middle" fontSize={8} fill={C.muted}>
          ~1.2자/토큰 (GPT-4 기준)
        </text>
      </motion.g>
      {/* Solution */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={60} y={82} width={360} height={50} rx={6}
          fill={`${C.uni}08`} stroke={C.uni} strokeWidth={1.2} />
        <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.uni}>비용 절감 선택지</text>
        <text x={240} y={114} textAnchor="middle" fontSize={8} fill={C.muted}>
          GPT-4o (200K, ~40% 절감) | Gemma (256K, 오픈소스) | Ko-LLaMA
        </text>
        <text x={240} y={126} textAnchor="middle" fontSize={8} fill={C.uni}>
          한국어 프로젝트는 vocab 크기가 비용을 직접 결정
        </text>
      </motion.g>
    </g>
  );
}
