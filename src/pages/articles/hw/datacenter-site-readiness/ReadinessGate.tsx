import { Link } from "react-router-dom";
import GateViz from "./viz/GateViz";

export default function ReadinessGate() {
  return (
    <section id="readiness-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">건물이 정한 제약에서 거꾸로 올라옵니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          확인 순서를 뒤집는 것이 이 글의 결론입니다. 서버를 고른 다음 전산실이 되는지 보는 대신, 건물이 이미
          정해 놓은 제약을 먼저 적고 그 안에서 고를 수 있는 서버를 찾습니다. 바닥 허용치와 회로 용량, 냉각
          방식은 바꾸기 어렵고 서버는 바꾸기 쉽습니다.
        </p>

        <p className="leading-7">
          순서는 이렇습니다. 먼저 바닥의 분포 하중과 집중 하중 허용치를 확인하고, 지진 대응이 요구되는지와
          어떤 고정이 가능한지를 확인합니다. 다음에 랙당 공급 가능한 회로 용량과 급전 경로 수를 확인하고,
          마지막으로 전산실이 감당 가능한 냉각 방식을 확인합니다.
        </p>

        <p className="leading-7">
          이 네 숫자가 정해지면 후보가 크게 좁혀집니다. 랙당 전력이 제한돼 있으면 한 랙에 넣을 수 있는 섀시 수가
          정해지고, 냉각이 공랭뿐이면 선택할 수 있는 가속기 전력 등급이 정해집니다. 바닥 허용치는 랙 자체를
          몇 대나 어떤 간격으로 놓을지를 정합니다.
        </p>

        <p className="leading-7">
          반대 순서로 진행하면 흔한 결말이 있습니다. 장비는 도착했는데 회로 증설에 몇 달이 걸리거나, 액체 냉각
          장비를 샀는데 분배 장치가 없거나, 랙을 놓을 위치가 구조상 제한되는 상황입니다. 이 셋 모두 발주 전
          한 시간의 확인으로 피할 수 있습니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          정리하면 서버 사양서의 숫자와 건물 도면의 숫자를 한 표에 놓는 것이 이 글이 제안하는 전부입니다. 섀시
          지속 부하와 회로 용량, 랙 총 무게와 바닥 허용치, 요구 냉각 방식과 전산실 설비, 랙 등급과 지역 기준을
          짝지어 두면 어긋나는 칸이 바로 보입니다.
        </p>

        <p className="leading-7">
          이 글이 주장하지 않는 것도 분명합니다. 구체적인 허용치와 요구 등급은 지역 기준과 건물마다 다르고,
          여기 쓴 숫자는 계산 방법을 보여 주기 위한 예시입니다. 실제 판정은 도면과 구조·전기 담당의 확인으로
          해야 합니다.
        </p>

        <p className="leading-7">
          가속기 선택 자체는{" "}
          <Link to="/gpu/ai-accelerator-vendor-comparison">가속기 벤더 비교</Link>, CPU와 레인 예산은{" "}
          <Link to="/gpu/server-cpu-lineup-comparison">서버 CPU 제품군</Link>, 랙 단위 전력 분배와 발열 계산은{" "}
          <Link to="/gpu/hw-power-cooling">전력과 냉각</Link>에서 이어집니다. 네 글을 함께 보면 노드 한 대를
          들이는 결정이 닫힙니다.
        </p>
      </div>
    </section>
  );
}
