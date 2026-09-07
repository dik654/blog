import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import CapacityModViz from "./viz/CapacityModViz";

export default function CapacityMod() {
  return (
    <section id="capacity-mod" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        48GB 개조는 칩을 더 촘촘한 걸로 바꾸는 것이지 버스를 넓히는 게 아니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="stock-clamshell" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          정품 24GB부터 이미 clamshell 구조다
        </h3>
        <p className="leading-7">
          RTX 4090은 384-bit 메모리 버스를 12개의 32-bit 채널로 나눠 쓴다. 정품 구성은 1GB(8Gbit) 밀도의 GDDR6X 칩 24개를 PCB
          앞면 12개·뒷면 12개로 나눠 배치하는 clamshell 방식이다. 채널 하나가 앞뒤 칩 두 개를 공유해서 12channel × 2GB(칩 2개)로
          24GB를 채운다. 즉 개조 이전에도 메모리는 이미 보드 양면에 실려 있다.
        </p>
        <p className="leading-7">
          개조 업체가 하는 일은 이 24개 칩을 1GB 밀도에서 2GB(16Gbit) 밀도 제품으로 통째로 교체하는 것이다. 채널 수·클럭·데이터
          경로는 그대로 두고 칩 하나가 담는 용량만 두 배로 올린다. 그 결과 12channel × 2GB(칩) × 2(clamshell) = 48GB가 된다.
          버스 폭도, 채널 수도, 핀 배치도 바뀌지 않는다.
        </p>

        <h3 id="bandwidth-unchanged" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          대역폭 공식엔 밀도 항이 없다
        </h3>
        <p className="leading-7">
          GDDR6X의 유효 대역폭은 <code>핀 speed(Gbps) × 버스 폭(bit) ÷ 8</code>로 정해진다. 정품 4090의 21Gbps 핀 speed와
          384-bit 버스를 넣으면 21 × 384 ÷ 8 ≈ 1,008GB/s가 나온다. 이 식 어디에도 칩 밀도(1GB냐 2GB냐)는 들어가지 않는다.
          밀도는 용량을 정하고, 핀 speed와 버스 폭은 대역폭을 정한다. 두 축이 독립이라서 48GB 개조 카드의 이론 대역폭도 여전히
          약 1,008GB/s다.
        </p>
        <p className="leading-7">
          그래서 이 개조가 푸는 문제와 못 푸는 문제가 갈린다. Weight 상주 여부(들어가느냐 안 들어가느냐)는 용량 문제라서 개조로
          풀린다. 반면 decode 단계에서 그 weight를 매 스텝 읽어 오는 속도는 대역폭 문제라서 개조 전후가 동일하다. VRAM
          budgeting에서 known floor를 넘겼을 때의 대응은{" "}
          <a href="/ai/model-vram-budgeting#multi-gpu-vram-strategies">이미 다룬 글</a>을 그대로 재사용하면 된다 — 이 개조는
          그 floor 자체를 한 장에서 더 높게 잡아 주는 선택지 하나가 늘어난 것뿐이다.
        </p>

        <h3 id="mod-risk" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          공식 지원이 없는 영역에서 대가를 치른다
        </h3>
        <p className="leading-7">
          NVIDIA는 이 개조를 검증하지도, 지원하지도 않는다. 메모리 트레이닝 파라미터(타이밍·전압)를 새 vBIOS가 다시 잡아야 하고 이 값이 칩 로트마다 최적이 아닐 수 있다.
          드라이버는 정품 4090의 24GB 구성만 공식 검증됐고 48GB 인식 자체가 개조된 vBIOS의 커스텀 VRAM descriptor에 의존한다. 워런티는 당연히 소멸하고 드라이버
          업데이트가 커스텀 vBIOS와 충돌해도 NVIDIA 지원 채널에 문의할 수 없다.
        </p>
      </div>

      <div className="not-prose">
        <CapacityModViz />
      </div>

      <TermBreakdown
        title="24GB와 48GB 4090이 실제로 다른 지점"
        description="같은 버스에 다른 밀도의 칩을 얹었을 때 바뀌는 것과 안 바뀌는 것을 나눈다."
        items={[
          {
            term: "메모리 용량",
            description: "1GB 칩 24개(24GB) → 2GB 칩 24개(48GB)로, 칩 개수는 그대로 두고 칩당 용량만 두 배.",
            example: "MoE weight 전체가 한 장에 상주할 여지가 커진다.",
            boundary: "용량 문제(들어가느냐)만 풀고 대역폭 문제(빨리 읽느냐)는 그대로 남긴다.",
          },
          {
            term: "메모리 대역폭",
            description: "핀 speed 21Gbps × 384-bit 버스 ÷ 8 ≈ 1,008GB/s로 개조 전후 동일한 공식값.",
            example: "Decode 1 step에 필요한 weight read 시간은 개조 전후가 같다.",
            boundary: "채널 수·핀 speed가 바뀌지 않는 한 밀도 교체만으로는 대역폭이 늘지 않는다.",
          },
          {
            term: "인터커넥트",
            description: "GPU 사이의 통신 경로는 이 개조와 무관한 완전히 다른 회로(PCIe slot·lane).",
            example: "48GB 개조 카드도 정품 4090과 동일하게 PCIe Gen4 x16만 사용한다.",
            boundary: "메모리 칩 교체가 보드의 NVLink 핀을 새로 만들어 주지는 않는다.",
          },
          {
            term: "검증·지원 범위",
            description: "커스텀 vBIOS의 메모리 트레이닝 값과 드라이버 호환성은 NVIDIA 공식 검증 밖.",
            example: "로트마다 안정성이 다를 수 있고 워런티가 없다.",
            boundary: "이 글은 이 개조를 권장하지 않으며 존재하는 실물 구성으로만 다룬다.",
          },
        ]}
      />

      <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
        <p className="font-semibold mb-1">💡 용량과 대역폭은 서로 다른 두 축</p>
        <p className="text-sm leading-6">
          "VRAM이 늘었다"는 문장이 가리키는 게 용량인지 대역폭인지 항상 구분해야 한다. 이 개조는 전자만 바꾼다.
          <br />
          MoE serving에서 용량 부족(못 올림)과 대역폭 부족(느리게 돎)은 완전히 다른 증상이고 다른 해법이 필요하다.
        </p>
      </div>

      <CitationBlock
        source="Samsung/Micron GDDR6X 데이터시트 · JEDEC GDDR6X 관련 공개 자료"
        citeKey={1}
        href="https://www.jedec.org/standards-documents/docs/jesd250d"
      >
        GDDR6X의 유효 대역폭이 핀 speed와 버스 폭의 곱으로 정해지고 칩 밀도 항이 별도로 존재한다는 사실은 JEDEC 계열 GDDR 표준
        문서와 제조사 데이터시트에서 확인할 수 있다. 이 글은 그 공식을 4090의 공개 스펙(384-bit·21Gbps)에 대입한 결과만 사용한다.
      </CitationBlock>
    </section>
  );
}
