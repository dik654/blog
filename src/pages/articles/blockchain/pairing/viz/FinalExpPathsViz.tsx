import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source-final, #verification — E=(p¹²−1)/r = (p⁶−1)(p²+1)·H, H=(p⁴−p²+1)/r.
 * 고정 버전의 뒷부분은 H가 아니라 cH(c=2z(6z²+3z+1))를 계산해 Mᶜᴱ를 냅니다.
 * gcd(c,r)=1 → c제곱은 출력 군에서 되돌릴 수 있고(c⁻¹ mod r), 곱이 1인지 보는 판정은 유지됩니다.
 */
const SCENES = [
  { label: "일반식의 경로", summary: "M → (p⁶−1)(p²+1)승 → H승 = Mᴱ", note: "일반 지수 E는 앞부분 (p⁶−1)(p²+1)과 뒷부분 H=(p⁴−p²+1)/r로 나뉩니다. 앞부분은 역원을 쓰므로 M이 0이면 None입니다." },
  { label: "이 버전의 경로", summary: "뒷부분이 cH승 → Mᶜᴱ", note: "고정한 원문의 뒷부분은 주석대로 H가 아니라 cH승을 계산합니다. c=2z(6z²+3z+1)이므로 최종 출력은 일반 E승에 c제곱을 더 한 Mᶜᴱ입니다." },
  { label: "두 출력 사이", summary: "c승으로 가고 c⁻¹ mod r승으로 돌아옴", note: "실제 실행의 결과는 Mᶜᴱ와 같고 Mᴱ와 달랐습니다. gcd(c,r)=1이라 c의 r에 대한 역수가 있고, 그만큼 거듭제곱하면 Mᴱ로 돌아왔습니다." },
  { label: "유지되는 판정", summary: "둘 다 r승 = 1 · 곱이 1인지 판정 동일", note: "두 출력 모두 r제곱하면 1입니다. 출력 원소와 바이트는 다르지만 쌍선형성, 비퇴화, 여러 출력의 곱이 1인지 보는 판정은 유지됩니다." },
] as const;

const W = 400;
const H = 236;

type BoxProps = { x: number; y: number; w: number; h: number; title: string; sub?: string; on: boolean; tone?: "blue" | "amber" | "plain" };
function Box({ x, y, w, h, title, sub, on, tone = "plain" }: BoxProps) {
  const stroke = !on ? "#cbd5e1" : tone === "blue" ? "#2563eb" : tone === "amber" ? "#d97706" : "#475569";
  const fill = !on ? "#ffffff" : tone === "blue" ? "#dbeafe" : tone === "amber" ? "#fef3c7" : "#f1f5f9";
  const ink = on ? "#0f172a" : "#94a3b8";
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={x + w / 2} y={sub ? y + h / 2 - 3 : y + h / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={ink}>{title}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={10} fill={ink}>{sub}</text>}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2, on, color = "#475569" }: { x1: number; y1: number; x2: number; y2: number; on: boolean; color?: string }) {
  const c = on ? color : "#cbd5e1";
  const a = Math.atan2(y2 - y1, x2 - x1);
  const hx = (d: number) => x2 - 6 * Math.cos(a + d);
  const hy = (d: number) => y2 - 6 * Math.sin(a + d);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={1} />
      <path d={`M ${x2} ${y2} L ${hx(0.45)} ${hy(0.45)} L ${hx(-0.45)} ${hy(-0.45)} Z`} fill={c} />
    </g>
  );
}

export default function FinalExpPathsViz() {
  return (
    <SceneShell
      eyebrow="마지막 거듭제곱의 두 경로"
      title="일반식은 Mᴱ, 이 버전은 Mᶜᴱ를 냅니다"
      description="M은 Miller 반복이 끝난 원시 값입니다. 위 경로는 일반 지수 E, 아래 경로는 고정한 arkworks 버전이 실제로 계산하는 cE입니다."
      ariaLabel="원시 Miller 값 M이 일반 지수 E와 이 버전의 cE로 갈라지고, c승과 c 역수승으로 서로 이어지는 관계"
      scenes={SCENES}
      render={(active) => {
        const general = active === 0 || active >= 2;
        const version = active >= 1;
        const link = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Box x={6} y={92} w={48} h={40} title="M" sub="원시 값" on />
            <Arrow x1={54} y1={112} x2={74} y2={112} on />
            <Box x={76} y={86} w={92} h={52} title="앞부분" sub="(p⁶−1)(p²+1)승" on />
            {active === 0 && <text x={122} y={156} textAnchor="middle" fontSize={10} fill="#b91c1c">M=0 → None</text>}
            <Arrow x1={168} y1={104} x2={196} y2={58} on={general} color="#2563eb" />
            <Arrow x1={168} y1={120} x2={196} y2={166} on={version} color="#d97706" />
            <Box x={198} y={36} w={62} h={42} title="H승" sub="일반 설명" on={general} tone="blue" />
            <Box x={198} y={146} w={62} h={42} title="cH승" sub="이 버전" on={version} tone="amber" />
            <Arrow x1={260} y1={57} x2={284} y2={57} on={general} color="#2563eb" />
            <Arrow x1={260} y1={167} x2={284} y2={167} on={version} color="#d97706" />
            <Box x={286} y={36} w={66} h={42} title="Mᴱ" on={general} tone="blue" />
            <Box x={286} y={146} w={66} h={42} title="Mᶜᴱ" on={version} tone="amber" />
            <Arrow x1={305} y1={80} x2={305} y2={144} on={link} color="#d97706" />
            <Arrow x1={333} y1={144} x2={333} y2={80} on={link} color="#2563eb" />
            {link && (
              <g>
                <text x={300} y={115} textAnchor="end" fontSize={10} fill="#b45309">c승</text>
                <text x={338} y={115} fontSize={10} fill="#1d4ed8">c⁻¹ mod r승</text>
              </g>
            )}
            {active === 1 && <text x={229} y={206} textAnchor="middle" fontSize={10} fill="#b45309">c = 2z(6z²+3z+1)</text>}
            {active === 2 && <text x={229} y={206} textAnchor="middle" fontSize={10} fill="#475569">gcd(c, r) = 1 → 역수가 있음</text>}
            {active === 3 && (
              <g>
                <rect x={120} y={200} width={232} height={28} rx={6} fill="#ecfdf5" stroke="#059669" strokeWidth={1} />
                <text x={236} y={218} textAnchor="middle" fontSize={10} fill="#065f46">둘 다 r승 = 1 · 곱이 1인지 판정은 같음</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
