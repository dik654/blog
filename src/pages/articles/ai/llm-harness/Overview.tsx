import OverviewViz from './viz/OverviewViz';
import OverviewDetailViz from './viz/OverviewDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하네스란 무엇인가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          LLM Harness: <strong>LLM을 특정 task에 맞게 감싸는 구조물</strong>.<br />
          prompt + tools + guardrails + evaluation 결합.<br />
          raw LLM → production-ready system으로 변환.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">"하네스 엔지니어링" 용어의 탄생 — 2026-02</h3>
        <p className="leading-7">
          <strong>Mitchell Hashimoto</strong>(HashiCorp 공동창업자)가 2026-02에 블로그에서 처음 사용<br />
          계기: AI 코딩 에이전트에게 "이렇게 하지 마"라고 프롬프트로 지시해도 다음 세션에 똑같은 실수를 반복<br />
          결론: <em>프롬프트로 부탁하는 것</em>이 아니라 <em>실수 자체가 구조적으로 불가능하게 만드는 것</em>이 필요<br />
          정의: "에이전트가 실수할 때마다 그 실수가 다시는 반복되지 않도록 하네스를 <strong>고치는</strong> 작업"<br />
          OpenAI, Anthropic, LangChain이 같은 문제를 겪고 있었고, Hashimoto가 이름을 붙이자마자 업계 전체가 동조하며 표준 용어로 자리잡음
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">이름의 유래 — 야생말 vs 경주마</h3>
        <p className="leading-7">
          Harness = <strong>마구</strong>(馬具): 고삐, 안장 등 말을 제어하는 도구<br />
          야생말을 경마장에 풀어놓으면 본능대로 날뛰며 울타리를 넘음<br />
          마구를 채우면 말의 힘이 <em>약해지는 것이 아니라</em> 올바른 방향으로 집중되어 빠르고 정확하게 달림<br />
          AI 모델(Claude, GPT, Gemini)은 야생말과 같음 — 혼자 풀어놓으면 통제 불가<br />
          하네스는 모델의 힘을 억누르는 것이 아니라 올바른 방향으로 제어하는 <strong>모델이 아닌 모든 것</strong> (CLAUDE.md, hooks, MCP, skills ...)
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">하네스가 해결하는 두 가지 문제</h3>
        <p className="leading-7">
          <strong>① 컨텍스트 부패 (Context Rot)</strong><br />
          Anthropic 연구팀이 Claude Opus에게 Claude.ai 클론을 시킨 실험에서 반복된 두 실패 패턴:<br />
          &nbsp;&nbsp;- 한 번에 다 해결하려다 컨텍스트 창 소진 → 절반만 구현하고 다음 세션에선 기억 없이 처음부터 재탐색<br />
          &nbsp;&nbsp;- 어느 정도 진행되면 "다 됐다"고 조기 종료 선언 (실제로는 한참 남음)<br />
          컨텍스트 창 = 한 번에 펼쳐볼 수 있는 책 페이지 수 — 작업이 길어지면 앞 내용을 잊기 시작<br /><br />
          <strong>② 규칙과 울타리 위반</strong><br />
          정보 부족이 아니라 <em>구조적 제약 부재</em>의 문제<br />
          예: 결제 시스템 구현 중 에이전트가 갑자기 DB 테이블을 삭제 — "하면 안 된다"는 구조가 없으니 마음대로 실행<br />
          프롬프트로 "DB 지우지 마"라고 부탁해봐야 매번 어김
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">두 문제를 해결하는 구조 — CLAUDE.md + Hooks</h3>
        <p className="leading-7">
          <strong>컨텍스트 부패 → CLAUDE.md</strong>: Claude Code가 새 세션마다 가장 먼저 읽는 프로젝트 지침 파일<br />
          컨텍스트가 꽉 차 앞 내용을 잊어도 이 파일은 항상 다시 로드됨<br />
          비유: 퇴사자가 바뀌어도 신규 입사자가 첫날 반드시 읽는 온보딩 문서<br /><br />
          <strong>규칙 위반 → Hooks</strong>: 작업을 마치려는 순간 자동 실행되는 스크립트<br />
          예: 코드 저장 직전 자동으로 타입 체크 + 문법 검사 → 에러 있으면 에이전트에게 다시 돌려보냄<br />
          에이전트가 스스로 고치게 됨 — 사람 개입 불필요<br />
          "좋은 코드 짜줘"라는 <em>부탁</em>이 아니라, 못 짜면 저장 자체가 막히는 <em>구조</em>를 만드는 것
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 철학 — 프롬프트는 부탁, 하네스는 강제</h3>
        <p className="leading-7">
          결정적 차이: 해선 안 되는 작업을 에이전트가 했을 때의 대응<br />
          &nbsp;&nbsp;- <em>프롬프트 방식</em>: "이거 하지 마" 부탁 → 또 실수함 (강제가 아니므로)<br />
          &nbsp;&nbsp;- <em>하네스 방식</em>: 그 실수 자체가 불가능한 구조 설계 → 원천 봉쇄<br />
          공장 안전 시스템과 동일 — 안전모 없으면 출입문이 안 열리고, 기계에 손이 들어가면 자동 정지<br />
          규칙이 사람 판단에 의존하지 않고 시스템에 내장되어 자동 강제됨<br /><br />
          요약: 프롬프트 = 부탁, 하네스 = 강제. 실패할 때마다 하네스를 한 줄씩 추가하여 점진적으로 정교해짐
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Harness vs Raw LLM</h3>
        <div className="not-prose mb-6"><OverviewDetailViz /></div>
        <p className="leading-7">
          Harness: <strong>system prompt + tools + guardrails + eval</strong>.<br />
          raw LLM → production system 변환 인프라.<br />
          LangChain, LlamaIndex, DSPy 등이 대표 framework.
        </p>
      </div>
    </section>
  );
}
