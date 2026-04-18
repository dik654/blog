import { CitationBlock } from '@/components/ui/citation';
import M from '@/components/ui/math';
import DotProductViz from './viz/DotProductViz';
import MultiplicativeDetailViz from './viz/MultiplicativeDetailViz';

export default function Multiplicative() {
  return (
    <section id="multiplicative" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Luong & Scaled Dot-Product Attention</h2>
      <div className="not-prose mb-8"><DotProductViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Luong Attention(2015) — MLP 대신 <strong>내적(dot-product, 두 벡터를 곱해 합산하는 연산)</strong>으로 정렬 점수 계산<br />
          행렬 곱 한 번으로 배치 처리 가능 → Bahdanau 대비 연산 효율 대폭 향상<br />
          Transformer(2017) — 여기에 <strong>√d_k 스케일링</strong> 추가, 차원이 커져도 softmax 안정 동작
        </p>

        <CitationBlock source="Luong et al., 2015 — Effective Approaches to Attention-based NMT"
          citeKey={3} type="paper" href="https://arxiv.org/abs/1508.04025">
          <p className="italic">"We propose and compare various attention-based models:
          global attention which always attends to all source positions,
          and local attention that only looks at a subset."</p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Score 함수 3가지</h3>

        <p className="font-semibold text-sm text-sky-500 mb-1">1. Dot-Product</p>
        <M display>{'\\text{score}(s_t, h_s) = \\underbrace{s_t^\\top}_{\\text{디코더 상태}} \\cdot \\underbrace{h_s}_{\\text{인코더 상태}}'}</M>

        <p className="font-semibold text-sm text-emerald-500 mb-1">2. General (Bilinear)</p>
        <M display>{'\\text{score}(s_t, h_s) = s_t^\\top \\cdot \\underbrace{W_a}_{\\text{학습 가중치 행렬}} \\cdot h_s'}</M>

        <p className="font-semibold text-sm text-amber-500 mb-1">3. Scaled Dot-Product (Transformer)</p>
        <M display>{'\\text{Attention}(Q,K,V) = \\underbrace{\\text{softmax}\\!\\left(\\frac{\\overbrace{QK^\\top}^{\\text{유사도 행렬}}}{\\underbrace{\\sqrt{d_k}}_{\\text{스케일링}}}\\right)}_{\\text{주의 가중치}} \\cdot V'}</M>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-2 mt-4 text-sm">
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-bold text-xs text-sky-500">Dot-Product</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              추가 파라미터 없음 — 가장 빠름.<br />
              인코더·디코더 차원이 같아야 사용 가능.<br />
              소규모 모델에서 빠른 프로토타이핑에 적합.
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-bold text-xs text-emerald-500">General (Bilinear)</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              W_a 행렬이 차원 간 관계를 학습.<br />
              인코더·디코더 차원이 달라도 동작.<br />
              파라미터 d×d개 추가 — 유연하지만 비용 증가.
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card px-3 py-2">
            <span className="font-bold text-xs text-amber-500">Scaled Dot-Product</span>
            <div className="text-xs text-muted-foreground mt-1 leading-relaxed">
              √d_k 스케일링으로 softmax 포화 방지.<br />
              행렬 곱 한 번 → GPU 병렬화 최적.<br />
              Transformer 이후 사실상 표준.
            </div>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">√d_k 스케일링이 필요한 이유</h3>
        <p>
          Q와 K의 각 원소가 독립 N(0,1)을 따를 때, dot product Q·K의 분산은 d_k에 비례한다.
          d_k=64이면 내적 값이 ±8 범위로 퍼져, softmax가 one-hot에 수렴하고 gradient가 거의 0이 된다.
          √d_k로 나누면 분산이 1로 정규화되어 softmax가 안정적으로 동작한다.
        </p>
        <M display>{'\\text{Var}[Q \\cdot K] = d_k \\quad \\Rightarrow \\quad \\text{Var}\\!\\left[\\frac{Q \\cdot K}{\\sqrt{d_k}}\\right] = \\frac{d_k}{d_k} = 1'}</M>

        <h3 className="text-xl font-semibold mt-6 mb-3">세 가지 score 함수 비교</h3>
        <p>
          Dot-product는 파라미터 없이 가장 빠르지만 같은 차원 필수.
          General(Bilinear)은 학습 행렬 W로 유사도 함수 자체를 학습한다.
          Luong은 Global/Local attention 구분과 input-feeding 접근법도 제안하여 Transformer 표준의 토대를 놓았다.
        </p>
        <M display>{'\\underbrace{s^\\top h}_{\\text{Dot}} \\quad \\underbrace{\\frac{s^\\top h}{\\sqrt{d_k}}}_{\\text{Scaled}} \\quad \\underbrace{s^\\top W h}_{\\text{General}} \\quad \\underbrace{v^\\top \\tanh(W[s;h])}_{\\text{Concat}}'}</M>
      </div>

      <div className="not-prose my-8"><MultiplicativeDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: <strong>√d_k 스케일링</strong>은 dot product의 분산을 1로 정규화 — softmax 포화 방지.<br />
          요약 2: Dot-product 방식은 <strong>행렬 연산 한 번</strong>으로 완결 — Transformer의 핵심 효율성.<br />
          요약 3: Luong의 <strong>general·concat 변형</strong>이 Transformer의 multi-head로 확장됨.
        </p>
      </div>
    </section>
  );
}
