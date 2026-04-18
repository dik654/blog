import { motion } from 'framer-motion';
import { C } from './SentencePieceDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

/* ── Unigram Training Steps ── */

export function UnigramStep0() {
  const candidates = ['i', 'in', 'int', 'inter', 'nation', 'ization'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.em}>
        Step 1: 초기 어휘 (100만+ 후보)
      </text>
      {/* Big initial set */}
      <rect x={20} y={24} width={200} height={76} rx={6}
        fill={`${C.em}08`} stroke={C.em} strokeWidth={1.2}
        strokeDasharray="4 2" />
      <text x={120} y={38} textAnchor="middle" fontSize={8} fontWeight={600}
        fill={C.em}>초기 서브워드 후보</text>
      {candidates.map((c, i) => {
        const x = 30 + (i % 3) * 64;
        const y = 44 + Math.floor(i / 3) * 18;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={x} y={y} width={54} height={14} rx={2}
              fill={`${C.em}12`} stroke={C.em} strokeWidth={0.5} />
            <text x={x + 27} y={y + 10} textAnchor="middle" fontSize={7}
              fontFamily={MF} fill={C.em}>{c}</text>
          </motion.g>
        );
      })}
      <text x={120} y={94} textAnchor="middle" fontSize={7} fill={C.muted}>... x 1,000,000+</text>
      {/* Direction comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <line x1={240} y1={54} x2={280} y2={54} stroke={C.em} strokeWidth={1} />
        <polygon points="278,50 286,54 278,58" fill={C.em} />
        <rect x={290} y={30} width={170} height={48} rx={5}
          fill={`${C.model}08`} stroke={C.model} strokeWidth={1} />
        <text x={375} y={48} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.model}>방향 비교</text>
        <text x={300} y={62} fontSize={8} fill={C.meta}>
          BPE: 작은 어휘 → 쌓아올림
        </text>
        <text x={300} y={74} fontSize={8} fill={C.prune}>
          Unigram: 큰 어휘 → 깎아내림
        </text>
      </motion.g>
      {/* Target */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={118} fontSize={8} fill={C.muted}>
          목표: 100만+ → 32K (약 97% 제거)
        </text>
      </motion.g>
    </g>
  );
}

export function UnigramStep1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.em}>
        Step 2: EM 알고리즘
      </text>
      {/* E-step */}
      <rect x={20} y={26} width={200} height={54} rx={5}
        fill={`${C.meta}08`} stroke={C.meta} strokeWidth={1} />
      <rect x={20} y={26} width={200} height={16} rx={5}
        fill={`${C.meta}15`} />
      <text x={120} y={37} textAnchor="middle" fontSize={8} fontWeight={600}
        fill={C.meta}>E-step: 최적 분할 탐색</text>
      <text x={30} y={54} fontSize={8} fontFamily={MF} fill={C.muted}>
        P(seg) = P(x1) * P(x2) * ...
      </text>
      <text x={30} y={68} fontSize={8} fill={C.meta}>
        Viterbi로 확률 최대 분할 선택
      </text>
      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={220} y1={53} x2={250} y2={53} stroke={C.em} strokeWidth={1} />
        <polygon points="248,49 256,53 248,57" fill={C.em} />
      </motion.g>
      {/* M-step */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={26} width={200} height={54} rx={5}
          fill={`${C.model}08`} stroke={C.model} strokeWidth={1} />
        <rect x={260} y={26} width={200} height={16} rx={5}
          fill={`${C.model}15`} />
        <text x={360} y={37} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.model}>M-step: 확률 재추정</text>
        <text x={270} y={54} fontSize={8} fontFamily={MF} fill={C.muted}>
          P(v) = count(v) / total
        </text>
        <text x={270} y={68} fontSize={8} fill={C.model}>
          각 토큰 출현 빈도로 갱신
        </text>
      </motion.g>
      {/* Loop arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <path d="M 360 80 C 360 108, 120 108, 120 80"
          fill="none" stroke={C.em} strokeWidth={1} strokeDasharray="4 2" />
        <polygon points="116,82 120,74 124,82" fill={C.em} />
        <rect x={200} y={98} width={80} height={14} rx={2}
          fill="var(--background)" />
        <text x={240} y={109} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.em}>수렴까지 반복</text>
      </motion.g>
    </g>
  );
}

export function UnigramStep2() {
  const tokens = [
    { name: 'inter', loss: 0.001, keep: true },
    { name: 'xyz', loss: 0.0001, keep: false },
    { name: 'nation', loss: 0.005, keep: true },
    { name: 'qq', loss: 0.00005, keep: false },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.prune}>
        Step 3: 가지치기 (Pruning)
      </text>
      {/* Table */}
      <text x={30} y={36} fontSize={8} fontWeight={600} fill={C.muted}>토큰</text>
      <text x={120} y={36} fontSize={8} fontWeight={600} fill={C.muted}>loss 증가</text>
      <text x={230} y={36} fontSize={8} fontWeight={600} fill={C.muted}>판정</text>
      <line x1={20} y1={40} x2={320} y2={40} stroke="var(--border)" strokeWidth={0.5} />
      {tokens.map((t, i) => {
        const y = 54 + i * 22;
        const color = t.keep ? C.sp : C.prune;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={25} y={y - 10} width={70} height={16} rx={3}
              fill={`${color}10`} stroke={color} strokeWidth={0.8} />
            <text x={60} y={y + 1} textAnchor="middle" fontSize={8}
              fontFamily={MF} fill={color}>{t.name}</text>
            <text x={120} y={y + 1} fontSize={8} fontFamily={MF}
              fill={color}>{t.loss}</text>
            <text x={230} y={y + 1} fontSize={8} fontWeight={600}
              fill={color}>{t.keep ? '유지' : '제거'}</text>
          </motion.g>
        );
      })}
      {/* Rule */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={340} y={30} width={130} height={60} rx={5}
          fill={`${C.prune}08`} stroke={C.prune} strokeWidth={1}
          strokeDasharray="3 2" />
        <text x={405} y={48} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.prune}>제거 기준</text>
        <text x={350} y={64} fontSize={8} fill={C.muted}>
          loss 증가 작은 것 제거
        </text>
        <text x={350} y={78} fontSize={8} fill={C.prune}>
          80% 유지, 20% 제거
        </text>
      </motion.g>
    </g>
  );
}

export function UnigramStep3() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.sp}>
        추론: Viterbi vs 샘플링
      </text>
      {/* Viterbi path */}
      <rect x={20} y={26} width={200} height={50} rx={5}
        fill={`${C.sp}08`} stroke={C.sp} strokeWidth={1} />
      <text x={120} y={40} textAnchor="middle" fontSize={8} fontWeight={600}
        fill={C.sp}>Viterbi (결정론적)</text>
      <text x={30} y={56} fontSize={8} fontFamily={MF} fill={C.muted}>
        "Hello" → ["He","llo"]
      </text>
      <text x={30} y={68} fontSize={8} fill={C.sp}>
        항상 같은 최적 분할
      </text>
      {/* Sampling */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={26} width={210} height={50} rx={5}
          fill={`${C.model}08`} stroke={C.model} strokeWidth={1} />
        <text x={355} y={40} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.model}>샘플링 (확률론적)</text>
        <text x={260} y={56} fontSize={8} fontFamily={MF} fill={C.muted}>
          "Hello" → ["He","llo"] or ["H","ell","o"]
        </text>
        <text x={260} y={68} fontSize={8} fill={C.model}>
          확률에 비례한 랜덤 분할
        </text>
      </motion.g>
      {/* Subword Regularization */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={80} y={90} width={320} height={30} rx={5}
          fill={`${C.em}08`} stroke={C.em} strokeWidth={1} />
        <text x={240} y={103} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.em}>Subword Regularization (Kudo 2018)</text>
        <text x={240} y={115} textAnchor="middle" fontSize={8} fill={C.muted}>
          훈련 시 샘플링 → 같은 단어를 다양하게 분할 → 데이터 증강 효과
        </text>
      </motion.g>
    </g>
  );
}

/* ── SentencePiece Feature Steps ── */

export function SPStep0() {
  const examples = [
    { input: '"Hello world"', output: '"▁Hello▁world"', lang: '' },
    { input: '"안녕하세요"', output: '"▁안녕하세요"', lang: '한국어' },
    { input: '"こんにちは"', output: '"▁こんにちは"', lang: '일본어' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.sp}>
        공백 → ▁ 치환: 언어 독립 처리
      </text>
      {examples.map((e, i) => {
        const y = 30 + i * 34;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            {/* Input */}
            <rect x={20} y={y} width={120} height={24} rx={4}
              fill={`${C.meta}10`} stroke={C.meta} strokeWidth={0.8} />
            <text x={80} y={y + 15} textAnchor="middle" fontSize={8}
              fontFamily={MF} fill={C.meta}>{e.input}</text>
            {/* Arrow */}
            <line x1={140} y1={y + 12} x2={170} y2={y + 12}
              stroke={C.sp} strokeWidth={1} />
            <polygon points={`168,${y+8} 176,${y+12} 168,${y+16}`}
              fill={C.sp} />
            {/* Output */}
            <rect x={180} y={y} width={160} height={24} rx={4}
              fill={`${C.sp}10`} stroke={C.sp} strokeWidth={1} />
            <text x={260} y={y + 15} textAnchor="middle" fontSize={8}
              fontFamily={MF} fontWeight={600} fill={C.sp}>{e.output}</text>
            {e.lang && (
              <text x={350} y={y + 15} fontSize={7} fill={C.muted}>{e.lang}</text>
            )}
          </motion.g>
        );
      })}
      {/* Key point */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={134} width={440} height={16} rx={2}
          fill={`${C.sp}08`} />
        <text x={240} y={146} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.sp}>
          사전 토큰화 불필요 -- 형태소 분석기 없이 어떤 언어든 동일 처리
        </text>
      </motion.g>
    </g>
  );
}

export function SPStep1() {
  const modes = [
    { mode: 'bpe', desc: 'BPE 모드', users: 'LLaMA, Mistral', color: C.meta },
    { mode: 'unigram', desc: 'Unigram (기본)', users: 'T5, ALBERT', color: C.sp },
    { mode: 'char', desc: '문자 단위', users: '특수 용도', color: C.muted },
    { mode: 'word', desc: '단어 단위', users: '특수 용도', color: C.muted },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.model}>
        4가지 알고리즘 모드
      </text>
      {modes.map((m, i) => {
        const y = 28 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={20} y={y} width={90} height={22} rx={4}
              fill={`${m.color}12`} stroke={m.color} strokeWidth={1} />
            <text x={65} y={y + 14} textAnchor="middle" fontSize={8}
              fontFamily={MF} fontWeight={600} fill={m.color}>{m.mode}</text>
            <text x={120} y={y + 14} fontSize={8} fill={C.muted}>{m.desc}</text>
            <text x={260} y={y + 14} fontSize={8} fill={m.color}>{m.users}</text>
          </motion.g>
        );
      })}
      {/* Config example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={140} width={440} height={14} rx={2}
          fill={`${C.model}08`} />
        <text x={240} y={151} textAnchor="middle" fontSize={8}
          fontFamily={MF} fill={C.model}>
          character_coverage=0.9995 (다국어는 1.0 권장)
        </text>
      </motion.g>
    </g>
  );
}

export function SPStep2() {
  const models = [
    { name: 'T5/mT5', tok: 'Unigram', size: '32K/250K', w: 125 },
    { name: 'LLaMA-2', tok: 'BPE 모드', size: '32K', w: 32 },
    { name: 'LLaMA-3', tok: 'Tiktoken', size: '128K', w: 128 },
    { name: 'Gemma', tok: 'SP', size: '256K', w: 256 },
    { name: 'Mistral', tok: 'BPE 모드', size: '32K', w: 32 },
  ];
  const maxW = 200;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.sp}>채택 모델 계보</text>
      {models.map((m, i) => {
        const y = 26 + i * 24;
        const barW = (m.w / 256) * maxW;
        const isSwitch = m.name === 'LLaMA-3';
        const color = isSwitch ? '#ef4444' : C.sp;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.1 }}>
            <text x={20} y={y + 12} fontSize={8} fontWeight={600} fill={color}>
              {m.name}
            </text>
            <text x={80} y={y + 12} fontSize={7} fill={C.muted}>{m.tok}</text>
            <motion.rect x={150} y={y} width={barW} height={18} rx={3}
              fill={`${color}15`} stroke={color} strokeWidth={0.8}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '150px center' }}
              transition={{ ...sp, delay: 0.2 + i * 0.08 }} />
            <text x={155 + barW} y={y + 12} fontSize={8} fontWeight={600}
              fill={color}>{m.size}</text>
          </motion.g>
        );
      })}
      {/* Trend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <text x={20} y={155} fontSize={8} fill="#ef4444" fontWeight={600}>
          LLaMA-3: SentencePiece → Tiktoken 전환 -- 업계 표준 수렴 신호
        </text>
      </motion.g>
    </g>
  );
}
