import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #validation — "검사는 순서대로 서로 다른 공격을 막습니다."
 * 정상 제출 하나와 바꿔치기 세 가지(개수 불일치, 서로 맞는 다른 묶음, 다른 Blob)를 같은 세 검사에 넣고
 * 어느 검사에서 처음 거부되는지 표시합니다. B₁·B*·C′·π′·B′ 같은 기호는 설명용 가정입니다.
 */

type Status = "pass" | "fail" | "skip";

type Scene = {
  label: string;
  summary: string;
  note: string;
  hashes: readonly string[];
  blobs: readonly string[];
  commitments: readonly string[];
  proofs: readonly string[];
  bad: readonly string[];
  checks: readonly [Status, Status, Status];
  details: readonly [string, string, string];
};

const SCENES: readonly Scene[] = [
  {
    label: "정상 제출",
    summary: "세 검사 모두 통과",
    note: "Transaction의 h₀ 하나와 sidecar index 0의 B₀·C₀·π₀가 짝을 이룹니다. C₀에서 다시 계산한 hash가 h₀와 같고 KZG 검증도 true이므로 같은 제출로 받아들입니다.",
    hashes: ["h₀"],
    blobs: ["B₀"],
    commitments: ["C₀"],
    proofs: ["π₀"],
    bad: [],
    checks: ["pass", "pass", "pass"],
    details: ["hash 1 · Blob 1 · C 1 · proof 1", "versioned_hash(C₀) = h₀", "verify(B₀, C₀, π₀) = true"],
  },
  {
    label: "개수가 다름",
    summary: "01에서 거부",
    note: "Sidecar에 index 1 항목(B₁·C₁·π₁, 가정)이 더 붙었지만 transaction에는 hash가 하나뿐입니다. 목록 수가 다르면 같은 index의 짝을 정할 수 없으므로 첫 검사에서 거부합니다.",
    hashes: ["h₀"],
    blobs: ["B₀", "B₁"],
    commitments: ["C₀", "C₁"],
    proofs: ["π₀", "π₁"],
    bad: ["B₁", "C₁", "π₁"],
    checks: ["fail", "skip", "skip"],
    details: ["hash 1 ≠ Blob 2 · C 2 · proof 2", "앞 검사에서 이미 거부", "앞 검사에서 이미 거부"],
  },
  {
    label: "다른 commitment 묶음",
    summary: "02에서 거부",
    note: "개수는 맞지만 sidecar index 0을 서로는 맞는 다른 묶음 B*·C′·π′(가정)로 통째로 바꿨습니다. 이 묶음은 proof만 보면 유효하지만, C′에서 다시 계산한 hash h′는 transaction의 h₀와 다르므로 reference 검사에서 거부합니다. Proof 하나만 유효해서는 같은 제출이 아닙니다.",
    hashes: ["h₀"],
    blobs: ["B*"],
    commitments: ["C′"],
    proofs: ["π′"],
    bad: ["B*", "C′", "π′"],
    checks: ["pass", "fail", "skip"],
    details: ["hash 1 · Blob 1 · C 1 · proof 1", "versioned_hash(C′) = h′ ≠ h₀", "앞 검사에서 이미 거부 (묶음 자체는 서로 맞음)"],
  },
  {
    label: "다른 Blob",
    summary: "03에서 거부",
    note: "C₀와 π₀는 그대로 두고 Blob만 B′(가정)로 바꿨습니다. C₀가 그대로라 hash는 h₀와 맞지만, π₀는 B′와 C₀의 관계를 증명하지 못하므로 KZG 검증에서 거부합니다. Hash 하나만 맞아서는 같은 제출이 아닙니다.",
    hashes: ["h₀"],
    blobs: ["B′"],
    commitments: ["C₀"],
    proofs: ["π₀"],
    bad: ["B′"],
    checks: ["pass", "pass", "fail"],
    details: ["hash 1 · Blob 1 · C 1 · proof 1", "versioned_hash(C₀) = h₀", "verify(B′, C₀, π₀) = false"],
  },
];

const CHECK_NAMES = ["01 · 개수와 순서", "02 · Reference", "03 · KZG proof"] as const;
const STATUS_TEXT: Record<Status, string> = { pass: "통과", fail: "거부", skip: "—" };

function ListRow({ name, items, bad }: { name: string; items: readonly string[]; bad: readonly string[] }) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 text-xs">
      <span className="font-mono text-[10px] text-muted-foreground">{name}</span>
      <div className="flex min-w-0 gap-1">
        {[0, 1].map((slot) => {
          const item = items[slot];
          const isBad = item !== undefined && bad.includes(item);
          return (
            <span
              key={slot}
              className={`w-10 rounded-sm border py-0.5 text-center font-mono text-[11px] font-bold ${
                item === undefined
                  ? "border-dashed border-border/50 text-transparent"
                  : isBad
                    ? "border-amber-600 bg-amber-500/15 text-amber-700 dark:text-amber-300"
                    : "border-border bg-background"
              }`}
            >
              {item ?? "·"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

function SceneBody({ scene }: { scene: Scene }) {
  return (
    <div className="grid min-w-0 gap-4 sm:grid-cols-2">
      <div className="min-w-0 space-y-3">
        <div className="space-y-1.5 border border-border p-2.5">
          <p className="text-[11px] font-bold">Type-3 transaction</p>
          <ListRow name="versioned_hashes" items={scene.hashes} bad={scene.bad} />
        </div>
        <div className="space-y-1.5 border border-border p-2.5">
          <p className="text-[11px] font-bold">Blob sidecar</p>
          <ListRow name="blobs" items={scene.blobs} bad={scene.bad} />
          <ListRow name="commitments" items={scene.commitments} bad={scene.bad} />
          <ListRow name="proofs" items={scene.proofs} bad={scene.bad} />
        </div>
        <p className="text-[10px] leading-4 text-muted-foreground">칸 왼쪽이 index 0, 오른쪽이 index 1입니다. 주황 칸이 바꿔치기한 값입니다.</p>
      </div>
      <ol className="min-w-0 space-y-2">
        {CHECK_NAMES.map((name, index) => {
          const status = scene.checks[index];
          return (
            <li
              key={name}
              className={`border px-3 py-2 ${
                status === "fail" ? "border-amber-600" : status === "pass" ? "border-primary/60" : "border-dashed border-border"
              }`}
            >
              <div className="flex items-baseline justify-between gap-2">
                <strong className="text-xs">{name}</strong>
                <span
                  className={`font-mono text-[11px] font-bold ${
                    status === "fail" ? "text-amber-700 dark:text-amber-300" : status === "pass" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {STATUS_TEXT[status]}
                </span>
              </div>
              <span className="mt-1 block break-all font-mono text-[10px] leading-4 text-muted-foreground">{scene.details[index]}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function TamperCheckViz() {
  const scenes = useAnimatedScenes(SCENES.length, 5600);
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="세 검사 · 무엇을 막는가"
      title="바꿔치기마다 처음 걸리는 검사가 다릅니다"
      description="정상 제출 하나와 바꿔치기 세 가지를 같은 세 검사에 넣습니다. 한 검사만으로는 세 경우를 모두 거부할 수 없습니다."
      note="B₁·B*·C′·π′·B′·h′는 바꿔치기를 보이려는 설명용 기호이며 실제 값은 생략합니다. '—'는 앞 검사에서 이미 거부된 칸입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정상 제출과 세 가지 바꿔치기가 각각 어느 검사에서 거부되는지 보여 주는 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => <SceneBody key={scene.label} scene={scene} />)}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} playLabel="바꿔치기 검사 재생" />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
