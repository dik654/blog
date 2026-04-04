import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './CircuitVizData';

export function CircuitTraitStep() {
  const users = [
    { label: 'setup()', sub: '키 생성', c: CV, x: 60 },
    { label: 'prove()', sub: '증명 생성', c: CE, x: 190 },
    { label: 'verify()', sub: '검증', c: CA, x: 320 },
  ];
  return (
    <g>
      <VizBox x={130} y={12} w={180} h={36} label="Circuit::synthesize(&self, cs)"
        sub="변수 할당 + 제약 추가" c={CV} />
      {users.map((u, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.12 }}>
          <path d={`M 220 48 L ${u.x + 50} 70`} stroke="var(--border)"
            strokeWidth={0.8} strokeDasharray="3,2" />
          <VizBox x={u.x} y={72} w={100} h={36} label={u.label}
            sub={u.sub} c={u.c} delay={0.4 + i * 0.12} />
        </motion.g>
      ))}
      <motion.text x={220} y={128} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        하나의 Circuit 구현 → 키 생성, 증명, 검증 모두에서 재사용
      </motion.text>
    </g>
  );
}
export function AllocPatternStep() {
  const allocs = [
    { label: 'alloc_instance(y)', sub: '공개 출력', c: CE, y: 20 },
    { label: 'alloc_witness(x)', sub: '비공개 입력', c: CV, y: 60 },
    { label: 'alloc_witness(t1)', sub: '보조 변수', c: CA, y: 100 },
  ];
  return (
    <g>
      {allocs.map((a, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}>
          <rect x={30} y={a.y} width={160} height={30} rx={4}
            fill={`${a.c}10`} stroke={a.c} strokeWidth={0.8} />
          <text x={110} y={a.y + 15} textAnchor="middle"
            fontSize={9} fontWeight={600} fill={a.c}>{a.label}</text>
          <text x={110} y={a.y + 26} textAnchor="middle"
            fontSize={8} fill="var(--muted-foreground)">{a.sub}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={230} y={30} width={190} height={70} rx={5}
          fill={`${CV}06`} stroke={CV} strokeWidth={0.6} />
        <text x={325} y={52} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}>
          values = [1, y, x, t1, t2]
        </text>
        <text x={325} y={68} textAnchor="middle" fontSize={8} fill={CE}>
          ↑ One ↑ Instance ↑ Witness...
        </text>
        <text x={325} y={85} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          instance는 witness보다 먼저 할당
        </text>
      </motion.g>
    </g>
  );
}
export function CubicConstraintsStep() {
  const constraints = [
    { a: 'x', b: 'x', c: 't1', note: 'x^2', c1: CV },
    { a: 't1', b: 'x', c: 't2', note: 'x^3', c1: CE },
    { a: 't2+x+5', b: '1', c: 'y', note: 'x^3+x+5', c1: CA },
  ];
  return (
    <g>
      {constraints.map((con, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.2 }}>
          <rect x={20} y={12 + i * 38} width={350} height={30} rx={4}
            fill={`${con.c1}08`} stroke={con.c1} strokeWidth={0.7} />
          <text x={35} y={30 + i * 38} fontSize={8} fontWeight={600} fill={con.c1}>
            #{i + 1}
          </text>
          <text x={60} y={30 + i * 38} fontSize={9} fill="var(--foreground)">
            {con.a} · {con.b} = {con.c}
          </text>
          <text x={350} y={30 + i * 38} textAnchor="end" fontSize={8}
            fill="var(--muted-foreground)">
            {con.note}
          </text>
        </motion.g>
      ))}
      <motion.text x={220} y={132} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        곱셈 2개 + 덧셈 1개(LC 내 무료) = 제약 3개
      </motion.text>
    </g>
  );
}
