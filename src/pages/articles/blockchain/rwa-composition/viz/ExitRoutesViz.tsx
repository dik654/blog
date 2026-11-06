import SceneShell from "./SceneShell";

/**
 * 본문 대응: #permissioned-market-stack.
 * Circle(2024): 지분→USDC, 유통시장 교환. UniswapX(2026): 자격 확인+허용된 견적 상대방.
 * USDC→은행: 소각·등록 은행 계좌 송금·수수료(지분→USDC 다음의 별도 사건). 펀드 환매는 Circle 경로와 구분.
 * 은행까지 잇는 구간은 본문이 절차를 설명한 USDC 경로에만 그린다.
 */
const SCENES = [
  { label: "Circle 교환", summary: "지분 → USDC", note: "지분을 Circle에 전달하고 USDC를 받습니다. 사는 쪽이 Circle인 유통시장 교환이며 펀드 자체의 환매가 아닙니다." },
  { label: "UniswapX 거래", summary: "자격 확인 + 허용된 상대방", note: "Securitize의 자격 확인과 허용된 견적 상대방을 통해 지분을 매매합니다. 공개된 아무 풀에 누구나 참여하는 구조로 요약하면 조건을 놓칩니다. 원자적 전달만으로 NAV에 매수자가 항상 있다고 결론내릴 수 없습니다." },
  { label: "은행까지", summary: "USDC → 은행 달러는 별도 사건", note: "가상 사례의 A가 받은 10.15 USDC를 은행 달러로 바꾸려면 상환 경로를 다시 거칩니다. 상환 요청에 따른 소각과 등록 은행 계좌 송금, 수수료가 따르므로 은행에 들어올 금액과 시각을 적지 않았습니다." },
  { label: "펀드 환매와 구분", summary: "위 두 매매는 환매가 아님", note: "펀드 자체의 환매는 앞의 두 매매와 다른 경로입니다. 이 절의 발표들은 회수 경로를 늘릴 뿐이며, 24시간 거래 가능성이 모든 은행 지급을 즉시 끝낸다는 뜻은 아닙니다." },
] as const;

const ROUTES = [
  { y: 52, via: ["Circle에 전달", "2024 발표"], to: "USDC", scene: 0 },
  { y: 130, via: ["Securitize 자격 확인 +", "허용된 견적 상대방 · 2026"], to: "결제 대금", scene: 1 },
  { y: 196, via: ["펀드의 정해진", "환매 절차"], to: "환매 대가", scene: 3 },
] as const;

const ON = "#2563eb";
const OFF = "#64748b";

function Node({ x, y, w, lines, on }: { x: number; y: number; w: number; lines: readonly string[]; on: boolean }) {
  const first = y + 4 - ((lines.length - 1) * 15) / 2;
  return (
    <g opacity={on ? 1 : 0.55}>
      <rect x={x} y={y - 18} width={w} height={36} rx={8} fill={on ? ON : "none"} fillOpacity={on ? 0.08 : undefined} stroke={on ? ON : OFF} strokeWidth={on ? 1.25 : 1} />
      {lines.map((line, index) => (
        <text key={line} x={x + w / 2} y={first + index * 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={on ? ON : OFF}>{line}</text>
      ))}
    </g>
  );
}

function Arrow({ x1, x2, y, on, dashed }: { x1: number; x2: number; y: number; on: boolean; dashed?: boolean }) {
  const color = on ? ON : OFF;
  return (
    <g opacity={on ? 1 : 0.55}>
      <line x1={x1} x2={x2 - 5} y1={y} y2={y} stroke={color} strokeWidth={on ? 1.25 : 1} strokeDasharray={dashed ? "3 3" : undefined} />
      <path d={`M${x2} ${y}l-6 -4v8z`} fill={color} />
    </g>
  );
}

export default function ExitRoutesViz() {
  return (
    <SceneShell
      eyebrow="회수 경로"
      title="지분에서 은행 달러까지는 여러 경로와 별도 구간으로 나뉩니다"
      description="한 줄이 지분에서 나가는 경로 하나이고 화살표 위가 거치는 조건입니다. USDC는 7절의 결제 토큰 자리에 놓이는 토큰이며, 점선은 앞 교환과 별개인 다음 구간입니다. 은행까지 이은 것은 글이 그 절차를 설명한 USDC뿐입니다."
      ariaLabel="Circle 교환, UniswapX 거래, USDC 상환, 펀드 환매 경로"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 226" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <g opacity={active === 2 ? 0.55 : 1}>
            <rect x={6} y={14} width={54} height={204} rx={8} fill="none" stroke={active === 2 ? OFF : ON} strokeWidth={active === 2 ? 1 : 1.25} />
            <text x={33} y={112} textAnchor="middle" fontSize={12} fontWeight={700} fill={active === 2 ? OFF : ON}>BUIDL</text>
            <text x={33} y={127} textAnchor="middle" fontSize={12} fontWeight={700} fill={active === 2 ? OFF : ON}>지분</text>
          </g>
          {ROUTES.map((route) => {
            const on = route.scene === active;
            const nodeOn = on || (route.scene === 0 && active === 2);
            return (
              <g key={route.to}>
                <Arrow x1={60} x2={204} y={route.y} on={on} />
                {route.via.map((line, index) => (
                  <text key={line} x={68} y={route.y - 22 + index * 14} fontSize={11.5} fontWeight={on ? 700 : 400} fill={on ? ON : OFF} opacity={on ? 1 : 0.7}>{line}</text>
                ))}
                <Node x={206} y={route.y} w={68} lines={[route.to]} on={nodeOn} />
              </g>
            );
          })}
          <Arrow x1={276} x2={298} y={52} on={active === 2} dashed />
          <Node x={300} y={52} w={54} lines={["은행", "달러"]} on={active === 2} />
          <text x={354} y={86} textAnchor="end" fontSize={11.5} fontWeight={active === 2 ? 700 : 400} fill={active === 2 ? ON : OFF} opacity={active === 2 ? 1 : 0.7}>별도 사건: 상환 요청 · 소각 · 수수료</text>
        </svg>
      )}
    />
  );
}
