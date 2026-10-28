import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "전체 시작",
  "설정 병합",
  "Builder 조립",
  "Checkpoint 선택",
  "Sync 검증",
  "Ready 판정",
  "실패·Rollback",
] as const;

const NOTES = [
  "run-17은 base·TOML·CLI에서 설정을 정규화하고, checkpoint를 고른 뒤 consensus sync와 initial block 확보를 거쳐 서비스 후보가 됩니다. 구현 상태와 운영 정책을 같은 색으로 표시하지 않습니다.",
  "Helios 0.12.0의 Config::from_file은 base → TOML → CLI 순서로 merge합니다. 설명용 포트 8545·9545·10545에서는 10545가 남지만, 값의 출처를 보존하는 launch receipt는 운영 계층의 제안입니다.",
  "Builder는 Config에서 endpoint·checkpoint·data directory·bind address를 가져와 consensus client와 execution provider를 만듭니다. rpc_address가 있으면 local JSON-RPC task도 여기서 시작되므로 socket listening은 sync 완료와 다릅니다.",
  "초기 checkpoint는 explicit config가 먼저이고, 없으면 FileDB의 정확한 32-byte 값, 그것도 없으면 network default입니다. 이 순서는 소스 선택일 뿐 checkpoint가 올바른 chain의 신뢰 anchor라는 증명은 아닙니다.",
  "Consensus client는 bootstrap의 age를 검사하고 Merkle proof를 확인한 뒤 update와 initial execution block을 가져옵니다. strict_checkpoint_age=false이면 오래된 checkpoint는 경고만 남기고 계속 진행합니다.",
  "내장 wait_synced는 consensus status와 initial latest·finalized block을 기다립니다. 하지만 CLI는 JSON-RPC를 먼저 열 수 있으므로, 배포 플랫폼이 eth_syncing=false와 대표 조회 성공을 readiness로 묶는 정책은 별도의 [A] 운영 계약입니다.",
  "Initial sync가 실패하면 설정에 따라 외부 fallback을 시도할 수 있습니다. 0.12.0 문서는 외부 목록 사용을 insecure로 경고합니다. 기본 운영안은 자동 fallback을 끄고 이전 config·binary·checkpoint backup으로 되돌리는 것이며, 대상 환경 수치는 아직 [M] 미측정입니다.",
] as const;

const STEPS = [
  ["CONFIG", "Base · TOML · CLI"],
  ["BUILD", "Consensus · Execution · RPC"],
  ["ANCHOR", "Explicit · File · Default"],
  ["SYNC", "Bootstrap · Update · Block"],
  ["SERVE", "Socket · Sync · Readiness"],
] as const;

type StepState = "waiting" | "active" | "done" | "failed";

function getState(active: number, index: number): StepState {
  if (active === 6 && index >= 3) return "failed";
  const mapped = Math.min(Math.max(active - 1, 0), 4);
  if (active === 0 || index > mapped) return "waiting";
  if (index === mapped) return "active";
  return "done";
}

const STATE_LABEL: Record<StepState, string> = {
  waiting: "대기",
  active: "변경 중",
  done: "기록됨",
  failed: "중단",
};

function Step({
  active,
  index,
  code,
  detail,
}: {
  active: number;
  index: number;
  code: string;
  detail: string;
}) {
  const state = getState(active, index);
  return (
    <div
      className={`min-w-0 border px-2.5 py-3 sm:px-3 ${
        state === "active"
          ? "border-primary bg-primary/[0.055]"
          : state === "failed"
            ? "border-destructive/70 bg-destructive/[0.035]"
            : state === "done"
              ? "border-foreground/25 bg-background"
              : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-black text-muted-foreground">
          {String(index + 1).padStart(2, "0")} · {code}
        </span>
        <span
          className={`font-mono text-[9px] font-bold ${
            state === "failed"
              ? "text-destructive"
              : state === "active"
                ? "text-primary"
                : "text-muted-foreground"
          }`}
        >
          {STATE_LABEL[state]}
        </span>
      </div>
      <strong className="mt-1.5 block break-keep text-[11px] leading-4 sm:text-xs sm:leading-5">
        {detail}
      </strong>
    </div>
  );
}

function Receipt({ active }: { active: number }) {
  const rows = [
    ["config.port", active >= 1 ? "10545 · CLI" : "후보 8545 / 9545 / 10545"],
    ["checkpoint", active >= 3 ? "C17 · explicit" : "미선택"],
    ["rpc.socket", active >= 2 ? "listening" : "closed"],
    ["consensus", active === 6 ? "error" : active >= 4 ? "synced" : "syncing"],
    ["service.ready", active === 6 ? "false · rollback" : active >= 5 ? "true · [A] gate" : "false"],
  ] as const;

  return (
    <div className="grid gap-px bg-border p-px text-[10px]">
      {rows.map(([name, value]) => (
        <div key={name} className="grid grid-cols-[7rem_minmax(0,1fr)] bg-background px-3 py-2 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
          <span className="font-mono font-bold text-muted-foreground">{name}</span>
          <span className={`break-keep font-bold ${value.includes("error") || value.includes("rollback") ? "text-destructive" : "text-foreground"}`}>
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ConfigStartupTraceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 7200, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Helios 0.12.0 · run-17"
      title="설정 후보가 실행 중인 RPC와 운영 준비 상태가 되는 경로"
      description="장면을 고르면 같은 run-17에서 최종 설정, checkpoint, sync 상태와 서비스 readiness가 차례로 바뀝니다. [O] 구현과 [A] 운영 gate를 분리해 표시합니다."
      note="8545·9545·10545와 C17은 흐름을 설명하기 위한 값입니다. 대상 환경의 시작 시간·오류율·복구 시간은 아직 측정하지 않았습니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-helios-config-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Helios 설정 입력이 운영 준비 상태가 되는 일곱 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {SCENES[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">run-17 · {active + 1}/{SCENES.length}</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {STEPS.map(([code, detail], index) => (
            <Step key={code} active={active} index={index} code={code} detail={detail} />
          ))}
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.72fr)]">
          <Receipt active={active} />
          <div className="grid gap-px bg-border p-px text-[10px]">
            <div className="bg-background px-3 py-3">
              <p className="font-mono text-[9px] font-black text-primary">[O] CURRENT 0.12.0</p>
              <p className="mt-1 break-keep font-bold leading-5">
                Socket과 sync status는 서로 다른 상태입니다.
              </p>
            </div>
            <div className="bg-background px-3 py-3">
              <p className="font-mono text-[9px] font-black text-primary">[A] PLATFORM GATE</p>
              <p className="mt-1 break-keep font-bold leading-5">
                검증된 head 뒤에만 Service endpoint로 편입합니다.
              </p>
            </div>
          </div>
        </div>

        <p data-scene-note className="mt-3 min-h-24 border-l-2 border-primary/50 pl-3 text-xs leading-5 text-muted-foreground sm:min-h-20 sm:text-sm sm:leading-6">
          {NOTES[active]}
        </p>

        <AnimatedSceneControls
          labels={SCENES}
          controlLabels={["전체", "병합", "조립", "Anchor", "Sync", "Ready", "복구"]}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="시작 과정 재생"
        />
      </div>

      <StaticSceneList labels={SCENES} notes={NOTES} />
    </VizFrame>
  );
}
