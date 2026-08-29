import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SyntheticDataAndDataFlywheelViz from "./synthetic-data-and-data-flywheel/viz/SyntheticDataAndDataFlywheelViz";

/**
 * 합성 데이터와 data flywheel: self-instruct·verifier filtering·trajectory mining
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function SyntheticDataAndDataFlywheelArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          합성 데이터는 사람이 못 채우는 학습 데이터 공백을 모델 스스로 채웁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Synthetic data generation은 사람이 직접 쓴 예시 대신, LLM 자신이나 더 강한
            teacher model이 만들어 낸 instruction·response·reasoning trace를 학습 데이터로
            쓰는 방법입니다. 사람이 라벨을 다는 속도로는 수십만 개 규모의 다양한 instruction을
            감당할 수 없기 때문에, 생성·검증·재학습을 자동으로 도는 절차가 그 자리를 대신합니다.
          </p>
          <p>
            이 글은 그 절차를 다섯 단계로 나눠 봅니다. 먼저 teacher-generated·self-generated
            데이터를 어떻게 만드는지(Self-Instruct·Evol-Instruct), 만든 후보를 verifier·model로
            어떻게 거르는지(best-of-N 생성과 quality thresholding)를 봅니다.
          </p>
          <p>
            이어서 남은 문제를 난이도로 어떻게 줄 세우는지(difficulty estimation과 curriculum
            sampling), 모델이 틀리는 사례를 어떻게 우선 모으는지(hard-example mining), 그리고
            이 모든 단계가 하나의 순환 고리(data flywheel)로 어떻게 이어지는지를 순서대로
            다룹니다.
          </p>
          <p>
            Teacher output을 student에 어떤 loss로 전달하는지는{" "}
            <Link to="/ai/knowledge-distillation#overview">지식 증류</Link> 글의 정본이고,
            reasoning trace를 verifier·GRPO로 다시 학습하는 절차는{" "}
            <Link to="/ai/open-r1#data-pipeline">Open-R1</Link> 글이 다룹니다. 이 글은 그 앞
            단계, 즉 학습에 쓸 후보 데이터 자체를 어떻게 만들고 거르고 다음 라운드로 되먹임하는지에만
            집중합니다.
          </p>
        </div>
        <ContentBoundary article="synthetic-data-and-data-flywheel" />
      </section>

      <section id="generation-sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Synthetic data는 teacher가 만들거나 모델이 스스로 만들어 냅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Synthetic data generation은 생성 주체를 기준으로 두 갈래로 나뉩니다.
            Teacher-generated data는 학습 대상보다 강한 별도 model(흔히 더 큰 proprietary
            model)이 만든 output을 가져다 쓰는 방식이고, self-generated data는 학습 대상
            자신이거나 그와 같은 계열의 model이 만든 output을 다시 그 model 학습에 쓰는
            방식입니다.
          </p>
          <p>
            Self-Instruct는 self-generated data를 만드는 대표적인 절차입니다. 사람이 직접 쓴
            175개의 seed task에서 출발해, instruction generation·classification task
            식별·instance generation·filtering 네 단계를 반복합니다.
          </p>
          <p>
            매 라운드에서 새로 생성된 instruction은 기존 instruction과 ROUGE-L 유사도가 0.7
            미만일 때만 task pool에 다시 추가되어, 175개였던 seed가 최종 52,445개의
            instruction과 82,439개의 input-output instance로 불어납니다.
          </p>
          <p>
            Evol-Instruct는 같은 self-generated 계열이지만 난이도를 직접 조작합니다. Alpaca의
            52,000개 instruction을 seed로 놓고, In-Depth Evolving으로 제약 추가·deepening·
            concretizing·추론 단계 증가·입력 확장 다섯 방법 중 하나를 적용해 한 instruction을
            더 어렵게 다시 쓰거나, In-Breadth Evolving으로 같은 영역의 더 드문 새 instruction을
            만듭니다.
          </p>
          <p>
            정보 이득이 없거나 모델이 답을 만들지 못하는 진화 결과는 Elimination Evolving으로
            걸러 냅니다.
          </p>
          <p>
            이 진화를 4 epoch 반복하면 seed 52,000개가 250,000개 instruction으로 늘어나고,
            그 가운데 70,000개를 뽑아 학습한 WizardLM-13B는 사람 평가에서 Alpaca·Vicuna보다
            높은 승률을 기록했습니다. 두 절차 모두 이 글이 정본으로 다루는 생성 단계이며,
            생성된 문자열을 어떤 loss로 student에 전달하는지는{" "}
            <Link to="/ai/knowledge-distillation#soft-target">지식 증류</Link> 글의 범위입니다.
          </p>
        </div>
        <TermBreakdown
          title="생성 소스를 이루는 다섯 개념"
          description="누가 만들었는지와 어떤 절차로 늘렸는지는 서로 다른 축입니다."
          items={[
            { term: "Synthetic Data Generation", description: "사람이 아니라 model이 만든 학습 데이터를 쓰는 방법 전체를 가리킵니다.", example: "175개 seed task에서 52,445개 instruction으로 확장.", boundary: "생성했다는 사실만으로 품질을 보장하지 않으며 이후 필터링이 필요합니다." },
            { term: "Teacher-Generated Data", description: "학습 대상보다 강한 별도 model이 만든 output을 가져다 씁니다.", example: "더 큰 model의 reasoning trace를 student SFT target으로 사용.", boundary: "Teacher의 style·오류까지 student가 그대로 물려받을 수 있습니다." },
            { term: "Self-Generated Data", description: "학습 대상 자신이나 같은 계열 model이 만든 output을 다시 학습에 씁니다.", example: "Self-Instruct·Evol-Instruct가 만든 instruction.", boundary: "필터링 없이 그대로 재학습하면 원래 model의 편향이 반복·증폭됩니다." },
            { term: "Self-Instruct", description: "175개 seed task를 GPT로 확장하는 4단계 bootstrap 절차입니다.", example: "ROUGE-L<0.7 필터를 통과한 instruction만 pool에 재투입.", boundary: "classification·non-classification 판별과 similarity 필터가 정확해야 다양성이 유지됩니다." },
            { term: "Evol-Instruct", description: "제약 추가·추론 단계 증가 같은 In-Depth Evolving으로 난이도를 높입니다.", example: "52,000개 Alpaca seed를 4 epoch 진화해 250,000개로 확장.", boundary: "Elimination Evolving 기준이 느슨하면 저품질 진화 결과가 섞여 들어갑니다." },
          ]}
        />
      </section>

      <section id="verifier-filtering" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Best-of-N 생성은 verifier·model 필터로 상위 후보만 남깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Best-of-N data generation은 같은 문제에서 N개의 독립적인 후보를 만든 뒤, 정답
            여부를 판정할 수 있는 verifier나 판단을 대신하는 model로 각 후보를 채점해 기준을
            넘는 것만 학습 데이터로 남기는 방법입니다. 후보를 많이 만들수록 그중 하나가 정답일
            확률은 올라가지만, 그만큼 채점·필터링 비용도 함께 늘어납니다.
          </p>
          <p>
            Verifier-filtered data는 정답 여부를 규칙으로 확인할 수 있는 경우(수학 계산, 코드
            테스트 통과 여부)에 그 규칙으로 후보를 거른 데이터이고, model-filtered data는 정답
            규칙이 없는 열린 작업에서 또 다른 LLM을 judge로 세워 점수를 매긴 데이터입니다.
          </p>
          <p>
            Verifier는 결정적이고 재현 가능하지만 규칙을 만들 수 있는 영역에서만 쓸 수 있고,
            model filtering은 어떤 작업에도 쓸 수 있는 대신 judge 자체의 오차를 물려받습니다.
          </p>
          <p>
            Yuan 등의 rejection sampling fine-tuning(RFT)은 이 절차의 구체적인 수치를
            보여 줍니다. 문제 하나당 온도 0.7로 k=100개의 reasoning path를 생성한 뒤, 정답과
            어긋나거나 계산이 틀린 경로를 verifier로 제거하고, 같은 방정식 리스트를 쓰는
            중복 경로는 하나만 남깁니다. 이렇게 필터링한 약 10만 개 샘플로 다시 학습한
            LLaMA-7B는 GSM8K 정확도가 35.9%에서 49.3%로 올라갔습니다.
          </p>
          <p>
            Quality thresholding은 verifier·model 점수에 상위 몇 퍼센트만 남길지 정하는
            기준선입니다. 문제당 100개 후보 중 verifier를 통과한 상위 20%만 남기는 식으로
            기준을 조이면, 남는 데이터 양은 줄지만 평균 품질은 올라갑니다.
          </p>
          <p>
            <Link to="/ai/search-based-reasoning-and-test-time-compute#best-of-n">
              추론 시점 best-of-N
            </Link>{" "}
            글은 verifier 점수가 가장 높은 후보 하나를 답으로 채택하는 병목, 즉 그 자리에서
            쓸 답 하나를 고르는 문제를 다룹니다. 이 글의 best-of-N data generation은 같은
            생성·채점 구조를 쓰지만 병목이 다릅니다. 답 하나를 고르는 게 아니라 threshold를
            넘는 후보 여러 개를 나중에 학습에 쓸 데이터로 보존해야 하므로, 새로 드는 비용은
            채점한 후보 전체를 저장하고 dedup하는 데이터 관리 비용입니다.
          </p>
        </div>
        <ExplainedFormula
          question="문제당 후보를 N개 생성하면 그중 하나가 verifier를 통과할 확률은 어떻게 커지나요?"
          idea="문제마다 정답 후보 c개를 이미 알고 있다면, n개 중 k개를 뽑았을 때 전부 오답일 경우의 수를 1에서 빼면 적어도 하나가 정답일 확률이 됩니다."
          formula={String.raw`\text{pass@}k := \mathbb{E}_{\text{Problems}}\!\left[\,1-\dfrac{\binom{n-c}{k}}{\binom{n}{k}}\,\right]`}
          annotatedFormula={String.raw`\text{pass@}k := \mathbb{E}_{\text{Problems}}\!\left[\,1-\underbrace{\dfrac{\binom{n-c}{k}}{\binom{n}{k}}}_{\text{k개 모두 오답일 확률}}\,\right]`}
          operations={[
            { expression: String.raw`n`, annotation: ["문제 하나당 실제로 생성한 후보 총 개수로", "RFT 실험에서는 k=100까지 씀"] },
            { expression: String.raw`c`, annotation: ["n개 후보 중 verifier가 정답으로 확인한 개수로", "difficulty estimation의 pass rate 계산과 같은 값"] },
            { expression: String.raw`\binom{n-c}{k}/\binom{n}{k}`, annotation: ["오답 (n-c)개 중에서만 k개를 뽑을 경우의 수를", "전체 n개 중 k개를 뽑는 경우의 수로 나눈 비율"] },
          ]}
          terms={[
            { symbol: "n", name: "생성 후보 수", description: "문제 하나당 만든 candidate 총 개수" },
            { symbol: "c", name: "정답 후보 수", description: "verifier가 맞다고 판정한 candidate 개수" },
            { symbol: "k", name: "채점·보존 예산", description: "실제로 채점하거나 남길 후보 수(k ≤ n)" },
          ]}
          assumptions={["Verifier가 각 후보의 정답 여부를 오류 없이 판정한다고 가정합니다.", "n개 후보는 서로 독립적으로 생성됐다고 가정합니다."]}
          interpretation="N을 키우면 적어도 하나가 verifier를 통과할 확률은 단조 증가하지만, 그만큼 채점·저장 비용도 커지므로 이 식은 필터링 후 남는 데이터 양이 아니라 통과 확률만 알려 줍니다."
        />
        <TermBreakdown
          title="Best-of-N 생성과 필터링을 이루는 네 개념"
          items={[
            { term: "Best-of-N Data Generation", description: "같은 문제에서 N개 후보를 만들어 채점 대상 pool을 만듭니다.", example: "GSM8K 문제당 k=100개 reasoning path 생성.", boundary: "N을 키울수록 통과 확률은 오르지만 채점 비용도 같이 오릅니다." },
            { term: "Verifier-Filtered Data", description: "정답 규칙으로 후보를 판정해 거른 데이터입니다.", example: "계산 결과 불일치·방정식 중복을 규칙으로 제거.", boundary: "규칙을 만들 수 없는 열린 작업에는 쓸 수 없습니다." },
            { term: "Model-Filtered Data", description: "다른 LLM을 judge로 세워 점수를 매겨 거른 데이터입니다.", example: "정답 규칙이 없는 대화 응답을 judge model 점수로 채점.", boundary: "judge model 자체의 편향·오차를 그대로 물려받습니다." },
            { term: "Quality Thresholding", description: "verifier·model 점수의 상위 몇 퍼센트만 남길지 정하는 기준선입니다.", example: "채점 통과 후보 중 상위 20%만 학습 데이터로 유지.", boundary: "기준을 너무 조이면 남는 데이터가 줄어 다양성이 떨어집니다." },
          ]}
        />
      </section>

      <section id="difficulty-curriculum" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Difficulty estimation은 pass rate로 재고 curriculum이 순서를 정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Difficulty estimation은 한 문제에 여러 후보를 생성했을 때 그중 몇 개가 verifier를
            통과했는지, 즉 pass rate로 난이도를 재는 방법입니다. Pass rate가 낮을수록 현재
            모델에게 그 문제는 어렵다는 뜻이고, 이 값이 앞 절 best-of-N 채점에서 이미 계산해
            둔 c/n과 같은 수치입니다.
          </p>
          <p>
            문제당 k=8개를 생성했다고 하면, 8개 모두 정답인 문제(pass rate 100%)는 지금
            모델에게 이미 쉬운 문제이고, 0개만 정답인 문제(pass rate 0%)는 verifier 신호 자체가
            없어 어느 후보를 남겨도 학습에 쓸 근거가 없습니다. 3개만 정답인 문제(pass rate
            37.5%)는 정답과 오답이 함께 있어 두 부류의 차이를 학습에 담을 수 있는 중간
            난이도입니다.
          </p>
          <p>
            Difficulty filtering은 이 극단, 즉 pass rate가 0%이거나 100%인 문제를 curriculum
            에서 제외하는 단계입니다. 남은 문제에는 curriculum sampling이 적용되어, 중간
            난이도 문제일수록 더 자주 뽑히도록 가중치를 주고 학습 순서를 정합니다.
          </p>
          <p>
            문제당 pass rate를 재려면 매 라운드 checkpoint로 다시 k개를 굴려야 하므로,
            difficulty estimation은 데이터 생성 자체보다 추론 비용이 더 듭니다.{" "}
            <Link to="/ai/train-validation-test#overview">
              평가용 held-out set
            </Link>
            으로 모델의 전체 성능을 재는 것과, curriculum sampling에 넣을 문제 pool의 난이도를
            재는 것은 목적이 다른 별개의 측정입니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Pass rate 0%인 문제를 아예 버리지 않고 다음 라운드로 넘기면 안 되나요?"
          preview="Verifier 신호가 전혀 없는 문제는 지금 학습에는 못 쓰지만, 모델이 더 강해진 다음 라운드에서는 신호가 생길 수 있어 완전히 버리지 않고 대기열로 남겨 두는 편이 안전합니다."
        >
          <p>
            0%였던 문제를 폐기하면 그 문제가 실제로 풀 수 없는 문제인지, 지금 모델이 아직
            못 미치는 문제인지 구분할 수 없습니다. 다음 라운드 seed pool에 남겨 두고 모델이
            개선된 뒤 다시 채점하면, 그때는 pass rate가 0%보다 커져 curriculum에 들어올 수
            있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="trajectory-mining" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Hard-example mining은 모델이 틀리는 예시를 우선 모아 다음 학습에 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Failure mining은 verifier나 judge가 실패로 판정한 output을 따로 모으는 절차이고,
            hard-example mining은 그중에서도 pass rate가 낮은 문제를 우선순위를 두고 더 많이
            수집하는 전략입니다. 둘 다 difficulty estimation이 이미 계산해 둔 낮은 pass rate를
            수집 대상을 고르는 신호로 다시 씁니다.
          </p>
          <p>
            Success trajectory mining은 반대로 verifier를 통과한 성공 reasoning trace를 모아
            SFT target으로 삼는 절차이고, failure trajectory mining은 실패한 시도의 중간 추론
            단계까지 포함한 전체 trace를 보존해 그 실패가 어디서 갈렸는지 분석하거나 다음 학습
            신호로 재활용할 수 있게 남겨 두는 절차입니다.
          </p>
          <p>
            Luo 등의 Arena Learning은 이 수집을 배틀 형식으로 구현합니다. WizardArena
            파이프라인이 여러 model끼리 같은 질문에 답하게 하고 승패를 판정해, 대상 model이
            진 사례에서 "그 모델의 약점을 드러내는" 데이터만 골라 다음 SFT·RL 라운드 학습
            데이터로 재사용합니다.
          </p>
          <p>
            Success trajectory mining만 반복하면 이미 잘 푸는 문제의 정답 패턴만 계속 쌓여
            모델이 이미 잘하는 영역만 강화됩니다. 반대로 failure·hard-example mining이 다음
            라운드 seed로 들어가야, 생성 단계가 지금 모델이 못 푸는 문제 쪽으로 다시 향하고
            그 결과 학습 데이터의 난이도 분포 자체가 바뀝니다. 이 재투입이 다음 절에서 다룰
            data flywheel의 회전을 만드는 핵심 지점입니다.
          </p>
        </div>
        <TermBreakdown
          title="Trajectory mining을 이루는 네 개념"
          items={[
            { term: "Failure Mining", description: "verifier·judge가 실패로 판정한 output을 모읍니다.", example: "GSM8K 채점에서 오답으로 확인된 reasoning path 수집.", boundary: "실패 output 자체를 그대로 SFT target으로 쓸 수는 없습니다." },
            { term: "Hard-Example Mining", description: "pass rate가 낮은 문제를 우선순위를 두고 더 많이 수집합니다.", example: "pass rate 37.5% 이하 문제만 다음 라운드 seed 후보로 승격.", boundary: "우선순위를 너무 좁히면 수집 데이터의 주제 다양성이 줄어듭니다." },
            { term: "Success Trajectory Mining", description: "verifier를 통과한 성공 reasoning trace를 SFT target으로 모읍니다.", example: "정답과 일치하는 reasoning path만 다음 SFT 데이터로 채택.", boundary: "성공 사례만 쌓으면 이미 잘하는 문제만 반복 강화됩니다." },
            { term: "Failure Trajectory Mining", description: "실패한 시도의 중간 추론 단계까지 보존해 분석·재활용합니다.", example: "WizardArena에서 진 대화의 전체 turn을 보존해 다음 학습에 재사용.", boundary: "중간 단계를 보존해도 그 자체가 왜 틀렸는지 자동으로 설명해 주지는 않습니다." },
          ]}
        />
      </section>

      <section id="flywheel-loop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Data flywheel은 실패 사례를 다음 seed로 되돌려 모델을 계속 개선합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Data flywheel은 데이터를 생성하고, 거르고, 그 데이터로 모델을 학습하고, 학습된
            모델이 만든 실패·성공 trajectory를 다시 다음 라운드의 seed로 되돌리는 순환
            구조입니다. NVIDIA는 이를 "AI 상호작용에서 수집한 데이터로 모델을 계속 다듬어
            더 나은 결과와 더 가치 있는 데이터를 만드는 self-improving loop"라고 정의합니다.
          </p>
          <p>
            Feedback data는 이 순환에 다시 투입되는 관측치 전체를 가리키는 말로, verifier
            판정 결과·hard-example·battle 승패가 모두 여기에 포함됩니다. Data feedback loop는
            그 재투입 경로 자체를 가리키는 더 일반적인 용어로, 생성형 데이터가 아니어도
            추천 시스템의 클릭 로그 같은 경우에도 똑같이 쓰입니다. Data flywheel은 그중에서도
            model이 스스로 만든 데이터로 도는 경우를 가리키는 구체적인 이름입니다.
          </p>
          <p>
            Arena Learning은 이 순환으로 WizardLM-2를 개선했습니다. 한 라운드에서 배틀에 진
            사례를 모아 다음 SFT·RL 데이터로 학습하면, 다음 라운드 배틀에서는 이전 약점이
            메워진 자리에서 새로운 약점이 드러나 그 약점이 다시 다음 라운드 데이터가 됩니다.
          </p>
          <p>
            Loop가 항상 저절로 돌지는 않습니다. 초기 모델이 너무 약하면 모든 문제의 pass
            rate가 0%에 가까워 verifier 신호 자체가 없고, difficulty filtering이 그 문제
            전부를 걸러내 curriculum에 남는 데이터가 사라집니다. 반대로 teacher 없이 모델
            혼자 도는 loop는 원래 가진 편향을 매 라운드 증폭시킬 수 있어,{" "}
            <Link to="/ai/knowledge-distillation#release-gate">지식 증류</Link> 글의
            student-only 검증과 같은 독립적인 정지 기준이 필요합니다.
          </p>
        </div>
        <SyntheticDataAndDataFlywheelViz />
        <AlgorithmBlock
          title="Data flywheel 한 바퀴: seed pool에서 다음 seed pool까지"
          input={[
            "Seed pool(첫 라운드는 사람이 쓴 seed task, 이후는 이전 라운드의 실패·성공 trajectory)",
            "생성 모델(teacher 또는 현재 policy)과 verifier 또는 judge model",
            "difficulty threshold, quality threshold",
          ]}
          steps={[
            { code: "candidates ← generate(seed_pool, N)", note: "Self-Instruct·Evol-Instruct처럼 teacher-generated 또는 self-generated 방식으로 문제당 N개 후보를 만듭니다." },
            { code: "scored ← verify_or_judge(candidates)", note: "Verifier(규칙 판정) 또는 model(judge 점수)로 각 후보를 채점합니다." },
            { code: "kept ← quality_threshold(scored, top_k_percent)", note: "채점 상위 몇 퍼센트만 남겨 verifier-filtered·model-filtered 데이터를 확정합니다." },
            { code: "p̂ ← pass_rate(kept); curriculum ← curriculum_sample(kept, p̂)", note: "Difficulty filtering으로 p̂∈{0,1} 문제를 빼고, 남은 문제를 난이도 가중치로 뽑습니다." },
            { code: "model ← train(model, curriculum)", note: "SFT 또는 RL로 curriculum 데이터를 학습에 반영합니다." },
            { code: "failures, successes ← mine_trajectories(model, eval_pool)", note: "갱신된 model을 다시 채점해 hard-example·failure trajectory와 success trajectory를 나눠 수집합니다." },
            { code: "seed_pool ← failures ∪ successes", note: "수집된 trajectory가 다음 라운드의 seed_pool이 되어 loop가 한 바퀴 닫힙니다." },
          ]}
          output="라운드마다 갱신되는 model checkpoint와, 그 checkpoint의 약점을 반영한 다음 seed pool"
          repeatUntil="성능 개선 폭이 threshold 이하로 줄어들거나, curriculum에 남는 문제(0<p̂<1)가 사라질 때까지"
        />
      </section>

      <section id="sources" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          근거는 데이터 생성 논문 두 편과 필터링·flywheel 사례 네 편으로 나뉩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Self-Instruct·Evol-Instruct의 수치는 두 논문의 본문과 실험 절에서 그대로
            가져왔습니다.
          </p>
          <p>
            Best-of-N 필터링과 pass@k 식은 각각 RFT 논문과 Codex 논문의 저자 자기보고
            수치이며, data flywheel의 공식 정의와 배틀 기반 사례는 NVIDIA 용어집과 Arena
            Learning 논문을 근거로 삼았습니다.
          </p>
        </div>
        <div id="paper-self-instruct" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Wang, Kordi, Mishra, Liu, Smith, Khashabi, Hajishirzi · Self-Instruct: Aligning Language Models with Self-Generated Instructions (2022)"
            citeKey={1}
            href="https://arxiv.org/abs/2212.10560"
          >
            사람이 쓴 175개 seed task에서 instruction generation·classification 판별·instance
            generation·filtering 네 단계를 반복해 52,445개 instruction과 82,439개 instance를
            만들고, 이 데이터로 GPT-3를 fine-tune해 Super-NaturalInstructions에서 33%p 절대
            향상을 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-evol-instruct" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Xu, Sun, Zheng, Geng, Zhao, Lin, Jiang · WizardLM: Empowering Large Language Models to Follow Complex Instructions (2023)"
            citeKey={2}
            href="https://arxiv.org/abs/2304.12244"
          >
            Alpaca의 52,000개 instruction을 seed로 In-Depth·In-Breadth Evolving을 4 epoch
            반복해 250,000개로 확장하고, Elimination Evolving으로 저품질 결과를 제거합니다.
            이 데이터로 학습한 WizardLM-13B는 사람 평가에서 Alpaca·Vicuna보다 높은 승률을
            보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-rft" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Yuan, Yuan, Li, Dong, Lu, Tan, Zhou, Zhou · Scaling Relationship on Learning Mathematical Reasoning with Large Language Models (2023)"
            citeKey={3}
            href="https://arxiv.org/abs/2308.01825"
          >
            문제당 k=100개 reasoning path를 생성해 정답 불일치·계산 오류를 verifier로 제거하고
            방정식 리스트 기준 중복을 제거하는 rejection sampling fine-tuning을 제안하며,
            LLaMA-7B의 GSM8K 정확도를 35.9%에서 49.3%로 끌어올렸다고 보고합니다.
          </CitationBlock>
        </div>
        <div id="paper-codex-passk" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Chen, Tworek, Jun, Yuan, Pinto et al. · Evaluating Large Language Models Trained on Code (2021)"
            citeKey={4}
            href="https://arxiv.org/abs/2107.03374"
          >
            문제당 n=200개 샘플을 생성하고 정답 개수 c를 확인한 뒤 조합으로 계산하는 pass@k
            불편추정량을 제안해, k개만 뽑아 추정할 때 생기는 큰 분산 문제를 해결합니다.
          </CitationBlock>
        </div>
        <div id="paper-nvidia-flywheel" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="NVIDIA · Data Flywheel (공식 용어집)" citeKey={5} href="https://www.nvidia.com/en-us/glossary/data-flywheel/">
            AI data flywheel을 "AI 상호작용이나 프로세스에서 수집한 데이터로 모델을 계속
            다듬어 더 나은 결과와 더 가치 있는 데이터를 만드는 self-improving loop"로
            정의합니다.
          </CitationBlock>
        </div>
        <div id="paper-arena-learning" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Luo, Suo, Lu, Xu, Chen, Yang, Weng, Cheng, Tao, Zhu, Lin, Jiang · Arena Learning: Build Data Flywheel for LLMs Post-training via Simulated Chatbot Arena (2024)"
            citeKey={6}
            href="https://arxiv.org/abs/2407.10627"
          >
            여러 model이 같은 질문에 답하고 승패를 매기는 WizardArena 배틀로 대상 model의
            약점을 드러내는 사례만 골라 다음 SFT·RL 라운드 데이터로 재사용하는 data flywheel을
            제안하고, 이 절차가 WizardLM-2 개선에 쓰였다고 보고합니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          생성된 reasoning trace를 verifier·GRPO로 학습하는 절차는{" "}
          <Link to="/ai/open-r1#data-pipeline">Open-R1</Link> 글을, teacher output을 어떤
          loss로 student에 전달하는지는{" "}
          <Link to="/ai/knowledge-distillation#overview">지식 증류</Link> 글을 참고하세요.
        </p>
      </section>
    </div>
  );
}
