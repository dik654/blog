import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundaries — 논문 기본 two-view batch에서는 P(i)가 비지 않고,
 * 원본마다 view 하나만 쓰는 변형에서는 빈 positive set이 생길 수 있다.
 * 1·3절의 batch(신발 A·B, 가방 C)를 그대로 쓴다.
 * two-view: A₁·A₂·B₁·B₂는 positive 3개, C₁·C₂는 1개.
 * one-view(가정): A→{B}, B→{A}, C→{} → valid anchor 2 / 3.
 */
type Slot = {
  id: string;
  label: string;
  positives: string;
  count: number | null;
};

const TWO_VIEW: readonly Slot[] = [
  { id: "A₁", label: "신발", positives: "A₂·B₁·B₂", count: 3 },
  { id: "A₂", label: "신발", positives: "A₁·B₁·B₂", count: 3 },
  { id: "B₁", label: "신발", positives: "A₁·A₂·B₂", count: 3 },
  { id: "B₂", label: "신발", positives: "A₁·A₂·B₁", count: 3 },
  { id: "C₁", label: "가방", positives: "C₂", count: 1 },
  { id: "C₂", label: "가방", positives: "C₁", count: 1 },
];

const EMPTY_SLOT: Slot = { id: "—", label: "view 없음", positives: "", count: null };

const ONE_VIEW: readonly Slot[] = [
  { id: "A", label: "신발", positives: "B", count: 1 },
  { id: "B", label: "신발", positives: "A", count: 1 },
  { id: "C", label: "가방", positives: "없음", count: 0 },
  EMPTY_SLOT,
  EMPTY_SLOT,
  EMPTY_SLOT,
];

const SCENES = [
  {
    label: "Two-view batch의 positive 수",
    summary: "3 · 3 · 3 · 3 · 1 · 1",
    slots: TWO_VIEW,
    focus: [] as readonly string[],
    excluded: "",
    note: "논문 기본 구성처럼 원본마다 view가 두 개면, 각 anchor에서 자기 자신을 뺀 같은 label view를 셉니다. 신발 view 네 개는 각각 3개, 가방 view 두 개는 각각 1개입니다.",
  },
  {
    label: "C₁의 positive는 C₂",
    summary: "P(C₁) = {C₂}",
    slots: TWO_VIEW,
    focus: ["C₁", "C₂"] as readonly string[],
    excluded: "",
    note: "C₁과 label이 같은 view는 같은 원본의 다른 view C₂뿐입니다. 하나뿐이어도 비지 않으므로 C₁을 positive가 없는 anchor로 볼 수 없습니다.",
  },
  {
    label: "원본마다 view 하나만 쓰는 변형 (가정)",
    summary: "C의 positive 0개",
    slots: ONE_VIEW,
    focus: ["C"] as readonly string[],
    excluded: "",
    note: "구현을 원본마다 view 하나만 쓰는 방식으로 바꿨다고 가정하면 batch는 A·B·C 세 개입니다. A와 B는 서로를 positive로 갖지만 가방은 C 하나뿐이라 P(C)가 비어 |P(C)| = 0이 됩니다.",
  },
  {
    label: "빈 anchor는 제외하고 수를 기록",
    summary: "valid anchor 2 / 3",
    slots: ONE_VIEW,
    focus: [] as readonly string[],
    excluded: "C",
    note: "0으로 나누지 않도록 C를 anchor에서 명시적으로 제외하고, positive가 하나 이상인 anchor(valid anchor) 수 2를 기록합니다. 논문 식을 그대로 구현한 결과가 아니라 batch 구성을 바꿨을 때의 방어 규칙입니다.",
  },
] as const;

function Figure({ sceneIndex }: { sceneIndex: number }) {
  const scene = SCENES[sceneIndex];
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {scene.slots.map((slot, index) => {
          const empty = slot.count === null;
          const zero = slot.count === 0;
          const focused = scene.focus.includes(slot.id);
          const excluded = scene.excluded === slot.id;
          const border = empty
            ? "border-dashed border-border/50 text-muted-foreground/50"
            : excluded
              ? "border-dashed border-[#d97706]"
              : zero
                ? "border-[#dc2626]"
                : focused
                  ? "border-[#2563eb] bg-[#2563eb]/5"
                  : "border-border";
          return (
            <div key={`${slot.id}-${index}`} className={`min-w-0 rounded-lg border px-2 py-2 text-center ${border}`}>
              <strong className="block font-mono text-sm">{slot.id}</strong>
              <span className="block text-[10px] text-muted-foreground">{slot.label}</span>
              <span className="mt-1 block min-h-[1rem] break-keep text-[10px] leading-4 text-muted-foreground">
                {empty ? " " : `P: ${slot.positives}`}
              </span>
              <span
                className={`mt-1 block font-mono text-base font-bold ${
                  zero ? "text-[#dc2626]" : focused ? "text-[#2563eb]" : ""
                }`}
              >
                {empty ? " " : slot.count}
              </span>
              <span className={`block text-[10px] font-bold ${excluded ? "text-[#b45309]" : "invisible"}`}>
                {excluded ? "anchor 제외" : " "}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        숫자는 anchor 자신을 뺀 같은 label view 수 |P(i)|입니다. 0이면 anchor loss의 분모가 0이 됩니다.
      </p>
    </div>
  );
}

export default function PositiveCountViz() {
  return (
    <SceneShell
      eyebrow="Positive set 경계"
      title="원본마다 view가 둘이면 어떤 anchor도 positive가 비지 않습니다"
      description="1절의 설명용 batch(신발 A·B, 가방 C)를 그대로 씁니다. 칸 하나가 anchor 하나이고, 뒤 두 장면의 one-view 구성은 경계를 보이려는 가정입니다."
      ariaLabel="two-view batch와 one-view 변형에서 anchor별 positive 수 비교"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={SCENES.map((scene, index) => <Figure key={scene.label} sceneIndex={index} />)}
        />
      )}
    />
  );
}
