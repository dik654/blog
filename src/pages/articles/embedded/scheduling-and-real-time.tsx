import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SchedulingDeadlineViz from "./scheduling-and-real-time/viz/SchedulingDeadlineViz";

/** Invented one-core fixed-priority schedule, milliseconds; not measured FreeRTOS/RP2040 timing. */
export default function SchedulingAndRealTimeArticle(){
 return <div className="space-y-16">
  <section id="overview" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">CPU가 절반 이상 비어도 센서의 마감은 깨질 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="text-lg leading-8">앞 글에서 센서 버스를 읽는 시간은 클록만으로 끝나지 않았습니다. 이제 한 RP2040 코어에서 세 작업이 시간을 나눠 쓴다고 가정합니다. 제어는 5 ms마다 1 ms, 센서 처리는 10 ms마다 2 ms, 로그는 50 ms마다 3 ms의 CPU 시간이 필요합니다. 평균 점유율은 46%입니다. 그런데 센서가 공유 자원을 기다리면 자기 4 ms 마감은 넘길 수 있습니다.</p>
   <p className="leading-7">여기서 센서 작업의 4 ms 마감은 앞 글의 GPIO2 사건 후 1 ms 마감과 다른 요구입니다. 세 실행 시간도 실제 FreeRTOS나 RP2040의 측정치가 아닙니다. 숫자를 고정해 <strong>평균 사용량</strong>과 <strong>개별 작업의 완료 시각</strong>을 분리합니다.</p>
   <p className="leading-7"><em>실시간이라는 말은 CPU가 바쁘냐보다 정해진 시각 전에 결과가 나오느냐에 달려 있습니다.</em></p>
  </div></section>
  <section id="tasks" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">세 작업의 주기와 마감은 서로 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">가상 제어 작업은 주기 5 ms·실행 1 ms·상대 마감 5 ms이고 가장 높은 우선순위를 갖습니다. 센서 작업은 주기 10 ms·실행 2 ms·상대 마감 4 ms로 그다음입니다. 로그 작업은 주기 50 ms·실행 3 ms·상대 마감 50 ms로 가장 낮습니다. 상대 마감은 해당 작업이 준비된 순간부터 잰 시간입니다.</p>
   <p className="leading-7">FreeRTOS처럼 높은 우선순위의 준비된 작업을 실행하는 선점형 일정에서는 제어가 깨어나면 로그가 잠시 멈춥니다. 주기 작업은 이전 목표 시각을 기준으로 잠드는 <code>vTaskDelayUntil</code> 같은 방법을 쓰면 처리 시간이 조금 달라도 원래 주기 눈금에 맞출 수 있습니다. 실제 시간 해상도는 RTOS tick 설정과 별도 타이머 방식에 좌우됩니다.</p>
   <p className="leading-7"><em>한 작업에는 얼마나 자주 나오는지, CPU를 얼마나 쓰는지, 언제까지 끝나야 하는지를 각각 적습니다.</em></p>
  </div><CitationBlock source="FreeRTOS, RTOS Fundamentals·Task Priorities·Reference Manual v10, vTaskDelayUntil()" citeKey={1} href="https://www.freertos.org/Documentation/01-FreeRTOS-quick-start/01-Beginners-guide/01-RTOS-fundamentals">FreeRTOS 공식 설명은 가장 높은 우선순위의 준비된 작업 선택과 절대 주기 기반 대기의 목적을 설명합니다. 세 작업의 실행 시간·마감은 본문의 가정입니다.</CitationBlock></section>
  <section id="timeline" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">모두 0 ms에 준비되면 센서는 3 ms에 끝납니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">공유 자원 대기와 RTOS 오버헤드가 없고 셋이 0 ms에 함께 준비된다고 둡니다. 제어가 0–1 ms, 센서가 1–3 ms에 실행됩니다. 센서는 준비 뒤 3 ms에 완료되어 4 ms 마감보다 1 ms 앞섭니다. 로그가 3–5 ms에 2 ms 일한 뒤 5 ms에 다시 준비된 제어에 밀리고, 제어 5–6 ms가 끝난 다음 남은 로그 1 ms를 6–7 ms에 실행합니다.</p>
   <p className="leading-7">이 한 구간에서는 센서가 제어 때문에 1 ms 늦어도 마감을 지킵니다. 그러나 작업들의 시작 위상과 오래 잡는 자원이 달라지면 같은 평균 점유율에서도 센서의 대기는 더 길어집니다.</p>
   <p className="leading-7"><em>작업 하나의 완료 시각은 준비 시각부터 앞선 작업과 자원 대기를 따라가야 나옵니다.</em></p>
  </div><SchedulingDeadlineViz /></section>
  <section id="utilization" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">46%는 평균 CPU 몫이지 마감 보증이 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">주기 작업의 단순 점유율은 실행 시간 C를 주기 P로 나눠 더합니다. 제어 1/5=20%, 센서 2/10=20%, 로그 3/50=6%, 총 46%입니다. 공통 50 ms 구간에서는 제어 10회×1 ms=10 ms, 센서 5회×2 ms=10 ms, 로그 1회×3 ms=3 ms로 CPU 일은 23 ms입니다.</p>
   <p className="leading-7">남은 27 ms가 한 곳에 연속으로 비어 있는 것은 아닙니다. 센서에는 매번 준비 뒤 4 ms 안에 끝내야 하는 더 좁은 조건이 있습니다. 높은 우선순위 간섭, 공유 자원 대기, 인터럽트, 버스 거래, tick과 문맥 전환 비용을 더하면 실제 완료가 달라집니다.</p>
   <p className="leading-7"><em>총량 23/50 ms와 센서 한 번의 4 ms 마감은 다른 계산입니다.</em></p>
  </div><ExplainedFormula question="가상 세 작업이 한 코어의 시간을 평균 얼마나 씁니까?" idea="각 작업의 실행 시간 몫을 자기 주기로 나눠 더합니다." formula={String.raw`U=\sum_i C_i/P_i`} annotatedFormula={String.raw`\underbrace{U}_{\text{CPU 점유율}}=\sum_i C_i/P_i`} operations={[{expression:String.raw`U_c=1/5=0.20`,annotation:"제어 작업의 몫입니다."},{expression:String.raw`U_s=2/10=0.20`,annotation:"센서 작업의 몫입니다."},{expression:String.raw`U_l=3/50=0.06`,annotation:"로그 작업의 몫입니다."},{expression:String.raw`U=0.46=46\%`,annotation:"세 몫을 더합니다."}]} terms={[{symbol:"C",name:"한 번의 실행 시간",description:"이 예제의 가정값입니다."},{symbol:"P",name:"반복 주기",description:"각 작업의 준비 간격입니다."},{symbol:"U",name:"평균 CPU 점유율",description:"개별 마감 충족 여부는 포함하지 않습니다."}]} assumptions={["한 코어에서 각 작업의 가상 CPU 시간을 고정합니다.","자원 대기·RTOS·IRQ 오버헤드는 이 평균 계산에서 제외합니다."]} interpretation="평균 CPU 점유율은 46%입니다. 이 수치만으로 센서의 4 ms 마감은 보장되지 않습니다." /></section>
  <section id="blocking" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">낮은 우선순위 작업이 자원을 쥐면 센서가 기다립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">이번에는 앞 주기에 시작한 로그 작업이 공유 버스 보호용 뮤텍스를 갖고 있고, 0 ms 시점에 임계 구간이 2 ms 남았다고 가정합니다. 제어는 0–1 ms에 실행되고 센서는 1 ms에 뮤텍스를 요청하지만 기다립니다. 로그가 1–3 ms에 남은 임계 구간을 끝낸 뒤에야 센서가 3–5 ms에 2 ms 일합니다. 센서의 4 ms 마감을 1 ms 넘겼습니다.</p>
   <p className="leading-7">FreeRTOS 뮤텍스의 우선순위 상속은 이때 로그의 우선순위를 잠시 올려 중간 우선순위 작업이 로그를 계속 밀어내는 문제를 줄입니다. 이미 남아 있는 2 ms 임계 구간을 없애지는 못합니다. 이 사례에서는 센서와 로그가 공유하는 자원을 짧게 잡고, 센서의 실제 응답 시간을 계측해야 합니다. ISR에서는 기다리는 뮤텍스를 잡지 않습니다.</p>
   <p className="leading-7"><em>우선순위는 실행 순서를 바꾸지만 공유 자원을 가진 시간이 사라지지는 않습니다.</em></p>
  </div><CitationBlock source="FreeRTOS, ‘FreeRTOS mutexes’ (2026)" citeKey={2} href="https://freertos.org/Real-time-embedded-RTOS-mutexes.html">FreeRTOS 공식 문서는 뮤텍스의 우선순위 상속과 ISR에서 기다리는 뮤텍스를 사용하지 않는 이유를 설명합니다. 2 ms 임계 구간과 마감 초과는 본문 가정입니다.</CitationBlock></section>
  <section id="limits" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">실제 보장은 최악 실행·대기와 시각 기록으로 확인합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
   <p className="leading-7">실제 I²C 거래는 다른 장치의 버스 점유와 클록 스트레칭으로 길어질 수 있습니다. 센서의 2 ms를 측정할 때 CPU 실행뿐 아니라 버스 대기·큐·인터럽트 지연도 완성 결과까지 포함해야 합니다. RTOS tick 해상도와 타이머 시각, 작업 준비·시작·완료의 로그를 함께 비교하고 가장 불리한 겹침 조건을 시험합니다.</p>
   <p className="leading-7"><strong>읽고 나서 예측해 보세요.</strong> 세 작업의 점유율 합은? (답: 4절) 대기가 없을 때 센서는 몇 ms에 끝납니까? (답: 3절) 뮤텍스가 2 ms 남았다면 마감을 얼마나 넘습니까? (답: 5절)</p>
   <p className="leading-7"><Link to="/electronics/embedded/serial-buses-and-tradeoffs#choice">앞 글의 버스 하한 시간</Link>은 여기의 실제 작업 경로에 더 검토해야 합니다. 다음에는 갱신 중 전원이 끊겨도 옛 펌웨어로 되돌아갈 수 있는 저장·부팅 순서를 봅니다.</p>
  </div></section>
 </div>;
}
