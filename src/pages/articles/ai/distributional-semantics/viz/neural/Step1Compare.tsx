import { motion } from 'framer-motion';

const C = { count: '#ef4444', pred: '#10b981', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0, y: 4 }, animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: d },
});

const rows = [
  { label: '입력', count: '동시발생 행렬', pred: '윈도우 단어 쌍' },
  { label: '학습', count: 'SVD (일괄 처리)', pred: 'SGD (점진적)' },
  { label: '확장성', count: 'O(V²) 메모리', pred: '미니배치로 무제한' },
  { label: '새 단어', count: '재계산 필요', pred: '추가 학습 가능' },
  { label: '비선형성', count: '없음', pred: '활성화 함수로 포착' },
];

export default function Step1Compare() {
  return (
    <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={260} y={22} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.pred} {...fade(0)}>
        통계 기반 vs 추론 기반
      </motion.text>

      {/* 헤더 */}
      <motion.g {...fade(0.2)}>
        <text x={30} y={48} fontSize={11} fontWeight={600} fill={C.m}>구분</text>
        <rect x={120} y={34} width={170} height={22} rx={4}
          fill={`${C.count}12`} stroke={`${C.count}30`} strokeWidth={0.5} />
        <text x={205} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.count}>
          통계 기반 (SVD)
        </text>
        <rect x={310} y={34} width={190} height={22} rx={4}
          fill={`${C.pred}12`} stroke={`${C.pred}30`} strokeWidth={0.5} />
        <text x={405} y={50} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.pred}>
          추론 기반 (Word2Vec)
        </text>
      </motion.g>

      {/* 행 */}
      {rows.map((r, i) => (
        <motion.g key={r.label} {...fade(0.4 + i * 0.2)}>
          <line x1={20} y1={62 + i * 28} x2={500} y2={62 + i * 28}
            stroke={`${C.m}15`} strokeWidth={0.5} />
          <text x={30} y={78 + i * 28} fontSize={11} fontWeight={500} fill={C.m}>{r.label}</text>
          <text x={205} y={78 + i * 28} textAnchor="middle" fontSize={10} fill={C.count}>{r.count}</text>
          <text x={405} y={78 + i * 28} textAnchor="middle" fontSize={10} fill={C.pred}>{r.pred}</text>
        </motion.g>
      ))}

      {/* Word2Vec 전환 */}
      <motion.g {...fade(1.4)}>
        <line x1={20} y1={198} x2={500} y2={198} stroke={`${C.pred}20`} strokeWidth={0.5} />
        <text x={260} y={216} textAnchor="middle" fontSize={11} fill={C.pred}>
          Mikolov (2013) Word2Vec → GloVe (2014) 통합 → 분포 가설 위의 구현 방식만 다름
        </text>
      </motion.g>
    </svg>
  );
}
