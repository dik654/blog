import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import TermBreakdown from "@/components/articles/term-breakdown";
import LamaViz from "./viz/LamaViz";

export default function Propagation() {
  return (
    <section id="propagation" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">물건을 지어낼 방법이 없다는 것이 곧 능력입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          답은 확산 모델이 아니라 큰 마스크를 채우도록 학습된 합성곱 신경망이었습니다. 텍스트 조건도, 노이즈도,
          시드도 없습니다. 구멍 주변의 구조를 안쪽으로 전파할 뿐입니다. 제안 논문이 밝힌 구조적 특징은 빠른
          푸리에 합성곱을 써서 이미지 전체 크기의 수용 영역을 갖는다는 것입니다.
        </p>

        <p className="leading-7">
          그래서 이 모델은 물건을 지어낼 방법을 애초에 갖고 있지 않습니다. 무엇을 그릴지 말해 줄 통로가 없으니
          주변에 있던 것을 이어 붙이는 것 말고는 할 수 있는 일이 없습니다. 그 한계가 정확히 우리가 필요로 하던
          능력이었습니다.
        </p>

        <p className="leading-7">
          결과는 네 그림체 전부에서 깨끗했습니다. 초록 띠를 지우면 그 밑에 있던 가죽 벨트가 그대로 이어져
          나옵니다. 시간은 1초에서 3초, 마스크 밖 변화는 0.15에서 1.03 사이였습니다.
        </p>

        <p className="leading-7">
          이 마스크 밖 수치가 다른 모델들의 것과 성격이 다르다는 점도 짚어 둡니다. 이 모델의 계산 그래프에는
          오토인코더가 없습니다. 합성곱이 픽셀을 직접 내놓으므로 압축·복원 왕복이 없고, 따라서 바닥값이 0입니다.
          차감할 것이 없는 진짜 값입니다.
        </p>
      </div>

      <LamaViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          그 덕분에 한 가지가 더 읽힙니다. 애니 그림체에서만 마스크 밖 변화가 1.03으로 눈에 띄게 큽니다.
          오토인코더가 없는데도 그렇다는 것은 이 모델 자신이 마스크 밖 픽셀을 건드렸다는 뜻입니다. 수용 영역이
          이미지 전체라는 논문의 설명이 그대로 이 측정의 설명이 됩니다. 멀리 있는 화소가 구멍을 채우는 데
          쓰인다면 그 반대 방향도 열려 있습니다.
        </p>

        <p className="leading-7">
          비교군으로 고전적인 이미지 복원 알고리즘도 돌려 봤습니다. 연산 비용이 사실상 0이고 마스크 밖도 거의
          건드리지 않는데, 결과가 뭉갭니다. 주변 색을 평균해 번지게 하는 방식이라 질감이 사라집니다. 빠른
          미리보기에는 쓸 수 있어도 최종 결과로는 쓸 수 없습니다.
        </p>
      </div>

      <TermBreakdown
        title="세 가지 접근과 각각이 실제로 하는 일"
        description="같은 요청을 받아 서로 다른 방식으로 처리하고, 실패하는 방식도 다릅니다."
        items={[
          {
            term: "확산 인페인팅",
            description: "마스크 안을 노이즈에서 다시 생성합니다.",
            example: "다른 물건으로 교체하거나 없던 것을 더하는 데 맞습니다.",
            boundary: "비우라는 요청에 그럴듯한 물건을 채웁니다. 프롬프트로도 막히지 않았습니다.",
          },
          {
            term: "마스크 채우기 전용 망",
            description: "구멍 주변 구조를 안쪽으로 전파합니다. 조건 입력이 없습니다.",
            example: "띠 아래 가려져 있던 벨트가 그대로 이어집니다.",
            boundary: "주변에 없는 것은 만들 수 없고, 이미지 전체를 통과시키므로 마스크 밖도 조금 움직입니다.",
          },
          {
            term: "고전 복원 알고리즘",
            description: "주변 픽셀을 확산시켜 구멍을 메웁니다.",
            example: "연산이 거의 공짜라 미리보기에 적합합니다.",
            boundary: "질감이 사라지고 뭉개집니다. 최종 결과물로 쓸 수 없습니다.",
          },
        ]}
      />

      <h3 id="strength-cliff" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        세기 손잡이에 중간이 없는 지점이 있습니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          이 모델에는 제거 세기 파라미터가 있고 노드의 슬라이더는 255까지 갑니다. 마스크와 이미지를 고정하고
          이 값만 움직여 봤습니다. 120에서 254까지는 마스크 밖 변화가 0.14에서 0.52로 완만하게 올라갑니다.
        </p>

        <p className="leading-7">
          255에서 115.66이 됩니다. 프레임 전체가 천 텍스처로 뒤덮입니다. 점진적 악화가 아니라 경계 버그이고,
          254와 255 사이에 중간이 없습니다.
        </p>

        <p className="leading-7">
          그래서 도구가 254로 자릅니다. 에러로 거절하지 않고 잘라 내는 쪽을 택한 이유가 있습니다. 허용된 범위
          안의 값을 넣었는데 거절당하는 것보다, "가능한 가장 강한 지우기"를 받는 편이 호출하는 쪽의 기대와
          맞기 때문입니다.
        </p>

        <p className="leading-7">
          이 절벽이 계측기 문제와 얽혀 있었다는 점도 기록합니다. 세기를 255로 올려 프레임을 파괴한 결과를 보조
          계측기 둘이 전부 성공으로 채점했습니다. 이미지를 망가뜨리면 그 물건도 함께 사라지므로 "없어졌는가"만
          묻는 판정기는 이것을 구분하지 못합니다. 잡아낸 것은 마스크 밖 변화량 하나뿐이었습니다. 그 실패의
          전모는 <Link to="/ai/generative-measurement-controls#instrument-controls">계측기 검증</Link>이
          소유합니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 제거 전용 망과 세기·확장 스윕 (2026-09-11, RTX 4090 48GB)"
        citeKey={2}
        href="https://github.com/dik654/blog"
      >
        네 그림체에서 마스크 안 변화 34.6~61.8, 마스크 밖 0.15~1.03, 1~3초였습니다. 세기 스윕에서 마스크 밖이
        120에서 0.139, 254에서 0.525, 255에서 115.66으로 튀었습니다. 그래프에 오토인코더가 없어 마스크 밖
        수치에 차감할 바닥값이 없습니다.
      </CitationBlock>
    </section>
  );
}
