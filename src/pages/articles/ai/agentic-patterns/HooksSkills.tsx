import HooksSkillsViz from './viz/HooksSkillsViz';

export default function HooksSkills() {
  return (
    <section id="hooks-skills" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hooks & Skills: 에이전트 확장</h2>
      <div className="not-prose mb-8"><HooksSkillsViz /></div>
    </section>
  );
}
