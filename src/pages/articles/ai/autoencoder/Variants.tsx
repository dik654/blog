import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import VariantsViz from "./viz/VariantsViz";

export default function Variants() {
  return (
    <section id="variants" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">변형은 같은 계보가 아니라 서로 다른 실패를 막는 설계입니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Denoising AE는 identity mapping을 막고 corruption에 견고한 특징을 배우려는
          방법입니다. Sparse AE는 latent dimension이 커도 소수 unit만 활성화되도록
          penalty를 더합니다. VAE는 deterministic code 하나 대신 approximate
          posterior를 학습해 sampling 가능한 생성 model로 문제를 바꾸며, 자세한
          확률적 유도는 <Link to="/ai/vae">VAE 글</Link>이 소유합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Denoising autoencoder는 왜 입력과 다른 target을 사용해야 할까?"
        idea={<>원본 x에서 손상된 입력 x̃를 만들되 target은 깨끗한 x로 유지합니다. 그러면 단순히 x̃를 그대로 통과시키는 identity function보다, 여러 손상에서도 공통으로 남는 data structure를 이용해야 loss를 줄일 수 있습니다.</>}
        formula={String.raw`\min_{\theta,\phi}\;
\mathbb{E}_{x\sim p_{\mathrm{data}}}
\mathbb{E}_{\tilde{x}\sim q(\tilde{x}\mid x)}
\left[\ell\!\left(x,g_\phi(f_\theta(\tilde{x}))\right)\right]`}
        terms={[
          { symbol: "q(x̃|x)", name: "corruption distribution", description: "Clean sample에서 noisy·masked input을 만드는 규칙입니다." },
          { symbol: "x̃", name: "corrupted input", description: "Encoder가 실제로 받는 손상된 관측값입니다." },
          { symbol: "x", name: "clean target", description: "Decoder output이 가까워져야 하는 원본입니다." },
          { symbol: "ℓ", name: "reconstruction loss", description: "Data likelihood와 목적에 맞춰 MSE·BCE 등을 선택합니다." },
        ]}
        assumptions={["Corruption이 원본의 복원 가능한 structure를 모두 없애지 않습니다.", "Training corruption이 원하는 robustness와 관련이 있습니다."]}
        interpretation="Noise를 더하는 것만으로 모든 nuisance factor에 불변인 표현이 생기지는 않습니다. Corruption 종류와 세기가 실제 task와 맞지 않으면 오히려 필요한 정보를 지울 수 있습니다."
      />

      <div
        id="paper-denoising-autoencoder"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Corruption에서 clean input 복원</p>
        <p className="mt-2 text-sm font-semibold">Extracting and Composing Robust Features with Denoising Autoencoders</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Vincent 등은 손상된 입력에서 원본을 복원하도록 학습해 identity solution을
          피하고 robust feature를 얻는 방법을 제안했습니다. 논문은 당시 사용한
          corruption·stacked pretraining·benchmark 조건의 근거이며, 임의의 noise가
          언제나 downstream 성능을 높인다는 결론은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1145/1390156.1390294" target="_blank" rel="noreferrer">
          원 논문의 corruption objective와 실험 보기
        </a>
      </div>

      <VariantsViz />

      <div
        id="paper-masked-autoencoder"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Vision pretraining</p>
        <p className="mt-2 text-sm font-semibold">Masked Autoencoders Are Scalable Vision Learners</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          MAE는 높은 비율의 image patch를 가리고, encoder는 visible patch만 처리한
          뒤 lightweight decoder가 missing pixel을 복원하도록 설계했습니다. 75%
          masking과 asymmetric architecture의 효과는 ImageNet-1K 기반 실험
          조건이며 모든 modality의 최적 masking ratio로 일반화할 수는 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2111.06377" target="_blank" rel="noreferrer">
          원 논문의 architecture·masking ablation 보기
        </a>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>선택 기준은 이름이 아니라 학습 계약입니다</h3>
        <p>
          입력과 target이 무엇인지, latent가 deterministic value인지 distribution인지,
          어떤 regularizer를 더하는지, 학습 뒤 decoder를 버릴지 유지할지를 먼저
          적어야 합니다. Denoising AE, sparse AE, VAE, masked AE는 서로의 새 버전이
          아니라 robust representation, sparse decomposition, generation,
          pretraining처럼 다른 목적을 해결합니다.
        </p>
      </div>
    </section>
  );
}
