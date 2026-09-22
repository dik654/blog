import TermBreakdown from "@/components/articles/term-breakdown";
import { CitationBlock } from "@/components/ui/citation-block";
import ExplainedFormula from "@/components/ui/explained-formula";
import { BlobDemandGapViz, BlobpoolPipelineViz } from "./robinhood-chain-blob-demand/viz/BlobDemandViz";

const DUNE_BLOBS = "https://dune.com/hildobby/blobs";
const EIP_4844 = "https://eips.ethereum.org/EIPS/eip-4844";
const EIP_7892 = "https://eips.ethereum.org/EIPS/eip-7892";

export default function RobinhoodChainBlobDemandArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Dune 대시보드 스냅샷 · 2026-09-12 기준</p>
          <h2 className="text-3xl font-bold tracking-tight">로빈후드 체인이 밀어올린 블롭 수요를 읽을 때는 평균·타겟·피크를 먼저 나눈다</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          &ldquo;이더리움 블롭 사용량이 사상 최대치를 경신했다&rdquo;는 문장 하나에는 서로 다른 세 숫자가 섞여 있습니다. 개별 블록이 잠깐 넘긴 피크,
          여러 날에 걸친 3일 이동평균, 그리고 프로토콜이 정해 둔 타겟입니다. 최근 로빈후드 체인(Robinhood Chain)의 활동이 늘면서 블록당 블롭 15개인
          타겟을 넘기는 블록이 종종 보이고, 3일 평균도 6.4개까지 올라왔습니다. 이 글은 이 관측을 로빈후드 체인이라는 하나의 rollup이 만든 수요 신호로
          읽고, BPO(Blob Parameter Only) 포크와 글램스터담(Glamsterdam)의 sparse blobpool 최적화가 왜 같은 문제의 서로 다른 절반인지 따라갑니다.
        </p>
        <p>
          먼저 짚을 것은 두 가지입니다. 첫째, 평균(6.4)은 타겟(15)의 절반에도 못 미칩니다. 둘째, 이 수요를 만든 로빈후드 체인 자체의 활동량은
          최근 오히려 줄어드는 추세로 보고됩니다. &ldquo;사상 최대&rdquo;라는 표현과 &ldquo;아직 타겟에 한참 못 미친다&rdquo;는 관측, &ldquo;최근
          활동이 줄고 있다&rdquo;는 관측은 서로 모순이 아니라 각기 다른 시간 창을 가리킵니다.
        </p>
        <BlobDemandGapViz />
      </section>

      <section id="target-vs-average" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">01 · 시장 메커니즘</p><h2 className="mt-2 text-2xl font-bold">타겟을 넘긴 블록은 기록이 아니라 다음 블록에 남는 압력이다</h2></header>
        <p>
          EIP-4844의 blob fee는 execution gas와 분리된 자체 수요 장부를 씁니다. 블록이 타겟보다 많은 blob을 담으면 그 초과분이
          <code>excess</code> 상태에 더해지고, 다음 블록의 최소 가격을 끌어올립니다. 타겟보다 적게 담으면 excess가 줄어 가격이 내려갑니다.
          그래서 개별 블록이 타겟을 넘겼다는 사실 하나만으로는 &ldquo;공급이 부족하다&rdquo;고 말할 수 없습니다 — 그 블록이 만든 압력이 이후
          블록들에서 상쇄되는지가 관건입니다. 3일 평균이 타겟에 근접하거나 넘어서야 비로소 지속적인 초과 수요로 읽을 수 있습니다.
        </p>
        <TermBreakdown title="블롭 뉴스에서 자주 섞이는 세 숫자" items={[
          { term: "타겟(target)", description: "이 값 위로 쌓이면 다음 블록의 최소 가격이 오르고, 아래면 내려가는 균형점입니다.", boundary: "고정 상수가 아니라 BPO 포크로 바뀌는 파라미터입니다." },
          { term: "이동평균(rolling average)", description: "여러 블록에 걸친 실제 사용량으로, 지속적인 수요 방향을 보여줍니다.", example: "3일 평균 6.4는 타겟 15보다 한참 낮습니다." },
          { term: "개별 피크(single-block peak)", description: "특정 블록 하나가 우연히 많은 blob을 담은 경우입니다.", boundary: "피크가 잦아진다고 평균이 타겟을 넘었다고 결론짓지 않습니다." },
        ]} />
        <p>
          이번 관측이 흥미로운 이유는 평균이 타겟보다 한참 낮은데도 최고치 경신이라는 표현이 성립한다는 점입니다. 즉 이 소식은 &ldquo;공급이
          모자라다&rdquo;는 경고가 아니라 &ldquo;수요 곡선이 얼마나 빠르게 움직였는가&rdquo;에 대한 신호입니다. 그 속도를 다음 절에서 봅니다.
        </p>
      </section>

      <section id="growth-rate" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">02 · 성장률</p><h2 className="mt-2 text-2xl font-bold">다섯 달 만에 두 배라는 말은 압력의 방향은 알려줘도 다음 달을 보장하지 않는다</h2></header>
        <p>
          올해 4월 수치와 비교해 약 다섯 달 만에 두 배 넘게 늘었다는 관측을 월간 성장률로 바꾸면, 그 성장이 이번 한두 주가 아니라
          한 분기 넘게 이어진 흐름이라는 점이 드러납니다. 동시에 같은 기간에 사용된 &ldquo;최근 감소 추세&rdquo;라는 관측과 나란히 놓으면,
          평균 성장률 하나로 앞으로도 같은 속도가 이어진다고 가정할 수 없다는 한계도 같이 보입니다.
        </p>
        <ExplainedFormula
          question="다섯 달 만에 두 배가 됐다는 문장은 한 달에 몇 %씩 늘었다는 뜻인가?"
          idea={<>시작값과 끝값의 비율을 구하고, 그 비율이 몇 달에 걸쳐 누적됐는지로 나눈 지수를 취하면 월평균 복리 성장률이 나옵니다.</>}
          formula={String.raw`r=\left(\frac{V_2}{V_1}\right)^{1/n}-1`}
          annotatedFormula={String.raw`r=\underbrace{\left(\frac{V_2}{V_1}\right)^{1/n}}_{\text{다섯 달 총 배율을 n개월로 나눠 월 단위 배율로 환산}}-1`}
          operations={[
            { expression: String.raw`V_2/V_1`, annotation: ["끝값을 시작값으로 나눠", "누적 배율을 구합니다."] },
            { expression: String.raw`(V_2/V_1)^{1/n}`, annotation: ["n제곱근을 취해", "한 달치 배율로 되돌립니다."] },
            { expression: String.raw`(\cdot)-1`, annotation: ["1을 빼서", "배율을 증가율로 바꿉니다."] },
          ]}
          terms={[
            { symbol: "V_1", name: "시작 시점 평균", description: "4월 기준 블록당 blob 평균 사용량입니다." },
            { symbol: "V_2", name: "현재 평균", description: "9월 기준 3일 평균 6.4를 사용한 관측값입니다." },
            { symbol: "n", name: "경과 개월", description: "약 5개월입니다." },
            { symbol: "r", name: "월평균 성장률", description: "같은 배율이 매달 반복됐다고 가정했을 때의 성장률입니다." },
          ]}
          assumptions={["두 시점 모두 같은 방식으로 집계한 평균값이라고 가정합니다.", "성장이 매달 같은 비율로 일어났다고 단순화합니다.", "이 값은 미래 예측이 아니라 과거 구간의 사후 요약입니다."]}
          interpretation="배율이 2배(V₂/V₁=2)이고 n=5면 r은 약 0.149, 월 14.9%에 해당합니다. 이 숫자는 지난 다섯 달의 평균 속도일 뿐이며, 같은 기간에 보고된 로빈후드 체인의 최근 활동 둔화를 반영하지 않습니다 — 다음 다섯 달에 그대로 복리로 이어진다고 읽으면 과장입니다."
        />
      </section>

      <section id="robinhood-chain-concentration" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">03 · 수요의 출처</p><h2 className="mt-2 text-2xl font-bold">체인 하나의 활동이 프로토콜 전체 지표를 흔들 수 있다</h2></header>
        <p>
          로빈후드 체인은 로빈후드가 토큰화 자산 거래를 위해 만든 rollup으로, 자체 트랜잭션 데이터를 이더리움 blob으로 posting합니다. 여러
          rollup이 blob을 나눠 쓰는 구조에서 특정 rollup 하나의 활동이 전체 blob 수요 지표를 눈에 띄게 움직였다는 것은, 현재 이 시장이
          아직 소수의 대형 소비자에 집중돼 있다는 뜻이기도 합니다. 넓은 기반의 L2 수요 증가와, 특정 애플리케이션 하나의 트래픽 급증은
          같은 &ldquo;blob 수요 증가&rdquo;라는 제목 아래서도 서로 다른 지속성을 가집니다.
        </p>
        <p>
          이 글이 인용하는 원 소식 자체도 로빈후드의 활동량이 최근 줄어드는 추세라고 밝히고 있습니다. 그렇다면 이번 최고치는 &ldquo;구조적으로
          자리 잡은 새로운 baseline&rdquo;이라기보다 &ldquo;한 rollup이 만든 피크가 아직 다 가라앉지 않은 구간&rdquo;에 가깝습니다. 이 구분은
          이후 몇 주의 3일 평균이 6.4 근처에서 유지되는지, 아니면 다시 낮아지는지를 보고 나서야 확정할 수 있습니다.
        </p>
        <div id="paper-robinhood-blob-demand">
          <CitationBlock source="Dune · hildobby/blobs 대시보드" citeKey={1} href={DUNE_BLOBS}>
            <p><strong>문제:</strong> 블록별 blob 개수와 이동평균을 공개적으로 추적할 수 있어야 합니다.</p>
            <p><strong>기여:</strong> 블록당 blob 개수, 타겟 대비 초과 빈도, 기간별 평균 추이를 시계열로 제공합니다.</p>
            <p><strong>전제:</strong> 이 글이 인용한 수치는 2026-09-12 시점 스냅샷이며, 대시보드는 이후에도 계속 갱신됩니다.</p>
            <p><strong>근거 범위:</strong> 체인 전체 집계이며, 이 글의 &ldquo;로빈후드 체인 기여&rdquo; 서술은 원 소식이 전한 맥락을 인용한 것이지 이 대시보드가 rollup별로 분리해 확인해 주는 값이 아닙니다.</p>
            <p><strong>말하지 않는 것:</strong> 특정 rollup의 정확한 기여 비율이나 앞으로의 추세를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="bpo-sparse-blobpool" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">04 · 공급 측 대응</p><h2 className="mt-2 text-2xl font-bold">타겟을 올리는 결정과 그 타겟을 감당할 자원을 줄이는 작업은 서로 다른 절반이다</h2></header>
        <p>
          EIP-4844 이후 blob target과 max를 바꾸려면 원래 전체 하드포크가 필요했습니다. BPO(Blob Parameter Only) 포크는 이 변경을
          다른 EVM·consensus 로직 변경과 분리해, target·max 같은 파라미터만 별도 일정으로 올릴 수 있게 하는 접근입니다. 수요가 계속
          타겟에 근접하거나 넘어서는 흐름이 이어진다면, 다음 대응은 새 EIP 셋을 담은 전체 포크가 아니라 이런 파라미터 전용 조정일 가능성이
          높습니다.
        </p>
        <p>
          다만 target을 올리는 결정 자체가 공짜는 아닙니다. 블록에 포함되기 전까지 대기 중인 blob 트랜잭션은 blobpool(mempool의 blob
          버전)에 전체 blob 데이터를 들고 있어야 합니다. Target이 올라가 평균 대기량이 늘면 노드가 들고 있어야 하는 데이터도 늘어납니다.
          글램스터담(Glamsterdam) 업그레이드에 포함되는 것으로 언급되는 sparse blobpool 최적화는 이 대기열의 중복 저장을 줄여, 같은
          자원으로 더 높은 target을 감당할 여지를 만드는 작업입니다.
        </p>
        <BlobpoolPipelineViz />
        <div id="paper-robinhood-bpo">
          <CitationBlock source="EIP-7892 · Blob Parameter Only Hardforks" citeKey={2} href={EIP_7892}>
            <p><strong>문제:</strong> Blob target·max 변경마다 전체 하드포크 주기를 기다리면 수요 변화에 대응이 느립니다.</p>
            <p><strong>기여:</strong> Blob 관련 파라미터만 스케줄된 별도 포크로 조정하는 메커니즘을 정의합니다.</p>
            <p><strong>전제:</strong> 클라이언트가 파라미터 전용 활성화 로직을 지원해야 합니다.</p>
            <p><strong>근거 범위:</strong> Target·max 파라미터 조정 절차 자체입니다.</p>
            <p><strong>말하지 않는 것:</strong> 특정 시점의 정확한 target·max 값이나 향후 BPO 일정을 이 글이 고정값으로 못박지 않습니다 — 실제 값은 활성화 시점의 공식 사양을 따로 확인해야 합니다.</p>
          </CitationBlock>
        </div>
        <div id="paper-robinhood-blob-fee">
          <CitationBlock source="EIP-4844 · Shard Blob Transactions" citeKey={3} href={EIP_4844}>
            <p><strong>문제:</strong> Blob 수요를 execution gas와 독립적으로 target 주변에 유지해야 합니다.</p>
            <p><strong>기여:</strong> Excess 기반 fee feedback과 target·max의 기본 정의를 제공합니다.</p>
            <p><strong>전제:</strong> 활성 fork의 target·max·update fraction을 사용합니다.</p>
            <p><strong>근거 범위:</strong> 이 글의 01절에서 재사용하는 blob fee 기본 메커니즘입니다. 계산 세부는 <a href="/cs/blockchain/eip4844-blob-fee">EIP-4844 Blob Fee 글</a>이 정본입니다.</p>
            <p><strong>말하지 않는 것:</strong> Rollup의 실제 posting 비용이나 로빈후드 체인 같은 특정 소비자의 행동을 규정하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="reading-checklist" className="space-y-6">
        <header><p className="text-sm font-semibold text-primary">05 · 검증</p><h2 className="mt-2 text-2xl font-bold">이 통계를 다시 확인하려면 무엇을 대조해야 하는가</h2></header>
        <p>
          이런 종류의 뉴스는 &ldquo;사상 최대&rdquo;라는 제목이 가장 먼저 눈에 띄지만, 그 제목만으로 공급 부족이나 수수료 급등을 단정하면
          안 됩니다. 아래 네 가지를 항상 나눠서 다시 확인하는 편이 안전합니다.
        </p>
        <ul className="list-disc space-y-2 pl-6 text-foreground/90">
          <li>피크 블록 개수와 3일 이상 이동평균을 같은 문장에서 섞어 인용하지 않았는지 — 이 글의 관측에서는 평균(6.4)이 타겟(15)의 절반에도 못 미쳤습니다.</li>
          <li>&ldquo;최고치 경신&rdquo;과 &ldquo;해당 기간 활동 감소 추세&rdquo;가 같은 소식 안에 함께 있는지 — 함께 있다면 최고치는 baseline이 아니라 아직 가라앉지 않은 피크일 가능성을 먼저 의심합니다.</li>
          <li>수요 증가가 여러 rollup에 걸친 분산된 증가인지, 하나의 rollup에 몰린 집중인지 — 이 글에서는 로빈후드 체인이라는 단일 소비자가 언급됐습니다.</li>
          <li>타겟·max 숫자를 인용할 때 스냅샷 시점을 함께 적었는지 — BPO 포크로 바뀌는 값이므로 날짜 없이 인용하면 이후 갱신과 혼동됩니다.</li>
        </ul>
        <p>
          이 네 가지를 통과해야 &ldquo;블롭 수요가 늘고 있다&rdquo;는 문장을 &ldquo;그래서 다음 BPO 일정이 얼마나 급해지는가&rdquo;라는
          질문으로 바꿔 읽을 수 있습니다.
        </p>
      </section>
    </article>
  );
}
