import ExplainedFormula from "@/components/ui/explained-formula";
import RewardBoundaryViz from "./viz/RewardBoundaryViz";

export default function RewardSystem() {
  return (
    <section id="reward-system" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Verifiable reward는 정답을 자동 채점하지만 reasoning 전체를 증명하지
        않는다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          수학 정답의 동치나 code test처럼 자동으로 확인할 수 있는 outcome은
          많은 rollout을 일관되게 채점할 수 있습니다. 이것이 RLVR의 장점이지만
          verifier는 실제 목표의 일부만 관측합니다. Parser가 읽지 못한 정답을
          0점으로 만들거나, 약한 test를 통과한 잘못된 code를 1점으로 만들 수
          있습니다.
        </p>
      </div>

      <RewardBoundaryViz />

      <ExplainedFormula
        question="여러 verifier를 쓸 때 completion 하나의 reward는 어떻게 만들어지는가?"
        idea={
          <>
            Correctness, format와 code execution처럼 서로 다른 reward
            component에 weight를 붙여 하나의 scalar로 만듭니다. 합친 뒤
            normalize할지 component별로 normalize한 뒤 합칠지도 relative
            advantage를 바꾸므로 명시해야 합니다.
          </>
        }
        formula={String.raw`r_i=\sum_{k=1}^{K}w_k\,R_k(q,o_i;v_k)`}
        terms={[
          {
            symbol: "q,o_i",
            name: "prompt와 completion",
            description: "문제 q와 현재 policy가 만든 i번째 응답입니다.",
          },
          {
            symbol: "R_k",
            name: "reward component",
            description:
              "정답 동치, format, code test 또는 judge rubric의 점수 함수입니다.",
          },
          {
            symbol: "v_k",
            name: "verifier version",
            description:
              "Parser·test set·sandbox image·judge prompt처럼 채점 결과를 바꾸는 artifact입니다.",
          },
          {
            symbol: "w_k",
            name: "component weight",
            description: "각 reward가 scalar 합계에 기여하는 상대 크기입니다.",
          },
        ]}
        assumptions={[
          "Reward component가 같은 방향으로 클수록 좋게 정의되어 있습니다.",
          "합산식은 일반 형태이며 실제 TRL의 multi-objective aggregation과 normalization 순서를 config에서 확인합니다.",
        ]}
        interpretation="Reward는 자연법칙이 아니라 versioned measurement program입니다. Weight나 parser를 바꾸면 같은 completion의 advantage도 바뀌므로 code·test·prompt를 model checkpoint와 함께 보존합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Format reward는 accessibility를 돕지만 correctness를 대체하지 않는다
        </h3>
        <p className="leading-8">
          <code>&lt;think&gt;</code>·<code>&lt;answer&gt;</code> tag를 맞추면
          parsing과 evaluation은 쉬워집니다. 그러나 tag 안에 긴 text가 있다는
          사실은 그 과정이 faithful하거나 정답에 기여했다는 뜻이 아닙니다.
          Correctness와 format을 분리해 보고하고, 빈 answer·반복
          token·불필요하게 긴 trace가 형식 점수를 얻는 shortcut을 adversarial
          example로 검사합니다.
        </p>

        <h3>Code reward는 sandbox를 training system의 일부로 만든다</h3>
        <p className="leading-8">
          Open-R1은 competitive programming solution을 test case로 실행하는
          reward와 여러 sandbox provider를 지원합니다. 이때 timeout, network
          egress, filesystem, secret와 nondeterminism이 reward 함수의 일부가
          됩니다. Sandbox queue가 밀려 timeout이 늘면 model quality가 아니라
          infrastructure 상태 때문에 reward distribution이 바뀔 수 있으므로
          verifier latency와 failure reason도 함께 기록해야 합니다. 격리 원리는{" "}
          <a href="/ai/agent-sandbox-security">에이전트 sandbox 보안</a>에서
          이어집니다.
        </p>

        <h3>Reward hacking은 높은 점수와 목표 달성을 분리해서 찾는다</h3>
        <p className="leading-8">
          Training reward와 held-out verifier 성능이 함께 오르는지 보고, 다른
          parser, stronger hidden tests와 사람이 검토한 sample로 교차
          확인합니다. 특히 answer length, zero-variance group, parse failure와
          reward component별 분포를 보면 policy가 문제를 더 잘 푸는 대신
          채점기의 빈틈을 배우는 징후를 찾을 수 있습니다.
        </p>
      </div>

      <div
        id="standard-open-r1-reward"
        className="not-prose my-8 scroll-mt-24 border-l border-border pl-4"
      >
        <p className="text-xs font-bold text-foreground">
          공식 구현 · Open-R1 reward와 code sandbox
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Open-R1은 math answer와 competitive-programming output을 자동으로
          확인하는 reward code를 제공하지만, 실제 측정 대상은 parser와 test가
          관측한 결과입니다. 같은 model output도 parser commit·test revision·
          sandbox timeout이 바뀌면 reward가 달라질 수 있으므로 세 항목을 model
          밖의 versioned evaluator artifact로 다뤄야 합니다. 저장소 지원 범위가
          reasoning 과정 전체의 사실성이나 안전성을 검증한다는 뜻은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://github.com/huggingface/open-r1"
          target="_blank"
          rel="noreferrer"
        >
          공식 reward·training 구현의 현재 범위 보기
        </a>
      </div>
    </section>
  );
}
