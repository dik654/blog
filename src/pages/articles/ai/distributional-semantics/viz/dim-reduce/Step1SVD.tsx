import { motion } from 'framer-motion';

const C = { x: '#ef4444', u: '#6366f1', s: '#f59e0b', v: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.4, delay: d },
});

export default function Step1SVD() {
  return (
    <svg viewBox="0 0 520 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.u} {...fade(0)}>
        SVD: X = U Σ Vᵀ
      </motion.text>

      {/* X 행렬 */}
      <motion.g {...fade(0.3)}>
        <rect x={15} y={36} width={70} height={90} rx={5}
          fill={`${C.x}15`} stroke={C.x} strokeWidth={1} />
        <text x={50} y={85} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.x}>X</text>
        <text x={50} y={140} textAnchor="middle" fontSize={10} fill={C.m}>V x V</text>
        <text x={50} y={155} textAnchor="middle" fontSize={9} fill={C.m}>동시발생 행렬</text>
      </motion.g>

      {/* = */}
      <motion.text x={100} y={85} fontSize={16} fill={C.m} {...fade(0.5)}>=</motion.text>

      {/* U 행렬 */}
      <motion.g {...fade(0.7)}>
        <rect x={115} y={36} width={50} height={90} rx={5}
          fill={`${C.u}15`} stroke={C.u} strokeWidth={1} />
        <text x={140} y={85} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.u}>U</text>
        <text x={140} y={140} textAnchor="middle" fontSize={10} fill={C.u}>V x k</text>
        <text x={140} y={155} textAnchor="middle" fontSize={9} fill={C.m}>단어 벡터</text>
      </motion.g>

      {/* x */}
      <motion.text x={178} y={85} fontSize={14} fill={C.m} {...fade(0.8)}>·</motion.text>

      {/* Σ 대각 행렬 */}
      <motion.g {...fade(0.9)}>
        <rect x={190} y={50} width={60} height={60} rx={5}
          fill={`${C.s}15`} stroke={C.s} strokeWidth={1} />
        <text x={220} y={85} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.s}>Σ</text>
        <text x={220} y={125} textAnchor="middle" fontSize={10} fill={C.s}>k x k</text>
        <text x={220} y={140} textAnchor="middle" fontSize={9} fill={C.m}>특이값 대각</text>
      </motion.g>

      {/* x */}
      <motion.text x={263} y={85} fontSize={14} fill={C.m} {...fade(1.0)}>·</motion.text>

      {/* Vᵀ 행렬 */}
      <motion.g {...fade(1.1)}>
        <rect x={278} y={50} width={90} height={60} rx={5}
          fill={`${C.v}15`} stroke={C.v} strokeWidth={1} />
        <text x={323} y={85} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.v}>Vᵀ</text>
        <text x={323} y={125} textAnchor="middle" fontSize={10} fill={C.v}>k x V</text>
        <text x={323} y={140} textAnchor="middle" fontSize={9} fill={C.m}>맥락 벡터</text>
      </motion.g>

      {/* Numerical example: small 3x3 SVD */}
      <motion.g {...fade(1.4)}>
        <rect x={380} y={32} width={135} height={128} rx={5}
          fill={`${C.u}08`} stroke={`${C.u}20`} strokeWidth={0.5} />
        <text x={447} y={48} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.u}>3x3 예시</text>
        {/* Sigma values */}
        <text x={395} y={66} fontSize={9} fill={C.s}>σ₁ = 4.12</text>
        <rect x={445} y={58} width={60} height={8} rx={2} fill="#80808010" stroke="#555" strokeWidth={0.3} />
        <rect x={445} y={58} width={60} height={8} rx={2} fill={`${C.s}40`} />

        <text x={395} y={82} fontSize={9} fill={C.s}>σ₂ = 1.85</text>
        <rect x={445} y={74} width={60} height={8} rx={2} fill="#80808010" stroke="#555" strokeWidth={0.3} />
        <rect x={445} y={74} width={27} height={8} rx={2} fill={`${C.s}40`} />

        <text x={395} y={98} fontSize={9} fill={`${C.s}80`}>σ₃ = 0.24</text>
        <rect x={445} y={90} width={60} height={8} rx={2} fill="#80808010" stroke="#555" strokeWidth={0.3} />
        <rect x={445} y={90} width={4} height={8} rx={2} fill={`${C.s}20`} />
        <line x1={445} y1={89} x2={507} y2={99} stroke={C.x} strokeWidth={0.8} strokeOpacity={0.5} />

        <text x={447} y={114} textAnchor="middle" fontSize={9} fill={C.u} fontWeight={600}>
          상위 2개 유지 → k=2
        </text>
        <text x={447} y={128} textAnchor="middle" fontSize={9} fill={C.m}>
          정보 보존: 97%
        </text>
        <text x={447} y={142} textAnchor="middle" fontSize={8} fill={C.m}>
          (4.12²+1.85²) / Σσ²
        </text>
        <text x={447} y={154} textAnchor="middle" fontSize={9} fill={C.u}>
          k = 100~300
        </text>
      </motion.g>

      <motion.text x={260} y={175} textAnchor="middle" fontSize={10} fill={C.m} {...fade(1.6)}>
        수만 차원의 희소 벡터 → 수백 차원의 밀집 벡터로 압축
      </motion.text>
    </svg>
  );
}
