import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        스위치를 없애면 fabric의 일을 직접 맡는다
      </h2>
      <div className="not-prose mb-8">
        <OverviewViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DGX B300의 ConnectX-8 포트를 노드끼리 direct attach하면 소규모 GPU
          cluster를 switch 없이 구성할 수 있다. 다만 단순히 switch 가격을 빼는
          구성이 아니다. Switch가 맡던 path selection·subnet 연결·장애
          우회·telemetry를 host 설정과 운영 절차가 직접 책임지는 설계다.
        </p>
        <ContentBoundary article="b300-switchless-network" />
        <p className="leading-7">
          이 글은 Ethernet mode의 RoCE v2를 사용한다. RDMA의 기본 데이터 경로와
          InfiniBand 비교는 <a href="/gpu/hw-network">서버 네트워크 글</a>에서
          소유하고, 여기서는 B300 port mapping·direct topology·NCCL GID 선택만
          다룬다.
        </p>
        <h3
          id="decision-boundary"
          className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold"
        >
          먼저 “가능한가”와 “운영할 만한가”를 나눈다
        </h3>
        <p className="leading-7">
          이 구성은 node 수와 cable 배치가 자주 바뀌지 않고, 한 link가 끊겼을 때
          영향을 받는 peer pair를 운영자가 바로 식별할 수 있는 실험 cluster에
          잘 맞는다. 반대로 tenant가 많거나 topology 변경·자동 우회·vendor
          support가 중요하다면 switched fabric이 더 단순하다. 따라서 아래
          단계는 최고 bandwidth를 증명하는 절차가 아니라, 제한된 조건에서
          switchless를 채택해도 되는지 확인하는 acceptance path다.
        </p>
        <div className="not-prose my-6">
          <PipelineViz />
        </div>
      </div>
    </section>
  );
}
