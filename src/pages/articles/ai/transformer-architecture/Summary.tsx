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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Transformer 시대의 핵심 모델들</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Transformer 기반 주요 모델들 (2017~2024)
//
// Encoder-only (이해 중심):
//   2018 BERT (Google) - 110M, MLM
//   2019 RoBERTa (Meta) - 125M, no NSP
//   2019 ALBERT - 12M, 파라미터 공유
//   2020 DeBERTa - disentangled attention
//   2020 ELECTRA - replaced token detection
//
// Decoder-only (생성 중심):
//   2018 GPT-1 (OpenAI) - 117M
//   2019 GPT-2 - 1.5B
//   2020 GPT-3 - 175B, few-shot learning
//   2023 GPT-4 - 추정 1.7T, multi-modal
//   2022 LLaMA (Meta) - 7B~65B
//   2023 LLaMA-2 - improved
//   2024 LLaMA-3 - 8B~405B
//   2023 Mistral / Mixtral (MoE)
//   2024 Claude 3 (Anthropic)
//   2024 Gemini (Google)
//
// Encoder-Decoder (seq2seq):
//   2019 T5 (Google) - 11B
//   2020 BART (Meta) - denoising
//   2022 Flan-T5 - instruction tuned
//
// 멀티모달:
//   2021 CLIP - text-image
//   2022 DALL-E 2 - text→image
//   2023 GPT-4V - vision
//   2024 Sora - text→video

// 아키텍처 혁신:
//   - Sparse Mixture of Experts (Switch Transformer, Mixtral)
//   - Flash Attention (메모리 최적화)
//   - Grouped Query Attention (GQA, LLaMA-2)
//   - Sliding Window Attention (Mistral)
//   - State Space Models (Mamba, 2023)
//
// 2024 트렌드:
//   - 긴 문맥 (1M tokens, Gemini)
//   - 효율적 추론 (speculative decoding, medusa)
//   - Open-source 경쟁 (LLaMA-3, Mixtral)
//   - Agent / tool use
//   - Multi-step reasoning (o1, Claude thinking)

// 인용:
//   "Attention Is All You Need" - 100,000+ 인용
//   딥러닝 역사상 가장 영향력 있는 논문 중 하나`}
        </pre>
        <p className="leading-7">
          요약 1: Transformer는 <strong>Encoder/Decoder/Hybrid</strong>로 분화해 각 분야 지배.<br />
          요약 2: <strong>Scaling + 아키텍처 혁신</strong>이 7년간 지속적 성능 개선.<br />
          요약 3: 2024년 현재 <strong>긴 문맥·효율 추론·멀티모달</strong>이 주요 연구 방향.
        </p>
      </div>
    </section>
  );
}
