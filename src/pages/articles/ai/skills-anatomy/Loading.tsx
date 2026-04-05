import LoadingViz from './viz/LoadingViz';

export default function Loading() {
  return (
    <section id="loading" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동적 로딩 &amp; 발견</h2>
      <div className="not-prose"><LoadingViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill 로딩 메커니즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Dynamic Skill Loading:

// Discovery phase (startup):
// 1. Scan skill directories:
//    - ~/.claude/skills/
//    - ./project/.claude/skills/
//    - system-wide locations
// 2. For each skill:
//    - read SKILL.md frontmatter
//    - extract name + description
// 3. Build skill index

// Skill Index (in-memory):
// [
//   {name: "pdf-processor", desc: "Extract PDFs"},
//   {name: "git-helper", desc: "Git operations"},
//   {name: "test-runner", desc: "Run tests"},
//   ...
// ]

// Progressive disclosure:
// - initial context: short descriptions only
// - ~50-100 tokens per skill
// - 100 skills = 5K-10K tokens (manageable)
// - vs loading all content: 100K+ tokens (overflow)

// Invocation flow:
// 1. User query arrives
// 2. LLM sees skill index
// 3. LLM selects matching skill
// 4. System loads full SKILL.md
// 5. Content injected into context
// 6. LLM executes instructions

// Example:
// User: "Can you process this PDF?"
//
// LLM context (initial):
// Available skills:
// - pdf-processor: Extract PDFs
// - web-scraper: Fetch webpages
// - git-helper: Git operations
//
// LLM: "I should use pdf-processor"
// → reads SKILL.md
// → sees: "Run python extract.py <file>"
// → executes command

// Skill resolution:
// - exact name match (high priority)
// - description similarity (semantic search)
// - fuzzy matching
// - user override

// Caching:
// - recently-used skills cached
// - avoids re-reading
// - invalidated on modification
// - version-aware

// Version management:
// - skills have versions
// - compatibility checks
// - rollback support
// - A/B testing

// Search strategies:
// 1. Name-based:
//    - exact match first
//    - prefix match
//    - fuzzy match
//
// 2. Description-based:
//    - keyword extraction
//    - embedding similarity
//    - LLM-based selection
//
// 3. Tag-based:
//    - categorization (tags in SKILL.md)
//    - filtering by domain

// Hierarchical loading:
// project → user → system
// - project skills override user
// - user skills override system
// - flexible customization

// Performance:
// - scan: <100ms for 100 skills
// - index build: in-memory structure
// - selection: <10ms (fuzzy)
// - load full content: disk I/O

// Challenges:
// - skill name collision
// - ambiguous selection
// - outdated skills
// - security (untrusted skills)`}
        </pre>
        <p className="leading-7">
          Skill Loading: <strong>scan → index → progressive disclosure → lazy load</strong>.<br />
          initial: 50-100 tokens per skill (description only).<br />
          100+ skills 관리 가능 — context 효율적.
        </p>
      </div>
    </section>
  );
}
