import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import ResponsiveVizTable from "@/components/viz/ResponsiveVizTable";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const ROUND_LABELS = ["제안", "1차 투표", "잠금과 2차 투표", "결정", "실패한 라운드"] as const;

const ROUND_STATES = [
  {
    question: "이번 높이에 어느 블록을 놓을까요?",
    action: "0라운드 제안자가 블록 X와 제안 서명을 보냅니다.",
    evidence: "height 120 · round 0 · block X · POLRound -1",
    votes: ["V0 40: X 수신", "V1 30: X 수신", "V2 20: X 수신", "V3 10: 지연"],
    result: "아직 결정되지 않았습니다. 각 검증자가 X의 유효성과 자기 잠금을 따로 확인합니다.",
  },
  {
    question: "내 잠금과 제안을 함께 보면 무엇에 1차 투표해야 할까요?",
    action: "잠금이 없고 X가 유효한 V0·V1·V2가 X에 prevote합니다.",
    evidence: "서로 다른 검증자의 prevote(X) power = 40+30+20 = 90",
    votes: ["V0 40: prevote X", "V1 30: prevote X", "V2 20: prevote X", "V3 10: 미도착"],
    result: "90은 전체 100의 2/3를 엄격히 넘으므로 X의 PoLC가 생깁니다.",
  },
  {
    question: "같은 라운드에서 2/3 초과 prevote를 보았습니까?",
    action: "X의 PoLC를 본 검증자는 X에 잠기고 X에 precommit합니다.",
    evidence: "PoLC(X, round 0) · lockedBlock=X · lockedRound=0",
    votes: ["V0 40: precommit X", "V1 30: precommit X", "V2 20: precommit X", "V3 10: 지연"],
    result: "잠금은 타임아웃만으로 사라지지 않습니다. 아직 각 노드는 precommit을 모으는 중입니다.",
  },
  {
    question: "같은 블록의 2차 투표가 전체 power의 2/3를 넘었습니까?",
    action: "V0·V1·V2의 precommit(X) power 90을 확인합니다.",
    evidence: "3 × 90 > 2 × 100",
    votes: ["V0 40: X 결정", "V1 30: X 결정", "V2 20: X 결정", "V3 10: 뒤따라감"],
    result: "블록 X를 height 120에 commit하고 다음 height로 이동합니다.",
  },
  {
    question: "2/3 초과 precommit을 끝내 모으지 못했다면요?",
    action: "precommit 타임아웃 뒤 다음 제안자와 round 1로 이동합니다.",
    evidence: "round는 바뀌어도 이미 얻은 lockedBlock·lockedRound는 유지",
    votes: ["V0: round 1", "V1: round 1", "V2: 아직 round 0", "V3: 연결 복구"],
    result: "라운드가 바뀌는 것은 실패 복구입니다. 이전 잠금을 지우거나 빈 블록을 결정한 것이 아닙니다.",
  },
] as const;

const ROUND_NOTES = ROUND_STATES.map((state) => `${state.question} ${state.action} ${state.result}`);

export function TendermintRoundViz() {
  const scenes = useAnimatedScenes(ROUND_LABELS.length, 6200, { loop: false });
  const state = ROUND_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="한 요청의 정상 경로 · total power 100"
      title="블록 X는 두 번의 투표를 거쳐 height 120의 결과가 됩니다"
      description="제안, prevote, 잠금·precommit, commit을 한 단계씩 보면서 무엇이 아직 결정되지 않았는지도 함께 확인합니다."
      note="검증자 power는 V0=40, V1=30, V2=20, V3=10인 설명용 값입니다. 키 개수가 아니라 서명한 검증자의 power를 셉니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Tendermint 한 라운드의 다섯 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[38rem] border-y border-border py-4 sm:min-h-[24rem]">
          <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {ROUND_LABELS[scenes.active]}</p>
          <h4 className="mt-2 break-keep text-base font-bold leading-7">{state.question}</h4>
          <p className="mt-2 break-keep text-sm leading-6">{state.action}</p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {state.votes.map((vote) => <div key={vote} className="min-w-0 border border-border bg-background p-3 text-xs font-bold leading-5">{vote}</div>)}
          </div>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">지금 가진 근거</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.evidence}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">다음 상태</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.result}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={ROUND_LABELS} controlLabels={ROUND_LABELS} playLabel="Tendermint 정상 경로 재생" />
      </div>
      <StaticSceneList labels={ROUND_LABELS} notes={ROUND_NOTES} />
    </VizFrame>
  );
}

const LOCK_LABELS = ["A에 잠김", "B 근거를 놓침", "과거 근거 전달", "B로 이동"] as const;

const LOCK_STATES = [
  {
    round: "round 0",
    proposal: "블록 A",
    seen: "+2/3 prevote(A)는 봤지만 +2/3 precommit(A)는 못 봄",
    local: "A에 lock · lockedRound=0 · 아직 commit 아님",
    reason: "잠금은 생겼지만 A가 이 높이의 최종 블록으로 결정되지는 않았습니다.",
  },
  {
    round: "round 1",
    proposal: "블록 B",
    seen: "내가 B의 prevote 정족수를 받기 전에 타임아웃",
    local: "A를 prevote · precommit nil · A 잠금 유지",
    reason: "다른 검증자들은 round 1의 +2/3 prevote(B)를 보았을 수 있지만, 내가 보지 못한 근거로 잠금을 바꾸지는 않습니다.",
  },
  {
    round: "round 2",
    proposal: "블록 B · POLRound=1",
    seen: "제안과 함께 round 1의 +2/3 prevote(B)를 확인",
    local: "0 < POLRound 1 < current round 2이므로 A 잠금 해제",
    reason: "현재 라운드와 같은 2가 아니라, 현재보다 낮고 기존 잠금보다 높은 1이 과거 잠금 근거입니다.",
  },
  {
    round: "round 2",
    proposal: "블록 B",
    seen: "round 2의 +2/3 prevote(B)를 새로 확인",
    local: "B에 relock · precommit(B)",
    reason: "더 높은 라운드의 정당한 표 묶음이 있었으므로 B로 이동합니다. 타임아웃 자체가 잠금을 바꾼 것은 아닙니다.",
  },
] as const;

const LOCK_NOTES = LOCK_STATES.map((state) => `${state.round}: ${state.local}. ${state.reason}`);

export function TendermintLockTraceViz() {
  const scenes = useAnimatedScenes(LOCK_LABELS.length, 7000, { loop: false });
  const state = LOCK_STATES[scenes.active];

  return (
    <VizFrame
      eyebrow="라운드를 건너는 잠금"
      title="늦게 받은 표 묶음은 이전 잠금을 안전하게 바꾸는 영수증입니다"
      description="한 검증자가 A에 잠긴 뒤, round 1의 B 표를 늦게 받아 round 2에서 B로 이동하는 과정을 따라갑니다."
      note="A에는 +2/3 prevote만 있었고 +2/3 precommit은 없었다고 가정합니다. A가 이미 commit됐다면 충돌하는 B의 정상 정족수는 만들어질 수 없습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} data-viz-live-only tabIndex={0} role="group" aria-label="Tendermint 잠금 변경 네 단계" onKeyDown={scenes.onKeyDown} className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
        <div data-viz-scene-stage className="min-h-[31rem] border-y border-border py-4 sm:min-h-[20rem]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-[10px] font-black text-primary">{String(scenes.active + 1).padStart(2, "0")} · {LOCK_LABELS[scenes.active]}</p>
            <p className="font-mono text-xs font-black">{state.round}</p>
          </div>
          <h4 className="mt-3 break-keep text-base font-bold leading-7">제안: {state.proposal}</h4>
          <div className="mt-3 grid gap-px bg-border p-px sm:grid-cols-[8rem_minmax(0,1fr)]">
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">실제로 본 근거</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.seen}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">로컬 상태 변화</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.local}</p>
            <strong className="bg-background p-3 text-[10px] text-muted-foreground">왜 안전한가</strong>
            <p className="min-w-0 break-keep bg-background p-3 text-xs font-bold leading-5">{state.reason}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LOCK_LABELS} controlLabels={LOCK_LABELS} playLabel="Tendermint 잠금 변경 재생" />
      </div>
      <StaticSceneList labels={LOCK_LABELS} notes={LOCK_NOTES} />
    </VizFrame>
  );
}

const TENDERMINT_TEST_ROWS = [
  ["제안자 오프라인", "제안 없음·타임아웃", "nil 투표 뒤 다음 round · 잠금은 유지"],
  ["낡은 충돌 제안", "잠금보다 낮은 POLRound", "잠긴 블록을 prevote · 충돌 제안 거절"],
  ["소수 power 분리", "분리된 쪽의 power ≤ 1/3", "그쪽만으로 commit 불가"],
  ["1/3 이상 오프라인", "+2/3 투표 불가능", "정지는 허용 · 충돌 commit은 금지"],
] as const;

export function TendermintFailureTable() {
  return <ResponsiveVizTable columns={["주입 사건", "관찰할 입력", "반드시 지켜야 할 결과"]} rows={TENDERMINT_TEST_ROWS} desktopMinWidthClassName="min-w-[760px]" />;
}
