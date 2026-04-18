import { motion } from 'framer-motion';
import { C } from './TokOverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

/* ── Pipeline Steps ── */

export function PipeStep0() {
  return (
    <g>
      {/* Input text */}
      <rect x={10} y={20} width={90} height={40} rx={5}
        fill={`${C.norm}10`} stroke={C.norm} strokeWidth={1.2} />
      <text x={55} y={36} textAnchor="middle" fontSize={8} fill={C.muted}>입력</text>
      <text x={55} y={49} textAnchor="middle" fontSize={9} fontWeight={600}
        fontFamily={MF} fill={C.norm}>"Cafe"</text>
      {/* Arrow */}
      <motion.line x1={100} y1={40} x2={150} y2={40}
        stroke={C.norm} strokeWidth={1.2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.4 }} />
      <polygon points="148,36 156,40 148,44" fill={C.norm} />
      {/* Normalization box */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={160} y={12} width={160} height={56} rx={5}
          fill={`${C.norm}08`} stroke={C.norm} strokeWidth={1.2} />
        <rect x={160} y={12} width={160} height={18} rx={5}
          fill={`${C.norm}20`} />
        <text x={240} y={24} textAnchor="middle" fontSize={9} fontWeight={600}
          fill={C.norm}>Normalization</text>
        <text x={170} y={42} fontSize={8} fill={C.muted}>NFC 통일</text>
        <text x={170} y={54} fontSize={8} fill={C.muted}>lowercase + 악센트 제거</text>
      </motion.g>
      {/* Output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={320} y1={40} x2={360} y2={40} stroke={C.norm} strokeWidth={1} />
        <polygon points="358,36 366,40 358,44" fill={C.norm} />
        <rect x={370} y={20} width={90} height={40} rx={5}
          fill={`${C.norm}10`} stroke={C.norm} strokeWidth={1} />
        <text x={415} y={36} textAnchor="middle" fontSize={8} fill={C.muted}>결과</text>
        <text x={415} y={49} textAnchor="middle" fontSize={9} fontWeight={600}
          fontFamily={MF} fill={C.norm}>"cafe"</text>
      </motion.g>
      {/* Bottom annotation */}
      <text x={240} y={85} textAnchor="middle" fontSize={8} fill={C.muted}>
        유니코드 정규화 + 대소문자 변환으로 표면 형태 통일
      </text>
    </g>
  );
}

export function PipeStep1() {
  const words = ['The', 'cat', 'sits', '.'];
  const colors = [C.pre, C.pre, C.pre, C.pre];
  const gap = 10;
  const widths = words.map(w => Math.max(w.length * 10, 24));
  const offsets = widths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 180 : acc[i - 1] + widths[i - 1] + gap);
    return acc;
  }, []);
  return (
    <g>
      {/* Input */}
      <rect x={10} y={30} width={120} height={32} rx={5}
        fill={`${C.pre}10`} stroke={C.pre} strokeWidth={1} />
      <text x={70} y={50} textAnchor="middle" fontSize={9} fontWeight={600}
        fontFamily={MF} fill={C.pre}>"The cat sits."</text>
      {/* Arrow */}
      <line x1={130} y1={46} x2={170} y2={46} stroke={C.pre} strokeWidth={1} />
      <polygon points="168,42 176,46 168,50" fill={C.pre} />
      {/* Pre-tokenization label */}
      <text x={200} y={22} fontSize={9} fontWeight={600} fill={C.pre}>
        Pre-tokenization
      </text>
      {/* Split tokens */}
      {words.map((w, i) => {
        const tw = widths[i];
        const x = offsets[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={32} width={tw} height={28} rx={4}
              fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1} />
            <text x={x + tw / 2} y={50} textAnchor="middle" fontSize={9}
              fontWeight={600} fontFamily={MF} fill={colors[i]}>{w}</text>
          </motion.g>
        );
      })}
      {/* Method labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={10} y={95} fontSize={8} fill={C.muted}>
          방식: Whitespace / Metaspace / ByteLevel
        </text>
        <text x={10} y={108} fontSize={8} fill={C.pre}>
          공백·구두점으로 초벌 분리 -- 서브워드 분할의 입력 단위 결정
        </text>
      </motion.g>
    </g>
  );
}

export function PipeStep2() {
  const output = ['un', '##happy', '##ness'];
  const gap = 10;
  const widths = output.map(t => Math.max(t.length * 8, 28));
  const offsets = widths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 285 : acc[i - 1] + widths[i - 1] + gap);
    return acc;
  }, []);
  return (
    <g>
      {/* Input tokens */}
      <text x={20} y={18} fontSize={8} fontWeight={600} fill={C.model}>단어 입력</text>
      <rect x={20} y={24} width={100} height={28} rx={4}
        fill={`${C.model}10`} stroke={C.model} strokeWidth={1} />
      <text x={70} y={42} textAnchor="middle" fontSize={9} fontWeight={600}
        fontFamily={MF} fill={C.model}>"unhappiness"</text>
      {/* Arrow */}
      <line x1={120} y1={38} x2={155} y2={38} stroke={C.model} strokeWidth={1} />
      <polygon points="153,34 161,38 153,42" fill={C.model} />
      {/* Model box */}
      <rect x={165} y={14} width={80} height={48} rx={5}
        fill={`${C.model}08`} stroke={C.model} strokeWidth={1.2} />
      <rect x={165} y={14} width={80} height={16} rx={5}
        fill={`${C.model}20`} />
      <text x={205} y={26} textAnchor="middle" fontSize={9} fontWeight={600}
        fill={C.model}>Model</text>
      <text x={205} y={44} textAnchor="middle" fontSize={8} fill={C.muted}>
        BPE / WP / Uni
      </text>
      {/* Output subwords */}
      <line x1={245} y1={38} x2={275} y2={38} stroke={C.model} strokeWidth={1} />
      <polygon points="273,34 281,38 273,42" fill={C.model} />
      {output.map((t, i) => {
        const tw = widths[i];
        const x = offsets[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
            <rect x={x} y={24} width={tw} height={28} rx={4}
              fill={`${C.model}12`} stroke={C.model} strokeWidth={1} />
            <text x={x + tw / 2} y={42} textAnchor="middle" fontSize={9}
              fontWeight={600} fontFamily={MF} fill={C.model}>{t}</text>
          </motion.g>
        );
      })}
      {/* Bottom: three algorithms */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={85} fontSize={8} fill={C.muted}>
          BPE: 빈도 기반 병합 | WordPiece: 우도 기반 병합 | Unigram: 확률 기반 제거
        </text>
        <text x={20} y={98} fontSize={8} fill={C.model}>
          어휘집의 서브워드 단위로 매핑 -- 알고리즘이 토큰 품질을 결정
        </text>
      </motion.g>
    </g>
  );
}

export function PipeStep3() {
  const tokens = ['[CLS]', 'un', '##happy', '[SEP]', '[PAD]'];
  const ids = [101, 4895, 6783, 102, 0];
  const colors = [C.post, C.model, C.model, C.post, '#94a3b8'];
  const gap = 10;
  const widths = tokens.map(t => Math.max(t.length * 8, 36));
  const offsets = widths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 20 : acc[i - 1] + widths[i - 1] + gap);
    return acc;
  }, []);
  return (
    <g>
      {/* Tokens row */}
      <text x={20} y={18} fontSize={8} fontWeight={600} fill={C.post}>Post-processing</text>
      {tokens.map((t, i) => {
        const tw = widths[i];
        const x = offsets[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={x} y={24} width={tw} height={24} rx={4}
              fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={1} />
            <text x={x + tw / 2} y={40} textAnchor="middle" fontSize={8}
              fontWeight={600} fontFamily={MF} fill={colors[i]}>{t}</text>
            {/* Arrow down */}
            <line x1={x + tw / 2} y1={48} x2={x + tw / 2} y2={62}
              stroke={colors[i]} strokeWidth={0.8} />
            {/* ID */}
            <rect x={x + 2} y={64} width={tw - 4} height={20} rx={3}
              fill={`${C.post}08`} stroke={C.post} strokeWidth={0.8} />
            <text x={x + tw / 2} y={78} textAnchor="middle" fontSize={8}
              fontFamily={MF} fill={C.post}>{ids[i]}</text>
          </motion.g>
        );
      })}
      {/* Labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={320} y={38} fontSize={8} fill={C.post} fontWeight={600}>특수 토큰 추가</text>
        <text x={320} y={52} fontSize={8} fill={C.muted}>패딩 / 자르기</text>
        <text x={320} y={66} fontSize={8} fill={C.muted}>attention_mask 생성</text>
        <text x={20} y={105} fontSize={8} fill={C.post}>
          [CLS]·[SEP]·패딩으로 모델 입력 형식 완성
        </text>
      </motion.g>
    </g>
  );
}

/* ── Vocab / Terminology Steps ── */

export function VocabStep0() {
  const models = [
    { name: 'BERT', size: 30, color: C.vocab },
    { name: 'LLaMA', size: 32, color: C.model },
    { name: 'GPT-4', size: 100, color: C.post },
    { name: 'Gemma', size: 256, color: C.norm },
  ];
  const maxW = 260;
  return (
    <g>
      <text x={20} y={18} fontSize={9} fontWeight={600} fill={C.vocab}>
        어휘(vocab) 크기 비교 (K = x1000)
      </text>
      {models.map((m, i) => {
        const barW = (m.size / 256) * maxW;
        const y = 30 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.1 }}>
            <text x={20} y={y + 14} fontSize={8} fontWeight={600} fill={m.color}>
              {m.name}
            </text>
            <motion.rect x={75} y={y} width={barW} height={20} rx={3}
              fill={`${m.color}20`} stroke={m.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '75px center' }}
              transition={{ ...sp, delay: 0.2 + i * 0.1 }} />
            <text x={80 + barW} y={y + 14} fontSize={8} fontWeight={600}
              fill={m.color}>{m.size}K</text>
          </motion.g>
        );
      })}
      <text x={20} y={148} fontSize={8} fill={C.muted}>
        vocab 크기 = 임베딩 행렬 행 수 = softmax 출력 차원
      </text>
    </g>
  );
}

export function VocabStep1() {
  const specials = [
    { tok: '[CLS]', role: '분류 헤드', model: 'BERT', color: C.vocab },
    { tok: '[SEP]', role: '문장 구분', model: 'BERT', color: C.vocab },
    { tok: '<|eos|>', role: '생성 종료', model: 'GPT', color: C.post },
    { tok: '<s>', role: '시퀀스 시작', model: 'LLaMA', color: C.model },
    { tok: '[PAD]', role: '길이 패딩', model: '공통', color: '#94a3b8' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.post}>
        특수 토큰 -- 모델 형식의 핵심
      </text>
      {/* Table header */}
      <text x={20} y={34} fontSize={8} fontWeight={600} fill={C.muted}>토큰</text>
      <text x={110} y={34} fontSize={8} fontWeight={600} fill={C.muted}>역할</text>
      <text x={220} y={34} fontSize={8} fontWeight={600} fill={C.muted}>모델</text>
      <line x1={20} y1={38} x2={290} y2={38} stroke="var(--border)" strokeWidth={0.5} />
      {specials.map((s, i) => {
        const y = 50 + i * 20;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={15} y={y - 10} width={80} height={16} rx={3}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={0.8} />
            <text x={55} y={y + 1} textAnchor="middle" fontSize={8}
              fontFamily={MF} fontWeight={600} fill={s.color}>{s.tok}</text>
            <text x={110} y={y + 1} fontSize={8} fill={C.muted}>{s.role}</text>
            <text x={220} y={y + 1} fontSize={8} fill={s.color}>{s.model}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export function VocabStep2() {
  const rows = [
    { lang: '영어 GPT-4', ratio: 4.0, barW: 200, color: C.model },
    { lang: '한국어 GPT-4', ratio: 1.2, barW: 60, color: '#ef4444' },
    { lang: '한국어 LLaMA-ko', ratio: 3.5, barW: 175, color: C.vocab },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.vocab}>
        Compression Ratio (문자 수 / 토큰 수)
      </text>
      <text x={20} y={30} fontSize={8} fill={C.muted}>
        높을수록 효율적 -- 같은 텍스트를 적은 토큰으로 표현
      </text>
      {rows.map((r, i) => {
        const y = 46 + i * 32;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.15 }}>
            <text x={20} y={y + 14} fontSize={8} fontWeight={600} fill={r.color}>
              {r.lang}
            </text>
            <motion.rect x={140} y={y} width={r.barW} height={20} rx={3}
              fill={`${r.color}20`} stroke={r.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '140px center' }}
              transition={{ ...sp, delay: 0.2 + i * 0.12 }} />
            <text x={145 + r.barW} y={y + 14} fontSize={9} fontWeight={700}
              fill={r.color}>{r.ratio}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={148} fontSize={8} fill="#ef4444" fontWeight={600}>
          한국어 GPT-4: 1.2자/토큰 -- 영어 대비 3.3배 비효율
        </text>
      </motion.g>
    </g>
  );
}
