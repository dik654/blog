import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MultimodalRetrievalAndVisualGroundingViz from "./multimodal-retrieval-and-visual-grounding/viz/MultimodalRetrievalAndVisualGroundingViz";

/**
 * 같은 embedding 공간이 검색을, grounding primitive가 위치를 정합니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function MultimodalRetrievalAndVisualGroundingArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          검색은 image가 무엇인지, grounding은 image의 어디인지를 답합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Multimodal retrieval은 image와 text를 같은 벡터 공간에 놓고 그 공간에서 가까운 것을 찾아
            "어떤 이미지·문서인지"에 답하고, visual grounding은 image 위의 특정 좌표나 영역을 짚어
            "그 대상이 어디에 있는지"에 답합니다. 둘 다 <Link to="/ai/vision-language-model-architecture#architecture">
            VLM</Link>이 만드는 image·text 공동 표현 위에서 동작하지만 묻는 질문이 다릅니다.
          </p>
          <p>
            이 글은 image와 text를 한 embedding 공간에 놓는 대조학습부터, OCR 없이 문서 스크린샷을
            그대로 검색하는 방식, bounding box·point·segmentation mask로 위치를 표현하는 세 가지
            grounding 방식, 그리고 이 grounding 결과를 반복 참조하며 답을 좁혀 가는 reasoning
            방식까지 차례로 다룹니다.
          </p>
        </div>
        <MultimodalRetrievalAndVisualGroundingViz />
        <ContentBoundary article="multimodal-retrieval-and-visual-grounding" />
      </section>

      <section id="embedding-and-retrieval" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Multimodal embedding은 image·text를 한 공간에 놓습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multimodal embedding은 서로 다른 modality(image·text)를 같은 차원의 벡터 공간에 투영해
            그 공간에서 거리가 가까울수록 의미가 가깝다고 두는 표현입니다. 이 공간이 있어야 text
            query로 image를 찾거나 image로 비슷한 image를 찾는 검색이 벡터 비교만으로 성립합니다.
          </p>
          <p>
            Image retrieval은 query(text 또는 image)로 관련 image를 찾는 작업이고, cross-modal
            retrieval은 query와 대상의 modality가 서로 다른 경우, 즉 text로 image를 찾거나 image로
            text를 찾는 경우를 가리키는 이름입니다.
          </p>
          <p>
            CLIP은 image encoder와 text encoder를 따로 두고, 같은 batch 안 진짜 image-text 쌍의
            cosine similarity는 키우고 나머지 재배열 쌍은 낮추는 대조학습으로 이 공간을 만듭니다.
            배치 크기가 클수록(원 논문은 32,768) 한 번에 비교하는 negative pair가 많아져 학습
            신호가 강해집니다.
          </p>
        </div>
        <ExplainedFormula
          question="Image와 text encoder를 어떤 loss로 학습해야 같은 벡터 공간에서 서로를 가리키게 되나요?"
          idea="배치 안의 N개 image-text 쌍 중 진짜 짝(대각선)의 similarity는 softmax 분자에서 키우고, 나머지 N-1개 재배열 쌍은 분모에서 함께 낮춰 image·text 벡터가 서로를 예측하게 만듭니다."
          formula={String.raw`\mathcal{L}=-\frac{1}{N}\sum_{i=1}^{N}\log\frac{\exp(\mathrm{sim}(v_i,t_i)/\tau)}{\sum_{j=1}^{N}\exp(\mathrm{sim}(v_i,t_j)/\tau)}`}
          annotatedFormula={String.raw`\mathcal{L}=-\frac{1}{N}\sum_{i=1}^{N}\log\frac{\overbrace{\exp(\mathrm{sim}(v_i,t_i)/\tau)}^{\text{진짜 쌍(대각선)}}}{\underbrace{\sum_{j=1}^{N}\exp(\mathrm{sim}(v_i,t_j)/\tau)}_{\text{배치 안 N개 후보 전체로 정규화}}}`}
          operations={[
            { expression: String.raw`\mathrm{sim}(v_i,t_i)`, annotation: ["같은 배치 안 진짜 image-text 쌍의", "cosine similarity를 키우는 분자"] },
            { expression: String.raw`\sum_{j=1}^{N}\exp(\cdot/\tau)`, annotation: ["배치 안 N개 text 후보 전체와 비교해", "확률로 정규화하는 분모"] },
            { expression: String.raw`\tau`, annotation: ["학습 가능한 temperature로", "similarity 분포를 얼마나 뾰족하게 만들지 조절"] },
          ]}
          terms={[
            { symbol: String.raw`v_i,t_i`, name: "Image·text embedding", description: "각 encoder가 만든 벡터를 정규화한 표현입니다." },
            { symbol: "N", name: "Batch size", description: "한 번에 비교하는 image-text 쌍의 수이며, 원 논문은 32,768을 씁니다." },
            { symbol: String.raw`\tau`, name: "Temperature", description: "0.07로 초기화하고 학습 중 값이 조정되는 scaling 계수입니다." },
          ]}
          assumptions={["배치가 클수록 negative pair가 많아져 대조학습 신호가 강해진다는 전제입니다.", "이 식은 image→text 방향이며, 실제 학습은 text→image 방향의 대칭 loss를 더해 평균 냅니다."]}
          interpretation="이 loss가 낮아진다고 image와 text가 같은 '의미'를 인코딩한다는 보장은 없습니다. 학습에 쓴 4억 개 image-text 쌍의 caption 분포 안에서 서로를 잘 예측하게 됐다는 뜻입니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multimodal RAG는 이렇게 만든 cross-modal retrieval 결과를 LLM의 generation 입력에 넣는
            RAG의 확장입니다. 검색된 evidence가 text chunk가 아니라 image·표·스크린샷일 수 있다는
            점만 다르고, context budget·citation 같은 generation 단계 규칙은{" "}
            <Link to="/ai/rag-pipeline#generation">RAG 파이프라인</Link> 글의 정본을 그대로
            따릅니다.
          </p>
        </div>
        <TermBreakdown
          title="Multimodal embedding·retrieval·RAG의 층위"
          description="공간을 만드는 것, 그 공간에서 찾는 것, 찾은 결과를 생성에 넣는 것은 다른 단계입니다."
          items={[
            { term: "Multimodal Embedding", description: "서로 다른 modality를 같은 차원의 벡터 공간에 투영한 표현입니다.", example: "CLIP이 image·text를 각각 512차원 벡터로 투영해 같은 공간에 둡니다.", boundary: "공간이 같다고 모든 개념이 균일하게 가깝게 놓이는 것은 아니며 학습 데이터 분포에 좌우됩니다." },
            { term: "Image Retrieval", description: "Query로 관련 image를 찾는 작업입니다.", example: "text query 'red shoes'로 비슷한 상품 image를 검색.", boundary: "Query와 target의 modality가 같은 경우(image로 image 검색)도 포함합니다." },
            { term: "Cross-Modal Retrieval", description: "Query와 대상의 modality가 서로 다른 검색입니다.", example: "Text로 image를 찾거나 image로 관련 text를 찾음.", boundary: "같은 modality 안에서의 검색은 이 이름으로 부르지 않습니다." },
            { term: "Multimodal RAG", description: "Cross-modal retrieval 결과를 LLM generation 입력에 넣는 RAG 확장입니다.", example: "스크린샷 검색 결과를 evidence로 넣어 표에 대한 질문에 답변.", boundary: "Context budget·citation 같은 generation 규칙 자체는 이 글이 아니라 RAG 파이프라인 글이 정본입니다." },
          ]}
        />
      </section>

      <section id="document-retrieval" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Screenshot retrieval은 OCR 없이 문서 이미지를 embedding합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Visual document retrieval은 PDF·슬라이드 같은 문서를 검색 대상으로 삼는 retrieval이고,
            그중 문서 페이지를 이미지(스크린샷)로 그대로 embedding해 찾는 방식을 screenshot
            retrieval이라고 부릅니다. <Link to="/ai/document-parsing-and-table-extraction#layout-and-order">
            문서 구조 파싱</Link> 글의 layout parsing·OCR 경로와는 문서를 표현하는 방식 자체가
            다릅니다.
          </p>
          <p>
            ColPali는 문서 페이지 이미지를 vision-language model(PaliGemma)에 넣어 patch 1024개를
            각각 128차원 벡터로 만드는 multi-vector embedding을 만듭니다. Query token embedding과 각
            patch embedding의 내적 중 최댓값을 골라 더하는 MaxSim(late interaction) 방식으로 둘을
            매칭합니다.
          </p>
          <p>
            OCR·layout 분석·caption 생성을 순서대로 거치는 기존 파이프라인은 한 페이지에 layout
            감지 0.81초, OCR 2.67초, captioning 3.71초로 합쳐서 7.22초가 걸립니다. ColPali는 이미지를
            그대로 embedding에 넣어 페이지당 0.39초, 즉 20분의 1 이하 시간으로 인덱싱을 끝냅니다.
          </p>
          <p>
            ViDoRe 벤치마크(nDCG@5)에서 ColPali는 평균 81.3점을 냈고, OCR+캡션+텍스트 검색을 조합한
            기존 파이프라인은 67.0점, CLIP류 대조학습 VLM(SigLIP)은 51.4점에 그쳤습니다. Layout이
            복잡하거나 표·그림이 섞인 문서일수록 텍스트만 뽑는 경로가 놓치는 정보를 이미지 자체
            embedding이 더 많이 보존한다는 뜻입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="OCR 기반 검색과 screenshot retrieval 중 언제 무엇을 고르나요?"
          preview="레이아웃·표·그림이 복잡한 문서는 screenshot retrieval이, 순수 텍스트 위주 문서는 OCR 기반 경로도 충분합니다."
        >
          <p>
            ColPali 논문은 인덱싱 속도(7.22초→0.39초)와 정확도(67.0→81.3) 모두에서 우위를 보고하지만,
            비교 대상은 저자들이 구성한 특정 OCR+캡션 파이프라인이라 모든 OCR 구현에 그대로
            일반화되지는 않습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="grounding" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Visual grounding은 bbox·point·mask로 위치를 표현합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Visual grounding은 text가 가리키는 대상이 image의 어느 위치에 있는지 찾는 작업입니다.
            그 위치를 표현하는 방식을 visual primitive라고 부르며, bounding box·point·segmentation
            mask 세 가지가 흔히 쓰입니다.
          </p>
          <p>
            Bounding box grounding은 좌상단·우하단 좌표 4개로 대상을 감싸는 사각형을 표현합니다.
            Kosmos-2는 224px 이미지를 32×32 bin으로 나눠 각 좌표를 1,024개 location token 중 하나로
            양자화하고, "&lt;box&gt;&lt;loc1&gt;&lt;loc2&gt;&lt;/box&gt;" 형태로 text sequence 안에
            끼워 넣습니다.
          </p>
          <p>
            Point grounding은 좌표 2개(x, y)만으로 대상의 한 지점을 가리키고, segmentation
            grounding은 픽셀마다 대상에 속하는지 아닌지를 표시하는 mask 전체로 대상을 표현합니다.
            좌표 4개 → 2개 → 픽셀 수만큼으로 표현에 드는 정보량이 늘어나는 순서입니다.
          </p>
          <p>
            Bounding box는 표현이 가장 싸지만 배경을 함께 감싸 물체의 실제 윤곽은 담지 못하고,
            point는 더 간단하지만 대상의 크기·범위 정보가 아예 없습니다. Segmentation mask는 윤곽을
            그대로 담는 대신 이미지 픽셀 수에 비례해 표현 비용이 커집니다.
          </p>
        </div>
        <TermBreakdown
          title="세 grounding 방식의 표현력·비용 비교"
          description="위치를 표현하는 정보량이 늘어날수록 정밀해지지만 비용도 함께 늘어납니다."
          items={[
            { term: "Visual Grounding", description: "Text가 가리키는 대상이 image의 어디에 있는지 찾는 작업입니다.", example: "'왼쪽 빨간 컵'이라는 표현에 해당하는 image 영역을 찾음.", boundary: "무엇(what)을 찾는 recognition과 달리 어디(where)에 있는지를 답합니다." },
            { term: "Bounding Box Grounding", description: "좌상단·우하단 좌표 4개로 대상을 감싸는 사각형을 표현합니다.", example: "Kosmos-2는 32×32=1,024개 location token으로 좌표를 양자화합니다.", boundary: "사각형 안에 배경이 함께 담겨 물체의 실제 윤곽은 표현하지 못합니다." },
            { term: "Point Grounding", description: "좌표 2개만으로 대상의 한 지점을 가리킵니다.", example: "'이 버튼을 눌러'라는 지시에 클릭할 좌표 하나만 출력.", boundary: "대상의 크기·범위 정보가 없어 겹친 대상을 구분하기 어렵습니다." },
            { term: "Segmentation Grounding", description: "픽셀마다 대상 여부를 표시하는 mask로 위치를 표현합니다.", example: "224×224 이미지라면 최대 50,176개 픽셀 각각에 대상 여부를 표시.", boundary: "표현력은 가장 높지만 이미지 해상도에 비례해 저장·연산 비용이 커집니다." },
            { term: "Visual Primitive", description: "Grounding 결과를 표현하는 단위(bbox·point·mask)를 통칭하는 이름입니다.", example: "같은 grounding 모델도 과제에 따라 다른 primitive를 출력하도록 학습됩니다.", boundary: "Primitive를 바꾼다고 grounding의 정확도 자체가 자동으로 바뀌지는 않습니다." },
          ]}
        />
      </section>

      <section id="vision-in-the-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Vision-in-the-loop reasoning은 grounding을 반복 참조합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Vision-in-the-loop reasoning은 한 번의 grounding으로 끝내지 않고, grounding 결과(잘라낸
            영역·짚은 좌표)를 다시 모델에 넣어 다음 판단의 근거로 쓰는 반복 절차입니다. 작은 글자나
            겹친 물체처럼 한 번에 답하기 어려운 질문에서 이 반복이 정확도를 끌어올립니다.
          </p>
          <p>
            예를 들어 "표 3행의 값은?"이라는 질문에 전체 image만 보고 답하면 작은 글자를 놓치기
            쉽지만, 먼저 표 영역을 bounding box로 grounding한 뒤 그 영역만 잘라 확대해 다시 읽으면
            같은 모델로도 더 정확한 답을 낼 수 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Grounding 결과를 되먹임하는 vision-in-the-loop reasoning 루프"
          input={[
            "원본 image와 질문",
            "visual grounding 모델(bbox·point·segmentation 중 하나 출력)",
            "충분한 근거인지 판단하는 종료 조건",
          ]}
          steps={[
            { code: "region = ground(image, question)", note: "질문과 관련된 영역을 bbox·point·mask 중 하나로 grounding합니다." },
            { code: "crop = extract_and_zoom(image, region)", note: "찾은 영역만 잘라 확대해, 원본에서 작아 보이던 세부를 키웁니다." },
            { code: "answer, confidence = read(crop, question)", note: "확대된 영역만으로 다시 질문에 답하고 확신도를 함께 냅니다." },
          ]}
          output="충분한 확신도에 도달한 답, 또는 다음 grounding 대상이 될 새 영역"
          repeatUntil="확신도가 임계값을 넘거나 더 좁힐 영역이 없을 때까지 region→crop→answer를 반복"
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 결합 지점이 다른 세 논문에서 가져왔습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Multimodal embedding의 대조학습은 CLIP, screenshot retrieval은 ColPali, bounding box
            grounding의 location token 표현은 Kosmos-2 논문을 근거로 삼았습니다.
          </p>
        </div>
        <div id="paper-clip" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Radford et al. · Learning Transferable Visual Models From Natural Language Supervision / CLIP (ICML 2021)"
            citeKey={1}
            href="https://arxiv.org/abs/2103.00020"
          >
            4억 개의 image-text 쌍(WIT)으로 image encoder와 text encoder를 대조학습해 같은 embedding
            공간을 만듭니다. 배치 32,768, 학습 가능한 temperature(0.07 초기화)를 쓰는 symmetric
            cross-entropy loss로 zero-shot classification·retrieval에 재사용 가능한 표현을
            학습합니다.
          </CitationBlock>
        </div>
        <div id="paper-colpali" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Faysse et al. · ColPali: Efficient Document Retrieval with Vision Language Models (ICLR 2025)"
            citeKey={2}
            href="https://arxiv.org/abs/2407.01449"
          >
            PaliGemma 기반 vision-language model로 문서 페이지를 1024개 patch × 128차원 multi-vector
            embedding으로 직접 바꾸고 ColBERT 스타일 MaxSim으로 query와 매칭합니다. OCR+layout+captioning
            파이프라인 대비 인덱싱 7.22초→0.39초, ViDoRe nDCG@5 67.0→81.3을 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-kosmos2" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Peng et al. · Kosmos-2: Grounding Multimodal Large Language Models to the World (ICLR 2024)"
            citeKey={3}
            href="https://arxiv.org/abs/2306.14824"
          >
            224px 이미지를 32×32 bin으로 나눠 bounding box 좌표를 1,024개 location token으로
            양자화하고 "&lt;box&gt;&lt;loc&gt;...&lt;/box&gt;" 형태로 text vocabulary에 편입시켜
            referring expression·grounded caption을 하나의 sequence로 생성합니다. 약 9,100만 장의
            image와 1억 3,700만 개의 bounding box로 구성된 GrIT 데이터셋으로 학습합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Image가 patch embedding으로 바뀌는 절차는{" "}
          <Link to="/ai/vision-transformer#patch-embedding">Vision transformer</Link> 글을, VLM이
          vision encoder·projector·LLM을 조립하는 방식은{" "}
          <Link to="/ai/vision-language-model-architecture#architecture">VLM 구조</Link> 글을,
          text 검색 자체의 embedding space·ANN index는{" "}
          <Link to="/ai/vector-search-and-ann-indexes#dense-retrieval-embedding-space">벡터 검색</Link>{" "}
          글을 참고하세요.
        </p>
      </section>
    </div>
  );
}
