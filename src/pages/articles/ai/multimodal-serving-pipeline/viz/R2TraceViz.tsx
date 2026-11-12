import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — R2(같은 사진 P + 질문 B)가 encoder를 건너뛰는 경로.
 * 자리 배치: 글 0–14, 사진 시작 15, 사진 P 16–1,384, 사진 끝 1,385, 질문 1,386–1,405 (합 1,406).
 * prefix hit 86 block = 1,376 token(0–1,375). 남은 30 token(1,376–1,405) 중 사진은 1,376–1,384의 9칸.
 */
const TOTAL = 1406;
const IMG_START = 16;
const IMG_END = 1384;
const END_MARK = 1385;
const HIT = 1376;
const ZOOM_FROM = 1368;
const ZOOM_TO = 1405;
const ZOOM_CELLS = ZOOM_TO - ZOOM_FROM + 1;

const W = 360;
const L = 12;
const R = 348;
const px = (pos: number) => L + (pos / TOTAL) * (R - L);
const CELL_W = (R - L) / ZOOM_CELLS;
const cx = (pos: number) => L + (pos - ZOOM_FROM) * CELL_W;

const COMPONENTS = ["입구 processor (CPU)", "prefix cache 조회", "encoder cache 조회", "모델 실행 (GPU)"] as const;

const SCENES = [
  {
    label: "입구: 같은 사진은 같은 자리",
    summary: "mm hash P · 자리 16–1,384",
    active: [0],
    hit: false,
    need: false,
    fill: false,
    reencode: false,
    values: ["—", "—", "—", "—"],
    note: "processor가 P의 픽셀로 mm hash를 계산하고 문장에 빈자리 1,369개를 만듭니다. R1과 같은 사진이라 자리도 같은 16–1,384입니다.",
  },
  {
    label: "prefix cache: 앞 86 block hit",
    summary: "0–1,375 재사용",
    active: [1],
    hit: true,
    need: false,
    fill: false,
    reencode: false,
    values: ["1,376", "30", "—", "—"],
    note: "prefix cache는 앞 요청과 같은 앞부분의 KV를 다시 쓰는 장치입니다. 사진 block의 열쇠에 P의 mm hash가 있어 R1과 맞고, 꽉 찬 block 86개(1,376 token)가 hit입니다.",
  },
  {
    label: "남은 30 token 중 9칸이 사진",
    summary: "1,376–1,384에 KV가 없음",
    active: [1],
    hit: true,
    need: true,
    fill: false,
    reencode: false,
    values: ["1,376", "30", "9", "?"],
    note: "R2는 위치 1,376부터 계산합니다. 그 범위의 앞 9칸은 아직 KV가 없는 사진 P의 마지막 자리라, 그 자리에 넣을 embedding이 필요합니다.",
  },
  {
    label: "encoder cache에 P가 있음",
    summary: "encoder 0회 · 9칸에 끼워 넣음",
    active: [2, 3],
    hit: true,
    need: true,
    fill: true,
    reencode: false,
    values: ["1,376", "30", "9", "0"],
    note: "scheduler가 encoder cache에서 P를 찾아 R2를 참조자로 등록하고 encoder를 건너뜁니다. 모델 실행 단계가 P의 embedding을 꺼내 9칸에 넣습니다.",
  },
  {
    label: "P가 이미 지워졌다면",
    summary: "9칸 때문에 1,369개를 다시 encode",
    active: [2, 3],
    hit: true,
    need: true,
    fill: true,
    reencode: true,
    values: ["1,376", "30", "9", "1,369"],
    note: "encoder는 사진을 한꺼번에 처리하므로 9칸을 채우려고 1,369개를 모두 다시 encode하고 encoder 예산도 1,369만큼 씁니다.",
  },
] as const;

const READOUT = ["prefix hit", "새로 계산할 token", "그중 사진 자리", "encoder로 만들 embedding"] as const;

function kindOf(pos: number) {
  if (pos >= IMG_START && pos <= IMG_END) return "image";
  if (pos === END_MARK || pos === IMG_START - 1) return "mark";
  return "text";
}

export default function R2TraceViz() {
  return (
    <SceneShell
      eyebrow="R2의 경로"
      title="R2는 앞 1,376 token을 재사용하고 사진의 마지막 9칸만 채웁니다"
      description="위 줄은 요청을 처리하는 순서이며 가운데 두 칸은 scheduler가 하는 조회입니다. 그 아래 띠는 R2의 1,406 token 전체, 아래 칸은 위치 1,368–1,405를 한 칸 한 token으로 키운 것입니다. 파랑은 prefix cache에서 찾은 KV, 주황 테두리는 embedding이 필요한 사진 자리, 주황 칸은 embedding을 넣은 자리입니다. 실선은 block 86개의 끝(1,376), 점선은 block 87개의 끝(1,392)입니다."
      note="글 15, 사진 시작 1, 사진 1,369, 사진 끝 1, 질문 20으로 둔 4절의 요청이고 block은 16 token입니다. (가정)"
      ariaLabel="같은 사진을 보낸 R2가 prefix cache와 encoder cache를 거쳐 사진 마지막 9칸만 채우는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid gap-4">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COMPONENTS.map((name, index) => {
                const on = (scene.active as readonly number[]).includes(index);
                return (
                  <li key={name} className={`rounded-lg border px-2 py-1 text-center text-xs leading-5 ${on ? "border-primary bg-primary/10 font-bold" : "border-border text-muted-foreground"}`}>
                    {name}
                  </li>
                );
              })}
            </ol>
            <svg viewBox={`0 0 ${W} 122`} className="mx-auto w-full max-w-[22rem] text-foreground" role="img" aria-label="R2의 token 위치와 재사용 범위">
              <rect x={px(0)} y={4} width={px(IMG_START) - px(0)} height={18} fill="#cbd5e1" />
              <rect x={px(IMG_START)} y={4} width={px(IMG_END + 1) - px(IMG_START)} height={18} fill={scene.reencode ? "#fde68a" : "#fef3c7"} stroke={scene.reencode ? "#b45309" : "#d97706"} strokeWidth={scene.reencode ? 1.25 : 1} />
              <rect x={px(IMG_END + 1)} y={4} width={px(TOTAL) - px(IMG_END + 1)} height={18} fill="#cbd5e1" />
              {scene.hit && <rect x={px(0)} y={4} width={px(HIT) - px(0)} height={18} fill="#2563eb" fillOpacity={0.55} />}
              <text x={(px(IMG_START) + px(IMG_END)) / 2} y={17} fontSize={12} textAnchor="middle" fill="#1e293b">
                {scene.reencode ? "사진 P 1,369칸 전체를 다시 encode" : "사진 P · 16–1,384"}
              </text>
              <text x={L} y={36} fontSize={12} fill="#64748b">
                0
              </text>
              <text x={R} y={36} fontSize={12} textAnchor="end" fill="#64748b">
                1,405
              </text>
              <line x1={px(ZOOM_FROM)} y1={24} x2={L} y2={50} stroke="#94a3b8" strokeWidth={1} />
              <line x1={px(ZOOM_TO + 1)} y1={24} x2={R} y2={50} stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: ZOOM_CELLS }, (_, i) => {
                const pos = ZOOM_FROM + i;
                const kind = kindOf(pos);
                const hit = scene.hit && pos < HIT;
                const need = scene.need && kind === "image" && pos >= HIT;
                const filled = need && scene.fill;
                const base = kind === "image" ? "#fef3c7" : kind === "mark" ? "#94a3b8" : "#e2e8f0";
                const fill = hit ? "#2563eb" : filled ? "#d97706" : base;
                return (
                  <rect
                    key={pos}
                    x={cx(pos) + 0.5}
                    y={54}
                    width={CELL_W - 1}
                    height={26}
                    fill={fill}
                    fillOpacity={hit ? 0.75 : 1}
                    stroke={need ? "#b45309" : "none"}
                    strokeWidth={need ? 1.25 : 0}
                  />
                );
              })}
              <line x1={cx(HIT)} y1={48} x2={cx(HIT)} y2={86} stroke="currentColor" strokeWidth={1} />
              <line x1={cx(1392)} y1={48} x2={cx(1392)} y2={86} stroke="currentColor" strokeWidth={1} strokeDasharray="3 2" />
              <text x={L} y={100} fontSize={12} fill="#64748b">
                1,368
              </text>
              <text x={cx(HIT)} y={100} fontSize={12} textAnchor="middle" fill="currentColor">
                1,376
              </text>
              <text x={cx(1392)} y={100} fontSize={12} textAnchor="middle" fill="currentColor">
                1,392
              </text>
              <text x={cx(HIT)} y={117} fontSize={12} fill="#d97706">
                사진 9칸
              </text>
              <text x={R} y={117} fontSize={12} textAnchor="end" fill="#64748b">
                사진 끝 1 + 질문 20
              </text>
            </svg>
            <p className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {READOUT.map((name, index) => (
                <span key={name}>
                  {name}{" "}
                  <span className={`font-mono text-sm font-bold ${index === 3 && scene.reencode ? "text-red-700 dark:text-red-400" : "text-foreground"}`}>{scene.values[index]}</span>
                </span>
              ))}
            </p>
          </div>
        );
      }}
    />
  );
}
