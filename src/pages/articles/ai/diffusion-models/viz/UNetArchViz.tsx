import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '전체 U-Net 구조' }, { label: 'Encoder 다운샘플링' },
  { label: 'Bottleneck 처리' }, { label: 'Decoder + Skip Connection' },
];
const BODY = [
  'Enc→Bot→Dec + Skip, U자 형태', '해상도 절반↓ 채널 수↑',
  'Self-Attention + ResBlock 전역 문맥', '업샘플 + Enc 특징 직접 전달',
];

const ENC = [
  { w: 60, h: 24, label: '64ch', color: '#3b82f6', dim: '64×64' },
  { w: 48, h: 24, label: '128ch', color: '#6366f1', dim: '32×32' },
  { w: 36, h: 24, label: '256ch', color: '#8b5cf6', dim: '16×16' },
];
const BOT = { w: 28, h: 24, label: 'Mid', color: '#f59e0b', dim: '8×8' };
const DEC = [
  { w: 36, h: 24, label: '256ch', color: '#10b981', dim: '16×16' },
  { w: 48, h: 24, label: '128ch', color: '#22c55e', dim: '32×32' },
  { w: 60, h: 24, label: '64ch', color: '#14b8a6', dim: '64×64' },
];

const EY = [18, 52, 86]; // encoder y positions
const BY = 120;           // bottleneck y
const DY = [86, 52, 18]; // decoder y positions (mirrored)
const EX = 40, DX = 260, BX = 168;

export default function UNetArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const packetY = step === 1 ? EY[Math.min(step, 2)] : step === 2 ? BY : step === 3 ? DY[0] : EY[0];
        const packetX = step <= 1 ? EX + 30 : step === 2 ? BX + 14 : DX + 30;
        return (
          <svg viewBox="0 0 500 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Encoder */}
            <text x={EX + 30} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">Encoder</text>
            {ENC.map((e, i) => (
              <g key={`e${i}`}>
                <motion.rect x={EX + (60 - e.w) / 2} y={EY[i]} width={e.w} height={e.h} rx={4}
                  animate={{ fill: `${e.color}${step <= 1 ? '20' : '0c'}`, stroke: e.color, strokeWidth: step === 1 ? 2 : 1 }} />
                <text x={EX + 30} y={EY[i] + 15} textAnchor="middle" fontSize={9} fill={e.color}>{e.label}</text>
                <text x={EX - 10} y={EY[i] + 15} textAnchor="end" fontSize={7} fill={e.color} fillOpacity={0.6}>{e.dim}</text>
                {i < 2 && <line x1={EX + 30} y1={EY[i] + e.h} x2={EX + 30} y2={EY[i + 1]} stroke="var(--border)" strokeWidth={1} />}
              </g>
            ))}
            {/* Down arrow to bottleneck */}
            <line x1={EX + 30} y1={EY[2] + 24} x2={BX + 14} y2={BY} stroke="var(--border)" strokeWidth={1} />
            {/* Bottleneck */}
            <motion.rect x={BX} y={BY} width={BOT.w} height={BOT.h} rx={4}
              animate={{ fill: `${BOT.color}${step === 2 ? '25' : '0c'}`, stroke: BOT.color, strokeWidth: step === 2 ? 2 : 1 }} />
            <text x={BX + 14} y={BY + 15} textAnchor="middle" fontSize={9} fill={BOT.color}>{BOT.label}</text>
            <text x={BX + 14} y={BY - 4} textAnchor="middle" fontSize={7} fill={BOT.color} fillOpacity={0.6}>{BOT.dim}</text>
            {/* Up arrow from bottleneck */}
            <line x1={BX + 14} y1={BY} x2={DX + 30} y2={DY[0] + 24} stroke="var(--border)" strokeWidth={1} />
            {/* Decoder */}
            <text x={DX + 30} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Decoder</text>
            {DEC.map((d, i) => (
              <g key={`d${i}`}>
                <motion.rect x={DX + (60 - d.w) / 2} y={DY[i]} width={d.w} height={d.h} rx={4}
                  animate={{ fill: `${d.color}${step === 3 ? '20' : '0c'}`, stroke: d.color, strokeWidth: step === 3 ? 2 : 1 }} />
                <text x={DX + 30} y={DY[i] + 15} textAnchor="middle" fontSize={9} fill={d.color}>{d.label}</text>
                <text x={DX + 70} y={DY[i] + 15} fontSize={7} fill={d.color} fillOpacity={0.6}>{d.dim}</text>
                {i < 2 && <line x1={DX + 30} y1={DY[i] + d.h} x2={DX + 30} y2={DY[i + 1]} stroke="var(--border)" strokeWidth={1} />}
              </g>
            ))}
            {/* Skip connections */}
            {[0, 1, 2].map((i) => (
              <motion.line key={`s${i}`} x1={EX + 60} y1={EY[i] + 12} x2={DX + (60 - DEC[2 - i].w) / 2} y2={DY[2 - i] + 12}
                stroke="#ec4899" strokeDasharray="4 3"
                animate={{ opacity: step === 3 || step === 0 ? 0.6 : 0.12, strokeWidth: step === 3 ? 1.5 : 0.8 }} />
            ))}
            {step === 3 && <text x={190} y={28} textAnchor="middle" fontSize={9} fill="#ec4899">skip</text>}
            {/* Moving packet */}
            <motion.circle r={5} animate={{ cx: packetX, cy: packetY + 12 }}
              transition={{ type: 'spring', bounce: 0.2 }}
              fill={step <= 1 ? '#3b82f6' : step === 2 ? '#f59e0b' : '#10b981'}
              style={{ filter: `drop-shadow(0 0 4px ${step <= 1 ? '#3b82f6' : step === 2 ? '#f59e0b' : '#10b981'}88)` }} />
            {/* inline body */}
            <motion.text x={390} y={80} fontSize={9}
              fill="var(--muted-foreground)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              key={step}>{BODY[step]}</motion.text>
          </svg>
        );
      }}
    </StepViz>
  );
}
