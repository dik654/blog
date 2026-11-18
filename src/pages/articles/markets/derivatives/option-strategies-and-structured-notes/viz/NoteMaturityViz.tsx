import SceneShell from "./SceneShell";
import type { ShellScene } from "./SceneShell";

/**
 * 본문 대응: #case — 투자금 100 = 할인채 92 + 옵션 예산 8, 8로 100·120 콜스프레드.
 * 만기 지급 = 채권 100 + min(max(지수−100, 0), 20): 지수 90 → 100, 110 → 110, 130 → 120.
 * 90은 본문 복습 질문의 숫자. 수수료는 본문 사례처럼 넣지 않음.
 * 발행자가 못 갚는 경우의 금액은 본문에 없어 칸 크기를 정하지 않습니다.
 */
interface NoteScene extends ShellScene {
  index: number | null;
  bond: number | null;
  option: number;
  today: boolean;
}

const SCENES: readonly NoteScene[] = [
  { label: "오늘: 100을 둘로 나눕니다", summary: "100 = 채권 92 + 옵션 8", index: null, bond: 92, option: 8, today: true, note: "발행자는 1년 뒤 100이 되는 할인채(지금 싸게 사서 만기에 액면 100을 받는 채권)에 92를 대응시키고, 남은 8로 지수 옵션을 삽니다. 원금 100이 금고에 따로 있는 것이 아니라 발행자의 지급 약속입니다." },
  { label: "만기 지수 90", summary: "100 + 0 = 100", index: 90, bond: 100, option: 0, today: false, note: "지수가 출발점 100 아래에서 끝나면 콜스프레드는 0입니다. 발행자가 약속대로 갚으면 채권 부품이 만든 100만 돌아옵니다." },
  { label: "만기 지수 110", summary: "100 + 10 = 110", index: 110, bond: 100, option: 10, today: false, note: "100과 120 사이에서는 지수 상승분을 그대로 받습니다. 110이면 옵션 부품이 10을 더합니다." },
  { label: "만기 지수 130", summary: "100 + 20 = 120", index: 130, bond: 100, option: 20, today: false, note: "지수는 30 올랐지만 상단 120 때문에 옵션 지급은 20에서 멈춥니다. 120 위의 10은 받지 못합니다." },
  { label: "발행자가 갚지 못하면", summary: "원금보호도 발행자 신용까지만", index: null, bond: null, option: 0, today: false, note: "채권 부품은 발행자의 무담보 지급 약속입니다. 발행자가 부도나면 원금보호 문구가 있어도 100을 받는다고 말할 수 없습니다. 점선은 약속한 100일 뿐이고, 얼마를 회수할지는 본문에 없어 채운 막대로 그리지 않았습니다." },
];

const W = 360;
const H = 232;
const BASE = 200;
const TOP = 28;
const V_MAX = 130;
const vy = (v: number) => BASE - (v / V_MAX) * (BASE - TOP);

/** 왼쪽 지수 눈금: 80~140. */
const I_MIN = 80;
const I_MAX = 140;
const iy = (i: number) => BASE - ((i - I_MIN) / (I_MAX - I_MIN)) * (BASE - TOP);

function NoteChart({ scene }: { scene: number }) {
  const s = SCENES[scene];
  const barX = 210;
  const barW = 64;
  const bondTop = s.bond === null ? vy(100) : vy(s.bond);
  const optTop = s.bond === null ? bondTop : vy(s.bond + s.option);
  const total = s.bond === null ? null : s.bond + s.option;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
      <text x={20} y={14} fontSize={11} fontWeight={700} fill="#475569">만기 지수</text>
      <line x1={70} x2={70} y1={iy(I_MAX)} y2={iy(I_MIN)} stroke="#94a3b8" strokeWidth={1} />
      <rect x={64} y={iy(120)} width={12} height={iy(100) - iy(120)} fill="#2563eb" opacity={0.2} />
      {[80, 100, 120, 140].map((i) => (
        <g key={i}>
          <line x1={66} x2={74} y1={iy(i)} y2={iy(i)} stroke="#94a3b8" strokeWidth={1} />
          <text x={60} y={iy(i) + 4} textAnchor="end" fontSize={10} fill="#64748b">{i}</text>
        </g>
      ))}
      <text x={82} y={iy(110) + 4} fontSize={10} fill="#1d4ed8">옵션이 따라가는 구간</text>
      {s.index !== null && (
        <g>
          <circle cx={70} cy={iy(s.index)} r={5} fill="#0f172a" />
          <text x={82} y={iy(s.index) + (s.index === 110 ? 18 : 4)} fontSize={11} fontWeight={700} fill="#0f172a">{`지수 ${s.index}`}</text>
        </g>
      )}
      {s.today && <text x={82} y={iy(80) + 4} fontSize={10} fill="#64748b">아직 정해지지 않음</text>}

      <text x={barX + barW / 2} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{s.today ? "오늘 투자금" : "만기에 받는 돈"}</text>
      <line x1={barX - 16} x2={barX + barW + 40} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      {!s.today && (
        <>
          <line x1={barX - 10} x2={barX + barW + 40} y1={vy(120)} y2={vy(120)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
          <text x={barX + barW + 40} y={vy(120) - 4} textAnchor="end" fontSize={10} fill="#64748b">상한 120</text>
        </>
      )}
      {s.bond === null ? (
        <>
          <rect x={barX} y={vy(100)} width={barW} height={BASE - vy(100)} fill="none" stroke="#b91c1c" strokeWidth={1} strokeDasharray="4 3" rx={2} />
          <text x={barX + barW / 2} y={vy(60)} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b91c1c">약속은 100</text>
          <text x={barX + barW / 2} y={vy(60) + 16} textAnchor="middle" fontSize={11} fill="#b91c1c">회수액 미정</text>
        </>
      ) : (
        <>
          <rect x={barX} y={bondTop} width={barW} height={BASE - bondTop} fill="#64748b" opacity={0.8} rx={2} />
          <text x={barX + barW / 2} y={(bondTop + BASE) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">{`채권 ${s.bond}`}</text>
          {s.option > 0 && (
            <>
              <rect x={barX} y={optTop} width={barW} height={bondTop - optTop} fill="#2563eb" rx={2} />
              <text x={barX + barW + 6} y={(optTop + bondTop) / 2 + 4} fontSize={11} fontWeight={700} fill="#1d4ed8">{`옵션 ${s.option}`}</text>
            </>
          )}
          {s.option === 0 && <text x={barX + barW + 6} y={bondTop + 4} fontSize={11} fill="#64748b">옵션 0</text>}
          {total !== null && !s.today && (
            <text x={barX - 6} y={optTop + 4} textAnchor="end" fontSize={12} fontWeight={700} fill="#0f172a">{`합계 ${total}`}</text>
          )}
        </>
      )}
    </svg>
  );
}

export default function NoteMaturityViz() {
  return (
    <SceneShell
      eyebrow="원금 100의 분해"
      title="채권 92가 원금을, 옵션 8이 상승분을 만듭니다"
      description="왼쪽 눈금은 1년 뒤 지수, 오른쪽 막대는 투자자가 받는 돈입니다. 콜스프레드는 지수 100에 사는 콜을 사고 120에 사는 콜을 팔아 100~120 사이 상승분만 받는 조합입니다. 수수료는 본문 사례처럼 빼고, 발행자가 갚는다는 전제입니다(마지막 장면 제외)."
      ariaLabel="채권 92와 옵션 예산 8이 만기 지수 90, 110, 130에서 만드는 지급"
      scenes={SCENES}
      render={(index) => <NoteChart scene={index} />}
    />
  );
}
