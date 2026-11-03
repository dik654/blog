import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import CapacityModViz from "./viz/CapacityModViz";

export default function CapacityMod() {
  return (
    <section id="capacity-mod" data-calculation-explained className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">48GB가 되는 이유는 칩 밀도 교체가 아니라 칩 수 증가다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 id="stock-vs-clamshell" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          정품은 12칩, 흔히 보고된 개조 보드는 24칩이다
        </h3>
        <p className="leading-7">
          RTX 4090의 384-bit 메모리 인터페이스는 32-bit 채널 12개로 볼 수 있다. 공개된 16Gbit ×32 GDDR6X
          부품은 칩 하나가 2GB다. 따라서 정품 24GB 구성은 <code>12채널 × 2GB = 24GB</code>, 즉 채널마다
          칩 하나씩 총 12개를 쓰는 구성이 맞다. 정품이 1GB 칩 24개를 앞뒤에 붙인 clamshell이라는 이전 설명은
          잘못이었다.
        </p>
        <p className="leading-7">
          공개된 48GB 개조 사례는 정품 PCB에서 칩만 바꾸는 작업이 아니다. AD102와 부품을 clamshell 배선을 지원하는
          별도 PCB로 옮기고, 같은 2GB 칩을 앞면 12개와 뒷면 12개에 채운다. 채널마다 두 칩이 데이터 경로를 나눠 쓰므로
          <code>12채널 × 2칩 × 2GB = 48GB</code>가 된다. 다만 개조 업체마다 PCB와 펌웨어 구현은 다를 수 있으므로,
          모든 48GB 카드가 같은 방식이라고 일반화하면 안 된다.
        </p>

        <h3 id="bandwidth-unchanged" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          칩 수가 늘어도 버스 폭과 핀 속도가 같으면 대역폭은 그대로다
        </h3>
        <p className="leading-7">
          메모리 대역폭은 <code>핀 속도(Gb/s) × 버스 폭(bit) ÷ 8</code>로 계산한다. 4090의 공개 사양인
          21Gb/s와 384-bit를 넣으면 <code>21 × 384 = 8,064Gb/s</code>, 다시 8bit/byte로 나눠
          <code>8,064 ÷ 8 = 1,008GB/s</code>가 된다. 이 식에는 칩 개수도, 칩 하나가 저장하는 용량도 없다.
        </p>
        <p className="leading-7">
          따라서 48GB 카드가 정품과 같은 21Gb/s 메모리 속도를 안정적으로 유지한다면 명목상 대역폭도 약
          1,008GB/s다. 하지만 비공식 보드가 실제로 그 속도와 오류율을 유지하는지는 카드별 실측 대상이다. 용량이
          48GB로 인식된다는 사실만으로 정품과 같은 메모리 성능이 검증되는 것은 아니다.
        </p>
        <p className="leading-7">
          이 구분이 실전 판단을 바꾼다. 모델 가중치가 한 장에 들어가지 않는 문제는 48GB가 풀 수 있다. 반면 decode 때
          가중치를 읽는 속도는 메모리 대역폭 문제라 용량 증가만으로 빨라지지 않는다. VRAM 예산 계산은{" "}
          <a href="/cs/ai/model-vram-budgeting#multi-gpu-vram-strategies">모델 VRAM 예산 글</a>을 그대로 쓰되,
          실제 카드의 메모리 오류와 처리량을 별도로 통과시켜야 한다.
        </p>

        <h3 id="mod-risk" className="mt-6 mb-3 scroll-mt-24 text-xl font-semibold">
          커스텀 PCB와 펌웨어는 NVIDIA 검증 범위 밖이다
        </h3>
        <p className="leading-7">
          이 카드는 NVIDIA가 판매하거나 검증한 48GB 4090 제품이 아니다. 커스텀 PCB, 부품 이식, 메모리 초기화 방식과
          펌웨어가 판매자별로 다를 수 있고 공식 워런티와 지원 경로도 없다. 특정 vBIOS descriptor나 타이밍 방식이 모든
          개조 카드에 공통이라고 단정하지 말고, 카드별로 장시간 메모리 검사·클럭 유지·온도·Xid 오류·드라이버 업데이트
          후 재검증을 해야 한다.
        </p>
      </div>

      <div className="not-prose"><CapacityModViz /></div>

      <TermBreakdown
        title="정품 24GB와 흔한 48GB 개조 사례가 다른 지점"
        description="칩 밀도, 칩 수, 버스 폭을 따로 세면 무엇이 바뀌는지 보인다."
        items={[
          { term: "정품 24GB", description: "2GB(16Gbit ×32) 칩 12개를 12개 채널에 하나씩 연결한다.", example: "12채널 × 1칩 × 2GB = 24GB.", boundary: "정품 PCB가 이미 24칩 clamshell이라는 뜻이 아니다." },
          { term: "48GB clamshell 보드", description: "채널마다 앞뒤 2GB 칩 두 개가 경로를 나눠 써 총 24칩을 담는다.", example: "12채널 × 2칩 × 2GB = 48GB.", boundary: "공개된 대표 사례의 구조이며 모든 판매자 구현을 보증하지 않는다." },
          { term: "메모리 대역폭", description: "핀 속도 21Gb/s × 384-bit ÷ 8 = 약 1,008GB/s라는 명목값.", example: "칩이 12개에서 24개로 늘어도 버스 폭은 384-bit로 유지된다.", boundary: "개조 카드가 같은 속도와 오류율을 유지하는지는 실측해야 한다." },
          { term: "공식 지원 범위", description: "커스텀 PCB·펌웨어·부품 이식은 NVIDIA의 제품 검증과 워런티 밖이다.", example: "드라이버 업데이트 뒤에도 메모리 검사와 장시간 serving을 다시 통과시킨다.", boundary: "48GB 인식 성공은 장기 안정성 검증과 같지 않다." },
        ]}
      />

      <div className="not-prose my-6 rounded-r-lg border-l-4 border-amber-400 bg-amber-50/60 p-4 dark:bg-amber-950/20">
        <p className="mb-1 font-semibold">💡 한 문장 답</p>
        <p className="text-sm leading-6">흔히 보고된 48GB 4090은 같은 밀도의 칩을 두 배로 싣는 커스텀 보드다. 저장 공간은 두 배가 되지만 384-bit 버스와 명목 메모리 대역폭, GPU 간 링크는 넓어지지 않는다.</p>
      </div>

      <CitationBlock source="NVIDIA Ada GPU Architecture · Micron GDDR6X part catalog" citeKey={1} href="https://images.nvidia.com/aem-dam/Solutions/Data-Center/l4/nvidia-ada-gpu-architecture-whitepaper-v2.1.pdf">
        NVIDIA는 RTX 4090의 24GB GDDR6X·384-bit·21Gb/s·1,008GB/s 사양을 공개한다. Micron의 MT61K512M32KPA-21:U는 16Gbit ×32, 즉 칩당 2GB 부품이다. 두 자료를 함께 보면 정품 용량은 12채널 × 2GB로 계산된다.
      </CitationBlock>
      <CitationBlock source="GamersNexus · Creating a 48GB NVIDIA RTX 4090 GPU" citeKey={2} href="https://www.youtube.com/watch?v=TcRGBeOENLg">
        커스텀 PCB에 AD102와 부품을 이식하고 앞뒤로 메모리를 채우는 48GB 제작 과정은 현장 영상으로 확인했다. 이는 대표적인 실물 사례이지 NVIDIA의 공식 제품 사양이나 모든 판매자의 품질 보증은 아니다.
      </CitationBlock>
    </section>
  );
}
