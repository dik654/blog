import HooksSkillsViz from './viz/HooksSkillsViz';
import HooksSkillsDetailViz from './viz/HooksSkillsDetailViz';

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
        <div className="not-prose mb-6"><HooksSkillsDetailViz /></div>
        <p className="leading-7">
          Hooks: <strong>event-driven callbacks (PreToolUse, PostToolUse, ...)</strong>.<br />
          Skills: reusable capabilities via SKILL.md + code.<br />
          progressive disclosure: LLM reads only when needed.
        </p>
      </div>
    </section>
  );
}
