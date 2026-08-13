import ExplainedFormula from "@/components/ui/explained-formula";
import FeatureViz from "./viz/FeatureViz";

export default function Feature() {
  return (
    <section id="feature" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Feature distillation은 서로 다른 hidden space를 바로 같다고 두지 않고 projection과 위치 대응을 먼저 정의합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>Teacher가 1024차원 24층이고 student가 384차원 12층이면 hidden tensor를 element-wise로 비교할 수 없습니다. 어떤 teacher layer를 어떤 student layer와 연결할지, token·spatial 위치가 같은 의미인지, student feature를 teacher dimension으로 보내는 projection을 training할지 먼저 정합니다.</p>
        <p>Intermediate feature는 class probability처럼 고유한 좌표계가 아닙니다. 같은 function을 구현해도 neuron permutation·scale·rotation이 다를 수 있으므로 raw MSE를 모든 layer에 강제하면 작은 student가 자기 capacity에 맞는 표현을 찾지 못할 수 있습니다.</p>
      </div>
      <ExplainedFormula
        question="Dimension이 다른 teacher와 student feature를 비교하려면 어떤 bridge가 필요할까요?"
        idea={<>Student feature를 learned projection <code>r</code>로 teacher feature의 shape에 맞춘 뒤, 선택한 example·token·channel의 차이를 줄입니다. Layer pair와 normalization은 loss보다 먼저 정하는 interface입니다.</>}
        formula={String.raw`\mathcal L_{\mathrm{feat}}=\frac{1}{BLC_t}\left\lVert H_t^{(\ell_t)}-r_{\phi}\!\left(H_s^{(\ell_s)}\right)\right\rVert_F^2`}
        terms={[
          { symbol: "H_t", name: "teacher feature", description: "선택한 teacher layer의 batch×position×channel hidden tensor입니다." },
          { symbol: "H_s", name: "student feature", description: "대응시킨 student layer의 hidden tensor입니다." },
          { symbol: "r_phi", name: "regressor / projection", description: "Student dimension·resolution을 teacher feature shape로 바꾸는 trainable mapping입니다." },
          { symbol: "B,L,C_t", name: "normalization dimensions", description: "Batch, aligned position, teacher channel 수로 MSE scale을 정합니다." },
          { symbol: "ell_t, ell_s", name: "layer match", description: "서로 대응한다고 가정한 teacher와 student layer index입니다." },
        ]}
        assumptions={[
          "Example와 token/spatial position이 의미 있게 정렬되어 있고 padding mask를 loss에서 제외합니다.",
          "Projection parameter는 training용 bridge이며 student-only export에서 제거 가능한지 graph를 확인합니다.",
          "Feature MSE 감소는 task quality의 proxy일 뿐이며 output loss와 independent test를 함께 봅니다.",
        ]}
        interpretation="Teacher channel 1024와 student 384를 직접 뺄 수 없으므로 384→1024 projection을 둡니다. 그러나 어느 layer와 token을 연결할지 잘못 고르면 숫자 shape는 맞아도 의미는 맞지 않습니다."
      />
      <div className="not-prose my-8"><FeatureViz /></div>
      <div id="paper-fitnets" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · FitNets</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">FitNets의 핵심 아이디어는 깊고 얇은 student가 teacher의 intermediate hint를 예측하도록 regressor를 두어 optimization을 돕는 것입니다. CIFAR/SVHN 계열 CNN과 논문의 hint-guided training 절차에서 얻은 결과이므로, 임의 Transformer layer를 모두 MSE로 맞추면 좋아진다는 일반 규칙은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1412.6550" target="_blank" rel="noreferrer">Hint layer·regressor·두 단계 training 범위 보기</a>
      </div>
    </section>
  );
}
