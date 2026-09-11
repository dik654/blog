import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import BankViz from "./viz/BankViz";

export default function BankCapacity() {
  return (
    <section id="bank-capacity" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">참조 뱅크는 정체성을 공급하고 가중치는 의도와 저울질합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          텍스트가 인구통계 축에서만 듣는다면, 같은 인구통계 안에서 서로 다른 얼굴이 필요할 때는 다른 공급원이
          있어야 합니다. 참조 얼굴에서 정체성을 주입하는 경로가 그 자리를 맡습니다.
        </p>

        <p className="leading-7">
          프롬프트에 생김새를 한 글자도 쓰지 않고 의도만 넣어도 참조의 골격이 따라옵니다. 픽셀이 들어가지
          않으므로 참조의 인구통계가 그대로 끌려오지는 않습니다.
        </p>

        <p className="leading-7">
          주입 세기가 연속 다이얼입니다. 낮으면 프롬프트의 의도가 유지되는 대신 결과들이 서로 비슷하고,
          높으면 정체성이 확실히 전이되는 대신 참조의 성별 같은 속성까지 따라옵니다. 세 지표가 전부 단조로
          움직입니다.
        </p>
      </div>

      <BankViz />

      <TermBreakdown
        title="다양성을 만드는 축과 각각의 한계"
        description="같은 의도를 고정했을 때 각 축이 실제로 만들어 낸 서로 다른 인물 수입니다."
        items={[
          {
            term: "시드",
            description: "초기 노이즈를 바꿉니다.",
            example: "의도를 고정하지 않으면 계열에 따라 효과가 보이기도 합니다.",
            boundary: "의도를 고정하면 서른 번에 한 명입니다. 세 계열 모두에서 같았습니다.",
          },
          {
            term: "묘사 서술어",
            description: "얼굴 부위를 문장으로 지정합니다.",
            example: "인구통계 축을 함께 흔들면 잘 듣습니다.",
            boundary: "같은 인구통계 안에서는 증류 가중치에서 거의 멈춥니다. 너비 축은 비증류에서도 약합니다.",
          },
          {
            term: "모델 교체",
            description: "같은 문장을 다른 모델에 넣습니다.",
            example: "모델 간 유사도가 0.254로 모델 내 0.686보다 훨씬 낮습니다.",
            boundary: "모델 하나가 사실상 정체성 하나입니다. 시드는 곱셈에 들어가지 않습니다.",
          },
          {
            term: "참조 뱅크",
            description: "실제 얼굴에서 정체성 벡터를 주입합니다.",
            example: "뱅크가 의도의 인구통계와 맞으면 원하는 만큼 다른 얼굴이 나옵니다.",
            boundary: "용량이 곧 뱅크 크기이고 혼합으로 늘릴 수 없습니다. 세기를 높이면 의도가 밀립니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          모델 교체가 의외로 강한 축이었습니다. 프롬프트·해상도·의도를 완전히 고정하고 여러 계열을 돌리면
          세로로는 딴사람이고 가로로는 같은 사람입니다. 모델 내부 유사도가 0.686, 모델 간이 0.254입니다.
        </p>

        <p className="leading-7">
          다만 한 가지를 제외했습니다. 일러스트 계열 모델이 모든 모델과 거의 직교하게 나왔는데, 그건 다른
          사람이라기보다 판정 도구가 그림에서 신뢰할 만한 임베딩을 못 뽑는 쪽에 가깝습니다. 포함하면 수치가
          훨씬 좋아지지만 부풀려진 값이라 빼고 보고합니다.
        </p>

        <p className="leading-7">
          뱅크 용량은 임계값을 어디에 두느냐에 따라 달라집니다. 얼굴 인식 임계에서는 열두 명 뱅크가 두
          명분이지만, 사람 눈으로 다른 캐릭터로 보이는 경계인 0.50 부근에서는 다섯 명분입니다. 어느 쪽이든
          혼합 기여는 0에 가깝고 용량은 전부 뱅크에서 나옵니다.
        </p>

        <p className="leading-7">
          계측기의 스타일 적용 범위는{" "}
          <Link to="/ai/generative-measurement-controls#style-coverage">계측기 검증</Link>이 소유합니다. 일러스트
          계열을 제외한 근거가 그 글의 측정입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 주입 세기와 모델 간 다양성 (2026-09-11, RTX 4090 48GB)"
        citeKey={4}
        href="https://github.com/dik654/blog"
      >
        주입 세기 0.9·1.3·1.8에서 정체성 전이가 0.376·0.502·0.607, 출력 다양성 지표가 0.562·0.457·0.353,
        다른 인물로 판정된 쌍이 15쌍 중 0·0·5였습니다. 사진체 네 모델 간 쌍 평균이 0.254로 모델 내 0.686보다
        낮았고 54쌍 중 34쌍이 다른 인물이었습니다. 일러스트 계열은 판정 도구의 적용 범위 밖이라 제외했습니다.
      </CitationBlock>
    </section>
  );
}
