import HarnessWeightViz from "./viz/HarnessWeightViz";
import IterationViz from "./viz/IterationViz";
import { CitationBlock } from "@/components/ui/citation";

export default function Iteration() {
  return (
    <section id="iteration" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        반복 개선: 실패 trace를 하네스 자산으로 바꾼다
      </h2>
      <div className="not-prose mb-8">
        <IterationViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          개선 loop의 입력은 “결과가 별로였다”는 인상이 아니라 재현 가능한
          trace다. context가 부족했는지, tool 설명이 모호했는지, 권한이 없었는지,
          verifier가 잘못된 보상을 줬는지를 나눠야 올바른 계층을 고칠 수 있다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          먼저 실패 계층을 찾는다
        </h3>
        <p className="leading-7">
          필요한 문서를 못 찾았다면 context discovery를, tool argument를 반복해서
          틀렸다면 schema와 오류 메시지를, 위험한 경로로 샜다면 capability와
          checkpoint를 고쳐야 한다. 목표가 모호한데 reviewer를 하나 더 붙이거나,
          권한이 없는데 prompt를 길게 쓰는 식으로 다른 계층을 고치면 비용만
          늘어난다. 따라서 변경 전에는 실패 trace를 분류하고, 변경 후에는 그
          case와 기존 정상 case를 함께 돌리는 ablation이 필요하다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          공개 사례는 원리와 실험 조건을 나눠 읽는다
        </h3>
        <p className="leading-7">
          OpenAI가 공개한 2026년 사례는 소규모 팀이 Codex가 읽을 수 있는
          repository 구조, 테스트·CI, worktree별 실행 환경, UI·로그·metric 관측
          도구와 agent review loop를 만들고 수동 작성 코드를 0으로 제한한
          실험이다. 이 수치를 일반적인 개발 생산성 법칙으로 읽어서는 안 된다.
          재사용할 수 있는 핵심은 실패했을 때 같은 prompt를 반복한 것이 아니라,
          UI·로그·metric을 agent가 직접 관찰하고 검증할 수 있게 누락된 capability를
          시스템에 추가했다는 점이다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          모델이 바뀌면 하네스도 다시 ablation한다
        </h3>
        <p className="leading-7">
          규칙·agent·reviewer를 추가할 때마다 latency와 token cost, 충돌
          가능성도 늘어난다. Anthropic의 2026년 harness 설계 글은 planner,
          generator, evaluator를 쓴 장기 실행 구조를 설명하면서도, 구성 요소를
          하나씩 제거하는 ablation으로 실제 기여를 확인한다. 강한 모델에서는
          예전의 세부 지침이 오히려 탐색을 방해할 수 있으므로 model version이
          바뀔 때마다 각 장치가 여전히 load-bearing인지 다시 측정해야 한다.
        </p>

        <div className="not-prose mt-6 grid gap-4 lg:grid-cols-2">
          <div id="paper-openai-harness" className="scroll-mt-24">
            <CitationBlock
              source="OpenAI — Harness engineering"
              citeKey={2}
              href="https://openai.com/index/harness-engineering/"
            >
              Agent가 repository·UI·log·metric을 직접 읽고 검증하도록 만든 공개
              사례입니다. 특정 팀·model·repository의 결과이므로 수동 code 0을
              일반적인 생산성 법칙으로 확대하지 않습니다.
            </CitationBlock>
          </div>
          <div id="paper-anthropic-long-running-harness" className="scroll-mt-24">
            <CitationBlock
              source="Anthropic — Harness design for long-running apps"
              citeKey={3}
              href="https://www.anthropic.com/engineering/harness-design-long-running-apps"
            >
              Planner·generator·evaluator와 persistent state를 조합하고 요소를
              제거해 기여를 비교합니다. 모든 model에 세 역할이 항상 필요하다는
              뜻은 아니며 model이 바뀌면 같은 ablation을 다시 해야 합니다.
            </CitationBlock>
          </div>
        </div>
      </div>

      <div className="not-prose mt-8">
        <HarnessWeightViz />
      </div>
    </section>
  );
}
