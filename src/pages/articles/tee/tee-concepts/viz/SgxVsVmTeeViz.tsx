import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'SGX (enclave 단위) 장점 — 작은 TCB, formal verification, per-app 격리' },
  { label: 'SGX 단점 — 앱 재작성, syscall 제한, 메모리 제약, 앱만 보호' },
  { label: 'VM-based TEE 장점 — 기존 VM 그대로, 전체 OS 보호, 대용량 메모리' },
  { label: 'VM-based 단점 — 큰 TCB, attack surface, kernel bug 위험' },
  { label: '실무 선택 — 기밀 컴포넌트 SGX, 마이그레이션 VM-based, 하이브리드' },
];

const SGX_PROS = [
  { line: '✓ 작은 TCB (수십K LoC)', c: '#10b981' },
  { line: '✓ Attack surface 최소', c: '#10b981' },
  { line: '✓ Formal verification 가능', c: '#10b981' },
  { line: '✓ Per-application 격리', c: '#10b981' },
];

const SGX_CONS = [
  { line: '✗ 앱 재작성 필요 (enclave API)', c: '#ef4444' },
  { line: '✗ 제한된 기능 (no syscalls inside)', c: '#ef4444' },
  { line: '✗ 메모리 제약 (초기 128MB EPC)', c: '#ef4444' },
  { line: '✗ OS 수준 보호 없음 (앱만)', c: '#ef4444' },
];

const VM_PROS = [
  { line: '✓ 기존 VM 이미지 그대로 사용', c: '#10b981' },
  { line: '✓ 전체 OS + 앱 보호', c: '#10b981' },
  { line: '✓ 대용량 메모리 (TB+)', c: '#10b981' },
  { line: '✓ 모든 syscalls 사용 가능', c: '#10b981' },
];

const VM_CONS = [
  { line: '✗ 큰 TCB (OS + 드라이버 전부)', c: '#ef4444' },
  { line: '✗ Attack surface 넓음', c: '#ef4444' },
  { line: '✗ Kernel bug = 전체 침해', c: '#ef4444' },
  { line: '✗ Migration 복잡', c: '#ef4444' },
];

const CHOICES = [
  { name: '작은 기밀 컴포넌트', sub: 'SGX', c: '#6366f1' },
  { name: '기존 워크로드 마이그레이션', sub: 'VM-based (TDX, SEV-SNP)', c: '#10b981' },
  { name: '하이브리드', sub: 'gvisor SGX, VM + enclave', c: '#f59e0b' },
];

export default function SgxVsVmTeeViz() {
  const RENDER = [
    { title: 'SGX 장점', items: SGX_PROS, color: '#10b981' },
    { title: 'SGX 단점', items: SGX_CONS, color: '#ef4444' },
    { title: 'VM-based 장점', items: VM_PROS, color: '#10b981' },
    { title: 'VM-based 단점', items: VM_CONS, color: '#ef4444' },
  ];
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 && (() => {
            const r = RENDER[step];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={r.color}>
                {r.title}
              </text>
              {r.items.map((it, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={40} y={42 + i * 40} width={440} height={32} rx={5}
                    fill={`${it.c}10`} stroke={`${it.c}40`} strokeWidth={0.8} />
                  <text x={60} y={62 + i * 40} fontSize={11} fontWeight={600} fill={it.c}>{it.line}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              실무 선택 가이드
            </text>
            {CHOICES.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={50} y={50 + i * 56} w={420} h={44}
                  label={c.name} sub={c.sub} color={c.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              조건/제약/위협 모델 따라 SGX와 VM-TEE를 결합 사용 권장
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
