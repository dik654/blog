import AlgorithmBlock from "@/components/ui/algorithm-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import BlockFamilyViz from "./viz/BlockFamilyViz";

export default function Architecture({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        BasicBlock과 Bottleneck은 같은 residual 원리를 다른 compute shape로
        구현한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          ResNet은 stem 뒤에 residual block을 stage별로 쌓습니다. stage가 바뀔 때는 spatial resolution을 줄이며 channel을 늘립니다.
          ResNet-18·34의 BasicBlock은 같은 width의 3×3 convolution 두 개를 씁니다. ResNet-50·101·152의 Bottleneck은 다릅니다.
          1×1로 내부 width를 조절한 뒤 3×3을 수행하고 마지막 1×1로 output channel을 확장합니다.
        </p>
      </div>

      <div id="paper-identity-mappings" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Identity propagation</p>
        <p className="mt-2 text-sm font-semibold">Identity Mappings in Deep Residual Networks</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Shortcut과 addition 뒤 mapping을 identity로 유지할 때 forward state와 backward signal이 직접 전개되는 관계를 제시하고 pre-
          activation unit을 실험했습니다. 이 algebra가 말해 주는 것은 거기까지입니다. finite-precision training에서 gradient 크기의 절대
          하한이나 최적해 도달은 여기서 보장되지 않습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1603.05027" target="_blank" rel="noreferrer">원 논문의 전개·unit ablation 보기</a>
      </div>

      <BlockFamilyViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Bottleneck은 parameter를 무조건 줄이는 장치가 아니다</h3>
        <p className="leading-8">
          단순 bottleneck 하나를 생각해 봅시다. input·output channel이 C, 내부 width가 B라면 두 1×1 convolution은 각각 CB
          parameter를, 가운데 3×3은 9B² parameter를 씁니다. 비용은 B를 얼마나 줄였는지와 output expansion에 따라 달라집니다. 그러니 1×1이 있으니
          항상 더 싸다고 판단하지 말고 실제 stage shape를 계산합니다.
        </p>
      </div>

      <ExplainedFormula
        question="먼저 same-width BasicBlock의 convolution parameter를 계산하면 얼마인가?"
        idea={
          <>
            Bias를 생략한 convolution parameter는 kernel area×input
            channel×output channel입니다. C→C인 3×3 convolution 두 개가 있으므로
            한 층의 9C²를 두 번 더합니다.
          </>
        }
        formula={String.raw`P_{\mathrm{basic}}=2(3^2C^2)=18C^2`}
        annotatedFormula={String.raw`P_{\mathrm{basic}}=\underbrace{2(3^2C^2)=18C^2}_{\text{BasicBlock parameter 계산}}`}
        operations={[
          { expression: String.raw`2(3^2C^2)=18C^2`, annotation: ["BasicBlock parameter이(가) 식의 결과에","기여하는 방식을 계산합니다.","Bias를 생략한 convolution parameter는","kernel area×input channel×output"] },
        ]}
        terms={[
          {
            symbol: "C",
            name: "외부 channel width",
            description: "Block 입력과 출력이 갖는 channel 수입니다.",
          },
          {
            symbol: "P_{\\mathrm{basic}}",
            name: "BasicBlock parameter",
            description: "C→C인 3×3 convolution 두 개의 weight 수입니다.",
          },
        ]}
        assumptions={[
          "Bias·normalization parameter와 projection shortcut은 제외했습니다.",
          "FLOPs는 여기에 output spatial size를 곱하며 stage transition의 stride까지 반영해야 합니다.",
        ]}
        interpretation="BasicBlock은 모든 3×3 연산을 외부 width C에서 수행합니다. 따라서 high-width stage에서는 parameter와 FLOPs가 C²에 따라 빠르게 증가합니다."
      />

      <ExplainedFormula
        question="C→B→B→C Bottleneck은 내부 width를 줄여 비용을 어떻게 재배분하는가?"
        idea={
          <>
            첫 1×1은 C에서 B로 channel을 줄이고, 3×3은 더 작은 B width에서
            spatial mixing을 수행한 뒤 마지막 1×1이 C로 복원합니다. 세 layer의
            weight 수를 순서대로 더합니다.
          </>
        }
        formula={String.raw`\begin{aligned}P_{\mathrm{bottle}}&=CB+9B^2+BC\\&=2CB+9B^2\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}P_{\mathrm{bottle}}&=\underbrace{CB+9B^2+BC}_{\text{3×3 spatial mixing 계산}}\\&=\underbrace{2CB+9B^2}_{\text{3×3 spatial mixing 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`CB+9B^2+BC`, annotation: ["3×3 spatial mixing이(가) 식의 결과에 기여하는","방식을 계산합니다.","첫 1×1은 C에서 B로 channel을 줄이고, 3×3은 더","작은 B width에서 spatial mixing을 수행한 뒤"] },
          { expression: String.raw`2CB+9B^2`, annotation: ["3×3 spatial mixing이(가) 식의 결과에 기여하는","방식을 계산합니다.","첫 1×1은 C에서 B로 channel을 줄이고, 3×3은 더","작은 B width에서 spatial mixing을 수행한 뒤"] },
        ]}
        terms={[
          {
            symbol: "C",
            name: "외부 channel width",
            description: "Block 입력과 출력이 갖는 channel 수입니다.",
          },
          {
            symbol: "B",
            name: "bottleneck width",
            description:
              "가운데 3×3 convolution이 사용하는 내부 channel 수입니다.",
          },
          {
            symbol: "2CB",
            name: "두 1×1 projection",
            description: "C→B와 B→C channel projection의 weight 합입니다.",
          },
          {
            symbol: "9B^2",
            name: "3×3 spatial mixing",
            description:
              "B channel 안에서 수행하는 가운데 convolution 비용입니다.",
          },
        ]}
        assumptions={[
          "Bias·normalization parameter와 projection shortcut은 제외했습니다.",
          "FLOPs는 여기에 output spatial size를 곱하며 stage transition의 stride까지 반영해야 합니다.",
        ]}
        interpretation="B가 C보다 충분히 작을 때 비싼 3×3 연산을 줄일 수 있습니다. Torchvision의 expansion 4처럼 외부·내부 width 계약을 확인해야 실제 비용을 정확히 비교할 수 있습니다."
      />

      <ExplainedFormula
        question="BatchNorm은 각 channel의 activation을 어떻게 정규화하고, 왜 학습 가능한 γ·β를 다시 곱하나요?"
        idea={
          <>
            같은 channel의 batch·spatial 차원 전체에서 평균과 분산을 구해
            평균 0, 분산 1로 맞춥니다. 이 강제 정규화가 network의 표현력을
            제한할 수 있어, 학습 가능한 scale γ와 shift β로 필요하면 원래
            분포 형태를 다시 만들 수 있게 열어둡니다.
          </>
        }
        formula={String.raw`\hat x=\frac{x-\mu_B}{\sqrt{\sigma_B^2+\epsilon}},\qquad y=\gamma\hat x+\beta`}
        annotatedFormula={String.raw`\begin{aligned}
\mu_B&=\underbrace{\frac1m\sum_i x_i}_{\text{같은 channel의 batch·spatial 평균}}\\
\sigma_B^2&=\underbrace{\frac1m\sum_i(x_i-\mu_B)^2}_{\text{같은 channel의 batch·spatial 분산}}\\
\hat x_i&=\underbrace{\frac{x_i-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}}_{\text{평균 0, 분산 1로 정규화}}\\
y_i&=\underbrace{\gamma\hat x_i+\beta}_{\text{학습 가능한 scale·shift로 표현력 복원}}
\end{aligned}`}
        operations={[
          {
            expression: String.raw`\frac1m\sum_i x_i`,
            annotation: ["같은 channel의 batch 전체를 평균해", "이번 mini-batch의 분포 중심 추정"],
          },
          {
            expression: String.raw`\frac{x-\mu_B}{\sqrt{\sigma_B^2+\epsilon}}`,
            annotation: ["평균을 빼고 표준편차로 나눠", "평균 0·분산 1로 강제 정규화"],
          },
          {
            expression: String.raw`\gamma\hat x+\beta`,
            annotation: ["학습된 scale·shift를 다시 곱하고 더해", "normalization이 표현력을 뺏지 않게 보정"],
          },
        ]}
        terms={[
          {
            symbol: String.raw`\gamma,\beta`,
            name: "학습 가능한 scale·shift",
            description: "Channel마다 하나씩 gradient descent로 학습되는 parameter입니다.",
          },
          {
            symbol: String.raw`\epsilon`,
            name: "안정화 상수",
            description: "분모가 0에 너무 가까워지는 것을 막는 작은 값(보통 1e-5)입니다.",
          },
        ]}
        assumptions={[
          "Train mode에서는 현재 mini-batch의 μ_B, σ_B²를 씁니다.",
          "Eval mode에서는 훈련 중 누적한 running mean·variance(exponential moving average)를 대신 씁니다 — 그래야 단일 sample 추론에서도 batch 통계 없이 결과가 결정적입니다.",
        ]}
        interpretation="γ=√(σ_B²+ε), β=μ_B로 수렴하면 이론적으로 정규화 전체를 identity로 되돌릴 수도 있습니다 — BatchNorm이 표현력을 강제로 제한하지 않는다는 뜻입니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Post-activation과 pre-activation은 activation 위치가 다르다</h3>
        <p className="leading-8">
          Original ResNet v1은 residual과 shortcut을 더한 뒤 ReLU를 적용합니다. Identity Mappings 논문의 pre-activation
          ResNet v2는 normalization과 ReLU를 convolution 앞에 두어 addition 뒤의 identity path를 더 직접적으로 유지했습니다. 두 구현은
          checkpoint-compatible하지 않습니다. “BN 순서만 조금 바꾼 것” 이상으로 forward·backward mapping 자체가 달라집니다.
        </p>
      </div>

      <AlgorithmBlock
        title="BasicBlock forward — v1(post-activation) vs v2(pre-activation)"
        input={["입력 tensor x", "conv1, conv2 (3×3), BN1, BN2, 학습된 γ·β"]}
        steps={[
          {
            code: "[v1] h = ReLU(BN1(conv1(x)))",
            note: "conv 뒤 즉시 normalize하고 activation을 적용합니다.",
          },
          {
            code: "[v1] h = BN2(conv2(h))",
            note: "두 번째 conv도 같은 순서를 반복하되, 아직 ReLU는 적용하지 않습니다.",
          },
          {
            code: "[v1] out = ReLU(h + shortcut(x))",
            note: "Residual과 shortcut을 더한 뒤 마지막에 ReLU를 적용합니다 — identity path 위에 non-linearity가 걸립니다.",
          },
          {
            code: "[v2] h = conv1(ReLU(BN1(x)))",
            note: "Pre-activation은 순서를 뒤집습니다 — normalize·activation을 먼저 하고 conv를 나중에 합니다.",
          },
          {
            code: "[v2] h = conv2(ReLU(BN2(h)))",
            note: "두 번째 conv 앞에도 같은 순서를 반복합니다.",
          },
          {
            code: "[v2] out = h + shortcut(x)",
            note: "Addition 뒤에는 아무 연산도 없습니다 — identity path가 순수하게 유지됩니다.",
          },
        ]}
        output="다음 block으로 전달할 out"
        repeatUntil="Stage마다 정한 block 수만큼 이 forward를 순서대로 쌓습니다."
      />
      <CodeViewButton
        onClick={() => onCodeRef("block-forward", codeRefs["block-forward"])}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          구현에서는 stride 위치와 zero initialization까지 version 차이를 본다
        </h3>
        <p className="leading-8">
          Torchvision의 현재 Bottleneck은 ResNet v1.5 변형을 씁니다. 원 논문 표기와 달리 stride가 첫 1×1이 아니라 3×3 convolution에
          붙습니다. 마지막 normalization scale을 0으로 초기화하면 residual branch가 처음에 0에 가까워져 block을 identity 근처에서 시작시킬 수
          있습니다. Architecture 이름만으로는 이런 recipe 차이가 결정되지 않습니다. source와 checkpoint metadata를 함께 확인합니다.
        </p>
      </div>
    </section>
  );
}
