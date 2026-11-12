import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 8월 1일 09:00 cutoff에서 record를 쓰려면 발생 시각(event time)과
 * system 도착 시각(available time)이 둘 다 cutoff 이하여야 한다.
 * 거래 12건·신용등급 B(7/24 도착)·연체 처리(8/1 14:20)는 본문, 지연 도착 record는 첫 질문의 가정 사례.
 * 가로축은 순서만 보이고 간격은 비례하지 않는다.
 */
const CUT_X = 210;

type Mark = { x: number; known: boolean };
const RECORDS: readonly {
  name: string;
  event: Mark | null;
  arrive: Mark | null;
  eventText: string;
  arriveText: string;
  use: boolean;
}[] = [
  { name: "거래 12건", event: { x: 50, known: true }, arrive: { x: 80, known: true }, eventText: "cutoff 전", arriveText: "cutoff 전", use: true },
  { name: "신용등급 B", event: null, arrive: { x: 150, known: true }, eventText: "글에 시각 없음", arriveText: "7/24", use: true },
  { name: "지연 도착 record (가정)", event: { x: 170, known: true }, arrive: { x: 270, known: true }, eventText: "cutoff 전", arriveText: "cutoff 뒤", use: false },
  { name: "연체 처리 결과", event: { x: 300, known: true }, arrive: null, eventText: "8/1 14:20", arriveText: "글에 시각 없음", use: false },
];

const SCENES = [
  { label: "두 개의 시계", summary: "발생 ● · 도착 ■", focus: [] as number[], note: "Record마다 시각이 두 개 있습니다. ●는 현실에서 일이 일어난 event time, ■는 feature pipeline이 그 record를 읽을 수 있게 된 available time입니다. 세로선이 8월 1일 09:00 cutoff입니다." },
  { label: "둘 다 cutoff 앞", summary: "거래 12건 · 신용등급 B → 사용", focus: [0, 1], note: "Cutoff 전 거래 12건과 7월 24일에 도착한 신용등급 B는 cutoff 시점에 이미 system에 있었습니다. 그래서 row에 tx_count_30d=12와 credit_grade=B가 남습니다." },
  { label: "발생은 앞, 도착은 뒤", summary: "지연 도착 → 제외", focus: [2], note: "Event는 cutoff 전에 일어났어도 system 도착이 cutoff 뒤라면 09:00에는 아무도 그 값을 읽을 수 없었습니다. 첫 질문의 답이 '아니요'인 이유입니다. 이 record는 설명을 위한 가정입니다." },
  { label: "둘 다 cutoff 뒤", summary: "8/1 14:20 연체 처리 → 제외", focus: [3], note: "같은 날 14:20의 연체 처리 결과는 일어난 시각부터 cutoff 뒤입니다. 09:00 prediction row에 넣으면 dataset이 미래를 본 것이 됩니다." },
] as const;

function Track({ event, arrive, use, dim, neutral }: { event: Mark | null; arrive: Mark | null; use: boolean; dim: boolean; neutral: boolean }) {
  const color = dim ? "#cbd5e1" : neutral ? "#475569" : use ? "#16a34a" : "#dc2626";
  return (
    <svg viewBox="0 0 360 26" className="block h-auto w-full" aria-hidden="true">
      <line x1={10} x2={350} y1={13} y2={13} stroke="#e2e8f0" strokeWidth={1} />
      <line x1={CUT_X} x2={CUT_X} y1={0} y2={26} stroke="#2563eb" strokeWidth={1.25} />
      {event && arrive && <line x1={event.x} x2={arrive.x} y1={13} y2={13} stroke={color} strokeWidth={1.25} />}
      {event && <circle cx={event.x} cy={13} r={6} fill={color} />}
      {arrive && <rect x={arrive.x - 6} y={7} width={12} height={12} fill={dim ? "#ffffff" : color} stroke={color} strokeWidth={1.25} />}
    </svg>
  );
}

export default function TwoClockCutoffViz() {
  return (
    <SceneShell
      eyebrow="Event time과 available time"
      title="Cutoff 앞에 일어났고, cutoff 앞에 도착한 record만 씁니다"
      description="한 줄이 record 하나입니다. 세로 파란 선이 8월 1일 09:00 cutoff이고, 가로축은 순서만 나타내며 간격은 비례하지 않습니다."
      ariaLabel="네 record의 발생 시각과 도착 시각을 cutoff와 비교"
      scenes={SCENES}
      render={(active) => {
        const focus: readonly number[] = SCENES[active].focus;
        return (
          <div className="min-w-0">
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span>← 이전</span>
              <span className="font-semibold text-blue-700 dark:text-blue-400">cutoff 8/1 09:00</span>
              <span>이후 →</span>
            </div>
            <div className="mt-2 space-y-3">
              {RECORDS.map((r, i) => {
                const dim = active > 0 && !focus.includes(i);
                const showVerdict = focus.includes(i);
                return (
                  <div key={r.name} className={dim ? "opacity-50" : ""}>
                    <div className="flex min-w-0 flex-wrap items-baseline justify-between gap-x-3">
                      <span className="text-sm font-semibold">{r.name}</span>
                      <span className={`text-xs font-bold ${showVerdict ? (r.use ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400") : "text-transparent"}`}>
                        {r.use ? "사용" : "제외"}
                      </span>
                    </div>
                    <Track event={r.event} arrive={r.arrive} use={r.use} dim={dim} neutral={!showVerdict} />
                    <p className="text-[11px] leading-4 text-muted-foreground">● {r.eventText} · ■ {r.arriveText}</p>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
