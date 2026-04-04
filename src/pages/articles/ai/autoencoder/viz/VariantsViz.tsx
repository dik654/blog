import { useState } from 'react';
import { VARIANTS } from './VariantsVizData';
import VariantDiagram from './VariantDiagram';

export default function VariantsViz() {
  const [sel, setSel] = useState(0);

  return (
    <div className="not-prose rounded-xl border p-5 mb-6">
      <div className="flex gap-2 mb-5">
        {VARIANTS.map((vr, i) => (
          <button key={vr.id} onClick={() => setSel(i)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors cursor-pointer ${
              i === sel ? 'bg-primary/10 border-primary text-primary' : 'hover:bg-accent'
            }`}>
            {vr.title}
          </button>
        ))}
      </div>
      <VariantDiagram sel={sel} />
    </div>
  );
}
