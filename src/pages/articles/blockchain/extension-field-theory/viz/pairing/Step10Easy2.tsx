import { motion } from 'framer-motion';

const C = { fe: '#a78bfa', frob: '#6366f1', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});
const slotW = 36;
const baseX = 50;

/** Easy Part 2: g^(p²+1) via Frobenius + 1 mul */
export default function Step10Easy2() {
  const gammas = ['γ₀', 'γ₁', 'γ₂', 'γ₃', 'γ₄', 'γ₅', 'γ₆', 'γ₇', 'γ₈', 'γ₉', 'γ₁₀', 'γ₁₁'];

  return (
    <svg viewBox="0 0 540 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.fe} {...fade(0)}>Easy Part 2: g⁽ᵖ²⁺¹⁾</motion.text>
      <motion.text x={270} y={48} textAnchor="middle" fontSize={11} fill={C.m} {...fade(0.15)}>
        gᵖ² · g — 핵심: gᵖ²를 Frobenius로 공짜 계산
      </motion.text>

      {/* Original g slots */}
      <motion.g {...fade(0.3)}>
        <text x={baseX - 24} y={78} fontSize={11} fill={C.m}>g =</text>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={baseX + i * slotW} y={62} width={slotW - 3} height={26} rx={3}
            fill={`${C.fe}15`} stroke={`${C.fe}35`} strokeWidth={0.5} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <text key={`t${i}`} x={baseX + i * slotW + (slotW - 3) / 2} y={79}
            textAnchor="middle" fontSize={10} fill={C.fe}>g{i < 10 ? String.fromCharCode(8320 + i) : '₁' + (i - 10)}</text>
        ))}
      </motion.g>

      {/* ① Frobenius */}
      <motion.g {...fade(0.6)}>
        <line x1={270} y1={90} x2={270} y2={104} stroke={`${C.m}40`} strokeWidth={0.7} />
        <polygon points="267,104 270,110 273,104" fill={`${C.m}40`} />
        <text x={294} y={104} fontSize={11} fontWeight={500} fill={C.frob}>① Frobenius φ²</text>
      </motion.g>

      {/* Gamma multipliers */}
      {gammas.map((g, i) => (
        <motion.text key={i} x={baseX + i * slotW + (slotW - 3) / 2} y={126}
          textAnchor="middle" fontSize={10} fontWeight={500} fill={C.frob}
          initial={{ opacity: 0, y: -8 }} animate={{ opacity: 0.8, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 + i * 0.04 }}>×{g}</motion.text>
      ))}

      {/* Result slots */}
      <motion.g {...fade(1.3)}>
        <text x={baseX - 30} y={154} fontSize={11} fill={C.m}>gᵖ² =</text>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.rect key={i} x={baseX + i * slotW} y={138} width={slotW - 3} height={26} rx={3}
            fill={`${C.frob}15`} stroke={`${C.frob}35`} strokeWidth={0.5}
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 1.4 + i * 0.03 }} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <text key={`r${i}`} x={baseX + i * slotW + (slotW - 3) / 2} y={155}
            textAnchor="middle" fontSize={10} fill={C.frob}>gᵢ·γᵢ</text>
        ))}
      </motion.g>

      {/* Cost note */}
      <motion.g {...fade(1.7)}>
        <rect x={80} y={174} width={380} height={28} rx={5}
          fill={`${C.frob}10`} stroke={`${C.frob}25`} strokeWidth={0.5} />
        <text x={270} y={192} textAnchor="middle" fontSize={11} fill={C.frob}>
          γᵢ는 미리 계산된 상수 — 상수 스케일링 (비용 ≈ 0)
        </text>
      </motion.g>

      {/* ② multiply */}
      <motion.g {...fade(2.0)}>
        <line x1={270} y1={204} x2={270} y2={218} stroke={`${C.m}40`} strokeWidth={0.7} />
        <polygon points="267,218 270,224 273,218" fill={`${C.m}40`} />
        <text x={294} y={220} fontSize={11} fontWeight={500} fill={C.fe}>② gᵖ² · g</text>
      </motion.g>
      <motion.g {...fade(2.2)}>
        <rect x={80} y={230} width={380} height={32} rx={6}
          fill={`${C.fe}12`} stroke={`${C.fe}30`} strokeWidth={0.6} />
        <text x={270} y={250} textAnchor="middle" fontSize={12} fill={C.fe}>
          Fp12 곱셈 1번 (Karatsuba → Fp 곱 54번)
        </text>
      </motion.g>

      {/* Result */}
      <motion.g {...fade(2.5)}>
        <rect x={150} y={272} width={240} height={26} rx={5}
          fill={`${C.fe}20`} stroke={C.fe} strokeWidth={0.8} />
        <text x={270} y={290} textAnchor="middle" fontSize={12} fontWeight={600} fill={C.fe}>
          h = g⁽ᵖ²⁺¹⁾ ✓
        </text>
      </motion.g>
    </svg>
  );
}
