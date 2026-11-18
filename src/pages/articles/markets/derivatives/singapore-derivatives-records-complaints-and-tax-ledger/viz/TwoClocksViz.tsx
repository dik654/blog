import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 두 기한은 서로 다른 날에서 시작합니다(날짜는 글의 가정).
 * 외부 구제 창: 최종답변 2026-01-15 → 원칙상 2026-07-15(6개월).
 * 거래장부 보존: 계약 종료 2026-01-31 → 적어도 2031-01-31(5년).
 * 위 띠 = 2026년 1~8월 확대(일 단위), 아래 띠 = 2026~2032년 전체(연 단위).
 * 법적 보류는 끝 날짜를 글이 정하지 않으므로 점선 끝을 열어 둔다.
 */
const L = 16;
const R = 304;
// 위 띠: 2026-01-01을 0일로 두고 2026-08-01(212일)까지
const ZOOM_DAYS = 212;
const zx = (day: number) => L + (day / ZOOM_DAYS) * (R - L);
const D_ANSWER = 14; // 1월 15일
const D_END = 30; // 1월 31일
const D_WINDOW = 195; // 7월 15일
// 아래 띠: 2026-01-01 ~ 2032-01-01
const fx = (years: number) => L + (years / 6) * (R - L);
const Y_ANSWER = 14 / 365;
const Y_END = 30 / 365;
const Y_WINDOW = 195 / 365;
const Y_KEEP = 5 + 30 / 365;

const BLUE = "#2563eb";
const GRAY = "#64748b";
const AMBER = "#d97706";
const LINE = "#94a3b8";

const SCENES = [
  {
    label: "최종답변 뒤 6개월",
    summary: "2026-01-15 → 2026-07-15",
    focus: "window",
    note: "외부 구제 창은 최종답변일에서 셉니다(날짜는 가정). 분쟁조정기관 FIDReC에 가져갈 창은 원칙상 7월 15일까지이고, 청구 2만4천 싱가포르달러는 개인의 심판 한도(원칙상 15만 달러)보다 작습니다.",
  },
  {
    label: "계약 종료 뒤 적어도 5년",
    summary: "2026-01-31 → 2031-01-31 이후",
    focus: "keep",
    note: "보존기간은 답변일이 아니라 계약 종료일에서 셉니다(파생상품 거래 규정 제5조, 지정된 사람·상품 대상). 적어도 2031년 1월 31일까지 찾을 수 있게 두며, 그날이 곧 반드시 지우는 날은 아닙니다.",
  },
  {
    label: "한 축에 놓으면",
    summary: "창은 7월에 닫히고 보존은 남음",
    focus: "both",
    note: "16일 차이로 시작한 두 시계의 끝은 크게 벌어집니다. 7월 15일 구제 창이 닫힌 뒤에도 보존은 2031년 1월 31일까지 4년 반 넘게 이어집니다.",
  },
  {
    label: "법적 보류가 끼면",
    summary: "일반 파기일보다 우선할 수 있음",
    focus: "hold",
    note: "소송이 시작되면 일반 파기일보다 법적 보류(분쟁 때문에 자료 파기를 멈추는 조치)가 우선할 수 있습니다. 보류의 끝은 글에 없어 점선 끝을 비웠습니다. 반대로 무기한 보관하면 개인정보·접근 위험이 커집니다.",
  },
] as const;

export default function TwoClocksViz() {
  return (
    <SceneShell
      eyebrow="두 시계"
      title="민원 기한과 보존 기한은 다른 날에서 출발합니다"
      description="위 띠는 2026년 1~8월 확대, 아래 띠는 같은 두 기한의 2026~2032년 전체입니다. 날짜는 3절의 가정입니다."
      ariaLabel="최종답변일에서 시작하는 6개월 외부 구제 창과 계약 종료일에서 시작하는 5년 보존 기간 비교"
      scenes={SCENES}
      render={(active) => {
        const focus = SCENES[active].focus;
        const showWindow = focus === "window" || focus === "both" || focus === "hold";
        const showKeep = focus === "keep" || focus === "both" || focus === "hold";
        const windowOpacity = focus === "keep" ? 0.18 : focus === "hold" ? 0.45 : 1;
        const keepOpacity = focus === "window" ? 0.18 : focus === "hold" ? 0.45 : 1;
        return (
          <svg viewBox="0 0 320 236" className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* 위 띠: 2026년 1~8월 확대 */}
            <text x={L} y={13} fontSize={11.5} fontWeight={700} fill={GRAY}>2026년 1~8월 확대</text>
            <g opacity={windowOpacity}>
              <rect x={zx(D_ANSWER)} y={22} width={zx(D_WINDOW) - zx(D_ANSWER)} height={17} rx={3} fill={BLUE} opacity={showWindow ? 0.85 : 0.25} />
              <text x={(zx(D_ANSWER) + zx(D_WINDOW)) / 2} y={35} textAnchor="middle" fontSize={11.5} fontWeight={700} fill="#ffffff">외부 구제 창 6개월</text>
            </g>
            <g opacity={keepOpacity}>
              <rect x={zx(D_END)} y={44} width={R - zx(D_END)} height={16} rx={3} fill={GRAY} opacity={showKeep ? 0.75 : 0.25} />
              <text x={zx(D_END) + 5} y={56} fontSize={11} fontWeight={700} fill="#ffffff">보존 → 2031년까지 이어짐</text>
            </g>
            <line x1={L} x2={R} y1={68} y2={68} stroke={LINE} strokeWidth={1} />
            {[
              { day: D_ANSWER, text: "1/15 최종답변", y: 84, anchor: "start" as const },
              { day: D_END, text: "1/31 계약 종료", y: 99, anchor: "start" as const },
              { day: D_WINDOW, text: "7/15 창 닫힘", y: 84, anchor: "end" as const },
            ].map((tick) => (
              <g key={tick.text}>
                <line x1={zx(tick.day)} x2={zx(tick.day)} y1={20} y2={tick.y - 10} stroke={LINE} strokeWidth={1} strokeDasharray="2 2" />
                <text x={zx(tick.day) + (tick.anchor === "end" ? 4 : -2)} y={tick.y} textAnchor={tick.anchor} fontSize={11} fill={GRAY}>{tick.text}</text>
              </g>
            ))}

            {/* 아래 띠: 2026~2032년 전체 */}
            <text x={L} y={124} fontSize={11.5} fontWeight={700} fill={GRAY}>2026~2032년 전체</text>
            <g opacity={windowOpacity}>
              <rect x={fx(Y_ANSWER)} y={133} width={Math.max(fx(Y_WINDOW) - fx(Y_ANSWER), 2)} height={16} rx={1.5} fill={BLUE} opacity={showWindow ? 0.85 : 0.25} />
              <text x={fx(Y_WINDOW) + 5} y={145} fontSize={11} fontWeight={700} fill={BLUE}>← 6개월 창은 여기서 끝</text>
            </g>
            <g opacity={keepOpacity}>
              <rect x={fx(Y_END)} y={155} width={fx(Y_KEEP) - fx(Y_END)} height={16} rx={3} fill={GRAY} opacity={showKeep ? 0.75 : 0.25} />
              <text x={fx(Y_END) + 5} y={167} fontSize={11} fontWeight={700} fill="#ffffff">적어도 5년 보존</text>
            </g>
            {focus === "hold" && (
              <g>
                <line x1={fx(Y_KEEP)} x2={R} y1={163} y2={163} stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={R} y={185} textAnchor="end" fontSize={11} fontWeight={700} fill={AMBER}>법적 보류: 끝 날짜 미정</text>
              </g>
            )}
            <line x1={L} x2={R} y1={198} y2={198} stroke={LINE} strokeWidth={1} />
            {[0, 1, 2, 3, 4, 5, 6].map((year) => (
              <g key={year}>
                <line x1={fx(year)} x2={fx(year)} y1={194} y2={202} stroke={LINE} strokeWidth={1} />
                <text x={fx(year)} y={215} textAnchor="middle" fontSize={10.5} fill={GRAY}>{2026 + year}</text>
              </g>
            ))}
            <line x1={fx(Y_KEEP)} x2={fx(Y_KEEP)} y1={152} y2={198} stroke={LINE} strokeWidth={1} strokeDasharray="2 2" />
            <text x={fx(Y_KEEP)} y={231} textAnchor="middle" fontSize={11} fontWeight={700} fill={GRAY}>2031-01-31</text>
          </svg>
        );
      }}
    />
  );
}
