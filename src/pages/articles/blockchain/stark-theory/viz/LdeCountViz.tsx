import SceneShell from "./SceneShell";
import ModChart, { type ChartDot } from "./ModChart";
import { TS, V } from "./starkPoints";

/**
 * 본문 대응: #lde-fri — 세 점만 보간하면 어떤 세 값에도 차수 2 이하 다항식이 있지만,
 * 같은 함수를 8점에서 평가하면 허용된 표가 임의의 8칸 표보다 훨씬 적어진다.
 * 17로 나눈 나머지에서: 3칸 표 17³=4,913가지 = 차수 2 이하 함수 17³개.
 * 8칸 표 17⁸=6,975,757,441가지 중 차수 2 이하 함수의 표는 17³개 → 17⁵=1,419,857분의 1.
 * 마지막 장면의 T=5 값 3은 바꾼 칸을 보이려는 가정입니다.
 */
const BLUE = "#2563eb";
const GRAY = "#64748b";
const RED = "#dc2626";
const CHANGED_T = 5;
const CHANGED_VALUE = 3;

const SCENES = [
  { label: "세 점만 있을 때", summary: "3칸 표 4,913가지 = 함수 4,913개", note: "세 행(1,6,10)만 보면 차수 2 이하 다항식이 언제나 하나 지나갑니다. 17로 나눈 나머지에서 세 칸 표도 17³가지, 차수 2 이하 함수도 17³개라 어떤 세 값이든 맞는 함수가 있습니다. 세 점만으로는 '낮은 차수'가 아무것도 걸러 내지 않습니다." },
  { label: "같은 함수를 8점에서", summary: "T=3 → 115 ≡ 13", note: "기존 세 값을 복사해 길이를 늘리는 것이 아니라, 같은 v(T)=8T²+14T+1을 새 위치에서 다시 계산합니다. T=3에서는 115를 17로 나눈 나머지 13입니다." },
  { label: "허용된 표가 줄어듭니다", summary: "17⁸ 중 17³ → 1,419,857분의 1", note: "8칸 표는 17⁸가지지만 차수 2 이하 함수가 만드는 표는 여전히 17³개입니다. 임의로 적은 8칸 표가 그런 표일 비율은 17⁵분의 1입니다." },
  { label: "한 칸만 바꾸면", summary: "T=5: 16 → 3 (가정)", note: "행 0·1·2가 이미 차수 2 이하 함수를 하나로 정하고, 그 함수는 T=5에서 16을 줍니다. 그래서 T=5만 3으로 바꾼 표는 어떤 차수 2 이하 함수의 표도 아닙니다. 다만 FRI는 표가 이런 함수와 똑같은지가 아니라 가까운지를 검사하고, 공개 출력 10과의 연결은 따로 확인합니다." },
] as const;

const COUNTS = [
  { left: "세 칸 표", leftValue: "17³ = 4,913", right: "차수 2 이하 함수", rightValue: "17³ = 4,913", ratio: "모든 표가 어떤 함수의 표" },
  { left: "평가 위치", leftValue: "3 → 8", right: "함수", rightValue: "같은 v(T)", ratio: "새 5칸은 계산으로 정해짐" },
  { left: "여덟 칸 표", leftValue: "17⁸ = 6,975,757,441", right: "차수 2 이하 함수의 표", rightValue: "17³ = 4,913", ratio: "17⁵ = 1,419,857분의 1" },
  { left: "바꾼 표", leftValue: "T=5만 3", right: "맞는 차수 2 이하 함수", rightValue: "없음", ratio: "행 0·1·2가 정한 함수는 T=5에서 16" },
] as const;

export default function LdeCountViz() {
  return (
    <SceneShell
      eyebrow="더 넓은 평가표"
      title="같은 함수를 여덟 점에서 계산하면 허용된 표가 줄어듭니다"
      description="점 하나가 한 평가 위치의 값이고 세로축은 17로 나눈 나머지입니다. 회색 띠와 회색 점은 원래 실행 행 0·1·2, 파랑 점은 같은 v(T)를 새 위치에서 계산한 값, 빨강 점은 바꾼 칸입니다. 평가점 T=0~7은 글의 '8개 점'을 그리려는 가정입니다."
      ariaLabel="상태 다항식을 세 점과 여덟 점에서 계산했을 때 허용되는 표의 수 비교"
      scenes={SCENES}
      render={(active) => {
        const visible = active === 0 ? TS.slice(0, 3) : TS;
        const dots = visible.flatMap<ChartDot>((t) => {
          const original = t < 3;
          if (active === 3 && t === CHANGED_T) {
            return [
              { t, y: V[t], fill: BLUE, hollow: true, dashed: true, label: `${V[t]}`, labelColor: BLUE },
              { t, y: CHANGED_VALUE, fill: RED, label: `${CHANGED_VALUE}` },
            ];
          }
          return [{ t, y: V[t], fill: original ? GRAY : BLUE, label: original || t === 3 || active >= 2 ? `${V[t]}` : undefined }];
        });
        const count = COUNTS[active];
        return (
          <div className="min-w-0">
            <ModChart dots={dots} shadeRows={[0, 1, 2]} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-xs text-muted-foreground">{count.left}</span>
                <span className="block break-all font-mono font-semibold">{count.leftValue}</span>
              </div>
              <div className="rounded-lg border border-border px-3 py-2">
                <span className="block text-xs text-muted-foreground">{count.right}</span>
                <span className="block font-mono font-semibold">{count.rightValue}</span>
              </div>
              <div className="col-span-2 rounded-lg border border-primary/40 px-3 py-2 sm:col-span-1">
                <span className="block text-xs text-muted-foreground">결과</span>
                <span className="block font-semibold text-primary">{count.ratio}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
