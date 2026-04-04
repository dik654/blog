import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '기존 구조: 합의 + 전파 결합', body: '리더가 전체 블록을 모든 검증자에게 전송. 대역폭 낭비 + 리더 병목 + 비응답 시 지연.' },
  { label: 'Commonware 3계층 분리', body: 'Broadcaster trait(전파 추상화) → ordered_broadcast(인증서 체인) → Zoda(DA 샤딩). 각 계층 독립 동작.' },
  { label: '데이터 흐름: 트랜잭션 → 인증서 → 실행', body: '시퀀서가 ordered_broadcast로 전파 → 검증자 2f+1 서명 → 인증서 형성 → Simplex가 순서 결정 → VM 실행.' },
];

export default function ArchLayerViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <Step0 />}
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
        </svg>
      )}
    </StepViz>
  );
}

function Step0() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <rect x={130} y={30} width={240} height={50} rx={6} fill="var(--card)" />
      <rect x={130} y={30} width={240} height={50} rx={6} fill="#ef444410" stroke="#ef4444" strokeWidth={1} />
      <text x={250} y={52} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">Leader</text>
      <text x={250} y={68} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">합의 + 전파 결합 = 병목</text>
      {['V1', 'V2', 'V3', 'V4'].map((v, i) => (
        <g key={i}>
          <rect x={60 + i * 100} y={110} width={60} height={28} rx={4} fill="var(--card)" />
          <rect x={60 + i * 100} y={110} width={60} height={28} rx={4}
            fill={`${C1}08`} stroke={C1} strokeWidth={0.5} />
          <text x={90 + i * 100} y={128} textAnchor="middle" fontSize={10} fill={C1}>{v}</text>
          <line x1={250} y1={80} x2={90 + i * 100} y2={110} stroke="var(--border)" strokeWidth={0.5} />
        </g>
      ))}
    </motion.g>
  );
}

function Step1() {
  const layers = [
    { label: 'Broadcaster trait', sub: '전파 추상화', c: C1, y: 15 },
    { label: 'ordered_broadcast', sub: '인증서 체인', c: C2, y: 70 },
    { label: 'coding::Zoda', sub: 'DA 샤딩', c: C3, y: 125 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {layers.map((l, i) => (
        <g key={i}>
          <rect x={80} y={l.y} width={340} height={40} rx={6} fill="var(--card)" />
          <rect x={80} y={l.y} width={340} height={40} rx={6} fill={`${l.c}10`} stroke={l.c} strokeWidth={1} />
          <text x={170} y={l.y + 24} textAnchor="middle" fontSize={10} fontWeight={600} fill={l.c}>{l.label}</text>
          <text x={370} y={l.y + 24} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{l.sub}</text>
          {i < 2 && <line x1={250} y1={l.y + 40} x2={250} y2={l.y + 55} stroke="var(--border)" strokeWidth={0.5} />}
        </g>
      ))}
    </motion.g>
  );
}

function Step2() {
  const flow = [
    { label: 'Sequencer', sub: 'broadcast chunk', c: C1, x: 20 },
    { label: 'Validators', sub: '2f+1 ack', c: C2, x: 140 },
    { label: 'Certificate', sub: 'chain link', c: C3, x: 260 },
    { label: 'Simplex', sub: 'order tips', c: C2, x: 380 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {flow.map((f, i) => (
        <g key={i}>
          <rect x={f.x} y={50} width={100} height={52} rx={6} fill="var(--card)" />
          <rect x={f.x} y={50} width={100} height={52} rx={6} fill={`${f.c}10`} stroke={f.c} strokeWidth={0.8} />
          <text x={f.x + 50} y={72} textAnchor="middle" fontSize={10} fontWeight={600} fill={f.c}>{f.label}</text>
          <text x={f.x + 50} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{f.sub}</text>
          {i < 3 && <line x1={f.x + 100} y1={76} x2={f.x + 120} y2={76} stroke="var(--border)" strokeWidth={0.6} />}
        </g>
      ))}
      <text x={250} y={130} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        합의는 tip 순서만 결정 — 데이터 전파는 broadcast가 독립 처리
      </text>
    </motion.g>
  );
}
