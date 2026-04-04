import { motion } from 'framer-motion';
import EncoderDecoderViz from './viz/EncoderDecoderViz';

const points = [
  'Self-Attention으로 시퀀스 내 모든 토큰 간 관계 계산',
  'Multi-Head로 다양한 관점의 정보 포착',
  'Positional Encoding으로 순서 정보 보존',
  '병렬 처리 가능 → 학습 속도 대폭 향상',
];

export default function Summary() {
  return (
    <section id="summary">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">전체 아키텍처 흐름</h2>
      <EncoderDecoderViz />
      <div className="rounded-lg border p-4 space-y-3">
        {points.map((text, i) => (
          <motion.div
            key={i}
            className="flex items-start gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
          >
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              {i + 1}
            </span>
            <p className="text-foreground/75 text-sm">{text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
