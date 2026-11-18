import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단 — 이집트와 오스만의 외채가 유럽의 재정 통제로 넘어간 순서.
 * 이집트: 1876년 4월 지급불능 → 1876년 5월 공공부채금고 → 1882년부터 영국 점령.
 * 오스만: 1881년 12월 20일 무하렘 칙령(부채 절반, 공공부채관리국, 국가 수입을 상환 담보로).
 * 가로축은 연도에 비례합니다. 1882년의 달은 본문에 없어 점이 아니라 1882년부터 이어지는 띠로 그립니다.
 */
const W = 360;
const H = 176;
const LEFT = 20;
const RIGHT = 340;
const FROM = 1875.6;
const TO = 1882.6;
const x = (year: number) => LEFT + ((year - FROM) / (TO - FROM)) * (RIGHT - LEFT);

const EGYPT_Y = 52;
const OTTOMAN_Y = 116;
const AXIS_Y = 150;

const EVENTS = [
  { year: 1876 + 3 / 12, lane: EGYPT_Y },
  { year: 1876 + 4 / 12, lane: EGYPT_Y },
  { year: 1881 + 11.6 / 12, lane: OTTOMAN_Y },
  { year: 1882, lane: EGYPT_Y },
] as const;

const SCENES = [
  { label: "1876년 4월 · 이집트", summary: "지급불능", note: "면화·운하·철도 투자는 이집트를 세계시장에 잇는 동시에 외채를 키웠습니다. 헤디브 이스마일 치하의 이집트 국가는 1876년 4월 지급불능에 빠졌습니다." },
  { label: "1876년 5월 · 이집트", summary: "공공부채금고 설립", note: "바로 다음 달 프랑스와 영국이 이집트에 공공부채금고(Caisse de la Dette publique)를 세우게 했습니다. 지급불능에서 부채금고 설립까지 한 달이 걸렸습니다." },
  { label: "1881년 12월 20일 · 오스만", summary: "무하렘 칙령", note: "오스만 제국에서는 무하렘 칙령이 부채를 절반으로 줄이는 대신 오스만 공공부채관리국을 세웠고, 국가 수입의 상당 부분을 상환 담보로 이 기관에 넘겼습니다." },
  { label: "1882년부터 · 이집트", summary: "영국 점령", note: "1882년부터는 영국이 이집트를 점령했습니다. 이집트 줄에서는 지급불능 → 부채금고 → 점령이 약 6년에 걸쳐 이어졌습니다. 1882년의 달은 본문에 없어 한 점 대신 1882년부터 이어지는 띠로 그렸습니다." },
] as const;

const LABELS = [
  { text: "4월 지급불능", lx: x(1876 + 3 / 12) - 4, ly: EGYPT_Y + 20, anchor: "start" },
  { text: "5월 공공부채금고", lx: x(1876 + 3 / 12) - 4, ly: EGYPT_Y + 36, anchor: "start" },
  { text: "1881.12.20 무하렘 칙령", lx: x(1881 + 11.6 / 12) + 6, ly: OTTOMAN_Y + 22, anchor: "end" },
  { text: "1882~ 영국 점령", lx: RIGHT, ly: EGYPT_Y - 12, anchor: "end" },
] as const;

export default function DebtControlTimelineViz() {
  return (
    <SceneShell
      eyebrow="외채에서 재정 통제로"
      title="이집트와 오스만, 두 줄에서 부채가 채권자 기관으로 넘어간 순서"
      description="위 줄은 이집트, 아래 줄은 오스만 제국입니다. 가로축은 연도에 비례하고, 지금 장면의 사건만 진하게 그렸습니다."
      ariaLabel="1876년부터 1882년까지 이집트와 오스만의 외채 위기와 채권자 기관 설립 연표"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[
            { y: EGYPT_Y, name: "이집트" },
            { y: OTTOMAN_Y, name: "오스만" },
          ].map((lane) => (
            <g key={lane.name}>
              <text x={LEFT} y={lane.y - 12} fontSize={12} fontWeight={700} fill="#64748b">{lane.name}</text>
              <line x1={LEFT} x2={RIGHT} y1={lane.y} y2={lane.y} stroke="#cbd5e1" strokeWidth={1} />
            </g>
          ))}
          {EVENTS.map((event, index) => {
            const on = index === active;
            const past = index < active;
            if (index === 3) {
              // "1882년부터"는 달이 본문에 없으므로 한 점이 아니라 1882년 이후로 이어지는 띠로 그립니다.
              return (
                <rect
                  key={index}
                  x={x(event.year)}
                  y={event.lane - 3}
                  width={RIGHT - x(event.year)}
                  height={6}
                  rx={3}
                  fill={on ? "#2563eb" : past ? "#64748b" : "#ffffff"}
                  stroke={on ? "#2563eb" : "#64748b"}
                  strokeWidth={1}
                />
              );
            }
            return (
              <circle
                key={index}
                cx={x(event.year)}
                cy={event.lane}
                r={on ? 5.5 : 4}
                fill={on ? "#2563eb" : past ? "#64748b" : "#ffffff"}
                stroke={on ? "#2563eb" : "#64748b"}
                strokeWidth={1}
              />
            );
          })}
          {LABELS.map((label, index) => (
            <text
              key={label.text}
              x={label.lx}
              y={label.ly}
              textAnchor={label.anchor}
              fontSize={11}
              fontWeight={index === active ? 700 : 400}
              fill={index === active ? "#2563eb" : index < active ? "#475569" : "#94a3b8"}
            >
              {label.text}
            </text>
          ))}
          <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {[1876, 1877, 1878, 1879, 1880, 1881, 1882].map((year) => (
            <g key={year}>
              <line x1={x(year)} x2={x(year)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(year)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">{year}</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
