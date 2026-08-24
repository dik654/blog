import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import DetectionContractViz from "./viz/DetectionContractViz";
import MarginalRankViz from "./viz/MarginalRankViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">먼저 “이상치”가 무엇인지 운영 언어로 고정한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          ECOD(Empirical Cumulative Distribution-based Outlier Detection)는 label이 없는
          tabular data에서 각 feature의 분포 끝에 놓인 row를 찾아 연속 anomaly score로
          순위화한다. 특정 parametric distribution을 맞추거나 반복 optimization을 하지
          않기 때문에 빠른 global-outlier baseline으로 유용하지만, score가 높다는 사실만으로
          fraud·고장·공격이라고 확정되지는 않는다.
        </p>
        <p>
          따라서 첫 단계는 algorithm 선택이 아니라 detection contract다. 한 row가 거래인지
          사용자 세션인지, 어떤 기간과 집단을 reference population으로 볼지, 어떤 feature가
          score 계산 시점에 실제로 존재하는지 정해야 한다. 결측값·중복 열·category encoding과
          시간 split은 <Link to="/ai/eda-workflow">EDA 정본 글</Link>에서 먼저 확인하고,
          ECOD는 그 표에서 “누구를 먼저 검토할지” 정하는 역할만 맡긴다.
        </p>
      </div>

      <DetectionContractViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>ECDF는 분포 모양을 가정하지 않고 관측 순위를 센다</h3>
        <p>
          Feature마다 값의 단위와 scale은 다르다. ECDF는 현재 값보다 작거나 같은 training
          sample의 비율을 세어 이를 0과 1 사이의 좌표로 바꾼다. Gaussian의 평균·표준편차나
          histogram bin을 고르지 않는다는 뜻에서 non-parametric이며, 큰 값일수록 오른쪽에,
          작은 값일수록 왼쪽에 있다는 순위 정보는 그대로 남는다.
        </p>
      </div>

      <ExplainedFormula
        question="Feature j의 값 x가 reference data에서 어느 순위에 놓였는가?"
        idea={<>Indicator가 조건을 만족한 sample만 1로 세고 전체 개수로 나눕니다. 오른쪽 ECDF는 <code>1−F(x)</code>가 아니라 <code>X≥x</code>를 직접 세어 tie에서 양쪽 정의를 대칭으로 유지합니다.</>}
        formula={String.raw`\begin{aligned}\widehat F_{j,L}(x)&=\frac{1}{n}\sum_{r=1}^{n}\mathbf 1[X_{rj}\le x]\\\widehat F_{j,R}(x)&=\frac{1}{n}\sum_{r=1}^{n}\mathbf 1[X_{rj}\ge x]\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\widehat F_{j,L}(x)&=\underbrace{\frac{1}{n}\sum_{r=1}^{n}\mathbf 1[X_{rj}\le x]}_{\text{기준량당 비율}}\\\widehat F_{j,R}(x)&=\underbrace{\frac{1}{n}\sum_{r=1}^{n}\mathbf 1[X_{rj}\ge x]}_{\text{기준량당 비율}}\end{aligned}`}
        operations={[
          { expression: String.raw`\frac{1}{n}\sum_{r=1}^{n}\mathbf 1[X_{rj}\le x]`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Indicator가 조건을 만족한 sample만 1로 세고","전체 개수로 나눕니다."] },
          { expression: String.raw`\frac{1}{n}\sum_{r=1}^{n}\mathbf 1[X_{rj}\ge x]`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","Indicator가 조건을 만족한 sample만 1로 세고","전체 개수로 나눕니다."] },
        ]}
        terms={[
          { symbol: "X_{rj}", name: "reference value", description: "Reference row r의 feature j 값입니다." },
          { symbol: "n", name: "reference sample count", description: "ECDF를 구성하는 비교 집단의 row 수입니다." },
          { symbol: "\\mathbf 1[\\cdot]", name: "indicator", description: "괄호 안 조건이 참이면 1, 아니면 0을 반환합니다." },
          { symbol: "\\widehat F_{j,L},\\widehat F_{j,R}", name: "empirical tails", description: "Feature j에서 관측된 왼쪽·오른쪽 누적 비율입니다." },
        ]}
        assumptions={[
          "원 논문은 row가 같은 distribution에서 i.i.d.로 sampling되었다고 놓습니다.",
          "ECDF는 feature별 marginal만 추정하며 feature 사이 joint dependence는 이 단계에서 모델링하지 않습니다.",
        ]}
        interpretation="Training row 자체를 평가하면 tail probability의 최솟값은 대략 1/n이므로 −log 계산에서 0이 되지 않습니다. 다만 reference population이 바뀌면 같은 raw value의 순위도 함께 바뀝니다."
      />

      <MarginalRankViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Parameter-free라는 말은 score 함수에 한정된다</h3>
        <p>
          ECOD 논문이 parameter-free라고 부르는 까닭은 neighbor 수, histogram bin,
          tree 수처럼 score 모양을 조절할 핵심 hyperparameter가 없기 때문이다. 하지만
          binary alert를 만들려면 threshold가 필요하고, reference 기간·feature 선택·재학습
          주기 또한 운영자가 정해야 한다. 즉 “설정 없이 이상치를 알아서 확정한다”는 뜻은 아니다.
        </p>
        <p>
          시계열 값도 row로 넣을 수는 있지만 ECOD가 시간 순서를 읽는 것은 아니다. Lag,
          rolling statistic, 계절 위치 등을 feature로 만들어야 시간 문맥이 생기며, 미래 정보가
          계산에 섞이지 않도록 cutoff를 지켜야 한다. Streaming detector가 필요하다면 window와
          ECDF 갱신 정책도 별도의 system contract가 된다.
        </p>
      </div>
    </section>
  );
}
