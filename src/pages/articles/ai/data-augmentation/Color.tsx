import ExplainedFormula from "@/components/ui/explained-formula";
import ColorViz from "./viz/ColorViz";

export default function Color() {
  return (
    <section id="color" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        색상 증강과 normalization은 서로 다른 단계입니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ColorJitter는 brightness, contrast, saturation, hue를 random하게 바꿔
          조명과 camera 차이에 대한 robustness를 학습시킵니다. 반면
          normalization은 pixel range와 channel statistics를 model이 기대하는
          좌표로 맞추는 deterministic preprocessing입니다. 둘을 같은 “색 처리”로
          묶으면 train과 serving에서 normalization이 달라지거나, normalized
          tensor에 잘못된 range의 jitter를 적용하기 쉽습니다.
        </p>
      </div>

      <ExplainedFormula
        question="Normalization은 pixel channel을 어떤 좌표로 바꾸며 왜 train·serving에서 같아야 할까?"
        idea={
          <>
            각 channel에서 정해 둔 center μ를 빼고 scale σ로 나눕니다.
            Pretrained weight는 이 좌표계의 input을 보고 학습됐으므로 다른
            통계를 쓰면 첫 layer가 전혀 다른 값 범위를 받습니다.
          </>
        }
        formula={String.raw`x'_{c,h,w}=\frac{x_{c,h,w}-\mu_c}{\sigma_c}`}
        terms={[
          {
            symbol: "x_{c,h,w}",
            name: "input pixel",
            description: "Channel c와 spatial position (h,w)의 원래 값입니다.",
          },
          {
            symbol: "μc",
            name: "channel center",
            description:
              "Weight metadata나 training contract에서 정한 channel별 기준값입니다.",
          },
          {
            symbol: "σc",
            name: "channel scale",
            description:
              "0이 아닌 channel별 scale이며 표준편차를 쓰는 경우가 많습니다.",
          },
          {
            symbol: "x_{norm}",
            name: "normalized input",
            description: "Model이 실제로 받는 좌표값입니다.",
          },
        ]}
        assumptions={[
          "x, μ, σ가 모두 0–1 또는 0–255 등 같은 pixel 단위를 사용합니다.",
          "Training·validation·serving에서 같은 normalization contract를 사용합니다.",
        ]}
        interpretation="Normalization은 새 sample을 만들지 않습니다. ImageNet mean·std도 특정 pretrained weight의 입력 계약이지 모든 sensor와 domain의 보편 상수는 아닙니다."
      />

      <div className="not-prose my-8">
        <ColorViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Color가 nuisance인지 signal인지 먼저 확인합니다</h3>
        <p>
          피부색, 병변 색, 위성 spectral band처럼 색 자체가 label signal이면
          강한 jitter가 정답 정보를 지웁니다. CLAHE는 local contrast와 함께
          noise를 증폭할 수 있고, random erasing은 작은 object 전체를 없앨 수
          있습니다. 각 transform을 단독으로 ablation하고 class별 성능과
          worst-group slice를 함께 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
