import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { atk: '#ef4444', def: '#10b981', pos: '#6366f1', game: '#f59e0b' };

export function FaultStep3() {
  const methods = [
    { line: 'Claims() []Claim', desc: '모든 주장 목록', c: C.game },
    { line: 'GetParent(claim) (Claim, error)', desc: '부모 주장 조회', c: C.game },
    { line: 'AgreeWithClaimLevel(claim, agree) bool', desc: '아군/적군 판별', c: C.pos },
    { line: 'ChessClock(now, claim) time.Duration', desc: '남은 응답 시간', c: C.atk },
    { line: 'MaxDepth() Depth', desc: '트리 최대 깊이', c: C.game },
  ];
  return (
    <g>
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={30} y={8} width={460} height={26} rx={6}
          fill={`${C.game}15`} stroke={C.game} strokeWidth={1.2} />
        <text x={260} y={26} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.game}>
          type Game interface — 게임 상태 조회
        </text>
      </motion.g>
      {methods.map((m, i) => {
        const y = 44 + i * 27;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.1 + i * 0.07 }}>
            <rect x={30} y={y} width={460} height={22} rx={4}
              fill={i === 2 ? `${C.pos}10` : '#ffffff04'}
              stroke={i === 2 ? C.pos : 'var(--border)'} strokeWidth={i === 2 ? 1 : 0.5} />
            <text x={40} y={y + 15} fontSize={10} fontWeight={600} fill={m.c} fontFamily="monospace">
              Line {i + 1}: {m.line}
            </text>
            <text x={360} y={y + 15} fontSize={10} fill="var(--foreground)">{m.desc}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={30} y={186} width={460} height={40} rx={6}
          fill="#ffffff08" stroke="var(--border)" strokeWidth={0.8} />
        <text x={260} y={204} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="var(--foreground)">AgreeWithClaimLevel 판별 규칙</text>
        <text x={130} y={220} textAnchor="middle" fontSize={10} fill={C.def}>
          depth % 2 == 0 → 방어자
        </text>
        <text x={390} y={220} textAnchor="middle" fontSize={10} fill={C.atk}>
          depth % 2 == 1 → 도전자
        </text>
      </motion.g>
    </g>
  );
}
