import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-state — boot_swap_tables를 위에서부터 비교한다. offset 전용 항목은 scratch 설정에서 제외.
 * TEST: 보조 magic GOOD·image_ok UNSET / PERM: 보조 magic GOOD·image_ok SET / REVERT: 주 magic GOOD·copy_done SET·image_ok UNSET.
 * 맞는 항목이 없으면 교체하지 않는 NONE으로 간다.
 */
type Row = "match" | "miss" | "skip";

const RULES = [
  { name: "TEST", when: "보조: magic GOOD, image_ok UNSET" },
  { name: "PERM", when: "보조: magic GOOD, image_ok SET" },
  { name: "REVERT", when: "주: magic GOOD, copy_done SET, image_ok UNSET" },
  { name: "NONE", when: "위 항목이 모두 맞지 않음" },
] as const;

const SCENES: readonly { label: string; summary: string; note: string; primary: string; secondary: string; rows: readonly [Row, Row, Row, Row]; why: readonly [string, string, string, string] }[] = [
  { label: "v2 시험 요청 뒤", summary: "첫 항목 TEST에서 멈춤", primary: "v1, 기존 정상 기록", secondary: "v2, magic GOOD · image_ok UNSET", rows: ["match", "skip", "skip", "skip"], why: ["일치", "", "", ""], note: "보조 슬롯의 요청이 먼저 검사됩니다. 첫 항목이 맞으면 아래는 보지 않습니다." },
  { label: "v2 교체 완료 · 미확정", summary: "셋째 항목 REVERT에서 멈춤", primary: "v2, magic GOOD · copy_done SET · image_ok UNSET", secondary: "v1, magic UNSET", rows: ["miss", "miss", "match", "skip"], why: ["보조 magic UNSET", "보조 magic UNSET", "일치", ""], note: "보조 magic이 UNSET이라 위 두 항목은 맞지 않고 주 슬롯 기록이 REVERT와 맞습니다." },
  { label: "v2 교체 완료 · 확정", summary: "맞는 항목 없음 → NONE", primary: "v2, magic GOOD · copy_done SET · image_ok SET", secondary: "v1, magic UNSET", rows: ["miss", "miss", "miss", "match"], why: ["보조 magic UNSET", "보조 magic UNSET", "주 image_ok SET", "v2 사용"], note: "앞 장면과 달라진 것은 주 image_ok 하나입니다. 그래서 REVERT도 맞지 않습니다." },
  { label: "처음부터 image_ok SET", summary: "둘째 항목 PERM에서 멈춤", primary: "v1, 기존 정상 기록", secondary: "v2, magic GOOD · image_ok SET", rows: ["miss", "match", "skip", "skip"], why: ["보조 image_ok SET", "일치", "", ""], note: "처음부터 SET이면 PERM이 먼저 맞습니다. 제품 검사 뒤 확정하는 이번 절차와 다른 요청입니다." },
];

const ROW_CLASS: Record<Row, string> = {
  match: "border-blue-600 bg-blue-600/10",
  miss: "border-border bg-background",
  skip: "border-dashed border-border/70 opacity-55",
};

export default function SwapTableMatchViz() {
  return (
    <SceneShell
      eyebrow="표를 위에서부터 비교"
      title="기록 하나의 차이로 맞는 항목이 달라집니다"
      description="magic은 슬롯 기록이 유효한지 알리는 고정값, copy_done은 복사 완료, image_ok는 정상 확인 표시입니다."
      ariaLabel="슬롯 기록을 TEST, PERM, REVERT 순서로 비교해 처음 맞는 항목을 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <dl className="grid gap-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs leading-5">
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2"><dt className="font-bold">주 슬롯</dt><dd className="text-muted-foreground">{scene.primary}</dd></div>
              <div className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2"><dt className="font-bold">보조 슬롯</dt><dd className="text-muted-foreground">{scene.secondary}</dd></div>
            </dl>
            <ol className="mt-2 space-y-1">
              {RULES.map((rule, index) => (
                <li key={rule.name} className={`grid grid-cols-[3.25rem_minmax(0,1fr)] gap-1 rounded-md border px-2 py-0.5 text-xs leading-5 ${ROW_CLASS[scene.rows[index]]}`}>
                  <span className="font-mono font-bold">{rule.name}</span>
                  <span className="min-w-0">
                    <span className="block text-muted-foreground">{rule.when}</span>
                    <span className={`block font-semibold ${scene.rows[index] === "match" ? "text-blue-700 dark:text-blue-400" : ""}`}>
                      {scene.rows[index] === "skip" ? "보지 않음" : scene.rows[index] === "match" ? `→ ${scene.why[index]}` : `✕ ${scene.why[index]}`}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        );
      }}
    />
  );
}
