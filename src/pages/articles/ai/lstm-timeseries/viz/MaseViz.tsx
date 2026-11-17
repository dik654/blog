import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications MASE ExplainedFormula.
 * 분모 = train 구간에서 m step 전 값을 그대로 쓴 naive의 평균 absolute error, 분자 = test MAE.
 * 숫자는 모두 설명용 가정: m=1, train T=7 [10,12,11,14,12,15,14] → 차이 2,1,3,2,3,1 = 12, ÷6 = 2.
 * test 3개: 실제 [15,17,16], 예측 [16,15,16] → 오차 1,2,0, 평균 1. MASE = 1 ÷ 2 = 0.5.
 */
const TRAIN = [10, 12, 11, 14, 12, 15, 14] as const;
const TEST_ACTUAL = [15, 17, 16] as const;
const TEST_PRED = [16, 15, 16] as const;
const TRAIN_ARR: readonly number[] = TRAIN;
const NAIVE_ERR = TRAIN_ARR.slice(1).map((value, i) => Math.abs(value - TRAIN_ARR[i]));
const DENOM = NAIVE_ERR.reduce<number>((sum, value) => sum + value, 0) / NAIVE_ERR.length;
const ACTUAL_ARR: readonly number[] = TEST_ACTUAL;
const PRED_ARR: readonly number[] = TEST_PRED;
const TEST_ERR = ACTUAL_ARR.map((value, i) => Math.abs(value - PRED_ARR[i]));
const NUMER = TEST_ERR.reduce<number>((sum, value) => sum + value, 0) / TEST_ERR.length;

const SCENES = [
  { label: "Naive 예측 (m=1)", summary: "한 step 전 값을 그대로 예측", note: "m=1이면 naive는 바로 앞 step의 값을 그대로 다음 값으로 씁니다. 점선이 그 예측, 빨간 세로선이 실제와의 absolute error입니다." },
  { label: "분모: train naive 오차", summary: `(${NAIVE_ERR.join("+")}) ÷ ${NAIVE_ERR.length} = ${DENOM}`, note: "Train 7개 관측에서 앞 값이 있는 6개 지점의 오차를 평균합니다(T−m = 7−1 = 6). 분모는 test가 아니라 이 train 구간에서만 계산합니다." },
  { label: "분자: test MAE", summary: `(${TEST_ERR.join("+")}) ÷ ${TEST_ERR.length} = ${NUMER}`, note: "Test 구간에서는 평가할 model의 예측(파란 빈 원)과 실제값의 absolute error를 평균합니다. 이 값에는 아직 원 단위가 남아 있습니다." },
  { label: "MASE", summary: `${NUMER} ÷ ${DENOM} = ${NUMER / DENOM}`, note: "같은 단위끼리 나누므로 단위가 사라집니다. 0.5는 1보다 작으므로 이 예에서 model의 test 평균 absolute error가 선택한 naive(m=1)의 train 오차 scale보다 작다는 뜻입니다." },
] as const;

const W = 360;
const H = 196;
const X0 = 34;
const DX = 32;
const px = (i: number) => X0 + i * DX;
const py = (value: number) => 172 - (value - 9) * 14;

export default function MaseViz() {
  return (
    <SceneShell
      eyebrow="MASE 계산 순서"
      title="Test 오차를 train에서 naive가 낸 오차로 나눕니다"
      description="점 하나가 한 step의 관측값입니다. 왼쪽 7개가 train, 오른쪽 3개가 test이며, 값과 예측은 모두 설명용 가정입니다."
      ariaLabel="seasonal-naive 분모와 test MAE 분자로 MASE를 계산하는 순서"
      scenes={SCENES}
      render={(active) => {
        const showTest = active >= 2;
        const strongTrain = active === 1 || active === 3;
        const top = active === 1 ? `분모 ${SCENES[1].summary}` : active === 2 ? `분자 ${SCENES[2].summary}` : active === 3 ? `MASE ${SCENES[3].summary} < 1` : "naive = 바로 앞 값";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{top}</text>
            <line x1={px(6.5)} x2={px(6.5)} y1={26} y2={182} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={px(3)} y={192} textAnchor="middle" fontSize={11} fill="#64748b">train (T=7)</text>
            <text x={px(8)} y={192} textAnchor="middle" fontSize={11} fill="#64748b">test (N=3)</text>
            <polyline points={TRAIN_ARR.map((v, i) => `${px(i)},${py(v)}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {TRAIN_ARR.slice(1).map((value, i) => {
              const prev = TRAIN_ARR[i];
              const x = px(i + 1);
              return (
                <g key={`n-${i}`} opacity={active === 2 ? 0.35 : 1}>
                  <line x1={px(i)} x2={x} y1={py(prev)} y2={py(prev)} stroke="#64748b" strokeWidth={1} strokeDasharray="2 2" />
                  <line x1={x} x2={x} y1={py(prev)} y2={py(value)} stroke="#dc2626" strokeWidth={1.25} />
                  <text x={x + 5} y={(py(prev) + py(value)) / 2 + 3} fontSize={11} fontWeight={strongTrain ? 700 : 400} fill="#dc2626">{NAIVE_ERR[i]}</text>
                </g>
              );
            })}
            {TRAIN_ARR.map((value, i) => (
              <circle key={`t-${i}`} cx={px(i)} cy={py(value)} r={3} fill="#334155" />
            ))}
            {ACTUAL_ARR.map((value, i) => {
              const x = px(7 + i);
              const pred = PRED_ARR[i];
              return (
                <g key={`s-${i}`} opacity={showTest ? 1 : 0.25}>
                  <circle cx={x} cy={py(value)} r={3} fill="#334155" />
                  {showTest && (
                    <>
                      <circle cx={x} cy={py(pred)} r={3.5} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                      {TEST_ERR[i] > 0 && <line x1={x} x2={x} y1={py(pred)} y2={py(value)} stroke="#2563eb" strokeWidth={1.25} />}
                      <text x={x + 6} y={(py(pred) + py(value)) / 2 + 3} fontSize={11} fontWeight={active === 2 || active === 3 ? 700 : 400} fill="#2563eb">{TEST_ERR[i]}</text>
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
