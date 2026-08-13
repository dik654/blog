import PlanStateViz from "./viz/PlanStateViz";
import VerificationLoopViz from "./viz/VerificationLoopViz";
import { CitationBlock } from "@/components/ui/citation";

export default function PlanExecute() {
  return (
    <section id="plan-execute" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Plan은 처음 만든 문장이 아니라 dependency·artifact·evidence를 가진 갱신
        가능한 state다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Plan-and-execute는 목표를 task로 나누고 각 task 실행을 분리합니다.
          장기 작업에서 누락을 줄이려면 task마다 입력 dependency, 기대 artifact,
          owner, status와 completion evidence를 저장해야 합니다. “조사하기”처럼
          결과가 무엇인지 없는 항목은 실행 여부를 판정할 수 없고, 첫 plan을
          고정하면 새로운 관찰과 충돌합니다.
        </p>
      </div>

      <PlanStateViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Replanning은 실패를 숨기는 재시도가 아니라 state transition이다</h3>
        <p className="leading-8">
          Tool result가 가정을 깨면 affected task와 downstream dependency를 다시
          pending으로 돌리거나 대체 경로를 추가합니다. 이미 검증된 artifact까지
          무조건 재생성하지 않도록 immutable evidence와 version을 남깁니다.
          Run이 중단돼도 checkpoint에서 이어갈 수 있어야 “완료했다”는 model
          summary가 아니라 registry state로 진행률을 판단할 수 있습니다.
        </p>
      </div>

      <VerificationLoopViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Reflection은 feedback source가 있을 때 다음 시도를 바꾼다</h3>
        <p className="leading-8">
          Reflexion은 task feedback을 언어적 reflection으로 바꾸어 다음 trial의
          memory에 넣습니다. 그러나 model이 자기 답을 한 번 더 읽는 것만으로
          오류가 발견된다는 보장은 없습니다. Compiler·test·schema·retrieval
          citation·domain rubric·human review처럼 실패를 관측하는 feedback
          source가 먼저 있어야 하며, reflection에는 원인·수정 대상·재검증 조건을
          연결해야 합니다.
        </p>
        <div id="paper-reflexion" className="not-prose mt-6 scroll-mt-24">
          <CitationBlock
            source="Reflexion: Language Agents with Verbal Reinforcement Learning"
            citeKey={2}
            href="https://arxiv.org/abs/2303.11366"
          >
            Environment·heuristic·self-evaluation feedback을 언어적 reflection과
            episodic memory로 바꿔 다음 trial에 사용합니다. 이는 model이 근거
            없이 자기 답을 다시 읽기만 해도 오류를 고친다는 뜻이 아니며,
            feedback source와 논문 task 조건이 성능의 전제입니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
