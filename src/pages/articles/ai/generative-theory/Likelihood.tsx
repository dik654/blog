import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';
import LikelihoodViz from './viz/LikelihoodViz';

const mleCode = `우도 기반 생성 모델:

1. MLE (Maximum Likelihood Estimation):
   theta* = argmax_theta Sum_i log P_theta(x_i)
   = argmin_theta KL(P_data || P_theta)
   → 데이터 분포와 모델 분포의 KL 발산 최소화

2. Autoregressive 분해 (Chain Rule):
   P(x) = P(x_1) * P(x_2|x_1) * ... * P(x_T|x_{<T})
   GPT: P(x_t|x_{<t}) = softmax(TransformerDecoder(x_{<t}))
   PixelCNN: P(x_ij|x_{<ij}) = CNN with masked convolution

3. EM 알고리즘 (잠재 변수 포함 MLE):
   E-step: Q(z) = P(z | x, theta_old)
   M-step: theta_new = argmax_theta E_Q[log P(x,z|theta)]
   수렴: log P(x|theta) 단조 증가 보장`;

const annotations = [
  { lines: [3, 6] as [number, number], color: 'sky' as const, note: 'MLE = KL 최소화' },
  { lines: [8, 11] as [number, number], color: 'emerald' as const, note: 'AR 분해' },
  { lines: [13, 16] as [number, number], color: 'amber' as const, note: 'EM 수렴 보장' },
];

export default function Likelihood() {
  return (
    <section id="likelihood" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MLE, EM, 오토리그레시브</h2>
      <div className="not-prose mb-8"><LikelihoodViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          관측 데이터의 우도를 직접 최대화 = KL(P_data ‖ P_theta) 최소화.<br />
          AR 모델은 Chain Rule로 시퀀스를 조건부 확률의 곱으로 분해.
        </p>

        <CitationBlock source="Radford et al., 2018 — Improving Language Understanding by Generative Pre-Training (GPT)"
          citeKey={2} type="paper" href="https://cdn.openai.com/research-covers/language-unsupervised/language_understanding_paper.pdf">
          <p className="italic">"We use a language modeling objective to pre-train a Transformer decoder
          that generates tokens left-to-right, maximizing the likelihood of the next token."</p>
        </CitationBlock>

        <CodePanel title="우도 기반 생성 모델 수식" code={mleCode} annotations={annotations} />
      </div>
    </section>
  );
}
