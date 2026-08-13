import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import SlotDetailViz from "./viz/SlotDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProcessSlot({ onCodeRef }: Props) {
  return (
    <section id="process-slot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProcessSlot 내부</h2>
      <div className="not-prose mb-8">
        <SlotDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("process-slot", codeRefs["process-slot"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            ProcessSlot()
          </span>
        </div>

        {/* ── ProcessSlot 구현 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          ProcessSlot — 단일 슬롯 전환
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">
              <code>ProcessSlot(state *BeaconState) error</code>
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                {
                  step: "1",
                  label: "이전 slot의 state root 계산",
                  detail: "prevStateRoot = state.HashTreeRoot()",
                },
                {
                  step: "2",
                  label: "latest_block_header.state_root 백필",
                  detail:
                    "header.StateRoot == ZERO_HASH → prevStateRoot로 채움 (circular dependency 해결)",
                },
                {
                  step: "3",
                  label: "state_roots 배열 업데이트",
                  detail:
                    "idx = slot % SLOTS_PER_HISTORICAL_ROOT(8192), state_roots[idx] = prevStateRoot",
                },
                {
                  step: "4",
                  label: "block_roots 갱신",
                  detail: "header.HashTreeRoot() → block_roots[idx]에 저장",
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">
                    {s.step}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">
                      {s.label}
                    </p>
                    <p className="text-foreground/60">
                      <code>{s.detail}</code>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                핵심 개념
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>"slot n의 state" = slot n 시작 직전의 state</div>
                <div>
                  block이 있으면 → <code>process_block</code> 후 state 변경
                </div>
                <div>다음 slot에서 이 state의 root를 state_roots에 저장</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                Ring Buffer
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>
                  <code>SLOTS_PER_HISTORICAL_ROOT = 8192</code>
                </div>
                <div>
                  <code>state_roots[slot % 8192]</code> /{" "}
                  <code>block_roots[slot % 8192]</code>
                </div>
                <div>
                  mainnet preset은 8192이며, 과거 범위는 포크별 historical
                  commitment로 연결
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          ProcessSlot의 핵심:{" "}
          <strong>직전 slot의 state root를 확정해 기록하는 것</strong>이다.
          <code>latest_block_header.state_root</code>가 비어 있으면 현재 계산한
          root로 채우고, state와 block root를 ring buffer에 저장해 이후
          historical proof에서 사용할 수 있게 한다.
        </p>

        {/* ── circular dependency ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          순환 의존성 해결 — state_root backfill
        </h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">
              문제: post-state가 자기 latest block header를 포함
            </p>
            <div className="space-y-1 text-xs text-foreground/70">
              <div>
                블록의 <code>state_root</code>는 이 블록 실행{" "}
                <strong>후</strong> 상태의 root다.
              </div>
              <div>
                동시에 그 상태의 <code>latest_block_header</code>를 그대로
                hash하면 자기 state root를 다시 포함하는 순환이 생긴다.
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-3">
              해결: 상태 안의 latest header를 0으로 두고 다음 slot에 백필
            </p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                {
                  step: "1",
                  text: "제안 블록 body를 구성하고 block.state_root는 계산 전 임시 값으로 둠",
                },
                {
                  step: "2",
                  text: "process_block_header가 상태의 latest_block_header를 만들 때 state_root를 ZERO로 기록",
                },
                {
                  step: "3",
                  text: "나머지 블록 전환을 실행해 post-state root 계산",
                },
                {
                  step: "4",
                  text: "계산된 root를 제안 블록의 state_root에 넣고 그 완성된 블록에 서명",
                },
                {
                  step: "5",
                  text: "수신자는 같은 전환으로 블록의 state_root를 검증",
                },
                {
                  step: "6",
                  text: "다음 ProcessSlot이 상태 내부 latest_block_header.state_root를 이전 state root로 백필",
                },
              ].map((s) => (
                <div key={s.step} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/20 text-emerald-400 shrink-0">
                    {s.step}
                  </span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                결과
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>제안 블록은 계산된 post-state root를 포함한 뒤 서명</div>
                <div>다음 slot에 백필되는 대상은 상태 내부 latest header</div>
                <div>무결성 보존</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">
                검증
              </p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>수신자가 블록 실행 후 동일 state_root 재계산</div>
                <div>header의 state_root와 일치 확인</div>
                <div>이 과정이 consensus의 핵심 불변식</div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          이 backfill 패턴은 state 안에 들어갈 header가 다시 state root를
          요구하는 <strong>circular dependency</strong>를 피한다.
          상태 내부 <code>latest_block_header.state_root</code>를 0으로 두고
          다음 slot에서 이전 상태 root로 채우는 한편,
          제안 블록 자체의 <code>state_root</code>는 post-state 계산 후 채워
          서명한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 상태 루트 백필</strong> — 블록 제안 시점에는 자신의 상태
          루트를 아직 알 수 없으므로 LatestBlockHeader.StateRoot를 0으로 둔다.
          다음 slot의 ProcessSlot이 계산된 이전 state root를 이 자리에 채운다.
        </p>
      </div>
    </section>
  );
}
