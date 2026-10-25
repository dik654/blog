import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  RagContextAssemblyLocator,
  RagContextAssemblyReturn,
} from "./rag-context-assembly-and-evaluation/RagContextAssemblyLocator";
import RagContextAssemblyAndEvaluationViz from "./rag-context-assembly-and-evaluation/viz/RagContextAssemblyAndEvaluationViz";
import {
  RagExperimentBoundsViz,
  RagMetricsMapViz,
} from "./rag-context-assembly-and-evaluation/viz/RagEvaluationEvidenceViz";

/**
 * RAG 문맥 조립과 평가
 *
 * 앞 글의 q-732를 그대로 이어 받아 후보 → 문맥 → 답변 → 평가 기록을 한 번만 추적합니다.
 */
export default function RagContextAssemblyAndEvaluationArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <RagContextAssemblyLocator />
        <h2 className="mb-6 text-2xl font-bold">
          검색된 근거가 있다고 답이 근거를 쓰는 것은 아닙니다
        </h2>
        <RagContextAssemblyAndEvaluationViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 q-732는 모호한 원문을 복원하고 두 하위 질문으로 나눈 뒤
            d-17과 d-04를 찾았습니다. 이제 두 문서를 제한된 문맥에 넣고 답을
            만들었지만, 답변에는 어느 근거에도 없는 세 번째 주장이 섞였습니다.
          </p>
          <p>
            이 글이 답할 질문은 하나입니다. <strong>근거를 찾은 뒤 답이 나오기까지
            어느 단계에서 정보가 빠지거나 새 주장이 생겼는지 어떻게 확인할까요?</strong>
            이를 위해 근거 선택, 문맥 조립, 검색 측 지표, 답변 측 지표와 단계별
            추적 기록을 순서대로 연결합니다.
          </p>
          <p>
            후보를 찾고 순위를 좁히는 과정은{" "}
            <Link to="/cs/ai/retrieval-ranking-funnel#retrieval-ranking-return">
              검색과 재정렬
            </Link>
            이, 질문을 바꿔 다시 검색하는 과정은{" "}
            <Link to="/cs/ai/query-transformation-and-adaptive-retrieval#query-transformation-return">
              질의 변환과 재검색
            </Link>
            이 맡습니다. 이 글은 그 출력 이후만 다룹니다.
          </p>
        </div>
        <ContentBoundary article="rag-context-assembly-and-evaluation" />
      </section>

      <section id="context-assembly" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          선택은 무엇을 남길지, 조립은 어떻게 건넬지 정합니다
        </h2>
        <AlgorithmBlock
          title="q-732의 문맥을 만드는 절차"
          input={[
            "전체 문맥 창 4,096토큰",
            "시스템·대화 1,024토큰",
            "출력 예약 1,024토큰",
            "후보 d-17·d-04·d-22·d-31",
          ]}
          steps={[
            {
              code: "evidence_budget = 4096 - 1024 - 1024",
              note: "먼저 근거에 실제로 쓸 수 있는 2,048토큰을 계산합니다.",
            },
            {
              code: "selected = choose_relevant(candidates, budget=2048)",
              note: "질문의 설정 위치와 보안 영향을 직접 지지하는 d-17·d-04만 남깁니다.",
            },
            {
              code: "context = pack(selected, source_id=true, delimiter=true)",
              note: "각 조각에 출처 ID와 경계를 붙여 어느 문서가 어떤 주장을 지지하는지 보존합니다.",
            },
            {
              code: "prompt = question + context + citation_rule",
              note: "질문, 조립된 근거와 인용 규칙을 생성 모델에 함께 넘깁니다.",
            },
          ]}
          output="1,200토큰의 최종 문맥과 출처 목록 [d-17, d-04]"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Evidence selection</strong>은 후보 중 어떤 조각을 예산 안에
            남길지 정합니다. 순위만 자르는 방법, 중복 제거, 다양성 점수, 출처별
            한도처럼 여러 정책을 쓸 수 있지만 어느 정책도 모든 질의에 자동으로
            맞지는 않습니다. q-732에서는 질문의 두 요구를 각각 지지하는 문서를
            남겼다는 사후 relevance 판정을 가정했습니다.
          </p>
          <p>
            <strong>Context packing</strong>은 선택된 조각을 생성 모델이 받을 한
            문자열로 직렬화합니다. 문서 ID, 제목, 구분자와 인용 규칙을 보존해야
            답의 주장과 원문을 다시 연결할 수 있습니다. 내용을 줄이거나 다시 쓰는
            compression은 별도 결정이며{" "}
            <Link to="/cs/ai/context-window-optimization#compression">
              문맥 창 최적화
            </Link>
            에서 다룹니다.
          </p>
          <p>
            <strong>Context ordering</strong>은 선택된 조각의 위치를 정합니다.
            Lost in the Middle 연구의 20문서 실험에서 GPT-3.5-Turbo는 정답 문서가
            첫 위치일 때 75.8%, 가운데인 10번째 위치일 때 53.8%를 기록했습니다.
            이는 특정 모델과 실험의 결과이지 “항상 중요한 문서를 양끝에 놓으면
            된다”는 보편 규칙은 아닙니다. 모델, 문맥 길이와 질의 형태별로 다시
            측정해야 합니다.
          </p>
        </div>
        <TermBreakdown
          title="선택·조립·순서의 경계"
          description="세 결정은 이어지지만 실패 원인과 수정 지점이 다릅니다."
          items={[
            {
              term: "Evidence selection",
              description: "문맥 예산 안에 남길 근거 조각의 부분집합을 정합니다.",
              example: "d-17·d-04를 남기고 일반 안내 d-22·d-31을 제외",
              boundary: "조각 내용을 고쳐 쓰지 않고 포함 여부를 결정합니다.",
            },
            {
              term: "Context packing",
              description: "선택된 조각을 출처 ID·구분자와 함께 직렬화합니다.",
              example: "[d-17] 설정 경로 다음 [d-04] 보안 주의를 배치",
              boundary: "출처 경계가 사라지면 주장별 근거를 역추적하기 어렵습니다.",
            },
            {
              term: "Context ordering",
              description: "모델이 받을 조각의 위치를 정합니다.",
              example: "먼저 물은 설정 방법을 앞에, 보안 영향을 뒤에 배치",
              boundary: "위치 편향은 실험 조건에 따라 달라지므로 고정 법칙으로 쓰지 않습니다.",
            },
          ]}
        />
      </section>

      <section id="metrics" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          문맥이 충분한지와 답이 문맥을 썼는지는 따로 잽니다
        </h2>
        <RagMetricsMapViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            2023년 RAGAS 논문은 <strong>faithfulness, answer relevance,
            context relevance</strong> 세 reference-free 지표를 제안했습니다.
            현재 Ragas v0.4.3 문서에는 context precision과 context recall 등 더 많은
            지표가 있지만, 이 둘을 원 논문의 동일한 세 지표처럼 소개하면 시점과
            정의가 섞입니다.
          </p>
          <p>
            RAGAS 논문의 WikiEval 비교에서 사람 판정과의 pairwise agreement는
            faithfulness 0.95, answer relevance 0.78, context relevance 0.70이었습니다.
            이것은 WikiEval에서의 agreement이지 다른 언어와 도메인에서 보장되는
            정확도가 아닙니다.
          </p>
        </div>

        <ExplainedFormula
          question="답변의 각 주장이 최종 문맥에서 지지되는 비율은 얼마인가요?"
          idea={
            <p>
              답변을 독립된 주장으로 나누고, 각 주장을 최종 문맥에서 추론할 수
              있는지 판정한 뒤 지지된 주장 비율을 계산합니다.
            </p>
          }
          formula={String.raw`F=\dfrac{|V|}{|S|}=\dfrac{2}{3}\approx0.67`}
          annotatedFormula={String.raw`F=\dfrac{\overbrace{|V|}^{\text{문맥이 지지한 주장}}}{\underbrace{|S|}_{\text{답변의 전체 주장}}}=\dfrac{2}{3}`}
          operations={[
            {
              expression: String.raw`S=\{s_1,s_2,s_3\}`,
              annotation: ["q-732의 답을", "세 주장으로 분해"],
            },
            {
              expression: String.raw`V=\{s_1,s_2\}`,
              annotation: ["d-17·d-04가 지지한", "두 주장만 선택"],
            },
            {
              expression: String.raw`F=|V|/|S|=2/3`,
              annotation: ["지지된 주장 수를", "전체 주장 수로 나눔"],
            },
          ]}
          terms={[
            { symbol: "S", name: "Statement set", description: "답변에서 분해한 독립 주장 전체입니다." },
            { symbol: "V", name: "Verified statements", description: "최종 문맥이 지지한다고 판정한 주장입니다." },
          ]}
          assumptions={[
            "주장 분해와 지지 판정 결과가 맞다고 가정한 설명용 계산입니다.",
            "실제 평가는 judge 모델·프롬프트·반복 실행에 따라 달라질 수 있습니다.",
          ]}
          interpretation="설정 위치와 공용 기기 주의는 지지되지만 ‘다시는 로그인할 필요가 없다’는 문장은 지지되지 않습니다. 원 논문 명칭은 faithfulness이며, 일반적으로 groundedness라고도 부릅니다."
        />

        <ExplainedFormula
          question="관련 근거가 검색 순위 앞쪽에 놓였는지는 어떻게 계산하나요?"
          idea={
            <p>
              각 관련 항목이 나타난 순위에서 누적 precision을 계산하고 그 평균을
              냅니다. 현재 Ragas 문서의 context precision은 이 평균 정밀도 형태를
              사용합니다.
            </p>
          }
          formula={String.raw`CP@K=\dfrac{\sum_{k=1}^{K}(P@k\times v_k)}{\sum_{k=1}^{K}v_k}`}
          annotatedFormula={String.raw`CP@K=\dfrac{\sum_{k=1}^{K}\overbrace{(P@k\times v_k)}^{\text{관련 항목 위치의 누적 precision}}}{\underbrace{\sum_{k=1}^{K}v_k}_{\text{top K 안의 관련 항목 수}}}`}
          operations={[
            {
              expression: String.raw`v=[0,1,0,1]`,
              annotation: ["원 후보 네 건에서", "d-17·d-04만 관련"],
            },
            {
              expression: String.raw`P@2=1/2,\quad P@4=2/4`,
              annotation: ["관련 항목이 나온", "두 위치의 누적 precision"],
            },
            {
              expression: String.raw`CP@4=(0.5+0.5)/2=0.5`,
              annotation: ["원 후보 순위의 점수", "선택 뒤 [1,1]은 1.0"],
            },
          ]}
          terms={[
            { symbol: "K", name: "Cutoff", description: "평가에 포함한 검색 결과 수입니다." },
            { symbol: "v_k", name: "Relevance indicator", description: "k번째 결과가 관련 있으면 1, 아니면 0입니다." },
            { symbol: "P@k", name: "Precision at k", description: "k번째까지 누적된 관련 결과 비율입니다." },
          ]}
          assumptions={[
            "d-17·d-04만 q-732에 관련 있다는 사후 판정을 사용합니다.",
            "Reference를 쓰는 버전과 답변을 쓰는 without-reference 버전은 relevance 판정 입력이 다릅니다.",
          ]}
          interpretation="원 후보 순서 [d-22,d-17,d-31,d-04]의 context precision은 0.5입니다. 관련 근거만 남긴 최종 문맥 [d-17,d-04]은 1.0이지만, 이 값만으로 답변이 옳다는 사실까지 보장하지는 않습니다."
        />

        <ExplainedFormula
          question="참조 답에 필요한 근거를 빠짐없이 찾았는지는 어떻게 재나요?"
          idea={
            <p>
              참조 답을 필요한 주장으로 나눈 뒤 검색 문맥이 지지하는 주장 비율을
              계산합니다. 따라서 LLM 기반 context recall에는 reference가 필요합니다.
            </p>
          }
          formula={String.raw`CR=\dfrac{\text{문맥이 지지한 참조 주장 수}}{\text{참조 주장 전체 수}}=\dfrac{2}{2}=1`}
          annotatedFormula={String.raw`CR=\dfrac{\overbrace{2}^{\text{설정 위치·보안 영향}}}{\underbrace{2}_{\text{참조 답의 필요 주장}}}=1`}
          operations={[
            {
              expression: String.raw`R=\{r_{setting},r_{security}\}`,
              annotation: ["참조 답을", "두 필요 주장으로 분해"],
            },
            {
              expression: String.raw`support(r_{setting})=d17`,
              annotation: ["설정 위치는", "d-17이 지지"],
            },
            {
              expression: String.raw`support(r_{security})=d04`,
              annotation: ["보안 영향은", "d-04가 지지"],
            },
          ]}
          terms={[
            { symbol: "R", name: "Reference claims", description: "정답에 필요하다고 미리 정의한 주장 집합입니다." },
          ]}
          assumptions={[
            "참조 답이 필요한 두 주장을 빠짐없이 표현한다고 가정합니다.",
            "주장 분해의 세밀도가 바뀌면 분모와 점수도 달라질 수 있습니다.",
          ]}
          interpretation="Context recall 1.0인데 faithfulness가 0.67이므로, 필요한 근거는 모두 도착했지만 답변이 그 근거 밖의 문장을 추가했습니다."
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Answer relevance는 답변으로부터 나올 법한 질문을 역생성하고 원 질문과
            embedding 유사도를 비교합니다. q-732 예시는 그 judge와 embedding을
            실제로 실행하지 않았으므로 점수를 만들지 않고 <strong>미측정</strong>으로
            남깁니다. 측정하지 않은 값을 보기 좋은 막대로 채우면 진단 근거가
            오히려 약해집니다.
          </p>
        </div>
      </section>

      <section id="failure-attribution" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          지표는 신호이고, 첫 실패는 단계별 기록이 확인합니다
        </h2>
        <AlgorithmBlock
          title="q-732의 첫 실패 찾기"
          input={[
            "필요 문서 존재 여부",
            "후보·최종 문맥의 문서 ID",
            "답변 주장별 지지 문서 ID",
            "지표 계산에 사용한 reference와 judge 버전",
          ]}
          steps={[
            {
              code: "assert corpus_contains(d17, d04)",
              note: "원문이 저장소에 없었던 ingestion failure부터 제외합니다.",
            },
            {
              code: "assert candidates_contains(d17, d04)",
              note: "두 문서가 후보에 있으므로 retrieval failure가 아닙니다.",
            },
            {
              code: "assert final_context_contains(d17, d04)",
              note: "두 문서가 최종 문맥에도 있으므로 selection·ranking 단계에서 빠지지 않았습니다.",
            },
            {
              code: "first_failure = unsupported(claim_3)",
              note: "답변에서 처음 미지지 주장이 생겼으므로 generation failure로 귀속합니다.",
            },
          ]}
          output="owner=generation, case=q-732/claim-3, evidence=[d-17,d-04]"
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            낮은 context recall은 검색 누락을 의심하게 하고, 낮은 faithfulness는
            답변의 미지지 주장을 의심하게 합니다. 그러나 임계값 하나만으로 원인을
            확정할 수는 없습니다. Judge 오판, 잘못된 reference, ingestion 누락도
            같은 숫자를 만들 수 있기 때문입니다.
          </p>
          <p>
            따라서 각 요청에는 corpus 버전, 변환된 질문, 후보 ID와 순위, 선택된
            문맥 ID, 답변의 주장, 주장별 지지 문서, judge·prompt 버전을 함께
            남겨야 합니다. 이 기록에서 처음 상태가 달라진 지점이 수정 담당을
            정합니다.
          </p>
          <p>
            미지지 주장은 곧바로 “환각”이라고 단정하지 않습니다. 최종 문맥 밖의
            사실을 허용하는 제품 정책인지, 참조 답에 누락이 없는지, 외부 사실
            검증이 필요한지를 별도 평가해야 합니다. LLM 판정기의 일반적인 한계는{" "}
            <Link to="/cs/ai/llm-as-a-judge#problem">LLM-as-a-judge</Link>에서
            이어서 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="첫 실패가 가리키는 수정 지점"
          description="최종 오답은 같아도 처음 끊긴 상태에 따라 담당 계층이 달라집니다."
          items={[
            {
              term: "Retrieval failure",
              description: "필요 문서는 corpus에 있지만 후보 집합에 들어오지 못했습니다.",
              example: "d-04가 corpus에는 있으나 후보 ID 목록에는 없음",
              boundary: "문서가 corpus에도 없다면 앞단 ingestion failure입니다.",
            },
            {
              term: "Selection·ranking failure",
              description: "후보에는 있었지만 최종 문맥에서 빠졌습니다.",
              example: "d-04가 후보 12위였고 top-8 이후 제거됨",
              boundary: "후보가 없었다면 reranker를 고쳐도 복구할 수 없습니다.",
            },
            {
              term: "Generation failure",
              description: "필요 근거가 최종 문맥에 있는데 답변이 쓰지 않거나 근거 밖 주장을 냈습니다.",
              example: "d-17·d-04가 있는데 claim-3만 미지지",
              boundary: "낮은 judge 점수만으로 확정하지 않고 실제 문서·주장 ID를 확인합니다.",
            },
          ]}
        />
      </section>

      <section id="ablation-oracle" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          검색을 빼거나 완벽한 검색으로 바꾸면 개선 여유의 경계가 보입니다
        </h2>
        <RagExperimentBoundsViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Retrieval ablation</strong>은 검색을 끈 동일 계열 모델과 RAG를
            비교해 검색이 더한 차이를 봅니다. Lewis et al.의 Natural Questions
            표에서 closed-book T5-11B+SSM은 EM 36.6, RAG-Sequence는 44.5로
            7.9%p 차이가 났습니다.
          </p>
          <p>
            <strong>Oracle retrieval</strong>은 정답에 필요한 문맥을 알고 있다고
            가정해 생성기에 넣습니다. CRUX의 DUC 표에서 DR+RankFirst의 최종
            coverage인 Cov(y)는 44.6, oracle retrieval은 64.6으로 20.0%p 차이가
            났습니다. 같은 표의 방법 중 Cov(y) 기준으로 확인한 값이며, 기존 글의
            LSR+RankFirst 44.3을 “최선”이라고 부르던 표현은 바로잡았습니다.
          </p>
          <p>
            두 결과는 서로 다른 데이터셋과 지표이므로 한 그래프에서 성능 순위를
            비교할 수 없습니다. Ablation은 현재 RAG가 제공한 기여를, oracle 비교는
            해당 실험에서 검색·재정렬이 남긴 여유를 보여 주는 별도 실험입니다.
          </p>
        </div>
        <RagContextAssemblyReturn />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">근거 문서</h2>
        <div id="paper-ragas" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Es et al. · RAGAS: Automated Evaluation of Retrieval Augmented Generation"
            href="https://arxiv.org/abs/2309.15217"
          >
            Faithfulness·answer relevance·context relevance 세 지표를 제안하고,
            WikiEval pairwise 비교에서 사람 판정과의 agreement 0.95·0.78·0.70을
            보고합니다. Context precision·recall을 원 논문의 지표로 인용하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-ragas-precision" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={2}
            source="Ragas v0.4.3 문서 · Context Precision"
            href="https://docs.ragas.io/en/v0.4.3/concepts/metrics/available_metrics/context_precision/"
          >
            순위 k까지의 precision을 관련 항목 위치에서 합산하고 top K 안의 관련
            항목 수로 나누는 계산과 reference 유무에 따른 변형을 설명합니다.
          </CitationBlock>
        </div>
        <div id="paper-ragas-recall" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={3}
            source="Ragas v0.4.3 문서 · Context Recall"
            href="https://docs.ragas.io/en/v0.4.3/concepts/metrics/available_metrics/context_recall/"
          >
            참조 답을 claim으로 나누고 검색 문맥이 지지하는 비율을 계산하며,
            context recall에는 reference가 필요하다고 명시합니다.
          </CitationBlock>
        </div>
        <div id="paper-lost-middle" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={4}
            source="Liu et al. · Lost in the Middle"
            href="https://arxiv.org/abs/2307.03172"
          >
            20개 문서 multi-document QA 실험에서 GPT-3.5-Turbo의 정답 문서 위치가
            첫 번째일 때 75.8%, 가운데인 index 9일 때 53.8%였다고 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-rag-original" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={5}
            source="Lewis et al. · Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
            href="https://arxiv.org/abs/2005.11401"
          >
            Natural Questions에서 closed-book T5-11B+SSM EM 36.6과 RAG-Sequence
            EM 44.5를 보고합니다. 7.9%p 차이는 해당 모델·데이터셋의 결과입니다.
          </CitationBlock>
        </div>
        <div id="paper-crux" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={6}
            source="Ju et al. · Controlled Retrieval-augmented Context Evaluation for Long-form RAG"
            href="https://arxiv.org/abs/2506.20051"
          >
            CRUX DUC 표에서 DR+RankFirst Cov(y) 44.6과 oracle retrieval Cov(y)
            64.6을 보고합니다. 이는 요약 과제의 저자 보고 결과이며 다른 RAG 과제의
            일반적인 상한으로 확대하지 않습니다.
          </CitationBlock>
        </div>
      </section>
    </div>
  );
}
