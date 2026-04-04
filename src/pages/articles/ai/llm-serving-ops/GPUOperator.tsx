import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const DEVICE_PLUGIN_YAML = `# nvidia-device-plugin DaemonSet (GPU Operator 자동 배포)
# 각 노드의 GPU를 K8s 리소스로 등록
---
apiVersion: apps/v1
kind: DaemonSet
metadata:
  name: nvidia-device-plugin-daemonset
  namespace: nvidia-gpu-operator
spec:
  template:
    spec:
      tolerations:
        - key: nvidia.com/gpu
          operator: Exists
          effect: NoSchedule
      containers:
        - name: nvidia-device-plugin
          image: nvcr.io/nvidia/k8s-device-plugin:v0.15.0
          volumeMounts:
            - name: device-plugin
              mountPath: /var/lib/kubelet/device-plugins`;

export default function GPUOperator() {
  return (
    <>
      <h3 className="text-xl font-semibold mt-6 mb-3">NVIDIA GPU Operator</h3>
      <p>
        GPU Operator — 드라이버, 컨테이너 런타임, Device Plugin을 한 번에 배포하는 Operator<br />
        노드에 GPU가 추가되면 자동으로 드라이버 설치 → <code>nvidia.com/gpu</code> 리소스 등록
      </p>
      <CodePanel title="nvidia-device-plugin DaemonSet" code={DEVICE_PLUGIN_YAML}
        annotations={[
          { lines: [15, 18], color: 'amber', note: 'GPU 노드 전용 toleration — 일반 워크로드 격리' },
          { lines: [20, 21], color: 'emerald', note: 'Device Plugin이 GPU 검출 → kubelet에 리소스 등록' },
        ]}
      />
      <CitationBlock source="NVIDIA GPU Operator Docs" citeKey={3} type="paper"
        href="https://docs.nvidia.com/datacenter/cloud-native/gpu-operator/latest/overview.html">
        <p className="italic">
          "The GPU Operator uses the operator framework to automate the management of all
          NVIDIA software components needed to provision GPU."
        </p>
      </CitationBlock>
    </>
  );
}
