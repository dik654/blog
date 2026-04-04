import CoreConceptsViz from './viz/CoreConceptsViz';

export default function Glossary() {
  return (
    <section id="glossary" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">핵심 개념: 시퀀서 · 배치 · Fraud Proof</h2>
      <CoreConceptsViz />
    </section>
  );
}
