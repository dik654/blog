import { CitationBlock } from '@/components/ui/citation';
import BackendViz from './viz/BackendViz';
import MigrationViz from './viz/MigrationViz';

export default function OpenclCuda() {
  return (
    <section id="opencl-cuda" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OpenCL vs CUDA 백엔드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ec-gpu-gen은 <strong>OpenCL</strong>과 <strong>CUDA</strong> 두 가지 백엔드를 지원한다.<br />
          원래 OpenCL만 지원했으나, NVIDIA GPU에서 더 높은 성능을 위해 CUDA 백엔드가 추가되었다.
        </p>
        <BackendViz />

        <CitationBlock source="rust-gpu-tools -- GPU runtime abstraction" citeKey={4} type="code"
          href="https://github.com/filecoin-project/rust-gpu-tools">
          <p className="text-xs">
            rust-gpu-tools는 OpenCL과 CUDA를 동일한 Rust API로 추상화한다.
            <code>Device::all()</code>이 사용 가능한 GPU를 탐색하고,
            feature flag에 따라 OpenCL 또는 CUDA 런타임을 선택한다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-8 mb-3">ICICLE로의 마이그레이션</h3>
        <p>
          최근 ZK 프로젝트들은 ec-gpu-gen 대신 <strong>ICICLE</strong>을 선호한다.<br />
          ICICLE은 코드 생성 대신 C++ 템플릿 특수화를 사용하고, 사전 컴파일된 라이브러리를 제공한다.<br />
          다만 Filecoin 메인넷은 여전히 ec-gpu-gen 기반이다.
        </p>
        <MigrationViz />
      </div>
    </section>
  );
}
