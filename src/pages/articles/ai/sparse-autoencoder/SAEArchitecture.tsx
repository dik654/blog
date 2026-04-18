import { CitationBlock } from '@/components/ui/citation';
import SAEStructureViz from './viz/SAEStructureViz';
import SAEMathDetailViz from './viz/SAEMathDetailViz';
import M from '@/components/ui/math';

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

        <h4>SAE 인코더 · 디코더</h4>
        <M display>{'\\underbrace{f(x)}_{\\text{특징 벡터}} = \\text{ReLU}\\big(\\underbrace{W_{\\text{enc}}}_{d \\times m} \\cdot x + b_{\\text{enc}}\\big), \\quad \\underbrace{\\hat{x}}_{\\text{복원}} = \\underbrace{W_{\\text{dec}}}_{m \\times d} \\cdot f(x) + b_{\\text{dec}}'}</M>

        <h4>학습 손실</h4>
        <M display>{'\\mathcal{L} = \\underbrace{\\|x - \\hat{x}\\|_2^2}_{\\text{복원 손실}} + \\underbrace{\\lambda \\|f(x)\\|_1}_{\\text{L1 희소성 페널티}}'}</M>

        <div className="not-prose grid grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { sym: 'W_enc (d×m)', name: '인코더', desc: '뉴런 출력(d=2304)을 넓은 특징 공간(m=16K)으로 확장. ReLU로 대부분 0이 됨' },
            { sym: 'W_dec (m×d)', name: '디코더', desc: '활성화된 특징을 원래 뉴런 공간으로 복원. 복원 품질이 학습 신호' },
            { sym: '‖x − x̂‖²', name: '복원 손실', desc: '원본과 복원의 MSE. 이것만 최소화하면 모든 특징이 활성화됨' },
            { sym: 'λ‖f(x)‖₁', name: 'L1 페널티', desc: 'λ가 커질수록 더 적은 특징만 활성화 → 하나의 특징 = 하나의 개념' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>

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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">SAE 수식과 학습</h3>
        <div className="not-prose"><SAEMathDetailViz /></div>
        <p className="leading-7">
          요약 1: SAE는 <strong>wide linear encoder + ReLU + decoder</strong> 구조.<br />
          요약 2: <strong>Reconstruction + L1 sparsity</strong> 양립이 핵심 균형.<br />
          요약 3: Top-K, Gated SAE 등 <strong>변형 활발</strong> — 2024 연구 핫토픽.
        </p>
      </div>
    </section>
  );
}
