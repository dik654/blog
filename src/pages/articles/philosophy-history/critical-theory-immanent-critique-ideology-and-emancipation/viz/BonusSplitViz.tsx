import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 보너스 예산 100을 10명에게 나누면 각 10, 정규직 6명에게만 나누면 약 16.7(100÷6=16.66…)이고 계약직 4명은 0.
 * 막대 하나가 직원 한 명의 몫입니다. 세로 눈금은 0~20이며 두 배분 모두 총액은 100입니다.
 * 두 배분의 차이: 정규직 한 명은 16.7−10≈+6.7, 계약직 한 명은 −10. 4×10=40 = 6×6.67.
 */
const BUDGET = 100;
const REGULAR = 6;
const CONTRACT = 4;
const EQUAL_SHARE = BUDGET / (REGULAR + CONTRACT);
const CURRENT_SHARE = BUDGET / REGULAR;

type Mode = "promise" | "current" | "overlay" | "beyond";

const SCENES = [
  {
    label: "공개된 약속대로",
    summary: "100 ÷ 10 = 10",
    mode: "promise" as Mode,
    note: "‘모든 직원이 같은 기준으로 받는다’는 공지를 그대로 따르면 10명이 모두 평가에 들어가고, 한 사람 몫은 10입니다.",
  },
  {
    label: "현재 제도",
    summary: "100 ÷ 6 ≈ 16.7 · 4명은 0",
    mode: "current" as Mode,
    note: "정규직 6명만 평가 대상에 넣으면 한 사람 몫이 약 16.7로 커지고, 같은 일을 한 계약직 4명의 막대는 0입니다.",
  },
  {
    label: "두 배분을 겹치면",
    summary: "총액은 둘 다 100",
    mode: "overlay" as Mode,
    note: "점선이 약속대로의 10입니다. 정규직은 한 사람당 약 6.7 위에, 계약직은 10 아래에 있습니다. 계약직 4명 몫 40(4×10)이 정규직 6명에게 약 6.7씩 나뉜 셈입니다. 총액 100은 맞아도 평등 기준은 지켜지지 않습니다.",
  },
  {
    label: "모두 10을 받아도",
    summary: "장부 밖의 차이는 남음",
    mode: "beyond" as Mode,
    note: "계약직 4명을 넣어 모두 10을 받는 것은 첫 수정안일 뿐입니다. 평가 점수·노동시간·임금 격차·의사 결정권이 다르면 같은 10도 다른 효과를 냅니다. 이 차이는 배분표에 숫자로 나오지 않아 막대로 그리지 않았습니다.",
  },
] as const;

const W = 360;
const H = 204;
const LEFT = 34;
const RIGHT = 10;
const TOP = 14;
const BASE = 160;
const MAX = 20;
const SLOT = (W - LEFT - RIGHT) / (REGULAR + CONTRACT);
const BAR = SLOT * 0.62;

const y = (value: number) => BASE - (value / MAX) * (BASE - TOP);

const PEOPLE = Array.from({ length: REGULAR + CONTRACT }, (_, index) => ({
  index,
  regular: index < REGULAR,
  label: index < REGULAR ? `정${index + 1}` : `계${index - REGULAR + 1}`,
}));

function shareOf(mode: Mode, regular: boolean) {
  if (mode === "promise" || mode === "beyond") return EQUAL_SHARE;
  return regular ? CURRENT_SHARE : 0;
}

export default function BonusSplitViz() {
  return (
    <SceneShell
      eyebrow="보너스 예산 100"
      title="총액은 같아도 몇 명에게 나누는지가 한 사람 몫을 바꿉니다"
      description="막대 하나가 직원 한 명의 보너스입니다. ‘정’은 정규직 6명, ‘계’는 같은 일을 한 계약직 4명입니다. 예산 100과 10명은 3절의 설명용 숫자입니다(가정)."
      ariaLabel="보너스 예산 100을 10명에게 각 10씩 나눌 때와 정규직 6명에게만 약 16.7씩 나눌 때의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showGuide = scene.mode === "overlay" || scene.mode === "current";
        const total = PEOPLE.reduce<number>((sum, person) => sum + shareOf(scene.mode, person.regular), 0);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[30rem]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[0, 10, 20].map((tick) => (
                <g key={tick}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#cbd5e1" strokeWidth={tick === 0 ? 1 : 0.6} />
                  <text x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
                </g>
              ))}
              <line x1={LEFT + SLOT * REGULAR} x2={LEFT + SLOT * REGULAR} y1={TOP} y2={BASE + 34} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              {PEOPLE.map((person) => {
                const value = shareOf(scene.mode, person.regular);
                const x = LEFT + SLOT * person.index + (SLOT - BAR) / 2;
                const color = person.regular ? "#2563eb" : "#d97706";
                return (
                  <g key={person.index}>
                    {value > 0 ? (
                      <rect x={x} y={y(value)} width={BAR} height={BASE - y(value)} fill={color} opacity={scene.mode === "beyond" ? 0.75 : 1} />
                    ) : (
                      <rect x={x} y={y(10)} width={BAR} height={BASE - y(10)} fill="none" stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
                    )}
                    <text x={x + BAR / 2} y={value > 0 ? y(value) - 5 : BASE - 6} textAnchor="middle" fontSize={11} fontWeight={700} fill={value > 0 ? "#475569" : "#b45309"}>
                      {value > 0 ? (Number.isInteger(value) ? value : value.toFixed(1)) : "0"}
                    </text>
                    <text x={x + BAR / 2} y={BASE + 16} textAnchor="middle" fontSize={12} fill="#475569">{person.label}</text>
                  </g>
                );
              })}
              {showGuide ? (
                <line x1={LEFT} x2={W - RIGHT} y1={y(EQUAL_SHARE)} y2={y(EQUAL_SHARE)} stroke="#64748b" strokeWidth={1} strokeDasharray="5 4" opacity={scene.mode === "overlay" ? 1 : 0.35} />
              ) : null}
              <text x={LEFT + (SLOT * REGULAR) / 2} y={BASE + 34} textAnchor="middle" fontSize={12} fill="#1d4ed8" fontWeight={700}>정규직 6명</text>
              <text x={LEFT + SLOT * REGULAR + (SLOT * CONTRACT) / 2} y={BASE + 34} textAnchor="middle" fontSize={12} fill="#b45309" fontWeight={700}>계약직 4명</text>
            </svg>
            <p className="mt-3 text-sm leading-6">
              <span className="text-muted-foreground">합계 </span>
              <span className="font-mono font-bold">{Math.round(total)}</span>
              <span className="text-muted-foreground"> · 평가 대상 </span>
              <span className="font-bold">{scene.mode === "promise" || scene.mode === "beyond" ? "10명 모두" : "정규직 6명만"}</span>
            </p>
            <p className="text-xs leading-5 text-muted-foreground">점선 상자 = 빠진 사람에게 약속된 몫 10 · 점선 가로줄 = 약속대로의 10</p>
          </div>
        );
      }}
    />
  );
}
