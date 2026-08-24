import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";

const links = [
  {
    title: "퍼셉트론의 score와 margin",
    detail: "w·x를 weight 방향의 signed 성분으로 읽고, unit norm 조건에서 경계까지의 거리로 연결합니다.",
    href: "/ai/perceptron#convergence",
  },
  {
    title: "신경망의 dense layer",
    detail: "Output unit 하나는 input vector와 weight column의 dot product에 bias를 더해 만듭니다.",
    href: "/ai/neural-network#forward",
  },
  {
    title: "Attention score",
    detail: "Query와 key의 dot product를 쓰되 dimension에 따른 scale 증가를 √d로 보정합니다.",
    href: "/ai/attention-theory#self-attention",
  },
] as const;

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 계산이 모델 안에서 맡는 역할</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Vector·norm·dot product는 모델 하나에 속한 기술이 아닙니다. 같은 계산이라도
          normalization과 objective가 달라지면 해석이 달라집니다. 아래 글에서는 정의를
          다시 복제하지 않고, 이 계산이 각 모델의 실행 경로에서 어떤 값을 만드는지
          이어서 설명합니다.
        </p>
      </div>
      <div className="not-prose mt-6 grid gap-4 md:grid-cols-3">
        {links.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="min-w-0 border-t border-border/80 pt-4 transition-colors hover:border-primary/60"
          >
            <h3 className="text-sm font-bold text-foreground">{item.title}</h3>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.detail}</p>
            <span className="mt-3 block text-xs font-bold text-primary">계산이 쓰이는 곳으로 이동 →</span>
          </Link>
        ))}
      </div>
      <div className="prose prose-neutral dark:prose-invert mt-10 max-w-none">
        <h3>왜 Cauchy–Schwarz가 퍼셉트론의 실수 횟수를 제한할까?</h3>
        <p>
          선형 분리가 가능한 학습 집합에서 정답 separator를 길이 1인 <code>w*</code>로
          두고, 모든 example이 <code>y(w*·x) ≥ γ</code>인 양의 margin <code>γ</code>를
          가진다고 가정하겠습니다. 또한 input 길이는 모두 <code>||x|| ≤ R</code>로
          제한합니다. 퍼셉트론이 실수할 때마다 <code>w ← w+yx</code>로 update하면,
          실수 횟수 <code>M</code> 뒤의 weight <code>w_M</code>은 다음 두 방향에서
          동시에 제한됩니다.
        </p>
      </div>
      <ExplainedFormula
        question="퍼셉트론이 같은 data에서 무한히 실수할 수 없는 이유는 무엇일까요?"
        idea={<>각 실수 update는 정답 separator 방향으로 적어도 γ만큼 전진하지만, 전체 weight 길이는 input 길이 R 때문에 √M보다 빠르게 커질 수 없습니다. Cauchy–Schwarz가 두 양을 같은 상한에 묶으면 M의 최대값이 나옵니다.</>}
        formula={String.raw`\begin{aligned}
          w_M\cdot w^* &\ge M\gamma\\
          w_M\cdot w^* &\le \lVert w_M\rVert_2\lVert w^*\rVert_2=\lVert w_M\rVert_2\\
          \lVert w_M\rVert_2 &\le R\sqrt{M}\\
          M\gamma &\le R\sqrt{M}\quad\Longrightarrow\quad M\le\left(\frac{R}{\gamma}\right)^2
        \end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}
          w_M\cdot w^* &\ge \underbrace{M\gamma}_{\text{margin 계산}}\\
          w_M\cdot w^* &\le \underbrace{\lVert w_M\rVert_2}_{\text{허용 경계 판정}}\lVert w^*\rVert_2=\lVert w_M\rVert_2\\
          \lVert w_M\rVert_2 &\le \underbrace{R\sqrt{M}}_{\text{weight after M mistakes 계산}}\\
          M\gamma &\le R\sqrt{M}\quad\Longrightarrow\quad M\le\left(\frac{R}{\gamma}\right)^2
        \end{aligned}`}
        operations={[
          { expression: String.raw`M\gamma`, annotation: ["margin이(가) 식의 결과에 기여하는 방식을 계산합니다.","각 실수 update는 정답 separator 방향으로 적어도","γ만큼 전진하지만, 전체 weight 길이는 input 길이","R 때문에 √M보다"] },
          { expression: String.raw`\lVert w_M\rVert_2`, annotation: ["weight after M mistakes이(가) 식의 결과에","기여하는 방식을 계산합니다.","각 실수 update는 정답 separator 방향으로 적어도","γ만큼 전진하지만, 전체 weight 길이는 input 길이"] },
          { expression: String.raw`R\sqrt{M}`, annotation: ["weight after M mistakes이(가) 식의 결과에","기여하는 방식을 계산합니다.","각 실수 update는 정답 separator 방향으로 적어도","γ만큼 전진하지만, 전체 weight 길이는 input 길이"] },
        ]}
        terms={[
          { symbol: String.raw`M`, name: "mistake count", description: "Update가 일어난 분류 실수의 누적 횟수입니다." },
          { symbol: String.raw`\gamma`, name: "margin", description: "정답 separator 방향으로 각 example이 확보한 최소 signed 여유입니다." },
          { symbol: String.raw`R`, name: "input norm bound", description: "모든 input vector 길이의 공통 상한입니다." },
          { symbol: String.raw`w_M`, name: "weight after M mistakes", description: "M번의 mistake-driven update를 합한 현재 parameter vector입니다." },
        ]}
        assumptions={[
          "학습 example은 고정된 linear separator w*로 분리되고 ||w*||₂=1이며 y(w*·x)≥γ>0입니다.",
          "모든 input은 ||x||₂≤R이고, bias가 있다면 상수 coordinate를 붙인 augmented vector에 같은 norm bound를 적용합니다.",
          "표준 mistake-driven perceptron update와 재방문 가능한 고정 data sequence를 가정합니다.",
        ]}
        interpretation="예를 들어 R=5, γ=1이면 이 보장은 mistake가 최대 25번이라고 말합니다. 실제 횟수는 더 작을 수 있습니다. 핵심은 dot product가 정답 방향의 누적 전진을 재고, norm이 전체 weight 성장량을 제한하며, Cauchy–Schwarz가 방향 성분이 전체 길이를 넘지 못하게 연결한다는 점입니다."
        title="방향 전진과 전체 길이를 한 부등식으로 묶기"
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>보장이 깨지는 조건</h3>
        <p>
          이 결과는 모든 dataset에서의 convergence theorem이 아닙니다. XOR처럼 하나의
          linear separator가 없거나 <code>γ=0</code>이면 유한한 bound를 만들 수 없습니다.
          Input norm에 상한이 없으면 한 update가 weight 길이를 임의로 크게 키울 수 있고,
          label noise가 있으면 서로 모순되는 update를 반복할 수 있습니다. 따라서 실제
          문제에서는 먼저 separability·positive margin·bounded input이라는 전제를
          확인해야 하며, 자세한 퍼셉트론 실행 경로는 연결 글에서 이어갑니다.
        </p>
      </div>
      <div className="prose prose-neutral dark:prose-invert mt-8 max-w-none">
        <p>
          학부 선형대수의 더 넓은 흐름은 MIT OpenCourseWare의
          <a href="https://ocw.mit.edu/courses/18-06sc-linear-algebra-fall-2011/" target="_blank" rel="noreferrer">18.06 Linear Algebra</a>에서
          확인할 수 있습니다. 특히 projection은 least squares로 이어지지만, 이 글에서는
          AI 수식에 반복해서 필요한 vector 하나와 두 vector의 관계까지만 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
