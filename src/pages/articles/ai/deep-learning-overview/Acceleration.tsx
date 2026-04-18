import GPUParallelViz from './viz/GPUParallelViz';
import DLAccelViz from './viz/DLAccelViz';

export default function Acceleration() {
  return (
    <section id="acceleration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝 고속화</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        핵심 연산 = 행렬 곱셈 → GPU(코어 수천~수만)가 최적 하드웨어.<br />
        2012 AlexNet 이후 GPU 학습 시대 개막. 현재 H100 + 혼합 정밀도 + 분산 학습.
      </p>
      <GPUParallelViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">GPU, Mixed Precision, 분산 학습, Flash Attention</h3>
      </div>
      <div className="not-prose mt-4 mb-4">
        <DLAccelViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">GPU 하드웨어 트렌드</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">GPU</th>
                <th className="border border-border px-3 py-2 text-left">년도</th>
                <th className="border border-border px-3 py-2 text-left">Memory</th>
                <th className="border border-border px-3 py-2 text-left">TF32 TFLOPs</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">GTX 580</td>
                <td className="border border-border px-3 py-2">2010</td>
                <td className="border border-border px-3 py-2">1.5GB</td>
                <td className="border border-border px-3 py-2">~1 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">V100</td>
                <td className="border border-border px-3 py-2">2017</td>
                <td className="border border-border px-3 py-2">16-32GB</td>
                <td className="border border-border px-3 py-2">15 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">A100</td>
                <td className="border border-border px-3 py-2">2020</td>
                <td className="border border-border px-3 py-2">40/80GB</td>
                <td className="border border-border px-3 py-2">156 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">H100</td>
                <td className="border border-border px-3 py-2">2022</td>
                <td className="border border-border px-3 py-2">80GB</td>
                <td className="border border-border px-3 py-2">989 TFLOPs</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">B100/B200</td>
                <td className="border border-border px-3 py-2">2024</td>
                <td className="border border-border px-3 py-2">192GB</td>
                <td className="border border-border px-3 py-2">~5000 TFLOPs</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 하드웨어가 알고리즘을 주도</p>
          <p>
            <strong>"하드웨어 복권(hardware lottery)"</strong>:<br />
            - 현재 잘 되는 알고리즘 = 현재 HW에 맞는 알고리즘<br />
            - Transformer는 GPU에 최적화된 아키텍처<br />
            - RNN은 병렬화 어려워 밀려남
          </p>
          <p className="mt-2">
            <strong>Scaling Laws 주도 요인</strong>:<br />
            - Compute: GPU 성능 2년마다 2x<br />
            - Data: 인터넷 데이터 증가<br />
            - Parameters: 메모리 증가로 가능<br />
            - 3요소의 균형이 중요
          </p>
          <p className="mt-2">
            <strong>미래 전망</strong>:<br />
            - 전력 효율성 중요 (Data center power wall)<br />
            - 특화 ASIC 증가 (inference 전용)<br />
            - Quantum, Neuromorphic 연구<br />
            - On-device inference (mobile, edge)
          </p>
        </div>

      </div>
    </section>
  );
}
