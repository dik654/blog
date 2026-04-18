export default function ModelLoading() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">모델 로딩 & vLLM Deployment</h3>
      <p className="text-sm text-muted-foreground mb-4">
        K8s Deployment로 vLLM Pod를 배포 — initContainer가 모델을 다운로드하고,
        readinessProbe가 로딩 완료를 확인한 뒤 트래픽 수신 시작
      </p>
      <div className="grid gap-4 sm:grid-cols-2 mt-4">
        <div className="rounded-lg border-l-4 border-sky-500 bg-sky-500/5 p-4">
          <p className="font-semibold text-sky-600 dark:text-sky-400 mb-1">initContainer: 모델 다운로드</p>
          <p className="text-sm text-muted-foreground">
            <code>amazon/aws-cli</code> 이미지로 S3에서 모델 가중치 다운로드.<br />
            <code>aws s3 sync s3://models/llama-70b /models/</code><br />
            emptyDir(150Gi)에 캐시 — Pod 재시작 시 재다운로드 방지.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-emerald-500 bg-emerald-500/5 p-4">
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Volume Mount & 텐서 병렬</p>
          <p className="text-sm text-muted-foreground">
            initContainer와 vLLM 컨테이너가 <code>model-vol</code> 공유.<br />
            <code>--tensor-parallel-size=4</code> — 70B 모델을 4 GPU에 분산.<br />
            <code>--gpu-memory-utilization=0.9</code> — GPU 메모리 90% 활용.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-amber-500 bg-amber-500/5 p-4">
          <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">GPU 리소스 요청</p>
          <p className="text-sm text-muted-foreground">
            <code>nvidia.com/gpu: "4"</code> — Pod당 GPU 4장 요청.<br />
            K8s 스케줄러가 GPU 4장 이상 가용한 노드에만 배치.<br />
            Device Plugin이 등록한 리소스를 기반으로 할당.
          </p>
        </div>
        <div className="rounded-lg border-l-4 border-violet-500 bg-violet-500/5 p-4">
          <p className="font-semibold text-violet-600 dark:text-violet-400 mb-1">Readiness Probe</p>
          <p className="text-sm text-muted-foreground">
            <code>/health</code> 엔드포인트로 모델 로딩 완료 확인.<br />
            <code>initialDelaySeconds: 120</code> — 70B 모델은 2분+ 로딩 소요.<br />
            로딩 완료 전까지 Service가 트래픽을 보내지 않음.
          </p>
        </div>
      </div>
    </>
  );
}
