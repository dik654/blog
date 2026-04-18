import { CitationBlock } from '@/components/ui/citation';
import PolysemantViz from './viz/PolysemantViz';
import SuperpositionDetailViz from './viz/SuperpositionDetailViz';

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Superposition Hypothesis 상세</h3>
        <div className="not-prose"><SuperpositionDetailViz /></div>
        <p className="leading-7">
          요약 1: <strong>Superposition 가설</strong> — 뉴런 수보다 많은 개념을 거의 직교 방향에 저장.<br />
          요약 2: <strong>Sparsity 덕분에 안전</strong> — 대부분 입력에서 소수 feature만 활성.<br />
          요약 3: SAE는 이 <strong>중첩을 역공학적으로 풀어내는</strong> 도구.
        </p>
      </div>
    </section>
  );
}
