export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Prompt Injection — AI 시대의 새로운 공격 면</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          <strong>Prompt Injection</strong> — LLM 의 입력 텍스트에 "이전 명령은 무시하라" 같은 악의 명령을 섞어
          모델의 의도된 행동을 가로채는 공격. 2022년 Riley Goodside 가 GPT-3 에서 시연한 뒤,
          AI agent 시대에 가장 광범위한 위협으로 자리잡음.
        </p>
        <p className="leading-7">
          핵심은 LLM 이 <strong>"이건 사용자 입력 / 이건 외부 데이터"</strong> 를 본질적으로 구분하지 못함.
          모든 토큰이 같은 attention 윈도우에 들어가서, instruction 처럼 보이는 모든 패턴이
          실행 후보가 됨. 코드 인젝션의 sandbox 우회와 다른 점은 — LLM 의 "sandbox" 자체가 확률 분포라
          정형 검증으로 막을 수 없음.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Direct vs Indirect — 두 종류의 위협</h3>
        <p className="leading-7">
          <strong>Direct injection</strong> — 사용자가 LLM 에 직접 "jailbreak" 류 명령을 넣음.
          "DAN (Do Anything Now)", "Grandmother attack" 같은 패턴. 기존 ChatGPT / Claude 의
          alignment 우회가 주 대상.
        </p>
        <p className="leading-7">
          <strong>Indirect injection</strong> — 더 위험한 종류. AI agent 가 작업 중 "읽어들이는"
          외부 데이터 (이메일, 웹페이지, RAG 문서, PR comment, log 출력) 안에 명령이 숨어 있음.
          사용자 본인이 의식하지 못한 사이 agent 가 그 명령을 새 instruction 으로 해석해 행동.
          Greshake et al. (2023) 이 "Not what you've signed up for" 논문에서 체계적으로 정리.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 AI agent 시대에 더 심각한가</h3>
        <p className="leading-7">
          단순 chatbot 시대엔 prompt injection 이 "부적절한 답변 유도" 정도였음. Agent 시대엔
          LLM 의 출력이 <strong>tool call → 실제 행동</strong> 으로 변환됨. 즉 injection 한 번이
          이메일 송신, 파일 삭제, 외부 API 호출, 자금 이동까지 직결.
        </p>
        <p className="leading-7">
          공격자 측 ROI 가 압도적. 한 줄 텍스트로 sandboxed 코드 실행에 준하는 효과,
          탐지 어려움, 사용자 본인이 trigger 한 것처럼 보여 attribution 까지 흐림.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-6">
          <strong>금융권 함의</strong> — Customer 데이터 분석 / 자동 응답 / 사내 코드 도구에
          AI agent 를 도입할 때, indirect injection 의 vector 가 정확히 그 도구의 데이터 흐름과
          겹침. 카카오뱅크 같은 환경에선 "AI 도구 도입 = injection 위협 면 확장" 의 명시적 인식 + 통제 layer 가 필수.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">방어의 본질 — "막는다" 가 아닌 "제한한다"</h3>
        <p className="leading-7">
          중요한 인식. Prompt injection 은 <strong>완벽 차단 불가능</strong>. LLM 의 본질이 확률
          모델이라 어떤 input filter 도 우회 가능, alignment 학습으로도 한계가 있음. 방어의 목표는
          "injection 자체를 0 으로" 가 아니라 "injection 이 성공해도 피해 범위가 제한적" 의
          containment.
        </p>
        <p className="leading-7">
          이 글의 3-layer defense — <strong>입력 / 신뢰 경계</strong> + <strong>실행 / 권한</strong>
          + <strong>출력 / 감사</strong> — 가 그 containment 를 다층으로 구현. 각 layer 가
          독립적으로 깨질 수 있다는 가정 위에서 설계.
        </p>
      </div>
    </section>
  );
}
