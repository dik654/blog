import { CitationBlock } from '@/components/ui/citation';
import SAEStructureViz from './viz/SAEStructureViz';

export default function SAEArchitecture() {
  return (
    <section id="sae-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        SAE 구조: 희소 인코딩과 복원
      </h2>
      <div className="not-prose mb-8"><SAEStructureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          목표: 뉴런 출력을 적절히 조합하여 특정 개념에만 반응하는 <strong>"특징"</strong>을 추출<br />
          핵심 아이디어: 넓은 공간으로 확장한 뒤, 희소성 제약으로 소수만 활성화
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">인코더</h3>
        <p>
          뉴런 출력(d=2304) × 가중치 행렬(2304×16K) → 특징 벡터(d=16K)<br />
          ReLU 활성화 함수 적용 → 대부분의 값이 0이 됨(희소성)<br />
          활성화된 소수의 특징만이 의미 있는 개념에 대응
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">디코더</h3>
        <p>
          특징 벡터(16K) × 복원 행렬(16K×2304) → 원래 뉴런 출력 복원<br />
          훈련 목표: <strong>복원 손실</strong>(reconstruction loss) 최소화 + <strong>L1 희소성 페널티</strong>
        </p>

        <CitationBlock
          source="Bricken et al., Anthropic 2023 — Towards Monosemanticity §2"
          citeKey={4} type="paper"
          href="https://transformer-circuits.pub/2023/monosemantic-features"
        >
          <p className="italic">
            "We train sparse autoencoders on MLP activations... The L1 penalty
            encourages the hidden layer to be sparse, so that each unit
            corresponds to a single interpretable concept."
          </p>
          <p className="mt-2 text-xs">
            L1 페널티가 희소성을 강제 → 각 유닛이 단일 해석 가능 개념에 대응
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 희소성이 핵심인가</h3>
        <p>
          희소성 없이 학습하면 각 특징이 여러 개념에 반응(= 다의성 재발)<br />
          L1 페널티가 불필요한 활성화를 억제 → 하나의 특징 = 하나의 개념<br />
          이것이 SAE의 "Sparse"가 의미하는 바
        </p>
      </div>
    </section>
  );
}
