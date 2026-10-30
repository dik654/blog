import { useEffect, useRef } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Committed state",
  "Transaction bytes",
  "CheckTx",
  "Finalize ante",
  "MsgSend",
  "Child merge",
  "Working AppHash",
  "Commit",
] as const;

const SHORT = ["시작", "Bytes", "Check", "Ante", "Send", "Merge", "Hash", "Commit"] as const;

const NOTES = [
  "높이 40의 정본은 Alice 100, Bob 20, sequence 7입니다. Query는 이 durable root만 읽고 임시 branch는 아직 없습니다.",
  "Alice가 Bob에게 10을 보내고 fee 1을 내는 bytes에 서명합니다. CometBFT는 순서만 정하고 SDK가 MsgSend 규칙을 해석합니다.",
  "CheckTx는 ante만 실행해 fee 1·sequence 8을 node-local check state에 남깁니다. MsgSend와 committed query는 바뀌지 않습니다.",
  "같은 bytes를 FinalizeBlock에서 다시 실행합니다. Ante가 성공하면 fee 1·sequence 8을 finalize parent에 먼저 합칩니다.",
  "MsgServiceRouter가 MsgSend를 bank MsgServer로 연결합니다. Bank는 정책·잔액을 검사한 뒤 message child에서 Alice −10, Bob +10을 계산합니다.",
  "MsgSend와 post-handler가 성공하면 child를 finalize parent에 합칩니다. ExecTxResult OK는 얻었지만 아직 durable version은 아닙니다.",
  "FinalizeBlock이 block branch를 root multistore에 합쳐 다음 AppHash를 계산합니다. Disk에 다음 version을 저장하는 Commit은 남아 있습니다.",
  "Commit이 version 41을 저장하고 CheckTx state를 최신 root에서 다시 만듭니다. Alice 89, Bob 30, sequence 8이 query의 새 정본입니다.",
] as const;

const STATES = [
  { durable: "v40 · A 100 · B 20 · seq 7", check: "committed v40 기준", finalize: "없음", child: "없음", receipt: "query 정본" },
  { durable: "v40 · A 100 · B 20 · seq 7", check: "변화 없음", finalize: "없음", child: "tx bytes · send 10 · fee 1", receipt: "서명된 요청" },
  { durable: "v40 · 변화 없음", check: "fee 1 · seq 8", finalize: "없음", child: "MsgSend 실행 안 함", receipt: "CheckTx OK · node-local" },
  { durable: "v40 · 변화 없음", check: "기존 local state", finalize: "A 99 · fee 1 · seq 8", child: "ante branch merge", receipt: "아직 tx 실행 중" },
  { durable: "v40 · 변화 없음", check: "기존 local state", finalize: "ante state 유지", child: "A 89 · B 30 계산", receipt: "MsgSend 검사 통과" },
  { durable: "v40 · 변화 없음", check: "기존 local state", finalize: "A 89 · B 30 · seq 8", child: "parent에 merge", receipt: "ExecTxResult OK" },
  { durable: "v40 · disk 정본", check: "기존 local state", finalize: "root write · 다음 AppHash", child: "정리 완료", receipt: "hash 계산 · 미Commit" },
  { durable: "v41 · A 89 · B 30 · seq 8", check: "v41에서 재생성", finalize: "clear", child: "없음", receipt: "durable version 41" },
] as const;

function activeAt(scene: number, from: number, to = from) {
  return scene >= from && scene <= to;
}

function FlowNode({
  index,
  title,
  detail,
  active,
}: {
  index: string;
  title: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div className={`min-w-0 border p-2.5 sm:p-3 ${active ? "border-primary bg-primary/10" : "border-border bg-background"}`}>
      <span className="font-mono text-[8px] font-black text-primary sm:text-[9px]">{index}</span>
      <strong className="mt-1 block break-keep text-[10px] leading-5 sm:text-xs">{title}</strong>
      <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground sm:text-[10px] sm:leading-5">{detail}</p>
    </div>
  );
}

export function CosmosTxViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600, { loop: false });
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
      eyebrow="Cosmos SDK v0.55.0 · transaction 한 건"
      title="Alice의 요청이 세 종류의 임시 state를 지나 version 41이 되기까지"
      description="CheckTx, FinalizeBlock, message child와 durable root를 한 장면씩 비교합니다. 같은 코드가 실행돼도 어느 branch에 쓰는지가 결과의 권위를 바꿉니다."
      note="수치는 실행 경계를 설명하기 위한 고정 예시입니다. Branch 동작은 commit 64fd208a의 공식 소스와 두 baseapp 테스트로 확인했습니다."
      canvasClassName="p-1.5 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-cosmos-sdk-scene={scenes.active}
        tabIndex={0}
        role="group"
        aria-label="Cosmos SDK transaction을 여덟 장면으로 추적"
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

          <div className="mt-3 min-h-[31rem] border-y border-border py-3 sm:py-4">
            <div className="grid grid-cols-2 gap-px bg-border p-px sm:grid-cols-4">
              <FlowNode index="01" title="CometBFT" detail="bytes 순서와 block 포함" active={activeAt(scenes.active, 1, 2)} />
              <FlowNode index="02" title="BaseApp" detail="mode와 parent state 선택" active={activeAt(scenes.active, 2, 7)} />
              <FlowNode index="03" title="Ante → Bank" detail="봉투 검사 뒤 MsgSend 실행" active={activeAt(scenes.active, 3, 5)} />
              <FlowNode index="04" title="Root store" detail="AppHash 계산과 version 저장" active={activeAt(scenes.active, 6, 7)} />
            </div>

            <div className="mt-3 grid grid-cols-2 gap-px bg-border p-px">
              {[
                ["DURABLE ROOT", state.durable, activeAt(scenes.active, 0, 1) || scenes.active === 7],
                ["CHECK STATE", state.check, scenes.active === 2 || scenes.active === 7],
                ["FINALIZE BLOCK BRANCH", state.finalize, activeAt(scenes.active, 3, 6)],
                ["ANTE / MESSAGE CHILD", state.child, activeAt(scenes.active, 1, 5)],
              ].map(([label, value, active]) => (
                <div key={String(label)} className={`min-w-0 bg-background p-3 sm:p-4 ${active ? "ring-2 ring-inset ring-primary" : ""}`}>
                  <span className="block break-keep text-[8px] font-bold text-muted-foreground sm:text-[9px]">{String(label)}</span>
                  <strong className="mt-2 block break-keep font-mono text-[10px] leading-5 sm:text-xs sm:leading-6">{String(value)}</strong>
                </div>
              ))}
            </div>

            <div className="mt-px grid grid-cols-[7rem_minmax(0,1fr)] gap-px bg-border p-px sm:grid-cols-[10rem_minmax(0,1fr)]">
              <div className="bg-background p-3 text-[8px] font-bold text-muted-foreground sm:text-[9px]">현재 영수증</div>
              <div className="min-w-0 bg-background p-3 font-mono text-[10px] font-bold leading-5 text-primary sm:text-xs">{state.receipt}</div>
            </div>

            <p data-scene-note className="mt-3 min-h-[7rem] border-l-2 border-primary/50 pl-3 text-[10px] leading-5 text-muted-foreground sm:min-h-[8rem] sm:text-sm sm:leading-6">
              {NOTES[scenes.active]}
            </p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={SCENES} controlLabels={SCENES} playLabel="Cosmos SDK transaction 경로 재생" compact />
      </div>
      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}

export function ExecutionModeViz() {
  const rows = [
    ["CheckTx", "mempool admission", "node-local check state", "Commit 뒤 최신 root에서 재생성"],
    ["Simulate", "gas·result 미리 보기", "discarded nested branch", "예측값만 반환"],
    ["FinalizeBlock", "ordered transaction 실행", "block branch", "working AppHash 계산"],
    ["Commit", "root version 저장", "durable root", "다음 query의 정본"],
  ];

  return (
    <figure data-viz="cosmos-sdk-modes" className="not-prose my-8 overflow-hidden border-y border-border py-4 sm:py-6">
      <figcaption className="mb-5">
        <p className="text-xs font-bold text-primary">실행 mode가 정하는 state의 수명</p>
        <p className="mt-1 break-keep text-sm leading-6 text-muted-foreground">CheckTx를 단순한 폐기 branch로 부르면 연속 admission에서 읽는 node-local state를 놓치게 됩니다.</p>
      </figcaption>
      <div data-viz-canvas className="grid gap-px bg-border p-px md:grid-cols-2">
        {rows.map(([mode, purpose, destination, receipt]) => (
          <div className="min-w-0 bg-background p-4" key={mode}>
            <p className="font-semibold">{mode}</p>
            <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">{purpose}</p>
            <div className="mt-3 grid gap-2 border-t border-border pt-3 text-xs leading-5 sm:grid-cols-2">
              <span>{destination}</span>
              <span className="text-muted-foreground">{receipt}</span>
            </div>
          </div>
        ))}
      </div>
    </figure>
  );
}
