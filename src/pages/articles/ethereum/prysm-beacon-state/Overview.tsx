import ContextViz from './viz/ContextViz';
import StateStructureViz from './viz/StateStructureViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BeaconState 전체 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 BeaconState의 필드 구성, Copy-on-Write 메커니즘, FieldTrie 해시 캐싱의 내부를 코드 수준으로 추적한다.
        </p>

        {/* ── BeaconState 30+ 필드 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">BeaconState — 30+ 필드 구조체</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Versioning & History</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>genesis_time</code>: <code>uint64</code></li>
                <li><code>genesis_validators_root</code>: <code>Bytes32</code></li>
                <li><code>slot</code>: <code>Slot</code>, <code>fork</code>: <code>Fork</code></li>
                <li><code>block_roots</code>: <code>Vector[Bytes32, 8192]</code></li>
                <li><code>state_roots</code>: <code>Vector[Bytes32, 8192]</code></li>
                <li><code>historical_roots</code>: <code>List[Bytes32, 16M]</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Registry (가장 큰 부분)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>validators</code>: <code>{'List[Validator, 2^40]'}</code></li>
                <li><code>balances</code>: <code>{'List[Gwei, 2^40]'}</code></li>
                <li><code>previous/current_epoch_participation</code></li>
                <li><code>inactivity_scores</code>: <code>{'List[uint64, 2^40]'}</code></li>
              </ul>
              <div className="mt-2 pt-2 border-t border-border/40">
                <p className="font-semibold text-xs text-foreground/70 mb-1">기타 주요 필드</p>
                <ul className="text-sm space-y-0.5 text-muted-foreground">
                  <li><code>randao_mixes</code>: <code>Vector[Bytes32, 65536]</code></li>
                  <li><code>current/next_sync_committee</code>: <code>SyncCommittee</code></li>
                  <li><code>latest_execution_payload_header</code></li>
                  <li><code>finalized_checkpoint</code>: <code>Checkpoint</code></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">메인넷 크기 추정 (2025 기준)</p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-sm text-center">
              <div><p className="text-muted-foreground">validators</p><p className="font-mono">120 MB</p></div>
              <div><p className="text-muted-foreground">balances</p><p className="font-mono">8 MB</p></div>
              <div><p className="text-muted-foreground">participation</p><p className="font-mono">2 MB</p></div>
              <div><p className="text-muted-foreground">inactivity</p><p className="font-mono">8 MB</p></div>
              <div><p className="text-muted-foreground">기타</p><p className="font-mono">~100 MB</p></div>
              <div><p className="text-muted-foreground font-semibold">총</p><p className="font-mono font-semibold">~250 MB</p></div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          BeaconState는 <strong>30+ 필드 거대 구조체</strong>.<br />
          validators 배열이 120MB로 가장 큰 부분.<br />
          매 슬롯(12초)마다 업데이트 + state_root 재계산 필요.
        </p>

        {/* ── Validator 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Validator — registry entry 구조</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">Validator 구조체 (121 bytes, fixed-size)</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-muted-foreground">
              <ul className="space-y-0.5">
                <li><code>pubkey</code>: <code>BLSPubkey</code> (48B)</li>
                <li><code>withdrawal_credentials</code>: <code>Bytes32</code> (32B)</li>
                <li><code>effective_balance</code>: <code>Gwei</code> (8B)</li>
                <li><code>slashed</code>: <code>bool</code> (1B)</li>
              </ul>
              <ul className="space-y-0.5">
                <li><code>activation_eligibility_epoch</code> (8B)</li>
                <li><code>activation_epoch</code> (8B)</li>
                <li><code>exit_epoch</code> (8B)</li>
                <li><code>withdrawable_epoch</code> (8B)</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Validator lifecycle (9단계)</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-1.5">PENDING_INITIALIZED<br/>32 ETH 예치</div>
              <div className="bg-muted/50 rounded p-1.5">PENDING_QUEUED<br/>활성화 대기</div>
              <div className="bg-green-500/10 rounded p-1.5">ACTIVE_ONGOING<br/>정상 동작</div>
              <div className="bg-amber-500/10 rounded p-1.5">ACTIVE_EXITING<br/>exit 대기</div>
              <div className="bg-red-500/10 rounded p-1.5">ACTIVE_SLASHED<br/>슬래싱</div>
              <div className="bg-muted/50 rounded p-1.5">EXITED_UNSLASHED<br/>출금 대기</div>
              <div className="bg-red-500/10 rounded p-1.5">EXITED_SLASHED<br/>슬래싱 exit</div>
              <div className="bg-muted/50 rounded p-1.5">WITHDRAWAL_POSSIBLE<br/>출금 가능</div>
              <div className="bg-muted/50 rounded p-1.5">WITHDRAWAL_DONE<br/>완전 종료</div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">상태 결정: <code>{'epoch >= activation_epoch && epoch < exit_epoch'}</code> &rarr; ACTIVE</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">주요 필드 의미</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li><code>withdrawal_credentials</code>: <code>0x00</code> = BLS 키 기반 (legacy), <code>0x01</code> = EL 주소 (권장)</li>
              <li><code>effective_balance</code>: 실제 balance를 1 ETH 단위로 내림 &mdash; 32.5 ETH &rarr; effective 32 (해시 변화 최소화)</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          각 Validator는 <strong>121 bytes 고정 크기</strong>.<br />
          9가지 lifecycle state → activation/exit epoch로 결정.<br />
          effective_balance는 1 ETH 단위로 rounding → hash 변화 최소화.
        </p>

        {/* ── state 변경 패턴 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">State 변경 패턴 — 매 슬롯의 업데이트</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-blue-500/30 p-4">
              <p className="font-semibold text-sm text-blue-400 mb-2">Slot transition (매 슬롯)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>slot</code> (+1)</li>
                <li><code>state_roots[slot % 8192]</code></li>
                <li><code>block_roots[slot % 8192]</code></li>
                <li><code>historical_roots</code> (32768 slot마다)</li>
              </ul>
            </div>
            <div className="rounded-lg border border-green-500/30 p-4">
              <p className="font-semibold text-sm text-green-400 mb-2">Block processing</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li><code>latest_block_header</code></li>
                <li><code>randao_mixes[epoch % 65536]</code></li>
                <li><code>eth1_data_votes</code></li>
                <li><code>validators</code>, <code>balances</code></li>
                <li><code>participation</code></li>
                <li><code>justification_bits</code></li>
              </ul>
            </div>
            <div className="rounded-lg border border-amber-500/30 p-4">
              <p className="font-semibold text-sm text-amber-400 mb-2">Epoch transition (매 32 슬롯)</p>
              <ul className="text-sm space-y-0.5 text-muted-foreground">
                <li>participation 교대</li>
                <li>validators 보상/페널티</li>
                <li>balances reward 지급</li>
                <li>slashings, randao_mixes</li>
                <li>inactivity_scores</li>
              </ul>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">변경 비율 (일반 슬롯)</p>
            <div className="grid grid-cols-3 gap-3 text-sm text-center">
              <div><p className="text-muted-foreground">변경 필드</p><p className="font-mono">~5개 state 필드</p></div>
              <div><p className="text-muted-foreground">변경 validator</p><p className="font-mono">~1500개 balance/participation</p></div>
              <div><p className="text-muted-foreground">전체 대비</p><p className="font-mono font-semibold">~0.15%</p></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">99.85% 불변 &rarr; FieldTrie 캐싱의 수학적 근거</p>
          </div>
        </div>
        <p className="leading-7">
          매 슬롯 <strong>0.15% 필드만 변경</strong> — 99.85%는 그대로.<br />
          이 불변성이 <code>FieldTrie</code> 해시 캐싱의 수학적 근거.<br />
          변경 필드만 재해시 → state_root 재계산 O(1) 달성.
        </p>
      </div>
      <div className="not-prose mt-6"><StateStructureViz /></div>
    </section>
  );
}
