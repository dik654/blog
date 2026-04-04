import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function ProposalStep() {
  return (
    <svg viewBox="0 0 440 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={10} width={200} height={70} rx={5} fill={`${CV}06`} stroke={CV} strokeWidth={1} />
        <text x={115} y={26} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>Proposal</text>
        <line x1={25} y1={32} x2={205} y2={32} stroke={CV} strokeWidth={0.3} opacity={0.3} />
        <text x={30} y={48} fontSize={10} fill="var(--foreground)">round: (epoch, view)</text>
        <text x={30} y={62} fontSize={10} fill="var(--foreground)">parent: View — 부모 뷰 번호</text>
        <text x={30} y={76} fontSize={10} fill="var(--foreground)">payload: D — 블록 해시</text>
      </motion.g>
      <motion.g {...slide(0.7)}>
        <rect x={235} y={18} width={190} height={52} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={330} y={36} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>체인 연결</text>
        <text x={330} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">parent → 이전 확정/공증 뷰</text>
        <text x={330} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">리더만 생성, 비리더는 검증</text>
      </motion.g>
    </svg>
  );
}

export function VoteTypesStep() {
  const votes = [
    { name: 'Notarize', desc: '제안 승인', c: CE },
    { name: 'Nullify', desc: '타임아웃 투표', c: CA },
    { name: 'Finalize', desc: '확정 투표', c: CV },
  ];
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {votes.map((v, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.3)}>
          <rect x={15 + i * 140} y={10} width={130} height={50} rx={4} fill={`${v.c}08`} stroke={v.c} strokeWidth={0.8} />
          <text x={80 + i * 140} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={v.c}>{v.name}</text>
          <text x={80 + i * 140} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{v.desc}</text>
          <text x={80 + i * 140} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">+ attestation(서명)</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.2)}>
        <text x={220} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          각 검증자가 개별 서명 → Batcher에서 수집 → 2f+1 도달 시 인증서
        </text>
      </motion.g>
    </svg>
  );
}

export function CertificateStep() {
  const certs = [
    { name: 'Notarization', from: '2f+1 Notarize', c: CE },
    { name: 'Nullification', from: '2f+1 Nullify', c: CA },
    { name: 'Finalization', from: '2f+1 Finalize', c: CV },
  ];
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {certs.map((cert, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.3)}>
          <rect x={15} y={10 + i * 28} width={130} height={24} rx={3} fill={`${cert.c}06`} stroke={cert.c} strokeWidth={0.5} />
          <text x={80} y={26 + i * 28} textAnchor="middle" fontSize={10} fontWeight={500} fill={cert.c}>{cert.from}</text>
          <line x1={145} y1={22 + i * 28} x2={175} y2={22 + i * 28} stroke={cert.c} strokeWidth={0.6} />
          <rect x={180} y={10 + i * 28} width={120} height={24} rx={3} fill={`${cert.c}12`} stroke={cert.c} strokeWidth={0.8} />
          <text x={240} y={26 + i * 28} textAnchor="middle" fontSize={10} fontWeight={600} fill={cert.c}>{cert.name}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.2)}>
        <rect x={320} y={14} width={110} height={66} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={375} y={32} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">VoteTracker</text>
        <text x={375} y={48} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">검증자당 1표 제한</text>
        <text x={375} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">AttributableMap</text>
        <text x={375} y={76} textAnchor="middle" fontSize={10} fill={CE}>2f+1 도달 감지</text>
      </motion.g>
    </svg>
  );
}

export function TraitSeparationStep() {
  const traits = [
    { name: 'Automaton', desc: 'propose · verify · certify', c: CV },
    { name: 'Relay', desc: 'broadcast · listen', c: CE },
    { name: 'Reporter', desc: 'report_activity', c: CA },
  ];
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {traits.map((t, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.3)}>
          <rect x={15 + i * 142} y={10} width={132} height={50} rx={4} fill={`${t.c}08`} stroke={t.c} strokeWidth={0.8} />
          <text x={81 + i * 142} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={t.c}>{t.name}</text>
          <text x={81 + i * 142} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{t.desc}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.2)}>
        <rect x={60} y={68} width={320} height={24} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={220} y={84} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          CometBFT: 합의+네트워크+저장 결합 → Commonware: trait으로 완전 분리
        </text>
      </motion.g>
    </svg>
  );
}
