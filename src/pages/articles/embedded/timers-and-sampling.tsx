import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import TimerSamplingViz from "./timers-and-sampling/viz/TimerSamplingViz";

/** Invented 10 ms ADC0 schedule and 30/70 Hz cosine input, not a board measurement. */
export default function TimersAndSamplingArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10 ms마다 읽으면 빠른 변화가 느리게 보일 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글의 GPIO2 인터럽트는 센서가 먼저 알리는 사건에 반응했습니다. 이번에는 RP2040이 스스로 10 ms마다 측정하라고 알람을 겁니다. 가상 아날로그 신호를 GPIO26/ADC0으로 읽는다고 놓으면 1초에 100개 값을 얻습니다. 하지만 70 Hz로 움직이는 신호는 이 일정한 눈금에서는 30 Hz처럼 보일 수 있습니다.</p>
   <p className="leading-7">타이머가 정확한 시각을 기록하는 일, CPU가 알람을 처리하는 일, ADC가 입력을 실제로 잡는 일은 서로 다른 단계입니다. 이 차이와 샘플 간격을 함께 보아야 센서 값을 믿을 수 있습니다.</p>
   <p className="leading-7"><em>언제 읽을지를 정하는 것과 읽은 값이 원래 신호를 나타내는지는 별도 질문입니다.</em></p>
  </div></section>
  <section id="timer" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">RP2040 타이머의 1 µs 눈금에서 10 ms는 10000칸입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">RP2040의 시스템 타이머는 64비트 계수기를 1 µs마다 올리고 네 개의 비교 알람을 제공합니다. 가상 주기 10 ms는 10000 µs이므로 알람 목표는 0, 10000, 20000, 30000 µs처럼 이어집니다. 비교 목표 시각과 실제 처리 함수 진입 시각은 다를 수 있습니다. 인터럽트 대기나 다른 작업이 끼면 CPU가 늦게 반응합니다.</p>
   <p className="leading-7">목표 10000 µs의 처리가 10400 µs에 시작해도 다음 목표를 20000 µs로 두면 원래 눈금에 맞춥니다. 매번 처리한 시각에 10000 µs를 더해 20400 µs로 잡으면 늦은 만큼 위상이 밀립니다. 마감을 놓쳤을 때 건너뛸지 복구할지는 장치의 측정 목적에 맞게 정해야 합니다.</p>
   <p className="leading-7"><em>주기의 기준은 이전 목표 시각이지, 늦게 깨어난 시각이 아닙니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, Timer, 원본 535–537쪽" citeKey={1} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">공식 데이터시트는 1 µs 단위 64비트 타이머, 네 알람과 비교 인터럽트를 설명합니다. 10 ms 주기와 400 µs 지연은 본문의 가상 일정입니다.</CitationBlock></section>
  <section id="adc" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">알람이 울린 뒤에도 ADC가 값을 잡는 시간이 필요합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">RP2040의 ADC 입력 0은 GPIO26에 연결됩니다. ADC 클록을 48 MHz로 맞춘 조건에서 공식 데이터시트의 단일 변환은 96주기, 약 2 µs입니다. 이 2 µs는 ADC 변환 자체의 시간입니다. 알람에서 처리 함수가 시작되기까지의 지연, 입력 회로 안정화, 소프트웨어가 결과를 읽고 저장하는 시간은 포함하지 않습니다.</p>
   <p className="leading-7">가상 구현은 알람에서 일을 예약하고, ADC 준비 상태를 확인한 뒤 한 번 변환해 결과를 기록합니다. 신호가 빠르게 바뀐다면 <strong>알람 목표</strong>와 <strong>실제 샘플 시각</strong>을 함께 기록해야 시간 오차를 분석할 수 있습니다. 단순히 데이터 배열에 10 ms 간격의 시간표만 적으면 지터를 감춥니다.</p>
   <p className="leading-7"><em>타이머가 1 µs 눈금이라고 해서 샘플 시각의 오차가 1 µs 이하라는 뜻은 아닙니다.</em></p>
  </div><CitationBlock source="Raspberry Pi, RP2040 Datasheet, SAR ADC, 원본 559–560쪽" citeKey={2} href="https://datasheets.raspberrypi.com/rp2040/rp2040-datasheet.pdf">공식 문서는 GPIO26/ADC0, 48 MHz ADC 클록에서 96주기 약 2 µs의 변환과 결과 레지스터를 설명합니다. CPU 알람과 센서 회로까지의 전체 시간은 별도입니다.</CitationBlock></section>
  <section id="rate" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10 ms 간격은 초당 100개, 절반 경계는 50 Hz입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">샘플 간격 T<sub>s</sub>=0.01 s라면 빈도 f<sub>s</sub>=1/T<sub>s</sub>=100 Hz입니다. 이상적으로 대역이 제한된 신호를 왜곡 없이 복원하려면 입력의 가장 높은 주파수가 이 빈도의 절반인 50 Hz보다 낮아야 합니다. 가상의 30 Hz 성분은 이 조건 아래입니다. 실제로는 경계에 걸치는 신호, 필터의 완만한 전이 구간, 시각 지터를 고려해 여유를 둡니다.</p>
   <p className="leading-7">주파수 조건은 ADC의 변환 능력과도 다릅니다. RP2040 ADC가 이 조건에서 한 값을 2 µs에 변환할 수 있어도, 프로그램이 10 ms마다 한 값만 남기면 최종 샘플 빈도는 100 Hz입니다.</p>
   <p className="leading-7"><em>ADC의 최대 변환 속도보다 실제로 저장한 값의 간격이 이 분석의 기준입니다.</em></p>
  </div></section>
  <section id="alias" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">70 Hz 코사인은 100 Hz 눈금에서 30 Hz와 같은 값을 남깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">순수한 가상 코사인 파형을 0, 0.01, 0.02 s…에서 읽어 봅니다. 70 Hz의 n번째 값은 cos(2π·70n/100)이고, 30 Hz는 cos(2π·30n/100)입니다. 70=100−30이고 cos(2πn−θ)=cos θ이므로 정수 n의 샘플은 완전히 같습니다. 디지털 값만 보면 원래가 30 Hz인지 70 Hz인지 구분할 수 없습니다.</p>
   <p className="leading-7">70 Hz 성분이 ADC에 들어오기 전에 아날로그 낮은 주파수 통과 필터로 충분히 줄여야 합니다. 샘플링 뒤에 디지털 필터를 걸어도 이미 30 Hz로 겹친 두 원인을 분리할 수 없습니다. 이 사례는 연속 입력이 코사인이고 정확히 100 Hz로 샘플된다는 가정에 따른 것입니다.</p>
   <p className="leading-7"><em>나중에 계산을 더 많이 해도 서로 같은 샘플을 만든 두 파형의 출처는 복원할 수 없습니다.</em></p>
  </div><TimerSamplingViz /><ExplainedFormula question="100 Hz로 읽은 70 Hz 성분은 어떤 낮은 주파수로 보입니까?" idea="샘플 빈도와 입력 성분의 차이가 절반 경계 아래에 접혀 들어옵니다." formula={String.raw`f_a=|f_s-f|`} annotatedFormula={String.raw`\underbrace{f_a}_{\text{겹쳐 보이는 빈도}}=|f_s-f|`} operations={[{expression:String.raw`f_s=1/0.01=100\,\mathrm{Hz}`,annotation:"10 ms마다 하나를 남깁니다."},{expression:String.raw`f_N=100/2=50\,\mathrm{Hz}`,annotation:"이상적인 절반 경계입니다."},{expression:String.raw`f_a=|100-70|=30\,\mathrm{Hz}`,annotation:"70 Hz가 30 Hz 샘플과 겹칩니다."}]} terms={[{symbol:"fₛ",name:"샘플 빈도",description:"실제로 저장한 값은 초당 100개입니다."},{symbol:"f",name:"입력 성분",description:"가정한 70 Hz 코사인입니다."},{symbol:"fₐ",name:"겹쳐 보이는 빈도",description:"이 사례에서 30 Hz입니다."}]} assumptions={["등간격 100 Hz의 이상적인 점 샘플을 가정합니다.","입력은 순수한 70 Hz 코사인 성분입니다."]} interpretation="70 Hz와 30 Hz 코사인은 이 100 Hz 샘플 시각에서 같은 값을 남깁니다." /><CitationBlock source="MIT OpenCourseWare RES.6-007, Lecture 16, ‘Sampling’ (2011), 원본 1–2쪽" citeKey={3} href="https://ocw.mit.edu/courses/res-6-007-signals-and-systems-spring-2011/8708ec068ebdea2c4ee2f38fad39fb83_MITRES_6_007S11_lec16.pdf">MIT 공식 강의는 샘플 빈도의 절반을 넘는 입력 성분이 낮은 빈도로 겹쳐 보이는 앨리어싱을 설명합니다. 100·70·30 Hz는 본문에서 만든 예제입니다.</CitationBlock></section>
  <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">주기, 변환 시각, 입력 대역을 함께 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">타이머 목표 10 ms와 실제 ADC 시작 시각 사이의 변동은 주기 지터입니다. 클록의 정확도, 다른 ISR의 대기, ADC 준비 시간, 입력 회로의 아날로그 필터를 함께 확인해야 합니다. 신호의 높은 주파수 성분을 제한할 수 없다면 샘플 빈도도 다시 정해야 합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 10 ms 주기는 몇 Hz입니까? (답: 4절) 70 Hz가 왜 30 Hz와 같게 보입니까? (답: 5절) 10.4 ms에 늦게 깨어나도 다음 목표는? (답: 2절)</p>
   <p className="leading-7"><Link to="/electronics/embedded/interrupts-and-latency-budget#budget">앞 글의 1 ms 처리 마감</Link>과 이번 10 ms 샘플 간격은 다른 제약입니다. 다음에는 센서 값을 I²C로 읽고 로그를 UART로 내보낼 때 각 버스가 어떤 비용을 만드는지 봅니다.</p>
  </div></section>
 </div>;
}
