import NsightViz from './viz/NsightViz';
import BottleneckViz from './viz/BottleneckViz';
import WorkflowViz from './viz/WorkflowViz';

export default function Profiling() {
  return (
    <section id="profiling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Nsight 프로파일링 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>성능 최적화는 측정에서 시작한다. NVIDIA는 <strong>Nsight Systems</strong>(시스템 타임라인)와 <strong>Nsight Compute</strong>(커널 상세 메트릭) 두 가지 프로파일러를 제공한다.</p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Nsight Systems & Compute</h3>
        <p>Nsight Systems로 전체 CPU-GPU 상호작용을 타임라인에서 파악한 뒤, 병목 커널을 Nsight Compute로 상세 분석한다. SOL 섹션의 연산/메모리 활용률로 bound 유형을 즉시 판별할 수 있다.</p>
        <div className="not-prose mb-4"><NsightViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">병목 유형 & 해결</h3>
        <div className="not-prose mb-4"><BottleneckViz /></div>

        <h3 className="text-xl font-semibold mt-8 mb-3">프로파일링 워크플로우</h3>
        <p>최적화는 측정-분석-변경-재측정의 순환으로 진행한다. 한 번에 하나의 변경만 적용해야 어떤 최적화가 효과적이었는지 구분할 수 있다.</p>
        <div className="not-prose mb-4"><WorkflowViz /></div>
      </div>
    </section>
  );
}
