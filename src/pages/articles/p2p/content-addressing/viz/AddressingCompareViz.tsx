import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '위치 주소 지정 (Location)', body: '서버 다운 시 접근 불가, 내용 변경과 URL 무관' },
  { label: '내용 주소 지정 (Content)', body: '내용의 해시가 주소 — 누구든 같은 데이터면 같은 CID' },
  { label: '무결성 검증', body: '수신 데이터를 해싱해 CID와 비교하여 변조 감지' },
];

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const C = { loc: '#ef4444', content: '#10b981', hash: '#6366f1' };

export default function AddressingCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Location addressing */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }} transition={sp}>
            <rect x={20} y={20} width={170} height={90} rx={6}
              fill={C.loc + '08'} stroke={C.loc} strokeWidth={1.3} />
            <text x={105} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.loc}>
              위치 주소
            </text>
            <text x={105} y={56} textAnchor="middle" fontSize={10} fill={C.loc}>
              URL → Server → File
            </text>
            {/* Server icon */}
            <rect x={75} y={68} width={60} height={30} rx={4}
              fill={C.loc + '15'} stroke={C.loc} strokeWidth={1} />
            <text x={105} y={87} textAnchor="middle" fontSize={10} fill={C.loc}>Server</text>
          </motion.g>

          {/* Content addressing */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={230} y={20} width={170} height={90} rx={6}
              fill={C.content + '08'} stroke={C.content} strokeWidth={1.3} />
            <text x={315} y={40} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.content}>
              내용 주소
            </text>
            <text x={315} y={56} textAnchor="middle" fontSize={10} fill={C.content}>
              CID = hash(data)
            </text>
            {/* Multiple sources */}
            {[0, 1, 2].map(i => (
              <rect key={i} x={250 + i * 40} y={68} width={30} height={30} rx={4}
                fill={C.content + '15'} stroke={C.content} strokeWidth={1} />
            ))}
            <text x={315} y={87} textAnchor="middle" fontSize={10} fill={C.content}>
              누구든 제공
            </text>
          </motion.g>

          {/* Verification arrow */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={240} y={118} width={150} height={16} rx={4}
                fill={C.hash + '10'} stroke={C.hash} strokeWidth={1} />
              <text x={315} y={129} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hash}>
                hash(received) == CID ?
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
