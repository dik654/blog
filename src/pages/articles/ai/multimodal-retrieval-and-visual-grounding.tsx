import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MultimodalSeriesLocator, {
  MultimodalMapReturn,
} from "./vision-language-model-architecture/shared/MultimodalSeriesLocator";
import MultimodalRetrievalAndVisualGroundingViz, {
  DocumentRetrievalPathComparison,
  GroundingPrimitiveComparison,
} from "./multimodal-retrieval-and-visual-grounding/viz/MultimodalRetrievalAndVisualGroundingViz";

/**
 * Text query로 이미지를 고른 뒤, 선택된 이미지 안의 위치를 찾는 경로를 추적합니다.
 */
export default function MultimodalRetrievalAndVisualGroundingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section className="scroll-mt-20">
        <MultimodalSeriesLocator current="retrieval-grounding" />
        <h2 className="mb-6 text-2xl font-bold">
          먼저 어느 이미지인지, 그다음 이미지의 어디인지 찾습니다
        </h2>
        <MultimodalRetrievalAndVisualGroundingViz />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            “빨간 컵”이라는 text query가 들어오면 retrieval은 후보 이미지 중 의미가 가장 가까운 한
            장을 고릅니다. Grounding은 그 결과로 고른 이미지 안에서 빨간 컵의 좌표나 영역을
            찾습니다. 둘은 같은 요청에 이어서 쓸 수 있지만 출력과 책임이 다른 두 계산입니다.
          </p>
          <p>
            Retrieval의 결과는 image ID와 similarity입니다. 이 시점에는 컵의 위치를 모릅니다.
            Grounding의 결과는 bounding box·point·segmentation mask입니다. 이 시점에는 어느
            후보를 고를지 비교하지 않습니다.
          </p>
          <p>
            또 하나의 경계를 먼저 분명히 해야 합니다. 앞 글의 생성형 VLM은 visual token을 LLM에
            넣어 답을 생성합니다. 이 글의 CLIP류 retrieval은 image encoder와 text encoder의
            embedding을 비교해 후보 순위를 만듭니다. 두 경로는 서로 조합할 수 있지만 같은
            파이프라인의 앞뒤 부품은 아닙니다.
          </p>
        </div>
        <ContentBoundary article="multimodal-retrieval-and-visual-grounding" />
      </section>

      <section id="similarity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Cosine similarity로 후보 세 장의 순서를 정합니다
        </h2>
        <ExplainedFormula
          question="q=(1,0)인 query와 후보 A=(0.8,0.6)의 cosine similarity는 얼마인가요?"
          idea="두 벡터를 길이 1로 정규화했다고 가정하면 cosine similarity는 내적과 같습니다. 같은 계산을 B와 C에도 반복해 가장 큰 점수를 고릅니다."
          formula={String.raw`\cos(q,A)=\frac{q\cdot A}{\lVert q\rVert\lVert A\rVert}=1\times0.8+0\times0.6=0.8`}
          annotatedFormula={String.raw`\cos(\underbrace{q}_{(1,0)},\underbrace{A}_{(0.8,0.6)})=\underbrace{0.8}_{\text{세 후보 중 가장 큼}}`}
          operations={[
            {
              expression: String.raw`\lVert q\rVert=\lVert A\rVert=1`,
              annotation: ["비교 전에 두 embedding을", "길이 1로 정규화한 가정"],
            },
            {
              expression: String.raw`q\cdot A=0.8`,
              annotation: ["같은 방향 성분을 곱해 더한", "query와 후보 A의 내적"],
            },
            {
              expression: String.raw`q\cdot B=0,\ q\cdot C=-0.6`,
              annotation: ["후보 B·C에도 같은 계산을 적용한", "비교 점수"],
            },
          ]}
          terms={[
            {
              symbol: "q",
              name: "Text embedding",
              description: "Text encoder가 ‘빨간 컵’을 바꾼 query 벡터입니다.",
            },
            {
              symbol: "A, B, C",
              name: "Image embedding",
              description: "Image encoder가 후보 이미지 세 장을 바꾼 벡터입니다.",
            },
            {
              symbol: String.raw`\cos(q,A)`,
              name: "Cosine similarity",
              description: "두 벡터의 방향이 얼마나 가까운지를 −1부터 1 사이로 나타낸 값입니다.",
            },
          ]}
          assumptions={[
            "q=(1,0), A=(0.8,0.6), B=(0,1), C=(−0.6,0.8)은 계산을 눈으로 확인하기 위한 교육용 가정입니다.",
            "네 벡터는 모두 길이 1입니다. 실제 retrieval embedding은 보통 수백 차원 이상입니다.",
          ]}
          interpretation="A의 0.8이 가장 크므로 retrieval은 A를 top-1으로 선택합니다. 이 결론은 ‘A 안에서 컵이 어디에 있다’는 뜻이 아니라, 세 후보 중 query와 가장 가까운 이미지라는 뜻입니다."
        />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            CLIP은 image encoder와 text encoder를 따로 두고 두 출력을 같은 embedding 공간으로
            projection합니다. 학습할 때는 batch 안의 실제 image-text 짝은 가깝게 만들고, 서로
            짝이 아닌 조합은 멀어지게 합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="CLIP이 같은 batch에서 진짜 짝을 찾도록 학습하는 순서"
          input={[
            "N개의 image-text 짝",
            "image encoder와 text encoder",
            "학습 가능한 temperature",
          ]}
          steps={[
            {
              code: "V = normalize(image_encoder(images))",
              note: "N개 image를 길이 1인 embedding으로 바꿉니다.",
            },
            {
              code: "T = normalize(text_encoder(texts))",
              note: "짝을 이루는 N개 text를 같은 차원의 embedding으로 바꿉니다.",
            },
            {
              code: "logits = V @ T.T / temperature",
              note: "N×N 조합 전체의 similarity를 계산합니다. 대각선만 실제 짝입니다.",
            },
            {
              code: "loss = mean(CE(logits), CE(logits.T))",
              note: "Image→text와 text→image 두 방향에서 대각선 짝의 확률을 높입니다.",
            },
          ]}
          output="Text와 image가 같은 공간에서 서로의 진짜 짝을 높은 점수로 찾는 두 encoder"
        />
        <TermBreakdown
          title="공간·검색·생성을 구분합니다"
          description="같은 embedding을 쓰더라도 각 단계의 출력은 다릅니다."
          items={[
            {
              term: "Multimodal Embedding",
              description: "Image와 text를 비교할 수 있도록 같은 차원과 거리 규칙을 쓰는 표현입니다.",
              example: "CLIP의 image embedding과 text embedding을 cosine similarity로 비교합니다.",
              boundary: "같은 공간에 있다는 사실만으로 모든 인간 의미가 정확히 정렬됐다고 볼 수는 없습니다.",
            },
            {
              term: "Cross-Modal Retrieval",
              description: "Text로 image를 찾는 것처럼 query와 후보의 modality가 다른 검색입니다.",
              example: "‘빨간 컵’ text query로 후보 이미지 A를 선택합니다.",
              boundary: "검색 결과는 후보와 점수이며 답 문장이나 대상 좌표가 아닙니다.",
            },
            {
              term: "Multimodal RAG",
              description: "검색한 image·표·스크린샷을 생성 모델의 evidence로 다시 넣는 구성입니다.",
              example: "A를 검색한 뒤 생성형 VLM에 질문과 함께 넣어 설명을 만듭니다.",
              boundary: "검색과 generation의 context budget·citation 책임을 하나로 뭉뚱그리면 안 됩니다.",
            },
          ]}
        />
      </section>

      <section id="document-retrieval" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          문서 검색은 페이지를 표현하는 경로부터 갈립니다
        </h2>
        <DocumentRetrievalPathComparison />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            OCR 중심 경로는 layout 분석, 문자 인식, 필요하면 caption 생성을 거쳐 페이지를 text로
            바꿉니다. 이 표현은 검색 결과를 사람이 읽고 인용하기 쉽지만, 표의 배치나 그림처럼
            text만으로 옮기기 어려운 정보가 중간에 줄어들 수 있습니다.
          </p>
          <p>
            ColPali는 문서 페이지 이미지를 PaliGemma에 넣고 patch마다 128차원 벡터를 만듭니다.
            Query token마다 가장 잘 맞는 page patch를 고르는 MaxSim 점수를 더해 페이지 순위를
            정합니다. 하나의 page vector로 압축하지 않으므로 어느 query token이 어느 시각 영역과
            맞았는지 더 세밀하게 비교할 수 있습니다.
          </p>
          <p>
            논문은 저자들이 구성한 OCR·layout·captioning 경로와 비교해 페이지당 index 처리 시간이
            7.22초에서 0.39초로 줄고, ViDoRe의 평균 nDCG@5가 67.0에서 81.3으로 높아졌다고
            보고합니다. 이 값은 해당 모델·하드웨어·benchmark 조건의 자기보고 결과이며, 모든 OCR
            구현과 모든 문서에서 같은 차이가 난다는 뜻은 아닙니다.
          </p>
          <p>
            OCR을 쓰지 않는다는 말도 “문자 정보를 보지 않는다”는 뜻은 아닙니다. VLM이 페이지
            이미지를 보며 문자와 배치를 함께 표현하되, 별도 OCR 결과를 중간 산출물로 만들지 않는
            경로라는 뜻입니다.
          </p>
        </div>
      </section>

      <section id="grounding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          선택한 이미지 안의 위치는 세 가지 형태로 나타냅니다
        </h2>
        <GroundingPrimitiveComparison />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            Bounding box는 좌상단과 우하단 좌표 네 개로 대상을 감쌉니다. 대상의 대략적인 범위는
            알 수 있지만 사각형 안의 배경도 함께 포함합니다. Point는 좌표 두 개만 내므로 클릭할
            지점처럼 한 위치면 충분한 작업에 맞지만 대상의 크기를 표현하지 못합니다.
          </p>
          <p>
            Segmentation mask는 각 pixel이 대상에 속하는지를 표시합니다. 컵의 윤곽까지 남기지만
            해상도에 비례해 출력과 계산이 커집니다. 따라서 정밀도가 높다는 이유만으로 모든 작업에
            mask가 필요한 것은 아닙니다.
          </p>
          <p>
            Kosmos-2는 224px 이미지를 가로와 세로 각각 32개 bin으로 나눕니다. Bounding box 좌표를
            32×32=1,024개의 location token으로 양자화해 text sequence 안에 넣습니다. 이 방식은
            언어 생성과 위치 출력을 한 vocabulary에서 다루지만, bin보다 더 세밀한 위치는 표현하지
            못합니다.
          </p>
        </div>
      </section>

      <section id="vision-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          작은 영역은 찾고, 잘라서, 다시 읽습니다
        </h2>
        <AlgorithmBlock
          title="Grounding 결과를 다음 판단에 되먹이는 순서"
          input={[
            "원본 image와 질문",
            "bbox·point·mask 중 하나를 내는 grounding 모델",
            "충분한 근거인지 판단하는 종료 조건",
          ]}
          steps={[
            {
              code: "region = ground(image, question)",
              note: "질문과 관련된 영역을 먼저 찾습니다.",
            },
            {
              code: "crop = crop_and_zoom(image, region)",
              note: "찾은 영역만 잘라 확대해 작은 문자나 겹친 대상을 더 크게 봅니다.",
            },
            {
              code: "answer, confidence = read(crop, question)",
              note: "확대된 영역으로 다시 답하고 근거가 충분한지 확인합니다.",
            },
          ]}
          output="종료 조건을 만족한 답, 또는 다음에 더 좁혀 볼 영역"
          repeatUntil="확신도가 기준을 넘거나 더 좁힐 영역이 없을 때까지"
        />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            예를 들어 “표 3행의 값은?”이라는 질문은 전체 페이지를 한 번에 볼 때 글자가 너무 작을
            수 있습니다. 먼저 표 영역을 찾고, 그 부분만 확대해 다시 읽으면 같은 pixel 수를 중요한
            영역에 더 많이 쓸 수 있습니다.
          </p>
          <p>
            이 반복에는 종료 조건이 필요합니다. 새 영역이 이전보다 작아지지 않거나, confidence가
            더는 오르지 않거나, 최대 반복 횟수에 도달하면 멈춰야 합니다. 그렇지 않으면 같은
            영역을 계속 잘라 비용만 늘어납니다.
          </p>
        </div>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          검색·문서 표현·위치 출력의 원문 근거
        </h2>
        <div id="paper-clip" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Radford et al. · Learning Transferable Visual Models From Natural Language Supervision / CLIP (ICML 2021)"
            citeKey={1}
            href="https://arxiv.org/abs/2103.00020"
          >
            4억 개 image-text 쌍으로 별도의 image encoder와 text encoder를 대조학습합니다. 두
            embedding의 cosine similarity를 temperature로 조절하고, batch 안의 실제 짝을 양방향
            cross-entropy로 맞춥니다.
          </CitationBlock>
        </div>
        <div id="paper-colpali" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Faysse et al. · ColPali: Efficient Document Retrieval with Vision Language Models (ICLR 2025)"
            citeKey={2}
            href="https://arxiv.org/abs/2407.01449"
          >
            문서 페이지 이미지를 patch 단위 multi-vector로 직접 표현하고 query token과 page patch의
            late interaction으로 검색하는 ColPali와 ViDoRe benchmark를 제안합니다.
          </CitationBlock>
        </div>
        <div id="paper-kosmos2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Peng et al. · Kosmos-2: Grounding Multimodal Large Language Models to the World (ICLR 2024)"
            citeKey={3}
            href="https://arxiv.org/abs/2306.14824"
          >
            Referring expression과 bounding box를 연결하고, 위치를 location token sequence로 나타내
            language generation과 visual grounding을 한 모델에서 다룹니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          생성형 VLM의 visual token 경로는{" "}
          <Link to="/cs/ai/vision-language-model-architecture#overview">VLM 조립</Link> 글을,
          text-only retrieval의 index와 근사 최근접 탐색은{" "}
          <Link to="/cs/ai/vector-search-and-ann-indexes#dense-retrieval-embedding-space">
            벡터 검색
          </Link>{" "}
          글을 참고하세요.
        </p>
        <MultimodalMapReturn current="retrieval-grounding" />
      </section>
    </div>
  );
}
