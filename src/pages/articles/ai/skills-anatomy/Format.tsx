import FormatViz from './viz/FormatViz';

export default function Format() {
  return (
    <section id="format" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SKILL.md 포맷</h2>
      <div className="not-prose"><FormatViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SKILL.md 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// SKILL.md Format Specification:

// Complete example:
// ---
// name: pdf-processor
// description: Extract, convert, and manipulate PDF files
// version: 1.2.0
// author: username
// tags: [pdf, document, conversion]
// ---
//
// # PDF Processor
//
// This skill handles PDF document operations.
//
// ## Prerequisites
// - Python 3.8+
// - pdfplumber library
// - pandoc (for conversions)
//
// ## Usage
//
// ### Extract text
// Run: \`python extract.py <input.pdf>\`
// Output: plain text to stdout
//
// ### Convert to markdown
// Run: \`./convert.sh <input.pdf> markdown\`
// Output: markdown file
//
// ### Merge PDFs
// Run: \`python merge.py <out.pdf> <in1.pdf> <in2.pdf>\`
//
// ## Examples
// See examples/ directory for sample inputs/outputs.

// Frontmatter fields:

// Required:
// - name: unique identifier
// - description: short summary (<100 chars)

// Recommended:
// - version: semver
// - author: creator
// - tags: categorization

// Optional:
// - dependencies: required packages
// - prerequisites: system requirements
// - license: usage terms
// - documentation: external link
// - examples: example file paths

// Body content:

// 1. Introduction (brief):
// - what the skill does
// - when to use it
// - high-level workflow

// 2. Usage instructions:
// - commands to run
// - parameters explained
// - expected outputs
// - common patterns

// 3. Examples:
// - concrete use cases
// - expected inputs/outputs
// - edge cases

// Design principles:

// 1. Clarity:
// - clear, direct instructions
// - LLM must understand without ambiguity
// - explicit > implicit

// 2. Conciseness:
// - focused on essential info
// - LLM context is limited
// - trim unnecessary prose

// 3. Testability:
// - provide examples
// - show expected outputs
// - enable verification

// 4. Composability:
// - skill callable from other skills
// - standard I/O formats
// - avoid tight coupling

// Anti-patterns:
// ✗ Long essays (hurts LLM focus)
// ✗ Ambiguous instructions
// ✗ Missing error handling guidance
// ✗ Hardcoded paths
// ✗ Complex conditionals

// Best practices:
// ✓ start with TL;DR
// ✓ commands in code blocks
// ✓ explicit success/failure signals
// ✓ versioned dependencies
// ✓ testable examples

// Community standards:
// - Anthropic Claude Skills format
// - emerging industry convention
// - 2024 evolution ongoing`}
        </pre>
        <p className="leading-7">
          SKILL.md: <strong>frontmatter (metadata) + body (instructions)</strong>.<br />
          required: name, description; recommended: version, author, tags.<br />
          design: clarity + conciseness + testability + composability.
        </p>
      </div>
    </section>
  );
}
