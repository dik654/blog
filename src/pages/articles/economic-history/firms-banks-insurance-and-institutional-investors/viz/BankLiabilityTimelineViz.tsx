import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 영란은행 연구가 정리한 영국 은행 주주 책임의 변화.
 * 1826 런던 밖 주식은행 허용(유한책임은 곧바로 불허) → 1857 개별 허가 없이 유한책임 법인화
 * → 1862 최소 액면 하한 폐지 뒤 유한책임 은행 증가 → 1875 유한 52 · 무한 82(합 134)
 * → 1878 글래스고 시티 은행 파산으로 공존 끝 → 1879 회사법 유보책임.
 * 축은 1824~1882 연도 비례.
 */
const FROM = 1824;
const TO = 1882;
const W = 360;
const H = 92;
const PAD = 16;
const AXIS_Y = 54;
const x = (year: number) => PAD + ((year - FROM) / (TO - FROM)) * (W - 2 * PAD);

const MARKS = [
  { year: 1826, above: true, reach: 16 },
  { year: 1857, above: true, reach: 16 },
  { year: 1862, above: false, reach: 16 },
  { year: 1875, above: true, reach: 16 },
  { year: 1878, above: false, reach: 16 },
  { year: 1879, above: true, reach: 30 },
] as const;
const MARK_LIST: readonly { year: number }[] = MARKS;

const LIMITED = 52;
const UNLIMITED = 82;
const BANKS = LIMITED + UNLIMITED;

const KINDS = [
  { name: "무한책임", rule: "손실이 출자액을 넘으면 개인 재산까지", color: "#7c3aed" },
  { name: "유한책임", rule: "주주 손실은 투자액까지", color: "#2563eb" },
  { name: "유보책임", rule: "파산 때에만 추가 납입 의무", color: "#0891b2" },
] as const;

/** 장면별 [무한, 유한, 유보] 상태. 빈 문자열은 아직 등장 전. */
const STATUS: readonly (readonly [string, string, string])[] = [
  ["널리 쓰임", "곧바로 허용 안 됨", ""],
  ["널리 쓰임", "허가 없이 법인화 가능", ""],
  ["널리 쓰임", "이 법 뒤 늘기 시작", ""],
  [`${UNLIMITED}곳`, `${LIMITED}곳`, ""],
  ["공존 갑자기 끝남", "공존 갑자기 끝남", ""],
  ["공존 갑자기 끝남", "공존 갑자기 끝남", "새로 들여옴"],
];

const SCENES = [
  { label: "1826년 이후", summary: "런던 밖 주식은행 허용", note: "런던 밖 주식은행은 허용됐지만 제한된 책임은 곧바로 허용되지 않았습니다." },
  { label: "1857년 법", summary: "허가 없이 유한책임 법인화", note: "은행이 개별 허가 없이 유한책임으로 법인화할 수 있게 됐습니다." },
  { label: "1862년 법", summary: "주식 최소 액면 하한 폐지", note: "주식 최소 액면 하한을 없앤 뒤에야 유한책임 은행이 늘기 시작했습니다." },
  { label: "1875년", summary: `유한 ${LIMITED} · 무한 ${UNLIMITED}`, note: `영국과 아일랜드에 유한 ${LIMITED}곳, 무한 ${UNLIMITED}곳, 합쳐 ${BANKS}곳이 공존했습니다.` },
  { label: "1878년", summary: "글래스고 시티 은행 파산", note: "글래스고 시티 은행 파산으로 공존이 갑자기 끝났습니다. 이후 수는 글에 없습니다." },
  { label: "1879년 회사법", summary: "유보책임 도입", note: "파산 때에만 추가 납입 의무를 지는 유보책임(reserve liability)이 새로 들어왔습니다." },
] as const;

export default function BankLiabilityTimelineViz() {
  return (
    <SceneShell
      eyebrow="영국 은행 주주의 책임"
      title="무한책임에서 유보책임까지 반세기가 걸렸습니다"
      description="위 선의 간격은 실제 연도 차이에 비례합니다. 아래 세 칸은 은행이 망했을 때 주주가 어디까지 물어내는지에 따른 책임 방식입니다. 영란은행 연구(Staff Working Paper 755)가 정리한 19세기 영국 사례입니다."
      ariaLabel="1826년부터 1879년까지 영국 은행 주주 책임 방식의 변화 연표"
      scenes={SCENES}
      render={(active) => {
        const status = STATUS[active];
        const showCount = active >= 3;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={x(FROM)} x2={x(TO)} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[1830, 1840, 1850, 1860, 1870, 1880].map((year) => (
                <line key={year} x1={x(year)} x2={x(year)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#cbd5e1" strokeWidth={1} />
              ))}
              <line x1={x(1826)} x2={x(MARK_LIST[active].year)} y1={AXIS_Y} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1.25} />
              {MARKS.map((mark, index) => {
                const done = index <= active;
                const current = index === active;
                return (
                  <g key={mark.year}>
                    <circle cx={x(mark.year)} cy={AXIS_Y} r={current ? 6 : 4.5} fill={done ? "#2563eb" : "#ffffff"} stroke={done ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                    <line x1={x(mark.year)} x2={x(mark.year)} y1={mark.above ? AXIS_Y - 8 : AXIS_Y + 8} y2={mark.above ? AXIS_Y - mark.reach : AXIS_Y + mark.reach} stroke={done ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                    <text
                      x={x(mark.year)}
                      y={mark.above ? AXIS_Y - mark.reach - 5 : AXIS_Y + mark.reach + 12}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={current ? 700 : 400}
                      fill={done ? "#1d4ed8" : "#64748b"}
                    >
                      {mark.year}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {KINDS.map((kind, index) => {
                const text = status[index];
                const present = text !== "";
                return (
                  <div key={kind.name} className={`min-w-0 rounded-lg border px-2 py-1.5 text-xs leading-5 ${present ? "" : "border-dashed opacity-60"}`} style={{ borderColor: present ? kind.color : undefined }}>
                    <div className="font-bold" style={{ color: present ? kind.color : undefined }}>{kind.name}</div>
                    <div className="text-[11px] leading-4 text-muted-foreground">{kind.rule}</div>
                    <div className="mt-1 min-h-[2rem] border-t border-border/60 pt-1 font-semibold leading-4">{present ? text : "아직 없음"}</div>
                  </div>
                );
              })}
            </div>
            <div className={`mt-2 transition-opacity duration-300 motion-reduce:transition-none ${showCount ? (active === 3 ? "opacity-100" : "opacity-35") : "invisible"}`} aria-hidden={!showCount}>
              <div className="flex justify-between text-[11px] text-muted-foreground sm:text-xs">
                <span>1875년 은행 {BANKS}곳</span>
                <span>{active === 3 ? "막대 길이 = 은행 수" : "1878년 뒤 수는 글에 없음"}</span>
              </div>
              <div className="mt-1 flex h-6 min-w-0 overflow-hidden rounded-sm font-mono text-[11px] font-bold text-white sm:text-xs">
                <div className="flex items-center justify-center" style={{ width: `${(LIMITED / BANKS) * 100}%`, backgroundColor: KINDS[1].color }}>유한 {LIMITED}</div>
                <div className="flex items-center justify-center border-l border-background" style={{ width: `${(UNLIMITED / BANKS) * 100}%`, backgroundColor: KINDS[0].color }}>무한 {UNLIMITED}</div>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
