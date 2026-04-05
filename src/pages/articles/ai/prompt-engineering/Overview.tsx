import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프롬프트 엔지니어링이란</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>프롬프트 엔지니어링</strong> — LLM에서 원하는 출력을 이끌어내기 위해 입력을 체계적으로 설계하는 기술<br />
          모델 파라미터를 수정하지 않고, 입력 텍스트만으로 성능을 끌어올리는 방법
        </p>
        <p>
          같은 GPT-4에 "수도 알려줘"와 "JSON으로 수도 출력"은 완전히 다른 결과를 생성<br />
          프롬프트 = LLM의 프로그래밍 인터페이스 — 명확한 지시가 명확한 결과로 이어짐
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">프롬프트 엔지니어링 6대 원칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Anthropic/OpenAI 공통 프롬프트 설계 원칙
//
// 1. Clarity (명확성)
//    - 구체적이고 모호하지 않은 지시
//    - 원하는 출력 형식 명시
//    - 나쁜 예: "좋은 글을 써줘"
//    - 좋은 예: "500자 기술 블로그 글, 3개 섹션, 각 150자"
//
// 2. Context (컨텍스트 제공)
//    - 배경 정보, 도메인, 목적 설명
//    - 타겟 독자 명시
//    - 예: "전자상거래 사이트의 제품 설명"
//
// 3. Examples (예시)
//    - 입출력 쌍 제공 (Few-shot)
//    - 원하는 스타일/포맷 시연
//    - 엣지 케이스 포함
//
// 4. Role Assignment (역할 부여)
//    - "너는 경험 많은 Python 개발자다"
//    - 전문성, 어조, 관점 설정
//    - 일관성 유지에 도움
//
// 5. Structure (구조화)
//    - 번호·불릿·XML 태그 활용
//    - 지시/컨텍스트/질문 구분
//    - 섹션 헤더로 가독성
//
// 6. Iteration (반복 개선)
//    - 초안 → 테스트 → 개선
//    - A/B 테스트
//    - 에러 패턴 분석

// LLM 입력 구조 (템플릿):
//   [시스템 메시지]
//     역할, 배경, 제약
//
//   [컨텍스트]
//     배경 지식, 참고 자료
//
//   [지시]
//     구체적 태스크
//
//   [예시 (Few-shot)]
//     Input: ...
//     Output: ...
//
//   [입력]
//     실제 질문/데이터
//
//   [출력 형식]
//     JSON/XML 스키마`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">프롬프트 엔지니어링 역사</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 프롬프트 엔지니어링 발전 타임라인
//
// 2018 GPT-1: 태스크별 fine-tuning 필요
// 2019 GPT-2: zero-shot 가능성 제기
// 2020 GPT-3: In-context learning 혁명
//             - Few-shot으로 fine-tuning 대체
//             - "prompt engineering" 용어 등장
//
// 2021 Prompt engineering 붐
//     - T0, Flan-T5: instruction tuning
//     - "Prompt Engineering Guide" 공개
//
// 2022 Chain-of-Thought (Wei et al.)
//     - "Let's think step by step"
//     - 수학·논리 문제 성능 급증
//     - Self-Consistency (Wang et al.)
//
// 2022 InstructGPT / ChatGPT
//     - RLHF로 지시 따르기 강화
//     - 일반 사용자 접근 가능
//
// 2023 고급 기법 폭발:
//     - Tree of Thoughts
//     - ReAct (Reasoning + Acting)
//     - Self-Refine
//     - Constitutional AI
//
// 2024 Agent 시대:
//     - Tool use
//     - Multi-step reasoning
//     - XML prompting (Claude)
//     - Structured output (function calling)

// 현재 (2024):
//   - LLM 성능이 prompt보다 모델 크기에 의존 증가
//   - 하지만 production에서는 여전히 중요
//   - System prompt > User prompt
//   - Output format 제어가 핵심`}
        </pre>
        <p className="leading-7">
          요약 1: 프롬프트 엔지니어링 = <strong>LLM의 프로그래밍 인터페이스</strong>.<br />
          요약 2: <strong>6대 원칙</strong> — 명확성·컨텍스트·예시·역할·구조·반복.<br />
          요약 3: GPT-3 이후 <strong>in-context learning</strong>이 fine-tuning 대체.
        </p>
      </div>
    </section>
  );
}
