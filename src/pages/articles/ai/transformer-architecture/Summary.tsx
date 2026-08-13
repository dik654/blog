import { Link } from "react-router-dom";

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

export default function Summary() {
  return (
    <section id="next-reading" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Transformer를 한 문장으로 묶고 다음 글로 넘어가기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          Transformer block은 위치 정보가 포함된 token representation을 받아,
          attention으로 token 축을 섞고 FFN으로 feature 축을 섞은 뒤 residual과
          normalization을 거쳐 다음 block에 넘긴다. Encoder-only, decoder-only와
          encoder–decoder의 차이는 이 block을 어떤 mask와 information source로
          연결하느냐에 있다.
        </p>
      </div>

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
          이후의 Transformer 계열은 이 기본 block을 버리기보다 attention 범위,
          position encoding, normalization, FFN과 sparsity를 바꾸며 확장해 왔다.
          따라서 새 model을 볼 때도 “무엇을 섞는가, 어떤 경로를 보존하는가,
          계산량을 어디에 배분하는가” 세 질문으로 분해하면 구조를 비교하기 쉽다.
        </p>
      </div>
    </section>
  );
}
