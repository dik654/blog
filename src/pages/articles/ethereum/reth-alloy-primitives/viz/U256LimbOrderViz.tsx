import SceneShell from "./AlloySceneShell";

/**
 * 본문 대응: #u256-arithmetic — limb 네 개는 낮은 자리부터, RLP 정수는 큰 자리부터 앞의 0을 뺀 바이트.
 * [5,1,0,0] → x = 5 + 2⁶⁴ = 0x01_0000000000000005 → 9바이트 → RLP 머리 0x80 + 9 = 0x89.
 * MAX + 1 → carry가 ℓ0 → ℓ3로 전달되고 2²⁵⁶ 자리로 넘침 → checked 실패 · wrapping 0 · saturating MAX.
 */
const W = 360;
const H = 210;
const BOX_W = 74;
const BOX_GAP = 10;
const LEFT = 17;
const bx = (i: number) => LEFT + i * (BOX_W + BOX_GAP);

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";
const TEXT = "#475569";
const BAD = "#dc2626";
const OK = "#16a34a";
const WARN = "#d97706";

const WEIGHTS: readonly string[] = ["×2⁰", "×2⁶⁴", "×2¹²⁸", "×2¹⁹²"];
const BYTES: readonly string[] = ["89", "01", "00", "00", "00", "00", "00", "00", "00", "05"];
const CELL_W = 30;
const CELL_GAP = 3;
const CELL_LEFT = (W - (BYTES.length * CELL_W + (BYTES.length - 1) * CELL_GAP)) / 2;
const cx = (i: number) => CELL_LEFT + i * (CELL_W + CELL_GAP);

const SCENES = [
  { label: "낮은 자리부터 놓인 조각", summary: "[5,1,0,0] → 5 + 2⁶⁴", note: "U256 안의 64비트 조각(limb)은 배열 0번이 가장 낮은 자리입니다. [5,1,0,0]은 5×2⁰ + 1×2⁶⁴이므로 x = 5 + 2⁶⁴입니다." },
  { label: "RLP는 큰 자리부터", summary: "89 · 01 · 00×7 · 05", note: "같은 값을 RLP로 내보내면 큰 자리 바이트가 앞에 옵니다. ℓ0은 뒤 8바이트가 되고, ℓ1의 8바이트 중 값이 있는 마지막 바이트 01이 맨 앞에 섭니다. 0인 ℓ2·ℓ3과 ℓ1의 앞 7바이트는 모두 앞쪽의 불필요한 0이라 지워지고, 9바이트이므로 머리는 0x80 + 9 = 0x89입니다." },
  { label: "carry가 위 조각으로", summary: "MAX + 1 → 네 조각 모두 0", note: "MAX는 네 조각이 모두 2⁶⁴−1입니다. 1을 더하면 ℓ0이 0이 되며 carry 1이 ℓ1로 가고, 같은 일이 ℓ3까지 이어집니다. 마지막 carry는 2²⁵⁶ 자리라 네 조각 안에 둘 곳이 없습니다." },
  { label: "넘친 carry를 어떻게 다루나", summary: "실패 · 0 · MAX", note: "같은 MAX + 1이어도 호출한 함수에 따라 결과가 갈립니다. 잔액 합산처럼 범위를 넘으면 실패해야 하는 곳과 EVM 연산처럼 2²⁵⁶에서 순환해야 하는 곳이 다르므로, 타입이 아니라 호출부의 선택을 확인해야 합니다." },
] as const;

function LimbRow({ y, values, color, labels }: { y: number; values: readonly string[]; color: string; labels: boolean }) {
  return (
    <g>
      {values.map((value, i) => (
        <g key={i}>
          {labels && (
            <text x={bx(i) + BOX_W / 2} y={y - 6} textAnchor="middle" fontSize={10} fontWeight={700} fill={TEXT}>{`ℓ${i} · 배열 ${i}번`}</text>
          )}
          <rect x={bx(i)} y={y} width={BOX_W} height={30} rx={4} fill="none" stroke={color} strokeWidth={1} />
          <text x={bx(i) + BOX_W / 2} y={y + 20} textAnchor="middle" fontSize={value.length > 3 ? 11 : 13} fontWeight={700} fill={color}>{value}</text>
        </g>
      ))}
    </g>
  );
}

export default function U256LimbOrderViz() {
  return (
    <SceneShell
      eyebrow="U256 · 메모리 순서와 wire 순서"
      title="같은 U256도 내부 조각은 낮은 자리부터, RLP 바이트는 큰 자리부터 놓입니다"
      description="네모 하나가 64비트 조각(limb) 하나, 작은 칸 하나가 RLP 바이트 하나입니다. [5,1,0,0]과 MAX + 1은 위 공식 상자의 예를 그대로 씁니다."
      ariaLabel="U256 limb 순서와 RLP big-endian 바이트 순서 비교, 그리고 MAX 더하기 1의 carry와 세 가지 넘침 처리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {active <= 1 && (
              <>
                <LimbRow y={24} values={["5", "1", "0", "0"]} color={ACCENT} labels />
                {active === 0 &&
                  WEIGHTS.map((weight, i) => (
                    <text key={weight} x={bx(i) + BOX_W / 2} y={72} textAnchor="middle" fontSize={11} fill={TEXT}>{weight}</text>
                  ))}
              </>
            )}

            {active === 0 && (
              <>
                <line x1={LEFT} x2={W - LEFT} y1={96} y2={96} stroke={MUTED} strokeWidth={1} />
                <text x={W / 2} y={124} textAnchor="middle" fontSize={13} fontWeight={700} fill={ACCENT}>x = 5·2⁰ + 1·2⁶⁴ + 0 + 0 = 2⁶⁴ + 5</text>
                <line x1={LEFT + 20} x2={W - LEFT - 20} y1={160} y2={160} stroke={TEXT} strokeWidth={1} markerEnd="url(#u256-arrow)" />
                <text x={LEFT + 20} y={178} fontSize={10} fill={TEXT}>낮은 자리</text>
                <text x={W - LEFT - 20} y={178} textAnchor="end" fontSize={10} fill={TEXT}>높은 자리</text>
              </>
            )}

            {active === 1 && (
              <>
                <text x={bx(2) + BOX_W + 5} y={74} textAnchor="middle" fontSize={10} fill={MUTED}>앞의 0 → 지움</text>
                <path d={`M ${bx(1) + BOX_W / 2} 54 L ${cx(1) + CELL_W / 2} 128`} stroke={ACCENT} strokeWidth={1} fill="none" />
                <path d={`M ${bx(0) + BOX_W / 2} 54 L ${cx(2) + 8} 120 L ${cx(9) + CELL_W - 4} 120`} stroke={WARN} strokeWidth={1} fill="none" />
                <line x1={cx(2) + 8} x2={cx(2) + 8} y1={120} y2={128} stroke={WARN} strokeWidth={1} />
                <line x1={cx(9) + CELL_W - 4} x2={cx(9) + CELL_W - 4} y1={120} y2={128} stroke={WARN} strokeWidth={1} />
                <text x={(cx(2) + cx(9) + CELL_W) / 2} y={114} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>ℓ0 = 8바이트</text>
                {BYTES.map((byte, i) => (
                  <g key={i}>
                    <rect x={cx(i)} y={130} width={CELL_W} height={26} rx={3} fill="none" stroke={i === 0 ? TEXT : i === 1 ? ACCENT : WARN} strokeWidth={1} />
                    <text x={cx(i) + CELL_W / 2} y={147} textAnchor="middle" fontSize={11} fontWeight={700} fill={i === 0 ? TEXT : i === 1 ? ACCENT : WARN}>{byte}</text>
                  </g>
                ))}
                <text x={cx(0)} y={174} fontSize={10} fill={TEXT}>머리 0x80+9</text>
                <line x1={cx(1)} x2={cx(9) + CELL_W} y1={192} y2={192} stroke={TEXT} strokeWidth={1} markerEnd="url(#u256-arrow)" />
                <text x={cx(9) + CELL_W} y={186} textAnchor="end" fontSize={10} fill={TEXT}>큰 자리 → 작은 자리</text>
              </>
            )}

            {active === 2 && (
              <>
                <LimbRow y={24} values={["2⁶⁴−1", "2⁶⁴−1", "2⁶⁴−1", "2⁶⁴−1"]} color={TEXT} labels />
                <text x={bx(0) + BOX_W / 2} y={74} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACCENT}>+ 1</text>
                {[0, 1, 2, 3].map((i) => (
                  <line key={i} x1={bx(i) + BOX_W / 2} x2={bx(i) + BOX_W / 2} y1={80} y2={104} stroke={MUTED} strokeWidth={1} markerEnd="url(#u256-arrow)" />
                ))}
                <LimbRow y={108} values={["0", "0", "0", "0"]} color={ACCENT} labels={false} />
                {[0, 1, 2].map((i) => (
                  <g key={i}>
                    <path d={`M ${bx(i) + BOX_W / 2} 140 Q ${bx(i) + BOX_W + BOX_GAP / 2} 162 ${bx(i + 1) + BOX_W / 2} 140`} stroke={WARN} strokeWidth={1} fill="none" markerEnd="url(#u256-arrow)" />
                    <text x={bx(i) + BOX_W + BOX_GAP / 2} y={170} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>carry 1</text>
                  </g>
                ))}
                <text x={W - LEFT} y={196} textAnchor="end" fontSize={10} fontWeight={700} fill={BAD}>ℓ3의 carry 1 → 2²⁵⁶ 자리 · 둘 곳 없음</text>
              </>
            )}

            {active === 3 && (
              <>
                <text x={W / 2} y={30} textAnchor="middle" fontSize={13} fontWeight={700} fill={TEXT}>MAX + 1 (2²⁵⁶ 자리로 넘침)</text>
                {[
                  { name: "checked_add", result: "실패", why: "범위를 넘으면 오류", color: BAD },
                  { name: "wrapping_add", result: "0", why: "2²⁵⁶에서 순환", color: ACCENT },
                  { name: "saturating_add", result: "MAX", why: "최댓값에 고정", color: OK },
                ].map((row, i) => (
                  <g key={row.name}>
                    <rect x={20} y={46 + i * 46} width={W - 40} height={34} rx={5} fill="none" stroke={row.color} strokeWidth={1} />
                    <text x={32} y={68 + i * 46} fontSize={11} fontWeight={700} fill={TEXT}>{row.name}</text>
                    <text x={190} y={68 + i * 46} textAnchor="middle" fontSize={13} fontWeight={700} fill={row.color}>{row.result}</text>
                    <text x={W - 32} y={68 + i * 46} textAnchor="end" fontSize={10} fill={TEXT}>{row.why}</text>
                  </g>
                ))}
              </>
            )}

            <defs>
              <marker id="u256-arrow" viewBox="0 0 8 8" refX={7} refY={4} markerWidth={6} markerHeight={6} orient="auto">
                <path d="M0 0 L8 4 L0 8 z" fill={MUTED} />
              </marker>
            </defs>
          </svg>
        );
      }}
    />
  );
}
