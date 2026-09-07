import { CitationBlock } from "@/components/ui/citation-block";
import NvlinkGapQuantifiedViz from "./viz/NvlinkGapQuantifiedViz";

const SPECS = [
  {
    gpu: "RTX 4090 (24GB/48GB 개조)",
    link: "PCIe Gen4 x16만",
    raw: "≈31.5GB/s 편도 · ≈63GB/s duplex 합",
    topology: "GPU 2장이면 root complex 아래 peer-to-peer, 그 이상은 PCIe switch 경유",
  },
  {
    gpu: "RTX 3090 (24GB, Ampere)",
    link: "PCIe Gen4 x16 + NVLink bridge 1개",
    raw: "NVLink 112.5GB/s 집계 + PCIe ≈63GB/s duplex",
    topology: "2-way 전용, bridge 폭이 정해 둔 고정 pair만 연결",
  },
  {
    gpu: "A100 (SXM, 3rd-gen NVLink)",
    link: "NVLink 12 link + NVSwitch",
    raw: "NVLink 600GB/s 집계",
    topology: "NVSwitch로 8-way full mesh, 어떤 pair도 같은 대역폭",
  },
  {
    gpu: "H100 (SXM, 4th-gen NVLink)",
    link: "NVLink 18 link + NVSwitch",
    raw: "NVLink 900GB/s 집계",
    topology: "NVSwitch로 8-way full mesh, 어떤 pair도 같은 대역폭",
  },
];

export default function NvlinkGapQuantified() {
  return (
    <section id="nvlink-gap-quantified" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        4090은 3090보다도, A100·H100보다도 GPU 간 대역폭이 한 자릿수 낮다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="4090-has-no-pins" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          4090엔 NVLink 핀 자체가 없다
        </h3>
        <p className="leading-7">
          NVIDIA는 Ada Lovelace 세대부터 GeForce 라인업에서 NVLink 핑거(카드 위 golden finger 커넥터)를 아예 뺐다. 전 세대인 Ampere의 RTX
          3090·3090 Ti까지는 있던 것이 4090부터 사라졌다. 이건 드라이버가 막아 둔 기능이 아니라 PCB 자체에 커넥터가 없는 물리적 제약이다. 개조로도 되돌릴 수 없다.
          48GB 메모리 개조는 GDDR6X 칩을 교체하는 작업이라 이 제약과는 완전히 무관한 회로를 건드리고 개조 후에도 카드 사이 통신 경로는 PCIe 하나뿐이다.
        </p>
        <p className="leading-7">
          그래서 "4090에 NVLink가 있었다면"이라는 가정은 실물로 존재하지 않는다. 대신 이 절에서는 같은 세대 상하위 제품(3090)과
          같은 워크로드를 도는 데이터센터 제품(A100·H100)을 대조군으로 놓고, PCIe만 있을 때와 NVLink가 있을 때의 격차를
          공식으로 계산한다.
        </p>

        <h3 id="pcie-only-ceiling" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          4090의 상한은 PCIe Gen4 x16의 raw rate
        </h3>
        <p className="leading-7">
          <a href="/gpu/gpu-interconnects#pcie-transaction-bandwidth-latency">PCIe raw bandwidth 공식</a>{" "}
          <code>R_GT/s × L × 128/130 ÷ 8</code>에 4090의 PCIe Gen4 x16(16GT/s, 16 lane)을 넣으면 16 × 16 ×
          128/130 ÷ 8 ≈ 31.5GB/s 편도가 나온다. 두 방향을 동시에 쓰는 duplex 합으로도 약 63GB/s다. 이 숫자는 protocol
          overhead를 뺀 raw 상한이라 실제 collective 통신에서 관측되는 goodput은 이보다 더 낮다.
        </p>

        <h3 id="3090-nvlink-baseline" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          3090과 비교하면: 같은 소비자 카드인데 왜 빨랐는가
        </h3>
        <p className="leading-7">
          RTX 3090은 2-way 전용 NVLink bridge로 GPU 한 쌍을 직결할 수 있고 공식 스펙은 112.5GB/s 집계 대역폭이다. PCIe Gen4 x16 duplex
          63GB/s와 비교하면 약 1.8배다. 다만 3090의 NVLink는 GeForce SLI bridge 커넥터를 통해 제공되는 제한된 형태라 8-way 이상으로는 확장되지 않고
          실제 딥러닝 프레임워크에서 peer-to-peer 활용은 커뮤니티 벤치마크로 검증된 수준이지 데이터센터 제품처럼 벤더가 collective library 최적화를 보장하는 경로는
          아니다.
        </p>
        <p className="leading-7">
          그래도 "NVLink가 있으면 무엇이 달라지는가"를 보여 주는 가장 가까운 대조군이다. 4090이 3090의 다음 세대인데도
          이 지점에서는 오히려 퇴보한 셈이다 — 연산 성능은 올랐지만 GPU 간 통신 상한은 PCIe 하나로 줄었다.
        </p>

        <h3 id="datacenter-nvswitch-baseline" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          데이터센터 카드와 비교하면: 격차는 한 자릿수 이상
        </h3>
        <p className="leading-7">
          A100(3rd-gen NVLink)은 600GB/s, H100(4th-gen NVLink)은 900GB/s 집계 대역폭을 NVSwitch로 8장 전체에 동일하게
          제공한다. 4090의 PCIe duplex 63GB/s와 비교하면 A100은 약 9.5배, H100은 약 14.3배다. 게다가 NVSwitch는 임의의
          두 GPU 쌍이 항상 같은 대역폭으로 통신하는 full mesh라서, 몇 번 GPU와 몇 번 GPU를 붙이느냐에 따라 성능이 갈리지
          않는다. 반면 PCIe만 있는 구성은 GPU가 같은 root complex 아래 있는지, PCIe switch를 몇 단 거치는지에 따라 실제
          achievable bandwidth가 달라진다 — 이 topology 의존성은{" "}
          <a href="/gpu/gpu-interconnects#pcie-topology-peer-path">PCIe topology 글</a>에서 다룬 내용 그대로다.
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-[760px] w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/50">
                {["GPU", "GPU 간 링크", "Raw bandwidth", "Topology 성격"].map((heading) => (
                  <th key={heading} className="border border-border px-3 py-2 text-left">
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SPECS.map((row) => (
                <tr key={row.gpu}>
                  <td className="border border-border px-3 py-2 font-medium">{row.gpu}</td>
                  <td className="border border-border px-3 py-2">{row.link}</td>
                  <td className="border border-border px-3 py-2">{row.raw}</td>
                  <td className="border border-border px-3 py-2">{row.topology}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground leading-6">
          Raw bandwidth는 protocol overhead를 뺀 이론 상한이며 achieved collective bandwidth(algbw·busbw)는 이보다
          낮다. 실제 배포 판단에는 이 표 대신 자신의 topology·NCCL 버전으로 측정한 값을 써야 한다.
        </p>
      </div>

      <div className="not-prose">
        <NvlinkGapQuantifiedViz />
      </div>

      <CitationBlock
        source="NVIDIA · GeForce RTX 30 Series NVLink Bridge 스펙 / NVIDIA A100·H100 제품 스펙시트"
        citeKey={2}
        href="https://www.nvidia.com/en-us/data-center/nvlink/"
      >
        3090 NVLink 112.5GB/s, A100 NVLink 600GB/s, H100 NVLink 900GB/s는 모두 NVIDIA 공식 제품 스펙에 실린 집계
        대역폭이다. PCIe Gen4 x16 raw rate는 PCI-SIG 규격의 16GT/s·128b/130b 인코딩 값을 그대로 대입한 계산값이고, 실측이
        아니다.
      </CitationBlock>
    </section>
  );
}
