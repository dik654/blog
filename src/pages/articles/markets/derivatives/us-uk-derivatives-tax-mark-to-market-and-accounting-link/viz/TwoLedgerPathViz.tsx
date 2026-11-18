import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture (3·4·7절) — 같은 이익 10이 미국 개인 장부와 영국 법인 장부에서 서로 다른 첫 계산을 거칩니다.
 * 미국: Section 1256 범위 확인 → 연말 공정가치 손익 10 → 일반적으로 60%=6 장기, 40%=4 단기.
 * 영국: 법인 계정의 회계이익 10 → 파생계약 범위·세법 조정 대조 → "10±조정". 조정 크기는 본문에 없어 크기를 그리지 않습니다.
 * 두 줄 모두 세액·세율을 정한 계산이 아닙니다.
 */
const US_STEPS = ["계약이 Section 1256 범위인지 확인", "연말에 열린 계약도 공정가치로 처분한 것처럼 평가", "순손익 10을 장기 6 · 단기 4로 나눔", "헤지 주장이면 식별 시각·예외 조건을 별도 파일에 연결"] as const;
const UK_STEPS = ["법인의 회계 장부에서 파생계약 수익·비용 찾기", "회계상 차변·대변(회계이익 10)을 출발점으로 둠", "세법의 파생계약 범위와 조정 규칙을 대조", "신고 숫자를 회계 파일·계약 식별자로 되짚을 수 있게 보관"] as const;

const SCENES = [
  { label: "같은 이익 10", summary: "미국 개인 10 · 영국 법인 10", note: "미국 개인이 적격 계약에서 이익 10을 냈고, 영국 법인도 파생계약 회계이익 10을 기록했다고 놓습니다(가정). 출발 숫자는 같지만 아직 어느 장부에도 들어가지 않았습니다." },
  { label: "첫 장부가 다릅니다", summary: "연말 평가 ↔ 회계 차변·대변", note: "미국은 계약이 정해진 법적 범위(Section 1256)에 드는지 보고 연말 미결제분을 공정가치, 즉 그 시점 시장에서 거래될 가격으로 처분한 것처럼 잡습니다. 영국 법인은 회계 장부에 이미 잡힌 차변·대변에서 시작합니다." },
  { label: "미국 10은 6과 4로", summary: "60% = 6 장기 · 40% = 4 단기", note: "미국 사례는 일반적으로 순손익의 60%를 장기, 40%를 단기 자본손익으로 나눕니다. 영국 법인의 10은 이렇게 나누지 않고 세법상 범위와 조정을 대조합니다. 조정의 방향과 크기는 본문에 없어 점선 칸으로만 둡니다." },
  { label: "신고 근거까지", summary: "6+4 또는 10±조정 · 세액 아님", note: "두 장부 모두 납세자·계약·목적·관할·시점이 적힌 근거표를 보관합니다. 어느 줄의 끝도 실제 세액이나 세율을 정한 값이 아닙니다." },
] as const;

/** 장면마다 몇 단계까지 왔는지, 그중 몇 번째부터 지금 강조하는지 */
const REACHED = [0, 2, 3, 4] as readonly number[];
const CURRENT_FROM = [0, 0, 2, 3] as readonly number[];

function Lane({ title, who, steps, index, tone }: { title: string; who: string; steps: readonly string[]; index: number; tone: string }) {
  return (
    <div className="min-w-0 rounded-lg border border-border p-3">
      <p className="text-sm font-bold" style={{ color: tone }}>{title}</p>
      <p className="text-xs text-muted-foreground">{who}</p>
      <ol className="mt-2 space-y-1.5">
        {steps.map((step, stepIndex) => {
          const reached = stepIndex < REACHED[index];
          const current = reached && stepIndex >= CURRENT_FROM[index];
          return (
            <li
              key={step}
              className={`flex gap-2 rounded-md border px-2 py-1.5 text-xs leading-5 ${current ? "font-semibold" : reached ? "" : "text-muted-foreground/60"}`}
              style={{ borderColor: current ? tone : "transparent" }}
            >
              <span className="font-mono" style={{ color: reached ? tone : undefined }}>{stepIndex + 1}</span>
              <span>{step}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function TwoLedgerPathViz() {
  return (
    <SceneShell
      eyebrow="두 장부의 길"
      title="같은 이익 10이 미국과 영국에서 다른 칸으로 들어갑니다"
      description="왼쪽은 미국 개인, 오른쪽은 영국 법인입니다. Section 1256은 연말 평가와 60·40 분류를 적용하는 미국 세법상 계약 범위이고, 차변·대변은 회계 장부의 양쪽 기록입니다. 이익 10은 설명용 값입니다(가정)."
      ariaLabel="이익 10이 미국 개인의 연말 평가와 60 대 40 분류, 영국 법인의 회계 손익 연결로 갈라지는 과정"
      scenes={SCENES}
      render={(index) => {
        const split = index >= 2;
        return (
          <div className="min-w-0 space-y-4">
            <div className="grid min-w-0 gap-3 sm:grid-cols-2">
              <Lane title="미국 개인" who="적격 계약 순이익 10(가정)" steps={US_STEPS} index={index} tone="#2563eb" />
              <Lane title="영국 법인" who="파생계약 회계이익 10(가정)" steps={UK_STEPS} index={index} tone="#b45309" />
            </div>
            <div className="grid min-w-0 gap-3 border-t border-border pt-3 sm:grid-cols-2">
              <div className="min-w-0">
                <p className="mb-1 text-xs text-muted-foreground">미국 장부의 10</p>
                <div className="flex h-8 w-full overflow-hidden rounded-md border border-border text-xs font-semibold">
                  {split ? (
                    <>
                      <span className="flex items-center justify-center bg-[#2563eb] text-white" style={{ width: "60%" }}>장기 6</span>
                      <span className="flex items-center justify-center bg-[#93c5fd] text-[#1e3a8a]" style={{ width: "40%" }}>단기 4</span>
                    </>
                  ) : (
                    <span className="flex w-full items-center justify-center bg-muted/50">10 (성격 미정)</span>
                  )}
                </div>
              </div>
              <div className="min-w-0">
                <p className="mb-1 text-xs text-muted-foreground">영국 장부의 10</p>
                <div className="flex h-8 w-full gap-1 text-xs font-semibold">
                  <span className="flex flex-1 items-center justify-center rounded-md border border-border bg-[#fde68a] text-[#78350f]">회계이익 10</span>
                  {split ? <span className="flex flex-1 items-center justify-center rounded-md border border-dashed border-[#b45309] text-[#b45309]">± 세법 조정(크기 미정)</span> : null}
                </div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
