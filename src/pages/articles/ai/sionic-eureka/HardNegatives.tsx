import {
  EUREKA_NEGATIVE_COUNT,
  EUREKA_SOURCE_LINKS,
} from "@/content/sionic-eureka";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function HardNegatives() {
  return (
    <section id="hard-negatives" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Hard negative: 가깝되 positive 경계를 넘지 않게
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          무관한 문서는 이미 쉽게 밀어낼 수 있어 gradient가 작고, 지나치게
          가까운 후보는 실제 relevant 문서일 수 있다. EUREKA는 NV-Retriever의
          TopK-MarginPos 계열처럼 각 query의 positive score를 anchor로 삼아
          false negative 후보를 거른다.
        </p>
        <div id="paper-nv-retriever" className="scroll-mt-24">
          <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
            <strong className="text-foreground">논문의 핵심 아이디어:</strong>{" "}
            fixed threshold 하나를 모든 query에 적용하지 않고, 각 query의
            positive score를 기준으로 후보 난이도를 상대적으로 제한한다.
          </p>
        </div>
        <div className="not-prose my-6 grid gap-3 md:grid-cols-3">
          {[
            ["1. retrieve", "현재 embedding으로 query별 top-K 후보를 얻는다"],
            ["2. filter", "positive score−margin보다 가까운 후보를 제외한다"],
            [
              "3. select",
              `남은 상위 후보에서 query당 ${EUREKA_NEGATIVE_COUNT}개를 저장한다`,
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border bg-card p-4">
              <strong className="text-sm">{title}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {body}
              </p>
            </div>
          ))}
        </div>
        <ExplainedFormula
          question="가까운 후보 중 실제 positive일 가능성이 큰 문서를 어떻게 제외하는가?"
          idea={
            <p>
              후보 점수를 고정 숫자와 비교하지 않고, 같은 query의 positive
              점수에서 margin을 뺀 상대 경계보다 낮을 때만 negative로 받습니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            d&\in\mathcal N(q) \\
            &\Longleftrightarrow s(q,d)<s(q,p)-m
          \end{aligned}`}
          terms={[
            { symbol: "q", name: "query", description: "현재 hard negative를 고르는 검색 질의입니다." },
            { symbol: "p", name: "known positive", description: "Query와 관련 있다고 라벨된 기준 문서입니다." },
            { symbol: "d", name: "candidate document", description: "현재 miner가 검색한 negative 후보 문서입니다." },
            { symbol: "s(q,\\cdot)", name: "similarity score", description: "같은 mining encoder와 index에서 계산한 query-document 유사도입니다." },
            { symbol: "m", name: "positive margin", description: "False negative를 피하려고 positive 점수 아래에 두는 여유 폭입니다." },
          ]}
          assumptions={[
            "Positive set이 누락되지 않았고 mining encoder의 점수가 같은 scale입니다.",
            "여러 positive가 있으면 어떤 positive score를 anchor로 쓸지 명시합니다.",
            "Margin·top-K·corpus·miner version을 함께 저장합니다.",
          ]}
          interpretation="후보가 positive와 지나치게 비슷하면 어렵더라도 negative로 확정하지 않습니다. Margin이 너무 크면 유용한 hard negative가 사라지고 너무 작으면 false negative가 섞입니다."
        />
        <p className="leading-7">
          이 부등식은 candidate가 positive보다 margin 이상 낮을 때만 negative로
          채택한다는 뜻이다. 고정 similarity threshold보다 query 난이도에
          적응하지만, margin과 mining encoder가 바뀌면 후보 분포도 바뀐다.
          따라서 model version, corpus snapshot, K, margin, positive set을
          mining artifact와 함께 버전 관리한다.
        </p>
        <a
          href={EUREKA_SOURCE_LINKS.nvRetriever.href}
          target="_blank"
          rel="noreferrer"
        >
          {EUREKA_SOURCE_LINKS.nvRetriever.label}
        </a>
      </div>
    </section>
  );
}
