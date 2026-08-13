import ContentBoundary from "@/components/articles/content-boundary";
import InductiveBiasViz from "./viz/InductiveBiasViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        CNN은 image grid의 구조를 parameterization에 넣는다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Image는 단순히 숫자를 길게 늘어놓은 vector가 아니라 channel과 세로·가로
          좌표를 가진 tensor입니다. 가까운 pixel끼리 관련되고 같은 visual pattern이
          다른 위치에도 나타날 수 있다는 가정이 맞다면, 모든 pixel pair를 별도
          parameter로 연결할 필요는 없습니다. Convolutional neural network(CNN)는
          작은 local window를 읽는 kernel을 image 전체에 공유해 이 가정을 계산
          구조에 넣습니다.
        </p>
        <p>
          이 글의 핵심은 CNN architecture 이름을 외우는 데 있지 않습니다. 먼저 한
          output pixel이 어떤 input 좌표를 읽는지 계산한 뒤, weight sharing이 왜
          translation equivariance를 만들고 stride·padding이 어디서 그 성질을
          깨뜨리는지 살펴봅니다. 그 위에서 receptive field·dilation·depthwise
          convolution을 이해하면 ResNet이나 ConvNeXt도 같은 설계 언어로 비교할 수
          있습니다.
        </p>
        <p>
          예를 들어 batch 8개의 32×32 RGB image는 NCHW convention에서는
          <code>(8,3,32,32)</code>, NHWC에서는 <code>(8,32,32,3)</code>으로
          기록합니다. 숫자는 같아도 channel 축을 잘못 읽으면 kernel이 전혀 다른
          위치와 값을 처리하므로 tensor layout은 model 입력 계약에 포함해야 합니다.
        </p>
      </div>

      <ContentBoundary article="cnn" />
      <InductiveBiasViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          224×224 RGB image를 128 unit에 완전히 연결하면 bias를 제외해 약 1,927만
          weight가 필요하지만, 3×3·3→32 convolution에는 864개만 필요합니다. 두
          layer의 output shape과 역할은 다르므로 정확도 비교로 읽으면 안 됩니다.
          이 숫자는 local connectivity와 weight sharing이 parameterization을 얼마나
          바꾸는지 보여 주는 출발점입니다.
        </p>
      </div>

      <div id="paper-lenet" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · LeNet 계열</p>
        <p className="mt-2 text-sm font-semibold">
          Gradient-Based Learning Applied to Document Recognition
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Convolution·subsampling·gradient-based learning을 실제 문서 인식 pipeline에
          연결한 연구입니다. 오늘날의 모든 CNN 구성 요소를 처음 제안한 논문으로
          단순화하기보다, 당시 사용한 입력·architecture·문서 인식 조건 안에서
          읽어야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1109/5.726791" target="_blank" rel="noreferrer">
          원 논문의 문제·구조·평가 보기
        </a>
      </div>
    </section>
  );
}
