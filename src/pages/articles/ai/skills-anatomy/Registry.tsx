import RegistryViz from './viz/RegistryViz';

export default function Registry() {
  return (
    <section id="registry" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">스킬 레지스트리 & 생태계</h2>
      <div className="not-prose"><RegistryViz /></div>
    </section>
  );
}
