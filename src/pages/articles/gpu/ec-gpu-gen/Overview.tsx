import { CitationBlock } from '@/components/ui/citation';
import ProblemViz from './viz/ProblemViz';
import FlowViz from './viz/FlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ec-gpu-gen이란?</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>ec-gpu-gen</strong>은 Filecoin 프로젝트가 개발한 Rust 빌드 타임 코드 생성기다.<br />
          특정 타원곡선의 유한체/곡선 연산을 수행하는 <strong>CUDA 또는 OpenCL 커널 소스 코드</strong>를 자동으로 생성한다.
        </p>
        <p>
          bellperson(Groth16 프루버)과 Neptune(Poseidon 해시)이 이 도구로 GPU 커널을 얻는다.
        </p>
        <ProblemViz />

        <CitationBlock source="filecoin-project/ec-gpu-gen" citeKey={1} type="code"
          href="https://github.com/filecoin-project/ec-gpu-gen">
          <p className="italic text-xs">
            "CUDA/OpenCL code generator for elliptic curve and finite field operations,
            targeting curves used in zero-knowledge proof systems."
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">빌드 타임 코드 생성 흐름</h3>
        <p>
          Cargo의 <code>build.rs</code>에서 실행된다.
          <code>GpuField</code> 트레이트를 구현한 타입에서 소수, Montgomery 상수, 커브 파라미터를 추출한 뒤,
          템플릿에 주입하여 완성된 GPU 소스를 <code>OUT_DIR</code>에 기록한다.
        </p>
        <FlowViz />
      </div>
    </section>
  );
}
