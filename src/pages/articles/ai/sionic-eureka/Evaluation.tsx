import ExplainedFormula from "@/components/ui/explained-formula";

const slices = [
  ["언어·도메인", "한국어/영어, 법률/의료/금융/과학/코드 등"],
  ["query style", "factoid, 분석형, 리뷰형, code retrieval"],
  ["문서 길이", "짧은 passage부터 long document bucket"],
  ["answer position", "앞·중간·뒤 및 근거가 여러 곳인 문서"],
  ["mapping", "1:1, 1:N, N:1과 positive 수 bucket"],
] as const;

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        평균 NDCG@10 뒤에 robustness slice를 남긴다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NDCG@10은 상위 10개 결과의 relevance와 순서를 반영해 1에 가까울수록
          좋다. 하지만 전체 평균 하나만 보면 특정 언어·짧은 문서가 개선을
          독점해도 모른다. EUREKA의 평가 artifact는 종합 점수와 다음 slice를
          함께 저장한다.
        </p>
        <ExplainedFormula
          question="관련 문서를 상위에 배치했는지 query마다 어떻게 정규화해 비교하는가?"
          idea={
            <p>
              Rank가 뒤로 갈수록 relevance gain을 할인한 DCG를 계산합니다. 같은 judged 문서를 이상적으로 정렬한 IDCG로 나눠 query별 난이도와
              positive 수 차이를 일부 정규화합니다.
            </p>
          }
          formula={String.raw`\mathrm{NDCG}@k=\frac{\sum_{i=1}^{k}\frac{2^{r_i}-1}{\log_2(i+1)}}{\mathrm{IDCG}@k}`}
          annotatedFormula={String.raw`\mathrm{NDCG}@k=\underbrace{\frac{\sum_{i=1}^{k}\frac{2^{r_i}-1}{\log_2(i+1)}}{\mathrm{IDCG}@k}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{\sum_{i=1}^{k}\frac{2^{r_i}-1}{\log_2(i+1)}}{\mathrm{IDCG}@k}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Rank가 뒤로 갈수록 relevance gain을 할인한","DCG를 계산하고, 같은 judged 문서를 이상적으로 정렬한","IDCG로 나눠 query별 난이도와 positive 수"] },
          ]}
          terms={[
            { symbol: "r_i", name: "rank i의 relevance", description: "평가 label이 부여한 i번째 결과의 graded relevance입니다." },
            { symbol: "k", name: "cutoff", description: "평가에 포함하는 상위 결과 수이며 이 글에서는 10입니다." },
            { symbol: "\\log_2(i+1)", name: "rank discount", description: "같은 relevance라도 뒤쪽 결과의 기여를 줄입니다." },
            { symbol: "\\mathrm{IDCG}@k", name: "ideal DCG", description: "같은 judged 결과를 relevance 내림차순으로 둔 최대 가능한 DCG입니다." },
          ]}
          assumptions={[
            "Query별 relevance judgment와 cutoff가 비교 모델 사이에서 같습니다.",
            "Judgment가 없는 문서를 non-relevant로 취급하는지 별도로 명시합니다.",
            "전체 평균과 언어·길이·position slice를 함께 보고합니다.",
          ]}
          interpretation="NDCG@10이 높으면 judged relevant 문서를 상위에 잘 놓았다는 뜻입니다. 관련 문서가 누락된 incomplete judgment나 특정 slice의 실패까지 평균 하나가 보여주지는 않습니다."
        />
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {slices.map(([name, detail]) => (
            <div key={name} className="rounded-xl border bg-card p-4">
              <strong className="text-sm">{name}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {detail}
              </p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          공개 benchmark는 비교 가능성을, 사내 OOD set은 실제 배포 분포의 변화를
          본다. 둘은 같은 표에 넣더라도 source와 version을 분리한다. 최종
          benchmark 수치가 공개되기 전에는 “리더보드 성능”을 대신 만들어 넣지
          않는다.
        </p>
        <p className="rounded-xl border-l-4 border-emerald-400 bg-emerald-500/5 p-4 text-sm leading-6">
          <strong>확장 규칙:</strong> 새 언어·도메인은 corpus source → query
          recipe → label graph → mining snapshot → teacher scores → evaluation
          slice를 한 묶음으로 추가한다. 그래서 데이터만 늘고 검증 축이 빠지는
          일을 막는다.
        </p>
      </div>
    </section>
  );
}
