import type { ReactNode } from "react";
import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #release — 실패 지점마다 버려지는 후보 state가 다르고, 그 되돌림은 Ante cache까지 올라가지 않는다.
 * 겹친 상자 = block working state ⊃ (Ante cache가 먼저 쓴 sequence) + message branch ⊃ EVM snapshot·queue, submessage CacheContext.
 * 수치(sequence 7→8, Alice 100·Bob 0, MsgSend 10ufoo)는 본문의 설명용 fixture T7 그대로입니다.
 */

type Status = "kept" | "candidate" | "dropped" | "absent" | "merged";

const STATUS_TEXT: Record<Status, string> = {
  kept: "유지",
  candidate: "후보",
  dropped: "폐기",
  absent: "생기지 않음",
  merged: "parent에 합침",
};

interface Scene {
  label: string;
  note: string;
  ante: Status;
  branch: string;
  snapshot: Status;
  snapshotLine: string;
  submsg: Status;
  submsgLine: string;
  stop: boolean;
  seq: string;
  balance: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "겹친 구조",
    note: "Ante는 message 실행 전에 서명·sequence 등을 검사하는 Cosmos SDK 단계이고, 고정한 BaseApp은 성공한 Ante cache를 먼저 씁니다. snapshot은 EVM call마다 되돌릴 수 있게 잡은 상태, CacheContext는 성공할 때만 parent에 쓰는 사본입니다.",
    ante: "kept",
    branch: "T7의 MsgCall 실행 · 안쪽 상자가 성공해야 여기에 합쳐짐",
    snapshot: "candidate",
    snapshotLine: "StateDB 후보 + queue[MsgSend 10ufoo]",
    submsg: "candidate",
    submsgLine: "MsgSend handler 실행 · Alice 90 / Bob 10 후보",
    stop: false,
    seq: "Ante 성공 시 8",
    balance: "안쪽 상자 결과에 달림",
  },
  {
    label: "EVM 쪽 실패",
    note: "ABI decode나 signer 검사가 실패하면 precompile snapshot이 되돌아가 queue가 생기지 않고, EVM이 REVERT하면 child queue가 parent로 올라오지 않습니다. 되돌림은 Ante cache까지 가지 않아 block commit 뒤 sequence 8과 100/0이 남을 수 있습니다.",
    ante: "kept",
    branch: "MsgSend가 도착하지 않음",
    snapshot: "dropped",
    snapshotLine: "ABI·signer 실패 → queue 생기지 않음 · REVERT → child queue 미전달",
    submsg: "absent",
    submsgLine: "실행할 MsgSend가 없음",
    stop: true,
    seq: "8 남을 수 있음",
    balance: "100 / 0",
  },
  {
    label: "MsgSend 실패",
    note: "EVM frame 뒤 MsgSend handler가 실패하면 submessage cache를 쓰지 않습니다. allowFailure=false면 error가 바깥으로 전파되고, true면 그 state만 버린 채 outer EVM transaction이 계속될 수 있습니다. Ante가 쓴 sequence는 그대로입니다.",
    ante: "kept",
    branch: "allowFailure=false → error 전파 · true → outer 계속 가능",
    snapshot: "merged",
    snapshotLine: "EVM 성공 · StateDB.Commit이 state와 queue를 parent에 합침 · 단 allowFailure=false로 transaction이 실패하면 ② branch와 함께 버려짐",
    submsg: "dropped",
    submsgLine: "handler 실패 → cache branch를 쓰지 않음",
    stop: true,
    seq: "8 남을 수 있음",
    balance: "100 / 0",
  },
  {
    label: "전부 성공",
    note: "EVM frame이 성공하면 snapshot state와 queue가 parent에 합쳐지고, dispatchMessages가 MsgSend를 별도 CacheContext에서 실행해 성공한 branch만 parent에 씁니다. 같은 block이 commit되어야 sequence 8과 Alice 90 · Bob 10이 durable state가 됩니다.",
    ante: "kept",
    branch: "outer transaction 성공 → block state에 반영",
    snapshot: "merged",
    snapshotLine: "StateDB.Commit → parent transaction context",
    submsg: "merged",
    submsgLine: "MsgSend 성공 → Alice 90 / Bob 10을 parent에 씀",
    stop: false,
    seq: "8",
    balance: "90 / 10",
  },
];

const LABELS = SCENES.map((scene) => scene.label);

function boxClass(status: Status) {
  if (status === "dropped") return "border border-dashed border-[#dc2626] bg-[#dc2626]/5";
  if (status === "absent") return "border border-dotted border-border bg-transparent";
  if (status === "merged" || status === "kept") return "border border-solid border-[#2563eb] bg-[#2563eb]/5";
  return "border border-solid border-border bg-background";
}

function Tag({ status }: { status: Status }) {
  const color =
    status === "dropped" ? "text-[#dc2626]" : status === "merged" || status === "kept" ? "text-[#2563eb]" : "text-muted-foreground";
  return <span className={`shrink-0 text-[10px] font-bold sm:text-xs ${color}`}>{STATUS_TEXT[status]}</span>;
}

function Box({ title, status, children }: { title: string; status: Status; children: ReactNode }) {
  return (
    <div className={`min-w-0 rounded-lg p-2.5 sm:p-3 ${boxClass(status)}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5">
        <strong className={`text-xs sm:text-sm ${status === "dropped" ? "line-through decoration-1" : ""} ${status === "absent" ? "text-muted-foreground" : ""}`}>{title}</strong>
        <Tag status={status} />
      </div>
      <p className={`mt-1 break-keep text-[11px] leading-5 sm:text-xs text-muted-foreground`}>{children}</p>
    </div>
  );
}

function Nesting({ scene }: { scene: Scene }) {
  return (
    <div className="min-w-0">
      <div className="min-w-0 rounded-lg border border-border p-2.5 sm:p-3">
        <p className="text-xs font-bold sm:text-sm">Block working state <span className="font-normal text-muted-foreground">(FinalizeBlock 경로)</span></p>
        <div className="mt-2 grid min-w-0 gap-2">
          <Box title="① Ante cache — 먼저 씀" status={scene.ante}>
            Alice sequence 7 → 8 · message 실행 전에 block working state에 반영
          </Box>
          <div className={`-my-0.5 flex items-center gap-2 text-[10px] font-bold sm:text-xs ${scene.stop ? "text-[#dc2626]" : "text-transparent"}`} aria-hidden={!scene.stop}>
            <span className="h-px flex-1 border-t border-dashed border-current" />
            <span className="shrink-0">되돌림은 이 선 위로 올라가지 않음</span>
            <span className="h-px flex-1 border-t border-dashed border-current" />
          </div>
          <div className="min-w-0 rounded-lg border border-border p-2.5 sm:p-3">
            <p className="break-keep text-xs leading-5 sm:text-sm">
              <strong>② Message branch</strong> <span className="text-[11px] text-muted-foreground sm:text-xs">· {scene.branch}</span>
            </p>
            <div className="mt-2 grid min-w-0 gap-2 sm:grid-cols-2">
              <Box title="③ EVM snapshot" status={scene.snapshot}>{scene.snapshotLine}</Box>
              <Box title="④ Submessage CacheContext" status={scene.submsg}>{scene.submsgLine}</Box>
            </div>
          </div>
        </div>
      </div>
      <p className="mt-2 flex flex-wrap gap-x-4 gap-y-0.5 rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm">
        <span className="text-muted-foreground">block commit 뒤</span>
        <span>Alice sequence <strong>{scene.seq}</strong></span>
        <span>ufoo Alice / Bob <strong>{scene.balance}</strong></span>
      </p>
    </div>
  );
}

export default function BranchNestingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5200);

  return (
    <VizFrame
      eyebrow="MiniEVM · 겹친 후보 state"
      title="되돌림은 안쪽 상자에서 멈추고 Ante가 쓴 sequence는 남습니다"
      description="실패 지점을 바꿔 가며 어느 후보 상자가 버려지는지 봅니다. 수치는 본문의 설명용 fixture T7(가정)입니다."
      note="선 종류로 상태를 구분합니다: 실선 = 유지·합침, 점선(취소선) = 폐기, 점 테두리 = 생기지 않음. MiniEVM v1.2.19와 고정한 Initia Cosmos SDK fork의 경로에 한정합니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="실패 지점별로 버려지는 상자와 남는 sequence·잔액"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => <Nesting key={scene.label} scene={scene} />)}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-3"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={LABELS} />
        <StaticSceneList labels={LABELS} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
