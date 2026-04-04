import CodePanel from '@/components/ui/code-panel';
import { CitationBlock } from '@/components/ui/citation';

const msmApiCode = `// ICICLE MSM C++ API
#include "icicle/msm.h"
#include "icicle/curves/bn254.h"

using namespace bn254;

// MSM 설정
msm::MSMConfig config = msm::default_msm_config();
config.c = 16;                  // 버킷 비트 수 (window size)
config.precompute_factor = 8;   // 사전 계산 배율
config.batch_size = 1;          // 배치 크기
config.are_scalars_mont = true; // Montgomery 형식 여부

// MSM 실행: result = sum(scalars[i] * points[i])
projective_t result;
eIcicleError err = msm::msm(
    scalars,   // device_ptr<scalar_t>
    points,    // device_ptr<affine_t>
    n,         // 포인트 개수
    config,    // MSMConfig
    &result    // 결과 (projective)
);`;

const nttApiCode = `// ICICLE NTT C++ API
#include "icicle/ntt.h"
#include "icicle/fields/bn254_scalar.h"

using namespace bn254;

// NTT 설정
ntt::NTTConfig<scalar_t> config = ntt::default_ntt_config<scalar_t>();
config.ordering = ntt::Ordering::kNR;  // Natural-to-Reversed
config.are_inputs_on_device = true;
config.are_outputs_on_device = true;
config.coset_gen = scalar_t::omega(log_n); // coset 생성원

// NTT 실행
eIcicleError err = ntt::ntt(
    input,     // device_ptr<scalar_t>
    n,         // 입력 크기 (2의 거듭제곱)
    ntt::NTTDir::kForward,  // Forward / Inverse
    config,
    output     // device_ptr<scalar_t>
);`;

export default function CudaBackend() {
  return (
    <section id="cuda-backend" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CUDA 백엔드 & Curve 추상화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          ICICLE의 CUDA 백엔드는 C++ 템플릿으로 커브를 추상화한다.
          <code>scalar_t</code>와 <code>affine_t</code>를 템플릿 파라미터로 받아,
          하나의 MSM 커널 코드가 BN254, BLS12-381 등 모든 커브에서 동작한다.
        </p>
        <p>
          필드 연산(Montgomery 곱셈, 덧셈, 역원)은 <code>__device__</code> 함수로 구현되어
          커널 내부에서 인라인된다. 256비트 정수는 4개의 <code>uint64_t</code> 림으로 표현한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MSM API</h3>
        <p>
          <code>msm::msm()</code> 함수 하나로 GPU MSM을 실행한다.
          <code>MSMConfig</code>의 <code>c</code> 값이 버킷 윈도우 크기를 결정하고,
          <code>precompute_factor</code>가 사전 계산 테이블 크기를 조절한다.
        </p>
        <CodePanel title="ICICLE MSM C++ API" code={msmApiCode} annotations={[
          { lines: [8, 13], color: 'sky', note: 'MSMConfig: 윈도우, 사전계산, 배치' },
          { lines: [16, 23], color: 'emerald', note: 'msm() 호출: scalars x points' },
        ]} />

        <h3 className="text-xl font-semibold mt-8 mb-3">NTT API</h3>
        <p>
          NTT는 <code>ntt::ntt()</code>로 실행한다.
          <code>Ordering</code>으로 비트 리버스 순서를, <code>coset_gen</code>으로 coset NTT를 설정한다.<br />
          Forward/Inverse 방향은 <code>NTTDir</code> 열거형으로 지정한다.
        </p>
        <CodePanel title="ICICLE NTT C++ API" code={nttApiCode} annotations={[
          { lines: [7, 11], color: 'sky', note: 'NTTConfig: ordering, coset, device' },
          { lines: [14, 20], color: 'emerald', note: 'ntt() 호출: Forward / Inverse' },
        ]} />
        <CitationBlock source="ICICLE Documentation — CUDA Backend" citeKey={2} type="code"
          href="https://dev.ingonyama.com/icicle/overview">
          <p className="text-xs">
            ICICLE v3부터 백엔드 디스패처가 런타임에 CUDA/CPU를 선택한다.
            <code>icicle_set_device("CUDA", 0)</code>로 GPU를 지정하거나,
            CUDA가 없으면 자동으로 CPU 폴백된다.
          </p>
        </CitationBlock>
      </div>
    </section>
  );
}
