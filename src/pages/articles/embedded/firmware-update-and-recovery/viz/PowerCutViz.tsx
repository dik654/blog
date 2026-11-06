import SceneShell from "./SceneShell";

/**
 * 본문 대응: #power — 전원이 끊기는 네 지점과 다음 부팅의 경로.
 * 슬롯의 여섯 조각과 교체 중 진행 위치는 그림을 위한 가정이다. 조각 수는 본문이 정하지 않았다.
 */
type Piece = "v1" | "v2" | "";

const PHASES = ["다운로드", "시험 교체", "v2 시험 실행", "확정 뒤"] as const;

const SCENES: readonly { label: string; summary: string; note: string; primary: readonly Piece[]; secondary: readonly Piece[]; next: string }[] = [
  { label: "다운로드 도중", summary: "다음 부팅: v1 유지", primary: ["v1", "v1", "v1", "v1", "v1", "v1"], secondary: ["v2", "v2", "v2", "", "", ""], next: "후보가 불완전 → v1 유지", note: "후보 슬롯이 불완전하므로 v1을 유지합니다. 주 슬롯은 건드리지 않았습니다." },
  { label: "시험 교체 도중", summary: "다음 부팅: 교체 재개", primary: ["v2", "v2", "v1", "v1", "v1", "v1"], secondary: ["v1", "v1", "v2", "v2", "v2", "v2"], next: "기록된 교체 상태를 읽어 재개", note: "두 슬롯이 섞여 있어도 MCUboot의 지원되는 swap 구현은 기록된 교체 상태를 읽어 중단된 작업을 재개합니다." },
  { label: "시험 실행 중, 확정 전", summary: "다음 부팅: v1로 되돌림", primary: ["v2", "v2", "v2", "v2", "v2", "v2"], secondary: ["v1", "v1", "v1", "v1", "v1", "v1"], next: "미확정 → v1로 되돌림", note: "교체는 끝났지만 확정 기록이 없습니다. 다음 부팅에서 v1로 되돌립니다." },
  { label: "확정이 끝난 뒤", summary: "다음 부팅: v2 유지", primary: ["v2", "v2", "v2", "v2", "v2", "v2"], secondary: ["v1", "v1", "v1", "v1", "v1", "v1"], next: "확정됨 → v2 유지", note: "슬롯의 내용은 앞 장면과 같습니다. 달라진 것은 확정 기록 하나이고, 이 때문에 재시작해도 v2가 남습니다." },
];

const PIECE_CLASS: Record<Piece, string> = {
  v1: "bg-slate-500 text-white",
  v2: "bg-blue-600 text-white",
  "": "border border-dashed border-border text-muted-foreground/70",
};

function Slot({ name, pieces }: { name: string; pieces: readonly Piece[] }) {
  return (
    <div className="grid grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-xs font-semibold">{name}</span>
      <div className="grid grid-cols-6 gap-0.5">
        {pieces.map((piece, index) => (
          <span key={index} className={`flex h-7 items-center justify-center rounded-sm font-mono text-xs font-bold ${PIECE_CLASS[piece]}`}>{piece || "−"}</span>
        ))}
      </div>
    </div>
  );
}

export default function PowerCutViz() {
  return (
    <SceneShell
      eyebrow="전원 차단 네 지점"
      title="끊긴 위치가 다르면 다음 부팅의 경로도 다릅니다"
      description="위 줄은 교체의 진행 순서이고 ✕가 전원이 끊긴 자리입니다. 아래는 그 순간 두 슬롯의 내용입니다. 조각 여섯 개와 진행 위치는 그림을 위한 가정입니다."
      ariaLabel="다운로드, 시험 교체, 시험 실행, 확정 뒤에 전원이 끊겼을 때 두 슬롯의 내용과 다음 부팅의 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <ol className="grid grid-cols-4 gap-1">
              {PHASES.map((phase, index) => {
                const cut = index === active;
                const done = index < active;
                return (
                  <li key={phase} className="min-w-0 text-center">
                    <div className={`h-6 text-sm font-bold ${cut ? "text-red-700 dark:text-red-400" : "text-transparent"}`} aria-hidden={!cut}>✕</div>
                    <svg viewBox="0 0 100 6" preserveAspectRatio="none" className="h-1.5 w-full" aria-hidden="true">
                      <rect x={0} y={0} width={100} height={6} fill={done ? "#2563eb" : "#cbd5e1"} />
                      {cut && <rect x={0} y={0} width={50} height={6} fill="#2563eb" />}
                    </svg>
                    <p className={`mt-1.5 text-xs leading-4 ${cut ? "font-bold" : "text-muted-foreground"}`}>{phase}</p>
                  </li>
                );
              })}
            </ol>
            <div className="mt-4 space-y-1.5">
              <Slot name="주 슬롯" pieces={scene.primary} />
              <Slot name="보조 슬롯" pieces={scene.secondary} />
            </div>
            <p className="mt-3 rounded-lg bg-muted/50 px-3 py-2 text-sm font-semibold leading-6">{scene.next}</p>
          </div>
        );
      }}
    />
  );
}
