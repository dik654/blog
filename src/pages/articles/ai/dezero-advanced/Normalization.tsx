import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import NormViz from "./viz/NormViz";

export default function Normalization({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="normalization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">LayerNorm은 각 샘플의 feature 축을 정규화합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          LayerNorm은 마지막 feature 축에서 평균과 분산을 구한 뒤 <code>(x-mean)/sqrt(var+eps)</code>로 값을 정규화합니다. 배치 전체의 통계를 사용하는 BatchNorm과 달리 샘플마다 독립적으로 계산하므로, 배치 크기나 시퀀스 길이가 달라도 같은 규칙을 적용할 수 있습니다.
        </p>
        <p>
          정규화 뒤에는 학습 가능한 <code>gamma</code>와 <code>beta</code>로 scale과 shift를 적용합니다. gamma를 1, beta를 0으로 초기화하면 처음에는 정규화된 값을 그대로 내보내고, 학습이 진행되면서 레이어가 필요한 표현 범위를 되찾을 수 있습니다.
        </p>
      </div>
      <div className="not-prose my-8"><NormViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="한 sample의 feature [1,3]을 LayerNorm하면 어떤 값이 될까요?"
        idea={<>Feature 축 평균을 빼고 같은 축의 population variance로 나눕니다. Epsilon은 분산이 0에 가까울 때 분모가 0이 되는 것을 막고, gamma와 beta가 이후 scale과 shift를 학습합니다.</>}
        formula={String.raw`\begin{aligned}
\mu&=(1+3)/2=2,\\
\sigma^2&=((1-2)^2+(3-2)^2)/2=1,\\
\hat{x}&=(x-\mu)/\sqrt{\sigma^2+\varepsilon}
\approx[-1,1].
\end{aligned}`}
        terms={[
          { symbol: "μ", name: "feature mean", description: "이 sample의 정규화 대상 feature 평균입니다." },
          { symbol: "σ²", name: "population variance", description: "대상 feature 수로 나눈 squared deviation 평균입니다." },
          { symbol: "ε", name: "stability epsilon", description: "분모가 0 또는 지나치게 작아지는 것을 막는 양수입니다." },
        ]}
        assumptions={[
          "설명에서는 ε가 1보다 매우 작고 gamma=1, beta=0이라 근사값을 [-1,1]로 씁니다.",
          "정규화 축은 마지막 feature 축이며 batch·time 축과 섞지 않습니다.",
          "Population variance를 사용하므로 sample variance의 n−1 분모와 구분합니다.",
        ]}
        interpretation="정규화된 두 값의 평균은 0에 가깝고 variance는 1에 가깝습니다. 상수 입력에서는 epsilon 덕분에 finite한 0을 내야 합니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>정규화 축과 수치 안정성을 테스트합니다</h3>
        <p>
          forward에서 계산한 normalized value와 inverse standard deviation은 backward에서 다시 사용하므로 안전하게 캐시합니다. 상수 입력처럼 분산이 0에 가까운 경우에도 NaN이 생기지 않는지, gamma와 beta의 gradient가 정규화 축 이외의 차원을 올바르게 합산하는지 수치 gradient로 확인해야 합니다.
        </p>
      </div>
    </section>
  );
}
