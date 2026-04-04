import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'EGETKEY: CPU가 봉인 키 파생', body: 'MRENCLAVE/MRSIGNER 정책 + CPU SVN + ISV SVN → 128-bit 봉인 키. 동일 엔클레이브에서만 동일 키 재생성 가능.' },
  { label: 'AES-128 키 준비', body: 'EGETKEY 반환값(128-bit)을 AES-GCM 대칭 키로 사용. 키는 엔클레이브 EPC 메모리 안에서만 존재.' },
  { label: 'AES-GCM 암호화 + MAC 생성', body: '평문 + AAD(추가 인증 데이터) → AES-GCM → 암호문 + 128-bit MAC. sgx_sealed_data_t 구조체로 패키징.' },
  { label: 'OCALL로 호스트에 전달 → 디스크 저장', body: '암호문을 OCALL로 호스트에 전달. 호스트 파일시스템에 저장. 호스트는 암호문만 보유 — 복호화 불가능.' },
];

const P = [
  { label: 'EGETKEY', sub: 'CPU 키 파생', color: '#6366f1', x: 70 },
  { label: 'AES-128', sub: 'GCM 키 준비', color: '#0ea5e9', x: 180 },
  { label: 'AES-GCM', sub: '암호화+MAC', color: '#10b981', x: 290 },
  { label: 'OCALL', sub: '호스트 저장', color: '#f59e0b', x: 410 },
];

export default function SealingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Enclave boundary */}
          <rect x={20} y={15} width={340} height={100} rx={10} fill="none"
            stroke="#6366f130" strokeWidth={1.5} strokeDasharray="6,4" />
          <text x={35} y={32} fontSize={10} fill="#6366f1" fontWeight={600}>SGX Enclave</text>

          {/* Pipeline boxes */}
          {P.map((s, i) => {
            const active = i === step;
            const done = i < step;
            return (
              <g key={s.label}>
                {i > 0 && (
                  <motion.line x1={P[i - 1].x + 35} y1={70} x2={s.x - 35} y2={70}
                    stroke={done || active ? s.color : 'var(--border)'} strokeWidth={1.2}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.3 }} />
                )}
                <motion.rect x={s.x - 35} y={44} width={70} height={50} rx={6}
                  fill={active ? `${s.color}20` : `${s.color}08`}
                  stroke={active ? s.color : `${s.color}40`}
                  strokeWidth={active ? 2 : 0.8}
                  animate={{ opacity: done ? 0.4 : active ? 1 : 0.25 }}
                  transition={{ duration: 0.3 }} />
                <text x={s.x} y={66} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={active ? s.color : 'var(--foreground)'}>{s.label}</text>
                <text x={s.x} y={82} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{s.sub}</text>
              </g>
            );
          })}

          {/* Host FS box — only on step 3 */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}>
              <line x1={410} y1={94} x2={410} y2={125} stroke="#f59e0b" strokeWidth={0.8} />
              <rect x={370} y={125} width={80} height={34} rx={6}
                fill="#f59e0b12" stroke="#f59e0b" strokeWidth={1.2} />
              <text x={410} y={146} textAnchor="middle" fontSize={10} fill="#f59e0b" fontWeight={600}>
                Host FS
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
