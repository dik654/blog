import SceneShell from "./SceneShell";

/**
 * 본문 대응: #kernel-and-hybrid — B=16. full group은 2496(block 0~155), window 1024 group은 block 130이 없다(가정).
 * window 모형은 ceil(1023/16)=64개의 연속 block을 찾는다. 2496 경계(block 92~155)는 130을 포함해 실패,
 * 2080 경계(block 66~129, [1056,2080))에서 성립한다. full도 130개 block으로 줄여 길이를 맞춘다.
 */
const BLUE = "#2563eb";
const GREEN = "#15803d";
const RED = "#dc2626";
const SLATE = "#64748b";
const x = (block: number) => 16 + block * 2;

const SCENES = [
  { label: "두 group의 상태", summary: "full 2496 · window는 130 없음", note: "층마다 다른 기록을 보관하면 그 묶음(cache group)마다 남은 block이 다를 수 있습니다. full은 앞에서부터 이어져야 하고, window는 경계 바로 앞 구간만 있으면 됩니다. block 130이 없다는 것은 가정입니다." },
  { label: "몇 block이 필요한가", summary: "⌈(1024−1) / 16⌉ = 64", note: "이 window 모형은 경계 바로 앞에서 연속 block 64개를 찾습니다. 길이 2496을 그대로 쓰면 그 구간은 block 92~155인데 없는 130이 들어 있어 성립하지 않습니다." },
  { label: "130 앞으로 물러남", summary: "window 2080 · block 66~129", note: "경계를 130개 block인 2080으로 내리면 block 66~129가 [1056, 2080)을 덮고 빠진 칸이 없습니다. 다른 필요한 block이 남고 특별 draft 조건이 없다고 둔 결과입니다." },
  { label: "길이를 합의", summary: "full도 2496 → 2080", note: "합의한 길이 2080에 맞춰 full group도 130개 block으로 줄입니다. 이미 찾은 결과를 잘라 쓰며, 모든 group을 원점부터 다시 조회하는 것이 아닙니다." },
];

function Lane({ y, name, fullEnd, missing, band, bandColor }: { y: number; name: string; fullEnd: number; missing?: number; band?: readonly [number, number]; bandColor?: string }) {
  return (
    <g>
      <text x={16} y={y - 6} fontSize={12} fontWeight={700} fill="currentColor">{name}</text>
      <rect x={x(0)} y={y} width={x(156) - x(0)} height={24} fill="none" stroke="#94a3b8" strokeWidth={1} />
      <rect x={x(0)} y={y} width={x(fullEnd) - x(0)} height={24} fill="#94a3b8" opacity={0.45} />
      {band && <rect x={x(band[0])} y={y} width={x(band[1] + 1) - x(band[0])} height={24} fill={bandColor} opacity={0.55} />}
      {missing !== undefined && <rect x={x(missing)} y={y - 2} width={2} height={28} fill={RED} />}
    </g>
  );
}

export default function HybridWindowViz() {
  return (
    <SceneShell
      eyebrow="(가정) cache group 두 개"
      title="block 하나가 빠지면 두 group이 함께 2080으로 물러납니다"
      description="가로축은 block 번호이며 한 block은 16자리입니다. 회색은 남은 block, 빨간 선은 없는 block 130, 띠는 window가 찾는 64개 구간입니다(성립하면 파랑, 아니면 빨강)."
      ariaLabel="window group의 빠진 block 때문에 full group까지 재사용 길이를 줄이는 과정"
      scenes={SCENES}
      render={(index) => {
        const fullEnd = index === 3 ? 130 : 156;
        const band: readonly [number, number] | undefined = index === 1 ? [92, 155] : index >= 2 ? [66, 129] : undefined;
        const edge = index >= 2 ? 130 : 156;
        return (
          <svg viewBox="0 0 344 176" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <Lane y={24} name="full group" fullEnd={fullEnd} />
            <Lane y={82} name="window 1024 group" fullEnd={156} missing={130} band={band} bandColor={index === 1 ? "#dc2626" : BLUE} />
            {index === 3 && <rect x={x(130)} y={24} width={x(156) - x(130)} height={24} fill="none" stroke={SLATE} strokeWidth={1} strokeDasharray="4 3" />}
            {index === 3 && <text x={x(143)} y={40} textAnchor="middle" fontSize={11} fill={SLATE}>쓰지 않음</text>}
            {index >= 1 && <line x1={x(edge)} x2={x(edge)} y1={16} y2={116} stroke={index === 1 ? RED : GREEN} strokeWidth={1.25} strokeDasharray="4 3" />}
            {index === 0 && <text x={x(130)} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>block 130 없음</text>}
            {index === 1 && <text x={x(92)} y={122} fontSize={11} fontWeight={700} fill={RED}>block 92~155: 130 포함</text>}
            {index >= 2 && <text x={x(98)} y={122} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>block 66~129</text>}
            {index >= 2 && <text x={x(98)} y={138} textAnchor="middle" fontSize={11} fill={SLATE}>[1056, 2080)</text>}
            <text x={x(0)} y={162} fontSize={11} fill={SLATE}>0</text>
            <text x={x(130)} y={162} textAnchor="middle" fontSize={11} fontWeight={index >= 2 ? 700 : 400} fill={index >= 2 ? GREEN : SLATE}>130 = 2080자리</text>
            <text x={x(156)} y={174} textAnchor="end" fontSize={11} fill={SLATE}>156 = 2496자리</text>
          </svg>
        );
      }}
    />
  );
}
