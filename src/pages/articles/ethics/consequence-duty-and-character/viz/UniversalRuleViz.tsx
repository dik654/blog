import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — "비용이 기대 손실 이상일 때 알려진 알레르기 정보를 숨겨도 된다"를 모두가 쓰는 규칙으로 시험한다.
 * 0.02 × 5000만 = 100만, 0.005 × 5000만 = 25만. 회수 비용 100만은 둘 다 이상이다.
 * 판매자 6곳은 그림용 가정이다.
 */
const INK = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const W = 360;
const H = 220;
const BAR_PER_MAN = 1.02; // 100만원 막대가 102 단위
const SELLERS = [0, 1, 2, 3, 4, 5];

const SCENES = [
  { label: "규칙을 도시락에 넣어 봅니다", summary: "회수 100만원 ≥ 기대 손실", note: "확률이 2%면 기대 손실은 100만원, 0.5%면 25만원입니다. 회수 비용 100만원은 두 경우 모두 기대 손실 이상이므로, 이 규칙대로라면 숨겨도 된다는 답이 나옵니다." },
  { label: "모든 판매자가 같은 규칙을 씁니다", summary: "이 회사 → 모든 판매자", note: "의무 장부는 이 규칙을 모든 판매자가 써도 되는지 묻습니다. 그림의 판매자 6곳은 ‘모두’를 나타내려는 가정입니다." },
  { label: "규칙이 공개되면", summary: "성분 표시를 믿을 수 없음", note: "그런 규칙이 공개되면 고객은 어느 판매자의 성분 표시도 믿을 수 없습니다. 규칙이 기대던 표시 약속이 규칙 때문에 흔들립니다." },
  { label: "고객을 고를 수 있는 사람으로 대하려면", summary: "즉시 정보와 선택지", note: "회사만 알고 있던 누락을 바로 알려야 고객이 자기 위험을 고를 수 있습니다. 비용 계산의 결과와 상관없이 이 장부가 묻는 몫입니다." },
] as const;

function Sellers({ doubt }: { doubt: boolean }) {
  return (
    <>
      {SELLERS.map((i) => {
        const x = 4 + i * 60;
        return (
          <g key={i}>
            <rect x={x} y={66} width={52} height={50} rx={6} fill="none" stroke={doubt ? RED : AMBER} strokeWidth={1} />
            <text x={x + 26} y={87} textAnchor="middle" fontSize={11} fontWeight={700} className="fill-foreground">판매자</text>
            <text x={x + 26} y={105} textAnchor="middle" fontSize={11} fill={doubt ? RED : AMBER}>{doubt ? "표시 ?" : "규칙 씀"}</text>
          </g>
        );
      })}
    </>
  );
}

export default function UniversalRuleViz() {
  return (
    <SceneShell
      eyebrow="규칙을 모두에게 넓히기"
      title="숨겨도 된다는 규칙을 모두가 쓰면 표시는 어떻게 될까요"
      description="3절의 가정 수치(회수 100만원, 발생 시 5000만원)를 쓰고, 앞 문단의 확률 2%와 0.5%를 대입합니다. 기대 손실은 확률과 피해액을 곱한 평균값입니다."
      ariaLabel="정보를 숨겨도 된다는 규칙을 모든 판매자에게 넓혔을 때 표시 약속이 흔들리는 순서"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={4} y={4} width={352} height={48} rx={6} fill="none" stroke={active >= 2 ? RED : INK} strokeWidth={1} strokeDasharray={active >= 2 ? "4 3" : undefined} />
          <text x={180} y={24} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">“비용이 기대 손실 이상일 때</text>
          <text x={180} y={42} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">알려진 알레르기 정보를 숨겨도 된다”</text>
          {active === 0 && (
            <>
              {[
                { y: 72, name: "회수 비용", man: 100, text: "100만원", color: INK },
                { y: 110, name: "기대 손실 2%", man: 100, text: "100만원 · 해당", color: AMBER },
                { y: 148, name: "기대 손실 0.5%", man: 25, text: "25만원 · 해당", color: AMBER },
              ].map((row) => (
                <g key={row.name}>
                  <text x={4} y={row.y + 12} fontSize={11} fontWeight={700} className="fill-foreground">{row.name}</text>
                  <rect x={100} y={row.y} width={row.man * BAR_PER_MAN} height={16} rx={2} fill={row.color} />
                  <text x={row.man === 100 ? 208 : 130} y={row.y + 12} fontSize={11} fill={INK}>{row.text}</text>
                </g>
              ))}
              <text x={180} y={200} textAnchor="middle" fontSize={11} fill={INK}>두 경우 모두 규칙의 조건에 들어갑니다</text>
            </>
          )}
          {active === 1 && (
            <>
              <Sellers doubt={false} />
              <text x={180} y={150} textAnchor="middle" fontSize={12} fill={INK}>모든 판매자가 이 규칙을 써도 될까요?</text>
              <text x={180} y={170} textAnchor="middle" fontSize={11} fill={INK}>(6곳은 ‘모두’를 나타내는 가정)</text>
            </>
          )}
          {active === 2 && (
            <>
              <Sellers doubt />
              {SELLERS.map((i) => (
                <line key={i} x1={30 + i * 60} x2={180} y1={116} y2={158} stroke={RED} strokeWidth={1} strokeDasharray="3 3" />
              ))}
              <rect x={80} y={158} width={200} height={50} rx={6} fill={RED} fillOpacity={0.08} stroke={RED} strokeWidth={1} />
              <text x={180} y={179} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">고객</text>
              <text x={180} y={197} textAnchor="middle" fontSize={11} fill={RED}>성분 표시를 믿을 수 없음</text>
            </>
          )}
          {active === 3 && (
            <>
              <rect x={4} y={92} width={90} height={60} rx={6} fill="none" stroke={BLUE} strokeWidth={1} />
              <text x={49} y={118} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">회사</text>
              <text x={49} y={136} textAnchor="middle" fontSize={11} fill={INK}>누락을 앎</text>
              <line x1={94} x2={232} y1={122} y2={122} stroke={BLUE} strokeWidth={1.25} />
              <path d="M226 117 L233 122 L226 127" fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={162} y={112} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>즉시 정보·선택지</text>
              <rect x={236} y={92} width={120} height={60} rx={6} fill={BLUE} fillOpacity={0.08} stroke={BLUE} strokeWidth={1} />
              <text x={296} y={118} textAnchor="middle" fontSize={12} fontWeight={700} className="fill-foreground">고객</text>
              <text x={296} y={136} textAnchor="middle" fontSize={11} fill={INK}>스스로 고를 수 있음</text>
              <text x={180} y={190} textAnchor="middle" fontSize={11} fill={INK}>침묵하면 고객은 자기 위험을 선택할 기회를 잃습니다</text>
            </>
          )}
        </svg>
      )}
    />
  );
}
