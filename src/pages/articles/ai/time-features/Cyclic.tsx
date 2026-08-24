import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import CyclicViz from "./viz/CyclicViz";

export default function Cyclic() {
  return (
    <section id="cyclic" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Sin·cos encoding은 숫자 경계 대신 원 위의 위상을 표현합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Hour를 0부터 23까지의 scalar로만 넣으면 23시와 0시의 차이는 23이지만
          실제 clock에서는 한 시간 차이입니다. Period T의 위치를 angle로 바꿔
          unit circle에 놓으면 끝과 시작이 같은 점에서 이어집니다. Sin 하나만
          사용하면 서로 다른 두 angle이 같은 값을 가질 수 있으므로 cos와 함께
          두 좌표를 사용합니다.
        </p>
      </div>

      <ExplainedFormula
        question="주기 T의 위치 x를 경계가 끊기지 않는 두 좌표로 어떻게 바꿀까?"
        idea={<>한 주기 T를 2π radian 한 바퀴에 대응시키고 angle의 가로·세로 좌표를 사용합니다. x=0과 x=T는 같은 point이고 T−1과 0도 원 위에서 가까워집니다.</>}
        formula={String.raw`\phi_T(x)=\left(\cos\frac{2\pi x}{T},\ \sin\frac{2\pi x}{T}\right)`}
        annotatedFormula={String.raw`\phi_T(x)=\underbrace{\left(\cos\frac{2\pi x}{T},\ \sin\frac{2\pi x}{T}\right)}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`\left(\cos\frac{2\pi x}{T},\ \sin\frac{2\pi x}{T}\right)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","한 주기 T를 2π radian 한 바퀴에 대응시키고","angle의 가로·세로 좌표를 사용합니다."] },
        ]}
        terms={[
          { symbol: "x", name: "phase position", description: "Hour·weekday처럼 주기 안에서의 위치를 나타내며 원래 단위는 hour·day 등입니다." },
          { symbol: "T", name: "period", description: "한 바퀴를 이루는 길이로 hour-of-day는 24, weekday는 7입니다." },
          { symbol: "2πx/T", name: "angle", description: "원래 위치를 dimensionless radian angle로 변환한 값입니다." },
          { symbol: "φ_T(x)", name: "cyclic coordinates", description: "Unit circle 위의 2차원 vector이며 norm은 1입니다." },
        ]}
        assumptions={["현상에 실제로 길이 T의 주기가 있다는 가설이 있습니다.", "Timezone과 daylight-saving rule이 feature 정의와 일치합니다.", "Month length·holiday처럼 불규칙한 calendar effect는 별도 feature로 다룹니다."]}
        interpretation="Encoding은 seasonality를 만들어내지 않고 model이 경계 양쪽을 가까운 좌표로 볼 수 있게 합니다."
      />

      <ExplainedFormula
        question="원 위에서 두 시점의 거리는 실제 circular separation과 어떻게 연결될까?"
        idea={<>두 unit-circle vector의 squared Euclidean distance를 전개하면 angle 차이의 cosine으로 정리됩니다. 경계를 사이에 둔 두 위치도 작은 angle 차이를 가지므로 거리가 작습니다.</>}
        formula={String.raw`\|\phi_T(x)-\phi_T(x^{\prime})\|_2^2=2-2\cos\!\left(\frac{2\pi(x-x^{\prime})}{T}\right)`}
        annotatedFormula={String.raw`\|\phi_T(x)-\phi_T(x^{\prime})\|_2^2=\underbrace{2-2\cos\!\left(\frac{2\pi(x-x^{\prime})}{T}\right)}_{\text{기준량당 비율}}`}
        operations={[
          { expression: String.raw`2-2\cos\!\left(\frac{2\pi(x-x^{\prime})}{T}\right)`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","두 unit-circle vector의 squared","Euclidean distance를 전개하면 angle 차이의","cosine으로 정리됩니다."] },
        ]}
        terms={[
          { symbol: String.raw`x-x^{\prime}`, name: "phase difference", description: "두 위치의 차이며 cosine의 주기성 때문에 T만큼 다른 값은 같은 위상으로 취급됩니다." },
          { symbol: "2−2cos(·)", name: "chord distance squared", description: "Unit circle의 두 point를 잇는 직선 거리의 제곱입니다." },
        ]}
        assumptions={["두 encoding이 같은 T와 같은 phase origin을 사용합니다.", "거리 해석은 learned model이 이 좌표를 유지해 사용할 때의 input geometry입니다."]}
        interpretation="T=24에서 23시와 0시는 angle 2π/24만큼만 떨어져 있지만 scalar encoding에서는 23만큼 떨어집니다."
      />

      <div className="not-prose my-8"><CyclicViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>여러 harmonic은 더 복잡한 주기 모양을 표현합니다</h3>
        <p>
          기본 sin·cos pair는 한 주기에 한 번 부드럽게 변하는 basis입니다. k=2,3,…의
          harmonic pair를 더하면 하루 안의 두 번의 peak나 날카로운 패턴을 더 쉽게
          표현할 수 있지만 feature 수와 overfitting 가능성도 늘어납니다. 이 생각은{" "}
          <Link to="/ai/fft">Fourier basis</Link>와 연결되며, 알려진 seasonality와
          충분한 history가 있을 때 낮은 frequency부터 추가합니다.
        </p>
        <p>
          Month는 길이가 서로 다르고 holiday·급여일·billing cycle은 규칙이
          불연속적입니다. 하나의 T=12 encoding에 모든 calendar effect를 맡기지
          않고 raw category, days-to-holiday, business-day index 같은 별도 causal
          calendar feature를 ablation합니다.
        </p>
        <div id="paper-time2vec" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">논문 읽기 · 고정 주기에서 학습 가능한 시간 표현으로</p>
          <p className="mt-2 text-sm font-semibold">Time2Vec: Learning a Vector Representation of Time</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Kazemi 등은 하나의 linear time coordinate와 여러 학습 가능한 periodic coordinates를 결합한 model-agnostic time representation을 제안했습니다. 이는 hour-of-day에 T=24를 고정한 sin·cos pair의 확장이지만, 어떤 dataset에서도 실제 period를 자동으로 올바르게 발견하거나 calendar irregularity를 해결한다는 보장은 아닙니다.</p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1907.05321" target="_blank" rel="noreferrer">원 논문의 periodic activation과 실험 범위 보기</a>
        </div>
      </div>
    </section>
  );
}
