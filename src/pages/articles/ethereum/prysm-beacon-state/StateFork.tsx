import type { CodeRef } from "@/components/code/types";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function StateFork({ onCodeRef: _ }: Props) {
  return (
    <section id="state-fork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">포크별 상태 변형</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── Fork 진화 ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          BeaconState는 포크 버전에 따라 해석한다
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              {
                name: "Phase0",
                date: "기본 스키마",
                desc: "검증자·잔액·체크포인트·과거 루트",
              },
              {
                name: "Altair",
                date: "상태 확장",
                desc: "참여 플래그·inactivity scores·sync committees",
              },
              {
                name: "Bellatrix",
                date: "실행 계층 연결",
                desc: "latest execution payload header",
              },
              {
                name: "Capella",
                date: "출금 지원",
                desc: "withdrawal index와 historical summaries",
              },
              {
                name: "Deneb",
                date: "타입 갱신",
                desc: "blob gas 필드를 포함하는 실행 payload header 타입",
              },
              {
                name: "Electra 이후",
                date: "버전별 스키마",
                desc: "pending deposits·withdrawals·consolidations 등",
              },
            ].map((f) => (
              <div
                key={f.name}
                className="rounded-lg border border-border/60 p-3"
              >
                <p className="font-semibold text-sm">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.date}</p>
                <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              포크별 타입 + 공통 인터페이스
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
              <div>
                <p className="text-xs font-semibold text-foreground/70 mb-1">
                  각 포크별 별도 타입
                </p>
                <ul className="space-y-0.5 font-mono text-xs">
                  <li>BeaconStatePhase0</li>
                  <li>BeaconStateAltair</li>
                  <li>BeaconStateBellatrix</li>
                  <li>BeaconStateCapella</li>
                  <li>BeaconStateDeneb / Electra / Fulu …</li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground/70 mb-1">
                  공통 인터페이스
                </p>
                <ul className="space-y-0.5 font-mono text-xs">
                  <li>Slot() Slot</li>
                  <li>Validators() []Validator</li>
                  <li>Version() int</li>
                  <li>HashTreeRoot() [32]byte</li>
                </ul>
                <p className="text-xs mt-1">
                  포크별 고유 메서드는 type assertion 필요
                </p>
              </div>
            </div>
          </div>
        </div>
        <p>
          BeaconState는 영구히 고정된 하나의 Go struct가 아니라 <strong>fork별 SSZ schema</strong>로 진화합니다. 어떤 fork는 field를 추가하고 다른 fork는 nested type이나 transition rule을 바꿉니다. Prysm은 공통 read interface와 fork별 concrete type·upgrade function을 함께 사용해 호출부가 모든 schema 차이를 직접 다루지 않게 합니다.
        </p>

        {/* ── Upgrade 함수 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          UpgradeToXxx — 포크 활성화 시 state 변환
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>UpgradeToAltair(preState)</code> 예시
            </p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>
                <strong>공통 필드 이관</strong> &mdash; GenesisTime, Slot,
                Validators, Balances 등
              </li>
              <li>
                <strong>Fork 버전 갱신</strong> &mdash;{" "}
                <code>CurrentVersion = ALTAIR_FORK_VERSION</code>
              </li>
              <li>
                <strong>신규 필드 초기화</strong>:
                <ul className="ml-6 mt-1 space-y-0.5">
                  <li>
                    <code>InactivityScores</code>: 모두 0
                  </li>
                  <li>
                    <code>PreviousEpochParticipation</code>: PendingAttestation
                    &rarr; ParticipationFlags 변환
                  </li>
                  <li>
                    <code>CurrentEpochParticipation</code>: 빈 배열
                  </li>
                  <li>
                    <code>Current/NextSyncCommittee</code>: 스펙의 결정론적
                    위원회 계산으로 초기화
                  </li>
                </ul>
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              명시적 스키마 마이그레이션
            </p>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                이전 포크 상태를 다음 포크 타입으로 옮기고 새 필드의 초기값을
                계산
              </li>
              <li>
                복사·참조 공유 방식은 Prysm의 상태 표현과 COW 구현에 따라 달라짐
              </li>
              <li>
                <strong>Trigger</strong>: 네트워크 설정의 fork epoch/version에
                맞춰 상태 전환 경로에서 호출
              </li>
            </ul>
          </div>
        </div>
        <p>
          <code>UpgradeToXxx</code> 계열 function은 old schema의 공통 field를 새 state로 옮기고 신규 field를 specification이 정한 initial value로 채웁니다. 이 변환을 실행할 epoch는 source code에 적힌 연도가 아니라 선택한 network의 fork configuration으로 결정됩니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 버전 경계</strong> — <code>UpgradeToAltair()</code> 같은
          function은 두 SSZ schema 사이의 protocol conversion을 한곳에 모읍니다. 새 field 초기값과 fork version은 consensus rule이지만 internal memory sharing과 allocation 방식은 implementation detail입니다. 지원 fork와 activation epoch는 현재 Prysm build와 network configuration에서 확인해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-violet-500/50 pl-3 text-sm">
          <strong>💡 상태와 블록의 경계</strong> — Bellatrix는{" "}
          <code>latestExecutionPayloadHeader</code>를 state에 추가했지만, Deneb의 <code>blobKzgCommitments</code>는 BeaconBlockBody field이지 BeaconState field가 아닙니다. State field, nested type과 block-body field를 구분하고 <code>Version()</code>에 맞는 logic을 선택해야 합니다.
        </p>
      </div>
    </section>
  );
}
