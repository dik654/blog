import ContextViz from './viz/ContextViz';
import GossipsubMeshViz from './viz/GossipsubMeshViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GossipSub 프로토콜</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 GossipSub 토픽 구독, 메시 구성, 메시지 검증 파이프라인을 코드 수준으로 추적한다.
        </p>

        {/* ── GossipSub 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GossipSub — publish-subscribe 프로토콜</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">GossipSub 1.1 — libp2p publish-subscribe 프로토콜</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Topic</span> — 메시지 채널 이름</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Mesh</span> — 토픽당 peer 그래프(D=8)</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">Gossip</span> — mesh 외부에 ID만 광고</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><span className="font-bold">IHAVE/IWANT</span> — 메시지 교환</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">동작 방식 — 5단계</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">Publisher가 topic에 메시지 전송</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">mesh 내 peers에게 직접 forward</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80">각 peer가 자기 mesh에 re-forward → 지수 확산</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80">주기적으로 mesh 외부에 IHAVE 광고</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">5</span>
                <div className="text-foreground/80">필요한 peer가 IWANT로 요청 → 추가 전달</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">Propagation: O(log N)</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Bandwidth: O(D)/peer</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">안정성: D_lo=6 유지</div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Ethereum 2.0 토픽 &amp; 네트워크 부하(메인넷)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>beacon_block</code> — 슬롯당 1개</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>beacon_attestation_{'{0-63}'}</code> — ~30K/slot</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>aggregate_and_proof</code> — ~500/slot</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>voluntary_exit</code> / slashing — 드문</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>sync_committee_{'{0-3}'}</code> — 서브넷</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">피어당 대역폭 ~1 MB/s</div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          GossipSub는 <strong>mesh + gossip 이중 구조</strong>.<br />
          mesh가 빠른 전파 담당, gossip이 안정성/완전성 보장.<br />
          O(log N) propagation time으로 대규모 네트워크 지원.
        </p>

        {/* ── mesh 관리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Mesh 관리 — Heartbeat 프로토콜</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">Mesh 파라미터</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>D = 8</code> — 목표 degree</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>D_lo = 6</code> — 최소</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>D_hi = 12</code> — 최대</div>
              <div className="rounded border border-border/40 p-2 text-foreground/70"><code>D_lazy = 6</code> — gossip 대상</div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>heartbeat()</code> — 1초 간격 mesh 조정</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80"><strong>부족</strong> (<code>len(mesh) &lt; D_lo</code>) → 새 peer 추가 + <code>sendGRAFT()</code> ("mesh 추가 요청")</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">2</span>
                <div className="text-foreground/80"><strong>과다</strong> (<code>len(mesh) &gt; D_hi</code>) → score 낮은 순 제거 + <code>sendPRUNE()</code> ("mesh 제거 알림")</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">3</span>
                <div className="text-foreground/80"><strong>Gossip</strong> — mesh 외부 <code>D_lazy</code>개 peer에게 최근 5개 <code>IHAVE</code> 전송</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">GRAFT</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">PRUNE</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">IHAVE</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">IWANT</div>
          </div>
        </div>
        <p className="leading-7">
          Heartbeat(1초)가 <strong>mesh 동적 관리</strong> 수행.<br />
          GRAFT/PRUNE으로 mesh 확장/축소 → D_lo~D_hi 범위 유지.<br />
          IHAVE/IWANT로 mesh 외부 메시지 보완 전파.
        </p>

        {/* ── Validation Pipeline ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">메시지 검증 파이프라인</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>validateBeaconBlock()</code> — beacon_block 토픽 validator</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">SSZ-Snappy 디코딩 — <code>snappy.Decode</code> → <code>UnmarshalSSZ</code>. 실패 시 <code>ValidationReject</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">gossip validation rules — slot 범위, signature, proposer_index, parent_root 존재, 중복 확인</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80">성공 → <code>msg.ValidatorData = block</code> 캐싱 후 <code>ValidationAccept</code></div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-3 text-center">
              <p className="text-xs font-bold text-green-500">Accept</p>
              <p className="text-xs text-foreground/60">forward to mesh</p>
              <p className="text-xs text-foreground/50">+1 first_delivery</p>
            </div>
            <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-3 text-center">
              <p className="text-xs font-bold text-yellow-500">Ignore</p>
              <p className="text-xs text-foreground/60">keep, no forward</p>
              <p className="text-xs text-foreground/50">영향 없음</p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-center">
              <p className="text-xs font-bold text-red-400">Reject</p>
              <p className="text-xs text-foreground/60">peer penalty</p>
              <p className="text-xs text-foreground/50">-80 invalid_message</p>
            </div>
          </div>
          <p className="text-xs text-foreground/60">검증 완료 전까지 forward 안 함 → 악의적 메시지 전파 차단.</p>
        </div>
        <p className="leading-7">
          <strong>3단계 검증</strong>: 디코딩 → spec 규칙 → forward 결정.<br />
          ValidationReject는 peer score -80 → 악의적 피어 강력 처벌.<br />
          검증 완료 전까지 forward 안 함 → 잘못된 메시지 전파 방지.
        </p>
      </div>
      <div className="not-prose mt-6"><GossipsubMeshViz /></div>
    </section>
  );
}
