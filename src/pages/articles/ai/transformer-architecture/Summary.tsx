import { motion } from 'framer-motion';
import EncoderDecoderViz from './viz/EncoderDecoderViz';
import SummaryDetailViz from './viz/SummaryDetailViz';

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer 시대의 핵심 모델들</h3>
      </div>
      <SummaryDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: Transformer는 <strong>Encoder/Decoder/Hybrid</strong>로 분화해 각 분야 지배.<br />
          요약 2: <strong>Scaling + 아키텍처 혁신</strong>이 7년간 지속적 성능 개선.<br />
          요약 3: 2024년 현재 <strong>긴 문맥·효율 추론·멀티모달</strong>이 주요 연구 방향.
        </p>
      </div>
    </section>
  );
}
