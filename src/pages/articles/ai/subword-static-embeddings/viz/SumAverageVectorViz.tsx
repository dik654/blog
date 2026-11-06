import SceneShell from "./SceneShell";

/**
 * 본문 대응: #static-contextual — 합 (16, 3)과 평균 (4, 0.75)은 양의 4배 관계.
 * 코사인은 같고(16/√265 = 4/√16.5625 ≈ 0.983), (1, 0)과의 내적은 16과 4,
 * 평균의 길이는 √16.5625 ≈ 4.07이다. 임계값 10은 설명용 가정이다. 두 축의 눈금은 같다.
 */
const UNIT = 18;
const OX = 24;
const OY = 118;
const px = (x: number) => OX + UNIT * x;
const py = (y: number) => OY - UNIT * y;
const AVG_LENGTH = Math.hypot(4, 0.75);
const UNIT_X = 4 / AVG_LENGTH;
const UNIT_Y = 0.75 / AVG_LENGTH;
const ANGLE = Math.atan2(3, 16);
const ARC_R = 190;

function Arrow({ x, y, color }: { x: number; y: number; color: string }) {
  const endX = px(x);
  const endY = py(y);
  const angle = Math.atan2(endY - OY, endX - OX);
  const size = 7;
  const point = (turn: number) => `${endX - size * Math.cos(angle + turn)},${endY - size * Math.sin(angle + turn)}`;
  return (
    <g>
      <line x1={OX} y1={OY} x2={endX} y2={endY} stroke={color} strokeWidth={1.25} />
      <polygon points={`${endX},${endY} ${point(0.45)} ${point(-0.45)}`} fill={color} />
    </g>
  );
}

const SCENES = [
  { label: "방향은 같고 길이만 다름", summary: "(16, 3) = 4 × (4, 0.75)", note: "합과 평균은 같은 선 위에 있고 길이만 4배 다릅니다. 나눈 수 4가 그대로 길이 차이가 됩니다." },
  { label: "코사인 유사도", summary: "둘 다 ≈ 0.983", note: "코사인 유사도는 두 벡터의 길이로 나누어 방향만 비교하는 값입니다. 0이 아닌 두 벡터라면 배율이 상쇄되어, 출력 벡터 (1, 0)과 재도 합과 평균의 값이 같습니다." },
  { label: "내적 점수", summary: "16과 4", note: "내적은 같은 자리끼리 곱해 더한 값입니다. (1, 0)과의 내적은 첫 좌표를 그대로 읽는 셈이어서 합은 16, 평균은 4입니다. 길이로 나누지 않으므로 배율이 남습니다." },
  { label: "임계값을 쓰면", summary: "10(가정) 기준: 넘음 / 못 넘음", note: "내적 점수에 임계값을 두는 후속 작업은 합과 평균에서 판정이 갈릴 수 있습니다. 10은 차이를 보이려고 정한 가정입니다." },
  { label: "평균은 정규화가 아님", summary: "길이 √16.5625 ≈ 4.07", note: "평균을 냈다고 길이가 1이 되지는 않습니다. 빨간 화살표는 평균을 자기 길이 4.07로 나누어 길이를 1로 만든 벡터입니다. 이렇게 더 나눌지는 별도의 배포 규칙입니다." },
] as const;

export default function SumAverageVectorViz() {
  return (
    <SceneShell
      eyebrow="합과 평균"
      title="같은 방향의 두 화살표가 점수에서는 갈립니다"
      description="가로·세로 눈금이 같은 평면에 run의 합 (16, 3)과 평균 (4, 0.75)을 그렸습니다. (1, 0)은 점수를 매길 때 상대가 되는 출력 벡터입니다. 값은 모두 글의 가정 표에서 나옵니다."
      ariaLabel="합과 평균 벡터의 방향, 코사인, 내적, 임계값, 길이 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={OX} x2={350} y1={OY} y2={OY} stroke="#94a3b8" strokeWidth={1} />
          <line x1={OX} x2={OX} y1={OY + 6} y2={20} stroke="#94a3b8" strokeWidth={1} />
          <Arrow x={16} y={3} color="#2563eb" />
          <Arrow x={4} y={0.75} color="#d97706" />
          <text x={px(16) - 2} y={py(3) - 10} textAnchor="end" fontSize={14} fontWeight={700} fill="#2563eb">합 (16, 3)</text>
          <text x={px(4) - 36} y={py(0.75) - 16} fontSize={14} fontWeight={700} fill="#d97706">평균 (4, 0.75)</text>
          {active === 1 && (
            <>
              <Arrow x={1} y={0} color="#16a34a" />
              <path d={`M ${OX + ARC_R} ${OY} A ${ARC_R} ${ARC_R} 0 0 0 ${OX + ARC_R * Math.cos(ANGLE)} ${OY - ARC_R * Math.sin(ANGLE)}`} fill="none" stroke="#16a34a" strokeWidth={1.25} />
              <text x={OX} y={OY + 20} fontSize={14} fontWeight={700} fill="#16a34a">출력 (1, 0)</text>
              <text x={OX + ARC_R + 6} y={OY - 6} fontSize={14} fontWeight={700} fill="#16a34a">같은 각도</text>
            </>
          )}
          {active === 2 && (
            <>
              <line x1={px(16)} x2={px(16)} y1={py(3)} y2={OY} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={px(4)} x2={px(4)} y1={py(0.75)} y2={OY} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
              <text x={px(16)} y={OY + 20} textAnchor="middle" fontSize={15} fontWeight={700} fill="#2563eb">16</text>
              <text x={px(4)} y={OY + 20} textAnchor="middle" fontSize={15} fontWeight={700} fill="#d97706">4</text>
            </>
          )}
          {active === 3 && (
            <>
              <line x1={px(10)} x2={px(10)} y1={22} y2={OY} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
              <text x={px(10)} y={OY + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill="#dc2626">임계값 10 (가정)</text>
              <text x={px(16)} y={OY + 20} textAnchor="middle" fontSize={13} fill="#2563eb">16: 넘음</text>
              <text x={px(4)} y={OY + 20} textAnchor="middle" fontSize={13} fill="#d97706">4: 못 넘음</text>
            </>
          )}
          {active === 4 && (
            <>
              <Arrow x={UNIT_X} y={UNIT_Y} color="#dc2626" />
              <text x={OX} y={OY + 20} fontSize={13} fontWeight={700} fill="#dc2626">길이를 1로 만든 벡터</text>
              <text x={px(9.6)} y={OY + 20} fontSize={13} fill="#d97706">평균의 길이 ≈ 4.07</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
