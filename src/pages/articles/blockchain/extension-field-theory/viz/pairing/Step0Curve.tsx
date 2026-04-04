import { motion } from 'framer-motion';

const C = { g1: '#6366f1', line: '#ef4444', res: '#f59e0b', m: 'var(--muted-foreground)' };

const p = {
  u: 'M 40 140 C 50 118 60 111 70 107 C 82 103 100 102 120 102 C 140 102 155 99 173 96 C 195 88 218 72 240 55',
  l: 'M 40 140 C 50 162 60 169 70 173 C 82 177 100 178 120 178 C 140 178 155 181 173 184 C 195 192 218 208 240 225',
};

const draw = (d: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { pathLength: { duration: 0.8, delay: d }, opacity: { duration: 0.2, delay: d } },
});
const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.3, delay: d },
});

export default function Step0Curve() {
  return (
    <svg viewBox="0 0 490 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <line x1={30} y1={140} x2={250} y2={140} stroke={`${C.g1}20`} strokeWidth={0.5} />

      {/* 곡선 (draws) */}
      <motion.path d={p.u} fill="none" stroke={C.g1} strokeWidth={2} {...draw(0)} />
      <motion.path d={p.l} fill="none" stroke={C.g1} strokeWidth={2} {...draw(0)} />
      <motion.text x={195} y={48} fontSize={11} fill={C.g1} {...fade(0.5)}>y² = x³ + 3</motion.text>

      {/* P */}
      <motion.g {...fade(0.9)}>
        <circle cx={120} cy={102} r={6} fill={C.g1} />
        <text x={128} y={94} fontSize={14} fontWeight={600} fill={C.g1}>P</text>
      </motion.g>

      {/* Q */}
      <motion.g {...fade(1.2)}>
        <circle cx={173} cy={96} r={6} fill={C.g1} />
        <text x={181} y={88} fontSize={14} fontWeight={600} fill={C.g1}>Q</text>
      </motion.g>

      {/* ❶ 직선 */}
      <motion.line x1={35} y1={112} x2={250} y2={87}
        stroke={C.line} strokeWidth={1} strokeDasharray="5 3" opacity={0.7} {...draw(1.5)} />

      {/* ❷ 세번째 교점 */}
      <motion.g {...fade(2.0)}>
        <circle cx={70} cy={107} r={5} fill="none" stroke={C.line} strokeWidth={1.5} />
      </motion.g>

      {/* 반사 */}
      <motion.line x1={70} y1={114} x2={70} y2={166}
        stroke={C.line} strokeWidth={0.8} strokeDasharray="3 2" {...draw(2.4)} />
      <motion.text x={76} y={143} fontSize={9} fill={C.line} {...fade(2.4)}>반사</motion.text>

      {/* ❸ P+Q */}
      <motion.g {...fade(2.8)}>
        <circle cx={70} cy={173} r={7} fill={C.res} />
        <text x={81} y={178} fontSize={14} fontWeight={600} fill={C.res}>P+Q</text>
      </motion.g>

      {/* 오른쪽: 규칙 (synced) */}
      <motion.text x={290} y={72} fontSize={15} fontWeight={600} fill={C.g1} {...fade(0.5)}>
        점 덧셈
      </motion.text>
      {[
        { n: '❶', t: 'P와 Q를 잇는 직선', d: 1.5, c: C.line, y: 106 },
        { n: '❷', t: '곡선과의 세번째 교점', d: 2.0, c: C.line, y: 140 },
        { n: '❸', t: 'x축 반사 → P + Q', d: 2.8, c: C.res, y: 174 },
      ].map(s => (
        <motion.g key={s.n} {...fade(s.d)}>
          <text x={290} y={s.y} fontSize={15} fontWeight={500} fill={s.c}>{s.n}</text>
          <text x={318} y={s.y} fontSize={12} fill={C.m}>{s.t}</text>
        </motion.g>
      ))}

      <motion.g {...fade(3.2)}>
        <line x1={290} y1={196} x2={480} y2={196} stroke={`${C.g1}15`} strokeWidth={0.5} />
        <text x={290} y={218} fontSize={12} fontWeight={500} fill={C.g1}>
          이 연산으로 군(group)이 만들어진다
        </text>
        <text x={290} y={240} fontSize={11} fill={C.m}>P+Q = Q+P (교환법칙)</text>
        <text x={290} y={258} fontSize={11} fill={C.m}>P+(-P) = O (역원 = x축 반사)</text>
      </motion.g>
    </svg>
  );
}
