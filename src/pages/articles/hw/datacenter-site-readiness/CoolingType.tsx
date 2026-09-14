import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import CoolingTypeViz from "./viz/CoolingTypeViz";

export default function CoolingType() {
  return (
    <section id="cooling-type" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 카드라도 바람을 어디로 버리느냐가 다릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          가속기 카드의 냉각 방식은 크게 넷으로 나뉩니다. 바람을 카드 뒤쪽 브래킷 밖으로 밀어내는 방식, 카드
          주변으로 흩뿌리는 방식, 카드에 물을 흘려 열을 밖으로 빼는 방식, 그리고 카드 전체를 액체에 담그는
          방식입니다. 이 선택이 한 섀시에 몇 장을 넣을 수 있는지를 정합니다.
        </p>

        <p className="leading-7">
          뒤로 밀어내는 방식은 뜨거운 공기를 섀시 밖으로 바로 내보냅니다. 카드를 빽빽하게 붙여도 옆 카드가
          데워지지 않으므로 여러 장 구성에 적합합니다. 대신 좁은 통로로 바람을 밀어야 해서 소음이 크고 압력
          손실이 큽니다.
        </p>

        <p className="leading-7">
          주변으로 흩뿌리는 방식은 조용하고 냉각 효율이 좋지만 뜨거운 공기가 섀시 안에 머뭅니다. 카드를 두 장
          이상 붙여 꽂으면 안쪽 카드가 옆 카드의 배기를 다시 마시게 되고, 그 결과 성능이 떨어집니다. 작업용
          기기에는 맞지만 밀집 구성에는 맞지 않습니다.
        </p>

        <p className="leading-7">
          물을 쓰는 두 방식은 공기로 감당할 수 없는 전력 구간에서 선택지가 됩니다. 다만 서버만 바꿔서 되는
          일이 아니라 분배 장치와 배관, 누수 감지까지 전산실 설비가 함께 준비돼야 합니다. 그래서 이 선택은
          사실상 건물 쪽 결정입니다.
        </p>
      </div>

      <CoolingTypeViz />

      <TermBreakdown
        title="네 가지 냉각 방식이 요구하는 것"
        description="카드 선택이 아니라 섀시와 전산실 조건을 함께 정합니다."
        items={[
          {
            term: "후면 배기형 송풍",
            description: "카드 안쪽 통로로 바람을 밀어 브래킷 밖으로 내보냅니다.",
            example: "여러 장을 붙여 꽂는 서버용 카드의 기본 방식입니다.",
            boundary: "압력 손실이 커 소음이 크고, 섀시 앞뒤 기류가 확보돼야 제 성능이 납니다.",
          },
          {
            term: "개방형 축류 팬",
            description: "카드 주변으로 바람을 흩뿌립니다. 조용하고 단일 카드 냉각에 효율적입니다.",
            example: "작업용 기기의 소비자용 카드가 대부분 이 방식입니다.",
            boundary: "배기가 섀시 안에 머물러 밀집 구성에서 안쪽 카드가 과열됩니다.",
          },
          {
            term: "직접 액체 냉각",
            description: "카드에 냉각판을 붙여 액체로 열을 빼냅니다. 공기로 못 버리는 전력을 처리합니다.",
            example: "높은 전력의 모듈형 가속기에서 표준에 가까워지고 있습니다.",
            boundary: "분배 장치·배관·누수 감지가 전산실에 있어야 합니다. 서버만 바꿔서는 불가능합니다.",
          },
          {
            term: "액침 냉각",
            description: "장비 전체를 비전도성 액체에 담급니다. 팬이 사라져 소음과 공조 부하가 줄어듭니다.",
            example: "고밀도 구성에서 검토되는 방식입니다.",
            boundary: "전용 탱크와 유지보수 절차가 필요하고 부품 호환성과 보증 조건을 따로 확인해야 합니다.",
          },
        ]}
      />

      <h3 id="airflow-direction" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        섀시 기류 방향이 랙 배치와 맞아야 합니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          전산실은 보통 찬 통로와 더운 통로를 나눠 배치합니다. 서버는 앞에서 찬 공기를 마시고 뒤로 더운 공기를
          내보내는 것을 전제로 설계돼 있습니다. 이 방향이 맞지 않는 장비가 하나 섞이면 그 장비가 더운 통로의
          공기를 마시고, 주변 장비의 흡기 온도까지 올립니다.
        </p>

        <p className="leading-7">
          확인할 것은 세 가지입니다. 흡기와 배기 방향, 흡기 허용 온도 등급, 그리고 필요한 앞뒤 여유 공간입니다.
          특히 여유 공간은 케이블과 문 때문에 도면보다 좁아지는 경우가 많아 실측이 필요합니다.
        </p>

        <p className="leading-7">
          기류가 어긋날 때 나타나는 증상은 뚜렷합니다. 랙 상단 장비의 흡기 온도가 하단보다 눈에 띄게 높거나,
          부하를 올릴 때 특정 장비만 성능이 떨어집니다. 랙 단위의 기류 설계와 경보 기준은{" "}
          <Link to="/cs/gpu/hw-power-cooling#cooling">전력과 냉각</Link>에서 다룹니다.
        </p>
      </div>
    </section>
  );
}
