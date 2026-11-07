import DieGrid from "./DieGrid";
import { SCATTER_ORDER } from "./dieOrder";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #poisson·#source — λ=0.1에서 후보 1000개의 결함 수 분포.
 * exp(−λ)λᵏ/k!: 0개 904.8, 1개 90.5, 2개 이상 4.7. 결함 합계 1000×0.1 = 100개.
 * 칸 수는 반올림(905·90·5), 칸 위치는 설명용.
 */
const ONE = 90;
const TWO_PLUS = 5;

const SCENES = [
  { label: "평균 0.1의 뜻", summary: "1000 × 0.1 = 결함 100개", note: "칸 하나가 후보 다이 하나입니다. 평균 0.1은 다이마다 결함 0.1개가 있다는 말이 아니라, 1000개 묶음 전체에 결함이 평균 100개 떨어진다는 말입니다." },
  { label: "대부분은 0개", summary: "0개: 약 904.8칸", note: "결함이 서로 무관하게 흩어진다고 가정하면 0개인 다이의 비율은 e^(−0.1) ≈ 90.48%입니다. 회색 칸이 그 다이들이고 비운 칸은 다음 장면에서 채웁니다." },
  { label: "일부에 1개 이상", summary: "1개: 약 90.5칸 · 2개 이상: 약 4.7칸", note: "주황 칸은 결함 1개, 흰 점이 있는 빨간 칸은 2개 이상입니다. 임계 면적에 하나만 들어와도 고장이라고 가정하므로 둘 다 탈락입니다." },
  { label: "왜 900이 아닌가", summary: "904.8개 > 1000 − 100 = 900개", note: "평균 0.1을 통과율 0.9로 빼면 결함 하나가 다이 하나씩을 죽인다고 세는 셈입니다. 실제로는 빨간 칸처럼 한 다이에 여러 개가 겹쳐 결함 100개가 약 95.2개의 다이만 탈락시킵니다." },
] as const;

const noMarks: ReadonlyMap<number, 0 | 1 | 2> = new Map();
const hitCells = SCATTER_ORDER.slice(0, ONE + TWO_PLUS);
const blankMarks: ReadonlyMap<number, 0 | 1 | 2> = new Map(hitCells.map((cell): [number, 0] => [cell, 0]));
const fullMarks: ReadonlyMap<number, 0 | 1 | 2> = new Map(
  hitCells.map((cell, index): [number, 1 | 2] => [cell, index < TWO_PLUS ? 2 : 1]),
);

export default function DefectCountGridViz() {
  return (
    <SceneShell
      eyebrow="평균 결함 수를 칸으로"
      title="평균 0.1개는 많은 0개와 일부의 1개 이상이 섞인 값입니다"
      description="임계 면적 1 cm², 결함 밀도 0.1개/cm²를 가정한 후보 1000개입니다. 칸 수는 기댓값을 반올림해 905·90·5칸으로 칠했고, 칸 위치는 설명용입니다(가정). 한 번의 실제 생산 결과가 아닙니다."
      ariaLabel="후보 다이 1000칸에 결함 수별로 칠한 격자"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 340 136" className="mx-auto h-auto w-full max-w-[560px]">
            <DieGrid marks={active >= 2 ? fullMarks : active === 1 ? blankMarks : noMarks} label={`${SCENES[active].label}: ${SCENES[active].summary}`} />
          </svg>
          <div className="relative mt-3 text-xs sm:text-sm">
            {active === 0 && <span className="absolute inset-x-0 top-0 text-muted-foreground">회색 칸은 아직 결함 수로 나누지 않은 후보 다이입니다.</span>}
            <div className={`flex flex-wrap gap-x-4 gap-y-1 ${active === 0 ? "invisible" : ""}`}>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#94a3b8", opacity: 0.5 }} />결함 0개</span>
            <span className="flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: "#d97706" }} />1개</span>
            <span className="flex items-center gap-1.5">
              <span className="flex h-3 w-3 items-center justify-center rounded-sm" style={{ backgroundColor: "#dc2626" }}><span className="h-1 w-1 rounded-full" style={{ backgroundColor: "#ffffff" }} /></span>2개 이상
            </span>
            </div>
          </div>
        </div>
      )}
    />
  );
}
