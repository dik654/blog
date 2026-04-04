import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ENC = [
  { label: '입력 임베딩+PE', color: '#6366f1' },
  { label: 'Self-Attention', color: '#3b82f6' },
  { label: 'FFN + Norm', color: '#10b981' },
];
const DEC = [
  { label: '출력 임베딩+PE', color: '#ec4899' },
  { label: 'Masked Self-Attn', color: '#ef4444' },
  { label: 'Cross-Attention', color: '#8b5cf6' },
  { label: 'FFN → Softmax', color: '#f59e0b' },
];
const LH = 24, GAP = 6, EX = 20, DX = 210, W = 130;

const STEPS = [
  { label: '전체 Encoder-Decoder 구조' }, { label: 'Encoder: 입력 임베딩' },
  { label: 'Encoder: Self-Attention + FFN' }, { label: 'Decoder: Masked Self-Attention' },
  { label: 'Cross-Attention' }, { label: 'Decoder: FFN → 출력' },
];
const BODY = [
  'Encoder(소스) ↔ Decoder(타겟)', '소스 토큰 → 벡터 + PE',
  '토큰 간 관계 + 비선형 변환 ×N', '미래 토큰 마스킹',
  'Q=Dec, K/V=Enc 참조', 'FFN→Softmax→다음 토큰 예측',
];

const eS = [-1, 0, 1, 2, 2, 2]; // enc active layer per step
const dS = [-1, -1, -1, 0, 2, 3]; // dec active layer per step
const eA = [true, true, false, false, false, false];
const dA = [true, false, false, true, true, true];

function Col({ layers, x0, step, aArr, sArr, title, titleColor }: {
  layers: typeof ENC; x0: number; step: number; aArr: boolean[]; sArr: number[]; title: string; titleColor: string;
}) {
  return (<g>
    <text x={x0 + W / 2} y={10} textAnchor="middle" fontSize={9} fontWeight={600} fill={titleColor}>{title}</text>
    {layers.map((l, i) => {
      const y = 16 + i * (LH + GAP), a = aArr[step] && sArr[step] >= i, lit = sArr[step] === i;
      return (<g key={i}>
        <motion.rect x={x0} y={y} width={W} height={LH} rx={4}
          animate={{ fill: `${l.color}${lit ? '25' : '0c'}`, stroke: l.color, strokeWidth: lit ? 2 : 1, opacity: a ? 1 : 0.2 }} transition={{ duration: 0.3 }} />
        <text x={x0 + W / 2} y={y + LH / 2 + 3} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={lit ? l.color : 'var(--foreground)'} opacity={a ? 1 : 0.25}>{l.label}</text>
        {i < layers.length - 1 && <line x1={x0 + W / 2} y1={y + LH} x2={x0 + W / 2} y2={y + LH + GAP} stroke="var(--border)" strokeWidth={1} opacity={a ? 0.5 : 0.1} />}
      </g>);
    })}
  </g>);
}

export default function EncoderDecoderViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const crossY = 16 + 2 * (LH + GAP) + LH / 2;
        return (
          <svg viewBox="0 0 490 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Col layers={ENC} x0={EX} step={step} aArr={eA} sArr={eS} title="Encoder" titleColor="#3b82f6" />
            <Col layers={DEC} x0={DX} step={step} aArr={dA} sArr={dS} title="Decoder" titleColor="#ef4444" />
            <motion.path d={`M ${EX + W} ${crossY} L ${DX} ${crossY}`} fill="none" stroke="#8b5cf6"
              strokeWidth={step === 4 ? 2 : 1} strokeDasharray={step === 4 ? 'none' : '4 3'}
              animate={{ opacity: step >= 4 ? 0.8 : 0.15 }} />
            {step === 4 && <motion.text x={(EX + W + DX) / 2} y={crossY - 6} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>K, V</motion.text>}
            {step >= 1 && step <= 2 && <motion.circle r={5} animate={{ cx: EX + W / 2, cy: 16 + eS[step] * (LH + GAP) + LH / 2 }} transition={{ type: 'spring', bounce: 0.2 }} fill={ENC[eS[step]]?.color} style={{ filter: `drop-shadow(0 0 3px ${ENC[eS[step]]?.color}88)` }} />}
            {step >= 3 && <motion.circle r={5} animate={{ cx: DX + W / 2, cy: 16 + dS[step] * (LH + GAP) + LH / 2 }} transition={{ type: 'spring', bounce: 0.2 }} fill={DEC[dS[step]]?.color} style={{ filter: `drop-shadow(0 0 3px ${DEC[dS[step]]?.color}88)` }} />}
          {/* inline body */}
          <motion.text x={380} y={75} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
