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

"Hangover-free" — Blip 이후 즉시 정상 처리량 회복

메시지 지연 비교:
  PBFT:     5 delays (정상) / View Change O(n³)
  HotStuff: 7 delays (정상) / View Change O(n) but hangover
  Autobahn: 3 delays (fast) / 5 delays (slow) / No hangover
  → Fast path는 모든 BFT 중 가장 낮은 지연!

Seamless Blip Recovery:
  Lanes(데이터 레이어)가 비동기로 계속 동작하므로
  Highway(합의)가 잠시 중단되어도 데이터는 이미 전파됨
  → 복구 시 "밀린 데이터"를 다시 보낼 필요 없음
  → HotStuff/PBFT의 hangover 문제를 구조적으로 해결`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">Ride-Sharing 최적화</h3>
        <p>
          Autobahn의 핵심 최적화는 <strong>Ride-Sharing</strong>입니다:
          합의 메시지(Highway)를 데이터 메시지(Lane cars)에 피기백하여
          별도의 합의 메시지 전송 없이 합의를 진행합니다.
          이는 이더리움에서 어테스테이션을 블록에 포함시키는 것과 유사한 개념입니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">코드 구조 (autobahn-artifact)</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`autobahn-artifact/
├── consensus/          # Highway 합의 로직
│   ├── autobahn.go     # 메인 프로토콜
│   ├── lane.go         # Lane (데이터 전파)
│   └── car.go          # Car (데이터 단위)
├── crypto/             # 서명 & 검증
├── config/             # 노드 설정
├── benchmark/          # 성능 벤치마크
└── scripts/            # 실험 스크립트
    └── aws/            # AWS 배포 (지리적 분산 테스트)`}</code>
        </pre>
      </div>
    </section>
  );
}
