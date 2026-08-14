import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExtensionAttempts from "./ExtensionAttempts";
import Overview from "./Overview";
import RopeFoundation from "./RopeFoundation";
import YarnMethod from "./YarnMethod";

const releaseChecks = [
  ["위치", "초반·중간·후반에 같은 evidence를 배치해 retrieval 위치 편향을 비교"],
  ["길이", "원래 context 안의 짧은 입력부터 목표 길이까지 여러 bucket으로 측정"],
  ["과제", "Perplexity·needle뿐 아니라 multi-evidence reasoning과 실제 workload를 분리"],
  ["서빙", "KV cache, TTFT, token latency와 concurrency를 품질 지표와 함께 기록"],
] as const;

function DeploymentAndPapers() {
  return (
    <>
      <section id="implementation" className="mb-16 scroll-mt-20 space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 구현과 release gate</p>
          <h2 className="mt-2 text-2xl font-bold">Model config·library version·평가 길이를 한 receipt로 고정한다</h2>
        </header>
        <p>
          배포에서는 <code>rope_type</code>, extension <code>factor</code>, 원래 context length, RoPE base와 rotary dimension을 먼저 읽습니다. 같은 “YaRN” 이름이라도 library가 attention factor를 자동 계산하는지, model metadata를 CLI override가 덮는지, partial rotary dimension을 어떻게 해석하는지가 다를 수 있으므로 model revision과 runtime version을 함께 고정해야 합니다.
        </p>
        <p>
          예를 들어 원래 32K를 학습한 checkpoint를 128K로 확장한다면 factor는 4입니다. 이 숫자는 계산의 출발점일 뿐 품질 보증이 아닙니다. Static scaling은 짧은 입력에도 같은 조정을 적용할 수 있고, 목표 길이가 늘면 full attention의 연산과 KV cache 비용도 그대로 커지므로 짧은 입력 regression과 serving capacity를 별도로 확인합니다.
        </p>
        <figure data-viz="yarn-release-matrix" className="not-prose rounded-xl border border-border bg-card p-5 sm:p-6">
          <figcaption>
            <p className="text-xs font-semibold text-primary">같은 checkpoint에서 base ↔ candidate 비교</p>
            <p className="mt-1 text-base font-bold">입력 수용 여부가 아니라 evidence 사용 능력을 검증한다</p>
          </figcaption>
          <div data-viz-canvas className="mt-5 grid gap-4 sm:grid-cols-2">
            {releaseChecks.map(([title, body], index) => (
              <section key={title} className="min-w-0 rounded-lg border border-border bg-background p-4">
                <p className="text-[11px] font-bold text-primary">CHECK {index + 1}</p>
                <p className="mt-1 text-sm font-semibold">{title}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p>
              </section>
            ))}
          </div>
        </figure>
        <aside className="rounded-lg border border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
          <strong className="text-foreground">채택 조건:</strong> 고정한 model·tokenizer·runtime에서 original-context quality가 허용 범위 안이고, 목표 길이의 여러 위치와 task에서 base보다 개선되며, OOM·latency·concurrency budget을 만족할 때만 채택합니다. 긴 입력 하나가 실행됐다는 사실은 통과 조건이 아닙니다.
        </aside>
      </section>

      <section id="paper-reading-notes" className="mb-16 scroll-mt-20 space-y-5">
        <header><p className="text-sm font-semibold text-primary">근거 지도</p><h2 className="mt-2 text-2xl font-bold">RoPE → PI → YaRN에서 바뀐 질문을 구분한다</h2></header>

        <div id="paper-roformer">
          <CitationBlock citeKey={1} source="RoFormer: Enhanced Transformer with Rotary Position Embedding" href="https://arxiv.org/abs/2104.09864">
            <p><strong>문제:</strong> Self-attention에 absolute position을 더하는 대신 query·key interaction 안에서 relative position을 표현하려고 합니다.</p>
            <p><strong>핵심 아이디어:</strong> Position에 비례하는 각도로 query와 key의 2차원 coordinate pair를 회전해 dot product가 상대 거리의 회전으로 정리되게 합니다.</p>
            <p><strong>중요 가정:</strong> 짝수 rotary dimension, 정해진 frequency schedule과 논문의 model·training setting을 사용합니다.</p>
            <p><strong>실험 범위:</strong> 논문이 선택한 language modeling과 downstream benchmark에서 RoPE architecture를 비교합니다.</p>
            <p><strong>일반화 금지:</strong> RoPE가 pretraining 길이 밖의 모든 distance를 정확히 extrapolation하거나 long-context reasoning을 자동으로 보장한다는 결론은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-positional-interpolation">
          <CitationBlock citeKey={2} source="Extending Context Window via Positional Interpolation" href="https://arxiv.org/abs/2306.15595">
            <p><strong>문제:</strong> 기존 RoPE checkpoint를 학습 범위 밖 position으로 그대로 외삽하면 fine-tuning이 불안정하고 성능이 무너질 수 있습니다.</p>
            <p><strong>핵심 아이디어:</strong> 확장된 position을 원래 범위 안으로 선형 압축한 뒤 짧은 long-context fine-tuning으로 적응시킵니다.</p>
            <p><strong>중요 가정:</strong> 원래 context length와 target factor를 알고 있으며 RoPE 기반 checkpoint와 논문의 adaptation data를 사용합니다.</p>
            <p><strong>실험 범위:</strong> 논문에 제시된 LLaMA 계열 checkpoint, 확장 길이와 benchmark 조건입니다.</p>
            <p><strong>일반화 금지:</strong> 모든 frequency의 근거리 해상도 손실이 무시 가능하거나 fine-tuning 없이 모든 model이 같은 길이를 활용한다는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-yarn">
          <CitationBlock citeKey={3} source="YaRN: Efficient Context Window Extension of Large Language Models" href="https://arxiv.org/abs/2309.00071">
            <p><strong>문제:</strong> PI의 일괄 압축과 기존 NTK-aware 방식의 frequency trade-off를 줄이면서 적은 token으로 긴 문맥에 적응하려고 합니다.</p>
            <p><strong>핵심 아이디어:</strong> 원래 context에서 관찰된 회전 수에 따라 frequency band별 interpolation·extrapolation을 섞고 attention logit scale을 보정합니다.</p>
            <p><strong>중요 가정:</strong> LLaMA 계열 RoPE geometry, 논문의 beta 경계·attention scaling과 long-context fine-tuning recipe를 전제로 합니다.</p>
            <p><strong>실험 범위:</strong> 논문 checkpoint·data·extension factor에서 perplexity와 passkey retrieval 등을 비교한 결과입니다.</p>
            <p><strong>일반화 금지:</strong> Beta 값과 attention factor가 모든 architecture의 최적값이거나 YaRN이 KV memory·attention FLOP을 줄인다는 결론은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-transformers-rope">
          <CitationBlock type="code" citeKey={4} source="Hugging Face Transformers · RoPE utilities documentation" href="https://huggingface.co/docs/transformers/main/en/internal/rope_utils">
            <p><strong>문제:</strong> Model family와 runtime마다 RoPE scaling config의 field·validation·default가 달라질 수 있습니다.</p>
            <p><strong>핵심 아이디어:</strong> Transformers가 지원하는 RoPE type과 configuration schema를 공식 문서로 제공합니다.</p>
            <p><strong>중요 가정:</strong> 배포 시 설치한 Transformers version과 model config revision을 별도로 고정해야 합니다.</p>
            <p><strong>근거 범위:</strong> 해당 문서 version의 config surface와 library 동작 설명입니다.</p>
            <p><strong>일반화 금지:</strong> 특정 checkpoint의 long-context 품질이나 다른 runtime의 동일 구현을 인증하는 자료는 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>
    </>
  );
}

export default function ModernYarnRopeArticle() {
  return (
    <article>
      <Overview />
      <ContentBoundary article="yarn-rope-extension" />
      <RopeFoundation />
      <ExtensionAttempts />
      <YarnMethod />
      <DeploymentAndPapers />
    </article>
  );
}
