import { useState } from 'react';
import FrobeniusSvg from './FrobeniusSvg';

/** Frobenius endomorphism: interactive a,b sliders + reflection viz */
export default function FrobeniusViz() {
  const [a, setA] = useState(3);
  const [b, setB] = useState(5);

  return (
    <div className="rounded-xl border p-5 mb-6">
      <div className="flex flex-wrap gap-4 mb-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          a = <input type="range" min={0} max={6} value={a}
            onChange={e => setA(+e.target.value)} className="w-20 accent-[#6366f1]" />
          <span className="w-4 text-foreground font-medium">{a}</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          b = <input type="range" min={0} max={6} value={b}
            onChange={e => setB(+e.target.value)} className="w-20 accent-[#6366f1]" />
          <span className="w-4 text-foreground font-medium">{b}</span>
        </label>
      </div>
      <FrobeniusSvg a={a} b={b} />
    </div>
  );
}
