import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #ecc-syndrome-secded 2^r ≥ m + r + 1, m = 64.
 * r=5: 32 < 70, r=6: 64 < 71, r=7: 128 ≥ 72 → 최소 r = 7.
 */
const M = 64;
const ROWS = [5, 6, 7].map((r) => ({ r, states: 2 ** r, needed: M + r + 1 }));

const W = 360;
const LABEL_W = 46;
const LEFT = LABEL_W + 6;
const RIGHT = W - 12;
const SPAN = RIGHT - LEFT;
const MAX = 128;
const ROW_H = 52;
const TOP = 18;
const BAR_H = 14;

const HAVE = "#2563eb";
const NEED = "#d97706";

const x = (value: number) => LEFT + (value / MAX) * SPAN;

export default function HammingBoundViz() {
  return (
    <VizFrame
      eyebrow="check bit 수"
      title="64 data bit에는 check bit 7개가 처음으로 충분합니다"
      description="syndrome은 check bit를 다시 계산해 얻는 r-bit 결과로, 오류가 없는지 또는 어느 bit가 뒤집혔는지를 가리키는 번호입니다. 위 막대는 r개 check bit가 만드는 번호 가짓수 2ʳ, 아래 막대는 가리켜야 할 경우의 수 m + r + 1(m은 data bit 수 64, 1은 오류 없음)입니다."
      note="r=5·6은 같은 식에 m=64를 넣어 계산한 비교값입니다. 단일 오류 위치를 가리키는 최소 bound입니다. SECDED는 보통 여기에 전체 parity bit를 더해 2-bit 검출을 확장하며, 실제 codeword·chipkill 구성은 platform 문서를 따릅니다."
    >
      <svg viewBox={`0 0 ${W} ${TOP + ROWS.length * ROW_H + 8}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="m=64에서 r=5, 6은 syndrome 가짓수가 부족하고 r=7에서 128이 72 이상이 되는 비교">
        {ROWS.map((row, index) => {
          const y = TOP + index * ROW_H;
          const ok = row.states >= row.needed;
          return (
            <g key={row.r}>
              <text x={0} y={y + BAR_H + 4} fontSize={12} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>r = {row.r}</text>
              <rect x={LEFT} y={y} width={x(row.states) - LEFT} height={BAR_H} fill={HAVE} fillOpacity={0.3} stroke={HAVE} strokeWidth={1} />
              <text x={x(row.states) + 4} y={y + 11} fontSize={10} fill={HAVE} textAnchor={row.states > 100 ? "end" : "start"} dx={row.states > 100 ? -8 : 0}>
                2^{row.r} = {row.states}
              </text>
              <rect x={LEFT} y={y + BAR_H + 4} width={x(row.needed) - LEFT} height={BAR_H} fill={NEED} fillOpacity={0.3} stroke={NEED} strokeWidth={1} />
              <text x={x(row.needed) + 4} y={y + BAR_H + 15} fontSize={10} fill={NEED}>
                64 + {row.r} + 1 = {row.needed}
              </text>
              <text x={RIGHT} y={y + BAR_H + 15} textAnchor="end" fontSize={10} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>
                {ok ? "충분" : "부족"}
              </text>
            </g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
