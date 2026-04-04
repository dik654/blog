import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { in: '#6366f1', mont: '#10b981', cios: '#f59e0b', out: '#ec4899' };

const STEPS = [
  { label: '입력: 일반 정수 a, b', body: 'a=7, b=5. 아직 Montgomery 형태가 아닌 일반 정수.' }, { label: 'R-도메인 진입: to_mont(a)', body: 'ã = a·R mod p. R=2²⁵⁶. 한 번의 변환으로 진입.' },
  { label: 'CIOS 곱셈: ã × b̃', body: 'limb 4개씩 곱셈+축소. 나눗셈 없이 시프트만.' }, { label: 'CIOS 내부: limb-by-limb', body: 'T += aᵢ·b̃, m=T₀·p′ mod 2⁶⁴, >>= 64. 4회.' },
  { label: 'R-도메인 탈출: from_mont', body: 'result·R⁻¹ mod p 복원. 나눗셈 0회 달성!' },
];

export default function MontgomeryStepsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }} transition={sp}>
            <rect x={10} y={12} width={50} height={22} rx={4} fill={`${C.in}15`} stroke={C.in} strokeWidth={step === 0 ? 1.5 : 0.6} />
            <text x={35} y={26} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.in}>a = 7</text>
            <rect x={10} y={42} width={50} height={22} rx={4} fill={`${C.in}15`} stroke={C.in} strokeWidth={step === 0 ? 1.5 : 0.6} />
            <text x={35} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.in}>b = 5</text>
          </motion.g>
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={62} y1={35} x2={82} y2={35} stroke={C.mont} strokeWidth={0.8} markerEnd="url(#arr)" />
              <text x={72} y={30} textAnchor="middle" fontSize={9} fill={C.mont}>×R mod p</text>
            </motion.g>
          )}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={85} y={12} width={60} height={22} rx={4} fill={`${C.mont}15`} stroke={C.mont} strokeWidth={step === 1 ? 1.5 : 0.6} />
            <text x={115} y={26} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mont}>ã = 7·R</text>
            <rect x={85} y={42} width={60} height={22} rx={4} fill={`${C.mont}15`} stroke={C.mont} strokeWidth={step === 1 ? 1.5 : 0.6} />
            <text x={115} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.mont}>b̃ = 5·R</text>
          </motion.g>
          {step >= 2 && <motion.line x1={147} y1={35} x2={167} y2={35} stroke={C.cios} strokeWidth={0.8}
            markerEnd="url(#arr2)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
            <rect x={170} y={8} width={80} height={60} rx={5} fill={`${C.cios}10`} stroke={C.cios}
              strokeWidth={step === 2 || step === 3 ? 1.5 : 0.6} strokeDasharray={step === 3 ? '0' : '3 2'} />
            <text x={210} y={22} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.cios}>CIOS</text>
            {[0, 1, 2, 3].map(i => (
              <motion.rect key={i} x={175 + i * 18} y={30} width={16} height={16} rx={2}
                animate={{ fill: step === 3 ? `${C.cios}30` : `${C.cios}10`, strokeWidth: step === 3 ? 1.2 : 0.5 }}
                stroke={C.cios} transition={{ ...sp, delay: step === 3 ? i * 0.12 : 0 }} />
            ))}
            {[0, 1, 2, 3].map(i => (
              <text key={`t${i}`} x={183 + i * 18} y={41} textAnchor="middle" fontSize={9} fill={C.cios}>L{i}</text>
            ))}
            <text x={210} y={58} textAnchor="middle" fontSize={9} fill={`${C.cios}99`}>
              {step === 3 ? '시프트 + 조건 빼기' : 'ã·b̃·R⁻¹ mod p'}
            </text>
          </motion.g>
          {step >= 4 && <motion.line x1={252} y1={35} x2={272} y2={35} stroke={C.out} strokeWidth={0.8}
            markerEnd="url(#arr3)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />}
          <motion.g animate={{ opacity: step >= 4 ? 1 : 0.15 }} transition={sp}>
            <rect x={275} y={18} width={70} height={30} rx={5} fill={`${C.out}15`} stroke={C.out} strokeWidth={step === 4 ? 1.5 : 0.6} />
            <text x={310} y={31} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.out}>a·b = 35</text>
            <text x={310} y={40} textAnchor="middle" fontSize={9} fill={`${C.out}88`}>×R⁻¹ mod p</text>
          </motion.g>
          <motion.g animate={{ opacity: step >= 4 ? 1 : 0 }} transition={sp}>
            <rect x={140} y={80} width={100} height={18} rx={4} fill="#10b98118" stroke="#10b981" strokeWidth={0.6} />
            <text x={190} y={92} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>나눗셈 0회 달성!</text>
          </motion.g>
          <defs>
            {[{ id: 'arr', c: C.mont }, { id: 'arr2', c: C.cios }, { id: 'arr3', c: C.out }].map(m => (
              <marker key={m.id} id={m.id} markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
                <path d="M0,0 L6,2 L0,4" fill={m.c} />
              </marker>
            ))}
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
