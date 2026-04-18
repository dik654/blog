import ContextViz from './viz/ContextViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 F3가 필요한가</h2>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        EC(Expected Consensus)의 확정까지 900 에폭(7.5시간) 대기 문제<br />
        F3는 EC 위에 올리는 확정성 레이어 — 블록 생산은 EC, 확정은 F3
      </p>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── F3 등장 배경 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3 등장 배경</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EC Finality 구조</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>30s per epoch, probabilistic finality</li>
              <li><strong>900 epochs = 7.5 hours</strong> (Nakamoto-style)</li>
              <li>~33% adversarial power 가정</li>
              <li>probability &lt; 10^-18 after 900 epochs</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">7.5시간이 만드는 문제</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Cross-chain bridges</strong> — Filecoin-Ethereum 7.5h 대기, DeFi 통합 불가</li>
              <li><strong>Payment settlement</strong> — 거래 확정 지연, UX 나쁨</li>
              <li><strong>FVM DeFi</strong> — composability 제약, DEX/lending 느림</li>
              <li><strong>IPC Subnets</strong> — checkpoint 7.5h delay</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">F3 목표</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>EC block production 유지</li>
              <li>추가 finality layer (~2-5분)</li>
              <li>GossiPBFT 기반</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">설계 원칙</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>Backward compatible</strong> — EC 변경 없음, 기존 node 호환</li>
              <li><strong>Optional</strong> — F3 비활성화 가능, EC 독립 작동</li>
              <li><strong>Additive security</strong> — EC + F3 이중 안전, 하나 실패해도 OK</li>
              <li><strong>Storage power based</strong> — 1 TB = 1 vote weight</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          EC: <strong>7.5h finality → bridge/DeFi 부적합</strong>.<br />
          F3: EC 위 finality layer → 2-5분으로 단축.<br />
          backward compatible, optional, storage-power based.
        </p>

        {/* ── F3 영향 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">F3의 Filecoin 생태계 영향</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">F3 활용 영역</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Cross-chain Bridges</p>
              <p className="text-xs text-muted-foreground">7.5h → 2-5분 (100-200x). Axelar, Chainlink CCIP, FIL/ETH atomic swaps</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">FVM DeFi</p>
              <p className="text-xs text-muted-foreground">DEX, Lending, Stablecoin, composability unlocked</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Payment Infra</p>
              <p className="text-xs text-muted-foreground">merchant payments, recurring billing, microtransactions</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">IPC Subnets</p>
              <p className="text-xs text-muted-foreground">parent chain checkpointing ~5min</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Light Clients</p>
              <p className="text-xs text-muted-foreground">fast finality proofs, mobile wallets, SPV</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Enterprise</p>
              <p className="text-xs text-muted-foreground">data marketplace, storage contracts, audit trails</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Finality 비교</h4>
            <div className="text-sm space-y-1 text-muted-foreground">
              <div className="flex justify-between"><span>Bitcoin</span><strong>60 min</strong></div>
              <div className="flex justify-between"><span>Ethereum</span><strong>12.8 min</strong></div>
              <div className="flex justify-between"><span>Cosmos</span><strong>6s (instant)</strong></div>
              <div className="flex justify-between"><span>Solana</span><strong>~13s</strong></div>
              <div className="flex justify-between font-medium"><span>Filecoin + F3</span><strong>2-5 min</strong></div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Rollout Timeline</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>2023 — F3 설계 완료</li>
              <li>2024 Q1 — devnet</li>
              <li>2024 Q2 — testnet (calibnet)</li>
              <li>2024 H2 — mainnet (phased)</li>
              <li>2025+ — enforced</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">기술 스택</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code className="text-xs">go-f3</code> — Go reference impl</li>
              <li><code className="text-xs">libp2p</code> — network layer</li>
              <li>BLS signatures (aggregation)</li>
              <li>HAMT (state storage)</li>
              <li>TLA+ / Coq verification, 4+ audits</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          F3 영향: <strong>cross-chain, DeFi, payments, subnets</strong>.<br />
          7.5h → 2-5분 (100-200x faster).<br />
          2024 testnet → 2025 mainnet enforcement 예상.
        </p>

        {/* ── EC + F3 Hybrid Model ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">EC + F3 Hybrid Security Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">EC (Block Production Layer)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Probabilistic finality, 30s blocks</li>
              <li>7.5h effective finality</li>
              <li>Sybil resistance: storage power</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">F3 (Finality Layer)</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>Deterministic finality (BFT)</li>
              <li>~2-5 min per decision</li>
              <li>2/3+ storage power quorum</li>
              <li>Safety via quorum intersection</li>
            </ul>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">Attack Scenarios</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Case 1: EC alone</p>
              <p className="text-xs text-muted-foreground">기존 behavior, 7.5h finality, 33% attack 이론적 가능</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Case 2: F3 alone</p>
              <p className="text-xs text-muted-foreground">fast finality이지만 block production 없음 — standalone 불가</p>
            </div>
            <div className="rounded bg-muted p-3">
              <p className="font-medium mb-1">Case 3: EC + F3 (production)</p>
              <p className="text-xs text-muted-foreground">이중 안전망, 33% attack → F3 halt (fork 아님)</p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-border text-xs text-muted-foreground">
            <strong>Quorum:</strong> EC/F3 모두 honest &gt; 66% storage power 요구 (같은 threshold).
            공격 비용: 33% storage power = 수십억 USD 투자 + FIL reward 상실 + slashing.
          </div>
        </div>
        <p className="leading-7">
          Hybrid: <strong>EC (block production) + F3 (finality)</strong>.<br />
          둘 다 33% storage power threshold.<br />
          F3 finalized tipset은 revert 불가 — 경제 공격 인센티브 감소.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "별도 layer"로 F3 설계했나</strong> — 점진적 rollout.<br />
          EC 재작성 = risky + 시간 소요.<br />
          F3 layer = 기존 network 영향 최소 + 점진 enforcement.<br />
          backward compat = Ethereum의 Casper FFG 접근과 유사.
        </p>
      </div>
    </section>
  );
}
