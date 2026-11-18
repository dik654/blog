import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 임금 100, 운영비·다른 급여 없음(단순 가정).
 * 걷는 돈 = 노동자 수 × 1인 보험료, 주는 돈 = 은퇴자 수 × 1인 급여. 부과방식이라 두 넓이가 같다.
 * 100 × 12 = 1,200 = 25 × 48 / 80 × 12 = 960 = 32 × 30 / 80 × 19.2 = 1,536 = 32 × 48.
 * #comparison의 항등식: 보험료율 = 48% × 32 ÷ 80 = 19.2%.
 * 가로 1.5px = 1명, 세로 2.5px = 임금 1.
 */
const PX_PERSON = 1.5;
const PX_MONEY = 2.5;
const BASE_Y = 178;
const LEFT_X = 14;
const RIGHT_X = 236;

const SCENES = [
  { label: "100명이 12씩, 25명에게 48씩", summary: "100 × 12 = 1,200 = 25 × 48", workers: 100, pay: 12, retirees: 25, benefit: 48, ghost: null, note: "임금이 100이니 보험료율 12%는 한 사람이 12를 낸다는 뜻입니다. 걷은 1,200을 은퇴자 25명에게 똑같이 나누면 한 사람 48, 현재 임금의 48%(설명용 대체율)입니다. 운영비와 다른 급여는 없다고 가정합니다." },
  { label: "80명과 32명, 보험료율은 그대로", summary: "80 × 12 = 960 = 32 × 30", workers: 80, pay: 12, retirees: 32, benefit: 30, ghost: { workers: 100, pay: 12, retirees: 25, benefit: 48 }, note: "노동자가 80명으로 줄어 왼쪽 직사각형이 좁아지고, 은퇴자가 32명으로 늘어 오른쪽은 넓어집니다. 같은 960을 더 많은 사람에게 나누니 한 사람 급여는 30으로 내려갑니다. 점선은 첫 장부입니다." },
  { label: "급여 48을 지키려면", summary: "32 × 48 = 1,536 → 1인 19.2", workers: 80, pay: 19.2, retirees: 32, benefit: 48, ghost: { workers: 80, pay: 12, retirees: 32, benefit: 30 }, note: "오른쪽을 32 × 48 = 1,536으로 다시 키우면 왼쪽도 같은 넓이여야 합니다. 임금총액 8,000(80명 × 100)으로 나누면 보험료율은 19.2%입니다. 실제 제도는 이 부담을 세금·기금·급여공식으로 나눕니다." },
  { label: "같은 넓이를 한 줄로", summary: "48% × 32 ÷ 80 = 19.2%", workers: 80, pay: 19.2, retirees: 32, benefit: 48, ghost: null, note: "두 직사각형의 넓이가 같다는 조건을 보험료율에 대해 풀면 '보험료율 = 대체율 × 수급자 수 ÷ 가입자 수'가 됩니다. 9절이 OECD 장에서 옮긴 부과식 항등식이 이 계산입니다. 80명·32명·19.2%는 원리를 보이는 가정입니다." },
] as const;

const fmt = (value: number) => value.toLocaleString("en-US", { maximumFractionDigits: 1 });

function Block({ x, people, perHead, color, ghost }: { x: number; people: number; perHead: number; color: string; ghost?: { people: number; perHead: number } | null }) {
  const width = people * PX_PERSON;
  const height = perHead * PX_MONEY;
  return (
    <g>
      {ghost && (
        <rect x={x} y={BASE_Y - ghost.perHead * PX_MONEY} width={ghost.people * PX_PERSON} height={ghost.perHead * PX_MONEY} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      )}
      <rect x={x} y={BASE_Y - height} width={width} height={height} fill={color} fillOpacity={0.75} stroke={color} strokeWidth={1} />
    </g>
  );
}

export default function PaygLedgerViz() {
  return (
    <SceneShell
      eyebrow="부과방식 장부"
      title="걷는 직사각형과 주는 직사각형은 넓이가 같아야 합니다"
      description="왼쪽은 노동자, 오른쪽은 은퇴자입니다. 가로가 사람 수, 세로가 한 사람이 내거나 받는 돈(임금 100 기준)이라 넓이가 그해 걷거나 주는 총액입니다. 부과방식은 그해 걷은 돈으로 그해 급여를 주므로 두 넓이가 같습니다."
      ariaLabel="노동자 수와 보험료, 은퇴자 수와 급여의 곱이 같아지는 부과방식 장부의 세 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const total = scene.workers * scene.pay;
        const leftW = scene.workers * PX_PERSON;
        const rightW = scene.retirees * PX_PERSON;
        const leftTop = BASE_Y - scene.pay * PX_MONEY;
        const rightTop = BASE_Y - scene.benefit * PX_MONEY;
        const formula = active === SCENES.length - 1;
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Block x={LEFT_X} people={scene.workers} perHead={scene.pay} color="#2563eb" ghost={scene.ghost ? { people: scene.ghost.workers, perHead: scene.ghost.pay } : null} />
            <Block x={RIGHT_X} people={scene.retirees} perHead={scene.benefit} color="#16a34a" ghost={scene.ghost ? { people: scene.ghost.retirees, perHead: scene.ghost.benefit } : null} />
            <text x={LEFT_X} y={leftTop - 22} fontSize={13} fontWeight={700} fill="#2563eb">걷는 돈 {fmt(total)}</text>
            <text x={LEFT_X} y={leftTop - 7} fontSize={12} fill="#64748b">1인 보험료 {fmt(scene.pay)} ({fmt(scene.pay)}%)</text>
            <text x={RIGHT_X + rightW} y={rightTop - 22} textAnchor="end" fontSize={13} fontWeight={700} fill="#16a34a">주는 돈 {fmt(total)}</text>
            <text x={RIGHT_X + rightW} y={rightTop - 7} textAnchor="end" fontSize={12} fill="#64748b">1인 급여 {fmt(scene.benefit)}</text>
            <line x1={6} x2={354} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT_X + leftW / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fill="#475569">노동자 {scene.workers}명</text>
            <text x={RIGHT_X + rightW / 2} y={BASE_Y + 16} textAnchor="middle" fontSize={12} fill="#475569">은퇴자 {scene.retirees}명</text>
            {formula && (
              <text x={180} y={BASE_Y + 33} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">
                80명 × 임금 100 × 보험료율 = 32명 × 48 → 19.2%
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
