import MathText from '@/components/ui/math-text';
import { motion } from 'framer-motion';
import EncoderDecoderScene from './viz/EncoderDecoderScene';
import SummaryDetailScene from './viz/SummaryDetailScene';

const points = [
  '토큰을 행렬 X로 묶고 위치 P를 더한다',
  'Q/K/V와 attention으로 위치 사이 정보를 직접 가져온다',
  '여러 head가 다른 관계를 병렬로 학습한다',
  'FFN, residual, LayerNorm이 깊은 stack을 안정화한다',
];

export default function Summary() {
  return (
    <MathText id="summary">
      <h2 className="text-2xl font-semibold mb-4 scroll-mt-20">전체 아키텍처 흐름</h2>
      <EncoderDecoderScene />
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
      <SummaryDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: encoder-only는 양방향 이해, decoder-only는 causal 생성, encoder-decoder는 source-target 변환에 맞다.<br />
          요약 2: 같은 primitive라도 mask와 cross-attention 유무가 모델 계열을 나눈다.<br />
          요약 3: 긴 문맥, 효율 추론, 멀티모달은 이 기본 조각의 확장 문제다.
        </p>
      </div>
    </MathText>
  );
}
