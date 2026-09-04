import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import QueryTransformationAndAdaptiveRetrievalViz from "./query-transformation-and-adaptive-retrieval/viz/QueryTransformationAndAdaptiveRetrievalViz";

/**
 * Query 변환과 적응형 검색: rewriting·HyDE·Self-RAG·CRAG
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function QueryTransformationAndAdaptiveRetrievalArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Query rewriting 은 검색어와 검색 대상의 어휘 차이를 메웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사용자가 쓰는 말과 knowledge base 에 저장된 문서의 말이 다르면 아무리 좋은 index 도 관련 chunk 를 찾지 못합니다. Query transformation
            은 검색을 걸기 전에 질문 자체를 바꿔 이 어휘 차이를 메우는 넓은 범주입니다. 그 안에서 가장 단순한 형태가 query rewriting 과 query expansion
            입니다.
          </p>
          <p>
            Query rewriting 은 질문의 표현을 검색에 유리하게 다시 쓰는 쪽이고 query expansion 은 원 질문에 동의어·관련어를 더해 검색 범위를 넓히는 쪽입니다.
            예를 들어 "그거 왜 안 되지"라는 질문은 이전 대화의 맥락 없이는 어떤 chunk 와도 어휘가 겹치지 않습니다. "PDF 업로드가 500 에러로 실패하는 이유"로
            rewriting 하면 관련 chunk 의 용어와 겹칩니다.
          </p>
          <p>
            이 글은 rewriting·expansion 에서 출발합니다. 여러 질의로 늘리는 방법(multi-query· decomposition), 가상의 답변으로 검색하는
            방법(HyDE), 질문을 추상화하는 방법 (step-back), 그리고 검색을 언제 실행하고 언제 반복할지 스스로 판정하는 방법(adaptive retrieval, Self-
            RAG, CRAG)까지 순서대로 다룹니다.
          </p>
        </div>
        <QueryTransformationAndAdaptiveRetrievalViz />
        <ContentBoundary article="query-transformation-and-adaptive-retrieval" />
      </section>

      <section id="multi-query" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Multi-query 는 변형 질의를 합쳐 recall 을 끌어올립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Multi-query retrieval 은 원 질문 하나를 LLM 으로 여러 개의 변형 질의로 늘려 각각 따로 검색한 뒤 그 결과를 합쳐 쓰는 방법입니다. 질문 하나로는 놓치는
            관련 문서를 다른 표현의 질의가 잡아낼 수 있다는 것이 전제입니다.
          </p>
          <p>
            가정: 정답 근거 문서가 6 개 있는 질문에서 원 질의는 top-k 안에 2 개만 회수해 recall 이 33 % 입니다. 표현을 바꾼 변형 질의 세 개를 더 만들어 각각
            검색하면 변형마다 새로 잡아내는 문서가 있어 합집합 recall 이 5/6, 83 % 까지 오릅니다.
          </p>
        </div>
        <ExplainedFormula
          question="변형 질의 여러 개의 검색 결과를 합치면 recall 이 왜 원 질의보다 높아질까요?"
          idea="각 변형 질의가 서로 다른 관련 문서를 회수한다면, 그 결과의 합집합은 어느 한 질의보다 항상 같거나 더 많은 관련 문서를 담습니다."
          formula={String.raw`R_{\cup}=\frac{\left|\left(\bigcup_{i=1}^{m} K_i\right)\cap A\right|}{|A|}`}
          annotatedFormula={String.raw`R_{\cup}=\underbrace{\frac{\left|\left(\bigcup_{i=1}^{m} K_i\right)\cap A\right|}{|A|}}_{\text{합집합이 회수한 정답 비율}}`}
          operations={[
            { expression: String.raw`\bigcup_{i=1}^{m} K_i`, annotation: ["원 질의를 포함한 m 개 변형 질의가", "각각 회수한 후보 집합을 모두 합침"] },
            { expression: String.raw`\left(\cdot\right)\cap A`, annotation: ["그 합집합과 실제 정답 근거 집합 A 의", "교집합만 남겨 회수된 정답만 셈"] },
            { expression: String.raw`\frac{\cdot}{|A|}`, annotation: ["정답 근거 전체 개수로 나눠", "0 과 1 사이의 recall 비율로 정규화"] },
          ]}
          terms={[
            { symbol: "A", name: "정답 근거 집합", description: "질문에 실제로 답이 되는 문서(또는 chunk) 전체입니다." },
            { symbol: "K_i", name: "i 번째 질의의 회수 결과", description: "i 번째 변형 질의로 검색해 얻은 top-k 후보 집합입니다." },
            { symbol: "m", name: "변형 질의 개수", description: "원 질의를 포함해 만든 질의 변형의 총 개수입니다." },
            { symbol: String.raw`R_{\cup}`, name: "합집합 recall", description: "m 개 질의 결과를 합쳤을 때의 recall 입니다." },
          ]}
          assumptions={[
            "각 질의를 독립적으로 검색한 뒤 결과만 합친다고 가정하며, rank 순서 자체의 재정렬(fusion)은 다루지 않습니다.",
            "변형 질의가 원 질의와 겹치지 않는 새 관련 문서를 최소 하나는 회수해야 recall 이 실제로 오릅니다.",
          ]}
          interpretation="변형이 서로 다른 문서를 회수할수록 합집합 recall 이 오르지만, 변형끼리 같은 문서만 반복해서 회수하면 질의 개수를 늘려도 recall 은 그대로입니다. 늘어난 질의 수만큼 검색 비용도 함께 늘어납니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Query decomposition 은 방향이 조금 다릅니다. 질문 자체가 여러 하위 질문으로 쪼개지는 복합 질문일 때 "A 이면서 B 인 것"을 "A 인 것은 무엇인가"와
            "그중 B 인 것은 무엇인가"라는 subquestion 으로 나눠 각각 검색·답변한 뒤 결합합니다. 이 패턴을 subquestion retrieval 이라고 부릅니다.
          </p>
        </div>
        <TermBreakdown
          title="변형을 늘리는 두 방향"
          items={[
            { term: "Multi-query retrieval", description: "원 질의를 표현이 다른 여러 질의로 늘려 각각 검색하고 결과를 합칩니다.", example: "같은 질문을 세 가지 표현으로 바꿔 검색.", boundary: "변형이 서로 다른 문서를 회수하지 못하면 recall 개선 없이 비용만 늡니다." },
            { term: "Query decomposition · subquestion retrieval", description: "복합 질문을 더 단순한 subquestion 여러 개로 나눠 각각 답한 뒤 결합합니다.", example: "\"A 이면서 B 인 것\"을 A 먼저, 그중 B 를 나중에 확인.", boundary: "Subquestion 사이에 순서 의존이 있으면 앞 단계 오류가 뒤로 그대로 전파됩니다." },
          ]}
        />
      </section>

      <section id="hyde" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          HyDE 는 가상의 답변 문서를 만들어 그 embedding 으로 검색합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            HyDE(Hypothetical Document Embeddings) 는 질문을 그대로 embedding 하지 않습니다. LLM 이 그 질문에 대한 그럴듯한 답변 문서를 먼저
            생성하고 그 가상 문서를 embedding 해 검색 질의로 씁니다. 실제 정답 문서나 사람이 매긴 relevance label 은 필요 없습니다.
          </p>
          <p>
            이 가상 문서는 세부 사실이 틀릴 수 있습니다. HyDE 는 그 오류를 dense retriever 의 embedding 이 걸러낼 것이라고 가정합니다. Encoder 가 관련
            문서들을 가까운 좌표로 모아 두는 공간이라면 사실이 조금 틀린 가상 문서도 진짜 관련 문서와 비슷한 방향에 놓이기 때문입니다.
          </p>
          <p>
            HyDE 논문은 비지도 dense retriever 인 Contriever 를 baseline 으로 둡니다. 그 위에서 web 검색· 질의응답·사실 검증 등 여러 task 와
            스와힐리어·한국어·일본어를 포함한 여러 언어에서 HyDE 가 Contriever 를 크게 앞서고 지도학습으로 미세조정한 retriever 에 견줄 만한 성능을 보였다고
            보고합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="HyDE 는 항상 query rewriting 보다 나은가요?"
          preview="아닙니다. HyDE 는 relevance label 이 없는 상황을 겨냥한 방법이고, label 이 있으면 지도학습 retriever 나 단순 rewriting 이 더 저렴하게 비슷한 효과를 낼 수 있습니다."
        >
          <p>
            HyDE 는 매 질문마다 LLM 호출로 문서를 생성해야 해서 rewriting 보다 지연시간과 비용이
            큽니다. 논문도 지도학습 retriever 에 "견줄 만하다"고 표현했을 뿐, 모든 상황에서 더
            낫다고 주장하지는 않습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="step-back" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Step-back prompting 은 질문을 상위 개념으로 추상화해 검색합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Step-back prompting 은 구체적인 질문을 그대로 검색하지 않습니다. 먼저 LLM 에 묻는 것은 그 질문이 속한 더 일반적인 원리나 배경 질문(step-back
            question)입니다. 그 답을 원 질문과 함께 배경 지식으로 제공한 뒤에야 최종 답을 생성합니다.
          </p>
          <p>
            가정: "1990 년부터 2000 년 사이 특정 압력에서 어떤 기체의 부피는 어떻게 변했는가"라는
            구체적 질문을 그대로 검색하면 그 정확한 조건과 일치하는 문서를 찾기 어렵습니다.
            Step-back 질문 "압력과 기체 부피의 관계를 설명하는 물리 법칙은 무엇인가"로 바꾸면
            훨씬 일반적인 문서(이상 기체 법칙 설명)와 어휘가 겹칩니다.
          </p>
          <p>
            Step-back prompting 논문은 PaLM-2L 모델로 MMLU 물리 +7 %p, MMLU 화학 +11 %p, 시간
            추론 benchmark TimeQA +27 %p, multi-hop 추론 benchmark MuSiQue +7 %p 의 개선을
            보고합니다. GPT-4, Llama2-70B 에서도 같은 방향의 개선이 나타났다고 밝힙니다.
          </p>
        </div>
        <TermBreakdown
          title="Step-back 질문과 원 질문의 역할"
          items={[
            { term: "Step-back question", description: "원 질문이 속한 더 일반적인 개념·원리를 묻는 질문입니다.", example: "\"압력과 기체 부피의 관계를 설명하는 법칙은?\"", boundary: "지나치게 추상화하면 원 질문에 필요한 구체 조건과 무관한 문서만 찾을 수 있습니다." },
            { term: "원 질문(구체 질문)", description: "step-back 답변을 배경 지식 삼아 최종적으로 답해야 하는 질문입니다.", example: "\"1990~2000 년 특정 압력에서 기체 부피 변화는?\"", boundary: "Step-back 답변만으로는 원 질문의 구체적 수치까지 답할 수 없어 원 질문의 검색도 함께 필요합니다." },
          ]}
        />
      </section>

      <section id="adaptive-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Adaptive retrieval 은 검색 전에 필요한지부터 판정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            지금까지 다룬 방법들은 모두 "어떻게 검색할지"를 다뤘습니다. Adaptive retrieval 은 그 전에 "지금 검색이 필요한가"부터 판정합니다. 이 판정 지점을
            retrieval trigger 라고 부릅니다. 이미 가진 정보로 답할 수 있는 질문에는 검색을 걸지 않아 지연시간과 비용을 아낍니다.
          </p>
          <p>
            회수한 근거가 부족하면 질의를 rewriting·decomposition· HyDE·step-back 중 하나로 바꿔 다시 검색합니다. 이렇게 검색을 한 번으로 끝내지 않는
            과정을 iterative retrieval loop 라고 합니다. 이 반복은 충분성 판정을 통과하거나 정해 둔 최대 반복 횟수에 이르러야 끝납니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Adaptive retrieval loop: 판정부터 종료까지"
          input={[
            "사용자 질문 q",
            "검색 함수 retrieve(query)",
            "충분성 판정 함수 sufficient(context)",
            "질의 변환 함수(rewrite · decompose · HyDE · step-back 중 선택)",
            "최대 반복 횟수 max_iter",
          ]}
          steps={[
            { code: "if not sufficient(known_context(q)): context = retrieve(q)", note: "지금 가진 정보로 답할 수 있으면 검색을 아예 걸지 않습니다." },
            { code: "iter = 0", note: "반복 횟수를 0 으로 시작합니다." },
            { code: "while not sufficient(context) and iter < max_iter:", note: "회수한 근거가 부족하고 최대 반복에 못 미쳤으면 계속 반복합니다." },
            { code: "  q' = transform(q, context)", note: "부족한 부분을 겨냥해 질의를 rewriting·decomposition·HyDE·step-back 중 하나로 바꿉니다." },
            { code: "  context = context ∪ retrieve(q')", note: "새 질의로 다시 검색해 이전 context 에 더합니다." },
            { code: "  iter += 1", note: "반복 횟수를 늘립니다." },
          ]}
          output="충분성 판정을 통과했거나 max_iter 에 도달한 context — 이 context 로 최종 답을 생성합니다"
          repeatUntil="sufficient(context) 이거나 iter == max_iter"
        />
      </section>

      <section id="self-rag-crag" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Self-RAG 와 CRAG 는 서로 다른 지점에서 검색 품질을 판정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Self-RAG 는 이 판정을 언어 모델 자신의 생성 과정 안에 넣습니다. CRAG 는 반대로 언어 모델 바깥에 가벼운 evaluator 를 하나 더 둬 검색 결과의 품질을
            따로 판정합니다. 두 방법 모두 adaptive retrieval trigger 의 구체적인 구현입니다.
          </p>
          <p>
            Self-RAG 는 생성 중에 특수 token 네 개를 함께 예측합니다. Retrieve 는 지금 검색이
            필요한지(yes·no·continue)를, IsRel 은 회수한 문서가 관련 있는지(relevant·irrelevant)를,
            IsSup 은 생성한 문장이 그 문서로 뒷받침되는지(fully·partially·no support)를, IsUse 는
            응답 전체의 유용성을 1~5 점으로 매깁니다.
          </p>
          <p>
            Self-RAG 논문은 7B·13B 모델로 PopQA 정확도 54.9 %·55.8 % 를 보고합니다. 같은 benchmark 에서 ChatGPT 의 29.3 %,
            Llama2-chat 13B 의 20.0 % 를 크게 앞서는 수치입니다. PubHealth 에서도 72.4 %·74.5 % 로 ChatGPT 의 70.1 % 를 앞섭니다.
          </p>
          <p>
            다만 모든 benchmark 에서 이기지는 않습니다. ARC-Challenge 에서는 Self-RAG 13B 가 73.1 % 로 ChatGPT 의 75.3 % 에 못 미칩니다.
            검색 근거가 필요한 task 에서는 강하지만 순수 추론에 가까운 task 에서는 검색 자체가 크게 도움이 되지 않을 수 있다는 뜻입니다.
          </p>
        </div>
        <ExplainedFormula
          question="CRAG 의 evaluator 는 검색 결과를 어떤 기준으로 세 범주로 나눌까요?"
          idea="회수한 문서마다 confidence 점수를 매기고, 그 최댓값을 미리 정한 두 임계값과 비교해 Correct·Ambiguous·Incorrect 세 구간 중 하나로 판정합니다."
          formula={String.raw`\text{category}=\begin{cases}\text{Correct}&\max_i c_i > \tau_{u}\\ \text{Ambiguous}&\tau_{l}\le \max_i c_i \le \tau_{u}\\ \text{Incorrect}&\max_i c_i < \tau_{l}\end{cases}`}
          annotatedFormula={String.raw`\text{category}=\begin{cases}\text{Correct}&\underbrace{\max_i c_i > \tau_{u}}_{\text{가장 확신 있는 문서가 상한 초과}}\\ \text{Ambiguous}&\underbrace{\tau_{l}\le \max_i c_i \le \tau_{u}}_{\text{두 임계값 사이}}\\ \text{Incorrect}&\underbrace{\max_i c_i < \tau_{l}}_{\text{모든 문서가 하한 미만}}\end{cases}`}
          operations={[
            { expression: String.raw`\max_i c_i`, annotation: ["회수한 문서 각각의 confidence 중", "가장 높은 값 하나만 대표로 씀"] },
            { expression: String.raw`\max_i c_i > \tau_{u}`, annotation: ["그 값이 상한 threshold 를 넘으면", "Correct — 지식 정제 절차로 진행"] },
            { expression: String.raw`\max_i c_i < \tau_{l}`, annotation: ["그 값이 하한 threshold 에도 못 미치면", "Incorrect — 버리고 web search 로 대체"] },
          ]}
          terms={[
            { symbol: "c_i", name: "문서 i 의 confidence", description: "evaluator 가 문서마다 매긴 관련성 점수입니다." },
            { symbol: String.raw`\tau_{u}, \tau_{l}`, name: "상한·하한 threshold", description: "Correct·Ambiguous·Incorrect 를 가르는 두 기준값입니다." },
          ]}
          assumptions={[
            "Threshold 두 값은 검증 데이터로 미리 정해 둔다는 전제이며 이 글은 그 값을 정하는 절차는 다루지 않습니다.",
            "Ambiguous 판정은 internal 지식 정제와 web search 결과를 함께 쓰는 절차로 이어집니다.",
          ]}
          interpretation="Correct 는 문서를 조각내 관련 부분만 남기는 정제로, Incorrect 는 그 결과를 버리고 web search 로, Ambiguous 는 둘 다 써서 다음 단계로 넘깁니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            CRAG 논문은 baseline RAG 와 비교해 PopQA 정확도를 50.5 %에서 54.9 %로, PubHealth 를
            48.9 %에서 59.5 %로, ARC-Challenge 를 43.4 %에서 53.7 %로 끌어올렸다고 보고합니다.
            Self-RAG 위에 CRAG 의 evaluator 를 얹은 조합도 PopQA 를 54.9 %에서 61.8 %로 개선했습니다.
          </p>
          <p>
            다만 ARC-Challenge 에서는 Self-RAG 13B 의 67.3 %와 Self-RAG+CRAG 조합의 67.2 %가 거의
            같습니다. Evaluator 를 더한다고 모든 benchmark 에서 항상 개선이 따라오지는 않는다는
            뜻입니다.
          </p>
        </div>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 다섯 논문의 실측 수치와 공식 결과입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            HyDE·Self-RAG·CRAG·Step-Back Prompting 은 각 방법을 처음 제시한 논문에서, query
            decomposition 의 일반 원리는 Least-to-Most Prompting 논문에서 근거를 가져왔습니다.
          </p>
        </div>
        <div id="paper-hyde" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gao et al. · Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE, ACL 2023)"
            citeKey={1}
            href="https://arxiv.org/abs/2212.10496"
          >
            질문에 대한 가상의 답변 문서를 LLM 으로 생성하고 그 문서를 비지도 dense retriever 로
            embedding 해 검색 질의로 쓰는 HyDE 를 제시합니다. Web 검색·QA·사실 검증 등 여러 task 와
            여러 언어에서 Contriever 를 크게 앞서고 지도학습 retriever 에 견줄 만한 성능을 보였다고
            보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-selfrag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Asai et al. · Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (ICLR 2024)"
            citeKey={2}
            href="https://arxiv.org/abs/2310.11511"
          >
            Retrieve·IsRel·IsSup·IsUse 네 reflection token 으로 검색 여부와 근거 품질을 생성
            과정 안에서 스스로 판정하는 방법을 제시합니다. 7B·13B 모델이 PopQA·PubHealth 등에서
            ChatGPT 와 검색 결합 Llama2-chat 을 앞서지만 ARC-Challenge 에서는 ChatGPT 에 못
            미친다고 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-crag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yan et al. · Corrective Retrieval Augmented Generation (CRAG, 2024)"
            citeKey={3}
            href="https://arxiv.org/abs/2401.15884"
          >
            가벼운 evaluator 로 회수한 문서의 confidence 를 매겨 Correct·Ambiguous·Incorrect 로
            나누고, 각각 지식 정제·정제+web search·web search 로 대응하는 방법을 제시합니다. 네
            데이터셋에서 baseline RAG 와 Self-RAG 위에 얹었을 때 모두 정확도가 올랐다고 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-stepback" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zheng et al. · Take a Step Back: Evoking Reasoning via Abstraction (Step-Back Prompting, ICLR 2024)"
            citeKey={4}
            href="https://arxiv.org/abs/2310.06117"
          >
            구체적인 질문 대신 그 질문이 속한 상위 개념을 먼저 묻는 step-back 질문으로 배경 지식을
            얻은 뒤 원 질문에 답하는 방법을 제시합니다. PaLM-2L 로 MMLU 물리 +7 %p, 화학 +11 %p,
            TimeQA +27 %p, MuSiQue +7 %p 개선을 보고하며 GPT-4·Llama2-70B 에서도 같은 방향을
            확인합니다.
          </CitationBlock>
        </div>
        <div id="paper-least-to-most" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhou et al. · Least-to-Most Prompting Enables Complex Reasoning in Large Language Models (ICLR 2023)"
            citeKey={5}
            href="https://arxiv.org/abs/2205.10625"
          >
            복잡한 문제를 더 단순한 subproblem 순서로 나눠 앞선 답을 다음 단계에 쓰는 방법을
            제시합니다. Compositional generalization benchmark SCAN 에서 예시 14 개만으로 99 %
            이상의 정확도를 보여 chain-of-thought 의 16 % 를 크게 앞선다고 보고합니다. 이 원리를
            검색에 적용한 것이 query decomposition 이며, SCAN 수치 자체는 검색 평가가 아니라
            추론 평가 결과입니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Chunk 를 어떻게 만들지는{" "}
          <Link to="/ai/rag-ingestion-and-chunking#chunking">RAG ingestion 글</Link>이 정본이고,
          검색 후보를 정렬·재정렬하는 계산은{" "}
          <Link to="/ai/retrieval-ranking-funnel#retrieval">Retrieval ranking funnel 글</Link>이
          정본입니다.
        </p>
      </section>
    </div>
  );
}
