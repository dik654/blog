import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

export function TypesStep() {
  const types = [
    { label: 'Chunk', fields: 'sequencer · height · payload', c: C1 },
    { label: 'Parent', fields: 'digest · epoch · certificate', c: C2 },
    { label: 'Node', fields: 'chunk + sig + parent?', c: C3 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {types.map((t, i) => (
        <g key={i}>
          <rect x={10 + i * 156} y={25} width={140} height={55} rx={5} fill="var(--card)" />
          <rect x={10 + i * 156} y={25} width={140} height={55} rx={5}
            fill={`${t.c}10`} stroke={t.c} strokeWidth={0.8} />
          <text x={80 + i * 156} y={48} textAnchor="middle" fontSize={11} fontWeight={600} fill={t.c}>{t.label}</text>
          <text x={80 + i * 156} y={68} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{t.fields}</text>
        </g>
      ))}
      {[0, 1].map(i => (
        <line key={i} x1={150 + i * 156} y1={52} x2={166 + i * 156} y2={52} stroke="var(--border)" strokeWidth={0.5} />
      ))}
      <text x={240} y={110} textAnchor="middle" fontSize={10} fill={C2}>
        Node(h=N).parent.certificate = 이전 청크(h=N-1)의 쿼럼 인증서
      </text>
      {[1, 2, 3].map(i => {
        const x = 40 + (i - 1) * 130;
        return (
          <g key={i}>
            <rect x={x} y={120} width={110} height={28} rx={4} fill="var(--card)" />
            <rect x={x} y={120} width={110} height={28} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.4} />
            <text x={x + 55} y={138} textAnchor="middle" fontSize={10} fill={C1}>
              {i === 1 ? 'Node h=0 (∅)' : `Node h=${i - 1} → cert(h=${i - 2})`}
            </text>
          </g>
        );
      })}
    </motion.g>
  );
}

export function EngineStep() {
  const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
  const flow = ['recv Node', 'read_staged()', 'validate_node()', 'handle_cert()', 'handle_node()'];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {flow.map((f, i) => (
        <g key={i}>
          <rect x={10 + i * 92} y={40} width={84} height={32} rx={4} fill="var(--card)" />
          <rect x={10 + i * 92} y={40} width={84} height={32} rx={4}
            fill={`${[C1, C2, C3, C2, C1][i]}08`} stroke={[C1, C2, C3, C2, C1][i]} strokeWidth={0.6} />
          <text x={52 + i * 92} y={60} textAnchor="middle" fontSize={10} fontWeight={500}
            fill={[C1, C2, C3, C2, C1][i]}>{f}</text>
          {i < 4 && (
            <line x1={94 + i * 92} y1={56} x2={102 + i * 92} y2={56} stroke="var(--border)" strokeWidth={0.4} />
          )}
        </g>
      ))}
      <rect x={60} y={95} width={360} height={50} rx={5} fill="var(--card)" />
      <rect x={60} y={95} width={360} height={50} rx={5} fill={`${C3}08`} stroke={C3} strokeWidth={0.6} />
      <text x={240} y={114} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>select_loop! 분기</text>
      <text x={240} y={132} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        propose | node_recv | ack_recv | epoch_update | rebroadcast
      </text>
    </motion.g>
  );
}
