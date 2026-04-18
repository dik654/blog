import IterationViz from './viz/IterationViz';
import IterationDetailViz from './viz/IterationDetailViz';

export default function Iteration() {
  return (
    <section id="iteration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">반복 개선 루프</h2>
      <div className="not-prose mb-8"><IterationViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">Iterative Improvement Loop</h3>
        <div className="not-prose mb-6"><IterationDetailViz /></div>
        <p className="leading-7">
          Iteration loop: <strong>measure → identify → hypothesize → implement → verify</strong>.<br />
          DSPy: programmatic prompt optimization.<br />
          observability: LangSmith, W&amp;B, Helicone 등 활용.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">사례 연구 — OpenAI: 3 engineers, 5 months, zero code</h3>
        <p className="leading-7">
          OpenAI 공식 블로그가 공개한 실험: 엔지니어 3명이 5개월 동안 <strong>코드를 단 한 줄도 쓰지 않고</strong> 제품을 완성<br />
          코드 대신 <em>하네스만</em> 만들었고, 실제 코딩은 에이전트가 전담<br /><br />
          4가지 축:<br />
          &nbsp;&nbsp;<strong>1. AGENTS.md</strong>: 에이전트에게 주는 업무 지침서<br />
          &nbsp;&nbsp;<strong>2. CI Gates</strong>: 코드 저장마다 자동 테스트<br />
          &nbsp;&nbsp;<strong>3. Tool Boundaries</strong>: 접근 범위·권한 정의<br />
          &nbsp;&nbsp;<strong>4. Feedback Loop</strong>: 코딩 → 리뷰 → 규칙 보강 순환<br /><br />
          OpenAI 팀의 결론: <strong>"사람이 시스템을 만들고, 에이전트는 그 시스템 안에서 수행만 한다"</strong>
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">사례 연구 — LangChain: 모델 고정, 하네스만 개선</h3>
        <p className="leading-7">
          LangChain이 코딩 에이전트 벤치마크 실험 진행<br />
          조건: <strong>모델을 전혀 바꾸지 않고</strong> 하네스만 개선<br />
          결과: <strong>30위권 → 5위권</strong> (25단계 상승), 점수도 대폭 향상<br /><br />
          시사점: <strong>에이전트 성능을 좌우하는 것은 모델의 지능이 아니라 하네스</strong><br />
          동일한 Claude/GPT를 쓰더라도 하네스 품질이 결과물을 결정
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">하네스 진화의 원칙 — 미래 전망</h3>
        <p className="leading-7">
          <strong>Richard Sutton</strong>(강화 학습 창시자) 원칙:<br />
          &nbsp;&nbsp;"모델이 똑똑해질수록 하네스는 <em>더 단순해져야</em> 한다"<br />
          &nbsp;&nbsp;모델 업그레이드 때마다 하드코딩된 규칙을 추가하고 있다면 → <strong>흐름을 거슬러 가고 있는 것</strong><br /><br />
          <strong>Chad Fowler</strong>의 표현 — "엄밀함의 재배치 (Relocation of Rigor)":<br />
          &nbsp;&nbsp;코드 한 줄 한 줄을 정확하게 짜던 엄밀함 → 에이전트가 올바르게 동작하는 <em>시스템을 설계</em>하는 엄밀함으로 이동<br /><br />
          <strong>미래 방향</strong>:<br />
          &nbsp;&nbsp;- 에이전트가 <em>스스로 하네스 엔지니어링</em>을 수행<br />
          &nbsp;&nbsp;- 하네스가 <em>서비스 템플릿처럼</em> 배포됨<br />
          &nbsp;&nbsp;- 잘 작동하는 하네스 일부가 <em>모델에 흡수</em>됨
        </p>
      </div>
    </section>
  );
}
