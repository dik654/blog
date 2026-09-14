import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import SeedViz from "./viz/SeedViz";

export default function SeedNull() {
  return (
    <section id="seed-null" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">시드는 기여가 없고, 인구통계를 고정하면 묘사도 멈춥니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          난수 시드를 바꾸면 다른 사람이 나온다는 통념이 있습니다. 실제로 어떤 모델 계열에서는 시드만 바꿔도
          결과가 크게 달라지기도 합니다. 그런데 의도를 고정하는 순간 그 효과가 사라집니다.
        </p>

        <p className="leading-7">
          같은 문장에 시드만 다섯 개를 쓴 결과가 여전히 같은 사람이었습니다. 서른 번을 시도해 새 인물로
          채택된 것은 한 명이고, 이는 세 모델 계열 모두에서 같았습니다.
        </p>

        <p className="leading-7">
          더 의외였던 것은 묘사 축도 함께 멈춘다는 점입니다. 코·눈·눈썹·입 모양을 서술어로 다르게 지정하고
          자동으로 샘플링해 서른 번을 돌렸는데, 채택된 인물 수가 시드만 바꿨을 때와 같았습니다.
        </p>

        <p className="leading-7">
          그림을 보면 숫자와 같은 말을 합니다. 축을 전부 다르게 뽑은 열두 개의 묘사가 자매이거나 같은
          사람입니다. 체형이 다른 하나만 겨우 구분됩니다.
        </p>
      </div>

      <SeedViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그런데 인구통계를 풀면 이야기가 달라집니다. 나이와 성별과 체형을 함께 흔든 열두 개의 묘사에서는
          예순여섯 쌍 중 스물일곱 쌍이 다른 인물로 판정됐습니다. 텍스트가 무력한 것이 아니라 어떤 축에서만
          듣는 것입니다.
        </p>

        <p className="leading-7">
          형태 지표로도 같은 구분이 나옵니다. 얼굴의 세로 대 가로 비는 묘사에 반응해 노이즈 바닥의 네다섯
          배로 벌어지는데, 광대폭과 턱폭의 비는 노이즈 수준에서 움직이지 않습니다. 길이 축은 말로 조절되고
          너비 축은 되지 않습니다.
        </p>

        <p className="leading-7">
          이 관찰이 앞선 회차와 정확히 같은 방향입니다. 3차원 형태로 골격을 직접 제어하려던 시도에서도 움직이지
          않던 축이 바로 이 너비 축이었습니다. 두 경로 모두에서 안 움직인다면 모델이 그 축에 대한 제어를
          배우지 않았다는 쪽에 무게가 실립니다.
        </p>

        <p className="leading-7">
          다만 나이는 잘 조종됩니다. 열여덟을 요구하면 스물넷으로, 일흔다섯을 요구하면 여든으로 읽히는데,
          평균 오차가 열 살가량이지만 부호가 항상 같은 계통 편향이라 보정할 수 있습니다. 임계값과 판정 기준은{" "}
          <Link to="/cs/ai/generative-measurement-controls#threshold-choice">계측기 검증</Link>이 소유합니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 시드·묘사 축의 기여도 (2026-09-11, RTX 4090 48GB)"
        citeKey={1}
        href="https://github.com/dik654/blog"
      >
        의도를 고정한 상태에서 서른 번 시도해 채택된 새 인물이 서술 축 샘플링·시드 변경 모두 한 명이었고, 이는
        세 모델 계열에서 같았습니다. 인구통계를 함께 흔든 열두 묘사에서는 66쌍 중 27쌍이 다른 인물이었습니다.
        형태 지표에서 얼굴 세로 대 가로 비는 15.6%로 노이즈 바닥 3.7%·2.5%의 네다섯 배였고, 광대폭과 턱폭은
        3.8%로 노이즈 3.1%·4.0%와 구분되지 않았습니다.
      </CitationBlock>
    </section>
  );
}
