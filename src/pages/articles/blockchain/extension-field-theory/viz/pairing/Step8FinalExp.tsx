import { motion } from 'framer-motion';

const C = { fe: '#a78bfa', gt: '#f59e0b', g2: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Final Exp overview: exponent decomposition + 3-phase pipeline */
export default function Step8FinalExp() {
  return (
    <svg viewBox="0 0 540 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.fe} {...fade(0)}>Final Exp: f → f⁽ᵖ¹²⁻¹⁾/ʳ</motion.text>
      <motion.text x={270} y={48} textAnchor="middle" fontSize={11} fill={C.m} {...fade(0.15)}>
        ~3000-bit 지수를 인수분해로 3단계 분리
      </motion.text>

      {/* Decomposition bar */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={58} width={500} height={34} rx={5}
          fill={`${C.fe}10`} stroke={`${C.fe}25`} strokeWidth={0.6} />
        <text x={270} y={80} textAnchor="middle" fontSize={12} fill={C.fe}>
          (p¹²−1)/r = (p⁶−1) · (p²+1) · (p⁴−p²+1)/r
        </text>
      </motion.g>

      {/* 3 phase boxes */}
      {[
        { x: 20, c: C.g2, n: '① Easy 1', op: 'f⁽ᵖ⁶⁻¹⁾',
          d1: '켤레 f̄ (w 부호 반전)', d2: 'f̄ · f⁻¹', cost: 'Fp12 곱 2번' },
        { x: 190, c: C.fe, n: '② Easy 2', op: 'g⁽ᵖ²⁺¹⁾',
          d1: 'Frobenius gᵖ²', d2: '(치환) · g', cost: 'Frob 1 + 곱 1' },
        { x: 360, c: C.gt, n: '③ Hard', op: 'hᵈ (d≈600-bit)',
          d1: 'd = c₀+c₁p+c₂p²+c₃p³', d2: 'pᵏ = Frobenius(공짜)', cost: '곱 ~30 + Frob 4' },
      ].map((b, i) => (
        <motion.g key={i} {...fade(0.6 + i * 0.25)}>
          <rect x={b.x} y={108} width={160} height={110} rx={6}
            fill={`${b.c}10`} stroke={`${b.c}30`} strokeWidth={0.7} />
          <text x={b.x + 12} y={130} fontSize={12} fontWeight={600} fill={b.c}>{b.n}</text>
          <text x={b.x + 12} y={150} fontSize={12} fontWeight={500} fill={b.c}>{b.op}</text>
          <line x1={b.x + 10} y1={158} x2={b.x + 150} y2={158}
            stroke={`${b.c}20`} strokeWidth={0.5} />
          <text x={b.x + 12} y={178} fontSize={10} fill={C.m}>{b.d1}</text>
          <text x={b.x + 12} y={196} fontSize={10} fill={C.m}>{b.d2}</text>
          <text x={b.x + 148} y={212} textAnchor="end" fontSize={10}
            fontWeight={500} fill={b.c}>{b.cost}</text>
        </motion.g>
      ))}

      {/* Phase arrows */}
      {[{ x1: 180, x2: 190 }, { x1: 350, x2: 360 }].map((a, i) => (
        <motion.g key={i} {...fade(1.2 + i * 0.2)}>
          <line x1={a.x1} y1={163} x2={a.x2} y2={163} stroke={`${C.m}40`} strokeWidth={0.7} />
          <polygon points={`${a.x2},160 ${a.x2 + 5},163 ${a.x2},166`} fill={`${C.m}40`} />
        </motion.g>
      ))}

      {/* Bottom pipeline */}
      <motion.g {...fade(1.6)}>
        <rect x={20} y={234} width={500} height={44} rx={5}
          fill={`${C.gt}08`} stroke={`${C.gt}20`} strokeWidth={0.5} />
        <text x={50} y={258} fontSize={12} fill={C.m}>f</text>
        <text x={68} y={258} fontSize={11} fill={C.g2}>→ Easy1 →</text>
        <text x={162} y={258} fontSize={12} fill={C.m}>g</text>
        <text x={180} y={258} fontSize={11} fill={C.fe}>→ Easy2 →</text>
        <text x={276} y={258} fontSize={12} fill={C.m}>h</text>
        <text x={294} y={258} fontSize={11} fill={C.gt}>→ Hard →</text>
        <text x={380} y={258} fontSize={12} fontWeight={600} fill={C.gt}>GT 원소</text>
        <text x={510} y={272} textAnchor="end" fontSize={11} fontWeight={500}
          fill={C.gt}>총 ~5,000 Fp곱</text>
      </motion.g>
    </svg>
  );
}
