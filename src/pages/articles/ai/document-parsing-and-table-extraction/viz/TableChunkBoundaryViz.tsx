import SceneShell from "./SceneShell";

/**
 * 본문 대응: #metadata-and-chunking — 고정 길이 경계가 표를 가르면 뒤 chunk의 숫자는 열 이름을 잃는다.
 * 매출 행은 글의 예이고, 비용·이익·인원 행과 경계 위치는 "행 절반"을 보이려는 예시다(가정).
 */
const WARN = "#dc2626";
const ACCENT = "#6366f1";

const ROWS: readonly { name: string; q1: number; q2: number }[] = [
  { name: "매출", q1: 120, q2: 150 },
  { name: "비용", q1: 80, q2: 90 },
  { name: "이익", q1: 40, q2: 60 },
  { name: "인원", q1: 12, q2: 13 },
];

const HEADER = "| 지표 | 2024 Q1 | 2024 Q2 |";
const mdRow = (r: { name: string; q1: number; q2: number }) => `| ${r.name} | ${r.q1} | ${r.q2} |`;
const rowLevel = (r: { name: string; q1: number; q2: number }) => `${r.name}: 2024 Q1=${r.q1}, 2024 Q2=${r.q2}`;

const SCENES = [
  {
    label: "일반 규칙으로 자르면",
    summary: "뒤 chunk에 열 이름 없음",
    note: "고정 길이 512 token 규칙을 그대로 쓰면 헤더는 앞 chunk에 남고 데이터 행 절반은 다음 chunk로 넘어갑니다. 뒤 chunk만 읽는 검색은 40과 60이 무슨 열인지 알 수 없습니다.",
  },
  {
    label: "표를 통째로 두면",
    summary: "헤더와 행이 한 chunk",
    note: "Structure-preserving chunking의 한 가지 방법은 표를 통째로 한 chunk에 두는 것입니다. 경계가 표 안을 지나가지 않습니다.",
  },
  {
    label: "쪼개야 하면 행마다 헤더",
    summary: "조각마다 뜻이 남음",
    note: "row-level representation처럼 행마다 열 이름을 반복하면 어느 조각을 떼어 읽어도 값의 뜻이 남습니다. 대신 같은 이름이 행마다 반복돼 전체 크기는 markdown보다 커집니다.",
  },
  {
    label: "최대 크기를 넘는 표",
    summary: "TableChunk로만 분할",
    note: "Unstructured의 chunking 전략은 표 요소를 다른 요소와 합치지 않고, 최대 크기를 넘으면 표 전용 TableChunk로만 나눕니다. 그림의 조각 수는 예시입니다(가정).",
  },
] as const;

function Chunk({ title, lines, danger = false, warn }: { title: string; lines: readonly string[]; danger?: boolean; warn?: string }) {
  return (
    <div className="min-w-0 rounded-lg border bg-background p-3" style={danger ? { borderColor: WARN } : undefined}>
      <p className="text-xs font-bold" style={{ color: danger ? WARN : ACCENT }}>
        {title}
      </p>
      <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-xs leading-5">{lines.join("\n")}</pre>
      {warn && (
        <p className="mt-1 text-xs font-bold leading-5" style={{ color: WARN }}>
          {warn}
        </p>
      )}
    </div>
  );
}

function Boundary({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 py-2 text-xs font-bold" style={{ color: WARN }}>
      <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: WARN }} />
      {label}
      <span className="h-px flex-1 border-t border-dashed" style={{ borderColor: WARN }} />
    </div>
  );
}

function Region({ label, tone = "body" }: { label: string; tone?: "body" | "table" }) {
  return (
    <div
      className={`min-w-0 rounded-lg border p-3 text-center text-xs font-bold leading-5 ${tone === "table" ? "" : "border-border bg-background text-muted-foreground"}`}
      style={tone === "table" ? { borderColor: ACCENT, color: ACCENT, backgroundColor: `${ACCENT}14` } : undefined}
    >
      {label}
    </div>
  );
}

function Scene({ active }: { active: number }) {
  if (active === 0) {
    return (
      <div className="min-w-0">
        <Chunk title="앞 chunk" lines={[HEADER, mdRow(ROWS[0]), mdRow(ROWS[1])]} />
        <Boundary label="512 token 경계" />
        <Chunk title="뒤 chunk" lines={[mdRow(ROWS[2]), mdRow(ROWS[3])]} danger warn="헤더가 없어 숫자의 열을 알 수 없음" />
      </div>
    );
  }
  if (active === 1) {
    return <Chunk title="chunk 하나" lines={[HEADER, ...ROWS.map(mdRow)]} />;
  }
  if (active === 2) {
    return (
      <div className="min-w-0">
        <Chunk title="앞 조각" lines={ROWS.slice(0, 2).map(rowLevel)} />
        <Boundary label="조각 경계" />
        <Chunk title="뒤 조각" lines={ROWS.slice(2).map(rowLevel)} />
      </div>
    );
  }
  return (
    <div className="grid min-w-0 gap-2">
      <Region label="본문 요소" />
      <div className="grid grid-cols-2 gap-2">
        <Region label="TableChunk 1" tone="table" />
        <Region label="TableChunk 2" tone="table" />
      </div>
      <Region label="본문 요소" />
      <p className="text-xs leading-5 text-muted-foreground">표 조각은 앞뒤 본문과 한 chunk로 합쳐지지 않습니다. 이 규칙은 섞지 않는다는 뜻이며, 조각마다 헤더가 반복된다는 뜻까지 담지는 않습니다.</p>
    </div>
  );
}

export default function TableChunkBoundaryViz() {
  return (
    <SceneShell
      eyebrow="Structure-preserving chunking"
      title="경계가 표를 가르면 뒤 조각의 숫자가 뜻을 잃습니다"
      description="chunk는 검색과 LLM 입력을 위해 잘라 낸 텍스트 조각이고, token은 그 길이를 재는 단위입니다. 매출 행 외의 값과 경계 위치는 예시입니다(가정)."
      ariaLabel="512 token 경계가 표를 나눌 때와 구조를 보존할 때 비교"
      scenes={SCENES}
      render={(active) => <Scene active={active} />}
    />
  );
}
