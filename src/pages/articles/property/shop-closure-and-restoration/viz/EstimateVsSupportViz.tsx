import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 견적 600만 원에서 영상의 최대 지원금 600만 원을 바로 빼지 않는다.
 * 칸 하나 = 100만 원. 견적 6칸, 영상 최대 6칸, 33㎡ 상한 2칸(33 ÷ 3.3 × 20만 = 200만).
 */
const SCENES = [
  { label: "잘못된 뺄셈", summary: "600만 − 600만 = 0?", note: "견적도 600만 원이고 영상의 최대 지원금도 600만 원이라 비용이 사라진 것처럼 보입니다. 하지만 영상의 최대 지원금을 견적에서 바로 빼지 않습니다." },
  { label: "33㎡의 상한", summary: "6칸 중 최대 2칸", note: "이 사례의 상한은 면적 한도 200만 원입니다. 공고는 전자세금계산서의 공급가액만 인정해 부가세도 빠집니다." },
  { label: "심사 전", summary: "확정된 칸은 아직 0칸", note: "2칸도 신청 시점 공고의 대상 공사·폐업일·1회 한정 여부와 심사 결과를 확인한 뒤에 정해집니다. 확정 전에는 돌려받을 돈에 넣지 않습니다." },
  { label: "날짜도 따로", summary: "입금일 2개", note: "지원금 지급일은 보증금 반환일과 따로 적습니다. 위 계산은 2026년 1월 공고를 읽는 예이며 현재 신청 결과가 아닙니다." },
] as const;

type Kind = "cost" | "wrong" | "cap" | "empty";

const CELL: Record<Kind, string> = {
  cost: "border-muted-foreground/60 bg-muted-foreground/30",
  wrong: "border-dashed border-red-600 text-red-700 dark:text-red-400",
  cap: "border-dashed border-primary bg-primary/10 text-primary",
  empty: "border-dashed border-border/40",
};

function Row({ label, cells, unsure = false }: { label: string; cells: readonly Kind[]; unsure?: boolean }) {
  return (
    <div className="grid grid-cols-[5.75rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground sm:text-sm">{label}</span>
      <span className="grid grid-cols-6 gap-1">
        {cells.map((kind, index) => (
          <span key={index} className={`flex h-9 items-center justify-center rounded border text-[11px] font-semibold ${CELL[kind]}`}>{kind === "wrong" ? "✕" : kind === "cap" && unsure ? "?" : ""}</span>
        ))}
      </span>
    </div>
  );
}

const fill = (count: number, kind: Kind): Kind[] => Array.from({ length: 6 }, (_, index) => (index < count ? kind : "empty"));

export default function EstimateVsSupportViz() {
  return (
    <SceneShell
      eyebrow="견적과 지원금"
      title="600만 원에서 600만 원을 빼면 안 되는 이유"
      description="칸 하나가 100만 원입니다. 위 줄은 철거 견적, 아래 줄은 그 견적을 덮을 수 있다고 착각하기 쉬운 지원금입니다."
      note="견적, 면적과 폐업일은 (가정)이고 상한은 2026-01-19 공고를 2026-10-09에 확인한 기준입니다."
      ariaLabel="철거 견적 6칸과 영상 최대 지원금 6칸, 33제곱미터 상한 2칸 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="mx-auto w-full max-w-[520px] space-y-2">
          <Row label="철거 견적 600만" cells={fill(6, "cost")} />
          <Row label="영상 최대 600만" cells={fill(6, active === 0 ? "wrong" : "empty")} />
          <Row label="33㎡ 상한 200만" cells={fill(active === 0 ? 0 : 2, "cap")} unsure={active >= 2} />
          <div className="grid grid-cols-[5.75rem_minmax(0,1fr)] gap-2 pt-2 text-xs sm:text-sm">
            <span className="font-semibold text-muted-foreground">날짜</span>
            <span className={`flex flex-wrap gap-x-4 gap-y-1 ${active === 3 ? "font-bold text-primary" : "text-muted-foreground/60"}`}>
              <span>보증금 반환일 ___</span>
              <span>지원금 지급일 ___</span>
            </span>
          </div>
        </div>
      )}
    />
  );
}
