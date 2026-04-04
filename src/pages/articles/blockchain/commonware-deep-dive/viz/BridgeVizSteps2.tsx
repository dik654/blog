import { motion } from 'framer-motion';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const F = { initial: { opacity: 0 }, animate: { opacity: 1 } };

export function AssemblyStep() {
  const modules = [
    { label: 'Application', sub: 'with_label("app")', c: C2 },
    { label: 'Engine (Simplex)', sub: 'with_label("engine")', c: C1 },
    { label: 'Scheme (BLS)', sub: '임계 서명', c: C3 },
  ];
  return (
    <motion.g {...F}>
      <text x={220} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">모듈 조립</text>
      {modules.map((m, i) => {
        const x = 20 + i * 140;
        return (
          <g key={i}>
            <rect x={x} y={24} width={125} height={42} rx={5} fill="var(--card)" />
            <rect x={x} y={24} width={125} height={42} rx={5} fill={`${m.c}10`} stroke={m.c} strokeWidth={0.7} />
            <text x={x + 62} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={m.c}>{m.label}</text>
            <text x={x + 62} y={57} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" fontFamily="monospace">{m.sub}</text>
          </g>
        );
      })}
      <text x={220} y={86} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
        각 모듈이 독립 메트릭 네임스페이스 → 충돌 없는 관측
      </text>
      <rect x={80} y={96} width={280} height={20} rx={3} fill={`${C3}08`} stroke={C3} strokeWidth={0.5} />
      <text x={220} y={110} textAnchor="middle" fontSize={7.5} fill={C3}>
        Context clone = 자식 감독 노드 생성
      </text>
    </motion.g>
  );
}

export function ConcurrentStep() {
  const tasks = [
    { label: 'network.start()', c: '#8b5cf6', y: 24 },
    { label: 'engine.start(vote, cert, res)', c: C1, y: 54 },
    { label: 'application.run().await', c: C2, y: 84 },
  ];
  return (
    <motion.g {...F}>
      <text x={220} y={15} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">동시 실행 (Supervision Tree)</text>
      {tasks.map((t, i) => (
        <g key={i}>
          <rect x={80} y={t.y} width={280} height={24} rx={4} fill="var(--card)" />
          <rect x={80} y={t.y} width={280} height={24} rx={4} fill={`${t.c}10`} stroke={t.c} strokeWidth={0.7} />
          <text x={220} y={t.y + 16} textAnchor="middle" fontSize={10} fontWeight={500} fill={t.c} fontFamily="monospace">{t.label}</text>
          {i < 2 && (
            <line x1={220} y1={t.y + 24} x2={220} y2={t.y + 30} stroke="var(--border)" strokeWidth={0.4} />
          )}
        </g>
      ))}
      <text x={220} y={122} textAnchor="middle" fontSize={7.5} fill="#ef4444">
        application 종료 → Spawner 감독으로 engine, network 자동 정리
      </text>
    </motion.g>
  );
}
