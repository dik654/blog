import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import TermBreakdown from "@/components/articles/term-breakdown";

export default function HybridDepth() {
  return (
    <section id="hybrid-depth" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        단어 일치와 의미 검색은 다르게 실패하므로 후보를 넓게 합칩니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이 절은 위 과정의 앞 두 단계, 곧 후보가 어떻게 만들어지고 얼마나 넓게
          모이는지를 다룹니다. 단어 일치 검색과 의미 검색을 함께 쓰는 이유,
          이 앞단의 역할 이름, 첫 검색의 깊이와 재정렬기가 실제로 읽는 깊이가
          왜 다른지를 차례로 봅니다.
        </p>
        <p>
          두 검색 방식은 서로 반대 방향으로 실패합니다. 위에서 든 예시를
          이어가면, 코드 <code>XR-17B</code>처럼 흔치 않은 정확한 문자열은
          BM25가 정확한 단어 일치로 1위에 놓습니다. 반면 이 코드가 학습 데이터에
          드물게 등장했다면 밀집 벡터 인코더는 의미 공간에서 문자열을 잘 구분하지
          못해 순위가 밀릴 수 있습니다.
        </p>
        <p>
          반대 경우도 있습니다. “세션이 조기에 만료된다”라는 질의와 “로그인 유지
          시간이 짧다”라는 문서는 겹치는 단어가 없습니다. 이렇게 뜻은 같지만
          표현이 다른 문장에서는 BM25 점수가 0이 되어 후보 밖으로 빠질 수 있습니다.
          밀집 벡터 인코더는 의미 유사도로 두 문장을 가까이 놓아 1위를 줄 수
          있습니다. 어느 한쪽만 쓰면 한 종류의 정답을 구조적으로 놓칩니다.
        </p>
      </div>
      <TermBreakdown
        title="단어 일치와 의미 검색이 서로 보완하는 실패"
        description="같은 질의 두 종류를 두 방법에 각각 넣었을 때의 결과입니다."
        items={[
          {
            term: "BM25 · 단어 일치",
            description: "질의와 문서에 겹치는 단어를 바탕으로 순위를 매깁니다.",
            example: "식별자·코드·법 조항 번호처럼 철자가 고정된 질의에서 강합니다.",
            boundary: "겹치는 단어가 없는 바꿔 쓴 문장은 점수가 0이 되어 후보 밖으로 빠질 수 있습니다.",
          },
          {
            term: "HNSW · 의미 검색",
            description: "학습된 임베딩 공간의 거리로 순위를 매깁니다.",
            example: "표현이 다른 의미 유사 질의를 잘 연결합니다.",
            boundary: "학습 데이터에 드물게 등장한 식별자·고유명사는 벡터 공간에서 잘 구분되지 않을 수 있습니다.",
          },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          혼합 검색(hybrid retrieval)은 이 두 실패를 한 후보 집합으로 보완하는
          전략입니다. 두 검색을 각각 상위 k개까지 실행한 다음 결과를 합칩니다.
          가장 단순한 방법은 문서 ID 기준으로 중복을 지우는 후보 합집합입니다.
        </p>
        <p>
          예를 들어 sparse top-5가 {"{d1,d2,d3,d4,d5}"}이고 dense top-5가{" "}
          {"{d3,d6,d1,d7,d8}"}이면, 두 목록 모두에 있는 d1과 d3를 한 번만
          세어 union은 문서 8개가 됩니다. 크기는 5+5=10을 넘지 않고 겹친
          문서 수만큼 그보다 작아지며, 이 단계에는 아직 순서가 없습니다.
        </p>
        <p>
          이 합집합에는 아직 순서가 없습니다. 무엇을 후보에 넣을지는 합집합이,
          어떤 순서로 읽을지는 위에서 본 RRF가 정합니다.
        </p>

        <h3 id="candidate-generation" className="scroll-mt-20">
          후보 생성은 어떤 검색기를 쓰더라도 같은 역할을 가리킵니다
        </h3>
        <p>
          BM25든 HNSW든 혼합 합집합이든, 재정렬기에 넘길 후보를 만드는 앞단을
          1차 검색기(first-stage retriever)라고 합니다. 그 산출물을 만드는
          과정이 후보 생성(candidate generation)입니다. 이 이름은{" "}
          <Link to="/cs/ai/bi-encoder-retrieval#reranking">
            retrieve-then-rerank 2-stage composition
          </Link>
          의 첫 단계를 가리킬 뿐, 단어 일치·의미·혼합 검색 가운데 무엇을
          써야 하는지는 지정하지 않습니다.
        </p>

        <h3 id="top-k-depth" className="scroll-mt-20">
          첫 검색 깊이와 재정렬 범위는 서로 다른 예산입니다
        </h3>
        <p>
          First-stage retriever가 후보로 인정하는 깊이를 top-k retrieval이라고 합니다. reranker가 그 후보 가운데 실제로 다시 채점하는 깊이는 그보다
          얕습니다. 이쪽을 rerank depth라고 합니다. 흔한 조합은 top-k retrieval k1=100으로 넓게 모은 뒤 rerank depth k2=10만 cross-
          encoder에 넣는 방식입니다.
        </p>
      </div>
      <ExplainedFormula
        question="Rerank depth를 top-k retrieval보다 작게 자르면 candidate recall 상한이 왜 한 번 더 줄어드나요?"
        idea={<>위에서 본 candidate recall 상한은 candidate set 전체 크기를 기준으로 했습니다. Reranker가 실제로 읽는 범위를 그보다 작은 rerank depth로 자르면, 그 창 밖에 있던 정답은 reranker 품질과 무관하게 이미 제외된 상태입니다.</>}
        formula={String.raw`C_q^{(k_2)}=\operatorname{front}_{k_2}(C_q),\qquad |O_q\cap R_q|\le|C_q^{(k_2)}\cap R_q|\le|C_q\cap R_q|`}
        annotatedFormula={String.raw`\underbrace{C_q^{(k_2)}=\operatorname{front}_{k_2}(C_q)}_{\text{reranker가 실제로 읽는 상위 }k_2\text{개}},\qquad |O_q\cap R_q|\le \underbrace{|C_q^{(k_2)}\cap R_q|}_{\text{그 창 안의 정답 수}}\le|C_q\cap R_q|`}
        operations={[
          { expression: String.raw`C_q^{(k_2)}=\operatorname{front}_{k_2}(C_q)`, annotation: ["Fusion이 정한 순서에서 상위 k2개만 잘라", "reranker 입력 창을 만듭니다."] },
          { expression: String.raw`|C_q^{(k_2)}\cap R_q|\le|C_q\cap R_q|`, annotation: ["더 좁은 창 안의 정답 수는", "candidate 전체 안의 정답 수를 넘을 수 없습니다."] },
        ]}
        terms={[
          { symbol: "k_1", name: "top-k retrieval", description: "First-stage retriever가 후보로 인정하는 깊이입니다." },
          { symbol: "k_2", name: "rerank depth", description: "Reranker가 실제로 다시 채점하는 더 얕은 깊이입니다(k2 ≤ k1)." },
          { symbol: "C_q^{(k_2)}", name: "rerank window", description: "Fusion 순서 상위 k2개로 자른 candidate 부분집합입니다." },
        ]}
        assumptions={["Fusion(RRF 등)이 candidate 안의 순서를 이미 정했다고 가정합니다.", "Rerank depth를 늘리면 비용은 늘고 상한은 top-k retrieval 상한에 가까워집니다.", "k2=k1이면 이 식은 위 candidate recall ceiling과 같아집니다."]}
        interpretation="Candidate 100개 가운데 정답 문서가 fusion 순위 3·7·45·92에 있다고 하면, rerank depth를 10으로 두면 순위 3과 7만 창 안에 들어와 상한이 4에서 2로 줄어듭니다. 45와 92에 있는 정답은 reranker가 아무리 정확해도 볼 기회조차 얻지 못합니다."
      />
    </section>
  );
}
