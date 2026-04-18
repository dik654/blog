import FeedForwardViz from './viz/FeedForwardViz';
import FFNDetailViz from './viz/FFNDetailViz';
import M from '@/components/ui/math';

export default function FeedForward() {
  return (
    <section id="feed-forward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Feed-Forward Network</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          FFN — 어텐션이 토큰 간 관계를 모델링한 후 각 토큰의 표현을 <strong>독립적으로 변환</strong><br />
          포지션별(position-wise) 완전 연결 네트워크<br />
          d_model 차원을 d_ff(보통 4배)로 확장 → 비선형 활성화 → 원래 차원으로 복원
        </p>
      </div>

      <FeedForwardViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>GELU vs SwiGLU</h3>
        <p>
          원본 Transformer는 ReLU를 사용<br />
          최신 모델은 <strong>GELU</strong>(BERT, GPT)나 <strong>SwiGLU</strong>(LLaMA, PaLM) 채택<br />
          SwiGLU — 게이트 메커니즘을 추가하여 더 나은 성능 달성
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mt-4">
          <div className="rounded-xl border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950/40 p-4">
            <h4 className="font-semibold text-sky-700 dark:text-sky-300 mb-2">표준 FFN (GELU)</h4>
            <M display>
              {`\\underbrace{W_2 \\cdot \\text{GELU}(W_1 x + b_1) + b_2}_{d_{\\text{model}} \\to d_{\\text{ff}} \\to d_{\\text{model}}}`}
            </M>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
              <M>{'d_{\\text{ff}} = 4 \\cdot d_{\\text{model}}'}</M> 확장 후 비선형 활성화, 다시 원래 차원으로 복원. GELU는 입력에 확률적 게이팅을 적용 — ReLU보다 부드러운 경계
            </p>
          </div>
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 p-4">
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">SwiGLU (LLaMA, PaLM)</h4>
            <M display>
              {`\\underbrace{W_2 \\cdot \\bigl(\\text{SiLU}(W_1 x) \\odot W_3 x\\bigr)}_{\\text{게이트 } W_3 x \\text{가 정보 흐름 제어}}`}
            </M>
            <p className="text-sm text-neutral-700 dark:text-neutral-300 mt-2">
              <M>{'W_3'}</M>(gate projection)가 추가 — <M>{'\\text{SiLU}(W_1 x)'}</M>와 <M>{'W_3 x'}</M>의 원소별 곱으로 정보 선택적 전달. 파라미터 50% 증가하지만 <M>{'d_{\\text{ff}} = \\tfrac{8}{3} d_{\\text{model}}'}</M>로 조정하여 총량 유지
            </p>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">FFN 구조와 역할</h3>
        <M display>
          {`\\underbrace{\\text{FFN}(x) = \\max(0,\\, x W_1 + b_1)\\, W_2 + b_2}_{d_{\\text{model}} \\;\\to\\; 4 d_{\\text{model}} \\;\\to\\; d_{\\text{model}}}`}
        </M>
      </div>
      <FFNDetailViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: FFN은 <strong>d_model → 4·d_model → d_model</strong> 확장-압축 구조.<br />
          요약 2: <strong>position-wise</strong> — 토큰 독립 처리, 완전 병렬.<br />
          요약 3: Transformer 파라미터의 <strong>약 2/3이 FFN</strong> — 모델 용량의 핵심.
        </p>
      </div>
    </section>
  );
}
