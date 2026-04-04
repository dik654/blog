export const archCode = `Autobahn 아키텍처:

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
  → 하지만 두 레이어가 메시지를 공유(piggyback)하여 효율적`;

export const blipRecoveryCode = `"Blip" = 네트워크 불안정, 리더 장애 등 일시적 이벤트

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
  → Fast path는 모든 BFT 중 가장 낮은 지연!`;
