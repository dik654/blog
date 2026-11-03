import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        스위치를 빼면 경로 선택과 장애 지도를 직접 맡습니다
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 글의 고정 사례는 B300 노드 여덟 대를 서로 직접 잇는 완전연결망입니다.
          노드 쌍마다 800G 물리 케이블 하나를 놓고, split 뒤 두 400G 논리
          링크로 사용합니다. 스위치가 맡던 상대 발견·경로 선택·장애 우회를
          케이블 원장, host 설정과 운영 절차가 직접 책임집니다.
        </p>
        <ContentBoundary article="b300-switchless-network" />
        <p className="leading-7">
          이 글은 Ethernet mode의 RoCE v2를 사용합니다. RDMA의 기본 데이터 경로와
          InfiniBand 비교는 <a href="/cs/gpu/hw-network">서버 네트워크 글</a>에서
          소유하고, 여기서는 B300 port mapping·direct topology·NCCL GID 선택만
          다룹니다.
        </p>
        <p className="leading-7">
          NVIDIA의 일반 B300 생산 참조 아키텍처는 Spectrum-X를 사용한
          switched fabric입니다. 여기서 다루는 switchless는 공개 project를 바탕으로
          검토하는 소규모·정적 실험망이며 공식 대체 구성으로 일반화하지 않습니다.
        </p>
        <h3
          id="decision-boundary"
          className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold"
        >
          먼저 “연결되는가”와 “운영할 만한가”를 나눕니다
        </h3>
        <p className="leading-7">
          이 구성은 노드 수와 케이블 배치가 자주 바뀌지 않고, 한 링크가 끊겼을 때
          영향을 받는 peer pair를 운영자가 바로 식별할 수 있는 실험 cluster에
          한정합니다. Tenant가 많거나 topology 변경·자동 우회·표준 vendor support가
          중요하면 switched fabric이 더 단순합니다. 아래 경로는 최고 bandwidth를
          주장하는 절차가 아니라 제한된 조건에서 채택할 수 있는지 확인하는
          acceptance path입니다.
        </p>
        <div className="not-prose my-6">
          <PipelineViz />
        </div>
      </div>
    </section>
  );
}
