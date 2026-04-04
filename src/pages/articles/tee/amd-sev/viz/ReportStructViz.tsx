import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const GROUPS = [
  {
    label: '게스트 식별', color: C.indigo,
    fields: [
      { name: 'version', size: 'u32' }, { name: 'guest_svn', size: 'u32' },
      { name: 'policy', size: 'GuestPolicy' }, { name: 'family_id', size: '[u8;16]' },
      { name: 'image_id', size: '[u8;16]' }, { name: 'vmpl', size: 'u32' },
    ],
  },
  {
    label: '플랫폼 & 측정', color: C.green,
    fields: [
      { name: 'signature_algo', size: 'u32' }, { name: 'current_tcb', size: 'TcbVersion' },
      { name: 'platform_info', size: 'u64' }, { name: 'measurement', size: '[u8;48]' },
    ],
  },
  {
    label: '데이터 & 서명', color: C.amber,
    fields: [
      { name: 'host_data', size: '[u8;32]' }, { name: 'report_data', size: '[u8;64]' },
      { name: 'chip_id', size: '[u8;64]' }, { name: 'signature', size: '[u8;512]' },
    ],
  },
];

const STEPS = [
  { label: 'AttestationReport 구조 개요', body: '14개 필드로 게스트 신원, 측정값, 서명을 캡슐화' },
  { label: '게스트 식별 필드', body: 'version, guest_svn, policy, family_id, image_id, vmpl' },
  { label: '측정값 — 핵심 필드', body: 'measurement [48 bytes] = SHA-384 런치 다이제스트, current_tcb = 펌웨어 버전' },
  { label: '서명 — 신뢰 앵커', body: 'signature [512 bytes] = PSP의 VCEK 개인키 ECDSA-P384 서명' },
];

export default function ReportStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={20} y={18} fontSize={11} fontWeight={700} fill="var(--foreground)">struct AttestationReport</text>
          {GROUPS.map((g, gi) => {
            const x = 10 + gi * 178;
            const active = step === 0 || step === gi + 1;
            return (
              <motion.g key={g.label} animate={{ opacity: active ? 1 : 0.2 }}>
                <rect x={x} y={28} width={170} height={140} rx={6}
                  fill={active ? `${g.color}08` : 'var(--card)'}
                  stroke={g.color} strokeWidth={active ? 1.3 : 0.6} />
                <text x={x + 85} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={g.color}>{g.label}</text>
                {g.fields.map((f, fi) => {
                  const fy = 52 + fi * 18;
                  const isMeasure = f.name === 'measurement';
                  const isSig = f.name === 'signature';
                  return (
                    <g key={f.name}>
                      {(isMeasure && step === 2) && (
                        <rect x={x + 4} y={fy - 2} width={162} height={16} rx={3}
                          fill={`${C.green}20`} stroke={C.green} strokeWidth={1} />
                      )}
                      {(isSig && step === 3) && (
                        <rect x={x + 4} y={fy - 2} width={162} height={16} rx={3}
                          fill={`${C.amber}20`} stroke={C.amber} strokeWidth={1} />
                      )}
                      <text x={x + 10} y={fy + 10} fontSize={10} fontWeight={500}
                        fill={(isMeasure && step === 2) || (isSig && step === 3) ? g.color : 'var(--foreground)'}>{f.name}</text>
                      <text x={x + 160} y={fy + 10} textAnchor="end" fontSize={10}
                        fill="var(--muted-foreground)">{f.size}</text>
                    </g>
                  );
                })}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
