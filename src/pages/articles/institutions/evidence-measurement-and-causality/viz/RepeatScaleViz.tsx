import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source·#names — (가정) 같은 조건의 8.0·8.1·7.9는 평균 8.0으로 가깝지만,
 * 가까움이 실제 값·전체 불확실성·여러 날의 변동을 말해 주지는 않는다.
 */
const SCENES = [
  { label: "세 번 재기", summary: "(8.0+8.1+7.9)÷3 = 8.0", note: "(가정) 같은 대상을 같은 조건에서 세 번 재어 얻은 값입니다. 점들이 가깝게 모여 있고 평균은 8.0kWh입니다." },
  { label: "가까움과 실제 값", summary: "실제 값의 위치는 아직 모름", note: "계기가 항상 한쪽으로 치우쳐 표시해도 점은 이렇게 모일 수 있습니다. 실제 사용량이 어디인지는 기준 계기와 비교하고 절차를 확인해야 합니다. 점선 범위는 위치를 정하지 않았다는 표시입니다." },
  { label: "눈금과 불확실성", summary: "눈금 0.1 ≠ 전체 ±0.1", note: "화면이 0.1kWh 단위로 표시된다는 것은 눈금 간격입니다. 전체 불확실성에는 반복 변동뿐 아니라 교정·환경·방법의 정보도 들어가므로 눈금만으로 ±0.1kWh라고 쓰지 않습니다." },
  { label: "반복과 여러 날", summary: "다른 종류의 흩어짐", note: "위 줄은 같은 대상을 같은 조건에서 반복한 값이고 아래 줄은 여러 날의 실제 사용량입니다. 아래 줄의 값은 본문에 없어 점의 위치는 모양만 보여 줍니다. 두 흩어짐을 같은 것으로 읽지 않습니다." },
] as const;

const W = 340;
const H = 210;
const AXIS_Y = 150;
const x = (value: number) => 22 + ((value - 7.7) / 0.6) * 296;

const DOT = "#2563eb";
const MEAN = "#d97706";
const INK = "#64748b";
const DAYS = [7.72, 7.84, 8.02, 8.17, 8.28];

function RepeatDots({ y, labeled }: { y: number; labeled: boolean }) {
  return (
    <g>
      {[7.9, 8.0, 8.1].map((value) => (
        <g key={value}>
          <circle cx={x(value)} cy={y} r={5} fill={DOT} />
          {labeled && <text x={x(value)} y={y - 12} textAnchor="middle" fontSize={15} fontWeight={700} fill={DOT}>{value.toFixed(1)}</text>}
        </g>
      ))}
    </g>
  );
}

export default function RepeatScaleViz() {
  return (
    <SceneShell
      eyebrow="반복 측정"
      title="세 값이 가깝다는 말이 알려 주는 것과 알려 주지 않는 것"
      description="가로줄은 kWh 눈금입니다. 점 하나가 측정값 하나이며, 8.0·8.1·7.9는 본문의 (가정) 값입니다."
      ariaLabel="반복 측정값 세 개의 평균과 실제 값, 눈금, 여러 날 변동의 차이를 눈금 위에서 보는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={10} x2={W - 10} y1={AXIS_Y} y2={AXIS_Y} stroke={INK} strokeWidth={1} />
          {[7.9, 8.0, 8.1].map((value) => (
            <g key={value}>
              <line x1={x(value)} x2={x(value)} y1={AXIS_Y} y2={AXIS_Y + 6} stroke={INK} strokeWidth={1} />
              <text x={x(value)} y={AXIS_Y + 22} textAnchor="middle" fontSize={15} fill={INK}>{value.toFixed(1)}</text>
            </g>
          ))}
          {active !== 3 && <RepeatDots y={108} labeled={active === 0} />}
          {active === 0 && (
            <g>
              <path d={`M${x(8)} ${AXIS_Y - 4} l-6 -9 h12 z`} fill={MEAN} />
              <text x={x(8) + 12} y={AXIS_Y - 6} fontSize={15} fontWeight={700} fill={MEAN}>평균 8.0</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <rect x={10} y={20} width={W - 20} height={48} rx={8} fill="none" stroke={MEAN} strokeWidth={1} strokeDasharray="4 3" />
              <text x={W / 2} y={40} textAnchor="middle" fontSize={15} fontWeight={700} fill={MEAN}>실제 사용량은 어디?</text>
              <text x={W / 2} y={58} textAnchor="middle" fontSize={15} fill={MEAN}>기준 계기와 비교하기 전에는 모름</text>
            </g>
          )}
          {active === 2 && (
            <g>
              <line x1={x(8)} x2={x(8.1)} y1={AXIS_Y - 14} y2={AXIS_Y - 14} stroke={MEAN} strokeWidth={1.25} />
              <text x={x(8.1) + 8} y={AXIS_Y - 9} fontSize={15} fontWeight={700} fill={MEAN}>눈금 0.1</text>
              <text x={10} y={20} fontSize={15} fontWeight={700} fill={INK}>전체 불확실성에 들어가는 정보</text>
              {["반복 변동", "교정", "환경", "방법"].map((name, index) => (
                <g key={name}>
                  <rect x={10 + index * 81} y={30} width={77} height={32} rx={8} fill="none" stroke={INK} strokeWidth={1} />
                  <text x={10 + index * 81 + 38.5} y={51} textAnchor="middle" fontSize={15} fontWeight={600} fill={INK}>{name}</text>
                </g>
              ))}
            </g>
          )}
          {active === 3 && (
            <g>
              <text x={10} y={22} fontSize={15} fontWeight={700} fill={DOT}>같은 조건 반복</text>
              <RepeatDots y={42} labeled={false} />
              <text x={10} y={88} fontSize={15} fontWeight={700} fill={MEAN}>여러 날 실제 사용량 (모양만)</text>
              {DAYS.map((value) => <circle key={value} cx={x(value)} cy={110} r={5} fill="none" stroke={MEAN} strokeWidth={1.25} />)}
            </g>
          )}
        </svg>
      )}
    />
  );
}
