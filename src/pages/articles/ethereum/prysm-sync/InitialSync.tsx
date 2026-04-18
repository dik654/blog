import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function InitialSync({ onCodeRef }: Props) {
  return (
    <section id="initial-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initial Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Initial Sync는 <code>BlocksByRange</code> RPC를 사용해 피어에서 블록을 배치로 요청한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('round-robin-sync', codeRefs['round-robin-sync'])} />
          <span className="text-[10px] text-muted-foreground self-center">roundRobinSync()</span>
          <CodeViewButton onClick={() => onCodeRef('blocks-by-range-handler', codeRefs['blocks-by-range-handler'])} />
          <span className="text-[10px] text-muted-foreground self-center">BlocksByRange 핸들러</span>
        </div>

        {/* ── BlocksByRange 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BlocksByRange RPC — 배치 다운로드</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2"><code>BeaconBlocksByRangeRequest</code> — P2P RPC 프로토콜</p>
            <p className="text-xs text-foreground/60 mb-2 font-mono">/eth2/beacon_chain/req/beacon_blocks_by_range/2/ssz_snappy</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span><code>start_slot: Slot</code> — 시작 slot</span>
              <span><code>count: uint64</code> — 요청 수(max 1024)</span>
              <span><code>step: uint64</code> — 간격(보통 1)</span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>requestBlocksByRange()</code> — 클라이언트 요청 흐름</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80">libp2p stream 열기 — <code>host.NewStream(ctx, peer, blocksByRangeTopic)</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80">요청 Snappy 인코딩 + 전송 — <code>encodeSnappy(req)</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80">응답 streaming 수신 — <code>readSnappyStream()</code>로 block 순차 디코딩</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">count max: 1024</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">응답: ~100MB 이내, 10초 timeout</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">Rate limit: ~5000 blocks/min/peer</div>
          </div>
        </div>
        <p className="leading-7">
          <code>BlocksByRange</code>가 <strong>배치 다운로드 표준</strong>.<br />
          한 번에 최대 1024 blocks → 효율적 bulk transfer.<br />
          libp2p stream 기반 SSZ-Snappy 인코딩.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">라운드로빈 전략</h3>
        <ul>
          <li><strong>피어 필터링</strong> — 헤드 슬롯이 우리보다 앞선 피어만 선택</li>
          <li><strong>범위 분배</strong> — [0-63] → 피어A, [64-127] → 피어B 식으로 분산</li>
          <li><strong>응답 정렬</strong> — 도착 순서 무관하게 슬롯 순으로 정렬</li>
          <li><strong>순차 처리</strong> — 상태 전환은 반드시 슬롯 순서대로 실행</li>
        </ul>

        {/* ── roundRobinSync 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">roundRobinSync — 병렬 다운로드 알고리즘</h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3"><code>roundRobinSync()</code> — 병렬 다운로드 알고리즘</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">1</span>
                <div className="text-foreground/80"><strong>피어 선택</strong> — <code>Peers().AheadOfUs()</code>로 head slot이 우리보다 앞선 피어만</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">2</span>
                <div className="text-foreground/80"><strong>범위 분할</strong> — <code>BATCH_SIZE=64</code>로 <code>SlotRange</code> chunks 생성</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">3</span>
                <div className="text-foreground/80"><strong>Round-robin 할당</strong> — <code>peers[i % len(peers)]</code>로 chunk별 다른 피어에 goroutine 병렬 요청</div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">4</span>
                <div className="text-foreground/80"><strong>응답 수집 + 정렬</strong> — 도착 순서 무관, slot 순 <code>sort.Slice</code></div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">5</span>
                <div className="text-foreground/80"><strong>순차 실행</strong> — <code>chain.ProcessBlock(block)</code> slot 순서대로. 실패 시 sync 중단</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">다운로드: 병렬(peer 수만큼)</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">실행: 순차(state 제약)</div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">메인넷 ~1500만 slot: ~24시간</div>
          </div>
        </div>
        <p className="leading-7">
          <strong>Round-robin + 병렬 다운로드 + 순차 실행</strong>.<br />
          chunk별 다른 peer 할당 → bandwidth 최대 활용.<br />
          state transition은 순차 필수 → execution 병목.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 병렬 다운로드 + 순차 실행</strong> — 다운로드는 여러 피어에 병렬 분산하지만 상태 전환은 반드시 순차 실행해야 함.<br />
          slot N의 상태가 slot N+1의 입력.<br />
          이 구조가 Initial Sync의 근본적 속도 한계.
        </p>
      </div>
    </section>
  );
}
