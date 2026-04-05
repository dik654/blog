import RegistryViz from './viz/RegistryViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킬 레지스트리 &amp; 생태계</h2>
      <div className="not-prose"><RegistryViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill Registry &amp; Ecosystem</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Skill Registry (inspired by npm):

// Location hierarchy:
// 1. Project-specific:
//    ./.claude/skills/
//    - override user/system
//    - version-controlled with project
//    - project-specific workflows
//
// 2. User-level:
//    ~/.claude/skills/
//    - personal skills
//    - cross-project reuse
//    - user customization
//
// 3. System-level:
//    /usr/share/claude/skills/
//    - Anthropic-provided
//    - organization-wide
//    - security-vetted

// Installation:
// - manual: copy to directory
// - package manager: claude-skills install
// - git clone: from repository
// - URL: remote fetch

// Example install:
// $ claude-skills install pdf-processor
// → fetches from registry
// → places in ~/.claude/skills/
// → verifies signature
// → registers in index

// Package format:
// skill-name-1.0.0.tar.gz
// ├── SKILL.md
// ├── scripts/
// ├── examples/
// └── manifest.json

// Registry infrastructure:
// - public registry (Anthropic)
// - private/enterprise registries
// - local filesystem
// - git-based distribution

// Security:
// - skill signing (GPG)
// - signature verification
// - audit logs
// - sandboxing
// - permission manifests

// Permission manifests:
// {
//   "name": "pdf-processor",
//   "permissions": {
//     "network": false,
//     "filesystem": ["read-input", "write-output"],
//     "commands": ["python", "pandoc"]
//   }
// }

// Discovery:
// - catalog website
// - search by tag/keyword
// - popularity ranking
// - verified status
// - reviews & ratings

// Community contribution:
// - GitHub repos
// - PR-based review
// - community ownership
// - maintainer roles
// - contribution guidelines

// Quality standards:
// - documented (complete SKILL.md)
// - tested (examples provided)
// - maintained (active updates)
// - safe (no malicious code)
// - performant (reasonable complexity)

// Versioning & updates:
// - semver (semantic versioning)
// - breaking changes in major
// - backward compat within minor
// - deprecation warnings
// - migration guides

// 2024-2025 Ecosystem:
// - Anthropic official skills
// - Community skills (GitHub)
// - Enterprise registries
// - Skill marketplaces (emerging)
// - Skills SDK

// Comparison with similar:
// - npm (JavaScript packages)
// - pip (Python packages)
// - Docker Hub (containers)
// - Hugging Face (models)
// - MCP servers (protocol-based)

// Future directions:
// - verified publisher program
// - paid/premium skills
// - enterprise private registries
// - skill composition
// - cross-platform standards`}
        </pre>
        <p className="leading-7">
          Registry: <strong>project → user → system hierarchy</strong>.<br />
          package format, signature verification, permission manifests.<br />
          2024-2025: Anthropic official + community skills ecosystem.
        </p>
      </div>
    </section>
  );
}
