import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import AnycastViz from "./viz/AnycastViz";

export default function AnycastRouting() {
  return (
    <section id="anycast-routing" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 주소를 여러 곳에서 광고하면 경로 자체가 장애 조치가 됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          애니캐스트는 같은 IP 주소를 세계 여러 지점에서 동시에 광고하는 방식입니다. 요청을 보낸 쪽은 주소 하나만 알고 그 요청이 어느 지점에 도착할지는 인터넷의 경로 선택이 정합니다.
          대개 네트워크상으로 가장 가까운 지점이 받습니다.
        </p>

        <p className="leading-7">
          이 구조는 장애 조치가 별도 절차 없이 일어난다는 게 장점입니다. 한 지점이 광고를 멈추면 그 지점으로 가던 경로가 사라지고 다음 순간부터 그 트래픽은 남은 지점 중 하나로
          흘러갑니다. 새 주소를 알려 줄 필요도, 클라이언트가 재시도할 필요도 없습니다.
        </p>

        <p className="leading-7">
          한 지점이 실제로 받는 트래픽의 출처 집합을 캐치먼트라고 부릅니다. 캐치먼트는 지도상 거리로 정해지지 않고 경로 정책으로 정해집니다. 그래서 지점 하나를 빼면 그 캐치먼트가 통째로
          옆 지점에 얹히고 옆 지점의 여유 용량이 그만큼 필요해집니다.
        </p>

        <p className="leading-7">
          이름 조회 기반 장애 조치와 비교하면 차이가 분명합니다. 이름으로 다른 주소를 주는 방식은 조회 결과가 캐시에 남아 있는 동안 옛 주소로 계속 가지만 애니캐스트는 캐시와 무관하게
          경로가 바뀌는 즉시 옮겨집니다.
        </p>
      </div>

      <AnycastViz />

      <h3 id="catchment-flip" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        경로가 흔들리면 연결이 끊깁니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          같은 성질이 반대로도 작동합니다. 경로가 바뀌면 트래픽이 옮겨 가는데, 이미 연결이 맺어진 상태에서 옮겨 가면 새 지점에는 그 연결의 상태가 없습니다. 받는 쪽은 모르는 연결이므로
          거절하고 보낸 쪽은 연결이 끊긴 것을 봅니다.
        </p>

        <p className="leading-7">
          이 현상이 얼마나 흔한지는 측정된 적이 있습니다. 약 9,000개 관측 지점에서 11개 애니캐스트 서비스를
          본 연구에서, 관측 지점과 서비스 조합의 약 1%가 자주 다른 지점에 도달하는 불안정 상태였습니다. 연결
          지향 프로토콜에서 실제로 지점이 갈리는 경우는 훨씬 드물어 약 0.15%의 조합에서 관찰됐습니다.
        </p>

        <p className="leading-7">
          더 중요한 발견은 이 불안정이 일시적이지 않다는 점입니다. 불안정한 조합의 80%가 일주일 넘게 그 상태를 유지했고 일부 관측 지점은 8개월 뒤에도 같은 서비스에 대해
          불안정했습니다. 즉 평균적으로는 안정적인 방식이지만 특정 사용자에게는 지속적으로 나쁩니다.
        </p>

        <p className="leading-7">
          그래서 애니캐스트만으로 연결 안정성을 보장한다고 말할 수는 없습니다. 실무에서는 짧은 요청을 기본으로 두고 오래 유지되는 연결이 필요한 경우에는 재연결이 값싸도록 설계하거나 지점
          고정이 가능한 별도 주소를 둡니다.
        </p>
      </div>

      <CitationBlock
        source="Lan Wei · John Heidemann — Does Anycast Hang Up on You (UDP and TCP)? (IEEE TNSM 15(2), 2018)"
        citeKey={1}
        href="https://ant.isi.edu/~johnh/PAPERS/Wei18a.pdf"
      >
        약 9,000개 관측 지점과 11개 루트 DNS 애니캐스트 서비스 조합을 측정해 약 1%가 불안정하고, 연결 지향
        프로토콜에서의 지점 전환은 약 0.15% 조합에서 관찰되며, 불안정 조합의 80%가 일주일 이상 지속된다는
        결과입니다. 측정 대상이 루트 DNS 배치라는 점에서 상용 CDN의 분포와 같다고 볼 수는 없고, 이 수치는
        "드물지만 특정 위치에는 지속적으로 나쁘다"는 성질을 보이는 근거로만 씁니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          같은 애니캐스트 성질이 공격 방어에서는 다르게 쓰입니다. 트래픽이 한 지점에 몰리지 않게 만드는 용도로
          쓰이는 쪽은{" "}
          <Link to="/saas/edge-request-defense-pipeline#packet-layer">엣지 요청 방어</Link>가 다룹니다.
        </p>
      </div>
    </section>
  );
}
