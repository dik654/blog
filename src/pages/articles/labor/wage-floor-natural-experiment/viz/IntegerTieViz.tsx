import SceneShell from "./SceneShell";
import { integerBenefit, integerMaxima, wageBill } from "../model";

/**
 * 본문 대응: #finite-units — 별도 정수 사례. k번째 단위의 수입 13−k, 총수입 12.5n−n²/2.
 * 첫 장면은 앞 연속 함수의 n번째 구간 수입 13.5−n과의 차이, 나머지는 단위 수별 이익과 동률.
 */
const UNITS = [0, 1, 2, 3, 4, 5] as const;
const YMIN = -10;
const YMAX = 16;
const TOP = 34;
const BOTTOM = 204;
const sy = (v: number) => TOP + ((YMAX - v) / (YMAX - YMIN)) * (BOTTOM - TOP);
const slotX = (i: number) => 34 + i * 54;
const BAR_W = 34;

type ProfitCase = { floor: number; wageTaking: boolean };
const CASES: readonly (ProfitCase | null)[] = [
  null,
  { floor: 8, wageTaking: true },
  { floor: 0, wageTaking: false },
  { floor: 9, wageTaking: false },
  { floor: 12, wageTaking: false },
];

const profit = (units: number, { floor, wageTaking }: ProfitCase) =>
  integerBenefit(units) - (wageTaking ? units * floor : wageBill(units, floor));

const SCENES = [
  { label: "다른 함수입니다", summary: "12·11·10 합 33 ≠ 34.5", note: "별도 사례의 단위 수입은 12, 11, 10으로 셋을 합치면 33입니다. 앞의 연속 함수는 한 시간 구간마다 13.5−n이어서 12.5, 11.5, 10.5이고 합이 B(3)=34.5입니다. 두 결과를 섞지 않습니다." },
  { label: "시급 8을 받아들일 때", summary: "4단위 = 5단위 = 10", note: "시급 8을 주어진 값으로 받으면 4단위와 5단위의 이익이 10으로 같습니다. 어느 한쪽을 유일한 답이라고 하지 않습니다." },
  { label: "필요한 시급을 모두에게", summary: "3단위 15 · 4단위 14", note: "필요한 시급 n+3을 모두에게 주면 3단위가 최대입니다. 넷째 단위의 추가 수입은 9인데 추가 임금은 10이어서 이익이 줄어듭니다." },
  { label: "최저시급 9", summary: "3단위 = 4단위 = 6", note: "같은 정수 사례에 최저시급 9를 적용하면 3단위와 4단위가 6으로 같습니다. 반드시 4명이라고 정할 수 없습니다." },
  { label: "최저시급 12", summary: "0단위 = 1단위 = 0", note: "최저시급 12에서는 0단위와 1단위가 이익 0으로 같습니다. 반드시 1명이라고 정할 수 없습니다." },
] as const;

export default function IntegerTieViz() {
  return (
    <SceneShell
      eyebrow="정수 인원"
      title="정수로 세면 최대가 둘일 수 있습니다"
      description="첫 장면의 막대는 그 단위가 더하는 수입, 이후 장면의 막대는 그 단위 수를 택했을 때의 이익(달러)입니다. 앞 가게와 별개인 설명 사례입니다(가정)."
      ariaLabel="정수 단위별 이익과 동률인 최대"
      scenes={SCENES}
      render={(active) => {
        const current = CASES[active];
        if (!current) {
          return (
            <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={20} x2={350} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} />
              {[1, 2, 3, 4, 5].map((unit, index) => {
                const integerValue = 13 - unit;
                const intervalValue = 13.5 - unit;
                const x = 36 + index * 64;
                return (
                  <g key={unit}>
                    <rect x={x} y={sy(integerValue)} width={24} height={sy(0) - sy(integerValue)} fill="#2563eb" opacity={0.8} />
                    <rect x={x + 25} y={sy(intervalValue)} width={24} height={sy(0) - sy(intervalValue)} fill="#94a3b8" opacity={0.6} />
                    <text x={x + 12} y={sy(integerValue) - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">{integerValue}</text>
                    <text x={x + 37} y={sy(intervalValue) - 4} textAnchor="middle" fontSize={11} fill="#64748b">{intervalValue}</text>
                    <text x={x + 24} y={sy(0) + 15} textAnchor="middle" fontSize={11} fill="#64748b">{unit}번째</text>
                  </g>
                );
              })}
              <rect x={36} y={sy(-4.5)} width={10} height={10} fill="#2563eb" opacity={0.8} />
              <text x={50} y={sy(-4.5) + 9} fontSize={11} className="fill-foreground">별도 정수 사례 13−n</text>
              <rect x={36} y={sy(-7)} width={10} height={10} fill="#94a3b8" opacity={0.6} />
              <text x={50} y={sy(-7) + 9} fontSize={11} className="fill-foreground">앞 연속 함수의 구간 13.5−n</text>
            </svg>
          );
        }
        const best = integerMaxima(current.floor, current.wageTaking);
        return (
          <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={20} x2={350} y1={sy(0)} y2={sy(0)} stroke="#94a3b8" strokeWidth={1} />
            {UNITS.map((units, index) => {
              const value = profit(units, current);
              const isBest = best.includes(units);
              const top = value >= 0 ? sy(value) : sy(0);
              const height = Math.abs(sy(value) - sy(0));
              const x = slotX(index);
              return (
                <g key={units}>
                  <rect x={x} y={top} width={BAR_W} height={height} fill={isBest ? "#d97706" : "#94a3b8"} opacity={isBest ? 0.9 : 0.5} />
                  <text x={x + BAR_W / 2} y={value >= 0 ? sy(value) - (isBest ? 17 : 4) : sy(value) + 13} textAnchor="middle" fontSize={11} fontWeight={isBest ? 700 : 400} className="fill-foreground">{value < 0 ? `−${-value}` : value}</text>
                  {isBest && <text x={x + BAR_W / 2} y={sy(value) - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">최대</text>}
                  <text x={x + BAR_W / 2} y={BOTTOM + 30} textAnchor="middle" fontSize={11} fill="#64748b">{units}단위</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
