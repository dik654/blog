import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Validator snapshot",
  "Block B41",
  "Header hash",
  "Canonical vote",
  "A signs",
  "B signs",
  "Commit verifies",
  "Conflicting vote",
] as const;

const SHORT = ["검증자", "Block", "Hash", "서명문", "A 40", "B 35", "Commit", "Evidence"] as const;

const NOTES = [
  "높이 41의 역사적 ValidatorSet은 A 40, B 35, C 25입니다. 이 snapshot의 공개키와 power가 이후 서명 검증과 문턱 계산의 기준입니다.",
  "제안자가 transaction과 evidence를 담은 B41을 만듭니다. Header는 현재 DataHash와 직전 높이의 LastCommitHash·AppHash를 함께 묶습니다.",
  "Header.Hash()가 정해진 필드 순서대로 Merkle commitment HB41을 만듭니다. Vote는 block 전체 bytes 대신 이 BlockID를 가리킵니다.",
  "서명 입력은 demo-1·height 41·round 0·PRECOMMIT·HB41을 canonical form으로 고정합니다. Validator 주소와 index는 이 canonical vote에 들어가지 않습니다.",
  "A의 공개키로 signature를 검증한 뒤, 같은 BlockID 묶음에 power 40을 한 번만 더합니다. 아직 2/3을 넘지 못했습니다.",
  "B의 유효한 precommit을 더하면 HB41에 모인 power는 75가 됩니다. C가 absent여도 75는 전체 100의 2/3보다 큽니다.",
  "VerifyCommit은 좌표·BlockID·historical set을 확인하고 absent를 건너뛰며 commit flag의 power만 셉니다. 75/100이므로 B41의 Commit certificate가 성립합니다.",
  "A가 같은 height·round·type에서 다른 BlockID에도 서명했다면 Commit을 되돌리는 표가 아니라 DuplicateVoteEvidence 후보입니다. 과거 membership·두 서명·age를 별도 검증한 뒤 application에 전달합니다.",
] as const;

const STATES = [
  { object: "ValidatorSet V41", coordinates: "h41 · public keys · total 100", block: "아직 없음", signed: 0, a: "대기", b: "대기", c: "대기", receipt: "검증 기준 고정" },
  { object: "Block B41", coordinates: "Data · Evidence · LastCommit", block: "아직 hash 없음", signed: 0, a: "대기", b: "대기", c: "대기", receipt: "제안된 payload" },
  { object: "Header commitment", coordinates: "정해진 field 순서", block: "BlockID · HB41", signed: 0, a: "대기", b: "대기", c: "대기", receipt: "B41 identity" },
  { object: "CanonicalVote", coordinates: "demo-1 · h41 · r0 · PRECOMMIT", block: "HB41", signed: 0, a: "서명 입력 준비", b: "대기", c: "대기", receipt: "domain-bound bytes" },
  { object: "Precommit A", coordinates: "h41 · r0 · PRECOMMIT", block: "HB41", signed: 40, a: "commit · +40", b: "대기", c: "대기", receipt: "40/100 · 미달" },
  { object: "Precommit A+B", coordinates: "같은 h/r/type", block: "같은 HB41", signed: 75, a: "commit · +40", b: "commit · +35", c: "absent", receipt: "75/100 · 문턱 통과" },
  { object: "Commit C41", coordinates: "historical V41로 검증", block: "HB41", signed: 75, a: "signature OK", b: "signature OK", c: "absent · +0", receipt: "B41 결정 증거" },
  { object: "이중 서명 증거", coordinates: "DuplicateVoteEvidence · A", block: "HB41 ↔ 다른 BlockID", signed: 75, a: "상충 서명 2개", b: "Commit 유지", c: "absent", receipt: "처벌 전 검증 후보" },
] as const;

function ValidatorRow({ name, power, status, active }: { name: string; power: number; status: string; active: boolean }) {
  return (
    <div className={`grid min-w-0 grid-cols-[2.5rem_3rem_minmax(0,1fr)] items-center gap-2 border-b border-border px-2 py-2.5 text-[10px] sm:px-3 sm:text-xs ${active ? "bg-primary/10" : "bg-background"}`}>
      <strong>{name}</strong>
      <span className="font-mono text-muted-foreground">{power}</span>
      <span className="min-w-0 break-keep font-medium">{status}</span>
    </div>
  );
}

export default function CometBFTTypesEvidenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200, { loop: false });
  const tabsRef = useRef<HTMLDivElement>(null);
  const state = STATES[scenes.active];

  useEffect(() => {
    const scroller = tabsRef.current;
    const target = scroller?.querySelector<HTMLElement>('button[aria-pressed="true"]');
    if (!scroller || !target) return;
    const left = target.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: left - (scroller.clientWidth - target.offsetWidth) / 2, behavior: "auto" });
  }, [scenes.active]);

  return (
    <VizFrame
      eyebrow="CometBFT v0.40.0 · block 하나의 검증 증거"
      title="B41이 제안에서 75/100 Commit이 되고 상충 서명이 Evidence로 갈라지는 과정"
      description="같은 객체 이름을 외우기보다, 다음 verifier가 어떤 bytes·좌표·historical power를 받아 무엇을 확인하는지 장면별로 따라갑니다."
      note="B41·HB41·validator 이름과 power는 설명용 고정 예시입니다. 필드와 검증 순서는 commit 0880b4d3의 공식 소스로 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cometbft-types-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Block과 Vote와 Commit과 Evidence를 여덟 장면으로 추적"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-scene-stage>
          <div ref={tabsRef} className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-px bg-border p-px" style={{ width: "max(100%, 620px)" }}>
              {SCENES.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  aria-pressed={index === scenes.active}
                  onClick={() => scenes.setActive(index)}
                  className={`min-h-11 min-w-0 bg-background px-1 py-1 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary lg:py-2 ${index === scenes.active ? "text-primary" : index < scenes.active ? "text-foreground" : "text-muted-foreground"}`}
                >
                  <span className="block font-mono text-[8px] font-black">{String(index + 1).padStart(2, "0")}</span>
                  <strong className="mt-1 block break-keep text-[7px] leading-3 lg:hidden">{SHORT[index]}</strong>
                  <strong className="mt-1 hidden break-keep text-[8px] leading-3 lg:block">{label}</strong>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 min-h-[25rem] border-y border-border py-3 sm:min-h-[28rem] sm:py-4">
            <div className="grid grid-cols-2 gap-px bg-border p-px">
              <div className="min-w-0 bg-background p-3 sm:p-4">
                <span className="text-[8px] font-bold text-muted-foreground sm:text-[9px]">현재 객체</span>
                <strong className="mt-2 block break-keep text-xs leading-5 sm:text-sm">{state.object}</strong>
                <p className="mt-2 break-keep font-mono text-[10px] leading-5 text-muted-foreground sm:text-xs">{state.coordinates}</p>
              </div>
              <div className="min-w-0 bg-background p-3 sm:p-4">
                <span className="text-[8px] font-bold text-muted-foreground sm:text-[9px]">가리키는 BlockID</span>
                <strong className="mt-2 block break-keep font-mono text-xs leading-5 text-primary sm:text-sm">{state.block}</strong>
                <p className="mt-2 text-[10px] text-muted-foreground sm:text-xs">같은 좌표·같은 BlockID의 commit power · {state.signed}/100</p>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-[minmax(0,1fr)_6.5rem] gap-3 sm:grid-cols-[minmax(0,1fr)_9rem]">
              <div className="border border-border">
                <div className="grid grid-cols-[2.5rem_3rem_minmax(0,1fr)] gap-2 border-b border-border bg-muted/35 px-2 py-2 text-[8px] font-bold text-muted-foreground sm:px-3 sm:text-[9px]">
                  <span>검증자</span><span>Power</span><span>이 장면의 상태</span>
                </div>
                <ValidatorRow name="A" power={40} status={state.a} active={scenes.active === 4 || scenes.active === 7} />
                <ValidatorRow name="B" power={35} status={state.b} active={scenes.active === 5} />
                <ValidatorRow name="C" power={25} status={state.c} active={false} />
              </div>
              <div className={`flex min-h-24 flex-col justify-center border p-3 text-center ${state.signed > 66 ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
                <span className="text-[8px] font-bold text-muted-foreground sm:text-[9px]">COMMIT POWER</span>
                <strong className="mt-2 font-mono text-2xl">{state.signed}</strong>
                <span className="mt-1 text-[9px] text-muted-foreground">필요: &gt; 66⅔</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-[6.5rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[9rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[8px] font-bold text-muted-foreground sm:text-[9px]">남은 영수증</div>
              <div className="min-w-0 bg-background p-3 font-mono text-[10px] font-bold leading-5 text-primary sm:text-xs">{state.receipt}</div>
            </div>

            <p data-scene-note className="mt-3 min-h-[6.5rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[7rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="합의 증거 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
