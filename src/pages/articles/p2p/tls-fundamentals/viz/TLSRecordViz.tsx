import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '레코드 헤더', body: 'ContentType(1B) + ProtocolVersion(2B) + Length(2B). 총 5바이트 헤더.' },
  { label: '암호화 페이로드', body: 'AEAD로 암호화된 Fragment. 인증 태그(16B)가 무결성 보장.' },
  { label: 'Padding', body: '패딩 바이트 추가로 실제 레코드 크기 은닉. 트래픽 분석 방어.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { hdr: '#6366f1', payload: '#10b981', tag: '#f59e0b', pad: '#64748b' };

const FIELDS = [
  { x: 20, w: 44, label: 'Content\nType', sub: '1 byte', c: C.hdr },
  { x: 68, w: 64, label: 'Protocol\nVersion', sub: '2 bytes', c: C.hdr },
  { x: 136, w: 50, label: 'Length', sub: '2 bytes', c: C.hdr },
  { x: 190, w: 140, label: 'Encrypted Fragment', sub: 'variable', c: C.payload },
  { x: 334, w: 52, label: 'Auth Tag', sub: '16 bytes', c: C.tag },
  { x: 390, w: 50, label: 'Padding', sub: '0+ bytes', c: C.pad },
];

export default function TLSRecordViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {FIELDS.map((f, i) => {
            const group = i < 3 ? 0 : i < 5 ? 1 : 2;
            const active = group === step;
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.25 }} transition={sp}>
                <rect x={f.x} y={20} width={f.w} height={36} rx={4}
                  fill={f.c + '12'} stroke={f.c} strokeWidth={active ? 1.5 : 1} />
                {f.label.split('\n').map((line, li) => (
                  <text key={li} x={f.x + f.w / 2} y={34 + li * 10}
                    textAnchor="middle" fontSize={10} fontWeight={600} fill={f.c}>{line}</text>
                ))}
                <text x={f.x + f.w / 2} y={70}
                  textAnchor="middle" fontSize={10} fill={f.c} opacity={0.6}>{f.sub}</text>
              </motion.g>
            );
          })}
          {/* Bracket labels */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.2 }} transition={sp}>
            <line x1={20} y1={82} x2={186} y2={82} stroke={C.hdr} strokeWidth={1} />
            <text x={103} y={94} textAnchor="middle" fontSize={10} fill={C.hdr}>5-byte Header</text>
          </motion.g>
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.2 }} transition={sp}>
            <line x1={190} y1={82} x2={386} y2={82} stroke={C.payload} strokeWidth={1} />
            <text x={288} y={94} textAnchor="middle" fontSize={10} fill={C.payload}>AEAD Encrypted</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
