import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '입력 이미지' },
  { label: '인코더 압축' },
  { label: 'mu, sigma 출력' },
  { label: 'Reparameterization' },
  { label: '디코더 복원' },
];
const BODY = [
  '원본 x를 인코더에 전달',
  '레이어별 점차 저차원 압축',
  '병목에서 mu, sigma 출력',
  'z=mu+sigma*eps, 역전파 가능',
  'z를 디코더가 원본 크기 복원',
];

const ENC = [{ w: 56, h: 36 }, { w: 42, h: 30 }, { w: 28, h: 24 }];
const DEC = [{ w: 28, h: 24 }, { w: 42, h: 30 }, { w: 56, h: 36 }];

export default function VAEPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Input */}
          <motion.rect x={4} y={32} width={40} height={40} rx={4}
            animate={{ fill: '#6366f120', stroke: '#6366f1', strokeWidth: step === 0 ? 2 : 1 }} />
          <text x={24} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">Input x</text>
          {/* Encoder layers */}
          {ENC.map((l, i) => {
            const x = 56 + i * 34;
            const y = 50 - l.h / 2;
            const on = step >= 1;
            return (
              <g key={`e${i}`}>
                <motion.rect x={x} y={y} width={l.w > 34 ? 28 : l.w > 28 ? 22 : 18} height={l.h} rx={3}
                  animate={{ fill: on ? '#3b82f620' : '#3b82f608', stroke: '#3b82f6', strokeWidth: on ? 1.5 : 0.7 }}
                  transition={{ delay: step === 1 ? i * 0.12 : 0 }} />
                {i < 2 && <text x={x + 14} y={y + l.h + 8} textAnchor="middle" fontSize={9} fill="#3b82f680">↓ 압축</text>}
              </g>
            );
          })}
          {/* Bottleneck: mu and sigma bars */}
          <motion.rect x={164} y={26} width={14} height={20} rx={2}
            animate={{ fill: step >= 2 ? '#10b98130' : '#10b98108', stroke: '#10b981', strokeWidth: step >= 2 ? 1.5 : 0.5 }} />
          <text x={171} y={22} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">mu</text>
          <motion.rect x={164} y={54} width={14} height={20} rx={2}
            animate={{ fill: step >= 2 ? '#f59e0b30' : '#f59e0b08', stroke: '#f59e0b', strokeWidth: step >= 2 ? 1.5 : 0.5 }} />
          <text x={171} y={82} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">sigma</text>
          {/* Epsilon noise */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}>
              <circle cx={192} cy={50} r={6} fill="#8b5cf620" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={192} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">eps</text>
              <text x={192} y={42} textAnchor="middle" fontSize={9} fill="#8b5cf680">N(0,1)</text>
            </motion.g>
          )}
          {/* z = mu + sigma * eps */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x={206} y={40} width={24} height={20} rx={3} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1.5} />
              <text x={218} y={53} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">z</text>
              <text x={218} y={68} textAnchor="middle" fontSize={9} fill="#8b5cf680">mu+sigma*eps</text>
            </motion.g>
          )}
          {/* Decoder layers */}
          {DEC.map((l, i) => {
            const x = 244 + i * 34;
            const y = 50 - l.h / 2;
            const on = step >= 4;
            return (
              <g key={`d${i}`}>
                <motion.rect x={x} y={y} width={l.w > 34 ? 28 : l.w > 28 ? 22 : 18} height={l.h} rx={3}
                  animate={{ fill: on ? '#ec489920' : '#ec489908', stroke: '#ec4899', strokeWidth: on ? 1.5 : 0.7 }}
                  transition={{ delay: step === 4 ? i * 0.12 : 0 }} />
                {i < 2 && on && <text x={x + 14} y={y + l.h + 8} textAnchor="middle" fontSize={9} fill="#ec489980">↑ 확장</text>}
              </g>
            );
          })}
          {/* Output */}
          <motion.rect x={346} y={32} width={40} height={40} rx={4}
            animate={{ fill: step >= 4 ? '#ef444420' : '#ef444408', stroke: '#ef4444', strokeWidth: step >= 4 ? 2 : 0.7 }}
            transition={{ delay: step === 4 ? 0.4 : 0 }} />
          {step >= 4 && <text x={366} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">x'</text>}
          {/* Pipeline label */}
          <text x={125} y={104} textAnchor="middle" fontSize={9} fill="#3b82f6" opacity={0.5}>Encoder</text>
          <text x={195} y={104} textAnchor="middle" fontSize={9} fill="#8b5cf6" opacity={0.5}>Bottleneck</text>
          <text x={300} y={104} textAnchor="middle" fontSize={9} fill="#ec4899" opacity={0.5}>Decoder</text>
          <motion.text x={400} y={55} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
