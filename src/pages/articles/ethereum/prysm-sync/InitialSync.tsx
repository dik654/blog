import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function InitialSync({ onCodeRef }: Props) {
  return (
    <section id="initial-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Initial Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Initial Sync는 <code>BlocksByRange</code> RPC를 사용해 피어에서 블록을
          배치로 요청한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("round-robin-sync", codeRefs["round-robin-sync"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            roundRobinSync()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "blocks-by-range-handler",
                codeRefs["blocks-by-range-handler"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            BlocksByRange 핸들러
          </span>
        </div>

        {/* ── BlocksByRange 프로토콜 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlocksByRange RPC — 배치 다운로드
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              <code>BeaconBlocksByRangeRequest</code> — P2P RPC 프로토콜
            </p>
            <p className="text-xs text-foreground/60 mb-2 font-mono">
              /eth2/beacon_chain/req/beacon_blocks_by_range/2/ssz_snappy
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-1 text-sm text-foreground/80">
              <span>
                <code>start_slot: Slot</code> — 시작 slot
              </span>
              <span>
                <code>count: uint64</code> — 요청할 범위의 원소 수
              </span>
              <span>
                <code>step: uint64</code> — 간격(보통 1)
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>requestBlocksByRange()</code> — 클라이언트 요청 흐름
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  libp2p stream 열기 —{" "}
                  <code>host.NewStream(ctx, peer, blocksByRangeTopic)</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  요청 Snappy 인코딩 + 전송 — <code>encodeSnappy(req)</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  응답 streaming 수신 — <code>readSnappyStream()</code>로 block
                  순차 디코딩
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              요청 상한: fork별 프로토콜 규칙
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              timeout: 클라이언트 설정·피어 상태
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              남용 방지: peer scoring·rate limit
            </div>
          </div>
        </div>
        <p>
          <code>BlocksByRange</code>는 start slot, count와 step으로 연속 범위의 block을 요청하는 consensus-network RPC입니다. Client는 protocol limit 안에서 batch를 나누고 libp2p stream의 SSZ-Snappy response chunk를 검증하며, skipped slot 때문에 response count가 요청 slot 수보다 적을 수 있다는 점도 처리합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">라운드로빈 전략</h3>
        <ul>
          <li>
            <strong>피어 필터링</strong> — 헤드 슬롯이 우리보다 앞선 피어만 선택
          </li>
          <li>
            <strong>범위 분배</strong> — [0-63] → 피어A, [64-127] → 피어B 식으로
            분산
          </li>
          <li>
            <strong>응답 정렬</strong> — 도착 순서 무관하게 슬롯 순으로 정렬
          </li>
          <li>
            <strong>순차 처리</strong> — 상태 전환은 반드시 슬롯 순서대로 실행
          </li>
        </ul>

        {/* ── roundRobinSync 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          roundRobinSync — 병렬 다운로드 알고리즘
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>roundRobinSync()</code> — 병렬 다운로드 알고리즘
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  <strong>피어 선택</strong> — <code>Peers().AheadOfUs()</code>
                  로 head slot이 우리보다 앞선 피어만
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  <strong>범위 분할</strong> — 현재 구현의 batch 설정에 따라{" "}
                  <code>SlotRange</code> chunks 생성
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  <strong>Round-robin 할당</strong> —{" "}
                  <code>peers[i % len(peers)]</code>로 chunk별 다른 피어에
                  goroutine 병렬 요청
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  <strong>응답 수집 + 정렬</strong> — 도착 순서 무관, slot 순{" "}
                  <code>sort.Slice</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">
                  5
                </span>
                <div className="text-foreground/80">
                  <strong>의존 순서 적용</strong> — 부모와 중간 empty slot을
                  처리한 상태 위에서 블록 검증·가져오기
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              다운로드: 병렬(peer 수만큼)
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              실행: 순차(state 제약)
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              완료 시간: checkpoint·피어·디스크에 좌우
            </div>
          </div>
        </div>
        <p>
          Initial sync는 range batch를 여러 peer에 분산해 network I/O를 병렬화할 수 있지만 state transition은 parent state에 의존하므로 canonical order로 적용해야 합니다. Download queue는 out-of-order response를 잠시 보관하고 빠진 range를 다시 요청한 뒤 contiguous block만 execution path에 넘깁니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 병렬 다운로드 + 순차 실행</strong> — 다운로드는 여러 피어에
          분산하지만 state transition은 parent order를 지킵니다. Block이 없는 slot도 <code>process_slots</code>로 전진해 다음 block의 pre-state를 만들며, 전체 sync 시간은 checkpoint 시작점, peer quality, validation cost와 storage 성능에 함께 좌우됩니다.
        </p>
      </div>
    </section>
  );
}
