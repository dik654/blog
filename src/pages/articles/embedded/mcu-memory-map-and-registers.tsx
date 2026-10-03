import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MemoryMappedGpioViz from "./mcu-memory-map-and-registers/viz/MemoryMappedGpioViz";

/** RP2040 SIO addresses from the Raspberry Pi datasheet; GPIO5 is an illustrative external pin. */
export default function McuMemoryMapAndRegistersArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">주소에 값을 쓰면 칩 바깥의 한 핀이 바뀝니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">작은 장치에 외부 표시등을 연결했다고 가정합니다. RP2040의 GPIO5를 높은 전압으로 내보내려면 프로그램은 어떤 특별한 ‘램프 명령’을 실행하지 않습니다. 정해진 주소의 레지스터에 <code>0x20</code>이라는 비트 마스크를 씁니다. 버스가 그 주소를 GPIO 하드웨어로 보내고, 하드웨어가 출력 상태를 바꿉니다.</p>
   <p className="leading-7">이 글은 실제 GPIO5에 무엇이 연결됐는지 가정하지 않습니다. LED가 켜지는 극성·전류 제한·보드 배선은 회로에 따라 다릅니다. 여기서는 ‘핀 5의 출력 래치를 0에서 1로 바꾸는 일’만 추적합니다.</p>
   <p className="leading-7"><em>메모리 맵은 CPU가 장치 레지스터를 주소로 찾아가는 약속입니다.</em></p>
  </div></section>
  <section id="map" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">주소는 기준 주소와 레지스터 오프셋을 더해 찾습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">RP2040 공식 표에서 SIO의 기준 주소는 <code>0xD0000000</code>입니다. 출력 비트를 세우는 <code>GPIO_OUT_SET</code>의 오프셋은 <code>0x014</code>이므로 주소는 <code>0xD0000014</code>입니다. 끄는 <code>GPIO_OUT_CLR</code>는 오프셋 <code>0x018</code>, 주소 <code>0xD0000018</code>입니다. 출력 방향을 켜는 <code>GPIO_OE_SET</code>는 <code>0xD0000024</code>입니다.</p>
   <p className="leading-7">이 주소의 값은 보통 RAM에 저장된 일반 변수와 의미가 다릅니다. <code>OUT_SET</code>에 쓴 1비트는 출력 래치의 해당 자리만 세우라는 명령이고, 0으로 쓴 자리는 건드리지 않습니다. 같은 32비트 쓰기라도 어느 주소인지에 따라 하드웨어 동작이 달라집니다.</p>
   <p className="leading-7"><em>주소는 어느 장치의 어느 동작인지, 값의 비트는 어느 핀인지 고릅니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, 2.2·2.3.1 및 SIO 레지스터 표, 원본 26·43·46쪽" citeKey={1} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">공식 데이터시트는 SIO 기준 주소와 GPIO_OUT_SET/CLR, GPIO_OE_SET 오프셋 및 원자적 비트 동작을 제시합니다. GPIO5의 외부 표시등은 본문 가정입니다.</CitationBlock></section>
  <section id="mask" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">GPIO5만 고르는 값은 0x20입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">GPIO0은 비트 0, GPIO5는 비트 5에 대응합니다. 따라서 마스크 <code>1&lt;&lt;5</code>는 2⁵=32, 16진수로 <code>0x20</code>입니다. <code>0xD0000014</code>에 이 값을 쓰면 핀 5의 출력 래치가 1이 됩니다. <code>0xD0000018</code>에 쓰면 0이 됩니다. 다른 핀의 비트를 유지한 채 한 비트만 고르는 방식입니다.</p>
   <p className="leading-7">단순히 출력 주소를 알았다고 바로 핀이 구동되는 것은 아닙니다. 핀 선택기에서 GPIO5의 기능을 SIO로 정하고 출력 허용 비트도 켜야 합니다. 시작할 때 원하지 않는 순간 펄스를 피하려면 출력 래치를 낮게 미리 놓고 기능과 방향을 설정한 뒤 필요한 시점에 SET을 씁니다.</p>
   <p className="leading-7"><em>0x20은 주소가 아니라 GPIO5 자리에만 1이 있는 값입니다.</em></p>
  </div><MemoryMappedGpioViz /><ExplainedFormula question="GPIO5만 선택하는 32비트 값은 얼마입니까?" idea="0부터 세는 비트 번호 5를 왼쪽 이동으로 선택합니다." formula={String.raw`m=1\ll5`} annotatedFormula={String.raw`\underbrace{m}_{\text{핀 5 마스크}}=2^5`} operations={[{expression:String.raw`2^5=32`,annotation:"비트 5의 십진수 가중치입니다."},{expression:String.raw`32=0x20`,annotation:"16진수 두 자리로 쓰면 0x20입니다."}]} terms={[{symbol:"m",name:"GPIO5 비트 마스크",description:"출력 SET·CLR·OE_SET에서 핀 5를 선택합니다."}]} assumptions={["RP2040의 SIO GPIO0–29 비트 대응을 사용합니다.","기능 선택과 패드 전기 설정이 올바르게 끝났다고 둡니다."]} interpretation="GPIO5에 해당하는 마스크는 0x20입니다. 출력 주소와 방향 주소에 이 값을 씁니다." /></section>
  <section id="mux" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">핀의 기능 선택과 출력 허용은 별도의 문입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">GPIO5의 기능 선택 레지스터는 IO_BANK0의 <code>GPIO5_CTRL</code>이고 주소는 기준 <code>0x40014000</code>에 오프셋 <code>0x02C</code>를 더한 <code>0x4001402C</code>입니다. SIO 기능을 선택한 뒤 출력 허용을 켜야 SIO 출력 래치가 핀에 영향을 줍니다. 실제 C 코드에서는 SDK의 <code>gpio_set_function</code>, <code>gpio_set_dir</code> 같은 함수를 쓰면 전체 제어 레지스터의 다른 비트를 실수로 덮기 쉽지 않습니다.</p>
   <p className="leading-7">교육용으로 레지스터를 직접 쓴다면 <code>GPIO_OE_SET</code> 주소 <code>0xD0000024</code>에 <code>0x20</code>을 써서 출력 방향을 허용할 수 있습니다. 한 칩의 메모리 맵을 다른 MCU에 그대로 옮기면 주소와 비트 의미가 맞지 않습니다.</p>
   <p className="leading-7"><em>출력 데이터 1, 기능 선택 SIO, 출력 허용 1이 함께 맞아야 합니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, GPIO/IO_BANK0 레지스터 표, 원본 245쪽; Pico SDK Hardware GPIO API" citeKey={2} href="https://www.raspberrypi.com/documentation/pico-sdk/hardware.html">공식 데이터시트는 GPIO5_CTRL의 위치를, SDK는 핀 기능과 방향 설정 함수를 설명합니다. 본문 주소 계산은 RP2040에만 해당합니다.</CitationBlock></section>
  <section id="readback" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">출력 래치를 읽는 것과 핀 전압을 읽는 것은 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7"><code>GPIO_OUT</code>를 읽으면 마지막에 설정한 출력 래치 값을 확인합니다. 실제 핀 입력을 샘플링하는 <code>GPIO_IN</code>은 별도 레지스터입니다. 외부 회로, 패드 설정, 핀 기능이 다르면 출력 래치가 1이어도 핀에서 예상한 전압을 보지 못할 수 있습니다. 주소에 쓰기만 성공했다고 장치가 실제로 반응했다고 결론 내리지 않습니다.</p>
   <p className="leading-7">SET·CLR 같은 별도 주소는 출력 레지스터를 읽고 값을 고쳐 다시 쓰는 동안 다른 코어가 같은 값을 바꾸는 충돌도 피하는 데 도움이 됩니다. RP2040의 두 코어가 함께 만지는 핀이라면 소유 규칙을 따로 정해야 합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> GPIO5 마스크는? (답: 3절) OUT_SET 주소는? (답: 2절) OUT 값이 1인데 핀에 전압이 없을 수 있는 까닭은? (답: 4·5절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/yield-defect-and-packaging#package">앞 글에서 출하된 칩</Link>을 이제 펌웨어가 제어합니다. 다음에는 입력 신호가 들어왔을 때 CPU가 언제 대응하는지 셉니다.</p>
  </div></section>
 </div>;
}
