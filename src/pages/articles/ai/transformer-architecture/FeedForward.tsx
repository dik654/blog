import CodePanel from '@/components/ui/code-panel';
import { ffnCode, ffnAnnotations } from './FeedForwardData';
import FeedForwardViz from './viz/FeedForwardViz';

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
        <CodePanel title="FFN 구현: GELU vs SwiGLU" code={ffnCode} lang="python" annotations={ffnAnnotations} />
      </div>
    </section>
  );
}
