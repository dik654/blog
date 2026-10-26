import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  EmbeddingMapReturn,
  default as EmbeddingPathLocator,
} from "./sentence-embeddings/EmbeddingPathLocator";
import EmbeddingModelFineTuningViz from "./embedding-model-fine-tuning/viz/EmbeddingModelFineTuningViz";

/**
 * Embedding fine-tuning: 정답 쌍이 검색 순위가 되는 과정
 *
 * 한 query-document 쌍을 배치의 점수 행렬, InfoNCE 확률과 gradient, 갱신된
 * encoder, 새 문서 index까지 추적한다. 그 계산 위에서 역할별 입력, Matryoshka
 * 차원 축소, int8 표현, false negative와 도메인 과적합의 경계를 구분한다.
 */
export default function EmbeddingModelFineTuningArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <EmbeddingPathLocator current="fine-tuning" />
        <h2 className="mb-4 break-keep text-2xl font-bold">
          정답 쌍은 어떻게 모델 가중치와 검색 순위를 바꿀까요?
        </h2>
        <p className="max-w-3xl break-keep text-lg font-semibold leading-8 text-foreground">
          한 배치의 질문과 문서를 모두 교차 비교해 점수 행렬을 만들고, 각 질문의 정답
          문서가 선택될 확률을 높이는 방향으로 encoder를 갱신합니다. 학습된 가중치와
          입력 규칙으로 문서 index까지 다시 만들어야 그 변화가 실제 검색에 반영됩니다.
        </p>

        <EmbeddingModelFineTuningViz />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            위 그림의 Q1은 <strong>“충전이 안 돼요”</strong>이고 D1은 케이블과
            어댑터 점검을 설명한 정답 문서입니다. 같은 배치에 배송지 변경과 환불 기한
            쌍도 넣었습니다. 그러면 Q1은 D1을 정답으로 보면서 D2와 D3을 별도로
            수집하지 않은 negative로 사용합니다.
          </p>
          <p>
            이 구조를 <strong>in-batch negative</strong>라고 부릅니다. Fine-tuning은
            단순히 정답 쌍을 가깝게 만드는 데서 끝나지 않습니다. 어느 입력을 질문으로
            직렬화할지, 어느 차원을 배포에 남길지, 새 가중치로 문서 index를 언제 다시
            만들지도 같은 검색 좌표계의 계약입니다.
          </p>
          <p>
            문장을 고정 길이 벡터로 만드는 과정은{" "}
            <Link to="/cs/ai/sentence-embeddings#overview">문장 임베딩</Link>이,
            문서 벡터를 미리 계산해 검색하는 구조는{" "}
            <Link to="/cs/ai/bi-encoder-retrieval#overview">Bi-encoder 검색</Link>이
            맡습니다. 이 글은 그 사이에서 정답 쌍이 encoder를 바꾸는 계산만 엽니다.
          </p>
        </div>
      </section>

      <section id="objective" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          배치 하나가 점수 행렬과 negative 집합을 함께 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            배치에 정답 쌍이 B개 있으면 질문 하나는 자기 정답 1개와 다른 쌍의 문서
            B−1개를 비교합니다. 위의 세 쌍에서는 Q1이 D1·D2·D3을 보고, D1만
            positive로 취급합니다. 전체 행렬에는 대각선 positive 3칸과 대각선 밖
            negative 6칸이 생깁니다.
          </p>
          <p>
            여기서 점수는 정규화한 두 벡터의 cosine similarity일 수도 있고 내적일 수도
            있습니다. 모델과 loss가 정한 scale을 적용한 뒤 softmax를 계산하므로, 아래
            예시의 2·1·0은 원래 cosine 값이 아니라 <strong>softmax에 들어가는
            logit</strong>입니다.
          </p>
        </div>

        <ExplainedFormula
          question="Q1이 D1을 정답으로 고를 확률과 벌점을 어떻게 계산하나요?"
          idea="Q1과 모든 문서의 logit을 지수 점수로 바꿔 합한 뒤, 정답 D1의 몫을 확률로 봅니다. 그 확률에 음의 로그를 취하면 정답 확률이 낮을수록 큰 loss가 됩니다."
          formula={String.raw`L_i=-\log\frac{\exp(s_{ii})}{\sum_{j=1}^{B}\exp(s_{ij})}`}
          annotatedFormula={String.raw`\begin{aligned}
s_{ij}&=\underbrace{\operatorname{sim}(q_i,d_j)/\tau}_{\text{질문 }i\text{와 문서 }j\text{의 logit}}\\
Z_i&=\underbrace{\sum_{j=1}^{B}\exp(s_{ij})}_{\text{이 질문이 비교하는 모든 문서의 지수 점수}}\\
p(d_i\mid q_i)&=\underbrace{\exp(s_{ii})/Z_i}_{\text{정답 문서가 선택될 확률}}\\
L_i&=\underbrace{-\log p(d_i\mid q_i)}_{\text{정답 확률이 낮을수록 커지는 벌점}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\exp(2)=7.389`, annotation: ["Q1과 D1의 logit 2를", "양수 지수 점수로 바꿉니다"] },
            { expression: String.raw`Z=7.389+2.718+1=11.107`, annotation: ["D1·D2·D3의 지수 점수를", "같은 질문의 분모로 합칩니다"] },
            { expression: String.raw`p=7.389/11.107=0.6652`, annotation: ["분모에서 정답 D1이 차지하는 몫이", "현재 정답 확률입니다"] },
            { expression: String.raw`L=-\log(0.6652)=0.4076`, annotation: ["정답 확률을 loss로 바꾸면", "optimizer가 줄일 값이 됩니다"] },
          ]}
          terms={[
            { symbol: "q_i", name: "질문 벡터", description: "배치의 i번째 질문을 query 입력 규칙으로 인코딩한 벡터입니다." },
            { symbol: "d_j", name: "문서 벡터", description: "배치의 j번째 문서를 document 입력 규칙으로 인코딩한 벡터입니다." },
            { symbol: String.raw`\tau`, name: "Temperature", description: "Similarity 차이를 softmax에서 얼마나 날카롭게 볼지 정하는 양수입니다." },
            { symbol: "B", name: "배치의 쌍 수", description: "Pairs-only 예시에서는 질문 하나가 보는 문서 후보 수도 B개입니다." },
          ]}
          assumptions={[
            "Q1–D1, Q2–D2, Q3–D3가 각각 정답이라는 pair label을 알고 있습니다.",
            "같은 배치의 다른 문서는 이번 질문의 정답이 아니라고 간주합니다.",
            "2·1·0은 학습 과정을 설명하기 위한 logit이며 특정 모델의 측정값이 아닙니다.",
          ]}
          interpretation="Q1의 정답 확률은 0.6652이고 loss는 0.4076입니다. Softmax cross-entropy의 logit 기울기는 p−y이므로 D1은 −0.3348, D2는 +0.2447, D3는 +0.0900입니다. 경사하강은 정답 logit을 올리고 두 negative logit을 내리는 방향으로 encoder 가중치를 바꿉니다."
        />

        <AlgorithmBlock
          title="한 배치의 InfoNCE 학습 절차 (의사코드)"
          input={[
            "query_encoder, document_encoder: 같거나 서로 다른 가중치를 쓸 수 있는 encoder",
            "batch: B개의 (query_i, positive_document_i) 쌍",
            "temperature τ와 optimizer",
          ]}
          steps={[
            { code: "// 질문과 문서를 각 역할의 입력 규칙으로 인코딩합니다.\nQ = normalize(query_encoder(queries))\nD = normalize(document_encoder(documents))", note: "한 encoder를 공유하더라도 query·document 접두어나 prompt는 다를 수 있습니다." },
            { code: "// 모든 질문과 모든 문서를 교차 비교해 B×B logit 행렬을 만듭니다.\nS = (Q @ D.T) / τ", note: "행 i와 열 j의 값이 s_ij이며 대각선 s_ii가 정답입니다." },
            { code: "// 각 행에서 대각선 열을 정답으로 삼아 loss를 계산합니다.\nloss = cross_entropy(S, labels=range(B))", note: "Pairs-only 배치에서는 다른 열이 in-batch negative가 됩니다." },
            { code: "// loss의 기울기로 encoder 가중치를 한 번 갱신합니다.\nloss.backward()\noptimizer.step()", note: "점수 행렬 자체를 저장하는 것이 아니라 점수를 만든 encoder의 파라미터가 바뀝니다." },
          ]}
          repeatUntil="고정한 validation 검색 지표가 더 나아지지 않거나 미리 정한 중단 조건에 도달할 때까지 다음 배치로 반복합니다."
          output="새 encoder 가중치. 실제 검색에 쓰려면 같은 입력 규칙으로 corpus embedding과 ANN index를 다시 만듭니다."
        />

        <ProgressiveDetail
          title="배치가 크면 언제나 좋은 negative가 많아지나요?"
          preview="아닙니다. 다른 쌍의 문서가 Q1에도 정답일 수 있으면 false negative가 됩니다. 배치 크기보다 먼저 pair 중복과 다중 정답을 확인해야 합니다."
        >
          <p>
            “충전이 안 돼요”에 D1뿐 아니라 “배터리와 충전 포트 확인” 문서도 정답일 수
            있습니다. 그 문서가 다른 쌍의 positive로 같은 배치에 들어오면 기본 행렬은
            Q1에서 그 문서를 negative로 취급합니다. Sentence Transformers 공식 문서도
            이런 중복을 피하도록 중복 없는 batch sampler를 권합니다.
          </p>
          <p>
            따라서 B가 커져 B−1개의 후보가 생겼다는 사실과, 그 후보가 올바른 학습 신호라는
            판단은 별개입니다. 알려진 다중 정답은 mask로 제외하고, hard negative는 label과
            mining 시점을 기록해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="architecture" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          입력 역할이 다르다는 사실과 encoder 가중치를 나누는 선택은 별개입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            짧은 질문으로 긴 문서를 찾는 문제는 <strong>asymmetric semantic
            search</strong>입니다. 질문과 후보가 비슷한 형식인 중복 문장 검색은
            symmetric search에 가깝습니다. 이 이름은 입력 역할의 차이를 말할 뿐,
            가중치를 반드시 두 벌 써야 한다는 뜻은 아닙니다.
          </p>
          <p>
            DPR은 질문 encoder와 passage encoder를 따로 두었습니다. 반면 E5는 하나의
            encoder를 공유하면서 <code>query:</code>와 <code>passage:</code> 접두어로
            역할을 구분합니다. 둘 다 질문과 문서의 역할 차이를 학습하지만, 파라미터를
            나누는 위치가 다릅니다.
          </p>
        </div>

        <TermBreakdown
          title="같은 검색 문제를 표현하는 두 가지 구조"
          description="둘 중 하나가 asymmetric retrieval의 정의는 아닙니다. 역할이 다른 입력을 어떤 파라미터와 문자열 계약으로 구분하는지의 선택입니다."
          items={[
            { term: "가중치 분리", description: "Query encoder와 document encoder가 서로 다른 파라미터를 가집니다.", example: "DPR의 question encoder·passage encoder", boundary: "모델 두 벌의 학습·배포 상태를 함께 관리해야 합니다." },
            { term: "가중치 공유", description: "Encoder 하나를 공유하고 입력 앞의 역할 prefix나 prompt를 다르게 줍니다.", example: "E5의 query:·passage: 접두어", boundary: "학습 때 쓴 문자열을 서빙과 index 생성에서도 그대로 지켜야 합니다." },
            { term: "Loss 방향", description: "기본 검색은 query→document 행 softmax로 설명할 수 있지만, 역방향 loss를 더할지는 loss 설계가 정합니다.", example: "공유 encoder의 symmetric ranking loss는 양방향을 합칠 수 있습니다.", boundary: "Asymmetric이라는 이름만 보고 역방향을 자동으로 금지하거나 추가하지 않습니다." },
          ]}
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="instruction-tuned" className="scroll-mt-20">
            역할 접두어는 모델 밖의 장식이 아니라 학습 입력입니다
          </h3>
          <p>
            E5에서 <code>query:</code>와 <code>passage:</code>는 tokenizer로 들어가는
            문자열의 일부입니다. 학습 때 넣은 접두어를 query API에서 빼거나 문서 index를
            만들 때 다른 표현으로 바꾸면 두 벡터가 같은 학습 계약을 따르지 않습니다.
          </p>
          <p>
            그래서 fine-tuning 결과물은 weight 파일 하나가 아닙니다. Checkpoint,
            tokenizer, query·document 입력 형식, pooling, normalization, 최대 길이를 함께
            고정해야 합니다. 이 묶음이 실제 배포 generation으로 이어지는 방식은{" "}
            <Link to="/cs/ai/embedding-serving-contract#serialization">
              임베딩 서빙 계약
            </Link>
            에서 추적합니다.
          </p>
        </div>
      </section>

      <section id="compression" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          차원을 잘라 쓸 계획이라면 학습할 때부터 그 길이로 loss를 계산합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일반 768차원 embedding의 앞 128차원을 나중에 임의로 잘라 쓴다고 해서 그
            부분에 중요한 정보가 먼저 모여 있지는 않습니다. Matryoshka Representation
            Learning은 768·512·256·128처럼 여러 prefix 길이에서 loss를 함께 계산해,
            짧은 prefix도 독립적으로 쓸 수 있게 학습합니다.
          </p>
        </div>

        <ExplainedFormula
          question="한 모델이 여러 embedding 차원에서 검색 관계를 유지하게 하려면 무엇을 더하나요?"
          idea="전체 벡터의 앞 m개 차원만 남긴 prefix마다 같은 retrieval loss를 계산하고, 선택한 모든 길이의 loss를 한 번에 더합니다."
          formula={String.raw`L_{\mathrm{MRL}}=\sum_{m\in\mathcal M}c_m L_{\mathrm{InfoNCE}}(z_{1:m},z'_{1:m})`}
          annotatedFormula={String.raw`\begin{aligned}
z_{1:m}&=\underbrace{z[1..m]}_{\text{전체 embedding의 앞 }m\text{개 차원}}\\
L_m&=\underbrace{L_{\mathrm{InfoNCE}}(z_{1:m},z'_{1:m})}_{\text{그 길이만으로 다시 계산한 검색 loss}}\\
L_{\mathrm{MRL}}&=\underbrace{\sum_{m\in\mathcal M}c_mL_m}_{\text{여러 길이의 loss를 합친 학습 목표}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\mathcal M=\{768,512,256,128\}`, annotation: ["배포에서 허용할 차원 길이를", "학습 전에 정합니다"] },
            { expression: String.raw`z_{1:128}`, annotation: ["전체 벡터의 앞 128차원만 남겨", "별도 embedding처럼 정규화하고 비교합니다"] },
            { expression: String.raw`L_{768}+L_{512}+L_{256}+L_{128}`, annotation: ["각 길이에서 나온 retrieval loss를", "같은 backward에 반영합니다"] },
          ]}
          terms={[
            { symbol: "z", name: "전체 embedding", description: "예에서는 최대 768차원인 encoder 출력입니다." },
            { symbol: String.raw`\mathcal M`, name: "허용 차원 집합", description: "앞에서부터 남겨 평가할 차원 길이 목록입니다." },
            { symbol: "c_m", name: "길이별 가중치", description: "각 prefix loss를 전체 학습에 얼마나 반영할지 정합니다." },
          ]}
          assumptions={[
            "차원은 임의 선택이 아니라 항상 앞에서부터 자르는 prefix입니다.",
            "각 길이에서 벡터를 다시 정규화하고 같은 pair 관계를 평가합니다.",
            "128차원 품질은 데이터와 모델에 따라 달라지므로 배포 지표로 따로 확인해야 합니다.",
          ]}
          interpretation="MRL은 앞쪽 차원에도 검색 관계를 직접 가르칩니다. 그래서 짧은 벡터가 쓸 만해지는 것이지, 자르기 연산 자체가 정보를 압축하는 것은 아닙니다."
        />

        <div className="not-prose my-8 grid gap-px bg-border p-px sm:grid-cols-3" aria-label="차원과 자료형에 따른 벡터당 저장량 계산">
          {[
            ["원본", "768차원 × 4 B", "3,072 B"],
            ["차원 축소", "128차원 × 4 B", "512 B"],
            ["차원 축소 + int8", "128차원 × 1 B", "128 B"],
          ].map(([label, calculation, result]) => (
            <div key={label} className="bg-background p-4">
              <p className="text-[10px] font-black text-primary">{label}</p>
              <p className="mt-2 font-mono text-xs text-muted-foreground">{calculation}</p>
              <p className="mt-2 text-lg font-black">{result}</p>
            </div>
          ))}
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="quantization" className="scroll-mt-20">
            Int8은 별도의 학습 목표가 아니라 저장 표현을 바꾸는 다음 단계입니다
          </h3>
          <p>
            Float32 한 성분은 4바이트이고 int8 한 성분은 1바이트라서, 차원이 같다면
            원시 벡터 저장량은 4분의 1이 됩니다. 그러나 scalar quantization은 좌표를
            256단계로 근사하므로 거리와 순위가 조금 달라질 수 있습니다.
          </p>
          <p>
            Matryoshka truncation과 int8 quantization은 서로 다른 축입니다. 먼저 사용할
            차원을 정해 retrieval 품질을 확인하고, 그 차원에서 다시 int8 손실을 재야
            합니다. 두 결과를 다른 데이터셋에서 따로 얻은 뒤 손실을 단순히 더하거나
            곱하면 같은 검색 작업을 비교한 계산이 아닙니다.
          </p>
          <p>
            이 절의 3,072→512→128바이트는 벡터 값만 센 원시 크기입니다. ANN graph,
            식별자, metadata, 정렬과 파일 형식의 overhead는 포함하지 않았습니다.
          </p>
        </div>
      </section>

      <section id="domain-adaptation" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          Loss가 줄어도 pair 정의가 틀리면 검색은 잘못 배웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Fine-tuning은 학습 데이터가 정한 관계를 더 잘 구분하도록 공간을 바꿉니다.
            따라서 도메인 pair를 넣으면 그 도메인의 어휘와 relevance 기준을 배울 수
            있지만, pair 자체가 사용자 의도와 다르면 loss가 잘 줄어도 검색 품질은
            좋아지지 않습니다.
          </p>
          <p>
            예를 들어 법률 질의에서 조문을 positive로 두고 해설을 모두 negative로 두면,
            모델은 관련 해설까지 밀어내도록 학습할 수 있습니다. In-batch negative의
            false negative 문제와 도메인 label의 범위가 여기서 만납니다.
          </p>
          <h3 id="over-specialization" className="scroll-mt-20">
            도메인 이득과 일반 검색 하락은 서로 다른 평가 묶음으로 확인합니다
          </h3>
          <p>
            한 도메인의 pair만 반복해서 학습하면 그 관계에는 더 민감해지는 대신 다른
            관계를 구분하던 공간이 바뀔 수 있습니다. 이를 over-specialization이라고
            부를 수 있지만, 하락 폭은 보편값이 아닙니다. 기존 글의 “도메인 +8점,
            일반 −3점” 같은 숫자는 특정 측정 근거가 없어 본문 판단에서 제외했습니다.
          </p>
          <p>
            개념적으로 확인할 것은 두 묶음입니다. 도메인 validation에서는 새로 배우려던
            검색 관계를 재고, 일반 validation에서는 유지해야 할 기존 관계가 무너지지
            않았는지 봅니다. 어느 하락을 허용할지는 운영 환경의 결정이므로 별도 실무
            글과 ADR에서 다뤄야 합니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 break-keep text-2xl font-bold">
          논문과 공식 구현 문서에서 어디까지 확인했을까요?
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            DPR은 질문과 passage를 별도 encoder로 학습하고 in-batch negative를 사용한
            대표 사례입니다. E5는 query·passage 접두어와 대조학습으로 하나의 encoder가
            역할을 구분하게 했습니다. 두 사례는 입력 역할의 비대칭성과 가중치 공유
            여부가 같은 말이 아님을 보여 줍니다.
          </p>
          <p>
            MRL 논문은 여러 prefix 차원을 함께 학습하는 목적함수를 제안했고,
            Sentence Transformers 공식 문서는 MultipleNegativesRankingLoss와
            MatryoshkaLoss의 현재 구현 인터페이스를 공개합니다. 아래 수치 중 논문 성능은
            저자 환경의 결과이며 이 글의 세 쌍 계산은 메커니즘을 확인하기 위한 예시입니다.
          </p>
        </div>

        <div id="paper-dpr" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Karpukhin et al. · Dense Passage Retrieval for Open-Domain Question Answering (EMNLP 2020)"
            citeKey={1}
            href="https://arxiv.org/abs/2004.04906"
          >
            질문 encoder와 passage encoder, in-batch negative를 결합한 dense retrieval
            학습을 제시합니다. 보고된 성능은 논문의 open-domain QA 데이터셋과 비교 조건에
            한정됩니다.
          </CitationBlock>
        </div>
        <div id="paper-e5" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Wang et al. · Text Embeddings by Weakly-Supervised Contrastive Pre-training (E5)"
            citeKey={2}
            href="https://arxiv.org/abs/2212.03533"
          >
            Query·passage 역할 접두어와 대규모 text pair 대조학습을 결합했습니다. 접두어
            규칙은 E5 계열 checkpoint의 학습·서빙 계약이며 모든 embedding 모델의 공통
            규칙은 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-matryoshka" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Kusupati et al. · Matryoshka Representation Learning (NeurIPS 2022)"
            citeKey={3}
            href="https://arxiv.org/abs/2205.13147"
          >
            여러 prefix 차원에서 loss를 함께 계산하는 nested representation 학습을
            제안합니다. 최대 14배 축소·가속 수치는 논문의 vision 중심 실험 결과라서 text
            retrieval에 그대로 옮기지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-symmetric-search" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Sentence Transformers 공식 문서 · Semantic Search"
            citeKey={4}
            href="https://www.sbert.net/examples/applications/semantic-search/README.html"
            type="code"
          >
            질문과 corpus의 역할이 다른 asymmetric search와 비슷한 문장끼리 비교하는
            symmetric search를 구분하고, query·document 전용 encode 경로를 설명합니다.
          </CitationBlock>
        </div>
        <div id="paper-losses" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Sentence Transformers 공식 문서 · Losses"
            citeKey={5}
            href="https://www.sbert.net/docs/package_reference/sentence_transformer/losses.html"
            type="code"
          >
            MultipleNegativesRankingLoss의 query→document 기본 방향, 중복 없는 batch 권고,
            MatryoshkaLoss의 차원 목록과 가중치 인터페이스를 확인할 수 있습니다. 문서는
            버전별 API가 바뀔 수 있으므로 실제 구현에서는 설치 버전을 고정해야 합니다.
          </CitationBlock>
        </div>
        <div id="paper-quantization" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Hugging Face · Binary and Scalar Embedding Quantization (2024)"
            citeKey={6}
            href="https://huggingface.co/blog/embedding-quantization"
            type="code"
          >
            Float32 embedding을 int8로 바꾸는 scalar quantization과 oversampling 뒤
            rescoring 절차를 공개합니다. 품질 유지 비율은 글에서 평가한 모델과 MTEB
            retrieval 조건의 저자 측정입니다.
          </CitationBlock>
        </div>

        <ContentBoundary article="embedding-model-fine-tuning" />
        <EmbeddingMapReturn current="fine-tuning" />
      </section>
    </div>
  );
}
