import CreateBlockViz from './viz/CreateBlockViz';
import SealingPipelineViz from './viz/SealingPipelineViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function BlockCreation({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const openCode = onCodeRef
    ? (key: string) => onCodeRef(key, codeRefs[key])
    : undefined;

  return (
    <section id="block-creation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 생성 파이프라인</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p className="leading-7">
          VRF Sortition 당선 후 <strong>CreateBlock()으로 블록 조립</strong>.<br />
          Lookback 상태 → 워커 주소 조회 → BLS/Secpk 분류 → 서명 → FullBlock.<br />
          미세한 timing(~40s within epoch)으로 WinningPoSt 생성 필요.
        </p>
      </div>

      <h3 className="text-lg font-semibold mb-3">CreateBlock() 코드 추적</h3>
      <CreateBlockViz onOpenCode={openCode} />

      <h3 className="text-lg font-semibold mt-8 mb-3">Sealing 파이프라인 상세</h3>
      <SealingPipelineViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        {/* ── Mining Loop ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mining Loop 전체 흐름</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">Mining Loop <code className="text-xs bg-muted px-1 py-0.5 rounded">miner/miner.go</code></h4>
          <ol className="text-sm space-y-2 text-muted-foreground">
            <li><strong>1. 다음 epoch 대기</strong> — <code className="text-xs">GetBestMiningCandidate()</code> → <code className="text-xs">targetEpoch = base.TipSet.Height() + 1</code></li>
            <li><strong>2. Ticket 추출</strong> — <code className="text-xs">computeTicket(ctx, base)</code> VRF(worker_key, randomness, epoch)</li>
            <li><strong>3. Election 확인</strong> — <code className="text-xs">gen.IsRoundWinner()</code> 미당선 시 <code className="text-xs">continue</code></li>
            <li><strong>4. WinningPoSt 생성</strong> — <code className="text-xs">GenerateWinningPoSt()</code> tight deadline ~40s</li>
            <li><strong>5. Block 생성</strong> — <code className="text-xs">createBlock(ctx, base, ticket, winner, winningPoSt)</code></li>
            <li><strong>6. Submit + Broadcast</strong> — <code className="text-xs">SyncSubmitBlock()</code> → peers 전파</li>
          </ol>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">Timing Budget (30s epoch)</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 text-sm text-center">
            <div className="rounded bg-muted p-2"><span className="text-xs text-muted-foreground">ticket</span><br /><strong>few ms</strong></div>
            <div className="rounded bg-muted p-2"><span className="text-xs text-muted-foreground">election</span><br /><strong>1-5s</strong></div>
            <div className="rounded bg-muted p-2"><span className="text-xs text-muted-foreground">WinPoSt</span><br /><strong>20-40s</strong></div>
            <div className="rounded bg-muted p-2"><span className="text-xs text-muted-foreground">block</span><br /><strong>1-3s</strong></div>
            <div className="rounded bg-muted p-2"><span className="text-xs text-muted-foreground">submit</span><br /><strong>network</strong></div>
            <div className="rounded bg-muted p-2"><span className="text-xs text-muted-foreground">buffer</span><br /><strong>5-10s</strong></div>
          </div>
        </div>
        <p className="leading-7">
          Mining loop: <strong>ticket → election → WinningPoSt → block → submit</strong>.<br />
          30s epoch 내 모든 단계 완료 필요.<br />
          WinningPoSt가 가장 tight (~40s allowed).
        </p>

        {/* ── CreateBlock 상세 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CreateBlock() 상세</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">CreateBlock() 단계별 <code className="text-xs bg-muted px-1 py-0.5 rounded">miner/miner.go</code></h4>
          <ol className="text-sm space-y-2 text-muted-foreground">
            <li><strong>1. Lookback state</strong> — 900 epochs 과거 상태에서 <code className="text-xs">getMinerInfo(lbState, minerAddr)</code></li>
            <li><strong>2. Worker key 조회</strong> — <code className="text-xs">minerInfo.Worker</code> → <code className="text-xs">resolveKey()</code> (BLS / Secp256k1)</li>
            <li><strong>3. Mempool 선택</strong> — <code className="text-xs">MpoolSelect(ctx, tipsetKey, nullRounds)</code> ticket quality 기반 priority, gas limit 내</li>
            <li><strong>4. BLS / Secp 분리</strong> — <code className="text-xs">msg.Signature.Type</code> 기준 분류</li>
            <li><strong>5. BLS aggregation</strong> — 여러 BLS 서명을 하나로 합산 (space saving)</li>
            <li><strong>6. BlockHeader 조립</strong> — Miner, Height, Ticket, ElectionProof, WinPoStProof, Parents, Messages 등</li>
            <li><strong>7. Header 서명</strong> — <code className="text-xs">sign(workerKey, header.SigningBytes())</code></li>
            <li><strong>8. BlockMsg 반환</strong> — <code className="text-xs">Header</code> + <code className="text-xs">BlsMessages</code> + <code className="text-xs">SecpkMessages</code></li>
          </ol>
        </div>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-2">BlockHeader 주요 필드</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <span><code className="text-xs">Miner</code> — miner 주소</span>
            <span><code className="text-xs">Ticket</code> — VRF ticket</span>
            <span><code className="text-xs">ElectionProof</code> — sortition 증명</span>
            <span><code className="text-xs">WinPoStProof</code> — WinningPoSt</span>
            <span><code className="text-xs">Parents</code> — parent tipset CIDs</span>
            <span><code className="text-xs">ParentStateRoot</code> — 상태 루트</span>
            <span><code className="text-xs">Messages</code> — 메시지 CID</span>
            <span><code className="text-xs">BLSAggregate</code> — 합산 서명</span>
            <span><code className="text-xs">BlockSig</code> — 블록 서명</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">Lookback 900 epochs (7.5h) — finality assumption + worker key 안정성</p>
        </div>
        <p className="leading-7">
          CreateBlock: <strong>lookback state → messages → sig → BlockHeader</strong>.<br />
          BLS aggregation으로 space 절약.<br />
          900 epoch lookback = finality assumption.
        </p>

        {/* ── Sector Sealing Pipeline ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Sector Sealing Pipeline</h3>
        <div className="rounded-lg border bg-card p-4 not-prose mb-4">
          <h4 className="font-semibold text-sm mb-3">Sector Sealing 10단계 <code className="text-xs bg-muted px-1 py-0.5 rounded">sector/fsm.go</code></h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {[
              { n: '1', name: 'Packing', desc: 'raw data 수집 (CC/deal), ~32 GiB', time: '' },
              { n: '2', name: 'AddPiece', desc: 'deals 추가 + zero padding', time: '' },
              { n: '3', name: 'PC1', desc: 'Stacked DRG 11 layers, CPU-intensive', time: '2-4h' },
              { n: '4', name: 'PC2', desc: 'Merkle tree + column commitments, GPU', time: '~30m' },
              { n: '5', name: 'PreCommit 제출', desc: 'on-chain message + FIL deposit', time: '' },
              { n: '6', name: 'WaitSeed', desc: 'on-chain randomness 대기', time: '~1.25h' },
              { n: '7', name: 'C1', desc: 'VDF challenge + Merkle proofs', time: '<1m' },
              { n: '8', name: 'C2', desc: 'SNARK proof (Groth16 + GPU), ~200B', time: '30-90m' },
              { n: '9', name: 'ProveCommit 제출', desc: 'on-chain message → sector activated', time: '' },
              { n: '10', name: 'Proving', desc: 'active set + WindowPoSt, ~540d lifetime', time: '' },
            ].map(s => (
              <div key={s.n} className="flex items-start gap-2 rounded bg-muted p-2">
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">{s.n}</span>
                <div className="min-w-0">
                  <span className="font-medium">{s.name}</span>
                  {s.time && <span className="text-xs text-muted-foreground ml-1">({s.time})</span>}
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-2 border-t border-border">Total: <strong>3-6 hours</strong> per sector, parallel은 CPU/GPU에 의해 제한</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Hardware 요구사항</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><strong>CPU</strong> — AMD EPYC 7B13 64C 흔함</li>
              <li><strong>GPU</strong> — NVIDIA A100 (SNARK 가속)</li>
              <li><strong>RAM</strong> — 512 GiB+</li>
              <li><strong>SSD</strong> — NVMe (caching)</li>
              <li><strong>HDD</strong> — 대용량 (sealed sectors)</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Cost Optimization</h4>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>CPU sharing across stages</li>
              <li>GPU batching</li>
              <li>Sector batching (ProveCommit Aggregate)</li>
              <li>Worker specialization</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Sealing pipeline: <strong>10 states, 3-6 hours per sector</strong>.<br />
          PC1 (CPU) → PC2 (GPU) → wait → C1 → C2 (GPU SNARK).<br />
          hardware: EPYC + A100 + 512GB RAM + NVMe.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 왜 "lookback" 900 epoch인가</strong> — finality assumption.<br />
          최근 900 epoch은 reorg 가능 (probabilistic finality).<br />
          lookback state 사용하면 worker key가 stable한 시점 보장.<br />
          F3 이후엔 lookback 단축 가능성.
        </p>
      </div>
    </section>
  );
}
