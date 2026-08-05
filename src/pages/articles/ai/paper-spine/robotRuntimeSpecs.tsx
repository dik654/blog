import type { PaperStudySpec } from './FoundationalPaperStudy';
import CasiniProcessingChainLab from './viz/CasiniProcessingChainLab';

const raw = String.raw;

export const casiniRos2ResponseTime2019Spec: PaperStudySpec = {
  shortTitle: 'ROS 2 Processing Chains',
  citation: 'D. Casini, T. Blaß, I. Lütkebohle, and B. Brandenburg - Response-Time Analysis of ROS 2 Processing Chains Under Reservation-Based Scheduling',
  yearVenue: '2019 · ECRTS 31, Article 6',
  sourceUrl: 'https://retis.sssup.it/~d.casini/papers/2019/ecrts19.pdf',
  appendixUrl: 'https://drops.dagstuhl.de/entities/document/10.4230/LIPIcs.ECRTS.2019.6',
  before: 'ROS 2는 modular node graph를 process, host와 thread에 자유롭게 배치할 수 있었지만, 이 자유가 sensor-to-actuator latency를 가렸다. OS scheduling 연구는 많았어도 ROS executor가 middleware queue와 callbacks를 어떤 순서로 multiplex하는지에 맞는 response-time model이 없어서 개발자는 구현 후 평균·최대 trace를 재는 방식에 의존했다.',
  authorIntent: '저자들은 ROS 2가 real-time capability를 목표로 한다는 사실과 실제 time-critical chain의 상한을 알 수 있다는 주장을 분리하려 했다. 그래서 Crystal C++ single-thread executor의 scheduling을 source와 실험으로 복원하고, callback graph를 Linux SCHED_DEADLINE 같은 resource reservation 위에 배치했을 때 worst-case response time을 계산하는 기초를 만들었다.',
  thesis: 'Callback arrival를 arrival curve로, execution을 WCET로, executor를 historical polling-point scheduler로, CPU를 supply-bound reservation으로 모델링하면 ROS-specific interference를 포함한 callback/subchain response bound를 fixed point로 계산하고, 구현 전에 time-driven/event-driven 배치와 budget trade-off를 비교할 수 있다.',
  reconstruction: [
    { label: 'Logical graph', value: 'callbacks C + edges E', note: 'Node 이름 대신 실제 activation 관계와 processing chains를 만든다.' },
    { label: 'Runtime map', value: 'executor → reservation', note: 'Callbacks가 어느 process/thread/CPU supply를 공유하는지 고정한다.' },
    { label: 'Demand / supply', value: 'η(Δ), WCET / sbf(Δ)', note: '어떤 window의 최대 work와 보장된 CPU service를 비교한다.' },
    { label: 'Response bound', value: 'fixed point → chain sum', note: 'Polling interference와 communication delay를 포함해 design margin을 계산한다.' },
  ],
  mechanism: [
    'ROS application을 nodes가 아니라 callback set C와 callback activation edge set E의 directed acyclic graph로 바꾼다. Source-to-sink path가 timing을 검증할 processing chain이다.',
    '각 callback에 worst-case execution time e_i와 historical executor priority를 붙이고, source callback에는 어떤 길이 Δ의 window에도 최대 arrivals를 제한하는 external arrival curve를 붙인다.',
    '각 process의 single-thread executor를 하나의 resource reservation r_k에 배치한다. Reservation은 period P_k마다 budget Q_k를 보장하고 supply-bound function sbf_k(Δ)로 최소 CPU service를 표현한다.',
    '서로 다른 reservation/host를 잇는 edge에는 DDS-dependent worst-case communication delay δ_i,j를 붙인다. 논문은 network 내부를 한 bounded variable로 추상화한다.',
    'Crystal executor의 source를 읽어 timer, subscription, service, client category와 cached ready set을 복원한다. Non-timer work는 polling point의 snapshot에 들어와야 고려되고 callback은 completion까지 non-preemptive하다.',
    'Special-purpose node에 500 ms callbacks, queued messages/services와 timers를 정해진 시각에 주입하고 Gantt trace를 관찰해 한 ready event당 한 instance, polling-point 지연과 당시 timer behavior를 검증한다.',
    'Event source, timer, polling-point-based callback을 나눠 각 instance의 release offset A에 대해 guaranteed supply가 self demand, interfering demand와 blocking을 감당하는 최소 positive fixed point R_i*(A)를 구한다.',
    'Longest busy period L*로 A search interval을 유한하게 만들고 request-bound function이 바뀌는 release offsets만 검사해 계산 가능하게 만든다.',
    '같은 reservation에 연속된 callbacks를 subchain으로 묶어 arrival burst를 callback마다 중복 지불하지 않는다. Prefix work, last callback self-interference와 other subchain work를 한 fixed point에 포함한다.',
    'Arrival curves와 response jitter를 reservation 경계 너머로 반복 전파해 global fixed point를 찾고, subchain bounds와 communication delays를 더해 end-to-end chain bound를 만든다.',
    'ROS 1 move_base의 Bosch case parameters를 ROS 2 model에 옮겨 local/global planner를 다른 reservations로 격리하고 time-driven과 event-driven 설계를 budget과 input jitter별로 비교한다.',
    '계산된 bound를 certification truth로 과장하지 않고 fixed DAG, known WCET/arrival, schedulable reservations, single-thread executor와 bounded DDS delay라는 assumptions가 deployment에 성립하는지 먼저 검증한다.',
  ],
  equations: [
    {
      latex: raw`\begin{aligned}\underbrace{D}_{\text{ROS callback graph}}&=\big(\underbrace{C}_{\text{callbacks}},\underbrace{E\subseteq C\times C}_{\text{한 callback이 다음 callback을 activate}}\big)\\\underbrace{\gamma_x}_{\text{검증할 processing chain}}&=\big(\underbrace{c_s}_{\text{source}},\ldots,\underbrace{c_e}_{\text{sink}}\big)\end{aligned}`,
      latexCompact: raw`\begin{gathered}
\underbrace{D=(C,E)}_{\text{callback graph}}\\[3pt]
\underbrace{E\subseteq C\times C}_{\text{activation edges}}\\[3pt]
\underbrace{\gamma_x=(c_s,\ldots,c_e)}_{\text{검증할 chain}}
\end{gathered}`,
      meaning: 'Node graph를 timing graph로 바꾸는 첫 단계다. Edge는 data topic 그림이 아니라 ci 실행이 cj instance를 최대 하나 activate한다는 model relation이다. 논문은 graph가 runtime 중 바뀌지 않는 DAG라고 가정한다.',
      symbols: [[raw`C`, 'Timer, subscription, service, client와 external event-source callbacks'], [raw`E`, 'Callback activation relations'], [raw`\gamma_x`, '한 external event에서 downstream completion까지의 directed path']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{\eta_s^e(\Delta)}_{\text{window의 최대 source arrivals}}&=\left\lceil\frac{\underbrace{\Delta}_{\text{관찰 window}}}{\underbrace{T_s}_{\text{period}}}\right\rceil\\\underbrace{rbf_i(\Delta)}_{\text{callback }i\text{의 최대 CPU demand}}&=\underbrace{\eta_i^a(\Delta)}_{\text{jitter가 전파된 activation bound}}\underbrace{e_i}_{\text{WCET}}\end{aligned}`,
      meaning: 'Periodic source의 기초 arrival curve와 request-bound function이다. Non-source activation curve에는 predecessor response time이 release jitter로 들어가므로 response bound와 arrival bound를 global fixed point까지 반복한다.',
      symbols: [[raw`\eta_s^e`, 'Externally supplied source arrival curve'], [raw`\eta_i^a`, 'Predecessor jitter를 반영한 callback activation curve'], [raw`T_s`, 'Periodic source interval'], [raw`e_i`, 'Callback i의 worst-case execution time']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{r_k=(Q_k,P_k)}_{\text{CPU reservation}}&:\;\underbrace{P_k\text{마다 }Q_k}_{\text{최소 실행 budget 보장}}\\\underbrace{u_k}_{\text{예약 bandwidth}}&=\frac{\underbrace{Q_k}_{\text{실행 budget}}}{\underbrace{P_k}_{\text{reservation period}}}\quad,\quad\underbrace{sbf_k(\Delta)}_{\text{길이 }\Delta\text{ 구간의 최소 제공 service}}\end{aligned}`,
      latexCompact: raw`\begin{gathered}
\underbrace{r_k=(Q_k,P_k)}_{\text{CPU reservation}}\\[3pt]
\underbrace{u_k=Q_k/P_k}_{\text{예약 bandwidth}}\\[3pt]
\underbrace{S_k(\Delta)=sbf_k(\Delta)}_{\text{최소 CPU service}}
\end{gathered}`,
      meaning: 'Executor thread가 OS에서 언제 CPU를 받을지까지 모델에 넣는다. 논문은 implicit deadline, bounded service delay와 schedulable reservations를 가정한다. Dedicated highest-priority core는 특별히 sbf(Δ)=Δ로 볼 수 있다.',
      symbols: [[raw`Q_k`, '각 reservation period에 보장되는 execution budget'], [raw`P_k`, 'Budget replenishment period'], [raw`u_k`, 'Core capacity 중 reservation이 요구하는 fraction'], [raw`sbf_k`, '어떤 interval에도 최소한 공급되는 CPU time']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{S_i(A)}_{\text{완료까지 CPU 공급}}&=\underbrace{sbf_k(A+R_i^*(A))}_{\text{reservation 최소 service}}\\\underbrace{D_i(A)}_{\text{자기 demand}}&=\underbrace{rbf_i(A+1)}_{\text{먼저 나온 자기 instances}}\\\underbrace{I_i(A)}_{\text{다른 work 간섭}}&=\underbrace{RBF(C_k\setminus\{c_i\},A+R_i^*(A)-e_i+1)}_{\text{polling 전 arrivals}}\\\underbrace{S_i(A)}_{\text{공급}}&=\underbrace{D_i(A)+I_i(A)}_{\text{최악 demand를 감당}}\\\underbrace{R_i}_{\text{response bound}}&=\underbrace{\max_{A\ge0}R_i^*(A)}_{\text{모든 release offset 중 최대}}\end{aligned}`,
      latexCompact: raw`\begin{aligned}
\underbrace{S_i}_{\text{공급}}&=sbf_k(A+R_i^*)\\
\underbrace{D_i}_{\text{자기 demand}}&=rbf_i(A+1)\\
\underbrace{I_i}_{\text{다른 work}}&=RBF(C_k\!\setminus\!\{c_i\},A+R_i^*-e_i+1)\\
S_i&=D_i+I_i\\
\underbrace{R_i}_{\text{최악 응답}}&=\max_{A\ge0}R_i^*(A)
\end{aligned}`,
      meaning: '수정판 Equation 6의 polling-point-based callback bound다. Historical executor에서는 priority와 무관하게 같은 executor의 다른 callbacks가 last polling point 이전에 도착해 interfere할 수 있어 모든 other callbacks가 demand에 들어간다.',
      symbols: [[raw`A`, 'Current busy period 시작에 대한 analyzed instance release offset'], [raw`R_i^*(A)`, 'Supply와 worst-case demand가 같아지는 최소 positive completion interval'], [raw`RBF`, 'Callback set의 total request-bound function'], [raw`C_k`, 'Reservation k의 executor가 담당하는 callbacks']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{S_{x,y}}_{\text{subchain CPU 공급}}&=\underbrace{sbf_k(A+R_{x,y}^*)}_{\text{완료까지 최소 service}}\\\underbrace{D_{last}}_{\text{마지막 callback demand}}&=\underbrace{\eta_s^a(A+1)e_e}_{\text{last self-interference}}\\\underbrace{D_{prefix}}_{\text{같은 chain 앞부분}}&=\underbrace{rbf_{x,y'}(A+R_{x,y}^*-e_e+1)}_{\text{prefix work 한 번 계산}}\\\underbrace{D_{other}}_{\text{다른 subchains}}&=\underbrace{RBF_\gamma(\Gamma_k\setminus\{\gamma_{x,y}\},A+R_{x,y}^*-e_e+1)}_{\text{경쟁 chain work}}\\\underbrace{S_{x,y}}_{\text{공급}}&=\underbrace{D_{last}+D_{prefix}+D_{other}}_{\text{subchain demand 감당}}\end{aligned}`,
      latexCompact: raw`\begin{aligned}
\underbrace{S_{xy}}_{\text{공급}}&=sbf_k(A+R_{xy}^*)\\
\underbrace{D_l}_{\text{last}}&=\eta_s^a(A+1)e_e\\
\underbrace{D_p}_{\text{prefix}}&=rbf_{x,y'}(A+R_{xy}^*-e_e+1)\\
\underbrace{D_o}_{\text{other}}&=RBF_\gamma(\Gamma_k\!\setminus\!\{\gamma_{xy}\},A+R_{xy}^*-e_e+1)\\
S_{xy}&=D_l+D_p+D_o
\end{aligned}`,
      meaning: '수정판 Lemma 8의 핵심 fixed point를 semantic rows로 쪼갰다. 같은 reservation의 연속 callbacks를 하나의 subchain으로 분석해 같은 arrival burst를 각 callback에서 반복 계산하는 pessimism을 줄인다. 원 conference version은 offset A dependency가 빠져 이후 erratum에서 수정됐다.',
      symbols: [[raw`\gamma_{x,y}`, 'Chain x가 reservation k 안에서 연속되는 subchain'], [raw`\gamma_{x,y'}`, '마지막 callback ce를 제외한 subchain prefix'], [raw`e_e`, 'Subchain 마지막 callback의 WCET'], [raw`\Gamma_k`, 'Reservation k에 할당된 subchains']],
    },
    {
      latex: raw`\begin{aligned}\underbrace{R_{exec,x}}_{\text{subchain 실행 상한}}&=\underbrace{\sum_y R_{x,y}}_{\text{reservation별 response 합}}\\\underbrace{R_{comm,x}}_{\text{통신 상한}}&=\underbrace{\sum_{(i,j)\in\gamma_x}\delta_{i,j}}_{\text{경계별 delay 합}}\\\underbrace{R_{\gamma_x}}_{\text{end-to-end bound}}&\le\underbrace{R_{exec,x}+R_{comm,x}}_{\text{실행과 통신을 결합}}\end{aligned}`,
      meaning: 'Arrival jitter를 predecessor에서 successor로 전파해 global fixed point를 구한 뒤 chain을 구성하는 subchain bounds와 communication delay를 더한다. Shared callbacks, event correlations와 repeated crossings는 pessimism을 만들 수 있다.',
      symbols: [[raw`R_{\gamma_x}`, 'Source release에서 sink completion까지 response-time upper bound'], [raw`R_{x,y}`, '한 reservation 안의 subchain response bound'], [raw`\delta_{i,j}`, 'Callback i activation에서 j의 DDS receive까지 bounded propagation delay']],
    },
  ],
  mechanismViz: CasiniProcessingChainLab,
  evidence: [
    {
      label: 'Executor trace',
      question: 'Source inspection으로 복원한 Crystal executor의 cached ready-set와 polling-point behavior가 실제 실행 trace에도 나타나는가?',
      intervention: 'Three topics, three services와 timer-creation topic을 가진 special-purpose node를 만들고 각 callback을 500 ms 실행하도록 했다. 두 batches의 messages/service requests와 timers를 정해진 시각에 넣어 Gantt execution order를 관찰했다.',
      observation: 'Queued messages가 여러 개여도 ready event당 한 callback instance가 처리됐고, processing window 중 도착한 service callback이 다음 polling point까지 건너뛰어졌다. 당시 timers는 non-timer polling point와 다른 방식으로 실행됐다.',
      supports: '논문이 분석한 Crystal C++ single-thread executor에서 ready-set snapshot, processing windows와 unusual interference가 존재한다는 scheduling model을 지지한다.',
      limit: '한 ROS 2 release와 built-in executor의 crafted trace다. 현재 executor의 timer priority, EventsCBGExecutor, multi-thread groups, other RMW/client libraries나 OS behavior를 입증하지 않는다.',
    },
    {
      label: 'Budget what-if',
      question: 'Reservation budget을 바꿀 때 time-driven과 event-driven local-planning chain의 predicted bound가 설계 trade-off를 드러내는가?',
      intervention: 'Bosch case의 observed maximum callback times와 sensor rates로 move_base graph를 모델링하고 global planner의 긴 workload를 local critical callbacks와 다른 reservation으로 분리했다. Local reservation budget을 변화시켜 pyCPA prototype으로 bounds를 계산했다.',
      observation: '두 설계 모두 budget이 줄수록 latency bound가 증가했다. Time-driven design은 worst-case sampling delay 한 period(80 ms)를 추가로 부담했고, event-driven design은 새 sensor result에 바로 반응해 낮은 jitter 구간에서 더 작은 bound를 보였다.',
      supports: 'CPU reservation dimensioning과 trigger architecture를 구현 전에 explicit timing constraint로 비교할 수 있다는 논문의 목적을 지지한다.',
      limit: '실제 ROS 2 move_base 실행 실험이 아니다. ROS 1 move_base 구조를 ROS 2 timing model로 옮긴 analysis case이며 WCET/communication assumptions가 틀리면 bound도 의미가 없다.',
    },
    {
      label: 'Jitter trade-off',
      question: 'Input jitter가 time-driven과 event-driven activation에 서로 다른 worst-case 영향을 주는가?',
      intervention: 'Revised case study에서 local planning reservation budget을 45%로 두고 input sensor jitter를 증가시키며 predicted end-to-end latency를 비교했다.',
      observation: 'Time-driven system은 burst 영향이 작아 jitter에 강했고 event-driven system은 추가 chain instances의 self-interference를 반영할 때 계단형으로 bound가 증가했다. Revised paper는 event-driven이 약 150 ms 아래 jitter에서 우세하고 더 큰 jitter에서는 self-interference에 밀렸다고 설명한다.',
      supports: 'Event-driven이 항상 더 빠르다는 단순 결론 대신 sampling delay와 burst interference를 workload jitter에 맞춰 비교해야 함을 지지한다.',
      limit: '특정 rates, WCET, budget과 model의 analytical prediction이다. 150 ms는 일반 ROS 2 threshold가 아니며 다른 executor/deployment에 이식할 수 없다.',
    },
    {
      label: 'Whole-chain precision',
      question: 'Callback을 개별 분석하는 것보다 같은 reservation의 chain을 함께 분석하면 burst over-counting을 줄이는가?',
      intervention: 'Event-driven case를 Lemma 8 whole-chain analysis 사용/미사용으로 비교했다.',
      observation: 'Whole-chain을 끄면 같은 chain의 interference가 four-fold over-counted되어 predicted bounds가 크게 부풀었고 낮은 bandwidth에서는 maximum busy-period upper-bound search가 수렴하지 않았다.',
      supports: 'Framework-specific bound가 safe하기만 해서는 충분하지 않고 correlation/chain structure를 반영해 useful precision을 확보해야 한다는 기여를 지지한다.',
      limit: 'Tighter analytical bound가 measured runtime에 더 가깝거나 deployment가 safe하다는 직접 실험은 아니다. Subchain assumptions와 revised Lemma 8 구현이 성립해야 한다.',
    },
    {
      label: 'Scope boundary',
      question: '논문이 timing guarantee에서 명시적으로 제외한 runtime features는 무엇인가?',
      intervention: 'System model과 limitations의 assumptions를 current ROS 2 runtime features와 대조했다.',
      observation: 'Single-thread built-in executor, fixed callback DAG, one executor per reservation, static processor assignment, schedulable reservations, bounded DDS delay와 at-most-one successor activation을 가정했다. Multi-thread callback groups, dynamic join/leave/mode changes, waitables/actions와 detailed network analysis는 future work였다.',
      supports: '논문 결과를 portable insight와 version-specific formula로 분리하고 current deployment에 그대로 certificate처럼 쓰지 않아야 함을 지지한다.',
      limit: 'Out-of-scope라는 사실은 modern system이 분석 불가능하다는 뜻이 아니다. 이후 executor와 analysis 연구를 연결해야 한다.',
    },
  ],
  implementation: [
    '대상 ROS distribution, rclcpp/RMW version과 executor implementation commit을 고정하고 paper의 Crystal assumptions와 다른 점을 먼저 기록한다.',
    'Tracepoints로 subscription/timer/service/action/waitable callback start/end, publish/take, thread, callback group, source sequence와 clock을 수집한다.',
    'Logical node graph를 actual callback activation DAG로 내리고 safety-relevant source-to-sink chains를 명시한다. Hidden future/action callbacks도 포함한다.',
    '각 callback의 operational WCET upper envelope를 representative worst inputs, cache state, CPU/GPU contention과 compiler configuration에서 구하고 measurement uncertainty를 남긴다.',
    'Source period, burst와 jitter를 arrival curves로 표현하고 runtime mode별로 별도 curves를 만든다. 평균 rate를 worst-case curve로 사용하지 않는다.',
    'Callbacks를 process, executor, callback group, worker thread, CPU/core와 reservation에 mapping하고 shared resource/mutex blocking을 표시한다.',
    'SCHED_DEADLINE 또는 chosen scheduler의 budget/period와 supply-bound function을 검증하고 all reservations가 processor에서 schedulable한지 먼저 확인한다.',
    'Process/host crossing마다 serialization, RMW, network와 receive delay upper bound를 넣고 clock synchronization과 measurement method를 기록한다.',
    'Paper의 pp-callback fixed point와 busy-period search를 작은 synthetic fixtures로 재현하고 revised Lemma 8을 사용한다. Original conference equation을 복사하지 않는다.',
    'Same-reservation linear callbacks를 subchain으로 묶되 shared callbacks, cycles, AND activation과 dynamic modes가 model boundary를 넘는지 검사한다.',
    'Time-driven/event-driven, callback placement, reservation budget과 isolation what-if sweep를 수행하고 physical deadline margin이 충분한 candidate만 deployment test로 보낸다.',
    'Synthetic burst, long callback, network delay, restart/mode change를 주입해 measured traces가 assumed bounds 안에 남는지 검증하고 위반 시 model 또는 runtime gate를 닫는다.',
  ],
  assumptions: [
    'ROS 2 Crystal C++ built-in single-thread executor의 historical scheduling model이 분석 대상과 일치한다.',
    'Callback graph는 fixed DAG이고 callbacks가 runtime 중 join/leave 또는 mode transition하지 않는다.',
    '각 source arrival curve, callback WCET와 communication delay가 finite upper bound를 가진다.',
    '각 executor는 하나의 reservation에, 각 reservation은 한 static processor에 할당되며 reservations는 schedulable하다.',
    '각 callback 실행은 successor instance를 edge당 최대 하나 activate하고 callback은 completion까지 non-preemptive하다.',
    'Network와 DDS delay를 δ_i,j 하나로 보수적으로 묶을 수 있고 clocks/trace identity가 response interval을 측정하기에 충분하다.',
    'Subchain 분석에서 같은 reservation의 연속 chain 구조와 activation assumptions가 revised Lemma 8에 맞는다.',
  ],
  failures: [
    '현재 ROS 2 executor에 Crystal의 timer priority와 ready-set priority order를 그대로 적용하면 version이 바뀐 scheduling behavior를 잘못 모델링한다.',
    'Multi-threaded executor, mutually-exclusive/reentrant callback groups, mutex와 hidden action/future callbacks는 paper model 밖의 parallelism/blocking을 만든다.',
    'Average callback time이나 observed p99를 WCET로 대체하면 rare path, allocator, page fault, GPU synchronization과 contention이 bound를 넘는다.',
    'Unbounded best-effort burst, keep-all queue, EventsCBGExecutor의 unbounded event queue 또는 network congestion이 finite arrival/delay assumption을 깨뜨린다.',
    'Runtime mode change, lifecycle activation, dynamic component load/unload와 endpoint discovery churn은 fixed graph analysis 사이의 transient를 만든다.',
    'Shared callbacks와 correlated arrivals를 callback마다 독립적으로 지불하면 bound가 지나치게 pessimistic해 usable budget을 찾지 못할 수 있다.',
    'DDS deadline은 RMW arrival까지만 감시하므로 executor wait와 application completion을 빼고 chain deadline으로 오인할 수 있다.',
    'Analytical timing bound가 맞아도 timestamp/frame/goal identity가 잘못된 message, bad control logic와 actuator hardware failure는 해결하지 않는다.',
  ],
  legacy: '이 논문의 오래 남는 기여는 2018 executor의 구체적인 priority 순서가 아니라 ROS의 modularity가 숨긴 시간 비용을 callback graph, arrival demand, executor interference, CPU supply와 end-to-end chain으로 다시 드러낸 방법이다. Current ROS 2는 timer prioritization 제거, wait-set improvements와 EventsCBGExecutor, callback groups, composition, tracing 등에서 달라졌다. 따라서 historical equations를 그대로 적용하기보다 같은 reconstruction 절차로 현재 executor를 모델링하고 measured traces와 physical deadline gate를 함께 유지해야 한다.',
  nextReading: '다음에는 ROS 2 Executor의 efficiency·real-time·determinism 연구와 rclc Logical Execution Time을 읽어 implicit scheduling을 explicit callback order/trigger semantics로 바꾸는 흐름을 연결한다. 그 뒤 multi-thread callback-group blocking과 network calculus를 포함한 current deployment timing model로 확장한다.',
  capabilities: [
    'Logical node/topic graph를 callback activation DAG와 source-to-sink processing chain으로 바꾼다.',
    'Arrival curve, WCET, request-bound function과 CPU supply-bound function의 역할을 구분한다.',
    'Crystal single-thread executor의 polling-point behavior가 일반 FIFO/fixed-priority model과 다른 이유를 설명한다.',
    'Release offset별 supply=demand fixed point와 maximum response bound의 의미를 읽는다.',
    'Callback-by-callback 분석의 pay-burst-many-times pessimism과 whole-subchain 분석의 목적을 설명한다.',
    'move_base budget, sampling delay와 input jitter evidence가 지지하는 claim과 일반화할 수 없는 threshold를 구분한다.',
    'Original conference Lemma 8 erratum과 revised formula를 구별한다.',
    'Current executor, multi-thread groups, dynamic lifecycle와 network가 paper assumptions를 깨는 지점을 감사한다.',
    'Analytical bound, empirical trace, QoS deadline과 physical actuator deadline을 서로 다른 증거로 유지한다.',
  ],
};
