import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BlobGasDetailViz from './viz/BlobGasDetailViz';
import type { CodeRef } from '@/components/code/types';

export default function BlobGas({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="blob-gas" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob Gas 가격 모델</h2>
      <div className="not-prose mb-8"><BlobGasDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('blob-gas', codeRefs['blob-gas'])} />
          <span className="text-[10px] text-muted-foreground self-center">calc_blob_fee() & fake_exponential()</span>
        </div>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('header-blob-gas', codeRefs['header-blob-gas'])} />
          <span className="text-[10px] text-muted-foreground self-center">validate_cancun_gas() — 헤더 검증</span>
        </div>

        {/* ── excess_blob_gas 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">excess_blob_gas — 누적 초과분</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 매 블록 excess_blob_gas 업데이트
fn calculate_excess_blob_gas(
    parent_excess: u64,
    parent_blob_gas_used: u64,
) -> u64 {
    const TARGET: u64 = 3 * 131_072;  // 393_216 (3 blobs)

    let total = parent_excess + parent_blob_gas_used;
    total.saturating_sub(TARGET)
}

// 동작 원리:
// - 목표 3 blob/block → 393_216 blob_gas
// - 이전 블록이 target보다 많이 사용 → excess 증가
// - 이전 블록이 target보다 적게 사용 → excess 감소 (하한 0)

// 예시:
// 블록 N: excess=0, blob_gas_used=786_432 (6 blob, MAX)
// 블록 N+1: excess = max(0, 0 + 786_432 - 393_216) = 393_216
// 블록 N+2: excess = max(0, 393_216 + 393_216 - 393_216) = 393_216
// 블록 N+3 (3 blob): excess = max(0, 393_216 + 393_216 - 393_216) = 393_216
// 블록 N+4 (0 blob): excess = max(0, 393_216 + 0 - 393_216) = 0

// 의미:
// - 초과 사용 지속 → excess 누적 → blob_base_fee 상승
// - target 이하 사용 → excess 감소 → blob_base_fee 하락

// 방향성:
// - target (3 blob) 유지 시 excess 안정
// - 수요 증가 → excess 증가 → 가격 상승 → 수요 억제
// - EIP-1559와 같은 시장 조절 메커니즘 (별도 가스 공간)`}
        </pre>
        <p className="leading-7">
          <code>excess_blob_gas</code>가 <strong>blob_base_fee의 결정 변수</strong>.<br />
          매 블록 target(3 blobs)과 실제 사용량 차이가 excess에 누적.<br />
          일반 EIP-1559와 같은 피드백 루프, 단 blob 전용 시장.
        </p>

        {/* ── fake_exponential ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">fake_exponential — 정수 지수 함수</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// blob_base_fee = fake_exponential(1, excess_blob_gas, 3_338_477)
//
// 수학적: fee = 1 × exp(excess / 3_338_477)
//
// 하지만 부동소수점 사용 시 노드 간 미세한 차이 → 합의 실패 위험
// 정수만으로 지수 함수 근사 필요

pub fn fake_exponential(
    factor: u128,
    numerator: u128,
    denominator: u128,
) -> u128 {
    // Taylor 급수 근사:
    // e^(n/d) = 1 + (n/d) + (n/d)^2/2! + (n/d)^3/3! + ...
    //         = 1/1! + (n/d)/1! + (n/d)^2/2! + ...

    let mut output = 0u128;
    let mut numerator_accum = factor * denominator;
    let mut i = 1u128;

    while numerator_accum > 0 {
        output += numerator_accum;
        // 다음 항: numerator_accum × numerator / (denominator × i)
        numerator_accum = numerator_accum * numerator / (denominator * i);
        i += 1;
    }

    output / denominator
}

// 특성:
// - 입력이 정수 → 출력 항상 정수
// - 모든 노드가 동일한 결과 보장
// - 수렴 속도 빠름 (~20 iterations)

// blob_base_fee 곡선:
// excess=0: 1 wei
// excess=1M: ~1 wei (0.000...)
// excess=10M: ~1.2 wei
// excess=50M: ~5 wei
// excess=100M: ~24 wei
// excess=200M: ~550 wei
// excess=300M: ~13_000 wei
//
// → 지수적 증가 (수요 폭증 시 가격 급등)`}
        </pre>
        <p className="leading-7">
          <strong>fake_exponential</strong>이 정수 연산의 핵심 — 모든 노드 동일 결과 보장.<br />
          Taylor 급수 ~20회 iteration으로 e^x 정확한 정수 근사.<br />
          float 사용 시 노드 간 미세 차이 → consensus split 위험.
        </p>

        {/* ── blob_gas 경제 시나리오 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Blob 수수료 시장 시뮬레이션</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 시나리오 1: 정상 상태 (3 blobs/block 유지)
// excess=0 유지, blob_base_fee = 1 wei
// 롤업: 블록당 ~0.0001 ETH로 3 blob 사용
// → 매우 저렴

// 시나리오 2: 수요 급증 (6 blobs/block 지속)
// 블록 1: excess=0 → 393_216
// 블록 10: excess=3_932_160
// 블록 100: excess=39_321_600
// blob_base_fee: 1 wei → ~2000 wei
// → 여전히 저렴하지만 상승 추세

// 시나리오 3: 대규모 이벤트 (airdrop 등)
// 연속 200 블록 6 blob 사용
// excess 약 80M
// blob_base_fee ~15_000_000 wei = 0.015 Gwei
// → 급격한 상승, 수요 억제

// 시나리오 4: 수요 감소
// 10 블록 연속 0 blob
// excess 39_321_600 → 0으로 감소 (10블록에 3_932_160씩 감소)
// blob_base_fee: 0.015 Gwei → 1 wei
// → 빠른 회복

// 실제 메인넷 데이터 (2025 기준):
// - 평균 blob_base_fee: 1~10 wei (극히 낮음)
// - 피크: 수백 wei (에어드랍 시기)
// - 연간 burn: ~수십 ETH (매우 적음)`}
        </pre>
        <p className="leading-7">
          Blob market은 <strong>매우 낮은 수수료</strong>로 안정화.<br />
          대부분 시기 blob_base_fee = 1 wei → 롤업 운영 비용 극저.<br />
          수요 급증 시에만 급격히 상승 → 공급 조절 메커니즘.
        </p>
      </div>
    </section>
  );
}
