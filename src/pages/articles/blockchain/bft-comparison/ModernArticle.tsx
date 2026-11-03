import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { AutobahnLaneCutViz, BFTAxisTableViz, BFTSameTraceViz } from "./viz/ModernBFTComparisonViz";

function Note({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

export default function ModernBFTComparisonArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">BFT 비교</p>
          <h2 className="text-3xl font-bold tracking-tight">같은 요청과 같은 장애를 겪으면 세 프로토콜은 무엇을 넘길까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          앞선 글에서 PBFT의 prepared certificate, HotStuff의 QC 사슬과 pacemaker를 따로 확인했습니다. 이제 Alice의 요청 T1과 주 노드 정지 한 번을 같은 조건에 놓습니다. 비교할 것은 이름이나 논문의 최고 TPS가 아니라, <strong>데이터가 들어오는 위치, 커밋 증거, 장애 뒤 새 주 노드에게 넘기는 상태</strong>입니다.
        </p>
        <aside className="border-l-2 border-primary bg-primary/5 p-5 text-sm leading-6">
          <strong>먼저 기억할 한 문장:</strong> 같은 주 노드 장애가 나도 PBFT는 순번별 prepared 증거, HotStuff는 가장 높은 QC의 가지, Autobahn은 계속 자라는 lane의 tip과 cut 증거를 다음 주 노드에게 넘깁니다.
        </aside>

        <BFTSameTraceViz />

        <div className="grid gap-4 md:grid-cols-2">
          <Note title="같게 고정한 조건">
            복제본 A·B·C·D 네 대, 최대 Byzantine 한 대, 인증된 채널, 같은 요청 T1과 같은 주 노드 장애를 사용합니다. 따라서 n=4, f=1이고 2f+1 정족수는 세 대입니다.
          </Note>
          <Note title="먼저 확인할 질문">
            인증서 하나를 발견했을 때 무엇이 확정됐고 무엇이 아직 남았는지 묻습니다. 데이터 가용성, 순서 합의, 커밋, 실행과 클라이언트 응답은 같은 사건이 아닙니다.
          </Note>
        </div>

        <p>
          세 방식은 모두 정족수 교집합과 정상 복제본의 투표 규칙으로 충돌하는 결정을 막습니다. 그러나 같은 증거를 운반하지는 않습니다.
        </p>
        <p>
          PBFT는 순번별 prepared 상태를 view change에 싣고, HotStuff는 안전한 가지를 QC 사슬로 이어 갑니다. Autobahn은 데이터를 복제본별 lane에서 먼저 전파하고 합의는 각 lane의 어느 지점까지 포함할지 정합니다. 이 차이가 정상 구간의 지연뿐 아니라 장애가 끝난 뒤 밀린 요청을 처리하는 방식도 바꿉니다.
        </p>
      </section>

      <section id="pbft" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">01 · PBFT</p>
          <h2 className="mt-2 text-2xl font-bold">순번별 prepared 증거를 새 view가 이어받습니다</h2>
        </header>
        <p>
          주 노드는 T1에 view 7과 순번 42를 붙여 PRE-PREPARE를 보냅니다. Backup은 그 조합을 받아들이면 PREPARE를 전파합니다. 한 복제본이 PRE-PREPARE와 서로 다른 backup의 일치하는 PREPARE 2f개를 모으면 prepared 상태가 됩니다.
        </p>
        <p>
          이어 같은 view·순번·요청 해시에 대한 COMMIT 2f+1개를 받으면 locally committed가 됩니다. n=4, f=1에서는 PREPARE 두 개와 COMMIT 세 개가 각각의 조건입니다.
        </p>
        <p>
          장애가 나면 timeout 자체가 이전 상태를 지우지 않습니다. 각 복제본은 stable checkpoint와 그 이후 순번의 prepared certificate를 VIEW-CHANGE에 담습니다. 새 주 노드는 VIEW-CHANGE 2f+1개에서 안전한 요청 집합을 만들고 NEW-VIEW로 증명합니다. 따라서 새 view가 같은 순번 42에 다른 요청을 넣으려면 이전 prepared 증거와 충돌하게 됩니다.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Note title="PBFT가 직접 보존하는 것">View·순번·요청 해시별 prepared 상태와 stable checkpoint입니다.</Note>
          <Note title="별도로 복구할 것">요청 본문, checkpoint 이후 실행 로그, 클라이언트 중복 요청 판정과 응답입니다.</Note>
        </div>
        <div id="paper-pbft-comparison">
          <CitationBlock source="Castro·Liskov — Practical Byzantine Fault Tolerance" citeKey={1} href="https://pmg.csail.mit.edu/papers/osdi99.pdf">
            <p><strong>문제:</strong> 일부 복제본이 임의로 잘못 행동해도 복제 상태 기계가 같은 명령 순서를 실행하게 합니다.</p>
            <p><strong>이 글에서 확인한 부분:</strong> §4의 PRE-PREPARE·PREPARE·COMMIT과 §4.4의 checkpoint·view change입니다.</p>
            <p><strong>경계:</strong> 1999년 논문의 고정 membership·인증 방식·NFS 평가입니다. 현대 WAN이나 다른 서명 구현의 성능을 뜻하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="hotstuff" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">02 · HotStuff</p>
          <h2 className="mt-2 text-2xl font-bold">안전한 가지를 QC 사슬로 운반합니다</h2>
        </header>
        <p>
          HotStuff의 제안은 새 블록과 부모, 부모를 정당화하는 QC를 함께 운반합니다. 복제본은 제안이 현재 lock의 가지를 연장하거나, 더 높은 view의 유효한 QC가 다른 가지를 정당화할 때만 투표합니다. n=4, f=1에서는 같은 블록과 view를 가리키는 표 세 개가 QC가 됩니다. 하지만 QC 하나는 그 블록이 인증됐다는 뜻이지 곧바로 커밋됐다는 뜻이 아닙니다.
        </p>
        <p>
          Chained HotStuff에서는 B11이 QC10을, B12가 QC11을, B13이 QC12를 들고 바로 앞 부모를 이어야 B10을 커밋할 수 있습니다. 주 노드가 멈추면 pacemaker가 view를 전진시키고 새 주 노드는 NEW-VIEW 2f+1개 안에서 가장 높은 유효 QC를 찾습니다. 이 QC가 가리키는 가지를 잇는 제안을 만든 뒤에도 각 복제본은 자신의 lock과 safe-vote 조건을 다시 검사합니다.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Note title="HotStuff가 단순해진 지점">정상 경로와 주 노드 교체가 모두 QC와 블록 가지라는 같은 형태의 증거를 사용합니다.</Note>
          <Note title="여전히 남는 비용">Payload 전파, 표·QC 검증, timeout과 pacemaker 동기화, 빠진 블록과 실행 상태 복구는 별도입니다.</Note>
        </div>
        <div id="paper-hotstuff-comparison">
          <CitationBlock source="Yin et al. — HotStuff v6" citeKey={2} href="https://arxiv.org/abs/1803.05069v6">
            <p><strong>문제:</strong> Partial synchrony에서 주 노드 교체를 단순하게 유지하면서 실제 메시지 지연에 반응하는 BFT를 구성합니다.</p>
            <p><strong>이 글에서 확인한 부분:</strong> Basic HotStuff의 safeNode·lock과 Chained HotStuff의 one·two·three-chain, pacemaker 분리입니다.</p>
            <p><strong>경계:</strong> 논문의 linear communication은 해당 메시지·인증자 모델의 주장입니다. Payload bytes와 모든 변형의 end-to-end 비용이 언제나 O(n)이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="autobahn" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">03 · Autobahn</p>
          <h2 className="mt-2 text-2xl font-bold">데이터는 lane에서 전파하고, 합의는 lane tip의 cut을 정합니다</h2>
        </header>

        <AutobahnLaneCutViz />

        <p>
          각 복제본은 자기 lane에서 car라고 부르는 proposal·vote 절차를 독립적으로 진행합니다. 한 car에 f+1표가 모이면 Proof of Availability(PoA)가 됩니다. f+1명 가운데 적어도 한 명은 정상이므로 필요할 때 데이터를 전달할 수 있습니다. 복제본은 같은 lane의 이전 위치를 이미 받고 투표한 경우에만 다음 위치에 투표합니다. 그래서 인증된 tip 하나가 그 앞 history의 가용성 근거가 됩니다.
        </p>
        <p>
          합의 주 노드는 각 lane에서 자신이 본 최신 certified tip을 모아 cut을 제안합니다. Slow path에서는 Prepare vote 2f+1개로 PrepareQC를 만들고, Confirm-Ack 2f+1개로 CommitQC를 만듭니다.
        </p>
        <p>
          Gracious interval의 fast path는 모든 n개의 Prepare vote를 받으면 Confirm 단계를 생략할 수 있습니다. CommitQC를 받은 복제본은 빠진 lane history를 동기화한 뒤 같은 규칙으로 lane들을 섞어 전체 순서를 만듭니다.
        </p>
        <p>
          주 노드가 멈춰도 lane의 data 전파는 계속될 수 있습니다. Timeout 2f+1개로 만든 TC에는 각 복제본의 highQC와 highProp이 들어갑니다. 다음 주 노드는 TC에서 가장 높은 PrepareQC와 f+1회 나타난 proposal을 비교해 이전 view에서 커밋됐을 수 있는 cut을 보존합니다.
        </p>
        <p>
          따라서 장애가 끝난 뒤 합의는 길어진 각 lane 전체를 다시 제안하지 않고 최신 tip을 가리킬 수 있습니다. 다만 누락된 payload를 실제로 받는 SYNC 비용은 사라지지 않습니다.
        </p>
        <div id="paper-autobahn">
          <CitationBlock source="Giridharan et al. — Autobahn v4" citeKey={3} href="https://arxiv.org/abs/2401.10369v4">
            <p><strong>문제:</strong> 정상 구간의 낮은 지연과 network blip 뒤 backlog 회복을 함께 다룹니다.</p>
            <p><strong>이 글에서 확인한 부분:</strong> §5.1의 car·PoA, §5.2의 lane cut·Prepare/Confirm, §5.3의 TC와 winning proposal 선택입니다.</p>
            <p><strong>경계:</strong> 논문의 latency·throughput·hangover 결과는 논문 구현과 배포 조건에 한정됩니다. 다른 장비에서도 같은 배수가 유지된다고 일반화하지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="comparison" className="space-y-6">
        <header>
          <p className="text-sm font-semibold text-primary">04 · 비교</p>
          <h2 className="mt-2 text-2xl font-bold">안전성은 먼저 통과하고, 성능은 같은 조건에서 나눠 잽니다</h2>
        </header>

        <ExplainedFormula
          question="Equal-weight BFT에서 두 commit quorum이 적어도 한 정상 복제본을 공유하려면 교집합은 얼마나 커야 할까요?"
          idea={<>두 집합의 크기를 더해 전체 복제본 수를 넘는 만큼은 반드시 겹칩니다. n=3f+1, q=2f+1이면 교집합은 적어도 f+1명입니다. Byzantine 복제본은 최대 f명이므로 정상 복제본이 한 명 이상 포함됩니다.</>}
          formula={String.raw`\begin{aligned}|Q_1\cap Q_2|&\ge 2q-n\\&=f+1>f\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}\underbrace{|Q_1\cap Q_2|}_{\text{두 quorum의 공통 signer}}&\ge \underbrace{2q-n}_{\text{전체 수를 넘는 중복분}}\\&=\underbrace{f+1>f}_{\text{Byzantine 최대 수보다 큼}}\end{aligned}`}
          operations={[
            { expression: String.raw`2q-n`, annotation: ["두 quorum의 크기를 더한 뒤", "전체 복제본 수를 빼면 최소 교집합입니다.", "n=4, q=3이면 2·3−4=2입니다."] },
            { expression: String.raw`f+1>f`, annotation: ["교집합 두 명 가운데 Byzantine은", "최대 한 명이므로 정상 복제본이 남습니다."] },
          ]}
          terms={[
            { symbol: "n", name: "전체 복제본 수", description: "같은 membership snapshot에 속한 equal-weight 복제본 수입니다." },
            { symbol: "f", name: "장애 한도", description: "프로토콜이 허용한다고 가정한 최대 Byzantine 복제본 수입니다." },
            { symbol: "q", name: "정족수 크기", description: "한 certificate에 필요한 서로 다른 유효 signer 수이며 여기서는 2f+1입니다." },
            { symbol: "Q_1,Q_2", name: "두 signer 집합", description: "충돌할 수 있는 두 certificate의 signer 집합입니다." },
          ]}
          assumptions={[
            "n=3f+1인 고정 equal-weight membership입니다.",
            "Signer identity·phase·view·value와 signature를 검증하고 중복 signer는 한 번만 셉니다.",
            "정상 복제본이 각 프로토콜의 lock·vote 규칙을 지킵니다.",
            "Stake-weighted quorum에는 signer 수가 아니라 해당 시점의 voting weight를 사용합니다.",
          ]}
          interpretation="n=4, f=1, q=3이면 두 quorum은 최소 두 명을 공유하고 그중 한 명 이상은 정상입니다. q를 2로 낮추면 {A,B}와 {C,D}처럼 겹치지 않는 certificate가 가능하므로 이 논리를 사용할 수 없습니다. 교집합 산술만으로는 부족하며 정상 복제본의 투표 제한이 함께 필요합니다."
        />

        <BFTAxisTableViz />

        <div className="grid gap-4 md:grid-cols-2">
          <Note title="안전성 통과 조건">
            Equivocation·omission·partition·재시작을 넣어도 충돌하는 commit은 0이어야 합니다. 한 번이라도 충돌하면 평균 처리량이 높아도 후보에서 제외합니다.
          </Note>
          <Note title="그 뒤 비교할 결과">
            정상 구간 latency, blip 중 backlog, 회복 시간, 유효 payload throughput, phase별 network bytes, 서명 검증 CPU와 동기화 bytes를 따로 기록합니다.
          </Note>
        </div>

        <p>
          같은 비교를 재현하려면 membership과 fault 위치, network delay trace를 먼저 고정해야 합니다. Payload 크기와 batch, offered load, 암호 구현, machine과 region, client 측정 지점도 같아야 합니다.
        </p>
        <p>
          예를 들어 정상 구간 100ms·회복 8초인 후보와 정상 구간 140ms·회복 0.8초인 후보는 한 숫자로 순위를 정할 수 없습니다. 실제 blip 빈도, latency SLO와 backlog 한도가 선택을 바꿉니다.
        </p>
        <p>
          따라서 이 글의 결론은 “Autobahn이 가장 새로우니 선택한다”가 아닙니다. PBFT는 순번별 prepared 상태, HotStuff는 QC 가지, Autobahn은 lane의 데이터와 cut을 중심으로 장애 상태를 소유합니다. 구현 후보를 고를 때는 우리 시스템이 어느 상태를 이미 갖고 있고, 장애 뒤 어떤 증거와 데이터를 복구할 수 있는지부터 확인해야 합니다.
        </p>
      </section>
    </article>
  );
}
