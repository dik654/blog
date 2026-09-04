import ExplainedFormula from "@/components/ui/explained-formula";
import ContentBoundary from "@/components/articles/content-boundary";
import InformationObjectiveMapViz from "./viz/InformationObjectiveMapViz";
import { Link } from "react-router-dom";

export default function Overview({ title }: { title?: string }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        {title ?? "Cross-entropy는 ‘정답에 준 확률’을 학습 신호로 바꾼다"}
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          분류 모델이 정답에 0.9를 주었을 때와 0.01을 주었을 때를 같은 오차로
          다루면, 확신에 찬 오답을 충분히 강하게 교정하기 어렵다. Cross-entropy는
          이 차이를 <strong>정보량(surprisal)</strong>으로 바꾼 뒤 여러 sample에
          걸쳐 평균낸다. 따라서 이 글의 출발점은 loss 공식이 아니라 “확률이 낮은
          사건은 왜 더 많은 정보를 주는가”라는 질문이다.
        </p>
        <p>
          Logarithm이 낯설다면 <Link to="/ai/math-exponents-logarithms">지수·로그 정본</Link>에서
          반복 곱셈, inverse function, 곱을 합으로 바꾸는 항등식을 먼저 확인할 수 있습니다.
          이 글에서는 그 계산을 probability에 적용하는 지점부터 이어 갑니다.
        </p>
        <p>
          Claude Shannon의 정보이론은 독립 사건이 함께 일어날 확률의 곱을 정보량의 합으로 바꾸는 함수를 요구했고 log가 그 조건을 만족한다. 밑이 2이면 단위가 bit이고
          자연로그를 쓰면 nat이지만 밑이 고정되어 있다면 학습 optimum은 달라지지 않고 loss의 scale만 달라진다.
        </p>
      </div>

      <ContentBoundary article="cross-entropy" />

      <ExplainedFormula
        question="모델이 실제로 일어난 사건 x를 얼마나 뜻밖이라고 평가했는가?"
        idea={<>모델 분포 Q가 사건 x에 준 확률을 음의 log로 바꿉니다. 확률의 곱이 log 안에서 합으로 바뀌므로 독립 관측의 정보량도 더해서 계산할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}I_Q(x)&=-\log Q(x)\\[3pt]I_Q(x_1,x_2)&=I_Q(x_1)+I_Q(x_2)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}I_Q(x)&=\underbrace{-\log Q(x)}_{\text{로그 비용 변환}}\\[3pt]I_Q(x_1,x_2)&=\underbrace{I_Q(x_1)+I_Q(x_2)}_{\text{관측된 사건 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`-\log Q(x)`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","모델 분포 Q가 사건 x에 준 확률을 음의 log로 바꿉니다."] },
          { expression: String.raw`I_Q(x_1)+I_Q(x_2)`, annotation: ["관측된 사건이(가) 식의 결과에 기여하는 방식을 계산합니다.","모델 분포 Q가 사건 x에 준 확률을 음의 log로 바꿉니다."] },
        ]}
        terms={[
          { symbol: "x", name: "관측된 사건", description: "실제로 일어난 class 또는 token입니다." },
          { symbol: "Q(x)", name: "모델 확률", description: "모델이 사건 x가 일어날 것이라고 예측한 확률입니다." },
          { symbol: "I_Q(x)", name: "surprisal", description: "Q의 관점에서 사건 x가 전달한 정보량입니다." },
          { symbol: "\\log", name: "logarithm", description: "밑 2는 bit, 자연로그는 nat 단위를 만듭니다." },
        ]}
        assumptions={["두 번째 등식은 Q(x₁,x₂)=Q(x₁)Q(x₂)인 독립 사건을 가정합니다.", "Q(x)=0이면 surprisal은 무한대로 발산합니다."]}
        interpretation="Q(x)가 1이면 이미 확실히 예상했으므로 정보량은 0이고, Q(x)가 0에 가까워질수록 확신에 찬 오답의 비용이 빠르게 커집니다."
      />

      <InformationObjectiveMapViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>이 글에서 따라갈 경로</h3>
        <p>
          한 사건의 surprisal만으로는 model 전체를 평가할 수 없으므로 먼저 실제 분포에 대한 기대값을 정의한다. 그다음 log 안에 실제 분포를 넣으면 entropy, 모델
          분포를 넣으면 cross-entropy가 되고 두 값의 차이가 KL divergence가 된다. 마지막에는 categorical likelihood와 softmax를 연결해 실제
          구현에서 사용하는 gradient까지 내려간다.
        </p>
        <p>
          이 연결은 Shannon의 원 논문에서 출발한다. 역사적 정의와 coding theorem의
          맥락은 IEEE가 공개한 <a href="https://reach.ieee.org/primary-sources/a-mathematical-theory-of-communication/" target="_blank" rel="noreferrer">A Mathematical Theory of Communication 원문</a>에서
          확인할 수 있다.
        </p>
      </div>
    </section>
  );
}
