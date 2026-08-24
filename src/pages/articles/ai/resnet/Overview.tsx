import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import DegradationViz from "./viz/DegradationViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ResNet이 겨냥한 것은 capacity 부족이 아니라 깊이에 따른 optimization
        degradation이다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          더 깊은 network는 추가 layer가 identity mapping을 구현하면 적어도 얕은
          network의 함수를 포함할 수 있습니다. 그런데 원 ResNet 논문은
          BatchNorm과 ReLU를 쓴 plain CNN에서도 depth를 늘리자 test error뿐
          아니라 training error가 함께 나빠지는{" "}
          <strong>degradation problem</strong>을 관찰했습니다. 이는
          overfitting처럼 train error는 낮고 test error만 높아지는 현상과
          다릅니다.
        </p>
        <p className="leading-8">
          Vanishing gradient는 깊은 network의 중요한 위험이지만 이 관찰을
          그것만으로 설명하면 좁습니다. ResNet의 핵심 제안은 원하는 mapping
          전체를 바로 학습하는 대신 입력에서 필요한 변화, 즉 residual을
          학습하도록 parameterization을 바꾸는 것입니다. CNN의
          convolution·receptive field는
          <Link to="/ai/cnn"> CNN 정본 글</Link>에서 이어지고, 이 글은 residual
          parameterization과 tensor shape·gradient 경계를 소유합니다.
        </p>
      </div>

      <ContentBoundary article="resnet" />

      <DegradationViz />

      <ExplainedFormula
        question="전체 mapping H(x)를 배우는 문제를 residual F(x)로 어떻게 바꾸는가?"
        idea={
          <>
            원하는 출력 H(x)에서 입력 x를 뺀 변화량을 F(x)로 정의합니다.
            Residual branch가 0을 출력하면 block 전체가 바로 identity가 되므로,
            입력을 보존하는 해를 여러 nonlinear layer가 새로 구성할 필요가
            없습니다.
          </>
        }
        formula={String.raw`\begin{aligned}F(x)&=H(x)-x\\y=H(x)&=x+F(x)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}F(x)&=\underbrace{H(x)-x}_{\text{target mapping 계산}}\\y=H(x)&=\underbrace{x+F(x)}_{\text{target mapping 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`H(x)-x`, annotation: ["target mapping이(가) 식의 결과에 기여하는 방식을","계산합니다.","원하는 출력 H(x)에서 입력 x를 뺀 변화량을 F(x)로","정의합니다."] },
          { expression: String.raw`x+F(x)`, annotation: ["target mapping이(가) 식의 결과에 기여하는 방식을","계산합니다.","원하는 출력 H(x)에서 입력 x를 뺀 변화량을 F(x)로","정의합니다."] },
        ]}
        terms={[
          {
            symbol: "x",
            name: "block input",
            description:
              "앞 stage 또는 residual block에서 전달된 activation tensor입니다.",
          },
          {
            symbol: "H(x)",
            name: "target mapping",
            description: "현재 block 전체가 표현하려는 mapping입니다.",
          },
          {
            symbol: "F(x)",
            name: "residual branch",
            description:
              "Convolution·normalization·activation parameter가 입력에 더할 update입니다.",
          },
          {
            symbol: "y",
            name: "block output",
            description:
              "Shortcut과 residual branch를 element-wise로 합친 다음 state입니다.",
          },
        ]}
        assumptions={[
          "입력과 residual output의 shape가 같다고 놓았습니다. 다르면 projection shortcut이 필요합니다.",
          "F=0이 optimization상 항상 선택된다는 뜻이 아니라 identity가 parameterization에 직접 포함된다는 뜻입니다.",
        ]}
        interpretation="ResNet은 작은 residual만 학습한다고 미리 보장하지 않습니다. 다만 identity가 좋은 해일 때 residual branch를 0 근처로 두는 간단한 표현 경로를 제공합니다."
      />

      <div id="paper-resnet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 원형 ResNet</p>
        <p className="mt-2 text-sm font-semibold">Deep Residual Learning for Image Recognition</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          더 깊은 plain network의 training error가 나빠지는 degradation을 확인하고,
          identity shortcut과 residual mapping으로 152-layer network를 학습했습니다.
          보고된 결과는 ImageNet·CIFAR와 논문의 architecture·training recipe 범위이며,
          shortcut 하나가 모든 깊이의 optimization을 보장한다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1512.03385" target="_blank" rel="noreferrer">원 논문의 degradation·block·평가 보기</a>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>깊이를 늘리는 것과 유효한 계산을 늘리는 것은 같지 않다</h3>
        <p className="leading-8">
          Residual connection은 더 깊은 network를 최적화하기 쉬운 방향으로
          바꾸지만, 깊이가 자동으로 accuracy를 높인다는 보장은 없습니다. Data
          size, stage width, normalization, learning-rate schedule과
          regularization이 함께 맞아야 하며, 지나치게 깊은 model은 latency와
          activation memory를 늘릴 수 있습니다. 따라서 ResNet-18·50·101 같은
          이름은 품질 서열이 아니라 서로 다른 compute·memory 선택지로 봅니다.
        </p>
      </div>
    </section>
  );
}
