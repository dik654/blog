import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        48GB가 두 장이어도 96GB짜리 한 장이 되지는 않는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          공개된 48GB RTX 4090 개조 사례는 커스텀 PCB에 같은 2GB GDDR6X 칩을 두 배로 실어 용량을 늘린다. 두 장이면
          물리적으로 48GB씩 총 96GB를 갖지만, 한 GPU가 다른 GPU의 메모리를 자기 메모리처럼 공짜로 읽는 96GB 단일 장치는
          아니다. 모델을 나누는 순간 토큰이나 activation이 GPU 경계를 넘어야 한다.
        </p>
        <ContentBoundary article="modded-rtx4090-moe-serving" />
        <p className="leading-7">
          RTX 4090에는 NVLink 커넥터가 없고 CUDA P2P도 지원되지 않는다. 따라서 31.5GB/s라는 PCIe Gen4 x16 편도
          raw rate가 곧 GPU 간 실효 대역폭이라는 뜻도 아니다. 실제 collective는 호스트 메모리를 거칠 수 있으므로 경로와
          goodput을 먼저 측정해야 한다.
        </p>
        <p className="leading-7">
          MoE의 expert parallel은 라우팅 결과에 따라 dispatch와 combine all-to-all을 critical path에 추가한다. 그래서
          이 경로의 영향을 직접 받는다. 다만 모든 MoE가 모든 dense TP보다 항상 더 많은 바이트를 보낸다는 뜻은 아니다.
        </p>
        <p className="leading-7">
          이 글은 세 가지를 순서대로 다룬다. 먼저 48GB 개조가 실제로 무엇을 바꾸고 무엇을 안 바꾸는지 회로 수준에서 확인한다. 다음으로
          NVLink가 있는 카드(RTX 3090)와 없는 카드(RTX 4090), 그리고 데이터센터 시스템(A100·H100)의 명목 인터페이스를
          구분해 비교한다. 마지막으로 expert 배치, 통신 정밀도, overlap, 병렬화 전략을 어떤 순서로 A/B 검증할지 정리한다.
        </p>
        <p className="leading-7">
          상용 서빙이라면 그 전에 GeForce 드라이버 라이선스도 확인한다. 이 라이선스는 데이터센터 배포와 상업 호스팅을 허락하지 않으므로 이 글의 측정은 개인 연구나 사내 실험처럼 그 조항 밖의 용도를 전제로 한다. 판정 순서 맨 앞에 이 단계를 두는 이유는 마지막 절에서 다룬다.
        </p>
        <p className="leading-7">
          카드 자체의 세대별 스펙 비교는{" "}
          <a href="/cs/gpu/hw-gpu-comparison">GPU 비교 글</a>이, PCIe·NVLink의 raw bandwidth 공식은{" "}
          <a href="/cs/gpu/gpu-interconnects">GPU interconnect 글</a>이, MoE의 VRAM·decode bandwidth
          tradeoff는 <a href="/cs/ai/model-vram-budgeting">model VRAM budgeting 글</a>이 이미 소유한다.
          이 글은 그 세 글을 잇는 "48GB 개조 4090으로 MoE를 서빙한다면" 이라는 구체적 질문 하나에 집중하고, 겹치는 정의는 다시 쓰지
          않고 링크로 재사용한다.
        </p>
      </div>
      <div className="not-prose">
        <OverviewViz />
      </div>
    </section>
  );
}
