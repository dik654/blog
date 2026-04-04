import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const rustCode = `// Rust MSM 예시 (icicle-bn254 crate)
use icicle_bn254::curve::{ScalarField, CurveCfg};
use icicle_core::msm;
use icicle_runtime::memory::HostSlice;

// 1) 디바이스 설정
icicle_runtime::set_device("CUDA", 0).unwrap();

// 2) 입력 데이터 준비
let scalars = HostSlice::from_slice(&scalar_vec);
let points  = HostSlice::from_slice(&affine_vec);

// 3) MSM 설정
let mut config = msm::MSMConfig::default();
config.c = 16;
config.precompute_factor = 8;

// 4) MSM 실행
let mut result = CurveCfg::zero_projective();
msm::msm(scalars, points, &config, &mut result).unwrap();

// 5) 결과: result는 Projective 좌표의 합산 점`;

const goCode = `// Go MSM 예시 (gnark 통합)
import (
    "github.com/ingonyama-zk/icicle/v3/wrappers/golang/core"
    "github.com/ingonyama-zk/icicle/v3/wrappers/golang/curves/bn254/msm"
    runtime "github.com/ingonyama-zk/icicle/v3/wrappers/golang/runtime"
)

// 1) 디바이스 설정
runtime.SetDevice("CUDA", 0)

// 2) MSM 설정
cfg := msm.GetDefaultMSMConfig()
cfg.C = 16

// 3) MSM 실행
var result bn254.Projective
err := msm.Msm(scalars, points, &cfg, &result)

// gnark 통합:
// gnark의 MultiExp 인터페이스를 ICICLE 백엔드로 교체하면
// 기존 gnark 회로 코드 변경 없이 GPU 가속을 적용할 수 있다.`;

export default function Bindings() {
  return (
    <section id="bindings" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Rust / Go 바인딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ICICLE은 C API 위에 Rust와 Go 바인딩을 제공한다.<br />
          패턴은 동일하다: 디바이스 설정 &rarr; 입력 준비 &rarr; Config 구성 &rarr; 연산 호출 &rarr; 결과 회수.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Rust 바인딩</h3>
        <p>
          <code>icicle-runtime</code>이 디바이스 관리를, <code>icicle-bn254</code> 같은 커브 크레이트가 타입을 제공한다.
          <code>HostSlice</code>로 호스트 메모리를 감싸면 라이브러리가 내부적으로 GPU 전송을 처리한다.
        </p>
        <CodePanel title="Rust MSM (icicle-bn254)" code={rustCode} annotations={[
          { lines: [6, 6], color: 'sky', note: '디바이스: CUDA GPU 0번' },
          { lines: [9, 10], color: 'emerald', note: 'HostSlice: 자동 H2D 전송' },
          { lines: [13, 14], color: 'amber', note: 'MSMConfig: 윈도우 + 사전계산' },
          { lines: [17, 18], color: 'violet', note: 'MSM 실행 및 결과' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">Go 바인딩 & gnark 통합</h3>
        <p>
          Go 바인딩은 cgo를 통해 C API를 호출한다.
          gnark의 <code>MultiExp</code> 인터페이스를 ICICLE 백엔드로 교체하면,
          기존 회로 코드를 수정하지 않고 GPU 가속을 적용할 수 있다.
        </p>
        <CodePanel title="Go MSM (gnark 통합)" code={goCode} annotations={[
          { lines: [8, 8], color: 'sky', note: '디바이스 설정' },
          { lines: [11, 12], color: 'emerald', note: 'Config 구성' },
          { lines: [15, 16], color: 'amber', note: 'MSM 실행' },
          { lines: [18, 21], color: 'violet', note: 'gnark 통합 방식' },
        ]} />
        <CitationBlock source="ICICLE Rust/Go Bindings" citeKey={3} type="code"
          href="https://github.com/ingonyama-zk/icicle/tree/main/wrappers">
          <p className="text-xs">
            v3부터 <code>icicle_runtime::set_device()</code>로 백엔드를 런타임에 선택한다.<br />
            CUDA 미설치 환경에서는 자동으로 CPU 폴백이 적용되어,
            CI/CD 파이프라인에서 GPU 없이도 테스트가 가능하다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
