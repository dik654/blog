import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '봉인: 평문 → AES-GCM → 암호문 + MAC',
    body: 'Seal Key + 12-byte IV(랜덤) + AAD + 평문을 AES-128-GCM에 입력.\n암호문과 128-bit MAC(인증 태그)을 출력합니다.' },
  { label: '개봉: sealed_data → 복호화 → 평문',
    body: 'sealed_data에서 key_request를 추출, EGETKEY로 동일 Seal Key 재파생.\nAES-GCM Decrypt → MAC 검증 통과 시 평문을 반환합니다.' },
  { label: '변조 탐지: MAC 불일치 → 거부',
    body: '공격자가 암호문을 1비트라도 수정하면 MAC 검증에 실패합니다.\nSGX_ERROR_MAC_MISMATCH 반환 — 평문은 절대 노출되지 않습니다.' },
];

const Box = ({ x, y, w, h, label, color }: {
  x: number; y: number; w: number; h: number; label: string; color: string;
}) => (
  <g>
    <motion.rect x={x} y={y} width={w} height={h} rx={5}
      animate={{ fill: `${color}20`, stroke: color, strokeWidth: 1.3 }} transition={sp} />
    <text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle"
      fontSize={10} fontWeight={500} fill={color}>{label}</text>
  </g>
);

const Arr = ({ x1, y1, x2, y2, c }: { x1: number; y1: number; x2: number; y2: number; c: string }) => (
  <g>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={0.8} />
    <polygon points={`${x2 - 4},${y2 - 2} ${x2 + 4},${y2 - 2} ${x2},${y2 + 2}`} fill={c} />
  </g>
);

export default function AesGcmViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <Box x={10} y={10} w={80} h={28} label="평문" color={C1} />
              <Box x={10} y={50} w={80} h={28} label="AAD" color={C1} />
              <Box x={10} y={90} w={80} h={28} label="Seal Key" color={C2} />
              <Box x={10} y={120} w={80} h={20} label="IV (12B)" color={C3} />
              <Arr x1={90} y1={24} x2={170} y2={55} c={C1} />
              <Arr x1={90} y1={64} x2={170} y2={65} c={C1} />
              <Arr x1={90} y1={104} x2={170} y2={75} c={C2} />
              <Box x={170} y={45} w={120} h={40} label="AES-128-GCM" color={C2} />
              <Arr x1={290} y1={55} x2={350} y2={30} c={C3} />
              <Arr x1={290} y1={75} x2={350} y2={95} c={C3} />
              <Box x={350} y={14} w={130} h={28} label="암호문" color={C3} />
              <Box x={350} y={80} w={130} h={28} label="128-bit MAC" color={C3} />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <Box x={10} y={30} w={100} h={28} label="sealed_data" color={C1} />
              <Arr x1={110} y1={44} x2={140} y2={44} c={C1} />
              <Box x={140} y={10} w={80} h={24} label="key_request" color={C2} />
              <Arr x1={220} y1={22} x2={260} y2={22} c={C2} />
              <text x={250} y={9} fontSize={10} fill="var(--foreground)" opacity={0.6}>EGETKEY</text>
              <Box x={260} y={10} w={80} h={24} label="Seal Key" color={C2} />
              <Arr x1={300} y1={34} x2={300} y2={55} c={C2} />
              <Box x={140} y={55} w={90} h={28} label="암호문+MAC" color={C1} />
              <Arr x1={230} y1={69} x2={260} y2={69} c={C1} />
              <Box x={260} y={55} w={120} h={28} label="AES-GCM Decrypt" color={C2} />
              <Arr x1={380} y1={69} x2={400} y2={69} c={C2} />
              <Box x={400} y={55} w={80} h={28} label="평문" color={C3} />
              <text x={440} y={100} textAnchor="middle" fontSize={10} fill={C2}>MAC OK</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <Box x={20} y={30} w={120} h={28} label="암호문 (변조됨)" color="#ef4444" />
              <Arr x1={140} y1={44} x2={190} y2={44} c="#ef4444" />
              <Box x={190} y={30} w={130} h={28} label="AES-GCM Decrypt" color={C2} />
              <Arr x1={320} y1={44} x2={360} y2={44} c="#ef4444" />
              <rect x={360} y={25} width={120} height={38} rx={6}
                fill="#ef444420" stroke="#ef4444" strokeWidth={1.5} />
              <text x={420} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">MAC 불일치!</text>
              <text x={420} y={54} textAnchor="middle" fontSize={10} fill="#ef4444" opacity={0.7}>복호화 거부</text>
              <line x1={340} y1={36} x2={354} y2={52} stroke="#ef4444" strokeWidth={2} />
              <line x1={354} y1={36} x2={340} y2={52} stroke="#ef4444" strokeWidth={2} />
              <text x={250} y={90} textAnchor="middle" fontSize={10} fill="var(--foreground)" opacity={0.6}>
                SGX_ERROR_MAC_MISMATCH</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
