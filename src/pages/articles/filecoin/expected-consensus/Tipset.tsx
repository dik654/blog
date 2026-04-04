import TipsetDetailViz from './viz/TipsetDetailViz';
import type { CodeRef } from '@/components/code/types';

interface Props {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}

export default function Tipset({ onCodeRef }: Props) {
  return (
    <section id="tipset" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tipset 선택</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        같은 에폭에서 같은 부모를 공유하는 블록들의 집합 = Tipset<br />
        Heaviest Chain Rule로 정규 체인을 선택
      </p>
      <div className="not-prose mb-8">
        <TipsetDetailViz onOpenCode={onCodeRef} />
      </div>
    </section>
  );
}
