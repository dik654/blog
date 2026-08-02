import {
  CapabilityCheck,
  BeginnerOpening,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { IncidentFixtureStrip } from './llm-serving-control/viz/ServingControlViz';
import { OpsEvidenceLab } from './llm-serving-control/viz/ServingControlLabs';

export default function LLMServingOpsArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">원한 서버 수와 실제 요청을 받는 서버 수는 다르다</h2>
        <BeginnerOpening
          title="운영 제어는 원하는 상태를 실제 준비 상태와 계속 맞추는 일이다"
          description={<>Kubernetes에서 <strong>Pod</strong>는 모델 서버 프로그램을 실행하는 한 단위다. Pod 여덟 개를 원한다고 선언해도 GPU를 배정받고, 모델을 읽고, 시험 요청을 통과한 뒤에야 실제 사용자의 요청을 받을 수 있다. <strong>TTFT</strong>는 요청 뒤 첫 답 조각이 나올 때까지의 시간이다.</>}
          familiarScene={<>마트가 계산대 여덟 개를 열겠다고 계획했다고 하자. 직원이 배정되지 않았거나 단말기가 켜지는 중이거나 손님 안내 표지가 닫힌 계산대로 보내면, 계산대 수는 여덟이라고 적혀 있어도 줄은 길어진다.</>}
          steps={[
            { label: '원하는 배포 상태를 적는다', detail: '어떤 모델 버전을 몇 개 띄우고 언제 되돌릴지 선언한다.' },
            { label: '실제 준비 상태를 확인한다', detail: 'GPU 할당, 모델 로딩, 준비 검사와 시험 요청을 각각 확인한다.' },
            { label: '요청과 증거를 연결한다', detail: '어느 버전·서버로 보냈는지와 응답 시간을 같은 trace로 묶는다.' },
          ]}
        />
        <QuestionLead
          question="Pod 여덟 개를 원한다고 선언했는데 첫 답까지의 시간이 나빠졌다. 가장 먼저 GPU를 더 사야 할까?"
          answer={<>아니다. <strong>원하는 replica, 실제 할당 가능한 GPU, warmup을 통과한 endpoint, gateway가 보내는 traffic</strong>은 서로 다른 상태다. 먼저 release·capacity·route·evidence 중 어디에서 인계가 멈췄는지 찾아야 한다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>vLLM이 token을 잘 생성해도 그 engine 하나만으로 production service가 되지는 않는다. Model과 tokenizer가 같은 revision인지, GPU가 실제로 할당됐는지, 새 pod가 warmup을 마쳤는지, tenant가 허용된 route로 들어갔는지, 장애 뒤 행동이 효과가 있었는지를 다른 controller가 소유한다.</p>
          <p>이 경로는 제품 목록이 아니라 <strong>사용자 요청 계약과 release artifact가 검증된 복구 증거가 되기까지의 제어면</strong>을 읽는다. 각 글은 하나의 산출물만 만들며, 앞 단계가 끝났다는 증거 없이 다음 단계가 성공했다고 간주하지 않는다.</p>
          <p>가장 먼저 고정할 것은 “LLM을 띄운다”가 아니다. Streaming인지 batch인지, 최대 context와 tool·JSON 계약은 무엇인지, TTFT·TPOT(Time Per Output Token, 첫 token 뒤 각 output token을 만드는 평균 시간)·완료 지연 중 어느 SLO를 지킬지, 품질·비용 hard gate가 무엇인지 적는다. 이 요청 계약이 있어야 representative warmup과 canary fixture도 선택할 수 있다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Data plane', meaning: '실제 요청을 받아 token을 계산하고 반환하는 실행 경로다.', why: 'vLLM request runtime이 주로 이 경로를 소유한다.' },
          { term: 'Control plane', meaning: '원하는 상태를 선언하고 현재 상태와 비교해 배포·할당·routing·복구를 조정하는 경로다.', why: 'Pod 수나 route config가 즉시 실제 capacity가 되지는 않기 때문이다.' },
          { term: 'SLO', meaning: '특정 기간에 사용자에게 약속한 latency·availability 목표다.', why: 'Scale, fallback과 rollback 중 무엇이 성공인지 판정하는 기준이 된다.' },
          { term: 'TPOT · Time Per Output Token', meaning: '첫 token이 나온 뒤 output token 하나를 만드는 데 걸리는 평균 시간이다.', why: 'TTFT만 나쁘고 TPOT은 안정적이면 decode 계산보다 queue·admission·prefill 경로를 먼저 의심할 수 있다.' },
          { term: 'Evidence', meaning: 'release id, device identity, route reason과 request trace를 연결한 관찰 기록이다.', why: '메트릭 변화가 어떤 변경 때문에 생겼는지 검증하려면 필요하다.' },
        ]} />
        <OpsEvidenceLab />
      </section>

      <section id="incident-fixture" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">다섯 글이 함께 푸는 하나의 incident</h2>
        <IncidentFixtureStrip />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Canary는 replica 8개를 원하지만 광고 수량에서 사용 중 device와 GPU model 종류(SKU), 공유 방식, node label·taint 배치 정책을 거른 scheduler-feasible free GPU는 6개뿐이다. 구체적인 필터는 <InternalLink slug="k8s-gpu-fleet">GPU Fleet</InternalLink>가 소유한다. 그중 5개만 Ready이고 하나는 240초 startup(weight load·engine init)을 끝낸 뒤 아직 warmup 중이며 두 pod는 Pending이다. 동시에 800 req/min이 들어오고 TTFT p95는 0.45초에서 1.4초로 올랐지만 TPOT은 안정적이다.</p>
          <p>이 증거는 “GPU utilization이 낮으니 GPU가 남는다”는 결론을 허용하지 않는다. Pending은 아직 GPU를 쓰지 않고, warmup endpoint는 traffic을 받지 않으며, queue wait는 GPU kernel 밖에서도 TTFT를 올린다. 따라서 desired state부터 request trace까지 순서대로 연결해야 한다.</p>
        </div>
        <Misconception>Grafana 첫 화면에 보이는 숫자가 곧 원인은 아니다. TTFT는 queue, input processing, prefill과 첫 output까지의 합이며, GPU utilization은 Pending pod와 잘못된 route를 설명하지 못한다.</Misconception>
      </section>

      <section id="ownership-route" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">읽는 순서: 산출물이 완성되는 순서</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li><InternalLink slug="serving-deployment">배포 생명주기</InternalLink>에서 model, tokenizer, engine args와 image digest를 하나의 immutable release로 묶고 startup·readiness·warmup·rollback target을 만든다.</li>
            <li><InternalLink slug="k8s-gpu-fleet">GPU Fleet</InternalLink>에서 allocation lane이 어떤 device와 node identity를 골랐는지, desired 8이 왜 scheduler-feasible 6과 Ready 5에서 멈추는지 찾는다.</li>
            <li><InternalLink slug="litellm-gateway">Gateway</InternalLink>에서 authenticated request를 capability, quota, health와 cost로 거르고 retry·fallback·cooldown을 구분한다.</li>
            <li><InternalLink slug="observability-aiops">관측성과 복구</InternalLink>에서 같은 request id와 release id로 증거를 묶어 bounded action을 실행하고 회복 또는 rollback을 검증한다.</li>
          </ol>
          <p>Request runtime을 아직 모른다면 <InternalLink slug="llm-disaggregated-serving">Prefill·Decode 분리 서빙</InternalLink>와 <InternalLink slug="vllm-paged-attention">물리 KV 장부</InternalLink>를 먼저 읽는다. 제어면은 engine 내부 병목을 대신 설명하지 않는다.</p>
        </div>
      </section>

      <section id="recovery-ledger" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">복구는 한 번만 효과가 나도록 장부를 닫는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>“Canary traffic을 20% 줄인다”라는 상대 명령은 같은 alert가 세 번 전달되면 세 번 실행될 수 있다. 대신 <code>incident_id + action_kind + target_release + generation</code>을 idempotency key로 삼고, “r43 weight를 0%로 만든다”처럼 절대 desired state를 기록한다.</p>
          <p>한 행동은 <code>planned → applied → verifying → closed</code> 또는 <code>undone</code> 상태를 가진다. 실행 전에는 현재 generation이 예상값과 같은지 compare-and-set으로 확인하고, 실행 뒤에는 같은 release·route·device identity의 지표를 다시 잰다. 중복 전달은 새 부작용이 아니라 이미 기록된 결과를 반환해야 한다.</p>
          <ul>
            <li><strong>Input:</strong> incident id, 가설, target release, 현재 generation과 observation window.</li>
            <li><strong>Effect:</strong> 절대 route weight, rollback manifest 또는 차단할 retry budget.</li>
            <li><strong>Proof:</strong> action execution id, 변경 전후 state, 같은 identity의 SLO·queue·cost.</li>
            <li><strong>Undo:</strong> 이전 desired state와 실행 가능한 rollback target.</li>
          </ul>
        </div>
        <CapabilityCheck items={[
          'Desired replica, allocated device, Ready endpoint와 admitted route를 서로 다른 상태로 그릴 수 있다.',
          'TTFT 상승을 곧바로 GPU 부족으로 단정하지 않고 owner별 evidence query 순서를 정할 수 있다.',
          '중복 alert가 와도 한 번만 효과가 나는 recovery key와 절대 desired state를 설계할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Kubernetes Controllers', href: 'https://kubernetes.io/docs/concepts/architecture/controller/', note: 'Desired state와 current state를 조정하는 control loop의 최소 개념.' },
          { label: 'vLLM Metrics', href: 'https://docs.vllm.ai/en/latest/design/metrics/', note: 'TTFT, inter-token latency, queue와 KV 상태의 현재 engine metric 정의.' },
          { label: 'OpenTelemetry GenAI conventions', href: 'https://opentelemetry.io/docs/specs/semconv/registry/attributes/gen-ai/', note: 'Provider, request, response와 usage attribute의 version-sensitive 공통 이름 및 민감정보 경계.' },
          { label: 'AWS Builders Library · Idempotent APIs', href: 'https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/', note: 'Client request identifier로 중복 side effect를 막는 설계 원칙. 이 글의 recovery ledger는 이를 운영 행동에 적용한 설계다.' },
        ]} />
      </section>
    </>
  );
}
