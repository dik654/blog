import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const C = {
  meta: '#8b5cf6',
  tcb: '#0ea5e9',
  user: '#10b981',
  measure: '#f59e0b',
  sig: '#ef4444',
};

const STEPS = [
  { label: '메타 — version, policy, family/image', body: 'Report 자체 식별 + guest policy bits' },
  { label: 'TCB versions — bootloader/tee/snp/microcode', body: 'platform_tcb + reported_tcb 두 종류' },
  { label: 'User-controlled — report_data (64B nonce)', body: 'Verifier가 challenge로 채워 넣음 → replay 방어' },
  { label: 'Measurement — launch digest (SHA-384, 48B)', body: '런치 시점 누적 측정값 → 의도 검증' },
  { label: 'Signature — VCEK가 ECDSA P-384 서명 (512B)', body: '칩 + TCB 결속된 키로 보고서 무결성 보장' },
];

const FIELDS = [
  { group: 0, label: 'version', sub: 'u32' },
  { group: 0, label: 'policy', sub: 'u64 flags' },
  { group: 0, label: 'family_id', sub: '16B' },
  { group: 0, label: 'image_id', sub: '16B' },
  { group: 0, label: 'vmpl', sub: 'u32' },
  { group: 1, label: 'platform_tcb', sub: 'TCB ver' },
  { group: 1, label: 'reported_tcb', sub: 'TCB ver' },
  { group: 1, label: 'platform_info', sub: 'SMT/TSME' },
  { group: 2, label: 'report_data', sub: '64B nonce' },
  { group: 2, label: 'host_data', sub: '32B' },
  { group: 3, label: 'measurement', sub: '48B SHA-384' },
  { group: 3, label: 'id_key_digest', sub: '48B' },
  { group: 3, label: 'author_key_digest', sub: '48B' },
  { group: 4, label: 'chip_id', sub: '64B' },
  { group: 4, label: 'cpuid_1_eax', sub: 'family/model' },
  { group: 4, label: 'signature', sub: '512B ECDSA' },
];

const GROUP_COLORS = [C.meta, C.tcb, C.user, C.measure, C.sig];

export default function AttestReportFieldsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            struct snp_attestation_report (1184 bytes)
          </text>

          {FIELDS.map((f, i) => {
            const col = i % 4;
            const row = Math.floor(i / 4);
            const x = 20 + col * 115;
            const y = 26 + row * 42;
            const color = GROUP_COLORS[f.group];
            const highlight = step === f.group;
            return (
              <motion.g key={f.label}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <motion.rect x={x} y={y} width={108} height={36} rx={4}
                  animate={{
                    fill: highlight ? `${color}30` : `${color}10`,
                    stroke: color,
                    strokeWidth: highlight ? 1.6 : 0.5,
                  }} />
                <text x={x + 54} y={y + 16} textAnchor="middle" fontSize={9} fontWeight={700} fill={color}>{f.label}</text>
                <text x={x + 54} y={y + 28} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{f.sub}</text>
              </motion.g>
            );
          })}

          <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} key={`note-${step}`}>
            <ModuleBox x={20} y={216} w={440} h={20}
              label={
                step === 0 ? '메타: 보고서 자체 + guest 신원'
                  : step === 1 ? 'TCB: 펌웨어 버전 강제 — outdated 거부'
                  : step === 2 ? 'report_data: verifier가 nonce 주입 → freshness'
                  : step === 3 ? 'measurement: launch digest 검증 핵심'
                  : 'signature: VCEK가 보고서 끝에 서명'
              }
              sub=""
              color={GROUP_COLORS[step]} />
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
