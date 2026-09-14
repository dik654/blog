import ContentBoundary from "@/components/articles/content-boundary";
import OverviewViz from "./viz/OverviewViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        VRAM을 두 배로 늘려도 GPU 사이의 링크는 그대로다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          중국 개조 업체들이 RTX 4090의 GDDR6X 칩을 2GB 밀도 제품으로 교체하고 vBIOS를 다시 구워 24GB를 48GB로 두 배 늘린 카드를 만들어 팔고 있다. 가격은
          워크스테이션·데이터센터 카드보다 훨씬 싸고 용량만 보면 매력적이다. 그런데 이 카드 두 장을 붙여 MoE(Mixture of Experts) 모델을 서빙하려고 하면 용량 문제는
          풀렸는데 다른 병목이 바로 드러난다. GPU와 GPU 사이를 잇는 링크가 여전히 PCIe뿐이라는 점이다.
        </p>
        <ContentBoundary article="modded-rtx4090-moe-serving" />
        <p className="leading-7">
          RTX 4090은 Ada Lovelace 세대부터 소비자용 라인업에서 빠진 NVLink를 애초에 갖고 있지 않다. 개조로 늘어난 건 메모리 용량뿐이고,
          카드 사이의 통신 경로는 그대로다. 반면 MoE는 dense 모델보다 GPU 사이 통신에 더 예민한 구조다. Top-k 라우팅으로 토큰을 여러
          expert에 흩뿌리고 다시 모으는 all-to-all 통신이 매 MoE layer마다 발생하기 때문이다. 용량은 넉넉해졌는데 그 용량을 나눠 쓸 통로가
          가장 좁은 조합이 만들어지는 셈이다.
        </p>
        <p className="leading-7">
          이 글은 세 가지를 순서대로 다룬다. 먼저 48GB 개조가 실제로 무엇을 바꾸고 무엇을 안 바꾸는지 회로 수준에서 확인한다. 다음으로
          NVLink가 있는 카드(RTX 3090)와 없는 카드(RTX 4090), 그리고 데이터센터 카드(A100·H100)의 GPU 간 대역폭을 같은 공식으로
          정량 비교한다. 마지막으로 그 격차를 소프트웨어 엔지니어링(expert 배치, quantization, batching, 병렬화 전략 선택)으로 얼마나
          메울 수 있고 어디서부터는 메울 수 없는지를 판단 기준으로 정리한다.
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
