import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { articlePath } from '@/lib/paths';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  CommandEnvelopeLab,
  DeadlineLatchLab,
  EmbeddedFailureLegend,
  EmbeddedRuntimeStrip,
  FaultLadderLab,
  FieldbusClockLab,
  IsrDmaLab,
  NumericMemoryLab,
  PriorityInversionLab,
  RtosScheduleLab,
  SampleActuateLab,
} from './robot-embedded-realtime/viz/RobotEmbeddedRealtimeViz';

const raw = String.raw;

function ContractLedger({
  items,
}: {
  items: Array<{ label: string; contract: string; failure: string }>;
}) {
  return (
    <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {items.map((item, index) => (
        <div key={item.label} className="min-w-0 bg-background p-4">
          <p className="flex items-center gap-2 text-xs font-black text-muted-foreground"><span className="font-mono">{String(index + 1).padStart(2, '0')}</span>{item.label}</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">{item.contract}</p>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">깨지면:</strong> {item.failure}</p>
        </div>
      ))}
    </div>
  );
}

function EvidenceSequence({
  items,
}: {
  items: Array<{ signal: string; meaning: string; response: string }>;
}) {
  return (
    <ol className="not-prose my-6 grid gap-2">
      {items.map((item, index) => (
        <li key={item.signal} className="grid min-w-0 grid-cols-[2.4rem_minmax(0,1fr)] gap-3 border-b border-border py-3">
          <span className="font-mono text-lg font-black text-teal-700/55 dark:text-teal-300/55">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold">{item.signal}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.meaning}</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed">판정 후 행동 · {item.response}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function RobotEmbeddedRealtimeControl() {
  return (
    <>
      <BeginnerOpening
        title="화면에 ‘켜짐’이 떴다고 전등에 전기가 흐른 것은 아닐 수 있다"
        description={<>상위 프로그램이 계산해 보낸 원하는 힘·속도·위치를 <strong>요청 명령</strong>이라고 한다. 모터 가까이에서 센서를 읽고 전력 스위치를 제어하는 작은 컴퓨터가 <strong>embedded drive</strong>다. 이 장치는 명령이 최신인지 확인하고 정해진 하드웨어 시각에 적용한 뒤 실제 전류가 변했는지 관찰해야 한다.</>}
        familiarScene={<>스마트폰이 전등에 켜기 명령을 보냈지만 통신이 늦거나, 이전 사용자의 명령이 남았거나, 차단기가 내려가 있을 수 있다. ‘전송 성공’과 ‘전등이 실제로 켜짐’은 다른 사건이다. 모터 명령도 보낸 시각, 적용할 순서, 만료 시각과 실제 반응을 함께 추적해야 한다.</>}
        steps={[
          { label: '명령의 신원을 확인한다', detail: '값뿐 아니라 단위·동작 모드·순서·만료 시각을 함께 받는다.' },
          { label: '정해진 주기에 적용한다', detail: '센서를 읽고 계산을 끝낸 뒤 안전한 타이머 순간에 출력을 갱신한다.' },
          { label: '실제 반응을 확인한다', detail: '스위치 상태와 전류 응답이 요청과 맞는지 독립적으로 본다.' },
        ]}
      />
      <QuestionLead
        label="이제 확인할 질문"
        question="상위 프로그램이 최신 힘 명령을 장치로 보냈다면 그 힘이 모터에 이미 적용됐다고 봐도 될까?"
        answer="아니다. 보내기, 장치가 받기, 명령을 승인하기, 목표 하드웨어 주기에 넣기, 전력 스위치에 반영하기와 실제 전류가 바뀌는 일은 서로 다른 사건이다. 명령의 신원과 시간을 끝까지 추적해야 요청한 값과 물리 장치에 적용된 값을 구분할 수 있다."
      />

      <NlpSection id="command-envelope" marker="01" tone="teal" question="계산한 명령 숫자가 실제 모터 힘이 되기까지 무엇을 통과해야 할까?" title="보낸 명령과 정해진 순간에 적용된 물리 출력을 분리한다">
        <p>
          상위 controller는 위치·속도·torque reference를 계산합니다. Embedded drive는 그 값을 어느 mode와 단위로 해석할지, 어느 restart epoch에 속하는지,
          몇 번째 hardware cycle에 적용할지, 늦으면 폐기할지, 어떤 limit과 fallback을 쓸지 결정합니다. 이 경계를 생략하면 link가 끊기지 않아도 restart 전 command나
          한 cycle 늦은 torque가 정상 명령처럼 실행될 수 있습니다.
        </p>
        <EmbeddedRuntimeStrip />
        <ConceptPrimer items={[
          { term: 'Requested command', meaning: 'Host controller가 보내려 한 setpoint입니다.', why: '전송 성공이나 command echo만으로는 device 적용을 증명하지 않습니다.' },
          { term: 'Accepted command', meaning: 'Drive가 mode, identity, time, range와 health를 검증한 command입니다.', why: '수신과 유효성 검사를 분리해야 stale·wrong-unit·wrong-mode 명령을 차단합니다.' },
          { term: 'Applied command', meaning: '특정 hardware cycle의 PWM shadow register에 latch된 output입니다.', why: 'Function return과 실제 power-stage update 사이의 phase를 고정합니다.' },
          { term: 'Observed actuation', meaning: 'Driver enable, applied sequence와 sensor response를 다시 읽은 상태입니다.', why: 'Command echo가 아니라 실제 actuator evidence로 closed loop를 닫습니다.' },
        ]} />
        <MathFormula display>{raw`\begin{aligned}\underbrace{c_{meaning}}_{\text{명령의 뜻}}&=\underbrace{(mode,value,unit,limits)}_{\text{해석·포화 고정}}\\\underbrace{c_{identity}}_{\text{실행 소속}}&=\underbrace{(source,seq,epoch)}_{\text{재시작 전후 분리}}\\\underbrace{c_{time}}_{\text{적용 시간}}&=\underbrace{(cycle_{target},t_{valid})}_{\text{늦은 명령 차단}}\\\underbrace{c_{result}}_{\text{물리 증거}}&=\underbrace{(seq_{applied},driver,power)}_{\text{실제 적용 확인}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Command envelope은 payload를 크게 만드는 장식 metadata가 아닙니다. Drive가 지금 적용해도 되는 값인지 판정하고, host가 요청·적용·관측 상태를 서로 대조하기 위한 분산 transaction입니다."
          symbols={[[raw`mode`, 'Torque, velocity, position처럼 drive가 사용할 제어 mode'], [raw`seq,epoch`, 'Command 순서와 restart/goal generation identity'], [raw`cycle_{target}`, 'Drive의 synchronized hardware cycle 번호'], [raw`seq_{applied}`, 'PWM에 실제 반영된 command sequence']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{G_{cmd}}_{\text{명령 허용}}
          &=\underbrace{[epoch=epoch_{active}]}_{\text{현재 실행 소속}}\\
          &\quad\land\underbrace{[cycle=cycle_{target}]}_{\text{정해진 적용 순간}}\\
          &\quad\land\underbrace{[age\le A_{max}]}_{\text{유효 시간 안}}\\
          &\quad\land\underbrace{[range_{ok}]}_{\text{물리·수치 범위 통과}}\\
          &\quad\land\underbrace{[health_{ok}]}_{\text{장치 상태 정상}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="AND gate의 unknown은 true가 아니라 closed입니다. Target cycle을 이미 지났다면 FIFO 순서를 지키며 늦게 실행하지 말고 workload 의미에 따라 reject, latest overwrite 또는 보간해야 합니다."
          symbols={[[raw`A_{max}`, '이 command가 target cycle 주변에서 허용하는 최대 age'], [raw`range_{ok}`, 'Unit conversion 뒤 physical·numeric range 통과'], [raw`health_{ok}`, 'Measurement, schedule, driver와 fault state가 모두 valid']]} />
        <CommandEnvelopeLab />
        <Misconception>Drive queue가 깊으면 command loss는 줄지만 motion correctness가 좋아지는 것은 아닙니다. 연속 setpoint는 이전 값이 다음 값을 대신할 수 있으므로 stale FIFO가 더 위험할 수 있고, event command는 반대로 sequence 보존과 idempotent acknowledgement가 필요합니다.</Misconception>
      </NlpSection>

      <NlpSection id="physical-deadline" marker="02" tone="violet" question="평균 20 µs 함수가 왜 50 µs control cycle을 놓칠 수 있을까?" title="Real time은 빠른 코드가 아니라 정해진 물리 결과 시각이다">
        <p>
          Hard real time에서 중요한 것은 평균이 아니라 deadline miss의 결과입니다. Release는 job이 실행 가능해진 시각, start는 CPU를 받은 시각, finish는 계산이 끝난 시각입니다.
          하지만 motor drive의 실제 deadline은 보통 PWM compare shadow 값을 안전하게 latch할 수 있는 timer event입니다. Latch 뒤에 끝난 계산은 period 안에서 반환돼도 한 cycle 동안 이전 duty를 유지합니다.
        </p>
        <ContractLedger items={[
          { label: 'Soft deadline', contract: '늦으면 품질이 점진적으로 낮아지지만 결과가 여전히 유용', failure: '평균과 percentile만 보고 occasional delay를 허용할 수 있습니다.' },
          { label: 'Firm deadline', contract: '늦은 결과는 가치가 없어 폐기하지만 한 번의 miss가 즉시 재앙은 아님', failure: '늦은 setpoint를 실행하면 폐기보다 더 위험한 out-of-order actuation이 됩니다.' },
          { label: 'Hard deadline', contract: '운영 가정 안에서 miss를 허용하지 않고 검증 가능한 상한 필요', failure: '최악 경로를 모른 채 평균으로 대체하면 guarantee가 아니라 관찰 기록입니다.' },
          { label: 'Fault deadline', contract: '고장을 감지한 뒤 power를 안전 상태로 만드는 마지막 시각', failure: '통신 cancel이나 software task가 막히면 independent hardware trip이 필요합니다.' },
        ]} />
        <MathFormula display>{raw`\begin{aligned}\underbrace{R_i}_{\text{작업 응답시간}}&=\underbrace{t_{finish,i}-t_{release,i}}_{\text{준비부터 계산 완료까지}}\\\underbrace{S_i}_{\text{마감 여유}}&=\underbrace{D_i-R_i}_{\text{허용 시간에서 응답시간을 뺌}}\\\underbrace{cycle_{apply}}_{\text{실제 적용 주기}}&=\underbrace{\min\{k:t_{finish}\le t_{latch,k}\}}_{\text{완료 뒤 첫 안전 래치}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="D를 단순 period 끝으로 두지 않고 physical latch와 fault consequence에서 정합니다. 같은 WCET라도 release jitter가 커지면 finish phase가 latch를 넘어 applied cycle이 바뀝니다."
          symbols={[[raw`t_{release}`, 'Timer/DMA/event가 control job을 ready로 만든 시각'], [raw`t_{finish}`, 'Output 검증까지 끝난 시각'], [raw`t_{latch,k}`, 'k번째 PWM cycle이 새 compare를 안전하게 받아들이는 시각'], [raw`S_i`, '음수가 되면 deadline miss인 slack']]} />
        <DeadlineLatchLab />
        <Takeaway>Trace에는 callback duration만 남기지 말고 hardware timer capture, job release/start/finish, shadow write, latch와 applied sequence를 같은 cycle identity로 남겨야 합니다.</Takeaway>
      </NlpSection>

      <NlpSection id="sample-actuate" marker="03" tone="blue" question="두 전류 ADC 값을 몇 µs 차이로 읽는 것이 왜 제어 오차가 될까?" title="Peripheral timer가 sample · compute · actuate 순서를 정의한다">
        <p>
          Current controller는 여러 phase current가 같은 electrical state를 나타낸다고 가정합니다. Software가 ADC A를 시작하고 함수를 거쳐 ADC B를 시작하면 빠르게 변하는 current를
          서로 다른 시각에 읽습니다. 이 channel skew는 noise가 아니라 모델과 맞지 않는 observation입니다. PWM timer compare event가 ADC trigger와 DMA를 시작하고,
          computation이 정해진 quiet window 안에서 끝나 shadow register에 쓰이도록 hardware chain을 구성하면 sample origin과 output phase가 반복 가능합니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{\Delta t_{ch}}_{\text{채널 표본 시각차}}&=\underbrace{|t_{acq,a}-t_{acq,b}|}_{\text{두 ADC 실제 획득시각 차이}}\\\underbrace{|\Delta i|}_{\text{시각차가 만든 전류 불일치}}&\lesssim\underbrace{\max_t|di/dt|}_{\text{가장 빠른 전류 변화}}\underbrace{\Delta t_{ch}}_{\text{동시성 오차}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="두 번째 식은 local slope bound로 skew error를 상계합니다. 실제 ADC aperture, sensor bandwidth, switching transient와 calibration error는 별도 항입니다. Hardware simultaneous trigger도 analog front-end가 같다는 뜻은 아닙니다."
          symbols={[[raw`t_{acq,a},t_{acq,b}`, '각 ADC sample-and-hold가 실제 값을 고정한 시각'], [raw`di/dt`, '운영 범위에서 phase current가 바뀌는 최대 속도'], [raw`\Delta i`, '동일 시각이라고 가정했지만 실제로 생긴 channel inconsistency']]} />
        <SampleActuateLab />
        <EvidenceSequence items={[
          { signal: 'Timer origin', meaning: 'Peripheral counter의 어느 compare/update event가 cycle 0인가?', response: 'RTOS tick이 아니라 PWM timer capture로 cycle identity를 남깁니다.' },
          { signal: 'Acquisition event', meaning: 'ADC sample-and-hold와 encoder latch가 정확히 언제 발생했는가?', response: 'Software call time이 아니라 peripheral event timestamp를 사용합니다.' },
          { signal: 'Data ready', meaning: 'DMA transfer가 끝나고 CPU가 일관된 buffer를 볼 수 있는가?', response: 'Completion flag와 ownership transition 뒤에만 control task를 release합니다.' },
          { signal: 'Output latch', meaning: '새 duty가 active compare에 언제 옮겨졌는가?', response: '늦으면 다음 cycle로 분류하고 old duty 유지 사실을 acknowledgement에 기록합니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="isr-dma" marker="04" tone="amber" question="DMA를 썼는데도 왜 sample이 섞이고 high-priority interrupt가 늦을까?" title="ISR과 DMA를 bounded ownership protocol로 만든다">
        <p>
          NVIC는 peripheral interrupt를 RTOS task보다 먼저 중재합니다. 따라서 task priority만 잘 정해도 높은 interrupt가 길게 실행되면 모든 task release가 늦습니다.
          ISR은 status를 확인하고 timestamp/sequence를 고정하며 bounded data를 넘긴 뒤 handler task를 깨우는 짧은 경로로 유지합니다. 문자열 format, 동적 allocation,
          blocking driver call과 대량 log는 critical ISR 밖에서 처리합니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{t_{task\ ready}}_{\text{처리 작업 준비 시각}}
          &=\underbrace{t_{irq}}_{\text{주변장치 사건}}+\underbrace{B_{irq}}_{\text{상위 인터럽트 대기}}\\
          &\quad+\underbrace{C_{isr}}_{\text{현재 ISR 실행}}\\
          \underbrace{S_{irq}}_{\text{준비 시각 여유}}
          &=\underbrace{D_{release}-\left(B_{irq}+C_{isr}\right)}_{\text{허용 지연에서 실행 경로를 뺌}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="RTOS response analysis 전에 interrupt release path를 먼저 상계합니다. FreeRTOS API를 부르는 ISR은 port의 syscall priority boundary를 지켜야 하며, 더 높은 IRQ는 kernel과 무관하게 task release를 지연시킬 수 있습니다."
          symbols={[[raw`t_{irq}`, 'Hardware가 interrupt condition을 만든 시각'], [raw`B_{irq}`, '더 높은 priority interrupt nesting과 mask 구간'], [raw`C_{isr}`, '현재 ISR의 worst-case execution'], [raw`D_{release}`, 'Control handler가 ready여야 하는 최대 지연']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{state(buf_n)}_{\text{버퍼 상태}}
          &=\underbrace{DMA}_{\text{주변장치가 씀}}\to\underbrace{ready}_{\text{전송 완료}}\\
          &\quad\to\underbrace{consumer}_{\text{제어 작업이 읽음}}\to\underbrace{free}_{\text{반환 완료}}\\
          \underbrace{reuse(buf_n)}_{\text{생산자가 다시 사용}}
          &\Rightarrow\underbrace{state=free}_{\text{소비 완료를 먼저 확인}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Ping-pong이나 ring buffer의 안전성은 개수 자체가 아니라 owner transition에 있습니다. Producer가 consumer 완료 전 같은 slot로 돌아오면 torn sample이 생기며, cache가 있는 MCU에서는 DMA/CPU visibility 처리도 이 transition에 포함됩니다."
          symbols={[[raw`DMA`, 'Peripheral에서 memory로 쓰는 producer'], [raw`ready`, 'Transfer complete와 metadata가 확정된 상태'], [raw`consumer`, 'Control task가 읽는 동안의 exclusive/read ownership'], [raw`free`, '다음 DMA cycle에 반환 가능한 상태']]} />
        <IsrDmaLab />
        <Misconception>DMA는 CPU copy를 줄일 뿐 lifetime, ordering, coherency와 overrun policy를 자동으로 해결하지 않습니다. Buffer 수를 늘리면 burst tolerance는 늘지만 오래된 sample을 순서대로 처리하는 queue가 될 수 있으므로 age와 overrun을 함께 봐야 합니다.</Misconception>
      </NlpSection>

      <NlpSection id="rtos-schedule" marker="05" tone="violet" question="CPU 사용률이 60%인데도 어떤 task가 deadline을 놓칠 수 있을까?" title="RTOS task list를 schedulability model로 바꾼다">
        <p>
          FreeRTOS single-core 기본 정책은 fixed-priority preemptive highest-ready-first입니다. 이름이 `CurrentTask`, `TelemetryTask`라는 사실은 분석 정보가 아닙니다.
          각 task에 period 또는 minimum inter-arrival, WCET, relative deadline, release jitter, priority, blocking, stack, shared resource와 preemption/ISR overhead를 기록해야 합니다.
          평균 CPU usage는 idle time을 말할 뿐 simultaneous release에서 low-priority job이 언제 끝나는지 말하지 않습니다.
        </p>
        <ContractLedger items={[
          { label: 'T or minimum inter-arrival', contract: 'Periodic release 간격 또는 burst가 다시 올 수 있는 최소 간격', failure: '평균 rate로 쓰면 짧은 window의 request 수를 과소평가합니다.' },
          { label: 'C / WCET', contract: '운영 path, memory, interrupt와 instrumentation 경계를 포함한 upper execution bound', failure: '평균·벤치마크·debug-off 숫자를 C로 넣으면 proof input이 아닙니다.' },
          { label: 'D and J', contract: '물리 consequence에서 정한 deadline과 nominal release의 최대 흔들림', failure: 'D=T를 습관적으로 가정하거나 jitter를 빼면 late latch를 놓칩니다.' },
          { label: 'B and resources', contract: 'Lower-priority critical section, bus, driver와 non-preemptive region의 최대 blocking', failure: 'Utilization이 낮아도 high task가 lock 뒤에서 멈춥니다.' },
        ]} />
        <MathFormula display>{raw`\underbrace{U}_{\text{주기 작업의 CPU 수요}}=\sum_{i=1}^{m}\underbrace{\frac{C_i}{T_i}}_{\text{작업 }i\text{의 실행시간 비율}}`}</MathFormula>
        <FormulaNote
          meaning="U는 첫 load 검사이지 complete response proof가 아닙니다. ISR, context switch, blocking, cache/memory interference, dependency와 aperiodic recovery가 C 또는 별도 interference로 포함되지 않으면 실제 demand보다 작습니다."
          symbols={[[raw`C_i`, 'Preemption이 없을 때 task i 한 job의 validated WCET'], [raw`T_i`, 'Task i의 period 또는 model이 허용한 release interval'], [raw`m`, '같은 분석 CPU를 공유하는 periodic task 수']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{U_{RM}^{sufficient}(m)}_{\text{RM의 보수적 통과선}}
          &=\underbrace{m\left(2^{1/m}-1\right)}_{\text{독립 주기 작업에서의 최소 상한}}\\
          \underbrace{\lim_{m\to\infty}U_{RM}^{sufficient}(m)}_{\text{작업 수가 많아질 때}}
          &=\underbrace{\ln 2}_{\text{약 }0.693}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Bound 아래면 Liu–Layland 가정의 RM schedule은 schedulable하다는 충분조건입니다. Bound를 넘었다고 반드시 실패는 아니며 exact response test나 harmonic period 구조로 통과할 수 있습니다. 가정 밖의 MCU에 69%를 안전 상수처럼 복사하면 안 됩니다."
          symbols={[[raw`m`, 'Rate-monotonic fixed priorities를 쓰는 independent periodic task 수'], [raw`U_{RM}^{sufficient}`, '모든 task set을 보장하는 보수적 utilization threshold'], [raw`D=T`, '각 job deadline이 다음 release와 같다는 논문 가정']]} />
        <RtosScheduleLab />
        <Takeaway>Admission control은 task를 생성한 뒤 CPU graph를 보는 일이 아닙니다. 변경된 C, T, D, J, B와 overhead로 분석을 다시 실행하고 worst-state trace가 model boundary 안에 있는지 확인하는 배포 gate입니다.</Takeaway>
      </NlpSection>

      <NlpSection id="priority-inversion" marker="06" tone="amber" question="가장 높은 priority current task가 왜 낮은 telemetry task 때문에 멈출까?" title="Shared resource blocking을 response equation에 넣는다">
        <p>
          Low-priority task가 SPI/encoder mutex를 가진 순간 high-priority current task가 같은 resource를 요청하면 high는 block됩니다. 그 사이 resource와 무관한 medium task가
          low를 preempt하면 high는 직접 lock hold보다 더 오래 기다립니다. 이것이 unbounded priority inversion의 기본 구조입니다. Priority inheritance는 low owner를 임시로 끌어올려
          medium interference를 제거하지만 critical section 자체와 nested locks는 남습니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{R_i^{(k+1)}}_{\text{다음 응답시간 추정}}
          &=\underbrace{C_i}_{\text{자기 실행}}+\underbrace{B_i}_{\text{하위 작업에 의한 막힘}}\\
          &\quad+\underbrace{\sum_{h\in hp(i)}\left\lceil\frac{R_i^{(k)}+J_h}{T_h}\right\rceil C_h}_{\text{응답 구간에 끼어드는 상위 작업 실행}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Fixed-point가 수렴해 Ri≤Di이면 선언한 fixed-priority model 안에서 task i가 deadline을 만족합니다. Blocking protocol이 달라지면 Bi가 달라지고, release jitter는 response window에 더 많은 higher-priority jobs를 넣을 수 있습니다."
          symbols={[[raw`hp(i)`, 'Task i보다 높은 fixed-priority task 집합'], [raw`B_i`, 'Resource protocol 아래 task i가 겪는 최대 lower-priority blocking'], [raw`J_h`, 'Higher task h의 release jitter'], [raw`R_i^{(k)}`, 'Interference count가 안정될 때까지 반복하는 response estimate']]} />
        <PriorityInversionLab />
        <ContractLedger items={[
          { label: 'Priority inheritance mutex', contract: '기다리는 high priority를 lock owner가 임시 상속', failure: 'Basic inheritance는 nested/multiple mutex의 모든 blocking을 최소화하지 않습니다.' },
          { label: 'Priority ceiling', contract: 'Resource 사용 task의 ceiling으로 entry와 blocking 구조를 제한', failure: 'Resource graph와 ceiling을 잘못 선언하면 과도한 serialization 또는 deadlock이 남습니다.' },
          { label: 'Bus-owner task', contract: '한 task가 peripheral transaction을 소유하고 bounded request queue를 처리', failure: 'Owner priority와 queue policy가 command semantics에 맞지 않으면 새 bottleneck이 됩니다.' },
          { label: 'Lock-free snapshot', contract: 'Versioned immutable state를 copy/swap해 reader critical section을 제거', failure: 'Multiword atomicity, ABA, memory order와 lifetime을 무시하면 silent torn state가 됩니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="fieldbus-time" marker="07" tone="blue" question="EtherCAT link가 정상인데 왜 여섯 축이 같은 순간에 움직이지 않을까?" title="Frame arrival과 synchronized target time을 분리한다">
        <p>
          Fieldbus가 operational이라는 것은 frame exchange와 protocol health가 정상이라는 뜻입니다. 지금 command가 current epoch인지, target cycle 전에 도착했는지,
          여러 drive가 같은 시각에 적용했는지는 별도 contract입니다. CAN에서는 arbitration priority와 worst-case bus occupancy가 response에 들어가고,
          EtherCAT cyclic process data에서는 Distributed Clocks가 propagation을 보정한 local time으로 acquisition/latch를 맞출 수 있습니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{A_{cmd}}_{\text{드라이브가 본 명령 나이}}&=\underbrace{t_{apply}^{device}-t_{create}^{source}}_{\text{생성부터 실제 적용까지}}\\\underbrace{\Delta t_{axes}}_{\text{여러 축의 적용 시각차}}&=\underbrace{\max_j t_{apply,j}-\min_j t_{apply,j}}_{\text{가장 늦은 축과 빠른 축 차이}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Host와 device clock이 동기화되지 않으면 첫 식을 직접 뺄 수 없습니다. 같은 synchronized domain, offset bound 또는 cycle identity가 필요합니다. Multi-axis coordination은 평균 arrival latency가 아니라 applied times의 spread를 봅니다."
          symbols={[[raw`t_{create}^{source}`, 'Host/controller가 command identity를 만든 source time'], [raw`t_{apply}^{device}`, 'Drive가 PWM에 command를 latch한 synchronized device time'], [raw`t_{apply,j}`, 'j번째 axis의 실제 적용 time']]} />
        <FieldbusClockLab />
        <EvidenceSequence items={[
          { signal: 'Link health', meaning: 'CRC, working counter, bus-off와 topology가 정상인가?', response: '실패하면 power-safe path로 가되 이것을 command freshness와 혼동하지 않습니다.' },
          { signal: 'Identity health', meaning: 'Source, sequence, epoch와 mode가 현재 supervisor transaction에 속하는가?', response: 'Restart 전 history와 duplicate/out-of-order frame을 reject합니다.' },
          { signal: 'Timing health', meaning: 'Target cycle 전에 도착했고 device clock offset/skew가 예산 안인가?', response: '늦은 scheduled command는 다음 cycle에 임의 실행하지 않고 declared fallback을 적용합니다.' },
          { signal: 'Actuation acknowledgement', meaning: '각 axis가 어느 sequence를 어느 cycle에 적용했고 driver/power 상태는 무엇인가?', response: 'Six-axis skew와 missing ack가 limit을 넘으면 coordinated motion을 stop/degrade합니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="numeric-memory" marker="08" tone="violet" question="코드가 deadline 안에 끝났는데 왜 torque 부호가 뒤집히거나 timeout이 71분마다 깨질까?" title="Memory와 숫자 표현도 real-time safety contract다">
        <p>
          Dynamic allocation, formatted logging, stack growth와 unbounded queue는 execution time과 failure path를 data-dependent하게 만듭니다. Critical path는 startup 때 memory를 확보하고,
          stack high-water와 queue overrun을 관찰하며, binary trace를 bounded buffer에 기록해 낮은 priority에서 내보내는 편이 분석 가능합니다. 숫자도 같은 원리입니다.
          Fixed-point scale와 range, saturation, signedness, unit conversion, NaN/Inf 정책을 message와 firmware 양쪽에서 고정해야 합니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{\Delta t}_{\text{래핑에 안전한 경과시간}}
          &=\underbrace{(t_{now}-t_{then})\bmod 2^w}_{\text{부호 없는 모듈러 뺄셈}}\\
          0\le\Delta t&<\underbrace{2^{w-1}}_{\text{모호하지 않게 비교할 수 있는 구간}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Unsigned counter wrap는 오류가 아니라 modular clock입니다. 비교 interval이 half-range보다 짧다는 invariant 아래 subtraction 결과가 올바른 elapsed가 됩니다. Timestamp를 signed integer로 바꾸거나 absolute 대소 비교하면 wrap 근처에서 큰 음수/양수가 생깁니다."
          symbols={[[raw`w`, 'Free-running timer counter의 bit width'], [raw`t_{now},t_{then}`, '같은 modular counter에서 읽은 두 timestamp'], [raw`2^{w-1}`, '순서가 모호하지 않게 보장할 수 있는 half-range interval']]} />
        <MathFormula display>{raw`\begin{aligned}\underbrace{x_{raw}}_{\text{정수 표현}}&=\underbrace{round(s\,x_{physical})}_{\text{배율에 맞춰 양자화}}\\\underbrace{x_{safe}}_{\text{저장 가능한 값}}&=\underbrace{clip(x_{raw},x_{min},x_{max})}_{\text{래핑 대신 포화}}\\\underbrace{G_{num}}_{\text{수치 안전문}}&=\underbrace{unit_{ok}\land range_{ok}\land finite_{ok}}_{\text{단위·범위·유한성 검증}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Saturation은 잘못된 큰 command를 안전하게 만드는 완결책이 아니라 wrap과 sign reversal을 막고 fault를 드러내는 마지막 numeric boundary입니다. Scale가 커지면 resolution은 좋아지지만 representable physical range는 줄어듭니다."
          symbols={[[raw`s`, 'Physical unit 한 단위를 integer count로 바꾸는 scale'], [raw`x_{min},x_{max}`, 'Chosen integer type이 표현하는 bound'], [raw`finite_{ok}`, 'Floating-point NaN/Inf 또는 invalid sensor state 차단']]} />
        <NumericMemoryLab />
        <Misconception>Heap을 한 번도 쓰지 않는다고 timing이 자동 보장되지는 않습니다. Stack overflow, interrupt nesting, library lock, flash wait state, DMA contention과 unbounded loop도 WCET를 흔듭니다. Static allocation은 분석 가능한 경계를 만드는 한 조건입니다.</Misconception>
      </NlpSection>

      <NlpSection id="fault-ladder" marker="09" tone="green" question="MCU heartbeat가 살아 있는데도 왜 motor power를 즉시 꺼야 할까?" title="Watchdog를 physical actuation evidence까지 확장한다">
        <p>
          Watchdog task가 실행됐다는 사실은 scheduler와 CPU의 한 경로가 살아 있다는 뜻일 뿐입니다. Input이 fresh한지, control result가 latch 전에 끝났는지,
          numeric/limit 검사가 통과했는지, gate driver가 실제 enabled인지, motor current가 command에 반응했는지까지 증명하지 않습니다. 더 나쁜 패턴은
          high-priority task 시작과 동시에 watchdog을 kick하고 이후 계산·output validation 실패를 숨기는 것입니다.
        </p>
        <EmbeddedFailureLegend />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{H_{input}}_{\text{입력 건강}}
          &=\underbrace{epoch_{ok}}_{\text{현재 실행}}\land\underbrace{fresh_{sensor}}_{\text{신선한 센서}}\\
          &\quad\land\underbrace{sample_{sync}}_{\text{동시 표본}}\\
          \underbrace{H_{compute}}_{\text{계산 건강}}
          &=\underbrace{deadline_{ok}}_{\text{마감 통과}}\land\underbrace{numeric_{ok}}_{\text{수치 안전}}\\
          &\quad\land\underbrace{buffer_{ok}}_{\text{버퍼 소유권}}\\
          \underbrace{H_{power}}_{\text{출력 건강}}
          &=\underbrace{driver_{ok}}_{\text{드라이버 정상}}\land\underbrace{seq_{applied}}_{\text{적용 순서 확인}}\\
          &\quad\land\underbrace{response_{observed}}_{\text{응답 관측}}\\
          \underbrace{enable_{PWM}}_{\text{최종 전력 안전문}}
          &=\underbrace{H_{input}\land H_{compute}\land H_{power}}_{\text{모든 층이 동의}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Software monitor가 멈추는 고장까지 고려하면 overcurrent comparator와 gate-disable처럼 independent hardware protection이 먼저 energy를 차단해야 합니다. Firmware는 원인을 latch하고 safe output을 유지하며 host는 observed power state를 받아 supervised reset을 수행합니다."
          symbols={[[raw`fresh_{sensor}`, '현재 control cycle의 acquisition-time measurement'], [raw`deadline_{ok}`, 'Validated output이 physical latch 전에 완성됨'], [raw`seq_{applied}`, 'Driver가 current epoch command를 실제 적용함'], [raw`response_{observed}`, 'Encoder/current 등 physical response가 plausibility window 안에 있음']]} />
        <MathFormula display>{raw`\begin{aligned}
          \underbrace{R_{host\to physical}}_{\text{전체 물리 응답}}
          &=\underbrace{R_{ROS2}}_{\text{호스트}}+\underbrace{R_{bus}}_{\text{버스}}\\
          &\quad+\underbrace{R_{device}}_{\text{device}}+\underbrace{R_{power}}_{\text{power·plant}}
        \end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="단순 합은 각 항의 clock/identity와 worst-case dependency가 맞을 때만 의미가 있습니다. 이전 ROS 2 글의 actuator callback은 이 식의 중간점이며, 최종 deadline은 observed physical effect 또는 safe power-off까지 닫혀야 합니다."
          symbols={[[raw`R_{ROS2}`, 'Source observation에서 host actuator/bridge callback까지의 bound'], [raw`R_{bus}`, 'Arbitration/cycle/queue를 포함한 command 전달 bound'], [raw`R_{device}`, 'Receive부터 validated PWM latch까지의 embedded response'], [raw`R_{power}`, 'Gate driver와 plant가 measurable response를 만드는 시간']]} />
        <FaultLadderLab />
        <EvidenceSequence items={[
          { signal: 'Hardware trip', meaning: 'Overcurrent/overvoltage/thermal signal이 MCU progress와 독립적으로 energy를 차단하는가?', response: 'Gate disable latency와 safe-state polarity를 oscilloscope/fault injection으로 검증합니다.' },
          { signal: 'Firmware latch', meaning: '첫 fault cause, cycle, sequence와 measurement snapshot을 보존하고 PWM restart를 막는가?', response: 'Automatic retry보다 cause-preserving latched state를 supervisor에 전달합니다.' },
          { signal: 'Host observation', meaning: 'Requested command echo가 아니라 applied sequence, driver enable과 measured response를 받는가?', response: 'Ack deadline을 넘으면 link가 살아 있어도 coordinated motion을 중지합니다.' },
          { signal: 'Supervised reset', meaning: 'Fault clear, calibration, zero command, current epoch와 hardware state를 다시 transaction으로 확인하는가?', response: '원인 없는 power-cycle loop를 금지하고 re-enable evidence를 기록합니다.' },
        ]} />
        <CapabilityCheck
          title="이 글만으로 통과해야 하는 진단"
          items={[
            'Requested, accepted, applied, observed command를 sequence와 cycle로 분리한다.',
            'Mode·unit·epoch·target cycle·validity·limit·fallback·ack가 있는 setpoint envelope을 설계한다.',
            'Function finish와 PWM latch deadline을 구분하고 applied cycle을 계산한다.',
            'Hardware-triggered ADC/encoder sample의 channel skew와 output phase를 검산한다.',
            'NVIC, ISR, DMA completion, task release와 buffer ownership 경로를 추적한다.',
            'Task마다 T/min inter-arrival, C, D, J, priority, B, stack와 resource ledger를 작성한다.',
            'Liu–Layland RM bound를 충분조건과 명시적 가정 안에서만 사용한다.',
            'Blocking과 release jitter가 있는 fixed-priority response iteration을 구성한다.',
            'Priority inversion을 inheritance, ceiling, bus owner와 snapshot 중 적절한 protocol로 제한한다.',
            'Link health, command freshness, target cycle과 multi-axis clock skew를 분리한다.',
            'Timer wrap, fixed-point scale/range, saturation, NaN, stack과 log budget을 검증한다.',
            'Hardware trip, firmware latch, host observation과 supervised restart의 fault ladder를 만든다.',
            'Host ROS 2 response부터 bus, device latch와 physical acknowledgement까지 하나의 deadline으로 닫는다.',
            'BLDC/PMSM electromagnetic model과 FOC가 이 글 다음의 별도 기반임을 설명한다.',
          ]}
        />
        <SourceNotes sources={[
          { label: 'FreeRTOS task priorities', href: 'https://www.freertos.org/Documentation/02-Kernel/02-Kernel-features/01-Tasks-and-co-routines/03-Task-priorities', note: 'Highest-ready task, priority range와 equal-priority time slicing의 현재 공식 설명.' },
          { label: 'FreeRTOS scheduling: single-core, AMP and SMP', href: 'https://freertos.org/Documentation/02-Kernel/02-Kernel-features/01-Tasks-and-co-routines/04-Task-scheduling', note: 'Fixed-priority preemption, starvation, event blocking과 multicore boundary.' },
          { label: 'FreeRTOS interrupt configuration', href: 'https://www.freertos.org/Documentation/02-Kernel/03-Supported-devices/02-Customization', note: 'ISR priority/API boundary와 ISR work를 짧게 유지하고 handler task를 깨우는 현재 guidance.' },
          { label: 'FreeRTOS mutexes', href: 'https://freertos.org/Real-time-embedded-RTOS-mutexes.html', note: 'Mutex priority inheritance, ISR 사용 금지와 simplified inheritance limitations.' },
          { label: 'Arm Cortex-M3 processor datasheet', href: 'https://developer.arm.com/-/media/Arm%20Developer%20Community/PDF/Processor%20Datasheets/Arm%20Cortex-M3%20Processor%20Datasheet.pdf', note: 'Core-integrated NVIC와 configurable nested interrupt priority의 hardware foundation.' },
          { label: 'ROS 2 Rolling rclc executor', href: 'https://docs.ros.org/en/rolling/p/rclc/', note: 'User-defined order, trigger conditions, scheduling configuration와 LET-style copy-in/period boundary.' },
          { label: 'EtherCAT Technology', href: 'https://www.ethercat.org/en/technology.html', note: 'Distributed Clocks, propagation compensation와 synchronized local acquisition intent.' },
          { label: 'EtherCAT Implementation Guide', href: 'https://www.ethercat.org/download/documents/ETG2200_V3i2i3_G_R_EtherCATImplementationGuide.pdf', note: 'SubDevice implementation, process data와 distributed-clock synchronization boundary.' },
          { label: 'Liu & Layland (1973), Scheduling Algorithms for Multiprogramming in a Hard-Real-Time Environment', href: 'https://www.cs.cmu.edu/~ssaewong/research/liu_layland.pdf', note: 'Critical instant, RM optimal fixed-priority assignment, utilization bound, deadline-driven scheduling과 five assumptions의 원 논문.' },
        ]} />
        <Link to={articlePath('ai', 'robot-motor-drive-foc')} className="not-prose group my-8 block rounded-md border border-border p-4 transition-colors hover:border-violet-600/35 hover:bg-violet-500/[0.035]"><span className="flex items-center justify-between gap-3"><strong className="text-sm">다음 물리 기반 · Motor Drive & Field-Oriented Control</strong><ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" /></span><span className="mt-2 block text-xs leading-relaxed text-muted-foreground">이 글이 보장한 ADC sample과 PWM latch 안에서 torque request를 실제 3상 current, d-q voltage, SVPWM, gate state와 electromagnetic torque로 변환합니다.</span></Link>
      </NlpSection>
    </>
  );
}
