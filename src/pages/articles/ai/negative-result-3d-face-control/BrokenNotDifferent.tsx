import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import BrokenViz from "./viz/BrokenViz";

export default function BrokenNotDifferent() {
  return (
    <section id="broken-not-different" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">가장 잘 나뉘던 지점은 애초에 쓸 수 없었습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          분리가 가장 컸던 최대 강도에서 시드 대조군을 돌리니 네 장 중 세 장이 얼굴로 검출조차 되지
          않았습니다. 유사도가 낮아서가 아니라 계산이 시작되지 않은 것입니다.
        </p>

        <p className="leading-7">
          실제 이미지를 보면 이유가 분명합니다. 모델이 깊이 실루엣을 문자 그대로 받아들여 머리를 공 모양으로 그리고 눈이 파인 홈을 안경으로 렌더했습니다.
        </p>

        <p className="leading-7">
          그러면 그 지점의 낮은 유사도가 무엇이었는지가 달라집니다. 상당 부분이 "다른 사람"이 아니라 "망가진
          이미지"였습니다. 단조 감소 그래프에서 가장 좋아 보이던 끝점이 실은 사용 불가 구간이었던 것입니다.
        </p>

        <p className="leading-7">
          이 구분을 못 하면 지표가 좋아지는 방향으로 설정을 계속 밀게 됩니다. 낮은 유사도를 성공 신호로 읽는
          한 결과가 무너지는 쪽이 항상 이깁니다.
        </p>
      </div>

      <BrokenViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          유일하게 살아남은 신호가 하나 있습니다. 가장 극단적인 형태 하나만 시드 노이즈 범위를 벗어났습니다.
          세로 대 가로 비가 1.644인데 같은 지표의 시드 노이즈 범위가 1.215에서 1.518이었습니다.
        </p>

        <p className="leading-7">
          앞 절의 관찰과 정확히 같은 방향입니다. 극단적인 형태만 살아남고 미묘한 차이는 전부 흡수됩니다.
          조잡한 1차 메쉬가 오히려 잘 보존한 이유도 같습니다.
        </p>

        <p className="leading-7">
          그래서 이 경로가 완전히 무의미하다고는 하지 않습니다. 다만 캐릭터를 여러 명 만들려는 목적에는
          쓸 수 없습니다. 서로 다른 인물이 필요한 상황에서 "아주 극단적인 형태만 전달된다"는 성질은 필요한
          해상도의 반대편에 있습니다.
        </p>

        <p className="leading-7">
          탐지 실패와 낮은 유사도를 구분해 읽는 법은{" "}
          <Link to="/cs/ai/generative-measurement-controls#identity-metric">계측기 검증</Link>이 소유합니다.
          이 절은 그 구분이 없었다면 사용 불가 구간을 최적점으로 골랐을 사례입니다.
        </p>
      </div>

      <CitationBlock
        source="프로젝트 실측 — 최대 강도 구간의 열화 (2026-09-10, RTX 4090 48GB)"
        citeKey={4}
        href="https://github.com/dik654/blog"
      >
        제어 강도 1.00의 시드 대조군에서 네 장 중 세 장이 얼굴 검출에 실패했고, 결과 이미지에서 머리가 공
        형태로 그려지고 눈 홈이 안경으로 렌더됐습니다. 가장 극단적인 형태 하나만 세로 대 가로 비 1.644로
        시드 노이즈 범위 1.215~1.518을 벗어났습니다.
      </CitationBlock>
    </section>
  );
}
