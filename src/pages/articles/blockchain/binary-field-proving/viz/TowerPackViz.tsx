import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tower — 네 비트를 1,u,v,uv의 계수로 읽고 두 비트씩 F₄ 원소로 묶습니다.
 * 1011 → (a₀,a₁)=(3,2), 0110 → (b₀,b₁)=(2,1). F₄ 곱(u²=u+1): 3×2=1, 3×1=3, 2×2=3, 2×1=2.
 * c₀ = a₀b₀ + a₁b₁ = 1+2 = 3, c₁ = a₀b₁ + a₁b₀ + u·a₁b₁ = 3+3+3 = 3 → 1111.
 * 수는 모두 비트 표기이고 +는 XOR입니다.
 */
const BLUE = "#2563eb";
const ORANGE = "#d97706";
const PURPLE = "#7c3aed";
const LINE = "#64748b";
const TEXT = "#334155";

const BASIS = ["uv", "v", "u", "1"] as const; // 쓰는 모양 왼쪽부터 3·2·1·0번 자리
const WORD_A = ["1", "0", "1", "1"] as const;
const WORD_B = ["0", "1", "1", "0"] as const;

const SCENES = [
  { label: "기저의 계수", summary: "1011 = 1+u+uv · 0110 = u+v", note: "네 비트를 오른쪽부터 1, u, v, uv의 계수로 읽습니다. 1011은 0·1·3번 자리가 1이므로 1+u+uv, 0110은 u+v입니다." },
  { label: "두 비트씩 묶기", summary: "(3,2) · (2,1)", note: "낮은 두 비트는 상수항 계수, 높은 두 비트는 v의 계수입니다. 각 계수는 0, 1, u, 1+u 가운데 하나인 F₄ 원소이고 비트 표기로 0~3입니다. 1011은 (3,2), 0110은 (2,1)입니다." },
  { label: "네 조각을 곱함", summary: "a₀b₀=1 · 교차 0 · a₁b₁=2", note: "곱하면 낮은 계수와 높은 계수가 서로 만나 네 조각이 생깁니다. 교차한 두 조각 3과 3은 더하면 0입니다. a₁b₁에는 v²가 붙는데 v²=1+uv이므로 상수항 쪽에 a₁b₁=2, v항 쪽에 u·a₁b₁=3을 함께 보냅니다." },
  { label: "다시 네 비트로", summary: "1111 ≠ AND 0010", note: "상수항은 1+2=3, v항은 0+3=3입니다. 두 계수를 이어 쓰면 1111입니다. 같은 자리끼리만 본 AND의 0010과 다릅니다. 한 번의 확장체 곱셈에서는 여러 자리가 섞입니다." },
] as const;

function WordRow({ y, label, bits, pairs }: { y: number; label: string; bits: readonly string[]; pairs?: readonly [string, string] }) {
  return (
    <g>
      <text x={6} y={y + 21} fontSize={12} fontWeight={700} fill={TEXT}>{label}</text>
      {bits.map((bit, i) => {
        const x = 70 + i * 46;
        const high = i < 2;
        const color = pairs ? (high ? ORANGE : BLUE) : bit === "1" ? BLUE : LINE;
        return (
          <g key={i}>
            <rect x={x} y={y} width={40} height={32} rx={4} fill={bit === "1" ? color : "none"} fillOpacity={bit === "1" ? 0.15 : 0} stroke={color} strokeWidth={1} />
            <text x={x + 20} y={y + 21} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="ui-monospace, monospace" fill={TEXT}>{bit}</text>
          </g>
        );
      })}
      {pairs && (
        <g>
          <path d={`M 72 ${y + 38} v 5 h 82 v -5`} fill="none" stroke={ORANGE} strokeWidth={1} />
          <path d={`M 164 ${y + 38} v 5 h 82 v -5`} fill="none" stroke={BLUE} strokeWidth={1} />
          <text x={113} y={y + 56} textAnchor="middle" fontSize={11} fontWeight={700} fill={ORANGE}>{pairs[1]}</text>
          <text x={205} y={y + 56} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>{pairs[0]}</text>
        </g>
      )}
    </g>
  );
}

function BasisHeader() {
  return (
    <g>
      {BASIS.map((name, i) => (
        <text key={name} x={90 + i * 46} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill={PURPLE}>{name}</text>
      ))}
    </g>
  );
}

function ProductTable() {
  const cells = [
    { r: 0, c: 0, v: "1", color: BLUE, tag: "a₀b₀" },
    { r: 0, c: 1, v: "3", color: ORANGE, tag: "a₀b₁" },
    { r: 1, c: 0, v: "3", color: ORANGE, tag: "a₁b₀" },
    { r: 1, c: 1, v: "2", color: PURPLE, tag: "a₁b₁" },
  ] as const;
  const x0 = 110;
  const y0 = 40;
  return (
    <g>
      <text x={x0 + 40} y={y0 - 10} textAnchor="middle" fontSize={11} fill={LINE}>b₀ = 2</text>
      <text x={x0 + 120} y={y0 - 10} textAnchor="middle" fontSize={11} fill={LINE}>b₁ = 1</text>
      <text x={x0 - 8} y={y0 + 26} textAnchor="end" fontSize={11} fill={LINE}>a₀ = 3</text>
      <text x={x0 - 8} y={y0 + 70} textAnchor="end" fontSize={11} fill={LINE}>a₁ = 2</text>
      {cells.map((cell) => (
        <g key={cell.tag}>
          <rect x={x0 + cell.c * 80} y={y0 + cell.r * 44} width={76} height={40} rx={4} fill={cell.color} fillOpacity={0.12} stroke={cell.color} strokeWidth={1} />
          <text x={x0 + cell.c * 80 + 38} y={y0 + cell.r * 44 + 17} textAnchor="middle" fontSize={10} fill={cell.color}>{cell.tag}</text>
          <text x={x0 + cell.c * 80 + 38} y={y0 + cell.r * 44 + 33} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="ui-monospace, monospace" fill={TEXT}>{cell.v}</text>
        </g>
      ))}
      <text x={6} y={152} fontSize={11} fontWeight={700} fill={BLUE}>상수항 c₀ ← a₀b₀ + a₁b₁</text>
      <text x={6} y={170} fontSize={11} fontWeight={700} fill={ORANGE}>v항 c₁ ← a₀b₁ + a₁b₀ + u·a₁b₁</text>
      <text x={6} y={188} fontSize={11} fill={PURPLE}>a₁b₁v² = a₁b₁(1+uv): 양쪽으로 갈라짐</text>
    </g>
  );
}

function Recombine() {
  return (
    <g>
      <text x={6} y={30} fontSize={12} fontWeight={700} fill={BLUE}>c₀ = 1 + 2 = 3</text>
      <text x={6} y={50} fontSize={12} fontWeight={700} fill={ORANGE}>c₁ = 3 + 3 + 3 = 3</text>
      <WordRow y={66} label="곱" bits={["1", "1", "1", "1"]} pairs={["c₀ = 3", "c₁ = 3"]} />
      <text x={6} y={175} fontSize={12} fontWeight={700} fill={TEXT}>AND</text>
      {["0", "0", "1", "0"].map((bit, i) => (
        <g key={i}>
          <rect x={70 + i * 46} y={154} width={40} height={32} rx={4} fill="none" stroke={LINE} strokeWidth={1} strokeDasharray="3 2" />
          <text x={90 + i * 46} y={175} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="ui-monospace, monospace" fill={LINE}>{bit}</text>
        </g>
      ))}
      <text x={354} y={175} textAnchor="end" fontSize={11} fill={LINE}>자리별</text>
    </g>
  );
}

export default function TowerPackViz() {
  return (
    <SceneShell
      eyebrow="확장체 곱셈"
      title="네 비트를 두 계수로 묶어 곱하면 자리가 섞여 1111이 됩니다"
      description="수는 정수가 아니라 비트 표기입니다(2는 u, 3은 1+u). +는 XOR이고, 계수끼리의 곱은 u²=u+1을 쓰는 F₄ 곱셈입니다."
      ariaLabel="1011과 0110을 F4 계수 두 개로 묶어 곱한 결과 1111과 비트별 AND 0010 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active === 0 && (
            <g>
              <BasisHeader />
              <WordRow y={28} label="1011" bits={WORD_A} />
              <text x={262} y={49} fontSize={12} fontWeight={700} fill={BLUE}>1+u+uv</text>
              <WordRow y={100} label="0110" bits={WORD_B} />
              <text x={262} y={121} fontSize={12} fontWeight={700} fill={BLUE}>u+v</text>
            </g>
          )}
          {active === 1 && (
            <g>
              <BasisHeader />
              <WordRow y={28} label="1011" bits={WORD_A} pairs={["a₀ = 3", "a₁ = 2"]} />
              <WordRow y={112} label="0110" bits={WORD_B} pairs={["b₀ = 2", "b₁ = 1"]} />
              <text x={262} y={49} fontSize={12} fontWeight={700} fill={TEXT}>(3, 2)</text>
              <text x={262} y={133} fontSize={12} fontWeight={700} fill={TEXT}>(2, 1)</text>
            </g>
          )}
          {active === 2 && <ProductTable />}
          {active === 3 && <Recombine />}
        </svg>
      )}
    />
  );
}
