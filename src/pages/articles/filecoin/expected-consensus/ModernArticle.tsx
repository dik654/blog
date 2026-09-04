import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { ExpectedConsensusTraceViz, ForkChoiceBoundaryViz } from "./viz/ModernExpectedConsensusViz";

export default function ModernExpectedConsensusArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">Filecoin Expected Consensus</p><h2 className="text-3xl font-bold tracking-tight">누가 block을 만들고, 어떤 blocks를 묶고, 어느 valid branch를 head로 볼지 나눈다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">
            Alice가 Bob에게 5 FIL을 보내는 signed message를 냈다고 하겠습니다. Storage provider는 자신의 quality-adjusted
            power(QAP, 유효 저장 기여도를 반영한 power)와 election proof로 그 epoch에 block을 만들 권리를 얻습니다. 여러 provider가 동시에
            block을 만들 수 있으므로 compatible blocks는 하나의 tipset이 되고 node는 모든 block을 검증한 뒤 누적 weight가 큰 valid
            branch를 local head로 선택합니다.
          </p>
      <p>이 순서에서 reception, validation, inclusion, execution success, canonical head, irreversible finality는 서로 다른 milestone입니다. Message가 block에 들어가도 block이 invalid이면 후보에서 빠지고, valid branch가 head가 되어도 더 무거운 compatible branch가 나타나면 바뀔 수 있습니다. 이 글은 EC가 소유하는 leader sortition과 weighted fork choice까지만 설명하며 F3 certificate finality는 별도 글에서 이어집니다.</p>
      <ExpectedConsensusTraceViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> Expected Consensus는 power 지분을 매 epoch의 확률적 win count로 바꾸고, 같은 parent state를 실행할 수 있는 blocks만 tipset으로 묶습니다. 그 다음에야 완전히 검증한 branches의 chain weight를 비교합니다.</aside>
    </section>

    <section id="sortition" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · Poisson sortition</p><h2 className="mt-2 text-2xl font-bold">Power 지분은 고정 일정표가 아니라 epoch별 win count 분포가 된다</h2></header>
      <p>
            Provider의 election proof에는 VRF output이 들어가며 Lotus는 이를 균일 난수로 해석한 뒤 Poisson inverse CDF를 사용해 win
            count를 계산합니다. 한 provider의 power가 10%라고 해서 “열 epoch마다 정확히 한 번” 당첨되지는 않습니다. 어떤 epoch에는 0회, 다른
            epoch에는 여러 win을 받을 수 있고 expected leader count가 전체 평균을 정합니다. VRF domain, beacon randomness, miner
            identity와 power snapshot이 달라지면 같은 byte를 재사용할 수 없습니다.
          </p>
      <ExplainedFormula question="Power 지분 s인 provider가 한 epoch에 j번 당첨될 확률은 어떻게 정해지는가?" idea={<>전체 expected leaders E에 provider의 QAP 지분 s를 곱해 Poisson rate lambda를 만듭니다. 이 분포에서 나온 j는 block의 ElectionProof.WinCount에 들어가며 branch weight 증가에도 사용됩니다.</>} formula={String.raw`\lambda=E\frac{p}{P},\qquad \Pr[J=j]=e^{-\lambda}\frac{\lambda^j}{j!}`}
      annotatedFormula={String.raw`\lambda=\underbrace{E\frac{p}{P},\qquad \Pr[J=j]=e^{-\lambda}\frac{\lambda^j}{j!}}_{\text{기준량당 비율}}`}
      operations={[
        { expression: String.raw`E\frac{p}{P},\qquad \Pr[J=j]=e^{-\lambda}\frac{\lambda^j}{j!}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","전체 expected leaders E에 provider의","QAP 지분 s를 곱해 Poisson rate lambda를","만듭니다."] },
      ]} terms={[{symbol:"E",name:"expected leaders",description:"Protocol/network version이 정한 epoch당 전체 기대 당첨 수입니다."},{symbol:"p",name:"provider power",description:"해당 snapshot에서 provider가 가진 quality-adjusted power입니다."},{symbol:"P",name:"total power",description:"같은 snapshot의 eligible network quality-adjusted power 합입니다."},{symbol:String.raw`\lambda`,name:"Poisson rate",description:"이 provider가 한 epoch에 기대하는 win count입니다."},{symbol:"J",name:"win count",description:"VRF output을 inverse CDF에 넣어 얻는 non-negative integer입니다."}]} assumptions={["p와 P는 같은 state/power snapshot에서 가져오며 P>0입니다.","Randomness domain, network version과 exact integer arithmetic을 검증합니다.","Win count distribution은 장기 기댓값이지 epoch별 일정표가 아닙니다.","Election win만으로 block validity나 canonical inclusion을 보장하지 않습니다."]} interpretation="E=5이고 p/P=0.1이면 lambda=0.5입니다. 당첨이 0회일 확률은 e^-0.5≈0.607이고, 1회는 약 0.303입니다. 10% 지분이어도 대부분의 개별 epoch에서는 block을 만들지 않는다는 뜻입니다." />
      <div id="paper-filecoin-ec-spec"><CitationBlock source="Filecoin Specification — Expected Consensus" citeKey={1} href="https://spec.filecoin.io/algorithms/expected_consensus/"><p><strong>문제:</strong> Storage power에 비례해 여러 epoch leaders를 선출하고 compatible blocks에서 canonical chain을 선택합니다.</p><p><strong>기여:</strong> Election proof, tipset compatibility, validation과 chain-weight fork choice의 protocol 기준을 정의합니다.</p><p><strong>전제:</strong> Active network version의 randomness, power state, cryptographic proofs와 block semantics를 따릅니다.</p><p><strong>근거 범위:</strong> Expected Consensus의 protocol-level sortition과 fork-choice 의미입니다.</p><p><strong>말하지 않는 것:</strong> Lotus의 모든 current API, 고정 confirmation 시간이나 F3 certificate finality를 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-lotus-election-v1362"><CitationBlock source="Lotus v1.36.2 — electionproof.go" citeKey={2} type="code" href="https://github.com/filecoin-project/lotus/blob/v1.36.2/chain/types/electionproof.go"><p><strong>문제:</strong> VRF output과 power fraction을 deterministic win count로 변환해야 합니다.</p><p><strong>기여:</strong> Poisson inverse-CDF 기반 ComputeWinCount와 bounded win count 처리를 구현합니다.</p><p><strong>전제:</strong> Lotus v1.36.2 commit c6f4d02, 같은 power snapshot과 expected-leader constant를 사용합니다.</p><p><strong>근거 범위:</strong> 이 pinned revision의 election win-count 산술 구현입니다.</p><p><strong>말하지 않는 것:</strong> Randomness 공급, miner eligibility, WinningPoSt나 block 전체 validity를 단독으로 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="tipset-weight" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · tipset, validation, weight</p><h2 className="mt-2 text-2xl font-bold">같은 height만 보지 않고 같은 부모 상태를 실행할 수 있는지부터 확인한다</h2></header>
      <p>
            같은 epoch의 block A와 B라도 parent tipset, parent state root, parent message receipts 등 consensus-
            critical commitments가 맞아야 한 tipset으로 묶을 수 있습니다. 다른 parent를 가리키는 C는 height가 같아도 별도 fork입니다. tipset의
            messages를 하나의 deterministic parent state 위에서 실행하려면 이 조건이 필요합니다. Height만 비교해 A·C를 합치면 어느 state에서
            시작할지 정할 수 없습니다.
          </p>
      <p>
            호환성은 아직 validity가 아닙니다. Node는 parent와 height·timestamp, parent weight, miner와 power eligibility를
            검사합니다. 여기에 election proof와 win count, WinningPoSt, block signature, message root와 message
            validity가 더해집니다. Valid signature 하나가 나머지 검사를 대신하지 않습니다. 검증에 실패한 block은 weight 경쟁에 넣지 않으며 검증 결과도
            application message의 business success와는 구분합니다.
          </p>
      <ExplainedFormula question="두 valid EC branches 가운데 local head를 어떻게 비교하는가?" idea={<>Parent weight에 network power의 log term과 tipset election wins에 따른 증가분을 더합니다. 실제 Lotus는 consensus-critical integer arithmetic과 build constants를 사용하므로 아래 식은 구조를 읽기 위한 요약이고 exact comparison은 pinned code로 재현합니다.</>} formula={String.raw`W(T)=W(parent)+\Delta_{power}(P)+\Delta_{wins}(P,J_T)`}
      annotatedFormula={String.raw`W(T)=\underbrace{W(parent)+\Delta_{power}(P)+\Delta_{wins}(P,J_T)}_{\text{변화량 계산}}`}
      operations={[
        { expression: String.raw`W(parent)+\Delta_{power}(P)+\Delta_{wins}(P,J_T)`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","Parent weight에 network power의 log","term과 tipset election wins에 따른","증가분을 더합니다."] },
      ]} terms={[{symbol:"W(T)",name:"tipset chain weight",description:"Tipset T까지 누적된 fork-choice score입니다."},{symbol:"P",name:"network QAP",description:"Parent state에서 읽은 total quality-adjusted power입니다."},{symbol:"J_T",name:"tipset win total",description:"Tipset blocks의 validated ElectionProof win counts 합입니다."},{symbol:String.raw`\Delta_{power}`,name:"power term",description:"Lotus pinned 구현에서 log2(network power)를 fixed-point integer로 반영하는 항입니다."},{symbol:String.raw`\Delta_{wins}`,name:"election term",description:"Expected leaders와 win count를 반영하는 구현별 consensus-critical 증가분입니다."}]} assumptions={["비교 대상 blocks가 먼저 full validation을 통과했고 compatible tipsets로 구성되었습니다.","Parent weight와 power state는 각 branch가 주장한 parent state에서 검증합니다.","Network version과 Lotus revision의 exact integer constants를 고정합니다.","더 큰 weight는 현재 local fork-choice 결과이지 irreversible finality certificate가 아닙니다."]} interpretation="Branch X의 누적 weight가 Y보다 크면 node는 X를 head로 택합니다. 그러나 invalid X는 계산값이 아무리 커도 후보가 아니며, 이후 valid Y가 더 무거워지면 head는 바뀔 수 있습니다." />
      <ForkChoiceBoundaryViz />
      <div id="paper-lotus-weight-v1362"><CitationBlock source="Lotus v1.36.2 — filcns weight.go" citeKey={3} type="code" href="https://github.com/filecoin-project/lotus/blob/v1.36.2/chain/consensus/filcns/weight.go"><p><strong>문제:</strong> Valid tipsets의 parent power와 election wins를 deterministic integer chain weight로 계산합니다.</p><p><strong>기여:</strong> Parent weight, log2 QAP fixed-point term과 election-win 증가분의 pinned 산술을 구현합니다.</p><p><strong>전제:</strong> Lotus v1.36.2 commit c6f4d02와 matching build constants·network state를 사용합니다.</p><p><strong>근거 범위:</strong> 이 revision의 EC chain-weight 계산과 local head comparison input입니다.</p><p><strong>말하지 않는 것:</strong> Invalid branch admission, future constants, finality certificate나 downstream release policy를 정하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · failure와 release</p><h2 className="mt-2 text-2xl font-bold">Head change를 정상 상태로 취급하되 invalid branch와 finality 오표시는 차단한다</h2></header>
      <p>
            Reorg test는 같은 parent에서 branch A와 branch B를 만듭니다. A에는 Alice→Bob message가 들어가고 B는 그와 다른 valid
            branch입니다. 그다음 검증·tipset compatibility·weight를 순서대로 재생합니다. Wrong election proof, stale parent
            state, invalid WinningPoSt, mismatched message root는 weight 계산 전에 거절됩니다. 두 valid branches라면
            weight가 큰 쪽으로 head가 이동하고 application state와 message receipt도 새 head를 기준으로 되돌려 재실행합니다.
          </p>
      <p>Block이 하나도 만들어지지 않은 <strong>null epoch</strong>도 block이나 빈 tipset 한 개로 세면 안 됩니다. Epoch clock은 계속 전진하고 다음 tipset은 이전 tipset보다 height를 여러 칸 건너뛸 수 있으며, VM은 그 차이에 해당하는 cron·state effects를 protocol 순서대로 반영합니다. 따라서 tipset 개수와 epoch 차이는 같지 않습니다. 이 경계를 포함한 fixture는 null 구간 뒤 parent state와 다음 block의 height·timestamp가 같은 결과를 내는지 확인해야 합니다.</p>
      <p>
            Sortition regression은 VRF bytes, domain separation inputs, power snapshot, expected leaders와
            network version을 고정합니다. 그 상태에서 inverse-Poisson 결과 j와 implementation의 maximum bound를 함께 확인합니다.
            Concurrent block validation은 모든 checks가 같은 parent tipset key·lookback state·network version을 읽었는지
            receipt에 묶어 race를 차단합니다. Weight fixture는 exact constants와 parent weight·QAP·win counts를 저장합니다. 같은
            weight가 나온 경우에도 pinned chain-store의 deterministic tie rule을 재현한 뒤 head transition을 비교합니다.
          </p>
      <p>API는 <code>received</code>, <code>validated</code>, <code>EC head included</code>, <code>F3 finalized</code>를 따로 노출해야 합니다. EC head만 보고 irreversible이라고 표시하면 정상 reorg가 사용자에게 이중 지불처럼 보일 수 있습니다. Release에는 exact Lotus/network revision, power snapshot, tipset keys, validation receipt와 head-change trace를 남기고, F3 lag가 큰 동안에는 finality-dependent withdrawal을 보류합니다.</p>
      <div className="grid gap-4 md:grid-cols-2"><aside className="rounded-lg border border-border p-4"><h3 className="font-semibold">안전 gate</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Invalid block weight 경쟁 0, incompatible tipset merge 0, wrong parent state execution 0.</p></aside><aside className="rounded-lg border border-border p-4"><h3 className="font-semibold">운영 gate</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Head와 F3 certificate 높이를 분리하고 reorg depth·validation latency·certificate lag를 기록합니다.</p></aside></div>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>기초 6문제는 Poisson win count, 0-win 확률, tipset compatibility, validation, chain weight와 EC/F3 경계를 묻습니다. 심화 4문제는 stale power, invalid-heavy branch, reorg replay와 finality-dependent release를 설계하게 합니다. 위 수식과 반례만으로 각 답의 전제까지 설명할 수 있어야 합니다.</p>
    </section>
  </article>;
}
