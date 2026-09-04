import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

const next = [
  {
    title: "Encoder-only를 이어서 보고 싶다면",
    body: "MLM으로 양방향 representation을 학습한 BERT로 간다.",
    href: "/ai/bert",
    label: "BERT 읽기",
  },
  {
    title: "Attention 계산을 더 깊게 보고 싶다면",
    body: "Additive, scaled dot-product와 multi-head의 수식으로 간다.",
    href: "/ai/attention-theory",
    label: "Attention 이론 읽기",
  },
  {
    title: "긴 context의 위치 확장을 보고 싶다면",
    body: "RoPE scaling과 YaRN이 해결하는 경계로 간다.",
    href: "/ai/yarn-rope-extension",
    label: "RoPE 확장 읽기",
  },
];

export default function Summary({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="next-reading" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Transformer를 한 문장으로 묶고 다음 글로 넘어가기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Transformer block은 위치 정보가 포함된 token representation을 받아 attention으로 token 축을 섞고 FFN으로 feature 축을 섞은 뒤
          residual과 normalization을 거쳐 다음 block에 넘긴다. 이 block을 어떤 mask와 information source로 연결하느냐가 encoder-
          only와 decoder-only, encoder–decoder를 가른다.
        </p>
      </div>

      <AlgorithmBlock
        title="Decoder-only forward pass — 앞 section의 조각을 순서대로 조립하기"
        input={[
          "token_ids (batch, seq_len)",
          "causal mask M (DataPrep·QKVComputation에서 정의한 것과 동일)",
          "학습된 parameter: embedding table, 각 layer의 W_Q/W_K/W_V/W_O·W_1/W_2·Norm scale, 최종 output projection W_vocab",
        ]}
        steps={[
          {
            code: "x = embed(token_ids) + PE",
            note: "InputEmbedding의 token embedding과 sinusoidal PE(또는 학습된 position embedding)를 더해 첫 residual stream을 만듭니다.",
          },
          {
            code: "for layer in range(num_layers):\n    x = x + MultiHeadAttention(Norm(x), M)",
            note: "QKVComputation의 A=softmax(QKᵀ/√d_k+M), Y=AV를 head마다 계산해 concat한 뒤, FeedForward의 pre-norm 식 y_pre=x+F(Norm(x))를 attention에 적용합니다(post-norm이면 x=Norm(x+MultiHeadAttention(x,M))).",
          },
          {
            code: "    x = x + FFN(Norm(x))",
            note: "FeedForward의 FFN(x_t)=W_2·φ(W_1x_t+b_1)+b_2를 같은 pre-norm 규칙으로 residual stream에 더합니다.",
          },
          {
            code: "x = Norm(x)",
            note: "Pre-norm 구조는 마지막 layer를 나온 뒤 최종 normalization을 한 번 더 둡니다(post-norm이면 이 단계는 생략).",
          },
          {
            code: "logits = x @ W_vocab + b",
            note: "LinearSoftmax의 z_t=h_tW_vocab+b — 마지막 위치의 hidden state를 vocabulary logits로 투영합니다.",
          },
        ]}
        output="logits (inference·decoding에서 다음 token 확률로 사용) 또는 loss=-Σm_t log softmax(logits)_{y_t*} (학습 시, LinearSoftmax 참고)"
        repeatUntil="num_layers만큼 attention→FFN 두 sublayer를 반복합니다."
      />
      <CodeViewButton
        onClick={() => onCodeRef("block-forward", codeRefs["block-forward"])}
      />

      <div className="not-prose my-8 grid gap-3 lg:grid-cols-3">
        {next.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="group rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-sm"
          >
            <p className="font-semibold leading-6">{item.title}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {item.body}
            </p>
            <p className="mt-4 text-sm font-semibold text-primary">
              {item.label} →
            </p>
          </Link>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이후의 Transformer 계열은 이 기본 block을 버리지 않고 확장해 왔다. attention 범위와 position encoding을 바꾸고 normalization과
          FFN, sparsity를 손보는 식이다. 새 model을 볼 때도 “무엇을 섞는가, 어떤 경로를 보존하는가, 계산량을 어디에 배분하는가” 세 질문으로 분해하면 구조를 비교하기
          쉽다.
        </p>
      </div>
    </section>
  );
}
