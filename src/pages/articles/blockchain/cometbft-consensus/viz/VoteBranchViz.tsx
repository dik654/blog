import SceneShell from "./SceneShell";

/**
 * 본문 대응: #round-state — prevote는 lock → proposal → 두 검증 순으로, precommit은 +2/3 prevote의 BlockID로 갈린다.
 * precommit 셋째 질문은 코드 패널 enterPrecommit의 relock·lock 해제 분기다.
 * reach는 path가 멈춘 질문의 위치, exit가 참이면 그 질문의 옆길로 끝난다.
 */
interface Question {
  ask: string;
  exitWhen: string;
  exit: string;
}

const PREVOTE: readonly Question[] = [
  { ask: "이미 다른 block을 lock했나요?", exitWhen: "예", exit: "LockedBlock 우선" },
  { ask: "완성된 Proposal이 있나요?", exitWhen: "아니오", exit: "nil에 prevote" },
  { ask: "ValidateBlock과 ProcessProposal을 모두 통과했나요?", exitWhen: "아니오", exit: "nil에 prevote" },
];

const PRECOMMIT: readonly Question[] = [
  { ask: "+2/3 prevote가 모인 BlockID가 있나요?", exitWhen: "없음", exit: "nil에 precommit" },
  { ask: "그 BlockID가 nil인가요?", exitWhen: "예", exit: "기존 lock 해제 · nil에 precommit" },
  { ask: "그 BlockID가 현재 proposal B41인가요?", exitWhen: "아니오", exit: "lock한 block이면 round만 갱신 · 아니면 lock 해제 · nil" },
];

interface Scene {
  label: string;
  summary: string;
  note: string;
  stage: "prevote" | "precommit";
  reach: number;
}

const SCENES: readonly Scene[] = [
  { label: "lock이 있으면", summary: "새 proposal보다 LockedBlock", stage: "prevote", reach: 0, note: "이미 다른 block을 lock한 node는 새 proposal보다 LockedBlock을 우선합니다. 이 사례의 round 1에는 아직 lock이 없습니다." },
  { label: "제안이 없으면", summary: "round 0의 경우", stage: "prevote", reach: 1, note: "Round 0에서 A의 proposal을 받지 못한 validator는 nil(어느 block도 고르지 않는 표)에 prevote합니다. A와 B의 nil이 75/100이 되어도 B41 같은 block을 lock하지는 않습니다." },
  { label: "검증에서 거부되면", summary: "한쪽만 거부해도 nil", stage: "prevote", reach: 2, note: "consensus의 ValidateBlock과 application의 ProcessProposal 중 어느 검증에서든 거부되면 nil에 prevote합니다." },
  { label: "모두 통과하면", summary: "B41에 prevote", stage: "prevote", reach: 3, note: "Round 1에서 B가 보낸 B41은 먼저 두 검증을 모두 통과해야 합니다. 받았다는 사실만으로 prevote하지 않습니다." },
  { label: "모인 곳이 없으면", summary: "nil에 precommit", stage: "precommit", reach: 0, note: "+2/3(전체 power의 3분의 2 초과)가 한 BlockID(투표 대상 block의 식별자)에 모이지 않으면 nil에 precommit합니다." },
  { label: "+2/3가 nil이면", summary: "lock 해제 · nil", stage: "precommit", reach: 1, note: "+2/3가 nil을 가리키면 기존 lock을 해제하고 nil에 precommit합니다. Round 번호가 커졌다는 이유만으로 lock을 버리는 것과는 다릅니다." },
  { label: "+2/3가 B41이면", summary: "lock 저장 · B41", stage: "precommit", reach: 3, note: "+2/3가 현재 B41을 가리키면 LockedRound와 LockedBlock과 BlockParts를 함께 저장하고 B41에 precommit합니다." },
];

function Ladder({ questions, reach, finish }: { questions: readonly Question[]; reach: number; finish: string }) {
  return (
    <div className="space-y-1">
      {questions.map((question, index) => {
        const passed = index < reach;
        const stopped = index === reach;
        return (
          <div key={question.ask} className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-stretch gap-1.5">
            <div className={`flex items-center rounded-lg border px-2 py-1.5 text-xs leading-5 sm:text-sm ${passed || stopped ? "border-primary bg-background font-semibold" : "border-border text-muted-foreground"}`}>
              {question.ask}
            </div>
            <div className={`flex flex-col justify-center rounded-lg border px-2 py-1.5 text-xs leading-5 sm:text-sm ${stopped ? "border-amber-600 bg-amber-500 font-bold text-black" : "border-dashed border-border text-muted-foreground"}`}>
              <span className="text-[11px]">{question.exitWhen} →</span>
              <span>{question.exit}</span>
            </div>
          </div>
        );
      })}
      <div className={`rounded-lg border px-2 py-1.5 text-center text-xs font-bold sm:text-sm ${reach === questions.length ? "border-amber-600 bg-amber-500 text-black" : "border-dashed border-border font-normal text-muted-foreground"}`}>
        모두 지나면 ↓ {finish}
      </div>
    </div>
  );
}

export default function VoteBranchViz() {
  return (
    <SceneShell
      eyebrow="한 node의 두 번의 판단"
      title="무엇에 투표할지는 두 번의 갈림길이 정합니다"
      description="위 질문부터 차례로 묻고, 주황 칸에서 판단이 끝납니다."
      ariaLabel="prevote와 precommit에서 투표 대상이 갈리는 조건"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <p className="mb-2 text-xs font-bold text-primary">{scene.stage === "prevote" ? "1. Prevote: 무엇에 prevote할까" : "2. Precommit: prevote 집계를 보고"}</p>
            {scene.stage === "prevote" ? (
              <Ladder questions={PREVOTE} reach={scene.reach} finish="B41에 prevote" />
            ) : (
              <Ladder questions={PRECOMMIT} reach={scene.reach} finish="LockedRound·LockedBlock·BlockParts 저장 · B41에 precommit" />
            )}
          </div>
        );
      }}
    />
  );
}
