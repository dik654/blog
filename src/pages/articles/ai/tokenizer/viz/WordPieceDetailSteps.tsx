import { motion } from 'framer-motion';
import { C } from './WordPieceDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

/* ── Score Comparison Steps ── */

export function ScoreStep0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.bpe}>BPE: 빈도 기준</text>
      {/* Formula */}
      <rect x={20} y={24} width={200} height={24} rx={4}
        fill={`${C.bpe}10`} stroke={C.bpe} strokeWidth={1} />
      <text x={120} y={40} textAnchor="middle" fontSize={10} fontWeight={600}
        fontFamily={MF} fill={C.bpe}>score(a,b) = freq(ab)</text>
      {/* Examples */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <text x={30} y={68} fontSize={8} fontFamily={MF} fill={C.muted}>
          "the"=10000  "of"=5000  "the of"=500
        </text>
        <rect x={30} y={74} width={120} height={20} rx={3}
          fill={`${C.bpe}08`} stroke={C.bpe} strokeWidth={0.8} />
        <text x={90} y={88} textAnchor="middle" fontSize={9} fontWeight={700}
          fontFamily={MF} fill={C.bpe}>score = 500</text>
        <text x={160} y={88} fontSize={8} fill={C.bpe} fontWeight={600}>
          ← 우선 병합
        </text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={30} y={112} fontSize={8} fontFamily={MF} fill={C.muted}>
          "Hello"=100  "World"=100  "HelloWorld"=80
        </text>
        <rect x={30} y={118} width={120} height={20} rx={3}
          fill={`${C.bpe}08`} stroke={C.bpe} strokeWidth={0.8} />
        <text x={90} y={132} textAnchor="middle" fontSize={9} fontWeight={700}
          fontFamily={MF} fill={C.bpe}>score = 80</text>
        <text x={160} y={132} fontSize={8} fill={C.muted}>후순위</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={280} y={90} fontSize={8} fill="#ef4444" fontWeight={600}>
          흔하지만 의미 없는 "the of" 우선
        </text>
      </motion.g>
    </g>
  );
}

export function ScoreStep1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.wp}>WordPiece: 우도 비율</text>
      {/* Formula */}
      <rect x={20} y={24} width={300} height={24} rx={4}
        fill={`${C.wp}10`} stroke={C.wp} strokeWidth={1} />
      <text x={170} y={40} textAnchor="middle" fontSize={10} fontWeight={600}
        fontFamily={MF} fill={C.wp}>score(a,b) = freq(ab) / (freq(a)*freq(b))</text>
      {/* PMI connection */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={340} y={24} width={120} height={24} rx={4}
          fill={`${C.pmi}10`} stroke={C.pmi} strokeWidth={1}
          strokeDasharray="3 2" />
        <text x={400} y={40} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.pmi}>= PMI 구조</text>
      </motion.g>
      {/* Explanation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <text x={30} y={68} fontSize={8} fill={C.muted}>
          분자: 함께 등장 빈도 | 분모: 개별 빈도의 곱
        </text>
        <text x={30} y={82} fontSize={8} fill={C.wp}>
          독립이면 score ~= 1/N (낮음) | 함께 자주 나오면 score 높음
        </text>
      </motion.g>
      {/* Visual: PMI interpretation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={30} y={94} width={100} height={50} rx={5}
          fill={`${C.pmi}08`} stroke={C.pmi} strokeWidth={0.8} />
        <text x={80} y={110} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.pmi}>log P(a,b)</text>
        <text x={80} y={124} textAnchor="middle" fontSize={7} fill={C.muted}>
          /(P(a)*P(b))
        </text>
        <text x={155} y={116} fontSize={8} fill={C.muted}>=</text>
        <rect x={175} y={100} width={60} height={20} rx={3}
          fill={`${C.wp}10`} stroke={C.wp} strokeWidth={0.8} />
        <text x={205} y={114} textAnchor="middle" fontSize={8} fill={C.wp}>= 0</text>
        <text x={245} y={114} fontSize={7} fill={C.muted}>독립</text>
        <rect x={280} y={100} width={60} height={20} rx={3}
          fill={`${C.wp}10`} stroke={C.wp} strokeWidth={0.8} />
        <text x={310} y={114} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={C.wp}>{'>'}0</text>
        <text x={350} y={114} fontSize={7} fill={C.wp} fontWeight={600}>
          정보 이득
        </text>
      </motion.g>
    </g>
  );
}

export function ScoreStep2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.pmi}>수치 비교: 800배 차이</text>
      {/* Table */}
      <text x={30} y={36} fontSize={8} fontWeight={600} fill={C.muted}>쌍</text>
      <text x={180} y={36} fontSize={8} fontWeight={600} fill={C.bpe}>BPE</text>
      <text x={270} y={36} fontSize={8} fontWeight={600} fill={C.wp}>WordPiece</text>
      <text x={380} y={36} fontSize={8} fontWeight={600} fill={C.muted}>결과</text>
      <line x1={20} y1={40} x2={460} y2={40} stroke="var(--border)" strokeWidth={0.5} />
      {/* Row 1: the+of */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <text x={30} y={58} fontSize={9} fontFamily={MF} fill={C.muted}>"the"+"of"</text>
        <rect x={170} y={44} width={70} height={20} rx={3}
          fill={`${C.bpe}12`} stroke={C.bpe} strokeWidth={1} />
        <text x={205} y={58} textAnchor="middle" fontSize={9} fontWeight={700}
          fontFamily={MF} fill={C.bpe}>500</text>
        <rect x={260} y={44} width={80} height={20} rx={3}
          fill={`${C.wp}08`} stroke={C.wp} strokeWidth={0.8} />
        <text x={300} y={58} textAnchor="middle" fontSize={9}
          fontFamily={MF} fill={C.wp}>1e-5</text>
        <text x={380} y={58} fontSize={8} fill={C.bpe}>BPE 우선</text>
      </motion.g>
      {/* Row 2: Hello+World */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <text x={30} y={88} fontSize={9} fontFamily={MF} fill={C.muted}>"Hello"+"World"</text>
        <rect x={170} y={74} width={70} height={20} rx={3}
          fill={`${C.bpe}08`} stroke={C.bpe} strokeWidth={0.8} />
        <text x={205} y={88} textAnchor="middle" fontSize={9}
          fontFamily={MF} fill={C.bpe}>80</text>
        <rect x={260} y={74} width={80} height={20} rx={3}
          fill={`${C.wp}12`} stroke={C.wp} strokeWidth={1} />
        <text x={300} y={88} textAnchor="middle" fontSize={9} fontWeight={700}
          fontFamily={MF} fill={C.wp}>8e-3</text>
        <text x={380} y={88} fontSize={8} fill={C.wp} fontWeight={600}>WP 우선</text>
      </motion.g>
      {/* Insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={30} y={108} width={420} height={30} rx={5}
          fill={`${C.wp}08`} stroke={C.wp} strokeWidth={1} />
        <text x={240} y={120} textAnchor="middle" fontSize={8} fontWeight={600}
          fill={C.wp}>
          8e-3 / 1e-5 = 800배. "Hello World"의 정보 밀도가 압도적으로 높음
        </text>
        <text x={240} y={133} textAnchor="middle" fontSize={8} fill={C.muted}>
          WordPiece = 의미 단위 토큰 우선 형성 → BERT의 의미 이해에 유리
        </text>
      </motion.g>
    </g>
  );
}

/* ── Hash Prefix Steps ── */

export function HashStep0() {
  const tokens1 = [
    { t: 'un', hash: false },
    { t: '##happy', hash: true },
    { t: '##ness', hash: true },
  ];
  const tokens2 = [
    { t: 'transform', hash: false },
    { t: '##er', hash: true },
  ];
  const gap = 10;
  const t1Widths = tokens1.map(tk => Math.max(tk.t.length * 8, 30));
  const t1Offsets = t1Widths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 130 : acc[i - 1] + t1Widths[i - 1] + gap);
    return acc;
  }, []);
  const t2Widths = tokens2.map(tk => Math.max(tk.t.length * 8, 30));
  const t2Offsets = t2Widths.reduce<number[]>((acc, tw, i) => {
    acc.push(i === 0 ? 130 : acc[i - 1] + t2Widths[i - 1] + gap);
    return acc;
  }, []);
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.hash}>## 접두사: 단어 경계 표시</text>
      {/* Word 1 */}
      <text x={20} y={36} fontSize={8} fill={C.muted}>"unhappiness":</text>
      {tokens1.map((tk, i) => {
        const tw = t1Widths[i];
        const x = t1Offsets[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={x} y={24} width={tw} height={22} rx={3}
              fill={tk.hash ? `${C.hash}12` : `${C.wp}12`}
              stroke={tk.hash ? C.hash : C.wp} strokeWidth={1} />
            <text x={x + tw / 2} y={39} textAnchor="middle" fontSize={8}
              fontFamily={MF} fontWeight={600}
              fill={tk.hash ? C.hash : C.wp}>{tk.t}</text>
          </motion.g>
        );
      })}
      {/* Word 2 */}
      <text x={20} y={68} fontSize={8} fill={C.muted}>"transformer":</text>
      {tokens2.map((tk, i) => {
        const tw = t2Widths[i];
        const x = t2Offsets[i];
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
            <rect x={x} y={56} width={tw} height={22} rx={3}
              fill={tk.hash ? `${C.hash}12` : `${C.wp}12`}
              stroke={tk.hash ? C.hash : C.wp} strokeWidth={1} />
            <text x={x + tw / 2} y={71} textAnchor="middle" fontSize={8}
              fontFamily={MF} fontWeight={600}
              fill={tk.hash ? C.hash : C.wp}>{tk.t}</text>
          </motion.g>
        );
      })}
      {/* Legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={90} width={12} height={12} rx={2}
          fill={`${C.wp}12`} stroke={C.wp} strokeWidth={0.8} />
        <text x={38} y={100} fontSize={8} fill={C.wp}>단어 시작 (접두사 없음)</text>
        <rect x={180} y={90} width={12} height={12} rx={2}
          fill={`${C.hash}12`} stroke={C.hash} strokeWidth={0.8} />
        <text x={198} y={100} fontSize={8} fill={C.hash}>단어 내부 (## 접두사)</text>
      </motion.g>
      {/* BPE comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={20} y={125} fontSize={8} fill={C.muted}>
          BPE: "low{'</w>'}" -- 단어 끝 표시 | WordPiece: "##low" -- 단어 내부 표시
        </text>
        <text x={20} y={139} fontSize={8} fill={C.hash}>
          방향은 반대이나 정보는 동일 -- 디코딩 시 단어 복원 가능
        </text>
      </motion.g>
    </g>
  );
}

export function HashStep1() {
  const tokens = ['un', '##happy', '##ness', 'transform', '##er'];
  const results = ['un', 'happy', 'ness', ' transform', 'er'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.hash}>디코딩: ## 제거로 원문 복원</text>
      {/* Token → decode flow */}
      {tokens.map((t, i) => {
        const y = 26 + i * 21;
        const isHash = t.startsWith('##');
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            {/* Token */}
            <rect x={20} y={y} width={80} height={16} rx={3}
              fill={isHash ? `${C.hash}10` : `${C.wp}10`}
              stroke={isHash ? C.hash : C.wp} strokeWidth={0.8} />
            <text x={60} y={y + 11} textAnchor="middle" fontSize={8}
              fontFamily={MF} fill={isHash ? C.hash : C.wp}>{t}</text>
            {/* Arrow */}
            <line x1={100} y1={y + 8} x2={140} y2={y + 8}
              stroke={C.muted} strokeWidth={0.5} />
            {/* Rule */}
            <text x={150} y={y + 11} fontSize={7} fill={C.muted}>
              {isHash ? '## 제거, 직접 붙임' : '공백 + 토큰'}
            </text>
            {/* Result */}
            <rect x={290} y={y} width={70} height={16} rx={3}
              fill={`${C.wp}08`} stroke={C.wp} strokeWidth={0.5} />
            <text x={325} y={y + 11} textAnchor="middle" fontSize={8}
              fontFamily={MF} fill={C.wp}>{results[i]}</text>
          </motion.g>
        );
      })}
      {/* Final result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={136} width={290} height={20} rx={4}
          fill={`${C.wp}12`} stroke={C.wp} strokeWidth={1.2} />
        <text x={30} y={150} fontSize={8} fill={C.muted}>결과:</text>
        <text x={70} y={150} fontSize={8} fontWeight={600}
          fontFamily={MF} fill={C.wp}>"unhappiness transformer"</text>
      </motion.g>
    </g>
  );
}

export function HashStep2() {
  const models = [
    { name: 'bert-base-uncased', size: '30K', barW: 30, color: C.bert },
    { name: 'bert-multilingual', size: '119K', barW: 119, color: C.wp },
    { name: 'KoBERT', size: '8K', barW: 8, color: C.hash },
  ];
  const derived = [
    { name: 'DistilBERT', tok: 'WordPiece', color: C.bert },
    { name: 'ALBERT', tok: 'WordPiece', color: C.bert },
    { name: 'ELECTRA', tok: 'WordPiece', color: C.bert },
    { name: 'RoBERTa', tok: 'byte-level BPE', color: '#ef4444' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.bert}>BERT 어휘 크기</text>
      {models.map((m, i) => {
        const y = 26 + i * 26;
        const barW = (m.barW / 120) * 180;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.1 }}>
            <text x={20} y={y + 12} fontSize={8} fontWeight={600} fill={m.color}>
              {m.name}
            </text>
            <motion.rect x={150} y={y} width={barW} height={18} rx={3}
              fill={`${m.color}15`} stroke={m.color} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '150px center' }}
              transition={{ ...sp, delay: 0.15 + i * 0.1 }} />
            <text x={155 + barW} y={y + 12} fontSize={8} fontWeight={600}
              fill={m.color}>{m.size}</text>
          </motion.g>
        );
      })}
      {/* Derived models */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={110} fontSize={8} fontWeight={600} fill={C.muted}>파생 모델:</text>
        {derived.map((d, i) => (
          <g key={i}>
            <rect x={20 + i * 110} y={116} width={100} height={18} rx={3}
              fill={`${d.color}08`} stroke={d.color} strokeWidth={0.8} />
            <text x={70 + i * 110} y={128} textAnchor="middle" fontSize={7}
              fill={d.color}>{d.name}: {d.tok}</text>
          </g>
        ))}
      </motion.g>
      <text x={20} y={150} fontSize={8} fill="#ef4444">
        RoBERTa가 byte-level BPE로 전환 -- GPT 방식이 확산되는 신호
      </text>
    </g>
  );
}
