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
import { IncidentFixtureStrip } from './llm-serving-control/viz/ServingControlViz';
import { ReleaseDecisionLab } from './llm-serving-control/viz/ServingControlLabs';

export default function ServingDeploymentArticle() {
  return (
    <>
      <section id="overview" className="mb-16 scroll-mt-20">
        <QuestionLead
          question="새 Pod가 Running이면 새 모델 release에 traffic을 보내도 될까?"
          answer={<>아니다. Running은 container process가 시작됐다는 뜻이다. Model weight load, engine initialization, KV reservation, representative warmup과 release-specific check가 끝난 뒤 <strong>Ready endpoint</strong>가 되어야 한다.</>}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>LLM release는 container image 하나가 아니다. Model weight revision, tokenizer, chat template, quantization, adapter, engine arguments와 image digest가 함께 바뀐다. 이 중 하나라도 빠지면 품질·latency 회귀를 같은 artifact로 재생하거나 되돌릴 수 없다.</p>
          <p>Deployment controller는 ReplicaSet rollout을 관리하지만 model quality를 이해하지 못한다. 따라서 Kubernetes probe와 별도로 representative prompt, structured output, tool call과 latency fixture를 canary gate에 넣어야 한다.</p>
        </div>
        <ConceptPrimer items={[
          { term: 'Startup probe', meaning: '긴 초기화가 끝날 때까지 liveness와 readiness 판단을 유예한다.', why: '240초 model load를 crash loop로 오인하지 않게 한다.' },
          { term: 'Readiness', meaning: '일반 traffic endpoint로 사용할 수 있는 상태다.', why: 'Running이지만 warmup 중인 pod를 load balancer에서 제외한다.' },
          { term: 'Canary', meaning: '새 release에 제한된 traffic만 보내 baseline과 비교한다.', why: 'Model quality와 비용 회귀는 process health만으로 잡히지 않는다.' },
          { term: 'Rollback target', meaning: '직전 정상 model/runtime manifest와 traffic policy다.', why: '문제가 생긴 뒤 무엇으로 되돌릴지 즉석에서 추측하지 않게 한다.' },
        ]} />
        <ReleaseDecisionLab />
      </section>

      <section id="manifest-contract" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 revision이 아니라 호환되는 실행 묶음을 증명한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Model과 tokenizer는 별도 commit으로 고정할 수 있다. 따라서 문자열이 같아야 한다는 규칙이 아니라, <strong>그 조합이 실행 계약을 만족하는지</strong> 검사해야 한다. Manifest에는 가능한 한 tag가 아닌 full commit과 content hash를 남긴다.</p>
          <ol>
            <li><strong>Model:</strong> repository, full commit, weight·config hash, architecture, context와 RoPE 설정.</li>
            <li><strong>Tokenizer:</strong> commit, vocab·merges, special token id와 chat template hash.</li>
            <li><strong>변형:</strong> adapter의 base-model fingerprint, quantization format·config와 kernel 요구.</li>
            <li><strong>Runtime:</strong> image digest, vLLM·CUDA version, engine args, TP·PP 크기와 GPU architecture.</li>
            <li><strong>검증 입력:</strong> golden prompt·tool schema·structured output fixture와 eval corpus hash.</li>
          </ol>
          <p>Verifier는 vocab 크기와 embedding row, special token id, adapter base hash, quantization·GPU 지원, TP divisibility, context·template·tool schema를 검사한다. Runtime의 <code>/release</code> fingerprint가 manifest와 다르면 process가 정상이어도 release 증거는 실패다.</p>
        </div>
        <Misconception>Model revision과 tokenizer revision의 문자열이 같다는 사실만으로 호환성이 증명되지는 않는다. 반대로 서로 다른 commit이어도 검증된 조합일 수 있다. 고정해야 할 것은 재현 가능한 조합과 그 조합을 통과시킨 verifier다.</Misconception>
      </section>

      <section id="cold-start" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Cold start는 시간뿐 아니라 도착 요청의 장부다</h2>
        <M display>{String.raw`\underbrace{A_{\mathrm{startup}}}_{\text{시작 준비 중 도착 요청}}=\underbrace{\lambda}_{\text{초당 요청률}}\underbrace{t_{\mathrm{startup}}}_{\text{실행 엔진 시작까지의 시간}}`}</M>
        <FormulaNote
          meaning="새 replica의 weight load와 engine init이 끝날 때까지 들어오는 요청 수의 하한을 계산한다. 왜 곱하는가: 초당 요청률에 startup 시간을 곱하면 그 구간에 도착한 총 요청 수가 된다. 뒤따르는 readiness warmup 시간, 기존 replica가 처리하는 양, retry와 timeout은 포함하지 않은 단순 arrival pressure다."
          symbols={[[String.raw`\lambda=800/60`, '초당 약 13.33 request'], [String.raw`t_{\mathrm{startup}}=240\,s`, 'weight load와 engine init까지의 fixture'], [String.raw`A_{\mathrm{startup}}=3200`, 'startup 동안 새로 도착하는 request 수']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>3,200개를 그대로 queue에 쌓으라는 뜻이 아니다. 이 수는 startup 단계만 센 하한이다. 그 뒤 readiness warmup이 더 걸리면 traffic-eligible capacity가 늦어지는 구간의 pressure는 더 커진다. 그래서 CPU 기반 HPA가 replica 수만 올려도 GPU node provision과 model warmup이 늦으면 TTFT는 먼저 악화된다.</p>
          <p>상태 전이는 <strong>Scheduled → image·weight load → process started → startup pass → model warm → readiness true → Service endpoint attach → canary approve</strong> 순서다. Startup failure는 긴 초기화를 재시작 판단에서 보호하고, liveness failure는 container restart를 유발하며, readiness failure는 Pod를 Service endpoint에서 제외한다. Canary quality gate는 Kubernetes probe가 아니라 별도 release controller의 책임이다.</p>
        </div>
        <Misconception><code>/health</code> 200은 release readiness의 충분조건이 아니다. Process 생존, model load, warmup inference, traffic attachment와 quality gate는 서로 다른 증거다.</Misconception>
      </section>

      <section id="rolling-capacity" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">RollingUpdate의 Pod 상한과 GPU Ready 상한은 다르다</h2>
        <M display>{String.raw`\begin{aligned}
\underbrace{R_{\mathrm{pod,max}}}_{\text{동시에 만들 수 있는 파드 상한}}&=\underbrace{R_{\mathrm{desired}}}_{\text{목표 복제본}}+\underbrace{S_{\mathrm{surge}}}_{\text{추가 생성 허용량}}\\
\underbrace{R_{\mathrm{gpu-ready}}}_{\text{GPU를 받아 준비될 수 있는 상한}}&\leq\underbrace{G_{\mathrm{free,policy}}/g_{\mathrm{pod}}}_{\text{정책을 통과한 여유 GPU 수용량}}
\end{aligned}`}</M>
        <FormulaNote
          meaning="Deployment가 surge Pod 생성을 허용해도 정책을 통과한 free GPU가 늘어나는 것은 아니다. 첫 줄은 controller가 만들 수 있는 Pod 수, 둘째 줄은 GPU allocation을 받고 warmup까지 갈 수 있는 더 좁은 상한을 분리한다. 실제 Ready 수는 image pull, current device health와 warmup 때문에 다시 작아질 수 있다."
          symbols={[[String.raw`R_{\mathrm{desired}}`, 'rollout이 원하는 replica'], [String.raw`S_{\mathrm{surge}}`, 'maxSurge로 추가 생성 가능한 Pod'], [String.raw`G_{\mathrm{free,policy}}`, '광고 수량에서 사용 중 device와 SKU·sharing·배치 정책을 제외한 여유'], [String.raw`g_{\mathrm{pod}}`, 'replica 하나가 요구하는 GPU 수']]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><code>maxUnavailable</code>은 rollout 동안 허용할 unavailable Pod 수를, <code>maxSurge</code>는 desired보다 더 만들 수 있는 Pod 수를 제한한다. GPU cluster에서는 old Ready capacity를 남겨 둔 채 새 replica가 받을 여유 device도 있어야 한다. 그렇지 않으면 새 Pod는 Pending이고 rollout progress만 멈춘다.</p>
        </div>
      </section>

      <section id="canary-rollback" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Canary는 promote·hold·rollback 세 결과를 가진다</h2>
        <IncidentFixtureStrip />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>Canary plan은 시작 전에 control release, traffic split, 최소 표본 <code>N_min</code>, 관찰 구간 <code>W</code>, hard safety gate와 guardband를 고정한다. 예를 들어 “1,000 requests와 15분을 모두 채우고, error +0.2%p 이하, TTFT +10% 이하, golden quality 회귀 0건” 같은 설명용 계약을 쓸 수 있다. 이 수치는 보편적 정답이 아니라 workload SLO에서 정해야 한다.</p>
          <p>표본이나 telemetry가 부족하면 promote도 rollback도 아닌 <strong>hold</strong>다. Hard quality·safety gate가 깨지거나 충분한 표본에서 latency·error guardband를 넘으면 rollback한다. 평균 하나로 판단하지 않고 streaming, tool call, context length와 tenant slice를 따로 본다.</p>
          <p>Rollback은 <strong>promotion freeze → 이전 Ready capacity 확인 → route weight를 절대값으로 복원 → canary drain → manifest·외부 state 복원 → release-labelled SLO 재검증</strong> 순서로 실행한다. <code>kubectl rollout undo</code>만으로 tokenizer object, gateway route와 외부 schema까지 자동 복원되는 것은 아니다.</p>
          <p>이 글의 출력은 GPU 그 자체가 아니라 <strong>필요한 device class와 replica 수가 명시된 rollback-ready release</strong>다. 다음 <InternalLink slug="k8s-gpu-fleet">GPU Fleet</InternalLink>가 그 claim을 실제 schedulable capacity로 바꾼다.</p>
        </div>
        <CapabilityCheck items={[
          'Manifest 항목을 열거하는 데서 멈추지 않고 model·tokenizer·adapter·quantization·runtime compatibility gate를 정의할 수 있다.',
          'Running, startup-complete, Ready, warm과 canary-approved 상태 및 각 실패 효과를 구분할 수 있다.',
          'Request rate와 startup time에서 cold-start arrival pressure를 계산할 수 있다.',
          'Canary의 promote·hold·rollback 조건과 rollback transaction의 완료 증거를 정할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Kubernetes probes', href: 'https://kubernetes.io/docs/concepts/workloads/pods/probes/', note: 'Startup, readiness, liveness와 endpoint removal의 현재 semantics.' },
          { label: 'Kubernetes Deployment', href: 'https://kubernetes.io/docs/concepts/workloads/controllers/deployment/', note: 'RollingUpdate, maxSurge, maxUnavailable와 progress 상태. Model quality gate는 별도다.' },
          { label: 'Kubernetes HPA', href: 'https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/', note: 'Custom metrics, initialization/readiness 처리와 stabilization window.' },
          { label: 'Argo Rollouts Analysis', href: 'https://argo-rollouts.readthedocs.io/en/stable/features/analysis/', note: 'AnalysisRun의 successful, failed, inconclusive 결과와 canary promotion control.' },
          { label: 'vLLM Hugging Face integration', href: 'https://docs.vllm.ai/en/stable/design/huggingface_integration/', note: 'Config, tokenizer와 model architecture를 runtime이 읽는 경계.' },
          { label: 'vLLM quantization support', href: 'https://docs.vllm.ai/en/stable/features/quantization/', note: 'Quantization method와 hardware 지원 matrix가 version-sensitive compatibility 조건임을 보여 준다.' },
          { label: 'Hugging Face Hub download', href: 'https://huggingface.co/docs/huggingface_hub/main/en/guides/download', note: 'Branch/tag 대신 commit hash로 revision을 고정할 수 있는 artifact 경계.' },
        ]} />
      </section>
    </>
  );
}
