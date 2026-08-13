import CompositionViz from "./viz/CompositionViz";
import RunContractViz from "./viz/RunContractViz";

export default function Composition() {
  return (
    <section id="composition" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        구성: 요청을 실행 가능한 run contract로 바꾼다
      </h2>
      <div className="not-prose mb-8">
        <CompositionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          여기서 contract는 모델과 약속을 맺는다는 비유가 아니라, 소프트웨어에서
          말하는 입력·출력·권한·오류 조건의 명세다. 자연어 요청을 그대로 agent에
          넘기면 “완료”의 뜻과 허용된 영향 범위가 매 run마다 달라진다. 반면 아래
          여섯 경계를 명시하면 모델이 바뀌어도 runtime이 지켜야 할 조건은
          안정적으로 남는다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          1. Objective와 acceptance: 무엇이 끝인가
        </h3>
        <p className="leading-7">
          “앱을 완성해라”는 방향은 주지만 종료 조건은 주지 않는다. 대신 어떤
          사용자 흐름이 동작해야 하고, 어떤 테스트와 품질 기준을 통과해야 하며,
          결과물은 어디에 남아야 하는지를 함께 적는다. 큰 목표를 issue나 execution
          plan으로 나눌 때도 각 항목에 산출물과 완료 evidence가 있어야 조기 완료를
          막을 수 있다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          2. Context discovery: 문서 묶음보다 찾는 경로
        </h3>
        <p className="leading-7">
          AGENTS.md 같은 진입 문서에는 항상 적용되는 규칙과 상세 문서의 위치를
          두고, 코드 구조·운영 절차·실험 기록은 각 원본으로 찾아가게 한다. 긴
          지침 하나에 모든 내용을 넣으면 관련 없는 정보가 현재 task를 밀어내고
          문서도 금세 낡는다. 그래서 context engineering은 많이 넣는 기술이
          아니라, 필요한 순간에 정본을 발견하고 오래된 context를 compaction하는
          기술에 가깝다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          3. Tool schema와 capability: 호출 가능과 실행 허용은 다르다
        </h3>
        <p className="leading-7">
          모델이 함수 이름과 argument를 생성할 수 있다는 사실은 실제 실행 권한을
          의미하지 않는다. 읽기 전용, workspace write, 외부 전송, 배포·삭제처럼
          영향도가 다른 동작은 별도 capability로 나누고, runtime이 대상 경로와
          identity, rate limit, 승인 여부를 다시 검사해야 한다. 재시도 가능한
          tool은 idempotency key를 받고, 외부 상태를 바꾼 호출은 결과와 대상,
          실행 주체가 담긴 receipt를 남기는 편이 안전하다.
        </p>

        <h3 className="mb-3 mt-6 text-xl font-semibold">
          4–6. State·artifact, verifier, recovery가 run을 이어 준다
        </h3>
        <p className="leading-7">
          대화 기록은 작업 상태의 유일한 정본이 될 수 없다. 현재 plan, 생성한
          파일, 결정 이유와 미완료 항목을 versioned artifact에 남겨야 새 세션이나
          다른 agent가 이어받을 수 있다. 그다음 test·schema·policy verifier가
          성공 여부를 판정하고, 실패하면 어떤 조건이 어긋났는지를 행동 가능한
          feedback으로 돌려준다. retry budget, checkpoint, rollback, 사람에게
          escalation할 조건까지 정해야 실패가 무한 loop나 조용한 데이터 손상으로
          이어지지 않는다.
        </p>
      </div>

      <div className="not-prose mt-8">
        <RunContractViz />
      </div>
    </section>
  );
}
