import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  cve: '#ef4444',
  defense: '#10b981',
  ver: '#0ea5e9',
};

const STEPS = [
  { label: 'CVE-2018-8935 — Master Chain of Trust 우회', body: 'ASP firmware RCE → microcode 업데이트로 대응' },
  { label: 'CVE-2019-9836 — Spectre-like timing 누출', body: 'ASP 메모리 접근 timing → 특정 펌웨어 영향' },
  { label: 'AMD SB-1051 (2022) — SEV replay', body: 'SEV-SNP pre-fix replay → Milan/Genoa 패치' },
  { label: '방어 — signed + sealed + TCB versioning', body: 'AMD-only 업데이트, anti-rollback, attestation 강제' },
];

const CVES = [
  { id: 'CVE-2018-8935', sub: 'RCE in ASP firmware', year: '2018' },
  { id: 'CVE-2019-9836', sub: 'Timing side channel', year: '2019' },
  { id: 'AMD SB-1051', sub: 'SEV replay vulnerability', year: '2022' },
];

const DEFENSES = [
  { label: 'AMD-only update', sub: 'firmware 변경 가능 = AMD' },
  { label: 'Signed + Sealed', sub: 'anti-rollback 강제' },
  { label: 'TCB Versioning', sub: 'attestation에 포함' },
  { label: '클라우드 강제 패치', sub: 'min TCB 정책' },
];

export default function ASPTCBIssuesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.cve}>
            ASP는 SEV의 Trust Anchor → 펌웨어 버그 = 시스템 붕괴
          </text>

          {CVES.map((cve, i) => {
            const active = step === i;
            return (
              <motion.g key={cve.id}
                animate={{ opacity: active ? 1 : 0.3 }}>
                <AlertBox x={20} y={28 + i * 50} w={440} h={42} label={cve.id} sub={`${cve.sub} (${cve.year})`} color={C.cve} />
              </motion.g>
            );
          })}

          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <text x={20} y={196} fontSize={9} fontWeight={700} fill={C.defense}>방어</text>
              {DEFENSES.map((d, i) => (
                <motion.g key={d.label}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}>
                  <ActionBox x={20 + i * 115} y={204} w={108} h={32} label={d.label} sub={d.sub} color={C.defense} />
                </motion.g>
              ))}
            </motion.g>
          )}

          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={`note-${step}`}>
              <DataBox x={60} y={196} w={360} h={32}
                label={
                  step === 0 ? 'AMD microcode update로 mitigation' :
                  step === 1 ? '특정 펌웨어 버전 → 강제 업그레이드 필요' :
                  'Milan/Genoa firmware로 패치됨'
                }
                color={C.ver} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
