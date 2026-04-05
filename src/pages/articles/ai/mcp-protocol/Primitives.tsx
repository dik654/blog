import PrimitivesViz from './viz/PrimitivesViz';

export default function Primitives() {
  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3가지 프리미티브: Tools · Resources · Prompts</h2>
      <div className="not-prose mb-8"><PrimitivesViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Tools — LLM이 호출하는 함수 (행동), Resources — LLM이 읽는 데이터 (정보), Prompts — 재사용 템플릿<br />
          각 프리미티브는 JSON Schema로 정의 — LLM이 자동으로 파라미터 구조를 파악
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">MCP Primitives 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MCP 3 Primitives:

// 1. Tools (Actions):
// - callable functions
// - LLM invokes to do something
// - modify external state
// - examples:
//   - send_email(to, subject, body)
//   - execute_sql(query)
//   - create_github_issue(repo, title)
//
// Definition:
// {
//   "name": "send_email",
//   "description": "Send an email",
//   "inputSchema": {
//     "type": "object",
//     "properties": {
//       "to": {"type": "string"},
//       "subject": {"type": "string"},
//       "body": {"type": "string"}
//     },
//     "required": ["to", "subject", "body"]
//   }
// }

// 2. Resources (Data):
// - readable data sources
// - LLM reads to get context
// - static or dynamic
// - examples:
//   - files on disk
//   - database rows
//   - API responses
//   - cached content
//
// Definition:
// {
//   "uri": "file:///project/README.md",
//   "name": "README",
//   "description": "Project documentation",
//   "mimeType": "text/markdown"
// }
//
// Client can:
// - list resources
// - read resource content
// - subscribe to updates

// 3. Prompts (Templates):
// - reusable prompt templates
// - parameterized
// - workflows captured
// - examples:
//   - code_review(file)
//   - summarize(text, length)
//   - generate_tests(function)
//
// Definition:
// {
//   "name": "code_review",
//   "description": "Review code for issues",
//   "arguments": [
//     {"name": "file_path", "required": true},
//     {"name": "focus_areas", "required": false}
//   ]
// }

// Comparison:
// | Primitive  | Purpose        | Direction     |
// | Tools      | Actions        | LLM → World   |
// | Resources  | Context        | World → LLM   |
// | Prompts    | Workflows      | Pre-defined   |

// LLM interaction model:
// 1. LLM sees available tools/resources/prompts
// 2. LLM decides what to use
// 3. Client invokes via MCP
// 4. Server executes + returns
// 5. LLM incorporates result

// JSON Schema role:
// - self-documenting APIs
// - LLM reads schema
// - understands parameters
// - type validation
// - generates correct calls

// Progressive complexity:
// - simple tools: single function
// - complex tools: stateful, long-running
// - composable: tool → another tool
// - nested: prompts use tools

// Ecosystem examples:
// - Filesystem MCP: file ops
// - Git MCP: version control
// - SQLite MCP: database
// - Brave Search: web search
// - Playwright: browser automation
// - Memory: persistent storage`}
        </pre>
        <p className="leading-7">
          3 primitives: <strong>Tools (actions), Resources (data), Prompts (templates)</strong>.<br />
          JSON Schema로 정의 → LLM이 자동 파라미터 이해.<br />
          Filesystem, Git, Database 등 ecosystem 확장 중.
        </p>
      </div>
    </section>
  );
}
