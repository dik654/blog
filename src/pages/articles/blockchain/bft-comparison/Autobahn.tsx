import AutobahnLayersViz from './viz/AutobahnLayersViz';
import AutobahnArchViz from './viz/AutobahnArchViz';
import AutobahnBlipViz from './viz/AutobahnBlipViz';

export default function Autobahn() {
  return (
    <section id="autobahn" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Autobahn (SOSP 2024) — <strong>전통 BFT 저지연 + DAG 빠른 복구</strong> 결합.<br />
          Highway(합의) + Lanes(데이터) 분리 + Ride-Sharing piggyback.<br />
          blip(일시 장애) 발생 시 전통 BFT보다 10배+ 빠른 복구.
        </p>
      </div>
      <div className="not-prose mb-8"><AutobahnLayersViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Highway · Lanes · Ride-Sharing</h3>
        <p className="leading-7">
          합의(Highway)와 데이터 전파(Lanes)를 분리 — Ride-Sharing으로 메시지 피기백.
        </p>
      </div>
      <div className="not-prose mb-8"><AutobahnArchViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <h3 className="text-xl font-semibold mb-3">Blip 복구 비교</h3>
        <p className="leading-7">
          Blip(일시 장애) 발생 시 복구 방식 — 전통 BFT vs DAG vs Autobahn.
        </p>
      </div>
      <div className="not-prose mb-6"><AutobahnBlipViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Autobahn 등장 동기 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Autobahn 등장 동기</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 문제 인식 (2024):
//
// 전통 BFT (HotStuff, Tendermint):
// - 낮은 정상 latency (3-4δ)
// - but blip 복구 느림 (timeout + view change)
// - f validators blip → 수 초 halt
//
// DAG-BFT (Narwhal, Mysticeti):
// - 빠른 blip 복구 (parallel progress)
// - but 높은 정상 latency
// - DAG 구축 overhead
//
// "둘 다 얻을 수 없을까?"
// - 낮은 happy-path latency + 빠른 blip 복구
// - Autobahn의 도전

// Blip 정의:
// - brief failure (단기 장애)
// - 수 백 ms 동안 validator 응답 없음
// - 네트워크 jitter, 일시적 DDoS, restart
// - 현실 운영에서 자주 발생

// 전통 BFT의 blip 복구:
// - timeout 감지 (~1-3s)
// - view change 시작
// - new leader propose
// - 복구 완료: ~2-5s
//
// DAG-BFT의 blip 복구:
// - DAG 계속 성장 (다른 validator가 커버)
// - blip validator 제외하고 진행
// - 복구 완료: ~100-200ms

// Autobahn의 해결:
// - happy path: 전통 BFT 스타일 (저지연)
// - blip 감지 시: DAG-like 구조로 전환
// - hybrid benefit`}
        </pre>
        <p className="leading-7">
          Autobahn = <strong>BFT 저지연 + DAG 빠른 복구</strong>.<br />
          blip (일시 장애)는 현실 자주 발생.<br />
          기존 BFT는 5초+, Autobahn은 수백ms 복구.
        </p>

        {/* ── Highway-Lanes 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Highway + Lanes 구조</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Autobahn 2-tier architecture:
//
// Tier 1: Lanes (data dissemination)
// - 각 validator가 독립 lane 소유
// - TX batch 생성 + broadcast
// - Narwhal-style parallel dissemination
// - high throughput
// - O(n) lanes in parallel
//
// Tier 2: Highway (consensus)
// - sequential ordering
// - BFT consensus on batch references
// - low latency commit
// - HotStuff-like 3-chain or 2-chain
//
// 분리의 장점:
// - throughput decoupled from latency
// - lanes handle heavy traffic
// - highway handles ordering

// Ride-Sharing (piggyback):
// - validator가 lane batch 만들 때
// - 다른 validator의 batch signature 포함 (piggyback)
// - additional messages 절감
// - bandwidth 효율화
//
// 예:
// validator A가 batch A1 생성:
//   include ack(B3, C2) if received recently
// validator B가 A1 받으면:
//   ack(A1) + piggyback ack(C2) from A
//
// 결과:
// - N^2 ack messages → N ack messages
// - latency도 감소

// Blip 복구 메커니즘:
// - 정상 시: highway sequential commit
// - validator failure 감지:
//   - 해당 validator의 lane skip
//   - 다른 validator의 batch로 continue
// - failure 복구:
//   - 누락된 batch replay
//   - highway catch up

// 성능 (SOSP 2024):
// - happy path: 2-3δ latency (HotStuff급)
// - blip recovery: 100-200ms (DAG급)
// - throughput: 100K+ TPS
// - validators: 50-100`}
        </pre>
        <p className="leading-7">
          Highway (consensus) + Lanes (dissemination) 분리.<br />
          Ride-Sharing = <strong>ack piggybacking으로 N² → N</strong>.<br />
          happy path 2-3δ, blip recovery 100ms.
        </p>

        {/* ── 실무 적용 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">실무 적용과 비교</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Autobahn 비교:
//
// HotStuff:
// - happy: 3δ
// - blip: timeout + VC (2-5s)
// - throughput: 25K TPS
//
// Narwhal+Bullshark:
// - happy: 6-10δ (DAG overhead)
// - blip: 100-200ms
// - throughput: 100K+ TPS
//
// Mysticeti:
// - happy: 3-4δ
// - blip: 100-200ms
// - throughput: 160K+ TPS
// - 390ms e2e
//
// Autobahn:
// - happy: 2-3δ
// - blip: 100-200ms
// - throughput: 100K+ TPS
// - "best of both worlds"

// 2024년 현재 상황:
// - Autobahn: 학술 (SOSP 2024)
// - Mysticeti: mainnet (Sui)
// - Jolteon: mainnet (Aptos)
// - 각자 다른 접근

// 미래 전망:
// - DAG + sequential hybrid가 주류
// - Autobahn 아이디어 채택 증가 예상
// - 새 블록체인 (2025-) 선택지

// 설계 교훈:
// 1. happy path와 sad path 분리 설계
// 2. piggyback으로 overhead 감소
// 3. 각 tier에 최적 프로토콜 선택
// 4. blip은 현실, 복구 속도 중요

// 연구 방향:
// - async-safe Autobahn
// - adaptive pipeline depth
// - privacy 통합
// - execution layer 통합`}
        </pre>
        <p className="leading-7">
          Autobahn vs Mysticeti/Jolteon 비교 — <strong>happy path 최적</strong>.<br />
          2024 SOSP, 아직 mainnet 없음.<br />
          DAG + sequential hybrid가 future 방향 제시.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Autobahn이 "다음 세대" 후보인가</strong> — 두 세계의 장점.<br />
          기존 BFT: 낮은 latency, but 느린 복구.<br />
          DAG-BFT: 빠른 복구, but 높은 latency.<br />
          Autobahn: 둘 다 달성 — 2-tier 설계로 각 tier 최적화.
        </p>
      </div>
    </section>
  );
}
