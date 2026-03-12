export default function ConsensusEngine() {
  return (
    <section id="consensus-engine" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">합의 엔진 (Tendermint BFT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CometBFT의 합의는 Tendermint BFT 알고리즘을 기반으로 하며,
          <strong> Propose → Prevote → Precommit</strong> 3단계 프로토콜로 동작합니다.
          이더리움의 Casper FFG가 2 에폭(epoch) 후 최종성을 달성하는 것과 달리,
          매 블록마다 즉시 최종성을 보장합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">라운드 기반 합의 흐름</h3>
        <pre className="bg-accent rounded-lg p-4 overflow-x-auto text-sm">
          <code>{`Height H, Round R:

1. Propose (리더가 블록 제안)
   ┌─────────────────────────────────────────┐
   │ Proposer = validators[H + R % len(validators)] │
   │ → 라운드 로빈 방식 리더 선출               │
   └─────────────────────────────────────────┘

2. Prevote (검증자가 블록 검증 후 투표)
   ┌─────────────────────────────────────────┐
   │ 유효한 블록 → Prevote(block_hash)        │
   │ 타임아웃/무효 → Prevote(nil)              │
   │ +2/3 Prevote 수집 → "Polka" 달성          │
   └─────────────────────────────────────────┘

3. Precommit (최종 커밋 투표)
   ┌─────────────────────────────────────────┐
   │ Polka 확인 → Precommit(block_hash)       │
   │  → 해당 블록에 "Lock" (이전 Lock 해제)    │
   │ +2/3 nil Prevote → Unlock               │
   │ +2/3 Precommit → 블록 커밋 (최종성!)      │
   │ 실패 시 → Round R+1로 진행                │
   └─────────────────────────────────────────┘

상태 머신:
  NewHeight → (Propose → Prevote → Precommit)+ → Commit → NewHeight
  → 한 Height에서 여러 Round가 진행될 수 있음
  → 타임아웃은 라운드마다 점진적으로 증가

블록 전파: PartSet으로 분할 → LibSwift 기반 Gossip
  → 대형 블록도 파트 단위로 병렬 전파 가능`}</code>
        </pre>
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 Casper FFG와 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">속성</th>
                <th className="border border-border px-4 py-2 text-left">Tendermint BFT</th>
                <th className="border border-border px-4 py-2 text-left">Casper FFG + LMD-GHOST</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">최종성</td>
                <td className="border border-border px-4 py-2">즉시 (1블록)</td>
                <td className="border border-border px-4 py-2">~12.8분 (2 에폭)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">내결함성</td>
                <td className="border border-border px-4 py-2">1/3 미만 비잔틴</td>
                <td className="border border-border px-4 py-2">1/3 미만 비잔틴</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">리더 선출</td>
                <td className="border border-border px-4 py-2">가중 라운드 로빈</td>
                <td className="border border-border px-4 py-2">RANDAO 기반</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">포크 가능성</td>
                <td className="border border-border px-4 py-2">없음 (safety 우선)</td>
                <td className="border border-border px-4 py-2">있음 (liveness 우선)</td>
              </tr>
              <tr>
                <td className="border border-border px-4 py-2 font-medium">검증자 수</td>
                <td className="border border-border px-4 py-2">~150 (실용적 한계)</td>
                <td className="border border-border px-4 py-2">~1,000,000+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
