import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { DenoisingMaskedViz } from "./viz/ModernAutoencoderViz";

export default function DenoisingMaskedArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Corruption은 noise라는 이름보다 먼저 input을 어떻게 바꾸는지 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">기본 autoencoder는 input과 target이 같습니다. Denoising에서는 clean sample <code>x</code>에서 손상된 <code>x̃</code>를 만들고, encoder에는 <code>x̃</code>를 넣지만 decoder output은 원래 <code>x</code>와 비교합니다. 이 차이가 identity 복사를 어렵게 합니다.</p></div>
      <TermBreakdown title="손상과 복원의 대상을 한 줄씩 분리합니다" items={[
        { term: "Clean target · x", description: "복원해야 할 원본 sample입니다.", example: "Noise를 넣기 전 image입니다.", boundary: "Class label이 아니라 input-derived target입니다." },
        { term: "Corruption · q(x̃|x)", description: "Clean sample에서 encoder input을 뽑는 확률 규칙입니다.", example: "Pixel dropout 20% 또는 Gaussian noise σ=0.1입니다.", boundary: "실제 nuisance와 무관한 corruption은 필요한 signal까지 지울 수 있습니다." },
        { term: "Corrupted input · x̃", description: "Encoder가 실제로 보는 손상된 sample입니다.", example: "다섯 pixel 중 하나가 0으로 바뀐 vector입니다.", boundary: "Target도 x̃로 두면 clean reconstruction 계약이 아닙니다." },
        { term: "Clean reconstruction", description: "Decoder output을 원본 x와 비교하는 학습 목표입니다.", example: "가려진 pixel까지 원래 값에 가깝게 만듭니다.", boundary: "복원 성공이 모든 downstream robustness를 보장하지 않습니다." },
      ]} />
      <DenoisingMaskedViz />
      <ContentBoundary article="denoising-masked-autoencoders" />
    </section>

    <section id="denoising" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Denoising objective는 손상된 input과 clean target을 의도적으로 어긋나게 둡니다</h2>
      <ExplainedFormula question="왜 x̃를 넣고도 loss는 x와 계산할까요?" idea={<p>같은 clean sample에서 여러 손상본을 뽑고 모두 같은 원본으로 돌아오게 합니다. Model은 손상 그 자체를 복사하는 대신 반복되는 data structure를 이용해야 합니다.</p>} formula={String.raw`\min_{\theta,\phi}\mathbb E_{x}\mathbb E_{\tilde x\sim q(\tilde x\mid x)}[\ell(x,g_\phi(f_\theta(\tilde x)))]`} annotatedFormula={String.raw`\begin{aligned}\tilde x&\sim\underbrace{q(\tilde x\mid x)}_{\text{clean x에서 손상본 생성}}\\\hat x&=\underbrace{g_\phi(f_\theta(\tilde x))}_{\text{손상본만 보고 복원}}\\e(x,\tilde x)&=\underbrace{\ell(x,\hat x)}_{\text{clean target과 비교}}\\\mathcal L&=\underbrace{\mathbb E_x\mathbb E_{\tilde x\mid x}[e]}_{\text{sample·손상 우연성을 평균}}\end{aligned}`} operations={[
        { expression: String.raw`\tilde x\sim q(\tilde x\mid x)`, annotation: ["clean x를 조건으로", "명시한 규칙에서 손상본 생성"] },
        { expression: String.raw`f_\theta(\tilde x)`, annotation: ["원본이 아닌 손상본만 보고", "복원에 필요한 latent를 계산"] },
        { expression: String.raw`\ell(x,g_\phi(f_\theta(\tilde x)))`, annotation: ["decoder output을 손상본이 아니라", "clean target과 비교"] },
        { expression: String.raw`\mathbb E_x\mathbb E_{\tilde x\mid x}`, annotation: ["sample과 corruption 우연성을", "전체 objective로 평균"] },
      ]} terms={[
        { symbol: "q(x̃|x)", name: "Corruption distribution", description: "Clean x에서 noisy·masked input을 만드는 규칙입니다." },
        { symbol: "x̃", name: "Corrupted input", description: "Encoder가 받는 값입니다." },
        { symbol: "x", name: "Clean target", description: "Decoder output과 비교할 원본입니다." },
      ]} assumptions={["Corruption 뒤에도 원본을 추론할 structure가 남습니다.", "Training corruption이 배포 nuisance 또는 representation 목적과 관련됩니다.", "Loss가 target domain과 맞습니다."]} interpretation="Noise를 넣는 행위 자체가 robustness를 보장하지 않습니다. Corruption 종류·세기와 clean validation·downstream 결과를 함께 고릅니다." />
      <div id="paper-denoising-autoencoder" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="Vincent et al. — Extracting and Composing Robust Features with Denoising Autoencoders" citeKey={1} type="paper" href="https://doi.org/10.1145/1390156.1390294">Corrupted input에서 clean input을 복원하는 objective와 당시 stacked pretraining 실험을 제안합니다. 임의 noise가 모든 task의 robust feature를 만든다고 일반화하지 않습니다.</CitationBlock></div>
    </section>

    <section id="masking" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Masked autoencoder는 structured corruption과 asymmetric compute를 결합합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Image를 patch로 나누고 mask set <code>M</code>을 고릅니다. MAE에서는 visible patch만 무거운 encoder에 보내고, lightweight decoder가 mask token과 visible representation을 받아 missing content를 복원합니다.</p></div>
      <ExplainedFormula question="Masking이 계산량과 학습 target을 어떻게 동시에 바꿀까요?" idea={<p>Encoder workload는 visible set V로 줄이고, loss는 숨긴 set M에 집중합니다. 같은 mask ratio라도 modality·patch size에 따라 정보량이 다릅니다.</p>} formula={String.raw`V=\{1,\dots,N\}\setminus M,\quad \mathcal L_{\rm mask}=\frac1{|M|}\sum_{i\in M}\lVert x_i-\hat x_i\rVert_2^2`} annotatedFormula={String.raw`\begin{aligned}V&=\underbrace{\{1,\ldots,N\}\setminus M}_{\text{encoder가 볼 patch 선택}}\\e_i&=\underbrace{\lVert x_i-\hat x_i\rVert_2^2}_{\text{숨긴 patch의 복원 오차}}\\\mathcal L_{\rm mask}&=\underbrace{\frac1{|M|}\sum_{i\in M}e_i}_{\text{masked patch만 평균}}\end{aligned}`} operations={[
        { expression: String.raw`\{1,\dots,N\}\setminus M`, annotation: ["전체 patch에서 mask를 제외해", "encoder가 볼 visible set 생성"] },
        { expression: String.raw`\sum_{i\in M}`, annotation: ["학습 신호를", "숨긴 위치에만 누적"] },
        { expression: String.raw`1/|M|`, annotation: ["mask 개수가 바뀌어도", "patch당 loss scale로 비교"] },
      ]} terms={[
        { symbol: "M", name: "Masked index set", description: "Encoder에서 숨길 patch 위치입니다." },
        { symbol: "V", name: "Visible index set", description: "무거운 encoder가 실제 처리하는 patch입니다." },
        { symbol: "N", name: "Total patches", description: "Image를 patchify한 뒤의 전체 token 수입니다." },
      ]} assumptions={["Mask sampling과 patchification 규칙이 재현 가능합니다.", "Decoder는 target patch coordinate와 같은 order를 사용합니다."]} interpretation="Image MAE의 높은 mask ratio는 spatial redundancy와 asymmetric architecture를 이용한 recipe입니다. Text·audio에 같은 숫자를 복사하지 않습니다." />
      <div id="paper-masked-autoencoder" className="not-prose mt-8 scroll-mt-24"><CitationBlock source="He et al. — Masked Autoencoders Are Scalable Vision Learners" citeKey={2} type="paper" href="https://arxiv.org/abs/2111.06377">Visible patch만 처리하는 encoder와 lightweight decoder, 높은 image masking ratio를 조합합니다. ImageNet·ViT 조건의 결과를 모든 modality의 최적 mask recipe로 확대하지 않습니다.</CitationBlock></div>
    </section>

    <section id="choice" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Denoising·masking·sparsity·VAE는 서로 다른 intervention입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><ul>
        <li><strong>Denoising</strong><br />Input corruption을 바꾸고 clean target을 유지합니다.</li>
        <li><strong>Masked AE</strong><br />Structured missing region과 encoder compute 범위를 함께 바꿉니다.</li>
        <li><strong><Link to="/ai/sparse-autoencoder">Sparse AE</Link></strong><br />Latent activation 수와 dictionary frontier를 제한합니다.</li>
        <li><strong><Link to="/ai/vae">VAE</Link></strong><br />Deterministic code 대신 approximate posterior와 prior를 도입합니다.</li>
      </ul></div>
    </section>
  </div>;
}
