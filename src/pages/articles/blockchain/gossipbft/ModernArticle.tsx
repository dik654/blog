import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import {
  GpbftBoundaryViz,
  GpbftFailureBoundaryViz,
  GpbftRecoveryPseudocodeViz,
  GpbftRequestTraceViz,
} from "./viz/ModernGpbftViz";

export default function ModernGossipBftArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">GossiPBFT · 전파와 결정의 경계</p>
          <h2 className="break-keep text-3xl font-bold tracking-tight">Gossip은 메시지를 퍼뜨리고, GPBFT는 투표권으로 결정합니다</h2>
        </header>

        <p className="text-lg leading-8 text-foreground/90">
          GossiPBFT의 핵심은 <strong>메시지를 받았다는 사실과 같은 값을 결정했다는 사실을 분리하는 것</strong>입니다.
          Gossip은 QUALITY·PREPARE·COMMIT 같은 메시지를 가능한 많은 참여자에게 전달합니다. GPBFT는 그중 유효한 메시지만 단계와 값별로
          모은 뒤, 같은 위원회 투표권의 정족수가 만든 근거를 다음 단계로 넘깁니다.
        </p>

        <p>
          투표권이 A 45, B 34, C 26, D 15로 합계 120인 위원회를 생각해 보겠습니다. A가 후보 체인 X를 보냈고 B도 같은 X를
          지지해도 합계는 79입니다. 이 글의 고정 규격에서 strong quorum은 <code>ceil(2×120÷3)=80</code>이므로 아직 부족합니다.
        </p>
        <p>
          D의 15가 더해져 94가 되면 해당 단계는 통과합니다. 다만 QUALITY의 94를 PREPARE나 COMMIT에 재사용하는 것은 아닙니다.
          각 단계에서 새로 서명된 표와 그 표를 허용한 이전 근거를 다시 확인해야 합니다.
        </p>

        <GpbftRequestTraceViz />

        <aside className="rounded-lg border border-primary/30 bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 붙잡을 한 문장:</strong> GossiPBFT는 작은 메시지를 여러 번 보내서 느린 것이 아니라, 같은 값을 말할 자격이 생겼다는
          근거를 단계별로 쌓아 한 번의 수신을 되돌릴 수 없는 결정과 구별합니다.
        </aside>

        <p>
          여기서 다음 질문이 생깁니다. “어차피 80 이상의 참여자가 X를 지지했다면 왜 한 번 더 투표할까요?” 한 노드가 본 80과 다른 노드가
          본 80이 같은 메시지 집합이라는 보장이 없기 때문입니다. 단계가 바뀔 때 이전 정족수의 집계 서명인 <em>justification</em>을 요구하면,
          늦거나 일부 빠진 메시지 속에서도 다음 표가 어디서 나왔는지 검증할 수 있습니다.
        </p>

        <GpbftBoundaryViz />

        <p>
          공식 FIP은 프로토콜을 <strong>GossiPBFT</strong>라고 부르고, 고정한 Go 구현은 <code>gpbft</code> 패키지에 이 상태 기계를
          둡니다. 이 글은 투표권 정족수, 단계 전이, bottom 복구, timeout과 rebroadcast까지만 다룹니다. 후보 체인이 Filecoin
          Expected Consensus 규칙에 맞는지, 결정 인증서가 EC fork choice를 어떻게 제한하는지는 뒤의 F3 통합 글에서 이어집니다.
        </p>
      </section>

      <section id="quorum-phase" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 숫자와 단계</p>
          <h2 className="break-keep text-2xl font-bold">120 중 79는 부족하고 80부터 strong quorum입니다</h2>
        </header>

        <p>
          먼저 사람 수를 세는 습관을 버려야 합니다. 각 참여자는 고정된 위원회 표에서 서로 다른 투표권을 가집니다. 같은 참여자가 같은
          라운드·단계에서 메시지를 두 번 보냈다고 투표권을 두 번 더하지 않습니다. 다른 인스턴스나 라운드, 다른 값의 표도 현재 합계에 섞지 않습니다.
        </p>

        <ExplainedFormula
          question="총 투표권 W에서 strong quorum의 최소값 Q는 얼마인가?"
          idea={<>FIP-0086과 go-f3 v0.8.15는 전체 투표권의 2/3를 올림한 값을 최소 문턱으로 사용합니다. W=120이면 2W/3가 정확히 80이므로 80부터 통과합니다.</>}
          formula={String.raw`Q=\left\lceil\frac{2W}{3}\right\rceil=\left\lceil\frac{2\times120}{3}\right\rceil=80`}
          annotatedFormula={String.raw`\underbrace{Q}_{\text{최소 strong quorum}}=\left\lceil\frac{2\times\underbrace{120}_{W}}{3}\right\rceil=\underbrace{80}_{\text{통과 시작점}}`}
          operations={[
            { expression: String.raw`2\times120=240`, annotation: ["전체 투표권 120을 2배 합니다.", "사람 수가 아니라 power 합입니다."] },
            { expression: String.raw`240\div3=80`, annotation: ["3으로 나누면 2/3 문턱이 80입니다.", "정확한 정수이므로 올림해도 80입니다."] },
            { expression: String.raw`79<80\le94`, annotation: ["A+B의 79는 실패합니다.", "A+B+D의 94는 통과합니다."] },
          ]}
          terms={[
            { symbol: "W", name: "위원회 전체 투표권", description: "한 인스턴스에 고정된 power table의 투표권 합입니다." },
            { symbol: "Q", name: "strong quorum 문턱", description: "같은 라운드·단계·값에 모여야 하는 최소 투표권입니다." },
            { symbol: String.raw`\lceil\;\rceil`, name: "올림", description: "2W/3가 정수가 아니면 다음 정수까지 올립니다." },
          ]}
          assumptions={[
            "투표권은 동일한 인스턴스의 검증된 power table에서 읽습니다.",
            "같은 sender의 중복 표는 한 번만 셉니다.",
            "서명 도메인과 instance·round·phase·value·supplemental data를 검증합니다.",
          ]}
          interpretation="이 규격에서는 ‘2/3를 엄격히 초과’가 아닙니다. W=120에서 80은 통과하고 79는 실패합니다. 다른 프로토콜의 >2/3 표기와 섞으면 경계값 test가 틀어집니다."
        />

        <p>
          그러면 정확히 80인 두 정족수가 서로 다른 값을 지지할 수 있지 않을까요? 두 집합의 투표권을 더한 뒤 전체 120을 빼면 최소 교집합이
          나옵니다. 교집합이 모두 Byzantine일 수 없게 만드는 전제와, 정직한 참여자가 충돌하는 표를 만들지 않는 단계 규칙을 함께 써야 합니다.
        </p>

        <ExplainedFormula
          question="각각 80인 두 정족수는 최소 얼마의 투표권을 공유하는가?"
          idea={<>두 정족수의 합에서 전체 위원회 투표권을 빼면 겹침의 하한이 남습니다. Byzantine 투표권이 W/3보다 작다면 40의 교집합에는 정직한 투표권이 반드시 포함됩니다.</>}
          formula={String.raw`w(Q_1\cap Q_2)\ge q_1+q_2-W=80+80-120=40`}
          annotatedFormula={String.raw`\underbrace{w(Q_1\cap Q_2)}_{\text{공유 투표권}}\ge\underbrace{80+80}_{\text{두 정족수}}-\underbrace{120}_{\text{전체}}=\underbrace{40}_{W/3}`}
          operations={[
            { expression: String.raw`80+80=160`, annotation: ["두 signer 집합의 power를 더합니다.", "겹친 참여자는 이 합에 두 번 들어 있습니다."] },
            { expression: String.raw`160-120=40`, annotation: ["전체가 가질 수 있는 120을 빼면", "두 집합이 반드시 공유하는 최소 power가 남습니다."] },
          ]}
          terms={[
            { symbol: String.raw`Q_1,Q_2`, name: "두 signer 집합", description: "같은 위원회에서 서로 충돌할 수 있는 두 정족수입니다." },
            { symbol: String.raw`q_1,q_2`, name: "각 집합의 투표권", description: "이 사례에서는 각각 최소 문턱인 80입니다." },
            { symbol: String.raw`w(Q_1\cap Q_2)`, name: "교집합 투표권", description: "두 집합에 모두 속한 signer들의 power 합입니다." },
          ]}
          assumptions={[
            "Byzantine 투표권은 W/3보다 작습니다.",
            "두 정족수는 같은 위원회와 동일한 서명 도메인에서 검증합니다.",
            "정직한 참여자는 프로토콜이 금지한 충돌 표를 만들지 않습니다.",
          ]}
          interpretation="교집합 산술만으로 합의 안전성이 완성되지는 않습니다. 최소 40의 겹침에 정직한 투표권이 들어 있고, 그 참여자가 단계 규칙 때문에 양쪽에 충돌 서명하지 않는다는 조건이 함께 충돌 인증서를 막습니다."
        />

        <h3 className="text-xl font-semibold">다섯 이름은 한 줄로 늘어선 다섯 번의 투표가 아닙니다</h3>
        <p>
          round 0에서는 <strong>QUALITY → PREPARE → COMMIT</strong>으로 진행합니다. QUALITY는 입력 체인의 어느 접두사까지 충분히
          지지받는지 찾아 후보 집합을 만듭니다.
        </p>
        <p>
          round 1부터는 QUALITY 대신 <strong>CONVERGE</strong>가 나오고, 정당한 후보 가운데 투표권으로 보정한 ticket이 가장 좋은
          제안을 골라 흩어진 시각을 좁힙니다. <strong>DECIDE</strong>는 round loop 바깥에서
          같은 값의 DECIDE strong quorum을 모아 반환할 인증서를 만듭니다.
        </p>

        <div id="paper-fip86-gpbft">
          <CitationBlock source="FIP-0086 — GossiPBFT Consensus" citeKey={1} href="https://github.com/filecoin-project/FIPs/blob/c856d99b126cb52a0436c4838da55ec84495cfa7/FIPS/fip-0086.md">
            <p><strong>문제:</strong> Filecoin의 투표권 가중 위원회가 서로 다른 EC 체인 입력에서 하나의 영구 결정을 만들어야 합니다.</p>
            <p><strong>기여:</strong> ceil(2W/3) strong quorum, QUALITY·CONVERGE·PREPARE·COMMIT·DECIDE, justification과 rebroadcast 절차를 정의합니다.</p>
            <p><strong>전제:</strong> Byzantine QAP가 1/3 미만이고 위원회·base chain·network와 부분 동기 timing model이 인스턴스에 고정됩니다.</p>
            <p><strong>근거 범위:</strong> revision c856d99의 GPBFT 규격과 명시된 안전성·진행성 속성입니다.</p>
            <p><strong>말하지 않는 것:</strong> 고정된 실제 지연 시간, Gossip의 exactly-once 전달, EC 후보 유효성 전체를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="recovery" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 막힌 round의 복구</p>
          <h2 className="break-keep text-2xl font-bold">후보 근거가 부족하면 문턱을 낮추지 않고 bottom으로 다음 round를 엽니다</h2>
        </header>

        <p>
          <strong>bottom(⊥)</strong>은 “빈 체인을 최종 결정했다”는 뜻이 아닙니다. PREPARE 단계에서 현재 proposal을 계속 지지할
          strong quorum이 없거나 더는 가능하지 않다고 판단하면, 노드는 COMMIT 단계에서 “이번 round에는 특정 후보를 결정하지 않겠다”는
          bottom에 표를 줍니다. COMMIT(bottom)이 strong quorum에 도달하면 기존 proposal을 버리지 않은 채 다음 round로 넘어갑니다.
        </p>

        <GpbftRecoveryPseudocodeViz />

        <p>
          왜 그냥 가장 많이 보인 후보를 고르지 않을까요? 네트워크가 갈린 동안 내 화면에서 가장 많아 보인 후보와 다른 노드의 화면이 다를 수
          있기 때문입니다. 다음 round의 CONVERGE는 임의 후보가 아니라 candidate set에 있거나 이전 round의 결정 가능성을 증명하는
          justification을 가진 후보만 비교합니다. 그래서 진행을 다시 시도하면서도 이전에 생겼을지 모를 안전한 근거를 덮지 않습니다.
        </p>

        <ExplainedFormula
          question="FIP의 round timeout은 왜 round가 늘수록 길어지는가?"
          idea={<>부분 동기 모델에서는 알 수 없는 GST 뒤에야 정직한 노드 사이의 전달 지연이 Δ 안으로 들어옵니다. 앞 round가 너무 짧았다면 backoff 계수 b를 곱해 검증과 왕복이 들어갈 시간을 넓힙니다.</>}
          formula={String.raw`T_r=2\Delta\,b^r`}
          annotatedFormula={String.raw`\underbrace{T_r}_{\text{round r의 대기 예산}}=\underbrace{2\Delta}_{\text{기본 왕복 여유}}\times\underbrace{b^r}_{\text{round별 backoff}}`}
          operations={[
            { expression: String.raw`2\Delta`, annotation: ["규격 의사코드의 초기 timeout입니다.", "Δ는 GST 뒤 one-way delay 상한입니다."] },
            { expression: String.raw`b^r`, annotation: ["round가 늘 때마다 대기 예산을 키웁니다.", "b는 1보다 큰 backoff 계수입니다."] },
          ]}
          terms={[
            { symbol: String.raw`T_r`, name: "round timeout", description: "round r에서 phase 진행을 기다리는 설명용 대기 예산입니다." },
            { symbol: String.raw`\Delta`, name: "GST 뒤 전달 상한", description: "부분 동기 가정이 성립한 뒤 정직한 노드 사이의 one-way delay 상한입니다." },
            { symbol: "b", name: "backoff 계수", description: "round가 늘 때 timeout을 확대하는 1보다 큰 계수입니다." },
            { symbol: "r", name: "round 번호", description: "0부터 시작하는 현재 합의 round입니다." },
          ]}
          assumptions={[
            "GST 뒤 정직한 참여자 사이에 bounded-delay 경로가 생깁니다.",
            "충분한 정직한 투표권이 온라인이고 유효한 메시지를 다시 보냅니다.",
            "실제 구현의 timer와 scheduling 비용은 설정·환경에 따라 달라집니다.",
          ]}
          interpretation="Timeout은 안전성 문턱을 바꾸지 않습니다. partition이 계속되면 아무리 기다려도 종료를 보장할 수 없고, 네트워크가 회복된 뒤에는 더 긴 timeout과 rebroadcast가 누락된 근거를 전달할 시간을 만듭니다."
        />

        <p>
          Rebroadcast도 모든 과거 메시지를 무한히 뿌리는 동작이 아닙니다. 현재 단계가 진전되지 않을 때 현재·이전 round에서 다음 근거를
          복원하는 데 필요한 QUALITY, CONVERGE, PREPARE, COMMIT 또는 DECIDE 메시지를 다시 보냅니다. 로컬 publish 성공 로그는
          상대 수신 증거가 아니므로, 단계 진행과 rebroadcast 횟수를 함께 관찰해야 합니다.
        </p>

        <div id="paper-gof3-gpbft">
          <CitationBlock source="go-f3 v0.8.15 — gpbft.go" citeKey={2} type="code" href="https://github.com/filecoin-project/go-f3/blob/v0.8.15/gpbft/gpbft.go">
            <p><strong>문제:</strong> 지연·중복·순서 뒤바뀜이 있는 메시지에서도 단계와 round를 안전하게 갱신해야 합니다.</p>
            <p><strong>기여:</strong> QUALITY/CONVERGE 선택, PREPARE의 bottom 분기, COMMIT·DECIDE 전이, timeout과 선택적 rebroadcast를 구현합니다.</p>
            <p><strong>전제:</strong> go-f3 v0.8.15 commit a1f286d의 검증된 power table·서명·supplemental data를 사용합니다.</p>
            <p><strong>근거 범위:</strong> 고정 구현의 로컬 GPBFT 상태 전이와 quorumState 판정입니다.</p>
            <p><strong>말하지 않는 것:</strong> 네트워크 전달, 배포 설정, Filecoin EC proposal의 유효성을 자동 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-gof3-quorum">
          <CitationBlock source="go-f3 v0.8.15 — validator.go and quorumState" citeKey={3} type="code" href="https://github.com/filecoin-project/go-f3/tree/v0.8.15/gpbft">
            <p><strong>문제:</strong> 잘못된 도메인·단계·justification과 부족한 투표권이 다음 상태를 열지 못하게 해야 합니다.</p>
            <p><strong>기여:</strong> network name을 포함한 서명 검증, phase별 제약, justification 검증, ceil(2W/3) 집계를 제공합니다.</p>
            <p><strong>전제:</strong> v0.8.15의 정확한 committee, actor ID, 공개키, network name과 power table을 고정합니다.</p>
            <p><strong>근거 범위:</strong> 고정 패키지의 메시지 검증과 정족수 집계에 한정합니다.</p>
            <p><strong>말하지 않는 것:</strong> 오래된 power table의 신뢰 근거, 참여자 경제성, 인증서 동기화 전체를 보장하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 실패를 넣고 경계를 확인하기</p>
          <h2 className="break-keep text-2xl font-bold">충돌 결정은 0이어야 하고, 네트워크 회복 뒤에는 결국 하나를 결정해야 합니다</h2>
        </header>

        <p>
          안전성 test와 진행성 test를 하나의 “성공”으로 합치면 원인을 놓칩니다. partition 중 결정이 멈추는 것은 진행성 문제일 수 있지만,
          양쪽에서 서로 다른 인증서가 나온다면 즉시 안전성 실패입니다. 반대로 충돌 인증서는 없지만 네트워크가 회복된 뒤에도 끝없이 round만
          바뀐다면 안전성은 지켰어도 진행성은 실패했습니다.
        </p>

        <GpbftFailureBoundaryViz />

        <h3 className="text-xl font-semibold">구현 검증은 경계값부터 시작합니다</h3>
        <p>
          총 투표권 120 시험에서 79는 실패하고 80은 통과해야 합니다. 같은 sender를 두 번 넣어도 합계가 늘면 안 됩니다. network name,
          instance, round, phase, value, supplemental data, justification이 어긋난 메시지는 명시적인 오류로 거절되어야 하며 로컬
          상태를 바꾸지 않아야 합니다.
        </p>
        <p>
          그다음 두 network partition에 서로 다른 후보를 보내고, partition 중 충돌 decision 0과 회복 뒤 단일 certificate를 각각
          확인합니다.
        </p>

        <h3 className="text-xl font-semibold">이 글을 읽고 바로 답할 수 있어야 하는 질문</h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>Gossip publish 성공이 왜 유효한 투표나 결정의 증거가 아닌가?</li>
          <li>W=120에서 79와 80의 판정이 왜 갈리며, 두 80 정족수는 최소 얼마를 공유하는가?</li>
          <li>round 0의 QUALITY와 이후 round의 CONVERGE는 어떤 자리를 나눠 맡는가?</li>
          <li>PREPARE 정족수, COMMIT 정족수, DECIDE 정족수는 왜 서로 더할 수 없는가?</li>
          <li>bottom은 무엇을 결정하지 않았다는 표이며, 왜 빈 체인 결정과 다른가?</li>
          <li>timeout과 rebroadcast가 안전성 threshold를 낮추지 않고 진행성을 돕는 이유는 무엇인가?</li>
        </ul>

        <p className="rounded-lg border border-border bg-muted/30 p-5 text-sm leading-7">
          <strong>마지막 경계:</strong> GPBFT가 decision과 certificate를 반환했다는 말은 이 consensus instance의 출력이 생겼다는 뜻입니다.
          그 체인이 애플리케이션에 반영됐는지, 다음 위원회를 어떤 과거 상태에서 읽는지, EC가 확정 접두사 밖의 분기를 거부하는지는 F3 통합
          계층에서 다시 확인해야 합니다.
        </p>
      </section>
    </article>
  );
}
