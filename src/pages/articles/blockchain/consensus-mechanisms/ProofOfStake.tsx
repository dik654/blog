import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import PoSValidatorViz from "./viz/PoSValidatorViz";
import PoSFlowViz from "./viz/PoSFlowViz";
export default function ProofOfStake(){return <section id="pos" data-teach-level="6" className="space-y-6 [&_p]:leading-8">
<h2 className="text-2xl font-bold">9. 지분 40은 매번 당첨된다는 뜻이 아닙니다</h2>
<p>같은 네 참여자가 10·20·30·40의 자원을 프로토콜에 담보로 등록했다고 놓습니다(가정). 이 지분으로 제안할 기회와 투표 무게를 정합니다. 실제로 검증에 참여하는 사람을 validator, 블록을 내놓을 사람을 proposer라고 부릅니다. 누가 선택되는지는 현재 상태와 검증 가능한 무작위 선택 규칙에 따릅니다.</p>
<PoSValidatorViz />
<ExplainedFormula question="자원 40을 가진 D의 한 번 선택 확률은 얼마일까요?" idea="단순 지분 비례 선택에서는 각 참여자의 자원을 전체 자원으로 나눕니다." formula={String.raw`P(i)=\frac{s_i}{\sum_j s_j}`} annotatedFormula={String.raw`P(i)=\frac{\overbrace{s_i}^{\text{참여자 한 명의 지분}}}{\underbrace{\sum_j s_j}_{\text{선택 대상의 전체 지분}}}`} operations={[{expression:String.raw`s_i`,annotation:["이 참여자에게 인정한 지분입니다."]},{expression:String.raw`\sum_j s_j`,annotation:["모든 대상의 지분을 더해 비율의 분모로 씁니다."]}]} terms={[{symbol:"sᵢ",name:"인정 지분",description:"현재 선택에서 가중치로 사용하는 값입니다."},{symbol:"P(i)",name:"선택 확률",description:"단순 비례 모형에서 한 번 선택될 확률입니다."}]} assumptions={["10·20·30·40은 같은 단위로 표시한 설명용 가정입니다.","실제 프로토콜의 등록 조건·잔액 제한·위원회 선택과 무작위성 규칙을 따로 확인합니다."]} interpretation="합계 100에서 D는 40/100=0.4입니다. 장기 평균의 비율이며 다음 한 번의 선택을 보장하지 않습니다. A가 여러 키로 나눠도 같은 합계 지분만 인정한다면 총 무게는 10입니다." />
<p>D가 X를 제안하더라도 다른 참여자는 잔액 90이 맞는지 다시 계산합니다. 유효한 X를 지지하는 A·B·D의 표가 같은 투표 문맥에 모였다면 합계는 70입니다. C를 제외했다고 인원 과반수 3명만 세는 대신 각 표의 지분을 합합니다.</p>
<PoSFlowViz />
<h3 className="text-xl font-semibold">충분한 표와 최종 확정 사이에는 추가 규칙이 있습니다</h3>
<p>Ethereum의 체크포인트는 일정 간격의 기록 지점을 뜻합니다. 올바른 출발 지점에서 대상 지점으로 충분한 지분의 표가 모이는 판정을 justification이라고 합니다. 그 결과를 여러 시점에 걸쳐 연결해 finality를 정합니다. 표 70이 보인 순간 임의의 블록을 곧바로 확정한다고 읽으면 안 됩니다.</p>
<div id="paper-ethereum-pos-spec"><CitationBlock source="consensus-specs 889a389 · phase0 weigh_justification_and_finalization" citeKey={3} href="https://github.com/ethereum/consensus-specs/blob/889a389f9f95d2aba52aedf233217f370772dd3d/specs/phase0/beacon-chain.md#weigh_justification_and_finalization"><p>원문의 지분 판정은 아래와 같습니다. 고정한 phase0의 공통 판정 구조를 읽으며 현재 배포 규칙 전체를 이 발췌로 대체하지 않습니다.</p><pre className="overflow-x-auto text-xs leading-6"><code>{`if current_epoch_target_balance * 3 >= total_active_balance * 2:
    state.current_justified_checkpoint = Checkpoint(
        epoch=current_epoch, root=get_block_root(state, current_epoch)
    )
    state.justification_bits[0] = Boolean(True)`}</code></pre></CitationBlock></div>
<p>같은 조건에 합계 지분 100, 올바른 대상 투표 지분 70을 대응시키면 70×3=210이 100×2=200 이상이라 이 판정을 통과합니다. 60이면 180이어서 통과하지 않습니다. 코드 뒤의 finalization 분기는 이전에 정당화된 지점과 시점 간격을 다시 확인합니다. 이 예는 유효 투표로 집계되기 위한 서명·출발 지점·시점 검사를 이미 통과했다고 가정합니다.</p>
<p>현재 head를 고르는 fork choice와 finality, 위반한 서명에 경제적 손실을 부과하는 slashing은 각각의 규칙입니다. 슬래싱은 같은 역할·시점에서 모순되는 서명처럼 객관적으로 검증 가능한 위반 증거를 다룹니다. 단순 오프라인 벌점과도 구분합니다.</p>
<div id="paper-gasper"><CitationBlock source="Combining GHOST and Casper (Gasper)" citeKey={2} href="https://arxiv.org/abs/2003.03052"><p>블록 가지를 선택하는 규칙과 책임을 물을 수 있는 확정을 결합한 이론적 근거입니다. 정직한 지분과 메시지 시점에 관한 전제 아래 안전성과 진행 가능성을 분석합니다. 특정 클라이언트의 최신 모든 업그레이드, 키 보관이나 처리량 측정까지 보장하는 논문은 아닙니다.</p></CitationBlock></div>
<p>40을 가진 D가 응답하지 않으면 나머지 지분 60만으로 위의 2/3 판정을 통과하지 못합니다. 잘못된 두 기록을 확정하지 않는 성질과 새 기록이 계속 확정되는 성질을 구분해야 하는 이유입니다. 마지막에는 이 네 참여자가 겪을 실패를 같은 조건으로 비교하겠습니다.</p>
</section>}
