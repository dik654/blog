import BasicTagsViz from './viz/BasicTagsViz';

export default function BasicTags() {
  return (
    <section id="basic-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">기본 태그 패턴</h2>
      <div className="not-prose mb-8"><BasicTagsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">XML 기본 태그 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 기본 XML Tags:

// 1. <task>: 작업 정의
// <task>
// Summarize this article in 3 sentences.
// </task>

// 2. <context>: 배경 정보
// <context>
// The user is a student learning about ML.
// They need beginner-friendly explanations.
// </context>

// 3. <input>: 처리할 데이터
// <input>
// [user's text here]
// </input>

// 4. <instructions>: 상세 지시
// <instructions>
// - Use simple language
// - Provide examples
// - Avoid jargon
// </instructions>

// 5. <examples>: 예시
// <examples>
// <example>
//   <input>example input</input>
//   <output>example output</output>
// </example>
// </examples>

// 6. <output_format>: 출력 형식
// <output_format>
// Return JSON with keys: title, summary, tags
// </output_format>

// Complete example:
// <task>Translate English to Korean</task>
// <context>Formal business communication</context>
// <input>Hello, how are you?</input>
// <output_format>
// <translation>...</translation>
// </output_format>

// Nesting:
// <outer>
//   <inner>content</inner>
//   <another>content</another>
// </outer>

// Attributes (less common):
// <text lang="en">Hello</text>
// <code language="python">print("hi")</code>

// Naming conventions:
// - lowercase tags
// - snake_case or kebab-case
// - descriptive names
// - avoid cryptic abbreviations

// Anthropic recommended tags:
// - <document>: source documents
// - <examples>: few-shot examples
// - <question>: user query
// - <answer>: assistant response
// - <thinking>: reasoning (chain of thought)
// - <response>: final output

// Tag consistency:
// - use same tags across prompts
// - LLM learns patterns
// - easier to maintain
// - standardized parsing

// Document organization:
// <documents>
//   <document index="1">
//     <source>filename.txt</source>
//     <content>...</content>
//   </document>
//   <document index="2">
//     ...
//   </document>
// </documents>

// Few-shot examples:
// <examples>
//   <example>
//     <input>Apple</input>
//     <output>Fruit</output>
//   </example>
//   <example>
//     <input>Carrot</input>
//     <output>Vegetable</output>
//   </example>
// </examples>

// Instructions hierarchy:
// <role>system-level role</role>
// <instructions>task-level instructions</instructions>
// <constraints>specific rules</constraints>
// <tone>writing style</tone>`}
        </pre>
        <p className="leading-7">
          기본 tags: <strong>task, context, input, instructions, examples, output_format</strong>.<br />
          Anthropic 추천: document, examples, question, answer, thinking.<br />
          consistent naming → LLM learns patterns.
        </p>
      </div>
    </section>
  );
}
