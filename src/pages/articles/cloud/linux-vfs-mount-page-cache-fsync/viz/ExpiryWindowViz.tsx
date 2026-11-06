import SceneShell from "./SceneShell";

/**
 * 본문 대응: #dirty-pages — 첫째 계기. flusher는 5초마다 깨어나 30초 넘은 page를 쓴다.
 * 쓰이는 때는 "dirty가 된 뒤 30초가 지나고 처음 오는 점검"이므로 30~35초 사이가 된다.
 * 점검 시각을 0, 5, 10…초로 둔 것과 dirty가 된 시각 1초·4초는 설명용 가정이다.
 * 1초 → 만료 31초 → 점검 35초 → 34초 뒤. 4초 → 만료 34초 → 점검 35초 → 31초 뒤.
 */
const AXIS = 40;
const LEFT = 14;
const RIGHT = 346;
const x = (t: number) => LEFT + (t / AXIS) * (RIGHT - LEFT);
const TICKS = Array.from({ length: AXIS / 5 + 1 }, (_, i) => i * 5);

const SCENES = [
  { label: "점검 직후에 dirty가 되면", summary: "1초 → 35초 · 34초 뒤", start: 1 as number | null, cut: null as number | null, note: "(가정) 1초에 dirty가 되면 30초가 지나는 때는 31초입니다. 그때 flusher는 자고 있고 다음 점검은 35초이므로 dirty가 된 뒤 34초에 쓰이기 시작합니다." },
  { label: "점검 직전에 dirty가 되면", summary: "4초 → 35초 · 31초 뒤", start: 4 as number | null, cut: null as number | null, note: "(가정) 4초에 dirty가 되면 34초에 30초가 차고 바로 다음 35초 점검에서 쓰입니다. dirty가 된 뒤 31초입니다. 점검과 만료가 얼마나 어긋나느냐에 따라 가만히 두면 30~35초 사이에 써집니다." },
  { label: "1절의 정전", summary: "20초 · 아직 만료 전", start: 0 as number | null, cut: 20 as number | null, note: "1절은 write() 뒤 20초에 정전이 났습니다. 30초가 차기 전이라 flusher가 점검을 해도 이 page를 쓰지 않으므로, dirty page는 RAM과 함께 사라집니다." },
] as const;

export default function ExpiryWindowViz() {
  return (
    <SceneShell
      eyebrow="30초 만료 · 5초 점검"
      title="왜 30초가 아니라 30~35초일까요"
      description="가로축은 초입니다. 위쪽 눈금이 flusher가 깨어나는 때(5초마다), 주황 막대가 dirty가 된 뒤 만료까지의 30초입니다. 점검 시각을 0, 5, 10…초로 놓았습니다(가정)."
      ariaLabel="flusher 5초 점검과 30초 만료가 만나는 시각"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const start = s.start ?? 0;
        const expire = start + 30;
        const hit = TICKS.find((t) => t >= expire) ?? AXIS;
        return (
          <svg viewBox="0 0 360 150" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${s.label}: ${s.summary}`}>
            <text x={LEFT} y={14} fontSize={11} fill="#64748b">flusher 점검(5초마다)</text>
            {TICKS.map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={22} y2={34} stroke={!s.cut && t === hit ? "#16a34a" : "#94a3b8"} strokeWidth={!s.cut && t === hit ? 1.25 : 1} />
                <line x1={x(t)} x2={x(t)} y1={118} y2={124} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(t)} y={138} textAnchor="middle" fontSize={11} fill="#64748b">{t}</text>
              </g>
            ))}
            <line x1={LEFT} x2={RIGHT} y1={118} y2={118} stroke="#94a3b8" strokeWidth={1} />
            <rect x={x(start)} y={50} width={x(s.cut ?? expire) - x(start)} height={16} rx={2} fill="#d97706" opacity={0.75} />
            <text x={x(start)} y={82} fontSize={11} fontWeight={700} fill="#b45309">dirty가 됨 {start}초</text>
            {!s.cut && (
              <>
                <line x1={x(expire)} x2={x(expire)} y1={44} y2={72} stroke="#b45309" strokeWidth={1} strokeDasharray="3 2" />
                <text x={x(expire) - 3} y={100} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">만료 {expire}초</text>
                <line x1={x(expire)} x2={x(hit)} y1={58} y2={58} stroke="#475569" strokeWidth={1} strokeDasharray="3 2" />
                <line x1={x(hit)} x2={x(hit)} y1={34} y2={72} stroke="#16a34a" strokeWidth={1.25} />
                <text x={x(hit) + 3} y={82} fontSize={11} fontWeight={700} fill="#16a34a">쓰기 {hit}초</text>
              </>
            )}
            {s.cut !== null && (
              <>
                <line x1={x(s.cut)} x2={x(s.cut)} y1={40} y2={118} stroke="#dc2626" strokeWidth={1.25} />
                <text x={x(s.cut) + 4} y={62} fontSize={11} fontWeight={700} fill="#dc2626">정전 {s.cut}초</text>
                <rect x={x(s.cut)} y={88} width={x(30) - x(s.cut)} height={14} rx={2} fill="none" stroke="#94a3b8" strokeDasharray="3 2" strokeWidth={1} />
                <text x={x(30) + 4} y={100} fontSize={11} fill="#64748b">30초에 못 닿음</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
