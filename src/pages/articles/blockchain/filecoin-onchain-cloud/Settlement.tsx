import type { CodeRef } from '@/components/code/types';

export default function Settlement({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="settlement" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">온체인 정산 &amp; 사용량 과금</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          FVM 스마트 컨트랙트로 사용량 기반 과금을 자동화.<br />
          클라이언트가 FIL을 예치 → SP가 서비스 → 주기적으로 자동 정산. 컨트랙트 코드가 곧 SLA
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">On-chain Settlement 상세</h3>
        <div className="bg-muted rounded-lg p-4 not-prose mb-6">
          <h4 className="font-semibold text-sm mb-2">Smart Contract Model (<code className="text-xs">StorageDeal</code>)</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li><code className="text-xs bg-background px-1 rounded">client</code> / <code className="text-xs bg-background px-1 rounded">provider</code>: 참여자 주소</li>
            <li><code className="text-xs bg-background px-1 rounded">price</code>: per GiB per epoch 가격</li>
            <li><code className="text-xs bg-background px-1 rounded">deposit</code>: 예치금, <code className="text-xs bg-background px-1 rounded">start_epoch</code> / <code className="text-xs bg-background px-1 rounded">end_epoch</code>: 기간</li>
            <li><code className="text-xs bg-background px-1 rounded">pullPayment(epoch)</code>: PDP proof 확인 후 해당 epoch 결제 해제 → provider에 전송</li>
          </ul>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Payment Flow</h4>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>Client가 FIL을 contract에 예치</li>
              <li>SP가 데이터 저장 + PDP proof 생성</li>
              <li>Contract가 proof validity 검증</li>
              <li>epoch마다 자동 결제 해제</li>
              <li>기간 종료 시 최종 정산</li>
            </ol>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">SLA Enforcement</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>uptime: <code className="text-xs bg-background px-1 rounded">99.9%</code> 보장</li>
              <li>response time: <code className="text-xs bg-background px-1 rounded">&lt;100ms p95</code></li>
              <li>retrievability: <code className="text-xs bg-background px-1 rounded">99.99%</code></li>
              <li>PDP success rate: <code className="text-xs bg-background px-1 rounded">100%</code></li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Automatic Penalties</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>PDP 미제출: <code className="text-xs bg-background px-1 rounded">penalty = 10 x price_per_epoch</code> → client에 전송</li>
              <li>retrieval 지연: 결제 10% 감소</li>
              <li>unavailable: 계약 종료 + client 환불</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Metering</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>storage: <code className="text-xs bg-background px-1 rounded">epochs x GiB</code></li>
              <li>retrieval: GiB served</li>
              <li>operations: API calls</li>
              <li>온체인 추적</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-6">
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Batching</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>SP당 다수 deal 일괄 처리</li>
              <li>gas efficiency + periodic sweeps</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">FVM Execution</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Solidity/WASM contracts</li>
              <li>EVM compatible, deterministic</li>
            </ul>
          </div>
          <div className="bg-muted rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">Example (1 TiB / 1 year)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs bg-background px-1 rounded">$6/TiB/mo</code> = $72/year</li>
              <li>upfront escrow, 30s epoch 단위 해제</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Settlement: <strong>FVM smart contracts + automatic SLA enforcement</strong>.<br />
          PDP success → auto-release payment, miss → penalty.<br />
          "code is the SLA" — trustless execution.
        </p>
      </div>
    </section>
  );
}
