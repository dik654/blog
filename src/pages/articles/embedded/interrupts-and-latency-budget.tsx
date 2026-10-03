import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import InterruptLatencyViz from "./interrupts-and-latency-budget/viz/InterruptLatencyViz";

/** Invented GPIO2 ready event and microsecond budget, not RP2040 measured latency. */
export default function InterruptsAndLatencyBudgetArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">센서가 준비됐다는 신호를 놓치지 않으려면</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글에서는 GPIO5를 출력으로 바꿨습니다. 이번에는 가상의 센서가 GPIO2에 ‘데이터 준비’ 상승 에지를 보냅니다. CPU가 계속 GPIO2만 읽으면 다른 일을 하기 어렵습니다. RP2040의 GPIO 인터럽트를 켜면 입력 변화가 상태 비트에 남고, 프로세서는 가능한 시점에 처리 함수를 실행합니다.</p>
   <p className="leading-7">목표는 입력 에지가 온 뒤 1 ms 안에 센서 값을 읽고 계산을 마치는 것입니다. 예제의 각 지연은 실제 RP2040의 측정값이 아니라 시간 예산을 배우기 위한 가정입니다. 인터럽트가 있다고 해서 1 ms를 자동으로 보장하지 않습니다.</p>
   <p className="leading-7"><em>인터럽트는 사건을 알려 주는 경로이고, 마감 시각은 그 뒤의 모든 일을 합산해 판단합니다.</em></p>
  </div></section>
  <section id="route" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">GPIO 에지에서 처리 함수까지는 두 곳의 상태를 지납니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">RP2040의 GPIO 입력 에지는 IO_BANK0의 이벤트 상태에 기록됩니다. 선택한 GPIO 에지를 해당 코어의 인터럽트로 허용하면 IO_IRQ_BANK0 신호가 NVIC에 갑니다. NVIC는 해당 요청을 <strong>pending</strong>으로 두었다가 우선순위와 마스킹 상태가 허락할 때 처리 함수로 진입합니다. 핀의 이벤트 상태와 NVIC의 pending 상태는 같은 레지스터가 아닙니다.</p>
   <p className="leading-7">예제에서는 GPIO2 상승 에지만 허용하고 이벤트 원인을 확인한 뒤 해당 플래그를 지웁니다. 원인을 그대로 두면 처리 함수가 끝나자마자 다시 들어올 수 있습니다. 에지 상태 비트는 사건마다 카운터처럼 계속 증가하지 않으므로 빠른 여러 에지를 모두 세어야 한다면 별도 카운터·타임스탬프·하드웨어 경로가 필요합니다.</p>
   <p className="leading-7"><em>NVIC가 처리 함수를 호출했다는 사실만으로 주변 장치의 사건 비트가 지워지지는 않습니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, IRQ 표와 GPIO interrupt 설명, 원본 60·239·243–244쪽" citeKey={1} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">RP2040 공식 문서는 IO_IRQ_BANK0 번호 13, GPIO 에지 상태의 래치·소거, 코어별 허용 상태와 SDK 콜백 예를 설명합니다. GPIO2 센서와 본문 시간값은 가상입니다.</CitationBlock></section>
  <section id="handler" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">처리 함수에서는 신호를 접수하고 오래 걸리는 읽기는 밖으로 넘깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">입력 이벤트를 받은 처리 함수, 곧 ISR에서는 GPIO2 원인을 확인하고 플래그를 지운 뒤 ‘읽을 일이 생겼다’는 표시나 짧은 큐 항목을 남깁니다. 센서와의 I²C 거래는 이후 일반 작업 문맥에서 수행합니다. 예제에서 ISR 자체는 20 µs, 센서 거래는 300 µs로 가정했습니다. 300 µs를 ISR 안에 넣으면 그동안 낮은 우선순위의 다른 일을 오래 막을 수 있습니다.</p>
   <p className="leading-7">더 높은 우선순위 처리 함수가 돌거나 인터럽트가 잠시 가려져 있으면 NVIC 요청은 pending 상태에서 기다릴 수 있습니다. 우선순위를 높여도 모든 지연이 0이 되지는 않습니다. 오히려 한 ISR이 너무 길면 다른 사건의 최악 대기 시간이 늘어납니다.</p>
   <p className="leading-7"><em>ISR은 사건을 빠르게 접수하고, 시간이 드는 일은 일정이 잡힌 작업으로 넘깁니다.</em></p>
  </div><CitationBlock source="Arm, Cortex-M0+ Devices Generic User Guide, NVIC pending·priority 설명, 원본 87–90쪽" citeKey={2} href="https://documentation-service.arm.com/static/5f04aadfdbdee951c1cdc957">Arm 공식 문서는 pending, enable, priority 및 주변 장치 요청이 계속 주장될 때 재진입하는 조건을 설명합니다. 본문의 마이크로초 값은 Arm의 보증 수치가 아닙니다.</CitationBlock></section>
  <section id="budget" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">마감 1 ms에서 예제의 여유는 507 µs입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">가상의 최악 지연을 순서대로 놓습니다. 입력 검출·동기화 5 µs, 높은 우선순위나 마스킹 때문에 기다리는 시간 40 µs, NVIC 진입 8 µs, ISR의 확인·소거·큐 등록 20 µs입니다. 여기까지 73 µs입니다. 작업 깨우기 40 µs를 더하면 실제 센서 읽기를 시작하는 시점은 113 µs입니다.</p>
   <p className="leading-7">이후 I²C 거래 300 µs와 계산 80 µs를 더하면 총 493 µs입니다. 가상 마감 1000 µs에서 남는 여유는 507 µs입니다. 일곱 값은 서로 겹치지 않는 구간이라고 가정했습니다. 실제 설계에서는 계측으로 최악값을 잡고 중복 계산 여부를 확인해야 합니다.</p>
   <p className="leading-7"><em>반응 시간은 ISR 진입 시각만이 아니라 센서 값을 사용할 수 있는 시각까지 셉니다.</em></p>
  </div><InterruptLatencyViz /><ExplainedFormula question="센서 값 처리를 끝내고 1 ms 마감까지 남는 시간은?" idea="사건 뒤 순차로 지나는 구간을 더한 뒤 마감에서 뺍니다." formula={String.raw`S=D-\sum_i t_i`} annotatedFormula={String.raw`\underbrace{S}_{\text{남는 시간}}=D-T`} operations={[{expression:String.raw`T_{\mathrm{irq}}=5+40+8+20=73\,\mu s`,annotation:"ISR 접수까지의 네 구간입니다."},{expression:String.raw`T=73+40+300+80=493\,\mu s`,annotation:"작업 깨우기, 읽기, 계산을 더합니다."},{expression:String.raw`S=1000-493=507\,\mu s`,annotation:"마감에서 전체 경로를 뺍니다."}]} terms={[{symbol:"D",name:"사건 이후 마감",description:"이 예제에서는 1000 µs입니다."},{symbol:"T",name:"전체 처리 경로",description:"가정한 일곱 구간의 합 493 µs입니다."},{symbol:"S",name:"여유 시간",description:"양수면 이 가상 예산 안에 듭니다."}]} assumptions={["각 구간은 서로 겹치지 않고 최악값을 가정했습니다.","실제 지연·센서 동작·I²C 속도는 측정해야 합니다."]} interpretation="가상 지연 합은 493 µs이고 여유는 507 µs입니다. 실측 보장은 아닙니다." /></section>
  <section id="stress" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">대기가 길어지면 처리 코드는 같아도 마감을 놓칩니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">다른 작업 때문에 인터럽트 대기만 40→600 µs로 늘었다고 가정합니다. 나머지 구간은 그대로라면 총 지연은 493−40+600=1053 µs이고 마감보다 53 µs 늦습니다. I²C를 더 빠르게 해도 이 대기가 어디서 왔는지 모르면 다시 실패할 수 있습니다.</p>
   <p className="leading-7">측정할 때는 사건 에지, ISR 진입·종료, 작업 시작·끝에 타임스탬프나 테스트 핀을 두고 높은 부하와 다른 인터럽트가 겹친 조건을 봅니다. pending 플래그가 1이라는 사실만으로 여러 에지가 몇 번 왔는지 알 수 없으므로 사건 빈도도 따로 확인해야 합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> ISR이 끝나는 시점은? (답: 4절) 대기만 600 µs면 몇 µs 늦습니까? (답: 5절) 왜 GPIO 이벤트 플래그를 지워야 합니까? (답: 2절)</p>
   <p className="leading-7"><Link to="/electronics/embedded/mcu-memory-map-and-registers#readback">앞 글의 핀 상태</Link>가 변하는 사건을 이번에는 시간 경로로 읽었습니다. 다음 글에서는 10 ms마다 측정할 때 타이머와 샘플링 간격을 맞춥니다.</p>
  </div></section>
 </div>;
}
