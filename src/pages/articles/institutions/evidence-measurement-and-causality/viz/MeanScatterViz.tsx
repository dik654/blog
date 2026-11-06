import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 평균 8·9만으로는 개별 값이 어떻게 흩어졌는지 모르므로 불확실성을 계산할 수 없다.
 * 점 10개의 위치는 본문에 없어 모양만 그렸다. 각 줄의 점은 평균 8·9에 대칭으로 놓아 실제 평균이 맞는다.
 */
const SCENES = [
  { label: "지금 가진 것", summary: "평균 8과 9, 간격 1", note: "본문의 사례가 주는 것은 설치 후 평균입니다. 출발이 둘 다 10이라 이 간격이 곧 변화의 차이 1입니다. 각 집의 값은 없습니다." },
  { label: "좁게 모인 경우", summary: "두 무리가 떨어져 있음", note: "점 하나가 한 집입니다. 각 줄 10가구가 평균 근처에 모여 있으면 두 무리가 잘 갈라집니다. 점의 위치는 모양만 보여 주는 것입니다." },
  { label: "넓게 퍼진 경우", summary: "평균은 같고 무리가 겹침", note: "평균은 똑같이 8과 9인데 집마다 값이 넓게 퍼져 두 무리가 겹칩니다. 같은 간격 1이어도 우연으로 설명하기 쉬워집니다." },
  { label: "실제 사례의 상태", summary: "어느 쪽인지 알 수 없음", note: "개별 관측값과 변동성, 표본의 의존 구조가 없어 위 두 경우 중 어디에 가까운지 모릅니다. 그래서 불확실성을 계산할 수 없고, 평균이 다르다는 것만으로 우연을 배제하지 않습니다." },
] as const;

const W = 340;
const H = 204;
const AXIS_Y = 164;
const ROW = { A: 62, B: 118 } as const;
const x = (value: number) => 20 + ((value - 6.5) / 4) * 300;

const NARROW = [0.06, 0.14, 0.22, 0.3, 0.38];
const WIDE = [0.2, 0.5, 0.8, 1.1, 1.4];
const A_COLOR = "#2563eb";
const B_COLOR = "#64748b";
const GAP = "#d97706";

function Dots({ mean, spread, y, color }: { mean: number; spread: readonly number[]; y: number; color: string }) {
  return (
    <g>
      {spread.flatMap((offset, index) => [-offset, offset].map((signed) => (
        <circle key={signed} cx={x(mean + signed)} cy={y + (index % 2 === 0 ? -5 : 5)} r={3.5} fill={color} fillOpacity={0.75} />
      )))}
    </g>
  );
}

function Unknown({ y, color }: { y: number; color: string }) {
  return (
    <g>
      <rect x={x(6.6)} y={y - 12} width={x(10.4) - x(6.6)} height={24} rx={6} fill="none" stroke={color} strokeWidth={1} strokeDasharray="4 3" />
      <text x={x(9.75)} y={y + 5} textAnchor="middle" fontSize={15} fontWeight={600} fill={color}>값 없음</text>
    </g>
  );
}

export default function MeanScatterViz() {
  return (
    <SceneShell
      eyebrow="평균 뒤의 집들"
      title="같은 평균 8과 9 뒤에 전혀 다른 집들이 있을 수 있습니다"
      description="가로는 설치 후 가구당 하루 평균 사용량(kWh)입니다. 8과 9는 본문의 (가정) 값이고, 칸 안의 점 위치는 본문에 없어 모양만 그렸습니다."
      note="두 경우 모두 각 줄의 점 10개를 평균에 대칭으로 놓아 실제 평균이 8과 9가 되게 했습니다."
      ariaLabel="같은 평균을 가진 두 집단에서 개별 값의 흩어짐이 다른 경우를 비교하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={x(8)} x2={x(9)} y1={16} y2={16} stroke={GAP} strokeWidth={1.25} />
          <text x={x(8.5)} y={11} textAnchor="middle" fontSize={15} fontWeight={700} fill={GAP}>간격 1</text>
          <line x1={x(8)} x2={x(8)} y1={16} y2={AXIS_Y} stroke={A_COLOR} strokeWidth={1} strokeDasharray="3 3" />
          <line x1={x(9)} x2={x(9)} y1={16} y2={AXIS_Y} stroke={B_COLOR} strokeWidth={1} strokeDasharray="3 3" />
          <line x1={10} x2={W - 10} y1={AXIS_Y} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} />
          <text x={x(8)} y={AXIS_Y + 20} textAnchor="middle" fontSize={15} fontWeight={700} fill={A_COLOR}>A 평균 8</text>
          <text x={x(9)} y={AXIS_Y + 20} textAnchor="middle" fontSize={15} fontWeight={700} fill={B_COLOR}>B 평균 9</text>
          <text x={10} y={ROW.A - 16} fontSize={15} fontWeight={700} fill={A_COLOR}>A</text>
          <text x={10} y={ROW.B - 16} fontSize={15} fontWeight={700} fill={B_COLOR}>B</text>
          {active === 1 && <Dots mean={8} spread={NARROW} y={ROW.A} color={A_COLOR} />}
          {active === 1 && <Dots mean={9} spread={NARROW} y={ROW.B} color={B_COLOR} />}
          {active === 2 && <Dots mean={8} spread={WIDE} y={ROW.A} color={A_COLOR} />}
          {active === 2 && <Dots mean={9} spread={WIDE} y={ROW.B} color={B_COLOR} />}
          {active === 3 && <Unknown y={ROW.A} color={A_COLOR} />}
          {active === 3 && <Unknown y={ROW.B} color={B_COLOR} />}
        </svg>
      )}
    />
  );
}
