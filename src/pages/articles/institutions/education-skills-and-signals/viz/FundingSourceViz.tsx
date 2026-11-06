import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 학비 1,000만 원을 처음 나온 곳(정부 400·가계 600)과 학교 수입(1,000)으로 나눠 기록합니다.
 * 칸 하나 = 100만 원. 400+600=1,000, 잘못 더하면 1,000+400=1,400. 금액은 글의 가정입니다.
 */
const SCENES = [
  { label: "학교에서 본 돈", summary: "학교 수입 1,000만 원", note: "학습자가 학비 1천만 원을 냅니다. 학교 쪽 장부에는 1천만 원이 들어옵니다. 다만 그 돈이 전부 가계에서 처음 나왔는지는 별도 질문입니다." },
  { label: "처음 나온 곳", summary: "정부 400 + 가계 600", note: "학비 중 정부 장학금이 400만 원이면 초기 재원은 정부 400·가계 600으로 나뉩니다. 학교 수입은 1천만 원으로 같고, 개인의 직접 부담 계산은 그만큼 바뀝니다." },
  { label: "두 번 세지 않습니다", summary: "합계는 1,000만 원", note: "장학금 400만 원은 학교 수입 1천만 원 안에 이미 들어 있습니다. 학교 수입과 정부 지원을 따로 더하면 같은 금액을 두 번 셉니다." },
  { label: "포기 소득은 어디에", summary: "학교 수입이 아님", note: "포기한 소득 2천만 원은 학습자의 기회비용이지 학교에 지급된 돈이 아닙니다. 학교 수입에 넣지 않고 따로 적습니다." },
] as const;

const CELL_H = 15;
const STACK_Y = 34;
const TEN = Array.from({ length: 10 }, (_, i) => i);
const GOV_COUNT = 4;
const GOV = "#2563eb";
const HOME = "#d97706";

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = (spread: number) => `${x2 - 6 * Math.cos(angle + spread)} ${y2 - 6 * Math.sin(angle + spread)}`;
  return (
    <g stroke="#94a3b8" strokeWidth={1} fill="none">
      <line x1={x1} y1={y1} x2={x2} y2={y2} />
      <path d={`M${head(0.6)}L${x2} ${y2}L${head(-0.6)}`} />
    </g>
  );
}

export default function FundingSourceViz() {
  return (
    <SceneShell
      eyebrow="초기 재원과 학교 수입"
      title="학비 1천만 원은 처음 나온 곳과 들어간 곳을 따로 적습니다"
      description="칸 하나가 100만 원이고 금액은 글이 놓은 값입니다(가정). 초기 재원은 돈이 처음 나온 곳, 정부의 민간 이전은 정부가 장학금처럼 가계 같은 민간에 돈을 넘기는 일입니다. OECD는 이 이전 전후를 구분합니다."
      ariaLabel="학비 1000만원의 초기 재원 정부 400 가계 600과 학교 수입 1000, 학교 밖의 포기 소득 2000"
      scenes={SCENES}
      render={(index) => {
        const traced = index >= 1;
        const doubled = index === 2;
        const color = (i: number) => (i < GOV_COUNT ? GOV : HOME);
        return (
          <svg viewBox="0 0 360 240" className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <text x={2} y={14} fontSize={11} fontWeight={700} fill="currentColor">처음 나온 곳</text>
            <text x={179} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">학습자</text>
            <text x={318} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">학교 수입</text>

            {traced ? (
              <>
                {TEN.map((i) => (
                  <rect key={i} x={6} y={STACK_Y + i * CELL_H + (i < GOV_COUNT ? 0 : 8)} width={34} height={CELL_H - 2} rx={2} fill={color(i)} fillOpacity={0.75} stroke={doubled && i < GOV_COUNT ? "#dc2626" : "none"} strokeWidth={1.25} />
                ))}
                <text x={46} y={STACK_Y + 26} fontSize={11} fontWeight={700} fill="currentColor">정부 400</text>
                <text x={46} y={STACK_Y + 40} fontSize={10} fill="#64748b">장학금</text>
                <text x={46} y={STACK_Y + 108} fontSize={11} fontWeight={700} fill="currentColor">가계 600</text>
                <Arrow x1={104} y1={STACK_Y + 30} x2={156} y2={STACK_Y + 50} />
                <Arrow x1={104} y1={STACK_Y + 104} x2={156} y2={STACK_Y + 94} />
              </>
            ) : (
              <>
                <rect x={6} y={STACK_Y} width={88} height={150} rx={8} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
                <text x={50} y={STACK_Y + 72} textAnchor="middle" fontSize={22} fontWeight={700} fill="#94a3b8">?</text>
                <text x={50} y={STACK_Y + 94} textAnchor="middle" fontSize={11} fill="#64748b">아직 모름</text>
              </>
            )}

            {TEN.map((i) => (
              <rect key={i} x={162} y={STACK_Y + i * CELL_H} width={34} height={CELL_H - 2} rx={2} fill={traced ? color(i) : "#64748b"} fillOpacity={0.75} />
            ))}
            <Arrow x1={202} y1={STACK_Y + 75} x2={294} y2={STACK_Y + 75} />
            <text x={247} y={STACK_Y + 67} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">학비 1,000</text>
            {TEN.map((i) => (
              <rect key={i} x={301} y={STACK_Y + i * CELL_H} width={34} height={CELL_H - 2} rx={2} fill={traced ? color(i) : "#64748b"} fillOpacity={0.75} stroke={doubled && i < GOV_COUNT ? "#dc2626" : "none"} strokeWidth={1.25} />
            ))}

            {doubled && (
              <g>
                <text x={180} y={207} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">× 학교 수입 1,000 + 장학금 400 = 1,400</text>
                <text x={180} y={225} textAnchor="middle" fontSize={11} fill="currentColor">위쪽 네 칸(빨간 테두리), 같은 400을 두 번 셌습니다</text>
              </g>
            )}
            {index === 3 && (
              <g>
                <rect x={6} y={194} width={348} height={40} rx={8} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
                <text x={180} y={219} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">따로 적음: 포기 소득 2,000 (학교로 가지 않음)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
