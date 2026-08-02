const servingScope = [
  ['model artifact', 'weight format, quantization, tokenizer, revision pinning, license', '무엇을 배포하는지 명확하지 않으면 rollback과 재현이 불가능하다.'],
  ['runtime engine', 'vLLM, TGI, TensorRT-LLM, llama.cpp 계열 중 선택', 'batching, KV cache, parallelism, model support가 달라진다.'],
  ['topology', 'single GPU, tensor parallel, pipeline parallel, multi-node, MIG', 'latency와 capacity뿐 아니라 장애 blast radius를 정한다.'],
  ['model loading', 'remote download, PVC, local NVMe cache, image-baked model', 'cold start와 scale-out 속도의 대부분을 차지한다.'],
  ['traffic control', 'gateway route, canary weight, shadow traffic, admission control', '새 replica가 떠도 traffic이 붙지 않으면 capacity가 늘지 않는다.'],
  ['readiness/liveness', 'engine init, warmup inference, health endpoint, model metadata check', '프로세스 생존과 요청 처리 가능 상태를 구분한다.'],
  ['rollout/rollback', 'rolling, blue-green, canary, recreate, route switch', '모델 변경은 코드 변경보다 품질 리스크가 커서 rollback 경로가 필요하다.'],
  ['runtime tuning', 'max model length, max batched tokens, gpu memory utilization, concurrency', '같은 GPU 수에서도 설정에 따라 TTFT와 TPS가 크게 달라진다.'],
];

const deploymentStages = [
  ['image pull', 'vLLM/TGI 이미지와 CUDA dependency를 받음', '큰 이미지면 node scale-out 후 첫 요청까지 시간이 길어짐'],
  ['weight fetch', 'S3, PVC, local NVMe, model registry에서 weight 준비', '가장 큰 cold start 원인. 캐시 전략이 배포 전략을 좌우함'],
  ['engine init', 'tokenizer, tensor parallel, KV cache block, CUDA graph 준비', 'readiness가 너무 빠르면 로딩 중 요청을 받아 timeout 발생'],
  ['traffic attach', 'Service endpoint, gateway route, canary weight 반영', 'route 반영이 늦으면 새 replica가 떠도 부하가 그대로임'],
];

const rolloutPatterns = [
  ['recreate', '모델 하나만 쓰는 실험 환경', '간단하지만 downtime이 생김'],
  ['rolling', '같은 모델/같은 shape로 patch 배포', 'GPU 여유가 없으면 old/new가 동시에 못 떠 rollout이 막힘'],
  ['blue-green', '큰 모델 버전 교체, quantization 변경', '비싸지만 rollback이 빠르고 quality 비교가 쉬움'],
  ['canary', '프롬프트/모델 버전 A/B, 새 provider 검증', '게이트웨이 route weight와 eval/metric 분리가 필요'],
];

export default function DeploymentDeepDive() {
  return (
    <>
      <h3 id="serving-deployment-scope" className="text-xl font-semibold mt-8 mb-3">LLM 서빙 배포의 전체 범위</h3>
      <p>
        LLM serving deployment는 Deployment YAML 하나가 아니다. 모델 artifact, runtime engine, GPU topology,
        traffic control, readiness, rollout, runtime tuning을 모두 포함해야 운영 가능한 배포가 된다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {servingScope.map(([area, detail, why]) => (
          <div key={area} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{area}</p>
            <p className="text-sm font-semibold">{detail}</p>
            <p className="text-sm text-muted-foreground mt-2">{why}</p>
          </div>
        ))}
      </div>

      <h3 id="deployment-lifecycle" className="text-xl font-semibold mt-8 mb-3">배포 생명주기</h3>
      <p>
        LLM 배포는 일반 API 서버보다 cold start가 길다. 이미지보다 모델 weight와 engine 초기화가 더 큰 병목이며,
        readiness는 “프로세스가 떴다”가 아니라 “첫 요청을 정상 처리할 수 있다”를 의미해야 한다.
      </p>
      <div className="grid gap-3 md:grid-cols-2 mt-4">
        {deploymentStages.map(([stage, work, risk]) => (
          <div key={stage} className="rounded-lg border bg-background p-4">
            <p className="font-mono text-xs text-muted-foreground mb-1">{stage}</p>
            <p className="text-sm font-semibold">{work}</p>
            <p className="text-sm text-muted-foreground mt-2">{risk}</p>
          </div>
        ))}
      </div>

      <h3 id="rollout-strategy" className="text-xl font-semibold mt-8 mb-3">롤아웃 전략 선택</h3>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">패턴</th>
              <th className="p-3">맞는 상황</th>
              <th className="p-3">주의점</th>
            </tr>
          </thead>
          <tbody>
            {rolloutPatterns.map(([pattern, fit, risk]) => (
              <tr key={pattern} className="border-t">
                <td className="p-3 font-mono text-xs">{pattern}</td>
                <td className="p-3">{fit}</td>
                <td className="p-3 text-muted-foreground">{risk}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 id="deployment-readiness" className="text-xl font-semibold mt-8 mb-3">readiness를 어떻게 잡을까</h3>
      <p className="text-sm text-muted-foreground">
        단순 <code>/health</code>는 프로세스 생존만 확인할 수 있다. 프로덕션에서는 tokenizer load,
        model weight load, GPU memory reservation, warmup inference, gateway registration을 별도 단계로 기록한다.
        이렇게 해야 “Pod는 Ready인데 첫 요청이 timeout”인 상태를 배포 단계에서 잡을 수 있다.
      </p>

      <h3 id="runtime-tuning" className="text-xl font-semibold mt-8 mb-3">runtime tuning 판단</h3>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">max model length</p>
          <p className="text-sm text-muted-foreground">
            context window를 크게 잡으면 긴 요청은 가능하지만 KV cache가 빠르게 차고 throughput이 낮아진다.
            route별로 short-context와 long-context 모델을 분리하는 편이 안정적이다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">max batched tokens</p>
          <p className="text-sm text-muted-foreground">
            batch를 키우면 TPS는 좋아질 수 있지만 TTFT가 흔들린다. interactive traffic과 batch job은 같은 deployment에 섞지 않는다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">gpu memory utilization</p>
          <p className="text-sm text-muted-foreground">
            너무 높이면 순간 긴 context 요청에서 OOM이 나고, 너무 낮으면 비싼 GPU를 놀린다.
            KV cache 사용률과 OOM event를 같이 보며 조정한다.
          </p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="font-semibold mb-1">parallelism</p>
          <p className="text-sm text-muted-foreground">
            tensor parallel은 큰 모델을 여러 GPU에 나누지만 interconnect 비용을 만든다.
            NVLink, PCIe, multi-node network를 분리해서 benchmark해야 한다.
          </p>
        </div>
      </div>

      <h3 id="serving-release-checklist" className="text-xl font-semibold mt-8 mb-3">release 체크리스트</h3>
      <ul className="space-y-2 text-sm text-muted-foreground">
        <li><strong className="text-foreground">artifact 고정:</strong> model revision, tokenizer, quantization config, runtime image digest를 같이 기록한다.</li>
        <li><strong className="text-foreground">warmup 검증:</strong> 대표 short/long prompt를 readiness 전 warmup으로 실행한다.</li>
        <li><strong className="text-foreground">canary 기준:</strong> latency, error, cost, quality eval 중 어떤 지표가 실패하면 rollback할지 미리 정한다.</li>
        <li><strong className="text-foreground">capacity 확인:</strong> canary가 성공해도 full rollout 때 GPU quota와 node pool limit이 충분한지 확인한다.</li>
      </ul>
    </>
  );
}
