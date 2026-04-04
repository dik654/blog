import CodePanel from '@/components/ui/code-panel';

const DEPLOYMENT_YAML = `apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama-70b
spec:
  replicas: 2
  template:
    spec:
      initContainers:
        - name: model-download
          image: amazon/aws-cli
          command: [sh, -c]
          args:
            - aws s3 sync s3://models/llama-70b /models/
          volumeMounts:
            - name: model-vol
              mountPath: /models
      containers:
        - name: vllm
          image: vllm/vllm-openai:latest
          args:
            - --model=/models/llama-70b
            - --tensor-parallel-size=4
            - --max-model-len=8192
            - --gpu-memory-utilization=0.9
          resources:
            limits:
              nvidia.com/gpu: "4"
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 120
            periodSeconds: 10
      volumes:
        - name: model-vol
          emptyDir:
            sizeLimit: 150Gi`;

export default function ModelLoading() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">모델 로딩 & vLLM Deployment</h3>
      <CodePanel title="vllm-deployment.yaml" code={DEPLOYMENT_YAML}
        annotations={[
          { lines: [10, 18], color: 'sky', note: 'Init Container — S3에서 모델 다운로드 후 emptyDir에 캐시' },
          { lines: [23, 26], color: 'emerald', note: 'tensor-parallel-size=4 — 4 GPU에 모델 분산' },
          { lines: [28, 29], color: 'amber', note: 'nvidia.com/gpu: 4 — Pod당 GPU 4장 요청' },
          { lines: [30, 35], color: 'violet', note: 'readinessProbe — 모델 로딩 완료 확인 후 트래픽 수신' },
        ]}
      />
    </>
  );
}
