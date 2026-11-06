import SceneShell from "./SceneShell";

/**
 * 본문 대응: #information-boundary — train은 가중치만, validation은 정책 선택만, outer는 승인·거절만 다룬다.
 * 세로줄이 자료, 가로줄이 값입니다. outer 결과로 행동 기준을 고치면 outer도 validation 역할을 하게 된다.
 */
const DATA = ["train-v12", "validation-v7", "outer-v3"] as const;
const VALUES = [
  { name: "가중치 θ", cells: ["바꿈", "고정", "고정"] },
  { name: "정책 고르기", cells: ["아직", "고름", "고정"] },
  { name: "승인·거절", cells: ["아직", "아직", "판정"] },
] as const;

const SCENES = [
  { label: "train-v12", summary: "결과: 학습 산출물 C17·C24·C29", column: 0, breach: false, note: "학습 자료는 미분 가능한 손실로 가중치만 바꿉니다. 행동 기준과 실행 설정은 아직 고르지 않습니다." },
  { label: "validation-v7", summary: "결과: 정책 하나", column: 1, breach: false, note: "가중치는 건드리지 않고, 산출물·행동 기준·실행 설정을 묶은 정책 후보를 사전 선택 규칙으로 비교해 하나를 고릅니다." },
  { label: "outer-v3", summary: "결과: 승인 또는 거절", column: 2, breach: false, note: "독립 최종 자료는 고정된 정책을 그대로 실행해 사전 승인 규칙으로 판정합니다. 여기서는 아무 값도 조정하지 않습니다." },
  { label: "경계를 넘으면", summary: "outer-v3도 validation 역할", column: 2, breach: true, note: "outer-v3의 recall을 보고 행동 기준 0.62를 다시 맞추는 순간 outer-v3는 선택에 쓰인 자료가 됩니다. 바뀐 정책에는 새 독립 최종 자료가 필요합니다." },
] as const;

function tone(text: string, on: boolean) {
  if (!on) return { color: "#94a3b8", borderColor: "#94a3b833", backgroundColor: "transparent" };
  if (text === "고정" || text === "아직") return { color: "#64748b", borderColor: "#94a3b8", backgroundColor: "transparent" };
  return { color: "#ffffff", borderColor: "#2563eb", backgroundColor: "#2563eb" };
}

export default function DataBoundaryViz() {
  return (
    <SceneShell
      eyebrow="자료별 권한"
      title="어느 자료가 어떤 값을 바꿀 수 있는가"
      description="세로줄이 자료, 가로줄이 값입니다. 채운 칸만 그 자료에서 움직입니다. 정책은 학습 산출물·행동 기준(긴급으로 분류하기 시작할 점수 경계)·실행 설정의 묶음이고, outer-v3는 독립 최종 자료입니다. 이름과 값은 설명용 가정입니다."
      ariaLabel="train, validation, outer 자료가 각각 바꿀 수 있는 값과 경계 위반의 결과"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="mx-auto max-w-[580px] text-xs">
            <div className="grid grid-cols-[minmax(0,1.15fr)_repeat(3,minmax(0,1fr))] gap-1">
              <span />
              {DATA.map((name, index) => (
                <span key={name} className={`break-all pb-1 text-center font-mono text-[10px] sm:text-xs ${index === scene.column ? "font-bold text-primary" : "text-muted-foreground"}`}>{name}</span>
              ))}
              {VALUES.map((row, rowIndex) => (
                <div key={row.name} className="contents">
                  <span className="flex items-center break-keep py-1 pr-1 font-semibold leading-4">{row.name}</span>
                  {row.cells.map((cell, index) => {
                    const hit = scene.breach && rowIndex === 1 && index === 2;
                    const style = hit ? { color: "#dc2626", borderColor: "#dc2626", backgroundColor: "transparent" } : tone(cell, index === scene.column);
                    return (
                      <span key={DATA[index]} className={`flex items-center justify-center rounded border py-2 font-bold ${hit ? "border-dashed" : ""}`} style={style}>
                        {hit ? "0.62 수정" : cell}
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
            <p className={`mt-3 rounded border border-dashed px-3 py-2 text-center font-semibold leading-5 ${scene.breach ? "" : "invisible"}`} style={{ borderColor: "#dc2626", color: "#dc2626" }}>
              outer-v3의 recall → 행동 기준 수정 → 새 독립 최종 자료 필요
            </p>
          </div>
        );
      }}
    />
  );
}
