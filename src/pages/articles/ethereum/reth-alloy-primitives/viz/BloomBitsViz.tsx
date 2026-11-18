import SceneShell from "./AlloySceneShell";

/**
 * 본문 대응: #bytes-bloom — 2,048비트 bitmap에 항목마다 11비트 위치 세 곳을 켜고, 조회 때 세 곳을 확인한다.
 * 위치 번호는 모두 설명용 가정이다. 실제 위치는 address·topic의 Keccak-256 digest에서 정해진다.
 * C: 세 곳 중 하나가 0 → 없음 확정. D: A·B가 켠 비트와 우연히 겹쳐 셋 다 1 → 후보일 뿐, log 원문 확인.
 */
const COLS = 64;
const ROWS = 32; // 64 × 32 = 2,048비트
const CELL = 5;
const W = COLS * CELL + 20;
const H = ROWS * CELL + 12;
const OX = 10;
const OY = 6;

const A: readonly number[] = [210, 1105, 1830];
const B: readonly number[] = [470, 1320, 1700];
const C: readonly number[] = [210, 905, 1700];
const D: readonly number[] = [1105, 1320, 1700];

const OFF = "#e2e8f0";
const ON = "#64748b";
const ACCENT = "#2563eb";
const BAD = "#dc2626";
const WARN = "#d97706";

type Scene = {
  label: string;
  summary: string;
  set: readonly number[];
  added: readonly number[];
  query: readonly number[] | null;
  item: string;
  verdict: string;
  verdictColor: string;
  note: string;
};

const SCENES: readonly Scene[] = [
  { label: "빈 bitmap", summary: "2,048비트 · 전부 0", set: [], added: [], query: null, item: "아직 없음", verdict: "켜진 비트 0개", verdictColor: ON, note: "Ethereum log bloom은 2,048비트 한 장입니다. 작은 칸 하나가 비트 하나이고, 처음에는 모두 0입니다." },
  { label: "항목 A를 넣기", summary: "비트 3개를 1로", set: [], added: A, query: null, item: "A (address 또는 topic)", verdict: "켜진 비트 3개", verdictColor: ACCENT, note: "넣을 항목의 Keccak-256 digest에서 11비트 위치 세 개를 고릅니다. 11비트는 0부터 2,047까지라 bitmap 어디든 가리킬 수 있습니다. 그 세 칸을 1로 켭니다." },
  { label: "항목 B도 넣기", summary: "비트 6개가 1", set: A, added: B, query: null, item: "B", verdict: "켜진 비트 6개", verdictColor: ACCENT, note: "다른 항목도 같은 방식으로 세 칸을 켭니다. 어느 칸을 누가 켰는지는 bitmap에 남지 않고 1이라는 사실만 남습니다." },
  { label: "C 조회 · 하나가 0", summary: "없음 확정", set: [...A, ...B], added: [], query: C, item: "C (넣은 적 없음)", verdict: "905번이 0 → 넣은 적 없음", verdictColor: BAD, note: "조회할 항목의 세 위치를 확인합니다. 210번과 1,700번은 A·B 때문에 1이지만 905번이 0입니다. 넣었다면 이 칸도 켜졌어야 하므로 C는 확실히 없습니다." },
  { label: "D 조회 · 셋 다 1", summary: "후보일 뿐", set: [...A, ...B], added: [], query: D, item: "D (넣은 적 없음)", verdict: "셋 다 1 → 후보 · log 원문 확인", verdictColor: WARN, note: "D의 세 위치는 A와 B가 켠 칸과 우연히 겹쳐 모두 1입니다. D는 넣은 적이 없는데도 통과합니다. 그래서 positive는 후보일 뿐이고 실제 receipt·log를 다시 읽어야 합니다." },
];

function pos(bit: number) {
  return { x: OX + (bit % COLS) * CELL, y: OY + Math.floor(bit / COLS) * CELL };
}

export default function BloomBitsViz() {
  return (
    <SceneShell
      eyebrow="Log bloom · 세 비트로 거르기"
      title="Bloom 조회에서 0 하나는 부재를 확정하지만, 1 세 개는 존재를 확정하지 못합니다"
      description="작은 칸 64 × 32 = 2,048개가 bitmap의 비트입니다. 파란 칸은 이번에 켠 비트, 회색 칸은 이미 켜진 비트이고, 조회한 위치의 테두리는 그 비트가 1이면 주황, 0이면 빨강입니다. 항목 A·B·C·D와 위치 번호는 설명용 가정이며 실제 위치는 각 항목의 Keccak-256 digest가 정합니다."
      ariaLabel="2048비트 log bloom에 두 항목을 넣고 두 항목을 조회해 부재 확정과 거짓 양성을 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const on = new Set<number>([...scene.set, ...scene.added]);
        const added = new Set<number>(scene.added);
        const query = scene.query ?? [];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Array.from({ length: COLS * ROWS }, (_, bit) => {
                const p = pos(bit);
                const lit = on.has(bit);
                return <rect key={bit} x={p.x + 0.5} y={p.y + 0.5} width={CELL - 1} height={CELL - 1} fill={lit ? (added.has(bit) ? ACCENT : ON) : OFF} />;
              })}
              {query.map((bit) => {
                const p = pos(bit);
                const hit = on.has(bit);
                return <rect key={`q-${bit}`} x={p.x - 2} y={p.y - 2} width={CELL + 4} height={CELL + 4} fill="none" stroke={hit ? WARN : BAD} strokeWidth={1.25} />;
              })}
              {scene.added.map((bit) => {
                const p = pos(bit);
                return <rect key={`a-${bit}`} x={p.x - 2} y={p.y - 2} width={CELL + 4} height={CELL + 4} fill="none" stroke={ACCENT} strokeWidth={1.25} />;
              })}
            </svg>
            <p className="mt-3 text-xs leading-5">
              <span className="font-semibold">{scene.item}</span>
              <span className="font-mono text-muted-foreground">
                {" · "}
                {(scene.query ?? scene.added).length === 0
                  ? "위치 없음"
                  : (scene.query ?? scene.added).map((bit) => `${bit.toLocaleString("en-US")}번=${on.has(bit) ? 1 : 0}`).join(" · ")}
              </span>
            </p>
            <p className="mt-1 text-xs font-bold leading-5" style={{ color: scene.verdictColor }}>{scene.verdict}</p>
          </div>
        );
      }}
    />
  );
}
