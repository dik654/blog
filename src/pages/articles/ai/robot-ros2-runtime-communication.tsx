import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, Takeaway } from './nlp-shared';
import {
  EndToEndRuntimeLab,
  ExecutorTimelineLab,
  InterfaceContractLab,
  LifecycleSupervisorLab,
  OwnershipCompositionLab,
  QosContractLab,
  QueueOverloadLab,
  RuntimeQualificationLab,
  RuntimeContractStrip,
  RuntimeFailureLegend,
  RuntimeGateLab,
  TimeTfLab,
} from './robot-ros2-runtime/viz/RobotRos2RuntimeViz';

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

function DiagnosticSequence({
  items,
}: {
  items: Array<{ signal: string; question: string; response: string }>;
}) {
  return (
    <ol className="not-prose my-6 grid gap-2">
      {items.map((item, index) => (
        <li key={item.signal} className="grid min-w-0 grid-cols-[2.25rem_minmax(0,1fr)] gap-3 border-b border-border py-3">
          <span className="font-mono text-lg font-black text-teal-700/55 dark:text-teal-300/55">{String(index + 1).padStart(2, '0')}</span>
          <div className="min-w-0">
            <p className="text-sm font-bold">{item.signal}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.question}</p>
            <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground">판정 후 행동 · {item.response}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function RobotRos2RuntimeCommunication() {
  return (
    <>
      <BeginnerOpening
        title="주소가 맞는 택배도 늦거나 내용이 다르면 바로 사용할 수 없다"
        description={<>ROS 2에서 한 기능을 맡은 프로그램 단위를 <strong>node</strong>, 이름 붙은 전달 통로를 <strong>topic</strong>이라고 한다. 정보를 보내는 쪽이 <strong>publisher</strong>, 받는 쪽이 <strong>subscriber</strong>다. 서로를 발견했다는 사실은 주소가 맞다는 뜻이지, 내용이 최신이고 제시간에 처리됐다는 뜻은 아니다.</>}
        familiarScene={<>냉장 식품 택배가 정확한 집에 도착했어도 사흘 늦었다면 먹을 수 없다. 상자 이름이 같아도 단위가 다르거나, 창고에 오래 쌓인 상자를 먼저 꺼내면 받는 사람은 잘못된 판단을 한다. 로봇의 카메라 영상과 모터 명령도 같은 시간 계약이 필요하다.</>}
        steps={[
          { label: '보내고 받을 상대를 찾는다', detail: '프로그램과 통로의 이름·자료 형식이 맞는지 확인한다.' },
          { label: '최신 자료를 제때 처리한다', detail: '대기열과 실행 순서 때문에 오래된 정보가 남지 않게 한다.' },
          { label: '실제 동작까지 시간을 잰다', detail: '센서가 측정한 순간부터 모터 명령이 적용될 때까지 추적한다.' },
        ]}
      />
      <QuestionLead
        label="이제 확인할 질문"
        question="보내는 프로그램과 받는 프로그램이 서로 연결됐다고 표시되면 데이터 경로는 완성된 것일까?"
        answer="아니다. 연결 그림은 누가 누구와 말하려는지만 보여 준다. 값의 뜻과 단위, 전달 조건, 대기열의 신선도, 실제 처리 순서, 준비 상태, 시간과 좌표, 센서 측정부터 모터 적용까지의 제한 시간을 모두 통과해야 물리적으로 사용할 수 있다."
      />

      <NlpSection id="runtime-contract" marker="01" tone="teal" question="프로그램 사이의 연결선이 보인다고 정보가 제때 도착한 것은 아닐 수 있다" title="연결 관계와 실제로 쓸 수 있는 전달 경로를 구분한다">
        <p>
          로봇 코드에서 <code>/camera/image</code>, <code>/odom</code>, <code>/cmd_vel</code>을 연결하는 일은 논리 구조를 만드는 일입니다.
          실제 sample은 sensor driver에서 만들어져 DDS/RMW의 queue에 들어가고, executor가 ready work를 고른 뒤 callback을 끝까지 실행하며,
          다음 node로 다시 publish되어 마지막에는 motor command가 됩니다. 이 중 한 층이라도 늦거나 의미가 다르면 graph는 멀쩡해 보여도 robot은 오래된 세계에 반응합니다.
        </p>
        <RuntimeContractStrip />
        <ConceptPrimer
          items={[
            { term: 'Logical graph', meaning: 'Node와 topic/service/action의 연결 관계입니다.', why: '기능 dependency를 표현하지만 process, thread, queue와 실행 순서를 아직 정하지 않습니다.' },
            { term: 'Endpoint', meaning: '실제 publisher/subscription/service/action client·server 객체입니다.', why: 'Name과 type뿐 아니라 requested/offered QoS가 맞아야 data path가 생깁니다.' },
            { term: 'Callback', meaning: 'Subscription, timer, service, action, future event를 처리하는 실행 단위입니다.', why: 'ROS 2에서 대부분의 user work는 callback이고, executor가 언제 어느 thread에서 실행할지 결정합니다.' },
            { term: 'Physical contract', meaning: '특정 시각과 frame의 관측이 deadline 안에 현재 goal의 command로 변환되는 조건입니다.', why: 'Software graph의 성공을 실제 robot safety와 연결하는 마지막 불변식입니다.' },
          ]}
        />
        <MathFormula display>{raw`\begin{aligned}\underbrace{m_{meaning}}_{\text{값의 뜻}}&=\underbrace{(type,version,value,unit)}_{\text{해석을 고정}}\\\underbrace{m_{space}}_{\text{공간·시간}}&=\underbrace{(frame,t_{acq},\Sigma)}_{\text{같은 상태를 가리킴}}\\\underbrace{m_{identity}}_{\text{실행 소속}}&=\underbrace{(source,seq,goal,revision)}_{\text{증거 계보를 보존}}\\\underbrace{m_{valid}}_{\text{사용 조건}}&=\underbrace{(t_{valid},health)}_{\text{오래된 값 차단}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Serialization type만 같아서는 충분하지 않습니다. 예를 들어 geometry_msgs/Twist라는 같은 type도 어느 frame의 속도인지, 어느 goal epoch의 명령인지, 언제 폐기할지 없으면 restart 뒤 잘못 재생될 수 있습니다."
          symbols={[[raw`m`, 'Actuator까지 보존해야 하는 message contract'], [raw`t_{acq}`, '값을 실제로 얻은 source acquisition time'], [raw`\Sigma`, '값의 uncertainty/covariance와 해석 단위'], [raw`t_{valid}`, '이 시간이 지나면 message를 사용하지 않는 validity horizon']]}
        />
        <ContractLedger items={[
          { label: 'Topic', contract: '발행 시점을 producer가 정하는 지속적·비동기 stream', failure: '확인 응답이나 cancel이 필요한 장기 동작을 넣으면 실행 상태를 소유할 곳이 사라집니다.' },
          { label: 'Service', contract: '짧고 빠르게 끝나는 request/response, 가능하면 idempotent query', failure: '긴 물리 동작을 blocking service로 만들면 timeout·취소·feedback과 executor progress가 깨집니다.' },
          { label: 'Action', contract: 'Goal identity, feedback, result, cancel/preemption을 가진 장기 동작', failure: 'Server가 cancel을 처리할 callback budget이 없으면 API상 취소 가능해도 robot은 멈추지 않습니다.' },
          { label: 'Message meaning', contract: 'Type + unit + frame + stamp + covariance + identity + validity', failure: '잘 전달된 bit가 잘못된 세계 상태나 오래된 command가 됩니다.' },
        ]} />
        <InterfaceContractLab />
        <Misconception>Topic, service, action은 단순한 문법 선택이 아닙니다. 누가 실행 state를 소유하고, 얼마나 오래 기다리며, feedback·timeout·cancel을 어떤 경로로 보장할지 정하는 분산 상태 머신 선택입니다.</Misconception>
      </NlpSection>

      <NlpSection id="discovery-readiness" marker="02" tone="blue" question="`ros2 topic list`에 보이면 왜 data가 오지 않거나 command가 나가지 않을까?" title="Discovery, matching, readiness와 health를 분리한다">
        <p>
          DDS discovery는 같은 domain에서 participant와 endpoint 정보를 교환합니다. 같은 topic name과 compatible type을 가진 endpoint가 보인 뒤에도
          QoS requested/offered 조건이 맞아야 실제 match가 생깁니다. 그리고 match는 node가 configured/active라는 뜻이 아니며,
          Active는 첫 유효 sample이 도착했다거나 callback이 deadline을 지킨다는 뜻도 아닙니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{G_{link}}_{\text{통신 gate}}&=\underbrace{D}_{\text{발견}}\land\underbrace{M_{type,qos}}_{\text{호환}}\\\underbrace{G_{ready}}_{\text{실행 gate}}&=\underbrace{L_{active}}_{\text{활성}}\land\underbrace{F_{data}}_{\text{신선}}\land\underbrace{H_{runtime}}_{\text{건강}}\\\underbrace{G_{safe}}_{\text{명령 허용}}&=\underbrace{G_{link}\land G_{ready}}_{\text{두 gate 모두 통과}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="AND gate이므로 한 조건만 빠져도 command는 닫혀야 합니다. Graph visibility D 하나를 전체 readiness로 대체하면 inactive node나 stale stream을 정상으로 오판합니다."
          symbols={[[raw`D`, 'DDS graph에서 endpoint를 발견했는가'], [raw`M_{type,qos}`, 'Type과 requested/offered QoS가 compatible한가'], [raw`L_{active}`, 'Managed node가 Active state인가'], [raw`F_{data}`, '현재 epoch의 valid sample이 freshness budget 안에 있는가'], [raw`H_{runtime}`, 'Deadline, TF, queue, callback과 application health가 정상인가']]}
        />
        <RuntimeGateLab />
        <DiagnosticSequence items={[
          { signal: 'Graph event', question: 'Publisher/subscription endpoint가 기대한 domain, namespace, topic과 type으로 발견됐는가?', response: '없으면 domain/network/name/type부터 고치고 뒤 gate를 해석하지 않습니다.' },
          { signal: 'Matched event', question: 'Endpoint count와 incompatible QoS event가 기대와 같은가?', response: 'QoS offer/request를 양쪽에서 출력해 policy별 첫 mismatch를 찾습니다.' },
          { signal: 'Lifecycle state', question: 'Node가 configured를 거쳐 Active이며 required resource/calibration이 준비됐는가?', response: 'Inactive라면 graph를 유지한 채 command와 functional processing을 차단합니다.' },
          { signal: 'First valid sample', question: '현재 epoch, frame, stamp와 covariance를 가진 data가 deadline 안에 들어왔는가?', response: 'Old history나 invalid stamp는 endpoint match와 분리해 폐기합니다.' },
          { signal: 'Runtime health', question: 'Queue age, callback duration, TF lookup, deadline/liveliness와 end-to-end age가 예산 안인가?', response: '원인에 따라 degrade, cancel, stop, reconfigure 또는 restart합니다.' },
        ]} />
        <Takeaway>“연결됐다”는 한 문장을 discovery, compatibility, active, fresh, healthy의 다섯 관찰로 분해하면 silent failure가 어느 층에서 생겼는지 재현 가능하게 좁힐 수 있습니다.</Takeaway>
      </NlpSection>

      <NlpSection id="qos-contract" marker="03" tone="violet" question="Reliability를 높이면 언제 더 안전하고, 언제 오히려 더 늦어질까?" title="QoS는 품질 슬라이더가 아니라 requested/offered 계약이다">
        <p>
          Publisher는 제공할 수 있는 품질을 <em>offer</em>하고 subscriber는 필요한 최소 품질을 <em>request</em>합니다.
          Subscriber가 reliable을 요구하는데 publisher가 best effort만 제공하면 둘은 발견되어도 data를 교환하지 않습니다.
          반대로 best-effort subscriber는 reliable publisher를 받을 수 있습니다. Durability와 deadline에도 같은 방향의 최소 요구/최대 허용 관계가 있습니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{M_{rel}}_{\text{전달 신뢰도 호환}}&=\big(\underbrace{O_{rel}}_{\text{발행자가 제공}}\succeq\underbrace{R_{rel}}_{\text{구독자가 요구}}\big)\\\underbrace{M_{dur}}_{\text{과거 표본 보존 호환}}&=\big(\underbrace{O_{dur}}_{\text{발행자가 과거값 제공}}\succeq\underbrace{R_{dur}}_{\text{늦은 구독자가 요구}}\big)\\\underbrace{M_{deadline}}_{\text{발행 주기 계약 호환}}&=\big(\underbrace{T_{offer}}_{\text{실제 최대 발행 간격}}\le\underbrace{T_{request}}_{\text{구독자가 허용한 간격}}\big)\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Requested/offered 방향을 외우기보다 subscriber의 최소 요구를 publisher가 충족하는지 묻습니다. Deadline은 더 짧은 offer가 더 강한 약속입니다. 이 match는 RMW level의 약속이며 callback 완료나 actuator 반응을 포함하지 않습니다."
          symbols={[[raw`O,R`, 'Publisher가 offered한 정책과 subscriber가 requested한 정책'], [raw`\succeq`, 'Offer가 request와 같거나 더 강함'], [raw`T_{offer}`, 'Publisher가 약속한 최대 message 간격'], [raw`T_{request}`, 'Subscriber가 허용한 최대 message 간격']]}
        />
        <ContractLedger items={[
          { label: 'History · Depth', contract: 'Keep-last N 또는 resource limit 안의 keep-all로 보관량을 정함', failure: '너무 깊은 sensor queue는 loss를 숨기는 대신 오래된 truth를 순서대로 실행합니다.' },
          { label: 'Reliability', contract: 'Best effort는 loss를 허용하고 reliable은 delivery를 재시도함', failure: 'Reliable은 freshness, bounded latency, application processing 성공을 보장하지 않습니다.' },
          { label: 'Durability', contract: 'Volatile은 연결 이후 data, transient-local은 late joiner에게 history 제공', failure: '재시작한 controller가 이전 epoch의 path/command를 새 명령으로 오인할 수 있습니다.' },
          { label: 'Deadline', contract: 'Publisher send 또는 subscriber receive 간격을 RMW까지 감시', failure: 'RMW에 제때 도착해도 executor queue에서 늦게 처리되면 physical deadline은 실패합니다.' },
          { label: 'Lifespan', contract: 'DDS source/write timestamp 기준으로 sample이 전달될 수 있는 유효 기간', failure: 'DDS write 시각과 sensor Header.stamp의 물리 취득 시각은 같지 않을 수 있어 consumer acquisition-age gate가 별도로 필요합니다.' },
          { label: 'Liveliness', contract: 'Entity/process가 lease를 갱신하는지 감시', failure: 'Process가 alive여도 callback deadlock이나 잘못된 application state는 탐지하지 못할 수 있습니다.' },
        ]} />
        <QosContractLab />
        <MathFormula display>{raw`\begin{aligned}\underbrace{A(m,t)}_{\text{sample age}}&=\underbrace{t-t_{acq}(m)}_{\text{획득 뒤 흐른 시간}}\\\underbrace{E(m)}_{\text{epoch gate}}&=\underbrace{[epoch(m)=epoch_{active}]}_{\text{restart 전 history 차단}}\\\underbrace{fresh(m,t)}_{\text{지금 사용 가능}}&=\underbrace{[A(m,t)\le A_{max}]}_{\text{age budget 통과}}\land\underbrace{E(m)}_{\text{현재 실행 소속}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Lifespan만 middleware에 맡기지 않고 consumer 직전에도 acquisition age와 active epoch를 검사합니다. Map/configuration처럼 오래 유지될 state와 velocity/path처럼 즉시 stale해지는 command는 서로 다른 Amax를 가져야 합니다."
          symbols={[[raw`t_{acq}(m)`, 'Message가 생성/도착한 시각이 아니라 물리 값을 획득한 시각'], [raw`A_{max}`, 'Sensor/control workload가 허용하는 최대 age'], [raw`epoch`, 'Restart, goal change 또는 map revision마다 바뀌는 실행 identity']]}
        />
      </NlpSection>

      <NlpSection id="queue-overload" marker="04" tone="amber" question="Sample을 하나도 잃지 않았는데 왜 robot은 과거를 보고 움직일까?" title="Queue는 overload에서 data loss와 time loss 중 무엇을 택할지 정한다">
        <p>
          30 Hz camera callback이 한 장을 처리하는 데 42 ms가 걸리면 한 thread가 처리할 수 있는 속도는 약 23.8 Hz입니다.
          평균 도착이 평균 service보다 빠르므로 queue가 차는 것은 우연이 아니라 필연입니다. Depth를 늘리면 당장 drop은 줄지만 오래된 frame이
          차례로 callback에 들어가 sample age가 커집니다. Feedback loop에서는 loss보다 age가 더 위험할 수 있습니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}
\underbrace{\rho}_{\text{사용률}}
&=\underbrace{\lambda}_{\text{도착률}}\underbrace{C}_{\text{처리 시간}}\\
\underbrace{G(t)}_{\text{누적 backlog}}
&=\left\lceil\underbrace{(\lambda-\mu)^+}_{\text{순증가율}}\underbrace{t}_{\text{관찰 구간}}\right\rceil\\
\underbrace{B(t)}_{\text{실제 backlog}}
&=\min\!\left(\underbrace{N}_{\text{queue depth}},G(t)\right)\\
\underbrace{t_{\mathrm{full}}}_{\text{포화 시간}}
&=\frac{N}{(\lambda-\mu)^+}
\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="이 식은 단일 server가 빈 queue에서 시작한다는 교육용 유체 근사로, 숨겨진 0.8초 snapshot 대신 관찰 시간 t를 명시해 backlog와 포화 시간을 계산합니다. Burst, multiple callbacks, executor wait, network retry와 OS preemption이 있으면 평균 rho가 1보다 작아도 순간 queue와 deadline miss가 생길 수 있습니다."
          symbols={[[raw`\lambda`, '초당 도착하는 표본 수'], [raw`\mu=1/C`, '초당 처리할 수 있는 표본 수'], [raw`C`, '표본 하나의 콜백 실행 시간'], [raw`G(t)`, '빈 대기열에서 t초 동안 늘어난 대기 표본 수'], [raw`B(t)`, 'G(t)를 실제 대기열 용량 N으로 제한한 표본 수'], [raw`(\lambda-\mu)^+`, '0보다 작으면 0으로 자른 초당 대기 표본 순증가'], [raw`N`, '대기열이 저장할 수 있는 표본 수'], [raw`t`, '대기열이 빈 상태에서 관찰한 시간']]}
        />
        <QueueOverloadLab />
        <MathFormula display>{raw`\begin{aligned}
\underbrace{A_{ingress}}_{\text{표본을 꺼낼 때의 나이}}
&=\underbrace{t_{take}-t_{acq}}_{\text{통신·대기열에서 흐른 시간}}\\
\underbrace{A_{process}}_{\text{콜백을 마쳤을 때의 나이}}
&=\underbrace{A_{ingress}}_{\text{이미 쌓인 시간}}+\underbrace{C_{callback}}_{\text{현재 콜백 처리}}\\
\underbrace{A_{consume}}_{\text{결과를 사용할 때의 나이}}
&=\underbrace{A_{process}}_{\text{처리 완료 시점의 나이}}+\underbrace{t_{downstream}}_{\text{후속 단계 지연}}
\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="이 식은 topic rate만 보면 놓치는 queue head의 oldest sample age와 callback 이후 downstream delay를 합칩니다. Source stamp에서 actuation까지 동일한 trace/sequence identity로 age를 재야 합니다."
          symbols={[[raw`t_{take}`, '실행기가 미들웨어에서 표본을 꺼낸 시각'], [raw`A_{process}`, '대기 시간에 현재 콜백 실행 시간을 더한 표본 나이'], [raw`C_{callback}`, '현재 콜백이 끝날 때까지의 실행 시간'], [raw`t_{downstream}`, '추정기, 계획기, 제어기와 구동기까지 남은 지연']]}
        />
        <Misconception>Reliable은 “항상 최신 값을 준다”가 아니라 “delivery를 보존하려고 재시도한다”에 가깝습니다. Sensor state처럼 다음 sample이 이전 sample을 대체할 수 있으면 keep-last(1)과 명시적 drop/age metric이 더 정직할 수 있습니다. 반대로 command acknowledgement나 event log처럼 누락이 허용되지 않으면 backpressure와 별도 deadline 정책이 필요합니다.</Misconception>
      </NlpSection>

      <NlpSection id="executor-callbacks" marker="05" tone="violet" question="MultiThreadedExecutor인데도 왜 callback이 직렬이고 service가 영원히 끝나지 않을까?" title="Executor가 ready work를 실제 callback 순서로 바꾼다">
        <p>
          ROS 2의 classic executor는 client-library에 별도 FIFO message queue를 복제하지 않고 middleware의 sample을 callback이 take할 때까지 둡니다.
          Wait set은 각 queue에 “work가 있는가”라는 readiness를 알려주지만 backlog 전체 순서와 개수를 global FIFO로 제공하지 않습니다.
          Underload에서는 도착 순서처럼 보일 수 있지만 overload에서는 ready entity를 round-robin 식으로 고르며 callback은 기본적으로 끝까지 non-preemptive하게 실행됩니다.
        </p>
        <MathFormula display>{raw`\underbrace{t_{start,i}}_{\text{콜백 실행 시작}}=\underbrace{t_{ready,i}}_{\text{미들웨어가 준비된 시각}}+\underbrace{W_{executor,i}}_{\text{선택·선행 콜백·그룹을 기다린 시간}}`}</MathFormula>
        <FormulaNote
          meaning="Message가 network/RMW에 도착한 시각과 user callback이 시작된 시각 사이에 executor wait가 있습니다. Topic deadline은 전자를 볼 수 있지만 control response는 후자와 callback completion까지 포함해야 합니다."
          symbols={[[raw`t_{ready,i}`, 'Middleware에 work가 ready가 된 시각'], [raw`W_{executor,i}`, 'Executor scheduling, non-preemptive blocking, callback group 때문에 생긴 대기'], [raw`t_{start,i}`, 'User callback이 실제 CPU를 얻은 시각']]}
        />
        <ContractLedger items={[
          { label: 'Single-threaded executor', contract: '한 callback을 끝낸 뒤 다음 ready work 선택', failure: '긴 image callback이 control, watchdog, cancel과 status callback을 모두 늦춥니다.' },
          { label: 'Multi-threaded executor', contract: '여러 worker가 ready callbacks를 실행할 수 있음', failure: '모든 entity가 같은 default mutually-exclusive group이면 실제 parallelism은 생기지 않습니다.' },
          { label: 'Mutually-exclusive group', contract: 'Group 내부 callback이 동시에 shared state를 만지지 못하게 함', failure: '너무 넓게 묶으면 unrelated critical work까지 직렬화되고 sync call이 deadlock을 만들 수 있습니다.' },
          { label: 'Reentrant / separate groups', contract: '동시에 실행해도 안전한 callback을 겹치게 함', failure: 'Shared mutable buffer와 non-thread-safe driver를 보호하지 않으면 data race가 생깁니다.' },
        ]} />
        <ExecutorTimelineLab />
        <MathFormula display>{raw`\begin{aligned}\underbrace{sync\_call(c_a)}_{\text{동기 호출 결과를 기다림}}&\land\underbrace{group(c_a)=group(c_{done})}_{\text{같은 상호 배타 그룹}}\\&\Longrightarrow\underbrace{c_{done}\;blocked}_{\text{완료 콜백이 실행되지 못함}}\\&\Longrightarrow\underbrace{deadlock}_{\text{어느 쪽도 진행할 수 없음}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Synchronous service/action API 안에는 Future의 done-callback이 숨어 있을 수 있습니다. 현재 callback이 group 점유를 놓지 않은 채 그 결과를 기다리면 done-callback이 실행될 기회가 없습니다. 서로 다른 groups 또는 reentrant group, 가장 안전하게는 asynchronous control flow로 바꿉니다."
          symbols={[[raw`c_a`, 'Synchronous call을 시작하고 기다리는 callback'], [raw`c_{done}`, 'Response를 받아 Future를 완료하는 숨은 callback'], [raw`group(\cdot)`, 'Callback의 동시 실행 허용 범위를 정하는 callback group']]}
        />
        <Misconception>2019년 Casini 논문은 Crystal의 timer 우선 처리와 cached ready-set/polling point를 분석했습니다. 현재 공식 문서는 timer 우선순위가 Eloquent에서 제거됐다고 명시합니다. 남는 교훈은 옛 priority 순서를 외우는 것이 아니라, 사용 중인 ROS 배포판과 executor의 실제 scheduling semantics를 trace하고 분석 모델에 맞추는 것입니다.</Misconception>
      </NlpSection>

      <NlpSection id="lifecycle-supervision" marker="06" tone="green" question="Process가 떠 있고 graph에 보이는데 왜 motor command를 막아야 할까?" title="Lifecycle은 준비 상태를 supervised transition으로 만든다">
        <p>
          일반 node는 constructor가 끝나면 기능을 시작하기 쉽습니다. 하지만 hardware handle, calibration, parameter, map, required endpoint가 모두 준비되기 전에
          command가 나가면 startup race가 물리 동작이 됩니다. Managed lifecycle node는 Unconfigured, Inactive, Active, Finalized라는 primary state와
          configuring, activating, deactivating, error processing 같은 transition state를 공통 관리 interface로 노출합니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{G_{state}}_{\text{노드 자체 준비}}&=\underbrace{[s=Active]}_{\text{생명주기 활성}}\land\underbrace{calibration_{ok}}_{\text{하드웨어 보정 검증}}\\\underbrace{G_{system}}_{\text{연결 시스템 준비}}&=\underbrace{deps_{ready}}_{\text{필수 입력 준비}}\land\underbrace{health_{ok}}_{\text{실행 상태 정상}}\\\underbrace{enable_{cmd}}_{\text{명령 허용}}&=\underbrace{G_{state}\land G_{system}}_{\text{두 준비 조건 통과}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Lifecycle Active만으로 application-specific readiness가 자동 생기지는 않습니다. configure/activate callback이 검사한 calibration, dependency, health 결과를 supervisor transaction과 command gate에 결속합니다."
          symbols={[[raw`s`, 'Managed node의 current lifecycle primary state'], [raw`calibration_{ok}`, 'Sensor/actuator calibration과 configuration 검증 결과'], [raw`deps_{ready}`, '필수 matched endpoints와 first valid data'], [raw`health_{ok}`, 'Deadline, queue, TF와 driver 상태']]}
        />
        <LifecycleSupervisorLab />
        <ContractLedger items={[
          { label: 'Configure', contract: 'Permanent buffer, parameter, publisher/subscription, calibration과 hardware identity 준비', failure: 'Constructor에서 바로 command를 내면 실패를 supervisor가 원자적으로 다루기 어렵습니다.' },
          { label: 'Inactive', contract: '구성은 유지하지만 functional data 처리·publication·service를 정지', failure: 'Inactive인데 cached timer나 unmanaged publisher가 command를 내보내면 state machine이 거짓말합니다.' },
          { label: 'Activate', contract: 'Active에서만 필요한 hardware 권한과 output을 짧은 transition으로 켬', failure: '긴 초기화를 넣으면 supervision timeout과 다른 component의 activation order가 불명확해집니다.' },
          { label: 'Error processing', contract: 'Output을 차단하고 cleanup 후 Unconfigured 복귀 또는 Finalized 종료', failure: '재시작만 반복하면 원인과 stale state가 남고 같은 command가 다시 재생될 수 있습니다.' },
        ]} />
      </NlpSection>

      <NlpSection id="composition-ownership" marker="07" tone="blue" question="Zero copy를 켜면 왜 빨라지면서 동시에 더 위험해질 수 있을까?" title="Composition은 copy를 ownership과 fault boundary로 바꾼다">
        <p>
          Node는 논리 component이고 process는 crash와 address-space 경계입니다. 여러 node를 한 process에 compose하면 image나 point cloud를
          serialize하지 않고 intra-process buffer와 pointer ownership으로 넘길 수 있습니다. 큰 message에서는 latency와 CPU를 크게 줄일 수 있지만,
          publisher가 buffer를 언제 다시 써도 되는지, fan-out subscriber 중 누가 ownership을 가지는지, 한 component crash가 어디까지 죽이는지를 새로 결정해야 합니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{N_{copy}}_{\text{필요한 복사 수}}&\ge\underbrace{N_{mutable\ owners}-1}_{\text{수정 주체마다 별도 저장소 필요}}\\\underbrace{shared\_ptr<const\ M>}_{\text{수정 불가 메시지를 함께 전달}}&\Longrightarrow\underbrace{N_{copy}=0}_{\text{하나의 객체를 안전하게 공유}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="같은 immutable message를 읽기만 하는 subscribers는 shared ownership으로 copy를 피할 수 있습니다. 각 subscriber가 독립적으로 수정하거나 unique ownership을 요구하면 추가 storage가 필요합니다. 실제 loaned-message 지원과 copy 수는 RMW, type과 publication API에 따라 달라질 수 있습니다."
          symbols={[[raw`N_{copy}`, 'Publish 이후 새 payload storage를 만드는 횟수'], [raw`N_{mutable\ owners}`, '동시에 독립적으로 payload를 수정해야 하는 consumer 수'], [raw`const\ M`, 'Publication 이후 변경하지 않는 immutable message payload']]}
        />
        <OwnershipCompositionLab />
        <ContractLedger items={[
          { label: 'Lifetime', contract: '마지막 consumer가 끝날 때까지 storage를 pool에 반환하지 않음', failure: 'Camera driver가 다음 frame을 같은 slot에 쓰면 detector가 한 image 안에서 서로 다른 frame을 읽습니다.' },
          { label: 'Immutability', contract: 'Publish된 shared object는 const로 취급', failure: '한 subscriber의 in-place 수정이 다른 subscriber의 입력과 rosbag 기록을 바꿉니다.' },
          { label: 'Fan-out ownership', contract: 'Unique owner 한 곳, 나머지는 shared const 또는 명시적 copy', failure: '누가 move를 받는지 callback 등록 순서 같은 암묵 조건에 기대면 재현성이 깨집니다.' },
          { label: 'Fault boundary', contract: '고장 격리가 필요한 driver/control은 process 분리 비용을 감수', failure: 'All-in-one composition에서 visualization plugin crash가 controller까지 종료할 수 있습니다.' },
        ]} />
        <Takeaway>Composition 여부는 “node 수를 줄이는 설정”이 아닙니다. Payload size와 rate, copy budget, ownership, mutation, callback isolation, tracing과 crash blast radius를 함께 놓고 배치하는 deployment 결정입니다.</Takeaway>
      </NlpSection>

      <NlpSection id="time-tf" marker="08" tone="amber" question="TF는 있는데 왜 point cloud 벽이 휘고 replay 뒤 estimator가 폭주할까?" title="Clock과 TF를 acquisition-time story로 묶는다">
        <p>
          한 sample에는 최소 네 시각이 있습니다. Sensor가 값을 얻은 <code>t_acq</code>, host가 받은 <code>t_arrival</code>, callback이 시작한
          <code>t_start</code>, actuator가 반응한 <code>t_act</code>입니다. 이동 중인 robot에서 TF를 <code>t_arrival</code>이나 “latest”로 조회하면
          network/executor delay만큼 다른 pose를 곱합니다. 이 오류는 더 빠른 network로 줄일 수 있어도 의미적으로는 source stamp를 고쳐야 합니다.
        </p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{p^{base}(t_{acq})}_{\text{측정 순간의 base 점}}&=\underbrace{T^{base}_{sensor}(t_{acq})}_{\text{획득 시각 TF}}\underbrace{p^{sensor}(t_{acq})}_{\text{센서 관측}}\\\underbrace{\Delta t_{e2e}}_{\text{전체 반응 시간}}&=\underbrace{t_{act}-t_{acq}}_{\text{획득부터 물리 반응까지}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Arrival time transform은 transport delay를 geometry error로 바꿉니다. Spinning LiDAR나 rolling shutter처럼 한 message 안에서도 acquisition interval이 길면 beam/row별 time 또는 deskew model이 필요합니다."
          symbols={[[raw`T^{base}_{sensor}(t_{acq})`, 'Sample을 얻은 시각의 sensor-to-base transform'], [raw`p^{sensor}`, 'Sensor frame에서 측정한 point/ray'], [raw`t_{act}`, 'Actuator가 command를 적용한 시각'], [raw`\Delta t_{e2e}`, 'Queue, callback, communication을 모두 포함한 sample-to-action age']]}
        />
        <ContractLedger items={[
          { label: 'SystemTime', contract: '동기화된 wall-clock timestamp와 외부 system correlation', failure: 'NTP/PTP/device clock offset을 모른 채 여러 host source stamp를 비교하면 age가 음수거나 과대가 됩니다.' },
          { label: 'SteadyTime', contract: '뒤로 가지 않는 duration, watchdog, execution-time 측정', failure: 'Wall/ROS time jump로 timeout이 즉시 만료되거나 영원히 기다릴 수 있습니다.' },
          { label: 'ROSTime', contract: 'Simulation, rosbag replay, pause, slow/fast/step timeline', failure: 'Zero(uninitialized), pause와 backward jump를 real wall time처럼 다루면 cache와 derivative state가 깨집니다.' },
          { label: 'TF buffer', contract: 'Frame transform을 source acquisition time으로 보간·조회', failure: 'Lookup latest로 성공만 시키면 spatial error를 조용히 주입합니다.' },
        ]} />
        <TimeTfLab />
        <MathFormula display>{raw`\begin{aligned}\underbrace{jump^-}_{\text{시간이 뒤로 이동}}&=\underbrace{[t^{ROS}_{new}<t^{ROS}_{old}]}_{\text{재생 중 시간 역행 검출}}\\\underbrace{jump^-}_{\text{역행 사건}}&\Longrightarrow\underbrace{clear(TF,sync\ queues)}_{\text{좌표·동기화 시간 캐시 폐기}}\\&\phantom{\Longrightarrow}\underbrace{clear(integrators,timeouts)}_{\text{누적기·대기 상태 폐기}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="Backward jump callback은 단순 알림이 아니라 time-indexed state를 원자적으로 무효화하는 transaction의 시작입니다. 모든 cache를 버릴 필요가 없는 경우에도 어떤 state가 어떤 clock에 indexed되는지 선언해야 합니다."
          symbols={[[raw`t^{ROS}_{old},t^{ROS}_{new}`, 'Jump 전후 ROS time'], [raw`sync\ queues`, 'Approximate/exact time synchronizer와 delayed-message buffer'], [raw`integrators`, '시간 차분에 의존하는 estimator/controller 누적 state']]}
        />
      </NlpSection>

      <NlpSection id="end-to-end-deadline" marker="09" tone="green" question="Topic rate와 평균 latency가 정상인데도 safety deadline을 어떻게 놓칠 수 있을까?" title="마지막 기준은 sensor-to-actuator processing chain이다">
        <p>
          Safety-relevant path는 node가 아니라 callback과 communication의 chain으로 봅니다. 각 callback의 worst-case execution time(WCET), source arrival curve와 jitter,
          executor의 non-preemptive blocking과 interference, host/network crossing delay, CPU가 실제로 공급하는 budget을 표시합니다. 평균과 p99 trace는 관찰한 workload를 설명하지만,
          관찰하지 못한 burst와 worst-case path의 상한은 별도 가정과 분석이 필요합니다.
        </p>
        <MathFormula display>{raw`\begin{gathered}
          \underbrace{\eta_s(\Delta)}_{\text{구간의 최대 도착 수}}\\[-1pt]
          =\left\lceil\dfrac{\underbrace{\Delta+J_s}_{\text{구간+jitter}}}{\underbrace{T_s}_{\text{발행 주기}}}\right\rceil
        \end{gathered}`}</MathFormula>
        <FormulaNote
          meaning="평균 rate 대신 어떤 시간 window에도 최대 몇 instance가 들어올 수 있는지 arrival curve로 나타냅니다. Jitter가 커지면 짧은 시간에 여러 callbacks가 몰려 self-interference를 만들 수 있습니다."
          symbols={[[raw`\eta_s(\Delta)`, '시간 구간 Delta에서 source가 만들 수 있는 최대 callback instances'], [raw`T_s`, 'Periodic source의 nominal period'], [raw`J_s`, 'Release/arrival가 nominal schedule에서 흔들릴 수 있는 최대 jitter']]}
        />
        <MathFormula display>{raw`\begin{aligned}\underbrace{R_{exec}}_{\text{실행 지연}}&=\underbrace{\sum_{c_i\in\gamma}(C_i+W_i)}_{\text{콜백 실행과 실행기 대기를 누적}}\\\underbrace{R_{comm}}_{\text{통신 지연}}&=\underbrace{\sum_{(i,j)\in\gamma}\delta_{ij}}_{\text{프로세스·호스트 경계 지연을 누적}}\\\underbrace{R_{chain}}_{\text{전체 반응 상한}}&\le\underbrace{R_{exec}+R_{comm}+S}_{\text{실행·통신·발동 지연의 합}}\\\underbrace{margin}_{\text{남은 시간 여유}}&=\underbrace{D_{physical}-R_{chain}}_{\text{물리 마감에서 반응 상한을 뺌}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="직관을 위한 분해입니다. 실제 safe bound는 executor scheduling, arrival correlation, reservations와 chain sharing을 반영한 분석이 필요하며 단순 합은 pessimistic하거나 누락될 수 있습니다. Casini 논문은 Crystal single-thread executor와 reservation model에서 이를 formal하게 전개합니다."
          symbols={[[raw`\gamma`, 'Source sensor callback에서 sink actuator callback까지의 processing chain'], [raw`C_i`, 'Callback i의 measured/validated WCET'], [raw`W_i`, 'Queue, callback group, polling/ready semantics와 other work의 interference'], [raw`\delta_{ij}`, 'Host/process/RMW를 건너는 bounded communication delay'], [raw`S`, 'Time-triggered sampling 또는 trigger alignment delay']]}
        />
        <p>
          아래 worksheet는 formal response-time analyzer가 아닙니다. Callback WCET, executor wait, communication과 trigger alignment의 상한을 이미
          trace·fault fixture·분석으로 확보했을 때 그 값을 같은 단위로 합산해 allocation과 비교합니다. 각 입력이 평균이나 임의 추정치라면 결과도
          단지 설명용 합계이며 <code>RUN</code>, <code>DEGRADE</code>, <code>STOP</code>을 결정할 수 없습니다.
        </p>
        <EndToEndRuntimeLab />
        <DiagnosticSequence items={[
          { signal: 'Trace the identity', question: '한 source sequence/goal/revision이 DDS take, callback start/end, publish, next take와 actuator ack까지 이어지는가?', response: 'Trace가 끊기면 먼저 correlation ID와 clock alignment를 고칩니다.' },
          { signal: 'Bound workload', question: 'Input arrival/jitter, callback WCET, queue depth, network delay와 CPU supply가 운영 범위에서 상한을 가지는가?', response: '상한이 없으면 worst-case deadline 보장 대신 explicit overload stop policy를 둡니다.' },
          { signal: 'Model executor', question: '사용 중인 executor, callback groups, threads와 ROS distribution의 scheduling semantics가 분석 가정과 같은가?', response: '다르면 trace만 믿지 말고 deployment/model을 맞추거나 분석을 갱신합니다.' },
          { signal: 'Gate physical action', question: 'End-to-end age, lifecycle, endpoint match, TF, queue, epoch와 goal cancel state가 모두 valid한가?', response: '검증된 bound가 allocation을 넘거나 독립 gate가 닫히면 release를 막고, 별도 stop contract로 actuator를 정지합니다.' },
        ]} />
        <RuntimeFailureLegend />
        <MathFormula display>{raw`\begin{aligned}\underbrace{H_{link}}_{\text{통신 연결 건강}}&=\underbrace{M_{endpoints}\land L_{active}}_{\text{호환 종단점·활성 노드}}\\\underbrace{H_{time}}_{\text{시간 건강}}&=\underbrace{[A_{sample}\le A_{max}]}_{\text{표본 신선도 통과}}\land\underbrace{[R_{chain}\le D]}_{\text{반응 마감 통과}}\\\underbrace{H_{identity}}_{\text{실행 계보 건강}}&=\underbrace{TF_{ok}\land epoch_{ok}\land cancel_{ok}}_{\text{공간·실행 세대·정지 검증}}\\\underbrace{H_{runtime}}_{\text{최종 실행 허용문}}&=\underbrace{H_{link}\land H_{time}\land H_{identity}}_{\text{모든 건강 조건 통과}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="최종 gate는 monitoring dashboard용 장식 값이 아니라 actuator command를 허용하는 실행 조건입니다. 각 term은 원인별 대응을 가져야 하며 unknown/missing metric은 true가 아니라 closed로 해석합니다."
          symbols={[[raw`A_{sample}`, '현재 decision이 사용한 가장 오래된 필수 source sample age'], [raw`R_{chain}`, '현재 deployment assumptions 아래의 response-time bound 또는 검증된 upper envelope'], [raw`TF_{ok}`, 'Acquisition time transform이 tolerance 안에서 존재'], [raw`epoch_{ok}`, 'Message/map/path가 active restart/goal/revision에 속함'], [raw`cancel_{ok}`, 'Cancel/stop callback과 actuator acknowledgement가 deadline 안에 가능']]}
        />
        <CapabilityCheck
          title="이 글만으로 통과해야 하는 진단"
          items={[
            'Topic, service, action을 duration·feedback·state·cancel semantics로 선택한다.',
            'Graph discovery와 endpoint match, lifecycle Active, first valid data와 health를 분리한다.',
            'Requested/offered reliability·durability·deadline 방향을 검산한다.',
            'Reliable deep queue가 loss 대신 sample age를 누적하는 이유를 계산한다.',
            'Wait set, executor, callback group과 thread가 callback start를 결정하는 흐름을 추적한다.',
            'Synchronous call과 hidden done-callback의 mutually-exclusive deadlock을 진단한다.',
            'Managed lifecycle state와 application readiness를 command gate로 결합한다.',
            'Composition의 copy 절감과 ownership, mutation, crash isolation trade-off를 판단한다.',
            'System/Steady/ROS time과 acquisition/arrival/actuation time을 구분하고 TF를 올바른 시각에 조회한다.',
            'Arrival jitter, WCET, executor wait, communication과 CPU supply로 end-to-end deadline을 구성한다.',
            'QoS deadline과 process liveliness가 application completion이나 physical safety를 대신하지 못함을 설명한다.',
            'Endpoint, lifecycle, freshness, TF, epoch, cancel과 response margin으로 degrade·stop 정책을 만든다.',
          ]}
        />
        <SourceNotes sources={[
          { label: 'ROS 2 Interfaces: topics, services, actions', href: 'https://docs.ros.org/en/kilted/Concepts/Basic/Interfaces-Topics-Services-Actions.html', note: '연속 stream, 짧은 request/response, 장기 goal·feedback·cancel의 현재 공식 구분.' },
          { label: 'ROS 2 Quality of Service settings', href: 'https://docs.ros.org/en/kilted/Concepts/Intermediate/About-Quality-of-Service-Settings.html', note: 'History, depth, reliability, durability, deadline, lifespan, liveliness와 compatibility의 현재 공식 개념.' },
          { label: 'ROS 2 Executors', href: 'https://docs.ros.org/en/rolling/Concepts/Intermediate/About-Executors.html', note: 'Wait set, classic executor scheduling semantics, callback groups와 current executor limits.' },
          { label: 'ROS 2 Callback Groups guide', href: 'https://docs.ros.org/en/rolling/How-To-Guides/Using-callback-groups.html', note: 'Mutually-exclusive/reentrant behavior와 synchronous-call deadlock 조건.' },
          { label: 'ROS 2 Managed Nodes design', href: 'https://design.ros2.org/articles/node_lifecycle.html', note: 'Primary/transition states, inactive behavior와 external supervision intent.' },
          { label: 'ROS 2 Deadline, Liveliness, Lifespan design', href: 'https://design.ros2.org/articles/qos_deadline_liveliness_lifespan.html', note: '각 QoS event의 정의와 RMW-level deadline 경계.' },
          { label: 'ROS 2 Clock and Time design', href: 'https://design.ros2.org/articles/clock_and_time.html', note: 'System/Steady/ROS time, zero time, pause와 backward jump contract.' },
          { label: 'ROS 2 Intra-process Communications design', href: 'https://design.ros2.org/articles/intraprocess_communications.html', note: 'Per-subscription buffer, ownership/copy, QoS와 historical performance trade-offs.' },
          { label: 'Casini et al. (2019), Response-Time Analysis of ROS 2 Processing Chains', href: 'https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ECRTS.2019.6', note: 'Callback graph, historical executor scheduling, reservations와 end-to-end response-time analysis의 기반 논문.' },
        ]} />
      </NlpSection>

      <NlpSection id="qualification" marker="10" tone="amber" question="평균과 p99가 좋아도 어떤 fault 하나 때문에 release를 막아야 할까?" title="Fault injection으로 end-to-end 계약을 자격 검증한다">
        <QuestionLead
          question="100 ms sensor-to-actuator deadline을 가진 이동 로봇이 정상 trial에서 61 ms, DDS burst에서도 83 ms를 기록했다. 두 경우 모두 100 ms 안이므로 그대로 출시해도 될까?"
          answer="아닙니다. 전체 deadline은 마지막 gate 하나일 뿐입니다. DDS burst에서 통신과 executor의 지역 allocation이 이미 깨졌다면 더 큰 burst나 새 callback을 흡수할 여유가 없습니다. Clock jump, 이전 epoch command, Inactive controller는 latency가 61 ms여도 값의 identity와 readiness가 틀렸으므로 actuator gate를 즉시 닫아야 합니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>이 절의 숫자는 모든 로봇에 적용하는 표준값이 아니라 하나의 교육용 qualification contract다. Physical deadline은 100 ms, 합산 stage allocation은 90 ms, 아직 모델링하지 못한 variation을 위한 reserve는 10 ms로 둔다. Stop acknowledgement는 별도 30 ms contract다. 실제 시스템에서는 braking distance, control period, sensor age와 actuator dynamics에서 이 값을 먼저 도출해야 한다.</p>
          <p>시험 순서는 정상 실행을 재는 것에서 끝나지 않는다. DDS burst, low-priority lock의 priority inversion, ROS time backward jump, restart 이전 transient history, Inactive lifecycle을 하나씩 강제로 만든다. 각 fault에서 단순히 “오류가 보이는가”가 아니라 어떤 gate가 닫히고 command가 0회이며 stop acknowledgement가 bound 안인지 확인한다.</p>
        </div>
        <RuntimeQualificationLab />
        <MathFormula display>{raw`\begin{aligned}
\underbrace{B_H}_{\text{고우선 작업의 막힘}}
&=\underbrace{\max_{\ell\in LP(H)}C_{\ell}^{cs}}_{\text{저우선 임계구간 중 최장}}\\
&=35\text{ ms}\\
\underbrace{R_{\mathrm{stop}}}_{\text{정지 확인 지연}}
&=\underbrace{C_{\mathrm{detect+ack}}}_{\text{검출·확인}}+\underbrace{B_H}_{\text{공유 잠금 막힘}}\\
&=12\text{ ms}+35\text{ ms}=47\text{ ms}>30\text{ ms}
\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="이 식은 priority inversion fixture의 47 ms가 임의 숫자가 아니라, 원래 12 ms인 detect·ack 경로가 낮은 우선순위 task의 35 ms shared critical section에 막힌 결과임을 보입니다. Priority inheritance나 ceiling을 적용한 뒤에는 B_H의 새 상한을 다시 측정·분석해야 하며, 기법 이름만으로 30 ms 통과를 가정하지 않습니다."
          symbols={[[raw`H`, 'Stop acknowledgement를 포함한 high-priority callback chain'], [raw`LP(H)`, 'H가 필요로 하는 lock을 보유할 수 있는 lower-priority tasks'], [raw`C_{\ell}^{cs}`, 'Lower-priority task l의 관련 shared critical-section upper bound'], [raw`B_H`, 'High-priority chain이 lock 때문에 한 번 막힐 수 있는 blocking bound']]}
        />
        <MathFormula display>{raw`\begin{aligned}\underbrace{G_{\mathrm{timing}}}_{\text{시간 예산 통과}}={}&\underbrace{[\max_{r\in F}R_{\mathrm{chain}}(r)\le D-R_{\mathrm{reserve}}]}_{\text{전체 반응 상한이 예비 시간을 남김}}\\&\land\underbrace{[\forall r\in F,\forall k,\ R_k(r)\le B_k]}_{\text{각 단계가 자기 예산 안에 있음}}\\\underbrace{G_{\mathrm{release}}}_{\text{출시 허용}}={}&G_{\mathrm{timing}}\land\underbrace{[N_{\mathrm{bad\ cmd}}(F)=0]}_{\text{잘못된 명령이 한 번도 없음}}\\&\land\underbrace{[\max_{r\in F}T_{\mathrm{stop}}(r)\le D_{\mathrm{stop}}]}_{\text{최악 정지 응답도 마감 안에 있음}}\\&\land\underbrace{G_{\mathrm{time}}\land G_{\mathrm{epoch}}\land G_{\mathrm{lifecycle}}}_{\text{시간·실행 세대·생명주기 통과}}\end{aligned}`}</MathFormula>
        <FormulaNote
          meaning="이 식은 정상 평균 하나가 아니라 정해 둔 fault fixture 집합 전체에서 release 여부를 판정합니다. 전체 90 ms envelope뿐 아니라 각 stage의 지역 allocation Bk도 모두 통과해야 하므로, DDS burst가 83 ms여도 21/12 ms와 18/15 ms 구간 위반이 있으면 no-go입니다. AND는 빠른 실행이 잘못된 command, 늦은 stop, clock·epoch·lifecycle 오류를 상쇄하지 못하게 합니다."
          symbols={[[raw`F`, '운영 가정에서 반드시 재현할 정상·burst·priority·clock·restart·lifecycle fixture 집합'], [raw`R_{\mathrm{chain}}(r)`, 'Fixture r에서 검증한 sensor-to-actuator response upper envelope'], [raw`R_k(r)`, 'Fixture r에서 stage k가 사용한 검증 upper envelope'], [raw`B_k`, 'Stage k에 미리 배정한 local timing budget'], [raw`D`, 'Physical behavior에서 도출한 전체 deadline'], [raw`R_{\mathrm{reserve}}`, '측정·모델 오차와 아직 배치하지 않은 변동을 위한 여유'], [raw`N_{\mathrm{bad\ cmd}}`, 'Time, epoch 또는 lifecycle gate가 닫힌 상태에서 actuator에 도달한 명령 수'], [raw`T_{\mathrm{stop}}`, 'Fault detection부터 actuator stop acknowledgement까지의 시간'], [raw`\land`, '모든 독립 gate가 동시에 통과해야 한다는 논리 AND']]}
        />
        <ContractLedger items={[
          { label: 'Baseline', contract: '각 stage bound, 전체 deadline, stop ack와 identity gate가 모두 통과', failure: '정상 trial만 통과하면 overload와 restart failure는 아직 미검증입니다.' },
          { label: 'Load fault', contract: 'DDS burst와 CPU/lock interference에서도 지역 allocation과 stop path를 보존', failure: '전체 100 ms 안이라는 이유로 지역 budget breach를 허용하면 다음 변화에 margin이 사라집니다.' },
          { label: 'State fault', contract: 'Clock jump, old epoch와 Inactive state에서 command count가 정확히 0', failure: '빠르게 처리된 잘못된 command는 timing success가 아니라 safety failure입니다.' },
          { label: 'Recovery', contract: 'Clear·hold·degrade·cancel 뒤 first-valid sample과 supervisor activation으로만 재개', failure: 'Timer 기반 자동 reopen은 원인이 남은 채 actuator gate를 다시 열 수 있습니다.' },
        ]} />
        <CapabilityCheck
          title="가장 어려운 문제를 풀기 위한 마지막 점검"
          items={[
            'Physical deadline을 stage allocation, reserve와 stop acknowledgement contract로 분해한다.',
            '전체 deadline 안에서도 지역 allocation breach가 release no-go인 이유를 설명한다.',
            'DDS burst가 communication뿐 아니라 executor wait에 만드는 연쇄 지연을 추적한다.',
            'Priority inversion이 control callback과 stop path를 동시에 늦추는 구조를 찾는다.',
            'Clock jump와 restart history가 빠른 처리에도 command gate를 닫아야 하는 이유를 설명한다.',
            'Lifecycle endpoint visibility와 functional readiness를 분리해 검증한다.',
            '각 fault에서 bad command 0회와 bounded stop acknowledgement를 assertion으로 만든다.',
            '평균·p99 trace와 worst-case assumption·fault qualification의 역할을 구분한다.',
          ]}
        />
        <LearningHandoff
          description="ROS 2가 넘기는 것은 message가 아니라 schema·frame·clock·epoch·deadline이 검증된 command chain이다. 물리 상태와 제어, MCU 실행, release case로 경계를 이어 본다."
          items={[
            { label: '막히면', slug: 'robot-localization-slam', title: 'Robot Localization & SLAM', reason: 'Acquisition time, TF와 map·odom revision이 sensor state의 의미를 어떻게 바꾸는지 확인한다.' },
            { label: '막히면', slug: 'robot-dynamics-feedback-control', title: 'Robot Dynamics & Feedback Control', reason: 'Middleware·executor delay가 sampled closed-loop stability와 actuator margin에 들어가는 이유를 복습한다.' },
            { label: '이어 읽기', slug: 'robot-embedded-realtime-control', title: 'Embedded Real-Time Control', reason: 'Callback deadline을 MCU task, ISR·DMA, watchdog와 physical latch의 시간 계약으로 내린다.' },
            { label: '적용하기', slug: 'robot-system-verification-validation-qualification', title: 'Robot System Verification & Qualification', reason: 'Fault fixture, bad-command 0회와 stop acknowledgement를 subsystem·full-robot release evidence로 승격한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'ROS 2 Executors · Rolling', href: 'https://docs.ros.org/en/rolling/Concepts/Intermediate/About-Executors.html', note: 'Classic wait-set executor, callback group, scheduling semantics와 current EventsCBGExecutor의 범위를 구분하는 공식 문서.' },
          { label: 'ROS 2 Quality of Service settings', href: 'https://docs.ros.org/en/rolling/Concepts/Intermediate/About-Quality-of-Service-Settings.html', note: 'Deadline, lifespan, liveliness와 requested/offered compatibility가 application completion을 대신하지 않는 공식 경계.' },
          { label: 'Casini et al. (2019)', href: 'https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ECRTS.2019.6', note: 'Callback chain, arrival interference와 reservation 아래 response-time bound를 formal하게 구성한 canonical paper.' },
          { label: 'Casini et al. (2021)', href: 'https://retis.santannapisa.it/~d.casini/papers/2021/RTSS2021/rtss21-ros.pdf', note: '2019 분석 이후 ROS 2 callback scheduling을 더 정확히 반영한 response-time analysis의 후속 근거.' },
        ]} />
      </NlpSection>
    </>
  );
}
