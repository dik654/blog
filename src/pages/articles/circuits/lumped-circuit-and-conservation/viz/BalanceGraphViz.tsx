import SceneShell from "./SceneShell";

/**
 * 본문 대응: #solve — 갈림길 전압 V를 모를 때 들어오는 전류와 나가는 전류를 같게 둔다.
 * 들어옴 (12−V)/1 kΩ. 나감 V/2 kΩ + V/2 kΩ = V mA, 오른쪽 1 kΩ이면 1.5V mA.
 * 시험값 3 V: 9, 3. 9 V: 3, 9. 6 V: 6, 6. 오른쪽 1 kΩ: 4.8 V에서 7.2, 7.2.
 */
const X0 = 44;
const X1 = 336;
const Y0 = 226;
const Y1 = 44;
const sx = (volt: number) => X0 + (volt / 12) * (X1 - X0);
const sy = (milli: number) => Y0 - (milli / 12) * (Y0 - Y1);

const CASES = [
  { slope: 1, volt: 3, label: "V를 3으로 넣어 보면", summary: "들어옴 9 ≠ 나감 3", note: "3 V는 시험으로 넣은 값입니다(가정). 들어오는 양이 나가는 양보다 커서 갈림길의 양이 맞지 않으므로 답이 아닙니다." },
  { slope: 1, volt: 9, label: "V를 9로 넣어 보면", summary: "들어옴 3 ≠ 나감 9", note: "9 V도 시험값입니다(가정). 이번에는 나가는 양이 더 큽니다. V가 커질수록 첫 저항에 걸리는 12−V는 줄고 두 갈래의 V는 늘어납니다." },
  { slope: 1, volt: 6, label: "두 선이 만나는 곳", summary: "V = 6 → 6 mA = 6 mA", note: "들어오는 양과 나가는 양이 같아지는 값은 하나, 6 V입니다. 아래의 식은 이 만나는 점을 계산으로 찾습니다." },
  { slope: 1.5, volt: 4.8, label: "오른쪽만 1 kΩ으로", summary: "V = 4.8 → 7.2 mA = 7.2 mA", note: "나가는 전류의 선만 가팔라지고 들어오는 전류의 선은 그대로입니다. 만나는 점이 옮겨 가 V가 4.8이 되고, 왼쪽 2 kΩ에는 2.4 mA가 흐릅니다." },
];

export default function BalanceGraphViz() {
  return (
    <SceneShell
      eyebrow="모르는 값 구하기"
      title="갈림길 전압은 들어오는 양과 나가는 양이 같아지는 곳에 정해집니다"
      description="가로축에 V 값을 넣어 볼 때 전류가 얼마가 되는지 그린 선입니다. 12 V와 저항값은 설명을 위한 가정입니다."
      ariaLabel="갈림길 전압에 따른 들어오는 전류와 나가는 전류의 두 직선과 만나는 점"
      scenes={CASES}
      render={(active) => {
        const scene = CASES[active];
        const inValue = 12 - scene.volt;
        const outValue = Math.round(scene.volt * scene.slope * 10) / 10;
        const meet = active >= 2;
        const endVolt = 12 / scene.slope;
        return (
          <svg viewBox="0 0 360 270" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <g fontSize={11}>
              <line x1={X0} x2={X0 + 18} y1={10} y2={10} stroke="#2563eb" strokeWidth={1.25} />
              <text x={X0 + 24} y={14} fill="#2563eb" fontWeight={700}>들어오는 전류 (12−V) ÷ 1 kΩ</text>
              <line x1={X0} x2={X0 + 18} y1={27} y2={27} stroke="#d97706" strokeWidth={1.25} strokeDasharray="6 3" />
              <text x={X0 + 24} y={31} fill="#b45309" fontWeight={700}>나가는 전류 V ÷ 2 kΩ + V ÷ {active === 3 ? "1" : "2"} kΩ</text>
            </g>
            {[0, 6, 12].map((tick) => (
              <g key={tick}>
                <line x1={X0} x2={X1} y1={sy(tick)} y2={sy(tick)} stroke="#94a3b8" strokeWidth={1} opacity={tick === 0 ? 1 : 0.3} />
                <text x={X0 - 6} y={sy(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            <text x={X0 - 6} y={Y1 - 6} textAnchor="end" fontSize={10} fill="#64748b">mA</text>
            {[0, 3, 6, 9, 12].map((tick) => (
              <text key={tick} x={sx(tick)} y={Y0 + 16} textAnchor="middle" fontSize={11} fontWeight={tick === scene.volt ? 700 : 400} fill="#64748b">{tick}</text>
            ))}
            <text x={(X0 + X1) / 2} y={Y0 + 36} textAnchor="middle" fontSize={11} fill="#64748b">갈림길 전압 V (볼트)</text>
            <line x1={sx(scene.volt)} x2={sx(scene.volt)} y1={Y0} y2={sy(Math.max(inValue, outValue))} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <line x1={sx(0)} y1={sy(12)} x2={sx(12)} y2={sy(0)} stroke="#2563eb" strokeWidth={1.25} />
            {active === 3 && <line x1={sx(0)} y1={sy(0)} x2={sx(12)} y2={sy(12)} stroke="#d97706" strokeWidth={1} strokeDasharray="2 4" opacity={0.6} />}
            <line x1={sx(0)} y1={sy(0)} x2={sx(endVolt)} y2={sy(12)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="6 3" />
            {meet ? (
              <>
                <circle cx={sx(scene.volt)} cy={sy(inValue)} r={5} fill="#16a34a" />
                <text x={sx(active === 3 ? 4.3 : scene.volt)} y={sy(inValue + 3)} textAnchor="middle" fontSize={12} fontWeight={700} fill="#16a34a">{`V ${scene.volt} · ${inValue} mA`}</text>
                {active === 3 && <text x={sx(4.8)} y={Y0 - 6} textAnchor="start" dx={5} fontSize={11} fontWeight={700} fill="#64748b">4.8</text>}
              </>
            ) : (
              <>
                <circle cx={sx(scene.volt)} cy={sy(inValue)} r={4} fill="#2563eb" />
                <circle cx={sx(scene.volt)} cy={sy(outValue)} r={4} fill="#d97706" />
                <text x={sx(scene.volt) + (active === 0 ? 8 : -8)} y={sy(inValue) + (active === 0 ? -6 : 16)} textAnchor={active === 0 ? "start" : "end"} fontSize={12} fontWeight={700} fill="#2563eb">들어옴 {inValue}</text>
                <text x={sx(scene.volt) + (active === 0 ? 8 : -8)} y={sy(outValue) + (active === 0 ? 16 : -6)} textAnchor={active === 0 ? "start" : "end"} fontSize={12} fontWeight={700} fill="#b45309">나감 {outValue}</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
