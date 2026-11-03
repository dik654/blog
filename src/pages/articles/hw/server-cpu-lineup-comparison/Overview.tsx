import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import RoleViz from "./viz/RoleViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">가속기 서버의 CPU는 코어 수 하나로 고를 수 없습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          한 문장 답부터 말하면, GPU 여러 장을 쓰는 노드의 CPU는 <strong>장치 레인 예산, 메모리 공급 능력,
          호스트 전처리량, NUMA 경로, 운영 비용</strong>을 한꺼번에 만족하는 플랫폼으로 골라야 합니다. GPU가
          행렬 연산을 맡더라도 CPU는 데이터를 읽고 전처리하며 GPU·NIC·저장장치가 쓸 길을 냅니다. 따라서 코어
          수만 큰 제품을 고르면 GPU가 기다리거나 장치를 제 폭으로 연결하지 못할 수 있습니다.
        </p>

        <p className="leading-7">
          이 글에서는 같은 가상 노드를 끝까지 따라갑니다. GPU 8장에 고속 NIC 2장, NVMe 4개를 모두 직접
          연결하면 <strong>128 + 32 + 16 = 176레인</strong>이 필요합니다. 채널 수는 메모리 대역폭과 최대
          용량을 정하고, NUMA 배치는 그 데이터가 어느 소켓을 거쳐 GPU에 도착하는지를 정합니다.
        </p>

        <p className="leading-7">
          여기서 바로 꼬리 질문이 생깁니다. 176이 128보다 크면 CPU를 두 개 사면 끝일까요? 그렇지 않습니다.
          2소켓에서는 CPU 간 연결이 일부 I/O 경로를 쓰고, 장치와 메모리가 두 NUMA 영역으로 갈립니다. PCIe
          스위치로 장치를 묶을 수도 있지만 동시 전송 때 상위 링크를 나눠 씁니다. 그래서 제품 이름보다 보드의
          실제 블록도와 워크로드 경로가 먼저입니다.
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
