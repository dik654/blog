import StructuredOutputViz from './viz/StructuredOutputViz';

export default function StructuredOutput() {
  return (
    <section id="structured-output" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        구조화된 출력: JSON · XML · 마크다운
      </h2>
      <div className="not-prose mb-8"><StructuredOutputViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LLM 출력을 자동화 파이프라인에 연동하려면 파싱 가능한 구조가 필수<br />
          JSON 스키마 명시, XML 태그 분리, 마크다운 헤더 구조화 — 3가지 주요 포맷
        </p>
        <p>
          스키마 없이 "JSON으로 줘"만 지시하면 필드 누락·타입 불일치 빈발<br />
          예시 1개와 필드 설명을 함께 제공하면 구조 준수율 95% 이상 달성 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">구조화 출력 전략</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// JSON Schema 지정 방식
//
// 1. 자연어 설명:
//    "다음 JSON 형식으로 응답:
//     - name (string): 회사명
//     - revenue (number): 매출 (백만 달러)
//     - founded (number): 설립 연도"
//
// 2. JSON 스키마 (Pydantic 등):
//    {
//      "type": "object",
//      "properties": {
//        "name": {"type": "string"},
//        "revenue": {"type": "number"},
//        "founded": {"type": "integer"}
//      },
//      "required": ["name", "founded"]
//    }
//
// 3. 예시 포함 (권장):
//    "예시:
//     {\\"name\\": \\"Apple\\", \\"revenue\\": 394328, \\"founded\\": 1976}
//     이 형식으로 {company}에 대해 출력"

// XML 태그 방식 (Claude 권장):
//   <response>
//     <name>Apple</name>
//     <revenue>394328</revenue>
//     <founded>1976</founded>
//   </response>
//
//   장점:
//   - 파싱 견고성 (JSON 이스케이프 문제 없음)
//   - Claude에 최적화
//   - 긴 텍스트 섞여도 OK

// Function Calling (OpenAI 2023):
//   - API 레벨에서 스키마 강제
//   - JSON mode
//   - Structured Output (2024): 100% 스키마 준수
//
//   functions = [{
//     "name": "get_weather",
//     "parameters": {
//       "type": "object",
//       "properties": {
//         "location": {"type": "string"},
//         "unit": {"type": "string", "enum": ["C", "F"]}
//       }
//     }
//   }]

// 파싱 안정성:
//   1. try/except으로 감싸기
//   2. Pydantic 검증
//   3. Failed parse → retry with error message
//   4. Gaurdrails, Instructor 라이브러리 활용`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">구조화 출력 Best Practices</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 실무 팁
//
// 1. 명확한 경계 표시:
//    "JSON만 출력, 다른 텍스트 금지"
//    또는 "JSON은 \\\`\\\`\\\`json ... \\\`\\\`\\\` 블록 안에"
//
// 2. 필드 타입 명시:
//    - string, number, boolean, array, object
//    - null 허용 여부
//    - enum 값 목록
//
// 3. 예시 하나 이상:
//    예시 있으면 준수율 50% → 95%+
//
// 4. 에러 케이스 처리:
//    "정보가 부족하면: {\\"error\\": \\"missing_data\\"}"
//
// 5. 필수/선택 구분:
//    "name (required), description (optional)"

// 복잡한 스키마 예시:
//   {
//     "analysis": {
//       "summary": "string",
//       "sentiment": "positive|negative|neutral",
//       "confidence": 0.95,
//       "keywords": ["word1", "word2"],
//       "metadata": {
//         "model": "gpt-4",
//         "timestamp": "2024-01-15T10:30:00Z"
//       }
//     }
//   }

// 프롬프트 템플릿:
//   System: JSON 스키마 따라 응답, 마크다운 금지
//
//   Schema:
//   {schema}
//
//   Example:
//   {example}
//
//   Input: {user_input}
//
//   Output:
//   {JSON}

// 모델별 특성:
//   OpenAI GPT-4: JSON mode (2023+), Structured Output (2024)
//   Claude: XML 권장, JSON도 OK
//   Gemini: 기본 JSON 지원
//   LLaMA: 세심한 프롬프트 필요`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>예시 1개</strong>가 구조 준수율을 50% → 95%로 올림.<br />
          요약 2: <strong>XML 태그</strong>는 Claude, <strong>JSON mode</strong>는 OpenAI 표준.<br />
          요약 3: 프로덕션에서는 <strong>Pydantic + retry</strong>로 파싱 안정성 확보.
        </p>
      </div>
    </section>
  );
}
