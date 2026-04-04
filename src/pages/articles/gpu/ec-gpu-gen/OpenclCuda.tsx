import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const backendCode = `// OpenCL vs CUDA 백엔드 비교
//
// ── OpenCL 백엔드 (기본값) ──
// 장점:
//   - NVIDIA, AMD, Intel GPU 모두 지원
//   - 원래 bellman(Zcash)부터 사용된 성숙한 경로
//   - 드라이버만 있으면 동작 (별도 SDK 불필요)
// 단점:
//   - NVIDIA GPU에서 CUDA 대비 10-20% 느림
//   - JIT 컴파일 시간이 CUDA보다 김
//
// ── CUDA 백엔드 ──
// 장점:
//   - NVIDIA GPU에서 최적 성능 (PTX 직접 생성)
//   - nvcc 컴파일 최적화 (-O3, --use_fast_math)
//   - NVIDIA 전용 기능 활용 (warp shuffle, tensor core)
// 단점:
//   - NVIDIA GPU 전용
//   - CUDA Toolkit 설치 필요
//
// ── 환경 변수로 백엔드 선택 ──
// BELLMAN_CUDA=1 cargo build   → CUDA 백엔드
// (기본)                       → OpenCL 백엔드`;

const migrationCode = `// ec-gpu-gen → ICICLE 마이그레이션 경로
//
// ec-gpu-gen (2020~)          ICICLE (2023~)
// ─────────────────           ──────────────
// OpenCL + CUDA               CUDA 네이티브 (C++ 템플릿)
// build.rs 코드 생성           사전 컴파일된 라이브러리
// bellperson 전용              gnark, Polygon, Scroll 등 범용
// Filecoin 커브 중심           12+ 커브 지원
// Rust only                   Rust + Go + Python 바인딩
//
// 왜 ICICLE로 이동하는가?
//   1. C++ 템플릿 특수화 → 코드 생성보다 유지보수 용이
//   2. 사전 컴파일 → 빌드 타임 GPU 종속성 제거
//   3. 멀티 백엔드 (CUDA + CPU fallback)
//   4. 커뮤니티 규모: 더 많은 커브, 더 빠른 최적화
//
// 하지만 ec-gpu-gen은 bellperson/Neptune에서 여전히 사용 중이다.
// Filecoin 메인넷 증명 파이프라인이 아직 ec-gpu-gen 기반이다.`;

export default function OpenclCuda() {
  return (
    <section id="opencl-cuda" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OpenCL vs CUDA 백엔드</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ec-gpu-gen은 <strong>OpenCL</strong>과 <strong>CUDA</strong> 두 가지 백엔드를 지원한다.<br />
          원래 OpenCL만 지원했으나, NVIDIA GPU에서 더 높은 성능을 위해 CUDA 백엔드가 추가되었다.
        </p>
        <CodePanel title="OpenCL vs CUDA 백엔드 비교" code={backendCode} annotations={[
          { lines: [3, 11], color: 'sky', note: 'OpenCL: 범용 하드웨어 지원' },
          { lines: [13, 20], color: 'emerald', note: 'CUDA: NVIDIA 최적 성능' },
          { lines: [22, 24], color: 'amber', note: '환경 변수로 백엔드 선택' },
        ]} />

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
        <CodePanel title="ec-gpu-gen vs ICICLE 비교" code={migrationCode} annotations={[
          { lines: [3, 9], color: 'sky', note: '두 프레임워크 비교' },
          { lines: [11, 15], color: 'emerald', note: 'ICICLE 이점' },
          { lines: [17, 18], color: 'amber', note: 'ec-gpu-gen은 Filecoin에서 현역' },
        ]} />
      </div>
    </section>
  );
}
