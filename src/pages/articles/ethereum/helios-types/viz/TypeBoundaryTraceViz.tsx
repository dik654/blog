import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "전체 경로",
  "JSON 도착",
  "Fork 선택",
  "Electra 타입",
  "Merkle 증명",
  "서명 검증",
  "후보 반환",
] as const;

const NOTES = [
  "Beacon API 응답 U1422는 HTTP JSON으로 도착합니다. Helios는 JSON을 fork별 Rust 타입으로 읽고, 그 타입이 정한 SSZ tree shape와 branch 길이로 증명을 확인한 뒤 GenericUpdate 후보를 만듭니다.",
  "get_updates는 response body bytes를 serde_json으로 읽습니다. 이 경로에서 전송된 본문을 SSZ binary라고 부르면 transport와 consensus commitment를 혼동합니다.",
  "Update는 serde의 untagged enum입니다. 별도 fork tag가 아니라 field 모양과 FixedVector 길이로 Base 또는 Electra variant가 선택됩니다. Electra JSON을 Base branch 길이로 읽으면 decode가 실패합니다.",
  "Electra Update의 next committee branch는 6개, finality branch는 7개입니다. Electra LightClientHeader의 execution branch는 4개입니다. 이 길이는 단순 메타데이터가 아니라 타입에 들어 있습니다.",
  "Helios는 leaf의 tree_hash_root부터 sibling을 순서대로 SHA-256으로 접어 attested header의 state_root 또는 body_root와 비교합니다. 길이가 맞아도 마지막 root가 다르면 거절합니다.",
  "Signature slot으로 period와 fork version을 고르고 participation bits에 해당하는 committee public key를 모읍니다. Domain과 aggregate signature가 맞아야 검증이 끝납니다.",
  "검증 성공 결과는 Store에 바로 쓴 값이 아니라 GenericUpdate 후보입니다. Store의 optimistic·finalized header와 committee를 바꾸는 조건은 다음 글의 상태 전이 책임입니다.",
] as const;

type Stage = "idle" | "active" | "done";

function stage(active: number, at: number): Stage {
  if (active < at) return "idle";
  if (active === at) return "active";
  return "done";
}

const STEPS = [
  ["HTTP", "Beacon API JSON", "response body bytes"],
  ["DECODE", "serde_json + untagged", "Base 또는 Electra"],
  ["TYPE", "Update::Electra", "branch 6 · 7 · 4"],
  ["PROOF", "SSZ tree hash", "state/body root 재구성"],
  ["SIGN", "period · domain · BLS", "participants 결속"],
  ["OUTPUT", "GenericUpdate", "Store는 아직 그대로"],
] as const;

function Step({
  index,
  active,
  code,
  title,
  detail,
}: {
  index: number;
  active: number;
  code: string;
  title: string;
  detail: string;
}) {
  const current = stage(active, index + 1);
  return (
    <div
      className={`min-w-0 border px-3 py-3 ${
        current === "active"
          ? "border-primary bg-primary/[0.055]"
          : current === "done"
            ? "border-foreground/30 bg-background"
            : "border-border bg-background"
      }`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9px] font-black text-muted-foreground">
          {String(index + 1).padStart(2, "0")} · {code}
        </span>
        <span className={`font-mono text-[9px] font-bold ${current === "active" ? "text-primary" : "text-muted-foreground"}`}>
          {current === "active" ? "확인 중" : current === "done" ? "통과" : "대기"}
        </span>
      </div>
      <strong className="mt-1.5 block break-keep text-xs leading-5">{title}</strong>
      <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">{detail}</p>
    </div>
  );
}

function CompactScene({ active }: { active: number }) {
  const summaries = [
    ["U1422 한 건", "JSON → fork type → proof → signature → candidate", "전송 형식과 SSZ commitment를 분리해 읽습니다."],
    ["HTTP 응답", "application/json · data: Update", "실제 get 함수는 serde_json::from_slice를 호출합니다."],
    ["구조로 선택", "Base × · Electra ✓", "U6 next branch와 U7 finality branch가 Electra 모양에 맞습니다."],
    ["고정된 모양", "next 6 · finality 7 · execution 4", "FixedVector 길이가 이후 proof 검사의 입력을 제한합니다."],
    ["Root 재구성", "leaf root + siblings → trusted root", "길이와 sibling 순서, 마지막 root equality가 모두 필요합니다."],
    ["서명 문맥", "period 1422 · fork 0x05 · participant keys", "선택된 public key와 domain으로 aggregate signature를 확인합니다."],
    ["검증 결과", "GenericUpdate(U1422)", "후보만 만들어졌으며 Store의 header와 committee는 바뀌지 않았습니다."],
  ] as const;
  const [label, title, detail] = summaries[active];
  return (
    <div className="grid gap-3">
      <div className="border border-primary bg-primary/[0.045] px-3 py-3">
        <p className="font-mono text-[9px] font-black text-muted-foreground">
          {String(active + 1).padStart(2, "0")} / {LABELS.length} · {label}
        </p>
        <strong className="mt-1.5 block break-keep text-sm leading-5">{title}</strong>
        <p className="mt-2 break-keep text-[10px] leading-4 text-muted-foreground">{detail}</p>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y border-border px-2 py-3 text-center">
        <div>
          <p className="font-mono text-[8px] font-black text-muted-foreground">TRANSPORT</p>
          <p className="mt-1 text-[10px] font-bold">HTTP JSON</p>
        </div>
        <span aria-hidden className="text-primary">→</span>
        <div>
          <p className="font-mono text-[8px] font-black text-muted-foreground">CONSENSUS</p>
          <p className="mt-1 text-[10px] font-bold">SSZ root · BLS</p>
        </div>
      </div>
    </div>
  );
}

function BranchTable({ active }: { active: number }) {
  const typed = active >= 3;
  return (
    <div className="grid gap-px bg-border p-px text-[10px]">
      <div className="grid grid-cols-[minmax(0,1fr)_4rem_4rem] bg-muted/35 px-2 py-2 font-bold text-muted-foreground">
        <span>증거</span><span className="text-center">Base</span><span className="text-center">Electra</span>
      </div>
      {[
        ["next committee", "5", "6"],
        ["finality", "6", "7"],
        ["execution", "4", "4"],
      ].map(([label, base, electra]) => (
        <div key={label} className="grid grid-cols-[minmax(0,1fr)_4rem_4rem] bg-background px-2 py-2">
          <span className="break-keep font-medium">{label}</span>
          <span className={`text-center font-mono ${typed ? "text-muted-foreground/55" : "text-foreground"}`}>{base}</span>
          <span className={`text-center font-mono font-bold ${typed ? "text-primary" : "text-muted-foreground"}`}>{electra}</span>
        </div>
      ))}
    </div>
  );
}

export default function TypeBoundaryTraceViz() {
  const scenes = useAnimatedScenes(LABELS.length, 7600, { loop: false });
  const active = scenes.active;

  return (
    <VizFrame
      eyebrow="Helios 0.11.1 · Update U1422"
      title="JSON 응답이 검증 가능한 Electra update가 되는 경로"
      description="장면을 고르면 같은 update가 transport body에서 fork type, Merkle·BLS 증거, GenericUpdate 후보로 이동합니다. 그림에 초점을 두고 방향키로도 이동할 수 있습니다."
      note="U1422는 Electra 활성 epoch 364,032의 sync committee period 1,422를 설명하기 위한 식별자입니다. 실제 API 응답 ID나 측정값이 아닙니다."
      canvasClassName="px-2 py-2 sm:p-5"
      documentFlow
    >
      <div
        id={scenes.playbackId}
        data-viz-live-only
        data-helios-type-scene={active}
        tabIndex={0}
        role="group"
        aria-label="Beacon API JSON이 검증된 GenericUpdate 후보가 되는 일곱 장면"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div className="flex min-h-8 items-center justify-between border-b border-border px-1">
          <strong className="text-xs">{String(active + 1).padStart(2, "0")} · {LABELS[active]}</strong>
          <span className="font-mono text-[10px] text-muted-foreground">U1422 · {active + 1}/{LABELS.length}</span>
        </div>

        <div className="mt-3 xl:hidden">
          <CompactScene active={active} />
        </div>

        <div className="mt-3 hidden gap-4 xl:grid xl:grid-cols-[minmax(0,1.35fr)_minmax(0,0.78fr)]">
          <div className="grid grid-cols-2 gap-2">
            {STEPS.map(([code, title, detail], index) => (
              <Step key={code} index={index} active={active} code={code} title={title} detail={detail} />
            ))}
          </div>

          <div className="grid content-start gap-3">
            <div className="border-y border-border px-3 py-3">
              <p className="font-mono text-[9px] font-black text-muted-foreground">FORK CONTEXT</p>
              <p className="mt-1 break-keep text-xs font-bold">slot 11,649,024 · epoch 364,032 · period 1,422</p>
              <p className="mt-1 text-[9px] leading-4 text-muted-foreground">mainnet Electra · fork version 0x05000000</p>
            </div>
            <BranchTable active={active} />
            <div className={`border px-3 py-3 ${active >= 6 ? "border-primary bg-primary/[0.045]" : "border-border"}`}>
              <p className="font-mono text-[9px] font-black text-muted-foreground">STATE BOUNDARY</p>
              <p className="mt-1 break-keep text-xs font-bold">{active >= 6 ? "후보 U1422 준비" : "검증 전"}</p>
              <p className="mt-1 break-keep text-[9px] leading-4 text-muted-foreground">LightClientStore는 이 글의 모든 장면에서 그대로입니다.</p>
            </div>
          </div>
        </div>

        <AnimatedSceneControls
          labels={LABELS}
          active={active}
          playing={scenes.playing}
          reducedMotion={scenes.reducedMotion}
          setActive={scenes.setActive}
          setPlaying={scenes.setPlaying}
          playLabel="과정 재생"
        />
      </div>

      <StaticSceneList labels={LABELS} notes={NOTES} />
    </VizFrame>
  );
}
