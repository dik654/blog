import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function RegularSync({ onCodeRef }: Props) {
  return (
    <section id="regular-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Regular Sync</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Initial sync가 chain head에 충분히 가까워지면 Prysm은 regular sync로 전환해 GossipSub에서 새 block과 operation을 받습니다. Gossip은 low-latency 기본 경로이고 누락된 parent나 referenced block은 request-response RPC로 보충합니다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("save-received-block", codeRefs["save-received-block"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            processBlock()
          </span>
        </div>

        {/* ── Regular Sync 처리 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          실시간 블록 수신 파이프라인
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-3">
              <code>beaconBlockSubscriber()</code> — 블록 처리 7단계
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-3 items-start border-l-2 border-blue-500/50 pl-3">
                <span className="font-mono text-xs text-blue-500 shrink-0">
                  1
                </span>
                <div className="text-foreground/80">
                  Gossip-level validation 이미 완료 (
                  <code>validateBeaconBlockPubSub</code>)
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-green-500/50 pl-3">
                <span className="font-mono text-xs text-green-500 shrink-0">
                  2
                </span>
                <div className="text-foreground/80">
                  블록 디코딩 — <code>decodeBlock(msg.Data)</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-purple-500/50 pl-3">
                <span className="font-mono text-xs text-purple-500 shrink-0">
                  3
                </span>
                <div className="text-foreground/80">
                  parent 존재 확인 — 없으면 <code>pendingQueue.add(block)</code>
                  으로 대기
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-orange-500/50 pl-3">
                <span className="font-mono text-xs text-orange-500 shrink-0">
                  4
                </span>
                <div className="text-foreground/80">
                  전체 state transition —{" "}
                  <code>chain.ProcessBlock(ctx, block)</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-red-500/50 pl-3">
                <span className="font-mono text-xs text-red-400 shrink-0">
                  5
                </span>
                <div className="text-foreground/80">
                  Fork choice 업데이트 —{" "}
                  <code>forkChoice.OnBlock(ctx, block, blockRoot, state)</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-cyan-500/50 pl-3">
                <span className="font-mono text-xs text-cyan-500 shrink-0">
                  6
                </span>
                <div className="text-foreground/80">
                  Head 재계산 — <code>forkChoice.GetHead()</code> → 변경 시{" "}
                  <code>notifyEngineForkChoice()</code>
                </div>
              </div>
              <div className="flex gap-3 items-start border-l-2 border-yellow-500/50 pl-3">
                <span className="font-mono text-xs text-yellow-500 shrink-0">
                  7
                </span>
                <div className="text-foreground/80">
                  Pending queue 재확인 — 이 block이 parent였던 children 처리
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs text-center">
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              Gossip: 전파·검증
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              Decode: fork별 SSZ
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              State: 블록 내용 의존
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              Fork choice: tree·vote 의존
            </div>
            <div className="rounded border border-border/40 p-2 text-foreground/60">
              전체: 부하에서 측정
            </div>
          </div>
        </div>
        <p>
          Regular sync path는 gossip validation, parent state lookup, consensus state transition, execution payload validation과 fork-choice insertion을 연결합니다. 단계의 정확한 호출 순서는 fork와 client implementation에 따라 달라질 수 있으며, end-to-end latency는 block contents, cache hit, peer·database 상태와 hardware를 포함해 관찰해야 합니다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실시간 처리 흐름</h3>
        <ul>
          <li>
            <strong>GossipSub 수신</strong> — beacon_block 토픽에서 블록 도착
          </li>
          <li>
            <strong>검증</strong> — 서명, 제안자, 부모 존재 여부 확인
          </li>
          <li>
            <strong>상태 전환</strong> — 슬롯 처리 + 블록 처리 실행
          </li>
          <li>
            <strong>Fork Choice 갱신</strong> — OnBlock() 호출로 헤드 재계산
          </li>
        </ul>

        {/* ── BlocksByRoot fallback ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          BlocksByRoot — gossip fallback
        </h3>
        <div className="not-prose space-y-3 my-4">
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-1">
              <code>BeaconBlocksByRootRequest</code> — Gossip fallback RPC
            </p>
            <p className="text-xs text-foreground/60 mb-2 font-mono">
              /eth2/beacon_chain/req/beacon_blocks_by_root/2/ssz_snappy
            </p>
            <p className="text-sm text-foreground/80">
              <code>List[Root, MAX_REQUEST_BLOCKS]</code> — block root 목록으로
              직접 요청하며 상한은 해당 fork의 프로토콜 설정을 따른다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              사용 시나리오
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                Attestation 수신 시 head block root 모름 → 요청
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                GossipSub topic 미가입인데 특정 block 필요
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                Pending queue의 누락된 parent 요청
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/70">
                Reorg 복구 — side chain 블록 수집
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/30 p-4">
            <p className="text-xs font-bold text-foreground/70 mb-2">
              <code>requestMissingBlock(root)</code> — Prysm 구현
            </p>
            <p className="text-sm text-foreground/80 mb-2">
              모든 connected peer에게 순차 시도.{" "}
              <code>requestBlocksByRoot(peer, []Root{"{root}"})</code>로 요청.
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center">
              <div className="rounded border border-border/40 p-2 text-foreground/60">
                요청량: protocol/config 제한
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/60">
                실패·남용: peer score 반영
              </div>
              <div className="rounded border border-border/40 p-2 text-foreground/60">
                보관 기한: pending 설정
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>BlocksByRoot</code>는 gossip에서 놓친 parent나 referenced head를 root로 직접 요청하는 recovery path입니다. Request limit과 peer score를 지키면서 여러 peer를 시도하고, 받은 block은 gossip object와 같은 validation boundary를 통과시켜야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 BlocksByRoot 폴백</strong> — GossipSub 전파 지연이나
          network 지연으로 missing block이 생겼을 때 <code>BlocksByRoot</code> RPC로 개별 요청하는 safety net입니다. 장기간의 큰 gap은 이 경로를 반복하기보다 range sync로 넘겨야 합니다.
        </p>
      </div>
    </section>
  );
}
