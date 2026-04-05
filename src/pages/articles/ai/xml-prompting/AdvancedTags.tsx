import AdvancedTagsViz from './viz/AdvancedTagsViz';

export default function AdvancedTags() {
  return (
    <section id="advanced-tags" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고급 태그 패턴</h2>
      <div className="not-prose mb-8"><AdvancedTagsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">고급 XML 패턴</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 고급 XML Prompting 패턴:

// 1. Chain-of-Thought with tags:
// <question>Complex problem here</question>
//
// Please think through this step-by-step:
// <thinking>
// [LLM reasons here]
// </thinking>
//
// <answer>
// [Final answer]
// </answer>

// 2. Self-critique:
// <task>Write a summary</task>
// <input>[text]</input>
//
// First draft:
// <draft>[initial attempt]</draft>
//
// Critique it:
// <critique>
// [find weaknesses]
// </critique>
//
// Improved version:
// <revised>
// [final summary]
// </revised>

// 3. Multi-step workflows:
// <step number="1">
//   <action>Parse the document</action>
//   <output>[extracted data]</output>
// </step>
// <step number="2">
//   <action>Analyze the data</action>
//   <output>[analysis]</output>
// </step>
// <step number="3">
//   <action>Generate report</action>
//   <output>[report]</output>
// </step>

// 4. Conditional logic:
// <if condition="user is technical">
//   <response>
//     Use technical language.
//   </response>
// </if>
// <else>
//   <response>
//     Use simple language.
//   </response>
// </else>

// 5. Nested documents:
// <knowledge_base>
//   <category name="technical">
//     <fact>Fact 1</fact>
//     <fact>Fact 2</fact>
//   </category>
//   <category name="business">
//     <fact>Fact 3</fact>
//   </category>
// </knowledge_base>

// 6. Tool definitions:
// <tools>
//   <tool name="search">
//     <description>Web search</description>
//     <parameters>
//       <param name="query" type="string"/>
//     </parameters>
//   </tool>
//   <tool name="calculator">
//     <description>Math operations</description>
//     <parameters>
//       <param name="expression" type="string"/>
//     </parameters>
//   </tool>
// </tools>

// 7. Response validation:
// <output>
//   <answer>[content]</answer>
//   <confidence>high|medium|low</confidence>
//   <sources>[list]</sources>
//   <caveats>[warnings]</caveats>
// </output>

// 8. Personas & roles:
// <persona>
//   <name>Dr. Smith</name>
//   <expertise>Cardiology</expertise>
//   <communication_style>Empathetic</communication_style>
// </persona>
//
// <patient_question>[question]</patient_question>
//
// Respond as Dr. Smith:
// <response>...</response>

// 9. Comparison frameworks:
// <comparison>
//   <option name="Option A">
//     <pros>...</pros>
//     <cons>...</cons>
//   </option>
//   <option name="Option B">
//     <pros>...</pros>
//     <cons>...</cons>
//   </option>
//   <recommendation>...</recommendation>
// </comparison>

// 10. Structured extraction:
// Extract from: <text>...</text>
// Into:
// <extracted>
//   <entities>
//     <person>...</person>
//     <date>...</date>
//     <location>...</location>
//   </entities>
//   <relationships>
//     <relation>...</relation>
//   </relationships>
// </extracted>

// Best practices:
// - nest only 2-3 levels deep
// - use meaningful tag names
// - provide clear schema
// - show examples of expected output
// - test with various inputs`}
        </pre>
        <p className="leading-7">
          고급 패턴: <strong>CoT, self-critique, multi-step, conditional, extraction</strong>.<br />
          nested documents, tool definitions, validation.<br />
          2-3 levels nesting 권장, meaningful names.
        </p>
      </div>
    </section>
  );
}
