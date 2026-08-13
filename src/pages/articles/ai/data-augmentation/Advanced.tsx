import ExplainedFormula from "@/components/ui/explained-formula";
import AdvancedViz from "./viz/AdvancedViz";

export default function Advanced() {
  return (
    <section id="advanced" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Mixup과 CutMix는 input만이 아니라 target space도 바꿉니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          일반적인 geometric transform은 한 sample의 identity를 유지하지만,
          Mixup은 두 sample을 선형 보간하고 CutMix는 한 sample의 spatial region을
          다른 sample로 바꿉니다. 따라서 one-hot target 하나를 그대로 둘 수 없고
          두 label을 같은 mixing coefficient로 결합해야 합니다. Loss도 probability
          distribution 형태의 soft target을 받아야 합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Mixup에서 두 input과 두 label을 어떤 비율로 함께 섞을까?"
        idea={<>0과 1 사이의 λ를 뽑아 두 sample 사이의 convex combination을 만듭니다. Input에서 차지한 비율과 target probability의 비율을 같게 유지합니다.</>}
        formula={String.raw`\begin{aligned}
\lambda&\sim\operatorname{Beta}(\alpha,\alpha) \\
\tilde{x}&=\lambda x_i+(1-\lambda)x_j \\
\tilde{y}&=\lambda y_i+(1-\lambda)y_j
\end{aligned}`}
        terms={[
          { symbol: "λ", name: "mixing coefficient", description: "두 sample이 input과 target에서 차지하는 공통 비율입니다." },
          { symbol: "α", name: "Beta shape", description: "λ가 양 끝에 몰릴지 0.5 근처에 몰릴지 정하는 strength parameter입니다." },
          { symbol: "x̃", name: "mixed input", description: "두 input tensor의 같은 coordinate를 선형 보간합니다." },
          { symbol: "ỹ", name: "soft target", description: "두 class distribution을 같은 λ로 결합한 target입니다." },
        ]}
        assumptions={["두 input이 같은 shape과 의미 있는 linear scale을 사용합니다.", "Task loss가 soft target distribution을 올바르게 처리합니다."]}
        interpretation="Mixup은 training example 사이에서 model이 비교적 선형으로 변하도록 유도합니다. 실제 data manifold 밖의 조합일 수 있으므로 모든 domain에 label-preserving transform이라고 부를 수는 없습니다."
      />

      <ExplainedFormula
        question="CutMix에서는 붙여 넣은 patch의 면적을 target 비율로 어떻게 바꿀까?"
        idea={<>Binary mask M이 1인 위치는 sample i, 0인 위치는 sample j에서 가져옵니다. Classification에서는 전체 pixel 중 각 sample이 차지한 면적 비율로 soft target을 만듭니다.</>}
        formula={String.raw`\begin{aligned}
\tilde{x}&=M\odot x_i+(1-M)\odot x_j \\
\lambda_{\mathrm{area}}&=\frac{1}{HW}\sum_{h,w}M_{h,w} \\
\tilde{y}&=\lambda_{\mathrm{area}}y_i+(1-\lambda_{\mathrm{area}})y_j
\end{aligned}`}
        terms={[
          { symbol: "M", name: "binary spatial mask", description: "각 pixel을 어느 sample에서 가져올지 정합니다." },
          { symbol: "H,W", name: "canvas size", description: "Classification image의 높이와 너비입니다." },
          { symbol: "λarea", name: "visible area ratio", description: "Clipping까지 적용된 실제 mask 면적으로 다시 계산합니다." },
          { symbol: "⊙", name: "element-wise product", description: "Mask와 image를 같은 spatial coordinate에서 곱합니다." },
        ]}
        assumptions={["Area가 class evidence 비율을 근사하는 image-classification setting입니다.", "Detection·segmentation에서는 object annotation을 별도 규칙으로 갱신합니다."]}
        interpretation="Object가 patch에 고르게 분포한다는 보장은 없으므로 area ratio는 근사 target입니다. Fine-grained localization이나 작은 object task에서는 이 가정이 크게 틀릴 수 있습니다."
      />

      <div
        id="paper-mixup"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Vicinal samples와 soft target</p>
        <p className="mt-2 text-sm font-semibold">mixup: Beyond Empirical Risk Minimization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Mixup은 training pair와 label의 convex combination을 학습해 sample 사이에서
          단순한 linear behavior를 유도했습니다. ImageNet·CIFAR·speech·tabular 등
          논문의 실험 범위가 근거이며, 모든 feature space의 보간이 현실적인
          sample이라는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1710.09412" target="_blank" rel="noreferrer">원 논문의 objective와 실험 보기</a>
      </div>

      <div
        id="paper-cutmix"
        className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 읽기 · Regional mixing</p>
        <p className="mt-2 text-sm font-semibold">CutMix: Regularization Strategy to Train Strong Classifiers with Localizable Features</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          CutMix는 region을 지우는 대신 다른 training image의 patch로 채우고 실제
          면적에 비례해 label을 섞었습니다. Classification과 weakly supervised
          localization을 중심으로 한 논문의 설정이며, detection annotation을 area
          target만으로 처리해도 된다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://openaccess.thecvf.com/content_ICCV_2019/html/Yun_CutMix_Regularization_Strategy_to_Train_Strong_Classifiers_With_Localizable_Features_ICCV_2019_paper.html" target="_blank" rel="noreferrer">원 논문의 mask·label rule과 ablation 보기</a>
      </div>

      <div className="not-prose my-8"><AdvancedViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Mosaic은 네 sample을 붙이는 연산보다 annotation 계약이 어렵습니다</h3>
        <p>
          여러 image를 한 canvas에 배치하면 object scale과 context가 다양해지지만,
          box·mask를 resize하고 offset만큼 이동한 뒤 canvas boundary에서 clip해야
          합니다. 너무 작아지거나 대부분 잘린 instance를 제거할 기준도 필요합니다.
          Mixup·CutMix·Mosaic을 동시에 켜기 전에 하나씩 추가해 class별 성능,
          calibration, localization metric을 비교합니다.
        </p>
      </div>
    </section>
  );
}
