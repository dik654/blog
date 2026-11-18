import SceneShell from "./SceneShell";
import ModChart, { type ChartDot } from "./ModChart";
import { MASKED, TS, V, Z } from "./starkPoints";

/**
 * 본문 대응: #source — v(T)+Z(T)r(T)에서 Z(T)=T(T−1)(T−2)는 행 0·1·2에서 0이므로 원래 세 값은 그대로 남고,
 * 바깥 평가 위치의 값만 바뀐다. r=1 예: T=3에서 13+6=19≡2.
 * T=4…7의 값(Z: 7,9,1,6 / 가린 값: 5,8,0,4)은 같은 식의 산술이며 평가점 범위는 가정입니다.
 */
const GRAY = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";

const SCENES = [
  { label: "원래 행에서 0인 Z(T)", summary: "Z = 0, 0, 0, 6, 7, 9, 1, 6", note: "Z(T)=T(T−1)(T−2)는 T가 0, 1, 2일 때 곱 안에 0이 하나씩 있어 0입니다. 바깥 위치에서는 0이 아닌 값을 줍니다." },
  { label: "가리기 전 v(T)", summary: "T=3에서 13", note: "8절의 같은 평가표입니다. 표를 그대로 열면 원래 행의 1·6·10과 바깥 값들이 보입니다." },
  { label: "v + Z·r, r = 1", summary: "0·1·2행 보존 · T=3: 13 → 2", note: "Z가 0인 세 행에서는 더해지는 값이 없어 1, 6, 10이 그대로입니다. 바깥 위치는 Z만큼 움직여 T=3의 13이 19≡2가 됩니다. r=1인 이 한 번의 가리기가 전체 영지식을 보장하지는 않습니다(아래 문단)." },
] as const;

export default function MaskingViz() {
  return (
    <SceneShell
      eyebrow="표 가리기"
      title="원래 세 행은 두고 바깥 값만 바꿉니다"
      description="점 하나가 한 평가 위치의 값이고 세로축은 17로 나눈 나머지입니다. 회색 띠는 원래 실행 행 0·1·2입니다. Z(T)=T(T−1)(T−2)는 이 세 행에서 0이 되는 다항식이고, r은 무작위로 고르는 다항식입니다(여기서는 r=1 예). 평가점 T=0~7은 가정입니다."
      ariaLabel="Z(T)를 곱해 더한 가리기가 원래 세 행은 보존하고 바깥 값만 바꾸는 모습"
      scenes={SCENES}
      render={(active) => {
        const dots = TS.flatMap<ChartDot>((t) => {
          if (active === 0) return [{ t, y: Z[t], fill: GRAY, label: `${Z[t]}` }];
          if (active === 1) return [{ t, y: V[t], fill: BLUE, label: `${V[t]}` }];
          if (t < 3) return [{ t, y: MASKED[t], fill: AMBER, label: `${MASKED[t]}`, labelColor: AMBER }];
          return [
            { t, y: V[t], fill: BLUE, hollow: true, dashed: true },
            { t, y: MASKED[t], fill: AMBER, label: `${MASKED[t]}`, labelColor: AMBER },
          ];
        });
        return (
          <div className="min-w-0">
            <ModChart dots={dots} shadeRows={[0, 1, 2]} ariaLabel={`${SCENES[active].label}: ${SCENES[active].summary}`} />
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className={active === 0 ? "font-semibold text-foreground" : ""}><span style={{ color: GRAY }}>●</span> 회색: Z(T)</span>
              <span className={active === 1 ? "font-semibold text-foreground" : ""}><span style={{ color: BLUE }}>●</span> 파랑: v(T), 점선은 가리기 전</span>
              <span className={active === 2 ? "font-semibold text-foreground" : ""}><span style={{ color: AMBER }}>●</span> 주황: v(T)+Z(T)</span>
            </div>
          </div>
        );
      }}
    />
  );
}
