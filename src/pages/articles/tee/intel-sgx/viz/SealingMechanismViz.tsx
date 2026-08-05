import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  hw: '#10b981',
  key: '#f59e0b',
  enc: '#6366f1',
  blob: '#8b5cf6',
  mre: '#ec4899',
  mrs: '#0ea5e9',
  cpu: '#ef4444',
  use: '#14b8a6',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Sealing 4단계: EGETKEY → AES-GCM → Blob → 디스크',
    body: 'EGETKEY로 sealing key 파생 → AES-GCM 암호화(random IV) → Blob 구성([KEYID|policy|iv|ct|tag]) → 디스크 저장.',
  },
  {
    label: 'EGETKEY 키 파생식',
    body: 'key = HMAC-SHA256(Root_Seal_Key, KEY_POLICY || MR* || ISVPRODID || ISVSVN || KEYID nonce). Root key는 CPU fuse-burned, 외부 노출 X.',
  },
  {
    label: 'Unsealing 4단계: 역순',
    body: 'Blob 읽기 → KEYID 추출 → EGETKEY로 동일 키 재파생 → AES-GCM 복호화 + tag 검증. tag 불일치 시 변조 탐지.',
  },
  {
    label: 'Policy 비교: MRENCLAVE vs MRSIGNER',
    body: 'MRENCLAVE: 정확히 같은 enclave만 — 업데이트 시 데이터 유실(최고 보안). MRSIGNER: 같은 서명자 enclave면 — ISVSVN 이상 허용(유연).',
  },
  {
    label: 'CPU-specific Sealing 한계 + 활용',
    body: 'Seal Key는 CPU fuse 기반 → 다른 CPU 복원 불가 → KMS/vault 백업 필수. 활용: DB 키, 세션 토큰, 자격 증명, ML 가중치, 지갑 키.',
  },
];

interface FlowStep { n: number; label: string; sub: string; color: string; }

const SEAL_FLOW: FlowStep[] = [
  { n: 1, label: 'EGETKEY', sub: 'CPU 바운드 키 파생', color: C.hw },
  { n: 2, label: 'AES-GCM', sub: 'random IV + tag', color: C.enc },
  { n: 3, label: 'Blob 구성', sub: '[KEYID|pol|iv|ct|tag]', color: C.blob },
  { n: 4, label: '디스크 저장', sub: '재부팅 후 복원 가능', color: C.use },
];

const UNSEAL_FLOW: FlowStep[] = [
  { n: 1, label: 'Blob 읽기', sub: 'from disk', color: C.blob },
  { n: 2, label: 'KEYID 추출', sub: 'nonce 복원', color: C.key },
  { n: 3, label: 'EGETKEY (same key)', sub: '동일 파생식', color: C.hw },
  { n: 4, label: 'AES-GCM verify+decrypt', sub: 'tag 검증 → 변조 탐지', color: C.enc },
];

function FlowStrip({ steps, title, color }: { steps: FlowStep[]; title: string; color: string }) {
  const w = 105;
  const gap = 8;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>
      {steps.map((s, i) => {
        const x = 20 + i * (w + gap);
        return (
          <motion.g key={s.n} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={x} y={32} width={w} height={56} rx={6}
              fill={`${s.color}12`} stroke={s.color} strokeWidth={1} />
            <circle cx={x + 14} cy={46} r={9} fill={s.color} />
            <text x={x + 14} y={50} textAnchor="middle" fontSize={10} fontWeight={700} fill="#fff">
              {s.n}
            </text>
            <text x={x + 30} y={50} fontSize={9.5} fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x + w / 2} y={72} textAnchor="middle" fontSize={7.5} fill={C.muted}>{s.sub}</text>
          </motion.g>
        );
      })}
      {steps.slice(0, -1).map((_, i) => {
        const x = 20 + (i + 1) * w + i * gap - 2;
        return (
          <motion.path key={`a-${i}`} d={`M${x} 60 L${x + gap + 4} 60`}
            stroke={C.muted} strokeWidth={1} markerEnd="url(#arrSeal)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.12 }} />
        );
      })}
      <defs>
        <marker id="arrSeal" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.muted} /></marker>
      </defs>
    </g>
  );
}

function KeyDerivation() {
  const inputs = [
    { l: 'KEY_POLICY', desc: 'MRENCLAVE / MRSIGNER 선택', color: C.mre },
    { l: 'MR* (ENCLAVE or SIGNER)', desc: 'identity 해시', color: C.mrs },
    { l: 'ISVPRODID', desc: '제품 ID', color: C.cpu },
    { l: 'ISVSVN', desc: 'Security Version Number', color: C.use },
    { l: 'KEYID (random nonce)', desc: '매 sealing마다 다름', color: C.key },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hw}>
        EGETKEY — 키 파생식 (HMAC-SHA256)
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={440} height={22} rx={4}
          fill={`${C.hw}10`} stroke={C.hw} strokeWidth={1} />
        <text x={240} y={41} textAnchor="middle" fontSize={9} fontFamily="monospace" fontWeight={700} fill={C.hw}>
          key = HMAC-SHA256(Root_Seal_Key, inputs...)
        </text>
      </motion.g>
      {inputs.map((it, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -3 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 + i * 0.08 }}>
          <rect x={20} y={56 + i * 14} width={440} height={12} rx={2}
            fill={`${it.color}10`} stroke={`${it.color}40`} strokeWidth={0.4} />
          <text x={28} y={65 + i * 14} fontSize={8} fontFamily="monospace" fontWeight={700} fill={it.color}>{it.l}</text>
          <text x={170} y={65 + i * 14} fontSize={7.5} fill={C.muted}>{it.desc}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={138} textAnchor="middle" fontSize={8.5} fill={C.cpu}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        Root_Seal_Key: CPU fuse-burned, SW 노출 X
      </motion.text>
    </g>
  );
}

function PolicyCompare() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Policy 선택 — MRENCLAVE vs MRSIGNER
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={28} width={210} height={92} rx={6}
          fill={`${C.mre}10`} stroke={C.mre} strokeWidth={1} />
        <text x={125} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mre}>MRENCLAVE</text>
        <text x={125} y={64} textAnchor="middle" fontSize={9} fill={C.muted}>정확히 같은 enclave만</text>
        <text x={125} y={80} textAnchor="middle" fontSize={9} fill={C.muted}>업데이트 → 키 다름</text>
        <text x={125} y={96} textAnchor="middle" fontSize={9} fill={C.muted}>(데이터 유실)</text>
        <text x={125} y={114} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.mre}>★★★ 보안</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={250} y={28} width={210} height={92} rx={6}
          fill={`${C.mrs}10`} stroke={C.mrs} strokeWidth={1} />
        <text x={355} y={46} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mrs}>MRSIGNER</text>
        <text x={355} y={64} textAnchor="middle" fontSize={9} fill={C.muted}>같은 서명자 enclave</text>
        <text x={355} y={80} textAnchor="middle" fontSize={9} fill={C.muted}>ISVSVN 이상 허용</text>
        <text x={355} y={96} textAnchor="middle" fontSize={9} fill={C.muted}>(버전 업 가능)</text>
        <text x={355} y={114} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.mrs}>★★★ 유연성</text>
      </motion.g>
    </g>
  );
}

const USES = [
  { name: 'DB 암호화 키', color: C.enc },
  { name: '세션 토큰', color: C.key },
  { name: '사용자 자격 증명', color: C.mre },
  { name: 'ML 모델 가중치', color: C.use },
  { name: '블록체인 지갑 키', color: C.cpu },
];

function CpuLimitAndUse() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cpu}>
        한계: CPU-bound — 다른 CPU 복원 불가
      </text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={26} width={440} height={26} rx={4}
          fill={`${C.cpu}10`} stroke={C.cpu} strokeWidth={1} strokeDasharray="3 2" />
        <text x={32} y={43} fontSize={9.5} fontWeight={700} fill={C.cpu}>
          → 머신 이동 시 데이터 유실 → KMS/vault 백업 필수
        </text>
      </motion.g>
      <motion.text x={240} y={70} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.use}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        Sealing 활용 사례
      </motion.text>
      {USES.map((u, i) => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = 20 + col * 150;
        const y = 78 + row * 22;
        return (
          <motion.g key={u.name} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.08 }}>
            <rect x={x} y={y} width={142} height={18} rx={3}
              fill={`${u.color}12`} stroke={`${u.color}40`} strokeWidth={0.6} />
            <text x={x + 71} y={y + 12} textAnchor="middle" fontSize={8.5} fontWeight={600} fill={u.color}>
              {u.name}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function SealingMechanismViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <FlowStrip steps={SEAL_FLOW} title="Sealing — 데이터 저장" color={C.enc} />}
          {step === 1 && <KeyDerivation />}
          {step === 2 && <FlowStrip steps={UNSEAL_FLOW} title="Unsealing — 데이터 복원" color={C.use} />}
          {step === 3 && <PolicyCompare />}
          {step === 4 && <CpuLimitAndUse />}
        </svg>
      )}
    </StepViz>
  );
}
