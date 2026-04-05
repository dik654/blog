import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Skill이란 무엇인가</h2>
      <div className="not-prose"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          Skill: <strong>AI agent용 reusable capability package</strong>.<br />
          Anthropic 2024 release — Claude의 확장 메커니즘.<br />
          SKILL.md + code files로 구성, progressive disclosure로 호출.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Skill vs Tool vs Plugin</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// AI Agent Extension 방식 비교:

// 1. Tool (low-level):
// - function signature
// - single operation
// - direct invocation
// - 예: bash, read_file, write_file
//
// - LLM decides when to call
// - schema-based (JSON)
// - stateless usually

// 2. Plugin (medium-level):
// - collection of tools
// - themed capabilities
// - installable package
// - 예: OpenAI plugin (deprecated)

// 3. Skill (high-level):
// - workflow instructions
// - multi-step guidance
// - domain expertise
// - 예: pdf-processing, git-ops

// Key difference: knowledge encoding
// - Tool: API definition
// - Plugin: collection of APIs
// - Skill: knowledge + workflow

// Skill structure:
// skills/
//   pdf-processor/
//     SKILL.md          # description + instructions
//     extract.py        # implementation
//     convert.sh        # helper scripts
//     examples/         # example outputs

// SKILL.md frontmatter:
// ---
// name: pdf-processor
// description: Extract and convert PDFs
// version: 1.0
// ---

// Body (instructions):
// ## Extracting text
// Run: python extract.py <path>
//
// ## Converting to markdown
// Run: ./convert.sh <path> markdown

// Progressive Disclosure:
// - LLM sees only SKILL.md name + description initially
// - reads full content when needed
// - reduces context usage
// - scales to 100s of skills

// Invocation flow:
// 1. User task arrives
// 2. LLM checks available skills
// 3. Matches skill by description
// 4. Reads SKILL.md fully
// 5. Executes instructions
// 6. Returns result

// Example: "Convert this PDF to markdown"
// → LLM finds pdf-processor skill
// → reads SKILL.md
// → runs convert.sh
// → returns markdown

// Benefits:
// ✓ reusable across projects
// ✓ domain expertise captured
// ✓ easy to share/install
// ✓ agent-agnostic
// ✓ versionable

// Anthropic Claude Skills (2024):
// - built-in skills
// - custom skills (user-defined)
// - community skills
// - enterprise internal skills

// Compared to GPT Actions:
// - Actions: OpenAPI specs
// - Skills: instructions + code
// - Actions: API-centric
// - Skills: workflow-centric`}
        </pre>
        <p className="leading-7">
          Skill = <strong>SKILL.md + code + progressive disclosure</strong>.<br />
          Tool (low) → Plugin (medium) → Skill (high) 계층.<br />
          workflow-centric, reusable domain expertise.
        </p>
      </div>
    </section>
  );
}
