import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import M from '@/components/ui/math';
import { LatencySurfaceLab, ObservabilityRecoveryLab } from './llm-serving-control/viz/ServingControlLabs';
import { IncidentFixtureStrip } from './llm-serving-control/viz/ServingControlViz';

export default function ObservabilityAIOpsArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="TTFT p95가 1.4초로 올랐다. 어느 dashboard 숫자를 보고 바로 scale-out해야 할까?"
          answer={<>하나의 숫자로는 결정할 수 없다. 사용자 실패를 먼저 고정하고 TTFT를 queue·input·prefill·첫 output 구간으로 나눈다. 그다음 같은 request·attempt·release·device identity로 gateway, runtime과 fleet 증거를 묶어 <strong>틀릴 수 있는 가설</strong>을 만든다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Observability는 화면을 많이 만드는 일이 아니라, “어느 층의 무엇이 사용자의 약속을 깨뜨렸는가?”를 좁히는 evidence system이다. AIOps도 LLM이 장애 요약을 쓰는 기능이 아니다. 탐지, 가설, 제한된 실행, 관찰, undo를 하나의 닫힌 control loop로 만드는 일이다.</p>
          <p>아래 Lab의 네 시나리오는 모두 TTFT가 나쁘다. 하지만 ITL tail, queue, backend attempt, Pending 상태와 device health를 함께 보면 첫 소유자와 안전한 조치가 달라진다. 이 차이를 읽지 못하면 capacity 장애에 kernel을 튜닝하거나 retry storm에 replica를 더 넣어 오히려 장애 비용을 키운다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Frontend TTFT', meaning: 'Frontend arrival부터 첫 output token까지의 시간이다.', why: 'Input 처리, queue와 prefill이 섞인 사용자측 첫 대기를 본다.' },
          { term: 'Scheduled TTFT', meaning: 'Scheduler가 실행을 시작한 뒤 첫 output token까지의 시간이다.', why: 'Queue를 별도 값으로 떼어 prefill 쪽을 좁힌다.' },
          { term: 'ITL', meaning: '연속된 두 output token 사이의 각 간격이다.', why: 'p99 같은 tail을 보면 평균이 숨기는 긴 token stall을 찾을 수 있다.' },
          { term: 'TPOT', meaning: '한 request의 첫 token 뒤 생성 구간을 output token 수로 나눈 평균이다.', why: 'Request별 decode 평균을 비교하지만 ITL tail을 대신하지는 못한다.' },
          { term: 'SLI / SLO', meaning: 'SLI는 실제로 잰 성공 비율, SLO는 그 비율이 도달해야 할 목표다.', why: 'GPU 사용률이 아니라 사용자에게 약속한 결과에서 장애를 시작하게 한다.' },
          { term: 'Error budget', meaning: 'SLO가 평가 기간에 허용한 bad event의 양이다.', why: '모든 작은 흔들림에 page하지 않고 실제 위험의 크기와 지속 시간을 함께 본다.' },
          { term: 'Correlation identity', meaning: 'Request, attempt, route, release, Pod와 device를 잇는 식별자 묶음이다.', why: '같은 시간대였다는 이유만으로 서로 다른 사건을 원인과 결과로 오인하지 않게 한다.' },
          { term: 'Counterevidence', meaning: '가설이 맞다면 달라져야 하지만 실제로는 안정적인 신호다.', why: '가능한 원인을 늘어놓지 않고 먼저 조사할 순서를 줄인다.' },
          { term: 'Idempotent action', meaning: '같은 action key로 다시 요청해도 목표 상태가 한 번만 적용되는 조치다.', why: 'Timeout 뒤 재시도가 replica나 route weight를 중복 변경하지 않게 한다.' },
        ]} />
        <ObservabilityRecoveryLab />
      </section>

      <section id="measurement-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">무엇을 성공으로 셌는지부터 고정한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“TTFT p95가 1초 이내”라고 쓰기 전에 평가 대상과 시계를 정해야 한다. 인증 실패, 사용자가 즉시 취소한 요청, server가 admission한 뒤 timeout 난 요청을 분모에 넣을지 정책이 없으면 팀마다 다른 성공률을 계산한다. 예를 들어 이 글에서는 <strong>인증과 admission을 통과해 응답을 약속한 logical request</strong>를 eligible request로 둔다. Server가 받은 뒤의 timeout과 5xx는 bad event이고, 요청 길이·model class·streaming 여부는 SLO를 나눌 수 있는 bounded dimension이다.</p>
        </div>
        <LatencySurfaceLab />
        <M display>{String.raw`\underbrace{\mathrm{SLI}_{T}}_{\text{시간 기준 성공 비율}}
=\frac{\underbrace{N_{\mathrm{good}}}_{\text{기준 안에 첫 토큰}}}
{\underbrace{N_{\mathrm{eligible}}}_{\text{응답을 약속한 요청}}}`}</M>
        <FormulaNote
          meaning="Eligible request 중 terminal success이고 TTFT 기준 T도 지킨 logical request의 비율이다. 첫 token 전 timeout은 histogram에 TTFT 표본이 없어도 good이 아니라 bad다."
          symbols={[[String.raw`T`, '사용자에게 약속한 frontend TTFT 상한'], [String.raw`N_{\mathrm{good}}`, '성공했고 frontend TTFT도 T 이하인 logical request 수'], [String.raw`N_{\mathrm{eligible}}`, '인증·admission 뒤 서비스가 응답을 약속한 logical request 수']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>p95는 원인도 아니고 개별 요청의 trace도 아니다. 여러 replica의 이미 계산된 p95를 평균내면 전체 p95가 되지 않는다. Replica를 합쳐 보려면 histogram bucket의 count를 먼저 합산한 뒤 percentile을 계산한다. Stable과 canary를 비교하려면 scrape target이나 OpenTelemetry resource에 bounded <code>release_channel=stable|canary</code>과 <code>service.version</code>을 붙인다. 두 cohort가 같은 model alias만 가진다면 release 비교는 <strong>판정 불가</strong>다.</p>
          <pre><code>{`histogram_quantile(
  0.95,
  sum by (le, release_channel) (
    rate(vllm:time_to_first_token_seconds_bucket[5m])
  )
)`}</code></pre>
          <p>TTFT라는 이름도 telemetry surface에 따라 시계가 다르다. 현재 vLLM Prometheus histogram의 frontend TTFT는 frontend arrival, 현재 구현상 tokenization 시작에서 첫 token까지라 input 처리·queue·prefill을 포함한다. 반면 response의 per-request <code>time_to_first_token_ms</code>는 scheduled→first token이고 queue는 <code>queue_time_ms</code>로 따로 나온다. 앞은 seconds, 뒤는 milliseconds다. 이름만 맞춰 직접 빼거나 release series를 섞으면 안 된다.</p>
          <p>Queue도 두 값이 있다. Waiting gauge는 scrape 순간 줄 길이이고 queue-duration histogram은 완료된 요청이 실제로 기다린 시간의 분포다. 한 번의 gauge spike와 지속적인 queue p95 상승은 다른 현상이다. ITL은 token gap 각각의 분포이고 TPOT은 request 평균이므로 TPOT이 안정적이어도 ITL p99 stall은 악화될 수 있다.</p>
          <p>Per-request timing에는 missing 정책도 필요하다. 현재 vLLM은 <code>n &gt; 1</code>, multiple prompt처럼 단일 stream에 시간을 귀속할 수 없을 때 timing을 <code>null</code>로 두며 streaming은 final usage chunk가 전달되어야 한다. Missing은 0 ms도 success도 아니다. Missing ratio를 별도로 기록하고 release 비교에서는 표본에서 조용히 제거하지 않는다.</p>
        </div>
        <Misconception>“p95 1.4초”는 요청 95%가 정확히 1.4초라는 뜻이 아니다. 관찰 집합의 95%가 그 값 이하라는 경계이며, traffic mix가 바뀌면 code가 같아도 값이 변할 수 있다.</Misconception>
      </section>

      <section id="slo-budget" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">SLO는 alert threshold가 아니라 허용 실패 장부다</h2>
        <M display>{String.raw`\underbrace{B_{\mathrm{bad}}}_{\text{허용 bad event}}
=\underbrace{N_{\mathrm{eligible}}}_{\text{평가 요청 수}}
\underbrace{(1-S)}_{\text{SLO가 허용한 실패율}}`}</M>
        <FormulaNote
          meaning="SLO 평가 기간에 허용되는 bad logical request 수를 계산한다. 99% SLO에서 eligible request가 100,000개라면 budget은 1,000개다."
          symbols={[[String.raw`N_{\mathrm{eligible}}`, '평가 기간의 eligible logical request 수'], [String.raw`S`, '0과 1 사이의 SLO 목표'], [String.raw`B_{\mathrm{bad}}`, '기간 안에 허용되는 bad request 수']]} />
        <M display>{String.raw`\underbrace{\rho_w}_{\text{창 }w\text{의 소진 속도}}
=\underbrace{\frac{N_{\mathrm{bad}}(w)}{N_{\mathrm{eligible}}(w)}}_{\text{관찰한 실제 실패율}}
\div\underbrace{(1-S)}_{\text{장기 허용 실패율}}`}</M>
        <FormulaNote
          meaning="Window w의 실제 실패율을 SLO가 허용한 실패율로 나눈다. 99% SLO에서 5분 실패율이 4%라면 burn은 4배다. 이 속도가 계속되면 budget을 계획보다 네 배 빠르게 쓴다."
          symbols={[[String.raw`w`, '5분, 1시간처럼 정책이 정한 관찰 창'], [String.raw`N_{\mathrm{bad}}(w)`, '관찰 창 안의 bad logical request 수'], [String.raw`\rho_w`, '그 창의 상대적인 error-budget 소진 속도']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>짧은 창만 보면 빠르지만 순간 spike에 흔들리고, 긴 창만 보면 정확하지만 page가 늦다. 그래서 빠른 page는 짧은 창과 긴 창이 <strong>같은 burn 위험</strong>을 동시에 확인하도록 구성한다. 예를 들어 5분이 높아도 1시간이 정상이라면 일시 spike일 수 있고, 둘 다 높으면 지속되는 장애일 가능성이 커진다. 구체적인 window와 burn threshold는 SLO 기간, traffic과 on-call 정책에서 계산하며 모든 서비스에 같은 숫자를 복사하지 않는다.</p>
          <p>Low-traffic route는 request 몇 개만 실패해도 burn이 크게 튄다. 최소 event 수, 더 긴 window, 유사 route의 합산 중 어떤 정책을 쓸지 정하고 alert에 분모를 함께 표시해야 한다. 그렇지 않으면 “burn 20배”만 보고 실제로는 1/5 요청 실패인 작은 표본을 긴급 장애로 오해한다.</p>
          <p>숫자로 확인해 보자. Eligible request 1,000,000개 중 첫 token 전 timeout이 900개이고, first token은 나왔지만 TTFT 기준을 넘긴 요청이 200개라면 bad는 1,100개다. 99.9% SLO의 budget은 1,000개이므로 이미 110%를 썼다. TTFT histogram만 보면 first token이 없던 timeout 900개를 놓쳐 bad를 200개로 잘못 셀 수 있다.</p>
        </div>
        <Misconception>GPU utilization 90% 같은 resource threshold는 사용자 SLO가 아니다. Utilization이 낮아도 queue, Pending, route imbalance나 slow model load 때문에 사용자 요청은 실패할 수 있다.</Misconception>
      </section>

      <section id="evidence-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Metric, trace, state snapshot은 서로 다른 질문에 답한다</h2>
        <IncidentFixtureStrip />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>Metric</strong>은 영향의 크기와 시간축을 빠르게 찾는다. TTFT histogram, bad-event counter, waiting request, Ready endpoint 수와 attempt amplification이 여기에 속한다. <strong>Trace</strong>는 한 logical request가 어느 attempt, route, release와 runtime을 거쳤는지 잇는다. <strong>State snapshot</strong>은 그 순간의 ResourceClaim, Pod condition·Event, device health, release manifest와 route generation을 보존한다.</p>
          <p>Request id, prompt hash, Pod UID처럼 값이 끝없이 늘어나는 identity는 Prometheus label로 넣지 않는다. Metric에는 route class, release, bounded error type처럼 제한된 차원만 두고, 개별 identity는 sampled trace나 log에서 연결한다. 그래야 사고를 조사하려다 monitoring system의 cardinality와 비용 자체를 폭발시키지 않는다.</p>
          <p>모든 층이 request id로 직접 이어지는 것은 아니다. Gateway→runtime span은 <strong>direct trace join</strong>, Pod UID→claim→GPU UUID는 <strong>entity join</strong>, request trace와 node-wide XID가 같은 시간에 일어났다는 연결은 <strong>temporal correlation</strong>이다. 마지막 것은 가설일 뿐 그 request가 그 GPU에서 실패했다는 증명이 아니다. DCGM의 Pod UID 수집과 claim mapping도 배포 설정에 따라 없을 수 있으므로 join 가능 여부 자체를 evidence packet에 남긴다.</p>
          <p>Prompt와 output은 더 엄격하다. Metadata correlation과 content capture를 분리하고 content는 기본 off, 명시적 sampling, redaction, retention과 접근 제어를 거친다. “디버깅에 유용하다”는 이유는 사용자 입력 전체를 상시 저장할 근거가 아니다.</p>
        </div>
        <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
          <div className="grid gap-px bg-border md:grid-cols-3">
            <div className="bg-background p-5">
              <p className="text-xs font-black">01 · 사용자 결과</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">eligible, good/bad, TTFT·TPOT, completion 상태, logical cost</p>
            </div>
            <div className="bg-background p-5">
              <p className="text-xs font-black">02 · 실행 lineage</p>
              <p className="mt-3 break-words text-sm leading-relaxed text-muted-foreground">request_id → attempt_id[] → route_reason → release_id → endpoint</p>
            </div>
            <div className="bg-background p-5">
              <p className="text-xs font-black">03 · 자원 identity</p>
              <p className="mt-3 break-words text-sm leading-relaxed text-muted-foreground">Pod UID → claim / allocated device → current device health → topology</p>
            </div>
          </div>
        </div>
      </section>

      <section id="incident-trace" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">증상에서 owner까지 내려가는 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><strong>사용자 증상:</strong> TTFT SLI의 bad-event ratio, 분모, affected tenant·route와 시작 시점을 고정한다.</li>
            <li><strong>Gateway:</strong> logical request와 backend attempt를 분리하고 선택 deployment, fallback·retry 비율, provider error와 실제 cost를 본다.</li>
            <li><strong>Runtime:</strong> waiting gauge와 queue-duration을 구분하고 prefill·decode·ITL, KV usage, preemption과 waiting reason을 본다.</li>
            <li><strong>Fleet:</strong> Node Ready/taint, advertised allocatable, scheduler-feasible free, allocated claim/device, 현재 device health와 warm endpoint를 각각 확인한다.</li>
            <li><strong>Release:</strong> immutable manifest, startup·readiness timestamp, warmup 결과와 canary revision을 대조한다.</li>
          </ol>
          <p>이 순서는 무조건 gateway부터 고치라는 뜻이 아니다. 사용자 실패에서 시작해 가장 값싼 분리 신호로 후보를 줄이라는 뜻이다. Frontend TTFT만 오르고 ITL tail과 attempt가 안정적이며 queue·Pending이 함께 오르면 capacity admission 조사가 앞선다. Frontend TTFT와 ITL tail이 새 release에서만 함께 오르면 runtime/release가 앞선다. 다만 global 평균은 작은 canary 회귀를 가릴 수 있으므로 release cohort를 나누어 본다.</p>
          <p><strong>Pending은 원인 이름이 아니라 Pod phase다.</strong> <code>PodScheduled</code> condition과 <code>FailedScheduling</code> Event를 보고 GPU 부족, taint/affinity, quota와 ResourceClaim allocation을 가른다. 이미 scheduled된 Pod가 image pull이나 container startup을 기다리는 경우도 Pending일 수 있다. “Pending 2개”만으로 GPU를 더 사거나 node를 늘리지 않는다.</p>
          <p>Node가 Ready여도 할당 GPU가 건강하다는 뜻은 아니다. Kubernetes device plugin이 device를 unhealthy로 보고하면 새 scheduling을 위한 allocatable은 줄지만, 이미 그 device를 받은 Pod의 할당이 자동으로 다른 GPU로 이동하는 것은 아니다. Pod identity와 실제 allocated device, DCGM health/XID evidence를 이어서 보아야 한다.</p>
          <p>Prefill과 decode가 다른 worker에 있는 disaggregated serving에서는 queue 상승과 안정적인 decode가 GPU 부족이 아니라 KV handoff나 fabric 문제일 수 있다. 지표 이름은 runtime과 release마다 다르다. 해당 구현이 <code>transfer deferred</code> 같은 대기 이유와 NIXL transfer 시간·오류를 실제로 노출하고 둘이 함께 오른다면 source·destination Pod/GPU부터 KV handoff를 조사한다. 먼저 <InternalLink slug="llm-disaggregated-serving">Disaggregated serving</InternalLink>에서 software ownership과 transfer contract를 확인하고, NIC·RDMA 자체가 병목 후보로 좁혀진 뒤 <InternalLink slug="gpu-hpc-from-scratch">GPU HPC 네트워크</InternalLink>의 fabric 장부로 내려간다.</p>
          <p>상관관계는 가설을 고를 뿐 원인을 증명하지 않는다. Canary control과 비교하거나, blast radius가 작은 한 가지 상태를 바꾼 뒤 예상 지표가 움직이는지 확인해야 인과 증거가 생긴다. 여러 설정을 한 번에 바꾸면 복구는 될 수 있어도 무엇이 원인이었는지는 배우지 못한다.</p>
        </div>
      </section>

      <section id="automation-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">자동화는 실행보다 되돌림을 먼저 설계한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>안전한 자동 조치는 <strong>trigger, evidence, precondition, absolute desired state, blast radius, time limit, success query, undo</strong>를 가진다. “replica 하나 추가” 같은 상대 명령은 timeout 뒤 재실행될 때 계속 늘어날 수 있다. “deployment r42의 Ready 목표를 6으로 맞춘다”처럼 목표 상태와 generation을 고정하고, incident·target·action·generation으로 idempotency key를 만든다.</p>
          <p>Action을 예약할 때 target UID와 현재 <code>resourceVersion</code>, before/after digest, controller owner와 lease를 함께 고정한다. 다른 controller가 먼저 상태를 바꾸었거나 HPA가 같은 replicas를 소유한다면 stale action을 실행하지 않고 triage로 돌아간다. Traffic weight 변경, Deployment revision rollback과 scaling은 서로 다른 target·완료 predicate·undo를 가진 별도 action type이다.</p>
          <p>Action record는 detected → hypothesis ready → reserved → executing → observing → verified recovered 또는 undo observing → rolled-back verified로 이동한다. Applied는 API가 200을 돌려줬다는 뜻일 뿐 복구가 아니다. Metric missing, lease 충돌, 실행 timeout이나 rollback 실패는 recovered가 아니라 escalated다.</p>
          <p>Observation window는 API 응답 시점이 아니라 새 Pod가 Ready·warm이고 traffic에 붙은 뒤 시작한다. 최소 표본, pre-action baseline, stable control, traffic mix를 고정하며 사용자 SLI와 가설이 예측한 내부 지표가 target에서만 함께 회복되어야 causal recovery 후보가 된다. Target과 control이 같이 좋아지거나 ingress가 40% 줄었다면 결과는 inconclusive다.</p>
          <p>예를 들어 “TTFT 높음 → scale-out”이 아니라 “5분·1시간 burn이 함께 높고 queue가 증가하며 scheduler-feasible free가 있고 device health가 정상일 때 stable pool Ready 목표를 5→6으로 한 번 변경한다. Warm 이후 10분과 최소 10,000 request를 관찰해 queue와 TTFT가 낮아지고 first-attempt success, attempt/request, fallback fraction과 cost가 나빠지지 않으면 유지한다. 아니면 generation 18 상태로 원복하고 원복 완료까지 다시 검증한다”라고 쓴다.</p>
          <p>이 글이 닫는 산출물은 incident summary가 아니라 <strong>행동 전후 evidence, 예상 방향의 충족 여부와 undo 결과</strong>다. 새 장애가 engine 내부라면 <InternalLink slug="vllm-scheduler">Scheduler</InternalLink>나 <InternalLink slug="vllm-paged-attention">KV 장부</InternalLink>로, route policy라면 <InternalLink slug="litellm-gateway">Gateway attempt 장부</InternalLink>로 다시 내려간다.</p>
        </div>
        <CapabilityCheck items={[
          'Eligible request와 good/bad event를 정해 TTFT SLI의 분모와 분자를 설명할 수 있다.',
          'Error budget과 5분·1시간 burn을 계산하고 low-traffic 표본의 함정을 설명할 수 있다.',
          'Frontend/scheduled TTFT, TPOT/ITL, waiting gauge/queue duration을 구분하고 첫 owner와 반증을 고를 수 있다.',
          'Metric label과 per-request trace identity를 분리하고 prompt/output 수집의 privacy 경계를 세울 수 있다.',
          '자동 조치에 idempotency key, absolute desired state, observation window, success query와 undo를 붙일 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'vLLM Metrics design', href: 'https://docs.vllm.ai/en/stable/design/metrics/', note: 'TTFT, queue, prefill·decode·inter-token interval의 event와 process 경계. 현재 구현은 release마다 다시 확인한다.' },
          { label: 'vLLM per-request metrics', href: 'https://docs.vllm.ai/en/latest/features/per_request_metrics/', note: 'Aggregate histogram을 보완하는 request timing과 단일 generation stream 제약.' },
          { label: 'Google SRE Workbook: Alerting on SLOs', href: 'https://sre.google/workbook/alerting-on-slos/', note: 'Error-budget burn과 multi-window, multi-burn-rate alert의 근거.' },
          { label: 'Prometheus histograms and summaries', href: 'https://prometheus.io/docs/practices/histograms/', note: 'Replica별 precomputed percentile을 평균내지 않고 histogram bucket을 집계하는 이유.' },
          { label: 'Prometheus instrumentation', href: 'https://prometheus.io/docs/practices/instrumentation/', note: 'Label cardinality 비용과 bounded metric dimension 원칙.' },
          { label: 'OpenTelemetry GenAI conventions', href: 'https://github.com/open-telemetry/semantic-conventions-genai', note: 'GenAI signal schema와 input/output content의 민감정보 경고. 기존 core semantic-conventions 페이지에서 분리된 현재 저장소다.' },
          { label: 'OpenTelemetry service resource', href: 'https://opentelemetry.io/docs/specs/semconv/resource/service/', note: 'Release cohort를 service.version 같은 bounded resource identity로 구분하는 근거.' },
          { label: 'Kubernetes Pod lifecycle', href: 'https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/', note: 'Pending phase, Pod condition과 container startup 상태의 구분.' },
          { label: 'Kubernetes device plugins', href: 'https://kubernetes.io/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/', note: 'Unhealthy device가 allocatable과 이미 할당된 workload에 미치는 서로 다른 영향.' },
          { label: 'NVIDIA DCGM exporter metrics', href: 'https://docs.nvidia.com/datacenter/dcgm/latest/reference/dcgm-exporter-metrics.html', note: 'XID, GPU health, Pod·DRA claim과 device identity를 잇는 telemetry 경계.' },
          { label: 'NVIDIA GPUDirect RDMA', href: 'https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/gpu-operator-rdma.html', note: '분산 prefill/decode의 GPU memory와 NIC 전송 경로를 확인하는 기반.' },
        ]} />
      </section>
    </>
  );
}
