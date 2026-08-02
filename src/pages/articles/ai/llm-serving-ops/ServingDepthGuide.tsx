type GuideSection = {
  title: string;
  body: string;
  bullets: string[];
};

type Guide = {
  id: string;
  title: string;
  intro: string;
  sections: GuideSection[];
  checks: string[];
};

const guides: Record<string, Guide> = {
  litellm: {
    id: 'litellm-field-guide',
    title: 'LiteLLM 전체 범위 설계서',
    intro: 'LiteLLM 글은 provider wrapper가 아니라 LLM control plane을 설명해야 한다. 핵심은 앱 코드에서 모델 선택, 비용 정책, 장애 대응, 감사 책임을 분리해 중앙 정책으로 운영하는 것이다.',
    sections: [
      {
        title: '요청 생명주기',
        body: '클라이언트 요청은 OpenAI-compatible endpoint, virtual key 인증, team/project 정책, model alias 해석, model group 후보 생성, router 전략 선택, provider 호출, callback/logging, 비용 집계 순서로 흐른다.',
        bullets: ['논리 모델명과 실제 provider model을 분리한다.', 'route 결정은 latency, cost, health, capability, budget을 함께 본다.', '응답 이후에도 token/cost/logging callback이 운영 데이터의 일부다.'],
      },
      {
        title: '정책 레이어',
        body: '프로덕션 LiteLLM은 provider key 은닉, team budget, user quota, model allowlist, prompt logging 정책을 gateway에 둔다. 이 레이어가 없으면 앱마다 key와 budget 로직이 중복된다.',
        bullets: ['virtual key는 사용자 인증이 아니라 LLM 사용권이다.', 'budget은 장애 예방 장치다. 비용 폭주는 성능 장애와 같은 수준으로 다룬다.', 'PII와 prompt retention은 logging을 켜기 전에 정해야 한다.'],
      },
      {
        title: '신뢰성 제어',
        body: 'retry, fallback, cooldown은 같은 개념이 아니다. retry는 같은 deployment의 일시 실패를 다시 시도하고, fallback은 기능이 호환되는 다른 deployment로 우회하며, cooldown은 실패한 후보를 일정 시간 제외한다.',
        bullets: ['fallback 후보는 context window와 structured output 지원이 같아야 한다.', 'cooldown이 너무 짧으면 flapping, 너무 길면 capacity 손실이 된다.', 'provider 429와 품질 실패는 같은 fallback 정책으로 처리하면 안 된다.'],
      },
      {
        title: '운영 데이터',
        body: 'LiteLLM의 가치가 드러나는 지점은 route별 성공률, fallback 비율, token cost, latency, team budget, provider 오류율을 같은 축으로 비교할 수 있을 때다.',
        bullets: ['route 변경 전후 cost delta와 quality eval을 같이 본다.', 'agent workflow는 step별 model/provider 전환을 trace에 남긴다.', 'batch/eval traffic은 interactive traffic과 rate limit을 분리한다.'],
      },
    ],
    checks: ['model group별 fallback 호환성 검토', 'team/user budget과 rate limit 설정', 'provider별 error/latency/cost dashboard', 'PII logging과 retention 정책'],
  },
  gpuFleet: {
    id: 'gpu-fleet-field-guide',
    title: 'Kubernetes GPU Fleet 전체 운영 설계서',
    intro: 'GPU Fleet 글은 GPU 노드를 띄우는 방법이 아니라 추론 서비스를 지속적으로 수용하는 capacity control plane을 설명해야 한다.',
    sections: [
      {
        title: '하드웨어와 노드 생명주기',
        body: 'GPU SKU, VRAM, NVLink/PCIe, CPU/RAM 비율, 로컬 NVMe, 네트워크 대역폭은 모델 크기와 KV cache 정책을 결정한다. 노드가 준비되려면 driver, container runtime, device plugin, DCGM exporter가 모두 정상이어야 한다.',
        bullets: ['A10/L4 계열은 비용 효율, A100/H100 계열은 긴 context와 대형 batch에 강하다.', 'MIG는 격리와 조각화를 동시에 만든다.', '드라이버 버전과 CUDA/runtime 호환성은 배포 실패의 흔한 원인이다.'],
      },
      {
        title: '스케줄링 정책',
        body: 'GPU 워크로드는 CPU처럼 overcommit하지 않는다. requests/limits, node selector, affinity, taints/tolerations, topology spread, priority class로 어떤 모델이 어떤 GPU를 점유하는지 결정한다.',
        bullets: ['모델별 GPU SKU allowlist를 둔다.', '장기 실행 serving과 batch/eval job은 priority와 quota를 분리한다.', 'MIG slice와 full GPU workload를 같은 pool에 섞으면 bin-packing이 깨질 수 있다.'],
      },
      {
        title: 'Autoscaling과 warm capacity',
        body: 'GPU autoscaling은 pod 수만 늘리는 문제가 아니다. 노드 provision, image pull, model download, weight load, warmup, readiness까지 포함한 scale latency가 사용자 지연으로 이어진다.',
        bullets: ['Karpenter/Cluster Autoscaler는 노드 공급, HPA/KEDA는 pod 수요를 본다.', '큰 모델은 cold start가 길어 warm pool이 필요하다.', 'scale-down은 KV cache와 in-flight request drain을 고려해야 한다.'],
      },
      {
        title: '장애 분석 순서',
        body: 'GPU incident는 Kubernetes, driver, device plugin, model server, gateway 중 어디에서 시작됐는지 분리해야 한다. 증상만 보면 모두 latency 상승처럼 보인다.',
        bullets: ['node condition과 device plugin allocatable을 먼저 본다.', 'DCGM의 memory, temperature, ECC, SM utilization을 확인한다.', '서빙 엔진의 queue/KV cache pressure와 gateway 429를 함께 본다.'],
      },
    ],
    checks: ['SKU별 model compatibility matrix', 'GPU Operator/driver health dashboard', 'warm pool과 scale latency SLO', 'quota/chargeback label 표준'],
  },
  deployment: {
    id: 'deployment-field-guide',
    title: 'LLM 서빙 배포 전체 설계서',
    intro: '서빙 배포 글은 Deployment YAML 소개가 아니라 모델 artifact, runtime engine, traffic control, readiness, rollback까지 이어지는 release engineering 문서여야 한다.',
    sections: [
      {
        title: 'Artifact 계약',
        body: '모델 weight, tokenizer, chat template, quantization format, LoRA adapter, engine args, container image가 하나의 release 단위다. 이 중 하나만 바뀌어도 품질과 latency가 달라진다.',
        bullets: ['모델 버전과 runtime 버전을 따로 기록한다.', 'weight download와 image pull을 배포 시간에서 분리한다.', 'chat template 변경은 API 호환성 변경으로 취급한다.'],
      },
      {
        title: 'Readiness와 traffic gate',
        body: 'LLM 서버는 process가 떠도 준비된 것이 아니다. weight load, tokenizer init, KV cache allocation, warmup prompt, health probe, sample generation이 통과돼야 traffic을 받아야 한다.',
        bullets: ['liveness는 프로세스 생존, readiness는 serving 가능 상태를 본다.', '첫 토큰 지연이 안정화되기 전 canary traffic을 크게 열지 않는다.', 'readiness 실패와 provider route 우회를 연결한다.'],
      },
      {
        title: '롤아웃 전략',
        body: 'blue/green은 빠른 rollback에 강하고, canary는 품질/latency 비교에 강하며, shadow는 사용자 영향 없이 새 모델을 검증한다. LLM은 품질 회귀가 늦게 보이므로 eval gate가 필요하다.',
        bullets: ['canary는 latency뿐 아니라 JSON validity, tool call success, refusal drift를 본다.', 'shadow는 cost를 쓰므로 sampling과 budget이 필요하다.', 'rollback 기준을 배포 전에 문서화한다.'],
      },
      {
        title: '스케일링 지표',
        body: 'GPU utilization만으로 scale하면 늦다. queue length, TTFT, decode tokens/sec, KV cache usage, batch occupancy, request timeout을 함께 봐야 한다.',
        bullets: ['prefill-heavy와 decode-heavy traffic은 병목이 다르다.', 'HPA는 GPU memory saturation을 직접 해결하지 못할 수 있다.', 'gateway fallback이 engine scale 문제를 숨길 수 있다.'],
      },
    ],
    checks: ['artifact manifest와 rollback target', 'warmup/readiness gate', 'canary와 eval metric', 'drain/scale-down policy'],
  },
  observability: {
    id: 'observability-field-guide',
    title: 'LLM 관측성 & AIOps 전체 설계서',
    intro: '관측성 글은 TTFT/TPS 설명에서 멈추면 안 된다. gateway, engine, GPU, Kubernetes, provider, cost, quality가 하나의 incident graph로 연결되어야 한다.',
    sections: [
      {
        title: 'Telemetry contract',
        body: '모든 요청은 request id, tenant/team, route/model group, provider/deployment, prompt token, output token, TTFT, E2E latency, fallback 여부, cost, error class를 남겨야 한다.',
        bullets: ['gateway와 engine trace id를 연결한다.', 'provider 429, engine timeout, readiness fail을 다른 error class로 둔다.', 'prompt logging은 sampling과 redaction을 기본값으로 둔다.'],
      },
      {
        title: 'Dashboard 계층',
        body: '첫 화면은 SLO와 error budget, 두 번째는 route/provider 상태, 세 번째는 engine queue/KV cache/GPU, 네 번째는 Kubernetes node/pod 상태로 내려가야 한다.',
        bullets: ['증상에서 원인으로 drill-down되는 구조가 필요하다.', '비용 dashboard는 운영 dashboard와 분리하지 않는다.', '품질 eval과 production telemetry를 같은 release id로 묶는다.'],
      },
      {
        title: 'Runbook과 alert',
        body: '알럿은 “느림”이 아니라 “TTFT p95 증가 + queue 증가 + GPU util 낮음”처럼 조치 가능한 가설을 포함해야 한다. runbook은 담당자와 rollback/scale/fallback 조건을 명시한다.',
        bullets: ['page alert는 사용자 영향과 자동 조치 실패를 기준으로 한다.', 'warning alert는 capacity trend와 budget burn을 본다.', 'runbook은 마지막에 검증 쿼리를 포함한다.'],
      },
      {
        title: 'AIOps 자동화 단계',
        body: '자동화는 탐지, 분류, 추천, 실행, 검증, rollback 순서로 성숙도를 올린다. 처음부터 route 변경이나 scale-out을 자동 실행하면 잘못된 완화가 비용과 품질 문제를 키울 수 있다.',
        bullets: ['자동 조치는 blast radius와 time limit을 가져야 한다.', 'LLM 요약은 incident context 생성에는 유용하지만 단독 판단자는 아니다.', '모든 자동 조치는 audit log와 postmortem 입력으로 남긴다.'],
      },
    ],
    checks: ['request-level trace contract', 'SLO/error budget dashboard', 'symptom-based runbook', 'automation guardrail and rollback'],
  },
  vllmServing: {
    id: 'vllm-serving-field-guide',
    title: 'vLLM 서빙 엔진 전체 범위 설계서',
    intro: 'vLLM 글은 PagedAttention 하나가 아니라 API server, EngineCore, scheduler, KV cache, worker, sampler, parallelism, metrics를 하나의 engine lifecycle로 설명해야 한다.',
    sections: [
      {
        title: '엔진 경계',
        body: '요청은 OpenAI API entrypoint에서 validation/tokenization을 거쳐 EngineCore로 들어가고, scheduler가 prefill/decode work를 묶어 worker에 전달하며, sampler가 다음 토큰을 생성한다.',
        bullets: ['API layer와 engine layer의 책임을 분리한다.', 'scheduler loop는 latency와 throughput tradeoff의 중심이다.', 'sampler/stop 조건은 품질과 API semantics에 직접 연결된다.'],
      },
      {
        title: '메모리와 batch',
        body: 'vLLM의 핵심 운영 변수는 KV cache block 수, block size, max model length, max batched tokens, GPU memory utilization이다. 이 값들이 batch 크기와 OOM 위험을 결정한다.',
        bullets: ['PagedAttention은 낭비를 줄이지만 무한 capacity를 만들지는 않는다.', '긴 prompt는 prefill 병목, 긴 generation은 decode 병목을 만든다.', 'prefix caching은 workload가 반복 prefix를 가질 때만 크게 이긴다.'],
      },
      {
        title: '운영 튜닝',
        body: '성능 튜닝은 tokens/sec 하나로 끝나지 않는다. TTFT, inter-token latency, throughput, GPU utilization, queue wait, timeout, error rate를 workload별로 나눠 본다.',
        bullets: ['interactive chat과 batch summarization은 다른 목표를 가진다.', 'parallelism은 latency, memory, network overhead를 같이 바꾼다.', '모델별 engine args를 release artifact에 포함한다.'],
      },
    ],
    checks: ['engine args manifest', 'TTFT/TPS/queue dashboard', 'KV cache pressure alert', 'workload별 tuning profile'],
  },
  scheduler: {
    id: 'scheduler-field-guide',
    title: 'vLLM Scheduler 전체 범위 설계서',
    intro: 'Scheduler 글은 `schedule()` 코드 읽기에서 끝나지 않고, queue state, fairness, budget, preemption, KV cache 상호작용을 설명해야 한다.',
    sections: [
      {
        title: '상태 모델',
        body: 'scheduler는 waiting, running, preempted 요청과 token budget, encoder budget, KV cache availability를 동시에 본다. 어떤 요청을 prefill하고 어떤 요청을 decode할지 매 step 결정한다.',
        bullets: ['prefill은 큰 compute burst를 만들고 decode는 반복적인 작은 step을 만든다.', 'chunked prefill은 긴 prompt가 짧은 요청을 막지 않게 한다.', 'running queue가 커지면 inter-token latency가 나빠질 수 있다.'],
      },
      {
        title: 'Preemption과 fairness',
        body: 'KV cache가 부족하거나 budget이 맞지 않으면 요청을 preempt한다. 이때 recompute와 swap은 메모리, latency, throughput을 서로 다르게 희생한다.',
        bullets: ['긴 요청 하나가 전체 batch를 막지 않게 한다.', 'preemption rate는 capacity 부족의 조기 신호다.', 'fairness 정책은 premium tenant와 batch traffic을 구분해야 한다.'],
      },
      {
        title: '튜닝 관측',
        body: 'scheduler 튜닝은 queue wait, scheduled tokens, prefill/decode ratio, preemption count, KV allocation fail, batch occupancy를 같이 봐야 한다.',
        bullets: ['TTFT 상승이 scheduler 때문인지 model load 때문인지 분리한다.', 'max batched tokens는 throughput과 tail latency를 함께 바꾼다.', 'prefix caching hit rate가 낮으면 scheduler 이득도 제한된다.'],
      },
    ],
    checks: ['queue state metrics', 'preemption threshold', 'tenant priority policy', 'chunked prefill profile'],
  },
  pagedAttention: {
    id: 'paged-attention-field-guide',
    title: 'PagedAttention/KV Cache 전체 범위 설계서',
    intro: 'PagedAttention 글은 block pool 코드 분석뿐 아니라 KV cache가 왜 병목이고, block lifecycle이 capacity와 latency를 어떻게 바꾸는지 설명해야 한다.',
    sections: [
      {
        title: 'KV cache lifecycle',
        body: '요청마다 prompt와 generated token의 key/value tensor가 쌓인다. logical block은 요청의 token 위치를 표현하고 physical block은 GPU 메모리의 실제 저장 단위다.',
        bullets: ['block allocation은 prefill 중 급격히 늘어난다.', 'decode 단계는 token마다 작은 append를 반복한다.', 'free와 reuse가 늦으면 fragmentation과 block exhaustion이 생긴다.'],
      },
      {
        title: 'Prefix caching',
        body: '반복 prefix가 많은 workload에서는 같은 prompt prefix의 KV block을 공유해 prefill 비용을 줄인다. 하지만 cache key, tokenizer, template, LoRA, multimodal feature가 달라지면 재사용하면 안 된다.',
        bullets: ['hit rate는 prompt 구조와 traffic locality에 의존한다.', '잘못된 cache reuse는 품질 오류가 아니라 correctness bug다.', 'eviction 정책은 긴 context workload와 충돌할 수 있다.'],
      },
      {
        title: 'Capacity planning',
        body: '최대 동시 요청 수는 모델 weight를 제외한 남은 VRAM, KV dtype, layer/head 차원, max context, block size, batch shape로 결정된다.',
        bullets: ['max model length를 크게 잡으면 idle capacity도 줄어든다.', 'OOM보다 먼저 TTFT와 preemption이 나빠질 수 있다.', 'long-context SKU와 short-chat SKU를 분리하는 편이 안정적이다.'],
      },
    ],
    checks: ['block usage dashboard', 'prefix hit/miss metric', 'long-context admission rule', 'KV cache pressure alert'],
  },
  specDecode: {
    id: 'spec-decode-field-guide',
    title: 'Speculative Decoding 전체 범위 설계서',
    intro: 'Speculative decoding 글은 draft-verify 그림뿐 아니라 acceptance rate, draft cost, scheduler overhead, rollout 위험까지 설명해야 한다.',
    sections: [
      {
        title: '속도 향상 조건',
        body: 'draft model이 여러 token 후보를 빠르게 만들고 target model이 검증한다. 이득은 acceptance rate가 높고 draft 비용이 낮으며 verifier batch가 효율적일 때 생긴다.',
        bullets: ['acceptance rate가 낮으면 draft compute가 낭비된다.', '작은 모델이 항상 좋은 draft는 아니다.', 'temperature와 sampling 설정이 acceptance를 바꾼다.'],
      },
      {
        title: '운영 리스크',
        body: 'spec decode는 target model의 분포를 보존해야 하므로 correctness invariant가 중요하다. 또한 추가 memory와 scheduler 복잡도를 만들고, 일부 VLM/structured output 경로에서는 fallback이 필요하다.',
        bullets: ['품질 회귀는 latency 개선보다 늦게 발견될 수 있다.', '모델/adapter 조합별로 지원 여부를 관리한다.', 'acceptance와 latency를 release metric으로 기록한다.'],
      },
      {
        title: '롤아웃 기준',
        body: '먼저 shadow나 canary에서 acceptance rate, TTFT, output TPS, GPU util, error rate, JSON validity를 비교한다. 특정 route에서만 켜고 fallback 조건을 명시한다.',
        bullets: ['chat, code, extraction workload를 분리해 측정한다.', '긴 context와 짧은 response에서는 이득이 제한적일 수 있다.', 'draft model version도 release artifact다.'],
      },
    ],
    checks: ['acceptance-rate dashboard', 'draft/target compatibility matrix', 'canary quality gate', 'route-level enable flag'],
  },
  vlm: {
    id: 'vlm-serving-field-guide',
    title: 'VLM Serving 전체 범위 설계서',
    intro: 'VLM serving 글은 이미지 입력을 텍스트 요청에 추가한 정도가 아니라, render, feature extraction, token alignment, scheduler budget, multimodal cache를 다뤄야 한다.',
    sections: [
      {
        title: '입력 정규화',
        body: 'OpenAI-style message의 image_url, binary payload, tool/template option은 모델별 processor를 거쳐 text token과 multimodal feature로 분리된다.',
        bullets: ['chat template은 image token 위치를 결정한다.', 'processor mismatch는 runtime error보다 조용한 품질 오류로 나타날 수 있다.', 'OCR/VL 모델은 이미지 토큰 인덱스와 special token 정책을 확인해야 한다.'],
      },
      {
        title: 'Scheduler budget',
        body: 'VLM은 텍스트 token budget 외에 encoder compute와 multimodal cache budget을 가진다. 이미지가 많은 요청은 prefill 이전에 encoder 병목을 만든다.',
        bullets: ['partial multimodal scheduling은 feature/token alignment를 깨뜨릴 수 있다.', 'encoder cache hit는 반복 이미지나 multi-turn context에서 중요하다.', 'image resolution policy가 latency와 memory를 직접 바꾼다.'],
      },
      {
        title: '운영 실패 모드',
        body: '대표 실패는 image token mismatch, encoder OOM, cache desync, unsupported speculative path, slow image fetch, template drift다. 텍스트-only runbook으로는 원인을 찾기 어렵다.',
        bullets: ['이미지 fetch/preprocess latency를 별도 계측한다.', 'multimodal cache reset은 debug 경계로 제한한다.', 'draft model이 VLM을 지원하지 않으면 spec decode fallback을 명확히 둔다.'],
      },
    ],
    checks: ['processor/template compatibility matrix', 'image preprocess latency metric', 'MM budget dashboard', 'VLM-specific rollback criteria'],
  },
};

export type ServingDepthGuideKey = keyof typeof guides;

export default function ServingDepthGuide({ guideKey }: { guideKey: ServingDepthGuideKey }) {
  const guide = guides[guideKey];

  return (
    <section id={guide.id} className="mt-12 scroll-mt-20">
      <h3 className="text-xl font-semibold mt-8 mb-3">{guide.title}</h3>
      <p>{guide.intro}</p>
      <div className="grid gap-4 mt-4">
        {guide.sections.map((section) => (
          <div key={section.title} className="rounded-lg border bg-background p-4">
            <h4 className="font-semibold mb-2">{section.title}</h4>
            <p className="text-sm text-muted-foreground">{section.body}</p>
            <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
              {section.bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-4 mt-4">
        <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">프로덕션 확인 항목</h4>
        <ul className="space-y-1 text-sm text-muted-foreground">
          {guide.checks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
