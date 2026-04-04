import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function StateStep() {
  const fields = [
    { name: 'view', desc: '현재 합의 뷰', c: CV },
    { name: 'last_finalized', desc: '확정된 최신 뷰', c: CE },
    { name: 'views: BTreeMap', desc: '활성 뷰별 Round', c: CA },
  ];
  return (
    <svg viewBox="0 0 440 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <rect x={15} y={8} width={200} height={94} rx={5} fill={`${CV}06`} stroke={CV} strokeWidth={1} />
      <text x={115} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>State</text>
      <line x1={25} y1={30} x2={205} y2={30} stroke={CV} strokeWidth={0.3} opacity={0.3} />
      {fields.map((f, i) => (
        <motion.g key={i} {...slide(0.3 + i * 0.3)}>
          <rect x={25} y={36 + i * 22} width={180} height={18} rx={3} fill={`${f.c}08`} stroke={f.c} strokeWidth={0.5} />
          <text x={35} y={49 + i * 22} fontSize={10} fontWeight={500} fill={f.c}>{f.name}</text>
          <text x={125} y={49 + i * 22} fontSize={10} fill="var(--muted-foreground)">{f.desc}</text>
        </motion.g>
      ))}
      <motion.g {...fade(1.2)}>
        <rect x={235} y={20} width={190} height={70} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={330} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">에폭 단위 상태 관리</text>
        <text x={330} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">BTreeMap으로 여러 뷰를 동시 추적</text>
        <text x={330} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">activity_timeout 이후 오래된 뷰 정리</text>
      </motion.g>
    </svg>
  );
}

export function RoundStep() {
  const flags = ['broadcast_notarize', 'broadcast_nullify', 'broadcast_finalize'];
  return (
    <svg viewBox="0 0 440 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <rect x={15} y={8} width={200} height={94} rx={5} fill={`${CE}06`} stroke={CE} strokeWidth={1} />
      <text x={115} y={24} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>Round</text>
      <line x1={25} y1={30} x2={205} y2={30} stroke={CE} strokeWidth={0.3} opacity={0.3} />
      <motion.g {...slide(0.3)}>
        <text x={25} y={46} fontSize={10} fill={CV}>leader</text>
        <text x={25} y={62} fontSize={10} fill={CA}>proposal: ProposalSlot</text>
        <text x={25} y={78} fontSize={10} fill={CE}>notarization / nullification</text>
        <text x={25} y={94} fontSize={10} fill="var(--foreground)">finalization + certify 상태</text>
      </motion.g>
      <motion.g {...fade(0.8)}>
        <rect x={235} y={10} width={190} height={44} rx={4} fill={`${CA}06`} stroke={CA} strokeWidth={0.6} />
        <text x={330} y={26} textAnchor="middle" fontSize={10} fontWeight={500} fill={CA}>broadcast 플래그</text>
        {flags.map((f, i) => (
          <text key={i} x={245} y={40 + i * 0} fontSize={10} fill="var(--muted-foreground)">{/* inline */}</text>
        ))}
        <text x={330} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          한 번 전송 → true → 재전송 방지
        </text>
      </motion.g>
      <motion.g {...fade(1.2)}>
        <rect x={235} y={62} width={190} height={38} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={330} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">뷰 단위 투표·인증서 라이프사이클</text>
        <text x={330} y={92} textAnchor="middle" fontSize={10} fill={CE}>State.views[view] = Round</text>
      </motion.g>
    </svg>
  );
}

export function EnterViewStep() {
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.g {...fade(0.2)}>
        <rect x={15} y={10} width={100} height={36} rx={4} fill={`${CV}08`} stroke={CV} strokeWidth={0.6} />
        <text x={65} y={32} textAnchor="middle" fontSize={10} fontWeight={500} fill={CV}>view: 5</text>
      </motion.g>
      <motion.g {...fade(0.5)}>
        <line x1={115} y1={28} x2={165} y2={28} stroke={CE} strokeWidth={0.8} markerEnd="url(#evA)" />
        <rect x={125} y={16} width={30} height={14} rx={2} fill="var(--background)" stroke={CE} strokeWidth={0.4} />
        <text x={140} y={27} textAnchor="middle" fontSize={10} fill={CE}>+1</text>
      </motion.g>
      <motion.g {...slide(0.7)}>
        <rect x={170} y={10} width={100} height={36} rx={4} fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={220} y={32} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>view: 6</text>
      </motion.g>
      <motion.g {...fade(1.0)}>
        <rect x={290} y={8} width={140} height={82} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={360} y={26} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">enter_view(6)</text>
        <text x={360} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">1. 회귀 방지: 6 &gt; 5 확인</text>
        <text x={360} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">2. Round 생성 + 타임아웃 설정</text>
        <text x={360} y={72} textAnchor="middle" fontSize={10} fill={CA}>leader_timeout: 2Δ</text>
        <text x={360} y={84} textAnchor="middle" fontSize={10} fill={CA}>cert_timeout: 3Δ</text>
      </motion.g>
      <defs>
        <marker id="evA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CE} />
        </marker>
      </defs>
    </svg>
  );
}
