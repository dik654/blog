import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 곡물 100바구니의 설명용 배급(가정). 칸 하나가 한 바구니다.
 * 40 + 20 + 15 + 10 + 15 = 100. 서기관이 노동자 배급을 40이 아니라 30으로 적으면
 * 장부에는 10이 남고(100 − 90) 노동자에게는 10이 부족하다(40 − 30).
 */
const PARTS: readonly { mark: string; name: string; value: number; color: string }[] = [
  { mark: "노", name: "농민·노동자 배급", value: 40, color: "#2563eb" },
  { mark: "장", name: "장인", value: 20, color: "#7c3aed" },
  { mark: "사", name: "사원·의례", value: 15, color: "#0f766e" },
  { mark: "관", name: "관리·전령", value: 10, color: "#d97706" },
  { mark: "비", name: "흉년과 파종 비축", value: 15, color: "#16a34a" },
];

const CELLS = PARTS.flatMap((part, partIndex) => Array.from({ length: part.value }, () => partIndex));
const RECORDED = 30;

const SCENES = [
  { label: "창고에 곡물 100바구니", summary: "100", shown: 0, gap: false, note: "칸 하나가 곡물 한 바구니입니다. 다섯 몫은 설명용 가정이고 특정 도시의 실측 배급표가 아닙니다." },
  { label: "농민·노동자 배급", summary: "40", shown: 1, gap: false, note: "가장 큰 몫 40이 농민과 노동자에게 갑니다." },
  { label: "장인", summary: "40 + 20 = 60", shown: 2, gap: false, note: "농사 밖의 일을 하는 장인에게 20을 배급합니다." },
  { label: "사원·의례", summary: "60 + 15 = 75", shown: 3, gap: false, note: "사원과 의례에 15가 갑니다." },
  { label: "관리·전령", summary: "75 + 10 = 85", shown: 4, gap: false, note: "관리와 전령(소식과 문서를 나르는 사람)에게 10이 갑니다." },
  { label: "흉년과 파종 비축", summary: "85 + 15 = 100", shown: 5, gap: false, note: "남은 15는 흉년과 다음 파종을 위해 비축합니다. 합은 100이지만 오늘 먹는 양, 공공 의무, 다음 계절의 권리가 섞여 있습니다." },
  { label: "노동자 배급을 30으로 적으면", summary: "40 − 30 = 10", shown: 5, gap: true, note: "서기관이 40이 아니라 30으로 기록하면 점선 칸 10이 장부에는 남은 것으로 보이고, 노동자에게는 부족으로 돌아옵니다. 잘못인지 횡령인지 단위 차이인지 가리려면 계량 표준·인장·다른 증인·재판 절차가 필요합니다." },
] as const;

const COLS = 10;
const ROWS = 10;
const CELL = 18;
const GAP = 2;

export default function RationSplitViz() {
  return (
    <SceneShell
      eyebrow="설명용 배급 장부"
      title="곡물 100바구니를 다섯 몫으로 나눕니다"
      description="칸 하나가 한 바구니입니다. 몫의 크기는 설명용 가정이며, 칸 안 글자는 아래 목록 왼쪽 표시와 같습니다."
      ariaLabel="곡물 100바구니가 노동자, 장인, 사원, 관리와 전령, 비축으로 나뉘고 노동자 배급이 30으로 잘못 기록될 때 생기는 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] sm:items-start sm:gap-6">
            <svg viewBox={`0 0 ${COLS * CELL + (COLS - 1) * GAP} ${ROWS * CELL + (ROWS - 1) * GAP}`} className="mx-auto h-auto w-full max-w-[15rem] text-foreground sm:max-w-none" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {CELLS.map((partIndex, index) => {
                const part = PARTS[partIndex];
                const lit = partIndex < scene.shown;
                const missing = scene.gap && partIndex === 0 && index >= RECORDED;
                const color = missing ? "#dc2626" : lit ? part.color : "#94a3b8";
                const x = (index % COLS) * (CELL + GAP);
                const y = Math.floor(index / COLS) * (CELL + GAP);
                return (
                  <g key={index}>
                    <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={color} fillOpacity={missing ? 0.06 : lit ? 0.22 : 0.08} stroke={color} strokeWidth={1} strokeDasharray={missing ? "3 2" : undefined} />
                    {lit ? <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={missing ? "#dc2626" : "currentColor"}>{missing ? "?" : part.mark}</text> : null}
                  </g>
                );
              })}
            </svg>
            <div className="min-w-0 space-y-3">
            <ul className="min-w-0 space-y-1 text-sm">
              {PARTS.map((part, partIndex) => (
                <li key={part.name} className={`grid grid-cols-[1.25rem_minmax(0,1fr)_4.5rem] items-center gap-2 ${partIndex < scene.shown ? "" : "opacity-35"}`}>
                  <span className="text-center text-xs font-bold" style={{ color: part.color }}>{part.mark}</span>
                  <span className="leading-5">{part.name}</span>
                  <span className="text-right font-mono font-bold">{scene.gap && partIndex === 0 ? `적힘 ${RECORDED}` : part.value}</span>
                </li>
              ))}
            </ul>
            <div className={`grid grid-cols-2 gap-2 text-sm ${scene.gap ? "" : "opacity-35"}`}>
              <div className="rounded-lg border border-dashed border-red-600/70 px-3 py-2">
                <span className="block text-xs text-muted-foreground">장부에서</span>
                <span className="font-semibold">남은 것처럼 보임 {scene.gap ? "10" : "0"}</span>
              </div>
              <div className="rounded-lg border border-dashed border-red-600/70 px-3 py-2">
                <span className="block text-xs text-muted-foreground">노동자에게</span>
                <span className="font-semibold">부족 {scene.gap ? "10" : "0"}</span>
              </div>
            </div>
            </div>
          </div>
        );
      }}
    />
  );
}
