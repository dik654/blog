import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'tee_cryp_obj_secret: 키 크기 + 할당 크기 + 데이터',
  '키 속성 플래그: REQUIRED, GEN_KEY_REQ',
  'HW 가속: CAAM(i.MX), CE(STM32) 자동 탐지',
  'SW 대체: LibTomCrypt / mbedTLS 선택',
];

const C = { obj: '#6366f1', flag: '#f59e0b', hw: '#10b981' };

export default function KeyObjViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Struct layout */}
          <motion.rect x={20} y={10} width={240} height={100} rx={7}
            fill={step === 0 ? `${C.obj}10` : `${C.obj}04`}
            stroke={step === 0 ? C.obj : `${C.obj}30`} strokeWidth={step === 0 ? 1.5 : 1}
            animate={{ opacity: step === 0 ? 1 : 0.35 }} />
          <text x={35} y={28} fontSize={10} fontWeight={700} fill={C.obj}>tee_cryp_obj_secret</text>

          {[
            { name: 'key_size', desc: '실제 키 크기 (비트)' },
            { name: 'alloc_size', desc: '할당된 크기' },
            { name: 'data[]', desc: '실제 키 데이터 바이트' },
          ].map((f, i) => (
            <g key={f.name}>
              <rect x={30} y={38 + i * 22} width={220} height={18} rx={3}
                fill={step === 0 ? `${C.obj}08` : 'var(--card)'}
                stroke={step === 0 ? `${C.obj}40` : 'var(--border)'} strokeWidth={0.5} />
              <text x={40} y={51 + i * 22} fontSize={10} fontWeight={600}
                fill={step === 0 ? C.obj : 'var(--muted-foreground)'}>{f.name}</text>
              <text x={120} y={51 + i * 22} fontSize={10} fill="var(--muted-foreground)">{f.desc}</text>
            </g>
          ))}

          {/* Flags */}
          <motion.rect x={20} y={120} width={240} height={36} rx={6}
            fill={step === 1 ? `${C.flag}14` : `${C.flag}05`}
            stroke={step === 1 ? C.flag : `${C.flag}30`} strokeWidth={step === 1 ? 1.5 : 1}
            animate={{ opacity: step === 1 ? 1 : 0.25 }} />
          <text x={35} y={138} fontSize={10} fontWeight={600} fill={C.flag}>ATTR_REQUIRED</text>
          <text x={150} y={138} fontSize={10} fontWeight={600} fill={C.flag}>GEN_KEY_REQ</text>
          <text x={35} y={150} fontSize={10} fill="var(--muted-foreground)">키 속성 비트플래그 (BIT1, BIT5)</text>

          {/* HW accel vs SW */}
          <motion.rect x={290} y={10} width={230} height={60} rx={7}
            fill={step === 2 ? `${C.hw}14` : `${C.hw}05`}
            stroke={step === 2 ? C.hw : `${C.hw}30`} strokeWidth={step === 2 ? 1.5 : 1}
            animate={{ opacity: step === 2 ? 1 : 0.25 }} />
          <text x={305} y={28} fontSize={10} fontWeight={700} fill={C.hw}>HW 가속</text>
          <text x={305} y={44} fontSize={10} fill="var(--muted-foreground)">CAAM (i.MX) / CE (STM32)</text>
          <text x={305} y={58} fontSize={10} fill="var(--muted-foreground)">crypto_driver_init() 자동 탐지</text>

          <motion.rect x={290} y={80} width={230} height={60} rx={7}
            fill={step === 3 ? `${C.obj}14` : `${C.obj}05`}
            stroke={step === 3 ? C.obj : `${C.obj}30`} strokeWidth={step === 3 ? 1.5 : 1}
            animate={{ opacity: step === 3 ? 1 : 0.25 }} />
          <text x={305} y={98} fontSize={10} fontWeight={700} fill={C.obj}>SW 대체</text>
          <text x={305} y={114} fontSize={10} fill="var(--muted-foreground)">LibTomCrypt (기본)</text>
          <text x={305} y={128} fontSize={10} fill="var(--muted-foreground)">mbedTLS (CFG_CRYPTOLIB_NAME)</text>

          {/* Decision arrow */}
          <motion.line x1={405} y1={70} x2={405} y2={80}
            stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="3,2"
            animate={{ opacity: step >= 2 ? 0.6 : 0.1 }} />
          <motion.text x={405} y={155} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
            animate={{ opacity: step >= 2 ? 0.7 : 0 }}>HW 없으면 → SW fallback</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
