import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const KVM_CMDS = [
  { name: 'SEV_INIT', code: '0x01', desc: '초기화' },
  { name: 'LAUNCH_START', code: '0x02', desc: '런치 시작' },
  { name: 'LAUNCH_UPDATE', code: '0x03', desc: '데이터 전송' },
  { name: 'LAUNCH_MEASURE', code: '0x04', desc: '측정값 획득' },
  { name: 'LAUNCH_FINISH', code: '0x05', desc: '런치 완료' },
];

const DEV_CMDS = [
  { name: 'PLATFORM_RESET', code: '0x01', desc: '플랫폼 초기화' },
  { name: 'PLATFORM_STATUS', code: '0x02', desc: '상태 조회' },
  { name: 'PEK_GEN', code: '0x03', desc: '키 생성' },
  { name: 'PDH_GEN', code: '0x05', desc: 'DH 키 생성' },
];

const STEPS = [
  { label: 'KVM SEV ioctl — 게스트 관리', body: 'KVM_SEV_INIT → LAUNCH_START → UPDATE_DATA → MEASURE → FINISH 순서로 게스트 생성' },
  { label: '/dev/sev — 플랫폼 관리', body: '플랫폼 리셋, 상태 조회, PEK/PDH 키 생성 등 보안 플랫폼 직접 제어' },
  { label: 'GHCB 기반 VMEXIT 처리', body: 'SEV-ES에서 레지스터가 암호화됨 → GHCB(Guest-Host Communication Block)로 제한된 정보만 교환' },
];

export default function KVMIoctlViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* KVM ioctl table */}
          <motion.g animate={{ opacity: step === 0 ? 1 : 0.15 }}>
            <rect x={15} y={10} width={240} height={22} rx={4} fill={`${C.indigo}12`} stroke={C.indigo} strokeWidth={1} />
            <text x={135} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.indigo}>KVM SEV ioctl</text>
            {KVM_CMDS.map((c, i) => {
              const y = 36 + i * 22;
              return (
                <g key={c.name}>
                  <rect x={15} y={y} width={240} height={20} rx={3}
                    fill={i % 2 === 0 ? `${C.indigo}05` : 'transparent'} />
                  <text x={25} y={y + 14} fontSize={10} fontWeight={500} fill={C.indigo} fontFamily="monospace">{c.name}</text>
                  <text x={150} y={y + 14} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{c.code}</text>
                  <text x={200} y={y + 14} fontSize={10} fill="var(--foreground)">{c.desc}</text>
                </g>
              );
            })}
          </motion.g>
          {/* /dev/sev table */}
          <motion.g animate={{ opacity: step === 1 ? 1 : 0.15 }}>
            <rect x={280} y={10} width={240} height={22} rx={4} fill={`${C.green}12`} stroke={C.green} strokeWidth={1} />
            <text x={400} y={25} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.green}>/dev/sev 명령어</text>
            {DEV_CMDS.map((c, i) => {
              const y = 36 + i * 22;
              return (
                <g key={c.name}>
                  <rect x={280} y={y} width={240} height={20} rx={3}
                    fill={i % 2 === 0 ? `${C.green}05` : 'transparent'} />
                  <text x={290} y={y + 14} fontSize={10} fontWeight={500} fill={C.green} fontFamily="monospace">{c.name}</text>
                  <text x={420} y={y + 14} fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{c.code}</text>
                  <text x={470} y={y + 14} fontSize={10} fill="var(--foreground)">{c.desc}</text>
                </g>
              );
            })}
          </motion.g>
          {/* GHCB diagram (step 2) */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0.12 }}>
            <rect x={100} y={140} width={100} height={30} rx={6}
              fill={`${C.amber}12`} stroke={C.amber} strokeWidth={1.3} />
            <text x={150} y={159} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.amber}>게스트 VM</text>
            <line x1={200} y1={155} x2={260} y2={155} stroke={C.amber} strokeWidth={1.2}
              strokeDasharray="4 3" markerEnd="url(#kvmArr)" />
            <rect x={260} y={140} width={80} height={30} rx={6}
              fill={`${C.amber}15`} stroke={C.amber} strokeWidth={1.5} />
            <text x={300} y={159} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.amber}>GHCB</text>
            <line x1={340} y1={155} x2={390} y2={155} stroke={C.amber} strokeWidth={1.2}
              strokeDasharray="4 3" markerEnd="url(#kvmArr)" />
            <rect x={390} y={140} width={100} height={30} rx={6}
              fill={`${C.indigo}12`} stroke={C.indigo} strokeWidth={1.3} />
            <text x={440} y={159} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.indigo}>하이퍼바이저</text>
          </motion.g>
          <defs>
            <marker id="kvmArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
