import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function CheckpointSync({ onCodeRef: _ }: Props) {
  return (
    <section id="checkpoint-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체크포인트 싱크</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Checkpoint Sync는 Finalized된 상태를 신뢰할 수 있는 소스에서 직접 다운로드한다.<br />
          제네시스부터 재실행하지 않으므로 <strong>수 분</strong>이면 동기화가 완료된다.
        </p>

        {/* ── Checkpoint Sync 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">CheckpointSync 구현 흐름</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-1">CLI 플래그</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs text-foreground/70 font-mono">
              <span>--checkpoint-sync-url=https://mainnet.checkpoint.sigp.io</span>
              <span>--genesis-beacon-api-url=https://mainnet.checkpoint.sigp.io</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>doCheckpointSync()</code> — 6단계 흐름</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">genesis 정보 다운로드 — <code>fetchGenesisState(url)</code>. <code>genesis_validators_root</code>와 config 일치 검증</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">finalized state 다운로드 — <code>GET /eth/v2/debug/beacon/states/finalized</code> → <code>UnmarshalSSZ</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80">block root 계산 — <code>LatestBlockHeader.HashTreeRoot()</code>. 주의: <code>state_root</code>를 먼저 채워야 함(ZERO_HASH 문제)</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80">finalized block 다운로드 — <code>GET /eth/v2/beacon/blocks/{'{blockRoot}'}</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">5</span>
                <div className="text-foreground/80">DB 초기화 — <code>SaveGenesisState</code> / <code>SaveState</code> / <code>SaveBlock</code> / <code>SetHead</code> / <code>SetFinalizedCheckpoint</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">6</span>
                <div className="text-foreground/80">P2P 시작 후 tip까지 Regular Sync로 진전</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">state ~250MB: 10~30초</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">genesis: 1초</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">검증: 5초</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">총: 수 분</div>
          </div>
        </div>
        <p className="leading-7">
          Checkpoint Sync는 <strong>수 분 내 완료</strong>.<br />
          finalized state + block 2개 다운로드 → DB 초기화.<br />
          이후 regular sync로 tip까지 진전 (수 시간).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">동작 과정</h3>
        <ul>
          <li><strong>체크포인트 URL 설정</strong> — <code>--checkpoint-sync-url</code> 플래그로 지정</li>
          <li><strong>Finalized State 다운로드</strong> — /eth/v2/debug/beacon/states/finalized</li>
          <li><strong>Finalized Block 다운로드</strong> — 해당 상태의 블록도 함께 받음</li>
          <li><strong>DB 초기화</strong> — 다운로드한 상태·블록으로 DB를 설정</li>
        </ul>

        {/* ── 신뢰 소스 비교 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">신뢰할 수 있는 체크포인트 소스</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">공개 checkpoint sync URLs (2025)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Mainnet</span> — mainnet.checkpoint.sigp.io (Sigma Prime)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Mainnet</span> — beaconstate.info (독립)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Mainnet</span> — sync.invis.tools (Invis)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Mainnet</span> — beaconstate.ethstaker.cc (EthStaker)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Holesky</span> — holesky.checkpoint.sigp.io</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">OP Sepolia</span> — op-sepolia.checkpoint.sigp.io</div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">신뢰 검증 절차</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>1. 여러 소스에서 같은 checkpoint 가져오기</p>
                <p>2. <code>state_root</code> / <code>block_root</code> 비교</p>
                <p>3. 모두 일치하면 신뢰 / 불일치 → 다른 소스 시도</p>
              </div>
            </div>
            <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
              <p className="text-xs font-bold text-foreground/70 mb-2">Weak Subjectivity Check</p>
              <div className="space-y-1 text-sm text-foreground/80">
                <p>checkpoint가 <code>WS_PERIOD</code> 내여야 안전</p>
                <p>메인넷 WS_PERIOD ~ 256 epochs (~27시간)</p>
                <p>너무 오래된 checkpoint → 거부</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">TLS 필수 (MITM 방지)</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">HTTPS + 검증된 CA</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Self-hosted 가능</div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Checkpoint URL</strong>은 신뢰 단일점 — 선택 중요.<br />
          여러 source 비교로 검증 → 조작 감지.<br />
          Weak subjectivity period 내에서만 안전.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Weak Subjectivity 보안</strong> — 체크포인트 싱크는 Weak Subjectivity Period 내에서만 안전.<br />
          이 기간이 지나면 공격자가 가짜 상태를 주입할 수 있어 신뢰할 수 있는 소스(Infura, Lodestar 등) 선택이 보안의 핵심.
        </p>
      </div>
    </section>
  );
}
