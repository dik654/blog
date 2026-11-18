import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vote — ProcessAttestation은 nextRoot·nextSlot만 바꾸고, Head가 시작될 때 updateBalances가
 * currentRoot의 직접 balance에서 q_old를 빼고 nextRoot에 q_new를 더한 뒤 current ← next로 회전한다.
 * validator 한 명의 vote가 A353에서 B353으로 바뀌는 경우를 따라간다. 처음 current = next = A353은 설명용 출발점이다(가정).
 */
interface VoteScene {
  label: string;
  summary: string;
  note: string;
  current: string;
  next: string;
  nextChanged: boolean;
  currentChanged: boolean;
  incoming: string;
  incomingKind: "none" | "accepted" | "ignored";
  a: string;
  b: string;
  moved: boolean;
}

const SCENES: readonly VoteScene[] = [
  {
    label: "반영된 상태 (가정)",
    summary: "current = next = A353",
    note: "currentRoot는 이미 직접 balance에 반영된 root, nextRoot는 다음 Head()에서 반영할 root입니다. 이 validator의 vote는 A353에 반영돼 있어 A353의 직접 balance b_A 안에 이 validator의 이전 justified balance q_old가 들어 있습니다.",
    current: "A353",
    next: "A353",
    nextChanged: false,
    currentChanged: false,
    incoming: "대기 중",
    incomingKind: "none",
    a: "b_A",
    b: "b_B",
    moved: false,
  },
  {
    label: "새 attestation",
    summary: "next ← B353 · balance 그대로",
    note: "Target state와 signature 검증을 마친 attestation이 B353을 가리키고, target epoch가 기존 next의 epoch보다 새롭습니다. ProcessAttestation은 nextRoot와 nextSlot만 바꾸고 직접 balance는 건드리지 않습니다.",
    current: "A353",
    next: "B353",
    nextChanged: true,
    currentChanged: false,
    incoming: "B353 · 더 새로운 target epoch",
    incomingKind: "accepted",
    a: "b_A",
    b: "b_B",
    moved: false,
  },
  {
    label: "새롭지 않은 attestation",
    summary: "next 그대로",
    note: "첫 vote가 아니고 target epoch도 기존 next보다 새롭지 않은 attestation이 오면 nextRoot와 nextSlot을 바꾸지 않습니다. 과거 attestation을 쌓지 않고 validator마다 최신 한 쌍만 남깁니다.",
    current: "A353",
    next: "B353",
    nextChanged: false,
    currentChanged: false,
    incoming: "target epoch가 새롭지 않음",
    incomingKind: "ignored",
    a: "b_A",
    b: "b_B",
    moved: false,
  },
  {
    label: "Head(): balance 이동",
    summary: "A353 − q_old · B353 + q_new",
    note: "Head 계산이 시작되면 updateBalances가 current와 next를 비교합니다. currentRoot A353의 직접 balance에서 이전 justified balance q_old를 빼고, nextRoot B353에 새 justified balance q_new를 더합니다. B353이 store에 있을 때만 더합니다. Subtree weight는 다음 단계에서 다시 합산합니다.",
    current: "A353",
    next: "B353",
    nextChanged: false,
    currentChanged: false,
    incoming: "—",
    incomingKind: "none",
    a: "b_A − q_old",
    b: "b_B + q_new",
    moved: true,
  },
  {
    label: "current ← next",
    summary: "current = next = B353",
    note: "반영이 끝난 next를 current로 회전합니다. 이제 current와 next가 같으므로 다음 Head()가 같은 vote를 B353에 다시 더하지 않습니다.",
    current: "B353",
    next: "B353",
    nextChanged: false,
    currentChanged: true,
    incoming: "—",
    incomingKind: "none",
    a: "b_A − q_old",
    b: "b_B + q_new",
    moved: false,
  },
];

function Slot({ name, value, changed, detail }: { name: string; value: string; changed: boolean; detail: string }) {
  return (
    <div className={`min-w-0 rounded-lg border bg-background p-3 ${changed ? "border-primary" : "border-border"}`}>
      <span className="block font-mono text-[11px] font-bold text-muted-foreground">{name}</span>
      <strong className={`mt-1 block font-mono text-base ${changed ? "text-primary" : ""}`}>{value}</strong>
      <span className="mt-1 block break-keep text-[11px] leading-4 text-muted-foreground">{detail}</span>
    </div>
  );
}

function NodeCard({ root, value, moved, sign }: { root: string; value: string; moved: boolean; sign: "−" | "+" }) {
  return (
    <div className={`min-w-0 rounded-lg border bg-background p-3 ${moved ? (sign === "−" ? "border-amber-600" : "border-primary") : "border-border"}`}>
      <span className="block font-mono text-[11px] font-bold text-muted-foreground">{root}.balance</span>
      <strong className={`mt-1 block font-mono text-sm sm:text-base ${moved ? (sign === "−" ? "text-amber-700 dark:text-amber-400" : "text-primary") : ""}`}>{value}</strong>
      <span className="mt-1 block break-keep text-[11px] leading-4 text-muted-foreground">직접 지지 balance</span>
    </div>
  );
}

export default function VoteRotationViz() {
  return (
    <SceneShell
      eyebrow="Latest vote"
      title="Attestation은 next만 바꾸고, balance는 Head()에서 한 번 옮깁니다"
      description="Validator 한 명의 vote가 A353에서 B353으로 바뀌는 경우입니다. 위 두 칸은 이 validator의 Vote 기록, 가운데는 들어온 attestation, 아래 두 칸은 node의 직접 balance입니다. q_old·q_new는 이전·현재 justified state에서 읽은 이 validator의 effective balance이며 크기는 정하지 않았습니다."
      ariaLabel="validator 한 명의 current·next vote와 두 node의 직접 balance가 바뀌는 다섯 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Slot name="vote.currentRoot" value={scene.current} changed={scene.currentChanged} detail="balance에 반영된 root" />
              <Slot name="vote.nextRoot" value={scene.next} changed={scene.nextChanged} detail="다음 Head()에서 반영" />
            </div>
            <div
              className={`rounded-lg border border-dashed px-3 py-2 text-center text-xs sm:text-sm ${
                scene.incomingKind === "accepted" ? "border-primary text-primary" : scene.incomingKind === "ignored" ? "border-red-600 text-red-700 dark:text-red-400" : "border-border text-muted-foreground"
              }`}
            >
              <span className="font-bold">들어온 attestation</span>
              <span className="mx-2">·</span>
              <span>{scene.incoming}</span>
              {scene.incomingKind === "ignored" && <span className="ml-2 font-bold">→ 무시</span>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <NodeCard root="A353" value={scene.a} moved={scene.moved} sign="−" />
              <NodeCard root="B353" value={scene.b} moved={scene.moved} sign="+" />
            </div>
          </div>
        );
      }}
    />
  );
}
