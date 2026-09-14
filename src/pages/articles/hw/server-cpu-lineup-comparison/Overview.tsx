import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import RoleViz from "./viz/RoleViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">가속기 서버에서 CPU는 연산보다 통로를 담당합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          GPU 여러 장을 꽂는 서버에서 CPU를 고를 때 코어 수부터 보는 경우가 많습니다. 그런데 이런 서버에서
          CPU가 실제로 하는 일은 행렬 연산이 아니라 데이터를 읽어 오고, 전처리하고, 장치들을 잇는 통로를
          제공하는 것입니다. 그래서 고르는 기준도 코어 수가 아니라 레인과 채널이 됩니다.
        </p>

        <p className="leading-7">
          레인은 확장 장치를 몇 개나 제 속도로 붙일 수 있는지를 정합니다. 가속기 여덟 장에 고속 네트워크
          카드와 NVMe 저장장치까지 붙이면 필요한 레인이 금방 백 개를 넘습니다. 채널은 메모리 대역폭과 최대
          용량을 정하고, 이 값이 데이터 로딩 속도의 상한이 됩니다.
        </p>

        <p className="leading-7">
          제품군이 갈리는 지점도 여기입니다. 같은 회사의 CPU라도 서버용과 워크스테이션용은 레인 수와 채널 수,
          그리고 소켓 수가 다르게 설계돼 있습니다. 이 차이가 "같은 코어 수인데 왜 저건 두 배 비싼가"에 대한
          답이기도 합니다.
        </p>

        <ContentBoundary article="server-cpu-lineup-comparison" />

        <p className="leading-7">
          순서는 이렇습니다. 레인 예산을 먼저 계산하고, 메모리 채널이 무엇을 정하는지 본 뒤, 코어의 성격 차이와
          배치 문제를 봅니다. 이어서 서버·워크스테이션·고성능 데스크톱의 경계, 마지막으로 판단 순서와 기준일을
          박은 스냅샷으로 마무리합니다.
        </p>

        <p className="leading-7">
          메모리 채널과 ECC의 원리 자체는 <Link to="/cs/gpu/hw-memory">메모리</Link>가, PCIe 대역폭 공식과
          토폴로지는 <Link to="/cs/gpu/gpu-interconnects">GPU 인터커넥트</Link>가 소유합니다. 이 글은 그 값들을
          가속기 서버의 CPU 선택 문제에 적용하는 부분만 다룹니다.
        </p>
      </div>

      <RoleViz />
    </section>
  );
}
