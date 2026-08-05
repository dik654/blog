import MathText from '@/components/ui/math-text';
import FeedForwardScene from './viz/FeedForwardScene';
import FFNDetailScene from './viz/FFNDetailScene';
import M from '@/components/ui/math';

export default function FeedForward() {
  return (
    <MathText id="feed-forward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Feed-Forward Network</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          attention은 token 사이 정보를 섞는다<br />
          그 다음에는 각 위치의 벡터를 독립적으로 다시 변환해, 섞인 문맥에서 새 feature 조합을 만든다<br />
          d_model을 더 넓은 d_ff로 확장하고, 한 번 휘게 한 뒤 다시 원래 차원으로 압축한다
        </p>
      </div>

      <FeedForwardScene />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>GELU vs SwiGLU</h3>
        <p>
          두 선형층 사이가 선형이면 결국 한 선형층과 같다<br />
          ReLU, GELU, SwiGLU 같은 활성화가 중간 표현을 휘게 만들어 확장층의 의미를 살린다<br />
          SwiGLU는 별도 gate projection으로 어떤 feature를 통과시킬지도 같이 학습한다
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
      <FFNDetailScene />
      <div className="prose prose-neutral dark:prose-invert max-w-none mt-4">
        <p className="leading-7">
          요약 1: FFN은 d_model → d_ff → d_model 확장-압축 구조.<br />
          요약 2: token 사이 상호작용은 attention이 맡고, FFN은 위치별로 독립 처리.<br />
          요약 3: 큰 모델에서는 FFN 파라미터 비중이 커서 모델 용량의 핵심이 된다.
        </p>
      </div>
    </MathText>
  );
}
