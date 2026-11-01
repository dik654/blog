import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation-block";
import { NarwhalBatchTraceViz, NarwhalFailureViz, NarwhalStateViz } from "./viz/ModernNarwhalViz";

function BoundaryNote({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border bg-card p-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <div className="mt-2 text-sm leading-6 text-muted-foreground">{children}</div>
    </div>
  );
}

function NarwhalSketch() {
  return (
    <div className="not-prose overflow-x-auto border border-border bg-[#111318] p-4 text-[12px] leading-6 text-[#e7eaf0]">
      <pre><code>{`// Worker가 원문 바이트를 저장하고 식별자를 만듭니다.
digest = hash(batch)
store[(digest, worker_id)] = batch

// 동료 workers의 저장 확인 power가 정족수에 닿을 때까지 기다립니다.
if ack_power >= quorum:
    notify_primary(digest, worker_id)

// Primary는 원문 대신 위치와 이전 라운드 인증서를 묶습니다.
header = sign(epoch, round, author, payload, parents)

// 부모나 원문이 없으면 투표하지 않고 가져온 뒤 다시 처리합니다.
if missing_parents(header) or missing_payload(header):
    suspend_and_fetch(header)

// 같은 작성자·라운드의 다른 헤더에 이미 투표했다면 거부합니다.
if voted_for_different_digest(author, round):
    reject_second_vote()

vote(header)`}</code></pre>
    </div>
  );
}

export default function ModernNarwhalArticle() {
  return (
    <article className="space-y-14">
      <section id="overview" className="space-y-6">
        <header className="space-y-3">
          <p className="text-sm font-semibold text-primary">Narwhal 상세</p>
          <h2 className="text-3xl font-bold tracking-tight">거래 원문을 모두 다시 보내지 않고도 가용성을 어떻게 증명할까요?</h2>
        </header>
        <p className="text-lg leading-8 text-foreground/90">
          <a className="font-semibold text-primary underline-offset-4 hover:underline" href="/cs/blockchain/dag-consensus#narwhal">앞선 DAG 합의 지도</a>에서는 거래 T1이 인증·정렬·실행되는 전체 경로를 봤습니다. 이 글은 그중 데이터 인증 구간만 확대합니다. 네 검증자 A·B·C·D와 배치 d7 하나를 따라가며 worker 저장 확인과 primary 투표가 왜 별도 단계인지 확인합니다.
        </p>

        <NarwhalBatchTraceViz />

        <p>
          Narwhal은 거래 원문이 흐르는 경로와 합의가 참조하는 작은 메타데이터 경로를 나눕니다. Workers는 배치 바이트를 저장하고 전파합니다. Primaries는 <code>(batch digest, worker id)</code>와 이전 라운드 인증서들을 헤더에 넣습니다. 충분한 검증자가 같은 헤더를 확인하고 투표하면 그 헤더가 인증서가 됩니다.
        </p>
        <p>
          이 인증서는 “d7을 나중에 다시 가져올 정상 보관자가 남아 있다”는 근거입니다. d7이 몇 번째로 실행될지, 거래가 유효한지, Bob의 잔액이 바뀌었는지는 말하지 않습니다. 순서는 Bullshark 같은 별도 합의가 정하고, 상태 변경은 애플리케이션 실행기가 수행합니다.
        </p>
      </section>

      <section id="worker-header" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">01 · 바이트와 헤더</p>
          <h2 className="text-2xl font-bold">Worker는 d7을 보관하고, primary는 d7의 위치를 기록합니다</h2>
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          <BoundaryNote title="Worker 저장 경로">
            <p>T1을 포함한 배치 d7을 해시하고 저장합니다. 같은 번호의 동료 workers에게 원문 바이트를 보낸 뒤 저장 확인 power가 정족수에 닿으면 local primary에 <code>(d7, worker 0)</code>을 전달합니다.</p>
          </BoundaryNote>
          <BoundaryNote title="Primary 메타데이터 경로">
            <p>Epoch·round·author·payload 위치·직전 라운드 parents를 헤더 H8에 넣고 서명합니다. H8에는 d7 원문이 아니라 d7을 찾고 검증할 식별 정보가 들어갑니다.</p>
          </BoundaryNote>
        </div>

        <p>
          보관된 구현의 <code>Processor</code>는 배치 원문을 해시해 저장한 뒤 digest를 내보냅니다. <code>QuorumWaiter</code>는 동료 worker들의 응답 power와 자기 power를 합산해 committee 정족수에 도달한 뒤에만 그 배치를 다음 경로로 넘깁니다. 따라서 primary가 digest를 받았다는 사건은 단순한 “로컬 파일 생성”보다 강하지만, 아직 primary 헤더 투표 정족수는 아닙니다.
        </p>

        <NarwhalSketch />

        <div id="paper-narwhal-worker-e67">
          <CitationBlock
            source="MystenLabs/narwhal commit e67f915 — worker quorum_waiter.rs"
            citeKey={1}
            type="code"
            href="https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/worker/src/quorum_waiter.rs"
          >
            <p><strong>문제:</strong> 한 worker가 만든 배치를 다른 검증자 workers에게 보관시키고, 충분한 저장 확인이 오기 전에는 primary 경로로 넘기지 않아야 합니다.</p>
            <p><strong>구현:</strong> 배치를 broadcast한 뒤 각 응답자의 stake를 합산하고 <code>committee.quorum_threshold()</code>에 도달하면 배치를 다음 채널로 전달합니다.</p>
            <p><strong>근거 범위:</strong> 보관 종료된 저장소의 고정 커밋 e67f915에 있는 worker 전파·저장 확인 경로입니다.</p>
            <p><strong>말하지 않는 것:</strong> 이 저장 확인이 primary certificate, 전체 순서, 영구 보관을 뜻하지는 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="certificate-dag" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">02 · 투표와 인증서</p>
          <h2 className="text-2xl font-bold">같은 H8에 서로 다른 유효 투표가 모여야 DAG vertex가 됩니다</h2>
        </header>

        <p>
          H8을 받은 primary는 작성자 서명만 확인하지 않습니다. 올바른 epoch인지, author가 committee 구성원인지, payload의 worker id가 유효한지, parents가 직전 라운드에서 정족수 power를 이루는지, 그리고 자기 worker가 <code>(d7, worker 0)</code>을 실제로 보관하는지 확인합니다. 부모나 payload가 빠졌으면 헤더 처리를 잠시 멈추고 자료를 가져옵니다.
        </p>

        <ExplainedFormula
          question="2f+1명의 인증서 서명자 가운데 정상 보관자는 최소 몇 명일까요?"
          idea={<>Byzantine 검증자가 최대 f명이라면, 정족수 q=2f+1에서 그 f명을 모두 빼도 정상 검증자 f+1명이 남습니다.</>}
          formula={String.raw`q-f=(2f+1)-f=f+1`}
          annotatedFormula={String.raw`\underbrace{q}_{\text{전체 signer power}}-\underbrace{f}_{\text{최대 Byzantine power}}=\underbrace{f+1}_{\text{최소 정상 power}}`}
          operations={[
            { expression: String.raw`q=2f+1`, annotation: ["인증서에 필요한 정족수", "n=4, f=1이면 q=3", "A·B·C의 서로 다른 투표"] },
            { expression: String.raw`q-f`, annotation: ["최악에는 f명이 바이트를 숨길 수 있음", "그 f명을 모두 제외", "정상 보관자 f+1명은 남음"] },
          ]}
          terms={[
            { symbol: "q", name: "인증서 정족수", description: "같은 유효 헤더에 투표한 서로 다른 voting power의 합입니다." },
            { symbol: "f", name: "Byzantine 한도", description: "프로토콜이 허용하는 악의적이거나 임의로 고장 난 power의 상한입니다." },
          ]}
          assumptions={[
            "n=3f+1이고 인증서 정족수 q=2f+1인 논문 모델을 사용합니다.",
            "정상 검증자는 헤더를 검증하고 해당 배치를 보관한 뒤에만 투표합니다.",
            "Weighted committee에서는 사람 수가 아니라 voting power로 같은 계산을 합니다.",
            "정상 보관자의 존재는 즉시 fetch·영구 보관·전체 순서를 보장하지 않습니다.",
          ]}
          interpretation="n=4, f=1이면 signer A·B·C 세 명 가운데 최대 한 명이 Byzantine이어도 정상 보관자 두 명이 남습니다. D는 이들 중 응답 가능한 경로에서 d7을 다시 받아 digest를 검증할 수 있습니다."
        />

        <p>
          Vote는 헤더 digest만 대충 가리키지 않습니다. 고정 구현에서는 header id, round, epoch, origin을 함께 해시한 값에 투표자가 서명합니다. 인증서는 H8 전체와 signer bitmap, 집계 서명을 담습니다. 중복 signer는 한 번만 세고, 같은 작성자·라운드의 다른 헤더에 이미 투표했다면 두 번째 투표를 거부합니다.
        </p>

        <div id="paper-narwhal-tusk">
          <CitationBlock source="Narwhal and Tusk v4" citeKey={2} href="https://arxiv.org/abs/2105.11827v4">
            <p><strong>문제:</strong> 거래 전파를 ordering leader의 대역폭·가용성 병목에서 분리해야 합니다.</p>
            <p><strong>기여:</strong> 여러 workers의 scale-out, 2f+1 서명 availability certificate와 이전 라운드 certificates를 가리키는 causal DAG를 제시합니다.</p>
            <p><strong>전제:</strong> 인증된 committee, n=3f+1, 최대 f Byzantine faults와 논문의 네트워크·저장 모델을 사용합니다.</p>
            <p><strong>근거 범위:</strong> Narwhal/Tusk v4의 프로토콜 구성과 보안 직관입니다.</p>
            <p><strong>말하지 않는 것:</strong> 논문의 성능 수치가 현재 Sui나 다른 하드웨어의 고정 성능이라는 뜻은 아닙니다.</p>
          </CitationBlock>
        </div>

        <div id="paper-narwhal-types-e67">
          <CitationBlock
            source="MystenLabs/narwhal commit e67f915 — primary types"
            citeKey={3}
            type="code"
            href="https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/types/src/primary.rs"
          >
            <p><strong>문제:</strong> Header·Vote·Certificate가 무엇에 서명하고 어떤 committee에서 검증되는지 코드 수준에서 고정해야 합니다.</p>
            <p><strong>구현:</strong> Header는 author·round·epoch·payload·parents를 digest에 묶고, Certificate는 중복을 제거한 signer bitmap과 집계 서명을 검증합니다.</p>
            <p><strong>근거 범위:</strong> 고정 커밋의 메시지 구조와 검증 함수입니다.</p>
            <p><strong>말하지 않는 것:</strong> 유지보수 중인 현재 Sui 합의 코드나 애플리케이션 실행 정확성을 나타내지 않습니다.</p>
          </CitationBlock>
        </div>
      </section>

      <section id="release" className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm font-semibold text-primary">03 · 누락과 상태 경계</p>
          <h2 className="text-2xl font-bold">자료가 빠졌다면 투표를 멈추고, 검증 가능한 경로로 복구합니다</h2>
        </header>

        <NarwhalFailureViz />

        <p>
          고정 구현의 <code>Synchronizer</code>는 헤더가 가리키는 parent certificates와 payload 위치를 local store에서 확인합니다. 특히 digest만 보는 것이 아니라 <code>(digest, worker id)</code> 쌍을 확인합니다. 잘못된 worker 번호를 적은 악의적 헤더에 투표하면, 나중에 다른 노드가 존재하지 않는 경로로 계속 요청할 수 있기 때문입니다.
        </p>
        <p>
          자료가 없으면 해당 헤더를 실패로 확정하거나 vote를 추측하지 않습니다. Missing parents는 다른 primaries에서, missing payload는 workers에서 가져온 뒤 같은 헤더를 다시 처리합니다. 가져온 바이트의 hash가 d7과 다르면 버리고, 대체 경로에서도 검증 가능한 바이트를 찾지 못하면 certified 이후 단계로 넘어가지 않습니다.
        </p>

        <div id="paper-narwhal-sync-e67">
          <CitationBlock
            source="MystenLabs/narwhal commit e67f915 — primary synchronizer"
            citeKey={4}
            type="code"
            href="https://github.com/MystenLabs/narwhal/blob/e67f91530e6bd4ef7808e42f548f07e58764ec5b/primary/src/synchronizer.rs"
          >
            <p><strong>문제:</strong> 헤더가 먼저 도착하고 부모 인증서나 배치 바이트가 늦게 도착해도, 검증되지 않은 상태에서 vote하면 안 됩니다.</p>
            <p><strong>구현:</strong> Missing parents와 <code>(BatchDigest, WorkerId)</code> payload를 별도로 찾고, waiter에 동기화를 요청한 뒤 처리를 재개합니다.</p>
            <p><strong>근거 범위:</strong> 보관 종료된 e67f915의 primary-side synchronization 경로입니다.</p>
            <p><strong>말하지 않는 것:</strong> 모든 네트워크 지연에서 fetch 완료 시간이나 영구 보관을 보장하지 않습니다.</p>
          </CitationBlock>
        </div>

        <NarwhalStateViz />

        <p>
          d7을 받았다는 상태, worker 저장 정족수가 생긴 상태, H8이 인증된 상태, 별도 합의가 d7의 위치를 정한 상태, 애플리케이션이 d7을 실행한 상태는 각각 다른 증거를 가집니다. 외부 API가 “완료”라고 답하려면 서비스가 약속한 마지막 상태의 receipt를 확인해야 합니다. Cert(H8)만 보고 Bob의 잔액이 바뀌었다고 응답하면 데이터 가용성을 실행 성공으로 잘못 바꾼 것입니다.
        </p>
      </section>
    </article>
  );
}
