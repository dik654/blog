import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InterruptLatencyViz from "./interrupts-and-latency-budget/viz/InterruptLatencyViz";

import NumericPath from "../world-systems/NumericPath";
import TeachCode from "./mcu-memory-map-and-registers/TeachCode";

export default function InterruptsAndLatencyBudgetArticle() {
return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">1. 센서가 알린 때부터 값을 쓸 수 있는 때까지 셉니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">센서가 새 값을 준비했다는 신호를 보냈습니다. 프로그램은 그 순간 다른 일을 하고 있을 수 있습니다. 입력만 계속 읽는 대신 칩이 변화를 기록하고 처리할 일을 알리게 하면 다른 작업도 진행할 수 있습니다.</p><p className="leading-7">하지만 알려 주는 기능이 있다는 이유만으로 제시간에 끝나는 것은 아닙니다. 신호가 들어온 뒤 접수하고 센서에서 실제 값을 읽어 계산할 때까지 같은 사건 하나를 따라가겠습니다. 뒤에서 실제 SDK가 상태를 지우고 콜백을 부르는 순서도 확인합니다.</p></div>
</section>

<section id="outside" data-teach-level="B" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">2. 입력 변화가 읽을 작업으로 이어지고 마감 전에 끝나야 합니다</h2>
<NumericPath title="한 번의 데이터 준비 신호" steps={[{"label": "입력", "value": "GPIO2가 낮음에서 높음으로", "detail": "가상의 센서가 준비를 알립니다."}, {"label": "처리", "value": "접수하고 읽을 작업을 깨우기", "detail": "입력 변화의 기록과 실제 센서 읽기는 다른 단계입니다."}, {"label": "출력", "value": "센서 값을 읽어 계산 완료", "detail": "입력 이후 1 ms 안에 사용할 수 있어야 합니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">이 예는 한 사건을 처리하는 경로입니다. 센서가 값을 읽을 때까지 보관하고 겹치는 사건은 별도 규칙으로 관리한다고 가정합니다. 사건이 매우 자주 들어올 때 모두 세는 문제는 마지막에 따로 확인합니다.</p></div>
</section>

<section id="case" data-teach-level="0" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">3. 일곱 구간을 더하면 493 µs입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">시간은 전부 설명용 <strong>가정</strong>입니다. 입력 변화를 검출하는 데 5 µs, 다른 일 때문에 기다리는 데 40 µs, 처리 함수로 진입하는 데 8 µs, 사건을 접수하는 데 20 µs가 듭니다. 이 지점은 처음 신호에서 73 µs 뒤입니다.</p><p className="leading-7">읽을 작업을 깨우는 데 40 µs를 더 쓰고 센서와의 거래에 300 µs, 받은 값의 계산에 80 µs를 씁니다. 끝나는 시점은 493 µs입니다. 1 ms=1000 µs의 마감까지 507 µs가 남습니다. 일곱 구간은 겹치지 않는 시간 구간의 상한으로 가정했습니다.</p></div>
</section>

<section id="picture" data-teach-level="1" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">4. 사건 기록과 처리 대기 기록은 서로 다른 곳에 있습니다</h2>
<NumericPath title="같은 입력을 두 기록으로 넘기기" steps={[{"label": "핀 쪽", "value": "변화가 있었다는 비트", "detail": "입력이 다시 낮아져도 사건이 남을 수 있습니다."}, {"label": "처리 순서를 고르는 쪽", "value": "처리할 요청이 있음", "detail": "허용·우선순위를 보고 실행 차례를 고릅니다."}, {"label": "짧은 접수 함수", "value": "원인 확인과 작업 전달", "detail": "원래 사건 상태를 소거하고 읽을 일을 남깁니다."}, {"label": "일반 작업", "value": "실제 읽기와 계산", "detail": "긴 거래를 마친 뒤 결과를 사용할 수 있습니다."}]} /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            처리 함수에 들어왔다는 사실만으로 핀 쪽의 기록이 지워지는 것은 아닙니다. 두 기록은 다른 위치에 있습니다. 핀 쪽의 원인이 계속 남으면 처리할 요청이 다시 생길 수 있습니다.
          </p></div>
</section>

<section id="why" data-teach-level="2" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">5. 짧게 접수하는 일과 오래 읽는 일을 나눕니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">처리 함수 안에서 300 µs의 센서 거래까지 기다리면 낮은 우선순위의 다른 사건이 더 오래 기다릴 수 있습니다. 여기서는 20 µs 안에 접수하고 일반 작업으로 넘깁니다. 넘겼다는 말은 끝냈다는 뜻이 아니므로 뒤의 40·300·80 µs도 마감 계산에 넣습니다.</p><p className="leading-7">사건 비트를 지우는 주체도 하나로 정해야 합니다. 라이브러리가 이미 지웠는데 사용자 코드가 다시 지우면 그 사이에 들어온 새 사건을 지울 수 있습니다. 실제 함수의 호출 순서를 확인해야 어디까지 직접 처리할지 정할 수 있습니다.</p></div>
</section>

<section id="names" data-teach-level="3" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">6. 기록·대기·접수의 역할에 이름을 붙입니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">입력 전압이 낮음에서 높음으로 바뀌는 순간을 <strong>상승 에지</strong>라고 합니다. RP2040은 이 사건을 GPIO 이벤트 비트에 남깁니다. 프로세서가 처리할 요청을 고르는 블록은 <strong>NVIC</strong>이고, 요청이 아직 처리 차례를 기다리는 상태를 <strong>pending</strong>이라고 합니다.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-3">앞 그림의 역할</th><th className="p-3">실제 이름</th></tr></thead><tbody><tr><td className="p-3">핀 쪽 사건 비트</td><td className="p-3">GPIO INTR의 에지 상태</td></tr><tr><td className="p-3">코어로 보낼 요청</td><td className="p-3">IO_IRQ_BANK0 → NVIC</td></tr><tr><td className="p-3">짧은 접수 경로</td><td className="p-3">인터럽트 처리 함수 ISR</td></tr><tr><td className="p-3">센서의 실제 값 읽기</td><td className="p-3">이 예에서는 I²C 거래</td></tr></tbody></table></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">핀을 프로그램이 계속 읽어 변화를 찾는 방식은 폴링입니다. 이번 경로는 하드웨어가 사건을 기록해 인터럽트 요청을 보내는 방식입니다. 둘 다 바깥 신호를 확인하지만 누가 언제 입력을 확인하고 기록하는지가 다릅니다.</p></div>
</section>

<section id="route" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">7. GPIO2의 에지 기록이 코어의 대기 요청으로 이어집니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">RP2040의 GPIO 입력 에지는 IO_BANK0의 이벤트 상태에 기록됩니다. 선택한 GPIO 에지를 해당 코어의 인터럽트로 허용하면 IO_IRQ_BANK0 신호가 NVIC에 갑니다. NVIC는 해당 요청을 <strong>pending</strong>으로 두었다가 우선순위와 마스킹 상태가 허락할 때 처리 함수로 진입합니다. 핀의 이벤트 상태와 NVIC의 pending 상태는 같은 레지스터가 아닙니다.</p>
   <p className="leading-7">예제에서는 GPIO2 상승 에지만 허용하고 이벤트 원인을 확인한 뒤 해당 플래그를 지웁니다. 원인을 그대로 두면 처리 함수가 끝나자마자 다시 들어올 수 있습니다. 에지 상태 비트는 사건마다 카운터처럼 계속 증가하지 않으므로 빠른 여러 에지를 모두 세어야 한다면 별도 카운터·타임스탬프·하드웨어 경로가 필요합니다.</p>
   <p className="leading-7"><em>NVIC가 처리 함수를 호출했다는 사실만으로 주변 장치의 사건 비트가 지워지지는 않습니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, IRQ 표와 GPIO interrupt 설명, build 3184e62-clean, §2.3.2·§2.19.3·§2.19.5" citeKey={1} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">RP2040 공식 문서는 IO_IRQ_BANK0 번호 13, GPIO 에지 상태의 래치·소거, 코어별 허용 상태와 SDK 콜백 예를 설명합니다. GPIO2 센서와 본문 시간값은 가상입니다.</CitationBlock>
</section>

<section id="handler" data-teach-level="4" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">8. 20 µs 안에 접수하고 300 µs 읽기를 일반 작업에 넘깁니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">입력 이벤트를 받은 처리 함수, 곧 ISR 경로에서는 GPIO2 원인을 확인하고 에지 상태를 소거한 뒤 ‘읽을 일이 생겼다’는 표시나 짧은 큐 항목을 남깁니다. 기본 Pico SDK 콜백을 쓴다면 SDK가 콜백 호출 전에 에지 상태를 지웁니다. 원시 처리기를 직접 등록한 경우에만 자신이 그 소거를 맡습니다. 센서와의 I²C 거래는 이후 일반 작업 문맥에서 수행합니다. 예제에서 ISR 자체는 20 µs, 센서 거래는 300 µs로 가정했습니다. 300 µs를 ISR 안에 넣으면 그동안 낮은 우선순위의 다른 일을 오래 막을 수 있습니다.</p>
   <p className="leading-7">더 높은 우선순위 처리 함수가 돌거나 인터럽트가 잠시 가려져 있으면 NVIC 요청은 pending 상태에서 기다릴 수 있습니다. 우선순위를 높여도 모든 지연이 0이 되지는 않습니다. 오히려 한 ISR이 너무 길면 다른 사건의 최악 대기 시간이 늘어납니다.</p>
   <p className="leading-7"><em>ISR은 사건을 빠르게 접수하고, 시간이 드는 일은 일정이 잡힌 작업으로 넘깁니다.</em></p>
  </div><CitationBlock source="Arm, Cortex-M0+ Devices Generic User Guide, NVIC pending·priority 설명, DUI 0662A, §4.2.6·§4.2.7 (인쇄 4-6·4-7쪽)" citeKey={2} href="https://documentation-service.arm.com/static/5f04aadfdbdee951c1cdc957">Arm 공식 문서는 pending, enable, priority 및 주변 장치 요청이 계속 유지될 때 재진입하는 조건을 설명합니다. 본문의 마이크로초 값은 Arm의 보증 수치가 아닙니다.</CitationBlock>
</section>

<section id="source-enable" data-teach-level="5" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">9. 원문은 콜백을 먼저 등록한 뒤 사건 전달을 켭니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">Pico SDK 2.2.0의 고정 commit a1438dff에서 gpio_set_irq_enabled_with_callback의 198–203행을 봅니다. GPIO2와 상승 에지, enabled=true를 넣으면 현재 코어의 콜백을 먼저 정합니다. 다음에 핀의 사건 허용을 켜고 마지막에 IO_IRQ_BANK0를 켭니다.</p></div><TeachCode codeKey="irqEnable" label="콜백 등록과 사건 허용의 실제 순서" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            GPIO2의 상승 에지 값은 8이고 GPIO 사건 표에서는 각 핀에 네 비트씩 배정합니다. 따라서 이 핀의 상승 에지는 INTR[0]의 4×2+3=11번 비트, 마스크
            0x800입니다. 반면 NVIC로 가는 IO_IRQ_BANK0의 IRQ 번호는 13입니다. 핀 번호 2·사건 비트 11·IRQ 번호 13은 서로 다른 위치를 고릅니다.
          </p><p className="leading-7">허용을 켜는 내부 함수는 이전에 남은 에지 상태를 먼저 지웁니다. 따라서 “이미 기록된 모든 사건을 이어 받아 처리한다”는 동작으로 가정하면 안 됩니다. 초기화 시점에 센서가 사건을 내보내도 되는지도 함께 정해야 합니다.</p></div>
</section>

<section id="source-dispatch" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">10. 같은 사건은 소거된 뒤 사용자 콜백으로 전달됩니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">원문 기본 처리기는 현재 코어의 허용된 사건 상태를 읽습니다. 핀마다 네 비트씩 꺼내 GPIO2에서 events=8을 얻으면 gpio_acknowledge_irq(2,8)을 실행하고 그다음 callback(2,8)을 부릅니다. 사용자가 등록한 콜백은 이미 접수된 사건을 전달받습니다.</p></div><TeachCode codeKey="irqDispatch" label="상태 읽기·소거·콜백 호출 원문" /><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            실제 소거 함수에 두 값을 넣으면 정수 나눗셈 gpio/8의 몫은 0이고 event_mask&lt;&lt;(4×(gpio%8))은 8&lt;&lt;8=0x800입니다. 이 값을
            INTR[0]에 씁니다. 해당 에지 비트는 1을 쓰면 지워지는 방식이므로 상태를 0으로 만들려고 0을 쓰는 것과 다릅니다.
          </p></div><TeachCode codeKey="irqAck" label="GPIO2 에지 비트를 지우는 실제 쓰기" /><CitationBlock source="Pico SDK 2.2.0 · gpio.c 153–170행, gpio.h 573–576행" citeKey={3} href="https://github.com/raspberrypi/pico-sdk/blob/a1438dff1d38bd9c65dbd693f0e5db4b9ae91779/src/rp2_common/hardware_gpio/gpio.c#L153-L170">고정 원문의 기본 처리기와 acknowledge 함수에 gpio=2,event=8을 대입합니다. 원시 처리기의 소거 책임은 기본 콜백과 구별합니다.</CitationBlock><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">기본 콜백 안에서 같은 에지 비트를 무조건 다시 지우지 않습니다. 첫 소거 이후 새 에지가 들어왔다면 두 번째 소거가 새 기록을 없앨 수 있습니다. 반대로 원시 처리기를 직접 등록한 경로는 SDK 기본 처리기 대신 자신이 원인 확인과 소거를 맡습니다. 어느 경로를 쓰는지 먼저 고정해야 합니다.</p></div>
</section>

<section id="budget" data-teach-level="6" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">11. 같은 사건의 완료 시각과 남은 507 µs를 계산합니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">
            가정한 지연 상한을 순서대로 더합니다. 입력 검출·동기화 5 µs, 높은 우선순위나 마스킹 때문에 기다리는 시간 40 µs, NVIC 진입 8 µs, ISR의 확인·소거·큐
            등록 20 µs입니다. 여기까지 73 µs입니다. 작업 깨우기 40 µs를 더하면 실제 센서 읽기를 시작하는 시점은 113 µs입니다.
          </p>
   <p className="leading-7">이후 I²C 거래 300 µs와 계산 80 µs를 더하면 총 493 µs입니다. 가상 마감 1000 µs에서 남는 여유는 507 µs입니다. 일곱 값은 서로 겹치지 않는 구간이라고 가정했습니다. 실제 설계에서는 계측과 실행 조건 분석으로 각 상한의 근거를 세우고 중복 계산 여부를 확인해야 합니다.</p>
   <p className="leading-7"><em>반응 시간은 ISR 진입 시각만이 아니라 센서 값을 사용할 수 있는 시각까지 셉니다.</em></p>
  </div><InterruptLatencyViz /><ExplainedFormula question="센서 값 처리를 끝내고 1 ms 마감까지 남는 시간은?" idea="사건 뒤 순차로 지나는 구간을 더한 뒤 마감에서 뺍니다." formula={String.raw`S=D-\sum_i t_i`} annotatedFormula={String.raw`\underbrace{S}_{\text{남는 시간}}=D-T`} operations={[{expression:String.raw`T_{\mathrm{irq}}=5+40+8+20=73\,\mu s`,annotation:"ISR 접수까지의 네 구간입니다."},{expression:String.raw`T=73+40+300+80=493\,\mu s`,annotation:"작업 깨우기, 읽기, 계산을 더합니다."},{expression:String.raw`S=1000-493=507\,\mu s`,annotation:"마감에서 전체 경로를 뺍니다."}]} terms={[{symbol:"D",name:"사건 이후 마감",description:"이 예제에서는 1000 µs입니다."},{symbol:"T",name:"전체 처리 경로",description:"가정한 일곱 구간의 합 493 µs입니다."},{symbol:"S",name:"여유 시간",description:"양수면 이 가상 예산 안에 듭니다."}]} assumptions={["각 구간은 서로 겹치지 않고 최악값을 가정했습니다.","실제 지연·센서 동작·I²C 속도는 측정해야 합니다."]} interpretation="가상 지연 합은 493 µs이고 여유는 507 µs입니다. 실측 보장은 아닙니다." />
</section>

<section id="stress" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">12. 대기가 길어지면 처리 코드는 같아도 마감을 놓칩니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert">
   <p className="leading-7">다른 작업 때문에 인터럽트 대기만 40→600 µs로 늘었다고 가정합니다. 나머지 구간은 그대로라면 총 지연은 493−40+600=1053 µs이고 마감보다 53 µs 늦습니다. I²C를 더 빠르게 해도 이 대기가 어디서 왔는지 모르면 다시 실패할 수 있습니다.</p>
   <p className="leading-7">측정할 때는 사건 에지, ISR 진입·종료, 작업 시작·끝에 타임스탬프나 테스트 핀을 두고 높은 부하와 다른 인터럽트가 겹친 조건을 봅니다. pending 플래그가 1이라는 사실만으로 여러 에지가 몇 번 왔는지 알 수 없으므로 사건 빈도도 따로 확인해야 합니다.</p>

   <p className="leading-7"><Link to="/electronics/embedded/mcu-memory-map-and-registers#readback">앞 글의 핀 상태</Link>가 변하는 사건을 이번에는 시간 경로로 읽었습니다. 다음 글에서는 10 ms마다 측정할 때 타이머와 샘플링 간격을 맞춥니다.</p>
  </div>
</section>

<section id="limits" data-teach-level="7" className="scroll-mt-20">
<h2 className="mb-6 text-2xl font-bold">13. 에지 비트 하나는 사건 횟수나 최악 시간의 증명서가 아닙니다</h2>
<div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7">
            첫 에지 비트가 1인 동안 같은 에지가 여러 번 더 들어오면 상태는 여전히 1일 수 있습니다. ISR에서 횟수를 하나 올려도 그 전에 합쳐진 사건까지 복원하지는 못합니다. 모든
            사건이 중요하다면 센서가 보관하는 순번·FIFO나 별도 하드웨어 계수·캡처를 고려해야 합니다. 단순한 “읽을 일 있음” 표시는 새 값 하나가 필요하다는 의미로만 쓰는 경우가
            있습니다.
          </p><p className="leading-7">ISR과 일반 작업이 같은 표시나 큐를 만지면 전달 자체의 동시 접근 규칙도 필요합니다. 큐가 가득 찼을 때 버릴지 재시도할지, 센서 데이터가 덮이는지, 누가 상태를 지우는지를 정해야 합니다. 인터럽트 허용 비트만 켜면 이 규칙들이 자동으로 생기지는 않습니다.</p><p className="leading-7">Arm 안내서 §4.2.6은 주변 장치가 요청을 계속 유지하면 처리 뒤 다시 pending이 될 수 있다고 설명합니다. 또 §4.2.7은 인터럽트를 비활성화해도 pending 상태 자체가 생길 수 있음을 구별합니다. 따라서 원래 사건 소거, NVIC의 대기 상태, 실행 허용은 같은 동작이 아닙니다.</p><p className="leading-7">
            493 µs는 본문에서 가정한 상한들을 더한 값입니다. 계측에서 본 가장 긴 시간은 시험한 조건에서의 최댓값이므로 시험하지 않은 부하까지 자동으로 보증하지는 않습니다. 측정
            지점과 최대 마스킹 시간, 높은 우선순위 작업, 실제 거래 실패·재시도 조건을 함께 확인해야 합니다.
          </p></div><div className="prose prose-neutral my-6 max-w-none dark:prose-invert"><p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> ISR이 끝나는 시점은? (답: 11절) 대기만 600 µs면 몇 µs 늦습니까? (답: 12절) 왜 GPIO 이벤트 플래그를 지워야 합니까? (답: 7·10절)</p></div>
</section>
</div>;
}
