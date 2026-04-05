import SystemPromptViz from './viz/SystemPromptViz';

export default function SystemPrompt() {
  return (
    <section id="system-prompt" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">시스템 프롬프트 설계</h2>
      <div className="not-prose mb-8"><SystemPromptViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          시스템 프롬프트 — 모든 대화 턴에서 LLM이 가장 먼저 읽는 고정 지시문<br />
          5개 레이어를 순서대로 쌓아 올리면 일관되고 안전한 응답 유도 가능
        </p>
        <p>
          <strong>핵심 원칙</strong> — 구체적일수록 좋고, 모호하면 LLM이 자의적으로 해석<br />
          Bad: "적절히 응답하세요" → Good: "항상 한국어로, JSON 형식으로, 개인정보 없이"
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">System Prompt 5-Layer 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// System Prompt 표준 템플릿 (5 layers)
//
// [Layer 1] Role & Identity
//   "너는 경험 많은 Python 백엔드 엔지니어이다."
//   "너는 10년차 데이터 사이언티스트로 ML 모델 설계 전문."
//   → 페르소나 설정, 전문성 확립
//
// [Layer 2] Context & Background
//   "사용자는 스타트업 CTO이며, 프로덕션 레벨 조언을 원함."
//   "회사는 e-commerce 도메인, Python/FastAPI 스택 사용."
//   → 배경 정보, 사용자 프로필
//
// [Layer 3] Task Instructions
//   "사용자 질문에 대해:
//    1. 문제를 재정의
//    2. 최소 2개 해결책 제시
//    3. 각각 trade-off 명시
//    4. 최종 권장 선택"
//   → 명확한 task breakdown
//
// [Layer 4] Constraints & Rules
//   "규칙:
//    - 항상 한국어로 응답
//    - 코드 블록은 실행 가능해야 함
//    - 추측 금지, 모르면 '모른다'고 답"
//   → 제약 조건
//
// [Layer 5] Output Format
//   "형식:
//    ## 문제 분석
//    ...
//    ## 해결책 1
//    - Pros:
//    - Cons:
//    ..."
//   → 출력 구조 명시

// 실전 예시 (Claude):
<system>
You are an expert Python tutor.

<background>
User: beginner programmer learning Python.
Goal: build small CLI tools.
</background>

<tasks>
1. Explain concept clearly
2. Provide runnable example
3. Suggest next practice
</tasks>

<rules>
- Use simple language
- No advanced topics unless asked
- Always test code mentally
</rules>

<format>
## 개념
...
## 예제
\`\`\`python
...
\`\`\`
## 다음 단계
...
</format>
</system>

// XML 태그 사용 (Claude 권장):
//   - 섹션 경계 명확
//   - Claude가 특히 잘 파싱
//   - 중첩 구조 표현 가능`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">안전성 프롬프트 (Guardrails)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 안전 가드레일 패턴
//
// 1. Positive Framing
//    Bad:  "개인정보 출력 금지"
//    Good: "공개 가능한 정보만 포함"
//    → Negative는 해당 개념 activation
//
// 2. Refusal Triggers
//    "다음 경우 응답 거부:
//     - 개인 프라이버시 침해
//     - 불법 행위 조언
//     - 폭력/자해 관련"
//
// 3. Scope Limitation
//    "이 시스템은 Python 코딩만 다룹니다.
//     다른 주제는 '주제 범위 외'라고 답."
//
// 4. Citation Requirement
//    "모든 주장은 소스 인용 필수.
//     출처 없으면 '확실치 않음'이라고 명시."
//
// 5. Format Enforcement
//    "응답은 반드시 JSON 형식.
//     스키마: {answer: string, confidence: number}"

// Jailbreak 방어:
//   - 역할 고수 (persona drift 방지)
//   - 지시 재확인 (매 턴 검증)
//   - Red-teaming 테스트
//
// Prompt Injection 방어:
//   - 사용자 입력 구분 (XML 태그)
//   - 명령어 필터링
//   - Output validation

// 모델별 차이:
//   GPT-4:  markdown, JSON mode
//   Claude: XML tags, longer context
//   Gemini: structured output
//   LLaMA:  prompt engineering 더 세심`}
        </pre>
        <p className="leading-7">
          요약 1: System Prompt는 <strong>Role → Context → Task → Rules → Format</strong> 5층 구조.<br />
          요약 2: <strong>XML 태그</strong>로 섹션 구분 (Claude 표준).<br />
          요약 3: Guardrails은 <strong>positive framing + scope limit</strong>이 핵심.
        </p>
      </div>
    </section>
  );
}
