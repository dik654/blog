import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need — 절수하면 전력·약품 일부만 줄고 관과 인력 비용은 같은 비율로 줄지 않는다.
 * 사용한 양만큼만 받는 수입은 사용량과 함께 줄어 먼저 모자랄 수 있다. 본문에 수치가 없어 눈금을 두지 않는다.
 */
const LEFT = 40;
const NOW = 300;
const AFTER = 170;
const BASE = 180;
const FIXED_Y = 100;
const MEET_Y = 60;

const costY = (x: number) => FIXED_Y - (FIXED_Y - MEET_Y) * ((x - LEFT) / (NOW - LEFT));
const revenueY = (x: number) => BASE - (BASE - MEET_Y) * ((x - LEFT) / (NOW - LEFT));

const SLATE = "#64748b";
const BLUE = "#2563eb";
const RED = "#dc2626";

const SCENES = [
  { label: "비용의 두 층", summary: "일부만 사용량을 따라감", note: "이미 설치한 관은 계속 교체하고 수리해야 하고 인력도 같은 비율로 줄지 않습니다. 사용량을 따라 줄어드는 것은 전력과 약품 일부입니다." },
  { label: "수입은 비례", summary: "사용한 양만큼만 받는 구조", note: "사용한 양만큼만 받으면 수입선은 사용량이 0일 때 0에서 출발합니다. 지금 사용량에서 두 선이 만나도록 그렸습니다(가정)." },
  { label: "집들이 물을 아끼면", summary: "수입이 먼저 줄어들 수 있음", note: "왼쪽으로 옮기면 비용은 조금, 수입은 더 많이 내려갑니다. 빨간 구간이 모자라는 몫입니다. 선의 기울기와 높이는 모양만 보이려는 가정이며 실제 크기를 뜻하지 않습니다." },
] as const satisfies readonly { label: string; summary: string; note: string }[];

export default function ConservationGapViz() {
  return (
    <SceneShell
      eyebrow="사용량과 돈"
      title="물을 아껴도 묻힌 관의 비용은 남습니다"
      description="가로는 사용량, 세로는 돈입니다. 본문에 수치가 없어 눈금 없이 모양만 그린 가정입니다."
      ariaLabel="사용량이 줄 때 비용과 사용량 비례 수입이 줄어드는 정도 비교"
      scenes={SCENES}
      render={(index) => (
        <svg viewBox="0 0 360 206" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
          <rect x={LEFT} y={FIXED_Y} width={NOW - LEFT} height={BASE - FIXED_Y} fill="#94a3b8" opacity={0.18} />
          <text x={NOW - 6} y={BASE - 22} textAnchor="end" fontSize={11} fill={SLATE}>관·인력:</text>
          <text x={NOW - 6} y={BASE - 8} textAnchor="end" fontSize={11} fill={SLATE}>같은 비율로 줄지 않음</text>
          <line x1={LEFT} x2={NOW} y1={costY(LEFT)} y2={costY(NOW)} stroke={SLATE} strokeWidth={1.25} />
          <text x={LEFT + 4} y={72} fontSize={11} fontWeight={700} fill={SLATE}>비용: 전력·약품 일부만 줄어듦</text>
          {index >= 1 && (
            <>
              <line x1={LEFT} x2={NOW} y1={BASE} y2={revenueY(NOW)} stroke={BLUE} strokeWidth={1.25} />
              <text x={198} y={146} fontSize={11} fontWeight={700} fill={BLUE}>수입: 사용량에 비례</text>
              <line x1={NOW} x2={NOW} y1={MEET_Y} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={NOW} y={196} textAnchor="middle" fontSize={11} fill="currentColor">지금</text>
              <circle cx={NOW} cy={MEET_Y} r={3} fill={BLUE} />
            </>
          )}
          {index === 2 && (
            <>
              <line x1={AFTER} x2={AFTER} y1={revenueY(AFTER)} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              <text x={AFTER} y={196} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">절수 뒤</text>
              <line x1={AFTER} x2={AFTER} y1={costY(AFTER)} y2={revenueY(AFTER)} stroke={RED} strokeWidth={1.25} />
              <circle cx={AFTER} cy={costY(AFTER)} r={3} fill={SLATE} />
              <circle cx={AFTER} cy={revenueY(AFTER)} r={3} fill={BLUE} />
              <text x={AFTER - 6} y={(costY(AFTER) + revenueY(AFTER)) / 2 + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={RED}>모자람</text>
            </>
          )}
          <line x1={LEFT} x2={344} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <line x1={LEFT} x2={LEFT} y1={24} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          <text x={LEFT} y={196} fontSize={11} fill={SLATE}>사용량 →</text>
          <text x={LEFT} y={18} textAnchor="middle" fontSize={11} fill={SLATE}>돈</text>
        </svg>
      )}
    />
  );
}
