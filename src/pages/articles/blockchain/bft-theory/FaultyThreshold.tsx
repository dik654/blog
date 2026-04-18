import M from '@/components/ui/math';
import FaultyThresholdViz from './viz/FaultyThresholdViz';

export default function FaultyThreshold() {
  return (
    <section id="faulty-threshold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{'f < n/3 한계 증명'}</h2>
      <div className="not-prose mb-6"><FaultyThresholdViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          BFT의 <strong>근본 한계</strong> — 전체 노드 n 중 Byzantine f는 n/3 미만.<br />
          즉 정직 노드 2f+1명 이상 필요 — quorum 교차로 safety 보장.<br />
          이 한계는 partial sync + Byzantine 모델의 tight bound.
        </p>

        {/* ── n = 3f 불가능 증명 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">n = 3f에서 합의 불가능 (귀류법)</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">가정 (Pease-Shostak-Lamport 1980, DLS 1988)</p>
            <p className="text-sm"><M>{'n = 3f'}</M>인 프로토콜 P가 존재한다고 가정 (귀류법). 3개 그룹 A, B, C로 분할 — 각 <M>{'f'}</M>명, 총 <M>{'n = 3f'}</M>.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Case 1: C가 Byzantine</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>A+B = <M>{'2f'}</M>명 정직</li>
                <li>합의 도달 → 결정값 <M>{'v_1'}</M></li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Case 2: A가 Byzantine</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>B+C = <M>{'2f'}</M>명 정직</li>
                <li>합의 도달 → 결정값 <M>{'v_2'}</M></li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Case 3: B가 Byzantine</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li>A+C = <M>{'2f'}</M>명 정직</li>
                <li>합의 도달 → 결정값 <M>{'v_3'}</M></li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">핵심 관찰 — 구별 불가</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>B 관점: Case 1(A+B)과 Case 2(B+C)에서 같은 메시지 패턴 → <M>{'v_1 = v_2'}</M> 강제</li>
              <li>C 관점: Case 2(B+C)와 Case 3(A+C) → <M>{'v_2 = v_3'}</M></li>
              <li>A 관점: Case 1(A+B)과 Case 3(A+C) → <M>{'v_1 = v_3'}</M></li>
            </ul>
            <p className="text-sm mt-2"><strong>결과:</strong> <M>{'v_1 = v_2 = v_3'}</M> 강제. 하지만 초기 입력이 다르면 결정값 달라야 함 → <strong>Validity 위반 (모순)</strong>.</p>
            <p className="text-sm mt-1">결론: <M>{'n = 3f'}</M>에서는 P 존재 불가 → <M>{'n \\geq 3f+1'}</M> 필요.</p>
          </div>
        </div>
        <p className="leading-7">
          증명 핵심: <strong>정직 노드는 Byzantine 식별 불가</strong>.<br />
          f명이 거짓말할 때 어느 그룹이 거짓인지 구별 못 함 → 서로 다른 입력에 같은 결정 강제.<br />
          이것이 quorum intersection이 필수인 이유.
        </p>

        {/* ── Quorum Intersection ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Quorum Intersection 원리</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">Quorum (정족수) 개념</p>
            <p className="text-sm">결정을 내리기 위해 필요한 최소 투표자 수. BFT에서 <M>{'Q = 2f+1'}</M> (<M>{'n = 3f+1'}</M>일 때).</p>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">Quorum Intersection Property</p>
            <p className="text-sm mb-2">두 quorum <M>{'Q_1, Q_2'}</M>는 반드시 <M>{'f+1'}</M>명 이상 겹침 → 정직 노드 최소 1명 존재.</p>
            <M display>{'|Q_1 \\cap Q_2| \\;\\geq\\; |Q_1| + |Q_2| - n \\;=\\; 2(2f+1) - (3f+1) \\;=\\; f+1'}</M>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">의미 (Safety 보장)</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><M>{'Q_1'}</M>에서 <M>{'v_1'}</M> 결정 → <M>{'2f+1'}</M> 표</li>
                <li><M>{'Q_2'}</M>에서 <M>{'v_2'}</M> 결정 → <M>{'2f+1'}</M> 표</li>
                <li>겹친 <M>{'f+1'}</M>명 중 정직 1명 이상 → 모순 불가 → <M>{'v_1 = v_2'}</M></li>
              </ul>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">왜 <M>{'2f+1'}</M>인가</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><M>{'Q = f+1'}</M>: Byzantine <M>{'f'}</M>명이 Q 형성 가능 (불안전)</li>
                <li><M>{'Q = 2f+1'}</M>: 정직만으로 quorum 형성 가능</li>
                <li><M>{'Q = 2f+2'}</M>: 너무 엄격, liveness 저해</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">프로토콜 적용</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>PBFT prepare</strong> — <M>{'2f+1'}</M> prepare 모으면 <code>prepared</code>. 두 다른 값 동시 prepared 불가 (quorum intersection)</li>
              <li><strong>Tendermint prevote</strong> — <M>{'2f+1'}</M> prevote 모으면 polka. 두 다른 block이 polka 불가 (lock mechanism)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <strong><M>{'Q = 2f+1'}</M> → 교차 <M>{'f+1'}</M> → 정직 1명 이상 겹침</strong>.<br />
          정직 노드는 두 다른 값 표결 불가 → 두 quorum은 같은 값 결정.<br />
          이것이 모든 BFT safety의 수학적 기반.
        </p>

        {/* ── 다양한 threshold ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">다양한 모델에서 threshold</h3>
        <div className="not-prose rounded-lg border p-4 mb-4">
          <div className="overflow-x-auto">
            <table className="text-sm w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 pr-3">모델</th>
                  <th className="text-left py-1 pr-3">Threshold</th>
                  <th className="text-left py-1 pr-3">Quorum</th>
                  <th className="text-left py-1">프로토콜</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">CFT</td><td className="py-1 pr-3"><M>{'f < n/2'}</M></td><td className="py-1 pr-3">majority</td><td className="py-1">Raft, Paxos, Zookeeper</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Byz + Sync + Unauth</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'n \\geq 3f+1'}</M></td><td className="py-1">PSL (1980)</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Byz + Sync + Auth</td><td className="py-1 pr-3"><M>{'f < n'}</M></td><td className="py-1 pr-3"><M>{'n \\geq f+2'}</M></td><td className="py-1">Dolev-Strong</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Byz + Partial Sync + Auth</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'n \\geq 3f+1'}</M></td><td className="py-1">PBFT, HotStuff, Tendermint</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Byz + Async + Randomized</td><td className="py-1 pr-3"><M>{'f < n/3'}</M></td><td className="py-1 pr-3"><M>{'n \\geq 3f+1'}</M></td><td className="py-1">Ben-Or, HoneyBadger</td></tr>
                <tr className="border-b border-dashed"><td className="py-1 pr-3">Flexible Byz (2019)</td><td className="py-1 pr-3"><M>{'f < n/3'}</M>~<M>{'n/2'}</M></td><td className="py-1 pr-3">선택적</td><td className="py-1">Malkhi et al.</td></tr>
                <tr><td className="py-1 pr-3">Stake-weighted BFT</td><td className="py-1 pr-3"><M>{'f < 1/3'}</M> stake</td><td className="py-1 pr-3">stake 비율</td><td className="py-1">Tendermint, HotStuff 변형</td></tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground mt-3">실무: 블록체인 → partial sync + auth (<M>{'3f+1'}</M>), 허가형 → sync + auth (<M>{'f+2'}</M>), 금융 DB → CFT</p>
        </div>
        <p className="leading-7">
          모델에 따라 threshold 다름 — <strong>CFT n/2, BFT partial sync n/3, BFT sync+sig n/1</strong>.<br />
          블록체인은 partial sync + authenticated → <M>{'n \\geq 3f+1'}</M> 표준.<br />
          stake-weighted는 3f+1이 stake 비율로 전환.
        </p>

        {/* ── 왜 3f+1이 "tight"한가 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 3f+1이 "tight bound"인가</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">Tight bound 의미</p>
              <ul className="text-sm space-y-1 list-disc list-inside">
                <li><strong>상한 (불가능 증명)</strong> — <M>{'n = 3f'}</M>에서 불가 (위 귀류법)</li>
                <li><strong>하한 (가능 증명)</strong> — <M>{'n = 3f+1'}</M>에서 동작 (PBFT, 1999)</li>
                <li>둘이 일치 = tight</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2">partial sync + authenticated 가정 하에 어떤 프로토콜도 이 bound 못 뚫음</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-2">실제 네트워크 크기 계산</p>
              <div className="overflow-x-auto">
                <table className="text-sm w-full">
                  <thead><tr className="border-b"><th className="text-left py-1 pr-2">f</th><th className="text-left py-1 pr-2">n</th><th className="text-left py-1">Q</th></tr></thead>
                  <tbody>
                    <tr><td className="py-0.5 pr-2">1</td><td className="py-0.5 pr-2">4</td><td className="py-0.5">3</td></tr>
                    <tr><td className="py-0.5 pr-2">5</td><td className="py-0.5 pr-2">16</td><td className="py-0.5">11</td></tr>
                    <tr><td className="py-0.5 pr-2">10</td><td className="py-0.5 pr-2">31</td><td className="py-0.5">21</td></tr>
                    <tr><td className="py-0.5 pr-2">33</td><td className="py-0.5 pr-2">100</td><td className="py-0.5">67</td></tr>
                    <tr><td className="py-0.5 pr-2">100</td><td className="py-0.5 pr-2">301</td><td className="py-0.5">201</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">Ethereum 2.0</p>
              <p className="text-sm">1M+ validators → <M>{'f < 333{,}333'}</M></p>
              <p className="text-xs text-muted-foreground">committee sampling (128-512명)</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">Cosmos Hub</p>
              <p className="text-sm">~180 validators → <M>{'f < 60'}</M></p>
              <p className="text-xs text-muted-foreground">stake-weighted</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">Sui</p>
              <p className="text-sm">~100 validators → <M>{'f < 33'}</M></p>
              <p className="text-xs text-muted-foreground">committee rotation</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          3f+1은 <strong>이론적 최적 (tight)</strong> — 더 줄일 방법 없음.<br />
          Partial sync + authenticated + Byzantine 모델의 절대 한계.<br />
          실무 validator 수 = (감내할 장애 수) × 3 + 1.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 33% 공격이 블록체인에서 위험한가</strong> — <M>{'f < n/3'}</M> 한계.<br />
          Byzantine validators가 전체 1/3 이상 획득 시 quorum intersection 파괴.<br />
          이것이 PoS 체인에서 "34%+ stake 획득 = 체인 공격 가능"의 수학적 근거.
        </p>
      </div>
    </section>
  );
}
