import { motion } from 'framer-motion';

const C = { gt: '#f59e0b', frob: '#6366f1', ch: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay: d },
});

/** Hard Part: exponent decomposition into x-chain + Frobenius */
export default function Step11Hard() {
  return (
    <svg viewBox="0 0 540 300" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={270} y={24} textAnchor="middle" fontSize={14} fontWeight={600}
        fill={C.gt} {...fade(0)}>Hard Part: hᵈ (d = (p⁴−p²+1)/r)</motion.text>
      <motion.text x={270} y={48} textAnchor="middle" fontSize={11} fill={C.m} {...fade(0.15)}>
        d ≈ 600-bit — 직접 거듭제곱하면 600번 제곱. 더 빠른 방법이 있다
      </motion.text>

      {/* Decomposition formula */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={58} width={500} height={34} rx={5}
          fill={`${C.gt}10`} stroke={`${C.gt}25`} strokeWidth={0.6} />
        <text x={270} y={80} textAnchor="middle" fontSize={12} fontWeight={500} fill={C.gt}>
          d = c₀ + c₁·p + c₂·p² + c₃·p³ (각 cᵢ ≈ 63-bit)
        </text>
      </motion.g>

      {/* Two key ideas */}
      <motion.g {...fade(0.6)}>
        <rect x={20} y={106} width={240} height={60} rx={6}
          fill={`${C.frob}10`} stroke={`${C.frob}25`} strokeWidth={0.6} />
        <text x={32} y={128} fontSize={12} fontWeight={600} fill={C.frob}>핵심 1: hᵖᵏ = Frobenius</text>
        <text x={32} y={148} fontSize={11} fill={C.m}>hᵖ = 계수에 상수 곱 (공짜)</text>
        <text x={32} y={162} fontSize={11} fill={C.m}>hᵖ², hᵖ³도 Frobenius 반복</text>
      </motion.g>

      <motion.g {...fade(0.8)}>
        <rect x={280} y={106} width={240} height={60} rx={6}
          fill={`${C.ch}10`} stroke={`${C.ch}25`} strokeWidth={0.6} />
        <text x={292} y={128} fontSize={12} fontWeight={600} fill={C.ch}>핵심 2: cᵢ를 x로 표현</text>
        <text x={292} y={148} fontSize={11} fill={C.m}>BN254 파라미터 x ≈ 63-bit</text>
        <text x={292} y={162} fontSize={11} fill={C.m}>cᵢ = x의 다항식 → 체인 가능</text>
      </motion.g>

      {/* Computation chain */}
      <motion.text x={270} y={192} textAnchor="middle" fontSize={12} fontWeight={600}
        fill={C.gt} {...fade(1.1)}>실제 계산 체인</motion.text>

      {[
        { label: 'hˣ', sub: '63-bit 체인', x: 20, w: 100 },
        { label: '(hˣ)ˣ', sub: '= hˣ²', x: 134, w: 100 },
        { label: '(hˣ²)ˣ', sub: '= hˣ³', x: 248, w: 100 },
        { label: '조합', sub: 'Frob 4번', x: 362, w: 80 },
        { label: 'GT', sub: '최종 결과', x: 460, w: 60 },
      ].map((b, i) => {
        const bc = i < 3 ? C.ch : i === 3 ? C.frob : C.gt;
        return (
          <motion.g key={i} {...fade(1.3 + i * 0.15)}>
            <rect x={b.x} y={202} width={b.w} height={40} rx={5}
              fill={`${bc}15`} stroke={`${bc}40`} strokeWidth={0.6} />
            <text x={b.x + b.w / 2} y={220} textAnchor="middle"
              fontSize={12} fontWeight={500} fill={bc}>{b.label}</text>
            <text x={b.x + b.w / 2} y={236} textAnchor="middle"
              fontSize={10} fill={C.m}>{b.sub}</text>
          </motion.g>
        );
      })}

      {/* Chain arrows */}
      {[122, 236, 350, 444].map((x, i) => (
        <motion.g key={i} {...fade(1.5 + i * 0.12)}>
          <line x1={x} y1={222} x2={x + 10} y2={222} stroke={`${C.m}50`} strokeWidth={0.7} />
          <polygon points={`${x + 10},219 ${x + 14},222 ${x + 10},225`} fill={`${C.m}50`} />
        </motion.g>
      ))}

      {/* Bottom cost */}
      <motion.g {...fade(2.2)}>
        <rect x={20} y={256} width={500} height={30} rx={5}
          fill={`${C.gt}10`} stroke={`${C.gt}25`} strokeWidth={0.5} />
        <text x={60} y={276} fontSize={11} fill={C.m}>제곱 체인: ~190번</text>
        <text x={230} y={276} fontSize={11} fill={C.m}>Fp12 곱: ~30번</text>
        <text x={400} y={276} fontSize={11} fill={C.frob}>Frobenius: 4번 (공짜)</text>
      </motion.g>
    </svg>
  );
}
