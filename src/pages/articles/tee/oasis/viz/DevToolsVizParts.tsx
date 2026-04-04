import { motion } from 'framer-motion';

const CMD_TREE = [
  { label: 'network', items: ['add', 'remove', 'set-rpc'], c: '#6366f1' },
  { label: 'wallet', items: ['create', 'import', 'export'], c: '#6366f1' },
  { label: 'account', items: ['show', 'transfer', 'delegate'], c: '#10b981' },
  { label: 'contract', items: ['upload', 'call'], c: '#10b981' },
];

export function CLITreeStep({ step }: { step: number }) {
  return (
    <g>
      <text x={30} y={22} fontSize={11} fontWeight={700} fill="var(--foreground)">oasis</text>
      {CMD_TREE.map((cmd, gi) => {
        const x = 30 + gi * 130;
        const highlight = (step === 0 && gi < 2) || (step === 1 && gi >= 2);
        return (
          <g key={cmd.label}>
            <line x1={60} y1={18} x2={x + 30} y2={38} stroke="var(--border)" strokeWidth={0.6} />
            <motion.rect x={x} y={38} width={110} height={28} rx={5}
              fill={highlight ? `${cmd.c}18` : `${cmd.c}06`}
              stroke={highlight ? cmd.c : `${cmd.c}30`}
              strokeWidth={highlight ? 1.8 : 0.6}
              animate={{ opacity: highlight ? 1 : 0.25 }} />
            <text x={x + 55} y={56} textAnchor="middle" fontSize={10} fontWeight={600}
              fill={highlight ? cmd.c : 'var(--muted-foreground)'}>{cmd.label}</text>
            {cmd.items.map((item, i) => (
              <g key={item}>
                <line x1={x + 55} y1={66} x2={x + 10 + i * 35} y2={82}
                  stroke={highlight ? `${cmd.c}60` : 'var(--border)'} strokeWidth={0.5} />
                <text x={x + 10 + i * 35} y={95} textAnchor="middle" fontSize={10}
                  fill={highlight ? cmd.c : 'var(--muted-foreground)'}>{item}</text>
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
}

export function ConfigStep() {
  return (
    <g>
      {[
        { label: '[networks.mainnet]', fields: ['rpc', 'chain_context', 'denomination'], c: '#6366f1', x: 140 },
        { label: '[wallet.default]', fields: ['kind', 'address'], c: '#f59e0b', x: 400 },
      ].map((s) => (
        <g key={s.label}>
          <rect x={s.x - 100} y={15} width={200} height={130} rx={8}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={1.5} />
          <text x={s.x} y={38} textAnchor="middle" fontSize={10} fontWeight={700}
            fill={s.c}>{s.label}</text>
          {s.fields.map((f, i) => (
            <g key={f}>
              <rect x={s.x - 80} y={50 + i * 30} width={160} height={22} rx={4}
                fill={`${s.c}08`} stroke={`${s.c}30`} strokeWidth={0.6} />
              <text x={s.x} y={65 + i * 30} textAnchor="middle" fontSize={10}
                fill="var(--foreground)">{f}</text>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}

export function WorkflowStep() {
  return (
    <g>
      {[
        { label: 'network add', n: '1', c: '#6366f1' },
        { label: 'wallet create', n: '2', c: '#6366f1' },
        { label: 'contract upload', n: '3', c: '#10b981' },
        { label: 'contract call', n: '4', c: '#f59e0b' },
      ].map((s, i) => {
        const x = 50 + i * 125;
        return (
          <g key={s.label}>
            {i > 0 && (
              <motion.line x1={x - 60} y1={65} x2={x - 15} y2={65}
                stroke={s.c} strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.15, duration: 0.25 }} />
            )}
            <motion.rect x={x - 50} y={35} width={100} height={58} rx={8}
              fill={`${s.c}14`} stroke={s.c} strokeWidth={1.5}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }} />
            <text x={x} y={55} textAnchor="middle" fontSize={12} fontWeight={700}
              fill={s.c}>{s.n}</text>
            <text x={x} y={75} textAnchor="middle" fontSize={10} fontWeight={600}
              fill="var(--foreground)">{s.label}</text>
          </g>
        );
      })}
    </g>
  );
}
