import { motion } from 'framer-motion';

const C = { pred: '#10b981', hi: '#6366f1', gt: '#f59e0b', m: 'var(--muted-foreground)' };
const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { duration: 0.4, delay: d },
});

export default function Step2Pipeline() {
  const boxes = [
    { label: '코퍼스', sub: '"나 는 고양이 를 좋아한다"', x: 10, c: C.m },
    { label: '윈도우 추출', sub: '(나, 는), (는, 고양이)...', x: 130, c: C.hi },
    { label: '신경망 학습', sub: 'SGD 미니배치', x: 260, c: C.pred },
    { label: '임베딩', sub: '밀집 벡터 d=300', x: 390, c: C.gt },
  ];

  return (
    <svg viewBox="0 0 510 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <motion.text x={255} y={20} textAnchor="middle" fontSize={13} fontWeight={600}
        fill={C.pred} {...fade(0)}>
        추론 기반 학습 파이프라인
      </motion.text>

      {boxes.map((b, i) => (
        <motion.g key={b.label} {...fade(0.3 + i * 0.3)}>
          <rect x={b.x} y={40} width={110} height={56} rx={6}
            fill={`${b.c}15`} stroke={`${b.c}40`} strokeWidth={0.7} />
          <text x={b.x + 55} y={62} textAnchor="middle" fontSize={11}
            fontWeight={600} fill={b.c}>{b.label}</text>
          <text x={b.x + 55} y={82} textAnchor="middle" fontSize={9} fill={C.m}>{b.sub}</text>
          {i < boxes.length - 1 && (
            <>
              <line x1={b.x + 114} y1={68} x2={boxes[i + 1].x - 4} y2={68}
                stroke={`${C.m}50`} strokeWidth={0.8} />
              <polygon points={`${boxes[i + 1].x - 4},65 ${boxes[i + 1].x},68 ${boxes[i + 1].x - 4},71`}
                fill={`${C.m}50`} />
            </>
          )}
        </motion.g>
      ))}

      {/* 핵심 차이 */}
      <motion.g {...fade(1.5)}>
        <rect x={10} y={110} width={490} height={50} rx={6}
          fill={`${C.pred}08`} stroke={`${C.pred}20`} strokeWidth={0.5} />
        {[
          { text: '미니배치 → 대규모 코퍼스 처리 가능', c: C.pred, x: 30, y: 130 },
          { text: 'GPU 병렬 처리와 자연스럽게 호환', c: C.pred, x: 30, y: 148 },
          { text: '새 단어 → 추가 학습만으로 반영', c: C.hi, x: 300, y: 130 },
          { text: '비선형 관계 포착 가능', c: C.hi, x: 300, y: 148 },
        ].map(t => (
          <text key={t.text} x={t.x} y={t.y} fontSize={10} fill={t.c}>{t.text}</text>
        ))}
      </motion.g>
    </svg>
  );
}
