import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  init: '#6b7280',
  pcr: '#10b981',
  attest: '#6366f1',
  key: '#f59e0b',
  seal: '#ec4899',
  app: '#8b5cf6',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'TPM 2.0 명령어 카테고리',
    body: 'Init/PCR/Attestation/Key/Sealed Storage 5개 그룹. 각 명령은 root of trust(EK)에서 파생된 핸들로 권한이 검증된다.',
  },
  {
    label: 'PCR 인덱스 23개 매핑',
    body: 'PCR[0-7] platform firmware, [8-15] OS·bootloader, [16] debug(resettable), [17-22] DRTM, [23] application-defined.',
  },
  {
    label: 'PCR Bank: 다중 해시 알고리즘',
    body: 'TPM 2.0은 SHA-256(표준), SHA-384(고강도), SM3(중국 표준), SHA-1(legacy)를 동시 운용. 같은 측정이 여러 bank에 누적된다.',
  },
  {
    label: 'TPM 사용 사례 + Linux 도구',
    body: 'BitLocker·LUKS·tboot·SSH·Remote attestation·EK identity. tpm2-tools(CLI), tpm2-tss(stack), tpm2-abrmd(broker)가 표준.',
  },
];

interface Cmd {
  name: string;
  desc: string;
  color: string;
}

const CMDS: { group: string; color: string; cmds: Cmd[] }[] = [
  { group: 'Init', color: C.init, cmds: [
    { name: 'TPM2_Startup', desc: 'TPM 초기화', color: C.init },
    { name: 'TPM2_Shutdown', desc: 'TPM 종료', color: C.init },
  ]},
  { group: 'PCR', color: C.pcr, cmds: [
    { name: 'TPM2_PCR_Extend', desc: 'PCR 확장', color: C.pcr },
    { name: 'TPM2_PCR_Read', desc: 'PCR 조회', color: C.pcr },
    { name: 'TPM2_PCR_Reset', desc: '리셋(재부팅)', color: C.pcr },
    { name: 'TPM2_PCR_Event', desc: '로그+extend', color: C.pcr },
  ]},
  { group: 'Attestation', color: C.attest, cmds: [
    { name: 'TPM2_Quote', desc: 'PCR 서명', color: C.attest },
    { name: 'TPM2_Certify', desc: 'Key 인증', color: C.attest },
    { name: 'TPM2_GetRandom', desc: '난수 생성', color: C.attest },
  ]},
  { group: 'Key Management', color: C.key, cmds: [
    { name: 'TPM2_CreatePrimary', desc: 'Primary key', color: C.key },
    { name: 'TPM2_Sign', desc: '서명', color: C.key },
    { name: 'TPM2_Load', desc: 'Key 로드', color: C.key },
  ]},
  { group: 'Sealed Storage', color: C.seal, cmds: [
    { name: 'TPM2_PolicyPCR', desc: 'PCR 정책', color: C.seal },
    { name: 'TPM2_Unseal', desc: 'Sealed 해제', color: C.seal },
  ]},
];

function CommandGroups() {
  return (
    <g>
      {CMDS.map((grp, gi) => {
        const gx = 18 + gi * 92;
        return (
          <motion.g key={grp.group} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: gi * 0.08 }}>
            <rect x={gx} y={20} width={86} height={20} rx={3}
              fill={grp.color} opacity={0.85} />
            <text x={gx + 43} y={34} textAnchor="middle" fontSize={9}
              fontWeight={700} fill="#fff">{grp.group}</text>
            {grp.cmds.map((c, ci) => (
              <motion.g key={c.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + gi * 0.08 + ci * 0.05 }}>
                <rect x={gx} y={46 + ci * 22} width={86} height={20} rx={3}
                  fill={`${grp.color}10`} stroke={`${grp.color}50`} strokeWidth={0.6} />
                <text x={gx + 4} y={57 + ci * 22} fontSize={7.5} fontFamily="monospace"
                  fontWeight={600} fill={grp.color}>{c.name.replace('TPM2_', '')}</text>
                <text x={gx + 4} y={65 + ci * 22} fontSize={6.5} fill={C.muted}>{c.desc}</text>
              </motion.g>
            ))}
          </motion.g>
        );
      })}
    </g>
  );
}

const PCR_RANGES = [
  { range: '0-7', label: 'Platform firmware', x: 20, w: 130, color: C.init },
  { range: '8-15', label: 'OS + bootloader', x: 158, w: 130, color: C.pcr },
  { range: '16', label: 'Debug (resettable)', x: 296, w: 60, color: '#a78bfa' },
  { range: '17-22', label: 'DRTM (Dynamic RoT)', x: 360, w: 80, color: C.attest },
  { range: '23', label: 'App-defined', x: 444, w: 30, color: C.seal },
];

function PcrIndexMap() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">PCR 인덱스 23개 (TPM 2.0)</text>
      {PCR_RANGES.map((r, i) => (
        <motion.g key={r.range} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={r.x} y={28} width={r.w - 4} height={36} rx={5}
            fill={`${r.color}18`} stroke={r.color} strokeWidth={1} />
          <text x={r.x + (r.w - 4) / 2} y={46} textAnchor="middle"
            fontSize={11} fontWeight={700} fontFamily="monospace" fill={r.color}>
            {r.range}
          </text>
          <text x={r.x + (r.w - 4) / 2} y={58} textAnchor="middle"
            fontSize={7.5} fill={C.muted}>{r.label}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={240} y={84} textAnchor="middle" fontSize={9.5} fill={C.muted}>
          PCR[i] = SHA-256(PCR[i] || measurement) — 단방향 누적
        </text>
        <text x={240} y={100} textAnchor="middle" fontSize={9} fill={C.muted}>
          Reset 불가 (PCR[16] 제외) → 부팅 무결성 보장
        </text>
      </motion.g>
    </g>
  );
}

const BANKS = [
  { name: 'SHA-1', bits: 160, status: 'legacy', color: '#9ca3af' },
  { name: 'SHA-256', bits: 256, status: '표준', color: C.pcr },
  { name: 'SHA-384', bits: 384, status: '고강도', color: C.attest },
  { name: 'SM3', bits: 256, status: '중국 표준', color: C.seal },
];

function PcrBanks() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">PCR Bank — 동시에 여러 알고리즘으로 측정</text>
      {BANKS.map((b, i) => {
        const x = 20 + i * 115;
        return (
          <motion.g key={b.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={28} width={108} height={70} rx={6}
              fill={`${b.color}12`} stroke={b.color} strokeWidth={1} />
            <text x={x + 54} y={48} textAnchor="middle" fontSize={11}
              fontWeight={700} fill={b.color}>{b.name}</text>
            <text x={x + 54} y={64} textAnchor="middle" fontSize={9}
              fill={C.muted}>{b.bits}-bit</text>
            <text x={x + 54} y={88} textAnchor="middle" fontSize={9}
              fontWeight={600} fill={b.color}>{b.status}</text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={114} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        같은 측정 → 모든 bank의 PCR에 병렬 누적
      </motion.text>
    </g>
  );
}

const USE_CASES = [
  { name: 'BitLocker', desc: 'Windows 디스크 암호화', color: C.attest },
  { name: 'LUKS+TPM2', desc: 'Linux 디스크 암호화', color: C.pcr },
  { name: 'tboot', desc: 'Intel TXT 측정 부팅', color: C.app },
  { name: 'SSH key', desc: 'TPM-bound key', color: C.key },
  { name: 'Remote Attest', desc: 'Quote 기반 검증', color: C.attest },
  { name: 'EK Identity', desc: 'Endorsement Key', color: C.seal },
];

function UseCasesAndTools() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">사용 사례 + Linux 도구</text>
      {USE_CASES.map((u, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 150;
        const y = 24 + row * 30;
        return (
          <motion.g key={u.name} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}>
            <rect x={x} y={y} width={140} height={26} rx={4}
              fill={`${u.color}12`} stroke={`${u.color}50`} strokeWidth={0.6} />
            <text x={x + 8} y={y + 12} fontSize={9} fontWeight={700} fill={u.color}>{u.name}</text>
            <text x={x + 8} y={y + 22} fontSize={7.5} fill={C.muted}>{u.desc}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={88} width={440} height={24} rx={4}
          fill={`${C.key}10`} stroke={C.key} strokeWidth={0.8} />
        <text x={32} y={104} fontSize={9} fontFamily="monospace" fontWeight={600} fill={C.key}>
          $ tpm2_pcrread sha256:0,1,4,7  &nbsp; $ tpm2_quote -c primary.ctx -l sha256:0,4,7
        </text>
      </motion.g>
    </g>
  );
}

export default function TpmCommandsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <CommandGroups />}
          {step === 1 && <PcrIndexMap />}
          {step === 2 && <PcrBanks />}
          {step === 3 && <UseCasesAndTools />}
        </svg>
      )}
    </StepViz>
  );
}
