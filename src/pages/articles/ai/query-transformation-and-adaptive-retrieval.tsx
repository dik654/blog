import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  QueryTransformationLocator,
  QueryTransformationReturn,
} from "./query-transformation-and-adaptive-retrieval/QueryTransformationLocator";
import QueryTransformationAndAdaptiveRetrievalViz from "./query-transformation-and-adaptive-retrieval/viz/QueryTransformationAndAdaptiveRetrievalViz";
import {
  CragThresholdViz,
  DecisionOwnerViz,
  TransformationChoiceViz,
} from "./query-transformation-and-adaptive-retrieval/viz/RetrievalDecisionViz";

export default function QueryTransformationAndAdaptiveRetrievalArticle() {
  return (
    <div className="space-y-16">
      <header id="problem" className="scroll-mt-20">
        <QueryTransformationLocator />
        <QueryTransformationAndAdaptiveRetrievalViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            첫 검색이 부족할 때는 검색을 무작정 반복하지 않습니다. 먼저 질문에서
            빠진 대상과 요구를 찾아내고, 그 실패 원인에 맞게 질문을 바꾼 뒤,
            필요한 주장마다 근거가 모였는지 다시 확인합니다. 근거가 충분하거나
            미리 정한 반복 한도에 닿으면 멈추되, 두 종료 이유를 서로 다르게
            기록해야 합니다.
          </p>
          <p>
            이 글은 앞 글에서 사용한 tenant-a의 요청 흐름을 이어 갑니다. q-732의
            원문은 “그거 자꾸 풀려”이고, 직전 대화에는 XR-17B 모바일 앱이
            등장했습니다. 설명용 목표는 로그인 유지 설정과 그 설정을 늘렸을 때의
            보안 영향, 두 주장에 각각 근거를 찾는 것입니다.
          </p>
          <p>
            앞 단계의 후보 생성·순위 결합·재정렬 계산은{" "}
            <Link to="/cs/ai/retrieval-ranking-funnel#retrieval">
              검색과 재정렬 글
            </Link>
            이 맡습니다. 여기서는 검색기에 넣을 질문과 재검색 여부가 어떻게
            바뀌는지만 추적합니다.
          </p>
        </div>
        <ContentBoundary article="query-transformation-and-adaptive-retrieval" />
      </header>

      <section id="multi-query" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          첫 실패의 모양이 질문을 바꾸는 방법을 정합니다
        </h2>
        <TransformationChoiceViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            q-732에는 검색 대상이 생략됐고 질문도 두 갈래입니다. 그래서 먼저
            “XR-17B 앱 로그인 유지”로 표현을 다시 쓰고, 설정 위치와 보안 영향을
            묻는 두 하위 질문으로 나눕니다. 첫 동작은{" "}
            <strong>질의 재작성(query rewriting)</strong>, 두 번째 동작은{" "}
            <strong>질의 분해(query decomposition)</strong>입니다.
          </p>
          <p>
            같은 뜻을 여러 표현으로 바꿔 동시에 검색하는{" "}
            <strong>다중 질의 검색(multi-query retrieval)</strong>은 다른
            선택입니다. “세션 만료”, “로그인 유지”, “인증 지속 시간”처럼 어휘가
            달라 정답 후보가 빠질 때 도움이 될 수 있습니다. 반면 여러 질의가
            같은 문서만 되풀이해 찾으면 검색 비용만 늘고 회수율은 그대로입니다.
          </p>
          <p>
            설명용 정답 근거 집합을 A={"{d-17, d-04}"}라고 두겠습니다. 원문
            검색은 두 문서를 모두 놓쳤지만, 다시 쓴 두 질문의 결과를 합치면 두
            문서가 모두 남습니다. 이때의 회수율은 사후 평가용 값입니다. 실제
            요청을 처리하는 동안에는 정답 집합 A를 미리 알 수 없으므로 별도의
            충분성 판정이 필요합니다.
          </p>
        </div>
        <ExplainedFormula
          question="여러 질문의 검색 결과를 합쳤을 때 정답 근거를 얼마나 회수했는지 어떻게 계산할까요?"
          idea="질문별 후보를 먼저 합친 뒤, 사후에 알고 있는 정답 근거 집합과 겹치는 문서 수를 셉니다."
          formula={String.raw`\begin{aligned}K_{\cup}&=\bigcup_{i=1}^{m}K_i\\R_{\cup}&=\frac{|K_{\cup}\cap A|}{|A|}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{K_{\cup}}_{\text{모든 질문의 후보}}&=\underbrace{\bigcup_{i=1}^{m}K_i}_{\text{질문별 결과를 합침}}\\\underbrace{R_{\cup}}_{\text{합집합 회수율}}&=\underbrace{\frac{|K_{\cup}\cap A|}{|A|}}_{\text{정답 근거 중 회수한 비율}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\bigcup_{i=1}^{m}K_i`,
              annotation: [
                "m개 질문이 회수한 후보 집합을",
                "중복을 제거하며 하나로 합칩니다.",
              ],
            },
            {
              expression: String.raw`K_{\cup}\cap A`,
              annotation: [
                "합친 후보와 정답 근거 집합이",
                "동시에 포함한 문서만 남깁니다.",
              ],
            },
            {
              expression: String.raw`\frac{|K_{\cup}\cap A|}{|A|}`,
              annotation: [
                "회수한 정답 문서 수를",
                "전체 정답 문서 수로 나눕니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "K_i",
              name: "i번째 질문의 후보",
              description: "각 질문으로 검색해 얻은 문서 ID 집합입니다.",
            },
            {
              symbol: "A",
              name: "정답 근거 집합",
              description:
                "평가 데이터에서 질문을 뒷받침한다고 미리 판정한 문서 집합입니다.",
            },
            {
              symbol: String.raw`R_{\cup}`,
              name: "합집합 회수율",
              description:
                "모든 질문의 후보를 합쳤을 때 정답 근거가 남은 비율입니다.",
            },
          ]}
          assumptions={[
            "q-732의 정답 근거가 d-17·d-04 두 건이라는 설명용 평가 집합을 사용합니다.",
            "이 식은 오프라인 회수율을 계산합니다. 운영 중인 판정기가 정답을 안다는 뜻은 아닙니다.",
          ]}
          interpretation="이 예에서는 원문 검색의 회수율이 0/2이고, 두 하위 질문의 합집합은 2/2입니다. 후보가 늘어난 만큼 재정렬 비용과 중복 제거 비용도 함께 계산해야 합니다."
        />
        <TermBreakdown
          title="비슷해 보이는 세 동작의 경계"
          items={[
            {
              term: "질의 재작성 · Query rewriting",
              description:
                "생략된 대상이나 대화 맥락을 반영해 하나의 질문을 검색 가능한 문장으로 다시 씁니다.",
              example:
                "“그거 자꾸 풀려”를 “XR-17B 앱 로그인 유지 설정”으로 바꿉니다.",
              boundary:
                "대화에 없는 제품명이나 조건을 새로 만들어 넣으면 검색 오류가 아니라 질문 왜곡이 됩니다.",
            },
            {
              term: "다중 질의 검색 · Multi-query retrieval",
              description:
                "같은 의도를 표현이 다른 여러 질문으로 바꿔 병렬 검색하고 후보를 합칩니다.",
              example:
                "“세션 만료”, “인증 지속 시간”, “로그인 유지”를 각각 검색합니다.",
              boundary:
                "변형들이 같은 후보만 찾으면 회수율은 오르지 않고 호출 수만 늘어납니다.",
            },
            {
              term: "질의 분해 · Query decomposition",
              description:
                "서로 다른 답이 필요한 복합 질문을 하위 질문으로 나누고 각각의 근거를 찾습니다.",
              example:
                "설정 위치와 보안 영향을 q-732a·q-732b로 나눕니다.",
              boundary:
                "앞 하위 질문의 답을 다음 질문에 섞으면 첫 오류가 뒤 단계로 전파될 수 있습니다.",
            },
          ]}
        />
      </section>

      <section id="hyde" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          관련성 표본이 없을 때는 답과 비슷한 문장을 먼저 만들 수 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            질문이 짧아 실제 문서의 문체와 너무 다르면 단어를 조금 바꾸는 것만으로
            부족할 수 있습니다. 이때 언어 모델이 그럴듯한 답변 문서를 먼저 쓰고,
            그 문서의 벡터와 가까운 실제 문서를 찾는 방법이{" "}
            <strong>가상 문서 임베딩(HyDE)</strong>입니다.
          </p>
          <p>
            순서는 질문 → 가상 답변 → 가상 답변의 임베딩 → 실제 문서 검색입니다.
            저자들은 가상 답변에 잘못된 세부 내용이 들어갈 수 있음을 인정하고,
            비지도 대조학습 인코더의 좁은 벡터 표현이 관련성 방향은 남기고 틀린
            세부를 약화한다고 설명합니다. 이는 사실 검증 장치가 아니라 검색
            이웃을 찾기 위한 가정입니다.
          </p>
          <p>
            q-732는 대화 맥락과 두 요구가 명확하므로 HyDE를 선택하지 않았습니다.
            매 요청마다 가상 문서를 생성하면 언어 모델 호출 지연과 비용이 추가되기
            때문입니다. 관련성 라벨이 없고 짧은 질의가 문서 문체와 크게 어긋나는
            평가 집합에서 단순 재작성과 비교해 채택 여부를 판단해야 합니다.
          </p>
        </div>
        <ProgressiveDetail
          title="가상 문서에 틀린 사실이 들어가도 괜찮은가요?"
          preview="검색용 벡터를 만드는 데 쓸 수는 있지만, 그 문장을 근거로 답해서는 안 됩니다. 최종 답은 회수한 실제 문서로 다시 검증해야 합니다."
        >
          <p>
            HyDE 논문은 관련성 라벨이 없는 zero-shot dense retrieval을 대상으로
            합니다. 저자 실험에서는 Contriever보다 나았고 여러 과제·언어에서
            미세조정 검색기와 견줄 만한 결과를 보고했지만, 모든 도메인에서 더
            정확하거나 더 저렴하다는 뜻은 아닙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="step-back" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          구체 조건만 되풀이할 때는 먼저 적용할 원리를 묻습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            질문에 숫자와 고유명사가 많아 일반 원리를 놓친다면, 한 단계 물러나
            상위 개념을 먼저 묻고 그 답을 원 질문의 배경으로 쓸 수 있습니다. 이를{" "}
            <strong>한 단계 물러서기 프롬프팅(step-back prompting)</strong>이라고
            합니다.
          </p>
          <p>
            중요한 경계가 있습니다. 원 논문은 물리·화학·시간 질의·다중 단계
            추론에서 이 프롬프팅이 추론을 개선하는지 평가했습니다. 검색 회수율을
            검증한 논문은 아닙니다. RAG에서는 “세션 시간을 늘리면 어떤 보안 원리가
            달라지는가?”처럼 상위 질문을 검색어로 쓰는 응용이 가능하지만, 그 효과는
            별도의 검색 실험으로 확인해야 합니다.
          </p>
          <p>
            논문 초록은 PaLM-2L에서 MMLU 물리 7%p, 화학 11%p, TimeQA 27%p,
            MuSiQue 7%p 개선을 저자 결과로 보고합니다. 이 수치는 추론 과제의
            결과이며 q-732의 검색 성능이나 작은 모델의 성능을 보장하지 않습니다.
          </p>
        </div>
      </section>

      <section id="adaptive-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          재검색은 충분함과 반복 한도를 서로 다른 이유로 종료합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            검색 여부를 먼저 결정하고, 부족한 근거를 겨냥해 질문을 바꾸며, 다시
            평가하는 반복을 <strong>적응형 검색 루프(adaptive retrieval loop)</strong>
            라고 부르겠습니다. 핵심은 반복 자체가 아니라 누락된 주장과 다음 변환을
            연결하는 것입니다.
          </p>
          <p>
            q-732의 운영 판정기는 정답 문서 집합 A를 모릅니다. 대신 “설정 위치”와
            “보안 영향”이라는 두 필수 주장을 만들고, 각 주장에 인용 가능한 문서가
            있는지 평가합니다. 이 평가는 틀릴 수 있으므로 판정기 버전과 점수,
            변환된 질문, 후보 ID를 함께 남겨야 나중에 오답 원인을 재현할 수 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="q-732 적응형 검색: 복원부터 종료 기록까지"
          input={[
            "원 요청 request와 같은 대화의 문맥 conversation",
            "필수 주장 required_claims={설정 위치, 보안 영향}",
            "검색 함수 retrieve와 근거 판정 함수 evaluate",
            "최대 재검색 횟수 max_iter=2 (가정)",
          ]}
          steps={[
            {
              code: "// 대화 맥락으로 생략된 대상을 복원합니다.\nq = resolve_reference(request, conversation)",
              note: "직전 발화에서 XR-17B와 모바일 앱을 확인해 검색 대상을 명시합니다.",
            },
            {
              code: "// 복원한 질문으로 처음 검색합니다.\ncontext = retrieve(q)",
              note: "첫 결과의 후보 ID와 검색기 설정을 기록합니다.",
            },
            {
              code: "// 필요한 주장마다 근거가 있는지 평가합니다.\nverdict = evaluate(required_claims, context)",
              note: "정답 문서를 미리 아는 대신 각 주장에 인용 가능한 근거가 있는지 판정합니다.",
            },
            {
              code: "// 충분하면 그 이유를 기록하고 즉시 끝냅니다.\nif verdict.sufficient: return context, receipt(\"evidence_sufficient\")",
              note: "충분성 통과와 단순 반복 중단을 같은 성공 상태로 처리하지 않습니다.",
            },
            {
              code: "// 누락 원인에 맞는 변환만 고릅니다.\nqueries = transform(q, verdict.missing_reasons)",
              note: "q-732에서는 문장 재작성과 두 하위 질문 분해를 선택합니다.",
            },
            {
              code: "// 새 결과를 기존 후보와 합쳐 다시 평가합니다.\ncontext = union(context, retrieve_all(queries))",
              note: "중복 문서를 제거하되 어느 질문이 어떤 문서를 찾았는지 계보는 보존합니다.",
            },
            {
              code: "// 한도를 넘기지 않도록 반복 횟수를 올립니다.\niteration = iteration + 1",
              note: "iteration이 max_iter에 닿으면 충분하지 않아도 멈춥니다.",
            },
            {
              code: "// 충분하거나 한도에 닿을 때까지 평가로 돌아갑니다.\nrepeat from evaluate",
              note: "마지막 기록에는 sufficient와 max_iter 중 실제 종료 이유를 남깁니다.",
            },
          ]}
          output="근거 문서, 질문 변환 계보, 판정기 버전, 반복 횟수, 종료 이유가 담긴 검색 기록"
          repeatUntil="verdict.sufficient 또는 iteration == max_iter"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            q-732는 첫 재검색에서 d-17·d-04를 얻어 반복 1에서 끝납니다. 반대로
            반복 2까지 갔는데도 보안 영향의 근거가 없다면 답을 지어내지 않고
            “근거 부족” 상태로 넘겨야 합니다. 최대 횟수는 성공 조건이 아니라 비용과
            지연을 제한하는 안전장치입니다.
          </p>
        </div>
      </section>

      <section id="self-rag-crag" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          검색을 판단하는 주체는 하나로 정해야 합니다
        </h2>
        <DecisionOwnerViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Self-RAG는 검색과 비평을 생성 모델 안에 학습시킵니다. 모델은 다음
            구간을 만들 때 검색 여부를 나타내는 Retrieve 토큰을 예측하고, 회수한
            문서의 관련성(IsRel), 생성문의 근거 지지(IsSup), 응답의 유용성(IsUse)을
            나타내는 토큰도 함께 예측합니다. 일반 모델에 프롬프트 네 줄을 붙이는
            기능이 아니라, 이 토큰을 생성하도록 학습한 모델과 전용 디코딩 절차가
            필요합니다.
          </p>
          <p>
            CRAG는 검색이 끝난 뒤 별도 평가기가 문서 신뢰도를 매기고 교정 동작을
            고릅니다. 관련 문서가 있다고 보면 내부 문서를 정제하고, 모두 낮다고
            보면 질문을 다시 써 외부 검색을 사용합니다. 중간 구간에서는 두 결과를
            함께 씁니다. 따라서 Self-RAG의 내부 토큰과 CRAG의 외부 평가기는 같은
            컴포넌트가 아니며, 한 요청에서 누가 검색·재검색 상태를 최종 변경하는지
            명확히 정해야 합니다.
          </p>
        </div>
        <CragThresholdViz />
        <ExplainedFormula
          question="CRAG의 설명용 판정 규칙을 두 임계값으로 어떻게 읽을까요?"
          idea="문서별 신뢰도 가운데 가장 높은 값 s를 구하고, s가 하한과 상한 사이 어디에 놓이는지로 교정 동작을 고릅니다."
          formula={String.raw`\begin{aligned}s&=\max_i c_i\\\operatorname{action}(s)&=\begin{cases}\text{정제}&s>\tau_u\\\text{정제+외부검색}&\tau_l\le s\le\tau_u\\\text{외부검색}&s<\tau_l\end{cases}\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{s}_{\text{검색 결과 대표 신뢰도}}&=\underbrace{\max_i c_i}_{\text{문서별 점수 중 최댓값}}\\\operatorname{action}(s)&=\begin{cases}\underbrace{\text{정제}}_{\text{관련 문서 있음}}&s>\tau_u\\\underbrace{\text{정제+외부검색}}_{\text{판정 모호}}&\tau_l\le s\le\tau_u\\\underbrace{\text{외부검색}}_{\text{모두 관련 없음}}&s<\tau_l\end{cases}\end{aligned}`}
          operations={[
            {
              expression: String.raw`s=\max_i c_i`,
              annotation: [
                "문서별 관련성 점수 가운데",
                "가장 높은 값을 대표값으로 둡니다.",
              ],
            },
            {
              expression: String.raw`s>\tau_u`,
              annotation: [
                "적어도 한 문서가 상한을 넘으면",
                "내부 문서의 관련 부분을 정제합니다.",
              ],
            },
            {
              expression: String.raw`s<\tau_l`,
              annotation: [
                "모든 문서가 하한보다 낮으면",
                "질문을 다시 써 외부 검색으로 바꿉니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: "c_i",
              name: "문서 i의 신뢰도",
              description: "검색 평가기가 각 문서에 매긴 관련성 점수입니다.",
            },
            {
              symbol: String.raw`\tau_l,\tau_u`,
              name: "하한과 상한",
              description: "세 교정 동작을 가르는 두 기준값입니다.",
            },
            {
              symbol: "s",
              name: "대표 신뢰도",
              description: "설명용으로 문서 점수의 최댓값을 사용한 값입니다.",
            },
          ]}
          assumptions={[
            "논문의 Correct·Incorrect·Ambiguous 조건을 최댓값 s로 요약해 설명합니다. 실제 구현에서는 문서별 판정과 통합 절차도 함께 보존해야 합니다.",
            "임계값은 검증 집합에서 정해야 하며, 이 글의 0.40·0.70은 시각화를 위한 가정입니다.",
          ]}
          interpretation="0.55는 두 임계값 사이이므로 내부 근거 정제와 외부 검색을 함께 사용합니다. 이 분류가 옳다는 보장은 없으므로 평가기 자체의 오분류율도 별도로 측정해야 합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            CRAG v3의 Table 1에서 LLaMA2-hf-7B를 생성 모델로 쓴 분기는 PopQA
            정확도 50.5에서 54.9, ARC-Challenge 43.4에서 53.7로 오른 저자 결과를
            보고합니다. 그러나 SelfRAG-LLaMA2-7B 분기에서 ARC-Challenge는
            Self-RAG 67.3과 Self-CRAG 67.2로 거의 같았습니다. 평가기를 하나 더
            붙인다고 모든 과제에서 개선된다고 말할 수 없는 이유입니다.
          </p>
          <p>
            실제 선택은 동일한 코퍼스와 질문 집합에서 일반 RAG, Self-RAG,
            CRAG를 따로 실행해 회수율·근거 지지율·지연·추가 모델 운영비를 함께
            측정해야 합니다. 같은 요청의 검색 여부와 재검색 횟수를 여러 판정기가
            동시에 바꾸게 두면 실패 원인과 비용의 소유권이 흐려집니다.
          </p>
        </div>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          각 논문이 실제로 검증한 범위를 구분합니다
        </h2>
        <div id="paper-hyde" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Gao et al. · Precise Zero-Shot Dense Retrieval without Relevance Labels (HyDE, ACL 2023)"
            citeKey={1}
            href="https://arxiv.org/abs/2212.10496"
          >
            질문으로 가상 문서를 생성하고 비지도 대조학습 인코더로 그 문서를
            임베딩해 실제 문서를 찾는 방법을 제시합니다. 논문은 가상 문서에 틀린
            세부가 들어갈 수 있다고 명시하며, 여러 과제와 언어에서의 성능은 저자
            실험 범위입니다.
          </CitationBlock>
        </div>
        <div id="paper-selfrag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Asai et al. · Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection (ICLR 2024)"
            citeKey={2}
            href="https://arxiv.org/abs/2310.11511"
          >
            Retrieve·IsRel·IsSup·IsUse 토큰을 생성하도록 비평 모델과 생성 모델을
            학습하고, 추론 중 검색·생성·비평을 연결합니다. 일반 모델에 같은 이름의
            프롬프트를 붙이는 것과는 다릅니다.
          </CitationBlock>
        </div>
        <div id="paper-crag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yan et al. · Corrective Retrieval Augmented Generation (CRAG, arXiv v3, 2024-10-07)"
            citeKey={3}
            href="https://arxiv.org/abs/2401.15884"
          >
            검색 평가기의 신뢰도에 따라 내부 문서 정제, 외부 검색, 두 경로의 결합을
            선택합니다. 네 데이터셋의 수치는 저자 자기보고이며 Table 1에는 거의
            차이가 없는 조합도 함께 나옵니다.
          </CitationBlock>
        </div>
        <div id="paper-stepback" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zheng et al. · Take a Step Back: Evoking Reasoning via Abstraction (ICLR 2024)"
            citeKey={4}
            href="https://arxiv.org/abs/2310.06117"
          >
            구체적인 사례에서 상위 개념과 첫 원리를 먼저 끌어내 추론에 사용하는
            프롬프팅을 평가합니다. 이 논문의 개선 수치는 추론 과제 결과이며 검색
            회수율을 직접 측정한 값이 아닙니다.
          </CitationBlock>
        </div>
        <div id="paper-least-to-most" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhou et al. · Least-to-Most Prompting Enables Complex Reasoning in Large Language Models (ICLR 2023)"
            citeKey={5}
            href="https://arxiv.org/abs/2205.10625"
          >
            복합 문제를 더 쉬운 하위 문제 순서로 나누는 추론 방법을 제시합니다.
            질의 분해의 직관을 설명하는 선행 근거로만 사용하며, SCAN 결과를 검색
            품질의 증거로 사용하지 않습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          청크와 색인 개정은{" "}
          <Link to="/cs/ai/rag-ingestion-and-chunking">
            문서 수집과 청킹 글
          </Link>
          이, 충분한 근거를 문맥에 배치하고 답변을 평가하는 단계는{" "}
          <Link to="/cs/ai/rag-context-assembly-and-evaluation">
            문맥 조립과 평가 글
          </Link>
          이 맡습니다.
        </p>
      </section>

      <QueryTransformationReturn />
    </div>
  );
}
