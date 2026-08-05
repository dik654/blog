import { motion } from 'framer-motion';

const WORLDS = [
  { name: 'Non-secure', color: '#3b82f6', layers: ['Apps', 'Host Kernel\n(Linux)', 'Host Hyp\n(KVM, Xen)', '—'] },
  { name: 'Secure', color: '#f59e0b', layers: ['TAs', 'TEE OS\n(OP-TEE)', 'Secure Hyp\n(SPM)', '—'] },
  { name: 'Realm', color: '#10b981', layers: ['Realm Apps', 'Realm OS\n(Linux Guest)', 'RMM\n(TF-RMM)', '—'] },
  { name: 'Root', color: '#ef4444', layers: ['—', '—', '—', 'Monitor\n(TF-A)'] },
];

const ELS = ['EL0', 'EL1', 'EL2', 'EL3'];

export default function ExceptionLevelViz() {
  const cellW = 95;
  const cellH = 38;
  const startX = 50;
  const startY = 35;

  return (
    <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
      <svg viewBox="0 0 480 280" className="w-full h-auto" style={{ maxWidth: 680 }}>
        <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
          fill="var(--foreground)">ARM CCA — Exception Level × World 매트릭스</text>

        {/* World headers */}
        {WORLDS.map((w, i) => (
          <g key={`h-${i}`}>
            <rect x={startX + i * cellW} y={startY - 18} width={cellW - 4} height={16} rx={3}
              fill={w.color} fillOpacity={0.2} stroke={w.color} strokeWidth={0.6} />
            <text x={startX + i * cellW + (cellW - 4) / 2} y={startY - 7}
              textAnchor="middle" fontSize={7.5} fontWeight={700} fill={w.color}>{w.name}</text>
          </g>
        ))}

        {/* EL row labels + cells */}
        {ELS.map((el, ei) => {
          const rowIdx = 3 - ei; // EL3 at top
          const y = startY + rowIdx * (cellH + 4);
          return (
            <g key={`r-${ei}`}>
              <text x={startX - 8} y={y + cellH / 2 + 3} textAnchor="end"
                fontSize={9} fontWeight={700} fill="var(--foreground)">{el}</text>
              {WORLDS.map((w, wi) => {
                const layer = w.layers[ei];
                const empty = layer === '—';
                return (
                  <motion.g key={`c-${ei}-${wi}`}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: (ei + wi) * 0.04 }}>
                    <rect x={startX + wi * cellW} y={y} width={cellW - 4} height={cellH} rx={4}
                      fill={empty ? 'var(--muted)' : w.color}
                      fillOpacity={empty ? 0.15 : 0.12}
                      stroke={empty ? 'var(--border)' : w.color}
                      strokeWidth={empty ? 0.4 : 0.7}
                      strokeDasharray={empty ? '2 2' : '0'} />
                    {layer.split('\n').map((line, li) => (
                      <text key={li}
                        x={startX + wi * cellW + (cellW - 4) / 2}
                        y={y + cellH / 2 - 2 + li * 9}
                        textAnchor="middle" fontSize={7}
                        fontWeight={li === 0 ? 600 : 400}
                        fill={empty ? 'var(--muted-foreground)' : w.color}>
                        {line}
                      </text>
                    ))}
                  </motion.g>
                );
              })}
            </g>
          );
        })}

        {/* RMM callout */}
        <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>
          <rect x={20} y={225} width={440} height={45} rx={6}
            fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1}
            strokeDasharray="4 3" />
          <text x={240} y={241} textAnchor="middle" fontSize={9} fontWeight={700}
            fill="#10b981">신규 핵심: RMM (Realm Management Monitor) — EL2 Realm</text>
          <text x={240} y={254} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">Realm 생성/소멸 · 페이지 테이블 관리 · RMI/RSI 처리</text>
          <text x={240} y={264} textAnchor="middle" fontSize={6.5} fontStyle="italic"
            fill="var(--muted-foreground)">Intel TDX Module의 ARM 대응</text>
        </motion.g>
      </svg>
    </div>
  );
}
