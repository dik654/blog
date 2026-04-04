import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './G2OpsVizData';

export function G2SameFormulaStep() {
  const ops = [
    { label: 'G1::double', sub: 'Fp 곱셈', x: 30, c: CV },
    { label: 'G2::double', sub: 'Fp2 곱셈', x: 180, c: CE },
  ];
  return (
    <g>
      {ops.map((o, i) => (
        <VizBox key={i} x={o.x} y={20} w={130} h={44} label={o.label}
          sub={o.sub} c={o.c} delay={i * 0.2} />
      ))}
      <motion.text x={160} y={46} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        =
      </motion.text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={330} y={20} width={100} height={44} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={1} />
        <text x={380} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={CA}>동일 공식</text>
        <text x={380} y={52} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">타입만 다름</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={30} y={85} width={400} height={24} rx={4}
          fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={230} y={100} textAnchor="middle" fontSize={9} fill={CE} fontWeight={600}>
          Fp2 곱셈 1회 = Fp 곱셈 3회 → G2 연산 ≈ G1의 3배 비용
        </text>
      </motion.g>
    </g>
  );
}

export function G2GeneratorStep() {
  const fields = [
    { label: 'x.c0', val: '0x1800deef...', c: CV },
    { label: 'x.c1', val: '0x198e9393...', c: CV },
    { label: 'y.c0', val: '0x12c85ea5...', c: CE },
    { label: 'y.c1', val: '0x090689d0...', c: CE },
  ];
  return (
    <g>
      <text x={15} y={14} fontSize={8} fill="var(--muted-foreground)">G2 생성자 좌표 (Fp2 = c0 + c1·u)</text>
      {fields.map((f, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
          <rect x={15} y={22 + i * 24} width={410} height={20} rx={3}
            fill={`${f.c}08`} stroke={f.c} strokeWidth={0.7} />
          <text x={55} y={35 + i * 24} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={f.c}>{f.label}</text>
          <text x={240} y={35 + i * 24} textAnchor="middle"
            fontSize={7.5} fill="var(--muted-foreground)">{f.val}</text>
        </motion.g>
      ))}
    </g>
  );
}
