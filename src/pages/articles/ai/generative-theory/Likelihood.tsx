import M from '@/components/ui/math';
import { CitationBlock } from '@/components/ui/citation';
import LikelihoodViz from './viz/LikelihoodViz';

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

        <h3 className="text-xl font-semibold mt-6 mb-3">우도 기반 생성 모델 수식</h3>

        <M display>
          {`\\theta^* = \\underbrace{\\arg\\min_\\theta \\text{KL}\\bigl(P_{\\text{data}} \\,\\|\\, P_\\theta\\bigr)}_{\\text{데이터 분포와 모델 분포의 KL 발산 최소화}}`}
        </M>

        <M display>
          {`P(x) = \\underbrace{\\prod_{t=1}^{T} P(x_t \\mid x_{<t})}_{\\text{Chain Rule: 시퀀스를 조건부 확률의 곱으로 분해}}`}
        </M>

        <M display>
          {`\\underbrace{Q(z) = P(z \\mid x,\\, \\theta_{\\text{old}})}_{\\textbf{E-step: } \\text{잠재 변수 사후 분포 추정}} \\quad\\longrightarrow\\quad \\underbrace{\\theta_{\\text{new}} = \\arg\\max_\\theta \\mathbb{E}_Q[\\log P(x, z \\mid \\theta)]}_{\\textbf{M-step: } \\text{기대 로그 우도 최대화}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">MLE</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <M>{'\\arg\\max_\\theta \\sum_i \\log P_\\theta(x_i)'}</M> — 로그 우도 합산 최대화 = <M>{'\\text{KL}(P_{\\text{data}} \\| P_\\theta)'}</M> 최소화와 동치. 분포를 직접 정의하므로 샘플링·밀도 평가 모두 가능
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Autoregressive</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              GPT: <M>{'P(x_t|x_{<t}) = \\text{softmax}(\\text{Decoder}(x_{<t}))'}</M>. PixelCNN: masked convolution으로 이미지 픽셀을 래스터 순서로 생성. 정확한 우도 계산 가능하지만 순차 생성으로 속도 제한
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">EM 알고리즘</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              잠재 변수 포함 MLE — E-step에서 <M>{'Q(z)'}</M> 추정, M-step에서 <M>{'\\theta'}</M> 갱신을 반복. <M>{'\\log P(x|\\theta)'}</M> 단조 증가 보장 — 수렴 안정적
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
