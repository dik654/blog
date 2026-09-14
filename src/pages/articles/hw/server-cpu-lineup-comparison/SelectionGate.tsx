import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import GateViz from "./viz/GateViz";

const SNAPSHOT = [
  { tier: "서버 계열 (2소켓)", lanes: "소켓당 128레인 수준", channels: "12채널", note: "가속기 8장 + NIC + NVMe 구성의 기준" },
  { tier: "워크스테이션 계열", lanes: "128레인 수준", channels: "8채널", note: "단일 소켓, 가속기 2~4장 작업 기기" },
  { tier: "고성능 데스크톱 계열", lanes: "48레인 수준", channels: "4~8채널", note: "가속기 1~2장. 8장 구성에는 예산 부족" },
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
          계산 순서는 네 단계입니다. 가속기 수와 종류로 레인 요구를 정하고, 네트워크와 저장장치를 더하고,
          데이터 공급 경로에 필요한 메모리 대역폭을 가늠한 뒤, 운영 요구에서 관리·이중화 기능을 확인합니다.
          여기까지 하면 후보 계열이 하나나 둘로 좁혀집니다.
        </p>
      </div>

      <div className="not-prose my-6 overflow-x-auto">
        <table className="w-full min-w-[680px] border border-border text-sm">
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
      </div>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-sm leading-6 text-muted-foreground">
          기준일 2026-09-11. 계열별 대표값이며 같은 계열 안에서도 모델에 따라 다릅니다. 구체적인 레인·채널 수는
          해당 세대의 공식 제품 사양과 메인보드 문서를 함께 확인해야 합니다.
        </p>

        <p className="leading-7">
          표에서 읽어야 할 것은 개별 숫자가 아니라 계열 사이의 간격입니다. 데스크톱 계열과 서버 계열의 레인
          차이가 두 배를 넘고, 이 차이가 곧 붙일 수 있는 가속기 수를 정합니다. 코어 수는 이 간격과 거의 무관하게
          겹쳐 있어서 선택 기준이 되기 어렵습니다.
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
        source="AMD · Intel 공개 프로세서 사양 (2026-09-11 확인)"
        citeKey={1}
        href="https://www.amd.com/en/products/processors/server/epyc.html"
      >
        계열별 레인·채널 대표값은 각 제조사의 공개 제품 사양에서 가져왔습니다. 세대마다 값이 바뀌고 같은 계열
        안에서도 모델별로 다르므로 기준일과 함께 읽어야 하며, 이 표로 제품 성능을 비교하지 않습니다.
      </CitationBlock>
    </section>
  );
}
