import { CitationBlock } from '../../../../components/ui/citation';

export default function Autobahn() {
  return (
    <section id="autobahn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Autobahn(SOSP 2024)은 기존 BFT 프로토콜의 딜레마를 해결합니다:
          <strong> 전통적 BFT</strong>(PBFT, HotStuff)는 정상 시 저지연이지만 장애 복구가 느리고,
          <strong> DAG 기반 BFT</strong>(Narwhal/Bullshark)는 복구가 빠르지만 정상 시 지연이 높습니다.
          Autobahn은 <strong>두 장점을 결합</strong>합니다.
        </p>

        <CitationBlock source="Müller et al., IEEE S&P 2025 — Abstract" citeKey={7} type="paper">
          <p className="italic text-foreground/80">
            "Traditional BFT protocols suffer from performance hangovers after network instability (blips),
            while DAG-based protocols avoid hangovers but have higher latency. Autobahn combines the best
            of both: low latency during stability and <strong>seamless recovery</strong> after blips."
          </p>
          <p className="mt-2 text-xs">
            "Hangover"는 네트워크 불안정 후 정상 처리량을 회복하기까지의 지연을 의미합니다.
            PBFT/HotStuff는 View Change 후 밀린 요청을 재처리해야 하지만,
            Autobahn의 Lanes가 비동기로 데이터를 계속 전파하므로 이 문제가 구조적으로 해결됩니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 아이디어: 분리된 레이어</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Autobahn 아키텍처:

┌─────────────────────────────────────────────┐
│          Consensus Layer (Highway)           │
│  부분 동기 합의 — 저지연 블록 순서 결정       │
│  → HotStuff 유사 리더 기반 프로토콜           │
│  → Fast path: 3 message delays (1.5 RTT)    │
│  → Slow path: 5 message delays (2.5 RTT)    │
└──────────────────┬──────────────────────────┘
                   │ 합의 메시지를 데이터 메시지에 피기백
┌──────────────────┴──────────────────────────┐
│     Data Dissemination Layer (Lanes)         │
│  비동기 데이터 전파 — 높은 처리량              │
│  → DAG 구조로 트랜잭션 병렬 전파              │
│  → Reliable Broadcast로 가용성 보장           │
└─────────────────────────────────────────────┘

이더리움과 비교:
  이더리움 EL+CL에서 CL이 순서를 정하고 EL이 실행하듯,
  Autobahn은 Highway가 순서를 정하고 Lanes가 데이터를 전파
  → 하지만 두 레이어가 메시지를 공유(piggyback)하여 효율적`}</code>
        </pre>

        <CitationBlock source="Autobahn 논문 §3.2 — Ride-Sharing" citeKey={8} type="paper">
          <p className="italic text-foreground/80">
            "Ride-sharing embeds consensus protocol messages into data dissemination messages,
            eliminating the need for a separate consensus communication channel. A lane car carrying
            transaction data simultaneously carries the leader's proposal or a replica's vote."
          </p>
          <p className="mt-2 text-xs">
            이 최적화로 합의와 데이터 전파가 동일한 네트워크 메시지를 공유합니다.
            이더리움에서 어테스테이션을 블록에 포함시키는 것과 유사하지만,
            Autobahn은 이를 프로토콜 수준에서 더 밀접하게 통합합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Blip 복구 (Hangover 없음)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`"Blip" = 네트워크 불안정, 리더 장애 등 일시적 이벤트

전통적 BFT (PBFT, HotStuff):
  정상 ──→ Blip 발생 ──→ View Change ──→ 긴 복구 시간(Hangover)
  │                                       │
  └── 저지연 ──────────────────────────── 고지연 → 점진적 회복

DAG 기반 (Bullshark):
  정상 ──→ Blip 발생 ──→ DAG가 계속 진행 ──→ 빠른 복구
  │                                          │
  └── 고지연(DAG 오버헤드) ──────────────── 빠른 복구

Autobahn:
  정상 ──→ Blip 발생 ──→ Lanes가 데이터 계속 전파 ──→ 즉시 복구
  │                      Highway만 일시 중단          │
  └── 저지연(Highway) ────────────────────────────── 빠른 복구
      + Lanes 데이터가 이미 전파되어 있음

메시지 지연 비교:
  PBFT:     5 delays (정상) / View Change O(n³)
  HotStuff: 7 delays (정상) / View Change O(n) but hangover
  Autobahn: 3 delays (fast) / 5 delays (slow) / No hangover
  → Fast path는 모든 BFT 중 가장 낮은 지연!`}</code>
        </pre>

        <CitationBlock source="autobahn-artifact — consensus/autobahn.go" citeKey={9} type="code"
          href="https://github.com/autobahn-artifact">
          <pre className="text-xs overflow-x-auto"><code>{`// autobahn.go — Fast path 합의
func (ab *Autobahn) onProposal(p *Proposal) {
    // Fast path: 3f+1 즉시 투표 → 3 msg delays
    if ab.fastPathPossible(p) {
        ab.broadcastVote(p, FastPath)
        return
    }
    // Slow path: 2f+1 투표 → 5 msg delays (fallback)
    ab.broadcastVote(p, SlowPath)
}

// Lane이 비동기로 계속 데이터 전파
func (l *Lane) disseminate(car *Car) {
    // Highway 중단과 무관하게 Reliable Broadcast
    l.reliableBroadcast(car)
}`}</code></pre>
          <p className="mt-2 text-xs text-muted-foreground">
            Fast path(3f+1 동의)가 가능하면 3 message delays로 커밋,
            그렇지 않으면 slow path(2f+1)로 5 delays. Lane은 합의와 독립적으로 동작합니다.
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">Ride-Sharing 최적화</h3>
        <p>
          Autobahn의 핵심 최적화는 <strong>Ride-Sharing</strong>입니다:
          합의 메시지(Highway)를 데이터 메시지(Lane cars)에 피기백하여
          별도의 합의 메시지 전송 없이 합의를 진행합니다.
          이는 이더리움에서 어테스테이션을 블록에 포함시키는 것과 유사한 개념입니다.
        </p>
      </div>
    </section>
  );
}
