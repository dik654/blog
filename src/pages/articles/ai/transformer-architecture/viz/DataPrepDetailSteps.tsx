import { motion } from 'framer-motion';
import { C } from './DataPrepDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  const pipeline = [
    { label: '코퍼스 수집', desc: '텍스트 데이터', color: C.tok },
    { label: '토큰화', desc: 'BPE/WordPiece', color: C.enc },
    { label: '빈도 계산', desc: 'freq 카운트', color: C.vocab },
    { label: '어휘 구축', desc: '상위 N개 선택', color: C.model },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.tok}>텍스트 수집 + 토큰화</text>
      {pipeline.map((p, i) => {
        const x = 20 + i * 112;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <rect x={x} y={28} width={100} height={36} rx={4}
              fill={`${p.color}10`} stroke={p.color} strokeWidth={1} />
            <text x={x + 50} y={44} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={p.color}>{p.label}</text>
            <text x={x + 50} y={58} textAnchor="middle" fontSize={7} fill={C.muted}>
              {p.desc}
            </text>
            {i < pipeline.length - 1 && (
              <g>
                <line x1={x + 100} y1={46} x2={x + 112} y2={46}
                  stroke={C.muted} strokeWidth={0.8} />
                <polygon points={`${x + 110},43 ${x + 116},46 ${x + 110},49`}
                  fill={C.muted} />
              </g>
            )}
          </motion.g>
        );
      })}
      {/* Example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={86} fontSize={8} fontFamily={MF} fill={C.tok}>
          "나는 학생이다" → ["나는", "학생이다"]
        </text>
        <text x={20} y={100} fontSize={8} fontFamily={MF} fill={C.enc}>
          서브워드: BPE, WordPiece, SentencePiece
        </text>
        <rect x={20} y={110} width={200} height={30} rx={4}
          fill={`${C.vocab}08`} stroke={C.vocab} strokeWidth={0.8} />
        <text x={30} y={126} fontSize={8} fontFamily={MF} fill={C.vocab}>
          freq: {`{"나는": 150, "이다": 100}`}
        </text>
        <text x={30} y={138} fontSize={7} fill={C.muted}>상위 N개 → vocab 구축</text>
      </motion.g>
      {/* Size insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.7 }}>
        <rect x={260} y={86} width={200} height={40} rx={5}
          fill={`${C.model}08`} stroke={C.model} strokeWidth={0.8} strokeDasharray="4 2" />
        <text x={360} y={102} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.model}>
          어휘 크기 = 임베딩 테이블 크기
        </text>
        <text x={360} y={118} textAnchor="middle" fontSize={8} fill={C.muted}>
          vocab x d_model = 파라미터 수
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const tokens = [
    { name: 'PAD', id: 0, desc: '패딩 (길이 통일)', color: C.muted },
    { name: 'UNK', id: 1, desc: '미등록 단어 대체', color: C.spec },
    { name: 'SOS', id: 2, desc: '시퀀스 시작', color: C.enc },
    { name: 'EOS', id: 3, desc: '시퀀스 종료', color: C.vocab },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.spec}>특수 토큰</text>
      {tokens.map((t, i) => {
        const y = 30 + i * 26;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={20} y={y} width={50} height={20} rx={3}
              fill={`${t.color}15`} stroke={t.color} strokeWidth={1} />
            <text x={45} y={y + 14} textAnchor="middle" fontSize={8}
              fontWeight={700} fontFamily={MF} fill={t.color}>{t.name}</text>
            <text x={80} y={y + 14} fontSize={8} fontFamily={MF} fill={C.muted}>
              ID={t.id}
            </text>
            <text x={130} y={y + 14} fontSize={8} fill={C.muted}>{t.desc}</text>
          </motion.g>
        );
      })}
      {/* Encoding example */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={260} y={30} width={200} height={70} rx={5}
          fill={`${C.enc}08`} stroke={C.enc} strokeWidth={1} />
        <text x={360} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>
          인코딩 예시
        </text>
        <text x={270} y={64} fontSize={8} fontFamily={MF} fill={C.tok}>
          "나는 학생이다"
        </text>
        <text x={270} y={78} fontSize={8} fontFamily={MF} fill={C.enc}>
          → ids: [2, 4, 5, 3]
        </text>
        <text x={270} y={92} fontSize={7} fill={C.muted}>
          SOS + 나는 + 학생이다 + EOS
        </text>
      </motion.g>
      {/* Warning */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={60} y={120} width={360} height={18} rx={3}
          fill={`${C.spec}08`} />
        <text x={240} y={133} textAnchor="middle" fontSize={8} fill={C.spec}>
          특수 토큰 없이는 모델이 시퀀스 시작/끝을 인식 불가
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.enc}>토큰 ↔ ID 양방향 매핑</text>
      {/* word2idx */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={30} width={190} height={50} rx={5}
          fill={`${C.tok}10`} stroke={C.tok} strokeWidth={1} />
        <text x={30} y={46} fontSize={8} fontWeight={600} fill={C.tok}>word2idx</text>
        <text x={30} y={60} fontSize={8} fontFamily={MF} fill={C.muted}>
          {`"나는": 4, "학생": 5`}
        </text>
        <text x={30} y={74} fontSize={7} fill={C.tok}>인코딩: 문장 → ID</text>
      </motion.g>
      {/* Bidirectional arrows */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={220} y1={48} x2={260} y2={48} stroke={C.enc} strokeWidth={1} />
        <polygon points="258,44 266,48 258,52" fill={C.enc} />
        <line x1={260} y1={62} x2={220} y2={62} stroke={C.vocab} strokeWidth={1} />
        <polygon points="222,58 214,62 222,66" fill={C.vocab} />
      </motion.g>
      {/* idx2word */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={270} y={30} width={190} height={50} rx={5}
          fill={`${C.vocab}10`} stroke={C.vocab} strokeWidth={1} />
        <text x={280} y={46} fontSize={8} fontWeight={600} fill={C.vocab}>idx2word</text>
        <text x={280} y={60} fontSize={8} fontFamily={MF} fill={C.muted}>
          {`4: "나는", 5: "학생"`}
        </text>
        <text x={280} y={74} fontSize={7} fill={C.vocab}>디코딩: ID → 문장</text>
      </motion.g>
      {/* Full pipeline */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={40} y={96} width={400} height={22} rx={4}
          fill={`${C.model}08`} stroke={C.model} strokeWidth={0.8} />
        <text x={240} y={111} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.model}>
          텍스트 → 토큰 → ID → 임베딩 → 모델 → ID → 토큰 → 텍스트
        </text>
      </motion.g>
      {/* Inference note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <text x={80} y={138} fontSize={8} fill={C.muted}>
          추론 시 모델 출력(ID) → idx2word로 텍스트 복원
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const models = [
    { name: 'BERT', vocab: '30,522', method: 'WordPiece', w: 76 },
    { name: 'GPT-2', vocab: '50,257', method: 'BPE', w: 126 },
    { name: 'LLaMA', vocab: '32,000', method: 'SentencePiece', w: 80 },
    { name: 'GPT-4', vocab: '100,277', method: 'tiktoken', w: 250 },
    { name: 'Gemma', vocab: '256,000', method: '다국어', w: 460 },
  ];
  const maxW = 256000;
  const barScale = 300;
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.model}>실무 Vocabulary 크기 비교</text>
      {models.map((m, i) => {
        const y = 28 + i * 24;
        const barW = (m.w / 460) * barScale;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.1 }}>
            <text x={20} y={y + 14} fontSize={8} fontWeight={600} fill={C.model}>{m.name}</text>
            <motion.rect x={70} y={y} width={barW} height={18} rx={3}
              fill={`${C.model}15`} stroke={C.model} strokeWidth={0.8}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '70px center' }}
              transition={{ ...sp, delay: 0.1 + i * 0.08 }} />
            <text x={75 + barW} y={y + 14} fontSize={7} fontWeight={600}
              fontFamily={MF} fill={C.model}>{m.vocab}</text>
            <text x={75 + barW + 55} y={y + 14} fontSize={7} fill={C.muted}>
              {m.method}
            </text>
          </motion.g>
        );
      })}
      {/* Insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={40} y={152} width={400} height={0} rx={0} />
      </motion.g>
    </g>
  );
}
