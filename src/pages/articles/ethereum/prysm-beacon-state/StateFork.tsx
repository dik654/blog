import type { CodeRef } from '@/components/code/types';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function StateFork({ onCodeRef: _ }: Props) {
  return (
    <section id="state-fork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">포크별 상태 변형</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── Fork 진화 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">BeaconState의 하드포크별 진화</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { name: 'Phase0', date: '2020-12', desc: '최초 런칭, Basic BeaconState (20 fields)' },
              { name: 'Altair', date: '2021-10', desc: 'SyncCommittee, inactivity_scores, participation flags' },
              { name: 'Bellatrix', date: '2022-09', desc: 'The Merge (PoS), execution_payload_header' },
              { name: 'Capella', date: '2023-04', desc: 'Withdrawals, historical_summaries' },
              { name: 'Deneb', date: '2024-03', desc: 'EIP-4844 Blobs, blob_gas_used' },
              { name: 'Electra', date: '2025 예정', desc: 'pending_balance_deposits, consolidations' },
            ].map(f => (
              <div key={f.name} className="rounded-lg border border-border/60 p-3">
                <p className="font-semibold text-sm">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.date}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">포크별 타입 + 공통 인터페이스</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold text-foreground/70 mb-1">각 포크별 별도 타입</p>
                <ul className="space-y-0.5 font-mono text-xs">
                  <li>BeaconStatePhase0</li>
                  <li>BeaconStateAltair</li>
                  <li>BeaconStateBellatrix</li>
                  <li>BeaconStateCapella</li>
                  <li>BeaconStateDeneb</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/70 mb-1">공통 인터페이스</p>
                <ul className="space-y-0.5 font-mono text-xs">
                  <li>Slot() Slot</li>
                  <li>Validators() []Validator</li>
                  <li>Version() int</li>
                  <li>HashTreeRoot() [32]byte</li>
                </ul>
                <p className="text-xs mt-1">포크별 고유 메서드는 type assertion 필요</p>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          Beacon state가 <strong>5번 포크로 진화</strong>했음.<br />
          각 포크마다 새 필드 추가 → 기존 타입 호환성 유지.<br />
          공통 interface로 추상화 + 포크별 구체 타입 존재.
        </p>

        {/* ── Upgrade 함수 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">UpgradeToXxx — 포크 활성화 시 state 변환</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>UpgradeToAltair(preState)</code> 예시</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>기존 필드 복사</strong> &mdash; GenesisTime, Slot, Validators, Balances 등 (pointer 공유)</li>
              <li><strong>Fork 버전 갱신</strong> &mdash; <code>CurrentVersion = ALTAIR_FORK_VERSION</code></li>
              <li><strong>신규 필드 초기화</strong>:
                <ul className="ml-6 mt-1 space-y-0.5">
                  <li><code>InactivityScores</code>: 모두 0</li>
                  <li><code>PreviousEpochParticipation</code>: PendingAttestation &rarr; ParticipationFlags 변환</li>
                  <li><code>CurrentEpochParticipation</code>: 빈 배열</li>
                  <li><code>Current/NextSyncCommittee</code>: 랜덤 선정</li>
                </ul>
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">In-place 변환 특성</p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>대부분 필드는 pointer 공유 &mdash; 새 필드만 메모리 할당</li>
              <li>원본 state 유지 (rollback 가능)</li>
              <li><strong>Trigger</strong>: <code>ALTAIR_FORK_EPOCH</code> 도달 시 자동 호출 &mdash; 모든 노드가 동일 시점 upgrade</li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          <code>UpgradeToXxx</code>가 <strong>포크 전환의 상태 변환</strong>.<br />
          기존 필드 공유 + 새 필드 초기화 → 메모리 효율적 in-place 변환.<br />
          activation epoch 기점에 모든 노드 동시 전환.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 인플레이스 변환</strong> — UpgradeToAltair() 등으로 기존 상태를 복사하지 않고 제자리에서 변환.<br />
          새 필드(SyncCommittee 등)를 초기화하고 fork 버전을 갱신.<br />
          Phase0 → Altair → Bellatrix → Capella → Deneb 순서.
        </p>

        <p className="text-sm border-l-2 border-violet-500/50 pl-3 mt-4">
          <strong>💡 fieldIndex 확장</strong> — 포크마다 열거형이 확장됨.<br />
          Bellatrix에서 latestExecutionPayloadHeader 추가.<br />
          Deneb에서 blobKzgCommitments 추가 — Version() 메서드로 포크별 로직 분기.
        </p>
      </div>
    </section>
  );
}
