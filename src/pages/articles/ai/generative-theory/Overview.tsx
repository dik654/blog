import { CitationBlock } from '@/components/ui/citation';
import GenTaxonomyViz from './viz/GenTaxonomyViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">판별 vs 생성 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <strong>판별 모델</strong>은 입력 x가 주어졌을 때 레이블 y의 조건부 확률 P(y|x)를 학습합니다.
          <br />
          <strong>생성 모델</strong>은 데이터 자체의 분포 P(x)를 학습하여 새로운 샘플을 생성합니다.
          <br />
          핵심 과제는 고차원 데이터의 복잡한 확률 분포를 효과적으로 근사하는 것입니다.
        </p>

        <CitationBlock source="Goodfellow et al., 2014 — Generative Adversarial Networks"
          citeKey={1} type="paper" href="https://arxiv.org/abs/1406.2661">
          <p className="italic">"Generative models provide an explicit or implicit representation
          of the probability distribution over the data space."</p>
        </CitationBlock>
      </div>

      <div className="not-prose my-8"><GenTaxonomyViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">생성 모델 분류</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">분류</th>
                <th className="border border-border px-4 py-2 text-left">대표 모델</th>
                <th className="border border-border px-4 py-2 text-left">핵심 원리</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['우도 기반', 'GPT, PixelCNN', 'MLE로 P(x)를 직접 최대화'],
                ['잠재 변수', 'VAE, Normalizing Flow', '잠재 공간 z를 통한 P(x) 모델링'],
                ['암시적', 'GAN, Score Matching', '분포를 직접 정의하지 않고 샘플링'],
                ['확산', 'DDPM, Stable Diffusion', '노이즈 추가/제거 과정으로 학습'],
              ].map(([cat, models, principle]) => (
                <tr key={cat}>
                  <td className="border border-border px-4 py-2 font-medium">{cat}</td>
                  <td className="border border-border px-4 py-2">{models}</td>
                  <td className="border border-border px-4 py-2">{principle}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
