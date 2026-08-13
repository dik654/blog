import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        프루닝은 0을 많이 만드는 기법이 아니라, 모델의 어떤 계산을 실제로 없앨지 정하는 기법입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          신경망의 linear layer는 입력과 weight matrix를 곱해 출력을 만듭니다. 프루닝(pruning)은 이 weight의 일부를 쓰지 않거나 channel·head·layer 같은 계산 단위를 제거하는 압축 방법입니다. 다만 checkpoint에 0이 많다는 사실만으로 파일·메모리·latency가 자동으로 줄지는 않습니다. Dense tensor에 0을 적어 둔 채 같은 GEMM을 실행하면 연산 shape는 그대로이기 때문입니다.
        </p>
        <p>
          그래서 먼저 배포 목표를 정해야 합니다. 파일과 weight traffic이 목표라면 sparse encoding이 필요하고, 일반 dense kernel의 latency가 목표라면 channel처럼 tensor shape 자체를 줄이는 편이 직접적입니다. 특정 accelerator의 sparse MMA를 쓰려면 2:4 같은 정확한 pattern·축·dtype·shape 조건까지 맞춰야 합니다. 프루닝 알고리즘의 score는 이 실행 계약을 만족하는 mask를 고르는 수단입니다.
        </p>
        <p>
          이 글은 weight와 binary mask의 가장 작은 계산에서 출발합니다. 이어서 개별 weight를 고르는 magnitude·movement score, channel과 N:M 구조, SparseGPT·Wanda의 LLM one-shot 방법, 마지막으로 mask를 유지하는 recovery와 실제 runtime 승인 기준까지 내려갑니다.
        </p>
      </div>
      <ContentBoundary article="pruning" />
      <ExplainedFormula
        question="Weight를 제거했다는 말과 sparsity 60%라는 수치는 정확히 무엇을 뜻할까요?"
        idea={<>원래 weight <code>W</code>와 같은 shape의 binary mask <code>M</code>을 만들고, 0인 자리만 계산에서 제거합니다. Sparsity는 전체 자리 중 mask가 0인 비율입니다.</>}
        formula={String.raw`W' = M\odot W,\qquad M_i\in\{0,1\},\qquad s=1-\frac{\lVert M\rVert_0}{N}`}
        terms={[
          { symbol: "W", name: "dense weights", description: "Pruning 전의 원래 weight tensor입니다." },
          { symbol: "M", name: "binary mask", description: "1이면 weight를 남기고 0이면 제거하는, W와 같은 shape의 표시입니다." },
          { symbol: "W'", name: "masked weights", description: "Mask를 적용한 뒤 모델이 사용하는 weight입니다." },
          { symbol: "||M||_0", name: "kept count", description: "Mask에서 1인 원소, 즉 남은 weight의 개수입니다." },
          { symbol: "N", name: "total count", description: "Pruning 대상 weight의 전체 개수입니다." },
          { symbol: "s", name: "sparsity", description: "제거된 weight 비율이며 0은 제거 없음, 1은 전부 제거를 뜻합니다." },
        ]}
        assumptions={[
          "대상 tensor와 sparsity 분모 N을 고정합니다. Embedding·LM head를 제외하면 전체 모델 sparsity와 layer sparsity가 달라집니다.",
          "0 값과 제거된 연결을 구분합니다. Dense tensor의 우연한 0은 sparse artifact·kernel이 활용하지 않을 수 있습니다.",
          "Mask sparsity는 parameter count 지표이며 파일 크기·FLOPs·latency 감소율과 동일하지 않습니다.",
        ]}
        interpretation="Weight 10개 중 mask의 1이 4개라면 6개를 제거했으므로 sparsity는 1−4/10=.6, 즉 60%입니다. 하지만 그 mask를 dense tensor로 저장하고 dense kernel로 실행하면 shape와 계산량은 그대로입니다."
      />
      <div className="not-prose my-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Unstructured, semi-structured, structured는 단순히 강도가 다른 단계가 아닙니다. 무엇을 한 단위로 제거하고 어떤 artifact와 operator가 그 결과를 소비하는지 다른 계약입니다. 따라서 같은 50% sparsity라도 일반 dense GEMM, arbitrary sparse kernel, 2:4 sparse MMA에서 의미와 성능이 달라집니다.
        </p>
      </div>
    </section>
  );
}
