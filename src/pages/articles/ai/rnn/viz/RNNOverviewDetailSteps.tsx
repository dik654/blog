import { motion } from 'framer-motion';
import { FC_C, CNN_C, RNN_C, LSTM_C } from './RNNOverviewDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① FC vs CNN vs RNN 구조 비교 */
export function Step0() {
  const models = [
    { label: 'FC', color: FC_C, x: 20, desc: '고정 입력' },
    { label: 'CNN', color: CNN_C, x: 170, desc: '지역 패턴' },
    { label: 'RNN', color: RNN_C, x: 320, desc: '순서 보존' },
  ];
  return (
    <g>
      {models.map((m, i) => (
        <motion.g key={m.label} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
          {/* Model box */}
          <rect x={m.x} y={10} width={140} height={36} rx={7}
            fill={m.color + '15'} stroke={m.color} strokeWidth={1.5} />
          <text x={m.x + 70} y={33} textAnchor="middle" fontSize={12}
            fill={m.color} fontWeight={700}>{m.label}</text>
          {/* Description */}
          <text x={m.x + 70} y={60} textAnchor="middle" fontSize={9} fill={m.color}>
            {m.desc}
          </text>
        </motion.g>
      ))}
      {/* Input comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {/* FC: fixed slots */}
        {[0, 1, 2].map(j => (
          <rect key={j} x={35 + j * 40} y={75} width={32} height={18} rx={4}
            fill={FC_C + '12'} stroke={FC_C} strokeWidth={0.8} />
        ))}
        <rect x={35 + 3 * 40} y={75} width={32} height={18} rx={4}
          fill={FC_C + '08'} stroke={FC_C} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={90} y={108} textAnchor="middle" fontSize={8} fill={FC_C}>
          ??? 4번째 슬롯 없음
        </text>
        {/* CNN: local filters */}
        {[0, 1, 2, 3].map(j => (
          <g key={j}>
            <rect x={180 + j * 30} y={75} width={24} height={18} rx={4}
              fill={CNN_C + '12'} stroke={CNN_C} strokeWidth={0.8} />
            {j < 3 && (
              <rect x={180 + j * 30} y={95} width={54} height={10} rx={3}
                fill={CNN_C + '08'} stroke={CNN_C} strokeWidth={0.5} strokeDasharray="2 2" />
            )}
          </g>
        ))}
        <text x={240} y={120} textAnchor="middle" fontSize={8} fill={CNN_C}>
          필터 범위 밖 무시
        </text>
        {/* RNN: sequential with arrows + KaTeX formula */}
        {[0, 1, 2, 3].map(j => (
          <g key={j}>
            <rect x={330 + j * 30} y={75} width={24} height={18} rx={4}
              fill={RNN_C + '15'} stroke={RNN_C} strokeWidth={0.8} />
            {j < 3 && (
              <line x1={354 + j * 30} y1={84} x2={360 + j * 30} y2={84}
                stroke={RNN_C} strokeWidth={1} />
            )}
          </g>
        ))}
        <text x={390} y={112} textAnchor="middle" fontSize={9} fill={RNN_C}
          fontStyle="italic">hₜ = f(hₜ₋₁, xₜ)</text>
      </motion.g>
      {/* Parameter comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={90} y={140} textAnchor="middle" fontSize={8} fill="#999">
          655K params
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill="#999">
          위치 불변
        </text>
        <text x={390} y={140} textAnchor="middle" fontSize={8} fill="#999">
          131K params
        </text>
      </motion.g>
    </g>
  );
}

/** ② Elman vs Jordan 네트워크 */
export function Step1() {
  return (
    <g>
      {/* Elman Network */}
      <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
        transition={sp}>
        <text x={120} y={15} textAnchor="middle" fontSize={11} fontWeight={700}
          fill={RNN_C}>Elman (표준)</text>
        {/* RNN cell */}
        <rect x={85} y={45} width={70} height={34} rx={6}
          fill={RNN_C + '15'} stroke={RNN_C} strokeWidth={1.5} />
        <text x={120} y={68} textAnchor="middle" fontSize={11} fill={RNN_C}
          fontStyle="italic">hₜ</text>
        {/* Input arrow */}
        <line x1={120} y1={100} x2={120} y2={79} stroke="#f59e0b" strokeWidth={1.2}
          markerEnd="url(#ovdArrow)" />
        <text x={120} y={118} textAnchor="middle" fontSize={10} fill="#f59e0b"
          fontStyle="italic">xₜ</text>
        {/* Self-loop (hidden feedback) */}
        <path d="M155,55 Q175,30 155,50" fill="none" stroke={RNN_C}
          strokeWidth={1.2} markerEnd="url(#ovdArrowG)" />
        <text x={188} y={44} fontSize={9} fill={RNN_C} fontStyle="italic">hₜ₋₁</text>
        {/* Output */}
        <line x1={120} y1={45} x2={120} y2={28} stroke="#8b5cf6" strokeWidth={1.2}
          markerEnd="url(#ovdArrowP)" />
        <text x={140} y={30} fontSize={10} fill="#8b5cf6" fontStyle="italic">yₜ</text>
      </motion.g>

      {/* Elman formula — KaTeX */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <text x={125} y={136} textAnchor="middle" fontSize={9} fill={RNN_C}
          fontStyle="italic">hₜ = tanh(Wₕₕ·hₜ₋₁ + Wₓₕ·xₜ)</text>
      </motion.g>

      {/* Jordan Network */}
      <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <text x={360} y={15} textAnchor="middle" fontSize={11} fontWeight={700}
          fill={CNN_C}>Jordan</text>
        <rect x={325} y={45} width={70} height={34} rx={6}
          fill={CNN_C + '15'} stroke={CNN_C} strokeWidth={1.5} />
        <text x={360} y={68} textAnchor="middle" fontSize={11} fill={CNN_C}
          fontStyle="italic">hₜ</text>
        <line x1={360} y1={100} x2={360} y2={79} stroke="#f59e0b" strokeWidth={1.2}
          markerEnd="url(#ovdArrow)" />
        <text x={360} y={118} textAnchor="middle" fontSize={10} fill="#f59e0b"
          fontStyle="italic">xₜ</text>
        {/* Output feedback loop */}
        <line x1={360} y1={45} x2={360} y2={28} stroke="#8b5cf6" strokeWidth={1.2}
          markerEnd="url(#ovdArrowP)" />
        <text x={380} y={30} fontSize={10} fill="#8b5cf6" fontStyle="italic">yₜ</text>
        <path d="M395,55 Q415,30 395,50" fill="none" stroke={CNN_C}
          strokeWidth={1.2} markerEnd="url(#ovdArrowY)" />
        <text x={428} y={44} fontSize={9} fill={CNN_C} fontStyle="italic">yₜ₋₁</text>
      </motion.g>

      {/* Jordan formula — KaTeX */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <text x={365} y={136} textAnchor="middle" fontSize={9} fill={CNN_C}
          fontStyle="italic">hₜ = tanh(Wₒₕ·yₜ₋₁ + Wₓₕ·xₜ)</text>
      </motion.g>

      {/* Divider */}
      <motion.line x1={240} y1={10} x2={240} y2={145} stroke="#88888840"
        strokeWidth={1} strokeDasharray="4 3"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }} />

      {/* Key difference */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={145} width={120} height={20} rx={4}
          fill={RNN_C + '10'} stroke={RNN_C} strokeWidth={0.8} />
        <text x={120} y={159} textAnchor="middle" fontSize={8} fill={RNN_C}>
          hidden → hidden 순환
        </text>
        <rect x={300} y={145} width={120} height={20} rx={4}
          fill={CNN_C + '10'} stroke={CNN_C} strokeWidth={0.8} />
        <text x={360} y={159} textAnchor="middle" fontSize={8} fill={CNN_C}>
          output → hidden 피드백
        </text>
      </motion.g>

      <defs>
        <marker id="ovdArrow" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill="#f59e0b" />
        </marker>
        <marker id="ovdArrowG" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={RNN_C} />
        </marker>
        <marker id="ovdArrowP" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill="#8b5cf6" />
        </marker>
        <marker id="ovdArrowY" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={CNN_C} />
        </marker>
      </defs>
    </g>
  );
}

/** ③ Many-to-X 패턴 */
export function Step2() {
  const patterns = [
    { label: 'Many→One', ex: '감정 분석', x: 10, inN: 3, outN: 1, color: '#6366f1' },
    { label: 'Many→Many', ex: 'POS 태깅', x: 130, inN: 3, outN: 3, color: '#10b981' },
    { label: 'Seq2Seq', ex: '번역', x: 250, inN: 3, outN: 2, color: '#f59e0b' },
    { label: 'One→Many', ex: '캡셔닝', x: 370, inN: 1, outN: 3, color: '#ec4899' },
  ];
  return (
    <g>
      {patterns.map((p, i) => (
        <motion.g key={p.label} initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.12 }}>
          <text x={p.x + 50} y={14} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={p.color}>{p.label}</text>
          <text x={p.x + 50} y={26} textAnchor="middle" fontSize={7.5}
            fill="#999">{p.ex}</text>
          {/* Input boxes — centered */}
          {Array.from({ length: p.inN }).map((_, j) => (
            <rect key={`in-${j}`} x={p.x + 50 - (p.inN * 13) + j * 26} y={35} width={22} height={16} rx={3}
              fill={p.color + '15'} stroke={p.color} strokeWidth={0.8} />
          ))}
          {/* Arrow down */}
          <line x1={p.x + 50} y1={55} x2={p.x + 50} y2={75}
            stroke={p.color} strokeWidth={1} />
          {/* RNN cell */}
          <rect x={p.x + 25} y={75} width={50} height={22} rx={5}
            fill={p.color + '18'} stroke={p.color} strokeWidth={1.2} />
          <text x={p.x + 50} y={90} textAnchor="middle" fontSize={8}
            fill={p.color} fontWeight={600}>RNN</text>
          {/* Arrow down */}
          <line x1={p.x + 50} y1={97} x2={p.x + 50} y2={110}
            stroke={p.color} strokeWidth={1} />
          {/* Output boxes */}
          {Array.from({ length: p.outN }).map((_, j) => (
            <rect key={`out-${j}`} x={p.x + 50 - (p.outN * 13) + j * 26} y={112}
              width={22} height={16} rx={3}
              fill={p.color + '25'} stroke={p.color} strokeWidth={1} />
          ))}
        </motion.g>
      ))}
      {/* Loss application note */}
      <motion.text x={240} y={145} textAnchor="middle" fontSize={8} fill="#999"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        손실 적용 위치: One→마지막 hₜ만 | Many→매 step | Seq2Seq→디코더만
      </motion.text>
    </g>
  );
}

/** ④ 시퀀스 모델 계보 */
export function Step3() {
  const models = [
    { label: 'RNN', year: '1986', color: RNN_C, x: 20 },
    { label: 'LSTM', year: '1997', color: LSTM_C, x: 120 },
    { label: 'GRU', year: '2014', color: '#8b5cf6', x: 220 },
    { label: 'Transformer', year: '2017', color: '#ec4899', x: 320 },
  ];
  return (
    <g>
      {/* Timeline */}
      <motion.line x1={40} y1={50} x2={440} y2={50} stroke="#88888840" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6 }} />
      {models.map((m, i) => (
        <motion.g key={m.label} initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay: i * 0.15 }}>
          {/* Timeline dot */}
          <circle cx={m.x + 50} cy={50} r={4} fill={m.color} />
          <text x={m.x + 50} y={42} textAnchor="middle" fontSize={8} fill="#999">
            {m.year}
          </text>
          {/* Model card */}
          <rect x={m.x + 10} y={62} width={80} height={30} rx={6}
            fill={m.color + '15'} stroke={m.color} strokeWidth={1.2} />
          <text x={m.x + 50} y={81} textAnchor="middle" fontSize={10}
            fill={m.color} fontWeight={700}>{m.label}</text>
        </motion.g>
      ))}

      {/* Key formulas for each model */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={70} y={112} textAnchor="middle" fontSize={8} fill={RNN_C}
          fontStyle="italic">hₜ = f(hₜ₋₁, xₜ)</text>
        <text x={170} y={112} textAnchor="middle" fontSize={8} fill={LSTM_C}
          fontStyle="italic">cₜ = fₜcₜ₋₁ + iₜ</text>
        <text x={270} y={112} textAnchor="middle" fontSize={8} fill="#8b5cf6"
          fontStyle="italic">zₜ, rₜ (2 gate)</text>
        <text x={370} y={112} textAnchor="middle" fontSize={8} fill="#ec4899"
          fontStyle="italic">QKᵀ/√d</text>
      </motion.g>

      {/* Context length bars */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <text x={20} y={128} fontSize={8} fill="#999">유효 거리:</text>
        {[
          { x: 30, w: 20, label: '~20', color: RNN_C },
          { x: 130, w: 40, label: '~200', color: LSTM_C },
          { x: 230, w: 35, label: '~150', color: '#8b5cf6' },
          { x: 330, w: 100, label: '수천+', color: '#ec4899' },
        ].map((b, i) => (
          <g key={i}>
            <rect x={b.x + 40} y={122} width={b.w} height={8} rx={4}
              fill={b.color + '40'} />
            <text x={b.x + 40 + b.w / 2} y={142} textAnchor="middle"
              fontSize={7.5} fill={b.color}>{b.label}</text>
          </g>
        ))}
      </motion.g>
      {/* Mamba note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={160} y={148} width={160} height={16} rx={4}
          fill="#06b6d410" stroke="#06b6d4" strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={240} y={160} textAnchor="middle" fontSize={8} fill="#06b6d4">
          Mamba/SSM (2023): RNN의 현대적 부활
        </text>
      </motion.g>
    </g>
  );
}
