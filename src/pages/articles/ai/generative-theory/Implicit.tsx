import M from '@/components/ui/math';
import { CitationBlock } from '@/components/ui/citation';
import ImplicitViz from './viz/ImplicitViz';

export default function Implicit() {
  return (
    <section id="implicit" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GAN, Score Matching, Diffusion</h2>
      <div className="not-prose mb-8"><ImplicitViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          암시적 모델 — P(x)를 직접 정의하지 않음.<br />
          GAN(적대적 학습), Score Matching(밀도 기울기), Diffusion(둘의 결합).
        </p>

        <CitationBlock source="Ho et al., 2020 — Denoising Diffusion Probabilistic Models"
          citeKey={4} type="paper" href="https://arxiv.org/abs/2006.11239">
          <p className="italic">"We present high quality image synthesis results using diffusion
          probabilistic models — a class of latent variable models inspired by nonequilibrium thermodynamics."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">암시적 생성 모델 수식</h3>

        <M display>
          {`\\min_G \\max_D \\; \\underbrace{\\mathbb{E}_{x \\sim P_{\\text{data}}}[\\log D(x)] + \\mathbb{E}_{z \\sim P_z}[\\log(1 - D(G(z)))]}_{\\text{내쉬 균형: } P_G = P_{\\text{data}},\\; D(x) = 0.5}`}
        </M>

        <M display>
          {`\\underbrace{s_\\theta(x) \\approx \\nabla_x \\log P_{\\text{data}}(x)}_{\\text{스코어 함수: 밀도의 기울기를 신경망으로 근사}}`}
        </M>

        <M display>
          {`\\underbrace{q(x_t|x_{t-1}) = \\mathcal{N}\\bigl(\\sqrt{1-\\beta_t}\\, x_{t-1},\\; \\beta_t I\\bigr)}_{\\text{Forward: 점진적 노이즈 추가}} \\quad\\longrightarrow\\quad \\underbrace{p_\\theta(x_{t-1}|x_t) = \\mathcal{N}\\bigl(\\mu_\\theta(x_t, t),\\; \\sigma_t^2 I\\bigr)}_{\\text{Reverse: 노이즈 제거}}`}
        </M>

        <M display>
          {`\\mathcal{L} = \\underbrace{\\mathbb{E}\\bigl[\\|\\epsilon - \\epsilon_\\theta(x_t, t)\\|^2\\bigr]}_{\\text{노이즈 예측 오차 최소화}}`}
        </M>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">GAN</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              생성자 <M>{'G'}</M>와 판별자 <M>{'D'}</M>의 적대적 학습 — 분포를 명시하지 않고 암시적으로 생성. 내쉬 균형에서 <M>{'P_G = P_{\\text{data}}'}</M> 수렴하지만 모드 붕괴·학습 불안정 이슈
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Score Matching</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              밀도 대신 <M>{'\\nabla_x \\log P(x)'}</M>(스코어)를 학습. DSM(Denoising Score Matching)으로 효율적 학습 후 Langevin Dynamics로 샘플링: <M>{'x\' = x + \\eta s(x) + \\text{noise}'}</M>
            </p>
          </div>
          <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-4">
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Diffusion</h4>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Score Matching + Denoising 결합. Forward에서 점진적 노이즈 추가, Reverse에서 <M>{'\\epsilon_\\theta'}</M>로 노이즈 예측·제거. DALL-E 2, Stable Diffusion 등의 기반
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
