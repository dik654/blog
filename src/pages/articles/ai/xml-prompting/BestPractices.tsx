import BestPracticesViz from './viz/BestPracticesViz';

export default function BestPractices() {
  return (
    <section id="best-practices" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전 가이드</h2>
      <div className="not-prose mb-8"><BestPracticesViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">XML Prompting Best Practices</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// XML Prompting Best Practices:

// 1. 명확한 구조:
// DO:
// <task>Summarize the article</task>
// <input>[article]</input>
// <output_format>3-sentence summary</output_format>
//
// DON'T:
// summarize this: [article mixed with instructions]

// 2. Consistent tags across prompts:
// DO: 모든 prompt에서 <task>, <input> 일관 사용
// DON'T: <task> vs <goal> vs <objective> 혼용

// 3. Nested clarity:
// DO: max 2-3 levels nesting
// DON'T: deeply nested structures

// 4. Explicit output format:
// DO:
// <output_format>
//   <result>
//     <summary>...</summary>
//     <keywords>...</keywords>
//   </result>
// </output_format>
//
// DON'T: "return a summary and keywords"

// 5. Examples when complex:
// DO: Use <example> for non-trivial tasks
// DON'T: Trust LLM to guess format

// 6. Escape special characters:
// &lt; for <
// &gt; for >
// &amp; for &
// (or use CDATA sections)

// Production patterns:

// Pattern 1: Question-Answer
// <context>[background]</context>
// <question>[user query]</question>
// <instructions>
// Answer based on context.
// If unsure, say "I don't know".
// </instructions>
// <answer>...</answer>

// Pattern 2: Data Extraction
// <document>[unstructured text]</document>
// <schema>
// {
//   "entities": {
//     "people": ["string"],
//     "organizations": ["string"],
//     "dates": ["YYYY-MM-DD"]
//   }
// }
// </schema>
// <extracted>[JSON output]</extracted>

// Pattern 3: Classification
// <text>[input]</text>
// <categories>
//   <category id="tech">Technology</category>
//   <category id="biz">Business</category>
//   <category id="other">Other</category>
// </categories>
// <classification>
//   <chosen>id</chosen>
//   <confidence>0.0-1.0</confidence>
// </classification>

// Pattern 4: Multi-turn conversation
// <conversation>
//   <turn role="user">Hello</turn>
//   <turn role="assistant">Hi there!</turn>
//   <turn role="user">Tell me about AI</turn>
// </conversation>
// <current_turn role="assistant">
// [new response]
// </current_turn>

// Pattern 5: Tool use reasoning
// <available_tools>
//   <tool name="search"/>
//   <tool name="calculate"/>
// </available_tools>
// <task>[user query]</task>
// <reasoning>
// [which tool to use and why]
// </reasoning>
// <tool_call>
//   <name>search</name>
//   <args>{"query": "..."}</args>
// </tool_call>

// Testing & iteration:
// 1. Start with simple prompt
// 2. Test with edge cases
// 3. Identify failures
// 4. Add more structure (tags)
// 5. Provide examples
// 6. Iterate

// Performance tips:
// - XML adds ~10-20% token overhead
// - worth it for reliability
// - cache frequent prompts
// - stream-parse if possible

// Anti-patterns:
// ✗ over-engineering simple prompts
// ✗ deeply nested (>3 levels)
// ✗ inconsistent naming
// ✗ missing close tags
// ✗ ambiguous instructions
// ✗ no output format spec

// When XML doesn't help:
// - very simple queries (just ask)
// - when JSON is native (function calling)
// - for structured output APIs
// - brevity-focused tasks`}
        </pre>
        <p className="leading-7">
          Best practices: <strong>consistent + explicit + examples + validation</strong>.<br />
          production patterns: QA, extraction, classification, multi-turn, tool use.<br />
          XML overhead 10-20% tokens, but worth for reliability.
        </p>
      </div>
    </section>
  );
}
