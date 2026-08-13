import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function BlockStateOps({ onCodeRef }: Props) {
  return (
    <section id="block-state-ops" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">블록 & 상태 CRUD</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── SaveBlock ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">SaveBlock</h3>
        <p className="leading-7">
          블록의 <code>HashTreeRoot()</code>를 키로, SSZ 바이트를 값으로
          저장하며 슬롯→루트 index도 함께 기록한다. 따라서 같은 block을 root로
          직접 찾거나 특정 slot의 후보 block을 탐색할 수 있다.
        </p>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>SaveBlock</code> 흐름
            </h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  1
                </span>
                <div>
                  <code>block.Block.HashTreeRoot()</code> — 블록 루트 계산 (캐시
                  가능)
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  2
                </span>
                <div>
                  <code>block.MarshalSSZ()</code> — SSZ 직렬화
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  3
                </span>
                <div>
                  <code>blocksBucket.Put(root, encoded)</code> — blocks bucket에
                  저장
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  4
                </span>
                <div>
                  인덱스 업데이트 — <code>blockSlotIndicesBucket</code> (slot →
                  root) + <code>blockParentRootIndicesBucket</code> (root →
                  parent)
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">관찰할 비용</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div>SSZ 직렬화와 hash-tree-root 계산</div>
              <div>인덱스·본문의 동일 트랜잭션 처리</div>
              <div>스토리지 fsync 정책과 배치 크기</div>
              <div className="font-medium text-foreground">
                실측값은 하드웨어·DB 상태별 측정
              </div>
            </div>
          </div>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() => onCodeRef("save-block", codeRefs["save-block"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            SaveBlock()
          </span>
          <CodeViewButton
            onClick={() => onCodeRef("get-block", codeRefs["get-block"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            Block()
          </span>
        </div>

        {/* ── SaveState ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">SaveState</h3>
        <p className="leading-7">
          전체 BeaconState는 블록보다 크고 같은 필드가 슬롯마다 반복되므로 모든
          상태를 무기한 보존하면 저장 비용이 빠르게 누적된다. 그래서
          Prysm은 체크포인트·상태 요약·재생 가능 구간을 조합하며, 실제 보존
          간격은 버전과 운영 설정에 따라 달라진다.
        </p>
        <div className="not-prose grid gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>SaveState</code> 흐름
            </h4>
            <div className="grid gap-2 text-xs">
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  1
                </span>
                <div>
                  보존 정책 판단 — 직접 저장할 상태와 요약만 남길 상태를 구분
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  2
                </span>
                <div>
                  <code>st.MarshalSSZ()</code> — 선택한 상태를 정규 SSZ 바이트로
                  직렬화
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  3
                </span>
                <div>
                  <code>stateBucket.Put(blockRoot, encoded)</code> — block
                  root에 연결해 상태 저장
                </div>
              </div>
              <div className="flex items-start gap-2 rounded bg-muted/50 p-2">
                <span className="font-mono font-medium shrink-0 w-6 text-center">
                  4
                </span>
                <div>
                  <code>stateSummaryBucket.Put(blockRoot, summary)</code> —
                  StateSummary 업데이트
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="rounded-lg border bg-card p-4">
              <h4 className="font-semibold text-sm mb-2">저장 비용의 구성</h4>
              <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                <span>상태 직렬화</span>
                <span>DB write transaction</span>
                <span>인덱스·summary 갱신</span>
                <span className="font-medium text-foreground">
                  디스크 동기화 정책
                </span>
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
          <CodeViewButton
            onClick={() => onCodeRef("save-state", codeRefs["save-state"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            SaveState()
          </span>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>핵심 트레이드오프</strong> — 상태를 촘촘히 저장할수록 조회는
          빨라지지만 디스크와 쓰기 비용이 커진다.
          요약만 남긴 지점은 가까운 저장 상태와 블록 전이를 이용해 복원한다.
          따라서 저장 간격을 고정된 “epoch당 한 번”으로 일반화하지 않고 현재
          정책과 설정을 함께 확인해야 한다.
        </p>
      </div>
    </section>
  );
}
