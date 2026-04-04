import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const HX = 70, GX = 240, JX = 155, Y = 50;

const STEPS = [
  { label: '① Host가 입력 전달', body: 'stdin.write(&input) — Host가 비공개 입력을 Guest에 전달합니다.' },
  { label: '② Guest가 입력 읽기 + 계산', body: 'env::read()로 입력 수신 후 RISC-V zkVM 내에서 계산 수행.' },
  { label: '③ Guest가 결과 커밋', body: 'env::commit(&result) — 공개 출력을 Journal에 기록합니다.' },
  { label: '④ Host가 Receipt 검증', body: 'receipt.verify(IMAGE_ID) — Journal 읽기 + 증명 검증 (빠름).' },
];

export default function R0GuestHostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 320 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Host box */}
          <motion.rect x={HX - 35} y={Y - 18} width={70} height={36} rx={6}
            animate={{ fill: step === 0 || step === 3 ? '#6366f120' : '#6366f108',
              stroke: '#6366f1', strokeWidth: step === 0 || step === 3 ? 2 : 0.8 }} transition={sp} />
          <text x={HX} y={Y - 4} textAnchor="middle" fontSize={9} fontWeight={600} fill="#6366f1">Host</text>
          <text x={HX} y={Y + 8} textAnchor="middle" fontSize={9} fill="#6366f1" opacity={0.6}>일반 Rust</text>

          {/* Guest box */}
          <motion.rect x={GX - 35} y={Y - 18} width={70} height={36} rx={6}
            animate={{ fill: step === 1 || step === 2 ? '#10b98120' : '#10b98108',
              stroke: '#10b981', strokeWidth: step === 1 || step === 2 ? 2 : 0.8 }} transition={sp} />
          <text x={GX} y={Y - 4} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">Guest</text>
          <text x={GX} y={Y + 8} textAnchor="middle" fontSize={9} fill="#10b981" opacity={0.6}>RISC-V zkVM</text>

          {/* Journal */}
          <motion.rect x={JX - 28} y={82} width={56} height={20} rx={5}
            animate={{ fill: step >= 2 ? '#f59e0b20' : '#f59e0b06',
              stroke: '#f59e0b', strokeWidth: step >= 2 ? 1.5 : 0.5 }} transition={sp} />
          <text x={JX} y={95} textAnchor="middle" fontSize={6.5} fontWeight={600} fill="#f59e0b"
            opacity={step >= 2 ? 1 : 0.3}>Journal</text>

          {/* arrows */}
          {step >= 0 && (
            <motion.line x1={HX + 36} y1={Y - 4} x2={GX - 36} y2={Y - 4}
              stroke="#6366f1" strokeWidth={1.2} markerEnd="url(#rg)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp} />
          )}
          {step >= 2 && (
            <motion.line x1={GX - 10} y1={Y + 20} x2={JX + 10} y2={82}
              stroke="#f59e0b" strokeWidth={1} markerEnd="url(#rg)"
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={sp} />
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>
              <line x1={JX - 10} y1={88} x2={HX + 10} y2={Y + 20}
                stroke="#8b5cf6" strokeWidth={1} markerEnd="url(#rg)" />
              <text x={HX - 10} y={Y + 32} fontSize={9} fill="#8b5cf6">verify(IMAGE_ID)</text>
            </motion.g>
          )}
          {/* step labels */}
          {step === 0 && <motion.text x={155} y={Y - 12} textAnchor="middle" fontSize={9} fill="#6366f1"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>stdin.write(&input)</motion.text>}
          {step === 1 && <motion.text x={GX} y={Y + 28} textAnchor="middle" fontSize={9} fill="#10b981"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}>env::read() + 계산</motion.text>}
          <defs>
            <marker id="rg" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
