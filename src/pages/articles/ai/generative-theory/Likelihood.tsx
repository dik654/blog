import ExplainedFormula from "@/components/ui/explained-formula";
import AutoregressiveTradeoffViz from "./viz/AutoregressiveTradeoffViz";

export default function Likelihood() {
  return (
    <section id="likelihood" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Maximum likelihood는 data가 놓인 곳에 probability mass를 배치한다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Maximum likelihood estimation(MLE)은 training sample의 평균 log
          probability를 높인다. Empirical data distribution에 대한 기대값으로 쓰면
          forward KL, KL(pdata‖pθ)를 최소화하는 것과 parameter에 무관한 상수만큼
          차이 난다. Data가 있는 mode에서 pθ가 0에 가까우면 큰 penalty를 받기
          때문에 coverage를 압박하지만, finite data와 model misspecification에서는
          unseen mode나 사람이 느끼는 perceptual quality를 자동으로 보장하지 않는다.
        </p>
      </div>

      <ExplainedFormula
        question="Training log-likelihood를 최대화하는 것이 왜 data distribution과 model 사이의 forward KL을 줄이는가?"
        idea={<>Cross-entropy를 entropy와 KL로 분해하면 pdata의 entropy는 θ와 무관한 상수입니다. 따라서 model이 바꿀 수 있는 부분은 data sample에 부여한 negative log probability뿐입니다.</>}
        formula={String.raw`\begin{aligned}\mathcal L_{NLL}(\theta)&=-\mathbb E_{x\sim p_{data}}\log p_\theta(x)\\&=H(p_{data})+D_{KL}(p_{data}\|p_\theta)\end{aligned}`}
        terms={[
          { symbol: "p_{data}", name: "data distribution", description: "관측 sample을 생성했다고 가정하는 미지의 실제 분포입니다." },
          { symbol: String.raw`p_\theta`, name: "model density", description: "Normalized probability를 계산할 수 있는 parameterized distribution입니다." },
          { symbol: "H(p_{data})", name: "data entropy", description: "θ로 바꿀 수 없는 상수 항입니다." },
          { symbol: String.raw`D_{KL}(p_{data}\|p_\theta)`, name: "forward KL", description: "Data가 놓인 곳에서 model density가 부족하면 크게 벌점을 줍니다." },
        ]}
        assumptions={["같은 support와 measure 위에서 normalized density를 비교합니다.", "Finite dataset에서는 기대값을 empirical average로 근사합니다."]}
        interpretation="NLL 감소는 model이 observed data에 더 높은 density를 줬다는 뜻입니다. Sample perceptual quality, utility와 calibrated uncertainty가 모두 좋아졌다는 결론은 별도 평가가 필요합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-8">
          두 training observation에 model이 각각 0.8과 0.25의 probability를 줬다면
          dataset likelihood는 0.8×0.25=0.2입니다. Log-likelihood는 log
          0.8+log 0.25=log 0.2≈−1.609이고 평균 NLL은 1.609/2≈0.805입니다.
          Product 대신 log의 합을 쓰면 작은 probability를 곱할 때 생기는 수치
          underflow도 줄고, sample별 기여도 더하기로 읽을 수 있습니다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Autoregressive model은 chain rule로 exact likelihood를 만든다</h3>
        <p>
          Joint distribution을 순서가 있는 conditional probability의 곱으로
          분해하면 각 항은 normalized categorical 또는 continuous distribution으로
          학습할 수 있다. 이 factorization은 approximation이 아니라 chain rule이지만,
          chosen ordering이 architecture의 conditional dependency와 sampling
          latency를 결정한다.
        </p>
      </div>

      <ExplainedFormula
        question="High-dimensional joint distribution을 직접 계산 가능한 conditional loss로 어떻게 분해할까?"
        idea={<>Chain rule은 각 variable의 probability를 앞에서 이미 본 prefix에 조건부인 항으로 바꿉니다. Log를 취하면 product가 sum이 되어 token·pixel 위치별 NLL을 합산할 수 있습니다.</>}
        formula={String.raw`\begin{aligned}p_\theta(x_{1:T})&=\prod_{t=1}^{T}p_\theta(x_t\mid x_{<t})\\\log p_\theta(x_{1:T})&=\sum_{t=1}^{T}\log p_\theta(x_t\mid x_{<t})\end{aligned}`}
        terms={[
          { symbol: "x_{1:T}", name: "ordered observation", description: "Text token, audio sample 또는 정한 순서의 image component입니다." },
          { symbol: "x_{<t}", name: "prefix", description: "현재 위치보다 앞서 condition으로 주어지는 값입니다." },
          { symbol: String.raw`p_\theta(x_t\mid x_{<t})`, name: "local conditional", description: "각 step에서 normalized distribution을 출력합니다." },
        ]}
        assumptions={["Variable ordering과 conditional support가 정의되어 있습니다.", "Training은 true prefix를 주는 teacher forcing을 사용할 수 있지만 sampling은 model output prefix를 사용합니다."]}
        interpretation="Exact likelihood와 빠른 sampling은 같은 성질이 아닙니다. Loss 계산은 target prefix가 모두 있어 병렬화할 수 있어도 ancestral sampling은 앞선 output을 기다려야 합니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-8">
          예를 들어 p(x₁=1)=0.6이고 p(x₂=0|x₁=1)=0.25라면 sequence (1,0)의
          joint probability는 0.6×0.25=0.15입니다. Training에서는 정답 prefix
          x₁=1을 이미 알고 두 conditional target을 한 번에 만들 수 있지만,
          sampling에서는 먼저 x₁을 뽑아야 둘째 conditional이 정해집니다.
        </p>
      </div>

      <AutoregressiveTradeoffViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>EM은 model family가 아니라 latent likelihood를 최적화하는 절차다</h3>
        <p>
          Expectation–Maximization은 latent variable이 있는 likelihood에서 E-step으로
          posterior expectation을 계산하고 M-step으로 expected complete-data
          likelihood를 높인다. Exact step에서는 likelihood를 낮추지 않지만 global
          optimum이나 좋은 sample을 보장하지 않는다. Neural latent model에서
          posterior가 tractable하지 않으면 variational inference와 amortized
          encoder로 넘어간다.
        </p>
      </div>
    </section>
  );
}
