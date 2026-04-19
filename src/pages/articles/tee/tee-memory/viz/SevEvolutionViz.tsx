import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  sme: '#9ca3af',
  sev: '#6366f1',
  ses: '#8b5cf6',
  snp: '#10b981',
  conf: '#0ea5e9',
  integ: '#f59e0b',
  attack: '#ef4444',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: '4세대 진화: SME → SEV → SEV-ES → SEV-SNP',
    body: '2016 SME(C-bit, 시스템 와이드) → 2017 SEV(VM별 키) → 2018 SEV-ES(레지스터 보호) → 2020 SEV-SNP(RMP 무결성).',
  },
  {
    label: '기능 매트릭스: 기밀성 vs 무결성',
    body: 'SME/SEV/SEV-ES = 기밀성만. SEV-SNP = 기밀성 + 무결성. RMP가 page remap·replay·interrupt injection 모두 방어.',
  },
  {
    label: 'RMP (Reverse Map Table) 구조',
    body: '시스템 물리 페이지마다 1개 엔트리: Assigned ASID, GPA, H/G mode, Validated. Hypervisor가 mapping 변경 시 RMP 체크 → 불일치면 #VC.',
  },
  {
    label: 'SEV-SNP가 막는 4가지 공격',
    body: 'Page remapping(매핑 변조) · Replay(이전 ciphertext 재사용) · Interrupt injection(가짜 IRQ) · Page swap(다른 페이지로 교체).',
  },
];

interface Gen { name: string; year: number; conf: boolean; integ: boolean; feature: string; color: string; }

const GENS: Gen[] = [
  { name: 'SME', year: 2016, conf: true, integ: false, feature: '페이지별 C-bit', color: C.sme },
  { name: 'SEV', year: 2017, conf: true, integ: false, feature: 'VM별 VEK', color: C.sev },
  { name: 'SEV-ES', year: 2018, conf: true, integ: false, feature: '+ 레지스터 암호', color: C.ses },
  { name: 'SEV-SNP', year: 2020, conf: true, integ: true, feature: '+ RMP 무결성', color: C.snp },
];

function Timeline() {
  const x0 = 30;
  const span = 110;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">AMD SEV 4세대 진화</text>
      <line x1={x0} y1={66} x2={x0 + span * 3 + 80} y2={66} stroke={C.muted} strokeWidth={0.6} />
      {GENS.map((g, i) => {
        const x = x0 + i * span;
        return (
          <motion.g key={g.name} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12 }}>
            <circle cx={x + 40} cy={66} r={6} fill={g.color} />
            <text x={x + 40} y={45} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={g.color}>
              {g.name}
            </text>
            <text x={x + 40} y={56} textAnchor="middle" fontSize={8} fill={C.muted}>{g.year}</text>
            <rect x={x + 5} y={80} width={70} height={36} rx={4}
              fill={`${g.color}10`} stroke={g.color} strokeWidth={0.7} />
            <text x={x + 40} y={94} textAnchor="middle" fontSize={8} fill={g.color}>{g.feature}</text>
            <text x={x + 40} y={106} textAnchor="middle" fontSize={7} fill={C.muted}>
              {g.conf ? '기밀 ✓' : '기밀 X'} · {g.integ ? '무결 ✓' : '무결 X'}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

function FeatureMatrix() {
  const features = [
    { f: '메모리 기밀성', sme: true, sev: true, ses: true, snp: true },
    { f: 'VM 키 격리', sme: false, sev: true, ses: true, snp: true },
    { f: '레지스터 암호화', sme: false, sev: false, ses: true, snp: true },
    { f: '메모리 무결성 (RMP)', sme: false, sev: false, ses: false, snp: true },
    { f: 'Replay 방어', sme: false, sev: false, ses: false, snp: true },
  ];
  const cols = [
    { name: 'SME', color: C.sme, x: 220 },
    { name: 'SEV', color: C.sev, x: 280 },
    { name: 'ES', color: C.ses, x: 340 },
    { name: 'SNP', color: C.snp, x: 400 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">기능 매트릭스 — 세대별 capability</text>
      {cols.map((c) => (
        <text key={c.name} x={c.x} y={32} textAnchor="middle"
          fontSize={9.5} fontWeight={700} fill={c.color}>{c.name}</text>
      ))}
      {features.map((row, i) => {
        const y = 42 + i * 16;
        return (
          <motion.g key={row.f} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={20} y={y} width={440} height={14} rx={2}
              fill="var(--border)" opacity={0.1} />
            <text x={28} y={y + 10} fontSize={9} fontWeight={500} fill="var(--foreground)">{row.f}</text>
            {cols.map((c, ci) => {
              const has = [row.sme, row.sev, row.ses, row.snp][ci];
              return (
                <text key={c.name} x={c.x} y={y + 11} textAnchor="middle"
                  fontSize={11} fontWeight={700} fill={has ? c.color : C.muted}>
                  {has ? '\u2713' : '\u00b7'}
                </text>
              );
            })}
          </motion.g>
        );
      })}
    </g>
  );
}

const RMP_FIELDS = [
  { name: 'Assigned', desc: '할당된 ASID', color: C.sev },
  { name: 'GPA', desc: 'Guest Physical Address', color: C.ses },
  { name: 'Hypervisor', desc: 'H/G mode', color: C.snp },
  { name: 'Validated', desc: '유효성 비트', color: C.integ },
];

function RmpStructure() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.snp}>
        RMP — Reverse Map Table (page당 1 entry)
      </text>
      {RMP_FIELDS.map((f, i) => {
        const x = 25 + i * 108;
        return (
          <motion.g key={f.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={28} width={100} height={42} rx={5}
              fill={`${f.color}12`} stroke={f.color} strokeWidth={0.8} />
            <text x={x + 50} y={46} textAnchor="middle" fontSize={10} fontWeight={700} fill={f.color}>
              {f.name}
            </text>
            <text x={x + 50} y={60} textAnchor="middle" fontSize={7.5} fill={C.muted}>{f.desc}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={82} width={440} height={28} rx={5}
          fill={`${C.attack}10`} stroke={C.attack} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={32} y={97} fontSize={9} fontWeight={700} fill={C.attack}>
          Hypervisor가 mapping 변경 시:
        </text>
        <text x={32} y={107} fontSize={8.5} fill={C.muted}>
          → RMP 체크 → 불일치 → #VC 예외 → guest VM이 직접 감지
        </text>
      </motion.g>
    </g>
  );
}

const ATTACKS = [
  { name: 'Page remapping', desc: '하이퍼바이저가 GPA→PA 매핑 변조', color: C.attack },
  { name: 'Replay attack', desc: '이전 ciphertext 재사용', color: C.attack },
  { name: 'Interrupt injection', desc: '가짜 IRQ로 게스트 흐름 변조', color: C.attack },
  { name: 'Page swap', desc: '다른 valid 페이지로 교체', color: C.attack },
];

function AttackList() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.snp}>
        SEV-SNP가 차단하는 4가지 공격
      </text>
      {ATTACKS.map((a, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const x = 20 + col * 225;
        const y = 28 + row * 50;
        return (
          <motion.g key={a.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={y} width={215} height={42} rx={5}
              fill={`${a.color}08`} stroke={a.color} strokeWidth={0.8} strokeDasharray="3 2" />
            <text x={x + 10} y={y + 16} fontSize={10} fontWeight={700} fill={a.color}>X {a.name}</text>
            <text x={x + 10} y={y + 32} fontSize={8} fill={C.muted}>{a.desc}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function SevEvolutionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Timeline />}
          {step === 1 && <FeatureMatrix />}
          {step === 2 && <RmpStructure />}
          {step === 3 && <AttackList />}
        </svg>
      )}
    </StepViz>
  );
}
