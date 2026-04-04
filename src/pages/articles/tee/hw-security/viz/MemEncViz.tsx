import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '평문 데이터가 CPU 캐시에서 DRAM으로 이동' },
  { label: 'AES-XTS: 주소 기반 트윅으로 블록 암호화' },
  { label: '무결성 트리: MAC으로 변조 탐지' },
  { label: '리플레이 방지: 단조증가 카운터 검증' },
];
const BODY = [
  'DRAM은 물리적 접근에 취약',
  '메모리 컨트롤러가 실시간 암호화',
  'Merkle Tree 루트로 전체 무결성 보장',
  '이전 암호문 재삽입 차단',
];

const BLOCKS = [
  { label: 'Block₀', x: 30 }, { label: 'Block₁', x: 100 },
  { label: 'Block₂', x: 170 }, { label: 'Block₃', x: 240 },
];
const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function MemEncViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>

          {/* CPU box */}
          <rect x={20} y={10} width={90} height={30} rx={5}
            fill="#6366f115" stroke="#6366f1" strokeWidth={1.5} />
          <text x={65} y={29} textAnchor="middle" fontSize={10} fontWeight={600} fill="#6366f1">CPU Cache</text>

          {/* AES engine */}
          <motion.rect x={140} y={10} width={80} height={30} rx={5}
            animate={{ fill: step === 1 ? '#0ea5e920' : '#80808008',
              stroke: step === 1 ? '#0ea5e9' : '#555', strokeWidth: step === 1 ? 1.5 : 0.8 }}
            transition={sp} />
          <text x={180} y={29} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={step === 1 ? '#0ea5e9' : 'var(--muted-foreground)'}>AES-XTS</text>

          {/* Arrows CPU→AES→DRAM */}
          <line x1={112} y1={25} x2={138} y2={25} stroke="var(--border)" strokeWidth={1} />
          <line x1={222} y1={25} x2={290} y2={25} stroke="var(--border)" strokeWidth={1} />

          {/* DRAM blocks */}
          <rect x={20} y={55} width={290} height={40} rx={6}
            fill="#0ea5e906" stroke="#0ea5e9" strokeWidth={0.8} strokeDasharray="4 2" />
          <text x={35} y={68} fontSize={10} fill="var(--muted-foreground)">DRAM</text>
          {BLOCKS.map((b, i) => {
            const encrypted = step >= 1;
            const color = encrypted ? '#0ea5e9' : '#ef4444';
            return (
              <motion.g key={i} animate={{ opacity: 1 }} transition={sp}>
                <rect x={b.x} y={72} width={60} height={18} rx={3}
                  fill={`${color}12`} stroke={color} strokeWidth={1} />
                <text x={b.x + 30} y={84} textAnchor="middle" fontSize={10}
                  fill={color}>{encrypted ? '🔒 ' : ''}{b.label}</text>
              </motion.g>
            );
          })}

          {/* Integrity tree */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={340} y={20} fontSize={10} fontWeight={600} fill="#10b981">무결성 트리</text>
              {/* Tree structure */}
              <rect x={370} y={28} width={50} height={16} rx={3} fill="#10b98115" stroke="#10b981" strokeWidth={1} />
              <text x={395} y={39} textAnchor="middle" fontSize={10} fill="#10b981">Root</text>
              <line x1={380} y1={46} x2={360} y2={56} stroke="#10b981" strokeWidth={0.8} />
              <line x1={410} y1={46} x2={430} y2={56} stroke="#10b981" strokeWidth={0.8} />
              <rect x={340} y={58} width={40} height={14} rx={2} fill="#10b98110" stroke="#10b981" strokeWidth={0.5} />
              <text x={360} y={68} textAnchor="middle" fontSize={10} fill="#10b981">H(M0,M1)</text>
              <rect x={410} y={58} width={40} height={14} rx={2} fill="#10b98110" stroke="#10b981" strokeWidth={0.5} />
              <text x={430} y={68} textAnchor="middle" fontSize={10} fill="#10b981">H(M2,M3)</text>
            </motion.g>
          )}

          {/* Counter */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={340} y={85} width={130} height={20} rx={4}
                fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1} />
              <text x={405} y={98} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>
                Counter: 0x00A3 → 0x00A4
              </text>
              <text x={405} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                단조증가 — 이전 값 재사용 불가
              </text>
            </motion.g>
          )}

          <motion.text x={20} y={145} fontSize={10} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
