import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'TEE = Trusted Execution Environment — CPU 하드웨어가 강제하는 격리 환경' },
  { label: '속성 1: Confidentiality — 메모리 암호화로 외부는 암호문만 관측' },
  { label: '속성 2: Integrity — 변조 탐지, 공격 시 실행 중단' },
  { label: '속성 3: Attestation — 원격 당사자에게 실행 코드 증명' },
  { label: '속성 4 (implicit): Tamper resistance — 물리 공격 방어 (제한적)' },
  { label: 'TEE vs 일반 VM — 메모리 암호화/Host 차단/원격 증명에서 결정적 차이' },
];

const ATTRS = [
  { name: 'Confidentiality', sub: '기밀성', color: '#6366f1' },
  { name: 'Integrity', sub: '무결성', color: '#10b981' },
  { name: 'Attestation', sub: '증명', color: '#f59e0b' },
  { name: 'Tamper resistance', sub: '물리 공격 방어', color: '#0ea5e9' },
];

const ATTR_DETAILS: Record<number, string[]> = {
  1: [
    'TEE 내부 메모리가 AES로 암호화됨',
    '외부 (Host OS, Hypervisor)는 암호문만 관측 가능',
    'CPU 캐시는 평문 유지 (성능 위해)',
    '메모리 컨트롤러 내장 AES 엔진이 실시간 처리',
  ],
  2: [
    '변조 탐지 (MAC, Merkle tree)',
    '공격 시도 시 실행 중단 (machine check abort)',
    'Replay 공격 방어 (counter / version)',
    'Memory remap 공격 차단 (EPCM, RMP, S-EPT)',
  ],
  3: [
    'TEE가 "나 이 코드 실행 중" 원격 증명',
    'Manufacturer 서명된 attestation key 사용',
    '원격 당사자가 암호학적으로 검증 가능',
    'Nonce 포함으로 replay 방어',
  ],
  4: [
    '물리 공격 방어 (제한적)',
    'Cold boot, DRAM probe',
    '버스 스니핑 (encrypted bus)',
    '주의: decapping, EM analysis는 방어 어려움',
  ],
};

const COMPARE_ROWS = [
  { item: '메모리 암호화', vm: 'X', tee: 'O', cVm: '#ef4444', cTee: '#10b981' },
  { item: 'Host 메모리 접근', vm: 'O', tee: 'X', cVm: '#ef4444', cTee: '#10b981' },
  { item: 'Hypervisor 신뢰', vm: '필요', tee: '불필요', cVm: '#ef4444', cTee: '#10b981' },
  { item: '원격 증명', vm: 'X', tee: 'O', cVm: '#ef4444', cTee: '#10b981' },
  { item: 'CPU TCB 포함', vm: 'X', tee: 'O', cVm: '#6b7280', cTee: '#10b981' },
];

export default function TEEDefinitionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Trusted Execution Environment
            </text>
            {ATTRS.map((a, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.12 }}>
                <ModuleBox x={20 + (i % 2) * 245} y={50 + Math.floor(i / 2) * 75}
                  w={235} h={62} label={a.name} sub={a.sub} color={a.color} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              4가지 속성을 모두 갖춰야 진정한 TEE
            </text>
          </g>)}
          {step >= 1 && step <= 4 && (() => {
            const idx = step;
            const attr = ATTRS[idx - 1];
            return (<g>
              <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={attr.color}>
                속성 {idx}: {attr.name}
              </text>
              {ATTR_DETAILS[idx].map((d, i) => (
                <motion.g key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}>
                  <rect x={40} y={42 + i * 38} width={440} height={30} rx={5}
                    fill={`${attr.color}10`} stroke={`${attr.color}40`} strokeWidth={0.8} />
                  <rect x={40} y={42 + i * 38} width={4} height={30} fill={attr.color} />
                  <text x={60} y={62 + i * 38} fontSize={10.5}
                    fill="var(--foreground)">{d}</text>
                </motion.g>
              ))}
            </g>);
          })()}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              TEE vs 일반 VM 비교
            </text>
            <rect x={30} y={36} width={460} height={22} rx={3} fill="#6b728020" />
            <text x={155} y={51} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
            <text x={325} y={51} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">일반 VM</text>
            <text x={425} y={51} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">TEE</text>
            {COMPARE_ROWS.map((r, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={30} y={62 + i * 28} width={460} height={26} rx={3}
                  fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
                <text x={155} y={79 + i * 28} textAnchor="middle"
                  fontSize={10} fill="var(--foreground)">{r.item}</text>
                <text x={325} y={79 + i * 28} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill={r.cVm}>{r.vm}</text>
                <text x={425} y={79 + i * 28} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill={r.cTee}>{r.tee}</text>
              </motion.g>
            ))}
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
