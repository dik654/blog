import M from '@/components/ui/math';
import ContextViz from './viz/ContextViz';
import SystemModelViz from './viz/SystemModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">분산 시스템 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          블록체인의 이론적 토대 — 분산 시스템의 통신 모델, 한계, 해결책.
        </p>
      </div>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="not-prose"><SystemModelViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">분산 시스템 모델 구분</h3>

        {/* 1. Timing Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">1. Timing Model (시간 모델)</h4>

        {/* 핵심 기호 정의 */}
        <div className="not-prose rounded-lg border-l-4 border-l-sky-500 bg-card p-4 mb-4">
          <div className="text-sm font-semibold mb-2">핵심 기호 — Δ 와 GST</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="font-mono text-xs text-sky-600 dark:text-sky-400 mb-1">
                Δ (delta) = 메시지 전달 상한
              </p>
              <p className="text-muted-foreground text-xs">
                "노드 A 가 메시지 보내면 Δ 시간 안에 반드시 도착" 보장.
                <br />타임아웃을 Δ 로 설정 → "Δ 지나도 응답 없으면 장애" 라고 결론 가능.
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-emerald-600 dark:text-emerald-400 mb-1">
                GST (Global Stabilization Time) = 안정화 시점
              </p>
              <p className="text-muted-foreground text-xs">
                "어느 시점 GST 가 존재. GST 이후로는 Δ 가 유지됨" 만 가정.
                <br />언제 GST 인지는 모름 → 알고리즘은 GST 도래 후 결국 종료한다는 식으로 설계.
              </p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Synchronous</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지 지연 상한 <code className="text-xs bg-muted px-1 rounded">Δ</code> known + 항상 보장</li>
              <li>Clock drift 상한 known</li>
              <li>가장 강력한 가정</li>
              <li><strong className="text-blue-600 dark:text-blue-400">분석 도구</strong>로만 유용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Asynchronous</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지 지연 상한 없음 (<code className="text-xs bg-muted px-1 rounded">Δ = ∞</code>)</li>
              <li>언제 도착할지 모름</li>
              <li>가장 약한 가정</li>
              <li>FLP impossibility 적용</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Partial Synchronous</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>대부분 sync, 가끔 async</li>
              <li>GST 이후로 Δ 가 유지된다고만 가정</li>
              <li>현실적 중간 모델</li>
              <li>대부분 BFT 프로토콜의 가정</li>
            </ul>
          </div>
        </div>

        {/* 왜 Synchronous 는 비현실적인가 */}
        <div className="not-prose rounded-lg border-l-4 border-l-amber-500 bg-card p-4 mb-6">
          <div className="text-sm font-semibold mb-2">왜 Synchronous 모델은 비현실적인가</div>
          <p className="text-sm text-muted-foreground mb-2">
            "메시지가 <strong>항상</strong> Δ 안에 도착" 가정은 현실 인터넷에서 깨지기 쉽다 — 단 한 번이라도 깨지면 프로토콜의 안전성/완료성이 붕괴.
          </p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li><strong>네트워크 변동</strong> — 라우터 큐잉, 패킷 손실 재전송, 라우팅 변경으로 RTT 가 평소의 10~1000 배까지 튐</li>
            <li><strong>가비지 컬렉션 / 스케줄링 stall</strong> — JVM full GC 수백 ms~수 초, OS preemption 도 Δ 를 쉽게 초과</li>
            <li><strong>NTP 시계 보정</strong> — clock skew 가 갑자기 점프하면 타임아웃 기준이 흔들림</li>
            <li><strong>장애 vs 지연 구분 불가</strong> — Δ 를 안전하게 잡으려면 P99.99 마진을 줘야 하고, 그러면 장애 감지가 너무 느려짐 (분 단위)</li>
            <li><strong>적대적 환경</strong> — DDoS, BGP 하이재킹 같은 공격은 Δ 보장을 임의로 깨버림</li>
          </ul>
          <p className="text-sm text-muted-foreground mt-2">
            실세계 시스템은 그래서 Partial Synchrony 를 채택 — "보통은 동기지만 가끔 깨질 수 있다, 결국엔 안정화된다" 가 합리적 가정.
            Synchronous 모델은 알고리즘의 <em>이상 한계</em> 분석이나 회로/HW 트리거 같은 매우 통제된 환경에만 어울린다.
          </p>
        </div>

        {/* 2. Failure Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">2. Failure Model (장애 모델)</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Crash Failure (Fail-Stop)</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>노드가 멈추거나 메시지 손실</li>
              <li>악의적 행동 없음</li>
              <li>Tolerance: <M>f &lt; n/2</M> (majority)</li>
              <li>예: Paxos, Raft</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-red-600 dark:text-red-400 mb-2">Byzantine Failure</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>임의의 악의적 행동 가능</li>
              <li>거짓말, 메시지 변조, 음모</li>
              <li>Tolerance: <M>f &lt; n/3</M></li>
              <li>예: PBFT, Tendermint, HotStuff</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Omission Failure</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지를 보내지 않음</li>
              <li>Crash의 부분 집합</li>
            </ul>
          </div>
        </div>

        {/* 3. Network Model */}
        <h4 className="text-lg font-semibold mt-5 mb-3">3. Network Model</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Reliable Channels</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>메시지 결국 전달됨</li>
              <li>Lossy &rarr; lossless 변환 가능</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Authenticated Channels</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>발신자 확인 가능</li>
              <li>Digital signature 필수</li>
            </ul>
          </div>
        </div>

        {/* 핵심 정리 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">핵심 정리</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border-l-4 border-l-red-500 bg-card p-4">
            <div className="text-sm font-semibold mb-1">FLP (1985)</div>
            <p className="text-sm text-muted-foreground">Async + 1 crash &rarr; 결정적 합의 불가능</p>
          </div>
          <div className="rounded-lg border-l-4 border-l-amber-500 bg-card p-4">
            <div className="text-sm font-semibold mb-1">CAP (2000)</div>
            <p className="text-sm text-muted-foreground">Consistency, Availability, Partition-tolerance &rarr; 2개만 선택 가능</p>
          </div>
          <div className="rounded-lg border-l-4 border-l-blue-500 bg-card p-4">
            <div className="text-sm font-semibold mb-1">Byzantine Generals (1982)</div>
            <p className="text-sm text-muted-foreground"><M>f</M> Byzantine faults &rarr; <M>{'n \\geq 3f+1'}</M> 필요</p>
          </div>
        </div>

        {/* 블록체인 매핑 */}
        <h4 className="text-lg font-semibold mt-5 mb-3">블록체인 매핑</h4>
        <div className="not-prose grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-2">Bitcoin</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync</li>
              <li>Byzantine (PoW)</li>
              <li>Probabilistic finality</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">Ethereum 2.0</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync</li>
              <li>Byzantine (PoS Casper FFG)</li>
              <li>Deterministic finality (2 epochs)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Tendermint/Cosmos</div>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>Partial sync</li>
              <li>Byzantine BFT</li>
              <li>Instant finality</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
