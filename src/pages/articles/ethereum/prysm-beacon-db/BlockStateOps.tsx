import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function BlockStateOps({ onCodeRef }: Props) {
  return (
    <section id="block-state-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 & 상태 CRUD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── SaveBlock ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">SaveBlock</h3>
        <p className="leading-7">
          블록의 <code>HashTreeRoot()</code>를 키로, SSZ 바이트를 값으로 저장한다.<br />
          슬롯→루트 인덱스도 함께 기록해 슬롯 기반 조회를 지원한다.
        </p>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>SaveBlock</code> 흐름</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>block.Block.HashTreeRoot()</code> — 블록 루트 계산 (캐시 가능)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><code>block.MarshalSSZ()</code> — SSZ 직렬화</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><code>blocksBucket.Put(root, encoded)</code> — blocks bucket에 저장</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">4</span>
                <div>인덱스 업데이트 — <code>blockSlotIndicesBucket</code> (slot → root) + <code>blockParentRootIndicesBucket</code> (root → parent)</div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">성능 특성</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-muted-foreground">
              <div>블록 크기: ~100 KB</div>
              <div>SSZ encode: ~5ms</div>
              <div>bbolt write: ~10ms (fsync)</div>
              <div className="font-medium text-foreground">총 ~15ms / slot 12초</div>
            </div>
          </div>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-block', codeRefs['save-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">SaveBlock()</span>
          <CodeViewButton onClick={() => onCodeRef('get-block', codeRefs['get-block'])} />
          <span className="text-[10px] text-muted-foreground self-center">Block()</span>
        </div>

        {/* ── SaveState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SaveState</h3>
        <p className="leading-7">
          상태는 블록보다 훨씬 크다 (수백 MB).<br />
          <strong>에폭 경계</strong>에서만 상태를 저장하고, 중간 슬롯은 StateSummary로 대체한다.
        </p>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2"><code>SaveState</code> 흐름</h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">1</span>
                <div><code>shouldSaveState(slot)</code> — K-slot 정책 판단. skip 시 <code>saveStateSummary()</code> 만 기록</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">2</span>
                <div><code>st.MarshalSSZ()</code> — SSZ 직렬화 (~250 MB)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">3</span>
                <div><code>stateBucket.Put(blockRoot, encoded)</code> — state bucket에 저장 (대형 write TX)</div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">4</span>
                <div><code>stateSummaryBucket.Put(blockRoot, summary)</code> — StateSummary 업데이트</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">저장 비용</h4>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>SSZ marshal: ~200ms</span>
                <span>bbolt write TX: ~500ms</span>
                <span>fsync: ~50ms (SSD)</span>
                <span className="font-medium text-foreground">총 ~700ms / state</span>
              </div>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">최적화</h4>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <li>비동기 저장 (백그라운드 goroutine)</li>
                <li>중요 경로(fork choice)에서는 비차단</li>
                <li>주기적 flush</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('save-state', codeRefs['save-state'])} />
          <span className="text-[10px] text-muted-foreground self-center">SaveState()</span>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 에폭 경계 저장 전략</strong> — 매 슬롯 저장 대비 디스크 사용량 1/32.<br />
          중간 슬롯 상태가 필요하면 가장 가까운 에폭 경계 상태에서 Replay.<br />
          최대 31슬롯(~6.2분) 재생으로 트레이드오프.
        </p>
      </div>
    </section>
  );
}
