import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";

const bands = [
  {
    label: "고주파",
    width: "92%",
    detail: "짧은 거리에서 각도 차이가 빠르게 변한다.",
    tone: "bg-fuchsia-500/70",
  },
  {
    label: "중간 주파수",
    width: "62%",
    detail: "근거리와 장거리 신호를 이어 준다.",
    tone: "bg-violet-500/70",
  },
  {
    label: "저주파",
    width: "34%",
    detail: "긴 파장을 가지므로 학습 구간에서 일부만 관찰될 수 있다.",
    tone: "bg-sky-500/70",
  },
];

export default function RopeFoundation() {
  return (
    <section id="rope-foundation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        RoPE는 query와 key를 위치에 따라 회전시킨다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Rotary Position Embedding(RoPE)은 attention head의 차원을 2차원
          쌍으로 나누고, 위치 <M>{"m"}</M>에 있는 query와 key를 각 쌍의
          frequency에 따라 회전시킨다. 위치 자체를 token embedding에 더하지
          않고 attention score를 계산하는 두 벡터에 적용하는 것이 핵심이다.
        </p>
      </div>

      <ExplainedFormula
        question="한 token의 위치를 query와 key에 어떻게 넣되 vector의 크기는 보존할까?"
        idea={<>head dimension을 2차원 쌍으로 나눈 뒤 위치 m과 frequency θ가 정하는 각도만큼 회전합니다. 회전은 길이를 바꾸지 않고 방향만 바꾸므로 content vector의 norm을 그대로 유지합니다.</>}
        formula={String.raw`\begin{aligned}R(m\theta)&=\begin{pmatrix}\cos(m\theta)&-\sin(m\theta)\\\sin(m\theta)&\cos(m\theta)\end{pmatrix}\\[3pt]q_m&=R(m\theta)q\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}R(m\theta)&=\begin{pmatrix}\cos(m\theta)&-\sin(m\theta)\\\sin(m\theta)&\cos(m\theta)\end{pmatrix}\\[3pt]q_m&=\underbrace{R(m\theta)q}_{\text{2D rotation 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`R(m\theta)q`, annotation: ["2D rotation이(가) 식의 결과에 기여하는 방식을","계산합니다.","head dimension을 2차원 쌍으로 나눈 뒤 위치 m과","frequency θ가 정하는 각도만큼 회전합니다."] },
        ]}
        terms={[
          { symbol: "m", name: "token position", description: "sequence 안에서 현재 query 또는 key가 놓인 index입니다." },
          { symbol: "\\theta", name: "inverse frequency", description: "차원 쌍마다 다른 회전 속도이며, 값이 클수록 짧은 거리에서도 각도가 빨리 변합니다." },
          { symbol: "R(m\\theta)", name: "2D rotation", description: "cosine·sine으로 구성되어 vector norm을 보존합니다." },
        ]}
        assumptions={["query와 key의 head dimension을 두 좌표씩 묶는 RoPE 기본형입니다.", "실제 구현은 전체 matrix를 만들지 않고 rotate-half와 element-wise 연산을 사용합니다."]}
        interpretation="위치 정보가 embedding에 더해지는 것이 아니라 attention score 직전의 query와 key 방향에 들어갑니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          위치 <M>{"m"}</M>의 query와 위치 <M>{"n"}</M>의 key를 내적하면
          회전 행렬의 성질 때문에 두 절대 위치 대신 차이 <M>{"n-m"}</M>가
          나타난다.
        </p>
      </div>

      <ExplainedFormula
        question="절대 위치 m과 n을 넣었는데 attention score에는 왜 상대 거리 n−m이 남을까?"
        idea={<>회전 행렬의 transpose는 반대 방향 회전이고, 두 회전을 연달아 적용하면 각도 차이만 남습니다.</>}
        formula={String.raw`\begin{aligned}(R_mq)^\top(R_nk)&=q^\top R_m^\top R_nk\\&=q^\top R_{n-m}k\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}(R_mq)^\top(R_nk)&=\underbrace{q^\top R_m^\top R_nk}_{\text{rotation composition 계산}}\\&=\underbrace{q^\top R_{n-m}k}_{\text{position-aware score 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`q^\top R_m^\top R_nk`, annotation: ["rotation composition이(가) 식의 결과에","기여하는 방식을 계산합니다.","회전 행렬의 transpose는 반대 방향 회전이고, 두","회전을 연달아 적용하면 각도 차이만 남습니다."] },
          { expression: String.raw`q^\top R_{n-m}k`, annotation: ["position-aware score이(가) 식의 결과에","기여하는 방식을 계산합니다.","회전 행렬의 transpose는 반대 방향 회전이고, 두","회전을 연달아 적용하면 각도 차이만 남습니다."] },
        ]}
        terms={[
          { symbol: "R_m^\\top R_n", name: "rotation composition", description: "−mθ 회전 뒤 nθ 회전을 적용하므로 (n−m)θ가 됩니다." },
          { symbol: "n-m", name: "relative distance", description: "두 token이 sequence에서 얼마나 떨어져 있는지 나타냅니다." },
          { symbol: "q^\\top R_{n-m}k", name: "position-aware score", description: "content q·k와 상대 위치 phase가 함께 attention logit에 반영됩니다." },
        ]}
        interpretation="RoPE는 절대 position으로 각 vector를 회전시키지만 두 vector의 내적에서는 상대 거리를 드러냅니다. 이것이 ‘상대 위치를 반영한다’는 말의 정확한 뜻입니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 때문에 RoPE는 각 token의 절대 위치로 회전을 만들면서도 attention
          score에는 상대 위치 관계를 반영한다. 실제 구현은 큰 회전 행렬을 만들지
          않고 cosine·sine과 원소별 연산으로 같은 계산을 수행한다.
        </p>

        <h3>하나의 회전이 아니라 여러 frequency band다</h3>
        <p>
          Head dimension이 <M>{"d"}</M>이고 model config의 base가
          <M>{"b"}</M>라면, 보통 각 2차원 쌍의 inverse frequency를 다음처럼
          만든다. <code>10000</code>은 원래 RoPE의 대표적인 base지만 모든
          최신 모델에 고정된 상수는 아니며 실제 <code>rope_theta</code>를
          확인해야 한다.
        </p>
      </div>

      <ExplainedFormula
        question="왜 RoPE 차원마다 가까운 거리와 먼 거리를 보는 scale이 달라질까?"
        idea={<>차원 index i가 커질수록 inverse frequency를 기하급수적으로 낮춥니다. 따라서 한 head 안에 짧은 파장과 긴 파장이 함께 생깁니다.</>}
        formula={String.raw`\theta_i=b^{-2i/d},\qquad \lambda_i=\frac{2\pi}{\theta_i}=2\pi b^{2i/d}`}
        annotatedFormula={String.raw`\theta_i=\underbrace{b^{-2i/d},\qquad \lambda_i=\frac{2\pi}{\theta_i}=2\pi b^{2i/d}}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`b^{-2i/d},\qquad \lambda_i=\frac{2\pi}{\theta_i}=2\pi b^{2i/d}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","차원 index i가 커질수록 inverse","frequency를 기하급수적으로 낮춥니다."] },
        ]}
        terms={[
          { symbol: "d", name: "rotary dimension", description: "RoPE가 적용되는 query/key dimension 수입니다. partial RoPE라면 전체 head_dim과 다를 수 있습니다." },
          { symbol: "b", name: "RoPE base", description: "frequency 간격을 정하는 config 값이며 모델의 rope_theta를 확인해야 합니다." },
          { symbol: "\\lambda_i", name: "wavelength", description: "i번째 차원 쌍이 한 바퀴 회전하는 데 필요한 token 거리입니다." },
        ]}
        assumptions={["i는 0부터 d/2−1까지의 2차원 pair index입니다."]}
        interpretation="작은 i는 빠르게 회전해 근거리 차이를 세밀하게 구분하고, 큰 i는 천천히 회전해 더 긴 거리 scale을 제공합니다."
      />

      <figure data-viz="rope-frequency-bands" className="not-prose my-9 rounded-xl border border-border/75 bg-card p-4 sm:p-6">
        <figcaption className="mb-5 text-sm font-semibold">
          RoPE dimension마다 다른 회전 속도
        </figcaption>
        <div className="space-y-4">
          {bands.map((band) => (
            <div key={band.label} className="grid gap-2 sm:grid-cols-[8rem_1fr] sm:items-center">
              <p className="text-sm font-semibold">{band.label}</p>
              <div>
                <div className="h-2 overflow-hidden rounded-[3px] bg-muted">
                  <div
                    className={"h-full rounded-[3px] " + band.tone}
                    style={{ width: band.width }}
                  />
                </div>
                <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                  {band.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </figure>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>확장 문제는 frequency마다 다르게 나타난다</h3>
        <p>
          학습 context 안에서 여러 번 회전한 고주파 차원과 한 바퀴도 완성하지
          못한 저주파 차원은 학습 범위 밖에서 같은 방식으로 움직이지 않는다.
          모든 frequency를 동일하게 늘리면 가까운 token의 위치 해상도까지
          희생할 수 있고, 아무것도 바꾸지 않으면 저주파가 낯선 각도로
          extrapolation된다. 이후 방법들의 차이는 이 frequency band를 어디까지
          보존하고 어디부터 늘릴지 정하는 방식에 있다.
        </p>
      </div>
    </section>
  );
}
