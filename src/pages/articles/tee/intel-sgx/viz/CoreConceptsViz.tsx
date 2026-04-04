import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '엔클레이브 측정값: MRENCLAVE / MRSIGNER', body: 'MRENCLAVE = 코드+데이터의 SHA-256 해시 (ECREATE→EADD→EEXTEND→EINIT). MRSIGNER = 서명자 RSA 공개키 해시. 신원 증명의 핵심.' },
  { label: '봉인 정책: KEYPOLICY 비트', body: 'SGX_KEYPOLICY_MRENCLAVE = 동일 코드만 복호화. SGX_KEYPOLICY_MRSIGNER = 동일 서명자면 업그레이드 후에도 복호화 가능.' },
  { label: '초기화 전역 상태', body: 'g_enclave_state: NOT_STARTED → INIT_DONE. EDMM_supported: 동적 메모리 관리 지원 여부. g_enclave_base: 엔클레이브 베이스 주소(RELRO).' },
];

const ITEMS = [
  [
    { label: 'MRENCLAVE', desc: 'SHA-256(코드+데이터)', color: '#6366f1' },
    { label: 'MRSIGNER', desc: 'RSA 공개키 해시', color: '#6366f1' },
  ],
  [
    { label: 'KEYPOLICY_MRENCLAVE', desc: '동일 코드만', color: '#f59e0b' },
    { label: 'KEYPOLICY_MRSIGNER', desc: '동일 서명자', color: '#f59e0b' },
  ],
  [
    { label: 'g_enclave_state', desc: 'NOT_STARTED → DONE', color: '#10b981' },
    { label: 'EDMM_supported', desc: '동적 메모리 관리', color: '#10b981' },
    { label: 'g_enclave_base', desc: '베이스 주소', color: '#10b981' },
  ],
];

export default function CoreConceptsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {ITEMS[step].map((item, i) => {
            const w = 160;
            const gap = 20;
            const total = ITEMS[step].length * w + (ITEMS[step].length - 1) * gap;
            const startX = (540 - total) / 2;
            const x = startX + i * (w + gap);
            return (
              <motion.g key={item.label} initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.3 }}>
                <rect x={x} y={30} width={w} height={70} rx={6}
                  fill={`${item.color}12`} stroke={item.color} strokeWidth={1.2} />
                <text x={x + w / 2} y={58} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={item.color}>{item.label}</text>
                <text x={x + w / 2} y={78} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{item.desc}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
