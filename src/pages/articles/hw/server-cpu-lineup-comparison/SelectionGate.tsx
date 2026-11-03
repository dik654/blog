import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import GateViz from "./viz/GateViz";

const SNAPSHOT = [
  {
    tier: "EPYC 9005 · 1소켓",
    lanes: "최대 128 PCIe 5.0",
    channels: "12채널",
    note: "서버 운영 기능은 실제 보드·섀시에서 확인",
  },
  {
    tier: "Threadripper PRO 9000 WX · WRX90",
    lanes: "144 사용 가능 · 최대 128 Gen 5",
    channels: "8채널",
    note: "단일 소켓 다중 GPU 워크스테이션 예시",
  },
  {
    tier: "Threadripper 9000 · TRX50",
    lanes: "88 사용 가능 · 최대 80 Gen 5",
    channels: "4채널",
    note: "같은 sTR5라도 PRO 플랫폼과 예산이 다름",
  },
];

export default function SelectionGate() {
  return (
    <section id="selection-gate" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">구성표를 먼저 적고 그다음에 제품을 고릅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          순서를 뒤집지 않는 것이 핵심입니다. 붙일 장치를 먼저 적고 레인과 채널 예산을 계산한 뒤, 그 예산을
          만족하는 계열에서 제품을 고릅니다. 반대로 제품을 먼저 고르면 슬롯이 모자라거나 대역폭이 나오지 않는
          것을 조립 단계에서 알게 됩니다.
        </p>

        <p className="leading-7">
          계산 순서는 여섯 단계입니다. 장치 목록과 레인 예산, 메모리 요구, 호스트 작업과 NUMA를 먼저 적습니다.
          그다음 전력·냉각·섀시 한계를 확인하고, 마지막에 소프트웨어 라이선스와 원격 관리·이중화 비용을 더합니다.
          코어당 또는 소켓당 과금하는 소프트웨어라면 CPU를 하나 늘리는 결정이 구매가보다 더 비쌀 수도 있습니다.
        </p>
      </div>

      <div className="not-prose my-6">
        <table className="hidden w-full border border-border text-sm md:table">
          <thead>
            <tr className="bg-muted/50">
              {["계열", "PCIe 레인", "메모리 채널", "맞는 구성"].map((h) => (
                <th key={h} className="border border-border px-3 py-2 text-left font-semibold">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SNAPSHOT.map((r) => (
              <tr key={r.tier}>
                <td className="border border-border px-3 py-2 font-medium">{r.tier}</td>
                <td className="border border-border px-3 py-2">{r.lanes}</td>
                <td className="border border-border px-3 py-2">{r.channels}</td>
                <td className="border border-border px-3 py-2 text-muted-foreground">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="grid gap-3 md:hidden">
          {SNAPSHOT.map((row) => (
            <article key={row.tier} className="min-w-0 border border-border bg-card p-4">
              <h3 className="break-keep text-sm font-bold leading-6">{row.tier}</h3>
              <dl className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm leading-6">
                <dt className="font-semibold text-muted-foreground">PCIe 레인</dt>
                <dd className="min-w-0 break-words">{row.lanes}</dd>
                <dt className="font-semibold text-muted-foreground">메모리</dt>
                <dd>{row.channels}</dd>
                <dt className="font-semibold text-muted-foreground">읽는 법</dt>
                <dd className="min-w-0 break-words text-muted-foreground">{row.note}</dd>
              </dl>
            </article>
          ))}
        </div>
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-sm leading-6 text-muted-foreground">
          기준일 2026-11-02. 위 표는 추상적인 계열 평균이 아니라 공식 문서에서 확인한 세 가지 구체적 플랫폼
          예시입니다. 실제 슬롯 폭과 슬롯끼리의 공유 조건은 CPU 숫자만으로 확정되지 않으므로 메인보드 블록도와
          슬롯 장착표를 함께 확인해야 합니다.
        </p>

        <p className="leading-7">
          이 표의 결론은 “서버 CPU가 항상 정답”이 아닙니다. 176레인 사례는 세 플랫폼 모두 직접 연결 예산이
          모자라므로, 2소켓·PCIe 스위치·장치 폭 축소·장치 수 축소 가운데 하나를 택해야 합니다. 반대로 필요한
          장치가 80레인 안쪽이라면 더 작은 플랫폼이 전력·가격·NUMA 복잡성에서 유리할 수 있습니다.
        </p>
      </div>

      <GateViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          마지막으로 이 글이 주장하지 않는 것을 적습니다. 특정 제품의 성능 우열을 비교하지 않았고, 벤치마크
          수치도 넣지 않았습니다. 같은 계열 안에서의 선택은 워크로드로 직접 재야 하고, 이 글은 그 이전 단계인
          계열 판정만 다뤘습니다.
        </p>

        <p className="leading-7">
          가속기 자체를 고르는 축은{" "}
          <Link to="/cs/gpu/ai-accelerator-vendor-comparison">가속기 벤더 비교</Link>에서, 그 구성이 요구하는 전력과
          냉각은 <Link to="/cs/gpu/hw-power-cooling">전력과 냉각</Link>에서 이어집니다. 세 글을 함께 보면 노드 하나의
          설계가 닫힙니다.
        </p>
      </div>

      <CitationBlock
        source="AMD EPYC 9005 Architecture Overview (2026-11-02 확인)"
        citeKey={1}
        href="https://www.amd.com/en/products/processors/server/epyc.html"
      >
        EPYC 9005의 1소켓 최대 128 PCIe 레인·12개 메모리 채널과, 2소켓에서 xGMI 링크 수에 따라 외부 PCIe가
        일반적으로 128개 또는 최대 160개가 되는 경계를 확인했습니다.
      </CitationBlock>
      <CitationBlock
        source="AMD Ryzen Threadripper 9000 Platform Specifications (2026-11-02 확인)"
        citeKey={2}
        href="https://www.amd.com/en/products/processors/workstations/ryzen-threadripper.html"
      >
        WRX90은 144개 사용 가능 레인·최대 128개 PCIe 5.0·8채널 메모리, TRX50은 88개 사용 가능 레인·최대
        80개 PCIe 5.0·4채널 메모리를 제공한다는 공식 플랫폼 표를 확인했습니다.
      </CitationBlock>
    </section>
  );
}
