import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import BlobGasDetailViz from "./viz/BlobGasDetailViz";
import type { CodeRef } from "@/components/code/types";

export default function BlobGas({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="blob-gas" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Blob gas: block별 수요 차이를 다음 block의 가격으로 전달한다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Blob fee market은 현재 block 하나만 보고 가격을 정하지 않습니다. 이전 block까지 누적된 <code>excess_blob_gas</code>에 현재 사용량을 더하고 target을 차감한 뒤, 그 결과를 정수형 지수 함수에 넣어 다음 base fee를 계산합니다. 그래서 target을 잠깐 넘는 정도와 여러 block에 걸쳐 계속 넘는 상황이 서로 다른 가격 신호를 만듭니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("blob-gas", codeRefs["blob-gas"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            calc_blob_fee() & fake_exponential()
          </span>
        </div>
      </div>
      <div className="not-prose my-8">
        <BlobGasDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("header-blob-gas", codeRefs["header-blob-gas"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            validate_cancun_gas() — 헤더 검증
          </span>
        </div>

        {/* ── excess_blob_gas 계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          excess_blob_gas — 누적 초과분
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              calculate_excess_blob_gas()
            </p>
            <div className="space-y-2 text-sm text-foreground/80"><p><code className="text-xs">total = parent_excess + parent_blob_gas_used</code></p><p><code className="text-xs">excess = total.saturating_sub(TARGET)</code></p><p><code className="text-xs">TARGET = blob_params.target_blob_gas_per_block()</code></p></div>
            <p className="text-xs text-foreground/50 mt-2">
              target 초과 시 excess 증가, 미달 시 감소 (하한 0)
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              Fork-aware 계산 순서
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>parent timestamp에서 적용할 blob params 선택</li>
              <li>parent excess와 parent blob gas used 합산</li>
              <li>활성 schedule의 target blob gas를 차감</li>
              <li>0보다 작으면 saturating subtraction으로 0 유지</li>
            </ul>
          </div>
          <div className="sm:col-span-2 rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              피드백 루프
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              사용량이 target을 계속 넘으면 excess와 다음 block의 가격이 올라가 수요를 억제합니다. 반대로 target보다 적게 사용하면 excess가 줄어듭니다. Fork upgrade가 target과 maximum을 바꾸더라도 같은 state variable을 이어 쓰기 때문에 가격 변화가 block 경계에서 갑자기 초기화되지는 않습니다.
            </p>
          </div>
        </div>
        <p>
          따라서 <code>excess_blob_gas</code>는 blob base fee의 핵심 state입니다. EIP-1559와 마찬가지로 target 주변의 장기 평균 사용량을 유도하지만, execution gas와는 별도의 수요와 parameter를 사용하는 독립 시장입니다.
        </p>

        {/* ── fake_exponential ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          fake_exponential — 정수 지수 함수
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-400 mb-2">
              fake_exponential(factor, numerator, denominator)
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              목표 함수는 <code className="text-xs">fee = factor × exp(numerator / denominator)</code>입니다. 부동소수점을 사용하면 platform별 반올림 차이가 consensus divergence로 이어질 수 있으므로, <code className="text-xs">e^(n/d) = 1 + n/d + (n/d)²/2! + …</code>의 항을 정수 연산으로 차례로 더합니다.
            </p>
            <p className="text-xs text-foreground/50 mt-2">
              정수 항이 0이 될 때 종료하며 반복 횟수는 입력에 따라 달라진다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              blob_base_fee 곡선
            </p>
            <ul className="text-sm text-foreground/80 space-y-1 leading-relaxed">
              <li>
                <code>factor</code>: fork별 minimum blob base fee
              </li>
              <li>
                <code>numerator</code>: parent에서 이어진 excess blob gas
              </li>
              <li>
                <code>denominator</code>: fork별 update fraction
              </li>
              <li>excess 증가 → fee가 단조 증가</li>
              <li>부동소수점 없이 모든 client가 같은 정수 결과 계산</li>
            </ul>
            <p className="text-xs text-foreground/50 mt-2">
              지수적 증가 — 수요 폭증 시 가격 급등
            </p>
          </div>
        </div>
        <p>
          <code>fake_exponential</code>은 정수 나눗셈 뒤 다음 항이 0이 될 때까지 Taylor term을 누적합니다. 모든 client가 같은 순서와 정수 규칙으로 계산하므로, 근삿값이면서도 consensus에 사용할 수 있는 결정론적 결과를 얻습니다.
        </p>

        {/* ── blob_gas 경제 시나리오 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Blob 수수료 시장을 해석하는 네 경우
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-400 mb-2">
              사용량 = 현재 target
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              새 excess는 증가하지 않지만 이미 누적된 값이 즉시 사라지지도 않습니다. 현재 fee는 기존 excess와 활성 fork의 minimum fee·update fraction에 따라 유지됩니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-400 mb-2">
              사용량 &gt; 현재 target
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Target을 넘긴 gas가 excess로 누적되어 다음 block들의 blob base fee를 올립니다. 상승 속도는 target과 실제 사용량의 차이, 그리고 update fraction으로 결정됩니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-red-400 mb-2">
              사용량 = 현재 max
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Maximum까지 사용하면 target과 maximum의 차이만큼 excess가 빠르게 쌓입니다. Fork가 maximum 공급을 늘렸더라도 target과 fee parameter가 함께 어떻게 바뀌었는지 확인해야 합니다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-blue-400 mb-2">
              시나리오 4: 수요 감소
            </p>
            <p className="text-sm leading-6 text-foreground/80">
              Target보다 적게 사용한 만큼 excess가 줄어듭니다. 0에 도달하는 데 필요한 시간은 시작 excess와 block마다 남은 target gas에 따라 달라집니다.
            </p>
          </div>
        </div>
        <p>
          이 네 경우를 관통하는 목표는 block마다 정확히 target을 강제하는 것이 아니라 장기 평균을 target 주변으로 유도하는 것입니다. 따라서 운영 화면에서는 고정된 fee 예시보다 현재 excess와 활성 chain spec parameter를 함께 표시해야 fork 이후에도 같은 해석을 유지할 수 있습니다.
        </p>
      </div>
    </section>
  );
}
