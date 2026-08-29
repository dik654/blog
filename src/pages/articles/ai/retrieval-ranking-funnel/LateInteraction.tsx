import ExplainedFormula from "@/components/ui/explained-formula";

export default function LateInteraction() {
  return (
    <section id="late-interaction" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        ColBERT는 token 벡터를 남겨 두 encoder 방식 사이를 절충합니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Late interaction은 bi-encoder처럼 문서 벡터를 미리 계산해 두면서도
          cross-encoder처럼 query와 문서를 token 단위로 비교하는 절충안입니다.
          ColBERT가 이 방식을 대표하는 이름입니다.
        </p>
        <p>
          Bi-encoder는 query와 문서를 각각 하나의 벡터로 pooling한 뒤 벡터
          하나끼리 내적을 구합니다. 문서 벡터는 미리 계산해 둘 수 있어
          빠르지만, 여러 token의 의미를 한 벡터로 뭉치는 과정에서 세부 신호가
          흐려질 수 있습니다.
        </p>
        <p>
          Cross-encoder는 query와 문서를 한 transformer에 함께 넣어 처음부터
          다시 encoding합니다. Token 사이의 상호작용을 그대로 보므로
          정확하지만, 문서 encoding이 query에 따라 달라져 미리 계산해 둘 수
          없고 후보 하나마다 전체 forward pass가 새로 필요합니다.
        </p>
        <p>
          Late interaction은 문서 token 벡터를 bi-encoder처럼 미리 계산해
          캐시해 두되 하나로 뭉치지 않고 그대로 둡니다. Query가 들어오면
          query token마다 문서 token 전체와의 유사도를 비교해 가장 높은
          값만 더합니다. 이 최댓값 합을 MaxSim이라고 부릅니다.
        </p>
      </div>
      <ExplainedFormula
        question="Query와 문서를 각각 여러 벡터로 나타낼 때 relevance는 어떻게 한 점수로 모을까요?"
        idea={<>Query token마다 문서 token들 중 가장 비슷한 것을 찾고, 그 최댓값들을 모두 더합니다. 문서 쪽은 bi-encoder처럼 미리 계산해 둘 수 있고, 비교 자체는 cross-encoder보다 가볍습니다.</>}
        formula={String.raw`\operatorname{MaxSim}(q,d)=\sum_{i=1}^{|q|}\max_{j=1}^{|d|}\langle E_q^i, E_d^j\rangle`}
        annotatedFormula={String.raw`\operatorname{MaxSim}(q,d)=\sum_{i=1}^{|q|}\underbrace{\max_{j=1}^{|d|}\langle E_q^i, E_d^j\rangle}_{\text{query token }i\text{와 가장 가까운 문서 token}}`}
        operations={[
          { expression: String.raw`\max_{j=1}^{|d|}\langle E_q^i, E_d^j\rangle`, annotation: ["Query token i 하나를 문서 token |d|개 전체와 비교해", "가장 큰 유사도만 남깁니다."] },
          { expression: String.raw`\sum_{i=1}^{|q|}`, annotation: ["이 최댓값을 query token마다 구해", "|q|개를 모두 더합니다."] },
        ]}
        terms={[
          { symbol: "E_q^i", name: "query token embedding", description: "Query의 i번째 token이 가지는 벡터입니다." },
          { symbol: "E_d^j", name: "document token embedding", description: "문서의 j번째 token이 가지는 벡터로, query와 무관하게 미리 계산해 둘 수 있습니다." },
          { symbol: "|q|, |d|", name: "token 수", description: "각각 query와 문서가 가진 token 개수입니다." },
        ]}
        assumptions={["Token embedding은 고정 차원이고 내적(또는 cosine)으로 비교합니다.", "문서 token embedding은 corpus 색인 시점에 한 번 계산해 재사용합니다.", "비교 비용은 O(|q|×|d|)로 bi-encoder의 O(1)보다 크고 cross-encoder 전체 forward보다는 작습니다."]}
        interpretation="예를 들어 query token “세션·조기·만료” 3개와 문서 token “로그인·유지·시간·짧·다” 5개 사이의 유사도가 0.82(세션–유지), 0.75(조기–짧), 0.72(만료–다)에서 각각 최댓값을 이룬다면 MaxSim 합은 0.82+0.75+0.72=2.29입니다. 세 query token이 서로 다른 문서 token과 짝지어졌고, 하나의 pooled 벡터였다면 이 대응 일부가 평균에 묻혀 사라질 수 있습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          세 방법의 비용 순서는 분명합니다. Bi-encoder는 후보당 벡터 내적
          한 번, late interaction은 query token 수 곱하기 문서 token 수만큼의
          내적, cross-encoder는 후보마다 전체 transformer forward pass입니다.
          Late interaction은 그 사이 어딘가에 있으며, 문서 token 벡터를
          저장하는 데 bi-encoder보다 훨씬 큰 index 공간을 씁니다.
        </p>
      </div>
      <div id="reading-colbert" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">핵심 논문 · ColBERT</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Khattab과 Zaharia는 query와 문서 token embedding을 각각 유지한 뒤
          MaxSim으로 late interaction을 계산하는 ColBERT를 제안하고, 문서
          encoding을 query와 무관하게 미리 계산해 둘 수 있어 cross-encoder보다
          검색 시점 비용이 낮다고 보고했습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이는 논문의 MS MARCO passage ranking 실험 범위이며, 모든 corpus·index
          구현에서 저장 공간 증가를 상쇄한다는 보장은 아닙니다.
        </p>
        <a
          className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
          href="https://arxiv.org/abs/2004.12832"
          target="_blank"
          rel="noreferrer"
        >
          ColBERT MaxSim 정의 보기
        </a>
      </div>
    </section>
  );
}
