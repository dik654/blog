import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import MemoryMappedGpioViz from "./mcu-memory-map-and-registers/viz/MemoryMappedGpioViz";

import NumericPath from "../world-systems/NumericPath";
import TeachCode from "./mcu-memory-map-and-registers/TeachCode";

export default function McuMemoryMapAndRegistersArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 프로그램의 한 번 쓰기가 칩 바깥의 신호를 바꿉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">작은 장치가 바깥 회로에 신호를 내보내려면 프로그램 안의 숫자와 칩의 연결점이 이어져야 합니다. 정한 주소로 값을 보내면 칩 안의 출력 회로가 그 값을 받아 상태를 바꿉니다.</p><p className="leading-7">
            RP2040 칩의 5번 출력 경로 하나를 따라가겠습니다. 어디에 쓰는지와 어떤 비트를 쓰는지를 나누고 준비·출력 허용·값 변경의 순서를 그립니다. 마지막에는 실제 Pico
            SDK 함수에 같은 번호를 넣어 어떤 쓰기가 일어나는지 확인합니다.
          </p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 주소와 값을 보내고 선택한 핀의 상태를 확인합니다</h2>
<NumericPath title="프로그램과 바깥 연결점 사이" steps={[{"label": "프로그램", "value": "주소·32비트 값", "detail": "주소로 동작을 고르고 값의 한 자리로 핀을 고릅니다."}, {"label": "칩 안의 제어 경로", "value": "저장한 출력 값·출력 허용", "detail": "높은 값을 저장하는 일과 밖으로 내보내는 일은 다릅니다."}, {"label": "칩의 연결점", "value": "외부 회로로 나가는 전압", "detail": "기능 선택과 전기 설정이 맞아야 합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">출력용으로 저장한 값이 바뀌었다는 사실과 실제 연결점의 전압이 바뀌었다는 사실은 따로 확인합니다. 표시등이 켜지는지는 배선과 극성, 전류 제한까지 알아야 합니다. 이 글은 먼저 한 출력 값을 낮음에서 높음으로 바꾸는 경로를 다룹니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 5번을 고르는 0x20을 정해진 주소에 씁니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">0부터 세는 번호 5만 고르려면 이진수에서 그 자리에 1을 둡니다. 값은 2⁵=32, 16진수로 0x20입니다. 칩의 GPIO 번호 5를 말하며 보드 커넥터의 물리적인 다섯 번째 핀을 뜻하지 않습니다.</p><p className="leading-7">이 칩에서 출력 값을 높이는 주소는 0xD0000014입니다. 기능과 출력 허용을 알맞게 준비한 뒤 이 주소에 0x20을 쓰면 5번에 저장한 출력 값이 1이 됩니다. 외부 회로 연결과 시작 상태는 설명용 <strong>가정</strong>입니다. 리셋 뒤 다른 기능이 이 핀을 구동하지 않는 초기 설정을 따라갑니다. 주소·비트 대응은 공식 자료에서 확인한 RP2040의 규칙입니다.</p><p className="leading-7">같은 0x20을 0xD0000018에 쓰면 선택한 출력 값이 0이 됩니다. 값 하나가 늘 같은 동작을 뜻하는 것은 아닙니다. 어느 주소에 보냈는지가 동작을 정합니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 저장할 값·핀 기능·출력 허용을 따로 준비합니다</h2>
<NumericPath title="한 핀을 높게 내보내기까지" steps={[{"label": "준비", "value": "출력을 잠시 끄기", "detail": "이 사례에서는 준비 중에 직접 구동하지 않습니다."}, {"label": "값과 경로", "value": "낮게 저장하고 제어 주체 선택", "detail": "프로그램이 쓰는 출력 경로를 이 핀에 연결합니다."}, {"label": "허용", "value": "출력 방향 켜기", "detail": "저장한 낮은 값을 실제로 내보냅니다."}, {"label": "변경", "value": "높게 저장하기", "detail": "0x20으로 선택한 자리만 1로 바꿉니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">출력을 껐다는 말은 연결점이 반드시 0 V라는 뜻이 아닙니다. 칩이 직접 밀고 당기는 동작을 멈춘 상태이므로 바깥 회로나 약한 당김 설정이 전압을 정할 수 있습니다. 준비가 끝난 뒤 내보낼 값을 낮게 정하는 단계와 구별합니다.</p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 어느 동작인지와 어느 핀인지 나누면 다른 출력을 유지할 수 있습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">핀마다 완전히 다른 명령을 만들기보다 같은 동작 주소에 여러 비트를 두면 한 쓰기로 선택한 출력들만 바꿀 수 있습니다. 이때 0으로 적은 비트를 낮추는지 그대로 두는지는 주소의 규칙이 결정합니다. 이번 높이기 주소에서는 0으로 쓴 자리는 유지합니다.</p><p className="leading-7">
            값만 저장하고 출력 허용을 따로 두는 이유도 있습니다. 같은 연결점을 입력으로 쓰거나 다른 칩 내부 기능에 맡길 수 있기 때문입니다. 저장된 값이 1이라는 사실만 보고 외부
            상태까지 같다고 판단하면 이 두 선택을 빠뜨립니다.
          </p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 주소로 찾는 장부와 출력 경로에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">장치 동작을 제어하거나 상태를 읽도록 정해 둔 저장 위치를 <strong>레지스터</strong>라고 합니다. 어떤 주소가 어떤 장치에 연결되는지 정한 표는 <strong>메모리 맵</strong>입니다. 선택한 비트 자리에만 1을 둔 값은 <strong>비트 마스크</strong>라고 부릅니다.</p><p className="leading-7">앞 그림의 범용 연결점은 GPIO입니다. 프로그램의 빠른 제어 블록은 SIO입니다. 값을 보관하는 부분은 출력 래치입니다. 아래 표에서 각 이름을 이미 본 역할과 맞춥니다.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞에서 본 역할</th><th className="p-3">이름</th></tr></thead><tbody><tr><td className="p-3">주소로 읽고 쓰는 제어·상태 저장 위치</td><td className="p-3">레지스터</td></tr><tr><td className="p-3">장치와 주소의 대응 표</td><td className="p-3">메모리 맵</td></tr><tr><td className="p-3">선택한 자리만 1인 값</td><td className="p-3">비트 마스크</td></tr><tr><td className="p-3">범용 외부 연결점</td><td className="p-3">GPIO</td></tr><tr><td className="p-3">프로그램의 빠른 제어 블록</td><td className="p-3">SIO</td></tr><tr><td className="p-3">내보낼 값을 보관하는 부분</td><td className="p-3">출력 래치</td></tr></tbody></table></div>
</section>

<section id="map" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. 기준 주소와 오프셋을 더해 동작 주소를 찾습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">RP2040 공식 표에서 SIO의 기준 주소는 <code>0xD0000000</code>입니다. 출력 비트를 세우는 <code>GPIO_OUT_SET</code>의 오프셋은 <code>0x014</code>이므로 주소는 <code>0xD0000014</code>입니다. 끄는 <code>GPIO_OUT_CLR</code>는 오프셋 <code>0x018</code>, 주소 <code>0xD0000018</code>입니다. 출력 방향을 켜는 <code>GPIO_OE_SET</code>는 <code>0xD0000024</code>입니다.</p>
   <p className="leading-7">이 주소의 값은 보통 RAM에 저장된 일반 변수와 의미가 다릅니다. <code>OUT_SET</code>에 쓴 1비트는 출력 래치의 해당 자리만 세우라는 명령이고, 0으로 쓴 자리는 건드리지 않습니다. 같은 32비트 쓰기라도 어느 주소인지에 따라 하드웨어 동작이 달라집니다.</p>
   <p className="leading-7"><em>주소는 어느 장치의 어느 동작인지, 값의 비트는 어느 핀인지 고릅니다.</em></p>
  </div><CitationBlock source="RP2040 Datasheet · build 3184e62-clean · §2.2·§2.3.1 주소 및 SIO 레지스터 표" citeKey={1} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">공식 데이터시트는 SIO 기준 주소와 GPIO_OUT_SET/CLR, GPIO_OE_SET 오프셋 및 원자적 비트 동작을 제시합니다. GPIO5의 외부 표시등은 본문 가정입니다.</CitationBlock>
</section>

<section id="mask" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. GPIO5의 같은 마스크를 SET·CLR에 적용합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">GPIO0은 비트 0, GPIO5는 비트 5에 대응합니다. 따라서 마스크 <code>1&lt;&lt;5</code>는 2⁵=32, 16진수로 <code>0x20</code>입니다. <code>0xD0000014</code>에 이 값을 쓰면 핀 5의 출력 래치가 1이 됩니다. <code>0xD0000018</code>에 쓰면 0이 됩니다. 다른 핀의 비트를 유지한 채 한 비트만 고르는 방식입니다.</p>
   <p className="leading-7">단순히 출력 주소를 알았다고 바로 핀이 구동되는 것은 아닙니다. 핀 선택기에서 GPIO5의 기능을 SIO로 정하고 출력 허용 비트도 켜야 합니다. 초기화에서는 먼저 출력 허용을 끄고 래치를 낮게 미리 놓은 뒤 기능을 선택합니다. 그다음 출력 방향을 켜고 필요한 시점에 SET을 씁니다. 출력이 꺼진 동안의 핀 전압은 외부 회로에도 좌우됩니다.</p>
   <p className="leading-7"><em>0x20은 주소가 아니라 GPIO5 자리에만 1이 있는 값입니다.</em></p>
  </div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">아래 그림은 SIO 기능이 이미 선택된 상태에서 값과 출력 허용만 바꿉니다. 10절의 SDK 초기화는 리셋 뒤의 준비 과정이므로 출력을 끄고 값을 낮춘 다음 SIO를 선택합니다. 두 시작 조건을 구분해 읽으세요.</p></div><MemoryMappedGpioViz /><ExplainedFormula question="GPIO5만 선택하는 32비트 값은 얼마입니까?" idea="0부터 세는 비트 번호 5를 왼쪽 이동으로 선택합니다." formula={String.raw`m=1\ll5`} annotatedFormula={String.raw`\underbrace{m}_{\text{핀 5 마스크}}=2^5`} operations={[{expression:String.raw`2^5=32`,annotation:"비트 5의 십진수 가중치입니다."},{expression:String.raw`32=0x20`,annotation:"16진수 두 자리로 쓰면 0x20입니다."}]} terms={[{symbol:"m",name:"GPIO5 비트 마스크",description:"출력 SET·CLR·OE_SET에서 핀 5를 선택합니다."}]} assumptions={["RP2040의 SIO GPIO0–29 비트 대응을 사용합니다.","기능 선택과 패드 전기 설정이 올바르게 끝났다고 둡니다."]} interpretation="GPIO5에 해당하는 마스크는 0x20입니다. 출력 주소와 방향 주소에 이 값을 씁니다." />
</section>

<section id="mux" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 핀의 기능 선택과 출력 허용은 별도로 맞춥니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">GPIO5의 기능 선택 레지스터는 IO_BANK0의 <code>GPIO5_CTRL</code>이고 주소는 기준 <code>0x40014000</code>에 오프셋 <code>0x02C</code>를 더한 <code>0x4001402C</code>입니다. SIO 기능을 선택한 뒤 출력 허용을 켜야 SIO 출력 래치가 핀에 영향을 줍니다. 실제 C 코드에서는 SDK의 <code>gpio_set_function</code>, <code>gpio_set_dir</code>가 이 설정을 수행합니다. 함수마다 바꾸는 비트가 다릅니다. 특히 기능 선택 함수는 기존 CTRL의 모든 비트를 보존하지 않으므로 아래 원문에서 그 범위를 확인하겠습니다.</p>
   <p className="leading-7">교육용으로 레지스터를 직접 쓴다면 <code>GPIO_OE_SET</code> 주소 <code>0xD0000024</code>에 <code>0x20</code>을 써서 출력 방향을 허용할 수 있습니다. 한 칩의 메모리 맵을 다른 MCU에 그대로 옮기면 주소와 비트 의미가 맞지 않습니다.</p>
   <p className="leading-7"><em>출력 데이터 1, 기능 선택 SIO, 출력 허용 1이 함께 맞아야 합니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, GPIO/IO_BANK0 레지스터 표, §2.19의 IO_BANK0 레지스터 표; Pico SDK Hardware GPIO API" citeKey={2} href="https://www.raspberrypi.com/documentation/pico-sdk/hardware.html">공식 데이터시트는 GPIO5_CTRL의 위치를, SDK는 핀 기능과 방향 설정 함수를 설명합니다. 본문 주소 계산은 RP2040에만 해당합니다.</CitationBlock>
</section>

<section id="source-init" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 실제 gpio_init(5)는 출력부터 끈 뒤 낮은 값을 준비합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">아래는 Pico SDK 2.2.0의 고정 commit a1438dff 원문입니다. gpio.c의 273–277행에 gpio=5를 넣어 읽으면 출력 방향을 입력으로 바꾼 뒤 gpio_put(5,0)으로 출력 래치를 낮춥니다. 마지막에 GPIO_FUNC_SIO를 선택합니다. 함수가 끝나도 출력 방향은 아직 입력입니다.</p></div><TeachCode codeKey="init" label="초기화 함수 실제 원문" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">같은 파일의 gpio_set_function은 패드 입력을 허용하고 패드의 출력 금지를 해제합니다. 그다음 GPIO5_CTRL에 기능 선택을 쓰며 다른 override 필드는 0으로 둡니다. 기존 강제 입력·출력 상태까지 보존한다고 가정하면 안 됩니다. 풀업·풀다운은 다른 패드 제어 필드이므로 이 CTRL 쓰기와 구분합니다.</p></div><TeachCode codeKey="select" label="기능 선택이 바꾸는 실제 비트" /><CitationBlock source="Raspberry Pi Pico SDK 2.2.0 · commit a1438dff" citeKey={3} href="https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/rp2_common/hardware_gpio/gpio.c">원본 gpio.c와 gpio.h 전체 및 LICENSE.TXT를 보존했습니다. 초기화·기능 선택·출력 쓰기의 실제 분기에 GPIO5를 대입합니다.</CitationBlock>
</section>

<section id="source-direction" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 출력 허용 함수도 같은 0x20을 계산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">gpio_set_dir(5,true)를 부르면 gpio.h의 RP2040 분기에서 mask=1ul&lt;&lt;5=0x20을 구합니다. out이 true이므로 gpio_set_dir_out_masked(mask)로 이어집니다. 같은 번호에서 같은 마스크가 나오는지 확인해 보세요.</p></div><TeachCode codeKey="direction" label="핀 번호에서 출력 방향 마스크로" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이어지는 원문은 RP2040에서 sio_hw의 gpio_oe_set 필드에 mask를 씁니다. 데이터시트에서 이 필드는 기준 0xD0000000에 오프셋 0x024를 더한 0xD0000024입니다. 이제 래치의 낮은 값이 출력으로 연결됩니다. 번호 5가 주소에 더해지는 것이 아니라 값의 비트 위치가 된다는 점을 확인합니다.</p></div><TeachCode codeKey="enableWrite" label="출력 허용 레지스터의 실제 쓰기" />
</section>

<section id="source-output" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. gpio_put(5,true)의 끝에서 주소에 0x20이 쓰입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">gpio_put의 원문에는 여러 칩에 대응하는 분기가 함께 있습니다. RP2040에서는 32개 이하 GPIO를 다루는 분기로 들어가 mask=1ul&lt;&lt;5를 계산합니다. value가 true이면 gpio_set_mask(0x20)을 호출합니다. 다른 칩의 분기는 하드웨어 구성에 따라 다른 경로를 사용합니다.</p></div><TeachCode codeKey="put" label="높은 값을 고르는 실제 분기" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            gpio_set_mask의 RP2040 경로는 sio_hw의 gpio_set 필드에 mask를 씁니다. 이것이 데이터시트의 GPIO_OUT_SET, 주소
            0xD0000014입니다. 데이터시트 표의 실제 동작은 GPIO_OUT |= wdata입니다. 전체 출력이 처음 0이라면 0|0x20=0x20이 됩니다. 나중에 CLR에
            0x20을 쓰면 그 자리만 0으로 돌아갑니다.
          </p><p className="leading-7">이 코드는 고정 원문을 읽어 같은 번호와 비트를 추적한 것입니다. 실제 보드에서 실행하거나 핀 전압을 측정한 결과를 제시한 것은 아닙니다. 보드 연결과 빌드 대상은 실행 전에 맞춰야 합니다.</p></div><TeachCode codeKey="setWrite" label="GPIO_OUT_SET에 도달한 실제 쓰기" />
</section>

<section id="race" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">13. 한 비트 쓰기는 충돌을 줄이지만 핀의 소유권까지 정하지 않습니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">다른 상황을 가정해 보겠습니다. 전체 출력 값이 0x01인데 두 코어가 동시에 이 값을 읽습니다. 하나는 5번을 세우려 0x21을 만들고 다른 하나는 6번을 세우려 0x41을 만듭니다. 전체 값을 덮어쓰면 나중 값이 먼저 세운 비트를 잃게 할 수 있습니다.</p><p className="leading-7">
            각 코어가 SET 주소에 0x20과 0x40만 쓰면 하드웨어가 선택한 자리만 바꾸므로 결과는 0x61입니다. 그러나 두 코어가 같은 5번을 서로 세우고 내리면 최종 결과는 쓰기
            순서에 좌우됩니다. 원자적 비트 변경이 어느 프로그램의 의도가 우선인지 결정해 주지는 않습니다.
          </p><p className="leading-7">또 SIO의 이 별도 SET·CLR 주소를 일반 주변 장치의 주소+0x2000·+0x3000 별칭 규칙과 혼동하면 안 됩니다. 데이터시트 §2.1.2는 SIO가 버스의 그 별칭 방식을 지원하지 않으며 개별 레지스터가 별도 SET·CLR 주소를 제공한다고 구분합니다.</p></div>
</section>

<section id="readback" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">14. 출력 래치를 읽는 것과 핀 입력을 읽는 것은 다릅니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7"><code>GPIO_OUT</code>를 읽으면 마지막에 설정한 출력 래치 값을 확인합니다. 실제 핀 입력을 샘플링하는 <code>GPIO_IN</code>은 별도 레지스터입니다. 외부 회로, 패드 설정, 핀 기능이 다르면 출력 래치가 1이어도 핀에서 예상한 전압을 보지 못할 수 있습니다. 주소에 쓰기만 성공했다고 장치가 실제로 반응했다고 결론 내리지 않습니다.</p>
   <p className="leading-7">SET·CLR 같은 별도 주소는 출력 레지스터를 읽고 값을 고쳐 다시 쓰는 동안 다른 코어가 같은 값을 바꾸는 충돌도 피하는 데 도움이 됩니다. RP2040의 두 코어가 함께 만지는 핀이라면 소유 규칙을 따로 정해야 합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> GPIO5 마스크는? (답: 8절) OUT_SET 주소는? (답: 7절) OUT 값이 1인데 핀에 전압이 없을 수 있는 까닭은? (답: 9·14절)</p>
   <p className="leading-7"><Link to="/electronics/semiconductors/yield-defect-and-packaging#package">앞 글에서 출하된 칩</Link>을 이제 펌웨어가 제어합니다. 다음에는 입력 신호가 들어왔을 때 CPU가 언제 대응하는지 셉니다.</p>
  </div>
</section>
</div>;
}
