import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'SMC ID 비트 레이아웃: [31] Fast/Std, [30:24] Owner, [15:0] Fn',
  'Fast Call: 짧은 처리, 인터럽트 마스크, 즉시 반환',
  'Standard Call: RPC 가능, Normal World 서비스 요청',
  '주요 SMC: GET_OS_UUID, OPEN_SESSION, INVOKE_COMMAND',
];

const C = { bit: '#6366f1', fast: '#10b981', std: '#f59e0b' };

const BITS = [
  { range: '[31]', name: 'Fast/Std', w: 40, color: C.fast },
  { range: '[30:24]', name: 'Owner', w: 80, color: C.bit },
  { range: '[23:16]', name: '(reserved)', w: 80, color: 'var(--muted-foreground)' },
  { range: '[15:0]', name: 'Function', w: 160, color: C.std },
];

const SMCS = [
  { name: 'GET_OS_UUID', type: 'Fast', color: C.fast },
  { name: 'OPEN_SESSION', type: 'Std', color: C.std },
  { name: 'INVOKE_COMMAND', type: 'Std', color: C.std },
  { name: 'CLOSE_SESSION', type: 'Std', color: C.std },
  { name: 'ENABLE_SHM_CACHE', type: 'Fast', color: C.fast },
];

export default function SmcIdLayoutViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Bit layout */}
          <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
            fill="var(--foreground)">SMC 함수 ID (ARM SMCCC)</text>

          {(() => {
            let x = 90;
            return BITS.map((b) => {
              const cx = x;
              x += b.w + 4;
              return (
                <g key={b.range}>
                  <motion.rect x={cx} y={26} width={b.w} height={30} rx={4}
                    fill={step === 0 ? `${b.color}14` : `${b.color}06`}
                    stroke={step === 0 ? b.color : `${b.color}30`}
                    strokeWidth={step === 0 ? 1.2 : 0.8}
                    animate={{ opacity: step === 0 ? 1 : 0.35 }} />
                  <text x={cx + b.w / 2} y={38} textAnchor="middle" fontSize={10}
                    fontWeight={600} fill={b.color}>{b.range}</text>
                  <text x={cx + b.w / 2} y={50} textAnchor="middle" fontSize={10}
                    fill="var(--muted-foreground)">{b.name}</text>
                </g>
              );
            });
          })()}

          {/* Fast vs Standard */}
          <motion.rect x={30} y={70} width={230} height={40} rx={6}
            fill={step === 1 ? `${C.fast}14` : `${C.fast}05`}
            stroke={step === 1 ? C.fast : `${C.fast}30`} strokeWidth={step === 1 ? 1.5 : 1}
            animate={{ opacity: step === 1 ? 1 : 0.25 }} />
          <text x={45} y={87} fontSize={10} fontWeight={600} fill={C.fast}>Fast Call [31]=1</text>
          <text x={45} y={102} fontSize={10} fill="var(--muted-foreground)">인터럽트 마스크, 즉시 반환</text>

          <motion.rect x={280} y={70} width={230} height={40} rx={6}
            fill={step === 2 ? `${C.std}14` : `${C.std}05`}
            stroke={step === 2 ? C.std : `${C.std}30`} strokeWidth={step === 2 ? 1.5 : 1}
            animate={{ opacity: step === 2 ? 1 : 0.25 }} />
          <text x={295} y={87} fontSize={10} fontWeight={600} fill={C.std}>Standard Call [31]=0</text>
          <text x={295} y={102} fontSize={10} fill="var(--muted-foreground)">RPC 가능, 선점 허용</text>

          {/* SMC list */}
          {SMCS.map((s, i) => {
            const x = 30 + i * 100;
            const active = step === 3;
            return (
              <g key={s.name}>
                <motion.rect x={x} y={125} width={94} height={28} rx={4}
                  fill={active ? `${s.color}12` : `${s.color}04`}
                  stroke={active ? s.color : `${s.color}25`} strokeWidth={active ? 1.2 : 0.5}
                  animate={{ opacity: active ? 1 : 0.2 }} />
                <text x={x + 8} y={138} fontSize={10} fontWeight={600} fill={s.color}>{s.name}</text>
                <text x={x + 8} y={149} fontSize={10} fill="var(--muted-foreground)">{s.type}</text>
              </g>
            );
          })}

          <text x={270} y={175} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            Owner=0x3E: Trusted OS (OP-TEE) / Owner=0x00: ARM Standard
          </text>
        </svg>
      )}
    </StepViz>
  );
}
