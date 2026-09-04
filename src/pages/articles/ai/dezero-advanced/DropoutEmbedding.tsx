import type { CodeRef } from "@/components/code/types";
import ExplainedFormula from "@/components/ui/explained-formula";
import { codeRefs } from "./codeRefs";
import DropEmbedViz from "./viz/DropEmbedViz";

export default function DropoutEmbedding({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="dropout-embedding" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dropout과 Embedding은 forward의 선택 정보를 backward에 재사용합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Inverted dropout은 학습 중 확률 <code>p</code>로 원소를 0으로 만들고, 남은 값에 <code>1/(1-p)</code>를 곱해 출력의 기댓값을 유지합니다. backward에서도 같은 mask를 사용해야 하므로 forward에서 생성한 mask를 저장합니다. 평가 모드에서는 무작위성을 제거하고 입력을 그대로 반환합니다.
        </p>
        <p>
          Embedding은 정수 ID에 해당하는 weight 행을 선택하는 lookup입니다. one-hot vector와 전체 행렬을 곱하는 대신 필요한 행만 읽으므로 계산량이
          줄어듭니다. backward는 forward에서 사용한 ID를 기억했다가 해당 행에 gradient를 scatter-add하며 같은 ID가 여러 번 나오면 기여를 합산합니다.
        </p>
      </div>
      <div className="not-prose my-8"><DropEmbedViz onOpenCode={open} /></div>
      <ExplainedFormula
        question="Inverted dropout은 일부 값을 0으로 만들면서 왜 평균 출력은 유지할까요?"
        idea={<>Keep probability만큼만 값이 남으므로 남은 값은 그 확률로 나눠 키웁니다. Drop되면 0, keep되면 x/(1-p)가 되고 두 경우의 확률 가중 평균은 원래 x입니다.</>}
        formula={String.raw`\begin{aligned}
y&=\frac{m}{1-p}x,\quad m\sim\operatorname{Bernoulli}(1-p),\\
x=2,\ p=.25&\Rightarrow y\in\{0,\ 2/.75\},\\
\mathbb{E}[y]&=.25\cdot0+.75\cdot(2/.75)=2.
\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
y&=\underbrace{\frac{m}{1-p}x,\quad m\sim\operatorname{Bernoulli}(1-p),}_{\text{기준량당 비율}}\\
x=2,\ p=.25&\Rightarrow y\in\{0,\ 2/.75\},\\
\mathbb{E}[y]&=\underbrace{.25\cdot0+.75\cdot(2/.75)=2.}_{\text{확률 가중 평균}}
\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{m}{1-p}x,\quad m\sim\operatorname{Bernoulli}(1-p),`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Keep probability만큼만 값이 남으므로 남은 값은","그 확률로 나눠 키웁니다."] },
          { expression: String.raw`.25\cdot0+.75\cdot(2/.75)=2.`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Keep probability만큼만 값이 남으므로 남은 값은","그 확률로 나눠 키웁니다."] },
        ]}
        terms={[
          { symbol: "p", name: "drop probability", description: "Train mode에서 activation을 0으로 만드는 확률입니다." },
          { symbol: "m", name: "keep mask", description: "Forward에서 sampling하고 backward에 그대로 재사용하는 0·1 mask입니다." },
          { symbol: "1/(1−p)", name: "inverted scale", description: "Keep된 activation을 키워 conditional expectation을 보존합니다." },
        ]}
        assumptions={[
          "Mask sampling이 입력값과 독립이고 0≤p<1입니다.",
          "식은 train mode이며 eval mode에서는 mask와 scaling 없이 y=x입니다.",
          "Expectation 유지가 개별 실행의 동일 출력이나 variance 감소를 뜻하지 않습니다.",
        ]}
        interpretation="입력 2는 25% 확률로 0, 75% 확률로 약 2.667이 되어 평균은 2입니다. 같은 mask를 backward에 쓰지 않으면 forward에서 선택한 경로와 다른 gradient가 흐릅니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>실행 모드와 랜덤 상태도 재현 대상입니다</h3>
        <p>
          Dropout의 train/eval 전환을 전역 boolean 하나로만 관리하면 중첩 평가나 병렬 실행에서 상태가 새기 쉽습니다. 가능하면 모델 또는 execution
          context에 모드를 명시하고 RNG seed와 state도 checkpoint에 포함합니다. Embedding은 음수·범위 밖 ID를 명확히 거부하고 padding index의
          gradient 처리 정책도 별도로 정해 둡니다.
        </p>
      </div>
    </section>
  );
}
