import SceneShell from "./SceneShell";

/**
 * 본문 대응: #semi-presidential — 대통령·총리·의회 사이의 줄을 따로 그린다.
 * 같은 세 기관에 의석 분포만 바꾸면 총리 쪽 편이 바뀌고(160·120·20 → 140·140·20),
 * 그 위에 프랑스 조문의 줄, 나라마다 조문에서 찾아야 할 줄을 올린다.
 */
const SCENES = [
  { label: "세 기관", summary: "대통령 고정 임기 · 총리는 의회에 책임", note: "대통령은 임기로, 총리·내각은 의회 신임으로 자리를 지킵니다. 그림의 선은 총리가 의회에 책임지는 관계 하나만 먼저 그린 것입니다." },
  { label: "가당이 과반일 때", summary: "160·120·20 → 방향이 겹칠 수 있음", note: "대통령의 정당이 의회 과반이면 대통령과 총리의 정치적 방향이 겹칠 수 있습니다. 대통령이 언제나 모든 정책을 법적으로 단독 지휘한다는 뜻은 아니며, 공식 권한과 정당 다수의 통제는 구별해야 합니다." },
  { label: "나당·다당이 지탱할 때", summary: "140 + 20 = 160 → 동거정부 가능", note: "동거정부는 대통령과 반대편 총리가 함께 일하는 상태입니다. 나당·다당 160석이 정부를 지탱하면 생길 수 있고, 대통령은 남지만 의회 책임이 있는 정부는 다수파를 거스를 수 없습니다." },
  { label: "프랑스의 줄", summary: "제8·12·20·49·50조", note: "프랑스 제5공화국 헌법에서 대통령은 총리를 임명하고 국회를 해산할 수 있습니다. 하원이 불신임안을 가결하거나 정부 프로그램을 승인하지 않으면 총리는 정부의 사임을 대통령에게 제출해야 합니다." },
  { label: "조문에서 찾을 줄", summary: "물음표는 나라마다 다름", note: "대통령·의회 중 누가 정부를 해임할 수 있는지에 따라 하위 유형이 달라집니다. 동거정부에서 외교·국방과 국내 정책이 나뉘는 방식도 국가마다 같다고 단정할 수 없습니다." },
] as const;

const INDIGO = "#4f46e5";
const AMBER = "#d97706";
const GREEN = "#059669";
const SLATE = "#64748b";
const BAR_X = 20;
const BAR_W = 320;

const seatX = (seats: number) => BAR_X + (seats / 300) * BAR_W;

function Arrow({ d, color, dashed, id }: { d: string; color: string; dashed?: boolean; id: string }) {
  return (
    <>
      <defs>
        <marker id={id} markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
          <path d="M0 0 L7 3.5 L0 7 Z" fill={color} />
        </marker>
      </defs>
      <path d={d} fill="none" stroke={color} strokeWidth="1.25" strokeDasharray={dashed ? "4 3" : undefined} markerEnd={`url(#${id})`} />
    </>
  );
}

export default function CohabitationViz() {
  return (
    <SceneShell
      eyebrow="이중 행정부"
      title="대통령과 총리를 잇는 줄은 조문과 의석이 함께 정합니다"
      description="가상의 가당 대통령을 고정하고 의석 분포와 조문만 바꿉니다. 붉은 선은 과반 151석입니다."
      ariaLabel="대통령, 총리와 내각, 의회 사이의 임명, 책임, 해산 관계와 의석 분포에 따른 동거정부"
      scenes={SCENES}
      render={(active) => {
        const seats = active === 1 ? [160, 120, 20] : [140, 140, 20];
        const pmColor = active === 0 ? SLATE : active === 1 ? INDIGO : AMBER;
        const pmSide = active === 0 ? "의회 다수파가 지탱" : active === 1 ? "가당 다수파가 지탱" : "나당·다당이 지탱";
        const french = active === 3;
        const open = active === 4;
        /* 총리를 지탱하는 의석 구간. 신임 선은 그 구간에서 나옵니다. */
        const bloc = active === 0 ? null : active === 1 ? [0, 160] : [140, 300];
        return (
          <svg viewBox="0 0 360 250" className="mx-auto block w-full max-w-[24rem]" role="img" aria-label={SCENES[active].label}>
            <rect x="20" y="10" width="130" height="58" rx="8" fill={`${INDIGO}14`} stroke={INDIGO} strokeWidth="1" />
            <text x="85" y="34" textAnchor="middle" fontSize="13" fontWeight="700" fill={INDIGO}>가당 대통령</text>
            <text x="85" y="53" textAnchor="middle" fontSize="11" fill="currentColor">고정 임기</text>

            <rect x="210" y="10" width="130" height="58" rx="8" fill={`${pmColor}14`} stroke={pmColor} strokeWidth="1" />
            <text x="275" y="34" textAnchor="middle" fontSize="13" fontWeight="700" fill={pmColor}>총리·내각</text>
            <text x="275" y="53" textAnchor="middle" fontSize="11" fill="currentColor">{pmSide}</text>

            {bloc && <line x1={seatX(bloc[0])} y1="186" x2={seatX(bloc[1])} y2="186" stroke={pmColor} strokeWidth="1.25" />}
            <Arrow id="cohab-confidence" d={active === 1 ? `M${seatX(80)} 186 L${seatX(80)} 156 L275 156 L275 70` : "M275 186 L275 70"} color={pmColor} />
            <text x="270" y="130" textAnchor="end" fontSize="11" fill="currentColor">신임·책임</text>

            {french && (
              <>
                <Arrow id="cohab-appoint" d="M150 30 L208 30" color={INDIGO} />
                <text x="180" y="23" textAnchor="middle" fontSize="11" fill={INDIGO}>임명</text>
                <Arrow id="cohab-resign" d="M210 54 L152 54" color={pmColor} />
                <text x="180" y="82" textAnchor="middle" fontSize="11" fill={pmColor}>불신임 시 사임 제출</text>
                <Arrow id="cohab-dissolve" d="M85 68 L85 186" color={INDIGO} />
                <text x="91" y="130" fontSize="11" fill={INDIGO}>의회 해산</text>
              </>
            )}
            {open && (
              <>
                <Arrow id="cohab-q1" d="M150 40 L208 40" color={SLATE} dashed />
                <text x="180" y="32" textAnchor="middle" fontSize="12" fontWeight="700" fill={SLATE}>해임?</text>
                <Arrow id="cohab-q2" d="M85 68 L85 186" color={SLATE} dashed />
                <text x="91" y="130" fontSize="12" fontWeight="700" fill={SLATE}>의회 해산?</text>
              </>
            )}

            {seats.map((seat, index) => {
              const start = seats.slice(0, index).reduce<number>((sum, value) => sum + value, 0);
              const color = [INDIGO, AMBER, GREEN][index];
              return (
                <rect key={index} x={seatX(start)} y="190" width={(seat / 300) * BAR_W} height="24" fill={`${color}26`} stroke={color} strokeWidth="1" />
              );
            })}
            <line x1={seatX(151)} y1="185" x2={seatX(151)} y2="219" stroke="#dc2626" strokeWidth="1" strokeDasharray="3 2" />
            <text x={seatX(seats[0] / 2)} y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill={INDIGO}>가 {seats[0]}</text>
            <text x={seatX(seats[0] + seats[1] / 2)} y="206" textAnchor="middle" fontSize="11" fontWeight="700" fill={AMBER}>나 {seats[1]}</text>
            <text x="340" y="234" textAnchor="end" fontSize="11" fontWeight="700" fill={GREEN}>다 {seats[2]}</text>
            <text x="20" y="234" fontSize="11" fill="currentColor">의회 300석</text>
          </svg>
        );
      }}
    />
  );
}
