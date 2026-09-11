import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import MatrixViz from "./viz/MatrixViz";

export default function ModelDisposition() {
  return (
    <section id="model-disposition" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 요청에 모델마다 일관된 성향이 나타납니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          표를 채우고 나서 가장 먼저 보인 것은 개별 칸이 아니라 줄이었습니다. 어떤 모델은 여섯 동작 내내 조심스럽고 어떤 모델은 내내 과하게 바꿉니다. 동작별로 잘하고 못하고가 흩어져
          있는 게 아니라 성향이 일관됩니다.
        </p>

        <p className="leading-7">
          가장 보수적인 모델은 여섯 동작 중 넷에서 최저 변화량을 냈고 색 변경에서는 0.61 차이로 두 번째였습니다. 기존 그림을 건드리면 안 되는 편집에는 최선이지만 없던 것을 더하는
          동작에서는 4.5라는 값이 나옵니다. 안내 계수를 2.5에서 7.0까지 올려도 4.4에서 4.5로 움직였을 뿐입니다. 소심한 것이 아니라 구조적으로 못 하는 것입니다.
        </p>

        <p className="leading-7">
          예외가 하나 있습니다. 물건 교체에서는 이 모델이 55.5로 오히려 큰 값을 냈습니다. 다만 그림을 보면 요구한 각반이 아니라 다른 것을 만든 결과입니다. 많이 바꿨다는 것과
          요청을 따랐다는 것이 같지 않다는 사례이기도 합니다. 성향은 대체로 일관되지만 완전히 균일하지는 않습니다.
        </p>

        <p className="leading-7">
          반대쪽 끝에는 요청을 가장 세게 반영하는 모델이 있습니다. 문제는 단어에 과잉 반응한다는 것입니다.
          "빨간 흉터"를 요구하면 노이즈 비율을 0.55까지 낮춰도 뺨에 빨간 덩어리를 그립니다. 색 이름을 빼고
          피부를 묘사하자 같은 모델·같은 설정에서 마스크 안 변화가 33.8에서 10.2로 떨어졌습니다.
        </p>

        <p className="leading-7">
          요청을 가장 곧이곧대로 수행하는 모델도 있습니다. 물건 교체에서 유일하게 요구한 금속 각반을 만들어 냈습니다. 그런데 마스크와 무관하게 얼굴을 다시 그려서 얼굴이 프레임에 들어
          있으면 정체성이 0.93까지 떨어집니다. 인물이 없는 편집에만 쓸 수 있다는 뜻입니다.
        </p>
      </div>

      <MatrixViz />

      <TermBreakdown
        title="네 가지 성향과 그에 맞는 자리"
        description="성향은 장단점이 아니라 배치 조건입니다. 맞는 자리에 놓으면 전부 쓸모가 있습니다."
        items={[
          {
            term: "보수형",
            description: "여섯 동작 중 넷에서 최저 변화량을 내고 색 변경에서도 두 번째로 낮습니다.",
            example: "색만 바꾸는 동작에서 매듭과 주름을 그대로 둔 채 색만 갈아 냅니다.",
            boundary: "없던 것을 더하지 못하고 재질 변경도 거의 무동작입니다. 물건 교체에서는 예외적으로 크게 바꾸지만 요구한 물건이 아닙니다.",
          },
          {
            term: "과잉형",
            description: "요청을 가장 크게 반영하며 변화량이 큽니다.",
            example: "재질 변경처럼 확실히 바뀌어야 하는 동작에 맞습니다.",
            boundary: "강한 단어에 과잉 반응하므로 색 이름 같은 표현을 빼고 중립적으로 써야 합니다.",
          },
          {
            term: "직설형",
            description: "요구한 물건을 실제로 만들어 내는 유일한 모델이었습니다.",
            example: "부츠를 금속 각반으로 바꾸는 요청을 문자 그대로 수행했습니다.",
            boundary: "마스크와 무관하게 얼굴을 다시 그려 인물이 있는 프레임에서는 정체성이 무너집니다.",
          },
          {
            term: "절제형",
            description: "마스크 밖을 가장 적게 건드리면서 빠릅니다.",
            example: "손으로 그린 힌트를 살리는 유일한 모델이기도 합니다.",
            boundary: "물건 교체에서 영역을 파괴했고 색 지시를 놓쳤습니다. 큰 의미 변경에는 맞지 않습니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          한 칸이 통째로 비어 있었습니다. 지우기입니다. 일곱 모델 전부 영역을 비우는 대신 그럴듯한 다른 물건을
          그려 넣었습니다. 초록 띠를 없애 달라고 하면 갈색 벨트를 만들어 놓습니다. 변화량은 23에서 26 사이로
          비슷하게 나오는데, 그 숫자가 "지웠다"는 뜻이 아니었습니다.
        </p>

        <p className="leading-7">
          이 실패가 일곱 개 전부에서 같은 모양으로 나타났다는 점이 중요합니다. 모델 선택의 문제가 아니라 디노이저라는 도구의 성질입니다. 그래서 다른 종류의 도구가 필요합니다. 그
          이야기는 별도 글로 다룹니다.
        </p>

        <p className="leading-7">
          마스크 밖 변화량을 모델 선택에 쓰지 않은 이유도 적어 둡니다. 그 열은{" "}
          <Link to="/ai/generative-measurement-controls#roundtrip-floor">오토인코더 왕복 바닥값</Link>으로
          설명되어 모델의 성질이 아니었습니다. 이 표에서 선택 근거로 쓰는 것은 마스크 안 변화량과 그림 확인
          두 가지입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 편집 동작 6종 × 모델 7종 매트릭스 (2026-09-11, RTX 4090 48GB)"
        citeKey={1}
        href="https://github.com/dik654/blog"
      >
        입력·마스크·프롬프트·시드를 고정하고 49회 실행해 마스크 안 변화량과 마스크 밖 변화량을 기록했습니다.
        보수형 모델의 재질 변경 20.8·추가 4.5, 직설형 모델의 교체 67.7, 절제형 모델의 교체 78.4가 대표값이며
        지우기는 일곱 모델 전부 23~26 범위에서 다른 물건을 그려 냈습니다. 한 장비의 한 회차이며 다른 소스나
        프롬프트 문체에서 순위가 달라질 수 있습니다.
      </CitationBlock>
    </section>
  );
}
