import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { GpbftBoundaryViz, GpbftPhaseViz } from "./viz/ModernGpbftViz";

export default function ModernGossipBftArticle() {
  return <article className="space-y-14">
    <section id="overview" className="space-y-6">
      <header className="space-y-3"><p className="text-sm font-semibold text-primary">GossiPBFT · go-f3의 GPBFT</p><h2 className="text-3xl font-bold tracking-tight">Message를 널리 받은 것과 같은 checkpoint를 결정한 것을 분리한다</h2></header>
      <p className="text-lg leading-8 text-foreground/90">
            Alice→Bob transaction을 포함한 EC chain prefix A와 경쟁 prefix B가 있다고 하겠습니다. Gossipsub은 두 proposal과
            votes를 peers에게 전파하지만 어떤 node가 message를 받았다는 사실은 합의가 아닙니다. GPBFT는 valid votes를 모아 그 historical
            power로 strong quorum evidence를 만드는데, 이때 vote는 network·instance·round·phase·base에 결속돼 있어야 합니다. 이렇게
            만든 evidence를 단계별 justification으로 넘겨 하나의 decision certificate에 도달합니다.
          </p>
      <p>공식 FIP은 protocol을 GossiPBFT라고 부르고 현재 go-f3 source의 package 이름은 <code>gpbft</code>입니다. 이 글은 그 consensus core의 weighted quorum, phases, bottom recovery와 partial-synchrony liveness를 소유합니다. EC proposal이 valid한지, certificate를 이어 동기화하는 법, finalized prefix가 fork choice를 제한하는 법은 각각 Expected Consensus와 F3 통합 글로 넘깁니다.</p>
      <GpbftBoundaryViz />
      <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6"><strong>핵심 아이디어:</strong> Best-effort broadcast 위에서도 safety를 얻으려면 vote domain과 historical committee를 검증하고, 서로 충돌하는 strong quorums가 honest voting power를 공유하도록 해야 합니다. Liveness는 별도로 message가 결국 도착하는 timing 조건을 요구합니다.</aside>
    </section>

    <section id="quorum-phase" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">01 · weighted quorum과 phase</p><h2 className="mt-2 text-2xl font-bold">Signer 수가 아니라 같은 power table에서 2/3를 엄격히 넘는 weight를 센다</h2></header>
      <p>
            Committee total power가 W=120이면 strong quorum은 80이 아니라 81 이상입니다. “2/3 이상”으로 구현해 80을 허용하면 strict
            threshold와 달라집니다. Signer를 중복 제거한 뒤 vote signature뿐 아니라 network name과 instance, round, phase,
            value, base, supplemental data가 일치하는지 확인하고 historical power table에서 weight를 읽습니다. 현재 head의 바뀐
            weight로 과거 votes를 다시 세면 certificate 의미가 달라집니다.
          </p>
      <ExplainedFormula question="서로 충돌하는 두 weighted strong quorum이 왜 honest power를 공유해야 하는가?" idea={<>두 signer 집합의 power 합에서 전체 W를 빼면 교집합 power의 하한을 얻습니다. 각 quorum이 2W/3보다 크면 교집합은 W/3보다 크므로 Byzantine power가 W/3 미만인 모델에서는 적어도 일부 honest power가 양쪽에 포함됩니다.</>} formula={String.raw`w(Q_1\cap Q_2)\ge q_1+q_2-W>\frac W3`}
      annotatedFormula={String.raw`w(Q_1\cap Q_2)\ge \underbrace{q_1+q_2-W>\frac W3}_{\text{허용 경계 판정}}`}
      operations={[
        { expression: String.raw`q_1+q_2-W>\frac W3`, annotation: ["계산한 양을 허용 경계와 비교해 상태를 판정합니다.","두 signer 집합의 power 합에서 전체 W를 빼면","교집합 power의 하한을 얻습니다."] },
      ]} terms={[{symbol:"W",name:"total committee power",description:"한 instance에 결속된 validated historical power table의 합입니다."},{symbol:"Q_1,Q_2",name:"signer sets",description:"서로 충돌할 수 있는 두 phase certificates의 distinct signers입니다."},{symbol:"q_1,q_2",name:"quorum power",description:"각 signer set의 validated power 합이며 각각 2W/3보다 커야 합니다."},{symbol:"w(Q_1\\cap Q_2)",name:"intersection power",description:"두 certificates에 모두 포함된 signer들의 historical power 합입니다."}]} assumptions={["Byzantine committee power는 W/3보다 작습니다.","두 certificate가 같은 network·instance·round/phase domain과 같은 historical table에서 검증됩니다.","Duplicate signer는 한 번만 세고 keys와 signatures를 검증합니다.","Honest participants가 protocol의 phase·justification voting rule을 지켜 conflicting votes를 만들지 않습니다."]} interpretation="W=120에서 81과 81의 교집합은 최소 42 power입니다. Byzantine power가 40 미만이면 교집합에 honest power가 반드시 있습니다. 다만 이 산술만으로 safety가 끝나는 것은 아니며 honest node의 phase lock 규칙이 함께 필요합니다." />
      <p>
            GPBFT는 QUALITY, CONVERGE, PREPARE, COMMIT, DECIDE 단계로 evidence를 좁힙니다. QUALITY는 input candidates의
            초기 지지를 모으고 CONVERGE는 round proposal과 justification을 공유합니다. PREPARE와 COMMIT은 strong quorum
            evidence를 만들어 같은 value로 안전하게 이동할 수 있게 하며 DECIDE는 검증 가능한 decision을 퍼뜨립니다. Phase 이름을 단순 시간표로 외우기보다
            “다음 vote를 허용하는 이전 evidence가 무엇인가”를 추적해야 replay와 equivocation을 잡을 수 있습니다.
          </p>
      <GpbftPhaseViz />
      <div id="paper-fip86-gpbft"><CitationBlock source="FIP-0086 — GossiPBFT Consensus" citeKey={1} href="https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0086.md"><p><strong>문제:</strong> Filecoin power-weighted committee가 leader 없이 EC-compatible chain prefix를 빠르게 결정합니다.</p><p><strong>기여:</strong> GossiPBFT input, weighted phases, best-effort broadcast와 partial-synchrony properties를 규정합니다.</p><p><strong>전제:</strong> Byzantine QAP가 1/3 미만이고 committee·base·network와 timing model이 instance에 고정됩니다.</p><p><strong>근거 범위:</strong> FIP revision c856d99의 GPBFT protocol specification과 명시된 properties입니다.</p><p><strong>말하지 않는 것:</strong> Current Go API, 고정 seconds, Gossipsub exactly-once delivery나 EC fork choice 전체를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="recovery" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">02 · bottom, timeout, rebroadcast</p><h2 className="mt-2 text-2xl font-bold">충돌 proposal에서 안전한 evidence가 없으면 임의 값을 고르지 않고 다음 round로 넘어간다</h2></header>
      <p>
            GPBFT의 value는 chain proposal이거나 bottom(⊥, 아직 특정 proposal을 안전하게 지지하지 않는 값)일 수 있습니다. Base는 chain
            prefix인데, 이전 instance에서 합의해 되돌리지 않기로 한 부분입니다. 서로 다른 proposal이 보였을 때 node는 단순히 local EC head를 고집하지
            않고 prepared·committed evidence와 candidate set을 따라 safe value 또는 bottom으로 이동합니다. Bottom은 실패나 빈
            chain을 즉시 결정한다는 뜻이 아니라 근거 없는 충돌 선택을 피하면서 다음 round의 convergence를 여는 protocol state입니다.
          </p>
      <p>
            Network partition 중에는 valid votes가 각자 2/3 초과에 닿지 못해 round가 진행되지 않을 수 있습니다. 이 정지는 liveness loss이지만
            conflicting decision이 없는 한 곧 safety failure는 아닙니다. Partial synchrony는 알 수 없는 시점 GST 이후 message
            delay에 어떤 상한이 생긴다고 가정합니다. 그 구간에서는 timeout 증가와 rebroadcast가 누락된 votes·justifications를 다시 전달해 진행을
            회복합니다. Gossipsub mesh에 publish했다는 log만으로 이 조건이 성립했다고 볼 수 없습니다.
          </p>
      <ExplainedFormula question="Timeout을 늘리면 언제 한 round의 message 교환을 담을 수 있는가?" idea={<>GST 뒤 one-way delay가 Delta 이하이고 한 phase가 r번의 연속 message-delivery step을 필요로 한다면 processing 여유 epsilon을 포함해 timeout을 그보다 크게 잡아야 합니다. 이는 liveness budget이지 safety quorum을 낮추는 식이 아닙니다.</>} formula={String.raw`T_{round}>r\Delta+\varepsilon`}
      annotatedFormula={String.raw`T_{round}>\underbrace{r\Delta+\varepsilon}_{\text{변화량 계산}}`}
      operations={[
        { expression: String.raw`r\Delta+\varepsilon`, annotation: ["인접한 level의 차이를 남겨 변화량을 계산합니다.","GST 뒤 one-way delay가 Delta 이하이고 한","phase가 r번의 연속 message-delivery","step을 필요로 한다면 processing 여유"] },
      ]} terms={[{symbol:"T_{round}",name:"round timeout",description:"현재 round에서 다음 recovery transition까지 기다리는 local budget입니다."},{symbol:"r",name:"delivery steps",description:"해당 phase path가 순서대로 요구하는 bounded message hops 수입니다."},{symbol:String.raw`\Delta`,name:"post-GST delay bound",description:"GST 이후 honest-to-honest one-way message 전달 상한입니다."},{symbol:String.raw`\varepsilon`,name:"processing slack",description:"Verification, scheduling과 local queue 지연에 둔 여유입니다."}]} assumptions={["GST 이후 honest peers 사이에 실제 bounded-delay path가 존재합니다.","Enough honest voting power가 online이고 messages와 signatures가 valid합니다.","Timeout과 rebroadcast는 bounded resource policy 아래 증가하며 stale domains를 거절합니다.","식은 progress 조건을 설명할 뿐 conflicting quorum safety proof나 고정 latency SLA가 아닙니다."]} interpretation="Partition 동안 Delta가 없으면 timeout이 커도 진행을 보장할 수 없습니다. Network가 회복된 뒤 T가 실제 phase path보다 작으면 계속 round를 넘길 수 있으므로 timeout/backoff와 rebroadcast 관측이 필요합니다." />
      <div id="paper-gof3-gpbft"><CitationBlock source="go-f3 v0.8.14 — gpbft.go" citeKey={2} type="code" href="https://github.com/filecoin-project/go-f3/blob/v0.8.14/gpbft/gpbft.go"><p><strong>문제:</strong> Out-of-order·late·invalid votes에서도 instance phase와 justifications를 안전하게 갱신합니다.</p><p><strong>기여:</strong> QUALITY부터 DECIDE까지의 state, candidates, bottom, timeout·rebroadcast와 decision 처리를 구현합니다.</p><p><strong>전제:</strong> go-f3 v0.8.14 commit 5f2c984, validated power table·signatures·supplemental data를 사용합니다.</p><p><strong>근거 범위:</strong> Pinned implementation의 local GPBFT instance transition과 test 범위입니다.</p><p><strong>말하지 않는 것:</strong> Network delivery, deployment manifest correctness나 Filecoin EC input validity를 자동 보장하지 않습니다.</p></CitationBlock></div>
      <div id="paper-gof3-quorum"><CitationBlock source="go-f3 v0.8.14 — quorum and message validation" citeKey={3} type="code" href="https://github.com/filecoin-project/go-f3/tree/v0.8.14/gpbft"><p><strong>문제:</strong> Duplicate senders, wrong vote domains와 insufficient historical power를 집계에서 제외합니다.</p><p><strong>기여:</strong> Power table lookup, quorum state, signature·phase·justification validation과 regression tests를 제공합니다.</p><p><strong>전제:</strong> v0.8.14 exact power entries, actor IDs, BLS keys와 network domain을 고정합니다.</p><p><strong>근거 범위:</strong> Pinned gpbft package의 weighted vote validation과 quorum aggregation입니다.</p><p><strong>말하지 않는 것:</strong> Participant economics, old power-table trust나 certificate sync 전체를 보장하지 않습니다.</p></CitationBlock></div>
    </section>

    <section id="release" className="space-y-6">
      <header><p className="text-sm font-semibold text-primary">03 · negative test와 release</p><h2 className="mt-2 text-2xl font-bold">Safety는 conflict 0으로, liveness는 GST 뒤 decision으로 따로 판정한다</h2></header>
      <p>
            Negative suite가 주입하는 vote는 signature만 올바르고 network, instance, round, phase, base, supplemental
            data가 어긋났거나 power table이 stale합니다. 모두 typed reject가 되어야 하고 local phase state를 바꾸지 않아야 합니다. 같은
            signer의 중복 message는 power를 두 번 더하지 않으며 80/120은 quorum이 아니고 81/120만 strong quorum입니다.
          </p>
      <p>
            Partition fixture에서는 Alice→Bob proposal A와 B를 양쪽에 다르게 보냅니다. Partition 중 conflict decision은 0이어야 하고
            회복 뒤 rebroadcast와 timeout을 통해 하나의 certificate로 수렴해야 합니다. Safety failure는 rollout 즉시 중단 사유이고
            liveness failure는 peer reachability와 timeout, broadcast health를 진단하되 threshold를 낮춰 숨기지 않습니다.
          </p>
      <h3 className="text-xl font-semibold">이 글만으로 풀어야 하는 10문제</h3><p>
            기초 6문제는 80/81 threshold와 five phases, vote domain, base·bottom, dissemination/decision 차이를 확인하는
            문항입니다. 심화 4문제는 quorum intersection과 domain negative suite, partition 회복과 conflicting-proposal
            recovery를 설계하게 합니다. 각 답은 safety 전제와 liveness 전제를 따로 적어야 합니다.
          </p>
    </section>
  </article>;
}
