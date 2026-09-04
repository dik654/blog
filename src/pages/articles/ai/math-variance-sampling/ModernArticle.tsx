import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import SamplingNoiseViz from "./SamplingNoiseViz";

const MIT = "https://ocw.mit.edu/courses/6-041sc-probabilistic-systems-analysis-and-applied-probability-fall-2013/";
const ROBBINS_MONRO = "https://doi.org/10.1214/aoms/1177729586";

export default function VarianceSamplingArticle() {
  return <article className="space-y-16">
    <section id="overview" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">00 · Center만으로 부족한 이유</p><h2 className="mt-2 text-2xl font-bold">같은 expectation을 가진 distribution도 흔들림과 estimate reliability는 다를 수 있다</h2></header>
      <p className="text-lg leading-8">
            Expectation은 중심을 말하지만 값들이 그 주위에 얼마나 퍼졌는지는 말하지 않습니다. Variance가 population spread를 재고 sample mean과
            sample variance가 관측 일부로 그 성질을 추정합니다.
          </p>
      <SamplingNoiseViz />
    </section>

    <section id="variance" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · 중심에서의 square distance</p><h2 className="mt-2 text-2xl font-bold">Variance는 편차를 제곱해 부호 상쇄를 막고 standard deviation은 원래 단위로 돌아온다</h2></header>
      <Term name="Variance" shape="Var(X)=E[(X−μ)²]" meaning="각 값이 expectation에서 떨어진 거리를 제곱해 probability-weighted average한 spread입니다." example="앞면 수 0,1,2의 variance는 1/2입니다." boundary="Variance는 X 단위의 제곱이고 infinite second moment에는 finite 값이 없습니다." />
      <Term name="Standard deviation" shape="σ=√Var(X)" meaning="Variance의 square root로, spread를 X와 같은 단위로 되돌린 값입니다." example="Variance 1/2 앞면²이면 standard deviation은 약 0.707 앞면입니다." boundary="한 sample이 mean에서 항상 σ만큼 떨어진다는 뜻은 아닙니다." />
      <ExplainedFormula question="왜 deviation을 그대로 평균하지 않고 square할까요?" idea={<>Mean을 기준으로 한 positive·negative deviation은 합하면 0이 됩니다. Square는 방향을 없애고 큰 deviation을 더 크게 반영해 spread를 남깁니다.</>} formula={String.raw`\operatorname{Var}(X)=\mathbb E[(X-\mu)^2]`} annotatedFormula={String.raw`\operatorname{Var}(X)=\mathbb E\!\left[\underbrace{(X-\mu)}_{\text{center에서의 deviation}}^{\!2}\right]`} operations={[{ expression: String.raw`X-\mu`, annotation: ["각 값을 distribution center와 비교해", "signed deviation 생성"] }, { expression: String.raw`(X-\mu)^2`, annotation: ["deviation을 square해", "부호 상쇄를 막고 큰 오차를 확대"] }, { expression: String.raw`\mathbb E[\cdot]`, annotation: ["squared deviation을 probability로 평균해", "population spread 하나로 요약"] }]} terms={[{ symbol: String.raw`\mu`, name: "Population mean", description: "E[X]입니다." }]} assumptions={["Second moment E[X^2]가 유한합니다.", "같은 distribution의 expectation μ를 사용합니다."]} interpretation="앞면 수에서는 0과 2가 mean 1에서 각각 distance 1이고, 그 mass를 평균해 variance 1/2를 얻습니다." />
      <ExplainedFormula question="왜 standard deviation은 variance에 square root를 취할까요?" idea={<>Variance는 deviation을 square했기 때문에 단위도 square됩니다. Square root는 scale을 원래 X 단위로 되돌려 magnitude를 비교하기 쉽게 합니다.</>} formula={String.raw`\sigma=\sqrt{\operatorname{Var}(X)}`} annotatedFormula={String.raw`\sigma=\underbrace{\sqrt{\operatorname{Var}(X)}}_{\text{squared unit을 원래 unit으로 복원}}`} operations={[{ expression: String.raw`\sqrt{\operatorname{Var}(X)}`, annotation: ["square-distance 평균에 root를 취해", "원래 measurement scale의 spread로 복원"] }]} terms={[{ symbol: String.raw`\sigma`, name: "Standard deviation", description: "X와 같은 단위의 spread scale입니다." }]} assumptions={["Variance는 0 이상입니다.", "Unit 해석은 X의 measurement unit을 기준으로 합니다."]} interpretation="Variance와 standard deviation은 같은 spread를 다른 scale로 표현하며, 둘을 같은 숫자·단위로 비교하면 안 됩니다." />
    </section>

    <section id="sample-estimation" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · Population을 일부로 추정</p><h2 className="mt-2 text-2xl font-bold">Sample mean은 center를, sample variance는 population spread를 관측값으로 추정한다</h2></header>
      <Term name="Sample mean" shape="X̄=(1/B)ΣXᵢ" meaning="관측한 B개 sample에 같은 비중을 주어 population expectation을 추정합니다." example="1,2,3의 sample mean은 2입니다." boundary="Biased sampling이나 dependence가 있으면 원하는 population center를 추정하지 못할 수 있습니다." />
      <Term name="Sample variance estimator" shape="s²=Σ(Xᵢ−X̄)²/(n−1)" meaning="Sample 자체의 center 주변 square distance로 unknown population variance를 추정합니다." example="1,2,3은 square-deviation sum 2라 s²=1입니다." boundary="주어진 세 값 전체의 descriptive variance 2/3과 i.i.d. population variance estimator 1은 질문이 다릅니다." />
      <ExplainedFormula question="왜 sample variance estimator는 n이 아니라 n−1로 나눌까요?" idea={<>같은 sample로 mean을 먼저 추정하면 deviation 하나의 자유도가 이미 소모됩니다. Square-deviation sum의 expectation이 (n−1)σ²이므로 n−1로 나누어 population variance를 unbiased하게 맞춥니다.</>} formula={String.raw`s^2=\frac{1}{n-1}\sum_{i=1}^n(X_i-\bar X)^2`} annotatedFormula={String.raw`s^2=\frac{\overbrace{\sum_{i=1}^n(X_i-\bar X)^2}^{\text{sample center 주변 square distance 합}}}{\underbrace{n-1}_{\text{mean 추정으로 남은 자유도}}}`} operations={[{ expression: String.raw`X_i-\bar X`, annotation: ["unknown population mean 대신 sample center와 비교해", "관측 가능한 deviation 생성"] }, { expression: String.raw`\sum_i(\cdot)^2`, annotation: ["deviation을 square하고 합해", "sample spread 총량 계산"] }, { expression: String.raw`/(n-1)`, annotation: ["mean 추정에 쓴 자유도 하나를 빼", "반복 표집 expectation의 downward bias 교정"] }]} terms={[{ symbol: String.raw`\bar X`, name: "Sample mean", description: "같은 n개 관측의 평균입니다." }, { symbol: "n", name: "Sample count", description: "n>1이어야 합니다." }]} assumptions={["Samples are i.i.d. with finite variance and n>1입니다.", "Unbiasedness는 반복 표집 expectation의 성질입니다."]} interpretation="n−1은 모든 variance 계산의 보편 분모가 아니라 unknown population variance를 i.i.d. sample로 추정할 때의 교정입니다. 실제 library 기본값도 이 선택이 갈립니다 — numpy.var()는 기본 ddof=0(n으로 나눔, biased)이고 torch.var()는 기본 ddof=1(n−1로 나눔, unbiased)이라, 같은 데이터라도 두 함수를 기본값 그대로 섞어 쓰면 다른 숫자가 나옵니다." />
    </section>

    <section id="law-of-large-numbers" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · 평균 estimate의 noise</p><h2 className="mt-2 text-2xl font-bold">독립 sample을 평균하면 variance는 1/B, standard deviation은 1/√B로 줄어든다</h2></header>
      <Term name="Law of large numbers" shape="X̄_B→μ in probability" meaning="적절한 조건에서 sample 수가 커질수록 sample mean이 population mean에서 크게 벗어날 probability가 작아지는 정리입니다." example="Finite variance이면 Chebyshev bound가 σ²/(Bε²)로 줄어듭니다." boundary="Finite B의 exact equality나 모든 dependent·heavy-tail process의 성공을 보장하지 않습니다." />
      <ExplainedFormula question="왜 independent sample mean의 variance가 σ²/B가 될까요?" idea={<>평균은 B개를 더한 뒤 B로 나눕니다. Independent variance는 합에서 B배가 되고, 1/B scale의 variance는 square되어 1/B²가 되므로 최종 1/B가 남습니다.</>} formula={String.raw`\operatorname{Var}(\bar X_B)=\frac{\sigma^2}{B}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{\frac1{B^2}}_{\text{평균 scale을 square}}&=\text{variance scale}\\
\underbrace{B\sigma^2}_{\text{독립 spread B개 합}}&=\text{합의 variance}\\
\operatorname{Var}(\bar X_B)&=\frac1{B^2}\,B\sigma^2=\frac{\sigma^2}{B}
\end{aligned}`} operations={[{ expression: String.raw`\sum_i X_i`, annotation: ["독립 sample을 더해", "variance contribution도 B개 합산"] }, { expression: String.raw`1/B^2`, annotation: ["평균의 1/B scale을 variance에서 square해", "합 variance를 B^2로 축소"] }, { expression: String.raw`B\sigma^2/B^2`, annotation: ["B contribution과 B^2 normalization을 약분해", "최종 1/B noise law 생성"] }]} terms={[{ symbol: "B", name: "Batch size", description: "Independent sample count입니다." }]} assumptions={["Samples are independent with common finite variance σ²입니다.", "Equal-weight arithmetic mean을 사용합니다."]} interpretation="Batch 1에서 16으로 늘면 variance는 1/16, standard deviation은 1/4이지만 compute와 memory cost도 함께 늘 수 있습니다." />
      <ExplainedFormula question="큰 수의 법칙은 어떤 probability를 0으로 보낼까요?" idea={<>Sample mean의 variance σ²/B를 Chebyshev inequality에 넣으면 mean에서 ε 이상 벗어날 확률의 upper bound가 B와 함께 0으로 갑니다.</>} formula={String.raw`P(|\bar X_B-\mu|\ge\varepsilon)\le\frac{\sigma^2}{B\varepsilon^2}`} annotatedFormula={String.raw`\begin{aligned}
\underbrace{|\bar X_B-\mu|}_{\text{center와의 error}}&\ge\underbrace{\varepsilon}_{\text{허용 폭}}\\
P(\text{error event})&\le\underbrace{\frac{\sigma^2}{B\varepsilon^2}}_{\text{Chebyshev upper bound}}
\end{aligned}`} operations={[{ expression: String.raw`|\bar X_B-\mu|`, annotation: ["estimate와 population center를 빼고 절댓값을 취해", "방향과 무관한 estimation error 측정"] }, { expression: String.raw`\sigma^2/(B\varepsilon^2)`, annotation: ["sample-mean variance를 허용 오차 square로 나눠", "error event probability의 upper bound 생성"] }]} terms={[{ symbol: String.raw`\varepsilon`, name: "Error tolerance", description: "0보다 큰 고정 허용 오차입니다." }]} assumptions={["Independent identically distributed samples with finite variance입니다.", "Chebyshev upper bound는 exact probability가 아닙니다."]} interpretation="B가 커질수록 fixed ε 밖에 있을 확률 bound가 0으로 가지만, 어떤 finite B에서 반드시 안쪽이라는 deterministic guarantee는 아닙니다." />
    </section>

    <section id="gradient-estimator" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">04 · Training의 random vector</p><h2 className="mt-2 text-2xl font-bold">Mini-batch gradient는 full empirical gradient를 추정하는 random vector다</h2></header>
      <Term name="Stochastic gradient estimator" shape="g_B=(1/B)Σ∇ℓᵢ" meaning="무작위로 뽑은 example gradient를 평균해 dataset 전체 gradient 방향을 추정합니다." example="Uniform index sampling이면 expectation에서 full empirical gradient와 같습니다." boundary="Unbiased가 low variance·per-step descent·global convergence를 뜻하지 않습니다." />
      <ExplainedFormula question="왜 uniform mini-batch gradient의 expectation이 full empirical gradient일까요?" idea={<>Expectation linearity로 batch 평균을 sample별 expectation으로 나눕니다. Uniform index 하나의 expected gradient가 dataset gradient의 arithmetic mean이므로 B개 평균도 같은 center를 가집니다.</>} formula={String.raw`\mathbb E[g_B]=\frac1N\sum_{i=1}^N\nabla\ell_i(\theta)`} annotatedFormula={String.raw`\begin{aligned}
g_B&=\underbrace{\frac1B}_{\text{batch weight}}\\
&\quad\sum_{j=1}^B\nabla\ell_{I_j}(\theta)\\
\underbrace{\mathbb E[g_B]}_{\text{sampling center}}&=\underbrace{\frac1N}_{\text{uniform weight}}\\
&\quad\sum_{i=1}^N\nabla\ell_i(\theta)
\end{aligned}`} operations={[{ expression: String.raw`\frac1B\sum_j`, annotation: ["sample gradient를 같은 비중으로 합쳐", "batch-level direction 생성"] }, { expression: String.raw`\mathbb E[\cdot]`, annotation: ["가능한 batch sampling 전체로 평균해", "estimator의 long-run center 계산"] }, { expression: String.raw`\frac1N\sum_i`, annotation: ["uniform index의 각 example contribution을", "dataset 전체 arithmetic mean으로 복원"] }]} terms={[{ symbol: String.raw`I_j`, name: "Sampled index", description: "Batch j번째 자리의 random dataset index입니다." }, { symbol: String.raw`\theta`, name: "Parameter vector", description: "모든 example gradient를 같은 위치에서 평가합니다." }]} assumptions={["Indices are sampled uniformly and weighting matches the empirical objective입니다.", "Interchanging gradient and expectation is justified in the stated finite-dataset setting입니다."]} interpretation="Estimator의 center가 맞아도 한 batch는 다른 방향을 가리킬 수 있으므로 variance·step size·sampling dependence를 따로 봐야 합니다." />
    </section>

    <section id="boundaries" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">05 · 1/B가 사라지는 경우</p><h2 className="mt-2 text-2xl font-bold">Correlation·biased sampling·heavy tail은 서로 다른 방식으로 평균의 보장을 깨뜨린다</h2></header>
      <p className="leading-7">
            같은 random index J를 batch의 모든 자리에 복제하면 g_B=∇ℓ_J라서 unbiased일 수는 있지만 variance가 줄지 않습니다. Sampling
            probability가 objective weight와 다르면 center 자체가 바뀌고 finite moment가 없는 heavy tail에서는 variance 기반
            bound를 쓸 수 없습니다.
          </p>
      <p>이 estimate를 실제 parameter update로 바꾸는 과정은 <a className="font-semibold text-primary underline" href="/ai/math-gradient-descent-convergence">gradient descent와 convergence</a>에서, optimizer state와 batch trade-off는 <a className="font-semibold text-primary underline" href="/ai/optimizers">optimizers</a>에서 이어집니다.</p>
      <div id="paper-variance-sampling"><CitationBlock source="MIT 6.041SC · Variance and laws of large numbers" citeKey={1} href={`${MIT}#variance-and-lln`}><Evidence problem="Population spread와 finite sample average의 reliability를 구분하는 문제" contribution="Variance·sample mean·Chebyshev bound·large-number behavior를 연결" assumptions="Course가 선언한 independence·moment 조건" scope="Discrete variance·sampling average·LLN" notClaim="모든 dependent or heavy-tail data에서 1/B가 성립한다는 주장이 아님" /></CitationBlock></div>
      <div id="paper-robbins-monro"><CitationBlock source="Robbins & Monro · A Stochastic Approximation Method" citeKey={2} href={ROBBINS_MONRO}><Evidence problem="Noise가 섞인 관측으로 expectation-defined target에 접근하는 문제" contribution="Random observation을 사용한 recursive stochastic approximation의 수렴 틀 제시" assumptions="원 논문의 conditional expectation·variance·step-size·monotonicity 조건" scope="1951 one-dimensional stochastic root finding" notClaim="Arbitrary nonconvex mini-batch training의 global optimum 보장이 아님" /></CitationBlock></div>
      <ContentBoundary article="math-variance-sampling" />
    </section>
  </article>;
}

function Term({ name, shape, meaning, example, boundary }: { name: string; shape: string; meaning: string; example: string; boundary: string }) { return <div className="border-l border-primary/70 pl-5"><p className="text-xs font-bold text-primary">용어</p><h3 className="mt-1 text-lg font-bold">{name}</h3><p className="mt-2 font-mono text-sm font-black">{shape}</p><p className="mt-3 leading-7">{meaning}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">작은 예:</strong> {example}</p><p className="mt-2 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">경계:</strong> {boundary}</p></div>; }
function Evidence({ problem, contribution, assumptions, scope, notClaim }: { problem: string; contribution: string; assumptions: string; scope: string; notClaim: string }) { return <div className="space-y-2"><p><strong>문제:</strong> {problem}</p><p><strong>핵심 아이디어:</strong> {contribution}</p><p><strong>중요 가정:</strong> {assumptions}</p><p><strong>근거 범위:</strong> {scope}</p><p><strong>일반화 금지:</strong> {notClaim}</p></div>; }
