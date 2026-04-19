import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'PK (Platform Key) — OEM 설정, 최상위 신뢰 앵커, 자기 자신 서명 필요' },
  { label: 'KEK (Key Exchange Key) — PK 서명, db/dbx 수정 권한' },
  { label: 'db (Authorized) — KEK 서명, 허용 서명자/해시 화이트리스트' },
  { label: 'dbx (Forbidden) — 차단 서명자/해시 블랙리스트, 정기 업데이트' },
  { label: '부팅 검증 — bootloader 서명 ↔ db OK + dbx NOT OK 통과 시 실행' },
  { label: 'Linux 진입 — shim → GRUB → kernel → modules 단계별 서명 검증' },
];

const KEYS = [
  { name: 'PK', sub: '최상위', color: '#ef4444', y: 30 },
  { name: 'KEK', sub: '중간 권한', color: '#f59e0b', y: 65 },
  { name: 'db', sub: '허용 리스트', color: '#10b981', y: 100 },
  { name: 'dbx', sub: '차단 리스트', color: '#0ea5e9', y: 135 },
];

const KEY_DETAILS: { color: string; details: string[] }[] = [
  {
    color: '#ef4444',
    details: [
      '제조사(OEM)가 설정',
      '최상위 신뢰 앵커',
      'PK 수정하려면 PK 서명 필요',
      '단 한 개만 존재',
    ],
  },
  {
    color: '#f59e0b',
    details: [
      'PK로 서명됨',
      'db/dbx 수정 권한',
      '예: Microsoft KEK, OEM KEK',
      '여러 개 존재 가능',
    ],
  },
  {
    color: '#10b981',
    details: [
      'KEK로 서명됨',
      '허용된 서명자·해시 리스트',
      '예: Microsoft Corporation Windows Production PCA',
      '확장 가능 (custom keys)',
    ],
  },
  {
    color: '#0ea5e9',
    details: [
      '차단된 서명자·해시 리스트',
      '알려진 취약 bootloader 차단',
      'Regular update (Windows Update, fwupd)',
      'dbx 우선순위 > db',
    ],
  },
];

const VERIFY_STEPS = [
  { line: '1) UEFI firmware가 bootloader 서명 확인', c: '#6366f1' },
  { line: '2) db에 서명자 있는지', c: '#10b981' },
  { line: '3) dbx에 해시 없는지', c: '#0ea5e9' },
  { line: '4) 통과 → 실행, 실패 → 차단', c: '#f59e0b' },
];

const LINUX_CHAIN = [
  { name: 'shim', sub: 'Microsoft 서명', c: '#6366f1' },
  { name: 'GRUB', sub: 'Linux vendor key', c: '#10b981' },
  { name: 'kernel', sub: 'GRUB이 서명 검증', c: '#f59e0b' },
  { name: 'modules', sub: 'kernel이 검증', c: '#0ea5e9' },
];

export default function UefiSecureBootViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < 4 && (<g>
            <text x={130} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6b7280">키 계층</text>
            <text x={390} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={KEY_DETAILS[step].color}>
              {KEYS[step].name} 상세
            </text>
            {KEYS.map((k, i) => (
              <motion.g key={i} animate={{ opacity: i === step ? 1 : 0.22 }}>
                <ModuleBox x={20} y={k.y} w={220} h={28}
                  label={k.name} sub={k.sub} color={k.color} />
              </motion.g>
            ))}
            {KEY_DETAILS[step].details.map((d, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={260} y={32 + i * 40} width={250} height={32} rx={4}
                  fill={`${KEY_DETAILS[step].color}10`} stroke={`${KEY_DETAILS[step].color}40`} strokeWidth={0.8} />
                <text x={275} y={52 + i * 40} fontSize={9.5} fill="var(--foreground)">{d}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              부팅 시 검증 시퀀스
            </text>
            {VERIFY_STEPS.map((v, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}>
                <rect x={50} y={50 + i * 38} width={420} height={32} rx={5}
                  fill={`${v.c}10`} stroke={`${v.c}50`} strokeWidth={0.8} />
                <text x={70} y={71 + i * 38} fontSize={11} fontWeight={600} fill={v.c}>{v.line}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 5 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Linux 진입 — shim → GRUB → kernel → modules
            </text>
            {LINUX_CHAIN.map((c, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15 }}>
                <ModuleBox x={20 + (i % 2) * 245} y={50 + Math.floor(i / 2) * 70}
                  w={235} h={56} label={c.name} sub={c.sub} color={c.c} />
              </motion.g>
            ))}
            <text x={260} y={210} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              shim이 Microsoft 서명을 받아 Linux distro의 GRUB/kernel 신뢰 체인 시작
            </text>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
