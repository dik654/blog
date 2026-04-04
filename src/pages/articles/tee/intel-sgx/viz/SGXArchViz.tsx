import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'ECREATE: SECS 초기화, 엔클레이브 생성' },
  { label: 'EADD: 코드/데이터 페이지를 EPC에 로드' },
  { label: 'EEXTEND: 256B 블록을 MRENCLAVE에 누적' },
  { label: 'EINIT: SIGSTRUCT 검증 후 초기화 완료' },
];
const ANNOT = ['SECS 초기화 + 해시 시작', 'TCS/REG 페이지 EPC 추가', 'SHA-256 해시 누적', 'SIGSTRUCT 검증 → 활성화'];

const P = [
  { label: 'ECREATE', color: '#6366f1', icon: 'C' },
  { label: 'EADD', color: '#0ea5e9', icon: 'A' },
  { label: 'EEXTEND', color: '#10b981', icon: 'E' },
  { label: 'EINIT', color: '#f59e0b', icon: 'I' },
];

export default function SGXArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* EPC boundary */}
          <rect x={15} y={10} width={350} height={110} rx={10} fill="none"
            stroke="#6366f125" strokeWidth={1.5} strokeDasharray="6,4" />
          <text x={30} y={26} fontSize={10} fill="#6366f1" fontWeight={600}>EPC (Enclave Page Cache)</text>

          {/* Pipeline steps */}
          {P.map((s, i) => {
            const active = i === step;
            const done = i < step;
            const cx = 60 + i * 85;
            return (
              <g key={s.label}>
                {i > 0 && (
                  <line x1={cx - 50} y1={70} x2={cx - 35} y2={70}
                    stroke={done || active ? s.color : 'var(--border)'} strokeWidth={1.5} />
                )}
                <motion.circle cx={cx} cy={70} r={24}
                  fill={active ? `${s.color}22` : `${s.color}08`}
                  stroke={active ? s.color : `${s.color}40`}
                  strokeWidth={active ? 2.5 : 1}
                  animate={{ scale: active ? 1.1 : 1, opacity: done ? 0.4 : active ? 1 : 0.3 }}
                  transition={{ duration: 0.3 }} />
                <text x={cx} y={66} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>{s.icon}</text>
                <text x={cx} y={79} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{s.label}</text>
              </g>
            );
          })}

          {/* MRENCLAVE hash bar */}
          <rect x={30} y={140} width={320} height={24} rx={5} fill="#10b98106" stroke="#10b981" />
          <text x={40} y={156} fontSize={10} fontWeight={600} fill="var(--foreground)">MRENCLAVE</text>
          <motion.rect x={30} y={140} width={320} height={24} rx={5}
            fill="#10b98120" initial={{ scaleX: 0 }}
            animate={{ scaleX: (step + 1) / 4 }}
            style={{ originX: 0, transformBox: 'fill-box' }}
            transition={{ duration: 0.5, type: 'spring' }} />
          <motion.text x={30 + 320 * ((step + 1) / 4) - 5} y={156} textAnchor="end"
            fontSize={10} fontWeight={600} fill="#10b981"
            animate={{ x: 30 + 320 * ((step + 1) / 4) - 5 }}
            transition={{ duration: 0.5 }}>
            SHA-256 {Math.round((step + 1) / 4 * 100)}%
          </motion.text>

          {/* Pointer ball */}
          <motion.circle r={8} fill={P[step].color}
            animate={{ cx: 60 + step * 85, cy: 70 }}
            transition={{ duration: 0.45, type: 'spring', bounce: 0.25 }}>
          </motion.circle>
          <motion.text textAnchor="middle" fontSize={10} fontWeight={600} fill="white"
            animate={{ x: 60 + step * 85, y: 73 }}
            transition={{ duration: 0.45, type: 'spring', bounce: 0.25 }}>
            {step + 1}
          </motion.text>
          <motion.text x={385} y={100} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
