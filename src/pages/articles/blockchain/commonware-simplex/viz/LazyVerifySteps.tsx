import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CH = '#ef4444';

export function EagerStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={220} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={CH}>
        기존: 매 메시지마다 검증
      </text>
      {[1, 2, 3, 4, 5].map(i => {
        const x = 20 + (i - 1) * 88;
        return (
          <g key={i}>
            <rect x={x} y={26} width={76} height={20} rx={3}
              fill={`${CV}10`} stroke={CV} strokeWidth={0.5} />
            <text x={x + 38} y={40} textAnchor="middle" fontSize={10} fill={CV}>Vote {i}</text>
            <rect x={x} y={52} width={76} height={16} rx={3}
              fill={`${CH}12`} stroke={CH} strokeWidth={0.6} />
            <text x={x + 38} y={63} textAnchor="middle" fontSize={10} fill={CH}>verify()</text>
            <rect x={x} y={74} width={76} height={16} rx={3}
              fill={`${CE}10`} stroke={CE} strokeWidth={0.5} />
            <text x={x + 38} y={85} textAnchor="middle" fontSize={10} fill={CE}>저장</text>
          </g>
        );
      })}
      <text x={220} y={110} textAnchor="middle" fontSize={10} fill={CH}>
        검증 5회 (CPU cost x 5)
      </text>
    </motion.g>
  );
}

export function LazyStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <text x={220} y={16} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>
        Batcher: VoteTracker에 저장 → 쿼럼 시 1회 검증
      </text>
      {[1, 2, 3, 4, 5].map(i => {
        const x = 20 + (i - 1) * 88;
        return (
          <g key={i}>
            <rect x={x} y={26} width={76} height={20} rx={3}
              fill={`${CV}10`} stroke={CV} strokeWidth={0.5} />
            <text x={x + 38} y={40} textAnchor="middle" fontSize={10} fill={CV}>Vote {i}</text>
            <rect x={x} y={52} width={76} height={16} rx={3}
              fill={`${CE}08`} stroke={CE} strokeWidth={0.4} />
            <text x={x + 38} y={63} textAnchor="middle" fontSize={10}
              fill="var(--muted-foreground)">VoteTracker</text>
          </g>
        );
      })}
      <rect x={100} y={85} width={240} height={22} rx={5}
        fill={`${CE}15`} stroke={CE} strokeWidth={1} />
      <text x={220} y={100} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>
        batch_verify() x 1회
      </text>
      <text x={220} y={128} textAnchor="middle" fontSize={10} fill={CE}>
        CPU cost x 1 (5배 절감)
      </text>
    </motion.g>
  );
}

export function SafetyStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {[
        { label: 'Scheme::is_batchable() == true?', c: CV, y: 10 },
        { label: '비잔틴: 잘못된 서명 전송', c: CH, y: 40 },
        { label: '쿼럼 미달 → 어차피 무시', c: '#94a3b8', y: 65 },
        { label: '쿼럼 도달 → batch_verify()', c: CE, y: 90 },
        { label: '실패 → 개별 검증 폴백', c: '#f59e0b', y: 115 },
        { label: '유효 투표만 남김 → 안전성 유지', c: CE, y: 140 },
      ].map((s, i) => (
        <g key={i}>
          <rect x={60} y={s.y} width={320} height={20} rx={4} fill="var(--card)" />
          <rect x={60} y={s.y} width={320} height={20} rx={4}
            fill={`${s.c}08`} stroke={s.c} strokeWidth={0.6} />
          <text x={220} y={s.y + 14} textAnchor="middle" fontSize={10} fill={s.c}>
            {s.label}
          </text>
        </g>
      ))}
    </motion.g>
  );
}
