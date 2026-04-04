import { motion } from 'framer-motion';

const C = { hi: '#6366f1', ok: '#10b981', warn: '#ef4444', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

export default function Step2LSA() {
  return (
    <svg viewBox="0 0 500 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={250} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.hi} {...fade(0)}>
        LSA: SVD를 단어-문서 행렬에 적용
      </motion.text>

      {/* 동의어 해결 */}
      <motion.g {...fade(0.3)}>
        <rect x={20} y={40} width={220} height={60} rx={6}
          fill={`${C.ok}10`} stroke={`${C.ok}30`} strokeWidth={0.6} />
        <text x={130} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ok}>
          동의어 문제 해결
        </text>
        <text x={130} y={80} textAnchor="middle" fontSize={10} fill={C.m}>
          "자동차"와 "차량" → 같은 잠재 차원에 매핑
        </text>
        <text x={130} y={94} textAnchor="middle" fontSize={10} fill={C.ok}>
          비슷한 문서에 등장 → 가까운 벡터
        </text>
      </motion.g>

      {/* 다의어 미해결 */}
      <motion.g {...fade(0.7)}>
        <rect x={260} y={40} width={220} height={60} rx={6}
          fill={`${C.warn}10`} stroke={`${C.warn}30`} strokeWidth={0.6} />
        <text x={370} y={60} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.warn}>
          다의어 문제 미해결
        </text>
        <text x={370} y={80} textAnchor="middle" fontSize={10} fill={C.m}>
          "배" = 과일? 선박? 신체 부위?
        </text>
        <text x={370} y={94} textAnchor="middle" fontSize={10} fill={C.warn}>
          문맥 무시 → 하나의 벡터로 뭉침
        </text>
      </motion.g>

      {/* 특성 요약 */}
      <motion.g {...fade(1.1)}>
        <rect x={20} y={115} width={460} height={60} rx={6}
          fill={`${C.hi}08`} stroke={`${C.hi}20`} strokeWidth={0.5} />
        <text x={40} y={136} fontSize={11} fill={C.ok}>장점: 전체 통계를 한 번에 활용, 수학적으로 명확</text>
        <text x={40} y={154} fontSize={11} fill={C.warn}>
          단점: 대규모 행렬 비용, 새 단어 시 재계산, 선형 관계만 포착
        </text>
        <text x={40} y={172} fontSize={10} fill={C.m}>
          → 이 한계를 넘기 위해 신경망 기반 접근이 등장
        </text>
      </motion.g>
    </svg>
  );
}
