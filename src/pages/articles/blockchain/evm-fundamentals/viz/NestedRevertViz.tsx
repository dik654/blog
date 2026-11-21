import SceneShell from "./EvmSceneShell";

/**
 * 본문 대응: #gas-state·#release — 실행 중 변경은 따로 기록했다가 종료 결과에 따라 반영하거나 되돌린다.
 * 하위 호출이 실패해도 상위 호출이 실패 표시를 확인하고 계속할 수 있고,
 * 상위 호출까지 실패하면 앞서 성공한 하위 호출의 변경도 함께 취소된다.
 */
type Status = "pending" | "kept" | "undone" | "mayKeep";

const STATUS: Record<Status, { text: string; color: string; dashed: boolean }> = {
  pending: { text: "… 임시 기록", color: "#64748b", dashed: true },
  kept: { text: "✓ 남음", color: "#15803d", dashed: false },
  undone: { text: "✕ 취소", color: "#dc2626", dashed: true },
  mayKeep: { text: "✓ 상위가 성공하면 남음", color: "#15803d", dashed: false },
};

interface Frame {
  parentEnd: string;
  childEnd: string;
  a: Status;
  b: Status;
}

const FRAMES: readonly Frame[] = [
  { parentEnd: "실행 중", childEnd: "실행 중", a: "pending", b: "pending" },
  { parentEnd: "정상 종료", childEnd: "정상 종료", a: "kept", b: "kept" },
  { parentEnd: "실패 표시 확인 뒤 계속", childEnd: "REVERT", a: "mayKeep", b: "undone" },
  { parentEnd: "실패", childEnd: "정상 종료", a: "undone", b: "undone" },
];

const SCENES = [
  {
    label: "실행 중 기록",
    summary: "A·B 모두 아직 임시",
    note: "상위 호출이 storage를 바꾸고(A) 하위 호출을 불러 또 바꿉니다(B). 클라이언트는 이 변경을 바로 확정하지 않고 따로 기록해 두었다가 종료 결과에 따라 반영하거나 되돌립니다.",
  },
  {
    label: "둘 다 성공",
    summary: "A·B 남음",
    note: "하위 호출과 상위 호출이 모두 정상 종료(STOP·RETURN)하면 두 변경이 남습니다. 하위 호출 하나의 성공만으로는 부족하고 상위 호출까지 성공해야 변경이 끝까지 남습니다.",
  },
  {
    label: "하위만 실패",
    summary: "B 취소 · 상위는 계속할 수 있음",
    note: "하위 호출이 REVERT하면 그 호출의 변경 B만 취소됩니다. 상위 호출은 실패 표시를 확인하고 계속할 수 있으므로, 하위 호출의 실패가 항상 거래 전체를 실패시키지는 않습니다.",
  },
  {
    label: "상위가 실패",
    summary: "A 취소 · B도 취소",
    note: "하위 호출이 먼저 정상 종료했어도 상위 호출까지 실패하면, 앞서 성공한 하위 호출의 변경 B도 함께 취소됩니다.",
  },
] as const;

function Change({ name, status }: { name: string; status: Status }) {
  const s = STATUS[status];
  return (
    <div
      className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md border bg-background px-3 py-2 text-xs sm:text-sm"
      style={{ borderColor: s.color, borderStyle: s.dashed ? "dashed" : "solid" }}
    >
      <span className="font-semibold">{name}</span>
      <span className="font-semibold" style={{ color: s.color }}>
        {s.text}
      </span>
    </div>
  );
}

export default function NestedRevertViz() {
  return (
    <SceneShell
      eyebrow="중첩 호출의 되돌림"
      title="실패한 호출의 변경만 지우고, 바깥이 실패하면 안쪽 성공도 지워집니다"
      description="바깥 상자가 안쪽 상자를 부른 호출입니다. A와 B는 각 호출이 storage에 쓴 변경 하나씩이며 설명용 예입니다(가정)."
      ariaLabel="상위 호출과 하위 호출의 종료 결과에 따라 변경 A와 B가 남거나 취소되는 네 경우"
      scenes={SCENES}
      render={(active) => {
        const frame = FRAMES[active];
        return (
          <div className="min-w-0 rounded-lg border border-border p-3 sm:p-4">
            <p className="text-xs font-semibold text-muted-foreground">거래</p>
            <div className="mt-2 rounded-lg border border-border p-3 sm:p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <p className="text-sm font-bold">상위 호출</p>
                <p className="font-mono text-xs">종료: {frame.parentEnd}</p>
              </div>
              <div className="mt-2">
                <Change name="변경 A" status={frame.a} />
              </div>
              <div className="mt-3 rounded-lg border border-border p-3 sm:p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-sm font-bold">하위 호출</p>
                  <p className="font-mono text-xs">종료: {frame.childEnd}</p>
                </div>
                <div className="mt-2">
                  <Change name="변경 B" status={frame.b} />
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
