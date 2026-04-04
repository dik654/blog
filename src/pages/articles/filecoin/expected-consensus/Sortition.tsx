import PoissonSortitionViz from './viz/PoissonSortitionViz';
import SortitionDetailViz from './viz/SortitionDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function Sortition({ onCodeRef }: Props) {
  return (
    <section id="sortition" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Poisson Sortition</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Filecoin 블록 생성자 선출 — Poisson Sortition 기반<br />
        각 에폭(30초)마다 QualityAdjPower에 비례하여 복수 마이너 동시 당선
      </p>
      <div className="not-prose mb-8"><PoissonSortitionViz /></div>
      <div className="not-prose mb-8">
        <SortitionDetailViz onOpenCode={onCodeRef} />
      </div>
    </section>
  );
}
