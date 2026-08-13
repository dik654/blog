import ExplainedFormula from "@/components/ui/explained-formula";
import SearchSpaceViz from "./viz/SearchSpaceViz";

export default function SearchSpace() {
  return (
    <section id="search-space" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Search space는 값의 목록이 아니라, 무엇을 얼마나 자주 시험할지 정하는 확률 모델입니다</h2>
      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Learning rate처럼 0.0001과 0.001의 차이가 0.1000과 0.1009보다 중요한 값은 linear uniform이 아니라 log-uniform이
          자연스럽습니다. Depth는 integer, optimizer는 categorical이며 momentum은 SGD를 골랐을 때만 존재합니다. 이렇게 type,
          scale, conditional dependency를 쓰지 않으면 실행할 수 없는 조합이 생기고 넓은 수치 구간의 한쪽에 trial이 몰립니다.
        </p>
        <p>
          범위는 “클수록 탐색을 많이 한다”가 아닙니다. 같은 trial 수라면 공간을 넓힐수록 유망한 영역을 만날 확률이 낮아집니다.
          먼저 literature·baseline·작은 pilot으로 단위와 안정 범위를 확인하고, 경계값이 반복해서 선택되는 이유를 본 뒤 새 version에서
          확장합니다. 결과를 본 뒤 같은 study의 범위를 조용히 바꾸면 sampler history와 선택 과정의 의미가 달라집니다.
        </p>
      </div>

      <ExplainedFormula
        question="a와 b 사이에서 자릿수마다 같은 비중으로 positive 값을 뽑으려면 어떻게 해야 할까요?"
        idea={<>원래 값이 아니라 log 공간에서 uniform하게 위치 u를 뽑은 뒤 exp로 되돌립니다. 그러면 곱셈 비율이 같은 구간들이 같은 확률을 가집니다.</>}
        formula={String.raw`u\sim\operatorname{Uniform}(0,1),\qquad \lambda=\exp\!\left(\log a+u(\log b-\log a)\right),\quad 0<a<b`}
        terms={[
          { symbol: "a, b", name: "positive bounds", description: "0보다 큰 lower·upper bound이며 단위와 허용 이유를 함께 기록합니다." },
          { symbol: "u", name: "uniform position", description: "Log interval 안에서 뽑은 0과 1 사이의 위치입니다." },
          { symbol: "lambda", name: "sampled value", description: "Learning rate·weight decay처럼 여러 orders of magnitude를 탐색할 값입니다." },
        ]}
        assumptions={[
          "0이나 음수를 포함하는 값에는 그대로 적용할 수 없습니다.",
          "Log-uniform이 좋은 성능을 보장하는 prior는 아니며 multiplicative scale이 자연스러울 때 사용합니다.",
          "Framework에서 log=True를 쓸 때 endpoint와 discretization semantics는 해당 version 문서를 확인합니다.",
        ]}
        interpretation="a=10^-5, b=10^-1이면 10^-5–10^-4와 10^-2–10^-1이 각각 같은 log 길이를 가져 같은 비중으로 탐색됩니다."
      />

      <ExplainedFormula
        question="조건부 parameter와 메모리 한도를 포함한 ‘실행 가능한 공간’을 어떻게 구분할까요?"
        idea={<>전체 조합을 만든 다음 실패시키지 않고, branch 조건과 resource estimator를 만족하는 설정만 feasible set에 포함합니다.</>}
        formula={String.raw`\Lambda_{\mathrm{feasible}}=\left\{\lambda\in\Lambda:\;c_{\mathrm{branch}}(\lambda)=1,\;\widehat m(\lambda)\le M_{\max}\right\}`}
        terms={[
          { symbol: "c_branch", name: "branch validity", description: "선택한 optimizer·model family에서 해당 child parameter가 실제 의미를 가지면 1입니다." },
          { symbol: "m-hat", name: "resource estimate", description: "Batch·resolution·sequence length 조합의 예상 peak memory 같은 사전 추정값입니다." },
          { symbol: "M_max", name: "hard capacity", description: "해당 worker에서 안전 여유를 뺀 사용 가능 memory 상한입니다." },
        ]}
        assumptions={[
          "Resource estimator 오차를 고려해 headroom을 두고 실제 peak도 trial artifact에 기록합니다.",
          "OOM도 관측 정보이므로 예상 밖 실패를 FAIL state와 configuration에 남깁니다.",
          "조건을 너무 강하게 걸면 아직 모르는 좋은 영역을 사전에 제거할 수 있습니다.",
        ]}
        interpretation="Adam trial에 SGD momentum을 붙이지 않고, batch 256·resolution 1024처럼 명백히 OOM인 조합은 sampling 전에 제외합니다."
      />

      <div className="not-prose my-8"><SearchSpaceViz /></div>

      <div className="prose max-w-none prose-neutral dark:prose-invert">
        <p>
          Effective batch는 micro batch×gradient accumulation×data-parallel workers로 기록합니다. Batch만 바꾸면 update 수, learning-rate
          schedule, normalization 통계까지 달라질 수 있으므로 어떤 양을 고정했는지 밝혀야 합니다. Search-space version은 parameter
          이름·type·distribution·bounds·conditions·resource constraints의 digest로 남기면 재개한 study가 같은 실험인지 판별할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
