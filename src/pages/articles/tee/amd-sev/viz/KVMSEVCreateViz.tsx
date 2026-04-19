import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  s1: '#8b5cf6',
  s2: '#0ea5e9',
  s3: '#10b981',
  s4: '#f59e0b',
  s5: '#ef4444',
  s6: '#6366f1',
  s7: '#14b8a6',
};

const STEPS = [
  { label: '① /dev/kvm 오픈 + KVM_CREATE_VM (X86_SEV_VM)', body: 'kvm_fd 확보 + SEV 타입 VM 생성' },
  { label: '② KVM_SEV_INIT — SEV 컨텍스트 초기화', body: 'KVM_MEMORY_ENCRYPT_OP ioctl로 진입' },
  { label: '③ KVM_SEV_LAUNCH_START — policy + DH cert', body: 'SEV_POLICY_ES | SEV 등 + 세션 데이터' },
  { label: '④ KVM_SEV_LAUNCH_UPDATE_DATA — 페이지 암호화', body: 'guest_mem 영역을 VEK로 암호화' },
  { label: '⑤ KVM_SEV_LAUNCH_MEASURE — measurement 획득', body: 'attestation 검증용 digest' },
  { label: '⑥ KVM_SEV_LAUNCH_FINISH — 실행 가능 상태', body: 'frozen 후 vCPU 실행 준비' },
  { label: '⑦ KVM_RUN — vCPU 스레드별 실행', body: 'pthread_create로 vCPU 루프 시작' },
];

const CMDS = [
  { label: 'KVM_CREATE_VM', sub: 'X86_SEV_VM', color: C.s1 },
  { label: 'KVM_SEV_INIT', sub: 'context init', color: C.s2 },
  { label: 'LAUNCH_START', sub: 'policy + DH cert', color: C.s3 },
  { label: 'LAUNCH_UPDATE_DATA', sub: '페이지 암호화', color: C.s4 },
  { label: 'LAUNCH_MEASURE', sub: 'digest', color: C.s5 },
  { label: 'LAUNCH_FINISH', sub: 'frozen', color: C.s6 },
  { label: 'KVM_RUN', sub: 'vCPU loop', color: C.s7 },
];

export default function KVMSEVCreateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            arch/x86/kvm/svm/sev.c — KVM SEV ioctl 시퀀스
          </text>

          {CMDS.map((c, i) => {
            const active = step === i;
            const past = step > i;
            return (
              <motion.g key={c.label}
                animate={{ opacity: active ? 1 : past ? 0.5 : 0.2 }}>
                <ActionBox x={20} y={26 + i * 26} w={440} h={22}
                  label={`${i + 1}. ${c.label}`} sub={c.sub} color={c.color} />
                {past && (
                  <text x={444} y={42 + i * 26} textAnchor="end" fontSize={9} fontWeight={700} fill={c.color}>✓</text>
                )}
              </motion.g>
            );
          })}

          <motion.g key={`detail-${step}`} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <DataBox x={20} y={216} w={440} h={20}
              label={
                step === 0 ? 'kvm_fd = open("/dev/kvm") → vm_fd = ioctl(KVM_CREATE_VM)' :
                step === 1 ? 'sev_cmd.id = KVM_SEV_INIT → KVM_MEMORY_ENCRYPT_OP' :
                step === 2 ? 'kvm_sev_launch_start { policy, dh_uaddr, session_uaddr }' :
                step === 3 ? 'kvm_sev_launch_update_data { uaddr, len } → ASP 호출' :
                step === 4 ? 'measurement_buf로 SHA-256(launch digest) 반환' :
                step === 5 ? 'finalize → 더 이상 update 불가' :
                'each vCPU: pthread_create(kvm_run_vcpu)'
              }
              color={CMDS[step].color} outlined />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
