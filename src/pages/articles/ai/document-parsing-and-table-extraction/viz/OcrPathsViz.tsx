import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ocr — 같은 스캔 표가 일반 OCR에서는 한 줄 문자열이 되고,
 * layout-aware OCR에서는 영역 좌표 → 문자 인식 → 좌표로 잇기 순서로 칸에 남는다.
 * 문자열 "2024 Q1 120 Q2 150"은 글의 예이고, 좌표와 오인식 128은 설명용 값이다(가정).
 */
const ACCENT = "#6366f1";
const WARN = "#dc2626";
const MUTED = "#64748b";

const CELLS: readonly { id: string; x: number; y: number; w: number; h: number; text: string; slot: string }[] = [
  { id: "①", x: 10, y: 10, w: 200, h: 34, text: "2024", slot: "상위 헤더" },
  { id: "②", x: 10, y: 50, w: 96, h: 34, text: "Q1", slot: "왼쪽 열 헤더" },
  { id: "③", x: 114, y: 50, w: 96, h: 34, text: "Q2", slot: "오른쪽 열 헤더" },
  { id: "④", x: 10, y: 90, w: 96, h: 34, text: "120", slot: "2024 · Q1 칸" },
  { id: "⑤", x: 114, y: 90, w: 96, h: 34, text: "150", slot: "2024 · Q2 칸" },
];

const SCENES = [
  {
    label: "일반 OCR",
    summary: "셀 경계 없는 한 줄",
    note: "일반 OCR은 문자열만 뽑고 그 문자가 어느 영역에 있었는지 버립니다. 문자열만으로는 120이 어느 열인지 알 수 없습니다. Unstructured의 ocr_only 전략도 layout 분석 없이 이미지 전체를 텍스트로만 읽습니다.",
  },
  {
    label: "1단계 · 영역부터 나눈다",
    summary: "글자 없이 좌표만",
    note: "Layout-aware OCR은 글자를 읽기 전에 layout parsing으로 영역을 나눕니다. bounding box는 영역을 둘러싼 사각형의 좌표입니다.",
  },
  {
    label: "2단계 · 좌표를 쥔 채 인식",
    summary: "칸마다 글자가 채워짐",
    note: "bounding box 좌표를 유지한 채 문자만 인식합니다. 글자마다 어느 칸에서 나왔는지가 함께 남습니다. Unstructured의 hi_res 전략이 이 순서로 동작합니다.",
  },
  {
    label: "3단계 · 좌표로 잇는다",
    summary: "120 → 2024 · Q1 칸",
    note: "인식된 텍스트를 원래 영역과 셀에 좌표로 이어 붙이면 120과 150이 각자의 열에 놓입니다. 한 줄 문자열에서는 알 수 없던 관계입니다.",
  },
  {
    label: "글자 오류는 별개",
    summary: "칸은 맞고 글자는 틀림",
    note: "Layout-aware OCR이 문자 인식 자체의 정확도를 높여 주지는 않습니다. 120을 128로 잘못 읽었다면(가정) 칸은 맞아도 값은 틀립니다. 두 문제는 원인이 달라 따로 풀어야 합니다.",
  },
] as const;

function Scan({ active }: { active: number }) {
  const boxes = active >= 1;
  return (
    <svg viewBox="0 0 220 134" role="img" aria-label="스캔된 표 이미지와 영역 상자" className="h-auto w-full">
      <rect x={1} y={1} width={218} height={132} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
      {CELLS.map((c, index) => {
        const wrong = active === 4 && c.text === "120";
        const hideText = active === 1;
        return (
          <g key={c.id}>
            {boxes && <rect x={c.x} y={c.y} width={c.w} height={c.h} fill={ACCENT} fillOpacity={0.08} stroke={wrong ? WARN : ACCENT} strokeWidth={1} strokeDasharray="4 3" />}
            {boxes && (
              <g>
                <circle cx={c.x + 10} cy={c.y + 10} r={7} fill="none" stroke={wrong ? WARN : ACCENT} strokeWidth={1} />
                <text x={c.x + 10} y={c.y + 13.5} textAnchor="middle" fontSize={10} fontWeight={700} fill={wrong ? WARN : ACCENT}>
                  {index + 1}
                </text>
              </g>
            )}
            <text x={c.x + c.w / 2} y={c.y + 23} textAnchor="middle" fontSize={13} fontWeight={600} fill={wrong ? WARN : MUTED} fillOpacity={hideText ? 0.35 : 1}>
              {c.text}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Output({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div className="min-w-0 rounded-lg border border-border bg-background p-3">
        <p className="text-xs font-bold text-muted-foreground">출력</p>
        <p className="mt-2 font-mono text-base font-bold">2024 Q1 120 Q2 150</p>
        <p className="mt-2 text-sm leading-6" style={{ color: WARN }}>120은 어느 열의 값일까요?</p>
      </div>
    );
  }
  return (
    <div className="min-w-0 rounded-lg border border-border bg-background p-3">
      <p className="text-xs font-bold text-muted-foreground">출력 · 좌표는 예시(가정)</p>
      <ul className="mt-2 space-y-1 font-mono text-xs leading-5">
        {CELLS.map((c) => {
          const wrong = active === 4 && c.text === "120";
          const shown = wrong ? "128" : c.text;
          return (
            <li key={c.id} className="flex flex-wrap justify-between gap-x-2">
              <span className="text-muted-foreground">
                {c.id} ({c.x},{c.y})
              </span>
              {active === 1 && <span className="text-muted-foreground">글자 아직 없음</span>}
              {active === 2 && <span className="font-bold">{c.text}</span>}
              {active >= 3 && (
                <span className="font-bold" style={wrong ? { color: WARN } : undefined}>
                  {shown} → {c.slot}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function OcrPathsViz() {
  return (
    <SceneShell
      eyebrow="OCR · layout-aware OCR"
      title="같은 스캔 표도 좌표를 남겨야 숫자의 열이 보입니다"
      description="그림은 스캔된 표 이미지이고, 출력 칸은 OCR이 내놓는 결과입니다. OCR(광학 문자 인식)은 이미지 속 문자를 텍스트로 바꾸는 기술입니다."
      ariaLabel="일반 OCR과 layout-aware OCR의 출력 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:items-center">
          <div className="mx-auto w-full max-w-[13rem] sm:mx-0 sm:max-w-xs">
            <Scan active={active} />
          </div>
          <Output active={active} />
        </div>
      )}
    />
  );
}
