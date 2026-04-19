import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  rot: '#10b981',
  bios: '#6366f1',
  boot: '#8b5cf6',
  os: '#f59e0b',
  user: '#ec4899',
  pcr: '#14b8a6',
  muted: 'var(--muted-foreground)',
};

const STEPS = [
  {
    label: 'Stage 0~1: Root of Trust → BIOS/UEFI',
    body: 'CPU 내부 Boot ROM(변경 불가)이 시작점. ROM이 BIOS/UEFI를 측정해 PCR[0]에 기록. Secure Boot 정책도 함께 로드합니다.',
  },
  {
    label: 'Stage 2~4: Bootloader → Kernel → User',
    body: 'GRUB(PCR[4])이 kernel·initrd 측정(PCR[8-9]). Linux IMA가 사용자 영역 바이너리를 PCR[10]에 누적합니다.',
  },
  {
    label: 'PCR Extend & Event Log',
    body: 'PCR[i] = SHA-256(PCR[i] || measurement). 단방향 누적. 매 extend마다 Event Log(/sys/kernel/security/tpm0/...)에 기록되어 재계산 가능.',
  },
  {
    label: 'Remote Attestation: Quote 검증',
    body: 'Verifier가 nonce 전송 → TPM2_Quote가 PCR을 서명. Verifier는 Event Log로 해시 체인 재계산하여 부팅 무결성 확인.',
  },
];

interface Stage {
  name: string;
  pcr: string;
  measures: string;
  color: string;
}

const STAGES: Stage[] = [
  { name: 'Boot ROM', pcr: 'fixed', measures: 'BIOS/UEFI', color: C.rot },
  { name: 'BIOS/UEFI', pcr: 'PCR[0]', measures: 'GRUB', color: C.bios },
  { name: 'Bootloader', pcr: 'PCR[4]', measures: 'kernel', color: C.boot },
  { name: 'OS Kernel', pcr: 'PCR[8-9]', measures: 'init', color: C.os },
  { name: 'User (IMA)', pcr: 'PCR[10]', measures: 'apps', color: C.user },
];

function StageChain({ activeIdx }: { activeIdx: number[] }) {
  const x0 = 18;
  const w = 80;
  const gap = 12;
  const y = 30;
  return (
    <g>
      {STAGES.map((s, i) => {
        const x = x0 + i * (w + gap);
        const active = activeIdx.includes(i);
        return (
          <motion.g key={s.name} initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.25 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={x} y={y} width={w} height={48} rx={6}
              fill={`${s.color}15`} stroke={s.color} strokeWidth={1.2} />
            <text x={x + w / 2} y={y + 16} textAnchor="middle"
              fontSize={9.5} fontWeight={700} fill={s.color}>{s.name}</text>
            <text x={x + w / 2} y={y + 30} textAnchor="middle"
              fontSize={8.5} fill={C.muted}>{s.pcr}</text>
            <text x={x + w / 2} y={y + 42} textAnchor="middle"
              fontSize={7.5} fill={C.muted}>→ {s.measures}</text>
          </motion.g>
        );
      })}
      {STAGES.slice(0, -1).map((_, i) => {
        const x1 = x0 + (i + 1) * w + i * gap;
        const x2 = x1 + gap;
        const active = activeIdx.includes(i) && activeIdx.includes(i + 1);
        return (
          <motion.line key={`a-${i}`} x1={x1} y1={y + 24} x2={x2} y2={y + 24}
            stroke={STAGES[i + 1].color} strokeWidth={1.4} markerEnd="url(#arrChain)"
            initial={{ opacity: 0 }} animate={{ opacity: active ? 1 : 0.2 }}
            transition={{ delay: 0.2 + i * 0.1 }} />
        );
      })}
      <defs>
        <marker id="arrChain" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.muted} /></marker>
      </defs>
    </g>
  );
}

function PcrExtendDetail() {
  const lines = [
    { l: 'event = {pcr_idx, measurement, log_msg}', y: 38 },
    { l: 'PCR[i] ← SHA-256(PCR[i] || measurement)', y: 58 },
    { l: 'EventLog.append(event)  // /sys/kernel/...', y: 78 },
    { l: '검증: 재계산 hash == quoted PCR', y: 98 },
  ];
  return (
    <g>
      <text x={20} y={22} fontSize={11} fontWeight={700} fill="var(--foreground)">
        PCR Extend & Event Log
      </text>
      {lines.map((ln, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={20} y={ln.y - 12} width={440} height={18} rx={3}
            fill={`${C.pcr}10`} stroke={`${C.pcr}40`} strokeWidth={0.6} />
          <text x={32} y={ln.y + 1} fontSize={9.5} fontFamily="monospace"
            fontWeight={500} fill={C.pcr}>{ln.l}</text>
        </motion.g>
      ))}
    </g>
  );
}

function AttestFlow() {
  const arrows = [
    { from: 'Verifier', to: 'TPM', label: '1. nonce', y: 40, x1: 80, x2: 220 },
    { from: 'TPM', to: 'Verifier', label: '2. Quote = sign(PCR || nonce)', y: 70, x1: 220, x2: 80 },
  ];
  return (
    <g>
      <rect x={20} y={20} width={120} height={80} rx={6}
        fill={`${C.pcr}10`} stroke={C.pcr} strokeWidth={1} />
      <text x={80} y={60} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.pcr}>Verifier</text>
      <text x={80} y={75} textAnchor="middle" fontSize={8} fill={C.muted}>(remote)</text>

      <rect x={340} y={20} width={120} height={80} rx={6}
        fill={`${C.bios}10`} stroke={C.bios} strokeWidth={1} />
      <text x={400} y={50} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.bios}>TPM</text>
      <text x={400} y={66} textAnchor="middle" fontSize={8} fill={C.muted}>PCR + AIK</text>
      <text x={400} y={82} textAnchor="middle" fontSize={8} fill={C.muted}>(client)</text>

      {arrows.map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.4 }}>
          <line x1={a.from === 'Verifier' ? 140 : 340} y1={a.y}
            x2={a.from === 'Verifier' ? 340 : 140} y2={a.y}
            stroke={a.from === 'Verifier' ? C.pcr : C.bios} strokeWidth={1.4}
            markerEnd={a.from === 'Verifier' ? 'url(#arrV)' : 'url(#arrT)'} />
          <text x={240} y={a.y - 4} textAnchor="middle"
            fontSize={9} fontWeight={600}
            fill={a.from === 'Verifier' ? C.pcr : C.bios}>{a.label}</text>
        </motion.g>
      ))}
      <motion.text x={240} y={114} textAnchor="middle" fontSize={9} fill={C.muted}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
        Verifier: 기대 PCR 비교 + AIK 서명 검증
      </motion.text>
      <defs>
        <marker id="arrV" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.pcr} /></marker>
        <marker id="arrT" viewBox="0 0 6 6" refX={6} refY={3} markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6Z" fill={C.bios} /></marker>
      </defs>
    </g>
  );
}

export default function MeasuredBootChainViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <StageChain activeIdx={[0, 1]} />}
          {step === 1 && <StageChain activeIdx={[2, 3, 4]} />}
          {step === 2 && <PcrExtendDetail />}
          {step === 3 && <AttestFlow />}
        </svg>
      )}
    </StepViz>
  );
}
