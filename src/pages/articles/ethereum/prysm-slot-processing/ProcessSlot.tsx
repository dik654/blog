import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SlotDetailViz from './viz/SlotDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function ProcessSlot({ onCodeRef }: Props) {
  return (
    <section id="process-slot" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ProcessSlot 내부</h2>
      <div className="not-prose mb-8"><SlotDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('process-slot', codeRefs['process-slot'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessSlot()</span>
        </div>

        {/* ── ProcessSlot 구현 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">ProcessSlot — 단일 슬롯 전환</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3"><code>ProcessSlot(state *BeaconState) error</code></p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                { step: '1', label: '이전 slot의 state root 계산', detail: 'prevStateRoot = state.HashTreeRoot()' },
                { step: '2', label: 'latest_block_header.state_root 백필', detail: 'header.StateRoot == ZERO_HASH → prevStateRoot로 채움 (circular dependency 해결)' },
                { step: '3', label: 'state_roots 배열 업데이트', detail: 'idx = slot % SLOTS_PER_HISTORICAL_ROOT(8192), state_roots[idx] = prevStateRoot' },
                { step: '4', label: 'block_roots 갱신', detail: 'header.HashTreeRoot() → block_roots[idx]에 저장' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-indigo-500/20 text-indigo-400 shrink-0">{s.step}</span>
                  <div>
                    <p className="text-sm font-semibold text-foreground/80">{s.label}</p>
                    <p className="text-foreground/60"><code>{s.detail}</code></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">핵심 개념</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>"slot n의 state" = slot n 시작 직전의 state</div>
                <div>block이 있으면 → <code>process_block</code> 후 state 변경</div>
                <div>다음 slot에서 이 state의 root를 state_roots에 저장</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Ring Buffer</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div><code>SLOTS_PER_HISTORICAL_ROOT = 8192</code></div>
                <div><code>state_roots[slot % 8192]</code> / <code>block_roots[slot % 8192]</code></div>
                <div>약 27시간 (8192 x 12초) 분량 유지, 이후 historical_roots로 이동</div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          ProcessSlot의 핵심: <strong>state root를 이전 슬롯에 소급 기록</strong>.<br />
          latest_block_header.state_root를 다음 slot에서 backfill.<br />
          ring buffer로 최근 8192 slot의 roots 유지.
        </p>

        {/* ── circular dependency ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">순환 의존성 해결 — state_root backfill</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
            <p className="font-semibold text-sm text-red-400 mb-2">문제: block 서명 시점에 state_root를 알 수 없음</p>
            <div className="space-y-1 text-xs text-foreground/70">
              <div><code>SignedBeaconBlock.block.state_root</code> = 이 블록 실행 <strong>"후"</strong> state의 hash</div>
              <div>하지만 블록 서명은 실행 <strong>"전"</strong>에 필요 → 닭과 달걀 문제</div>
            </div>
          </div>
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-3">해결: state_root를 0으로 두고 백필</p>
            <div className="space-y-2 text-xs text-foreground/70">
              {[
                { step: '1', text: 'state_root 자리에 ZERO 임시 값' },
                { step: '2', text: '블록 body 채우기 (attestation, etc.)' },
                { step: '3', text: '블록 body로 임시 상태 계산' },
                { step: '4', text: '"slot N의 header" 구성 (header.state_root = ZERO 여전히)' },
                { step: '5', text: 'ProcessBlock 실행 후 state.slot = N → state_roots[N % 8192] = 비어있음' },
                { step: '6', text: 'Slot N+1 시작 → ProcessSlot → state_root 계산 → header.state_root = 계산된 값 (backfill!)' },
              ].map(s => (
                <div key={s.step} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-emerald-500/20 text-emerald-400 shrink-0">{s.step}</span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">결과</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>블록 서명은 state_root 몰라도 가능</div>
                <div>최종 state_root는 다음 slot에 기록</div>
                <div>무결성 보존</div>
              </div>
            </div>
            <div className="rounded-lg border border-border p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">검증</p>
              <div className="space-y-1 text-xs text-foreground/70">
                <div>수신자가 블록 실행 후 동일 state_root 재계산</div>
                <div>header의 state_root와 일치 확인</div>
                <div>이 과정이 consensus의 핵심 불변식</div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <strong>circular dependency</strong>를 backfill 패턴으로 해결.<br />
          블록 서명 시점에 state_root = 0, 다음 slot에서 실제 값 채움.<br />
          이 설계가 proposer의 서명 부담 제거 + 무결성 보장.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 상태 루트 백필</strong> — 블록 제안 시점에는 자신의 상태 루트를 아직 모름.<br />
          LatestBlockHeader.StateRoot를 0으로 두고, 다음 슬롯의 ProcessSlot에서 계산된 루트로 채움.
        </p>
      </div>
    </section>
  );
}
