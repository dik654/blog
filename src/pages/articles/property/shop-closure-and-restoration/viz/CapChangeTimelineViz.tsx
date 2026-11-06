import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 발표 날짜와 적용 폐업일이 다르다. 영상 2025-01-23, 2025-07-11, 보도자료 2025-07-30, 공고 2026-01-19.
 * 가로 = 2025-01-01부터의 시간. 왼쪽 끝은 2023-01-01부터 이어지는 구간을 잘라 그렸습니다. 막대 높이 = 폐업일 한도(만 원).
 */
const W = 340;
const H = 250;
const LEFT = 14;
const RIGHT = 14;
const BASE = 214;
const PIN_Y = 52;
const M_MAX = 13.5;
const SCALE = 0.17;

const px = (month: number) => LEFT + (month / M_MAX) * (W - LEFT - RIGHT);
const JAN_VIDEO = 0.73;
const JUL_VIDEO = 6.33;
const JUL_RELEASE = 6.94;
const NOTICE = 12.6;
const CASE_MAR = 2.3;
const CASE_SEP = 8.97;

const AXIS_COLOR = "#94a3b8";
const TEXT_COLOR = "#64748b";
const LOW_COLOR = "#d97706";
const HIGH_COLOR = "#2563eb";
const PIN_COLOR = "#475569";

const SCENES = [
  { label: "2025년 1월 영상", summary: "250만 → 400만 원", note: "2025-01-23 공개 영상의 03:50 화면입니다. 이때 한도는 400만 원으로 표시됩니다." },
  { label: "2025년 7월 영상", summary: "400만 → 600만 원", note: "2025-07-11 공개 영상의 01:53 화면입니다. 두 발표 사이에 한도가 확대됐지만, 영상 발표만으로 개별 신청의 지급액이 정해지지는 않습니다." },
  { label: "7월 30일 보도자료", summary: "7월 11일 이후 폐업에 적용", note: "자료는 뒤에 나왔지만 적용 경계는 그보다 앞선 7월 11일입니다. 발표 날짜가 아니라 폐업일을 경계와 비교합니다." },
  { label: "2026년 1월 공고", summary: "폐업일로 두 구간", note: "2023-01-01~2025-07-10 폐업은 400만 원, 2025-07-11 이후 폐업은 600만 원입니다. 2025-03-10과 2025-09-30에 닫은 점포가 서로 다른 구간에 놓입니다." },
] as const;

const PINS = [
  { month: JAN_VIDEO, name: "1월 영상", from: 0, anchor: "start" },
  { month: JUL_VIDEO, name: "7월 영상", from: 1, anchor: "end" },
  { month: JUL_RELEASE, name: "7월 30일 자료", from: 2, anchor: "start" },
  { month: NOTICE, name: "공고", from: 3, anchor: "end" },
] as const;

export default function CapChangeTimelineViz() {
  return (
    <SceneShell
      eyebrow="발표와 적용"
      title="언제 발표됐는지보다 언제 폐업했는지가 한도를 가릅니다"
      description="위쪽 점은 자료가 나온 날, 아래 막대는 폐업일에 따른 최대한도입니다. 막대는 2026-01-19 공고와 보도자료가 정한 폐업일 구간입니다."
      note="날짜와 금액은 이 글이 인용한 영상·보도자료·공고이고 2025-03-10, 2025-09-30 폐업은 (가정)입니다. 이 금액은 상한이며 지급 확정액이 아닙니다."
      ariaLabel="철거비 지원 한도의 발표 날짜와 폐업일 기준 적용 구간을 한 시간축에 놓은 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={LEFT} x2={W - RIGHT} y1={PIN_Y} y2={PIN_Y} stroke={AXIS_COLOR} strokeWidth={1} />
          <text x={LEFT} y={14} fontSize={12} fill={TEXT_COLOR}>자료가 나온 날</text>
          {PINS.filter((pin) => pin.from <= active).map((pin) => {
            const current = pin.from === active;
            return (
              <g key={pin.name}>
                <circle cx={px(pin.month)} cy={PIN_Y} r={current ? 5 : 3.5} fill={current ? HIGH_COLOR : PIN_COLOR} />
                {current && (
                  <text x={px(pin.month) + (pin.anchor === "end" ? 4 : -4)} y={PIN_Y - 12} textAnchor={pin.anchor} fontSize={13} fontWeight={700} fill={HIGH_COLOR}>{pin.name}</text>
                )}
              </g>
            );
          })}

          {active >= 2 && (
            <g>
              <rect x={LEFT} y={BASE - 400 * SCALE} width={px(JUL_VIDEO) - LEFT} height={400 * SCALE} fill={LOW_COLOR} opacity={0.16} stroke={LOW_COLOR} strokeWidth={1} />
              <rect x={px(JUL_VIDEO)} y={BASE - 600 * SCALE} width={W - RIGHT - px(JUL_VIDEO)} height={600 * SCALE} fill={HIGH_COLOR} opacity={0.14} stroke={HIGH_COLOR} strokeWidth={1} />
              <text x={LEFT + 6} y={BASE - 8} fontSize={12} fill={LOW_COLOR} fontWeight={700}>← 2023-01-01부터</text>
              <text x={px(JUL_VIDEO) + 6} y={BASE - 8} fontSize={12} fill={HIGH_COLOR} fontWeight={700}>2025-07-11부터</text>
              <text x={(LEFT + px(JUL_VIDEO)) / 2} y={BASE - 26} textAnchor="middle" fontSize={14} fontWeight={700} fill={LOW_COLOR}>400만 원</text>
              <text x={(px(JUL_VIDEO) + W - RIGHT) / 2} y={BASE - 26} textAnchor="middle" fontSize={14} fontWeight={700} fill={HIGH_COLOR}>600만 원</text>
            </g>
          )}
          {active === 2 && (
            <g fill="none" stroke={HIGH_COLOR} strokeWidth={1.25}>
              <path d={`M${px(JUL_RELEASE)} ${PIN_Y + 5} C${px(JUL_RELEASE)} ${PIN_Y + 28} ${px(JUL_VIDEO)} ${PIN_Y + 22} ${px(JUL_VIDEO)} ${BASE - 600 * SCALE - 4}`} />
              <path d={`M${px(JUL_VIDEO) - 4} ${BASE - 600 * SCALE - 9} L${px(JUL_VIDEO)} ${BASE - 600 * SCALE - 3} L${px(JUL_VIDEO) + 4} ${BASE - 600 * SCALE - 9}`} />
            </g>
          )}
          {active === 3 && (
            <g>
              <circle cx={px(CASE_MAR)} cy={BASE - 400 * SCALE} r={4} fill={LOW_COLOR} />
              <text x={px(CASE_MAR)} y={BASE - 400 * SCALE - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={LOW_COLOR}>03-10 폐업</text>
              <circle cx={px(CASE_SEP)} cy={BASE - 600 * SCALE} r={4} fill={HIGH_COLOR} />
              <text x={px(CASE_SEP)} y={BASE - 600 * SCALE - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill={HIGH_COLOR}>09-30 폐업</text>
            </g>
          )}

          <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke={AXIS_COLOR} strokeWidth={1} />
          {[{ m: 0, t: "2025-01" }, { m: 6, t: "2025-07" }, { m: 12, t: "2026-01" }].map((tick) => (
            <g key={tick.t}>
              <line x1={px(tick.m)} x2={px(tick.m)} y1={BASE} y2={BASE + 5} stroke={AXIS_COLOR} strokeWidth={1} />
              <text x={px(tick.m)} y={BASE + 20} textAnchor={tick.m === 0 ? "start" : "middle"} fontSize={12} fill={TEXT_COLOR}>{tick.t}</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
