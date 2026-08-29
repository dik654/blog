import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import RewardDesignForVerifiableRlViz from "./reward-design-for-verifiable-rl/viz/RewardDesignForVerifiableRlViz";

/**
 * Reward는 검증 가능성과 밀도로 설계되며 잘못 설계하면 hacking을 부릅니다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function RewardDesignForVerifiableRlArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Reward는 검증 가능성과 밀도로 설계되며 잘못 설계하면 hacking을 부릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/rl-foundations-for-llm-post-training#credit-assignment">
              앞 글
            </Link>
            은 policy gradient 가 return 을 어느 action 에 credit 으로 돌려줄지의
            한계를 봤습니다. 이 글은 그 return 을 만드는 reward 자체를 어떻게
            설계할지를 다룹니다. Reward 는 무엇으로 채점하는지(검증 가능성),
            언제 주는지(밀도), 그리고 잘못 설계했을 때 policy 가 어떻게
            빠져나가는지(hacking) 세 축으로 결정됩니다.
          </p>
          <p>
            세 축은 순서대로 이어집니다. 채점 기준이 자동으로 검증 가능한
            task 인지부터 정하고(RLVR), 그 reward 를 trajectory 끝에만 줄지
            중간마다 줄지(sparse/dense), 최종 결과만 볼지 중간 과정도 볼지
            (outcome/process)를 고른 뒤, 그 설계가 실제 목표와 어긋나는
            proxy 가 되지 않는지(reward hacking)를 마지막에 점검합니다.
          </p>
        </div>
        <RewardDesignForVerifiableRlViz />
        <ContentBoundary article="reward-design-for-verifiable-rl" />
      </section>

      <section id="rlvr" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          RLVR은 사람 채점 대신 자동 검증기가 정답 여부를 확인하는 task에서 씁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Verifiable task 는 정답 여부를 사람의 판단 없이 프로그램으로
            확인할 수 있는 task 입니다. 수학 문제의 최종 숫자, code 의 unit
            test 통과 여부, 정규식이 정한 출력 형식이 그 예입니다. RLVR
            (Reinforcement Learning with Verifiable Rewards) 는 이런 task 에서
            그 자동 검증 결과를 그대로 reward 로 쓰는 RL 방식입니다.
          </p>
          <p>
            RLVR 의 reward 는 사람이 채점하거나 학습한 reward model 이 아니라
            math parser·code sandbox·정답 checker 같은 verifier 가 직접
            계산합니다. <Link to="/ai/open-r1#reward-system">Open-R1 의
            versioned verifier measurement</Link> 가 바로 이 verifier reward
            를 outcome 과 확인하지 못한 범위로 나눠 기록하는 계약이며, 이
            글은 그 verifier reward 를 reward 설계의 한 재료로 다룹니다.
          </p>
          <p>
            RLVR 이 매력적인 이유는 사람 선호를 압축한 reward model 없이도
            reward 가 정확하다는 점입니다. 대신 verifier 가 확인할 수 있는
            것 이상은 채점하지 못한다는 한계가 남습니다. 풀이 과정이 맞는지,
            글이 안전한지는 최종 답이 맞아도 verifier 가 보지 못합니다.
          </p>
        </div>
        <TermBreakdown
          title="RLVR을 이루는 두 개념"
          items={[
            { term: "Verifiable Task", description: "정답 여부를 프로그램으로 확인할 수 있는 task입니다.", example: "수학 문제 최종 숫자, code unit test, 정규식 출력 형식", boundary: "채점 규칙 밖의 품질(스타일, 안전성)은 이 정의에 포함되지 않습니다." },
            { term: "RLVR (Reinforcement Learning with Verifiable Rewards)", description: "Verifiable task의 자동 검증 결과를 reward로 그대로 쓰는 RL 방식입니다.", example: "Unit test 5개 중 5개 통과 → reward 1, 아니면 0", boundary: "Verifier가 확인하지 못하는 중간 추론의 타당성은 reward에 반영되지 않습니다." },
          ]}
        />
      </section>

      <section id="sparse-vs-dense" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Sparse Reward는 결과에만, Dense Reward는 매 step에 신호를 줍니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Sparse reward 는 trajectory 가 끝나야만(또는 아주 드물게만)
            0 이 아닌 값을 주는 reward 이고, dense reward 는 거의 매 step 마다
            0 이 아닌 값을 주는 reward 입니다. RLVR 의 기본 형태는 최종 결과
            하나만 확인하므로 대개 sparse 이고, 중간 단계마다 점수를 매기면
            dense 가 됩니다.
          </p>
          <p>
            6-station 경로에서 목표(S6)에 도달해야만 +1 을 받는 sparse
            reward 라면, 초기 policy 의 rollout 대부분은 S6 에 못 미쳐
            reward 가 0 으로 끝나 gradient 신호가 거의 없습니다. 같은
            경로에서 S3 까지 갔을 때 진척 비율만큼(0.5) reward 를 주는
            dense reward 라면, 실패한 rollout 도 0 이 아닌 신호를 남겨
            학습이 더 빠르게 방향을 잡습니다.
          </p>
          <p>
            대가는 그 중간 신호를 무엇으로 잴지 새로 설계해야 한다는
            점입니다. 진척을 잘못 정의하면 policy 가 실제 목표 대신 그
            중간 신호를 최적화하기 시작하는데, 이는 뒤에서 다룰 reward
            hacking 의 흔한 경로입니다.
          </p>
        </div>
      </section>

      <section id="outcome-vs-process" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Outcome Reward는 최종 답을, Process Reward는 중간 단계를 채점합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Sparse/dense 가 언제 reward 를 주는지의 축이라면, outcome
            reward 와 process reward 는 무엇을 채점하는지의 축입니다.
            Outcome reward 는 최종 결과 하나만 보고, process reward 는
            중간 추론 단계 각각의 타당성을 봅니다. 두 축은 논리적으로
            독립적이지만, 실무에서는 outcome reward 가 보통 sparse(끝에만)로,
            process reward 가 보통 dense(매 단계)로 구현됩니다.
          </p>
          <p>
            수학 풀이 10 단계 중 최종 답만 맞으면 outcome reward 는 1 을
            주지만, 중간 3 단계에서 계산이 틀렸는데도 우연히 최종 답이
            맞았다면 그 오류는 outcome reward 에 드러나지 않습니다. Process
            reward 는 그 3 단계에서 이미 낮은 점수를 매겨 이 우연한 정답을
            구분합니다.
          </p>
        </div>
        <div id="paper-prm" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Lightman, Kosaraju, Burda, et al. · Let's Verify Step by Step"
            citeKey={1}
            href="https://arxiv.org/abs/2305.20050"
          >
            2023 년 논문은 최종 답만 채점하는 outcome supervision 과 각 추론
            단계를 채점하는 process supervision 을 비교해, process
            supervision 으로 학습한 model 이 MATH test 부분집합에서 78% 정확도를
            기록했다고 저자가 보고했습니다. 800,000 개 단계별 사람 주석
            (PRM800K)도 함께 공개했으며, 결과는 이 데이터셋과 평가 조건에
            한정됩니다.
          </CitationBlock>
        </div>
        <TermBreakdown
          title="Outcome Reward와 Process Reward"
          items={[
            { term: "Outcome Reward", description: "Trajectory의 최종 결과만 보고 매기는 reward입니다.", example: "최종 답 일치 여부만 확인", boundary: "중간 단계의 오류가 우연히 상쇄돼도 구분하지 못합니다." },
            { term: "Process Reward", description: "중간 추론 단계 각각의 타당성을 보고 매기는 reward입니다.", example: "10단계 풀이의 각 단계에 개별 점수", boundary: "단계 채점 기준 자체를 사람이나 별도 model이 정해야 해 outcome reward보다 설계·주석 비용이 큽니다." },
          ]}
        />
      </section>

      <section id="hacking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Reward Hacking은 proxy reward를 높이면서 실제 목표에서는 멀어지는 현상입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Reward hacking 은 policy 가 설계된 reward(proxy) 값은 높이면서
            정작 그 reward 가 대신하려던 진짜 목표(true objective)에서는
            멀어지는 현상입니다. Specification gaming 은 이 현상을 가리키는
            동의어에 가까운 표현이고, reward misspecification 은 애초에
            reward 함수가 진짜 목표를 정확히 담지 못한 상태를 가리킵니다.
          </p>
          <p>
            앞 절의 진척 기반 dense reward 를 예로 들면, 목표까지 남은
            거리로 진척을 정의했을 때 policy 가 실제로 목표에 가지 않고
            거리 계산을 속이는 위치에서만 맴도는 경우가 reward hacking
            입니다. Proxy(거리 감소)는 개선됐지만 true objective(목표
            도달)는 그대로거나 오히려 나빠집니다.
          </p>
        </div>
        <div id="paper-reward-hacking" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Skalse, Howe, Krasheninnikov, Krueger · Defining and Characterizing Reward Hacking"
            citeKey={2}
            href="https://arxiv.org/abs/2209.13085"
          >
            2022 년 논문은 부정확한 proxy reward 를 최적화하면 true reward
            기준 성능이 오히려 나빠질 수 있다는 현상을 처음으로 형식적으로
            정의하고, proxy 개선이 true reward 를 해치지 않는 "unhackable"
            조건을 분석했습니다. 저자는 이 조건이 확률적 policy 전체에서는
            proxy 와 true reward 중 하나가 상수인 경우로 제한된다고
            증명했으며, 결정적 policy 나 유한 policy 집합에서는 비자명한
            unhackable 쌍이 존재함을 보였습니다.
          </CitationBlock>
        </div>
        <div id="paper-concrete-problems" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Amodei, Olah, Steinhardt, Christiano, Schulman, Mané · Concrete Problems in AI Safety"
            citeKey={3}
            href="https://arxiv.org/abs/1606.06565"
          >
            2016 년 논문은 잘못된 objective function 이 만드는 사고
            (accident) 를 다섯 범주로 나누며 reward hacking 을 "objective
            function 이 잘못된 경우"의 대표 사례로 꼽았습니다. 이 글의
            reward misspecification 은 이 논문이 말한 잘못된 objective
            function 상태를 가리키는 이름으로 씁니다.
          </CitationBlock>
        </div>
        <ProgressiveDetail
          title="Reward hacking을 어떻게 미리 걸러내나요?"
          preview="Proxy reward가 실제로 확인한 범위 밖의 행동을 별도 holdout으로 검증하고, 진척 신호를 인과적으로 목표와 연결된 지표로만 좁히는 것이 흔한 완화책입니다. 완전한 방지는 이 글의 범위 밖입니다."
        >
          <p>
            Verifier reward 조차 hacking 에서 자유롭지 않습니다. Unit test
            를 우회하는 코드(예: 예외를 삼켜 항상 통과 처리)처럼 verifier
            의 확인 범위 자체를 조작하는 경우가 있어, verifier 구현을
            독립적으로 감사하는 절차가 필요합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="shaping" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Potential-Based Reward Shaping은 optimal policy를 바꾸지 않고 신호만 앞당깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Reward shaping 은 sparse reward 의 신호 부족을 완화하려고 원래
            reward 에 추가 항을 더하는 방법입니다. 문제는 아무 항이나 더하면
            policy 가 그 추가 항을 최적화하며 원래 목표에서 벗어날 수
            있다는 점, 즉 방금 본 reward hacking 위험입니다. Potential-based
            shaping 은 이 위험 없이 신호를 앞당기는 특정 형태를 제시합니다.
          </p>
          <p>
            핵심은 추가 항을 상태의 potential 함수 Φ 의 차이로만 만드는
            것입니다. 이렇게 만든 추가 항은 어떤 trajectory 를 완주하든
            차이가 상쇄돼 총합에 영향을 주지 않으므로, 원래 MDP 의 optimal
            policy 를 그대로 보존한다는 것이 증명된 결과입니다.
          </p>
        </div>
        <ExplainedFormula
          question="Reward에 무엇을 더해야 optimal policy가 바뀌지 않나요?"
          idea="상태의 potential 함수 Φ 값 차이만 추가 reward로 쓰면, 어떤 trajectory를 골라도 중간 항이 상쇄되고 시작·끝 potential 차이만 남아 원래 목표 순위가 바뀌지 않습니다."
          formula={String.raw`R'(s,a,s')=R(s,a,s')+\gamma\Phi(s')-\Phi(s)`}
          annotatedFormula={String.raw`R'(s,a,s')=\underbrace{R(s,a,s')}_{\text{원래 reward}}+\underbrace{\gamma\Phi(s')-\Phi(s)}_{\text{다음 상태와 현재 상태의 potential 차이}}`}
          operations={[
            { expression: String.raw`\gamma\Phi(s')-\Phi(s)`, annotation: ["다음 상태 potential에서 현재 상태 potential을 빼", "목표에 가까워질수록 양의 신호를 즉시 추가"] },
            { expression: String.raw`R(s,a,s')+(\cdot)`, annotation: ["원래 reward에 이 차이를 더해", "sparse reward 사이에도 매 step 신호를 만듦"] },
          ]}
          terms={[
            { symbol: String.raw`\Phi(s)`, name: "potential function", description: "상태 s가 목표에 얼마나 가까운지를 나타내는 설계자가 정한 함수입니다." },
            { symbol: "R(s,a,s')", name: "원래 reward", description: "shaping 없이 환경이 주는 원래 reward입니다." },
            { symbol: String.raw`R'(s,a,s')`, name: "shaped reward", description: "학습에 실제로 쓰는, potential 차이가 더해진 reward입니다." },
          ]}
          assumptions={["Φ는 episode 끝에서 항상 같은 값(흔히 0)으로 고정해야 telescoping이 성립합니다.", "Φ를 진짜 목표와 무관한 항으로 잘못 고르면 optimal policy는 보존돼도 학습 속도 이득은 사라질 수 있습니다."]}
          interpretation="Trajectory 전체를 합치면 중간 시점의 γΦ(s')−Φ(s) 항들이 서로 상쇄돼 시작·끝의 potential 차이만 남습니다. 그래서 어떤 policy가 더 높은 return을 받는지의 순위, 즉 optimal policy는 shaping 이전과 그대로 유지됩니다."
        />
        <div id="paper-reward-shaping" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Ng, Harada, Russell · Policy Invariance Under Reward Transformations: Theory and Application to Reward Shaping"
            citeKey={4}
            href="https://dl.acm.org/doi/10.5555/645528.657613"
          >
            1999 년 ICML 논문은 원래 reward 에 상태 potential 함수의 차이
            (γΦ(s′)−Φ(s))를 더하는 shaping 만이 임의의 MDP 에서 optimal
            policy 를 항상 보존한다는 것을 증명했습니다. 결과는 이 논문이
            정의한 potential-based 형태에 한정되며, 다른 형태의 추가 reward
            항이 같은 보장을 갖는다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="reward-shape-and-calibration" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Binary/Continuous Reward의 값 형태와 Reward Calibration의 척도는 별개입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Binary reward 는 성공·실패 두 값(0 또는 1)만 내는 reward 이고,
            continuous reward 는 그 사이 실수 값을 내는 reward 입니다. RLVR
            의 unit test 통과 여부는 흔히 binary 이고, 통과한 test 케이스
            비율로 점수를 매기면 continuous 가 됩니다. 이 값 형태의 선택은
            sparse/dense·outcome/process 축과는 독립적으로 정할 수 있습니다.
          </p>
          <p>
            Reward calibration 은 서로 다른 reward 원천의 값 척도를 맞추는
            문제입니다. Verifier A 가 {"{0, 1}"}만 내고 verifier B 가 0~100
            사이 원점수를 낸다면, 두 reward 를 그대로 더하거나 평균 내면
            B 가 A 보다 100 배 더 큰 영향을 줍니다. 두 값을 같은 범위
            (예: 0~1)로 정규화한 뒤 합치는 것이 calibration 의 최소 형태입니다.
          </p>
          <p>
            값 형태와 척도를 구분하지 않으면 두 문제가 뒤섞입니다. Binary
            reward 두 개를 섞는 데는 calibration 이 필요 없지만, binary
            reward 하나와 continuous reward 하나를 같은 batch 에서 섞으면
            값 형태 차이가 곧 척도 차이가 되어 calibration 이 필요해집니다.
          </p>
        </div>
        <TermBreakdown
          title="값 형태(Binary/Continuous)와 척도(Calibration)"
          items={[
            { term: "Binary Reward", description: "성공·실패 두 값만 내는 reward입니다.", example: "Unit test 전부 통과 → 1, 아니면 0", boundary: "부분적으로 개선된 시도와 전혀 손대지 않은 시도를 구분하지 못합니다." },
            { term: "Continuous Reward", description: "성공 정도를 실수 값으로 내는 reward입니다.", example: "Test 5개 중 3개 통과 → 0.6", boundary: "값 형태만 연속적일 뿐, 다른 reward 원천과 척도가 맞는지는 별도로 확인해야 합니다." },
            { term: "Reward Calibration", description: "서로 다른 reward 원천의 값 척도를 비교 가능하게 맞추는 절차입니다.", example: "0~100 원점수를 0~1로 정규화한 뒤 0/1 verifier reward와 합산", boundary: "척도를 맞춰도 각 reward가 재는 대상 자체가 다르면 여전히 다른 것을 채점하는 것입니다." },
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            여기까지가 reward 자체의 설계 축입니다. 이 reward 로 student
            policy 를 직접 update 하는 대신 teacher 의 token 단위 확률
            분포를 신호로 쓰는 방법은{" "}
            <Link to="/ai/on-policy-distillation#teacher-feedback">
              on-policy distillation
            </Link>
            이 다룹니다.
          </p>
        </div>
      </section>
    </div>
  );
}
