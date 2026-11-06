import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — PSI의 some과 full. 같은 시간축에서 작업 두 개가 멈춘 구간을 겹쳐 본다.
 * (가정) 10칸 중 A는 2~5칸, B는 4~7칸에서 멈춤 → 하나라도 멈춤 6칸(60%), 둘 다 멈춤 2칸(20%).
 */
const SLOTS = Array.from({ length: 10 }, (_, slot) => slot);
const A_STALL = new Set([2, 3, 4, 5]);
const B_STALL = new Set([4, 5, 6, 7]);

const SCENES = [
  { label: "두 작업이 멈추는 구간", summary: "× = 메모리를 기다리는 칸", row: "none", note: "메모리를 요청한 작업이 직접 회수를 하며 기다리는 칸을 ×로 표시했습니다. 멈추는 구간은 작업마다 다르고 겹칠 수도 있습니다." },
  { label: "some: 적어도 하나가 멈춘 시간", summary: "10칸 중 6칸 = 60%", row: "some", note: "A든 B든 하나라도 멈춘 칸을 셉니다. 3번째부터 8번째까지 여섯 칸이고, 이때 다른 작업은 일하고 있어도 칸에 들어갑니다." },
  { label: "full: 전부가 동시에 멈춘 시간", summary: "10칸 중 2칸 = 20%", row: "full", note: "일하던 작업 전부가 함께 멈춘 칸만 셉니다. A와 B가 겹친 두 칸이고 some의 여섯 칸 안에 들어갑니다. full이 오래 높으면 커널 문서는 thrashing(비운 page를 곧 다시 읽느라 일이 나아가지 못하는 상태)으로 봅니다." },
] as const;

const GRID = { gridTemplateColumns: "3.25rem repeat(10, minmax(0, 1fr))" };

function Row({ label, on, color, mark }: { label: string; on: (slot: number) => boolean; color: string; mark: string }) {
  return (
    <div className="grid items-center gap-1" style={GRID}>
      <span className="text-xs font-semibold">{label}</span>
      {SLOTS.map((slot) => (
        <div
          key={slot}
          className="flex h-8 items-center justify-center rounded-sm border text-xs font-bold"
          style={{ borderColor: on(slot) ? color : "#94a3b8", backgroundColor: on(slot) ? color : "transparent", color: "#ffffff" }}
        >
          {on(slot) ? mark : ""}
        </div>
      ))}
    </div>
  );
}

export default function PsiTimelineViz() {
  return (
    <SceneShell
      eyebrow="PSI some · full"
      title="some은 하나라도, full은 전부가 멈춘 시간입니다"
      description="PSI(Pressure Stall Information)는 작업이 메모리 때문에 멈춘 시간의 비율입니다. 가로 한 칸이 같은 길이의 시간입니다."
      note="작업 두 개, 10칸, 멈춘 위치는 모두 설명용 가정입니다. 실제 값은 /proc/pressure/memory에서 읽습니다."
      ariaLabel="두 작업의 멈춘 구간으로 계산한 PSI some과 full"
      scenes={SCENES}
      render={(active) => {
        const row = SCENES[active].row;
        return (
          <div className="min-w-0 space-y-1.5">
            <Row label="작업 A" on={(slot) => A_STALL.has(slot)} color="#d97706" mark="×" />
            <Row label="작업 B" on={(slot) => B_STALL.has(slot)} color="#d97706" mark="×" />
            <div className="my-2 border-t border-border" />
            <Row label="some" on={(slot) => row !== "none" && (A_STALL.has(slot) || B_STALL.has(slot))} color="#2563eb" mark="●" />
            <Row label="full" on={(slot) => row === "full" && A_STALL.has(slot) && B_STALL.has(slot)} color="#dc2626" mark="●" />
            <p className="pt-1 text-right text-xs text-muted-foreground">시간 →</p>
          </div>
        );
      }}
    />
  );
}
