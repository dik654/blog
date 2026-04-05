import HooksSkillsViz from './viz/HooksSkillsViz';

export default function HooksSkills() {
  return (
    <section id="hooks-skills" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hooks &amp; Skills: 에이전트 확장</h2>
      <div className="not-prose mb-8"><HooksSkillsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Hooks &amp; Skills: <strong>agent behavior 확장 메커니즘</strong>.<br />
          Hooks: 이벤트 기반 동작 (Claude Code style).<br />
          Skills: reusable 함수/도구 (LLM 호출 가능).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Hooks 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Hooks (Claude Code 방식):

// Definition:
// - event-driven callbacks
// - run shell commands on agent events
// - modify agent behavior
// - without rewriting agent

// Event types (Claude Code):
// - PreToolUse: before tool execution
// - PostToolUse: after tool execution
// - UserPromptSubmit: when user submits
// - Notification: system notifications
// - Stop: when agent stops
// - SessionStart: new session

// Example hook config:
// {
//   "hooks": {
//     "PreToolUse": [
//       {
//         "matcher": "Bash",
//         "hooks": [{
//           "type": "command",
//           "command": "echo '[BASH] $CLAUDE_COMMAND' >> /tmp/bash.log"
//         }]
//       }
//     ]
//   }
// }

// Use cases:
// - logging
// - command approval
// - notification
// - validation
// - rate limiting
// - custom formatting

// Benefits:
// - extensibility without agent modification
// - composable
// - user-customizable
// - declarative

// vs direct agent modification:
// direct: code changes required
// hooks: config only

// Skills (capability extensions):
//
// Definition:
// - reusable capabilities
// - agent-invokable
// - domain-specific
// - modular

// Components:
// - SKILL.md (description + instructions)
// - code/scripts (implementation)
// - metadata (name, version)

// Invocation:
// - LLM decides to use skill
// - reads SKILL.md
// - executes instructions
// - returns result

// Example skills:
// - pdf-processing
// - web-scraping
// - database-queries
// - git-operations
// - test-running

// Claude skills system:
// ~/.claude/skills/
//   pdf/
//     SKILL.md
//     extract.py
//     convert.sh

// SKILL.md structure:
// ---
// name: pdf-processing
// description: Extract text from PDFs
// ---
// ## Instructions
// To extract text, run:
// python extract.py <file>

// Tools vs Skills:
// Tools:
// - low-level API calls
// - single operation
// - direct invocation
//
// Skills:
// - high-level capability
// - multi-step workflows
// - orchestration

// Progressive disclosure:
// - SKILL.md: small description
// - LLM reads only when needed
// - reduces context bloat
// - scales to 100s of skills

// Ecosystem:
// - claude-skills-sdk
// - Anthropic official skills
// - community skills
// - enterprise internal`}
        </pre>
        <p className="leading-7">
          Hooks: <strong>event-driven callbacks (PreToolUse, PostToolUse, ...)</strong>.<br />
          Skills: reusable capabilities via SKILL.md + code.<br />
          progressive disclosure: LLM reads only when needed.
        </p>
      </div>
    </section>
  );
}
