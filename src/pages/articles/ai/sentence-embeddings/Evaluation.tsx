import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import EvalBenchViz from './viz/EvalBenchViz';

export default function Evaluation() {
  return (
    <section id="evaluation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">임베딩 품질 평가법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          문장 임베딩 모델의 품질은 단일 지표로 판단할 수 없음 — 검색, 분류, 유사도, 클러스터링 등 다양한 태스크에서의 성능을 종합 평가<br />
          MTEB(Massive Text Embedding Benchmark)가 2023년부터 사실상 표준 벤치마크로 자리잡음
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">1. MTEB: 종합 벤치마크</h3>
        <p>
          Muennighoff et al. (2023)이 제안한 <strong>8개 카테고리, 56개 데이터셋</strong> 벤치마크<br />
          분류(Classification), 클러스터링(Clustering), 쌍 분류(Pair Classification), 재순위(Reranking),
          검색(Retrieval), STS, 요약(Summarization), 다국어 분류<br />
          MTEB 리더보드: Hugging Face에서 실시간 순위 공개 — 모델 선택의 핵심 참고 자료
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">2. STS (Semantic Textual Similarity)</h3>
        <p>
          가장 직관적인 평가 — 두 문장의 의미 유사도를 0~5 스케일로 측정<br />
          cosine similarity와 인간 평가 간의 <strong>Spearman 순위 상관계수(ρ)</strong> 또는 Pearson 상관계수(r)를 계산<br />
          STSb(STS Benchmark): 8,628개 문장 쌍 — 뉴스, 포럼, 이미지 캡션 도메인에서 수집
        </p>
        <M display>{'\\underbrace{\\rho}_{\\text{Spearman 상관 } \\in [-1, 1]} = 1 - \\frac{\\overbrace{6 \\sum d_i^2}^{\\text{순위 차이 제곱합}}}{\\underbrace{n(n^2 - 1)}_{\\text{샘플 수 정규화}}}'}</M>
        <FormulaNote
          meaning="사람 점수와 모델 점수를 각각 순위로 바꾼 뒤, 같은 문장 쌍의 두 순위가 얼마나 어긋나는지 측정한다. ρ=1이면 순서가 완전히 같고 -1이면 완전히 반대다. 이 간단한 식은 동점 순위가 없을 때의 형태이며, 실제 라이브러리는 tie correction을 처리한다."
          symbols={[
            ['d_i', 'i번째 문장 쌍의 인간 순위와 모델 순위의 차이'],
            ['n', '평가한 문장 쌍의 수'],
            ['\\rho', '절대 점수가 아니라 순서 일치를 나타내는 Spearman 상관계수'],
          ]}
        />
        <p className="text-sm text-muted-foreground mt-1">
          Spearman ρ: 순위 기반 상관 — 예측값의 절대 크기보다 순서의 일치를 측정. d_i = 순위 차이
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">3. 검색 정확도</h3>
        <p>
          쿼리가 주어졌을 때 관련 문서를 얼마나 정확히 찾는지 측정<br />
          <strong>Recall@k</strong>: 상위 k개 결과에 정답이 포함된 비율 — k=10이면 상위 10개 중 정답 포함 여부<br />
          <strong>MRR(Mean Reciprocal Rank)</strong>: 정답의 평균 역순위 — 1위에 있으면 1.0, 2위면 0.5, 3위면 0.33
        </p>
        <M display>{'\\text{MRR} = \\underbrace{\\frac{1}{|Q|}}_{\\text{쿼리 개수 평균}} \\cdot \\sum_{i=1}^{|Q|} \\underbrace{\\frac{1}{\\text{rank}_i}}_{\\text{역순위 (1위=1, 2위=0.5)}}'}</M>
        <FormulaNote
          meaning="각 쿼리에서 첫 번째 정답 문서가 나타난 순위의 역수를 구해 전체 쿼리에서 평균낸다. 첫 정답을 위로 올리는 능력에는 민감하지만, 그 뒤에 있는 추가 정답들의 순위는 반영하지 않는다."
          symbols={[
            ['Q', '평가 쿼리 집합'],
            ['\\mathrm{rank}_i', 'i번째 쿼리에서 첫 관련 문서가 등장한 1부터 시작하는 순위'],
            ['1/\\mathrm{rank}_i', '첫 정답이 아래로 내려갈수록 작아지는 쿼리별 점수'],
          ]}
        />
        <p>
          <strong>NDCG(Normalized Discounted Cumulative Gain)</strong>: 순위 품질의 표준 지표<br />
          상위에 관련성 높은 문서가 배치될수록 높은 점수 — 이진 관련성뿐 아니라 등급별 관련성도 반영<br />
          대표 벤치마크: MS-MARCO(검색), Natural Questions(QA), BEIR(다양한 도메인)
        </p>
        <M display>{'\\text{DCG@k} = \\sum_{i=1}^{k} \\frac{\\overbrace{2^{\\text{rel}_i} - 1}^{\\text{관련성 이득}}}{\\underbrace{\\log_2(i+1)}_{\\text{순위 할인}}}, \\quad \\underbrace{\\text{NDCG@k} = \\frac{\\text{DCG@k}}{\\text{IDCG@k}}}_{\\text{이상적 DCG 로 정규화}}'}</M>
        <FormulaNote
          meaning="DCG는 관련성이 높은 문서를 보상하되 아래 순위에 놓일수록 로그로 할인한다. NDCG는 같은 정답 집합을 완벽하게 정렬했을 때의 IDCG로 나눠 쿼리마다 다른 정답 수와 등급을 비교 가능하게 만든다. 관련 문서가 하나도 없어 IDCG=0인 경우의 처리는 평가 구현에서 명시해야 한다."
          symbols={[
            ['\\mathrm{rel}_i', 'i위 문서에 부여된 등급형 관련성 점수'],
            ['\\log_2(i+1)', '낮은 순위의 이득을 줄이는 position discount'],
            ['\\mathrm{IDCG@k}', '관련성 순으로 완벽히 정렬했을 때 가능한 최대 DCG'],
            ['\\mathrm{NDCG@k}', '이상적 순위 대비 현재 순위의 0~1 정규화 점수'],
          ]}
        />

        <h3 className="text-lg font-semibold mt-6 mb-3">4. 클러스터링 품질</h3>
        <p>
          임베딩 벡터로 k-means 또는 Agglomerative Clustering 수행 후 실제 라벨과 비교<br />
          <strong>V-measure</strong>: 동질성(한 클러스터 안에 같은 클래스)과 완전성(같은 클래스가 한 클러스터에)의 조화평균<br />
          <strong>ARI(Adjusted Rand Index)</strong>: 우연의 일치를 보정한 클러스터 일치도 — 0이면 랜덤 수준, 1이면 완벽<br />
          20 Newsgroups, Reddit 클러스터링 데이터셋이 대표적
        </p>

        <h3 className="text-lg font-semibold mt-6 mb-3">5. Probing Tasks</h3>
        <p>
          임베딩이 어떤 정보를 담고 있는지 분석하는 기법<br />
          방법: 임베딩 벡터 위에 <strong>간단한 선형 분류기(Wx + b)</strong>만 올려서 특정 속성 예측<br />
          선형 분류기가 높은 정확도를 보이면 → 해당 정보가 벡터 공간에 <strong>선형적으로 인코딩</strong>되어 있다는 증거
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose my-6">
          <div className="rounded-lg border bg-blue-50 dark:bg-blue-950/30 p-3">
            <p className="font-semibold text-blue-700 dark:text-blue-300 mb-1">구문 정보 (Syntactic)</p>
            <p className="text-sm text-muted-foreground">
              트리 깊이(parse tree depth), 최상위 구성 성분(top constituent), 문장 길이(word count)
            </p>
          </div>
          <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 p-3">
            <p className="font-semibold text-emerald-700 dark:text-emerald-300 mb-1">의미 정보 (Semantic)</p>
            <p className="text-sm text-muted-foreground">
              시제(tense), 주어 수(subject number), 목적어 수(object number), 감성(sentiment)
            </p>
          </div>
        </div>
      </div>

      <div className="not-prose my-8"><EvalBenchViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-lg font-semibold mt-6 mb-3">실전 모델 선택 가이드</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">태스크</th>
                <th className="border border-border px-4 py-2 text-left">주요 지표</th>
                <th className="border border-border px-4 py-2 text-left">추천 모델</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['시맨틱 검색', 'NDCG@10, Recall@100', 'E5-large-v2, BGE-large'],
                ['문장 유사도', 'STS Spearman ρ', 'SBERT, GTE-large'],
                ['텍스트 클러스터링', 'V-measure, ARI', 'GTE-base, E5-base'],
                ['다국어 검색', 'mMTEB 평균', 'BGE-m3, E5-multilingual'],
                ['RAG 파이프라인', 'Recall@k + 생성 품질', 'E5-mistral, BGE-large'],
              ].map(([task, metric, model]) => (
                <tr key={task}>
                  <td className="border border-border px-4 py-2 font-medium">{task}</td>
                  <td className="border border-border px-4 py-2">{metric}</td>
                  <td className="border border-border px-4 py-2">{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 leading-7">
          요약 1: MTEB가 <strong>임베딩 품질의 종합 성적표</strong> — 56개 데이터셋에서 8개 카테고리 평가.<br />
          요약 2: 검색에는 NDCG@k, 유사도에는 STS ρ, 클러스터링에는 V-measure가 핵심 지표.<br />
          요약 3: Probing tasks로 <strong>임베딩 내부의 언어 정보 인코딩</strong>을 분석 — 모델 해석가능성의 열쇠.
        </p>
      </div>
    </section>
  );
}
