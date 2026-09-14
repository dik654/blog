import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TokenViz from "./viz/TokenViz";

export default function TokenBudget() {
  return (
    <section id="token-budget" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">대상이 잠재 공간에서 몇 칸을 차지하는지가 결과를 정합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          잠재 확산은 픽셀을 직접 다루지 않습니다. 오토인코더가 이미지를 여덟 배 줄인 잠재 표현으로 바꾸고 확산은 그 공간에서 일어납니다. 그 잠재 표현은 다시 작은 조각으로 쪼개져
          토큰이 됩니다.
        </p>

        <p className="leading-7">
          그래서 화면에서 보이는 픽셀 수가 아니라 잠재 공간의 칸 수가 실제 예산입니다. 전신 1메가픽셀 프레임의 95픽셀 얼굴은 잠재 공간에서 대략 12 곱하기 12 칸이고 토큰으로 세면
          몇 개 되지 않습니다.
        </p>

        <p className="leading-7">
          이 예산이 작으면 낮은 노이즈 비율도 소용이 없습니다. 원본을 얼마나 남길지 정하는 값인데, 남길 원본
          자체가 몇 칸뿐이면 남겨도 얼굴을 특정하기에 부족합니다. 빈자리는 모델이 가진 사전이 채웁니다.
        </p>

        <p className="leading-7">
          설명이 맞는지 확인하는 방법은 해상도만 올려 보는 것입니다. 같은 프레임을 4메가픽셀로 보내자 정체성 유사도가 0.265에서 0.318로 올라갔습니다. 방향은 맞지만 여전히
          부족했고 그 부족함이 다음 결론으로 이어집니다.
        </p>
      </div>

      <TokenViz />

      <ExplainedFormula
        question="얼굴이 잠재 공간에서 몇 칸을 차지합니까"
        idea="이미지가 오토인코더에서 일정 배율로 줄고 다시 패치로 쪼개지므로, 화면 픽셀 크기를 두 배율로 나누면 그 대상이 실제로 받는 토큰 수가 나옵니다."
        formula={String.raw`N \;=\; \left(\frac{s}{f \cdot p}\right)^{2}`}
        annotatedFormula={String.raw`N \;=\; \left(\frac{\overbrace{s}^{\text{얼굴 한 변의 픽셀}}}{\underbrace{f}_{\text{오토인코더 축소 배율}} \cdot \underbrace{p}_{\text{패치 한 변}}}\right)^{2}`}
        operations={[
          {
            expression: String.raw`\frac{s}{f}`,
            annotation: [
              "잠재 공간에서 그 대상이 차지하는 한 변의 칸 수입니다",
              "s = 95, f = 8 이면 약 12칸입니다",
            ],
          },
          {
            expression: String.raw`\frac{s}{f \cdot p}`,
            annotation: "패치로 쪼개고 나면 한 변에 남는 토큰 수이며, p = 2 라면 약 6이 됩니다",
          },
          {
            expression: String.raw`s \to 327`,
            annotation: "같은 계산에서 한 변 토큰이 약 20으로 늘어 면적으로는 열 배 이상 차이가 납니다",
          },
        ]}
        terms={[
          { symbol: "s", name: "대상 크기", description: "화면에서 그 대상의 한 변 픽셀 수입니다." },
          { symbol: "f", name: "축소 배율", description: "오토인코더가 이미지를 줄이는 배율입니다." },
          { symbol: "p", name: "패치 크기", description: "잠재 표현을 토큰으로 쪼갤 때의 한 변입니다." },
        ]}
        assumptions={[
          "축소 배율과 패치 크기가 모델마다 다릅니다. 구체 수치는 각 구현을 확인해야 하고 이 식은 관계만 보여 줍니다.",
          "토큰 수가 많다고 반드시 정체성이 보존되는 것은 아닙니다. 필요 조건에 가깝고 충분 조건이 아닙니다.",
        ]}
        interpretation="식이 말하는 것은 편집의 성패를 가르는 단위가 프레임 해상도가 아니라 대상 해상도라는 점입니다. 4메가픽셀 전신 프레임을 보내도 얼굴이 여전히 작으면 예산은 거의 늘지 않습니다."
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그래서 프레임을 키우는 대신 대상을 키우는 쪽이 답입니다. 얼굴이 327픽셀인 패널에 같은 리파인을 걸자 정체성이 0.531로 올라갔습니다. 전신 4메가픽셀의 0.318과 비교하면
          총 픽셀은 훨씬 적은데 결과는 훨씬 좋습니다.
        </p>

        <p className="leading-7">
          이 관계를 뒤집으면 실무 규칙이 나옵니다. 리파인은 프레임 전체가 아니라 영역별로 걸어야 하고, 각
          영역은 그 안의 대상이 충분한 칸을 받을 만큼 크게 잘라 보내야 합니다. 잠재 공간의 압축 비율 자체는{" "}
          <Link to="/cs/ai/latent-diffusion-guidance#compression">잠재 확산</Link>이 소유합니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 대상 해상도와 정체성 보존 (2026-09-11, RTX 4090 48GB)"
        citeKey={1}
        href="https://github.com/dik654/blog"
      >
        같은 리파인 설정에서 전신 1메가픽셀 프레임의 95픽셀 얼굴이 정체성 0.265, 같은 프레임을 4메가픽셀로
        올리면 0.318, 얼굴이 327픽셀인 패널에서는 0.531이었습니다. 축소 배율과 패치 크기는 모델마다 다르므로
        토큰 수 계산은 관계를 보여 주는 용도이며 절대 기준이 아닙니다.
      </CitationBlock>
    </section>
  );
}
