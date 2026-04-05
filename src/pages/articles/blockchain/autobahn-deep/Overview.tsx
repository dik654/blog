import ContextViz from './viz/ContextViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Autobahn 하이브리드 파이프라인</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Autobahn (SOSP 2024) — <strong>PBFT 저지연 + HotStuff 확장성</strong>.<br />
          Highway(consensus) + Lanes(data) + Ride-Sharing(piggyback) 3-tier.<br />
          blip(일시 장애) 복구 10배+ 빠름.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">핵심 설계</h3>
        <p className="leading-7">
          정상 상태: <strong>PBFT 스타일 fast path 2단계 커밋</strong>.<br />
          리더 장애 시: HotStuff 스타일 slow path 전환.<br />
          파이프라인으로 여러 합의 인스턴스 동시 실행 → 처리량 극대화.
        </p>

        {/* ── Autobahn 문제 의식 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Autobahn 문제 의식 (SOSP 2024)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BFT Scalability Trilemma:
//
// 기존 BFT는 3가지 중 2개만 선택:
// 1. Low latency (happy path)
// 2. High throughput (pipelined)
// 3. Fast blip recovery (failure handling)

// PBFT:
// - low latency (3δ)
// - low throughput (O(n²) bottleneck)
// - slow blip recovery (O(n³) VC)

// HotStuff:
// - moderate latency (3-7δ)
// - higher throughput (O(n) + pipeline)
// - moderate blip recovery

// Narwhal+Bullshark:
// - higher latency (2-4 rounds)
// - highest throughput (DAG)
// - fast blip recovery (parallel)

// Mysticeti:
// - low latency (3 rounds, 390ms)
// - high throughput (uncertified DAG)
// - fast recovery

// Autobahn의 주장:
// "3가지 모두 달성 가능"
// - happy path: PBFT급 latency
// - throughput: HotStuff+
// - blip recovery: DAG급 fast

// 메커니즘:
// - Highway: PBFT-style consensus (low latency)
// - Lanes: parallel data dissemination (throughput)
// - Ride-Sharing: piggyback (bandwidth 효율)
// - Blip handling: explicit protocol

// Target 환경:
// - WAN (global validators)
// - 100+ validators
// - real network conditions (blips 흔함)
// - high TX load

// 2024 SOSP publication:
// - 학술 단계
// - mainnet 아직 없음
// - 미래 L1 후보`}
        </pre>
        <p className="leading-7">
          Autobahn: <strong>low latency + high throughput + fast recovery</strong> 동시 달성.<br />
          Highway/Lanes/Ride-Sharing 3-tier 구조.<br />
          2024 SOSP 논문, 학술 단계.
        </p>

        {/* ── Blip 문제 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Blip 문제의 중요성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Blip (brief interruption) 정의:
// - 짧은 validator failure
// - network jitter
// - temporary DDoS
// - restart/GC pause
// - typically 100-1000ms duration

// 현실 네트워크에서 blip 빈도:
// - 매 validator: 분당 수차례
// - 전체 committee: 초당 수차례
// - 완벽한 uptime 불가능

// 기존 BFT의 blip 대응:
//
// PBFT:
// - timeout 감지 (1-3s)
// - view change 시작
// - O(n³) 메시지 교환
// - 복구: 3-10s
// - blip 1회 = 수 초 halt
//
// HotStuff:
// - timeout (1s)
// - linear view change
// - highQC 수집
// - 복구: 1-3s
// - blip 1회 = 1-3s halt
//
// Tendermint:
// - timeout + round++
// - round mod n 새 leader
// - 복구: 2-5s
// - blip 1회 = 2-5s halt

// Blip 누적 효과:
// - 10 blips/hour × 3s halt = 30s downtime/hour
// - 720s/day = 12 min/day downtime
// - 이것이 현실 BFT performance

// DAG-BFT의 우위:
// - 모든 validator parallel propose
// - 1-2 validator blip = continue
// - 복구: 100-300ms
// - blip 1회 = 거의 무시

// Autobahn의 목표:
// - happy path 유지 (PBFT latency)
// - blip 발생 시 DAG급 복구
// - 둘 다 달성

// Autobahn 성능 (SOSP 2024):
// - no blip: 200-300ms latency
// - with blip: 350ms (PBFT는 3s+)
// - throughput: 100K+ TPS`}
        </pre>
        <p className="leading-7">
          Blip = <strong>brief interruption</strong> — 현실에서 자주 발생.<br />
          PBFT/HotStuff: 수 초 halt, Autobahn: 수백 ms.<br />
          누적 downtime 차이 10배+ → SLO 중요.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 Autobahn이 L1 blockchain의 미래 후보인가</strong> — real-world robustness.<br />
          실제 운영에서 blip은 불가피 (cloud, ISP, validator).<br />
          BFT 선택 시 "평균" 성능보다 "worst case" 성능이 SLO 결정.<br />
          Autobahn은 happy + blip 둘 다 최적 → 실무 적합.
        </p>
      </div>
    </section>
  );
}
