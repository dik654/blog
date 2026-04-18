import CompositionViz from './viz/CompositionViz';
import CompositionDetailViz from './viz/CompositionDetailViz';

export default function Composition() {
  return (
    <section id="composition" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        하네스 구성: 시스템 프롬프트 + 도구 + 가드레일
      </h2>
      <div className="not-prose mb-8"><CompositionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">하네스 3대 요소 상세</h3>
        <div className="not-prose mb-6"><CompositionDetailViz /></div>
        <p className="leading-7">
          3 elements: <strong>system prompt + tools + guardrails</strong>.<br />
          system prompt: role/persona/instructions/format.<br />
          guardrails: input validation + output filtering.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">하네스 엔지니어링의 3기둥</h3>
        <p className="leading-7">
          위의 구성 요소와 별개로, 에이전틱 하네스는 <strong>세 가지 기둥</strong>으로 구성됨 (2026 업계 합의)
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">기둥 ① — 컨텍스트 파일</h3>
        <p className="leading-7">
          <code>CLAUDE.md</code>, <code>AGENTS.md</code> 같이 AI가 작업 시작 시 가장 먼저 읽는 파일<br />
          OpenAI 팀 원칙: <strong>"1,000페이지 설명서가 아니라 지도를 줘야 한다"</strong><br />
          &nbsp;&nbsp;- 60줄 이하로 유지, 보편적·항상 적용되는 내용만<br />
          &nbsp;&nbsp;- 세부 내용은 별도 파일로 분리하여 필요할 때만 로드<br />
          &nbsp;&nbsp;- 처음부터 완벽하게 설계하는 게 아니라 <em>실패할 때마다 한 줄씩 추가</em>하며 점진적 진화<br /><br />
          Hashimoto의 Ghostty 프로젝트 AGENTS.md: 에이전트가 저질렀던 실수를 한 줄씩 누적해 나가며 개선됨
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">기둥 ② — 자동 강제 시스템</h3>
        <p className="leading-7">
          "좋은 코드 작성해줘"라고 <em>말하는 것</em>이 아니라 <em>기계적으로 강제</em>하는 것<br />
          구성: <strong>Linter + Pre-commit Hook + 자동 교정 루프</strong><br />
          &nbsp;&nbsp;- Linter: 코드 맞춤법 검사 — 규칙 위반 시 빨간 에러<br />
          &nbsp;&nbsp;- Pre-commit Hook: 저장 직전 자동 실행 스크립트 — "잠깐, 이거부터 확인"<br />
          &nbsp;&nbsp;- 자동 교정 루프: Linter가 빨간 불 → 에이전트가 스스로 수정 → 사람 개입 불필요<br /><br />
          핵심 원칙: <strong>"성공은 조용히, 실패만 시끄럽게"</strong> (Success is quiet, failure is loud)<br />
          &nbsp;&nbsp;- 테스트 통과 시 출력 없음<br />
          &nbsp;&nbsp;- 실패 시에만 에이전트에게 알림<br />
          &nbsp;&nbsp;- 통과한 4,000줄 로그를 다 보여주면 AI가 그걸 읽느라 할 일을 잊음
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">기둥 ③ — 가비지 컬렉션</h3>
        <p className="leading-7">
          원래는 프로그래밍 용어로 안 쓰는 메모리를 자동 청소하는 개념<br />
          하네스 맥락: AI가 만든 품질 낮은 코드를 <strong>주기적으로 자동 청소</strong><br />
          필요 이유: 기존 코드의 나쁜 패턴을 에이전트가 그대로 따라 함 → 나쁜 패턴이 눈덩이처럼 증식<br /><br />
          주기적으로 돌아가는 청소 에이전트가 확인하는 것:<br />
          &nbsp;&nbsp;- 문서가 실제 코드와 달라진 부분<br />
          &nbsp;&nbsp;- 규칙을 위반한 코드<br />
          &nbsp;&nbsp;- 사용하지 않는 죽은 코드<br /><br />
          <strong>진화 메커니즘</strong>: 에이전트가 실수할 때마다 그 실수는 새로운 규칙이 됨<br />
          → Linter 규칙 추가, 테스트 추가, 제약 추가<br />
          → 시간이 지날수록 하네스가 점점 정교해짐<br />
          → 말이 한 번 넘으려 했던 울타리가 점점 높아져 두 번 다시 같은 실수 불가
        </p>
      </div>
    </section>
  );
}
