import StoryShell from "./StoryShell";

/**
 * 본문 대응: RoundtripFloor.tsx — "살아남은 수치와 죽은 수치가 갈립니다".
 * 실측: kontext 기록 2.8 · 바닥 2.75, qwen_edit 기록 0.6 · 바닥 0.60 (/255, 전신 프레임).
 * 2.8 − 2.75 = 0.05, 0.6 − 0.60 = 0.00, 기록 차 2.2 중 바닥 차 2.15.
 */
const FLOOR = "#f59e0b";
const MODEL = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";
const INK = "#475569";

const ROWS = [
  { n: "kontext", rec: 2.8, floor: 2.75 },
  { n: "qwen_edit", rec: 0.6, floor: 0.6 },
] as const;

const LEFT = 78;
const SPAN = 250;
const BAR = (v: number) => (v / 3) * SPAN;
const recGap = ROWS[0].rec - ROWS[1].rec;
const floorGap = ROWS[0].floor - ROWS[1].floor;

const SCENES = [
  {
    label: "기록값의 구성",
    summary: "기록값 = 바닥값 + 모델이 한 일",
    note: "마스크 밖 기록값에는 오토인코더 왕복만으로 생기는 바닥값과 모델이 실제로 바꾼 양이 섞여 있습니다. kontext는 2.8 중 2.75가 바닥값이고 남는 것은 0.05입니다.",
  },
  {
    label: "모델끼리 비교",
    summary: `기록 차 ${recGap.toFixed(1)} 중 ${floorGap.toFixed(2)}가 바닥값 차`,
    note: "두 모델의 기록값을 나란히 놓으면 차이의 거의 전부가 어느 오토인코더를 로드하는지에서 옵니다. 그래서 모델 간 침범 비교는 전부 무효가 됩니다.",
  },
  {
    label: "같은 모델 · 같은 소스 두 번",
    summary: "(바닥 + a) − (바닥 + b) = a − b",
    note: "같은 모델과 같은 소스로 두 번 돌리면 바닥값이 양쪽에 똑같이 들어가 빼는 순간 상쇄됩니다. 그래서 차이를 보는 값은 살아남습니다.",
  },
  {
    label: "바닥 항이 없는 값",
    summary: "마스크 안 · 오토인코더 없는 제거 모델",
    note: "본문 기준으로 바닥값은 마스크 밖에만 해당하므로 마스크 안 변화량은 그대로 삽니다. 오토인코더를 거치지 않는 제거 모델의 수치도 바닥 항이 없어 그대로입니다.",
  },
] as const;

function Bars({ showGap }: { showGap: boolean }) {
  return (
    <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={showGap ? "두 모델의 기록값 차이와 바닥값 차이" : "기록값을 바닥값과 모델 기여로 나눈 막대"}>
      <rect x={LEFT} y={12} width={10} height={10} fill={FLOOR} fillOpacity={0.4} stroke={FLOOR} strokeWidth={1} />
      <text x={LEFT + 15} y={21} fontSize={12} fill={INK}>왕복 바닥값</text>
      <rect x={LEFT + 100} y={12} width={10} height={10} fill={MODEL} fillOpacity={0.6} stroke={MODEL} strokeWidth={1} />
      <text x={LEFT + 115} y={21} fontSize={12} fill={INK}>남는 양</text>
      {ROWS.map((r, i) => {
        const y = 46 + i * 42;
        const rest = r.rec - r.floor;
        return (
          <g key={r.n}>
            <text x={LEFT - 8} y={y + 13} textAnchor="end" fontSize={12} fontWeight={700} fill={INK}>{r.n}</text>
            <rect x={LEFT} y={y} width={BAR(r.floor)} height={18} fill={FLOOR} fillOpacity={0.4} stroke={FLOOR} strokeWidth={1} />
            {rest > 0 && <rect x={LEFT + BAR(r.floor)} y={y} width={Math.max(BAR(rest), 2)} height={18} fill={MODEL} fillOpacity={0.6} stroke={MODEL} strokeWidth={1} />}
            <text x={LEFT} y={y + 31} fontSize={12} fill={INK}>
              {r.rec.toFixed(1)} = {r.floor.toFixed(2)} + {rest.toFixed(2)}
            </text>
          </g>
        );
      })}
      {showGap && (
        <g>
          <line x1={LEFT + BAR(ROWS[1].floor)} x2={LEFT + BAR(ROWS[1].floor)} y1={124} y2={136} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
          <line x1={LEFT + BAR(ROWS[0].floor)} x2={LEFT + BAR(ROWS[0].floor)} y1={66} y2={136} stroke={WARN} strokeWidth={1} strokeDasharray="3 3" />
          <line x1={LEFT + BAR(ROWS[1].floor)} x2={LEFT + BAR(ROWS[0].floor)} y1={136} y2={136} stroke={WARN} strokeWidth={1} />
          <text x={LEFT + (BAR(ROWS[1].floor) + BAR(ROWS[0].floor)) / 2} y={152} textAnchor="middle" fontSize={12} fontWeight={700} fill={WARN}>
            바닥값 차 {floorGap.toFixed(2)} (기록 차 {recGap.toFixed(1)})
          </text>
        </g>
      )}
      {!showGap && (
        <text x={180} y={150} textAnchor="middle" fontSize={12} fill={MUTED}>단위 /255 · 전신 프레임 실측</text>
      )}
    </svg>
  );
}

function Block({ label, tone }: { label: string; tone: "floor" | "model" }) {
  const color = tone === "floor" ? FLOOR : MODEL;
  return (
    <span className="inline-flex min-h-8 items-center justify-center rounded-md border px-2 text-xs font-bold" style={{ borderColor: color, color: tone === "floor" ? "#b45309" : "#047857" }}>
      {label}
    </span>
  );
}

function Cancel() {
  return (
    <div className="mx-auto max-w-[560px] space-y-3 text-sm">
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2">
        <span className="text-xs text-muted-foreground">1회차</span>
        <div className="flex flex-wrap gap-1"><Block label="바닥값" tone="floor" /><Block label="a" tone="model" /></div>
      </div>
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2">
        <span className="text-xs text-muted-foreground">2회차</span>
        <div className="flex flex-wrap gap-1"><Block label="바닥값" tone="floor" /><Block label="b" tone="model" /></div>
      </div>
      <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] items-center gap-2 border-t border-border pt-3">
        <span className="text-xs font-bold">차이</span>
        <div className="flex flex-wrap items-center gap-1">
          <span className="inline-flex min-h-8 items-center rounded-md border border-dashed px-2 text-xs text-muted-foreground line-through" style={{ borderColor: FLOOR }}>바닥값 − 바닥값</span>
          <span className="text-xs">+</span>
          <Block label="a − b" tone="model" />
        </div>
      </div>
      <p className="text-xs leading-5 text-muted-foreground">a와 b는 각 회차에서 모델이 실제로 바꾼 양입니다. 같은 오토인코더 · 같은 소스라 두 바닥값이 같습니다. a와 b의 크기는 본문에 없어 칸 크기로 정하지 않았습니다.</p>
    </div>
  );
}

function NoFloor() {
  const items = [
    { n: "마스크 안 변화량", why: "바닥값은 마스크 밖에만 해당", ok: true },
    { n: "오토인코더 없는 제거 모델", why: "압축·복원을 거치지 않음", ok: true },
    { n: "모델 간 마스크 밖 침범 비교", why: "바닥값이 오토인코더마다 다름", ok: false },
  ];
  return (
    <ul className="mx-auto max-w-[560px] space-y-2 text-sm">
      {items.map((item) => (
        <li key={item.n} className="grid grid-cols-[3.5rem_minmax(0,1fr)] items-start gap-2 border-b border-border pb-2">
          <span className="text-xs font-bold" style={{ color: item.ok ? "#047857" : "#b91c1c" }}>{item.ok ? "생존" : "무효"}</span>
          <span className="min-w-0">
            <strong className="block text-sm">{item.n}</strong>
            <span className="block text-xs text-muted-foreground">{item.why}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function FloorSurvivalViz() {
  return (
    <StoryShell
      eyebrow="살아남는 수치"
      title="바닥값이 들어가는 방식이 수치의 생사를 가릅니다"
      description="바닥값은 샘플링·프롬프트·마스크 없이 오토인코더로 인코딩과 디코딩만 했을 때 마스크 밖 픽셀이 변하는 양입니다. 각 수치에 이 항이 어떻게 들어가는지 따라갑니다."
      note="막대 수치는 2026-09-11 한 장비의 실측이며 기록값은 소수 첫째 자리까지 적혀 있습니다."
      ariaLabel="오토인코더 바닥값이 모델 비교는 무효로 만들고 차이 값과 마스크 안 값은 남기는 이유"
      scenes={SCENES}
      render={(index) =>
        index <= 1 ? <Bars showGap={index === 1} /> : index === 2 ? <Cancel /> : <NoFloor />
      }
    />
  );
}
