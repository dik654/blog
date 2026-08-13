import ConsumerViz from "./viz/ConsumerViz";

const specs = [
  {
    gpu: "RTX 4090 FE",
    arch: "Ada Lovelace",
    cores: "16,384",
    vram: "24GB GDDR6X",
    bus: "384-bit",
    bandwidth: "1,008GB/s",
    tgp: "450W",
    system: "850W",
  },
  {
    gpu: "RTX 5090 FE",
    arch: "Blackwell",
    cores: "21,760",
    vram: "32GB GDDR7",
    bus: "512-bit",
    bandwidth: "1,792GB/s",
    tgp: "575W",
    system: "1,000W",
  },
];

export default function Consumer() {
  return (
    <section id="consumer" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">컨슈머 GPU — RTX 4090과 5090</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          두 GPU의 가장 실용적인 차이는{" "}
          <strong>VRAM 8GB 증가와 메모리 경로 확장</strong>
          <br />
          5090은 32GB GDDR7과 512-bit 버스로 1,792GB/s의 이론 대역폭을 제공하고,
          4090은 24GB GDDR6X와 384-bit 버스로 1,008GB/s 제공
        </p>
      </div>

      <div className="not-prose my-7">
        <ConsumerViz />
      </div>

      <div className="overflow-x-auto not-prose mb-6">
        <table className="min-w-[780px] w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted/50">
              {[
                "GPU",
                "아키텍처",
                "CUDA 코어",
                "VRAM",
                "버스",
                "이론 대역폭",
                "TGP",
                "권장 시스템 전력",
              ].map((heading) => (
                <th
                  key={heading}
                  className="border border-border px-3 py-2 text-left"
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {specs.map((gpu) => (
              <tr key={gpu.gpu}>
                <td className="border border-border px-3 py-2 font-semibold">
                  {gpu.gpu}
                </td>
                <td className="border border-border px-3 py-2">{gpu.arch}</td>
                <td className="border border-border px-3 py-2 tabular-nums">
                  {gpu.cores}
                </td>
                <td className="border border-border px-3 py-2">{gpu.vram}</td>
                <td className="border border-border px-3 py-2">{gpu.bus}</td>
                <td className="border border-border px-3 py-2 tabular-nums">
                  {gpu.bandwidth}
                </td>
                <td className="border border-border px-3 py-2 tabular-nums">
                  {gpu.tgp}
                </td>
                <td className="border border-border px-3 py-2 tabular-nums">
                  {gpu.system}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-foreground/60">
          Founders Edition 기준. 제조사 카드의 크기·전력 한도·냉각 구조는 달라질
          수 있음.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          용량이 24GB를 넘는 작업이라면 5090이 단순히 더 빠른 카드가 아니라{" "}
          <strong>호스트 spill을 피할 수 있는 후보</strong>가 됨<br />
          반대로 작업 집합이 충분히 작고 커널이 대역폭을 소진하지 못한다면 사양
          차이가 종단 시간에 그대로 반영되지 않음
        </p>
        <p className="leading-7">
          다중 GPU에서는 두 카드 모두 NVLink를 제공하지 않으므로 VRAM이 자동
          결합되지 않음
          <br />
          독립 작업을 카드별로 배치하는 수평 확장은 단순하지만, 하나의 작업을
          나누려면 데이터 분할·PCIe 전송·합산 비용을 애플리케이션이 감당
        </p>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 가격 대신 총 시스템 비용</p>
          <p className="text-sm leading-6">
            GPU 판매가는 시점과 지역에 따라 크게 변함.
            <br />
            실제 비교에서는 카드 가격에 PSU·섀시·팬·전력 회로·냉각 여유와 장애
            교체 비용을 더해 판단
          </p>
        </div>
      </div>
    </section>
  );
}
