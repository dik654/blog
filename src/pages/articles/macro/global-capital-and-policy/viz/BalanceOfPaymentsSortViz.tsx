import SceneShell from "./SceneShell";

/** 본문 대응: #names — 국제수지 장부의 칸과 거래 흐름 바깥의 평가 차이. 이 글의 회사 사례를 옮겨 분류한다. */
const SCENES = [
  { label: "장부의 칸", summary: "거래 장부의 두 칸 · 바깥의 평가 차이", note: "국제수지는 해외와 오간 거래를 묶은 장부입니다. 오른쪽 점선은 거래 흐름과 구분해 보는 평가 차이입니다. 칸의 크기는 금액과 무관합니다." },
  { label: "빌리고 갚는 돈", summary: "1억 달러 → 금융계정", note: "외국에서 빌린 1억 달러는 대외 부채의 거래입니다. 그래서 대외 금융자산과 부채의 거래를 적는 금융계정 쪽입니다." },
  { label: "팔고 이자 내는 돈", summary: "수출대금 · 이자 → 경상수지", note: "4절처럼 수출대금을 받는다면 상품 거래이고, 연 이자는 빌려준 쪽의 소득이 되는 거래입니다. 둘 다 상품·서비스·소득 등을 적는 경상수지 쪽입니다." },
  { label: "오간 돈이 없는 변화", summary: "환산 +200억 → 거래 흐름과 구분", note: "1000억 원이 1200억 원으로 보이는 변화에는 새로 오간 돈이 없습니다. 환율 때문에 기존 금액의 평가가 달라진 것이라 거래 흐름과 구분합니다." },
] as const;

function Chip({ x, y, width, label, shown, color }: { x: number; y: number; width: number; label: string; shown: boolean; color: string }) {
  return (
    <g opacity={shown ? 1 : 0} className="transition-opacity duration-300 motion-reduce:transition-none">
      <rect x={x} y={y} width={width} height={22} rx={4} fill={color} fillOpacity={0.14} stroke={color} strokeWidth={1} />
      <text x={x + width / 2} y={y + 15} textAnchor="middle" fontSize={10.5} fontWeight={700} className="fill-foreground">{label}</text>
    </g>
  );
}

export default function BalanceOfPaymentsSortViz() {
  return (
    <SceneShell
      eyebrow="거래와 평가"
      title="같은 회사의 돈 이야기가 장부의 서로 다른 칸에 들어갑니다"
      description="이 글의 가정 사례를 본문의 정의에 맞춰 옮겨 본 분류입니다. 실제 통계 작성의 세부 규칙은 다루지 않습니다."
      ariaLabel="차입은 금융계정, 수출대금과 이자는 경상수지, 환산 차이는 거래 흐름과 구분"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={6} y={6} width={246} height={202} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
          <text x={16} y={23} fontSize={11} fontWeight={700} className="fill-foreground">국제수지 · 해외와 오간 거래</text>
          <rect x={16} y={32} width={226} height={96} rx={6} fill="#2563eb" fillOpacity={active === 2 ? 0.1 : 0} stroke="#2563eb" strokeWidth={1} />
          <text x={26} y={49} fontSize={11} fontWeight={700} fill="#2563eb">경상수지</text>
          <text x={80} y={49} fontSize={9.5} fill="#64748b">상품·서비스·소득 등</text>
          <Chip x={26} y={56} width={206} label="수출대금 1억 달러 (받는다면)" shown={active >= 2} color="#2563eb" />
          <Chip x={26} y={84} width={206} label="연 이자 600만 달러" shown={active >= 2} color="#2563eb" />
          <rect x={16} y={136} width={226} height={64} rx={6} fill="#16a34a" fillOpacity={active === 1 ? 0.1 : 0} stroke="#16a34a" strokeWidth={1} />
          <text x={26} y={153} fontSize={11} fontWeight={700} fill="#15803d">금융계정</text>
          <text x={80} y={153} fontSize={9.5} fill="#64748b">대외 금융자산·부채</text>
          <Chip x={26} y={162} width={206} label="1억 달러 차입" shown={active >= 1} color="#16a34a" />
          <rect x={260} y={6} width={94} height={202} rx={8} fill="#d97706" fillOpacity={active === 3 ? 0.1 : 0} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          <text x={307} y={23} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">평가 차이</text>
          <text x={307} y={38} textAnchor="middle" fontSize={9.5} fill="#64748b">거래 흐름과 구분</text>
          <g opacity={active >= 3 ? 1 : 0} className="transition-opacity duration-300 motion-reduce:transition-none">
            <text x={307} y={88} textAnchor="middle" fontSize={10.5} className="fill-foreground">원금 환산</text>
            <text x={307} y={106} textAnchor="middle" fontSize={10.5} className="fill-foreground">1000억 →</text>
            <text x={307} y={122} textAnchor="middle" fontSize={10.5} className="fill-foreground">1200억</text>
            <text x={307} y={142} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">+200억</text>
          </g>
        </svg>
      )}
    />
  );
}
