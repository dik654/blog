import RegistryViz from './viz/RegistryViz';
import RegistryDetailViz from './viz/RegistryDetailViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킬 레지스트리 &amp; 생태계</h2>
      <div className="not-prose"><RegistryViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Skill Registry &amp; Ecosystem</h3>
        <div className="not-prose mb-6"><RegistryDetailViz /></div>
        <p className="leading-7">
          Registry: <strong>project → user → system hierarchy</strong>.<br />
          package format, signature verification, permission manifests.<br />
          2024-2025: Anthropic official + community skills ecosystem.
        </p>
      </div>
    </section>
  );
}
