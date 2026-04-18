import { motion } from 'framer-motion';
import { C } from './CrossAttnDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.dec}>Q/K/V 출처 분리</text>
      {/* Decoder box */}
      <rect x={20} y={26} width={100} height={40} rx={5}
        fill={`${C.dec}10`} stroke={C.dec} strokeWidth={1.2} />
      <text x={70} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dec}>Decoder</text>
      <text x={70} y={52} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.dec}>H_dec</text>
      {/* Encoder box */}
      <rect x={20} y={80} width={100} height={40} rx={5}
        fill={`${C.enc}10`} stroke={C.enc} strokeWidth={1.2} />
      <text x={70} y={94} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}>Encoder</text>
      <text x={70} y={106} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.enc}>H_enc</text>
      {/* Q arrow from decoder */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <line x1={120} y1={46} x2={170} y2={46} stroke={C.dec} strokeWidth={1} />
        <polygon points="168,42 176,46 168,50" fill={C.dec} />
        <rect x={180} y={34} width={50} height={24} rx={4}
          fill={`${C.dec}15`} stroke={C.dec} strokeWidth={1.2} />
        <text x={205} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.dec}>Q</text>
      </motion.g>
      {/* K, V arrows from encoder */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <line x1={120} y1={92} x2={170} y2={82} stroke={C.enc} strokeWidth={1} />
        <polygon points="168,78 176,82 168,86" fill={C.enc} />
        <rect x={180} y={70} width={50} height={24} rx={4}
          fill={`${C.enc}15`} stroke={C.enc} strokeWidth={1.2} />
        <text x={205} y={86} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.enc}>K</text>

        <line x1={120} y1={106} x2={170} y2={116} stroke={C.enc} strokeWidth={1} />
        <polygon points="168,112 176,116 168,120" fill={C.enc} />
        <rect x={180} y={104} width={50} height={24} rx={4}
          fill={`${C.enc}15`} stroke={C.enc} strokeWidth={1.2} />
        <text x={205} y={120} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.enc}>V</text>
      </motion.g>
      {/* Summary */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={260} y={50} width={200} height={54} rx={5}
          fill={`${C.attn}08`} stroke={C.attn} strokeWidth={1} strokeDasharray="4 2" />
        <text x={360} y={68} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.attn}>
          Self-Attn: Q, K, V 같은 출처
        </text>
        <text x={360} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dec}>
          Cross-Attn: Q=디코더, K/V=인코더
        </text>
        <text x={360} y={96} textAnchor="middle" fontSize={8} fill={C.muted}>
          "I"의 Q ↔ "나는"의 K → 정렬
        </text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  const tgt = ['I', 'am', 'a'];
  const src = ['나는', '학생', '이다'];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.attn}>직사각형 어텐션 행렬</text>
      {/* Target labels (rows) */}
      {tgt.map((t, i) => (
        <text key={i} x={60} y={52 + i * 28} textAnchor="end" fontSize={9}
          fontWeight={600} fill={C.dec}>{t}</text>
      ))}
      {/* Source labels (cols) */}
      {src.map((s, i) => (
        <text key={i} x={90 + i * 55} y={28} textAnchor="middle" fontSize={9}
          fontWeight={600} fill={C.enc}>{s}</text>
      ))}
      {/* Attention grid */}
      {tgt.map((_, ri) =>
        src.map((_, ci) => {
          const scores = [
            [0.7, 0.2, 0.1],
            [0.1, 0.1, 0.8],
            [0.3, 0.5, 0.2],
          ];
          const v = scores[ri][ci];
          const opacity = 0.1 + v * 0.8;
          return (
            <motion.g key={`${ri}-${ci}`} initial={{ opacity: 0 }}
              animate={{ opacity: 1 }} transition={{ ...sp, delay: (ri * 3 + ci) * 0.05 }}>
              <rect x={65 + ci * 55} y={36 + ri * 28} width={50} height={24} rx={3}
                fill={C.attn} fillOpacity={opacity} stroke={C.attn} strokeWidth={0.5} />
              <text x={90 + ci * 55} y={52 + ri * 28} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#fff">{v.toFixed(1)}</text>
            </motion.g>
          );
        })
      )}
      {/* Shape annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={240} y={44} fontSize={8} fontFamily={MF} fill={C.attn}>
          shape: (T_tgt, T_src) = (3, 3)
        </text>
        <text x={240} y={58} fontSize={8} fill={C.muted}>
          Self-Attn → 항상 정사각형
        </text>
        <text x={240} y={72} fontSize={8} fill={C.dec}>
          Cross-Attn → 직사각형 가능
        </text>
        <rect x={240} y={84} width={210} height={40} rx={4}
          fill={`${C.enc}08`} stroke={C.enc} strokeWidth={0.8} />
        <text x={345} y={100} textAnchor="middle" fontSize={8} fontFamily={MF} fill={C.enc}>
          scores = Q K^T / sqrt(d_k)
        </text>
        <text x={345} y={114} textAnchor="middle" fontSize={8} fill={C.muted}>
          Bahdanau 진화 — 병렬 계산
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const layers = [
    { name: '1. Masked Self-Attn', color: C.dec, desc: '미래 토큰 차단' },
    { name: '2. Cross-Attention', color: C.enc, desc: 'H_enc 참조' },
    { name: '3. FFN', color: C.layer, desc: '토큰별 독립 변환' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.layer}>디코더 레이어 3단 구조</text>
      {/* Input */}
      <rect x={40} y={26} width={80} height={22} rx={4}
        fill={`${C.dec}10`} stroke={C.dec} strokeWidth={0.8} />
      <text x={80} y={41} textAnchor="middle" fontSize={8} fill={C.dec}>
        Layer 입력 x
      </text>
      {/* 3 sub-layers */}
      {layers.map((l, i) => {
        const y = 58 + i * 34;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.15 }}>
            {/* Connection arrow */}
            <line x1={80} y1={y - 10} x2={80} y2={y} stroke={l.color} strokeWidth={0.8} />
            <polygon points={`76,${y - 2} 80,${y + 4} 84,${y - 2}`} fill={l.color} />
            {/* Sub-layer box */}
            <rect x={20} y={y + 4} width={120} height={22} rx={4}
              fill={`${l.color}12`} stroke={l.color} strokeWidth={1} />
            <text x={80} y={y + 19} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={l.color}>{l.name}</text>
            {/* Label */}
            <text x={150} y={y + 19} fontSize={8} fill={C.muted}>{l.desc}</text>
            {/* + LN */}
            <text x={260} y={y + 19} fontSize={7} fontFamily={MF} fill={C.muted}>
              + LN + Residual
            </text>
          </motion.g>
        );
      })}
      {/* H_enc shared */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={320} y={60} width={140} height={44} rx={5}
          fill={`${C.enc}08`} stroke={C.enc} strokeWidth={1} strokeDasharray="4 2" />
        <text x={390} y={78} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>
          H_enc (인코더 출력)
        </text>
        <text x={390} y={94} textAnchor="middle" fontSize={8} fill={C.muted}>
          모든 디코더 레이어에 공유
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  const encDec = [
    { name: 'Transformer 원본', year: '2017', type: 'enc-dec' },
    { name: 'T5', year: '2019', type: 'enc-dec' },
    { name: 'BART', year: '2020', type: 'enc-dec' },
  ];
  const decOnly = [
    { name: 'GPT', year: '2018', type: 'dec-only' },
    { name: 'LLaMA', year: '2023', type: 'dec-only' },
    { name: 'Mistral', year: '2023', type: 'dec-only' },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.model}>모델별 Cross-Attention 유무</text>
      {/* Enc-Dec column */}
      <rect x={20} y={28} width={200} height={20} rx={3}
        fill={`${C.enc}15`} stroke={C.enc} strokeWidth={1} />
      <text x={120} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.enc}>
        Encoder-Decoder (Cross-Attn O)
      </text>
      {encDec.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={30} y={54 + i * 24} width={180} height={20} rx={3}
            fill={`${C.enc}08`} stroke={C.enc} strokeWidth={0.5} />
          <text x={40} y={68 + i * 24} fontSize={8} fontWeight={600} fill={C.enc}>{m.name}</text>
          <text x={200} y={68 + i * 24} textAnchor="end" fontSize={7} fill={C.muted}>{m.year}</text>
        </motion.g>
      ))}
      {/* Dec-only column */}
      <rect x={250} y={28} width={200} height={20} rx={3}
        fill={`${C.dec}15`} stroke={C.dec} strokeWidth={1} />
      <text x={350} y={42} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.dec}>
        Decoder-only (Cross-Attn X)
      </text>
      {decOnly.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: 5 }}
          animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: 0.3 + i * 0.1 }}>
          <rect x={260} y={54 + i * 24} width={180} height={20} rx={3}
            fill={`${C.dec}08`} stroke={C.dec} strokeWidth={0.5} />
          <text x={270} y={68 + i * 24} fontSize={8} fontWeight={600} fill={C.dec}>{m.name}</text>
          <text x={430} y={68 + i * 24} textAnchor="end" fontSize={7} fill={C.muted}>{m.year}</text>
        </motion.g>
      ))}
      {/* Bottom insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={80} y={130} width={320} height={18} rx={3}
          fill={`${C.model}08`} stroke={C.model} strokeWidth={0.5} />
        <text x={240} y={143} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.model}>
          Decoder-only: 프롬프트가 인코더 역할 겸임 → Self-Attn만으로 충분
        </text>
      </motion.g>
    </g>
  );
}
