import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lineage — 설명용 SQL의 네 조건을 위에서부터 차례로 적용합니다.
 * 활력(09:40 → 09:42)과 검사(09:50 → 10:20)는 글의 예시이고, 나머지 넷은 조건을 보이려는 가정입니다.
 * 입력 마감 10:00, 같은 시각 도착은 로그 8420까지 반영합니다.
 */
const START = 9 * 60 + 30;
const SPAN = 60;
const PAD = 4;
/** x를 퍼센트로 두어 폭이 바뀌어도 원과 선의 굵기가 그대로 유지됩니다. */
const tx = (minute: number) => `${PAD + ((minute - START) / SPAN) * (100 - 2 * PAD)}%`;
const CUTOFF = 10 * 60;

const RECORDS = [
  { name: "활력 r-vital-31", tag: "p-17", event: 580, arrive: 582, out: 0, assumed: false },
  { name: "검사 r-lab-88", tag: "p-17", event: 590, arrive: 620, out: 3, assumed: false },
  { name: "다른 환자 p-09", tag: "p-09", event: 585, arrive: 586, out: 1, assumed: true },
  { name: "10:05 사건", tag: "p-17", event: 605, arrive: 607, out: 2, assumed: true },
  { name: "10:00 도착 · 로그 8419", tag: "p-17", event: 598, arrive: 600, out: 0, assumed: true },
  { name: "10:00 도착 · 로그 8423", tag: "p-17", event: 599, arrive: 600, out: 4, assumed: true },
] as const;

const SCENES = [
  {
    label: "후보 기록 여섯 개",
    summary: "마감 10:00 · 로그 8420",
    note: "빈 원은 사건 시각, 찬 원은 도착 시각입니다. 활력과 검사는 앞 예시 그대로이고, 나머지 넷은 조건마다 무엇이 걸리는지 보이려는 가정입니다.",
  },
  {
    label: "① 같은 환자만",
    summary: "patient_id = p-17",
    note: "다른 환자 p-09의 기록은 시각과 상관없이 먼저 빠집니다.",
  },
  {
    label: "② 예측 뒤 사건 제외",
    summary: "event_at ≤ 10:00",
    note: "10:05 사건은 빈 원부터 세로선 오른쪽입니다. 10시 예측보다 뒤에 일어난 일이라 빠집니다.",
  },
  {
    label: "③ 늦게 도착한 기록 제외",
    summary: "available_at ≤ 10:00",
    note: "검사는 빈 원(09:50)이 왼쪽이라 ②를 통과했지만 찬 원(10:20)이 오른쪽입니다. 사건은 과거여도 10시에는 시스템에 없었습니다.",
  },
  {
    label: "④ 같은 시각은 로그 위치로",
    summary: "commit_offset ≤ 8420",
    note: "두 기록 모두 10:00에 도착해 ③으로는 못 가릅니다. 로그 8420까지만 읽어 8419는 남고 8423은 빠집니다. 활력 기록의 로그 위치는 8420 앞이라고 둡니다(가정).",
  },
] as const;

const OUT_LABEL = ["", "①", "②", "③", "④"] as const;

export default function CutoffFilterViz() {
  return (
    <SceneShell
      eyebrow="판정 순서"
      title="네 조건이 원본 기록을 하나씩 거릅니다"
      description="한 줄이 원본 기록 하나입니다. 아래 설명용 SQL의 WHERE 조건 네 줄을 위에서부터 적용합니다. 활력·검사 외의 네 기록과 로그 위치는 설명용 가정입니다."
      ariaLabel="입력 마감 10시와 로그 위치 8420을 기준으로 여섯 기록을 네 조건으로 거르는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_2.75rem] items-end gap-2 border-b border-border pb-1 text-[11px] text-muted-foreground sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_3.5rem]">
            <span>원본 기록</span>
            <svg width="100%" height={16} className="block" aria-hidden="true">
              <text x={tx(CUTOFF)} y={12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#2563eb">
                10:00
              </text>
            </svg>
            <span className="text-right">판정</span>
          </div>
          {RECORDS.map((record) => {
            const removed = record.out > 0 && record.out <= active;
            const removedNow = record.out > 0 && record.out === active;
            const color = removed ? "#94a3b8" : record.out === 0 && active === 4 ? "#2563eb" : "#475569";
            return (
              <div
                key={record.name}
                className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_2.75rem] items-center gap-2 border-b border-border/60 py-1 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)_3.5rem]"
              >
                <span className={`min-w-0 break-keep text-xs leading-4 ${removed ? "text-muted-foreground/60 line-through" : ""}`}>
                  {record.name}
                  <span className="ml-1 hidden text-[10px] text-muted-foreground sm:inline">
                    {record.tag}
                    {record.assumed ? " · 가정" : ""}
                  </span>
                </span>
                <svg width="100%" height={22} className="block" role="img" aria-label={`${record.name}: 사건과 도착 시각`}>
                  <line x1={`${PAD}%`} x2={`${100 - PAD}%`} y1={11} y2={11} stroke="#e2e8f0" strokeWidth={1} />
                  <line x1={tx(CUTOFF)} x2={tx(CUTOFF)} y1={0} y2={22} stroke="#2563eb" strokeWidth={1} />
                  <line x1={tx(record.event)} x2={tx(record.arrive)} y1={11} y2={11} stroke={color} strokeWidth={1.25} />
                  <circle cx={tx(record.event)} cy={11} r={4} fill="#ffffff" stroke={color} strokeWidth={1.25} />
                  <circle cx={tx(record.arrive)} cy={11} r={4} fill={color} />
                </svg>
                <span
                  className={`text-right text-[11px] font-bold ${
                    removedNow ? "text-red-700 dark:text-red-400" : removed ? "text-muted-foreground/60" : record.out === 0 && active === 4 ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {removed ? `제외${OUT_LABEL[record.out]}` : active === 0 ? "후보" : active === 4 ? "사용" : "통과"}
                </span>
              </div>
            );
          })}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="3.5" fill="#ffffff" stroke="#475569" strokeWidth={1.25} /></svg>
              사건 시각
            </span>
            <span className="inline-flex items-center gap-1">
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><circle cx="5" cy="5" r="4" fill="#475569" /></svg>
              도착 시각
            </span>
            <span className="hidden sm:inline">축 09:30–10:30 · 세로선 입력 마감</span>
            <span>남은 {RECORDS.filter((record) => !(record.out > 0 && record.out <= active)).length}개</span>
          </div>
        </div>
      )}
    />
  );
}
