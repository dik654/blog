import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation";
import SignalViz from "./viz/SignalViz";

export default function ThreeSignals() {
  return (
    <section id="three-signals" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">세 신호가 각각 다른 것을 맡아야 네 각도가 나옵니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞의 두 절이 각각 하나씩 제거했습니다. 참조 잠재는 자세를 붙잡으므로 정체성 전달에서 빼고 관절 좌표는 방향을 표현하지 못하므로 방향 전달에서 뺍니다. 남은 조합이 답입니다.
        </p>

        <p className="leading-7">
          관절 좌표가 사지 배치를 맡고, 시점 문구가 향하는 방향을 맡고, 어텐션 주입이 정체성을 맡습니다.
          세 신호가 서로 다른 층으로 들어가기 때문에 겹치지 않습니다. 정체성은 기하를 건드리지 않고, 자세
          조건은 인물이 누군지 모릅니다.
        </p>

        <p className="leading-7">
          이 구성에서 네 각도가 전부 성립했습니다. 정면·사분의삼·측면에서 정체성이 0.44에서 0.64 사이로
          유지되고, 후면에서는 얼굴이 검출되지 않습니다.
        </p>

        <p className="leading-7">
          마지막 항목이 실패가 아니라 성공 신호라는 점이 중요합니다. 뒤통수만 보이는 프레임에서 얼굴 탐지가
          되면 오히려 이상합니다. 탐지 실패를 낮은 유사도와 구분해 읽을 수 있어야 이 판정이 가능합니다.
        </p>
      </div>

      <SignalViz />

      <TermBreakdown
        title="세 신호와 각각이 들어가는 층"
        description="같은 층으로 들어가면 서로를 덮어씁니다. 층이 다르기 때문에 합쳐 쓸 수 있습니다."
        items={[
          {
            term: "관절 좌표",
            description: "사지의 위치를 공간 조건으로 매 단계에 겁니다.",
            example: "참조 잠재가 못 하던 몸의 회전을 실제로 만들어 냅니다.",
            boundary: "앞뒤가 거울 대칭이라 향하는 방향은 표현하지 못합니다.",
          },
          {
            term: "시점 문구",
            description: "어느 쪽에서 본 장면인지를 텍스트 조건으로 전달합니다.",
            example: "후면 뷰를 실제로 만들어 내는 유일한 신호였습니다.",
            boundary: "문구만으로는 몸이 돌지 않습니다. 참조 잠재가 있으면 무시됩니다.",
          },
          {
            term: "어텐션 주입",
            description: "참조 얼굴의 정체성 벡터를 어텐션 계산에 끼워 넣습니다.",
            example: "픽셀이 들어가지 않아 인구통계를 끌고 오지 않습니다.",
            boundary: "정면 얼굴 쪽으로 편향이 있어 세기를 낮춰야 다른 각도가 나옵니다.",
          },
        ]}
      />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          셋 중 하나를 빼면 각각 다르게 무너집니다. 관절 좌표를 빼면 몸이 돌지 않고, 시점 문구를 빼면 앞뒤를
          정하지 못하며, 어텐션 주입을 빼면 매번 다른 사람이 나옵니다. 그리고 세기를 높이면 얼굴이 정면으로
          박힙니다.
        </p>

        <p className="leading-7">
          이 구조에서 배운 일반적인 것은 신호를 역할별로 나누라는 것이 아니라 한 신호가 두 역할을 겸하고 있는지 먼저 확인하라는 쪽입니다. 참조 잠재가 정체성과 자세를 겸하고 있다는
          사실을 못 봤다면 문구를 계속 다듬고 있었을 것입니다.
        </p>

        <p className="leading-7">
          탐지 실패와 낮은 유사도를 구분해 읽는 법은{" "}
          <Link to="/ai/generative-measurement-controls#identity-metric">계측기 검증</Link>이 소유합니다.
          이 절은 그 구분을 후면 뷰 판정에 쓴 사례입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 세 신호를 합친 네 각도 (2026-09-11, RTX 4090 48GB)"
        citeKey={4}
        href="https://github.com/dik654/blog"
      >
        관절 좌표·시점 문구·세기 0.7의 어텐션 주입을 함께 건 구성에서 정면 회전 1.2도·정체성 0.637,
        사분의삼 −64.6도·0.510, 측면 52.9도·0.438이었고 후면에서는 얼굴이 검출되지 않았습니다. 후면의 탐지
        실패는 진짜 후면 뷰의 증거로 읽습니다.
      </CitationBlock>
    </section>
  );
}
