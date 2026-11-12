import StoryShell from "./StoryShell";

/**
 * 본문 대응: ModernArticle.tsx #compatibility — R = G ∧ D ∧ S ∧ I ∧ X,
 * "리셋 검사가 실패하면 R=0", "H100과 특정 드라이버·runsc가 통과해도 A6000이나 다른 드라이버 조합은 별도로 확인".
 */
type Cell = "pass" | "fail" | "redo";

const CONDS = [
  { s: "G", n: "GPU 모델" },
  { s: "D", n: "드라이버 ABI" },
  { s: "S", n: "샌드박스 경로" },
  { s: "I", n: "격리" },
  { s: "X", n: "리셋·해제·금지 요청" },
] as const;

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  gpu: string;
  driver: string;
  changed: number | null;
  cells: readonly Cell[];
  result: "pass" | "fail" | "redo";
}[] = [
  {
    label: "다섯 조건 모두 통과",
    summary: "R = 1",
    note: "한 조합의 GPU·드라이버·샌드박스 경로·격리·수명주기 검사가 모두 1이면 그 조합만 검증 완료로 기록합니다.",
    gpu: "H100",
    driver: "드라이버 A (가정)",
    changed: null,
    cells: ["pass", "pass", "pass", "pass", "pass"],
    result: "pass",
  },
  {
    label: "리셋 검사만 실패",
    summary: "1 ∧ 1 ∧ 1 ∧ 1 ∧ 0 = 0",
    note: "앞의 네 조건이 1이라고 두면(가정), GPU 탐지와 CUDA 예제가 통과해도 리셋 검사가 실패하는 순간 AND 전체가 0입니다. 이 조합은 검증 완료가 아니라 실험 상태로 남깁니다.",
    gpu: "H100",
    driver: "드라이버 A (가정)",
    changed: null,
    cells: ["pass", "pass", "pass", "pass", "fail"],
    result: "fail",
  },
  {
    label: "GPU만 바꿈",
    summary: "H100 → A6000 · R 미확인",
    note: "H100 조합이 통과해도 A6000 조합의 근거가 되지 않습니다. nvproxy 경로라면 A6000은 이 gVisor 릴리스의 공식 지원 목록에도 명시되어 있지 않습니다. 실제 장비에서 다섯 조건을 다시 확인합니다.",
    gpu: "A6000",
    driver: "드라이버 A (가정)",
    changed: 0,
    cells: ["redo", "redo", "redo", "redo", "redo"],
    result: "redo",
  },
  {
    label: "드라이버만 바꿈",
    summary: "같은 H100 · R 미확인",
    note: "GPU 이름이 같아도 드라이버가 달라지면 다른 경로입니다. 이전 조합의 결과를 물려받지 않고 새 조합으로 기록합니다.",
    gpu: "H100",
    driver: "드라이버 B (가정)",
    changed: 1,
    cells: ["redo", "redo", "redo", "redo", "redo"],
    result: "redo",
  },
];

const CELL_STYLE: Record<Cell, { border: string; color: string; text: string; dashed: boolean }> = {
  pass: { border: "#10b981", color: "#047857", text: "1", dashed: false },
  fail: { border: "#ef4444", color: "#b91c1c", text: "0", dashed: false },
  redo: { border: "#94a3b8", color: "#64748b", text: "?", dashed: true },
};

const RESULT_TEXT = {
  pass: { t: "R = 1 · 이 조합은 검증 완료", c: "#047857", b: "#10b981" },
  fail: { t: "R = 0 · 실험 상태로 남김", c: "#b91c1c", b: "#ef4444" },
  redo: { t: "R 미확인 · 새 조합으로 다시 검사", c: "#64748b", b: "#94a3b8" },
} as const;

function Drawing({ index }: { index: number }) {
  const scene = SCENES[index];
  const result = RESULT_TEXT[scene.result];
  return (
    <div className="mx-auto max-w-[620px] space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs">
        {[
          { k: "GPU", v: scene.gpu, hit: scene.changed === 0 },
          { k: "드라이버", v: scene.driver, hit: scene.changed === 1 },
        ].map((item) => (
          <div
            key={item.k}
            className="rounded-md border px-2 py-1.5"
            style={{ borderColor: item.hit ? "#f59e0b" : "#cbd5e1" }}
          >
            <span className="block text-muted-foreground">{item.k}</span>
            <strong className="block text-sm" style={{ color: item.hit ? "#b45309" : undefined }}>
              {item.v}
              {item.hit ? " · 바뀜" : ""}
            </strong>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-1 sm:gap-2">
        {CONDS.map((cond, i) => {
          const style = CELL_STYLE[scene.cells[i]];
          return (
            <div
              key={cond.s}
              className="flex min-h-[4.75rem] min-w-0 flex-col items-center justify-start rounded-md border px-1 py-2 text-center"
              style={{ borderColor: style.border, borderStyle: style.dashed ? "dashed" : "solid" }}
            >
              <span className="font-mono text-sm font-bold">{cond.s}</span>
              <span className="mt-1 break-keep text-[11px] leading-4 text-muted-foreground">{cond.n}</span>
              <span className="mt-auto font-mono text-base font-bold" style={{ color: style.color }}>{style.text}</span>
            </div>
          );
        })}
      </div>
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono">G ∧ D ∧ S ∧ I ∧ X</span>
        <span>→</span>
      </div>
      <div className="rounded-md border px-3 py-2 text-center text-sm font-bold" style={{ borderColor: result.b, color: result.c }}>
        {result.t}
      </div>
    </div>
  );
}

export default function CombinationReceiptViz() {
  return (
    <StoryShell
      eyebrow="한 조합의 근거"
      title="조건 하나가 0이거나 부품 하나가 바뀌면 결과를 물려받지 않습니다"
      description="칸 다섯 개는 바로 아래 식 R = G ∧ D ∧ S ∧ I ∧ X의 다섯 조건이고, R은 다섯 칸이 모두 1일 때만 1이 되는 이 조합의 검증 결과입니다. 1은 통과, 0은 실패, ?는 이 조합에서 아직 확인하지 않은 상태입니다. 드라이버 A·B는 설명을 위한 가정입니다."
      note="샌드박스 경로(nvproxy 또는 VFIO)와 런타임 릴리스는 장면 내내 같다고 둡니다(가정)."
      ariaLabel="GPU 검증 조건 다섯 개의 AND와 부품을 바꿨을 때 결과를 물려받지 않는 규칙"
      scenes={SCENES}
      render={(index) => <Drawing index={index} />}
    />
  );
}
