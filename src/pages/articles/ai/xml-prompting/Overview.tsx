import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 XML 태그인가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          XML Prompting: <strong>LLM prompt structuring 기법</strong>.<br />
          Claude가 XML tags 선호 (학습 데이터 특성).<br />
          명확한 구조 → 더 정확한 파싱 + 응답.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 XML tags가 효과적인가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// XML Prompting 장점:

// 1. 명확한 구조:
// - 태그로 섹션 구분
// - LLM이 쉽게 파싱
// - ambiguity 감소

// 2. Claude 친화적:
// - Anthropic 공식 추천
// - 학습 데이터에 XML 많이 포함
// - 자연스러운 형식

// 3. 파싱 가능:
// - 출력도 XML로 유도 가능
// - 프로그램이 쉽게 추출
// - 구조화된 데이터

// 4. 명시적 지시:
// - instruction vs context 구분
// - example vs query 구분
// - role vs content 구분

// 비교: Plain text vs XML
//
// Plain text prompt:
// """
// You are a helpful assistant.
// Here's the user's question: What is AI?
// Please provide a clear answer with examples.
// """
//
// XML structured:
// <role>You are a helpful assistant.</role>
// <question>What is AI?</question>
// <instructions>
//   Provide a clear answer with examples.
// </instructions>

// Common XML patterns:
//
// <task>...</task>
// <context>...</context>
// <examples>...</examples>
// <instructions>...</instructions>
// <input>...</input>
// <output_format>...</output_format>

// Alternative approaches:
// - Markdown headers (## Section)
// - JSON structure
// - Numbered sections
// - Plain text with delimiters

// Why XML over alternatives?
// - Markdown: ambiguous, less explicit
// - JSON: verbose, escaping issues
// - Numbers: brittle, no semantics
// - XML: explicit + semantic + parseable

// Not universal:
// - GPT-4 also works with Markdown
// - Some models prefer JSON
// - Depends on training data
// - Claude: XML preferred

// 2024 state:
// - XML prompting widely adopted
// - Anthropic best practice
// - Enterprise prompt engineering standard
// - Ecosystem support growing`}
        </pre>
        <p className="leading-7">
          XML prompting: <strong>명확한 구조 + 파싱 가능 + Claude 친화적</strong>.<br />
          plain text/Markdown/JSON 대비 explicit + semantic.<br />
          2024 Anthropic 공식 best practice.
        </p>
      </div>
    </section>
  );
}
