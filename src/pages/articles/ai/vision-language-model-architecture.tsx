import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MultimodalSeriesLocator, {
  MultimodalMapReturn,
} from "./vision-language-model-architecture/shared/MultimodalSeriesLocator";
import VisionLanguageModelArchitectureViz, {
  MultimodalPathBoundary,
  VlmConnectorComparison,
} from "./vision-language-model-architecture/viz/VisionLanguageModelArchitectureViz";

/**
 * 한 이미지가 visual token이 되어 LLM 입력에 합류하는 경로를 추적합니다.
 */
export default function VisionLanguageModelArchitectureArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section className="scroll-mt-20">
        <MultimodalSeriesLocator current="vlm-assembly" />
        <h2 className="mb-6 text-2xl font-bold">
          이미지를 LLM이 읽는 입력으로 바꿉니다
        </h2>
        <VisionLanguageModelArchitectureViz />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            생성형 vision-language model(VLM)은 픽셀을 LLM에 곧바로 넣지 않습니다. 먼저 vision
            encoder가 이미지를 patch 표현으로 바꾸고, connector가 그 표현을 언어 모델이 받을 수
            있는 형태로 옮깁니다. 그다음에야 visual token과 text token이 같은 추론에 참여합니다.
          </p>
          <p>
            이 글에서는 224×224 이미지 속 빨간 컵을 묻는 한 요청을 끝까지 따라갑니다. 숫자는
            LLaVA가 공개한 CLIP ViT-L/14와 Vicuna 조합을 설명하기 위한 사례입니다. 다른 VLM은
            입력 해상도, patch 수, connector, LLM hidden 차원이 달라질 수 있습니다.
          </p>
          <p>
            핵심 질문은 “멀티모달 모델이 무엇인가”라는 이름보다, 각 단계에서 배열의 개수와
            차원이 어떻게 바뀌고 어떤 부품이 그 변환을 책임지는가입니다.
          </p>
        </div>
        <ContentBoundary article="vision-language-model-architecture" />
      </section>

      <section id="trace" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 요청의 배열 모양을 끝까지 셉니다
        </h2>
        <AlgorithmBlock
          title="224px 이미지와 질문이 하나의 LLM 입력이 되는 순서"
          input={[
            "image: 224×224×3",
            "question: ‘빨간 컵은 어디에 있나?’",
            "vision encoder: CLIP ViT-L/14",
            "LLM: Vicuna-13B 예시",
          ]}
          steps={[
            {
              code: "patches = split(image, 14, 14)",
              note: "224÷14=16이므로 16×16=256개의 patch를 만듭니다.",
            },
            {
              code: "Z_v = vision_encoder(patches)",
              note: "각 patch를 1024차원 표현으로 바꿔 Z_v의 모양을 256×1024로 만듭니다.",
            },
            {
              code: "H_v = Z_v @ W",
              note: "Projector W가 마지막 차원을 1024에서 5120으로 바꿔 256×5120 visual token을 만듭니다.",
            },
            {
              code: "sequence = concat(H_v, embed(question))",
              note: "256개 visual token 뒤에 질문의 text token embedding을 이어 붙입니다.",
            },
            {
              code: "answer = LLM(sequence)",
              note: "LLM은 이 sequence를 보며 답의 다음 token을 차례로 생성합니다.",
            },
          ]}
          output="이미지 내용을 참조해 생성한 답 token sequence"
        />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            <Link to="/cs/ai/vision-transformer#patch-embedding">Vision Transformer</Link> 글에서
            만든 patch sequence가 이 글의 출발점입니다. Vision encoder는 256개 위치를 유지한 채
            각 위치에 1024개의 수를 담습니다. Projector도 256개라는 개수는 유지하고, 각 위치의
            마지막 차원만 LLM hidden 차원에 맞춥니다.
          </p>
          <p>
            따라서 “이미지를 token으로 바꾼다”는 말에는 두 변환이 들어 있습니다. Vision encoder는
            픽셀 묶음을 시각 표현으로 바꾸고, projector는 그 표현을 언어 모델의 입력 공간으로
            옮깁니다. 어느 한쪽만으로는 그림을 보며 답하는 전체 경로가 완성되지 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="전체 모델과 세 부품의 관계"
          description="이름이 비슷해도 가리키는 범위가 다릅니다."
          items={[
            {
              term: "Vision Encoder",
              description: "이미지를 patch 표현 sequence로 바꾸는 시각 처리 부품입니다.",
              example: "CLIP ViT-L/14가 224px 이미지를 256개의 1024차원 표현으로 바꿉니다.",
              boundary: "혼자서는 질문의 text token을 처리하거나 답을 생성하지 않습니다.",
            },
            {
              term: "Connector",
              description: "시각 표현을 언어 모델에 연결하는 projector·cross-attention·Q-Former 같은 부품입니다.",
              example: "LLaVA의 projection matrix W는 1024차원을 5120차원으로 바꿉니다.",
              boundary: "차원을 맞추는 것과 의미 대응을 학습하는 것은 같은 일이 아닙니다.",
            },
            {
              term: "Vision-Language Model",
              description: "이미지 표현과 text token을 한 추론 안에서 함께 처리하는 전체 모델입니다.",
              example: "LLaVA·Flamingo·BLIP-2는 connector 위치는 달라도 image와 text를 함께 추론합니다.",
              boundary: "Image encoder와 text encoder의 embedding만 비교하는 검색 경로와 생성 경로는 구분해야 합니다.",
            },
          ]}
        />
      </section>

      <section id="projector" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Projector는 차원을 맞추고, 학습은 의미 대응을 맞춥니다
        </h2>
        <ExplainedFormula
          question="256×1024인 patch 표현은 어떻게 256×5120 visual token이 되나요?"
          idea="각 patch의 1024개 수에 같은 projection matrix를 적용합니다. Patch 수 256은 그대로이고 마지막 차원만 바뀝니다."
          formula={String.raw`H_v = Z_v W,\quad (256\times1024)(1024\times5120)=256\times5120`}
          annotatedFormula={String.raw`\underbrace{H_v}_{\text{visual token}}=\underbrace{Z_v}_{\text{256개 patch 표현}}\underbrace{W}_{\text{공유 projection 행렬}}`}
          operations={[
            {
              expression: String.raw`Z_v\in\mathbb{R}^{256\times1024}`,
              annotation: ["Vision encoder가 만든", "256개 patch의 1024차원 표현"],
            },
            {
              expression: String.raw`W\in\mathbb{R}^{1024\times5120}`,
              annotation: ["모든 patch에 함께 적용되는", "학습 가능한 projection matrix"],
            },
            {
              expression: String.raw`H_v\in\mathbb{R}^{256\times5120}`,
              annotation: ["LLM hidden 차원과 맞춘", "256개 visual token"],
            },
          ]}
          terms={[
            {
              symbol: String.raw`Z_v`,
              name: "Patch representation",
              description: "Vision encoder가 이미지에서 만든 시각 표현입니다.",
            },
            {
              symbol: "W",
              name: "Projection matrix",
              description: "시각 표현의 마지막 차원을 LLM hidden 차원으로 옮기는 parameter입니다.",
            },
            {
              symbol: String.raw`H_v`,
              name: "Visual token",
              description: "Text token embedding과 같은 hidden 차원을 가진 LLM 입력입니다.",
            },
          ]}
          assumptions={[
            "256·1024·5120은 CLIP ViT-L/14와 Vicuna-13B 조합을 설명하기 위한 공개 설정 예입니다.",
            "식은 linear projector를 나타냅니다. 다른 모델은 MLP·cross-attention·query transformer를 쓸 수 있습니다.",
          ]}
          interpretation="행렬 곱으로 shape가 맞았다는 사실은 image의 ‘빨간 컵’ 의미가 text 표현과 맞아졌다는 증거가 아닙니다. LLaVA의 첫 학습 단계는 vision encoder와 LLM을 고정하고 W를 학습해 이 대응을 익힙니다."
        />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            LLaVA 논문의 첫 학습 단계에서는 vision encoder와 LLM을 고정하고 projection matrix만
            업데이트합니다. 두 사전학습 모델 사이에서 image feature가 어느 language embedding으로
            가야 하는지를 먼저 맞추는 단계입니다.
          </p>
          <p>
            두 번째 instruction tuning 단계에서는 vision encoder는 계속 고정하지만 projector와
            LLM을 함께 업데이트합니다. 첫 단계가 두 표현 사이의 다리를 놓는다면, 두 번째 단계는
            그 다리를 이용해 질문에 답하는 방식을 학습합니다.
          </p>
        </div>
      </section>

      <section id="connectors" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          모델마다 연결 부품과 삽입 위치가 다릅니다
        </h2>
        <VlmConnectorComparison />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            LLaVA는 visual token을 text token 앞뒤에 이어 붙이므로 LLM 구조를 크게 바꾸지 않습니다.
            반면 Flamingo는 Perceiver Resampler가 visual feature를 64개로 줄이고, frozen LLM 층
            사이에 넣은 gated cross-attention이 필요할 때 그 정보를 읽습니다.
          </p>
          <p>
            BLIP-2는 32개의 learnable query를 가진 Q-Former를 병목으로 둡니다. Q-Former가 frozen
            image encoder의 많은 feature 중 언어 모델에 넘길 정보를 뽑고, projection을 거쳐 frozen
            LLM에 연결합니다.
          </p>
          <p>
            세 방법은 “무엇이 가장 좋은가”보다 “어느 기존 parameter를 고정하고, 새로 학습할
            parameter를 어디에 둘 것인가”라는 설계 차이로 읽는 편이 정확합니다. 논문마다 데이터,
            모델 규모, 평가 과제가 달라 구조만 보고 성능 순위를 정할 수는 없습니다.
          </p>
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          답 생성과 후보 검색은 서로 다른 데이터 경로입니다
        </h2>
        <MultimodalPathBoundary />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            지금까지 추적한 경로의 출력은 답 token입니다. 반면 CLIP류 검색 경로의 출력은 query와
            후보 image 사이의 similarity와 순위입니다. 검색 결과를 생성형 VLM에 다시 넣어 답을
            만들 수는 있지만, 그때도 검색과 생성은 서로 다른 두 단계입니다.
          </p>
          <p>
            다음 글에서는 같은 “빨간 컵” 요청으로 text query와 후보 이미지 세 장의 similarity를
            직접 계산합니다. 가장 가까운 이미지를 고른 다음에야, 그 이미지 안에서 컵의 위치를
            찾는 grounding으로 넘어갑니다.
          </p>
          <p>
            <Link to="/cs/ai/multimodal-retrieval-and-visual-grounding#overview">
              검색과 grounding 경로를 계속 따라가기
            </Link>
          </p>
        </div>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          세 연결 방식의 원문 근거
        </h2>
        <div id="paper-llava" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Liu, Li, Wu, Lee · Visual Instruction Tuning (NeurIPS 2023)"
            citeKey={1}
            href="https://arxiv.org/abs/2304.08485"
          >
            CLIP ViT-L/14가 만든 grid feature를 trainable projection matrix로 language embedding
            차원에 맞춘 뒤 Vicuna와 연결합니다. 첫 단계에서는 vision encoder와 LLM을 고정하고
            projection만 학습하며, 두 번째 단계에서는 projection과 LLM을 함께 조정합니다.
          </CitationBlock>
        </div>
        <div id="paper-flamingo" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Alayrac et al. · Flamingo: a Visual Language Model for Few-Shot Learning (NeurIPS 2022)"
            citeKey={2}
            href="https://arxiv.org/abs/2204.14198"
          >
            Perceiver Resampler로 image·video feature를 고정된 64개 visual token으로 줄이고,
            frozen LLM 층 사이에 gated cross-attention을 삽입해 이미지 정보를 참조합니다.
          </CitationBlock>
        </div>
        <div id="paper-blip2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Li, Li, Savarese, Hoi · BLIP-2 (ICML 2023)"
            citeKey={3}
            href="https://arxiv.org/abs/2301.12597"
          >
            Frozen image encoder와 frozen LLM 사이에 32개의 learnable query를 쓰는 Q-Former를 두고,
            표현 학습과 vision-to-language 생성 학습을 두 단계로 나눕니다.
          </CitationBlock>
        </div>
        <MultimodalMapReturn current="vlm-assembly" />
      </section>
    </div>
  );
}
