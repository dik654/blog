import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import SelfAttentionTensorViz from "./viz/SelfAttentionTensorViz";

export default function SelfAttention({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="self-attention" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Self-attention: 같은 sequence 안에서 정보를 주고받기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Encoder–decoder attention에서는 query가 decoder에서, key와 value가
          encoder에서 나온다. Self-attention은 query, key, value를 모두 같은
          입력 <code>X</code>의 서로 다른 선형 투영으로 만든다. 따라서 각 token은
          같은 sequence의 다른 위치를 참고해 자신의 representation을 갱신한다.
        </p>
      </div>

      <SelfAttentionTensorViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Q, K, V는 같은 값이 아니라 같은 입력에서 나온다</h3>
      </div>

      <ExplainedFormula
        question="같은 input sequence가 질문·주소·content라는 서로 다른 역할을 어떻게 동시에 맡을까?"
        idea={<>X 자체를 세 번 복사하는 것이 아니라 서로 다른 learned matrix로 투영합니다. 같은 token도 query일 때와 key/value일 때 다른 좌표를 가질 수 있습니다.</>}
        formula={String.raw`\begin{aligned}Q&=XW_Q\\K&=XW_K\\V&=XW_V\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}Q&=\underbrace{XW_Q}_{\text{오른쪽 항으로 결과 계산}}\\K&=\underbrace{XW_K}_{\text{오른쪽 항으로 결과 계산}}\\V&=\underbrace{XW_V}_{\text{오른쪽 항으로 결과 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`XW_Q`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","X 자체를 세 번 복사하는 것이 아니라 서로 다른","learned matrix로 투영합니다."] },
          { expression: String.raw`XW_K`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","X 자체를 세 번 복사하는 것이 아니라 서로 다른","learned matrix로 투영합니다."] },
          { expression: String.raw`XW_V`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","X 자체를 세 번 복사하는 것이 아니라 서로 다른","learned matrix로 투영합니다."] },
        ]}
        terms={[
          { symbol: "X\\in\\mathbb R^{n\\times d_{model}}", name: "shared source", description: "n개 token의 현재 layer representation입니다." },
          { symbol: "W_Q,W_K,W_V", name: "role projections", description: "질문·주소·content 역할에 맞게 학습되는 서로 다른 parameter입니다." },
          { symbol: "Q,K,V", name: "projected tensors", description: "source는 같지만 값과 마지막 차원은 projection 설정에 따라 달라질 수 있습니다." },
        ]}
        assumptions={["한 self-attention layer의 단일 head 또는 head를 합친 matrix 표기입니다."]}
        interpretation="‘Q=K=V’라는 약식 표현은 source sequence가 같다는 뜻일 뿐 실제 tensor 값이나 weight matrix가 같다는 뜻이 아닙니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("qkv-projection", codeRefs["qkv-projection"])
        }
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          흔히 “self-attention은 Q=K=V”라고 줄여 말하지만 실제 tensor 값까지
          같다는 뜻은 아니다. 세 projection은 같은 <code>X</code>를 입력으로 받을
          뿐, 서로 다른 학습 parameter <code>W_Q</code>, <code>W_K</code>,
          <code>W_V</code>를 사용한다.
        </p>

        <h3>Multi-head는 여러 투영을 병렬로 학습한다</h3>
      </div>

      <ExplainedFormula
        question="한 개의 attention distribution 대신 여러 representation subspace에서 병렬로 읽으려면?"
        idea={<>model dimension을 H개 head의 projection으로 나누어 각자 score와 weighted sum을 계산하고, 결과를 concat한 뒤 output projection으로 다시 섞습니다.</>}
        formula={String.raw`\begin{aligned}Q_h&=XW_h^Q,\quad K_h=XW_h^K\\V_h&=XW_h^V\\a_h&=\operatorname{Attention}(Q_h,K_h,V_h)\\Y&=\operatorname{Concat}(a_1,\ldots,a_H)\\\operatorname{MHA}(X)&=YW_O\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}Q_h&=\underbrace{XW_h^Q,\quad K_h=XW_h^K}_{\text{오른쪽 항으로 결과 계산}}\\V_h&=\underbrace{XW_h^V}_{\text{오른쪽 항으로 결과 계산}}\\a_h&=\underbrace{\operatorname{Attention}(Q_h,K_h,V_h)}_{\text{head output 계산}}\\Y&=\operatorname{Concat}(a_1,\ldots,a_H)\\\operatorname{MHA}(X)&=YW_O\end{aligned}`}
        operations={[
          { expression: String.raw`XW_h^Q,\quad K_h=XW_h^K`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","model dimension을 H개 head의","projection으로 나누어 각자 score와","weighted sum을 계산하고, 결과를 concat한 뒤"] },
          { expression: String.raw`XW_h^V`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","model dimension을 H개 head의","projection으로 나누어 각자 score와","weighted sum을 계산하고, 결과를 concat한 뒤"] },
          { expression: String.raw`\operatorname{Attention}(Q_h,K_h,V_h)`, annotation: ["head output이(가) 식의 결과에 기여하는 방식을","계산합니다.","model dimension을 H개 head의","projection으로 나누어 각자 score와"] },
        ]}
        terms={[
          { symbol: "H", name: "number of query heads", description: "병렬 attention projection의 수입니다." },
          { symbol: "W_h^Q,W_h^K,W_h^V", name: "head-specific projections", description: "head마다 다른 comparison·content subspace를 만듭니다." },
          { symbol: "a_h", name: "head output", description: "h번째 projection에서 계산한 attention read입니다." },
          { symbol: "W_O", name: "output projection", description: "concat된 head features를 model dimension으로 다시 혼합합니다." },
        ]}
        assumptions={["기본 MHA 표기입니다. MQA와 GQA는 query head가 key/value head를 공유하므로 KV projection 수가 다릅니다."]}
        interpretation="multi-head는 해석 가능한 역할 분담을 보장하지 않습니다. 서로 다른 projection과 attention map을 학습할 capacity를 제공하는 구조입니다."
      />
      <CodeViewButton
        onClick={() =>
          onCodeRef("multi-head-split", codeRefs["multi-head-split"])
        }
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          각 head가 항상 “문법 담당”, “공참조 담당”처럼 하나의 사람이 읽을 수
          있는 기능으로 분리되는 것은 아니다. 다만 서로 다른 projection을
          사용하므로 하나의 attention map만 쓸 때보다 여러 관계를 병렬로 표현할
          여지가 생긴다.
        </p>
        <p>
          Training compute만 보면 score matrix 계산은 대략
          <code>O(n²d)</code>이고 attention probability의 materialization은
          <code>O(n²)</code> memory를 요구할 수 있다. Autoregressive decode에서는
          새 query가 과거 key/value만 읽으므로 한 step score는 sequence length에
          선형이지만, 과거 KV cache가 layer·KV head·head dimension과 함께 누적된다.
          따라서 “self-attention은 병렬화된다”와 “long-context serving이 싸다”는
          같은 말이 아니다.
        </p>

        <h3>병렬화와 긴 문맥 비용을 함께 봐야 한다</h3>
        <p>
          Recurrent model과 달리 한 layer 안의 모든 위치를 동시에 계산할 수
          있지만, dense self-attention의 score matrix는 sequence length
          <code>n</code>에 대해 <code>n × n</code>으로 커진다. Causal language
          model에서는 미래 위치를 mask하고, 긴 문맥 모델은 sliding window,
          sparse attention, linear attention 같은 변형으로 이 비용을 줄인다.
        </p>
        <p>
          이 글은 attention 연산 자체를 맡는다. Residual connection,
          normalization, feed-forward network와 함께 완전한 block을 만드는
          과정은 <Link to="/ai/transformer-architecture">Transformer 구조 글</Link>
          에서 이어진다.
        </p>
      </div>

      <div id="paper-attention-all-you-need" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · Scaled dot-product와 multi-head self-attention</p>
        <p className="mt-2 text-sm font-semibold">Attention Is All You Need</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Scaled dot-product attention을 multi-head로 병렬화하고 recurrence 없이 encoder–decoder sequence transduction 경로를 구성했습니다. 근거는 WMT 번역과 parsing을 포함한 논문의 설정에 한정되며, 모든 현대 LLM 구조나 긴 문맥 비용 해결책을 원 논문 하나가 제안했다는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://arxiv.org/abs/1706.03762" target="_blank" rel="noreferrer">원 논문과 architecture 보기</a>
      </div>
    </section>
  );
}
