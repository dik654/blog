import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Topics({ onCodeRef }: Props) {
  return (
    <section id="topics" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토픽 & 포크 다이제스트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Prysm은 토픽 이름에 <strong>포크 다이제스트</strong>를 프리픽스로 붙인다.<br />
          포크 다이제스트 = SHA256(제네시스 검증자 루트 + 포크 버전)[:4]
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('message-handler', codeRefs['message-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">subscribe()</span>
        </div>

        {/* ── 전체 토픽 목록 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Ethereum 2.0 토픽 전체 목록</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-1">토픽 이름 형식</p>
            <p className="text-sm text-foreground/80 font-mono mb-2">/eth2/{'{fork_digest}'}/{'{name}'}/ssz_snappy</p>
            <p className="text-xs text-foreground/60"><code>fork_digest</code> = SHA256(current_fork_version || genesis_validators_root)[:4]. 예: <code>"6a95a1a9"</code> (Deneb, mainnet)</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">글로벌 토픽 (모든 노드 구독 필수)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>beacon_block</code> — 블록 전파</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>aggregate_and_proof</code> — 집계 attestation</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>voluntary_exit</code> — validator 종료</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>proposer_slashing</code> — proposer 슬래싱</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>attester_slashing</code> — attester 슬래싱</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>bls_to_execution_change</code> — withdrawal 변경(Capella+)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>blob_sidecar_{'{0-5}'}</code> — blob(Deneb+, 6 subnets)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>sync_contribution_and_proof</code> — sync 집계</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">서브넷 토픽 (validator 선택 구독)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>beacon_attestation_{'{0-63}'}</code> — 64 attestation subnets</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>sync_committee_{'{0-3}'}</code> — 4 sync committee subnets</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">일반 노드: ~10개 토픽</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">active validator: ~13개</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">aggregator: ~40개+</div>
          </div>
        </div>
        <p className="leading-7">
          Ethereum 2.0은 <strong>글로벌 + 서브넷</strong> 이중 토픽 구조.<br />
          subnet 분산으로 attestation 대역폭 분산 → 한 노드가 모든 서명 전파 불필요.<br />
          validator만 해당 subnet 구독 → 네트워크 자원 절약.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">주요 토픽</h3>
        <ul>
          <li><code>/eth2/{'{digest}'}/beacon_block/ssz_snappy</code> — 블록 전파</li>
          <li><code>/eth2/{'{digest}'}/beacon_attestation_{'{subnet}'}/ssz_snappy</code> — 어테스테이션</li>
          <li><code>/eth2/{'{digest}'}/sync_committee_{'{subnet}'}/ssz_snappy</code> — 싱크 커미티</li>
        </ul>

        {/* ── 포크 다이제스트 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">포크 다이제스트 — 네트워크 자동 격리</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2"><code>computeForkDigest(forkVersion, genesisValidatorsRoot)</code></p>
            <p className="text-sm text-foreground/80"><code>ForkData</code> SSZ container를 <code>HashTreeRoot</code>하여 처음 4바이트 추출. 네트워크 + 포크 조합의 고유 식별자.</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">메인넷 fork_digest 연대기</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">Phase0 (2020-12) — <code>b5303f2a</code></div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">Altair (2021-10) — <code>afcaaba0</code></div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">Bellatrix (2022-09) — <code>4a26c58b</code> (The Merge)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">Capella (2023-04) — <code>bba4da96</code></div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">Deneb (2024-03) — <code>6a95a1a9</code></div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">Electra (2025 예정) — TBD</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">하드포크 전환 흐름</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">포크 epoch N 설정</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">epoch N-1까지 old fork_digest 사용</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80">epoch N부터 new fork_digest 사용 (~4 epochs overlap)</div>
              </div>
            </div>
            <p className="text-xs text-foreground/60 mt-2">업그레이드 안 한 노드 → 이전 fork_digest → 새 토픽 수신 불가 → 자연 disconnect. 수동 버전 체크 없이 격리 보장.</p>
          </div>
        </div>
        <p className="leading-7">
          <strong>fork_digest</strong>가 포크별 네트워크를 암호학적으로 분리.<br />
          업그레이드 안 한 노드는 새 토픽 모름 → 자동 isolate.<br />
          과거 6번의 포크 전환이 모두 이 메커니즘으로 smooth 진행.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 포크 자동 격리</strong> — 하드포크 시 포크 다이제스트가 변경되어 이전 포크 토픽의 메시지가 자연스럽게 무시됨.<br />
          수동 버전 체크 없이 네트워크 분리가 보장되는 설계.
        </p>
      </div>
    </section>
  );
}
