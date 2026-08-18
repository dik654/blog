import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { CodeSidebar, CodeViewButton, useCodeSidebar } from "@/components/code";
import { codeRefs } from "./codeRefs";
import { cnnTree } from "./fileTree";
import { CnnOperatorViz } from "./viz/ModernCnnViz";

export default function CnnFoundationArticle() {
  const sidebar = useCodeSidebar();
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          CNN은 image를 긴 숫자 줄이 아니라 channel과 위치가 있는 측정 grid로
          읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            먼저 한 pixel의 값, 그 pixel의 row·column, red·green·blue channel을
            구분합니다. 그 다음 작은 window만 읽는 operator를 image 위에서
            반복합니다. 이 순서를 건너뛰면 kernel·stride·padding이 무엇을
            바꾸는지 좌표 없이 외우게 됩니다.
          </p>
        </div>
        <TermBreakdown
          title="먼저 분리할 네 물체"
          items={[
            {
              term: "Image tensor",
              description:
                "Batch·channel·height·width 축으로 배치한 pixel 측정값입니다.",
              example: "NCHW에서 8장 RGB 32×32는 [8,3,32,32]입니다.",
            },
            {
              term: "Local window",
              description:
                "Output cell 하나가 읽는 가까운 input 좌표 묶음입니다.",
            },
            {
              term: "Kernel",
              description:
                "Window와 같은 offset에 곱할 학습 parameter 표입니다.",
              boundary:
                "사람이 이름 붙인 edge detector라고 자동 보장되지 않습니다.",
            },
            {
              term: "Feature map",
              description:
                "같은 kernel score를 여러 시작 위치에서 계산해 만든 output grid입니다.",
            },
          ]}
        />
        <CnnOperatorViz />
        <ContentBoundary article="cnn" />
      </section>
      <section id="local-operator" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Window와 kernel의 같은 좌표를 곱해 output 한 칸을 만듭니다
        </h2>
        <ExplainedFormula
          question="왜 CNN output cell은 local patch와 kernel의 곱을 더한 값인가요?"
          idea={
            <p>
              Output 좌표 p,q가 정한 input window를 열고, input channel c와
              kernel offset u,v가 같은 값끼리 곱합니다. 그 결과를 모두 더하고
              output-channel bias를 붙입니다.
            </p>
          }
          formula={String.raw`Y_{o,p,q}=b_o+\sum_{c,u,v}W_{o,c,u,v}X_{c,p+u,q+v}`}
          annotatedFormula={String.raw`\begin{aligned}P_{cuv}&=\underbrace{X_{c,p+u,q+v}}_{\text{local patch 선택}}\\M_{ocuv}&=\underbrace{W_{ocuv}P_{cuv}}_{\text{같은 offset끼리 곱}}\\Y_{opq}&=\underbrace{b_o+\sum_{cuv}M_{ocuv}}_{\text{local evidence 합}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`X_{c,p+u,q+v}`,
              annotation: ["output 좌표가 읽을", "local input window를 선택"],
            },
            {
              expression: String.raw`W_{o,c,u,v}P_{c,u,v}`,
              annotation: [
                "같은 channel·offset을 곱해",
                "kernel pattern과의 일치를 측정",
              ],
            },
            {
              expression: String.raw`b_o+\sum M`,
              annotation: [
                "local evidence를 더하고 bias를 붙여",
                "output feature cell을 생성",
              ],
            },
          ]}
          terms={[
            {
              symbol: "X",
              name: "Input tensor",
              description:
                "Channel·row·column 좌표의 image 또는 hidden feature입니다.",
            },
            {
              symbol: "W",
              name: "Shared kernel",
              description:
                "모든 spatial 시작 위치에서 재사용하는 학습 parameter입니다.",
            },
            {
              symbol: "Y",
              name: "Output feature map",
              description:
                "Output channel과 spatial grid를 가진 결과 tensor입니다.",
            },
          ]}
          assumptions={[
            "Library operator는 보통 kernel을 뒤집지 않는 cross-correlation입니다.",
            "Layout·padding·stride·dilation convention을 별도 고정합니다.",
          ]}
          interpretation="2×2 patch [[1,2],[3,4]]와 kernel [[1,0],[0,−1]]이면 score는 1−4=−3입니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open("conv-as-matmul", codeRefs["conv-as-matmul"])
          }
        />
      </section>
      <section id="shared-kernel" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          같은 kernel을 여러 위치에서 재사용하므로 parameter 수가 resolution과
          분리됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            3×3, input channel 3, output channel 32라면 bias 제외 weight는
            3×3×3×32=864개입니다. 32×32 image와 224×224 image는 같은 864개를
            쓰지만, 큰 image는 더 많은 window를 처리하므로 activation과 FLOPs는
            커집니다.
          </p>
        </div>
      </section>
      <section id="output-geometry" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Kernel span을 놓고 stride만큼 이동할 수 있는 시작점 수가 output
          크기입니다
        </h2>
        <ExplainedFormula
          question="Input 높이 H에서 output 높이를 어떻게 계산하나요?"
          idea={
            <p>
              Dilation이 벌려 놓은 실제 kernel span을 먼저 구합니다. Padding을
              붙인 유효 길이에서 그 span을 빼고 stride 간격으로 가능한 시작점
              수를 센 뒤 첫 시작점을 더합니다.
            </p>
          }
          formula={String.raw`H_{out}=\left\lfloor\frac{H+2P-D(K-1)-1}{S}+1\right\rfloor`}
          annotatedFormula={String.raw`\begin{aligned}K_{\mathrm{span}}&=\underbrace{D(K-1)+1}_{\text{dilation을 반영한 실제 kernel 폭}}\\H_{\mathrm{room}}&=\underbrace{H+2P-K_{\mathrm{span}}}_{\text{padding된 축에서 시작점이 움직일 공간}}\\H_{\mathrm{out}}&=\underbrace{\left\lfloor H_{\mathrm{room}}/S\right\rfloor+1}_{\text{stride 간격 시작점 수와 첫 위치를 계산}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`D(K-1)+1`,
              annotation: [
                "tap 사이 간격을 반영해",
                "kernel의 실제 input span 계산",
              ],
            },
            {
              expression: String.raw`H+2P-K_{\mathrm{span}}`,
              annotation: [
                "padding된 input에서 span을 빼",
                "시작점 이동 공간 계산",
              ],
            },
            {
              expression: String.raw`\lfloor H_{\mathrm{room}}/S\rfloor+1`,
              annotation: [
                "stride 간격으로 나눈 뒤",
                "첫 시작 위치 하나를 포함",
              ],
            },
          ]}
          terms={[
            {
              symbol: "H",
              name: "Input height",
              description:
                "Input spatial 축의 pixel 또는 feature-cell 수입니다.",
            },
            {
              symbol: "K",
              name: "Kernel taps",
              description: "한 축의 학습 tap 개수입니다.",
            },
            {
              symbol: "P,S,D",
              name: "Padding·stride·dilation",
              description: "경계 확장, 시작점 간격, tap 간격입니다.",
            },
          ]}
          assumptions={[
            "한 축의 symmetric padding 식입니다.",
            "Framework의 same·ceil·asymmetric convention은 config로 확인합니다.",
          ]}
          interpretation="H=7,K=3,P=1,S=2,D=1이면 span 3, room 6, floor(6/2)+1=4입니다."
        />
        <CodeViewButton
          onClick={() =>
            sidebar.open("output-shape-spec", codeRefs["output-shape-spec"])
          }
        />
        <TermBreakdown
          title="같은 output 크기 식, 다른 aggregation — pooling"
          items={[
            {
              term: "Max pooling",
              description:
                "위 식과 똑같이 K×K window를 stride S로 옮기지만, 학습된 weight로 합을 만드는 대신 window 안 최댓값을 그대로 통과시킵니다. 학습 parameter가 없습니다.",
              example:
                "2×2 window [[1,3],[2,0]]에서 max pooling은 3을 출력합니다.",
              boundary:
                "가장 강하게 반응한 위치만 남기고 나머지 activation은 버립니다 — 정확한 위치 정보가 필요한 task(예: segmentation)에서는 이 정보 손실이 문제가 될 수 있습니다.",
            },
            {
              term: "Average pooling",
              description:
                "같은 window에서 최댓값 대신 평균을 냅니다. Global average pooling은 K를 전체 spatial 크기로 둬 H×W 전체를 한 값으로 요약합니다(classifier 직전에 흔히 사용).",
              example:
                "같은 2×2 window [[1,3],[2,0]]에서 average pooling은 (1+3+2+0)/4=1.5를 출력합니다.",
              boundary:
                "작은 activation도 평균에 영향을 줘 sharp한 feature를 max pooling보다 더 무디게 만들 수 있습니다.",
            },
          ]}
        />
        <div id="paper-lenet" className="not-prose mt-8">
          <CitationBlock
            source="LeCun et al. — Gradient-Based Learning Applied to Document Recognition"
            citeKey={1}
            type="paper"
            href="https://doi.org/10.1109/5.726791"
          >
            Convolution·subsampling·classifier를 문서 인식 system에 연결한
            대표적 근거입니다. 현대 CNN의 모든 구성 요소나 모든 vision task의
            최적 recipe를 이 논문 하나에 귀속하지 않습니다.
          </CitationBlock>
        </div>
      </section>
      <CodeSidebar
        codeRefKey={sidebar.codeRefKey}
        codeRef={sidebar.codeRef}
        onClose={sidebar.close}
        onNavigate={sidebar.navigate}
        codeRefs={codeRefs}
        fileTrees={{ torch: cnnTree }}
        projectMetas={{
          torch: {
            id: "torch",
            label: "PyTorch · Python",
            badgeClass: "bg-orange-500/10 border-orange-500 text-orange-700",
          },
        }}
      />
    </div>
  );
}
