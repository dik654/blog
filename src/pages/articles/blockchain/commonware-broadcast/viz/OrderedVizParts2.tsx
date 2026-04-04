import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

export function AckStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        AckManager: Sequencer → Height → Epoch → Evidence
      </text>
      {['Seq A', 'Seq B'].map((s, i) => (
        <g key={i}>
          <rect x={30 + i * 230} y={35} width={200} height={100} rx={5} fill="var(--card)" />
          <rect x={30 + i * 230} y={35} width={200} height={100} rx={5}
            fill={`${[C1, C2][i]}06`} stroke={[C1, C2][i]} strokeWidth={0.6} />
          <text x={130 + i * 230} y={55} textAnchor="middle" fontSize={10} fontWeight={500}
            fill={[C1, C2][i]}>{s}</text>
          {['h=0: Cert', 'h=1: Partials(3/5)', 'h=2: Partials(1/5)'].map((h, j) => (
            <text key={j} x={130 + i * 230} y={75 + j * 18} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">{h}</text>
          ))}
        </g>
      ))}
      <text x={240} y={155} textAnchor="middle" fontSize={10} fill={C3}>
        2f+1 도달 → Partials에서 Certificate로 승격
      </text>
    </motion.g>
  );
}

export function TipStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
        TipManager: 시퀀서별 최신 Node 추적
      </text>
      {['Seq A → h=5', 'Seq B → h=3', 'Seq C → h=7'].map((t, i) => (
        <g key={i}>
          <rect x={40 + i * 140} y={40} width={120} height={36} rx={5} fill="var(--card)" />
          <rect x={40 + i * 140} y={40} width={120} height={36} rx={5}
            fill={`${[C1, C2, C3][i]}10`} stroke={[C1, C2, C3][i]} strokeWidth={0.8} />
          <text x={100 + i * 140} y={62} textAnchor="middle" fontSize={10} fontWeight={500}
            fill={[C1, C2, C3][i]}>{t}</text>
        </g>
      ))}
      <rect x={60} y={100} width={360} height={40} rx={5} fill="var(--card)" />
      <rect x={60} y={100} width={360} height={40} rx={5} fill={`${C2}08`} stroke={C2} strokeWidth={0.6} />
      <text x={240} y={118} textAnchor="middle" fontSize={10} fill={C2}>
        tip의 존재 = 해당 시퀀서의 전체 체인(h=0~N) 확인됨
      </text>
      <text x={240} y={132} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        같은 height에 다른 payload → 충돌 검출(panic)
      </text>
    </motion.g>
  );
}
