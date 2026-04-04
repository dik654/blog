import { CitationBlock } from '@/components/ui/citation';
import PolysemantViz from './viz/PolysemantViz';

export default function Polysemanticity() {
  return (
    <section id="polysemanticity" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다의성과 중첩 가설</h2>
      <div className="not-prose mb-8"><PolysemantViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          한 뉴런이 "의심", "약어", "법률 용어" 등 여러 개념에 반응<br />
          = 다의성(Polysemanticity). 단일 뉴런으로 해석 불가.
        </p>

        <CitationBlock
          source="Elhage et al., Anthropic 2022 — Toy Models of Superposition"
          citeKey={3} type="paper"
          href="https://transformer-circuits.pub/2022/toy_model"
        >
          <p className="italic">
            "Neural networks represent more features than they have neurons
            by encoding features in superposition — as almost-orthogonal
            directions in activation space."
          </p>
          <p className="mt-2 text-xs">
            중첩 가설 — 뉴런 수보다 많은 개념을 거의 직교하는 방향으로 인코딩
          </p>
        </CitationBlock>

        <p>
          <strong>중첩 가설</strong> — 뉴런 수보다 많은 개념을 거의 직교 방향으로 인코딩.<br />
          이를 분리하기 위해 SAE(Sparse Autoencoder) 등장.
        </p>
      </div>
    </section>
  );
}
