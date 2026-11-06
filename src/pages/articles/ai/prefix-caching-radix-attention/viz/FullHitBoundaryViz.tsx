import SceneShell from "./SceneShell";
import { TokenRow, type CellTone } from "./TokenCell";

/**
 * 본문 대응: #full-hit-boundary — 8자리 전체가 저장돼도 상한은 8−1=7.
 * page 크기 1이면 7 재사용·1 계산, B=4면 7을 full block 4로 내려 4 재사용·4 계산.
 */
const R1 = [1, 2, 3, 4, 5, 6, 7, 8] as const;
const STORED: readonly CellTone[] = Array.from({ length: 8 }, () => "stored");
const tones = (hit: number): CellTone[] => R1.map((_, i) => (i < hit ? "hit" : "calc"));

const SCENES = [
  { label: "저장된 수와 상한", summary: "저장 8 · 상한 8 − 1 = 7", note: "저장된 것은 KV이고, 다음 출력의 점수를 새로 구해야 하는 경로라면 마지막 입력 위치를 남깁니다. 그래서 8자리가 모두 남아 있어도 재사용 상한은 7입니다(가정)." },
  { label: "page 크기 1", summary: "재사용 7 · 계산 1", note: "일반 page 크기 1 모형에서는 7을 그대로 재사용하고 마지막 1자리만 계산합니다. logprob 등의 조건은 상한을 더 줄일 수 있습니다." },
  { label: "B = 4", summary: "7 → 내림 4 · 계산 4", note: "B=4와 hash 단위 4의 경로는 7을 full block 경계인 4로 내립니다. 뒤 block 전체인 마지막 4자리를 다시 계산합니다. 이 경로에서는 한 자리 대신 block 하나 전체가 재계산됩니다." },
];

export default function FullHitBoundaryViz() {
  return (
    <SceneShell
      eyebrow="(가정) 같은 R1이 다시 올 때"
      title="전부 저장돼 있어도 재사용은 7이나 4에서 멈춥니다"
      description="윗줄은 저장된 기록, 아랫줄은 이번 요청입니다. 초록은 재사용, 주황은 다시 계산하는 자리입니다."
      ariaLabel="전체가 저장된 입력에서 마지막 위치 상한과 block 내림이 재사용 길이를 정하는 과정"
      scenes={SCENES}
      render={(index) => {
        const hit = [7, 7, 4][index];
        return (
          <div className="space-y-2">
            <TokenRow name="저장" values={R1} tones={STORED} />
            <TokenRow name="이번" values={R1} tones={index === 0 ? R1.map((_, i) => (i === 7 ? "calc" : "idle")) : tones(hit)} />
            <div className="grid grid-cols-[3.25rem_minmax(0,1fr)] gap-2">
              <span />
              {index === 2 ? (
                <div className="grid grid-cols-2 gap-1 text-center text-xs leading-5">
                  <span className="rounded-sm border border-[#64748b] font-semibold">block 1 · 재사용</span>
                  <span className="rounded-sm border border-[#64748b] font-semibold">block 2 · 재계산</span>
                </div>
              ) : (
                <div className="grid grid-cols-8 gap-1 text-center text-xs leading-5">
                  <span className="col-span-7 rounded-sm border border-border text-muted-foreground">{index === 0 ? "상한 안쪽 7자리" : "재사용 7자리"}</span>
                  <span className="rounded-sm border border-[#d97706] font-semibold">1</span>
                </div>
              )}
            </div>
            <p className="pt-2 text-center font-mono text-sm font-bold">
              {["min(8, 8−1) = 7", "⌊7 / 1⌋ × 1 = 7", "⌊7 / 4⌋ × 4 = 4"][index]}
            </p>
          </div>
        );
      }}
    />
  );
}
