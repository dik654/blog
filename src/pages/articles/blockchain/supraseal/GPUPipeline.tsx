import CodePanel from '@/components/ui/code-panel';
import GPULayerViz from './viz/GPULayerViz';
import { GPU_CODE, HW_CODE } from './GPUPipelineData';

export default function GPUPipeline() {
  return (
    <section id="gpu-pipeline" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GPU 파이프라인</h2>
      <div className="not-prose mb-8">
        <GPULayerViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>C2: GPU 가속 Groth16</h3>
        <p>
          C2는 <strong>Groth16 zkSNARK 증명</strong>을 생성하는 단계입니다.<br />
          GPU에서 MSM(Multi-Scalar Multiplication)과
          NTT(Number Theoretic Transform)를 병렬 처리하여
          증명 생성 시간을 대폭 단축합니다.
        </p>
        <CodePanel title="C2 GPU 가속" code={GPU_CODE}
          annotations={[
            { lines: [3, 5], color: 'sky', note: 'GPU MSM 병렬 처리' },
            { lines: [7, 9], color: 'emerald', note: 'GPU NTT 고속 FFT' },
            { lines: [11, 13], color: 'amber', note: 'bellperson 통합' },
          ]} />
        <h3>하드웨어 & 시스템 최적화</h3>
        <p>
          SupraSeal은 <strong>Threadripper PRO + RTX 4090</strong>
          참조 플랫폼에서 Huge Pages, F2FS, NUMA 인식,
          디스크 분리 전략 등 시스템 레벨 최적화를 적용합니다.
        </p>
        <CodePanel title="참조 플랫폼 & 시스템" code={HW_CODE}
          annotations={[
            { lines: [2, 6], color: 'sky', note: '참조 하드웨어 구성' },
            { lines: [9, 10], color: 'emerald', note: 'Huge Pages & F2FS' },
            { lines: [12, 15], color: 'amber', note: '디스크 분리 전략' },
          ]} />
      </div>
    </section>
  );
}
