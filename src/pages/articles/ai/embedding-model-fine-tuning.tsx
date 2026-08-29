import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import EmbeddingModelFineTuningViz from "./embedding-model-fine-tuning/viz/EmbeddingModelFineTuningViz";

/**
 * Embedding fine-tuning: InfoNCE·asymmetric retrieval·truncation
 *
 * In-batch negative로 정답 (query, document) 쌍을 학습 신호로 바꾸는 fine-tuning objective,
 * asymmetric·symmetric encoder 선택과 instruction 접두어, 학습 후 embedding을 줄이는
 * Matryoshka truncation과 int8 quantization, 그리고 도메인 특화가 만드는 over-specialization을
 * 다룬다. Pair 의미·NT-Xent·pooling·bi-encoder 계산 구조는 각 정본 글이 소유한다.
 */
export default function EmbeddingModelFineTuningArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Embedding fine-tuning은 배치의 다른 쌍을 negative로 재사용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사전학습된 embedding checkpoint는 문장이 서로 비슷한지는 알지만, 우리 검색
            시스템에서 어떤 문서가 어떤 질의의 정답인지는 모릅니다. Fine-tuning은 그 정답
            (query, document) 쌍을 모아 배치 안의 다른 문서 전부를 negative로 삼아 정답
            쌍의 similarity만 높이는 학습입니다.
          </p>
          <p>
            이 글은 그 objective가 무엇을 계산하는지(in-batch negative·InfoNCE), query와
            document를 같은 encoder로 볼지 다른 encoder로 볼지(asymmetric·symmetric), 학습
            후 embedding을 어떻게 줄이는지(Matryoshka truncation·int8 quantization), 그리고
            도메인에 맞출수록 생기는 대가(over-specialization)를 순서대로 봅니다.
          </p>
          <p>
            Pair가 무엇인지, NT-Xent가 어떻게 계산되는지, 문장 pooling과 bi-encoder의
            online·offline 구조가 무엇인지는{" "}
            <Link to="/ai/contrastive-learning#pair-contract">Contrastive Learning</Link>,{" "}
            <Link to="/ai/simclr-infonce#objective">SimCLR·NT-Xent</Link>,{" "}
            <Link to="/ai/sentence-embeddings#relation">문장 임베딩</Link>,{" "}
            <Link to="/ai/bi-encoder-retrieval#offline-index">Bi-encoder retrieval</Link> 글이
            이미 다룹니다. 이 글은 그 위에서 embedding을 실제로 fine-tuning할 때의 목적함수와
            설계 선택을 엽니다.
          </p>
        </div>
        <EmbeddingModelFineTuningViz />
        <ContentBoundary article="embedding-model-fine-tuning" />
      </section>

      <section id="objective" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          배치 크기가 negative 개수입니다 — 256개면 255개가 그냥 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            In-batch negative는 별도의 negative sampling 없이, 같은 배치에 들어온 다른
            (query, document) 쌍의 document를 그대로 negative로 쓰는 방법입니다. 배치가
            256개 쌍이면 query 하나마다 자기 정답 문서 1개와 다른 255개 문서가 동시에
            negative 후보가 됩니다.
          </p>
          <p>
            추가 mining 없이 negative가 배치 크기만큼 자동으로 생기는 것이 장점입니다.
            대신 배치 안에 우연히 같은 의미의 문서가 둘 있으면 negative로 잘못 셉니다.
            이 false negative는 배치가 클수록, 코퍼스가 좁을수록 늘어납니다.
          </p>
          <p>
            Embedding fine-tuning objective는 이 in-batch negative 위에서 InfoNCE 형태의
            loss로 정답 쌍의 similarity를 높이고 나머지는 낮춥니다. NT-Xent가 augmentation
            view 둘을 서로의 positive로 삼는 것과 같은 수식이지만, 여기서는 view가 아니라
            query와 document라는 서로 다른 대상 사이에서 계산합니다.
          </p>
        </div>
        <ExplainedFormula
          question="정답 문서 하나와 배치 안 나머지 문서 전부를 두고 query embedding을 어떻게 갱신하나요?"
          idea="Query와 정답 문서의 similarity를 temperature로 나눠 logit을 만들고, 배치 안 모든 문서(정답 포함)의 지수 점수 합으로 정규화합니다. 정답 문서가 선택될 확률이 낮을수록 큰 벌점을 줍니다."
          formula={String.raw`L_i=-\log\frac{\exp(\operatorname{sim}(q_i,d_i)/\tau)}{\sum_{j=1}^{B}\exp(\operatorname{sim}(q_i,d_j)/\tau)}`}
          annotatedFormula={String.raw`\begin{aligned}
s_{ij}&=\underbrace{\operatorname{sim}(q_i,d_j)/\tau}_{\text{query }i\text{와 문서 }j\text{의 similarity를 temperature로 조절}}\\
Z_i&=\underbrace{\sum_{j=1}^{B}\exp(s_{ij})}_{\text{배치 전체 문서(정답 포함)의 점수를 합산}}\\
p(i\mid i)&=\underbrace{\exp(s_{ii})/Z_i}_{\text{정답 문서가 선택될 확률}}\\
L_i&=\underbrace{-\log p(i\mid i)}_{\text{확률이 낮을수록 큰 벌점}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\operatorname{sim}(q_i,d_j)/\tau`, annotation: ["Query와 문서의 similarity를", "temperature로 나눠 logit을 만듭니다"] },
            { expression: String.raw`\sum_{j=1}^{B}\exp(s_{ij})`, annotation: ["배치 안 모든 문서(자기 정답 포함)의", "지수 점수를 합쳐 분모를 만듭니다"] },
            { expression: String.raw`-\log p(i\mid i)`, annotation: ["정답 문서 선택 확률에 negative log를 씌워", "additive loss로 바꿉니다"] },
          ]}
          terms={[
            { symbol: "q_i, d_i", name: "Query·정답 문서 embedding", description: "각 encoder를 통과시키고 길이 1로 정규화한 벡터입니다." },
            { symbol: "d_j", name: "In-batch negative", description: "같은 배치의 다른 query에 속한 문서로, j≠i면 이번 query의 negative입니다." },
            { symbol: String.raw`\tau`, name: "Temperature", description: "Similarity 차이를 얼마나 날카롭게 볼지 정하는 양수입니다." },
            { symbol: "B", name: "배치 크기", description: "이번 step의 (query, document) 쌍 개수이자 negative 후보 수 + 1입니다." },
          ]}
          assumptions={[
            "Query encoder와 document encoder는 가중치가 다를 수 있습니다(asymmetric).",
            "배치 안 다른 문서가 실제로 무관하다고 가정합니다 — false negative가 있을 수 있습니다.",
            "Similarity는 정규화한 벡터의 cosine 또는 내적입니다.",
          ]}
          interpretation="형태는 SimCLR의 NT-Xent와 같지만 두 가지가 다릅니다. View 둘이 아니라 query·document라는 다른 대상 사이에서 계산하고, j→i 방향(문서를 anchor로 보는 방향)은 계산하지 않습니다. Asymmetric encoder에서는 문서를 질문처럼 인코딩하는 것 자체가 의미가 없기 때문입니다."
        />
        <AlgorithmBlock
          title="In-batch negative contrastive training 한 step"
          input={[
            "f_q, f_d: query/document encoder (asymmetric이면 가중치가 다르고, symmetric이면 f_q = f_d)",
            "batch: B개의 (query_i, document_i) 정답 쌍",
            "τ: temperature",
          ]}
          steps={[
            { code: "for i in batch: q_i = normalize(f_q(query_i)); d_i = normalize(f_d(document_i))", note: "각 query·document를 encoder에 통과시키고 길이를 1로 맞춰 cosine 비교가 되게 합니다." },
            { code: "S = (q @ d.T) / τ    # B×B similarity 행렬", note: "행 i·열 j는 query_i와 document_j의 유사도이고, 대각선 S[i,i]가 정답 쌍입니다." },
            { code: "mask(S, duplicate_pairs)   # 선택: 알려진 중복 의미 쌍을 negative에서 제외", note: "배치 안에 우연히 같은 의미의 문서가 있으면 false negative가 되므로 아는 만큼 걸러 냅니다." },
            { code: "loss_i = -log( exp(S[i,i]) / sum_j exp(S[i,j]) )   for each i", note: "행마다 softmax cross-entropy를 계산합니다. 정답 열의 확률이 낮을수록 loss가 커집니다." },
            { code: "L = mean(loss_i);  backward(L);  optimizer.step()", note: "배치 평균 loss로 encoder 가중치를 갱신합니다. Asymmetric이면 두 encoder 모두 갱신됩니다." },
          ]}
          repeatUntil="Validation retrieval metric(Recall@k 등)이 더 이상 오르지 않을 때까지 다음 배치로 반복합니다."
          output="갱신된 f_q, f_d 가중치와 이번 step의 평균 loss"
        />
      </section>

      <section id="domain-adaptation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          도메인 쌍으로 다시 학습하면 그 도메인은 좋아지고 밖은 좁아집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            General embedding은 넓은 코퍼스에서 학습돼 다양한 주제를 어느 정도 다루지만,
            법률·의료·코드처럼 용어가 특수한 도메인에서는 미묘한 차이를 놓칩니다. "고려"라는
            단어가 법률 문서와 일상 대화에서 다른 뜻을 가지듯, 도메인 vocabulary는 general
            학습 데이터에 충분히 나오지 않았을 수 있습니다.
          </p>
          <p>
            Domain-specific embedding adaptation은 이 general checkpoint를 도메인의
            (query, document) 쌍으로 같은 in-batch negative objective로 이어서 학습하는
            것입니다. 법률 QA 쌍 5만 개로 추가 학습하면 법률 벤치마크의 Recall@10이 오르는
            대신, 학습에 없던 표현에는 상대적으로 덜 민감해집니다.
          </p>
          <p>
            어떤 도메인 gap을 채우려는 것인지부터 분명히 해야 합니다. Vocabulary·문체
            차이인지, 사실 최신성 문제인지, 아니면 검색 자체의 relevance 기준이 다른
            것인지에 따라 이 글의 fine-tuning이 맞는 처방인지, retrieval-time 재작성이나
            reranker 추가가 더 나은지 갈립니다.
          </p>
          <h3 id="over-specialization" className="scroll-mt-20">
            도메인에 맞춘 만큼 general 성능이 떨어지는 것은 흔한 부작용입니다
          </h3>
          <p>
            도메인 fine-tuning은 embedding 공간을 그 도메인의 (query, document) 쌍이 잘
            구분되도록 재배치합니다. 그 재배치가 general 벤치마크가 기대는 다른 구분까지
            건드리면, 도메인 점수는 오르고 general 점수는 내려갑니다. 이 현상을 embedding
            over-specialization이라 부릅니다.
          </p>
          <p>
            예를 들어 법률 fine-tuning 뒤 법률 벤치마크가 8점 오르는 대신 일반 MTEB
            평균이 3점 떨어지는 식의 결과가 흔히 보고됩니다. 이 수치는 설명을 위한 예시
            산수이며 특정 모델의 측정값이 아닙니다.
          </p>
          <p>
            원인은 retrieval domain shift입니다. 배포 도메인의 query·document 분포가
            general 학습 분포와 다르기 때문에 도메인 fine-tuning이 필요했습니다. 그런데
            그 fine-tuning이 도메인 분포에만 맞춰 공간을 좁히면 domain shift의 반대
            방향에서 같은 문제가 다시 생깁니다.
          </p>
          <p>
            배포가 그 도메인에만 쓰인다면 general 하락은 감수할 수 있는 trade-off입니다.
            General 사용도 함께 필요하다면 checkpoint를 나누거나 general pair를 일부
            섞어 학습해야 합니다.
          </p>
        </div>
      </section>

      <section id="architecture" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Query와 document 길이가 다르면 asymmetric encoder가 낫습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            짧은 질문과 긴 문단처럼 두 입력의 길이·역할이 다르면 같은 encoder 하나로
            둘 다 잘 인코딩하기 어렵습니다. Asymmetric retrieval은 query encoder와 document
            encoder의 가중치를 따로 두어 각자에 맞는 표현을 학습하게 합니다. DPR이 질문
            encoder와 passage encoder를 독립적으로 학습한 것이 대표적입니다.
          </p>
          <p>
            반대로 query와 target이 길이·형식이 비슷하면(중복 질문 찾기, 문장 간
            유사도) encoder를 하나만 두는 symmetric retrieval이 더 간단하고 자주 더 낫습니다.
            두 구성 중 어느 쪽이 맞는지는 문제의 길이·형식 차이로 먼저 가늠하고, 애매하면
            실제로 비교해 정합니다.
          </p>
          <p>
            이 선택은 앞 절의 in-batch negative 계산에도 영향을 줍니다. Symmetric에서는
            query→document와 document→query 양방향 loss를 더할 수 있지만, asymmetric에서는
            문서를 질문처럼 인코딩하는 방향이 의미가 없어 query→document 한 방향만
            계산합니다.
          </p>
        </div>
        <TermBreakdown
          title="Asymmetric retrieval과 symmetric retrieval의 차이"
          description="같은 in-batch negative objective를 어떤 encoder 구성 위에서 돌리느냐의 선택입니다."
          items={[
            { term: "가중치 공유", description: "Symmetric은 query와 document를 같은 encoder로, asymmetric은 서로 다른 encoder(또는 다른 가중치)로 인코딩합니다.", example: "DPR은 question encoder와 passage encoder를 따로 학습합니다.", boundary: "Instruction 접두어만 바꾸는 방식은 가중치는 하나지만 실질적으로 asymmetric 효과를 냅니다." },
            { term: "잘 맞는 문제", description: "Query와 target의 길이·형식이 비슷하면 symmetric, 짧은 질문과 긴 문서처럼 다르면 asymmetric이 유리합니다.", example: "중복 질문 찾기는 symmetric, 질문–문단 검색은 asymmetric입니다.", boundary: "경계가 뚜렷하지 않은 문제는 두 구성을 실제로 비교해 정해야 합니다." },
            { term: "In-batch negative 방향", description: "Symmetric은 양방향 loss를 더할 수 있지만 asymmetric은 query→document 한 방향만 계산합니다.", example: "NT-Xent는 두 view가 대칭이라 양방향 평균을 냅니다.", boundary: "양방향 loss를 asymmetric에 그대로 적용하면 문서를 질문처럼 보는 의미 없는 신호가 섞입니다." },
            { term: "학습·서빙 비용", description: "Asymmetric은 encoder 두 벌을 학습·배포해야 하지만 symmetric·instruction-tuned는 한 벌로 충분합니다.", example: "Instruction-tuned embedding은 encoder 하나에 접두어만 바꿔 asymmetric 역할을 흉내 냅니다.", boundary: "접두어 방식은 완전히 분리된 encoder만큼 역할을 특화하지 못할 수 있습니다." },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="instruction-tuned" className="scroll-mt-20">
            Instruction 접두어 하나로 encoder 한 벌이 여러 역할을 나눠 맡습니다
          </h3>
          <p>
            Instruction-tuned embedding은 문장 앞에 자연어 지시("이 문장을 검색용으로
            표현하라" 같은)를 붙여 인코딩하는 방법입니다. 같은 encoder라도 붙인 지시에
            따라 embedding 공간 안에서 다른 방식으로 배치되도록 학습해, 별도 encoder 없이도
            asymmetric에 가까운 역할 분리를 얻습니다.
          </p>
          <p>
            E5는 문장 앞에 <code>query:</code> 또는 <code>passage:</code> 접두어를 붙여
            하나의 encoder로 검색의 query 쪽과 document 쪽을 다르게 인코딩합니다. 이
            접두어는{" "}
            <Link to="/ai/embedding-serving-contract#serialization">
              embedding serving contract
            </Link>{" "}
            가 정의하는 입력 문자열의 일부가 되어, 서빙 시점에도 학습 때와 똑같이
            붙여야 합니다.
          </p>
          <p>
            접두어를 빼거나 다른 표현으로 바꾸면 학습 때 보지 못한 조합이 되어 품질이
            보장되지 않습니다. 별도 encoder를 두는 asymmetric 구성보다 학습·서빙 비용은
            낮지만, 완전히 분리된 encoder만큼 역할을 특화하지는 못합니다.
          </p>
        </div>
      </section>

      <section id="compression" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Nested loss로 학습한 embedding은 차원을 잘라도, 정수로 바꿔도 크게 나빠지지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Fine-tuning이 끝난 embedding은 그대로 저장·검색에 쓰기엔 크고 비쌉니다.
            차원을 줄이거나(embedding truncation) 성분을 더 적은 비트로 저장하면(embedding
            quantization) 저장·전송 비용이 줄어듭니다. 두 방법 모두 학습 방식을 조금
            바꾸면 정확도 손실을 작게 유지할 수 있습니다.
          </p>
          <p>
            차원을 줄이는 쪽은 Matryoshka Representation Learning의 nested loss가
            대표적입니다. 러시아 인형처럼 큰 embedding 안에 작은 embedding이 이미 들어
            있도록 학습해, 뒤쪽을 잘라내도 앞쪽만으로 어느 정도 순위를 매길 수 있게
            만듭니다.
          </p>
        </div>
        <ExplainedFormula
          question="여러 차원 길이에서 한 번에 잘 작동하는 embedding을 어떻게 학습하나요?"
          idea="전체 embedding z의 앞 m개 차원만 잘라 독립된 부분 embedding으로 보고, 그 부분 embedding만으로 InfoNCE loss를 계산합니다. 이것을 여러 m에 대해 동시에 더해 한 번의 backward로 모든 길이를 함께 학습합니다."
          formula={String.raw`L_{\mathrm{MRL}}=\sum_{m\in\mathcal{M}}c_m\,L_{\mathrm{InfoNCE}}\!\left(z_{1:m},z'_{1:m}\right)`}
          annotatedFormula={String.raw`\begin{aligned}
z_{1:m}&=\underbrace{z[1..m]}_{\text{전체 embedding의 앞 }m\text{개 차원(prefix)}}\\
L_{\mathrm{InfoNCE}}(z_{1:m},z'_{1:m})&=\underbrace{\text{그 prefix만으로 계산한 in-batch loss}}_{\text{granularity }m\text{ 하나의 목적함수}}\\
L_{\mathrm{MRL}}&=\underbrace{\sum_{m\in\mathcal{M}}c_m\,L_{\mathrm{InfoNCE}}(z_{1:m},z'_{1:m})}_{\text{여러 granularity의 loss를 가중합}}
\end{aligned}`}
          operations={[
            { expression: String.raw`z_{1:m}`, annotation: ["전체 embedding z의 앞 m개 차원만 잘라", "독립된 부분 embedding으로 씁니다"] },
            { expression: String.raw`L_{\mathrm{InfoNCE}}(z_{1:m},z'_{1:m})`, annotation: ["그 부분 embedding만으로 같은 InfoNCE loss를", "이 granularity 하나에 대해 계산합니다"] },
            { expression: String.raw`\sum_{m\in\mathcal{M}}c_m(\cdot)`, annotation: ["여러 차원 granularity의 loss를 가중합해", "한 번의 backward로 모든 길이를 동시에 학습합니다"] },
          ]}
          terms={[
            { symbol: "z", name: "전체 embedding", description: "예: 768차원 full-precision embedding." },
            { symbol: String.raw`\mathcal{M}`, name: "Nested 차원 집합", description: "예: {128, 256, 384, 512, 768}처럼 앞에서부터 겹치는 차원 길이들입니다." },
            { symbol: "c_m", name: "Granularity 가중치", description: "각 m의 loss를 얼마나 반영할지 정하며, 보통 1로 둡니다." },
            { symbol: String.raw`z_{1:m}`, name: "Prefix embedding", description: "전체 embedding의 앞 m개 차원만 남긴 부분 벡터입니다." },
          ]}
          assumptions={[
            "차원은 항상 앞에서부터 자른다고 정의합니다 — 순서가 있는 nested prefix입니다.",
            "각 m에 대해 같은 배치의 같은 (query, document) 쌍으로 loss를 계산합니다.",
            String.raw`c_m을 1로 두면 모든 granularity를 동등하게 취급합니다.`,
          ]}
          interpretation="전체 embedding의 loss만 최소화하지 않고 여러 prefix 길이의 loss를 동시에 최소화하기 때문에, 학습이 끝나면 앞 128차원만으로도 그 자체로 유효한 embedding이 됩니다. 무작위로 학습한 768차원을 나중에 128차원으로 자르는 것과 다른 점이 바로 이 nested 학습입니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            차원을 앞에서부터 자르는 이 방식은{" "}
            <Link to="/ai/embedding-serving-contract#truncation">
              embedding serving contract가 다루는 token 단위 truncation
            </Link>{" "}
            과는 다른 축입니다. Token truncation은 입력 문장에서 어디까지 읽을지를
            자르고, Matryoshka truncation은 이미 만든 embedding의 어느 차원까지 쓸지를
            자릅니다.
          </p>
          <h3 id="quantization" className="scroll-mt-20">
            성분을 float32에서 int8로 바꾸면 저장량은 4분의 1, 정확도는 거의 그대로입니다
          </h3>
          <p>
            Embedding quantization은 각 성분의 32비트 소수를 256단계짜리 정수(int8)로
            다시 표현하는 것입니다. 성분마다 최소·최댓값을 calibration 데이터로 재고
            그 범위를 정수 구간에 선형으로 대응시키는 affine mapping을 씁니다.
          </p>
          <p>
            768차원 embedding은 float32면 벡터당 3,072바이트(768×4바이트)지만 int8이면
            768바이트(768×1바이트)라 저장량이 4분의 1로 줄어듭니다. 실제 벤치마크에서는
            rescoring 없이도 원래 성능의 최대 99.3%를, oversampling 뒤 재채점하면 약
            99%를 유지한다고 보고됩니다.
          </p>
          <p>
            이 손실은 모델마다 다릅니다. Embedding 성분이 이미 몇 개 차원에 쏠려 있는
            (dimension collapse) 모델은 calibration 범위가 왜곡되어 quantization 손실이
            커집니다. Affine mapping 자체의 scale·zero-point 계산은{" "}
            <Link to="/ai/quantization#affine-map">양자화 기초</Link> 글의 일반 quantizer와
            같습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Matryoshka truncation과 quantization을 같이 쓰면 손실이 그냥 더해지나요?"
          preview="꼭 그렇지는 않습니다. 두 손실이 같은 차원 축에서 겹치므로 독립이 아니며, 실제 배포에서는 차원을 먼저 정하고 그 줄어든 차원에서 quantization 손실을 다시 재야 합니다."
        >
          <p>
            차원을 128로 자른 뒤 그 128차원 벡터를 다시 int8로 quantize하면, 각 손실을
            따로 측정한 값의 합보다 실제 손실이 크거나 작을 수 있습니다. 차원이 줄면
            성분당 정보량이 달라져 calibration 범위와 quantization error의 상대적
            영향도 달라지기 때문입니다.
          </p>
          <p>
            안전한 순서는 truncation 차원을 먼저 target retrieval metric으로 정하고,
            그 차원에서 quantization을 다시 검증하는 것입니다. 두 압축을 각각 다른
            벤치마크에서 검증한 수치를 그대로 곱하거나 더해 배포 판단에 쓰지 않아야
            합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          SBERT·DPR·Matryoshka 논문과 공식 문서가 이 글의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Siamese·triplet 구조로 재사용 가능한 sentence embedding을 학습한 것은
            Sentence-BERT 논문입니다. 이 논문 자체는 classification·regression 목적함수를
            썼고, 이 글이 다루는 in-batch negative InfoNCE objective는 그 이후 bi-encoder
            학습 실무에서 널리 쓰이게 된 형태입니다.
          </p>
          <p>
            질문 encoder와 passage encoder를 독립적으로 학습하는 asymmetric dual encoder와
            in-batch negative 학습은 DPR 논문의 설계입니다. Symmetric·asymmetric semantic
            search라는 용어 구분 자체는 sentence-transformers 공식 문서가 명시적으로 쓰는
            표현입니다.
          </p>
          <p>
            차원을 잘라도 성능이 크게 떨어지지 않는 nested loss는 Matryoshka Representation
            Learning 논문의 기여이고, query·passage 접두어로 하나의 encoder에 asymmetric
            역할을 나눠 맡기는 것은 E5 논문의 설계입니다. Int8 embedding quantization의
            저장·정확도 수치는 Hugging Face·Sentence Transformers의 공식 블로그에서
            가져왔습니다.
          </p>
          <p>
            이 글의 수치 예(배치 256·255 negative, 768→128차원, float32→int8 4배)는 두
            방법의 산수이며 특정 배포의 측정값이 아닙니다. Domain fine-tuning의 gain·
            general 하락 폭은 도메인·데이터·학습 규모에 따라 달라지므로 배포 전 직접
            재야 합니다.
          </p>
        </div>
        <div id="paper-sbert" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Reimers & Gurevych · Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks (EMNLP 2019)"
            citeKey={1}
            href="https://arxiv.org/abs/1908.10084"
          >
            Siamese·triplet BERT와 pooling으로 cosine 비교가 가능한 sentence embedding을
            학습한 원 논문입니다. 원 objective는 classification·regression이며, in-batch
            negative InfoNCE는 이 구조 위에 후속 실무가 추가한 것입니다.
          </CitationBlock>
        </div>
        <div id="paper-dpr" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Karpukhin et al. · Dense Passage Retrieval for Open-Domain Question Answering (EMNLP 2020)"
            citeKey={2}
            href="https://arxiv.org/abs/2004.04906"
          >
            질문 encoder와 passage encoder를 독립적으로 학습하는 asymmetric dual encoder와
            in-batch negative 학습으로 BM25보다 top-20 retrieval accuracy를 9~19%p 올렸습니다.
            결과는 저자가 실험한 open-domain QA 데이터셋 범위입니다.
          </CitationBlock>
        </div>
        <div id="paper-symmetric-search" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Sentence-Transformers 공식 문서 · Symmetric vs. Asymmetric Semantic Search"
            citeKey={3}
            href="https://www.sbert.net/examples/applications/semantic-search/README.html"
            type="code"
          >
            Query와 corpus 항목의 길이·내용이 비슷하면 symmetric, 짧은 질문과 긴 문단처럼
            다르면 asymmetric search라 부르고 각각 다른 사전학습 모델을 권장한다고
            명시합니다.
          </CitationBlock>
        </div>
        <div id="paper-matryoshka" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Kusupati et al. · Matryoshka Representation Learning (NeurIPS 2022)"
            citeKey={4}
            href="https://arxiv.org/abs/2205.13147"
          >
            Nested prefix마다 loss를 계산하는 MRL을 제안하고, ImageNet-1K 분류에서 동일
            정확도 기준 최대 14배 작은 embedding으로도 충분함을 보였습니다. 수치는 vision
            benchmark 기준 저자 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="paper-e5" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Wang et al. · Text Embeddings by Weakly-Supervised Contrastive Pre-training (E5)"
            citeKey={5}
            href="https://arxiv.org/abs/2212.03533"
          >
            Query:·passage: 접두어로 하나의 encoder에 asymmetric 역할을 나눠 맡기고
            in-batch negative contrastive pre-training으로 BEIR·MTEB 56개 데이터셋에서
            BM25를 zero-shot으로 넘었다고 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-quantization" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Shakir, Aarsen & Lee · Binary and Scalar Embedding Quantization (Hugging Face blog, 2024)"
            citeKey={6}
            href="https://huggingface.co/blog/embedding-quantization"
            type="code"
          >
            Float32→int8 quantization이 벡터당 저장량을 4배 줄이면서 rescoring 없이 최대
            99.3%, oversampling 후 재채점하면 약 99%의 성능을 유지한다고 보고합니다.
            Dimension collapse가 있는 모델은 손실이 더 크다고 밝힙니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글:{" "}
          <Link to="/ai/embedding-evaluation#metrics">Embedding evaluation의 Recall·NDCG</Link>
          , 그리고{" "}
          <Link to="/ai/embedding-serving-contract#index-artifact">
            embedding serving contract의 index generation
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
