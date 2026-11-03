import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import GateViz from "./viz/GateViz";

const SNAPSHOT = [
  {
    name: "NVIDIA HGX B300",
    boundary: "OEM·자체 랙 / cloud",
    memory: "GPU당 288GB HBM3e · 최대 8TB/s",
    scale: "8-GPU HGX · NVLink 5 / NVSwitch",
    fixedCase: "용량 후보 · 약 268.2GiB nominal",
    status: "지역·OEM BOM과 납기 확인",
  },
  {
    name: "AMD Instinct MI455X · Helios",
    boundary: "통합 rack-scale system",
    memory: "GPU당 432GB HBM4 · 23.3TB/s",
    scale: "UALink · 장치당 최대 3.6TB/s scale-up",
    fixedCase: "용량 후보 · runtime 실행 필요",
    status: "2026 H2 초기 출하 · 견적 확인",
  },
  {
    name: "Intel Gaudi 3",
    boundary: "OEM server / cloud",
    memory: "가속기당 128GB HBM2e · 3.7TB/s",
    scale: "장치당 24×200GbE",
    fixedCase: "한 장 경로 탈락",
    status: "정확한 OAM·PCIe 구성 확인",
  },
  {
    name: "Google Cloud TPU7x Ironwood",
    boundary: "Google Cloud service",
    memory: "chip당 192GiB HBM · 7.38TB/s",
    scale: "ICI 1.2TB/s bidirectional · 3D topology",
    fixedCase: "한 chip 경로 탈락",
    status: "GA · region·quota 확인",
  },
  {
    name: "AWS Trainium3 · Trn3 UltraServer",
    boundary: "AWS EC2 service",
    memory: "chip당 144GB HBM3e · 4.9TB/s",
    scale: "NeuronSwitch-v1 · chip당 2TB/s NeuronLink",
    fixedCase: "한 chip 경로 탈락",
    status: "region·instance quota 확인",
  },
] as const;

export default function SnapshotGate() {
  return (
    <section id="snapshot-gate" className="scroll-mt-20">
      <h2 className="mb-6 break-keep text-2xl font-bold">
        2026년 스냅샷은 순위표가 아니라 실행 후보를 거르는 출발점입니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          아래 값은 2026년 11월 2일 공식 문서에서 확인한 대표 system·service의
          per-accelerator 수치입니다. Rack 전체 합계와 chip 한 개 수치를 섞지 않았습니다.
          이 표만으로 성능 우열을 정하지 않고, 고정한 70B 사례가 한 장에 들어갈 가능성과
          실제 조달 경계를 먼저 가릅니다.
        </p>
        <p className="leading-7">
          앞에서 계산한 210.4GiB는 runtime 여유를 넣기 전 최소선입니다. 따라서
          192GiB·144GB·128GB 후보는 한 장 경로에서 탈락합니다. 288GB와 432GB 후보도
          “합격”이 아니라 실행 시험으로 넘어갈 뿐입니다. Decimal 288GB는 약 268.2GiB라
          allocator·workspace·fragmentation에 남는 폭이 표의 차이보다 작습니다.
        </p>
      </div>

      <div className="not-prose my-7 space-y-3 md:hidden">
        {SNAPSHOT.map((row) => (
          <article key={row.name} className="rounded-xl border border-border bg-card p-4">
            <h3 className="break-keep text-sm font-bold text-foreground">{row.name}</h3>
            <dl className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-xs leading-5">
              <dt className="font-semibold text-muted-foreground">배치 경계</dt><dd>{row.boundary}</dd>
              <dt className="font-semibold text-muted-foreground">HBM</dt><dd>{row.memory}</dd>
              <dt className="font-semibold text-muted-foreground">Scale-up</dt><dd>{row.scale}</dd>
              <dt className="font-semibold text-muted-foreground">70B 사례</dt><dd>{row.fixedCase}</dd>
              <dt className="font-semibold text-muted-foreground">현재 관문</dt><dd>{row.status}</dd>
            </dl>
          </article>
        ))}
      </div>

      <div className="not-prose my-7 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[980px] border-collapse border border-border text-xs leading-5">
          <thead>
            <tr className="bg-muted/50 text-left">
              {['대표 system·service', '배치 경계', 'Per accelerator HBM', 'Scale-up 경로', '70B 사례', '현재 관문'].map((heading) => (
                <th key={heading} className="border border-border px-3 py-3 font-semibold">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SNAPSHOT.map((row) => (
              <tr key={row.name} className="align-top">
                <td className="border border-border px-3 py-3 font-semibold">{row.name}</td>
                <td className="border border-border px-3 py-3">{row.boundary}</td>
                <td className="border border-border px-3 py-3">{row.memory}</td>
                <td className="border border-border px-3 py-3">{row.scale}</td>
                <td className="border border-border px-3 py-3">{row.fixedCase}</td>
                <td className="border border-border px-3 py-3 text-muted-foreground">{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm leading-6 text-muted-foreground">
        기준일 2026-11-02. “GA·출하·제품 page 존재”와 필요한 region·계정·수량의
        capacity 확보는 다른 사실입니다. TPU8i는 공식 TPU page가 이 기준일에도
        coming soon으로 안내하므로 현재 production 후보 표에는 넣지 않았습니다.
      </p>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <h3 className="break-keep">최종 선택은 다섯 관문을 같은 순서로 통과시킵니다</h3>
        <ol className="leading-7">
          <li><strong>배치 가능성:</strong> 자체 랙 BOM 또는 cloud region·quota를 실제로 확보할 수 있는가?</li>
          <li><strong>Memory:</strong> Weight·KV·workspace가 usable HBM에 여유를 두고 들어가는가?</li>
          <li><strong>기능·품질:</strong> 동일 artifact와 serving 기능이 fallback 없이 정확도 gate를 통과하는가?</li>
          <li><strong>요청 성능:</strong> 같은 profile에서 p95 TTFT·TPOT·throughput·error가 목표를 만족하는가?</li>
          <li><strong>운영 비용:</strong> 전력·냉각·cloud 요금·이식·cold start·장애 복구를 포함한 단위 요청 비용이 맞는가?</li>
        </ol>
        <p className="leading-7">
          이 순서의 목적은 최고 제품 하나를 선언하는 것이 아닙니다. 자체 데이터센터의
          기본 용량에는 운영 가능한 system을, burst에는 실제 quota가 있는 cloud service를
          고를 수 있게 비교 단위를 맞추는 것입니다. 최종 benchmark 설계는{" "}
          <Link to="/cs/ai/serving-benchmark-methodology">같은 조건에서 직접 재는 방법</Link>으로
          이어집니다.
        </p>
      </div>

      <CitationBlock
        source="NVIDIA Enterprise Reference Architecture · HGX B300 components"
        citeKey={1}
        href="https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html"
      >
        B300 GPU당 288GB HBM3e, 최대 8TB/s, HGX 8-GPU 구성과 NVLink·NVSwitch 수치를 확인했습니다.
      </CitationBlock>
      <CitationBlock
        source="AMD Instinct MI400 series · MI455X"
        citeKey={2}
        href="https://www.amd.com/en/products/accelerators/instinct/mi400.html"
      >
        MI455X GPU당 432GB HBM4, 23.3TB/s와 UALink scale-up 정보를 확인했습니다. 실제 공급 일정은 별도 견적 관문으로 남겼습니다.
      </CitationBlock>
      <CitationBlock
        source="Intel Gaudi 3 AI accelerator"
        citeKey={3}
        href="https://www.intel.com/content/www/us/en/products/details/processors/ai-accelerators/gaudi.html"
      >
        Gaudi 3의 128GB HBM2e, 3.7TB/s와 OAM·PCIe 형태의 공식 제품 범위를 확인했습니다.
      </CitationBlock>
      <CitationBlock
        source="Google Cloud · TPU7x Ironwood"
        citeKey={4}
        href="https://docs.cloud.google.com/tpu/docs/tpu7x"
      >
        TPU7x chip당 192GiB HBM, 7.38TB/s, 1.2TB/s bidirectional ICI와 Cloud TPU 지원 범위를 확인했습니다.
      </CitationBlock>
      <CitationBlock
        source="AWS EC2 Trn3 instances"
        citeKey={5}
        href="https://aws.amazon.com/ec2/instance-types/trn3/"
      >
        Trainium3 chip당 144GB HBM3e, 4.9TB/s, NeuronSwitch-v1과 NeuronLink 수치를 확인했습니다.
      </CitationBlock>
    </section>
  );
}
