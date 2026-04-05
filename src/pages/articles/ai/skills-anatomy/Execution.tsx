import ExecutionViz from './viz/ExecutionViz';

export default function Execution() {
  return (
    <section id="execution" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실행 파이프라인</h2>
      <div className="not-prose"><ExecutionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill 실행 파이프라인</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Skill Execution Pipeline:

// Step 1: Selection
// - LLM parses user intent
// - matches against skill index
// - selects appropriate skill(s)
// - output: skill name + args

// Step 2: Loading
// - system reads SKILL.md
// - extracts instructions
// - loads helper scripts
// - prepares execution env

// Step 3: Preparation
// - injects SKILL.md into LLM context
// - LLM reads full instructions
// - LLM plans execution
// - LLM identifies required tools

// Step 4: Execution
// - LLM calls tools as directed
// - runs shell commands
// - invokes scripts
// - gathers intermediate results

// Step 5: Integration
// - combines results
// - formats output
// - handles errors
// - returns to user

// Example pipeline (PDF extraction):
//
// 1. Selection:
//    User: "Extract text from invoice.pdf"
//    LLM: matches pdf-processor skill
//
// 2. Loading:
//    System: reads SKILL.md
//    Contains: "Run python extract.py <path>"
//
// 3. Preparation:
//    LLM context gets SKILL.md
//    LLM plans: "I'll run extract.py"
//
// 4. Execution:
//    LLM: bash("python extract.py invoice.pdf")
//    Output: extracted text
//
// 5. Integration:
//    LLM: "Here's the text: [extracted]..."
//    Returns formatted response

// Error Handling:
// - skill script fails → LLM retries
// - wrong arguments → LLM corrects
// - missing dependencies → LLM installs
// - fundamental error → reports to user

// Tool invocations per skill:
// - simple skill: 1-3 tool calls
// - complex skill: 10+ calls
// - workflow skill: dozens of calls

// Permissions model:
// - skill runs with user permissions
// - sandboxing (optional)
// - explicit allow/deny
// - dangerous operations → user confirmation

// Parallelization:
// - multiple skills can be called
// - parallel execution possible
// - coordination needed
// - state sharing via context

// Logging & Observability:
// - skill invocations logged
// - execution traces
// - performance metrics
// - error tracking

// Extensions:
// - before_run hooks
// - after_run hooks
// - error handlers
// - custom validators

// State management:
// - skill can maintain state (files)
// - cross-invocation memory
// - persistent storage
// - cleanup on finish

// Versioning:
// - skill version in SKILL.md
// - backwards compat checks
// - migration guides
// - A/B testing support`}
        </pre>
        <p className="leading-7">
          Execution: <strong>Selection → Loading → Preparation → Execution → Integration</strong>.<br />
          simple: 1-3 calls, complex: 10+ tool invocations.<br />
          permissions, logging, versioning 지원.
        </p>
      </div>
    </section>
  );
}
