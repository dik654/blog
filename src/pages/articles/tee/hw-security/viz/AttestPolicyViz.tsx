import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'AttestationPolicy 클래스 — measurements / TCB / debug / attributes / cert validity' },
  { label: 'verify(report) — measurement → TCB → debug → attributes 순차 검사' },
  { label: '정책 업데이트 — MRENCLAVE 추가, MIN_TCB 증가, emergency revocation' },
];

const POLICY_FIELDS = [
  { k: 'allowed_measurements', v: 'Set[bytes] (MRENCLAVE 화이트리스트)', c: '#6366f1' },
  { k: 'min_tcb_version', v: 'TcbVersion (CVE 대응)', c: '#10b981' },
  { k: 'reject_debug', v: 'bool (default True)', c: '#f59e0b' },
  { k: 'required_attributes', v: 'dict (mode/feature 강제)', c: '#0ea5e9' },
  { k: 'cert_validity_days', v: 'int (default 90)', c: '#a855f7' },
];

const VERIFY_CHECKS = [
  { code: '1', check: 'mrenclave in allowed_measurements', err: 'unknown_enclave', c: '#6366f1' },
  { code: '2', check: 'tcb_version >= min_tcb_version', err: 'outdated_tcb', c: '#10b981' },
  { code: '3', check: 'attributes.debug == False (if reject_debug)', err: 'debug_not_allowed', c: '#f59e0b' },
  { code: '4', check: 'all required_attributes match', err: 'attribute_mismatch_X', c: '#0ea5e9' },
  { code: '5', check: 'all checks passed', err: 'ok', c: '#10b981' },
];

const POLICY_UPDATES = [
  { name: '새 enclave 버전 배포', sub: 'MRENCLAVE 추가', c: '#6366f1' },
  { name: 'CVE 발견', sub: 'MIN_TCB 증가', c: '#f59e0b' },
  { name: '공격 탐지', sub: 'emergency revocation', c: '#ef4444' },
];

export default function AttestPolicyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              class AttestationPolicy
            </text>
            {POLICY_FIELDS.map((f, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={20} y={42 + i * 34} width={480} height={26} rx={4}
                  fill={`${f.c}10`} stroke={`${f.c}40`} strokeWidth={0.8} />
                <text x={40} y={59 + i * 34} fontSize={10} fontWeight={700} fill={f.c}
                  style={{ fontFamily: 'monospace' }}>{f.k}:</text>
                <text x={210} y={59 + i * 34} fontSize={9.5} fill="var(--muted-foreground)">{f.v}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              def verify(self, report) — 순차 검증
            </text>
            {VERIFY_CHECKS.map((v, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={20} y={42 + i * 32} width={480} height={26} rx={4}
                  fill={`${v.c}10`} stroke={`${v.c}40`} strokeWidth={0.8} />
                <circle cx={40} cy={55 + i * 32} r={9} fill={v.c} />
                <text x={40} y={59 + i * 32} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{v.code}</text>
                <text x={56} y={59 + i * 32} fontSize={9.5} fill="var(--foreground)"
                  style={{ fontFamily: 'monospace' }}>{v.check}</text>
                <text x={350} y={59 + i * 32} fontSize={8.5} fill="var(--muted-foreground)"
                  style={{ fontFamily: 'monospace' }}>{`→ "${v.err}"`}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              정책 업데이트 트리거
            </text>
            {POLICY_UPDATES.map((u, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 56} w={420} h={44}
                  label={u.name} sub={u.sub} color={u.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              정책은 audit-loggable 형태로 저장 + 자동 배포 권장
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
