import SceneShell from "./SceneShell";

/**
 * 본문 대응: the-numbering 절.
 * 셰일의 추정 35 → 편집자가 100부터 다시 시작(65 + 35 = 100), 빠진 번호 66~99는 34개.
 * 본문의 가정: 사라진 분량을 30으로 보았다면 같은 조항이 95조(65 + 30 = 95), 빠진 번호 66~94는 29개.
 * 칸 하나가 쓰이지 않은 번호 하나다. 지워진 조항 하나가 아니다.
 */
const LAST_KEPT = 65;

const ROWS = [
  { key: "scheil", estimate: 35, who: "셰일의 추정 35 · 이 판이 따름", color: "#0ea5e9" },
  { key: "other", estimate: 30, who: "다른 학자가 30으로 보았다면 (본문의 가정)", color: "#f59e0b" },
] as const;

const SCENES = [
  {
    label: "번호 차이",
    summary: "100 − 65 = 35",
    note: "편집자는 셰일이 사라진 부분을 35개 조항으로 추정했고, 그를 따라 100조부터 다시 시작한다고 적습니다. 65와 100의 차이가 그 35입니다.",
  },
  {
    label: "빠진 번호의 개수",
    summary: "66 ~ 99 → 34개",
    note: "칸 하나가 쓰이지 않은 번호 하나입니다. 66부터 99까지 세면 34칸이라, 번호 차이 35와 같은 수가 아닙니다. 어느 쪽도 지워진 단에서 직접 센 조항 수가 아닙니다.",
  },
  {
    label: "추정이 30이었다면",
    summary: "65 + 30 = 95",
    note: "본문의 가정대로 다른 학자가 사라진 분량을 30개로 보았다면, 같은 조항이 95조가 됩니다. 쓰이지 않은 번호는 66~94의 29칸으로 줄어듭니다. 돌에 새겨진 글자는 그대로이고 번호만 바뀝니다.",
  },
  {
    label: "번호에 실린 것",
    summary: "제100조 = 조항 + 추정",
    note: "100이라는 번호는 돌에 새겨진 글자가 아니라 복원 과정에서 붙었습니다. 그래서 \"제100조\"라고 인용하면 셰일의 추정이 함께 실려 옵니다. 이 판의 주는 35를 얻은 절차를 설명하지 않으므로, 어느 판을 따랐는지 함께 적어야 합니다.",
  },
] as const;

export default function NumberGapViz() {
  return (
    <SceneShell
      eyebrow="번호 안의 추정"
      title="100이라는 번호는 사라진 분량을 어떻게 추정했느냐에 따라 정해졌습니다"
      description="한 줄이 하나의 추정입니다. 점선 칸 하나가 쓰이지 않은 번호 하나이고, 지워진 조항 하나가 아닙니다. 굵은 칸이 지워진 자리 뒤에 처음 오는 같은 조항입니다."
      note="35라는 추정과 100부터 다시 시작한 번호는 C. H. W. Johns 영역본(1903년 판) 65조 뒤 편집자 주에 적힌 것입니다. 30이라는 추정은 본문이 든 가정입니다."
      ariaLabel="추정 35와 추정 30에서 지워진 자리 뒤 첫 조항의 번호와 쓰이지 않은 번호의 개수"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          {ROWS.map((row, rowIndex) => {
            const restart = LAST_KEPT + row.estimate;
            const skipped = restart - LAST_KEPT - 1;
            const lit = rowIndex === 0 ? active !== 2 : active >= 2;
            const cellsLit = active >= 1;
            const endsLit = active === 0 || active >= 2;
            return (
              <div
                key={row.key}
                className="min-w-0 rounded-lg border p-3 transition-opacity duration-300 motion-reduce:transition-none"
                style={{ borderColor: row.color, opacity: lit ? 1 : 0.35 }}
              >
                <p className="text-xs font-bold" style={{ color: row.color }}>
                  {row.who}
                </p>
                <div className="mt-2 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
                  <span
                    className="rounded-md border px-2 py-1 font-mono text-xs"
                    style={{ borderColor: "#64748b", fontWeight: endsLit ? 700 : 400 }}
                  >
                    {LAST_KEPT}조
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap gap-0.5" aria-hidden>
                      {Array.from({ length: skipped }, (_, i) => (
                        <span
                          key={i}
                          className="h-4 w-3 rounded-sm border border-dashed"
                          style={{ borderColor: cellsLit ? row.color : "#94a3b8" }}
                        />
                      ))}
                    </div>
                    <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                      {LAST_KEPT + 1} ~ {restart - 1} · {skipped}칸
                    </p>
                  </div>
                  <span
                    className="rounded-md border-2 px-2 py-1 font-mono text-xs font-bold"
                    style={{ borderColor: endsLit ? row.color : "#94a3b8" }}
                  >
                    {restart}조
                  </span>
                </div>
                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {LAST_KEPT} + {row.estimate} = {restart} · 빠진 번호 {skipped}개
                </p>
              </div>
            );
          })}
          <p
            className="rounded-md border border-dashed px-3 py-2 text-xs leading-5 transition-opacity duration-300 motion-reduce:transition-none"
            style={{ borderColor: "#64748b", opacity: active === 3 ? 1 : 0.35 }}
          >
            "제100조" = 돌에 새겨진 조항 + 복원 때 붙은 번호(셰일의 추정 35를 따름)
          </p>
        </div>
      )}
    />
  );
}
