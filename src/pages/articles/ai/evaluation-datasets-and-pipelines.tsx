import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import EvaluationDatasetsAndPipelinesViz from "./evaluation-datasets-and-pipelines/viz/EvaluationDatasetsAndPipelinesViz";

/**
 * 평가는 golden set을 채우고 offline·shadow·A/B를 통과해야 신뢰됩니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function EvaluationDatasetsAndPipelinesArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 model 도 어떤 golden set 으로 재느냐에 따라 통과 여부가 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            LLM 평가는 golden set 하나만으로 끝나지 않습니다. Coverage 가 부족한 golden set 은
            애초에 특정 카테고리의 실패를 담지 못하고, 전체 평균 정확도는 특정 slice 의 붕괴를
            가리며, offline 에서 통과한 model 도 실 트래픽의 분포가 다르면 온라인에서 다시
            무너집니다.
          </p>
          <p>
            이 글은 golden set 을 채우는 법에서 시작해 harness 로 자동화하고, offline·shadow·A/B
            순서로 차례차례 실 트래픽에 내보내는 하나의 파이프라인으로 다룹니다.
          </p>
          <p>
            평가 지표 자체(정확도·judge score)를 어떻게 정의하는지는 다루지 않고, 그 지표를
            무엇에 얼마나, 어떤 순서로 적용해야 결과를 믿을 수 있는지에 집중합니다.
          </p>
        </div>
        <ContentBoundary article="evaluation-datasets-and-pipelines" />
      </section>

      <section id="golden-set" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Golden set 은 coverage 가 채워진 evaluation example 의 모음입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Evaluation dataset 은 시스템의 품질을 재려고 모은 example 전체를 가리키고, golden
            set 은 그중 사람이 직접 정답을 확인해 신뢰도를 높인 핵심 부분집합입니다. Example
            하나(입력과 기대 출력 한 쌍)를 test case 라고 부릅니다.
          </p>
          <p>
            가정: golden set 200 개를 fact QA 60 개, 요약 40 개, code 생성 50 개, 안전 거절
            30 개, multi-turn 20 개로 채웠습니다. 운영 트래픽에서 code 질문 비중이 35 % 인데
            golden set 엔 25 % 밖에 없다면, code 카테고리의 coverage 가 부족한 것입니다.
          </p>
          <p>
            Evaluation coverage 는 golden set 이 실제로 마주칠 카테고리·언어·길이·난이도를 얼마나
            고르게 담았는지 나타내는 척도입니다. 표본 수만 많고 특정 범주에 쏠리면 그 범주의
            실패는 애초에 보이지 않습니다.
          </p>
          <p>
            HELM 은 MMLU 시나리오에서 57 개 subject 로 example 을 나누고, subject·group 별로
            따로 통계를 냅니다. 카테고리를 먼저 나누고 그 안에서 example 을 채우는 방식이
            coverage 를 셀 수 있게 만드는 전제입니다.
          </p>
          <p>
            Golden set 이 아무리 커도 coverage 표를 붙이지 않으면 어느 범주가 비었는지 알 수
            없습니다. 개수만 세는 200 개는 coverage 를 보장하지 않습니다.
          </p>
        </div>
        <EvaluationDatasetsAndPipelinesViz />
        <TermBreakdown
          title="Golden set 을 이루는 세 층"
          description="데이터셋 전체, 그 안의 단위, 그리고 단위들이 얼마나 고르게 퍼졌는지는 서로 다른 질문입니다."
          items={[
            { term: "Evaluation dataset", description: "품질을 재려고 모은 example 전체입니다.", example: "운영 로그에서 뽑은 질문 5,000 개.", boundary: "정답 검증 없이 모으기만 하면 golden set 이 아닙니다." },
            { term: "Golden dataset", description: "사람이 정답을 확인한 핵심 부분집합입니다.", example: "5,000 개 중 사람이 검수한 200 개.", boundary: "크기가 작아 coverage 를 별도로 확인해야 합니다." },
            { term: "Evaluation example · test case", description: "입력과 기대 출력 한 쌍입니다.", example: "질문 하나 + 채점 rubric.", boundary: "기대 출력이 모호하면 채점 자체가 불안정합니다." },
            { term: "Evaluation coverage", description: "카테고리·언어·길이별로 얼마나 고르게 채웠는지입니다.", example: "code 25 % vs 운영 트래픽 35 %.", boundary: "표본 수가 많아도 coverage 가 낮으면 특정 실패를 못 봅니다." },
          ]}
        />
      </section>

      <section id="edge-case" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Edge case 와 adversarial example 을 의도적으로 채우면 숨은 실패가 드러납니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Edge case 는 정상 입력 분포의 경계에 있는 드문 입력이고, adversarial example 은
            model 이 틀리도록 일부러 설계한 입력입니다. 두 종류를 golden set 에 일부러 섞어 넣지
            않으면 평범한 입력에서만 잘 도는 model 이 통과해 버립니다.
          </p>
          <p>
            가정: golden set 200 개 중 20 개(10 %)를 edge case·adversarial 로 채웠습니다. 나머지
            180 개의 실패율은 6 % 인데 그 20 개에서는 실패율이 40 % 로, 평범한 example 만 봤다면
            놓쳤을 문제입니다.
          </p>
          <p>
            CheckList 연구는 이미 널리 검증된 상용 감성분석 model 도 edge case 중심 test 로 새
            bug 를 찾아냈고, 이 방법을 쓴 사람이 그렇지 않은 사람보다 거의 세 배 많은 bug 를
            찾았다고 보고합니다. 평균 정확도가 높다고 edge case 가 없다는 뜻은 아닙니다.
          </p>
          <p>
            Out-of-distribution(OOD) evaluation 은 학습·golden set 어디에도 없던 분포의 입력에
            model 을 넣어 보는 것이고, 그 분포 차이 자체를 distribution shift 라고 부릅니다.
            WILDS benchmark 는 병원별 종양 판독처럼 실제로 일어나는 분포 이동에서 in-distribution
            보다 OOD 정확도가 뚜렷하게 낮다는 것을 여러 domain 에서 보였습니다.
          </p>
          <p>
            Edge case·adversarial 비율을 너무 올리면 golden set 전체가 실제 트래픽과 멀어져
            coverage 가 오히려 왜곡됩니다. 보통 10 % 안팎을 목표로 잡고 나머지는 representative
            분포를 따릅니다.
          </p>
        </div>
        <TermBreakdown
          title="정상 분포 밖을 채우는 세 방식"
          items={[
            { term: "Edge case", description: "정상 분포 경계의 드문 입력입니다.", example: "빈 문자열, 아주 긴 입력.", boundary: "너무 늘리면 golden set 전체가 대표성을 잃습니다." },
            { term: "Adversarial example", description: "틀리도록 일부러 설계한 입력입니다.", example: "안전 거절을 우회하려는 prompt.", boundary: "공격 방식이 바뀌면 예전 adversarial set 은 낡습니다." },
            { term: "OOD evaluation", description: "학습·golden set 밖의 분포로 재는 것입니다.", example: "다른 병원 영상으로 판독 정확도 측정.", boundary: "OOD 정확도가 낮다고 원인(분포 이동 vs 버그)까지 알려주진 않습니다." },
            { term: "Distribution shift", description: "입력 분포 자체가 달라지는 현상입니다.", example: "학습 시점과 운영 시점의 질문 길이 분포 차이.", boundary: "shift 크기를 재는 표준 척도는 없고 domain 마다 다르게 잽니다." },
          ]}
        />
      </section>

      <section id="slice-analysis" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          전체 평균 뒤에는 한 slice 만 무너진 경우가 숨습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Slice-based evaluation 은 전체 표본을 언어·길이·카테고리 같은 축으로 나눠 정확도를
            따로 재는 방법입니다. 전체 평균만 보면 한 slice 의 붕괴가 다른 slice 의 개선에
            가려집니다.
          </p>
          <p>
            Google 의 ML Test Score 논문은 실제 사례로 전체 정확도가 1 % 올랐는데 특정 국가
            slice 의 정확도는 50 % 떨어진 경우를 보고합니다. 국가별로 나눠 보지 않았다면 이
            회귀는 그대로 배포됐을 것입니다.
          </p>
          <p>
            다른 slice 보다 유난히 나쁜 slice 를 failure slice 라고 부릅니다. 언어별로 나누면
            영어 95 %, 한국어 88 %, 자원이 적은 언어 72 % 로 갈리는데, 가중 평균은 90 % 근처라
            자원이 적은 언어의 문제가 잘 보이지 않습니다.
          </p>
          <p>
            Regression test 는 이전 버전에서 쟀던 같은 slice 를 다시 재 품질이 되돌아가지
            않았는지 확인하는 것입니다. Slice 별 절대 기준(예: 오차 5 % 미만)과 이전 대비 상대
            기준(예: 1 % 이상 하락 금지)을 함께 두는 것이 ML Test Score 논문의 권고입니다.
          </p>
          <p>
            Prompt 버전만 바꾸는 좁은 범위에서는 이미 실패 trace 를 고정해 두고 한 축씩 바꾸는{" "}
            <Link to="/ai/prompt-engineering#anti-patterns">regression loop</Link>를 쓰는데, 여기서
            다루는 regression test 는 그 규칙을 golden set 전체의 slice 로 넓힌 것입니다.
          </p>
        </div>
        <TermBreakdown
          title="Slice 분석에서 구분해야 하는 세 개념"
          items={[
            { term: "Slice-based evaluation", description: "축으로 나눠 따로 재는 방법입니다.", example: "언어별, 길이별, 카테고리별 정확도.", boundary: "슬라이스를 너무 잘게 나누면 슬라이스마다 표본이 부족해집니다." },
            { term: "Failure slice", description: "다른 slice 보다 유난히 나쁜 slice 입니다.", example: "전체 평균 90 % 인데 기타 언어 72 %.", boundary: "찾아도 원인(데이터 부족 vs model 한계)은 별도로 조사해야 합니다." },
            { term: "Regression test", description: "이전 버전 대비 같은 slice 를 다시 재는 것입니다.", example: "절대 기준 5 % 미만 + 상대 기준 1 %p 이내.", boundary: "기준을 한 번 정하면 slice 구성이 바뀔 때 다시 조정해야 합니다." },
          ]}
        />
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Harness 는 golden set 채점을 코드 변경마다 자동으로 돌립니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Evaluation harness 는 golden set 을 model 에 넣고 채점해 지표를 뽑는 재사용 가능한
            코드입니다. 사람이 매번 손으로 돌리면 코드가 바뀔 때마다 빠뜨리기 쉬우므로, 이
            harness 를 코드·model 변경마다 자동으로 도는 automated evaluation pipeline 으로
            굳힙니다.
          </p>
          <p>
            OpenAI Evals 는 eval 하나를 데이터(JSON)와 채점 방식(YAML)으로 등록해 두면 설치 뒤
            커맨드 한 줄로 실행하고 결과를 registry 에 쌓는 방식을 씁니다. 정의만 있고 자동으로
            돌지 않는 eval 은 harness 가 아니라 그냥 문서입니다.
          </p>
          <p>
            이 pipeline 을 CI 처럼 커밋마다 상시로 돌리는 것이 continuous evaluation 입니다. ML
            Test Score 논문은 pipeline 전체를 정기적으로 통합 테스트해야 하고, 빠른 피드백을 위해
            데이터 부분집합이나 더 단순한 model 로 먼저 돌리는 것을 권합니다.
          </p>
          <p>
            Harness 가 자동으로 돌아도 채점 기준 자체가 낡으면 소용없습니다. Golden set 이
            늘어나면 harness 실행 시간도 늘어나므로, 매 커밋에는 빠른 부분집합을, 배포 전에는
            전체 golden set 을 돌리는 두 단계로 나누는 경우가 많습니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Harness 의 채점은 rule-based 인가요, model 채점인가요?"
          preview="정답이 하나로 정해지면 rule-based 채점을, 자유 서술형이면 judge model 채점을 씁니다. 이 글은 채점 기준 자체의 설계보다 그 결과를 파이프라인 어디서 쓰는지를 다룹니다."
        >
          <p>
            Rule-based 채점은 정답 문자열 일치나 정규식처럼 결정적이라 harness 에 넣기 쉽고
            비용도 거의 없습니다. 자유 서술형 답변은 rubric 을 정해 두고 다른 model 이 채점하는
            방식을 쓰는데, 그 채점 자체의 신뢰도는 이 글이 아니라 채점 기준을 다루는 글의
            범위입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="deployment" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Offline 을 통과해도 shadow 와 A/B 를 다시 거쳐야 합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Offline evaluation 은 golden set 같은 정적 데이터셋에서 배포 전에 재는 것이고,
            online evaluation 은 실제 트래픽에서 재는 것입니다. Offline 을 통과했다고 online 에서도
            통과한다는 보장은 없습니다.
          </p>
          <p>
            가정: golden set 정확도는 92 % 인데 실 트래픽에 내보내니 78 % 로 떨어졌습니다. 운영
            입력의 길이·언어 분포가 golden set 과 달라 distribution shift 가 생긴 것이며, WILDS
            가 보인 in-distribution 과 OOD 사이의 정확도 격차와 같은 종류의 문제입니다.
          </p>
          <p>
            ML Test Score 논문도 validation 데이터는 항상 실제 serving 입력보다 오래됐고, 서빙
            시점의 정답 label 을 바로 알기 어려워 품질 측정 자체가 어렵다고 지적합니다. 그래서
            online 회귀를 잡으려면 별도 monitoring 이 필요합니다.
          </p>
          <p>
            Shadow evaluation 은 새 model 을 실 트래픽 일부에 A/B 분할 없이 붙여 관찰하는
            방법입니다. 트래픽 10 % 에 candidate 를 붙이되 사용자에게는 기존 model 응답을 그대로
            보내고 candidate 의 지표만 기록하며, 문제가 없으면 그 비율을 점점 늘립니다. ML Test
            Score 가 말하는 canary 가 이 방식입니다.
          </p>
          <p>
            A/B testing 은 트래픽을 candidate 와 control 로 무작위 분할해 사용자가 실제로
            candidate 응답을 받게 한 뒤, 목표 지표의 차이가 우연보다 큰지 유의성 검정으로
            판정합니다. Shadow 와 달리 사용자 경험에 직접 영향을 줍니다.
          </p>
          <p>
            Kohavi 등의 연구는 감지하려는 효과가 절반이 되면 필요한 표본 수는 네 배가 되는 제곱
            관계를 보고하며, 이 때문에 대형 서비스의 실험 하나가 수백만 사용자에 노출되고 한
            회사가 연간 2 만 건이 넘는 실험을 동시에 돌리기도 합니다.
          </p>
        </div>
        <ExplainedFormula
          question="Candidate 가 정말 더 나은지 확인하려면 트래픽을 얼마나 모아야 하나요?"
          idea="두 그룹 평균 차이 δ 를 표준편차 σ 로 정규화한 뒤 원하는 유의수준과 검정력을 만족하려면, 그룹당 필요한 표본 수는 δ 의 제곱에 반비례해서 커집니다."
          formula={String.raw`n = \frac{2\left(z_{\alpha/2}+z_{\beta}\right)^{2}\sigma^{2}}{\delta^{2}}`}
          annotatedFormula={String.raw`n = \frac{2\underbrace{\left(z_{\alpha/2}+z_{\beta}\right)^{2}}_{\text{유의수준·검정력이 요구하는 여유}}\underbrace{\sigma^{2}}_{\text{지표의 분산}}}{\underbrace{\delta^{2}}_{\text{감지하려는 최소 효과의 제곱}}}`}
          operations={[
            { expression: String.raw`z_{\alpha/2}+z_{\beta}`, annotation: ["유의수준 α 와 검정력 1−β 각각에 대응하는", "표준정규분포 분위수를 더함"] },
            { expression: String.raw`\left(z_{\alpha/2}+z_{\beta}\right)^{2}\sigma^{2}`, annotation: ["그 합을 제곱해 지표 분산 σ²과 곱해", "필요한 분산 여유를 산출"] },
            { expression: String.raw`\frac{\cdot}{\delta^{2}}`, annotation: ["감지하려는 최소 효과 δ 의 제곱으로 나눠", "δ 가 절반이면 n 이 네 배가 되는 관계 산출"] },
          ]}
          terms={[
            { symbol: "n", name: "그룹당 표본 수", description: "Candidate·control 각각에 필요한 최소 요청(또는 사용자) 수입니다." },
            { symbol: String.raw`\delta`, name: "최소 감지 효과", description: "실제로 있다고 믿고 싶은 지표 차이입니다. 작을수록 n 이 급격히 커집니다." },
            { symbol: String.raw`\sigma^2`, name: "지표 분산", description: "candidate·control 이 같은 분산을 갖는다고 가정한 값입니다." },
            { symbol: String.raw`z_{\alpha/2}, z_{\beta}`, name: "유의수준·검정력 분위수", description: "예: α=0.05, 검정력 80 % 면 각각 1.96, 0.84 부근입니다." },
          ]}
          assumptions={[
            "두 그룹의 분산이 같고 표본이 충분히 커 정규근사가 성립한다고 가정합니다.",
            "지표 하나를 실험 전에 미리 고정했다는 전제이며, 여러 지표를 사후에 훑어보는 다중비교는 별도 보정이 필요합니다.",
          ]}
          interpretation="δ 가 절반이 되면 n 은 네 배가 됩니다. 그래서 아주 작은 효과를 잡으려는 A/B 는 수백만 단위의 트래픽이 필요하고, 그만큼 작은 회귀도 큰 트래픽에서는 통계적으로 잡힙니다."
        />
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Evaluation–development feedback loop 는 A/B 나 online 에서 찾은 실패를 새 evaluation
          example 로 golden set 에 되먹여 harness 의 coverage 를 넓히는 순환입니다. 이 loop 가
          없으면 같은 실패가 배포마다 반복됩니다.
        </p>
        <AlgorithmBlock
          title="Golden set 구축부터 배포까지 이어지는 평가 파이프라인"
          input={["golden set 후보 category 목록과 목표 coverage 분포", "edge case·adversarial 목표 비율(예: 10 %)", "harness(자동 채점 함수)와 slice 별 채택 기준", "SLO 조건 S 와 A/B 유의수준 α·검정력 1−β"]}
          steps={[
            { code: "build golden set from category quotas + edge/adversarial quota", note: "카테고리별 example 을 채우고 그중 일부를 의도적으로 edge case·adversarial 로 채웁니다." },
            { code: "check coverage(golden set) against target distribution", note: "운영 트래픽 분포와 비교해 비어 있는 category 가 있으면 그 category 를 더 채웁니다." },
            { code: "wire harness into CI as automated pipeline", note: "코드·model 변경마다 harness 가 자동으로 golden set 을 채점하도록 continuous evaluation 으로 굳힙니다." },
            { code: "if not offline_pass(slice_scores): stop", note: "전체 평균과 각 slice 의 절대·상대 기준을 모두 만족해야 다음 단계로 넘어갑니다." },
            { code: "shadow(candidate, traffic_fraction=0.1); observe metrics only", note: "실 트래픽 일부에 candidate 를 붙이되 응답은 버리고 지표만 관찰해 online 이상을 먼저 걸러냅니다." },
            { code: "if shadow_ok: run A/B with split=0.5, n from MDE δ", note: "Shadow 를 통과해야 A/B 로 넘어가며, 필요한 표본 수는 감지하려는 δ 로 미리 계산합니다." },
            { code: "if significant(A/B) and S satisfied: deploy", note: "유의성 검정을 통과하고 SLO 조건도 만족해야 배포합니다." },
            { code: "feed newly found failures back as evaluation examples", note: "A/B·online 에서 찾은 실패를 golden set 에 추가해 다음 변경의 coverage 를 넓힙니다." },
          ]}
          output="배포된 model·prompt 변경과, 이번에 발견한 실패로 coverage 가 넓어진 golden set"
        />
        <ProgressiveDetail
          title="Shadow 만으로 A/B 를 건너뛸 수 있나요?"
          preview="지표를 관찰만 하는 것과 사용자가 실제로 반응하는 것은 다른 질문이라 건너뛸 수 없습니다."
        >
          <p>
            Shadow 는 candidate 가 온라인 입력에서 이상하게 행동하지 않는지(에러율, latency,
            극단적 출력)를 확인하는 데는 충분합니다. 하지만 사용자 만족도나 클릭처럼 실제 노출이
            있어야만 나오는 반응은 shadow 로는 잴 수 없어 A/B 가 따로 필요합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 golden set 구성, 평가 harness, 실패 유형별 benchmark, 배포 통계로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Golden set 의 카테고리 분류와 coverage 리포트는 HELM 의 scenario·group 구조를,
            harness 자동화는 OpenAI Evals 의 등록 방식을 참고했습니다. Edge case·adversarial 은
            CheckList, OOD·distribution shift 는 WILDS 의 결과를 근거로 삼았습니다.
          </p>
          <p>
            Slice-based evaluation, regression test, shadow(canary), offline·online 상관은 Google
            의 ML Test Score 논문에서, A/B testing 의 표본 크기 관계는 Kohavi 등의 대규모 실험
            연구에서 가져왔습니다.
          </p>
        </div>
        <div id="paper-helm" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Liang et al. · HELM: Holistic Evaluation of Language Models (Stanford CRFM)"
            citeKey={1}
            href="https://crfm-helm.readthedocs.io/en/latest/tutorial/"
            type="code"
          >
            Model 평가를 여러 scenario(예: MMLU 의 57 개 subject)로 나누고, per-instance·per-run
            통계를 낸 뒤 helm-summarize 로 group·subject 별 리포트를 만듭니다. 카테고리를 먼저
            정의하고 그 안에서 example 을 채우는 구조가 coverage 를 측정 가능하게 만듭니다.
          </CitationBlock>
        </div>
        <div id="paper-openai-evals" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="OpenAI · Evals (build-eval 가이드)"
            citeKey={2}
            href="https://github.com/openai/evals/blob/main/docs/build-eval.md"
            type="code"
          >
            Eval 하나를 JSON 데이터와 YAML 채점 설정으로 등록해 두면 설치 뒤 커맨드 한 줄로
            실행하고 결과를 registry 에 쌓는 harness 구조를 정의합니다. Eval 은 주제가 일관되고,
            고품질 정답·rubric 을 갖춰야 한다고 권합니다.
          </CitationBlock>
        </div>
        <div id="paper-checklist" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Ribeiro et al. · Beyond Accuracy: Behavioral Testing of NLP Models with CheckList (ACL 2020)"
            citeKey={3}
            href="https://arxiv.org/abs/2005.04118"
          >
            일반 언어 능력과 test 유형의 행렬로 minimum functionality test 와 edge case 를
            체계적으로 만드는 방법론입니다. CheckList 를 쓴 참가자가 쓰지 않은 참가자보다 테스트를
            두 배 더 만들고 bug 를 거의 세 배 더 찾았다고 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-wilds" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Koh et al. · WILDS: A Benchmark of in-the-Wild Distribution Shifts (ICML 2021)"
            citeKey={4}
            href="https://arxiv.org/abs/2012.07421"
          >
            병원별 종양 판독, 카메라 트랩 야생동물 인식처럼 실제로 일어나는 domain·시간 분포
            이동을 담은 10 개 dataset benchmark 입니다. 표준 학습은 in-distribution 보다 OOD
            성능이 뚜렷하게 낮다는 것을 여러 dataset 에서 일관되게 보입니다.
          </CitationBlock>
        </div>
        <div id="paper-ml-test-score" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Breck et al. · The ML Test Score: A Rubric for ML Production Readiness (IEEE Big Data 2017)"
            citeKey={5}
            href="https://research.google/pubs/the-ml-test-score-a-rubric-for-ml-production-readiness-and-technical-debt-reduction/"
          >
            28 개 test·monitoring 항목 중 slice 별 품질 하한(Model 6), canary 로 트래픽 일부에만
            새 model 을 태우는 절차(Infra 6), 서빙 데이터의 품질 저하 monitoring(Monitor 7)을
            정의합니다. 전체 정확도가 1 % 오르고 한 국가 slice 가 50 % 떨어진 실제 사례를
            보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-kohavi" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Kohavi, Tang, Xu et al. · Online Randomized Controlled Experiments at Scale (Trials, 2020)"
            citeKey={6}
            href="https://pmc.ncbi.nlm.nih.gov/articles/PMC7007661/"
          >
            감지 가능한 효과와 필요한 표본 수가 제곱 관계라 효과가 절반이면 표본이 네 배 필요하다는
            것을 보이고, 대형 기술 기업이 실험당 수백만 사용자를 노출하며 연 2 만 건 이상의 A/B
            실험을 동시에 운영한다고 보고합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          평가 지표 자체의 정의(정확도·judge score·rubric 채점)는 앞선{" "}
          <Link to="/ai/prompt-structured-output#output-measurement">structured output 측정</Link>을
          참고하고, 실험 하나를 설계하고 판정하는 통계 규칙은{" "}
          <Link to="/ai/paired-experiment-design#overview">paired experiment design</Link>을
          그대로 씁니다.
        </p>
      </section>
    </div>
  );
}
